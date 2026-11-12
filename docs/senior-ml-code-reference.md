# 中級科目三「機器學習技術與應用」程式速查：來源、高機率函式與真題對照

> 本檔由 `npm run report:code-sheet` 自 `src/data/codeSheet.senior-ml.ts` 產生，勿手改。
> 網站上的對應頁面：學習主題 → AI 應用規劃師 → 「中級科目3 程式速查」。

範圍：114 年第二次、115 年第一次兩份真題中所有附程式碼的題目，共 23 題（兩卷合計 100 題）。

## 一、程式來源（最新穩定版）

2026-11-12 以 PyPI 查核最新穩定版；文件連結一律指向官方 stable 版本（查核時全數回應 200）。

| 套件 | 最新穩定版 | 發布日 | 官方文件 | 備註 |
|---|---|---|---|---|
| scikit-learn | 1.9.1 | 2026-09-10 | https://scikit-learn.org/stable/ |  |
| NumPy | 2.5.4 | 2026-10-10 | https://numpy.org/doc/stable/ |  |
| PyTorch | 2.15.0 | 2026-10-28 | https://docs.pytorch.org/docs/stable/index.html |  |
| torchvision | 0.29.2 | 2026-10-28 | https://docs.pytorch.org/vision/stable/index.html |  |
| Keras | 3.15.1 | 2026-07-29 | https://keras.io/api/ |  |
| TensorFlow | 2.21.0 | 2026-03-06 | https://www.tensorflow.org/api_docs/python/tf | 2.16 起 tf.keras 就是 Keras 3，考卷的 tensorflow.keras 寫法以 Keras 3 對照 |
| pandas | 3.1.1 | 2026-11-04 | https://pandas.pydata.org/docs/ | 真題只出現在載入資料（DataFrame 形式的 X），未直接考 API |

**驗證方式**：以上表版本建立獨立環境（Python 3.12；Keras 以 torch 後端執行），實際執行本檔每一項程式行為宣稱
（例如 `cross_val_score(scoring="f1")` 在多類別資料的結果、`model.requires_grad = False` 是否凍結參數、VGG16 參數量）。
TensorFlow 2.21.0 未實跑：TF 2.16 起 `tf.keras` 即 Keras 3，考卷的 `tensorflow.keras` 寫法以 Keras 3.15.1 對照。
觀念敘述由 AI 整理，尚未經人工查核。

## 二、使用機率極高的程式函式與理由

排序：**必考**＝兩份真題都考過，或同一份考了兩題以上；**高機率**＝真題考過一次，或雖未考但屬評鑑內容的核心操作。

### 必考

1. **`cross_val_score(estimator, X, y, cv, scoring)`**（scikit-learn）
   - 為什麼：兩份真題共考 3 題，是評鑑內容「模型訓練、評估與驗證」唯一直接被考的 API；同一段程式只要換 cv 或 scoring 就能出新題。
   - 考點：回傳每一折的分數陣列，.mean() 才是平均；分類器給整數 cv 時內部用 StratifiedKFold（不洗牌）。
   - 考過：115-1 第 44 題、115-1 第 45 題、114-2 第 47 題
2. **`StratifiedKFold／KFold／RepeatedStratifiedKFold`**（scikit-learn）
   - 為什麼：兩份真題都考「哪幾種切法能保持類別比例」，是不平衡資料的基本功。
   - 考點：Stratified 保持每一折的類別比例；KFold 只等分、不分層；Repeated 版本重複多次分層切割。
   - 考過：115-1 第 45 題、114-2 第 47 題
3. **`StandardScaler｜X.mean(axis=0)、X.std(axis=0)`**（scikit-learn）
   - 為什麼：兩份真題都考資料縮放：一題手寫 z-score 標準化，一題影像除以 255.0；考點都是「這個轉換的結果長什麼樣」。
   - 考點：axis=0 沿著列方向計算，得到每個特徵（每一欄）各自的平均與標準差；z-score 後平均 0、標準差 1，數值可以超出 0~1（實測最小值約 −3.8）。
   - 考過：114-2 第 48 題、115-1 第 46 題
4. **`凍結：param.requires_grad = False＋換分類頭`**（PyTorch）
   - 為什麼：兩份真題都考遷移學習的凍結寫法（共 3 題），是實務上最常用的深度學習技巧。
   - 考點：凍結全部參數後換掉最後一層＝特徵萃取（新層預設可訓練）；只凍結 model.features 則卷積層不動、整個 classifier 都訓練。微調時學習率要小（如 1e-4），避免破壞預訓練特徵。
   - 考過：115-1 第 42 題、115-1 第 43 題、114-2 第 45 題
5. **`torchvision.models.resnet50／vgg16(weights=…)`**（torchvision）
   - 為什麼：兩份真題都以載入預訓練模型開場，要知道換哪一層、那一層的輸入維度是多少。
   - 考點：ResNet50 的最後一層是 model.fc，輸入 2048；VGG16 是 model.classifier[6]，4096 → 1000。VGG16 共 13 層卷積＋3 層全連接，138,357,544 個參數。
   - 考過：115-1 第 42 題、114-2 第 42 題、114-2 第 44 題、114-2 第 45 題
6. **`參數量與運算量：nn.Linear／nn.Conv2d／summary`**（PyTorch）
   - 為什麼：114 年第二次以一張 VGG16 summary 連出 3 題，算參數量是可以穩拿的計算題。
   - 考點：全連接層參數最多（第一個 FC 就有 1 億多），卷積層運算量（FLOPs）最多；參數量都包含 bias。
   - 考過：114-2 第 42 題、114-2 第 43 題、114-2 第 44 題
7. **`輸出層 activation × compile(loss=…) 配對`**（Keras）
   - 為什麼：兩份真題共 3 題，一定會考：任務類型決定輸出層，標籤格式決定損失函數。
   - 考點：多類別＋one-hot 標籤：softmax＋categorical_crossentropy；多類別＋整數標籤：softmax＋sparse_categorical_crossentropy；二元：Dense(1, sigmoid)＋binary_crossentropy。
   - 考過：115-1 第 40 題、115-1 第 46 題、114-2 第 49 題
8. **`Dense(units, activation)｜model.summary() 參數量`**（Keras）
   - 為什麼：summary 填空是穩定題型；公式只有一條，算錯通常是忘了 bias。
   - 考點：參數＝(輸入＋1)×輸出：輸入 9 → Dense(10) 是 100，Dense(10) → Dense(10) 是 110，Dense(10) → Dense(1) 是 11。
   - 考過：114-2 第 49 題、115-1 第 40 題
9. **`BatchNormalization()／Dropout(rate)`**（Keras）
   - 為什麼：兩份真題都考：一題問 Keras 層的作用，一題把 Dropout 用 NumPy 手寫出來要你認。
   - 考點：Dropout(0.25) 訓練時把 25% 的輸出設為 0、其餘放大為 1/(1−0.25) 倍（實測 1.333），推論時不作用；BatchNormalization 穩定每層輸入分布，緩解梯度消失／爆炸。
   - 考過：115-1 第 47 題、114-2 第 39 題

