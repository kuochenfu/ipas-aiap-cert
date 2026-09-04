import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { getPracticeQuestions } from "../src/data/practice";
import type { Question } from "../src/data/types";

/**
 * 重複／近重複題目檢查。
 *
 * 題庫成長到 1,972 題、且其中 915 題由 LLM 分批命製之後，「同義改寫灌水」是最容易
 * 悄悄發生的品質流失——每一批單獨看都合格，合起來才會重複。型別檢查與既有的
 * 配額／分布契約都攔不到這件事，因為重複的題目在結構上完全合法。
 *
 * 相似度用**字元 bigram 的 Jaccard**：中文沒有空白分詞，bigram 是最省事又夠準的作法。
 * 門檻經實測校準（見下方各段註解），不是憑感覺挑的。
 */

const normalize = (text: string): string =>
  text.replace(/[\s，。、；：（）()「」『』？！,.;:?!—－\-…"'`]/g, "").toLowerCase();

const bigrams = (text: string): Set<string> => {
  const set = new Set<string>();
  for (let i = 0; i < text.length - 1; i += 1) set.add(text.slice(i, i + 2));
  return set;
};

const similarity = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const gram of a) if (b.has(gram)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
};

type Prepared = { question: Question; bank: "main" | "practice"; norm: string; grams: Set<string> };

const prepare = (questions: Question[], bank: "main" | "practice"): Prepared[] =>
  questions.map((question) => {
    const norm = normalize(question.prompt);
    return { question, bank, norm, grams: bigrams(norm) };
  });

const pairsAbove = (items: Prepared[], threshold: number, sameBankOnly: boolean) => {
  const found: { a: string; b: string; sim: number }[] = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (sameBankOnly && items[i].bank !== items[j].bank) continue;
      const sim = items[i].norm === items[j].norm ? 1 : similarity(items[i].grams, items[j].grams);
      if (sim >= threshold) {
        found.push({ a: items[i].question.id, b: items[j].question.id, sim });
      }
    }
  }
  return found;
};

const allBySubject = subjects.map((subject) => ({
  subject,
  items: [
    ...prepare(getQuestions(subject.id), "main"),
    ...prepare(getPracticeQuestions(subject.id), "practice"),
  ],
}));

/**
 * 已知的跨題庫近重複（2026-09-04 首次掃描時發現）。
 *
 * `aiot-junior-iot` 的自編 60 題（`generated/`）與新題庫 100 題（`practice/`）在同一天
 * 以相近的規格分別命製，因而撞題。兩者是**不同的練習入口**，同時保留不影響任一邊的
 * 節點配額，因此不刪題；但這份清單**不可增長**——再多就是真的在灌水了。
 * 完整的 10 對（含 0.55 以上的同概念題）記於 `docs/coverage/bank-defects.md`。
 */
const KNOWN_CROSS_BANK_PAIRS = [
  "aiot-junior-iot-gen-q003|aiot-junior-iot-practice-q003",
  "aiot-junior-iot-gen-q008|aiot-junior-iot-practice-q008",
  "aiot-junior-iot-gen-q026|aiot-junior-iot-practice-q040",
];

describe("重複題目", () => {
  it("同一科目內沒有題幹完全相同的題目", () => {
    for (const { subject, items } of allBySubject) {
      const seen = new Map<string, string>();
      for (const item of items) {
        const previous = seen.get(item.norm);
        expect(previous, `${subject.id}：${item.question.id} 與 ${previous} 題幹完全相同`).toBeUndefined();
        seen.set(item.norm, item.question.id);
      }
    }
  });

  it("同一個題庫內沒有相似度 ≥ 0.80 的近重複", () => {
    // 0.80 這個門檻的實測依據：全庫最相似的一對同題庫題目是
    // senior-bigdata 114-2 的 q40／q41（0.833）——它們共用同一張附圖、
    // 分別問「驗證法」與「演算法」，是真題本來就這樣出的，不是重複。
    // 因此同題庫的檢查排除官方真題，只守自編與 LLM 命製的部分。
    for (const { subject, items } of allBySubject) {
      const authored = items.filter((item) => item.question.source !== "past-exam");
      const found = pairsAbove(authored, 0.80, true);
      expect(found, `${subject.id} 出現同題庫近重複：${JSON.stringify(found)}`).toEqual([]);
    }
  });

  it("跨題庫的近重複不超出已知清單", () => {
    const found = allBySubject
      .flatMap(({ items }) => pairsAbove(items, 0.80, false))
      .filter((pair) => {
        // 同題庫的那對真題（q40/q41）已由上一條測試說明，這裡不重複報。
        const sameBankPastExam = pair.a.includes("-114-") || pair.a.includes("-115-");
        return !sameBankPastExam;
      })
      .map((pair) => `${pair.a}|${pair.b}`)
      .sort();
    expect(found).toEqual([...KNOWN_CROSS_BANK_PAIRS].sort());
  });
});
