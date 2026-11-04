import { describe, it, expect } from "vitest";
import { execSync, spawnSync } from "node:child_process";
import { evaluateSubmission, type TestCaseSpec } from "../src/execution/evaluateSubmission.js";
import { compileInSandbox, runInSandbox, cleanupWorkDir } from "../src/execution/dockerRunner.js";
import { checkRequirements, isAnswerCorrect } from "../src/evaluation.js";
import { REALMS } from "../src/content/index.js";
import type { ChallengeDef } from "../src/content/types.js";

// Curriculum validation tests (TESTING.md), run against the REAL Docker
// sandbox (not mocked, per TESTING.md's "code-execution tests" guidance):
//   - every trial's reference solution passes all visible + hidden tests and
//     its code requirements; every documented wrong answer fails;
//   - every runnable lesson example compiles and runs cleanly;
//   - every "what does this print?" answer key matches what Java really prints.
// Requires Docker running and the atlas-java-sandbox image built (see
// docs/engineering/DEVELOPMENT_SETUP.md). Skips with a clear message if either
// prerequisite is missing, rather than silently reporting false coverage.
//
// This check must run synchronously at module-evaluation time, not inside a
// beforeAll — `describe.runIf`'s condition is read while the file is being
// collected, before any lifecycle hook has a chance to run.
function checkDockerReady(): boolean {
  try {
    execSync("docker info", { stdio: "ignore" });
    const img = spawnSync("docker", ["image", "inspect", process.env.SANDBOX_IMAGE ?? "atlas-java-sandbox"], { stdio: "ignore" });
    return img.status === 0;
  } catch {
    return false;
  }
}

const dockerReady = checkDockerReady();
if (!dockerReady) {
  console.warn(
    "Skipping curriculum integration tests: Docker is not running or atlas-java-sandbox image is not built. " +
    "See docs/engineering/DEVELOPMENT_SETUP.md."
  );
}

const TIMEOUT_MS = 90_000;
const levels = REALMS.flatMap((r) => r.levels);

function testSpecs(challenge: ChallengeDef): TestCaseSpec[] {
  return challenge.tests.map((t, i) => ({
    id: `t${i}`,
    isHidden: t.hidden ?? false,
    description: t.description,
    input: t.stdin !== undefined ? { stdin: t.stdin } : null,
    expected: t.stdout !== undefined ? { stdout: t.stdout } : { stdoutPattern: t.stdoutPattern },
  }));
}

// Output questions show a fragment of main's body unless they contain a class.
function asProgram(code: string): string {
  if (/\bclass\s/.test(code)) return code;
  const body = code.trimEnd().split("\n").map((l) => `        ${l}`).join("\n");
  return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}\n`;
}

async function runOnce(code: string, stdin: string | null) {
  const compile = await compileInSandbox(code);
  try {
    if (!compile.success) return { ok: false, stdout: "", stderr: compile.stderr };
    const run = await runInSandbox(compile, stdin);
    return { ok: run.exitCode === 0 && !run.timedOut, stdout: run.stdout, stderr: run.stderr };
  } finally {
    await cleanupWorkDir(compile.workDir);
  }
}

describe.runIf(dockerReady).concurrent("curriculum validation (real sandbox)", () => {
  for (const level of levels) {
    const challenge = level.challenge;
    if (challenge) {
      it(`${level.slug}: reference solution passes every test and requirement`, async () => {
        const outcome = await evaluateSubmission(challenge.solution, testSpecs(challenge));
        const failures = outcome.results.filter((r) => !r.passed).map((r) => `${r.description}: ${r.actualStdout}${r.actualStderr}`);
        expect(failures).toEqual([]);
        expect(checkRequirements(challenge.solution, challenge.requirements ?? []).every((r) => r.passed)).toBe(true);
      }, TIMEOUT_MS);

      (challenge.wrongSolutions ?? []).forEach((wrong, i) => {
        it(`${level.slug}: documented wrong answer #${i + 1} fails`, async () => {
          const outcome = await evaluateSubmission(wrong, testSpecs(challenge));
          const meetsRequirements = checkRequirements(wrong, challenge.requirements ?? []).every((r) => r.passed);
          expect(outcome.overallStatus === "passed" && meetsRequirements).toBe(false);
        }, TIMEOUT_MS);
      });
    }

    (level.blocks ?? []).forEach((block, i) => {
      if (block.type !== "code" || !block.runnable) return;
      it(`${level.slug}: example #${i + 1} runs cleanly`, async () => {
        const code = block.lines.map(([line]) => line).join("\n");
        const result = await runOnce(code, block.stdin ?? null);
        expect(result.stderr).toBe("");
        expect(result.ok).toBe(true);
      }, TIMEOUT_MS);
    });

    for (const q of level.questions ?? []) {
      if (q.kind !== "output" || !q.code) continue;
      it(`${level.slug}:${q.slug}: answer key matches real output`, async () => {
        const result = await runOnce(asProgram(q.code!), null);
        expect(result.stderr).toBe("");
        expect(isAnswerCorrect("output", q.answer, result.stdout)).toBe(true);
      }, TIMEOUT_MS);
    }
  }

  it("an infinite loop is reported as a timeout, not left to hang", async () => {
    const infinite = "public class Main {\n    public static void main(String[] args) {\n        while (true) {}\n    }\n}\n";
    const outcome = await evaluateSubmission(infinite, [
      { id: "t1", isHidden: false, description: "never finishes", input: null, expected: { stdout: "" } },
    ]);
    expect(outcome.overallStatus).toBe("timeout");
  }, TIMEOUT_MS);
});
