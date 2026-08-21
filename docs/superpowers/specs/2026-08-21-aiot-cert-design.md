# AIoT 應用工程師（初級）新增為獨立證照 — 設計文件

- 日期：2026-08-21
- 範圍：在本站新增第二張證照「AIoT 應用工程師（初級）」，與既有的「AI 應用規劃師」在資料層與導覽上完全分離；首批內容為官方學習指引「科目1 AIoT 基礎概論」的 80 題練習評量。

## 動機

本站原本只服務 AI 應用規劃師一張證照，`Level = "junior" | "senior"` 直接充當首頁的最上層分類。使用者要準備的 AIoT 應用工程師是**另一張證照**，其「初級」與 AI 應用規劃師的「初級」是不同的東西，若共用同一層級別分類，首頁會把兩張證照的科目混在一起。

同時，AIoT 考科一有一份官方學習指引，內含 80 題練習評量，**每題都自帶答案與非空詳解**——這是現成、官方、且不需人工撰寫詳解的題源。

詳解有兩種型態（實測數字）：**11 題**為逐項選項解析（`(A) 錯誤。…`／`(B) 正確。…` 四行），**69 題**為整體詳解散文。前者可直接填入 `choiceExplanations`；後者僅有 `explanation`，選項解析走 `render.ts` 既有的後備抽取器，與中級三科的現況相同。多數散文詳解未逐項點名 A/B/C/D，因此後備抽取器的填充率會偏高——這是已知且可接受的狀態，非本案要解決的問題。

## 考試事實（依 115 年度簡章）

- AIoT 應用工程師（初級）共 4 個考科，但每張證書只考 2 科：考科一為共同必考且無抵免，再搭配考科二（學科）／考科三（術科）／考科四（術科），分別對應物聯網類／機器聯網類／感知系統類三張證書。
- **本站目前只做物聯網類**：考科一 AIoT 基礎概論 ＋ 考科二 物聯網系統與應用，兩科皆為學科、單選題、電腦化測驗、各 75 分鐘。
- 及格標準：每科滿分 100、四捨五入取整數、70 分及格。
- ⚠️ **簡章未載明題數與每題配分**，只寫「每科目單選題」。因此不可沿用 AI 應用規劃師的 50 題 × 2 分規則。

## 決策（已與使用者確認）

- **導覽結構**：首頁 → 證照 → 級別 → 科目。AIoT 目前只有初級一張級別卡，但保留級別這一層，未來出中級可直接加。
- **模擬考試**：AIoT 兩科**只開刷題、不開模擬考**，待官方題數確認後再開放。
- **考科二**：列出但標示「尚無題目」且不可點入（目前沒有官方學習指引，也沒有真題）。
- **題目來源標記**：新增第三種 `source: "study-guide"`，與 `past-exam`、`generated` 並列。官方練習評量既非歷屆真題、也非 LLM 生成，誠實標記可讓「是否需人工複審」一目了然。

## 已知的原始資料缺陷

官方學習指引 PDF 第 22 頁（3-15）的練習評量第 4 題，四個選項被誤植為解析文字（`(A) 錯誤。NPU 是協同處理器…`、`(B) 正確。…`），等同把答案 (B) 印在題目上。已調閱 PDF 原頁確認為官方原檔錯誤，非轉檔失真。全庫 320 個選項掃描後**僅此 1 題受影響**。

處理方式：依解析內容還原四個選項的原始敘述，寫在 `parse-core.ts` 既有的 `applyStudyGuideErrata()`（該函式已為初級科目一的兩題勘誤做過同一件事），並記入 `docs/coverage/bank-defects.md`。還原內容屬 LLM 推寫，需人工複審。

## 架構

### 資料模型

`src/data/types.ts`：

- 新增 `export type Cert = "aiap" | "aiot"`。
- `Level` 維持 `"junior" | "senior"` 不變（AIoT 目前只用 `junior`）。
- `Question["source"]` 加入 `"study-guide"`。

`src/domain/catalog.ts`：

