// Deterministic grading (TECH.md §10: a custom evaluation engine, never AI
// judgment): program stdout against a test case, static code requirements,
// and quiz / knowledge-check answers against their server-side keys.

export interface ExpectedOutput {
  stdout?: string;
  stdoutPattern?: string;
}

export function evaluateStdout(actualStdout: string, expected: ExpectedOutput): boolean {
  const actual = normalizeOutput(actualStdout);
  if (expected.stdout !== undefined) {
    return actual === normalizeOutput(expected.stdout);
  }
  if (expected.stdoutPattern !== undefined) {
    return new RegExp(expected.stdoutPattern).test(actual);
  }
  return false;
}

// Trailing spaces on a line and a trailing newline are invisible in a console,
// so they never fail a learner. Everything else (case, punctuation) counts.
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

// Comments are removed first so a requirement can't be met (or broken) by
// the starter code's own "// use a for loop here" notes.
export function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

export interface CodeRequirement {
  description: string;
  pattern: string;
  mustMatch: boolean;
}

export function checkRequirements(code: string, requirements: CodeRequirement[]) {
  const source = stripComments(code);
  return requirements.map((r) => ({
    description: r.description,
    passed: new RegExp(r.pattern).test(source) === r.mustMatch,
  }));
}

export interface FeedbackRule {
  stdoutPattern?: string;
  codePattern?: string;
  message: string;
}

// The first authored rule whose pattern matches this failed attempt.
export function matchFeedback(rules: FeedbackRule[], code: string, stdout: string): string | null {
  const source = stripComments(code);
  const out = normalizeOutput(stdout);
  const rule = rules.find(
    (r) =>
      (r.stdoutPattern === undefined || new RegExp(r.stdoutPattern).test(out)) &&
      (r.codePattern === undefined || new RegExp(r.codePattern).test(source))
  );
  return rule?.message ?? null;
}

export function isAnswerCorrect(kind: "mcq" | "output", key: string | string[], given: string): boolean {
  const accepted = Array.isArray(key) ? key : [key];
  if (kind === "mcq") return accepted.includes(given);
  const answer = normalizeOutput(given);
  return accepted.some((a) => normalizeOutput(a) === answer);
}
