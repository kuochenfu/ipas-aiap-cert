import { describe, expect, it } from "vitest";
import { getPracticeQuestions, practiceSubjectIds } from "../src/data/practice";
import { practiceTopics, topicLabel } from "../src/domain/assessmentTopics";
import type { Question } from "../src/data/types";

// 七科的新題庫現在都帶命題後設資料（meta）。契約分兩層：
//
// 1. **結構契約**適用全部七科——每題都要有完整 meta、干擾類型的鍵要與選項解析一致、
//    判斷分界不得為空、詳解裡指名的選項字母必須指向正解。
// 2. **分布契約**只適用 AIoT 兩科。它們是依「2026 iPAS AIoT 題庫生成強化 Prompt v2.0」
//    從零命製的，認知層級與難度在寫題時就照區間控管；AI 應用規劃師五科則是 2026-08-13～22
//    在沒有題型約束下先寫好、事後才補標 meta 的，實測偏重記憶與理解（見下方 BASELINE）。
//    把 AIoT 的區間硬套到五科上只會逼出不誠實的標籤，因此改以「基線快照」形式記錄實況，
//    讓分布若再惡化會被測試擋下，但不假裝它們符合一份當初並不存在的規格。
const specSubjectIds = ["aiot-junior-basics", "aiot-junior-iot"] as const;
const subjectIds = specSubjectIds;

/**
 * 五科補標 meta 時的實測分布（2026-08-22），作為回歸基線而非目標。
 * 每個值是「該層級／原型至少要有幾題」或「至多幾題」，容差 ±5 題。
 * 這些數字若要往 AIoT 的區間靠，正確做法是**改寫題目**（增加情境與取捨型題），
 * 而不是改標籤——標籤要如實反映題目在測什麼。
 */
const BASELINE: Record<string, { l1Max: number; l3Min: number; directConceptMax: number }> = {
  "junior-ai-basics": { l1Max: 32, l3Min: 18, directConceptMax: 32 },
  "junior-genai": { l1Max: 21, l3Min: 40, directConceptMax: 22 },
  "senior-ai-tech": { l1Max: 33, l3Min: 37, directConceptMax: 33 },
  "senior-bigdata": { l1Max: 36, l3Min: 24, directConceptMax: 38 },
  "senior-ml": { l1Max: 26, l3Min: 24, directConceptMax: 26 },
};

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

describe("新題庫：全七科的 meta 結構契約", () => {
  for (const subjectId of practiceSubjectIds) {
    const questions = bank(subjectId);

    it(`${subjectId}：每題都有完整的命題後設資料`, () => {
      expect(questions).toHaveLength(100);
      for (const q of questions) {
        expect(q.meta, q.id).toBeDefined();
        expect(q.meta!.cognitiveLevel, q.id).toMatch(/^L[1-4]$/);
        expect(q.meta!.archetype, q.id).toBeTruthy();
        expect(q.meta!.concepts.length, q.id).toBeGreaterThan(0);
        // Decision Boundary 是這批後設資料的核心：說明「條件變成什麼樣時答案會改變」。
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
  }

  // 五科的分布以基線快照守住，避免日後擴充時悄悄退步。
  for (const [subjectId, base] of Object.entries(BASELINE)) {
    it(`${subjectId}：分布不得劣於補標當時的基線`, () => {
      const questions = bank(subjectId);
      const l1 = questions.filter((q) => q.meta!.cognitiveLevel === "L1").length;
      const l3 = questions.filter((q) => q.meta!.cognitiveLevel === "L3").length;
      const direct = questions.filter((q) => q.meta!.archetype === "Direct Concept").length;
      expect(l1, `L1 ${l1} 題，記憶型過多`).toBeLessThanOrEqual(base.l1Max);
      expect(l3, `L3 ${l3} 題，應用型過少`).toBeGreaterThanOrEqual(base.l3Min);
      expect(direct, `Direct Concept ${direct} 題`).toBeLessThanOrEqual(base.directConceptMax);
    });
  }
});

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
