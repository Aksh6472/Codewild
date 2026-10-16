import { describe, it, expect } from "vitest";
import { calculateReward, masteredState, XP_PER_LEVEL, COINS_PER_LEVEL } from "../src/reward/reward.js";

describe("calculateReward", () => {
  it("awards full XP and coins without rung 4", () => {
    expect(calculateReward(false)).toEqual({ xp: XP_PER_LEVEL, coins: COINS_PER_LEVEL });
  });

  it("reduces coins but never XP when rung 4 was used (design.md §3.5)", () => {
    const result = calculateReward(true);
    expect(result.xp).toBe(XP_PER_LEVEL);
    expect(result.coins).toBeLessThan(COINS_PER_LEVEL);
  });
});

describe("masteredState", () => {
  it("is mastered only without rung 4", () => {
    expect(masteredState(false)).toBe("mastered");
    expect(masteredState(true)).toBe("in_progress");
  });
});
