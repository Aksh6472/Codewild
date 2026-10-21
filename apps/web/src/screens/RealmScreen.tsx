import { useEffect, useState } from "react";
import type { LevelDetail, LevelSummary, WorldSummary } from "@atlas/shared-types";
import { api } from "../api/client.js";
import { Robot } from "../components/Art.js";

// Mirrors apps/api/src/reward/reward.ts. Shown as "up to" because hint use can
// halve coins — the real amount always comes from the reward endpoint.
const XP_PER_LEVEL = 50;
const COINS_PER_LEVEL = 20;

// design.md §3.3 node states — always icon + text, never colour alone.
const STATE_LABEL: Record<LevelSummary["state"], { icon: string; text: string }> = {
  locked: { icon: "🔒", text: "Locked" },
  available: { icon: "○", text: "New" },
  in_progress: { icon: "◐", text: "Started" },
  mastered: { icon: "★", text: "Mastered" },
};

// Level list + briefing (design.md §2 "BRIEFING: 1 screen").
export function RealmScreen(props: { world: WorldSummary; initialLevelId?: string; onStartQuest: (levelId: string) => void }) {
  const levels = props.world.levels;
  const firstOpen = levels.find((l) => l.state === "available" || l.state === "in_progress") ?? levels[0];
  const [selectedId, setSelectedId] = useState(props.initialLevelId ?? firstOpen?.id);
  const [detail, setDetail] = useState<LevelDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = levels.find((l) => l.id === selectedId);
  const done = levels.filter((l) => l.state === "mastered").length;

  useEffect(() => {
    if (!selectedId) return;
    setDetail(null);
    setError(null);
    api
      .getLevel(selectedId)
      .then(setDetail)
      .catch((err) => setError(String(err)));
  }, [selectedId]);

  return (
    <div className="realm-page">
      <aside className="level-list">
        <h2 className="display">Java Fundamentals</h2>
        <div className="progress-line">
          {done}/{levels.length} levels mastered
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${levels.length ? (done / levels.length) * 100 : 0}%` }} />
          </div>
        </div>
        <ol>
          {levels.map((level) => {
            const label = STATE_LABEL[level.state];
            return (
              <li key={level.id}>
                <button
                  className="level-row"
                  disabled={level.state === "locked"}
                  aria-current={level.id === selectedId ? "true" : undefined}
                  onClick={() => setSelectedId(level.id)}
                >
                  {level.sequenceOrder}. {level.title}
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
            Couldn't load this level: {error}
          </p>
        )}
        {!error && !detail && <p className="status">Loading briefing...</p>}
        {detail && selected && (
          <>
            <div className="briefing-body">
              <div>
                <div className="eyebrow">Level {selected.sequenceOrder}</div>
                <div className="briefing-title">
                  <h1 className="display">{detail.title}</h1>
                  {selected.syllabusTag && <span className="tag">{selected.syllabusTag}</span>}
                </div>
              </div>
              <p className="muted">{detail.story}</p>
              <div>
                <div className="section-label">Your goal</div>
                <ul className="check-list">
                  {detail.goalChecklist.map((goal) => (
                    <li key={goal}>
                      <span aria-hidden="true">○</span> {goal}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="section-label">Rewards</div>
                <div className="rewards">
                  <span>
                    <span className="star" aria-hidden="true">✦</span> +{XP_PER_LEVEL} XP
                  </span>
                  <span>
                    <span className="coin" aria-hidden="true" /> up to {COINS_PER_LEVEL} coins
                  </span>
                </div>
              </div>
              <div>
                <button className="btn-primary" onClick={() => props.onStartQuest(detail.id)}>
                  {selected.state === "mastered" ? "Replay Quest" : "Start Quest"} <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <div className="companion">
              <div className="speech">{detail.instructions}</div>
              <Robot size={200} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
