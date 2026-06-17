# 選項解析詞彙表查詢 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓刷題練習的「選項解析」能逐項說明各選項（含非答案選項）的用途並附 2 個範例，透過一份可複用的詞彙表自動套用到五科題庫。

**Architecture:** 新增純函式模組 `choiceAnalysis.ts`（正規化選項文字 → 查詞彙表 → 組出說明句），由現有兩個 fallback 產生器（`resolveExplanations.ts`、`render.ts`）共用。詞彙表 `glossary.ts` 為手寫資料（名詞 → 用途 + 剛好 2 範例）。模擬測驗不經選項解析路徑，天然不受影響。

**Tech Stack:** TypeScript、Vite、Vitest、tsx（一次性腳本）。

## Global Constraints

- 渲染動態文字一律先經 `src/ui/escape.ts` 的 `escapeHtml`；本案產生的選項解析文字交由既有 `renderChoiceExplanations` 內的 `escapeHtml(text)` 處理，模組本身回傳純文字、不得自行插入 HTML。
- 不修改 `src/data/past-exams/*.json`（機器產物）。
- `choiceExplanations` 型別為 `Partial<Record<ChoiceId, string>>`（見 `src/data/types.ts:16`）。
- 詞彙內容正確性需人工複審，僅有格式自動測試。
- 交付前必跑 `npm run build` 與 `npm run test`。

---

### Task 1: `choiceAnalysis` 純函式模組與詞彙表種子

**Files:**
- Create: `src/data/glossary.ts`
- Create: `src/data/choiceAnalysis.ts`
- Test: `tests/choiceAnalysis.test.ts`

**Interfaces:**
- Produces:
  - `type GlossaryEntry = { purpose: string; examples: [string, string] }`
  - `glossary: Record<string, GlossaryEntry>`（key 為中文名詞）
  - `normalizeChoiceTerm(text: string): string`
  - `glossaryPurpose(choiceText: string): GlossaryEntry | undefined`
  - `composeGlossaryAnalysis(args: { choiceText: string; choiceId: string; isCorrect: boolean; correctText: string }): string | undefined`

- [ ] **Step 1: 建立詞彙表種子檔 `src/data/glossary.ts`**

```ts
export type GlossaryEntry = {
  /** 一句話說明此概念的用途 */
  purpose: string;
  /** 剛好兩個具體範例 */
  examples: [string, string];
};

// 名詞 → 用途 + 範例。key 為中文名詞（不含括號英文）。
// 內容正確性需人工複審；此處為高頻種子，後續由 Task 4 擴充。
export const glossary: Record<string, GlossaryEntry> = {
  "專家系統": {
    purpose: "以規則庫與推論引擎，模擬專家在特定領域做診斷與決策",
    examples: ["醫療診斷系統 MYCIN", "設備故障排除規則引擎"],
  },
  "決策支援系統": {
    purpose: "彙整資料並提供分析模型，輔助管理者做半結構化決策",
    examples: ["銷售儀表板", "庫存補貨建議系統"],
  },
  "感知器網路": {
    purpose: "由大量分散感測器即時採集環境與設備資料",
    examples: ["空品監測站", "垃圾桶滿溢偵測"],
  },
};
```

