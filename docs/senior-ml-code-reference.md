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

考卷上的程式碼都是整條流程的一個切片。先看自己在哪一步，再問三件事：這一步能看到哪些資料、產出要交給誰、出錯時要到哪一步才會發現。每一步的「學習筆記重點」整理自 L231–L234 的學習筆記，程式真題沒考的觀念也收在裡面。

```
【定義與資料】1 問題定義與指標 → 2 資料取得與切分 → 3 前處理與特徵工程
【建模】4 模型選擇與架構 → 5 訓練 → 6 評估與驗證 → 7 調整與優化
【上線】8 最終驗收與上線審查 → 9 部署與監控
↺ 6 → 7：評估不達標 → 調整；調整無效時再往回到前處理或模型選擇
↺ 9 → 2：監控到資料漂移或指標下滑 → 調查後回到資料端重新收集、切分、訓練，更新要重新驗收
【貫穿全程】資料邊界・可重現與可追溯・一致性・成本・隱私與安全・公平性
```

### 1. 問題定義與指標（定義與資料）

- 做什麼：先判斷有沒有標籤、輸出是類別還是數值，再定評估指標、錯誤成本與一個簡單的基準模型（例如多數類別預測器、Logistic Regression 或 KNN）。
- 系統觀念：任務型態一次決定三件事：輸出層、損失函數、評估指標，後面每一步都從這裡往下推。指標要對應錯誤的業務代價：漏掉瑕疵與誤判正常品，成本通常差很多。用途也決定需要哪些資料，資料要先問能不能用，再問怎麼用。
- 出錯的代價：指標選錯，後面每一步都在最佳化錯的目標。瑕疵只占 1% 時看準確率，全部猜「正常」也有 99%。
- 本頁函式：`輸出層×損失`、`MSE／RMSE`、`LDA／KNN`
- 對應學習筆記：L23201、L23101、L23103、L23401
- 學習筆記重點：
  - **學習方式**：有標籤是監督式；只找結構是非監督式（分群、降維、異常偵測）；用資料自己產生答案（遮字預測）是自監督式；靠行動與長期回饋是強化學習。資料每天更新不會因此變成強化學習。
  - **分類或迴歸**：看輸出的意義而不是模型名稱：良品／不良品是分類，剩餘壽命 25.6 小時是迴歸。不同任務的分數不能互相比較。
  - **損失函數的選擇**：損失函數決定哪些錯誤代價大：平方損失重罰大誤差，要確認這符合工作上的錯誤代價。
  - **基礎率**：罕見事件的警報可信度很低：偵測率 90% 的模型，在不良率低時警報可能只有 15% 是真的（貝氏定理）。定指標前先看類別比例。
  - **用途先於資料**：先定用途，再決定需要哪些資料；拿得到的資料不代表可以拿來訓練。新用途要重新確認使用基礎（資料最小化、目的限制）。

### 2. 資料取得與切分（定義與資料）

- 做什麼：確認資料來源、標籤定義與每個欄位在預測當下拿不拿得到，再切分：類別不平衡用分層切分，時間序列依時間切，相依樣本依群組切，並固定亂數種子。
- 系統觀念：切分畫出整條流程的資料邊界：訓練集用來學、驗證集用來選、測試集鎖起來最後只用一次（70／15／15 只是示例）。切分方式要模擬真正要推論的對象：預測未來就依時間切；同一件產品的多張照片、同一台設備的紀錄不能同時出現在訓練與測試兩邊。
- 出錯的代價：切分錯了不會報錯，只是之後的分數全部失真，而且要到上線後才會發現。資料本身代表性不足（例如夜班樣本少），模型就學不到那一群。
- 本頁函式：`StratifiedKFold`、`亂數種子`
- 對應學習筆記：L23301、L23303、L23101、L23401、L23402
- 學習筆記重點：
  - **資料可用時間**：把出貨後的人工複檢結果當輸入，用到了預測當下根本沒有的資訊，也是一種洩漏。
  - **群組與時間切分**：相依樣本按群組切、未來預測按時間切，優先於隨機 K-fold；否則模型靠記住設備或產品拿高分。
  - **資料代表性**：偏見常從資料就開始：某一群樣本太少、標註標準不一、歷史結果本身有偏誤。收資料時就要檢查各群的數量。
  - **樣本與母體**：樣本統計量會隨抽樣變動，抽的總是同一台機器，區間再窄也代表不了其他機器。
  - **隱私與保存**：收集時就做資料最小化（裁掉與任務無關的臉部、識別證），訂好保存期限、權限與負責人。

### 3. 前處理與特徵工程（定義與資料）

- 做什麼：先清理（缺失值、異常值、重複樣本、欄位型別），再編碼類別、縮放數值、轉換偏斜分布、拆解時間欄位，必要時做特徵選擇或 PCA 降維；影像任務再加資料增強，類別不平衡時對訓練集重取樣。
- 系統觀念：前處理的參數（平均、標準差、補值、主成分、選中的特徵）是從訓練資料學出來的，屬於模型的一部分：只能在訓練資料上 fit，要和模型一起存檔，上線時套用同一組參數（訓練與推論一致）。資料增強與 SMOTE 只用在訓練集，而且不能破壞標籤的語意。
- 出錯的代價：資料洩漏讓離線分數虛高；訓練與線上的前處理不一致，是上線後準確率下滑的常見原因。
- 本頁函式：`StandardScaler`、`Pipeline`、`PCA`、`np.linalg`、`to_categorical`、`transforms`、`布林遮罩`
- 對應學習筆記：L23301、L23102、L23202、L23304、L23401
- 學習筆記重點：
  - **資料清理**：缺失值可以刪除或補值（平均、中位數、模型補值）；異常值用 Z 分數、IQR 偵測，先查原因再決定刪或留；重複樣本與型別錯誤會讓模型學到假規律。
  - **類別編碼**：Label Encoding 把類別轉成整數，會被線性模型誤讀成大小順序；無順序的類別用 One-hot。標籤轉 one-hot 則是給 categorical_crossentropy 用。
  - **縮放與分布轉換**：標準化（平均 0、標準差 1）與 Min-Max（壓到 0~1）是兩件事；右偏分布用對數轉換。距離式與梯度式模型需要縮放，樹模型不需要。
  - **特徵選擇與降維**：特徵選擇（Filter、Wrapper、Embedded）是挑出原欄位；PCA 是建立原欄位的組合新軸，變異大的方向不一定最能辨識罕見瑕疵。兩者都要放進驗證流程。
  - **特徵衍生**：合成欄位（單價 × 數量）、群體統計、時間特徵（星期、時段）、序列特徵（lag、移動平均），每個特徵都要有任務意義與正確的可用時間。
  - **資料增強與重取樣**：影像翻轉旋轉、文字同義字替換、時序加噪、表格 SMOTE；增強要保留原本的答案。SMOTE 先做再切分，測試資料就會影響合成樣本。
  - **去識別化**：刪掉姓名不等於匿名：其他欄位或外部資料可能重新連結到個人，要評估再識別風險。

