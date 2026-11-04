import { useEffect, useState } from "react";

// A hash router in a dozen lines, so the browser's back button and a refresh
// keep the learner's place without adding a router dependency (CLAUDE.md).
//   #/                 course map
//   #/journal          progress dashboard
//   #/realm/:worldId   quest list + briefing (optionally ?level=:levelId)
//   #/level/:levelId   lesson / trial / quiz / mock screen
export type Route =
  | { name: "map" }
  | { name: "journal" }
  | { name: "realm"; worldId: string; levelId?: string }
  | { name: "level"; levelId: string };

export function parseRoute(hash: string): Route {
  const [path, query] = hash.replace(/^#/, "").split("?");
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "journal") return { name: "journal" };
  if (parts[0] === "realm" && parts[1]) {
    const levelId = new URLSearchParams(query).get("level") ?? undefined;
    return { name: "realm", worldId: parts[1], levelId };
  }
  if (parts[0] === "level" && parts[1]) return { name: "level", levelId: parts[1] };
  return { name: "map" };
}

export function href(route: Route): string {
  switch (route.name) {
    case "map":
      return "#/";
    case "journal":
      return "#/journal";
    case "realm":
      return `#/realm/${route.worldId}${route.levelId ? `?level=${route.levelId}` : ""}`;
    case "level":
      return `#/level/${route.levelId}`;
  }
}

export function navigate(route: Route) {
  window.location.hash = href(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