### 高機率

1. **`make_pipeline(前處理, 模型)｜防資料洩漏`**（scikit-learn）
   - 為什麼：115 年第一次直接考「先對全資料做 LDA 再交叉驗證」的洩漏；凡是前處理要 fit 的（降維、標準化、特徵選擇）都會遇到同一個問題。
   - 考點：前處理的 fit 只能看到訓練折；包進 Pipeline 後，cross_val_score 會在每一折重新 fit 整條流程。
   - 考過：115-1 第 44 題
2. **`PCA(n_components)：fit → transform → inverse_transform`**（scikit-learn）
   - 為什麼：降維是評鑑內容「常見機器學習演算法」的固定項目，真題以 PCA 降噪的完整流程考「哪一行設定錯了」。
   - 考點：n_components 給整數是保留幾個成分，給 0~1 的小數是保留多少比例的變異；不給就保留全部，投影再還原等於原封不動。
   - 考過：114-2 第 46 題
3. **`LinearDiscriminantAnalysis.fit_transform(X, y)｜KNeighborsClassifier(n_neighbors)`**（scikit-learn）
   - 為什麼：三題程式都以 KNN 當分類器、其中一題前面接 LDA 降維；它們是題目的布景，但不認得就讀不懂程式。
   - 考點：LDA 是監督式降維，fit 需要 y，最多降到「類別數 − 1」維（iris 三類 → 2 維）；KNN 的 fit 只是把資料存起來，預測時才算距離。
   - 考過：115-1 第 44 題、115-1 第 45 題、114-2 第 47 題
4. **`mean_squared_error／root_mean_squared_error／mean_absolute_error／r2_score`**（scikit-learn）
   - 為什麼：真題把評估指標寫成一個手寫函式要你認；四種迴歸指標的公式只差在平方、開根號、絕對值。
   - 考點：sum((y_true − y_pred) ** 2) / len(y_true) 是 MSE；開根號是 RMSE；改成絕對值是 MAE。
   - 考過：114-2 第 38 題
5. **`v1 * v2 vs np.dot(v1, v2)／v1 @ v2`**（NumPy）
   - 為什麼：評鑑內容「線性代數之機器學習基礎應用」的程式版本；逐元素與內積是最常被拿來對調的兩件事。
   - 考點：[1,2,3] * [4,5,6] 逐元素得 [4 10 18]；np.dot 內積得 32。NumPy 2 起純量會顯示成 np.int64(32)，真題的正解選項就是這個寫法。
   - 考過：114-2 第 40 題
6. **`np.linalg.inv／det／eig`**（NumPy）
   - 為什麼：同一題的錯誤選項就是把三個函式的功能對調；記住名字對應即可拿分。
   - 考點：inv 反矩陣、det 行列式（[[1,2],[3,4]] 為 −2）、eig 特徵值與特徵向量。
   - 考過：114-2 第 40 題
7. **`布林遮罩：(arr % 2 == 0)、A & B、.sum()`**（NumPy）
   - 為什麼：評鑑內容「機率／統計之機器學習基礎應用」以蒙地卡羅模擬出題，條件機率是固定考點。
   - 考點：比較運算得到布林陣列，& 取交集，.sum() 數 True 的個數；P(A|B) = (A & B).sum() / B.sum()，實測約 0.667（理論 2/3）。
   - 考過：114-2 第 41 題
8. **`np.random.seed／randint／binomial／normal`**（NumPy）
   - 為什麼：三題程式都用亂數造資料：擲骰、Dropout 遮罩、加雜訊。看不懂參數就看不懂題目。
   - 考點：randint(1, 7) 上界不含，產生 1~6；binomial(1, p) 產生 0／1 遮罩，1 的機率是 p；normal(digits.data, 4) 以原值為平均、標準差 4 加雜訊。
   - 考過：114-2 第 41 題、114-2 第 39 題、114-2 第 46 題
9. **`訓練迴圈：zero_grad → forward → loss → backward → clip_grad_norm_ → step`**（PyTorch）
   - 為什麼：PyTorch 沒有 fit()，每份程式都要自己寫這五步；問「某個操作插在哪裡」是最自然的出題方式。
   - 考點：梯度裁剪要在 backward 之後（梯度才存在）、step 之前（才會影響這次更新）。實測一次異常梯度範數約 121 萬，裁剪後為 1.0。
   - 考過：115-1 第 50 題
10. **`nn.CrossEntropyLoss()｜輸出層給 logits`**（PyTorch）
   - 為什麼：多類別分類的標準損失；「輸出層要不要加 Softmax」在 PyTorch 與 Keras 的答案剛好相反，是出題熱點。
   - 考點：內部已含 log_softmax，輸出層不加任何激活函數、維度＝類別數；標籤給類別索引即可。
   - 考過：115-1 第 20 題
11. **`transforms.Compose／RandomHorizontalFlip／RandomRotation／ColorJitter`**（torchvision）
   - 為什麼：資料增強是影像任務的標配，題目考的是「這個增強跟任務語意衝不衝突」。
   - 考點：Compose 依序套用；水平翻轉會把 b 變 d、p 變 q，有方向語意的資料（文字、數字、交通號誌的左右轉）不能用。
   - 考過：115-1 第 41 題
12. **`model.train()／model.eval()／torch.no_grad()`**（PyTorch）
   - 為什麼：真題還沒考，但模型只要有 Dropout 或 BatchNorm，推論前忘了 eval() 就會出錯；這是 PyTorch 讀程式題最自然的下一題。
   - 考點：eval() 讓 Dropout 停用、BatchNorm 改用訓練期間累積的統計量；no_grad() 不記錄計算圖，省記憶體。兩者作用不同，推論時要一起用。
   - 考過：尚未（高機率延伸）
13. **`Conv2D／MaxPooling2D／Flatten`**（Keras）
   - 為什麼：CIFAR-10 的 CNN 是最經典的考卷程式，題目逐層問「這層做什麼、輸出 shape 多少」。
   - 考點：Conv2D(32, (3,3), padding="same") 對 (32,32,3) 的輸出是 (32,32,32)：長寬保住、通道數變濾波器數；MaxPooling2D((2,2)) 長寬減半；Flatten 把 3D 特徵圖攤成 1D。
   - 考過：115-1 第 47 題
14. **`keras.utils.to_categorical(y, num_classes)｜x / 255.0`**（Keras）
   - 為什麼：影像資料前處理的兩行固定寫法，真題把六個敘述混在一起要你挑對。
   - 考點：to_categorical([6], 10) 得到第 6 個位置為 1 的 one-hot 向量，搭配 softmax 與 categorical_crossentropy；像素除以 255.0 縮到 0~1。
   - 考過：115-1 第 46 題
15. **`model.compile／fit(validation_data)／History 與 EarlyStopping`**（Keras）
   - 為什麼：學習曲線判讀每卷必考，程式端就是 fit 回傳的 History。
   - 考點：history.history["accuracy"] 與 ["val_accuracy"] 畫成兩條線：訓練持續上升、驗證停滯或下降且差距擴大，就是過擬合。
   - 考過：115-1 第 48 題

