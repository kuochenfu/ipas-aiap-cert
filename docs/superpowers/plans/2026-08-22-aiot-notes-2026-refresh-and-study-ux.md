# AIoT 筆記的 2026 內容更新與學習頁體驗強化 — 實作計畫

**Goal:** 依 2026 最新的 AI×IoT 發展逐一擴充 AIoT 15 個節點的備考整理，並把學習主題頁從「一頁到底的文字牆」改成可導覽、可搜尋、可練習、有進度的讀書工具。

**Architecture:** `StudyNoteItem` 擴充三種呈現型別（table／formula／flow），渲染端據此輸出表格、公式塊與流程列；學習頁的導覽（目錄、搜尋、展開收合、速記模式）一律以 **DOM 就地操作** 實作，不整頁重繪；節點直達刷題沿用 `beginDrill(bank)`，只是傳入依 topic 篩過的題庫並在進度 key 加後綴。

**Spec:** 決策來自 2026-08-22 與使用者的選項確認（本檔「決策」節即為 spec）。

## 決策（使用者已選）

- **內容型別**：擴充筆記型別，比較表渲染成真表格、公式用等寬強調塊、流程用帶箭頭的步驟列。
- **導覽**：節點目錄與錨點、站內搜尋、全部展開／收合、七個項目各自可折疊（四項全做）。
- **學練整合**：節點直達刷題、縮寫速查表、已讀進度標記、考前速記模式（四項全做）。
- **套用範圍**：**先只套 AIoT**。五科的 40 個主題維持現行渲染，確認體驗後再推。

## Global Constraints

- 動態文字一律 `escapeHtml`。
- 既有 localStorage key（`ipas-aiap-misses`、`ipas-aiap-drill-progress`）不得更名；新 key 另取。
- 五科的 `studyNotes.ts`（9000+ 行）與其測試不得因本案變動。
- AIoT 筆記為獨立 lazy chunk，不得併入主 bundle。
- 表格必須能在手機橫向捲動（`overflow-x: auto`），頁面本身不得橫向捲動。
- 每階段結束跑 `npm run build && npm run test`。

---

## 階段 1：筆記型別與渲染

**Files:** `src/data/types.ts`、`src/ui/render.ts`、`src/styles.css`、`tests/render.test.ts`

- `StudyNoteItem` 新增選用欄位：`table?: { headers: string[]; rows: string[][] }`、`formula?: { expr: string; note?: string }`、`flow?: string[]`。`text` 維持必填——table/flow 時作為標題，既有五科的資料因此完全不受影響。
- `renderNoteItems` 依欄位分流；表格包在 `.note-table-wrap`（`overflow-x: auto`）內。
- `countNoteLeaves` 維持「無 children 即 1 則」，表格算 1 則（不是每列一則），否則節點的重點數會被表格灌水。
- `renderStudyNotes` 新增 `collapsibleSections` 選項：七個項目各自為 `<details>`，僅第一項（必懂觀念）預設展開。只有 AIoT 會開這個選項。

## 階段 2：2026 內容擴充

**Files:** `src/data/studyNotes.aiot.ts`、`tests/render.test.ts`

15 個節點逐一擴充，並把既有條列改寫成新型別。重點更新：

- **A1.1**：TinyML 裝置數 2026 上看 10 億；MCU 內建 NPU（STM32N6、NXP Cortex-M + ML 加速）；SLM 上裝置（Phi-3 Mini 3.8B、Gemma 2B、Apple 約 3B）；推論框架 LiteRT（TFLite 改名）／ExecuTorch（50 KB base footprint，可跑 MCU）／ONNX Runtime；量化現況為 8-bit PTQ 是可靠預設、權重 4-bit + 激活 8-bit 為進階組合；PTQ vs QAT。
- **A1.2／B2.3**：Gartner 預測 2030 年半自主 AI agent 編排 10% 生產作業（今 2%）；數位分身 2026 採用成長約 35%；GE Aerospace 預防性維護提前 60% 前置時間、誤報減半；PepsiCo × Siemens Digital Twin Composer。
- **A2.1**：補 Ambient IoT（環境能量採集、無電池）。
- **A2.2**：Matter 1.5（2025-11-20，首納攝影機／視訊門鈴，擴充土壤感測、能源費率、智慧電表、EV 充電）；Thread 1.4 自 2026-01-01 起為唯一認證版本；Wi-Fi 7 與 Thread 需 Matter 轉譯層；5G RedCap／eRedCap 2026 出貨。
- **A2.3**：Sparkplug B（2023 成為 ISO/IEC 標準）補上 MQTT 缺的資料模型／狀態管理／標準命名空間；Unified Namespace；OPC UA over TSN；OPC UA PubSub 規範存在但生產級 broker 與採用度不及 MQTT 生態。
- **A2.5／B1.3**：EU CRA 漏洞與事件通報義務 2026-09-11 生效、全面適用 2027-12-11，要求 secure by design、SBOM（CycloneDX/SPDX）、已遭利用漏洞 24 小時內通報、最短 5 年支援期；EU AI Act 2026-05-07 Digital Omnibus 後的延期時程。
- **縮寫**：改由 `aiotAbbreviations`（`{ term, full, zh?, node }`）**單一來源**生成——每個節點的「重要縮寫」是它的子集表格，速查表是全集。避免兩處各寫一份而漂移。

## 階段 3：學習頁導覽

**Files:** `src/ui/render.ts`、`src/main.ts`、`src/styles.css`、`tests/render.test.ts`

- **節點目錄**：AIoT 區塊頂端列出 15 個節點碼，點擊捲動到該節點並展開；手機上為可橫向捲動的籤列。
- **錨點 id**：`node-A2-2`（把 `.` 換成 `-`，避開 querySelector 的跳脫問題）。
- **搜尋**：輸入即篩選，比對節點碼、標題與筆記全文；不符的節點整塊隱藏並顯示命中數。以 DOM class 切換實作，不重繪。
- **全部展開／收合**：切換 AIoT 區塊內所有 `<details>`。
- **考前速記模式**：切換 root class，只留「公式與計算」「容易混淆」兩節與備考總整理的一句話記憶。

## 階段 4：學練整合與進度

**Files:** `src/main.ts`、`src/ui/render.ts`、`src/state/`、`tests/`

- **節點直達刷題**：節點旁按鈕帶 `data-topic-drill`（值為 `subjectId|節點碼`）。⚠️ 必須加進 `main.ts` 的事件委派選擇器清單。設 `session.topicScope` 後以 `beginDrill(getQuestions(id).filter(q => q.topic === code))` 進場；`drillProgressKey()` 加 `:topic:<code>` 後綴，沿用既有 map、不新增 localStorage key。
- **已讀進度**：新 key `ipas-aiap-study-read`（`Record<節點碼, true>`），節點旁勾選，目錄顯示 `7/15`。
- **縮寫速查表**：學習頁的 AIoT 區塊內一張可搜尋的表（term／全名／中文／所屬節點），資料來自階段 2 的 `aiotAbbreviations`。

## 明確不做

- 不動五科的筆記內容與渲染（範圍決策）。
- 不做跨證照的全站搜尋。
- 不把速記模式做成獨立路由（維持同一頁的檢視切換）。