- `Subject` 新增 `cert: Cert` 與 `mockExam: boolean`（是否開放模擬考試）。既有五科 `cert: "aiap"`、`mockExam: true`。
- 新增證照目錄 `certs: { id: Cert; name: string; subtitle: string }[]`。
- 新增兩個科目：

  | id | cert | level | code | name | durationMinutes | mockExam |
  |---|---|---|---|---|---|---|
  | `aiot-junior-basics` | aiot | junior | 考科一 | AIoT 基礎概論 | 75 | false |
  | `aiot-junior-iot` | aiot | junior | 考科二 | 物聯網系統與應用 | 75 | false |

- `getSubjectsByLevel(level)` → `getSubjects(cert, level)`。這是唯一影響既有呼叫端的簽章變更。

科目 id 的 `aiot-` 前綴使刷題進度（`ipas-aiap-drill-progress`）與錯題本（`ipas-aiap-misses`）**自動隔離**，兩者皆以 subjectId 為 key，**不改 key 名稱**。

### 題庫管線

**不新建平行管線。** `scripts/parse-core.ts` 已有 `parseStudyGuide()`，五份 AI 應用規劃師學習指引的練習題都走它，輸出到 `src/data/past-exams/<subjectId>.json`。實測把 AIoT 指引餵給它，80 題全數解析成功、選項文字與答案皆正確。因此 AIoT 走同一條管線，只補上三處差異：

```
docs/markdown/AIoT…學習指引…md
  → scripts/paper-manifest.ts   studyGuides 加一筆（帶 dialect 設定）
  → scripts/parse-core.ts       parseStudyGuide 支援 aiot dialect
  → src/data/past-exams/aiot-junior-basics.json   機器產物，已提交
  → src/data/aiot-junior-basics.ts                型別化匯出，接進 data/index.ts
```

三處差異，皆以 `PaperEntry` 上的選用設定開關，**預設維持現行行為**，確保重跑 `npm run parse:papers` 後既有五科的 JSON 逐位元組不變：

1. **選項標記為半形**。AI 指引用全形 `（A）`，AIoT 指引用半形 `(A)`。新增 `choiceMarker: "halfwidth"`，只在此 dialect 生效。
2. **逐項選項解析**。現行 `parseStudyGuideAnswerDrafts` 遇到選項標記即結束該題解析，因此 11 題的逐項解析會被丟棄（實測詳解為空）。新增 `perChoiceExplanations: true`：解答區塊中的 `(Y) 正確。…` 去掉前綴後作為 `explanation`，`(Y) 錯誤。…` 去掉前綴後填入 `choiceExplanations`；若該題為散文型態則沿用現行行為（整段作為 `explanation`、無 `choiceExplanations`）。
3. **節點與來源**。新增 `sections`（見下節）決定每題的 `topic`，以及 `source: "study-guide"`。

**斷言**（寫在 `parse-past-papers.ts` 的檢查迴圈，比照既有的警告樣式，但 AIoT 這筆為致命錯誤）：80 題、每題 4 個非空選項、`answer` 在 A–D、`explanation` 非空、9 個節點的題數符合下節表格。任一不符即以非零離開碼中止，**不得靜默略過**（這正是 115-1 匯入時踩到的靜默缺陷）。

題目 id 沿用現行 `parseStudyGuide` 的 `${subjectId}-${examCode}-q{三位數}` 格式，即 `aiot-junior-basics-guide-q001` ～ `-q080`。

### 原始資料缺陷的修補位置

`parse-core.ts` 既有 `applyStudyGuideErrata()`，已為 `junior-ai-basics-guide-q017` 做過同一件事（改寫 prompt 與四個選項）。AIoT 第 4 題（`aiot-junior-basics-guide-q004`）的選項還原就寫在這裡，不另建覆蓋層檔案。

### 節點分類

80 題依出處自然落在考科一的 9 個評鑑內容小節，題數為 5／5／10／10／10／10／10／10／10。`topic` 採兩層碼（A = 考科一、B = 考科二）：

