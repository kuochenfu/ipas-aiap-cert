import type { Question } from "./types";
import past from "./past-exams/junior-genai.json";
import { explanations } from "./explanations/junior-genai";
import { generated } from "./generated/junior-genai";

const pastWithExplanations: Question[] = (past as Question[]).map((q) => ({
  ...q,
  explanation: explanations[q.id] ?? q.explanation,
}));

export const questions: Question[] = [...pastWithExplanations, ...generated];
