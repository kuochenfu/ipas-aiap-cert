import type { Question } from "./types";
import past from "./past-exams/junior-ai-basics.json";
import { explanations } from "./explanations/junior-ai-basics";
import { generated } from "./generated/junior-ai-basics";
import { resolvePastExamExplanations } from "./resolveExplanations";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

export const questions: Question[] = [...pastWithExplanations, ...generated];
