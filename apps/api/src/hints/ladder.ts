import type { Guidance } from "@atlas/shared-types";
import type { Queryable } from "../progression.js";

// Authored hint ladder (GAME_DESIGN.md "hint progression", rungs 1-4; the AI
// rungs are Milestone 7). Help fades as the learner gains independence:
//   guided      — every hint available immediately
//   supported   — hint N unlocks after N-1 failed runs
//   independent — hint N unlocks after N failed runs
// Rung 4 (the full solution) needs every hint revealed first plus a minimum
// number of failed runs, so a learner always meets hints before an answer.
// After a pass the solution is free to compare against (no penalty).

const FAILS_BEFORE_SOLUTION: Record<Guidance, number> = { guided: 1, supported: 2, independent: 2 };

export function failsNeededForHint(guidance: Guidance, rung: number): number {
  if (guidance === "guided") return 0;
  return guidance === "supported" ? rung - 1 : rung;
}

export interface LadderState {
  revealed: string[];
  failedAttempts: number;
  solved: boolean;
  nextHint: { available: boolean; reason: string | null };
  solutionAvailable: boolean;
  solutionRevealed: boolean;
}

export async function ladderState(
  db: Queryable,
  userId: string,
  challenge: { id: string; guidance: Guidance; hints: string[] }
): Promise<LadderState> {
  const { rows: [row] } = await db.query(
    `SELECT
       (SELECT COUNT(*)::int FROM submissions WHERE user_id = $1 AND challenge_id = $2
          AND status IN ('failed', 'error', 'timeout')) AS failed,
       EXISTS (SELECT 1 FROM submissions WHERE user_id = $1 AND challenge_id = $2 AND status = 'passed') AS solved,
       (SELECT COUNT(*)::int FROM hint_usage WHERE user_id = $1 AND challenge_id = $2 AND rung <= 3) AS hints_used,
       EXISTS (SELECT 1 FROM hint_usage WHERE user_id = $1 AND challenge_id = $2 AND rung = 4) AS solution_used`,
    [userId, challenge.id]
  );

  const revealedCount = Math.min(row.hints_used, challenge.hints.length);
  const nextRung = revealedCount + 1;
  let nextHint: LadderState["nextHint"];
  if (nextRung > challenge.hints.length) {
    nextHint = { available: false, reason: "You've seen every hint for this trial." };
  } else {
    const needed = failsNeededForHint(challenge.guidance, nextRung) - row.failed;
    nextHint =
      needed <= 0 || row.solved
        ? { available: true, reason: null }
        : {
            available: false,
            reason: `Give it ${needed === 1 ? "one more run" : `${needed} more runs`} first — the next hint unlocks as you try.`,
          };
  }

  const solutionAvailable =
    row.solved ||
    row.solution_used ||
    (revealedCount === challenge.hints.length && row.failed >= FAILS_BEFORE_SOLUTION[challenge.guidance]);

  return {
    revealed: challenge.hints.slice(0, revealedCount),
    failedAttempts: row.failed,
    solved: row.solved,
    nextHint,
    solutionAvailable,
    solutionRevealed: row.solution_used,
  };
}
