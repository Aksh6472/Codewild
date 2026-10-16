# CLAUDE.md — Instructions for Claude Code

Read this file at the start of every session in this repository. It is the entry point; detailed specs live in the files it links to. Keep this file short — if you're about to add a paragraph of detail, it probably belongs in a linked document instead.

## What this project is

**Project Atlas** (internal codename — brand name undecided, see [DECISIONS.md#d5](DECISIONS.md)) is a game-based programming education platform. Players learn to code by writing real code that changes a persistent game world: **PLAY → CODE → SOLVE → LEVEL UP → UNLOCK → BUILD → MASTER**. It is not a course with XP bolted on — gameplay, problem-solving and progression are one integrated system ([DECISIONS.md#d3](DECISIONS.md)).

Target audience: beginner programmers, especially Indian engineering students, whose in-game progress maps to their actual college syllabus.

First learning path (**the only one in scope right now**): Java Fundamentals → Java OOP → DSA with Java ([DECISIONS.md#d1](DECISIONS.md), [DECISIONS.md#d2](DECISIONS.md)). Python/C++/JS are future paths, not current work ([DECISIONS.md#d4](DECISIONS.md)).

## Current stage

**Pre-implementation / documentation and validation.** No application code exists yet. Current priorities, in order: (1) resolve the open questions in [DECISIONS.md](DECISIONS.md), (2) run the interview plan in [VALIDATION.md](VALIDATION.md), (3) build the playable Java Fundamentals prototype per [ROADMAP.md](ROADMAP.md) milestone 3. Check [ROADMAP.md](ROADMAP.md) for the authoritative current milestone before starting implementation work.

## Source-of-truth documents

| Document | Covers |
|---|---|
| [README.md](README.md) | Public-facing project overview |
| [PRD.md](PRD.md) | Product requirements, priorities (P0/P1/P2), success metrics |
| [TECH.md](TECH.md) | Technology choices and rationale |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flow, diagrams |
| [GAME_DESIGN.md](GAME_DESIGN.md) | Gameplay mechanics and loop |
| [CURRICULUM.md](CURRICULUM.md) | Learning content, level design |
| [UI_UX.md](UI_UX.md) | Visual design, interaction design |
| [DATABASE.md](DATABASE.md) | Data model |
| [API_SPEC.md](API_SPEC.md) | API contract |
| [SECURITY.md](SECURITY.md) | Security requirements (especially code sandboxing) |
| [TESTING.md](TESTING.md) | Quality strategy, completion criteria |
| [ROADMAP.md](ROADMAP.md) | Milestones |
| [VALIDATION.md](VALIDATION.md) | User research plan |
| [DECISIONS.md](DECISIONS.md) | Decision log and open questions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Dev conventions |
| [design.md](design.md) | Pre-existing UX/visual draft (Stage 4) — language-agnostic screens/UX reasoning; its Python code samples are illustrative only, see [DECISIONS.md#d1](DECISIONS.md) |

## Required workflow before implementing a feature

1. **Inspect before you modify.** Read the existing code/docs in the area you're touching before changing it. Never assume structure — check it.
2. **Check [DECISIONS.md](DECISIONS.md)** for whether the approach is already decided, open, or explicitly rejected. If your task requires a decision that isn't there yet, stop and either ask the user or add a `proposed` entry — don't silently decide for them on anything product-shaping.
3. **Check [ROADMAP.md](ROADMAP.md)** — don't build a later milestone's feature while an earlier one is incomplete, unless the user explicitly asks.
4. **Confirm the relevant spec is current.** If PRD/ARCHITECTURE/DATABASE/API_SPEC disagree with what you're about to build, resolve the conflict in the docs first (see "updating documentation" below), don't just pick one silently.
5. **For anything touching code execution or user-submitted code:** read [SECURITY.md](SECURITY.md) first. Untrusted student code must never run inside the main API process ([DECISIONS.md#d8](DECISIONS.md)).

## Coding standards (once implementation starts)

- TypeScript strict mode, no `any` without a comment explaining why it's unavoidable.
- Naming: `camelCase` for variables/functions, `PascalCase` for types/components/classes, `SCREAMING_SNAKE_CASE` for constants, kebab-case for file names (see [CONTRIBUTING.md](CONTRIBUTING.md) for the full convention table).
- No dependency gets added without checking it's not already solvable with what's installed. Prefer the standard library and existing project dependencies over a new package for a one-off need.
- No speculative abstraction. Build the thing the current milestone needs, not the thing a future milestone might need. Three similar lines beat a premature helper.

## Architecture constraints (see [ARCHITECTURE.md](ARCHITECTURE.md) for detail)

- Start with a modular monolith; don't introduce microservices without a measured scaling reason ([DECISIONS.md#d9](DECISIONS.md)).
- Code execution is always a separate, isolated service from the main API ([DECISIONS.md#d8](DECISIONS.md)).
- Data model must stay extensible to future languages without a rewrite — don't hardcode "Java" where a `language_id` foreign key belongs ([DECISIONS.md#d4](DECISIONS.md)).

## Security requirements (see [SECURITY.md](SECURITY.md) for detail)

Non-negotiable baseline for any code that reaches real users: sandboxed/isolated execution with CPU/memory/time/output limits and no network access for student code; no plaintext passwords; no hidden test cases or answer keys ever sent to the browser; parameterized queries only (no string-built SQL); secrets only via environment variables, never committed.

## Testing and validation expectations (see [TESTING.md](TESTING.md) for detail)

A coding challenge is "complete" only when the evaluation engine verifies the submission against the challenge's actual test cases — never when an AI model judges correctness by itself ([TESTING.md](TESTING.md)). Don't mark a feature done without the test coverage that spec calls for.

## Updating documentation

- When an implementation decision changes something a doc asserts, update that doc in the same change — don't let docs drift from reality.
- Cross-reference with relative Markdown links; don't duplicate a full spec across two files — link to the single source instead.
- Mark anything unresolved as `TBD` inline. Don't invent specifics (prices, dates, vendor names) to fill a gap.
- New major decisions, or changes to existing ones, go in [DECISIONS.md](DECISIONS.md) with the structure already used there (context, options, decision, rationale, consequences, status). New open questions go in that file's "Open questions" table.

## Avoid unnecessary dependencies and overengineering

Default to no new dependency, no new abstraction layer, no new service. Justify each one against the "boring by default" standard: what does the current milestone actually require, and is there already a simpler way to get it with what's in the stack per [TECH.md](TECH.md)?
