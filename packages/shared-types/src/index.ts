// Shared types between apps/api and apps/web (API_SPEC.md). Only public-safe
// shapes live here — nothing in this file may carry an answer key, a hidden
// test or an unearned solution (SECURITY.md).

export type ErrorClassification = "compile_error" | "runtime_exception" | "timeout" | "none";

export type LevelKind = "lesson" | "trial" | "quiz" | "mock";
export type LevelState = "locked" | "available" | "in_progress" | "assisted" | "mastered";
export type Guidance = "guided" | "supported" | "independent";
export type MockStage = "clarify" | "plan" | "test" | "complexity";

// Lesson content blocks (authored in apps/api/src/content).
export type Block =
  | { type: "text"; md: string }
  | { type: "callout"; tone: "tip" | "warning" | "interview"; md: string }
  | { type: "code"; title?: string; lines: [string, string][]; stdin?: string; runnable?: boolean }
  | { type: "check"; question: string };

export interface Summary {
  keyIdeas: string[];
  mistakes: string[];
}

export interface WorldSummary {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  story: string;
  theme: string;
  sequenceOrder: number;
  state: "locked" | "open" | "complete";
  summary: Summary | null;
  levels: LevelSummary[];
}

export interface LevelSummary {
  id: string;
  title: string;
  kind: LevelKind;
  sequenceOrder: number;
  syllabusTag: string | null;
  isBoss: boolean;
  minutes: number;
  timeLimitMinutes: number | null;
  state: LevelState;
}

export interface PublicQuestion {
  id: string;
  slug: string; // short slug, matched by "check" blocks
  kind: "mcq" | "output";
  prompt: string;
  code: string | null;
  options: { id: string; text: string }[] | null;
  stage: MockStage | null;
  // Lessons only: whether this check has been answered correctly before, and
  // the explanation the learner already earned by answering it.
  answeredCorrectly: boolean;
  explanation: string | null;
}

export interface ChallengeView {
  id: string;
  instructions: string;
  starterCode: string;
  lastCode: string | null;
  guidance: Guidance;
  steps: string[];
  goalChecklist: string[];
  hints: string[]; // revealed so far
  hintsTotal: number;
  nextHint: { available: boolean; reason: string | null };
  failedAttempts: number;
  solved: boolean;
  solutionAvailable: boolean;
  solution: { code: string; explanation: string } | null;
}

export interface QuizStatus {
  passingScore: number;
  attempts: { score: number; passed: boolean; createdAt: string; elapsedSeconds: number | null }[];
  bestScore: number | null;
  passed: boolean;
  canAttempt: boolean;
  reviewRequired: { levelId: string; title: string; done: boolean }[];
}

export interface LevelDetail {
  id: string;
  worldId: string;
  worldName: string;
  title: string;
  story: string;
  concept: string;
  kind: LevelKind;
  syllabusTag: string | null;
  minutes: number;
  timeLimitMinutes: number | null;
  state: LevelState;
  blocks: Block[];
  summary: Summary | null;
  questions: PublicQuestion[];
  challenge: ChallengeView | null;
  quiz: QuizStatus | null;
  nextLevelId: string | null;
}

export interface AnswerResponse {
  correct: boolean;
  feedback: string | null;
  explanation: string;
  xpGained: number;
}

export interface LessonCompleteResponse {
  xpGained: number;
  coinsGained: number;
  reviewXp: number;
  nextLevelId: string | null;
}

export interface QuizAttemptRequest {
  answers: Record<string, string>;
  elapsedSeconds: number | null;
}

export interface QuizQuestionResult {
  questionId: string;
  correct: boolean;
  // Wrong answers: the misconception behind the chosen option (never the key).
  feedback: string | null;
  // Revealed only once the quiz is passed, so a retry can't be memorised.
  explanation: string | null;
  reviewLevel: { id: string; title: string } | null;
}

export interface QuizAttemptResponse {
  score: number;
  passed: boolean;
  passingScore: number;
  correctCount: number;
  totalCount: number;
  results: QuizQuestionResult[];
  xpGained: number;
  coinsGained: number;
  levelState: LevelState;
  nextLevelId: string | null;
}

export interface HintResponse {
  hints: string[];
  nextHint: ChallengeView["nextHint"];
  solutionAvailable: boolean;
}

export interface SolutionResponse {
  code: string;
  explanation: string;
}

export interface PlaygroundRunResponse {
  status: "ok" | "compile_error" | "runtime_exception" | "timeout";
  stdout: string;
  stderr: string;
  message: string | null;
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
  visibleStderr: string | null;
  hiddenTwist: { triggered: boolean; narrativeMessage: string } | null;
  rung0Message: string | null;
  // Authored, mistake-specific coaching (content `feedback` rules).
  targetedFeedback: string | null;
}

export interface ProgressResponse {
  levels: { levelId: string; state: LevelState }[];
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

export interface DashboardResponse {
  xp: number;
  coins: number;
  rank: { title: string; xpIntoRank: number; xpForNextRank: number | null };
  currentRealm: { id: string; name: string; sequenceOrder: number; done: number; total: number } | null;
  realms: {
    id: string;
    name: string;
    sequenceOrder: number;
    state: WorldSummary["state"];
    done: number;
    total: number;
    quizBest: number | null;
  }[];
  completedTopics: { levelId: string; title: string; realmName: string; kind: LevelKind; state: LevelState }[];
  quizScores: { levelId: string; title: string; bestScore: number | null; attempts: number; passed: boolean }[];
  challenges: { solved: number; total: number; assisted: number; runs: number };
  reviewQueue: { levelId: string; title: string; reason: string }[];
  nextStep: { levelId: string; worldId: string; title: string; kind: LevelKind } | null;
  recentRewards: { reason: string; xp: number; coins: number; at: string }[];
}
