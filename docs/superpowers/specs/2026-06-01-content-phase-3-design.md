# 內容階段 3：科目1 補題 + 中級三科詳解與新題 — 設計

- 日期：2026-06-01
- 範圍：4 個獨立內容單元（初級科目1 補題、中級三科詳解＋新題）
- 沿用內容階段 2（junior-genai）已核准的「產生＋複審」方法，見 `docs/superpowers/specs/2026-06-01-junior-genai-explanations-design.md`。

## 背景現況

| 科目 | 真題 | 詳解 | 新題 | 官方主題 |
|---|---|---|---|---|
| junior-ai-basics（科目1） | 100 | ✅ 已完成（不動） | 12 → 目標 24 | L111–L114 |
| junior-genai（科目2） | 100 | ✅ | 24 | L121–L123 |
| senior-ai-tech | 50 | ❌ 無 | 0 | L211–L213 |
| senior-bigdata | 50 | ❌ 無 | 0 | L221–L224 |
| senior-ml | 50 | ❌ 無（q45 選項為圖片，文字空） | 0 | L231–L234 |

- 中級三科各只有 1 份真題（114年第2次，50 題），目前 `explanation: ""`、`topic: "未分類"`。
- 科目1 既有 12 新題用自訂 topic（機器學習基礎／深度學習等），非官方標題。
- `Question` 型別已含 `sourceRef`、`source`、`topic`、`difficulty`。

## 設計決策（已與使用者確認）

1. **中級三科本輪＝詳解全補（各 50）＋ 新題第一批（各 24）**。新題最終目標＝真題同數（各 50），本輪後續分批成長。
2. **科目1 補 12 題到 24**（`gen-q013`–`gen-q024`），並把**既有 12 題 topic 一併改為官方 L111–L114 標題**，使科目1 新題主題一致且有意義。只動 `generated/junior-ai-basics.ts` 的 topic 欄，**不動其 100 詳解**。
3. **每科一份複審工作表（不上線）＋ annotations.tsv sidecar**，低信心置頂；沿用 junior-genai 欄位與信心度 rubric。
4. **真題 topic 不回填**，維持「未分類」；L 章節只存在於工作表。
5. **一份 spec、一份 plan、最後一次合併部署**；各單元獨立 commit，便於檢視。

## 官方主題標題字串（topic 欄須完全一致）

- **junior-ai-basics**：`人工智慧概念`(L111)、`資料處理與分析概念`(L112)、`機器學習概念`(L113)、`鑑別式 AI 與生成式 AI 概念`(L114)
- **senior-ai-tech**：`AI 相關技術應用`(L211)、`AI 導入評估規劃`(L212)、`AI 技術應用與系統部署`(L213)
- **senior-bigdata**：`機率統計基礎`(L221)、`大數據處理技術`(L222)、`大數據分析方法與工具`(L223)、`大數據在人工智慧之應用`(L224)
- **senior-ml**：`機器學習基礎數學`(L231)、`機器學習與深度學習`(L232)、`機器學習建模與參數調校`(L233)、`機器學習治理`(L234)

## 交付物

| 檔案 | 動作 | 內容 |
|---|---|---|
| `src/data/explanations/senior-ai-tech.ts` | 填 50 條 | 真題 id → 詳解 |
| `src/data/explanations/senior-bigdata.ts` | 填 50 條 | 真題 id → 詳解 |
| `src/data/explanations/senior-ml.ts` | 填 50 條 | 真題 id → 詳解（q45 依題幹+答案，工作表標低信心並註明圖片選項限制） |
| `src/data/generated/junior-ai-basics.ts` | 12→24 + relabel topic | 新增 gen-q013–q024；全 24 題 topic 改官方標題 |
| `src/data/generated/senior-ai-tech.ts` | 填 24 | 第一批 B1（L211/L212/L213 各 8） |
| `src/data/generated/senior-bigdata.ts` | 填 24 | 第一批 B1（L221–L224 各 6） |
| `src/data/generated/senior-ml.ts` | 填 24 | 第一批 B1（L231–L234 各 6） |
| `docs/superpowers/review/<subjectId>-review.md` ×4 | 建立 | 工作表（低信心置頂） |
| `docs/superpowers/review/<subjectId>-annotations.tsv` ×4 | 建立 | sidecar |
| `tests/data.test.ts` | 擴充 | 見下 |

工作表涵蓋範圍：科目1 工作表＝其 24 新題；中級三科工作表＝各 50 詳解 ＋ 24 新題。

## 新題第一批主題/難度規則

- 各科 24 題，topic 須為該科官方標題之一，分配：3 主題科目 8×3、4 主題科目 6×4。
- 難度（易/中/難）混合，勿全同。
- 正解字母分布盡量平均（A/B/C/D），勿大量集中單一字母。
- 每題附正解＋詳解（解釋對與錯，錨定章節），`source: "generated"`、正確 `subjectId`。
- 不捏造統計數字、法條編號或無法查證的產品規格。

## 詳解 rubric（同 junior-genai）

- 解釋官方答案為何正確、其他選項為何錯，錨定對應官方章節概念。
- 不引入無法驗證的外部事實。長度 2–4 句，文風比照 `explanations/junior-genai.ts`。
- 不確定／題意模糊／選項殘缺者標**低信心**並於工作表「依據」註明，不硬掰。
- 官方答案視為 ground truth，不質疑、不更動 JSON。

## sidecar 與工作表規格（沿用 junior-genai）

- annotations.tsv 標頭：`id\ttype\tsourceRef\tanswer\tLchapter\tconfidence\t依據`。past 列 type=`past`、sourceRef=年次題號；new 列 type=`new`、sourceRef=`B1`。
- 工作表欄位：`id｜年次題號｜答案｜L章節｜信心｜依據(一句)｜詳解全文｜狀態｜批次｜依據資料`，依信心 `低→中→高` 排序；`詳解全文` 由資料層輸出（與 .ts 同一份文字），用 throwaway tsx 腳本生成、腳本不入版控。

## 測試（擴充 `tests/data.test.ts`）

比照 junior-genai 模式，新增：

- **三個 senior 科目各一組**：
  - 50 真題詳解皆非空（past.length===50、無空詳解）。
  - 新題數 ≥16。
  - 新題 id 符合 `^<subjectId>-gen-q\d{3}$` 且唯一。
  - 新題 topic ∈ 該科官方標題集合。
- **junior-ai-basics**：
  - 新題數 ===24。
  - 新題 topic ∈ {L111–L114 四個官方標題}（強制 relabel 後全 24 一致）。

既有「題庫完整性」泛科測試（四選項、答案 A-D、id 唯一、subjectId 相符）自動涵蓋所有新題。

## 流程

1. 新分支 `content/phase-3-explanations`。
2. 依單元逐一實作（每單元：詳解／新題 + sidecar + 工作表），subagent 兩階段審查。
3. 擴充測試；`npm run build` + `npm run test` 全綠。
4. 瀏覽器實測：四科題數正確、刷題揭曉顯示詳解、新題可作答。
5. 一次合併 `main` 推送自動部署；更新回顧文件。

## 不碰的東西（不變式）

- 所有 `past-exams/*.json`（真題 topic 維持「未分類」）。
- junior 兩科已完成詳解、junior-genai 24 新題與其工作表。
- 考試規則常數、localStorage key `ipas-aiap-misses`、三來源合併機制、UI、`Question` 型別。

## YAGNI / 範圍邊界

- 中級新題本輪各 24（最終 50，分批）；不一次衝 50。
- 不回填真題主題、不改型別、不動 UI、不做多代理事實查核（人工複審＋信心度旗標為品質關卡）。