### 4. 模型選擇與架構（建模）

- 做什麼：先用簡單模型建立基準，再依任務、資料規模、可解釋性與部署資源挑候選模型；表格資料先比較 Logistic Regression、樹模型與集成，影像用 CNN，序列與文字用 RNN 或 Transformer；資料少時載入預訓練模型，換掉最後一層。
- 系統觀念：架構決定成本：參數量決定記憶體與模型檔大小，運算量（FLOPs）決定延遲。全連接層吃參數，卷積層吃運算。底層都是矩陣乘法（Z = XWᵀ + b），所以讀得懂 shape 就讀得懂架構。候選模型要放在同一切分、同一指標、相近資源預算下比較。
- 出錯的代價：一開始就用大模型，就無法判斷多出來的複雜度值不值得；模型做完才發現部署端放不下，或延遲超過產線節拍。
- 本頁函式：`預訓練模型`、`Conv2D`、`Dense／summary`、`參數量`、`np.dot`
- 對應學習筆記：L23302、L23202、L23203、L23102、L23103
- 學習筆記重點：
  - **選模四個面向**：任務類型、資料規模（小資料選參數少的模型）、可解釋性需求（線性與樹模型較好解釋）、運算資源（邊緣裝置要小而快）。
  - **偏差-變異權衡**：模型太簡單是高偏差（欠擬合），太複雜是高變異（過擬合）；複雜度要用驗證結果決定。
  - **演算法家族**：線性／邏輯迴歸、SVM、決策樹、KNN、樸素貝氏；Bagging（隨機森林）降低變異、Boosting（XGBoost、LightGBM）依序補強錯誤；非監督有 K-means、DBSCAN、異常偵測。KNN 與 K-means 都有 K，但一個是分類、一個是分群。
  - **架構對應資料結構**：MLP 處理固定長度向量，CNN 抓影像的局部空間模式，RNN／LSTM 處理先後順序，Transformer 用 Self-Attention 讓每個位置決定要參考誰。
  - **準確與延遲的取捨**：Recall 多幾個百分點、延遲卻超過 150 毫秒的上限，就不能選；要依漏判成本、產線節拍與硬體預算決定。
  - **注意力與 MoE 的成本**：自注意力的計算量與序列長度平方成正比；MoE 省的是每個 token 的計算，不是記憶體，所有專家都要載入。

### 5. 訓練（建模）

- 做什麼：PyTorch 自己寫訓練迴圈，Keras 呼叫 compile 與 fit；決定批次大小、epoch 數、優化器與學習率排程；遷移學習時決定凍結哪些層。訓練過程記錄損失曲線與設定。
- 系統觀念：前向算預測、損失算差距、反向傳播求梯度、Optimizer 才更新權重，四件事分工不同；迴圈順序放錯不會報錯，只會學不好。數值穩定要靠整套設定一起顧：損失函數直接吃 logits、梯度裁剪、BatchNorm、合適的學習率，都是在防止 NaN。凍結哪些層、學習率多小，決定能保住多少預訓練知識。
- 出錯的代價：訓練了好幾個小時才發現 loss 變成 NaN；沒有固定亂數種子與記錄設定，結果無法重現。
- 本頁函式：`訓練迴圈`、`CrossEntropyLoss`、`凍結參數`、`BN／Dropout`
- 對應學習筆記：L23203、L23103、L23303、L23401
- 學習筆記重點：
  - **梯度下降**：新參數＝舊參數 − 學習率 × 梯度。學習率太大會來回震盪甚至發散，太小進步很慢；非凸的神經網路不保證找到全域最低點。
  - **Batch 與 Epoch**：Batch 是一次更新用的樣本；Epoch 是完整走過訓練集一輪。全量、小批次、隨機梯度下降的差別在每次更新看多少樣本。
  - **優化器與學習率排程**：SGD、Momentum、Adam 決定步伐怎麼調；學習率可以固定、逐步衰減或預熱。Adam 更新的是權重，不會替你選好學習率。
  - **收斂與穩定**：看損失是否合理下降、有沒有震盪或非有限值；損失突然升高先查學習率、資料尺度、數值精度與梯度。
  - **混合精度**：訓練時混用 FP16／BF16 與 FP32，省記憶體、加速運算，但要注意數值範圍。
  - **差分隱私訓練**：DP-SGD 先裁切每筆樣本的梯度、再加入校準的雜訊，並追蹤隱私消耗 ε；保護與效用之間有取捨。

### 6. 評估與驗證（建模）

