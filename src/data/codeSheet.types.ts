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
  /** 全局圖上的短名稱。 */
  short: string;
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
  /** 範例的逐行說明；`code` 必須是 `code` 裡的某一行（去頭尾空白後相等）。 */
  codeNotes?: CodeWalkLine[];
  table?: StudyNoteTable & { caption: string };
  /** 實務上用在哪裡。 */
  practice: string;
  /** 最新穩定版與考卷寫法的差異（棄用、移除、建議寫法）。 */
  versionNote?: string;
  docs: ReadingLink[];
};

/** 一行程式與它的意思。 */
export type CodeWalkLine = { code: string; meaning: string };

/**
 * 真題程式逐行解讀：照原卷的程式逐行說明「這行做了什麼、資料變成什麼形狀、為什麼這樣寫」。
 * `lines[].code` 必須與原卷轉錄（題目的 figures／choiceFigures）的某一行相同，測試會比對，
 * 避免解讀與考卷程式對不上。
 */
export type CodeWalkthrough = {
  id: string;
  /** 共用同一段程式的真題 id（VGG16 summary 一段程式出了三題）。 */
  exams: string[];
  title: string;
  /** 這段程式落在全局圖的哪一步（步驟 id）。 */
  stage: string;
  /** 題目情境：這段程式想完成什麼。 */
  context: string;
  lines: CodeWalkLine[];
  /** 讀完整段程式後的解題結論。 */
  answer: string;
  cards: string[];
};

export type CodeSheetSection ={ id: string; title: string; summary: string; cards: CodeCard[] };

export type CodeSheetVersion = { lib: string; version: string; released: string; docs: string; note?: string };

/**
 * 全局圖（上帝視角）：把整條機器學習 pipeline 依先後排開，每一步標出系統角度的觀念，
 * 並以 `cards` 指回本頁的函式卡片——讀者先看到「這個函式在整條流程的哪裡」，再看細節。
 * 步驟編號由陣列順序推得，不另寫。
 */
export type CodePipelineStage = {
  id: string;
  title: string;
  /** 圖上的一行摘要。 */
  goal: string;
  /** 這一步具體做什麼。 */
  doing: string;
  /** 系統角度的觀念：這一步與上下游的關係、邊界與成本。 */
  system: string;
  /** 這一步出錯的代價。 */
  risk: string;
  /** 本頁卡片 id。 */
  cards: string[];
  /**
   * 學習筆記裡屬於這一步的觀念（L231–L234 官方講義重構與補充導讀）。全局圖以筆記為準：
   * 筆記講到、但程式真題沒考的觀念也要放進來，圖才是完整的流程而不只是函式地圖。
   */
  concepts: { term: string; text: string }[];
  /** 對應的評鑑內容節點（五碼，如 `L23301`），畫面上連到學習主題的那一節。 */
  nodes: string[];
};

export type CodePipelinePhase = { id: string; name: string; role: string; stages: CodePipelineStage[] };

export type CodePipeline = {
  summary: string;
  phases: CodePipelinePhase[];
  /** 回饋迴圈：from／to 為步驟 id。 */
  loops: { from: string; to: string; text: string }[];
  /** 貫穿全程、不屬於單一步驟的系統觀念。 */
  crosscut: { title: string; text: string; cards: string[]; nodes: string[] }[];
};

export type CodeSheet = {
  subjectId: string;
  title: string;
  pipeline?: CodePipeline;
  walkthroughs: CodeWalkthrough[];
  /** 版本與連結的查核日（YYYY-MM-DD）。 */
  checkedAt: string;
  versions: CodeSheetVersion[];
  /** 考前最後看的陷阱清單。 */
  traps: { text: string; exams: string[] }[];
  /** 速算公式。 */
  formulas: { label: string; expr: string; note: string }[];
  sections: CodeSheetSection[];
};
