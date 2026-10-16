import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";

// CodeMirror 6 per design.md §8 (screen-reader support) / TECH.md §4.
// Editor pane uses the --editor-bg token rule from UI_UX.md (kept inline here
// since no design-token system is wired up yet in this prototype).
export function CodeEditor(props: { value: string; onChange: (v: string) => void; readOnly?: boolean }) {
  return (
    <CodeMirror
      value={props.value}
      height="320px"
      theme="dark"
      extensions={[java()]}
      readOnly={props.readOnly}
      onChange={props.onChange}
      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 15 }}
    />
  );
}
