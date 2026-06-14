import type { Question } from "./types";
import past from "./past-exams/senior-bigdata.json";
import { explanations } from "./explanations/senior-bigdata";
import { generated } from "./generated/senior-bigdata";
import { resolvePastExamExplanations } from "./resolveExplanations";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

export const questions: Question[] = [...pastWithExplanations, ...generated];
