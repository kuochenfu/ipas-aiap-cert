import type { Question } from "./types";
import past from "./past-exams/senior-ml.json";
import { explanations } from "./explanations/senior-ml";
import { generated } from "./generated/senior-ml";
import { resolvePastExamExplanations } from "./resolveExplanations";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

export const questions: Question[] = [...pastWithExplanations, ...generated];
