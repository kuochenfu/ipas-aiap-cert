// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { applyLectureEdits, editLectureSection, lectureEdits } from "../src/data/studyLectureEdits";
import { studyNotes } from "../src/data/studyNotes";
import { renderStudyReader } from "../src/ui/render";
import type { StudyNoteItem, StudyNoteSection } from "../src/data/types";

const walk = (items: StudyNoteItem[]): StudyNoteItem[] => items.flatMap(item => [item, ...walk(item.children ?? [])]);
const lectures = Object.entries(studyNotes).flatMap(([subjectId, topics]) => Object.entries(topics).flatMap(([topic, sections]) => sections.filter(section => /^\d+\.\d+\s/.test(section.heading)).map(section => ({ subjectId, topic, section }))));

describe("講義語句編輯與穿插案例", () => {
  it("五科41節講義全覆蓋，每節有兩個對應的自編實務案例", () => {
    expect(lectures).toHaveLength(41);
    expect(lectureEdits).toHaveLength(41);
    expect(new Set(lectureEdits.map(edit => `${edit.topic}:${edit.chapter}`)).size).toBe(41);
    for (const { topic, section } of lectures) {
      const edit = lectureEdits.find(edit => edit.topic === topic && section.heading.startsWith(`${edit.chapter} `));
      expect(edit, section.heading).toBeDefined();
      expect(edit!.rewrites.length, section.heading).toBeGreaterThan(0);
      expect(walk(section.items).filter(item => item.example), section.heading).toHaveLength(2);
    }
  });
  it("編輯保留其他段落、表格和公式，例子插在指定位置，不修改原物件", () => {
    const table = { headers: ["數值"], rows: [["0.05"]] };
    const original: StudyNoteSection = { heading: "3.1 測試", items: [{ text: "原句：抽象描述", children: [{ text: "子段落保留" }] }, { text: "表格保留", table }] };
    const snapshot = JSON.stringify(original);
    const revised = editLectureSection(original, { topic: "T", chapter: "3.1", rewrites: [{ at: [0], starts: "原句", text: "修訂：清楚說明" }], examples: [{ after: [0], title: "訂單例子", paragraphs: ["用實際工作說明概念。"] }] });
    expect(JSON.stringify(original)).toBe(snapshot);
    expect(revised.items.map(item => item.text)).toEqual(["修訂：清楚說明", "訂單例子", "表格保留"]);
    expect(revised.items[0].children?.[0].text).toBe("子段落保留");
    expect(revised.items[2].table).toBe(table);
    expect(revised.items[1].example?.id).toBe("T:3.1:0");
  });
  it("來源位置或文字變更時會報錯，避免把修訂套到別的概念", () => {
    const section: StudyNoteSection = { heading: "3.1 測試", items: [{ text: "不同的內容" }] };
    expect(() => editLectureSection(section, { topic: "T", chapter: "3.1", rewrites: [{ at: [0], starts: "原句", text: "新句" }], examples: [] })).toThrow(/編輯位置已變更/);
    expect(() => editLectureSection(section, { topic: "T", chapter: "3.1", rewrites: [], examples: [{ after: [1], title: "例子", paragraphs: ["內容"] }] })).toThrow(/位置不存在/);
  });
  it("所有82個例子實際出現在講義正文，來源清楚，45張圖解仍保留", () => {
    let examples = 0;
    let visuals = 0;
    for (const [subjectId, topics] of Object.entries(studyNotes)) for (const topic of Object.keys(topics)) {
      const root = document.createElement("div");
      root.innerHTML = renderStudyReader({ page: { kind: "node", subjectId, code: topic }, notes: studyNotes });
      examples += root.querySelectorAll(".is-lecture .lecture-example").length;
      visuals += root.querySelectorAll("figure.study-visual").length;
      expect(root.querySelectorAll(".is-lecture .lecture-example-label").length).toBe(root.querySelectorAll(".lecture-example").length);
      expect(root.querySelectorAll(".is-lecture > .study-note-section > ul")).toHaveLength(0);
    }
    expect(examples).toBe(82);
    expect(visuals).toBe(45);
  });
  it("統計用語不再混淆四分位距、變異係數與p值", () => {
    const section = studyNotes["junior-ai-basics"].L112.find(section => section.heading.startsWith("3.2 "))!;
    const text = walk(section.items).map(item => item.text).join(" ");
    expect(text).toContain("IQR＝Q3−Q1");
    expect(text).toContain("變異係數（Coefficient of Variation, CV）");
    expect(text).toContain("p 值不是 H0 為真的機率");
    expect(text).not.toContain("與全距有一樣的缺點");
    expect(text).not.toContain("變異數（Coefficient of Variation）");
  });
  it("重複整合不會重複插入案例，補充內容也不被改寫", () => {
    expect(applyLectureEdits(studyNotes)).toEqual(studyNotes);
    const custom = { custom: { X: [{ heading: "補充 A｜保留", items: [{ text: "原有補充內容" }] }] } };
    const result = applyLectureEdits(custom);
    expect(result.custom.X[0]).toBe(custom.custom.X[0]);
  });
});
