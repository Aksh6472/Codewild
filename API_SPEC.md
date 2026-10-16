# API Specification — Project Atlas

Proposed contract, not implemented. Base path `/api/v1`. All responses JSON. Auth via session cookie or bearer token (mechanism TBD, [TECH.md](TECH.md) §7) except guest-accessible endpoints explicitly marked below. Rate limits are per-user (or per-IP for guests) — see [SECURITY.md](SECURITY.md) for limit values once set.

## Conventions

- Errors: `{ "error": { "code": "string", "message": "human-readable" } }` with an appropriate HTTP status (400 validation, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 429 rate-limited, 500 unexpected).
- Never include hidden test cases, expected outputs, or answer keys in any response body, including error messages (see [SECURITY.md](SECURITY.md)).
- All list endpoints are paginated (`?cursor=`, `?limit=`) — no unbounded lists.

## Authentication

### `POST /auth/google` — exchange a Google OAuth credential for a session. No prior auth required.
- **Request:** `{ "idToken": "string" }`
- **Response:** `{ "user": { "id", "displayName", "isNewUser" } }` + sets session.

### `POST /auth/signup` (email/password fallback, per [TECH.md](TECH.md) §7)
- **Request:** `{ "email", "password", "displayName" }`
- **Validation:** email format, password minimum strength (policy TBD). Rejects if email already registered.

### `POST /auth/login`
- **Request:** `{ "email", "password" }`. Rate-limited aggressively (brute-force protection, [SECURITY.md](SECURITY.md)).

### `POST /auth/logout`

## Learning path / curriculum retrieval

### `GET /learning-paths` — public, no auth required.
- **Response:** `[{ "id", "code", "name", "languageCode", "sequenceOrder" }]`

### `GET /learning-paths/:id/worlds` — public.
- **Response:** `[{ "id", "name", "sequenceOrder", "levels": [{ "id", "title", "sequenceOrder", "syllabusTag", "isBoss" }] }]` — level list includes locked levels' titles (so the map can render them greyed out) but never their challenge content.

### `GET /levels/:id` — **guest-accessible only for the single designated guest level (level 1); auth required otherwise.**
- **Response:** `{ "id", "title", "story", "instructions", "starterCode", "goalChecklist": [ "plain-language visible test descriptions, not raw assertions" ] }`
- Never includes `test_cases` rows marked hidden, or their expected outputs.

## Code submission

### `POST /submissions` — auth required (or guest session for the guest level).
- **Request:** `{ "challengeId": "uuid", "code": "string" }`
- **Behavior:** Enqueues the code to the Code Execution Service (see [ARCHITECTURE.md](ARCHITECTURE.md) §3); this endpoint returns immediately with a submission id, not the result (execution is not guaranteed instant).
- **Response:** `{ "submissionId": "uuid", "status": "pending" }`
- **Rate limit:** per-user submission rate cap to prevent abuse of the execution service (value TBD, [SECURITY.md](SECURITY.md)).

### `GET /submissions/:id` — poll for result (or use a push mechanism — WebSocket/SSE — TBD; polling is the simpler MVP default).
- **Response (pending):** `{ "status": "pending" }`
- **Response (resolved):** `{ "status": "passed" | "failed" | "error" | "timeout", "visibleResults": [{ "description", "passed" }], "hiddenTwist": { "triggered": true, "narrativeMessage": "..." } | null, "rung0Message": "string | null" }`
- Hidden test results are translated into the in-world "twist" narrative, never returned as a raw list of hidden assertions (per `design.md` §2, §7).

### `GET /submissions?challengeId=` — a user's own submission history for a challenge (for "attempt number" / profile stats). Always scoped to the authenticated user; `userId` is never accepted as a query parameter (see [SECURITY.md](SECURITY.md) IDOR prevention).

## Progress and rewards

### `GET /progress` — auth required.
- **Response:** `{ "levels": [{ "levelId", "state" }], "conceptMastery": [{ "concept", "status" }], "xp", "coins", "playerLevel" }`

### `GET /progress/reward/:submissionId` — the recap payload after a pass.
- **Response:** `{ "xpGained", "coinsGained", "leveledUp", "newlyUnlockedLevelIds": [...], "whatYouLearned": { "sentence", "keyCodeLine" } }`

## AI hints

### `POST /hints` — auth required.
- **Request:** `{ "submissionId": "uuid", "rung": 1 }`
- **Behavior:** Validates rung eligibility server-side (rung 1+ only after a failed run exists for this submission chain; rung 4 only after 3+ attempts per `design.md` §3.5) and enforces a per-user daily hint-call cap before calling the AI Hint Service ([ARCHITECTURE.md](ARCHITECTURE.md) §4).
- **Response:** `{ "rung", "text" }`
- **Errors:** `429` if the daily cap is hit, with a clear message (not a silent failure).
- Rung 0 is **not** requested through this endpoint — it's included directly in the `GET /submissions/:id` response, since it's deterministic and free.

## How code submissions reach the execution environment

`POST /submissions` never calls the Code Execution Service directly from the browser. The Backend API is the only caller, over an internal network path (service-to-service auth TBD — shared secret or mTLS, see [SECURITY.md](SECURITY.md)), per [ARCHITECTURE.md](ARCHITECTURE.md) §1 and [DECISIONS.md#d8](DECISIONS.md). The execution result returns to the API, which persists it (`submission_results`) and only then serves the processed, narrative-safe view to the client via `GET /submissions/:id`.

## Secrets and hidden data — explicit rule

No endpoint, under any status code or error path, returns: hidden test case `input_data`/`expected_output`, other users' submissions or progress, password hashes, OAuth tokens, or AI provider API keys/prompts verbatim. This is enforced by never selecting those columns in any public-endpoint query path, not by filtering them out after the fact.

## Not yet specified (flag before implementing)

Exact auth token mechanism (cookie session vs. JWT), rate-limit numeric values, pagination cursor format, whether submission results are polled or pushed (WebSocket/SSE) — all **TBD**, see [TECH.md](TECH.md) and [SECURITY.md](SECURITY.md).
