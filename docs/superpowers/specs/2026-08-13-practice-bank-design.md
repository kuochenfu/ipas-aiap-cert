# 新題庫練習（依評鑑內容分類）— 設計

日期：2026-08-13
範圍：初級兩科（`junior-ai-basics`、`junior-genai`）各 100 題，共 200 題。中級三科列入 Backlog。

## 問題

現有刷題區的題庫由真題與少量補充題組成，`topic` 欄位幾乎全為「未分類」，使用者無法針對官方評鑑主題做有系統的練習。需要一批依《評鑑內容範圍》分類、覆蓋每個評鑑內容節點的全新題目。

## 目標

1. 各科新增一個獨立的刷題入口，題庫全新產生，**原刷題區與模擬考試的題庫完全不受影響**。
2. 題目依官方評鑑內容碼分類，各節點題數平均分配。
3. 內容納入 2026 年的法規與技術現況，情境取材自金融、醫療、工廠、教育、農業五大產業。
4. 每題附整題詳解與三個錯誤選項的逐項說明。

## 非目標

- 不改動 `src/data/index.ts` 的 `getQuestions`，不動既有題庫與模擬考試。
- 不新增「依主題篩選」的 UI。題目的 `topic` 會餵進既有的 `topicSummary`，成績頁自然按主題統計，不另做功能。
- 中級三科不在本次範圍。

## 關鍵設計決定

### 不新增第三種 Mode，改以「題庫來源」為新維度

新題庫練習的行為與現有刷題完全相同：逐題卡、作答即揭曉、三個篩選器、跳題、進度續作。差別僅在題庫來源與進度儲存。

若新增 `Mode = "practice"`，`main.ts` 內十餘處 `session.mode === "drill"` 的行為分流都需要跟著改，風險高且無回報。改為：

```ts
type Mode = "exam" | "drill";              // 不變
type Bank = "main" | "practice";           // 新增
session.bank: Bank;
```

所有 drill 的行為分流一行不改。模式選單的第三張卡使用 `data-mode="practice"` 作為點擊 token，由 `startMode` 轉譯為 `mode = "drill"` ＋ `bank = "practice"`。`data-mode` 已在 `main.ts` 的事件委派選擇器清單中，不新增 data-* 屬性。

### 進度以科目 key 加後綴隔離，不新增 localStorage key

`drillProgress` 的儲存本就是 `Record<subjectId, DrillProgress>`。新題庫練習改以 `${subjectId}:practice` 為 key，與原刷題的 `${subjectId}` 天然隔離。不新增 key、不新增模組，原刷題進度不受影響。

## 資料層

```
src/data/practice/junior-ai-basics.ts   100 題
src/data/practice/junior-genai.ts       100 題
src/data/practice/index.ts              getPracticeQuestions(subjectId): Question[]
                                        getPracticeStats(subjectId): { total, byTopic }
```

沿用既有 `Question` 型別，欄位約定：

| 欄位 | 值 |
|---|---|
| `id` | `<subjectId>-practice-qNNN`（三位數，001 起） |
| `topic` | 評鑑內容碼＋名稱，如 `L11101 AI 的定義與分類` |
| `source` | `"generated"` |
| `sourceRef` | 產業場景標記，如 `金融` |
| `difficulty` | `"易" \| "中" \| "難"` |
| `explanation` | 整題詳解 |
| `choiceExplanations` | 三個錯誤選項各一句話說明（正解不需要，詳解已涵蓋） |

## 題數分配

**junior-ai-basics（9 個節點，共 100 題）**

| 代碼 | 名稱 | 題數 |
|---|---|---|
| L11101 | AI 的定義與分類 | 11 |
| L11102 | AI 治理概念 | 11 |
| L11201 | 資料基本概念與來源 | 11 |
| L11202 | 資料整理與分析流程 | 11 |
| L11203 | 資料隱私與安全 | 11 |
| L11301 | 機器學習基本原理 | 11 |
| L11302 | 常見的機器學習模型 | 12 |
| L11401 | 鑑別式 AI 與生成式 AI 的基本原理 | 11 |
| L11402 | 鑑別式 AI 與生成式 AI 的整合應用 | 11 |

**junior-genai（7 個節點，共 100 題）**

| 代碼 | 名稱 | 題數 |
|---|---|---|
| L12101 | No Code / Low Code 的基本概念 | 14 |
| L12102 | No Code / Low Code 的優勢與限制 | 14 |
| L12201 | 生成式 AI 應用領域與常見工具 | 15 |
| L12202 | 如何善用生成式 AI 工具 | 15 |
| L12301 | 生成式 AI 導入評估 | 14 |
| L12302 | 生成式 AI 導入規劃 | 14 |
| L12303 | 生成式 AI 風險管理 | 14 |

## 內容規格

**產業場景依主題挑最合適者**，不強制平均輪流。對應原則：

| 主題性質 | 主要產業 |
|---|---|
| 隱私、合規、風險、治理 | 金融、醫療 |
| 電腦視覺、異常偵測、預測性維護 | 工廠、農業 |
| 內容生成、個人化、評量 | 教育 |
| 導入評估、成本效益、流程自動化 | 五者皆可，依情境挑 |

**2026 資訊**取自本專案先前查證過的素材（見 `src/data/studyNotes.ts` 的「補充 B」段落）：我國《人工智慧基本法》2026-01-14 公布施行、主管機關國科會、第 4 條七大原則；EU AI Act 高風險義務經 Digital Omnibus 延至 2027-12-02；MCP 與 A2A 已捐予 Linux Foundation、2026 年成立 AAIF；數位發展部 AIEC 的評測構面。

**出題品質要求**：情境題為主，避免單純名詞背誦；四個選項長度相近，錯誤選項須為「似是而非」而非明顯荒謬；不得出現「以上皆是／皆非」。

## UI

模式選單新增第三張卡：

```
新題庫練習
依評鑑主題分類 100 題・附選項解析・不計時
上次進度：第 N 題・已作答 M 題
```

進度提示的邏輯與現有刷題卡相同，讀取的是 `${subjectId}:practice` 的進度。

刷題畫面本身完全沿用現有渲染，不需改動。

## 測試

- 每科剛好 100 題。
- 每個評鑑內容碼的題數符合上表。
- id 唯一、格式符合 `<subjectId>-practice-qNNN`。
- 每題四個選項、`answer` 在 A–D、選項文字非空。
- 每題 `explanation` 非空；`choiceExplanations` 恰好涵蓋三個錯誤選項（不含正解）。
- `topic` 為合法評鑑內容碼。
- 既有 140 個測試維持通過；`getQuestions` 的回傳題數不變（222／213）以證明原題庫未受影響。

## 風險

- **內容正確性需人工複審。** 200 題全為 LLM 產出，會再增加一批待複審內容（專案目前已有四批）。將記錄於 `docs/coverage/` 與 auto-memory。
- 題目品質不均的風險以「每個評鑑內容節點獨立成批產生、逐批審查」緩解。

## Backlog（本次不做）

- **中級三科的新題庫**：`senior-ai-tech`（9 節點）、`senior-bigdata`（13 節點）、`senior-ml`（12 節點），各 100 題，共 300 題。分配方式沿用本 spec 的平均原則。
- 依評鑑主題篩選的 UI（目前靠成績頁的 `topicSummary` 間接達成）。
- 難度分佈的刻意配置（本次 `difficulty` 由出題者自行判定，不做整體配額）。
