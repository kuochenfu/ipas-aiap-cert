import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getStudyGuide } from "../src/data/studyGuide";
import { studyNotes } from "../src/data/studyNotes";
import { aiotStudyNotes } from "../src/data/studyNotes.aiot";

// 執行期由 main.ts 的 loadStudyNotes 合併兩個 lazy chunk；測試比照，
// 否則 AIoT 的筆記會被漏測。
const allNotes = { ...studyNotes, ...aiotStudyNotes };

describe("學習主題資料", () => {
  for (const subject of subjects) {
    describe(subject.id, () => {
      const guide = getStudyGuide(subject.id, allNotes);
      it("該科有學習指引且至少一個主題", () => {
        expect(guide).toBeDefined();
        expect(guide!.topics.length).toBeGreaterThan(0);
      });

      it("每主題有標題、至少一條內容、連結皆為有效 http(s) 且有標題", () => {
        for (const topic of guide!.topics) {
          expect(topic.title.trim().length).toBeGreaterThan(0);
          expect(topic.contents.length).toBeGreaterThan(0);
          expect(topic.notes?.length).toBeGreaterThan(0);
          expect(topic.notes?.some((section) => section.items.length > 0)).toBe(true);
          expect(topic.links.length).toBeGreaterThan(0);
          for (const link of topic.links) {
            expect(link.title.trim().length).toBeGreaterThan(0);
            expect(/^https?:\/\//.test(link.url)).toBe(true);
          }
        }
      });
    });
  }
});
