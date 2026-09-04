import { describe, it, expect } from "vitest";
import {
  archetypeStats, buildDiagnostics, cognitiveLevelStats, errorLibrary, errorTypeStats,
  hasQuestionMeta,
} from "../src/domain/diagnostics";
import { getPracticeQuestions } from "../src/data/practice";
import { getQuestions } from "../src/data/index";
import type { ChoiceId, DistractorType, Question, QuestionMeta } from "../src/data/types";

const meta = (over: Partial<QuestionMeta> = {}): QuestionMeta => ({
  cognitiveLevel: "L2",
  archetype: "Comparison",
  concepts: ["c"],
  distractorTypes: { A: "Neighbor Concept", B: "Partial Truth", C: "Wrong Trade-off" },
  ...over,
});

const q = (id: string, answer: ChoiceId, questionMeta?: QuestionMeta): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" },
    { id: "C", text: "c" }, { id: "D", text: "d" },
  ],
  answer, explanation: "", topic: "L11101 甲", difficulty: "中", source: "generated",
  meta: questionMeta,
});

describe("hasQuestionMeta", () => {
  it("空題庫為 false", () => {
    expect(hasQuestionMeta([])).toBe(false);
  });
  it("過半數帶 meta 才為 true", () => {
    expect(hasQuestionMeta([q("1", "D", meta()), q("2", "D")])).toBe(false);
    expect(hasQuestionMeta([q("1", "D", meta()), q("2", "D", meta()), q("3", "D")])).toBe(true);
  });
});

describe("cognitiveLevelStats", () => {
  const bank = [
    q("1", "D", meta({ cognitiveLevel: "L1" })),
    q("2", "D", meta({ cognitiveLevel: "L3" })),
    q("3", "D", meta({ cognitiveLevel: "L3" })),
    q("4", "D", meta({ cognitiveLevel: "L3" })),
  ];

  it("依 L1→L4 排序，題庫沒有的層級不列", () => {
    expect(cognitiveLevelStats(bank, {}).map((row) => row.key)).toEqual(["L1", "L3"]);
  });

  it("未作答只計入 total，不計 answered", () => {
    const rows = cognitiveLevelStats(bank, { "2": "D", "3": "A" });
    const l3 = rows.find((row) => row.key === "L3")!;
    expect(l3).toMatchObject({ total: 3, answered: 2, correct: 1 });
    expect(rows.find((row) => row.key === "L1")).toMatchObject({ total: 1, answered: 0, correct: 0 });
  });

  it("沒有 meta 的題目完全不進統計", () => {
    expect(cognitiveLevelStats([q("x", "D")], { x: "D" })).toEqual([]);
  });
});

describe("archetypeStats", () => {
  it("依題數多寡排序並帶中文標籤", () => {
    const bank = [
      q("1", "D", meta({ archetype: "Direct Concept" })),
      q("2", "D", meta({ archetype: "Scenario Selection" })),
      q("3", "D", meta({ archetype: "Scenario Selection" })),
    ];
    const rows = archetypeStats(bank, {});
    expect(rows.map((row) => row.label)).toEqual(["情境選型", "直述概念"]);
    expect(rows[0].total).toBe(2);
  });
});

describe("errorTypeStats", () => {
  const bank = [
    q("1", "D", meta()),
    q("2", "D", meta()),
    q("3", "D", meta()),
    q("4", "D", meta()),
  ];

  it("只計答錯的題目，且查的是使用者所選的那個選項", () => {
    // 1、2 選 A（相鄰概念）；3 選 B（只對一半）；4 答對，不計。
    const rows = errorTypeStats(bank, { "1": "A", "2": "A", "3": "B", "4": "D" });
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ type: "Neighbor Concept", count: 2, label: "相鄰概念" });
    expect(rows[1]).toMatchObject({ type: "Partial Truth", count: 1 });
  });

  it("未作答不算錯", () => {
    expect(errorTypeStats(bank, {})).toEqual([]);
  });

  it("沒有 meta 的錯題跳過，不會壞掉", () => {
    expect(errorTypeStats([q("x", "D")], { x: "A" })).toEqual([]);
  });

  it("每個干擾類型都有含義與下一步，且下一步不是空話", () => {
    for (const [type, entry] of Object.entries(errorLibrary)) {
      expect(entry.label, type).not.toBe("");
      expect(entry.meaning.length, type).toBeGreaterThan(10);
      expect(entry.advice.length, type).toBeGreaterThan(10);
    }
  });
});

describe("buildDiagnostics", () => {
  it("誠實記錄無法分析的錯題數", () => {
    const bank = [q("1", "D", meta()), q("2", "D")];
    const diag = buildDiagnostics(bank, { "1": "A", "2": "A" });
    expect(diag.errors.reduce((n, row) => n + row.count, 0)).toBe(1);
    expect(diag.unclassifiedWrong).toBe(1);
  });
});

describe("與真實題庫的相容性", () => {
  const bank = getPracticeQuestions("aiot-junior-basics");

  it("新題庫的每一題都能被診斷認得（干擾類型鍵覆蓋三個錯誤選項）", () => {
    expect(hasQuestionMeta(bank)).toBe(true);
    // 對每題都刻意選一個錯誤選項，全部都必須能歸類——否則診斷會靜默漏掉錯題。
    const answers: Record<string, ChoiceId> = {};
    for (const question of bank) {
      const wrong = question.choices.find((choice) => choice.id !== question.answer)!;
      answers[question.id] = wrong.id;
    }
    const diag = buildDiagnostics(bank, answers);
    expect(diag.unclassifiedWrong).toBe(0);
    expect(diag.errors.reduce((n, row) => n + row.count, 0)).toBe(bank.length);
  });

  it("干擾類型不會出現 errorLibrary 沒有涵蓋的值", () => {
    const known = new Set(Object.keys(errorLibrary) as DistractorType[]);
    for (const question of bank) {
      for (const type of Object.values(question.meta!.distractorTypes)) {
        expect(known.has(type as DistractorType), type as string).toBe(true);
      }
    }
  });

  it("原題庫尚未回填 meta，診斷入口因此不對它顯示", () => {
    // 這條是刻意的現況記錄：原題庫補上 meta 後應改為 true，屆時本測試會提醒更新。
    expect(hasQuestionMeta(getQuestions("junior-ai-basics"))).toBe(false);
  });
});
