import type { Question } from "./types";
import past from "./past-exams/senior-ai-tech.json";
import { explanations } from "./explanations/senior-ai-tech";
import { generated } from "./generated/senior-ai-tech";
import { resolvePastExamExplanations } from "./resolveExplanations";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

export const questions: Question[] = [...pastWithExplanations, ...generated];
