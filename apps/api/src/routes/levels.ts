import type { FastifyInstance, FastifyReply } from "fastify";
import type {
  ChallengeView,
  LessonCompleteResponse,
  LevelDetail,
  PublicQuestion,
  QuizAttemptRequest,
  QuizAttemptResponse,
} from "@atlas/shared-types";
import { pool } from "../db/pool.js";
import { DEV_USER_ID } from "../devUser.js";
import { isAnswerCorrect } from "../evaluation.js";
import { ladderState } from "../hints/ladder.js";
import {
  completeMockIfReady,
  findPathLevel,
  grantReward,
  markConceptMastered,
  quizStatus,
  upgradeLevelState,
} from "../progression.js";
import {
  LESSON_COINS,
  LESSON_XP,
  QUIZ_PASS_COINS,
  QUIZ_PASS_XP,
  REVIEW_XP,
  quizImprovementXp,
  quizScore,
  rewardKey,
} from "../reward/reward.js";

const DEFAULT_PASSING_SCORE = 80;

export function notFound(reply: FastifyReply, message: string) {
  return reply.code(404).send({ error: { code: "not_found", message } });
}

export function locked(reply: FastifyReply) {
  return reply.code(403).send({ error: { code: "locked", message: "Finish the previous quest to unlock this one." } });
}

