import { describe, it, expect } from "vitest";
import { practiceTopics, practiceTotal, topicLabel } from "../src/domain/assessmentTopics";

describe("評鑑內容主題目錄", () => {
  it("初級兩科各配置 100 題", () => {
    expect(practiceTotal("junior-ai-basics")).toBe(100);
    expect(practiceTotal("junior-genai")).toBe(100);
  });

  it("junior-ai-basics 有 9 個評鑑內容節點", () => {
    expect(practiceTopics["junior-ai-basics"]).toHaveLength(9);
  });

  it("junior-genai 有 7 個評鑑內容節點", () => {
    expect(practiceTopics["junior-genai"]).toHaveLength(7);
  });

  it("代碼格式為 L + 五位數字且不重複", () => {
    const codes = Object.values(practiceTopics).flat().map((t) => t.code);
    for (const code of codes) expect(code).toMatch(/^L\d{5}$/);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("每個節點題數為正整數", () => {
    for (const topic of Object.values(practiceTopics).flat()) {
      expect(Number.isInteger(topic.count)).toBe(true);
      expect(topic.count).toBeGreaterThan(0);
    }
  });

  it("topicLabel 組出「代碼 名稱」", () => {
    expect(topicLabel({ code: "L11101", name: "AI 的定義與分類", count: 11 }))
      .toBe("L11101 AI 的定義與分類");
  });
});
