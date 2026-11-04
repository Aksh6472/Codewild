import { useState } from "react";
import type { ChallengeView, LevelDetail, RewardResponse, SubmissionResultResponse } from "@atlas/shared-types";
import { api } from "../api/client.js";
import { WorldView, type WorldState } from "../components/WorldView.js";
import { Markdown } from "../components/Markdown.js";
import { TrialWorkbench } from "../components/TrialWorkbench.js";
import { LevelHeader, RewardBanner, StoryStrip } from "../components/LevelChrome.js";
import { Timer, useElapsed } from "../components/Timer.js";

// The Foundry's world view reacts to these concepts' output (design.md: the
// world shows what your code did). Later realms show the console instead —
// see DECISIONS.md D11 for that scope note.
const WORLD_CONCEPTS = new Set(["print-output", "variables-strings", "operators"]);

// design.md §3.4: briefing + editor side by side; Run locks the editor and
// plays back the result; visible tests tick live, hidden-test failures
// surface as a "twist", never a raw list.
export function QuestScreen(props: {
  level: LevelDetail;
  onBack: () => void;
  onNext: (levelId: string) => void;
  onProgress: () => void;
}) {
  const { level } = props;
  const [challenge, setChallenge] = useState<ChallengeView>(level.challenge!);
  const [result, setResult] = useState<SubmissionResultResponse | null>(null);
  const [reward, setReward] = useState<RewardResponse | null>(null);
  const [running, setRunning] = useState(false);
  const elapsed = useElapsed(!reward);

  async function handleResult(res: SubmissionResultResponse, submissionId: string) {
    setResult(res);
    // Refresh attempt counts so newly earned hints become available.
    const fresh = await api.getLevel(level.id).catch(() => null);
    if (fresh?.challenge) {
      setChallenge((c) => ({ ...fresh.challenge!, solution: fresh.challenge!.solution ?? c.solution }));
    }
    if (res.status === "passed") {
      setReward(await api.getReward(submissionId));
      props.onProgress();
    }
  }

  const worldState: WorldState = running
    ? "running"
    : result?.status === "passed"
      ? "passed"
      : result && result.status !== "pending"
        ? "failed"
        : "idle";

  return (
    <div className="quest">
      <LevelHeader level={level} onBack={props.onBack}>
        {level.timeLimitMinutes && <Timer limitMinutes={level.timeLimitMinutes} elapsedSeconds={elapsed} />}
        <span className="pill">
          <span className="star" aria-hidden="true">✦</span> XP +50
        </span>
        <span className="pill">
          <span className="coin" aria-hidden="true" /> up to 20
        </span>
      </LevelHeader>

      {reward && (
        <RewardBanner
          xp={reward.xpGained}
          coins={reward.coinsGained}
          message={
            level.timeLimitMinutes
              ? `Trial complete in ${Math.ceil(elapsed / 60)} min (target ${level.timeLimitMinutes}).`
              : "Trial complete!"
          }
          detail={
            reward.leveledUp ? (
              <>
                <br />
                You've reached a new rank!
              </>
            ) : null
          }
          onBack={props.onBack}
          onNext={level.nextLevelId ? () => props.onNext(level.nextLevelId!) : undefined}
        />
      )}

      <section className="card panel briefing-card" aria-label="Instructions">
        <StoryStrip text={level.story} />
        <div className="prose">
          <Markdown text={challenge.instructions} />
        </div>
        {WORLD_CONCEPTS.has(level.concept) && (
          <WorldView concept={level.concept} state={worldState} stdout={result?.visibleStdout ?? ""} />
        )}
      </section>

      <TrialWorkbench
        challenge={challenge}
        onChallengeChange={(patch) => setChallenge((c) => ({ ...c, ...patch }))}
        onResult={handleResult}
        onRunningChange={setRunning}
      />
    </div>
  );
}
