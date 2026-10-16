# Startup Validation Plan — Project Atlas

Goal: validate or falsify the core product bets — game-first design ([DECISIONS.md#d3](DECISIONS.md)), Java-first ([DECISIONS.md#d1](DECISIONS.md)), and curriculum-alignment as a retention/monetization driver — with 15–20 real engineering students, before committing further engineering investment beyond the MVP milestone ([ROADMAP.md](ROADMAP.md) milestone 8).

## Recruitment strategy

- Target: first/second-year B.Tech/BCA/diploma students currently taking or having just completed an introductory Java (or general programming) course.
- Channels: personal/founder network at target colleges, student coding clubs/communities, campus ambassador-style outreach — **specific channels TBD**, to be filled in once recruitment actually starts; don't fabricate a channel list before it's real.
- Aim for a mix of self-reported experience levels (never coded / a little / confident), matching the onboarding question in `design.md` §3.2, so findings aren't skewed to only strong or only weak students.
- Incentive structure (cash, swag, early access): **TBD**.

## Interview questions (semi-structured, ~30–45 min)

**Context/background (5 min):**
1. What course are you taking, and what language does it use first?
2. How do you currently study/practice for that course outside class?
3. Have you used any coding games or platforms before (Codédex, CodeCombat, HackerRank, etc.)? What did you like/dislike?

**Prototype testing tasks (see below) (15–20 min)**

**Reaction/reflection (10 min):**
4. Would you have wanted to keep playing after that session ended? Why or why not?
5. Does this feel like it would actually help with your coursework, or like a separate thing from your coursework?
6. What was confusing, if anything?
7. Would you pay for this? If so, roughly how much, compared to what (a subscription, a one-time course, nothing comparable)?
8. Would you rather play this alone, or does a class/friend-group element matter to you?

## Prototype testing tasks

Using the Milestone 2/3 prototype ([ROADMAP.md](ROADMAP.md)):
- T1: Play level 1 unassisted, no instructions given beyond what the product itself shows. *(Tests: is the UI self-explanatory — the 5-second test from `design.md` §10.)*
- T2: Play level 4 or 6 (a loop level) and deliberately make a mistake if one doesn't happen naturally. *(Tests: is the hint ladder and in-world failure feedback actually helpful — journey J2.)*
- T3: Attempt level 10 (boss) if time allows. *(Tests: does difficulty scaling feel fair, not punishing.)*

## Observation criteria

For each task, record (not self-reported — observed): time to first successful run, number of attempts before passing, which hint rung was reached (if any), whether step-mode was used voluntarily, any visible frustration or confusion moments (and what caused them), whether the student says anything unprompted about the syllabus/exam connection.

## Feedback collection

Structured notes per interview, using the questions above as a template, stored consistently (format/tool **TBD** — e.g., a shared spreadsheet or doc; do not scatter notes across unlinked files). Record direct quotes where useful — they're more persuasive and less distortable than paraphrased summaries later.

## Learning effectiveness

Where feasible, a lightweight before/after check: ask the student to explain, in their own words, what a `for` loop does, before playing level 4, and again immediately after. This is a rough signal, not a rigorous pre/post study — treat it as directional only.

## Engagement and return behavior

Hardest signal to get from a single 30–45 minute interview. Where possible, follow up 2–3 days later (a message, not a push notification — consistent with the no-manipulative-retention principle) to ask whether they thought about the game or wanted to come back, without prompting them beforehand that this follow-up was coming.

## Willingness-to-pay experiments

Question 7 above is a stated-preference signal only — weak evidence on its own. If the budget and timeline allow, a stronger signal would be a real low-commitment ask (e.g., "join a waitlist with a stated future price" or a small refundable deposit) — **not yet planned, flag as a possible follow-up experiment**, don't claim it's part of this plan until it's actually set up.

## Distinguishing hypotheses from verified findings

Every claim that comes out of this process must be tagged, when written up: **(Hypothesis)** — stated by the team, untested; **(Interview signal)** — what interviewees said or did, with sample size noted (e.g., "6 of 15"); **(Verified)** — reserved for things confirmed by actual behavioral data at a scale beyond a handful of interviews (unlikely to apply to anything from this specific 15–20-person round — be honest that this round produces interview signals, not verified findings).

Do not let interview signals from a small, convenience-sampled group get reported elsewhere (e.g., [PRD.md](PRD.md) §12 metrics) as if they were validated targets — they're inputs to setting targets, not the targets themselves.

## Decision criteria for continuing or changing direction

| Signal | Interpretation |
|---|---|
| Majority of students complete task T1 with no external help and say they'd keep playing | Core loop validated enough to proceed to milestone 3/4 as planned |
| Repeated, specific confusion about Java's verbosity (vs. what students have seen in other languages) undermining engagement | Revisit [DECISIONS.md#d1](DECISIONS.md) — does this need a design mitigation (e.g., more aggressive boilerplate-hiding in level 1) rather than a language change, or is it serious enough to re-open the decision itself |
| Students consistently say it doesn't connect to coursework | Serious risk to the central differentiation thesis ([DECISIONS.md#d3](DECISIONS.md)/[D2](DECISIONS.md)) — do not proceed to milestone 4's security investment without addressing this first |
| Strong, consistent willingness-to-pay signal tied to exam-revision use (journey J4) | Prioritize [docs/product/MVP_SCOPE.md](docs/product/MVP_SCOPE.md) features that support syllabus-filtered replay/revision sooner rather than later |

This table itself is a hypothesis about what the signals would mean — revise it once real interviews start producing data that doesn't fit cleanly into it.
