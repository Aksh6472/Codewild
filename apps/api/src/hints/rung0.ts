import { firstMeaningfulLine } from "../execution/errorClassification.js";
import type { ErrorClassification } from "@atlas/shared-types";

// Deterministic plain-English error table (GAME_DESIGN.md "hint progression" /
// CURRICULUM.md per-level misconceptions). No AI call — rung 0 is free and
// always available, per DECISIONS.md D3 ("the AI never decides correctness").
// Only covers levels 1-3's documented misconceptions; later levels extend this.
const PATTERNS: { test: (line: string) => boolean; message: string }[] = [
  {
    test: (l) => /';' expected/.test(l),
    message: "Line looks like it's missing a semicolon ';' at the end — Java needs one after most statements.",
  },
  {
    test: (l) => /unclosed string literal/.test(l),
    message: "A text string is missing its closing quote \" — check that every \" has a matching partner.",
  },
  {
    test: (l) => /incompatible types/.test(l) || /cannot be converted/.test(l),
    message: "You're trying to use a value as the wrong type — e.g. mixing text and a number in a way Java can't combine directly.",
  },
  {
    test: (l) => /class, interface, or enum expected/.test(l),
    message: "Java expected your code to be inside a class — check that your braces { } line up correctly.",
  },
];

export function rung0Message(classification: ErrorClassification, stderr: string): string | null {
  if (classification === "timeout") {
    return "Your program never finished — check whether a loop is missing something that makes it stop.";
  }
  if (classification === "compile_error") {
    const line = firstMeaningfulLine(stderr);
    const match = PATTERNS.find((p) => p.test(line));
    return match?.message ?? "Your code didn't compile. Check the console output for the exact line Java is pointing at.";
  }
  if (classification === "runtime_exception") {
    return "Your program compiled but crashed while running. Check the console output for what it was doing when it stopped.";
  }
  return null;
}
