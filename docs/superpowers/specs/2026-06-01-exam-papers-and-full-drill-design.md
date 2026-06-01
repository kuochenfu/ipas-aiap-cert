# 單頁三份模擬試卷 ＋ 全題庫刷題 — 設計文件

- 日期：2026-06-01
- 狀態：已核可，待擬定實作計畫
- 關聯：建構於既有 iPAS AIAP 練習網站之上

## 目標

1. **刷題涵蓋全部考古題**：刷題模式放入該科題庫的**全部題目**（所有真題＋已寫的新題），依**考卷原始順序**呈現，讓使用者能逐題刷完每一道考古題。
2. **模擬考試改為單頁、3 份固定試卷**：每科提供 3 份固定試卷（重整一致），整份 50 題在**同一頁**作答（不再逐題切換），交卷後**單頁檢討**。

## 決策摘要

- 五科一律提供 **3 份**模擬試卷（以 subjectId＋份次 seed 決定，穩定可重現）。中級三科目前各僅 50 題真題，故三份為**同一批 50 題、僅順序不同**；待補新題後自動變多元。
- 刷題順序：**按考卷原序**（不打散）。
- 刷題仍為**逐題卡片＋即時對錯與詳解**；僅「涵蓋全部題目」與「原序」兩點改變。
- 模擬考試與檢討改為**單頁**；計時與及格規則不變（初級 75 分／中級 90 分、每題 2 分、70 及格、時間到自動交卷）。

## 模擬試卷產生（決定性、可重現）

新增 `src/state/mockPapers.ts`：
- 以字串雜湊（FNV-1a）＋ `mulberry32` seeded PRNG，依 `subjectId + "#" + paperIndex` 產生穩定亂數。
- `buildMockPaper(bank, subjectId, paperIndex)`：以 seeded RNG 對題庫做 Fisher–Yates 洗牌後取前 50 題（題庫不足 50 時取全部；本專案各科皆 ≥50）。
- 重用既有 `shuffleWith(arr, rng)`（`src/state/attempt.ts`）。
- 結果：題庫 >50（初級）→ 三份內容不同；題庫 =50（中級）→ 三份為同一批的不同排列。

## 流程與狀態

新增 view：`paper`（選試卷）。`Session` 新增 `paperIndex: number`。

- 首頁 → 級別 → 科目 → 模式
- 選「模擬考試」→ **`paper` 視圖**：顯示「第 1／2／3 份」三顆按鈕 → 選定後進入單頁考試（`play`，`mode="exam"`）。
- 選「刷題練習」→ 直接進入逐題刷題（`play`，`mode="drill"`，全部題目、原序）。

## 渲染

- **刷題（play, drill）**：沿用既有 `renderQuestion`（逐題卡片、即時揭曉、上一題/下一題、交卷）。題數 = 全部、原序。
- **模擬考試（play, exam）**：新增 `renderExamPaper(questions, answers, timeText, answered)`：
  - 置頂固定列：結束、`已作答 X/50`、計時、交卷。
  - 50 題逐題堆疊；每題顯示題號、題幹、4 個選項按鈕（`data-qid` ＋ `data-choice`），依 `answers[qid]` 標示已選。
  - 底部再放一顆交卷。
- **檢討（review）依模式分流**：
  - exam → 新增 `renderExamReview(questions, answers, report, topics)`：單頁，頂部分數與主題統計，其後 50 題逐題顯示「你的作答 vs 正解」與詳解。
  - drill → 沿用 `renderQuestion`（逐題）。

## 互動（單頁作答不重繪、不跳動）

模擬考試單頁中點選選項時：
- 更新 `session.answers[qid]`。
- **就地 DOM 更新**：移除該題選項群組內其他 `.selected`，於點選者加上 `.selected`；更新頂部「已作答 X/50」計數。**不做整頁 `innerHTML` 重繪**，以保留捲動位置。
- 交卷與計時到時：照既有 `finishExam()`（計分、錯題入錯題本、轉 result）。

## 測試

- `mockPapers`（`tests/mockPapers.test.ts`）：
  - 每份題數 = `min(50, bank.length)`；同 seed 重現相同順序（決定性）。
  - 題庫 >50 的科目：三份題目集合不完全相同。
  - 題庫 =50 的科目：三份為同一集合的排列（集合相同）。
- 渲染（擴充 `tests/render.test.ts`）：
  - `renderExamPaper`：含 `data-qid`、`已作答`、交卷；選項依 answers 標示 selected；跳脫。
  - `renderExamReview`：含正解標示與詳解；跳脫。

## 不在範圍（YAGNI）

- 不改刷題的逐題卡片形式（僅改為全部題目、原序）。
- 不新增題庫內容（新題產生另議；中級三份多元化待補題後自然達成）。
- 不做試卷分數歷史紀錄。
- 不做刷題的題數/範圍選擇器（屬另一 backlog 項）。
