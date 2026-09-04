import type { ChoiceId, Question } from "../data/types";
import type { AnswerState } from "./exam";
import { isRecommended, recommendedOrder } from "./adaptive";

/** 作答前的自評信心。只在「校準模式」開啟時才會被記錄。 */
export type Confidence = "sure" | "unsure";

/**
 * 單題的作答歷程。
 *
 * 舊格式的 `answers` 只存「最後一次選了什麼」，因此 Retention（隔一段時間還會不會）、
 * Calibration（信心與正確率是否相符）、Repeated Error（同一題反覆錯）與間隔重測的到期判斷
 * **四件事全部量不到**——不是演算法問題，是資料裡沒有這些欄位。這個型別補上它們。
 *
 * 與 `answers` 並存而非取代：舊版本寫下的進度沒有 `records`，讀回來時視為空，
 * 作答與還原的行為完全不變（見 `state/drillProgress.ts` 的相容處理）。
 */
export type AnswerRecord = {
  /** 最後一次選的選項。與 `answers[id]` 一致，重複存是為了讓歷程自身完整。 */
  choice: ChoiceId;
  /** 首次作答時間（epoch ms）。 */
  firstAt: number;
  /** 最後一次作答時間（epoch ms）。間隔重測的到期判斷用這個。 */
  lastAt: number;
  /** 作答次數（含重置後重做）。 */
  attempts: number;
  /** 累計答錯次數。`attempts - wrongCount` 即答對次數。 */
  wrongCount: number;
  /** 這次作答前標記的信心；沒標記時為 undefined。 */
  confidence?: Confidence;
};

export type AnswerRecords = Record<string, AnswerRecord>;

export type DrillProgress = {
  questionId: string;
  answers: Record<string, ChoiceId>;
  /** 逐題作答歷程。舊資料沒有這個欄位。 */
  records?: AnswerRecords;
};

/**
 * 刷題的四種篩選：全部／推薦／答錯過的／尚未作答的。
 *
 * 「推薦」與其他三種不同——它同時決定**順序**（依弱點與到期重測排序），
 * 不只是決定哪些題目入選。見 `filteredDrillIndices`。
 */
export type DrillFilter = "all" | "recommended" | "wrong" | "unanswered";

/**
 * 篩選所需的額外脈絡。
 *
 * 原本只有 `missed` 一個選用參數；「推薦」還需要作答歷程與「現在幾點」
 * （到期重測要算時間差），繼續往後加位置參數會變得無法閱讀，故收成一個物件。
 * 全部欄位皆為選用，不傳時「推薦」會退化成「未答 ＋ 答錯」——安全但少了重測。
 */
export type DrillContext = {
  /** 錯題本（模擬考交卷時寫入）的 id 集合。 */
  missed?: ReadonlySet<string>;
  records?: AnswerRecords;
  /** 現在時間（epoch ms）；測試可注入固定值。 */
  now?: number;
};

/**
 * 更新一題的作答歷程。純函式：吃舊紀錄與這次作答，回傳新紀錄。
 *
 * `confidence` 一律以**這次**的標記為準（沒標就是沒標），不沿用上一次的——
 * 沿用會讓「上次有把握、這次沒標」被誤讀成「這次也有把握」。
 */
export const recordAnswer = (
  previous: AnswerRecord | undefined,
  choice: ChoiceId,
  correct: boolean,
  now: number,
  confidence?: Confidence,
): AnswerRecord => ({
  choice,
  firstAt: previous?.firstAt ?? now,
  lastAt: now,
  attempts: (previous?.attempts ?? 0) + 1,
  wrongCount: (previous?.wrongCount ?? 0) + (correct ? 0 : 1),
  confidence,
});

/** 依已儲存的進度還原刷題位置、作答與歷程；題庫變動時安全退回第一題。 */
export const restoreDrill = (
  questions: Question[],
  progress: DrillProgress | undefined,
): { index: number; answers: AnswerState; records: AnswerRecords } => {
  if (!progress) return { index: 0, answers: {}, records: {} };
  const ids = new Set(questions.map((question) => question.id));
  const answers: AnswerState = {};
  for (const [id, choice] of Object.entries(progress.answers)) {
    if (ids.has(id)) answers[id] = choice;
  }
  const records: AnswerRecords = {};
  for (const [id, record] of Object.entries(progress.records ?? {})) {
    if (ids.has(id)) records[id] = record;
  }
  const found = questions.findIndex((question) => question.id === progress.questionId);
  return { index: found >= 0 ? found : 0, answers, records };
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

/**
 * 該題是否符合指定篩選。
 *
 * 「錯題」有兩個來源，兩者的關係是「本次刷題的作答優先」：
 * 1. 本次刷題答錯的題目（`answers`）。
 * 2. 錯題本（`missed`）——模擬考交卷時寫入的錯題，跨場次累積。
 *
 * 已在刷題中作答的題目一律以該次作答為準：答對就不再算錯題（等於提供了把錯題本
 * 項目「消掉」的途徑），答錯就算。尚未在刷題中作答的，才回頭看錯題本。
 *
 * 「推薦」則是未作答、答錯、或答對但已到重測時點——判斷在 `domain/adaptive.ts`。
 */
export const drillMatches = (
  question: Question,
  answers: AnswerState,
  filter: DrillFilter,
  context: DrillContext = {},
): boolean => {
  const answer = answers[question.id];
  if (filter === "all") return true;
  if (filter === "unanswered") return answer === undefined;
  if (filter === "recommended") {
    return isRecommended(question, answers, context.records, context.now ?? Date.now());
  }
  if (answer !== undefined) return answer !== question.answer;
  return context.missed?.has(question.id) ?? false;
};

/**
 * 符合指定篩選的題目索引。
 *
 * 除了「推薦」以外都維持**題庫原序**——刷題就是照考卷順序走。
 * 「推薦」改依弱點與到期重測排序，因此這個函式的回傳同時決定了上一題／下一題的走法
 * （`moveDrill` 是在這個陣列上前後移動的）。
 */
export const filteredDrillIndices = (
  questions: Question[],
  answers: AnswerState,
  filter: DrillFilter,
  context: DrillContext = {},
): number[] => {
  if (filter === "recommended") {
    return recommendedOrder(questions, answers, context.records, context.now ?? Date.now());
  }
  return questions.reduce<number[]>((indices, question, index) => {
    if (drillMatches(question, answers, filter, context)) indices.push(index);
    return indices;
  }, []);
};

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
  context: DrillContext = {},
): { index: number; empty: boolean } => {
  const current = questions[currentIndex];
  // 「推薦」是有順序的，留在原地會讓使用者停在排序中間、看不到最該練的那題，
  // 因此切到推薦時一律跳到排序第一題。
  if (filter !== "recommended" && current && drillMatches(current, answers, filter, context)) {
    return { index: currentIndex, empty: false };
  }
  const first = filteredDrillIndices(questions, answers, filter, context)[0];
  return first === undefined ? { index: 0, empty: true } : { index: first, empty: false };
};
