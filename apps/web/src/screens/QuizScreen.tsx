import { useMemo, useState } from "react";
import type { LevelDetail, PublicQuestion, QuizAttemptResponse, Summary } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { QuizQuestion } from "../components/QuestionCard.js";
import { LevelHeader, RewardBanner, StoryStrip, SummaryCard } from "../components/LevelChrome.js";
import { Timer, formatClock, useElapsed } from "../components/Timer.js";

// Fisher–Yates, so each attempt sees the questions (and choices) in a new
// order — a retry should test understanding, not position memory.
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleQuestions(questions: PublicQuestion[]) {
  return shuffled(questions).map((q) => (q.options ? { ...q, options: shuffled(q.options) } : q));
}

// The realm's guardian: a server-graded final quiz with a clear passing score.
// Failing names the lessons to revisit; the retry opens once they're reviewed.
export function QuizScreen(props: {
  level: LevelDetail;
  realmSummary: Summary | null;
  onBack: () => void;
  onNext: (levelId: string) => void;
  onOpenLevel: (levelId: string) => void;
  onProgress: () => void;
  onReload: () => void;
}) {
  const { level } = props;
  const quiz = level.quiz!;
  const [phase, setPhase] = useState<"intro" | "answering" | "results">("intro");
  const [attemptKey, setAttemptKey] = useState(0);

  if (phase === "answering") {
    return (
      <QuizAttempt
        key={attemptKey}
        level={level}
        onBack={props.onBack}
        onDone={() => {
          setPhase("results");
          props.onProgress();
        }}
        onOpenLevel={props.onOpenLevel}
        onNext={props.onNext}
        onRetry={() => {
          setPhase("intro");
          props.onReload();
        }}
      />
    );
  }

  const last = quiz.attempts.at(-1);
  return (
    <div className="quest quiz">
      <LevelHeader level={level} onBack={props.onBack}>
        <span className="pill">Pass: {quiz.passingScore}%</span>
        {quiz.bestScore !== null && <span className="pill">Best: {quiz.bestScore}%</span>}
      </LevelHeader>
      <article className="lesson-body">
        <StoryStrip text={level.story} />

        <section className="card panel quiz-intro">
          <h2>{quiz.passed ? "You've beaten this guardian" : "Face the guardian"}</h2>
          <ul className="facts">
            <li>
              <strong>{level.questions.length}</strong> questions — concepts and code you must trace by hand
            </li>
            <li>
              Pass with <strong>{quiz.passingScore}%</strong> or more to {level.nextLevelId ? "unlock the next realm" : "finish the path"}
            </li>
            {level.timeLimitMinutes && (
              <li>
                Suggested time: <strong>{level.timeLimitMinutes} min</strong> (a timer runs; it never fails you)
              </li>
            )}
            <li>Missed questions point you to the lesson to review; a retry opens once you've reviewed them.</li>
          </ul>

          {quiz.reviewRequired.length > 0 && (
            <div className="review-required" role="status">
              <div className="section-label">
                Review before your retry ({quiz.reviewRequired.filter((r) => r.done).length}/{quiz.reviewRequired.length} done)
              </div>
              <ul className="check-list">
                {quiz.reviewRequired.map((r) => (
                  <li key={r.levelId} style={{ color: r.done ? "var(--success)" : undefined }}>
                    <span aria-hidden="true">{r.done ? "✓" : "○"}</span>
                    <button className="link-button" onClick={() => props.onOpenLevel(r.levelId)}>
                      {r.title}
                    </button>
                    <span className="muted small">{r.done ? "reviewed" : "not reviewed yet"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="row-actions">
            <button
              className="btn-primary"
              disabled={!quiz.canAttempt}
              onClick={() => {
                setAttemptKey((k) => k + 1);
                setPhase("answering");
              }}
            >
              {quiz.attempts.length === 0 ? "Begin the quiz" : quiz.passed ? "Practice again" : "Retry the quiz"}{" "}
              <span aria-hidden="true">→</span>
            </button>
            {quiz.passed && level.nextLevelId && (
              <button className="btn-ghost" onClick={() => props.onNext(level.nextLevelId!)}>
                Continue to the next realm
              </button>
            )}
          </div>

          {last && (
            <div>
              <div className="section-label">Attempts</div>
              <ol className="attempts">
                {quiz.attempts.map((a, i) => (
                  <li key={a.createdAt}>
                    #{i + 1}: <strong>{a.score}%</strong> {a.passed ? "✓ passed" : "✗ below pass mark"}
                    {a.elapsedSeconds !== null && <span className="muted"> · {formatClock(a.elapsedSeconds)}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {props.realmSummary && <SummaryCard summary={props.realmSummary} title="Realm codex — what this quiz covers" />}
      </article>
    </div>
  );
}

function QuizAttempt(props: {
  level: LevelDetail;
  onBack: () => void;
  onDone: () => void;
  onOpenLevel: (levelId: string) => void;
  onNext: (levelId: string) => void;
  onRetry: () => void;
}) {
  const { level } = props;
  const questions = useMemo(() => shuffleQuestions(level.questions), [level.questions]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const elapsed = useElapsed(!result);
  const unanswered = questions.filter((q) => !answers[q.id]?.trim()).length;

  async function submit() {
    if (unanswered > 0 && !window.confirm(`${unanswered} question(s) are unanswered and will count as wrong. Submit anyway?`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setResult(await api.submitAttempt(level.id, { answers, elapsedSeconds: elapsed }));
      props.onDone();
      window.scrollTo(0, 0);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const resultFor = (id: string) => result?.results.find((r) => r.questionId === id);

  return (
    <div className="quest quiz">
      <LevelHeader level={level} onBack={props.onBack}>
        {level.timeLimitMinutes && !result && <Timer limitMinutes={level.timeLimitMinutes} elapsedSeconds={elapsed} />}
        {!result && (
          <span className="pill">
            {questions.length - unanswered}/{questions.length} answered
          </span>
        )}
      </LevelHeader>

      <article className="lesson-body">
        {result && (
          <section className={`card score-card ${result.passed ? "passed" : "failed"}`} aria-live="polite">
            <div className="score-ring" aria-hidden="true">
              {result.score}%
            </div>
            <div>
              <h2>
                {result.passed ? "✓ Guardian defeated!" : "✗ Not yet — the guardian holds the gate"}
              </h2>
              <p>
                {result.correctCount} of {result.totalCount} correct · pass mark {result.passingScore}% · time{" "}
                {formatClock(elapsed)}
              </p>
              {!result.passed && (
                <p className="muted">
                  Each missed question below links to the lesson behind it. Review those lessons, then come back for a
                  retry — the answers aren't shown, so the retry really checks your understanding.
                </p>
              )}
            </div>
          </section>
        )}

        {result?.passed && (
          <RewardBanner
            xp={result.xpGained}
            coins={result.coinsGained}
            message={result.nextLevelId ? "The way to the next realm is open!" : "You've completed the whole path!"}
            onBack={props.onBack}
            onNext={result.nextLevelId ? () => props.onNext(result.nextLevelId!) : undefined}
            nextLabel="Enter the next realm"
          />
        )}
        {result && !result.passed && result.xpGained > 0 && (
          <p className="muted">+{result.xpGained} XP for improving on your best score.</p>
        )}

        {questions.map((q, i) => (
          <QuizQuestion
            key={q.id}
            question={q}
            number={i + 1}
            value={answers[q.id] ?? ""}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
            result={resultFor(q.id)}
            onReview={props.onOpenLevel}
          />
        ))}

        {error && <p className="danger-text">{error}</p>}
        <footer className="card lesson-footer">
          {result ? (
            <>
              <p className="muted">{result.passed ? "Explanations are shown for every question." : "Review the linked lessons to unlock a retry."}</p>
              <button className="btn-ghost" onClick={props.onRetry}>
                Back to the quiz overview
              </button>
            </>
          ) : (
            <>
              <p className="muted">Answers are graded on the server when you submit.</p>
              <button className="btn-primary" onClick={submit} disabled={busy}>
                Submit answers <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </footer>
      </article>
    </div>
  );
}
