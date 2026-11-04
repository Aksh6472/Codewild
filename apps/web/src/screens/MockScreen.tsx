import { useState } from "react";
import type { ChallengeView, LevelDetail, MockStage, QuizAttemptResponse } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { Markdown } from "../components/Markdown.js";
import { QuizQuestion } from "../components/QuestionCard.js";
import { TrialWorkbench } from "../components/TrialWorkbench.js";
import { LevelHeader, RewardBanner, StoryStrip } from "../components/LevelChrome.js";
import { Timer, formatClock, useElapsed } from "../components/Timer.js";

type Stage = "brief" | MockStage | "code" | "scorecard";

const STAGES: { id: Stage; label: string; coach: string }[] = [
  { id: "brief", label: "Problem", coach: "Read the problem the way an interviewer says it — out loud, once. Don't code yet." },
  { id: "clarify", label: "Clarify", coach: "Strong candidates ask about inputs, edge cases and output format before anything else." },
  { id: "plan", label: "Plan", coach: "Say the brute force first, then improve it. Name the data structure and the complexity before you type." },
  { id: "code", label: "Code", coach: "Narrate as you write. Small, well-named steps — the tests are the interviewer running your code." },
  { id: "test", label: "Test", coach: "Walk through your code with an example and the edge cases before declaring it done." },
  { id: "complexity", label: "Complexity", coach: "Finish by stating time and space complexity and what drives each." },
  { id: "scorecard", label: "Scorecard", coach: "" },
];

