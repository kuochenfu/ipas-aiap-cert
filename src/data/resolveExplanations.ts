import type { Question } from "./types";
import type { QuestionExplanation } from "./explanations/types";

/**
 * 把手寫的詳解、錯誤選項解析與圖片轉錄套到真題上。
 * 找不到手寫內容時保留題目自帶的 explanation（學習指引例題的解析即由此而來）。
 */
export const resolvePastExamExplanations = (
  past: Question[],
  explanations: Record<string, QuestionExplanation>,
): Question[] =>
  past.map((q) => {
    const entry = explanations[q.id];
    if (!entry) return q;
    const merged: Question = {
      ...q,
      explanation: entry.explanation.trim().length > 0 ? entry.explanation : q.explanation,
    };
    if (Object.keys(entry.choices).length > 0) merged.choiceExplanations = entry.choices;
    if (entry.topic) merged.topic = entry.topic;
    if (entry.figures?.length) merged.figures = entry.figures;
    if (entry.choiceFigures && Object.keys(entry.choiceFigures).length > 0) {
      merged.choiceFigures = entry.choiceFigures;
      // 手寫轉錄即為該選項的權威內容——只有在原卷把選項印成圖片時才會寫 choiceFigures，
      // 此時 pdftotext 留下的要嘛是空字串（整個選項是圖），要嘛是被圖截斷的殘句
      // （例 senior-ml-114-2-q49 的 (A)「⋯其數學式為 」後面接一張公式圖）。
      // 兩種情況都應以轉錄取代，否則殘句會留在錯題本、搜尋與「正解：」摘要裡。
      merged.choices = q.choices.map((c) => {
        const fig = entry.choiceFigures?.[c.id];
        return fig ? { ...c, text: fig.content } : c;
      });
    }
    return merged;
  });
