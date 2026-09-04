import { describe, it, expect } from "vitest";
import {
  restoreDrill, parseJumpTarget, drillMatches, filteredDrillIndices, drillFilterTarget,
  practiceProgressKey, recordAnswer,
} from "../src/domain/drill";
import type { AnswerRecord, AnswerRecords } from "../src/domain/drill";
import type { Question } from "../src/data/types";
import type { AnswerState } from "../src/domain/exam";

const q = (id: string): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [{ id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
  answer: "A", explanation: "", topic: "未分類", difficulty: "中", source: "past-exam",
});
const bank = [q("q1"), q("q2"), q("q3")];

// 四題題庫，正解一律 A：q1 答錯、q2 答對、q3 與 q4 未答。
const wide = [q("q1"), q("q2"), q("q3"), q("q4")];
const mixed: AnswerState = { q1: "B", q2: "A" };

describe("restoreDrill", () => {
  it("沒有進度時回到第一題、無作答", () => {
    expect(restoreDrill(bank, undefined)).toEqual({ index: 0, answers: {}, records: {} });
  });
  it("依 questionId 還原索引與作答", () => {
    const out = restoreDrill(bank, { questionId: "q3", answers: { q1: "B" } });
    expect(out.index).toBe(2);
    expect(out.answers).toEqual({ q1: "B" });
  });
  it("questionId 已不在題庫時回到第一題（題庫變動容錯）", () => {
    const out = restoreDrill(bank, { questionId: "removed", answers: { q2: "C" } });
    expect(out.index).toBe(0);
    expect(out.answers).toEqual({ q2: "C" });
  });
  it("過濾掉不存在於題庫的作答 id", () => {
    const out = restoreDrill(bank, { questionId: "q1", answers: { q1: "A", gone: "D" } });
    expect(out.answers).toEqual({ q1: "A" });
  });
});

describe("practiceProgressKey", () => {
  it("回傳科目 id 加上 :practice 後綴", () => {
    expect(practiceProgressKey("junior-ai-basics")).toBe("junior-ai-basics:practice");
  });
  it("與原本的科目 id 不同（新題庫進度與原刷題進度需隔離）", () => {
    const subjectId = "junior-ai-basics";
    expect(practiceProgressKey(subjectId)).not.toBe(subjectId);
  });
});

describe("parseJumpTarget", () => {
  it("合法題號轉為 0-based 索引", () => {
    expect(parseJumpTarget("1", 222)).toBe(0);
    expect(parseJumpTarget("137", 222)).toBe(136);
    expect(parseJumpTarget(" 222 ", 222)).toBe(221);
  });
  it("超出範圍回 null", () => {
    expect(parseJumpTarget("0", 222)).toBeNull();
    expect(parseJumpTarget("223", 222)).toBeNull();
    expect(parseJumpTarget("-3", 222)).toBeNull();
  });
  it("非整數或空白回 null", () => {
    expect(parseJumpTarget("", 222)).toBeNull();
    expect(parseJumpTarget("abc", 222)).toBeNull();
    expect(parseJumpTarget("1.5", 222)).toBeNull();
    expect(parseJumpTarget("1e2", 222)).toBeNull();
  });
});

