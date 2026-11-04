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

/**
 * 正解落在「最長／第二長／第三長／最短」四個長度名次的比例（同長時平分），
 * 等於「每題都挑第 k 長的選項」的期望得分。隨機基準為各 25%。
 */
const rankDistribution = (questions: Question[]): number[] => {
  const shares = [0, 0, 0, 0];
  let n = 0;
  for (const q of questions) {
    if (q.choices.length !== 4) continue;
    const answer = q.choices.find((c) => c.id === q.answer);
    if (!answer) continue;
    n++;
    const correct = len(answer.text);
    const sorted = q.choices.map((c) => len(c.text)).sort((a, b) => b - a);
    const ranks = sorted.flatMap((value, k) => (value === correct ? [k] : []));
    for (const k of ranks) shares[k] += 1 / ranks.length;
  }
  return shares.map((share) => pct(share, n));
};

const llmBank = (subjectId: string, bank: "practice" | "generated"): Question[] =>
  bank === "practice"
    ? getPracticeQuestions(subjectId)
    : getQuestions(subjectId).filter((q) => q.source === "generated");

// 2026-10-28～29 已修正全部 LLM 題庫（AIoT 兩科、中級與初級新題庫、五科 generated），原本鎖住現況的棘輪組因此移除。
// 日後新增 LLM 題庫時，直接加進這份清單。
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
    ["junior-ai-basics", "generated"],
    ["junior-genai", "generated"],
    ["senior-ai-tech", "generated"],
    ["senior-bigdata", "generated"],
    ["senior-ml", "generated"],
    ["junior-ai-basics", "practice"],
    ["junior-genai", "practice"],
  ];

  for (const [subjectId, bank] of fixed) {
    it(`${subjectId}（${bank}）：正解最長 ≤35%、最短 ≤40%、無明顯偏長的正解`, () => {
      const s = lengthStats(llmBank(subjectId, bank));
      expect(s.n).toBeGreaterThan(0);
      expect(pct(s.longest, s.n), "正解為最長選項的比例").toBeLessThanOrEqual(35);
      expect(pct(s.shortest, s.n), "正解為最短選項的比例").toBeLessThanOrEqual(40);
      expect(s.glaring, "正解達最長干擾項 1.3 倍以上的題目").toEqual([]);
    });

    // 只限制最長與最短時，偏差會擠到下一個沒被限制的名次：2026-10-30 量到四個題庫「每題挑第二長」得 41–44 分。
    // 因此把分布本身寫成門檻（backlog Q3）。
    it(`${subjectId}（${bank}）：正解在每個長度名次的比例 ≤40%`, () => {
      const [longest, second, third, shortest] = rankDistribution(llmBank(subjectId, bank));
      expect(longest, "正解為最長").toBeLessThanOrEqual(40);
      expect(second, "正解為第二長").toBeLessThanOrEqual(40);
      expect(third, "正解為第三長").toBeLessThanOrEqual(40);
      expect(shortest, "正解為最短").toBeLessThanOrEqual(40);
    });
  }
});
