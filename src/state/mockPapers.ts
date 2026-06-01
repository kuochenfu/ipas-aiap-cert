import type { Question } from "../data/types";
import { shuffleWith } from "./attempt";
import { examRules } from "../domain/exam";

export const PAPER_COUNT = 3;

const hashSeed = (s: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// 依 subjectId + 份次 產生穩定、可重現的試卷（題庫足夠時取 50 題）。
export const buildMockPaper = (bank: Question[], subjectId: string, paperIndex: number): Question[] => {
  const rng = mulberry32(hashSeed(`${subjectId}#${paperIndex}`));
  return shuffleWith(bank, rng).slice(0, Math.min(examRules.totalQuestions, bank.length));
};
