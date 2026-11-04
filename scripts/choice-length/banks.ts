/**
 * 選項長度改題工具的共用部分：題庫清單、載入、長度名次計算。
 * 流程與用法見同目錄的 README.md。
 */
import { getQuestions } from "../../src/data/index";
import { getPracticeQuestions } from "../../src/data/practice";
import { practiceQuestions as seniorAiTechCode } from "../../src/data/practice/senior-ai-tech.code";
import { practiceQuestions as seniorBigdataCode } from "../../src/data/practice/senior-bigdata.code";
import { practiceQuestions as seniorMlCode } from "../../src/data/practice/senior-ml.code";
import type { Question } from "../../src/data/types";

export type BankKind = "practice" | "generated";
export type BankRef = { subjectId: string; bank: BankKind };

/** 13 個 LLM 題庫，與 tests/choiceLength.test.ts 的清單一致。 */
export const LLM_BANKS: BankRef[] = [
  ["aiot-junior-basics", "practice"],
  ["aiot-junior-iot", "practice"],
  ["aiot-junior-iot", "generated"],
  ["junior-ai-basics", "practice"],
  ["junior-genai", "practice"],
  ["junior-ai-basics", "generated"],
  ["junior-genai", "generated"],
  ["senior-ai-tech", "practice"],
  ["senior-bigdata", "practice"],
  ["senior-ml", "practice"],
  ["senior-ai-tech", "generated"],
  ["senior-bigdata", "generated"],
  ["senior-ml", "generated"],
].map(([subjectId, bank]) => ({ subjectId, bank: bank as BankKind }));

/** 解析「subject:bank」寫法；不合法時丟錯。 */
export const parseBankRef = (text: string): BankRef => {
  const [subjectId, bank] = text.split(":");
  if (!subjectId || (bank !== "practice" && bank !== "generated")) {
    throw new Error(`題庫寫法應為 <subjectId>:practice 或 <subjectId>:generated，收到「${text}」`);
  }
  return { subjectId, bank };
};

export const loadBank = ({ subjectId, bank }: BankRef): Question[] =>
  bank === "practice"
    ? getPracticeQuestions(subjectId)
    : getQuestions(subjectId).filter((q) => q.source === "generated");

/** 所有 LLM 題庫的題目，以 id 為鍵。 */
export const loadAllLlmQuestions = (): Map<string, Question> =>
  new Map(LLM_BANKS.flatMap(loadBank).map((q) => [q.id, q]));

/**
 * 中級程式閱讀題：每題有 scripts/code-questions/<id>.py 驗證腳本，腳本常以選項字母標記各寫法。
 * 改它們的選項必須同步改腳本並重跑 run.sh，因此預設不匯出給子代理。
 */
export const codeQuestionIds = new Set(
  [...seniorAiTechCode, ...seniorBigdataCode, ...seniorMlCode].map((q) => q.id),
);

/** 字數一律去空白後計算，與 tests/choiceLength.test.ts 相同。 */
export const len = (text: string): number => [...text.replace(/\s/g, "")].length;

type ChoiceLike = { id: string; text: string };

/** 正解落在「最長／第二長／第三長／最短」的份額（同長時平分），四個值總和為 1。 */
export const rankShares = (choices: ChoiceLike[], answer: string): number[] => {
  const shares = [0, 0, 0, 0];
  const correct = choices.find((c) => c.id === answer);
  if (!correct || choices.length !== 4) return shares;
  const target = len(correct.text);
  const sorted = choices.map((c) => len(c.text)).sort((a, b) => b - a);
  const ranks = sorted.flatMap((value, k) => (value === target ? [k] : []));
  for (const k of ranks) shares[k] += 1 / ranks.length;
  return shares;
};

/** 整個題庫的名次分布（百分比），等於「每題都挑第 k 長」的期望得分。 */
export const rankDistribution = (questions: { choices: ChoiceLike[]; answer: string }[]): number[] => {
  const totals = [0, 0, 0, 0];
  for (const q of questions) rankShares(q.choices, q.answer).forEach((v, k) => (totals[k] += v));
  return totals.map((t) => Math.round((100 * t) / Math.max(questions.length, 1)));
};

/** 匯出給子代理的批次檔形狀。 */
export type BatchQuestion = {
  id: string;
  topic: string;
  prompt: string;
  answer: string;
  /** 正解目前的長度名次，1＝最長、4＝最短（同長時取最前面的名次）。 */
  answerRank: number;
  choices: { id: string; text: string; len: number }[];
  explanation: string;
  choiceExplanations?: Partial<Record<string, string>>;
  distractorTypes?: Partial<Record<string, string>>;
  decisionBoundary?: string;
};
export type Batch = BankRef & { questions: BatchQuestion[] };

/** 子代理產出的 patch：只寫有改的題與欄位。題幹、正解字母、判斷分界不在範圍內。 */
export type QuestionPatch = {
  choices?: Record<string, string>;
  choiceExplanations?: Record<string, string>;
  distractorTypes?: Record<string, string>;
  explanation?: string;
};
export type Patch = Record<string, QuestionPatch>;