describe("drillMatches", () => {
  it("all 一律符合", () => {
    expect(drillMatches(wide[0], mixed, "all")).toBe(true);
    expect(drillMatches(wide[2], mixed, "all")).toBe(true);
  });
  it("unanswered 只符合未作答的題目", () => {
    expect(drillMatches(wide[2], mixed, "unanswered")).toBe(true);
    expect(drillMatches(wide[0], mixed, "unanswered")).toBe(false);
    expect(drillMatches(wide[1], mixed, "unanswered")).toBe(false);
  });
  it("wrong 只符合已作答且答錯的題目", () => {
    expect(drillMatches(wide[0], mixed, "wrong")).toBe(true);
    expect(drillMatches(wide[1], mixed, "wrong")).toBe(false);
    expect(drillMatches(wide[2], mixed, "wrong")).toBe(false);
  });

  // 錯題本（模擬考交卷寫入的錯題）是「錯題」篩選的第二個來源。
  describe("併入錯題本", () => {
    it("未在刷題作答、但在錯題本裡的題目算錯題", () => {
      expect(drillMatches(wide[2], mixed, "wrong", { missed: new Set(["q3"]) })).toBe(true);
    });
    it("刷題已答對的題目，即使在錯題本裡也不算錯題（提供消掉的途徑）", () => {
      expect(drillMatches(wide[1], mixed, "wrong", { missed: new Set(["q2"]) })).toBe(false);
    });
    it("刷題已答錯的題目，不在錯題本裡也仍算錯題", () => {
      expect(drillMatches(wide[0], mixed, "wrong", { missed: new Set() })).toBe(true);
    });
    it("錯題本不影響 all 與 unanswered", () => {
      expect(drillMatches(wide[2], mixed, "unanswered", { missed: new Set(["q3"]) })).toBe(true);
      expect(drillMatches(wide[1], mixed, "unanswered", { missed: new Set(["q2"]) })).toBe(false);
      expect(drillMatches(wide[1], mixed, "all", { missed: new Set() })).toBe(true);
    });
    it("未傳錯題本時行為與從前相同", () => {
      expect(drillMatches(wide[2], mixed, "wrong")).toBe(false);
    });
  });
});

describe("filteredDrillIndices", () => {
  it("回傳符合篩選的索引", () => {
    expect(filteredDrillIndices(wide, mixed, "all")).toEqual([0, 1, 2, 3]);
    expect(filteredDrillIndices(wide, mixed, "wrong")).toEqual([0]);
    expect(filteredDrillIndices(wide, mixed, "unanswered")).toEqual([2, 3]);
  });
  it("沒有題目符合時回空陣列", () => {
    expect(filteredDrillIndices(wide, {}, "wrong")).toEqual([]);
  });
  it("錯題本的題目會併進 wrong 的索引，且維持題庫原序", () => {
    expect(filteredDrillIndices(wide, mixed, "wrong", { missed: new Set(["q3", "q4"]) })).toEqual([0, 2, 3]);
  });
  it("完全沒作答時，wrong 等同於錯題本內容", () => {
    expect(filteredDrillIndices(wide, {}, "wrong", { missed: new Set(["q2", "q4"]) })).toEqual([1, 3]);
  });
});

describe("drillFilterTarget", () => {
  it("目前這題仍符合新篩選時留在原地", () => {
    // 停在 q3（未答），切到 unanswered：q3 本身符合，不應跳到第一筆未答
    expect(drillFilterTarget(wide, mixed, 2, "unanswered")).toEqual({ index: 2, empty: false });
  });
  it("切回 all 一律留在原地", () => {
    expect(drillFilterTarget(wide, mixed, 3, "all")).toEqual({ index: 3, empty: false });
  });
  it("目前這題不符合新篩選時跳到第一筆符合的題目", () => {
    // 停在 q3（未答），切到 wrong：只有 q1 答錯
    expect(drillFilterTarget(wide, mixed, 2, "wrong")).toEqual({ index: 0, empty: false });
  });
  it("沒有任何題目符合時回索引 0 並標記為空", () => {
    expect(drillFilterTarget(wide, {}, 2, "wrong")).toEqual({ index: 0, empty: true });
  });
  it("目前索引超出範圍時視為不符合，改跳第一筆符合的題目", () => {
    expect(drillFilterTarget(wide, mixed, 99, "wrong")).toEqual({ index: 0, empty: false });
    expect(drillFilterTarget(wide, mixed, -1, "unanswered")).toEqual({ index: 2, empty: false });
  });
  it("題庫為空時回索引 0 並標記為空", () => {
    expect(drillFilterTarget([], {}, 0, "all")).toEqual({ index: 0, empty: true });
  });
});

