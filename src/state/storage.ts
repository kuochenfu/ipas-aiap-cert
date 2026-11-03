import type { Cert } from "../data/types";

const MISS_KEY = "ipas-aiap-misses";

const readArray = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
};

export const loadMisses = (): string[] => readArray(MISS_KEY);

export const isMissed = (id: string): boolean => loadMisses().includes(id);

export const addMiss = (id: string): void => {
  const set = new Set(loadMisses());
  set.add(id);
  localStorage.setItem(MISS_KEY, JSON.stringify([...set]));
};

export const removeMiss = (id: string): void => {
  const next = loadMisses().filter((x) => x !== id);
  localStorage.setItem(MISS_KEY, JSON.stringify(next));
};

// ── 學習主題頁的「已讀」標記 ──────────────────────────
// 獨立的 key：刷題進度記的是題目，這裡記的是讀過哪些評鑑節點，兩者互不影響。
const STUDY_READ_KEY = "ipas-aiap-study-read";

export const loadReadNodes = (): string[] => readArray(STUDY_READ_KEY);

export const toggleReadNode = (code: string): boolean => {
  const set = new Set(loadReadNodes());
  const next = !set.has(code);
  if (next) set.add(code);
  else set.delete(code);
  localStorage.setItem(STUDY_READ_KEY, JSON.stringify([...set]));
  return next;
};

// ── 學習主題頁的「上次讀到」 ─────────────────────────
// 記每張證照最後打開的節點（`科目id|節點碼`）與最後看的證照，供索引頁的「接著讀」。
// 與已讀標記分開：打開不等於讀完，讀完與否仍由使用者自己標。
const STUDY_LAST_KEY = "ipas-aiap-study-last";

export type StudyLast = { cert?: Cert; nodes: Partial<Record<Cert, string>> };

const isCert = (value: unknown): value is Cert => value === "aiap" || value === "aiot";

export const loadStudyLast = (): StudyLast => {
  try {
    const raw = localStorage.getItem(STUDY_LAST_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (typeof parsed !== "object" || parsed === null) return { nodes: {} };
    const record = parsed as Record<string, unknown>;
    const nodes: StudyLast["nodes"] = {};
    if (typeof record.nodes === "object" && record.nodes !== null) {
      for (const [cert, key] of Object.entries(record.nodes as Record<string, unknown>)) {
        if (isCert(cert) && typeof key === "string") nodes[cert] = key;
      }
    }
    return { ...(isCert(record.cert) ? { cert: record.cert } : {}), nodes };
  } catch {
    return { nodes: {} };
  }
};

export const saveStudyLast = (cert: Cert, nodeKey?: string): void => {
  const current = loadStudyLast();
  const next: StudyLast = { cert, nodes: nodeKey ? { ...current.nodes, [cert]: nodeKey } : current.nodes };
  try {
    localStorage.setItem(STUDY_LAST_KEY, JSON.stringify(next));
  } catch {
    // 無痕模式或儲存空間已滿：少了「接著讀」不影響閱讀本身。
  }
};

// ── 校準模式（作答前標記信心）的開關 ──────────────────
// 獨立的 key，且刻意是**站台層級**而非科目層級：這是使用者的作答習慣，
// 不該換一科就被重設。預設關閉——每題多一次點擊的成本要由使用者自己決定要不要付。
const CONFIDENCE_MODE_KEY = "ipas-aiap-confidence-mode";

export const loadConfidenceMode = (): boolean => {
  try {
    return localStorage.getItem(CONFIDENCE_MODE_KEY) === "on";
  } catch {
    return false;
  }
};

export const saveConfidenceMode = (enabled: boolean): void => {
  try {
    localStorage.setItem(CONFIDENCE_MODE_KEY, enabled ? "on" : "off");
  } catch {
    // 儲存空間已滿或被停用：忽略，本次仍可作答
  }
};
