import type { Question } from "../types";
import { practiceQuestions as juniorAiBasics } from "./junior-ai-basics";
import { practiceQuestions as juniorGenai } from "./junior-genai";
import { practiceQuestions as seniorAiTech } from "./senior-ai-tech";
import { practiceQuestions as seniorBigdata } from "./senior-bigdata";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
  "senior-ai-tech": seniorAiTech,
  "senior-bigdata": seniorBigdata,
};

/** banks registry 涵蓋的科目清單，供測試等處推導，避免各處各自硬編一份、日後加科目卻漏改。 */
export const practiceSubjectIds: string[] = Object.keys(banks);

/** 新題庫（依評鑑內容分類）。與 src/data/index.ts 的原題庫完全獨立。 */
export const getPracticeQuestions = (subjectId: string): Question[] => banks[subjectId] ?? [];

export const getPracticeStats = (
  subjectId: string,
): { total: number; byTopic: Record<string, number> } => {
  const questions = getPracticeQuestions(subjectId);
  const byTopic: Record<string, number> = {};
  for (const question of questions) {
    byTopic[question.topic] = (byTopic[question.topic] ?? 0) + 1;
  }
  return { total: questions.length, byTopic };
};
