import type { StudyNoteItem, StudyNoteSection, StudyNotesBySubject } from "./types";
import type { LectureEdit } from "./studyLectureEdits.types";
import { juniorLectureEdits } from "./studyLectureEdits.junior";
import { techLectureEdits } from "./studyLectureEdits.tech";
import { bigdataLectureEdits } from "./studyLectureEdits.bigdata";
import { mlLectureEdits } from "./studyLectureEdits.ml";

/** 逐節核對講義後手寫的編輯；原始重構內容仍在 studyNotes.ts，例子另有來源標記。 */
export const lectureEdits: LectureEdit[] = [...juniorLectureEdits, ...techLectureEdits, ...bigdataLectureEdits, ...mlLectureEdits];

const itemAt = (items: StudyNoteItem[], path: number[]): StudyNoteItem | undefined => {
  let item: StudyNoteItem | undefined;
  for (const index of path) { item = items[index]; items = item?.children ?? []; }
  return item;
};
const walk = (items: StudyNoteItem[]): StudyNoteItem[] => items.flatMap(item => [item, ...walk(item.children ?? [])]);

export function editLectureSection(section: StudyNoteSection, edit: LectureEdit): StudyNoteSection {
  const ids = edit.examples.map((_example, index) => `${edit.topic}:${edit.chapter}:${index}`);
  if (ids.length && ids.every(id => walk(section.items).some(item => item.example?.id === id))) return section;
  for (const rewrite of edit.rewrites) {
    const original = itemAt(section.items, rewrite.at);
    if (!original || (!original.text.startsWith(rewrite.starts) && original.text !== rewrite.text)) {
      throw new Error(`講義編輯位置已變更：${edit.topic}/${edit.chapter}/${rewrite.at.join(".")}`);
    }
  }
  for (const example of edit.examples) {
    if (!itemAt(section.items, example.after)) throw new Error(`講義例子位置不存在：${edit.topic}/${edit.chapter}/${example.after.join(".")}`);
  }
  const revise = (items: StudyNoteItem[], parent: number[] = []): StudyNoteItem[] => items.flatMap((item, index) => {
    const path = [...parent, index];
    const key = path.join(".");
    const rewrite = edit.rewrites.find(entry => entry.at.join(".") === key);
    const revised = { ...item, ...(rewrite ? { text: rewrite.text } : {}), ...(item.children ? { children: revise(item.children, path) } : {}) };
    const examples = edit.examples.flatMap((entry, exampleIndex) => entry.after.join(".") === key ? [{
      text: entry.title,
      example: { id: ids[exampleIndex] },
      children: entry.paragraphs.map(text => ({ text })),
    }] : []);
    return [revised, ...examples];
  });
  return { ...section, items: revise(section.items) };
}

export function applyLectureEdits(notes: StudyNotesBySubject): StudyNotesBySubject {
  return Object.fromEntries(Object.entries(notes).map(([subject, topics]) => [subject,
    Object.fromEntries(Object.entries(topics).map(([topic, sections]) => [topic, sections.map(section => {
      const edit = lectureEdits.find(entry => entry.topic === topic && section.heading.startsWith(`${entry.chapter} `));
      return edit ? editLectureSection(section, edit) : section;
    })])),
  ]));
}
