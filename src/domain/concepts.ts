import type { Question } from "../data/types";

/**
 * 受控概念詞彙。
 *
 * ## 為什麼需要這一層
 *
 * 新題庫的 `meta.concepts` 是**自由書寫的短語**——全站 1,890 個相異字串，其中 1,379 個
 * 只出現一次（「K-means假設」「感測器漂移補償」這種）。先前試過純機械正規化
 * （去括號、去空白、統一大小寫），只從 1,890 收斂到 1,885：它們不是拼寫變體，
 * 是不同人不同時候寫下的不同句子。因此「概念」目前是標籤雲，不是可查詢的維度。
 *
 * ## 作法：不去改既有資料，而是另建一份詞彙表用別名比對
 *
 * 逐一改寫 1,890 個字串成本高、且每次新增題目又會長出新的字串。改為：
 * 手寫一份**受控詞彙**（約 200 條，各帶別名），比對時看題目的概念字串**與題幹**
 * 有沒有出現任一別名。好處有三：
 *
 * 1. 「漏診風險與召回率」這種自由字串仍能對上「召回率」。
 * 2. **原題庫也能用**——那 1,057 題根本沒有 `concepts` 欄位，但題幹裡有詞。
 * 3. 新增題目不需要同步維護對照表。
 *
 * 代價是**比對是啟發式的**：題幹提到但不是考點的詞也會被算進去。因此這一層只用於
 * 「弱點提示」與「相似題」這類**建議性**用途，不作為評分或配額的依據。
 */

export type ConceptEntry = {
  /** 穩定 id。改 label 不影響引用。 */
  id: string;
  label: string;
  /** 比對用的別名；`label` 會自動納入，不必重複列。 */
  aliases: string[];
};

/**
 * 比對用的正規化：轉小寫，並把各種分隔符（空白、連字號、頓號、括號…）收成單一空白。
 *
 * **保留分隔而非直接刪掉**是關鍵：ASCII 縮寫若以純子字串比對會大量誤命中——
 * `storage` 含 `rag`、`input` 含 `npu`、`process` 含 `roc`、`shape` 含 `shap`、
 * `epsilon` 含 `psi`。留下分隔才能對英文別名做「詞邊界」比對。
 */
