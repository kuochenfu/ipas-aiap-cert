import { describe, expect, it } from "vitest";
import { aiotAbbreviations, aiotStudyNotes, aiotExamOverview } from "../src/data/studyNotes.aiot";
import { aiotNodes } from "../src/domain/assessmentTopics";

const allCodes = Object.values(aiotNodes).flat().map((n) => n.code);

describe("AIoT 縮寫清單", () => {
  it("縮寫不重複", () => {
    const terms = aiotAbbreviations.map((a) => a.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  it("每筆都有全名，且掛在存在的節點上", () => {
    for (const abbr of aiotAbbreviations) {
      expect(abbr.full.trim().length, `${abbr.term} 沒有全名`).toBeGreaterThan(0);
      expect(abbr.nodes.length, `${abbr.term} 沒有掛節點`).toBeGreaterThan(0);
      for (const node of abbr.nodes) {
        expect(allCodes, `${abbr.term} 掛在不存在的節點 ${node}`).toContain(node);
      }
    }
  });

  it("15 個節點都至少有一個縮寫", () => {
    for (const code of allCodes) {
      const count = aiotAbbreviations.filter((a) => a.nodes.includes(code)).length;
      expect(count, `${code} 沒有任何縮寫`).toBeGreaterThan(0);
    }
  });

  // 縮寫只有一份來源：節點的「重要縮寫」表由清單生成，不是另外手寫一份。
  // 這條測試就是在守住「不會兩處漂移」這個設計。
  it("每個節點的「重要縮寫」表列數等於清單中屬於它的筆數", () => {
    for (const [subjectId, nodes] of Object.entries(aiotStudyNotes)) {
      for (const [code, sections] of Object.entries(nodes)) {
        const section = sections.find((s) => s.heading === "重要縮寫");
        expect(section, `${subjectId} ${code} 沒有重要縮寫`).toBeDefined();
        const table = section!.items[0]?.table;
        expect(table, `${code} 的重要縮寫不是表格`).toBeDefined();
        expect(table!.headers).toEqual(["縮寫", "全名", "中文"]);
        const expected = aiotAbbreviations.filter((a) => a.nodes.includes(code));
        expect(table!.rows.map((r) => r[0])).toEqual(expected.map((a) => a.term));
      }
    }
  });
});

describe("AIoT 筆記的型別使用", () => {
  const allItems = Object.values(aiotStudyNotes)
    .flatMap((nodes) => Object.values(nodes))
    .flat()
    .flatMap((section) => section.items);

  it("表格的每一列欄數都與表頭相同", () => {
    const tables = [...allItems, ...aiotExamOverview.flatMap((s) => s.items)]
      .map((item) => item.table)
      .filter((t) => t !== undefined);
    expect(tables.length).toBeGreaterThan(20);
    for (const table of tables) {
      for (const row of table!.rows) {
        expect(row.length, `表格「${table!.headers.join("/")}」有列數不符`).toBe(table!.headers.length);
      }
    }
  });

  it("公式與流程都有內容", () => {
    for (const item of allItems) {
      if (item.formula) expect(item.formula.expr.trim().length).toBeGreaterThan(0);
      if (item.flow) expect(item.flow.length).toBeGreaterThan(1);
    }
  });

  it("九個考科一節點的公式與計算一節都有內容", () => {
    for (const [code, sections] of Object.entries(aiotStudyNotes["aiot-junior-basics"])) {
      const formulaSection = sections.find((s) => s.heading === "公式與計算");
      expect(formulaSection!.items.length, `${code} 的公式與計算為空`).toBeGreaterThan(0);
    }
  });
});

describe("AIoT 考科一的選項解析覆蓋", () => {
  it("80 題都有三條錯誤選項解析，且不含正解", async () => {
    const { getQuestions } = await import("../src/data/index");
    const questions = getQuestions("aiot-junior-basics");
    expect(questions).toHaveLength(80);
    for (const q of questions) {
      const ids = Object.keys(q.choiceExplanations ?? {});
      expect(ids.sort(), `${q.id} 的錯誤選項解析不是三條`).toHaveLength(3);
      expect(ids, `${q.id} 把正解也寫進選項解析`).not.toContain(q.answer);
      for (const [id, text] of Object.entries(q.choiceExplanations ?? {})) {
        // 與五科同一個門檻：擋殘句與佔位字串，不擋寫得精簡但完整的解析。
        expect(text.trim().length, `${q.id} 的 ${id} 過短`).toBeGreaterThanOrEqual(20);
      }
    }
  });

  it("每題都有非空詳解", async () => {
    const { getQuestions } = await import("../src/data/index");
    for (const q of getQuestions("aiot-junior-basics")) {
      expect(q.explanation.trim().length, `${q.id} 詳解為空`).toBeGreaterThan(0);
    }
  });
});

describe("AIoT 考科二自編題庫", () => {
  it("六個節點各 10 題，共 60 題，id 不重複", async () => {
    const { getQuestions } = await import("../src/data/index");
    const questions = getQuestions("aiot-junior-iot");
    expect(questions).toHaveLength(60);
    expect(new Set(questions.map((q) => q.id)).size).toBe(60);
    const counts: Record<string, number> = {};
    for (const q of questions) counts[q.topic] = (counts[q.topic] ?? 0) + 1;
    expect(counts).toEqual({
      "B1.1 系統元件與架構": 10,
      "B1.2 簡易系統故障問題判斷與排除": 10,
      "B1.3 物聯網資訊安全": 10,
      "B2.1 物聯網硬體設計基礎": 10,
      "B2.2 雲端環境數據收集與平台設計": 10,
      "B2.3 智慧製造流程優化與成本控制": 10,
    });
  });

  it("每題四個非空選項、答案在 A–D、詳解與三條選項解析俱全", async () => {
    const { getQuestions } = await import("../src/data/index");
    for (const q of getQuestions("aiot-junior-iot")) {
      expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
      expect(q.choices.every((c) => c.text.trim().length > 0)).toBe(true);
      expect(["A", "B", "C", "D"]).toContain(q.answer);
      expect(q.explanation.trim().length, `${q.id} 詳解過短`).toBeGreaterThan(20);
      const ids = Object.keys(q.choiceExplanations ?? {});
      expect(ids, `${q.id} 的錯誤選項解析不是三條`).toHaveLength(3);
      expect(ids, `${q.id} 把正解也寫進選項解析`).not.toContain(q.answer);
    }
  });

  // 這一科沒有任何官方題源，來源標示必須誠實，否則會被誤讀成官方題目。
  it("全數標記為自編新題", async () => {
    const { getQuestions } = await import("../src/data/index");
    for (const q of getQuestions("aiot-junior-iot")) {
      expect(q.source).toBe("generated");
      expect(q.sourceRef).toContain("非官方");
    }
  });
});
