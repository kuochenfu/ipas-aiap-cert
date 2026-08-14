# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

iPAS「AI 應用規劃師」認證練習網站。純前端 Vite + TypeScript 靜態 SPA，部署到 GitHub Pages（無後端、無資料庫，狀態存 localStorage）。

## Commands

```bash
npm run dev          # 本地開發伺服器 http://127.0.0.1:5173/ipas-aiap-cert/
npm run build        # tsc 型別檢查 + vite build（產生 dist/）— 交付前必跑
npm run test         # vitest run（一次性跑全部測試）
npm run test:watch   # vitest watch
npm run parse:papers # 從 docs/markdown/*.md 重新解析真題 → src/data/past-exams/*.json
```

跑單一測試檔：`npx vitest run tests/exam.test.ts`
依名稱過濾：`npx vitest run -t "scoreExam"`

改完程式請務必跑 `npm run build`（型別）與 `npm run test`。推送到 `main` 會經 `.github/workflows/deploy.yml` 自動部署到 GitHub Pages（`vite.config.ts` 的 `base` 為 `/ipas-aiap-cert/`，改 repo 名稱時要同步改）。

## 考試規則常數（`src/domain/exam.ts`）

每科 50 題單選、每題 2 分、滿分 100、70 及格（最多錯 15 題）。選項固定 A/B/C/D，答案為**單一字母**。中級報考科目1＋（科目2 或 3）；本站五科皆可獨立練習。

## 大局架構（跨檔案才看得懂的部分）

**題庫＝三個來源、載入時合併（核心設計）。** 每科的題庫不是單一檔，而是由 `src/data/<subjectId>.ts` 把三者合併：

1. `src/data/past-exams/<subjectId>.json` — **真題**，由解析腳本產生，視為機器產物，勿手改。
2. `src/data/explanations/<subjectId>.ts` — **手寫詳解與錯誤選項解析** map（`題目id → { explanation, choices }`，`choices` 只放三個錯誤選項，正解不寫）。
3. `src/data/generated/<subjectId>.ts` — **手寫新題** 陣列（詳解與選項解析寫在題目物件內）。

合併時把 explanations 套到對應 id 的真題上，再接上 generated。**因此重跑 `npm run parse:papers` 只覆寫 `past-exams/*.json`，不會動到手寫的詳解與新題**——這是刻意的，改動資料層時務必維持。`src/data/index.ts` 對外只暴露 `getQuestions(subjectId)` 與 `getBankStats`。每題帶 `source: "past-exam" | "generated"`，可用於區分/篩選。

**資料管線**：`docs/raw/*.pdf`（私有 PDF）→ pdftotext →`docs/markdown/*.md`（中間產物）→ `npm run parse:papers`（`scripts/parse-core.ts` 為純函式解析、`paper-manifest.ts` 為檔案對應、`parse-past-papers.ts` 為 I/O 入口）→ `src/data/past-exams/*.json`（已提交）。`docs/raw/` 與 `docs/markdown/` 皆 **gitignore**；真正進版控的題目內容是那些 JSON。

**`src/main.ts` 是單一畫面狀態機**，視圖：`home / level / mode / paper / play / result / review / study`。兩種練習流程的渲染與行為**依 `session.mode` 分流**：
- **模擬考試**：`mode → paper`（選 3 份，`src/state/mockPapers.ts` 以 `subjectId+份次` seed 產生**決定性**試卷）→ `play` 用 `renderExamPaper` 把 50 題畫在**單頁**；點選項時**就地更新 DOM、不整頁重繪**（保留捲動位置）→ 交卷 → `result` → `review` 用單頁 `renderExamReview`。有計時、時間到自動交卷。
- **刷題練習**：`mode → play`，用逐題卡 `renderQuestion`，放入**整個題庫、依考卷原序**（identity shuffle），作答後即時揭曉、不計時。

