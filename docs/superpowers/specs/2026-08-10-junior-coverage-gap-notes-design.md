# 初級題庫反推學習指引補完 — 設計

日期：2026-08-10
範圍：`junior-ai-basics`（222 題）、`junior-genai`（213 題），共 435 題、7 個主題碼（L111–L114、L121–L123）

## 問題

`src/data/studyNotes.ts` 的內容來自官方學習指引講義的忠實重構，涵蓋面偏概念導論；但題庫（含 115 年最新真題）大量考到講義未寫的具體技術點。抽樣即可見缺口：L1/Lasso 正則化、SVM 特性、EDA 做法、敘述統計判讀、Context-aware Agent、Multi-Agent 狀態一致性、GitHub Copilot、Few-shot 遇上 domain shift、地端部署治理理由等。使用者以題庫回頭查學習指引時「很多都找不到」。

## 目標

1. 逐題盤點初級兩科全部題目的考點，產出可稽核的覆蓋率清單。
2. 針對未覆蓋的考點，撰寫概念卡補進 `studyNotes.ts`，走現有渲染路徑呈現。
3. 對時效性主題，以查證過的 2025–2026 資訊補強，並附權威來源連結。

## 非目標

- 不做中級三科（先把流程與品質標準跑通）。
- 不新增視圖、不改狀態機、不改 `main.ts` 事件委派選擇器清單。
- 不改動 `past-exams/*.json`、不重跑解析管線。

## 產出物

| 產出 | 位置 | 性質 |
|---|---|---|
| 逐題覆蓋清單 | `docs/coverage/junior-ai-basics.md`、`docs/coverage/junior-genai.md` | 稽核紀錄，不進 bundle |
| 缺口概念卡 | `src/data/studyNotes.ts` 既有 7 個主題碼下追加 section | 進網站 |
| 查證連結 | `src/data/studyGuide.ts` 對應主題 `links` | 進網站 |
| 待複審紀錄 | coverage md ＋ auto-memory | 流程控管 |

## 資料結構

沿用既有 `StudyNoteSection` / `StudyNoteItem`，每個主題碼底下最多追加兩個 section：

- **`補充 A｜題庫考點反推（非官方講義）`** — 每個缺口考點一張概念卡，`text` 為考點名稱（中英對照），`children` 依序為：
  - `定義：…`
  - `題庫怎麼考：<題號> …`
  - `易混淆：…`（有對照概念時才寫）
- **`補充 B｜2025–2026 技術現況`** — 僅在有實質時效更新的主題碼追加（預期 L111 法規、L122 工具與 Agent、L123）。每條敘述附來源名稱，對應連結加入 `studyGuide.ts`。

此結構天然滿足既有測試不變式（`tests/studyNotes.test.ts` 要求 junior-ai-basics 每個 section 都至少有一處巢狀）。

## 流程

1. **逐題盤點** — 分批讀完 435 題，每題抽 1–3 個考點關鍵詞、標主題碼，比對 `studyNotes.ts` 判定「已覆蓋／部分／缺口」，寫入 coverage md。
2. **缺口歸群** — 關鍵詞去重合併為考點，依主題碼分類成待寫清單。
3. **查證** — 對時效性考點（EU AI Act 施行時程、模型世代、MCP／Agent 互通標準、No-code 與 Copilot 系工具現況）以 WebSearch／WebFetch 查 2025–2026 權威來源，記錄 URL。
4. **撰寫** — 概念卡寫入 `studyNotes.ts`；新連結加入 `studyGuide.ts`。
5. **驗證** — `npm run build`、`npm run test`，並擴充 `tests/studyNotes.test.ts`。

## 測試

擴充 `tests/studyNotes.test.ts`：

- 兩科的 7 個主題碼都存在「補充 A」section。
- 補充 section 的每張卡至少 2 個 `children`。
- 所有 `text` 非空白。
- 既有的 `hasNesting` 不變式維持通過。

## 誠實標註

既有 `studyNotes` 內容是官方講義忠實重構；新內容是 LLM 依題庫反推撰寫，性質不同，故 section heading 明寫「非官方講義」。內容正確性仍需人工複審，複審清單留在 `docs/coverage/*.md` 與 auto-memory，比照 glossary 與 generated 題目的既有做法。

## 風險

- 概念卡內容由 LLM 撰寫，可能有事實錯誤 → 以「非官方講義」標註 ＋ 待複審清單控管。
- 時效性資訊會過期 → 補充 B 每條標示查證年份與來源。
- `studyNotes.ts` 已 9288 行，追加後更大 → 本次仍維持單檔（拆檔會動到多處 import，不在本次範圍）。
