// Deterministic comparison of actual program output against a test case's
// expected_output (TECH.md §10: a custom evaluation engine, never AI judgment).
// Levels 1-3 are pure stdout — no world-state assertions needed yet (see plan's
// "why levels 1-3" scope note); that generalization is follow-on work for level 4+.

export interface ExpectedOutput {
  stdout?: string;
  stdoutPattern?: string;
}

export function evaluateStdout(actualStdout: string, expected: ExpectedOutput): boolean {
  const actual = actualStdout.trimEnd();
  if (expected.stdout !== undefined) {
    return actual === expected.stdout.trimEnd();
  }
  if (expected.stdoutPattern !== undefined) {
    return new RegExp(expected.stdoutPattern).test(actual);
  }
  return false;
}
