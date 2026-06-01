# 學習主題（延伸閱讀）功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首頁新增「學習主題（延伸閱讀）」入口，點擊進入依科目分組的頁面，依官方評鑑範圍列出每科的評鑑主題、評鑑內容與精選外部閱讀連結。

**Architecture:** 沿用既有純前端 Vite + TS 架構。新增 `src/data/studyGuide.ts`（官方大綱手動轉錄＋策展連結）與型別；`src/ui/render.ts` 新增 `renderStudyView` 與首頁入口；`src/main.ts` 狀態機新增 `study` 視圖。資料皆為靜態、跳脫渲染、連結新分頁開啟。

**Tech Stack:** Vite、TypeScript、Vitest。無新依賴。

---

## File Structure

- `src/data/types.ts` — 新增 `ReadingLink`、`StudyTopic`、`SubjectStudyGuide`。
- `src/data/studyGuide.ts` — 新檔：`studyGuides`、`getStudyGuide`。
- `src/ui/render.ts` — 新增 `renderStudyView()`；修改 `renderHome()` 加入口按鈕。
- `src/main.ts` — 狀態機新增 `study` 視圖與 `data-nav="study"` 處理。
- `src/styles.css` — 學習主題頁樣式。
- `tests/studyGuide.test.ts` — 資料完整性測試。
- `tests/render.test.ts` — 擴充：`renderStudyView` 測試。

來源資料（唯讀，存於本機，已 gitignore 但檔案存在）：`docs/markdown/AI應用規劃師能力鑑定_評鑑內容範圍參考_11502_20260226174411.md`。

---

## Task 1: 型別

**Files:** Modify `src/data/types.ts`（append）

- [ ] **Step 1: 於 `src/data/types.ts` 末端新增型別**

```ts
export type ReadingLink = { title: string; url: string };

export type StudyTopic = {
  code: string;
  title: string;
  contents: string[];
  links: ReadingLink[];
};

export type SubjectStudyGuide = {
  subjectId: string;
  topics: StudyTopic[];
};
```

- [ ] **Step 2: 確認型別編譯**

Run: `npm run build`
Expected: tsc 無錯（尚無使用者，僅型別宣告）。

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat: add study-guide types"
```

---

## Task 2: 學習主題資料模組（官方大綱＋策展連結）

這是內容任務：依官方評鑑範圍轉錄 18 個評鑑主題與其評鑑內容，並為每個評鑑主題策展 1–3 個外部閱讀連結。

**Files:** Create `src/data/studyGuide.ts`

來源：讀 `docs/markdown/AI應用規劃師能力鑑定_評鑑內容範圍參考_11502_20260226174411.md`。各科 subjectId 與評鑑主題對應：

- `junior-ai-basics`：L111 人工智慧概念、L112 資料處理與分析概念、L113 機器學習概念、L114 鑑別式 AI 與生成式 AI 概念
- `junior-genai`：L121 No code/Low code 概念、L122 生成式 AI 應用領域與工具使用、L123 生成式 AI 導入評估規劃
- `senior-ai-tech`：L211 AI 相關技術應用、L212 AI 導入評估規劃、L213 AI 技術應用與系統部署
- `senior-bigdata`：L221 機率統計基礎、L222 大數據處理技術、L223 大數據分析方法與工具、L224 大數據在人工智慧之應用
- `senior-ml`：L231 機器學習基礎數學、L232 機器學習與深度學習、L233 機器學習建模與參數調校、L234 機器學習治理

- [ ] **Step 1: 建立 `src/data/studyGuide.ts` 結構與資料**

逐科逐主題填入。`contents` 取自各評鑑內容標題（可併入備註關鍵詞，簡潔即可）。`links` 為策展之外部閱讀連結。範例結構（請補滿全部 18 主題）：

```ts
import type { SubjectStudyGuide } from "./types";

export const studyGuides: SubjectStudyGuide[] = [
  {
    subjectId: "junior-ai-basics",
    topics: [
      {
        code: "L111",
        title: "人工智慧概念",
        contents: [
          "AI 的定義與分類",
          "AI 治理概念（如 EU AI Act、數位發展部、金管會《金融業運用 AI 指引》等）",
        ],
        links: [
          { title: "經濟部產業發展署 AI 導入指引", url: "https://www.moeaidb.gov.tw/" },
          { title: "EU AI Act 官方入口", url: "https://artificial-intelligence-act.eu/" },
        ],
      },
      // L112 / L113 / L114 …
    ],
  },
  // junior-genai / senior-ai-tech / senior-bigdata / senior-ml …
];

export const getStudyGuide = (subjectId: string): SubjectStudyGuide | undefined =>
  studyGuides.find((guide) => guide.subjectId === subjectId);
