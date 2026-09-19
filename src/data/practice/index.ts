import type { Question } from "../types";
import { practiceQuestions as aiotJuniorBasics } from "./aiot-junior-basics";
import { practiceQuestions as aiotJuniorIot } from "./aiot-junior-iot";
import { practiceQuestions as aiotJuniorBasics2026 } from "./aiot-junior-basics.2026";
import { practiceQuestions as aiotJuniorIot2026 } from "./aiot-junior-iot.2026";
import { practiceQuestions as juniorAiBasics } from "./junior-ai-basics";
import { practiceQuestions as juniorGenai } from "./junior-genai";
import { practiceQuestions as seniorAiTech } from "./senior-ai-tech";
import { practiceQuestions as seniorBigdata } from "./senior-bigdata";
import { practiceQuestions as seniorMl } from "./senior-ml";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
  "senior-ai-tech": seniorAiTech,
  "senior-bigdata": seniorBigdata,
  "senior-ml": seniorMl,
  // AIoT 兩科各有兩批：第一批 q001–q100（2026-08-22）與第二批（2026-09-19），合併後依 id 順序即為題庫原序。
  "aiot-junior-basics": [...aiotJuniorBasics, ...aiotJuniorBasics2026],
  "aiot-junior-iot": [...aiotJuniorIot, ...aiotJuniorIot2026],
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
