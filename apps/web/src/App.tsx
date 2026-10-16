import { useState } from "react";
import { WorldMap } from "./screens/WorldMap.js";
import { QuestScreen } from "./screens/QuestScreen.js";

// No router dependency added for two screens (CLAUDE.md: avoid unnecessary
// dependencies) — a simple state machine is enough at this scale.
type Screen = { name: "map" } | { name: "quest"; levelId: string };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "map" });

  if (screen.name === "quest") {
    return (
      <QuestScreen
        levelId={screen.levelId}
        onBackToMap={() => setScreen({ name: "map" })}
        onNextLevel={() => setScreen({ name: "map" })} // next-level sequencing is a follow-on (levels 4+ aren't seeded yet)
      />
    );
  }

  return <WorldMap onSelectLevel={(levelId) => setScreen({ name: "quest", levelId })} />;
}
