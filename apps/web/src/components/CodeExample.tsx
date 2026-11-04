import { useState, type CSSProperties } from "react";
import type { PlaygroundRunResponse } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { CodeEditor } from "./CodeEditor.js";

// A lesson example: the code with a plain-English note on each line that
// needs one, plus a "Try it" mode that opens it in an editor and runs it in
// the sandbox — learners are encouraged to change it and see what happens.
export function CodeExample(props: { title?: string; lines: [string, string][]; stdin?: string; runnable?: boolean }) {
  const original = props.lines.map(([code]) => code).join("\n");
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState(original);
  const [stdin, setStdin] = useState(props.stdin ?? "");
  const [result, setResult] = useState<PlaygroundRunResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      setResult(await api.runCode(code, stdin));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <figure className="example card">
      <figcaption className="example-head">
        <span>{props.title ?? "Example"}</span>
        {props.runnable && (
          <span className="example-actions">
            <button className="btn-ghost btn-small" onClick={() => setEditing((e) => !e)} aria-pressed={editing}>
              {editing ? "Show line notes" : "Try it ✎"}
            </button>
            <button className="btn-primary btn-small" onClick={run} disabled={running}>
              {running ? "Running…" : "Run ▶"}
            </button>
          </span>
        )}
      </figcaption>

      {editing ? (
        <div className="editor-card example-editor">
          <CodeEditor value={code} onChange={setCode} height="auto" label={`${props.title ?? "Example"} code`} />
          {code !== original && (
            <button className="link-button" onClick={() => setCode(original)}>
              Reset to the original
            </button>
          )}
        </div>
      ) : (
        <ol
          className="annotated"
          aria-label="Code, with what each line does"
          style={{ "--code-width": `${Math.max(...props.lines.map(([l]) => l.length)) + 2}ch` } as CSSProperties}
        >
          {props.lines.map(([line, note], i) => (
            <li key={i}>
              <code className="annotated-code">{line || " "}</code>
              {note && <span className="annotated-note">{note}</span>}
            </li>
          ))}
        </ol>
      )}

      {props.runnable && (props.stdin !== undefined || editing) && (
        <label className="stdin-field">
          <span>Input (stdin)</span>
          <input value={stdin} onChange={(e) => setStdin(e.target.value)} placeholder="Typed into the program when it reads input" />
        </label>
      )}

      {(result || error) && (
        <div className="example-output" aria-live="polite">
          {error && <p className="danger-text">{error}</p>}
          {result && (
            <>
              <div className="section-label">Output</div>
              <pre className="stdout">{result.stdout || "(nothing printed)"}</pre>
              {result.message && <p className="console-msg">⚠ {result.message}</p>}
              {result.stderr && <pre className="stderr">{result.stderr}</pre>}
            </>
          )}
        </div>
      )}
    </figure>
  );
}
