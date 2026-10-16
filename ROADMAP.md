# Roadmap — Project Atlas

No dates are committed below — milestones are ordered by dependency, not by calendar, until real estimation happens against each one. See [CLAUDE.md](CLAUDE.md): don't start a later milestone's work while an earlier one is incomplete without the user explicitly asking for it.

## Milestone 1 — Product decisions and validation setup
- **Deliverables:** This documentation set (done, this change); resolved or explicitly tracked open questions ([DECISIONS.md](DECISIONS.md)); recruitment started for [VALIDATION.md](VALIDATION.md)'s 15–20 student interviews.
- **Dependencies:** None.
- **Acceptance criteria:** Every doc in [CLAUDE.md](CLAUDE.md)'s index exists and cross-links correctly; [DECISIONS.md](DECISIONS.md) open-questions table reflects genuinely unresolved items only.
- **Risks:** Treating documentation as a substitute for talking to real students — it isn't; milestone 2 must start regardless of how "finished" the docs feel.

## Milestone 2 — UX prototype
- **Deliverables:** Clickable/static prototype of the quest screen, world map, and mentor panel (no real code execution yet — canned/scripted responses), used in validation interviews.
- **Dependencies:** Milestone 1 (docs give interviewers a consistent script; [VALIDATION.md](VALIDATION.md) prototype-testing tasks need this to exist).
- **Acceptance criteria:** A test subject can complete the 5-second test and the look test from `design.md` §10 against this prototype.
- **Risks:** Over-investing in prototype polish before any interview has happened.

## Milestone 3 — Playable Java Fundamentals prototype (real code, no sandbox hardening yet)
- **Deliverables:** Levels 1–3 or so from [CURRICULUM.md](CURRICULUM.md) actually playable end-to-end, Java code genuinely compiled and run (in a minimal, non-production-hardened execution path — e.g., local/dev-only execution, not yet exposed to the public internet).
- **Dependencies:** Milestone 2 feedback; [TECH.md](TECH.md) frontend/backend stack choices made.
- **Acceptance criteria:** Journey J1 (`design.md` §5) works for an internal tester end to end.
- **Risks:** Being tempted to expose this pre-hardened path to real users — explicitly blocked by milestone 4.

## Milestone 4 — Secure Java execution integration
- **Deliverables:** Resolution of [TECH.md](TECH.md) §9's managed-vs-self-hosted spike; production-grade sandboxed execution service meeting every item in [SECURITY.md](SECURITY.md)'s "mandatory before accepting submissions from real users" list.
- **Dependencies:** Milestone 3 (need a real integration point to harden).
- **Acceptance criteria:** All code-execution security tests in [TESTING.md](TESTING.md) pass, including the negative/escape-attempt cases.
- **Risks:** This is the single highest-risk engineering milestone in the roadmap — a container/VM escape is a severe incident. Do not compress this milestone's timeline to hit a launch date.

## Milestone 5 — First 10 levels, fully polished
- **Deliverables:** All 10 Fundamentals levels from [CURRICULUM.md](CURRICULUM.md) with final art-direction-consistent assets, step-mode, hidden-test "twist" narratives, and the boss level.
- **Dependencies:** Milestone 4 (needs the real sandbox to validate hidden tests safely at scale).
- **Acceptance criteria:** Curriculum validation tests ([TESTING.md](TESTING.md)) pass for all 10 levels.

## Milestone 6 — Accounts and progress persistence
- **Deliverables:** Google OAuth + email fallback, guest-to-account conversion flow, `progress`/`concept_mastery` persistence per [DATABASE.md](DATABASE.md).
- **Dependencies:** Milestone 5 (need real levels to have progress against).
- **Acceptance criteria:** Journey J3 (returning student, `design.md` §5) works across a logout/login cycle on a different browser.

## Milestone 7 — AI hints
- **Deliverables:** Hint rungs 1–4 wired to a chosen LLM provider ([DECISIONS.md Q3](DECISIONS.md)), with rate limiting and prompt-injection mitigations from [SECURITY.md](SECURITY.md).
- **Dependencies:** Milestone 5 (hints need real level/test context to be meaningful).
- **Acceptance criteria:** Journey J2 (stuck player, `design.md` §5) completable using only rungs 0–3.
- **Risks:** Cost-per-active-user; mitigated by the daily cap in [SECURITY.md](SECURITY.md).

## Milestone 8 — Closed user testing
- **Deliverables:** A small cohort (likely drawn from [VALIDATION.md](VALIDATION.md) interviewees) plays the full MVP (milestones 5–7 complete) under supervision.
- **Dependencies:** Milestones 5, 6, 7.
- **Acceptance criteria:** Success metrics in [PRD.md](PRD.md) §12 measured for the first time against a real cohort; qualitative feedback collected per [VALIDATION.md](VALIDATION.md).

## Milestone 9 — MVP improvements
- **Deliverables:** Fixes/iteration driven directly by milestone 8 findings. Scope is intentionally undefined until that feedback exists.
- **Dependencies:** Milestone 8.

## Milestone 10 — OOP expansion (World 2)
- **Deliverables:** Full [CURRICULUM.md](CURRICULUM.md) World 2 level design (not yet done — see that file) plus implementation.
- **Dependencies:** Milestone 9; MVP success metrics should show the core loop works before investing in a second world.

## Milestone 11 — DSA expansion (World 3)
- **Deliverables:** Full World 3 level design and implementation.
- **Dependencies:** Milestone 10 (DSA needs OOP's class/object foundation per [CURRICULUM.md](CURRICULUM.md)).

## Milestone 12 — Additional languages
- **Deliverables:** Second learning path (Python most likely first, per `design.md`'s original draft default — TBD) using the extensibility already built into [DATABASE.md](DATABASE.md)/[ARCHITECTURE.md](ARCHITECTURE.md).
- **Dependencies:** Milestone 11 or a strong earlier signal that a second language is worth prioritizing ahead of finishing DSA — re-evaluate, don't assume strict ordering.

## Milestone 13 — Potential university edition
- **Deliverables:** Faculty/class dashboard, institutional licensing support (ties to [PRD.md](PRD.md) monetization hypothesis H2).
- **Dependencies:** Validated demand signal from [VALIDATION.md](VALIDATION.md)'s ongoing interviews/beta cohort; explicitly out of MVP scope ([PRD.md](PRD.md) §11).

## Major cross-cutting risks

Sandbox security (milestone 4) and AI hint cost (milestone 7) are the two risks most likely to blow up a schedule estimate — budget schedule contingency there specifically, not evenly across all milestones.
