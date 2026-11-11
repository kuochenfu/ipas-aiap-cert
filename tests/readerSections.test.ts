import { describe, expect, it } from "vitest";
import { groupReaderSections } from "../src/domain/readerSections";
import { studyNotes } from "../src/data/studyNotes";
import { aiotStudyNotes } from "../src/data/studyNotes.aiot";
import { subjects } from "../src/domain/catalog";
import type { StudyNoteItem, StudyNoteSection } from "../src/data/types";

const section = (heading: string): StudyNoteSection => ({
  heading,
  items: [{ text: `內容：${heading}`, children: [{ text: "原有的例子" }] }],
});

const walk = (items: StudyNoteItem[]): StudyNoteItem[] =>
  items.flatMap((item) => [item, ...walk(item.children ?? [])]);

const visualItems = (sections: StudyNoteSection[]): StudyNoteItem[] =>
  sections.flatMap((entry) => walk(entry.items)).filter((item) => item.visual);

const freezeSection = (entry: StudyNoteSection): void => {
  for (const item of walk(entry.items)) {
    if (item.children) Object.freeze(item.children);
    Object.freeze(item);
  }
  Object.freeze(entry.items);
  Object.freeze(entry);
};

describe("閱讀器的講義、白話解說與補充分組", () => {
  it("講義排最前，各組內保留原順序，A／A2／A3／B 仍在補充重點", () => {
    const input = [
      section("補充 C｜L231 白話學習地圖（非官方講義）"),
      section("3.1 機率與統計"),
      section("補充 A｜題庫重點（非官方講義）"),
      section("未分類筆記"),
      section("3.2 線性代數"),
      section("補充 A2｜其他重點（非官方講義）"),
      section("補充 A3｜其他重點（非官方講義）"),
      section("補充 B｜技術現況（非官方講義）"),
      section("補充 C｜L23101 白話例子（非官方講義）"),
    ];
    const groups = groupReaderSections(input, "guide");
    expect(groups.map(({ kind, title, source }) => ({ kind, title, source }))).toEqual([
      { kind: "lecture", title: "學習講義", source: "學習指引整理" },
      { kind: "learning", title: "白話解說與圖解", source: "非官方講義" },
      { kind: "supplement", title: "補充重點", source: "非官方講義" },
      { kind: "notes", title: "其他筆記", source: "筆記整理" },
    ]);
    expect(groups.map((group) => group.sections.map((entry) => entry.index))).toEqual([
      [1, 4], [0, 8], [2, 5, 6, 7], [3],
    ]);
    expect(groups.every((group) => group.description.trim().length > 0)).toBe(true);
  });

  it("不修改凍結的來源、原 section 或項目參照，也不遺漏重複標題", () => {
    const first = section("3.1 原講義");
    const duplicate = section("3.1 原講義");
    const learning = section("補充 C｜L23101 例子（非官方講義）");
    const input = [learning, first, duplicate];
    const itemReferences = input.map((entry) => entry.items[0]);
    const before = JSON.stringify(input);
    input.forEach(freezeSection);
    Object.freeze(input);
    const entries = groupReaderSections(input, "guide").flatMap((group) => group.sections);
    expect(JSON.stringify(input)).toBe(before);
    expect(entries).toHaveLength(input.length);
    expect(entries.map((entry) => entry.index)).toEqual([1, 2, 0]);
    for (const entry of entries) {
      expect(entry.section).toBe(input[entry.index]);
      expect(entry.section.items[0]).toBe(itemReferences[entry.index]);
    }
  });

  it("分組改變畫面順序後，仍以原始索引產生相同錨點", () => {
    const input = [section("補充 C｜L231 學習地圖"), section("3.1 原講義"), section("補充 A｜重點")];
    const notes = groupReaderSections(input);
    const guide = groupReaderSections(input, "guide");
    const guideEntries = guide.flatMap((group) => group.sections);
    expect(guideEntries.map(({ id }) => id)).toEqual(["sec-1", "sec-0", "sec-2"]);
    for (const entry of guideEntries) {
      expect(entry.id).toBe(notes[0].sections[entry.index].id);
      expect(entry.id).toBe(`sec-${entry.index}`);
    }
  });

  it("只有精確的補充 C｜前綴才歸白話解說，不假定未知標題來自講義", () => {
    const input = [section("補充 C2｜延伸"), section("補充 C | 其他格式"), section("3.1沒有空白"), section("自由整理")];
    const groups = groupReaderSections(input, "guide");
    expect(groups.map(({ kind }) => kind)).toEqual(["supplement", "notes"]);
    expect(groups[0].sections.map(({ index }) => index)).toEqual([0, 1]);
    expect(groups[1].sections.map(({ index }) => index)).toEqual([2, 3]);
    expect(groups.some(({ source }) => source === "學習指引整理")).toBe(false);
  });

  it("省略空群組；空頁不建立標題，只有導讀時也不生成空講義", () => {
    expect(groupReaderSections([])).toEqual([]);
    expect(groupReaderSections([], "guide")).toEqual([]);
    expect(groupReaderSections([section("補充 C｜L231 學習地圖")], "guide").map(({ kind }) => kind))
      .toEqual(["learning"]);
  });

  it("預設筆記頁維持原順序，即使標題像講義或補充也不宣稱是官方來源", () => {
    const input = [section("補充 C｜導讀"), section("3.1 自編例子"), section("備考總整理")];
    const groups = groupReaderSections(input);
    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ kind: "notes", title: "重點筆記", source: "備考整理" });
    expect(groups[0].sections.map((entry) => entry.section)).toEqual(input);
    expect(groups[0].sections.map(({ id }) => id)).toEqual(["sec-0", "sec-1", "sec-2"]);
  });
});

