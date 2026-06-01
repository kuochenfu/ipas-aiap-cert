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

describe("junior-genai 內容完整性", () => {
  const questions = getQuestions("junior-genai");
  const past = questions.filter((q) => q.source === "past-exam");
  const generated = questions.filter((q) => q.source === "generated");

  it("100 題真題詳解皆非空", () => {
    expect(past.length).toBe(100);
    const missing = past.filter((q) => q.explanation.trim().length === 0);
    expect(missing.map((q) => q.id)).toEqual([]);
  });

  it("新題數 ≥10", () => {
    expect(generated.length).toBeGreaterThanOrEqual(10);
  });

  it("新題 id 符合 junior-genai-gen-qNNN 規則且唯一", () => {
    const ids = generated.map((q) => q.id);
    for (const id of ids) {
      expect(id).toMatch(/^junior-genai-gen-q\d{3}$/);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("新題 topic 為三個官方主題之一（非未分類）", () => {
    const allowed = new Set([
      "No code / Low code 概念",
      "生成式 AI 應用領域與工具使用",
      "生成式 AI 導入評估規劃",
    ]);
    for (const q of generated) {
      expect(allowed.has(q.topic)).toBe(true);
    }
  });
});
