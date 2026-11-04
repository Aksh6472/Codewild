import { useState } from "react";
import type { ChallengeView, SubmissionResultResponse } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { CodeEditor } from "./CodeEditor.js";
import { Console } from "./Console.js";
import { GoalChecklist } from "./GoalChecklist.js";
import { HintLadder } from "./HintLadder.js";

// Editor + Run + graded result + Mentor hints for one coding challenge. Shared
// by trials and the coding stage of mock interviews. Grading is the server's
// test runner (TESTING.md) — this component never decides pass/fail itself.
export function TrialWorkbench(props: {
  challenge: ChallengeView;
  onChallengeChange: (patch: Partial<ChallengeView>) => void;
  onResult: (result: SubmissionResultResponse, submissionId: string) => void;
  onRunningChange?: (running: boolean) => void;
}) {
  const c = props.challenge;
  const [code, setCode] = useState(c.lastCode ?? c.starterCode);
  const [result, setResult] = useState<SubmissionResultResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setRunningBoth(value: boolean) {
    setRunning(value);
    props.onRunningChange?.(value);
  }

  async function handleRun() {
    setRunningBoth(true);
    setResult(null);
    setError(null);
    try {
      const { submissionId } = await api.submit(c.id, code);
      for (let attempt = 0; attempt < 90; attempt++) {
        const res = await api.getSubmission(submissionId);
        if (res.status !== "pending") {
          setResult(res);
          props.onResult(res, submissionId);
          return;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      setError("Still running after 45s — the execution service may be unavailable. Try again.");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setRunningBoth(false);
    }
  }

  const fileName = `${/public\s+class\s+(\w+)/.exec(code)?.[1] ?? "Main"}.java`;

  return (
    <div className="workbench">
      <section className="card panel" aria-label="Goal and hints">
        {c.steps.length > 0 && (
          <div>
            <div className="section-label">Steps</div>
            <ol className="steps">
              {c.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        )}
        <div>
          <div className="section-label">Requirements</div>
          <GoalChecklist items={c.goalChecklist} results={result?.visibleResults ?? []} />
          <p className="muted small">Hidden tests also try other inputs, so compute the answer — don't hardcode it.</p>
        </div>
        <HintLadder challenge={c} onChanged={props.onChallengeChange} />
      </section>

      <section className="card editor-card" aria-label="Code editor">
        <div className="editor-tabs">
          <span className="file-tab">{fileName}</span>
          <span className="editor-tab-actions">
            {code !== c.starterCode && (
              <button className="link-button" onClick={() => setCode(c.starterCode)} disabled={running}>
                Reset
              </button>
            )}
            <button className="btn-primary btn-run" onClick={handleRun} disabled={running}>
              {running ? "Running…" : "Run ▶"}
            </button>
          </span>
        </div>
        <CodeEditor value={code} onChange={setCode} readOnly={running} height="380px" />
        {(result || error) && (
          <div className="output" aria-live="polite">
            {error && <p className="danger-text">{error}</p>}
            {result &&
              (result.status === "passed" ? (
                <div className="verdict pass">
                  <span aria-hidden="true">✓</span> All tests passed!
                </div>
              ) : (
                <div className="verdict fail">
                  <span aria-hidden="true">✗</span> Not quite yet
                </div>
              ))}
            {result?.visibleStdout && <pre className="stdout">{result.visibleStdout}</pre>}
            {result && (
              <Console rung0Message={result.rung0Message} hiddenTwist={result.hiddenTwist} />
            )}
            {result?.targetedFeedback && (
              <p className="mentor-note">
                <span aria-hidden="true">🧭</span> <strong>Mentor:</strong> {result.targetedFeedback}
              </p>
            )}
            {result?.visibleStderr && (
              <details>
                <summary>Raw error output</summary>
                <pre className="stderr">{result.visibleStderr}</pre>
              </details>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
