import { describe, it, expect } from "vitest";
import { THIN_EXPLANATION_CHARS, assessReviewRisk, rankByReviewRisk } from "../src/domain/reviewRisk";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { getPracticeQuestions } from "../src/data/practice";
import type { Question, QuestionMeta } from "../src/data/types";

const longExplanation = "這是一段夠長的詳解".repeat(8);

const q = (over: Partial<Question> = {}): Question => ({
  id: "q1", subjectId: "s", prompt: "關於召回率（Recall），下列敘述何者正確？",
  choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" },
    { id: "C", text: "c" }, { id: "D", text: "d" },
  ],
  answer: "A", explanation: longExplanation, topic: "L11101 甲", difficulty: "中",
  source: "past-exam", sourceRef: "115年第一次 第1題",
  choiceExplanations: { B: "b 錯", C: "c 錯", D: "d 錯" },
  ...over,
});

const meta = (over: Partial<QuestionMeta> = {}): QuestionMeta => ({
  cognitiveLevel: "L2", archetype: "Comparison", ...over,
});

describe("assessReviewRisk", () => {
  it("有官方答案鍵、詳解完整、對得上概念的真題為 0 分", () => {
    expect(assessReviewRisk(q()).score).toBe(0);
  });

  it("官方學習指引的練習評量同樣視為有答案鍵", () => {
    expect(assessReviewRisk(q({ source: "study-guide" })).score).toBe(0);
  });

  it("LLM 命製是基準風險", () => {
    const out = assessReviewRisk(q({ source: "generated" }));
    expect(out.factors.map((factor) => factor.code)).toContain("no-official-key");
    expect(out.score).toBe(4);
  });

  it("連粗略出處都沒有時再加重", () => {
    const out = assessReviewRisk(q({ source: "generated", sourceRef: undefined }));
    expect(out.factors.map((factor) => factor.code)).toContain("no-source-ref");
    expect(out.score).toBe(6);
  });

  it("計算題是最重的單一因子——算錯不會被任何測試攔下", () => {
    const out = assessReviewRisk(q({ meta: meta({ archetype: "Calculation" }) }));
    expect(out.factors.map((factor) => factor.code)).toEqual(["calculation"]);
    expect(out.score).toBe(3);
  });

  it("詳解過短會被標記", () => {
    const out = assessReviewRisk(q({ explanation: "太短" }));
    expect(out.factors.map((factor) => factor.code)).toContain("thin-explanation");
    expect(THIN_EXPLANATION_CHARS).toBeGreaterThan(0);
  });

  it("對不上任何受控概念會被標記", () => {
    const out = assessReviewRisk(q({ prompt: "以下敘述何者為真？" }));
    expect(out.factors.map((factor) => factor.code)).toContain("no-concept");
  });

  it("官方真題不因缺選項解析被加分——中級三科本來就沒有手寫選項解析", () => {
    const out = assessReviewRisk(q({ choiceExplanations: undefined }));
    expect(out.factors.map((factor) => factor.code)).not.toContain("missing-choice-explanations");
  });

  it("自編題缺選項解析才加分", () => {
    const out = assessReviewRisk(q({ source: "generated", choiceExplanations: { B: "x" } }));
    expect(out.factors.map((factor) => factor.code)).toContain("missing-choice-explanations");
  });

  it("近重複清單內的題目會被標記", () => {
    const out = assessReviewRisk(q(), { nearDuplicateIds: new Set(["q1"]) });
    expect(out.factors.map((factor) => factor.code)).toContain("near-duplicate");
  });

  it("分數等於各因子權重之和", () => {
    const out = assessReviewRisk(q({
      source: "generated", sourceRef: undefined, explanation: "短",
      choiceExplanations: undefined,
      meta: meta({ cognitiveLevel: "L4", archetype: "Calculation", crossNode: "L11102" }),
    }));
    expect(out.score).toBe(out.factors.reduce((total, factor) => total + factor.weight, 0));
    expect(out.score).toBeGreaterThanOrEqual(12);
  });
});

describe("rankByReviewRisk", () => {
  it("分數高的排前面，同分依 id 排序（報表才穩定）", () => {
    const ranked = rankByReviewRisk([
      q({ id: "b", source: "generated" }),
      q({ id: "a", source: "generated" }),
      q({ id: "c" }),
    ]);
    expect(ranked.map((item) => item.questionId)).toEqual(["a", "b", "c"]);
  });
});

describe("與真實題庫", () => {
  const all = subjects.flatMap((subject) => [
    ...getQuestions(subject.id),
    ...getPracticeQuestions(subject.id),
  ]);

  it("官方來源的題目多數為低分——若不是，代表因子權重失衡", () => {
    const official = all.filter((question) => question.source !== "generated");
    const zero = official.filter((question) => assessReviewRisk(question).score === 0).length;
    expect(zero / official.length).toBeGreaterThan(0.6);
  });

  it("每一題 LLM 命製的題目至少有基準分", () => {
    for (const question of all.filter((item) => item.source === "generated")) {
      expect(assessReviewRisk(question).score, question.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("高分題目是少數——排序才有意義", () => {
    const actionable = all.filter((question) => assessReviewRisk(question).score >= 7).length;
    expect(actionable / all.length).toBeLessThan(0.15);
  });
});
