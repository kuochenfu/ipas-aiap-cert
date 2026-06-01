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
