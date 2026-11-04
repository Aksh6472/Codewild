import { useEffect, useState } from "react";
import type { LevelDetail, LevelState, WorldSummary } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { Robot } from "../components/Art.js";
import { KIND_LABEL, SummaryCard } from "../components/LevelChrome.js";
import { Markdown } from "../components/Markdown.js";

// design.md §3.3 node states — always icon + text, never colour alone.
const STATE_LABEL: Record<LevelState, { icon: string; text: string }> = {
  locked: { icon: "🔒", text: "Locked" },
  available: { icon: "○", text: "New" },
  in_progress: { icon: "◐", text: "Started" },
  assisted: { icon: "✓", text: "Done" },
  mastered: { icon: "★", text: "Mastered" },
};

const START_LABEL = { lesson: "Read the lore", trial: "Start the trial", quiz: "Face the guardian", mock: "Begin the interview" };

// Quest list + briefing (design.md §2 "BRIEFING: 1 screen").
export function RealmScreen(props: {
  world: WorldSummary;
  realmIndex: number;
  initialLevelId?: string;
  onStartQuest: (levelId: string) => void;
}) {
  const levels = props.world.levels;
  const firstOpen = levels.find((l) => l.state === "available" || l.state === "in_progress") ?? levels[0];
  const [selectedId, setSelectedId] = useState(props.initialLevelId ?? firstOpen?.id);
  const [detail, setDetail] = useState<LevelDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedIndex = levels.findIndex((l) => l.id === selectedId);
  const selected = levels[selectedIndex];
  const done = levels.filter((l) => l.state === "mastered" || l.state === "assisted").length;

  useEffect(() => {
    if (!selectedId) return;
    setDetail(null);
    setError(null);
    api
      .getLevel(selectedId)
      .then(setDetail)
      .catch((err) => setError(errorText(err)));
  }, [selectedId]);

  return (
    <div className="realm-page">
      <aside className="level-list">
        <div>
          <div className="eyebrow">Realm {props.realmIndex + 1}</div>
          <h2 className="display">{props.world.name}</h2>
          <p className="muted small">{props.world.subtitle}</p>
        </div>
        <div className="progress-line">
          {done}/{levels.length} quests done
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${levels.length ? (done / levels.length) * 100 : 0}%` }} />
          </div>
        </div>
        <ol>
          {levels.map((level) => {
            const label = STATE_LABEL[level.state];
            const kind = KIND_LABEL[level.kind];
            return (
              <li key={level.id}>
                <button
                  className={`level-row kind-${level.kind}`}
                  aria-current={level.id === selectedId ? "true" : undefined}
                  onClick={() => setSelectedId(level.id)}
                >
                  <span className="kind-icon" aria-label={kind.text}>
                    {kind.icon}
                  </span>
                  <span className="level-title">{level.title}</span>
                  <span className={`state ${level.state}`}>
                    <span aria-hidden="true">{label.icon}</span> {label.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="briefing">
        {error && (
          <p className="status" role="alert">
            Couldn't load this quest: {error}
          </p>
        )}
        {!error && !detail && <p className="status">Loading briefing…</p>}
        {detail && selected && (
          <>
            <div className="briefing-body">
              <div>
                <div className="eyebrow">
                  Quest {selected.sequenceOrder} · <span aria-hidden="true">{KIND_LABEL[detail.kind].icon}</span>{" "}
                  {KIND_LABEL[detail.kind].text}
                </div>
                <div className="briefing-title">
                  <h1 className="display">{detail.title}</h1>
                  {selected.syllabusTag && <span className="tag">{selected.syllabusTag}</span>}
                </div>
              </div>
              <p className="muted">{detail.story}</p>

              {detail.state === "locked" ? (
                <p className="locked-note">
                  🔒 Locked — complete{" "}
                  <strong>{selectedIndex > 0 ? levels[selectedIndex - 1].title : "the previous realm's guardian quiz"}</strong>{" "}
                  first. Every quest builds on the one before it.
                </p>
              ) : (
                <BriefingFacts detail={detail} />
              )}

              <div>
                <button
                  className="btn-primary"
                  disabled={detail.state === "locked"}
                  onClick={() => props.onStartQuest(detail.id)}
                >
                  {detail.state === "mastered" || detail.state === "assisted" ? "Revisit" : START_LABEL[detail.kind]}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <div className="companion">
              {detail.challenge && (
                <div className="speech">
                  <Markdown text={detail.challenge.instructions.split("\n")[0]} inline />
                </div>
              )}
              <Robot size={200} />
            </div>
          </>
        )}
        {props.world.summary && (
          <details className="realm-codex">
            <summary>Realm codex — key ideas &amp; common mistakes</summary>
            <SummaryCard summary={props.world.summary} title={`${props.world.name}: what you'll master`} />
          </details>
        )}
      </section>
    </div>
  );
}

function BriefingFacts(props: { detail: LevelDetail }) {
  const d = props.detail;
  const facts: string[] = [];
  if (d.kind === "lesson") {
    facts.push(`About ${d.minutes} minutes of reading and runnable examples`);
    facts.push(`${d.questions.length} knowledge check${d.questions.length === 1 ? "" : "s"} to answer along the way`);
    facts.push("Rewards: +20 XP and 5 coins, +5 XP per check right first time");
  }
  if (d.challenge && (d.kind === "trial" || d.kind === "mock")) {
    const g = { guided: "Guided — step list and every hint available", supported: "Supported — hints unlock as you try", independent: "Independent — hints unlock after attempts" }[d.challenge.guidance];
    facts.push(g);
    facts.push("Visible tests show your goal; hidden tests try other inputs");
  }
  if (d.kind === "trial") facts.push("Rewards: +50 XP and up to 20 coins (half if you reveal the solution)");
  if (d.quiz) {
    facts.push(`Pass mark: ${d.quiz.passingScore}% · ${d.questions.length} questions`);
    if (d.quiz.bestScore !== null) facts.push(`Your best so far: ${d.quiz.bestScore}%`);
    if (d.kind === "quiz") facts.push("Rewards: +100 XP and 40 coins, plus XP for every point you improve");
  }
  if (d.timeLimitMinutes) facts.push(`Timed practice: ${d.timeLimitMinutes} minutes, like a real interview round`);
  return (
    <div>
      <div className="section-label">What to expect</div>
      <ul className="check-list">
        {facts.map((f) => (
          <li key={f}>
            <span aria-hidden="true">›</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
