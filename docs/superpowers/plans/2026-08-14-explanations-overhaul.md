# 初級兩科詳解與選項解析全面改寫 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `junior-ai-basics` 與 `junior-genai` 的 369 題真題，全部具備達標的詳解與三個錯誤選項的逐題解析。

**Architecture:** 廢除以詞彙表自動組合選項解析、以樣板產生詳解的兩套機制，改為全手寫。`explanations/<subjectId>.ts` 的型別由 `Record<string, string>` 擴充為同時承載詳解與選項解析，`resolveExplanations.ts` 精簡為單純套用手寫內容。

**Tech Stack:** Vite + TypeScript 純前端；vitest。

## Global Constraints

- **不得改動 `src/data/past-exams/`、`src/data/generated/`**。`getQuestions` 回傳題數須維持 `junior-ai-basics` 222 題、`junior-genai` 213 題。
- **`gen-*` 的 100 題（每科 50）內容不得更動**，包含其 `explanation` 與 `choiceExplanations`。
- **不得動中級三科的詳解內容**（`senior-ai-tech`、`senior-bigdata`、`senior-ml`）；僅能為型別一致做機械式結構轉換。
- 所有動態文字經 `src/ui/escape.ts` 的 `escapeHtml` 後才進 `innerHTML`。
- localStorage 相關一律不動（`ipas-aiap-misses`、`ipas-aiap-drill-progress`）。
- 每次改完跑 `npm run build`（tsc）與 `npm run test`。既有 197 個測試須維持通過。

### 詳解與選項解析的撰寫契約（所有內容任務共用）

**詳解**要做到四件事，順序不拘：

1. **說明正解為何成立** — 講概念或機制，不是把選項文字換句話說。
2. **點出題幹裡的決定性線索** — 是哪一句話讓答案只能是這個。
3. **處理最誘人的錯誤選項** — 通常是相鄰概念，說清楚差在哪。
4. **長度足以教會人** — 約 80–150 字（硬性下限 60 字）。

不合格的樣態：只重述答案、只說「因為最符合題意」、通篇是題目文字重排、殘留樣板句型。

**選項解析**：每個錯誤選項一句話，講「這個選項**在這一題**為什麼錯」——不是這個名詞的通用定義。正解**不寫**選項解析（畫面會自動顯示「這是本題正解」）。

**既有內容的處理原則：不合標才改，合標的保留。** 115-1 與 114-4 的現有詳解品質不差，目標是改善而非重寫一遍。

**最嚴重的失敗模式：改詳解時把正解講反。** 每題寫完必須回頭確認「詳解論證為正確的那個選項，就是 `answer` 指的那個」。這是這個計畫的頭號風險。

**繁體中文**：不得出現簡體字（測試會擋）。

---

### Task 1: 資料層改型別、刪除自動產生機制

**Files:**
- Modify: `src/data/explanations/junior-ai-basics.ts`、`junior-genai.ts`、`senior-ai-tech.ts`、`senior-bigdata.ts`、`senior-ml.ts`
- Modify: `src/data/resolveExplanations.ts`
- Modify: `src/ui/render.ts`
- Delete: `src/data/glossary.ts`、`src/data/choiceAnalysis.ts`、`tests/choiceAnalysis.test.ts`
- Test: `tests/resolveExplanations.test.ts`

**Interfaces:**
- Consumes: 無
- Produces:
  - `export type QuestionExplanation = { explanation: string; choices: Partial<Record<ChoiceId, string>> }`（定義於 `src/data/explanations/types.ts`）
  - 各 `explanations/<subjectId>.ts` 的 `export const explanations: Record<string, QuestionExplanation>`
  - `resolvePastExamExplanations(past: Question[], explanations: Record<string, QuestionExplanation>): Question[]`

- [ ] **Step 1: 建立型別檔**

建立 `src/data/explanations/types.ts`：

```ts
import type { ChoiceId } from "../types";

/** 一題的手寫詳解與錯誤選項解析。choices 只放錯誤選項，正解不寫。 */
export type QuestionExplanation = {
  explanation: string;
  choices: Partial<Record<ChoiceId, string>>;
};
```

- [ ] **Step 2: 機械式轉換五個 explanations 檔的結構**

現況是 `Record<string, string>`：

```ts
export const explanations: Record<string, string> = {
  "junior-ai-basics-115-1-q01":
    "資料整合（Data Integration）旨在統一不同來源的格式…",
```

