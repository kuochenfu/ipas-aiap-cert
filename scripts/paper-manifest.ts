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
    file: "114年第四梯次初級AI應用規劃師第一科人工智慧基礎概論(當次試題公告114_20251226000442.md",
    subjectId: "junior-ai-basics", examCode: "114-4", examLabel: "114年第四梯次",
  },
  {
    file: "115年第一次初級AI應用規劃師_第二科_生成式AI應用與規劃_公告試題_20260410164328.md",
    subjectId: "junior-genai", examCode: "115-1", examLabel: "115年第一次",
  },
  {
    file: "114年第四梯次初級AI應用規劃師第二科生成式AI應用與規劃(當次試題公告114_20251226000507.md",
    subjectId: "junior-genai", examCode: "114-4", examLabel: "114年第四梯次",
  },
  {
    file: "114年第二梯次中級AI應用規劃師第一科人工智慧技術應用與規劃(當次試題公告114_20251226000616.md",
    subjectId: "senior-ai-tech", examCode: "114-2", examLabel: "114年第二梯次",
  },
  {
    file: "114年第二梯次中級AI應用規劃師第二科大數據處理分析與應用(當次試題公告114_20251226000634.md",
    subjectId: "senior-bigdata", examCode: "114-2", examLabel: "114年第二梯次",
  },
  {
    file: "114年第二梯次中級AI應用規劃師第三科機器學習技術與應用(當次試題公告114_20251226000650.md",
    subjectId: "senior-ml", examCode: "114-2", examLabel: "114年第二梯次",
  },
];
