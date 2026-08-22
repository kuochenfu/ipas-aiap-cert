import type { Question } from "./types";
import past from "./past-exams/aiot-junior-basics.json";
import { explanations } from "./explanations/aiot-junior-basics";
import { resolvePastExamExplanations } from "./resolveExplanations";

/**
 * AIoT 考科一題庫。題源是官方學習指引的練習評量，題目自帶答案與詳解，節點也由出處決定，
 * 因此**沒有** generated 新題那一層；但仍有手寫層——80 題裡只有 11 題自帶逐項選項解析，
 * 其餘 69 題的三條錯誤選項解析寫在 `explanations/aiot-junior-basics.ts`，
 * 由 id 合併，重跑 `npm run parse:papers` 不會弄丟。
 */
export const questions: Question[] = resolvePastExamExplanations(past as Question[], explanations);
