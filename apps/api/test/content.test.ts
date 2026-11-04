import { describe, it, expect } from "vitest";
import { REALMS } from "../src/content/index.js";
import { stripComments } from "../src/evaluation.js";

// Structural checks on the authored curriculum (fast, no Docker). The
// sandbox-backed correctness checks live in curriculum.integration.test.ts.
const levels = REALMS.flatMap((r) => r.levels);
const lessonSlugs = new Set(levels.filter((l) => l.kind === "lesson").map((l) => l.slug));

describe("curriculum structure", () => {
  it("has globally unique level slugs", () => {
    const slugs = levels.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("ends every realm with its guardian quiz", () => {
    for (const realm of REALMS) {
      expect(realm.levels.at(-1)?.kind, realm.slug).toBe("quiz");
      expect(realm.levels.filter((l) => l.kind === "quiz"), realm.slug).toHaveLength(1);
    }
  });

  for (const level of levels) {
    describe(level.slug, () => {
      const questions = level.questions ?? [];

      it("has the parts its kind needs", () => {
        if (level.kind === "lesson") {
          expect(level.blocks?.length).toBeGreaterThan(0);
          expect(level.summary).toBeDefined();
          expect(questions.length).toBeGreaterThan(0);
        }
        if (level.kind === "trial" || level.kind === "mock") {
          expect(level.challenge).toBeDefined();
          expect(level.challenge!.tests.some((t) => !t.hidden)).toBe(true);
          expect(level.challenge!.hints.length).toBeGreaterThanOrEqual(2);
        }
        if (level.kind === "quiz" || level.kind === "mock") {
          expect(level.passingScore).toBeGreaterThan(0);
          expect(questions.length).toBeGreaterThanOrEqual(level.kind === "quiz" ? 6 : 4);
        }
        if (level.kind === "mock") {
          expect(questions.every((q) => q.stage)).toBe(true);
        }
      });

      it("has unique question slugs with valid answer keys", () => {
        expect(new Set(questions.map((q) => q.slug)).size).toBe(questions.length);
        for (const q of questions) {
          if (q.kind === "mcq") {
            const ids = q.options?.map((o) => o.id) ?? [];
            expect(ids.length, q.slug).toBeGreaterThanOrEqual(2);
            expect(ids, q.slug).toContain(q.answer);
          } else {
            expect(q.code, `${q.slug} output questions need code`).toBeTruthy();
          }
          if (q.reviewLesson) expect(lessonSlugs.has(q.reviewLesson), `${q.slug} → ${q.reviewLesson}`).toBe(true);
        }
      });

      if (level.challenge) {
        it("never shows mistake-specific feedback for the reference solution's own code", () => {
          const source = stripComments(level.challenge!.solution);
          for (const rule of level.challenge!.feedback ?? []) {
            if (rule.codePattern && !rule.stdoutPattern) {
              expect(new RegExp(rule.codePattern).test(source), rule.message).toBe(false);
            }
          }
        });
      }

      if (level.kind === "lesson") {
        it("places every knowledge check in the lesson body exactly once", () => {
          const referenced = (level.blocks ?? []).filter((b) => b.type === "check").map((b) => b.question);
          expect([...referenced].sort()).toEqual(questions.map((q) => q.slug).sort());
        });
      }

      if (level.kind === "quiz") {
        it("points every quiz question at a lesson to review", () => {
          for (const q of questions) expect(q.reviewLesson, q.slug).toBeTruthy();
        });
      }
    });
  }
});
