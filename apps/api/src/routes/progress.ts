import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";

export async function progressRoutes(app: FastifyInstance) {
  app.get("/progress", async () => {
    const { rows: levelRows } = await pool.query(
      `SELECT level_id, state FROM progress WHERE user_id = $1`,
      [DEV_USER_ID]
    );
    const { rows: conceptRows } = await pool.query(
      `SELECT concept, status FROM concept_mastery WHERE user_id = $1`,
      [DEV_USER_ID]
    );
    const { rows: [totals] } = await pool.query(
      `SELECT COALESCE(SUM(xp_delta), 0)::int AS xp, COALESCE(SUM(coins_delta), 0)::int AS coins
       FROM reward_transactions WHERE user_id = $1`,
      [DEV_USER_ID]
    );

    return {
      levels: levelRows.map((r) => ({ levelId: r.level_id, state: r.state })),
      conceptMastery: conceptRows,
      xp: totals.xp,
      coins: totals.coins,
    };
  });

  app.get("/progress/reward/:submissionId", async (req, reply) => {
    const { submissionId } = req.params as { submissionId: string };

    const { rows: [tx] } = await pool.query(
      `SELECT xp_delta, coins_delta FROM reward_transactions WHERE submission_id = $1 AND user_id = $2`,
      [submissionId, DEV_USER_ID]
    );
    if (!tx) {
      return reply.code(404).send({ error: { code: "not_found", message: "No reward for this submission" } });
    }

    const { rows: [level] } = await pool.query(
      `SELECT lv.title, lv.concept FROM levels lv
       JOIN challenges c ON c.level_id = lv.id
       JOIN submissions s ON s.challenge_id = c.id
       WHERE s.id = $1`,
      [submissionId]
    );

    return {
      xpGained: tx.xp_delta,
      coinsGained: tx.coins_delta,
      leveledUp: false, // player-level thresholds not modeled yet in this milestone
      newlyUnlockedLevelIds: [], // computed on next GET /learning-paths/:id/worlds call instead
      whatYouLearned: {
        sentence: `You practiced ${level?.concept ?? "a new concept"} in "${level?.title ?? "this level"}".`,
        keyCodeLine: "",
      },
    };
  });
}
