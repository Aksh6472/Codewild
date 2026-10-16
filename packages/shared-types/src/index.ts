// Shared types between apps/api and apps/web for Milestone 3 (see ROADMAP.md, API_SPEC.md subset).
// Kept intentionally small — only the shapes the levels 1-3 prototype actually needs.

export type ErrorClassification = "compile_error" | "runtime_exception" | "timeout" | "none";

export interface WorldSummary {
  id: string;
  name: string;
  sequenceOrder: number;
  levels: LevelSummary[];
}

export interface LevelSummary {
  id: string;
  title: string;
  sequenceOrder: number;
  syllabusTag: string | null;
  isBoss: boolean;
  state: "locked" | "available" | "in_progress" | "mastered";
}

export interface LevelDetail {
  id: string;
  title: string;
  story: string;
  concept: string;
  instructions: string;
  starterCode: string;
  goalChecklist: string[];
}

export interface SubmitRequest {
  challengeId: string;
  code: string;
}

export interface SubmitResponse {
  submissionId: string;
  status: "pending";
}

export interface VisibleResult {
  description: string;
  passed: boolean;
}

export interface SubmissionResultResponse {
  status: "pending" | "passed" | "failed" | "error" | "timeout";
  visibleResults: VisibleResult[];
  // The student's own program's stdout from its first visible test run — this
  // is the same information a terminal would show them, not hidden data, and
  // is what drives the world view (design.md: "the world shows you what your
  // code did"). Hidden-test output is never included here (SECURITY.md).
  visibleStdout: string | null;
  hiddenTwist: { triggered: boolean; narrativeMessage: string } | null;
  rung0Message: string | null;
}

export interface ProgressResponse {
  levels: { levelId: string; state: LevelSummary["state"] }[];
  conceptMastery: { concept: string; status: string }[];
  xp: number;
  coins: number;
}

export interface RewardResponse {
  xpGained: number;
  coinsGained: number;
  leveledUp: boolean;
  newlyUnlockedLevelIds: string[];
  whatYouLearned: { sentence: string; keyCodeLine: string };
}
