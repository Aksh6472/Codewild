# Game Design — Project Atlas

This document is the gameplay source of truth. The existing [design.md](design.md) ("Stage 4" draft) already contains detailed, considered gameplay and UX design — **this file does not duplicate it**. Instead it: (1) indexes what's already decided there, (2) restates it in Java terms now that [DECISIONS.md#d1](DECISIONS.md) has settled the language question (design.md assumed Python as a placeholder), and (3) adds the mechanic-to-concept mapping the founder brief asks for.

## Read design.md first

[design.md](design.md) §1–§10 already define: the eight ranked design principles, the core gameplay loop diagram, all seven MVP screens (landing, onboarding, world map, quest screen, mentor/hint panel, reward/recap, profile), the provisional level arc, four user journeys, the full visual identity direction, the world/editor/feedback event table, and the accessibility checklist. Treat all of it as current except where this file or [DECISIONS.md](DECISIONS.md) explicitly supersedes it (the language default, per [DECISIONS.md#d1](DECISIONS.md)).

## Core gameplay loop

See `design.md` §2 for the full loop diagram. Summary: **World Map → Briefing → Code → Run → World plays out the code → (visible tests tick live) → hidden tests run silently → Reward + recap**, with an opt-in Mentor hint ladder available on failure.

## World and level structure

See `design.md` §3.3 (world map, node states, syllabus tags) and §4 (the provisional 10-level arc, "The Silent Foundry"). The level arc in §4 is retained conceptually; see [CURRICULUM.md](CURRICULUM.md) for the Java-specific version of each level's code and story, since §4's code-flavored descriptions (e.g., "collect 10 crystals" via a `for` loop) translate directly to Java without changing the world design.

## Quest design and coding challenges

See `design.md` §3.4 for the quest screen layout and the goal-checklist/step-mode mechanic. Each challenge has: a briefing (what's broken, the goal), starter code, a set of visible tests (shown live) and hidden tests (revealed only as in-world "twists" on failure, never as a raw list) — see [CURRICULUM.md](CURRICULUM.md) for the per-level test-case format and [DATABASE.md](DATABASE.md) `test_cases` table for how these are stored.

## XP, coins, rewards, and progression

See `design.md` §3.2 (HUD), §3.6 (reward/recap screen), and §7 (the world/editor/goal/mentor/rewards event table) for the full progression and reward surface. Core rule, restated: **XP and coins track concepts mastered, never time spent or idle activity** ([DECISIONS.md#d3](DECISIONS.md) consequence). Using a hint reduces coins for that level; it never reduces XP and never blocks progress (`design.md` §3.5).

## Unlock conditions

A node unlocks when its prerequisite node(s) are passed (all visible + hidden tests green). ★ "mastered" status requires passing without using hint rung 4 (`design.md` §3.3, §3.5). Full prerequisite graph is defined per-topic in [CURRICULUM.md](CURRICULUM.md).

## Boss battles

Boss levels combine multiple previously-taught concepts in one multi-step challenge and carry multiple hidden-test scenarios rather than one (see `design.md` §4, level 10 "Foundry Core"). Each world (Fundamentals, OOP, DSA) ends with one boss level; see [CURRICULUM.md](CURRICULUM.md).

## Hint progression

See `design.md` §3.5 for the full 5-rung ladder (0: deterministic plain-English error, 1: nudge, 2: focus, 3: worked example, 4: solution walkthrough) including which rungs are AI-generated vs. authored, and the rule that **the AI never decides correctness** — only the test runner does (reinforced in [TESTING.md](TESTING.md) and [SECURITY.md](SECURITY.md)).

## Failure and retry mechanics

Failure is free and informational, never punitive: no hearts, no lost streaks, no lost progress on a failed run (`design.md` principle 4). A failed run is shown *in the world* (the robot visibly does the wrong thing), paired with a plain-English rung-0 message, per `design.md` §7.

## Difficulty scaling

One new concept per level (`design.md` principle 5); old concepts return combined in later levels and in boss levels. Within a level, visible tests establish the baseline case and hidden tests probe generalization (e.g., level 4's "10 crystals" visible case vs. "7 crystals" hidden case) — this is the primary difficulty-scaling mechanism inside a single challenge, not time pressure or added obstacles.

## Character progression

The player's robot is the visible avatar of progression: cosmetic naming at onboarding (`design.md` §3.2, the one MVP cosmetic choice) and its animation set — idle, walk, turn, collect, bonk, celebrate (`design.md` §6.1) — each already tied to a specific gameplay event (a bonk = a failed run against an obstacle; a celebrate = a passed level), so "character progression" in the MVP is expressive, not stat-based. Stat-based robot upgrades are not in MVP scope — if added later, they must still be earned through demonstrated mastery, never purchased or earned by time played ([DECISIONS.md#d3](DECISIONS.md)).

## Feedback and animations

See `design.md` §6.4 (motion principles: ~250ms per step at 1×, 2×/step modes, 2-second-max skippable rewards, no idle animation next to the editor) and §7 (the full event table mapping each gameplay event to its editor/world/goal-panel/mentor/reward response).

## Daily challenges

**Not in MVP scope.** `design.md` explicitly excludes daily-streak mechanics in §9 as a product principle (streaks must remain supportive, not manipulative, per the founder brief). If a "daily challenge" feature is revisited post-MVP, it must be re-justified against principle 7 (honest rewards, no fake urgency) before design — default assumption is **no**, not deferred-yes.

## Accessibility and reduced-motion

See `design.md` §8 for the full accessibility checklist; see [UI_UX.md](UI_UX.md) for implementation-level detail.

## How code execution changes the game world (the mechanic-to-concept map)

This is the concrete answer to "these mechanics must be educationally meaningful, not merely decorative." Each Java language concept maps to a specific, legible world effect — the mapping below is what [CURRICULUM.md](CURRICULUM.md)'s per-level "game mechanic" column instantiates:

| Java concept | World effect |
|---|---|
| Variables, primitive types | Set a character/robot attribute (name tag, battery level, position) — a sign or HUD element updates to reflect the stored value |
| Operators / expressions | Compute a derived world quantity (e.g., battery needed to cross a bridge of a given length) |
| `if` / `else`, booleans | Gate — a door, bridge, or sensor-controlled mechanism opens only when a condition the player's code evaluates is true |
| `for` / `while` loops | Repeated/automated action — the robot moves, collects, or patrols a variable number of times, driven by the loop the player wrote |
| Methods | Reusable abilities — defining `turnAround()` once makes it callable repeatedly; the world lets the player "teach" the robot a move |
| Arrays / Strings | Ordered collections the robot acts on in sequence (sorting crates, reading a message) |
| Classes and objects (OOP world) | Game entities themselves — a `Robot` or `Crate` class instance *is* an object visibly present in the world, not an abstract exercise |
| Inheritance / polymorphism (OOP world) | Different entity types (e.g., multiple robot variants) share behavior through a common supertype, visible as shared vs. overridden animations/abilities |
| Interfaces / abstraction (OOP world) | A contract multiple unrelated world entities can fulfill (e.g., anything `Collectible`, regardless of type) |
| Recursion, trees, graphs (DSA world) | World structures that are themselves tree/graph-shaped (dungeon maps, dependency puzzles) traversed by the player's algorithm |

Every row above must have a visible, causal world effect before it ships as a level — if a concept can't be made to visibly do something, it doesn't get a level until a mechanic is designed for it (principle 1, `design.md`).

## What this file intentionally does not re-specify

Screen layouts, color tokens, typography, and the detailed event table all live in `design.md` (and are indexed into [UI_UX.md](UI_UX.md)) to avoid duplicate-and-drift. If a gameplay change requires changing a screen, update `design.md` directly and note the change in [DECISIONS.md](DECISIONS.md) if it reverses a prior decision.
