# 初級科目2（junior-genai）詳解 + 新題 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為 junior-genai 全部 100 題真題補齊中文詳解，新增第一批 24 題新題（最終目標 100，分批成長），並產出一份不上線的複審工作表。

**Architecture:** 沿用既有「三來源合併」設計——真題 JSON 不動，詳解寫入 `explanations/junior-genai.ts`（id→文字 map），新題寫入 `generated/junior-genai.ts`（Question 陣列）。完整性由 `tests/data.test.ts` 的新測試守護（每題真題詳解非空、新題數與編號規則）。複審標註只存在於 `docs/superpowers/review/junior-genai-review.md`，不進 bundle。

**Tech Stack:** Vite + TypeScript、Vitest、純前端靜態站。

**參考：** 內容 rubric、信心度定義、樣本詳解/新題、更新流程，全在 spec `docs/superpowers/specs/2026-06-01-junior-genai-explanations-design.md`。撰寫內容時務必對照該 spec。

---

## 檔案結構

| 檔案 | 動作 | 職責 |
|---|---|---|
| `tests/data.test.ts` | 修改（附加一個 describe 區塊） | junior-genai 完整性：真題詳解非空、新題數 ≥10、新題 id 規則與唯一 |
| `src/data/explanations/junior-genai.ts` | 修改（填入 100 條 map） | 真題 id → 中文詳解 |
| `src/data/generated/junior-genai.ts` | 修改（填入 24 題） | 第一批新題（B1） |
| `docs/superpowers/review/junior-genai-review.md` | 建立 | 複審工作表（不上線） |

不碰：`past-exams/junior-genai.json`、`src/data/junior-genai.ts`（合併層已正確）、`src/data/types.ts`、UI、其他科目。

---

## Task 1: 完整性測試（先紅）

**Files:**
- Modify: `tests/data.test.ts`（在檔案末端、最外層 `});` 之後附加新 describe）

- [ ] **Step 1: 在 `tests/data.test.ts` 末端附加 junior-genai 完整性測試**

把以下區塊加到檔案最後（既有 `describe("題庫完整性", …)` 區塊之後，最外層）：

```ts
describe("junior-genai 內容完整性", () => {
  const questions = getQuestions("junior-genai");
  const past = questions.filter((q) => q.source === "past-exam");
  const generated = questions.filter((q) => q.source === "generated");

  it("100 題真題詳解皆非空", () => {
    expect(past.length).toBe(100);
    const missing = past.filter((q) => q.explanation.trim().length === 0);
    expect(missing.map((q) => q.id)).toEqual([]);
  });

  it("新題數 ≥10", () => {
    expect(generated.length).toBeGreaterThanOrEqual(10);
  });

  it("新題 id 符合 junior-genai-gen-qNNN 規則且唯一", () => {
    const ids = generated.map((q) => q.id);
    for (const id of ids) {
      expect(id).toMatch(/^junior-genai-gen-q\d{3}$/);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("新題 topic 為三個官方主題之一（非未分類）", () => {
    const allowed = new Set([
      "No code / Low code 概念",
      "生成式 AI 應用領域與工具使用",
      "生成式 AI 導入評估規劃",
    ]);
    for (const q of generated) {
      expect(allowed.has(q.topic)).toBe(true);
    }
  });
});
```

`getQuestions` 已在檔案頂部 import（`import { getQuestions } from "../src/data/index";`），無需再加。

- [ ] **Step 2: 跑測試確認失敗（紅）**

Run: `npx vitest run tests/data.test.ts -t "junior-genai 內容完整性"`
Expected: FAIL。「100 題真題詳解皆非空」失敗（目前 explanations 為空，100 題詳解全為 ""）；「新題數 ≥10」失敗（目前 generated 為空陣列）。

- [ ] **Step 3: Commit（紅燈測試入庫）**

```bash
git add tests/data.test.ts
git commit -m "test: junior-genai content completeness (red)"
```

---

## Task 2: 100 題真題詳解

