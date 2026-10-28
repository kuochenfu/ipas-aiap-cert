import { describe, expect, it } from "vitest";
import { getQuestions } from "../src/data";
import { getPracticeQuestions } from "../src/data/practice";
import type { Question } from "../src/data/types";

/**
 * 選項長度不得洩題。
 *
 * LLM 命題有個系統性破綻：正解為了「毫無爭議地對」會被補上理由或條件，干擾項卻只有名詞，
 * 結果每題挑最長選項就能及格（2026-10-28 量到 AIoT 考科二 83 分、中級新題庫 87–97 分；
 * 官方題目同一指標為 36–63 分）。量測與成因見 docs/retrospective-2026-10-28-longest-option-cue.md。
 *
 * 字數一律去空白後計算。只檢查 LLM 題源（practice 與 source: "generated"），官方題目不受約束。
 */

const len = (text: string) => [...text.replace(/\s/g, "")].length;

type LengthStats = { n: number; longest: number; shortest: number; glaring: string[] };

const lengthStats = (questions: Question[]): LengthStats => {
  const stats: LengthStats = { n: 0, longest: 0, shortest: 0, glaring: [] };
  for (const q of questions) {
    if (q.choices.length !== 4) continue;
    const answer = q.choices.find((c) => c.id === q.answer);
    if (!answer) continue;
    const correct = len(answer.text);
    const others = q.choices.filter((c) => c.id !== q.answer).map((c) => len(c.text));
    stats.n++;
    if (correct > Math.max(...others)) stats.longest++;
    if (correct < Math.min(...others)) stats.shortest++;
    // 短選項（數值、縮寫）差幾個字不構成線索，因此另設絕對差下限。
    if (correct >= 1.3 * Math.max(...others) && correct - Math.max(...others) >= 3) stats.glaring.push(q.id);
  }
  return stats;
};

const pct = (count: number, n: number) => Math.round((100 * count) / n);

const llmBank = (subjectId: string, bank: "practice" | "generated"): Question[] =>
  bank === "practice"
    ? getPracticeQuestions(subjectId)
    : getQuestions(subjectId).filter((q) => q.source === "generated");

describe("選項長度：已修正的題庫維持在目標內", () => {
  // 隨機基準為 25%；官方題目的「正解最長」比例約 34–46%（初級／AIoT）。
  // 正解最短也設上限，避免矯枉過正，變成「挑不是最短的」也能猜。
  const fixed: Array<[string, "practice" | "generated"]> = [
    ["aiot-junior-iot", "practice"],
    ["aiot-junior-iot", "generated"],
    ["aiot-junior-basics", "practice"],
    ["senior-ai-tech", "practice"],
    ["senior-bigdata", "practice"],
    ["senior-ml", "practice"],
  ];

  for (const [subjectId, bank] of fixed) {
    it(`${subjectId}（${bank}）：正解最長 ≤35%、最短 ≤40%、無明顯偏長的正解`, () => {
      const s = lengthStats(llmBank(subjectId, bank));
      expect(s.n).toBeGreaterThan(0);
      expect(pct(s.longest, s.n), "正解為最長選項的比例").toBeLessThanOrEqual(35);
      expect(pct(s.shortest, s.n), "正解為最短選項的比例").toBeLessThanOrEqual(40);
      expect(s.glaring, "正解達最長干擾項 1.3 倍以上的題目").toEqual([]);
    });
  }
});

describe("選項長度：尚未修正的題庫只准變好（棘輪）", () => {
  // 數字是 2026-10-28 的現況。改寫選項後請把上限調低，修完就移到上面的「已修正」組。
  const ratchet: Array<[string, "practice" | "generated", number]> = [
    ["junior-ai-basics", "practice", 45],
    ["junior-genai", "practice", 37],
    ["junior-ai-basics", "generated", 78],
    ["junior-genai", "generated", 91],
    ["senior-ai-tech", "generated", 83],
    ["senior-bigdata", "generated", 67],
    ["senior-ml", "generated", 88],
  ];

  for (const [subjectId, bank, cap] of ratchet) {
    it(`${subjectId}（${bank}）：正解最長比例不超過 ${cap}%`, () => {
      const s = lengthStats(llmBank(subjectId, bank));
      expect(pct(s.longest, s.n)).toBeLessThanOrEqual(cap);
    });
  }
});
