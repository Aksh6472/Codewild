import type { FastifyInstance } from "fastify";
import type { DashboardResponse } from "@atlas/shared-types";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { isDone, loadPathLevels, rankFor, totals } from "../progression.js";

const REASON_LABEL: Record<string, string> = {
  lesson_completed: "Lesson completed",
  check_first_try: "Knowledge check — first try",
  level_passed: "Trial solved",
  quiz_passed: "Guardian quiz passed",
  quiz_improved: "Quiz score improved",
  topic_reviewed: "Reviewed a missed topic",
};

// The adventurer's journal: everything the progress dashboard shows, in one
// read. All of it is derived from progress/attempt rows — nothing is cached.
export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard", async (): Promise<DashboardResponse> => {
    const levels = await loadPathLevels(pool, DEV_USER_ID);
    const { xp, coins } = await totals(pool, DEV_USER_ID);

    const worlds = [...new Map(levels.map((l) => [l.worldId, l])).values()];
    const realms = await Promise.all(
      worlds.map(async (w) => {
        const worldLevels = levels.filter((l) => l.worldId === w.worldId);
        const quiz = worldLevels.find((l) => l.kind === "quiz");
        const { rows: [best] } = quiz
          ? await pool.query(
              `SELECT MAX(score)::int AS best FROM quiz_attempts WHERE user_id = $1 AND level_id = $2`,
              [DEV_USER_ID, quiz.id]
            )
          : { rows: [{ best: null }] };
        const done = worldLevels.filter((l) => isDone(l.state)).length;
        return {
          id: w.worldId,
          name: w.worldName,
          sequenceOrder: w.worldOrder,
          state: (done === worldLevels.length ? "complete" : worldLevels[0].state === "locked" ? "locked" : "open") as
            DashboardResponse["realms"][number]["state"],
          done,
          total: worldLevels.length,
          quizBest: best.best,
        };
      })
    );
    const current = realms.find((r) => r.state === "open") ?? null;

    const { rows: quizRows } = await pool.query(
      `SELECT lv.id, lv.title, MAX(qa.score)::int AS best, COUNT(qa.id)::int AS attempts,
              COALESCE(BOOL_OR(qa.passed), false) AS passed
       FROM levels lv JOIN worlds w ON w.id = lv.world_id
       LEFT JOIN quiz_attempts qa ON qa.level_id = lv.id AND qa.user_id = $1
       WHERE lv.kind IN ('quiz', 'mock')
       GROUP BY lv.id, lv.title, w.sequence_order, lv.sequence_order
       ORDER BY w.sequence_order, lv.sequence_order`,
      [DEV_USER_ID]
    );

    const { rows: [runs] } = await pool.query(
      `SELECT COUNT(*)::int AS runs FROM submissions WHERE user_id = $1`,
      [DEV_USER_ID]
    );
    const trials = levels.filter((l) => l.kind === "trial");

    // Review queue: lessons a failed quiz is waiting on, then trials passed
    // with the solution revealed (re-solving cleanly earns the ★).
    const reviewQueue: DashboardResponse["reviewQueue"] = [];
    const { rows: failedQuizzes } = await pool.query(
      `SELECT DISTINCT ON (qa.level_id) qa.level_id, qa.passed, qa.missed_review_level_ids, qa.created_at, lv.title
       FROM quiz_attempts qa JOIN levels lv ON lv.id = qa.level_id
       WHERE qa.user_id = $1 ORDER BY qa.level_id, qa.created_at DESC`,
      [DEV_USER_ID]
    );
    for (const attempt of failedQuizzes) {
      if (attempt.passed) continue;
      const { rows } = await pool.query(
        `SELECT lv.id, lv.title FROM levels lv
         WHERE lv.id = ANY($2::uuid[]) AND NOT EXISTS (
           SELECT 1 FROM lesson_completions lc
           WHERE lc.user_id = $1 AND lc.level_id = lv.id AND lc.completed_at > $3)`,
        [DEV_USER_ID, attempt.missed_review_level_ids, attempt.created_at]
      );
      for (const r of rows) {
        reviewQueue.push({ levelId: r.id, title: r.title, reason: `Missed in "${attempt.title}"` });
      }
    }
    for (const l of levels.filter((l) => l.state === "assisted")) {
      reviewQueue.push({ levelId: l.id, title: l.title, reason: "Solved with the solution shown — re-solve for ★" });
    }

    const next = levels.find((l) => l.state === "available" || l.state === "in_progress") ?? null;

    const { rows: recent } = await pool.query(
      `SELECT reason, xp_delta, coins_delta, created_at FROM reward_transactions
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 8`,
      [DEV_USER_ID]
    );

    return {
      xp,
      coins,
      rank: rankFor(xp),
      currentRealm: current
        ? { id: current.id, name: current.name, sequenceOrder: current.sequenceOrder, done: current.done, total: current.total }
        : null,
      realms,
      completedTopics: levels
        .filter((l) => isDone(l.state) && l.kind !== "quiz")
        .map((l) => ({ levelId: l.id, title: l.title, realmName: l.worldName, kind: l.kind, state: l.state })),
      quizScores: quizRows.map((r) => ({
        levelId: r.id,
        title: r.title,
        bestScore: r.best,
        attempts: r.attempts,
        passed: r.passed,
      })),
      challenges: {
        solved: trials.filter((l) => isDone(l.state)).length,
        total: trials.length,
        assisted: trials.filter((l) => l.state === "assisted").length,
        runs: runs.runs,
      },
      reviewQueue,
      nextStep: next ? { levelId: next.id, worldId: next.worldId, title: next.title, kind: next.kind } : null,
      recentRewards: recent.map((r) => ({
        reason: REASON_LABEL[r.reason] ?? r.reason,
        xp: r.xp_delta,
        coins: r.coins_delta,
        at: r.created_at.toISOString(),
      })),
    };
  });
}
