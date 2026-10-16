# Development Setup — Project Atlas

**No application code exists yet** ([README.md](../../README.md) status) — this document is a placeholder structure to be filled in once the [TECH.md](../../TECH.md) stack choices (frontend framework, backend framework, package manager) move from Provisional to Confirmed. Do not invent setup steps for tooling that hasn't been chosen.

## Prerequisites (anticipated, pending TECH.md confirmation)

- Node.js (LTS version — exact version to be pinned via `.nvmrc` once the project scaffolds)
- A local PostgreSQL instance, or Docker to run one (see [TECH.md](../../TECH.md) §6)
- A Java JDK, **only** if local development needs to run the execution path outside its sandbox for testing purposes — the specific setup here depends on the managed-vs-self-hosted decision in [TECH.md](../../TECH.md) §9 and should not be written up until that's resolved, to avoid documenting a workflow that doesn't match the real execution architecture.

## Environment configuration

Copy [.env.example](../../.env.example) to `.env` in the project root and fill in local values. Never commit `.env`. See [SECURITY.md](../../SECURITY.md) for secrets handling rules.

## Repository structure (anticipated)

A monorepo layout is the likely shape once implementation starts (frontend app, backend API, execution-service client/config, shared types) — exact structure **TBD**, to be decided alongside the [TECH.md](../../TECH.md) framework choices, not before.

## Reproducible setup steps

**Not yet written — this section is intentionally incomplete.** Once the stack is scaffolded, this file must be updated with concrete, tested commands (clone → install → configure env → migrate database → run dev server) per [CONTRIBUTING.md](../../CONTRIBUTING.md)'s documentation-update rule. A placeholder like "run `npm install`" without a real `package.json` to back it would be a false claim — avoided here deliberately.

## What blocks this document from being completed

[TECH.md](../../TECH.md)'s Provisional choices (frontend framework, backend framework) need to be Confirmed, and an initial project scaffold needs to exist, per [ROADMAP.md](../../ROADMAP.md) milestone 3.
