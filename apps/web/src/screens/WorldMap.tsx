import type { ReactNode } from "react";
import type { WorldSummary } from "@atlas/shared-types";
import { Island } from "../components/Art.js";

// The Java path's later realms (CURRICULUM.md Worlds 2-3, DECISIONS.md D1) are
// shown as locked teasers only — they have no levels or data yet.
const UPCOMING_REALMS = [
  { name: "Object-Oriented Programming", variant: "fortress" as const },
  { name: "Data Structures & Algorithms", variant: "spires" as const },
];

// design.md §3.3: illustrated map; realm → level list lives in RealmScreen.
export function WorldMap(props: { worlds: WorldSummary[]; hud: ReactNode; onSelectWorld: (worldId: string) => void }) {
  return (
    <div className="map-page">
      <div className="stars" />
      <header className="page-header">
        <div>
          <h1 className="display">World Map</h1>
          <p className="muted">Your coding journey across the realms</p>
        </div>
        {props.hud}
      </header>

      <div className="realms">
        {props.worlds.map((world, i) => {
          const done = world.levels.filter((l) => l.state === "mastered").length;
          return (
            <button key={world.id} className="realm" onClick={() => props.onSelectWorld(world.id)}>
              <Island variant="village" locked={false} />
              <span className="realm-label">
                <span className="realm-num">{i + 1}</span>
                <span>
                  <strong>Java Fundamentals</strong>
                  <small>
                    {world.name} · {done}/{world.levels.length} levels
                  </small>
                </span>
              </span>
            </button>
          );
        })}
        {UPCOMING_REALMS.map((realm) => (
          <button key={realm.name} className="realm" disabled aria-label={`${realm.name} — locked`}>
            <Island variant={realm.variant} locked />
            <span className="realm-label">
              <span>
                <strong>{realm.name}</strong>
                <small>🔒 Locked</small>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
