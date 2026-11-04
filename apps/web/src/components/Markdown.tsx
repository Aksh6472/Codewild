import type { ReactNode } from "react";

// The small Markdown subset lesson content uses: paragraphs (blank line),
// "- " bullet lists, `inline code` and **bold**. Builds React elements
// directly — never innerHTML — so content can't inject markup.
export function Markdown(props: { text: string; inline?: boolean }) {
  if (props.inline) return <>{inline(props.text)}</>;

  const blocks = props.text.split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const bullets = lines.filter((l) => l.startsWith("- "));
        if (bullets.length > 0) {
          const intro = lines.filter((l) => !l.startsWith("- "));
          return (
            <div key={i} className="md-block">
              {intro.length > 0 && <p>{inline(intro.join(" "))}</p>}
              <ul>
                {bullets.map((b, j) => (
                  <li key={j}>{inline(b.slice(2))}</li>
                ))}
              </ul>
            </div>
          );
        }
        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </>
  );
}

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part;
  });
}
