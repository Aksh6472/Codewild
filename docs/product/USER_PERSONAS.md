# User Personas — Project Atlas

These are initial, hypothesis-driven personas based on the target audience defined in [PRD.md](../../PRD.md) §3 — **not yet validated against real interviews**. Update this file once [VALIDATION.md](../../VALIDATION.md) produces interview signals; mark which traits below get confirmed, revised, or dropped.

## Primary persona: "Anita," first-year B.Tech student

- **Context:** First semester, taking an introductory programming course in Java (per her college's syllabus). Owns a mid-range laptop and a phone; uses college Wi-Fi and mobile data.
- **Goals:** Pass the course, understand concepts well enough that later courses (DSA, OOP-heavy subjects) aren't a struggle, ideally enjoy the process rather than just endure it.
- **Pain points:** Lecture-and-textbook format doesn't hold her attention; compiler errors ("expected ';'") are opaque; she's tried a YouTube tutorial or two but stopped partway through.
- **Relevant journeys:** J1 (first-timer), J4 (exam-week revision) in `design.md` §5.
- **What would make this product win her over:** Seeing visible proof her code "did something," low-friction entry (no signup wall for level 1), and a credible connection to what's actually on her exam.

## Secondary persona: "Rohan," returning hobbyist-leaning student

- **Context:** Has poked at a tutorial or two before (maybe a little Python, maybe a CodeCombat trial years ago), self-identifies as "a little" experienced at onboarding.
- **Goals:** Wants to actually become competent, not just pass exams — thinking ahead to placements/internships where DSA matters.
- **Pain points:** Existing coding games feel like they're "for kids" or disconnected from real skill-building; existing serious platforms (LeetCode-style) feel intimidating or joyless.
- **Relevant journeys:** J2 (stuck player — he's more willing to push through a hard level than Anita), J3 (returning student, day 3).
- **What would make this product win him over:** A hint ladder that respects his time (doesn't hand-hold immediately), visible path toward DSA content, no sense that the game is "too easy" once he's past Fundamentals.

## Tertiary / future persona: "Priya," a faculty member (not MVP scope)

- **Context:** Teaches the introductory programming course Anita is taking. Not a current product user — relevant only to [ROADMAP.md](../../ROADMAP.md) milestone 13 (potential university edition) and [PRD.md](../../PRD.md) F19 (class dashboard), both explicitly out of MVP scope.
- **Included here** only so future design work has a named reference point — do not design MVP features around her needs.

## Open questions about these personas

- Do real interviewees cluster around "Anita" and "Rohan," or is there a third pattern not anticipated here (e.g., a student who's already strong and is only interested in the DSA world)? — **to be answered by [VALIDATION.md](../../VALIDATION.md)**, not assumed.
- Device/connectivity assumptions (laptop ownership, Wi-Fi reliability) are stated in `design.md` principle 8 as a design constraint but not yet confirmed as representative — ask about this directly in interviews.
