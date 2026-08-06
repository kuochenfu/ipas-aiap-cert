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
    topic: "資料處理與分析概念",
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
    topic: "機器學習概念",
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
    topic: "機器學習概念",
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
    topic: "機器學習概念",
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
    topic: "機器學習概念",
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
    topic: "鑑別式 AI 與生成式 AI 概念",
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
    topic: "鑑別式 AI 與生成式 AI 概念",
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
    topic: "機器學習概念",
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
    topic: "機器學習概念",
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
    topic: "人工智慧概念",
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
    topic: "資料處理與分析概念",
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
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q013",
    subjectId: "junior-ai-basics",
    prompt: "下列關於「過擬合（Overfitting）」的敘述，何者最正確？",
    choices: [
      { id: "A", text: "模型在訓練與測試資料上表現都很差" },
      { id: "B", text: "模型完全無法從訓練資料學到任何規律" },
      { id: "C", text: "訓練資料量越大一定會造成過擬合" },
      { id: "D", text: "模型在訓練資料表現很好，但在未見過的測試資料表現明顯變差" },
    ],
    answer: "D",
    explanation:
      "過擬合是模型過度記憶訓練資料的細節與雜訊，導致在訓練集表現好、對未見資料（測試集）泛化差（D）。兩者都差是欠擬合（A）；完全學不到是欠擬合或訓練失敗（B）；資料量越大通常反而緩解過擬合（C）。",
    topic: "機器學習概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q014",
    subjectId: "junior-ai-basics",
    prompt:
      "下列關於「人工智慧（AI）、機器學習（ML）、深度學習（DL）」三者範圍關係的敘述，何者最正確？",
    choices: [
      { id: "A", text: "三者互不相關，是各自獨立的技術領域" },
      { id: "B", text: "深度學習涵蓋機器學習，機器學習又涵蓋人工智慧" },
      { id: "C", text: "深度學習是機器學習的一個子集，機器學習又是人工智慧的一個子集" },
      { id: "D", text: "人工智慧只能透過深度學習實現，沒有其他方法" },
    ],
    answer: "C",
    explanation:
      "範圍由大到小為人工智慧 ⊃ 機器學習 ⊃ 深度學習，故深度學習是機器學習的子集、機器學習是人工智慧的子集（C）。三者並非互不相關（A），包含關係方向與 B 相反；人工智慧也包含規則式等非深度學習方法（D 錯）。",
    topic: "人工智慧概念",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q015",
    subjectId: "junior-ai-basics",
    prompt: "下列關於「鑑別式模型（Discriminative）與生成式模型（Generative）」的敘述，何者最正確？",
    choices: [
      { id: "A", text: "鑑別式模型著重學習資料的類別邊界以做分類或預測，生成式模型則學習資料分布以產生新樣本" },
      { id: "B", text: "鑑別式模型只能用於影像，生成式模型只能用於文字" },
      { id: "C", text: "生成式模型無法用於任何分類任務" },
      { id: "D", text: "鑑別式模型一定比生成式模型準確" },
    ],
    answer: "A",
    explanation:
      "鑑別式模型聚焦學習區分類別的決策邊界（如分類器），生成式模型則學習資料的分布以生成新樣本（A）。兩者皆不限定資料型態（B 錯）；生成式模型亦可用於分類等任務（C 錯）；準確度視任務與資料而定，無絕對高低（D 錯）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q016",
    subjectId: "junior-ai-basics",
    prompt:
      "在資料分析的敘述統計中，當資料分布明顯偏斜（含極端離群值）時，下列哪一個指標較能穩健代表資料的「集中趨勢」？",
    choices: [
      { id: "A", text: "平均數（Mean）" },
      { id: "B", text: "中位數（Median）" },
      { id: "C", text: "全距（Range）" },
      { id: "D", text: "標準差（Standard Deviation）" },
    ],
    answer: "B",
    explanation:
      "中位數以排序後的中間值表示集中趨勢，對極端離群值不敏感，較為穩健（B）。平均數易被離群值拉動（A）；全距與標準差衡量的是離散程度而非集中趨勢（C、D）。",
    topic: "資料處理與分析概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q017",
    subjectId: "junior-ai-basics",
    prompt: "強化式學習（Reinforcement Learning）的核心運作機制最符合下列哪一項描述？",
    choices: [
      { id: "A", text: "以大量帶標籤的輸入—輸出對直接訓練模型" },
      { id: "B", text: "在無任何回饋下單純發掘資料的群集結構" },
      { id: "C", text: "代理人（Agent）與環境互動，依獲得的獎勵訊號學習較佳的行動策略" },
      { id: "D", text: "將連續數值轉換為類別標籤以利分類" },
    ],
    answer: "C",
    explanation:
      "強化式學習透過代理人與環境互動，依行動所得的獎勵（reward）訊號逐步學習能最大化長期回報的策略（C）。帶標籤直接訓練是監督式（A）；無回饋找群集是非監督式（B）；D 為資料轉換，皆非強化式學習的核心。",
    topic: "機器學習概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q018",
    subjectId: "junior-ai-basics",
    prompt:
      "生成對抗網路（GAN）由兩個相互競爭的網路組成，下列關於其組成與運作的敘述，何者最正確？",
    choices: [
      { id: "A", text: "兩個網路皆只負責生成樣本，彼此不互相評估" },
      { id: "B", text: "GAN 只能用於監督式分類，無法生成新資料" },
      { id: "C", text: "生成器負責分類，判別器負責迴歸預測" },
      { id: "D", text: "生成器（Generator）負責產生假樣本，判別器（Discriminator）負責分辨真假，兩者對抗訓練" },
    ],
    answer: "D",
    explanation:
      "GAN 中生成器產生擬真的假樣本，判別器嘗試分辨真假，兩者在對抗中互相提升（D）。並非皆只生成且不互評（A）；GAN 的目的正是生成新資料（B 錯）；生成器與判別器的職責與 C 描述相反。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q019",
    subjectId: "junior-ai-basics",
    prompt:
      "企業在蒐集與使用含個人資料的訓練資料時，為兼顧法規遵循與隱私保護，下列哪一項做法最為適當？",
    choices: [
      { id: "A", text: "盡量蒐集越多個資越好，且無須告知當事人用途" },
      { id: "B", text: "依目的蒐集必要的最少資料，並落實去識別化與當事人權利保障" },
      { id: "C", text: "只要資料用於 AI 訓練，即可不受任何個資規範限制" },
      { id: "D", text: "將個資公開於網路以提升模型透明度" },
    ],
    answer: "B",
    explanation:
      "個資處理應符合目的明確與最小化原則，僅蒐集必要資料，並透過去識別化與保障當事人權利來降低風險（B）。過度蒐集且不告知（A）、誤認 AI 訓練可豁免規範（C）、公開個資（D）都違反隱私保護與法規精神。",
    topic: "人工智慧概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q020",
    subjectId: "junior-ai-basics",
    prompt:
      "對數值特徵進行「標準化（Standardization，如 Z-score）」的主要目的為下列何者？",
    choices: [
      { id: "A", text: "刪除資料中所有的離群值" },
      { id: "B", text: "把連續數值直接轉換為類別標籤" },
      { id: "C", text: "將不同尺度的特徵調整到可比較的範圍，避免大尺度特徵主導模型" },
      { id: "D", text: "為缺失值自動填補合理數值" },
    ],
    answer: "C",
    explanation:
      "標準化將特徵轉為相近尺度（如均值 0、標準差 1），避免量級較大的特徵在距離或梯度計算中主導模型（C）。它不做類別轉換（B）、不直接刪除離群值（A），也非缺失值填補（D）。",
    topic: "資料處理與分析概念",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q021",
    subjectId: "junior-ai-basics",
    prompt:
      "在類別不平衡（如詐騙偵測中正樣本極少）的分類問題中，下列哪一項評估指標若單獨使用最容易產生誤導？",
    choices: [
      { id: "A", text: "準確率（Accuracy）" },
      { id: "B", text: "召回率（Recall）" },
      { id: "C", text: "F1 分數（F1-score）" },
      { id: "D", text: "精準率（Precision）" },
    ],
    answer: "A",
    explanation:
      "在嚴重不平衡時，模型只要全部預測為多數類別也能有很高的準確率，故單看準確率最易誤導（A）。召回率、精準率與兼顧兩者的 F1 分數較能反映對少數類別的辨識能力（B、C、D）。",
    topic: "機器學習概念",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q022",
    subjectId: "junior-ai-basics",
    prompt: "大型語言模型（LLM）出現「幻覺（Hallucination）」一詞，最符合下列哪一項描述？",
    choices: [
      { id: "A", text: "模型只會逐字重複使用者輸入的內容" },
      { id: "B", text: "模型因記憶體不足而完全停止回應" },
      { id: "C", text: "模型產生看似流暢合理、但與事實不符或無依據的內容" },
      { id: "D", text: "模型能完美無誤地回答所有問題" },
    ],
    answer: "C",
    explanation:
      "幻覺指 LLM 生成語句通順但與事實不符或缺乏依據的內容（C）。它與記憶體不足當機（B）、單純複述輸入（A）無關，更不代表模型全知全能（D）；理解幻覺有助於導入驗證與 RAG 等緩解措施。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q023",
    subjectId: "junior-ai-basics",
    prompt:
      "在切分資料以評估模型泛化能力時，使用「訓練集／驗證集／測試集」劃分的主要目的為下列何者？",
    choices: [
      { id: "A", text: "讓模型可重複看到測試集以加速收斂" },
      { id: "B", text: "以訓練集學習、驗證集調參與選模、測試集做最終且未受訓練影響的成效評估" },
      { id: "C", text: "三組資料皆用於訓練以增加資料量" },
      { id: "D", text: "刪除部分資料以縮短訓練時間" },
    ],
    answer: "B",
    explanation:
      "標準做法是以訓練集學習、驗證集進行調參與模型選擇，測試集則保留作最終且不受訓練干擾的泛化評估（B）。讓模型看到測試集會造成資料洩漏（A）；三組都拿來訓練（C）或單純刪資料（D）都失去獨立評估的意義。",
    topic: "機器學習概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q024",
    subjectId: "junior-ai-basics",
    prompt: "資料視覺化（Data Visualization）在資料分析流程中的主要價值，最符合下列哪一項描述？",
    choices: [
      { id: "A", text: "以圖表呈現資料分布與關聯，協助理解資料並發現趨勢或異常" },
      { id: "B", text: "可完全取代統計分析與建模，無須再計算任何指標" },
      { id: "C", text: "圖表越華麗越好，內容正確與否並不重要" },
      { id: "D", text: "視覺化僅供報告美觀，對資料探索沒有實質幫助" },
    ],
    answer: "A",
    explanation:
      "視覺化透過圖表直觀呈現分布、關聯與變化，協助探索資料、發現趨勢與異常並輔助溝通（A）。它輔助而非取代統計與建模（B）；應以正確傳達資訊為先而非僅求華麗（C）；對資料探索具實質價值（D 錯）。",
    topic: "資料處理與分析概念",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-ai-basics-gen-q025",
    subjectId: "junior-ai-basics",
    prompt:
      "關於「鑑別式模型」與「生成式模型」的關係，下列敘述何者最為正確？",
    choices: [
      { id: "A", text: "兩者是涵蓋所有 AI 的兩個互斥箱子，任一模型只能屬於其中之一" },
      { id: "B", text: "鑑別式模型一定比生成式模型先進，已完全取代生成式模型" },
      { id: "C", text: "它們描述的是建模方向；同一個 Transformer 可被用來生成，也可被用來分類、排序或評分" },
      { id: "D", text: "生成式模型無法用於分類，只能產生圖片或文字" },
    ],
    answer: "C",
    explanation:
      "鑑別式（判斷 x 對應哪個 y）與生成式（在條件下產生下一個合理內容）描述的是建模方向，並非互斥的分類箱；同一個 Transformer 可被用於生成、分類、排序或評分（C）。因此 A 的「互斥」說法錯誤；兩者是不同用途而非誰取代誰（B）；生成式模型底層以生成 token 運作，仍可輸出固定分類標籤（D 錯）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §01 觀念重整",
  },
  {
    id: "junior-ai-basics-gen-q026",
    subjectId: "junior-ai-basics",
    prompt:
      "把「模型」與「AI 系統／Agent」視為不同分類層級時，下列對應何者最正確？",
    choices: [
      { id: "A", text: "模型回答「怎麼計算」，系統回答「如何完成任務」；Agent 是上層編排而非另一種神經網路" },
      { id: "B", text: "Agent 就是一種比 LLM 更大的神經網路模型" },
      { id: "C", text: "系統與模型是同義詞，區分它們沒有實務意義" },
      { id: "D", text: "只要模型能力夠強，就不需要工具、記憶、Guardrails 或人工監督" },
    ],
    answer: "A",
    explanation:
      "模型層回答「怎麼計算」（輸入到輸出的映射），系統／Agent 層回答「如何完成任務」；Agent 是上層編排，可呼叫多種模型與非 AI 工具，而不是另一種神經網路（A）。因此 B、C 混淆了層級；現代 Agent 系統仍需 Context、記憶/狀態、工具、Guardrails、Evals 與人工監督，並非模型夠強就不用（D 錯）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §01 觀念重整",
  },
  {
    id: "junior-ai-basics-gen-q027",
    subjectId: "junior-ai-basics",
    prompt:
      "大型語言模型（LLM）的核心運作是「依上下文預測下一個 token」。下列何者最屬於其典型風險？",
    choices: [
      { id: "A", text: "完全不會出錯，輸出必定符合最新事實" },
      { id: "B", text: "幻覺、提示注入與知識過時" },
      { id: "C", text: "只能處理數字，無法處理自然語言" },
      { id: "D", text: "一定需要連網才能輸出任何 token" },
    ],
    answer: "B",
    explanation:
      "LLM 依上下文預測 token 來完成語言與程式任務，典型風險是幻覺（自信產生缺乏根據的內容）、提示注入與知識過時（B）。它並非不會出錯（A）；LLM 專長正是自然語言（C）；是否連網屬部署選擇，與能否產生 token 無關（D 錯）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "2025-2026補充講義 §02 技術版圖",
  },
  {
    id: "junior-ai-basics-gen-q028",
    subjectId: "junior-ai-basics",
    prompt:
      "所謂「推理模型（Reasoning model）」與一般語言模型相比，最主要的差異是什麼？",
    choices: [
      { id: "A", text: "推論時計算越多就一定不會推理錯誤" },
      { id: "B", text: "完全不需要訓練資料，靠規則即可運作" },
      { id: "C", text: "在推論時投入較多計算以處理多步問題，通常伴隨延遲與成本上升" },
      { id: "D", text: "只能用於圖片生成，不能用於數學或程式" },
    ],
    answer: "C",
    explanation:
      "推理模型的特徵是在推論（回答）時投入較多計算來處理多步問題，適用數學、程式、研究與複雜決策，但通常伴隨延遲與成本上升（C）。它仍是資料訓練出來的模型（B 錯）；投入更多計算並不保證不會推理錯誤（A 錯）；其用途偏向多步推理任務而非只做圖片生成（D 錯）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §02 技術版圖",
  },
  {
    id: "junior-ai-basics-gen-q029",
    subjectId: "junior-ai-basics",
    prompt:
      "「多模態模型（Multimodal model）」最貼切的描述是下列何者？",
    choices: [
      { id: "A", text: "只能處理單一種資料型態的模型" },
      { id: "B", text: "能共同理解或生成文字、影像、音訊、影片等多種模態的模型" },
      { id: "C", text: "把多個小模型放在同一台伺服器上就稱為多模態" },
      { id: "D", text: "一定沒有隱私或跨模態誤判的風險" },
    ],
    answer: "B",
    explanation:
      "多模態模型能共同理解或生成文字、影像、音訊、影片等多種模態，適用菜單理解、文件解析與視覺助理等（B）。單一型態（A）與「多個模型放同台機器」（C）都不是多模態的定義；多模態仍有跨模態誤判、隱私與感知限制等風險（D 錯）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "2025-2026補充講義 §02 技術版圖 / 附錄A",
  },
  {
    id: "junior-ai-basics-gen-q030",
    subjectId: "junior-ai-basics",
    prompt:
      "現代大型模型的訓練流程，已不只是「大量資料＋反向傳播」。下列對各階段的描述何者正確？",
    choices: [
      { id: "A", text: "蒸餾與量化會提高推論成本，不利於本地或邊緣部署" },
      { id: "B", text: "預訓練的目的是逐一背下每筆訓練資料的標準答案" },
      { id: "C", text: "偏好對齊與強化學習的目的是讓輸出更不符合人類偏好" },
      { id: "D", text: "監督式微調（SFT）是用高品質任務範例調整模型行為" },
    ],
    answer: "D",
    explanation:
      "SFT（監督式微調）是以高品質任務範例調整模型行為（D）。預訓練是從大規模資料學習通用表示與生成能力，而非逐筆背答案（B 錯）；偏好對齊與強化學習是讓輸出「更」符合人類或驗證器偏好（C 反了）；蒸餾、量化與稀疏化是「降低」推論成本、支援本地與邊緣部署（A 反了）。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §02 技術版圖",
  },
  {
    id: "junior-ai-basics-gen-q031",
    subjectId: "junior-ai-basics",
    prompt:
      "詞彙「基礎模型（Foundation model）」指的是下列何者？",
    choices: [
      { id: "A", text: "只能完成單一特定任務、無法遷移的小型模型" },
      { id: "B", text: "專指負責檢索排序的 reranker" },
      { id: "C", text: "不需資料、僅靠人工規則運作的專家系統" },
      { id: "D", text: "可支援多種下游任務的大規模預訓練模型" },
    ],
    answer: "D",
    explanation:
      "基礎模型是可支援多種下游任務的大規模預訓練模型（D），現代 AI 應用常以它為核心，再接上 RAG、工具與 Agent。單一任務小型模型（A）、純規則專家系統（C）、僅做排序的 reranker（B）都不是基礎模型的定義。",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "2025-2026補充講義 附錄A 核心詞彙",
  },
  {
    id: "junior-ai-basics-gen-q032",
    subjectId: "junior-ai-basics",
    prompt:
      "在生成式 AI 的可靠性議題中，「模型崩潰（Model collapse）」較常與下列哪一種情況相關？",
    choices: [
      { id: "A", text: "反覆使用低品質合成資料訓練，導致能力或多樣性退化" },
      { id: "B", text: "模型參數量太大導致伺服器當機" },
      { id: "C", text: "使用者輸入的問題太長，超過畫面顯示範圍" },
      { id: "D", text: "只要有標註人類資料就一定會發生的必然現象" },
    ],
    answer: "A",
    explanation:
      "模型崩潰指反覆以低品質合成資料訓練，使模型能力或輸出多樣性逐漸退化（A）；典型控制包括標記來源、保留人類資料、品質篩選與獨立驗證。它與伺服器當機（B）、輸入過長（C）無關；保留人類資料與獨立驗證正是避免它的方法，並非必然發生（D 錯）。（傳統教材的「模式崩潰」多指 GAN 訓練問題，兩者需區分。）",
    topic: "鑑別式 AI 與生成式 AI 概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "2025-2026補充講義 §06 可靠性 / §10 考點對照",
  },
];
