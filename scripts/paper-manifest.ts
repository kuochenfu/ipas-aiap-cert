export type PaperEntry = {
  file: string;       // docs/markdown 下的檔名
  subjectId: string;
  examCode: string;   // 用於 id，例 "115-1"
  examLabel: string;  // 顯示用，例 "115年第一次"
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
];