export const normalizeForMatch = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[\s　·・、,，/／|｜_\-()（）［］\[\]「」『』]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isAscii = (text: string): boolean => /^[\x20-\x7e]+$/.test(text);

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const concepts: ConceptEntry[] = [
  // ── 評估與驗證 ──────────────────────────────
  { id: "accuracy", label: "準確率", aliases: ["accuracy", "整體準確率"] },
  { id: "precision", label: "精確率", aliases: ["precision", "精準率"] },
  { id: "recall", label: "召回率", aliases: ["recall", "查全率", "漏診"] },
  { id: "f1", label: "F1 分數", aliases: ["f1-score", "f1"] },
  { id: "roc-auc", label: "ROC 與 AUC", aliases: ["roc", "auc", "roc曲線"] },
  { id: "pr-curve", label: "PR 曲線", aliases: ["pr-auc", "precision-recall"] },
  { id: "confusion-matrix", label: "混淆矩陣", aliases: ["confusionmatrix", "偽陽性", "偽陰性", "真陽率", "假陽率"] },
  { id: "regression-metrics", label: "迴歸評估指標", aliases: ["均方誤差", "mse", "rmse", "均方根誤差", "平均絕對誤差", "mae", "判定係數", "r²"] },
  { id: "cross-validation", label: "交叉驗證", aliases: ["crossvalidation", "k-fold", "分層交叉驗證", "留一", "loocv", "滾動窗口驗證", "前進式驗證"] },
  { id: "overfitting", label: "過擬合", aliases: ["overfitting", "過度擬合", "過度配適"] },
  { id: "underfitting", label: "欠擬合", aliases: ["underfitting", "配適不足", "低度擬合"] },
  { id: "bias-variance", label: "偏差與變異權衡", aliases: ["bias-variance", "偏差與變異", "高變異", "高偏差"] },
  { id: "data-leakage", label: "資料洩漏", aliases: ["dataleakage", "資料外洩至訓練", "洩漏"] },
  { id: "generalization", label: "泛化能力", aliases: ["generalization", "泛化"] },
  { id: "holdout-split", label: "訓練驗證測試切分", aliases: ["訓練集", "驗證集", "測試集", "資料切分", "時間切分", "群組切分"] },

  // ── 資料處理與特徵工程 ─────────────────────
  { id: "missing-values", label: "缺失值處理", aliases: ["缺失值", "遺漏值", "補值", "填補", "imputation", "插補"] },
  { id: "outliers", label: "離群值", aliases: ["outlier", "極端值", "異常值"] },
  { id: "scaling", label: "特徵縮放", aliases: ["標準化", "正規化", "z-score", "min-max", "穩健縮放", "robustscaling"] },
  { id: "one-hot", label: "One-hot 編碼", aliases: ["one-hot", "獨熱編碼"] },
  { id: "label-encoding", label: "標籤編碼", aliases: ["labelencoding", "序數編碼", "ordinalencoding", "目標編碼", "targetencoding"] },
  { id: "feature-engineering", label: "特徵工程", aliases: ["特徵衍生", "特徵交叉", "特徵組合", "滯後特徵", "滑動窗口"] },
  { id: "feature-selection", label: "特徵選擇", aliases: ["特徵篩選"] },
  { id: "dimensionality-reduction", label: "降維與 PCA", aliases: ["降維", "pca", "主成分分析", "t-sne", "svd", "奇異值分解", "lda"] },
  { id: "data-augmentation", label: "資料增強", aliases: ["dataaugmentation", "反向翻譯", "資料擴增"] },
  { id: "imbalance", label: "類別不平衡", aliases: ["smote", "過採樣", "欠採樣", "oversampling", "undersampling", "類別權重"] },
  { id: "log-transform", label: "偏態與轉換", aliases: ["對數轉換", "logtransform", "box-cox", "右偏", "左偏", "偏態", "skewness"] },
  { id: "discretization", label: "離散化與分箱", aliases: ["分箱", "binning", "離散化", "區間化"] },
  { id: "multicollinearity", label: "多重共線性", aliases: ["共線性", "multicollinearity"] },
  { id: "data-quality", label: "資料品質", aliases: ["資料清理", "資料驗證", "標籤雜訊", "去重"] },
  { id: "structured-data", label: "結構化與非結構化資料", aliases: ["結構化資料", "半結構化", "非結構化"] },

  // ── 統計與機率 ─────────────────────────────
  { id: "descriptive-stats", label: "敘述統計", aliases: ["描述性統計", "平均數", "中位數", "眾數", "標準差", "變異數", "四分位", "iqr", "全距"] },
  { id: "normal-distribution", label: "常態分布", aliases: ["常態分佈", "normaldistribution", "z分數"] },
  { id: "poisson", label: "卜瓦松分布", aliases: ["卜瓦松", "poisson", "泊松"] },
  { id: "bernoulli-binomial", label: "伯努利與二項分布", aliases: ["伯努利", "bernoulli", "二項分布", "binomial"] },
  { id: "hypothesis-testing", label: "假設檢定", aliases: ["虛無假設", "顯著水準", "p值", "型一錯誤", "型二錯誤", "typeierror", "統計顯著"] },
  { id: "t-test", label: "t 檢定", aliases: ["t-test", "成對樣本", "獨立樣本"] },
  { id: "anova", label: "變異數分析", aliases: ["anova", "f檢定"] },
  { id: "chi-square", label: "卡方檢定", aliases: ["卡方", "chi-square"] },
  { id: "confidence-interval", label: "信賴區間", aliases: ["confidenceinterval", "標準誤"] },
  { id: "correlation", label: "相關係數", aliases: ["pearson", "皮爾森", "spearman", "斯皮爾曼", "kendall", "肯德爾", "共變異數"] },
  { id: "sampling", label: "抽樣方法", aliases: ["抽樣", "分層抽樣", "隨機抽樣", "sampling"] },
  { id: "bayes", label: "貝氏定理", aliases: ["bayes", "後驗機率", "條件機率"] },
  { id: "monte-carlo", label: "蒙地卡羅方法", aliases: ["蒙地卡羅", "montecarlo"] },
  { id: "cdf-pdf", label: "機率密度與累積分布", aliases: ["機率密度函數", "pdf", "累積分佈函數", "cdf", "機率質量函數", "pmf"] },

  // ── 機器學習範式與模型 ─────────────────────
  { id: "supervised", label: "監督式學習", aliases: ["supervisedlearning"] },
  { id: "unsupervised", label: "非監督式學習", aliases: ["unsupervisedlearning"] },
  { id: "semi-supervised", label: "半監督式學習", aliases: ["半監督", "semi-supervised"] },
  { id: "self-supervised", label: "自監督式學習", aliases: ["自監督", "self-supervised"] },
  { id: "reinforcement", label: "強化學習", aliases: ["強化式學習", "reinforcementlearning", "q-learning", "獎勵函數", "探索與利用"] },
  { id: "transfer-learning", label: "遷移學習", aliases: ["transferlearning", "凍結層", "特徵萃取"] },
  { id: "federated-learning", label: "聯邦學習", aliases: ["federatedlearning"] },
  { id: "regression-model", label: "迴歸模型", aliases: ["線性迴歸", "linearregression", "多元迴歸", "分位數回歸", "ridge", "lasso", "elasticnet"] },
  { id: "logistic-regression", label: "邏輯迴歸", aliases: ["羅吉斯迴歸", "logisticregression"] },
  { id: "decision-tree", label: "決策樹", aliases: ["decisiontree", "資訊增益", "吉尼", "gini", "基尼"] },
  { id: "ensemble", label: "集成學習", aliases: ["隨機森林", "randomforest", "xgboost", "lightgbm", "梯度提升", "gradientboosting", "bagging", "boosting", "樹系集成"] },
  { id: "svm", label: "支援向量機", aliases: ["支持向量機", "svm", "核函數"] },
  { id: "knn", label: "K 近鄰", aliases: ["knn", "k-nearestneighbors"] },
  { id: "kmeans", label: "K-means 分群", aliases: ["k-means", "k平均"] },
  { id: "dbscan", label: "DBSCAN 密度分群", aliases: ["dbscan", "密度式分群", "minpts", "epsilon"] },
  { id: "clustering", label: "分群與群集評估", aliases: ["分群", "聚類", "clustering", "群集", "分群評估", "階層式分群"] },
  { id: "naive-bayes", label: "單純貝氏分類器", aliases: ["單純貝氏", "樸素貝氏", "naivebayes"] },
  { id: "regularization", label: "正則化", aliases: ["regularization", "l1正則", "l2正則", "權重衰減", "weightdecay", "稀疏解"] },
  { id: "gradient-descent", label: "梯度下降", aliases: ["gradientdescent", "sgd", "小批次", "mini-batch", "全批次"] },
  { id: "optimizer", label: "優化器", aliases: ["adam", "rmsprop", "adagrad", "momentum", "動量", "optimizer"] },
  { id: "learning-rate", label: "學習率", aliases: ["learningrate"] },
  { id: "loss-function", label: "損失函數", aliases: ["lossfunction", "交叉熵", "cross-entropy", "hinge", "huber"] },
  { id: "hyperparameter", label: "超參數調校", aliases: ["超參數", "hyperparameter", "網格搜尋", "gridsearch", "隨機搜尋", "randomsearch", "貝葉斯優化"] },
  { id: "anomaly-detection", label: "異常偵測", aliases: ["anomalydetection", "離群偵測", "isolationforest"] },
  { id: "association-rules", label: "關聯規則", aliases: ["apriori", "支援度", "信賴度", "提升度", "lift"] },
  { id: "recommender", label: "推薦系統", aliases: ["recommendationsystem", "協同過濾", "collaborativefiltering"] },
  { id: "time-series", label: "時間序列", aliases: ["timeseries", "arima", "季節性"] },

  // ── 深度學習 ───────────────────────────────
  { id: "neural-network", label: "神經網路", aliases: ["neuralnetwork", "多層感知機", "mlp", "隱藏層", "全連接層", "全連結層"] },
  { id: "cnn", label: "卷積神經網路", aliases: ["cnn", "卷積層", "convolution", "池化", "pooling", "flatten"] },
  { id: "rnn-lstm", label: "RNN 與 LSTM", aliases: ["循環神經網路", "遞迴神經網路", "rnn", "lstm", "長短期記憶", "gru"] },
  { id: "transformer", label: "Transformer 架構", aliases: ["transformer", "自注意力", "self-attention", "多頭注意力", "位置編碼", "positionalencoding"] },
  { id: "activation", label: "激活函數", aliases: ["啟動函數", "activationfunction", "relu", "sigmoid", "softmax", "tanh"] },
  { id: "batch-norm", label: "批次正規化", aliases: ["batchnormalization", "batchnorm"] },
  { id: "dropout", label: "Dropout", aliases: [] },
  { id: "early-stopping", label: "早停", aliases: ["earlystopping", "早期停止"] },
  { id: "vanishing-gradient", label: "梯度消失與爆炸", aliases: ["梯度消失", "梯度爆炸", "vanishinggradient", "梯度裁剪", "gradientclipping"] },
  { id: "resnet", label: "殘差連接與 ResNet", aliases: ["殘差連接", "resnet", "殘差網路"] },
  { id: "embedding", label: "詞嵌入", aliases: ["wordembedding", "word2vec", "glove", "cbow", "skip-gram", "嵌入層"] },
  { id: "bert", label: "BERT 與遮罩語言模型", aliases: ["bert", "遮罩語言", "maskedlanguage", "mlm"] },
  { id: "batch-size", label: "批次大小", aliases: ["batchsize"] },

  // ── 生成式 AI ──────────────────────────────
  { id: "generative-ai", label: "生成式 AI", aliases: ["generativeai", "生成式模型"] },
  { id: "discriminative-ai", label: "鑑別式 AI", aliases: ["判別式", "鑑別式模型", "discriminative"] },
  { id: "gan", label: "生成對抗網路", aliases: ["gan", "生成對抗", "生成器", "判別器", "鑑別器", "模式崩潰", "modecollapse", "wgan"] },
  { id: "vae", label: "變分自編碼器", aliases: ["vae", "變分自編碼", "自編碼器", "autoencoder", "隱變量"] },
  { id: "diffusion", label: "擴散模型", aliases: ["diffusionmodel", "stablediffusion", "去雜訊"] },
  { id: "llm", label: "大型語言模型", aliases: ["llm", "基礎模型", "foundationmodel", "gpt"] },
  { id: "prompt-engineering", label: "提示工程", aliases: ["promptengineering", "零樣本", "zero-shot", "少樣本", "few-shot", "角色扮演"] },
  { id: "chain-of-thought", label: "思維鏈", aliases: ["chainofthought", "cot", "treeofthoughts", "graphprompting"] },
  { id: "rag", label: "檢索增強生成", aliases: ["rag", "檢索增強", "retrieval-augmented", "chunking", "文本切分", "混合搜尋"] },
  { id: "vector-db", label: "向量資料庫", aliases: ["vectordatabase", "餘弦相似度", "近似最近鄰", "faiss"] },
  { id: "fine-tuning", label: "微調", aliases: ["fine-tuning", "sft", "監督式微調", "災難性遺忘"] },
  // 「LoRA」（低秩微調）與「LoRa」（低功耗無線）在正規化後同形，且兩者在本站都有題目。
  // 因此這裡不收單獨的 "lora"，改以帶脈絡的寫法比對；單獨出現的 LoRa 一律歸 lpwan（無線）。
  { id: "peft-lora", label: "參數高效微調與 LoRA", aliases: ["lora微調", "lorarank", "peft", "低秩", "參數高效", "提示微調", "prompttuning"] },
  { id: "rlhf", label: "人類回饋強化學習", aliases: ["rlhf", "人類反饋", "人類回饋", "偏好對齊", "grpo"] },
  { id: "hallucination", label: "幻覺", aliases: ["hallucination"] },
  { id: "prompt-injection", label: "提示注入", aliases: ["promptinjection", "提示洩漏", "越獄"] },
  { id: "token", label: "Token 與上下文長度", aliases: ["token", "上下文視窗", "contextwindow", "上下文長度", "上下文工程"] },
  { id: "multimodal", label: "多模態", aliases: ["multimodal", "clip", "跨模態", "晚期融合", "早期融合", "感測融合"] },
  { id: "ai-agent", label: "AI Agent", aliases: ["ai代理", "智慧代理", "react", "多代理", "multi-agent", "agentic", "solutiongraph", "任務規劃器"] },
  { id: "tool-calling", label: "工具呼叫與 MCP", aliases: ["工具呼叫", "functioncalling", "toolcalling", "mcp", "modelcontextprotocol", "a2a"] },
  { id: "model-compression", label: "模型壓縮", aliases: ["知識蒸餾", "distillation", "剪枝", "pruning", "模型量化", "quantization", "int8量化"] },
  { id: "guardrails", label: "護欄與輸出審查", aliases: ["guardrails", "護欄", "防護機制", "輸出審查", "人工審查"] },
  { id: "synthetic-data", label: "合成資料", aliases: ["syntheticdata", "模型崩潰", "modelcollapse"] },

  // ── 可解釋性與治理 ─────────────────────────
  { id: "explainability", label: "可解釋性", aliases: ["explainability", "xai", "可解釋ai", "黑箱"] },
  { id: "shap", label: "SHAP", aliases: ["shapley"] },
  { id: "lime", label: "LIME", aliases: ["代理模型", "surrogatemodel"] },
  { id: "saliency", label: "顯著性圖與 Grad-CAM", aliases: ["顯著性圖", "saliencymap", "grad-cam"] },
  { id: "counterfactual", label: "反事實解釋", aliases: ["反事實", "counterfactual", "部分依賴圖", "pdp"] },
  { id: "fairness", label: "公平性與偏誤", aliases: ["公平性", "fairness", "偏誤", "偏見", "歧視", "統計均等", "demographicparity", "equalopportunity", "代理變數"] },
  { id: "human-oversight", label: "人為監督", aliases: ["human-in-the-loop", "human-over-the-loop", "人在迴圈", "人機協作", "人類監督", "人工複核"] },
  { id: "ai-governance", label: "AI 治理", aliases: ["治理框架", "問責", "透明性", "可追溯性", "可稽核", "稽核紀錄", "風險評估"] },
  { id: "ai-regulation", label: "AI 法規", aliases: ["人工智慧基本法", "euaiact", "歐盟ai", "金融機構運用人工智慧", "監理沙盒", "regulatorysandbox", "評測中心", "nistai"] },

  // ── 隱私與資安 ─────────────────────────────
  { id: "de-identification", label: "去識別化", aliases: ["匿名化", "假名化", "anonymization", "遮蔽", "masking", "資料泛化"] },
  { id: "k-anonymity", label: "k-匿名與 t-接近性", aliases: ["k-匿名", "k-anonymity", "t-closeness", "t-接近", "準識別"] },
  { id: "differential-privacy", label: "差分隱私", aliases: ["differentialprivacy", "隱私預算", "隨機擾動", "亂數回應"] },
  { id: "homomorphic", label: "同態加密", aliases: ["homomorphicencryption"] },
  { id: "smpc", label: "安全多方計算", aliases: ["securemulti-party", "零知識證明", "安全彙總"] },
  { id: "personal-data", label: "個人資料保護", aliases: ["個資法", "個資", "資料最小化", "刪除權", "機器遺忘"] },
  { id: "access-control", label: "存取控制與最小權限", aliases: ["最小權限", "存取控制", "權限控管", "身分驗證", "零信任"] },
  { id: "encryption-transport", label: "傳輸加密", aliases: ["tls", "ssl", "中間人攻擊", "mitm"] },
  { id: "signature-hash", label: "數位簽章與雜湊", aliases: ["數位簽章", "雜湊", "hash", "不可否認", "非對稱加密", "公開金鑰", "私有金鑰"] },
  { id: "dos-attack", label: "阻斷服務攻擊", aliases: ["ddos", "阻斷服務", "denialofservice", "mirai", "殭屍網路"] },
  { id: "defense-in-depth", label: "縱深防禦與網路分段", aliases: ["縱深防禦", "defenseindepth", "網路分段", "segmentation", "vlan"] },
  { id: "adversarial", label: "對抗性攻擊", aliases: ["adversarialattack", "對抗訓練", "成員推斷", "membershipinference", "訓練資料記憶"] },
  { id: "secure-boot-ota", label: "安全開機與 OTA", aliases: ["安全開機", "secureboot", "ota", "韌體更新", "sbom", "軟體物料清單", "cra"] },

  // ── MLOps 與系統架構 ───────────────────────
  { id: "mlops", label: "MLOps", aliases: ["模型註冊", "modelregistry", "特徵存放區", "featurestore", "版本控管", "可重現性"] },
  { id: "ci-cd", label: "CI/CD", aliases: ["持續整合", "持續部署", "continuousintegration"] },
  { id: "model-monitoring", label: "模型監控", aliases: ["監控指標", "psi", "族群穩定性", "kl散度", "告警", "基準線"] },
  { id: "drift", label: "資料漂移與概念漂移", aliases: ["資料漂移", "datadrift", "概念漂移", "conceptdrift", "分布偏離", "訓練與服務一致性", "training-servingskew"] },
  { id: "deployment-strategy", label: "漸進式部署", aliases: ["金絲雀", "canary", "藍綠部署", "blue-green", "影子模式", "shadowmode", "phasedrollout", "回滾", "rollback"] },
  { id: "ab-testing", label: "A/B 測試", aliases: ["abtest", "線上實驗"] },
  { id: "container", label: "容器與編排", aliases: ["docker", "容器", "kubernetes", "k8s", "容器化"] },
  { id: "scalability", label: "可擴展性", aliases: ["水平擴展", "scaleout", "垂直擴展", "自動伸縮", "autoscaling", "負載平衡", "loadbalanc", "scalability"] },
  { id: "latency-throughput", label: "延遲與吞吐量", aliases: ["延遲", "latency", "吞吐量", "throughput", "回應時間", "p99", "壓力測試", "負載測試"] },
  { id: "inference-mode", label: "批次與即時推論", aliases: ["批次推論", "batchinference", "即時推論", "real-timeinference", "batching"] },
  { id: "api-design", label: "API 設計", aliases: ["restfulapi", "restapi", "httppost", "webhook", "微服務", "斷路器", "circuitbreaker", "冪等"] },
  { id: "cloud-service-model", label: "雲端服務模式", aliases: ["iaas", "paas", "saas", "公有雲", "私有雲", "混合雲", "地端部署", "供應商鎖定"] },
  { id: "cost", label: "成本與投資評估", aliases: ["tco", "總持有成本", "roi", "投資報酬", "回收期", "capex", "opex", "推論成本", "隱性成本", "tokeneconomics"] },

  // ── 大數據與資料工程 ───────────────────────
  { id: "big-data-5v", label: "大數據 5V", aliases: ["volume", "velocity", "variety", "veracity", "5v特性"] },
  { id: "distributed-computing", label: "分散式運算", aliases: ["hadoop", "hdfs", "spark", "分散式訓練", "mapreduce", "rdd"] },
  { id: "etl", label: "ETL 與資料管線", aliases: ["etl", "elt", "資料管線", "datapipeline"] },
  { id: "warehouse-lake", label: "資料倉儲與資料湖", aliases: ["資料倉儲", "datawarehouse", "資料湖", "datalake"] },
  { id: "database-type", label: "資料庫選型", aliases: ["關聯式資料庫", "rdbms", "nosql", "文件型資料庫", "鍵值資料庫", "圖形資料庫", "圖資料庫", "時序資料庫", "time-seriesdatabase"] },
  { id: "acid", label: "ACID 交易特性", aliases: ["acid", "原子性", "atomicity", "隔離性", "持久性", "資料庫交易"] },
  { id: "sharding", label: "分片與水平分割", aliases: ["sharding", "分片", "水平分割"] },
  { id: "stream-processing", label: "串流處理", aliases: ["streamprocessing", "即時資料流", "批次處理"] },
  { id: "data-governance", label: "資料治理", aliases: ["datagovernance", "資料版本", "資料血緣"] },
  { id: "visualization", label: "資料視覺化", aliases: ["視覺化", "visualization", "直方圖", "histogram", "散佈圖", "scatterplot", "折線圖", "長條圖", "箱型圖", "盒鬚圖", "boxplot", "熱力圖", "heatmap", "資料密度", "tufte"] },
  { id: "pandas", label: "Pandas 與 Python 資料處理", aliases: ["pandas", "dataframe", "groupby", "fillna", "read_csv", "seaborn", "numpy"] },
  { id: "sql-nl", label: "自然語言轉查詢", aliases: ["text-to-sql", "自然語言查詢"] },

  // ── NLP 與電腦視覺 ─────────────────────────
  { id: "nlp-tasks", label: "自然語言處理任務", aliases: ["情感分析", "sentimentanalysis", "命名實體", "ner", "詞性標註", "pos", "文本分類", "機器翻譯", "摘要生成", "seq2seq", "結構化預測", "crf"] },
  { id: "tfidf", label: "TF-IDF 與 N-gram", aliases: ["tf-idf", "n-gram", "bag-of-words", "詞袋"] },
  { id: "computer-vision", label: "電腦視覺任務", aliases: ["電腦視覺", "computervision", "影像分類", "物件偵測", "objectdetection", "語義分割", "實例分割", "全景分割", "yolo", "faster r-cnn", "iou", "map指標"] },
  { id: "speech", label: "語音技術", aliases: ["語音辨識", "asr", "語音合成", "tts", "文字轉語音"] },
  { id: "ocr", label: "光學字元辨識", aliases: ["ocr", "光學字元"] },

  // ── AIoT：架構與通訊 ───────────────────────
  { id: "iot-architecture", label: "物聯網架構", aliases: ["感知層", "網路層", "應用層", "四位一體", "閘道器", "gateway", "致動器", "actuator"] },
  { id: "sensor", label: "感測器原理", aliases: ["感測器", "sensor", "熱電偶", "thermocouple", "熱敏電阻", "ntc", "ptc", "應變規", "壓電", "加速規", "陀螺儀", "電子羅盤", "超音波感測", "dht11", "pt100", "席貝克"] },
  { id: "sensor-spec", label: "感測器規格與誤差", aliases: ["靈敏度", "sensitivity", "遲滯", "hysteresis", "精度", "準度", "accuracy誤差", "系統誤差", "隨機誤差", "冷點補償"] },
  { id: "mqtt", label: "MQTT", aliases: ["broker", "發布訂閱", "publish/subscribe", "qos", "topic"] },
  { id: "coap-http", label: "CoAP 與 HTTP/WebSocket", aliases: ["coap", "websocket", "http"] },
  { id: "opc-ua", label: "OPC UA 與工業通訊", aliases: ["opcua", "mtconnect", "modbus", "sparkplug", "資訊模型", "nodeid"] },
  { id: "tcp-udp", label: "TCP 與 UDP", aliases: ["tcp", "udp", "三次握手", "osi", "傳輸層", "表達層"] },
  { id: "lpwan", label: "低功耗廣域網路", aliases: ["lpwan", "lorawan", "lora", "nb-iot", "sigfox", "低功耗廣域"] },
  { id: "short-range-wireless", label: "短距離無線通訊", aliases: ["wi-fi", "藍牙", "bluetooth", "ble", "zigbee", "thread", "matter", "nfc", "ssid"] },
  { id: "cellular", label: "行動通訊與 5G", aliases: ["5g", "4g", "redcap", "毫米波", "行動通訊"] },
  { id: "serial-bus", label: "嵌入式串列匯流排", aliases: ["i²c", "i2c", "spi", "uart", "鮑率", "baudrate", "半雙工", "全雙工", "串列通訊", "並列通訊"] },
  { id: "gpio-pwm-adc", label: "GPIO、PWM 與 ADC", aliases: ["gpio", "pwm", "責任週期", "dutycycle", "adc", "類比數位轉換", "解析度", "中斷", "interrupt", "輪詢", "polling", "浮接", "繼電器", "限流電阻"] },
  { id: "mcu-memory", label: "MCU 記憶體與資源", aliases: ["mcu", "flash", "ram", "微控制器", "韌體", "即時作業系統", "rtos"] },

  // ── AIoT：邊緣、工業與商業 ─────────────────
  { id: "edge-computing", label: "邊緣運算", aliases: ["edgecomputing", "edgeai", "邊緣推論", "邊緣部署", "霧運算"] },
  { id: "edge-ai-hardware", label: "邊緣 AI 硬體", aliases: ["npu", "tpu", "gpu加速", "tinyml", "int8", "fp32", "推論加速"] },
  { id: "industrial-systems", label: "工業資訊系統", aliases: ["plc", "scada", "mes", "erp", "hmi", "it與ot", "ot環境"] },
  { id: "predictive-maintenance", label: "預測性維護", aliases: ["predictivemaintenance", "pdm", "故障診斷", "健康預測", "非計畫停機"] },
  { id: "digital-twin", label: "數位分身", aliases: ["數位孿生", "digitaltwin"] },
  { id: "oee", label: "OEE 與產線指標", aliases: ["oee", "可用率", "稼動率", "良率", "cycletime", "throughput產出", "瓶頸", "設備綜合效率"] },
  { id: "unified-namespace", label: "統一命名空間", aliases: ["unifiednamespace", "uns"] },
  { id: "device-state", label: "裝置狀態與遙測", aliases: ["telemetry", "遙測", "期望狀態", "回報狀態", "desired", "reported", "時間戳", "utc"] },

  // ── 低程式碼與導入規劃 ─────────────────────
  { id: "no-low-code", label: "No-Code 與 Low-Code", aliases: ["no-code", "low-code", "公民開發者", "citizendeveloper", "視覺化開發"] },
  { id: "automl", label: "AutoML", aliases: ["自動化機器學習"] },
  { id: "workflow-automation", label: "工作流自動化", aliases: ["工作流", "workflow", "n8n", "zapier", "make", "dify", "流程自動化"] },
  { id: "ai-coding", label: "AI 程式輔助", aliases: ["githubcopilot", "copilot", "cursor", "vibecoding", "agenticcoding", "claudecode", "程式碼輔助"] },
  { id: "adoption-planning", label: "AI 導入規劃", aliases: ["概念驗證", "poc", "mvp", "導入目標", "業務痛點", "跨部門協作", "驗收標準", "試辦"] },
];

