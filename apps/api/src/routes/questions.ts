import type { FastifyInstance } from "fastify";
import type { AnswerResponse } from "@atlas/shared-types";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { isAnswerCorrect } from "../evaluation.js";
import { findPathLevel, grantReward } from "../progression.js";
import { CHECK_FIRST_TRY_XP, rewardKey } from "../reward/reward.js";
import { locked, notFound } from "./levels.js";

// Knowledge checks inside lessons are formative: each answer is graded on its
// own and explained. The explanation is withheld until the learner gets it
// right or has made two wrong attempts, so the first try is a real attempt.
// Quiz and mock questions are deliberately NOT checkable here — they're only
// graded as a whole attempt (levels.ts), so a quiz can't be probed one by one.
const WRONG_TRIES_BEFORE_EXPLANATION = 2;

export async function questionsRoutes(app: FastifyInstance) {
  app.post("/questions/:id/answer", async (req, reply) => {
    const { id } = req.params as { id: string };
    const answer = (req.body as { answer?: unknown } | undefined)?.answer;
    if (typeof answer !== "string" || answer.length > 2000) {
      return reply.code(400).send({ error: { code: "bad_request", message: "answer must be a string" } });
    }

    const { rows: [q] } = await pool.query(
      `SELECT q.id, q.level_id, q.kind, q.options, q.answer, q.explanation, lv.kind AS level_kind
       FROM questions q JOIN levels lv ON lv.id = q.level_id WHERE q.id = $1`,
      [id]
    );
    if (!q || q.level_kind !== "lesson") return notFound(reply, "Question not found");

    const found = await findPathLevel(pool, DEV_USER_ID, q.level_id);
    if (!found || found.level.state === "locked") return locked(reply);

    const { rows: [history] } = await pool.query(
      `SELECT COUNT(*)::int AS attempts, COUNT(*) FILTER (WHERE NOT correct)::int AS wrong
       FROM question_attempts WHERE user_id = $1 AND question_id = $2`,
      [DEV_USER_ID, id]
    );

    const correct = isAnswerCorrect(q.kind, q.answer, answer);
    await pool.query(
      `INSERT INTO question_attempts (user_id, question_id, answer, correct) VALUES ($1, $2, $3, $4)`,
      [DEV_USER_ID, id, answer, correct]
    );

    const reward = correct && history.attempts === 0
      ? await grantReward(pool, DEV_USER_ID, rewardKey.check(id), CHECK_FIRST_TRY_XP, 0, "check_first_try")
      : { xp: 0 };

    const option = (q.options as { id: string; feedback?: string }[] | null)?.find((o) => o.id === answer);
    const wrongSoFar = history.wrong + (correct ? 0 : 1);
    const response: AnswerResponse = {
      correct,
      feedback: correct ? null : (option?.feedback ?? "Not quite — trace the code one line at a time and try again."),
      explanation: correct || wrongSoFar >= WRONG_TRIES_BEFORE_EXPLANATION ? q.explanation : "",
      xpGained: reward.xp,
    };
    return response;
  });
}
