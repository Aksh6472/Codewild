// Authoring format for the Java path's curriculum (CURRICULUM.md). Content is
// written as typed TypeScript so a typo is a compile error, then synced into
// Postgres by db/seed.ts — the database stays the runtime source of truth.
//
// Fields marked SERVER-ONLY are never returned by a public route: answer keys,
// reference solutions and hidden tests (SECURITY.md, CLAUDE.md).

import type { Block, Guidance, LevelKind, MockStage, Summary } from "@atlas/shared-types";

export type { Block, Guidance, LevelKind, MockStage, Summary };

// Guidance — how much help a trial gives up front (guided practice → independence):
// guided = every hint available immediately and a step list is shown;
// supported = hint N unlocks after N-1 failed runs; independent = after N.
// Block "code" entries are [line of code, what that line does]; "check" blocks
// name a QuestionDef slug in the same level.

export interface QuestionOption {
  id: string;
  text: string;
  // Shown when the learner picks this wrong option — names the misconception
  // without revealing which option is right.
  feedback?: string;
}

export interface QuestionDef {
  slug: string;
  // mcq = pick one option; output = type exactly what the code prints.
  kind: "mcq" | "output";
  prompt: string;
  code?: string;
  options?: QuestionOption[];
  answer: string | string[]; // SERVER-ONLY
  explanation: string; // SERVER-ONLY until answered (lessons) or passed (quizzes)
  // Quizzes: which lesson to revisit when this is missed. Retrying a failed
  // quiz requires re-completing every lesson named by a missed question.
  reviewLesson?: string;
  stage?: MockStage;
}

export interface TestDef {
  description: string;
  hidden?: boolean;
  stdin?: string;
  stdout?: string;
  stdoutPattern?: string;
}

export interface CodeRequirement {
  description: string;
  pattern: string; // regex tested against the source
  mustMatch: boolean; // false = forbidden pattern (e.g. Arrays.sort in a sorting trial)
}

export interface ChallengeDef {
  instructions: string;
  starterCode: string;
  guidance: Guidance;
  steps?: string[];
  hints: string[]; // rungs 1-3: nudge, focus, worked example
  solution: string; // SERVER-ONLY until earned (rung 4)
  solutionExplanation: string; // SERVER-ONLY until earned
  tests: TestDef[];
  requirements?: CodeRequirement[];
  // Targeted feedback for known wrong answers, matched against the first
  // visible test's stdout or the submitted source.
  feedback?: { stdoutPattern?: string; codePattern?: string; message: string }[];
  // Documented wrong answers; curriculum tests assert each one fails.
  wrongSolutions?: string[];
}

export interface LevelDef {
  slug: string;
  title: string;
  kind: LevelKind;
  concept: string;
  syllabusTag: string;
  story: string;
  minutes: number;
  blocks?: Block[];
  summary?: Summary;
  questions?: QuestionDef[];
  challenge?: ChallengeDef;
  passingScore?: number; // percent; quiz and mock only
  timeLimitMinutes?: number; // shown as a countdown; never blocks a pass
}

export interface RealmDef {
  slug: string;
  name: string;
  subtitle: string;
  story: string;
  theme: "village" | "fortress" | "spires" | "forge" | "archive" | "labyrinth" | "arena";
  summary: Summary;
  levels: LevelDef[];
}
