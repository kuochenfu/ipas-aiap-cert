# 中級程式閱讀題：命題計畫（2026-10-29，已完成）

## 為什麼要補

盤點中級三科的官方真題（114 年第 2 梯次、115 年第 1 梯次，各科各 100 題）後發現：
程式題集中在**科目二、科目三每卷的最後 10–12 題**，約占兩科的 22%；
本站的 AI 命題題庫（新題庫 450 題、自編 72 題）卻**一題都沒有**。也就是說，刷新題庫完全練不到這種題型。

| 科目 | 真題中的程式題 | 比例 | 新題庫現有程式題 |
|---|---:|---:|---:|
| 科目一 senior-ai-tech | 1／100（115-1 q32，只問概念、沒有附程式碼） | 1% | 0 |
| 科目二 senior-bigdata | 22／100 | 22% | 0 |
| 科目三 senior-ml | 22／100 | 22% | 0 |

判讀標準：題目附有程式碼、console 輸出或虛擬碼，或選項本身就是程式碼。
只附公式圖的題目（例如吉尼不純度、Z 檢定的公式）不算。

## 數量：依真題比例

新增 x 題後，程式題占全科的比例 = x ／（現有題數 ＋ x）。讓它等於真題比例：

| 科目 | 現有 | 真題比例 | 新增 | 完成後的程式題比例 |
|---|---:|---:|---:|---:|
| senior-bigdata | 166 | 22% | **47** | 47／213 = 22% |
| senior-ml | 142 | 22% | **40** | 40／182 = 22% |
| senior-ai-tech | 142 | 1% | **1** | 1／143 = 1% |
| 合計 | | | **88** | |

## 節點配額：依真題的節點分布放大

真題 44 題程式題的節點分布，依比例放大到新增的題數：

**senior-bigdata（真題 22 題 → 新增 47 題）**

| 節點 | 真題 | 新增 |
|---|---:|---:|
| L22203 數據處理技術與工具 | 5 | 11 |
| L22201 數據收集與清理 | 4 | 9 |
| L22302 常見的大數據分析方法 | 4 | 9 |
| L22301 統計學在大數據中的應用 | 3 | 6 |
| L22303 數據可視化工具 | 3 | 6 |
| L22101 敘述性統計與資料摘要技術 | 1 | 2 |
| L22102 機率分佈與資料分佈模型 | 1 | 2 |
| L22103 假設檢定與統計推論 | 1 | 2 |

**senior-ml（真題 22 題 → 新增 40 題）**

| 節點 | 真題 | 新增 |
|---|---:|---:|
| L23303 模型訓練、評估與驗證 | 6 | 11 |
| L23203 深度學習原理與框架 | 6 | 11 |
| L23302 模型選擇與架構設計 | 3 | 5 |
| L23304 模型調整與優化 | 3 | 5 |
| L23301 數據準備與特徵工程 | 1 | 2 |
| L23101 機率／統計之機器學習基礎應用 | 1 | 2 |
| L23102 線性代數之機器學習基礎應用 | 1 | 2 |
| L23202 常見機器學習演算法 | 1 | 2 |

**senior-ai-tech**：L21301 數據準備與模型選擇 1 題（PyTorch 模型架構的概念題，與真題相同不附長程式）。

`assessmentTopics.ts` 的配額照上表加上去，`tests/practiceBank.test.ts` 同步更新。

## 題型配比：依真題的七種考法

| 考法 | 真題約占 | 認知層級 | 題型原型 | bigdata | ml |
|---|---:|---|---|---:|---:|
| 1. 認出程式在算什麼（含虛擬碼） | 10% | L2 | Concept Boundary | 5 | 4 |
| 2. 選出正確的語法或 API | 25% | L2 | Scenario Selection | 12 | 8 |
| 3. 填空（含引數順序） | 5% | L2–L3 | Scenario Selection | 2 | 2 |
| 4. 追蹤執行結果 | 10% | L3 | Calculation | 5 | 4 |
| 5. 看輸出下判斷 | 25% | L3 | Troubleshooting／Concept Boundary | 12 | 10 |
| 6. 找出程式流程的方法錯誤 | 15% | L3–L4 | Troubleshooting／Best Engineering Decision | 7 | 8 |
| 7. 多敘述選組合 | 10% | L3 | Multi-Statement | 4 | 4 |
| 合計 | | | | 47 | 40 |

