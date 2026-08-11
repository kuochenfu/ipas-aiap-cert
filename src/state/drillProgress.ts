import type { ChoiceId } from "../data/types";
import type { DrillProgress } from "../domain/drill";

const PROGRESS_KEY = "ipas-aiap-drill-progress";

type ProgressMap = Record<string, DrillProgress>;

const isChoiceId = (value: unknown): value is ChoiceId =>
  value === "A" || value === "B" || value === "C" || value === "D";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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
      out[subjectId] = { questionId: value.questionId, answers };
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
