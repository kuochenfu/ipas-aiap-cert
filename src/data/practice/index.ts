import type { Question } from "../types";
import { practiceQuestions as juniorAiBasics } from "./junior-ai-basics";
import { practiceQuestions as juniorGenai } from "./junior-genai";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
};

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
