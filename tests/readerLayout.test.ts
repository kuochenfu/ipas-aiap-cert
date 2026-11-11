// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderStudyReader } from "../src/ui/render";
import { studyNotes } from "../src/data/studyNotes";
import { aiotStudyNotes } from "../src/data/studyNotes.aiot";
import { subjects } from "../src/domain/catalog";
import type { StudyNoteSection, StudyNotesBySubject } from "../src/data/types";

const reader = (notes: StudyNotesBySubject, subjectId: string, code: string): HTMLDivElement => {
  const container = document.createElement("div");
  container.innerHTML = renderStudyReader({ page: { kind: "node", subjectId, code }, notes });
  return container;
};

const noteSections = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(".reader-body .study-note-section"));

const contentGroups = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(".reader-body > .reader-content-group:not(.is-resources)"));

const kindOf = (element: HTMLElement): string =>
  Array.from(element.classList).find((name) => name.startsWith("is-"))?.slice(3) ?? "";

const visibleHeading = (section: StudyNoteSection): string =>
  section.heading.replace(/^補充 C｜/, "").replace(/（非官方講義）$/, "");

const aiapIds = subjects.filter((subject) => subject.cert === "aiap").map((subject) => subject.id);

const fixtureSection = (heading: string, text: string): StudyNoteSection => ({
  heading,
  items: [{ text }],
});

