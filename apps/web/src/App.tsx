import { useCallback, useEffect, useState } from "react";
import type { ProgressResponse, WorldSummary } from "@atlas/shared-types";
import { api } from "./api/client.js";
import { WorldMap } from "./screens/WorldMap.js";
import { RealmScreen } from "./screens/RealmScreen.js";
import { QuestScreen } from "./screens/QuestScreen.js";
import { Crest } from "./components/Art.js";

// No router dependency added for three screens (CLAUDE.md: avoid unnecessary
// dependencies) — a simple state machine is enough at this scale.
type Screen =
  | { name: "map" }
  | { name: "realm"; worldId: string; selectedLevelId?: string }
  | { name: "quest"; worldId: string; levelId: string };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "map" });
  const [worlds, setWorlds] = useState<WorldSummary[] | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-fetched after every quest so unlocks and XP/coins show up immediately.
  const refresh = useCallback(async () => {
    const paths = await api.getLearningPaths();
    const [nextWorlds, nextProgress] = await Promise.all([api.getWorlds(paths[0].id), api.getProgress()]);
    setWorlds(nextWorlds);
    setProgress(nextProgress);
    return nextWorlds;
  }, []);

  useEffect(() => {
    refresh().catch((err) => setError(String(err)));
  }, [refresh]);

  async function goToNextLevel(worldId: string, levelId: string) {
    const fresh = await refresh().catch(() => worlds ?? []);
    const levels = fresh.find((w) => w.id === worldId)?.levels ?? [];
    const current = levels.find((l) => l.id === levelId);
    const next = levels.find((l) => current && l.sequenceOrder === current.sequenceOrder + 1);
    setScreen({ name: "realm", worldId, selectedLevelId: next?.id ?? levelId });
  }

  function backFromQuest(worldId: string) {
    refresh().catch((err) => setError(String(err)));
    setScreen({ name: "realm", worldId });
  }

  let content;
  if (error) {
    content = (
      <p className="status" role="alert">
        Couldn't reach the game server: {error}
      </p>
    );
  } else if (!worlds) {
    content = <p className="status">Loading the map...</p>;
  } else if (screen.name === "quest") {
    content = (
      <QuestScreen
        levelId={screen.levelId}
        onBack={() => backFromQuest(screen.worldId)}
        onNextLevel={() => goToNextLevel(screen.worldId, screen.levelId)}
      />
    );
  } else if (screen.name === "realm") {
    const world = worlds.find((w) => w.id === screen.worldId);
    content = world ? (
      <RealmScreen
        key={screen.selectedLevelId}
        world={world}
        initialLevelId={screen.selectedLevelId}
        onStartQuest={(levelId) => setScreen({ name: "quest", worldId: world.id, levelId })}
      />
    ) : null;
  } else {
    content = (
      <WorldMap
        worlds={worlds}
        hud={<Hud progress={progress} />}
        onSelectWorld={(worldId) => setScreen({ name: "realm", worldId })}
      />
    );
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">
          <Crest size={52} />
          Project Atlas
        </div>
        <nav className="nav" aria-label="Main">
          <button aria-current={screen.name === "map" ? "page" : undefined} onClick={() => setScreen({ name: "map" })}>
            <span aria-hidden="true">🗺️</span> World Map
          </button>
          {screen.name !== "map" && (
            <button
              aria-current={screen.name === "realm" ? "page" : undefined}
              onClick={() => setScreen({ name: "realm", worldId: screen.worldId })}
            >
              <span aria-hidden="true">📜</span> Quests
            </button>
          )}
        </nav>
        <p className="sidebar-note">Dev prototype · single local player</p>
      </aside>
      <main className="main">{content}</main>
    </div>
  );
}

// design.md §3.3 HUD: XP and coins. Player level thresholds aren't modeled yet
// (see progress.ts), so no level number or XP-to-next bar is invented here.
function Hud(props: { progress: ProgressResponse | null }) {
  if (!props.progress) return null;
  return (
    <div className="hud">
      <div className="avatar" aria-hidden="true">
        <span>🧑‍💻</span>
      </div>
      <div className="hud-player">
        <strong>Explorer</strong>
        <small>{props.progress.xp} XP earned</small>
      </div>
      <span className="pill" aria-label={`${props.progress.coins} coins`}>
        <span className="coin" aria-hidden="true" /> {props.progress.coins}
      </span>
    </div>
  );
}
