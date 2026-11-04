import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { evaluateSubmission, type TestCaseSpec } from "../execution/evaluateSubmission.js";
import { rung0Message, WRONG_OUTPUT_MESSAGE } from "../hints/rung0.js";
import { calculateReward, masteredState, rewardKey } from "../reward/reward.js";
import { checkRequirements, matchFeedback, type CodeRequirement } from "../evaluation.js";
import { completeMockIfReady, findPathLevel, grantReward, markConceptMastered, upgradeLevelState } from "../progression.js";
import { MAX_CODE_CHARS } from "./playground.js";
import { locked, notFound } from "./levels.js";

// API_SPEC.md: POST /submissions returns immediately with a pending status;
// the actual compile/run happens asynchronously (ARCHITECTURE.md §3) and the
// client polls GET /submissions/:id. Hidden test results are translated into
// a narrative "twist", never returned as a raw list (SECURITY.md/API_SPEC.md).
export async function submissionsRoutes(app: FastifyInstance) {
  app.post("/submissions", async (req, reply) => {
    const { challengeId, code } = (req.body ?? {}) as { challengeId?: unknown; code?: unknown };
    if (typeof challengeId !== "string" || typeof code !== "string" || code.length > MAX_CODE_CHARS) {
      return reply.code(400).send({ error: { code: "bad_request", message: "challengeId and code are required" } });
    }

    const { rows: [challenge] } = await pool.query(`SELECT level_id FROM challenges WHERE id = $1`, [challengeId]);
    if (!challenge) return notFound(reply, "Challenge not found");
    const found = await findPathLevel(pool, DEV_USER_ID, challenge.level_id);
    if (!found || found.level.state === "locked") return locked(reply);

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
      `SELECT s.id, s.status, s.code, c.requirements, c.feedback
       FROM submissions s JOIN challenges c ON c.id = s.challenge_id
       WHERE s.id = $1 AND s.user_id = $2`,
      [id, DEV_USER_ID]
    );
    if (!submission) {
      return reply.code(404).send({ error: { code: "not_found", message: "Submission not found" } });
    }

    if (submission.status === "pending") {
      return {
        status: "pending",
        visibleResults: [],
        visibleStdout: null,
        visibleStderr: null,
        hiddenTwist: null,
        rung0Message: null,
        targetedFeedback: null,
      };
    }

    const { rows: resultRows } = await pool.query(
      `SELECT sr.passed, sr.error_classification, sr.actual_output, tc.is_hidden, tc.description
       FROM submission_results sr JOIN test_cases tc ON tc.id = sr.test_case_id
       WHERE sr.submission_id = $1 ORDER BY tc.sequence_order`,
      [id]
    );

    const requirementResults = checkRequirements(submission.code, submission.requirements as CodeRequirement[]);
    const visibleResults = [
      ...resultRows.filter((r) => !r.is_hidden).map((r) => ({ description: r.description, passed: r.passed })),
      ...requirementResults,
    ];

    const firstVisible = resultRows.find((r) => !r.is_hidden);
    const visibleStdout: string | null = firstVisible?.actual_output?.stdout ?? null;
    const visibleStderr: string | null = firstVisible?.actual_output?.stderr || null;

    // The twist only makes sense once the visible goal is met ("the gate opened...").
    const visiblePassed = resultRows.filter((r) => !r.is_hidden).every((r) => r.passed);
    const failedHidden = resultRows.find((r) => r.is_hidden && !r.passed);
    const hiddenTwist = visiblePassed && failedHidden
      ? { triggered: true, narrativeMessage: `The gate opened... but a new case appeared: ${failedHidden.description}` }
      : null;

    const firstFailure = resultRows.find((r) => !r.passed);
    const failedRequirement = requirementResults.find((r) => !r.passed);
    const message = !firstFailure
      ? (failedRequirement ? `Your output is right, but this trial also asks: ${failedRequirement.description}.` : null)
      : firstFailure.error_classification === "none"
        ? (firstFailure.is_hidden ? null : WRONG_OUTPUT_MESSAGE) // hidden misses are explained by hiddenTwist
        : rung0Message(firstFailure.error_classification, firstFailure.actual_output?.stderr ?? "");

    const targetedFeedback =
      submission.status === "passed" ? null : matchFeedback(submission.feedback, submission.code, visibleStdout ?? "");

    return {
      status: submission.status,
      visibleResults,
      visibleStdout,
      visibleStderr,
      hiddenTwist,
      rung0Message: message,
      targetedFeedback,
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

  // Static requirements (e.g. "defines a class that extends Member") are part
  // of passing: correct output from the wrong technique isn't the lesson.
  const { rows: [challengeRow] } = await pool.query(`SELECT requirements FROM challenges WHERE id = $1`, [challengeId]);
  const requirementsMet = checkRequirements(code, challengeRow.requirements as CodeRequirement[]).every((r) => r.passed);
  const overallStatus = outcome.overallStatus === "passed" && !requirementsMet ? "failed" : outcome.overallStatus;

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

    await client.query(`UPDATE submissions SET status = $1 WHERE id = $2`, [overallStatus, submissionId]);

    if (overallStatus === "passed") {
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

// Rewards are keyed per level, so only the first pass pays; replays keep the
// best state (a later clean pass can still upgrade 'assisted' to ★).
async function applyReward(client: import("pg").PoolClient, submissionId: string, challengeId: string) {
  const { rows: [level] } = await client.query(
    `SELECT lv.id, lv.concept, lv.kind FROM levels lv JOIN challenges c ON c.level_id = lv.id WHERE c.id = $1`,
    [challengeId]
  );
  const { rows: [rung4] } = await client.query(
    `SELECT EXISTS (SELECT 1 FROM hint_usage WHERE user_id = $1 AND challenge_id = $2 AND rung = 4) AS used`,
    [DEV_USER_ID, challengeId]
  );

  const usedRung4: boolean = rung4.used;
  const { xp, coins } = calculateReward(usedRung4);

  if (level.kind === "mock") {
    await completeMockIfReady(client, DEV_USER_ID, level.id);
  } else {
    await upgradeLevelState(client, DEV_USER_ID, level.id, masteredState(usedRung4), {
      bestSubmissionId: submissionId,
      usedRung4,
    });
    await markConceptMastered(client, DEV_USER_ID, level.concept);
  }

  await grantReward(client, DEV_USER_ID, rewardKey.trial(level.id), xp, coins, "level_passed", submissionId);
}
