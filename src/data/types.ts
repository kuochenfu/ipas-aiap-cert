/** 本站涵蓋的兩張證照：AI 應用規劃師、AIoT 應用工程師。 */
export type Cert = "aiap" | "aiot";

export type Level = "junior" | "senior";

export type ChoiceId = "A" | "B" | "C" | "D";

export type Choice = { id: ChoiceId; text: string };

export type Difficulty = "易" | "中" | "難";

/**
 * 原始考卷中以圖片呈現、pdftotext 無法擷取的內容之手寫轉錄。
 * 這些「圖」實際上幾乎都是程式碼截圖與 console 輸出，故一律轉為文字保存：
 * 可搜尋、可複製、在手機與深色模式下皆可讀，且不需在 repo 放二進位檔。
 * 內容寫在 `src/data/explanations/*.ts`（手寫層），載入時依 id 合併，
 * 因此重跑 `npm run parse:papers` 不會弄丟轉錄。
 */
export type QuestionFigure = {
  /**
   * note   一段散文式前言（含跨題共用引文）
   * code   程式碼片段
   * output console / REPL 輸出
   * table  資料表（以等寬對齊保存）
   * chart  真正的圖表——無法轉為文字，改以文字描述其內容
   */
  kind: "note" | "code" | "output" | "table" | "chart";
  /** 圖上方的說明文字，例「下圖顯示資料集的第 1 筆部分資料。」 */
  caption?: string;
  /** 轉錄後的內文；note/chart 為散文，其餘保留換行與縮排。 */
  content: string;
};

export type Question = {
  id: string;
  subjectId: string;
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
  choiceExplanations?: Partial<Record<ChoiceId, string>>;
  /** 題幹附圖的轉錄，依出現順序排列，渲染於題幹與選項之間。 */
  figures?: QuestionFigure[];
  /** 選項本身即為圖片時（例：四個選項各是一段程式碼截圖）的轉錄。 */
  choiceFigures?: Partial<Record<ChoiceId, QuestionFigure>>;
  topic: string;
  difficulty: Difficulty;
  source: "past-exam" | "generated" | "study-guide";
  sourceRef?: string;
};

export type ReadingLink = { title: string; url: string };

/** 比較表。欄數以 headers 為準，rows 的每一列長度應與之相同。 */
export type StudyNoteTable = { headers: string[]; rows: string[][] };

export type StudyNoteItem = {
  /** 一般條目的內容；帶 table／flow 時作為該區塊的標題。 */
  text: string;
  children?: StudyNoteItem[];
  /** 比較表。壓成條列會逼讀者在腦中轉置回表格，故獨立成型別。 */
  table?: StudyNoteTable;
  /** 公式：expr 以等寬字型強調，note 放代入例或說明。 */
  formula?: { expr: string; note?: string };
  /** 流程／管線：以帶箭頭的步驟列呈現。 */
  flow?: string[];
};

export type StudyNoteSection = {
  heading: string;
  items: StudyNoteItem[];
};

export type StudyNotesBySubject = Record<string, Record<string, StudyNoteSection[]>>;

export type StudyTopic = {
  code: string;
  title: string;
  contents: string[];
  notes?: StudyNoteSection[];
  links: ReadingLink[];
};

export type SubjectStudyGuide = {
  subjectId: string;
  topics: StudyTopic[];
};