describe("閱讀器以講義、白話圖解、補充重點安排閱讀", () => {
  it("AIAP 全部18單元先呈現原講義，保留每個原始錨點、段落與45張圖解", () => {
    const before = JSON.stringify(studyNotes);
    let units = 0;
    let visualCount = 0;
    for (const subjectId of aiapIds) {
      for (const [code, sections] of Object.entries(studyNotes[subjectId])) {
        units += 1;
        const container = reader(studyNotes, subjectId, code);
        const rendered = noteSections(container);
        const groups = contentGroups(container);
        expect(groups[0]?.classList.contains("is-lecture"), `${subjectId}/${code}`).toBe(true);
        expect(rendered[0]?.querySelector(".study-note-title")?.textContent, `${subjectId}/${code}`).toMatch(/^\d+\.\d+\s/);
        expect(rendered, `${subjectId}/${code} 不得丟掉段落`).toHaveLength(sections.length);
        expect(new Set(rendered.map((section) => section.id)).size).toBe(sections.length);

        for (const [index, section] of sections.entries()) {
          const actual = container.querySelector<HTMLElement>(`.reader-body #sec-${index}`);
          expect(actual, `${subjectId}/${code} sec-${index}`).not.toBeNull();
          expect(actual?.querySelector(".study-note-title")?.textContent).toBe(visibleHeading(section));
          const firstItem = section.items[0];
          if (firstItem) expect(actual?.textContent).toContain(firstItem.text);
        }

        const expectedKinds = [
          "lecture",
          ...(sections.some((section) => section.heading.startsWith("補充 C｜")) ? ["learning"] : []),
          ...(sections.some((section) => section.heading.startsWith("補充") && !section.heading.startsWith("補充 C｜")) ? ["supplement"] : []),
        ];
        expect(groups.map(kindOf), `${subjectId}/${code} 的來源分組`).toEqual(expectedKinds);
        expect(groups[0]?.querySelector(".reader-group-source")?.textContent).toBe("學習指引整理");
        for (const group of groups.filter((entry) => entry.matches(".is-learning, .is-supplement"))) {
          expect(group.querySelector(".reader-group-source")?.textContent).toBe("非官方講義");
        }

        if (sections[0]?.heading.startsWith("補充 C｜")) {
          // 原資料不重排，因此 sec-0 仍是導讀；畫面上它要出現在講義之後。
          const map = container.querySelector(".is-learning #sec-0");
          expect(map).not.toBeNull();
          expect(rendered.indexOf(map as HTMLElement)).toBeGreaterThan(0);
        }
        const visuals = container.querySelectorAll("figure.study-visual").length;
        visualCount += visuals;
        expect(container.querySelectorAll('figure.study-visual svg[role="img"]')).toHaveLength(visuals);
      }
    }
    expect(units).toBe(18);
    expect(visualCount).toBe(45);
    expect(JSON.stringify(studyNotes)).toBe(before);
  });

  it("桌面分組目錄與手機選單沿同一閱讀順序，每個值都指向實際段落", () => {
    for (const subjectId of aiapIds) {
      for (const code of Object.keys(studyNotes[subjectId])) {
        const container = reader(studyNotes, subjectId, code);
        const sections = Array.from(container.querySelectorAll<HTMLElement>(".reader-body .reader-section[id]"));
        const expectedIds = sections.map((section) => section.id);
        const chips = Array.from(container.querySelectorAll<HTMLButtonElement>(".reader-toc-chip"));
        const select = container.querySelector<HTMLSelectElement>("select[data-reader-section]");
        expect(select, `${subjectId}/${code} 手機段落選單`).not.toBeNull();
        expect(chips.map((chip) => chip.dataset.studyJump)).toEqual(expectedIds);
        expect(Array.from(select!.options).map((option) => option.value)).toEqual(expectedIds);

        const tocGroups = Array.from(container.querySelectorAll<HTMLElement>(".reader-toc-group"));
        const optgroups = Array.from(select!.querySelectorAll("optgroup"));
        expect(tocGroups).toHaveLength(optgroups.length);
        for (const [index, tocGroup] of tocGroups.entries()) {
          const label = tocGroup.querySelector(".reader-toc-label")?.cloneNode(true) as HTMLElement;
          label.querySelector("span")?.remove();
          expect(optgroups[index].label).toBe(label.textContent?.trim());
          expect(Array.from(optgroups[index].querySelectorAll("option")).map((option) => option.value))
            .toEqual(Array.from(tocGroup.querySelectorAll<HTMLElement>(".reader-toc-chip")).map((chip) => chip.dataset.studyJump));
        }
        for (const id of expectedIds) expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
      }
    }
  });

  it("AIoT全部15節點保持七類備考筆記，不誤標成官方講義，速記仍能找到公式與易混淆", () => {
    const expectedHeadings = ["必懂觀念", "重要縮寫", "容易混淆", "公式與計算", "實務案例", "可能考法", "推薦資源"];
    let nodes = 0;
    for (const [subjectId, topics] of Object.entries(aiotStudyNotes)) {
      for (const [code, sections] of Object.entries(topics)) {
        nodes += 1;
        const container = reader(aiotStudyNotes, subjectId, code);
        const rendered = noteSections(container);
        const groups = contentGroups(container);
        expect(groups).toHaveLength(1);
        expect(groups[0].classList.contains("is-notes")).toBe(true);
        expect(rendered.map((section) => section.querySelector(".study-note-title")?.textContent)).toEqual(expectedHeadings);
        expect(rendered.map((section) => section.id)).toEqual(sections.map((_, index) => `sec-${index}`));
        const labels = Array.from(container.querySelectorAll(".reader-source, .reader-group-title, .reader-group-source, .reader-toc-label"))
          .map((element) => element.textContent).join(" ");
        expect(labels).toContain("備考整理");
        expect(labels).not.toMatch(/學習講義|學習指引整理/);
        expect(container.querySelector('.reader-section[data-note-section="formula"] .study-note-title')?.textContent).toBe("公式與計算");
        expect(container.querySelector('.reader-section[data-note-section="confuse"] .study-note-title')?.textContent).toBe("容易混淆");
        expect(container.querySelector('[data-study-action="cram"]')).not.toBeNull();
        expect(container.querySelector('select[data-reader-section] option[data-note-section="formula"]')?.getAttribute("value")).toBe("sec-3");
        expect(container.querySelector('select[data-reader-section] option[data-note-section="confuse"]')?.getAttribute("value")).toBe("sec-2");
      }
    }
    expect(nodes).toBe(15);
  });

  it("未知或重複標題仍可閱讀，組內不按名稱重排，也不把補充誤認為講義", () => {
    const sections = [
      fixtureSection("未分類筆記", "未分類第一段完整內容"),
      fixtureSection("補充 B｜近期整理（非官方講義）", "補充B完整內容"),
      fixtureSection("3.2 原講義第二節", "講義第二節完整內容"),
      fixtureSection("補充 C｜L231 白話學習地圖：例子（非官方講義）", "白話例子完整內容"),
      fixtureSection("3.1 原講義第一節", "講義第一節完整內容"),
      fixtureSection("補充 A2｜延伸概念（非官方講義）", "補充A2完整內容"),
      fixtureSection("未分類筆記", "未分類第二段完整內容"),
    ];
    const notes: StudyNotesBySubject = { "senior-ml": { L231: sections } };
    const before = JSON.stringify(notes);
    const container = reader(notes, "senior-ml", "L231");
    expect(noteSections(container).map((section) => section.id)).toEqual(["sec-2", "sec-4", "sec-3", "sec-1", "sec-5", "sec-0", "sec-6"]);
    expect(contentGroups(container).map(kindOf)).toEqual(["lecture", "learning", "supplement", "notes"]);
    expect(container.querySelectorAll(".is-notes .study-note-section")).toHaveLength(2);
    for (const section of sections) expect(container.textContent).toContain(section.items[0].text);
    expect(container.querySelector(".is-notes .reader-group-source")?.textContent).toBe("筆記整理");
    expect(JSON.stringify(notes)).toBe(before);
  });

  it("來源群組用h2、原分節用h3，群組容器不攔截朗讀或速記的分節選擇", () => {
    const container = reader(studyNotes, "senior-ml", "L231");
    for (const group of contentGroups(container)) {
      expect(group.matches(".reader-section, .study-note-section")).toBe(false);
      expect(group.querySelector(".reader-group-title")?.tagName).toBe("H2");
      for (const section of group.querySelectorAll(".study-note-section")) {
        expect(section.querySelector(".study-note-title")?.tagName).toBe("H3");
        const tts = section.querySelector("[data-tts-section]");
        expect(tts).not.toBeNull();
        expect(tts?.closest(".study-note-section")).toBe(section);
      }
    }
  });
});