- 做什麼：用交叉驗證回報平均與標準差；分類看混淆矩陣、Precision、Recall、F1 與 ROC／PR 曲線，迴歸看 MSE、RMSE、MAE、R²；畫學習曲線，並分組比較表現。評估前把模型切到推論模式。
- 系統觀念：評估方式比模型更常出錯：scoring 與任務要相符，前處理要放在每一折裡重新 fit，驗證集用來挑模型與門檻，測試集只用來報告。整體分數會掩蓋分組落差，罕見類別要看各自的分母。學習曲線同時用來診斷問題：落差擴大是過擬合，兩條線都偏低是欠擬合。
- 出錯的代價：用錯 scoring 會得到 nan 或錯的數字；在同一份驗證集上反覆挑選，分數會過度樂觀；整體 Recall 85% 時，夜班可能只有 60%。
- 本頁函式：`cross_val_score`、`MSE／RMSE`、`fit／EarlyStopping`、`eval／no_grad`
- 對應學習筆記：L23303、L23101、L23402
- 學習筆記重點：
  - **混淆矩陣與分母**：Recall＝TP／實際正類（抓到多少），Precision＝TP／預測正類（警報多可信）；99% 都是良品時，全猜良品的 Accuracy 99%、Recall 0。
  - **門檻與曲線**：降低門檻通常提高 Recall、也增加誤報；門檻要在驗證資料上依錯誤成本決定。ROC 比較 TPR 與 FPR，罕見類別改看 PR 曲線；AUC 是跨門檻摘要，不能取代實際門檻的指標。
  - **多類別平均**：macro 是各類平均（少數類同等重要），weighted 依樣本數加權。
  - **交叉驗證的變形**：K-fold、Stratified K-fold、LOOCV（K＝樣本數）、Repeated K-fold；有時間或群組依賴時，先守住時間與群組界線。
  - **統計不確定性**：分數有抽樣誤差：準確率 p、題數 n 的 95% 信賴區間約 p ± 1.96√(p(1−p)/n)；差距落在誤差內就分不出高下。
  - **分組評估**：公平性要先定義（人口統計均等、機會均等、預測值均等等），再分組算各自的 Recall、FPR；不同公平性目標可能互相衝突。
  - **評測污染**：測試題出現在訓練資料裡，分數反映的是記憶；保留不公開的內部評測集並定期換新題。

### 7. 調整與優化（建模）

- 做什麼：先辨認問題是預測不準、過擬合、訓練不穩還是推論太慢，再選方法：超參數搜尋、正則化、Dropout、資料增強、重取樣、EarlyStopping；欠擬合時加大模型或補特徵；遷移學習則解凍後段微調；要部署到小裝置再做壓縮。
- 系統觀念：每次只改一個變數，才知道是哪個改動有效。超參數搜尋本身也在「看」驗證集，搜得越多，越需要一份完全沒碰過的測試集。GridSearchCV 直接吃 Pipeline，前處理會跟著每一折重新 fit。壓縮或偏見修正之後，整體、分組表現與延遲都要重新驗收。
- 出錯的代價：沒有診斷就盲目調參；在驗證集上調過頭，是另一種形式的資料洩漏；量化後檔案變小，少數困難案例卻變差。
- 本頁函式：`BN／Dropout`、`fit／EarlyStopping`、`凍結參數`、`Pipeline`
- 對應學習筆記：L23304、L23202、L23103、L23402
- 學習筆記重點：
  - **參數與超參數**：權重是訓練學到的；學習率、批次大小、網路深度與寬度、激活函數、優化器、正則化係數 λ 是外部設定，要用驗證結果選。
  - **搜尋方法**：Grid Search 試遍所有組合（3×4×5＝60 組，再乘 5 折就是 300 次訓練）；Random Search 隨機抽樣；Bayesian Optimization 依已試結果挑下一組。
  - **正則化**：L1（Lasso）懲罰絕對值、容易產生稀疏解；L2（Ridge）懲罰平方、讓權重變小；Elastic Net 兩者合用。太強會欠擬合。
  - **重取樣**：過採樣、欠採樣或類別權重處理不平衡，只能在訓練流程內做，並檢查是否改變評估分布。
  - **模型壓縮**：知識蒸餾（大教師教小學生）、剪枝（移除貢獻小的權重）、量化（FP32 → INT8，減少位元數不減少參數數量），壓縮後要在實機重測延遲與重要類別。
  - **偏見改善**：可在前處理（重新取樣、重新加權）、訓練中（加入公平性約束）或後處理（分組調整門檻）介入；調整後重測整體與各組。

### 8. 最終驗收與上線審查（上線）

- 做什麼：鎖定模型、前處理與判定門檻，用從未參與選模的測試集做最後一次評估；在目標硬體量延遲與記憶體；檢查分組表現、隱私與安全風險，並把資料、模型與設定的版本記錄下來。
- 系統觀念：測試分數不喜歡就回頭改，測試集就變成選模資料，需要新的獨立評估。上線審查問的不只是「準不準」，還有資料能不能這樣用、誰負責、出錯時如何回復；每個決策都要留下可追溯的紀錄。
- 出錯的代價：反覆看測試分數，報告的數字過度樂觀；後門模型在一般測試集上表現正常，常規評估抓不到。
- 本頁函式：`eval／no_grad`、`參數量`
- 對應學習筆記：L23303、L23302、L23401、L23402
- 學習筆記重點：
  - **鎖定再測試**：模型與門檻確定後才拿出測試集；看了測試分數再回去改設定，原測試集就失去獨立性。
  - **部署限制**：在實際設備上量延遲、記憶體與最慢情境；summary 估的大小不含梯度與 optimizer 狀態。
  - **模型安全**：資料投毒與後門（訓練時）、對抗樣本（推論時）、模型竊取與成員推論；追溯資料與模型來源、驗證簽章、對外部模型做觸發樣式測試。
  - **合規與紀錄**：確認資料來源合法、告知同意、跨境傳輸限制（如 GDPR）；保存資料版本、模型版本、判定紀錄與審查人。
  - **公平性稽核**：上線前分組檢查錯誤率差異，並揭露模型的適用範圍與限制。

### 9. 部署與監控（上線）

