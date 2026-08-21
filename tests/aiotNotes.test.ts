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
