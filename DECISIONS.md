# Decision Log — Project Atlas

Source of truth for product and engineering decisions. Every non-trivial choice that would be expensive to reverse, or that a future session needs to know "why," gets an entry here. See [CLAUDE.md](CLAUDE.md) for the rule on when to add one.

Status values: `proposed` → `accepted` | `rejected`, or later `superseded` by a new decision ID.

---

### D1 — Java is the first programming language
- **Date:** 2026-10-16
- **Context:** The platform needs one language to prove the core loop (code → world reaction) before expanding. Candidates considered: Python, Java, C, JavaScript.
- **Options considered:**
  - Python — easiest syntax, fastest to a "wow" moment, large beginner-education precedent (Codédex, CodeCombat).
  - Java — the language most Indian engineering colleges (AICTE/university syllabi) actually teach first; strongest "do my coursework in this" pull; verbose syntax is a UX cost the game has to hide.
  - C — matches some first-year AICTE tracks, but pointers/manual memory make early levels harder to gamify safely.
  - JavaScript — great for in-browser execution (no sandboxing needed) but weak alignment with target curriculum.
- **Decision:** Java is the first language and first complete learning path (Fundamentals → OOP → DSA).
- **Rationale:** Direct curriculum alignment with the target user (Indian engineering students) is a stronger acquisition and retention lever than syntax ease. Python's simplicity advantage is addressed through game design (§ generous scaffolding, strong error translation in [GAME_DESIGN.md](GAME_DESIGN.md)), not language choice.
- **Consequences:** Code execution requires server-side JVM compilation/execution (no safe in-browser Java runtime) — see [TECH.md](TECH.md) and [SECURITY.md](SECURITY.md) for sandboxing implications. Early curriculum design (`CURRICULUM.md`) must invest extra effort in hiding Java boilerplate (classes, `public static void main`) from beginners in level 1.
- **Status:** accepted
- **Supersedes:** The prior design draft [design.md](design.md) (Stage 4, 2026-10-16) assumed Python as a placeholder default "pending D4." That placeholder is resolved by this decision — Python becomes a candidate for a later learning path, not the first one. `design.md` itself is not rewritten (its screens/UX reasoning is language-agnostic); treat its Python code samples as illustrative only.

---

### D2 — Learning sequence is Fundamentals → OOP → DSA
- **Date:** 2026-10-16
- **Context:** Need a path, not just a single course, to justify "learning journey" product framing and long-term retention.
- **Options considered:** Fundamentals-only MVP with no stated path; interleaved fundamentals+OOP; DSA-first (common for placement-prep products, e.g. competitive programming platforms).
- **Decision:** Three sequential worlds — Java Fundamentals, Java OOP, DSA with Java — each gating the next.
- **Rationale:** Mirrors the standard semester-by-semester order in Indian CS/IT curricula, so progress in-game maps to progress in class (syllabus-alignment is the strongest validation signal from [VALIDATION.md](VALIDATION.md) hypotheses). DSA requires OOP maturity (e.g., node/tree classes) so OOP must come first.
- **Consequences:** MVP scope is Fundamentals only (10 levels, see [CURRICULUM.md](CURRICULUM.md)); OOP and DSA are explicitly future milestones in [ROADMAP.md](ROADMAP.md), not built now.
- **Status:** accepted

---

### D3 — Game-first, not a course with gamification bolted on
- **Date:** 2026-10-16
- **Context:** Every element (world, editor, mentor, rewards) must be designed as one integrated experience rather than a conventional course UI with XP/badges added afterward.
- **Options considered:** Standard LMS/course UI + badges (fastest to build, highest risk of feeling generic); game-first integrated design (slower, higher differentiation); hybrid "course with optional minigames."
- **Decision:** Game-first. Code is the controller of a persistent world; every mechanic must have both a gameplay reason and a teaching reason. See [GAME_DESIGN.md](GAME_DESIGN.md) principle 1.
- **Rationale:** This is the stated competitive wedge against Codédex/CodeCombat/Boot.dev (see [docs/research/COMPETITIVE_ANALYSIS.md](docs/research/COMPETITIVE_ANALYSIS.md)) and the founder's product thesis.
- **Consequences:** Higher art/engineering cost per level; MVP must therefore ruthlessly limit level count (10 levels) to keep this standard achievable. Evidence basis (progression > points/badges per the 2023 meta-analysis cited in `design.md`) supports investing in structure/progression over cosmetics.
- **Status:** accepted