- 做什麼：推論時開 eval() 與 no_grad()，前處理沿用訓練時的參數，並記錄延遲、記憶體、輸入分布、預測分布與取得真實標籤後的線上指標；低信心或高代價的判定送人工複檢。
- 系統觀念：上線的是「前處理＋模型」整條 pipeline，不只是一個權重檔。要事先定好延遲與記憶體預算；真實資料的分布會變，監控到漂移時先調查、控制影響，再回到資料端重新收集、重新訓練，而且更新要經過驗證、可以回復到上一個通過驗證的版本。
- 出錯的代價：離線好、線上差；模型悄悄退化，卻沒有人發現；偵測到漂移就盲目自動重訓。
- 本頁函式：`eval／no_grad`、`預訓練模型`、`參數量`、`StandardScaler`
- 對應學習筆記：L23402、L23401、L23304
- 學習筆記重點：
  - **資料漂移與概念漂移**：資料漂移是輸入分布變了（換相機後亮度不同）；概念漂移是輸入與答案的關係變了。漂移告警不等於效能下降，但值得調查。
  - **監控項目**：輸入品質、預測分布、取得標籤後的 Recall／FPR，以及各班別、各產品的差異。
  - **事件應變**：夜班漏判增加：先增加複檢、限制影響、保存證據，再查光源、標籤與模型，必要時回復到先前通過驗證的模型。
  - **治理回圈**：資料、前處理、權重與門檻的更新都要驗證、審查並保留可回復的版本；模型不是自己任意學習。
  - **刪除與反學習**：當事人要求刪除時，從資料庫刪掉不等於模型忘記；要重訓、分片重訓（SISA）或做近似反學習，並用成員推論測試驗證。

### 貫穿全程

- **資料邊界**：每一步都要問：誰在什麼時候看得到哪份資料。訓練資料用來 fit，驗證資料用來挑模型，測試資料只用一次。（L23301、L23303）
- **可重現與可追溯**：固定亂數種子，並記錄套件版本、資料版本、模型版本與設定；本頁的版本表就是這個目的。每個決策都要追溯得到負責人。（L23303、L23402）
- **一致性**：訓練與推論要用同一套前處理與模式：scaler、weights.transforms()、eval()。（L23301）
- **成本**：參數量對應記憶體，運算量對應延遲，資料量對應訓練時間；每個選擇都在花這三種預算。（L23302、L23304）
- **隱私與安全**：從蒐集到刪除都要管：資料最小化、權限只給必要的人、加密與匿名化處理的是不同威脅，聯邦學習與差分隱私也有各自的限制。（L23401）
- **公平性**：整體高分可能藏著某一群總是被判錯；資料、標註、特徵與使用方式都可能帶入偏見，要分組評估並持續監控。（L23402）

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

## 真題程式逐行解讀

每一行都照原卷轉錄；shape、參數量與數值以最新穩定版實跑。

### MLP 手寫數字分類：輸出層與損失函數填空（115-1 第 40 題）

28×28 的手寫數字攤平成 784 維，分成 0~9 共 10 類，標籤已經轉成 one-hot。要填的是輸出層的激活函數 (A) 與 compile 的損失函數 (B)。

| 程式 | 意思 |
|---|---|
| `from tensorflow.keras import Sequential` | 匯入 Sequential：把層依序堆疊的模型容器。TensorFlow 2.16 起 tensorflow.keras 就是 Keras 3。 |
| `from tensorflow.keras.layers import Dense` | Dense 是全連接層：每個輸出神經元都接到所有輸入，計算 activation(x·W + b)。 |
| `model = Sequential([` | 依列表順序串接各層，資料由第一層流到最後一層。 |
| `Dense(64, activation='relu', input_shape=(784,)),` | 隱藏層：輸入 784 維、輸出 64 個神經元，ReLU 提供非線性。參數 (784＋1)×64＝50,240。input_shape 寫法在 Keras 3 會出警告，新寫法是先放 Input(shape=(784,))。 |
| `Dense(10, activation='___(A)___')` | 輸出層：10 個神經元對應 10 個數字。單標籤多類別要讓 10 個輸出變成加總為 1 的機率，所以 (A) 是 softmax。參數 (64＋1)×10＝650。 |
| `model.compile(loss='___(B)___', optimizer='adam')` | compile 設定訓練規則：loss 衡量預測和答案差多少，optimizer（Adam）決定如何用梯度更新權重。標籤是 one-hot，所以 (B) 是 categorical_crossentropy；整數標籤才用 sparse_categorical_crossentropy。 |

**解題**：選 B（softmax、categorical_crossentropy）。sigmoid＋MSE 是二元或迴歸的配法；relu 輸出不是機率；sparse_categorical_crossentropy 要配整數標籤。

### 手寫字母 OCR 的資料增強（115-1 第 41 題）

OCR 訓練時對每張圖套用下面的轉換。驗證損失一路下降，部署後 b／d／p／q 卻大量認錯，要找出根本原因。

| 程式 | 意思 |
|---|---|
| `import torchvision.transforms as transforms` | torchvision 的影像轉換模組（新程式建議改用 transforms.v2）。 |
| `transform = transforms.Compose([` | Compose 把多個轉換串成一條，每次讀取一張訓練圖片時由上到下套用一次；隨機轉換每個 epoch 結果都不同。 |
| `transforms.RandomHorizontalFlip(p=0.5),` | 每張圖有 50% 機率左右鏡像。b 鏡像後像 d、p 鏡像後像 q，標籤卻沒跟著改，等於有一半的機率餵給模型錯的答案。 |
| `transforms.RandomRotation(15),` | 在 −15°～＋15° 之間隨機旋轉，模擬書寫傾斜；這個幅度不會改變字母是哪一個。 |
| `transforms.ColorJitter(brightness=0.3),` | 亮度在 0.7～1.3 倍之間隨機調整，模擬掃描或拍照的光線差異。 |
| `transforms.ToTensor(),` | 把 PIL 影像（高×寬×通道、0～255）轉成 tensor（通道×高×寬、0～1 浮點）。前面三個轉換都能直接處理 PIL 影像，放在最後沒有問題。 |

**解題**：選 B：水平翻轉破壞了字母的方向語意。驗證集通常不做增強，所以驗證損失照樣下降，問題要到部署才浮現。

### ResNet50 遷移學習：凍結全部權重（115-1 第 42 題）

載入預訓練的 ResNet50，關掉所有既有權重的梯度，只訓練新換上的二分類頭，問這屬於哪一種遷移學習策略。

