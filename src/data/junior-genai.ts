import type { Question } from "./types";
import past from "./past-exams/junior-genai.json";
import { explanations } from "./explanations/junior-genai";
import { generated } from "./generated/junior-genai";
import { resolvePastExamExplanations } from "./resolveExplanations";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

export const questions: Question[] = [...pastWithExplanations, ...generated];
