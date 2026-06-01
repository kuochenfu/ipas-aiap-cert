import type { Question } from "./types";
import past from "./past-exams/senior-bigdata.json";
import { explanations } from "./explanations/senior-bigdata";
import { generated } from "./generated/senior-bigdata";

const pastWithExplanations: Question[] = (past as Question[]).map((q) => ({
  ...q,
  explanation: explanations[q.id] ?? q.explanation,
}));

export const questions: Question[] = [...pastWithExplanations, ...generated];
