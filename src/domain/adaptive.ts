import type { Question } from "../data/types";
import type { AnswerRecord, AnswerRecords } from "./drill";
import { isCorrect, type AnswerState } from "./exam";

/**
 * 自適應選題：決定「下一題該練什麼」。
 *
 * 原本的刷題是**題庫原序**（identity shuffle），對第一次讀完全合理——照考卷順序走
 * 不會漏題。但複習時原序沒有用：已經穩定答對的題目跟從沒做過的排在一起。
 *
 * 這裡的排序由三個訊號決定，與提案文件的 Adaptive Decision Logic 相同：
 *   1. Mastery gap  —— 哪個節點／認知層級最弱
 *   2. Error pattern —— 這題本身答錯過幾次
 *   3. Forgetting risk —— 答對過但已到間隔重測的時點
 *
 * 全部是純函式，且**沒有隨機性**：同樣的作答狀態永遠給出同樣的順序，
 * 否則使用者每次進來看到的題序都不同，會以為進度掉了。
 */

/** 間隔重測的天數。答對次數越多，下次重測隔得越久。 */
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 21, 60];

const DAY_MS = 24 * 60 * 60 * 1000;

/** 節點／層級的答對率要有幾題才算數。樣本太小的「0%」只是雜訊，不該左右排序。 */
export const MIN_SAMPLE = 3;

export const reviewIntervalDays = (correctCount: number): number => {
  if (correctCount <= 0) return REVIEW_INTERVAL_DAYS[0];
  return REVIEW_INTERVAL_DAYS[Math.min(correctCount, REVIEW_INTERVAL_DAYS.length) - 1];
};

/**
 * 這題是否到了該重測的時候。
 *
 * 只對「最後一次答對」的題目有意義——答錯的題目本來就會被「推薦」收進去，
 * 不需要等間隔。沒有歷程（舊資料或從未作答）時回 false：不知道何時做的，
 * 就不能宣稱它到期了。
 */
export const isDueForReview = (
  question: Question,
  record: AnswerRecord | undefined,
  now: number,
): boolean => {
  if (!record) return false;
  if (!isCorrect(question, record.choice)) return false;
  const correctCount = record.attempts - record.wrongCount;
  return now - record.lastAt >= reviewIntervalDays(correctCount) * DAY_MS;
};

export type MasteryProfile = {
  /** 節點碼 → 答對率（0–1）。樣本未達 MIN_SAMPLE 的節點不列。 */
  byTopic: Map<string, number>;
  /** 認知層級 → 答對率（0–1）。同樣有樣本門檻。 */
  byLevel: Map<string, number>;
};

const accuracyMap = (
  questions: Question[],
  answers: AnswerState,
  keyOf: (question: Question) => string | undefined,
): Map<string, number> => {
  const tally = new Map<string, { answered: number; correct: number }>();
  for (const question of questions) {
    const key = keyOf(question);
    if (key === undefined) continue;
    const answer = answers[question.id];
    if (answer === undefined) continue;
    const row = tally.get(key) ?? { answered: 0, correct: 0 };
    row.answered += 1;
    if (isCorrect(question, answer)) row.correct += 1;
    tally.set(key, row);
  }
  const out = new Map<string, number>();
  for (const [key, row] of tally) {
    if (row.answered < MIN_SAMPLE) continue;
    out.set(key, row.correct / row.answered);
  }
  return out;
};

export const buildMasteryProfile = (questions: Question[], answers: AnswerState): MasteryProfile => ({
  byTopic: accuracyMap(questions, answers, (question) => question.topic),
  byLevel: accuracyMap(questions, answers, (question) => question.meta?.cognitiveLevel),
});

/** 「推薦」會收進哪些題目：未作答、答錯、或答對但已到重測時點。 */
export const isRecommended = (
  question: Question,
  answers: AnswerState,
  records: AnswerRecords | undefined,
  now: number,
): boolean => {
  const answer = answers[question.id];
  if (answer === undefined) return true;
  if (!isCorrect(question, answer)) return true;
  return isDueForReview(question, records?.[question.id], now);
};

/**
 * 推薦分數，越高越優先。分數的組成刻意讓「狀態」壓過「弱點」——
 * 一題答錯過的題目永遠排在一題沒做過的前面，弱點只在同一種狀態內排序。
 * 否則使用者會看到「明明有錯題沒複習，卻先跳到沒做過的題目」，很難信任這個排序。
 */
export const recommendationScore = (
  question: Question,
  answers: AnswerState,
  records: AnswerRecords | undefined,
  profile: MasteryProfile,
  now: number,
): number => {
  const answer = answers[question.id];
  const record = records?.[question.id];
  let score: number;
  if (answer !== undefined && !isCorrect(question, answer)) {
    score = 300;
    // 反覆答錯的題目最該先處理——這正是提案裡的 Repeated Error。
    score += Math.min(record?.wrongCount ?? 1, 5) * 10;
  } else if (answer === undefined) {
    score = 200;
  } else {
    score = 100;
    // 過期越久越優先，上限避免久未使用時整份題庫擠在同一分。
    const overdueDays = record ? (now - record.lastAt) / DAY_MS : 0;
    score += Math.min(overdueDays, 30);
  }
  const topicAccuracy = profile.byTopic.get(question.topic);
  if (topicAccuracy !== undefined) score += (1 - topicAccuracy) * 40;
  const level = question.meta?.cognitiveLevel;
  const levelAccuracy = level === undefined ? undefined : profile.byLevel.get(level);
  if (levelAccuracy !== undefined) score += (1 - levelAccuracy) * 20;
  return score;
};

/**
 * 推薦順序（回傳題庫索引）。分數相同者維持題庫原序，讓結果穩定可重現。
 */
export const recommendedOrder = (
  questions: Question[],
  answers: AnswerState,
  records: AnswerRecords | undefined,
  now: number,
): number[] => {
  const profile = buildMasteryProfile(questions, answers);
  return questions
    .map((question, index) => ({ index, question }))
    .filter(({ question }) => isRecommended(question, answers, records, now))
    .map((entry) => ({
      ...entry,
      score: recommendationScore(entry.question, answers, records, profile, now),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.index);
};