| code | 評鑑主題 | 評鑑內容 | 題數 |
|---|---|---|---|
| A1.1 | AI 基礎知識與應用 | AI 基礎概念 | 5 |
| A1.2 | AI 基礎知識與應用 | AIoT 應用案例 | 5 |
| A2.1 | AIoT 基礎與架構 | 物聯網架構與功能 | 10 |
| A2.2 | AIoT 基礎與架構 | 常見通訊協定與網路層技術 | 10 |
| A2.3 | AIoT 基礎與架構 | 工業通訊標準與資訊模型 | 10 |
| A2.4 | AIoT 基礎與架構 | 中介軟體與平台 | 10 |
| A2.5 | AIoT 基礎與架構 | 資安與隱私基本概念 | 10 |
| A3.1 | 感測器原理與應用 | 感測技術基礎 | 10 |
| A3.2 | 感測器原理與應用 | 感測訊號與通訊基礎 | 10 |

考科二節點（目前無題目，僅供學習主題頁）：`B1.1` 系統元件與架構、`B1.2` 簡易系統故障問題判斷與排除、`B1.3` 物聯網資訊安全、`B2.1` 物聯網硬體設計基礎、`B2.2` 雲端環境數據收集與平台設計、`B2.3` 智慧製造流程優化與成本控制。

`render.ts` 現以 `/^L\d{5} /` 判斷「是否已分類」，AIoT 沒有 L 碼會被誤判為未分類。將此判斷抽成 `assessmentTopics.ts` 的單一 `isTopicClassified()`，主題徽章與刷題節點表現頁改為呼叫它——一處定義、兩處使用。

### UI

- 新增 `cert` 視圖，夾在 `home` 與 `level` 之間；`session` 新增 `cert` 欄位。
- ⚠️ 新的 `data-cert` 屬性**必須加進 `main.ts` 的 `closest(...)` 選擇器清單**，否則點擊不會被處理。
- 首頁標題由「iPAS AI 應用規劃師 練習」改為證照中立的說法。
- 模式頁依 `subject.mockExam` 決定是否顯示「模擬考試」卡；為 false 時附一句說明為何未開放。
- 考科二的科目卡顯示「尚無題目」，不可點入。
- 學習主題頁改為先分證照、再分級別；AIoT 兩科放簡章的兩層大綱（暫無筆記與延伸閱讀）。

### 錯誤處理

- 解析腳本的所有斷言失敗都是致命錯誤（非零離開碼），訊息需指出區塊與題號。
- `getQuestions("aiot-junior-iot")` 回傳空陣列；UI 以 `mockExam`／題數為 0 作為不可點入的依據，不依賴例外。

## 測試

- `tests/aiotGuideParse.test.ts`：`parseStudyGuide` 對 AIoT dialect 的單測，用內嵌 fixture（含 `## Page` 標記、頁眉、頁碼等雜訊）涵蓋半形選項標記、逐項解析拆解、散文詳解沿用舊行為。
- `tests/aiotBank.test.ts`：80 題、每題四個非空選項、答案在 A–D、每題非空詳解、9 個節點的題數符合上表、**無任何選項文字以「正確。／錯誤。」開頭**（勘誤已生效）。
- **回歸**：既有五科的 `past-exams/*.json` 在重跑 `npm run parse:papers` 後內容不變（以 `git diff --exit-code` 驗證）。這是「預設維持現行行為」這項設計決策的實證。
- `tests/catalog.test.ts`：`getSubjects(cert, level)` 的分流，AIoT 兩科的 `mockExam` 為 false。
- 既有測試全綠；`npm run build` 型別過關。

## 交付順序

1. **解析管線＋題庫＋測試**——網頁尚看不到 AIoT。
2. **證照維度＋UI 分流**。
3. **學習主題頁大綱**。

每階段結束跑 `npm run build && npm run test`。

## 明確不做（YAGNI）

- 考科三、考科四（術科實作）——目前不考，且無法以單選題呈現。
- AIoT 的模擬考試與試卷份次——題數未知。
- AIoT 的學習筆記（`studyNotes`）與延伸閱讀連結——本案只放官方兩層大綱。
- 為 AIoT 另建 practice bank（`session.bank = "practice"`）。
