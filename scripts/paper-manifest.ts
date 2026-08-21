import type { GuideSection, ParseContext } from "./parse-core";

/**
 * 一份可解析的來源檔。除了檔名之外的欄位即 `ParseContext`——
 * 學習指引的方言設定（選項標記、逐項解析、節點對應）皆為選用，
 * 省略時解析行為與既有五科完全相同。
 */
export type PaperEntry = ParseContext & {
  file: string;       // docs/markdown 下的檔名
};

export const papers: PaperEntry[] = [
  {
    file: "115年第一次初級AI應用規劃師_第一科_人工智慧基礎概論_公告試題_20260410164304.md",
    subjectId: "junior-ai-basics", examCode: "115-1", examLabel: "115年第一次",
  },
  {
    file: "115年第二次初級AI應用規劃師_第一科_人工智慧基礎概論_公告試題_20260604212644.md",
    subjectId: "junior-ai-basics", examCode: "115-2", examLabel: "115年第二次",
  },
  {
    file: "114年第四梯次初級AI應用規劃師第一科人工智慧基礎概論(當次試題公告114_20251226000442.md",
    subjectId: "junior-ai-basics", examCode: "114-4", examLabel: "114年第四梯次",
  },
  {
    file: "115年第一次初級AI應用規劃師_第二科_生成式AI應用與規劃_公告試題_20260410164328.md",
    subjectId: "junior-genai", examCode: "115-1", examLabel: "115年第一次",
  },
  {
    file: "115年第二次初級AI應用規劃師_第二科_生成式AI應用與規劃_公告試題_20260604212719.md",
    subjectId: "junior-genai", examCode: "115-2", examLabel: "115年第二次",
  },
  {
    file: "114年第四梯次初級AI應用規劃師第二科生成式AI應用與規劃(當次試題公告114_20251226000507.md",
    subjectId: "junior-genai", examCode: "114-4", examLabel: "114年第四梯次",
  },
  {
    file: "115年第一次中級AI應用規劃師_第一科_人工智慧技術應用與規劃_公告試題_20260615003359.md",
    subjectId: "senior-ai-tech", examCode: "115-1", examLabel: "115年第一次",
  },
  {
    file: "114年第二梯次中級AI應用規劃師第一科人工智慧技術應用與規劃(當次試題公告114_20251226000616.md",
    subjectId: "senior-ai-tech", examCode: "114-2", examLabel: "114年第二梯次",
  },
  {
    file: "115年第一次中級AI應用規劃師_第二科_大數據處理分析與應用_公告試題_20260615003417.md",
    subjectId: "senior-bigdata", examCode: "115-1", examLabel: "115年第一次",
  },
  {
    file: "114年第二梯次中級AI應用規劃師第二科大數據處理分析與應用(當次試題公告114_20251226000634.md",
    subjectId: "senior-bigdata", examCode: "114-2", examLabel: "114年第二梯次",
  },
  {
    file: "115年第一次中級AI應用規劃師_第三科_機器學習技術與應用_公告試題_20260615003428.md",
    subjectId: "senior-ml", examCode: "115-1", examLabel: "115年第一次",
  },
  {
    file: "114年第二梯次中級AI應用規劃師第三科機器學習技術與應用(當次試題公告114_20251226000650.md",
    subjectId: "senior-ml", examCode: "114-2", examLabel: "114年第二梯次",
  },
];

/**
 * AIoT 考科一的九個評鑑內容節點與各自的練習評量題數，依指引中的出現順序排列。
 * 節點碼採兩層碼（A = 考科一、B = 考科二），對應 115 年度簡章 2.5 節的評鑑內容。
 * 這份表同時作為解析後的斷言依據——題數對不上就代表指引結構被改動或解析漏題。
 */
export const aiotBasicsSections: GuideSection[] = [
  { code: "A1.1 AI 基礎概念", count: 5 },
  { code: "A1.2 AIoT 應用案例", count: 5 },
  { code: "A2.1 物聯網架構與功能", count: 10 },
  { code: "A2.2 常見通訊協定與網路層技術", count: 10 },
  { code: "A2.3 工業通訊標準與資訊模型", count: 10 },
  { code: "A2.4 中介軟體與平台", count: 10 },
  { code: "A2.5 資安與隱私基本概念", count: 10 },
  { code: "A3.1 感測技術基礎", count: 10 },
  { code: "A3.2 感測訊號與通訊基礎", count: 10 },
];

export const studyGuides: PaperEntry[] = [
  {
    file: "AI應用規劃師(初級)-學習指引-科目1_人工智慧基礎概論1141203_20251222172144.md",
    subjectId: "junior-ai-basics", examCode: "guide", examLabel: "初級科目一學習指引參考題",
  },
  {
    file: "AI應用規劃師(初級)-學習指引-科目2_生成式AI應用與規劃114123_20251222172159.md",
    subjectId: "junior-genai", examCode: "guide", examLabel: "初級科目二學習指引參考題",
  },
  {
    file: "AI應用規劃師(中級)-學習指引-科目1人工智慧技術應用規劃_20251222101833.md",
    subjectId: "senior-ai-tech", examCode: "guide", examLabel: "中級科目一學習指引參考題",
  },
  {
    file: "AI應用規劃師(中級)-學習指引-科目2大數據處理分析與應用_20251222101850.md",
    subjectId: "senior-bigdata", examCode: "guide", examLabel: "中級科目二學習指引參考題",
  },
  {
    file: "AI應用規劃師(中級)-學習指引-科目3機器學習技術與應用_20251222101907.md",
    subjectId: "senior-ml", examCode: "guide", examLabel: "中級科目三學習指引參考題",
  },
  {
    file: "AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.md",
    subjectId: "aiot-junior-basics", examCode: "guide",
    examLabel: "AIoT 初級考科一學習指引練習評量",
    // 這份指引的選項標記為半形，且部分題目的解答區塊為逐項選項解析。
    choiceMarker: "halfwidth",
    perChoiceExplanations: true,
    source: "study-guide",
    // 練習評量附在每個評鑑內容小節之後，順序與題數即官方節點對應，
    // 因此 topic 由出處決定、不需人工判讀。
    sections: aiotBasicsSections,
  },
];