| 程式 | 意思 |
|---|---|
| `import torch.nn as nn` | nn 提供 Linear、Conv2d 等層與損失函數。 |
| `model = torchvision.models.resnet50(pretrained=True)` | 載入在 ImageNet 預訓練好的 ResNet50（25,557,032 個參數），最後一層 model.fc 是 Linear(2048, 1000)。pretrained=True 已棄用，新寫法是 weights=ResNet50_Weights.DEFAULT。 |
| `for param in model.parameters():` | 逐一走過模型裡每一個權重張量：卷積核、BatchNorm、fc 都包含在內。 |
| `param.requires_grad = False   # 行(A)` | 關掉梯度：反向傳播不再為它計算梯度，它的值就不會再被更新，整個骨幹因此凍結。 |
| `model.fc = nn.Linear(2048, 2)` | 換上新的分類頭：2048 維特徵 → 2 類。新建立的層預設 requires_grad=True，所以只有它會被訓練（2048×2＋2＝4,098 個參數）。 |
| `optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-4)` | 只把新頭的參數交給 Adam，學習率 1e-4。 |

**解題**：選 C 特徵萃取：預訓練骨幹當固定的特徵擷取器，只訓練新頭。全面微調是所有參數都更新；零樣本與知識蒸餾都不是這段程式在做的事。

### 先 LDA 降維再交叉驗證 KNN：資料洩漏（115-1 第 44 題）

用 iris 資料先做 LDA 降維，再拿 KNN 做 5 折交叉驗證，判斷這個流程對不對。

| 程式 | 意思 |
|---|---|
| `iris = fetch_ucirepo(id=53)` | 從 UCI 資料庫下載編號 53 的 iris：150 筆、4 個特徵、3 類各 50 筆。 |
| `X = iris.data.features` | 輸入特徵：花萼與花瓣的長、寬，共四欄（DataFrame）。 |
| `y = iris.data.targets['class']` | 標籤：品種名稱字串（Iris-setosa 等）。 |
| `lda = LinearDiscriminantAnalysis()` | LDA 是監督式降維：用標籤找出最能區分類別的方向，3 類最多降到 2 維。 |
| `X_new = lda.fit_transform(X, y)` | 問題就在這一行：用全部 150 筆（包含之後要當驗證折的資料）和它們的標籤 fit LDA，再轉成 150×2。驗證資料的資訊已經進了轉換規則。 |
| `model = KNeighborsClassifier(n_neighbors=3)` | KNN：找最近的 3 個鄰居投票決定類別。 |
| `scores = cross_val_score(model, X_new, y, cv=5, scoring="accuracy")` | 對已經轉好的 X_new 做 5 折交叉驗證，每一折只重新 fit KNN，LDA 不會跟著重新 fit。 |
| `scores.mean()` | 5 折準確率的平均，輸出 0.9733。 |

**解題**：選 B：存在資料洩漏，要把 LDA 和 KNN 包進 make_pipeline，交叉驗證才會在每一折的訓練資料上重新 fit LDA。以 scikit-learn 1.9.1 實測，Pipeline 版本也是 0.9733——分數一樣不代表流程正確。

### 選出能保持類別比例的 cv 寫法（115-1 第 45 題）

程式留了一行空白要填 cv，條件是每一折的類別比例都要和原始資料一致。

| 程式 | 意思 |
|---|---|
| `# 填入程式碼` | 這裡要決定 cv：資料怎麼切成 5 份。 |
| `scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")` | 依 cv 的切法，每次用 4 份訓練、1 份驗證，回傳每一折的準確率陣列。 |
| `程式碼 A：cv = KFold(n_splits=5, shuffle=True)` | 洗牌後平均切成 5 份，切的時候不看類別，比例可能跑掉。✗ |
| `程式碼 B：cv = StratifiedKFold(n_splits=5, shuffle=True)` | 分層切分：每一折的類別比例都和全體一致。✓ |
| `程式碼 C：cv = 5` | 整數加上分類器，cross_val_score 內部自動改用 StratifiedKFold(5)（不洗牌）。✓ |
| `程式碼 D：cv = RepeatedStratifiedKFold(n_splits=5, n_repeats=2)` | 分層 5 折、重複 2 次，共 10 個分數，估計更穩定。✓ |

**解題**：選 A（程式碼 B、C、D）。陷阱是 cv=5：看起來只是一個數字，對分類器卻等於分層切分。

### CIFAR-10 的像素縮放與 one-hot 標籤（115-1 第 46 題）

載入 CIFAR-10 後做兩件事：像素除以 255.0、標籤轉 one-hot，再判斷六個描述哪些正確。

| 程式 | 意思 |
|---|---|
| `(x_train, y_train), (x_test, y_test) = datasets.cifar10.load_data()` | 下載 CIFAR-10：訓練 50,000 張、測試 10,000 張 32×32 彩色圖。x_train 形狀 (50000, 32, 32, 3)、uint8 0～255；y_train 形狀 (50000, 1)、0～9 的整數。 |
| `>>> x_train[0]` | 第一張圖：32×32×3 的陣列，最內層的 [59, 62, 63] 是一個像素的 R、G、B。 |
| `array([6], dtype=uint8)` | 第一張圖的標籤是 6，在 CIFAR-10 代表青蛙（frog）。 |
| `x_train, x_test = x_train / 255.0, x_test / 255.0` | 像素除以 255.0，從 0～255 變成 0～1 的浮點數。這是等比例縮放，不是 z-score；訓練與測試用同一個常數，所以沒有洩漏問題。輸入尺度變小也讓梯度比較穩定。 |
| `y_train = tf.keras.utils.to_categorical(y_train, 10)` | 整數標籤轉 one-hot：6 → [0,0,0,0,0,0,1,0,0,0]，形狀變成 (50000, 10)，搭配 softmax 輸出與 categorical_crossentropy。 |
| `y_test = tf.keras.utils.to_categorical(y_test, 10)` | 測試標籤也要做同樣的轉換，評估時格式才一致。 |

**解題**：選 B（描述 B、D、E、F）。描述 A 錯在「0～31」（應為 0～1），描述 C 錯在把除以 255 當成 z-score。

### CIFAR-10 CNN：每一層做什麼、輸出多大（115-1 第 47 題）

