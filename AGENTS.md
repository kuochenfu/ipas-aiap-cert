# AGENTS.md — 給 AI 助理的專案守則

本文件記錄此專案的不變式與操作規範，供 AI 編程助理（Codex、Claude 等）在修改程式碼時遵守。

---

## 核心不變式（勿更動）

### 考試規則
- 每科 **50 題單選**，每題 **2 分**，滿分 **100 分**，**70 分及格**。
- 最多答錯 **15 題**（`maxWrongToPass: 15`，定義於 `src/domain/exam.ts`）。
- 選項固定為 **A / B / C / D** 四個；答案為**單一字母**（`ChoiceId = "A" | "B" | "C" | "D"`）。

### 兩種練習模式（`src/main.ts` 狀態機）
- **模擬考試**：選 **3 份固定試卷**（`src/state/mockPapers.ts`，依 `subjectId + 份次` seed，決定性可重現）→ **單頁** 50 題作答（點選即時就地更新 DOM，**不整頁重繪**以保留捲動）→ 計時（初級 75／中級 90 分，時間到自動交卷）→ 成績 → **單頁逐題檢討**。
- **刷題練習**：放入該科**整個題庫、依考卷原序**（不打散），逐題卡片、作答後即時揭曉對錯與詳解、不計時。
- 模式選單的刷題題數為**動態顯示**（該科實際題數），勿再寫死數字。
- **新題庫（`src/data/practice/`）**：依官方評鑑內容節點分類的補充題，配額定義於 `src/domain/assessmentTopics.ts`；**不得併入 `getQuestions`**——與原題庫是兩個完全獨立的資料來源。目前僅初級兩科（`junior-ai-basics`、`junior-genai`）各 100 題，中級三科未建置。其刷題進度存於既有 key `ipas-aiap-drill-progress` 底下、同一 map 內以 `${subjectId}:practice` 為 key（與原刷題的 `subjectId` key 分開，互不覆蓋）。模式選單第三張卡以 `data-mode="practice"` 觸發，實際上是 `session.mode = "drill"` ＋ `session.bank = "practice"`（沿用既有刷題流程與 UI，只是換題庫來源）；只有這兩科的模式選單會顯示第三張卡。

### 錯題本
- 存於 **localStorage**，key 固定為 `ipas-aiap-misses`。
- 不可更換 key 名稱，否則現有使用者的錯題記錄將遺失。

### 刷題進度
- 存於 **localStorage**，key 固定為 `ipas-aiap-drill-progress`（`src/state/drillProgress.ts`）。
- 依科目 id 分別儲存，內容為目前的 `questionId` 與作答 map（`Record<題目id, 選項字母>`）。
- 不可更換 key 名稱，否則現有使用者的刷題進度將遺失。
- 僅**刷題練習**會持久化進度；**模擬考試**不會。

### 私有資料
- `docs/raw/` 存放原始 PDF，**絕對不可提交或公開**（已列入 `.gitignore`）。
- `docs/markdown/` 為中間產物，同樣不納入版控。

---

## 題庫資料管線

```
docs/raw/*.pdf  →  (pdftotext)  →  docs/markdown/*.md
docs/markdown/*.md  →  npm run parse:papers  →  src/data/past-exams/*.json
```

- `src/data/past-exams/*.json` 已提交，為歷屆試題的唯一真實來源。
- **真題的手寫詳解與錯誤選項解析**置於 `src/data/explanations/<subjectId>.ts`（map 格式，key 為題目 id，值為 `QuestionExplanation = { explanation, choices }`；`choices` 只放三個**錯誤**選項，正解不寫）。
- **手寫新題**置於 `src/data/generated/<subjectId>.ts`（陣列格式）。新題的詳解與選項解析寫在**題目物件自身**的 `explanation` / `choiceExplanations` 欄位，**不經** `explanations/*.ts`——改初級的解析內容時兩處都要顧到。
- 重新執行 `npm run parse:papers` **只覆寫** `past-exams/*.json`，不影響 explanations 與 generated。
- 三者由 `src/data/<subjectId>.ts` 合併，透過 `src/data/index.ts` 對外提供 `getQuestions`、`getBankStats`。
- 每題有 `source` 欄位（`"past-exam"` / `"generated"`），可用於區分真題與新題。

### 選項解析（新不變式，2026-08）