**認知層級的硬限制**：五科的分布契約（`tests/questionBankMeta.test.ts`，方案 C）要求 L2 ≤35%、L3 ≥33%、L4 ≥15%，
而 senior-ml 現在的 L2 已經 34.5%、L3 只有 33.1%，兩邊都貼著邊界。新題的層級由上表的考法推得
（考法 1、2 為 L2；考法 3 在 ml 有 1 題算 L2；考法 6 在 bigdata 全為 L4、在 ml 為 2 題 L3 ＋ 6 題 L4；其餘為 L3）：

| 科目 | L1 | L2 | L3 | L4 | 完成後全科 L2／L3／L4 |
|---|---:|---:|---:|---:|---|
| senior-bigdata（+47） | 0 | 17 | 23 | 7 | 26.8%／36.6%／22.1% |
| senior-ml（+40） | 0 | 13 | 21 | 6 | 34.1%／37.4%／17.0% |

純記憶題（Direct Concept）不出；跨節點題至少 bigdata 5 題、ml 6 題（例如「標準化寫在切分之前」同時屬於特徵工程與驗證），
以維持跨節點 ≥15%。

## 情境：仿照真題的題組，但每題自足

真題的程式題幾乎都是題組：先給情境和資料，再連出 3–4 題。本站是逐題刷題，所以**每題都附完整的情境與程式碼**，
但同一個情境會被 3–4 題共用，讓使用者練到「讀同一份程式、回答不同層面」的感覺。

| 科目 | 情境 | 函式庫 | 涵蓋考法 |
|---|---|---|---|
| bigdata | 電商交易與客戶表 | pandas（groupby、merge、nlargest、pivot_table） | 2、3、4 |
| bigdata | 感測器時序資料 | pandas（時間索引、resample、rolling、缺值補法） | 2、4、5 |
| bigdata | 問卷與會員資料清理 | pandas（dtype、astype、duplicated、可變預設參數這類 Python 陷阱） | 4、5、6 |
| bigdata | 住院天數的分布與離群值 | pandas describe、IQR、偏態 | 5、6 |
| bigdata | 統計檢定與迴歸 | scipy.stats（ttest、poisson、binom）、statsmodels OLS summary | 3、5、7 |
| bigdata | 視覺化 | matplotlib、seaborn（選圖的程式碼、看圖的設定） | 1、2 |
| bigdata | 分類評估 | scikit-learn（confusion_matrix、classification_report、不平衡資料） | 5、6 |
| bigdata | 虛擬碼辨識 | 虛擬碼（K-means、KNN、決策樹分裂、K 折） | 1 |
| ml | 表格資料建模流程 | scikit-learn（Pipeline、StandardScaler、cross_val_score、GridSearchCV） | 2、6、7 |
| ml | 降維與分群 | scikit-learn（PCA、LDA、KMeans） | 4、5、6 |
| ml | 影像分類 CNN | PyTorch（Conv2d 輸出尺寸、Flatten、CrossEntropyLoss 吃 logits、train／eval 模式） | 2、4、6 |
| ml | 遷移學習 | torchvision（凍結 features、替換 classifier、參數量） | 2、5 |
| ml | 訓練迴圈除錯 | PyTorch（zero_grad、Loss 變 NaN、梯度裁剪、學習率排程） | 5、6 |
| ml | Keras MLP | Keras Sequential、model.summary 參數量、訓練曲線 | 4、5、7 |
| ml | 數學基礎 | NumPy（矩陣形狀、內積、廣播、Monte Carlo 估機率） | 4 |

難度參考真題：要背的語法集中在常用 API 和**引數順序**（scikit-learn 的 `fit(X, y)` 對上 statsmodels 的 `OLS(y, X)`），
真正拉開分數的是資料洩漏、評估指標、不平衡資料、正規化這類觀念放進程式情境裡考。

## 資料形狀

- 新檔 `src/data/practice/senior-bigdata.code.ts`、`senior-ml.code.ts`、`senior-ai-tech.code.ts`，
  在 `practice/index.ts` 合併（比照 AIoT 的 `.2026.ts`）。id 接續現有編號：bigdata q167 起、ml q143 起、ai-tech q143。
- `source: "generated"`、完整的 `meta`（含 `decisionBoundary`）與三條 `choiceExplanations`，與既有新題庫相同。
- 程式碼放 `figures`（`kind: "code"`），執行結果放 `kind: "output"`；選項若是一行程式碼就直接寫在選項文字，
  多行程式碼用 `choiceFigures`，選項文字寫一句摘要（例：「凍結 features 後替換 classifier[6]」）。
- 題幹寫明版本假設，例如「（pandas 2.x）」「（scikit-learn 1.5 以上）」，避免版本差異造成兩個答案。

## 品質關卡

程式題和概念題最大的不同是：**對錯可以執行出來**。這批題目要比照「可執行驗證」的標準，而不是只靠 LLM 複審。

