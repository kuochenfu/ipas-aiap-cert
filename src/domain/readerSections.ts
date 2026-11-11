import type { StudyNoteSection } from "../data/types";

export type ReaderSectionKind = "lecture" | "learning" | "supplement" | "notes";

export type ReaderSectionGroup = {
  kind: ReaderSectionKind;
  title: string;
  source: string;
  description: string;
  sections: { section: StudyNoteSection; index: number; id: string }[];
};

const guideGroups: Omit<ReaderSectionGroup, "sections">[] = [
  {
    kind: "lecture",
    title: "學習講義",
    source: "學習指引整理",
    description: "依學習指引整理語句；穿插的實務例子為本站自編。",
  },
  {
    kind: "learning",
    title: "白話解說與圖解",
    source: "非官方講義",
    description: "再用白話例子與圖解，確認自己看懂。",
  },
  {
    kind: "supplement",
    title: "補充重點",
    source: "非官方講義",
    description: "接著補充容易混淆的觀念與延伸重點。",
  },
  {
    kind: "notes",
    title: "其他筆記",
    source: "筆記整理",
    description: "最後閱讀本頁的其他整理。",
  },
];

const guideSectionKind = (heading: string): ReaderSectionKind => {
  if (/^\d+\.\d+\s/.test(heading)) return "lecture";
  if (heading.startsWith("補充 C｜")) return "learning";
  if (/^補充/.test(heading)) return "supplement";
  return "notes";
};

/** 只調整閱讀分組；沿用原陣列索引作錨點，不改寫、複製或遺漏教材內容。 */
export const groupReaderSections = (
  sections: StudyNoteSection[],
  source: "guide" | "notes" = "notes",
): ReaderSectionGroup[] => {
  if (!sections.length) return [];
  const entries = sections.map((section, index) => ({ section, index, id: `sec-${index}` }));
  if (source === "notes") {
    return [{
      kind: "notes",
      title: "重點筆記",
      source: "備考整理",
      description: "依筆記順序閱讀，再用例題確認理解。",
      sections: entries,
    }];
  }
  return guideGroups.flatMap((group) => {
    const members = entries.filter(({ section }) => guideSectionKind(section.heading) === group.kind);
    return members.length ? [{ ...group, sections: members }] : [];
  });
};
