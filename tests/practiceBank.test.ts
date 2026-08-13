import { describe, it, expect } from "vitest";
import { getPracticeQuestions, getPracticeStats } from "../src/data/practice";
import { practiceTopics, topicLabel } from "../src/domain/assessmentTopics";
import type { ChoiceId } from "../src/data/types";

const subjects = ["junior-ai-basics", "junior-genai"];
const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];

describe("新題庫形狀契約", () => {
  it("未知科目回空陣列", () => {
    expect(getPracticeQuestions("nope")).toEqual([]);
  });

  for (const subjectId of subjects) {
    it(`${subjectId}：id 唯一且格式正確`, () => {
      const qs = getPracticeQuestions(subjectId);
      const ids = qs.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(new RegExp(`^${subjectId}-practice-q\\d{3}$`));
    });

    it(`${subjectId}：每題四個選項、答案合法、文字非空`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        expect(q.choices.map((c) => c.id), q.id).toEqual(choiceIds);
        for (const c of q.choices) expect(c.text.trim().length, `${q.id} ${c.id}`).toBeGreaterThan(0);
        expect(choiceIds, q.id).toContain(q.answer);
        expect(q.prompt.trim().length, q.id).toBeGreaterThan(0);
        expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
        expect(q.subjectId, q.id).toBe(subjectId);
        expect(q.source, q.id).toBe("generated");
      }
    });

    it(`${subjectId}：選項解析恰好涵蓋三個錯誤選項`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        const keys = Object.keys(q.choiceExplanations ?? {}).sort();
        const expected = choiceIds.filter((id) => id !== q.answer).sort();
        expect(keys, q.id).toEqual(expected);
        for (const key of keys) {
          expect((q.choiceExplanations as Record<string, string>)[key].trim().length, `${q.id} ${key}`)
            .toBeGreaterThan(0);
        }
      }
    });

    it(`${subjectId}：sourceRef 為五大產業之一`, () => {
      const industries = ["金融", "醫療", "工廠", "教育", "農業"];
      for (const q of getPracticeQuestions(subjectId)) {
        expect(industries, q.id).toContain(q.sourceRef);
      }
    });

    it(`${subjectId}：topic 為合法評鑑內容節點，且各節點不超額`, () => {
      const allowed = new Map(practiceTopics[subjectId].map((t) => [topicLabel(t), t.count]));
      const stats = getPracticeStats(subjectId);
      for (const [label, count] of Object.entries(stats.byTopic)) {
        expect(allowed.has(label), `未知主題：${label}`).toBe(true);
        expect(count, `${label} 超額`).toBeLessThanOrEqual(allowed.get(label)!);
      }
    });
  }
});

describe("junior-ai-basics 節點題數", () => {
  it("L11101 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11101 AI 的定義與分類"]).toBe(11);
  });
  it("L11102 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11102 AI 治理概念"]).toBe(11);
  });
});

describe("原題庫未受影響", () => {
  it("getQuestions 的題數不變", async () => {
    const { getQuestions } = await import("../src/data/index");
    expect(getQuestions("junior-ai-basics")).toHaveLength(222);
    expect(getQuestions("junior-genai")).toHaveLength(213);
  });
});
