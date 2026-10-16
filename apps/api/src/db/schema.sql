-- Subset of DATABASE.md needed for ROADMAP.md Milestone 3 (levels 1-3 only, no auth yet).
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
