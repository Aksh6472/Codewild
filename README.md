# Project Atlas

> Internal codename. Brand name undecided — see [DECISIONS.md#d5](DECISIONS.md). Working titles under consideration include "CodeQuest" (used in the pre-existing [design.md](design.md) draft) and "Bytebound."

**Status: pre-implementation.** This repository currently contains product, design, and engineering documentation only. No application code has been written yet. See [ROADMAP.md](ROADMAP.md) for what's actually being built and when.

## What it does

Project Atlas teaches programming by making code the controller of a game world. Instead of completing exercises and watching a progress bar fill, players write real code that visibly changes what happens in a persistent game: a variable sets a character's stat, a loop makes a robot walk, a class defines a game entity. The loop is **PLAY → CODE → SOLVE → LEVEL UP → UNLOCK → BUILD → MASTER**.

## The problem it solves

Most beginner coding platforms are one of two things: a course with gamification decoration (XP bars bolted onto video lessons and quizzes), or a game that treats code as a side puzzle disconnected from a real curriculum. Students — especially engineering students under syllabus pressure — need something that is genuinely engaging *and* maps to what they're actually being examined on. See [docs/research/COMPETITIVE_ANALYSIS.md](docs/research/COMPETITIVE_ANALYSIS.md) for how existing products (Codédex, Boot.dev, CodeCombat) split this difference and where the gap is.

## Target users

Beginner programmers, with a primary focus on Indian engineering students taking a first-year or early programming course. See [docs/product/USER_PERSONAS.md](docs/product/USER_PERSONAS.md).

## Core features (planned)

- A world that visibly reacts to the player's code (not a text-adventure wrapper around a quiz).
- A real code editor beside the world view, with step-by-step execution and line highlighting tied to what's happening in the game.
- An AI-assisted hint ladder that only ever explains — never decides correctness; a deterministic test runner always makes the pass/fail call.
- Progress that maps to a real curriculum (syllabus tags per level), so playing is also exam revision.
- Honest rewards: XP and coins track concepts mastered, not time spent or streaks.

Full detail in [GAME_DESIGN.md](GAME_DESIGN.md) and [PRD.md](PRD.md).

## Planned learning journey

1. **World 1 — Java Fundamentals** (the MVP; see [docs/product/MVP_SCOPE.md](docs/product/MVP_SCOPE.md))
2. **World 2 — Java OOP**
3. **World 3 — Data Structures & Algorithms with Java**
4. Additional languages (Python, C++, JavaScript) — future, not scheduled yet ([DECISIONS.md#d4](DECISIONS.md))

Full topic breakdown in [CURRICULUM.md](CURRICULUM.md).

## Current implementation status

| Area | Status |
|---|---|
| Product/design documentation | In progress (this repository) |
| User validation (15–20 student interviews) | Not started — plan defined in [VALIDATION.md](VALIDATION.md) |
| UX prototype | Not started |
| Playable Java Fundamentals prototype | Not started |
| Secure Java code execution | Not started — approach not finalized, see [TECH.md](TECH.md) §Code Execution |
| Accounts & progress persistence | Not started |
| AI hints | Not started |

**Nothing below "Product/design documentation" has been built.** Treat every feature described in this README and in linked docs as a plan, not a claim about current functionality.

## Repository structure

```text
project-root/
├── CLAUDE.md               # Instructions for Claude Code sessions
├── README.md                # This file
├── PRD.md                   # Product requirements
├── TECH.md                  # Technology stack decisions
├── ARCHITECTURE.md          # System architecture
├── GAME_DESIGN.md           # Gameplay specification
├── CURRICULUM.md            # Learning curriculum
├── UI_UX.md                 # Interface and visual design
├── DATABASE.md              # Data model
├── API_SPEC.md              # API contract
├── SECURITY.md              # Security specification
├── TESTING.md               # Quality strategy
├── ROADMAP.md                # Milestones
├── VALIDATION.md             # Startup/user validation plan
├── DECISIONS.md              # Decision log + open questions
├── CONTRIBUTING.md           # Dev conventions
├── design.md                 # Pre-existing UX/visual draft (Stage 4)
├── .env.example               # Environment variable template
└── docs/
    ├── research/COMPETITIVE_ANALYSIS.md
    ├── product/{USER_PERSONAS,USER_FLOWS,MVP_SCOPE}.md
    └── engineering/{DEVELOPMENT_SETUP,DEPLOYMENT,OBSERVABILITY}.md
```

## Development setup

No application exists yet to set up. Once implementation begins, setup instructions will live in [docs/engineering/DEVELOPMENT_SETUP.md](docs/engineering/DEVELOPMENT_SETUP.md).

## Documentation index

Start with [CLAUDE.md](CLAUDE.md) for the workflow, then [PRD.md](PRD.md) for product scope and [DECISIONS.md](DECISIONS.md) for why things are the way they are.

## Current limitations and upcoming milestones

This is pre-code. The immediate next steps (see [ROADMAP.md](ROADMAP.md) for full detail) are: resolve the open questions in [DECISIONS.md](DECISIONS.md), run the student validation interviews in [VALIDATION.md](VALIDATION.md), and build a UX prototype — in that order, before any production engineering.