---

### D4 — Additional languages are a future capability, not MVP scope
- **Date:** 2026-10-16
- **Context:** Python, C++, JavaScript are named as possible future paths.
- **Decision:** Architecture must support multiple languages without a rewrite (see [ARCHITECTURE.md](ARCHITECTURE.md) execution-service abstraction and [DATABASE.md](DATABASE.md) `languages` table), but no second language ships before Java Fundamentals + OOP + DSA are validated.
- **Rationale:** Avoid the common early-stage trap of building for breadth before proving depth works for one path.
- **Status:** accepted

---

### D5 — Brand name is undecided; use "Project Atlas" internally
- **Date:** 2026-10-16
- **Context:** `design.md` (pre-existing) already uses "CodeQuest" throughout as a working title. The task brief also lists "Bytebound."
- **Decision:** All new documentation uses the neutral codename **Project Atlas**. "CodeQuest" and "Bytebound" remain candidate consumer-facing brand names, not final. Do not rename `design.md`'s internal references retroactively — treat "CodeQuest" wherever it appears in that file as "a placeholder name," per that file's own header.
- **Status:** accepted — naming itself is `TBD`, tracked as an open question below.

---

### D6 — MVP focuses on a single-language Java Fundamentals experience
- **Date:** 2026-10-16
- **Decision:** The MVP is 10 Java Fundamentals levels (see [docs/product/MVP_SCOPE.md](docs/product/MVP_SCOPE.md) and [CURRICULUM.md](CURRICULUM.md) §"First 10 levels"), playable as a guest through level 1, with account creation, AI hints, and progress persistence — but no OOP/DSA content, no multiplayer, no faculty dashboard, no leaderboards.
- **Rationale:** Direct instruction from the founder brief: "The MVP must focus on a compelling Java fundamentals experience rather than attempting to deliver every proposed feature immediately."
- **Status:** accepted

---

### D7 — User validation (15–20 student interviews) begins before large-scale implementation
- **Date:** 2026-10-16
- **Decision:** Run the validation plan in [VALIDATION.md](VALIDATION.md) in parallel with/before building past the playable prototype milestone (see [ROADMAP.md](ROADMAP.md) milestone 1–2).
- **Rationale:** De-risk the game-first bet and the Java-first bet with real target users before investing in OOP/DSA content or infra scaling.
- **Status:** accepted

---

### D8 — Code execution must never run inside the main API process
- **Date:** 2026-10-16
- **Context:** Untrusted student Java code must compile and run somewhere.
- **Options considered:** Managed third-party execution service (e.g., Judge0-style API) vs. self-hosted isolated sandbox (containers/microVMs) vs. running `javac`/`java` in-process in the API (rejected outright).
- **Decision:** Code execution is an isolated, separately-deployed service, reachable only by the backend API, never by the browser directly. Choice between managed vs. self-hosted sandbox is **not yet finalized** — see [TECH.md](TECH.md) §Code Execution for the comparison and `TBD` marker.
- **Rationale:** Non-negotiable security boundary; explicitly mandated by the founder brief ("Never execute untrusted student code directly inside the main API process").
- **Status:** accepted (the "isolate execution" principle); the specific vendor/self-host choice is `proposed`, pending a cost/security spike before milestone 4 in [ROADMAP.md](ROADMAP.md).

---

