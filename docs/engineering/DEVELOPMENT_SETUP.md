# Development Setup — Project Atlas

Covers the local prototype built for [ROADMAP.md](../../ROADMAP.md) Milestone 3 (levels 1–3, no auth yet — see [DECISIONS.md D10](../../DECISIONS.md)). This is a dev-only setup; the Java execution path here is explicitly **not** the hardened sandbox required before real users touch the product — see [SECURITY.md](../../SECURITY.md).

## Prerequisites

- Node.js 20+ and npm (workspaces are used — no separate package manager needed).
- Docker Desktop (or an equivalent local Docker daemon), running. Used for both Postgres and the Java execution sandbox.

## 1. Install dependencies

```bash
npm install
```

This installs all workspaces (`apps/api`, `apps/web`, `packages/shared-types`) from the root in one pass.

## 2. Environment configuration

Copy [.env.example](../../.env.example) to `.env` in the project root (or export the same variables another way). The defaults match `infra/docker-compose.yml`'s Postgres credentials, so no edits are required for local dev.

## 3. Start Postgres

```bash
docker compose -f infra/docker-compose.yml up -d postgres
```

## 4. Build the Java execution sandbox image

```bash
docker build -t atlas-java-sandbox infra/java-sandbox
```

(Re-run this if `infra/java-sandbox/Dockerfile` changes. The image name must match `SANDBOX_IMAGE` in `.env` — `atlas-java-sandbox` by default.)

## 5. Initialize the database

```bash
npm run db:init --workspace=apps/api
```

Applies `apps/api/src/db/schema.sql` and seeds languages/learning_paths/worlds/levels 1–3 with their starter code and test cases, per [CURRICULUM.md](../../CURRICULUM.md).

## 6. Run the apps

```bash
npm run dev:api   # Fastify API on http://localhost:3000
npm run dev:web   # Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` — you'll land on the World Map with levels 1–3 (Wake-up, Name tag, Power math), play a level, and see pass/fail, the rung-0 plain-English error message on a broken submission, and the reward recap on a pass.

## 7. Run tests

```bash
npm test
```

Runs `apps/api`'s unit tests (reward calculation, stdout evaluation, rung-0 lookup) and the curriculum validation / Docker integration tests (`apps/api/test/curriculum.integration.test.ts`) — the latter requires Docker running and the sandbox image built (steps 3–4); they skip with a clear console warning if either is missing rather than silently reporting false coverage.

## What this setup does not cover yet

Real authentication (Milestone 6 — every row currently uses a hardcoded dev user, see [DECISIONS.md D10](../../DECISIONS.md)), levels 4+ (need the world-interaction API, not yet designed), the hardened production sandbox (Milestone 4), and AI hints (Milestone 7, rungs 1–4). Hosting/deployment setup is a separate, not-yet-written topic — see [DEPLOYMENT.md](DEPLOYMENT.md).
