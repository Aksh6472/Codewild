import type {
  WorldSummary,
  LevelDetail,
  SubmitResponse,
  SubmissionResultResponse,
  ProgressResponse,
  RewardResponse,
} from "@atlas/shared-types";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getWorlds: (learningPathId: string) => json<WorldSummary[]>(`/learning-paths/${learningPathId}/worlds`),
  getLearningPaths: () => json<{ id: string }[]>(`/learning-paths`),
  getLevel: (levelId: string) => json<LevelDetail & { challengeId: string }>(`/levels/${levelId}`),
  submit: (challengeId: string, code: string) =>
    json<SubmitResponse>(`/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, code }),
    }),
  getSubmission: (submissionId: string) => json<SubmissionResultResponse>(`/submissions/${submissionId}`),
  getProgress: () => json<ProgressResponse>(`/progress`),
  getReward: (submissionId: string) => json<RewardResponse>(`/progress/reward/${submissionId}`),
};