逐題撰寫詳解，寫入 `src/data/explanations/junior-genai.ts` 的 map。**內容規則一律依 spec**：解釋官方答案為何對、其他選項為何錯，錨定對應 L 章節，不引入無法驗證的外部事實；不確定/題意模糊/選項殘缺者標低信心（信心度記在 Task 4 的工作表，不寫進此檔文字）。文風與長度比照 spec 的「樣本詳解 A/B/C」與既有 `explanations/junior-ai-basics.ts`。

**取得題目來源**：每題的題幹、選項、正解（`answer`）、`sourceRef` 皆在 `src/data/past-exams/junior-genai.json`。撰寫前先讀該題，依其正解寫詳解——**不得改動 JSON，也不得質疑官方答案**（如認為答案有疑義，照官方答案寫詳解，並在工作表標低信心＋註明疑點）。

**Files:**
- Modify: `src/data/explanations/junior-genai.ts`

- [ ] **Step 1: 讀 114年第4梯次 50 題並撰寫詳解**

讀 `src/data/past-exams/junior-genai.json` 中 id 前綴 `junior-genai-114-4-q01` … `-q50` 的 50 題。為每題寫一條詳解，填入 map：

```ts
// questionId -> 中文詳解。
export const explanations: Record<string, string> = {
  "junior-genai-114-4-q01":
    "在 Low Code 平台中，「模型（Model）」是用來抽象描述資料結構、業務流程與介面邏輯的核心元素，直接影響應用的設計與後續維護（B）。它不只是視覺輔助（A），也不受限於傳統 UML、缺乏延展性（C），更未被自動產碼全面取代（D）——自動產碼正是以模型為輸入。",
  "junior-genai-114-4-q02":
    "需求是跨部門/機構運用大量敏感文本、在保護隱私下持續優化模型並降低外洩風險，最適合的是聯邦學習（Federated Learning，D）：資料留在各端、只交換模型更新。同態加密（A）、安全多方計算（B）、零知識證明（C）皆為隱私技術，但非「讓模型在分散資料上持續訓練」的整體框架，故 D 最貼合情境。",
  // … 續寫 q03 … q50（每題一條，key 為該題 id，value 為詳解字串）
};
```

- [ ] **Step 2: 續寫 115年第一次 50 題詳解**

在同一個 map 接著加入 id 前綴 `junior-genai-115-1-q01` … `-q50` 的 50 題詳解，例如第 1 題（答案 A）：

```ts
  "junior-genai-115-1-q01":
    "題目要在「模型架構與推論設定皆未調整」前提下優先降低偏差風險。模型偏差多源於訓練資料的代表性不足，故應先重新檢視訓練資料的樣本分布與代表性（A）。限制只顯示高銷量商品（B）會加劇熱門偏差；縮小參數（C）與提高隨機性（D）皆未觸及偏差根源，反可能損害推薦品質。",
```

map 最終應有 **100 個 key**，涵蓋全部 100 題真題 id。

- [ ] **Step 3: 跑型別與完整性測試**

Run: `npx vitest run tests/data.test.ts -t "junior-genai 內容完整性"`
Expected: 「100 題真題詳解皆非空」PASS。「新題數 ≥10」仍 FAIL（Task 3 處理）。

若 PASS 數不符，測試會列出 `missing` 的 id，補上對應詳解再跑。

- [ ] **Step 4: Commit**

```bash
git add src/data/explanations/junior-genai.ts
git commit -m "content: junior-genai 100 past-exam explanations"
```

---

## Task 3: 第一批 24 題新題（B1）

依 spec 撰寫 24 題新題，L121/L122/L123 各 8 題，難度（易/中/難）混合。每題附正解與詳解，`source: "generated"`，`subjectId: "junior-genai"`，id 由 `junior-genai-gen-q001` 連號至 `q024`。`topic` 用三個官方主題全名字串（見下表），不可用「未分類」。

| L 章節 | `topic` 字串（須完全一致） |
|---|---|
| L121 | `No code / Low code 概念` |
| L122 | `生成式 AI 應用領域與工具使用` |
| L123 | `生成式 AI 導入評估規劃` |

