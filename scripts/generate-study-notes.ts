import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

type NoteSection = {
  heading: string;
  details: string[];
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
const outFile = join(root, "src", "data", "studyNotes.ts");

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeLine = (line: string): string =>
  line
    .split("\f")[0]
    .replace(/[　 ]+/g, " ")
    .replace(/\s+([，。；：、）])/g, "$1")
    .replace(/([（])\s+/g, "$1")
    .trim();

const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  line.startsWith("- Source") ||
  line.startsWith("- Pages") ||
  line.startsWith("- Conversion") ||
  /^## Page \d+/.test(line) ||
  /^\d+$/.test(line) ||
  /^\d+-\d+$/.test(line) ||
  /^/.test(line) ||
  /^第[一二三四五六七八九十]+章/.test(line) ||
  /^[-=]{3,}$/.test(line) ||
  line === "_No extractable text on this page._";

const isSectionHeading = (line: string): boolean => /^[3-6]\.\d+(\s|$)/.test(line) && !line.includes("...");

const isQuestionStart = (lines: string[], index: number): boolean => {
  if (!/^\d+\.\s+/.test(lines[index])) return false;
  const lookahead = lines.slice(index + 1, index + 8);
  return ["A", "B", "C", "D"].every((id) => lookahead.some((line) => line.startsWith(`（${id}）`)));
};

const isAnswerStart = (line: string): boolean => /^\d+\.\s*Ans（[A-D]）/.test(line);

const startsNewDetail = (line: string): boolean =>
  /^[◼•○●▪-]\s*/.test(line) ||
  /^[A-Z]\.\s+/.test(line) ||
  /^[a-z]\.\s+/.test(line) ||
  /^（\d+）/.test(line) ||
  /^\(\d+\)/.test(line) ||
  /^\d+\.\s+/.test(line);

const cleanDetail = (line: string): string =>
  line
    .replace(/^[◼•○●▪-]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

const findSectionStart = (lines: string[], sectionNumber: string): number => {
  const re = new RegExp(`^${escapeRegExp(sectionNumber)}(\\s|$)`);
  return lines.findIndex((line, index) => index > 90 && re.test(line) && !line.includes("..."));
};

const findSectionEnd = (lines: string[], start: number): number => {
  for (let i = start + 1; i < lines.length; i += 1) {
    if (isSectionHeading(lines[i])) return i;
    if (lines[i].startsWith("附件") || lines[i].includes("本學習指引參考書目")) return i;
  }
  return lines.length;
};

const pushCurrent = (details: string[], current: string[]): void => {
  const text = cleanDetail(current.join(""));
  if (text.length >= 6 && !isNoise(text) && !/^[3-6]\.\d+$/.test(text)) {
    details.push(text);
  }
  current.length = 0;
};

const collectSection = (lines: string[], section: SectionMapping): NoteSection => {
  const start = findSectionStart(lines, section.number);
  if (start < 0) return { heading: `${section.number} ${section.heading}`, details: [] };

  const end = findSectionEnd(lines, start);
  const details: string[] = [];
  const current: string[] = [];

  for (let i = start + 1; i < end; i += 1) {
    const line = lines[i];
    if (isNoise(line)) continue;
    if (isQuestionStart(lines, i) || isAnswerStart(line)) break;
    if (/^[3-6]\.\d+$/.test(line)) continue;

    const text = cleanDetail(line);
    if (text.length < 2) continue;

    if (startsNewDetail(text) || current.join("").length > 220) {
      pushCurrent(details, current);
    }
    current.push(text);
  }
  pushCurrent(details, current);

  return { heading: `${section.number} ${section.heading}`, details };
};

const data: Record<string, Record<string, NoteSection[]>> = {};

for (const guide of guides) {
  const markdown = readFileSync(join(mdDir, guide.file), "utf8");
  const lines = markdown.split("\n").map(normalizeLine);
  data[guide.subjectId] = {};

  for (const topic of guide.topics) {
    data[guide.subjectId][topic.code] = topic.sections
      .map((section) => collectSection(lines, section))
      .filter((section) => section.details.length > 0);
  }
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `import type { StudyNotesBySubject } from "./types";\n\n` +
    `// Generated by scripts/generate-study-notes.ts from docs/markdown learning guides.\n` +
    `export const studyNotes: StudyNotesBySubject = ${JSON.stringify(data, null, 2)};\n`,
  "utf8",
);

for (const [subjectId, topics] of Object.entries(data)) {
  const count = Object.values(topics).flat().reduce((sum, section) => sum + section.details.length, 0);
  console.log(`✓ ${subjectId}：${count} 則學習筆記 → ${outFile}`);
}