四個區塊的 CNN：前三塊是「卷積 → BN → 卷積 → BN → 池化 → Dropout」，第四塊攤平後接全連接層。題目要判斷六個敘述。

| 程式 | 意思 |
|---|---|
| `layers.Input(shape=(32, 32, 3)),` | 只宣告輸入形狀：32×32 像素、3 個通道。它不做任何標準化。 |
| `layers.Conv2D(32, kernel_size=(3,3), padding="same", activation="relu"),` | 32 個 3×3 濾波器。padding="same" 在邊緣補零，所以長寬維持 32；輸出通道數等於濾波器數，形狀 (32, 32, 32)。參數 (3×3×3＋1)×32＝896。 |
| `layers.BatchNormalization(),` | 把每個通道的輸出標準化，再用可學的縮放與平移調回；穩定各層輸入分布、緩解梯度消失或爆炸。每個通道有 4 個參數（32 通道是 128）。 |
| `layers.Conv2D(32, (3,3), activation='relu', padding='same'),` | 第二個卷積：輸入已是 32 通道，參數 (3×3×32＋1)×32＝9,248，輸出仍是 (32, 32, 32)。 |
| `layers.MaxPooling2D((2,2)),` | 每個 2×2 區域取最大值，長寬減半：(32, 32, 32) → (16, 16, 32)。沒有參數。 |
| `layers.Dropout(0.25),` | 訓練時隨機把 25% 的輸出設為 0，其餘放大為 1/(1−0.25) 倍，推論時不作用；用來減少過擬合。 |
| `layers.Conv2D(64, (3,3), activation='relu', padding='same'),` | 區塊 2 把濾波器加倍到 64；區塊 2 結束是 (8, 8, 64)，區塊 3（128 個濾波器）結束是 (4, 4, 128)。長寬越來越小、通道越來越多，是 CNN 的典型設計。 |
| `layers.Flatten(),` | 把 (4, 4, 128) 的 3D 特徵圖攤平成 2,048 維的 1D 向量，才能接全連接層。 |
| `layers.Dense(256, activation='relu'),` | 全連接層：參數 (2048＋1)×256＝524,544，占整個模型 816,938 個參數的六成以上——參數集中在全連接層。 |
| `layers.Dropout(0.5),` | 全連接層參數最多、最容易過擬合，所以這裡丟棄率提高到 50%。 |
| `layers.Dense(10, activation='softmax')` | 輸出層：10 類的機率分布，配合 one-hot 標籤與 categorical_crossentropy。 |

**解題**：選 B（描述 C、E、F）。描述 A 錯（Input 不做標準化），描述 B 錯（輸出是 (32,32,32) 不是 (32,32,3)），描述 D 錯（Dropout 設為 0 不是 1）。

### PyTorch 訓練迴圈：梯度裁剪插在哪裡（115-1 第 50 題）

訓練時 loss 突然變成 NaN，要在迴圈裡加入 clip_grad_norm_，選出插入位置與作用。

| 程式 | 意思 |
|---|---|
| `for images, labels in train_loader:` | DataLoader 每次給一個批次（batch）的影像與標籤；整個迴圈跑完就是一個 epoch。 |
| `optimizer.zero_grad()                # 位置 1` | 清掉上一批留下的梯度。PyTorch 的梯度會累加，不清就會越疊越大。 |
| `outputs = model(images)              # 位置 2` | 前向傳播：算出這一批的預測（logits）。 |
| `loss = criterion(outputs, labels)    # 位置 3` | 用損失函數計算預測和答案的差距，得到一個純量。 |
| `loss.backward()                      # 位置 4` | 反向傳播：算出每個參數的梯度，存在 param.grad。到這一步梯度才存在。 |
| `optimizer.step()                     # 位置 5` | 依梯度更新權重。梯度裁剪必須在這之前，才會影響這一次更新。 |

**解題**：選 B：插在位置 4 與 5 之間，把所有梯度的總範數限制在 max_norm 以內，避免一步跨太大讓數值發散。實測一次異常梯度範數約 121 萬，裁剪後為 1.0。裁的是梯度，不是 loss，也不是更新後的權重。

### 手寫評估指標函式（114-2 第 38 題）

只有兩行的函式，要認出它是哪一種迴歸指標。

| 程式 | 意思 |
|---|---|
| `def metric(y_true, y_pred):` | 輸入實際值與預測值（兩個長度相同的陣列）。 |
| `return sum((y_true - y_pred) ** 2) / len(y_true)` | 由內往外讀：y_true − y_pred 是每筆誤差，** 2 平方，sum 加總，除以筆數就是平均。「平方誤差的平均」＝MSE。例：[3,5,2] 與 [2,5,4] 得 (1＋0＋4)/3＝1.667。 |

**解題**：選 B（MSE）。若再開根號是 RMSE；把平方換成絕對值是 MAE；R² 是 1 − SS_res／SS_tot。

### 用 NumPy 手寫的正則化（114-2 第 39 題）

一個依 training 旗標決定行為的 forward 函式，要認出它實作的是哪一種正則化。

| 程式 | 意思 |
|---|---|
| `def forward(x, p, training=True):` | x 是這一層的輸出，p 是保留機率，training 區分訓練與推論。 |
| `mask = np.random.binomial(1, p, size=x.shape)` | 產生和 x 同形狀的 0／1 遮罩，每個位置是 1 的機率為 p。例如 p＝0.8 時大約 80% 是 1。 |
| `return x * mask / p` | 遮罩為 0 的神經元輸出被歸零（隨機丟棄），剩下的除以 p 放大，讓輸出的期望值和原來一樣。這叫 inverted dropout。 |
| `return x` | 推論時不丟棄、也不必再縮放，因為訓練時已經補償過了。 |

**解題**：選 C（Dropout）。注意這裡的 p 是「保留率」；Keras 的 Dropout(rate) 與 PyTorch 的 nn.Dropout(p) 都是「丟棄率」。L1／L2 是在損失函數加懲罰項，BatchNorm 是做標準化，都不會隨機歸零。

### NumPy 向量與矩陣運算（114-2 第 40 題）

