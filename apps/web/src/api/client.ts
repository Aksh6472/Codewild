import type {
  AnswerResponse,
  DashboardResponse,
  HintResponse,
  LessonCompleteResponse,
  LevelDetail,
  PlaygroundRunResponse,
  ProgressResponse,
  QuizAttemptRequest,
  QuizAttemptResponse,
  RewardResponse,
  SolutionResponse,
  SubmissionResultResponse,
  SubmitResponse,
  WorldSummary,
} from "@atlas/shared-types";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Carries the API's own error message (e.g. "Review the lessons you missed
// before retrying.") so screens can show it instead of a bare status code.
export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code: string | null) {
    super(message);
  }
}

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
    throw new ApiError(
      body?.error?.message ?? `${init?.method ?? "GET"} ${path} failed: ${res.status}`,
      res.status,
      body?.error?.code ?? null
    );
  }
  return res.json() as Promise<T>;
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return json<T>(path, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export const api = {
  getLearningPaths: () => json<{ id: string; name: string }[]>(`/learning-paths`),
  getWorlds: (learningPathId: string) => json<WorldSummary[]>(`/learning-paths/${learningPathId}/worlds`),
  getLevel: (levelId: string) => json<LevelDetail>(`/levels/${levelId}`),
  completeLesson: (levelId: string) => post<LessonCompleteResponse>(`/levels/${levelId}/complete`),
  answerQuestion: (questionId: string, answer: string) => post<AnswerResponse>(`/questions/${questionId}/answer`, { answer }),
  submitAttempt: (levelId: string, body: QuizAttemptRequest) => post<QuizAttemptResponse>(`/levels/${levelId}/attempts`, body),
  submit: (challengeId: string, code: string) => post<SubmitResponse>(`/submissions`, { challengeId, code }),
  getSubmission: (submissionId: string) => json<SubmissionResultResponse>(`/submissions/${submissionId}`),
  getReward: (submissionId: string) => json<RewardResponse>(`/progress/reward/${submissionId}`),
  requestHint: (challengeId: string) => post<HintResponse>(`/challenges/${challengeId}/hints`),
  revealSolution: (challengeId: string) => post<SolutionResponse>(`/challenges/${challengeId}/solution`),
  runCode: (code: string, stdin: string) => post<PlaygroundRunResponse>(`/playground/run`, { code, stdin }),
  getProgress: () => json<ProgressResponse>(`/progress`),
  getDashboard: () => json<DashboardResponse>(`/dashboard`),
};

export function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
