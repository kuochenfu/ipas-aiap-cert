# iPAS AI 應用規劃師認證練習網站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 打造一個純前端、可部署到 GitHub Pages 的 iPAS「AI 應用規劃師」練習網站，初級/中級各科分開，提供「模擬考試」與「刷題練習」兩種模式，題庫為歷屆真題加上撰寫的新題，每題附中文詳解。

**Architecture:** 原生 Vite + TypeScript 靜態 SPA。`domain/` 放純函式（計分、科目目錄）；`scripts/parse-past-papers.ts` 把 `docs/markdown/` 的公告試題轉成 `src/data/past-exams/*.json`；`data/` 模組合併「真題 JSON + 詳解 map + 新題」成各科題庫；`state/` 管理作答與 localStorage；`ui/render.ts` 為純渲染函式（HTML 字串、含跳脫）；`main.ts` 負責視圖切換、計時器、事件委派。

**Tech Stack:** Vite 8、TypeScript 5、Vitest（單元測試）、tsx（執行解析腳本）。無執行期後端、無框架。

---

## File Structure

- `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html` — 專案骨架
- `src/main.ts` — 進入點、視圖狀態機、事件委派、計時器
- `src/domain/exam.ts` — 型別、`examRules`、答案比對、計分、主題統計
- `src/domain/catalog.ts` — `Level`/`Subject` 型別、五科目錄、查詢輔助
- `src/state/storage.ts` — localStorage 錯題本/紀錄，含形狀驗證
- `src/state/attempt.ts` — 一次作答的建立/抽題/打散/選答/交卷（可注入亂數）
- `src/ui/render.ts` — 純渲染函式（首頁、科目頁、作答、檢討、錯題本）、HTML 跳脫
- `src/ui/escape.ts` — `escapeHtml` 小工具
- `src/styles.css` — 樣式
- `src/data/types.ts` — 共用 `Question` 型別（被 data 與 scripts 共用）
- `src/data/past-exams/<subjectId>.json` — 解析腳本產出的真題（由腳本覆寫）
- `src/data/explanations/<subjectId>.ts` — 手寫詳解 `Record<questionId,string>`
- `src/data/generated/<subjectId>.ts` — 手寫新題 `Question[]`
- `src/data/<subjectId>.ts` — 合併以上三者匯出 `questions`
- `src/data/index.ts` — 匯總所有科目題庫，提供 `getQuestions(subjectId)`
- `scripts/parse-past-papers.ts` — 解析公告試題 md → past-exams JSON
- `scripts/paper-manifest.ts` — 檔名 → {subjectId, examCode, examLabel} 對照
- `tests/**` — Vitest 測試
- `.github/workflows/deploy.yml` — GitHub Pages 部署
- `README.md`, `AGENTS.md`, `docs/architecture.md` — 文件

五個 subjectId：`junior-ai-basics`、`junior-genai`、`senior-ai-tech`、`senior-bigdata`、`senior-ml`。

---

## Task 1: 專案骨架

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `src/styles.css`, `.gitignore`（已存在則確認內容）

- [ ] **Step 1: 建立 package.json**

```json
{
  "name": "ipas-aiap-cert",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "parse:papers": "tsx scripts/parse-past-papers.ts"
  },
  "devDependencies": {
    "@types/node": "^25.6.2",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3",
    "vite": "^8.0.11",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: 建立 tsconfig.json**（啟用 JSON 匯入）

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "node"],
    "noEmit": true
  },
  "include": ["src", "scripts"]
}
```

- [ ] **Step 3: 建立 vite.config.ts**（GitHub Pages 子路徑 base）

```ts
import { defineConfig } from "vite";

export default defineConfig({
  base: "/ipas-aiap-cert/",
});
```

- [ ] **Step 4: 建立 index.html**

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>iPAS AI 應用規劃師 練習</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: 建立 src/main.ts 暫時內容**

```ts
const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  app.textContent = "iPAS AI 應用規劃師 練習（建置中）";
}
```

- [ ] **Step 6: 建立 src/styles.css**（暫時空檔，後續 Task 9 填入）

```css
:root {
  font-family: system-ui, "Noto Sans TC", sans-serif;
}
```

- [ ] **Step 7: 確認 .gitignore 內容**

```
node_modules/
dist/
.DS_Store
docs/raw/
```

- [ ] **Step 8: 安裝並驗證 build**

Run: `npm install && npm run build`
Expected: tsc 無錯、vite 產生 `dist/`，結束碼 0。

- [ ] **Step 9: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src/main.ts src/styles.css .gitignore
git commit -m "chore: scaffold vite + ts project"
```

---

## Task 2: 共用 Question 型別

**Files:**
- Create: `src/data/types.ts`

- [ ] **Step 1: 建立型別檔**（被 data 與 scripts 共用，避免循環依賴）

```ts
export type Level = "junior" | "senior";

export type ChoiceId = "A" | "B" | "C" | "D";

export type Choice = { id: ChoiceId; text: string };

export type Difficulty = "易" | "中" | "難";

export type Question = {
  id: string;
  subjectId: string;
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
  source: "past-exam" | "generated";
  sourceRef?: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/types.ts
git commit -m "feat: add shared Question type"
```

---

## Task 3: domain/exam.ts（計分與規則）

**Files:**
- Create: `src/domain/exam.ts`
- Test: `tests/exam.test.ts`

- [ ] **Step 1: 撰寫失敗測試**

```ts
import { describe, it, expect } from "vitest";
import { examRules, isCorrect, scoreExam, topicSummary } from "../src/domain/exam";
import type { Question } from "../src/data/types";

const q = (id: string, answer: "A" | "B" | "C" | "D", topic = "T1"): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" },
    { id: "C", text: "c" }, { id: "D", text: "d" },
  ],
  answer, explanation: "", topic, difficulty: "中", source: "past-exam",
});

describe("examRules", () => {
  it("每題2分、滿分100、70及格、最多錯15", () => {
    expect(examRules.totalQuestions).toBe(50);
    expect(examRules.pointsPerQuestion).toBe(2);
    expect(examRules.passScore).toBe(70);
    expect(examRules.maxWrongToPass).toBe(15);
  });
});

describe("isCorrect", () => {
  it("選對為真、選錯或未作答為假", () => {
    expect(isCorrect(q("1", "A"), "A")).toBe(true);
    expect(isCorrect(q("1", "A"), "B")).toBe(false);
    expect(isCorrect(q("1", "A"), undefined)).toBe(false);
  });
});

