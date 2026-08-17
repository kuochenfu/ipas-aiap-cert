import type { ChoiceId, QuestionFigure } from "../types";

/**
 * 一題的手寫內容。choices 只放錯誤選項，正解不寫。
 * figures / choiceFigures 為原卷圖片（多為程式碼截圖）的文字轉錄，
 * 與詳解同為手寫層，故一併放在這裡：兩者共用同一個 by-id 合併點，
 * 重跑 `npm run parse:papers` 覆寫真題 JSON 時都不會被動到。
 */
export type QuestionExplanation = {
  explanation: string;
  choices: Partial<Record<ChoiceId, string>>;
  figures?: QuestionFigure[];
  choiceFigures?: Partial<Record<ChoiceId, QuestionFigure>>;
  /**
   * 評鑑內容節點，格式為「五碼 名稱」（例「L21101 自然語言處理技術與應用」）。
   * 真題 JSON 由解析器產生時一律為「未分類」，這裡是唯一的回填處。
   * 節點目錄見 `src/domain/assessmentTopics.ts`。
   */
  topic?: string;
};
