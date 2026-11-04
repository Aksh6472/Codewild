import { useState } from "react";
import type { LessonCompleteResponse, LevelDetail } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { CodeExample } from "../components/CodeExample.js";
import { KnowledgeCheck } from "../components/QuestionCard.js";
import { Markdown } from "../components/Markdown.js";
import { LevelHeader, RewardBanner, StoryStrip, SummaryCard } from "../components/LevelChrome.js";

const CALLOUT_LABEL = { tip: "💡 Tip", warning: "⚠ Watch out", interview: "🎙 Interview angle" } as const;

// Lore quest: explanation → runnable examples → inline knowledge checks →
// summary. Finishing requires every check answered correctly (server-enforced);
// coming back after a failed guardian quiz counts as a review.
export function LessonScreen(props: {
  level: LevelDetail;
  onBack: () => void;
  onNext: (levelId: string) => void;
  onProgress: () => void;
}) {
  const { level } = props;
  const [solved, setSolved] = useState(() => new Set(level.questions.filter((q) => q.answeredCorrectly).map((q) => q.id)));
  const [checkXp, setCheckXp] = useState(0);
  const [done, setDone] = useState<LessonCompleteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const bySlug = new Map(level.questions.map((q) => [q.slug, q]));
  const remaining = level.questions.length - solved.size;
  const isReview = level.state === "mastered";

  async function complete() {
    setBusy(true);
    setError(null);
    try {
      setDone(await api.completeLesson(level.id));
      props.onProgress();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="quest lesson">
      <LevelHeader level={level} onBack={props.onBack}>
        <span className="pill">⏱ ~{level.minutes} min</span>
        <span className="pill">
          <span className="star" aria-hidden="true">✦</span> +20 XP
        </span>
      </LevelHeader>

      <article className="lesson-body">
        <StoryStrip text={level.story} />

        {level.blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return (
                <div key={i} className="prose">
                  <Markdown text={block.md} />
                </div>
              );
            case "callout":
              return (
                <aside key={i} className={`callout ${block.tone}`}>
                  <div className="callout-label">{CALLOUT_LABEL[block.tone]}</div>
                  <Markdown text={block.md} />
                </aside>
              );
            case "code":
              return <CodeExample key={i} {...block} />;
            case "check": {
              const q = bySlug.get(block.question);
              return q ? (
                <KnowledgeCheck
                  key={q.id}
                  question={q}
                  onCorrect={(id, xp) => {
                    setSolved((s) => new Set(s).add(id));
                    setCheckXp((x) => x + xp);
                    if (xp > 0) props.onProgress();
                  }}
                />
              ) : null;
            }
          }
        })}

        {level.summary && <SummaryCard summary={level.summary} />}

        {done ? (
          <RewardBanner
            xp={done.xpGained + done.reviewXp}
            coins={done.coinsGained}
            message={isReview ? "Lesson reviewed — nicely done." : "Lesson complete!"}
            detail={
              done.reviewXp > 0 ? (
                <>
                  <br />
                  Includes +{done.reviewXp} XP for revisiting a topic you missed.
                </>
              ) : null
            }
            onBack={props.onBack}
            onNext={done.nextLevelId ? () => props.onNext(done.nextLevelId!) : undefined}
          />
        ) : (
          <footer className="card lesson-footer">
            <div>
              <strong>
                {remaining === 0
                  ? "All knowledge checks answered ✓"
                  : `${remaining} knowledge check${remaining === 1 ? "" : "s"} left`}
              </strong>
              <p className="muted">
                {isReview
                  ? "Reviewing? Finishing again records the review — it unlocks a guardian-quiz retry if this topic was missed."
                  : "Answer every check correctly to complete the lesson."}
                {checkXp > 0 ? ` +${checkXp} XP from first-try checks.` : ""}
              </p>
              {error && <p className="danger-text">{error}</p>}
            </div>
            <button className="btn-primary" onClick={complete} disabled={busy || remaining > 0}>
              {isReview ? "Finish review" : "Complete lesson"} <span aria-hidden="true">✓</span>
            </button>
          </footer>
        )}
      </article>
    </div>
  );
}
