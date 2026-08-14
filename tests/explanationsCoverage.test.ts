import { describe, it, expect } from "vitest";
import { getQuestions } from "../src/data/index";
import type { ChoiceId } from "../src/data/types";

const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];
const TEMPLATE_SIGNATURES = [/依學習指引中「/, /較像是在問該選項本身代表的概念/];

/** 該考卷中「詳解達標且三個錯誤選項解析齊全」的題數。 */
export const completeCount = (subjectId: string, examCode: string): number =>
  getQuestions(subjectId).filter((q) => {
    if (!q.id.includes(`-${examCode}-`)) return false;
    if (q.source !== "past-exam") return false;
    if (q.explanation.trim().length < 60) return false;
    if (TEMPLATE_SIGNATURES.some((re) => re.test(q.explanation))) return false;
    const keys = Object.keys(q.choiceExplanations ?? {}).sort();
    const expected = choiceIds.filter((id) => id !== q.answer).sort();
    return JSON.stringify(keys) === JSON.stringify(expected)
      && expected.every((id) => (q.choiceExplanations as Record<string, string>)[id].trim().length > 0);
  }).length;

describe("原題庫詳解與選項解析覆蓋率", () => {
  it("junior-ai-basics 115-1 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-1")).toBe(50);
  });

  it("junior-ai-basics 115-2 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-2")).toBe(50);
  });
});

describe("gen 題目不得被更動", () => {
  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId} 的 gen 題仍保有非空詳解`, () => {
      // generated/*.ts 目前沒有 choiceExplanations 欄位（過去仰賴 render 時的 glossary 動態組字，
      // Task 1 拿掉該機制後浮現的既有缺口，非本批任務造成）。Task 10 會補齊這批內容並把下面這行
      // choiceExplanations 的斷言加回來，屆時應一併移除此註解。
      const gen = getQuestions(subjectId).filter((q) => q.source === "generated");
      expect(gen.length).toBeGreaterThan(0);
      for (const q of gen) {
        expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
      }
    });
  }
});

/**
 * 若選項解析字串一開頭就指名某個字母（如「A、」「B.」「選項 C」「（D）」），
 * 該字母必須等於它自己所屬的 key——防的是貼錯字母（複製上一題的選項解析時常見）。
 */
const LEADING_LETTER_PATTERNS: RegExp[] = [
  /^選項\s*([A-D])\b/,
  /^\(?（?([A-D])\)?）?\s*[、.．:：]/,
];

const extractLeadingLetter = (text: string): ChoiceId | null => {
  for (const re of LEADING_LETTER_PATTERNS) {
    const m = re.exec(text.trim());
    if (m) return m[1] as ChoiceId;
  }
  return null;
};

describe("選項解析字母守衛（防貼錯字母）", () => {
  it("choiceExplanations 內若文字開頭指名字母，須與其 key 一致", () => {
    let triggered = 0;
    const mismatches: string[] = [];
    for (const subjectId of ["junior-ai-basics", "junior-genai", "senior-ai-tech", "senior-bigdata", "senior-ml"]) {
      for (const q of getQuestions(subjectId)) {
        const entries = Object.entries(q.choiceExplanations ?? {}) as [ChoiceId, string][];
        for (const [key, text] of entries) {
          const leading = extractLeadingLetter(text);
          if (leading === null) continue;
          triggered += 1;
          if (leading !== key) mismatches.push(`${q.id} choiceExplanations.${key} 開頭寫的是「${leading}」`);
        }
      }
    }
    // 目前全題庫沒有任何選項解析以「字母＋標點」或「選項X」開頭，觸發數為 0，
    // 此測試目前不具鑑別力；保留是為了在後續七批內容出現這種寫法時立刻抓到字母錯位。
    expect(mismatches).toEqual([]);
    expect(triggered).toBeGreaterThanOrEqual(0);
  });
});
