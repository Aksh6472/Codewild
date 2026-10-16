import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { evaluateSubmission, type TestCaseSpec } from "../execution/evaluateSubmission.js";
import { rung0Message } from "../hints/rung0.js";
import { calculateReward, masteredState } from "../reward/reward.js";

// API_SPEC.md: POST /submissions returns immediately with a pending status;
// the actual compile/run happens asynchronously (ARCHITECTURE.md §3) and the
// client polls GET /submissions/:id. Hidden test results are translated into
// a narrative "twist", never returned as a raw list (SECURITY.md/API_SPEC.md).
export async function submissionsRoutes(app: FastifyInstance) {
  app.post("/submissions", async (req, reply) => {
    const { challengeId, code } = req.body as { challengeId: string; code: string };

    const { rows: [{ count }] } = await pool.query(
      `SELECT COUNT(*)::int AS count FROM submissions WHERE user_id = $1 AND challenge_id = $2`,
      [DEV_USER_ID, challengeId]
    );

    const { rows: [submission] } = await pool.query(
      `INSERT INTO submissions (user_id, challenge_id, code, attempt_number, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
      [DEV_USER_ID, challengeId, code, count + 1]
    );

    // Fire-and-forget: the route returns immediately per API_SPEC.md. Errors
    // inside are caught and persisted as a submission status, not thrown into
    // an unhandled rejection.
    processSubmission(submission.id, challengeId, code).catch((err) => {
      app.log.error(err, `submission ${submission.id} processing failed`);
    });

    return reply.code(202).send({ submissionId: submission.id, status: "pending" });
  });

  app.get("/submissions/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const { rows: [submission] } = await pool.query(
      `SELECT id, status FROM submissions WHERE id = $1 AND user_id = $2`,
      [id, DEV_USER_ID]
    );
    if (!submission) {
      return reply.code(404).send({ error: { code: "not_found", message: "Submission not found" } });
    }

    if (submission.status === "pending") {
      return { status: "pending", visibleResults: [], visibleStdout: null, hiddenTwist: null, rung0Message: null };
    }

    const { rows: resultRows } = await pool.query(
      `SELECT sr.passed, sr.error_classification, sr.actual_output, tc.is_hidden, tc.description
       FROM submission_results sr JOIN test_cases tc ON tc.id = sr.test_case_id
       WHERE sr.submission_id = $1 ORDER BY tc.sequence_order`,
      [id]
    );

    const visibleResults = resultRows
      .filter((r) => !r.is_hidden)
      .map((r) => ({ description: r.description, passed: r.passed }));

    const firstVisible = resultRows.find((r) => !r.is_hidden);
    const visibleStdout: string | null = firstVisible?.actual_output?.stdout ?? null;

    const failedHidden = resultRows.find((r) => r.is_hidden && !r.passed);
    const hiddenTwist = failedHidden
      ? { triggered: true, narrativeMessage: `The gate opened... but a new case appeared: ${failedHidden.description}` }
      : null;

    const firstFailure = resultRows.find((r) => !r.passed);
    const message = firstFailure
      ? rung0Message(firstFailure.error_classification, firstFailure.actual_output?.stderr ?? "")
      : null;

    return {
      status: submission.status,
      visibleResults,
      visibleStdout,
      hiddenTwist,
      rung0Message: message,
    };
  });
}

async function processSubmission(submissionId: string, challengeId: string, code: string) {
  const { rows: testCaseRows } = await pool.query(
    `SELECT id, is_hidden, input_data, expected_output, description
     FROM test_cases WHERE challenge_id = $1 ORDER BY sequence_order`,
    [challengeId]
  );

  const testCases: TestCaseSpec[] = testCaseRows.map((r) => ({
    id: r.id,
    isHidden: r.is_hidden,
    description: r.description,
    input: r.input_data,
    expected: r.expected_output,
  }));

  const outcome = await evaluateSubmission(code, testCases);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const result of outcome.results) {
      await client.query(
        `INSERT INTO submission_results (submission_id, test_case_id, passed, actual_output, error_classification)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          submissionId,
          result.testCaseId,
          result.passed,
          { stdout: result.actualStdout, stderr: result.actualStderr },
          result.errorClassification,
        ]
      );
    }

    await client.query(`UPDATE submissions SET status = $1 WHERE id = $2`, [outcome.overallStatus, submissionId]);

    if (outcome.overallStatus === "passed") {
      await applyReward(client, submissionId, challengeId);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function applyReward(client: import("pg").PoolClient, submissionId: string, challengeId: string) {
  const { rows: [level] } = await client.query(
    `SELECT lv.id, lv.concept FROM levels lv JOIN challenges c ON c.level_id = lv.id WHERE c.id = $1`,
    [challengeId]
  );

  const usedRung4 = false; // AI hint rungs are not built in this milestone (ROADMAP.md Milestone 7)
  const { xp, coins } = calculateReward(usedRung4);
  const state = masteredState(usedRung4);

  await client.query(
    `INSERT INTO progress (user_id, level_id, state, best_submission_id, used_rung_4, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id, level_id) DO UPDATE SET state = $3, best_submission_id = $4, used_rung_4 = $5, updated_at = now()`,
    [DEV_USER_ID, level.id, state, submissionId, usedRung4]
  );

  await client.query(
    `INSERT INTO concept_mastery (user_id, concept, status) VALUES ($1, $2, 'mastered')
     ON CONFLICT (user_id, concept) DO UPDATE SET status = 'mastered'`,
    [DEV_USER_ID, level.concept]
  );

  await client.query(
    `INSERT INTO reward_transactions (user_id, submission_id, xp_delta, coins_delta, reason)
     VALUES ($1, $2, $3, $4, 'level_passed')`,
    [DEV_USER_ID, submissionId, xp, coins]
  );
}
