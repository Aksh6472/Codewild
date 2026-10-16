import { describe, it, expect } from "vitest";
import { rung0Message } from "../src/hints/rung0.js";

describe("rung0Message", () => {
  it("flags a missing semicolon (level 1's documented misconception, CURRICULUM.md)", () => {
    const stderr = "Robot.java:3: error: ';' expected\n        System.out.println(\"Hello, Foundry!\")\n";
    expect(rung0Message("compile_error", stderr)).toMatch(/semicolon/i);
  });

  it("flags an incompatible-types error (level 2's String/int misconception)", () => {
    const stderr = "Robot.java:5: error: incompatible types: int cannot be converted to String\n";
    expect(rung0Message("compile_error", stderr)).toMatch(/wrong type/i);
  });

  it("reports a friendly timeout message without needing stderr", () => {
    expect(rung0Message("timeout", "")).toMatch(/never finished/i);
  });

  it("returns null when there was no error", () => {
    expect(rung0Message("none", "")).toBeNull();
  });
});