## 全局圖：機器學習 Pipeline（系統角度）

考卷上的程式碼都是整條流程的一個切片。先看自己在哪一步，再問三件事：這一步能看到哪些資料、產出要交給誰、出錯時要到哪一步才會發現。

```
【定義與資料】1 問題定義與指標 → 2 資料取得與切分 → 3 前處理與特徵工程
【建模】4 模型選擇與架構 → 5 訓練 → 6 評估與驗證 → 7 調整與優化
【上線】8 部署與監控
↺ 6 → 7：評估不達標 → 調整；調整無效時再往回到前處理或模型選擇
↺ 8 → 2：監控到資料漂移或指標下滑 → 回到資料端重新收集、切分、訓練
【貫穿全程】資料邊界・可重現・一致性・成本
```

### 1. 問題定義與指標（定義與資料）

- 做什麼：判斷是分類、迴歸還是多標籤，先定評估指標與一個簡單的基準模型（例如 KNN，或迴歸時直接預測平均值）。
- 系統觀念：任務型態一次決定三件事：輸出層、損失函數、評估指標，後面每一步都從這裡往下推。指標要對應錯誤的業務代價：漏掉瑕疵與誤判正常品，成本通常差很多。
- 出錯的代價：指標選錯，後面每一步都在最佳化錯的目標。瑕疵只占 1% 時看準確率，全部猜「正常」也有 99%。
- 本頁函式：`輸出層×損失`、`MSE／RMSE`、`LDA／KNN`

### 2. 資料取得與切分（定義與資料）

- 做什麼：載入資料後第一件事就是切分；類別不平衡用分層切分，並固定亂數種子。
- 系統觀念：切分畫出整條流程的資料邊界：測試集鎖起來，最後只用一次。類別不平衡要分層；時間序列依時間切；同一位使用者或病人的資料不能同時出現在訓練與測試兩邊。
- 出錯的代價：切分錯了不會報錯，只是之後的分數全部失真，而且要到上線後才會發現。
- 本頁函式：`StratifiedKFold`、`亂數種子`

### 3. 前處理與特徵工程（定義與資料）

- 做什麼：標準化或縮放到 0~1、把標籤轉成 one-hot、用 PCA 降維或降噪；影像任務再加資料增強。
- 系統觀念：前處理的參數（平均、標準差、主成分）是從訓練資料學出來的，屬於模型的一部分：只能在訓練資料上 fit，要和模型一起存檔，上線時套用同一組參數（訓練與推論一致）。資料增強只用在訓練集，而且不能破壞標籤的語意。
- 出錯的代價：資料洩漏讓離線分數虛高；訓練與線上的前處理不一致，是上線後準確率下滑的常見原因。
- 本頁函式：`StandardScaler`、`Pipeline`、`PCA`、`np.linalg`、`to_categorical`、`transforms`、`布林遮罩`

### 4. 模型選擇與架構（建模）

- 做什麼：先用簡單模型建立基準，再決定要不要換深度模型；資料少時載入預訓練模型，換掉最後一層。
- 系統觀念：架構決定成本：參數量決定記憶體與模型檔大小，運算量（FLOPs）決定延遲。全連接層吃參數，卷積層吃運算。底層都是矩陣乘法，所以讀得懂 shape 就讀得懂架構。
- 出錯的代價：一開始就用大模型，就無法判斷多出來的複雜度值不值得；模型做完才發現部署端放不下。
- 本頁函式：`預訓練模型`、`Conv2D`、`Dense／summary`、`參數量`、`np.dot`

### 5. 訓練（建模）

- 做什麼：PyTorch 自己寫訓練迴圈，Keras 呼叫 compile 與 fit；遷移學習時決定凍結哪些層。
- 系統觀念：迴圈順序固定，放錯位置不會報錯，只會學不好。數值穩定要靠整套設定一起顧：損失函數直接吃 logits、梯度裁剪、BatchNorm、合適的學習率，都是在防止 NaN。凍結哪些層、學習率多小，決定能保住多少預訓練知識。
- 出錯的代價：訓練了好幾個小時才發現 loss 變成 NaN；沒有固定亂數種子，結果無法重現。
- 本頁函式：`訓練迴圈`、`CrossEntropyLoss`、`凍結參數`、`BN／Dropout`

### 6. 評估與驗證（建模）

- 做什麼：用交叉驗證回報平均與標準差，畫學習曲線，評估前把模型切到推論模式。
- 系統觀念：評估方式比模型更常出錯：scoring 與任務要相符，前處理要放在每一折裡重新 fit，驗證集用來挑模型，測試集只用來報告。學習曲線同時用來診斷問題：落差擴大是過擬合，兩條線都偏低是欠擬合。
- 出錯的代價：用錯 scoring 會得到 nan 或錯的數字；在同一份驗證集上反覆挑選，分數會過度樂觀。
- 本頁函式：`cross_val_score`、`MSE／RMSE`、`fit／EarlyStopping`、`eval／no_grad`

### 7. 調整與優化（建模）

- 做什麼：過擬合時用 Dropout、正則化、資料增強或 EarlyStopping；欠擬合時加大模型或訓練更久；遷移學習則解凍後段微調。
- 系統觀念：每次只改一個變數，才知道是哪個改動有效。超參數搜尋本身也在「看」驗證集，搜得越多，越需要一份完全沒碰過的測試集。GridSearchCV 直接吃 Pipeline，前處理會跟著每一折重新 fit。
- 出錯的代價：沒有診斷就盲目調參；在驗證集上調過頭，是另一種形式的資料洩漏。
- 本頁函式：`BN／Dropout`、`fit／EarlyStopping`、`凍結參數`、`Pipeline`

### 8. 部署與監控（上線）

- 做什麼：推論時開 eval() 與 no_grad()，前處理沿用訓練時的參數，並記錄延遲、記憶體、輸入分布與線上指標。
- 系統觀念：上線的是「前處理＋模型」整條 pipeline，不只是一個權重檔。要事先定好延遲與記憶體預算；真實資料的分布會變，監控到資料漂移時就要回到資料端重新收集、重新訓練。
- 出錯的代價：離線好、線上差；模型悄悄退化，卻沒有人發現。
- 本頁函式：`eval／no_grad`、`預訓練模型`、`參數量`、`StandardScaler`

### 貫穿全程

- **資料邊界**：每一步都要問：誰在什麼時候看得到哪份資料。訓練資料用來 fit，驗證資料用來挑模型，測試資料只用一次。
- **可重現**：固定亂數種子，並記錄套件版本與資料版本；本頁的版本表就是這個目的。
- **一致性**：訓練與推論要用同一套前處理與模式：scaler、weights.transforms()、eval()。
- **成本**：參數量對應記憶體，運算量對應延遲，資料量對應訓練時間；每個選擇都在花這三種預算。

## 三、真題考過的程式題 × 函式 × 實務應用

