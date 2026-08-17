import { describe, it, expect } from "vitest";
import { examRules, isCorrect, scoreExam, topicSummary, topicStats } from "../src/domain/exam";
import type { Question } from "../src/data/types";

const q = (id: string, answer: "A" | "B" | "C" | "D", topic = "T1"): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" },
    { id: "C", text: "c" }, { id: "D", text: "d" },
  ],
  answer, explanation: "", topic, difficulty: "中", source: "past-exam",
});

describe("examRules", () => {
  it("每題2分、滿分100、70及格、最多錯15", () => {
    expect(examRules.totalQuestions).toBe(50);
    expect(examRules.pointsPerQuestion).toBe(2);
    expect(examRules.passScore).toBe(70);
    expect(examRules.maxWrongToPass).toBe(15);
  });
});

describe("isCorrect", () => {
  it("選對為真、選錯或未作答為假", () => {
    expect(isCorrect(q("1", "A"), "A")).toBe(true);
    expect(isCorrect(q("1", "A"), "B")).toBe(false);
    expect(isCorrect(q("1", "A"), undefined)).toBe(false);
  });
});

describe("scoreExam", () => {
  it("計算分數、對錯數、是否及格、錯題id", () => {
    const questions = [q("1", "A"), q("2", "B"), q("3", "C")];
    const answers = { "1": "A" as const, "2": "D" as const };
    const report = scoreExam(questions, answers);
    expect(report.correct).toBe(1);
    expect(report.wrong).toBe(2);
    expect(report.score).toBe(2);
    expect(report.passed).toBe(false);
    expect(report.missedQuestionIds).toEqual(["2", "3"]);
  });
});

describe("topicSummary", () => {
  it("依主題彙總答對率", () => {
    const questions = [q("1", "A", "T1"), q("2", "B", "T1"), q("3", "C", "T2")];
    const answers = { "1": "A" as const, "2": "X" as unknown as "A", "3": "C" as const };
    const rows = topicSummary(questions, answers);
    const t1 = rows.find((r) => r.topic === "T1")!;
    expect(t1.total).toBe(2);
    expect(t1.correct).toBe(1);
  });
});

describe("topicStats（刷題的節點統計）", () => {
  const q = (id: string, topic: string): Question => ({
    id, subjectId: "s", prompt: "p",
    choices: [{ id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
    answer: "A", explanation: "", topic, difficulty: "中", source: "past-exam",
  });
  const bank = [
    q("q1", "L23101 甲"), q("q2", "L23101 甲"), q("q3", "L23101 甲"),
    q("q4", "L23102 乙"), q("q5", "L23102 乙"),
  ];

  it("分別計算總題數、已作答數與答對數", () => {
    // q1 答對、q2 答錯、q3 未答；q4 答對、q5 未答
    const rows = topicStats(bank, { q1: "A", q2: "B", q4: "A" });
    expect(rows).toEqual([
      { topic: "L23101 甲", total: 3, answered: 2, correct: 1 },
      { topic: "L23102 乙", total: 2, answered: 1, correct: 1 },
    ]);
  });

  it("完全未作答時 answered 與 correct 皆為 0，total 仍為題數", () => {
    expect(topicStats(bank, {})).toEqual([
      { topic: "L23101 甲", total: 3, answered: 0, correct: 0 },
      { topic: "L23102 乙", total: 2, answered: 0, correct: 0 },
    ]);
  });

  it("依節點碼排序，讓同一科目每次的呈現順序固定", () => {
    const shuffled = [q("q9", "L23102 乙"), q("q8", "L23101 甲")];
    expect(topicStats(shuffled, {}).map((r) => r.topic)).toEqual(["L23101 甲", "L23102 乙"]);
  });
});
