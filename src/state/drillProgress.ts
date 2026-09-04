import type { ChoiceId } from "../data/types";
import type { AnswerRecord, AnswerRecords, DrillProgress } from "../domain/drill";

const PROGRESS_KEY = "ipas-aiap-drill-progress";

type ProgressMap = Record<string, DrillProgress>;

const isChoiceId = (value: unknown): value is ChoiceId =>
  value === "A" || value === "B" || value === "C" || value === "D";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isConfidence = (value: unknown): value is AnswerRecord["confidence"] =>
  value === "sure" || value === "unsure" || value === undefined;

/**
 * 作答歷程的容錯讀取。
 *
 * 這個欄位是後加的，舊版本寫下的進度沒有它——缺少時回空物件，作答與還原行為不變。
 * 逐欄驗證而非整包信任：localStorage 的內容可能被使用者或另一個分頁的舊版本改過，
 * 一筆壞掉不該讓整科的進度消失，因此壞的那筆丟掉、其餘保留。
 */
const readRecords = (value: unknown): AnswerRecords => {
  if (!isPlainObject(value)) return {};
  const out: AnswerRecords = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!isPlainObject(raw)) continue;
    if (!isChoiceId(raw.choice)) continue;
    if (typeof raw.firstAt !== "number" || typeof raw.lastAt !== "number") continue;
    if (typeof raw.attempts !== "number" || typeof raw.wrongCount !== "number") continue;
    if (!isConfidence(raw.confidence)) continue;
    out[id] = {
      choice: raw.choice,
      firstAt: raw.firstAt,
      lastAt: raw.lastAt,
      attempts: raw.attempts,
      wrongCount: raw.wrongCount,
      ...(raw.confidence === undefined ? {} : { confidence: raw.confidence }),
    };
  }
  return out;
};

const readMap = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) return {};
    const out: ProgressMap = {};
    for (const [subjectId, value] of Object.entries(parsed)) {
      if (!isPlainObject(value)) continue;
      if (typeof value.questionId !== "string") continue;
      const answers: Record<string, ChoiceId> = {};
      if (isPlainObject(value.answers)) {
        for (const [id, choice] of Object.entries(value.answers)) {
          if (isChoiceId(choice)) answers[id] = choice;
        }
      }
      out[subjectId] = { questionId: value.questionId, answers, records: readRecords(value.records) };
    }
    return out;
  } catch {
    return {};
  }
};

const writeMap = (map: ProgressMap): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // 儲存空間已滿或被停用：忽略，不影響作答流程
  }
};

export const loadDrillProgress = (subjectId: string): DrillProgress | undefined => readMap()[subjectId];

export const saveDrillProgress = (subjectId: string, progress: DrillProgress): void => {
  const map = readMap();
  map[subjectId] = progress;
  writeMap(map);
};

export const clearDrillProgress = (subjectId: string): void => {
  const map = readMap();
  delete map[subjectId];
  writeMap(map);
};
