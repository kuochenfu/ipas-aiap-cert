import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";

describe("題庫完整性", () => {
  for (const subject of subjects) {
    describe(subject.id, () => {
      const questions = getQuestions(subject.id);
      it("題庫非空", () => {
        expect(questions.length).toBeGreaterThan(0);
      });
      it("每題四選項、答案為A-D、id唯一、subjectId相符", () => {
        const ids = new Set<string>();
        for (const q of questions) {
          expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
          expect(["A", "B", "C", "D"]).toContain(q.answer);
          expect(q.subjectId).toBe(subject.id);
          expect(ids.has(q.id)).toBe(false);
          ids.add(q.id);
        }
      });
    });
  }
});
