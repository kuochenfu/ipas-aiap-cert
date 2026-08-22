import type { Question } from "../types";

// 依評鑑內容節點分批撰寫；配額見 src/domain/assessmentTopics.ts。
// 內容為 LLM 產出，正確性需人工複審。
export const practiceQuestions: Question[] = [
  // ── L23101 機率／統計之機器學習基礎應用（9 題）────────────────
  {
    id: "senior-ml-practice-q001",
    subjectId: "senior-ml",
    prompt:
      "貝氏定理 P(A|B) = P(B|A)P(A) / P(B) 中，P(A) 通常稱為下列何者？",
    choices: [
      { id: "A", text: "先驗機率（Prior）" },
      { id: "B", text: "後驗機率（Posterior）" },
      { id: "C", text: "概似度（Likelihood）" },
      { id: "D", text: "邊際機率的倒數" },
    ],
    answer: "A",
    explanation:
      "P(A) 是在看到證據 B 之前對 A 的信念，稱為先驗；P(A|B) 是看到證據後更新的信念，稱為後驗；P(B|A) 則是概似度。貝氏定理描述的正是「先驗如何被證據更新成後驗」。",
    choiceExplanations: {
      B: "後驗是 P(A|B)，也就是等式左邊、已納入證據之後的機率。",
      C: "概似度是 P(B|A)，衡量在 A 成立時觀察到 B 的可能性。",
      D: "P(B) 是分母的邊際機率（證據），P(A) 與它的倒數沒有關係。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["貝氏定理", "先驗機率", "後驗機率"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若題目改問「等式左邊的 P(A|B)」，答案就變成後驗——同一個公式裡的四個量各有名稱，看的是問哪一項。",
    },
  },
  {
    id: "senior-ml-practice-q002",
    subjectId: "senior-ml",
    prompt:
      "某疾病盛行率為 1%，篩檢的敏感度 99%、特異度 95%。若某人檢驗陽性，其實際患病的機率約為下列何者？",
    choices: [
      { id: "A", text: "約 50%" },
      { id: "B", text: "約 99%" },
      { id: "C", text: "約 95%" },
      { id: "D", text: "約 17%" },
    ],
    answer: "D",
    explanation:
      "以一萬人計：患病 100 人中檢出 99 人；健康 9900 人中偽陽性約 495 人。陽性總數約 594，真患病者佔 99/594 ≈ 16.7%。盛行率低時，即使檢驗很準，陽性預測值仍偏低。",
    choiceExplanations: {
      A: "50% 高估了；在 1% 盛行率下偽陽性人數遠多於真陽性。",
      B: "99% 是敏感度（患病者被檢出的比例），與「陽性者實際患病的機率」是兩個不同的條件機率。",
      C: "95% 是特異度（健康者被正確排除的比例），同樣不是陽性預測值。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["陽性預測值", "盛行率", "貝氏推論"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Terminology Swap",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若盛行率從 1% 提高到 20%，同一套敏感度與特異度下的陽性預測值會躍升到八成以上——盛行率才是主導這個數字的因素。",
    },
  },
  {
    id: "senior-ml-practice-q003",
    subjectId: "senior-ml",
    prompt:
      "單純貝氏分類器（Naive Bayes）的「單純（Naive）」指的是下列哪一項假設？",
    choices: [
      { id: "A", text: "資料必定服從常態分布" },
      { id: "B", text: "所有類別的出現機率相同" },
      { id: "C", text: "給定類別下，各特徵之間互相獨立" },
      { id: "D", text: "特徵數量必須少於樣本數" },
    ],
    answer: "C",
    explanation:
      "條件獨立假設讓聯合機率可以拆成各特徵機率的乘積，大幅簡化計算。此假設在真實資料中常不成立，但模型在文本分類等任務上仍表現不俗。",
    choiceExplanations: {
      A: "高斯單純貝氏才假設連續特徵為常態，多項式與伯努利版本並不需要。",
      B: "各類別的先驗機率可以不同，實作上通常直接由訓練資料估計。",
      D: "特徵數與樣本數的關係不是此模型的核心假設。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["單純貝氏", "條件獨立假設"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若特徵之間高度相關（例如同義詞反覆出現），獨立假設被嚴重違反，機率會被重複計算而過度自信。",
    },
  },
  {
    id: "senior-ml-practice-q004",
    subjectId: "senior-ml",
    prompt:
      "最大概似估計（MLE）的目標是下列何者？",
    choices: [
      { id: "A", text: "找出使先驗機率最大的參數值" },
      { id: "B", text: "找出使觀察到的資料出現機率最大的參數值" },
      { id: "C", text: "使模型參數的數量最少" },
      { id: "D", text: "使訓練時間最短" },
    ],
    answer: "B",
    explanation:
      "MLE 把參數當成未知的固定值，選擇讓手上這批資料最有可能被觀察到的那組參數。它與貝氏方法的差別在於不引入先驗分布。",
    choiceExplanations: {
      A: "只看先驗而不看資料並非估計方法；結合先驗與概似的是最大後驗估計（MAP）。",
      C: "參數數量的取捨屬於模型選擇與正則化的議題，不是 MLE 的目標。",
      D: "訓練時間是計算成本，與估計準則無關。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["最大概似估計", "參數估計"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若樣本極少而先驗知識可靠，改用最大後驗估計（MAP）納入先驗，通常比純 MLE 穩定得多。",
    },
  },
  {
    id: "senior-ml-practice-q005",
    subjectId: "senior-ml",
    prompt:
      "在分類問題中使用交叉熵（Cross-Entropy）作為損失函數，其直觀意義是下列何者？",
    choices: [
      { id: "A", text: "衡量模型參數的個數" },
      { id: "B", text: "衡量模型預測的機率分布與真實標籤分布之間的差距" },
      { id: "C", text: "衡量特徵之間的相關程度" },
      { id: "D", text: "衡量訓練樣本的數量" },
    ],
    answer: "B",
    explanation:
      "交叉熵在模型對正確類別給出高機率時很小、給出低機率時急遽變大，因此能有效引導模型把機率質量放到正確類別上。這也是它比平方誤差更適合分類的原因。",
    choiceExplanations: {
      A: "參數個數由模型結構決定，與損失函數的定義無關。",
      C: "特徵相關性可用相關係數或互信息衡量，不是交叉熵的用途。",
      D: "樣本數是資料規模，不是損失函數在衡量的對象。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["交叉熵", "機率分布距離"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若任務改為預測連續數值，交叉熵就不適用，該換成均方誤差或絕對誤差這類迴歸損失。",
    },
  },
  {
    id: "senior-ml-practice-q006",
    subjectId: "senior-ml",
    prompt:
      "關於「偏差—變異權衡（Bias-Variance Tradeoff）」，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "模型過於簡單時偏差高，過於複雜時變異高，需在兩者間取得平衡" },
      { id: "B", text: "偏差與變異可以同時降到零" },
      { id: "C", text: "增加模型複雜度一定同時降低偏差與變異" },
      { id: "D", text: "偏差與變異都與資料量無關" },
    ],
    answer: "A",
    explanation:
      "簡單模型學不到真實規律（高偏差、欠擬合），複雜模型對訓練樣本過度敏感（高變異、過擬合）。實務上以正則化、交叉驗證與資料量的增加來尋找兩者的平衡點。",
    choiceExplanations: {
      B: "在有限樣本與雜訊存在的情況下，兩者無法同時歸零，還有不可約誤差。",
      C: "增加複雜度通常降低偏差但抬高變異，兩者呈相反方向變動。",
      D: "資料量增加通常能降低變異，讓較複雜的模型也不容易過擬合。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["偏差", "變異", "模型複雜度"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若能大幅增加資料量，複雜模型的變異會下降，權衡點就往複雜的方向移動——這個取捨並非固定不變。",
    },
  },
  {
    id: "senior-ml-practice-q007",
    subjectId: "senior-ml",
    prompt:
      "農業試驗以少量樣本估計某作物的平均產量，並希望量化估計的不確定性。最適合的做法是下列何者？",
    choices: [
      { id: "A", text: "給出信賴區間而非僅回報單一點估計" },
      { id: "B", text: "只回報平均值即可" },
      { id: "C", text: "把樣本標準差當成估計誤差直接報告" },
      { id: "D", text: "把最大值當作估計值" },
    ],
    answer: "A",
    explanation:
      "點估計無法表達精確度。信賴區間同時給出估計值與其不確定範圍，樣本越少區間越寬，讀者才知道這個數字有多可靠。",
    choiceExplanations: {
      B: "只給平均值會讓人誤以為估計很精確，隱藏了抽樣誤差。",
      C: "樣本標準差描述的是個體之間的變異，估計平均的誤差應使用標準誤（除以根號 n）。",
      D: "最大值是極端觀測，完全不能代表平均水準。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["信賴區間", "不確定性量化", "標準誤"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若樣本數極大、區間窄到可忽略，只報點估計的資訊損失就很小——區間的必要性隨樣本數減少而上升。",
    },
  },
  {
    id: "senior-ml-practice-q008",
    subjectId: "senior-ml",
    prompt:
      "在機器學習中提到「獨立同分布（i.i.d.）」假設，其主要意義是下列何者？",
    choices: [
      { id: "A", text: "所有類別的樣本數相同" },
      { id: "B", text: "所有特徵的數值範圍相同" },
      { id: "C", text: "訓練與測試樣本來自同一分布且彼此獨立，泛化理論才成立" },
      { id: "D", text: "模型參數彼此獨立" },
    ],
    answer: "C",
    explanation:
      "多數學習理論的保證建立在 i.i.d. 之上。時間序列、群集資料或分布會漂移的場景違反此假設，此時就必須改用時間切分、群組切分或持續監控來補救。",
    choiceExplanations: {
      A: "類別樣本數相同是資料平衡問題，不是 i.i.d. 的定義。",
      B: "數值範圍一致是特徵縮放的議題，與樣本的抽樣性質無關。",
      D: "i.i.d. 描述的是資料樣本，不是模型參數之間的關係。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["獨立同分布", "泛化理論", "假設違反"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若資料是時間序列或同一群體的重複觀測，i.i.d. 就不成立，必須改用時間切分或群組切分來評估。",
    },
  },
  {
    id: "senior-ml-practice-q009",
    subjectId: "senior-ml",
    prompt:
      "以 A/B 測試比較兩個推薦模型的點擊率時，若想知道觀察到的差異是否可能來自隨機波動，應進行下列何者？",
    choices: [
      { id: "A", text: "增加模型參數量" },
      { id: "B", text: "直接比較兩組的原始點擊數" },
      { id: "C", text: "只看哪一組的數字比較大" },
      { id: "D", text: "比例的假設檢定並檢視效果量" },
    ],
    answer: "D",
    explanation:
      "兩組比例的差異可能只是抽樣波動。以比例檢定判斷差異是否超出隨機範圍，再以效果量判斷差多少值不值得換模型，兩者缺一不可。",
    choiceExplanations: {
      A: "增加參數量是模型設計的調整，與判斷差異是否顯著無關。",
      B: "原始點擊數受各組曝光量影響，不同曝光下直接比較沒有意義。",
      C: "只看大小完全忽略隨機波動，小樣本時極易做出錯誤結論。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["比例檢定", "效果量", "隨機波動"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若兩組的曝光量差距懸殊，直接比較比例仍會被雜訊主導，該先確認樣本數是否足以偵測預期的效果量。",
    },
  },

  // ── L23102 線性代數之機器學習基礎應用（9 題）──────────────────
  {
    id: "senior-ml-practice-q010",
    subjectId: "senior-ml",
    prompt:
      "在機器學習中，把一批樣本表示為矩陣 X（列為樣本、欄為特徵）的主要好處是下列何者？",
    choices: [
      { id: "A", text: "可用矩陣運算一次處理整批樣本，充分利用平行化硬體" },
      { id: "B", text: "可以讓資料自動去除雜訊" },
      { id: "C", text: "可以免除特徵縮放的需要" },
      { id: "D", text: "可以讓模型自動選擇特徵" },
    ],
    answer: "A",
    explanation:
      "把逐筆迴圈改寫成矩陣乘法，可直接交給 BLAS 或 GPU 平行執行，這是深度學習能在大量資料上訓練的工程基礎。",
    choiceExplanations: {
      B: "去雜訊需要濾波或前處理，矩陣只是資料的排列形式。",
      C: "不同特徵的尺度差異仍然存在，縮放的需要與表示形式無關。",
      D: "特徵選擇需要額外的方法，矩陣本身不會挑選欄位。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["矩陣表示", "向量化", "平行運算"],
      constraints: ["compute"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若每筆樣本的特徵長度不一（例如變長序列），就無法直接排成矩陣，需要先做填補或改用支援不規則張量的結構。",
    },
  },
  {
    id: "senior-ml-practice-q011",
    subjectId: "senior-ml",
    prompt:
      "兩個向量的「餘弦相似度」衡量的是下列何者？",
    choices: [
      { id: "A", text: "兩向量元素的總和" },
      { id: "B", text: "兩向量端點之間的直線距離" },
      { id: "C", text: "兩向量長度的差值" },
      { id: "D", text: "兩向量方向的接近程度，與長度無關" },
    ],
    answer: "D",
    explanation:
      "餘弦相似度是內積除以兩者長度的乘積，結果只反映夾角。文本檢索常用它，因為文件長短不同但主題可能一致，長度不該影響相似度判斷。",
    choiceExplanations: {
      A: "元素總和只是一個純量統計，不描述兩向量之間的關係。",
      B: "端點距離是歐氏距離，會同時受方向與長度影響。",
      C: "長度差值與夾角無關，兩個等長但方向相反的向量長度差為零。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["餘弦相似度", "夾角", "長度無關"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若向量的長度本身帶有意義（例如購買次數的絕對量），餘弦會把這個資訊丟掉，此時歐氏距離才合適。",
    },
  },
  {
    id: "senior-ml-practice-q012",
    subjectId: "senior-ml",
    prompt:
      "主成分分析（PCA）在數學上與下列哪一個概念關係最直接？",
    choices: [
      { id: "A", text: "矩陣的跡（trace）等於 1" },
      { id: "B", text: "矩陣的行列式為零" },
      { id: "C", text: "共變異數矩陣的特徵值與特徵向量" },
      { id: "D", text: "單位矩陣的逆矩陣" },
    ],
    answer: "C",
    explanation:
      "PCA 對共變異數矩陣做特徵分解：特徵向量給出主成分的方向，對應的特徵值代表該方向解釋的變異量。取最大的幾個特徵值即完成降維。",
    choiceExplanations: {
      A: "跡等於特徵值之和，但「等於 1」並非 PCA 的條件。",
      B: "行列式為零代表矩陣奇異，與 PCA 的求解目標不是同一件事。",
      D: "單位矩陣的逆仍是單位矩陣，與主成分的求取無關。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["PCA", "共變異數矩陣", "特徵分解"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若資料的主要結構是非線性的（例如流形上的曲面），線性的 PCA 抓不到，該改用核 PCA 或 t-SNE、UMAP。",
    },
  },
  {
    id: "senior-ml-practice-q013",
    subjectId: "senior-ml",
    prompt:
      "神經網路中的「全連接層」在數學上主要執行下列哪一種運算？",
    choices: [
      { id: "A", text: "對輸入取平均值" },
      { id: "B", text: "矩陣乘法加上偏置，再經過非線性激活函數" },
      { id: "C", text: "對輸入排序" },
      { id: "D", text: "計算輸入的行列式" },
    ],
    answer: "B",
    explanation:
      "全連接層的核心是 y = Wx + b，再套上激活函數引入非線性。若少了非線性，多層堆疊仍等價於單一線性轉換，深度就失去意義。",
    choiceExplanations: {
      A: "取平均是池化或全域平均池化的行為，不是全連接層的定義。",
      C: "排序不是可微分的線性運算，神經網路層不做這件事。",
      D: "行列式是方陣的純量屬性，與逐層前向傳遞無關。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["全連接層", "矩陣乘法", "激活函數"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若拿掉非線性激活函數，多層堆疊會退化成單一線性轉換，深度就完全失去意義。",
    },
  },
  {
    id: "senior-ml-practice-q014",
    subjectId: "senior-ml",
    prompt:
      "特徵之間存在高度線性相關（共線性）時，對線性迴歸最直接的影響是下列何者？",
    choices: [
      { id: "A", text: "模型必定完全無法訓練" },
      { id: "B", text: "係數估計不穩定，難以解釋個別特徵的貢獻" },
      { id: "C", text: "預測值必定嚴重偏誤" },
      { id: "D", text: "資料量會自動減少" },
    ],
    answer: "B",
    explanation:
      "共線性讓多組係數組合都能得到幾乎相同的擬合，估計因此對資料的微小變動極度敏感，標準誤變大、符號甚至可能反轉，解釋性隨之瓦解。",
    choiceExplanations: {
      A: "除非完全共線導致矩陣不可逆，否則仍可訓練，只是估計不穩。",
      C: "整體預測往往仍然堪用，受害的主要是個別係數的解釋。",
      D: "特徵之間的相關性不會改變樣本筆數。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["共線性", "係數不穩定", "可解釋性"],
      constraints: ["explainability"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若模型只用於預測、不需要解釋個別係數，共線性的危害就小得多，整體預測往往仍然堪用。",
    },
  },
  {
    id: "senior-ml-practice-q015",
    subjectId: "senior-ml",
    prompt:
      "在推薦系統中使用矩陣分解（Matrix Factorization），其核心想法是下列何者？",
    choices: [
      { id: "A", text: "把使用者—物品評分矩陣分解為兩個低維矩陣的乘積，以潛在因子表達偏好" },
      { id: "B", text: "把評分矩陣轉置後直接使用" },
      { id: "C", text: "把所有缺值填 0 後計算總和" },
      { id: "D", text: "把矩陣的每一列排序" },
    ],
    answer: "A",
    explanation:
      "矩陣分解假設偏好由少數潛在因子決定，使用者與物品各自對應一組因子向量，內積即為預測評分。這讓稀疏的評分矩陣得以補全。",
    choiceExplanations: {
      B: "轉置只是行列互換，不會產生任何預測能力。",
      C: "把缺值當成 0 等於認定使用者不喜歡，會嚴重扭曲學習訊號。",
      D: "排序不產生潛在表示，也無法預測未評分的項目。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["矩陣分解", "潛在因子", "推薦系統"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若新使用者完全沒有任何評分紀錄（冷啟動），潛在因子無從估計，就必須改以內容特徵或人口統計資訊補上。",
    },
  },
  {
    id: "senior-ml-practice-q016",
    subjectId: "senior-ml",
    prompt:
      "One-hot 編碼把類別變數轉成向量，其主要缺點是下列何者？",
    choices: [
      { id: "A", text: "類別數很多時維度暴增且向量極為稀疏" },
      { id: "B", text: "會讓類別之間產生錯誤的大小順序" },
      { id: "C", text: "無法用於樹模型" },
      { id: "D", text: "會改變樣本數量" },
    ],
    answer: "A",
    explanation:
      "有一萬個類別就會產生一萬維，計算與記憶體成本高且每列只有一個 1。高基數類別通常改用目標編碼、雜湊技巧或學習嵌入向量。",
    choiceExplanations: {
      B: "產生錯誤大小順序的是標籤編碼（把類別編成 1、2、3）；one-hot 正是為避免此問題而生。",
      C: "樹模型可以使用 one-hot，只是高基數時分裂效率不佳，並非不能用。",
      D: "編碼方式改變的是欄位數，不會改變樣本筆數。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["One-hot 編碼", "高基數", "稀疏性"],
      constraints: ["memory"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若類別只有三五個，one-hot 的維度成本微不足道，它的「不引入順序」優點就純粹是好處。",
    },
  },
  {
    id: "senior-ml-practice-q017",
    subjectId: "senior-ml",
    prompt:
      "在高維空間中，「維度詛咒」造成的典型現象是下列何者？",
    choices: [
      { id: "A", text: "所需樣本數隨維度增加而減少" },
      { id: "B", text: "資料自動變得更容易分類" },
      { id: "C", text: "資料變得稀疏，樣本間的距離趨於相近而失去鑑別力" },
      { id: "D", text: "特徵之間必定變得獨立" },
    ],
    answer: "C",
    explanation:
      "維度上升時空間體積指數成長，固定樣本數會顯得極度稀疏，最近與最遠鄰居的距離比值趨近 1，依賴距離的方法（KNN、分群）因此失效。",
    choiceExplanations: {
      A: "要維持同樣的樣本密度，所需樣本數隨維度指數成長。",
      B: "高維讓過擬合更容易發生，分類通常變難而非變易。",
      D: "維度增加不會讓特徵自動去除相關性。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["維度詛咒", "稀疏性", "距離失效"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若高維資料實際上集中在低維流形上（影像即是如此），有效維度遠低於名目維度，距離仍可能有鑑別力。",
    },
  },
  {
    id: "senior-ml-practice-q018",
    subjectId: "senior-ml",
    prompt:
      "使用 L2 範數（歐氏距離）計算樣本相似度前，通常需要先做特徵標準化，原因是下列何者？",
    choices: [
      { id: "A", text: "標準化可以讓特徵之間變得獨立" },
      { id: "B", text: "標準化可以增加樣本數" },
      { id: "C", text: "標準化可以消除所有離群值" },
      { id: "D", text: "尺度較大的特徵會主導距離計算，掩蓋其他特徵的影響" },
    ],
    answer: "D",
    explanation:
      "以「年收入（數十萬）」與「年齡（數十）」為例，未標準化時距離幾乎完全由收入決定。標準化把各特徵放到可比的尺度，距離才反映整體差異。",
    choiceExplanations: {
      A: "去除相關性需要 PCA 或白化，單純的標準化做不到。",
      B: "標準化是數值轉換，不會改變樣本筆數。",
      C: "離群值標準化後仍是離群值，只是換了尺度。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["特徵標準化", "歐氏距離", "尺度主導"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Layer Confusion",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若各特徵本來就同單位、同量級（例如都是 0 到 1 的比例），標準化帶來的效益就很有限。",
    },
  },

  // ── L23103 數值優化技術與方法（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q019",
    subjectId: "senior-ml",
    prompt:
      "梯度下降法中「學習率過大」最可能造成下列哪一種現象？",
    choices: [
      { id: "A", text: "一定收斂到全域最佳解" },
      { id: "B", text: "損失震盪甚至發散，無法收斂" },
      { id: "C", text: "訓練速度必定變慢" },
      { id: "D", text: "梯度變成零" },
    ],
    answer: "B",
    explanation:
      "步伐太大會在最佳解附近來回跨越甚至越走越遠，損失曲線呈現震盪或直接發散。實務上會搭配學習率調度或自適應優化器來緩解。",
    choiceExplanations: {
      A: "學習率過大反而可能連局部最佳解都到不了，遑論全域。",
      C: "每步走得更遠，單步的推進反而更大；問題在於不穩定而非速度慢。",
      D: "梯度由損失曲面決定，不會因為學習率大而歸零。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["學習率", "震盪", "發散"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若損失是緩慢下降到某個值後就不動，那是學習率過小或已達局部最小，與過大造成的震盪徵狀完全不同。",
    },
  },
  {
    id: "senior-ml-practice-q020",
    subjectId: "senior-ml",
    prompt:
      "小批次梯度下降（Mini-batch Gradient Descent）相較於全批次的主要優勢是下列何者？",
    choices: [
      { id: "A", text: "一定能找到全域最佳解" },
      { id: "B", text: "每次更新的梯度估計必定更精確" },
      { id: "C", text: "記憶體需求較低且更新更頻繁，在大資料上更實用" },
      { id: "D", text: "完全不需要設定學習率" },
    ],
    answer: "C",
    explanation:
      "全批次每次更新都要掃過整個資料集，資料量大時既慢又吃記憶體。小批次以部分樣本估計梯度，更新頻繁、可平行化，且適度的雜訊有時反而有助跳離不良的局部解。",
    choiceExplanations: {
      A: "沒有任何一階方法能保證在非凸問題上找到全域最佳解。",
      B: "以部分樣本估計的梯度含有雜訊，精確度低於全批次。",
      D: "小批次同樣需要設定學習率，這是最關鍵的超參數之一。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["小批次梯度下降", "記憶體", "更新頻率"],
      constraints: ["compute", "memory"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若資料量小到能一次載入、且損失曲面平滑，全批次的梯度更精確、收斂路徑也更穩定。",
    },
  },
  {
    id: "senior-ml-practice-q021",
    subjectId: "senior-ml",
    prompt:
      "Adam 優化器相較於原始的隨機梯度下降，主要特點是下列何者？",
    choices: [
      { id: "A", text: "只適用於線性模型" },
      { id: "B", text: "完全不使用梯度資訊" },
      { id: "C", text: "結合動量與各參數自適應的學習率" },
      { id: "D", text: "會自動選擇模型架構" },
    ],
    answer: "C",
    explanation:
      "Adam 同時維護梯度的一階動量（方向平滑）與二階動量（依歷史梯度大小調整每個參數的步伐），因此對學習率的初始設定較不敏感，收斂通常較快。",
    choiceExplanations: {
      A: "Adam 廣泛用於深度神經網路，並不限於線性模型。",
      B: "Adam 是梯度法的一種，完全依賴梯度資訊。",
      D: "架構選擇屬於模型設計或 NAS 的範疇，優化器只負責更新參數。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Adam", "動量", "自適應學習率"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若追求的是最佳的最終泛化表現，經過仔細調參的 SGD＋動量在某些視覺任務上仍勝過 Adam——收斂快不等於收斂得好。",
    },
  },
  {
    id: "senior-ml-practice-q022",
    subjectId: "senior-ml",
    prompt:
      "深層網路訓練時出現「梯度消失」，最直接的影響是下列何者？",
    choices: [
      { id: "A", text: "靠近輸入端的層幾乎不再更新，難以學到有效表示" },
      { id: "B", text: "損失值變成負數" },
      { id: "C", text: "模型參數量自動減少" },
      { id: "D", text: "訓練資料被自動刪除" },
    ],
    answer: "A",
    explanation:
      "反向傳播時梯度逐層相乘，若每層都小於 1，傳到前幾層時已趨近於零，這些層的權重幾乎停滯。常見對策包括 ReLU 系激活、批次正規化與殘差連接。",
    choiceExplanations: {
      B: "交叉熵等常用損失恆為非負，梯度消失不會讓它變負。",
      C: "參數量由架構決定，不會因為梯度大小而改變。",
      D: "訓練資料不會被優化過程刪除。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["梯度消失", "反向傳播", "殘差連接"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若梯度反而逐層放大到數值溢位，那是梯度爆炸，對策換成梯度裁剪而不是換激活函數。",
    },
  },
  {
    id: "senior-ml-practice-q023",
    subjectId: "senior-ml",
    prompt:
      "訓練過程中使用「學習率調度（Learning Rate Schedule）」的常見理由是下列何者？",
    choices: [
      { id: "A", text: "避免使用驗證集" },
      { id: "B", text: "讓模型參數量隨時間增加" },
      { id: "C", text: "讓訓練資料逐步減少" },
      { id: "D", text: "前期以較大步伐快速接近，後期縮小步伐以穩定收斂" },
    ],
    answer: "D",
    explanation:
      "固定學習率難以兼顧「快速下降」與「精細收斂」。前大後小的調度讓模型先大步逼近低損失區域，再以小步伐精修，通常能取得更好的最終表現。",
    choiceExplanations: {
      A: "驗證集用於評估與早停，調度不能取代它的功能。",
      B: "參數量由架構決定，與學習率調度無關。",
      C: "訓練資料量不會因為調度而改變。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["學習率調度", "收斂穩定性"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若訓練從頭到尾都很穩定、最終損失也已收斂，固定學習率就夠了，調度增加的只是超參數。",
    },
  },
  {
    id: "senior-ml-practice-q024",
    subjectId: "senior-ml",
    prompt:
      "「早停（Early Stopping）」的判斷依據通常是下列何者？",
    choices: [
      { id: "A", text: "參數量達到上限時停止" },
      { id: "B", text: "訓練集損失降到 0 時停止" },
      { id: "C", text: "訓練時間超過一小時就停止" },
      { id: "D", text: "驗證集損失不再下降甚至開始回升時停止訓練" },
    ],
    answer: "D",
    explanation:
      "訓練損失通常持續下降，但驗證損失開始回升就是過擬合的訊號。在該點停止並取回最佳權重，是最簡單有效的正則化手段之一。",
    choiceExplanations: {
      A: "參數量在訓練過程中固定不變，不會成為停止條件。",
      B: "訓練損失降到 0 往往正代表模型已把訓練資料背下來，是過擬合而非該停的理由。",
      C: "以時間為準與模型的泛化表現無關，只是資源限制。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["早停", "驗證損失", "過擬合"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若驗證集太小、損失曲線本身就抖動劇烈，早停容易誤觸發，需要加上耐心值（patience）或改用交叉驗證。",
    },
  },
  {
    id: "senior-ml-practice-q025",
    subjectId: "senior-ml",
    prompt:
      "非凸最佳化問題（如深度神經網路）中，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "梯度法可能停在局部最佳或鞍點，無法保證全域最佳" },
      { id: "B", text: "梯度法必定找到全域最佳解" },
      { id: "C", text: "非凸問題沒有任何可行的最佳化方法" },
      { id: "D", text: "只要學習率夠小就一定收斂到全域最佳" },
    ],
    answer: "A",
    explanation:
      "非凸曲面存在多個局部最小與大量鞍點，一階方法只能保證收斂到梯度為零的點。實務上靠隨機初始化、動量與小批次雜訊來獲得夠好的解。",
    choiceExplanations: {
      B: "全域最佳的保證只存在於凸問題，深度網路的損失曲面並非凸。",
      C: "非凸問題有大量成熟的最佳化方法，只是不保證全域最佳。",
      D: "學習率再小也只能更穩定地滑向附近的駐點，與是否為全域最佳無關。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["非凸最佳化", "局部最佳", "鞍點"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若問題本身是凸的（例如線性迴歸或邏輯迴歸），梯度法確實能保證收斂到全域最佳——這個限制只出現在非凸曲面。",
    },
  },
  {
    id: "senior-ml-practice-q026",
    subjectId: "senior-ml",
    prompt:
      "農業預測模型訓練時損失下降極慢，檢查發現各特徵的數值範圍差異達千倍。最直接的改善是下列何者？",
    choices: [
      { id: "A", text: "增加訓練輪數即可" },
      { id: "B", text: "先進行特徵標準化再訓練" },
      { id: "C", text: "把損失函數改成準確率" },
      { id: "D", text: "刪除所有小數點" },
    ],
    answer: "B",
    explanation:
      "尺度懸殊會讓損失曲面在各方向的曲率差距極大，梯度下降在狹長的谷地中來回震盪、前進緩慢。標準化讓曲面接近等向，收斂速度大幅改善。",
    choiceExplanations: {
      A: "不解決根本的尺度問題，只是花更多時間硬撐，效率極差。",
      C: "準確率不可微分，無法作為梯度下降的損失函數。",
      D: "刪除小數點等於粗暴地降低精度，會損失資訊且無助收斂。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["特徵標準化", "收斂速度", "曲面條件數"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型是決策樹或梯度提升樹這類依門檻切分的模型，尺度差異不影響收斂，標準化就不會帶來改善。",
    },
  },

  // ── L23201 機器學習原理與技術（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q027",
    subjectId: "senior-ml",
    prompt:
      "半監督式學習最適合下列哪一種情境？",
    choices: [
      { id: "A", text: "所有樣本都已完整標註" },
      { id: "B", text: "有大量未標註資料，但標註成本高而只有少量標註樣本" },
      { id: "C", text: "完全沒有任何資料" },
      { id: "D", text: "只需要對資料做排序" },
    ],
    answer: "B",
    explanation:
      "半監督式學習利用少量標註樣本建立初步判斷，再借助大量未標註資料的分布結構（如群聚假設）改善模型，正好對應標註昂貴但原始資料充足的場景。",
    choiceExplanations: {
      A: "全部標註完成時直接使用監督式學習即可，不需要半監督的額外假設。",
      C: "沒有資料時任何學習方法都無從進行。",
      D: "排序是資料處理操作，不是學習範式的適用情境。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["半監督式學習", "標註成本", "群聚假設"],
      constraints: ["labeled_data_scarcity"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若未標註資料與標註資料的分布不同（例如來自另一批客群），半監督的群聚假設反而會把模型帶偏。",
    },
  },
  {
    id: "senior-ml-practice-q028",
    subjectId: "senior-ml",
    prompt:
      "「歸納偏置（Inductive Bias）」在機器學習中指的是下列何者？",
    choices: [
      { id: "A", text: "訓練資料的標註錯誤" },
      { id: "B", text: "資料中對特定族群的歧視" },
      { id: "C", text: "模型為了從有限樣本推廣到未見資料所預設的假設" },
      { id: "D", text: "模型參數的初始值一律為零" },
    ],
    answer: "C",
    explanation:
      "沒有任何假設就無法從有限樣本推廣。線性模型假設關係是線性的、CNN 假設局部性與位移不變性——這些內建假設就是歸納偏置，決定了模型擅長什麼樣的問題。",
    choiceExplanations: {
      A: "標註錯誤屬於資料品質問題，不是模型的假設。",
      B: "對族群的歧視是演算法偏見（bias in the fairness sense），與此處的技術術語同字不同義。",
      D: "參數初始化是訓練技巧，與模型的假設空間不同。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["歸納偏置", "假設空間", "泛化"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若模型的歸納偏置與問題結構不符（例如以 CNN 處理沒有空間鄰近關係的表格資料），內建假設反而變成阻礙。",
    },
  },
  {
    id: "senior-ml-practice-q029",
    subjectId: "senior-ml",
    prompt:
      "集成學習中的「Bagging」與「Boosting」，其主要差異是下列何者？",
    choices: [
      { id: "A", text: "Bagging 只能用於迴歸，Boosting 只能用於分類" },
      { id: "B", text: "兩者完全相同，只是名稱不同" },
      { id: "C", text: "Bagging 平行訓練多個獨立模型再平均，Boosting 依序訓練並針對前一輪的錯誤加強" },
      { id: "D", text: "Boosting 的各個模型彼此獨立、可完全平行" },
    ],
    answer: "C",
    explanation:
      "Bagging（如隨機森林）以自助抽樣訓練多個彼此獨立的模型再投票，主要降低變異；Boosting（如 XGBoost）序列式地讓每個新模型修正前面的殘差，主要降低偏差。",
    choiceExplanations: {
      A: "兩種集成方式都能用於分類與迴歸，並無此限制。",
      B: "兩者的訓練方式、平行性與偏差變異的著力點都不同。",
      D: "Boosting 的每一輪都依賴前一輪的結果，本質上是序列式的。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["Bagging", "Boosting", "偏差與變異"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若資料含大量雜訊或錯誤標註，Boosting 會不斷加重這些難樣本的權重而過擬合，Bagging 的穩健性反而勝出。",
    },
  },
  {
    id: "senior-ml-practice-q030",
    subjectId: "senior-ml",
    prompt:
      "「沒有免費的午餐定理（No Free Lunch）」對模型選擇的實務啟示是下列何者？",
    choices: [
      { id: "A", text: "不存在對所有問題都最好的演算法，應依問題特性實測比較" },
      { id: "B", text: "深度學習永遠優於傳統方法" },
      { id: "C", text: "只要資料夠多就不必比較模型" },
      { id: "D", text: "模型選擇不重要" },
    ],
    answer: "A",
    explanation:
      "在所有可能問題上平均而言，任何演算法的表現都相同。因此實務的重點不是找「最強的模型」，而是找「最適合這個資料與這個目標的模型」，這需要實測。",
    choiceExplanations: {
      B: "在中小型表格式資料上，梯度提升樹經常勝過深度網路，並無普遍優劣。",
      C: "資料量大不代表任何模型都適用，模型與問題的匹配仍然關鍵。",
      D: "定理說明的是沒有萬用解，反而更凸顯針對問題選模型的重要性。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["沒有免費的午餐", "模型選擇", "實測比較"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若已知問題的結構（例如確定是線性關係），先驗知識就縮小了候選範圍，不必真的把所有模型都試一遍。",
    },
  },
  {
    id: "senior-ml-practice-q031",
    subjectId: "senior-ml",
    prompt:
      "正則化（Regularization）在模型訓練中的主要作用是下列何者？",
    choices: [
      { id: "A", text: "自動標註資料" },
      { id: "B", text: "加快資料讀取速度" },
      { id: "C", text: "增加訓練樣本數量" },
      { id: "D", text: "抑制模型複雜度以降低過擬合風險" },
    ],
    answer: "D",
    explanation:
      "正則化在損失中加入懲罰項，讓模型在「擬合資料」與「保持簡單」之間取得平衡，避免把雜訊也學起來，是控制過擬合最常用的手段。",
    choiceExplanations: {
      A: "自動標註是弱監督或主動學習的範疇，與正則化無關。",
      B: "資料讀取速度屬於工程議題，與損失函數的懲罰項無關。",
      C: "正則化不會產生新樣本，增加樣本靠的是蒐集或資料增強。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["正則化", "模型複雜度", "過擬合"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型本來就欠擬合（訓練與驗證誤差都高），加強正則化只會更糟——它治的是過擬合，不是所有誤差。",
    },
  },
  {
    id: "senior-ml-practice-q032",
    subjectId: "senior-ml",
    prompt:
      "強化學習中的「探索與利用權衡（Exploration-Exploitation）」指的是下列何者？",
    choices: [
      { id: "A", text: "在不同程式語言之間選擇" },
      { id: "B", text: "在訓練集與測試集之間分配資料" },
      { id: "C", text: "在 CPU 與 GPU 之間分配運算" },
      { id: "D", text: "在嘗試新行動以獲取資訊、與採用已知較優行動之間取得平衡" },
    ],
    answer: "D",
    explanation:
      "只利用已知最佳行動會錯過更好的選項，只探索又浪費機會成本。ε-greedy、UCB 等策略就是在兩者間取捨的具體方法。",
    choiceExplanations: {
      A: "程式語言選擇與學習策略毫無關聯。",
      B: "資料切分屬於監督式學習的評估設計，與行動選擇無關。",
      C: "運算資源分配是工程問題，不是強化學習的核心權衡。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["探索與利用", "強化學習策略"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若環境完全靜止、且所有行動的報酬已經被充分探索過，繼續探索就只是浪費，策略應轉為純利用。",
    },
  },
  {
    id: "senior-ml-practice-q033",
    subjectId: "senior-ml",
    prompt:
      "遷移學習中的「災難性遺忘（Catastrophic Forgetting）」指的是下列何者？",
    choices: [
      { id: "A", text: "模型在新任務上微調後，原本任務的能力大幅退化" },
      { id: "B", text: "訓練資料被誤刪" },
      { id: "C", text: "模型檔案損毀無法載入" },
      { id: "D", text: "GPU 記憶體不足" },
    ],
    answer: "A",
    explanation:
      "微調時權重被新任務的梯度大幅改寫，舊任務所依賴的表示因而被覆蓋。緩解方式包括降低學習率、凍結部分層、混入舊任務樣本或使用正則化約束權重變動。",
    choiceExplanations: {
      B: "資料誤刪是資料管理問題，與模型在新舊任務間的能力消長無關。",
      C: "檔案損毀會讓模型完全無法運作，而非特定任務退化。",
      D: "記憶體不足是資源限制，會導致訓練中斷而非能力遺忘。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["災難性遺忘", "微調", "凍結層"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若舊任務日後完全不再需要，遺忘就不是問題而是預期行為——它只在需要同時保有兩種能力時才構成缺陷。",
    },
  },
  {
    id: "senior-ml-practice-q034",
    subjectId: "senior-ml",
    prompt:
      "自監督式學習（Self-supervised Learning）的核心特徵是下列何者？",
    choices: [
      { id: "A", text: "完全不使用任何資料" },
      { id: "B", text: "從資料本身構造預測任務產生監督訊號，不需人工標註" },
      { id: "C", text: "必須由人工逐筆標註" },
      { id: "D", text: "只能用於數值型資料" },
    ],
    answer: "B",
    explanation:
      "例如遮住句子中的某個詞讓模型預測、或把影像旋轉後讓模型判斷角度——標籤直接來自資料本身。這讓模型能在海量未標註資料上學到通用表示，是預訓練模型的基礎。",
    choiceExplanations: {
      A: "自監督仍然大量使用資料，只是不需要人工標註。",
      C: "免除人工標註正是它的核心價值，敘述與定義相反。",
      D: "文本、影像、語音都廣泛採用自監督預訓練，並無型別限制。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["自監督式學習", "前置任務", "預訓練"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若下游任務的標註資料本來就充足，自監督預訓練帶來的增益會明顯收斂——它的價值來自未標註資料遠多於標註資料。",
    },
  },

  // ── L23202 常見機器學習演算法（9 題）──────────────────────────
  {
    id: "senior-ml-practice-q035",
    subjectId: "senior-ml",
    prompt:
      "決策樹以「資訊增益」或「吉尼不純度」選擇分裂點，其共同目的是下列何者？",
    choices: [
      { id: "A", text: "選出能讓分裂後子節點的類別純度提升最多的特徵與門檻" },
      { id: "B", text: "選出數值最大的特徵" },
      { id: "C", text: "讓每個葉節點的樣本數相同" },
      { id: "D", text: "讓樹的深度盡可能大" },
    ],
    answer: "A",
    explanation:
      "兩種準則都在衡量「分完之後每一邊有多混雜」。挑選使不純度下降最多的分裂，就是讓同一節點內的樣本盡量屬於同一類，這是決策樹的貪婪建構原則。",
    choiceExplanations: {
      B: "特徵數值大小與它能不能區分類別無關，樹模型也對單調轉換不敏感。",
      C: "葉節點樣本數均等不是目標，強求反而會犧牲純度。",
      D: "樹越深越容易過擬合，實務上反而要以深度或葉節點數限制。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資訊增益", "吉尼不純度", "分裂準則"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若任務是迴歸而非分類，分裂準則就換成變異數或均方誤差的下降量——衡量的東西變了，貪婪原則不變。",
    },
  },
  {
    id: "senior-ml-practice-q036",
    subjectId: "senior-ml",
    prompt:
      "隨機森林相較於單棵決策樹，泛化能力較佳的主要原因是下列何者？",
    choices: [
      { id: "A", text: "訓練資料完全相同且不做任何隨機化" },
      { id: "B", text: "每棵樹的深度都被限制為 1" },
      { id: "C", text: "只使用一個特徵訓練" },
      { id: "D", text: "以自助抽樣與隨機特徵子集訓練多棵樹，降低彼此相關性後再平均" },
    ],
    answer: "D",
    explanation:
      "多棵高變異但彼此相關性低的樹取平均後，變異被有效抵消。兩層隨機性（樣本自助抽樣、每次分裂只考慮部分特徵）正是為了降低樹與樹之間的相關性。",
    choiceExplanations: {
      A: "沒有隨機化的話每棵樹都幾乎一樣，平均後沒有任何降變異效果。",
      B: "深度為 1 的樹（決策樁）常用於 Boosting，不是隨機森林的做法。",
      C: "只用一個特徵會嚴重欠擬合，也失去集成的意義。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["隨機森林", "自助抽樣", "去相關"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若所有特徵中只有一兩個真正有訊號，隨機特徵子集會讓多數樹抽不到它們，此時要調高每次分裂考慮的特徵數。",
    },
  },
  {
    id: "senior-ml-practice-q037",
    subjectId: "senior-ml",
    prompt:
      "支援向量機（SVM）中的「核技巧（Kernel Trick）」主要用途是下列何者？",
    choices: [
      { id: "A", text: "自動填補缺失值" },
      { id: "B", text: "減少訓練樣本數量" },
      { id: "C", text: "在不顯式計算高維座標的情況下，於高維空間中尋找線性可分的邊界" },
      { id: "D", text: "把分類問題轉成迴歸問題" },
    ],
    answer: "C",
    explanation:
      "核函數直接給出兩點在高維空間中的內積，因此不必真的把資料映射過去。原本線性不可分的資料在高維中可能變得可分，計算成本卻沒有爆炸。",
    choiceExplanations: {
      A: "缺失值處理是前處理工作，與核函數無關。",
      B: "核技巧不減少樣本；相反地，核矩陣的大小隨樣本數平方成長。",
      D: "SVM 有專門的迴歸版本（SVR），但那不是核技巧的作用。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["核技巧", "高維映射", "線性可分"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若樣本數達到數十萬筆，核矩陣隨樣本數平方成長會使計算不可行，此時要改用線性 SVM 或近似核方法。",
    },
  },
  {
    id: "senior-ml-practice-q038",
    subjectId: "senior-ml",
    prompt:
      "K-means 分群演算法的主要限制是下列何者？",
    choices: [
      { id: "A", text: "無法處理數值型資料" },
      { id: "B", text: "需事先指定群數，且傾向找出大小相近的球形群集" },
      { id: "C", text: "必須有標註資料才能執行" },
      { id: "D", text: "只能分成兩群" },
    ],
    answer: "B",
    explanation:
      "K-means 以到中心的距離分配樣本，因此偏好凸的、大小密度接近的球形群；k 值也必須事先給定，通常靠肘部法或輪廓係數輔助決定。",
    choiceExplanations: {
      A: "K-means 正是為數值型資料設計，處理類別資料才需要改用 k-modes。",
      C: "K-means 是非監督方法，完全不需要標籤。",
      D: "k 可以是任意正整數，不限於 2。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["K-means", "群數指定", "球形群集"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若群集呈環狀或細長形、密度也不均，就該改用 DBSCAN 這類以密度定義群集的方法。",
    },
  },
  {
    id: "senior-ml-practice-q039",
    subjectId: "senior-ml",
    prompt:
      "邏輯迴歸（Logistic Regression）雖名為迴歸，實際上主要用於下列何者？",
    choices: [
      { id: "A", text: "預測連續數值" },
      { id: "B", text: "二元分類，輸出為事件發生的機率" },
      { id: "C", text: "把樣本分群" },
      { id: "D", text: "降維" },
    ],
    answer: "B",
    explanation:
      "邏輯迴歸以 sigmoid 把線性組合映射到 0 到 1 之間，輸出可解讀為機率，再依門檻判定類別。它的係數可轉成勝算比，解釋性佳，在受監理領域非常常用。",
    choiceExplanations: {
      A: "預測連續數值是線性迴歸的工作，兩者名稱相近但用途不同。",
      C: "分群是非監督任務，邏輯迴歸需要標籤。",
      D: "降維由 PCA 等方法負責，邏輯迴歸不改變特徵維度。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["邏輯迴歸", "二元分類", "機率輸出"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若類別超過兩個，就要改用多項式邏輯迴歸或一對多策略——原始形式只處理二元。",
    },
  },
  {
    id: "senior-ml-practice-q040",
    subjectId: "senior-ml",
    prompt:
      "K 最近鄰（KNN）演算法的重要特性是下列何者？",
    choices: [
      { id: "A", text: "訓練階段幾乎不做計算，成本集中在推論時的距離計算" },
      { id: "B", text: "訓練成本極高但推論極快" },
      { id: "C", text: "不需要任何距離度量" },
      { id: "D", text: "對特徵尺度完全不敏感" },
    ],
    answer: "A",
    explanation:
      "KNN 屬於惰性學習：訓練只是把資料存起來，真正的計算發生在推論時（找出最近的 k 個鄰居）。資料量大時推論會很慢，通常需要近似最近鄰索引加速。",
    choiceExplanations: {
      B: "情況正好相反，KNN 是訓練便宜、推論昂貴。",
      C: "KNN 的核心就是距離度量，沒有它無從定義「最近」。",
      D: "距離會被大尺度特徵主導，KNN 對特徵縮放非常敏感。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["KNN", "惰性學習", "推論成本"],
      constraints: ["compute"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若資料量大到逐筆比對不可行，可改用近似最近鄰索引把推論從線性掃描降到次線性，代價是些微的準確度損失。",
    },
  },
  {
    id: "senior-ml-practice-q041",
    subjectId: "senior-ml",
    prompt:
      "梯度提升樹（如 XGBoost、LightGBM）的基本學習策略是下列何者？",
    choices: [
      { id: "A", text: "依序加入新樹去擬合前面所有樹的殘差，逐步降低整體誤差" },
      { id: "B", text: "同時訓練所有樹再取平均" },
      { id: "C", text: "只訓練一棵極深的樹" },
      { id: "D", text: "隨機挑選一棵樹作為最終模型" },
    ],
    answer: "A",
    explanation:
      "梯度提升是加法模型：每一輪針對當前模型的負梯度（近似殘差）訓練一棵新的弱學習器並加入集成，因此後面的樹專門修正前面的錯誤。",
    choiceExplanations: {
      B: "同時訓練再平均是 Bagging（如隨機森林）的做法。",
      C: "梯度提升使用的是多棵淺樹，靠數量與序列修正而非單棵深樹。",
      D: "隨機挑一棵等於放棄集成，失去所有降低誤差的效果。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["梯度提升", "殘差", "加法模型"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若資料含大量錯誤標註，序列式修正會不斷加重這些難樣本而過擬合，此時 Bagging 的穩健性反而勝出。",
    },
  },
  {
    id: "senior-ml-practice-q042",
    subjectId: "senior-ml",
    prompt:
      "XGBoost 與 LightGBM 在樹的生長策略上的主要差異是下列何者？",
    choices: [
      { id: "A", text: "LightGBM 不支援缺失值處理" },
      { id: "B", text: "兩者都只支援單執行緒" },
      { id: "C", text: "XGBoost 多採層級式（Level-wise），LightGBM 採葉子式（Leaf-wise）" },
      { id: "D", text: "XGBoost 只能用於分類" },
    ],
    answer: "C",
    explanation:
      "層級式在同一深度同時分裂所有葉節點，樹形較均勻；葉子式優先分裂增益最大的葉，樹較深且不均勻，通常收斂更快但更需要限制葉節點數以防過擬合。",
    choiceExplanations: {
      A: "LightGBM 同樣內建缺失值的處理機制。",
      B: "兩者都支援多執行緒平行運算，這正是它們效能優異的原因之一。",
      D: "XGBoost 支援分類、迴歸與排序等多種任務。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["層級式生長", "葉子式生長", "過擬合控制"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若資料量小，葉子式生長容易長出極深而只覆蓋少數樣本的分支，此時要嚴格限制葉節點數與最小樣本數。",
    },
  },
  {
    id: "senior-ml-practice-q043",
    subjectId: "senior-ml",
    prompt:
      "DBSCAN 相較於 K-means 的主要優勢是下列何者？",
    choices: [
      { id: "A", text: "只能處理二維資料" },
      { id: "B", text: "一定比 K-means 快" },
      { id: "C", text: "不需要任何參數設定" },
      { id: "D", text: "不需事先指定群數，且能找出任意形狀的群集並標示雜訊點" },
    ],
    answer: "D",
    explanation:
      "DBSCAN 以密度定義群集，因此能找出彎曲或環狀的群，並自然地把低密度區域的點標為雜訊。代價是需要調整鄰域半徑與最小點數兩個參數。",
    choiceExplanations: {
      A: "DBSCAN 可用於任意維度，只是高維時密度概念會退化。",
      B: "速度取決於資料量與索引結構，DBSCAN 不必然比 K-means 快。",
      C: "它仍需設定 eps 與 minPts，且結果對這兩個參數相當敏感。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["DBSCAN", "密度分群", "雜訊點"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若各群的密度差異很大，單一組 eps 與 minPts 無法同時適配，此時要改用 HDBSCAN 或分層處理。",
    },
  },

  // ── L23203 深度學習原理與框架（9 題）──────────────────────────
  {
    id: "senior-ml-practice-q044",
    subjectId: "senior-ml",
    prompt:
      "神經網路若不使用非線性激活函數，多層堆疊的結果會是下列何者？",
    choices: [
      { id: "A", text: "整體仍等價於單一線性轉換，深度失去意義" },
      { id: "B", text: "會自動變成卷積網路" },
      { id: "C", text: "訓練速度會變慢但表達力更強" },
      { id: "D", text: "會直接無法計算" },
    ],
    answer: "A",
    explanation:
      "線性轉換的複合仍是線性轉換。少了非線性，一百層的網路與一層在表達力上完全相同，這正是激活函數不可或缺的理由。",
    choiceExplanations: {
      B: "卷積是特定的連接結構，與是否使用激活函數無關。",
      C: "表達力不但沒有更強，反而被壓縮成線性模型的能力範圍。",
      D: "計算完全可以進行，只是結果等價於單層線性模型。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["非線性激活", "線性複合", "表達力"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若任務的真實關係本來就是線性的，退化成線性模型並非缺陷——問題只在於白白付出了多層的計算成本。",
    },
  },
  {
    id: "senior-ml-practice-q045",
    subjectId: "senior-ml",
    prompt:
      "Dropout 在訓練神經網路時的作用是下列何者？",
    choices: [
      { id: "A", text: "調整學習率大小" },
      { id: "B", text: "永久刪除部分神經元以縮小模型" },
      { id: "C", text: "增加訓練資料筆數" },
      { id: "D", text: "隨機暫時關閉部分神經元，降低神經元間的共適應以抑制過擬合" },
    ],
    answer: "D",
    explanation:
      "每次前向傳播隨機讓一部分神經元失效，迫使網路不能依賴特定少數神經元的組合，等於在訓練許多子網路並取集成效果。推論時則關閉 Dropout。",
    choiceExplanations: {
      A: "學習率由優化器與調度器控制，與 Dropout 無關。",
      B: "Dropout 只在訓練時暫時失效，推論階段所有神經元都會參與。",
      C: "它不產生新樣本，屬於正則化而非資料增強。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Dropout", "共適應", "正則化"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型本來就欠擬合，加上 Dropout 只會讓它更學不動——它是治過擬合的藥，不是通用補品。",
    },
  },
  {
    id: "senior-ml-practice-q046",
    subjectId: "senior-ml",
    prompt:
      "批次正規化（Batch Normalization）的主要效益是下列何者？",
    choices: [
      { id: "A", text: "自動選擇最佳的網路層數" },
      { id: "B", text: "把資料筆數正規化為相同" },
      { id: "C", text: "穩定各層輸入的分布，加速收斂並允許較大的學習率" },
      { id: "D", text: "取代所有激活函數" },
    ],
    answer: "C",
    explanation:
      "把每一層輸入標準化後再以可學習的參數縮放平移，能減少訓練過程中分布劇烈變動造成的困擾，讓訓練更穩定、可用更大的學習率，並帶有輕微的正則化效果。",
    choiceExplanations: {
      A: "層數屬於架構設計，批次正規化不會自動決定。",
      B: "它正規化的是特徵數值的分布，不是樣本筆數。",
      D: "它與激活函數是互補關係，通常搭配使用而非取代。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["批次正規化", "分布穩定", "收斂速度"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若批次大小極小（例如只有 2），批次統計量本身就很不穩定，該改用層正規化或群組正規化。",
    },
  },
  {
    id: "senior-ml-practice-q047",
    subjectId: "senior-ml",
    prompt:
      "殘差連接（Residual Connection）被廣泛採用的主要原因是下列何者？",
    choices: [
      { id: "A", text: "可以減少模型的參數量" },
      { id: "B", text: "提供梯度的捷徑，使極深網路仍能有效訓練" },
      { id: "C", text: "可以取代訓練資料" },
      { id: "D", text: "可以自動標註資料" },
    ],
    answer: "B",
    explanation:
      "把輸入直接加到輸出上，讓梯度可以沿著捷徑回傳而不必逐層相乘衰減，因此上百層的網路也能訓練得動。這是 ResNet 之後深度大幅增加的關鍵。",
    choiceExplanations: {
      A: "殘差連接本身不減少參數，只是改變資訊與梯度的流動路徑。",
      C: "任何架構設計都無法取代訓練資料。",
      D: "自動標註屬於資料層面的技術，與網路連接方式無關。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["殘差連接", "梯度捷徑", "極深網路"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若網路只有數層，梯度衰減本來就不嚴重，殘差連接帶來的效益也就有限。",
    },
  },
  {
    id: "senior-ml-practice-q048",
    subjectId: "senior-ml",
    prompt:
      "Transformer 架構相較於 RNN 在處理長序列時的主要優勢是下列何者？",
    choices: [
      { id: "A", text: "參數量必定較少" },
      { id: "B", text: "自注意力可直接建立任意位置之間的關聯，且可高度平行化訓練" },
      { id: "C", text: "完全不需要位置資訊" },
      { id: "D", text: "推論時的記憶體需求必定較低" },
    ],
    answer: "B",
    explanation:
      "RNN 必須逐步遞迴，長距離依賴要經過很多步而容易衰減，也難以平行。自注意力一次計算所有位置之間的關聯，長距離依賴是一步之遙，訓練也能充分平行化。",
    choiceExplanations: {
      A: "Transformer 通常參數量更大，優勢不在參數少。",
      C: "自注意力本身對順序不敏感，因此必須額外加入位置編碼。",
      D: "注意力的計算與快取隨序列長度成長，記憶體需求往往更高。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["Transformer", "自注意力", "平行化"],
      constraints: ["compute", "memory"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若序列極長（數萬個 token），自注意力隨長度平方成長的運算與記憶體會成為瓶頸，此時要改用稀疏或線性注意力的變形。",
    },
  },
  {
    id: "senior-ml-practice-q049",
    subjectId: "senior-ml",
    prompt:
      "卷積神經網路中「權重共享」帶來的主要好處是下列何者？",
    choices: [
      { id: "A", text: "大幅減少參數量，並讓同一特徵在影像不同位置都能被偵測" },
      { id: "B", text: "讓每個位置都有獨立的參數以提高彈性" },
      { id: "C", text: "使網路不需要激活函數" },
      { id: "D", text: "讓影像不需要前處理" },
    ],
    answer: "A",
    explanation:
      "同一個濾波器滑過整張影像，代表「偵測邊緣」這件事在任何位置都用同一組權重。參數量因此遠低於全連接層，也帶來位移不變性。",
    choiceExplanations: {
      B: "每個位置獨立參數正是全連接層的做法，參數量會爆炸且失去位移不變性。",
      C: "卷積層之後仍需要激活函數引入非線性。",
      D: "正規化、尺寸調整等前處理依然必要。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["權重共享", "參數量", "位移不變性"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若影像的不同區域本來就該用不同規則判讀（例如固定版面的表單），權重共享的假設反而不利，該考慮加入位置資訊。",
    },
  },
  {
    id: "senior-ml-practice-q050",
    subjectId: "senior-ml",
    prompt:
      "在深度學習框架中，「自動微分（Autograd）」的作用是下列何者？",
    choices: [
      { id: "A", text: "依運算圖自動計算各參數的梯度，免去手動推導反向傳播" },
      { id: "B", text: "自動選擇模型架構" },
      { id: "C", text: "自動蒐集訓練資料" },
      { id: "D", text: "自動部署模型到伺服器" },
    ],
    answer: "A",
    explanation:
      "框架在前向傳播時記錄運算圖，反向時依鏈鎖律自動推算每個參數的梯度。這讓研究者能自由設計模型而不必為每個新結構手推導數。",
    choiceExplanations: {
      B: "架構搜尋是 NAS 的範疇，與自動微分無關。",
      C: "資料蒐集屬於資料工程，框架不會代勞。",
      D: "部署由 MLOps 工具鏈負責，不是自動微分的功能。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["自動微分", "運算圖", "反向傳播"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若運算中含有不可微分的步驟（例如取整數或抽樣），自動微分就斷在那裡，需要改用可微分的近似或梯度估計技巧。",
    },
  },
  {
    id: "senior-ml-practice-q051",
    subjectId: "senior-ml",
    prompt:
      "訓練深度模型時把資料分成小批次，批次大小（Batch Size）過大最可能帶來下列哪一種影響？",
    choices: [
      { id: "A", text: "訓練必定無法收斂" },
      { id: "B", text: "一定能提升模型準確率" },
      { id: "C", text: "記憶體需求上升，且梯度雜訊減少可能使模型較易停在較差的解" },
      { id: "D", text: "資料會自動被壓縮" },
    ],
    answer: "C",
    explanation:
      "大批次讓梯度估計更精確但也更平滑，少了小批次那點雜訊帶來的探索能力，泛化有時反而變差；同時每步的記憶體佔用明顯上升。實務上常需搭配調整學習率。",
    choiceExplanations: {
      A: "大批次通常仍能收斂，只是收斂到的解未必更好。",
      B: "批次大小與準確率沒有單調關係，過大過小都可能有害。",
      D: "批次大小只影響每次載入的樣本數，不會壓縮資料。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["批次大小", "梯度雜訊", "泛化"],
      constraints: ["memory", "compute"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若同時按比例調高學習率並加上暖身，大批次的泛化劣勢往往可以被補回來——批次大小不能單獨調整。",
    },
  },
  {
    id: "senior-ml-practice-q052",
    subjectId: "senior-ml",
    prompt:
      "以預訓練模型做遷移學習時，「凍結前面幾層、只訓練最後幾層」的主要理由是下列何者？",
    choices: [
      { id: "A", text: "凍結可以增加資料量" },
      { id: "B", text: "前面層的參數一定是錯的" },
      { id: "C", text: "後面層不需要訓練" },
      { id: "D", text: "前面層學到的是通用低階特徵，凍結可在小資料上避免過擬合並節省成本" },
    ],
    answer: "D",
    explanation:
      "淺層學到的是邊緣、紋理這類跨任務通用的特徵，深層才逐漸任務化。目標資料少時凍結淺層能大幅減少可訓練參數，降低過擬合風險也省算力。",
    choiceExplanations: {
      A: "凍結是訓練策略，不會改變手上的資料量。",
      B: "前面層的參數正是預訓練的成果，是要被保留利用的資產。",
      C: "凍結的是前面層，後面層恰恰是需要以新資料訓練的部分。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["凍結層", "通用低階特徵", "小資料微調"],
      constraints: ["labeled_data_scarcity", "compute"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若目標資料量充足、且與預訓練領域差距很大，全模型微調通常表現更好——凍結是資料稀少時的保護措施。",
    },
  },

  // ── L23301 數據準備與特徵工程（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q053",
    subjectId: "senior-ml",
    prompt:
      "對訓練集與測試集做特徵標準化時，正確的做法是下列何者？",
    choices: [
      { id: "A", text: "分別以各自的平均與標準差轉換" },
      { id: "B", text: "以訓練集計算平均與標準差，並用同一組參數轉換測試集" },
      { id: "C", text: "以全部資料（含測試集）計算後再切分" },
      { id: "D", text: "只轉換訓練集，測試集維持原始值" },
    ],
    answer: "B",
    explanation:
      "轉換參數必須只從訓練集學得，否則測試集的統計資訊會滲入訓練流程，形成資料洩漏而高估效能。上線時同樣以這組固定參數處理新資料。",
    choiceExplanations: {
      A: "各自標準化會讓同一個原始值在兩邊被映射到不同數值，模型的判斷基準因此錯位。",
      C: "以全部資料計算等於讓測試集資訊參與了前處理，是典型的資料洩漏。",
      D: "只轉換一邊會讓訓練與推論的輸入尺度完全不同，預測必然錯亂。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["標準化參數", "資料洩漏", "訓練與推論一致"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若上線後資料分布明顯漂移，固定的舊參數會讓輸入尺度失真，此時要重新以新的訓練資料計算並同步更新推論端。",
    },
  },
  {
    id: "senior-ml-practice-q054",
    subjectId: "senior-ml",
    prompt:
      "在時間序列預測中建立「落後特徵（Lag Features）」的意義是下列何者？",
    choices: [
      { id: "A", text: "把時間欄位刪除" },
      { id: "B", text: "把未來的數值當作特徵" },
      { id: "C", text: "以過去時點的數值作為預測當前值的輸入" },
      { id: "D", text: "把所有樣本打散重排" },
    ],
    answer: "C",
    explanation:
      "落後特徵讓模型看到「昨天、上週同期」的值，把時間上的依賴關係轉成一般的表格特徵，是時序建模最基本也最有效的手法。",
    choiceExplanations: {
      A: "刪除時間欄位等於丟掉序列結構，無法建立任何時序關係。",
      B: "使用未來數值會造成嚴重的資料洩漏，上線時根本取不到。",
      D: "打散重排會破壞時間順序，讓落後關係無從定義。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["落後特徵", "時序依賴", "表格化"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若預測時點取不到最近一期的實際值（例如結算有兩週延遲），落後期數就必須從那個延遲之後起算，否則上線即失效。",
    },
  },
  {
    id: "senior-ml-practice-q055",
    subjectId: "senior-ml",
    prompt:
      "對高基數類別特徵（如上萬個商品編號）使用「目標編碼（Target Encoding）」時，最需要防範的問題是下列何者？",
    choices: [
      { id: "A", text: "無法用於樹模型" },
      { id: "B", text: "編碼後維度會爆增" },
      { id: "C", text: "以同一筆樣本的標籤參與編碼造成洩漏，須用交叉折疊或留一法計算" },
      { id: "D", text: "會使樣本數減少" },
    ],
    answer: "C",
    explanation:
      "目標編碼以該類別的標籤平均取代原值，若計算時包含了樣本自己，等於把答案偷渡進特徵。標準做法是在折外資料上計算，並加入平滑處理稀有類別。",
    choiceExplanations: {
      A: "目標編碼在梯度提升樹上非常常用，並無此限制。",
      B: "維度爆增是 one-hot 的問題；目標編碼把類別壓成單一數值，反而降維。",
      D: "編碼只改變欄位的表示方式，不影響樣本筆數。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["目標編碼", "折外計算", "洩漏防範"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若某個類別在訓練集中只出現一兩次，即使折外計算，編碼值仍極不穩定，需要以全域平均做平滑或直接歸為「其他」。",
    },
  },
  {
    id: "senior-ml-practice-q056",
    subjectId: "senior-ml",
    prompt:
      "對嚴重右偏的特徵取對數轉換，主要目的是下列何者？",
    choices: [
      { id: "A", text: "壓縮長尾使分布較接近對稱，減輕極端值的主導" },
      { id: "B", text: "增加特徵的數量" },
      { id: "C", text: "把連續變數轉成類別" },
      { id: "D", text: "刪除離群值" },
    ],
    answer: "A",
    explanation:
      "對數把大數值壓得更多、小數值壓得較少，長尾因此被拉近，許多假設常態或對尺度敏感的模型表現會改善。注意零與負值需先平移處理。",
    choiceExplanations: {
      B: "轉換是就地改變數值，不會新增欄位。",
      C: "取對數後仍是連續值，要變成類別需要分箱。",
      D: "極端值仍在，只是被壓縮到較近的位置，並未被刪除。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["對數轉換", "右偏", "極端值"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若特徵含有 0 或負值，直接取對數會失效，必須先平移（如 log1p）或改用 Box-Cox、Yeo-Johnson 轉換。",
    },
  },
  {
    id: "senior-ml-practice-q057",
    subjectId: "senior-ml",
    prompt:
      "特徵選擇中的「包裝法（Wrapper Method）」相較於「過濾法（Filter Method）」，主要差異是下列何者？",
    choices: [
      { id: "A", text: "兩者都必須使用深度學習" },
      { id: "B", text: "包裝法完全不需要訓練模型" },
      { id: "C", text: "過濾法一定得到更好的結果" },
      { id: "D", text: "包裝法以實際模型的表現評估特徵子集，計算成本較高但更貼近目標" },
    ],
    answer: "D",
    explanation:
      "過濾法只看特徵與目標的統計關聯（如相關係數、卡方），快但忽略特徵組合與模型特性；包裝法反覆訓練模型來評估子集，貼近實際目標但成本高得多。",
    choiceExplanations: {
      A: "兩種方法都與模型類型無關，傳統模型同樣適用。",
      B: "包裝法的核心正是以模型表現作為評估依據，必然要訓練模型。",
      C: "過濾法速度快但未必更好，兩者是效率與貼近度的取捨。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["包裝法", "過濾法", "特徵選擇"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若特徵多達數千個、每次訓練又很貴，包裝法的組合爆炸會讓它不可行，此時要先以過濾法粗篩再包裝細選。",
    },
  },
  {
    id: "senior-ml-practice-q058",
    subjectId: "senior-ml",
    prompt:
      "工廠感測資料中，同一台機台的多筆讀值高度自相關。若以隨機切分建立訓練與測試集，最可能造成下列何者？",
    choices: [
      { id: "A", text: "特徵數量增加" },
      { id: "B", text: "模型無法訓練" },
      { id: "C", text: "資料量減少" },
      { id: "D", text: "測試分數虛高，因為測試樣本與訓練樣本幾乎重複" },
    ],
    answer: "D",
    explanation:
      "相鄰時點的讀值幾乎相同，隨機切分會把「幾乎同一筆」的資料分到兩邊，模型看似表現極好，實際上只是記住了訓練樣本。應改以時間或機台為單位切分。",
    choiceExplanations: {
      A: "切分不會產生新的特徵欄位。",
      B: "模型仍然可以訓練，問題出在評估失真而非無法運作。",
      C: "切分方式不改變資料總量。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["自相關", "隨機切分", "評估失真"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若目標是「預測這台機台的下一秒」而非推廣到新機台，依時間切分同一台的資料就是正確設計，不構成洩漏。",
    },
  },
  {
    id: "senior-ml-practice-q059",
    subjectId: "senior-ml",
    prompt:
      "以 SMOTE 處理類別不平衡時，其作法是下列何者？",
    choices: [
      { id: "A", text: "依少數類別樣本在特徵空間的鄰近關係合成新的少數類別樣本" },
      { id: "B", text: "直接複製少數類別樣本多份" },
      { id: "C", text: "刪除全部多數類別樣本" },
      { id: "D", text: "把少數類別標籤改成多數類別" },
    ],
    answer: "A",
    explanation:
      "SMOTE 在少數類樣本與其近鄰之間的連線上插值產生新樣本，比單純複製更能擴大決策區域。要注意它應只在訓練折內執行，否則會造成評估洩漏。",
    choiceExplanations: {
      B: "單純複製是隨機過採樣，容易讓模型過度記憶那幾筆樣本。",
      C: "刪光多數類別會失去正常樣態的資訊，模型無從學會分辨。",
      D: "竄改標籤會直接破壞學習訊號，是錯誤的做法。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["SMOTE", "合成少數類", "插值"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若少數類樣本本身就散落各處、彼此不成群，兩點之間的插值可能落在多數類的區域，反而製造出錯誤的訓練訊號。",
    },
  },
  {
    id: "senior-ml-practice-q060",
    subjectId: "senior-ml",
    prompt:
      "在特徵工程中加入「領域知識衍生特徵」（如把身高體重換算成 BMI）的主要價值是下列何者？",
    choices: [
      { id: "A", text: "一定能減少模型的訓練時間" },
      { id: "B", text: "把有意義的關係直接提供給模型，減少模型自行摸索所需的資料量" },
      { id: "C", text: "可以完全取代原始特徵" },
      { id: "D", text: "可以免除模型評估" },
    ],
    answer: "B",
    explanation:
      "模型要自己從身高與體重學到非線性的比值關係需要大量樣本；直接給 BMI 等於把領域知識注入，讓模型省下摸索成本，在中小型資料上效益尤其明顯。",
    choiceExplanations: {
      A: "多一個特徵通常不會縮短訓練時間，價值在於表現而非速度。",
      C: "原始特徵往往仍帶有衍生特徵沒涵蓋的資訊，通常兩者並存。",
      D: "無論特徵怎麼設計，都必須以獨立資料評估成效。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["領域知識特徵", "衍生變數", "樣本效率"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若資料量極大、模型也有足夠容量自行學到該關係，手工衍生特徵的邊際效益就明顯下降。",
    },
  },

  // ── L23302 模型選擇與架構設計（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q061",
    subjectId: "senior-ml",
    prompt:
      "在中小型表格式資料上進行分類任務，實務上通常最先嘗試的模型是下列何者？",
    choices: [
      { id: "A", text: "大型 Transformer 模型" },
      { id: "B", text: "梯度提升樹或隨機森林等樹系集成模型" },
      { id: "C", text: "需大量樣本的深層卷積網路" },
      { id: "D", text: "生成對抗網路" },
    ],
    answer: "B",
    explanation:
      "樹系集成對特徵尺度不敏感、能自然處理類別與缺失值、在中小型表格資料上表現通常優於深度網路，且訓練快、調參門檻低，是合理的第一選擇。",
    choiceExplanations: {
      A: "Transformer 需要大量資料才能發揮，在中小型表格資料上常不敵樹模型。",
      C: "卷積網路的歸納偏置針對影像的空間結構，表格資料沒有這種結構。",
      D: "生成對抗網路用於生成資料，不是分類任務的工具。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["樹系集成", "表格資料", "模型選擇"],
      constraints: ["data_volume", "compute"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若資料是影像、文字或語音這類非結構化輸入，樹模型的優勢消失，深度網路才是合理的起點。",
    },
  },
  {
    id: "senior-ml-practice-q062",
    subjectId: "senior-ml",
    prompt:
      "在模型選擇時，若專案有嚴格的推論延遲上限，下列考量何者最重要？",
    choices: [
      { id: "A", text: "只考慮訓練時間" },
      { id: "B", text: "一律選擇準確率最高的模型" },
      { id: "C", text: "在滿足延遲上限的模型中比較預測品質，必要時以壓縮換取速度" },
      { id: "D", text: "只考慮模型的知名度" },
    ],
    answer: "C",
    explanation:
      "延遲上限是硬性約束，超過就無法上線。正確的順序是先以約束篩掉不可行的選項，再在可行集合中比較品質；量化、剪枝與蒸餾則是在品質與速度間換取空間的工具。",
    choiceExplanations: {
      A: "訓練時間是開發成本，與線上服務能否達標無關。",
      B: "準確率最高但超過延遲上限的模型根本不能用，選了也是白選。",
      D: "知名度不是工程指標，無法保證符合本專案的約束。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["延遲上限", "硬性約束", "模型壓縮"],
      constraints: ["latency", "quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若延遲上限其實有彈性（例如可先回傳暫時結果再更新），約束就從硬性變成軟性，模型選擇的空間也隨之放寬。",
    },
  },
  {
    id: "senior-ml-practice-q063",
    subjectId: "senior-ml",
    prompt:
      "「奧坎剃刀」原則應用在模型選擇上，意味著下列何者？",
    choices: [
      { id: "A", text: "模型越複雜越容易解釋" },
      { id: "B", text: "永遠選擇參數最多的模型" },
      { id: "C", text: "在表現相當時優先選擇較簡單的模型" },
      { id: "D", text: "簡單模型一定比複雜模型準確" },
    ],
    answer: "C",
    explanation:
      "表現相當時，簡單模型更容易解釋、部署與維護，過擬合風險也較低。這是取捨原則而非絕對規則——若複雜模型確實顯著更好，額外的複雜度就有其價值。",
    choiceExplanations: {
      A: "複雜度上升通常讓解釋變難，敘述與事實相反。",
      B: "參數多不代表更好，反而增加過擬合與維運負擔。",
      D: "簡單模型未必更準，原則說的是「表現相當時」才選簡單的。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["奧坎剃刀", "簡單優先", "取捨原則"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若複雜模型的表現顯著更好、且差距在業務上有意義，額外的複雜度就有其價值——這條原則的前提是「表現相當」。",
    },
  },
  {
    id: "senior-ml-practice-q064",
    subjectId: "senior-ml",
    prompt:
      "設計神經網路架構時，若訓練集與驗證集的損失都居高不下，最可能的問題是下列何者？",
    choices: [
      { id: "A", text: "欠擬合，模型容量不足或特徵資訊不夠" },
      { id: "B", text: "過擬合，應立即加強正則化" },
      { id: "C", text: "資料洩漏" },
      { id: "D", text: "測試集標籤錯誤" },
    ],
    answer: "A",
    explanation:
      "兩邊都差代表模型連訓練資料的規律都沒學到，屬於欠擬合。此時應增加模型容量、延長訓練、減少正則化強度，或回頭檢查特徵是否帶有足夠資訊。",
    choiceExplanations: {
      B: "過擬合的典型症狀是訓練損失低而驗證損失高，與此處描述相反。",
      C: "資料洩漏會讓驗證分數異常好，不會兩邊都差。",
      D: "測試集標籤問題不會影響訓練與驗證階段的損失表現。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["欠擬合", "模型容量", "特徵資訊量"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若訓練損失很低而驗證損失居高，診斷就翻轉為過擬合，處方也從「加容量」變成「加正則化」。",
    },
  },
  {
    id: "senior-ml-practice-q065",
    subjectId: "senior-ml",
    prompt:
      "把多個不同類型的模型組合成「堆疊集成（Stacking）」時，其基本作法是下列何者？",
    choices: [
      { id: "A", text: "把所有模型的訓練資料合併成一份" },
      { id: "B", text: "把各模型的參數直接相加" },
      { id: "C", text: "隨機選一個模型的結果輸出" },
      { id: "D", text: "以各基模型的預測作為輸入，訓練一個上層模型做最終決策" },
    ],
    answer: "D",
    explanation:
      "堆疊讓上層的元學習器學會「什麼情況下該相信哪個基模型」，通常比單純平均更能發揮各模型的互補性。基模型的預測必須以折外方式產生，否則會洩漏。",
    choiceExplanations: {
      A: "合併訓練資料是資料層面的操作，與集成多個模型的預測無關。",
      B: "不同類型模型的參數意義完全不同，相加沒有任何意義。",
      C: "隨機選取等於放棄集成的優勢，效果不會優於單一模型。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["堆疊集成", "元學習器", "折外預測"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若基模型的預測不是以折外方式產生，上層模型會看到被記憶過的答案，堆疊反而製造出嚴重的洩漏。",
    },
  },
  {
    id: "senior-ml-practice-q066",
    subjectId: "senior-ml",
    prompt:
      "醫療應用選擇模型時，若監理要求必須能逐案說明判斷依據，下列取捨何者最合理？",
    choices: [
      { id: "A", text: "改為完全人工判斷即可" },
      { id: "B", text: "選擇準確率最高的黑箱模型並拒絕提供說明" },
      { id: "C", text: "以模型的信心分數作為完整的說明" },
      { id: "D", text: "接受略低的準確率，改用本質可解釋的模型或搭配可靠的解釋方法" },
    ],
    answer: "D",
    explanation:
      "在受監理場域，「無法說明」等於不能上線。犧牲幾個百分點換取可解釋性，往往是讓專案真正落地的唯一途徑。",
    choiceExplanations: {
      A: "全人工放棄了模型的效率價值，且題幹要求的是可解釋而非不使用模型。",
      B: "拒絕提供說明會讓模型無法通過審查，準確率再高也沒有機會使用。",
      C: "信心分數只說明模型有多確定，並未說明它依據了哪些臨床特徵。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["可解釋性", "監理要求", "準確率取捨"],
      constraints: ["explainability", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若監理只要求說明「模型整體使用了哪些因子與方向」，黑箱模型搭配事後解釋工具也可能過關——要求的解釋粒度決定了取捨。",
    },
  },
  {
    id: "senior-ml-practice-q067",
    subjectId: "senior-ml",
    prompt:
      "在架構設計中，「模型蒸餾（Knowledge Distillation）」的作法是下列何者？",
    choices: [
      { id: "A", text: "以大模型的輸出作為軟標籤訓練小模型，讓小模型逼近大模型的表現" },
      { id: "B", text: "把模型的參數直接刪除一半" },
      { id: "C", text: "把兩個模型的權重取平均" },
      { id: "D", text: "把訓練資料減半" },
    ],
    answer: "A",
    explanation:
      "教師模型輸出的機率分布帶有類別之間的相似度資訊（軟標籤），比硬標籤更豐富。學生模型據此學習，能以小得多的體積接近教師的表現，適合端側部署。",
    choiceExplanations: {
      B: "直接刪參數是剪枝，且無差別刪除會嚴重損害表現。",
      C: "權重平均適用於同架構模型的合併，與蒸餾的師生關係不同。",
      D: "減少資料只會讓模型更差，與蒸餾的目的無關。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["知識蒸餾", "軟標籤", "端側部署"],
      constraints: ["compute"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若教師模型本身表現就不佳，蒸餾出的學生只會複製它的錯誤——蒸餾傳遞的是教師的知識，包含它的缺陷。",
    },
  },
  {
    id: "senior-ml-practice-q068",
    subjectId: "senior-ml",
    prompt:
      "評估兩個候選模型時，若兩者的平均表現接近但其中一個在不同折之間的變異明顯較大，較合理的選擇是下列何者？",
    choices: [
      { id: "A", text: "一律選擇單折最高分的模型" },
      { id: "B", text: "傾向選擇變異較小的模型，因為它在新資料上的表現較可預期" },
      { id: "C", text: "選擇訓練時間較長的模型" },
      { id: "D", text: "隨機選一個" },
    ],
    answer: "B",
    explanation:
      "折間變異大代表模型對資料切分很敏感，上線後表現的不確定性也高。在平均相當時，穩定性是實務上更重要的選擇依據。",
    choiceExplanations: {
      A: "單折最高分可能只是運氣好，用它做決策等於挑選雜訊。",
      C: "訓練時間長短與泛化能力沒有關係。",
      D: "隨機選擇放棄了手上的評估資訊，是不負責任的做法。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["折間變異", "穩定性", "模型選擇"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若變異大的那個模型平均表現明顯更好、且差距遠超過折間波動，就值得承擔不確定性——穩定性優先的前提是「平均相當」。",
    },
  },

  // ── L23303 模型訓練、評估與驗證（8 題）────────────────────────
  {
    id: "senior-ml-practice-q069",
    subjectId: "senior-ml",
    prompt:
      "在資料切分中，「驗證集」與「測試集」的角色差異是下列何者？",
    choices: [
      { id: "A", text: "兩者可以互換使用且沒有差別" },
      { id: "B", text: "驗證集用於調整超參數與選模型，測試集只在最後評估一次" },
      { id: "C", text: "測試集用於訓練，驗證集用於推論" },
      { id: "D", text: "驗證集必須比訓練集大" },
    ],
    answer: "B",
    explanation:
      "反覆用同一份資料調參，等於間接把它學進模型，分數會樂觀偏誤。因此另留一份完全沒碰過的測試集，最後只用一次，才能得到接近真實的泛化估計。",
    choiceExplanations: {
      A: "混用會讓測試分數失去公正性，兩者的角色必須嚴格區分。",
      C: "測試集絕不能用於訓練，這是評估設計的基本紀律。",
      D: "驗證集通常遠小於訓練集，大小不是它的定義性條件。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["驗證集", "測試集", "評估紀律"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若測試集被拿來反覆比較模型，它就退化成第二個驗證集，樂觀偏誤又會回來。",
    },
  },
  {
    id: "senior-ml-practice-q070",
    subjectId: "senior-ml",
    prompt:
      "分層抽樣（Stratified Sampling）在切分資料時的作用是下列何者？",
    choices: [
      { id: "A", text: "刪除少數類別以簡化問題" },
      { id: "B", text: "讓每個子集的樣本數完全相同" },
      { id: "C", text: "維持各子集中類別比例與原資料一致" },
      { id: "D", text: "把樣本依數值大小排序後切分" },
    ],
    answer: "C",
    explanation:
      "類別不平衡時，隨機切分可能讓測試集裡幾乎沒有少數類別樣本，評估因此不穩定。分層抽樣確保每個子集的類別組成與整體一致。",
    choiceExplanations: {
      A: "刪除少數類別會讓模型完全學不到它，與分層的目的相反。",
      B: "各子集大小由切分比例決定，分層關心的是類別比例而非總數。",
      D: "依數值排序切分會造成訓練與測試分布截然不同，是嚴重的錯誤做法。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["分層抽樣", "類別比例", "評估穩定性"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若資料是時間序列，就不能為了維持類別比例而打散時間順序——分層與時間切分衝突時，時間優先。",
    },
  },
  {
    id: "senior-ml-practice-q071",
    subjectId: "senior-ml",
    prompt:
      "迴歸模型常用的 RMSE 相較於 MAE，其特性是下列何者？",
    choices: [
      { id: "A", text: "數值一定小於 MAE" },
      { id: "B", text: "完全不受離群值影響" },
      { id: "C", text: "對大誤差的懲罰更重，因此對離群值較敏感" },
      { id: "D", text: "只能用於分類問題" },
    ],
    answer: "C",
    explanation:
      "RMSE 先平方再開根號，大誤差被平方後放大，因此對離群樣本特別敏感。若場域中偶發的大誤差代價特別高，用 RMSE 是合理的；若不希望被少數極端值主導，MAE 更穩健。",
    choiceExplanations: {
      A: "由不等式可知 RMSE 恆大於或等於 MAE，方向相反。",
      B: "平方項讓它比 MAE 更容易被離群值拉動，敘述與事實相反。",
      D: "兩者都是迴歸指標，分類使用的是準確率、F1 等。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["RMSE", "MAE", "離群值敏感度"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若偶發的大誤差代價特別高（例如電網負載預測），RMSE 的重罰正是想要的；若不希望被少數離群拉著走，就選 MAE。",
    },
  },
  {
    id: "senior-ml-practice-q072",
    subjectId: "senior-ml",
    prompt:
      "在極度不平衡的分類問題中，PR 曲線（Precision-Recall Curve）通常比 ROC 曲線更有參考價值，原因是下列何者？",
    choices: [
      { id: "A", text: "ROC 的偽陽性率分母包含大量負樣本，即使誤報很多仍顯得漂亮" },
      { id: "B", text: "PR 曲線計算比較快" },
      { id: "C", text: "ROC 曲線無法繪製" },
      { id: "D", text: "PR 曲線不需要模型輸出分數" },
    ],
    answer: "A",
    explanation:
      "負樣本極多時，幾百個偽陽性除以數十萬負樣本仍是很小的偽陽性率，ROC 因此看起來很好；PR 曲線的精確率直接反映「報出來的有多少是真的」，更貼近實務關切。",
    choiceExplanations: {
      B: "兩者的計算成本相近，速度不是選擇理由。",
      C: "ROC 曲線照樣可以繪製，只是解讀容易過度樂觀。",
      D: "兩種曲線都需要模型輸出連續分數才能掃描門檻。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["PR曲線", "ROC曲線", "類別不平衡"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若正負樣本比例接近，ROC 與 PR 給出的結論通常一致，此時 ROC 的門檻無關性反而更方便比較。",
    },
  },
  {
    id: "senior-ml-practice-q073",
    subjectId: "senior-ml",
    prompt:
      "模型的「校準（Calibration）」良好指的是下列何者？",
    choices: [
      { id: "A", text: "模型的訓練損失接近零" },
      { id: "B", text: "模型的準確率達到 80%" },
      { id: "C", text: "模型的參數經過標準化" },
      { id: "D", text: "模型輸出 0.8 的那些樣本中，實際約有 80% 為正類" },
    ],
    answer: "D",
    explanation:
      "校準關心的是輸出機率的可信度。在需要依機率做期望值決策（如定價、風險額度）的場景，校準比單純的排序能力更重要，可用可靠度圖或 Brier 分數評估。",
    choiceExplanations: {
      A: "訓練損失接近零往往代表過擬合，反而可能讓機率過度自信。",
      B: "準確率衡量的是判斷對錯的比例，與輸出機率是否誠實無關。",
      C: "參數標準化是訓練技巧，與機率的可信度無關。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["校準", "機率可信度", "Brier分數"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若下游只用排序（例如挑出風險最高的前一百名），校準就不重要，AUC 這類排序指標才是重點。",
    },
  },
  {
    id: "senior-ml-practice-q074",
    subjectId: "senior-ml",
    prompt:
      "以交叉驗證選出最佳超參數後，若又用同一份交叉驗證的分數宣稱模型效能，最主要的問題是下列何者？",
    choices: [
      { id: "A", text: "會導致模型無法訓練" },
      { id: "B", text: "交叉驗證無法用於超參數選擇" },
      { id: "C", text: "分數一定會被低估" },
      { id: "D", text: "該分數已被用於選擇，帶有樂觀偏誤，應以獨立測試集重新評估" },
    ],
    answer: "D",
    explanation:
      "用來挑選的分數等於已經「看過」那份資料，挑出的往往是剛好在該切分上運氣好的組合。正確做法是保留獨立測試集，或採用巢狀交叉驗證。",
    choiceExplanations: {
      A: "這是評估方法論的問題，不影響模型能否訓練。",
      B: "交叉驗證正是超參數選擇的標準工具，問題在於別拿同一份分數當最終成績。",
      C: "偏誤的方向是高估而非低估。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["選擇偏誤", "巢狀交叉驗證", "獨立測試集"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若只試過一組超參數、沒有挑選的動作，那份交叉驗證分數就沒有被污染，可以直接引用。",
    },
  },
  {
    id: "senior-ml-practice-q075",
    subjectId: "senior-ml",
    prompt:
      "工廠品檢模型上線後，要持續確認其效能是否退化，最需要建立的是下列何者？",
    choices: [
      { id: "A", text: "以人工抽檢建立持續的標籤回饋，並定期比對模型預測" },
      { id: "B", text: "只監控伺服器的 CPU 使用率" },
      { id: "C", text: "只記錄模型的呼叫次數" },
      { id: "D", text: "每年重新訓練一次即可，不需監控" },
    ],
    answer: "A",
    explanation:
      "沒有新的真實標籤就無法計算上線後的準確率。以抽檢建立標籤回饋迴路，才能持續量測效能、及早發現漂移，也為重訓提供新資料。",
    choiceExplanations: {
      B: "CPU 使用率反映的是系統負載，模型全部答錯時它可能完全正常。",
      C: "呼叫次數只說明使用量，與預測品質無關。",
      D: "沒有監控就不知道何時該重訓，一年的間隔可能已造成大量誤判。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["標籤回饋迴路", "抽檢", "效能監控"],
      constraints: ["maintainability", "cost"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若產線本來就對每一件成品做全檢，真實標籤自然產生，就不必另外設計抽檢——抽檢是取得標籤成本高時的折衷。",
    },
  },
  {
    id: "senior-ml-practice-q076",
    subjectId: "senior-ml",
    prompt:
      "評估模型時，除了整體指標外還應「分群檢視」（如依年齡層、地區分別計算），主要理由是下列何者？",
    choices: [
      { id: "A", text: "分群可以提高整體準確率" },
      { id: "B", text: "整體表現良好可能掩蓋特定子群體上的明顯劣化" },
      { id: "C", text: "分群可以減少運算成本" },
      { id: "D", text: "分群可以取代測試集" },
    ],
    answer: "B",
    explanation:
      "整體平均會被多數群體主導，某個少數群體即使表現極差也看不出來。分群評估既是公平性的基本要求，也常是發現資料代表性不足的第一線索。",
    choiceExplanations: {
      A: "分群檢視是評估方式，不會改變模型本身的表現。",
      C: "多算幾組指標只會增加而非減少運算。",
      D: "分群仍是在同一份測試資料上計算，無法取代獨立測試集的角色。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["分群評估", "子群體劣化", "公平性"],
      constraints: ["fairness", "quality"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若某個子群體的樣本數太少，分群指標本身的波動會大過真實差異，此時要先累積樣本或合併相近群體再看。",
    },
  },

  // ── L23304 模型調整與優化（8 題）──────────────────────────────
  {
    id: "senior-ml-practice-q077",
    subjectId: "senior-ml",
    prompt:
      "關於 L1 與 L2 正則化的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "L1 讓權重趨近 0 但不為 0，L2 產生稀疏解" },
      { id: "B", text: "L1 會把部分權重壓到 0 而產生稀疏解，L2 讓權重趨近 0 但不為 0" },
      { id: "C", text: "兩者都不會影響權重大小" },
      { id: "D", text: "兩者都必定提升訓練集表現" },
    ],
    answer: "B",
    explanation:
      "L1 懲罰權重絕對值，其在 0 點不可微的角點使最佳解容易落在座標軸上，因而產生稀疏解、兼具特徵選擇效果；L2 懲罰平方項，只是把權重整體縮小。",
    choiceExplanations: {
      A: "兩者的效果被寫反了，稀疏解來自 L1 而非 L2。",
      C: "正則化的作用正是透過懲罰項限制權重大小。",
      D: "正則化通常會略微犧牲訓練集表現，換取驗證集的泛化能力。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["L1正則化", "L2正則化", "稀疏解"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若目標是保留全部特徵、只壓抑係數幅度以穩定模型，L2 才對；要順便做特徵篩選才選 L1。",
    },
  },
  {
    id: "senior-ml-practice-q078",
    subjectId: "senior-ml",
    prompt:
      "超參數搜尋中，「隨機搜尋」相較於「網格搜尋」的優勢是下列何者？",
    choices: [
      { id: "A", text: "不需要設定搜尋範圍" },
      { id: "B", text: "一定能找到全域最佳組合" },
      { id: "C", text: "在相同預算下更可能覆蓋到重要超參數的有效範圍" },
      { id: "D", text: "只適用於深度學習" },
    ],
    answer: "C",
    explanation:
      "實務上只有少數超參數真正重要。網格搜尋在不重要的維度上浪費了大量嘗試，隨機搜尋則讓每次嘗試在重要維度上都取到不同的值，相同預算下效率更高。",
    choiceExplanations: {
      A: "仍需為每個超參數指定分布或範圍，否則無從抽樣。",
      B: "隨機搜尋是抽樣方法，沒有全域最佳的保證。",
      D: "任何有超參數的模型都適用，包括樹模型與線性模型。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["隨機搜尋", "網格搜尋", "搜尋效率"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若只有兩三個超參數、每個又只有少數幾種合理取值，網格搜尋能窮盡所有組合，反而比隨機更可靠。",
    },
  },
  {
    id: "senior-ml-practice-q079",
    subjectId: "senior-ml",
    prompt:
      "貝氏最佳化（Bayesian Optimization）用於超參數調整時的核心想法是下列何者？",
    choices: [
      { id: "A", text: "完全隨機挑選且不參考歷史結果" },
      { id: "B", text: "把所有組合都試一遍" },
      { id: "C", text: "以代理模型預測各組超參數的表現，據此挑選最有價值的下一次嘗試" },
      { id: "D", text: "只調整學習率一個參數" },
    ],
    answer: "C",
    explanation:
      "它用先前的嘗試建立表現的機率模型，再以採集函數在「可能很好」與「還不確定」之間權衡，挑出最值得試的下一組。單次訓練昂貴時特別划算。",
    choiceExplanations: {
      A: "不參考歷史就是隨機搜尋，貝氏最佳化的價值恰在於利用歷史資訊。",
      B: "全試一遍是網格搜尋，正是貝氏最佳化要避免的浪費。",
      D: "它可同時處理多個超參數，並不限於單一參數。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["貝氏最佳化", "代理模型", "採集函數"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若單次訓練極快、可以平行跑上千組，隨機搜尋的簡單與可平行反而勝過貝氏最佳化的序列式取樣。",
    },
  },
  {
    id: "senior-ml-practice-q080",
    subjectId: "senior-ml",
    prompt:
      "模型剪枝（Pruning）的主要目的是下列何者？",
    choices: [
      { id: "A", text: "移除影響甚微的連結或神經元，縮小模型並加速推論" },
      { id: "B", text: "增加模型的層數" },
      { id: "C", text: "刪除訓練資料中的離群值" },
      { id: "D", text: "把模型參數改成整數" },
    ],
    answer: "A",
    explanation:
      "訓練後的網路往往存在大量接近零、貢獻極小的權重。剪掉它們可縮小體積、降低運算量，通常再微調幾輪就能把精度損失補回來。",
    choiceExplanations: {
      B: "剪枝是減法，增加層數與它的目的完全相反。",
      C: "刪除離群值是資料清理，剪的是模型不是資料。",
      D: "把參數轉成整數是量化，與剪枝是兩種不同的壓縮手段。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["剪枝", "模型壓縮", "推論加速"],
      constraints: ["compute"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若硬體對稀疏運算沒有加速支援，非結構化剪枝雖然參數變少，實際推論卻不會變快——要改用結構化剪枝。",
    },
  },
  {
    id: "senior-ml-practice-q081",
    subjectId: "senior-ml",
    prompt:
      "量化感知訓練（QAT）相較於訓練後量化（PTQ）的主要差異是下列何者？",
    choices: [
      { id: "A", text: "兩者都會增加模型體積" },
      { id: "B", text: "QAT 完全不需要訓練資料" },
      { id: "C", text: "PTQ 的精度必定高於 QAT" },
      { id: "D", text: "QAT 在訓練時就模擬量化誤差，精度通常較佳但成本較高" },
    ],
    answer: "D",
    explanation:
      "PTQ 直接把訓練好的權重轉成低精度，流程簡單但可能掉點；QAT 在訓練迴圈中插入偽量化節點，讓模型學會適應量化誤差，精度較好但要重新訓練。",
    choiceExplanations: {
      A: "兩者都是為了縮小模型，體積會下降而非增加。",
      B: "QAT 必須跑訓練流程，一定需要資料。",
      C: "一般而言 QAT 的精度優於 PTQ，敘述方向相反。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["量化感知訓練", "訓練後量化", "精度與成本"],
      constraints: ["compute", "quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若 PTQ 的精度掉幅已在可接受範圍內，就沒必要付出 QAT 的重新訓練成本——先試簡單的那一個。",
    },
  },
  {
    id: "senior-ml-practice-q082",
    subjectId: "senior-ml",
    prompt:
      "在梯度提升樹中調高「樹的數量」同時調低「學習率」，通常帶來下列哪一種效果？",
    choices: [
      { id: "A", text: "模型會變成線性模型" },
      { id: "B", text: "一定會過擬合" },
      { id: "C", text: "訓練時間必定縮短" },
      { id: "D", text: "每棵樹的修正幅度變小、整體更平滑，泛化通常較佳但訓練較慢" },
    ],
    answer: "D",
    explanation:
      "小學習率讓每棵樹只做小幅修正，需要更多棵樹才能達到相同的擬合程度，但集成的結果較平滑、較不容易過度貼合雜訊。這是梯度提升最常見的調參取捨。",
    choiceExplanations: {
      A: "無論參數如何調整，樹模型都不會變成線性模型。",
      B: "小學習率搭配足夠的樹通常降低而非提高過擬合風險。",
      C: "樹變多會讓訓練時間增加，不是縮短。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["學習率", "樹的數量", "梯度提升調參"],
      constraints: ["compute", "quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若學習率調低但樹的數量沒有相應增加，模型會停在欠擬合——這兩個參數必須成對調整。",
    },
  },
  {
    id: "senior-ml-practice-q083",
    subjectId: "senior-ml",
    prompt:
      "若模型在訓練集表現遠優於驗證集，下列調整何者最直接？",
    choices: [
      { id: "A", text: "加強正則化、增加資料或簡化模型" },
      { id: "B", text: "增加模型層數與參數量" },
      { id: "C", text: "延長訓練時間直到訓練損失為零" },
      { id: "D", text: "把驗證集併入訓練集" },
    ],
    answer: "A",
    explanation:
      "這是典型的過擬合。三個方向都能收斂訓練與驗證之間的落差：限制模型的自由度、讓模型看到更多樣的資料，或直接降低模型容量。",
    choiceExplanations: {
      B: "增加容量會讓模型更容易記住訓練資料，落差只會擴大。",
      C: "訓練損失趨零通常代表把雜訊也背了下來，過擬合更嚴重。",
      D: "併入驗證集後就失去了偵測過擬合的能力，問題被掩蓋而非解決。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["過擬合", "正則化", "模型容量"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若訓練與驗證表現都差，診斷就翻轉成欠擬合，處方也從「限制容量」變成「增加容量或補特徵」。",
    },
  },
  {
    id: "senior-ml-practice-q084",
    subjectId: "senior-ml",
    prompt:
      "在調整分類門檻以符合業務需求時，下列做法何者最合理？",
    choices: [
      { id: "A", text: "一律使用 0.5" },
      { id: "B", text: "依偽陽性與偽陰性的實際成本，在驗證集上選出最適門檻" },
      { id: "C", text: "在測試集上反覆嘗試直到分數最好" },
      { id: "D", text: "隨機選一個門檻" },
    ],
    answer: "B",
    explanation:
      "門檻本質上是商業決策：兩種錯誤的代價不同，最適門檻就不會是 0.5。應在驗證集上依成本函數選定，再到測試集驗證一次。",
    choiceExplanations: {
      A: "0.5 只是預設值，只有在兩種錯誤代價相同且機率校準良好時才恰當。",
      C: "在測試集上反覆調整等於把測試集當驗證集用，分數會失去公正性。",
      D: "隨機選門檻放棄了所有可用資訊，結果不可預期。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["分類門檻", "錯誤成本", "驗證集選定"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型的機率輸出未經校準，依成本推導出的門檻也會偏掉，此時要先做校準再選門檻。",
    },
  },

  // ── L23401 數據隱私、安全與合規（8 題）────────────────────────
  {
    id: "senior-ml-practice-q085",
    subjectId: "senior-ml",
    prompt:
      "聯邦學習（Federated Learning）的核心特徵是下列何者？",
    choices: [
      { id: "A", text: "把所有資料集中到單一伺服器訓練" },
      { id: "B", text: "各方資料留在本地訓練，只交換模型更新以彙整成全域模型" },
      { id: "C", text: "只使用公開資料集訓練" },
      { id: "D", text: "由人工逐筆標註資料" },
    ],
    answer: "B",
    explanation:
      "原始資料自始至終不離開所屬機構，中央只彙整梯度或權重差異。這讓多家醫院或銀行能在不共享病歷、帳戶明細的前提下共同訓練模型。",
    choiceExplanations: {
      A: "集中資料正是聯邦學習要避免的做法。",
      C: "聯邦學習的價值恰在於使用各方的私有資料，而非公開資料。",
      D: "標註方式與聯邦學習的架構特性無關。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["聯邦學習", "本地訓練", "模型更新"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若模型更新本身就會洩漏個別樣本資訊，聯邦學習仍不夠，需要再疊上安全彙總或差分隱私。",
    },
  },
  {
    id: "senior-ml-practice-q086",
    subjectId: "senior-ml",
    prompt:
      "「成員推斷攻擊（Membership Inference Attack）」的目標是下列何者？",
    choices: [
      { id: "A", text: "讓模型的推論速度變慢" },
      { id: "B", text: "竊取模型的原始碼" },
      { id: "C", text: "判斷某筆特定資料是否曾被用於訓練該模型" },
      { id: "D", text: "刪除模型的權重" },
    ],
    answer: "C",
    explanation:
      "模型對訓練過的樣本通常表現得更有信心，攻擊者利用這個差異推斷某人是否在訓練集中。在醫療情境下，光是「這個人在糖尿病資料集裡」就已洩漏敏感資訊。",
    choiceExplanations: {
      A: "拖慢推論屬於阻斷服務類的攻擊，與推斷成員身分不同。",
      B: "竊取程式碼屬於一般的資訊安全事件，不是這種攻擊的目標。",
      D: "刪除權重是破壞行為，與從輸出推斷資訊的手法無關。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["成員推斷攻擊", "過度自信", "隱私風險"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型對訓練樣本與未見樣本的信心分布幾乎相同（泛化良好、無過擬合），這種攻擊的成功率就趨近隨機猜測。",
    },
  },
  {
    id: "senior-ml-practice-q087",
    subjectId: "senior-ml",
    prompt:
      "訓練資料中含有個人資料時，下列做法何者最符合資料最小化原則？",
    choices: [
      { id: "A", text: "把個資加密後仍全部保留在訓練資料中" },
      { id: "B", text: "先全部保留，日後再視需要刪除" },
      { id: "C", text: "只保留建模所必需的欄位，其餘識別資訊在前處理階段即移除" },
      { id: "D", text: "把個資複製多份備份以免遺失" },
    ],
    answer: "C",
    explanation:
      "沒被納入的資料就不會外洩，也不會被模型記憶。在資料進入訓練流程之前就砍掉非必要的識別欄位，是成本最低、效果最直接的隱私保護。",
    choiceExplanations: {
      A: "加密保護的是靜態儲存，訓練時仍需解密使用，模型依然可能記憶內容。",
      B: "「先留著再說」會讓風險持續累積，也違反目的限制原則。",
      D: "增加副本等於擴大暴露面，與最小化原則背道而馳。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["資料最小化", "前處理移除", "識別欄位"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若某個識別欄位本身就是有效的預測特徵（例如郵遞區號對應的區域風險），就不能單純刪除，該改以去識別化的粗化版本保留訊號。",
    },
  },
  {
    id: "senior-ml-practice-q088",
    subjectId: "senior-ml",
    prompt:
      "模型可能「記憶」訓練資料中的敏感內容並在輸出時重現。下列哪一項最能降低此風險？",
    choices: [
      { id: "A", text: "訓練前去識別化、對重複內容去重，並在上線前做輸出檢測" },
      { id: "B", text: "增加模型參數量" },
      { id: "C", text: "延長訓練時間讓模型記得更牢" },
      { id: "D", text: "不做任何測試直接上線" },
    ],
    answer: "A",
    explanation:
      "記憶風險與資料中是否含敏感內容、該內容重複幾次高度相關。從源頭去識別化與去重，再輔以上線前的紅隊測試檢查是否會被誘導吐出原文，是三道互補的防線。",
    choiceExplanations: {
      B: "參數量越大記憶能力通常越強，風險反而上升。",
      C: "訓練越久越容易逐字記憶，與降低風險的目標相反。",
      D: "不測試等於把風險完全暴露給使用者。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["訓練資料記憶", "去重", "輸出檢測"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若訓練資料本來就不含任何敏感內容（例如全為公開技術文件），記憶風險的嚴重度大幅下降，防護重點會轉向著作權而非隱私。",
    },
  },
  {
    id: "senior-ml-practice-q089",
    subjectId: "senior-ml",
    prompt:
      "資料當事人行使「刪除權」要求刪除其個資時，對已用該資料訓練的模型，最務實的處理方向是下列何者？",
    choices: [
      { id: "A", text: "把模型公開以示透明" },
      { id: "B", text: "只刪除原始資料即可，模型完全不必處理" },
      { id: "C", text: "拒絕刪除要求" },
      { id: "D", text: "刪除原始資料，並依風險評估決定是否重訓或採用機器遺忘技術" },
    ],
    answer: "D",
    explanation:
      "模型權重中可能仍留有該筆資料的影響，只刪來源不必然足夠。實務上須評估殘留風險，必要時重訓或採用機器遺忘（machine unlearning）方法，並留下處理紀錄。",
    choiceExplanations: {
      A: "公開模型不但無助於刪除，反而增加被反推訓練資料的風險。",
      B: "模型可能仍記得該筆資料的特徵，只刪來源未必消除風險。",
      C: "拒絕行使權利可能違反個資法規，並非可行選項。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["刪除權", "機器遺忘", "殘留風險"],
      constraints: ["privacy", "governance", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若該筆資料在訓練集中佔比極小、且模型已驗證無記憶跡象，殘留風險低到只刪來源即可，不必付出重訓成本。",
    },
  },
  {
    id: "senior-ml-practice-q090",
    subjectId: "senior-ml",
    prompt:
      "「資料毒化攻擊（Data Poisoning）」指的是下列何者？",
    choices: [
      { id: "A", text: "攻擊者複製模型參數" },
      { id: "B", text: "攻擊者竊聽模型的推論結果" },
      { id: "C", text: "攻擊者讓伺服器停止服務" },
      { id: "D", text: "攻擊者在訓練資料中注入惡意樣本，使模型學到錯誤行為" },
    ],
    answer: "D",
    explanation:
      "毒化發生在訓練階段：只要能影響訓練資料來源（如開放投稿、爬取的公開內容），就能植入後門或整體降低模型品質。防範重點在資料來源可信度與異常樣本偵測。",
    choiceExplanations: {
      A: "複製參數是模型竊取（model extraction），與注入惡意樣本不同。",
      B: "竊聽推論結果屬於推論階段的資訊洩漏，時機與手法都不同。",
      C: "讓服務中斷屬於阻斷服務攻擊，不涉及訓練資料。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["資料毒化", "訓練階段攻擊", "來源可信度"],
      constraints: ["security"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若訓練資料完全來自內部受控系統、外人無從投入樣本，毒化的攻擊面就不存在，防護重點會轉向推論階段的對抗樣本。",
    },
  },
  {
    id: "senior-ml-practice-q091",
    subjectId: "senior-ml",
    prompt:
      "在跨機構合作訓練模型時，若各方都不願提供原始資料，下列哪一組技術最常被搭配使用？",
    choices: [
      { id: "A", text: "聯邦學習搭配安全彙總或差分隱私" },
      { id: "B", text: "把資料公開在網路上" },
      { id: "C", text: "以電子郵件互相傳送資料庫備份" },
      { id: "D", text: "各自訓練後不做任何整合" },
    ],
    answer: "A",
    explanation:
      "聯邦學習讓資料不出門，安全彙總確保中央只看得到彙總後的更新，差分隱私再為更新加入雜訊以限制單一參與者的資訊洩漏。三者層層互補。",
    choiceExplanations: {
      B: "公開資料完全違背各方不願提供原始資料的前提。",
      C: "以郵件傳送備份是最高風險的資料交換方式，且同樣讓資料離開機構。",
      D: "各自訓練不整合就無法享受合作帶來的模型提升，等於沒有合作。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["聯邦學習", "安全彙總", "差分隱私"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若各方的資料分布差異極大（non-IID），聯邦學習的全域模型可能對誰都不夠好，此時要改用個人化聯邦或各自微調。",
    },
  },
  {
    id: "senior-ml-practice-q092",
    subjectId: "senior-ml",
    prompt:
      "為滿足模型的可稽核性，下列哪一項最應被完整保存？",
    choices: [
      { id: "A", text: "訓練當天的辦公室溫度" },
      { id: "B", text: "訓練資料版本、程式碼版本、超參數與評估結果的對應紀錄" },
      { id: "C", text: "工程師使用的編輯器名稱" },
      { id: "D", text: "訓練時播放的音樂清單" },
    ],
    answer: "B",
    explanation:
      "稽核要能回答「這個模型是怎麼來的」。資料版本、程式碼版本、超參數與評估結果四者齊全，才能重現當時的訓練並驗證流程是否合規。",
    choiceExplanations: {
      A: "環境溫度與模型的產生過程沒有因果關係。",
      C: "編輯器只是開發工具，不影響訓練結果的重現。",
      D: "與模型的產出完全無關，屬於明顯的干擾選項。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["可稽核性", "版本紀錄", "可重現性"],
      constraints: ["governance", "maintainability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "四者齊全仍未必能重現——若相依套件版本或隨機種子沒有一併固定，同一份程式碼也可能訓出不同的模型。",
    },
  },

  // ── L23402 演算法偏見與公平性（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q093",
    subjectId: "senior-ml",
    prompt:
      "招募篩選模型以過去十年的錄取紀錄訓練，結果對女性申請者的通過率明顯偏低。最可能的根本原因是下列何者？",
    choices: [
      { id: "A", text: "模型的參數量不足" },
      { id: "B", text: "訓練資料反映了過去人為決策中既存的偏誤" },
      { id: "C", text: "訓練輪數太少" },
      { id: "D", text: "使用了交叉驗證" },
    ],
    answer: "B",
    explanation:
      "模型忠實地學習了歷史資料中的樣態，包括其中的歧視。技術上模型沒出錯，問題出在把有偏的歷史當成應該延續的標準——這正是演算法偏見最常見的來源。",
    choiceExplanations: {
      A: "增加參數只會讓模型更精準地複製歷史偏誤。",
      C: "訓練不足會導致整體表現差，無法解釋針對特定性別的系統性落差。",
      D: "交叉驗證是評估方法，不會製造偏誤。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["歷史偏誤", "標籤來源", "演算法偏見"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若歷史錄取決策本身經過嚴格的公平性稽核、確認無性別偏誤，通過率的差距就可能反映真實的申請條件差異，而非模型的偏見。",
    },
  },
  {
    id: "senior-ml-practice-q094",
    subjectId: "senior-ml",
    prompt:
      "把「性別」欄位從模型輸入中移除後，模型仍對特定性別產生差別待遇。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "資料量不足" },
      { id: "B", text: "模型一定有程式錯誤" },
      { id: "C", text: "其他特徵是性別的代理變數，間接把資訊帶回模型" },
      { id: "D", text: "評估指標選錯" },
    ],
    answer: "C",
    explanation:
      "就讀科系、工作年資中斷、甚至購物類別都可能與性別高度相關。單純移除敏感欄位（fairness through unawareness）通常無效，必須檢查代理變數並採用公平性指標評估。",
    choiceExplanations: {
      A: "資料量不足會造成整體不穩定，不會產生針對特定群體的一致偏差。",
      B: "模型可能完全依照設計運作，問題出在特徵與敏感屬性的相關性。",
      D: "指標選擇影響的是能不能看出偏誤，而不是偏誤為何存在。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["代理變數", "無感知公平", "間接歧視"],
      constraints: ["fairness"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若把所有與性別相關的特徵也一併移除，模型的預測能力往往同時大幅下滑——公平與效用的取捨在這裡無法迴避。",
    },
  },
  {
    id: "senior-ml-practice-q095",
    subjectId: "senior-ml",
    prompt:
      "公平性指標中的「機會均等（Equal Opportunity）」關注的是下列何者？",
    choices: [
      { id: "A", text: "各群體的樣本數是否相同" },
      { id: "B", text: "各群體獲得的預測為正類的比例是否相同" },
      { id: "C", text: "各群體在真正為正類的樣本中被正確判為正類的比率是否相近" },
      { id: "D", text: "各群體的模型參數是否相同" },
    ],
    answer: "C",
    explanation:
      "機會均等要求各群體的真陽性率（召回率）相近，也就是「有資格的人被抓出來的機會一樣」。它與人口比例均等（demographic parity）是不同的公平定義，通常無法同時滿足。",
    choiceExplanations: {
      A: "樣本數是資料組成，與模型決策是否公平不是同一件事。",
      B: "各群體正類預測比例相同是人口比例均等，兩者是不同的公平準則。",
      D: "模型只有一組參數，公平性談的是不同群體上的表現差異。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["機會均等", "真陽性率", "人口比例均等"],
      constraints: ["fairness"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若各群體的基礎率本來就不同，機會均等與人口比例均等無法同時滿足，必須依情境選定要守住哪一個。",
    },
  },
  {
    id: "senior-ml-practice-q096",
    subjectId: "senior-ml",
    prompt:
      "醫療模型在某族群上的表現明顯較差，追查發現該族群在訓練資料中佔比極低。最直接的改善方向是下列何者？",
    choices: [
      { id: "A", text: "補充該族群的樣本，並在評估時分群檢視表現" },
      { id: "B", text: "把該族群的樣本全部刪除" },
      { id: "C", text: "只回報整體平均表現" },
      { id: "D", text: "增加模型層數" },
    ],
    answer: "A",
    explanation:
      "代表性不足是根本原因，補樣本才是對症下藥；同時把分群評估納入常規，才能持續確認差距有沒有收斂。",
    choiceExplanations: {
      B: "刪除只會讓模型完全學不到該族群，把問題變成徹底的忽視。",
      C: "只看平均正是讓問題被掩蓋的原因，不是解法。",
      D: "增加容量無法補足資料中根本不存在的族群資訊。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["代表性不足", "補樣本", "分群評估"],
      constraints: ["fairness", "data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若該族群的樣本在現實中就極難取得（罕見族群或罕病），補樣本不可行，此時要改以重新加權或明確標示模型在該族群上的適用限制。",
    },
  },
  {
    id: "senior-ml-practice-q097",
    subjectId: "senior-ml",
    prompt:
      "關於不同公平性指標之間的關係，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "公平性只需在上線後處理" },
      { id: "B", text: "只要模型準確率夠高就自然公平" },
      { id: "C", text: "所有公平性指標可以同時最佳化" },
      { id: "D", text: "多數情況下無法同時滿足所有公平性定義，必須依情境做出取捨並說明理由" },
    ],
    answer: "D",
    explanation:
      "已有理論結果指出，在基礎率不同的情況下，人口比例均等、機會均等與校準無法同時成立。因此團隊必須依應用情境明確選擇要守住哪一種，並把理由記錄下來。",
    choiceExplanations: {
      A: "資料蒐集與問題定義階段就會埋入偏誤，等到上線才處理往往為時已晚。",
      B: "整體準確率高完全可能建立在犧牲少數群體之上，兩者是不同面向。",
      C: "多個指標之間存在數學上的不可相容性，無法全部同時達成。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["公平性指標", "不可相容性", "情境取捨"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若各群體的基礎率恰好相同，多個公平性定義就可能同時成立——不可相容性來自基礎率的差異，不是定義本身互相矛盾。",
    },
  },
  {
    id: "senior-ml-practice-q098",
    subjectId: "senior-ml",
    prompt:
      "以「重新加權（Reweighting）」處理訓練資料中的群體不平衡，屬於下列哪一類公平性介入手段？",
    choices: [
      { id: "A", text: "與公平性無關" },
      { id: "B", text: "訓練中處理（In-processing）" },
      { id: "C", text: "後處理（Post-processing）" },
      { id: "D", text: "前處理（Pre-processing）" },
    ],
    answer: "D",
    explanation:
      "公平性介入可依時機分成三類：改資料的前處理、改目標函數或訓練過程的中處理、改輸出或門檻的後處理。調整樣本權重屬於在訓練前修正資料，是前處理。",
    choiceExplanations: {
      A: "重新加權正是常見的公平性介入方法之一。",
      B: "中處理是在損失函數加入公平性約束或對抗式訓練，不是調整資料權重。",
      C: "後處理是在模型輸出後依群體調整門檻或校準，時機在訓練之後。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["前處理", "中處理", "後處理", "公平性介入"],
      constraints: ["fairness"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型已經上線且無法重訓，就只剩後處理可用——介入時機的選擇往往受限於模型還能不能動。",
    },
  },
  {
    id: "senior-ml-practice-q099",
    subjectId: "senior-ml",
    prompt:
      "工廠以 AI 評估員工績效並影響升遷，下列哪一項最應納入設計？",
    choices: [
      { id: "A", text: "提供申訴與人工複核管道，並揭露主要評估依據" },
      { id: "B", text: "完全不揭露評估方式以免員工投機" },
      { id: "C", text: "把模型分數直接作為唯一升遷依據" },
      { id: "D", text: "只在出問題時才檢視模型" },
    ],
    answer: "A",
    explanation:
      "影響個人重大權益的自動化決策，應具備可解釋與可救濟兩項條件。揭露評估依據讓員工知道被評什麼，申訴與複核則讓錯誤有被糾正的途徑。",
    choiceExplanations: {
      B: "完全不揭露會讓員工無從知道被如何評價，也無從指出錯誤。",
      C: "把單一模型分數當唯一依據，等於把重大人事決定完全交給演算法。",
      D: "事後補救無法挽回已發生的不當決定，監控應是常態而非例外。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["自動化決策", "可救濟", "揭露依據"],
      constraints: ["governance", "fairness"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型只用於提供主管參考、最終決定仍由人做出，揭露與申訴的強制程度會下降，但仍應保留可追溯的紀錄。",
    },
  },
  {
    id: "senior-ml-practice-q100",
    subjectId: "senior-ml",
    prompt:
      "農業補助審核模型若以「歷史申請通過紀錄」訓練，且過去審核偏好特定地區，最可能出現下列哪一種現象？",
    choices: [
      { id: "A", text: "模型會自動修正歷史偏誤" },
      { id: "B", text: "回饋迴路使偏誤自我強化，該地區持續獲得較高通過率" },
      { id: "C", text: "各地區的通過率會自動趨於相同" },
      { id: "D", text: "模型不會受歷史資料影響" },
    ],
    answer: "B",
    explanation:
      "模型依偏誤的歷史核准，核准結果又成為下一輪的訓練資料，偏誤因此被不斷放大。打破迴路需要主動介入：分群監控、重新加權，或引入不受歷史決策污染的評估基準。",
    choiceExplanations: {
      A: "模型沒有辨識歷史不公的能力，只會忠實複製它看到的樣態。",
      C: "沒有任何機制促使通過率趨同，放任下去只會擴大差距。",
      D: "監督式模型的行為完全由訓練資料塑造，不可能不受影響。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["回饋迴路", "偏誤自我強化", "主動介入"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若審核結果不會回流成為下一輪的訓練資料（例如每年都用固定的外部評估資料重訓），回饋迴路就被切斷，偏誤不會自我放大。",
    },
  },
];