- [ ] **Step 2: 撰寫失敗測試 `tests/choiceAnalysis.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import {
  normalizeChoiceTerm,
  glossaryPurpose,
  composeGlossaryAnalysis,
} from "../src/data/choiceAnalysis";

describe("normalizeChoiceTerm", () => {
  it("去除括號英文與前後空白", () => {
    expect(normalizeChoiceTerm("專家系統（Expert System） ")).toBe("專家系統");
    expect(normalizeChoiceTerm("決策支援系統(Decision Support System)")).toBe("決策支援系統");
  });
});

describe("glossaryPurpose", () => {
  it("命中具名概念", () => {
    const entry = glossaryPurpose("感知器網路（Sensor Network）");
    expect(entry?.purpose).toContain("感測器");
    expect(entry?.examples).toHaveLength(2);
  });
  it("整句型選項未命中回傳 undefined", () => {
    expect(glossaryPurpose("為整張圖片指定一個標籤")).toBeUndefined();
  });
});

describe("composeGlossaryAnalysis", () => {
  it("錯誤選項：附用途、2 範例、對照正解與選項代號", () => {
    const text = composeGlossaryAnalysis({
      choiceText: "專家系統（Expert System） ",
      choiceId: "A",
      isCorrect: false,
      correctText: "感知器網路（Sensor Network）",
    });
    expect(text).toBe(
      "專家系統：以規則庫與推論引擎，模擬專家在特定領域做診斷與決策（例如：醫療診斷系統 MYCIN、設備故障排除規則引擎）。本題情境指向「感知器網路」，故不選 A。",
    );
  });
  it("正解：附用途、2 範例、標示本題正解", () => {
    const text = composeGlossaryAnalysis({
      choiceText: "感知器網路（Sensor Network）",
      choiceId: "D",
      isCorrect: true,
      correctText: "感知器網路（Sensor Network）",
    });
    expect(text).toBe(
      "感知器網路：由大量分散感測器即時採集環境與設備資料（例如：空品監測站、垃圾桶滿溢偵測）—— 這是本題正解。",
    );
  });
  it("未命中回傳 undefined", () => {
    expect(
      composeGlossaryAnalysis({
        choiceText: "為整張圖片指定一個標籤",
        choiceId: "B",
        isCorrect: false,
        correctText: "感知器網路",
      }),
    ).toBeUndefined();
  });
});
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npx vitest run tests/choiceAnalysis.test.ts`
Expected: FAIL（`choiceAnalysis` 模組不存在 / 函式未定義）

- [ ] **Step 4: 實作 `src/data/choiceAnalysis.ts`**

```ts
import { glossary } from "./glossary";
import type { GlossaryEntry } from "./glossary";

export type { GlossaryEntry } from "./glossary";

/** 去除括號（全形／半形）內英文註解與所有空白，取得中文名詞 */
export const normalizeChoiceTerm = (text: string): string =>
  text
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[\s　]/g, "")
    .trim();

export const glossaryPurpose = (choiceText: string): GlossaryEntry | undefined =>
  glossary[normalizeChoiceTerm(choiceText)];

export const composeGlossaryAnalysis = (args: {
  choiceText: string;
  choiceId: string;
  isCorrect: boolean;
  correctText: string;
}): string | undefined => {
  const entry = glossaryPurpose(args.choiceText);
  if (!entry) return undefined;
  const term = normalizeChoiceTerm(args.choiceText);
  const [ex1, ex2] = entry.examples;
  if (args.isCorrect) {
    return `${term}：${entry.purpose}（例如：${ex1}、${ex2}）—— 這是本題正解。`;
  }
  const correctTerm = normalizeChoiceTerm(args.correctText);
  return `${term}：${entry.purpose}（例如：${ex1}、${ex2}）。本題情境指向「${correctTerm}」，故不選 ${args.choiceId}。`;
};
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npx vitest run tests/choiceAnalysis.test.ts`
Expected: PASS（全部）

- [ ] **Step 6: Commit**

```bash
git add src/data/glossary.ts src/data/choiceAnalysis.ts tests/choiceAnalysis.test.ts
git commit -m "feat: add glossary lookup module for choice analysis"
```

---

### Task 2: 接入 `resolveExplanations`（空詳解題的選項解析）

**Files:**
- Modify: `src/data/resolveExplanations.ts`（`buildChoiceExplanations`，約 13-28 行）
- Test: `tests/resolveExplanations.test.ts`（新建）

**Interfaces:**
- Consumes: `composeGlossaryAnalysis` from `./choiceAnalysis`、`resolvePastExamExplanations` from `./resolveExplanations`

