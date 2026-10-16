import { pool } from "./pool.js";

// Seeds exactly what CURRICULUM.md specifies for levels 1-3 (the only levels in
// scope for ROADMAP.md Milestone 3 — see the plan's "why levels 1-3" note).
//
// Deviation from CURRICULUM.md worth flagging: level 3's starter code reads
// `bridgeLength` from stdin (via Scanner) instead of a hardcoded literal, so the
// hidden test can vary it without patching source text. Levels 1-3 predate the
// robot world-interaction API (robot.move() etc., introduced at level 4), so
// stdin/stdout is the only test-input mechanism available at this milestone —
// this is the standard online-judge approach (TECH.md §10) and preserves the
// level's actual learning objective (a formula, not a hardcoded answer).

export async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [lang] } = await client.query(
      `INSERT INTO languages (code, name) VALUES ('java', 'Java')
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id`
    );

    const { rows: [path] } = await client.query(
      `INSERT INTO learning_paths (language_id, code, name, sequence_order)
       VALUES ($1, 'java-fundamentals', 'Java Fundamentals', 1)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [lang.id]
    );

    const { rows: [world] } = await client.query(
      `INSERT INTO worlds (learning_path_id, name, sequence_order)
       SELECT $1, 'The Silent Foundry', 1
       WHERE NOT EXISTS (SELECT 1 FROM worlds WHERE learning_path_id = $1 AND sequence_order = 1)
       RETURNING id`,
      [path.id]
    );
    const worldId = world?.id ?? (await client.query(
      `SELECT id FROM worlds WHERE learning_path_id = $1 AND sequence_order = 1`, [path.id]
    )).rows[0].id;

    // Wipe and re-insert levels/challenges/test_cases for idempotent re-seeding
    // in local dev (safe: this is dev-only data, see devUser.ts).
    await client.query(
      `DELETE FROM test_cases WHERE challenge_id IN (SELECT id FROM challenges WHERE level_id IN (SELECT id FROM levels WHERE world_id = $1))`,
      [worldId]
    );
    await client.query(
      `DELETE FROM challenges WHERE level_id IN (SELECT id FROM levels WHERE world_id = $1)`,
      [worldId]
    );
    await client.query(`DELETE FROM levels WHERE world_id = $1`, [worldId]);

    let previousLevelId: string | null = null;

    // Level 1 — Wake-up (print / output)
    previousLevelId = await insertLevel(client, {
      worldId,
      title: "Wake-up",
      story: "The foundry's first robot has powered on but has never spoken. Your first line of code gives it a voice.",
      concept: "print-output",
      syllabusTag: "Unit 1: Program Structure",
      sequenceOrder: 1,
      prerequisiteLevelId: null,
      instructions: "Make the robot say hello to the foundry.",
      starterCode: [
        "public class Robot {",
        "    public static void main(String[] args) {",
        "        // Write your code below this line",
        "        ",
        "    }",
        "}",
        "",
      ].join("\n"),
      testCases: [
        {
          isHidden: false,
          description: "Robot says hello to the foundry",
          input: null,
          expected: { stdout: "Hello, Foundry!" },
        },
      ],
    });

    // Level 2 — Name tag (variables, strings)
    previousLevelId = await insertLevel(client, {
      worldId,
      title: "Name tag",
      story: "The robot needs an identity before it can be registered in the foundry's systems.",
      concept: "variables-strings",
      syllabusTag: "Unit 1: Variables & Data Types",
      sequenceOrder: 2,
      prerequisiteLevelId: previousLevelId,
      instructions: "Store the robot's name and power level, then print the robot's name tag.",
      starterCode: [
        "public class Robot {",
        "    public static void main(String[] args) {",
        "        String name = \"\";      // give your robot a name",
        "        int power = 0;          // set its power level (0-100)",
        "        ",
        "        System.out.println(name + \" - Power: \" + power);",
        "    }",
        "}",
        "",
      ].join("\n"),
      testCases: [
        {
          isHidden: false,
          description: "Name tag shows a name and a numeric power level",
          input: null,
          expected: { stdoutPattern: "^.+ - Power: \\d+$" },
        },
      ],
    });

    // Level 3 — Power math (operators)
    previousLevelId = await insertLevel(client, {
      worldId,
      title: "Power math",
      story: "A bridge lies ahead; crossing it costs battery proportional to its length.",
      concept: "operators",
      syllabusTag: "Unit 1: Operators",
      sequenceOrder: 3,
      prerequisiteLevelId: previousLevelId,
      instructions: "Calculate the battery needed to cross a bridge that is `bridgeLength` meters long, at 2 battery per meter.",
      starterCode: [
        "import java.util.Scanner;",
        "",
        "public class Robot {",
        "    public static void main(String[] args) {",
        "        Scanner scanner = new Scanner(System.in);",
        "        int bridgeLength = scanner.nextInt(); // meters",
        "        int batteryPerMeter = 2;",
        "        ",
        "        int batteryNeeded = 0; // replace with the correct formula",
        "        ",
        "        System.out.println(\"Battery needed: \" + batteryNeeded);",
        "    }",
        "}",
        "",
      ].join("\n"),
      testCases: [
        {
          isHidden: false,
          description: "Battery needed for a 12-meter bridge",
          input: { stdin: "12" },
          expected: { stdout: "Battery needed: 24" },
        },
        {
          isHidden: true,
          description: "Battery needed for a different bridge length (catches a hardcoded answer)",
          input: { stdin: "7" },
          expected: { stdout: "Battery needed: 14" },
        },
      ],
    });

    await client.query("COMMIT");
    console.log("Seed complete: languages, learning_paths, worlds, levels 1-3 with challenges/test_cases.");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

interface SeedTestCase {
  isHidden: boolean;
  description: string;
  input: Record<string, unknown> | null;
  expected: Record<string, unknown>;
}

async function insertLevel(
  client: import("pg").PoolClient,
  level: {
    worldId: string;
    title: string;
    story: string;
    concept: string;
    syllabusTag: string;
    sequenceOrder: number;
    prerequisiteLevelId: string | null;
    instructions: string;
    starterCode: string;
    testCases: SeedTestCase[];
  }
): Promise<string> {
  const { rows: [levelRow] } = await client.query(
    `INSERT INTO levels (world_id, title, story, concept, syllabus_tag, sequence_order, is_boss, prerequisite_level_id)
     VALUES ($1, $2, $3, $4, $5, $6, false, $7) RETURNING id`,
    [level.worldId, level.title, level.story, level.concept, level.syllabusTag, level.sequenceOrder, level.prerequisiteLevelId]
  );

  const { rows: [challengeRow] } = await client.query(
    `INSERT INTO challenges (level_id, starter_code, instructions) VALUES ($1, $2, $3) RETURNING id`,
    [levelRow.id, level.starterCode, level.instructions]
  );

  for (let i = 0; i < level.testCases.length; i++) {
    const tc = level.testCases[i];
    await client.query(
      `INSERT INTO test_cases (challenge_id, is_hidden, input_data, expected_output, description, sequence_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [challengeRow.id, tc.isHidden, tc.input, tc.expected, tc.description, i]
    );
  }

  return levelRow.id;
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