轉換為：

```ts
import type { QuestionExplanation } from "./types";

export const explanations: Record<string, QuestionExplanation> = {
  "junior-ai-basics-115-1-q01": {
    explanation: "資料整合（Data Integration）旨在統一不同來源的格式…",
    choices: {},
  },
```

**詳解文字必須逐字保留，這一步只改結構。** 五個檔都要改。用腳本做比手改可靠——寫一支一次性的 Node 腳本讀入舊檔、輸出新格式，跑完後刪掉腳本，並在報告中附上腳本內容。

轉換後立刻 `git diff --stat` 確認只有結構變化：詳解字串本身不應出現在 diff 的刪除行以外的地方。

- [ ] **Step 3: 精簡 `resolveExplanations.ts`**

整個檔案替換為：

```ts
import type { Question } from "./types";
import type { QuestionExplanation } from "./explanations/types";

/**
 * 把手寫的詳解與錯誤選項解析套到真題上。
 * 找不到手寫內容時保留題目自帶的 explanation（學習指引例題的解析即由此而來）。
 */
export const resolvePastExamExplanations = (
  past: Question[],
  explanations: Record<string, QuestionExplanation>,
): Question[] =>
  past.map((q) => {
    const entry = explanations[q.id];
    if (!entry) return q;
    const explanation = entry.explanation.trim().length > 0 ? entry.explanation : q.explanation;
    const hasChoices = Object.keys(entry.choices).length > 0;
    return hasChoices ? { ...q, explanation, choiceExplanations: entry.choices } : { ...q, explanation };
  });
```

`buildFallbackExplanation` 與 `buildChoiceExplanations` 整個刪除。

- [ ] **Step 4: 移除 `render.ts` 對詞彙表的依賴**

刪除 `src/ui/render.ts` 頂端的 `import { composeGlossaryAnalysis } from "../data/choiceAnalysis";`。

把 `fallbackChoiceExplanation` 整個換成：

```ts
const fallbackChoiceExplanation = (q: Question, choice: Choice): string => {
  const correctChoice = q.choices.find((item) => item.id === q.answer);
  const correctText = correctChoice?.text ?? "";
  if (choice.id === q.answer) {
    return "這是本題正解；請搭配下方詳解掌握判斷依據。";
  }
  // 部分題目的詳解本身帶有「（A）…（B）…」的逐項說明，優先抽取該片段。
  const segment = explanationSegmentForChoice(q.explanation, choice.id);
  if (segment) return segment;
  return `此選項不是本題答案；它描述的是「${choice.text}」，但本題正解應判斷為「${q.answer}. ${correctText}」。請對照完整詳解，確認題目情境與關鍵概念的差異。`;
};
```

保留 `explanationSegmentForChoice`——中級三科仍靠它從詳解中抽出逐項說明。

- [ ] **Step 5: 刪除詞彙表機制**

```bash
git rm src/data/glossary.ts src/data/choiceAnalysis.ts tests/choiceAnalysis.test.ts
```

- [ ] **Step 6: 更新 `tests/resolveExplanations.test.ts`**

整個替換為：

```ts
import { describe, it, expect } from "vitest";
import { resolvePastExamExplanations } from "../src/data/resolveExplanations";
import type { Question } from "../src/data/types";

const q = (id: string, explanation = ""): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [{ id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
  answer: "A", explanation, topic: "未分類", difficulty: "中", source: "past-exam",
});

describe("resolvePastExamExplanations", () => {
  it("套用手寫詳解與錯誤選項解析", () => {
    const out = resolvePastExamExplanations(
      [q("q1")],
      { q1: { explanation: "手寫詳解", choices: { B: "B 錯在這", C: "C 錯在這", D: "D 錯在這" } } },
    );
    expect(out[0].explanation).toBe("手寫詳解");
    expect(Object.keys(out[0].choiceExplanations ?? {}).sort()).toEqual(["B", "C", "D"]);
  });

  it("沒有手寫內容時原封不動保留題目自帶的詳解", () => {
    const out = resolvePastExamExplanations([q("q1", "題目自帶解析")], {});
    expect(out[0].explanation).toBe("題目自帶解析");
    expect(out[0].choiceExplanations).toBeUndefined();
  });

  it("手寫詳解為空字串時退回題目自帶的詳解", () => {
    const out = resolvePastExamExplanations(
      [q("q1", "題目自帶解析")],
      { q1: { explanation: "", choices: {} } },
    );
    expect(out[0].explanation).toBe("題目自帶解析");
  });
});
```

