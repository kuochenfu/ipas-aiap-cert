import type { Question } from "./types";
import { generated } from "./generated/aiot-junior-iot";
import { applyQuestionMeta } from "./meta/types";
import { questionMeta } from "./meta/aiot-junior-iot";

/**
 * AIoT 考科二題庫。這一科**沒有官方題源**（無學習指引、無公告真題），
 * 全部 60 題皆為依簡章評鑑內容自編，故只有 generated 一層，
 * 科目卡會顯示為「新題」。內容正確性需人工複審。
 */
export const questions: Question[] = applyQuestionMeta(generated, questionMeta);
