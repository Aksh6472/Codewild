import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";

// API_SPEC.md: GET /learning-paths and GET /learning-paths/:id/worlds are
// public (no auth) — matches "guest can see the map" in PRD.md F1/F3.
export async function learningPathsRoutes(app: FastifyInstance) {
  app.get("/learning-paths", async () => {
    const { rows } = await pool.query(
      `SELECT lp.id, lp.code, lp.name, lp.sequence_order, l.code AS language_code
       FROM learning_paths lp JOIN languages l ON l.id = lp.language_id
       ORDER BY lp.sequence_order`
    );
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      sequenceOrder: r.sequence_order,
      languageCode: r.language_code,
    }));
  });

  app.get("/learning-paths/:id/worlds", async (req) => {
    const { id } = req.params as { id: string };

    const { rows: worldRows } = await pool.query(
      `SELECT id, name, sequence_order FROM worlds WHERE learning_path_id = $1 ORDER BY sequence_order`,
      [id]
    );

    const worlds = [];
    for (const w of worldRows) {
      const { rows: levelRows } = await pool.query(
        `SELECT lv.id, lv.title, lv.sequence_order, lv.syllabus_tag, lv.is_boss, lv.prerequisite_level_id,
                p.state
         FROM levels lv
         LEFT JOIN progress p ON p.level_id = lv.id AND p.user_id = $2
         WHERE lv.world_id = $1
         ORDER BY lv.sequence_order`,
        [w.id, DEV_USER_ID]
      );

      // A level with no progress row is 'available' only if it has no
      // prerequisite, or its prerequisite is mastered; otherwise 'locked'.
      const stateById = new Map(levelRows.map((lv) => [lv.id, lv.state as string | null]));
      const levels = levelRows.map((lv) => {
        let state = lv.state as string | null;
        if (!state) {
          const prereqState = lv.prerequisite_level_id ? stateById.get(lv.prerequisite_level_id) : null;
          state = !lv.prerequisite_level_id || prereqState === "mastered" ? "available" : "locked";
        }
        return {
          id: lv.id,
          title: lv.title,
          sequenceOrder: lv.sequence_order,
          syllabusTag: lv.syllabus_tag,
          isBoss: lv.is_boss,
          state,
        };
      });

      worlds.push({ id: w.id, name: w.name, sequenceOrder: w.sequence_order, levels });
    }
    return worlds;
  });
}
