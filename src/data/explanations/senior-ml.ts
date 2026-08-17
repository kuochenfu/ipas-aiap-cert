import type { QuestionExplanation } from "./types";

// questionId -> 手寫詳解與錯誤選項解析。
export const explanations: Record<string, QuestionExplanation> = {
  "senior-ml-114-2-q01": {
    explanation:
      "要評估模型對「未觀察資料」的適應力與泛化效果，最適合的是交叉驗證（Cross-Validation，B）：把資料分成多折輪流當訓練/驗證，估計模型在新資料上的穩定表現。F 檢定（A）比較變異數、配對 t 檢定（C）比較兩組平均差、卡方檢定（D）檢驗類別變數關聯，皆為統計假設檢定，並非評估模型泛化能力的方法（L233 評估與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q02": {
    explanation:
      "L1 正則化（Lasso）以絕對值懲罰項，會把不重要特徵的權重直接收斂為 0，產生稀疏模型並達成特徵選擇（C）。它不會增加參數量（A），不是用來穩定梯度（B）或提高學習率（D）——那些屬於最佳化與訓練設定，與 Lasso 的稀疏化效果無關（L233 正則化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-114-2-q03": {
    explanation:
      "非凸目標函數有多個極值點，梯度下降可能停在非全域的局部最優解（C），使最佳化結果不穩定。梯度消失（A）多與深層網路反向傳播有關、資料過少（B）與函數凸性無關、過擬合（D）是泛化問題；題目情境（多極值、最佳化不穩）最直接對應局部最優（L231 最佳化）。",
    topic: "L23103 數值優化技術與方法",
    choices: {},
  },
  "senior-ml-114-2-q04": {
    explanation:
      "DBSCAN 中，鄰域樣本數不足以成為核心點、又不在任何核心點鄰域內、也無密度可達關係的點，會被歸為雜訊點（Noise Point，B）。邊界點（C）需落在某核心點鄰域內；鄰近點（A）、潛在點（D）並非 DBSCAN 的標準類別（L232 非監督式學習）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-114-2-q05": {
    explanation:
      "CNN 第一層卷積層以卷積核掃描影像，自動提取邊緣、紋理等局部特徵（A）。降維加速（B）主要由池化層負責；增加容量（C）非卷積層本意；整合特徵並輸出分類（D）是末端全連接層的工作，故選 A（L232 CNN）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-114-2-q06": {
    explanation:
      "CNN 效率優於全連接網路的主因是區域感知（Local Receptive Field）與參數共享（Parameter Sharing），大幅降低參數量與運算複雜度（C）。旋轉/比例不變性（A）並非 CNN 內建保證、跳過特徵提取（B）描述不精確、CNN 並未捨棄激勵函數（D），故 C 最正確（L232 CNN）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-114-2-q07": {
    explanation:
      "預測未來七天電力需求屬時間序列趨勢預測，存在前後時間依賴，最適合 LSTM（A）。物件辨識（B）是 CNN 的強項、顧客分群（C）屬非監督聚類、高維壓縮成低維（D）屬降維/自編碼器，皆非 LSTM 處理序列依賴的典型情境（L232 RNN/LSTM）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-114-2-q08": {
    explanation:
      "資訊增益以熵的減少量衡量特徵分裂的純度提升，正是決策樹遞迴分裂、選擇分裂屬性的核心準則（D）。L1 線性模型（A）靠懲罰項選特徵、深度網路（B）靠激活函數、核方法（C）靠核映射，皆非以資訊增益作分裂依據，故選 D（L232 決策樹）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-114-2-q09": {
    explanation:
      "KNN、SVM 等以距離為基礎的模型對特徵尺度敏感，數值範圍大的特徵會主導距離計算，因此特徵縮放（Feature Scaling，A）最為關鍵。轉類別（B）、補缺值（C）、抽樣平衡（D）雖是常見前處理，但對距離型模型而言尺度一致才是最關鍵步驟（L233 特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-114-2-q10": {
    explanation:
      "AutoML 最能發揮價值的情境是團隊缺乏專職工程師與時間、又需快速比較多種模型——正是行銷部門要短時間比較多種流失預測模型的情況（C）。已有成熟 MLOps 與資深團隊（A）、長期穩定只需微調（B）、需精細手控特徵與演算法（D）都不是 AutoML 的最佳切入點（L233 AutoML）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-114-2-q11": {
    explanation:
      "Random Search 相較 Grid Search 的主要優勢是在高維超參數空間中更有效率：不必窮舉所有組合，隨機採樣即可較快觸及表現好的區域（D）。它不會自動產生模型架構（A）、與訓練集大小（B）無關、本身也不能直接避免過擬合（C），故選 D（L233 超參數調校）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-114-2-q12": {
    explanation:
      "收斂時快時慢、過快導致過擬合的問題，可透過調整學習率（Learning Rate，C）控制權重更新步幅來改善。神經元輸出（A）、梯度值（B）、訓練後權重（D）是模型運算結果或中間量，並非可直接設定來控制收斂行為的超參數，故選 C（L233 超參數調校）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-114-2-q13": {
    explanation:
      "標籤偏差（Label Bias）來自標記資料本身帶有主觀偏見，使標註標準系統性偏離真實（B）。資料量過大（A）、模型結構不當（C）、特徵過多（D）屬資料規模或模型/特徵層面的問題，與「標記主觀」造成的標籤偏差無直接因果，故選 B（L234 公平性/偏差）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-114-2-q14": {
    explanation:
      "醫院以 AI 判斷腫瘤惡性可能性作為臨床診斷依據（C），攸關生命且需醫師理解依據，可解釋性最為關鍵。購買時間預測（A）、廣告出價（B）、流失預測推薦（D）多屬行銷/營運用途，錯誤後果較低，對可解釋性的要求不如醫療診斷嚴格（L234 可解釋性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-114-2-q15": {
    explanation:
      "線性迴歸的 R²＝0.85 代表應變數約 85% 的變異可由模型解釋（B）。R² 不是分類準確率（A）、不等於預測誤差為 15%（C），也與信心水準（D）無關——後者是統計推論概念，故選 B（L233 評估指標）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q16": {
    explanation:
      "F1＝2×(Precision×Recall)/(Precision+Recall)＝2×(0.8×0.6)/(0.8+0.6)＝2×0.48/1.4＝0.96/1.4≈0.686（A）。其餘 0.700、0.720、0.750 皆非調和平均的計算結果，故選 A（L233 評估指標）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q17": {
    explanation:
      "判準在「內建」二字：動量是不是演算法定義的一部分，而不是可以關掉的選用參數。Adam 的更新式本身就含一階動量（梯度的指數移動平均 m_t，由 β₁ 控制），沒有任何設定可以把它拿掉，故為內建（B）。SGD（A）的定義裡沒有動量——PyTorch 的 torch.optim.SGD 以 momentum=0 為預設，要動量得自己傳參數；「SGD+Momentum」這個寫法本身就說明了它是外加的。同一條判準套到 C：RMSProp 的定義只有二階的梯度平方移動平均，torch.optim.RMSprop 雖然也提供 momentum 參數但預設同樣是 0，屬選用而非內建。套到 D：Adagrad 累積歷史梯度平方以縮放學習率，完全沒有動量項。四項中只有 B 的動量無法被關閉，故選 B（L233 最佳化器）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-114-2-q18": {
    explanation:
      "XGBoost 相較傳統 GBDT 的主要改進是在目標函數中加入正則化項抑制過擬合，並支援缺失值自動處理與特徵分裂的並行化訓練（A）。它仍是梯度提升樹、未改用隨機森林（B）或神經網路（C），批次正規化（D）屬深度學習技術，皆非 XGBoost 的核心改良，故選 A（L232 整體學習）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-114-2-q19": {
    explanation:
      "正樣本僅 3% 的極不平衡資料下，準確率（Accuracy，C）會被多數類主導而失真，是「最不適合」用來提升少數類預測能力的指標。SMOTE 過採樣（A）、調整類別權重（B）、欠採樣多數類（D）都是處理不平衡的合理作法，故選 C（L233 不平衡資料/評估指標）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q20": {
    explanation:
      "建立互動特徵（Interaction Features）最直接的方式是將兩個或多個特徵相乘或交互組合（C），以表達特徵間的聯合影響。取平方（A）只反映單一特徵的非線性、對數轉換（B）與標準化（D）是尺度/分布調整，皆無法捕捉跨特徵的交互效果，故選 C（L233 特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-114-2-q21": {
    explanation:
      "多頭注意力的主要優點是讓模型從不同的表示子空間（Representation Subspaces）同時捕捉多樣化的關聯資訊（C），如發音、語速、語意等多層次脈絡。它並非為了減少參數（A）、加速計算（B）或解決梯度消失（D），故選 C（L232 Transformer/Attention）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-114-2-q22": {
    explanation:
      "貝氏定理以條件機率推論，計算在觀察到行為特徵的情況下顧客屬於「會購買」或「不會購買」的後驗機率（B）。自動分群（A）屬聚類、最小平方誤差預測金額（C）屬迴歸、依回饋調整策略（D）屬強化學習，皆非貝氏條件機率分類的核心，故選 B（L231 機率統計）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-114-2-q23": {
    explanation:
      "以隨機抽樣模擬多種不確定情境、估算整體結果的機率分佈與風險區間，正是蒙地卡羅方法（Monte Carlo Method，A）。K-means（B）是聚類、SVR（C）是迴歸、特徵選取（D）是篩選變數，皆非以隨機模擬估算機率分佈的方法，故選 A（L231 機率統計/模擬）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-114-2-q24": {
    explanation:
      "殘差極大且在高價區呈系統性彎曲分佈，代表存在異常值或殘留的非線性關係，違反線性迴歸的線性與同質變異假設（C）。過擬合（A）、欠擬合（B）描述的是訓練/泛化表現，而殘差呈隨機分佈（D）才代表假設成立、與題述相反，故選 C（L233 迴歸診斷）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q25": {
    explanation:
      "傳統信用評分卡以邏輯迴歸為主，流程含分箱與 IV 檢定、共線性分析、PSI 穩定性檢驗等。使用生成式模型進行特徵學習（A）並非傳統評分卡的標準步驟，屬較新或不同範式的方法，故為「不是」的選項。B、C、D 皆為標準流程，故選 A（L233 建模流程）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-114-2-q26": {
    explanation:
      "擴增輸入特徵變數會提升模型表達能力、增加複雜度（D），與「降低複雜度以防過擬合」的目標相反，故為正確答案。L1/L2 正則化（A）、Dropout（B）、Early Stopping（C）都是限制學習能力、抑制過擬合的常見手段，故選 D（L233 正則化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-114-2-q27": {
    explanation:
      "線性激活函數會讓多層網路退化為線性組合、無法表達複雜特徵，改用 ReLU 引入非線性可大幅提升模型表達能力（D）。單純加深層數（A）若仍為線性激活仍無法解決、灰階化（B）只降運算量、Sigmoid（C）雖非線性但易梯度消失且非本題最佳，故選 D（L232 激活函數）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-114-2-q28": {
    explanation:
      "訓練樣本只取「購買三次以上」的活躍顧客，未涵蓋新註冊與低消費族群，導致對這些族群預測差，屬取樣偏差（Sampling Bias，C）。特徵偏差（A）、標籤偏差（B）、過擬合（D）皆非本題「樣本族群不具代表性」的核心成因，故選 C（L234 偏差/資料治理）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-114-2-q29": {
    explanation:
      "設備工況隨時間漂移，固定驗證集無法反映現況，最適合採用時間序列交叉驗證或滑動視窗驗證（D），依時間順序動態更新驗證資料以維持泛化。固定驗證集（A）、不用驗證集（B）、單純簡化模型（C）都無法因應資料隨時間演進的分布變化，故選 D（L233 驗證/時間序列）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q30": {
    explanation:
      "模型在英文表現佳、移至西班牙文 F1 驟降，最合理解釋是語言轉移使模型無法辨識關鍵情緒詞彙，召回率下降而拉低 F1（C）。改用 micro-F1（A）、稱其過擬合導致偏高（B）、改用 MSE（D）都無法合理解釋跨語言效能崩跌，故選 C（L233 評估指標/泛化）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q31": {
    explanation:
      "驗證損失在季節性與噪音下呈週期性波動時，正確的早停做法是監控驗證集損失並設定適度耐心值（Patience），連續多輪未改善才停止（B），以避免被短期波動誤導。依訓練損失停止（A）會過擬合、用測試集早停（C）會資料洩漏、合併全部資料訓練到收斂（D）失去驗證依據，故選 B（L233 早期停止）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-114-2-q32": {
    explanation:
      "希望在避免過擬合的同時自動篩選代表性特徵，最合適的是 L1 正則化（Lasso，D），其懲罰項會把部分特徵係數縮為 0，達成自動特徵選擇。Early Stopping（A）不選特徵、L2/Ridge（B、C）只縮小權重幅度卻保留全部特徵，無法做特徵篩選，故選 D（L233 正則化/特徵選擇）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-114-2-q33": {
    explanation:
      "逐一比對每位客戶與其他所有客戶，需 n×n 量級的兩兩組合運算，時間複雜度為 O(n²)，執行時間與資料量平方成正比（B）。O(n)（A）、O(1)（C）、O(log n）（D）皆無法描述兩兩配對的計算量，故選 B（L231 演算法複雜度）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-114-2-q34": {
    explanation:
      "資料僅 150 筆且陽性不到 8%，需同時兼顧資料利用率與各折類別比例一致，最適合分層留一法交叉驗證（Stratified LOOCV，D）：以留一最大化資料利用，並維持各折類別比例。一般 5-Fold（A）與一般 LOOCV（B）未分層、隨機交叉驗證（C）不保證比例，故選 D（L233 交叉驗證）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-114-2-q35": {
    explanation:
      "特徵值 λ1=6、λ2=3、λ3=1，總和為 10。前兩主成分解釋 (6+3)/10＝90%，已超過 80% 門檻，可安全降維至二維並保留大部分資訊（A）。B 僅取一維（60%）未達門檻、C 主張保留第三主成分不必要、D 稱特徵值相近與數據不符，故選 A（L231 線性代數/PCA）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-114-2-q36": {
    explanation:
      "同態加密的關鍵特性是資料在加密狀態下仍可直接進行數值運算，模型可在未解密的密文上完成訓練（D），無需暴露明文。以雜訊干擾輸出（A）是差分隱私、交換私鑰（B）描述錯誤、壓縮加密減量（C）非其本質，故選 D（L234 隱私保護）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
  "senior-ml-114-2-q37": {
    explanation:
      "需求是資料加密後絕不解密（同態加密）、加上保障傳輸完整性與機密性。官方答案為 B：同態加密＋非對稱加密＋單向雜湊＋對稱加密——以同態加密支援密文運算、非對稱加密交換金鑰、雜湊驗證未被竄改、對稱加密保護傳輸內容，組合最完整對應需求，故選 B（L234 隱私/資安）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
  "senior-ml-114-2-q38": {
    explanation:
      "由附圖程式碼計算的是均方誤差 MSE（B）：對預測與真值差取平方後求平均，未開根號（故非 RMSE，C）、非取絕對值（故非 MAE，A）、也非解釋變異比例的 R²（D），故選 B（L233 評估指標）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "附圖程式碼：",
        content: "def metric(y_true, y_pred):\n    return sum((y_true - y_pred) ** 2) / len(y_true)",
      },
    ],
  },
  "senior-ml-114-2-q39": {
    explanation:
      "附圖程式碼實現的是 Dropout（C）：訓練時隨機讓部分神經元輸出歸零以防過擬合。L1（A）、L2（B）為權重懲罰項、Batch Normalization（D）為批次正規化，皆與隨機丟棄神經元的機制不同，故選 C（L233 正則化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "附圖程式碼：",
        content: "def forward(x, p, training=True):\n    if training:\n        mask = np.random.binomial(1, p, size=x.shape)\n        return x * mask / p\n    else:\n        return x",
      },
    ],
  },
  "senior-ml-114-2-q40": {
    explanation:
      "np.dot(v1, v2) 對 v1=[1,2,3]、v2=[4,5,6] 計算內積＝1×4+2×5+3×6＝4+10+18＝32，結果為 np.int64(32)（C）。A 誤指 inv 為行列式（實為反矩陣）、B 的逐元素乘積應為 [4,10,18] 而非 [5,7,9]、D 誤指 eig 為反矩陣（實為特徵值/向量），故選 C（L231 線性代數）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "附圖程式碼：",
        content: "import numpy as np\n\nv1 = np.array([1, 2, 3])\nv2 = np.array([4, 5, 6])\nA = np.array([[1, 2], [3, 4]])",
      },
    ],
  },
  "senior-ml-114-2-q41": {
    explanation:
      "條件機率 P(A∣B)＝P(A∩B)/P(B)，在 Monte Carlo 計數下即同時為偶數且大於 3 的次數除以大於 3 的次數，對應 A_and_B.sum() / B.sum()（D）。除以 A.sum()（C）算成 P(B∣A)、除以乘積（A）或和（B）皆非條件機率定義，故選 D（L231 機率/條件機率）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "附圖程式碼：",
        content: "import numpy as np\n\nnp.random.seed(123)\nn = 100000\ndice_rolls = np.random.randint(1, 7, size=n)\n\nA = (dice_rolls % 2 == 0)\nB = (dice_rolls > 3)\nA_and_B = A & B\n\n# 事件 A：擲出偶數\n# 事件 B：擲出大於 3",
      },
    ],
  },
  "senior-ml-114-2-q42": {
    explanation:
      "VGG16 中參數量最多的是全連接層（Linear，B）：尤其第一個 FC 層輸入維度高達 512×7×7、輸出 4096，單層即上億參數，遠超卷積層總和。卷積層（A）參數因共享而相對少、ReLU（C）與池化層（D）無可訓練參數，故選 B（L232 深度學習/CNN）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "note",
        content: "VGG16 是由牛津大學 Visual Geometry Group(VGG) 在 2014 年提出的經典卷積神經網路（Convolutional Neural Network, CNN）架構。該模型以簡潔且規則的層堆疊設計聞名，廣泛應用於影像分類、特徵提取及遷移學習等任務。附圖程式碼載入了預訓練的 VGG16 模型，並輸出其完整層級結構及參數統計摘要（如附表）。請根據此資訊回答 42~45 題。",
      },
      {
        kind: "output",
        caption: "附圖程式碼與參數統計摘要（附表）：",
        content: "from torchsummary import summary\nfrom torchvision import models\nmodel = models.vgg16(weights='IMAGENET1K_V1')\nsummary(model, (3,150,150))\n\n----------------------------------------------------------------\n        Layer (type)          Output Shape         Param #\n================================================================\n            Conv2d-1    [-1, 64, 150, 150]           1,792\n              ReLU-2    [-1, 64, 150, 150]               0\n            Conv2d-3    [-1, 64, 150, 150]          36,928\n              ReLU-4    [-1, 64, 150, 150]               0\n         MaxPool2d-5      [-1, 64, 75, 75]               0\n            Conv2d-6     [-1, 128, 75, 75]          73,856\n              ReLU-7     [-1, 128, 75, 75]               0\n            Conv2d-8     [-1, 128, 75, 75]         147,584\n               ...（中略：其餘卷積、ReLU 與池化層）\n          Linear-33                [-1, 4096]     102,764,544\n               ...（中略：其餘全連接層）\n================================================================\nForward/backward pass size (MB): 96.93\nParams size (MB): 527.79\nEstimated Total Size (MB): 624.98\n----------------------------------------------------------------",
      },
    ],
  },
  "senior-ml-114-2-q43": {
    explanation:
      "VGG16 中運算量（FLOPs）最多的是卷積層（Conv2d，A）：高解析度特徵圖上反覆的卷積運算貢獻絕大多數乘加運算。全連接層（B）參數雖多但運算量相對少、ReLU（C）與池化層（D）運算量極小，故選 A（L232 深度學習/CNN）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "note",
        content: "VGG16 是由牛津大學 Visual Geometry Group(VGG) 在 2014 年提出的經典卷積神經網路（Convolutional Neural Network, CNN）架構。該模型以簡潔且規則的層堆疊設計聞名，廣泛應用於影像分類、特徵提取及遷移學習等任務。附圖程式碼載入了預訓練的 VGG16 模型，並輸出其完整層級結構及參數統計摘要（如附表）。請根據此資訊回答 42~45 題。",
      },
      {
        kind: "output",
        caption: "附圖程式碼與參數統計摘要（附表）：",
        content: "from torchsummary import summary\nfrom torchvision import models\nmodel = models.vgg16(weights='IMAGENET1K_V1')\nsummary(model, (3,150,150))\n\n----------------------------------------------------------------\n        Layer (type)          Output Shape         Param #\n================================================================\n            Conv2d-1    [-1, 64, 150, 150]           1,792\n              ReLU-2    [-1, 64, 150, 150]               0\n            Conv2d-3    [-1, 64, 150, 150]          36,928\n              ReLU-4    [-1, 64, 150, 150]               0\n         MaxPool2d-5      [-1, 64, 75, 75]               0\n            Conv2d-6     [-1, 128, 75, 75]          73,856\n              ReLU-7     [-1, 128, 75, 75]               0\n            Conv2d-8     [-1, 128, 75, 75]         147,584\n               ...（中略：其餘卷積、ReLU 與池化層）\n          Linear-33                [-1, 4096]     102,764,544\n               ...（中略：其餘全連接層）\n================================================================\nForward/backward pass size (MB): 96.93\nParams size (MB): 527.79\nEstimated Total Size (MB): 624.98\n----------------------------------------------------------------",
      },
    ],
  },
  "senior-ml-114-2-q44": {
    explanation:
      "VGG16 由 13 層卷積層與 3 層全連接層組成，總參數約 138,357,544（約 138.36M），D 正確。A 的第一個 FC 輸入應為 512×7×7＝25088 而非 512×4×4、B 誤稱參數未含 bias（實際含偏差）、C 誤把 Estimated Total Size 當成完整訓練所需含 optimizer/梯度的記憶體，皆有誤，故選 D（L232 CNN 架構）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "note",
        content: "VGG16 是由牛津大學 Visual Geometry Group(VGG) 在 2014 年提出的經典卷積神經網路（Convolutional Neural Network, CNN）架構。該模型以簡潔且規則的層堆疊設計聞名，廣泛應用於影像分類、特徵提取及遷移學習等任務。附圖程式碼載入了預訓練的 VGG16 模型，並輸出其完整層級結構及參數統計摘要（如附表）。請根據此資訊回答 42~45 題。",
      },
      {
        kind: "output",
        caption: "附圖程式碼與參數統計摘要（附表）：",
        content: "from torchsummary import summary\nfrom torchvision import models\nmodel = models.vgg16(weights='IMAGENET1K_V1')\nsummary(model, (3,150,150))\n\n----------------------------------------------------------------\n        Layer (type)          Output Shape         Param #\n================================================================\n            Conv2d-1    [-1, 64, 150, 150]           1,792\n              ReLU-2    [-1, 64, 150, 150]               0\n            Conv2d-3    [-1, 64, 150, 150]          36,928\n              ReLU-4    [-1, 64, 150, 150]               0\n         MaxPool2d-5      [-1, 64, 75, 75]               0\n            Conv2d-6     [-1, 128, 75, 75]          73,856\n              ReLU-7     [-1, 128, 75, 75]               0\n            Conv2d-8     [-1, 128, 75, 75]         147,584\n               ...（中略：其餘卷積、ReLU 與池化層）\n          Linear-33                [-1, 4096]     102,764,544\n               ...（中略：其餘全連接層）\n================================================================\nForward/backward pass size (MB): 96.93\nParams size (MB): 527.79\nEstimated Total Size (MB): 624.98\n----------------------------------------------------------------",
      },
    ],
  },
  "senior-ml-114-2-q45": {
    explanation:
      "判準是「凍結的範圍必須剛好等於卷積層，且新接的分類層要留著可訓練」。VGG16 在 torchvision 中分成 model.features（卷積層）與 model.classifier（全連接層）兩段，因此只把 model.features.parameters() 的 requires_grad 設為 False，再把 classifier[6] 換成新的輸出層，凍結範圍與需求完全吻合（B）。A 凍結 model.parameters()，把整個模型都關掉，但因為 classifier[6] 是在凍結之後才被換成新的 Linear，新層預設 requires_grad=True 仍可訓練——寫法雖能跑，凍結範圍卻涵蓋了不該凍的其餘 classifier 層，不是題目要的「只凍結卷積層」；C 凍結的是 model.classifier.parameters()，正好凍錯邊，卷積層反而全部可訓練；D 的 model.requires_grad = False 只是在 Module 物件上新增一個同名屬性，PyTorch 並不會據此凍結任何參數，等於完全沒有凍結（L232 遷移學習）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "note",
        content:
          "在實務應用中，我們常使用遷移學習（transfer learning）技巧，即載入預訓練模型（如 VGG16），凍結部分層的參數，只針對特定任務重新訓練最後幾層。假設你要對 VGG16 進行遷移學習，希望凍結卷積層的參數，只訓練最後全連接層（classifier）。下列哪段程式碼寫法正確？",
      },
    ],
    choiceFigures: {
      A: {
        kind: "code",
        content:
          "import torch\n" +
          "import torchvision.models as models\n" +
          "\n" +
          "model = models.vgg16(pretrained=True)\n" +
          "for param in model.parameters():\n" +
          "    param.requires_grad = False\n" +
          "model.classifier[6] = torch.nn.Linear(4096, 10)",
      },
      B: {
        kind: "code",
        content:
          "import torch\n" +
          "import torchvision.models as models\n" +
          "\n" +
          "model = models.vgg16(pretrained=True)\n" +
          "for param in model.features.parameters():\n" +
          "    param.requires_grad = False\n" +
          "model.classifier[6] = torch.nn.Linear(4096, 10)",
      },
      C: {
        kind: "code",
        content:
          "import torch\n" +
          "import torchvision.models as models\n" +
          "\n" +
          "model = models.vgg16(pretrained=True)\n" +
          "for param in model.classifier.parameters():\n" +
          "    param.requires_grad = False\n" +
          "model.classifier[6] = torch.nn.Linear(4096, 10)",
      },
      D: {
        kind: "code",
        content:
          "import torch\n" +
          "import torchvision.models as models\n" +
          "\n" +
          "model = models.vgg16(pretrained=True)\n" +
          "model.requires_grad = False\n" +
          "model.classifier[6] = torch.nn.Linear(4096, 10)",
      },
    },
  },
  "senior-ml-114-2-q46": {
    explanation:
      "本題要找出使 PCA 降噪失效、需修正的程式段，官方答案為 B。PCA 降噪的關鍵在保留的主成分數量（n_components）需設定得當——保留太多成分會把雜訊一併留下、達不到去噪效果，因此 B 段為應修改之處。其餘段落（A、C、D）為正確流程，故選 B（L232 PCA 降維/降噪）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-114-2-q47": {
    explanation:
      "本題要找出能正確以 KNN 搭配交叉驗證並輸出準確率的程式組合，官方答案為選項 B（其內容為「程式碼A、程式碼C」）。注意題目的四段程式碼以程式碼A/程式碼B/程式碼C/程式碼D 命名，與選項 A/B/C/D 字母相同、易混淆，以下一律以「程式碼X」指程式片段、以「選項X」指作答選項。能正確完成任務者為程式碼A 與程式碼C：兩者皆正確建立 KNN 分類器並正確呼叫 cross_val_score（或等效交叉驗證流程）後輸出準確率。程式碼B、程式碼D 則在資料切割或交叉驗證函數的使用上有誤，無法正確輸出準確率，故不納入。因此涵蓋「程式碼A、程式碼C」的選項 B 為正解（L233 交叉驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-114-2-q48": {
    explanation:
      "官方答案為選項 C，其內容為子敘述「A、D」。子敘述 A：X_train -= X_train.mean(axis=0) 將每個訓練集特徵的平均值調整為 0——標準化（standardization）以減去平均值達成，敘述正確。子敘述 D：標準化後各特徵尺度一致、數值範圍受控，有助於穩定輸入尺度、緩解梯度爆炸或消失，敘述正確。故選項 C（A、D）成立。其餘子敘述皆錯：子敘述 C 稱「將資料壓縮到 0 和 1 之間」，那是最小－最大正規化（min-max normalization）的效果，並非標準化；標準化是把資料轉為平均 0、標準差 1，數值可超出 0~1，故子敘述 C 為錯，不可採信。子敘述 B 將標準差「調整為」之敘述不完整／有誤；子敘述 E 稱標準化屬特徵選擇（Feature Selection）為錯，標準化屬特徵縮放；子敘述 F 把指令改寫為 X = X.std(axis=0) 會破壞標準化流程，亦錯。因此正解為涵蓋「A、D」的選項 C（L233 特徵縮放）。",
    topic: "L23304 模型調整與優化",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "參考下圖程式碼：",
        content: "X_train -= X_train.mean(axis=0)\nX_train /= X_train.std(axis=0)\nX_test  -= X_test.mean(axis=0)\nX_test  /= X_test.std(axis=0)",
      },
    ],
  },
  "senior-ml-114-2-q49": {
    explanation:
      "全連接層的參數量 =（輸入維度 × 輸出維度）+ 輸出維度（偏差）。由下往上推：dense_2 顯示 11，代表 10 × 1 + 1 = 11，確認前一層輸出為 10 個單元。dense_1 是 10 → 10，參數量 10 × 10 + 10 = 110，即空格 2。dense 的輸入為 X_train.shape[1]；由前面的資料處理可知 X_train = dataset_train[:, 0:9]，共 9 個特徵，故 9 × 10 + 10 = 100，即空格 1。空格 1 = 100、空格 2 = 110，選 C。B 把兩個數字對調；A 寫的 f(x) = 1/(1+e⁻ˣ) 是 sigmoid 的數學式，ReLU 為 f(x) = max(0, x)；D 說 sigmoid 一般用於多類別分類，實際上 sigmoid 輸出單一機率、用於二元分類（本模型最後一層正是 Dense(1, sigmoid) 搭配 binary_crossentropy），多類別才用 softmax（L232 類神經網路架構）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "output",
        caption: "參考下圖程式碼與執行結果（Param # 欄的空格 1、空格 2 為待填處）：",
        content: "model = Sequential()\nmodel.add(Input(shape=(X_train.shape[1],)))\nmodel.add(Dense(10, activation=\"relu\"))\nmodel.add(Dense(10, activation=\"relu\"))\nmodel.add(Dense(1, activation=\"sigmoid\"))\nmodel.summary()\nmodel.compile(loss=\"binary_crossentropy\", optimizer=\"adam\", metrics=[\"accuracy\"])\n\nModel: \"sequential\"\n-----------------------------------------------------------\nLayer (type)          Output Shape           Param #\n-----------------------------------------------------------\ndense (Dense)         (None, 10)             空格1\ndense_1 (Dense)       (None, 10)             空格2\ndense_2 (Dense)       (None, 1)                  11\n-----------------------------------------------------------",
      },
      {
        kind: "note",
        content:
          "前段資料處理（同卷第 48 題）中，X_train = dataset_train[:, 0:9]，故輸入層維度 X_train.shape[1] = 9。",
      },
    ],
    // 選項 (A) 的數學式在原卷是圖片，pdftotext 只擷取到「activation=\"relu\"其數學式為 」
    // 就斷了；補上完整內容，否則這個選項無從判斷對錯。
    choiceFigures: {
      A: {
        kind: "code",
        content: "activation=\"relu\" 其數學式為  f(x) = 1 / (1 + e⁻ˣ)",
      },
    },
  },
  "senior-ml-114-2-q50": {
    explanation:
      "先讀圖例：Training Loss 是藍色實線、Validation Loss 是紅色虛線。matplotlib 的樣式字串中，\"b-\" 為藍色實線、\"b--\" 為藍色虛線、\"r-\" 為紅色實線、\"r--\" 為紅色虛線。空格 1 對應 loss（Training Loss），須填 \"b-\"，即敘述 A；空格 2 對應 val_loss（Validation Loss），須填 \"r--\"，即敘述 D。成立的是 A、D，故選 C。敘述 B 說空格 2 填 \"b--\"，顏色錯（驗證曲線是紅色）；敘述 C 說空格 1 填 \"r-\"，顏色同樣錯（訓練曲線是藍色）；敘述 E 說驗證損失減少更明顯，但圖中紅色虛線在約 0.46 就走平並全程位於藍線上方，藍線則持續降到 0.40，訓練損失才是下降較多的一條。含 B 的選項 A（B、C）、含 C 的選項 B（A、C、D）與選項 D（C、D、E）因此皆不成立（L233 訓練曲線視覺化）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
    figures: [
      {
        kind: "chart",
        caption: "參考下圖程式碼與繪圖結果（空格 1、空格 2 為 plt.plot 的樣式字串）：",
        content: "程式碼：\n  loss = history.history[\"loss\"]\n  epochs = range(1, len(loss)+1)\n  val_loss = history.history[\"val_loss\"]\n  plt.plot(epochs, loss, 空格1, label=\"Training Loss\")\n  plt.plot(epochs, val_loss, 空格2, label=\"Validation Loss\")\n  plt.title(\"Training and Validation Loss\")\n  plt.xlabel(\"Epochs\"); plt.ylabel(\"Loss\"); plt.legend(); plt.show()\n\n繪圖結果：標題「Training and Validation Loss」，橫軸 Epochs 0~100、縱軸 Loss 0.40~0.65。圖例顯示 Training Loss 為「藍色實線」、Validation Loss 為「紅色虛線」。藍色實線自 0.65 陡降，約 20 個 epoch 後緩慢下滑，最終收在約 0.40；紅色虛線自 0.62 降至約 0.46 後即持平並上下抖動，全程位於藍線上方，最終約 0.46。",
      },
    ],
  },

  // ── 115 年第一次（115-1）─────────────────────────────────────────────
  "senior-ml-115-1-q01": {
    explanation:
      "判準是「解析解求不出來，改用大量隨機抽樣去逼近數值結果」。蒙地卡羅方法（C）正是為此而生：產生大量隨機市場情境、由模擬結果的分布估計風險值。馬可夫鏈（A）描述的是狀態如何依轉移機率演變，本題並未定義狀態與轉移；梯度下降（B）是最佳化參數的迭代法，本題不在找極值；貝氏推論（D）是用資料更新先驗得到後驗，本題沒有先驗分布也沒有參數更新（L231 數值優化與模擬）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-115-1-q02": {
    explanation:
      "判準是「誤差放大的方式」：要讓極端高價物件的大誤差產生更大懲罰與梯度，就要選懲罰隨誤差平方成長的損失。MSE（C）對誤差取平方，誤差越大梯度越大，正合需求。MAE（A）是線性懲罰、梯度大小近似固定，反而刻意壓低離群值影響；Huber（B）在大誤差處由平方轉為線性，設計目的同樣是「降低」離群值影響，與題目要求相反；交叉熵（D）衡量的是機率分布差異，用於分類，房價是連續值迴歸（L233 損失函數選擇）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-115-1-q03": {
    explanation:
      "矩陣相乘 (m, n) × (n, p) = (m, p)，且內側維度必須相等。此處 Q 為 (1, 10)、WQ 為 (10, 64)，內側 10 = 10 相容，輸出為 (1, 64)（A）。(10, 10)（B）會是 WQ × Qᵀ 之類的其他組合；(64, 1)（C）是正解的轉置，順序寫反；(D) 稱不相容，但內側維度確實相等，故可相乘（L231 線性代數應用）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-115-1-q04": {
    explanation:
      "判準是「水平翻轉後，樣本的正確標籤是否改變」。手寫數字（C）中 2 與 5、6 與 9 等字形具方向性，鏡射後圖形不再是原本那個數字，卻仍掛著原標籤，等於餵給模型錯誤的標籤。貓狗（A）翻轉後仍是同一種動物；車型（B）翻轉後仍是同一車型；行人偵測（D）翻轉後仍是行人，僅框的座標需一併鏡射。三者的類別標籤都不因鏡射而改變，故只有 C 會產生語意錯誤（L233 資料擴增）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-115-1-q05": {
    explanation:
      "殘差圖呈現「隨預測值增大而擴散」的喇叭形，指的是殘差的離散程度隨 X 改變，即變異數不齊一（異質變異，C）。殘差之間存在關聯（A）是自我相關，典型徵兆是殘差隨順序呈現週期或趨勢，而非扇形擴散；特徵高度相關（B）是共線性，看的是 VIF 或係數不穩，不會直接顯示在殘差對預測值的散布上；殘差非常態（D）要用 Q-Q 圖或直方圖判斷，與擴散形狀無關（L231 迴歸診斷）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-115-1-q06": {
    explanation:
      "判準是「保留局部鄰域還是全局結構，以及能否對新資料轉換」。t-SNE 保留的是局部鄰域關係、刻意犧牲全局距離，且不提供對新樣本的投影函數，因此適合視覺化、不適合當下游模型的輸入特徵（B）。A 把 t-SNE 說成保留全局線性結構並適合當 XGBoost 前處理，兩點都反了；C 說 PCA 是非線性方法，但 PCA 是線性投影，保留不了複雜流形；D 說兩者皆可對新資料線性外推，但 t-SNE 沒有可套用到新點的轉換（L231 資料降維）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-115-1-q07": {
    explanation:
      "判準是「哪一種機制會在高度相關的特徵之間隨機挑一個留下」。L1（Lasso）的絕對值懲罰會把係數壓到 0，遇到幾乎等價的相關特徵時，保留哪一個取決於初始化與資料細微擾動，於是每次重訓的特徵清單就會在三者之間跳動（B）。L2（A）是把係數一起縮小、且會在相關特徵間平均分攤權重，結果反而穩定，不會造成清單跳動；未正則化（C）確實可能過擬合，但共線性下 OLS 的係數是不穩定而非「特徵被選進選出」，題目描述的是清單成員變動；D 說梯度消失，那是深層網路反向傳播的問題，與線性模型的特徵數量無關（L233 正則化與特徵選擇）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-115-1-q08": {
    explanation:
      "題目問的是「學習率過大最直接造成什麼」。步伐過大時參數會在最低點兩側來回跳越、跨過谷底，表現為損失震盪甚至發散（B）。梯度消失（A）源自深層網路反覆連乘小於 1 的導數，是網路深度與激活函數的問題，調高學習率不會造成它；過擬合（C）是泛化問題，對應的是驗證損失上升那一段現象，而非調高學習率後的訓練損失震盪；死亡 ReLU（D）雖可能被過大的更新誘發，但那是神經元輸出永久為零的次生後果，不是題目所問的最直接現象（L233 學習率調校）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-115-1-q09": {
    explanation:
      "Adam 的兩項核心設計是一階動量與二階動量估計：前者讓更新方向平滑、抑制震盪，後者依各參數的梯度歷史自適應調整步長（A）。B 說強制所有參數用相同學習率，正好是 Adam 要擺脫的做法；C 的批次正規化是網路層的設計，不屬於優化器；D 的梯度裁剪是另一種獨立技巧，Adam 並未內建（L233 最佳化器）。",
    topic: "L23103 數值優化技術與方法",
    choices: {},
  },
  "senior-ml-115-1-q10": {
    explanation:
      "判準是「輸出是連續值還是類別機率」。使用時長是連續值，屬迴歸，用 MSE；是否流失是二元類別，用二元交叉熵（A）。B 把兩者對調，交叉熵無法直接衡量分鐘數的偏差；C 的 Hinge 損失用於 SVM 式的分類邊界、不適合迴歸，MAE 又是迴歸損失卻被派給分類；D 主張兩者都用交叉熵，但迴歸目標不是機率分布，交叉熵無從定義（L233 損失函數選擇）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-115-1-q11": {
    explanation:
      "題目要同時滿足「梯度穩定」與「GPU 吞吐量高」。小批次梯度下降（D）以數百至數千的批次量取得夠穩定的梯度估計，同時讓 GPU 平行運算吃滿，正是深度學習的標準做法。全批次（A）梯度最穩但每次更新 45 秒，吞吐量不足；SGD（B）速度快但梯度雜訊大、曲線震盪，穩定性不足；牛頓法（C）需計算與反轉 Hessian，在大型語言模型的參數規模下記憶體與運算成本不可行（L233 批次大小與訓練效率）。",
    topic: "L23103 數值優化技術與方法",
    choices: {},
  },
  "senior-ml-115-1-q12": {
    explanation:
      "在正常佔 99% 的資料上，一個全部預測為正常的模型也能得到 99% 準確率，卻一個肺癌病例都抓不到。因此 Accuracy 的缺陷在於它被多數類別主導，無法反映模型對少數陽性類別的偵測能力（A），這正對應醫師擔心的漏診風險。B 說 Accuracy 不包含邊界樣本，但它計算的是全部樣本、並無此排除；C 說它無法處理多分類，但 Accuracy 在多分類同樣可算；D 談收斂速度，那與評估指標的功能無關（L233 評估指標與類別不平衡）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-115-1-q13": {
    explanation:
      "題目限定「從降低模型複雜度的角度」緩解過擬合。L2 權重衰減（C）在損失中懲罰參數大小，直接限制模型的有效複雜度，是唯一符合限定角度的選項。增加 Epoch 至 200（A）讓模型更徹底記住訓練資料，會加劇過擬合；引入 URL、HTML 標籤等原始特徵（B）增加的是雜訊與複雜度，方向相反；把驗證集併入訓練集（D）只是增加樣本並失去監控過擬合的依據，並未降低模型複雜度（L233 正則化）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-115-1-q14": {
    explanation:
      "樸素貝氏是依訓練資料估計各詞的類別條件機率 P(詞|類別)。促銷關鍵字在訓練集中多半出現於垃圾郵件，於是其條件機率偏向垃圾類，正常促銷信才被誤判；對策是重新平衡資料分布或調整先驗機率（C）。A 主張棄用演算法，但問題出在資料分布而非演算法本身；B 說是過擬合並要增加 Epoch，然而樸素貝氏是以計數估計機率、沒有 Epoch 這個訓練參數；D 說要特徵標準化，但樸素貝氏處理的是詞頻與機率、不依賴特徵尺度（L232 常見機器學習演算法）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-115-1-q15": {
    explanation:
      "題目給了三個症狀：半月形（非凸）群集、離群值、每次執行結果不同，要選最完整且準確的敘述。D 同時指出需預設 K、以歐氏距離為基礎故難處理非凸群集、對初始化與離群值敏感，三個症狀全數對應。A 說維度超過 10 就失效，並無此門檻；B 說 K-means 假設高斯分布，那是 GMM 的假設，且「無法處理任何非球形群集」過於絕對；C 說初始化不影響結果且保證全局最優，與題目觀察到的每次結果不同直接矛盾（L232 非監督式學習）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-115-1-q16": {
    explanation:
      "XGBoost 相對於傳統 GBDT 的關鍵差異，就在目標函數中明確加入樹的複雜度懲罰項：以葉節點數量與葉節點權重的 L2 範數構成正則項，訓練時直接在分裂增益中扣除（A）。B 的動態學習率衰減是訓練排程技巧，不在目標函數內；C 的卷積屬於神經網路運算，樹模型不使用；D 說強制深度為 1，那是 AdaBoost 常見的決策樹樁設定，XGBoost 的 max_depth 可自由設定（L232 常見機器學習演算法）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-115-1-q17": {
    explanation:
      "關鍵徵兆是「加深之後訓練損失反而更高」——連訓練集都學不好，屬於最佳化困難而非泛化問題，典型成因是深層網路的梯度消失使淺層權重難以更新，對策是引入殘差連接讓梯度跨層直達（B）。A 要減少濾波器數量，那是針對過擬合或參數量，但本題訓練損失就已偏高，降低容量只會更糟；C 要再加深，會讓同一個梯度傳遞問題更嚴重；D 要把 ReLU 換成 Sigmoid，但 Sigmoid 的導數上限僅 0.25，連乘後衰減更快，正是造成梯度消失的元凶（L232 深度學習原理與框架）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-115-1-q18": {
    explanation:
      "題目情境是卷積層直接接全連結層導致參數量爆增，加入池化層要解決的正是這件事：池化把特徵圖的長寬縮小，攤平後進入全連結層的維度隨之下降，參數與計算量一併減少（A）。B 說提供非線性，但非線性由激活函數負責，最大池化雖非線性卻不是它的設計目的；C 說改善梯度消失，那是殘差連接或正規化層的作用；D 說不影響特徵維度，與池化必然縮減空間維度的事實矛盾（L232 深度學習原理與框架）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-115-1-q19": {
    explanation:
      "痛點是「首頁與第 20 頁的跨段落關聯」與「訓練時間隨長度增加」。Self-Attention 讓任意兩個 token 直接建立關聯，路徑長度為常數不隨距離衰減，且整個序列可平行計算而非像 LSTM 逐步遞迴（D），兩個痛點同時解決。A 說 Transformer 參數量比 LSTM 少，實際上通常更多；B 說位置編碼使模型天生理解章節結構，位置編碼只提供順序資訊，並不理解章節語意，也不是跨段落關聯改善的主因；C 說 LSTM 無法處理超過 512 token，那是 BERT 這類模型的輸入長度設定，不是 LSTM 的架構限制（L232 深度學習原理與框架）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-115-1-q20": {
    explanation:
      "PyTorch 的 CrossEntropyLoss 內部已含 LogSoftmax，因此輸出層必須交出未正規化的 logits，維度等於類別數 3（C）。D 再接一次 Softmax 會造成重複正規化，使梯度失真；A 用 ReLU 且輸出維度 1，既無法表示三類別也會截斷負值 logits；B 用 Sigmoid 讓三類別各自獨立輸出機率，那是多標籤設定，與本題單標籤三分類的假設不符（L233 模型架構設計）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-115-1-q21": {
    explanation:
      "把 32-bit 浮點權重換成 8-bit 整數表示，是以較低數值精度存放與運算，稱為模型量化（D），且題目明示不重新訓練，對應的是訓練後量化。知識蒸餾（A）需另外訓練一個小的學生模型；權重剪枝（B）是移除接近零的連結或通道以減少參數量，動的是「有幾個權重」而非「每個權重佔幾位元」；張量分解（C）把大權重矩陣拆成低秩因子相乘，改變的是矩陣結構（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-115-1-q22": {
    explanation:
      "問題被定位在「向量搜尋的語意匹配不準」，直接的補強方式是別只靠語意向量：混合搜尋以 BM25 關鍵字檢索補上專有名詞與精確字面匹配，再用 RRF 融合兩份排序（C）。縮小切片（A）改變的是切片粒度，語意匹配不準時未必改善，還可能切碎上下文；調高相似度閾值（B）只是把低分結果濾掉，若排序本身就錯，濾掉之後仍取不到正確段落；隨機洗牌（D）處理的是 LLM 對上下文位置的偏誤，發生在檢索之後，且會破壞既有排序（L232 檢索增強生成）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-115-1-q23": {
    explanation:
      "判準是「架構是否支援由左至右逐步生成」。BERT 是僅編碼器架構，以雙向遮罩語言模型預訓練，設計上是理解與表徵而非自迴歸生成；GPT-2 是解碼器架構，天生逐字接續前文，因此生成條款的效果較佳（D）。A 說缺乏法律領域知識，但題目已說微調且增加資料仍無改善，顯示瓶頸不在知識量；B 說分詞方式影響，兩者都用子詞分詞，並非主要差異；C 說模型規模較小，BERT 與 GPT-2 的規模量級相當，差異在架構而非大小（L232 深度學習原理與框架）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-115-1-q24": {
    explanation:
      "One-Hot 編碼會為每個類別開一個欄位，3,000 種商品即新增約 3,000 個稀疏維度，這正是維度爆炸（D）。標籤編碼（B）只用一個整數欄位，維度不變（但會引入虛假的大小順序）；目標編碼（A）以該類別的目標平均值取代，同樣只佔一欄；Embedding（C）刻意把高基數類別壓進固定的低維稠密向量，是為了避免維度爆炸而設計的做法（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-115-1-q25": {
    explanation:
      "Log 轉換的用途是壓縮右偏長尾、把乘法關係轉為加法關係。距捷運距離嚴重右偏，轉換後與房價的關係更接近線性，故有效；屋齡若原本就與房價近似線性，取對數反而把這條直線扭成曲線，破壞既有結構（A）。B 說會壓縮所有特徵的變異數導致失去鑑別能力，但轉換只作用於被套用的那個欄位，且距離特徵轉換後表現是變好的；C 說不適用於有單位的連續變數，並無此限制，Box-Cox 只是更一般化的族；D 說兩特徵須套用相同轉換，樹模型與線性模型都容許各特徵採用不同轉換（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-115-1-q26": {
    explanation:
      "滑動窗口把 t-1、t-2、…、t-k 的觀測值排成同一列的多個欄位，讓模型能以過去值預測當前值，本質上就是建立滯後特徵（D）。資料增強（A）是製造新樣本，滑動窗口只是重組既有觀測；去除雜訊（B）是移動平均等平滑手法的目的，滑動窗口保留原值不做平均；降低維度（C）方向相反，它是把一維序列展開成多個欄位，維度反而增加（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-115-1-q27": {
    explanation:
      "要讓每次訓練都基於最新時間區間、且驗證時不得看到未來資料，應採滾動窗口驗證（時間序列切分，C）：訓練窗往前推移，測試集永遠落在訓練期之後。K-fold（A）與分層 K-fold（B）都會隨機打散順序，使模型用未來資料預測過去，造成時間洩漏；留一驗證（D）同樣不保證時間先後，且在數十週的資料上要訓練上百次，成本與洩漏問題兼具（L233 模型訓練、評估與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-115-1-q28": {
    explanation:
      "需求有兩項：能建模非線性，且能提供整體特徵重要性供稽核。隨機森林迴歸（B）兩項皆備，樹的集成天然捕捉非線性與交互作用，並可輸出特徵重要性。羅吉斯迴歸（A）是分類模型、輸出機率，用於預測連續成交價本身就不對，且為線性；SVR（D）雖能以核函數處理非線性，但支持向量只指出哪些樣本落在邊界上，不構成可稽核的特徵重要性；先 K-means 分群再分別建模（C）增加了流程複雜度，分群標籤並不提供特徵層級的重要性排序（L233 模型選擇與架構設計）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
  },
  "senior-ml-115-1-q29": {
    explanation:
      "判準是「有沒有故障類別的標註」。題目明說只有大量正常資料、沒有任何已確認故障樣本，因此只能從正常樣態建模、把偏離者視為異常，屬非監督或半監督異常偵測（B）。監督式二元分類（A）需要兩類標籤，缺少故障樣本無法訓練；強化學習（C）需要環境互動與獎勵訊號，監測任務中不存在；自監督學習（D）是從資料自造前置任務學表徵的訓練方式，可作為輔助手段，但它描述的是預訓練策略而非本題的任務範疇（L232 機器學習原理與技術）。",
    topic: "L23201 機器學習原理與技術",
    choices: {},
  },
  "senior-ml-115-1-q30": {
    explanation:
      "三個症狀——訓練 AUC 遠高於驗證、少數類預測波動大、不同 K-fold 切分結果差異明顯——共同指向模型對訓練資料的隨機細節過度敏感，即高變異（B）。高偏差（A）的表現是訓練與驗證表現同時偏低且接近，與訓練 AUC 0.97 不符；過擬合（C）確實是同一現象的另一種說法，但題目問的是偏差—變異分解下的「問題」歸類，且過擬合無法單獨解釋「不同切分結果差異大」這項對抽樣的敏感度；資料漂移（D）指的是上線後資料分布隨時間改變，本題全部觀察都發生在訓練與交叉驗證階段，尚未涉及時間推移（L233 模型訓練、評估與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-115-1-q31": {
    explanation:
      "獎勵給的是「單次抓取」，代理人便找到反覆放開再抓的捷徑來刷分——獎勵訊號與真正的任務目標不一致，修正方式是重新塑形獎勵，改以「完成一次揀貨任務」計分（A）。策略退化（B）指的是訓練後期表現反而下降，本題策略其實穩定地在最大化它被告知的目標；信用分配（C）處理的是延遲獎勵該歸功於哪一步，本題獎勵是即時給的、歸屬明確；災難性遺忘（D）是學了新任務後忘掉舊任務，本題並無多任務或分階段訓練（L232 機器學習原理與技術）。",
    topic: "L23201 機器學習原理與技術",
    choices: {},
  },
  "senior-ml-115-1-q32": {
    explanation:
      "F1 = 2 × (Precision × Recall) / (Precision + Recall) 是調和平均，其性質是被較小的那一項拉低，因此只有兩者都高才會高，正好反映題目要求「兩者都不能犧牲」（D）。A 寫成算術平均，那會讓 Precision 0.99、Recall 0.01 得到 0.5 的高分，無法暴露單邊崩潰；B 說是 Precision 的加權平均，公式錯誤且忽略 Recall 的對稱地位；C 說僅適用於類別平衡資料，恰恰相反，F1 正是為類別不平衡而常用的指標（L233 評估指標）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-115-1-q33": {
    explanation:
      "兩項要求：控制過擬合，且不讓任何係數歸零以保留全部特徵的解釋能力。Ridge（L2，B）以平方懲罰把係數一起縮小但不歸零，且在共線性下能穩定係數估計，兩項皆滿足。Lasso（A）的絕對值懲罰會把部分係數壓成 0，直接違反「不歸零」的要求；Elastic Net（C）含 L1 成分，部分係數仍可能被壓為 0，同樣違反；無正則化的 OLS（D）不控制過擬合，且在 150 個高度相關特徵下係數估計極不穩定（L233 正則化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-115-1-q34": {
    explanation:
      "網格搜尋會窮舉所有超參數組合，組合數為各候選值個數相乘：3 × 4 × 5 × 3 × 3 = 540；每組再做 5 折交叉驗證，各折都要訓練一次模型，故 540 × 5 = 2,700（D）。A 把相乘寫成相加，那是各參數的候選值總數而非組合數；B 的 5 × 5 與題目給的候選數無關；C 取各參數候選數的最大值再乘 5，同樣不是笛卡兒積的算法（L233 超參數調校）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-115-1-q35": {
    explanation:
      "限制是顯存已接近上限，目標是提升表現。把 rank 調低但套用到更多層（D），可讓可訓練參數總量維持不變、記憶體用量不明顯增加，同時讓調整分散到更多層而非集中於少數層，通常更有效。提高 rank（A）與完整微調（B）都會直接推高顯存，違反限制；降低 rank 以換取更大 Batch Size（C）雖省記憶體，但表達能力下降，加大批次也不解決內容遺漏的問題（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-115-1-q36": {
    explanation:
      "需求有兩個限定：不解密，且由「單一」雲端服務商直接對加密資料運算。同態加密（B）允許在密文上直接做運算、結果解密後等同於對明文運算，正好符合。聯邦學習（A）是把模型送到各方本地訓練、不集中原始資料，但本題資料確實要上傳給服務商；差分隱私（C）是在輸出或資料中加入雜訊以限制個體可識別性，資料本身仍是明文；安全多方計算（D）需要多方共同持有分片並互動計算，與「單一服務商」的限定矛盾（L234 數據隱私、安全與合規）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
  "senior-ml-115-1-q37": {
    explanation:
      "監管要求的是「每筆被拒絕的申請」都要有原因，即針對單一預測的局部可解釋性。SHAP（A）依 Shapley 值計算每個特徵對該筆預測的貢獻量，正是局部解釋。全域特徵重要性（B）描述的是整體平均影響，選項自身也指出無法解釋單一個案；Grad-CAM（C）確實是局部解釋，但它以熱力圖標示影像的重要區域，適用於影像模型，貸款審核的輸入是表格特徵；混淆矩陣（D）呈現整體分類表現的統計，與個案原因無關（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-115-1-q38": {
    explanation:
      "統計均等的定義是：不同群體獲得正向決策的比例應相等。男性 55%、女性 30% 差距明顯，故不符合（C）。A 說未使用性別特徵所以符合，但統計均等看的是決策結果的比例，不是輸入欄位，其他特徵仍可能與性別高度相關；B 說兩群都有部分錄取即符合，那是把「非零」誤當成「相等」；D 說是因為女性的預測準確率較低，準確率差異對應的是另一個公平性定義（如均等勝算），不是統計均等的判準（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-115-1-q39": {
    explanation:
      "限制是「推論階段不得使用性別欄位」，因此去偏必須發生在訓練期間。訓練中（In-processing）作法在損失函數加入公平性懲罰項（A），訓練時可使用性別作為監督訊號，模型上線後只吃原有特徵，符合限制。C 的後處理依性別分組調整決策門檻，推論時必須讀取性別，直接違反限制；B 的前處理重新採樣本身是可行的手法，但選項自身把它敘述為「無法直接修正既有模型在推論階段的偏誤」，並非本題要選的可執行去偏策略；D 改用人口統計均等指標，換指標並不會讓錯誤拒絕比例的差異自動消失，且該指標衡量的是正向決策率而非錯誤拒絕率（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-115-1-q40": {
    explanation:
      "兩個空格由「單標籤多類別」與「標籤已轉 One-Hot」兩項條件決定：輸出層要在 10 個類別上給出總和為 1 的機率分布，用 softmax；標籤既已是 One-Hot 向量，損失函數用 categorical_crossentropy（B）。A 的 sigmoid 讓 10 個類別各自獨立輸出、機率不互斥，mean_squared_error 又是迴歸損失；C 的 relu 會輸出無上界的非負值、無法解釋為機率，binary_crossentropy 對應二元或多標籤；D 的 tanh 輸出落在 -1 到 1、不能當機率，且 sparse_categorical_crossentropy 要求標籤是整數索引，與題目已做 One-Hot 的前提矛盾（L233 模型架構設計）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "下圖中的程式碼中(A)與(B)的函數應填入何者？",
        content:
          "from tensorflow.keras import Sequential\n" +
          "from tensorflow.keras.layers import Dense\n" +
          "\n" +
          "model = Sequential([\n" +
          "    Dense(64, activation='relu', input_shape=(784,)),\n" +
          "    Dense(10, activation='___(A)___')\n" +
          "])\n" +
          "model.compile(loss='___(B)___', optimizer='adam')",
      },
    ],
  },
  "senior-ml-115-1-q41": {
    explanation:
      "錯誤集中在「b/d/p/q」這組互為鏡像的字母，這正是水平翻轉的後果：RandomHorizontalFlip(p=0.5) 有一半機率把 b 翻成 d、p 翻成 q，圖形已變成另一個字母卻仍掛原標籤，模型因此學到錯誤對應（B）。而訓練與驗證資料都經過同一組變換，驗證損失自然照樣下降，直到部署遇上未翻轉的真實影像才暴露。A 的 RandomRotation(15) 只是輕微旋轉，不會使 b 變成 d；C 的 ColorJitter 改變亮度，對字形方向無影響；D 說 ToTensor() 要放在幾何變換之前，實際上 torchvision 的幾何變換作用於 PIL 影像，ToTensor() 本就應放在最後，且它與方向性錯誤無關（L233 資料擴增）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "下圖程式進行資料增強（Transform）。",
        content:
          "import torchvision.transforms as transforms\n" +
          "\n" +
          "transform = transforms.Compose([\n" +
          "    transforms.RandomHorizontalFlip(p=0.5),\n" +
          "    transforms.RandomRotation(15),\n" +
          "    transforms.ColorJitter(brightness=0.3),\n" +
          "    transforms.ToTensor(),\n" +
          "])",
      },
    ],
  },
  "senior-ml-115-1-q42": {
    explanation:
      "行(A) 的 param.requires_grad = False 把預訓練骨幹的所有權重凍結，只留下後面新接的 model.fc 可訓練，等於把 ResNet 當成固定的特徵抽取器，這正是特徵萃取（C）。全面微調（A）是讓骨幹權重一起更新，與凍結相反；零樣本學習（B）不做任何訓練、直接以預訓練模型推論，但本程式建立了優化器要訓練 fc 層；知識蒸餾（D）需要教師與學生兩個模型並以教師輸出為監督訊號，程式中只有一個模型（L233 模型選擇與架構設計）。",
    topic: "L23302 模型選擇與架構設計",
    choices: {},
    figures: [
      {
        kind: "note",
        content: "下圖為使用 ResNet 進行遷移學習（Transfer Learning）的 Python 程式片段。請回答第 42~43 題。",
      },
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "import torchvision\n" +
          "\n" +
          "model = torchvision.models.resnet50(pretrained=True)\n" +
          "for param in model.parameters():\n" +
          "    param.requires_grad = False   # 行(A)\n" +
          "\n" +
          "model.fc = nn.Linear(2048, 2)\n" +
          "optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-4)",
      },
    ],
  },
  "senior-ml-115-1-q43": {
    explanation:
      "微調的前提是預訓練權重已經落在一個不錯的位置，訓練只要小幅修正即可。學習率若過大，第一批次的更新就會把這些學好的特徵表示衝散（俗稱災難性遺忘），因此刻意設得很小（D）。A 說是避免記憶體耗盡，OOM 取決於批次大小與模型尺寸，與學習率無關；B 說為了加速收斂，小學習率反而讓收斂變慢，是以速度換穩定；C 說為了讓損失強制歸零，損失不會也不該被逼到零，那是過擬合的徵兆（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
    figures: [
      {
        kind: "note",
        content: "承第 42 題，同一段 ResNet 遷移學習程式（見第 42 題），其中優化器設定 lr=1e-4。",
      },
    ],
  },
  "senior-ml-115-1-q44": {
    explanation:
      "程式先以完整的 X、y 執行 lda.fit_transform(X, y) 降維，之後才把降維結果丟進 cross_val_score。問題在於 LDA 是有監督的降維，它在擬合時看過了全部樣本的標籤，包含每一折將被當成測試集的那些；等於測試資訊已經滲入特徵，屬於資料洩漏，正確做法是把 LDA 與 KNN 包進 Pipeline，讓降維在每折的訓練集內各自擬合（B）。A 稱此為標準流程，正好把洩漏當成正確；C 承認不嚴謹卻說結果仍能代表泛化能力，但洩漏造成的 0.973 正是被高估的數字；D 說可跳過 LDA，那是換一個問題，並未回答目前寫法有何缺陷（L233 模型訓練、評估與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
    figures: [
      {
        kind: "note",
        content:
          "請依據下方資訊回答第 44~45 題。Iris 是 UCI Dataset 上的一組經典資料集，包含三種類型的鳶尾花（Iris setosa、Iris versicolor、Iris virginica），每個類別各有 50 筆資料。每筆資料包含四個特徵：花萼長度、花萼寬度、花瓣長度、花瓣寬度。研究人員希望比較不同分類模型的表現，首先嘗試用線性判別分析（LDA）進行降維，接著使用 K 最近鄰（KNN）分類器做分類預測，並使用交叉驗證（Cross Validation）評估模型的準確率。",
      },
      {
        kind: "code",
        caption: "載入資料與欄位概況。",
        content:
          "from ucimlrepo import fetch_ucirepo\n" +
          "\n" +
          "# 線上載入資料\n" +
          "iris = fetch_ucirepo(id=53)\n" +
          "\n" +
          "# 讀取資料的輸入欄位與預測目標欄位\n" +
          "X = iris.data.features\n" +
          "y = iris.data.targets['class']",
      },
      {
        kind: "output",
        caption: "X.head() 的輸出：",
        content:
          "   sepal length  sepal width  petal length  petal width\n" +
          "0           5.1          3.5           1.4          0.2\n" +
          "1           4.9          3.0           1.4          0.2\n" +
          "2           4.7          3.2           1.3          0.2\n" +
          "3           4.6          3.1           1.5          0.2\n" +
          "4           5.0          3.6           1.4          0.2\n" +
          "\n" +
          "y.head() 的輸出：\n" +
          "0    Iris-setosa\n" +
          "1    Iris-setosa\n" +
          "2    Iris-setosa\n" +
          "3    Iris-setosa\n" +
          "4    Iris-setosa\n" +
          "Name: class, dtype: object",
      },
      {
        kind: "code",
        caption: "第 44 題所指的程式（下圖）：",
        content:
          "from sklearn.model_selection import cross_val_score\n" +
          "from sklearn.neighbors import KNeighborsClassifier\n" +
          "from sklearn.discriminant_analysis import LinearDiscriminantAnalysis\n" +
          "\n" +
          "lda = LinearDiscriminantAnalysis()\n" +
          "X_new = lda.fit_transform(X, y)\n" +
          "\n" +
          "model = KNeighborsClassifier(n_neighbors=3)\n" +
          "scores = cross_val_score(model, X_new, y, cv=5, scoring=\"accuracy\")\n" +
          "scores.mean()\n" +
          "\n" +
          "# 輸出：0.9733333333333334",
      },
    ],
  },
  "senior-ml-115-1-q45": {
    explanation:
      "要求是「每次分割的類別比例與原始資料一致」，也就是分層抽樣。程式碼 B 的 StratifiedKFold 明確做分層；程式碼 D 的 RepeatedStratifiedKFold 是重複多次的分層版本，同樣分層；程式碼 C 的 cv=5 在 scikit-learn 中對分類器會預設採用 StratifiedKFold，因此也滿足條件——三者皆可，故選 A（B、C、D）。程式碼 A 的 KFold 是不分層的等分切割，無法保證各折類別比例，凡是含程式碼 A 的選項（B 的 A+C、C 的 A+B+D）都因此不成立；選項 D 只列 C、D，雖然兩者都正確卻漏掉同樣正確的程式碼 B，不是最完整的組合（L233 模型訓練、評估與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "研究人員在程式（下圖）中使用 cross_val_score，但尚未設定 cv 參數。",
        content:
          "from sklearn.model_selection import cross_val_score\n" +
          "from sklearn.neighbors import KNeighborsClassifier\n" +
          "from sklearn.discriminant_analysis import LinearDiscriminantAnalysis\n" +
          "\n" +
          "model = KNeighborsClassifier(n_neighbors=3)\n" +
          "\n" +
          "# 填入程式碼\n" +
          "\n" +
          "scores = cross_val_score(model, X, y, cv=cv, scoring=\"accuracy\")\n" +
          "scores.mean()",
      },
      {
        kind: "code",
        caption: "候選程式碼：",
        content:
          "程式碼 A：cv = KFold(n_splits=5, shuffle=True)\n" +
          "程式碼 B：cv = StratifiedKFold(n_splits=5, shuffle=True)\n" +
          "程式碼 C：cv = 5\n" +
          "程式碼 D：cv = RepeatedStratifiedKFold(n_splits=5, n_repeats=2)",
      },
    ],
  },
  "senior-ml-115-1-q46": {
    explanation:
      "逐條檢核六項描述：描述 A 說除以 255.0 把範圍壓到 0~31，錯誤，原始像素為 0~255，除以 255 後範圍是 0~1；描述 B 說可增加泛化能力，正確，正規化使各特徵尺度一致、訓練更穩定；描述 C 說結果相當於 z-score 標準化，錯誤，z-score 要減平均再除以標準差，此處只做等比例縮放；描述 D 說目的是避免梯度爆炸或消失，正確，輸入值過大確實會放大梯度；描述 E 說 to_categorical 把 label 轉為獨熱編碼，正確；描述 F 說 y_train 適合輸出層使用 softmax，正確，獨熱標籤搭配 softmax 與 categorical_crossentropy。成立的是 B、D、E、F，故選 B。選項 A（A、C、F）與 C（B、C、E、F）都含錯誤的描述 C，選項 D（A、B、D、E、F）含錯誤的描述 A（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
    figures: [
      {
        kind: "note",
        content:
          "請依據下方資訊回答第 46~48 題。使用 CIFAR-10 資料集以建立卷積神經網路（CNN），進行彩色影像之分類與辨識分析。CIFAR-10 為一常用之影像分類基準資料集，內容包含 10 個類別，共計 60000 張彩色影像，其中訓練集含 50000 張影像，測試集則含 10000 張影像。每張影像解析度為 32 × 32 像素，並具有三個通道（channel），分別對應紅、綠、藍三原色。",
      },
      {
        kind: "code",
        caption: "以下程式碼片段示範資料載入與處理流程。",
        content:
          "import tensorflow as tf\n" +
          "from tensorflow.keras import datasets, layers, models\n" +
          "import matplotlib.pyplot as plt\n" +
          "\n" +
          "(x_train, y_train), (x_test, y_test) = datasets.cifar10.load_data()",
      },
      {
        kind: "output",
        caption: "下圖顯示資料集的第 1 筆部分資料。",
        content:
          ">>> x_train[0]\n" +
          "array([[[ 59,  62,  63],\n" +
          "        [ 43,  46,  45],\n" +
          "        [ 50,  48,  43],\n" +
          "        ...,\n" +
          "        [158, 132, 108],\n" +
          "        [152, 125, 102],\n" +
          "        [148, 124, 103]],\n" +
          "\n" +
          "       [[ 16,  20,  20],\n" +
          "        [  0,   0,   0],\n" +
          "        [ 18,   8,   0],\n" +
          "        ...,\n" +
          "\n" +
          ">>> y_train[0]\n" +
          "array([6], dtype=uint8)",
      },
      {
        kind: "code",
        caption: "第 46 題所指的資料處理（下圖）：",
        content:
          "x_train, x_test = x_train / 255.0, x_test / 255.0\n" +
          "y_train = tf.keras.utils.to_categorical(y_train, 10)\n" +
          "y_test = tf.keras.utils.to_categorical(y_test, 10)",
      },
      {
        kind: "note",
        content:
          "描述 A：x_train, x_test 將影像範圍壓縮到 0~31 範圍；" +
          "描述 B：可以增加模型的泛化能力；" +
          "描述 C：x_train, x_test 資料轉換結果相當於 z-score 標準化；" +
          "描述 D：資料轉換目的是避免梯度爆炸或梯度消失；" +
          "描述 E：y_train 將 label 轉換為獨熱編碼（One-hot Encoding）；" +
          "描述 F：y_train 適合輸出層使用 softmax 函數。",
      },
    ],
  },
  "senior-ml-115-1-q47": {
    explanation:
      "逐條檢核：描述 A 說區塊 1 的 Input(shape=(32,32,3)) 主要目的是資料標準化，錯誤，Input 只宣告輸入張量形狀，不做任何標準化；描述 B 說 Conv2D(32, kernel_size=(3,3), padding=\"same\") 對 (32,32,3) 的輸出 shape 為 (32,32,3)，錯誤，padding=\"same\" 保住長寬 32×32，但通道數變成濾波器數 32，應為 (32,32,32)；描述 C 說 BatchNormalization 放在 Conv2D 之後可減少梯度消失或爆炸，正確；描述 D 說 Dropout(0.25) 會隨機把 25% 神經元輸出設為 1，錯誤，是設為 0；描述 E 說區塊 3 的 Dropout(0.25) 可減少過度擬合，正確；描述 F 說區塊 4 的 Flatten 把 3D 特徵圖展開為 1D 向量，正確。成立的是 C、E、F，故選 B。選項 A（A、C）與 C（A、D、E）都含錯誤的描述 A，選項 D（D、E、F）含錯誤的描述 D（L232 深度學習原理與框架）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "第 47 題所指的建立模型結果（下圖）。程式左側以圓形編號標示四個區塊。",
        content:
          "model = models.Sequential([\n" +
          "    layers.Input(shape=(32, 32, 3)),\n" +
          "    # ── 區塊 1 ──\n" +
          "    layers.Conv2D(32, kernel_size=(3,3), padding=\"same\", activation=\"relu\"),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.Conv2D(32, (3,3), activation='relu', padding='same'),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.MaxPooling2D((2,2)),\n" +
          "    layers.Dropout(0.25),\n" +
          "\n" +
          "    # ── 區塊 2 ──\n" +
          "    layers.Conv2D(64, (3,3), activation='relu', padding='same'),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.Conv2D(64, (3,3), activation='relu', padding='same'),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.MaxPooling2D((2,2)),\n" +
          "    layers.Dropout(0.25),\n" +
          "\n" +
          "    # ── 區塊 3 ──\n" +
          "    layers.Conv2D(128, (3,3), activation='relu', padding='same'),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.Conv2D(128, (3,3), activation='relu', padding='same'),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.MaxPooling2D((2,2)),\n" +
          "    layers.Dropout(0.25),\n" +
          "\n" +
          "    # ── 區塊 4 ──\n" +
          "    layers.Flatten(),\n" +
          "    layers.Dense(256, activation='relu'),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.Dropout(0.5),\n" +
          "    layers.Dense(10, activation='softmax')\n" +
          "])",
      },
      {
        kind: "note",
        content:
          "描述 A：區塊 1 layers.Input(shape=(32, 32, 3)) 主要目的是進行資料標準化；" +
          "描述 B：區塊 1 layers.Conv2D(32, kernel_size=(3,3), padding=\"same\", activation=\"relu\") 考慮輸入為 (32,32,3)，則輸出 shape 為 (32,32,3)；" +
          "描述 C：區塊 1 layers.BatchNormalization() 放在 Conv2D 之後可以減少梯度消失或爆炸；" +
          "描述 D：區塊 2 layers.Dropout(0.25) 可以隨機將 25% 神經元輸出設定為 1；" +
          "描述 E：區塊 3 layers.Dropout(0.25) 可以減少過度擬合（Overfitting）；" +
          "描述 F：區塊 4 Flatten 層的作用是將 3D 特徵圖展開為平成 1D 向量。",
      },
    ],
  },
  "senior-ml-115-1-q48": {
    explanation:
      "訓練準確率持續攀高而驗證準確率在 0.72~0.80 之間停滯甚至回落，兩條曲線之間出現並持續擴大的落差，這正是過擬合的標準徵兆：模型開始記住訓練集的細節，對未見資料不再受益（D）。低度擬合（C）的表現相反，兩條曲線都低且緊貼在一起，而此處訓練準確率已達 0.81；學習率太低（A）會讓兩條曲線都上升緩慢，但圖中訓練曲線在前幾個 epoch 就快速攀升；批次大小太大（B）影響的是每步更新的雜訊與收斂速度，不會製造訓練與驗證之間的持續落差（L233 模型訓練、評估與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
    figures: [
      {
        kind: "chart",
        caption: "下圖：Training and Validation Accuracy for CIFAR-10 with CNN（橫軸 Epochs 0~9，縱軸 Accuracy）。",
        content:
          "訓練準確率（Train Accuracy，藍線）自 epoch 0 的約 0.47 一路穩定上升：0.65、0.71、0.74、0.77、0.79、0.81、0.82、0.835、0.845。" +
          "驗證準確率（Validation Accuracy，紅線）起點較高但很快走平：0.625、0.685、0.735、0.755、0.748、0.803，在 epoch 6 掉到 0.72，" +
          "隨後回升至 0.80、0.815，最後收在 0.797。自 epoch 5 起訓練曲線超越驗證曲線並持續拉開；epoch 6 時兩者為 0.81 對 0.72。",
      },
    ],
  },
  "senior-ml-115-1-q49": {
    explanation:
      "需求是「超過 50 層」且要避開梯度消失。ResNet（C）以殘差連接讓梯度沿捷徑直接回傳，是使上百層網路得以訓練的關鍵設計，正是為此問題而生。VGG（A）確實靠堆疊 3×3 卷積加深，但它本身沒有任何緩解梯度消失的機制，19 層已接近其可訓練上限；GoogLeNet（B）的 Inception 模塊解決的是如何在有限運算下兼顧多種感受野，並非針對梯度傳遞；ViT（D）宣稱「不會出現任何深層模型的訓練問題」過於絕對，Transformer 同樣依賴殘差連接與層正規化才穩定，且在小資料集上還需大量預訓練（L232 深度學習原理與框架）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
    figures: [
      {
        kind: "note",
        content:
          "請根據上述情境回答第 49~50 題。某人工智慧團隊正在開發一套自動光學檢測（Automated Optical Inspection, AOI）系統，目標是透過機械手臂上的相機，自動辨識晶圓表面是否存在「劃傷（Scratch）」或「污點（Spot）」等瑕疵。目前系統開發面臨以下挑戰：資料極度不平衡，正常晶圓影像約佔 99%，有瑕疵影像僅佔 1%；輸入影像品質不一致，包含不同解析度，且部分影像因機械手臂震動而出現模糊；在使用深層卷積神經網路（CNN）訓練時，Loss 曲線震盪劇烈，甚至偶爾出現數值溢出（NaN）情形。",
      },
    ],
  },
  "senior-ml-115-1-q50": {
    explanation:
      "梯度裁剪要作用在「梯度已算出、但還沒拿去更新權重」的那一刻。loss.backward()（位置 4）之後梯度才存在，optimizer.step()（位置 5）之前尚未更新，因此必須插在位置 4 與 5 之間；其作用是把梯度的範數限制在上限內，避免更新步幅失控導致 Loss 變成 NaN（B）。A 插在位置 3 與 4 之間，此時 backward 還沒執行、梯度尚未產生，且它裁剪的是梯度而非 Loss 數值，敘述的目的也寫成避免梯度消失，方向相反；C 插在位置 5 之後，權重已經被壞掉的梯度更新過，為時已晚，且裁剪對象是梯度不是權重；D 插在位置 1 與 2 之間，那是前向傳播前，梯度尚未存在，批次標準化也是模型層的職責而非訓練迴圈（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
    figures: [
      {
        kind: "code",
        caption: "PyTorch 訓練迴圈（下圖），註解標示五個候選插入位置。",
        content:
          "for images, labels in train_loader:\n" +
          "    optimizer.zero_grad()                # 位置 1\n" +
          "    outputs = model(images)              # 位置 2\n" +
          "    loss = criterion(outputs, labels)    # 位置 3\n" +
          "    loss.backward()                      # 位置 4\n" +
          "    optimizer.step()                     # 位置 5",
      },
    ],
  },

  // ── 學習指引參考題（guide）─────────────────────────────────────────────
  // 原詳解由 parseStudyGuide 從學習指引 PDF 擷取，殘留有四類：正解原文前綴、
  // 未切除的「解析：」標記、被併入的章節前言（q010、q020、q030、q040），
  // 以及 q032 的答案區塊錯位（原詳解講的是另一題的內容）。
  "senior-ml-guide-q001": {
    explanation:
      "連續型隨機變數在單一點的機率為零，只能談某個區間的機率，描述這種「密度」的函數就是機率密度函數（C），區間機率由對它積分求得。機率質量函數（A）給的是離散變數在每個可能值上的機率，用在連續變數上會全部為零；累積分佈函數（D）給的是「小於等於某值」的累積機率，它與 PDF 互為積分/微分關係，但描述的是累積量而非密度；條件機率（B）講的是在某事件已發生下另一事件的機率，不是描述分佈形狀的函數（L231 機率統計基礎）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q002": {
    explanation:
      "伯努利分佈描述單次二元試驗的結果，取值只有 0 與 1（B），分別代表失敗與成功，是羅吉斯迴歸等二元分類模型的理論基礎。A 的任何實數對應常態分佈這類連續分佈；C 的正整數與 D 的任意整數雖然都是離散取值，但範圍遠大於兩個值——正整數對應幾何分佈這類、任意整數則無標準的單一分佈對應（L231 機率統計基礎）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q003": {
    explanation:
      "PCA 要找的是資料變異最大的方向，數學上等價於求共變異數矩陣的特徵向量，因此使用特徵值分解（C），特徵值大小即對應該方向解釋的變異量。矩陣求逆（A）用於解線性方程組，共變異數矩陣求逆得到的是精確度矩陣，與主軸方向無關；矩陣轉置（B）只是行列互換，不產生任何方向資訊；條件機率分解（D）並非矩陣運算（L231 線性代數應用）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q004": {
    explanation:
      "把高維資料投影到低維、同時盡量保留原始變異，正是主成分分析（C）的定義。邊際機率估計（A）與累積機率計算（D）都是機率運算，處理的是分佈而非資料維度；矩陣轉置（B）只是把列與行對調，維度數字雖然變了但資訊完全沒有壓縮，也談不上保留變異（L231 線性代數應用）。",
    topic: "L23102 線性代數之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q005": {
    explanation:
      "梯度是損失函數對各個參數的偏微分所組成的向量（C），它指出損失上升最快的方向，因此往負梯度方向更新參數就能降低損失。資料點個數（A）是樣本量、模型精確度（B）是評估指標、模型計算速度（D）是效能指標，三者都不是對參數的導數，也無法指示更新方向（L231 數值優化）。",
    topic: "L23103 數值優化技術與方法",
    choices: {},
  },
  "senior-ml-guide-q006": {
    explanation:
      "顯著水準 α 是研究者事先設定的門檻，意義是「當虛無假設其實為真時，容許錯誤拒絕它的機率上限」，也就是型一錯誤的容許機率（C），常設為 0.05。平均值的大小（A）與資料筆數（D）是資料本身的性質，不是檢定的判準；模型運算速度（B）與統計檢定完全無關（L231 機率統計基礎）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q007": {
    explanation:
      "題目問的是「集中趨勢指標」中較不受極端值影響者。中位數（D）取排序後的中間值，不論兩端多極端都不動。平均數（A）把每個值都計入，少數極端值即可拉偏，正是受影響最大的集中趨勢指標；變異數（B）與標準差（C）則根本不是集中趨勢指標——它們衡量離散程度，而且因為計算時對偏差取平方，受極端值的影響比平均數更劇烈（L231 機率統計基礎）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q008": {
    explanation:
      "Adagrad（B）為每個參數累積歷史梯度的平方和，再用它的平方根去除學習率——經常更新的參數學習率被壓小、少更新的維持較大，特別適合稀疏特徵。Momentum（A）累積的是梯度本身的移動平均，作用在更新方向而非學習率；SGD（C）對所有參數使用同一個固定學習率；Batch Normalization（D）是網路層，作用是正規化層的輸入分佈，根本不是優化器（L231 數值優化）。",
    topic: "L23103 數值優化技術與方法",
    choices: {},
  },
  "senior-ml-guide-q009": {
    explanation:
      "梯度爆炸指的是反向傳播時梯度數值變得極大，導致權重更新失控甚至溢出成 NaN，直接的對策是梯度裁剪（B）——把梯度的範數限制在上限內再更新。增大學習率（A）會讓步伐更大，是火上加油；減少資料量（C）與刪除輸入特徵（D）改變的是資料規模與維度，梯度在深層網路中連乘放大的機制並不會因此消失（L231 數值優化）。",
    topic: "L23103 數值優化技術與方法",
    choices: {},
  },
  "senior-ml-guide-q010": {
    explanation:
      "羅吉斯迴歸處理的是二元結果，目標變數只取 0 或 1，因此假設其服從伯努利分佈（C），模型以 sigmoid 把線性組合映射成該分佈的成功機率。常態分佈（A）是連續型，對應的是線性迴歸的誤差假設；均勻分佈（B）表示各值機率相等，不描述二元結果的偏好；泊松分佈（D）用於單位時間內的計數，取值為非負整數而非只有兩種（L231 機率統計基礎）。",
    topic: "L23101 機率／統計之機器學習基礎應用",
    choices: {},
  },
  "senior-ml-guide-q011": {
    explanation:
      "判準是「有沒有標籤」。輸入資料沒有標註、目標是找出潛在群組或模式，屬非監督式學習（C），代表方法是分群與降維。監督式學習（A）必須有標籤才能學輸入到輸出的映射；半監督式學習（B）用的是少量標註加大量未標註，前提仍需要部分標籤；強化式學習（D）沒有標籤但需要環境互動與獎勵訊號，本題並無環境可互動（L232 機器學習原理）。",
    topic: "L23201 機器學習原理與技術",
    choices: {},
  },
  "senior-ml-guide-q012": {
    explanation:
      "判準是「預測目標是連續值還是離散類別」。預測連續數值的監督式任務稱為迴歸（B），如房價、氣溫。分類（A）預測的是離散類別；聚類（C）是非監督學習，沒有預測目標；降維（D）是特徵轉換，輸出的是新的特徵空間而非預測值（L232 機器學習原理）。",
    topic: "L23201 機器學習原理與技術",
    choices: {},
  },
  "senior-ml-guide-q013": {
    explanation:
      "卷積神經網路（C）以卷積核在局部感受野上滑動並共享權重，天生擅長擷取影像或訊號中的局部特徵。循環神經網路（A）建模的是序列中前後時間步的依賴關係，強項在時序而非空間局部性；決策樹（B）與隨機森林（D）是樹模型，對輸入特徵逐一做閾值切分，沒有「鄰近像素構成局部圖樣」這種空間概念（L232 深度學習原理）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-guide-q014": {
    explanation:
      "SVM 用於連續數值預測時稱為支援向量迴歸（D，SVR），其目標是找一條讓多數樣本落在 ε 容許帶內的超平面。Logistic Regression（A）是分類模型，名為迴歸實為分類；Decision Tree Regression（B）與 Random Forest（C）確實能做迴歸，但它們是樹模型的迴歸版本，與 SVM 是完全不同的演算法族（L232 常見機器學習演算法）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-guide-q015": {
    explanation:
      "模型把訓練資料中的雜訊也學了進去，導致在未見資料上表現下滑，這就是過擬合（B）。欠擬合（A）是相反情形——模型太簡單，連訓練資料都學不好，訓練與測試表現同時偏低；特徵縮放（C）是前處理手法，不是現象；梯度爆炸（D）是訓練過程中梯度數值失控，屬最佳化問題而非泛化問題（L232 機器學習原理）。",
    topic: "L23201 機器學習原理與技術",
    choices: {},
  },
  "senior-ml-guide-q016": {
    explanation:
      "激活函數（B）如 ReLU、Sigmoid 在每一層的線性運算後引入非線性；少了它，再多層的線性變換疊起來仍等價於單一線性變換，網路學不了複雜模式。損失函數（A）衡量的是預測與真值的差距；隱藏層（C）提供的是深度與參數量，但若層與層之間全是線性運算仍無法產生非線性；梯度下降（D）是最佳化演算法，負責怎麼更新參數（L232 深度學習原理）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-guide-q017": {
    explanation:
      "正則化（C）在損失函數中加入 L1 或 L2 懲罰項以限制權重大小，直接降低模型的有效複雜度，是緩解過擬合的標準手段。提高學習率（A）影響的是收斂行為，過大還會造成震盪；減少資料量（B）會讓模型更容易記住訓練集，加劇過擬合；隨機刪除特徵（D）雖然也降低複雜度，但「隨機」意味著可能刪掉關鍵特徵，是無依據的作法，與有原則的正則化不同（L232 機器學習原理）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-guide-q018": {
    explanation:
      "衡量模型輸出與實際值差距的函數是損失函數（C），如 MSE、交叉熵，它同時是優化器據以調整參數的依據。激活函數（A）提供非線性；池化函數（B）縮減特徵圖的空間維度；梯度函數（D）並非標準術語，梯度是損失函數對參數微分的結果而非另一個獨立函數（L232 深度學習原理）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-guide-q019": {
    explanation:
      "Transformer 的核心是注意力機制（B）：為序列中每一對位置計算關聯權重，因此任意兩個位置無論距離多遠都能直接建立依賴，且整個序列可平行運算。池化機制（A）是 CNN 用來降維的操作；決策樹分支（C）屬樹模型；激活函數（D）雖然存在於 Transformer 的前饋層中，但它提供的是非線性，不負責捕捉位置間的依賴（L232 深度學習原理）。",
    topic: "L23203 深度學習原理與框架",
    choices: {},
  },
  "senior-ml-guide-q020": {
    explanation:
      "決策樹在分類任務中常以基尼不純度（C）評估分裂品質——數值越低代表節點內樣本越集中於單一類別，分裂前後不純度的下降量即為增益。機率密度函數（A）描述連續變數的分佈；均方根誤差（B）是迴歸的評估指標（迴歸樹會用變異數或 MSE，但本題語境為分類的分裂判準）；卷積核大小（D）是 CNN 的超參數，與樹模型無關（L232 常見機器學習演算法）。",
    topic: "L23202 常見機器學習演算法",
    choices: {},
  },
  "senior-ml-guide-q021": {
    explanation:
      "題目限定「利用模型進行補值」。預測模型填補（C）拿其他特徵當輸入、訓練迴歸或分類器去預測缺失欄位的值，是唯一動用模型的選項。刪除法（A）直接丟掉整筆或整欄，不補值；均值填補（B）用的是單一統計量，不涉及模型；缺失指標編碼（D）是新增一個標記「這格原本是空的」的欄位，保留缺失資訊但不填值（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-guide-q022": {
    explanation:
      "題目限定「利用統計特徵分佈判斷離群點」。四分位距法（B）以 Q1、Q3 與 IQR 計算上下界，超出 1.5 倍 IQR 者判為異常，完全建立在分位數這個統計量上。Isolation Forest（C）也是異常偵測方法，但它以隨機切分建樹、依樣本被隔離的難易度判定，屬機器學習模型而非統計分佈；KNN 補值（A）是缺失值處理；One-hot Encoding（D）是類別編碼（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-guide-q023": {
    explanation:
      "判準是「特徵挑選發生在什麼時候」。Embedded 方法（C）把特徵選擇內建在模型訓練裡——Lasso 以 L1 懲罰把係數壓成 0、樹模型在分裂時自然挑用有用的特徵，訓練完成的同時選擇也完成了。Filter 方法（A）在訓練前依統計指標（如相關係數）先篩一輪，與模型無關；Wrapper 方法（B）反覆訓練模型來評估不同特徵子集，特徵選擇在訓練「之外」的搜尋迴圈裡；One-hot Encoding（D）是編碼手法而非選擇方法（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-guide-q024": {
    explanation:
      "對數轉換（B）把乘法尺度壓成加法尺度，對極端偏高的右偏分佈（如收入、銷售額）壓縮效果最強，能有效拉回常態。平方根轉換（A）同樣能降偏態，但壓縮力道較弱，適用於中度偏態；Label Encoding（C）與缺失指標編碼（D）處理的分別是類別變數與缺失值，兩者都不改變數值分佈的形狀（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-guide-q025": {
    explanation:
      "訓練集好、測試集差，兩者出現明顯落差，正是過擬合（C）的定義。欠擬合（A）的表現是兩者都差且接近；特徵縮放失敗（B）通常讓訓練與測試表現同時受影響，不會製造這種落差；批次大小過小（D）影響的是梯度雜訊與收斂穩定性，同樣不對應「訓練好、測試差」的特定型態（L233 模型訓練與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-guide-q026": {
    explanation:
      "每次只留一筆當驗證集、其餘全部拿去訓練，重複 n 次，這是 LOOCV（C），也就是 K = n 的極端情形。K-fold（A）把資料切成 K 份輪流當驗證，每份含多筆；Stratified K-fold（B）是 K-fold 的分層版本，額外保持各折的類別比例；Repeated K-fold（D）是把 K-fold 重複多輪以降低切分隨機性，三者的驗證集都不只一筆（L233 模型訓練與驗證）。",
    topic: "L23303 模型訓練、評估與驗證",
    choices: {},
  },
  "senior-ml-guide-q027": {
    explanation:
      "Dropout（B）在訓練時以一定機率把神經元的輸出暫時設為零，等於每步都在訓練一個不同的子網路，迫使模型不過度依賴特定神經元。Early Stopping（A）也防過擬合，但作法是在驗證損失回升時停止訓練，並未關閉任何神經元；Batch Normalization（C）正規化的是層輸入的分佈；Quantization（D）是把權重降精度以壓縮模型，屬部署優化（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-guide-q028": {
    explanation:
      "知識蒸餾以一個大型高效能的教師模型產生軟標籤，指導小型學生模型學習，目的是把大模型的知識轉移到小模型上（C）。B 說降低參數數量使模型更小，那是結果的一部分，但單純減參數是剪枝或量化在做的事，蒸餾的關鍵在「知識轉移」這個機制；A 的減少資料維度是降維；D 的增強資料平衡是重採樣或加權要處理的問題（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-guide-q029": {
    explanation:
      "判準是「有沒有為每個參數各自調整學習率，且針對稀疏資料」。Adagrad（B）累積各參數的歷史梯度平方和，罕見特徵對應的參數因累積量小而保有較大學習率，正適合文字這類稀疏場景。Momentum（A）調整的是更新方向不是學習率；SGD（D）所有參數共用固定學習率；Adam（C）確實也有自適應學習率，但它以指數移動平均取代無限累積，設計目的是通用場景下的穩定收斂，稀疏資料的針對性正是 Adagrad 的特色（L233 模型調整與優化）。",
    topic: "L23304 模型調整與優化",
    choices: {},
  },
  "senior-ml-guide-q030": {
    explanation:
      "One-hot Encoding 為每個相異類別開一欄，因此負擔的來源是類別數量。當類別變數具有高基數（C，例如數千個商品代碼），欄位數隨之爆炸，記憶體與訓練成本同步上升。B 的 10 種類別只增加 10 欄，負擔微不足道；A 的缺失值多是另一個問題，且缺失通常另以一欄標記；D 的無重複樣本描述的是列的性質，與欄位維度無關（L233 數據準備與特徵工程）。",
    topic: "L23301 數據準備與特徵工程",
    choices: {},
  },
  "senior-ml-guide-q031": {
    explanation:
      "直接識別個人身份資訊的定義是「單獨使用即可明確辨識特定個人、無需其他資訊輔助」。姓名、電子郵件地址、身分證字號（C）三者皆符合，身分證字號更是唯一對應。A 的出生日期、郵遞區號、職業單獨都無法指向特定個人，須組合才可能再識別，屬準識別符；B 的 Cookie ID、IP 位址、地理定位指向的是裝置或位置而非人，通常歸類為間接識別資訊；D 的行為模式、匿名化統計與密碼雜湊，其設計目的正是移除或遮蔽身分（L234 數據隱私與合規）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
  "senior-ml-guide-q032": {
    explanation:
      "隨機擾動是在原始數值上加入隨機雜訊，使個別值不再精確、但整體統計特性大致保留——將薪資加入隨機誤差（B）正是如此。A 把姓名改成代號是假名化（Pseudonymisation），是一對一替換而非加噪；C 把地址改成縣市級別是泛化（Generalization），降低的是精細度；D 以星號遮蔽身分證號是遮蔽（Masking），直接隱藏部分字元。三者都不引入隨機性（L234 數據隱私與合規）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
  "senior-ml-guide-q033": {
    explanation:
      "對不同群體調整預測閾值，是在模型訓練完成後、於輸出端動手腳，屬後處理的結果門檻調整（B）。資料泛化（A）與資料增強（D）都作用在訓練資料上，屬前處理；模型剪枝（C）移除的是不重要的權重或神經元，目的是壓縮模型，與公平性無關（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-guide-q034": {
    explanation:
      "題目限定「真正該被選擇者」在各群體間有同等機會被正確預測——也就是在實際為正例的樣本中，各群體的真陽率應相等，這正是 Equal Opportunity（A）。Demographic Parity（B）要求的是各群體獲得正向決策的「比例」相等，不管實際上該不該被選；K-Anonymity（C）與 T-Closeness（D）都是去識別化的隱私保護指標，與公平性無關（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-guide-q035": {
    explanation:
      "題目限定「模型內部處理方式」。對抗式去偏（A）在訓練時額外接一個試圖從模型表徵預測敏感屬性的對抗網路，主模型則被訓練成讓對抗網路失敗，使表徵不再攜帶性別資訊——處理發生在模型訓練內部。結果門檻調整（D）是後處理，發生在模型之外；模型蒸餾（B）目的是壓縮而非去偏；雜湊處理（C）是資料前處理的去識別手法（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-guide-q036": {
    explanation:
      "群體樣本數不均導致模型偏向多數類，類別重加權（C）在損失函數中提高少數類樣本的權重，使模型不能靠忽略少數類來降低總損失。權重初始化（A）決定的是訓練起點；權重衰減（B）是 L2 正則化，處理的是過擬合；全量訓練（D）指用全部資料訓練，並未改變類別比例失衡的事實（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-guide-q037": {
    explanation:
      "T-Closeness 要求每個等價群組內敏感屬性的分佈，與整體資料集的分佈差距不超過 t，目的是防止攻擊者從「這群人的薪資分佈明顯偏高」這類分佈差異反推個人特徵（A）。B 的資料重複、C 的訓練時間過長、D 的演算法震盪，分別屬於資料品質、效能與最佳化問題，都不是隱私保護技術要解決的風險（L234 數據隱私與合規）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
  "senior-ml-guide-q038": {
    explanation:
      "把公平性納入日常決策流程需要跨部門的常設審查機制，也就是公平性審查委員會（C），成員涵蓋法務、技術、產品與倫理。模型剪枝委員會（A）與 AI 蒸餾中心（B）名稱指向的是模型壓縮技術，並非治理組織；隨機抽樣團隊（D）執行的是抽樣作業，不具備審查與問責職能（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-guide-q039": {
    explanation:
      "題目限定「資料增強方法」。SMOTE（A）在少數類樣本之間插值合成新樣本，直接擴增少數群體的資料量，屬資料層手法。Softmax（B）是輸出層的機率正規化函數；Momentum（C）是優化器的動量機制；Dropout（D）是訓練時的正則化技巧——三者都作用在模型或訓練過程，不產生任何新樣本（L234 演算法偏見與公平性）。",
    topic: "L23402 演算法偏見與公平性",
    choices: {},
  },
  "senior-ml-guide-q040": {
    explanation:
      "本題問「不是」隱私保護基礎技術者。知識蒸餾（C）是把大模型的知識轉移到小模型的壓縮加速技術，目的在效能而非隱私，故選 C。遮蔽（A）以星號等符號隱藏部分欄位內容、泛化（B）把精確值改為較粗的級距（如出生日期改為出生年）、分桶（D）把連續值歸入區間，三者都是降低資料精細度以減少再識別風險的標準去識別化手法（L234 數據隱私與合規）。",
    topic: "L23401 數據隱私、安全與合規",
    choices: {},
  },
};