// API_SPEC.md: no route below ever selects a question's answer key, a
// challenge's solution (unless earned, see challenges.ts) or a hidden test.
export async function levelsRoutes(app: FastifyInstance) {
  app.get("/levels/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const found = await findPathLevel(pool, DEV_USER_ID, id);
    if (!found) return notFound(reply, "Level not found");
    const { level: pathLevel, next } = found;

    const { rows: [level] } = await pool.query(
      `SELECT lv.id, lv.story, lv.content, lv.passing_score FROM levels lv WHERE lv.id = $1`,
      [id]
    );

    const detail: LevelDetail = {
      id,
      worldId: pathLevel.worldId,
      worldName: pathLevel.worldName,
      title: pathLevel.title,
      story: level.story,
      concept: pathLevel.concept,
      kind: pathLevel.kind,
      syllabusTag: pathLevel.syllabusTag,
      minutes: pathLevel.minutes,
      timeLimitMinutes: pathLevel.timeLimitMinutes,
      state: pathLevel.state,
      blocks: [],
      summary: level.content?.summary ?? null,
      questions: [],
      challenge: null,
      quiz: null,
      nextLevelId: next?.id ?? null,
    };

    // A locked level shows its briefing (title, story, summary) but none of
    // its content — the map stays readable without letting anyone skip ahead.
    if (pathLevel.state === "locked") return detail;

    detail.blocks = level.content?.blocks ?? [];
    detail.questions = await publicQuestions(id, pathLevel.kind === "lesson");
    detail.challenge = await challengeView(id);
    if (pathLevel.kind === "quiz" || pathLevel.kind === "mock") {
      detail.quiz = await quizStatus(pool, DEV_USER_ID, id, level.passing_score ?? DEFAULT_PASSING_SCORE);
    }
    return detail;
  });

  // A lesson is complete once every knowledge check in it has been answered
  // correctly. Completing it again later counts as a review (quiz retries).
  app.post("/levels/:id/complete", async (req, reply) => {
    const { id } = req.params as { id: string };
    const found = await findPathLevel(pool, DEV_USER_ID, id);
    if (!found) return notFound(reply, "Level not found");
    const { level, next } = found;
    if (level.state === "locked") return locked(reply);
    if (level.kind !== "lesson") {
      return reply.code(400).send({ error: { code: "not_a_lesson", message: "Only lessons are completed this way." } });
    }

    const { rows: unanswered } = await pool.query(
      `SELECT q.id FROM questions q
       WHERE q.level_id = $1 AND NOT EXISTS (
         SELECT 1 FROM question_attempts a WHERE a.question_id = q.id AND a.user_id = $2 AND a.correct)`,
      [id, DEV_USER_ID]
    );
    if (unanswered.length > 0) {
      return reply.code(409).send({
        error: { code: "checks_incomplete", message: "Answer every knowledge check correctly to finish this lesson." },
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`INSERT INTO lesson_completions (user_id, level_id) VALUES ($1, $2)`, [DEV_USER_ID, id]);
      await upgradeLevelState(client, DEV_USER_ID, id, "mastered");
      await markConceptMastered(client, DEV_USER_ID, level.concept);
      const lessonReward = await grantReward(
        client, DEV_USER_ID, rewardKey.lesson(id), LESSON_XP, LESSON_COINS, "lesson_completed"
      );

      // Revisiting a lesson a failed quiz pointed at earns review XP, once per
      // failed attempt — only the latest attempt of each quiz counts.
      const { rows: pendingReviews } = await client.query(
        `SELECT DISTINCT ON (qa.level_id) qa.id, qa.passed, qa.missed_review_level_ids
         FROM quiz_attempts qa WHERE qa.user_id = $1
         ORDER BY qa.level_id, qa.created_at DESC`,
        [DEV_USER_ID]
      );
      let reviewXp = 0;
      for (const attempt of pendingReviews) {
        if (attempt.passed || !attempt.missed_review_level_ids.includes(id)) continue;
        const granted = await grantReward(
          client, DEV_USER_ID, rewardKey.review(attempt.id, id), REVIEW_XP, 0, "topic_reviewed"
        );
        reviewXp += granted.xp;
      }

      await client.query("COMMIT");
      const response: LessonCompleteResponse = {
        xpGained: lessonReward.xp,
        coinsGained: lessonReward.coins,
        reviewXp,
        nextLevelId: next?.id ?? null,
      };
      return response;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  });

  // Graded entirely server-side. A failed attempt returns which questions were
  // missed and the misconception behind each wrong pick, but never the answer
  // key — explanations unlock only after a pass, so retries test understanding
  // rather than recall of the previous attempt.
  app.post("/levels/:id/attempts", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as Partial<QuizAttemptRequest> | undefined;
    const answers = body?.answers;
    if (!answers || typeof answers !== "object") {
      return reply.code(400).send({ error: { code: "bad_request", message: "answers is required" } });
    }
    const elapsedSeconds = Number.isInteger(body?.elapsedSeconds) ? (body!.elapsedSeconds as number) : null;

    const found = await findPathLevel(pool, DEV_USER_ID, id);
    if (!found) return notFound(reply, "Level not found");
    const { level, next } = found;
    if (level.state === "locked") return locked(reply);
    if (level.kind !== "quiz" && level.kind !== "mock") {
      return reply.code(400).send({ error: { code: "not_a_quiz", message: "This level has no quiz." } });
    }

    const { rows: [levelRow] } = await pool.query(`SELECT passing_score FROM levels WHERE id = $1`, [id]);
    const passingScore = levelRow.passing_score ?? DEFAULT_PASSING_SCORE;
    const status = await quizStatus(pool, DEV_USER_ID, id, passingScore);
    if (!status.canAttempt) {
      return reply.code(409).send({
        error: { code: "review_required", message: "Review the lessons you missed before retrying." },
      });
    }

    const { rows: questions } = await pool.query(
      `SELECT q.id, q.kind, q.options, q.answer, q.explanation, q.review_level_id, rl.title AS review_title
       FROM questions q LEFT JOIN levels rl ON rl.id = q.review_level_id
       WHERE q.level_id = $1 ORDER BY q.sequence_order`,
      [id]
    );

    const graded = questions.map((q) => {
      const given = typeof answers[q.id] === "string" ? answers[q.id] : "";
      const correct = isAnswerCorrect(q.kind, q.answer, given);
      const option = (q.options as { id: string; feedback?: string }[] | null)?.find((o) => o.id === given);
      return { q, given, correct, feedback: correct ? null : (option?.feedback ?? null) };
    });

    const correctCount = graded.filter((g) => g.correct).length;
    const score = quizScore(correctCount, questions.length);
    const passed = score >= passingScore;
    const missedReviewIds = [
      ...new Set(graded.filter((g) => !g.correct && g.q.review_level_id).map((g) => g.q.review_level_id as string)),
    ];

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows: [attempt] } = await client.query(
        `INSERT INTO quiz_attempts (user_id, level_id, score, correct_count, total_count, passed,
           missed_review_level_ids, answers, elapsed_seconds)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          DEV_USER_ID, id, score, correctCount, questions.length, passed,
          JSON.stringify(missedReviewIds), JSON.stringify(answers), elapsedSeconds,
        ]
      );

      let xp = 0;
      let coins = 0;
      const improvement = await grantReward(
        client, DEV_USER_ID, rewardKey.quizImprovement(attempt.id),
        quizImprovementXp(status.bestScore, score), 0, "quiz_improved"
      );
      xp += improvement.xp;

      let levelState = level.state;
      if (passed) {
        const pass = await grantReward(
          client, DEV_USER_ID, rewardKey.quizPass(id), QUIZ_PASS_XP, QUIZ_PASS_COINS, "quiz_passed"
        );
        xp += pass.xp;
        coins += pass.coins;
        if (level.kind === "mock") {
          levelState = (await completeMockIfReady(client, DEV_USER_ID, id)) ? "mastered" : "in_progress";
        } else {
          await upgradeLevelState(client, DEV_USER_ID, id, "mastered");
          levelState = "mastered";
        }
        await markConceptMastered(client, DEV_USER_ID, level.concept);
      } else {
        await upgradeLevelState(client, DEV_USER_ID, id, "in_progress");
        if (levelState === "available") levelState = "in_progress";
      }

      await client.query("COMMIT");

      const response: QuizAttemptResponse = {
        score,
        passed,
        passingScore,
        correctCount,
        totalCount: questions.length,
        results: graded.map((g) => ({
          questionId: g.q.id,
          correct: g.correct,
          feedback: g.feedback,
          explanation: passed ? g.q.explanation : null,
          reviewLevel: !g.correct && g.q.review_level_id ? { id: g.q.review_level_id, title: g.q.review_title } : null,
        })),
        xpGained: xp,
        coinsGained: coins,
        levelState,
        nextLevelId: next?.id ?? null,
      };
      return response;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  });
}

async function publicQuestions(levelId: string, isLesson: boolean): Promise<PublicQuestion[]> {
  const { rows } = await pool.query(
    `SELECT q.id, q.slug, q.kind, q.prompt, q.code, q.options, q.stage, q.explanation,
            EXISTS (SELECT 1 FROM question_attempts a
                    WHERE a.question_id = q.id AND a.user_id = $2 AND a.correct) AS answered
     FROM questions q WHERE q.level_id = $1 ORDER BY q.sequence_order`,
    [levelId, DEV_USER_ID]
  );
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug.slice(r.slug.indexOf(":") + 1),
    kind: r.kind,
    prompt: r.prompt,
    code: r.code,
    // Strip per-option feedback: it's only returned for the option picked.
    options: (r.options as { id: string; text: string }[] | null)?.map((o) => ({ id: o.id, text: o.text })) ?? null,
    stage: r.stage,
    answeredCorrectly: isLesson && r.answered,
    explanation: isLesson && r.answered ? r.explanation : null,
  }));
}

async function challengeView(levelId: string): Promise<ChallengeView | null> {
  const { rows: [c] } = await pool.query(
    `SELECT id, starter_code, instructions, guidance, steps, hints, requirements, solution, solution_explanation
     FROM challenges WHERE level_id = $1`,
    [levelId]
  );
  if (!c) return null;

  const { rows: visibleTests } = await pool.query(
    `SELECT description FROM test_cases WHERE challenge_id = $1 AND is_hidden = false ORDER BY sequence_order`,
    [c.id]
  );
  const { rows: [last] } = await pool.query(
    `SELECT code FROM submissions WHERE user_id = $1 AND challenge_id = $2 ORDER BY submitted_at DESC LIMIT 1`,
    [DEV_USER_ID, c.id]
  );
  const ladder = await ladderState(pool, DEV_USER_ID, { id: c.id, guidance: c.guidance, hints: c.hints });

  return {
    id: c.id,
    instructions: c.instructions,
    starterCode: c.starter_code,
    lastCode: last?.code ?? null,
    guidance: c.guidance,
    steps: c.steps,
    goalChecklist: [
      ...visibleTests.map((t) => t.description),
      ...(c.requirements as { description: string }[]).map((r) => r.description),
    ],
    hints: ladder.revealed,
    hintsTotal: c.hints.length,
    nextHint: ladder.nextHint,
    failedAttempts: ladder.failedAttempts,
    solved: ladder.solved,
    solutionAvailable: ladder.solutionAvailable,
    solution: ladder.solutionRevealed || ladder.solved
      ? { code: c.solution, explanation: c.solution_explanation }
      : null,
  };
}
