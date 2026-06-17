# 學習筆記排版重構 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把五科「學習指引整理」從機械平鋪的髒文字，重構為乾淨、有層次的巢狀筆記。

**Architecture:** 先把資料模型從平面 `details: string[]` 換成層次樹 `StudyNoteItem`，渲染器改為遞迴巢狀清單、TTS 改讀各節點自有文字 span；再把舊產生器改造為「原始切片擷取器」；最後逐科由 LLM 依切片忠實重構為乾淨樹狀內容，寫入 `studyNotes.ts`。

**Tech Stack:** TypeScript、Vite、Vitest、tsx（腳本）。

## Global Constraints

- 渲染動態文字一律先經 `src/ui/escape.ts` 的 `escapeHtml`；本案每個 `text` 節點都要轉義。
- 不新增任何 npm 依賴（不引入 markdown 解析器或數學引擎）。
- 不修改 `src/data/past-exams/*.json`。
- 內容忠實重構：保留原文所有知識點，不摘要、不刪減、不新增原文沒有的內容。數學正規化為可讀 Unicode 純文字（例 `E(X) = Σ xᵢ·P(xᵢ)`）。
- 「N 則重點」計數 = 葉節點（無 `children` 或為空）總數。
- 內容正確性靠人工複審，僅格式自動測試。
- 交付前必跑 `npm run build` 與 `npm run test`。

---

### Task 1: 切換到層次資料模型（平面橋接）

把型別、渲染器、TTS 切到新模型，並用既有產生器一次性把現有內容轉成「新形狀但仍平面」的資料，保持全綠、網站可用。

**Files:**
- Modify: `src/data/types.ts`（`StudyNoteSection` 定義）
- Modify: `src/ui/render.ts`（`renderStudyNotes`，約 253-276 行）
- Modify: `src/main.ts`（`sectionSpeechText`，173-179 行）
- Modify: `scripts/generate-study-notes.ts`（`NoteSection` 型別與 `collectSection` 輸出、count）
- Modify: `src/data/studyNotes.ts`（由產生器重新產生）
- Test: `tests/render.test.ts`、`tests/studyGuide.test.ts`

**Interfaces:**
- Produces:
  - `StudyNoteItem = { text: string; children?: StudyNoteItem[] }`
  - `StudyNoteSection = { heading: string; items: StudyNoteItem[] }`
  - 渲染：每個項目輸出 `<li><span class="note-text">…</span>[<ul>…children…</ul>]</li>`

- [ ] **Step 1: 更新型別 `src/data/types.ts`**

把現有：

```ts
export type StudyNoteSection = {
  heading: string;
  details: string[];
};
```

改為：

```ts
export type StudyNoteItem = {
  text: string;
  children?: StudyNoteItem[];
};

export type StudyNoteSection = {
  heading: string;
  items: StudyNoteItem[];
};
```

（`StudyNotesBySubject`、`StudyTopic.notes` 不變。）

- [ ] **Step 2: 更新 `tests/studyGuide.test.ts` 的斷言（先讓它反映新模型）**

把這一行：

```ts
          expect(topic.notes?.some((section) => section.details.length > 0)).toBe(true);
```

改為：

```ts
          expect(topic.notes?.some((section) => section.items.length > 0)).toBe(true);
```

- [ ] **Step 3: 改寫渲染器 `src/ui/render.ts` 的 `renderStudyNotes`**

替換整個 `renderStudyNotes`（253-276 行）為：

```ts
const renderNoteItems = (items: StudyNoteItem[]): string => `
  <ul>
    ${items.map((item) => `
      <li>
        <span class="note-text">${escapeHtml(item.text)}</span>
        ${item.children?.length ? renderNoteItems(item.children) : ""}
      </li>
    `).join("")}
  </ul>
`;

const countNoteLeaves = (items: StudyNoteItem[]): number =>
  items.reduce(
    (sum, item) => sum + (item.children?.length ? countNoteLeaves(item.children) : 1),
    0,
  );

const renderStudyNotes = (notes: StudyNoteSection[] | undefined): string => {
  if (!notes?.length) return "";
  const count = notes.reduce((sum, section) => sum + countNoteLeaves(section.items), 0);
  return `
    <details class="study-notes">
      <summary>學習指引整理 <span>${count} 則重點</span></summary>
      <div class="study-note-sections">
        ${notes.map((section) => `
          <section class="study-note-section">
            <div class="study-note-heading">
              <h5>${escapeHtml(section.heading)}</h5>
              <button class="tts-button" data-tts-section aria-label="朗讀 ${escapeHtml(section.heading)}" title="朗讀" aria-pressed="false">
                ${speakerIcon}
              </button>
            </div>
            ${renderNoteItems(section.items)}
          </section>
        `).join("")}
      </div>
    </details>
  `;
};
```

