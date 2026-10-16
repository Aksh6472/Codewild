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
export function QuestScreen(props: { levelId: string; onBackToMap: () => void; onNextLevel: (levelId: string) => void }) {
  const [level, setLevel] = useState<Level | null>(null);
  const [code, setCode] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResultResponse | null>(null);
  const [reward, setReward] = useState<RewardResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLevel(null);
    setResult(null);
    setReward(null);
    setSubmissionId(null);
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
      setSubmissionId(id);
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

  if (error) return <p role="alert">{error}</p>;
  if (!level) return <p>Loading level...</p>;

  const worldState: WorldState = running
    ? "running"
    : result?.status === "passed"
      ? "passed"
      : result && result.status !== "pending"
        ? "failed"
        : "idle";

  return (
    <div>
      <button onClick={props.onBackToMap}>◄ Map</button>
      <h1>{level.title}</h1>
      <p>{level.story}</p>
      <div style={{ display: "flex", gap: 16 }}>
        <div>
          <WorldView concept={level.concept} state={worldState} stdout={result?.visibleStdout ?? ""} />
          <GoalChecklist items={level.goalChecklist} results={result?.visibleResults ?? []} />
        </div>
        <div style={{ flex: 1 }}>
          <p>{level.instructions}</p>
          <CodeEditor value={code} onChange={setCode} readOnly={running} />
          <button onClick={handleRun} disabled={running}>
            {running ? "Running..." : "Run ▶"}
          </button>
          <Console rung0Message={result?.rung0Message ?? null} hiddenTwist={result?.hiddenTwist ?? null} />
          {reward && (
            <RewardRecap
              reward={reward}
              onNext={() => props.onNextLevel(level.id)}
              onBackToMap={props.onBackToMap}
            />
          )}
        </div>
      </div>
    </div>
  );
}
