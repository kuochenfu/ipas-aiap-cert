# 選項長度改題工具

LLM 命題有個系統性破綻：正解的長度名次會洩題（先是「挑最長」，修完後又變成「挑第二長」）。
這裡是 2026-10-28～11-04 六輪改題所用的工具，量測、成因與每一輪的教訓見
`docs/retrospective-2026-10-28-longest-option-cue.md`。守衛測試是 `tests/choiceLength.test.ts`。

前五輪的工具放在暫存目錄、事後遺失，第六輪只能照文件重寫，所以現在進版控。

## 目標

正解在「最長／第二長／第三長／最短」四個長度名次上**大致各占 25%**（字數去空白計算、同長平分），
「挑中間兩個」≤35 分。**不要只給上下限**：只限制最長與最短，偏差會擠到下一個沒被限制的名次。

## 流程

```bash
# 1. 量測（預設全部 13 個 LLM 題庫）
npx tsx scripts/choice-length/measure.ts

# 2. 分批匯出（每批 45–60 題；預設排除中級程式閱讀題）
npx tsx scripts/choice-length/export.ts <工作目錄>/batches aiot-junior-iot:practice:3 senior-ml:generated

# 3. 每批交給一個子代理，指示用下方的「給子代理的指示」。子代理只產出 patch，不碰原始碼，
#    並用 check.ts 自我驗收到 0 錯誤：
npx tsx scripts/choice-length/check.ts <batch.json> <patch.json> [--rank2 14-25]

# 4. 主流程審查：逐題看子代理點名的題目（干擾項可能也成立），以及所有精簡過正解的題目（看句式）。

# 5. 套用並逐欄比對（兩支都會報失敗，不可略過）
npx tsx scripts/choice-length/apply.ts <工作目錄>/patches/*.json
npx tsx scripts/choice-length/verify.ts <工作目錄>/patches/*.json

# 6. 重新量測，然後
npm run build && npm run test
```

批次檔與 patch 是一次性的中間產物，放在暫存目錄即可，不要提交。

**中級程式閱讀題**（`practice/senior-*.code.ts`）預設不匯出：它們的選項字母寫在
`scripts/code-questions/<id>.py` 驗證腳本裡，改選項要同步改腳本並重跑 `run.sh`。
不動它們時，其餘題目的目標要補償它們的分布（用 `--rankN`）。

## 給子代理的指示

> 把下面這段連同批次檔、patch 輸出路徑、該批目前的分布與目標一起交給子代理。

---

這是 iPAS 認證練習網站（繁體中文，台灣用語）的 LLM 命製題庫。目標是把「正解長度名次」調成四個名次各約 25%。

**你要做的**

1. 讀批次 JSON（每題有 id、題幹、正解字母、選項與字數、`answerRank`＝正解目前的長度名次 1–4、詳解、選項解析、干擾類型、判斷分界）。
2. 挑出**夠用的少數題目**來改，讓整批的名次分布落進目標。原本就平衡、不影響分布的題目不要動。
3. 輸出 patch JSON，執行 check.ts，反覆修改直到 **0 錯誤**、警告都處理過（或確認是誤報）：

```
npx tsx scripts/choice-length/check.ts <batch.json> <patch.json>
```

patch 形狀（只寫有改的題與欄位）：

```json
{ "<題目id>": { "choices": { "B": "新的選項文字" }, "choiceExplanations": { "B": "新的解析" },
                "distractorTypes": { "B": "Partial Truth" }, "explanation": "整則新詳解（只在必要時）" } }
```

**不得改**：題幹、正解字母、判斷分界。不要修改 repo 裡的任何檔案，只寫你的 patch。

**怎麼改才對**

1. **不要只是把另一個干擾項加長到剛好超過正解。** 那正是造成「挑第二長」的改法。要讓正解退到第三長或最短，
   通常是把一兩個較短的干擾項寫得更具體（加上看似合理但關鍵處錯的條件、機制或數字），或在不改意思的前提下精簡正解的贅字。
2. **干擾項必須仍然明確是錯的。** 最常見的實質錯誤是「干擾項本身其實也是真敘述」，題目因此有兩個說得通的答案。
   每改一個干擾項都問：一位懂行的考生能不能為它辯護？能的話就換一種錯法。
3. **不要只靠絕對語造錯**（「必定」「完全」「一定」「即可」）。錯應該錯在概念、機制、條件或取捨上。帶絕對語的干擾項數量不得增加。
4. **精簡正解時，句式要和其他選項一致。** 曾經把正解縮成名詞短語、另外三個都是完整句子，句式不同本身就洩題。
5. **選項改了，解析就要回應新的說法。** 有 `choiceExplanations` 的題目：改了哪個干擾項就重寫它的解析。
   干擾類型只在錯誤性質真的改變時才改，值必須是 Neighbor Concept／Correct in Different Context／Layer Confusion／
   Partial Truth／Overgeneralization／Terminology Swap／Wrong Trade-off 之一。兩者都不得含正解的鍵。
6. **沒有手寫選項解析的題目（中級 generated）**：畫面上的選項解析是從主詳解以 `（A）` 這種括號點名切出來的。
   改了干擾項就要整則重寫 `explanation`，正解與每個錯誤選項都以 `（X）` 點名並說明錯在哪裡。check.ts 會告訴你哪個選項切不出來。
7. **check.ts 的簡體字警告可能是誤報**，不要為了消警告把正確術語改掉。
8. 用台灣繁體中文與台灣的技術用語，標點用全形。

**回報**（主流程只看得到這則）：check.ts 的前四行（改前 → 改後）、改了幾題、**請主流程複核的題目**
（改過的干擾項可能也說得通、或技術細節不確定，逐題列 id 與理由）、**精簡過正解文字的題目 id**、判定為誤報而保留的警告。
