import { describe, it, expect } from "vitest";
import { resolvePastExamExplanations } from "../src/data/resolveExplanations";
import type { Question } from "../src/data/types";

const q = (id: string, explanation = ""): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [{ id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
  answer: "A", explanation, topic: "未分類", difficulty: "中", source: "past-exam",
});

describe("resolvePastExamExplanations", () => {
  it("套用手寫詳解與錯誤選項解析", () => {
    const out = resolvePastExamExplanations(
      [q("q1")],
      { q1: { explanation: "手寫詳解", choices: { B: "B 錯在這", C: "C 錯在這", D: "D 錯在這" } } },
    );
    expect(out[0].explanation).toBe("手寫詳解");
    expect(Object.keys(out[0].choiceExplanations ?? {}).sort()).toEqual(["B", "C", "D"]);
  });

  it("沒有手寫內容時原封不動保留題目自帶的詳解", () => {
    const out = resolvePastExamExplanations([q("q1", "題目自帶解析")], {});
    expect(out[0].explanation).toBe("題目自帶解析");
    expect(out[0].choiceExplanations).toBeUndefined();
  });

  it("手寫詳解為空字串時退回題目自帶的詳解", () => {
    const out = resolvePastExamExplanations(
      [q("q1", "題目自帶解析")],
      { q1: { explanation: "", choices: {} } },
    );
    expect(out[0].explanation).toBe("題目自帶解析");
  });
});
