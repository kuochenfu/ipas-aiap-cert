// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { loadDrillProgress, saveDrillProgress, clearDrillProgress } from "../src/state/drillProgress";

const KEY = "ipas-aiap-drill-progress";

beforeEach(() => localStorage.clear());

describe("刷題進度儲存", () => {
  it("存取往返", () => {
    saveDrillProgress("junior-ai-basics", { questionId: "q3", answers: { q1: "B" } });
    expect(loadDrillProgress("junior-ai-basics"))
      .toEqual({ questionId: "q3", answers: { q1: "B" }, records: {} });
  });
  it("各科目彼此獨立", () => {
    saveDrillProgress("junior-ai-basics", { questionId: "a1", answers: {} });
    saveDrillProgress("junior-genai", { questionId: "b1", answers: {} });
    expect(loadDrillProgress("junior-ai-basics")?.questionId).toBe("a1");
    expect(loadDrillProgress("junior-genai")?.questionId).toBe("b1");
  });
  it("沒有紀錄時回 undefined", () => {
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("清除只影響指定科目", () => {
    saveDrillProgress("junior-ai-basics", { questionId: "a1", answers: {} });
    saveDrillProgress("junior-genai", { questionId: "b1", answers: {} });
    clearDrillProgress("junior-ai-basics");
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
    expect(loadDrillProgress("junior-genai")?.questionId).toBe("b1");
  });
  it("不動到錯題本的 key", () => {
    localStorage.setItem("ipas-aiap-misses", JSON.stringify(["q1"]));
    saveDrillProgress("junior-ai-basics", { questionId: "a1", answers: {} });
    clearDrillProgress("junior-ai-basics");
    expect(localStorage.getItem("ipas-aiap-misses")).toBe(JSON.stringify(["q1"]));
  });
});

describe("刷題進度容錯", () => {
  it("損壞的 JSON 回 undefined", () => {
    localStorage.setItem(KEY, "{not json");
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("頂層不是物件時回 undefined", () => {
    localStorage.setItem(KEY, JSON.stringify(["a"]));
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("缺少 questionId 的紀錄被丟棄", () => {
    localStorage.setItem(KEY, JSON.stringify({ "junior-ai-basics": { answers: {} } }));
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("非 A–D 的選項值被過濾", () => {
    localStorage.setItem(KEY, JSON.stringify({
      "junior-ai-basics": { questionId: "q1", answers: { q1: "A", q2: "Z", q3: 5 } },
    }));
    expect(loadDrillProgress("junior-ai-basics"))
      .toEqual({ questionId: "q1", answers: { q1: "A" }, records: {} });
  });
});

describe("作答歷程的持久化", () => {
  const NOW = 1_800_000_000_000;
  const record = { choice: "A" as const, firstAt: NOW, lastAt: NOW, attempts: 2, wrongCount: 1 };

  it("歷程隨進度一起存取", () => {
    saveDrillProgress("junior-ai-basics", {
      questionId: "q1", answers: { q1: "A" }, records: { q1: { ...record, confidence: "sure" } },
    });
    expect(loadDrillProgress("junior-ai-basics")?.records).toEqual({
      q1: { ...record, confidence: "sure" },
    });
  });

  it("舊格式（沒有 records）讀回來是空物件，作答與位置不受影響", () => {
    localStorage.setItem(KEY, JSON.stringify({
      "junior-ai-basics": { questionId: "q9", answers: { q9: "C" } },
    }));
    expect(loadDrillProgress("junior-ai-basics"))
      .toEqual({ questionId: "q9", answers: { q9: "C" }, records: {} });
  });

  it("壞掉的單筆歷程被丟棄，其餘保留——不讓一筆壞資料清空整科進度", () => {
    localStorage.setItem(KEY, JSON.stringify({
      "junior-ai-basics": {
        questionId: "q1",
        answers: { q1: "A" },
        records: {
          good: record,
          badChoice: { ...record, choice: "Z" },
          badTime: { ...record, lastAt: "昨天" },
          badConfidence: { ...record, confidence: "maybe" },
          notObject: 5,
        },
      },
    }));
    expect(Object.keys(loadDrillProgress("junior-ai-basics")!.records!)).toEqual(["good"]);
  });

  it("records 不是物件時整包忽略", () => {
    localStorage.setItem(KEY, JSON.stringify({
      "junior-ai-basics": { questionId: "q1", answers: {}, records: ["x"] },
    }));
    expect(loadDrillProgress("junior-ai-basics")?.records).toEqual({});
  });
});
