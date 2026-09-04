import type { DistractorType, Question, QuestionArchetype, QuestionMeta } from "../data/types";
import type { AnswerState } from "./exam";
import { isCorrect } from "./exam";

/**
 * 學習診斷：把既有的 `QuestionMeta` 彙總成「答對率之外」的三張表。
 *
 * 為什麼是這三張——命題時已經逐題標好了認知層級、題型原型與**每個錯誤選項的干擾類型**，
 * 但站上一直只把它們渲染成散文（判斷分界）或完全不顯示。同一份資料換個方向讀，
 * 就能回答「不是機器學習 62%，而是定義 92%／對比 48%／遷移 39%」這種問題，
 * 而且**不需要新增任何題目**。
 *
 * 只有新題庫（`src/data/practice/`，915 題）帶 meta；原題庫 1,057 題尚未回填，
 * 因此呼叫端必須先以 `hasQuestionMeta()` 判斷要不要顯示這三張表。
 */

export type CognitiveLevel = QuestionMeta["cognitiveLevel"];

/** 一列統計：total 為題庫中的題數，answered/correct 只計已作答者。 */
export type MetaStatRow = {
  key: string;
  label: string;
  total: number;
  answered: number;
  correct: number;
};

export type ErrorRow = {
  type: DistractorType;
  label: string;
  /** 這個干擾類型對應到哪一種心智模型錯誤（Error Library）。 */
  errorClass: string;
  /** 選到這類選項代表什麼。 */
  meaning: string;
  /** 下一步該做什麼。 */
  advice: string;
  count: number;
};

export const cognitiveLevelLabels: Record<CognitiveLevel, string> = {
  L1: "L1 記憶",
  L2: "L2 理解",
  L3: "L3 應用",
  L4: "L4 分析",
};

export const archetypeLabels: Record<QuestionArchetype, string> = {
  "Direct Concept": "直述概念",
  "Concept Boundary": "概念邊界",
  "Comparison": "概念比較",
  "Scenario Selection": "情境選型",
  "Constraint Change": "條件變動",
  "Troubleshooting": "故障排除",
  "Architecture": "架構設計",
  "Incorrect Statement": "何者錯誤",
  "Multi-Statement": "多敘述判斷",
  "Best Engineering Decision": "最佳工程決策",
};

/**
 * 干擾類型 → 心智模型錯誤。
 *
 * 命題時標的是「這個錯誤選項是用什麼方式誘答的」；使用者真的選了它，就等於暴露了
 * 對應的那一種理解缺口。`advice` 一律指向站上已經存在的東西（該節點的「容易混淆」、
 * 題目的「判斷分界」），因為叫使用者「多讀書」等於沒說。
 */
export const errorLibrary: Record<DistractorType, Omit<ErrorRow, "type" | "count">> = {
  "Neighbor Concept": {
    label: "相鄰概念",
    errorClass: "概念邊界不清",
    meaning: "選到了旁邊那個長得很像、但適用範圍不同的概念。",
    advice: "回該節點的「容易混淆」一節，把兩個概念的分界寫成一句話。",
  },
  "Terminology Swap": {
    label: "術語張冠李戴",
    errorClass: "基本知識缺失",
    meaning: "名詞與定義配錯了，屬於記憶層而非判斷層的失誤。",
    advice: "用學習頁的縮寫速查與名詞定義複習，這類錯誤靠重複提取就會消失。",
  },
  "Layer Confusion": {
    label: "層級混淆",
    errorClass: "概念邊界不清",
    meaning: "把不同層的東西混在一起——協定層、架構層或流程階段搞錯了。",
    advice: "先確認題目問的是哪一層，再看選項落在哪一層。",
  },
  "Partial Truth": {
    label: "只對一半",
    errorClass: "太早收斂",
    meaning: "選項前半正確，讀到一半就下了結論，後半其實失真。",
    advice: "逐句檢查選項：一句錯，整個選項就是錯的。",
  },
  "Overgeneralization": {
    label: "過度推廣",
    errorClass: "假設錯誤",
    meaning: "把有前提的結論當成通則，忽略了它成立的條件。",
    advice: "問自己「這句話在什麼條件下才成立」，找不到條件就是過度推廣。",
  },
  "Correct in Different Context": {
    label: "換情境就不成立",
    errorClass: "遷移失敗",
    meaning: "選項本身沒錯，但不適用本題給的限制條件。",
    advice: "先讀題幹的限制（延遲、功耗、資料量、法規），再回頭看選項。",
  },
  "Wrong Trade-off": {
    label: "取捨判斷失準",
    errorClass: "證據判讀錯誤",
    meaning: "兩個方案都認得，但在本題的條件下選錯了權衡方向。",
    advice: "看該題的「判斷分界」——條件變成什麼樣時，答案就換人。",
  },
};