/**
 * 每個概念預先編好兩組比對器：
 * - `ascii`：純英數別名，以詞邊界比對（前後不得緊鄰英數字元）。中文緊鄰不算邊界內，
 *   因此「使用RAG技術」仍會命中。
 * - `cjk`：含中文的別名，以去空白後的字串直接包含比對（中文沒有詞邊界可用）。
 */
const matchTable = concepts.map((entry) => {
  const aliases = [entry.label, ...entry.aliases]
    .map(normalizeForMatch)
    .filter((alias) => alias.replace(/\s+/g, "").length >= 2);
  return {
    entry,
    ascii: aliases
      .filter(isAscii)
      .map((alias) => new RegExp(`(?<![a-z0-9])${escapeRegExp(alias)}(?![a-z0-9])`)),
    cjk: aliases.filter((alias) => !isAscii(alias)).map((alias) => alias.replace(/\s+/g, "")),
  };
});

/**
 * 一題命中的概念。比對對象為**概念字串 ＋ 題幹**——原題庫沒有 `meta.concepts`，
 * 只能靠題幹；新題庫兩者都看。選項文字刻意不納入：干擾選項常常提到別的概念，
 * 把它算成本題考點會讓弱點分析失準。
 */
export const conceptsOf = (question: Question): ConceptEntry[] => {
  // 比對範圍：命題標註的概念、題幹，以及**正解選項**。
  // 「下列何者最適合？」這種題型的考點名稱只出現在正解裡（例如「蒙地卡羅方法」），
  // 不看正解就整批漏掉。錯誤選項刻意排除——干擾項常提到別的概念，
  // 算進來會讓弱點分析被稀釋。
  const answerText = question.choices.find((choice) => choice.id === question.answer)?.text ?? "";
  const haystack = normalizeForMatch(
    `${(question.meta?.concepts ?? []).join(" | ")} | ${question.prompt} | ${answerText}`,
  );
  const tight = haystack.replace(/\s+/g, "");
  // 英文別名同時比對兩種寫法：原樣（「cross validation」）與把英數之間的空白接起來
  // （「crossvalidation」）。詞彙表兩種寫法都有人寫，且兩者都仍受詞邊界保護——
  // 接合只發生在英數之間，`storage` 這種單一字詞不受影響，因此不會回到子字串誤命中。
  const joined = haystack.replace(/(?<=[a-z0-9]) (?=[a-z0-9])/g, "");
  return matchTable
    .filter(({ ascii, cjk }) =>
      ascii.some((pattern) => pattern.test(haystack) || pattern.test(joined))
      || cjk.some((alias) => tight.includes(alias)))
    .map(({ entry }) => entry);
};

export const conceptById = (id: string): ConceptEntry | undefined =>
  concepts.find((entry) => entry.id === id);
