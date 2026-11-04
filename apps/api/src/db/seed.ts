import type { PoolClient } from "pg";
import { pool } from "./pool.js";
import { REALMS, PATH } from "../content/index.js";
import type { LevelDef } from "../content/types.js";

// Syncs the authored curriculum (src/content/, CURRICULUM.md) into Postgres.
// Every row is upserted by a stable slug rather than wiped and re-inserted, so
// re-seeding keeps the dev user's progress and never trips foreign keys from
// existing submissions. All levels form one prerequisite chain across realms:
// a realm's first quest requires the previous realm's guardian quiz.
//
// Level 3 (Power math) still reads `bridgeLength` from stdin instead of a
// literal so a hidden test can vary it — stdin/stdout is the test-input
// mechanism for every trial (TECH.md §10 online-judge approach).

const LEGACY_LEVEL_SLUGS: Record<string, string> = {
  "Wake-up": "foundry-wake-up",
  "Name tag": "foundry-name-tag",
  "Power math": "foundry-power-math",
};

export async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [lang] } = await client.query(
      `INSERT INTO languages (code, name) VALUES ('java', 'Java')
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id`
    );

    await migrateLegacyRows(client);

    const { rows: [path] } = await client.query(
      `INSERT INTO learning_paths (language_id, code, name, sequence_order)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [lang.id, PATH.code, PATH.name]
    );

    const levelIdBySlug = new Map<string, string>();
    let previousLevelId: string | null = null;

    for (let r = 0; r < REALMS.length; r++) {
      const realm = REALMS[r];
      const { rows: [world] } = await client.query(
        `INSERT INTO worlds (learning_path_id, slug, name, subtitle, story, theme, summary, sequence_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO UPDATE SET learning_path_id = $1, name = $3, subtitle = $4, story = $5,
           theme = $6, summary = $7, sequence_order = $8
         RETURNING id`,
        [path.id, realm.slug, realm.name, realm.subtitle, realm.story, realm.theme, realm.summary, r + 1]
      );

      for (let i = 0; i < realm.levels.length; i++) {
        const level = realm.levels[i];
        const levelId = await upsertLevel(client, world.id, level, i + 1, previousLevelId);
        levelIdBySlug.set(level.slug, levelId);
        previousLevelId = levelId;
      }
    }

    // Questions go in a second pass so reviewLesson can point at any level.
    for (const realm of REALMS) {
      for (const level of realm.levels) {
        await syncQuestions(client, levelIdBySlug.get(level.slug)!, level, levelIdBySlug);
      }
    }

    await removeStaleLevels(client, [...levelIdBySlug.values()]);

    await client.query("COMMIT");
    console.log(`Seed complete: ${REALMS.length} realms, ${levelIdBySlug.size} levels.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// The Milestone 3 seed created path 'java-fundamentals', an unslugged world and
// three unslugged levels. Give them slugs so the upserts below adopt them
// (keeping their submissions and progress) instead of duplicating them.
async function migrateLegacyRows(client: PoolClient) {
  await client.query(
    `UPDATE learning_paths SET code = $1 WHERE code = 'java-fundamentals'
     AND NOT EXISTS (SELECT 1 FROM learning_paths WHERE code = $1)`,
    [PATH.code]
  );
  await client.query(`UPDATE worlds SET slug = 'foundry' WHERE slug IS NULL AND name = 'The Silent Foundry'`);
  for (const [title, slug] of Object.entries(LEGACY_LEVEL_SLUGS)) {
    await client.query(`UPDATE levels SET slug = $2 WHERE slug IS NULL AND title = $1`, [title, slug]);
  }
}

async function upsertLevel(
  client: PoolClient,
  worldId: string,
  level: LevelDef,
  sequenceOrder: number,
  prerequisiteLevelId: string | null
): Promise<string> {
  const content = { blocks: level.blocks ?? [], summary: level.summary ?? null };
  const { rows: [row] } = await client.query(
    `INSERT INTO levels (world_id, slug, title, story, concept, syllabus_tag, sequence_order, is_boss,
       prerequisite_level_id, kind, content, minutes, passing_score, time_limit_minutes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT (slug) DO UPDATE SET world_id = $1, title = $3, story = $4, concept = $5, syllabus_tag = $6,
       sequence_order = $7, is_boss = $8, prerequisite_level_id = $9, kind = $10, content = $11,
       minutes = $12, passing_score = $13, time_limit_minutes = $14
     RETURNING id`,
    [
      worldId,
      level.slug,
      level.title,
      level.story,
      level.concept,
      level.syllabusTag,
      sequenceOrder,
      level.kind === "quiz",
      prerequisiteLevelId,
      level.kind,
      JSON.stringify(content),
      level.minutes,
      level.passingScore ?? null,
      level.timeLimitMinutes ?? null,
    ]
  );

  const challenge = level.challenge;
  if (!challenge) return row.id;

  const { rows: [challengeRow] } = await client.query(
    `INSERT INTO challenges (level_id, starter_code, instructions, guidance, steps, hints, solution,
       solution_explanation, requirements, feedback)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (level_id) DO UPDATE SET starter_code = $2, instructions = $3, guidance = $4, steps = $5,
       hints = $6, solution = $7, solution_explanation = $8, requirements = $9, feedback = $10
     RETURNING id`,
    [
      row.id,
      challenge.starterCode,
      challenge.instructions,
      challenge.guidance,
      JSON.stringify(challenge.steps ?? []),
      JSON.stringify(challenge.hints),
      challenge.solution,
      challenge.solutionExplanation,
      JSON.stringify(challenge.requirements ?? []),
      JSON.stringify(challenge.feedback ?? []),
    ]
  );

  for (let i = 0; i < challenge.tests.length; i++) {
    const tc = challenge.tests[i];
    const expected = tc.stdout !== undefined ? { stdout: tc.stdout } : { stdoutPattern: tc.stdoutPattern };
    await client.query(
      `INSERT INTO test_cases (challenge_id, is_hidden, input_data, expected_output, description, sequence_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (challenge_id, sequence_order) DO UPDATE SET is_hidden = $2, input_data = $3,
         expected_output = $4, description = $5`,
      [challengeRow.id, tc.hidden ?? false, tc.stdin !== undefined ? { stdin: tc.stdin } : null, expected, tc.description, i]
    );
  }

  // Tests removed from the content: drop their (dev-only) results first.
  const stale = `SELECT id FROM test_cases WHERE challenge_id = $1 AND sequence_order >= $2`;
  await client.query(`DELETE FROM submission_results WHERE test_case_id IN (${stale})`, [challengeRow.id, challenge.tests.length]);
  await client.query(`DELETE FROM test_cases WHERE id IN (${stale})`, [challengeRow.id, challenge.tests.length]);

  return row.id;
}

async function syncQuestions(
  client: PoolClient,
  levelId: string,
  level: LevelDef,
  levelIdBySlug: Map<string, string>
) {
  const questions = level.questions ?? [];
  const slugs: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const slug = `${level.slug}:${q.slug}`;
    slugs.push(slug);
    const reviewLevelId = q.reviewLesson ? levelIdBySlug.get(q.reviewLesson) : null;
    if (q.reviewLesson && !reviewLevelId) {
      throw new Error(`${slug}: reviewLesson "${q.reviewLesson}" is not a level slug`);
    }
    await client.query(
      `INSERT INTO questions (level_id, slug, sequence_order, kind, prompt, code, options, answer, explanation,
         review_level_id, stage)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (slug) DO UPDATE SET level_id = $1, sequence_order = $3, kind = $4, prompt = $5, code = $6,
         options = $7, answer = $8, explanation = $9, review_level_id = $10, stage = $11`,
      [
        levelId,
        slug,
        i,
        q.kind,
        q.prompt,
        q.code ?? null,
        q.options ? JSON.stringify(q.options) : null,
        JSON.stringify(q.answer),
        q.explanation,
        reviewLevelId,
        q.stage ?? null,
      ]
    );
  }

  const stale = `SELECT id FROM questions WHERE level_id = $1 AND NOT (slug = ANY($2::text[]))`;
  await client.query(`DELETE FROM question_attempts WHERE question_id IN (${stale})`, [levelId, slugs]);
  await client.query(`DELETE FROM questions WHERE id IN (${stale})`, [levelId, slugs]);
}

// Levels that no longer exist in the content, with every dev-only row that
// references them. Order matters: children before parents.
async function removeStaleLevels(client: PoolClient, keepIds: string[]) {
  const stale = `SELECT id FROM levels WHERE NOT (id = ANY($1::uuid[]))`;
  const staleChallenges = `SELECT id FROM challenges WHERE level_id IN (${stale})`;
  const statements = [
    `UPDATE levels SET prerequisite_level_id = NULL WHERE prerequisite_level_id IN (${stale})`,
    `UPDATE questions SET review_level_id = NULL WHERE review_level_id IN (${stale})`,
    `DELETE FROM question_attempts WHERE question_id IN (SELECT id FROM questions WHERE level_id IN (${stale}))`,
    `DELETE FROM questions WHERE level_id IN (${stale})`,
    `DELETE FROM quiz_attempts WHERE level_id IN (${stale})`,
    `DELETE FROM lesson_completions WHERE level_id IN (${stale})`,
    `DELETE FROM progress WHERE level_id IN (${stale})`,
    `DELETE FROM hint_usage WHERE challenge_id IN (${staleChallenges})`,
    `DELETE FROM submission_results WHERE submission_id IN (SELECT id FROM submissions WHERE challenge_id IN (${staleChallenges}))`,
    `UPDATE reward_transactions SET submission_id = NULL WHERE submission_id IN (SELECT id FROM submissions WHERE challenge_id IN (${staleChallenges}))`,
    `DELETE FROM submissions WHERE challenge_id IN (${staleChallenges})`,
    `DELETE FROM test_cases WHERE challenge_id IN (${staleChallenges})`,
    `DELETE FROM challenges WHERE level_id IN (${stale})`,
    `DELETE FROM levels WHERE id IN (${stale})`,
  ];
  for (const sql of statements) {
    await client.query(sql, [keepIds]);
  }
  await client.query(`DELETE FROM worlds WHERE id NOT IN (SELECT DISTINCT world_id FROM levels)`);
  await client.query(`DELETE FROM learning_paths WHERE id NOT IN (SELECT DISTINCT learning_path_id FROM worlds)`);
}

// Only run standalone (seed the DB and exit) when this file is executed directly,
// e.g. `tsx src/db/seed.ts` — `init.ts` imports `seed()` instead and manages the
// pool lifecycle itself so schema-apply and seeding share one pool.
const isDirectRun = process.argv[1] && process.argv[1].endsWith("seed.ts");
if (isDirectRun) {
  seed()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      pool.end().finally(() => process.exit(1));
    });
}
