import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sliceSection } from "./studySlice";

type SectionMapping = {
  number: string;
  heading: string;
};

type TopicMapping = {
  code: string;
  sections: SectionMapping[];
};

type GuideMapping = {
  subjectId: string;
  file: string;
  topics: TopicMapping[];
};

const guides: GuideMapping[] = [
  {
    subjectId: "junior-ai-basics",
    file: "AI應用規劃師(初級)-學習指引-科目1_人工智慧基礎概論1141203_20251222172144.md",
    topics: [
      { code: "L111", sections: [{ number: "3.1", heading: "人工智慧概念" }] },
      { code: "L112", sections: [{ number: "3.2", heading: "資料處理與分析概念" }] },
      { code: "L113", sections: [{ number: "3.3", heading: "機器學習概念" }] },
      { code: "L114", sections: [{ number: "3.4", heading: "鑑別式 AI 與生成式 AI 概念" }] },
    ],
  },
  {
    subjectId: "junior-genai",
    file: "AI應用規劃師(初級)-學習指引-科目2_生成式AI應用與規劃114123_20251222172159.md",
    topics: [
      { code: "L121", sections: [{ number: "3.1", heading: "No code / Low code 概念" }] },
      { code: "L122", sections: [{ number: "3.2", heading: "生成式 AI 應用領域與工具使用" }] },
      { code: "L123", sections: [{ number: "3.3", heading: "生成式 AI 導入評估規劃" }] },
    ],
  },
  {
    subjectId: "senior-ai-tech",
    file: "AI應用規劃師(中級)-學習指引-科目1人工智慧技術應用規劃_20251222101833.md",
    topics: [
      {
        code: "L211",
        sections: [
          { number: "3.1", heading: "自然語言處理技術與應用" },
          { number: "3.2", heading: "電腦視覺技術與應用" },
          { number: "3.3", heading: "生成式 AI 技術與應用" },
          { number: "3.4", heading: "多模態人工智慧應用" },
        ],
      },
      {
        code: "L212",
        sections: [
          { number: "4.1", heading: "AI 導入評估" },
          { number: "4.2", heading: "AI 導入規劃" },
          { number: "4.3", heading: "AI 風險管理" },
        ],
      },
      {
        code: "L213",
        sections: [
          { number: "5.1", heading: "數據準備與模型選擇" },
          { number: "5.2", heading: "AI 技術系統集成與部署" },
        ],
      },
    ],
  },
  {
    subjectId: "senior-bigdata",
    file: "AI應用規劃師(中級)-學習指引-科目2大數據處理分析與應用_20251222101850.md",
    topics: [
      {
        code: "L221",
        sections: [
          { number: "3.1", heading: "敘述性統計與資料摘要技術" },
          { number: "3.2", heading: "機率分佈與資料分佈模型" },
          { number: "3.3", heading: "假設檢定與統計推論" },
        ],
      },
      {
        code: "L222",
        sections: [
          { number: "4.1", heading: "數據收集與清理" },
          { number: "4.2", heading: "數據儲存與管理" },
          { number: "4.3", heading: "數據處理技術與工具" },
        ],
      },
      {
        code: "L223",
        sections: [
          { number: "5.1", heading: "統計學在大數據中的應用" },
          { number: "5.2", heading: "常見的大數據分析方法" },
          { number: "5.3", heading: "數據可視化工具" },
        ],
      },
      {
        code: "L224",
        sections: [
          { number: "6.1", heading: "大數據與機器學習" },
          { number: "6.2", heading: "大數據在鑑別式 AI 中的應用" },
          { number: "6.3", heading: "大數據在生成式 AI 中的應用" },
          { number: "6.4", heading: "大數據隱私保護、安全與合規" },
        ],
      },
    ],
  },
  {
    subjectId: "senior-ml",
    file: "AI應用規劃師(中級)-學習指引-科目3機器學習技術與應用_20251222101907.md",
    topics: [
      {
        code: "L231",
        sections: [
          { number: "3.1", heading: "機率/統計之機器學習基礎應用" },
          { number: "3.2", heading: "線性代數之機器學習基礎應用" },
          { number: "3.3", heading: "數值優化技術與方法" },
        ],
      },
      {
        code: "L232",
        sections: [
          { number: "4.1", heading: "機器學習原理與技術" },
          { number: "4.2", heading: "常見機器學習演算法" },
          { number: "4.3", heading: "深度學習原理與框架" },
        ],
      },
      {
        code: "L233",
        sections: [
          { number: "5.1", heading: "數據準備與特徵工程" },
          { number: "5.2", heading: "模型選擇與架構設計" },
          { number: "5.3", heading: "模型訓練、評估與驗證" },
          { number: "5.4", heading: "模型調整與優化" },
        ],
      },
      {
        code: "L234",
        sections: [
          { number: "6.1", heading: "數據隱私、安全與合規" },
          { number: "6.2", heading: "演算法偏見與公平性" },
        ],
      },
    ],
  },
];

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const mdDir = join(root, "docs", "markdown");

const normalizeLine = (line: string): string =>
  line
    .split("\f")[0]
    .replace(/[　 ]+/g, " ")
    .replace(/\s+([，。；：、）])/g, "$1")
    .replace(/([（])\s+/g, "$1")
    .trim();

const slicesDir = join(root, "docs", "study-slices");
rmSync(slicesDir, { recursive: true, force: true });

for (const guide of guides) {
  const markdown = readFileSync(join(mdDir, guide.file), "utf8");
  const lines = markdown.split("\n").map(normalizeLine);
  const dir = join(slicesDir, guide.subjectId);
  mkdirSync(dir, { recursive: true });
  for (const topic of guide.topics) {
    for (const section of topic.sections) {
      const slice = sliceSection(lines, section.number);
      const file = join(dir, `${topic.code}-${section.number}.md`);
      writeFileSync(
        file,
        `# ${topic.code} ${section.number} ${section.heading}\n\n${slice.join("\n")}\n`,
        "utf8",
      );
      console.log(`✓ ${guide.subjectId}/${topic.code}-${section.number}（${slice.length} 行）`);
    }
  }
}
