import type { Pool, PoolClient } from "pg";
import type { LevelKind, LevelState, QuizStatus } from "@atlas/shared-types";

// Unlocking, state upgrades and rewards, shared by every route. All levels in
// the Java path form one prerequisite chain (db/seed.ts), so a level unlocks
// only once the quest before it is done — lessons, trials, mocks and each
// realm's guardian quiz alike (mastery, not points, gates advancement).

// The shared pool, or a client holding an open transaction.
export type Queryable = Pool | PoolClient;

export interface PathLevel {
  id: string;
  worldId: string;
  worldName: string;
  worldOrder: number;
  title: string;
  kind: LevelKind;
  concept: string;
  sequenceOrder: number;
  syllabusTag: string | null;
  isBoss: boolean;
  minutes: number;
  timeLimitMinutes: number | null;
  prerequisiteLevelId: string | null;
  state: LevelState;
}

const STATE_RANK: LevelState[] = ["locked", "available", "in_progress", "assisted", "mastered"];

export function isDone(state: LevelState | undefined): boolean {
  return state === "mastered" || state === "assisted";
}

export async function loadPathLevels(db: Queryable, userId: string): Promise<PathLevel[]> {
  const { rows } = await db.query(
    `SELECT lv.id, lv.world_id, w.name AS world_name, w.sequence_order AS world_order, lv.title, lv.kind,
            lv.concept, lv.sequence_order, lv.syllabus_tag, lv.is_boss, lv.minutes, lv.time_limit_minutes,
            lv.prerequisite_level_id, p.state
     FROM levels lv
     JOIN worlds w ON w.id = lv.world_id
     LEFT JOIN progress p ON p.level_id = lv.id AND p.user_id = $1
     ORDER BY w.sequence_order, lv.sequence_order`,
    [userId]
  );

  // Rows arrive in chain order, so every prerequisite is resolved before the
  // level that depends on it. A level with no progress row is 'available' only
  // if it has no prerequisite, or its prerequisite is done.
  const stateById = new Map<string, LevelState>();
  return rows.map((r) => {
    let state = r.state as LevelState | null;
    if (!state || state === "locked" || state === "available") {
      const prereqDone = !r.prerequisite_level_id || isDone(stateById.get(r.prerequisite_level_id));
      state = prereqDone ? "available" : "locked";
    }
    stateById.set(r.id, state);
    return {
      id: r.id,
      worldId: r.world_id,
      worldName: r.world_name,
      worldOrder: r.world_order,
      title: r.title,
      kind: r.kind,
      concept: r.concept,
      sequenceOrder: r.sequence_order,
      syllabusTag: r.syllabus_tag,
      isBoss: r.is_boss,
      minutes: r.minutes,
      timeLimitMinutes: r.time_limit_minutes,
      prerequisiteLevelId: r.prerequisite_level_id,
      state,
    };
  });
}

export async function findPathLevel(db: Queryable, userId: string, levelId: string) {
  const levels = await loadPathLevels(db, userId);
  const index = levels.findIndex((l) => l.id === levelId);
  if (index === -1) return null;
  return { level: levels[index], next: levels[index + 1] ?? null, all: levels };
}

// Never downgrades: replaying a mastered level can't drop it to 'assisted'.
export async function upgradeLevelState(
  db: Queryable,
  userId: string,
  levelId: string,
  state: LevelState,
  extra: { bestSubmissionId?: string; usedRung4?: boolean } = {}
) {
  await db.query(
    `INSERT INTO progress (user_id, level_id, state, best_submission_id, used_rung_4, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id, level_id) DO UPDATE
       SET state = EXCLUDED.state,
           best_submission_id = COALESCE(EXCLUDED.best_submission_id, progress.best_submission_id),
           used_rung_4 = EXCLUDED.used_rung_4,
           updated_at = now()
       WHERE array_position($6::text[], progress.state) < array_position($6::text[], EXCLUDED.state)`,
    [userId, levelId, state, extra.bestSubmissionId ?? null, extra.usedRung4 ?? false, STATE_RANK]
  );
}

export async function markConceptMastered(db: Queryable, userId: string, concept: string) {
  await db.query(
    `INSERT INTO concept_mastery (user_id, concept, status) VALUES ($1, $2, 'mastered')
     ON CONFLICT (user_id, concept) DO UPDATE SET status = 'mastered'`,
    [userId, concept]
  );
}

