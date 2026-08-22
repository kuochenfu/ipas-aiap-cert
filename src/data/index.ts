import type { Question } from "./types";
import { questions as juniorAiBasics } from "./junior-ai-basics";
import { questions as juniorGenai } from "./junior-genai";
import { questions as seniorAiTech } from "./senior-ai-tech";
import { questions as seniorBigdata } from "./senior-bigdata";
import { questions as seniorMl } from "./senior-ml";
import { questions as aiotJuniorBasics } from "./aiot-junior-basics";
import { questions as aiotJuniorIot } from "./aiot-junior-iot";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
  "senior-ai-tech": seniorAiTech,
  "senior-bigdata": seniorBigdata,
  "senior-ml": seniorMl,
  "aiot-junior-basics": aiotJuniorBasics,
  "aiot-junior-iot": aiotJuniorIot,
};

export const getQuestions = (subjectId: string): Question[] => banks[subjectId] ?? [];

export const getBankStats = (subjectId: string) => {
  const list = getQuestions(subjectId);
  return {
    total: list.length,
    pastExam: list.filter((q) => q.source === "past-exam").length,
    generated: list.filter((q) => q.source === "generated").length,
    studyGuide: list.filter((q) => q.source === "study-guide").length,
  };
};

/** 各評鑑節點的題數。學習主題頁用它決定「練這個節點的 N 題」要不要出現。 */
export const getTopicCounts = (subjectId: string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const question of getQuestions(subjectId)) {
    counts[question.topic] = (counts[question.topic] ?? 0) + 1;
  }
  return counts;
};
