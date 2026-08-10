import { describe, it, expect } from "vitest";
import { studyNotes } from "../src/data/studyNotes";
import type { StudyNoteItem, StudyNoteSection } from "../src/data/types";

const hasNesting = (items: StudyNoteItem[]): boolean =>
  items.some((item) => (item.children?.length ?? 0) > 0);

const walk = (items: StudyNoteItem[]): StudyNoteItem[] =>
  items.flatMap((item) => [item, ...walk(item.children ?? [])]);

const isSupplement = (section: StudyNoteSection): boolean => section.heading.startsWith("補充");

const juniorTopicCodes: Record<string, string[]> = {
  "junior-ai-basics": ["L111", "L112", "L113", "L114"],
  "junior-genai": ["L121", "L122", "L123"],
};

describe("studyNotes 結構", () => {
  it("junior-ai-basics 每節都有內容，且整科至少有一處階層", () => {
    const subject = studyNotes["junior-ai-basics"];
    expect(subject).toBeDefined();
    const sections = Object.values(subject).flat();
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      expect(section.heading.trim().length).toBeGreaterThan(0);
      expect(section.items.length).toBeGreaterThan(0);
    }
    expect(sections.every((s) => hasNesting(s.items))).toBe(true);
  });

  it("所有科目的所有筆記項目文字皆非空白", () => {
    for (const byCode of Object.values(studyNotes)) {
      for (const section of Object.values(byCode).flat()) {
        for (const item of walk(section.items)) {
          expect(item.text.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("studyNotes 題庫反推補充（初級）", () => {
  it("初級兩科的每個主題碼都有『補充 A』section", () => {
    for (const [subjectId, codes] of Object.entries(juniorTopicCodes)) {
      const subject = studyNotes[subjectId];
      expect(subject, subjectId).toBeDefined();
      for (const code of codes) {
        const sections = subject[code] ?? [];
        const supplements = sections.filter(isSupplement);
        expect(
          supplements.some((s) => s.heading.startsWith("補充 A")),
          `${subjectId}/${code} 缺少補充 A section`,
        ).toBe(true);
      }
    }
  });

  it("補充 section 的每張概念卡至少有 2 個子項", () => {
    for (const subjectId of Object.keys(juniorTopicCodes)) {
      for (const [code, sections] of Object.entries(studyNotes[subjectId])) {
        for (const section of sections.filter(isSupplement)) {
          for (const card of section.items) {
            expect(
              card.children?.length ?? 0,
              `${subjectId}/${code}「${card.text}」子項不足`,
            ).toBeGreaterThanOrEqual(2);
          }
        }
      }
    }
  });

  it("補充 section 標示為非官方講義", () => {
    for (const subjectId of Object.keys(juniorTopicCodes)) {
      for (const sections of Object.values(studyNotes[subjectId])) {
        for (const section of sections.filter(isSupplement)) {
          expect(section.heading, section.heading).toContain("非官方講義");
        }
      }
    }
  });
});
