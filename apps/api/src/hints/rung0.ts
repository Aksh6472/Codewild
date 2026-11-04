import { firstMeaningfulLine } from "../execution/errorClassification.js";
import type { ErrorClassification } from "@atlas/shared-types";

// Deterministic plain-English error table (GAME_DESIGN.md "hint progression" /
// CURRICULUM.md per-level misconceptions). No AI call — rung 0 is free and
// always available, per DECISIONS.md D3 ("the AI never decides correctness").
const COMPILE_PATTERNS: { test: (line: string) => boolean; message: string }[] = [
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
    test: (l) => /class, interface, (enum|or record)/.test(l) || /reached end of file while parsing/.test(l),
    message: "Your braces { } don't line up — every { needs a matching }, and all code must sit inside a class.",
  },
  {
    test: (l) => /cannot find symbol/.test(l),
    message: "Java doesn't recognise a name you used. Check its spelling and capitals (Java is case-sensitive), and that the variable or method is declared before you use it.",
  },
  {
    test: (l) => /might not have been initialized/.test(l),
    message: "You're reading a variable before giving it a value. Assign it something first, e.g. int total = 0;",
  },
  {
    test: (l) => /missing return statement/.test(l),
    message: "This method promises to return a value, but some path through it never reaches a return. Make sure every branch returns something.",
  },
  {
    test: (l) => /is already defined/.test(l),
    message: "You declared the same name twice in one scope. Drop the type the second time to reuse it (total = 5; not int total = 5;).",
  },
  {
    test: (l) => /non-static (method|variable)/.test(l),
    message: "main is static, so it can't use instance members directly. Either mark the method static, or create an object first and call it on that object.",
  },
  {
    test: (l) => /is public, should be declared in a file named/.test(l),
    message: "Only one class per file can be public — the one with main. Remove `public` from your other classes.",
  },
  {
    test: (l) => /does not override abstract method/.test(l) || /is not abstract and does not override/.test(l),
    message: "A class that extends an abstract class (or implements an interface) must write every abstract method it inherits.",
  },
  {
    test: (l) => /unreachable statement/.test(l),
    message: "There's code after a return or break that can never run. Move it above, or remove it.",
  },
];

const RUNTIME_PATTERNS: { test: (stderr: string) => boolean; message: string }[] = [
  {
    test: (s) => /ArrayIndexOutOfBoundsException|StringIndexOutOfBoundsException|IndexOutOfBoundsException/.test(s),
    message: "Your program used an index that doesn't exist. Valid indexes run from 0 to length - 1 — check your loop condition (< vs <=).",
  },
  {
    test: (s) => /NullPointerException/.test(s),
    message: "Your program used a reference that points to nothing (null). Check that every object — or the next node in a list — exists before calling methods on it.",
  },
  {
    test: (s) => /ArithmeticException: \/ by zero/.test(s),
    message: "Your program divided by zero. Check the divisor before dividing.",
  },
  {
    test: (s) => /StackOverflowError/.test(s),
    message: "Your recursion never stopped. Every recursive method needs a base case that returns without calling itself — and each call must move closer to it.",
  },
  {
    test: (s) => /InputMismatchException|NumberFormatException/.test(s),
    message: "Your program read input as the wrong type — e.g. nextInt() hit text. Check that you read the input in the order and type described.",
  },
  {
    test: (s) => /NoSuchElementException/.test(s),
    message: "Your program tried to read more input than there is. Read exactly as many values as the input provides.",
  },
  {
    test: (s) => /OutOfMemoryError/.test(s),
    message: "Your program ran out of memory — usually a loop that keeps adding to a list or string forever.",
  },
];

// For a run that compiled and finished cleanly but printed the wrong thing.
// Never reveals the expected output (API_SPEC.md: no expected outputs in responses).
export const WRONG_OUTPUT_MESSAGE =
  "Your program ran, but its output doesn't match the goal yet. Compare it with the instructions character by character — capital letters, punctuation and spaces all count.";

export function rung0Message(classification: ErrorClassification, stderr: string): string | null {
  if (classification === "timeout") {
    return "Your program never finished in time — check whether a loop is missing something that makes it stop, or whether your approach repeats far more work than it needs to.";
  }
  if (classification === "compile_error") {
    const line = firstMeaningfulLine(stderr);
    const match = COMPILE_PATTERNS.find((p) => p.test(line));
    return match?.message ?? "Your code didn't compile. Check the console output for the exact line Java is pointing at.";
  }
  if (classification === "runtime_exception") {
    const match = RUNTIME_PATTERNS.find((p) => p.test(stderr));
    return match?.message ?? "Your program compiled but crashed while running. Check the console output for what it was doing when it stopped.";
  }
  return null;
}
