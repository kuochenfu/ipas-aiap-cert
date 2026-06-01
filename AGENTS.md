# AGENTS.md — 給 AI 助理的專案守則

本文件記錄此專案的不變式與操作規範，供 AI 編程助理（Codex、Claude 等）在修改程式碼時遵守。

---

## 核心不變式（勿更動）

### 考試規則
- 每科 **50 題單選**，每題 **2 分**，滿分 **100 分**，**70 分及格**。
- 最多答錯 **15 題**（`maxWrongToPass: 15`，定義於 `src/domain/exam.ts`）。
- 選項固定為 **A / B / C / D** 四個；答案為**單一字母**（`ChoiceId = "A" | "B" | "C" | "D"`）。

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
- 三者由 `src/data/<subjectId>.ts` 合併，透過 `src/data/index.ts` 對外提供 `getQuestions`。

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
| State | `src/state/` | 錯題本（localStorage）、抽題洗牌 |
| UI | `src/ui/` | HTML 渲染函式、HTML 跳脫工具 |
| Data | `src/data/` | 題庫合併層（past-exams + explanations + generated） |
| Scripts | `scripts/` | 資料管線腳本（Node.js，不進 bundle） |
| Entry | `src/main.ts` | 畫面狀態機、計時器、模式流程 |

---

## 部署

推送至 `main` 分支後，GitHub Actions（`.github/workflows/deploy.yml`）自動執行 `npm ci && npm run build` 並部署至 GitHub Pages。
