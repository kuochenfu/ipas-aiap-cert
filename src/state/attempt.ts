import type { Question } from "../data/types";

export type ShuffleFn = <T>(arr: T[]) => T[];

export const shuffleWith = <T>(arr: T[], rng: () => number): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const defaultShuffle: ShuffleFn = (arr) => shuffleWith(arr, Math.random);

export type Attempt = {
  questions: Question[];
};

export type BuildOptions = {
  count: number;
  shuffle?: ShuffleFn;
};

export const buildAttempt = (bank: Question[], options: BuildOptions): Attempt => {
  const shuffle = options.shuffle ?? defaultShuffle;
  const picked = shuffle(bank).slice(0, Math.min(options.count, bank.length));
  return { questions: picked };
};
