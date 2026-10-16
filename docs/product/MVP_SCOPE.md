# MVP Scope — Project Atlas

This is the authoritative in/out list. [PRD.md](../../PRD.md) §10 summarizes this at the requirement-ID level; this file is the detailed version. Per [DECISIONS.md#d6](../../DECISIONS.md), the MVP is a single, compelling Java Fundamentals experience — not a thin slice of every planned feature.

## In scope for MVP

- Guest play of level 1, no account required ([PRD.md](../../PRD.md) F1).
- Google OAuth sign-in + email/password fallback ([PRD.md](../../PRD.md) F2).
- World map with locked/available/in-progress/mastered states, for World 1 (Java Fundamentals) only ([PRD.md](../../PRD.md) F3).
- Quest screen: side-by-side world + editor, Run, step-mode with line highlighting ([PRD.md](../../PRD.md) F4, F8).
- Server-side, sandboxed Java compilation and execution ([PRD.md](../../PRD.md) F5; see [SECURITY.md](../../SECURITY.md) for the mandatory baseline before real users).
- Live-ticking visible-test goal checklist; hidden tests surfaced as in-world "twists" ([PRD.md](../../PRD.md) F6, F7).
- Deterministic rung-0 plain-English error messages ([PRD.md](../../PRD.md) F9).
- AI hint ladder, rungs 1–4 ([PRD.md](../../PRD.md) F10) — **in scope for a complete MVP, but sequenced after the core loop** (see [ROADMAP.md](../../ROADMAP.md) milestone 7; milestones 3–5 can demo without it using only rung 0).
- XP/coins tied to verified mastery, reward/recap screen ([PRD.md](../../PRD.md) F11, F13).
- Progress persistence per user ([PRD.md](../../PRD.md) F12).
- Profile screen with concept mastery list and syllabus-tag filtering ([PRD.md](../../PRD.md) F14, F15).
- The 10 Java Fundamentals levels fully designed and built (see [CURRICULUM.md](../../CURRICULUM.md)), plus 2–3 side quests reusing existing mechanics for revision ([PRD.md](../../PRD.md) F16).

## Explicitly out of scope for MVP (not deferred-ambiguously — not being designed for yet)

- Java OOP and DSA worlds ([PRD.md](../../PRD.md) F17; [ROADMAP.md](../../ROADMAP.md) milestones 10–11).
- Any language other than Java ([PRD.md](../../PRD.md) F18; [DECISIONS.md#d4](../../DECISIONS.md)).
- Faculty/class dashboard ([PRD.md](../../PRD.md) F19; [ROADMAP.md](../../ROADMAP.md) milestone 13).
- Any social/leaderboard feature, even opt-in, until explicitly revisited post-MVP ([PRD.md](../../PRD.md) F20).
- Multiplayer/races, guilds, a cosmetics shop, a native mobile app, voice interaction, daily-streak mechanics ([PRD.md](../../PRD.md) §11, `design.md` §9).
- The "5-question mixed review" referenced in journey J4 — flagged as an undesigned gap in [docs/product/USER_FLOWS.md](USER_FLOWS.md), not yet in scope.

## MVP-essential vs. can-wait data entities

See [DATABASE.md](../../DATABASE.md) "Entity list and MVP priority" for the authoritative table — `achievements` and a side-quest-specific schema are explicitly deferred even though side quests themselves are in MVP scope (they reuse the existing `levels`/`challenges` schema rather than needing a new one).

## Definition of "MVP done"

The MVP is complete when: all 10 Fundamentals levels pass curriculum validation tests ([TESTING.md](../../TESTING.md)), the security baseline in [SECURITY.md](../../SECURITY.md) is fully met, and a closed cohort of real students (not just the team) can complete journeys J1–J4 from `design.md` §5 without engineering intervention. This corresponds to [ROADMAP.md](../../ROADMAP.md) milestones 1–8.
