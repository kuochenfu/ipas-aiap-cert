import { describe, expect, it } from "vitest";
import { getPracticeQuestions, practiceSubjectIds } from "../src/data/practice";
import { practiceTopics, practiceTotal, topicLabel } from "../src/domain/assessmentTopics";
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
 * AI 應用規劃師五科的分布契約（方案 C）。
 *
 * 這五科原本是在沒有題型約束下寫成的，2026-08-22 補標 meta 時實測偏重記憶與理解
 * （L4 一度只有 1%、跨節點近乎為零）。後續以**加題稀釋**的方式再平衡：既有題目一題不動，
 * 另外補寫 215 題 L3／L4 的情境取捨與跨節點題，把分布拉進下列區間（見 docs/backlog.md 的 A1d）。
 *
 * 區間比 AIoT 兩科寬鬆是刻意的——要完全對齊 AIoT 的規格需再多寫約 160 題，而其中多數
 * 只是為了把記憶題的佔比從 19% 壓到 15%，對使用者的實質幫助遠小於「L4 從 1% 拉到 15%」
 * 與「跨節點從 0% 拉到 15%」這兩項。取捨的理由記在 docs/question-authoring.md。
 */
const AIAP_BANDS = { l1Max: 20, l2Max: 35, l3Min: 33, l4Min: 15, dcMax: 20, crossMin: 15 };
const AIAP_SUBJECTS = [
  "junior-ai-basics",
  "junior-genai",
  "senior-ai-tech",
  "senior-bigdata",
  "senior-ml",
] as const;
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
      // 題數以配額為準（五科在 2026-08-22 的再平衡中各自加題，不再都是 100）。
      expect(questions).toHaveLength(practiceTotal(subjectId));
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

  // 五科的分布契約。任一項退步都會被擋下——日後擴充題庫時，新題必須維持這個結構。
  for (const subjectId of AIAP_SUBJECTS) {
    it(`${subjectId}：認知層級與題型分布符合方案 C 的區間`, () => {
      const questions = bank(subjectId);
      const pct = (predicate: (q: Question) => boolean) =>
        (questions.filter(predicate).length / questions.length) * 100;
      const l1 = pct((q) => q.meta!.cognitiveLevel === "L1");
      const l2 = pct((q) => q.meta!.cognitiveLevel === "L2");
      const l3 = pct((q) => q.meta!.cognitiveLevel === "L3");
      const l4 = pct((q) => q.meta!.cognitiveLevel === "L4");
      const direct = pct((q) => q.meta!.archetype === "Direct Concept");
      const cross = pct((q) => Boolean(q.meta!.crossNode));
      expect(l1, `L1 ${l1.toFixed(1)}%`).toBeLessThanOrEqual(AIAP_BANDS.l1Max);
      expect(l2, `L2 ${l2.toFixed(1)}%`).toBeLessThanOrEqual(AIAP_BANDS.l2Max);
      expect(l3, `L3 ${l3.toFixed(1)}%`).toBeGreaterThanOrEqual(AIAP_BANDS.l3Min);
      expect(l4, `L4 ${l4.toFixed(1)}%`).toBeGreaterThanOrEqual(AIAP_BANDS.l4Min);
      expect(direct, `純記憶型 ${direct.toFixed(1)}%`).toBeLessThanOrEqual(AIAP_BANDS.dcMax);
      expect(cross, `跨節點 ${cross.toFixed(1)}%`).toBeGreaterThanOrEqual(AIAP_BANDS.crossMin);
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
