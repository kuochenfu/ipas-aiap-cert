import type { QuestionArchetype, QuestionMeta } from "../types";

/**
 * 原題庫的命題後設資料回填層。
 *
 * ## 為什麼是獨立的一層，而不是寫進既有檔案
 *
 * 原題庫的 1,057 題散在三個地方——真題 JSON（機器產物，不可手改）、
 * `explanations/*.ts`（手寫詳解，一題一個物件）、`generated/*.ts`（新題，一題一個物件）。
 * 把 meta 塞進後兩者要動到 800 多個既有物件，diff 巨大且容易改壞已經校對過的詳解；
 * 真題 JSON 更是重跑 `parse:papers` 就會全部消失。
 *
 * 因此改成獨立的一層：**一題一行**，載入時依 id 合併。它同時涵蓋真題與新題，
 * 不需要分辨該題屬於哪一種來源。
 *
 * ## 為什麼只有兩個欄位
 *
 * 回填只帶**認知層級**與**題型原型**，不含概念關鍵字與逐選項干擾類型：
 * - 概念關鍵字目前全站有 1,890 個相異字串、73% 只出現一次，還沒收斂成受控詞彙，
 *   現在硬補只會讓標籤雲更大（見 `docs/backlog.md` 的 P2-9）。
 * - 逐選項干擾類型是三倍的工作量，且需要逐字讀四個選項；先把兩個欄位補齊，
 *   認知層級與題型的診斷表就能對使用者最想練的真題生效。
 *
 * 缺少的欄位不會被假裝成有：「錯誤類型」診斷會把這些題的錯答計入 `unclassifiedWrong`
 * 並在畫面上如實寫出「另有 N 題錯題沒有干擾類型標註」。
 */
export type CompactMeta = Record<string, readonly [QuestionMeta["cognitiveLevel"], QuestionArchetype]>;

/**
 * 把回填的 meta 套到題目上。
 *
 * **已經有 meta 的題目不覆寫**——新題庫那 915 題的 meta 是命題時就寫好的完整版本，
 * 這一層只補沒有的。（實務上兩者不重疊：這一層只涵蓋原題庫。）
 */
export const applyQuestionMeta = <T extends { id: string; meta?: QuestionMeta }>(
  questions: T[],
  map: CompactMeta,
): T[] =>
  questions.map((question) => {
    if (question.meta) return question;
    const entry = map[question.id];
    if (!entry) return question;
    return { ...question, meta: { cognitiveLevel: entry[0], archetype: entry[1] } };
  });
