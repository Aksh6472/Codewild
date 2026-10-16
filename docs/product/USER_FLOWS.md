# User Flows — Project Atlas

Step-by-step flows underlying the screens in `design.md` §3 and the journeys in `design.md` §5. This file describes flow *steps*; screen layout detail lives in `design.md`/[UI_UX.md](../../UI_UX.md), and API calls backing each step are in [API_SPEC.md](../../API_SPEC.md).

## Flow 1: Onboarding (guest → registered player)

```
Land on site
  → "Play level 1 now" (no signup)
  → Play level 1 fully (code → run → pass → reward/recap)
  → Prompt: "Save your robot? Sign in with Google" (design.md §3.1)
      ├─ Signs in with Google → POST /auth/google → account created, guest progress attached
      ├─ Chooses email fallback → POST /auth/signup
      └─ Declines → progress stays session-local only; prompted again after level 2/3 (exact re-prompt cadence TBD)
  → Three onboarding questions (design.md §3.2): prior experience, course/college, robot name
  → Lands on world map with next node glowing
```

**Design constraint carried from `design.md`:** the account prompt comes *after* a win, never before — never gate the first taste of the product behind signup.

## Flow 2: Starting a level

```
World map
  → Player taps an available (○) or in-progress (◐) node
  → Briefing screen: what's broken, the goal, current world state (design.md §2)
  → Quest screen loads: starter code pre-filled in editor, goal checklist from visible tests, world view at its starting state
```

## Flow 3: Submitting code

```
Quest screen, editor has code
  → Player presses Run (button or Ctrl/Cmd+Enter)
  → POST /submissions (API_SPEC.md) → submissionId returned immediately
  → Client polls GET /submissions/:id
  → Editor locks, world view plays back the run step-by-step (or at 2x, player's choice)
  → Console streams output; goal checklist ticks live as visible tests resolve
  → On resolution:
      ├─ A visible test fails → world shows the wrong outcome + rung-0 plain-English message in console
      ├─ All visible pass, a hidden test fails → in-world "twist" scene + the specific failing case surfaces as a new goal-checklist line
      └─ All visible + hidden pass → proceeds to Flow 4 (receiving feedback / reward)
```

## Flow 4: Receiving feedback and reward

```
All tests passed
  → GET /progress/reward/:submissionId
  → Short (≤2s, skippable) world-repair animation
  → "What you just learned" card (mandatory, quick to dismiss)
  → XP/coins count up; level-up state shown if applicable
  → Two equal-weight buttons: "Next quest" / "Back to map" (design.md §3.6 — neither is ever hidden/greyed)
```

## Flow 5: Using a hint (branches off Flow 3 on failure)

```
A run fails (visible or hidden test)
  → Rung 0 (deterministic plain-English message) shown automatically in console — no action needed
  → After 2 failed runs, Mentor panel offers itself once (design.md §3.5); player may also open it manually any time after a failure
  → Player requests a rung (1: nudge, 2: focus, 3: worked example, 4: solution walkthrough — only available after 3+ attempts)
  → POST /hints (API_SPEC.md) — server validates eligibility + daily cap before calling the AI Hint Service
  → Hint text shown in the Mentor drawer
  → Player returns to editor, revises code, re-runs (back to Flow 3)
```

## Flow 6: Unlocking progress

```
A level's reward is granted (Flow 4)
  → Backend evaluates unlock conditions for dependent node(s) (levels.prerequisite_level_id, DATABASE.md)
  → progress rows updated: this level → 'mastered' (if no rung 4 used) or 'in_progress'→passed state; next level(s) → 'available'
  → World map reflects new state on next load (node glow, ★ if mastered)
```

## Flow variant: exam-week revision (journey J4)

```
Profile screen
  → Filter by syllabus unit (e.g., "Unit 3: Functions") — levels.syllabus_tag (DATABASE.md)
  → Replay a mastered level in "no hints" mode (Mentor panel disabled for this run)
  → Optionally: a 5-question mixed review (not yet designed — flagged as a gap; CURRICULUM.md does not yet define mixed-review question format)
```

## Open gaps in these flows

- Exact re-prompt cadence for guest → account conversion if declined once — **TBD**.
- "5-question mixed review" format referenced in `design.md` J4 is not yet specified anywhere (not in CURRICULUM.md, not in API_SPEC.md) — needs design before Flow "exam-week revision" can be fully implemented.
- Whether submission polling (Flow 3) should instead be a push mechanism (WebSocket/SSE) for a snappier feel — noted as TBD in [API_SPEC.md](../../API_SPEC.md).