describe("scoreExam", () => {
  it("計算分數、對錯數、是否及格、錯題id", () => {
    const questions = [q("1", "A"), q("2", "B"), q("3", "C")];
    const answers = { "1": "A" as const, "2": "D" as const };
    const report = scoreExam(questions, answers);
    expect(report.correct).toBe(1);
    expect(report.wrong).toBe(2);
    expect(report.score).toBe(2);
    expect(report.passed).toBe(false);
    expect(report.missedQuestionIds).toEqual(["2", "3"]);
  });
});

describe("topicSummary", () => {
  it("依主題彙總答對率", () => {
    const questions = [q("1", "A", "T1"), q("2", "B", "T1"), q("3", "C", "T2")];
    const answers = { "1": "A" as const, "2": "X" as unknown as "A", "3": "C" as const };
    const rows = topicSummary(questions, answers);
    const t1 = rows.find((r) => r.topic === "T1")!;
    expect(t1.total).toBe(2);
    expect(t1.correct).toBe(1);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/exam.test.ts`
Expected: FAIL，找不到 `../src/domain/exam` 模組。

- [ ] **Step 3: 實作 exam.ts**

```ts
import type { ChoiceId, Question } from "../data/types";

export type AnswerState = Record<string, ChoiceId | undefined>;

export type ExamRules = {
  totalQuestions: number;
  pointsPerQuestion: number;
  passScore: number;
  maxWrongToPass: number;
};

export const examRules: ExamRules = {
  totalQuestions: 50,
  pointsPerQuestion: 2,
  passScore: 70,
  maxWrongToPass: 15,
};

export type ScoreReport = {
  score: number;
  correct: number;
  wrong: number;
  passed: boolean;
  missedQuestionIds: string[];
};

export type TopicRow = { topic: string; total: number; correct: number };

export const isCorrect = (question: Question, answer: ChoiceId | undefined): boolean =>
  answer !== undefined && answer === question.answer;

export const scoreExam = (questions: Question[], answers: AnswerState): ScoreReport => {
  const missedQuestionIds = questions
    .filter((question) => !isCorrect(question, answers[question.id]))
    .map((question) => question.id);
  const correct = questions.length - missedQuestionIds.length;
  const score = correct * examRules.pointsPerQuestion;
  return {
    score,
    correct,
    wrong: missedQuestionIds.length,
    passed: score >= examRules.passScore,
    missedQuestionIds,
  };
};

export const topicSummary = (questions: Question[], answers: AnswerState): TopicRow[] => {
  const map = new Map<string, TopicRow>();
  for (const question of questions) {
    const row = map.get(question.topic) ?? { topic: question.topic, total: 0, correct: 0 };
    row.total += 1;
    if (isCorrect(question, answers[question.id])) row.correct += 1;
    map.set(question.topic, row);
  }
  return [...map.values()];
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/exam.test.ts`
Expected: PASS（4 個 describe 全綠）。

- [ ] **Step 5: Commit**

```bash
git add src/domain/exam.ts tests/exam.test.ts
git commit -m "feat: add exam scoring domain with tests"
```

---

## Task 4: domain/catalog.ts（科目目錄）

**Files:**
- Create: `src/domain/catalog.ts`
- Test: `tests/catalog.test.ts`

- [ ] **Step 1: 撰寫失敗測試**

```ts
import { describe, it, expect } from "vitest";
import { subjects, getSubjectsByLevel, getSubject } from "../src/domain/catalog";

describe("catalog", () => {
  it("初級2科、中級3科", () => {
    expect(getSubjectsByLevel("junior")).toHaveLength(2);
    expect(getSubjectsByLevel("senior")).toHaveLength(3);
    expect(subjects).toHaveLength(5);
  });
  it("初級75分鐘、中級90分鐘", () => {
    expect(getSubject("junior-ai-basics")!.durationMinutes).toBe(75);
    expect(getSubject("senior-ml")!.durationMinutes).toBe(90);
  });
  it("查無回傳 undefined", () => {
    expect(getSubject("nope")).toBeUndefined();
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/catalog.test.ts`
Expected: FAIL，找不到模組。

- [ ] **Step 3: 實作 catalog.ts**

```ts
import type { Level } from "../data/types";

export type Subject = {
  id: string;
  level: Level;
  code: string;
  name: string;
  durationMinutes: 75 | 90;
};

export const subjects: Subject[] = [
  { id: "junior-ai-basics", level: "junior", code: "科目1", name: "人工智慧基礎概論", durationMinutes: 75 },
  { id: "junior-genai", level: "junior", code: "科目2", name: "生成式 AI 應用與規劃", durationMinutes: 75 },
  { id: "senior-ai-tech", level: "senior", code: "科目1", name: "人工智慧技術應用與規劃", durationMinutes: 90 },
  { id: "senior-bigdata", level: "senior", code: "科目2", name: "大數據處理分析與應用", durationMinutes: 90 },
  { id: "senior-ml", level: "senior", code: "科目3", name: "機器學習技術與應用", durationMinutes: 90 },
];

export const getSubjectsByLevel = (level: Level): Subject[] =>
  subjects.filter((subject) => subject.level === level);

export const getSubject = (id: string): Subject | undefined =>
  subjects.find((subject) => subject.id === id);
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/catalog.test.ts`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/domain/catalog.ts tests/catalog.test.ts
git commit -m "feat: add subject catalog with tests"
```

---

## Task 5: 公告試題對照表

**Files:**
- Create: `scripts/paper-manifest.ts`

- [ ] **Step 1: 建立對照表**（檔名對應科目與試卷代碼）

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add scripts/paper-manifest.ts
git commit -m "feat: add past-paper manifest"
```

---

## Task 6: 解析器核心函式（TDD）

解析器拆成「純函式 `parsePaper(markdown, ctx)`」（可測）與「I/O 包裝」（讀檔寫檔）。本 Task 只做純函式。

**Files:**
- Create: `scripts/parse-core.ts`
- Test: `tests/parse-core.test.ts`

- [ ] **Step 1: 撰寫失敗測試**（以縮小的真實格式片段為 fixture，含頁首雜訊與跨行延續）

```ts
import { describe, it, expect } from "vitest";
import { parsePaper } from "../scripts/parse-core";

const md = [
  "# 標題",
  "- Source: x",
  "## Page 1",
  "115 年第一次 AI 應用規劃師-初級能力鑑定【公告試題】",
  "第一科：人工智慧基礎概論",
  "考試日期：115 年 03 月 21 日",
  "第 1 頁，共 12 頁",
  "一、選擇題",
  "答案 題目",
  "D 1. 下列何者不屬於資料整合（Data Integration）的主要",
  "目的？",
  "(A)統一不同來源資料的格式；",
  "(B)識別並處理重複資料；",
  "(C)整併多來源資料；",
  "(D)依資料保存政策延長原始資料留存期限",
  "## Page 2",
  "第 2 頁，共 12 頁",
  "答案 題目",
  "B 2. 某銀行採用 SMOTE 改善訓練資料分佈，下列何者正確？",
  "(A)隨機刪除部分正常交易資料；",
  "(B)依少數類別樣本特徵空間，合成新的少數類別樣本；",
  "(C)調整損失函數權重；",
  "(D)以交叉驗證重新分割資料集，使各折類別比例一",
  "致",
].join("\n");

describe("parsePaper", () => {
  const questions = parsePaper(md, {
    subjectId: "junior-ai-basics", examCode: "115-1", examLabel: "115年第一次",
  });

  it("解析出兩題", () => {
    expect(questions).toHaveLength(2);
  });
  it("第一題：id、答案、題幹合併、四選項", () => {
    const q = questions[0];
    expect(q.id).toBe("junior-ai-basics-115-1-q01");
    expect(q.answer).toBe("D");
    expect(q.prompt).toBe("下列何者不屬於資料整合（Data Integration）的主要目的？");
    expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
    expect(q.choices[3].text).toBe("依資料保存政策延長原始資料留存期限");
    expect(q.source).toBe("past-exam");
    expect(q.sourceRef).toBe("115年第一次 第1題");
    expect(q.explanation).toBe("");
    expect(q.topic).toBe("未分類");
    expect(q.difficulty).toBe("中");
  });
  it("第二題跨頁延續：選項D合併到「致」", () => {
    const q = questions[1];
    expect(q.choices[3].text).toBe("以交叉驗證重新分割資料集，使各折類別比例一致");
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/parse-core.test.ts`
Expected: FAIL，找不到 `../scripts/parse-core`。

- [ ] **Step 3: 實作 parse-core.ts**

```ts
import type { ChoiceId, Question } from "../src/data/types";

export type ParseContext = {
  subjectId: string;
  examCode: string;
  examLabel: string;
};

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];

// 雜訊行：markdown 結構、頁首頁尾、欄位標題
const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  line.startsWith("- Source") ||
  line.startsWith("- Pages") ||
  line.startsWith("- Conversion") ||
  /^\d+$/.test(line) ||
  line.includes("【公告試題】") ||
  line.startsWith("第一科") ||
  line.startsWith("第二科") ||
  line.startsWith("第三科") ||
  line.startsWith("考試日期") ||
  line.startsWith("一、選擇題") ||
  /^答案\s*題目/.test(line) ||
  /^第\s*\d+\s*頁/.test(line);

const questionStart = /^([A-D])\s+(\d+)\.\s*(.*)$/;
const choiceStart = /^\(([A-D])\)\s*(.*)$/;

type Draft = {
  number: number;
  answer: ChoiceId;
  promptParts: string[];
  choices: { id: ChoiceId; parts: string[] }[];
};

const stripTrailing = (text: string): string => text.replace(/[；;]\s*$/, "");

export const parsePaper = (markdown: string, ctx: ParseContext): Question[] => {
  const lines = markdown.split("\n").map((l) => l.trim());
  const drafts: Draft[] = [];
  let current: Draft | null = null;
  // target：目前正在累加文字的欄位（題幹或某選項）
  let target: string[] | null = null;

  for (const line of lines) {
    if (isNoise(line)) continue;

    const qm = questionStart.exec(line);
    if (qm) {
      current = {
        number: Number(qm[2]),
        answer: qm[1] as ChoiceId,
        promptParts: [qm[3]],
        choices: [],
      };
      drafts.push(current);
      target = current.promptParts;
      continue;
    }

    const cm = choiceStart.exec(line);
    if (cm && current) {
      const choice = { id: cm[1] as ChoiceId, parts: [cm[2]] };
      current.choices.push(choice);
      target = choice.parts;
      continue;
    }

    // 其餘為前一欄位的跨行延續
    if (target) target.push(line);
  }

  return drafts.map((draft) => {
    const choices = CHOICE_IDS.map((id) => {
      const found = draft.choices.find((c) => c.id === id);
      return { id, text: stripTrailing((found?.parts ?? []).join("")) };
    });
    const number = String(draft.number).padStart(2, "0");
    return {
      id: `${ctx.subjectId}-${ctx.examCode}-q${number}`,
      subjectId: ctx.subjectId,
      prompt: draft.promptParts.join(""),
      choices,
      answer: draft.answer,
      explanation: "",
      topic: "未分類",
      difficulty: "中",
      source: "past-exam",
      sourceRef: `${ctx.examLabel} 第${draft.number}題`,
    } satisfies Question;
  });
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/parse-core.test.ts`
Expected: PASS。

注意：`prompt` 合併時測試以「主要」+「目的？」相接成「主要目的？」，因 fixture 行尾無標點，`join("")` 直接相接；選項以 `；` 結尾者由 `stripTrailing` 去除。若實際資料有半形空白殘留，於下一 Task 的驗證階段檢視。

- [ ] **Step 5: Commit**

```bash
git add scripts/parse-core.ts tests/parse-core.test.ts
git commit -m "feat: add past-paper parser core with tests"
```

---

## Task 7: 解析腳本 I/O 包裝 + 產生真題 JSON

**Files:**
- Create: `scripts/parse-past-papers.ts`
- Create（由腳本產出）: `src/data/past-exams/*.json`

- [ ] **Step 1: 實作 I/O 腳本**

```ts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { papers } from "./paper-manifest";
import { parsePaper } from "./parse-core";
import type { Question } from "../src/data/types";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const mdDir = join(root, "docs", "markdown");
const outDir = join(root, "src", "data", "past-exams");

mkdirSync(outDir, { recursive: true });

const bySubject = new Map<string, Question[]>();

for (const paper of papers) {
  const md = readFileSync(join(mdDir, paper.file), "utf8");
  const questions = parsePaper(md, paper);
  if (questions.length !== 50) {
    console.warn(`⚠ ${paper.file} 解析出 ${questions.length} 題（預期 50）`);
  }
  for (const q of questions) {
    if (!["A", "B", "C", "D"].includes(q.answer)) {
      console.warn(`⚠ ${q.id} 答案異常：${q.answer}`);
    }
    if (q.choices.some((c) => c.text === "")) {
      console.warn(`⚠ ${q.id} 有空白選項`);
    }
  }
  const list = bySubject.get(paper.subjectId) ?? [];
  list.push(...questions);
  bySubject.set(paper.subjectId, list);
}

for (const [subjectId, questions] of bySubject) {
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) console.warn(`⚠ 重複 id：${q.id}`);
    ids.add(q.id);
  }
  const file = join(outDir, `${subjectId}.json`);
  writeFileSync(file, JSON.stringify(questions, null, 2) + "\n", "utf8");
  console.log(`✓ ${subjectId}：${questions.length} 題 → ${file}`);
}
```

- [ ] **Step 2: 執行腳本**

Run: `npm run parse:papers`
Expected: 印出 5 個科目的題數（junior-ai-basics 與 junior-genai 約 100；三個 senior 各約 50），無 ⚠ 警告。若有警告，檢視對應 md 行並調整 `isNoise`／regex 後重跑。

- [ ] **Step 3: 人工抽查**

Run: `head -40 src/data/past-exams/junior-ai-basics.json`
Expected: 第一題 `prompt`、四個 `choices.text`、`answer` 與 `docs/markdown` 原文一致；無殘留頁首文字（如「第 N 頁」）。

- [ ] **Step 4: Commit**

```bash
git add scripts/parse-past-papers.ts src/data/past-exams
git commit -m "feat: generate past-exam question json from markdown"
```

---

## Task 8: data 模組合併（真題 + 詳解 + 新題）

**Files:**
- Create: `src/data/explanations/junior-ai-basics.ts`（其餘四科同結構，內容先空）
- Create: `src/data/generated/junior-ai-basics.ts`（其餘四科同結構，內容先空陣列）
- Create: `src/data/<subjectId>.ts` ×5
- Create: `src/data/index.ts`
- Test: `tests/data.test.ts`

- [ ] **Step 1: 建立詳解 map 範本**（五科各一檔，先空物件）

`src/data/explanations/junior-ai-basics.ts`：

```ts
// questionId -> 中文詳解。Task 11 起逐題填入。
export const explanations: Record<string, string> = {};
```

其餘四檔內容相同，僅檔名不同：`junior-genai.ts`、`senior-ai-tech.ts`、`senior-bigdata.ts`、`senior-ml.ts`。

- [ ] **Step 2: 建立新題範本**（五科各一檔，先空陣列）

`src/data/generated/junior-ai-basics.ts`：

```ts
import type { Question } from "../types";

export const generated: Question[] = [];
```

其餘四檔內容相同，僅檔名不同。

- [ ] **Step 3: 建立各科合併模組**

`src/data/junior-ai-basics.ts`：

```ts
import type { Question } from "./types";
import past from "./past-exams/junior-ai-basics.json";
import { explanations } from "./explanations/junior-ai-basics";
import { generated } from "./generated/junior-ai-basics";

const pastWithExplanations: Question[] = (past as Question[]).map((q) => ({
  ...q,
  explanation: explanations[q.id] ?? q.explanation,
}));

export const questions: Question[] = [...pastWithExplanations, ...generated];
```

其餘四科 `junior-genai.ts`、`senior-ai-tech.ts`、`senior-bigdata.ts`、`senior-ml.ts` 同結構，將三處 `junior-ai-basics` 換成對應 subjectId。

- [ ] **Step 4: 建立 index.ts**

```ts
import type { Question } from "./types";
import { questions as juniorAiBasics } from "./junior-ai-basics";
import { questions as juniorGenai } from "./junior-genai";
import { questions as seniorAiTech } from "./senior-ai-tech";
import { questions as seniorBigdata } from "./senior-bigdata";
import { questions as seniorMl } from "./senior-ml";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
  "senior-ai-tech": seniorAiTech,
  "senior-bigdata": seniorBigdata,
  "senior-ml": seniorMl,
};

export const getQuestions = (subjectId: string): Question[] => banks[subjectId] ?? [];

export const getBankStats = (subjectId: string) => {
  const list = getQuestions(subjectId);
  return {
    total: list.length,
    pastExam: list.filter((q) => q.source === "past-exam").length,
    generated: list.filter((q) => q.source === "generated").length,
  };
};
```

- [ ] **Step 5: 撰寫題庫驗證測試**

```ts
import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";

describe("題庫完整性", () => {
  for (const subject of subjects) {
    describe(subject.id, () => {
      const questions = getQuestions(subject.id);
      it("題庫非空", () => {
        expect(questions.length).toBeGreaterThan(0);
      });
      it("每題四選項、答案為A-D、id唯一、subjectId相符", () => {
        const ids = new Set<string>();
        for (const q of questions) {
          expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
          expect(["A", "B", "C", "D"]).toContain(q.answer);
          expect(q.subjectId).toBe(subject.id);
          expect(ids.has(q.id)).toBe(false);
          ids.add(q.id);
        }
      });
    });
  }
});
```

- [ ] **Step 6: 跑測試與 build**

Run: `npx vitest run tests/data.test.ts && npm run build`
Expected: 測試全綠、build 成功。

- [ ] **Step 7: Commit**

```bash
git add src/data
git commit -m "feat: merge past-exam, explanations, generated into subject banks"
```

---

## Task 9: state/storage.ts（localStorage）

**Files:**
- Create: `src/state/storage.ts`
- Test: `tests/storage.test.ts`

- [ ] **Step 1: 撰寫失敗測試**（用 vitest 的 jsdom 環境取得 localStorage）

於檔案最上方加入環境註解：

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { loadMisses, addMiss, removeMiss, isMissed } from "../src/state/storage";

beforeEach(() => localStorage.clear());

describe("錯題本", () => {
  it("新增與查詢", () => {
    addMiss("junior-ai-basics-115-1-q01");
    expect(isMissed("junior-ai-basics-115-1-q01")).toBe(true);
    expect(loadMisses()).toContain("junior-ai-basics-115-1-q01");
  });
  it("不重複加入", () => {
    addMiss("q1");
    addMiss("q1");
    expect(loadMisses().filter((id) => id === "q1")).toHaveLength(1);
  });
  it("移除", () => {
    addMiss("q1");
    removeMiss("q1");
    expect(isMissed("q1")).toBe(false);
  });
  it("壞資料回傳空陣列", () => {
    localStorage.setItem("ipas-aiap-misses", "{not json");
    expect(loadMisses()).toEqual([]);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/storage.test.ts`
Expected: FAIL，找不到模組。

- [ ] **Step 3: 安裝 jsdom 並設定**

Run: `npm install -D jsdom`
Expected: 安裝成功；vitest 可用 `// @vitest-environment jsdom` 註解切換。

- [ ] **Step 4: 實作 storage.ts**

```ts
const MISS_KEY = "ipas-aiap-misses";

const readArray = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
};

export const loadMisses = (): string[] => readArray(MISS_KEY);

export const isMissed = (id: string): boolean => loadMisses().includes(id);

export const addMiss = (id: string): void => {
  const set = new Set(loadMisses());
  set.add(id);
  localStorage.setItem(MISS_KEY, JSON.stringify([...set]));
};

export const removeMiss = (id: string): void => {
  const next = loadMisses().filter((x) => x !== id);
  localStorage.setItem(MISS_KEY, JSON.stringify(next));
};
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npx vitest run tests/storage.test.ts`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add src/state/storage.ts tests/storage.test.ts package.json
git commit -m "feat: add localStorage miss-book with validation"
```

---

## Task 10: state/attempt.ts（作答狀態與抽題）

**Files:**
- Create: `src/state/attempt.ts`
- Test: `tests/attempt.test.ts`

- [ ] **Step 1: 撰寫失敗測試**（注入可預測的洗牌函式）

```ts
import { describe, it, expect } from "vitest";
import { buildAttempt, shuffleWith } from "../src/state/attempt";
import type { Question } from "../src/data/types";

const makeBank = (n: number): Question[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `q${i + 1}`, subjectId: "s", prompt: `p${i + 1}`,
    choices: [
      { id: "A", text: "a" }, { id: "B", text: "b" },
      { id: "C", text: "c" }, { id: "D", text: "d" },
    ],
    answer: "A", explanation: "", topic: "T", difficulty: "中", source: "past-exam",
  }) as Question);

const identityShuffle = <T>(arr: T[]): T[] => [...arr];

describe("buildAttempt", () => {
  it("抽指定題數（不足則全取）", () => {
    const attempt = buildAttempt(makeBank(100), { count: 50, shuffle: identityShuffle });
    expect(attempt.questions).toHaveLength(50);
  });
  it("題數超過題庫時取全部", () => {
    const attempt = buildAttempt(makeBank(30), { count: 50, shuffle: identityShuffle });
    expect(attempt.questions).toHaveLength(30);
  });
  it("用注入的洗牌函式決定順序", () => {
    const reverse = <T>(arr: T[]): T[] => [...arr].reverse();
    const attempt = buildAttempt(makeBank(3), { count: 3, shuffle: reverse });
    expect(attempt.questions.map((q) => q.id)).toEqual(["q3", "q2", "q1"]);
  });
});

describe("shuffleWith", () => {
  it("以注入的 rng 產生決定性順序", () => {
    const seq = [0.9, 0.1, 0.5];
    let i = 0;
    const rng = () => seq[i++ % seq.length];
    const out = shuffleWith([1, 2, 3, 4], rng);
    expect(out).toHaveLength(4);
    expect([...out].sort()).toEqual([1, 2, 3, 4]);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/attempt.test.ts`
Expected: FAIL，找不到模組。

- [ ] **Step 3: 實作 attempt.ts**

```ts
import type { Question } from "../data/types";

export type ShuffleFn = <T>(arr: T[]) => T[];

export const shuffleWith = <T>(arr: T[], rng: () => number): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const defaultShuffle: ShuffleFn = (arr) => shuffleWith(arr, Math.random);

export type Attempt = {
  questions: Question[];
};

export type BuildOptions = {
  count: number;
  shuffle?: ShuffleFn;
};

export const buildAttempt = (bank: Question[], options: BuildOptions): Attempt => {
  const shuffle = options.shuffle ?? defaultShuffle;
  const picked = shuffle(bank).slice(0, Math.min(options.count, bank.length));
  return { questions: picked };
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/attempt.test.ts`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/state/attempt.ts tests/attempt.test.ts
git commit -m "feat: add attempt builder with injectable shuffle"
```

---

## Task 11: ui/escape.ts + 渲染純函式

**Files:**
- Create: `src/ui/escape.ts`
- Create: `src/ui/render.ts`
- Test: `tests/render.test.ts`

- [ ] **Step 1: 撰寫失敗測試**

```ts
import { describe, it, expect } from "vitest";
import { escapeHtml } from "../src/ui/escape";
import { renderSubjectCard, renderChoice } from "../src/ui/render";

describe("escapeHtml", () => {
  it("跳脫角括號與引號", () => {
    expect(escapeHtml(`<b>"&'`)).toBe("&lt;b&gt;&quot;&amp;&#39;");
  });
});

describe("renderSubjectCard", () => {
  it("含科目名稱與題數、跳脫內容", () => {
    const html = renderSubjectCard(
      { id: "s", level: "junior", code: "科目1", name: "人工智慧基礎概論", durationMinutes: 75 },
      { total: 100, pastExam: 100, generated: 0 },
    );
    expect(html).toContain("人工智慧基礎概論");
    expect(html).toContain("100");
    expect(html).toContain('data-subject="s"');
  });
});

describe("renderChoice", () => {
  it("作答中：未標示對錯", () => {
    const html = renderChoice({ id: "A", text: "<x>" }, { selected: false, reveal: false, correct: false });
    expect(html).toContain("&lt;x&gt;");
    expect(html).not.toContain("correct");
  });
  it("檢討中：正解標 correct、誤選標 wrong", () => {
    const right = renderChoice({ id: "A", text: "a" }, { selected: false, reveal: true, correct: true });
    expect(right).toContain("correct");
    const wrong = renderChoice({ id: "B", text: "b" }, { selected: true, reveal: true, correct: false });
    expect(wrong).toContain("wrong");
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/render.test.ts`
Expected: FAIL，找不到模組。

- [ ] **Step 3: 實作 escape.ts**

```ts
export const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
```

- [ ] **Step 4: 實作 render.ts**（本 Task 僅需 `renderSubjectCard` 與 `renderChoice`；其餘畫面於 Task 12 在 main.ts 組裝時補足）

```ts
import { escapeHtml } from "./escape";
import type { Choice } from "../data/types";
import type { Subject } from "../domain/catalog";

export type BankStats = { total: number; pastExam: number; generated: number };

export const renderSubjectCard = (subject: Subject, stats: BankStats): string => `
  <button class="subject-card" data-subject="${escapeHtml(subject.id)}">
    <span class="subject-code">${escapeHtml(subject.code)}</span>
    <span class="subject-name">${escapeHtml(subject.name)}</span>
    <span class="subject-stats">真題 ${stats.pastExam}　新題 ${stats.generated}　共 ${stats.total} 題</span>
    <span class="subject-time">作答時間 ${subject.durationMinutes} 分鐘</span>
  </button>
`;

export type ChoiceView = { selected: boolean; reveal: boolean; correct: boolean };

export const renderChoice = (choice: Choice, view: ChoiceView): string => {
  const classes = ["choice"];
  if (view.selected) classes.push("selected");
  if (view.reveal && view.correct) classes.push("correct");
  if (view.reveal && view.selected && !view.correct) classes.push("wrong");
  return `
    <button class="${classes.join(" ")}" data-choice="${choice.id}">
      <span class="choice-id">${choice.id}</span>
      <span class="choice-text">${escapeHtml(choice.text)}</span>
    </button>
  `;
};
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npx vitest run tests/render.test.ts`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add src/ui/escape.ts src/ui/render.ts tests/render.test.ts
git commit -m "feat: add html escape and core render functions"
```

---

## Task 12: main.ts 視圖狀態機（手動驗證）

此 Task 組裝畫面與互動，邏輯多為 DOM 操作，以瀏覽器手動驗證為主（無單元測試）。

**Files:**
- Modify: `src/main.ts`（整檔改寫）
- Modify: `src/ui/render.ts`（新增頁面層級渲染）

- [ ] **Step 1: 在 render.ts 新增頁面渲染函式**

加到 `src/ui/render.ts` 末端：

```ts
import { getSubjectsByLevel } from "../domain/catalog";
import { getBankStats } from "../data/index";
import type { Level } from "../data/types";
import type { Question } from "../data/types";

export const renderHome = (): string => `
  <header class="topbar"><h1>iPAS AI 應用規劃師 練習</h1></header>
  <main class="home">
    <p class="lead">選擇級別開始練習</p>
    <div class="level-grid">
      <button class="level-card" data-level="junior"><h2>初級</h2><p>人工智慧基礎概論 ・ 生成式 AI 應用與規劃</p></button>
      <button class="level-card" data-level="senior"><h2>中級</h2><p>技術應用規劃 ・ 大數據 ・ 機器學習</p></button>
    </div>
  </main>
`;

export const renderLevel = (level: Level): string => {
  const cards = getSubjectsByLevel(level)
    .map((s) => renderSubjectCard(s, getBankStats(s.id)))
    .join("");
  return `
    <header class="topbar">
      <button class="back" data-nav="home">← 返回</button>
      <h1>${level === "junior" ? "初級" : "中級"}</h1>
    </header>
    <main class="subject-list">${cards}</main>
  `;
};

export const renderModePicker = (subjectName: string): string => `
  <header class="topbar"><button class="back" data-nav="back">← 返回</button><h1>${escapeHtml(subjectName)}</h1></header>
  <main class="mode-picker">
    <button class="mode-card" data-mode="exam"><h2>模擬考試</h2><p>50 題・計時・100 分制・70 分及格</p></button>
    <button class="mode-card" data-mode="drill"><h2>刷題練習</h2><p>自選題數・即時對錯與詳解・不計時</p></button>
  </main>
`;

export const renderQuestion = (
  q: Question, index: number, total: number,
  selected: string | undefined, reveal: boolean, timeText: string,
): string => {
  const choices = q.choices
    .map((c) => renderChoice(c, { selected: selected === c.id, reveal, correct: c.id === q.answer }))
    .join("");
  const explanation = reveal
    ? `<div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>`
    : "";
  return `
    <header class="topbar">
      <button class="back" data-nav="quit">結束</button>
      <span class="progress">第 ${index + 1} / ${total} 題</span>
      <span class="timer">${timeText}</span>
    </header>
    <main class="question">
      <p class="prompt">${escapeHtml(q.prompt)}</p>
      <div class="choices">${choices}</div>
      ${explanation}
      <div class="qnav">
        <button class="prev" data-nav="prev">上一題</button>
        <button class="next" data-nav="next">下一題</button>
        <button class="submit" data-nav="submit">交卷</button>
      </div>
    </main>
  `;
};

export const renderResult = (
  score: number, correct: number, wrong: number, passed: boolean,
  topics: { topic: string; total: number; correct: number }[],
): string => {
  const rows = topics
    .map((t) => `<tr><td>${escapeHtml(t.topic)}</td><td>${t.correct}/${t.total}</td></tr>`)
    .join("");
  return `
    <header class="topbar"><button class="back" data-nav="home">回首頁</button><h1>成績</h1></header>
    <main class="result">
      <p class="score ${passed ? "pass" : "fail"}">${score} 分　${passed ? "及格" : "不及格"}</p>
      <p>答對 ${correct} 題、答錯 ${wrong} 題（及格 70 分）</p>
      <table class="topic-table"><thead><tr><th>主題</th><th>答對/總數</th></tr></thead><tbody>${rows}</tbody></table>
      <button class="review-btn" data-nav="review">逐題檢討</button>
    </main>
  `;
};
```

- [ ] **Step 2: 改寫 main.ts 視圖狀態機**

```ts
import "./styles.css";
import {
  renderHome, renderLevel, renderModePicker, renderQuestion, renderResult,
} from "./ui/render";
import { getSubject } from "./domain/catalog";
import { getQuestions } from "./data/index";
import { examRules, scoreExam, topicSummary, type AnswerState } from "./domain/exam";
import { buildAttempt } from "./state/attempt";
import { addMiss } from "./state/storage";
import type { ChoiceId, Question } from "./data/types";
import type { Level } from "./data/types";

type View = "home" | "level" | "mode" | "play" | "result" | "review";
type Mode = "exam" | "drill";

type Session = {
  view: View;
  level: Level;
  subjectId: string;
  mode: Mode;
  questions: Question[];
  answers: AnswerState;
  index: number;
  reveal: boolean;          // drill：作答即揭曉；exam：交卷後 review 才揭曉
  deadline: number | null;  // exam 計時用 timestamp（ms）
};

const app = document.querySelector<HTMLDivElement>("#app")!;
let session: Session = blankSession();
let timerId: number | null = null;

function blankSession(): Session {
  return {
    view: "home", level: "junior", subjectId: "", mode: "exam",
    questions: [], answers: {}, index: 0, reveal: false, deadline: null,
  };
}

function timeText(): string {
  if (session.deadline === null) return "";
  const remain = Math.max(0, Math.floor((session.deadline - Date.now()) / 1000));
  const m = String(Math.floor(remain / 60)).padStart(2, "0");
  const s = String(remain % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(() => {
    if (session.deadline !== null && Date.now() >= session.deadline) {
      finishExam();
      return;
    }
    const el = app.querySelector(".timer");
    if (el) el.textContent = timeText();
  }, 1000);
}

function render() {
  if (session.view === "home") { stopTimer(); app.innerHTML = renderHome(); return; }
  if (session.view === "level") { stopTimer(); app.innerHTML = renderLevel(session.level); return; }
  if (session.view === "mode") {
    stopTimer();
    app.innerHTML = renderModePicker(getSubject(session.subjectId)?.name ?? "");
    return;
  }
  if (session.view === "play" || session.view === "review") {
    const q = session.questions[session.index];
    app.innerHTML = renderQuestion(
      q, session.index, session.questions.length,
      session.answers[q.id], session.reveal, timeText(),
    );
    return;
  }
  if (session.view === "result") {
    stopTimer();
    const report = scoreExam(session.questions, session.answers);
    app.innerHTML = renderResult(
      report.score, report.correct, report.wrong, report.passed,
      topicSummary(session.questions, session.answers),
    );
  }
}

function startMode(mode: Mode) {
  const subject = getSubject(session.subjectId)!;
  const bank = getQuestions(session.subjectId);
  const count = mode === "exam" ? examRules.totalQuestions : Math.min(20, bank.length);
  session.mode = mode;
  session.questions = buildAttempt(bank, { count }).questions;
  session.answers = {};
  session.index = 0;
  session.reveal = mode === "drill";
  session.view = "play";
  session.deadline = mode === "exam" ? Date.now() + subject.durationMinutes * 60_000 : null;
  if (mode === "exam") startTimer();
  render();
}

function finishExam() {
  stopTimer();
  for (const id of scoreExam(session.questions, session.answers).missedQuestionIds) {
    addMiss(id);
  }
  session.view = "result";
  render();
}

function selectChoice(choiceId: ChoiceId) {
  const q = session.questions[session.index];
  session.answers[q.id] = choiceId;
  if (session.mode === "drill") session.reveal = true;
  render();
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest("[data-level],[data-subject],[data-mode],[data-choice],[data-nav]");
  if (!(target instanceof HTMLElement)) return;

  const level = target.getAttribute("data-level");
  if (level) { session.level = level as Level; session.view = "level"; render(); return; }

  const subjectId = target.getAttribute("data-subject");
  if (subjectId) { session.subjectId = subjectId; session.view = "mode"; render(); return; }

  const mode = target.getAttribute("data-mode");
  if (mode) { startMode(mode as Mode); return; }

  const choice = target.getAttribute("data-choice");
  if (choice && (session.view === "play")) {
    if (session.mode === "drill" && session.reveal) return; // 已揭曉不可改
    selectChoice(choice as ChoiceId);
    return;
  }

  const nav = target.getAttribute("data-nav");
  if (!nav) return;
  if (nav === "home") { session = blankSession(); render(); return; }
  if (nav === "back") { session.view = "level"; render(); return; }
  if (nav === "quit") { stopTimer(); session.view = "level"; render(); return; }
  if (nav === "prev") { if (session.index > 0) session.index--; session.reveal = session.mode === "drill" && session.answers[session.questions[session.index].id] !== undefined; render(); return; }
  if (nav === "next") {
    if (session.index < session.questions.length - 1) session.index++;
    session.reveal = session.mode === "drill" && session.answers[session.questions[session.index].id] !== undefined;
    render();
    return;
  }
  if (nav === "submit") { finishExam(); return; }
  if (nav === "review") { session.view = "review"; session.reveal = true; session.index = 0; render(); return; }
});

render();
```

- [ ] **Step 3: build 驗證型別**

Run: `npm run build`
Expected: tsc 無錯、vite build 成功。

- [ ] **Step 4: 瀏覽器手動驗證**

Run: `npm run dev`，開啟印出的網址，逐項確認：
- 首頁可選 初級/中級；各顯示對應科目卡片與題數。
- 進入某科目可見「模擬考試 / 刷題練習」。
- 刷題：點選項即顯示對錯與詳解（或「（尚無詳解）」）。
- 模擬考試：右上有倒數計時；可上下題切換；交卷後顯示分數、及格與否、主題統計；可逐題檢討。
- 「結束/返回/回首頁」導覽正常。

- [ ] **Step 5: Commit**

```bash
git add src/main.ts src/ui/render.ts
git commit -m "feat: wire view state machine, timer, two practice modes"
```

---

## Task 13: 樣式

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: 撰寫樣式**（清爽、行動裝置可用；類別需對應 render.ts 產出的 class）

```css
:root {
  --bg: #0f1729;
  --panel: #1b2540;
  --accent: #4f8cff;
  --correct: #2fa66b;
  --wrong: #d6455b;
  --text: #e7ecf5;
  font-family: system-ui, "Noto Sans TC", "PingFang TC", sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); }
#app { max-width: 760px; margin: 0 auto; padding: 16px; }
.topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.topbar h1 { font-size: 1.2rem; margin: 0; }
button { font: inherit; color: inherit; cursor: pointer; border: none; border-radius: 10px; }
.back, .review-btn { background: var(--panel); padding: 8px 12px; }
.level-grid, .mode-picker { display: grid; gap: 12px; grid-template-columns: 1fr; }
.level-card, .mode-card, .subject-card {
  display: flex; flex-direction: column; gap: 6px;
  background: var(--panel); padding: 16px; text-align: left;
}
.subject-card { width: 100%; }
.subject-code { color: var(--accent); font-weight: 700; }
.subject-name { font-size: 1.1rem; }
.subject-stats, .subject-time { font-size: 0.85rem; opacity: 0.8; }
.question .prompt { font-size: 1.05rem; line-height: 1.6; }
.choices { display: grid; gap: 10px; margin: 16px 0; }
.choice { display: flex; gap: 10px; background: var(--panel); padding: 12px; text-align: left; }
.choice.selected { outline: 2px solid var(--accent); }
.choice.correct { outline: 2px solid var(--correct); }
.choice.wrong { outline: 2px solid var(--wrong); }
.choice-id { font-weight: 700; }
.explanation { background: var(--panel); padding: 12px; border-radius: 10px; line-height: 1.6; }
.qnav { display: flex; gap: 8px; margin-top: 16px; }
.qnav button { background: var(--panel); padding: 10px 14px; flex: 1; }
.qnav .submit { background: var(--accent); }
.progress, .timer { font-variant-numeric: tabular-nums; }
.timer { margin-left: auto; }
.score { font-size: 1.6rem; font-weight: 700; }
.score.pass { color: var(--correct); }
.score.fail { color: var(--wrong); }
.topic-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
.topic-table th, .topic-table td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #2c3858; }
```

- [ ] **Step 2: 瀏覽器確認版面**

Run: `npm run dev`
Expected: 桌機與手機寬度下版面正常、可點擊、對錯色彩清楚。

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: add app styling"
```

---

## Task 14: 內容階段 1 — 初級科目1 詳解與新題

依「學習指引-科目1_人工智慧基礎概論」與「評鑑內容範圍參考」撰寫。此為內容工作，逐題人工確認正確性。

**Files:**
- Modify: `src/data/explanations/junior-ai-basics.ts`
- Modify: `src/data/generated/junior-ai-basics.ts`

- [ ] **Step 1: 為初級科目1 全部真題撰寫中文詳解**

讀 `src/data/past-exams/junior-ai-basics.json` 取得每題 id 與正解，於 `explanations` 物件逐題填入。範例：

```ts
export const explanations: Record<string, string> = {
  "junior-ai-basics-115-1-q01":
    "資料整合的目的在於統一格式、去除重複、整併多來源以提升完整性；延長原始資料留存期限屬資料保存政策，與整合目的無直接關係，故為非。",
  // ...其餘每題
};
```

- [ ] **Step 2: 為初級科目1 撰寫至少 10 題新題**

依學習指引主題撰寫，每題含完整四選項、正解、詳解、`topic` 用評鑑主題、`difficulty`。範例：

```ts
import type { Question } from "../types";

export const generated: Question[] = [
  {
    id: "junior-ai-basics-gen-q001",
    subjectId: "junior-ai-basics",
    prompt: "下列何者最能描述監督式學習與非監督式學習的主要差異？",
    choices: [
      { id: "A", text: "監督式學習使用帶標籤資料，非監督式學習不需標籤" },
      { id: "B", text: "監督式學習一定使用神經網路" },
      { id: "C", text: "非監督式學習只能用於影像資料" },
      { id: "D", text: "兩者皆需事先定義目標變數" },
    ],
    answer: "A",
    explanation: "監督式學習以帶標籤資料學習輸入到輸出的對應；非監督式學習在無標籤下探索資料結構（如分群）。",
    topic: "機器學習基礎",
    difficulty: "易",
    source: "generated",
  },
  // ...再補足至少 10 題
];
```

- [ ] **Step 3: 跑題庫測試與 build**

Run: `npx vitest run tests/data.test.ts && npm run build`
Expected: PASS、build 成功。

- [ ] **Step 4: 瀏覽器抽查詳解顯示**

Run: `npm run dev`，進入「初級 → 科目1 → 刷題」，確認多題顯示詳解且文字正確。

- [ ] **Step 5: Commit**

```bash
git add src/data/explanations/junior-ai-basics.ts src/data/generated/junior-ai-basics.ts
git commit -m "content: add explanations and new questions for junior subject 1"
```

---

## Task 15: 部署與文件

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`, `AGENTS.md`, `docs/architecture.md`

- [ ] **Step 1: GitHub Pages workflow**

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 撰寫 README.md**

說明：用途、初級/中級各科、雙模式、`npm install` / `npm run dev` / `npm run build` / `npm run test` / `npm run parse:papers`、`docs/raw` 為私有來源不公開。

- [ ] **Step 3: 撰寫 docs/architecture.md 與 AGENTS.md**

architecture.md：記錄模組職責（domain/state/ui/data/scripts）與資料管線（md → past-exams JSON → data 合併）。
AGENTS.md：記錄不變量（每科 50 題單選、每題 2 分、70 及格、選項固定 A–D、答案單值；錯題本 key `ipas-aiap-misses`；`docs/raw` 私有；改動前先跑 `npm run build` 與 `npm run test`）。

- [ ] **Step 4: 最終驗證**

Run: `npm run test && npm run build`
Expected: 全部測試通過、build 成功。

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml README.md AGENTS.md docs/architecture.md
git commit -m "chore: add deployment workflow and docs"
```

---

## 後續階段（不在本計畫的逐步任務內，列為待辦）

- 內容階段 2+：依本計畫 Task 14 的相同模式，為 `junior-genai`、`senior-ai-tech`、`senior-bigdata`、`senior-ml` 補齊詳解與新題。
- 錯題本專屬頁面（檢視/清除）與「以錯題本出題」的刷題範圍選項 UI。
- 主題標註：將真題 `topic` 從「未分類」對應到評鑑範圍主題（可於 explanations 階段一併處理，或新增 `topics` map）。
- Playwright 端對端測試（開始作答、選答、交卷、檢討、錯題本）。

---

## Self-Review 紀錄

- **Spec 覆蓋**：技術棧(Task 1)、資料模型(Task 2)、計分規則(Task 3)、科目分離與目錄(Task 4)、解析管線(Task 5–7)、題庫合併與真題詳解結構(Task 8、14)、儲存(Task 9)、抽題/打散(Task 10)、雙模式 UI 與安全渲染(Task 11–12)、樣式(Task 13)、測試(Task 3/4/6/8/9/10/11)、部署與文件(Task 15)、分階段內容(Task 14＋後續待辦)。皆有對應。
- **Placeholder 掃描**：各程式步驟均附完整程式碼；Task 14 內容為人工撰寫，已給結構與範例與驗證方式。
- **型別一致**：`Question`/`ChoiceId`/`Choice`(types.ts) 跨 domain/state/ui/scripts 一致；`AnswerState` 為 `Record<string, ChoiceId|undefined>`，`isCorrect`/`scoreExam`/`topicSummary` 簽名一致；`buildAttempt`/`shuffleWith` 與測試一致；render 函式參數與 main.ts 呼叫一致。
