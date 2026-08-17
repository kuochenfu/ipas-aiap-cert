# 架構說明

## 技術棧

Vite + TypeScript，純前端靜態 SPA，部署於 GitHub Pages（base path `/ipas-aiap-cert/`）。無後端、無資料庫，所有狀態存於瀏覽器 localStorage。

---

## 模組職責

### `src/domain/`
純業務邏輯，不依賴 DOM 或外部狀態。

| 檔案 | 職責 |
|------|------|
| `exam.ts` | 定義考試規則（`examRules`：50 題、每題 2 分、70 及格、maxWrongToPass 15）；`scoreExam` 計算成績；`topicSummary` 統計各主題對錯（模擬考成績頁用）；`topicStats` 另計「已作答」欄供刷題的節點表現視圖用；`isCorrect` 判斷單題。 |
| `catalog.ts` | 定義 `Subject` 型別與 5 個科目（初級 2 科、中級 3 科），提供 `getSubject`、`getSubjectsByLevel`。 |
| `drill.ts` | 純函式：`restoreDrill` 依已儲存進度還原刷題位置與作答，題庫變動時安全退回第一題；`parseJumpTarget` 解析跳題輸入為 0-based 索引，不合法回 null。 |
| `assessmentTopics.ts` | 官方《評鑑內容範圍》的節點目錄：`practiceTopics`（新題庫的節點＋題數配額，初級兩科）、`seniorNodes`（中級三科的節點目錄）、`allNodes`（兩者合併，供回填與測試查表）。中級題庫的 `topic` 即取自此。 |

### `src/state/`
應用狀態管理，依賴 localStorage，不依賴 DOM。

| 檔案 | 職責 |
|------|------|
| `storage.ts` | 錯題本的讀寫，localStorage key 為 `ipas-aiap-misses`。模擬考交卷時寫入，刷題的「錯題」篩選器讀取，「重置進度」清除本科目項目。 |
| `attempt.ts` | `buildAttempt` 從題庫取題（可注入 shuffle）；`shuffleWith` 提供可注入亂數的洗牌。刷題以 identity shuffle 取整個題庫（原序）。 |
| `mockPapers.ts` | `buildMockPaper(bank, subjectId, paperIndex)` 以 `subjectId + 份次` 為 seed（FNV-1a ＋ mulberry32）產生**決定性、可重現**的 50 題試卷；`PAPER_COUNT = 3`。 |
| `drillProgress.ts` | 刷題進度的讀寫，localStorage key 為 `ipas-aiap-drill-progress`，依科目分別儲存。 |

### `src/ui/`
畫面渲染，依賴 DOM，不含業務邏輯。

| 檔案 | 職責 |
|------|------|
| `escape.ts` | HTML 字元跳脫工具函式。 |
| `render.ts` | 所有 HTML 片段的產生函式：首頁、級別/科目、模式選單、試卷選單（`renderPaperPicker`）、刷題逐題卡（`renderQuestion`）、單頁考卷（`renderExamPaper`）、單頁檢討（`renderExamReview`）、成績、學習主題（`renderStudyView`）。選項解析區塊優先使用題目的 `choiceExplanations`；沒有時才走 `fallbackChoiceExplanation`（正解顯示固定句、錯誤選項先試 `explanationSegmentForChoice` 從詳解抽「A…B…」片段，都沒有才是通用句）。**注意後備路徑是逐選項生效的**：`choiceExplanations` 刻意不含正解，所以初級兩科 435 題的**正解欄位**同樣走後備（顯示固定句），並非只有中級三科在用——若日後中級也手寫完就把後備刪掉，會讓那 435 格瞬間空白。單頁檢討（`renderExamReview`）則另以 `q.choiceExplanations` 是否存在為閘門：沒有手寫解析的題目**整個區塊不顯示**，不以通用句充數。 |

### `src/data/`
題庫資料層，負責合併多個來源並對外提供統一介面。

