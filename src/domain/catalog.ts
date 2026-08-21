import type { Cert, Level } from "../data/types";

export type Subject = {
  id: string;
  cert: Cert;
  level: Level;
  code: string;
  name: string;
  durationMinutes: 75 | 90;
  /**
   * 是否開放模擬考試。AIoT 的簡章只寫「每科目單選題、每科 100 分、70 分及格」，
   * 未載明題數與每題配分，因此不能沿用 examRules 的 50 題×2 分；在查證到官方
   * 題數之前，AIoT 兩科只開刷題。
   */
  mockExam: boolean;
};

export type CertInfo = { id: Cert; name: string; subtitle: string };

export const certs: CertInfo[] = [
  { id: "aiap", name: "AI 應用規劃師", subtitle: "初級 ・ 中級" },
  { id: "aiot", name: "AIoT 應用工程師", subtitle: "初級（物聯網類）" },
];

export const subjects: Subject[] = [
  { id: "junior-ai-basics", cert: "aiap", level: "junior", code: "科目1", name: "人工智慧基礎概論", durationMinutes: 75, mockExam: true },
  { id: "junior-genai", cert: "aiap", level: "junior", code: "科目2", name: "生成式 AI 應用與規劃", durationMinutes: 75, mockExam: true },
  { id: "senior-ai-tech", cert: "aiap", level: "senior", code: "科目1", name: "人工智慧技術應用與規劃", durationMinutes: 90, mockExam: true },
  { id: "senior-bigdata", cert: "aiap", level: "senior", code: "科目2", name: "大數據處理分析與應用", durationMinutes: 90, mockExam: true },
  { id: "senior-ml", cert: "aiap", level: "senior", code: "科目3", name: "機器學習技術與應用", durationMinutes: 90, mockExam: true },
  { id: "aiot-junior-basics", cert: "aiot", level: "junior", code: "考科一", name: "AIoT 基礎概論", durationMinutes: 75, mockExam: false },
  { id: "aiot-junior-iot", cert: "aiot", level: "junior", code: "考科二", name: "物聯網系統與應用", durationMinutes: 75, mockExam: false },
];

export const getSubjects = (cert: Cert, level: Level): Subject[] =>
  subjects.filter((subject) => subject.cert === cert && subject.level === level);

/** 該證照實際有科目的級別，依 junior→senior 排序。由 subjects 推導，不另寫死。 */
export const getLevels = (cert: Cert): Level[] =>
  (["junior", "senior"] as const).filter((level) => getSubjects(cert, level).length > 0);

export const getSubject = (id: string): Subject | undefined =>
  subjects.find((subject) => subject.id === id);
