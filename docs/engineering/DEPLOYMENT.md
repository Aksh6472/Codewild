# Deployment — Project Atlas

Deployment architecture is **proposed and largely TBD** — see [TECH.md](../../TECH.md) §11 and [DECISIONS.md Q5](../../DECISIONS.md) (hosting provider is an open question). This document records the shape, to be made concrete once that question resolves.

## Proposed topology

- **Frontend:** static/CDN-deployed SPA build (candidates: Vercel, Netlify, Cloudflare Pages — unselected).
- **Backend API:** containerized service with autoscaling (candidates: Railway, Render, Fly.io, or a cloud provider's managed container service — unselected).
- **Code Execution Service:** a separately scaled worker pool/queue, isolated from the Backend API's scaling profile, since submission volume is spiky in a way API traffic generally isn't ([ARCHITECTURE.md](../../ARCHITECTURE.md) §11). Concrete shape depends on the managed-vs-self-hosted decision in [TECH.md](../../TECH.md) §9.
- **Database:** managed PostgreSQL (candidates: RDS, Supabase, Neon, Railway Postgres — unselected).

## India-latency requirement

Given the target audience ([PRD.md](../../PRD.md) persona, [docs/product/USER_PERSONAS.md](../product/USER_PERSONAS.md)), hosting region choice should be explicitly checked for latency to India, not assumed acceptable by default (most "default" regions for the candidate providers above are US/EU). This must be verified during the hosting decision, not left implicit.

## Environments

Anticipated: `development` (local), `staging`/`preview` (per-PR or a shared pre-production environment — TBD which), `production`. Exact CI/CD pipeline and environment promotion flow **not yet designed** — to be defined once a hosting provider is chosen, alongside [CONTRIBUTING.md](../../CONTRIBUTING.md)'s PR conventions.

## Deployment safety

Once real users exist, deploys touching the Code Execution Service or auth must be treated with the same caution as the mandatory security baseline in [SECURITY.md](../../SECURITY.md) — a deploy that weakens sandbox isolation (even accidentally, e.g. via a changed resource-limit config) is a severe-risk change, not a routine one. Rollback procedure **TBD**, to be defined before milestone 4 in [ROADMAP.md](../../ROADMAP.md) (secure Java execution integration) ships to any real user.

## What's needed before this document can be completed

The hosting-provider decision ([DECISIONS.md Q5](../../DECISIONS.md)) and the managed-vs-self-hosted execution decision ([TECH.md](../../TECH.md) §9) both need to resolve first — this file should be rewritten with concrete provider names, pipeline steps, and rollback procedures at that point, not before.