```

策展原則：
- 優先穩定、權威來源：經濟部產業發展署、國發會／數位發展部、金管會、歐盟 AI Act、各工具官方文件（OpenAI、Microsoft Learn、Midjourney 等）、知名公開課程（台大李宏毅、learnprompting）。
- 每個評鑑主題 1–3 個連結；勿杜撰網址。

- [ ] **Step 2: 抽查所有連結可用性**

對 `studyGuide.ts` 內每個 `url` 執行 HTTP 檢查（可用 `curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" -L <url>`，或逐一 WebFetch）。
Expected: 皆回 200（或正常 3xx 轉址）。任何 404/連線失敗者，替換為可用的官方替代連結或移除該連結（但每個主題至少保留 1 個有效連結）。記錄替換情形。

- [ ] **Step 3: 確認編譯**

Run: `npm run build`
Expected: tsc 無錯。

- [ ] **Step 4: Commit**

```bash
git add src/data/studyGuide.ts
git commit -m "content: add per-subject study topics and curated reading links"
```

---

## Task 3: 資料完整性測試

**Files:** Create `tests/studyGuide.test.ts`

- [ ] **Step 1: 撰寫測試**

```ts
import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getStudyGuide } from "../src/data/studyGuide";

describe("學習主題資料", () => {
  for (const subject of subjects) {
    describe(subject.id, () => {
      const guide = getStudyGuide(subject.id);
      it("該科有學習指引且至少一個主題", () => {
        expect(guide).toBeDefined();
        expect(guide!.topics.length).toBeGreaterThan(0);
      });
      it("每主題有標題、至少一條內容、連結皆為有效 http(s) 且有標題", () => {
        for (const topic of guide!.topics) {
          expect(topic.title.trim().length).toBeGreaterThan(0);
          expect(topic.contents.length).toBeGreaterThan(0);
          expect(topic.links.length).toBeGreaterThan(0);
          for (const link of topic.links) {
            expect(link.title.trim().length).toBeGreaterThan(0);
            expect(/^https?:\/\//.test(link.url)).toBe(true);
          }
        }
      });
    });
  }
});
```

- [ ] **Step 2: 跑測試**

Run: `npx vitest run tests/studyGuide.test.ts`
Expected: PASS（若失敗，依訊息補齊 Task 2 資料）。

- [ ] **Step 3: Commit**

```bash
git add tests/studyGuide.test.ts
git commit -m "test: add study-guide data integrity tests"
```

---

## Task 4: 渲染函式與首頁入口

**Files:** Modify `src/ui/render.ts`; Modify `tests/render.test.ts`

- [ ] **Step 1: 於 `tests/render.test.ts` 新增測試**（加在檔案既有測試之後；補上 import）

在頂部 import 增加：
```ts
import { renderStudyView } from "../src/ui/render";
```
新增測試：
```ts
describe("renderStudyView", () => {
  it("含科目名稱、主題標題、外部連結安全屬性、跳脫", () => {
    const html = renderStudyView();
    expect(html).toContain("學習主題");
    expect(html).toContain("人工智慧基礎概論"); // 科目名稱
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/render.test.ts`
Expected: FAIL（`renderStudyView` 未定義）。

- [ ] **Step 3: 於 `src/ui/render.ts` 實作 `renderStudyView` 並修改 `renderHome`**

在頂部 import 區新增（與既有 import 並列，勿重複）：
```ts
import { subjects } from "../domain/catalog";
import { studyGuides, getStudyGuide } from "../data/studyGuide";
```
（注意：`getSubjectsByLevel`、`getBankStats` 等既有 import 保留。`subjects` 若尚未 import 才加。）

修改 `renderHome`：在 `level-grid` 之後、`</main>` 之前加入入口按鈕：
```ts
    <button class="study-entry" data-nav="study">📚 學習主題（延伸閱讀）</button>
```

於檔案末端新增：
```ts
const renderReadingLink = (link: { title: string; url: string }): string =>
  `<li><a class="reading-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a></li>`;

