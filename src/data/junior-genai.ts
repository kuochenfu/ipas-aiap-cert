import type { Question } from "./types";
import past from "./past-exams/junior-genai.json";
import { explanations } from "./explanations/junior-genai";
import { generated } from "./generated/junior-genai";
import { resolvePastExamExplanations } from "./resolveExplanations";
import { applyQuestionMeta } from "./meta/types";
import { questionMeta } from "./meta/junior-genai";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

// meta 的回填涵蓋真題與新題，故套在合併之後。
export const questions: Question[] = applyQuestionMeta([...pastWithExplanations, ...generated], questionMeta);
