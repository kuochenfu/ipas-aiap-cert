import type { Question } from "./types";
import past from "./past-exams/senior-ai-tech.json";
import { explanations } from "./explanations/senior-ai-tech";
import { generated } from "./generated/senior-ai-tech";
import { resolvePastExamExplanations } from "./resolveExplanations";
import { applyQuestionMeta } from "./meta/types";
import { questionMeta } from "./meta/senior-ai-tech";

const pastWithExplanations: Question[] = resolvePastExamExplanations(past as Question[], explanations);

// meta 的回填涵蓋真題與新題，故套在合併之後。
export const questions: Question[] = applyQuestionMeta([...pastWithExplanations, ...generated], questionMeta);
