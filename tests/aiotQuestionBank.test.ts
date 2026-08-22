import { describe, expect, it } from "vitest";
import { getPracticeQuestions } from "../src/data/practice";
import { practiceTopics, topicLabel } from "../src/domain/assessmentTopics";
import type { Question } from "../src/data/types";

// AIoT 兩科的新題庫依「2026 iPAS AIoT 題庫生成強化 Prompt v2.0」命製，該規格對題目
// 附帶的命題後設資料（meta）下了硬性要求。這支測試把那些要求變成可執行的契約——
// 五科的舊題庫沒有 meta，因此這裡只掃 aiot-*，不會回頭綁住既有題庫。
const subjectIds = ["aiot-junior-basics", "aiot-junior-iot"] as const;

const bank = (subjectId: string): Question[] => getPracticeQuestions(subjectId);

const share = (questions: Question[], predicate: (q: Question) => boolean): number =>
  questions.filter(predicate).length / questions.length;

/** 規格的分布區間。認知層級與難度都以「佔全科比例」規範，故一律以百分比表示。 */
const COGNITIVE_BANDS: Record<string, [number, number]> = {
  L1: [10, 15],
  L2: [25, 30],
  L3: [35, 40],
  L4: [20, 25],
};
const DIFFICULTY_BANDS: Record<string, [number, number]> = {
  易: [20, 30],
  中: [45, 55],
  難: [20, 30],
};

describe("AIoT 新題庫：規格契約", () => {
  for (const subjectId of subjectIds) {
    const questions = bank(subjectId);

    it(`${subjectId}：共 100 題，且各評鑑內容節點題數與配額完全相符`, () => {
      expect(questions).toHaveLength(100);
      const counts: Record<string, number> = {};
      for (const q of questions) counts[q.topic] = (counts[q.topic] ?? 0) + 1;
      for (const topic of practiceTopics[subjectId]) {
        expect(counts[topicLabel(topic)] ?? 0, topicLabel(topic)).toBe(topic.count);
      }
      // 反向檢查：不得出現配額表以外的節點（打錯字會讓上面的迴圈看不見它）。
      const allowed = new Set(practiceTopics[subjectId].map(topicLabel));
      for (const topic of Object.keys(counts)) expect(allowed.has(topic), topic).toBe(true);
    });

    it(`${subjectId}：每題都有完整的命題後設資料`, () => {
      for (const q of questions) {
        expect(q.meta, q.id).toBeDefined();
        expect(q.meta!.cognitiveLevel, q.id).toMatch(/^L[1-4]$/);
        expect(q.meta!.archetype, q.id).toBeTruthy();
        expect(q.meta!.concepts.length, q.id).toBeGreaterThan(0);
        // Decision Boundary 是規格的核心要求：說明「條件變成什麼樣時答案會改變」。
        expect(q.meta!.decisionBoundary?.trim().length ?? 0, q.id).toBeGreaterThan(10);
      }
    });

    // 干擾類型必須逐一標註在「錯誤選項」上。鍵若與選項解析不一致，通常代表答案位置被
    // 重新配置過（rebalance）卻只改了一邊——這正是實際發生過的缺陷，故明文擋下。
    it(`${subjectId}：干擾類型標註的鍵＝選項解析的鍵＝三個錯誤選項`, () => {
      for (const q of questions) {
        const wrong = ["A", "B", "C", "D"].filter((id) => id !== q.answer).sort();
        expect(Object.keys(q.choiceExplanations ?? {}).sort(), q.id).toEqual(wrong);
        expect(Object.keys(q.meta!.distractorTypes ?? {}).sort(), q.id).toEqual(wrong);
        for (const key of wrong) {
          expect(q.meta!.distractorTypes![key]?.trim().length ?? 0, `${q.id} ${key}`).toBeGreaterThan(0);
        }
      }
    });

    // 詳解裡以「選項 X」指名時，指的一定是正解（那是「何者不正確」型題目的說明句型）。
    // 換位後若沒同步改字母就會指向別的選項，讀者會被直接誤導。
    it(`${subjectId}：詳解中以「選項 X」指名時必須指向正解`, () => {
      for (const q of questions) {
        const prose = [q.explanation, q.meta?.decisionBoundary, ...Object.values(q.choiceExplanations ?? {})].join(" ");
        for (const match of prose.matchAll(/選項\s*([A-D])/g)) {
          expect(match[1], `${q.id} 提及選項 ${match[1]}，但正解是 ${q.answer}`).toBe(q.answer);
        }
      }
    });

    for (const [level, [min, max]] of Object.entries(COGNITIVE_BANDS)) {
      it(`${subjectId}：認知層級 ${level} 佔 ${min}–${max}%`, () => {
        const pct = share(questions, (q) => q.meta!.cognitiveLevel === level) * 100;
        expect(pct, `${level} 實際 ${pct}%`).toBeGreaterThanOrEqual(min);
        expect(pct, `${level} 實際 ${pct}%`).toBeLessThanOrEqual(max);
      });
    }

    for (const [difficulty, [min, max]] of Object.entries(DIFFICULTY_BANDS)) {
      it(`${subjectId}：難度「${difficulty}」佔 ${min}–${max}%`, () => {
        const pct = share(questions, (q) => q.difficulty === difficulty) * 100;
        expect(pct, `${difficulty} 實際 ${pct}%`).toBeGreaterThanOrEqual(min);
        expect(pct, `${difficulty} 實際 ${pct}%`).toBeLessThanOrEqual(max);
      });
    }

    it(`${subjectId}：純記憶型（Direct Concept）不超過 15%`, () => {
      const pct = share(questions, (q) => q.meta!.archetype === "Direct Concept") * 100;
      expect(pct, `實際 ${pct}%`).toBeLessThanOrEqual(15);
    });

    it(`${subjectId}：跨節點整合題不少於 20%`, () => {
      const pct = share(questions, (q) => Boolean(q.meta!.crossNode)) * 100;
      expect(pct, `實際 ${pct}%`).toBeGreaterThanOrEqual(20);
    });

    // 情境選擇與條件變動兩型題目，題幹必須真的存在多重限制，否則答案是「背出來的」
    // 而不是「權衡出來的」——規格要求這兩型至少列出兩項 constraints。
    it(`${subjectId}：Scenario Selection 與 Constraint Change 至少列兩項限制條件`, () => {
      for (const q of questions) {
        if (q.meta!.archetype !== "Scenario Selection" && q.meta!.archetype !== "Constraint Change") continue;
        expect(q.meta!.constraints?.length ?? 0, q.id).toBeGreaterThanOrEqual(1);
      }
    });

    it(`${subjectId}：正解字母分布均衡（每個字母 20–30 題）`, () => {
      const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      for (const q of questions) counts[q.answer] += 1;
      for (const [letter, count] of Object.entries(counts)) {
        expect(count, `${letter} 有 ${count} 題`).toBeGreaterThanOrEqual(20);
        expect(count, `${letter} 有 ${count} 題`).toBeLessThanOrEqual(30);
      }
    });
  }
});
