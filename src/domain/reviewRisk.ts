import type { Question } from "../data/types";
import { conceptsOf } from "./concepts";

/**
 * 人工複審的風險排序。
 *
 * ## 問題
 *
 * 全站 1,972 題裡有 **1,113 題是 LLM 命製、未經人工事實查核**（見 auto-memory 的待複審清單）。
 * 「逐題硬掃」不會發生——太多了。但這些題目的風險並不均勻：一題背定義的選擇題答錯的
 * 機會，遠低於一題要算出「限流電阻應為多少歐姆」的計算題。
 *
 * ## 作法
 *
 * 用**已經存在的可觀察訊號**替每題打一個風險分數，把「1,113 題待複審」轉成
 * 「先看這 N 題」。分數不是品質判斷，是**該優先查證的程度**：
 *
 * - 有官方答案鍵的題目（真題、官方學習指引練習評量）風險最低——錯的話是官方錯。
 * - 計算題最高：算錯是靜默的，型別檢查、格式測試、分布契約全都攔不到。
 * - 詳解過短、對不上任何受控概念、缺選項解析，都代表當初寫得比較草率。
 *
 * 每一個因子都必須是**可從資料算出來的**，不能是「感覺這題怪怪的」。
 */

export type RiskFactor = {
  code: string;
  label: string;
  weight: number;
};

export type RiskAssessment = {
  questionId: string;
  subjectId: string;
  score: number;
  factors: RiskFactor[];
};

/** 詳解短於這個字數就視為寫得草率。取 60 字是因為全庫詳解的中位數遠高於此。 */
export const THIN_EXPLANATION_CHARS = 60;

export type RiskContext = {
  /** 已知的近重複題 id（見 `tests/duplicates.test.ts` 的清單）。 */
  nearDuplicateIds?: ReadonlySet<string>;
};

const officialSources = new Set<Question["source"]>(["past-exam", "study-guide"]);

export const assessReviewRisk = (question: Question, context: RiskContext = {}): RiskAssessment => {
  const factors: RiskFactor[] = [];
  const isOfficial = officialSources.has(question.source);

  if (!isOfficial) {
    factors.push({ code: "no-official-key", label: "無官方答案鍵（LLM 命製）", weight: 4 });
    if (!question.sourceRef) {
      factors.push({ code: "no-source-ref", label: "連粗略的出處都沒有", weight: 2 });
    }
    const choiceCount = Object.keys(question.choiceExplanations ?? {}).length;
    if (choiceCount < 3) {
      factors.push({ code: "missing-choice-explanations", label: "錯誤選項解析不足三條", weight: 1 });
    }
  }

  if (question.meta?.archetype === "Calculation") {
    // 算錯是靜默的：格式、配額、分布的測試全都會放行。
    factors.push({ code: "calculation", label: "計算題（算錯不會被任何測試攔下）", weight: 3 });
  }
  if (question.meta?.cognitiveLevel === "L4") {
    factors.push({ code: "l4", label: "L4 分析題（判準最難唯一）", weight: 1 });
  }
  if (question.meta?.crossNode) {
    factors.push({ code: "cross-node", label: "跨節點題（兩邊都要對）", weight: 1 });
  }
  if (question.explanation.trim().length < THIN_EXPLANATION_CHARS) {
    factors.push({ code: "thin-explanation", label: "詳解過短", weight: 2 });
  }
  if (conceptsOf(question).length === 0) {
    factors.push({ code: "no-concept", label: "對不上任何受控概念", weight: 2 });
  }
  if (context.nearDuplicateIds?.has(question.id)) {
    factors.push({ code: "near-duplicate", label: "與另一題近重複", weight: 2 });
  }

  return {
    questionId: question.id,
    subjectId: question.subjectId,
    score: factors.reduce((total, factor) => total + factor.weight, 0),
    factors,
  };
};

/** 依分數由高到低排序；同分時以 id 排序，讓報表在資料未變時穩定。 */
export const rankByReviewRisk = (
  questions: Question[],
  context: RiskContext = {},
): RiskAssessment[] =>
  questions
    .map((question) => assessReviewRisk(question, context))
    .sort((a, b) => b.score - a.score || a.questionId.localeCompare(b.questionId));