- [ ] **Step 1: 撰寫失敗測試 `tests/resolveExplanations.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { resolvePastExamExplanations } from "../src/data/resolveExplanations";
import type { Question } from "../src/data/types";

const sensorQ: Question = {
  id: "q1",
  subjectId: "junior-ai-basics",
  prompt: "持續蒐集環境數據與設備狀態，最直接支援的技術？",
  choices: [
    { id: "A", text: "專家系統（Expert System） " },
    { id: "B", text: "決策支援系統（Decision Support System） " },
    { id: "C", text: "啟發式決策引擎（Heuristic Decision Engine） " },
    { id: "D", text: "感知器網路（Sensor Network）" },
  ],
  answer: "D",
  explanation: "",
  topic: "未分類",
  difficulty: "中",
  source: "past-exam",
};

describe("resolvePastExamExplanations + glossary", () => {
  it("空詳解題的錯誤選項帶出詞彙表用途與 2 範例", () => {
    const [q] = resolvePastExamExplanations([sensorQ], {});
    expect(q.choiceExplanations?.A).toContain("以規則庫與推論引擎");
    expect(q.choiceExplanations?.A).toContain("例如：");
    expect(q.choiceExplanations?.A).toContain("故不選 A");
  });
  it("空詳解題的正解帶出詞彙表用途並標示正解", () => {
    const [q] = resolvePastExamExplanations([sensorQ], {});
    expect(q.choiceExplanations?.D).toContain("這是本題正解");
    expect(q.choiceExplanations?.D).toContain("即時採集環境與設備資料");
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/resolveExplanations.test.ts`
Expected: FAIL（目前回傳通用句，不含「以規則庫與推論引擎」）

- [ ] **Step 3: 修改 `src/data/resolveExplanations.ts`**

在檔首 import 區加入：

```ts
import { composeGlossaryAnalysis } from "./choiceAnalysis";
```

將 `buildChoiceExplanations` 的迴圈改為（詞彙表優先，未命中沿用既有通用句）：

```ts
const buildChoiceExplanations = (q: Question): NonNullable<Question["choiceExplanations"]> => {
  const correct = q.choices.find((choice) => choice.id === q.answer);
  const correctText = choiceText(correct);
  const out: NonNullable<Question["choiceExplanations"]> = {};

  for (const choice of q.choices) {
    const composed = composeGlossaryAnalysis({
      choiceText: choice.text,
      choiceId: choice.id,
      isCorrect: choice.id === q.answer,
      correctText,
    });
    if (composed) {
      out[choice.id] = composed;
      continue;
    }
    if (choice.id === q.answer) {
      out[choice.id] = `正解。此選項最符合題幹中的關鍵條件，應判斷為「${correctText}」。`;
      continue;
    }
    out[choice.id] =
      `此選項描述的是「${choice.text}」，較適用於題目明確要求該概念、工具或情境時；本題關鍵條件指向「${correctText}」，因此不選 ${choice.id}。`;
  }

  return out;
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/resolveExplanations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/resolveExplanations.ts tests/resolveExplanations.test.ts
git commit -m "feat: glossary-driven choice analysis for empty-explanation questions"
```

---

### Task 3: 接入 `render`（有詳解但無 ABCD 標記題的選項解析）

**Files:**
- Modify: `src/ui/render.ts`（`fallbackChoiceExplanation`，約 91-99 行）
- Test: `tests/render.test.ts`（新增測試案例）

**Interfaces:**
- Consumes: `composeGlossaryAnalysis` from `../data/choiceAnalysis`
- 維持 `explanationSegmentForChoice`（詳解 ABCD 標記抽取）對錯誤選項的優先權。

- [ ] **Step 1: 在 `tests/render.test.ts` 新增失敗測試**

先確認檔案既有 import 樣式；於檔末 describe 區塊新增：

