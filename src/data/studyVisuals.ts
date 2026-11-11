import type { StudyNotesBySubject } from "./types";
import { seniorTechVisualLessons } from "./studyVisuals.seniorTech";
import { bigdataVisualLessons } from "./studyVisuals.bigdata";
import { mlVisualLessons } from "./studyVisuals.ml";

export const studyVisualLessons = {
  ...seniorTechVisualLessons,
  ...bigdataVisualLessons,
  ...mlVisualLessons,
};

/** 圖解放在對應導讀的最前面；原講義與既有帶讀內容保留原序、原文。 */
export function attachStudyVisuals(notes: StudyNotesBySubject): StudyNotesBySubject {
  return Object.fromEntries(Object.entries(notes).map(([subject, topics]) => [subject,
    Object.fromEntries(Object.entries(topics).map(([code, sections]) => [code,
      sections.map(section => {
        const key = /^補充 C｜(L\d{3}(?:\d{2})?)\s/.exec(section.heading)?.[1];
        const lesson = key ? studyVisualLessons[key] : undefined;
        if (!lesson || section.items.some(item => item.visual)) return section;
        return { ...section, items: [lesson, ...section.items] };
      }),
    ])),
  ]));
}
