# Product Requirements Document — Project Atlas

See [DECISIONS.md](DECISIONS.md) for the decision history behind the choices below, and [docs/product/MVP_SCOPE.md](docs/product/MVP_SCOPE.md) for the line-by-line in/out list this PRD summarizes at the priority level.

## 1. Problem statement

Beginner programmers — particularly Indian engineering students — have two unsatisfying options: conventional courses (video + quiz + badge) that don't sustain engagement, or coding games that treat programming as a puzzle disconnected from the curriculum they're actually examined on. Neither gives a student a reason to come back daily, and neither makes debugging — the actual skill that determines whether someone becomes a competent programmer — visible or teachable. See [docs/research/COMPETITIVE_ANALYSIS.md](docs/research/COMPETITIVE_ANALYSIS.md).

## 2. Product vision and goals

Make learning to program feel like playing a real video game, where writing code is the only way to act in the world, and where progress in the game is also real progress in a recognized curriculum (Java Fundamentals → OOP → DSA, see [CURRICULUM.md](CURRICULUM.md)).

Goals (first 12 months):
- G1: Prove the core loop works — a first-timer reaches level 3 unassisted in one sitting (see journey J1 in `design.md` §5).
- G2: Prove retention without manipulative mechanics — return visits driven by curiosity/progress, not push notifications or streak guilt (journey J3).
- G3: Prove curriculum-alignment is a real pull — students use it as exam revision (journey J4), the strongest observed willingness-to-pay signal hypothesis.

## 3. Target audience and personas

Primary: first- and second-year Indian engineering (B.Tech/BCA/diploma) students taking an introductory programming course, most often in Java per their college syllabus. Full personas in [docs/product/USER_PERSONAS.md](docs/product/USER_PERSONAS.md).

## 4. User pain points

- Course lectures and textbook exercises don't hold attention; dropout from self-paced courses is high.
- Error messages ("expected ';'") are meaningless to a true beginner and provide no next step.
- Existing coding games (CodeCombat-style) feel disconnected from what's on the syllabus/exam.
- Gamified ed-tech often uses manipulative retention mechanics (streak guilt, loss aversion) that this product explicitly rejects (see [GAME_DESIGN.md](GAME_DESIGN.md) principle on honest rewards).

## 5. Product principles

See [GAME_DESIGN.md](GAME_DESIGN.md) §1 for the full ranked list (code is the controller; the world shows you what your code did; readable first, pretty second; fail cheap, never punished; one new idea per level; short sessions; honest rewards; works on modest hardware). This PRD inherits those principles as product constraints, not just design taste.

## 6. Functional requirements

Priority key: **P0** = required for MVP launch, **P1** = required for a complete first learning path (Java Fundamentals, fully polished), **P2** = valuable but explicitly deferred.

