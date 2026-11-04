import { describe, it, expect } from "vitest";
import {
  calculateReward,
  masteredState,
  quizImprovementXp,
  quizScore,
  XP_PER_LEVEL,
  COINS_PER_LEVEL,
} from "../src/reward/reward.js";

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
  it("is mastered only without rung 4; a rung-4 pass is 'assisted' (still unlocks)", () => {
    expect(masteredState(false)).toBe("mastered");
    expect(masteredState(true)).toBe("assisted");
  });
});

describe("quiz scoring", () => {
  it("rounds to a whole percentage", () => {
    expect(quizScore(5, 6)).toBe(83);
    expect(quizScore(0, 0)).toBe(0);
  });

  it("only pays improvement above the previous best", () => {
    expect(quizImprovementXp(null, 60)).toBe(60);
    expect(quizImprovementXp(60, 85)).toBe(25);
    expect(quizImprovementXp(85, 70)).toBe(0);
  });
});