- [ ] **Step 7: 執行測試與型別檢查**

Run: `npm run build && npm run test`
Expected: build 無錯誤；測試全綠（`choiceAnalysis.test.ts` 已移除，總數會下降）

- [ ] **Step 8: 提交**

```bash
git add -A
git commit -m "refactor: hand-written explanations replace glossary composition"
```

---

## 內容任務共通流程

Task 2–9 都是內容任務，流程一致：

1. 在 `tests/explanationsCoverage.test.ts` 加入本批的覆蓋率斷言（第一個內容任務要先建立這個檔案，見 Task 2）。
2. 執行測試確認失敗。
3. 依撰寫契約補上該批每一題的 `explanation` 與三個錯誤選項的 `choices`。
4. 執行 `npx vitest run tests/explanationsCoverage.test.ts && npm run build` 確認通過。
5. 提交。

**查看題目內容的方法**（每個內容任務都會用到）：

```bash
npx tsx -e "
import {getQuestions} from './src/data/index.ts';
const s='junior-ai-basics', paper='115-1';
for (const q of getQuestions(s as any).filter(x=>x.id.includes('-'+paper+'-'))) {
  console.log('###', q.id, '| 正解', q.answer);
  console.log(q.prompt);
  q.choices.forEach(c=>console.log('  '+c.id+')', c.text));
  console.log('現有詳解:', q.explanation);
  console.log();
}
"
```

**既有詳解的判斷**：先讀現有詳解，達標就原字保留、只補選項解析；不達標才改寫。報告中要逐題標明「保留／改寫」。

---

### Task 2: junior-ai-basics 115-1（50 題）

**Files:**
- Modify: `src/data/explanations/junior-ai-basics.ts`
- Create: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `QuestionExplanation`（Task 1）
- Produces: `tests/explanationsCoverage.test.ts` 的 `completeCount(subjectId, examCode)` 輔助函式，供後續七批沿用

- [ ] **Step 1: 建立覆蓋率測試檔**

建立 `tests/explanationsCoverage.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { getQuestions } from "../src/data/index";
import type { ChoiceId } from "../src/data/types";

const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];
const TEMPLATE_SIGNATURES = [/依學習指引中「/, /較像是在問該選項本身代表的概念/];

/** 該考卷中「詳解達標且三個錯誤選項解析齊全」的題數。 */
export const completeCount = (subjectId: string, examCode: string): number =>
  getQuestions(subjectId).filter((q) => {
    if (!q.id.includes(`-${examCode}-`)) return false;
    if (q.source !== "past-exam") return false;
    if (q.explanation.trim().length < 60) return false;
    if (TEMPLATE_SIGNATURES.some((re) => re.test(q.explanation))) return false;
    const keys = Object.keys(q.choiceExplanations ?? {}).sort();
    const expected = choiceIds.filter((id) => id !== q.answer).sort();
    return JSON.stringify(keys) === JSON.stringify(expected)
      && expected.every((id) => (q.choiceExplanations as Record<string, string>)[id].trim().length > 0);
  }).length;

describe("原題庫詳解與選項解析覆蓋率", () => {
  it("junior-ai-basics 115-1 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-1")).toBe(50);
  });
});

describe("gen 題目不得被更動", () => {
  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId} 的 gen 題仍保有自己的詳解與選項解析`, () => {
      const gen = getQuestions(subjectId).filter((q) => q.source === "generated");
      expect(gen.length).toBeGreaterThan(0);
      for (const q of gen) {
        expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
        expect(Object.keys(q.choiceExplanations ?? {}).length, q.id).toBeGreaterThan(0);
      }
    });
  }
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — `expected 0 to be 50`（現有題目缺選項解析）

- [ ] **Step 3: 撰寫 50 題的內容**

`junior-ai-basics` 的 115-1 為 `q01`–`q50`。此批**現有詳解為手寫、品質尚可**，主要工作是補三個錯誤選項的解析；詳解僅在不達標（短於 60 字、或只重述答案）時改寫。

依撰寫契約，把每題補成：

