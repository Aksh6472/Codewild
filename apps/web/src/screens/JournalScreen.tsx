import { useEffect, useState } from "react";
import type { DashboardResponse } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { KIND_LABEL } from "../components/LevelChrome.js";

// The adventurer's journal — the progress dashboard: current realm, rank and
// points, completed topics, quiz scores, the review queue and the next step.
export function JournalScreen(props: { onOpenLevel: (levelId: string) => void; onOpenRealm: (worldId: string) => void }) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDashboard().then(setData).catch((err) => setError(errorText(err)));
  }, []);

  if (error) return <p className="status" role="alert">Couldn't load your journal: {error}</p>;
  if (!data) return <p className="status">Opening your journal…</p>;

  const totalLevels = data.realms.reduce((n, r) => n + r.total, 0);
  const doneLevels = data.realms.reduce((n, r) => n + r.done, 0);
  const rankPct = data.rank.xpForNextRank ? Math.round((data.rank.xpIntoRank / data.rank.xpForNextRank) * 100) : 100;

  return (
    <div className="journal">
      <header className="page-header">
        <div>
          <h1 className="display">Adventurer's Journal</h1>
          <p className="muted">Your progress across the Java path — earned through mastery, not time spent.</p>
        </div>
      </header>

      <div className="journal-grid">
        <section className="card panel stat-card next-step">
          <div className="eyebrow">Next step</div>
          {data.nextStep ? (
            <>
              <h2>
                <span aria-hidden="true">{KIND_LABEL[data.nextStep.kind].icon}</span> {data.nextStep.title}
              </h2>
              <p className="muted">
                {KIND_LABEL[data.nextStep.kind].text}
                {data.currentRealm ? ` in ${data.currentRealm.name}` : ""}
              </p>
              <div>
                <button className="btn-primary" onClick={() => props.onOpenLevel(data.nextStep!.levelId)}>
                  Continue <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          ) : (
            <h2>Every quest is complete. You're interview-ready! 🎉</h2>
          )}
        </section>

        <section className="card panel stat-card">
          <div className="eyebrow">Rank</div>
          <h2>{data.rank.title}</h2>
          <div className="xp-bar" role="progressbar" aria-valuenow={rankPct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next rank">
            <span style={{ width: `${rankPct}%` }} />
            <em>{data.rank.xpForNextRank ? `${data.rank.xpIntoRank}/${data.rank.xpForNextRank} XP` : "Max rank"}</em>
          </div>
          <div className="stat-row">
            <span>
              <span className="star" aria-hidden="true">✦</span> <strong>{data.xp}</strong> XP
            </span>
            <span>
              <span className="coin" aria-hidden="true" /> <strong>{data.coins}</strong> coins
            </span>
          </div>
        </section>

        <section className="card panel stat-card">
          <div className="eyebrow">Current level</div>
          <h2>{data.currentRealm ? `Realm ${data.currentRealm.sequenceOrder}: ${data.currentRealm.name}` : "Path complete"}</h2>
          <p className="muted">
            {doneLevels}/{totalLevels} quests across the path · {data.challenges.solved}/{data.challenges.total} trials solved ·{" "}
            {data.challenges.runs} code runs
          </p>
          {data.currentRealm && (
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${(data.currentRealm.done / data.currentRealm.total) * 100}%` }} />
            </div>
          )}
        </section>

        <section className="card panel journal-wide">
          <h2>Realms</h2>
          <ol className="realm-progress">
            {data.realms.map((r) => (
              <li key={r.id}>
                <button className="link-button" disabled={r.state === "locked"} onClick={() => props.onOpenRealm(r.id)}>
                  {r.sequenceOrder}. {r.name}
                </button>
                <span className="muted small">
                  {r.state === "locked" ? "🔒 Locked" : r.state === "complete" ? "★ Complete" : `${r.done}/${r.total} quests`}
                  {r.quizBest !== null ? ` · quiz best ${r.quizBest}%` : ""}
                </span>
                <div className="progress-track" aria-hidden="true">
                  <span style={{ width: `${(r.done / r.total) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="card panel">
          <h2>Review queue</h2>
          {data.reviewQueue.length === 0 ? (
            <p className="muted">Nothing to review right now. Topics you miss in a quiz will appear here.</p>
          ) : (
            <ul className="check-list">
              {data.reviewQueue.map((r) => (
                <li key={`${r.levelId}-${r.reason}`}>
                  <span aria-hidden="true">↻</span>
                  <span>
                    <button className="link-button" onClick={() => props.onOpenLevel(r.levelId)}>
                      {r.title}
                    </button>
                    <br />
                    <small className="muted">{r.reason}</small>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card panel">
          <h2>Quiz scores</h2>
          <table className="score-table">
            <thead>
              <tr>
                <th scope="col">Quiz</th>
                <th scope="col">Best</th>
                <th scope="col">Tries</th>
              </tr>
            </thead>
            <tbody>
              {data.quizScores.map((q) => (
                <tr key={q.levelId}>
                  <td>{q.title}</td>
                  <td>{q.bestScore === null ? "—" : `${q.bestScore}% ${q.passed ? "✓" : "✗"}`}</td>
                  <td>{q.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card panel">
          <h2>Completed topics ({data.completedTopics.length})</h2>
          {data.completedTopics.length === 0 ? (
            <p className="muted">Your first lesson is waiting on the map.</p>
          ) : (
            <ul className="topic-list">
              {data.completedTopics.map((t) => (
                <li key={t.levelId}>
                  <span aria-hidden="true">{KIND_LABEL[t.kind].icon}</span>{" "}
                  <button className="link-button" onClick={() => props.onOpenLevel(t.levelId)}>
                    {t.title}
                  </button>{" "}
                  <small className="muted">
                    {t.realmName}
                    {t.state === "mastered" ? " · ★" : " · assisted"}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card panel">
          <h2>Recent rewards</h2>
          {data.recentRewards.length === 0 ? (
            <p className="muted">Points appear here as you complete lessons, solve trials and pass quizzes.</p>
          ) : (
            <ul className="check-list">
              {data.recentRewards.map((r, i) => (
                <li key={i}>
                  <span aria-hidden="true">✦</span>
                  <span>
                    {r.reason} — +{r.xp} XP{r.coins ? `, +${r.coins} coins` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="muted small">
            Points come from lessons, first-try checks, solved trials, quiz passes and improvements, and reviewing missed
            topics — each earned once. Advancing always requires passing the work itself.
          </p>
        </section>
      </div>
    </div>
  );
}
