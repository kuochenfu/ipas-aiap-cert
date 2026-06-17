# 選項解析詞彙表查詢 — 設計文件

- 日期：2026-06-17
- 範圍：刷題練習的「選項解析」區塊，使其能逐項說明各選項（含非答案選項）的實際用途。

## 動機

刷題檢討畫面的「選項解析」目前對非答案選項顯示通用句（「此選項不是本題答案；它描述的是…」），無法說明該選項代表的系統／概念實際在做什麼。原因是：用途屬於科目知識，未存於任何資料中，模板無從得知。

範例題：`junior-ai-basics-115-1-q02`（智慧城市感測題，正解 D 感知器網路）。此題有手寫主詳解，但詳解無 `A/B/C/D` 標記，故每個錯誤選項都落入 `render.ts` 的通用 fallback。

## 目標與非目標

**目標**
- 刷題的「選項解析」對「具名概念型」選項顯示其用途，並附 2 個範例。
- 五科題庫全部自動受惠（查表於渲染時套用）。
- 錯誤選項的用途說明須對照正解（維持「故不選 X」的對比語氣）。

**非目標**
- 不改動模擬測驗。模擬測驗作答（`renderExamPaper`）與檢討（`renderExamReview`）皆不含選項解析區塊，現狀已天然限定；本案不在其中加入。
- 不為「整句型」選項（如「為整張圖片指定一個標籤」）硬湊用途；查無詞條者維持現有通用句。
- 不重跑或修改 `past-exams/*.json`（機器產物）。

## 既有架構回顧

- 「選項解析」由 `src/ui/render.ts` 的 `renderChoiceExplanations(q)` 渲染，僅在 `renderQuestion` 內被呼叫；`renderQuestion` 只用於刷題（作答揭曉與檢討）。模擬測驗不經此路徑。
- 每個選項的文字決定於：`q.choiceExplanations?.[id] ?? fallbackChoiceExplanation(q, choice)`。
- 通用句來自兩處：
  1. `src/data/resolveExplanations.ts` 的 `buildChoiceExplanations`：僅在題目詳解為空時，於資料合併階段預先產生 `q.choiceExplanations`。
  2. `src/ui/render.ts` 的 `fallbackChoiceExplanation`：詳解非空但無 `A/B/C/D` 標記時，於渲染階段產生。
- 既有的 `explanationSegmentForChoice`（從詳解抽取 ABCD 段落）維持優先：詳解本身有標記時仍用詳解內容，詞彙表只補在「以前顯示通用句」的空缺。

## 設計

### 1. 資料：`src/data/glossary.ts`

手寫「名詞 → 用途 + 範例」對照表。這是唯一需人工複審之處，且一個詞只審一次（非一題審一次），複審面從上千題降為數十至上百詞。

```ts
export type GlossaryEntry = {
  /** 一句話說明此概念的用途 */
  purpose: string;
  /** 剛好兩個具體範例 */
  examples: [string, string];
};

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
  // …其餘高頻名詞
};
```

- 以**中文名詞**為 key；選項括號內的英文（如「（Expert System）」）於比對時去除。
- `examples` 為 `[string, string]` tuple，型別層即強制剛好兩個範例。
- 內容正確性需人工複審，與 `generated/*` 同等對待。

### 2. 比對：`src/data/choiceAnalysis.ts`（新模組，純函式）

```ts
export const glossaryPurpose = (choiceText: string): GlossaryEntry | undefined => { … }
```

- 正規化流程：去除括號（全形「（）」與半形「()」）內英文註解、去除前後空白，得到中文名詞，再查表。
- 命中回傳 `GlossaryEntry`，未命中回傳 `undefined`。
- 純函式、不碰 DOM，可獨立單元測試。

### 3. 接入兩個 fallback 路徑

兩處通用句產生器都先呼叫 `glossaryPurpose`：

- **錯誤選項、命中**：
  `決策支援系統：彙整資料並提供分析模型，輔助管理者做半結構化決策（例如：銷售儀表板、庫存補貨建議系統）。本題情境指向「<正解文字>」，故不選 B。`
- **正解、命中**：
  `感知器網路：由大量分散感測器即時採集環境與設備資料（例如：空品監測站、垃圾桶滿溢偵測）—— 這是本題正解。`
- **未命中**：維持現有通用句（仍對照答案）。

組句邏輯集中於 `choiceAnalysis.ts`，供兩處共用，避免兩份分歧的字串模板。`render.ts` 與 `resolveExplanations.ts` 僅負責呼叫與在無命中時沿用既有 fallback。

### 4. 詞彙表建置策略（主要工作量）

一次性分析腳本（`scripts/` 下，非交付路徑）：

- 掃過五科 `src/data/past-exams/*.json` 的所有選項。
- 以 `choiceAnalysis` 的正規化邏輯抽出候選名詞，分為兩類：
  - **具名概念型**：短、像專有名詞者（候選詞彙表項目）。
  - **整句型**：長句、敘述型（不入詞彙表）。
- 依出現頻率排序，先補最高頻名詞以最大化覆蓋率。
- 回報覆蓋率：已命中選項 / 總選項；並回報兩類各佔比，讓「所有題」的實際覆蓋範圍透明可見。

## 測試

- `tests/` 新增 `choiceAnalysis` 單元測試：
  - 正規化：`"專家系統（Expert System） "` → 命中「專家系統」。
  - 未命中：整句型選項回傳 `undefined`。
  - 命中內容含 `purpose` 與兩個 `examples`。
- 既有測試不得退化（`npm run test`）。
- 交付前跑 `npm run build`（型別）與 `npm run test`。

## 風險與限制

- 詞彙表只對具名概念型選項有效；整句型選項維持通用句。覆蓋率取決於詞彙表完整度，將以腳本量測並回報。
- 正規化的括號／空白處理需涵蓋題庫實際樣態（全形空白、尾隨空白、中英混排）；以單元測試固定行為。
- 詞彙內容正確性靠人工複審，非自動測試保證。