### D9 — Start with a modular monolith
- **Date:** 2026-10-16
- **Decision:** Backend is one deployable modular monolith (API + game-progress logic), with code execution as the one separate service (per D8). No microservices split until there's a measured scaling reason.
- **Rationale:** Team size and MVP scope do not justify distributed-systems overhead. See `backend-design:boring-by-default` principles.
- **Status:** accepted

---

### D10 — Milestone 3 first-playable-build scope and tech locks
- **Date:** 2026-10-16
- **Context:** Implementing [ROADMAP.md](ROADMAP.md) Milestone 3 (a working local prototype) required locking several TECH.md choices that were still Provisional, and cutting scope to the first 3 of 10 Fundamentals levels.
- **Decision:**
  - Tech locked for this build: **Node.js/TypeScript + Fastify** backend (`apps/api`), **React + Vite + hand-rolled Canvas 2D** frontend (`apps/web`), and **local Docker-based Java execution** (`apps/api/src/execution/dockerRunner.ts`, image at `infra/java-sandbox/Dockerfile`) — explicitly dev-only, not the production sandbox decision ([TECH.md](TECH.md) §9, still open).
  - Scope cut to **[CURRICULUM.md](CURRICULUM.md) levels 1–3 only** (Wake-up, Name tag, Power math) — the only levels in the first 10 with no `robot.move()`-style world-interaction API, so the full loop (editor → compile → run → test → reward) could be proven without first designing that protocol.
  - **No auth yet**: every user-scoped database row uses a single hardcoded `DEV_USER_ID` constant (`apps/api/src/devUser.ts`) instead of a `users` table — real accounts are Milestone 6.
  - **Adaptation from CURRICULUM.md**: level 3's starter code reads `bridgeLength` via `Scanner`/stdin instead of a hardcoded literal, so the hidden test (a different bridge length) can run without patching the student's source — the standard online-judge pattern. Same learning objective (a formula, not a hardcoded answer), different input mechanism.
- **Rationale:** Needed concrete, unblocking choices to move from documentation to a verified, playable loop; all are revisable and don't commit the production architecture.
- **Consequences:** `TECH.md` §§1, 3, 5, 9 updated to reflect these as "Confirmed for local dev prototype." `docs/engineering/DEVELOPMENT_SETUP.md` now has real setup steps instead of a placeholder. Levels 4–10 and real auth remain unimplemented.
- **Status:** accepted

---

## Open questions (not yet decided)

| ID | Question | Blocks | Owner |
|---|---|---|---|
| Q1 | Final brand name and domain | Marketing site copy, app store listing, logo | Founder |
| Q2 | Managed vs. self-hosted Java sandbox (see D8) | Milestone 4 build start, cost model in TECH.md | Engineering |
| Q3 | AI hint provider (model, cost ceiling per active user) | `AI_HINTS` integration, [SECURITY.md](SECURITY.md) prompt-injection mitigations | Engineering |
| Q4 | Auth provider (Google OAuth confirmed per `design.md`; email/password fallback — build in-house or use a provider like Auth0/Clerk?) | [ARCHITECTURE.md](ARCHITECTURE.md), [DATABASE.md](DATABASE.md) users table | Engineering |
| Q5 | Hosting/cloud provider and region (India-latency matters for target users) | [docs/engineering/DEPLOYMENT.md](docs/engineering/DEPLOYMENT.md), cost model | Engineering |
| Q6 | Monetization model (subscription vs. freemium vs. per-institution licensing) | [PRD.md](PRD.md) monetization hypotheses, pricing page | Founder |
| Q7 | Where `stage1-2-evaluation-and-market.md` and `product-plan.md` (referenced by `design.md`'s header but absent from this repo) actually live | Full picture of prior market research and earlier-stage decisions | Founder — confirm whether these exist elsewhere or need to be recreated |
| Q8 | Typography choice: Inter vs. Nunito for UI (design.md leaves this open "pick one in the prototype") | [UI_UX.md](UI_UX.md) finalization | Design |

Update this table as questions resolve — move resolved rows into a dated decision entry above instead of deleting them.
