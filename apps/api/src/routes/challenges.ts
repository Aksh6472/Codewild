import type { FastifyInstance } from "fastify";
import type { HintResponse, SolutionResponse } from "@atlas/shared-types";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { ladderState } from "../hints/ladder.js";
import { findPathLevel } from "../progression.js";
import { locked, notFound } from "./levels.js";

// The hint ladder's availability rules live in hints/ladder.ts; these routes
// only reveal the next rung when that state says it's earned.
export async function challengesRoutes(app: FastifyInstance) {
  app.post("/challenges/:id/hints", async (req, reply) => {
    const { id } = req.params as { id: string };
    const challenge = await loadChallenge(id);
    if (!challenge) return notFound(reply, "Challenge not found");
    if (await isLocked(challenge.level_id)) return locked(reply);

    const before = await ladderState(pool, DEV_USER_ID, challenge);
    if (!before.nextHint.available) {
      return reply.code(409).send({ error: { code: "hint_locked", message: before.nextHint.reason } });
    }
    await pool.query(
      `INSERT INTO hint_usage (user_id, challenge_id, rung) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [DEV_USER_ID, id, before.revealed.length + 1]
    );

    const after = await ladderState(pool, DEV_USER_ID, challenge);
    const response: HintResponse = {
      hints: after.revealed,
      nextHint: after.nextHint,
      solutionAvailable: after.solutionAvailable,
    };
    return response;
  });

  // Rung 4. Revealing it before passing marks the eventual pass 'assisted'
  // (no ★, half coins — submissions.ts), but never blocks progress.
  app.post("/challenges/:id/solution", async (req, reply) => {
    const { id } = req.params as { id: string };
    const challenge = await loadChallenge(id);
    if (!challenge) return notFound(reply, "Challenge not found");
    if (await isLocked(challenge.level_id)) return locked(reply);

    const ladder = await ladderState(pool, DEV_USER_ID, challenge);
    if (!ladder.solutionAvailable) {
      return reply.code(409).send({
        error: { code: "solution_locked", message: "Work through every hint and keep trying first." },
      });
    }
    if (!ladder.solved) {
      await pool.query(
        `INSERT INTO hint_usage (user_id, challenge_id, rung) VALUES ($1, $2, 4) ON CONFLICT DO NOTHING`,
        [DEV_USER_ID, id]
      );
    }
    const response: SolutionResponse = { code: challenge.solution, explanation: challenge.solution_explanation };
    return response;
  });
}

async function loadChallenge(id: string) {
  const { rows: [c] } = await pool.query(
    `SELECT id, level_id, guidance, hints, solution, solution_explanation FROM challenges WHERE id = $1`,
    [id]
  );
  return c ?? null;
}

async function isLocked(levelId: string) {
  const found = await findPathLevel(pool, DEV_USER_ID, levelId);
  return !found || found.level.state === "locked";
}