describe("recordAnswer（作答歷程）", () => {
  const NOW = 1_800_000_000_000;

  it("首次作答建立紀錄", () => {
    expect(recordAnswer(undefined, "B", false, NOW)).toEqual({
      choice: "B", firstAt: NOW, lastAt: NOW, attempts: 1, wrongCount: 1, confidence: undefined,
    });
  });
  it("再次作答保留首次時間、累加次數", () => {
    const first = recordAnswer(undefined, "B", false, NOW);
    const second = recordAnswer(first, "A", true, NOW + 1000);
    expect(second).toMatchObject({
      choice: "A", firstAt: NOW, lastAt: NOW + 1000, attempts: 2, wrongCount: 1,
    });
  });
  it("信心以本次為準，不沿用上一次", () => {
    const first = recordAnswer(undefined, "A", true, NOW, "sure");
    expect(recordAnswer(first, "A", true, NOW + 1000).confidence).toBeUndefined();
  });
});

describe("restoreDrill（作答歷程）", () => {
  const NOW = 1_800_000_000_000;
  const record = (id: string): AnswerRecord =>
    ({ choice: "A", firstAt: NOW, lastAt: NOW, attempts: 1, wrongCount: 0 });

  it("還原歷程，並丟掉已不在題庫的題目", () => {
    const records: AnswerRecords = { q1: record("q1"), removed: record("removed") };
    const out = restoreDrill(bank, { questionId: "q2", answers: { q1: "A" }, records });
    expect(Object.keys(out.records)).toEqual(["q1"]);
  });
  it("舊格式（沒有 records 欄位）回空物件，其餘行為不變", () => {
    const out = restoreDrill(bank, { questionId: "q2", answers: { q1: "A" } });
    expect(out).toEqual({ index: 1, answers: { q1: "A" }, records: {} });
  });
});

describe("推薦篩選", () => {
  const NOW = 1_800_000_000_000;
  const DAY = 24 * 60 * 60 * 1000;
  // wide 的正解一律 A：q1 答錯、q2 答對、q3/q4 未答。
  const records: AnswerRecords = {
    q1: { choice: "B", firstAt: NOW - DAY, lastAt: NOW - DAY, attempts: 1, wrongCount: 1 },
    q2: { choice: "A", firstAt: NOW, lastAt: NOW, attempts: 1, wrongCount: 0 },
  };

  it("收進錯題與未作答，排除剛答對的題目", () => {
    const indices = filteredDrillIndices(wide, mixed, "recommended", { records, now: NOW });
    expect(indices).toContain(0);
    expect(indices).not.toContain(1);
    expect(indices).toEqual([0, 2, 3]);
  });

  it("答對的題目過了間隔會重新出現", () => {
    const stale: AnswerRecords = {
      ...records,
      q2: { choice: "A", firstAt: NOW - 9 * DAY, lastAt: NOW - 9 * DAY, attempts: 1, wrongCount: 0 },
    };
    expect(filteredDrillIndices(wide, mixed, "recommended", { records: stale, now: NOW }))
      .toContain(1);
  });

  it("切到推薦一律跳到排序第一題，不留在原地", () => {
    // 目前停在 index 2（未作答，符合推薦），但排序第一的是答錯的 q1。
    expect(drillFilterTarget(wide, mixed, 2, "recommended", { records, now: NOW }))
      .toEqual({ index: 0, empty: false });
  });

  it("沒有任何題目可推薦時回報空狀態", () => {
    const done: AnswerRecords = {
      q1: { choice: "A", firstAt: NOW, lastAt: NOW, attempts: 1, wrongCount: 0 },
    };
    expect(drillFilterTarget([wide[0]], { q1: "A" }, 0, "recommended", { records: done, now: NOW }))
      .toEqual({ index: 0, empty: true });
  });
});
