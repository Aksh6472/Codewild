# Technology Stack — Project Atlas

Status markers used throughout: **Confirmed** (decided, see [DECISIONS.md](DECISIONS.md)), **Provisional** (recommended, not yet locked), **TBD** (genuinely open).

## 1. Frontend framework — React + TypeScript — Provisional

- **What it does:** Component-based UI framework with static typing.
- **Why it fits:** Large ecosystem of game-adjacent canvas/DOM integration libraries; TypeScript catches a class of bugs that matter when the editor, world renderer, and WebSocket/HTTP layers all need to agree on shared types (e.g., test-result schemas in [API_SPEC.md](API_SPEC.md)).
- **Alternatives considered:** Svelte (smaller bundle, less hiring pool, less game-library precedent); Vue (similar trade-off to Svelte).
- **Trade-offs:** React's re-render model needs care around the world-view canvas (avoid re-rendering a game loop through React state on every frame — drive the renderer imperatively, update React only for HUD/UI state).
- **Cost:** No licensing cost; cost shows up as build complexity, which is justified here by the editor+world+HUD UI density.
- **Security:** Standard frontend XSS discipline (escape all AI-hint and user-generated text before render).

## 2. Build tool — Vite — Provisional

- **What it does:** Dev server + bundler.
- **Why it fits:** Fast cold start and HMR, which matters for iterating on a visually heavy UI; first-class React + TypeScript support.
- **Alternatives:** Next.js (adds SSR/routing the game client doesn't need for an MVP that's mostly a single authenticated app shell; reconsider if a marketing/SEO site is needed — that could be a separate small Next.js or static site, not the game client).
- **Trade-offs:** None significant for this use case.
- **Cost:** None.

## 3. Game rendering — HTML5 Canvas (2D), via a lightweight rendering library — Provisional

- **What it does:** Renders the grid-based world view (robot, crystals, obstacles) described in `design.md` §6.1 ("top-down or ¾ grid stages").
- **Why it fits:** The visual direction is explicitly 2D, grid-based, flat/illustrated — not a 3D engine's problem. A full game engine (Unity/Godot/Phaser) is more than this needs.
- **Alternatives considered:**
  - **Plain Canvas 2D API, hand-rolled:** maximum control, no dependency, but more code to write for sprite animation and the run-timeline scrubbing feature (`design.md` §3.4).
  - **PixiJS:** WebGL-backed 2D renderer, handles sprite batching/animation well, much lighter than a full engine. **Recommended** if a library is wanted.
  - **Phaser:** a full 2D game framework (physics, scenes, input) — likely more than needed since there's no physics simulation, just scripted step-by-step playback of a code run.
- **Decision:** Provisional recommendation is PixiJS if hand-rolled Canvas proves too slow to build the step/scrub timeline; start hand-rolled and only add a library when a specific gap appears (overengineering guard per [CLAUDE.md](CLAUDE.md)).
- **Cost/Security:** No cost; no special security surface (it only renders a trusted script: the sequence of world-state frames produced by the execution service, not user code directly).

## 4. Code editor — CodeMirror 6 — Confirmed direction (per `design.md` §8, which specifies CodeMirror 6 for screen-reader support)