在 `src/ui/render.ts` 既有的 `import type { StudyNoteSection, StudyNotesBySubject } from "../data/types";` 加入 `StudyNoteItem`：

```ts
import type { StudyNoteItem, StudyNoteSection, StudyNotesBySubject } from "../data/types";
```

- [ ] **Step 4: 更新 TTS `src/main.ts` 的 `sectionSpeechText`（173-179 行）**

把 `querySelectorAll("li")`（巢狀時父項會包含子項文字而重複）改為讀各節點自有文字 span：

```ts
function sectionSpeechText(section: HTMLElement): string {
  const heading = section.querySelector("h5")?.textContent?.trim() ?? "";
  const details = [...section.querySelectorAll(".note-text")]
    .map((item) => item.textContent?.trim() ?? "")
    .filter(Boolean);
  return [heading, ...details].join("。");
}
```

- [ ] **Step 5: 讓產生器輸出新形狀（仍平面），並重新產生資料**

在 `scripts/generate-study-notes.ts`：

把 `NoteSection` 型別（約 20-23 行）改為：

```ts
type NoteItem = {
  text: string;
  children?: NoteItem[];
};

type NoteSection = {
  heading: string;
  items: NoteItem[];
};
```

把 `collectSection` 的回傳（兩處 `return { heading: ..., details }`）改為把 details 包成平面 items：

```ts
  // 找不到段落時
  return { heading: `${section.number} ${section.heading}`, items: [] };
```

```ts
  // 正常結尾
  return { heading: `${section.number} ${section.heading}`, items: details.map((text) => ({ text })) };
```

把底部 count 計算（約 280 行）由 `section.details.length` 改為 `section.items.length`：

```ts
  const count = Object.values(topics).flat().reduce((sum, section) => sum + section.items.length, 0);
```

`data` 的型別宣告 `Record<string, Record<string, NoteSection[]>>` 不變（NoteSection 內部已改）。

- [ ] **Step 6: 重新產生 `studyNotes.ts` 並跑型別＋測試**

Run:
```bash
npm run generate:study-notes
npm run build
npm run test
```
Expected: 產生器印出各科筆記數；`tsc` 通過（`studyNotes.ts` 已是 `items` 形狀）；測試全過（`render.test.ts` 仍含「則重點」、`studyGuide.test.ts` 用 `items`）。

- [ ] **Step 7: Commit**

```bash
git add src/data/types.ts src/ui/render.ts src/main.ts scripts/generate-study-notes.ts src/data/studyNotes.ts tests/studyGuide.test.ts
git commit -m "feat: switch study notes to hierarchical item model (flat bridge)"
```

---

### Task 2: 把產生器改造為原始切片擷取器

移除舊平鋪邏輯，產生器改為輸出每節原始切片（供後續 LLM 重構與人工複審），不再寫 `studyNotes.ts`。

**Files:**
- Modify: `scripts/generate-study-notes.ts`（移除平鋪、改寫輸出）
- Modify: `package.json`（npm script 改名）
- Modify: `.gitignore`（忽略切片輸出目錄）
- Test: `tests/studySlices.test.ts`（新建）

**Interfaces:**
- Produces: `docs/study-slices/<subjectId>/<code>-<number>.md` 每檔為一節的原始行（已濾除 noise，保留原始斷行與標記）。

- [ ] **Step 1: 撰寫失敗測試 `tests/studySlices.test.ts`**

擷取器的核心是「依 section number 切出該節原始行」。把切片邏輯抽成可測純函式 `sliceSection(lines, sectionNumber)`，測它對一段假輸入回傳正確範圍：

```ts
import { describe, it, expect } from "vitest";
import { sliceSection } from "../scripts/studySlice";

const lines = [
  "## Page 1",
  "3.1 概念甲",
  "這是第一節第一行。",
  "這是第一節第二行。",
  "3.2 概念乙",
  "這是第二節，不該被切進來。",
];

describe("sliceSection", () => {
  it("切出指定節到下一個 [3-6].x 標題之前的內容行", () => {
    const slice = sliceSection(lines, "3.1");
    expect(slice).toEqual(["這是第一節第一行。", "這是第一節第二行。"]);
  });
  it("找不到該節時回傳空陣列", () => {
    expect(sliceSection(lines, "9.9")).toEqual([]);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/studySlices.test.ts`