describe("真實教材的閱讀順序與圖解保留", () => {
  it("AI 應用規劃師全部 18 單元先列講義，並保留全部原段落與 45 張教學圖", () => {
    const aiapIds = subjects.filter((subject) => subject.cert === "aiap").map((subject) => subject.id);
    let units = 0;
    let visualsBefore = 0;
    let visualsAfter = 0;
    for (const subjectId of aiapIds) {
      for (const [code, sections] of Object.entries(studyNotes[subjectId])) {
        units++;
        const groups = groupReaderSections(sections, "guide");
        expect(groups[0]?.kind, `${subjectId}/${code} 講義應在最前`).toBe("lecture");
        const entries = groups.flatMap((group) => group.sections);
        expect(entries, `${subjectId}/${code} 原有段落不得遺漏`).toHaveLength(sections.length);
        expect(entries.map((entry) => entry.index).sort((a, b) => a - b)).toEqual(sections.map((_, index) => index));
        for (const entry of entries) {
          expect(entry.section).toBe(sections[entry.index]);
          expect(entry.id).toBe(`sec-${entry.index}`);
        }
        const before = visualItems(sections);
        const after = visualItems(entries.map((entry) => entry.section));
        visualsBefore += before.length;
        visualsAfter += after.length;
        expect(after).toHaveLength(before.length);
        for (const item of before) expect(after.includes(item)).toBe(true);
      }
    }
    expect(units).toBe(18);
    expect(visualsBefore).toBe(45);
    expect(visualsAfter).toBe(45);
  });

  it("AIoT 全部 15 節點仍是備考整理，且維持公式、易混淆等原分節順序", () => {
    let nodes = 0;
    for (const topics of Object.values(aiotStudyNotes)) {
      for (const sections of Object.values(topics)) {
        nodes++;
        const groups = groupReaderSections(sections, "notes");
        expect(groups).toHaveLength(1);
        expect(groups[0]).toMatchObject({ kind: "notes", title: "重點筆記", source: "備考整理" });
        groups[0].sections.forEach((entry, index) => {
          expect(entry.section).toBe(sections[index]);
          expect(entry.index).toBe(index);
          expect(entry.id).toBe(`sec-${index}`);
        });
      }
    }
    expect(nodes).toBe(15);
  });
});