**Files:**
- Modify: `src/data/generated/junior-genai.ts`

- [ ] **Step 1: 寫入 24 題新題陣列**

比照 spec「樣本新題」與既有 `generated/junior-ai-basics.ts` 格式。檔案結構：

```ts
import type { Question } from "../types";

export const generated: Question[] = [
  {
    id: "junior-genai-gen-q001",
    subjectId: "junior-genai",
    prompt:
      "在使用大型語言模型處理企業內部問答時，為了讓回答能引用最新且特定的內部文件、降低幻覺（Hallucination），下列哪一種做法最直接有效？",
    choices: [
      { id: "A", text: "提高生成溫度（temperature）以增加回答多樣性" },
      { id: "B", text: "導入檢索增強生成（RAG），先檢索相關文件再據以生成回答" },
      { id: "C", text: "將所有內部文件貼進系統提示詞，每次都完整輸入" },
      { id: "D", text: "改用參數更少的模型以加快回應速度" },
    ],
    answer: "B",
    explanation:
      "要讓回答引用最新且特定的內部文件並降低幻覺，最直接的是檢索增強生成（RAG，B）：先以使用者問題檢索相關文件，再讓模型據檢索內容生成。提高溫度（A）反而增加不確定性；把全部文件塞進提示詞（C）受上下文長度限制且成本高、不可擴充；換更小模型（D）與正確性無關。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
  },
  // … 續寫 gen-q002 … gen-q024
  //    L121 共 8 題、L122 共 8 題、L123 共 8 題；難度混合；正解分布勿全部押同一字母
];
```

撰寫要求：
- 每題四個選項 A/B/C/D，只有一個正解；誘答選項要合理但明確可判錯。
- 正解字母分布盡量平均（避免 24 題答案全是 B）。
- 詳解同樣解釋正解為何對、其他為何錯，錨定 L 章節。
- 內容正確性以人工複審為關卡；不確定者在 Task 4 工作表標低信心。

- [ ] **Step 2: 跑完整性測試（應全綠）**

Run: `npx vitest run tests/data.test.ts -t "junior-genai 內容完整性"`
Expected: 四項全 PASS（真題詳解非空、新題 ≥10、id 規則唯一、topic 為官方主題）。

- [ ] **Step 3: 跑全套資料測試（格式不變式）**

Run: `npx vitest run tests/data.test.ts`
Expected: 全 PASS。`tests/data.test.ts` 既有「每題四選項、答案為A-D、id唯一、subjectId相符」會自動涵蓋這 24 題新題。

- [ ] **Step 4: Commit**

```bash
git add src/data/generated/junior-genai.ts
git commit -m "content: junior-genai new questions batch B1 (24)"
```

---

## Task 4: 複審工作表（不上線）

建立 `docs/superpowers/review/junior-genai-review.md`，依 spec「複審工作表規格」。涵蓋 100 題真題詳解列 + 24 題新題列，依信心度 `低→中→高` 排序。

**Files:**
- Create: `docs/superpowers/review/junior-genai-review.md`

- [ ] **Step 1: 寫工作表骨架與進度行**

```markdown
# junior-genai 複審工作表（不上線）

> 詳解全文＝`src/data/explanations/junior-genai.ts` 與 `generated/junior-genai.ts` 同一份文字。
> 複審改這裡 → 同步回 `.ts`。狀態：待複審 / 已確認 / 需改。
> **新題進度 24 / 100**

| id | 年次題號 | 答案 | L章節 | 信心 | 依據(一句) | 詳解全文 | 狀態 | 批次 | 依據資料 |
|----|---------|-----|-------|-----|-----------|---------|------|------|---------|
```

- [ ] **Step 2: 逐列填入 124 列並依信心度排序**

每一題（100 真題 + 24 新題）一列。真題列 `批次`/`依據資料` 留空；新題列 `年次題號` 填「新題」、`批次` 填 `B1`、`依據資料` 填撰題依據。整體依 `信心` 欄 `低→中→高` 排序，讓低信心題置頂。`詳解全文` 與 `.ts` 內文字逐字一致。