**渲染走 `innerHTML` 字串樣板**：所有動態文字一律先經 `src/ui/escape.ts` 的 `escapeHtml`，外部連結加 `target="_blank" rel="noopener noreferrer"`。

更深入的模組職責見 `docs/architecture.md`；不變式與操作守則見 `AGENTS.md`；各功能的設計與計畫見 `docs/superpowers/specs/` 與 `docs/superpowers/plans/`；專案回顧與待辦見 `docs/retrospective-2026-06-01.md`；已知的題目瑕疵與待複審內容見 `docs/coverage/`（尤其 `bank-defects.md` 與 `explanations-overhaul.md`）。

## 容易踩到的點（gotchas）

- **事件委派的選擇器清單**：`main.ts` 用單一 `closest("[data-level],[data-subject],[data-mode],[data-paper],[data-choice],[data-nav]")` 攔截點擊。**新增任何可點擊的 `data-*` 屬性時，必須把它加進這個清單**，否則點擊不會被處理（曾因漏 `data-paper` 導致選卷無反應）。
- **單頁考試的就地更新**：exam 模式選項點擊是直接改 DOM class 與「已作答」計數、**不呼叫 `render()`**；drill 模式則每次互動重繪整題。改任一邊時注意兩者路徑不同。
- **`reveal` 揭曉邏輯**：drill 作答後揭曉、檢討一律揭曉、考試作答中不揭曉——集中在 `revealForCurrent()` 與 render 分流，改導覽時別讓檢討翻頁丟失揭曉。
- **錯題本 localStorage key 為 `ipas-aiap-misses`**，勿更名（會遺失現有使用者紀錄）。
- **刷題進度 localStorage key 為 `ipas-aiap-drill-progress`**，勿更名（會遺失現有使用者紀錄）。進度記錄的是 `questionId` 而非索引，這是刻意設計——題庫會隨時間成長，用索引會在新增題目後悄悄指向錯的題目。
- **已知資料限制**：`senior-ml-114-2-q45` 原始 PDF 選項為圖片，pdftotext 無法擷取，故其 `choices` 文字為空（題幹與答案正確）；測試只檢查選項 id 而非文字，故此題不會使測試失敗。
- **新題品質**：`generated/*` 由 LLM 依官方學習指引撰寫，僅有「格式」自動測試，**內容正確性需人工複審**；擴充新題前先確認複審流程。
- **初級的解析內容散在兩個地方**：`gen-*` 共 66 題（`junior-ai-basics` 32、`junior-genai` 34）的詳解與選項解析定義在 `generated/*.ts` 的**題目物件內**，**不經** `explanations/*.ts`；真題的則在 `explanations/*.ts`。改初級解析內容時兩處都要顧到。初級兩科每一題都必須有非空詳解與**三條**錯誤選項解析（`tests/explanationsCoverage.test.ts` 強制）；選項解析**一律手寫**，舊的詞彙表自動組合機制（`glossary.ts`／`choiceAnalysis.ts`）已刪除且不得重建，緣由見 `docs/coverage/explanations-overhaul.md`。中級三科尚無手寫選項解析，走 `render.ts` 的後備路徑。
- **`session.bank`（`"main" | "practice"`）決定刷題的題庫來源**：`"main"` 讀 `getQuestions`（原題庫），`"practice"` 讀 `getPracticeQuestions`（`src/data/practice/`，依評鑑內容節點分類，目前僅初級兩科各 100 題）。`drillProgressKey()` 依此在 key 後綴 `:practice`，讓兩者的進度分開存在同一個 `ipas-aiap-drill-progress` map 裡。改刷題相關邏輯（進度還原、篩選、就地更新等）時，兩種來源都要確認成立，不能只測 `bank: "main"` 的路徑。新題庫的節點題數與配額由 `src/domain/assessmentTopics.ts` 定義，改配額要同步改 `tests/practiceBank.test.ts`。