// A mock interview: the discussion stages are graded as one attempt (like a
// quiz) and the coding stage by the test runner. Both must pass to complete.
export function MockScreen(props: {
  level: LevelDetail;
  onBack: () => void;
  onNext: (levelId: string) => void;
  onOpenLevel: (levelId: string) => void;
  onProgress: () => void;
  onReload: () => void;
}) {
  const { level } = props;
  const [stage, setStage] = useState<Stage>("brief");
  const [challenge, setChallenge] = useState<ChallengeView>(level.challenge!);
  const [codePassed, setCodePassed] = useState(level.challenge!.solved);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const elapsed = useElapsed(!result);

  const index = STAGES.findIndex((s) => s.id === stage);
  const current = STAGES[index];
  const stageQuestions = level.questions.filter((q) => q.stage === stage);
  const quiz = level.quiz!;

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      setResult(await api.submitAttempt(level.id, { answers, elapsedSeconds: elapsed }));
      setStage("scorecard");
      props.onProgress();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const resultFor = (id: string) => result?.results.find((r) => r.questionId === id);
  const complete = result?.passed && codePassed;

  return (
    <div className="quest mock">
      <LevelHeader level={level} onBack={props.onBack}>
        {level.timeLimitMinutes && <Timer limitMinutes={level.timeLimitMinutes} elapsedSeconds={elapsed} />}
        <span className="pill">Pass: {quiz.passingScore}% + working code</span>
      </LevelHeader>

      <nav className="stepper card" aria-label="Interview stages">
        <ol>
          {STAGES.map((s, i) => (
            <li key={s.id}>
              <button
                aria-current={s.id === stage ? "step" : undefined}
                className={i < index ? "past" : ""}
                disabled={(s.id === "scorecard" && !result) || (!!result && s.id !== "scorecard" && s.id !== "code")}
                onClick={() => setStage(s.id)}
              >
                <span className="step-num">{i + 1}</span> {s.label}
                {s.id === "code" && codePassed && <span aria-label="tests passing"> ✓</span>}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {current.coach && (
        <p className="mentor-note">
          <span aria-hidden="true">🎙</span> <strong>Interviewer tip:</strong> {current.coach}
        </p>
      )}

      {stage === "brief" && (
        <section className="card panel">
          <StoryStrip text={level.story} />
          <div className="prose">
            <Markdown text={challenge.instructions} />
          </div>
          {quiz.attempts.length > 0 && (
            <p className="muted small">
              Previous attempts: {quiz.attempts.map((a) => `${a.score}%`).join(", ")}
              {quiz.passed ? " — discussion passed." : ""}
            </p>
          )}
          {!quiz.canAttempt && (
            <p className="danger-text">
              Review first: {quiz.reviewRequired.filter((r) => !r.done).map((r) => r.title).join(", ")}.
            </p>
          )}
        </section>
      )}

      {stage === "code" && (
        <>
          <section className="card panel">
            <div className="prose">
              <Markdown text={challenge.instructions} />
            </div>
          </section>
          <TrialWorkbench
            challenge={challenge}
            onChallengeChange={(patch) => setChallenge((c) => ({ ...c, ...patch }))}
            onResult={async (res) => {
              if (res.status === "passed") setCodePassed(true);
              const fresh = await api.getLevel(level.id).catch(() => null);
              if (fresh?.challenge) setChallenge((c) => ({ ...fresh.challenge!, solution: fresh.challenge!.solution ?? c.solution }));
              props.onProgress();
            }}
          />
        </>
      )}

      {stageQuestions.length > 0 && (
        <article className="lesson-body">
          {stageQuestions.map((q) => (
            <QuizQuestion
              key={q.id}
              question={q}
              value={answers[q.id] ?? ""}
              onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
              result={resultFor(q.id)}
              onReview={props.onOpenLevel}
            />
          ))}
        </article>
      )}

      {stage === "scorecard" && result && (
        <article className="lesson-body">
          <section className={`card score-card ${complete ? "passed" : "failed"}`} aria-live="polite">
            <div className="score-ring" aria-hidden="true">
              {result.score}%
            </div>
            <div>
              <h2>{complete ? "✓ Offer-worthy performance!" : "Interview feedback"}</h2>
              <ul className="facts">
                <li>
                  Discussion: {result.correctCount}/{result.totalCount} ({result.score}%) —{" "}
                  {result.passed ? "✓ pass" : `✗ needs ${result.passingScore}%`}
                </li>
                <li>Coding: {codePassed ? "✓ all tests pass" : "✗ tests not passing yet — return to the Code stage"}</li>
                <li>
                  Time: {formatClock(elapsed)}
                  {level.timeLimitMinutes ? ` (target ${level.timeLimitMinutes}:00)` : ""}
                </li>
              </ul>
            </div>
          </section>
          {STAGES.filter((s) => level.questions.some((q) => q.stage === s.id)).map((s) => (
            <section key={s.id} className="card panel">
              <h2>{s.label}</h2>
              {level.questions
                .filter((q) => q.stage === s.id)
                .map((q) => (
                  <QuizQuestion
                    key={q.id}
                    question={q}
                    value={answers[q.id] ?? ""}
                    onChange={() => undefined}
                    result={resultFor(q.id)}
                    onReview={props.onOpenLevel}
                  />
                ))}
            </section>
          ))}
          {complete ? (
            <RewardBanner
              xp={result.xpGained}
              coins={result.coinsGained}
              message="Mock interview complete."
              onBack={props.onBack}
              onNext={level.nextLevelId ? () => props.onNext(level.nextLevelId!) : undefined}
            />
          ) : (
            <div className="row-actions">
              {!codePassed && (
                <button className="btn-primary" onClick={() => setStage("code")}>
                  Back to the coding stage
                </button>
              )}
              {!result.passed && (
                <button className="btn-ghost" onClick={props.onReload}>
                  Start a fresh interview
                </button>
              )}
            </div>
          )}
        </article>
      )}

      {error && <p className="danger-text">{error}</p>}

      {stage !== "scorecard" && (
        <footer className="card lesson-footer">
          <button className="btn-ghost" disabled={index === 0} onClick={() => setStage(STAGES[index - 1].id)}>
            ← Back
          </button>
          {stage === "complexity" ? (
            <button className="btn-primary" onClick={finish} disabled={busy || !quiz.canAttempt || !!result}>
              Finish the interview <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button className="btn-primary" onClick={() => setStage(STAGES[index + 1].id)}>
              Next: {STAGES[index + 1].label} <span aria-hidden="true">→</span>
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
