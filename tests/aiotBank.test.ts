import { describe, expect, it } from "vitest";
import { getQuestions } from "../src/data";
import { isTopicClassified } from "../src/domain/assessmentTopics";

const questions = getQuestions("aiot-junior-basics");

describe("AIoT 考科一題庫", () => {
  it("共 80 題，id 不重複", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map((q) => q.id)).size).toBe(80);
  });

  it("每題四個非空選項、答案在 A–D、詳解非空", () => {
    for (const q of questions) {
      expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
      expect(q.choices.every((c) => c.text.trim().length > 0)).toBe(true);
      expect(["A", "B", "C", "D"]).toContain(q.answer);
      expect(q.explanation.trim().length).toBeGreaterThan(0);
    }
  });

  // 官方學習指引 PDF 第 22 頁的第 4 題把四個選項誤植為解析文字，等同印出答案。
  // 勘誤在 parse-core 的 applyStudyGuideErrata，重跑解析不會失效。
  it("選項文字不得殘留解析用語", () => {
    for (const q of questions) {
      for (const c of q.choices) {
        expect(c.text).not.toMatch(/^(正確|錯誤)[。．]/);
      }
    }
  });

  it("九個節點的題數符合官方評鑑內容", () => {
    const counts: Record<string, number> = {};
    for (const q of questions) counts[q.topic] = (counts[q.topic] ?? 0) + 1;
    expect(counts).toEqual({
      "A1.1 AI 基礎概念": 5,
      "A1.2 AIoT 應用案例": 5,
      "A2.1 物聯網架構與功能": 10,
      "A2.2 常見通訊協定與網路層技術": 10,
      "A2.3 工業通訊標準與資訊模型": 10,
      "A2.4 中介軟體與平台": 10,
      "A2.5 資安與隱私基本概念": 10,
      "A3.1 感測技術基礎": 10,
      "A3.2 感測訊號與通訊基礎": 10,
    });
    expect(questions.every((q) => isTopicClassified(q.topic))).toBe(true);
  });

  it("全數標記為官方學習指引來源", () => {
    expect(questions.every((q) => q.source === "study-guide")).toBe(true);
  });
});
