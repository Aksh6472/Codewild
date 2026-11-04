// `java` tag for multi-line Java source in content files: keeps backslashes
// literally (so "\n" inside Java strings stays Java's escape) and strips the
// indentation the TypeScript file adds. Always ends with one newline.
export function java(strings: TemplateStringsArray): string {
  const raw = strings.raw.join("");
  const lines = raw.replace(/^\n/, "").replace(/\n[ \t]*$/, "").split("\n");
  const indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length)
  );
  return lines.map((l) => l.slice(indent)).join("\n") + "\n";
}
