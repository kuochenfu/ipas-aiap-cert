import type { Question } from "./types";
import past from "./past-exams/senior-ml.json";
import { explanations } from "./explanations/senior-ml";
import { generated } from "./generated/senior-ml";

const pastWithExplanations: Question[] = (past as Question[]).map((q) => ({
  ...q,
  explanation: explanations[q.id] ?? q.explanation,
}));

export const questions: Question[] = [...pastWithExplanations, ...generated];
