import { useState } from "react";
import type { ChallengeView } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { Markdown } from "./Markdown.js";

const RUNG_NAME = ["Nudge", "Focus", "Worked example"];

// The Mentor's hint ladder (design.md §3.5): authored hints first, one rung
// at a time, then — only after real attempts — the full solution. The server
// decides availability; this component only asks and shows.
export function HintLadder(props: { challenge: ChallengeView; onChanged: (patch: Partial<ChallengeView>) => void }) {
  const c = props.challenge;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function nextHint() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.requestHint(c.id);
      props.onChanged({ hints: res.hints, nextHint: res.nextHint, solutionAvailable: res.solutionAvailable });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function reveal() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.revealSolution(c.id);
      props.onChanged({ solution: res });
      setConfirming(false);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const guidanceText = {
    guided: "Guided practice — every hint is available whenever you want it.",
    supported: "Supported practice — a new hint unlocks after each attempt.",
    independent: "Independent practice — try first; hints unlock as you make attempts.",
  }[c.guidance];

  return (
    <section className="hint-ladder" aria-label="Mentor hints">
      <div className="section-label">
        <span aria-hidden="true">🧭</span> Mentor
      </div>
      <p className="muted small">{guidanceText}</p>
      {c.hints.length > 0 && (
        <ol className="hints">
          {c.hints.map((h, i) => (
            <li key={i}>
              <span className="hint-rung">{RUNG_NAME[i] ?? `Hint ${i + 1}`}</span>
              <Markdown text={h} />
            </li>
          ))}
        </ol>
      )}
      {c.hints.length < c.hintsTotal && (
        <div className="hint-actions">
          <button className="btn-ghost btn-small" onClick={nextHint} disabled={busy || !c.nextHint.available}>
            Show hint {c.hints.length + 1} of {c.hintsTotal}
          </button>
          {!c.nextHint.available && c.nextHint.reason && <span className="muted small">{c.nextHint.reason}</span>}
        </div>
      )}
      {!c.solution && c.hints.length === c.hintsTotal && (
        <div className="hint-actions">
          {c.solutionAvailable ? (
            confirming ? (
              <>
                <span className="small">
                  Seeing the solution before you pass means this trial won't earn its ★ (and gives half coins). You can
                  still re-solve it later.
                </span>
                <button className="btn-ghost btn-small" onClick={reveal} disabled={busy}>
                  Show me
                </button>
                <button className="link-button" onClick={() => setConfirming(false)}>
                  Keep trying
                </button>
              </>
            ) : (
              <button className="btn-ghost btn-small" onClick={() => setConfirming(true)}>
                Reveal the solution walkthrough
              </button>
            )
          ) : (
            <span className="muted small">The full solution unlocks after a couple more attempts — you've got this.</span>
          )}
        </div>
      )}
      {error && <p className="danger-text">{error}</p>}
      {c.solution && (
        <details className="solution" open={!c.solved}>
          <summary>{c.solved ? "Compare with the reference solution" : "Solution walkthrough"}</summary>
          <pre className="question-code">{c.solution.code}</pre>
          <p>
            <em>Why it works: </em>
            {c.solution.explanation}
          </p>
        </details>
      )}
    </section>
  );
}