Expected: FAIL（`../scripts/studySlice` 不存在）

- [ ] **Step 3: 建立純函式模組 `scripts/studySlice.ts`**

把定位邏輯抽成獨立、可測模組（供擷取器與測試共用）：

```ts
export const isSectionHeading = (line: string): boolean =>
  /^[3-6]\.\d+(\s|$)/.test(line) && !line.includes("...");

const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  /^## Page \d+/.test(line) ||
  /^\d+$/.test(line) ||
  /^\d+-\d+$/.test(line) ||
  line === "_No extractable text on this page._";

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 從 markdown 行陣列中，切出指定節（section number）的內容行，濾除明顯 noise。 */
export const sliceSection = (lines: string[], sectionNumber: string): string[] => {
  const re = new RegExp(`^${escapeRegExp(sectionNumber)}(\\s|$)`);
  const start = lines.findIndex((line) => re.test(line) && !line.includes("..."));
  if (start < 0) return [];
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (isSectionHeading(lines[i])) break;
    if (lines[i].startsWith("附件") || lines[i].includes("本學習指引參考書目")) break;
    if (isNoise(lines[i])) continue;
    out.push(lines[i]);
  }
  return out;
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/studySlices.test.ts`
Expected: PASS

- [ ] **Step 5: 改寫 `scripts/generate-study-notes.ts` 為切片擷取器**

保留檔頭 `guides` 對應表與 `normalizeLine`、`mdDir`、`root`。移除平鋪相關：`startsNewDetail`、`cleanDetail`、`pushCurrent`、`collectSection`、`findSectionStart`、`findSectionEnd`、`isQuestionStart`、`isAnswerStart`、`NoteItem`/`NoteSection` 型別、`outFile` 與寫 `studyNotes.ts` 的整段。改為：

```ts
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sliceSection } from "./studySlice";
// （保留既有 guides 對應表、root、mdDir、normalizeLine）

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
```

- [ ] **Step 6: 在 `package.json` 把 npm script 改名**

把：
```json
    "generate:study-notes": "tsx scripts/generate-study-notes.ts"
```
改為：
```json
    "extract:study-slices": "tsx scripts/generate-study-notes.ts"
```

- [ ] **Step 7: 把切片輸出目錄加入 `.gitignore`**

在 `.gitignore` 末尾新增一行：
```
docs/study-slices/
```

- [ ] **Step 8: 跑擷取器與全測試**

Run:
```bash
npm run extract:study-slices
npm run test
npm run build
```
Expected: 在 `docs/study-slices/<subject>/` 產出每節 `.md`；`studySlices` 測試通過；既有測試不退化（`studyNotes.ts` 未被改動，仍是 Task 1 的平面新形狀）；build 通過。

- [ ] **Step 9: Commit**

```bash
git add scripts/generate-study-notes.ts scripts/studySlice.ts tests/studySlices.test.ts package.json .gitignore
git commit -m "refactor: repurpose study-notes generator into slice extractor"
```

---

### Tasks 3–7: 逐科忠實重構（內容）

> 共用程序（每個 content task 都照做）：
> 1. 先跑 `npm run extract:study-slices` 確保 `docs/study-slices/<subjectId>/` 有最新切片。
> 2. 逐節讀該科切片檔，依切片內容把該節重構為乾淨的 `StudyNoteSection`：
>    - 接回被分頁／分欄切斷的句子；移除重複字（如 `…重要數值重要數值`）等 pdftotext 產物。
>    - 依原文標記 `1./2.`、`(1)(2)`、`A.B.C.`、條列符號，建立 `items`/`children` 階層（頂層 `1./2.` 為 `items`，其下 `(1)`、`A.`、條列為各層 `children`）。
>    - 數學正規化為可讀 Unicode 純文字（例 `E(X) = Σ xᵢ·P(xᵢ)`）。
>    - **忠實保留所有知識點，不摘要、不刪減、不新增。**
> 3. 用重構後的 `StudyNoteSection[]` 取代 `src/data/studyNotes.ts` 中**該科**整個 `"<subjectId>": { … }` 物件的值。各 `topic.code` 對應其下的 section 陣列。
> 4. 跑 `npm run build`（tsc 確保形狀正確）與 `npm run test`。
> 5. 內容正確性需人工複審——在 report 中逐節列出「原切片檔 → 重構後頂層結構摘要」，標明仍待人工複審。

**每科一個 task。各科 topic/section 對應（取自 `scripts/generate-study-notes.ts` 的 `guides`）：**

### Task 3: 重構 junior-ai-basics（4 節）

