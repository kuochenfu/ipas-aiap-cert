# 刷題進度續作與跳題 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 刷題練習的進度（目前題目與作答紀錄）跨場次保留於 localStorage，並可直接跳到指定題號。

**Architecture:** 新增兩個模組——`src/domain/drill.ts` 放純函式（進度還原、跳號解析），`src/state/drillProgress.ts` 負責 localStorage 讀寫（比照既有 `storage.ts` 的容錯寫法）。`main.ts` 只做接線；UI 變更集中在既有的 `renderDrillFilters` 與 `renderModePicker`。

**Tech Stack:** Vite + TypeScript 純前端；vitest（部分測試檔以 `// @vitest-environment jsdom` 取得 localStorage）。

## Global Constraints

- localStorage key 一律用 `ipas-aiap-drill-progress`；**不得更動既有的 `ipas-aiap-misses`**。
- 所有動態文字經 `src/ui/escape.ts` 的 `escapeHtml` 後才進 `innerHTML`。
- 跳題與重置沿用既有的 `data-nav` 屬性（值為 `jump` 與 `drill-reset`），**不新增 data-\* 屬性**，以避免 `main.ts` 事件委派選擇器清單漏列的既知陷阱。
- 只有刷題（`session.mode === "drill"`）存進度；模擬考試不存。
- 跳號針對全題庫原序；若目標題不符合當前篩選，篩選器自動切回 `all`。
- 每次改完跑 `npm run build`（tsc 型別）與 `npm run test`。既有 106 個測試須維持通過。

---

### Task 1: 純函式模組 `src/domain/drill.ts`

**Files:**
- Create: `src/domain/drill.ts`
- Test: `tests/drill.test.ts`

**Interfaces:**
- Consumes: `Question` 與 `ChoiceId`（`src/data/types`）、`AnswerState`（`src/domain/exam`，實為 `Record<string, ChoiceId | undefined>`）
- Produces:
  - `restoreDrill(questions: Question[], progress: DrillProgress | undefined): { index: number; answers: AnswerState }`
  - `parseJumpTarget(raw: string, total: number): number | null`（回傳 0-based 索引，不合法回 `null`）
  - `export type DrillProgress = { questionId: string; answers: Record<string, ChoiceId> }`

- [ ] **Step 1: 寫失敗測試**

建立 `tests/drill.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { restoreDrill, parseJumpTarget } from "../src/domain/drill";
import type { Question } from "../src/data/types";

const q = (id: string): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [{ id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
  answer: "A", explanation: "", topic: "未分類", difficulty: "中", source: "past-exam",
});
const bank = [q("q1"), q("q2"), q("q3")];

describe("restoreDrill", () => {
  it("沒有進度時回到第一題、無作答", () => {
    expect(restoreDrill(bank, undefined)).toEqual({ index: 0, answers: {} });
  });
  it("依 questionId 還原索引與作答", () => {
    const out = restoreDrill(bank, { questionId: "q3", answers: { q1: "B" } });
    expect(out.index).toBe(2);
    expect(out.answers).toEqual({ q1: "B" });
  });
  it("questionId 已不在題庫時回到第一題（題庫變動容錯）", () => {
    const out = restoreDrill(bank, { questionId: "removed", answers: { q2: "C" } });
    expect(out.index).toBe(0);
    expect(out.answers).toEqual({ q2: "C" });
  });
  it("過濾掉不存在於題庫的作答 id", () => {
    const out = restoreDrill(bank, { questionId: "q1", answers: { q1: "A", gone: "D" } });
    expect(out.answers).toEqual({ q1: "A" });
  });
});

describe("parseJumpTarget", () => {
  it("合法題號轉為 0-based 索引", () => {
    expect(parseJumpTarget("1", 222)).toBe(0);
    expect(parseJumpTarget("137", 222)).toBe(136);
    expect(parseJumpTarget(" 222 ", 222)).toBe(221);
  });
  it("超出範圍回 null", () => {
    expect(parseJumpTarget("0", 222)).toBeNull();
    expect(parseJumpTarget("223", 222)).toBeNull();
    expect(parseJumpTarget("-3", 222)).toBeNull();
  });
  it("非整數或空白回 null", () => {
    expect(parseJumpTarget("", 222)).toBeNull();
    expect(parseJumpTarget("abc", 222)).toBeNull();
    expect(parseJumpTarget("1.5", 222)).toBeNull();
    expect(parseJumpTarget("1e2", 222)).toBeNull();
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/drill.test.ts`
Expected: FAIL — `Failed to resolve import "../src/domain/drill"`

