import type { ReadingLink, StudyNoteTable } from "./types";

/**
 * 程式速查頁（學習主題的「程式速查」）的資料形狀。
 *
 * 與學習筆記分開：筆記是學習指引的重構，這裡是「真題考過的程式 × 最新穩定版文件」的對照，
 * 每張卡片都要能回溯到真題 id 與官方文件連結，畫面與 `docs/senior-ml-code-reference.md`
 * （`npm run report:code-sheet` 產生）共用這一份資料，不要另外手寫第二份。
 */
export type CodeLib = "scikit-learn" | "NumPy" | "PyTorch" | "torchvision" | "Keras";

export type CodeCard = {
  id: string;
  /** 卡片標題，通常是函式或類別名稱（含關鍵參數）。 */
  api: string;
  lib: CodeLib;
  /**
   * core：兩份真題都考過，或同一份考了兩題以上；high：真題考過一次，或是評鑑內容的核心操作。
   * 判斷依據寫在 `why`。
   */
  priority: "core" | "high";
  /** 考過的真題 id（`senior-ml-115-1-q44`）。沒考過但機率高的卡片留空陣列。 */
  exams: string[];
  /** 為什麼使用／出題機率高。 */
  why: string;
  /** 考點：讀程式時要立刻看出的那件事。 */
  point: string;
  /** 常見陷阱或錯誤選項的套路。 */
  trap?: string;
  /** 以最新穩定版寫法的最小範例。 */
  code?: string;
  table?: StudyNoteTable & { caption: string };
  /** 實務上用在哪裡。 */
  practice: string;
  /** 最新穩定版與考卷寫法的差異（棄用、移除、建議寫法）。 */
  versionNote?: string;
  docs: ReadingLink[];
};

export type CodeSheetSection = { id: string; title: string; summary: string; cards: CodeCard[] };

export type CodeSheetVersion = { lib: string; version: string; released: string; docs: string; note?: string };

export type CodeSheet = {
  subjectId: string;
  title: string;
  /** 版本與連結的查核日（YYYY-MM-DD）。 */
  checkedAt: string;
  versions: CodeSheetVersion[];
  /** 考前最後看的陷阱清單。 */
  traps: { text: string; exams: string[] }[];
  /** 速算公式。 */
  formulas: { label: string; expr: string; note: string }[];
  sections: CodeSheetSection[];
};