**Files:** Modify `src/data/studyNotes.ts`（`"junior-ai-basics"` 區塊）、Test `tests/studyNotes.test.ts`（新建，結構測試）
**Sections:** `L111` 3.1 人工智慧概念；`L112` 3.2 資料處理與分析概念；`L113` 3.3 機器學習概念；`L114` 3.4 鑑別式 AI 與生成式 AI 概念。

- [ ] **Step 1: 新增結構測試 `tests/studyNotes.test.ts`（一次性，之後各科沿用）**

```ts
import { describe, it, expect } from "vitest";
import { studyNotes } from "../src/data/studyNotes";
import type { StudyNoteItem } from "../src/data/types";

const hasNesting = (items: StudyNoteItem[]): boolean =>
  items.some((item) => (item.children?.length ?? 0) > 0);

describe("studyNotes 結構", () => {
  it("junior-ai-basics 每節都有內容，且整科至少有一處階層", () => {
    const subject = studyNotes["junior-ai-basics"];
    expect(subject).toBeDefined();
    const sections = Object.values(subject).flat();
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      expect(section.heading.trim().length).toBeGreaterThan(0);
      expect(section.items.length).toBeGreaterThan(0);
    }
    expect(sections.some((s) => hasNesting(s.items))).toBe(true);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/studyNotes.test.ts`
Expected: FAIL（目前 junior-ai-basics 仍是 Task 1 的平面資料，無任何 `children`，`hasNesting` 為 false）

- [ ] **Step 3: 重構 junior-ai-basics 內容（照上方共用程序 1-3）**

讀 `docs/study-slices/junior-ai-basics/L111-3.1.md` 等四檔，逐節重構，取代 `studyNotes.ts` 中 `"junior-ai-basics": { "L111": [...], "L112": [...], "L113": [...], "L114": [...] }` 整個值。

- [ ] **Step 4: 跑測試與型別確認通過**

Run: `npx vitest run tests/studyNotes.test.ts && npm run build`
Expected: PASS；tsc 通過。

- [ ] **Step 5: 跑全測試**

Run: `npm run test`
Expected: 全過（含 `render.test.ts`、`studyGuide.test.ts`）。

- [ ] **Step 6: Commit**

```bash
git add src/data/studyNotes.ts tests/studyNotes.test.ts
git commit -m "content: restructure junior-ai-basics study notes"
```

### Task 4: 重構 junior-genai（3 節）

**Files:** Modify `src/data/studyNotes.ts`（`"junior-genai"` 區塊）
**Sections:** `L121` 3.1 No code / Low code 概念；`L122` 3.2 生成式 AI 應用領域與工具使用；`L123` 3.3 生成式 AI 導入評估規劃。

- [ ] **Step 1: 重構內容**（照共用程序 1-3，取代 `"junior-genai"` 整個值）
- [ ] **Step 2: 驗證** — Run: `npm run build && npm run test`，Expected: 全過。
- [ ] **Step 3: Commit**
```bash
git add src/data/studyNotes.ts
git commit -m "content: restructure junior-genai study notes"
```

### Task 5: 重構 senior-ai-tech（9 節）

**Files:** Modify `src/data/studyNotes.ts`（`"senior-ai-tech"` 區塊）
**Sections:** `L211` 3.1 自然語言處理技術與應用、3.2 電腦視覺技術與應用、3.3 生成式 AI 技術與應用、3.4 多模態人工智慧應用；`L212` 4.1 AI 導入評估、4.2 AI 導入規劃、4.3 AI 風險管理；`L213` 5.1 數據準備與模型選擇、5.2 AI 技術系統集成與部署。

- [ ] **Step 1: 重構內容**（照共用程序 1-3，逐節處理九個切片，取代 `"senior-ai-tech"` 整個值）
- [ ] **Step 2: 驗證** — Run: `npm run build && npm run test`，Expected: 全過。
- [ ] **Step 3: Commit**
```bash
git add src/data/studyNotes.ts
git commit -m "content: restructure senior-ai-tech study notes"
```

### Task 6: 重構 senior-bigdata（13 節）

**Files:** Modify `src/data/studyNotes.ts`（`"senior-bigdata"` 區塊）
**Sections:** `L221` 3.1 敘述性統計與資料摘要技術、3.2 機率分佈與資料分佈模型、3.3 假設檢定與統計推論；`L222` 4.1 數據收集與清理、4.2 數據儲存與管理、4.3 數據處理技術與工具；`L223` 5.1 統計學在大數據中的應用、5.2 常見的大數據分析方法、5.3 數據可視化工具；`L224` 6.1 大數據與機器學習、6.2 大數據在鑑別式 AI 中的應用、6.3 大數據在生成式 AI 中的應用、6.4 大數據隱私保護、安全與合規。