每一題列出用到的函式、考點、實務上的用途與官方文件連結。

### 114-2 第 38 題

> 附圖程式碼所計算的是哪一類型的評估指標？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `mean_squared_error／root_mean_squared_error／mean_absolute_error／r2_score` | sum((y_true − y_pred) ** 2) / len(y_true) 是 MSE；開根號是 RMSE；改成絕對值是 MAE。 | 需求預測、房價與能耗預測的模型比較；有離群值時 MAE 比 MSE 穩。 | [mean_squared_error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)<br>[root_mean_squared_error](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.root_mean_squared_error.html) |

### 114-2 第 39 題

> 附圖程式碼實現的是哪一種正則化技術？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `np.random.seed／randint／binomial／normal` | randint(1, 7) 上界不含，產生 1~6；binomial(1, p) 產生 0／1 遮罩，1 的機率是 p；normal(digits.data, 4) 以原值為平均、標準差 4 加雜訊。 | 模擬實驗、資料增強加噪、bootstrap 抽樣；固定 seed 是實驗可重現的前提。 | [Random Generator（新式 API）](https://numpy.org/doc/stable/reference/random/generator.html)<br>[numpy.random.randint（舊式 API）](https://numpy.org/doc/stable/reference/random/generated/numpy.random.randint.html)<br>[numpy.random.binomial](https://numpy.org/doc/stable/reference/random/generated/numpy.random.binomial.html) |
| `BatchNormalization()／Dropout(rate)` | Dropout(0.25) 訓練時把 25% 的輸出設為 0、其餘放大為 1/(1−0.25) 倍（實測 1.333），推論時不作用；BatchNormalization 穩定每層輸入分布，緩解梯度消失／爆炸。 | Dropout 是防過擬合最便宜的手段，常放在全連接層之間；BN 讓深層 CNN 可以用較大的學習率訓練。 | [Dropout layer](https://keras.io/api/layers/regularization_layers/dropout/)<br>[BatchNormalization layer](https://keras.io/api/layers/normalization_layers/batch_normalization/) |

### 114-2 第 40 題

> 依據附圖程式碼進行資料處理，下列何者正確？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `v1 * v2 vs np.dot(v1, v2)／v1 @ v2` | [1,2,3] * [4,5,6] 逐元素得 [4 10 18]；np.dot 內積得 32。NumPy 2 起純量會顯示成 np.int64(32)，真題的正解選項就是這個寫法。 | 餘弦相似度（推薦、語意檢索）、線性層 XW + b、注意力分數 QKᵀ 都是內積／矩陣乘法。 | [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html)<br>[numpy.matmul（@ 運算子）](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html) |
| `np.linalg.inv／det／eig` | inv 反矩陣、det 行列式（[[1,2],[3,4]] 為 −2）、eig 特徵值與特徵向量。 | PCA 的本質是共變異矩陣的特徵分解；線性迴歸正規方程 (XᵀX)⁻¹Xᵀy。實務上解方程式用 np.linalg.solve 或 lstsq，比先求 inv 穩定。 | [numpy.linalg.inv](https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html)<br>[numpy.linalg.det](https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html)<br>[numpy.linalg.eig](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html) |

### 114-2 第 41 題

> 考慮擲出骰子並採用 Monte Carlo 方法估算條件機率，參考附圖程式碼。事件 A：擲出偶數事件 B：擲出大於 3請問下列何者為條件機率 P(A∣B)的正確值？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `布林遮罩：(arr % 2 == 0)、A & B、.sum()` | 比較運算得到布林陣列，& 取交集，.sum() 數 True 的個數；P(A\|B) = (A & B).sum() / B.sum()，實測約 0.667（理論 2/3）。 | 資料篩選、轉換率與留存率計算、A/B 測試與風險情境的模擬估計。 | [Indexing on ndarrays（布林索引）](https://numpy.org/doc/stable/user/basics.indexing.html)<br>[Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) |
| `np.random.seed／randint／binomial／normal` | randint(1, 7) 上界不含，產生 1~6；binomial(1, p) 產生 0／1 遮罩，1 的機率是 p；normal(digits.data, 4) 以原值為平均、標準差 4 加雜訊。 | 模擬實驗、資料增強加噪、bootstrap 抽樣；固定 seed 是實驗可重現的前提。 | [Random Generator（新式 API）](https://numpy.org/doc/stable/reference/random/generator.html)<br>[numpy.random.randint（舊式 API）](https://numpy.org/doc/stable/reference/random/generated/numpy.random.randint.html)<br>[numpy.random.binomial](https://numpy.org/doc/stable/reference/random/generated/numpy.random.binomial.html) |

### 114-2 第 42 題

> 在深度神經網路中，不同層的參數量（parameter count）差異極大。有些層雖然數量少但計算量大，有些則相反。了解參數分佈情形，有助於模型壓縮與遷移學習設計。請問在 VGG1…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `torchvision.models.resnet50／vgg16(weights=…)` | ResNet50 的最後一層是 model.fc，輸入 2048；VGG16 是 model.classifier[6]，4096 → 1000。VGG16 共 13 層卷積＋3 層全連接，138,357,544 個參數。 | 影像分類、檢測的骨幹網路；weights.transforms() 直接給出預訓練時的縮放與正規化，省掉手寫 mean／std 出錯。 | [torchvision Models and pre-trained weights（0.29 stable）](https://docs.pytorch.org/vision/stable/models.html)<br>[resnet50](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.resnet50.html)<br>[vgg16](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.vgg16.html) |
| `參數量與運算量：nn.Linear／nn.Conv2d／summary` | 全連接層參數最多（第一個 FC 就有 1 億多），卷積層運算量（FLOPs）最多；參數量都包含 bias。 | 部署前估模型大小與記憶體、決定剪枝或量化要動哪幾層；把 FC 換成全域平均池化可以砍掉大半參數。 | [torch.nn.Linear](https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html)<br>[torch.nn.Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)<br>[torchinfo（torchsummary 的後繼）](https://github.com/TylerYep/torchinfo) |

### 114-2 第 43 題

> 在神經網路中，了解各層的運算量分佈，有助於模型壓縮與硬體加速的策略設計。請問在 VGG16 中，下列何者運算量(FLOPs)最多？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `參數量與運算量：nn.Linear／nn.Conv2d／summary` | 全連接層參數最多（第一個 FC 就有 1 億多），卷積層運算量（FLOPs）最多；參數量都包含 bias。 | 部署前估模型大小與記憶體、決定剪枝或量化要動哪幾層；把 FC 換成全域平均池化可以砍掉大半參數。 | [torch.nn.Linear](https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html)<br>[torch.nn.Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)<br>[torchinfo（torchsummary 的後繼）](https://github.com/TylerYep/torchinfo) |

### 114-2 第 44 題

> VGG16 層數深且結構規則，由多層卷積、池化及全連接層組成。了解各層的輸入/輸出維度、參數量及記憶體需求，有助於掌握 CNN 模型的組成邏輯與實作技巧。根據 VGG16 的模型架…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `torchvision.models.resnet50／vgg16(weights=…)` | ResNet50 的最後一層是 model.fc，輸入 2048；VGG16 是 model.classifier[6]，4096 → 1000。VGG16 共 13 層卷積＋3 層全連接，138,357,544 個參數。 | 影像分類、檢測的骨幹網路；weights.transforms() 直接給出預訓練時的縮放與正規化，省掉手寫 mean／std 出錯。 | [torchvision Models and pre-trained weights（0.29 stable）](https://docs.pytorch.org/vision/stable/models.html)<br>[resnet50](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.resnet50.html)<br>[vgg16](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.vgg16.html) |
| `參數量與運算量：nn.Linear／nn.Conv2d／summary` | 全連接層參數最多（第一個 FC 就有 1 億多），卷積層運算量（FLOPs）最多；參數量都包含 bias。 | 部署前估模型大小與記憶體、決定剪枝或量化要動哪幾層；把 FC 換成全域平均池化可以砍掉大半參數。 | [torch.nn.Linear](https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html)<br>[torch.nn.Conv2d](https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)<br>[torchinfo（torchsummary 的後繼）](https://github.com/TylerYep/torchinfo) |

### 114-2 第 45 題

> 在實務應用中，我們常使用遷移學習(transfer learning)技巧，即載入預訓練模型（如 VGG16） ，凍結部分層的參數，只針對特定任務重新訓練最後幾層，這種做法可節省訓…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `凍結：param.requires_grad = False＋換分類頭` | 凍結全部參數後換掉最後一層＝特徵萃取（新層預設可訓練）；只凍結 model.features 則卷積層不動、整個 classifier 都訓練。微調時學習率要小（如 1e-4），避免破壞預訓練特徵。 | 瑕疵檢測、醫療影像這類標註少的任務：先只訓練新頭（特徵萃取），收斂後再解凍後段微調。 | [官方教學：Transfer Learning for Computer Vision](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)<br>[torch.nn.Module（requires_grad_、parameters）](https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html)<br>[torch.optim.Adam](https://docs.pytorch.org/docs/stable/generated/torch.optim.Adam.html) |
| `torchvision.models.resnet50／vgg16(weights=…)` | ResNet50 的最後一層是 model.fc，輸入 2048；VGG16 是 model.classifier[6]，4096 → 1000。VGG16 共 13 層卷積＋3 層全連接，138,357,544 個參數。 | 影像分類、檢測的骨幹網路；weights.transforms() 直接給出預訓練時的縮放與正規化，省掉手寫 mean／std 出錯。 | [torchvision Models and pre-trained weights（0.29 stable）](https://docs.pytorch.org/vision/stable/models.html)<br>[resnet50](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.resnet50.html)<br>[vgg16](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.vgg16.html) |

### 114-2 第 46 題

> 假設研究人員已將含有雜訊的手寫數字影像存放在變數 noisy 中。部分資料經視覺化後的外觀如下：他們嘗試使用 PCA 進行降噪，並希望能保留影像的主要特徵，同時去除影像中的雜訊。然…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `PCA(n_components)：fit → transform → inverse_transform` | n_components 給整數是保留幾個成分，給 0~1 的小數是保留多少比例的變異；不給就保留全部，投影再還原等於原封不動。 | 影像與感測器資料降噪、高維特徵壓縮、在 2D 上視覺化群集、加速下游模型訓練。 | [PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)<br>[官方範例：Image denoising using kernel PCA（digits）](https://scikit-learn.org/stable/auto_examples/applications/plot_digits_denoising.html) |
| `np.random.seed／randint／binomial／normal` | randint(1, 7) 上界不含，產生 1~6；binomial(1, p) 產生 0／1 遮罩，1 的機率是 p；normal(digits.data, 4) 以原值為平均、標準差 4 加雜訊。 | 模擬實驗、資料增強加噪、bootstrap 抽樣；固定 seed 是實驗可重現的前提。 | [Random Generator（新式 API）](https://numpy.org/doc/stable/reference/random/generator.html)<br>[numpy.random.randint（舊式 API）](https://numpy.org/doc/stable/reference/random/generated/numpy.random.randint.html)<br>[numpy.random.binomial](https://numpy.org/doc/stable/reference/random/generated/numpy.random.binomial.html) |

### 114-2 第 47 題

> 研究人員在對 digits 資料集進行分類時，決定使用 KNN 並搭配交叉驗證來評估模型準確率。他們撰寫了四組不同的程式碼來進行 KNN 訓練與交叉驗證，但不確定哪幾組程式碼能正確…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `cross_val_score(estimator, X, y, cv, scoring)` | 回傳每一折的分數陣列，.mean() 才是平均；分類器給整數 cv 時內部用 StratifiedKFold（不洗牌）。 | 上線前估計泛化能力、在候選模型之間做公平比較；回報「平均 ± 標準差」比單次切分穩定，也能看出模型對資料切法敏不敏感。 | [cross_val_score（scikit-learn 1.9 stable）](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)<br>[Cross-validation 使用指南](https://scikit-learn.org/stable/modules/cross_validation.html)<br>[scoring 字串一覽（Metrics and scoring）](https://scikit-learn.org/stable/modules/model_evaluation.html) |
| `StratifiedKFold／KFold／RepeatedStratifiedKFold` | Stratified 保持每一折的類別比例；KFold 只等分、不分層；Repeated 版本重複多次分層切割。 | 詐欺偵測、晶圓瑕疵這類少數類只有 1% 的資料，不分層時某一折可能完全沒有少數類，指標會失真。 | [StratifiedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html)<br>[KFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html)<br>[RepeatedStratifiedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RepeatedStratifiedKFold.html) |
| `LinearDiscriminantAnalysis.fit_transform(X, y)｜KNeighborsClassifier(n_neighbors)` | LDA 是監督式降維，fit 需要 y，最多降到「類別數 − 1」維（iris 三類 → 2 維）；KNN 的 fit 只是把資料存起來，預測時才算距離。 | LDA：有標籤時的降維與可視化，也可直接當線性分類器；KNN：相似商品推薦、小資料的基準模型。 | [LinearDiscriminantAnalysis](https://scikit-learn.org/stable/modules/generated/sklearn.discriminant_analysis.LinearDiscriminantAnalysis.html)<br>[KNeighborsClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)<br>[load_digits（真題用的 digits 資料集）](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html) |

### 114-2 第 48 題

> 參考下圖程式碼，下列何者正確？A：X_train -= X_train.mean(axis=0) 將每個訓練集特徵的平均值調整為B：X_train /= X_train.std(a…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `StandardScaler｜X.mean(axis=0)、X.std(axis=0)` | axis=0 沿著列方向計算，得到每個特徵（每一欄）各自的平均與標準差；z-score 後平均 0、標準差 1，數值可以超出 0~1（實測最小值約 −3.8）。 | KNN、SVM、PCA、神經網路這類依賴距離或梯度的模型都要先縮放；樹模型（決策樹、隨機森林、XGBoost）不需要。 | [StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)<br>[numpy.mean（axis 參數）](https://numpy.org/doc/stable/reference/generated/numpy.mean.html)<br>[numpy.std](https://numpy.org/doc/stable/reference/generated/numpy.std.html) |

### 114-2 第 49 題

> 參考下圖執行結果，下列何者正確？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `輸出層 activation × compile(loss=…) 配對` | 多類別＋one-hot 標籤：softmax＋categorical_crossentropy；多類別＋整數標籤：softmax＋sparse_categorical_crossentropy；二元：Dense(1, sigmoid)＋binary_crossentropy。 | 客戶流失（二元）、商品分類（多類別）、文章多標籤標記、銷量預測（迴歸）——先判斷任務型態，輸出層與損失就跟著決定。 | [Keras 3 Probabilistic losses](https://keras.io/api/losses/probabilistic_losses/)<br>[Keras 3 Layer activation functions](https://keras.io/api/layers/activations/) |
| `Dense(units, activation)｜model.summary() 參數量` | 參數＝(輸入＋1)×輸出：輸入 9 → Dense(10) 是 100，Dense(10) → Dense(10) 是 110，Dense(10) → Dense(1) 是 11。 | 表格資料的二元分類（違約、流失、詐欺）最常見的起手式。 | [Keras 3 Sequential](https://keras.io/api/models/sequential/)<br>[Dense layer](https://keras.io/api/layers/core_layers/dense/)<br>[Input object](https://keras.io/api/layers/core_layers/input/) |

### 115-1 第 20 題

> 工程師在 PyTorch 中建構貓、狗、鳥三分類 CNN，並使用交叉熵損失函數（CrossEntropyLoss）作為訓練目標。由於此損失函數在內部已包含 Softmax 計算，輸…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `nn.CrossEntropyLoss()｜輸出層給 logits` | 內部已含 log_softmax，輸出層不加任何激活函數、維度＝類別數；標籤給類別索引即可。 | 影像、文字的多類別分類；二元或多標籤改用 BCEWithLogitsLoss（同樣直接吃 logits）。 | [torch.nn.CrossEntropyLoss](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) |

### 115-1 第 40 題

> 分析師準備建立一個能將手寫數字圖片（28x28 像素展平為 784 維度）分為 0~9 共10 個類別的多層感知機 （MLP） ，且標籤已轉為 One-Hot 編碼 （One-Ho…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `輸出層 activation × compile(loss=…) 配對` | 多類別＋one-hot 標籤：softmax＋categorical_crossentropy；多類別＋整數標籤：softmax＋sparse_categorical_crossentropy；二元：Dense(1, sigmoid)＋binary_crossentropy。 | 客戶流失（二元）、商品分類（多類別）、文章多標籤標記、銷量預測（迴歸）——先判斷任務型態，輸出層與損失就跟著決定。 | [Keras 3 Probabilistic losses](https://keras.io/api/losses/probabilistic_losses/)<br>[Keras 3 Layer activation functions](https://keras.io/api/layers/activations/) |
| `Dense(units, activation)｜model.summary() 參數量` | 參數＝(輸入＋1)×輸出：輸入 9 → Dense(10) 是 100，Dense(10) → Dense(10) 是 110，Dense(10) → Dense(1) 是 11。 | 表格資料的二元分類（違約、流失、詐欺）最常見的起手式。 | [Keras 3 Sequential](https://keras.io/api/models/sequential/)<br>[Dense layer](https://keras.io/api/layers/core_layers/dense/)<br>[Input object](https://keras.io/api/layers/core_layers/input/) |

### 115-1 第 41 題

> 工程師使用 PyTorch 建立 OCR 訓練 pipeline ， 並對手寫字母資料集套用下圖程式進行資料增強（Transform） 。模型在訓練過程中顯示驗證損失（Valida…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `transforms.Compose／RandomHorizontalFlip／RandomRotation／ColorJitter` | Compose 依序套用；水平翻轉會把 b 變 d、p 變 q，有方向語意的資料（文字、數字、交通號誌的左右轉）不能用。 | 一般物件分類可以翻轉；OCR、手寫數字、醫療影像的左右側別要依任務語意挑增強。 | [Transforming images（transforms v2）](https://docs.pytorch.org/vision/stable/transforms.html)<br>[v2.RandomHorizontalFlip](https://docs.pytorch.org/vision/stable/generated/torchvision.transforms.v2.RandomHorizontalFlip.html) |

### 115-1 第 42 題

> 觀察程式中行(A)將所有既有權重的梯度計算關閉，這在遷移學習中屬於哪一種標準策略？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `凍結：param.requires_grad = False＋換分類頭` | 凍結全部參數後換掉最後一層＝特徵萃取（新層預設可訓練）；只凍結 model.features 則卷積層不動、整個 classifier 都訓練。微調時學習率要小（如 1e-4），避免破壞預訓練特徵。 | 瑕疵檢測、醫療影像這類標註少的任務：先只訓練新頭（特徵萃取），收斂後再解凍後段微調。 | [官方教學：Transfer Learning for Computer Vision](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)<br>[torch.nn.Module（requires_grad_、parameters）](https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html)<br>[torch.optim.Adam](https://docs.pytorch.org/docs/stable/generated/torch.optim.Adam.html) |
| `torchvision.models.resnet50／vgg16(weights=…)` | ResNet50 的最後一層是 model.fc，輸入 2048；VGG16 是 model.classifier[6]，4096 → 1000。VGG16 共 13 層卷積＋3 層全連接，138,357,544 個參數。 | 影像分類、檢測的骨幹網路；weights.transforms() 直接給出預訓練時的縮放與正規化，省掉手寫 mean／std 出錯。 | [torchvision Models and pre-trained weights（0.29 stable）](https://docs.pytorch.org/vision/stable/models.html)<br>[resnet50](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.resnet50.html)<br>[vgg16](https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.vgg16.html) |

### 115-1 第 43 題

> 在進行遷移學習微調（Fine-Tuning）時，通常會將優化器的學習率（LearningRate）設得非常小（如 1e-4） ，下列何者為主要的原因？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `凍結：param.requires_grad = False＋換分類頭` | 凍結全部參數後換掉最後一層＝特徵萃取（新層預設可訓練）；只凍結 model.features 則卷積層不動、整個 classifier 都訓練。微調時學習率要小（如 1e-4），避免破壞預訓練特徵。 | 瑕疵檢測、醫療影像這類標註少的任務：先只訓練新頭（特徵萃取），收斂後再解凍後段微調。 | [官方教學：Transfer Learning for Computer Vision](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)<br>[torch.nn.Module（requires_grad_、parameters）](https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html)<br>[torch.optim.Adam](https://docs.pytorch.org/docs/stable/generated/torch.optim.Adam.html) |

### 115-1 第 44 題

> 研究人員撰寫的程式中（下圖） ，先用整體資料進行 LDA（Linear DiscriminantAnalysis）降維，接著再用 KNN（K-Nearest Neighbors）進…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `cross_val_score(estimator, X, y, cv, scoring)` | 回傳每一折的分數陣列，.mean() 才是平均；分類器給整數 cv 時內部用 StratifiedKFold（不洗牌）。 | 上線前估計泛化能力、在候選模型之間做公平比較；回報「平均 ± 標準差」比單次切分穩定，也能看出模型對資料切法敏不敏感。 | [cross_val_score（scikit-learn 1.9 stable）](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)<br>[Cross-validation 使用指南](https://scikit-learn.org/stable/modules/cross_validation.html)<br>[scoring 字串一覽（Metrics and scoring）](https://scikit-learn.org/stable/modules/model_evaluation.html) |
| `make_pipeline(前處理, 模型)｜防資料洩漏` | 前處理的 fit 只能看到訓練折；包進 Pipeline 後，cross_val_score 會在每一折重新 fit 整條流程。 | StandardScaler、SelectKBest、PCA、補值器一律放進 Pipeline；GridSearchCV 調參也直接吃 Pipeline，部署時存一個物件就帶走整條前處理。 | [make_pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.make_pipeline.html)<br>[Common pitfalls：Data leakage](https://scikit-learn.org/stable/common_pitfalls.html) |
| `LinearDiscriminantAnalysis.fit_transform(X, y)｜KNeighborsClassifier(n_neighbors)` | LDA 是監督式降維，fit 需要 y，最多降到「類別數 − 1」維（iris 三類 → 2 維）；KNN 的 fit 只是把資料存起來，預測時才算距離。 | LDA：有標籤時的降維與可視化，也可直接當線性分類器；KNN：相似商品推薦、小資料的基準模型。 | [LinearDiscriminantAnalysis](https://scikit-learn.org/stable/modules/generated/sklearn.discriminant_analysis.LinearDiscriminantAnalysis.html)<br>[KNeighborsClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)<br>[load_digits（真題用的 digits 資料集）](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html) |

### 115-1 第 45 題

> 研究人員在程式（下圖） 中使用 cross_val_score 進行交叉驗證，但目前尚未設定 cv參數。他們希望確保在每次資料分割時，訓練集與測試集的類別比例與原始資料一致，以免影…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `cross_val_score(estimator, X, y, cv, scoring)` | 回傳每一折的分數陣列，.mean() 才是平均；分類器給整數 cv 時內部用 StratifiedKFold（不洗牌）。 | 上線前估計泛化能力、在候選模型之間做公平比較；回報「平均 ± 標準差」比單次切分穩定，也能看出模型對資料切法敏不敏感。 | [cross_val_score（scikit-learn 1.9 stable）](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)<br>[Cross-validation 使用指南](https://scikit-learn.org/stable/modules/cross_validation.html)<br>[scoring 字串一覽（Metrics and scoring）](https://scikit-learn.org/stable/modules/model_evaluation.html) |
| `StratifiedKFold／KFold／RepeatedStratifiedKFold` | Stratified 保持每一折的類別比例；KFold 只等分、不分層；Repeated 版本重複多次分層切割。 | 詐欺偵測、晶圓瑕疵這類少數類只有 1% 的資料，不分層時某一折可能完全沒有少數類，指標會失真。 | [StratifiedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html)<br>[KFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html)<br>[RepeatedStratifiedKFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RepeatedStratifiedKFold.html) |
| `LinearDiscriminantAnalysis.fit_transform(X, y)｜KNeighborsClassifier(n_neighbors)` | LDA 是監督式降維，fit 需要 y，最多降到「類別數 − 1」維（iris 三類 → 2 維）；KNN 的 fit 只是把資料存起來，預測時才算距離。 | LDA：有標籤時的降維與可視化，也可直接當線性分類器；KNN：相似商品推薦、小資料的基準模型。 | [LinearDiscriminantAnalysis](https://scikit-learn.org/stable/modules/generated/sklearn.discriminant_analysis.LinearDiscriminantAnalysis.html)<br>[KNeighborsClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html)<br>[load_digits（真題用的 digits 資料集）](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html) |

### 115-1 第 46 題

> 參考下圖資料處理，下列哪一項描述組合正確？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `StandardScaler｜X.mean(axis=0)、X.std(axis=0)` | axis=0 沿著列方向計算，得到每個特徵（每一欄）各自的平均與標準差；z-score 後平均 0、標準差 1，數值可以超出 0~1（實測最小值約 −3.8）。 | KNN、SVM、PCA、神經網路這類依賴距離或梯度的模型都要先縮放；樹模型（決策樹、隨機森林、XGBoost）不需要。 | [StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)<br>[numpy.mean（axis 參數）](https://numpy.org/doc/stable/reference/generated/numpy.mean.html)<br>[numpy.std](https://numpy.org/doc/stable/reference/generated/numpy.std.html) |
| `輸出層 activation × compile(loss=…) 配對` | 多類別＋one-hot 標籤：softmax＋categorical_crossentropy；多類別＋整數標籤：softmax＋sparse_categorical_crossentropy；二元：Dense(1, sigmoid)＋binary_crossentropy。 | 客戶流失（二元）、商品分類（多類別）、文章多標籤標記、銷量預測（迴歸）——先判斷任務型態，輸出層與損失就跟著決定。 | [Keras 3 Probabilistic losses](https://keras.io/api/losses/probabilistic_losses/)<br>[Keras 3 Layer activation functions](https://keras.io/api/layers/activations/) |
| `keras.utils.to_categorical(y, num_classes)｜x / 255.0` | to_categorical([6], 10) 得到第 6 個位置為 1 的 one-hot 向量，搭配 softmax 與 categorical_crossentropy；像素除以 255.0 縮到 0~1。 | 所有影像分類專案的第一步；大資料集通常改在 tf.data 或 DataLoader 裡做，避免一次把整個資料集轉成浮點數吃光記憶體。 | [to_categorical（Python utilities）](https://keras.io/api/utils/python_utils/)<br>[CIFAR10 dataset](https://keras.io/api/datasets/cifar10/) |

### 115-1 第 47 題

> 參考下圖建立模型結果，下列哪一項描述組合正確？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `Conv2D／MaxPooling2D／Flatten` | Conv2D(32, (3,3), padding="same") 對 (32,32,3) 的輸出是 (32,32,32)：長寬保住、通道數變濾波器數；MaxPooling2D((2,2)) 長寬減半；Flatten 把 3D 特徵圖攤成 1D。 | 影像分類、工業瑕疵檢測的基本骨架；資料量少時改用預訓練骨幹（見 PyTorch 遷移學習）。 | [Conv2D layer](https://keras.io/api/layers/convolution_layers/convolution2d/)<br>[MaxPooling2D layer](https://keras.io/api/layers/pooling_layers/max_pooling2d/)<br>[Flatten layer](https://keras.io/api/layers/reshaping_layers/flatten/) |
| `BatchNormalization()／Dropout(rate)` | Dropout(0.25) 訓練時把 25% 的輸出設為 0、其餘放大為 1/(1−0.25) 倍（實測 1.333），推論時不作用；BatchNormalization 穩定每層輸入分布，緩解梯度消失／爆炸。 | Dropout 是防過擬合最便宜的手段，常放在全連接層之間；BN 讓深層 CNN 可以用較大的學習率訓練。 | [Dropout layer](https://keras.io/api/layers/regularization_layers/dropout/)<br>[BatchNormalization layer](https://keras.io/api/layers/normalization_layers/batch_normalization/) |

### 115-1 第 48 題

> 參考下圖繪圖結果，當 Epochs=6 時，訓練曲線值(0.81)明顯大於驗證曲線值(0.72)，下列何者為最可能的原因？

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `model.compile／fit(validation_data)／History 與 EarlyStopping` | history.history["accuracy"] 與 ["val_accuracy"] 畫成兩條線：訓練持續上升、驗證停滯或下降且差距擴大，就是過擬合。 | EarlyStopping 搭配 restore_best_weights 是防過擬合的標配，省下手動挑 epoch 的工夫。 | [Model training APIs（compile／fit）](https://keras.io/api/models/model_training_apis/)<br>[EarlyStopping](https://keras.io/api/callbacks/early_stopping/) |

### 115-1 第 50 題

> 為了修復訓練過程中 Loss 突然變成 NaN 的問題，工程師考慮在 PyTorch 訓練迴圈中加入梯度裁剪（GradientClipping）機制，例如 torch.nn.uti…

| 函式 | 考點 | 實務應用 | 官方文件 |
|---|---|---|---|
| `訓練迴圈：zero_grad → forward → loss → backward → clip_grad_norm_ → step` | 梯度裁剪要在 backward 之後（梯度才存在）、step 之前（才會影響這次更新）。實測一次異常梯度範數約 121 萬，裁剪後為 1.0。 | RNN、Transformer 與大型模型訓練幾乎都開梯度裁剪（max_norm=1.0 很常見），避免 loss 變成 NaN。 | [torch.nn.utils.clip_grad_norm_（PyTorch 2.15 stable）](https://docs.pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html)<br>[官方教學：Optimizing Model Parameters（訓練迴圈）](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html) |

## 四、考卷寫法與最新穩定版的差異

考試照考卷寫法作答；實務寫程式請用新寫法。

- **`mean_squared_error／root_mean_squared_error／mean_absolute_error／r2_score`**：mean_squared_error(squared=False) 的寫法在 1.9.1 已不存在（簽名沒有 squared 參數），RMSE 改用 root_mean_squared_error。
- **`np.random.seed／randint／binomial／normal`**：新程式建議用 Generator：rng = np.random.default_rng(seed)，再呼叫 rng.integers(1, 7)、rng.binomial、rng.normal；integers 的上界同樣不含。
- **`torchvision.models.resnet50／vgg16(weights=…)`**：考卷的 pretrained=True 自 torchvision 0.13 起棄用，0.29.2 仍能執行但會發出警告；新寫法是 weights=ResNet50_Weights.DEFAULT（目前等於 IMAGENET1K_V2）或指定版本。
- **`參數量與運算量：nn.Linear／nn.Conv2d／summary`**：考卷用的 torchsummary 最後一版停在 2018 年；現在多用 torchinfo 的 summary(model, input_size=(1, 3, 150, 150))，或直接 sum(p.numel() for p in model.parameters())。
- **`transforms.Compose／RandomHorizontalFlip／RandomRotation／ColorJitter`**：torchvision 0.29 建議改用 transforms.v2；v2.ToTensor() 已標示棄用，改成 v2.ToImage() 加 v2.ToDtype(torch.float32, scale=True)。
- **`Dense(units, activation)｜model.summary() 參數量`**：Keras 3 建議以 Input(shape=…) 當第一層；考卷的 Dense(…, input_shape=(784,)) 在 3.15.1 仍可執行但會發出警告。TensorFlow 2.16 起 tf.keras 就是 Keras 3。

## 五、考前陷阱

1. scoring="f1" 預設 average="binary"，用在多類別（digits 10 類）每一折都失敗、結果是 nan；要 F1 改 "f1_macro"，要準確率用 "accuracy"。（114-2 第 47 題）
2. 分類器寫 cv=5，cross_val_score 內部就是 StratifiedKFold（不洗牌）；KFold 才不分層。（115-1 第 45 題、114-2 第 47 題）
3. 先對全部資料 fit 降維或標準化、再做交叉驗證＝資料洩漏；要把前處理包進 Pipeline。（115-1 第 44 題）
4. PCA() 不給 n_components 會保留全部成分，inverse_transform 等於原樣還原，雜訊也留著。（114-2 第 46 題）
5. PyTorch 的 CrossEntropyLoss 內含 softmax：輸出層直接給 logits，維度＝類別數。（115-1 第 20 題）
6. 梯度裁剪放在 loss.backward() 之後、optimizer.step() 之前。（115-1 第 50 題）
7. 只凍結卷積層是 model.features.parameters()；寫 model.requires_grad = False 什麼都沒凍結。（114-2 第 45 題、115-1 第 42 題）
8. 文字、數字辨識不能用 RandomHorizontalFlip：b↔d、p↔q 鏡像後標籤就錯了。（115-1 第 41 題）
9. 標準化（z-score）不是壓到 0~1；除以 255.0 也不是 z-score。（114-2 第 48 題、115-1 第 46 題）
10. Dense 參數＝(輸入＋1)×輸出；Conv2D 加 padding="same" 保住長寬，通道數變成濾波器數。（114-2 第 49 題、115-1 第 47 題）
11. v1 * v2 是逐元素相乘；np.dot 才是內積；inv／det／eig 是反矩陣／行列式／特徵值，選項常互換。（114-2 第 40 題）
12. Dropout(0.25) 是把 25% 輸出設為 0，不是 1；手寫版 binomial(1, p) 的 p 是「保留率」。（115-1 第 47 題、114-2 第 39 題）

## 六、速算公式

| 項目 | 公式 | 說明 |
|---|---|---|
| Dense／Linear 參數量 | `(輸入維度 + 1) × 輸出維度` | 9→10 是 100、10→10 是 110、10→1 是 11；VGG16 第一個全連接 (25088+1)×4096 = 102,764,544 |
| Conv2D 參數量 | `(K × K × C_in + 1) × C_out` | VGG16 第一層 (3×3×3+1)×64 = 1,792 |
| 卷積輸出邊長 | `⌊(W − K + 2P) / S⌋ + 1` | padding="same"、stride 1 時輸出邊長＝輸入邊長；MaxPooling2D((2,2)) 長寬減半 |
| 條件機率（布林陣列） | `P(A\|B) = (A & B).sum() / B.sum()` | 分母是「已知發生」的那個事件；擲骰估計約 0.667（理論 2/3） |
| MSE／RMSE | `MSE = Σ(y − ŷ)² / n，RMSE = √MSE` | 絕對值平均是 MAE；R² = 1 − SS_res / SS_tot |
| Inverted Dropout | `訓練：x × mask / p　推論：x` | p 為保留率；除以 p 讓期望值不變，推論時就不必再縮放 |
