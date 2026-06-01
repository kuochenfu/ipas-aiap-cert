import type { Question } from "./types";
import past from "./past-exams/senior-ai-tech.json";
import { explanations } from "./explanations/senior-ai-tech";
import { generated } from "./generated/senior-ai-tech";

const pastWithExplanations: Question[] = (past as Question[]).map((q) => ({
  ...q,
  explanation: explanations[q.id] ?? q.explanation,
}));

export const questions: Question[] = [...pastWithExplanations, ...generated];
