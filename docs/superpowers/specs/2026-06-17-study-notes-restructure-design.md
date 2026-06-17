# 學習筆記排版重構 — 設計文件

- 日期：2026-06-17
- 範圍：五科學習指引整理（「學習指引整理 N 則重點」）的內容排版全面重構。

## 動機

學習筆記（`src/data/studyNotes.ts`）由 `scripts/generate-study-notes.ts` 從 pdftotext 產生的 `docs/markdown/*.md` 機械擷取，每個碎片直接平鋪為一個 `<li>`。此流程造成六類排版缺陷：

1. **句子被分頁切斷**：跨 PDF 分頁／分欄的句子被拆成兩則重點（例：`…常應用於市場預測、` ｜ `風險評估等領域。`）。
2. **文字牆**：無條列標記時，解析器在 220 字處硬切句子中段；巢狀列舉（`A.` → `(1)` → 條列）被壓平成單一巨大條目。
3. **列表標記黏在文字尾端**：`…新的契機。1.`（下一項的 `1.` 被併入）。
4. **重複字**（pdftotext 產物）：`機率分佈的兩個重要數值機率分佈的兩個重要數值`。
5. **亂碼數學**：`𝐸(X) = ∑𝑥𝑖𝑃(𝑥𝑖)`、`f (x)=e-x`（Unicode 數學字母 + 失去版面）。
6. **毫無層次**：原文有清楚階層（`3.x` 標題 → `1./2.` → `(1)(2)` → `A.B.C.` → 條列），卻被壓平成無法區分的單層清單。

「排版很糟」有兩條獨立軸：文字髒（1–5）與結構失（6）。本案兩者都修。

## 決策（已與使用者確認）

- **介入程度**：深度重構，由 LLM 改寫。
- **內容量**：完整保留所有知識點，只重整結構，不做摘要刪減。
- **資料結構**：結構化層次 JSON，巢狀清單渲染，全程 `escapeHtml`，不新增依賴。
- **「N 則重點」計數**：改為**葉節點總數**（數字會與現行平面計數不同，可接受）。
- **舊平鋪邏輯**：移除，不保留為 fallback。

## 範圍

五科共約 40 節（junior-ai-basics 4、junior-genai 3、senior-ai-tech 9、senior-bigdata 13、senior-ml ~11，依 `generate-study-notes.ts` 的 `guides` 對應表為準）。每節為一個重構單位。

## 設計

### 1. 資料模型（`src/data/types.ts`）

把平面 `details: string[]` 換成層次樹：

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

- `StudyNotesBySubject = Record<string, Record<string, StudyNoteSection[]>>` 維持不變（值型別內部改變）。
- `StudyTopic.notes?: StudyNoteSection[]` 維持不變。

### 2. 渲染器（`src/ui/render.ts` 的 `renderStudyNotes`）

- 遞迴產生巢狀 `<ul><li>`；每個 `text` 一律 `escapeHtml`。
- 「N 則重點」計數 = 所有 section 的**葉節點**（無 `children` 或 `children` 為空者）數量加總。
- 每節 TTS 按鈕（`data-tts-section`）保留；朗讀文字 = 深度優先串接該節所有 `text` 節點（以全形空白或標點分隔）。
- 不新增 markdown 解析器或任何依賴。

### 3. 產生流程（兩階段）

沿用專案「機械擷取 → 人工/LLM 內容層」哲學（如 `past-exams` JSON vs `explanations`）。

- **機械切片**：重用 `findSectionStart`／`findSectionEnd` 邏輯，從對應 `docs/markdown/*.md` 切出每一節（由 section number 定位起點、下一個 `[3-6].\d` 標題或「附件／參考書目」定終點）的原始行。此步維持可重跑，作為複審對照來源。
- **LLM 重構**（一次性、逐節）：把每節原始切片改寫為 `StudyNoteSection`：
  - 接回被分頁／分欄切斷的句子。
  - 移除重複字等 pdftotext 產物。
  - 數學正規化為可讀 Unicode 純文字（例 `E(X) = Σ xᵢ·P(xᵢ)`），**不引入數學引擎**。
  - 依原文 `1./2.`、`(1)(2)`、`A.B.C.`、條列標記重建 `items`/`children` 階層。
  - **忠實保留所有知識點，不摘要、不刪減、不新增原文沒有的內容。**
  - 結果寫進 `src/data/studyNotes.ts`（機械＋LLM 產物，標頭註明）。
- 移除 `generate-study-notes.ts` 中產生平面 `details` 的邏輯（`startsNewDetail`、`cleanDetail`、`pushCurrent`、平面版 `collectSection`）。保留並重用切片定位邏輯（`findSectionStart`/`findSectionEnd`/`isNoise`/`isSectionHeading`/`escapeRegExp`/`normalizeLine`）供切片階段使用。

### 4. 複審流程

所有 ~40 節皆 LLM 改寫，內容正確性需人工複審（專案規則：僅格式自動測試）。機械切片提供逐節對照原始指引的依據。完成後存一條 memory 提醒複審，並於回報中列出每節的改寫摘要與對照來源檔。

## 測試

- 型別：`studyNotes.ts` 符合新 `StudyNoteSection`（`npm run build` 的 tsc 把關）。
- `renderStudyNotes` 單元測試：
  - 巢狀 `items`/`children` 產生巢狀 `<ul>`。
  - 每個 `text` 經 `escapeHtml`（含特殊字元的節點不外洩 HTML）。
  - 葉節點計數正確。
  - 空 `notes` 回傳空字串（維持現狀）。
- TTS 串接：深度優先串接所有 `text`，順序正確。
- 既有測試（含 `tests/studyGuide.test.ts`、`tests/render.test.ts`）不得退化；若其斷言依賴舊 `details` 形狀，一併更新為新模型。
- 內容正確性不做自動測試，靠人工複審（符合專案規則）。

## 風險與限制

- LLM 改寫可能誤改原意或漏點；以「忠實重構、不摘要」降低風險，並以人工複審把關；機械切片保留供逐節對照。
- 重跑無法重現（LLM 產物）；與 `explanations/`、`generated/` 同樣對待，保留 `guides` 來源對應表以利再複審。
- 數學僅正規化為可讀純文字，不保證完美排版（無數學引擎為刻意取捨）。
- 「N 則重點」數字會變動（改為葉節點計數），屬預期行為。
