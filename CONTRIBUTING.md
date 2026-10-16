# Contributing — Development Conventions

No application code exists yet ([README.md](README.md) status) — these conventions apply from the first commit of implementation code onward, and should be followed by any Claude Code session per [CLAUDE.md](CLAUDE.md).

## Branching and commits

- Branch names: `type/short-description` (e.g., `feat/level-1-challenge`, `fix/sandbox-timeout`, `docs/update-roadmap`).
- Commit messages: imperative mood, explain *why* when it's not obvious from the diff, reference the relevant doc/decision when a commit implements something specified there (e.g., "Add rung-0 error table per GAME_DESIGN.md hint progression").
- One logical change per commit where reasonable; don't bundle an unrelated refactor into a feature commit.

## Code style

- TypeScript strict mode across frontend and backend ([TECH.md](TECH.md) §5).
- Formatting/linting: a standard automated formatter (e.g., Prettier) and linter (e.g., ESLint) — exact config **TBD**, to be set up at the start of implementation and then enforced via CI, not debated per-PR.
- No commented-out code committed; delete it (git history keeps it if ever needed).

## TypeScript standards

- No `any` without an inline comment explaining why it's unavoidable (e.g., a genuinely untyped third-party callback).
- Prefer explicit return types on exported functions; let inference handle the rest.
- Shared types between frontend and backend (e.g., the [API_SPEC.md](API_SPEC.md) response shapes) should live in one shared location once a monorepo structure exists, not be duplicated and allowed to drift.

## Naming conventions

| Context | Convention | Example |
|---|---|---|
| Variables, functions | `camelCase` | `getSubmissionResult` |
| Types, classes, React components | `PascalCase` | `SubmissionResult`, `WorldMap` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_HINT_RUNGS` |
| Files | `kebab-case` (except component files matching their `PascalCase` export, a common React convention) | `submission-service.ts`, `WorldMap.tsx` |
| Database tables/columns | `snake_case` | `concept_mastery`, `used_rung_4` |
| API routes | `kebab-case`, plural resources | `/learning-paths`, `/submissions` |

## Testing expectations

Follow [TESTING.md](TESTING.md). In short: new backend logic ships with unit tests; anything touching the execution sandbox or auth boundaries ships with the relevant security/negative tests; new curriculum levels ship with a curriculum validation test (reference solution passes, a documented misconception fails with the right error classification). A PR that adds a feature with zero test coverage in an area [TESTING.md](TESTING.md) calls out should explain why, not skip it silently.

## Pull request / change-review expectations

- A PR description states what changed and why (link the relevant doc/decision when applicable), and what was tested.
- Anything touching [SECURITY.md](SECURITY.md)'s mandatory baseline (sandboxing, auth, hidden-test exposure) should get a deliberate second look before merge — this is the one area where "looks fine" isn't a sufficient review bar.
- Don't merge a change that contradicts a `DECISIONS.md` entry without updating that entry first (mark it `superseded` and add the new decision) — see [CLAUDE.md](CLAUDE.md) "updating documentation."

## Documentation requirements

- If a change makes a doc inaccurate (e.g., implementing something [TECH.md](TECH.md) marked `TBD`), update that doc in the same PR — flip the status to `Confirmed`, fill in the real detail, and add a [DECISIONS.md](DECISIONS.md) entry if it was a meaningful choice among alternatives.
- New cross-references use relative Markdown links, not absolute paths or bare filenames.

## Environment configuration

Use `.env` locally (never committed — see [.env.example](.env.example) for the variable list and [docs/engineering/DEVELOPMENT_SETUP.md](docs/engineering/DEVELOPMENT_SETUP.md) for setup). Production secrets live only in the hosting platform's secret manager ([SECURITY.md](SECURITY.md)).

## Dependency management

- Default answer to "should we add a dependency" is no. Before adding one: check whether the standard library or an already-installed dependency solves it; check it's actively maintained; check its license is compatible.
- Lockfiles (`package-lock.json` or equivalent) are committed and never hand-edited.
- Dependency vulnerability scanning runs in CI once a manifest exists ([SECURITY.md](SECURITY.md)).
