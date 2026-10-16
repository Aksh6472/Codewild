// Reward/XP calculation (GAME_DESIGN.md: "XP and coins track concepts mastered,
// never time spent"). Deliberately simple fixed amounts for this milestone — the
// full mastery-estimation model is explicitly post-MVP (DATABASE.md).

export const XP_PER_LEVEL = 50;
export const COINS_PER_LEVEL = 20;
export const RUNG_4_COIN_PENALTY_FRACTION = 0.5; // hints reduce coins, never XP (design.md §3.5)

export function calculateReward(usedRung4: boolean): { xp: number; coins: number } {
  const xp = XP_PER_LEVEL;
  const coins = usedRung4 ? Math.round(COINS_PER_LEVEL * (1 - RUNG_4_COIN_PENALTY_FRACTION)) : COINS_PER_LEVEL;
  return { xp, coins };
}

// "Mastered" (★) requires passing without rung 4 (design.md §3.3/§3.5).
export function masteredState(usedRung4: boolean): "mastered" | "in_progress" {
  return usedRung4 ? "in_progress" : "mastered";
}
