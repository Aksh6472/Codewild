import type { ErrorClassification } from "@atlas/shared-types";

// Classifies a sandbox run's outcome from its exit code and stderr, per
// TESTING.md/SECURITY.md's requirement that failures be classified
// deterministically (this feeds the rung-0 message table, not an AI judgment).
export function classify(params: {
  compileExitCode: number;
  compileStderr: string;
  runExitCode: number | null;
  runStderr: string;
  timedOut: boolean;
}): ErrorClassification {
  if (params.timedOut) return "timeout";
  if (params.compileExitCode !== 0) return "compile_error";
  if (params.runExitCode !== null && params.runExitCode !== 0) return "runtime_exception";
  return "none";
}

// Pulls out the most relevant line for a plain-English lookup later (rung0.ts),
// without ever surfacing the full raw stack trace to the student directly.
export function firstMeaningfulLine(stderr: string): string {
  const lines = stderr.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines[0] ?? "";
}
