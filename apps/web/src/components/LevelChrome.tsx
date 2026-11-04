import type { ReactNode } from "react";
import type { LevelDetail, LevelKind, Summary } from "@atlas/shared-types";
import { Robot } from "./Art.js";
import { Markdown } from "./Markdown.js";

// Shared pieces every level screen uses, so lessons, trials, quizzes and mock
// interviews keep one consistent layout (UI_UX.md).

export const KIND_LABEL: Record<LevelKind, { icon: string; text: string }> = {
  lesson: { icon: "📜", text: "Lore" },
  trial: { icon: "⚔️", text: "Trial" },
  quiz: { icon: "🛡️", text: "Guardian quiz" },
  mock: { icon: "🎙️", text: "Mock interview" },
};

export function LevelHeader(props: { level: LevelDetail; onBack: () => void; children?: ReactNode }) {
  const kind = KIND_LABEL[props.level.kind];
  return (
    <header className="quest-bar card">
      <button className="btn-ghost" onClick={props.onBack}>
        <span aria-hidden="true">◄</span> Quests
      </button>
      <div>
        <small className="muted">
          {props.level.worldName} · <span aria-hidden="true">{kind.icon}</span> {kind.text}
          {props.level.syllabusTag ? ` · ${props.level.syllabusTag}` : ""}
        </small>
        <h1>{props.level.title}</h1>
      </div>
      <span className="spacer" />
      {props.children}
    </header>
  );
}

export function StoryStrip(props: { text: string }) {
  return (
    <div className="story-strip">
      <Robot size={56} />
      <p className="muted">{props.text}</p>
    </div>
  );
}

export function SummaryCard(props: { summary: Summary; title?: string }) {
  return (
    <section className="card summary-card" aria-label={props.title ?? "Summary"}>
      <h2>{props.title ?? "Summary"}</h2>
      <div className="summary-cols">
        <div>
          <div className="section-label">
            <span aria-hidden="true">✦</span> Key ideas
          </div>
          <ul>
            {props.summary.keyIdeas.map((k) => (
              <li key={k}>
                <MarkdownInline text={k} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="section-label">
            <span aria-hidden="true">⚠</span> Common mistakes
          </div>
          <ul>
            {props.summary.mistakes.map((m) => (
              <li key={m}>
                <MarkdownInline text={m} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MarkdownInline(props: { text: string }) {
  return <Markdown text={props.text} inline />;
}

export function RewardBanner(props: {
  xp: number;
  coins: number;
  message: string;
  detail?: ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  onBack: () => void;
}) {
  return (
    <section className="card reward-card" aria-label="Quest complete" aria-live="polite">
      <div className="companion">
        <Robot size={90} happy />
        <div className="speech">
          {props.message}
          {(props.xp > 0 || props.coins > 0) && (
            <>
              <br />
              <strong>
                +{props.xp} XP{props.coins > 0 ? ` · +${props.coins} coins` : ""}
              </strong>
            </>
          )}
          {props.xp === 0 && props.coins === 0 && (
            <>
              <br />
              <em>Already earned — rewards are granted once per quest.</em>
            </>
          )}
          {props.detail}
        </div>
      </div>
      <div className="reward-actions">
        <button className="btn-ghost" onClick={props.onBack}>
          Back to quests
        </button>
        {props.onNext && (
          <button className="btn-primary" onClick={props.onNext}>
            {props.nextLabel ?? "Next quest"} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </section>
  );
}
