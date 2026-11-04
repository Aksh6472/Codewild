import { useMemo } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";

// CodeMirror 6 per design.md §8 (screen-reader support) / TECH.md §4.
// Editor pane background comes from the --editor-bg token (styles.css,
// .editor-card overrides) per UI_UX.md.
export function CodeEditor(props: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  height?: string;
  label?: string;
}) {
  const extensions = useMemo(
    () => [java(), EditorView.contentAttributes.of({ "aria-label": props.label ?? "Java code editor" })],
    [props.label]
  );
  return (
    <CodeMirror
      value={props.value}
      height={props.height ?? "320px"}
      theme="dark"
      extensions={extensions}
      readOnly={props.readOnly}
      onChange={props.onChange}
      style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 15 }}
    />
  );
}