1. **每題附一支驗證腳本。** 腳本在 `uv` 建立的固定版本環境裡執行
   （Python 3.12、pandas 2.2、NumPy 2.x、scikit-learn 1.5、statsmodels、scipy、matplotlib、seaborn、PyTorch 2.x CPU、Keras 3 以 PyTorch 為後端）。
   腳本要斷言：
   - 題目附的輸出與實際執行結果一致（數字、形狀、例外類型）。
   - 正解的程式碼能達成題目要求。
   - **每個錯誤選項確實是錯的**：會拋出例外、輸出不同結果，或違反題目條件。
     這一條最重要，程式題最常見的瑕疵是「兩段程式碼其實都能跑」。
   腳本存在 `scripts/code-questions/<題目 id>.py`，並提供 `scripts/code-questions/run.sh` 一次跑完。
   它不進 `npm run test`（CI 沒有 Python），但每次改題前後都要手動跑。
2. **既有的守衛測試全部適用**：選項長度（正解最長 ≤35%）、meta 結構、方案 C 分布、節點配額、重複題檢查。
3. **新增一條測試**：senior-bigdata 與 senior-ml 新題庫中帶程式碼附圖的題目比例 ≥20%，避免日後加題把比例稀釋掉。
4. 命題規範沿用 `docs/question-authoring.md`，包括 §2.7 改題時的三個常見錯誤。

## 產製流程

1. 先建好 `uv` 環境，確認每個情境的基礎程式都能跑。
2. 依情境分成約 6 批，每批 13–16 題，交給子代理平行命題。子代理產出：題目 JSON 與每題的驗證腳本，不碰 repo 原始碼。
3. 主流程：
   - 跑全部驗證腳本，失敗的退回重寫。
   - 跑長度與分布的檢查。
   - 逐題審查子代理點名的題目，以及所有 L4 題。
4. 用轉換腳本把 JSON 寫成 `.code.ts`，更新配額與測試，跑 `npm run build` 與 `npm run test`。

估計成本：6 個子代理，每個約 15 萬 tokens。

## 風險

- **版本漂移**：pandas 與 scikit-learn 的預設值與 API 會改（例如 `OneHotEncoder(sparse_output=)`、torchvision 的 `weights=`）。
  題目只考穩定的 API；必須依賴版本的行為就在題幹寫明版本。
- **兩段程式碼都對**：靠驗證腳本逐一執行錯誤選項來擋。
- **長度線索**：程式碼選項的長短天生不同，仍須通過選項長度的守衛測試。
- **仍屬 AI 命題**：畫面上照常標示「AI 命題・待複審」。驗證腳本只保證程式行為正確，觀念敘述與詳解仍需人工複審。

## 執行結果（2026-10-29）

88 題全數上線：senior-bigdata 47 題（q167–q213）、senior-ml 40 題（q143–q182）、senior-ai-tech 1 題（q143），
在 `src/data/practice/senior-*.code.ts`。88 支驗證腳本在 `scripts/code-questions/`，`run.sh` 全數通過。

- 子代理採「題位表」命題：每題的 id、節點、考法、認知層級、正解字母、是否跨節點、產業情境都事先指定，
  分布契約與配額因此一次到位。整合時只有三處要調：
  - 三個節點的正解字母與舊題合併後出現週期規律，各換一題的正解字母（q181、q211、q168；q168 的驗證腳本同步換字母）。
  - 科目一 q143 由 L2 改為 L3：只加 1 題 L2 就讓該科 L3 從 33.1% 掉到 32.9%，跌破下限。
- 每支腳本內嵌題目附的程式碼與輸出（多數批次的題目 JSON 是由腳本抽出這兩段組裝的），
  所以附圖與實際執行結果不會漂移。
- 主流程抽查子代理點名的約 20 題，只改了一處措辭（ml q151 C 的解析：測試集的 367 筆是複本，「數量不少」不精確）。
- 新增 `tests/codeQuestions.test.ts`：bigdata 與 ml 的程式題比例 ≥20%，題目與驗證腳本一一對應。
- **已知的小問題**：88 題中正解最長只有 14%、最短只有 8%，正解多落在中間長度。
  「去掉最長與最短、在中間兩個猜」約可拿 39 分，未達及格；併入各科新題庫後已被稀釋（全科只挑最長為 23–31 分），暫不處理。
- 版本依賴：題幹都寫明了版本假設。較依賴版本的有 pandas 2.x 的 `corr()` 與 object 欄位 `mean()`、
  statsmodels 0.14 的 `predict`／`pvalues` 例外、Keras 3 的損失函數與 `validation_split` 行為。