範例列（真題低信心、真題高信心、新題）：

```markdown
| junior-genai-114-4-q45 | 114年第四梯次 第45題 | C | L123 | 低 | 選項文字含縮寫、題意需推論，建議複審 | （該題詳解全文） | 待複審 |  |  |
| junior-genai-115-1-q01 | 115年第一次 第1題 | A | L123 | 高 | 偏差治理優先檢視資料代表性 | （該題詳解全文） | 待複審 |  |  |
| junior-genai-gen-q001 | 新題 | B | L122 | 高 | RAG 為降低幻覺的標準做法 | （該題詳解全文） | 待複審 | B1 | RAG（L122 提示工程/工具整合） |
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/review/junior-genai-review.md
git commit -m "docs: junior-genai review worksheet (not shipped)"
```

---

## Task 5: 全量驗證 + 瀏覽器實測

**Files:** 無（驗證為主）

- [ ] **Step 1: 型別檢查 + 打包**

Run: `npm run build`
Expected: tsc 無錯、vite build 產生 dist/，無 TS 錯誤。

- [ ] **Step 2: 全套測試**

Run: `npm run test`
Expected: 全部測試 PASS（含新加的 junior-genai 完整性與既有 50+ 測試）。

- [ ] **Step 3: 瀏覽器實測**

Run: `npm run dev`，開 `http://127.0.0.1:5173/ipas-aiap-cert/`。
驗證：
- 進入「初級 → 科目2 生成式 AI 應用與規劃 → 刷題練習」。
- 任一題作答後**揭曉處顯示詳解**（非空白）。
- 刷題題數標籤顯示為 **124**（100 真題 + 24 新題）。
- 翻到題庫尾端可見新題（gen-q…），可正常作答並揭曉。

如有任何 UI 異常（揭曉空白、題數不符），回到對應 Task 修正後重跑 Step 1–2。

- [ ] **Step 4: 提交工作表複審（人工關卡）**

把 `docs/superpowers/review/junior-genai-review.md` 交使用者複審。依回饋修正旗標題：改 `.ts` 對應條目 + 工作表同列，工作表 `狀態` 更新為「已確認/需改」。每輪修正後重跑 `npm run build` 與 `npm run test`。

---

## Task 6: 合併與部署

**Files:** 無

- [ ] **Step 1: 確認分支與綠燈**

Run: `git status` 確認都已提交；`npm run build && npm run test` 再次全綠。

- [ ] **Step 2: 合併到 main 並推送（經使用者確認後）**

```bash
git checkout main
git merge --no-ff content/junior-genai-explanations -m "Merge: junior-genai explanations + new questions (content phase 2)"
git push origin main
```

推送 main 後 `.github/workflows/deploy.yml` 自動部署到 GitHub Pages。

- [ ] **Step 3: 更新回顧待辦（選用）**

在 `docs/retrospective-2026-06-01.md` 的待辦清單把「內容階段 2+」標記為：junior-genai 詳解完成、新題 24/100 進行中（分批成長）。Commit：

```bash
git add docs/retrospective-2026-06-01.md
git commit -m "docs: mark junior-genai content phase 2 progress"
```

---

## Self-Review 紀錄

- **Spec 覆蓋**：100 詳解（Task 2）、24 新題 L 各 8（Task 3）、工作表低信心置頂＋追蹤欄（Task 4）、完整性測試（Task 1）、build/test/瀏覽器實測（Task 5）、合併部署（Task 6）、更新流程（spec 已含，新題 id 連號規則於 Task 3 落實）。皆有對應任務。
- **Placeholder**：內容（100 詳解、24 新題本體）為執行階段依 spec rubric 產生的交付物，非可預寫的程式邏輯；測試碼、檔案骨架、topic 字串、id 規則均為完整可執行內容。
- **型別一致**：`topic` 三個官方字串在 Task 1 測試與 Task 3 寫入處一致；id 規則 `^junior-genai-gen-q\d{3}$` 與 Task 3 連號一致；`getQuestions`/`source` 欄位與 `src/data/index.ts`、`types.ts` 相符。
