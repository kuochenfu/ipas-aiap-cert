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

  // 這條不變式的用意是「概念卡要有實質內容」，而不是「一定要有子項」——
  // 比較表本身就是內容，故 table／formula／flow 型別的條目視為已滿足。
  it("補充 section 的每張概念卡要有實質內容（2 個以上子項，或一張表／公式／流程）", () => {
    for (const subjectId of Object.keys(studyNotes)) {
      for (const [code, sections] of Object.entries(studyNotes[subjectId])) {
        for (const section of sections.filter(isSupplement)) {
          for (const card of section.items) {
            if (card.table || card.formula || card.flow) continue;
            expect(
              card.children?.length ?? 0,
              `${subjectId}/${code}「${card.text}」子項不足`,
            ).toBeGreaterThanOrEqual(2);
          }
        }
      }
    }
  });

  it("補充 section 標示為非官方講義（所有科目）", () => {
    for (const subjectId of Object.keys(studyNotes)) {
      for (const sections of Object.values(studyNotes[subjectId])) {
        for (const section of sections.filter(isSupplement)) {
          expect(section.heading, section.heading).toContain("非官方講義");
        }
      }
    }
  });
});

// 2026-11-07：中級科目一補上 Agent 與 AI 資安的補充節（非官方講義）。官方學習指引只有
// 「Agent 化發展」一句，115-1 卻已出現多代理容錯與 ReAct 設計兩題，故三個主題碼都補上補充 A。
describe("studyNotes 補充節（中級科目一）", () => {
  it("senior-ai-tech 的 L211／L212／L213 都有『補充 A』section", () => {
    for (const code of ["L211", "L212", "L213"]) {
      const sections = studyNotes["senior-ai-tech"][code] ?? [];
      expect(
        sections.some((s) => s.heading.startsWith("補充 A")),
        `senior-ai-tech/${code} 缺少補充 A section`,
      ).toBe(true);
    }
  });

  // 「現況」類的補充 B 寫的是會過時的事實，每張卡都要附來源，複審時才有東西可以對。
  // 只套用中級科目一：初級 junior-genai/L122 的「模型市場格局」卡早於這條規則、沒有附來源。
  it("senior-ai-tech 的『補充 B』概念卡都附來源", () => {
    for (const [subjectId, byCode] of Object.entries({ "senior-ai-tech": studyNotes["senior-ai-tech"] })) {
      for (const [code, sections] of Object.entries(byCode)) {
        for (const section of sections.filter((s) => s.heading.startsWith("補充 B"))) {
          for (const card of section.items) {
            expect(
              (card.children ?? []).some((child) => child.text.startsWith("來源：")),
              `${subjectId}/${code}「${card.text}」缺少來源`,
            ).toBe(true);
          }
        }
      }
    }
  });
});
