# Testing & Quality Strategy — Project Atlas

## The core rule

**A coding challenge is never marked complete based on AI judgment alone.** The evaluation engine (a deterministic test runner, see [TECH.md](TECH.md) §10 and [ARCHITECTURE.md](ARCHITECTURE.md) §3) must verify the submission against the challenge's actual expected behavior — defined test cases with defined expected output/state ([DATABASE.md](DATABASE.md) `test_cases`). The AI Hint Service never has, and never gets, authority over a pass/fail verdict ([DECISIONS.md#d3](DECISIONS.md), [SECURITY.md](SECURITY.md)).

## Test layers

### Unit tests
Backend API business logic (reward calculation, unlock-condition evaluation, hint-rung eligibility rules, rung-0 error-message mapping) — standard unit tests with no network/DB dependency, run on every commit.

### Integration tests
Backend API ↔ PostgreSQL (submission persistence, progress updates) and Backend API ↔ Code Execution Service (using a real or faithfully-mocked execution service — see "code-execution tests" below for why a mock alone isn't sufficient for the execution path itself).

### API tests
Full request/response contract tests against [API_SPEC.md](API_SPEC.md) — including the negative cases that matter most here: confirm hidden test case data never appears in any response, confirm a user can't fetch another user's submissions/progress by id (IDOR regression tests), confirm rate limits actually trigger.

### Code-execution tests
The highest-stakes test layer. Must include, against the **real** sandboxing mechanism (not a mock, since the thing being tested is the isolation itself):
- A correct solution passes.
- An incorrect solution fails with the right error classification.
- An infinite loop is killed by the timeout and reported as `timeout`, not left to hang.
- A memory-bomb attempt is capped and reported, not allowed to affect other concurrent submissions.
- A submission attempting filesystem/network access is blocked (negative security test, not just a functional one).
- Two concurrent submissions from different users don't see each other's state (isolation test).

### Curriculum validation tests
For every level (starting with the first 10 in [CURRICULUM.md](CURRICULUM.md)): the authored starter code compiles; the authored "correct" reference solution passes all visible and hidden test cases; at least one authored "common wrong answer" (based on the level's documented misconceptions) fails with the expected error classification, to confirm the rung-0 message table actually fires for it. This is how curriculum content gets caught before a real student hits a broken level.

### End-to-end user journeys
Automated against the four journeys already specified in `design.md` §5 (J1 first-timer, J2 stuck player, J3 returning student, J4 exam-week revision) — these are the canonical acceptance scenarios; don't invent new ones in a test plan when these already define what "working" means.

### Accessibility tests
Automated contrast checks against the color tokens in `design.md` §6.2 (fail the build if any token pair drops below AA); keyboard-navigation smoke test (Run via `Ctrl/Cmd+Enter`, Mentor panel closes via `Esc`); screen-reader smoke test on the editor (CodeMirror 6) and world-view text log.

### Performance tests
Submission round-trip latency under concurrent load (a class of students submitting around the same time, per [ARCHITECTURE.md](ARCHITECTURE.md) §11 scaling note); frontend load time on a throttled connection profile approximating "college Wi-Fi" (`design.md` principle 8) — set a concrete budget once a baseline exists; don't leave this as an unmeasured aspiration.

### Security tests
The negative cases listed under "code-execution tests" above, plus: SQL-injection attempts against every parameterized-query path (regression, should always fail safely), prompt-injection attempts against the AI Hint Service (confirm injected text never flips a displayed verdict), auth bypass attempts on guest-only vs. authenticated endpoints.

### Regression tests
Every production bug gets a test that reproduces it before the fix lands, added to the relevant layer above — this is how the suite grows to reflect real failure modes instead of only anticipated ones.

## Completion criteria for a feature

A feature is "done" when: it has test coverage at the appropriate layer(s) above, it passes the accessibility and security checks relevant to it, and — for anything curriculum-related — the curriculum validation test for that level passes. "The AI said it looks right" is never sufficient evidence for a code-evaluation feature; "I ran it once manually" is never sufficient evidence for anything touching the sandbox or auth boundaries.

## What's intentionally not over-specified here

Specific tooling (test runner/framework, CI provider) isn't chosen yet — see [docs/engineering/DEVELOPMENT_SETUP.md](docs/engineering/DEVELOPMENT_SETUP.md) and [docs/engineering/DEPLOYMENT.md](docs/engineering/DEPLOYMENT.md), to be filled in once the backend/frontend framework choices in [TECH.md](TECH.md) are locked.
