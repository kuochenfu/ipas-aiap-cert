import { describe, it, expect } from "vitest";
import { getQuestions } from "../src/data/index";
import type { ChoiceId } from "../src/data/types";
import { SIMPLIFIED_CHARS } from "./simplifiedChars";

const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];
const allSubjectIds = ["junior-ai-basics", "junior-genai", "senior-ai-tech", "senior-bigdata", "senior-ml"];
const TEMPLATE_SIGNATURES = [/依學習指引中「/, /較像是在問該選項本身代表的概念/];

/**
 * 每條選項解析的最低字元數。
 *
 * 依「一句話講清楚為什麼這個選項在這一題是錯的」的實際結構下限訂定：這句話必須同時
 * 交代三件事——該選項的內容、本題題幹的具體要求、兩者的衝突點。實測既有內容，
 * 只有名詞定義或只有結論的殘句落在 18–22 字（如「此敘述與題幹要求不符，故為錯誤選項。」18 字、
 * 「關聯規則挖掘找的是常一起出現的字詞組合。」20 字），而三件事俱全的最短實例為 29 字
 * （115-1 q01.C「整併多來源資料就是資料整合的定義本身，最不可能是例外選項。」）。
 * 25 落在這個空隙裡：擋得住殘句與佔位字串，又不會誤殺寫得精簡但完整的解析。
 *
 * 注意此門檻擋的是「殘句／佔位」，擋不住「名詞定義＋一句尾綴」——後者可以寫得很長，
 * 是語意問題而非長度問題，只能靠人工複審與撰寫規則（無情境題幹須改用「與正解對比」寫法）把關。
 */
const MIN_CHOICE_ANALYSIS_LENGTH = 25;

/** 單條選項解析是否達標：非樣板、且長度足以完整交代錯誤理由。 */
const choiceAnalysisIsComplete = (text: string): boolean => {
  const trimmed = text.trim();
  if (trimmed.length < MIN_CHOICE_ANALYSIS_LENGTH) return false;
  return !TEMPLATE_SIGNATURES.some((re) => re.test(trimmed));
};

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
      && expected.every((id) => choiceAnalysisIsComplete((q.choiceExplanations as Record<string, string>)[id]));
  }).length;

describe("原題庫詳解與選項解析覆蓋率", () => {
  it("junior-ai-basics 115-1 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-1")).toBe(50);
  });

  it("junior-ai-basics 115-2 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-2")).toBe(50);
  });

  it("junior-ai-basics 114-4 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "114-4")).toBe(50);
  });

  it("junior-ai-basics guide 全 40 題達標", () => {
    expect(completeCount("junior-ai-basics", "guide")).toBe(40);
  });

  it("junior-genai 115-1 全 50 題達標", () => {
    expect(completeCount("junior-genai", "115-1")).toBe(50);
  });

  it("junior-genai 115-2 全 50 題達標", () => {
    expect(completeCount("junior-genai", "115-2")).toBe(50);
  });

  it("junior-genai 114-4 全 50 題達標", () => {
    expect(completeCount("junior-genai", "114-4")).toBe(50);
  });

  it("junior-genai guide 全 29 題達標", () => {
    expect(completeCount("junior-genai", "guide")).toBe(29);
  });
});

/**
 * 全題庫掃描：只要某題寫了選項解析，每一條都必須達標。
 *
 * 與上面的覆蓋率斷言互補——覆蓋率斷言只認證「已排程批次」的考卷，這裡則涵蓋全部五科，
 * 讓後續批次的選項解析一寫進來就受同一組門檻約束，不必等到該批的覆蓋率斷言補上為止。
 * 尚未撰寫選項解析的題目（choiceExplanations 為空）不在此檢查範圍，不會誤擋進度。
 */
/**
 * 原題庫的手寫欄位：不得含簡體字。
 *
 * `tests/practiceBank.test.ts` 的同名掃描只涵蓋 `getPracticeQuestions`（新題庫），
 * 因此在此之前，`getQuestions` 出來的詳解與選項解析——也就是 explanations overhaul
 * 各批次寫進去的全部內容——沒有任何自動化的繁體中文檢查。這裡補上，字表與新題庫共用
 * `tests/simplifiedChars.ts`，避免兩處各自維護而分歧。
 *
 * 只掃 `explanation` 與 `choiceExplanations` 這兩個**手寫**欄位：`prompt` 與 `choices`
 * 來自 `src/data/past-exams/*.json`，是 pdftotext 解析出來的機器產物（原始考卷用字），
 * 不由本專案撰寫，也明令不得修改，納入掃描只會產生改不掉的失敗。
 */
describe("原題庫手寫欄位：不得含簡體字", () => {
  for (const subjectId of allSubjectIds) {
    it(`${subjectId}：explanation 與 choiceExplanations 皆為繁體中文`, () => {
      const offenders: string[] = [];
      for (const q of getQuestions(subjectId)) {
        const fields: Array<[string, string]> = [
          ["explanation", q.explanation],
          ...Object.entries(q.choiceExplanations ?? {}).map(
            ([k, v]): [string, string] => [`choiceExplanations.${k}`, v as string],
          ),
        ];
        for (const [field, text] of fields) {
          for (const ch of SIMPLIFIED_CHARS) {
            if (text.includes(ch)) offenders.push(`${q.id} ${field} 疑似含簡體字「${ch}」：${text}`);
          }
        }
      }
      expect(offenders).toEqual([]);
    });
  }
});

describe("選項解析品質門檻（全題庫）", () => {
  for (const subjectId of allSubjectIds) {
    it(`${subjectId}：已撰寫的選項解析皆非樣板且長度達標`, () => {
      const offenders: string[] = [];
      for (const q of getQuestions(subjectId)) {
        for (const [key, text] of Object.entries(q.choiceExplanations ?? {})) {
          if (!choiceAnalysisIsComplete(text as string)) {
            offenders.push(`${q.id}.${key}（${(text as string).trim().length} 字）：${text}`);
          }
        }
      }
      expect(offenders).toEqual([]);
    });
  }
});

describe("gen 題目", () => {
  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId} 的 gen 題有達標詳解與三個錯誤選項解析`, () => {
      const gen = getQuestions(subjectId).filter((q) => q.source === "generated");
      expect(gen.length).toBeGreaterThan(0);
      for (const q of gen) {
        expect(q.explanation.trim().length, `${q.id} 詳解過短`).toBeGreaterThanOrEqual(60);
        const keys = Object.keys(q.choiceExplanations ?? {}).sort();
        const expected = choiceIds.filter((id) => id !== q.answer).sort();
        expect(keys, `${q.id} 選項解析不齊`).toEqual(expected);
        for (const id of expected) {
          expect((q.choiceExplanations as Record<string, string>)[id].trim().length, `${q.id} ${id}`).toBeGreaterThan(0);
        }
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
