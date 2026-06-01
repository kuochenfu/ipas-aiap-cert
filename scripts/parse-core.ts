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
  /^第\s*\d+\s*頁/.test(line) ||
  // 圖表分隔線（pdftotext 將 PDF 內表格框線輸出為連續 - 或 = ）。
  /^[-=]{3,}$/.test(line);

// 答案字母可能為半形 A-D，也可能被 pdftotext 輸出為全形 Ａ-Ｄ。
const questionStart = /^([A-DＡ-Ｄ])\s+(\d+)\.\s*(.*)$/;
const choiceStart = /^\(([A-D])\)\s*(.*)$/;

// 將全形英文字母 Ａ-Ｚ 正規化為半形 A-Z（僅作用於答案字母）。
const toHalfWidthLetter = (ch: string): ChoiceId => {
  const code = ch.charCodeAt(0);
  if (code >= 0xff21 && code <= 0xff3a) {
    return String.fromCharCode(code - 0xff21 + 0x41) as ChoiceId;
  }
  return ch as ChoiceId;
};

// 一行內可能塞入多個選項，例：「(A)MAE；(B)MSE；(C)RMSE；(D)R²」。
// 依「下一個預期字母」切分，避免誤切到選項內文中出現的 (A) 等括號字母。
type SplitChoice = { id: ChoiceId; text: string };
const splitInlineChoices = (id: ChoiceId, rest: string): SplitChoice[] => {
  const order: ChoiceId[] = ["A", "B", "C", "D"];
  const out: SplitChoice[] = [{ id, text: "" }];
  let expectedIndex = order.indexOf(id) + 1;
  let buf = "";
  // 掃描 rest，遇到「下一個預期字母」的 (X) 才切新選項。
  for (let i = 0; i < rest.length; i++) {
    const nextExpected = order[expectedIndex];
    if (
      nextExpected &&
      rest[i] === "(" &&
      rest[i + 1] === nextExpected &&
      rest[i + 2] === ")"
    ) {
      out[out.length - 1].text = buf;
      out.push({ id: nextExpected, text: "" });
      expectedIndex += 1;
      buf = "";
      i += 2; // 跳過 X)
      continue;
    }
    buf += rest[i];
  }
  out[out.length - 1].text = buf;
  return out;
};

type Draft = {
  number: number;
  answer: ChoiceId;
  promptParts: string[];
  choices: { id: ChoiceId; parts: string[] }[];
};

const stripTrailing = (text: string): string => text.replace(/[；;]\s*$/, "");

// pdftotext 會把「請根據此資訊回答 42~45 題」這類跨題共用引文（shared stem）
// 接在前一題最後選項之後。這段文字屬於後續題目，不應併入選項，故予以移除。
// 觸發詞只出現在共用引文，不會出現在正常選項內文。
const SHARED_STEM_TRIGGER =
  /(請?根據[^。]*回答|回答(下列|後續)?[^。]*第?\s*\d+\s*[~～至-]\s*\d+\s*題|回答第\s*\d+\s*題)/;
// 在「行（part）」層級切除共用引文。第一個 part 是選項/題幹本體（marker 行），
// 其後的延續行若任一處出現共用引文觸發詞，代表本欄位後方接的是「下一組題目的
// 共用引文」整段敘述（圖／表／程式碼題的前言），與本選項無關，
// 故丟棄所有延續行、只保留 marker 行。實測各卷此情形下 marker 行皆為完整選項。
const dropSharedStemParts = (parts: string[]): string[] => {
  const hasStem = parts.some((p, i) => i > 0 && SHARED_STEM_TRIGGER.test(p));
  return hasStem ? parts.slice(0, 1) : parts;
};

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
        answer: toHalfWidthLetter(qm[1]),
        promptParts: [qm[3]],
        choices: [],
      };
      drafts.push(current);
      target = current.promptParts;
      continue;
    }

    const cm = choiceStart.exec(line);
    if (cm && current) {
      const segments = splitInlineChoices(cm[1] as ChoiceId, cm[2]);
      let lastChoice: { id: ChoiceId; parts: string[] } | null = null;
      for (const seg of segments) {
        lastChoice = { id: seg.id, parts: [seg.text] };
        current.choices.push(lastChoice);
      }
      // 跨行延續只會接續最後一個選項。
      target = lastChoice ? lastChoice.parts : null;
      continue;
    }

    // 其餘為前一欄位的跨行延續
    if (target) target.push(line);
  }

  return drafts.map((draft) => {
    const choices = CHOICE_IDS.map((id) => {
      const found = draft.choices.find((c) => c.id === id);
      const joined = dropSharedStemParts(found?.parts ?? []).join("");
      return { id, text: stripTrailing(joined) };
    });
    const number = String(draft.number).padStart(2, "0");
    return {
      id: `${ctx.subjectId}-${ctx.examCode}-q${number}`,
      subjectId: ctx.subjectId,
      prompt: dropSharedStemParts(draft.promptParts).join(""),
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
