import { foundry } from "./realm-1-foundry.js";
import { gearworks } from "./realm-2-gearworks.js";
import { docks } from "./realm-3-docks.js";
import type { RealmDef } from "./types.js";

// The single Java learning path (DECISIONS.md D1/D2/D11): every realm, lesson,
// trial and quiz uses Java, in this order. Realms unlock one after another.
export const PATH = { code: "java", name: "Java: Fundamentals to Interview-Ready" };

export const REALMS: RealmDef[] = [foundry, gearworks, docks];