- [ ] **Step 1: 重構內容**（照共用程序 1-3，逐節處理十三個切片，取代 `"senior-bigdata"` 整個值；注意 3.2 含數學公式，需正規化為可讀 Unicode）
- [ ] **Step 2: 驗證** — Run: `npm run build && npm run test`，Expected: 全過。
- [ ] **Step 3: Commit**
```bash
git add src/data/studyNotes.ts
git commit -m "content: restructure senior-bigdata study notes"
```

### Task 7: 重構 senior-ml（~11 節）＋ 收尾

**Files:** Modify `src/data/studyNotes.ts`（`"senior-ml"` 區塊 ＋ 檔頭註解）
**Sections:** `L231` 3.1 機率/統計之機器學習基礎應用、3.2 線性代數之機器學習基礎應用、3.3 數值優化技術與方法；`L232` 4.1 機器學習原理與技術、4.2 常見機器學習演算法、4.3 深度學習原理與框架；`L233` 5.1 數據準備與特徵工程、5.2 模型選擇與架構設計、5.3 模型訓練、評估與驗證、5.4 模型調整與優化；`L234` 6.1 數據隱私、安全與合規、6.2 演算法偏見與公平性（如該指引尚有 6.3 等，一併處理）。

> 注意：`senior-ml` 的 section 對應請以 `npm run extract:study-slices` 實際產出的 `docs/study-slices/senior-ml/` 檔案為準（涵蓋 `guides` 中 senior-ml 的所有 section）。

- [ ] **Step 1: 重構內容**（照共用程序 1-3，逐節處理所有切片，取代 `"senior-ml"` 整個值）

- [ ] **Step 2: 更新 `src/data/studyNotes.ts` 檔頭註解**

把產生器留下的：
```ts
// Generated by scripts/generate-study-notes.ts from docs/markdown learning guides.
```
改為：
```ts
// 學習筆記內容：由 docs/study-slices（scripts/extract:study-slices 擷取）經 LLM 忠實重構而成，內容需人工複審；勿用腳本覆寫。
```

- [ ] **Step 3: 驗證** — Run: `npm run build && npm run test`，Expected: 全過。

- [ ] **Step 4: Commit**

```bash
git add src/data/studyNotes.ts
git commit -m "content: restructure senior-ml study notes and mark notes as authored source"
```

---

## Self-Review

**Spec coverage**
- 資料模型 `StudyNoteItem`/`StudyNoteSection`（spec §設計1）→ Task 1 Step 1。
- 遞迴巢狀渲染、葉節點計數、`escapeHtml`（spec §設計2）→ Task 1 Step 3。
- TTS 深度優先串接（spec §設計2）→ Task 1 Step 4（`.note-text` span + querySelector）。
- 機械切片、重用定位邏輯（spec §設計3）→ Task 2（`sliceSection`、擷取器）。
- 移除舊平鋪邏輯（spec §設計3、決策）→ Task 2 Step 5。
- LLM 逐節忠實重構、數學正規化、保留所有知識點（spec §設計3、Global Constraints）→ Tasks 3-7 共用程序。
- 標記為 authored source、勿覆寫（spec §設計3/風險）→ Task 7 Step 2。
- 複審流程（spec §設計4）→ Tasks 3-7 共用程序第 5 點（report 列對照）＋ 收尾存 memory（執行階段）。
- 「N 則重點」改葉節點計數（spec 決策）→ Task 1 Step 3 `countNoteLeaves`。
- 測試（spec §測試）→ Task 1（render/studyGuide 更新）、Task 2（studySlices）、Task 3（studyNotes 結構測試）。

**Placeholder scan**：各 code step 均含完整程式碼與指令。Tasks 3-7 為內容authoring，已給明確逐節程序、檔案位置、取代範圍與驗證指令（內容本身依切片產生，無法預先逐字列出，屬合理）。

**Type consistency**：`StudyNoteItem.text`/`children`、`StudyNoteSection.heading`/`items` 在 Task 1 定義；渲染器 `renderNoteItems`/`countNoteLeaves`、TTS `.note-text`、產生器 `items`、結構測試 `section.items`/`item.children` 一致。`sliceSection(lines, sectionNumber)` 在 Task 2 定義並於擷取器與測試一致使用。npm script 由 `generate:study-notes` 改名為 `extract:study-slices`，Tasks 3-7 共用程序引用後者一致。
