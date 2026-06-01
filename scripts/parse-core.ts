import type { ChoiceId, Question } from "../src/data/types";

export type ParseContext = {
  subjectId: string;
  examCode: string;
  examLabel: string;
};

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];

// 雜訊行：markdown 結構、頁首頁尾、欄位標題
const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  line.startsWith("- Source") ||
  line.startsWith("- Pages") ||
  line.startsWith("- Conversion") ||
  /^\d+$/.test(line) ||
  line.includes("【公告試題】") ||
  line.startsWith("第一科") ||
  line.startsWith("第二科") ||
  line.startsWith("第三科") ||
  line.startsWith("考試日期") ||
  line.startsWith("一、選擇題") ||
  // 「答案 題目」標題，可能在「題目」中含空白（答案 題 目），
  // 或被 pdftotext 拆成「答」「案」「題目」三行。
  /^答案\s*題\s*目$/.test(line) ||
  line === "答" ||
  line === "案" ||
  line === "題目" ||
  /^第\s*\d+\s*頁/.test(line);

const questionStart = /^([A-D])\s+(\d+)\.\s*(.*)$/;
const choiceStart = /^\(([A-D])\)\s*(.*)$/;

type Draft = {
  number: number;
  answer: ChoiceId;
  promptParts: string[];
  choices: { id: ChoiceId; parts: string[] }[];
};

const stripTrailing = (text: string): string => text.replace(/[；;]\s*$/, "");

export const parsePaper = (markdown: string, ctx: ParseContext): Question[] => {
  const lines = markdown.split("\n").map((l) => l.trim());
  const drafts: Draft[] = [];
  let current: Draft | null = null;
  // target：目前正在累加文字的欄位（題幹或某選項）
  let target: string[] | null = null;

  for (const line of lines) {
    if (isNoise(line)) continue;

    const qm = questionStart.exec(line);
    if (qm) {
      current = {
        number: Number(qm[2]),
        answer: qm[1] as ChoiceId,
        promptParts: [qm[3]],
        choices: [],
      };
      drafts.push(current);
      target = current.promptParts;
      continue;
    }

    const cm = choiceStart.exec(line);
    if (cm && current) {
      const choice = { id: cm[1] as ChoiceId, parts: [cm[2]] };
      current.choices.push(choice);
      target = choice.parts;
      continue;
    }

    // 其餘為前一欄位的跨行延續
    if (target) target.push(line);
  }

  return drafts.map((draft) => {
    const choices = CHOICE_IDS.map((id) => {
      const found = draft.choices.find((c) => c.id === id);
      return { id, text: stripTrailing((found?.parts ?? []).join("")) };
    });
    const number = String(draft.number).padStart(2, "0");
    return {
      id: `${ctx.subjectId}-${ctx.examCode}-q${number}`,
      subjectId: ctx.subjectId,
      prompt: draft.promptParts.join(""),
      choices,
      answer: draft.answer,
      explanation: "",
      topic: "未分類",
      difficulty: "中",
      source: "past-exam",
      sourceRef: `${ctx.examLabel} 第${draft.number}題`,
    } satisfies Question;
  });
};