export const renderStudyView = (): string => {
  const sections = (["junior", "senior"] as const).map((level) => {
    const subjectsHtml = subjects
      .filter((s) => s.level === level)
      .map((s) => {
        const guide = getStudyGuide(s.id);
        const topics = (guide?.topics ?? [])
          .map((t) => `
            <div class="study-topic">
              <h4>${escapeHtml(t.code)}　${escapeHtml(t.title)}</h4>
              <ul class="study-contents">${t.contents.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
              <ul class="study-links">${t.links.map(renderReadingLink).join("")}</ul>
            </div>
          `)
          .join("");
        return `
          <section class="study-subject">
            <h3>${escapeHtml(s.code)}　${escapeHtml(s.name)}</h3>
            ${topics}
          </section>
        `;
      })
      .join("");
    return `
      <section class="study-level">
        <h2>${level === "junior" ? "初級" : "中級"}</h2>
        ${subjectsHtml}
      </section>
    `;
  }).join("");
  return `
    <header class="topbar">
      <button class="back" data-nav="home">← 返回</button>
      <h1>學習主題（延伸閱讀）</h1>
    </header>
    <main class="study">
      <p class="lead">依官方評鑑範圍，掌握各科應讀主題與延伸閱讀。</p>
      ${sections}
    </main>
  `;
};
```
（`studyGuides` 已被 `getStudyGuide` 使用而間接相依；若 lint 報 `studyGuides` 未使用，改為僅 import `getStudyGuide`。）

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/render.test.ts`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/ui/render.ts tests/render.test.ts
git commit -m "feat: add study-topics view renderer and home entry"
```

---

## Task 5: main.ts 狀態機接上 study 視圖

**Files:** Modify `src/main.ts`

- [ ] **Step 1: import `renderStudyView`**

在 `src/main.ts` 的 render import 區，將 `renderStudyView` 加入既有 `from "./ui/render"` 的具名匯入清單。

- [ ] **Step 2: View 型別加入 `study`**

把 `type View = "home" | "level" | "mode" | "play" | "result" | "review";`
改為 `type View = "home" | "level" | "mode" | "play" | "result" | "review" | "study";`

- [ ] **Step 3: render() 處理 study 視圖**

在 `render()` 中 `home` 分支之後新增（study 為靜態頁，需停止任何計時器）：
```ts
  if (session.view === "study") { stopTimer(); app.innerHTML = renderStudyView(); return; }
```

- [ ] **Step 4: 點擊委派處理 study 入口**

在 nav 處理區，`home` 之前或之後新增：
```ts
  if (nav === "study") { session.view = "study"; render(); return; }
```
（`data-nav="study"` 從首頁進入；`study` 頁的「← 返回」用既有 `data-nav="home"`，會重置 session 回首頁，符合預期。）

- [ ] **Step 5: build 驗證**

Run: `npm run build`
Expected: tsc 無錯、vite build 成功。

- [ ] **Step 6: Commit**

```bash
git add src/main.ts
git commit -m "feat: wire study-topics view into state machine"
```

---

## Task 6: 樣式

**Files:** Modify `src/styles.css`（append）

- [ ] **Step 1: 於 `src/styles.css` 末端新增樣式**

```css
.study-entry { width: 100%; background: var(--panel); padding: 14px 16px; margin-top: 12px; font-size: 1rem; }
.study .lead { opacity: 0.8; }
.study-level { margin-bottom: 8px; }
.study-level > h2 { color: var(--accent); border-bottom: 1px solid #2c3858; padding-bottom: 6px; }
.study-subject { background: var(--panel); border-radius: 10px; padding: 12px 16px; margin: 12px 0; }
.study-subject > h3 { margin: 4px 0 12px; font-size: 1.05rem; }
.study-topic { margin: 10px 0 14px; }
.study-topic h4 { margin: 0 0 6px; font-size: 0.98rem; }
.study-contents { margin: 0 0 6px; padding-left: 20px; opacity: 0.85; }
.study-contents li { margin: 2px 0; line-height: 1.5; }
.study-links { margin: 0; padding-left: 20px; }
.study-links li { margin: 3px 0; }
.reading-link { color: var(--accent); text-decoration: none; }
.reading-link:hover { text-decoration: underline; }
```

- [ ] **Step 2: build 驗證**

Run: `npm run build`
Expected: 成功。

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: add study-topics view styling"
```

---

## Task 7: 瀏覽器驗證

**Files:** 無（驗證）

- [ ] **Step 1: 啟動並逐項確認**

Run: `npm run dev`，開啟網址：
- 首頁出現「📚 學習主題（延伸閱讀）」入口。
- 點入後依 初級／中級 → 各科目 → 評鑑主題 顯示；內容條列與連結正常。
- 點任一外部連結於新分頁開啟正確網址。
- 「← 返回」回到首頁，原有「初級／中級 → 練習」流程不受影響。

- [ ] **Step 2: 最終測試與 build**

Run: `npm run test && npm run build`
Expected: 全部測試通過、build 成功。

---

## Self-Review 紀錄

- **Spec 覆蓋**：型別(Task 1)、官方大綱＋策展連結資料與連結抽查(Task 2)、資料完整性測試(Task 3)、渲染與首頁入口＋安全屬性(Task 4)、狀態機接線(Task 5)、樣式(Task 6)、瀏覽器與最終驗證(Task 7)。皆對應。
- **Placeholder 掃描**：程式步驟均附完整程式碼；Task 2 為內容撰寫，已給結構、來源、策展原則與連結驗證步驟。
- **型別一致**：`ReadingLink`/`StudyTopic`/`SubjectStudyGuide`(types.ts) 與 `studyGuide.ts`、`render.ts` 用法一致；`getStudyGuide(subjectId)` 簽名一致；`View` 聯集型別新增 `study` 後於 render() 與委派一致；`renderStudyView()` 無參數，與 main.ts 呼叫一致。
- **既有流程不受影響**：未更動 exam/drill/review 邏輯；study 為新增獨立視圖。