| ID | Requirement | Priority |
|---|---|---|
| F1 | Guest can play level 1 without an account | P0 |
| F2 | Account creation via Google OAuth (email/password fallback, provider TBD — [DECISIONS.md Q4](DECISIONS.md)) | P0 |
| F3 | World map showing locked/available/in-progress/mastered level states | P0 |
| F4 | Code editor + world view side by side, with Run | P0 |
| F5 | Server-side Java compilation and execution of submitted code, sandboxed | P0 |
| F6 | Visible tests shown as a live-ticking goal checklist | P0 |
| F7 | Hidden tests run after visible tests pass, surfaced as an in-world "twist" | P0 |
| F8 | Step-by-step execution with line highlighting synced to world playback | P0 |
| F9 | Plain-English deterministic error translation (hint rung 0) | P0 |
| F10 | AI-generated hint ladder (rungs 1–4), constrained to the level's concept and the actual failing test | P1 |
| F11 | XP, coins, and level-up state tied to verified concept mastery | P0 |
| F12 | Progress persistence per user across sessions | P0 |
| F13 | Reward/recap screen with "what you just learned" card | P0 |
| F14 | Profile screen with concept mastery list | P1 |
| F15 | Syllabus tagging per level, filterable in profile | P1 |
| F16 | Side quests / practice mode for weak concepts | P1 |
| F17 | OOP and DSA worlds | P2 (post-MVP learning path expansion, [DECISIONS.md#d2](DECISIONS.md)) |
| F18 | Additional languages (Python/C++/JS) | P2 ([DECISIONS.md#d4](DECISIONS.md)) |
| F19 | Class/faculty dashboard | P2 |
| F20 | Social/leaderboard features | P2 (opt-in experiment only, post-MVP per `design.md` §3.7) |

## 7. Non-functional requirements

| ID | Requirement | Priority |
|---|---|---|
| N1 | Untrusted student code never executes inside the main API process ([SECURITY.md](SECURITY.md)) | P0 |
| N2 | A code submission returns a result (or a clear timeout) within a few seconds for a typical Fundamentals-level program | P0 |
| N3 | Page loads acceptably on college Wi-Fi and a ₹30k-class laptop (per `design.md` principle 8) | P0 |
| N4 | WCAG AA contrast; color never the sole pass/fail signal; keyboard operability for Run | P0 |
| N5 | `prefers-reduced-motion` respected throughout | P1 |
| N6 | System tolerates concurrent code execution from multiple students without one user's run starving another's (resource limits per submission) | P0 |

## 8. User stories and acceptance criteria

- **As a first-time visitor**, I can play level 1 without creating an account, so I can evaluate the product with zero friction.
  *Acceptance:* level 1 is fully playable, including Run and seeing a pass/fail result, with no auth gate.
- **As a stuck beginner**, I can see in plain English why my code failed, so I'm not blocked by jargon.
  *Acceptance:* every compiler/runtime error maps to a plain-English rung-0 message before any AI hint is offered.
- **As a returning student**, my progress and mastery state persist across sessions and devices (once signed in).
  *Acceptance:* logging in on a different browser restores map state, XP, and concept mastery exactly.
- **As an exam-week student**, I can filter levels by syllabus unit and replay a mastered level without hints.
  *Acceptance:* profile screen supports a syllabus-unit filter and a "no hints" replay mode (see journey J4, `design.md` §5).

## 9. Core user journeys

See `design.md` §5 (J1–J4) for the four authored journeys (first-timer, stuck player, returning student, exam-week revision) and [docs/product/USER_FLOWS.md](docs/product/USER_FLOWS.md) for the step-by-step flow diagrams.

## 10. MVP requirements

See [docs/product/MVP_SCOPE.md](docs/product/MVP_SCOPE.md) for the complete in/out list. Summary: F1–F9, F11–F13 from the table above, scoped to 10 Java Fundamentals levels ([DECISIONS.md#d6](DECISIONS.md)).

## 11. Explicitly excluded features (not just "later" — not being designed for yet)

Multiplayer/races, guilds, a cosmetics shop, a native mobile app, voice interaction, a public leaderboard, daily-streak mechanics, a faculty/class dashboard. (Matches `design.md` §9.) These may become P2 roadmap items but no architecture decision should be made to accommodate them today.

## 12. Success metrics

| Metric | Target (hypothesis — unverified until [VALIDATION.md](VALIDATION.md) runs) |
|---|---|
| Guest → level 3 completion in one sitting | ≥ 50% of guests who start level 1 (G1) |
| D3 return rate without any push notification | TBD — to be set after baseline from first cohort |
| % of validation interviewees who say they'd use it as exam revision | ≥ 60% (G3 signal) |
| Hint-rung distribution | Majority of passes happen at rung 0–2, not rung 4 ("assisted") |
| Willingness to pay (interview-stated) | TBD — see [VALIDATION.md](VALIDATION.md) §willingness-to-pay experiments |

All targets above are hypotheses, not committed numbers, until real data exists. Do not report them as validated results in other documents.

## 13. Accessibility requirements

WCAG AA contrast minimum; no color-only signaling; full keyboard operability including Run (`Ctrl/Cmd+Enter`) and closing the mentor panel (`Esc`); screen-reader-compatible editor (CodeMirror 6); reduced-motion mode; adjustable editor font size; no text baked into images. Source: `design.md` §8. Full detail in [UI_UX.md](UI_UX.md).

## 14. Monetization hypotheses (unvalidated)

- H1: Direct-to-student subscription (comparable to Boot.dev's ~$30–60/mo range or Codédex's ~$10–20/mo range — see [docs/research/COMPETITIVE_ANALYSIS.md](docs/research/COMPETITIVE_ANALYSIS.md)), likely priced lower for the Indian market.
- H2: Institutional licensing to colleges (per-student or per-class, similar to CodeCombat's school model).
- H3: Freemium — Fundamentals free/low-cost as an acquisition funnel, OOP/DSA worlds paid.
Monetization model is an open question ([DECISIONS.md Q6](DECISIONS.md)) and must be tested in [VALIDATION.md](VALIDATION.md) before being treated as a plan.

## 15. Risks and assumptions

| Risk/Assumption | Type | Mitigation |
|---|---|---|
| Java's verbosity hurts the "quick win" moment Python-based competitors offer | Risk | Level 1 hides boilerplate (see [CURRICULUM.md](CURRICULUM.md) level design); validate directly in interviews |
| Secure Java sandboxing is more operationally complex/costly than an in-browser JS runtime | Risk | Spike both managed and self-hosted options before milestone 4 ([TECH.md](TECH.md), [ROADMAP.md](ROADMAP.md)) |
| Target users assumed to have reliable but possibly slow/metered internet | Assumption | Validate in interviews; design for fast load on college Wi-Fi (N3) |
| AI hint cost scales with active users in a way that breaks unit economics | Risk | Cap hint-ladder calls per user per day; deterministic rung 0 handles the majority of errors without any AI call |
| "Game-first" is more expensive to build per level than a course-with-badges competitor | Risk (accepted) | Explicitly accepted per [DECISIONS.md#d3](DECISIONS.md); controlled via a small, ruthless MVP level count |

## 16. Future expansion opportunities

OOP and DSA worlds (committed, sequenced); additional languages; institutional/faculty tooling; class leaderboards (opt-in); a mobile companion app for map/profile/review (not for writing code, per `design.md` principle 8). None of these are scoped for current work — see [ROADMAP.md](ROADMAP.md).
