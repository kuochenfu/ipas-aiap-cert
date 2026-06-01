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

### 錯題本
- 存於 **localStorage**，key 固定為 `ipas-aiap-misses`。
- 不可更換 key 名稱，否則現有使用者的錯題記錄將遺失。

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
- **手寫詳解**置於 `src/data/explanations/<subjectId>.ts`（map 格式，key 為題目 id）。
- **手寫新題**置於 `src/data/generated/<subjectId>.ts`（陣列格式）。
- 重新執行 `npm run parse:papers` **只覆寫** `past-exams/*.json`，不影響 explanations 與 generated。
- 三者由 `src/data/<subjectId>.ts` 合併，透過 `src/data/index.ts` 對外提供 `getQuestions`、`getBankStats`。
- 每題有 `source` 欄位（`"past-exam"` / `"generated"`），可用於區分真題與新題。

### 學習主題（延伸閱讀）
- `src/data/studyGuide.ts`：依官方《評鑑內容範圍》手動轉錄的 18 個評鑑主題 ＋ 策展外部連結。
- 外部連結請維持權威、穩定來源，新增時應實際以 HTTP 驗證可用；渲染一律 `target="_blank" rel="noopener noreferrer"` 並經 `escapeHtml`。

---

## 已知資料限制

- **`senior-ml-114-2-q45`**：原始 PDF 中四個選項為圖片，pdftotext 無法擷取，故 `choices` 的文字為空字串。題幹與答案（正確字母）已正確保留。修改資料管線時請注意此邊界案例。

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
| Data | `src/data/` | 題庫合併層（past-exams + explanations + generated）＋學習主題（`studyGuide.ts`） |
| Scripts | `scripts/` | 資料管線腳本（Node.js，不進 bundle） |
| Entry | `src/main.ts` | 畫面狀態機、計時器、模式流程 |

---

## 部署

推送至 `main` 分支後，GitHub Actions（`.github/workflows/deploy.yml`）自動執行 `npm ci && npm run build` 並部署至 GitHub Pages。
