import { glossary } from "./glossary";
import type { GlossaryEntry } from "./glossary";

export type { GlossaryEntry } from "./glossary";

/** 去除括號（全形／半形）內英文註解與所有空白，取得中文名詞 */
export const normalizeChoiceTerm = (text: string): string =>
  text
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[\s　]/g, "")
    .trim();

export const glossaryPurpose = (choiceText: string): GlossaryEntry | undefined =>
  glossary[normalizeChoiceTerm(choiceText)];

export const composeGlossaryAnalysis = (args: {
  choiceText: string;
  choiceId: string;
  isCorrect: boolean;
  correctText: string;
}): string | undefined => {
  const entry = glossaryPurpose(args.choiceText);
  if (!entry) return undefined;
  const term = normalizeChoiceTerm(args.choiceText);
  const [ex1, ex2] = entry.examples;
  if (args.isCorrect) {
    return `${term}：${entry.purpose}（例如：${ex1}、${ex2}）—— 這是本題正解。`;
  }
  const correctTerm = normalizeChoiceTerm(args.correctText);
  return `${term}：${entry.purpose}（例如：${ex1}、${ex2}）。本題情境指向「${correctTerm}」，故不選 ${args.choiceId}。`;
};
