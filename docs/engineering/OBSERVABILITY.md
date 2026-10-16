# Observability — Project Atlas

Tooling is **TBD** (see [TECH.md](../../TECH.md) §12); this document defines what must be observable regardless of which tools are eventually chosen.

## Logs

Structured (not free-text) application logs from the Backend API, covering at minimum: auth events (sign-in/sign-up, excluding credentials — [SECURITY.md](../../SECURITY.md)), submission lifecycle (received, sent to execution service, result received, persisted), hint requests (rung requested, eligibility check result, rate-limit hits). Secure-logging rules from [SECURITY.md](../../SECURITY.md) apply: no raw passwords/tokens, no full student code at default log levels.

## Metrics (RED-style: Rate, Errors, Duration)

- **Backend API:** request rate, error rate, latency per endpoint — standard.
- **Code Execution Service (the component most worth watching closely, per [ARCHITECTURE.md](../../ARCHITECTURE.md) §11):** submission rate, timeout rate, sandbox-failure/error rate, compile-vs-run time breakdown, queue depth/wait time if a queue is used. A rising timeout rate or queue depth is an early warning for the exact scaling risk called out in [ARCHITECTURE.md](../../ARCHITECTURE.md) — treat these as product-health metrics, not just infra metrics, since a slow Run button breaks the core gameplay loop.
- **AI Hint Service:** call rate, latency, error rate, and — critically — **cost per day/week**, since this is one of the two usage-scaling cost centers flagged in [PRD.md](../../PRD.md)'s risk table and [TECH.md](../../TECH.md) §8.

## Error tracking

A dedicated error-tracking tool (e.g., Sentry-class) is recommended over log-grepping alone for frontend and backend exceptions — provider **TBD**. Errors from the Code Execution Service specifically should be classified (per [DATABASE.md](../../DATABASE.md) `submission_results.error_classification`) rather than tracked as undifferentiated exceptions, since the classification itself drives the rung-0 hint table ([GAME_DESIGN.md](../../GAME_DESIGN.md)).

## Cost monitoring

Explicit, dashboarded tracking for the two variable-cost components: AI Hint Service calls (per [TECH.md](../../TECH.md) §8, capped per-user but worth watching in aggregate) and Code Execution Service usage (per-submission cost if a managed vendor is chosen, per [TECH.md](../../TECH.md) §9). Set an alert threshold once a real cost baseline exists from the validation/closed-testing cohorts ([ROADMAP.md](../../ROADMAP.md) milestones 8) — don't guess a threshold before there's real data.

## Healthchecks

Each deployable component (Backend API, Code Execution Service) needs a real healthcheck endpoint that verifies its actual dependencies (e.g., API's healthcheck confirms DB connectivity, not just "process is running"). Exact implementation TBD alongside the hosting decision ([docs/engineering/DEPLOYMENT.md](DEPLOYMENT.md)).

## What's needed before this is fully actionable

Tool selection (logging aggregator, metrics/dashboard tool, error tracker) — all TBD pending the hosting/stack decisions in [TECH.md](../../TECH.md) and [DECISIONS.md](../../DECISIONS.md) Q5.
