import type { Level } from "../data/types";

export type Subject = {
  id: string;
  level: Level;
  code: string;
  name: string;
  durationMinutes: 75 | 90;
};

export const subjects: Subject[] = [
  { id: "junior-ai-basics", level: "junior", code: "科目1", name: "人工智慧基礎概論", durationMinutes: 75 },
  { id: "junior-genai", level: "junior", code: "科目2", name: "生成式 AI 應用與規劃", durationMinutes: 75 },
  { id: "senior-ai-tech", level: "senior", code: "科目1", name: "人工智慧技術應用與規劃", durationMinutes: 90 },
  { id: "senior-bigdata", level: "senior", code: "科目2", name: "大數據處理分析與應用", durationMinutes: 90 },
  { id: "senior-ml", level: "senior", code: "科目3", name: "機器學習技術與應用", durationMinutes: 90 },
];

export const getSubjectsByLevel = (level: Level): Subject[] =>
  subjects.filter((subject) => subject.level === level);

export const getSubject = (id: string): Subject | undefined =>
  subjects.find((subject) => subject.id === id);