只宣告了兩個向量和一個矩陣，選項問各種運算的結果與函式功能。

| 程式 | 意思 |
|---|---|
| `v1 = np.array([1, 2, 3])` | 長度 3 的一維陣列（向量）。 |
| `v2 = np.array([4, 5, 6])` | 另一個長度 3 的向量。 |
| `A = np.array([[1, 2], [3, 4]])` | 2×2 矩陣。np.linalg.det(A)＝1×4 − 2×3＝−2；inv(A) 是反矩陣；eig(A) 回傳特徵值與特徵向量。 |

**解題**：選 C：np.dot(v1, v2)＝1×4＋2×5＋3×6＝32，NumPy 2 起顯示為 np.int64(32)。v1 * v2 是逐元素相乘得 [4, 10, 18]（選項 B 的 [5, 7, 9] 是相加）；inv 是反矩陣不是行列式，eig 是特徵值不是反矩陣。

### 蒙地卡羅模擬條件機率（114-2 第 41 題）

擲骰子 10 萬次，用布林陣列估計 P(擲出偶數｜擲出大於 3)。

| 程式 | 意思 |
|---|---|
| `np.random.seed(123)` | 固定亂數種子，每次執行都得到同一串亂數，結果可重現。 |
| `n = 100000` | 模擬次數。次數越多，估計值越接近理論值。 |
| `dice_rolls = np.random.randint(1, 7, size=n)` | 產生 10 萬個 1～6 的整數。上界 7 不包含。 |
| `A = (dice_rolls % 2 == 0)` | 事件 A（偶數）：除以 2 餘 0 的位置是 True。得到 10 萬個 True／False 的布林陣列。 |
| `B = (dice_rolls > 3)` | 事件 B（大於 3，即 4、5、6）的布林陣列。 |
| `A_and_B = A & B` | 逐元素取交集：既是偶數又大於 3（4 或 6）。陣列之間要用 &，不能用 and。 |

**解題**：選 D：P(A|B)＝A_and_B.sum() / B.sum()，分母是「已知發生」的 B。實測 33,288 / 49,888 ≈ 0.667（理論 2/3）。小心：這顆骰子的 A 和 B 剛好都是一半機率，選項 C 除以 A.sum() 也算出 0.667，數值幾乎一樣，只能靠定義判斷。

### VGG16 的 summary：參數量、運算量與記憶體（114-2 第 42 題、114-2 第 43 題、114-2 第 44 題）

同一張 VGG16 summary 連出三題：哪種層參數最多、哪種層運算量最多、哪個敘述正確。

| 程式 | 意思 |
|---|---|
| `model = models.vgg16(weights='IMAGENET1K_V1')` | 載入 ImageNet 預訓練的 VGG16：13 層卷積（model.features）＋3 層全連接（model.classifier），共 138,357,544 個參數。 |
| `summary(model, (3,150,150))` | torchsummary 以一張 3×150×150 的輸入跑一次前向，逐層列出輸出形狀與參數量。-1 代表批次大小不固定。 |
| `Conv2d-1    [-1, 64, 150, 150]           1,792` | 第一個卷積：64 個 3×3×3 濾波器，(3×3×3＋1)×64＝1,792。參數很少，但要在 150×150 的每個位置計算，運算量很大。 |
| `ReLU-2    [-1, 64, 150, 150]               0` | 激活函數沒有參數，形狀不變。 |
| `MaxPool2d-5      [-1, 64, 75, 75]               0` | 池化讓長寬減半（150 → 75），也沒有參數。 |
| `Linear-33                [-1, 4096]     102,764,544` | 第一個全連接層：(25,088＋1)×4,096＝102,764,544，包含 bias。25,088＝512×7×7：150×150 輸入在最後一個池化後是 4×4，但 AdaptiveAvgPool2d 會固定調成 7×7。一層就占全模型七成以上的參數。 |
| `Params size (MB): 527.79` | 參數本身占的記憶體（float32 每個 4 bytes）。 |
| `Estimated Total Size (MB): 624.98` | 輸入＋單次前向／反向的中間結果＋參數。不含梯度與 optimizer 狀態（Adam 每個參數還要多存兩份），實際訓練需要的記憶體遠大於 625MB。 |

**解題**：第 42 題選 B（全連接層參數最多）；第 43 題選 A（卷積層運算量最多，因為要在整張特徵圖上滑動計算）；第 44 題選 D（13 層卷積＋3 層全連接、約 138.36M 參數）。A 錯在輸入維度應為 512×7×7＝25,088，B 錯在參數其實含 bias，C 錯在 625MB 不含梯度與 optimizer 狀態。

### VGG16 只凍結卷積層的正確寫法（114-2 第 45 題）

要凍結卷積層、只訓練全連接層（classifier），四個選項只差在凍結的那幾行。

| 程式 | 意思 |
|---|---|
| `model = models.vgg16(pretrained=True)` | 載入預訓練 VGG16（舊寫法，新版是 weights=VGG16_Weights.IMAGENET1K_V1）。model.features 是 13 層卷積，model.classifier 是 3 層全連接。 |
| `for param in model.parameters():` | 選項 A：凍結全部參數。之後換上的新層還是可訓練，結果只剩新層 40,970 個參數會學——是特徵萃取，不是題目要的「訓練整個 classifier」。 |
| `for param in model.features.parameters():` | 選項 B：只走過卷積層的參數並凍結，classifier 三層全部保持可訓練（119,586,826 個參數）。✓ |
| `for param in model.classifier.parameters():` | 選項 C：反過來凍結了全連接層，卷積層仍在訓練，與題目相反。 |
| `model.requires_grad = False` | 選項 D：只是在 model 物件上多設一個屬性，沒有改到任何參數，實測可訓練參數仍是 138,357,544。真正的寫法是 model.requires_grad_(False)。 |
| `model.classifier[6] = torch.nn.Linear(4096, 10)` | 四個選項都有：把最後一層 4096 → 1000 換成 4096 → 10，對應新任務的 10 類。 |

**解題**：選 B。記法：features 是卷積骨幹、classifier 是分類頭；凍結要對「參數」設 requires_grad，而不是對模型物件。