/** 題庫是否帶命題後設資料。半數以上有 meta 才顯示診斷表，避免呈現一張幾乎全空的表。 */
export const hasQuestionMeta = (questions: Question[]): boolean => {
  if (!questions.length) return false;
  return questions.filter((question) => question.meta).length / questions.length > 0.5;
};

type Bucket = { total: number; answered: number; correct: number };

const emptyBucket = (): Bucket => ({ total: 0, answered: 0, correct: 0 });

const tally = (
  questions: Question[],
  answers: AnswerState,
  keyOf: (meta: QuestionMeta) => string | undefined,
): Map<string, Bucket> => {
  const map = new Map<string, Bucket>();
  for (const question of questions) {
    if (!question.meta) continue;
    const key = keyOf(question.meta);
    if (key === undefined) continue;
    const bucket = map.get(key) ?? emptyBucket();
    bucket.total += 1;
    if (answers[question.id] !== undefined) {
      bucket.answered += 1;
      if (isCorrect(question, answers[question.id])) bucket.correct += 1;
    }
    map.set(key, bucket);
  }
  return map;
};

/** 依認知層級（L1–L4）的表現。固定依 L1→L4 排序，題庫沒有的層級不列。 */
export const cognitiveLevelStats = (questions: Question[], answers: AnswerState): MetaStatRow[] => {
  const map = tally(questions, answers, (meta) => meta.cognitiveLevel);
  return (Object.keys(cognitiveLevelLabels) as CognitiveLevel[])
    .filter((level) => map.has(level))
    .map((level) => ({ key: level, label: cognitiveLevelLabels[level], ...map.get(level)! }));
};

/** 依題型原型的表現，依題數多寡排序（多的先看，統計才有意義）。 */
export const archetypeStats = (questions: Question[], answers: AnswerState): MetaStatRow[] => {
  const map = tally(questions, answers, (meta) => meta.archetype);
  return [...map.entries()]
    .map(([key, bucket]) => ({
      key,
      label: archetypeLabels[key as QuestionArchetype] ?? key,
      ...bucket,
    }))
    .sort((a, b) => b.total - a.total || a.key.localeCompare(b.key));
};

/**
 * 錯誤類型分布：只看「答錯」的題目，查它所選的那個錯誤選項被標成哪一種干擾。
 *
 * 未作答不計（沒有資訊）；答對不計（沒有錯誤可分析）；選到的選項若沒有干擾類型標註
 * （理論上不該發生，`tests/questionBankMeta.test.ts` 要求三個錯誤選項都有標）則跳過。
 * 依次數排序，只回傳次數 > 0 的類型——列出一堆 0 會讓真正的問題被稀釋。
 */
export const errorTypeStats = (questions: Question[], answers: AnswerState): ErrorRow[] => {
  const counts = new Map<DistractorType, number>();
  for (const question of questions) {
    const chosen = answers[question.id];
    if (chosen === undefined || isCorrect(question, chosen)) continue;
    const type = question.meta?.distractorTypes[chosen];
    if (!type) continue;
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count, ...errorLibrary[type] }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
};

export type Diagnostics = {
  levels: MetaStatRow[];
  archetypes: MetaStatRow[];
  errors: ErrorRow[];
  /** 已作答但沒有干擾類型可分析的錯題數，供「分析涵蓋多少錯題」誠實呈現。 */
  unclassifiedWrong: number;
};

export const buildDiagnostics = (questions: Question[], answers: AnswerState): Diagnostics => {
  const errors = errorTypeStats(questions, answers);
  const classified = errors.reduce((n, row) => n + row.count, 0);
  const wrong = questions.filter((question) => {
    const chosen = answers[question.id];
    return chosen !== undefined && !isCorrect(question, chosen);
  }).length;
  return {
    levels: cognitiveLevelStats(questions, answers),
    archetypes: archetypeStats(questions, answers),
    errors,
    unclassifiedWrong: wrong - classified,
  };
};