```ts
import { renderQuestion } from "../src/ui/render";
import type { Question } from "../src/data/types";

describe("renderQuestion 選項解析 × glossary", () => {
  const q: Question = {
    id: "q1",
    subjectId: "junior-ai-basics",
    prompt: "持續蒐集環境數據與設備狀態，最直接支援的技術？",
    choices: [
      { id: "A", text: "專家系統（Expert System） " },
      { id: "B", text: "決策支援系統（Decision Support System） " },
      { id: "C", text: "啟發式決策引擎（Heuristic Decision Engine） " },
      { id: "D", text: "感知器網路（Sensor Network）" },
    ],
    answer: "D",
    // 有手寫詳解但無 A/B/C/D 標記 → 走 fallback
    explanation: "需求是持續蒐集環境數據，最直接由感知器網路支援。",
    topic: "未分類",
    difficulty: "中",
    source: "past-exam",
  };

  it("揭曉時錯誤選項顯示詞彙表用途與範例", () => {
    const html = renderQuestion(q, 0, 1, "D", true, "", false);
    expect(html).toContain("以規則庫與推論引擎");
    expect(html).toContain("故不選 A");
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npx vitest run tests/render.test.ts -t "glossary"`
Expected: FAIL（目前顯示通用句，不含「以規則庫與推論引擎」）

- [ ] **Step 3: 修改 `src/ui/render.ts`**

在檔首 import 區加入：

```ts
import { composeGlossaryAnalysis } from "../data/choiceAnalysis";
```

將 `fallbackChoiceExplanation` 改為（正解先試詞彙表；錯誤選項維持「詳解標記抽取 > 詞彙表 > 通用句」）：

```ts
const fallbackChoiceExplanation = (q: Question, choice: Choice): string => {
  const correctChoice = q.choices.find((item) => item.id === q.answer);
  const correctText = correctChoice?.text ?? "";
  if (choice.id === q.answer) {
    return (
      composeGlossaryAnalysis({
        choiceText: choice.text,
        choiceId: choice.id,
        isCorrect: true,
        correctText,
      }) ?? "這是本題正解；請搭配下方詳解掌握判斷依據。"
    );
  }
  const segment = explanationSegmentForChoice(q.explanation, choice.id);
  if (segment) return segment;
  return (
    composeGlossaryAnalysis({
      choiceText: choice.text,
      choiceId: choice.id,
      isCorrect: false,
      correctText,
    }) ??
    `此選項不是本題答案；它描述的是「${choice.text}」，但本題正解應判斷為「${q.answer}. ${correctText}」。請對照完整詳解，確認題目情境與關鍵概念的差異。`
  );
};
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npx vitest run tests/render.test.ts`
Expected: PASS（含既有案例）

- [ ] **Step 5: Commit**

```bash
git add src/ui/render.ts tests/render.test.ts
git commit -m "feat: glossary-driven choice analysis in drill render fallback"
```

---

### Task 4: 詞彙表覆蓋率腳本與擴充種子

**Files:**
- Create: `scripts/glossary-coverage.ts`
- Modify: `package.json`（新增 `glossary:coverage` script）
- Modify: `src/data/glossary.ts`（依腳本回報擴充高頻名詞）

**Interfaces:**
- Consumes: `normalizeChoiceTerm`, `glossary` from `../src/data/choiceAnalysis` 與 `../src/data/glossary`

- [ ] **Step 1: 建立 `scripts/glossary-coverage.ts`**

