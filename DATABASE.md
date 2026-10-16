# Data Model — Project Atlas

Proposed relational schema. Nothing here is implemented yet — see [README.md](README.md) status. Column types are PostgreSQL ([TECH.md](TECH.md) §6). Extensibility to future languages ([DECISIONS.md#d4](DECISIONS.md)) is designed in from the start via `languages`/`learning_paths`, even though only Java rows will exist at MVP.

## Entity list and MVP priority

| Entity | MVP-essential? |
|---|---|
| `users` | Yes |
| `languages` | Yes (seeded with one row: Java) |
| `learning_paths` | Yes (seeded with one row: Java Fundamentals) |
| `worlds` | Yes |
| `levels` | Yes |
| `challenges` | Yes (1:1 with level for MVP; modeled separately for future multi-challenge levels) |
| `test_cases` | Yes |
| `submissions` | Yes |
| `submission_results` | Yes |
| `progress` | Yes |
| `concept_mastery` | Yes (simple version: pass/fail + hint-rung history per concept; full mastery *estimation* model is post-MVP) |
| `reward_transactions` | Yes |
| `achievements` | No — post-MVP (P2, [PRD.md](PRD.md)) |
| `hint_usage` | Yes (needed for mastery/★ rules and rate limiting) |
| `quests` (side quests) | No — defer schema until side-quest design is finalized ([CURRICULUM.md](CURRICULUM.md)) |

## Schema

```sql
-- Identity. No plaintext passwords: password_hash only, nullable (OAuth-only users have none).
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    password_hash   TEXT,              -- NULL for OAuth-only accounts; hashed with bcrypt/argon2, never plaintext
    google_sub      TEXT UNIQUE,       -- Google OAuth subject id, nullable
    robot_name      TEXT,              -- the one MVP cosmetic choice, design.md §3.2
    experience_level TEXT NOT NULL CHECK (experience_level IN ('never', 'a_little', 'yes')),
    college_name    TEXT,              -- onboarding question 2, optional, free text or lookup — TBD
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT password_or_oauth CHECK (password_hash IS NOT NULL OR google_sub IS NOT NULL)
);

-- Extensible to Python/C++/JS later (DECISIONS.md D4) without a schema change.
CREATE TABLE languages (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code    TEXT UNIQUE NOT NULL,      -- e.g. 'java'
    name    TEXT NOT NULL
);

CREATE TABLE learning_paths (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id  UUID NOT NULL REFERENCES languages(id),
    code         TEXT UNIQUE NOT NULL, -- e.g. 'java-fundamentals', 'java-oop', 'java-dsa'
    name         TEXT NOT NULL,
    sequence_order INT NOT NULL        -- 1 = Fundamentals, 2 = OOP, 3 = DSA (DECISIONS.md D2)
);

CREATE TABLE worlds (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id),
    name             TEXT NOT NULL,     -- e.g. "The Silent Foundry"
    sequence_order   INT NOT NULL
);

CREATE TABLE levels (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id       UUID NOT NULL REFERENCES worlds(id),
    title          TEXT NOT NULL,
    story          TEXT NOT NULL,
    concept        TEXT NOT NULL,       -- e.g. "for-loop" — joins to CURRICULUM.md topic names
    syllabus_tag   TEXT,                -- e.g. "Unit 2: Loops" (design.md §3.3)
    sequence_order INT NOT NULL,
    is_boss        BOOLEAN NOT NULL DEFAULT false,
    prerequisite_level_id UUID REFERENCES levels(id),  -- single-prereq chain for MVP; a join table would be needed for multi-prereq graphs later
    UNIQUE (world_id, sequence_order)
);

-- 1:1 with levels in MVP. Kept separate so a level could later host multiple challenge variants (e.g. side quests) without restructuring levels.
CREATE TABLE challenges (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id      UUID NOT NULL REFERENCES levels(id),
    starter_code  TEXT NOT NULL,
    instructions  TEXT NOT NULL
);

-- Hidden test cases and their expected output are NEVER sent to the browser (SECURITY.md).
CREATE TABLE test_cases (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id  UUID NOT NULL REFERENCES challenges(id),
    is_hidden     BOOLEAN NOT NULL DEFAULT false,
    input_data    JSONB,          -- e.g. { "sensorReadings": [60,15,80,42,95], "safetyThreshold": 50 }
    expected_output JSONB NOT NULL, -- e.g. { "stdout": "Powered: 3" } or structured world-state assertions
    sequence_order INT NOT NULL
);

CREATE TABLE submissions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id),
    challenge_id  UUID NOT NULL REFERENCES challenges(id),
    code          TEXT NOT NULL,
    attempt_number INT NOT NULL,       -- nth attempt by this user on this challenge
    status        TEXT NOT NULL CHECK (status IN ('pending', 'passed', 'failed', 'error', 'timeout')),
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submission_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id   UUID NOT NULL REFERENCES submissions(id),
    test_case_id    UUID NOT NULL REFERENCES test_cases(id),
    passed          BOOLEAN NOT NULL,
    actual_output   JSONB,
    error_classification TEXT          -- e.g. 'compile_error', 'npe', 'timeout', 'array_index_oob' — drives rung-0 messages
);

CREATE TABLE progress (
    user_id       UUID NOT NULL REFERENCES users(id),
    level_id      UUID NOT NULL REFERENCES levels(id),
    state         TEXT NOT NULL CHECK (state IN ('locked', 'available', 'in_progress', 'mastered')),
    best_submission_id UUID REFERENCES submissions(id),
    used_rung_4   BOOLEAN NOT NULL DEFAULT false,  -- disqualifies 'mastered' star per design.md §3.3/§3.5
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, level_id)
);

CREATE TABLE concept_mastery (
    user_id       UUID NOT NULL REFERENCES users(id),
    concept       TEXT NOT NULL,        -- matches levels.concept
    status        TEXT NOT NULL CHECK (status IN ('locked', 'in_progress', 'mastered')),
    PRIMARY KEY (user_id, concept)
);

CREATE TABLE reward_transactions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id),
    submission_id UUID REFERENCES submissions(id),
    xp_delta      INT NOT NULL,
    coins_delta   INT NOT NULL,
    reason        TEXT NOT NULL,        -- e.g. 'level_passed', 'hint_penalty'
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hint_usage (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id),
    submission_id UUID NOT NULL REFERENCES submissions(id),
    rung          INT NOT NULL CHECK (rung BETWEEN 0 AND 4),
    requested_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Relationships

`languages 1—N learning_paths 1—N worlds 1—N levels 1—1 challenges 1—N test_cases`. `users 1—N submissions 1—N submission_results`. `users 1—N progress` (one row per level attempted). `users 1—N concept_mastery`, `users 1—N reward_transactions`, `users 1—N hint_usage`.

## Important constraints

- `users.password_or_oauth` check ensures every account has at least one auth method, enforced at the database, not just application code.
- `test_cases.is_hidden = true` rows must never be selected by any query path reachable from a public API endpoint — enforce this at the application/API layer ([API_SPEC.md](API_SPEC.md)) since Postgres row-level security across this boundary is unnecessary complexity for a single trusted backend process; the real boundary is "the browser never gets these rows," not a database-level policy.
- `levels.prerequisite_level_id` is a simple chain for MVP's linear 10-level arc. If side quests or branching paths need a many-to-many prerequisite graph, add a join table (`level_prerequisites`) rather than overloading this column — don't build that table before it's needed.

## Indexes

`submissions(user_id, challenge_id, submitted_at)` for "latest attempt" and attempt-count queries. `progress(user_id)` (covered by the PK). `test_cases(challenge_id)`. `hint_usage(user_id, requested_at)` for daily rate-limit checks.

## Data ownership

Every row referencing `user_id` is owned by that user; API queries must always scope by the authenticated session's `user_id`, never a client-supplied id (see [ARCHITECTURE.md](ARCHITECTURE.md) §6, [SECURITY.md](SECURITY.md) IDOR prevention).

## What's deferred past MVP

`achievements`, a `quests`/side-quest schema, any faculty/class/institution tables, and a richer `concept_mastery` estimation model (e.g., spaced-repetition-style decay) — current `concept_mastery.status` is intentionally a simple three-state field, not a scored model, until real usage data justifies more.
