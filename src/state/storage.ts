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