```ts
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeChoiceTerm } from "../src/data/choiceAnalysis";
import { glossary } from "../src/data/glossary";

const here = dirname(fileURLToPath(import.meta.url));
const pastDir = join(here, "../src/data/past-exams");

// 具名概念型啟發式：正規化後字數短、無句末標點
const isNamedConcept = (term: string): boolean =>
  term.length > 0 && term.length <= 12 && !/[。，、；？！]/.test(term);

type Choice = { id: string; text: string };
type Q = { choices: Choice[] };

let total = 0;
let hit = 0;
let named = 0;
let sentence = 0;
const missing = new Map<string, number>();

for (const file of readdirSync(pastDir).filter((f) => f.endsWith(".json"))) {
  const questions: Q[] = JSON.parse(readFileSync(join(pastDir, file), "utf8"));
  for (const q of questions) {
    for (const c of q.choices) {
      total += 1;
      const term = normalizeChoiceTerm(c.text);
      if (glossary[term]) {
        hit += 1;
        continue;
      }
      if (isNamedConcept(term)) {
        named += 1;
        missing.set(term, (missing.get(term) ?? 0) + 1);
      } else {
        sentence += 1;
      }
    }
  }
}

const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;
console.log(`總選項數：${total}`);
console.log(`已命中：${hit}（${pct(hit)}）`);
console.log(`未命中—具名概念型：${named}（${pct(named)}）`);
console.log(`未命中—整句型：${sentence}（${pct(sentence)}）`);
console.log("\n最高頻未命中具名概念（前 30）：");
[...missing.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([term, n]) => console.log(`  ${n.toString().padStart(4)}  ${term}`));
```

- [ ] **Step 2: 在 `package.json` 的 `scripts` 加入指令**

於 `"generate:study-notes"` 後新增一行：

```json
    "glossary:coverage": "tsx scripts/glossary-coverage.ts"
```

- [ ] **Step 3: 跑腳本看現況覆蓋率與高頻缺口**

Run: `npm run glossary:coverage`
Expected: 印出總選項數、命中率、兩類未命中佔比，以及前 30 高頻未命中具名概念詞。

- [ ] **Step 4: 依回報擴充 `src/data/glossary.ts`**

針對腳本列出的高頻具名概念，逐一補上 `GlossaryEntry`（用途一句 + 剛好 2 範例）。每補一批後重跑 `npm run glossary:coverage` 觀察命中率提升。內容須人工複審正確性。

範例（依實際輸出調整）：

```ts
  "啟發式決策引擎": {
    purpose: "以經驗法則快速產生近似最佳解，犧牲最優性換取效率",
    examples: ["路徑規劃的 A* 啟發式", "排程的貪婪法則"],
  },
```

- [ ] **Step 5: 跑全測試與型別檢查確認無退化**

Run: `npm run test && npm run build`
Expected: 測試全過、型別檢查通過。

- [ ] **Step 6: Commit**

```bash
git add scripts/glossary-coverage.ts package.json src/data/glossary.ts
git commit -m "feat: glossary coverage script and expand seed terms"
```

---

## Self-Review

**Spec coverage**
- 詞彙表資料（spec §設計1）→ Task 1。
- 比對純函式（spec §設計2）→ Task 1。
- 接入兩個 fallback（spec §設計3）→ Task 2（resolveExplanations）、Task 3（render）。
- 正解附用途（spec §設計4，含 2 範例需求）→ Task 1 `composeGlossaryAnalysis` + Task 2/3 接入。
- 詞彙表建置策略與覆蓋率回報（spec §設計4 建表、§風險）→ Task 4。
- 只在刷題、不碰模擬測驗（spec §非目標）→ 既有架構限定，無需改 `renderExamPaper`/`renderExamReview`；Task 3 僅動 `fallbackChoiceExplanation`。
- 測試（spec §測試）→ Task 1/2/3 各含單元測試；Task 4 Step 5 跑全測試與 build。

**Placeholder scan**：各步驟均含完整程式碼與指令，無 TBD/TODO（Task 4 Step 4 的詞彙擴充依腳本實際輸出，已給範例格式）。

**Type consistency**：`GlossaryEntry`、`normalizeChoiceTerm`、`glossaryPurpose`、`composeGlossaryAnalysis` 在 Task 1 定義，Task 2/3/4 引用名稱與簽章一致。`renderQuestion` 參數順序對照 `src/ui/render.ts:153`（q, index, total, selected, reveal, timeText, review, drillControls?）。
