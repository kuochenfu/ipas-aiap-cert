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
  /** 命題設計的中繼資料；目前只有依 v2.0 規格產生的 AIoT 題庫具備。 */
  meta?: QuestionMeta;
};

/**
 * 命題設計的中繼資料（依 2026 iPAS AIoT 題庫生成規格 v2.0）。
 *
 * 存成結構化欄位而非註解，是為了讓「按認知層級抽題」「找出考生的能力缺口」
 * 「分析錯誤模式」這些事日後做得起來——只記「這題答錯」無法回答「為什麼錯」。
 * 也因此 `distractorTypes` 記的是每個錯誤選項的**干擾類型**，而不只是對錯。
 */
export type QuestionMeta = {
  /** Bloom 認知層級：L1 記憶、L2 理解、L3 應用、L4 分析。 */
  cognitiveLevel: "L1" | "L2" | "L3" | "L4";
  /** 題型原型，例「Scenario Selection」「Troubleshooting」。 */
  archetype: QuestionArchetype;
  /**
   * 本題涉及的概念關鍵字，供弱點分析與相似題推薦。
   *
   * 選用：新題庫（`practice/`）逐題都有；**原題庫的回填只帶認知層級與題型原型**，
   * 不含概念與干擾類型（見 `src/data/meta/`）。目前全站的概念字串共 1,890 個、
   * 其中 73% 只出現一次，尚未收斂成受控詞彙，因此回填時硬湊只會讓標籤雲更大。
   */
  concepts?: string[];
  /** 情境題的工程限制條件，例 range／power／latency。 */
  constraints?: string[];
  /**
   * 每個錯誤選項的干擾類型；正解不列。
   *
   * 選用，理由同 `concepts`：原題庫的回填只到題型層，逐選項的干擾類型是另一份工作。
   * 缺少時「錯誤類型」診斷會把該題的錯答計入 `unclassifiedWrong` 並如實顯示，
   * 而不是靜默漏掉。
   */
  distractorTypes?: Partial<Record<ChoiceId, DistractorType>>;
  /** 跨節點題目所涉及的另一個節點碼。 */
  crossNode?: string;
  /** 條件改變時答案如何變化——建立工程判斷的關鍵，渲染於詳解之後。 */
  decisionBoundary?: string;
};

export type QuestionArchetype =
  | "Direct Concept"
  | "Concept Boundary"
  | "Comparison"
  | "Scenario Selection"
  | "Constraint Change"
  | "Troubleshooting"
  | "Architecture"
  | "Incorrect Statement"
  | "Multi-Statement"
  | "Best Engineering Decision"
  /**
   * 計算求值。新題庫的規格 v2.0 沒有這一型（它針對的是工程判斷題），
   * 但真題裡「二分搜尋要比較幾次」「參數量是多少」「OEE 等於多少」這類題確實成群出現，
   * 硬塞進「直述概念」會讓診斷表把它們讀成記憶題。原題庫回填時新增。
   */
  | "Calculation";

export type DistractorType =
  | "Neighbor Concept"
  | "Correct in Different Context"
  | "Layer Confusion"
  | "Partial Truth"
  | "Overgeneralization"
  | "Terminology Swap"
  | "Wrong Trade-off";

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
