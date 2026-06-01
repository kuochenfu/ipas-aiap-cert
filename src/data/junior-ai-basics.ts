import type { Question } from "./types";
import past from "./past-exams/junior-ai-basics.json";
import { explanations } from "./explanations/junior-ai-basics";
import { generated } from "./generated/junior-ai-basics";

const pastWithExplanations: Question[] = (past as Question[]).map((q) => ({
  ...q,
  explanation: explanations[q.id] ?? q.explanation,
}));

export const questions: Question[] = [...pastWithExplanations, ...generated];
