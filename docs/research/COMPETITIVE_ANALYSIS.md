# Competitive Analysis — Project Atlas

Facts below are tagged **(Verified)** when sourced from a cited reference, **(Reported, unverified)** when third-party sources disagree or couldn't be checked against the vendor's own site, and **(Hypothesis)** when it's this team's inference, not a sourced claim. Pricing especially should be re-checked against each vendor's own pricing page before being used in any external-facing material — the figures below come from third-party review/listing sites, not the vendors directly, and conflict with each other in places.

## Codédex

- **Format (Reported, unverified):** Browser-based, "fantasy lands" themed by language (Python, HTML/CSS, JavaScript, React, Git/GitHub), XP and badges, in-browser editor, short interactive lessons, project tutorials. Pixel-art visual identity.
- **Pricing (Reported, conflicting across sources):** Free tier covers introductory content; paid "Club" tier reported anywhere from ~$9.99/mo to ~$19/mo depending on source, with one outlier listing ($80/mo) that looks unreliable and should be disregarded. [Source: coddy.tech comparison](https://coddy.tech/vs/codedex), [Source: trustmrr.com](https://trustmrr.com/startup/codedex.md)
- **Features (Reported):** Club tier adds a Discord community, events, and mentor support; an AI coding companion ("Lumi") is part of the product; certificates exist but are tied to the paid tier.
- **Differentiation gap:** Codédex's XP/badges sit on top of fairly conventional lesson content — it is not "code changes a persistent world" in the sense this product means; it's closer to interactive-tutorial-with-game-skin. Its pixel-art identity is also a specific visual lane this product should avoid duplicating ([UI_UX.md](../../UI_UX.md)).

## Boot.dev

- **Format (Reported):** Browser-based backend-focused curriculum (Python, Go, TypeScript, JavaScript, SQL), career-path framing (Backend Developer, DevOps, Data Analyst), roughly a 12-month part-time pace, "gamified structure" with a real data-structures course.
- **Pricing (Reported, conflicting):** Figures range from ~$33–40/mo (annual billing) to $59/mo (monthly), i.e. roughly $348–399/year on annual plans across sources; free tier is limited ("guest mode" after the first few chapters, no quizzes/assignments). 30-day refund policy reported. [Source: scrimba.com Boot.dev alternatives roundup](https://scrimba.com/articles/best-boot-dev-alternatives-2026/), [Source: coddy.tech comparison](https://coddy.tech/vs/boot-dev)
- **Differentiation gap:** Boot.dev targets working-adult/career-changer backend engineers, not first-year undergraduates, and is not curriculum-aligned to any specific college syllabus. Its gamification is reported as a structural overlay (paths, streaks-style structure) on real course content, not a world that code visibly controls.

## CodeCombat

- **Format (Verified-by-product-description, via multiple secondary sources):** A genuine coding game — players write real code (originally JavaScript/Python, among other language options) to control a character through game levels; widely used in K-12 school settings.
- **Pricing (Reported, conflicting and partly dated):** School/classroom pricing is customized/negotiated (contact-sales model) per multiple sources; one listing cites ~$70/student/year (single) or ~$50/student/year (2+ students) for classroom licenses, another cites a ~$29/mo starting figure — these conflict and some press material cited is from 2016, so treat all CodeCombat numbers as **unverified and likely outdated**. Individual premium access reported around $9.99/mo or $99/year, with a limited free tier. [Source: fitgap.com CodeCombat listing](https://us.fitgap.com/products/codecombat), [Source: shyft.ai CodeCombat tool page](https://www.shyft.ai/tools/codecombat)
- **Differentiation gap:** CodeCombat is the closest existing analogue to this product's "code is the controller" mechanic, and is the most important direct competitor to study further (not yet done in depth — flagged as a gap below). Its target market skews K-12/school-licensed rather than college-age/self-directed, and it is not built around a specific college curriculum like AICTE-aligned Java coursework.

## Where this product differentiates (synthesis, not yet validated — see [VALIDATION.md](../../VALIDATION.md))

1. **Curriculum alignment as the retention/monetization lever**, specifically to Indian engineering college syllabi (syllabus tags, exam-week revision mode) — none of the three competitors above are positioned this way.
2. **Debugging-as-gameplay**, not just "correct answer unlocks next level" — the world visibly shows *what went wrong*, not just that something did (`design.md` principle 2). CodeCombat is the closest comparator here and deserves a hands-on trial before this claim is treated as settled.
3. **Honest rewards, no manipulative retention mechanics** (no streak guilt, no loot boxes) — explicitly a reaction against common ed-tech gamification patterns, differentiating from generic "gamified course" products like Codédex/Boot.dev whose gamification is reported as structural (paths/badges) rather than core-mechanic.

## Gaps in this analysis (be honest about what's missing)

- No first-hand product trial of any of the three competitors has been done yet — everything above is sourced from third-party descriptions, not direct use. **Recommended next step:** have someone on the team actually play through Codédex's and CodeCombat's intro content before finalizing competitive claims used externally (e.g., in a pitch deck).
- Other relevant competitors not yet researched: HackerRank/LeetCode-style practice platforms (different category — practice, not learning-from-zero, but still competes for a student's time), Sololearn, W3Schools/freeCodeCamp (free, high-reach, low-production-value alternatives), and any India-specific coding-education startups — **not researched, explicit gap**.
- All pricing figures here are third-party-reported and should be re-verified against each vendor's current official pricing page before being used in [PRD.md](../../PRD.md) monetization work.
