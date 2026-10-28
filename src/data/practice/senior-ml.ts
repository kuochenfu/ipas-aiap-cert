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
      { id: "D", text: "標準化常數（Evidence）" },
    ],
    answer: "A",
    explanation:
      "P(A) 是在看到證據 B 之前對 A 的信念，稱為先驗；P(A|B) 是看到證據後更新的信念，稱為後驗；P(B|A) 則是概似度。貝氏定理描述的正是「先驗如何被證據更新成後驗」。",
    choiceExplanations: {
      B: "後驗是 P(A|B)，也就是等式左邊、已納入證據之後的機率。",
      C: "概似度是 P(B|A)，衡量在 A 成立時觀察到 B 的可能性。",
      D: "標準化常數（證據）指的是分母 P(B)，用來讓後驗機率的總和為 1，不是 P(A)。",
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
        D: "Terminology Swap",
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
      { id: "A", text: "每個特徵都必須服從常態分布" },
      { id: "B", text: "預設所有類別的先驗機率相等" },
      { id: "C", text: "給定類別下，各特徵之間互相獨立" },
      { id: "D", text: "特徵數量必須少於訓練樣本數" },
    ],
    answer: "C",
    explanation:
      "條件獨立假設讓聯合機率可以拆成各特徵機率的乘積，大幅簡化計算。此假設在真實資料中常不成立，但模型在文本分類等任務上仍表現不俗。",
    choiceExplanations: {
      A: "只有高斯單純貝氏才假設連續特徵為常態，多項式與伯努利版本並不需要，這也不是「單純」的意思。",
      B: "各類別的先驗機率可以不同，實作上通常直接由訓練資料中各類別的比例估計。",
      D: "特徵數與樣本數的關係不是此模型的核心假設，單純貝氏在高維文本特徵上照樣常用。",
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
      { id: "A", text: "找出結合先驗後使後驗機率最大的參數值" },
      { id: "B", text: "找出讓已觀察資料出現機率最大的參數" },
      { id: "C", text: "在擬合度相近時選擇參數最少的模型" },
      { id: "D", text: "找出使訓練誤差下降最快的學習率" },
    ],
    answer: "B",
    explanation:
      "MLE 把參數當成未知的固定值，選擇讓手上這批資料最有可能被觀察到的那組參數。它與貝氏方法的差別在於不引入先驗分布。",
    choiceExplanations: {
      A: "結合先驗與概似、讓後驗最大的是最大後驗估計（MAP）；MLE 不引入先驗，只看資料的概似。",
      C: "在擬合度與參數量之間取捨是模型選擇（如 AIC、BIC）或正則化的議題，不是 MLE 的估計準則。",
      D: "學習率是最佳化演算法的設定，決定怎麼去找解；MLE 決定的是要找什麼樣的參數。",
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
      { id: "A", text: "衡量預測值與真實值的平方誤差大小" },
      { id: "B", text: "衡量預測機率分布與真實標籤分布的差距" },
      { id: "C", text: "衡量模型把正負類別排序正確的能力" },
      { id: "D", text: "衡量預測類別與真實類別相符的比例" },
    ],
    answer: "B",
    explanation:
      "交叉熵在模型對正確類別給出高機率時很小、給出低機率時急遽變大，因此能有效引導模型把機率質量放到正確類別上。這也是它比平方誤差更適合分類的原因。",
    choiceExplanations: {
      A: "平方誤差是迴歸常用的 MSE；交叉熵比較的是兩個機率分布，對正確類別給低機率時懲罰會急遽變大。",
      C: "排序正確的能力是 AUC 衡量的對象，屬於評估指標，不是交叉熵這個損失函數的意義。",
      D: "相符的樣本比例是準確率，只看最終判定、不可微分，無法反映模型給正確類別的機率有多高。",
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
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
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
      { id: "A", text: "模型太簡單則偏差高、太複雜則變異高，須在兩者間取得平衡" },
      { id: "B", text: "增加資料量能同時把偏差與變異降到零，因此權衡只存在於小樣本" },
      { id: "C", text: "增加模型複雜度會讓偏差與變異同時下降，因此越複雜越好" },
      { id: "D", text: "偏差與變異由模型結構決定，與訓練資料量多寡無關" },
    ],
    answer: "A",
    explanation:
      "簡單模型學不到真實規律（高偏差、欠擬合），複雜模型對訓練樣本過度敏感（高變異、過擬合）。實務上以正則化、交叉驗證與資料量的增加來尋找兩者的平衡點。",
    choiceExplanations: {
      B: "資料量增加主要降低變異；模型太簡單造成的偏差不會因資料變多而消失，雜訊帶來的不可約誤差也始終存在。",
      C: "增加複雜度通常降低偏差但抬高變異，兩者呈相反方向變動，越複雜反而越容易過擬合。",
      D: "模型結構主要影響偏差，但變異會隨資料量增加而下降，資料夠多時較複雜的模型也不容易過擬合。",
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
        D: "Partial Truth",
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
      { id: "B", text: "樣本少時只回報平均值，避免區間過寬誤導讀者" },
      { id: "C", text: "把樣本標準差當成平均數的估計誤差直接報告" },
      { id: "D", text: "以中位數取代平均數來降低離群值影響" },
    ],
    answer: "A",
    explanation:
      "點估計無法表達精確度。信賴區間同時給出估計值與其不確定範圍，樣本越少區間越寬，讀者才知道這個數字有多可靠。",
    choiceExplanations: {
      B: "區間寬正是樣本少時應誠實呈現的資訊；只給平均值會讓人誤以為估計很精確，隱藏了抽樣誤差。",
      C: "樣本標準差描述的是個體之間的變異，估計平均數的誤差應使用標準誤（除以根號 n），兩者不可混用。",
      D: "中位數只是換一種點估計，仍是單一數字，沒有表達這個估計有多不確定。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "各類別的樣本數相同，訓練時才不會偏向多數類" },
      { id: "B", text: "所有特徵經標準化後落在相同的數值範圍" },
      { id: "C", text: "訓練與測試樣本彼此獨立且來自同一分布" },
      { id: "D", text: "各特徵之間互相獨立，模型參數才能分開估計" },
    ],
    answer: "C",
    explanation:
      "多數學習理論的保證建立在 i.i.d. 之上。時間序列、群集資料或分布會漂移的場景違反此假設，此時就必須改用時間切分、群組切分或持續監控來補救。",
    choiceExplanations: {
      A: "類別樣本數相同是類別平衡問題，與樣本的抽樣性質無關；符合 i.i.d. 的資料仍可能類別不平衡。",
      B: "數值範圍一致是特徵縮放的議題，屬於前處理，與樣本是否獨立、是否來自同一分布無關。",
      D: "i.i.d. 的「獨立」指的是樣本與樣本之間，不是特徵與特徵之間；特徵條件獨立是單純貝氏的假設。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "持續觀察到兩組差距穩定為止" },
      { id: "B", text: "直接比較兩組的原始點擊數" },
      { id: "C", text: "只看哪一組的數字比較大" },
      { id: "D", text: "比例的假設檢定並檢視效果量" },
    ],
    answer: "D",
    explanation:
      "兩組比例的差異可能只是抽樣波動。以比例檢定判斷差異是否超出隨機範圍，再以效果量判斷差多少值不值得換模型，兩者缺一不可。",
    choiceExplanations: {
      A: "憑肉眼看差距是否穩定並非統計判斷，反覆查看還會增加誤判的機率；仍需以檢定量化隨機波動。",
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
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若兩組的曝光量差距懸殊，直接比較比例仍會被雜訊主導，該先確認樣本數是否足以偵測預期的效果量。",
    },
  },
  {
    id: "senior-ml-practice-q101",
    subjectId: "senior-ml",
    prompt:
      "某醫院的篩檢模型在盛行率 1% 的社區驗證時陽性預測值僅 17%，移到盛行率 20% 的高風險族群後躍升至八成。模型本身未改變。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "社區的陽性預測值偏低，應提高分類門檻讓陽性判定更嚴格後再部署" },
      { id: "B", text: "模型在高風險族群變得更準，應只在該族群部署、社區停用" },
      { id: "C", text: "兩次驗證的結果差距過大，代表其中一次的樣本切分或計算有誤" },
      { id: "D", text: "敏感度與特異度不隨盛行率變，陽性預測值卻會；換族群部署須重新評估臨床意義" },
    ],
    answer: "D",
    explanation:
      "敏感度與特異度是在已知真實狀態下計算的，與族群組成無關；陽性預測值則要把盛行率算進去。同一個模型在不同盛行率的族群中，陽性者實際患病的機率可以差好幾倍。",
    choiceExplanations: {
      A: "提高門檻能提升陽性預測值，但會犧牲敏感度，且沒有解釋同一模型在兩地為何差這麼多——差異來自盛行率。",
      B: "模型並未變準，變的是族群的先驗機率；社區篩檢仍有價值，只是陽性的意義不同，不必因此停用。",
      C: "兩次驗證都正確，切分與計算沒有問題；陽性預測值本來就會隨盛行率大幅變動。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Concept Boundary",
      concepts: ["陽性預測值", "盛行率", "敏感度與特異度"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若兩個族群的盛行率相同，陽性預測值就不會有這種落差，差異才會真的反映模型能力的改變。",
    },
  },
  {
    id: "senior-ml-practice-q102",
    subjectId: "senior-ml",
    prompt:
      "某銀行的模型輸出信用違約機率，風控要依機率乘上曝險金額計算期望損失。下列前提何者最關鍵？",
    choices: [
      { id: "A", text: "模型的 AUC 須夠高，確保高風險客戶排在低風險客戶前面" },
      { id: "B", text: "機率輸出須經校準：輸出 0.2 的客戶中約兩成實際違約" },
      { id: "C", text: "模型的特徵須具可解釋性，讓風控能說明每筆機率的來源" },
      { id: "D", text: "違約與非違約樣本須先平衡為一比一，機率才不偏向多數類" },
    ],
    answer: "B",
    explanation:
      "要拿機率去乘金額算期望值，這個機率就必須是誠實的。排序能力再好（AUC 高），若輸出的數值系統性偏高或偏低，期望損失就會整體失真。",
    choiceExplanations: {
      A: "AUC 只衡量排序能力；排序正確的模型，輸出的數值仍可能系統性偏高或偏低，期望損失照樣失真。",
      C: "可解釋性有助於稽核與溝通，但不保證輸出的數值是誠實的機率，無法支撐期望損失的乘算。",
      D: "人為平衡成一比一反而會讓輸出機率偏離真實違約率，必須再校正回原始比例，才能拿來算期望損失。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Concept Boundary",
      concepts: ["機率校準", "期望損失", "排序與校準"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若下游只用排序（例如挑出風險最高的前一百名客戶），校準就不重要，AUC 這類排序指標才是重點。",
    },
  },
  {
    id: "senior-ml-practice-q103",
    subjectId: "senior-ml",
    prompt:
      "某工廠以單純貝氏分類維修單，發現同一個故障描述中反覆出現的同義詞讓模型過度自信。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "機率被推向極端只是門檻設定問題，把分類門檻調高即可修正" },
      { id: "B", text: "訓練樣本太少使同義詞的詞頻估計失真，增加資料量並做平滑即可改善" },
      { id: "C", text: "同義詞讓同一證據被重複計算，違反條件獨立；應合併同義詞或換模型" },
      { id: "D", text: "詞頻特徵不符多項式分布假設，應改用高斯單純貝氏重新建模" },
    ],
    answer: "C",
    explanation:
      "單純貝氏把各特徵的機率相乘，前提是它們在給定類別下互相獨立。同義詞高度相關時，等於同一個證據被乘了好幾次，機率被推到接近 0 或 1。",
    choiceExplanations: {
      A: "門檻只改變判定的鬆緊，機率被扭曲的根源——同一份證據被重複相乘——仍然存在。",
      B: "資料再多、平滑再好，同義詞依然高度相關，同一份證據還是被乘好幾次，過度自信不會消失。",
      D: "詞頻是離散計數，正適合多項式版本；高斯版本處理的是連續特徵的分布假設，與條件獨立是不同的問題。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["條件獨立假設", "特徵相關", "過度自信"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      crossNode: "L23301",
      decisionBoundary:
        "若特徵之間確實近乎獨立（例如經過去相關處理），單純貝氏的機率就相當可信，速度優勢也就值得。",
    },
  },
  {
    id: "senior-ml-practice-q104",
    subjectId: "senior-ml",
    prompt:
      "某農業團隊以極少樣本估計新品種的平均產量，並想量化估計的不確定性。下列做法何者最正確？",
    choices: [
      { id: "A", text: "樣本太少時以最大值估計，避免低估新品種的產量潛力" },
      { id: "B", text: "只報告平均值，樣本少時區間過寬反而會誤導讀者" },
      { id: "C", text: "給出信賴區間，並直接以樣本標準差作為平均數的估計誤差" },
      { id: "D", text: "給出信賴區間，並以標準誤而非樣本標準差描述估計誤差" },
    ],
    answer: "D",
    explanation:
      "樣本標準差描述的是個體之間的變異，而估計「平均數」有多準要看標準誤——它會隨樣本數增加而縮小。樣本少時區間會很寬，這正是要誠實呈現的資訊。",
    choiceExplanations: {
      A: "最大值是極端觀測，不能代表平均水準；以「避免低估」為由取最大值，反而會系統性高估。",
      B: "區間寬正是樣本少時該誠實呈現的資訊；只給平均值會讓人誤以為估計很精確，隱藏了抽樣誤差。",
      C: "給信賴區間的方向正確，但樣本標準差描述個體變異、不隨樣本數縮小；平均數的誤差應使用標準誤，否則會高估不確定性。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["標準誤", "信賴區間", "不確定性量化"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若樣本數極大、區間窄到可忽略，只報點估計的資訊損失就很小——區間的必要性隨樣本數減少而上升。",
    },
  },

  // ── L23102 線性代數之機器學習基礎應用（9 題）──────────────────
  {
    id: "senior-ml-practice-q010",
    subjectId: "senior-ml",
    prompt:
      "在機器學習中，把一批樣本表示為矩陣 X（列為樣本、欄為特徵）的主要好處是下列何者？",
    choices: [
      { id: "A", text: "以矩陣運算一次處理整批樣本，充分利用平行化硬體" },
      { id: "B", text: "能讓每個特徵的尺度自動一致，省去標準化步驟" },
      { id: "C", text: "能讓模型依欄位相關性自動挑出重要特徵" },
      { id: "D", text: "樣本以列儲存可確保各筆資料彼此獨立，符合 i.i.d. 假設" },
    ],
    answer: "A",
    explanation:
      "把逐筆迴圈改寫成矩陣乘法，可直接交給 BLAS 或 GPU 平行執行，這是深度學習能在大量資料上訓練的工程基礎。",
    choiceExplanations: {
      B: "排成矩陣不會改變任何數值，不同特徵的尺度差異依然存在，標準化仍然需要。",
      C: "特徵選擇需要額外的方法（如正則化或統計檢定），矩陣只是資料的排列形式，不會挑選欄位。",
      D: "資料怎麼排列不影響它的抽樣性質；樣本是否獨立同分布取決於蒐集方式，而不是儲存格式。",
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
        D: "Layer Confusion",
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
      { id: "A", text: "兩向量對應元素相乘後加總的大小" },
      { id: "B", text: "兩向量端點之間的直線距離遠近" },
      { id: "C", text: "兩向量的方向與長度是否同時接近" },
      { id: "D", text: "兩向量方向的接近程度，與長度無關" },
    ],
    answer: "D",
    explanation:
      "餘弦相似度是內積除以兩者長度的乘積，結果只反映夾角。文本檢索常用它，因為文件長短不同但主題可能一致，長度不該影響相似度判斷。",
    choiceExplanations: {
      A: "對應元素相乘再加總是內積，會受向量長度影響；餘弦相似度是把內積再除以兩者的長度。",
      B: "端點之間的直線距離是歐氏距離，會同時受方向與長度影響。",
      C: "餘弦相似度把長度除掉，只反映夾角；同方向但長度差十倍的兩向量，餘弦相似度仍為 1。",
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
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Partial Truth",
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
      { id: "A", text: "矩陣的跡（trace）必須等於 1" },
      { id: "B", text: "矩陣的行列式為零（奇異矩陣）" },
      { id: "C", text: "共變異數矩陣的特徵值與特徵向量" },
      { id: "D", text: "樣本之間的距離矩陣與最近鄰" },
    ],
    answer: "C",
    explanation:
      "PCA 對共變異數矩陣做特徵分解：特徵向量給出主成分的方向，對應的特徵值代表該方向解釋的變異量。取最大的幾個特徵值即完成降維。",
    choiceExplanations: {
      A: "跡等於特徵值之和，可用來計算解釋變異比例，但「必須等於 1」並非 PCA 的條件。",
      B: "行列式為零代表矩陣奇異，與 PCA 求主成分方向的目標不是同一件事。",
      D: "樣本間距離與最近鄰是 KNN 或多維尺度法的出發點；PCA 依據的是特徵之間的共變異結構。",
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
      { id: "A", text: "對輸入特徵取平均後再經激活函數" },
      { id: "B", text: "矩陣乘法加上偏置，再經非線性激活" },
      { id: "C", text: "以固定大小的卷積核在輸入上滑動加權" },
      { id: "D", text: "依序比較特徵閾值並分支到葉節點" },
    ],
    answer: "B",
    explanation:
      "全連接層的核心是 y = Wx + b，再套上激活函數引入非線性。若少了非線性，多層堆疊仍等價於單一線性轉換，深度就失去意義。",
    choiceExplanations: {
      A: "取平均是池化或全域平均池化的行為；全連接層讓每個輸出都是全部輸入的加權組合，權重可學習。",
      C: "以卷積核滑動、共享權重是卷積層的運算；全連接層的每個輸出與所有輸入相連，不共享權重。",
      D: "依閾值逐層分支到葉節點是決策樹的推論方式，不是神經網路層的可微分運算。",
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
        C: "Neighbor Concept",
        D: "Neighbor Concept",
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
      { id: "A", text: "設計矩陣必定不可逆，模型完全無法求解" },
      { id: "B", text: "係數估計不穩定，難以解釋個別特徵的貢獻" },
      { id: "C", text: "整體預測準確度大幅下降，但係數仍可正常解讀" },
      { id: "D", text: "最小平方法會自動把其中一個相關特徵的係數壓成零" },
    ],
    answer: "B",
    explanation:
      "共線性讓多組係數組合都能得到幾乎相同的擬合，估計因此對資料的微小變動極度敏感，標準誤變大、符號甚至可能反轉，解釋性隨之瓦解。",
    choiceExplanations: {
      A: "只有完全共線才會讓矩陣不可逆；高度但不完全的共線仍可求解，只是估計不穩。",
      C: "情況正好相反：整體預測往往仍堪用，受害的正是個別係數的解釋。",
      D: "普通最小平方法沒有懲罰項，不會把係數壓成零；把係數壓成零是 L1（Lasso）正則化的行為。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "把評分矩陣分解成兩個低維矩陣相乘，以潛在因子表達偏好" },
      { id: "B", text: "計算使用者之間的評分相關係數，找出相似使用者再推薦" },
      { id: "C", text: "把缺值填 0 後直接分解，讓未評分項目視為不喜歡" },
      { id: "D", text: "依物品類別、描述等內容特徵計算物品間相似度再推薦" },
    ],
    answer: "A",
    explanation:
      "矩陣分解假設偏好由少數潛在因子決定，使用者與物品各自對應一組因子向量，內積即為預測評分。這讓稀疏的評分矩陣得以補全。",
    choiceExplanations: {
      B: "計算使用者間相似度再推薦是以記憶為基礎的協同過濾（鄰域法），不學習潛在因子。",
      C: "把缺值當成 0 等於認定使用者不喜歡，會嚴重扭曲學習訊號；矩陣分解只以已觀察到的評分來擬合。",
      D: "以物品內容特徵計算相似度是內容式推薦，不需要評分矩陣，也不產生潛在因子。",
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
      { id: "C", text: "樹模型無法處理 one-hot 後的稀疏欄位" },
      { id: "D", text: "會使每個樣本的編碼長度隨樣本數增加" },
    ],
    answer: "A",
    explanation:
      "有一萬個類別就會產生一萬維，計算與記憶體成本高且每列只有一個 1。高基數類別通常改用目標編碼、雜湊技巧或學習嵌入向量。",
    choiceExplanations: {
      B: "產生錯誤大小順序的是標籤編碼（把類別編成 1、2、3）；one-hot 正是為避免此問題而生。",
      C: "樹模型可以使用 one-hot 欄位，只是高基數時分裂效率不佳，並非不能處理。",
      D: "向量長度由類別數決定，與樣本數無關；樣本再多，編碼維度都不變。",
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
      { id: "A", text: "每增加一維，所需樣本數只需線性增加即可維持密度" },
      { id: "B", text: "高維讓資料較易線性可分，因此分類必定變得更容易" },
      { id: "C", text: "資料變得稀疏，樣本間距離趨於相近而失去鑑別力" },
      { id: "D", text: "樣本之間的距離差異被放大，最近鄰更容易辨識" },
    ],
    answer: "C",
    explanation:
      "維度上升時空間體積指數成長，固定樣本數會顯得極度稀疏，最近與最遠鄰居的距離比值趨近 1，依賴距離的方法（KNN、分群）因此失效。",
    choiceExplanations: {
      A: "要維持同樣的樣本密度，所需樣本數隨維度呈指數成長，而非線性增加。",
      B: "高維確實較容易找到分隔超平面，但也更容易過擬合，泛化通常變差，並非必定更容易。",
      D: "實際情況相反：高維時最近與最遠鄰居的距離比值趨近 1，距離差異被壓縮，最近鄰反而難以辨識。",
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
        B: "Partial Truth",
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
      { id: "A", text: "標準化能消除特徵之間的相關性，避免重複計算距離" },
      { id: "B", text: "標準化能讓各特徵轉為常態分布，距離計算才有意義" },
      { id: "C", text: "標準化會把離群值壓回正常範圍，避免它們扭曲距離" },
      { id: "D", text: "尺度較大的特徵會主導距離，掩蓋其他特徵的影響" },
    ],
    answer: "D",
    explanation:
      "以「年收入（數十萬）」與「年齡（數十）」為例，未標準化時距離幾乎完全由收入決定。標準化把各特徵放到可比的尺度，距離才反映整體差異。",
    choiceExplanations: {
      A: "去除相關性需要 PCA 或白化；標準化只調整各特徵的平均與尺度，相關係數不變。",
      B: "標準化只是平移與縮放，分布形狀不變，偏態資料標準化後依然偏態。",
      C: "離群值標準化後仍是離群值，只是換了尺度；要降低其影響需用穩健縮放或另行處理。",
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
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若各特徵本來就同單位、同量級（例如都是 0 到 1 的比例），標準化帶來的效益就很有限。",
    },
  },
  {
    id: "senior-ml-practice-q105",
    subjectId: "senior-ml",
    prompt:
      "某銀行的線性模型中，兩個高度相關的財務比率係數一正一負且絕對值極大，換一批訓練資料後符號還會互換。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這是資料洩漏，其中一個比率含有未來資訊，才讓係數隨資料批次劇烈變動，應移除該特徵" },
      { id: "B", text: "這是過擬合，應加強 L1 正則化，讓模型只保留其中一個比率以穩定解釋" },
      { id: "C", text: "共線性的典型徵狀，估計極不穩定；需解釋係數時應移除或合併相關特徵，或改用嶺迴歸" },
      { id: "D", text: "這是欠擬合，模型無法捕捉兩比率間的非線性關係，應加入交互作用項" },
    ],
    answer: "C",
    explanation:
      "共線性讓多組係數組合幾乎等價，估計對資料的微小變動極度敏感，符號甚至可能反轉。整體預測往往仍堪用，受害的是個別係數的解釋——而這正是本案需要的。",
    choiceExplanations: {
      A: "資料洩漏的徵狀是測試分數虛高，不會造成兩個相關係數一正一負、符號互換；此處是共線性。",
      B: "L1 會從相關特徵中任選一個保留，選哪一個會隨資料批次而變，同樣不穩定，解釋問題並未解決。",
      D: "欠擬合的徵狀是訓練與驗證誤差都高；係數一正一負且符號互換是共線性，加入交互作用項只會讓相關更嚴重。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["共線性", "係數穩定性", "嶺迴歸"],
      constraints: ["explainability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        D: "Terminology Swap",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若模型只用於預測、不需要解釋個別係數，共線性的危害就小得多，整體預測往往仍然堪用。",
    },
  },
  {
    id: "senior-ml-practice-q106",
    subjectId: "senior-ml",
    prompt:
      "某教育平台以餘弦相似度比對學生的學習向量，發現學習時數極多與極少的兩位學生被判定為高度相似。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "嵌入維度太低讓不同學習型態擠在一起，應改用更大的嵌入模型重新編碼學習紀錄" },
      { id: "B", text: "餘弦相似度高就代表兩人學習狀況相同，結果正確、無需調整" },
      { id: "C", text: "應先對向量做 L2 正規化再計算餘弦，就能區分兩人學習量的差異" },
      { id: "D", text: "餘弦只看方向不看長度；若學習量本身有意義，應改用歐氏距離或保留長度資訊" },
    ],
    answer: "D",
    explanation:
      "餘弦把向量的長度除掉，只比較各科目之間的相對比例。兩人若在各科的分配比例一致，即使總量差十倍也會被判為相似——當總量本身重要時，這個特性就成了缺陷。",
    choiceExplanations: {
      A: "換更大的嵌入模型不改變餘弦相似度把長度除掉這個數學性質，總量差十倍仍會被判為相似。",
      B: "餘弦只反映科目分配比例；總學習時數差十倍的兩人學習狀況顯然不同，在關心學習量時不能視為相同。",
      C: "L2 正規化正是把長度除掉，做完後長度資訊完全消失，結果與原本的餘弦相同，反而無法區分學習量。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["餘弦相似度", "歐氏距離", "長度資訊"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若比較的是文件主題而文件長短不該影響判斷，餘弦忽略長度正是想要的性質。",
    },
  },
  {
    id: "senior-ml-practice-q107",
    subjectId: "senior-ml",
    prompt:
      "某工廠以 PCA 把上百個感測特徵降到十維，前十個主成分僅解釋 45% 的變異，模型效能也不佳。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "效能不佳是維度仍過高造成過擬合，應直接減到五維，讓模型更簡單也更好解釋" },
      { id: "B", text: "解釋比例偏低代表結構可能非線性或本需更多維，應檢視累積解釋變異並考慮核 PCA" },
      { id: "C", text: "PCA 依變異大小排序，前十個主成分已保留最重要的資訊，效能不佳應歸因於模型本身" },
      { id: "D", text: "應先對各主成分做標準化，讓十個主成分的解釋比例變得平均" },
    ],
    answer: "B",
    explanation:
      "十個主成分只解釋 45% 的變異，代表被丟掉的一半資訊裡可能有重要訊號。這通常有兩種原因：真實維度本來就高，或結構是非線性的而線性投影抓不到。",
    choiceExplanations: {
      A: "只解釋 45% 變異代表已丟掉一半資訊，再減到五維損失更大；效能不佳源於資訊不足而非維度過高。",
      C: "PCA 保留多少資訊由解釋變異比例決定，45% 明確說明損失很大；排在最前面不等於保留了大部分資訊。",
      D: "對主成分標準化只改變尺度，不會讓原始資料的變異結構改變，被丟掉的資訊也回不來，反而讓解釋比例失去意義。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["累積解釋變異", "非線性結構", "核 PCA"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      crossNode: "L23301",
      decisionBoundary:
        "若前十個主成分就解釋了九成變異，降維幾乎沒有資訊損失，效能不佳的原因就要往別處找。",
    },
  },
  {
    id: "senior-ml-practice-q108",
    subjectId: "senior-ml",
    prompt:
      "某醫院的推薦系統以矩陣分解預測病患對衛教內容的偏好，但新加入的病患完全沒有任何互動紀錄。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以全體病患的平均評分填補該病患的缺值，再照常進行矩陣分解" },
      { id: "B", text: "把新病患的潛在因子隨機初始化，待下次重新訓練時由模型自行學出合適的偏好" },
      { id: "C", text: "增加潛在因子的維度，讓模型有足夠容量表達新病患的偏好" },
      { id: "D", text: "這是冷啟動問題，應先以年齡、疾病類別等內容特徵推薦，累積互動後再切換" },
    ],
    answer: "D",
    explanation:
      "矩陣分解從互動紀錄學潛在因子，沒有互動就沒有可學的東西。此時只能靠內容特徵（人口統計、疾病類別）先給出合理的初始推薦，等累積夠了再轉回協同過濾。",
    choiceExplanations: {
      A: "以全體平均填補等於把所有新病患都推薦相同內容，大量填補值還會扭曲模型學習。",
      B: "沒有任何互動紀錄，重新訓練時也沒有梯度能更新該病患的因子，隨機值不會變成有意義的偏好。",
      C: "增加維度需要更多互動才估得準，在零互動時只會更糟；問題在沒有資料，不在容量。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["矩陣分解", "冷啟動", "內容特徵"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若新病患在註冊時就填寫了偏好問卷，那份資料就能作為初始的潛在因子估計基礎，冷啟動的嚴重度大幅下降。",
    },
  },

  // ── L23103 數值優化技術與方法（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q019",
    subjectId: "senior-ml",
    prompt:
      "梯度下降法中「學習率過大」最可能造成下列哪一種現象？",
    choices: [
      { id: "A", text: "收斂更快，且較容易抵達全域最佳解" },
      { id: "B", text: "損失震盪甚至發散，無法收斂" },
      { id: "C", text: "每步推進變小，訓練速度明顯變慢" },
      { id: "D", text: "梯度會迅速衰減為零，前層停止更新" },
    ],
    answer: "B",
    explanation:
      "步伐太大會在最佳解附近來回跨越甚至越走越遠，損失曲線呈現震盪或直接發散。實務上會搭配學習率調度或自適應優化器來緩解。",
    choiceExplanations: {
      A: "步伐過大會在最佳解附近來回跨越甚至發散，連局部最佳解都可能到不了，遑論全域。",
      C: "步伐變小、訓練變慢是學習率過小的徵狀；學習率過大的問題在於不穩定。",
      D: "梯度趨近零是梯度消失，源於反向傳播時逐層相乘，不是學習率大造成的。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "雜訊讓它保證跳出局部解，必定找到全域最佳" },
      { id: "B", text: "每次更新只用部分樣本，梯度估計比全批次更精確" },
      { id: "C", text: "記憶體需求較低且更新更頻繁，適合大資料" },
      { id: "D", text: "批次雜訊會自動調整步伐，因此不需要設定學習率" },
    ],
    answer: "C",
    explanation:
      "全批次每次更新都要掃過整個資料集，資料量大時既慢又吃記憶體。小批次以部分樣本估計梯度，更新頻繁、可平行化，且適度的雜訊有時反而有助跳離不良的局部解。",
    choiceExplanations: {
      A: "小批次雜訊有時有助跳離不良的局部解，但沒有任何一階方法能保證在非凸問題上找到全域最佳。",
      B: "以部分樣本估計的梯度含有雜訊，精確度低於全批次，這正是小批次付出的代價。",
      D: "雜訊不會調整步伐，小批次同樣需要設定學習率，而且它是最關鍵的超參數之一。",
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
        A: "Partial Truth",
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
      { id: "A", text: "以 Hessian 矩陣計算每步的更新方向" },
      { id: "B", text: "所有參數共用一個隨訓練遞減的學習率" },
      { id: "C", text: "結合動量與各參數自適應的學習率" },
      { id: "D", text: "只使用梯度的動量、不調整學習率" },
    ],
    answer: "C",
    explanation:
      "Adam 同時維護梯度的一階動量（方向平滑）與二階動量（依歷史梯度大小調整每個參數的步伐），因此對學習率的初始設定較不敏感，收斂通常較快。",
    choiceExplanations: {
      A: "Adam 的二階動量是歷史梯度平方的移動平均，不是 Hessian；它仍是只用一階梯度的方法。",
      B: "所有參數共用一個遞減學習率是 SGD 搭配學習率調度；Adam 會依每個參數的歷史梯度大小各自調整步伐。",
      D: "只用動量是 Momentum SGD；Adam 在動量之外，還依二階動量為每個參數調整學習率。",
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
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Partial Truth",
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
      { id: "A", text: "靠近輸入端的層幾乎不更新，難以學到有效表示" },
      { id: "B", text: "權重數值急遽變大，損失出現 NaN 或發散" },
      { id: "C", text: "靠近輸出端的層停止更新，前層照常學習" },
      { id: "D", text: "所有層同步放慢學習，只要延長訓練時間就能補回" },
    ],
    answer: "A",
    explanation:
      "反向傳播時梯度逐層相乘，若每層都小於 1，傳到前幾層時已趨近於零，這些層的權重幾乎停滯。常見對策包括 ReLU 系激活、批次正規化與殘差連接。",
    choiceExplanations: {
      B: "權重急遽變大、損失出現 NaN 是梯度爆炸的徵狀，與梯度消失相反。",
      C: "方向相反：梯度從輸出端往回傳時逐層相乘衰減，受害的是靠近輸入端的層。",
      D: "衰減集中在前幾層，且可能小到趨近於零，延長訓練也推不動；需改用 ReLU、批次正規化或殘差連接。",
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
        B: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Overgeneralization",
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
      { id: "A", text: "隨訓練調高學習率，讓後期跳出局部解" },
      { id: "B", text: "依驗證損失變化自動決定何時停止訓練" },
      { id: "C", text: "讓每個參數依歷史梯度各自調整步伐" },
      { id: "D", text: "前期大步快速接近，後期縮小步伐穩定收斂" },
    ],
    answer: "D",
    explanation:
      "固定學習率難以兼顧「快速下降」與「精細收斂」。前大後小的調度讓模型先大步逼近低損失區域，再以小步伐精修，通常能取得更好的最終表現。",
    choiceExplanations: {
      A: "方向相反：調度通常前大後小，後期縮小步伐才能在低損失區域精修；後期調高只會讓收斂不穩。",
      B: "依驗證損失決定何時停止是早停，屬於正則化手段；學習率調度改變的是每一步的步伐大小。",
      C: "依歷史梯度為每個參數調整步伐是 Adam、RMSProp 等自適應優化器的機制；調度則是依訓練進度統一改變學習率。",
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
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
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
      { id: "A", text: "訓練集準確率連續數輪都不再提升時停止" },
      { id: "B", text: "訓練集損失降到接近 0、已完全擬合時停止" },
      { id: "C", text: "達到預先設定的最大訓練輪數時停止" },
      { id: "D", text: "驗證集損失不再下降甚至回升時停止" },
    ],
    answer: "D",
    explanation:
      "訓練損失通常持續下降，但驗證損失開始回升就是過擬合的訊號。在該點停止並取回最佳權重，是最簡單有效的正則化手段之一。",
    choiceExplanations: {
      A: "訓練集指標幾乎總會持續改善，用它判斷停止點無法偵測過擬合；早停要看的是驗證集。",
      B: "訓練損失降到接近 0 往往正代表模型已把訓練資料背下來，是過擬合的跡象而非該停的理由。",
      C: "固定輪數只是資源上限，與模型的泛化表現無關；早停是依驗證表現提前結束訓練。",
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
      { id: "A", text: "梯度法可能停在局部最佳或鞍點，不保證全域最佳" },
      { id: "B", text: "只要多次隨機初始化，梯度法就必定找到全域最佳" },
      { id: "C", text: "非凸問題只能用窮舉搜尋，梯度法完全不適用" },
      { id: "D", text: "只要學習率夠小，梯度法就一定收斂到全域最佳" },
    ],
    answer: "A",
    explanation:
      "非凸曲面存在多個局部最小與大量鞍點，一階方法只能保證收斂到梯度為零的點。實務上靠隨機初始化、動量與小批次雜訊來獲得夠好的解。",
    choiceExplanations: {
      B: "多次隨機初始化能提高找到較佳解的機會，但在非凸曲面上仍無法保證得到全域最佳。",
      C: "非凸問題有大量成熟的最佳化方法，深度網路正是以梯度法訓練，只是不保證全域最佳。",
      D: "學習率再小也只能更穩定地滑向附近的駐點，與該點是否為全域最佳無關。",
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
        B: "Partial Truth",
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
      { id: "A", text: "增加訓練輪數，讓模型有更多時間收斂" },
      { id: "B", text: "先進行特徵標準化再訓練" },
      { id: "C", text: "調高學習率讓緩慢的方向走快一點" },
      { id: "D", text: "刪除數值範圍最大的那幾個特徵" },
    ],
    answer: "B",
    explanation:
      "尺度懸殊會讓損失曲面在各方向的曲率差距極大，梯度下降在狹長的谷地中來回震盪、前進緩慢。標準化讓曲面接近等向，收斂速度大幅改善。",
    choiceExplanations: {
      A: "尺度問題沒有解決，梯度仍在狹長谷地中來回震盪；多給時間只是硬撐，效率極差。",
      C: "曲率最大的方向限制了學習率的上限，調高學習率會讓陡峭方向震盪發散，緩慢的方向仍走不快。",
      D: "刪除特徵會丟掉可能有用的資訊，其餘特徵之間的尺度差距仍在；標準化能保留全部特徵。",
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
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型是決策樹或梯度提升樹這類依門檻切分的模型，尺度差異不影響收斂，標準化就不會帶來改善。",
    },
  },
  {
    id: "senior-ml-practice-q109",
    subjectId: "senior-ml",
    prompt:
      "某教育平台的模型訓練損失在下降一段時間後開始劇烈震盪且不再改善。下列排查順序何者最合理？",
    choices: [
      { id: "A", text: "先增加模型層數讓容量足以擬合，若仍震盪再回頭檢查學習率設定" },
      { id: "B", text: "先查學習率是否過大並嘗試調降，再查批次大小與極端值引起的梯度爆炸" },
      { id: "C", text: "先擴充訓練資料量以穩定梯度，若無效再檢查學習率與批次大小" },
      { id: "D", text: "先把批次加大以平滑梯度，若仍震盪再調降學習率並檢查極端值" },
    ],
    answer: "B",
    explanation:
      "震盪的典型成因是步伐太大，在最佳解附近來回跨越。學習率是最先該調的參數；若調降無效，再往批次大小與資料中的極端值查，後者會造成偶發的巨大梯度。",
    choiceExplanations: {
      A: "增加層數會讓最佳化更困難，震盪可能加劇；震盪是步伐問題而非容量問題，應先查學習率。",
      C: "資料量與單步更新是否過大無關，擴充資料不會讓震盪消失，而且成本最高，不該排在第一步。",
      D: "更大的批次確實能平滑梯度，但損失劇烈震盪最常見的成因是學習率過大；調降學習率成本最低、最該先驗證，先改批次是繞遠路，還會增加記憶體需求。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["學習率", "梯度爆炸", "排查順序"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若損失是緩慢下降到某個值後就不動，那是學習率過小或已達局部最小，與過大造成的震盪徵狀完全不同。",
    },
  },
  {
    id: "senior-ml-practice-q110",
    subjectId: "senior-ml",
    prompt:
      "某銀行把批次大小從 32 提高到 2048 以加速訓練，結果訓練更快收斂但驗證表現變差。下列處置何者最合理？",
    choices: [
      { id: "A", text: "批次大小只影響訓練速度、不影響泛化，應改查資料是否發生漂移" },
      { id: "B", text: "維持大批次並延長訓練輪數，補足減少的更新次數後模型自然能走到較好的解" },
      { id: "C", text: "大批次減少梯度雜訊、易收斂到泛化較差的解，應按比例調高學習率並暖身" },
      { id: "D", text: "大批次的梯度更準確，應進一步提高到 8192 並同步調降學習率" },
    ],
    answer: "C",
    explanation:
      "小批次帶來的梯度雜訊有助於跳離較差的解，大批次把這個效果拿掉了。實務上批次大小不能單獨調整——要同時按比例調整學習率並加暖身，泛化的劣勢才補得回來。",
    choiceExplanations: {
      A: "批次大小確實影響泛化，大批次拿掉的梯度雜訊正是小批次跳離較差解的助力；此處也沒有漂移的跡象。",
      B: "延長訓練能補足更新次數，但不改變大批次低雜訊下收斂到的那類解的性質，泛化劣勢仍在。",
      D: "大批次梯度雖然較準，但繼續放大只會讓泛化劣勢更明顯；學習率的方向也反了，大批次應按比例調高而非調降。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["批次大小", "梯度雜訊", "學習率縮放"],
      constraints: ["compute", "memory", "quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若同時按比例調高學習率並加上暖身後泛化已經追平，大批次的速度優勢就可以放心拿。",
    },
  },
  {
    id: "senior-ml-practice-q111",
    subjectId: "senior-ml",
    prompt:
      "某工廠訓練深層網路時，靠近輸入端的層權重幾乎不再更新。下列處置組合何者最合理？",
    choices: [
      { id: "A", text: "這是梯度爆炸，應加入梯度裁剪，限制前層權重的更新幅度" },
      { id: "B", text: "這是梯度消失；可改用 ReLU、批次正規化與殘差連接" },
      { id: "C", text: "這是學習率過小，應對前幾層單獨大幅提高學習率" },
      { id: "D", text: "前幾層已學不到東西，應刪除並以較淺的網路取代" },
    ],
    answer: "B",
    explanation:
      "反向傳播時梯度逐層相乘，若每層都小於 1，傳到前幾層已趨近於零。三種對策分別從激活函數、層輸入分布與連接結構三個角度緩解這個相乘衰減。",
    choiceExplanations: {
      A: "梯度爆炸的徵狀是數值溢位或損失發散，與前層停滯相反；梯度裁剪只限制過大的梯度，對趨近零的梯度無效。",
      C: "梯度已逐層衰減到接近零，乘上再大的學習率也難以有效更新，還容易讓訓練不穩；根源在梯度的回傳路徑。",
      D: "刪除前層會失去低階特徵的萃取能力，並未解決梯度回傳衰減這個最佳化問題。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["梯度消失", "殘差連接", "批次正規化"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L23203",
      decisionBoundary:
        "若梯度反而逐層放大到數值溢位，那是梯度爆炸，對策換成梯度裁剪而不是換激活函數。",
    },
  },
  {
    id: "senior-ml-practice-q112",
    subjectId: "senior-ml",
    prompt:
      "某農業模型的驗證損失在第 30 輪達到最低，之後持續上升但訓練損失仍在下降。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以訓練損失為準，待其不再下降時才停止並保存權重" },
      { id: "B", text: "驗證損失回升只是暫時波動，應繼續訓練到預定輪數" },
      { id: "C", text: "採用早停並取回第 30 輪的權重，視情況加強正則化" },
      { id: "D", text: "把驗證集併入訓練集，以更多資料繼續訓練壓低損失" },
    ],
    answer: "C",
    explanation:
      "訓練損失持續下降而驗證損失回升，正是過擬合的訊號。在驗證損失的最低點停止並取回該輪權重，是最簡單有效的正則化手段。",
    choiceExplanations: {
      A: "訓練損失幾乎總是持續下降，用它當停止依據等於不停，也無法偵測過擬合。",
      B: "第 30 輪後驗證損失是持續上升而非偶發波動，這是過擬合的訊號；繼續訓練只會更嚴重。",
      D: "併入驗證集後就失去偵測過擬合的能力，問題被掩蓋而非解決；多出的資料也抵銷不了持續訓練造成的過擬合。",
    },
    topic: "L23103 數值優化技術與方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["早停", "過擬合", "驗證損失"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若驗證集太小、損失曲線本身抖動劇烈，早停容易誤觸發，需要加上耐心值或改用交叉驗證。",
    },
  },

  // ── L23201 機器學習原理與技術（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q027",
    subjectId: "senior-ml",
    prompt:
      "半監督式學習最適合下列哪一種情境？",
    choices: [
      { id: "A", text: "所有樣本都已完整標註，且類別分布相當平衡" },
      { id: "B", text: "標註成本高，只有少量標註樣本與大量未標註資料" },
      { id: "C", text: "完全沒有標註，只想找出資料中的自然分群" },
      { id: "D", text: "代理人需與環境互動，依延遲的獎勵訊號學習行動策略" },
    ],
    answer: "B",
    explanation:
      "半監督式學習利用少量標註樣本建立初步判斷，再借助大量未標註資料的分布結構（如群聚假設）改善模型，正好對應標註昂貴但原始資料充足的場景。",
    choiceExplanations: {
      A: "全部標註完成時直接使用監督式學習即可，不需要半監督的額外假設。",
      C: "完全沒有標註、只找自然分群，是非監督式學習（分群）的情境。",
      D: "與環境互動並依獎勵學習策略是強化學習的範式，不是半監督式學習。",
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
        C: "Correct in Different Context",
        D: "Correct in Different Context",
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
      { id: "A", text: "訓練資料標註錯誤造成模型學到偏差的規律" },
      { id: "B", text: "模型預測結果對特定族群系統性不利的傾向" },
      { id: "C", text: "模型為從有限樣本推廣到未見資料所預設的假設" },
      { id: "D", text: "偏差—變異分解中，模型平均預測與真實值的落差" },
    ],
    answer: "C",
    explanation:
      "沒有任何假設就無法從有限樣本推廣。線性模型假設關係是線性的、CNN 假設局部性與位移不變性——這些內建假設就是歸納偏置，決定了模型擅長什麼樣的問題。",
    choiceExplanations: {
      A: "標註錯誤屬於資料品質問題（標籤雜訊），不是模型為了推廣而預設的假設。",
      B: "對族群系統性不利是公平性意義下的演算法偏見，與歸納偏置同字不同義。",
      D: "偏差—變異分解中的偏差衡量模型的系統性誤差，可能是歸納偏置造成的結果，但不是歸納偏置本身。",
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
        D: "Terminology Swap",
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
      { id: "A", text: "Bagging 只能用於迴歸問題，Boosting 只能用於分類問題，不可互換" },
      { id: "B", text: "Bagging 主要用來降低偏差，Boosting 則主要用來降低變異" },
      { id: "C", text: "Bagging 平行訓練獨立模型再平均，Boosting 依序訓練、加強前一輪錯誤" },
      { id: "D", text: "Boosting 的各模型彼此獨立可完全平行，Bagging 則需依序訓練" },
    ],
    answer: "C",
    explanation:
      "Bagging（如隨機森林）以自助抽樣訓練多個彼此獨立的模型再投票，主要降低變異；Boosting（如 XGBoost）序列式地讓每個新模型修正前面的殘差，主要降低偏差。",
    choiceExplanations: {
      A: "兩種集成方式都能用於分類與迴歸，例如隨機森林與梯度提升都有迴歸版本。",
      B: "方向相反：Bagging 平均多個獨立模型，主要降低變異；Boosting 序列修正殘差，主要降低偏差。",
      D: "說反了：Boosting 每一輪都依賴前一輪的結果，本質上是序列式；可以完全平行的是 Bagging。",
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
        B: "Terminology Swap",
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
      { id: "A", text: "沒有對所有問題都最好的演算法，應依問題特性實測比較" },
      { id: "B", text: "深度學習的表達能力最強，因此在各類任務都應優先採用" },
      { id: "C", text: "資料量夠大時各演算法表現會趨於一致，不必再比較" },
      { id: "D", text: "既然所有演算法的平均表現相同，選哪一個模型都沒有差別" },
    ],
    answer: "A",
    explanation:
      "在所有可能問題上平均而言，任何演算法的表現都相同。因此實務的重點不是找「最強的模型」，而是找「最適合這個資料與這個目標的模型」，這需要實測。",
    choiceExplanations: {
      B: "表達能力強不等於適合每個問題；在中小型表格式資料上，梯度提升樹經常勝過深度網路。",
      C: "資料量大不會讓演算法表現趨同，模型與問題的匹配仍然關鍵，仍需實測比較。",
      D: "平均相同是對「所有可能問題」而言；在手上這個具體問題上，演算法之間的差異可以很大，因此更需要針對問題選模型。",
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
        D: "Partial Truth",
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
      { id: "A", text: "讓模型更完整地擬合訓練資料" },
      { id: "B", text: "對輸入特徵做縮放以加速收斂" },
      { id: "C", text: "降低模型偏差，讓訓練誤差盡量趨近零" },
      { id: "D", text: "抑制模型複雜度以降低過擬合風險" },
    ],
    answer: "D",
    explanation:
      "正則化在損失中加入懲罰項，讓模型在「擬合資料」與「保持簡單」之間取得平衡，避免把雜訊也學起來，是控制過擬合最常用的手段。",
    choiceExplanations: {
      A: "正則化刻意限制模型去完整擬合訓練資料，避免把雜訊也學起來，方向正好相反。",
      B: "特徵縮放是資料前處理，用來改善收斂；正則化是在損失中加入懲罰項來限制複雜度。",
      C: "正則化通常會略為提高偏差與訓練誤差，換取較低的變異與更好的泛化。",
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
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
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
      { id: "A", text: "在即時獎勵與未來累積獎勵之間決定折扣比例" },
      { id: "B", text: "在學習價值函數與直接學習策略這兩類演算法之間做選擇" },
      { id: "C", text: "在模型的偏差與變異之間調整複雜度以避免過擬合" },
      { id: "D", text: "在嘗試新行動以獲取資訊與採用已知較優行動間取得平衡" },
    ],
    answer: "D",
    explanation:
      "只利用已知最佳行動會錯過更好的選項，只探索又浪費機會成本。ε-greedy、UCB 等策略就是在兩者間取捨的具體方法。",
    choiceExplanations: {
      A: "權衡即時與未來獎勵的是折扣因子 γ，決定報酬怎麼計算，不是要不要嘗試新行動。",
      B: "價值法與策略法是演算法家族的分類，兩者都必須面對探索與利用的取捨。",
      C: "偏差與變異的權衡屬於監督式學習的模型複雜度議題，不是強化學習中行動選擇的權衡。",
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
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Neighbor Concept",
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
      { id: "B", text: "微調資料太少，模型在新任務上記不住新知識" },
      { id: "C", text: "模型在訓練集表現好、在新資料上表現大幅退化" },
      { id: "D", text: "部署後輸入資料分布隨時間改變，導致準確率逐漸下滑" },
    ],
    answer: "A",
    explanation:
      "微調時權重被新任務的梯度大幅改寫，舊任務所依賴的表示因而被覆蓋。緩解方式包括降低學習率、凍結部分層、混入舊任務樣本或使用正則化約束權重變動。",
    choiceExplanations: {
      B: "資料太少導致新任務學不好是樣本不足或欠擬合問題；災難性遺忘指的是舊任務的能力被覆蓋。",
      C: "訓練集好、新資料差是過擬合，描述的是同一任務的泛化，不是新舊任務之間的能力消長。",
      D: "輸入分布隨時間改變是資料漂移，發生在部署之後，與微調造成舊任務遺忘是不同的現象。",
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
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
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
      { id: "A", text: "以少量人工標註搭配大量未標註資料，共同訓練模型" },
      { id: "B", text: "從資料本身構造預測任務產生標籤，無需人工標註" },
      { id: "C", text: "透過與環境互動取得獎勵訊號作為學習依據" },
      { id: "D", text: "不需要任何訓練目標，只把資料分成相似的群" },
    ],
    answer: "B",
    explanation:
      "例如遮住句子中的某個詞讓模型預測、或把影像旋轉後讓模型判斷角度——標籤直接來自資料本身。這讓模型能在海量未標註資料上學到通用表示，是預訓練模型的基礎。",
    choiceExplanations: {
      A: "少量標註搭配大量未標註是半監督式學習；自監督完全不需人工標註，標籤由資料本身產生。",
      C: "從環境互動取得獎勵是強化學習；自監督的訊號來自資料本身，例如遮住詞語讓模型預測。",
      D: "自監督有明確的預測目標（如預測被遮住的詞），只是目標由資料自動產生；單純分群是非監督式學習。",
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
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若下游任務的標註資料本來就充足，自監督預訓練帶來的增益會明顯收斂——它的價值來自未標註資料遠多於標註資料。",
    },
  },
  {
    id: "senior-ml-practice-q113",
    subjectId: "senior-ml",
    prompt:
      "某醫院把在成人影像上預訓練的模型微調到兒童影像，結果兒童表現提升但成人表現大幅退步。下列判斷與處置何者最正確？",
    choices: [
      { id: "A", text: "微調本以新任務為目標，成人表現退步是可接受的代價" },
      { id: "B", text: "這是對兒童資料過擬合，應加強 Dropout 等正則化" },
      { id: "C", text: "這是資料漂移，應重新蒐集近期的成人影像再訓練" },
      { id: "D", text: "這是災難性遺忘；可降低學習率、凍結部分層或混入成人樣本" },
    ],
    answer: "D",
    explanation:
      "微調時權重被新任務的梯度大幅改寫，舊任務所依賴的表示因而被覆蓋。若兩種能力都要，就得限制改寫的幅度或讓舊任務的樣本繼續參與訓練。",
    choiceExplanations: {
      A: "若醫院仍需服務成人病患，接受退步等於讓一群人承擔品質下降；而這種退步可以用限制改寫幅度的方法避免。",
      B: "過擬合的徵狀是新任務本身在驗證集上變差；此處兒童表現提升、退步的是舊任務，屬於遺忘，Dropout 保不住舊能力。",
      C: "資料漂移是資料分布隨時間改變；此處是微調造成的立即變化，成人影像本身並沒有改變。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["災難性遺忘", "凍結層", "樣本混入"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      crossNode: "L23302",
      decisionBoundary:
        "若成人影像日後完全不再需要判讀，遺忘就不是問題而是預期行為——它只在需要同時保有兩種能力時才構成缺陷。",
    },
  },
  {
    id: "senior-ml-practice-q114",
    subjectId: "senior-ml",
    prompt:
      "某銀行的模型在乾淨資料上以 Boosting 表現最佳，但換到含大量錯誤標註的新資料集後表現急遽下滑，反而 Bagging 較穩。下列說明何者最正確？",
    choices: [
      { id: "A", text: "Boosting 持續加重判錯樣本的權重，錯誤標註被反覆放大；Bagging 平均能稀釋其影響" },
      { id: "B", text: "Bagging 的樹通常較深、表達力較強，面對分布更複雜的新資料自然勝出" },
      { id: "C", text: "新資料集樣本數不足，Boosting 序列訓練需要比 Bagging 更多的資料才能收斂" },
      { id: "D", text: "Boosting 的樹數量不足以涵蓋新資料的多樣性，增加樹數量即可追回表現" },
    ],
    answer: "A",
    explanation:
      "Boosting 的機制是專注於還沒學好的樣本，而錯誤標註的樣本永遠學不好，於是權重不斷被推高，模型被少數錯誤標籤帶著走。Bagging 的獨立取樣加平均則會把這種影響稀釋掉。",
    choiceExplanations: {
      B: "隨機森林的樹雖常長得較深，但它的優勢在於平均降低變異；此處問題出在錯誤標註，與表達力無關。",
      C: "問題出在標籤品質而非樣本數量；錯誤標註在 Boosting 中會被不斷加權，資料再多也一樣。",
      D: "增加樹數量會讓錯誤標註的權重被推得更高，情況只會更糟。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["Boosting", "Bagging", "標籤雜訊"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      crossNode: "L23202",
      decisionBoundary:
        "若能先清理錯誤標註或加入對雜訊穩健的損失函數，Boosting 的優勢就會重新顯現。",
    },
  },
  {
    id: "senior-ml-practice-q115",
    subjectId: "senior-ml",
    prompt:
      "某教育平台以 CNN 處理學生成績與出缺勤的表格資料，效果不如樹模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "應先把各欄位排列成二維矩陣轉成影像，讓 CNN 的卷積核擷取欄位之間的空間關係" },
      { id: "B", text: "CNN 的參數量遠多於樹模型，在表格資料上必然過擬合，因此任何表格任務都劣於樹模型" },
      { id: "C", text: "CNN 的歸納偏置假設輸入具局部性與位移不變性，表格欄位順序任意、沒有這種結構" },
      { id: "D", text: "表格特徵之間的交互作用較複雜，應增加 CNN 的層數與卷積核數量以擴大感受野" },
    ],
    answer: "C",
    explanation:
      "每種模型都內建一組假設。CNN 假設相鄰的輸入彼此相關且特徵可平移，這在影像上成立、在欄位順序任意的表格上不成立——假設與問題結構不符時，內建偏置反而變成阻礙。",
    choiceExplanations: {
      A: "欄位的排列順序是任意的，排成矩陣後卷積核看到的「相鄰」只是人為擺放的結果，並不會因此產生真正的空間關係。",
      B: "參數量不是根因，CNN 在影像與序列資料上明顯優於樹模型；真正的問題是它的結構假設與表格不符，而非「必然較差」。",
      D: "層數與感受野再大，卷積仍假設相鄰欄位彼此相關、特徵可以平移；假設不成立時加深網路無法解決問題。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Concept Boundary",
      concepts: ["歸納偏置", "局部性", "模型與問題匹配"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      crossNode: "L23302",
      decisionBoundary:
        "若輸入改為每位學生逐週的成績序列，時間軸上的局部性就成立，卷積或序列模型的假設也就派得上用場。",
    },
  },
  {
    id: "senior-ml-practice-q116",
    subjectId: "senior-ml",
    prompt:
      "某工廠有大量未標註的感測資料與少量標註樣本，標註需停機檢查、成本極高。下列學習策略何者最合適？",
    choices: [
      { id: "A", text: "以強化式學習讓模型直接與產線互動，透過獎勵訊號學會判斷，不需人工標註" },
      { id: "B", text: "先以自監督式學習從未標註資料學到通用表示，再以少量標註樣本微調" },
      { id: "C", text: "先以主動學習排序樣本，再依序全部送去停機標註，標完所有資料後才開始訓練" },
      { id: "D", text: "只用少量標註樣本搭配資料增強從零訓練，未標註資料因無標籤而直接捨棄" },
    ],
    answer: "B",
    explanation:
      "自監督從資料本身構造預測任務（如遮蔽一段訊號讓模型還原），不需要人工標籤就能學到通用表示；接著只需少量標註即可微調到目標任務，正好對應標註昂貴而原始資料充足的情境。",
    choiceExplanations: {
      A: "強化式學習雖不需標註，卻要在真實產線上反覆試錯才能取得獎勵，停機與誤判的成本與風險都不可接受，也不是利用既有感測資料的方法。",
      C: "主動學習的價值在於只標註少量最有資訊的樣本；排序後仍全部標完，正是題幹說成本做不到的事。",
      D: "資料增強只能擴充既有標註樣本的變化，少量樣本從零訓練仍容易過擬合；捨棄大量未標註資料更浪費了可用來學習表示的資源。",
    },
    topic: "L23201 機器學習原理與技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["自監督式學習", "預訓練與微調", "標註成本"],
      constraints: ["labeled_data_scarcity", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若下游任務的標註資料本來就充足，自監督預訓練帶來的增益會明顯收斂——它的價值來自未標註遠多於標註。",
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
      { id: "B", text: "選出與目標變數線性相關係數最大的特徵，並以其平均值作為分裂門檻" },
      { id: "C", text: "讓分裂後左右子節點的樣本數盡量相等，使樹保持平衡以降低變異" },
      { id: "D", text: "讓樹盡可能長深，以確保每個葉節點都只包含單一樣本" },
    ],
    answer: "A",
    explanation:
      "兩種準則都在衡量「分完之後每一邊有多混雜」。挑選使不純度下降最多的分裂，就是讓同一節點內的樣本盡量屬於同一類，這是決策樹的貪婪建構原則。",
    choiceExplanations: {
      B: "線性相關係數衡量的是線性趨勢，與分裂後的類別純度不同；門檻也是逐一搜尋使不純度下降最多的切點，不是固定取平均值。",
      C: "決策樹追求的是純度而非樣本數平衡，強求左右均等反而會選到無法區分類別的切點。",
      D: "資訊增益與吉尼不純度衡量的是單次分裂的品質，目的不是讓樹變深；長到每葉只剩一筆樣本會嚴重過擬合，實務上反而要限制深度。",
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
      { id: "A", text: "每棵樹都使用完整的訓練資料與全部特徵，確保每棵樹都達到最佳準確率" },
      { id: "B", text: "把每棵樹的深度限制為 1，以大量決策樁的多數決降低過擬合風險" },
      { id: "C", text: "依序訓練每棵樹去修正前一棵樹的錯誤，逐步降低整體的偏差" },
      { id: "D", text: "以自助抽樣與隨機特徵子集訓練多棵樹，降低彼此相關性後再平均" },
    ],
    answer: "D",
    explanation:
      "多棵高變異但彼此相關性低的樹取平均後，變異被有效抵消。兩層隨機性（樣本自助抽樣、每次分裂只考慮部分特徵）正是為了降低樹與樹之間的相關性。",
    choiceExplanations: {
      A: "不做隨機化時每棵樹幾乎一樣，平均後沒有降變異的效果；單棵樹準確率高並不等於集成的泛化好。",
      B: "深度為 1 的決策樁常用於 Boosting 依序修正錯誤；隨機森林通常讓每棵樹長深，靠多棵低相關的樹平均來降低變異。",
      C: "依序修正前一棵樹的錯誤是 Boosting 的策略，主要降低偏差；隨機森林是平行訓練彼此獨立的樹再平均，以降低變異。",
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
        C: "Neighbor Concept",
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
      { id: "A", text: "以核函數衡量樣本間的相似度，藉此自動填補缺失值後再訓練分類器" },
      { id: "B", text: "只保留位於邊界附近的支援向量，以減少需要儲存與計算的樣本數量" },
      { id: "C", text: "在不顯式計算高維座標的情況下，於高維空間中尋找線性可分的邊界" },
      { id: "D", text: "把資料映射到高維後，改以迴歸方式擬合連續的類別分數" },
    ],
    answer: "C",
    explanation:
      "核函數直接給出兩點在高維空間中的內積，因此不必真的把資料映射過去。原本線性不可分的資料在高維中可能變得可分，計算成本卻沒有爆炸。",
    choiceExplanations: {
      A: "核函數衡量的是樣本在高維空間中的內積相似度，用來尋找分界；缺失值填補是前處理工作，不是核技巧的用途。",
      B: "決策只依賴支援向量是 SVM 最大邊界的特性，與核技巧無關；核技巧反而需要計算核矩陣，其大小隨樣本數平方成長。",
      D: "SVM 雖有迴歸版本（SVR），但核技巧的作用是在高維空間中尋找分界，不是把分類問題改成迴歸。",
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
        B: "Neighbor Concept",
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
      { id: "A", text: "群中心以眾數更新，只適用類別型資料，數值型資料須改用其他方法" },
      { id: "B", text: "需事先指定群數，且傾向找出大小相近的球形群集" },
      { id: "C", text: "需要部分標註樣本作為初始中心，沒有標籤就無法開始迭代" },
      { id: "D", text: "每次只能切成兩群，多群需求須以階層方式反覆二分" },
    ],
    answer: "B",
    explanation:
      "K-means 以到中心的距離分配樣本，因此偏好凸的、大小密度接近的球形群；k 值也必須事先給定，通常靠肘部法或輪廓係數輔助決定。",
    choiceExplanations: {
      A: "情況正好相反：K-means 以平均值更新中心、專為數值資料設計；以眾數更新、處理類別資料的是 k-modes。",
      C: "K-means 是非監督方法，初始中心可隨機選取或以 k-means++ 初始化，完全不需要標籤。",
      D: "k 可以是任意正整數；反覆二分是二分 K-means 等變形的做法，不是 K-means 本身的限制。",
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
      { id: "A", text: "預測房價這類連續數值，並以殘差平方和衡量誤差" },
      { id: "B", text: "二元分類，輸出為事件發生的機率" },
      { id: "C", text: "依樣本間的距離把資料分成數個群集" },
      { id: "D", text: "把高維特徵投影成少數主成分以降低維度" },
    ],
    answer: "B",
    explanation:
      "邏輯迴歸以 sigmoid 把線性組合映射到 0 到 1 之間，輸出可解讀為機率，再依門檻判定類別。它的係數可轉成勝算比，解釋性佳，在受監理領域非常常用。",
    choiceExplanations: {
      A: "預測連續數值、以平方誤差衡量是線性迴歸的工作；邏輯迴歸以 sigmoid 輸出機率，兩者名稱相近但用途不同。",
      C: "依距離分群是非監督任務，邏輯迴歸需要標籤才能訓練。",
      D: "投影成主成分是 PCA 的工作，邏輯迴歸不改變特徵維度。",
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
      { id: "B", text: "訓練時要建立完整的距離矩陣，因此訓練成本高而推論極快" },
      { id: "C", text: "以投票決定類別，因此不需要定義距離度量也能運作" },
      { id: "D", text: "以多數決分類，因此對特徵尺度與單位完全不敏感" },
    ],
    answer: "A",
    explanation:
      "KNN 屬於惰性學習：訓練只是把資料存起來，真正的計算發生在推論時（找出最近的 k 個鄰居）。資料量大時推論會很慢，通常需要近似最近鄰索引加速。",
    choiceExplanations: {
      B: "情況正好相反：KNN 訓練只是把資料存起來，推論時才計算新樣本與訓練資料的距離，因此是訓練便宜、推論昂貴。",
      C: "投票的對象是「最近」的 k 個鄰居，而「最近」必須靠距離度量定義，距離正是 KNN 的核心。",
      D: "多數決之前要先找出最近的鄰居，距離會被大尺度特徵主導，因此 KNN 對特徵縮放非常敏感。",
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
      { id: "B", text: "以自助抽樣同時訓練多棵彼此獨立的樹，再將預測取平均" },
      { id: "C", text: "訓練一棵極深的樹，再以剪枝逐步移除誤差較大的分支" },
      { id: "D", text: "對每棵樹以驗證誤差加權，最後只保留誤差最小的一棵作為模型" },
    ],
    answer: "A",
    explanation:
      "梯度提升是加法模型：每一輪針對當前模型的負梯度（近似殘差）訓練一棵新的弱學習器並加入集成，因此後面的樹專門修正前面的錯誤。",
    choiceExplanations: {
      B: "同時訓練獨立的樹再平均是 Bagging（如隨機森林）的做法，主要降低變異；梯度提升是依序加入新樹修正殘差。",
      C: "先長深再剪枝是單棵決策樹的做法；梯度提升使用多棵淺樹，靠數量與序列修正降低誤差。",
      D: "只保留一棵等於放棄集成；梯度提升是把所有樹的輸出累加起來，後面的樹專門修正前面的錯誤。",
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
      { id: "A", text: "LightGBM 採層級式（Level-wise）生長，XGBoost 則只支援葉子式" },
      { id: "B", text: "XGBoost 以直方圖分箱加速，LightGBM 則逐一掃描所有精確切點" },
      { id: "C", text: "XGBoost 多採層級式（Level-wise），LightGBM 採葉子式（Leaf-wise）" },
      { id: "D", text: "XGBoost 只能做分類任務，LightGBM 才支援迴歸與排序（Ranking）" },
    ],
    answer: "C",
    explanation:
      "層級式在同一深度同時分裂所有葉節點，樹形較均勻；葉子式優先分裂增益最大的葉，樹較深且不均勻，通常收斂更快但更需要限制葉節點數以防過擬合。",
    choiceExplanations: {
      A: "方向正好相反：LightGBM 的預設是葉子式，優先分裂增益最大的葉；XGBoost 預設為層級式，並非只支援葉子式。",
      B: "直方圖分箱正是 LightGBM 的核心加速手法，說它逐一掃描精確切點與事實相反；何況這屬於切點搜尋方式，不是樹的生長策略。",
      D: "兩者都支援分類、迴歸與排序等多種任務，且題目問的是樹的生長策略。",
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
        A: "Terminology Swap",
        B: "Terminology Swap",
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
      { id: "A", text: "以密度定義群集，因此只適用於二維或三維的空間資料" },
      { id: "B", text: "以鄰域查詢取代反覆更新中心，因此在任何資料量下都比 K-means 快" },
      { id: "C", text: "能自動從資料推斷密度門檻，因此完全不需要設定任何參數" },
      { id: "D", text: "不需事先指定群數，且能找出任意形狀的群集並標示雜訊點" },
    ],
    answer: "D",
    explanation:
      "DBSCAN 以密度定義群集，因此能找出彎曲或環狀的群，並自然地把低密度區域的點標為雜訊。代價是需要調整鄰域半徑與最小點數兩個參數。",
    choiceExplanations: {
      A: "DBSCAN 可用於任意維度，只是高維時距離趨於一致、密度概念會退化；它並不限於二、三維資料。",
      B: "速度取決於資料量、維度與索引結構，沒有空間索引時鄰域查詢可能接近平方複雜度，DBSCAN 不必然比 K-means 快。",
      C: "它不會自動推斷門檻，仍需設定鄰域半徑 eps 與最小點數 minPts，且結果對這兩個參數相當敏感。",
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
  {
    id: "senior-ml-practice-q117",
    subjectId: "senior-ml",
    prompt:
      "某醫院要以高維度的基因表現資料（數萬特徵、僅數百樣本）建立分類模型。下列選型與理由何者最合理？",
    choices: [
      { id: "A", text: "優先考慮支援向量機或強正則化的線性模型，並搭配特徵篩選降低過擬合風險" },
      { id: "B", text: "優先使用深層神經網路，因為特徵數量越多越能發揮它自動學習特徵表示的優勢" },
      { id: "C", text: "優先使用 KNN，因為不需訓練、能直接以基因表現的相似度比對病例" },
      { id: "D", text: "優先使用未剪枝的深樹，讓模型完整捕捉數萬個基因之間的交互作用" },
    ],
    answer: "A",
    explanation:
      "數萬特徵配數百樣本，任何高容量模型都會嚴重過擬合。SVM 以最大化邊界的方式在高維中仍有良好表現，強正則化的線性模型則直接壓抑係數，兩者都是這個情境的標準選擇。",
    choiceExplanations: {
      B: "深層網路能否發揮取決於樣本數而非特徵數；數百樣本對上數萬特徵，高容量的網路必然過擬合。",
      C: "高維空間中樣本間的距離趨於一致（維度詛咒），數萬個特徵讓「最近鄰」幾乎失去鑑別力。",
      D: "未剪枝的深樹能把數百樣本完全記住，看似捕捉了交互作用，實際上是在擬合雜訊，泛化極差。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["高維小樣本", "SVM", "正則化"],
      constraints: ["data_volume", "quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L23301",
      decisionBoundary:
        "若樣本數成長到數十萬，SVM 的核矩陣運算會變得不可行，此時該改用線性模型或梯度提升樹。",
    },
  },
  {
    id: "senior-ml-practice-q118",
    subjectId: "senior-ml",
    prompt:
      "某銀行的梯度提升樹模型在訓練集近乎完美、驗證集表現平庸。已知學習率 0.3、樹數 2000、無深度限制。下列調整組合何者最合理？",
    choices: [
      { id: "A", text: "移除子取樣與正則化參數，讓模型以全部資料與完整複雜度擬合以穩定表現" },
      { id: "B", text: "維持學習率不變，把樹的數量增加到 5000，讓集成平均掉驗證誤差" },
      { id: "C", text: "提高學習率並減少樹數，讓模型在較少輪數內收斂以降低過擬合" },
      { id: "D", text: "調低學習率並增加樹數、限制樹深與葉節點最小樣本數，並以驗證集早停" },
    ],
    answer: "D",
    explanation:
      "高學習率配上無深度限制的兩千棵樹，等於讓模型有充分的自由把訓練集背下來。調低學習率讓每棵樹只做小幅修正、限制樹的複雜度、再以早停在驗證集轉壞前停下，三者一起才收得住。",
    choiceExplanations: {
      A: "子取樣與正則化正是約束模型的手段，全部移除只會讓訓練集背得更徹底，過擬合加劇。",
      B: "梯度提升的樹是依序修正殘差而非彼此平均，樹更多只會讓模型更貼合訓練集；「多樹平均降變異」是隨機森林的邏輯。",
      C: "提高學習率會讓每棵樹的修正幅度更大、更快貼合訓練集；減少樹數無法抵銷高學習率配上無深度限制所造成的過擬合。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["梯度提升調參", "學習率與樹數", "早停"],
      constraints: ["quality", "compute"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若學習率調低但樹的數量沒有相應增加，模型會停在欠擬合——這兩個參數必須成對調整。",
    },
  },
  {
    id: "senior-ml-practice-q119",
    subjectId: "senior-ml",
    prompt:
      "某工廠以 K-means 分群設備行為，但群集呈細長帶狀且密度不均，分群結果與現場認知不符。下列處置何者最合理？",
    choices: [
      { id: "A", text: "先刪除細長群集中偏離中心的樣本，讓剩餘資料符合 K-means 的球形假設" },
      { id: "B", text: "逐步增加 K 值並以肘部法挑選，直到分群結果與現場認知相符" },
      { id: "C", text: "K-means 偏好大小相近的球形群；應改用密度式分群並允許標示雜訊點" },
      { id: "D", text: "改用監督式分類，以現場人員對設備行為的認知作為標籤訓練模型" },
    ],
    answer: "C",
    explanation:
      "問題出在演算法的假設而非參數。K-means 的距離分配天生偏好球形且大小相近的群，細長或密度不均的結構它抓不到；密度式分群直接以密度定義群集，正好對應。",
    choiceExplanations: {
      A: "刪除樣本是在遷就演算法的假設，會丟掉真實存在的設備行為型態，結果也不再代表現場。",
      B: "肘部法只能調整群數；增加 K 會把細長群切成多段，仍無法還原它原本的形狀，問題出在演算法的假設而非參數。",
      D: "題幹沒有既定的分類標籤可用，「現場認知」也不是逐筆的標註；這是分群問題，監督式的前提不成立。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["K-means 假設", "密度式分群", "群集形狀"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若各群的密度差異也很大，單一組鄰域參數同樣無法適配，此時要改用可處理多層密度的變形演算法。",
    },
  },
  {
    id: "senior-ml-practice-q120",
    subjectId: "senior-ml",
    prompt:
      "某教育平台要在中小型表格資料上做分類，並希望開發週期短、調參門檻低。下列選型何者最合理？",
    choices: [
      { id: "A", text: "先以大型 Transformer 建立基準，再以預訓練權重縮短開發週期" },
      { id: "B", text: "先以梯度提升樹或隨機森林建立基準，不需標準化且調參門檻低" },
      { id: "C", text: "先以生成對抗網路擴充樣本，再把生成器的輸出直接作為分類結果" },
      { id: "D", text: "先以 K-means 分群並把群編號當作類別預測，省去標註與調參成本" },
    ],
    answer: "B",
    explanation:
      "樹系集成在中小型表格資料上通常表現優異，且不需要標準化、能自然處理類別與缺失值，訓練快、超參數也相對寬容——作為第一個基準的性價比最高。",
    choiceExplanations: {
      A: "Transformer 需要大量資料與調參經驗才能發揮，表格資料也少有可直接沿用的預訓練權重，在中小型表格上常不敵樹模型。",
      C: "生成對抗網路用於生成資料，訓練不穩定、調參門檻高，生成器輸出的是合成樣本而非分類預測。",
      D: "K-means 是非監督分群，群編號不對應既有的類別標籤，無法直接當作分類預測。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["樹系集成", "基準模型", "調參成本"],
      constraints: ["data_volume", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Terminology Swap",
      },
      crossNode: "L23302",
      decisionBoundary:
        "若資料改為影像、文字或語音這類非結構化輸入，樹模型的優勢消失，深度網路才是合理的起點。",
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
      { id: "B", text: "會因為層層相乘而自動形成類似卷積的局部特徵擷取" },
      { id: "C", text: "每層各自學習不同的線性特徵，層數越多表達力越強" },
      { id: "D", text: "梯度會在反向傳播時直接變為零，導致網路無法訓練" },
    ],
    answer: "A",
    explanation:
      "線性轉換的複合仍是線性轉換。少了非線性，一百層的網路與一層在表達力上完全相同，這正是激活函數不可或缺的理由。",
    choiceExplanations: {
      B: "卷積來自特定的局部連接與權重共享結構，與是否使用激活函數無關；線性層相乘不會自動形成卷積。",
      C: "線性轉換的複合仍是線性轉換，層數再多也只是一個線性模型，表達力並未增加。",
      D: "線性網路的梯度完全可以計算與更新，問題不在無法訓練，而是結果等價於單層線性模型。",
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
      { id: "A", text: "隨訓練進度動態調低學習率，避免後期更新幅度過大" },
      { id: "B", text: "依權重大小永久移除不重要的神經元，以縮小模型並加速推論" },
      { id: "C", text: "對輸入加入隨機遮蔽產生新樣本，以擴充訓練資料的筆數" },
      { id: "D", text: "隨機暫時關閉部分神經元，降低神經元間的共適應以抑制過擬合" },
    ],
    answer: "D",
    explanation:
      "每次前向傳播隨機讓一部分神經元失效，迫使網路不能依賴特定少數神經元的組合，等於在訓練許多子網路並取集成效果。推論時則關閉 Dropout。",
    choiceExplanations: {
      A: "動態調整學習率是學習率調度器的工作，與 Dropout 隨機關閉神經元無關。",
      B: "依權重永久移除神經元是剪枝；Dropout 只在訓練時暫時讓神經元失效，推論階段所有神經元都會參與。",
      C: "Dropout 作用在網路內部的神經元，並不產生新樣本，屬於正則化而非資料增強。",
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
        B: "Neighbor Concept",
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
      { id: "A", text: "依各層輸出的分布自動決定需要的網路層數與寬度" },
      { id: "B", text: "讓每個批次抽到的各類別樣本數相同，消除類別不平衡" },
      { id: "C", text: "穩定各層輸入的分布，加速收斂並允許較大的學習率" },
      { id: "D", text: "把各層輸出強制標準化為常態分布，因此可以取代激活函數" },
    ],
    answer: "C",
    explanation:
      "把每一層輸入標準化後再以可學習的參數縮放平移，能減少訓練過程中分布劇烈變動造成的困擾，讓訓練更穩定、可用更大的學習率，並帶有輕微的正則化效果。",
    choiceExplanations: {
      A: "層數與寬度屬於架構設計，批次正規化只標準化各層輸入的分布，不會決定架構。",
      B: "它正規化的是特徵數值的分布，不是樣本筆數或類別比例；類別不平衡需另外以重抽樣或加權處理。",
      D: "標準化本身是線性操作，無法引入非線性；它與激活函數是互補關係，通常搭配使用而非取代。",
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
      { id: "A", text: "以捷徑跳過部分層的運算，因此大幅減少模型的參數量" },
      { id: "B", text: "提供梯度的捷徑，使極深網路仍能有效訓練" },
      { id: "C", text: "把輸入直接複製到輸出，讓網路不需要再學習新特徵" },
      { id: "D", text: "在每層之後重新標準化輸入分布，使訓練不受初始化影響" },
    ],
    answer: "B",
    explanation:
      "把輸入直接加到輸出上，讓梯度可以沿著捷徑回傳而不必逐層相乘衰減，因此上百層的網路也能訓練得動。這是 ResNet 之後深度大幅增加的關鍵。",
    choiceExplanations: {
      A: "殘差連接只是把輸入加到輸出上，被跨越的層仍然存在、參數仍要訓練；它改變的是梯度流動路徑，而非參數量。",
      C: "殘差連接讓各層只需學習輸入之上的殘差，而不是完全不學；網路仍要從資料中學到新的特徵。",
      D: "重新標準化各層輸入分布是批次正規化的作用；殘差連接是把輸入加到輸出上，提供梯度捷徑。",
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
        C: "Partial Truth",
        D: "Neighbor Concept",
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
      { id: "A", text: "以參數共享取代遞迴結構，因此參數量必定比 RNN 少" },
      { id: "B", text: "自注意力可直接建立任意位置之間的關聯，且可高度平行化訓練" },
      { id: "C", text: "以自注意力同時處理所有位置，因此不再需要任何位置資訊" },
      { id: "D", text: "以固定大小的隱藏狀態保存上下文，推論記憶體不隨序列長度增加" },
    ],
    answer: "B",
    explanation:
      "RNN 必須逐步遞迴，長距離依賴要經過很多步而容易衰減，也難以平行。自注意力一次計算所有位置之間的關聯，長距離依賴是一步之遙，訓練也能充分平行化。",
    choiceExplanations: {
      A: "RNN 本身就在各時間步之間共享參數；Transformer 通常參數量更大，優勢不在參數少。",
      C: "自注意力本身對順序不敏感，正因為同時處理所有位置，才必須額外加入位置編碼。",
      D: "以固定大小隱藏狀態保存上下文是 RNN 的做法；Transformer 的注意力計算與快取隨序列長度成長，記憶體需求往往更高。",
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
        C: "Partial Truth",
        D: "Terminology Swap",
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
      { id: "B", text: "讓每個位置擁有獨立的濾波器，以捕捉影像各區域不同的特徵" },
      { id: "C", text: "讓所有濾波器共用同一組權重，使網路只需學習一種特徵" },
      { id: "D", text: "使卷積層可省略激活函數，因為共享權重已提供非線性" },
    ],
    answer: "A",
    explanation:
      "同一個濾波器滑過整張影像，代表「偵測邊緣」這件事在任何位置都用同一組權重。參數量因此遠低於全連接層，也帶來位移不變性。",
    choiceExplanations: {
      B: "每個位置獨立參數是局部連接或全連接層的做法，參數量會大增且失去位移不變性，與權重共享相反。",
      C: "權重共享指同一個濾波器在不同位置共用權重；不同濾波器各有自己的權重，才能分別偵測邊緣、紋理等多種特徵。",
      D: "權重共享不會帶來非線性，卷積層之後仍需要激活函數。",
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
        C: "Terminology Swap",
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
      { id: "B", text: "依運算圖自動搜尋最佳的層數與連接方式，免去手動設計架構" },
      { id: "C", text: "以數值差分逐一擾動每個參數來估計梯度，免去推導公式" },
      { id: "D", text: "自動把訓練好的運算圖轉成服務並部署到伺服器" },
    ],
    answer: "A",
    explanation:
      "框架在前向傳播時記錄運算圖，反向時依鏈鎖律自動推算每個參數的梯度。這讓研究者能自由設計模型而不必為每個新結構手推導數。",
    choiceExplanations: {
      B: "自動搜尋架構是神經架構搜尋（NAS）的範疇；自動微分只負責計算梯度，架構仍由人設計。",
      C: "數值差分需要對每個參數各做一次前向計算，成本極高且有誤差；自動微分是依運算圖套用鏈鎖律求出精確梯度。",
      D: "部署由 MLOps 工具鏈負責；運算圖雖可匯出供部署使用，但那不是自動微分的功能。",
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
        C: "Neighbor Concept",
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
      { id: "A", text: "梯度估計過於平滑而失去方向，使訓練必定無法收斂" },
      { id: "B", text: "梯度估計更精確，因此模型的測試準確率一定隨之提升" },
      { id: "C", text: "記憶體需求上升，且梯度雜訊減少可能停在較差的解" },
      { id: "D", text: "每個訓練回合的更新步數增加，使總訓練時間大幅拉長" },
    ],
    answer: "C",
    explanation:
      "大批次讓梯度估計更精確但也更平滑，少了小批次那點雜訊帶來的探索能力，泛化有時反而變差；同時每步的記憶體佔用明顯上升。實務上常需搭配調整學習率。",
    choiceExplanations: {
      A: "平滑的梯度方向反而更精確，大批次通常仍能收斂，問題在於收斂到的解未必泛化較好。",
      B: "梯度估計較精確不等於泛化較好；批次大小與準確率沒有單調關係，過大反而可能停在較差的解。",
      D: "批次越大，每個回合需要的更新步數反而越少；它主要提高的是每一步的記憶體佔用。",
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
        B: "Partial Truth",
        D: "Terminology Swap",
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
      { id: "A", text: "凍結後的層不必再反向傳播，因此可以等效擴充訓練資料量" },
      { id: "B", text: "前面層的權重專為原任務類別設計，必須凍結以免與新任務的類別產生衝突" },
      { id: "C", text: "最後幾層已在預訓練中收斂，只需微調前面層即可適應新任務" },
      { id: "D", text: "前面層學到通用低階特徵，凍結可在小資料上避免過擬合並節省成本" },
    ],
    answer: "D",
    explanation:
      "淺層學到的是邊緣、紋理這類跨任務通用的特徵，深層才逐漸任務化。目標資料少時凍結淺層能大幅減少可訓練參數，降低過擬合風險也省算力。",
    choiceExplanations: {
      A: "凍結能省下前面層的梯度計算，但那只是節省算力，不會改變手上的資料量。",
      B: "前面層學到的是跨任務通用的低階特徵，正是要被保留利用的資產；真正與原任務類別綁定的是最後的分類層。",
      C: "方向正好顛倒：前面層學的是通用特徵而被凍結，最後幾層任務化程度最高，才需要以新資料重新訓練。",
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
  {
    id: "senior-ml-practice-q121",
    subjectId: "senior-ml",
    prompt:
      "某銀行的序列模型要處理長達數萬個 token 的交易紀錄，訓練時記憶體不足。已知使用標準自注意力。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "自注意力的記憶體隨長度平方成長；應改用稀疏或線性注意力，或先分段摘要" },
      { id: "B", text: "應增加層數並縮小每層的隱藏維度，讓總參數量下降以降低記憶體用量" },
      { id: "C", text: "應提高學習率以減少收斂所需步數，藉此降低訓練時的記憶體峰值" },
      { id: "D", text: "應改用更大的批次，讓每個樣本平攤固定的模型記憶體開銷" },
    ],
    answer: "A",
    explanation:
      "標準自注意力要計算每一對位置之間的關聯，長度加倍記憶體就變四倍。數萬 token 時這是硬限制，解法是換成複雜度更低的注意力變形，或先把序列壓縮。",
    choiceExplanations: {
      B: "記憶體瓶頸來自注意力矩陣隨序列長度平方成長，與參數量關係不大；增加層數反而讓每一層都要多存一份注意力矩陣。",
      C: "學習率只影響更新幅度與收斂速度，每一步的記憶體峰值由序列長度與模型結構決定，與學習率無關。",
      D: "每個樣本的注意力矩陣大小與批次無關，批次越大同時存在的注意力矩陣越多，記憶體壓力只會更嚴重。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["自注意力複雜度", "長序列", "稀疏注意力"],
      constraints: ["memory", "compute"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若序列長度只有數百個 token，平方成長的代價完全可以承受，標準自注意力的表現通常最好。",
    },
  },
  {
    id: "senior-ml-practice-q122",
    subjectId: "senior-ml",
    prompt:
      "某醫院的深度模型因記憶體限制只能使用批次大小 2，訓練極不穩定。已知模型含批次正規化層。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應把批次正規化層全部移除，改以較小的學習率維持訓練穩定" },
      { id: "B", text: "批次過小時批次統計量極不穩定，應改用層正規化或群組正規化" },
      { id: "C", text: "應提高學習率，讓參數更新幅度足以蓋過批次統計量的雜訊" },
      { id: "D", text: "應改用累積多步梯度的方式，讓批次正規化看到等效的大批次" },
    ],
    answer: "B",
    explanation:
      "批次正規化以該批次的統計量做標準化，批次只有 2 時這個估計幾乎是雜訊。層正規化與群組正規化改為在單一樣本內部計算，不受批次大小影響。",
    choiceExplanations: {
      A: "降低學習率或許能緩和震盪，但直接移除會失去正規化帶來的穩定性；應改用不依賴批次統計量的層正規化或群組正規化。",
      C: "提高學習率會放大不穩定的更新，讓訓練更容易發散，無法蓋過統計量的雜訊。",
      D: "梯度累積只是把多步的梯度加總後再更新，批次正規化在每次前向時仍以 2 筆樣本計算統計量，雜訊問題並未解決。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["批次正規化", "層正規化", "小批次"],
      constraints: ["memory", "compute"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L23103",
      decisionBoundary:
        "若記憶體允許把批次提高到 32 以上，批次統計量就穩定了，批次正規化的優勢重新成立。",
    },
  },
  {
    id: "senior-ml-practice-q123",
    subjectId: "senior-ml",
    prompt:
      "某教育平台的模型在訓練時加入 Dropout 後，訓練與驗證表現雙雙下降。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應在推論時也保持 Dropout 開啟，讓訓練與推論的網路結構一致以消除落差" },
      { id: "B", text: "表現下降代表正則化還不夠強，應提高丟棄率讓模型更快擺脫過擬合" },
      { id: "C", text: "模型原本可能欠擬合，Dropout 再降低有效容量；應先確認是否過擬合再決定正則化" },
      { id: "D", text: "應把 Dropout 換成 L1 正則化，讓模型以稀疏權重保留重要特徵而不損失容量" },
    ],
    answer: "C",
    explanation:
      "Dropout 是治過擬合的藥，不是通用補品。若模型本來就學不動（訓練與驗證都差），再降低有效容量只會更糟——用藥之前要先確認症狀。",
    choiceExplanations: {
      A: "推論時應關閉 Dropout（框架會自動處理輸出縮放以維持一致），開啟只會讓預測帶有不必要的隨機性，也無法解決欠擬合。",
      B: "訓練表現也一起下降，代表問題並非過擬合；提高丟棄率會讓有效容量更低，兩邊表現繼續下降。",
      D: "L1 同樣會壓縮模型的有效容量，在欠擬合時換成另一種正則化仍是繼續收緊，方向依然錯誤。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["Dropout", "欠擬合", "正則化適用時機"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若訓練表現極佳而驗證明顯落後，那才是 Dropout 的適用場景，加入後驗證通常會改善。",
    },
  },
  {
    id: "senior-ml-practice-q124",
    subjectId: "senior-ml",
    prompt:
      "某農業團隊的網路使用多層堆疊但未加入任何非線性激活函數。下列後果何者最正確？",
    choices: [
      { id: "A", text: "每層各自學到不同的線性組合，因此堆疊越多層、能擬合的函數就越複雜" },
      { id: "B", text: "多層線性轉換相乘後，會自動形成類似卷積的局部特徵" },
      { id: "C", text: "反向傳播時梯度會恆為零，導致訓練直接失敗無法計算" },
      { id: "D", text: "線性轉換的複合仍是線性轉換，整個網路等價於單層線性模型" },
    ],
    answer: "D",
    explanation:
      "多個線性層相乘仍然是一個線性映射。少了非線性，一百層的網路與一層在表達力上完全相同——這正是激活函數不可或缺的理由。",
    choiceExplanations: {
      A: "線性轉換的複合仍是線性轉換，層數再多也只是一個線性模型，能擬合的函數並未變得更複雜。",
      B: "卷積來自局部連接與權重共享的特定結構，與是否使用激活函數無關。",
      C: "線性網路的梯度完全可以計算與更新，只是結果等價於單層線性模型。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["非線性激活", "線性複合", "表達力"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Layer Confusion",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若任務的真實關係本來就是線性的，退化成線性模型並非缺陷——問題只在於白白付出了多層的計算成本。",
    },
  },

  // ── L23301 數據準備與特徵工程（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q053",
    subjectId: "senior-ml",
    prompt:
      "對訓練集與測試集做特徵標準化時，正確的做法是下列何者？",
    choices: [
      { id: "A", text: "訓練集與測試集分別以各自的平均與標準差轉換，以反映各自分布" },
      { id: "B", text: "以訓練集計算平均與標準差，並用同一組參數轉換測試集" },
      { id: "C", text: "以全部資料（含測試集）計算平均與標準差，讓統計量估計更穩定" },
      { id: "D", text: "只轉換訓練集，測試集維持原始值以保留真實的資料分布" },
    ],
    answer: "B",
    explanation:
      "轉換參數必須只從訓練集學得，否則測試集的統計資訊會滲入訓練流程，形成資料洩漏而高估效能。上線時同樣以這組固定參數處理新資料。",
    choiceExplanations: {
      A: "各自標準化會讓同一個原始值在兩邊被映射到不同數值，模型的判斷基準因此錯位；轉換的目的是統一尺度，不是反映各自分布。",
      C: "統計量或許更穩定，但測試集的資訊已參與前處理，是典型的資料洩漏，會高估效能。",
      D: "只轉換一邊會讓訓練與推論的輸入尺度完全不同，預測必然錯亂；保留原始值並沒有任何好處。",
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
      { id: "A", text: "把時間欄位拆成年、月、星期等日曆欄位取代序列值" },
      { id: "B", text: "以未來時點的數值作為輸入，讓模型提前學到趨勢" },
      { id: "C", text: "以過去時點的數值作為預測當前值的輸入" },
      { id: "D", text: "把序列打散重排後，再取鄰近列的數值作為輸入" },
    ],
    answer: "C",
    explanation:
      "落後特徵讓模型看到「昨天、上週同期」的值，把時間上的依賴關係轉成一般的表格特徵，是時序建模最基本也最有效的手法。",
    choiceExplanations: {
      A: "拆解日曆欄位是時間特徵工程的另一種手法，描述的是週期性，而非以過去的數值預測當前值，不是落後特徵。",
      B: "使用未來數值會造成嚴重的資料洩漏，上線時根本取不到。",
      D: "打散重排會破壞時間順序，鄰近列不再代表前一時點，落後關係無從定義。",
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
        A: "Neighbor Concept",
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
      { id: "A", text: "編碼後的數值失去類別意義，樹模型無法以它做分裂" },
      { id: "B", text: "每個類別都會展開成一個欄位，造成維度爆增與稀疏矩陣" },
      { id: "C", text: "以同一筆樣本的標籤參與編碼造成洩漏，須用交叉折疊或留一法計算" },
      { id: "D", text: "稀有類別的平均值不可靠，必須先刪除這些樣本才能計算，導致樣本數減少" },
    ],
    answer: "C",
    explanation:
      "目標編碼以該類別的標籤平均取代原值，若計算時包含了樣本自己，等於把答案偷渡進特徵。標準做法是在折外資料上計算，並加入平滑處理稀有類別。",
    choiceExplanations: {
      A: "目標編碼後是單一數值欄位，樹模型可以直接依它分裂，在梯度提升樹上非常常用。",
      B: "展開成多欄是 one-hot 的問題；目標編碼把類別壓成單一數值，反而降維。",
      D: "稀有類別的平均值確實不可靠，但標準做法是加入平滑而非刪除樣本；編碼本身不影響樣本筆數。",
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
        D: "Partial Truth",
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
      { id: "B", text: "把一個特徵展開成原值與對數值兩欄，增加特徵數量" },
      { id: "C", text: "把連續數值依數量級切成數個區間，轉為類別特徵" },
      { id: "D", text: "把超過門檻的極端值直接截斷移除，讓分布對稱" },
    ],
    answer: "A",
    explanation:
      "對數把大數值壓得更多、小數值壓得較少，長尾因此被拉近，許多假設常態或對尺度敏感的模型表現會改善。注意零與負值需先平移處理。",
    choiceExplanations: {
      B: "對數轉換通常就地替換原值，不必新增欄位；即使保留兩欄，目的也不是增加特徵數量。",
      C: "取對數後仍是連續值；依區間切成類別是分箱，不是對數轉換。",
      D: "對數轉換保留所有樣本，極端值只是被壓縮到較近的位置；直接截斷移除是另一種處理離群值的做法。",
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
      { id: "A", text: "過濾法在模型訓練過程中同時完成特徵挑選，例如 L1 正則化" },
      { id: "B", text: "包裝法只看特徵與目標的相關係數，不需要訓練任何模型" },
      { id: "C", text: "過濾法考慮了特徵之間的組合效應，因此通常得到更好的子集" },
      { id: "D", text: "包裝法以實際模型的表現評估特徵子集，成本較高但更貼近目標" },
    ],
    answer: "D",
    explanation:
      "過濾法只看特徵與目標的統計關聯（如相關係數、卡方），快但忽略特徵組合與模型特性；包裝法反覆訓練模型來評估子集，貼近實際目標但成本高得多。",
    choiceExplanations: {
      A: "在訓練過程中同時挑選特徵（如 L1 正則化）是嵌入法；過濾法只看特徵與目標的統計關聯，不需要訓練模型。",
      B: "只看統計關聯是過濾法的做法；包裝法的核心正是以模型表現評估子集，必然要反覆訓練模型。",
      C: "過濾法逐一看特徵與目標的關聯，反而忽略了特徵組合；它速度快但未必更好，兩者是效率與貼近度的取捨。",
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
        A: "Neighbor Concept",
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
      { id: "A", text: "相鄰讀值被拆開後產生大量重複特徵，使特徵數量增加" },
      { id: "B", text: "時間順序被打亂導致梯度無法計算，模型無法訓練" },
      { id: "C", text: "重複樣本在切分時被自動去除，導致可用資料量減少" },
      { id: "D", text: "測試分數虛高，因為測試樣本與訓練樣本幾乎重複" },
    ],
    answer: "D",
    explanation:
      "相鄰時點的讀值幾乎相同，隨機切分會把「幾乎同一筆」的資料分到兩邊，模型看似表現極好，實際上只是記住了訓練樣本。應改以時間或機台為單位切分。",
    choiceExplanations: {
      A: "切分只決定樣本分到哪一邊，不會產生新的特徵欄位。",
      B: "時間順序被打亂並不影響梯度計算，模型仍然可以訓練，問題出在評估失真而非無法運作。",
      C: "隨機切分不會去除任何樣本，資料總量不變；問題正是重複樣本同時出現在兩邊。",
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
      { id: "B", text: "把少數類別樣本隨機複製多份，直到兩類別數量相同" },
      { id: "C", text: "依鄰近關係刪除類別邊界附近的多數類別樣本" },
      { id: "D", text: "以生成對抗網路學習整體資料分布，再大量生成兩類樣本" },
    ],
    answer: "A",
    explanation:
      "SMOTE 在少數類樣本與其近鄰之間的連線上插值產生新樣本，比單純複製更能擴大決策區域。要注意它應只在訓練折內執行，否則會造成評估洩漏。",
    choiceExplanations: {
      B: "單純複製是隨機過採樣，容易讓模型過度記憶那幾筆樣本；SMOTE 是在近鄰之間插值合成新樣本。",
      C: "刪除邊界附近的多數類別樣本是 Tomek Links 等欠採樣方法；SMOTE 是合成新的少數類別樣本，屬於過採樣。",
      D: "以生成模型產生樣本是另一類資料增強方法；SMOTE 不訓練生成模型，而是在少數類樣本與其近鄰之間插值。",
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
        C: "Neighbor Concept",
        D: "Neighbor Concept",
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
      { id: "A", text: "衍生特徵能取代多個原始欄位，因此一定能縮短訓練時間" },
      { id: "B", text: "把有意義的關係直接提供給模型，減少模型自行摸索所需的資料" },
      { id: "C", text: "衍生特徵已包含原始欄位的全部資訊，可完全取代原始特徵" },
      { id: "D", text: "加入有醫學依據的特徵後，模型結論有理論背書而可簡化評估" },
    ],
    answer: "B",
    explanation:
      "模型要自己從身高與體重學到非線性的比值關係需要大量樣本；直接給 BMI 等於把領域知識注入，讓模型省下摸索成本，在中小型資料上效益尤其明顯。",
    choiceExplanations: {
      A: "衍生特徵通常與原始特徵並存，未必縮短訓練時間；它的價值在於提升表現而非速度。",
      C: "BMI 無法還原身高與體重各自的資訊，原始特徵往往仍有衍生特徵沒涵蓋的訊號，通常兩者並存。",
      D: "特徵有理論依據不代表模型表現就好，無論特徵怎麼設計，都必須以獨立資料評估成效。",
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
  {
    id: "senior-ml-practice-q125",
    subjectId: "senior-ml",
    prompt:
      "某銀行以目標編碼處理數萬個商戶代碼，交叉驗證分數極佳但上線後大幅下滑。已知編碼是在全部訓練資料上一次算完的。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應提高模型的正則化強度，壓低模型對目標編碼欄位的過度依賴以縮小落差" },
      { id: "B", text: "應改用 One-hot 編碼取代目標編碼，從根本避免以標籤平均編碼帶來的洩漏風險" },
      { id: "C", text: "應增加交叉驗證的折數，讓每次訓練的資料更接近全量以得到更可信的分數" },
      { id: "D", text: "編碼含樣本自身標籤而洩漏答案；應改以折外方式計算，並對稀有商戶加入平滑" },
    ],
    answer: "D",
    explanation:
      "目標編碼以該類別的標籤平均取代原值，若計算時包含了樣本自己，那筆樣本的答案就進了它的特徵。折外計算切斷這條路徑；平滑則處理只出現一兩次的商戶，避免編碼值等同於單一樣本的標籤。",
    choiceExplanations: {
      A: "正則化只能降低模型對特徵的權重，無法消除特徵中已經含有答案這個事實。",
      B: "One-hot 雖然不用到標籤，但數萬個商戶會產生數萬維的稀疏矩陣，記憶體與效率都難以承受；折外計算就能在保留目標編碼的同時切斷洩漏。",
      C: "折數再多，只要編碼仍在全部資料上算，驗證折的標籤早已進入特徵，分數依然虛高。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["目標編碼", "折外計算", "平滑"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若某商戶在訓練集中只出現一兩次，即使折外計算，編碼值仍極不穩定，需要以全域平均平滑或直接歸為「其他」。",
    },
  },
  {
    id: "senior-ml-practice-q126",
    subjectId: "senior-ml",
    prompt:
      "某工廠以感測資料預測設備故障，同一台設備相鄰時點的讀值幾乎相同。若以隨機切分建立訓練與測試集，最可能的後果是下列何者？",
    choices: [
      { id: "A", text: "相鄰讀值被當作重複資料自動剔除，使可用的資料總量減少" },
      { id: "B", text: "時間順序被打亂使序列模型的梯度無法計算，導致無法完成訓練" },
      { id: "C", text: "近乎相同的樣本被分到兩邊，測試分數虛高；應改以時間或設備為單位切分" },
      { id: "D", text: "訓練集被抽走部分時段而產生欠擬合，使測試分數明顯偏低且低估模型" },
    ],
    answer: "C",
    explanation:
      "相鄰時點的讀值高度相關，隨機切分等於讓模型在測試時遇到「幾乎同一筆」的資料。分數看似極好，實際上只是記住了訓練樣本。",
    choiceExplanations: {
      A: "隨機切分不會剔除任何樣本，資料總量不變。",
      B: "隨機切分後模型仍可正常訓練，問題出在評估失真而非無法運作。",
      D: "方向正好相反：相鄰樣本幾乎相同，測試集等於在考已看過的資料，分數會虛高而非偏低。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["自相關", "群組切分", "評估失真"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若目標是預測「這台設備的下一秒」而非推廣到新設備，依時間切分同一台的資料就是正確設計，不構成洩漏。",
    },
  },
  {
    id: "senior-ml-practice-q127",
    subjectId: "senior-ml",
    prompt:
      "某醫院要把身高與體重轉為對臨床更有意義的特徵。下列處理何者最能體現領域知識的價值？",
    choices: [
      { id: "A", text: "把身高與體重分別標準化，讓兩者尺度一致後由模型自行學習關係" },
      { id: "B", text: "衍生 BMI 等具臨床意義的比值，直接提供已知的非線性關係" },
      { id: "C", text: "把身高與體重加總成單一的體型指標，減少特徵數並保留兩者資訊" },
      { id: "D", text: "兩者高度相關，應刪除其中一個欄位以避免共線性干擾模型係數" },
    ],
    answer: "B",
    explanation:
      "模型要自己從身高與體重學到 BMI 這種非線性比值需要大量樣本。直接把領域知識注入成衍生特徵，等於幫模型省下摸索成本，在中小型資料上效益尤其明顯。",
    choiceExplanations: {
      A: "標準化只調整尺度，並未提供兩者之間的比值關係；模型仍要靠大量樣本自行摸索。",
      C: "身高與體重單位不同，相加沒有任何臨床或物理意義，也無法保留兩者各自的資訊。",
      D: "兩者相關但各自帶有獨立資訊，刪除會損失訊號；共線性也不是本題要解決的問題。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["領域知識特徵", "衍生變數", "樣本效率"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
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
      { id: "A", text: "大型 Transformer 模型，以注意力機制捕捉欄位間的交互" },
      { id: "B", text: "梯度提升樹或隨機森林等樹系集成模型，訓練快且調參容易" },
      { id: "C", text: "深層卷積網路，以卷積核擷取相鄰欄位的局部特徵" },
      { id: "D", text: "生成對抗網路，先生成更多樣本再進行分類" },
    ],
    answer: "B",
    explanation:
      "樹系集成對特徵尺度不敏感、能自然處理類別與缺失值、在中小型表格資料上表現通常優於深度網路，且訓練快、調參門檻低，是合理的第一選擇。",
    choiceExplanations: {
      A: "Transformer 需要大量資料才能發揮，在中小型表格資料上常不敵樹模型，訓練與調參成本也高。",
      C: "卷積網路的歸納偏置針對影像的空間結構，表格欄位順序任意，相鄰欄位之間沒有這種結構。",
      D: "生成對抗網路用於生成資料，訓練不穩定，也不是分類任務的首選工具。",
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
      { id: "A", text: "以訓練時間最短的模型為優先，因為訓練快的模型推論也快" },
      { id: "B", text: "先選準確率最高的模型，上線後再加開伺服器解決延遲" },
      { id: "C", text: "在滿足延遲上限的模型中比較預測品質，必要時以壓縮換取速度" },
      { id: "D", text: "優先採用社群最常用的架構，因為其延遲已有公開數據保證" },
    ],
    answer: "C",
    explanation:
      "延遲上限是硬性約束，超過就無法上線。正確的順序是先以約束篩掉不可行的選項，再在可行集合中比較品質；量化、剪枝與蒸餾則是在品質與速度間換取空間的工具。",
    choiceExplanations: {
      A: "訓練時間與推論延遲沒有必然關係，例如 KNN 幾乎不用訓練卻推論很慢；訓練時間屬於開發成本。",
      B: "增加伺服器能提高吞吐量，卻無法縮短單次推論的延遲；超過延遲上限的模型根本不能上線。",
      D: "公開的延遲數據取決於別人的硬體與設定，無法保證符合本專案的約束，仍需實測。",
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
      { id: "A", text: "模型越複雜越能涵蓋細節，因此判斷依據也越容易解釋" },
      { id: "B", text: "應選擇參數最多的模型，因為它能涵蓋最多種可能的假設" },
      { id: "C", text: "在表現相當時優先選擇較簡單的模型" },
      { id: "D", text: "簡單模型的泛化必然優於複雜模型，應一律選擇最簡單者" },
    ],
    answer: "C",
    explanation:
      "表現相當時，簡單模型更容易解釋、部署與維護，過擬合風險也較低。這是取捨原則而非絕對規則——若複雜模型確實顯著更好，額外的複雜度就有其價值。",
    choiceExplanations: {
      A: "複雜度上升通常讓解釋變難，涵蓋更多細節也意味著判斷依據更難說清楚，敘述與事實相反。",
      B: "參數多不代表更好，反而增加過擬合與維運負擔；奧坎剃刀主張的正好相反。",
      D: "簡單模型未必更準，原則說的是「表現相當時」才選簡單的，並非一律選最簡單者。",
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
      { id: "B", text: "過擬合，應立即加強正則化並減少模型層數" },
      { id: "C", text: "資料洩漏，驗證資料混入了訓練集的樣本" },
      { id: "D", text: "測試集標籤標錯，導致訓練與驗證損失偏高" },
    ],
    answer: "A",
    explanation:
      "兩邊都差代表模型連訓練資料的規律都沒學到，屬於欠擬合。此時應增加模型容量、延長訓練、減少正則化強度，或回頭檢查特徵是否帶有足夠資訊。",
    choiceExplanations: {
      B: "過擬合的典型症狀是訓練損失低而驗證損失高，與此處描述相反；加強正則化只會讓欠擬合更嚴重。",
      C: "驗證資料混入訓練樣本會讓驗證分數異常好，不會兩邊都差。",
      D: "測試集只用於最終評估，標籤問題不會影響訓練與驗證階段的損失表現。",
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
      { id: "A", text: "把各模型的訓練資料合併後，重新訓練一個大模型" },
      { id: "B", text: "把各基模型的預測直接取平均或多數決，作為最終輸出的結果" },
      { id: "C", text: "依序訓練基模型，讓後一個模型擬合前一個的殘差" },
      { id: "D", text: "以各基模型的預測作為輸入，訓練一個上層模型做最終決策" },
    ],
    answer: "D",
    explanation:
      "堆疊讓上層的元學習器學會「什麼情況下該相信哪個基模型」，通常比單純平均更能發揮各模型的互補性。基模型的預測必須以折外方式產生，否則會洩漏。",
    choiceExplanations: {
      A: "合併訓練資料是資料層面的操作，與集成多個模型的預測無關。",
      B: "直接平均或多數決是簡單平均或投票集成；堆疊是另外訓練一個上層模型，學習如何組合各基模型的預測。",
      C: "依序擬合殘差是 Boosting 的做法；堆疊的基模型各自獨立訓練，再由上層模型整合其預測。",
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
        B: "Neighbor Concept",
        C: "Neighbor Concept",
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
      { id: "A", text: "改為完全人工判斷，模型只在背景計算以供內部參考" },
      { id: "B", text: "選擇準確率最高的黑箱模型，以整體驗證報告與模型卡代替逐案說明" },
      { id: "C", text: "以模型輸出的信心分數與預測類別，作為每一案的完整說明" },
      { id: "D", text: "接受略低的準確率，改用本質可解釋的模型或搭配可靠的解釋方法" },
    ],
    answer: "D",
    explanation:
      "在受監理場域，「無法說明」等於不能上線。犧牲幾個百分點換取可解釋性，往往是讓專案真正落地的唯一途徑。",
    choiceExplanations: {
      A: "題幹要求的是能逐案說明模型的判斷依據，而非不使用模型；在背景計算的模型同樣沒有解決說明的問題。",
      B: "整體驗證報告與模型卡只能說明平均表現與適用範圍，無法回答單一案件為何如此判斷，不符合逐案說明的監理要求。",
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
      { id: "A", text: "以大模型輸出的軟標籤訓練小模型，讓小模型逼近大模型的表現" },
      { id: "B", text: "依權重大小剪除一半參數，再以原資料微調恢復表現" },
      { id: "C", text: "把大模型與小模型的權重取平均，合併成一個中型模型" },
      { id: "D", text: "以小模型的輸出作為大模型的訓練目標，讓大模型學得更精簡" },
    ],
    answer: "A",
    explanation:
      "教師模型輸出的機率分布帶有類別之間的相似度資訊（軟標籤），比硬標籤更豐富。學生模型據此學習，能以小得多的體積接近教師的表現，適合端側部署。",
    choiceExplanations: {
      B: "依權重剪除參數再微調是剪枝，屬於另一種壓縮方法，並不涉及師生模型之間的軟標籤學習。",
      C: "權重平均只適用於同架構的模型，大小模型架構不同無法直接平均，且與蒸餾的師生關係不同。",
      D: "師生方向顛倒了：蒸餾是由大模型（教師）提供軟標籤讓小模型（學生）學習，目的是讓小模型逼近大模型。",
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
        D: "Terminology Swap",
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
      { id: "A", text: "選擇單折最高分的模型，因為它展現了模型的最佳潛力" },
      { id: "B", text: "傾向選擇變異較小的模型，因為它在新資料上表現較可預期" },
      { id: "C", text: "選擇變異較大的模型，因為高變異代表它對新資料樣態的反應較敏銳" },
      { id: "D", text: "以訓練時間較長的模型為準，因為訓練越久學得越充分" },
    ],
    answer: "B",
    explanation:
      "折間變異大代表模型對資料切分很敏感，上線後表現的不確定性也高。在平均相當時，穩定性是實務上更重要的選擇依據。",
    choiceExplanations: {
      A: "單折最高分可能只是運氣好，用它做決策等於挑選雜訊，並不代表模型的潛力。",
      C: "折間變異大代表表現對資料切分很敏感，上線後的不確定性高，並不是對新樣態反應敏銳。",
      D: "訓練時間長短與泛化能力沒有關係，訓練越久也可能只是更過擬合。",
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
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若變異大的那個模型平均表現明顯更好、且差距遠超過折間波動，就值得承擔不確定性——穩定性優先的前提是「平均相當」。",
    },
  },
  {
    id: "senior-ml-practice-q128",
    subjectId: "senior-ml",
    prompt:
      "某醫院比較兩個模型：甲的五折交叉驗證平均 AUC 0.86、折間標準差 0.01；乙平均 0.87、標準差 0.09。下列選擇與理由何者最合理？",
    choices: [
      { id: "A", text: "選乙，因為平均 AUC 較高，而五折平均本身已抵銷了各折之間的波動" },
      { id: "B", text: "傾向選甲——平均僅差 0.01，乙的折間變異卻大九倍，上線表現較不確定" },
      { id: "C", text: "選乙在五折中單折 AUC 最高的那一版，直接作為上線模型" },
      { id: "D", text: "兩者平均 AUC 差距不到 0.02，可視為等價，以隨機方式選一個上線即可" },
    ],
    answer: "B",
    explanation:
      "平均只差 0.01，遠在乙自己的波動範圍之內；而折間標準差 0.09 代表換一批資料表現就可能明顯不同。在平均相當時，穩定性是更可靠的選擇依據。",
    choiceExplanations: {
      A: "平均只是把波動藏起來而非消除；0.01 的差距落在乙自己的波動範圍內，不足以支撐它更好的結論。",
      C: "單折最高分可能只是那一折的資料剛好有利，用它做決策等於挑選雜訊，也放棄了交叉驗證的意義。",
      D: "平均相當不代表等價，兩者的穩定性差異明顯；隨機選擇放棄了手上的評估資訊。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["折間變異", "穩定性", "模型選擇"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若乙的平均高出 0.10、遠超過折間波動，就值得承擔它的不穩定性——穩定性優先的前提是平均相當。",
    },
  },
  {
    id: "senior-ml-practice-q129",
    subjectId: "senior-ml",
    prompt:
      "某工廠的即時判斷有 50 毫秒的硬性延遲上限，候選模型中準確率最高者需 200 毫秒。下列處置何者最合理？",
    choices: [
      { id: "A", text: "先以延遲上限篩掉不可行者，再於可行集合中比較準確率，必要時以量化、剪枝或蒸餾把模型壓進預算" },
      { id: "B", text: "選準確率最高的模型上線，延遲超標的部分改以非同步佇列處理，事後再補發判斷結果" },
      { id: "C", text: "以準確率與延遲加權成單一綜合分數排名，讓高準確率可以抵銷部分延遲超標的扣分" },
      { id: "D", text: "先在可行集合中挑出最快的模型直接上線，因為延遲是硬性約束，準確率就不必再比較" },
    ],
    answer: "A",
    explanation:
      "延遲上限是硬性約束，超過就無法上線——先篩掉不可行的，再在可行集合中挑最好的。壓縮技術則是在品質與速度之間換取空間的第三條路。",
    choiceExplanations: {
      B: "硬性上限代表判斷必須在 50 毫秒內完成，改成事後補發等於違反約束，產線早已放行該件。",
      C: "加權分數把硬性約束當成可互相抵銷的軟性目標，排名第一的模型仍可能超過 50 毫秒而無法上線。",
      D: "延遲上限只是篩選門檻，篩完後仍應在可行模型中比較準確率，只挑最快的會白白放棄品質。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["硬性約束", "可行集合", "模型壓縮"],
      constraints: ["latency", "quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若延遲上限其實有彈性（例如可先回傳暫時結果再更新），約束就從硬性變成軟性，模型選擇的空間也隨之放寬。",
    },
  },
  {
    id: "senior-ml-practice-q130",
    subjectId: "senior-ml",
    prompt:
      "某教育平台以堆疊集成組合三個基模型，上層模型的訓練輸入是三者的預測值。若這些預測值是各基模型在自己的訓練資料上產生的，最可能的後果是下列何者？",
    choices: [
      { id: "A", text: "三組預測值高度共線，上層模型會無法收斂，須先做主成分分析再訓練" },
      { id: "B", text: "三個基模型的預測彼此矛盾而互相抵銷，上層模型的驗證分數會明顯偏低" },
      { id: "C", text: "基模型在自己看過的資料上預測偏樂觀，上層模型學到被記憶過的答案，形成洩漏而在新資料上失準" },
      { id: "D", text: "只要增加基模型的數量與多樣性，各自的過擬合就會在上層被平均掉而不影響結果" },
    ],
    answer: "C",
    explanation:
      "基模型對自己訓練過的樣本本來就預測得特別準，上層模型看到的因此是一組過度樂觀的輸入。正確做法是以折外方式產生基模型的預測，讓上層看到的接近它在新資料上的真實表現。",
    choiceExplanations: {
      A: "基模型的預測確實常高度相關，但這不會讓上層無法收斂；真正的問題是這些預測在自己的訓練資料上偏樂觀，形成洩漏。",
      B: "在自己訓練資料上產生的預測只會一致地偏準，上層在這些輸入上的分數偏高而非偏低，失準要到新資料才顯現。",
      D: "多樣性能降低變異，但每個基模型在自己訓練資料上的預測都同樣偏樂觀，這個系統性偏差不會被平均掉。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["堆疊集成", "折外預測", "洩漏"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若基模型的預測是以折外方式產生，上層看到的就是接近真實的表現，堆疊的互補優勢才發揮得出來。",
    },
  },

  // ── L23303 模型訓練、評估與驗證（8 題）────────────────────────
  {
    id: "senior-ml-practice-q069",
    subjectId: "senior-ml",
    prompt:
      "在資料切分中，「驗證集」與「測試集」的角色差異是下列何者？",
    choices: [
      { id: "A", text: "兩者都用於調參，差別只在測試集通常切得比驗證集大" },
      { id: "B", text: "驗證集用於調整超參數與選模型，測試集只在最後評估一次" },
      { id: "C", text: "驗證集只在最後評估一次，測試集則用於反覆調整超參數" },
      { id: "D", text: "驗證集用於訓練時的早停，測試集用於挑選最佳超參數組合" },
    ],
    answer: "B",
    explanation:
      "反覆用同一份資料調參，等於間接把它學進模型，分數會樂觀偏誤。因此另留一份完全沒碰過的測試集，最後只用一次，才能得到接近真實的泛化估計。",
    choiceExplanations: {
      A: "測試集不能參與調參，否則分數失去公正性；兩者的差別在用途而非大小。",
      C: "角色被寫反了：反覆調參的是驗證集，最後只評估一次的才是測試集。",
      D: "早停確實用驗證集，但挑選超參數同樣是驗證集的工作；用測試集挑選會讓它失去最後一次公正評估的意義。",
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
        A: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Partial Truth",
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
      { id: "A", text: "依類別欄位排序後，把前段給訓練集、後段給測試集" },
      { id: "B", text: "讓每個子集內各類別的樣本數完全相同" },
      { id: "C", text: "維持各子集中類別比例與原資料一致" },
      { id: "D", text: "對少數類別過採樣，使各子集的類別比例變成一比一" },
    ],
    answer: "C",
    explanation:
      "類別不平衡時，隨機切分可能讓測試集裡幾乎沒有少數類別樣本，評估因此不穩定。分層抽樣確保每個子集的類別組成與整體一致。",
    choiceExplanations: {
      A: "依類別排序後切段會讓某些類別只出現在其中一個子集，正好破壞分層要維持的比例。",
      B: "分層維持的是與原資料一致的類別比例，不是把各類別數量拉成一樣；後者是平衡抽樣的做法。",
      D: "過採樣是處理不平衡的訓練手段，會改變類別比例；分層抽樣則是讓各子集保留原始比例。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "數值恆小於或等於 MAE，因為開根號會把誤差縮小" },
      { id: "B", text: "對所有誤差一視同仁，對離群值較不敏感" },
      { id: "C", text: "對大誤差的懲罰更重，因此對離群值較敏感" },
      { id: "D", text: "單位是目標值的平方，解讀前須再換算" },
    ],
    answer: "C",
    explanation:
      "RMSE 先平方再開根號，大誤差被平方後放大，因此對離群樣本特別敏感。若場域中偶發的大誤差代價特別高，用 RMSE 是合理的；若不希望被少數極端值主導，MAE 更穩健。",
    choiceExplanations: {
      A: "開根號抵銷的是先前的平方，整體上 RMSE 恆大於或等於 MAE，方向相反。",
      B: "一視同仁、對離群值較穩健的是 MAE；RMSE 的平方項會放大大誤差。",
      D: "單位是平方的是 MSE；RMSE 已開根號，單位與目標值相同。",
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
        B: "Terminology Swap",
        D: "Neighbor Concept",
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
      { id: "B", text: "PR 曲線不受類別比例影響，因此跨資料集比較時更穩定" },
      { id: "C", text: "ROC 的 AUC 在不平衡時一定低於 0.5，無法用來比較模型" },
      { id: "D", text: "PR 曲線把真陰性納入計算，因此更能反映大量負樣本下的分類品質" },
    ],
    answer: "A",
    explanation:
      "負樣本極多時，幾百個偽陽性除以數十萬負樣本仍是很小的偽陽性率，ROC 因此看起來很好；PR 曲線的精確率直接反映「報出來的有多少是真的」，更貼近實務關切。",
    choiceExplanations: {
      B: "恰好相反：ROC 不受類別比例影響，PR 曲線的精確率會隨正類比例變動。",
      C: "不平衡時 AUC 反而常顯得偏高，問題是過度樂觀，而不是低於 0.5。",
      D: "精確率與召回率都不含真陰性，PR 曲線的價值正是不被大量負樣本稀釋。",
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
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Terminology Swap",
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
      { id: "A", text: "模型的訓練損失接近零，預測機率因此貼近真實標籤" },
      { id: "B", text: "模型的 AUC 很高，能把正負樣本依機率正確排序" },
      { id: "C", text: "模型在各類別上的準確率相同，沒有偏向任何一類" },
      { id: "D", text: "模型輸出 0.8 的那些樣本中，實際約有 80% 為正類" },
    ],
    answer: "D",
    explanation:
      "校準關心的是輸出機率的可信度。在需要依機率做期望值決策（如定價、風險額度）的場景，校準比單純的排序能力更重要，可用可靠度圖或 Brier 分數評估。",
    choiceExplanations: {
      A: "訓練損失接近零往往代表過擬合，輸出機率反而可能過度自信，不代表在新資料上可信。",
      B: "AUC 衡量的是排序能力，排序正確不代表輸出的機率數值可信。",
      C: "各類別準確率一致是另一種評估面向，與輸出機率是否誠實無關。",
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
        C: "Neighbor Concept",
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
      { id: "A", text: "分數會偏高，但只要改用更多折數就能消除這個偏誤" },
      { id: "B", text: "交叉驗證只能用於評估，用它選超參數本身就違反規則" },
      { id: "C", text: "分數會被低估，因為每折訓練資料較少，應向上調整再公布" },
      { id: "D", text: "該分數已被用於選擇，帶有樂觀偏誤，應以獨立測試集重新評估" },
    ],
    answer: "D",
    explanation:
      "用來挑選的分數等於已經「看過」那份資料，挑出的往往是剛好在該切分上運氣好的組合。正確做法是保留獨立測試集，或採用巢狀交叉驗證。",
    choiceExplanations: {
      A: "偏誤方向說對了，但增加折數不改變同一份分數既用於選擇又用於評估的問題。",
      B: "交叉驗證正是超參數選擇的標準工具，問題在於別拿同一份分數當最終成績。",
      C: "每折資料較少確實帶來輕微的悲觀偏誤，但用同一份分數做選擇造成的樂觀偏誤才是主要問題，整體方向是高估。",
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
        A: "Partial Truth",
        B: "Overgeneralization",
        C: "Partial Truth",
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
      { id: "B", text: "持續監控伺服器延遲與錯誤率，異常時自動告警" },
      { id: "C", text: "監控模型輸出的平均信心分數，信心下降即代表準確率下降" },
      { id: "D", text: "固定每季以最新資料重新訓練，就不必另外量測效能" },
    ],
    answer: "A",
    explanation:
      "沒有新的真實標籤就無法計算上線後的準確率。以抽檢建立標籤回饋迴路，才能持續量測效能、及早發現漂移，也為重訓提供新資料。",
    choiceExplanations: {
      B: "延遲與錯誤率是系統健康指標，模型判斷全錯時它們仍可能完全正常。",
      C: "信心分數可當早期訊號，但不等於準確率；模型可能自信地答錯，沒有真實標籤仍無法確認效能。",
      D: "定期重訓不等於知道效能如何；沒有標籤回饋，既無法判斷重訓是否必要，也無法確認新模型有沒有更好。",
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
        C: "Partial Truth",
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
      { id: "A", text: "分群後分別調參，可以順便提高整體準確率" },
      { id: "B", text: "整體表現良好可能掩蓋特定子群體上的明顯劣化" },
      { id: "C", text: "各子群樣本數不同，分開計算才能消除整體的抽樣誤差" },
      { id: "D", text: "分群結果可以取代獨立測試集，作為最終評估" },
    ],
    answer: "B",
    explanation:
      "整體平均會被多數群體主導，某個少數群體即使表現極差也看不出來。分群評估既是公平性的基本要求，也常是發現資料代表性不足的第一線索。",
    choiceExplanations: {
      A: "分群檢視是評估方式，目的在發現落差，不是提升整體分數的手段。",
      C: "分群後每組樣本更少，抽樣誤差反而變大；分群的價值在於揭露整體平均掩蓋的落差。",
      D: "分群仍是在同一份測試資料上計算，只是換個切法檢視，無法取代獨立測試集的角色。",
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
  {
    id: "senior-ml-practice-q131",
    subjectId: "senior-ml",
    prompt:
      "某銀行以交叉驗證選出最佳超參數後，直接以同一份交叉驗證分數對外宣稱模型效能。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "增加折數並重複交叉驗證多次取平均，即可得到不偏的對外效能數字" },
      { id: "B", text: "分數會被低估，因為每折可用的訓練資料較少，應依折數比例向上調整後再公布" },
      { id: "C", text: "改用訓練集上的分數對外宣稱，因為那份資料沒有參與超參數選擇" },
      { id: "D", text: "該分數已被用於選擇而帶有樂觀偏誤，應改以獨立測試集或巢狀交叉驗證評估" },
    ],
    answer: "D",
    explanation:
      "用來挑選的分數等於已經「看過」那份資料，挑出的往往是剛好在該切分上運氣好的組合。要得到誠實的估計，必須用一份完全沒參與選擇的資料，或用巢狀交叉驗證把選擇與評估分開。",
    choiceExplanations: {
      A: "重複與增加折數只降低變異，不改變同一份資料既用於選擇又用於評估的偏誤。",
      B: "每折資料較少帶來的悲觀偏誤很小，主要問題是挑選造成的樂觀偏誤，方向是高估。",
      C: "訓練集分數來自模型擬合過的資料，偏誤比交叉驗證分數更嚴重，也不是獨立評估。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["選擇偏誤", "巢狀交叉驗證", "獨立測試集"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Terminology Swap",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若只試過一組超參數、沒有挑選的動作，那份交叉驗證分數就沒有被污染，可以直接引用。",
    },
  },
  {
    id: "senior-ml-practice-q132",
    subjectId: "senior-ml",
    prompt:
      "某醫院的模型整體 AUC 0.90，但拆開來看某一年齡層僅 0.62。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以整體 AUC 0.90 為準上線，子群落差留待累積更多資料再處理" },
      { id: "B", text: "把分群評估納入常規，並針對該年齡層補樣本或調整權重" },
      { id: "C", text: "把該年齡層排除在適用範圍外，並刪除其資料以提高整體 AUC" },
      { id: "D", text: "把整體 AUC 目標提高到 0.95，子群表現會隨整體提升而改善" },
    ],
    answer: "B",
    explanation:
      "整體指標會被多數群體主導，某個群體即使表現極差也看不出來。分群評估既是公平性的基本要求，也常是發現資料代表性不足的第一線索。",
    choiceExplanations: {
      A: "整體指標掩蓋了 0.62 的子群落差，先上線再說等於讓該年齡層病患承擔風險。",
      C: "刪資料只是讓指標好看，該年齡層的病患仍會就醫，等於放棄為他們服務。",
      D: "整體提升不保證子群跟著改善；提高整體目標可能讓模型更專注於多數群體，該年齡層反而更被忽略。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["分群評估", "子群體劣化", "代表性"],
      constraints: ["fairness", "quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L23402",
      decisionBoundary:
        "若該年齡層的樣本數太少、指標本身波動就大過真實差異，要先累積樣本或合併相近群體再判讀。",
    },
  },
  {
    id: "senior-ml-practice-q133",
    subjectId: "senior-ml",
    prompt:
      "某農業模型的實際收成結果要一整季後才揭曉，團隊想在期間內掌握模型是否仍然可靠。下列做法何者最合理？",
    choices: [
      { id: "A", text: "以輸入特徵與預測分布的漂移作為早期警訊，季末再以實際收成校準效能" },
      { id: "B", text: "期間內暫停模型，等季末收成揭曉後再一次量測準確率決定是否恢復" },
      { id: "C", text: "持續監控伺服器延遲與錯誤率，只要系統穩定就視為模型仍可靠" },
      { id: "D", text: "以前一季的收成標籤反覆計算準確率，作為本季模型可靠度的即時指標" },
    ],
    answer: "A",
    explanation:
      "標籤延遲一整季時，等真實結果才發現問題已經來不及。分布漂移可以立即量測——輸入或輸出的分布一變就先示警，等實際收成回來再拿來校準。",
    choiceExplanations: {
      B: "暫停讓整季失去模型輔助，季末才量測也來不及在期間內發現問題。",
      C: "延遲與錯誤率反映系統負載與健康，模型全部答錯時它們可能完全正常。",
      D: "前一季的標籤只反映過去，無法說明本季資料分布改變後模型是否仍可靠。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["標籤延遲", "分布漂移監控", "早期警訊"],
      constraints: ["maintainability", "data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若能即時取得部分實際結果（例如提前採收的樣區），直接監控準確率會比分布漂移更靈敏也更直接。",
    },
  },

  // ── L23304 模型調整與優化（8 題）──────────────────────────────
  {
    id: "senior-ml-practice-q077",
    subjectId: "senior-ml",
    prompt:
      "關於 L1 與 L2 正則化的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "L1 讓權重整體等比例縮小但不為 0，L2 則把部分權重壓到 0 產生稀疏解" },
      { id: "B", text: "L1 會把部分權重壓到 0 而產生稀疏解，L2 讓權重趨近 0 但不為 0" },
      { id: "C", text: "L1 與 L2 都會產生稀疏解，差別只在 L2 的收斂速度較快" },
      { id: "D", text: "兩者都會提升訓練集表現，L1 另外兼具特徵選擇效果" },
    ],
    answer: "B",
    explanation:
      "L1 懲罰權重絕對值，其在 0 點不可微的角點使最佳解容易落在座標軸上，因而產生稀疏解、兼具特徵選擇效果；L2 懲罰平方項，只是把權重整體縮小。",
    choiceExplanations: {
      A: "兩者的效果被寫反了：把權重壓到 0 產生稀疏解的是 L1，整體縮小權重的是 L2。",
      C: "只有 L1 的角點會把權重推到 0；L2 只是整體縮小權重，不產生稀疏解。",
      D: "L1 兼具特徵選擇沒錯，但正則化通常略微犧牲訓練集表現換取泛化，不會提升訓練集表現。",
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
        D: "Partial Truth",
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
      { id: "A", text: "能自動縮小搜尋範圍，不必事先指定各超參數的分布" },
      { id: "B", text: "嘗試次數足夠時一定能找到全域最佳組合，網格則不行" },
      { id: "C", text: "在相同預算下更可能覆蓋到重要超參數的有效範圍" },
      { id: "D", text: "會依前幾次結果挑選下一組，所以比網格更快收斂" },
    ],
    answer: "C",
    explanation:
      "實務上只有少數超參數真正重要。網格搜尋在不重要的維度上浪費了大量嘗試，隨機搜尋則讓每次嘗試在重要維度上都取到不同的值，相同預算下效率更高。",
    choiceExplanations: {
      A: "隨機搜尋仍需為每個超參數指定分布或範圍，否則無從抽樣，也不會自行縮小範圍。",
      B: "隨機搜尋是抽樣方法，嘗試再多也沒有找到全域最佳的保證。",
      D: "依歷史結果挑選下一組的是貝氏最佳化；隨機搜尋的每次抽樣彼此獨立。",
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
        D: "Terminology Swap",
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
      { id: "A", text: "依序嘗試前一組的鄰近組合，只要分數變好就沿著該方向持續往下搜尋" },
      { id: "B", text: "把所有組合依先驗機率排序後逐一試完，再挑出表現最好的一組" },
      { id: "C", text: "以代理模型預測各組超參數的表現，據此挑選最有價值的下一次嘗試" },
      { id: "D", text: "只挑代理模型預測分數最高的點，完全不考慮預測的不確定性" },
    ],
    answer: "C",
    explanation:
      "它用先前的嘗試建立表現的機率模型，再以採集函數在「可能很好」與「還不確定」之間權衡，挑出最值得試的下一組。單次訓練昂貴時特別划算。",
    choiceExplanations: {
      A: "這是局部貪婪搜尋，容易卡在局部最佳；貝氏最佳化用代理模型與採集函數兼顧探索與利用。",
      B: "逐一試完本質上仍是窮舉，貝氏最佳化的價值在於用少量嘗試挑出最值得試的下一組。",
      D: "只挑預測最佳會陷入只利用不探索；採集函數正是在「可能很好」與「還不確定」之間權衡。",
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
        A: "Neighbor Concept",
        B: "Terminology Swap",
        D: "Partial Truth",
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
      { id: "B", text: "把大模型的知識轉移到小模型，用小模型取代原模型" },
      { id: "C", text: "在訓練時隨機關閉部分神經元，以減少過擬合" },
      { id: "D", text: "把模型參數從 32 位元浮點數改成 8 位元整數以縮小體積" },
    ],
    answer: "A",
    explanation:
      "訓練後的網路往往存在大量接近零、貢獻極小的權重。剪掉它們可縮小體積、降低運算量，通常再微調幾輪就能把精度損失補回來。",
    choiceExplanations: {
      B: "這是知識蒸餾，要另外訓練一個小模型；剪枝則是直接移除原模型中貢獻小的連結。",
      C: "這是 Dropout，屬於訓練時的正則化，推論時神經元全數保留，模型不會變小。",
      D: "把參數轉成低位元整數是量化，與剪枝是兩種不同的壓縮手段。",
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
        B: "Neighbor Concept",
        C: "Neighbor Concept",
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
      { id: "A", text: "PTQ 會在訓練迴圈中插入偽量化節點，QAT 則直接轉換訓練好的權重" },
      { id: "B", text: "QAT 不需重新訓練，只要少量校準資料就能完成" },
      { id: "C", text: "兩者精度相同，差別只在 QAT 量化後的模型體積更小" },
      { id: "D", text: "QAT 在訓練時就模擬量化誤差，精度通常較佳但成本較高" },
    ],
    answer: "D",
    explanation:
      "PTQ 直接把訓練好的權重轉成低精度，流程簡單但可能掉點；QAT 在訓練迴圈中插入偽量化節點，讓模型學會適應量化誤差，精度較好但要重新訓練。",
    choiceExplanations: {
      A: "兩者被寫反了：插入偽量化節點的是 QAT，直接轉換權重的是 PTQ。",
      B: "只需少量校準資料、不重訓的是 PTQ；QAT 必須跑訓練流程。",
      C: "量化到相同位元數時兩者體積相近，差別在 QAT 的精度通常較好。",
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
        A: "Terminology Swap",
        B: "Terminology Swap",
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
      { id: "A", text: "每棵樹的修正幅度變大，模型更快擬合，但泛化通常較差" },
      { id: "B", text: "樹變多會使模型容量暴增，因此一定比原設定更容易過擬合" },
      { id: "C", text: "學習率降低可抵銷樹數增加的成本，因此訓練時間大致不變" },
      { id: "D", text: "每棵樹修正幅度變小、整體更平滑，泛化通常較佳但訓練較慢" },
    ],
    answer: "D",
    explanation:
      "小學習率讓每棵樹只做小幅修正，需要更多棵樹才能達到相同的擬合程度，但集成的結果較平滑、較不容易過度貼合雜訊。這是梯度提升最常見的調參取捨。",
    choiceExplanations: {
      A: "調低學習率讓每棵樹的修正幅度變小而非變大；樹變多也讓訓練變慢而非變快。",
      B: "樹變多同時搭配小學習率，每棵樹的貢獻被縮小，通常降低而非提高過擬合風險。",
      C: "每棵樹的計算量不因學習率而減少，樹變多訓練時間就增加。",
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
        A: "Terminology Swap",
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
      { id: "B", text: "增加模型層數與參數量，讓模型足以同時擬合驗證集" },
      { id: "C", text: "降低正則化並延長訓練，直到訓練損失收斂為零" },
      { id: "D", text: "把驗證集併入訓練集，讓模型看到更多資料" },
    ],
    answer: "A",
    explanation:
      "這是典型的過擬合。三個方向都能收斂訓練與驗證之間的落差：限制模型的自由度、讓模型看到更多樣的資料，或直接降低模型容量。",
    choiceExplanations: {
      B: "增加容量會讓模型更容易記住訓練資料，訓練與驗證的落差只會擴大。",
      C: "降低正則化與訓練損失趨零都會讓模型把雜訊也背下來，過擬合更嚴重。",
      D: "增加資料的方向沒錯，但併入驗證集就失去偵測過擬合的能力，問題被掩蓋而非解決。",
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
        D: "Partial Truth",
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
      { id: "A", text: "一律使用 0.5，因為模型輸出已經是機率" },
      { id: "B", text: "依偽陽性與偽陰性的實際成本，在驗證集上選出最適門檻" },
      { id: "C", text: "依兩類錯誤的成本比在測試集上反覆調整門檻" },
      { id: "D", text: "選擇讓驗證集整體準確率最高的那個門檻，自然能兼顧兩類錯誤" },
    ],
    answer: "B",
    explanation:
      "門檻本質上是商業決策：兩種錯誤的代價不同，最適門檻就不會是 0.5。應在驗證集上依成本函數選定，再到測試集驗證一次。",
    choiceExplanations: {
      A: "0.5 只是預設值，只有在兩種錯誤代價相同且機率校準良好時才恰當；輸出是機率不代表 0.5 最適。",
      C: "依成本調整的方向對，但在測試集上反覆調整等於把它當驗證集用，分數會失去公正性。",
      D: "準確率把兩類錯誤一視同仁，成本不同時，準確率最高的門檻未必最符合業務需求。",
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
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模型的機率輸出未經校準，依成本推導出的門檻也會偏掉，此時要先做校準再選門檻。",
    },
  },
  {
    id: "senior-ml-practice-q134",
    subjectId: "senior-ml",
    prompt:
      "某工廠把模型剪枝後參數量減少七成，但在既有硬體上的推論速度幾乎沒有改善。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "非結構化剪枝的稀疏權重需硬體或函式庫支援才會加速，否則應改用結構化剪枝" },
      { id: "B", text: "剪枝比例仍不足，稀疏度通常要超過九成，一般硬體上才會開始看到明顯加速" },
      { id: "C", text: "剪枝的效益只在減少記憶體用量，推論速度本來就只能靠後續量化來改善" },
      { id: "D", text: "應增加批次大小，讓稀疏矩陣運算填滿硬體的平行單元，才能發揮剪枝的加速效果" },
    ],
    answer: "A",
    explanation:
      "參數變少不等於運算變快。非結構化剪枝把權重打成稀疏矩陣，但一般硬體仍以稠密矩陣運算執行，沒有支援就享受不到加速。結構化剪枝直接移除整個通道，矩陣真的變小。",
    choiceExplanations: {
      B: "問題不在剪得不夠多：一般硬體仍以稠密矩陣運算執行稀疏權重，再剪只會損害準確率。",
      C: "量化確實能加速，但結構化剪枝直接移除通道、讓矩陣變小也能加速；說剪枝本質上無法加速是錯的。",
      D: "批次大小影響吞吐量，但硬體仍以稠密方式計算這些稀疏權重，加大批次不會讓剪掉的權重省下運算。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["結構化剪枝", "稀疏運算", "硬體支援"],
      constraints: ["compute"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若部署硬體與推論框架明確支援稀疏運算，非結構化剪枝就能真的換到速度，壓縮率也更高。",
    },
  },
  {
    id: "senior-ml-practice-q135",
    subjectId: "senior-ml",
    prompt:
      "某銀行要在有限的運算預算下調整六個超參數，其中只有兩個真正重要但事前不知道是哪兩個。下列搜尋策略何者最合理？",
    choices: [
      { id: "A", text: "先只調整學習率，確定最佳值後再逐一調整其餘五個參數" },
      { id: "B", text: "網格搜尋，每個維度取三個值窮舉，才能確保重要參數不被遺漏" },
      { id: "C", text: "隨機搜尋，相同預算下每次嘗試都在各維度取到新值，較易覆蓋重要範圍" },
      { id: "D", text: "貝氏最佳化，但先把其中四個參數固定為預設值，只搜尋任意挑出的兩個" },
    ],
    answer: "C",
    explanation:
      "網格搜尋在不重要的維度上浪費大量嘗試——每個不重要的維度都會讓重要維度的取樣點被重複。隨機搜尋讓每次嘗試在所有維度上都取到新值，相同預算下效率明顯較高。",
    choiceExplanations: {
      A: "逐一調整假設參數彼此獨立且預先知道誰重要；若重要的兩個不含學習率，大量預算會浪費在錯的方向。",
      B: "六維各取三值就是 729 組，預算有限時只能取極粗格點，且重要維度的取樣點被不重要維度重複浪費。",
      D: "事前不知道哪兩個重要，任意挑兩個可能正好錯過真正重要的參數，搜尋方法再好也找不到。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["隨機搜尋", "網格搜尋", "搜尋效率"],
      constraints: ["compute", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若只有兩三個超參數、每個又只有少數幾種合理取值，網格搜尋能窮盡所有組合，反而比隨機更可靠。",
    },
  },
  {
    id: "senior-ml-practice-q136",
    subjectId: "senior-ml",
    prompt:
      "某教育平台要調整分類門檻，已知漏判需輔導的學生成本遠高於誤判。下列做法何者最合理？",
    choices: [
      { id: "A", text: "依漏判成本較高的直覺把門檻調低到 0.1，不必再用資料驗證" },
      { id: "B", text: "沿用 0.5，因為門檻調低會讓誤判增加，整體準確率下降" },
      { id: "C", text: "依成本比在測試集上反覆調整，直到成本最低的門檻出現" },
      { id: "D", text: "依兩類錯誤的成本比在驗證集上推導門檻，再到測試集驗證一次" },
    ],
    answer: "D",
    explanation:
      "門檻本質上是商業決策：兩種錯誤的代價不同，最適門檻就不會是 0.5。應在驗證集上依成本函數選定，再到測試集驗證一次以確認沒有過度貼合驗證集。",
    choiceExplanations: {
      A: "調低門檻的方向正確，但具體數值應由成本比在驗證集上推導，憑直覺定值無法確認效果。",
      B: "誤判會增加沒錯，但漏判成本遠高於誤判，以準確率為準忽略了兩類錯誤的成本差異。",
      C: "依成本調整方向對，但在測試集上反覆調整等於把測試集當驗證集用，分數會失去公正性。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["門檻選擇", "錯誤成本", "驗證集"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        C: "Partial Truth",
      },
      crossNode: "L23303",
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
      { id: "A", text: "各方先把資料加密後上傳到中央伺服器，再由中央統一訓練模型" },
      { id: "B", text: "各方資料留在本地訓練，只交換模型更新以彙整成全域模型" },
      { id: "C", text: "各方各自訓練本地模型，推論時再以投票合併各方結果" },
      { id: "D", text: "中央把全域資料切片分送各方訓練，以平行運算加速" },
    ],
    answer: "B",
    explanation:
      "原始資料自始至終不離開所屬機構，中央只彙整梯度或權重差異。這讓多家醫院或銀行能在不共享病歷、帳戶明細的前提下共同訓練模型。",
    choiceExplanations: {
      A: "加密上傳仍是集中資料，訓練時須解密；聯邦學習的資料自始至終留在本地。",
      C: "這是各自訓練再集成，沒有彙整出全域模型；聯邦學習是反覆交換更新以共同訓練。",
      D: "這是分散式訓練，資料原本集中在中央；聯邦學習的資料分屬各方且不出門。",
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
        C: "Neighbor Concept",
        D: "Neighbor Concept",
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
      { id: "A", text: "從模型輸出反推出某筆訓練資料的原始內容" },
      { id: "B", text: "以大量查詢複製出功能相近的替代模型" },
      { id: "C", text: "判斷某筆特定資料是否曾被用於訓練該模型" },
      { id: "D", text: "在訓練資料中植入樣本，讓模型對特定輸入出錯" },
    ],
    answer: "C",
    explanation:
      "模型對訓練過的樣本通常表現得更有信心，攻擊者利用這個差異推斷某人是否在訓練集中。在醫療情境下，光是「這個人在糖尿病資料集裡」就已洩漏敏感資訊。",
    choiceExplanations: {
      A: "反推原始內容是模型反演或資料重建攻擊；成員推斷只判斷某筆資料是否在訓練集中。",
      B: "這是模型竊取（model extraction），目標是複製模型功能而非推斷成員身分。",
      D: "這是資料毒化或後門攻擊，發生在訓練階段；成員推斷是從輸出推斷資訊。",
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
      { id: "A", text: "把個資加密後全部保留，訓練時再解密使用" },
      { id: "B", text: "全部保留但限制存取權限，只有建模人員能讀取" },
      { id: "C", text: "只保留建模所必需的欄位，其餘識別資訊在前處理階段即移除" },
      { id: "D", text: "以假名替換姓名後保留其餘所有欄位，因為假名化資料已不屬於個資" },
    ],
    answer: "C",
    explanation:
      "沒被納入的資料就不會外洩，也不會被模型記憶。在資料進入訓練流程之前就砍掉非必要的識別欄位，是成本最低、效果最直接的隱私保護。",
    choiceExplanations: {
      A: "加密保護的是靜態儲存，訓練時仍需解密使用，模型依然可能記憶內容，非必要欄位也沒有減少。",
      B: "存取控制是必要的安全措施，但仍保留了非必要欄位，不符合只使用必要資料的最小化原則。",
      D: "假名化資料仍可能透過其他欄位重新識別，通常仍屬個資；保留所有欄位也違反最小化。",
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
        B: "Partial Truth",
        D: "Partial Truth",
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
      { id: "B", text: "改用參數更多的模型，讓有限容量不必集中在記憶少數敏感樣本上" },
      { id: "C", text: "對重複內容去重即可，敏感資料只出現一次就不會被記住" },
      { id: "D", text: "上線後由使用者回報外洩內容，再逐一從模型輸出過濾" },
    ],
    answer: "A",
    explanation:
      "記憶風險與資料中是否含敏感內容、該內容重複幾次高度相關。從源頭去識別化與去重，再輔以上線前的紅隊測試檢查是否會被誘導吐出原文，是三道互補的防線。",
    choiceExplanations: {
      B: "容量變大不會分散記憶，反而讓模型更能逐字記住罕見樣本，風險上升。",
      C: "去重能降低風險，但只出現一次的敏感內容仍可能被記憶，還需去識別化與輸出檢測。",
      D: "事後回報代表外洩已經發生，應在訓練前去識別化並在上線前主動檢測。",
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
        C: "Partial Truth",
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
      { id: "A", text: "保留原始資料但從訓練集標記排除，下次重訓時自然不會使用" },
      { id: "B", text: "只刪除原始資料即可，模型權重不含個資，完全不必處理" },
      { id: "C", text: "立即從頭重訓所有用過該資料的模型，不論風險高低一律重訓" },
      { id: "D", text: "刪除原始資料，並依風險評估決定是否重訓或採用機器遺忘技術" },
    ],
    answer: "D",
    explanation:
      "模型權重中可能仍留有該筆資料的影響，只刪來源不必然足夠。實務上須評估殘留風險，必要時重訓或採用機器遺忘（machine unlearning）方法，並留下處理紀錄。",
    choiceExplanations: {
      A: "刪除權要求刪除資料本身，只標記排除仍保有個資；現行模型的殘留影響也沒有處理。",
      B: "權重中可能仍留有該筆資料的影響，模型甚至可能記得其特徵，只刪來源未必消除風險。",
      C: "重訓確實能消除影響，但不論風險一律重訓成本極高；務實做法是依風險評估決定重訓或採用機器遺忘。",
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
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Overgeneralization",
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
      { id: "A", text: "攻擊者以大量查詢複製出功能相近的替代模型" },
      { id: "B", text: "攻擊者在推論時對輸入影像加入肉眼難辨的微小擾動，使模型誤判" },
      { id: "C", text: "攻擊者從模型輸出判斷某筆資料是否曾用於訓練" },
      { id: "D", text: "攻擊者在訓練資料中注入惡意樣本，使模型學到錯誤行為" },
    ],
    answer: "D",
    explanation:
      "毒化發生在訓練階段：只要能影響訓練資料來源（如開放投稿、爬取的公開內容），就能植入後門或整體降低模型品質。防範重點在資料來源可信度與異常樣本偵測。",
    choiceExplanations: {
      A: "以查詢複製模型是模型竊取（model extraction），與注入惡意樣本不同。",
      B: "這是對抗樣本攻擊，發生在推論階段，不涉及訓練資料。",
      C: "這是成員推斷攻擊，是從輸出推斷資訊，而非在訓練資料中注入樣本。",
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
      { id: "B", text: "簽訂保密協議後把原始資料集中到單一機構訓練" },
      { id: "C", text: "各方各自訓練，推論時再以投票整合結果" },
      { id: "D", text: "把原始資料去識別化後公開，供各方自由下載" },
    ],
    answer: "A",
    explanation:
      "聯邦學習讓資料不出門，安全彙總確保中央只看得到彙總後的更新，差分隱私再為更新加入雜訊以限制單一參與者的資訊洩漏。三者層層互補。",
    choiceExplanations: {
      B: "保密協議是法律保障，但資料仍離開各方，違背不願提供原始資料的前提。",
      C: "這只是集成各自的模型，無法共同學習，也不是常見的隱私保護訓練組合。",
      D: "去識別化資料仍可能被重新識別，且公開資料違背不願提供原始資料的前提。",
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
        C: "Neighbor Concept",
        D: "Partial Truth",
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
      { id: "A", text: "最終模型的權重檔、上線日期與負責人簽核，中間產物可以刪除" },
      { id: "B", text: "訓練資料版本、程式碼版本、超參數與評估結果的對應紀錄" },
      { id: "C", text: "每次訓練的 GPU 使用率與耗電量等資源監控紀錄" },
      { id: "D", text: "訓練資料的完整副本，程式碼與超參數可事後再推回" },
    ],
    answer: "B",
    explanation:
      "稽核要能回答「這個模型是怎麼來的」。資料版本、程式碼版本、超參數與評估結果四者齊全，才能重現當時的訓練並驗證流程是否合規。",
    choiceExplanations: {
      A: "只有權重檔與簽核無法回答模型是怎麼來的，資料與程式碼版本缺一就無法重現。",
      C: "資源紀錄有助於成本管理，但無法用來重現訓練或驗證流程是否合規。",
      D: "程式碼與超參數無法可靠地從資料推回，缺少任何一項都無法重現當時的訓練。",
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
        A: "Partial Truth",
        C: "Layer Confusion",
        D: "Partial Truth",
      },
      decisionBoundary:
        "四者齊全仍未必能重現——若相依套件版本或隨機種子沒有一併固定，同一份程式碼也可能訓出不同的模型。",
    },
  },
  {
    id: "senior-ml-practice-q137",
    subjectId: "senior-ml",
    prompt:
      "某醫院的模型被發現可透過反覆查詢判斷某位病患是否在訓練集中。下列處置組合何者最合理？",
    choices: [
      { id: "A", text: "模型反演攻擊；應延長訓練讓模型更穩定，並對輸出結果加上浮水印" },
      { id: "B", text: "成員推斷攻擊；應提高參數量讓模型泛化得更好，並公開權重接受外部專家審查" },
      { id: "C", text: "成員推斷攻擊；應以正則化、早停降低過度自信，並考慮差分隱私與查詢頻率限制" },
      { id: "D", text: "資料毒化攻擊；應重新檢查訓練資料來源，並移除可疑的病患樣本" },
    ],
    answer: "C",
    explanation:
      "這類攻擊利用的是模型對訓練樣本比對未見樣本更有信心的差距。縮小這個差距（正則化、早停）能直接削弱攻擊；差分隱私提供可量化的保證，限制查詢則減少累積推論的機會。",
    choiceExplanations: {
      A: "能判斷某人是否在訓練集是成員推斷而非反演；延長訓練只會加深過度自信，浮水印也擋不住推斷。",
      B: "攻擊類型辨識正確，但參數量越大記憶能力通常越強，公開權重更給攻擊者額外資訊。",
      D: "毒化是注入惡意樣本影響模型行為；本題是從查詢結果推斷成員身分，檢查資料來源無法解決。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["成員推斷攻擊", "過度自信", "差分隱私"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型對訓練樣本與未見樣本的信心分布幾乎相同（泛化良好、無過擬合），這種攻擊的成功率就趨近隨機猜測。",
    },
  },
  {
    id: "senior-ml-practice-q138",
    subjectId: "senior-ml",
    prompt:
      "某銀行的模型訓練資料由外部合作夥伴提供，資安團隊擔心其中被植入惡意樣本。下列防範重點何者最正確？",
    choices: [
      { id: "A", text: "成員推斷風險；應在訓練中加入差分隱私，並限制外部查詢頻率" },
      { id: "B", text: "傳輸安全風險；以加密通道與檔案雜湊確保資料在傳輸中未遭竄改即可" },
      { id: "C", text: "資料毒化風險；只要上線後持續監控整體準確率，下降時再回頭追查資料來源即可" },
      { id: "D", text: "資料毒化風險；重點在來源可信度驗證、異常樣本偵測與訓練前後的行為比對" },
    ],
    answer: "D",
    explanation:
      "毒化發生在訓練階段：只要能影響訓練資料來源，就能植入後門或整體降低模型品質。防線因此要架在資料進入訓練之前——來源可信度、異常樣本篩檢，以及比對訓練前後模型行為是否出現異常變化。",
    choiceExplanations: {
      A: "那是防止推斷訓練成員的手段；擔心惡意樣本被植入屬於資料毒化，防線應在資料進入訓練之前。",
      B: "加密與雜湊防的是路上被竄改，擋不住來源本身就送來惡意樣本。",
      C: "後門樣本往往只在特定觸發條件下才作用，整體準確率可能完全正常，防線應架在訓練之前。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["資料毒化", "來源可信度", "異常樣本偵測"],
      constraints: ["security", "data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Partial Truth",
      },
      crossNode: "L23301",
      decisionBoundary:
        "若訓練資料完全來自內部受控系統、外人無從投入樣本，毒化的攻擊面就不存在，防護重點會轉向推論階段的對抗樣本。",
    },
  },
  {
    id: "senior-ml-practice-q139",
    subjectId: "senior-ml",
    prompt:
      "某工廠要與同業共同訓練瑕疵模型，各方皆不願提供原始影像，且擔心從模型更新反推出對方的製程細節。下列技術組合何者最合理？",
    choices: [
      { id: "A", text: "聯邦學習讓影像留在各廠，疊加安全彙總，必要時再加入差分隱私" },
      { id: "B", text: "各方把影像加密後集中，由中立第三方解密訓練並簽訂保密協議" },
      { id: "C", text: "聯邦學習讓影像留在各廠，中央直接檢視各廠的梯度以剔除異常更新" },
      { id: "D", text: "各方把影像降解析度並裁切遮蔽後集中，以降低製程細節外洩" },
    ],
    answer: "A",
    explanation:
      "三層防護對應三個顧慮：聯邦學習讓原始影像不出廠、安全彙總讓中央看不到個別廠的更新、差分隱私再限制單一參與者可被推論的資訊量。",
    choiceExplanations: {
      B: "集中即使加密，第三方訓練時仍需解密使用，影像實質上已離開各廠，保密協議只是事後追責。",
      C: "影像雖不出廠，但中央看得到個別廠的更新，正是擔心被反推製程細節的破口；應以安全彙總隱藏個別更新。",
      D: "降解析與遮蔽只減少資訊量，影像仍離開各廠，也會損害瑕疵偵測所需的細節。",
    },
    topic: "L23401 數據隱私、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["聯邦學習", "安全彙總", "差分隱私"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若各廠的瑕疵型態差異極大，聯邦學習訓出的全域模型可能對誰都不夠好，此時要改為各自微調的個人化聯邦。",
    },
  },

  // ── L23402 演算法偏見與公平性（8 題）──────────────────────────
  {
    id: "senior-ml-practice-q093",
    subjectId: "senior-ml",
    prompt:
      "招募篩選模型以過去十年的錄取紀錄訓練，結果對女性申請者的通過率明顯偏低。最可能的根本原因是下列何者？",
    choices: [
      { id: "A", text: "模型參數量不足，無法學到女性申請者的特徵" },
      { id: "B", text: "訓練資料反映了過去人為決策中既存的偏誤" },
      { id: "C", text: "女性申請者樣本數較少，造成模型隨機誤差偏大" },
      { id: "D", text: "交叉驗證切分不當，讓驗證分數高估了模型" },
    ],
    answer: "B",
    explanation:
      "模型忠實地學習了歷史資料中的樣態，包括其中的歧視。技術上模型沒出錯，問題出在把有偏的歷史當成應該延續的標準——這正是演算法偏見最常見的來源。",
    choiceExplanations: {
      A: "容量不足會讓整體表現差，增加參數只會讓模型更精準地複製歷史偏誤。",
      C: "樣本少會讓估計不穩，但隨機誤差不會一致地朝同一方向壓低通過率；系統性落差來自歷史決策本身的偏誤。",
      D: "切分問題影響的是分數可信度，不會製造針對特定性別的系統性落差。",
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
        C: "Partial Truth",
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
      { id: "A", text: "移除欄位後資料量變少，模型變得不穩定" },
      { id: "B", text: "性別資訊仍殘留在模型權重中，需重新初始化" },
      { id: "C", text: "其他特徵是性別的代理變數，間接把資訊帶回模型" },
      { id: "D", text: "評估時仍按性別分群計算，才造成看起來有落差的假象" },
    ],
    answer: "C",
    explanation:
      "就讀科系、工作年資中斷、甚至購物類別都可能與性別高度相關。單純移除敏感欄位（fairness through unawareness）通常無效，必須檢查代理變數並採用公平性指標評估。",
    choiceExplanations: {
      A: "移除一個欄位不減少樣本數；不穩定也只會造成整體波動，不會產生針對特定群體的一致偏差。",
      B: "重新訓練時未使用該欄位，權重就不會記得它；差別待遇來自其他特徵與性別高度相關。",
      D: "分群評估只是讓既存的偏誤被看見，不會製造差別待遇。",
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
      { id: "A", text: "各群體的整體準確率是否相近，不論預測為正或負" },
      { id: "B", text: "各群體被預測為正類的比例是否相同，而不考慮各群體的實際標籤為何" },
      { id: "C", text: "各群體在真正為正類的樣本中被正確判為正類的比率是否相近" },
      { id: "D", text: "各群體被預測為正類者中實際為正類的比例是否相近" },
    ],
    answer: "C",
    explanation:
      "機會均等要求各群體的真陽性率（召回率）相近，也就是「有資格的人被抓出來的機會一樣」。它與人口比例均等（demographic parity）是不同的公平定義，通常無法同時滿足。",
    choiceExplanations: {
      A: "整體準確率相近是準確率均等，機會均等只看真正為正類者的真陽性率。",
      B: "不看實際標籤、只比正類預測比例是人口比例均等，兩者是不同的公平準則。",
      D: "這是精確率（預測正確率）均等，看的是預測為正者；機會均等看的是真正為正者被抓出的比率。",
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
        A: "Neighbor Concept",
        B: "Terminology Swap",
        D: "Terminology Swap",
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
      { id: "B", text: "刪除該族群樣本，並在說明中排除該族群的適用範圍" },
      { id: "C", text: "以整體平均表現為準，該族群的差異屬於可接受的隨機誤差" },
      { id: "D", text: "增加模型層數，讓模型有足夠容量學到該族群的特徵" },
    ],
    answer: "A",
    explanation:
      "代表性不足是根本原因，補樣本才是對症下藥；同時把分群評估納入常規，才能持續確認差距有沒有收斂。",
    choiceExplanations: {
      B: "刪除只會讓模型完全學不到該族群，排除適用範圍也不會讓這群病患消失，等於徹底忽視。",
      C: "落差源自代表性不足，是系統性而非隨機的；只看平均正是讓問題被掩蓋的原因。",
      D: "增加容量無法補足資料中根本不存在的族群資訊，樣本太少時反而更容易過擬合。",
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
      { id: "A", text: "只要在上線後持續監控各群體指標，任一定義出現落差時再修正即可" },
      { id: "B", text: "只要整體準確率夠高，各公平性指標就會自然收斂到相近的水準" },
      { id: "C", text: "即使各群體的基礎率不同，所有公平性指標仍可透過調整門檻同時最佳化" },
      { id: "D", text: "多數情況下無法同時滿足所有公平性定義，須依情境取捨並說明理由" },
    ],
    answer: "D",
    explanation:
      "已有理論結果指出，在基礎率不同的情況下，人口比例均等、機會均等與校準無法同時成立。因此團隊必須依應用情境明確選擇要守住哪一種，並把理由記錄下來。",
    choiceExplanations: {
      A: "各定義本身就無法同時滿足，事後監控只會不斷看到落差；且偏誤在資料與問題定義階段就已埋入，等到上線才處理往往為時已晚。",
      B: "整體準確率高完全可能建立在犧牲少數群體之上，各公平性指標不會因此自然收斂。",
      C: "基礎率不同正是多個定義在數學上不相容的情況，調整門檻只能守住其中一種。",
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
      { id: "A", text: "資料蒐集（Data Collection）" },
      { id: "B", text: "訓練中處理（In-processing）" },
      { id: "C", text: "後處理（Post-processing）" },
      { id: "D", text: "前處理（Pre-processing）" },
    ],
    answer: "D",
    explanation:
      "公平性介入可依時機分成三類：改資料的前處理、改目標函數或訓練過程的中處理、改輸出或門檻的後處理。調整樣本權重屬於在訓練前修正資料，是前處理。",
    choiceExplanations: {
      A: "重新加權不新增任何資料，而是調整既有樣本的權重；它在訓練前修正資料分布，歸類為前處理。",
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
        A: "Neighbor Concept",
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
      { id: "B", text: "不揭露評估細節以免員工投機，但每年公布整體分數分布" },
      { id: "C", text: "以模型分數作為主要依據，主管僅在分數接近門檻時複核" },
      { id: "D", text: "定期由技術團隊檢查模型準確率，有異常時才通知員工" },
    ],
    answer: "A",
    explanation:
      "影響個人重大權益的自動化決策，應具備可解釋與可救濟兩項條件。揭露評估依據讓員工知道被評什麼，申訴與複核則讓錯誤有被糾正的途徑。",
    choiceExplanations: {
      B: "整體分數分布無法讓員工知道自己被如何評價，也無從指出錯誤，仍缺少可解釋性。",
      C: "只在門檻附近複核仍讓多數人無從申訴，也沒有揭露評估依據，缺少可救濟與可解釋兩項條件。",
      D: "準確率監控是技術面的品質控管，無法讓被評估的員工知道依據或提出申訴。",
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
        C: "Partial Truth",
        D: "Layer Confusion",
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
      { id: "A", text: "模型會把地區當成雜訊，自動修正歷史偏誤" },
      { id: "B", text: "回饋迴路使偏誤自我強化，該地區持續獲得較高通過率" },
      { id: "C", text: "隨著新資料累積，各地區的通過率會逐漸回歸平均而趨於相同" },
      { id: "D", text: "模型只會在第一次訓練時受歷史資料影響，之後便不再受影響" },
    ],
    answer: "B",
    explanation:
      "模型依偏誤的歷史核准，核准結果又成為下一輪的訓練資料，偏誤因此被不斷放大。打破迴路需要主動介入：分群監控、重新加權，或引入不受歷史決策污染的評估基準。",
    choiceExplanations: {
      A: "模型沒有辨識歷史不公的能力，地區若與核准結果相關就會被當成有用的訊號，忠實複製偏誤。",
      C: "新資料正是模型偏誤決策的產物，沒有任何機制促使通過率回歸平均，放任下去只會擴大差距。",
      D: "模型的核准結果會成為下一輪訓練資料，每次重訓都再次吸收並放大偏誤。",
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
  {
    id: "senior-ml-practice-q140",
    subjectId: "senior-ml",
    prompt:
      "某銀行的模型已達成各群體的核准率相同（人口比例均等），但稽核發現在同樣具還款能力的申請人中，某群體的核准率仍明顯偏低。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "人口比例均等與機會均等不同，基礎率不同時無法兼得，應選定其一並說明理由" },
      { id: "B", text: "核准率相同即已達成公平，稽核發現的落差只是少數個案的雜訊，無須處理" },
      { id: "C", text: "應同時調整門檻，把整體核准率與有還款能力者的核准率都調到完全相等" },
      { id: "D", text: "這代表模型的機率校準不良，只要依群體重新校準輸出，兩個準則就會同時成立" },
    ],
    answer: "A",
    explanation:
      "人口比例均等看的是各群體拿到多少核准，機會均等看的是「有還款能力的人被核准的機會」是否一致。當各群體的基礎率不同時，這兩者在數學上無法同時成立，必須明確選擇並說明。",
    choiceExplanations: {
      B: "核准率相同不保證有資格者被平等對待，稽核發現的是系統性落差，不是個案雜訊。",
      C: "已有理論結果指出，在基礎率不同時多個公平定義無法同時成立，調門檻無法讓兩者完全相等。",
      D: "校準本身也是一種公平定義，在基礎率不同時同樣無法與另兩者同時成立，重新校準不會消除這個取捨。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Concept Boundary",
      concepts: ["人口比例均等", "機會均等", "不可相容性"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若各群體的基礎率恰好相同，多個公平性定義就可能同時成立——不可相容性來自基礎率的差異，不是定義本身互相矛盾。",
    },
  },
  {
    id: "senior-ml-practice-q141",
    subjectId: "senior-ml",
    prompt:
      "某教育平台的模型已上線且短期內無法重訓，但發現對某群體的錄取建議率偏低。下列可行的介入手段何者最合理？",
    choices: [
      { id: "A", text: "以重新加權調整訓練資料，並在下次例行重訓前先暫停錄取建議" },
      { id: "B", text: "以後處理依群體調整決策門檻或校準輸出，不需重訓模型" },
      { id: "C", text: "在損失函數加入公平性約束，並以少量資料微調現有模型" },
      { id: "D", text: "暫不處理，先蒐集更多群體資料，等下次重訓再一併以前處理修正" },
    ],
    answer: "B",
    explanation:
      "公平性介入依時機分成前處理、訓練中處理與後處理三類。前兩者都需要重新訓練，模型不能動時就只剩後處理——調整門檻或校準輸出，在推論之後動手。",
    choiceExplanations: {
      A: "重新加權屬於前處理，必須重訓才會生效；暫停服務則讓所有使用者都失去建議。",
      C: "加入約束屬於訓練中處理，微調同樣是重新訓練，與短期內無法重訓的限制衝突。",
      D: "問題已被發現且有可行的後處理手段，等到下次重訓會讓受影響者持續承擔。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["後處理", "介入時機", "門檻調整"],
      constraints: ["fairness", "maintainability"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型可以隨時重訓，前處理與訓練中介入通常更根本，效果也比事後調門檻更好。",
    },
  },
  {
    id: "senior-ml-practice-q142",
    subjectId: "senior-ml",
    prompt:
      "某醫院的模型對某族群表現較差，追查發現該族群在訓練資料中僅佔 1%，且現實中確實罕見、樣本難以補充。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以過採樣把該族群樣本複製到與其他族群相同的數量，即可完全消除表現落差" },
      { id: "B", text: "以重新加權提高該族群在損失中的比重，並在文件中標示其適用限制與已知落差" },
      { id: "C", text: "以整體表現為主要回報指標，因該族群在現實中罕見，對整體影響有限" },
      { id: "D", text: "增加模型層數與參數量，讓模型有足夠容量從少量樣本學到該族群" },
    ],
    answer: "B",
    explanation:
      "樣本無從補充時，加權能讓模型至少不完全忽略這 1%。但更重要的是誠實揭露——把已知的落差寫進文件，使用者才知道在什麼情況下不該完全信賴模型的判斷。",
    choiceExplanations: {
      A: "複製樣本不增加新資訊，過度複製還會過擬合；落差也不會因此完全消失，仍須在文件中揭露限制。",
      C: "只看整體正是讓問題被掩蓋的原因，該族群罕見不代表個別病患承擔的風險較小，也讓使用者無從得知。",
      D: "增加容量無法補足資料中不存在的族群資訊，樣本極少時反而更容易過擬合。",
    },
    topic: "L23402 演算法偏見與公平性",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["重新加權", "適用限制揭露", "代表性不足"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若能透過跨院合作把該族群的樣本補到足夠比例，補樣本就會比加權更根本也更有效。",
    },
  },
];
