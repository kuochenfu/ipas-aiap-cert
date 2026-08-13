import { describe, it, expect } from "vitest";
import { getQuestions } from "../src/data/index";
import type { ChoiceId } from "../src/data/types";

const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];
const TEMPLATE_SIGNATURES = [/依學習指引中「/, /較像是在問該選項本身代表的概念/];

/** 該考卷中「詳解達標且三個錯誤選項解析齊全」的題數。 */
export const completeCount = (subjectId: string, examCode: string): number =>
  getQuestions(subjectId).filter((q) => {
    if (!q.id.includes(`-${examCode}-`)) return false;
    if (q.source !== "past-exam") return false;
    if (q.explanation.trim().length < 60) return false;
    if (TEMPLATE_SIGNATURES.some((re) => re.test(q.explanation))) return false;
    const keys = Object.keys(q.choiceExplanations ?? {}).sort();
    const expected = choiceIds.filter((id) => id !== q.answer).sort();
    return JSON.stringify(keys) === JSON.stringify(expected)
      && expected.every((id) => (q.choiceExplanations as Record<string, string>)[id].trim().length > 0);
  }).length;

describe("原題庫詳解與選項解析覆蓋率", () => {
  it("junior-ai-basics 115-1 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-1")).toBe(50);
  });
});

describe("gen 題目不得被更動", () => {
  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId} 的 gen 題仍保有自己的詳解與選項解析`, () => {
      const gen = getQuestions(subjectId).filter((q) => q.source === "generated");
      expect(gen.length).toBeGreaterThan(0);
      for (const q of gen) {
        expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
        expect(Object.keys(q.choiceExplanations ?? {}).length, q.id).toBeGreaterThan(0);
      }
    });
  }
});
