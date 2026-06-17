import { describe, it, expect } from "vitest";
import { studyNotes } from "../src/data/studyNotes";
import type { StudyNoteItem } from "../src/data/types";

const hasNesting = (items: StudyNoteItem[]): boolean =>
  items.some((item) => (item.children?.length ?? 0) > 0);

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
    expect(sections.some((s) => hasNesting(s.items))).toBe(true);
  });
});