- **What it does:** In-browser code editor component with syntax highlighting, line markers (for step-mode highlighting), and accessibility support.
- **Why it fits:** Needs Java syntax highlighting, the ability to programmatically highlight "the currently executing line" during step mode, and screen-reader compatibility (an explicit accessibility requirement, [PRD.md](PRD.md) N4).
- **Alternatives considered:** Monaco Editor (VS Code's editor) — more features (IntelliSense-grade), but heavier bundle and weaker accessibility track record; overkill for beginner Java exercises with small files.
- **Trade-offs:** CodeMirror 6 requires writing a Java language-mode config (official `@codemirror/lang-java` package exists and covers syntax highlighting; no production-grade Java *language server* in-browser — that's fine, since correctness checking happens server-side via actual compilation, not client-side linting).
- **Cost:** Free, open-source (MIT).

## 5. Backend API — Node.js (TypeScript) with a conventional framework (e.g., Fastify or Express) — Provisional

- **What it does:** Serves the API in [API_SPEC.md](API_SPEC.md): auth, level/challenge retrieval, submission orchestration, progress tracking.
- **Why it fits:** One language (TypeScript) across frontend and backend reduces context-switching for a small team; strong ecosystem for talking to Postgres, queues, and HTTP-based execution services.
- **Alternatives considered:** A JVM backend (Spring Boot) — tempting since the product teaches Java, but doesn't make the backend itself better suited to the job, and splits the team across two languages for no product benefit. Python (FastAPI) — equally viable, slightly weaker type-sharing story with a TS frontend.
- **Trade-offs:** Node is not the right place to *run* Java code (see §9) — it only orchestrates calls to the execution service.
- **Cost:** None beyond hosting.
- **Security:** Standard Node API hardening — see [SECURITY.md](SECURITY.md).

## 6. Database — PostgreSQL — Confirmed (per founder brief)

- **What it does:** Relational store for users, curriculum content, submissions, progress — see [DATABASE.md](DATABASE.md).
- **Why it fits:** Relational integrity matters here (a submission belongs to exactly one user and one challenge; mastery rollups depend on consistent joins); JSONB columns cover flexible fields (e.g., per-challenge test case definitions) without abandoning relational structure elsewhere.
- **Alternatives considered:** MongoDB (weaker fit — the domain is inherently relational: users → progress → submissions → challenges); Firebase/Firestore (fast to start, but weak for the relational mastery/progress queries and ties the whole backend to one vendor).
- **Cost:** Managed Postgres (e.g., RDS, Supabase, Neon, Railway) — provider TBD, see [docs/engineering/DEPLOYMENT.md](docs/engineering/DEPLOYMENT.md).
- **Security:** Parameterized queries only; see [SECURITY.md](SECURITY.md) for SQL-injection prevention and [DATABASE.md](DATABASE.md) for password hashing requirements.

## 7. Authentication — Google OAuth (primary) + email/password fallback — Partially confirmed

- **What it does:** Sign-in. `design.md` §3.1 confirms "Sign up uses Google, because almost every student has a Google account. Email is a fallback."
- **Why it fits:** Near-universal Google account ownership among the target audience; avoids building password-reset flows as a day-1 requirement.
- **Open question:** build OAuth + email auth in-house (e.g., via Passport.js + bcrypt) vs. use a managed auth provider (Clerk, Auth0, Supabase Auth) — **TBD**, see [DECISIONS.md Q4](DECISIONS.md). A managed provider is the boring/recommended default unless it meaningfully increases cost at scale or conflicts with the India-latency hosting decision.
- **Security:** Guest play (level 1, no account, per [PRD.md](PRD.md) F1) must not create any persisted user record until sign-up; never store OAuth tokens or passwords in plaintext.

## 8. AI-assisted hints — Provider TBD

- **What it does:** Generates hint-ladder rungs 1–3 (nudge, focus, worked example) per `design.md` §3.5. Rung 0 is deterministic (an error-pattern table, no AI call). Rung 4 is authored content, not AI-generated.
- **Why an LLM API fits:** Needs to generate contextual, level-appropriate natural-language hints from (player code, failing test, level concept) — a natural-language generation task.
- **Alternatives considered:** Fully authored/scripted hints only (no AI) — cheaper and fully deterministic, but doesn't scale to covering the long tail of ways a beginner's code can be wrong; a hybrid (scripted for common error patterns, AI for the rest) is likely the right shape and should be evaluated.
- **Trade-offs/cost:** Per-call cost scales with active users; must be capped (e.g., hint calls per user per day) — see [PRD.md](PRD.md) risk table. Use a model from Anthropic's Claude family (see the `claude-api` reference skill for current model IDs/pricing when this is implemented) given the context-injection need (code + test result + level concept) and the requirement that **the AI never decides correctness** — it only explains a result the test runner already produced ([DECISIONS.md#d3](DECISIONS.md) reinforcement; full rule in [TESTING.md](TESTING.md)).
- **Security:** Prompt-injection risk — a student could put adversarial text inside code comments/strings aimed at the hint model. See [SECURITY.md](SECURITY.md) §AI prompt injection risks: the hint prompt must treat submitted code as untrusted data, not instructions, and the hint response must never be allowed to claim a test passed when it didn't (the UI gets pass/fail only from the test runner's result, never from the hint model's text).

## 9. Java code execution — the highest-stakes technical decision — Provisional, comparison below (see [DECISIONS.md#d8](DECISIONS.md), [SECURITY.md](SECURITY.md))

**Non-negotiable constraint:** untrusted student Java code never compiles or runs inside the main API process. It always goes to an isolated execution service reachable only server-to-server.

### Option A — Managed code-execution API (e.g., a Judge0-style hosted service)
- **What it does:** Accepts source + stdin, compiles and runs in a provider-managed sandbox, returns stdout/stderr/exit code/resource usage.
- **Benefits:** No sandbox infrastructure to operate; provider owns the isolation/escape-prevention engineering; fast to integrate (HTTP call).
- **Trade-offs:** Per-execution cost at scale; less control over exact resource limits, warm-start latency, and JVM-specific tuning (e.g., pre-warming the JVM to cut startup time, which matters for a snappy "Run" button); vendor dependency for a core product capability.
- **Cost:** Usage-based (per-submission or per-month quota); needs modeling against expected concurrent levels/day once usage data exists from validation.
- **Security:** Delegates the isolation engineering to the vendor — still must verify their isolation claims (namespaces/cgroups-based, as Judge0's published architecture describes) meet this product's bar before trusting it with real users.

### Option B — Self-hosted isolated sandbox (containers or microVMs)
- **What it does:** Operate our own execution workers — e.g., one-shot Docker containers or Firecracker microVMs per submission, each with strict CPU/memory/time/process/network/filesystem limits, running `javac` then `java` (or a pre-warmed JVM pool to cut cold-start latency).
- **Benefits:** Full control over resource limits, JVM warm-start strategy, and cost ceiling (marginal cost is compute, not per-call vendor pricing); no vendor lock-in for a core capability.
- **Trade-offs:** Must build and operate the isolation correctly — a security-critical system with real engineering cost (container escape prevention, queue/worker orchestration, autoscaling for concurrent submissions). Higher upfront engineering investment.
- **Cost:** Compute cost scales with usage but no per-submission vendor fee; the hidden cost is engineering time to build and keep it secure.
- **Security:** Full responsibility sits with this team — see [SECURITY.md](SECURITY.md) for the mandatory controls (timeouts, memory/CPU/process/output caps, no network, read-only filesystem, container/VM-level isolation boundary).

### Recommendation
**TBD — do not pick yet.** Run a short spike (named in [ROADMAP.md](ROADMAP.md) as a milestone-4 prerequisite) that compares: (1) a managed API's real quoted cost at an estimated validation-cohort volume (15–20 interview users, then a small closed beta), vs. (2) the engineering time to stand up a minimal self-hosted sandbox (even a single-container-per-submission Docker approach with strict `ulimit`/cgroup constraints) safely. Given MVP scale (tens to low hundreds of concurrent users, not thousands), a managed API is the likely *starting* choice on cost-of-engineering-time grounds, with a self-hosted path kept open for when volume or JVM-warm-start latency makes it worth the investment. This must not be treated as decided until the spike happens.

## 10. Automated test-case evaluation — custom evaluation engine, not AI — Confirmed in principle

- **What it does:** Runs a submission's compiled program against each challenge's visible and hidden test cases (stdin/expected-stdout pairs, or more structured world-state assertions for game-state challenges) and returns pass/fail per case.
- **Why not AI judging:** An LLM comparing output to "intent" is unreliable and unauditable; a deterministic comparison against defined expected output/state is required so "complete" has one unambiguous meaning (see [TESTING.md](TESTING.md)).
- **Design implication:** Each challenge needs test cases expressed as data (expected stdin/stdout, or expected final game-state values) stored server-side only — see [DATABASE.md](DATABASE.md) `test_cases` table and [SECURITY.md](SECURITY.md) "never expose hidden test cases."

## 11. Hosting and deployment — TBD

- **Candidates:** Vercel/Netlify (frontend) + Railway/Render/Fly.io or a cloud provider's managed containers (backend API) + a managed Postgres provider. A provider with good India-region latency matters given the target audience ([PRD.md](PRD.md) N3) — needs explicit checking, not an assumption.
- See [docs/engineering/DEPLOYMENT.md](docs/engineering/DEPLOYMENT.md) for the deployment topology once chosen, and [DECISIONS.md Q5](DECISIONS.md) as the tracked open question.

## 12. Logging and monitoring — TBD, principles confirmed

- Needs: structured application logs, error tracking (e.g., Sentry-class tool), and **execution-service-specific** metrics (submission latency, timeout rate, sandbox failure rate — these are product-health signals, not just ops signals, since a slow/flaky Run button breaks the core loop). See [docs/engineering/OBSERVABILITY.md](docs/engineering/OBSERVABILITY.md).
- Cost monitoring is explicitly required for the AI hint calls and the execution service, both of which are the two usage-scaling cost centers.

## Summary table

| Choice | Status |
|---|---|
| React + TypeScript | Provisional |
| Vite | Provisional |
| Canvas-based 2D rendering (hand-rolled → PixiJS if needed) | Provisional |
| CodeMirror 6 | Confirmed direction |
| Node.js/TypeScript backend | Provisional |
| PostgreSQL | Confirmed |
| Google OAuth + email fallback; provider (in-house vs. managed) | Partially confirmed / TBD |
| AI hints provider | TBD |
| Java execution: managed vs. self-hosted sandbox | TBD — spike required |
| Hosting/deployment provider | TBD |
| Logging/monitoring stack | TBD |
