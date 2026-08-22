import { describe, it, expect } from "vitest";
import {
  isTopicClassified,
  practiceTopics,
  practiceTotal,
  topicLabel,
} from "../src/domain/assessmentTopics";

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

  // 兩張證照的節點編碼體系不同：AI 應用規劃師用 L + 五位數字（L11101），AIoT 應用工程師
  // 的簡章用「考科字母 + 主題.內容」（A1.1 / B2.3）。isTopicClassified 是唯一的判斷入口，
  // 這裡直接沿用它，避免測試自帶第二份規則而與 render.ts 的徽章判斷漂移。
  it("代碼符合所屬證照的編碼格式且不重複", () => {
    const codes = Object.values(practiceTopics).flat().map((t) => t.code);
    for (const code of codes) {
      expect(/^L\d{5}$/.test(code) || /^[AB]\d\.\d$/.test(code), code).toBe(true);
      expect(isTopicClassified(`${code} x`), code).toBe(true);
    }
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
