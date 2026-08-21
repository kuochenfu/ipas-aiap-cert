import type { Question } from "./types";
import past from "./past-exams/aiot-junior-basics.json";

/**
 * AIoT 考科一題庫。來源是官方學習指引的練習評量，題目自帶答案與詳解，
 * 節點也由出處決定，因此不需要 explanations／generated 兩層手寫合併——
 * 重跑 `npm run parse:papers` 不會弄丟任何人工內容。
 */
export const questions: Question[] = past as Question[];