- [ ] **Step 3: 寫最小實作**

建立 `src/domain/drill.ts`：

```ts
import type { ChoiceId, Question } from "../data/types";
import type { AnswerState } from "./exam";

export type DrillProgress = {
  questionId: string;
  answers: Record<string, ChoiceId>;
};

/** 依已儲存的進度還原刷題位置與作答；題庫變動時安全退回第一題。 */
export const restoreDrill = (
  questions: Question[],
  progress: DrillProgress | undefined,
): { index: number; answers: AnswerState } => {
  if (!progress) return { index: 0, answers: {} };
  const ids = new Set(questions.map((question) => question.id));
  const answers: AnswerState = {};
  for (const [id, choice] of Object.entries(progress.answers)) {
    if (ids.has(id)) answers[id] = choice;
  }
  const found = questions.findIndex((question) => question.id === progress.questionId);
  return { index: found >= 0 ? found : 0, answers };
};

/** 把使用者輸入的題號（1-based）轉為索引（0-based）；不合法回 null。 */
export const parseJumpTarget = (raw: string, total: number): number | null => {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (value < 1 || value > total) return null;
  return value - 1;
};
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/drill.test.ts`
Expected: PASS（11 個測試）

- [ ] **Step 5: 提交**

```bash
git add src/domain/drill.ts tests/drill.test.ts
git commit -m "feat: drill progress restore and jump-target parsing"
```

---

### Task 2: localStorage 模組 `src/state/drillProgress.ts`

**Files:**
- Create: `src/state/drillProgress.ts`
- Test: `tests/drillProgress.test.ts`

**Interfaces:**
- Consumes: `DrillProgress`（Task 1 產出）
- Produces:
  - `loadDrillProgress(subjectId: string): DrillProgress | undefined`
  - `saveDrillProgress(subjectId: string, progress: DrillProgress): void`
  - `clearDrillProgress(subjectId: string): void`

- [ ] **Step 1: 寫失敗測試**

建立 `tests/drillProgress.test.ts`：

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { loadDrillProgress, saveDrillProgress, clearDrillProgress } from "../src/state/drillProgress";

const KEY = "ipas-aiap-drill-progress";

beforeEach(() => localStorage.clear());

