import type { ChoiceId, Question } from "../data/types";
import type { AnswerState } from "./exam";

export type DrillProgress = {
  questionId: string;
  answers: Record<string, ChoiceId>;
};

/** 刷題的三種篩選：全部／答錯過的／尚未作答的。 */
export type DrillFilter = "all" | "wrong" | "unanswered";

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

/** 新題庫的進度 key：與原刷題共用同一個 localStorage key，靠科目 key 的後綴隔離。 */
export const practiceProgressKey = (subjectId: string): string => `${subjectId}:practice`;

/** 把使用者輸入的題號（1-based）轉為索引（0-based）；不合法回 null。 */
export const parseJumpTarget = (raw: string, total: number): number | null => {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (value < 1 || value > total) return null;
  return value - 1;
};

/** 該題是否符合指定篩選。 */
export const drillMatches = (
  question: Question,
  answers: AnswerState,
  filter: DrillFilter,
): boolean => {
  const answer = answers[question.id];
  if (filter === "all") return true;
  if (filter === "unanswered") return answer === undefined;
  return answer !== undefined && answer !== question.answer;
};

/** 符合指定篩選的題目索引，維持題庫原序。 */
export const filteredDrillIndices = (
  questions: Question[],
  answers: AnswerState,
  filter: DrillFilter,
): number[] =>
  questions.reduce<number[]>((indices, question, index) => {
    if (drillMatches(question, answers, filter)) indices.push(index);
    return indices;
  }, []);

/**
 * 切換篩選後該停在哪一題。
 *
 * 目前這題若仍符合新篩選就留在原地——否則切回「全部」會把辛苦刷到的位置打回第 1 題。
 * `empty` 表示沒有任何題目符合該篩選，呼叫端據此顯示空狀態而非題目。
 */
export const drillFilterTarget = (
  questions: Question[],
  answers: AnswerState,
  currentIndex: number,
  filter: DrillFilter,
): { index: number; empty: boolean } => {
  const current = questions[currentIndex];
  if (current && drillMatches(current, answers, filter)) {
    return { index: currentIndex, empty: false };
  }
  const first = filteredDrillIndices(questions, answers, filter)[0];
  return first === undefined ? { index: 0, empty: true } : { index: first, empty: false };
};
