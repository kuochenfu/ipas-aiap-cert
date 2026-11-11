// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { studyNotes } from "../src/data/studyNotes";
import { attachStudyVisuals, studyVisualLessons } from "../src/data/studyVisuals";
import { seniorNodes } from "../src/domain/assessmentTopics";
import { countStudyVisuals, studyVisualText } from "../src/domain/studyVisuals";
import { renderStudyIndex, renderStudyReader } from "../src/ui/render";

const units: Record<string, string[]> = {
  "senior-ai-tech": ["L211", "L212", "L213"],
  "senior-bigdata": ["L221", "L222", "L223", "L224"],
  "senior-ml": ["L231", "L232", "L233", "L234"],
};

describe("中級教學圖解整合", () => {
  it("三科11個單元和34個官方細項各有一張圖解，置於對應導讀最前面", () => {
    const expected = [...Object.values(units).flat(), ...Object.values(seniorNodes).flat().map(node => node.code)];
    expect(Object.keys(studyVisualLessons).sort()).toEqual(expected.sort());
    expect(expected).toHaveLength(45);
    for (const [subject, codes] of Object.entries(units)) {
      for (const code of codes) {
        const fine = seniorNodes[subject].filter(node => node.code.startsWith(code)).map(node => node.code);
        const sections = studyNotes[subject][code];
        expect(countStudyVisuals(sections), code).toBe(fine.length + 1);
        for (const key of [code, ...fine]) {
          const section = sections.find(section => section.heading.startsWith(`補充 C｜${key} `));
          expect(section?.items[0], key).toEqual(studyVisualLessons[key]);
          expect(section?.heading).toContain("非官方講義");
        }
      }
    }
  });

  it("所有圖解有白話帶讀和例題，並使用五種真正的圖形編碼", () => {
    expect(new Set(Object.values(studyVisualLessons).map(lesson => lesson.visual.kind))).toEqual(new Set(["bars", "plot", "diagram", "matrix", "waffle"]));
    for (const [code, lesson] of Object.entries(studyVisualLessons)) {
      expect(lesson.visual.summary.length, code).toBeGreaterThan(30);
      expect(lesson.children.length, code).toBeGreaterThanOrEqual(3);
      expect(lesson.children.every(child => child.text.trim().length >= 20), code).toBe(true);
    }
  });

  it("真實教材的圖形資料完整、數值有效，分支沒有懸空或重疊節點", () => {
    for (const [code, { visual }] of Object.entries(studyVisualLessons)) {
      if (visual.kind === "diagram") {
        const ids = visual.nodes.map(node => node.id);
        expect(new Set(ids).size, code).toBe(ids.length);
        expect(new Set(visual.nodes.map(node => `${node.col},${node.row}`)).size, code).toBe(ids.length);
        for (const edge of visual.edges) {
          expect(ids, code).toContain(edge.from);
          expect(ids, code).toContain(edge.to);
        }
      } else if (visual.kind === "matrix") {
        expect(visual.values, code).toHaveLength(visual.rowLabels.length);
        for (const row of visual.values) {
          expect(row, code).toHaveLength(visual.columnLabels.length);
          expect(row.every(Number.isFinite), code).toBe(true);
        }
        if (visual.cellLabels) {
          expect(visual.cellLabels, code).toHaveLength(visual.rowLabels.length);
          for (const row of visual.cellLabels) expect(row, code).toHaveLength(visual.columnLabels.length);
        }
      } else if (visual.kind === "waffle") {
        const total = visual.groups.reduce((sum, group) => sum + group.count, 0);
        expect(total, code).toBeLessThanOrEqual(200);
        expect(total, code).toBeGreaterThan(0);
        expect(visual.groups.every(group => Number.isInteger(group.count) && group.count >= 0), code).toBe(true);
      } else if (visual.kind === "plot") {
        for (const series of visual.series) {
          expect(series.points.length, code).toBeGreaterThan(0);
          for (const point of series.points) {
            expect(Number.isFinite(point.x) && Number.isFinite(point.y), code).toBe(true);
            if (visual.xDomain) expect(point.x >= visual.xDomain[0] && point.x <= visual.xDomain[1], code).toBe(true);
            if (visual.yDomain) expect(point.y >= visual.yDomain[0] && point.y <= visual.yDomain[1], code).toBe(true);
          }
        }
      } else {
        expect(visual.items.every(item => Number.isFinite(item.value) && item.value >= 0), code).toBe(true);
      }
    }
  });

  it("整頁閱讀器真的呈現每一張SVG與精確資料；目錄可見圖解數量", () => {
    for (const [subjectId, codes] of Object.entries(units)) {
      for (const code of codes) {
        const container = document.createElement("div");
        container.innerHTML = renderStudyReader({ page: { kind: "node", subjectId, code }, notes: studyNotes });
        const count = countStudyVisuals(studyNotes[subjectId][code]);
        expect(container.querySelectorAll("figure.study-visual"), code).toHaveLength(count);
        expect(container.querySelectorAll('figure.study-visual svg[role="img"]'), code).toHaveLength(count);
        expect(container.querySelectorAll("figure.study-visual details table").length, code).toBeGreaterThanOrEqual(count);
        expect(container.querySelector(".reader-visual-count")?.textContent, code).toContain(`${count} 張教學圖解`);
      }
    }
    const index = renderStudyIndex({ cert: "aiap", notes: studyNotes });
    expect(index).toContain("5 張圖解");
    expect(index).toContain("4 張圖解");
  });

  it("搜尋包含圖名以外的軸標、節點、格子分類及數值，不索引資料格式名稱", () => {
    for (const { visual } of Object.values(studyVisualLessons)) {
      const text = studyVisualText(visual);
      expect(text).toContain(visual.summary);
      expect(text).not.toMatch(/xDomain|cellLabels|equalScale/);
      if (visual.kind === "plot") expect(text).toContain(visual.xLabel);
      if (visual.kind === "diagram") expect(text).toContain(visual.nodes[0].lines[0]);
      if (visual.kind === "waffle") expect(text).toContain(visual.groups[0].label);
      if (visual.kind === "matrix") expect(text).toContain(visual.columnLabels[0]);
      if (visual.kind === "bars") expect(text).toContain(visual.items[0].label);
    }
  });

  it("重複整合不會再插入圖解，初級和AIoT原講義保持不變", () => {
    expect(attachStudyVisuals(studyNotes)).toEqual(studyNotes);
    for (const [subject, topics] of Object.entries(studyNotes)) {
      if (subject.startsWith("senior-")) continue;
      expect(countStudyVisuals(Object.values(topics).flat()), subject).toBe(0);
    }
  });
});
