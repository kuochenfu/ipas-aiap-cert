import type { Question } from "./types";
import { questions as juniorAiBasics } from "./junior-ai-basics";
import { questions as juniorGenai } from "./junior-genai";
import { questions as seniorAiTech } from "./senior-ai-tech";
import { questions as seniorBigdata } from "./senior-bigdata";
import { questions as seniorMl } from "./senior-ml";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
  "senior-ai-tech": seniorAiTech,
  "senior-bigdata": seniorBigdata,
  "senior-ml": seniorMl,
};

export const getQuestions = (subjectId: string): Question[] => banks[subjectId] ?? [];

export const getBankStats = (subjectId: string) => {
  const list = getQuestions(subjectId);
  return {
    total: list.length,
    pastExam: list.filter((q) => q.source === "past-exam").length,
    generated: list.filter((q) => q.source === "generated").length,
  };
};
