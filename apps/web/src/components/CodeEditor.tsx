import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";

// CodeMirror 6 per design.md §8 (screen-reader support) / TECH.md §4.
// Editor pane background comes from the --editor-bg token (styles.css,
// .editor-card overrides) per UI_UX.md.
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
