import type { Question } from "../types";

export const generated: Question[] = [
  // ── L231 機器學習基礎數學（q001–q006）─────────────────────
  {
    id: "senior-ml-gen-q001",
    subjectId: "senior-ml",
    prompt:
      "對線性迴歸的均方誤差損失 L(w)=(1/n)Σ(y_i − w·x_i)²，使用梯度下降更新權重時，下列關於「學習率（learning rate）」過大的敘述何者最正確？",
    choices: [
      { id: "A", text: "學習率過大會使每步更新幅度過大，可能在最小值附近震盪甚至發散而無法收斂" },
      { id: "B", text: "學習率過大保證更快收斂到全域最小值，沒有任何副作用" },
      { id: "C", text: "學習率只影響輸出維度，與收斂速度或穩定性無關" },
      { id: "D", text: "學習率過大會直接把損失函數變成非凸函數" },
    ],
    answer: "A",
    explanation:
      "梯度下降的更新量正比於學習率與梯度，學習率過大會使每步跨越過大，在最小值附近來回震盪甚至發散（A）。它不保證更快且無副作用（B）；它直接影響收斂速度與穩定性（C）；學習率是步長設定，不會改變損失函數本身的凸性（D）。本題對應機器學習基礎數學的最佳化與梯度概念。",
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q002",
    subjectId: "senior-ml",
    prompt:
      "已知二維向量 a=(2, 3)、b=(4, −1)，其內積（dot product）a·b 的值為下列何者？",
    choices: [
      { id: "A", text: "11" },
      { id: "B", text: "5" },
      { id: "C", text: "8" },
      { id: "D", text: "14" },
    ],
    answer: "B",
    explanation:
      "內積為對應分量相乘後相加：a·b = 2×4 + 3×(−1) = 8 − 3 = 5（B）。選項 A（11）誤把第二項當作正號相加（8+3）；C（8）只算了第一項；D（14）無對應的正確計算依據。內積屬機器學習基礎數學中的線性代數運算。",
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q003",
    subjectId: "senior-ml",
    prompt:
      "某資料集數值為 2、4、4、4、5、5、7、9。其平均數為 5，下列關於此資料「母體變異數（population variance）」的計算何者正確？",
    choices: [
      { id: "A", text: "變異數為 8，因為直接取最大值與最小值之差" },
      { id: "B", text: "變異數為 0，因為平均數為整數" },
      { id: "C", text: "變異數為 4，由各值與平均數差的平方平均求得" },
      { id: "D", text: "變異數為 5，等於平均數本身" },
    ],
    answer: "C",
    explanation:
      "母體變異數為各值與平均數差的平方之平均：差為 −3,−1,−1,−1,0,0,2,4，平方為 9,1,1,1,0,0,4,16，總和 32，除以 8 個樣本得 4（C）。極差（max−min=7）並非變異數（A）；平均為整數不代表離散度為零（B）；變異數與平均數無必然相等關係（D）。屬基礎數學的機率統計。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q004",
    subjectId: "senior-ml",
    prompt:
      "某疾病盛行率 P(D)=1%。某檢測對患者的真陽性率 P(+|D)=90%，對非患者的偽陽性率 P(+|¬D)=9%。若一人檢測為陽性，依貝氏定理其真正患病的後驗機率 P(D|+) 最接近下列何者？",
    choices: [
      { id: "A", text: "約 90%，因為檢測真陽性率為 90%" },
      { id: "B", text: "約 50%，因為陽性與陰性各半" },
      { id: "C", text: "約 1%，等於盛行率本身" },
      { id: "D", text: "約 9%，因為基底率很低使後驗機率仍偏低" },
    ],
    answer: "D",
    explanation:
      "依貝氏定理 P(D|+)=P(+|D)P(D) / [P(+|D)P(D)+P(+|¬D)P(¬D)] = (0.9×0.01)/(0.9×0.01 + 0.09×0.99) = 0.009/(0.009+0.0891) = 0.009/0.0981 ≈ 0.092，約 9%（D）。誤以真陽性率當後驗（A）忽略低盛行率；50%（B）與 1%（C）均無依據。本題為基礎數學的貝氏與條件機率。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q005",
    subjectId: "senior-ml",
    prompt:
      "在二元分類中常用的交叉熵（cross-entropy）損失，相較於均方誤差（MSE）搭配 Sigmoid 輸出，主要優勢為下列何者？",
    choices: [
      { id: "A", text: "交叉熵能使模型輸出必為整數，免去機率解讀" },
      { id: "B", text: "交叉熵在預測錯誤且機率接近 0 或 1 時提供較大梯度，緩解梯度消失、利於收斂" },
      { id: "C", text: "交叉熵不需要真實標籤即可計算損失" },
      { id: "D", text: "交叉熵僅適用於迴歸問題而不適用分類" },
    ],
    answer: "B",
    explanation:
      "MSE 搭配 Sigmoid 在輸出接近飽和時梯度趨近於零，易梯度消失；交叉熵的梯度形式可在預測嚴重錯誤時提供較大梯度，利於收斂（B）。交叉熵輸出仍為機率而非整數（A）；計算損失仍需真實標籤（C）；交叉熵正是分類常用而非迴歸專用（D）。屬基礎數學的損失函數。",
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q006",
    subjectId: "senior-ml",
    prompt:
      "關於 L1 範數（L1 norm）與 L2 範數（L2 norm）的數學定義，下列敘述何者正確？",
    choices: [
      { id: "A", text: "L1 範數為各分量平方和；L2 範數為各分量絕對值之和" },
      { id: "B", text: "兩者皆為各分量的最大絕對值，僅名稱不同" },
      { id: "C", text: "L1 範數恆等於 L2 範數，差別只在書寫方式" },
      { id: "D", text: "L1 範數為各分量絕對值之和；L2 範數為各分量平方和之平方根" },
    ],
    answer: "D",
    explanation:
      "L1 範數定義為各分量絕對值之和 Σ|x_i|；L2 範數為各分量平方和再開根號 √(Σx_i²)（D）。選項 A 將兩者定義對調且 L1 漏開根號；最大絕對值是 L∞ 範數而非 L1/L2（B）；兩者數值一般不相等（C）。範數屬基礎數學的線性代數，並為正則化的基礎。",
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "易",
    source: "generated",
  },

  // ── L232 機器學習與深度學習（q007–q012）───────────────────
  {
    id: "senior-ml-gen-q007",
    subjectId: "senior-ml",
    prompt:
      "下列哪一種學習範式最符合「強化學習（Reinforcement Learning）」的核心特徵？",
    choices: [
      { id: "A", text: "完全以標註好的輸入輸出對訓練，目標為最小化預測誤差" },
      { id: "B", text: "在無任何標籤下，僅依資料相似度將樣本分群" },
      { id: "C", text: "代理人（agent）透過與環境互動、依獎勵訊號試誤學習以最大化累積報酬" },
      { id: "D", text: "僅將高維資料投影到低維以保留主要變異" },
    ],
    answer: "C",
    explanation:
      "強化學習由代理人與環境互動，依獎勵訊號試誤學習，目標是最大化長期累積報酬（C）。以標註輸入輸出對訓練是監督式學習（A）；依相似度分群是非監督式分群（B）；降維保留變異是 PCA 等技術（D）。屬機器學習與深度學習的學習範式。",
    topic: "L23201 機器學習原理與技術",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q008",
    subjectId: "senior-ml",
    prompt:
      "卷積神經網路（CNN）中「池化層（Pooling layer，如 Max Pooling）」的主要作用為下列何者？",
    choices: [
      { id: "A", text: "增加特徵圖的空間解析度以保留所有像素細節" },
      { id: "B", text: "將輸入影像轉為灰階以便後續處理" },
      { id: "C", text: "替模型自動標註訓練資料的類別標籤" },
      { id: "D", text: "對特徵圖做降採樣以縮減尺寸、降低運算量並提供一定的平移不變性" },
    ],
    answer: "D",
    explanation:
      "池化層對特徵圖降採樣，縮減空間尺寸、降低運算量與參數，並提供一定程度的平移不變性（D）。它是縮小而非增加解析度（A）；不負責灰階轉換（B）；也不會自動產生標籤（C）。屬深度學習中的 CNN 結構。",
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q009",
    subjectId: "senior-ml",
    prompt:
      "Transformer 架構相較於傳統 RNN 在處理長序列時的主要優勢，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "自注意力機制可平行處理整個序列並直接建模任意位置間的依賴關係" },
      { id: "B", text: "Transformer 必須逐時間步循環計算，因此比 RNN 更難平行化" },
      { id: "C", text: "Transformer 完全不需要位置資訊即可正確理解詞序" },
      { id: "D", text: "Transformer 僅能處理固定長度為一的輸入" },
    ],
    answer: "A",
    explanation:
      "Transformer 以自注意力機制可平行處理整個序列，並直接建模任意位置間的長距依賴，避免 RNN 逐步循環的瓶頸（A）。逐步循環難平行化是 RNN 的特性而非 Transformer（B）；Transformer 需位置編碼補充詞序資訊（C）；其可處理變長序列而非長度為一（D）。屬深度學習的序列模型。",
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q010",
    subjectId: "senior-ml",
    prompt:
      "關於集成學習中「Bagging（如隨機森林）」與「Boosting（如 AdaBoost、梯度提升）」的差異，下列敘述何者正確？",
    choices: [
      { id: "A", text: "Bagging 依序訓練、後一模型針對前一模型錯誤加權；Boosting 則平行獨立訓練再投票" },
      { id: "B", text: "兩者皆只能用於非監督分群，無法用於分類或迴歸" },
      { id: "C", text: "Bagging 平行獨立訓練多個模型再彙整以降低變異；Boosting 依序訓練、聚焦修正前一輪錯誤以降低偏差" },
      { id: "D", text: "Boosting 一定不會過擬合，而 Bagging 一定會過擬合" },
    ],
    answer: "C",
    explanation:
      "Bagging 以自助抽樣平行訓練多個獨立模型再彙整，主要降低變異；Boosting 依序訓練、每輪聚焦修正前一輪的錯誤，主要降低偏差（C）。選項 A 將兩者描述對調；兩者皆可用於分類與迴歸而非僅分群（B）；Boosting 對雜訊敏感、也可能過擬合，無「一定不會」之說（D）。屬機器學習的集成方法。",
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q011",
    subjectId: "senior-ml",
    prompt:
      "K-means 分群演算法的主要特性，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "不需任何距離度量，純以樣本標籤決定分群" },
      { id: "B", text: "會自動找出最佳群數，使用者無須設定 K" },
      { id: "C", text: "本質為監督式學習，必須使用真實類別標籤訓練" },
      { id: "D", text: "需預先指定群數 K，反覆指派樣本至最近群心並更新群心以最小化群內平方誤差" },
    ],
    answer: "D",
    explanation:
      "K-means 需先指定群數 K，透過反覆將樣本指派至最近群心、再更新群心，迭代最小化群內平方誤差（D）。它依賴距離度量（A）；不會自動決定 K，常需以肘部法等輔助選擇（B）；屬非監督式學習、不使用真實標籤（C）。屬機器學習的非監督分群。",
    topic: "L23202 常見機器學習演算法",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q012",
    subjectId: "senior-ml",
    prompt:
      "深度神經網路中採用 ReLU（Rectified Linear Unit）作為激活函數，相較於 Sigmoid 的主要優點為下列何者？",
    choices: [
      { id: "A", text: "ReLU 的輸出恆介於 0 與 1 之間，方便解讀為機率" },
      { id: "B", text: "ReLU 在正區間導數為常數 1，可緩解深層網路的梯度消失問題並加速訓練" },
      { id: "C", text: "ReLU 完全不引入非線性，因此可省略後續所有層" },
      { id: "D", text: "ReLU 必使網路參數量大幅減少一半" },
    ],
    answer: "B",
    explanation:
      "ReLU 在正區間導數恆為 1，不像 Sigmoid 在飽和區梯度趨近於零，故能緩解深層網路的梯度消失並加速訓練（B）。輸出介於 0~1 是 Sigmoid 的特性（A）；ReLU 為非線性激活，仍提供非線性表達（C）；它不改變參數量（D）。屬深度學習的激活函數。",
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
  },

  // ── L233 機器學習建模與參數調校（q013–q018）────────────────
  {
    id: "senior-ml-gen-q013",
    subjectId: "senior-ml",
    prompt:
      "某二元分類器在測試集上：真陽性 TP=40、偽陽性 FP=10、偽陰性 FN=40、真陰性 TN=10。其 F1 分數最接近下列何者？",
    choices: [
      { id: "A", text: "約 0.62" },
      { id: "B", text: "約 0.80" },
      { id: "C", text: "約 0.50" },
      { id: "D", text: "約 0.20" },
    ],
    answer: "A",
    explanation:
      "Precision = TP/(TP+FP) = 40/50 = 0.8；Recall = TP/(TP+FN) = 40/80 = 0.5；F1 = 2×P×R/(P+R) = 2×0.8×0.5/1.3 = 0.8/1.3 ≈ 0.615，約 0.62（A）。0.80 只是 precision（B）；0.50 只是 recall（C）；0.20 無依據（D）。屬建模的評估指標。",
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q014",
    subjectId: "senior-ml",
    prompt:
      "當模型在訓練集表現極佳但在驗證集表現明顯變差時，最可能的情況與其常見對策為下列何者？",
    choices: [
      { id: "A", text: "屬欠擬合（underfitting），應增加模型複雜度即可" },
      { id: "B", text: "屬過擬合（overfitting），可採用正則化、增加訓練資料或提早停止等方式緩解" },
      { id: "C", text: "屬資料外洩，唯一解法是刪除驗證集" },
      { id: "D", text: "屬正常現象，訓練與驗證落差越大代表泛化越好" },
    ],
    answer: "B",
    explanation:
      "訓練表現好但驗證明顯變差是過擬合的典型徵兆，可透過正則化、增加資料、提早停止、降低模型複雜度等緩解（B）。欠擬合是訓練與驗證皆差（A）；刪除驗證集無法解決且失去評估依據（C）；落差越大代表泛化越差而非越好（D）。屬建模的過/欠擬合。",
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q015",
    subjectId: "senior-ml",
    prompt:
      "關於 k 折交叉驗證（k-fold cross-validation）的目的與作法，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "將資料切成 k 份，輪流以其中一份作驗證、其餘訓練，綜合 k 次結果以較穩健地估計泛化能力" },
      { id: "B", text: "只用一次固定切分，因此估計變異最小" },
      { id: "C", text: "k 折交叉驗證會把測試集併入訓練以提高準確率" },
      { id: "D", text: "k 值越大運算成本越低，故應一律取 k 等於 2" },
    ],
    answer: "A",
    explanation:
      "k 折交叉驗證將資料切成 k 份，輪流取一份驗證、其餘訓練，綜合 k 次結果以較穩健估計泛化能力（A）。單次固定切分變異較大而非最小（B）；正確作法不會把保留的測試集混入訓練（C）；k 越大運算成本通常越高，且 k=2 並非通則（D）。屬建模的交叉驗證。",
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q016",
    subjectId: "senior-ml",
    prompt:
      "在超參數調校時，「網格搜尋（Grid Search）」與「隨機搜尋（Random Search）」的比較，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "網格搜尋在高維超參數空間中總是比隨機搜尋更省運算且更易找到佳解" },
      { id: "B", text: "兩者皆需在訓練資料上直接最大化測試集準確率，與驗證無關" },
      { id: "C", text: "隨機搜尋在高維空間中常以較少嘗試覆蓋更廣的取值組合，效率往往優於網格搜尋" },
      { id: "D", text: "隨機搜尋必須先窮舉所有組合才能隨機抽樣" },
    ],
    answer: "C",
    explanation:
      "隨機搜尋在高維超參數空間中常以較少嘗試覆蓋更廣的取值組合，效率往往優於需窮舉所有格點的網格搜尋（C）。網格搜尋在高維會組合爆炸、並非總是更省（A）；調校應依驗證集而非直接在測試集上最佳化（B）；隨機搜尋是抽樣而非先窮舉（D）。屬建模的超參數調校。",
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q017",
    subjectId: "senior-ml",
    prompt:
      "關於特徵縮放（feature scaling，如標準化或正規化）的時機，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "所有模型都必須先做特徵縮放才能訓練，否則無法運作" },
      { id: "B", text: "特徵縮放只會改變類別標籤，不影響特徵數值" },
      { id: "C", text: "對 KNN、SVM、梯度下降類等對特徵尺度敏感的模型有助益，但純樹模型通常較不受尺度影響" },
      { id: "D", text: "決策樹與隨機森林對特徵尺度極度敏感，務必先標準化" },
    ],
    answer: "C",
    explanation:
      "KNN、SVM、以及採梯度下降的模型對特徵尺度敏感，縮放有助收斂與距離計算；而以分裂閾值運作的純樹模型（決策樹、隨機森林）對單調尺度變化通常不敏感（C、亦否定 D）。並非所有模型都必須縮放（A）；縮放作用於特徵數值而非標籤（B）。屬建模的特徵工程。",
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q018",
    subjectId: "senior-ml",
    prompt:
      "在類別嚴重不平衡（如詐欺偵測，正例僅佔 1%）的分類任務中，下列哪一項評估或處理方式較為合適？",
    choices: [
      { id: "A", text: "只看整體準確率（accuracy），因為它最能反映少數類別表現" },
      { id: "B", text: "將所有樣本一律預測為多數類別，以追求最高準確率作為最終模型" },
      { id: "C", text: "改以精確率、召回率、F1 或 PR-AUC 等指標評估，並可搭配重抽樣或類別權重等處理" },
      { id: "D", text: "刪除全部少數類別樣本後再訓練，以簡化問題" },
    ],
    answer: "C",
    explanation:
      "不平衡資料下準確率會被多數類別主導而失真，應改用精確率、召回率、F1 或 PR-AUC，並可搭配重抽樣（過抽樣/欠抽樣）或類別權重（C）。只看準確率會誤判少數類表現（A）；全部預測多數類雖準確率高卻完全抓不到少數類（B）；刪除少數類使模型失去學習目標（D）。屬建模的評估指標與不平衡處理。",
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
  },

  // ── L234 機器學習治理（q019–q024）─────────────────────────
  {
    id: "senior-ml-gen-q019",
    subjectId: "senior-ml",
    prompt:
      "關於模型可解釋性工具 SHAP 與 LIME 的共同定位，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者皆用於提升模型訓練速度，與解釋輸出無關" },
      { id: "B", text: "兩者皆會把黑箱模型重新訓練成線性模型以取代原模型" },
      { id: "C", text: "兩者皆僅適用於影像，無法解釋表格或文字模型" },
      { id: "D", text: "兩者皆為事後（post-hoc）解釋方法，量化各特徵對個別預測的貢獻以協助理解模型決策" },
    ],
    answer: "D",
    explanation:
      "SHAP 與 LIME 皆為事後（post-hoc）解釋方法，透過量化各特徵對個別預測的貢獻，協助理解黑箱模型的決策（D）。它們的目的是解釋而非加速訓練（A）；LIME 在局部以可解釋模型近似，但不取代或重訓原模型（B）；兩者可用於表格、文字、影像等多種資料（C）。屬機器學習治理的可解釋性。",
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q020",
    subjectId: "senior-ml",
    prompt:
      "某銀行信貸模型對不同性別群體的核准率與錯誤率差距明顯。從負責任 AI 的「公平性」角度，下列何者為較合適的處理方向？",
    choices: [
      { id: "A", text: "檢視並衡量群體間的差異（如均等機會、人口均等），透過資料、特徵或後處理等方式減緩偏差" },
      { id: "B", text: "只要模型整體準確率高，群體間差距可完全忽略" },
      { id: "C", text: "直接把性別欄位刪除即可保證完全無偏差，無須再評估" },
      { id: "D", text: "公平性與模型治理無關，屬純技術調參問題" },
    ],
    answer: "A",
    explanation:
      "公平性處理應先以均等機會、人口均等等指標衡量群體差異，再透過資料、特徵或後處理等方式減緩偏差（A）。整體準確率高不代表各群體公平（B）；僅刪除敏感欄位仍可能因代理變數殘留偏差，不能保證無偏（C）；公平性正是模型治理的核心議題而非單純調參（D）。屬機器學習治理的公平性與偏差。",
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q021",
    subjectId: "senior-ml",
    prompt:
      "模型部署上線後，輸入資料的統計分布隨時間改變，導致模型效能逐漸下降。此現象與其常見因應，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "此為資料漂移（data drift），應持續監控分布與效能指標並適時重新訓練模型" },
      { id: "B", text: "此為過擬合，唯一解法是增加訓練輪數" },
      { id: "C", text: "模型一旦部署其效能即恆定不變，分布改變不影響表現" },
      { id: "D", text: "只要硬體足夠強大，資料漂移就不會發生" },
    ],
    answer: "A",
    explanation:
      "輸入分布隨時間改變使模型效能下降是資料漂移（data drift／concept drift），因應方式是持續監控資料分布與效能指標，並在必要時以新資料重新訓練（A）。這與過擬合是不同概念（B）；部署後效能會隨環境改變而非恆定（C）；硬體效能與漂移的發生無關（D）。屬機器學習治理的監控與 MLOps。",
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q022",
    subjectId: "senior-ml",
    prompt:
      "為在模型訓練中保護個人資料隱私，「差分隱私（Differential Privacy）」的核心機制為下列何者？",
    choices: [
      { id: "A", text: "將所有原始個資以明文上傳至公有雲集中訓練以提高準確度" },
      { id: "B", text: "在查詢結果或訓練過程中加入經校準的雜訊，使單一個體是否在資料集中難以被辨識，並提供可量化的隱私保證" },
      { id: "C", text: "把資料欄位名稱改名即視為達成隱私保護" },
      { id: "D", text: "僅以更大的模型取代隱私機制，模型越大隱私越好" },
    ],
    answer: "B",
    explanation:
      "差分隱私的核心是在查詢結果或訓練過程加入經校準的雜訊，使「某單一個體是否在資料集中」對輸出影響有限、難以辨識，並以隱私預算 ε 提供可量化的保證（B）。明文集中上傳反而增加風險（A）；僅改欄位名稱無實質防護（C）；模型大小與隱私保護無關（D）。屬機器學習治理的隱私保護。",
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q023",
    subjectId: "senior-ml",
    prompt:
      "關於 MLOps 中對模型與資料進行「版本控管與可追溯性」的目的，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "純粹為了佔用儲存空間，對治理沒有實質幫助" },
      { id: "B", text: "記錄訓練資料、程式、超參數與模型版本，使結果可重現、可稽核並利於問題回溯與回滾" },
      { id: "C", text: "版本控管只需保留最新一版，舊版本一律立即刪除" },
      { id: "D", text: "可追溯性會降低模型準確率，故治理上應避免" },
    ],
    answer: "B",
    explanation:
      "MLOps 對資料、程式、超參數與模型版本進行控管與追溯，目的是讓結果可重現、可稽核，並在發生問題時能回溯成因或回滾至穩定版本（B）。版本控管有明確治理價值而非僅佔空間（A）；保留歷史版本正是可追溯與回滾的前提，不應一律刪除（C）；可追溯性不會降低模型準確率（D）。屬機器學習治理的 MLOps。",
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ml-gen-q024",
    subjectId: "senior-ml",
    prompt:
      "為落實負責任 AI（Responsible AI），下列哪一項治理作為最符合「全生命週期、跨面向」的良好實務？",
    choices: [
      { id: "A", text: "只在模型上線前做一次性檢查，上線後即不再評估" },
      { id: "B", text: "僅追求最高準確率，公平性、隱私與可解釋性皆不納入考量" },
      { id: "C", text: "把治理責任全部交給單一工程師，毋須跨部門協作或留下文件" },
      { id: "D", text: "從資料蒐集、開發、部署到監控全程納入公平性、隱私、可解釋性與問責，並以文件與跨部門機制持續落實" },
    ],
    answer: "D",
    explanation:
      "負責任 AI 應在資料蒐集、開發、部署到上線後監控的全生命週期，跨面向地納入公平性、隱私、可解釋性與問責，並以文件化與跨部門治理機制持續落實（D）。只做一次性上線前檢查（A）忽略漂移與長期風險；僅追求準確率（B）犧牲其他面向；交給單一工程師且不留文件（C）缺乏問責與協作。屬機器學習治理的負責任 AI。",
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
  },
];
