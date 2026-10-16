import { compileInSandbox, runInSandbox, cleanupWorkDir } from "./dockerRunner.js";
import { classify } from "./errorClassification.js";
import { evaluateStdout, type ExpectedOutput } from "../evaluation.js";
import type { ErrorClassification } from "@atlas/shared-types";

export interface TestCaseSpec {
  id: string;
  isHidden: boolean;
  description: string;
  input: { stdin?: string } | null;
  expected: ExpectedOutput;
}

export interface TestCaseResult {
  testCaseId: string;
  isHidden: boolean;
  description: string;
  passed: boolean;
  actualStdout: string;
  actualStderr: string;
  errorClassification: ErrorClassification;
}

export interface EvaluationOutcome {
  overallStatus: "passed" | "failed" | "error" | "timeout";
  results: TestCaseResult[];
  // The first non-"none" classification encountered, used to drive the rung-0
  // message (GAME_DESIGN.md hint ladder) — never the AI, per DECISIONS.md D3.
  firstErrorClassification: ErrorClassification;
  firstErrorStderr: string;
}

/**
 * Compiles the submission once, then runs it once per test case (each test
 * case may supply different stdin — this is how a hidden test varies an input
 * without touching the student's source, per CURRICULUM.md level 3's design).
 * Evaluation is a deterministic stdout comparison (TESTING.md: never AI
 * judgment of correctness).
 */
export async function evaluateSubmission(code: string, testCases: TestCaseSpec[]): Promise<EvaluationOutcome> {
  const compile = await compileInSandbox(code);
  try {
    if (!compile.success) {
      const classification = classify({
        compileExitCode: compile.timedOut ? 0 : 1,
        compileStderr: compile.stderr,
        runExitCode: null,
        runStderr: "",
        timedOut: compile.timedOut,
      });
      return {
        overallStatus: compile.timedOut ? "timeout" : "error",
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          isHidden: tc.isHidden,
          description: tc.description,
          passed: false,
          actualStdout: "",
          actualStderr: compile.stderr,
          errorClassification: classification,
        })),
        firstErrorClassification: classification,
        firstErrorStderr: compile.stderr,
      };
    }

    const results: TestCaseResult[] = [];
    let firstErrorClassification: ErrorClassification = "none";
    let firstErrorStderr = "";

    for (const tc of testCases) {
      const run = await runInSandbox(compile.workDir, tc.input?.stdin ?? null);
      const classification = classify({
        compileExitCode: 0,
        compileStderr: "",
        runExitCode: run.timedOut ? null : run.exitCode,
        runStderr: run.stderr,
        timedOut: run.timedOut,
      });

      const passed = classification === "none" && evaluateStdout(run.stdout, tc.expected);

      if (classification !== "none" && firstErrorClassification === "none") {
        firstErrorClassification = classification;
        firstErrorStderr = run.stderr;
      }

      results.push({
        testCaseId: tc.id,
        isHidden: tc.isHidden,
        description: tc.description,
        passed,
        actualStdout: run.stdout,
        actualStderr: run.stderr,
        errorClassification: classification,
      });
    }

    const allPassed = results.every((r) => r.passed);
    const anyTimedOut = results.some((r) => r.errorClassification === "timeout");
    const overallStatus = allPassed ? "passed" : anyTimedOut ? "timeout" : "failed";

    return { overallStatus, results, firstErrorClassification, firstErrorStderr };
  } finally {
    await cleanupWorkDir(compile.workDir);
  }
}