### PCA 降噪為什麼沒有效（114-2 第 46 題）

對加了雜訊的手寫數字做 PCA 降噪，執行後影像還是很雜，要找出哪一行設定錯了。

| 程式 | 意思 |
|---|---|
| `digits = load_digits()` | 載入 scikit-learn 內建的手寫數字：1,797 張 8×8 灰階圖，像素值 0～16。 |
| `digits.data.shape` | 輸出 (1797, 64)：每張圖攤平成 64 個特徵。 |
| `noisy = np.random.normal(digits.data, 4)` | 以每個像素的原值為平均、標準差 4 加上常態雜訊，模擬筆跡模糊與干擾點。 |
| `from sklearn.decomposition import PCA          #程式碼A` | 匯入 PCA 類別，沒有任何設定可以錯。 |
| `pca = PCA()                                     #程式碼B` | 錯在這裡：沒給 n_components，會保留全部 64 個主成分，雜訊所在的小變異方向也全留著。 |
| `pca.fit(noisy)                                  #程式碼C` | 在含雜訊的資料上找主成分。筆畫結構造成的變異大，雜訊分散在各方向，所以前幾個主成分仍以筆畫為主。 |
| `components = pca.transform(noisy)               #程式碼D` | 投影到主成分座標，形狀是 (1797, 保留的成分數)。 |
| `filtered = pca.inverse_transform(components)    #程式碼E` | 從主成分座標轉回 64 維像素。保留全部成分時等於原封不動還原，雜訊一起回來。 |

**解題**：選 B：改成例如 PCA(n_components=0.50)，只保留解釋 50% 變異的 12 個主成分。實測還原後與乾淨影像的誤差由 16.1 降到 7.3。

### 四組 KNN 交叉驗證程式，哪幾組能正確輸出準確率（114-2 第 47 題）

四組程式只差在 cv（StratifiedKFold 物件或整數 5）和 scoring（accuracy 或 f1）。digits 有 10 類。

| 程式 | 意思 |
|---|---|
| `X, y = digits.data, digits.target` | X 是 1797×64 的像素，y 是 0～9 的數字標籤（10 類，多類別問題）。 |
| `cv = StratifiedKFold(n_splits=5, shuffle=True)` | 程式碼 A、B：分層 5 折並洗牌。沒給 random_state，每次跑出的分數會略有不同，但能正常執行。 |
| `scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")` | 程式碼 A：多類別準確率，正確。✓ |
| `scores = cross_val_score(model, X, y, cv=cv, scoring="f1")` | 程式碼 B："f1" 預設 average="binary"，只適用二元分類。10 類資料每一折都失敗，分數變成 nan 並出警告。✗ |
| `scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")` | 程式碼 C：cv=5 對分類器就是 StratifiedKFold(5)，準確率正確。✓ |
| `scores = cross_val_score(model, X, y, cv=5, scoring="f1")` | 程式碼 D：同 B 的問題，得到 nan。多類別要寫 "f1_macro" 或 "f1_weighted"。✗ |
| `print(scores.mean())` | 印出 5 折的平均分數；只要有一折是 nan，平均就是 nan。 |

**解題**：選 B（程式碼 A、C）。題目要的是「輸出準確率」，f1 在多類別資料不但不是準確率，還會得到 nan。

### 手寫 z-score 標準化（114-2 第 48 題）

四行程式分別對訓練集與測試集做減平均、除標準差，判斷六個敘述。

| 程式 | 意思 |
|---|---|
| `X_train -= X_train.mean(axis=0)` | axis=0 沿著列方向計算，得到每個特徵（每一欄）各自的平均；減掉後每個特徵的平均變成 0。 |
| `X_train /= X_train.std(axis=0)` | 再除以每個特徵的標準差，標準差變成 1。結果是 z-score，數值可以小於 0 或大於 1，不是壓到 0～1。 |
| `X_test  -= X_test.mean(axis=0)` | 測試集用了自己的平均。考試照官方答案不扣這點，但實務上這是錯的：測試集應該套用訓練集的平均與標準差。 |
| `X_test  /= X_test.std(axis=0)` | 測試集自己除以自己的標準差，會讓測試集的平均永遠被拉回 0。實測當測試資料整體偏移時，正確做法得到平均約 0.6～0.7，這種寫法卻是 0，分布變化就被抹掉了。 |

**解題**：選 C（A、D）：減平均使平均為 0；標準化讓各特徵尺度一致，有助於緩解梯度爆炸或消失。壓到 0～1 是 Min-Max；標準化屬於特徵縮放，不是特徵選擇。

### Keras 二元分類 MLP 的 summary 填空（114-2 第 49 題）

三層 Dense 的二元分類模型，summary 裡前兩層的參數量被挖空。從最後一層的 11 可以反推輸入維度。

| 程式 | 意思 |
|---|---|
| `model = Sequential()` | 建立空的 Sequential 模型，之後用 add 一層層加上去。 |
| `model.add(Input(shape=(X_train.shape[1],)))` | 輸入維度＝訓練資料的欄數（特徵數）。由空格 1 是 100 可反推特徵數是 9：(9＋1)×10＝100。 |
| `model.add(Dense(10, activation="relu"))` | 第一隱藏層：10 個神經元。參數 (9＋1)×10＝100 → 空格 1。 |
| `model.add(Dense(10, activation="relu"))` | 第二隱藏層：輸入是上一層的 10 個輸出，參數 (10＋1)×10＝110 → 空格 2。 |
| `model.add(Dense(1, activation="sigmoid"))` | 輸出層：1 個神經元加 sigmoid，輸出 0～1 的機率，適用二元分類。參數 (10＋1)×1＝11。 |
| `model.compile(loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"])` | 二元分類的標準配法：sigmoid 輸出配 binary_crossentropy，訓練時另外回報準確率。 |

**解題**：選 C（空格 1＝100、空格 2＝110）。A 把 sigmoid 的公式 1/(1＋e⁻ˣ) 安在 ReLU 上（ReLU 是 max(0, x)）；D 錯在 sigmoid 用於二元或多標籤，多類別要用 softmax。

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