| 路徑 | 職責 |
|------|------|
| `types.ts` | 共用型別：`Question`（含 id、topic、prompt、choices、answer、explanation、`choiceExplanations`）、`ChoiceId`、`Level`。 |
| `past-exams/*.json` | 由資料管線產生的歷屆試題（已提交）。 |
| `explanations/<subjectId>.ts` | 手寫詳解**與錯誤選項解析** map（`explanations/types.ts` 的 `QuestionExplanation`：`{ explanation, choices }`，`choices` 只放三個錯誤選項，正解不寫），key 為題目 id。 |
| `explanations/types.ts` | `QuestionExplanation` 型別定義。 |
| `generated/<subjectId>.ts` | 手寫補充新題陣列。新題的詳解與選項解析寫在**題目物件自身**的 `explanation` / `choiceExplanations` 欄位，**不經** `explanations/*.ts`。 |
| `resolveExplanations.ts` | `resolvePastExamExplanations`：把手寫的 `QuestionExplanation`（詳解、選項解析、圖片轉錄）套到真題上；查無手寫內容時保留題目自帶的 `explanation`（學習指引例題的解析即由此而來）。選項本身是圖片時，另把 `choiceFigures` 的內容填回空白的 `choices[].text`。 |
| `<subjectId>.ts` | 合併 past-exams JSON + explanations + generated，提供 `getQuestions`、`getBankStats`。 |
| `index.ts` | 統一匯出所有科目的 `getQuestions`、`getBankStats`。 |
| `studyGuide.ts` | 「學習主題（延伸閱讀）」資料：依官方評鑑範圍轉錄的 18 個評鑑主題 ＋ 策展外部連結；提供 `getStudyGuide`。 |
| `practice/<subjectId>.ts`、`practice/index.ts` | 新題庫：依官方評鑑內容節點分類的補充題（配額見 `src/domain/assessmentTopics.ts`），與 `past-exams`/`explanations`/`generated` 組成的原題庫**完全獨立、不經 `getQuestions`**；`practice/index.ts` 提供 `getPracticeQuestions`、`getPracticeStats`、`practiceSubjectIds`。目前僅初級兩科各 100 題，見 `docs/coverage/practice-bank.md`。 |

### `src/main.ts`
畫面狀態機（View State Machine）。視圖：`home / level / mode / paper / play / result / review / study / topics`（`topics` 為刷題的「節點表現」）。管理頁面切換、計時器與自動交卷、以及兩種流程：
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
        ├── src/data/explanations/<subjectId>.ts  ← 手寫詳解＋錯誤選項解析＋原卷圖片轉錄（真題用）
        ├── src/data/generated/<subjectId>.ts     ← 手寫新題（詳解＋選項解析寫在題目物件內）
        │
        ▼  (各 src/data/<subjectId>.ts 合併)
src/data/index.ts → getQuestions(subjectId) → src/main.ts
```

重新執行 `npm run parse:papers` 只會覆寫 `past-exams/*.json`，不會影響手寫的詳解與新題。

初級兩科（`junior-ai-basics`、`junior-genai`）的詳解與選項解析已於 2026-08 全面改寫為手寫，覆蓋範圍與複審狀態見 [`docs/coverage/explanations-overhaul.md`](coverage/explanations-overhaul.md)。

---

## 已知限制

- **原卷圖片**：考卷中的程式碼、console 輸出與資料表多以截圖呈現，pdftotext 擷取不到。
  解法是人工轉錄為文字，放在手寫層 `explanations/*.ts` 的 `figures` 與 `choiceFigures`
  （型別 `QuestionFigure`，見 `src/data/types.ts`），由 `resolvePastExamExplanations` 依 id 合併。
  選項本身是圖時，合併會一併把轉錄內容填回 `choices[].text`，讓「每題四選項皆有文字」的
  不變式成立；`render.ts` 則對這類選項改以 `<pre>` 呈現。中級三科共 42 題有轉錄。
  轉錄不得寫進 `past-exams/*.json`（機器產物），`tests/figures.test.ts` 會擋。
