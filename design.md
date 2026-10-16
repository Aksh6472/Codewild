# CodeQuest: Experience & Visual Design (Stage 4)

*Draft v0.1, 16 Oct 2026. "CodeQuest" is a placeholder name. This builds on [stage1-2-evaluation-and-market.md](stage1-2-evaluation-and-market.md). Decisions are logged in [product-plan.md](product-plan.md).*

> **Default assumed in this doc: Python.** The first language is still open (D4). If interviews show that target colleges teach C first, the screens, loop and visual system stay the same. What changes is the code samples, the error copy, and running C on a server instead of in the browser. Stage 3 (full level design) has not been done yet, so the level list in §4 is provisional.
>
> **Update, 2026-10-16:** the language question referenced above as "still open (D4)" has since been decided — Java is the first language ([DECISIONS.md#d1](DECISIONS.md)). This file's screens, loop, and visual-system reasoning below are retained as-is (they're language-agnostic); its Python code samples are illustrative only. See [GAME_DESIGN.md](GAME_DESIGN.md) and [CURRICULUM.md](CURRICULUM.md) for the Java-specific restatement.

---

## 1. Design principles

These are ranked. When two conflict, the higher one wins.

1. **Code is the controller.** The player never clicks "attack" or "move". Every action in the world happens because their code ran. If the world could react without code, that mechanic does not belong in the game.
2. **The world shows you what your code did.** A wrong loop makes the robot walk into a wall 11 times. It does not just produce a red ✗. This is our main differentiator and our main way of teaching debugging.
3. **Readable first, pretty second.** The editor, the output, and the hint text always beat the art for contrast, size and space. The art never animates behind code.
4. **Fail cheap, never punished.** Mistakes cost nothing permanent: no hearts and no lost streak on a wrong answer. Failure is information, shown in the world.
5. **One new idea per level.** Each level introduces exactly one concept. Old concepts come back to be combined, which is what boss levels are for.
6. **Short sessions, natural stops.** A level takes about 5–10 minutes. After each one, the game offers a clean place to stop, not a pull into the next.
7. **Honest rewards.** XP and coins track real progress, meaning concepts mastered. They never reward time spent or idle tapping. There are no loot boxes, no streak guilt, and no fake urgency.
8. **Works on a ₹30k laptop and a phone.** The prototype should load fast on college Wi-Fi. Phones are for reading, map and review; writing code is designed for laptops first.

**Evidence behind 4–7:** in the 2023 programming-education meta-analysis, *levels/progression* was the only game element with a significant effect on learning. Points, badges and leaderboards were not significant. So structure and progression get the design budget, and cosmetics get the least. [See the Stage 1+2 report]

---

## 2. Core gameplay loop

```
  ┌──────────────► WORLD MAP ◄───────────────────────┐
  │                 pick a quest                      │
  │                     │                             │
  │                     ▼                             │
  │   BRIEFING  (1 screen: what's broken, the goal,   │
  │              what the world looks like now)       │
  │                     │                             │
  │                     ▼                             │
  │   CODE ──► RUN ──► WORLD PLAYS OUT YOUR CODE      │
  │     ▲               │                             │
  │     │      ┌────────┴─────────┐                   │
  │     │   failed              passed                │
  │     │      │                  │                   │
  │     │   see it in world    hidden tests run       │
  │     │   + error in plain   (silently)             │
  │     │   English              │                    │
  │     │      │            ┌────┴─────┐              │
  │     │   Mentor hint     fail      pass            │
  │     │   ladder (opt-in)  │          │             │
  │     └──────┴────────────┘          ▼              │
  │                              REWARD + "what you    │
  │                              learned" recap        │
  │                                     │              │
  └─────────────────────────────────────┴──────────────┘
                 (stop here, or next node unlocks)
```

**Key rule:** visible tests run in the world, and hidden tests run after the visible ones pass. A hidden-test failure appears as an in-world twist, for example *"The gate opened... but the second gate has a different code!"*, and is followed by the specific failing case. It is never a vague "wrong answer".

---

## 3. Screens

There are seven screens in the MVP. All others are out of scope.

### 3.1 Landing / first run (no account)
- One line of pitch, then a **"Play level 1 now"** button. No sign-up wall.
- Level 1 is playable as a guest. The game asks you to save your progress after you win level 1, not before.
- Sign up uses Google, because almost every student has a Google account. Email is a fallback.

### 3.2 Onboarding (≤ 60 seconds, skippable)
Three questions, each one tap:
1. "Have you written code before?" Never / A little / Yes. *This sets the starting hint level.*
2. "Which course are you taking?" Pick your college and the course, or "Just learning". *This drives syllabus mapping, and it is also research data for D4.*
3. Name your robot. *The only cosmetic choice in the MVP; it creates a little attachment.*

### 3.3 World map
- An illustrated map with about 10 nodes on one path, plus 1–2 optional side branches for revision.
- Node states: 🔒 locked · ○ available · ◐ in progress · ★ mastered (all hidden tests passed, few hints used).
- A **syllabus tag** on each node (for example "Unit 2: Loops") makes the course alignment visible.
- HUD on top: player level, XP bar, coins. **No streak counter on the map in the MVP.**
- A "Practice" signpost appears only after a concept is unlocked. It leads to side quests chosen for your weak concepts.

### 3.4 Quest screen (where most time is spent)

Desktop layout, about 1280px and wider:

```
┌──────────────────────────────────────────────────────────────────┐
│ ◄ Map   Level 4 · The Crystal Mine         Lv 3 ▓▓▓▓░░ 240 XP  ⚙ │
├───────────────────────────────┬──────────────────────────────────┤
│                               │  GOAL                            │
│        WORLD VIEW             │  Collect all 10 crystals.        │
│   (grid stage, robot,         │  ✓ robot ends on the exit        │
│    crystals, obstacles)       │  ○ crystals collected == 10      │
│                               ├──────────────────────────────────┤
│   ▶ Run   ⏸   ⏭ step   1×/2× │  EDITOR                          │
│                               │  1  for i in range(10):          │
│   timeline: ●──●──●──○──○     │  2      robot.move()             │
│   (scrub through the run)     │  3      robot.collect()          │
├───────────────────────────────┤                                  │
│  CONSOLE / OUTPUT             │                                  │
│  > crystals: 9 / 10           │  [ Run ▶ ]   [ Need a hint? ]    │
│  Robot hit a wall on step 10  │                                  │
└───────────────────────────────┴──────────────────────────────────┘
```

- **The world and the editor are side by side, not stacked.** You always see the cause (code) and the effect (world) at the same time.
- **Step mode with line highlighting:** stepping through the run highlights the line that is executing in the editor while the robot moves. This is the most important teaching feature on the screen.
- **Goal checklist:** each visible test is a plain-language line that ticks off live as the run proceeds.
- On mobile and narrow screens, there are tabs for **World | Code | Goal**. Running the code switches to the World tab automatically.

### 3.5 Mentor panel (AI hint ladder)
It opens as a drawer on the right, and only when the player asks or after 2 failed runs, when it offers itself once.

| Rung | What it shows | Source |
|---|---|---|
| 0 | Plain-English error message, for example "Line 3: Python expected a `:` at the end of the `for` line" | **Deterministic** (error-pattern table) |
| 1 | **Nudge**: a question pointing at the misconception, in character. *"Count the crystals and count your steps. Do they match?"* | AI, constrained by the level's concept and the failing test |
| 2 | **Focus**: names the line and the concept. *"Look at `range(10)` on line 1. How many times does it run?"* | AI |
| 3 | **Worked example**: a similar problem solved, not this one | Authored per level |
| 4 | **Solution walkthrough**: only after 3+ attempts; the level is marked "assisted" | Authored |

- **The AI never decides correctness.** The test runner does. The AI sees the code, the failing test result, and the level's concept, and it may only reference those.
- Using hints lowers the coins for the level. It does not lower XP and does not block progress. ★ mastery requires solving without rung 4.

### 3.6 Reward / recap
- A short animation of about 2 seconds that can be skipped: the world repairs itself (lights on, gate opens, robot talks).
- **"What you just learned"** card: one sentence plus the key line of code. This is the learning anchor, so it is mandatory to show and quick to dismiss.
- XP and coins count up. If the player has levelled up, the new rank is shown.
- Two buttons of equal weight: **Next quest** and **Back to map**. The second one is never greyed out or hidden.

### 3.7 Profile / progress
- A concept mastery list, such as Variables ★, Loops ◐, Functions 🔒, with a "practice this" link on weak ones.
- Simple stats: levels done, average attempts per level, hints used.
- In the MVP there is no public profile and no leaderboard. Class leaderboards are a post-MVP experiment and opt-in only.

---

## 4. Provisional MVP level arc (Python default; full design is Stage 3)

**World: "The Silent Foundry".** A workshop city where the machines stopped because nobody remembers how to instruct them. You and your robot bring it back to life, one district at a time. The theme is chosen because **code controlling machines is the natural mechanic**, so the story does not have to be bolted on.

| # | Node | Concept | What your code does in the world | Boss/twist |
|---|---|---|---|---|
| 1 | Wake-up | `print` / output | The robot speaks for the first time | — |
| 2 | Name tag | Variables, strings | Store the robot's name and power; a sign updates | — |
| 3 | Power math | Numbers, operators | Calculate battery needed to cross a bridge | Hidden test: different bridge length |
| 4 | Crystal mine | `for` loop | Move and collect 10 crystals | Hidden: 7 crystals |
| 5 | The gate | `if / else` | Open a gate only when the sensor reads the right value | — |
| 6 | Patrol | `while` + conditions | Walk until you hit a wall, then turn | Hidden: a different room shape |
| 7 | Toolbelt | Functions | Package `turn_around()` and reuse it | — |
| 8 | Cargo bay | Lists | Sort crates by weight onto shelves | — |
| 9 | Registry | Dictionaries | Look up which key opens which door | — |
| 10 | **Foundry Core (boss)** | Combine everything | Multi-step: read sensor list → decide → route robot → report | 3 hidden scenarios |

- **Side quests** (2–3 total in the MVP) reuse level 4–7 mechanics on new maps for revision.
- If D4 switches to C, the same arc maps to the AICTE first-year order, with a syntax-and-output level, data types, operators, branching, loops, functions, arrays and strings, and structs as a later boss.

---

## 5. User journeys

### J1: First-timer, day 1 (the one that must work)
Lands on the site → plays level 1 as a guest (about 2 minutes) → win animation → "Save your robot? Sign in with Google" → three onboarding taps → map shows the next node glowing → plays levels 2–3 → recap → **natural stop**.
*Success:* reaches level 3 in one sitting without help from a person.

### J2: Stuck player
Runs code → the robot walks into a wall → the console shows a plain-English hint (rung 0) → runs again and fails → the mentor offers itself once → nudge (rung 1) → steps through slowly and sees line 1 highlighted while the robot takes its 11th step → fixes it → passes, and a hidden-test twist fails → a specific case appears ("there are 7 crystals in this mine") → generalises the code → wins.
*Success:* solves it without rung 4, and the recap says what they learned.

### J3: Returning student, day 3
Opens the site → the map shows where they left off, with a "Loops ◐" practice suggestion → plays one side quest (about 5 minutes) → continues the main path.
*Success:* comes back **without a push notification**. This is the key retention signal.

### J4: Exam-week revision (syllabus wedge)
Opens Profile → filters by syllabus unit ("Unit 3: Functions") → replays a mastered level in "no hints" mode → takes a 5-question mixed review.
*Success:* uses the game as revision for their real course. This is the strongest willingness-to-pay signal.

---

## 6. Visual identity

### 6.1 Direction: "warm workshop," illustrated and flat
- **Look:** flat or lightly shaded 2D illustration with clean shapes, at a "premium indie" level of polish rather than retro pixel art. Pixel art is Codédex's identity, so we should avoid looking like a clone.
- **Mood:** warm, curious, a bit humorous. Machines are friendly, and failures are funny rather than scary (the robot sheepishly bonks a wall).
- **Perspective:** top-down or ¾ grid stages. They are cheap to produce and make movement and loops easy to read.
- **Production reality:** one environment tileset, one robot with about 6 animations (idle, walk, turn, collect, bonk, celebrate), and about 4 NPC portraits. Use a licensed asset pack plus custom colour work for the prototype, and commission original art only after validation.

### 6.2 Colour tokens (draft)
Two themes: dark is the default because coders prefer it, and light is available.

| Token | Role | Dark | Light |
|---|---|---|---|
| `--bg` | App background | `#14161C` | `#F6F3EE` |
| `--surface` | Panels, cards | `#1E222B` | `#FFFFFF` |
| `--editor-bg` | Code editor | `#101218` | `#FBFAF7` |
| `--text` | Body text | `#E8E6E1` | `#1E1E22` |
| `--text-muted` | Secondary | `#9CA0AB` | `#5D6068` |
| `--brand` | Primary action, "energy" | `#F2A33A` (amber) | `#C9761A` |
| `--accent` | Mentor, links | `#5BC0BE` (teal) | `#2A8784` |
| `--success` | Passed test | `#6BCB77` | `#2F8F3E` |
| `--danger` | Failed test | `#EF6F6C` | `#C23B38` |
| `--xp` | XP bar | `#A78BFA` | `#6D4FD6` |

- All text and background pairs must reach **WCAG AA contrast (4.5:1)**, to be checked when the tokens are coded.
- **Pass/fail is never shown by colour alone.** Always pair it with an icon (✓ / ✗) and a text label.

### 6.3 Typography
- **UI and body:** *Inter* or *Nunito*, both free and highly readable. Nunito is friendlier and Inter is more neutral; pick one in the prototype.
- **Display (titles, level names):** one characterful free face, for example *Baloo 2* or *Fredoka*, used sparingly.
- **Code:** *JetBrains Mono*, which is free and has clear 0/O and 1/l/I distinctions. Default editor size is 15–16px and the user can change it.

### 6.4 Motion
- Running the world: robot moves at about 250ms per step at 1× speed, and the player can switch to 2× or step-by-step.
- Rewards are 2s or less and can be skipped. Respect `prefers-reduced-motion`: replace movement with fades.
- **No idle animation near the editor.** Nothing moves next to code while the player is typing.

### 6.5 Voice and copy
- The mentor character is a gruff-but-kind old foreman robot, "Gears" (a placeholder name). Its lines are short, at most 2 sentences.
- Error messages say **what happened, where, and one thing to try**. They never say "Invalid syntax" on its own.
- Everything is written in English for the MVP. Hinglish flavour lines are a cheap experiment to test in interviews.

---

## 7. How world, editor, quests and feedback connect

| Event | Editor | World | Goal panel | Mentor | Rewards |
|---|---|---|---|---|---|
| Player types | Syntax highlighting, light linting | Frozen, showing the starting state | Unchanged | Silent | — |
| **Run** | Locks, highlights the executing line | Plays the run step by step | Ticks visible tests live | Silent | — |
| Syntax/runtime error | Red marker on the line | Robot shows a "?" bubble | Unchanged | Rung 0 shown in the console | — |
| Logic wrong | Run timeline can be scrubbed | Shows the wrong outcome (bonk, wrong door) | Shows which goal line failed | Offers itself once after 2 fails | — |
| Visible tests pass | — | Partial success animation | All ticked | — | — |
| Hidden test fails | — | "Twist" scene | Adds a new line with the specific case | Can explain the case | — |
| All pass | Shows the "key line" | Full repair animation | ★ if the mastery rules were met | Brief "well done" in character | XP and coins; next node unlocks |

**Data captured per run, for adaptive learning and validation:** level, concept, attempt number, error type, failing test id, hint rung reached, time on task. This is the raw material for mastery estimates in Stage 5. The rules come first, and AI is used only where the rules cannot help.

---

## 8. Accessibility checklist (MVP)
- Everything works by keyboard, including Run. *Ctrl/Cmd+Enter* runs, *Esc* closes the mentor.
- The editor works with screen readers (CodeMirror 6 supports this). The world view has a text log of the run.
- Contrast is AA or better. Colour is never the only signal.
- Reduced-motion mode is supported. Editor font size can be adjusted.
- Text is not baked into images.

## 9. Out of scope for the MVP design
Multiplayer and races, guilds, a cosmetics shop, multiple worlds or languages, the faculty dashboard, voice, a native mobile app, a public leaderboard, and daily-streak mechanics.

## 10. What to validate with this design
- **5-second test** on the quest screen: can a student say what they are supposed to do?
- **Prototype test** of levels 1, 4 and 10 (Python, in-browser): how many attempts it takes, whether step mode is used, which hint rungs are reached, and whether they ask to keep playing.
- **Look test:** show 3 style boards (warm workshop, sci-fi neon, fantasy) to 10 students and ask which one they would want to open again. This is not a vote on what looks "best".
