import { useCallback, useEffect, useState } from "react";
import type { DashboardResponse, LevelDetail, WorldSummary } from "@atlas/shared-types";
import { api, errorText } from "./api/client.js";
import { navigate, useRoute } from "./router.js";
import { WorldMap } from "./screens/WorldMap.js";
import { RealmScreen } from "./screens/RealmScreen.js";
import { QuestScreen } from "./screens/QuestScreen.js";
import { LessonScreen } from "./screens/LessonScreen.js";
import { QuizScreen } from "./screens/QuizScreen.js";
import { MockScreen } from "./screens/MockScreen.js";
import { JournalScreen } from "./screens/JournalScreen.js";
import { Crest } from "./components/Art.js";

type Hud = Pick<DashboardResponse, "xp" | "coins" | "rank">;

export function App() {
  const route = useRoute();
  const [worlds, setWorlds] = useState<WorldSummary[] | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-fetched after every graded action so unlocks and points show up at once.
  const refresh = useCallback(async () => {
    const paths = await api.getLearningPaths();
    const [nextWorlds, dashboard] = await Promise.all([api.getWorlds(paths[0].id), api.getDashboard()]);
    setWorlds(nextWorlds);
    setHud({ xp: dashboard.xp, coins: dashboard.coins, rank: dashboard.rank });
  }, []);

  useEffect(() => {
    refresh().catch((err) => setError(errorText(err)));
  }, [refresh]);

  const onProgress = () => {
    refresh().catch(() => undefined);
  };

  const openLevel = (levelId: string) => navigate({ name: "level", levelId });
  const currentWorld = worlds?.find((w) => w.state === "open") ?? worlds?.[0];
  const routeWorldId =
    route.name === "realm"
      ? route.worldId
      : route.name === "level"
        ? worlds?.find((w) => w.levels.some((l) => l.id === route.levelId))?.id
        : undefined;

  let content;
  if (error) {
    content = (
      <p className="status" role="alert">
        Couldn't reach the game server: {error}
      </p>
    );
  } else if (!worlds) {
    content = <p className="status">Loading the map…</p>;
  } else if (route.name === "journal") {
    content = (
      <JournalScreen onOpenLevel={openLevel} onOpenRealm={(worldId) => navigate({ name: "realm", worldId })} />
    );
  } else if (route.name === "realm") {
    const index = worlds.findIndex((w) => w.id === route.worldId);
    content =
      index >= 0 ? (
        <RealmScreen
          key={`${route.worldId}-${route.levelId ?? ""}`}
          world={worlds[index]}
          realmIndex={index}
          initialLevelId={route.levelId}
          onStartQuest={openLevel}
        />
      ) : (
        <p className="status">That realm doesn't exist.</p>
      );
  } else if (route.name === "level") {
    content = (
      <LevelRoute
        key={route.levelId}
        levelId={route.levelId}
        worlds={worlds}
        onProgress={onProgress}
        onOpenLevel={openLevel}
      />
    );
  } else {
    content = (
      <WorldMap
        worlds={worlds}
        hud={hud && <HudBar hud={hud} />}
        onSelectWorld={(worldId) => navigate({ name: "realm", worldId })}
      />
    );
  }

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <div className="logo">
          <Crest size={52} />
          Project Atlas
        </div>
        <nav className="nav" aria-label="Main">
          <button aria-current={route.name === "map" ? "page" : undefined} onClick={() => navigate({ name: "map" })}>
            <span aria-hidden="true">🗺️</span> World Map
          </button>
          <button aria-current={route.name === "journal" ? "page" : undefined} onClick={() => navigate({ name: "journal" })}>
            <span aria-hidden="true">📖</span> Journal
          </button>
          {(routeWorldId ?? currentWorld?.id) && (
            <button
              aria-current={route.name === "realm" ? "page" : undefined}
              onClick={() => navigate({ name: "realm", worldId: (routeWorldId ?? currentWorld?.id)! })}
            >
              <span aria-hidden="true">📜</span> Quests
            </button>
          )}
        </nav>
        {hud && (
          <div className="sidebar-hud" aria-label="Your points">
            <strong>{hud.rank.title}</strong>
            <span>
              <span className="star" aria-hidden="true">✦</span> {hud.xp} XP
            </span>
            <span>
              <span className="coin" aria-hidden="true" /> {hud.coins}
            </span>
          </div>
        )}
        <p className="sidebar-note">Dev prototype · single local player</p>
      </aside>
      <main className="main" id="main">
        {content}
      </main>
    </div>
  );
}

// Loads one level and hands it to the screen for its kind. `reloadKey`
// remounts the screen so "retry" starts from fresh server state.
function LevelRoute(props: {
  levelId: string;
  worlds: WorldSummary[];
  onProgress: () => void;
  onOpenLevel: (levelId: string) => void;
}) {
  const [level, setLevel] = useState<LevelDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    api
      .getLevel(props.levelId)
      .then(setLevel)
      .catch((err) => setError(errorText(err)));
  }, [props.levelId, reloadKey]);

  if (error) return <p className="status" role="alert">{error}</p>;
  if (!level) return <p className="status">Loading quest…</p>;

  const backToRealm = () => navigate({ name: "realm", worldId: level.worldId, levelId: level.id });

  if (level.state === "locked") {
    return (
      <div className="status">
        <p>🔒 This quest is locked — finish the quest before it first.</p>
        <button className="btn-ghost" onClick={backToRealm}>
          Back to the quest list
        </button>
      </div>
    );
  }

  const common = {
    level,
    onBack: backToRealm,
    onNext: props.onOpenLevel,
    onProgress: props.onProgress,
  };
  const reload = () => {
    setLevel(null);
    setReloadKey((k) => k + 1);
  };

  switch (level.kind) {
    case "lesson":
      return <LessonScreen key={reloadKey} {...common} />;
    case "trial":
      return <QuestScreen key={reloadKey} {...common} />;
    case "quiz":
      return (
        <QuizScreen
          key={reloadKey}
          {...common}
          realmSummary={props.worlds.find((w) => w.id === level.worldId)?.summary ?? null}
          onOpenLevel={props.onOpenLevel}
          onReload={reload}
        />
      );
    case "mock":
      return <MockScreen key={reloadKey} {...common} onOpenLevel={props.onOpenLevel} onReload={reload} />;
  }
}

// design.md §3.3 HUD: rank, XP and coins.
function HudBar(props: { hud: Hud }) {
  const { rank } = props.hud;
  const pct = rank.xpForNextRank ? Math.round((rank.xpIntoRank / rank.xpForNextRank) * 100) : 100;
  return (
    <div className="hud">
      <div className="avatar" aria-hidden="true">
        <span>🧑‍💻</span>
      </div>
      <div className="hud-player">
        <strong>{rank.title}</strong>
        <div className="xp-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next rank">
          <span style={{ width: `${pct}%` }} />
          <em>{props.hud.xp} XP</em>
        </div>
      </div>
      <span className="pill" aria-label={`${props.hud.coins} coins`}>
        <span className="coin" aria-hidden="true" /> {props.hud.coins}
      </span>
    </div>
  );
}