- **選項解析一律手寫、不再由詞彙表自動組合。** 舊的 `src/data/glossary.ts`、`src/data/choiceAnalysis.ts` 與 `resolveExplanations.ts` 內的 `buildFallbackExplanation`／`buildChoiceExplanations` 已刪除；**不得重新引入以樣板或名詞定義自動生成解析的機制**。理由與量測見 [`docs/coverage/explanations-overhaul.md`](docs/coverage/explanations-overhaul.md)。
- 初級兩科（`junior-ai-basics` 222 題、`junior-genai` 213 題）**每一題**都必須有非空詳解與三條錯誤選項解析；由 `tests/explanationsCoverage.test.ts` 強制。
- 該測試檔的 `source === "generated"` 區塊只檢查非空；**25 字下限與樣板句偵測來自「選項解析品質門檻（全題庫）」區塊**（遍歷五科 `getQuestions`，因此涵蓋被合併進來的 gen 題）。若日後收窄那個全題庫掃描，gen 題會無聲失去下限。
- 中級三科尚無手寫選項解析，走 `render.ts` 的後備路徑（詳解片段抽取 → 通用句）。這是已知缺口，不是可以拿樣板去填的空位。

### 學習主題（延伸閱讀）
- `src/data/studyGuide.ts`：依官方《評鑑內容範圍》手動轉錄的 18 個評鑑主題 ＋ 策展外部連結。
- `src/data/studyNotes.ts`：每個主題碼下的 section 有兩種來源，**勿混用**：
  - heading 不以「補充」開頭者＝官方學習指引講義的忠實重構，改動須回頭核對原講義。
  - heading 以「**補充 A**／**補充 B**」開頭者＝**非官方講義**，由題庫反推撰寫（依據見 `docs/coverage/<subjectId>.md` 的逐題盤點）。補充 A 為缺口考點概念卡（定義／題庫怎麼考／易混淆三段式，每張卡至少 2 個子項）；補充 B 為時效性技術與法規現況，敘述須附查證來源。heading 一律保留「非官方講義」字樣（`tests/studyNotes.test.ts` 會驗）。
  - 目前僅 `junior-ai-basics`、`junior-genai` 兩科有補充 section；中級三科尚未做。
- 外部連結請維持權威、穩定來源，新增時應實際以 HTTP 驗證可用；渲染一律 `target="_blank" rel="noopener noreferrer"` 並經 `escapeHtml`。

---

## 已知資料限制

- **`senior-ml-114-2-q45`**：原始 PDF 中四個選項為圖片，pdftotext 無法擷取，故 `choices` 的文字為空字串。題幹與答案（正確字母）已正確保留。修改資料管線時請注意此邊界案例。
- 其餘已知的題目瑕疵、重複題、`studyNotes.ts` 錯誤與尚未修掉的解析管線殘留，集中記錄於 [`docs/coverage/bank-defects.md`](docs/coverage/bank-defects.md)。撰寫詳解前先讀它，以免去「調和」已知為錯的內容。

---

## 常用指令

```bash
npm run dev          # 本地開發（http://127.0.0.1:5173/ipas-aiap-cert/）
npm run build        # tsc + vite build（產生 dist/）
npm run test         # vitest run（單元測試）
npm run parse:papers # 重新解析 docs/markdown/*.md → src/data/past-exams/*.json
```

**修改前後務必執行 `npm run build` 與 `npm run test`，確保型別正確且測試全數通過。**

---

## 模組地圖

詳見 [`docs/architecture.md`](docs/architecture.md)，簡述如下：

| 層 | 路徑 | 說明 |
|----|------|------|
| Domain | `src/domain/` | 考試規則、計分、科目目錄（無副作用） |
| State | `src/state/` | 錯題本（localStorage）、抽題洗牌（`attempt.ts`）、決定性 3 份試卷（`mockPapers.ts`） |
| UI | `src/ui/` | HTML 渲染函式、HTML 跳脫工具（含單頁考卷/檢討、學習主題、模式/試卷選單） |
| Data | `src/data/` | 題庫合併層（past-exams + explanations／選項解析 + generated）＋學習主題（`studyGuide.ts`） |
| Scripts | `scripts/` | 資料管線腳本（Node.js，不進 bundle） |
| Entry | `src/main.ts` | 畫面狀態機、計時器、模式流程 |

---

## 部署

推送至 `main` 分支後，GitHub Actions（`.github/workflows/deploy.yml`）自動執行 `npm ci && npm run build` 並部署至 GitHub Pages。
