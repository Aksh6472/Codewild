import { describe, it, expect } from "vitest";
import { evaluateStdout } from "../src/evaluation.js";

describe("evaluateStdout", () => {
  it("matches exact expected stdout, trimming trailing whitespace", () => {
    expect(evaluateStdout("Hello, Foundry!\n", { stdout: "Hello, Foundry!" })).toBe(true);
    expect(evaluateStdout("Hello, foundry!", { stdout: "Hello, Foundry!" })).toBe(false);
  });

  it("matches a stdoutPattern regex for level 2's format check", () => {
    expect(evaluateStdout("Spark - Power: 75", { stdoutPattern: "^.+ - Power: \\d+$" })).toBe(true);
    expect(evaluateStdout("Spark - Power: high", { stdoutPattern: "^.+ - Power: \\d+$" })).toBe(false);
  });
});