```ts
  "junior-ai-basics-115-1-q01": {
    explanation: "資料整合（Data Integration）旨在統一不同來源的格式、欄位定義並整併資料、處理重複資料以提升完整性與分析一致性（A、B、C 皆是）。D 屬於資料保存政策／留存期限管理，與整合目的無關，故選 D。",
    choices: {
      A: "統一格式正是資料整合要解決的核心問題之一，屬於整合目的，不是例外。",
      B: "識別與處理重複資料是整合過程中提升資料品質的標準步驟，同樣屬於整合目的。",
      C: "整併多來源資料就是資料整合的定義本身，最不可能是例外選項。",
    },
  },
```

（此例的正解為 D，故 `choices` 只寫 A、B、C。）

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-ai-basics.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-ai-basics 115-1"
```

---

### Task 3: junior-ai-basics 115-2（50 題）

**Files:**
- Modify: `src/data/explanations/junior-ai-basics.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-ai-basics-115-2-q01` ~ `q50` 的完整條目

**這一批的詳解目前全是樣板產生的零資訊量文字，等於從零寫起——是八批裡最重的一批。**

- [ ] **Step 1: 加入覆蓋率斷言**

在 `describe("原題庫詳解與選項解析覆蓋率")` 內追加：

```ts
  it("junior-ai-basics 115-2 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "115-2")).toBe(50);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — `expected 0 to be 50`

- [ ] **Step 3: 撰寫 50 題的內容**

`junior-ai-basics` 的 115-2 為 `q01`–`q50`，`explanations` 中目前**沒有**這批的任何條目，全部新增。現有畫面上顯示的詳解是樣板產生的，**不要參考它，直接依題目與正解重新撰寫**。

此批涵蓋的主題包括：NLP 應用組合、AI 倫理五大原則的對應、《人工智慧基本法》與金管會規範、大數據 5V、去識別化、Label Encoding、時間序列不適用 k-fold、Batch Normalization、XAI（LIME／SHAP／PDP／顯著性圖）、CLIP 與 DINO、Transformer 上下文窗口、概念漂移與資料漂移、RAG 與微調的取捨。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-ai-basics.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-ai-basics 115-2"
```

---

### Task 4: junior-ai-basics 114-4（50 題）

**Files:**
- Modify: `src/data/explanations/junior-ai-basics.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-ai-basics-114-4-q01` ~ `q50` 的完整條目

- [ ] **Step 1: 加入覆蓋率斷言**

```ts
  it("junior-ai-basics 114-4 全 50 題達標", () => {
    expect(completeCount("junior-ai-basics", "114-4")).toBe(50);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — `expected 0 to be 50`

- [ ] **Step 3: 撰寫 50 題的內容**

此批**現有詳解為手寫、品質尚可**，主要工作是補三個錯誤選項的解析；詳解僅在不達標時改寫。涵蓋主題包括：Human-over-the-loop、特徵交叉、ETL、L1/L2 正則化、偏差—變異權衡、單純貝氏、監理沙盒、Q-Learning 與 DQN、災難性遺忘、剪枝、注意力複雜度、反事實解釋、聯邦學習。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-ai-basics.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-ai-basics 114-4"
```

---

### Task 5: junior-ai-basics guide（40 題）

**Files:**
- Modify: `src/data/explanations/junior-ai-basics.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-ai-basics-guide-q001` ~ `q040` 的完整條目

**注意：** 此批的現有詳解來自官方學習指引的解析區塊（不是樣板）。使用者已決定**一視同仁——不合標就重寫**，接受失去「這是官方說法」的出處。有 20 題短於 60 字，必然需要重寫。

另有兩題已套用勘誤表修正（`guide-q013`、`guide-q017`，見 `scripts/parse-core.ts` 的 `applyStudyGuideErrata`），其詳解結尾帶有「（依初級學習指引勘誤表修正）」——**改寫時必須保留這個註記**，那是資料來源的重要標示。

- [ ] **Step 1: 加入覆蓋率斷言**

```ts
  it("junior-ai-basics guide 全 40 題達標", () => {
    expect(completeCount("junior-ai-basics", "guide")).toBe(40);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL

- [ ] **Step 3: 撰寫 40 題的內容**

id 格式為 `junior-ai-basics-guide-q001`（三位數）。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS。另外確認勘誤註記仍在：

```bash
npx tsx -e "
import {getQuestions} from './src/data/index.ts';
for (const id of ['junior-ai-basics-guide-q013','junior-ai-basics-guide-q017']) {
  const q=getQuestions('junior-ai-basics').find(x=>x.id===id)!;
  console.log(id, '含勘誤註記:', q.explanation.includes('勘誤表修正'));
}
"
```

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-ai-basics.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-ai-basics guide"
```

---

### Task 6: junior-genai 115-1（50 題）

**Files:**
- Modify: `src/data/explanations/junior-genai.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-genai-115-1-q01` ~ `q50` 的完整條目

- [ ] **Step 1: 加入覆蓋率斷言**

```ts
  it("junior-genai 115-1 全 50 題達標", () => {
    expect(completeCount("junior-genai", "115-1")).toBe(50);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — `expected 0 to be 50`

- [ ] **Step 3: 撰寫 50 題的內容**

此批**現有詳解為手寫、品質尚可**，主要工作是補三個錯誤選項的解析。涵蓋主題包括：PEFT／LoRA、MCP 與 RAG 的定位差異、Chunking、上下文工程、Context-aware Agent、Solution Graph、AgentKit、SynthID、TCO 與 ROI、Graph Prompting、思維鏈、同態加密、地端部署。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-genai.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-genai 115-1"
```

---

### Task 7: junior-genai 115-2（50 題）

**Files:**
- Modify: `src/data/explanations/junior-genai.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-genai-115-2-q01` ~ `q50` 的完整條目

**這一批的詳解目前全是樣板產生的零資訊量文字，等於從零寫起。**

- [ ] **Step 1: 加入覆蓋率斷言**

```ts
  it("junior-genai 115-2 全 50 題達標", () => {
    expect(completeCount("junior-genai", "115-2")).toBe(50);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — `expected 0 to be 50`

- [ ] **Step 3: 撰寫 50 題的內容**

`explanations` 中目前**沒有**這批的任何條目，全部新增。現有畫面上顯示的詳解是樣板產生的，**不要參考它**。

涵蓋主題包括：Low-Code 的 RAG 元件、條件分支、Chat History、Token 與計費、供應商鎖定、Webhook、AutoML、CLIP 餘弦相似度、Vibe Coding、Agentic Coding、RFT 與 SFT、ReAct、Multi-Agent 上下文同步、函數呼叫、MMLU、提示詞注入（直接與間接）、差分隱私、黑箱責任歸屬。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-genai.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-genai 115-2"
```

---

### Task 8: junior-genai 114-4（50 題）

**Files:**
- Modify: `src/data/explanations/junior-genai.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-genai-114-4-q01` ~ `q50` 的完整條目

- [ ] **Step 1: 加入覆蓋率斷言**

```ts
  it("junior-genai 114-4 全 50 題達標", () => {
    expect(completeCount("junior-genai", "114-4")).toBe(50);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — `expected 0 to be 50`

- [ ] **Step 3: 撰寫 50 題的內容**

此批**現有詳解為手寫、品質尚可**，主要工作是補三個錯誤選項的解析。涵蓋主題包括：Low Code 的模型概念、聯邦學習、APE 與 Graph Prompting、MCP 運作流程、A2A 架構、上下文工程、GPT-OSS 本地部署、GitHub Copilot、向量檢索與 API 調用、控制變量、知識蒸餾、CoT 與 ToT、Guardrails、多向量檢索器。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-genai.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-genai 114-4"
```

---

### Task 9: junior-genai guide（29 題）

**Files:**
- Modify: `src/data/explanations/junior-genai.ts`
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: `completeCount`（Task 2）
- Produces: `junior-genai-guide-q001` ~ `q029` 的完整條目

**注意：** 此批的現有詳解來自官方學習指引的解析區塊。使用者已決定一視同仁——不合標就重寫。有 15 題短於 60 字。

- [ ] **Step 1: 加入覆蓋率斷言**

```ts
  it("junior-genai guide 全 29 題達標", () => {
    expect(completeCount("junior-genai", "guide")).toBe(29);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL

- [ ] **Step 3: 撰寫 29 題的內容**

id 格式為 `junior-genai-guide-q001`（三位數）。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/explanations/junior-genai.ts tests/explanationsCoverage.test.ts
git commit -m "content: explanations and choice analysis for junior-genai guide"
```

---

### Task 10: gen 題的選項解析（66 題）

**Files:**
- Modify: `src/data/generated/junior-ai-basics.ts`（32 題）、`src/data/generated/junior-genai.ts`（34 題）
- Test: `tests/explanationsCoverage.test.ts`

**Interfaces:**
- Consumes: 無
- Produces: 兩科 gen 題目的 `choiceExplanations` 欄位

**背景（此任務為計畫執行中新增）：** 計畫原先假設 `gen-*` 題目已自帶選項解析，因此將其排除在範圍外。實際查證後發現 `src/data/generated/*.ts` 的 `choiceExplanations` 出現 0 次——這 66 題**完全沒有選項解析**。它們的**詳解是手寫的、86–129 字、確實合標**，因此本任務**只補選項解析、不動詳解**。

若維持原範圍，這 66 題會是初級題庫中唯一沒有選項解析的一群，正好違背本計畫追求的一致性。使用者已裁定納入範圍。

- [ ] **Step 1: 把 gen 的斷言改為完整版**

`tests/explanationsCoverage.test.ts` 的 `describe("gen 題目不得被更動")` 目前斷言 gen 題有非空 `choiceExplanations`——那在本任務完成前不成立。整個 describe 區塊替換為：

```ts
describe("gen 題目", () => {
  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId} 的 gen 題有達標詳解與三個錯誤選項解析`, () => {
      const gen = getQuestions(subjectId).filter((q) => q.source === "generated");
      expect(gen.length).toBeGreaterThan(0);
      for (const q of gen) {
        expect(q.explanation.trim().length, `${q.id} 詳解過短`).toBeGreaterThanOrEqual(60);
        const keys = Object.keys(q.choiceExplanations ?? {}).sort();
        const expected = choiceIds.filter((id) => id !== q.answer).sort();
        expect(keys, `${q.id} 選項解析不齊`).toEqual(expected);
        for (const id of expected) {
          expect((q.choiceExplanations as Record<string, string>)[id].trim().length, `${q.id} ${id}`).toBeGreaterThan(0);
        }
      }
    });
  }
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/explanationsCoverage.test.ts`
Expected: FAIL — gen 題目缺 `choiceExplanations`

- [ ] **Step 3: 為 66 題補上選項解析**

`src/data/generated/*.ts` 的每一題是一個 `Question` 物件字面量。在 `explanation` 之後加入 `choiceExplanations`，只寫三個錯誤選項：

```ts
    explanation: "……",
    choiceExplanations: {
      A: "…（為何在這一題錯）",
      C: "…",
      D: "…",
    },
```

（此例正解為 B，故不寫 B。）

**詳解一字不改。** 只新增 `choiceExplanations` 欄位。改完用 `git diff` 確認刪除行不含任何 `explanation:` 的內容。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/explanationsCoverage.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/generated/junior-ai-basics.ts src/data/generated/junior-genai.ts tests/explanationsCoverage.test.ts
git commit -m "content: choice analysis for junior generated questions"
```

---

### Task 11: 最終驗證與文件

**Files:**
- Modify: `tests/explanationsCoverage.test.ts`
- Create: `docs/coverage/explanations-overhaul.md`
- Modify: `AGENTS.md`、`CLAUDE.md`、`docs/architecture.md`

**Interfaces:**
- Consumes: 全部前置任務
- Produces: 無

- [ ] **Step 1: 加入整體品質測試**

在 `tests/explanationsCoverage.test.ts` 末尾追加：

```ts
describe("原題庫詳解整體品質", () => {
  const simplified = /[价见关数据网络术应产业华与为这个们时会学实现发后从员处复传组织结构认识记录变换优转联检测试验证类别题库统选对确语问资银风险规则训练输护议备设习级导维监预译签]/;

  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId}：所有真題都有達標詳解與三個錯誤選項解析`, () => {
      // gen 題目自 Task 10 起同樣具備選項解析，因此這裡涵蓋整個題庫而非僅真題。
      for (const q of getQuestions(subjectId)) {
        expect(q.explanation.trim().length, `${q.id} 詳解過短`).toBeGreaterThanOrEqual(60);
        const keys = Object.keys(q.choiceExplanations ?? {}).sort();
        const expected = ["A", "B", "C", "D"].filter((id) => id !== q.answer).sort();
        expect(keys, `${q.id} 選項解析不齊`).toEqual(expected);
      }
    });

    it(`${subjectId}：不得殘留樣板句型`, () => {
      for (const q of getQuestions(subjectId)) {
        expect(q.explanation, q.id).not.toMatch(/依學習指引中「/);
        expect(q.explanation, q.id).not.toMatch(/較像是在問該選項本身代表的概念/);
        for (const text of Object.values(q.choiceExplanations ?? {})) {
          expect(text, q.id).not.toMatch(/較適用於題目明確要求該概念/);
        }
      }
    });

    it(`${subjectId}：詳解與選項解析不得含簡體字`, () => {
      for (const q of getQuestions(subjectId)) {
        expect(q.explanation, `${q.id} explanation`).not.toMatch(simplified);
        for (const [key, text] of Object.entries(q.choiceExplanations ?? {})) {
          expect(text, `${q.id} ${key}`).not.toMatch(simplified);
        }
      }
    });
  }

  it("原題庫題數未變", () => {
    expect(getQuestions("junior-ai-basics")).toHaveLength(222);
    expect(getQuestions("junior-genai")).toHaveLength(213);
  });
});
```

- [ ] **Step 2: 執行完整測試**

Run: `npm run test && npm run build`
Expected: 全綠。若有題目不達標，回到對應的 explanations 檔補齊後再跑。

- [ ] **Step 3: 寫覆蓋文件**

建立 `docs/coverage/explanations-overhaul.md`，內容包含：這次改寫的目的與範圍（369 題真題）、改寫前的量測數據（選項解析缺 136／158 題、115-2 的 100 題詳解為樣板）、各批次的「保留／改寫」統計、被刪除的三套機制與理由、以及「內容為 LLM 產出／改寫、尚未人工事實查核」的複審狀態與方法（逐題核對詳解論證的選項與 `answer` 是否一致）。

各批統計用這段指令產生後填入：

```bash
npx tsx -e "
import {getQuestions} from './src/data/index.ts';
for (const s of ['junior-ai-basics','junior-genai']) {
  const past=getQuestions(s as any).filter(q=>q.source==='past-exam');
  const lens=past.map(q=>q.explanation.length).sort((a,b)=>a-b);
  console.log(s, '真題', past.length, '｜詳解長度 中位數', lens[Math.floor(lens.length/2)], '最短', lens[0], '最長', lens[lens.length-1]);
}
"
```

- [ ] **Step 4: 更新三份不變式文件**

- `docs/architecture.md`：更新 `src/data/` 表格——移除 `glossary.ts`、`choiceAnalysis.ts` 兩列，並把 `explanations/<subjectId>.ts` 的職責改為「手寫詳解與錯誤選項解析（`QuestionExplanation`）」。
- `AGENTS.md`：更新「題庫資料管線」段落——手寫詳解的檔案現在同時承載選項解析；並記錄「選項解析一律手寫、不再由詞彙表自動組合」這條新不變式。
另外：刪除 `tests/data.test.ts` 中 Task 1 為了讓套件變綠而加入的 `contentPending` 過濾器（它會永久放行 115-2 的空詳解，而本計畫已把那 100 題補齊）。

- `CLAUDE.md`：在「大局架構」的三來源說明中，把 `explanations/<subjectId>.ts` 的描述改為同時含詳解與選項解析；在「容易踩到的點」加一則——`gen-*` 的 66 題詳解與選項解析定義在 `generated/*.ts` 的題目物件內，**不經** `explanations/*.ts`；改初級說明內容時兩處都要顧到。

- [ ] **Step 5: 瀏覽器實測**

Run: `npm run dev`，開 `http://127.0.0.1:5173/ipas-aiap-cert/`

逐項確認：
1. 初級兩科的刷題，隨機翻幾題（含 115-2 的題目）——詳解有實質內容，不再是題目文字重排。
2. 每題揭曉後都有「選項解析」區塊，三個錯誤選項各有一句針對性說明，正解顯示「這是本題正解」。
3. `gen-*` 的題目（junior-ai-basics 第 191 題之後）解析與先前相同。
4. 中級三科的刷題仍可正常顯示詳解（它們沒有手寫選項解析，應走 `explanationSegmentForChoice` 或通用 fallback，不得空白或報錯）。
5. 模擬考試的檢討頁同樣正常。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "docs: explanations overhaul coverage notes and project invariants"
```

---

## 完成後

依 `superpowers:finishing-a-development-branch` 收尾：跑完整測試 → 詢問整合方式。
