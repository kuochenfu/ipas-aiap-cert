import { describe, it, expect } from "vitest";
import { restoreDrill, parseJumpTarget } from "../src/domain/drill";
import type { Question } from "../src/data/types";

const q = (id: string): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [{ id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
  answer: "A", explanation: "", topic: "未分類", difficulty: "中", source: "past-exam",
});
const bank = [q("q1"), q("q2"), q("q3")];

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
