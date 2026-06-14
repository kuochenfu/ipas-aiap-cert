import type { Choice, Question } from "./types";

const subjectGuideFocus: Record<string, string> = {
  "junior-ai-basics": "人工智慧基礎概念、資料處理、機器學習與生成式 AI 概念",
  "junior-genai": "No Code / Low Code、生成式 AI 應用與導入規劃",
  "senior-ai-tech": "AI 技術應用、導入評估規劃與系統部署",
  "senior-bigdata": "機率統計、大數據處理分析與 AI 應用",
  "senior-ml": "機器學習基礎、深度學習、建模調校與治理",
};

const choiceText = (choice: Choice | undefined): string => choice?.text.trim() ?? "";

const buildChoiceExplanations = (q: Question): NonNullable<Question["choiceExplanations"]> => {
  const correct = q.choices.find((choice) => choice.id === q.answer);
  const correctText = choiceText(correct);
  const out: NonNullable<Question["choiceExplanations"]> = {};

  for (const choice of q.choices) {
    if (choice.id === q.answer) {
      out[choice.id] = `正解。此選項最符合題幹中的關鍵條件，應判斷為「${correctText}」。`;
      continue;
    }
    out[choice.id] =
      `此選項描述的是「${choice.text}」，較適用於題目明確要求該概念、工具或情境時；本題關鍵條件指向「${correctText}」，因此不選 ${choice.id}。`;
  }

  return out;
};

const buildFallbackExplanation = (q: Question): string => {
  const focus = subjectGuideFocus[q.subjectId] ?? "對應科目的學習指引重點";
  const correct = q.choices.find((choice) => choice.id === q.answer);
  const wrongs = q.choices
    .filter((choice) => choice.id !== q.answer)
    .map((choice) => `${choice.id}「${choice.text}」較像是在問該選項本身代表的概念或應用情境時才適用`)
    .join("；");

  return `依學習指引中「${focus}」相關概念判斷，正解為 ${q.answer}「${choiceText(correct)}」，因為它最貼近題幹要求的任務、限制或判斷標準。${wrongs}；因此本題不選這些選項。`;
};

export const resolvePastExamExplanations = (
  past: Question[],
  explanations: Record<string, string>,
): Question[] =>
  past.map((q) => {
    const explanation = explanations[q.id] ?? q.explanation;
    if (explanation.trim().length > 0) {
      return { ...q, explanation };
    }
    return {
      ...q,
      explanation: buildFallbackExplanation(q),
      choiceExplanations: buildChoiceExplanations(q),
    };
  });
