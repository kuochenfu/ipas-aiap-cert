import type { Question } from "../types";

export const generated: Question[] = [
  {
    id: "junior-ai-basics-gen-q001",
    subjectId: "junior-ai-basics",
    prompt:
      "在資料前處理階段，若數值特徵中有少量缺失值（Missing Values），且該特徵近似常態分布、缺失屬隨機發生，下列何者為較常見且合適的填補（Imputation）做法？",
    choices: [
      { id: "A", text: "直接刪除整個特徵欄位，以免影響模型" },
      { id: "B", text: "以該特徵的平均數或中位數填補缺失值" },
      { id: "C", text: "將缺失值一律填為 0，使資料完整" },
      { id: "D", text: "以隨機亂數填補，以增加資料多樣性" },
    ],
    answer: "B",
    explanation:
      "對隨機缺失且近似常態的數值特徵，以平均數或中位數填補（B）能在不大幅扭曲分布下保留樣本。整欄刪除（A）會損失資訊、一律填 0（C）會引入偏誤、隨機亂數（D）會破壞資料結構。",
    topic: "資料處理",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q002",
    subjectId: "junior-ai-basics",
    prompt:
      "監督式學習（Supervised Learning）與非監督式學習（Unsupervised Learning）最關鍵的差異為下列何者？",
    choices: [
      { id: "A", text: "監督式學習使用神經網路，非監督式學習只能使用統計方法" },
      { id: "B", text: "監督式學習訓練時使用帶有目標標籤的資料，非監督式學習則不使用標籤" },
      { id: "C", text: "監督式學習只能做分類，非監督式學習只能做迴歸" },
      { id: "D", text: "監督式學習不需要訓練資料，非監督式學習需要大量訓練資料" },
    ],
    answer: "B",
    explanation:
      "兩者最關鍵差異在於是否使用帶標籤資料：監督式學習以已標註的輸入—目標對應進行訓練，非監督式學習則不依賴標籤、著重發掘資料內在結構（B）。A、C、D 對演算法、任務型態與是否需資料的描述皆不正確。",
    topic: "機器學習基礎",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q003",
    subjectId: "junior-ai-basics",
    prompt:
      "在神經網路中，隱藏層常使用 ReLU（Rectified Linear Unit）作為啟動函數（Activation Function），其主要優點為下列何者？",
    choices: [
      { id: "A", text: "輸出永遠介於 0 與 1 之間，可直接作為機率" },
      { id: "B", text: "計算簡單，且能緩解深層網路中的梯度消失問題" },
      { id: "C", text: "能將多類別輸出轉換為總和為 1 的機率分布" },
      { id: "D", text: "對所有輸入皆輸出固定常數，使訓練更穩定" },
    ],
    answer: "B",
    explanation:
      "ReLU 在正區間梯度為常數 1、計算簡單，能緩解深層網路的梯度消失問題（B）。輸出介於 0~1 是 Sigmoid（A）、轉為總和為 1 的機率分布是 Softmax（C）；D 描述與啟動函數的非線性作用不符。",
    topic: "深度學習",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q004",
    subjectId: "junior-ai-basics",
    prompt:
      "在二元分類問題中，混淆矩陣（Confusion Matrix）顯示：真陽性（TP）=40、偽陽性（FP）=10、偽陰性（FN）=20、真陰性（TN）=30。此模型的精準率（Precision）為何？",
    choices: [
      { id: "A", text: "0.67" },
      { id: "B", text: "0.80" },
      { id: "C", text: "0.57" },
      { id: "D", text: "0.40" },
    ],
    answer: "B",
    explanation:
      "精準率 = TP /（TP + FP）= 40 /（40 + 10）= 0.80（B）。0.67 為召回率 TP/(TP+FN)=40/60；其餘選項與精準率公式不符。",
    topic: "評估指標",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q005",
    subjectId: "junior-ai-basics",
    prompt:
      "某模型在訓練資料上表現極佳，但在未見過的測試資料上表現明顯下降，此現象稱為下列何者？",
    choices: [
      { id: "A", text: "欠擬合（Underfitting）" },
      { id: "B", text: "過擬合（Overfitting）" },
      { id: "C", text: "資料洩漏（Data Leakage）" },
      { id: "D", text: "梯度爆炸（Gradient Explosion）" },
    ],
    answer: "B",
    explanation:
      "訓練表現好、測試表現差，代表模型過度記憶訓練資料的細節與雜訊而泛化不足，即過擬合（Overfitting，B）。欠擬合是訓練本身就差；資料洩漏是測試資訊滲入訓練；梯度爆炸是訓練不穩定，皆非此描述。",
    topic: "機器學習基礎",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q006",
    subjectId: "junior-ai-basics",
    prompt:
      "在生成式 AI 的提示工程（Prompt Engineering）中，「少樣本提示（Few-shot Prompting）」指的是下列何者？",
    choices: [
      { id: "A", text: "在提示中提供少量範例，引導模型依範例格式或邏輯產生回應" },
      { id: "B", text: "使用極少的訓練資料重新訓練整個語言模型" },
      { id: "C", text: "限制模型只能輸出極短的回應內容" },
      { id: "D", text: "讓模型在不提供任何說明或範例下直接作答" },
    ],
    answer: "A",
    explanation:
      "少樣本提示是在提示中提供少量示範範例，讓模型依範例的格式或邏輯產生回應（A），屬推論時的提示技巧而非重新訓練。B 是重訓、D 為零樣本（zero-shot）、C 與少樣本概念無關。",
    topic: "生成式AI",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q007",
    subjectId: "junior-ai-basics",
    prompt:
      "檢索增強生成（Retrieval-Augmented Generation, RAG）導入企業知識問答系統時，最主要的效益為下列何者？",
    choices: [
      { id: "A", text: "完全免除大型語言模型的運算需求" },
      { id: "B", text: "讓模型先檢索外部知識文件再生成回應，以提升答案正確性並降低幻覺" },
      { id: "C", text: "將語言模型轉換為決策樹以提升可解釋性" },
      { id: "D", text: "使模型不需任何提示即可自動學習新知識" },
    ],
    answer: "B",
    explanation:
      "RAG 先從外部知識庫檢索相關文件，再以之為依據生成回應，可提升答案正確性並降低模型幻覺（hallucination）（B）。它仍需 LLM 運算（A 錯）、不會轉成決策樹（C 錯），也非自動學習新知識（D 錯）。",
    topic: "生成式AI",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q008",
    subjectId: "junior-ai-basics",
    prompt:
      "K 平均演算法（K-means）屬於下列哪一種機器學習方法，且其主要目的為何？",
    choices: [
      { id: "A", text: "監督式學習，用於預測連續數值" },
      { id: "B", text: "非監督式學習，將資料依相似性分為 K 個群集" },
      { id: "C", text: "強化式學習，依獎勵調整分群策略" },
      { id: "D", text: "監督式學習，依已知標籤訓練分類邊界" },
    ],
    answer: "B",
    explanation:
      "K-means 屬非監督式學習的分群（clustering）方法，不使用標籤，將資料依相似性（距離）劃分為 K 個群集（B）。它非迴歸、非強化式學習，也不依賴已知標籤訓練分類邊界。",
    topic: "機器學習基礎",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q009",
    subjectId: "junior-ai-basics",
    prompt:
      "在迴歸任務中，下列哪一個評估指標的數值越接近 1，通常代表模型對資料變異的解釋能力越好？",
    choices: [
      { id: "A", text: "均方誤差（MSE）" },
      { id: "B", text: "平均絕對誤差（MAE）" },
      { id: "C", text: "判定係數（R², Coefficient of Determination）" },
      { id: "D", text: "交叉熵損失（Cross-Entropy Loss）" },
    ],
    answer: "C",
    explanation:
      "判定係數 R² 衡量模型對目標變異的解釋比例，越接近 1 解釋能力越好（C）。MSE、MAE 為誤差越小越好且無上限為 1 的特性；交叉熵用於分類任務，皆不符。",
    topic: "評估指標",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q010",
    subjectId: "junior-ai-basics",
    prompt:
      "企業在導入 AI 系統時，為落實負責任 AI（Responsible AI）與治理，下列哪一項做法最為適當？",
    choices: [
      { id: "A", text: "為追求效能，盡量避免揭露模型用途與限制，以保護商業機密" },
      { id: "B", text: "建立資料治理、模型風險評估與人為監督機制，並兼顧公平性與透明度" },
      { id: "C", text: "完全交由 AI 自動決策，移除所有人為介入以提升效率" },
      { id: "D", text: "僅關注模型準確率，無需考量偏見或個資保護議題" },
    ],
    answer: "B",
    explanation:
      "負責任 AI 治理應建立資料治理、模型風險評估與人為監督機制，並兼顧公平性、透明度與個資保護（B）。隱匿用途與限制（A）、移除人為介入（C）、僅看準確率而忽略偏見與個資（D）皆違反 AI 治理原則。",
    topic: "AI治理",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q011",
    subjectId: "junior-ai-basics",
    prompt:
      "對類別型特徵（如「血型」：A/B/O/AB）進行編碼時，若該類別之間並無大小或順序關係，下列哪一種編碼方式最適合？",
    choices: [
      { id: "A", text: "序數編碼（Ordinal Encoding）" },
      { id: "B", text: "One-hot 編碼（One-hot Encoding）" },
      { id: "C", text: "對數轉換（Log Transformation）" },
      { id: "D", text: "標準化（Standardization）" },
    ],
    answer: "B",
    explanation:
      "無序類別特徵應使用 One-hot 編碼（B），為每個類別建立獨立的二元欄位，避免引入虛假的大小或順序關係。序數編碼（A）會強加順序；對數轉換與標準化（C、D）用於數值特徵，皆不適合。",
    topic: "資料處理",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q012",
    subjectId: "junior-ai-basics",
    prompt:
      "Transformer 架構之所以能有效處理序列資料並大幅平行化運算，主要歸功於下列哪一項核心機制？",
    choices: [
      { id: "A", text: "卷積層（Convolution Layer）" },
      { id: "B", text: "自注意力機制（Self-Attention Mechanism）" },
      { id: "C", text: "循環連接（Recurrent Connection）" },
      { id: "D", text: "池化層（Pooling Layer）" },
    ],
    answer: "B",
    explanation:
      "Transformer 的核心是自注意力機制（Self-Attention，B），可直接建模序列中任意位置間的關聯且利於平行化，克服 RNN 必須逐步處理的限制。卷積層、循環連接、池化層皆非 Transformer 的核心機制。",
    topic: "深度學習",
    difficulty: "中",
    source: "generated",
  },
];
