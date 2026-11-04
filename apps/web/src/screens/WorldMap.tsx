import type { ReactNode } from "react";
import type { WorldSummary } from "@atlas/shared-types";
import { Island, type IslandVariant } from "../components/Art.js";

const STATE_TEXT: Record<WorldSummary["state"], string> = {
  locked: "🔒 Locked",
  open: "◐ In progress",
  complete: "★ Complete",
};

// The course map (design.md §3.3): every realm in order along one path, so a
// learner can always see where they are, what comes next, and what it takes
// to get there (each realm's guardian quiz opens the following realm).
export function WorldMap(props: { worlds: WorldSummary[]; hud: ReactNode; onSelectWorld: (worldId: string) => void }) {
  const current = props.worlds.find((w) => w.state === "open");

  return (
    <div className="map-page">
      <div className="stars" />
      <header className="page-header">
        <div>
          <h1 className="display">World Map</h1>
          <p className="muted">
            One path, one language: Java from your first line of code to interview-ready. Each realm's guardian opens the
            next.
          </p>
        </div>
        {props.hud}
      </header>

      <ol className="course-map">
        {props.worlds.map((world, i) => {
          const done = world.levels.filter((l) => l.state === "mastered" || l.state === "assisted").length;
          const lessons = world.levels.filter((l) => l.kind === "lesson").length;
          const trials = world.levels.filter((l) => l.kind === "trial" || l.kind === "mock").length;
          const locked = world.state === "locked";
          const next = props.worlds[i + 1];
          return (
            <li key={world.id} className={`map-node ${i % 2 ? "right" : "left"} ${world.state}`}>
              <button
                className="realm"
                disabled={locked}
                onClick={() => props.onSelectWorld(world.id)}
                aria-label={`Realm ${i + 1}: ${world.name} — ${STATE_TEXT[world.state]}`}
              >
                <Island variant={world.theme as IslandVariant} locked={locked} />
              </button>
              <div className="map-info card">
                {current?.id === world.id && <span className="here-badge">You are here</span>}
                <div className="realm-label-row">
                  <span className="realm-num">{i + 1}</span>
                  <div>
                    <strong>{world.name}</strong>
                    <small className="muted">{world.subtitle}</small>
                  </div>
                </div>
                <p className="small muted">
                  {STATE_TEXT[world.state]} · {done}/{world.levels.length} quests · {lessons} lessons, {trials} coding
                  challenges, 1 guardian quiz
                </p>
                <div className="progress-track" aria-hidden="true">
                  <span style={{ width: `${(done / world.levels.length) * 100}%` }} />
                </div>
                {next && (
                  <p className="small muted map-leads">
                    Leads to → {next.name}
                    {locked ? "" : world.state === "complete" ? " (open)" : " (beat the guardian to unlock)"}
                  </p>
                )}
                {!locked && (
                  <button className="btn-ghost btn-small" onClick={() => props.onSelectWorld(world.id)}>
                    {world.state === "complete" ? "Revisit" : "Enter realm"} <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
