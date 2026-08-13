import { describe, it, expect } from "vitest";
import {
  restoreDrill, parseJumpTarget, drillMatches, filteredDrillIndices, drillFilterTarget,
  practiceProgressKey,
} from "../src/domain/drill";
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
    expect(restoreDrill(bank, undefined)).toEqual({ index: 0, answers: {} });
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
