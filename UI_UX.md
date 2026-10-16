# UI/UX — Project Atlas

[design.md](design.md) is the primary visual/UX design document (screens, colour tokens, typography, motion, event table, accessibility checklist). This file indexes it, restates the governing principles for implementation, and adds the pieces the founder brief asks for that `design.md` doesn't fully cover (component conventions, state handling, responsive rules at the implementation level).

## Design direction

"Polished indie RPG combined with a developer tool" — see `design.md` §6.1 ("warm workshop," flat/illustrated, not pixel art, to avoid reading as a Codédex clone). Do not introduce a finalized logo or brand mark before [DECISIONS.md#d5](DECISIONS.md) (naming) resolves.

## Design principles

1. Readable first, pretty second — code, output, and hint text beat art for contrast/size/space (`design.md` principle 3).
2. The world and the editor are always visible together on desktop, never stacked (`design.md` §3.4).
3. Color is never the sole signal for pass/fail or state — always paired with an icon and text label (`design.md` §6.2).
4. No idle animation near the editor while the player is typing (`design.md` §6.4).

## Typography

Code: **JetBrains Mono**, 15–16px default, user-adjustable (`design.md` §6.3). UI/body: **Inter or Nunito** — not yet finalized, see [DECISIONS.md Q8](DECISIONS.md); until decided, build components with the font as a swappable CSS variable, not hardcoded. Display/titles: one characterful face (e.g., Baloo 2 or Fredoka), used sparingly.

## Color system

Full dark/light token table in `design.md` §6.2 (`--bg`, `--surface`, `--editor-bg`, `--text`, `--text-muted`, `--brand`, `--accent`, `--success`, `--danger`, `--xp`). All pairs must hit WCAG AA (4.5:1) — verify numerically once tokens are implemented as CSS custom properties, don't eyeball it. Dark is the default theme; light is available (`design.md` §6.2).

## Spacing and layout

Not yet specified numerically in `design.md`. **TBD:** adopt a standard 4px/8px base spacing scale as the default (boring, well-understood choice) unless the eventual visual design system specifies otherwise. The quest screen's two-pane (world | editor) layout is specified at ≥1280px in `design.md` §3.4; below that, screens collapse to World/Code/Goal tabs with Run auto-switching to the World tab.

## Component conventions

Not yet built — no component library exists. When implementation starts: keep the editor, world-view canvas, and HUD as three structurally separate components communicating only through explicit props/state (not DOM coupling), so the "readable first" and "no idle animation near the editor" rules (above) are enforceable by construction rather than by convention alone.

## Responsive behavior

Desktop (≥1280px): side-by-side world/editor (`design.md` §3.4). Narrower/mobile: tabbed World | Code | Goal, with Run switching to World automatically. Per `design.md` principle 8, phones are for map/profile/review; writing code is designed for laptops first — don't invest in a fully-optimized mobile code-entry experience for MVP.

## Animation principles

See `design.md` §6.4 in full. Key numbers: ~250ms/step at 1×, 2×/step-through modes, reward animations ≤2s and skippable, `prefers-reduced-motion` replaces movement with fades.

## Accessibility

Full checklist in `design.md` §8 (keyboard operability, screen-reader-compatible editor via CodeMirror 6, AA contrast, reduced motion, adjustable font size, no text in images). This is a shared source with [PRD.md](PRD.md) §13 — update both if it changes, or better, treat `design.md` §8 as canonical and have PRD.md's accessibility section only summarize+link (already structured that way).

## Loading, empty, and error states

Not yet designed in `design.md`. Minimum required for MVP, to be fleshed out before implementation:
- **Loading:** world map and quest screen need a loading state that doesn't block perceived responsiveness (e.g., skeleton map, not a blank screen) — matters on the "college Wi-Fi" constraint (`design.md` principle 8).
- **Empty:** a brand-new guest account's profile/map before any progress exists — should read as an invitation ("your journey starts here"), not a broken dashboard.
- **Error:** Execution Service unavailable/timeout (see [ARCHITECTURE.md](ARCHITECTURE.md) §8) needs a distinct, honest state from "your code failed" — never conflate a platform error with a wrong answer.

## Dark and light themes

Dark is default; light available (`design.md` §6.2). Theme switching mechanism (user setting vs. OS preference detection) — **TBD**, not yet specified.

## Screen-by-screen index (all detail lives in design.md)

| Screen | Spec location |
|---|---|
| Landing / first run | `design.md` §3.1 |
| Onboarding | `design.md` §3.2 |
| World map | `design.md` §3.3 |
| Quest screen (world + editor + goal + console) | `design.md` §3.4 |
| Mentor panel (hint ladder) | `design.md` §3.5 |
| Reward / recap | `design.md` §3.6 |
| Profile / progress | `design.md` §3.7 |

## The code editor must remain readable and usable while feeling integrated

Concretely: the editor pane uses `--editor-bg` (not the general `--surface` token) to read as a distinct, serious workspace; JetBrains Mono only in the editor and console, never the UI font bleeding in; step-mode line highlighting is the one piece of "game feel" allowed inside the editor pane, because it's directly teaching-functional (`design.md` §3.4), not decorative.

## What to avoid

Generic dashboard templates, excessive glassmorphism, pixel-art (reads as a Codédex clone — see [docs/research/COMPETITIVE_ANALYSIS.md](docs/research/COMPETITIVE_ANALYSIS.md)), any animation competing with the editor for attention while typing.
