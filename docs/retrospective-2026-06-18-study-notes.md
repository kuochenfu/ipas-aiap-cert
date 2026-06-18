# 回顧：學習筆記排版重構（2026-06-18）

## 目標
把五科「學習指引整理」從機械平鋪的髒文字（斷句、文字牆、重複字、亂碼數學、無層次），重構為乾淨、有層次的巢狀筆記。spec：`docs/superpowers/specs/2026-06-17-study-notes-restructure-design.md`；plan：`docs/superpowers/plans/2026-06-17-study-notes-restructure.md`。

## 成果
- **資料模型**：`StudyNoteSection.details: string[]` → 層次樹 `StudyNoteItem { text; children? }`（`src/data/types.ts`）。
- **渲染器**：`renderStudyNotes` 改遞迴巢狀 `<ul>`，每個 `text` 經 `escapeHtml`；「N 則重點」改為**葉節點計數**；節點自有文字包在 `<span class="note-text">`。
- **TTS**：`sectionSpeechText` 改讀 `.note-text`（避免巢狀 `<li>` 父項重複計入子項文字）。
- **產生器改造**：`scripts/generate-study-notes.ts` 由「平鋪產生 studyNotes.ts」改為**切片擷取器**（`npm run extract:study-slices`），把每節原始行輸出到 gitignore 的 `docs/study-slices/`；切片定位純函式抽到 `scripts/studySlice.ts`。`studyNotes.ts` 改為 LLM 重構的內容來源，勿用腳本覆寫。
- **內容**：五科 41 節全部由 LLM 依切片忠實重構，約 4,000 個文字節點、~1,090 個 children 階層。junior-ai-basics 4、junior-genai 3、senior-ai-tech 9、senior-bigdata 13、senior-ml 12。
- 全程 `npm run build`（tsc）＋ 99 測試綠燈。

## 流程
subagent-driven：每節/每科一個 implementer + 一個 reviewer + 必要時 fix。juniors 以「每科」為單位；senior 三科因節數多、單節達 1,100+ 行，改以**每個 L 主題**為實作單位、**每科一次**主題完成後做整科 review，平衡品質與 review 次數。

## 學到的事（給未來）
1. **pdftotext 的切片比想像難**：senior-ai-tech 章首有「標題清單叢集」（3.1–3.4 連續標題）＋裸數字頁眉，導致天真的「首個 section-number」切片只抓到 8 行。修法：`sliceSection` 改為在所有候選起點中**取產出最長的切片**，自然跳過叢集。教訓：解析髒 PDF 要對「同一 section number 多次出現」有韌性。
2. **LLM 重構最大的風險是「忠實度漂移」，不是格式**：自動測試只能擋格式（tsc + 巢狀/計數/轉義），擋不住內容。實際 review 抓到多起：漏掉列舉清單中的一項（L112 變異數）、把語意標題改名（L123）、靜默「修正」原文（記憶性→無記憶性、Type II→Type I、源代碼→原始碼）、漏掉整段範例（4.2 HR 範例）。**對策**：(a) 每個列舉清單「數來源項數 vs 產出項數」；(b) 明訂錯字政策。
3. **錯字政策需使用者拍板**：最後定為「修明顯正字/拼字/空格錯誤；保留實質/語意內容逐字、把疑點寫進複審報告（不要 inline 註記污染學習文字）」。這條在剩餘三科一致套用，省下反覆爭論。
4. **同檔多寫者必須序列化**：所有內容 agent 都改 `studyNotes.ts`，無法平行（會衝突）；read-only 的 reviewer 可與 implementer 併行（讀抽出的 block 檔）。這是本次最大的時間瓶頸——以「每主題序列、每科一次 review」緩解。
5. **檔案交接、低 token 不等於偷工**：L232（2,500 行來源）回報僅 20k token 一度像偷工，但產出 738 節點、build/test 綠、key 邊界完整——以「抽出 block 量測節點數/children」獨立驗證才可信，勿只看 token 數。

## 待辦（人工複審）
所有內容皆 LLM 重構，**正確性需人工複審**（與詞彙表同政策）。各節對照來源見 `.git/sdd/task-*-report.md`。需優先複審的原文疑點（已忠實保留）：
- junior L112：Type I/II 標記疑誤；L123 (3) 標題與 (2) 重複。
- senior-ai-tech：GloVe「是…而是…」語病；4.2「3. AI」、4.3「3. Bias Ethics」標題為重建。
- senior-bigdata：L221/3.2「記憶性（Memoryless）」原文疑漏「無」；Poisson/Normal/Exp 的 E(X)/Var(X) 為原文空白依上下文補入（λ,λ,μ,σ²,1/λ,1/λ²）；數個無題小節標題為重建。
- senior-ml：「貝式」（疑為貝氏）、「學習數入數據」（疑為輸入）、L233/5.3 Recall = TP/(TP+FP)（與 Precision 相同，疑應為 TP/(TP+FN)）、「示例如」「技術提」殘字、「5. AI」標題重建。
