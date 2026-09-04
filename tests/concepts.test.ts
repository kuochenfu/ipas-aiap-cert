import { describe, it, expect } from "vitest";
import { concepts, conceptById, conceptsOf, normalizeForMatch } from "../src/domain/concepts";
import { conceptStats } from "../src/domain/diagnostics";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { getPracticeQuestions } from "../src/data/practice";
import type { ChoiceId, Question } from "../src/data/types";

const q = (prompt: string, concepts?: string[]): Question => ({
  id: `x-${prompt.slice(0, 6)}`, subjectId: "s", prompt,
  choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" },
    { id: "C", text: "c" }, { id: "D", text: "d" },
  ],
  answer: "A", explanation: "", topic: "L11101 甲", difficulty: "中", source: "generated",
  meta: concepts
    ? { cognitiveLevel: "L2", archetype: "Comparison", concepts }
    : undefined,
});

describe("受控概念詞彙的結構", () => {
  it("id 不重複", () => {
    const ids = concepts.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("id 為 kebab-case 英數，label 非空", () => {
    for (const entry of concepts) {
      expect(entry.id, entry.id).toMatch(/^[a-z0-9-]+$/);
      expect(entry.label.length, entry.id).toBeGreaterThan(0);
    }
  });

  it("每條別名正規化後至少兩字元——單字元會命中一切", () => {
    for (const entry of concepts) {
      for (const alias of [entry.label, ...entry.aliases]) {
        expect(normalizeForMatch(alias).length, `${entry.id}：${alias}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("同一條別名不會同時屬於兩個概念", () => {
    const owner = new Map<string, string>();
    for (const entry of concepts) {
      for (const alias of [entry.label, ...entry.aliases]) {
        const key = normalizeForMatch(alias);
        const previous = owner.get(key);
        expect(previous, `別名「${alias}」同時屬於 ${previous} 與 ${entry.id}`).toBeUndefined();
        owner.set(key, entry.id);
      }
    }
  });

  it("conceptById 找得到、找不到時回 undefined", () => {
    expect(conceptById("recall")?.label).toBe("召回率");
    expect(conceptById("not-a-concept")).toBeUndefined();
  });
});

describe("conceptsOf 的比對", () => {
  it("命中題幹中的關鍵詞", () => {
    const ids = conceptsOf(q("模型的召回率偏低，應如何調整？")).map((c) => c.id);
    expect(ids).toContain("recall");
  });

  it("命中命題標註裡的自由字串——這正是受控詞彙要解決的問題", () => {
    const ids = conceptsOf(q("某醫院模型的表現評估", ["漏診風險與召回率"])).map((c) => c.id);
    expect(ids).toContain("recall");
  });

  it("大小寫與空白不影響比對", () => {
    expect(conceptsOf(q("使用 Cross Validation 評估")).map((c) => c.id)).toContain("cross-validation");
    expect(conceptsOf(q("採用 K-Means 分群")).map((c) => c.id)).toContain("kmeans");
  });

  it("選項文字不納入比對——干擾選項提到的概念不是本題考點", () => {
    const question = q("下列何者最適合處理缺失值？");
    question.choices[1].text = "使用同態加密";
    expect(conceptsOf(question).map((c) => c.id)).not.toContain("homomorphic");
  });

  it("沒有命中時回空陣列而非丟例外", () => {
    expect(conceptsOf(q("這是一段完全無關的敘述"))).toEqual([]);
  });
});

describe("與真實題庫的覆蓋率", () => {
  const all = subjects.flatMap((subject) => [
    ...getQuestions(subject.id),
    ...getPracticeQuestions(subject.id),
  ]);

  it("至少七成題目能對上一個概念", () => {
    const matched = all.filter((question) => conceptsOf(question).length > 0).length;
    expect(matched / all.length).toBeGreaterThan(0.7);
  });

  it("單題命中的概念數不會失控（p90 不超過 5）", () => {
    // 命中太多代表別名過於寬鬆，弱點分析會被稀釋成雜訊。
    const counts = all.map((question) => conceptsOf(question).length).sort((a, b) => a - b);
    expect(counts[Math.floor(counts.length * 0.9)]).toBeLessThanOrEqual(5);
  });

  it("絕大多數概念在題庫中找得到題目", () => {
    // 完全沒有題目的概念代表詞彙表脫離了題庫，或是該考點還沒有題——後者是覆蓋缺口。
    const used = new Set<string>();
    for (const question of all) for (const concept of conceptsOf(question)) used.add(concept.id);
    expect(concepts.length - used.size).toBeLessThanOrEqual(5);
  });
});

describe("conceptStats", () => {
  const bank = [
    q("召回率與漏診", ["召回率"]),
    q("召回率的定義", ["召回率"]),
    q("提升召回率的做法", ["召回率"]),
    q("同態加密的特性", ["同態加密"]),
  ];
  bank.forEach((question, index) => { question.id = `q${index}`; });

  it("未達樣本門檻的概念不列入", () => {
    const answers: Record<string, ChoiceId> = { q0: "A", q1: "B", q2: "B", q3: "B" };
    const rows = conceptStats(bank, answers);
    expect(rows.map((row) => row.id)).toEqual(["recall"]);
    expect(rows[0]).toMatchObject({ answered: 3, correct: 1 });
  });

  it("未作答的題目不計入", () => {
    expect(conceptStats(bank, {})).toEqual([]);
  });

  it("答對率低的排前面", () => {
    const wide = [
      ...bank.slice(0, 3),
      q("同態加密 A"), q("同態加密 B"), q("同態加密 C"),
    ];
    wide.forEach((question, index) => { question.id = `w${index}`; });
    const answers: Record<string, ChoiceId> = {
      w0: "B", w1: "B", w2: "B", // 召回率 0/3
      w3: "A", w4: "A", w5: "B", // 同態加密 2/3
    };
    expect(conceptStats(wide, answers).map((row) => row.id)).toEqual(["recall", "homomorphic"]);
  });
});
