import { useEffect, useState } from "react";
import type { WorldSummary } from "@atlas/shared-types";
import { api } from "../api/client.js";

// design.md §3.3: node states locked/available/in_progress/mastered.
export function WorldMap(props: { onSelectLevel: (levelId: string) => void }) {
  const [worlds, setWorlds] = useState<WorldSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getLearningPaths()
      .then((paths) => api.getWorlds(paths[0].id))
      .then(setWorlds)
      .catch((err) => setError(String(err)));
  }, []);

  if (error) return <p role="alert">Couldn't load the map: {error}</p>;
  if (!worlds) return <p>Loading map...</p>;

  const stateIcon: Record<string, string> = { locked: "🔒", available: "○", in_progress: "◐", mastered: "★" };

  return (
    <div>
      <h1>Project Atlas — The Silent Foundry</h1>
      {worlds.map((world) => (
        <div key={world.id}>
          <h2>{world.name}</h2>
          <ul>
            {world.levels.map((level) => (
              <li key={level.id}>
                <button
                  disabled={level.state === "locked"}
                  onClick={() => props.onSelectLevel(level.id)}
                  aria-label={`${level.title} — ${level.state}`}
                >
                  {stateIcon[level.state]} {level.title}
                  {level.syllabusTag ? ` (${level.syllabusTag})` : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
