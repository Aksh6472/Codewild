import { useEffect, useState } from "react";
import type { LevelDetail, SubmissionResultResponse, RewardResponse } from "@atlas/shared-types";
import { api } from "../api/client.js";
import { CodeEditor } from "../components/CodeEditor.js";
import { WorldView, type WorldState } from "../components/WorldView.js";
import { GoalChecklist } from "../components/GoalChecklist.js";
import { Console } from "../components/Console.js";
import { RewardRecap } from "../components/RewardRecap.js";

type Level = LevelDetail & { challengeId: string };

// design.md §3.4: world + editor side by side, Run locks the editor and plays
// back the result; §2: visible tests tick live, hidden-test failures surface
// as a "twist", never a raw list.
export function QuestScreen(props: { levelId: string; onBack: () => void; onNextLevel: () => void }) {
  const [level, setLevel] = useState<Level | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<SubmissionResultResponse | null>(null);
  const [reward, setReward] = useState<RewardResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLevel(null);
    setResult(null);
    setReward(null);
    api
      .getLevel(props.levelId)
      .then((lv) => {
        setLevel(lv);
        setCode(lv.starterCode);
      })
      .catch((err) => setError(String(err)));
  }, [props.levelId]);

  async function handleRun() {
    if (!level) return;
    setRunning(true);
    setResult(null);
    setReward(null);
    try {
      const { submissionId: id } = await api.submit(level.challengeId, code);
      await pollUntilResolved(id);
    } catch (err) {
      setError(String(err));
      setRunning(false);
    }
  }

  async function pollUntilResolved(id: string) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const res = await api.getSubmission(id);
      if (res.status !== "pending") {
        setResult(res);
        setRunning(false);
        if (res.status === "passed") {
          const rewardRes = await api.getReward(id);
          setReward(rewardRes);
        }
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    setError("Still running after 30s — the execution service may be unavailable. Try again.");
    setRunning(false);
  }

  if (error)
    return (
      <p className="status" role="alert">
        {error}
      </p>
    );
  if (!level) return <p className="status">Loading level...</p>;

  const worldState: WorldState = running
    ? "running"
    : result?.status === "passed"
      ? "passed"
      : result && result.status !== "pending"
        ? "failed"
        : "idle";

  return (
    <div className="quest">
      <header className="quest-bar card">
        <button className="btn-ghost" onClick={props.onBack}>
          <span aria-hidden="true">◄</span> Quests
        </button>
        <div>
          <h1>{level.title}</h1>
          <small className="muted">Java Fundamentals</small>
        </div>
        <span className="spacer" />
        <span className="pill">
          <span className="star" aria-hidden="true">✦</span> XP +50
        </span>
        <span className="pill">
          <span className="coin" aria-hidden="true" /> Coins +20
        </span>
      </header>

      <div className="quest-grid">
        <section className="card panel" aria-label="Instructions and world">
          <div>
            <h2>Instructions</h2>
            <p className="muted">{level.story}</p>
            <p>{level.instructions}</p>
          </div>
          <div>
            <div className="section-label">Requirements</div>
            <GoalChecklist items={level.goalChecklist} results={result?.visibleResults ?? []} />
          </div>
          <WorldView concept={level.concept} state={worldState} stdout={result?.visibleStdout ?? ""} />
        </section>

        <section className="card editor-card" aria-label="Code editor">
          <div className="editor-tabs">
            <span className="file-tab">{/public\s+class\s+(\w+)/.exec(code)?.[1] ?? "Main"}.java</span>
            <button className="btn-primary btn-run" onClick={handleRun} disabled={running}>
              {running ? "Running..." : "Run ▶"}
            </button>
          </div>
          <CodeEditor value={code} onChange={setCode} readOnly={running} />
          {result && (
            <div className="output" aria-live="polite">
              {result.status === "passed" ? (
                <div className="verdict pass">
                  <span aria-hidden="true">✓</span> Correct!
                </div>
              ) : (
                <div className="verdict fail">
                  <span aria-hidden="true">✗</span> Not quite yet
                </div>
              )}
              {result.visibleStdout && <pre className="stdout">{result.visibleStdout}</pre>}
              <Console rung0Message={result.rung0Message} hiddenTwist={result.hiddenTwist} />
            </div>
          )}
        </section>
      </div>

      {reward && <RewardRecap reward={reward} onNext={props.onNextLevel} onBack={props.onBack} />}
    </div>
  );
}
