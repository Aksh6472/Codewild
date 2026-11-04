import type { VisibleResult } from "@atlas/shared-types";

// Pass/fail is never shown by color alone (design.md §6.2 / PRD.md N4) — every
// row pairs an icon with a text label.
export function GoalChecklist(props: { items: string[]; results: VisibleResult[] }) {
  const resultFor = (description: string) => props.results.find((r) => r.description === description);

  return (
    <ul className="check-list">
      {props.items.map((description) => {
        const result = resultFor(description);
        const icon = !result ? "○" : result.passed ? "✓" : "✗";
        const color = !result ? "var(--text-muted)" : result.passed ? "var(--success)" : "var(--danger)";
        return (
          <li key={description} style={{ color }}>
            <span aria-hidden="true">{icon}</span> {description}
          </li>
        );
      })}
    </ul>
  );
}
