import { describe, it, expect } from "vitest";
import { getPracticeQuestions, getPracticeStats } from "../src/data/practice";
import { practiceTopics, topicLabel } from "../src/domain/assessmentTopics";
import type { ChoiceId } from "../src/data/types";

const subjects = ["junior-ai-basics", "junior-genai"];
const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];

describe("新題庫形狀契約", () => {
  it("未知科目回空陣列", () => {
    expect(getPracticeQuestions("nope")).toEqual([]);
  });

  for (const subjectId of subjects) {
    it(`${subjectId}：id 唯一且格式正確`, () => {
      const qs = getPracticeQuestions(subjectId);
      const ids = qs.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(new RegExp(`^${subjectId}-practice-q\\d{3}$`));
    });

    it(`${subjectId}：每題四個選項、答案合法、文字非空`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        expect(q.choices.map((c) => c.id), q.id).toEqual(choiceIds);
        for (const c of q.choices) expect(c.text.trim().length, `${q.id} ${c.id}`).toBeGreaterThan(0);
        expect(choiceIds, q.id).toContain(q.answer);
        expect(q.prompt.trim().length, q.id).toBeGreaterThan(0);
        expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
        expect(q.subjectId, q.id).toBe(subjectId);
        expect(q.source, q.id).toBe("generated");
      }
    });

    it(`${subjectId}：選項解析恰好涵蓋三個錯誤選項`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        const keys = Object.keys(q.choiceExplanations ?? {}).sort();
        const expected = choiceIds.filter((id) => id !== q.answer).sort();
        expect(keys, q.id).toEqual(expected);
        for (const key of keys) {
          expect((q.choiceExplanations as Record<string, string>)[key].trim().length, `${q.id} ${key}`)
            .toBeGreaterThan(0);
        }
      }
    });

    it(`${subjectId}：sourceRef 為五大產業之一`, () => {
      const industries = ["金融", "醫療", "工廠", "教育", "農業"];
      for (const q of getPracticeQuestions(subjectId)) {
        expect(industries, q.id).toContain(q.sourceRef);
      }
    });

    it(`${subjectId}：topic 為合法評鑑內容節點，且各節點不超額`, () => {
      const allowed = new Map(practiceTopics[subjectId].map((t) => [topicLabel(t), t.count]));
      const stats = getPracticeStats(subjectId);
      for (const [label, count] of Object.entries(stats.byTopic)) {
        expect(allowed.has(label), `未知主題：${label}`).toBe(true);
        expect(count, `${label} 超額`).toBeLessThanOrEqual(allowed.get(label)!);
      }
    });
  }
});

describe("junior-ai-basics 節點題數", () => {
  it("L11101 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11101 AI 的定義與分類"]).toBe(11);
  });
  it("L11102 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11102 AI 治理概念"]).toBe(11);
  });
  it("L11201 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11201 資料基本概念與來源"]).toBe(11);
  });
  it("L11202 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11202 資料整理與分析流程"]).toBe(11);
  });
  it("L11203 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11203 資料隱私與安全"]).toBe(11);
  });
});

describe("原題庫未受影響", () => {
  it("getQuestions 的題數不變", async () => {
    const { getQuestions } = await import("../src/data/index");
    expect(getQuestions("junior-ai-basics")).toHaveLength(222);
    expect(getQuestions("junior-genai")).toHaveLength(213);
  });
});

// 對整個新題庫（所有科目、所有批次）生效，避免出題時無意間排出可被規律破解的答案序列。
// 「相鄰字母不同」這種弱檢查抓不到 period-4 拉丁方塊；改用週期分組與區塊排列比例兩種檢查。
describe("答案字母序列：避免週期／區塊規律", () => {
  for (const subjectId of subjects) {
    it(`${subjectId}：週期分組內不得全部同一字母（樣本數 ≥3 時）`, () => {
      const answers = getPracticeQuestions(subjectId).map((q) => q.answer);
      for (let p = 2; p <= 6; p++) {
        for (let r = 0; r < p; r++) {
          const group = answers.filter((_, i) => i % p === r);
          if (group.length >= 3) {
            expect(new Set(group).size, `週期 p=${p} 餘數 r=${r}（樣本數 ${group.length}）`).toBeGreaterThan(1);
          }
        }
      }
    });

    it(`${subjectId}：連續四題一組恰為 ABCD 排列的區塊比例不得超過 50%`, () => {
      const answers = getPracticeQuestions(subjectId).map((q) => q.answer);
      const blocks: string[][] = [];
      for (let i = 0; i + 4 <= answers.length; i += 4) blocks.push(answers.slice(i, i + 4));
      if (blocks.length === 0) return; // 尚無題目時無從檢查，留給未來批次觸發
      const permCount = blocks.filter((b) => new Set(b).size === 4).length;
      expect(permCount / blocks.length, `${permCount}/${blocks.length} 個區塊恰為 ABCD 排列`).toBeLessThanOrEqual(
        0.5,
      );
    });
  }
});

// 常見簡體字集合，供偵測 LLM 撰題時誤用簡體字。此集合可視實際踩雷情況擴充，
// 不必求全——目標是攔住「看起來像繁體、實際夾雜簡體」這種容易被人眼掃過的錯字。
const SIMPLIFIED_CHARS = [
  "价", "见", "关", "数", "据", "网", "络", "术", "应", "产", "业", "华", "与", "为", "这", "个",
  "们", "时", "会", "学", "实", "现", "发", "后", "从", "员", "处", "复", "传", "组", "织", "结",
  "构", "认", "识", "记", "录", "变", "换", "优", "转", "联", "检", "测", "试", "验", "证", "类",
  "别", "题", "库",
];

describe("新題庫：不得含簡體字", () => {
  for (const subjectId of subjects) {
    it(`${subjectId}：prompt／選項文字／explanation／choiceExplanations 皆為繁體中文`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        const fields: Array<[string, string]> = [
          ["prompt", q.prompt],
          ["explanation", q.explanation],
          ...q.choices.map((c): [string, string] => [`choice ${c.id}`, c.text]),
          ...Object.entries(q.choiceExplanations ?? {}).map(
            ([k, v]): [string, string] => [`choiceExplanations.${k}`, v as string],
          ),
        ];
        for (const [field, text] of fields) {
          for (const ch of SIMPLIFIED_CHARS) {
            expect(text.includes(ch), `${q.id} ${field} 疑似含簡體字「${ch}」：${text}`).toBe(false);
          }
        }
      }
    });
  }
});
