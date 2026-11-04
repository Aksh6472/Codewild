-- Subset of DATABASE.md for the Java path (all 7 realms, no auth yet — see DECISIONS.md D11).
-- There is no `users` table yet: every user-scoped row uses a single DEV_USER_ID
-- constant (see src/devUser.ts) until Milestone 6 adds real accounts (DECISIONS.md).
-- Idempotent on purpose: this is a single-file schema for the prototype, not a
-- migration chain. Revisit with a real migration tool before Milestone 6.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS languages (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_paths (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id    UUID NOT NULL REFERENCES languages(id),
    code           TEXT UNIQUE NOT NULL,
    name           TEXT NOT NULL,
    sequence_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS worlds (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id),
    name             TEXT NOT NULL,
    sequence_order   INT NOT NULL
);

CREATE TABLE IF NOT EXISTS levels (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id              UUID NOT NULL REFERENCES worlds(id),
    title                 TEXT NOT NULL,
    story                 TEXT NOT NULL,
    concept               TEXT NOT NULL,
    syllabus_tag          TEXT,
    sequence_order        INT NOT NULL,
    is_boss               BOOLEAN NOT NULL DEFAULT false,
    prerequisite_level_id UUID REFERENCES levels(id),
    UNIQUE (world_id, sequence_order)
);

CREATE TABLE IF NOT EXISTS challenges (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id     UUID NOT NULL REFERENCES levels(id),
    starter_code TEXT NOT NULL,
    instructions TEXT NOT NULL
);

-- is_hidden rows must never be selected by any route reachable from the public API
-- (see SECURITY.md "never expose hidden test cases"). Enforced in routes, not here.
CREATE TABLE IF NOT EXISTS test_cases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id    UUID NOT NULL REFERENCES challenges(id),
    is_hidden       BOOLEAN NOT NULL DEFAULT false,
    input_data      JSONB,
    expected_output JSONB NOT NULL,
    description     TEXT NOT NULL,
    sequence_order  INT NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL,
    challenge_id   UUID NOT NULL REFERENCES challenges(id),
    code           TEXT NOT NULL,
    attempt_number INT NOT NULL,
    status         TEXT NOT NULL CHECK (status IN ('pending', 'passed', 'failed', 'error', 'timeout')),
    used_rung_4    BOOLEAN NOT NULL DEFAULT false,
    submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submission_results (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id        UUID NOT NULL REFERENCES submissions(id),
    test_case_id         UUID NOT NULL REFERENCES test_cases(id),
    passed               BOOLEAN NOT NULL,
    actual_output        JSONB,
    error_classification TEXT NOT NULL DEFAULT 'none'
);

CREATE TABLE IF NOT EXISTS progress (
    user_id             UUID NOT NULL,
    level_id            UUID NOT NULL REFERENCES levels(id),
    state               TEXT NOT NULL CHECK (state IN ('locked', 'available', 'in_progress', 'mastered')),
    best_submission_id  UUID REFERENCES submissions(id),
    used_rung_4         BOOLEAN NOT NULL DEFAULT false,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, level_id)
);

CREATE TABLE IF NOT EXISTS concept_mastery (
    user_id UUID NOT NULL,
    concept TEXT NOT NULL,
    status  TEXT NOT NULL CHECK (status IN ('locked', 'in_progress', 'mastered')),
    PRIMARY KEY (user_id, concept)
);

