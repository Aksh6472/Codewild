import type { FastifyInstance } from "fastify";
import type { WorldSummary } from "@atlas/shared-types";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { isDone, loadPathLevels } from "../progression.js";

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

  app.get("/learning-paths/:id/worlds", async (req): Promise<WorldSummary[]> => {
    const { id } = req.params as { id: string };

    const { rows: worldRows } = await pool.query(
      `SELECT id, slug, name, subtitle, story, theme, summary, sequence_order
       FROM worlds WHERE learning_path_id = $1 ORDER BY sequence_order`,
      [id]
    );
    const levels = await loadPathLevels(pool, DEV_USER_ID);

    return worldRows.map((w) => {
      const worldLevels = levels.filter((l) => l.worldId === w.id);
      const state = worldLevels.every((l) => isDone(l.state))
        ? "complete"
        : worldLevels[0]?.state === "locked"
          ? "locked"
          : "open";
      return {
        id: w.id,
        slug: w.slug,
        name: w.name,
        subtitle: w.subtitle,
        story: w.story,
        theme: w.theme,
        sequenceOrder: w.sequence_order,
        state,
        summary: w.summary,
        levels: worldLevels.map((l) => ({
          id: l.id,
          title: l.title,
          kind: l.kind,
          sequenceOrder: l.sequenceOrder,
          syllabusTag: l.syllabusTag,
          isBoss: l.isBoss,
          minutes: l.minutes,
          timeLimitMinutes: l.timeLimitMinutes,
          state: l.state,
        })),
      };
    });
  });
}