// Grants a reward at most once per (user, key). Returns what was actually
// granted — zero when this reward was already earned.
export async function grantReward(
  db: Queryable,
  userId: string,
  key: string,
  xp: number,
  coins: number,
  reason: string,
  submissionId: string | null = null
): Promise<{ xp: number; coins: number }> {
  if (xp === 0 && coins === 0) return { xp: 0, coins: 0 };
  const { rows } = await db.query(
    `INSERT INTO reward_transactions (user_id, submission_id, xp_delta, coins_delta, reason, reward_key)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, reward_key) DO NOTHING
     RETURNING xp_delta, coins_delta`,
    [userId, submissionId, xp, coins, reason, key]
  );
  return rows[0] ? { xp: rows[0].xp_delta, coins: rows[0].coins_delta } : { xp: 0, coins: 0 };
}

export async function totals(db: Queryable, userId: string): Promise<{ xp: number; coins: number }> {
  const { rows: [row] } = await db.query(
    `SELECT COALESCE(SUM(xp_delta), 0)::int AS xp, COALESCE(SUM(coins_delta), 0)::int AS coins
     FROM reward_transactions WHERE user_id = $1`,
    [userId]
  );
  return row;
}

// Cosmetic titles for the HUD. Earned only through the keyed rewards above.
const RANKS = [
  { title: "Apprentice", xp: 0 },
  { title: "Tinkerer", xp: 150 },
  { title: "Builder", xp: 450 },
  { title: "Engineer", xp: 900 },
  { title: "Architect", xp: 1500 },
  { title: "Algorithmist", xp: 2300 },
  { title: "Interview-ready", xp: 3200 },
];

export function rankFor(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const next = RANKS[i + 1];
  return {
    title: RANKS[i].title,
    xpIntoRank: xp - RANKS[i].xp,
    xpForNextRank: next ? next.xp - RANKS[i].xp : null,
  };
}

// A failed quiz names the lessons behind each missed question; a retry opens
// once every one of them has been re-completed since that attempt.
export async function quizStatus(
  db: Queryable,
  userId: string,
  levelId: string,
  passingScore: number
): Promise<QuizStatus> {
  const { rows: attempts } = await db.query(
    `SELECT score, passed, created_at, elapsed_seconds, missed_review_level_ids
     FROM quiz_attempts WHERE user_id = $1 AND level_id = $2 ORDER BY created_at`,
    [userId, levelId]
  );

  const last = attempts[attempts.length - 1];
  let reviewRequired: QuizStatus["reviewRequired"] = [];
  if (last && !last.passed && last.missed_review_level_ids.length > 0) {
    const { rows } = await db.query(
      `SELECT lv.id, lv.title,
              EXISTS (SELECT 1 FROM lesson_completions lc
                      WHERE lc.user_id = $1 AND lc.level_id = lv.id AND lc.completed_at > $3) AS done
       FROM levels lv JOIN worlds w ON w.id = lv.world_id
       WHERE lv.id = ANY($2::uuid[])
       ORDER BY w.sequence_order, lv.sequence_order`,
      [userId, last.missed_review_level_ids, last.created_at]
    );
    reviewRequired = rows.map((r) => ({ levelId: r.id, title: r.title, done: r.done }));
  }

  const scores = attempts.map((a) => a.score as number);
  return {
    passingScore,
    attempts: attempts.map((a) => ({
      score: a.score,
      passed: a.passed,
      createdAt: a.created_at.toISOString(),
      elapsedSeconds: a.elapsed_seconds,
    })),
    bestScore: scores.length ? Math.max(...scores) : null,
    passed: attempts.some((a) => a.passed),
    canAttempt: reviewRequired.every((r) => r.done),
    reviewRequired,
  };
}

// A mock interview needs both halves: the coding stage's tests and the
// discussion stages' passing score.
export async function completeMockIfReady(db: Queryable, userId: string, levelId: string) {
  const { rows: [row] } = await db.query(
    `SELECT
       EXISTS (SELECT 1 FROM quiz_attempts WHERE user_id = $1 AND level_id = $2 AND passed) AS discussed,
       EXISTS (SELECT 1 FROM submissions s JOIN challenges c ON c.id = s.challenge_id
               WHERE s.user_id = $1 AND c.level_id = $2 AND s.status = 'passed') AS coded,
       EXISTS (SELECT 1 FROM hint_usage h JOIN challenges c ON c.id = h.challenge_id
               WHERE h.user_id = $1 AND c.level_id = $2 AND h.rung = 4) AS used_solution`,
    [userId, levelId]
  );
  if (row.discussed && row.coded) {
    await upgradeLevelState(db, userId, levelId, row.used_solution ? "assisted" : "mastered", {
      usedRung4: row.used_solution,
    });
    return true;
  }
  await upgradeLevelState(db, userId, levelId, "in_progress");
  return false;
}
