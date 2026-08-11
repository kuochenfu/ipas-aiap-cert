# 架構說明

## 技術棧

Vite + TypeScript，純前端靜態 SPA，部署於 GitHub Pages（base path `/ipas-aiap-cert/`）。無後端、無資料庫，所有狀態存於瀏覽器 localStorage。

---

## 模組職責

### `src/domain/`
純業務邏輯，不依賴 DOM 或外部狀態。

| 檔案 | 職責 |
|------|------|
| `exam.ts` | 定義考試規則（`examRules`：50 題、每題 2 分、70 及格、maxWrongToPass 15）；`scoreExam` 計算成績；`topicSummary` 統計各主題對錯；`isCorrect` 判斷單題。 |
| `catalog.ts` | 定義 `Subject` 型別與 5 個科目（初級 2 科、中級 3 科），提供 `getSubject`、`getSubjectsByLevel`。 |
| `drill.ts` | 純函式：`restoreDrill` 依已儲存進度還原刷題位置與作答，題庫變動時安全退回第一題；`parseJumpTarget` 解析跳題輸入為 0-based 索引，不合法回 null。 |

### `src/state/`
應用狀態管理，依賴 localStorage，不依賴 DOM。

| 檔案 | 職責 |
|------|------|
| `storage.ts` | 錯題本的讀寫，localStorage key 為 `ipas-aiap-misses`。 |
| `attempt.ts` | `buildAttempt` 從題庫取題（可注入 shuffle）；`shuffleWith` 提供可注入亂數的洗牌。刷題以 identity shuffle 取整個題庫（原序）。 |
| `mockPapers.ts` | `buildMockPaper(bank, subjectId, paperIndex)` 以 `subjectId + 份次` 為 seed（FNV-1a ＋ mulberry32）產生**決定性、可重現**的 50 題試卷；`PAPER_COUNT = 3`。 |
| `drillProgress.ts` | 刷題進度的讀寫，localStorage key 為 `ipas-aiap-drill-progress`，依科目分別儲存。 |

### `src/ui/`
畫面渲染，依賴 DOM，不含業務邏輯。

| 檔案 | 職責 |
|------|------|
| `escape.ts` | HTML 字元跳脫工具函式。 |
| `render.ts` | 所有 HTML 片段的產生函式：首頁、級別/科目、模式選單、試卷選單（`renderPaperPicker`）、刷題逐題卡（`renderQuestion`）、單頁考卷（`renderExamPaper`）、單頁檢討（`renderExamReview`）、成績、學習主題（`renderStudyView`）。 |

### `src/data/`
題庫資料層，負責合併多個來源並對外提供統一介面。

| 路徑 | 職責 |
|------|------|
| `types.ts` | 共用型別：`Question`（含 id、topic、stem、choices、answer、explanation）、`ChoiceId`、`Level`。 |
| `past-exams/*.json` | 由資料管線產生的歷屆試題（已提交）。 |
| `explanations/<subjectId>.ts` | 手寫詳解 map，key 為題目 id。 |
| `generated/<subjectId>.ts` | 手寫補充新題陣列。 |
| `<subjectId>.ts` | 合併 past-exams JSON + explanations + generated，提供 `getQuestions`、`getBankStats`。 |
| `index.ts` | 統一匯出所有科目的 `getQuestions`、`getBankStats`。 |
| `studyGuide.ts` | 「學習主題（延伸閱讀）」資料：依官方評鑑範圍轉錄的 18 個評鑑主題 ＋ 策展外部連結；提供 `getStudyGuide`。 |

### `src/main.ts`
畫面狀態機（View State Machine）。視圖：`home / level / mode / paper / play / result / review / study`。管理頁面切換、計時器與自動交卷、以及兩種流程：
- **模擬考試**：`mode → paper`（選 3 份）→ `play`（單頁 `renderExamPaper`，選項就地更新不重繪）→ `result` → `review`（單頁 `renderExamReview`）。
- **刷題練習**：`mode → play`（逐題 `renderQuestion`，全題庫、原序、即時揭曉）。

### `scripts/`
資料管線腳本，於 Node.js 環境執行（tsx），不進 bundle。

| 檔案 | 職責 |
|------|------|
| `paper-manifest.ts` | 定義各年度/科目的 markdown 檔案對應表。 |
| `parse-core.ts` | markdown → `Question[]` 的核心解析邏輯（正規表達式抽題號、選項、答案）。 |
| `parse-past-papers.ts` | 入口點，讀取 manifest、呼叫 parse-core、輸出 JSON 至 `src/data/past-exams/`。 |

---

## 資料管線

```
docs/raw/*.pdf          （私有，不納入版控）
        │  pdftotext
        ▼
docs/markdown/*.md      （本地，不納入版控）
        │  npm run parse:papers
        │  scripts/parse-past-papers.ts
        ▼
src/data/past-exams/*.json   ← 已提交，歷屆試題
        │
        ├── src/data/explanations/<subjectId>.ts  ← 手寫詳解
        ├── src/data/generated/<subjectId>.ts     ← 手寫新題
        │
        ▼  (各 src/data/<subjectId>.ts 合併)
src/data/index.ts → getQuestions(subjectId) → src/main.ts
```

重新執行 `npm run parse:papers` 只會覆寫 `past-exams/*.json`，不會影響手寫的詳解與新題。

---

## 已知限制

- `senior-ml-114-2-q45`：原始 PDF 中四個選項為圖片，pdftotext 無法擷取，選項文字為空，但題幹與正確答案已保留。
