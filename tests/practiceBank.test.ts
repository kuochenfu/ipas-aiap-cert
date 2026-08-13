import { describe, it, expect } from "vitest";
import { getPracticeQuestions, getPracticeStats, practiceSubjectIds } from "../src/data/practice";
import { practiceTopics, topicLabel } from "../src/domain/assessmentTopics";
import type { ChoiceId, Question } from "../src/data/types";

// 從 banks registry 推導科目清單，避免這裡與 src/data/practice/index.ts 各自維護一份、日後加科目卻漏改。
const subjects = practiceSubjectIds;
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
  it("L11301 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11301 機器學習基本原理"]).toBe(11);
  });
  it("L11302 有 12 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11302 常見的機器學習模型"]).toBe(12);
  });
  it("L11401 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11401 鑑別式 AI 與生成式 AI 的基本原理"]).toBe(11);
  });
  it("L11402 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11402 鑑別式 AI 與生成式 AI 的整合應用"]).toBe(11);
  });
  it("整科合計 100 題", () => {
    expect(getPracticeStats("junior-ai-basics").total).toBe(100);
  });
});

describe("junior-genai 節點題數", () => {
  it("L12101 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12101 No Code / Low Code 的基本概念"]).toBe(14);
  });
  it("L12102 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12102 No Code / Low Code 的優勢與限制"]).toBe(14);
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
//
// 重要：檢查的顆粒度是「每個評鑑內容節點（topic）」，不是整個題庫從頭連續切。
// 曾經踩過的坑——把 33 題的區塊檢查以整個 55 題題庫連續切，結果本批（q023–q055）
// 內部 8/8 區塊恰為 ABCD 排列、且每隔 4 題連續 6 題同為 B，但因為前面 22 題把切割
// 邊界錯開了，在全題庫尺度只呈現為 4/13 ≈ 30.8%，低於 50% 門檻，測試因此沒抓到。
// 「相鄰字母不同」這種弱檢查同樣抓不到 period-4 拉丁方塊。
function periodViolations(answers: string[]): string[] {
  const problems: string[] = [];
  for (let p = 2; p <= 6; p++) {
    for (let r = 0; r < p; r++) {
      const group = answers.filter((_, i) => i % p === r);
      if (group.length >= 3 && new Set(group).size === 1) {
        problems.push(`p=${p} r=${r}（樣本數 ${group.length}，皆為 ${group[0]}）`);
      }
    }
  }
  return problems;
}

function blockPermutationRatio(answers: string[]): number {
  const blocks: string[][] = [];
  for (let i = 0; i + 4 <= answers.length; i += 4) blocks.push(answers.slice(i, i + 4));
  if (blocks.length === 0) return 0;
  const permCount = blocks.filter((b) => new Set(b).size === 4).length;
  return permCount / blocks.length;
}

function groupAnswersByTopic(questions: Question[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const q of questions) {
    (groups[q.topic] ??= []).push(q.answer);
  }
  return groups;
}

describe("答案字母序列：避免週期／區塊規律（以每個評鑑內容節點為單位）", () => {
  // 回歸證據：這是 2026-08-13 L112 批次初版實際寫出的序列（q023–q055，依節點切成
  // L11201／L11202／L11203 各 11 題，與正式資料的節點邊界一致）。三個節點的連續
  // 四題區塊「恰為 ABCD 排列」的比例都是 100%，其中兩個節點還有明確的週期違規。
  // 檢查函式本身必須能攔下它，否則「檢查」只是裝飾——這正是上一輪複審發現的問題
  // （用有缺陷的序列去跑舊版「整個題庫連續切」的測試，測試卻通過）。
  it("檢查函式有效：舊版有缺陷的序列（依節點切分）必須被判定為不合格", () => {
    const buggyByTopic = {
      L11201: "CADBADCBDAC".split(""),
      L11202: "BDCABDACBDA".split(""),
      L11203: "CBADBCADBCD".split(""),
    };
    for (const [topic, answers] of Object.entries(buggyByTopic)) {
      expect(blockPermutationRatio(answers), `${topic} 應被區塊檢查攔下`).toBeGreaterThan(0.5);
    }
    expect(periodViolations(buggyByTopic.L11201).length, "L11201 應有週期違規").toBeGreaterThan(0);
    expect(periodViolations(buggyByTopic.L11202).length, "L11202 應有週期違規").toBeGreaterThan(0);
  });

  for (const subjectId of subjects) {
    it(`${subjectId}：各評鑑內容節點內，週期分組不得全部同一字母（樣本數 ≥3 時）`, () => {
      const groups = groupAnswersByTopic(getPracticeQuestions(subjectId));
      for (const [topic, answers] of Object.entries(groups)) {
        const violations = periodViolations(answers);
        expect(violations, `${topic}：${violations.join("；")}`).toEqual([]);
      }
    });

    it(`${subjectId}：各評鑑內容節點內，連續四題一組恰為 ABCD 排列的區塊比例不得超過 50%`, () => {
      const groups = groupAnswersByTopic(getPracticeQuestions(subjectId));
      for (const [topic, answers] of Object.entries(groups)) {
        const ratio = blockPermutationRatio(answers);
        expect(ratio, `${topic} 排列區塊比例 ${ratio}`).toBeLessThanOrEqual(0.5);
      }
    });
  }
});

// 常見簡體字集合，供偵測 LLM 撰題時誤用簡體字。此集合可視實際踩雷情況擴充，
// 不必求全——目標是攔住「看起來像繁體、實際夾雜簡體」這種容易被人眼掃過的錯字。
// 「后」刻意不列入：它在繁體中文裡本身是合法字（皇后、太后），列入會誤判。
const SIMPLIFIED_CHARS = [
  "价", "见", "关", "数", "据", "网", "络", "术", "应", "产", "业", "华", "与", "为", "这", "个",
  "们", "时", "会", "学", "实", "现", "发", "从", "员", "处", "复", "传", "组", "织", "结",
  "构", "认", "识", "记", "录", "变", "换", "优", "转", "联", "检", "测", "试", "验", "证", "类",
  "别", "题", "库",
  "资", "银", "风", "险", "规", "则", "训", "练", "输", "护", "议", "备", "设", "习", "级", "导",
  "维", "监", "预", "译", "签",
  "统", "选", "对", "确", "语", "问",
];

describe("新題庫：不得含簡體字", () => {
  for (const subjectId of subjects) {
    it(`${subjectId}：prompt／選項文字／explanation／choiceExplanations／topic／sourceRef 皆為繁體中文`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        const fields: Array<[string, string]> = [
          ["prompt", q.prompt],
          ["explanation", q.explanation],
          ["topic", q.topic],
          ["sourceRef", q.sourceRef ?? ""],
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