CREATE TABLE IF NOT EXISTS reward_transactions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL,
    submission_id UUID REFERENCES submissions(id),
    xp_delta      INT NOT NULL,
    coins_delta   INT NOT NULL,
    reason        TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_challenge ON submissions(user_id, challenge_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_test_cases_challenge ON test_cases(challenge_id);

-- ---------------------------------------------------------------------------
-- Java path expansion (DECISIONS.md D11): lessons, quizzes, hints, mock
-- interviews. Written as additive, idempotent ALTERs so an existing dev
-- database upgrades in place without losing progress.
-- ---------------------------------------------------------------------------

ALTER TABLE worlds ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE worlds ADD COLUMN IF NOT EXISTS subtitle TEXT NOT NULL DEFAULT '';
ALTER TABLE worlds ADD COLUMN IF NOT EXISTS story TEXT NOT NULL DEFAULT '';
ALTER TABLE worlds ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'village';
ALTER TABLE worlds ADD COLUMN IF NOT EXISTS summary JSONB;
CREATE UNIQUE INDEX IF NOT EXISTS idx_worlds_slug ON worlds(slug);

-- kind: lesson | trial | quiz | mock (content/types.ts LevelKind).
-- content holds public-safe lesson blocks + summary; never answers.
ALTER TABLE levels ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'trial';
ALTER TABLE levels ADD COLUMN IF NOT EXISTS content JSONB;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS minutes INT NOT NULL DEFAULT 10;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS passing_score INT;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS time_limit_minutes INT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_levels_slug ON levels(slug);
-- Re-seeding reorders levels; the (world, order) pair must be free to swap mid-transaction.
ALTER TABLE levels DROP CONSTRAINT IF EXISTS levels_world_id_sequence_order_key;

-- solution / solution_explanation are SERVER-ONLY until earned (hint rung 4).
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS guidance TEXT NOT NULL DEFAULT 'supported';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS steps JSONB NOT NULL DEFAULT '[]';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS hints JSONB NOT NULL DEFAULT '[]';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS solution TEXT NOT NULL DEFAULT '';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS solution_explanation TEXT NOT NULL DEFAULT '';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS requirements JSONB NOT NULL DEFAULT '[]';
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS feedback JSONB NOT NULL DEFAULT '[]';
CREATE UNIQUE INDEX IF NOT EXISTS idx_challenges_level ON challenges(level_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_test_cases_order ON test_cases(challenge_id, sequence_order);

-- answer / explanation are SERVER-ONLY (graded by routes, never selected into a response).
CREATE TABLE IF NOT EXISTS questions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id       UUID NOT NULL REFERENCES levels(id),
    slug           TEXT UNIQUE NOT NULL,
    sequence_order INT NOT NULL,
    kind           TEXT NOT NULL CHECK (kind IN ('mcq', 'output')),
    prompt         TEXT NOT NULL,
    code           TEXT,
    options        JSONB,
    answer         JSONB NOT NULL,
    explanation    TEXT NOT NULL,
    review_level_id UUID REFERENCES levels(id),
    stage          TEXT
);

CREATE TABLE IF NOT EXISTS question_attempts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL,
    question_id UUID NOT NULL REFERENCES questions(id),
    answer      TEXT NOT NULL,
    correct     BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user ON question_attempts(user_id, question_id);

-- One row per finished read-through, so re-reading a lesson after a failed quiz
-- is recorded as a review (quiz retry gating, review points).
CREATE TABLE IF NOT EXISTS lesson_completions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL,
    level_id     UUID NOT NULL REFERENCES levels(id),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON lesson_completions(user_id, level_id);

-- Quiz and mock-interview attempts. missed_review_level_ids drives retry gating.
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL,
    level_id                UUID NOT NULL REFERENCES levels(id),
    score                   INT NOT NULL,
    correct_count           INT NOT NULL,
    total_count             INT NOT NULL,
    passed                  BOOLEAN NOT NULL,
    missed_review_level_ids JSONB NOT NULL DEFAULT '[]',
    answers                 JSONB NOT NULL,
    elapsed_seconds         INT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id, level_id, created_at);

-- DATABASE.md hint_usage. rung 4 = solution revealed.
CREATE TABLE IF NOT EXISTS hint_usage (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL,
    challenge_id UUID NOT NULL REFERENCES challenges(id),
    rung         INT NOT NULL CHECK (rung BETWEEN 1 AND 4),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, challenge_id, rung)
);

-- 'assisted' = passed after the solution was revealed: unlocks the next quest
-- (hints never block progress, GAME_DESIGN.md) but earns no ★ and half coins.
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_state_check;
ALTER TABLE progress ADD CONSTRAINT progress_state_check
    CHECK (state IN ('locked', 'available', 'in_progress', 'assisted', 'mastered'));

-- Every reward has a key so it's granted at most once (no farming by replays).
ALTER TABLE reward_transactions ADD COLUMN IF NOT EXISTS reward_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reward_key ON reward_transactions(user_id, reward_key);
