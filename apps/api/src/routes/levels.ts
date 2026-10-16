import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";

// API_SPEC.md: GET /levels/:id must never include hidden test cases or their
// expected output (SECURITY.md). This query only ever selects visible rows'
// `description` as plain-language goal-checklist text.
export async function levelsRoutes(app: FastifyInstance) {
  app.get("/levels/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const { rows: [level] } = await pool.query(
      `SELECT lv.id, lv.title, lv.story, lv.concept, c.id AS challenge_id, c.starter_code, c.instructions
       FROM levels lv JOIN challenges c ON c.level_id = lv.id
       WHERE lv.id = $1`,
      [id]
    );
    if (!level) {
      return reply.code(404).send({ error: { code: "not_found", message: "Level not found" } });
    }

    const { rows: visibleTests } = await pool.query(
      `SELECT description FROM test_cases WHERE challenge_id = $1 AND is_hidden = false ORDER BY sequence_order`,
      [level.challenge_id]
    );

    return {
      id: level.id,
      challengeId: level.challenge_id,
      title: level.title,
      story: level.story,
      concept: level.concept,
      instructions: level.instructions,
      starterCode: level.starter_code,
      goalChecklist: visibleTests.map((t) => t.description),
    };
  });
}
