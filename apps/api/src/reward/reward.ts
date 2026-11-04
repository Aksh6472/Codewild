// Reward/XP calculation (GAME_DESIGN.md: "XP and coins track concepts mastered,
// never time spent"). Fixed amounts — the full mastery-estimation model is
// explicitly post-MVP (DATABASE.md). Every grant is keyed (rewardKey) and
// stored at most once per user, so replaying content never farms points.

export const XP_PER_LEVEL = 50;
export const COINS_PER_LEVEL = 20;
export const RUNG_4_COIN_PENALTY_FRACTION = 0.5; // hints reduce coins, never XP (design.md §3.5)

export const LESSON_XP = 20;
export const LESSON_COINS = 5;
export const CHECK_FIRST_TRY_XP = 5;
export const QUIZ_PASS_XP = 100;
export const QUIZ_PASS_COINS = 40;
export const REVIEW_XP = 10;

export function calculateReward(usedRung4: boolean): { xp: number; coins: number } {
  const xp = XP_PER_LEVEL;
  const coins = usedRung4 ? Math.round(COINS_PER_LEVEL * (1 - RUNG_4_COIN_PENALTY_FRACTION)) : COINS_PER_LEVEL;
  return { xp, coins };
}

// "Mastered" (★) requires passing without rung 4 (design.md §3.3/§3.5). A pass
// after the solution was revealed still unlocks the next quest ("assisted").
export function masteredState(usedRung4: boolean): "mastered" | "assisted" {
  return usedRung4 ? "assisted" : "mastered";
}

// Quiz improvement XP: one point per percentage point above the previous best,
// so retrying only pays when understanding actually improves.
export function quizImprovementXp(previousBest: number | null, score: number): number {
  return Math.max(0, score - (previousBest ?? 0));
}

export function quizScore(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export const rewardKey = {
  lesson: (levelId: string) => `lesson:${levelId}`,
  check: (questionId: string) => `check:${questionId}`,
  trial: (levelId: string) => `trial:${levelId}`,
  quizPass: (levelId: string) => `quiz-pass:${levelId}`,
  quizImprovement: (attemptId: string) => `quiz-improve:${attemptId}`,
  review: (attemptId: string, lessonId: string) => `review:${attemptId}:${lessonId}`,
};
