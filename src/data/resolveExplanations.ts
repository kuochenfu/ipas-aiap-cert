import type { Question } from "./types";
import type { QuestionExplanation } from "./explanations/types";

/**
 * 把手寫的詳解與錯誤選項解析套到真題上。
 * 找不到手寫內容時保留題目自帶的 explanation（學習指引例題的解析即由此而來）。
 */
export const resolvePastExamExplanations = (
  past: Question[],
  explanations: Record<string, QuestionExplanation>,
): Question[] =>
  past.map((q) => {
    const entry = explanations[q.id];
    if (!entry) return q;
    const explanation = entry.explanation.trim().length > 0 ? entry.explanation : q.explanation;
    const hasChoices = Object.keys(entry.choices).length > 0;
    return hasChoices ? { ...q, explanation, choiceExplanations: entry.choices } : { ...q, explanation };
  });
