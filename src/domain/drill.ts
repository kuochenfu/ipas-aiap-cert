import type { ChoiceId, Question } from "../data/types";
import type { AnswerState } from "./exam";

export type DrillProgress = {
  questionId: string;
  answers: Record<string, ChoiceId>;
};

/** 依已儲存的進度還原刷題位置與作答；題庫變動時安全退回第一題。 */
export const restoreDrill = (
  questions: Question[],
  progress: DrillProgress | undefined,
): { index: number; answers: AnswerState } => {
  if (!progress) return { index: 0, answers: {} };
  const ids = new Set(questions.map((question) => question.id));
  const answers: AnswerState = {};
  for (const [id, choice] of Object.entries(progress.answers)) {
    if (ids.has(id)) answers[id] = choice;
  }
  const found = questions.findIndex((question) => question.id === progress.questionId);
  return { index: found >= 0 ? found : 0, answers };
};

/** 把使用者輸入的題號（1-based）轉為索引（0-based）；不合法回 null。 */
export const parseJumpTarget = (raw: string, total: number): number | null => {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (value < 1 || value > total) return null;
  return value - 1;
};