describe("刷題進度儲存", () => {
  it("存取往返", () => {
    saveDrillProgress("junior-ai-basics", { questionId: "q3", answers: { q1: "B" } });
    expect(loadDrillProgress("junior-ai-basics")).toEqual({ questionId: "q3", answers: { q1: "B" } });
  });
  it("各科目彼此獨立", () => {
    saveDrillProgress("junior-ai-basics", { questionId: "a1", answers: {} });
    saveDrillProgress("junior-genai", { questionId: "b1", answers: {} });
    expect(loadDrillProgress("junior-ai-basics")?.questionId).toBe("a1");
    expect(loadDrillProgress("junior-genai")?.questionId).toBe("b1");
  });
  it("沒有紀錄時回 undefined", () => {
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("清除只影響指定科目", () => {
    saveDrillProgress("junior-ai-basics", { questionId: "a1", answers: {} });
    saveDrillProgress("junior-genai", { questionId: "b1", answers: {} });
    clearDrillProgress("junior-ai-basics");
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
    expect(loadDrillProgress("junior-genai")?.questionId).toBe("b1");
  });
  it("不動到錯題本的 key", () => {
    localStorage.setItem("ipas-aiap-misses", JSON.stringify(["q1"]));
    saveDrillProgress("junior-ai-basics", { questionId: "a1", answers: {} });
    clearDrillProgress("junior-ai-basics");
    expect(localStorage.getItem("ipas-aiap-misses")).toBe(JSON.stringify(["q1"]));
  });
});

describe("刷題進度容錯", () => {
  it("損壞的 JSON 回 undefined", () => {
    localStorage.setItem(KEY, "{not json");
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("頂層不是物件時回 undefined", () => {
    localStorage.setItem(KEY, JSON.stringify(["a"]));
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("缺少 questionId 的紀錄被丟棄", () => {
    localStorage.setItem(KEY, JSON.stringify({ "junior-ai-basics": { answers: {} } }));
    expect(loadDrillProgress("junior-ai-basics")).toBeUndefined();
  });
  it("非 A–D 的選項值被過濾", () => {
    localStorage.setItem(KEY, JSON.stringify({
      "junior-ai-basics": { questionId: "q1", answers: { q1: "A", q2: "Z", q3: 5 } },
    }));
    expect(loadDrillProgress("junior-ai-basics")).toEqual({ questionId: "q1", answers: { q1: "A" } });
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/drillProgress.test.ts`
Expected: FAIL — `Failed to resolve import "../src/state/drillProgress"`

- [ ] **Step 3: 寫最小實作**

建立 `src/state/drillProgress.ts`：

```ts
import type { ChoiceId } from "../data/types";
import type { DrillProgress } from "../domain/drill";

const PROGRESS_KEY = "ipas-aiap-drill-progress";

type ProgressMap = Record<string, DrillProgress>;

const isChoiceId = (value: unknown): value is ChoiceId =>
  value === "A" || value === "B" || value === "C" || value === "D";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readMap = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) return {};
    const out: ProgressMap = {};
    for (const [subjectId, value] of Object.entries(parsed)) {
      if (!isPlainObject(value)) continue;
      if (typeof value.questionId !== "string") continue;
      const answers: Record<string, ChoiceId> = {};
      if (isPlainObject(value.answers)) {
        for (const [id, choice] of Object.entries(value.answers)) {
          if (isChoiceId(choice)) answers[id] = choice;
        }
      }
      out[subjectId] = { questionId: value.questionId, answers };
    }
    return out;
  } catch {
    return {};
  }
};

const writeMap = (map: ProgressMap): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // 儲存空間已滿或被停用：忽略，不影響作答流程
  }
};

export const loadDrillProgress = (subjectId: string): DrillProgress | undefined => readMap()[subjectId];

export const saveDrillProgress = (subjectId: string, progress: DrillProgress): void => {
  const map = readMap();
  map[subjectId] = progress;
  writeMap(map);
};

export const clearDrillProgress = (subjectId: string): void => {
  const map = readMap();
  delete map[subjectId];
  writeMap(map);
};
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/drillProgress.test.ts`
Expected: PASS（9 個測試）

- [ ] **Step 5: 提交**

```bash
git add src/state/drillProgress.ts tests/drillProgress.test.ts
git commit -m "feat: persist drill progress in localStorage"
```

---

### Task 3: UI — 跳題列與模式選單進度提示

**Files:**
- Modify: `src/ui/render.ts`（`DrillControls` 型別、`renderDrillFilters`、`renderModePicker`）
- Modify: `src/styles.css`（跳題列樣式）
- Test: `tests/render.test.ts`（新增測試）

**Interfaces:**
- Consumes: 無（純渲染）
- Produces:
  - `DrillControls` 新增必填欄位 `total: number`（題庫題數，供輸入框 `max` 與提示文字用）
  - `renderModePicker(subjectName: string, drillCount: number, drillProgressText?: string): string`

**注意：** `renderDrillFilters` 同時被 `renderQuestion`（有題目時）與 `renderDrillEmpty`（篩選結果為空時）使用，改這一處即可讓兩個畫面都有跳題列——這是刻意的，因為篩選結果為空時更需要跳題脫困。

- [ ] **Step 1: 寫失敗測試**

在 `tests/render.test.ts` 的 import 區塊補上 `renderModePicker` 與 `renderDrillEmpty`：

```ts
import {
  renderSubjectCard,
  renderChoice,
  renderStudyView,
  renderPaperPicker,
  renderQuestion,
  renderExamPaper,
  renderExamReview,
  renderStudyLoading,
  renderModePicker,
  renderDrillEmpty,
} from "../src/ui/render";
```

先更新既有測試：`DrillControls` 新增必填欄位 `total` 後，`describe("renderQuestion")` 內「刷題作答不顯示交卷」那一則傳入的 controls 物件要補上 `total`：

```ts
      { filter: "all", counts: { all: 1, wrong: 0, unanswered: 1 }, total: 1 },
```

（`tsconfig.json` 的 `include` 只有 `src` 與 `scripts`，測試不進型別檢查，但仍應補齊，否則 `max="undefined"` 會出現在輸出中。）

在檔案末尾追加。題目樣本沿用該檔既有的 `examQs`（`examQs[0]` 的 id 為 `q1`）：

```ts
describe("刷題跳題列", () => {
  const controls = { filter: "all" as const, counts: { all: 222, wrong: 3, unanswered: 100 }, total: 222 };

  it("刷題卡片含跳題輸入框與重置鈕", () => {
    const html = renderQuestion(examQs[0], 0, 222, undefined, false, "", false, controls);
    expect(html).toContain('class="drill-jump-input"');
    expect(html).toContain('max="222"');
    expect(html).toContain('data-nav="jump"');
    expect(html).toContain('data-nav="drill-reset"');
  });

  it("篩選結果為空的畫面也有跳題列", () => {
    const html = renderDrillEmpty({ ...controls, filter: "wrong", counts: { all: 222, wrong: 0, unanswered: 100 } });
    expect(html).toContain('data-nav="jump"');
  });

  it("考試單頁不含跳題列", () => {
    const html = renderQuestion(examQs[0], 0, 50, undefined, false, "10:00", false);
    expect(html).not.toContain('data-nav="jump"');
  });
});

describe("模式選單進度提示", () => {
  it("有進度時顯示提示並跳脫 HTML", () => {
    const html = renderModePicker("科目<X>", 222, "上次進度：第 137 題・已作答 136 題");
    expect(html).toContain("上次進度：第 137 題・已作答 136 題");
    expect(html).toContain("科目&lt;X&gt;");
    expect(html).not.toContain("科目<X>");
  });
  it("沒有進度時不顯示提示區塊", () => {
    const html = renderModePicker("科目", 222);
    expect(html).not.toContain("drill-progress-hint");
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/render.test.ts`
Expected: FAIL — 找不到 `drill-jump-input`；`renderModePicker` 參數數量不符（TS 型別錯誤或第三參數被忽略）

- [ ] **Step 3: 寫最小實作**

`src/ui/render.ts` — 型別加 `total`：

```ts
export type DrillControls = {
  filter: DrillFilter;
  counts: DrillCounts;
  total: number;
};
```

`renderDrillFilters` 改為外層包一個 `.drill-controls`，並加入跳題列：

```ts
const renderDrillFilters = ({ filter, counts, total }: DrillControls): string => `
  <div class="drill-controls">
    <div class="drill-filters" aria-label="刷題篩選">
      ${(Object.keys(drillFilterLabels) as DrillFilter[]).map((key) => `
        <button class="drill-filter ${filter === key ? "active" : ""}" data-filter="${key}" aria-pressed="${filter === key}">
          <span>${drillFilterLabels[key]}</span>
          <strong>${counts[key]}</strong>
        </button>
      `).join("")}
    </div>
    <div class="drill-jump">
      <label class="drill-jump-label">
        跳至
        <input class="drill-jump-input" type="number" inputmode="numeric" min="1" max="${total}"
               aria-label="跳至第幾題（1 到 ${total}）">
        題
      </label>
      <button class="drill-jump-go" data-nav="jump">前往</button>
      <button class="drill-reset" data-nav="drill-reset">重置進度</button>
    </div>
  </div>
`;
```

`renderModePicker` 加上第三個選填參數：

```ts
export const renderModePicker = (
  subjectName: string,
  drillCount: number,
  drillProgressText?: string,
): string => `
  <header class="topbar"><button class="back" data-nav="back">← 返回</button><h1>${escapeHtml(subjectName)}</h1></header>
  <main class="mode-picker">
    <button class="mode-card" data-mode="exam"><h2>模擬考試</h2><p>50 題・計時・100 分制・70 分及格</p></button>
    <button class="mode-card" data-mode="drill">
      <h2>刷題練習</h2>
      <p>全部 ${drillCount} 題・即時對錯與詳解・不計時</p>
      ${drillProgressText ? `<p class="drill-progress-hint">${escapeHtml(drillProgressText)}</p>` : ""}
    </button>
  </main>
`;
```

`src/styles.css` — 在 `.drill-filter strong` 那一行之後插入：

```css
.drill-controls { margin-bottom: 14px; }
.drill-controls .drill-filters { margin-bottom: 8px; }
.drill-jump { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.drill-jump-label {
  display: flex; align-items: center; gap: 6px;
  color: var(--muted); font-weight: 700; font-size: 0.9rem;
}
.drill-jump-input {
  width: 84px; background: var(--panel); color: var(--text);
  border: 1px solid var(--border); border-radius: 8px;
  padding: 7px 9px; font: inherit; font-variant-numeric: tabular-nums;
}
.drill-jump-input:focus { outline: none; border-color: var(--accent); }
.drill-jump-go, .drill-reset {
  background: var(--panel); color: var(--accent);
  border: 1px solid var(--border); padding: 7px 12px; font-weight: 700; font-size: 0.9rem;
}
.drill-jump-go:hover, .drill-reset:hover { border-color: var(--accent); background: var(--accent-soft); }
.drill-reset { color: var(--muted); margin-left: auto; }
.drill-progress-hint { color: var(--accent); font-weight: 700; }
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/render.test.ts && npm run build`
Expected: render 測試 PASS。`npm run build` 此時**預期會失敗**，因為 `main.ts` 建立 `controls` 物件時還沒有 `total` 欄位——Task 4 會補上。若要讓本任務單獨綠燈，先在 `main.ts` 第 260 行的 `controls` 加上 `total: session.questions.length`，其餘留待 Task 4。

- [ ] **Step 5: 提交**

```bash
git add src/ui/render.ts src/styles.css tests/render.test.ts src/main.ts
git commit -m "feat: drill jump-to-question controls and mode picker progress hint"
```

---

### Task 4: `main.ts` 接線

**Files:**
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `restoreDrill`、`parseJumpTarget`（Task 1）；`loadDrillProgress`、`saveDrillProgress`、`clearDrillProgress`（Task 2）；`renderModePicker` 的第三參數與 `DrillControls.total`（Task 3）
- Produces: 無（應用進入點）

- [ ] **Step 1: 加入 import 與進度寫入函式**

在既有 import 區塊加入：

```ts
import { restoreDrill, parseJumpTarget } from "./domain/drill";
import { loadDrillProgress, saveDrillProgress, clearDrillProgress } from "./state/drillProgress";
```

在 `drillCounts()` 函式之後加入：

```ts
// 只有刷題存進度；每次作答與換題後寫入。
function persistDrill() {
  if (session.mode !== "drill" || !session.subjectId) return;
  const current = session.questions[session.index];
  if (!current) return;
  const answers: Record<string, ChoiceId> = {};
  for (const [id, choice] of Object.entries(session.answers)) {
    if (choice !== undefined) answers[id] = choice;
  }
  saveDrillProgress(session.subjectId, { questionId: current.id, answers });
}
```

- [ ] **Step 2: 進入刷題時載入進度**

把 `startMode` 的刷題分支改為：

```ts
function startMode(mode: Mode) {
  session.mode = mode;
  if (mode === "exam") { session.view = "paper"; render(); return; }
  // 刷題：放入全部題目、依考卷原序（不打散），並還原上次進度。
  const bank = getQuestions(session.subjectId);
  session.questions = buildAttempt(bank, { count: bank.length, shuffle: (a) => [...a] }).questions;
  const restored = restoreDrill(session.questions, loadDrillProgress(session.subjectId));
  session.answers = restored.answers;
  session.index = restored.index;
  session.deadline = null;
  session.drillFilter = "all";
  session.view = "play";
  session.reveal = revealForCurrent(); // 該題已作答則揭曉
  render();
}
```

- [ ] **Step 3: 在換題與作答後寫入進度**

`moveDrill` 的 `session.reveal = revealForCurrent();` 之後、`render();` 之前插入 `persistDrill();`。

`selectChoice` 改為：

```ts
function selectChoice(choiceId: ChoiceId) {
  const q = session.questions[session.index];
  if (!q) return;
  session.answers[q.id] = choiceId;
  if (session.mode === "drill") {
    session.reveal = true;
    persistDrill();
  }
  render();
}
```

`changeDrillFilter` 在 `render();` 之前插入 `persistDrill();`。

- [ ] **Step 4: 加入跳題與重置的處理函式**

在 `changeDrillFilter` 之後加入：

```ts
function jumpToDrillIndex(index: number) {
  session.index = index;
  // 目標題若不符當前篩選，切回「全部」，否則畫面不會有反應。
  if (!drillMatches(session.questions[index])) session.drillFilter = "all";
  session.reveal = revealForCurrent();
  persistDrill();
  render();
}

function submitDrillJump() {
  const input = app.querySelector<HTMLInputElement>(".drill-jump-input");
  if (!input) return;
  const index = parseJumpTarget(input.value, session.questions.length);
  if (index === null) { input.value = ""; return; } // 不合法：清空輸入、不打擾
  jumpToDrillIndex(index);
}

function resetDrill() {
  clearDrillProgress(session.subjectId);
  session.answers = {};
  session.index = 0;
  session.drillFilter = "all";
  session.reveal = false;
  render();
}
```

- [ ] **Step 5: 接上 click 事件**

在 click 委派中 `if (nav === "review") ...` 那一行之前加入：

```ts
  if (nav === "jump" && session.mode === "drill") { submitDrillJump(); return; }
  if (nav === "drill-reset" && session.mode === "drill") { resetDrill(); return; }
```

`data-nav` 已在既有的 `closest()` 選擇器清單中，**不需修改該清單**。

- [ ] **Step 6: 接上 Enter 鍵**

把 keydown listener 開頭改為（新增的三行放在既有的 input 防護之前）：

```ts
window.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "Enter" && target instanceof HTMLInputElement && target.classList.contains("drill-jump-input")) {
    event.preventDefault();
    submitDrillJump();
    return;
  }
  if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
  // ...以下維持原樣
```

- [ ] **Step 7: 模式選單顯示進度提示**

`render()` 中 `session.view === "mode"` 的分支改為：

```ts
  if (session.view === "mode") {
    stopTimer();
    const bank = getQuestions(session.subjectId);
    const restored = restoreDrill(bank, loadDrillProgress(session.subjectId));
    const answered = Object.keys(restored.answers).length;
    const hint = answered > 0 || restored.index > 0
      ? `上次進度：第 ${restored.index + 1} 題・已作答 ${answered} 題`
      : undefined;
    app.innerHTML = renderModePicker(getSubject(session.subjectId)?.name ?? "", bank.length, hint);
    return;
  }
```

- [ ] **Step 8: 補上 `controls` 的 `total` 欄位**

`render()` 的 play 分支中（原第 260 行附近）：

```ts
      const controls = { filter: session.drillFilter, counts: drillCounts(), total: session.questions.length };
```

若 Task 3 已先行加上，此步略過。

- [ ] **Step 9: 型別檢查與全套測試**

Run: `npm run build && npm run test`
Expected: build 無錯誤；測試全綠（106 既有 ＋ Task 1–3 新增）

- [ ] **Step 10: 瀏覽器實測**

Run: `npm run dev`，開 `http://127.0.0.1:5173/ipas-aiap-cert/`

逐項確認：
1. 進入任一科目的刷題，答幾題、翻到第 10 題左右，按「結束」回科目列表。
2. 再次進入該科的模式選單 → 刷題卡片顯示「上次進度：第 N 題・已作答 M 題」。
3. 點刷題 → 直接回到第 N 題，且已作答的題目仍顯示揭曉狀態。
4. 「錯題」「未答」篩選器顯示的數字反映先前的作答（不再全是未答）。
5. 跳題輸入 `137` 按 Enter → 跳到第 137 題；輸入 `0`、`9999`、`abc` → 輸入框清空、畫面不動。
6. 切到「錯題」篩選，跳到一個答對的題號 → 篩選器自動回到「全部」且正確跳過去。
7. 按「重置進度」→ 回到第 1 題、所有題目回到未答、篩選器回「全部」；重進仍是第 1 題。
8. 模擬考試流程完全不受影響（無跳題列、無進度提示）。

- [ ] **Step 11: 提交**

```bash
git add src/main.ts
git commit -m "feat: resume drill progress and wire up jump/reset controls"
```

---

## 完成後

依 `superpowers:finishing-a-development-branch` 收尾：跑完整測試 → 詢問整合方式。
