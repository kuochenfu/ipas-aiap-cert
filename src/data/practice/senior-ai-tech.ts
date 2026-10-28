import type { Question } from "../types";

// 依評鑑內容節點分批撰寫；配額見 src/domain/assessmentTopics.ts。
// 內容為 LLM 產出，正確性需人工複審。
export const practiceQuestions: Question[] = [
  // ── L21101 自然語言處理技術與應用（11 題）──────────────────────
  {
    id: "senior-ai-tech-practice-q001",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行要把客服信件自動分派到不同部門，語料為近三年的中文信件。技術團隊先以詞袋模型建立基準，再評估是否改用預訓練語言模型。關於兩者的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "詞袋模型會依上下文為同一個詞產生不同向量，預訓練模型則不會" },
      { id: "B", text: "詞袋模型只要加入二元詞組（bigram），就能和預訓練模型一樣依語境區分一詞多義" },
      { id: "C", text: "預訓練模型已學過大量語料，不需標註資料就能直接分出銀行自己的部門類別" },
      { id: "D", text: "詞袋模型忽略語序與語境，預訓練語言模型能依上下文給出不同的詞表示" },
    ],
    answer: "D",
    explanation:
      "詞袋模型只統計詞出現與否或次數，語序與上下文完全被丟棄，同一個詞永遠對應同一個維度；BERT 這類預訓練語言模型則會依前後文為同一個詞產生不同的向量，因此能分辨「行」在「銀行」與「行動」中的不同意義。",
    choiceExplanations: {
      A: "描述顛倒了——依上下文產生不同向量是預訓練語言模型的能力，詞袋模型恰恰做不到。",
      B: "加入二元詞組只是多記下相鄰詞的組合，每個詞組仍對應固定的維度，無法依整句語境為同一個詞給出不同表示，與預訓練模型的上下文表示不是同一回事。",
      C: "預訓練學到的是通用語言知識，並不知道這家銀行的部門如何劃分；仍需以標註資料微調或至少提供範例，才能對應到自家的分類體系。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["詞袋模型", "預訓練語言模型", "上下文表示"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Partial Truth",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若語料用詞高度固定、幾乎不存在一詞多義（例如標準代碼表），詞袋模型的簡單與可解釋反而勝過預訓練模型。",
    },
  },
  {
    id: "senior-ai-tech-practice-q002",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院想從病歷自由文字中抽出「藥品名稱」「劑量」「頻次」三類資訊，建立結構化欄位以供統計。此任務最直接對應下列哪一種自然語言處理任務？",
    choices: [
      { id: "A", text: "意見探勘與情感分析" },
      { id: "B", text: "命名實體辨識（NER）" },
      { id: "C", text: "神經機器翻譯（NMT）" },
      { id: "D", text: "抽取式文本摘要" },
    ],
    answer: "B",
    explanation:
      "從非結構化文字中標出特定類別的片段並加以分類，正是命名實體辨識的定義。抽出藥品、劑量、頻次即為三種自訂實體類別，抽出後即可填入結構化欄位。",
    choiceExplanations: {
      A: "意見探勘與情感分析輸出的是文本的意見或情緒傾向，病歷抽取要的是特定欄位的值，兩者目標不同。",
      C: "神經機器翻譯是把文本轉成另一種語言，輸出仍是自由文字，並不會產生結構化欄位。",
      D: "抽取式摘要挑出的是原文中的整句，不會把藥名、劑量、頻次切成各自的欄位，無法直接用於統計。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["命名實體辨識", "結構化抽取"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求改成「判斷這份病歷屬於哪一科」，就退回成文本分類，不需要逐段標出實體。",
    },
  },
  {
    id: "senior-ai-tech-practice-q003",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠的設備維修單以中文自由書寫，團隊想找出「經常一起出現的故障描述用語」以歸納常見故障型態，且沒有任何標註資料。下列做法何者最適合作為第一步？",
    choices: [
      { id: "A", text: "先請工程師標出故障類別，再訓練監督式分類器" },
      { id: "B", text: "以命名實體辨識抽出設備名稱與零件型號" },
      { id: "C", text: "以 TF-IDF 取得關鍵詞後進行分群" },
      { id: "D", text: "以迴歸模型依故障描述預測維修工時" },
    ],
    answer: "C",
    explanation:
      "沒有標註資料時只能走非監督路線。TF-IDF 先把每張維修單轉成能反映關鍵詞重要性的向量，再以分群把相似描述聚在一起，正好對應「歸納常見故障型態」這個尚未定義類別的目標。",
    choiceExplanations: {
      A: "題目要歸納的正是尚未定義的故障型態，先標類別等於預設了答案，且目前沒有任何標註資料；監督式分類應在型態歸納出來之後才考慮。",
      B: "設備名稱與零件型號只說明是哪台機器、哪個零件，無法呈現哪些故障描述用語經常一起出現，歸納不出故障型態。",
      D: "預測維修工時是另一個問題，且需要標註好的工時資料，無法回答「有哪些故障型態」。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["TF-IDF", "分群", "無標註資料"],
      constraints: ["labeled_data_scarcity"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若已經有數千張標好故障類別的維修單，監督式分類會比分群更直接也更準——分群是沒有標籤時的替代路徑。",
    },
  },
  {
    id: "senior-ai-tech-practice-q004",
    subjectId: "senior-ai-tech",
    prompt:
      "教育平台要為長篇教材自動產生摘要。團隊發現「抽取式摘要」與「生成式摘要」的產出差異明顯。關於兩者，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "抽取式摘要一定比生成式摘要更容易產生與原文矛盾的內容" },
      { id: "B", text: "抽取式從原文挑句子組成，生成式則可能寫出原文沒有的句子" },
      { id: "C", text: "兩者都以原文為依據，只要摘要長度足夠就保證不會遺漏任何重點" },
      { id: "D", text: "生成式摘要只需以規則刪除原文冗句即可完成，不需要語言模型" },
    ],
    answer: "B",
    explanation:
      "抽取式摘要的每一句都來自原文，忠實度高但可能不連貫；生成式摘要以語言模型重新表述，較流暢但可能出現原文沒有的說法（幻覺），忠實度需要額外檢核。",
    choiceExplanations: {
      A: "方向相反——抽取式的句子都來自原文，較不容易出現與原文矛盾；生成式才有幻覺風險。",
      C: "加長摘要只能降低遺漏的機率；任何摘要都是取捨的結果，兩者都無法保證不遺漏重點，生成式更可能寫出原文沒有的內容。",
      D: "以規則刪除冗句屬於抽取／壓縮式做法；生成式摘要的特點是重新表述，正需要語言模型來產生新的句子。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["抽取式摘要", "生成式摘要", "忠實度"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若需求是「摘要必須逐句可回溯原文」，抽取式勝出；若要求可讀性與跨段整合，生成式才划算。",
    },
  },
  {
    id: "senior-ai-tech-practice-q005",
    subjectId: "senior-ai-tech",
    prompt:
      "農產品電商想分析評論的正負面傾向，但團隊發現「這個包裝真是太『棒』了，收到時全破了」這類反諷句常被判成正面。要改善此問題，下列何者最有幫助？",
    choices: [
      { id: "A", text: "擴充情感詞典，為「棒」「讚」等詞加上更細的強度分數" },
      { id: "B", text: "改用能理解整句上下文的模型，並以反諷樣本微調" },
      { id: "C", text: "先做斷詞與停用詞過濾，再以關鍵詞比對正負面" },
      { id: "D", text: "只取評論中情緒最強烈的那一句來判斷整體傾向" },
    ],
    answer: "B",
    explanation:
      "反諷的關鍵在於前後語境互相矛盾，單看詞彙一定判錯。需要能讀懂整句語義關係的模型（如預訓練語言模型），並以含反諷的標註樣本微調，讓模型學到這種矛盾樣態。",
    choiceExplanations: {
      A: "反諷句的問題不在詞彙強度，而在前後語境矛盾；把「棒」的正面分數調得更細，只會讓這類句子更篤定地被判成正面。",
      C: "斷詞與停用詞過濾只是前處理，之後仍是逐詞比對，看不到「太棒了」與「全破了」之間的反諷關係。",
      D: "反諷靠前後句的落差成立，只挑一句判斷就切斷了這層關係；被挑中的往往正是字面上最正面的那句。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["反諷", "上下文語義", "微調"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若評論多為單句直述、幾乎沒有轉折，詞典法就夠用——處理反諷的成本只有在它大量出現時才值得付。",
    },
  },
  {
    id: "senior-ai-tech-practice-q006",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行的智慧客服要支援「查詢餘額」「掛失卡片」「申辦貸款」等意圖判斷。關於意圖分類的資料準備，下列做法何者最不恰當？",
    choices: [
      { id: "A", text: "為每個意圖收集多樣的實際用戶說法" },
      { id: "B", text: "保留一份與訓練資料分布相同但未參與訓練的測試集" },
      { id: "C", text: "把所有訓練語句都改寫成標準書面語再訓練" },
      { id: "D", text: "為無法歸類的說法設立「其他」類別" },
    ],
    answer: "C",
    explanation:
      "真實用戶會用口語、簡稱與錯字提問，把訓練語料全部改寫成標準書面語，會讓訓練分布與上線後的輸入分布產生落差，模型一遇到口語就失準。",
    choiceExplanations: {
      A: "收集多樣的真實說法正是讓模型涵蓋實際輸入變異的正確做法。",
      B: "保留獨立測試集才能評估模型在未見資料上的表現，是必要步驟。",
      D: "設立「其他」類別可避免模型硬把離群問題塞進既有意圖，是實務上的標準做法。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Incorrect Statement",
      concepts: ["意圖分類", "訓練分布", "口語變異"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 C 改成「保留口語與錯字，另外補上標準書面語的樣本」，它就成為擴充訓練分布的正確做法。",
    },
  },
  {
    id: "senior-ai-tech-practice-q007",
    subjectId: "senior-ai-tech",
    prompt:
      "醫療團隊比較兩種文本表示法：TF-IDF 與詞嵌入（Word Embedding）。關於詞嵌入的特點，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "詞嵌入產生高維稀疏向量，維度等於詞彙表大小" },
      { id: "B", text: "詞嵌入由人工依詞義逐一設定各維度的數值，不需從語料學習" },
      { id: "C", text: "詞嵌入以低維稠密向量表示詞，語意相近的詞距離較近" },
      { id: "D", text: "詞嵌入需以空白切分單字，因此只能用於英文等拼音文字" },
    ],
    answer: "C",
    explanation:
      "詞嵌入把每個詞映射到數十至數百維的稠密向量，並讓語意或用法相近的詞在空間中彼此靠近，因此能支援語意相似度計算——這正是 TF-IDF 這種稀疏表示做不到的。",
    choiceExplanations: {
      A: "高維稀疏、維度等於詞彙表大小描述的是詞袋與 TF-IDF，不是詞嵌入。",
      B: "詞嵌入的數值是模型從大量語料的共現關係中學出來的，不是人工逐維設定；沒有語料就沒有可學的關係。",
      D: "中文雖沒有空白，只需先完成斷詞或改用字元、子詞單位即可訓練詞嵌入，方法本身與語言無關。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["詞嵌入", "稠密向量", "語意相似度"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若語料極小、詞彙又高度專業，從頭學詞嵌入的品質會很差，此時 TF-IDF 或改用預訓練嵌入反而穩。",
    },
  },
  {
    id: "senior-ai-tech-practice-q008",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育機構的問答系統要回答校內規章問題，且答案必須可追溯到具體條文。下列架構何者最適合？",
    choices: [
      { id: "A", text: "以 RAG 先檢索相關條文，再據以生成回答並附上出處" },
      { id: "B", text: "以規章全文微調模型，每次修訂後重新訓練以維持內容最新" },
      { id: "C", text: "以通用大型語言模型直接回答，並在提示中要求它註明條號" },
      { id: "D", text: "以關鍵字搜尋找出相符條文，直接回傳條文連結供使用者閱讀" },
    ],
    answer: "A",
    explanation:
      "「答案必須可追溯到條文」同時要求正確性與出處。RAG 先檢索出相關條文段落，再讓模型依這些段落生成回答並標註來源，規章更新時只要更新索引，不必重訓模型。",
    choiceExplanations: {
      B: "每次修訂都重訓的成本與時間差都高，且微調後的知識混在權重裡，無法逐條指出答案出自哪一條。",
      C: "通用模型沒有這所學校的規章內容，要求它註明條號只會讓它編出看似正式的條號，答案仍無從追溯。",
      D: "只回傳條文連結並沒有回答問題，使用者仍得自己讀完條文判斷，未達成問答系統的目的。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["RAG", "出處追溯", "知識更新"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若規章只有數頁且幾乎不改，整份放進提示詞就夠，RAG 的索引維運成本反而不划算。",
    },
  },
  {
    id: "senior-ai-tech-practice-q009",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠將 SOP 文件建立向量索引以支援語意搜尋。若查詢「機台過熱怎麼辦」能找到標題為「溫度異常處理程序」的文件，主要是因為下列何者？",
    choices: [
      { id: "A", text: "向量讓語意相近的文字在空間中距離較近，即使用詞不同" },
      { id: "B", text: "系統先把查詢翻譯成英文，再以英文關鍵字比對文件標題" },
      { id: "C", text: "斷詞後「過熱」與「溫度」被視為同一個詞，因此字面比對成功" },
      { id: "D", text: "索引會優先回傳最近更新的文件，而該文件正好是最新的" },
    ],
    answer: "A",
    explanation:
      "語意搜尋比對的是向量而非字面。「過熱」與「溫度異常」在語料中出現的語境相近，其向量距離因此很近，即使沒有任何共同關鍵字也能被檢索到——這正是它相對關鍵字搜尋的優勢。",
    choiceExplanations: {
      B: "翻譯成英文後「overheat」與「temperature anomaly」仍是不同的字，字面比對照樣對不上；這也不是語意搜尋的運作方式。",
      C: "斷詞只把句子切成詞，不會把「過熱」與「溫度」合併成同一個詞；兩段文字沒有共同字面，靠字面比對反而找不到。",
      D: "更新時間只影響排序，不會讓沒有共同字面的文件被判為相關；能找到它是因為語意相近。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["語意搜尋", "向量距離", "同義表述"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若查詢的是精確料號或條號這類字面字串，向量檢索反而容易召回相近但不對的文件，關鍵字檢索才可靠。",
    },
  },
  {
    id: "senior-ai-tech-practice-q010",
    subjectId: "senior-ai-tech",
    prompt:
      "農業技術服務中心要把農民的口語提問轉成文字再進行意圖判斷。整條流程中，語音轉文字階段的錯誤最可能造成下列哪一種後果？",
    choices: [
      { id: "A", text: "意圖分類模型能從上下文推回原意，會自動修正轉寫錯誤" },
      { id: "B", text: "轉寫錯誤會被系統記錄並觸發模型自動重新訓練，下次即可避免" },
      { id: "C", text: "錯誤只影響畫面上顯示的文字，意圖判斷仍依原始語音進行" },
      { id: "D", text: "錯誤會往下游累積，使意圖判斷以錯誤文字為輸入而誤判" },
    ],
    answer: "D",
    explanation:
      "串接式流水線的每一階段都以前一階段的輸出為輸入，語音轉文字若把關鍵詞聽錯，後續的意圖分類就是在錯誤的句子上做判斷，錯誤會沿著管線累積放大。",
    choiceExplanations: {
      A: "意圖模型只看得到轉出的文字，不知道哪裡被聽錯，也沒有原始語音可比對；它會把錯字當成真實輸入來判斷。",
      B: "系統不會因單次輸入有誤就自行重訓；重訓需要標註資料與人為觸發的流程，當下這筆的誤判也不會因此改善。",
      C: "在串接流程中，意圖判斷的輸入正是轉出的文字而非原始語音，錯字會直接影響判斷結果，不只是顯示問題。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["串接式流水線", "誤差累積", "語音轉文字"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若改用端到端的語音意圖模型、不經文字中介，這條累積路徑就消失，但可解釋性與除錯難度會上升。",
    },
  },
  {
    id: "senior-ai-tech-practice-q011",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行導入文件審閱模型後，法遵單位要求「模型判定為高風險的案件必須說明依據」。下列做法何者最能滿足此要求？",
    choices: [
      { id: "A", text: "標示出影響判定的關鍵文句，並附上對應的規則或條文" },
      { id: "B", text: "回報模型的信心分數，分數越高代表判定依據越充分" },
      { id: "C", text: "改用準確率更高的大型模型，讓高風險判定更可信" },
      { id: "D", text: "把所有高風險案件一律轉為人工審查，不提供任何說明" },
    ],
    answer: "A",
    explanation:
      "法遵要的是「為什麼判高風險」的可追溯依據。標出觸發判定的關鍵文句並連結到對應條文，審查者才能複核判斷是否合理，也才符合可解釋性的要求。",
    choiceExplanations: {
      B: "信心分數只說明模型有多確定，並未指出它依據了文件中的哪些內容；分數高不等於依據可被複核。",
      C: "提高準確率不等於提供說明；更大的模型往往更難解釋，法遵要的判定依據仍然拿不出來。",
      D: "全部轉人工雖然安全，卻放棄了模型的價值，且仍未提供任何判定依據。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["可解釋性", "關鍵文句標示", "法遵"],
      constraints: ["explainability", "governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若法遵要的是「整體核准率是否對特定族群不利」，該提供的就是群體層級的統計，而不是逐案的關鍵文句。",
    },
  },
  {
    id: "senior-ai-tech-practice-q101",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的客訴分類模型在測試集 F1 達 0.92，上線三個月後降到 0.71。檢查發現客訴文字的用詞分布與訓練期相近，但新增了一類「數位帳戶開戶失敗」的客訴，且該類在訓練資料中不存在。下列處置何者最正確？",
    choices: [
      { id: "A", text: "這是資料分布漂移，應以近三個月的客訴資料重新訓練原有模型" },
      { id: "B", text: "調高分類門檻，讓低信心的客訴改送人工，整體 F1 就能回到原水準" },
      { id: "C", text: "提高模型參數量並延長訓練，讓模型自行從既有類別中歸納出新類別" },
      { id: "D", text: "屬於新類別而非分布漂移，應補該類標註樣本、調整類別體系並保留「其他」出口" },
    ],
    answer: "D",
    explanation:
      "用詞分布沒變、但出現了訓練時不存在的類別，模型只能把它硬塞進既有類別而拉低整體表現。要補的是類別體系與標註樣本，並設「其他」出口讓未涵蓋的內容不被強行歸類。",
    choiceExplanations: {
      A: "題幹已說用詞分布與訓練期相近，問題不是漂移；若不新增類別，用原有類別體系重訓，模型仍只能把開戶失敗硬塞進舊類別。",
      B: "調門檻只改變判定鬆緊；模型根本沒有開戶失敗這一類，送人工只是分流，自動分類的 F1 不會因此恢復。",
      C: "分類模型只能輸出訓練時定義過的類別；沒有該類的標註樣本，參數再多也不會自行長出新類別。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["新類別", "類別體系", "其他出口"],
      constraints: ["data_quality", "quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若用詞分布同時明顯改變（例如新客群用語不同），就是新類別與資料漂移並存，補樣本之外還要重新檢視特徵表示。",
    },
  },
  {
    id: "senior-ai-tech-practice-q102",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院要從病歷抽取用藥資訊，需求包含：抽出藥名與劑量、判斷該次用藥是否為「停用」、且結果須可追溯到原文位置。下列技術組合何者最合理？",
    choices: [
      { id: "A", text: "以文本分類判斷每份病歷是否提及停藥，再以關鍵字抽出藥名與劑量" },
      { id: "B", text: "以生成式模型輸出結構化的用藥清單，並請模型註明每項出自哪一段" },
      { id: "C", text: "以正規表示式比對藥名與劑量格式，遇到「停用」字樣即標為停用" },
      { id: "D", text: "以實體辨識抽出藥名與劑量並保留原文位移，再以屬性分類判斷是否停用" },
    ],
    answer: "D",
    explanation:
      "三項需求要分開對應：抽取結構化欄位靠實體辨識、判斷停用與否是在抽出的實體上再做屬性分類、可追溯則要求全程保留字元位移。生成式摘要雖然可讀，卻無法保證每個劑量精確且指得回原文。",
    choiceExplanations: {
      A: "整份分類只回答病歷有沒有提到停藥，無法對應到個別藥品；關鍵字抽取也不保留原文位置，三項需求都只滿足一半。",
      B: "生成模型可能改寫或抄錯劑量，它自行註明的段落也不保證對得上原文的確切位置，無法滿足可追溯的要求。",
      C: "格式比對抓不到各種寫法與同名不同劑型，且「停用」字樣可能出現在否定句或過去病史中，一律標為停用會誤判。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["實體辨識", "屬性分類", "可追溯性"],
      constraints: ["quality", "explainability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若只需要一份給醫師快速瀏覽的摘要、不進入結構化欄位也不需追溯，生成式模型的可讀性優勢就重新勝出。",
    },
  },
  {
    id: "senior-ai-tech-practice-q103",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的維修單語意搜尋上線後，工程師抱怨「查料號 A-1203 卻找不到那張單」。技術人員確認該單確實存在且含此料號。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應提高向量維度，讓料號中每個字元都能分到獨立的維度來表示" },
      { id: "B", text: "向量檢索不擅長精確字串比對，應改用關鍵字與向量的混合檢索" },
      { id: "C", text: "應改用參數更大的嵌入模型，讓相近料號的向量差距被拉大" },
      { id: "D", text: "應把維修單切成更小的區塊，讓料號在區塊中占比更高而易被找到" },
    ],
    answer: "B",
    explanation:
      "料號這種字面字串在向量空間裡沒有語意鄰居，A-1203 與 A-1204 的向量幾乎一樣近。這正是純向量檢索的盲區，處方是混合檢索：關鍵字負責精確匹配，向量負責語意召回。",
    choiceExplanations: {
      A: "嵌入的維度表示的是學到的語意特徵，不是逐字元的槽位；提高維度不會讓 A-1203 與 A-1204 在語意上被區分開。",
      C: "更大的嵌入模型學的仍是語意，料號這類字面字串沒有語意差異可學，A-1203 與 A-1204 依然幾乎一樣近。",
      D: "切小區塊能讓料號不被長段文字稀釋，但向量比的仍是語意，相近料號照樣擠在一起；精確字串需要關鍵字檢索來比對。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["向量檢索", "關鍵字檢索", "混合檢索"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L21103",
      decisionBoundary:
        "若查詢多為「機台過熱怎麼辦」這類自然語言描述、極少出現精確代號，純向量檢索就完全足夠。",
    },
  },
  {
    id: "senior-ai-tech-practice-q104",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育平台的作文評分模型對某一縣市學生的分數系統性偏低。追查發現該縣市學生的用詞與訓練語料的來源學校差異明顯。下列處置何者最正確？",
    choices: [
      { id: "A", text: "這是模型隨機性造成的波動，應降低生成溫度並多次評分取平均" },
      { id: "B", text: "依該縣市與全體的平均分差，為該縣市學生統一加上補償分" },
      { id: "C", text: "暫停該縣市的自動評分，改由人工評分直到模型重新上線" },
      { id: "D", text: "屬語料代表性不足，應補入該縣市樣本並以分群評估持續追蹤" },
    ],
    answer: "D",
    explanation:
      "根因是訓練語料沒涵蓋這群學生的表達方式，模型把「不熟悉」誤判成「寫得不好」。補入樣本才是對症；而分群評估要成為常規，否則下一個沒被涵蓋的群體同樣會被埋沒在整體平均裡。",
    choiceExplanations: {
      A: "題幹是「系統性」偏低，隨機波動會正負抵銷而不會固定偏向一邊；多次取平均也拉不回同一個方向的偏差。",
      B: "統一加分是掩蓋而非修正，個別學生的相對排序仍然錯；且平均分差本身可能含真實程度差異，補多少沒有依據。",
      C: "改人工只是暫時迴避；不補該縣市的樣本，模型重新上線時偏差依然存在，問題沒有被修正。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["語料代表性", "系統性偏差", "分群評估"],
      constraints: ["fairness", "data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若分數差距在補入樣本後仍然存在、且與實際寫作品質一致，那就不是偏差而是真實差異，處置方向會轉為教學支援。",
    },
  },
  {
    id: "senior-ai-tech-practice-q105",
    subjectId: "senior-ai-tech",
    prompt:
      "某農會要建立能回答補助辦法的問答系統，辦法每季修訂且回答必須標明依據條號。下列架構何者最合理？",
    choices: [
      { id: "A", text: "採用最新版的通用大型模型直接回答，因其訓練資料已涵蓋各類公開辦法" },
      { id: "B", text: "每季以最新辦法微調模型，並在微調資料中加入條號讓模型學會引用" },
      { id: "C", text: "把最新辦法全文放入系統提示詞，每季修訂時更新提示詞內容" },
      { id: "D", text: "以檢索增強生成檢索最新條文，並要求回答標註引用的條號" },
    ],
    answer: "D",
    explanation:
      "季度更新與出處標註這兩項需求同時指向檢索：更新文件即生效、檢索到的條文本身就是可引用的依據。微調與寫死提示詞都會讓「更新」變成一次工程作業。",
    choiceExplanations: {
      A: "通用模型的訓練資料有截止時間，也未必收錄這份每季修訂的辦法；即使答得出內容也無從標註條號。",
      B: "每季重訓與評估的成本高、有時間差；且模型從權重回憶的條號可能記錯，無法保證引用正確。",
      C: "辦法全文可能超出提示詞長度上限，長篇全文塞進提示也會稀釋重點，模型引用條號容易錯置；每次修訂還要改提示並重測。",
    },
    topic: "L21101 自然語言處理技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["RAG", "知識更新", "出處標註"],
      constraints: ["governance", "maintainability"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L21103",
      decisionBoundary:
        "若辦法只有兩頁且一年才修一次，整份放進提示詞反而最省事，RAG 的索引維運成本就不划算。",
    },
  },

  // ── L21102 電腦視覺技術與應用（11 題）──────────────────────────
  {
    id: "senior-ai-tech-practice-q012",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠的自動光學檢測要在產品影像上「框出瑕疵位置並標示瑕疵種類」。此需求最直接對應下列哪一種電腦視覺任務？",
    choices: [
      { id: "A", text: "風格轉換" },
      { id: "B", text: "影像分類" },
      { id: "C", text: "影像生成" },
      { id: "D", text: "物件偵測" },
    ],
    answer: "D",
    explanation:
      "同時要「位置」與「類別」正是物件偵測的定義：輸出每個目標的邊界框加上類別標籤。只要類別而不要位置是影像分類，要逐像素的輪廓則是影像分割。",
    choiceExplanations: {
      A: "風格轉換改變影像的視覺風格，同樣不提供瑕疵位置與類別。",
      B: "影像分類只回答「這張圖屬於哪一類」，不會指出瑕疵在畫面的哪個位置。",
      C: "影像生成產生新影像，與在既有影像上找出瑕疵無關。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["物件偵測", "邊界框", "類別標籤"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求只是「這批貨有沒有瑕疵」而不必知道位置，影像分類就夠，標註成本也低得多。",
    },
  },
  {
    id: "senior-ai-tech-practice-q013",
    subjectId: "senior-ai-tech",
    prompt:
      "醫療影像團隊要標出腫瘤在切片影像中的精確輪廓以計算面積。下列哪一種任務最適合？",
    choices: [
      { id: "A", text: "影像分類" },
      { id: "B", text: "影像分割" },
      { id: "C", text: "物件偵測" },
      { id: "D", text: "光學字元辨識" },
    ],
    answer: "B",
    explanation:
      "要計算面積就必須知道每一個像素是否屬於腫瘤，這是影像分割（逐像素分類）才能提供的輸出。矩形邊界框無法貼合不規則輪廓，會高估面積。",
    choiceExplanations: {
      A: "影像分類只給整張影像一個標籤，完全沒有位置與範圍資訊。",
      C: "物件偵測給的是矩形框，對不規則的腫瘤輪廓而言誤差過大，無法用於面積計算。",
      D: "光學字元辨識處理的是文字，與腫瘤輪廓無關。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["影像分割", "逐像素分類", "面積計算"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若只需統計腫瘤數量而非面積，物件偵測就夠了——是否需要逐像素，取決於要算的是什麼。",
    },
  },
  {
    id: "senior-ai-tech-practice-q014",
    subjectId: "senior-ai-tech",
    prompt:
      "產線瑕疵樣本極少（良品數萬張、瑕疵數十張）。下列哪一種策略最能直接緩解此資料不平衡問題？",
    choices: [
      { id: "A", text: "以整體準確率作為主要評估指標，確保模型整體表現穩定" },
      { id: "B", text: "刪除大部分良品影像使兩類數量相同即可，不做其他處理" },
      { id: "C", text: "以資料增強擴增瑕疵樣本，並考慮改用異常偵測思路" },
      { id: "D", text: "增加模型層數直到訓練準確率達到 100%" },
    ],
    answer: "C",
    explanation:
      "瑕疵樣本稀少時，一方面可用旋轉、翻轉、亮度調整等增強手法擴增少數類，另一方面可改以「只學正常樣態、偏離即為異常」的異常偵測思路，避開必須蒐集大量瑕疵樣本的困境。",
    choiceExplanations: {
      A: "在極度不平衡下，全猜良品就有超過 99% 的準確率；以它為主要指標看似穩定，卻反映不出瑕疵有沒有抓到，也沒有緩解不平衡本身。",
      B: "大量刪除良品會丟掉絕大部分資訊，模型對正常樣態的掌握反而變差，是最粗暴的做法。",
      D: "追求訓練準確率 100% 正是過擬合的典型症狀，對未見的新瑕疵毫無幫助。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料不平衡", "資料增強", "異常偵測"],
      constraints: ["labeled_data_scarcity", "data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若瑕疵樣本能累積到每種型態數百張，監督式分類會勝過異常偵測，因為它能指出是哪一種瑕疵。",
    },
  },
  {
    id: "senior-ai-tech-practice-q015",
    subjectId: "senior-ai-tech",
    prompt:
      "團隊以在 ImageNet 上預訓練的卷積網路為基礎，改接新的輸出層後以少量農作物病害影像微調。這種做法稱為下列何者？",
    choices: [
      { id: "A", text: "聯邦學習" },
      { id: "B", text: "遷移學習" },
      { id: "C", text: "強化學習" },
      { id: "D", text: "無監督分群" },
    ],
    answer: "B",
    explanation:
      "把在大型資料集上學到的特徵萃取能力搬到新任務上，只重新訓練最後幾層或以小資料微調，正是遷移學習。它讓小樣本任務也能受惠於大規模預訓練。",
    choiceExplanations: {
      A: "聯邦學習強調資料留在各端、只交換模型更新，題幹並沒有多方資料不出場的設定。",
      C: "強化學習透過與環境互動、依獎勵調整策略，與此處以標註影像微調的做法不同。",
      D: "無監督分群不使用標籤，而此處明確有病害類別的標註影像用於微調。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["遷移學習", "預訓練", "微調"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若新任務的影像特性與 ImageNet 差距極大（例如紅外線或超音波），預訓練特徵的助益會大幅下降。",
    },
  },
  {
    id: "senior-ai-tech-practice-q016",
    subjectId: "senior-ai-tech",
    prompt:
      "某校園門禁以人臉辨識進行身分驗證。關於此系統的設計，下列考量何者最不恰當？",
    choices: [
      { id: "A", text: "上線前與上線後都評估不同族群與年齡層的辨識率差異" },
      { id: "B", text: "把原始人臉影像長期保存在雲端以便日後比對" },
      { id: "C", text: "提供人臉以外的替代驗證方式" },
      { id: "D", text: "在裝置端完成特徵萃取，只上傳特徵值" },
    ],
    answer: "B",
    explanation:
      "原始人臉影像屬於高度敏感的生物特徵資料，長期保存等於持續累積外洩風險，且多數情境並非必要。正確做法是只保留不可還原的特徵值，並訂定明確的保存期限。",
    choiceExplanations: {
      A: "上線前後持續檢查不同族群與年齡層的辨識率差異，是防止演算法偏見的必要步驟，屬於恰當的設計考量。",
      C: "提供替代方式可涵蓋辨識失敗或不願使用生物特徵的使用者，是合理的無障礙與隱私設計。",
      D: "端側萃取、只上傳特徵值正是降低隱私風險的標準做法。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Incorrect Statement",
      concepts: ["生物特徵", "資料保存", "隱私設計"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 B 改成「只保留不可還原的特徵值並訂定保存期限」，它就成為正確的隱私設計。",
    },
  },
  {
    id: "senior-ai-tech-practice-q017",
    subjectId: "senior-ai-tech",
    prompt:
      "卷積神經網路中的「池化層（Pooling）」主要作用是下列何者？",
    choices: [
      { id: "A", text: "擴大特徵圖的空間尺寸，讓後續層能看到更細的局部細節" },
      { id: "B", text: "隨機丟棄部分神經元的輸出，以降低過擬合的風險" },
      { id: "C", text: "降低特徵圖尺寸與計算量，並提供一定的位移不變性" },
      { id: "D", text: "以多組可學習的濾波器在影像上滑動，萃取邊緣與紋理特徵" },
    ],
    answer: "C",
    explanation:
      "池化以取最大值或平均值的方式縮小特徵圖，讓後續層的計算量與參數量下降，同時使模型對目標的小幅位移較不敏感，提升泛化能力。",
    choiceExplanations: {
      A: "池化是縮小而非放大特徵圖；放大空間尺寸是上取樣或轉置卷積的作用。",
      B: "隨機丟棄神經元輸出是 Dropout 的做法；池化是固定地取最大值或平均值來縮小特徵圖，並不涉及隨機。",
      D: "以可學習濾波器滑動萃取特徵是卷積層的工作；池化層本身沒有可學習的權重。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["池化層", "降維", "位移不變性"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若任務需要精確的像素級定位（如分割），過度池化會損失空間資訊，該改用較小步幅或加上上採樣結構。",
    },
  },
  {
    id: "senior-ai-tech-practice-q018",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院訓練的肺部影像模型在 A 院表現良好，移到 B 院卻明顯退步。已知兩院使用不同廠牌的造影設備。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "模型檔在搬移時版本不一致，部分權重未正確載入" },
      { id: "B", text: "B 院的病患組成不同，陽性病例比例較 A 院低" },
      { id: "C", text: "資料分布偏移：訓練與實際使用的影像特性不同" },
      { id: "D", text: "模型層數不足，無法學到足以泛化到 B 院的特徵" },
    ],
    answer: "C",
    explanation:
      "不同廠牌設備的成像參數、對比與雜訊特性不同，B 院的影像分布與訓練資料不一致，模型在未見過的分布上自然退步。這是醫療影像 AI 最常見的落地障礙之一。",
    choiceExplanations: {
      A: "權重載入錯誤通常會讓模型完全失效或輸出異常，而不是「仍能運作但表現退步」；題幹也已指出設備不同這個更直接的原因。",
      B: "病患組成可能有影響，但題幹明確指出兩院造影設備不同，影像特性改變才是最直接的解釋；病例比例也應先查標籤分布再下結論。",
      D: "層數不足會在 A 院也表現不好，無法解釋「A 院良好、B 院退步」的落差；兩院差在影像來源而非模型容量。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料分布偏移", "跨場域泛化"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若模型在 A 院本來就表現平平，問題就不是分布偏移而是模型能力不足——分布偏移的特徵是「原場域好、新場域壞」。",
    },
  },
  {
    id: "senior-ai-tech-practice-q019",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行要辨識支票上的手寫金額並轉為數字欄位。此任務最直接對應下列哪一種技術？",
    choices: [
      { id: "A", text: "光學字元辨識" },
      { id: "B", text: "影像超解析度" },
      { id: "C", text: "文件版面分析" },
      { id: "D", text: "手寫簽名驗證" },
    ],
    answer: "A",
    explanation:
      "把影像中的文字（含手寫）轉成可編輯的字元序列正是 OCR 的任務範圍；手寫辨識屬於 OCR 中難度較高的一支，通常需要專門的手寫資料集訓練。",
    choiceExplanations: {
      B: "超解析度提升影像清晰度，可作為光學字元辨識的前處理，但本身不輸出文字。",
      C: "版面分析找出文件中標題、表格、欄位等區塊的位置，可作為字元辨識的前置步驟，但不會把手寫筆跡轉成數字。",
      D: "簽名驗證判斷筆跡是否出自本人，屬於身分驗證，不會辨識出金額內容。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["OCR", "手寫辨識"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若支票影像模糊到字跡難辨，先做超解析度或去噪的前處理才有意義——OCR 救不了根本讀不到的字。",
    },
  },
  {
    id: "senior-ai-tech-practice-q020",
    subjectId: "senior-ai-tech",
    prompt:
      "評估瑕疵偵測模型時，工廠最在意「不可以把瑕疵品放過」。此時最應優先關注下列哪一個指標？",
    choices: [
      { id: "A", text: "瑕疵類別的召回率（Recall）" },
      { id: "B", text: "整體準確率（Accuracy）" },
      { id: "C", text: "瑕疵類別的精確率（Precision）" },
      { id: "D", text: "每張影像的平均推論時間" },
    ],
    answer: "A",
    explanation:
      "「不可放過瑕疵」等於要把偽陰性壓到最低，對應的指標就是瑕疵類別的召回率。提高召回通常會犧牲精確率（誤判良品為瑕疵），但在此情境下重工的成本遠低於流出的成本。",
    choiceExplanations: {
      B: "瑕疵樣本稀少時，全部判為良品也有極高的整體準確率，這個指標無法反映漏檢情況。",
      C: "精確率衡量的是被判為瑕疵者中有多少真是瑕疵，關心的是誤報；「不可放過瑕疵」要壓低的是漏檢，對應的是召回率。",
      D: "推論時間關係到產線節拍與部署成本，不能用來衡量模型有沒有把瑕疵抓出來。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["召回率", "偽陰性", "指標選擇"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若誤判良品為瑕疵會造成整批報廢、成本遠高於漏檢，該優先關注的就翻轉成精確率。",
    },
  },
  {
    id: "senior-ai-tech-practice-q021",
    subjectId: "senior-ai-tech",
    prompt:
      "農場以空拍影像估算作物覆蓋率，但不同時段的日照造成影像亮度差異很大。下列前處理何者最能直接緩解此問題？",
    choices: [
      { id: "A", text: "隨機裁切與翻轉影像以增加資料多樣性" },
      { id: "B", text: "把影像壓縮成較小的檔案以加快處理" },
      { id: "C", text: "把彩色影像轉為灰階，以排除色彩受日照影響的變異" },
      { id: "D", text: "以直方圖等化等方法做亮度與色彩正規化" },
    ],
    answer: "D",
    explanation:
      "亮度差異屬於與任務無關的變異，正規化把不同時段的影像調整到一致的統計特性，模型才不會把「拍攝時間」誤當成判斷依據，這是遙測與空拍分析的標準前處理。",
    choiceExplanations: {
      A: "裁切與翻轉是資料增強，增加的是構圖變化，無法消除整張影像因日照造成的亮度偏移。",
      B: "壓縮改變的是檔案大小與處理速度，甚至可能因失真而損失細節，對亮度差異沒有幫助。",
      C: "灰階值同樣隨日照明暗變動，轉灰階消除不了亮度差異，反而丟掉作物與土壤最關鍵的色彩差異，讓覆蓋率估算更困難。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["影像正規化", "亮度變異", "前處理"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型的目的正是判斷「日照是否充足」，亮度就成了有效訊號，正規化反而會把要預測的東西抹掉。",
    },
  },
  {
    id: "senior-ai-tech-practice-q022",
    subjectId: "senior-ai-tech",
    prompt:
      "教育單位要在教室部署即時人數計算的攝影機，且校方要求影像不得離開校園。下列部署方式何者最符合需求？",
    choices: [
      { id: "A", text: "在校內邊緣裝置執行推論，只上傳人數統計值" },
      { id: "B", text: "影像串流上傳公有雲推論，完成後立即刪除影像" },
      { id: "C", text: "把影像加密後存到公有雲，隔日再批次分析" },
      { id: "D", text: "由人工每節課到教室清點後輸入系統" },
    ],
    answer: "A",
    explanation:
      "在校內邊緣裝置完成推論，影像從頭到尾不離開校園，只有匿名的人數統計上傳，同時滿足即時性與資料不出校的要求。",
    choiceExplanations: {
      B: "影像一上傳公有雲就已離開校園，事後刪除補不回來，直接違反校方要求。",
      C: "加密不改變影像已離開校園的事實，仍違反要求；且隔日批次分析也無法滿足即時性。",
      D: "人工清點雖不涉及影像外流，但無法即時、人力成本高，也失去導入系統的意義。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["邊緣推論", "資料不出場域", "即時性"],
      constraints: ["privacy", "latency"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若校方允許影像離開校園、且無即時性需求，雲端推論在成本與模型能力上都更有優勢。",
    },
  },
  {
    id: "senior-ai-tech-practice-q106",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的瑕疵偵測模型召回率達 98%，但產線人員反映「常常把正常的水漬判成瑕疵」，複檢量暴增到人力無法負荷。下列處置何者最合理？",
    choices: [
      { id: "A", text: "增加模型參數量並延長訓練，讓模型自行學會分辨水漬與瑕疵" },
      { id: "B", text: "把召回率目標降到 90%，以換取誤報與複檢量的大幅下降" },
      { id: "C", text: "取消人工複檢，改由模型判定的瑕疵品一律直接報廢" },
      { id: "D", text: "依複檢量能與漏檢成本重訂門檻並分級處理，同時補入水漬負樣本訓練" },
    ],
    answer: "D",
    explanation:
      "98% 召回是靠大量誤報換來的，而複檢量能是真實的硬限制。處置有兩層：資料層補入水漬的負樣本讓模型學會區分，流程層依信心分級，把人力集中在真正拿不準的案例上。",
    choiceExplanations: {
      A: "沒有水漬負樣本，模型就沒有區分兩者的依據；參數與訓練時間再增加也學不到資料裡沒有的差異。",
      B: "直接降召回是用放更多瑕疵流出換人力，把問題轉嫁給客戶；且沒有補水漬樣本，誤報的根因仍在。",
      C: "取消複檢會讓大量被誤判的水漬良品直接報廢，誤報成本全數變成損失，也沒有任何人攔截。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["精確率與召回率", "門檻校準", "分級處理"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若漏檢會造成客戶端重大損失、而複檢人力可以增補，取捨就會往維持高召回、擴充複檢量能的方向移動。",
    },
  },
  {
    id: "senior-ai-tech-practice-q107",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院的影像模型在 A 院表現良好，移到 B 院明顯退步。已知兩院造影設備廠牌不同。下列處置的優先順序何者最合理？",
    choices: [
      { id: "A", text: "兩院共用同一模型，並對 B 院結果調低信心門檻以補償落差" },
      { id: "B", text: "直接以 B 院資料從零重新訓練一個專屬模型，徹底消除落差" },
      { id: "C", text: "先以 B 院影像微調模型上線，再視病患回饋決定是否重新評估" },
      { id: "D", text: "先以 B 院少量標註影像量出落差，再決定做正規化、微調或重訓" },
    ],
    answer: "D",
    explanation:
      "處置強度應與落差幅度相稱。先量出差多少，才知道是靠正規化把成像特性拉近就夠、還是需要微調甚至重訓。跳過量測直接重訓，可能花了最大的代價解一個正規化就能解的問題。",
    choiceExplanations: {
      A: "調門檻只改變判定鬆緊，無法修正影像特性不同造成的特徵偏移；在不知道落差多大的情況下，補償也沒有依據。",
      B: "從零重訓成本最高、需要大量 B 院標註，在還沒量出落差幅度前就投入並不合理，可能正規化就能解決。",
      C: "順序顛倒——沒先量出落差就微調上線，等於讓病患當測試集；評估應在處置之前，且病患回饋無法取代標註評估。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["分布偏移", "影像正規化", "處置強度"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若量測後發現落差來自 B 院獨有的病患組成而非成像特性，正規化就幫不上忙，只能靠補樣本。",
    },
  },
  {
    id: "senior-ai-tech-practice-q108",
    subjectId: "senior-ai-tech",
    prompt:
      "某校園要部署即時人流計算，限制包含：影像不得離開校園、單台設備要涵蓋四個出入口、且不得辨識個人身分。下列設計何者最合理？",
    choices: [
      { id: "A", text: "在校內擷取影像後加密上傳雲端計算，算完立即刪除原始影像" },
      { id: "B", text: "在校內邊緣裝置以人臉辨識計數，確保同一人不會被重複計算" },
      { id: "C", text: "校內邊緣裝置以物件偵測計數，不做人臉辨識、不存原始影像，只傳人數" },
      { id: "D", text: "在校內邊緣裝置以物件偵測計數，並保存全部影像以備日後查核" },
    ],
    answer: "C",
    explanation:
      "三項限制分別對應三個設計決定：不得外流 → 端側推論；不得辨識身分 → 用物件偵測而非人臉辨識；至於不保存原始影像，則讓「日後被翻出來」的風險從源頭消失。",
    choiceExplanations: {
      A: "加密與事後刪除都改變不了影像已離開校園的事實，違反第一項限制。",
      B: "雖在校內推論，但人臉辨識直接違反不得辨識個人身分的限制，即使目的只是去重。",
      D: "前半符合限制，但保存全部原始影像會持續累積可識別資料的外洩風險，且與計數需求無關。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["邊緣推論", "物件偵測", "資料最小化"],
      constraints: ["privacy", "connectivity", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L21302",
      decisionBoundary:
        "若需求改成「找出未經授權的入侵者」，就必須辨識身分，設計會轉為嚴格的權限控管與保存期限，而不是避免辨識。",
    },
  },
  {
    id: "senior-ai-tech-practice-q109",
    subjectId: "senior-ai-tech",
    prompt:
      "某農場的空拍病害辨識模型在測試集表現良好，實地飛行時卻大幅退步。已知測試影像來自晴天正午、實地飛行涵蓋各種天候與時段。下列處置何者最正確？",
    choices: [
      { id: "A", text: "提高飛行高度讓每張影像涵蓋更大範圍，降低局部光照的影響" },
      { id: "B", text: "規定只在晴天正午飛行，讓實地條件與測試集一致" },
      { id: "C", text: "以實地影像擴充訓練集重訓，但沿用原本的晴天測試集驗收成效" },
      { id: "D", text: "應以各天候時段的實地影像重建測試集，並在前處理加入亮度正規化" },
    ],
    answer: "D",
    explanation:
      "測試集只涵蓋單一拍攝條件，測得的分數自然無法代表實地。要做兩件事：重建能代表部署環境的測試集，否則永遠量不準；以及在前處理消除與任務無關的光照變異。",
    choiceExplanations: {
      A: "飛行高度改變的是解析度與涵蓋範圍，光照條件並不會因此一致，反而會讓病斑細節更難辨識。",
      B: "讓條件一致的方式是把需求砍掉，多數農務無法配合單一時段，模型面對其他天候時依然失準。",
      C: "補訓練資料方向正確，但仍以只有晴天正午的測試集驗收，量不出實地表現；測試集必須先改成能代表部署環境。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["測試集代表性", "光照正規化", "部署環境"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若模型的目的正是判斷日照是否充足，亮度就成了有效訊號，正規化反而會把要預測的東西抹掉。",
    },
  },
  {
    id: "senior-ai-tech-practice-q110",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行要辨識存摺影本上的手寫金額並填入欄位，影像常有摺痕與陰影。下列處理順序何者最合理？",
    choices: [
      { id: "A", text: "先做文字辨識，再以影像增強修補辨識失敗的字元" },
      { id: "B", text: "直接進行文字辨識，信心低的欄位就留白並繼續處理下一筆" },
      { id: "C", text: "先以影像分類篩掉不清晰的影本，其餘直接進行文字辨識" },
      { id: "D", text: "先去陰影等影像前處理再做文字辨識，低信心欄位標記人工確認" },
    ],
    answer: "D",
    explanation:
      "摺痕與陰影會直接壓低辨識率，前處理是提高輸入品質的最直接手段；而金額攸關帳務，低信心的結果必須交由人確認而不是靜默跳過。",
    choiceExplanations: {
      A: "順序顛倒——影像增強要在辨識之前提升輸入品質，辨識完才增強影像已經影響不了結果。",
      B: "留白沒有任何提示，錯誤會在下游帳務才被發現；摺痕陰影也沒有處理，低信心欄位會大量出現。",
      C: "篩掉不清晰的影本等於放棄有摺痕陰影的那批，需求沒有被滿足；清晰影本中的低信心欄位也沒有人工確認。",
    },
    topic: "L21102 電腦視覺技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["影像前處理", "OCR", "信心門檻"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若影本品質本來就良好、辨識率已達九成九，前處理帶來的邊際效益就有限，重點會回到低信心欄位的處理流程。",
    },
  },

  // ── L21103 生成式 AI 技術與應用（11 題）──────────────────────────
  {
    id: "senior-ai-tech-practice-q023",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行以大型語言模型草擬理財建議書，法遵單位擔心模型會捏造不存在的商品條款。下列做法何者最能直接降低此風險？",
    choices: [
      { id: "A", text: "調低生成溫度，讓模型只輸出機率最高的條款內容" },
      { id: "B", text: "改用以金融語料預訓練的大型模型，提升對商品條款的掌握" },
      { id: "C", text: "在提示詞中要求模型不知道就回答「不知道」，不得自行編造" },
      { id: "D", text: "以檢索增強生成限定模型只能依據內部核准的商品文件作答" },
    ],
    answer: "D",
    explanation:
      "幻覺的根源是模型憑訓練記憶生成而缺乏事實依據。RAG 把核准過的商品文件檢索進上下文，讓模型「有本可依」，並可要求標註出處供法遵複核，是最直接的緩解手段。",
    choiceExplanations: {
      A: "調低溫度只讓輸出更穩定，模型若本來就不知道條款，穩定輸出的仍是捏造內容；缺的是事實依據。",
      B: "金融語料讓模型熟悉一般金融用語，但它仍不知道這家銀行的商品條款；沒有依據可查，幻覺風險並未消除。",
      C: "模型無法可靠判斷自己知不知道，這類指示只能稍微降低而不能消除捏造；沒有核准文件作依據，法遵也無從複核。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["幻覺", "RAG", "事實依據"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若捏造的是條款的推論結果而非條款本身，RAG 也擋不住——檢索保證的是有依據，不保證推論正確。",
    },
  },
  {
    id: "senior-ai-tech-practice-q024",
    subjectId: "senior-ai-tech",
    prompt:
      "團隊比較「提示工程」「檢索增強生成」與「微調」三種調適手段。關於微調（Fine-tuning），下列敘述何者最正確？",
    choices: [
      { id: "A", text: "微調後模型已內化任務知識，可省略獨立測試集直接上線" },
      { id: "B", text: "微調會更新模型權重，適合讓模型穩定學會特定風格或格式" },
      { id: "C", text: "微調會把新知識寫入權重，是讓知識隨時保持最新的最佳手段" },
      { id: "D", text: "微調只調整提示詞的內容，不會改變模型本身的權重" },
    ],
    answer: "B",
    explanation:
      "微調以任務資料更新模型權重，讓模型內化特定的輸出風格、格式或領域用語。它擅長的是「怎麼說」，至於「說什麼」這種會頻繁變動的事實知識，用 RAG 更新才划算。",
    choiceExplanations: {
      A: "內化不等於正確；微調後仍須以獨立測試集評估，並檢查是否出現災難性遺忘或過擬合。",
      C: "知識一變就得重新微調，成本與時間差都不划算；需要隨時更新的知識應交給檢索。",
      D: "調整提示詞是提示工程；微調的本質正是以訓練資料更新模型權重。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["微調", "權重更新", "風格與格式"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若需要的是「讓模型知道最新商品」，微調就是錯的工具——會變的事實交給檢索，穩定的風格才交給微調。",
    },
  },
  {
    id: "senior-ai-tech-practice-q025",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院想以生成式 AI 協助整理衛教文案，但要求不得將病患個資送入外部模型。下列做法何者最適當？",
    choices: [
      { id: "A", text: "在提示詞中加上「請勿記憶病患資料」即可" },
      { id: "B", text: "改用付費企業方案，由廠商承諾不以輸入資料訓練模型" },
      { id: "C", text: "送出前先去識別化，或改用可於院內部署的模型" },
      { id: "D", text: "把病患個資加密後再貼進提示詞送給外部模型" },
    ],
    answer: "C",
    explanation:
      "要讓個資不外流，只有兩條路：資料本身先去識別化，或模型部署在院內讓資料不出場域。這是從源頭切斷風險，而非依賴對方的承諾。",
    choiceExplanations: {
      A: "提示詞只是輸入文字，無法約束服務端如何處理與保存資料，個資仍然已經送出。",
      B: "廠商承諾規範的是資料的後續用途，個資仍已送入外部模型，違反「不得送入」的要求；這是依賴對方承諾而非從源頭切斷風險。",
      D: "貼進提示詞的內容必須能被模型讀懂，若已加密則模型無法使用；若能讀懂就等於明文外流。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["去識別化", "地端部署", "個資外流"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若院內沒有足夠算力部署模型、資料也無法去識別化（例如需要完整病歷脈絡），就只能改由人工處理。",
    },
  },
  {
    id: "senior-ai-tech-practice-q026",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠導入 AI 助理協助查詢設備手冊。上線後發現同一個問題每次得到的答案措辭不同，造成操作員困惑。下列調整何者最直接？",
    choices: [
      { id: "A", text: "增加模型的上下文長度，讓每次回答都能參考更多手冊內容" },
      { id: "B", text: "調低生成溫度並固定提示模板，常見問題改用固定回覆" },
      { id: "C", text: "提高生成溫度，讓模型探索出最清楚的一種說法" },
      { id: "D", text: "為每位操作員建立個人化記憶，讓答案貼近其習慣用語" },
    ],
    answer: "B",
    explanation:
      "輸出不一致主要來自取樣的隨機性與提示不固定。調低溫度使輸出更趨向高機率答案、固定提示模板減少變異，高頻問題甚至可直接走預先審過的固定回覆，一致性最有保障。",
    choiceExplanations: {
      A: "上下文加長只是讓模型讀到更多內容，取樣的隨機性仍在，甚至因參考片段更多而讓措辭更多變。",
      C: "提高溫度會讓取樣更隨機，每次措辭的差異只會更大，與一致性的目標相反。",
      D: "個人化會讓不同操作員得到不同說法，等於刻意增加差異；同一問題措辭不一的根源是取樣隨機性與提示不固定。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["生成溫度", "提示模板", "輸出一致性"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若答案不只措辭不同、連內容都互相矛盾，那就不是取樣隨機性，而是檢索到不同段落或手冊本身有衝突。",
    },
  },
  {
    id: "senior-ai-tech-practice-q027",
    subjectId: "senior-ai-tech",
    prompt:
      "教育機構要評估生成式 AI 出題助手的品質。下列哪一項最適合作為「內容正確性」的評估方式？",
    choices: [
      { id: "A", text: "以 BLEU 等自動指標比對產出題目與既有題庫的相似度" },
      { id: "B", text: "由學科教師抽樣逐題查核答案與解析是否正確" },
      { id: "C", text: "請另一個大型語言模型為每題打正確性分數並取平均" },
      { id: "D", text: "統計學生作答後的按讚與回報次數，以此衡量題目正確性" },
    ],
    answer: "B",
    explanation:
      "正確性是事實層面的判斷，只有具備學科知識的人逐題查核才算數。自動指標可以衡量流暢度或格式，但無法判斷答案對錯，這是生成式 AI 評估中最不能省的一環。",
    choiceExplanations: {
      A: "BLEU 衡量的是字面重疊程度，與既有題目相似不代表答案正確，全新的好題目反而會被扣分。",
      C: "模型評分本身也可能出錯，無法為學科內容的對錯負責；可作初篩，但不能取代具學科知識者的查核。",
      D: "按讚反映的是觀感，學生未必能判斷題目對錯；回報次數也只反映被發現的錯，無法系統性衡量正確性。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["內容正確性", "人工查核", "評估方法"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若要評的是「題目讀起來順不順」，自動可讀性指標就足夠——人工查核的必要性來自正確性無法自動判定。",
    },
  },
  {
    id: "senior-ai-tech-practice-q028",
    subjectId: "senior-ai-tech",
    prompt:
      "關於提示工程中的「少量範例提示（Few-shot Prompting）」，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "限制模型只輸出少量字數，讓回答精簡一致" },
      { id: "B", text: "以少量標註資料重新訓練模型權重，使其學會新格式" },
      { id: "C", text: "在提示中提供數個輸入輸出範例，引導模型依格式作答" },
      { id: "D", text: "只需在第一次對話提供範例，模型之後就會記住該格式" },
    ],
    answer: "C",
    explanation:
      "少量範例提示是在推論時把幾組示範放進上下文，讓模型從中歸納出期望的格式與風格。它不更新任何權重，屬於「用提示引導」而非「用訓練改變模型」。",
    choiceExplanations: {
      A: "限制字數是輸出長度的控制，與在提示中放範例引導格式無關；「少量」指的是範例數而非輸出長度。",
      B: "以資料更新權重是微調，與只在提示中放範例、不動權重是兩種不同的手段。",
      D: "模型不會記住上一次對話的範例，每次呼叫都需要在上下文中重新提供。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["少量範例提示", "上下文引導"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若任務需要的是模型原本沒有的領域知識，放再多範例也補不上——範例教的是格式，不是知識。",
    },
  },
  {
    id: "senior-ai-tech-practice-q029",
    subjectId: "senior-ai-tech",
    prompt:
      "農會導入生成式 AI 客服，需能回答隨季節更新的補助方案。若補助內容每月都調整，下列架構何者維運成本最低且最不易過時？",
    choices: [
      { id: "A", text: "把所有方案寫進系統提示詞，每月調整時更新提示詞即可" },
      { id: "B", text: "每月以最新方案微調模型，讓模型直接記住所有補助內容" },
      { id: "C", text: "以 RAG 檢索最新方案文件，模型只負責組織答覆" },
      { id: "D", text: "以 FAQ 關鍵字比對回覆，比對不到的問題轉由人工處理" },
    ],
    answer: "C",
    explanation:
      "方案頻繁變動時，把知識放在可即時更新的檢索索引裡最划算：更新文件即生效，不必動模型。微調則是每次更新都要重跑訓練與評估，成本與延遲都高得多。",
    choiceExplanations: {
      A: "每次調整都要改提示並重新測試，方案一多就超出提示長度上限，維運成本會隨方案數增加。",
      B: "每月微調要重複訓練、評估與部署，成本高且更新有時間差；記在權重裡的方案細節也可能記錯。",
      D: "FAQ 每月都要人工改寫比對規則與答案，口語問法也常比對不到而大量轉人工，維運成本並不低。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["RAG", "知識更新頻率", "維運成本"],
      constraints: ["cost", "maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若補助方案一年只改一次、且內容極短，寫進系統提示詞反而最省事，RAG 的建置與維運成本就不划算。",
    },
  },
  {
    id: "senior-ai-tech-practice-q030",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行要求生成式 AI 的所有對外文案都必須經人工核可後才能發佈。這種安排最主要體現下列哪一種原則？",
    choices: [
      { id: "A", text: "人類監督（Human-in-the-loop）" },
      { id: "B", text: "資料最小化（Data Minimization）" },
      { id: "C", text: "可解釋性（Explainability）" },
      { id: "D", text: "透明度（Transparency）" },
    ],
    answer: "A",
    explanation:
      "在決策或產出流程中保留人的審核關卡，讓最終責任仍由人承擔，正是人類監督的核心。對外文案涉及法遵與商譽風險，是最典型需要保留人工核可的場景。",
    choiceExplanations: {
      B: "資料最小化講的是只蒐集與處理必要的個資，與產出前的人工審核不是同一件事。",
      C: "可解釋性要求說明模型為何做出某個輸出，與發佈前由人核可的流程不是同一件事。",
      D: "透明度要求揭露 AI 的使用與運作方式，例如標示內容由 AI 生成；人工核可關卡講的是把關而非揭露。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["人類監督", "人工核可"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若產出只在內部參考、不對外發布，人工核可可以降級為抽查——監督強度該隨後果的嚴重性而動。",
    },
  },
  {
    id: "senior-ai-tech-practice-q031",
    subjectId: "senior-ai-tech",
    prompt:
      "醫療團隊發現生成式 AI 摘要的病歷偶爾出現原文沒有的診斷描述。這種現象通常稱為下列何者？",
    choices: [
      { id: "A", text: "幻覺（Hallucination）" },
      { id: "B", text: "模式崩潰（Mode Collapse）" },
      { id: "C", text: "過擬合（Overfitting）" },
      { id: "D", text: "資料洩漏（Data Leakage）" },
    ],
    answer: "A",
    explanation:
      "模型產生看似合理、實際上沒有依據的內容，稱為幻覺。在醫療場域尤其危險，因此摘要類應用必須搭配可追溯的出處標註與人工複核。",
    choiceExplanations: {
      B: "模式崩潰是生成模型輸出多樣性喪失、反覆產生相似結果的現象，與捏造原文沒有的內容不同。",
      C: "過擬合指模型在訓練資料表現好、未見資料表現差，描述的是泛化問題而非捏造內容。",
      D: "資料洩漏指訓練時誤用了測試集或未來資訊而使評估失真，並不是生成不存在的內容。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["幻覺", "無依據內容"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型輸出的診斷描述確實出現在原文的其他段落、只是被放錯位置，那是摘要對應錯誤而不是幻覺。",
    },
  },
  {
    id: "senior-ai-tech-practice-q032",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠要讓 AI 助理能實際查詢即時產線資料庫並回報數值，而非僅依訓練知識回答。最適合的做法是下列何者？",
    choices: [
      { id: "A", text: "以最新產線資料微調模型，讓模型記住各機台的即時數值" },
      { id: "B", text: "定期把資料庫的最新快照匯入提示詞，讓模型依快照回答" },
      { id: "C", text: "以 RAG 檢索產線操作手冊，讓模型依手冊說明回報數值" },
      { id: "D", text: "提供可呼叫的查詢 API 工具，由模型決定何時呼叫" },
    ],
    answer: "D",
    explanation:
      "工具呼叫讓模型在需要即時資料時發出查詢請求，由系統執行後把結果回填上下文再生成答覆。這樣資料永遠是當下的，也避免把整個資料庫塞進提示。",
    choiceExplanations: {
      A: "微調是把資料寫進權重，訓練完成時數值就已過時，無法回答「現在」的即時數值。",
      B: "快照仍是靜態的，兩次匯入之間的變化都看不到；資料量也很快就會超過上下文長度。",
      C: "手冊記載的是操作說明而非即時數據，檢索得再準也查不到當下產線資料庫的數值。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["工具呼叫", "即時資料", "上下文限制"],
      constraints: ["integration", "latency"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若產線資料每天只更新一次，把當日快照放進檢索索引就夠了，不必付出工具呼叫的複雜度與延遲。",
    },
  },
  {
    id: "senior-ai-tech-practice-q033",
    subjectId: "senior-ai-tech",
    prompt:
      "關於生成式 AI 的著作權風險，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "產出可能重現受保護內容，發佈前仍須檢查相似度與授權" },
      { id: "B", text: "使用開源授權的模型產出內容，即可免除所有著作權責任" },
      { id: "C", text: "只在公司內部使用而不對外發佈，就完全沒有著作權風險" },
      { id: "D", text: "AI 生成內容不受著作權保護，因此也不會侵害他人著作權" },
    ],
    answer: "A",
    explanation:
      "模型可能在特定提示下大段重現訓練語料中的受保護內容，發佈前應進行相似度比對並確認素材授權。「AI 生成」本身不構成免責事由。",
    choiceExplanations: {
      B: "開源授權規範的是模型本身的使用條件，不涵蓋產出內容是否侵害他人著作權。",
      C: "內部使用風險較低但不等於零，重製本身就可能涉及權利，若後續散布或商業利用更可能產生爭議。",
      D: "生成內容能否受保護，與它是否侵害他人著作是兩回事；產出仍可能與既有作品高度相似而構成侵權。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["著作權", "訓練資料重現", "授權檢查"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模型是以完全授權或自有資料訓練，重現受保護內容的風險大幅下降，但仍應保留相似度比對這道關卡。",
    },
  },
  {
    id: "senior-ai-tech-practice-q111",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的理財建議書生成系統已導入檢索增強生成並標註出處，仍出現一份建議書把兩檔商品的費率互相對調。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "改用更大的模型並加長上下文，讓模型同時看清兩檔商品文件" },
      { id: "B", text: "在提示詞中強調「請仔細核對費率」，並要求模型逐項列出出處" },
      { id: "C", text: "檢索不保證數值對應正確，費率等關鍵數值應由程式從來源直接填入" },
      { id: "D", text: "停用檢索增強生成，改以兩檔商品的資料微調模型以記住費率" },
    ],
    answer: "C",
    explanation:
      "RAG 解決的是「有沒有依據」，但模型仍可能在多份文件之間把數值對錯對象。關鍵數值不該讓模型敘述，而該由程式從來源欄位直接帶入，模型只負責串接文字。",
    choiceExplanations: {
      A: "更大的模型與更長的上下文仍可能在相似文件之間混淆對應關係；只要數值由模型敘述，就有對調的風險。",
      B: "提示強調與列出處都還是由模型敘述數值，出處標對了費率仍可能對調；這類指示無法保證對應正確。",
      D: "停用檢索會失去可追溯的依據，微調記住的數值更難核對，且費率一變就要重訓，錯得更難發現。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["RAG 侷限", "結構化填值", "數值正確性"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若建議書中根本不含任何數值、只有定性描述，這個風險就不存在，RAG 加出處標註已經足夠。",
    },
  },
  {
    id: "senior-ai-tech-practice-q112",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院要讓 AI 助理能查詢病患當下的檢驗值並據以回答。已知檢驗值每小時更新、且系統須記錄每次查詢。下列設計何者最合理？",
    choices: [
      { id: "A", text: "提供受權限控管的查詢工具由模型呼叫，並在工具層記錄每次查詢" },
      { id: "B", text: "每小時把全院最新檢驗值匯入提示詞，並在對話紀錄中留存查詢" },
      { id: "C", text: "以檢索增強生成檢索每日彙整的檢驗報告，並記錄檢索紀錄" },
      { id: "D", text: "以病患歷次檢驗值微調模型，讓模型依趨勢推估當下數值" },
    ],
    answer: "A",
    explanation:
      "要當下的值就必須即時查詢，而查詢紀錄要留在工具層——因為那是真正發生存取的地方，也才擋得住越權。把權限與稽核放在工具層，模型換了也不影響。",
    choiceExplanations: {
      B: "全院檢驗值遠超過提示長度，把所有病患資料塞給每次對話違反最小權限；對話紀錄也記不到實際存取了誰的資料。",
      C: "每日彙整的報告無法回答每小時更新的當下檢驗值，時效不符；記錄檢索也不等於做到權限控管。",
      D: "檢驗值是個別病患的實測數據，依趨勢推估就是在編造數值；且資料每小時更新，也不可能每小時重訓。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["工具呼叫", "權限控管", "稽核紀錄"],
      constraints: ["privacy", "latency", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      crossNode: "L21302",
      decisionBoundary:
        "若檢驗值一天只更新一次、且查詢對象固定為當前看診的病患，把當日快照放進上下文就夠了，不必付出工具呼叫的複雜度。",
    },
  },
  {
    id: "senior-ai-tech-practice-q113",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育機構要讓生成式模型穩定產出固定格式的評語，同時內容須反映每週更新的教材。團隊爭論該用微調還是檢索。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "格式以微調或模板固定，每週變動的教材以檢索引入，兩者分工" },
      { id: "B", text: "格式與教材都以微調處理，每週以新教材重訓一次以保持同步" },
      { id: "C", text: "格式與教材都以檢索處理，在檢索結果中附上評語範本即可" },
      { id: "D", text: "以檢索固定評語格式與語氣，教材內容則每週以微調引入" },
    ],
    answer: "A",
    explanation:
      "判準是變動頻率：不會變的（格式、語氣）寫進模型或模板最省；會變的（教材）留在可即時更新的檢索索引。把兩者混在同一種手段上，就會出現「改一次要重訓一次」或「格式時好時壞」。",
    choiceExplanations: {
      B: "每週重訓的成本與時間差都不可行，教材一改就過時。",
      C: "檢索到的範本只是參考內容，模型不一定照做，格式仍會時好時壞；穩定的格式與語氣應由微調或固定模板負責。",
      D: "分工方向顛倒——會變的教材放進權重就得每週重訓，檢索也無法穩定控制格式與語氣。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["微調", "檢索", "變動頻率"],
      constraints: ["cost", "maintainability"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L21202",
      decisionBoundary:
        "若格式需求只是「正式一點」這種簡單約束，提示模板就夠了，微調的訓練成本換不到相應效益。",
    },
  },
  {
    id: "senior-ai-tech-practice-q114",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的設備手冊問答助理，同一問題在不同時間得到措辭不同但內容一致的答案，操作員反映困惑。技術人員已調低生成溫度仍未完全解決。下列處置何者最合理？",
    choices: [
      { id: "A", text: "重新撰寫手冊，統一各章節用語以減少答案措辭差異" },
      { id: "B", text: "再把溫度調到 0 並固定隨機種子，保證每次輸出完全相同" },
      { id: "C", text: "改用更大的模型，以更強的語言能力維持措辭一致" },
      { id: "D", text: "高頻問題改回傳經審核的固定回覆，未命中時才走生成" },
    ],
    answer: "D",
    explanation:
      "調低溫度能減少隨機性，但只要走生成路徑，措辭就仍可能因提示或檢索片段的細微差異而變動。對答案固定的高頻問題，最可靠的做法是繞開生成，直接回傳審核過的內容。",
    choiceExplanations: {
      A: "統一手冊用語能減少檢索片段的差異，但生成時仍會重新措辭，且重寫成本極高；高頻問題要穩定，得繞開生成。",
      B: "即使溫度為 0、固定種子，檢索到的片段或提示稍有不同措辭仍會變；且已試過調低溫度未能解決。",
      C: "更大的模型不保證措辭穩定，只要走生成路徑措辭就可能變動，成本卻上升。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["輸出一致性", "固定回覆", "分類前置"],
      constraints: ["quality", "latency"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      crossNode: "L21302",
      decisionBoundary:
        "若問題幾乎不重複、每次情境都不同，固定回覆的命中率會極低，投資就不划算。",
    },
  },
  {
    id: "senior-ai-tech-practice-q115",
    subjectId: "senior-ai-tech",
    prompt:
      "某農業單位要以生成式模型撰寫對外的補助說明文案，並要求上線前確認不含錯誤資訊。下列流程何者最合理？",
    choices: [
      { id: "A", text: "以字數與段落完整度檢查文案，確認必要章節都有寫到" },
      { id: "B", text: "先小範圍發布給部分民眾試閱，依回饋修正錯誤後再全面上線" },
      { id: "C", text: "以另一個生成式模型交叉檢查輸出，兩者一致才發布" },
      { id: "D", text: "模型產出草稿，承辦人逐項核對數字與條件後才發布並留存紀錄" },
    ],
    answer: "D",
    explanation:
      "對外文案涉及民眾權益，事實正確性只能由知道正確答案的人確認。保留核對紀錄則讓日後發生爭議時，責任與流程都說得清楚。",
    choiceExplanations: {
      A: "結構完整只代表章節都在，金額與條件寫錯照樣通過；格式檢查無法確認事實正確性。",
      B: "試閱的民眾不知道正確金額與條件，抓不出錯誤；且錯誤資訊已對外流出，受影響者的申請不會因事後修正而恢復。",
      C: "兩個模型可能犯相同的錯，一致不代表正確；生成式模型無法取代知道正確答案的人做事實查核。",
    },
    topic: "L21103 生成式 AI 技術與應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["人工核對", "事實正確性", "紀錄保留"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若產出的只是內部腦力激盪用的想法清單、不對外發布，核對強度就可以大幅放寬。",
    },
  },

  // ── L21104 多模態人工智慧應用（11 題）──────────────────────────
  {
    id: "senior-ai-tech-practice-q034",
    subjectId: "senior-ai-tech",
    prompt:
      "保險公司要處理理賠案件，輸入包含事故照片與文字描述，系統需綜合兩者判斷案件類型。此應用屬於下列何者？",
    choices: [
      { id: "A", text: "單模態的電腦視覺影像分類" },
      { id: "B", text: "依歷史案件趨勢的時間序列預測" },
      { id: "C", text: "純規則式專家系統" },
      { id: "D", text: "多模態人工智慧應用" },
    ],
    answer: "D",
    explanation:
      "同時處理影像與文字兩種模態，並把兩者的資訊融合後做出判斷，正是多模態應用的定義。任一模態單獨看都可能不足以判斷案件類型。",
    choiceExplanations: {
      A: "電腦視覺影像分類只看照片，會忽略文字描述中的關鍵情境資訊，不符合「綜合兩者判斷」。",
      B: "時間序列預測處理的是隨時間變化的數值走勢，即使用上歷史案件趨勢，也無法綜合本案的照片與文字來判斷。",
      C: "純規則系統依人工撰寫的條件判斷，無法直接處理照片這種非結構化輸入。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["多模態", "模態融合"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若文字描述其實只是照片的重複說明、不帶額外資訊，多模態融合帶來的增益就有限，單看影像即可。",
    },
  },
  {
    id: "senior-ai-tech-practice-q035",
    subjectId: "senior-ai-tech",
    prompt:
      "多模態系統中的「早期融合」與「晚期融合」，其差別最主要在於下列何者？",
    choices: [
      { id: "A", text: "早期融合在雲端集中運算，晚期融合則把推論分散到邊緣裝置" },
      { id: "B", text: "在特徵層就合併各模態，或各模態先各自預測再合併結果" },
      { id: "C", text: "早期融合要求各模態同時蒐集，晚期融合允許資料分批補齊" },
      { id: "D", text: "早期融合在訓練前就固定各模態權重，晚期融合則在訓練中動態學習權重" },
    ],
    answer: "B",
    explanation:
      "早期融合把各模態的特徵先拼接再一起學習，能捕捉模態間的細緻互動；晚期融合讓各模態各自預測、最後才整合分數，較模組化且對缺失模態更有韌性。",
    choiceExplanations: {
      A: "融合策略講的是資訊在模型哪一階段合併，與部署位置無關；兩種融合的模型都能部署在雲端或邊緣。",
      C: "融合策略描述的是模型架構中資訊在哪一層合併，而非資料何時蒐集；分批蒐集的資料在訓練前一樣要把同一樣本的各模態配對好。",
      D: "權重固定或動態學習兩種融合都做得到，不是兩者的分界；差別在於合併發生在特徵層還是預測結果層。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["早期融合", "晚期融合", "模態合併層級"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若各模態的取樣時間難以對齊、或常有模態缺失，晚期融合的模組化優勢會勝過早期融合能捕捉的細緻互動。",
    },
  },
  {
    id: "senior-ai-tech-practice-q036",
    subjectId: "senior-ai-tech",
    prompt:
      "醫療團隊整合影像、檢驗數值與病歷文字建立輔助診斷模型。若某位病患缺少檢驗數值，下列哪一種設計最能維持系統可用？",
    choices: [
      { id: "A", text: "以全院病患的檢驗平均值填補缺值且不作標記，讓模型照常推論" },
      { id: "B", text: "直接拒絕處理任何缺少模態的案例，改由人工判讀以確保安全" },
      { id: "C", text: "採晚期融合並允許缺失模態時以其餘模態的預測結果加權" },
      { id: "D", text: "把缺失欄位一律填 0，讓模型自行學會辨認缺值的情況" },
    ],
    answer: "C",
    explanation:
      "晚期融合讓每個模態各有一個預測分支，缺哪一個就略過哪一個，其餘分支仍能給出判斷。這種設計對真實醫療資料常見的缺漏最有韌性。",
    choiceExplanations: {
      A: "以母體平均填補會把這位病患拉向「一般人」的數值，又不標記，模型無從得知該值是填的，判斷可能系統性偏誤。",
      B: "真實病歷缺項極為常見，一律退回人工會讓系統在多數情境下形同虛設；安全可以靠標示可信度達成，不必整個拒絕。",
      D: "填 0 又沒有額外的缺值指標，模型無法區分「沒測」與「數值為零」，只會形成系統性偏誤，而不是自行學會辨認缺值。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["缺失模態", "晚期融合", "韌性"],
      constraints: ["data_quality", "reliability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若某個模態幾乎不會缺失、而模態間的細緻互動才是判斷關鍵，早期融合仍然較佳——晚期融合是以互動資訊換韌性。",
    },
  },
  {
    id: "senior-ai-tech-practice-q037",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠以「振動訊號 + 熱影像 + 維修文字紀錄」共同判斷設備健康狀態。相較於只用振動訊號，多模態的主要優勢是下列何者？",
    choices: [
      { id: "A", text: "多一種模態可分攤特徵，讓單一模型的參數量下降" },
      { id: "B", text: "不同模態提供互補資訊，可提升判斷的強健性" },
      { id: "C", text: "熱影像可交叉驗證振動讀值，從而免除感測器的定期校正" },
      { id: "D", text: "三種訊號可平行處理，推論速度一定比只用振動更快" },
    ],
    answer: "B",
    explanation:
      "振動可能受環境干擾、熱影像可能被遮蔽、文字紀錄可能不完整，但三者同時失真的機率遠低於單一來源。互補資訊帶來的強健性，正是多模態的核心價值。",
    choiceExplanations: {
      A: "多接一個模態通常要多一組編碼器，參數量往往上升；特徵來源變多不會讓模型變小。",
      C: "交叉比對能幫忙發現異常讀值，但每一種感測器仍各自需要校正，模態變多反而讓校正工作增加。",
      D: "要處理多種輸入，即使平行運算，總推論成本一般仍會提高，速度不會因此變快。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["多模態", "互補資訊", "強健性"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若三種模態其實都源自同一個失效原因（例如同一組電源或同一台採集器），它們會同時失真，互補性就不成立。",
    },
  },
  {
    id: "senior-ai-tech-practice-q038",
    subjectId: "senior-ai-tech",
    prompt:
      "教育平台想讓學生上傳手寫解題照片並取得文字回饋。此流程最可能需要串接下列哪一組技術？",
    choices: [
      { id: "A", text: "語音辨識轉逐字稿加上大型語言模型" },
      { id: "B", text: "影像辨識／OCR 加上語言模型" },
      { id: "C", text: "影像分類模型加上個人化學習推薦" },
      { id: "D", text: "文字轉影像生成模型加上語音合成" },
    ],
    answer: "B",
    explanation:
      "要先把手寫內容轉成可處理的文字或結構（影像辨識／OCR），再由語言模型理解解題步驟並產生回饋，兩段串接才能完成從照片到文字建議的流程。",
    choiceExplanations: {
      A: "語音辨識處理的是聲音，學生上傳的是手寫照片，前段的輸入模態就對不上。",
      C: "影像分類只能替整張照片貼一個類別，讀不出解題內容；學習推薦只能推薦教材，也無法產生針對解題步驟的文字回饋。",
      D: "文字轉影像是依描述產生圖片、語音合成是輸出聲音，方向都與「從照片讀出內容再寫回饋」相反。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["OCR", "語言模型", "技術串接"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若學生改成直接輸入文字解題步驟，OCR 那一段就可以省掉，流程從兩段縮成一段。",
    },
  },
  {
    id: "senior-ai-tech-practice-q039",
    subjectId: "senior-ai-tech",
    prompt:
      "農業團隊結合空拍影像與地面感測資料建模。兩者的取樣頻率不同（影像每週一次、感測每小時一次）。下列前處理何者最必要？",
    choices: [
      { id: "A", text: "把空拍影像轉為灰階以降低資料量並統一格式" },
      { id: "B", text: "以插值把空拍影像補成每小時一張，與感測資料對齊" },
      { id: "C", text: "把所有資料依時間對齊並決定共同的時間粒度" },
      { id: "D", text: "兩種資料分別建模，各自輸出結果後交由人工研判" },
    ],
    answer: "C",
    explanation:
      "不同來源要一起建模，前提是每一筆訓練樣本的各模態指向同一個時間區間。必須先決定共同粒度（例如以週為單位彙總感測資料），再依時間對齊，否則模型學到的是錯位的對應關係。",
    choiceExplanations: {
      A: "轉灰階會丟失作物與土壤的色彩資訊，而且只處理單一來源的格式，沒有解決兩者時間錯位的問題。",
      B: "影像一週才拍一次，插值補出的中間影像並非真實觀測，等於憑空製造資料；應決定共同粒度、把感測資料彙總對齊，而非虛構影像。",
      D: "各自建模再交人工研判，模型本身並未整合兩種資料，兩者的時間錯位問題也依舊沒有處理。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時間對齊", "取樣頻率", "共同粒度"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若要預測的是「當下的即時狀態」而非週期趨勢，就不能把感測資料往週彙總，而該以影像的最近一次觀測搭配即時感測值。",
    },
  },
  {
    id: "senior-ai-tech-practice-q040",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行的多模態身分驗證同時使用人臉與聲紋。關於此設計，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩種模態可平行比對，驗證速度必然比單模態更快" },
      { id: "B", text: "生物特徵經雜湊加密後儲存，就不再受個資法規約束" },
      { id: "C", text: "兩種生物特徵並用可降低單一模態被偽造時的風險" },
      { id: "D", text: "人臉與聲紋都是公開可見的特徵，蒐集時無需告知同意" },
    ],
    answer: "C",
    explanation:
      "攻擊者要同時偽造人臉與聲紋的難度遠高於偽造其中之一，因此多因子的生物特徵驗證能提高安全水準。這也是金融場域常見的設計。",
    choiceExplanations: {
      A: "要多做一次擷取與比對，即使平行處理，整體驗證時間通常仍增加而非減少。",
      B: "加密是保護措施，不會改變人臉與聲紋屬於可識別個人的生物特徵；蒐集與利用仍須符合個資法規。",
      D: "公開可見不等於可自由蒐集；人臉與聲紋可識別特定個人，屬於高敏感個資，蒐集須有法律依據並告知同意。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["多因子生物辨識", "偽造風險"],
      constraints: ["security", "privacy"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若兩種模態能被同一段偽造影片一次騙過（含語音的 deepfake），多模態的安全增益就大幅縮水。",
    },
  },
  {
    id: "senior-ai-tech-practice-q041",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院要讓模型根據 X 光影像自動產生初步文字報告。此任務屬於下列哪一種多模態形式？",
    choices: [
      { id: "A", text: "影像到文字（Image-to-Text）" },
      { id: "B", text: "文字到影像（Text-to-Image）" },
      { id: "C", text: "影像到影像（Image-to-Image）" },
      { id: "D", text: "文字到文字（Text-to-Text）" },
    ],
    answer: "A",
    explanation:
      "輸入是影像、輸出是文字描述，屬於影像到文字的生成任務（影像標題生成或報告生成）。醫療報告生成對事實正確性要求極高，實務上必須搭配醫師複核。",
    choiceExplanations: {
      B: "文字到影像是依描述生成圖片，方向與本任務相反。",
      C: "影像到影像是把一張圖轉成另一張圖（如去雜訊、分割），輸出不是文字報告。",
      D: "文字到文字的輸入是文字，本任務的輸入是 X 光影像，模態方向不符。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["影像到文字", "報告生成"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若改成「依文字病歷產生示意圖供衛教使用」，方向就翻轉成文字到影像。",
    },
  },
  {
    id: "senior-ai-tech-practice-q042",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠導入多模態模型後，發現熱影像鏡頭故障時整個系統的判斷品質急遽下滑。下列哪一項設計最能改善此脆弱性？",
    choices: [
      { id: "A", text: "偵測模態缺失並自動降級為僅使用可用模態的備援路徑" },
      { id: "B", text: "增加熱影像的訓練資料量，讓模型對熱影像特徵學得更穩" },
      { id: "C", text: "取消其他模態只保留熱影像，以簡化系統並減少故障點" },
      { id: "D", text: "鏡頭故障時沿用最後一筆正常熱影像，讓模型持續推論" },
    ],
    answer: "A",
    explanation:
      "系統應該能察覺某個模態失效，並切換到只用其餘模態的備援模型或路徑，同時把可信度標示降低。這樣單點故障就不會拖垮整個判斷能力。",
    choiceExplanations: {
      B: "學得更穩反而讓系統更依賴熱影像；鏡頭故障時輸入本身就失效，再多訓練資料也救不回判斷品質。",
      C: "少了其他模態，熱影像變成唯一依賴，單點故障的衝擊反而升到最高；故障點變少不等於脆弱性變低。",
      D: "沿用舊影像會讓模型把過時的狀態當成現況，在系統不知情下輸出錯誤判斷，比明確降級更危險。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["模態缺失偵測", "備援路徑", "單點故障"],
      constraints: ["reliability"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若熱影像是這個判斷唯一不可取代的訊號（其他模態根本看不到過熱），降級路徑就撐不住品質，該做的是鏡頭本身的冗餘。",
    },
  },
  {
    id: "senior-ai-tech-practice-q043",
    subjectId: "senior-ai-tech",
    prompt:
      "教育單位評估多模態學習分析系統時，最應優先確認下列哪一項？",
    choices: [
      { id: "A", text: "系統能否即時分析全班學生的表情與專注度" },
      { id: "B", text: "系統介面是否採用最新的前端框架以利日後擴充" },
      { id: "C", text: "模型參數量是否足以同時處理影像與語音" },
      { id: "D", text: "蒐集學生影像與語音是否具備法律依據與家長同意" },
    ],
    answer: "D",
    explanation:
      "涉及未成年人的影像與語音屬於高敏感個資，蒐集的法律依據與監護人同意是能不能做這件事的前提，必須在技術評估之前就確認。",
    choiceExplanations: {
      A: "即時分析能力是技術規格；若蒐集本身不合法，再強的分析能力也不能上線。",
      B: "前端框架與擴充性是實作選擇，與是否可以合法蒐集資料無關。",
      C: "參數量夠不夠是技術規格，不會讓不合法的資料蒐集變得合法。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["未成年個資", "法律依據", "監護人同意"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若系統改為只蒐集作答紀錄這類非生物特徵資料，法律門檻大幅降低，評估重點會回到技術面。",
    },
  },
  {
    id: "senior-ai-tech-practice-q044",
    subjectId: "senior-ai-tech",
    prompt:
      "農業監測系統結合衛星影像與氣象時序資料預測收成。若兩種資料的空間解析度差異很大，下列處理何者最合理？",
    choices: [
      { id: "A", text: "先決定分析單元（如田區），把兩種資料聚合到相同空間粒度" },
      { id: "B", text: "把兩種資料標準化後直接相加，合成單一環境指標" },
      { id: "C", text: "捨棄空間資訊，把整個區域視為單一點並以平均值代表" },
      { id: "D", text: "只保留與氣象站位置重疊的衛星像素，讓兩種資料在空間上完全重合" },
    ],
    answer: "A",
    explanation:
      "多來源空間資料必須先統一分析單元，才能讓同一筆樣本的各欄位描述的是同一塊土地。以田區為單位聚合衛星像素、並對應到最近的氣象站資料，是遙測分析的標準做法。",
    choiceExplanations: {
      B: "標準化只消除了量綱，兩者描述的空間範圍仍不一致，相加後的指標沒有對應到同一塊土地。",
      C: "全區平均會讓不同田區的差異全部消失，無法做田區級的收成預測。",
      D: "只留氣象站位置的像素會丟掉絕大部分田區的影像資訊，樣本嚴重不足，也無法做田區級預測。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["空間粒度", "分析單元", "遙測整合"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若氣象站密度高到每塊田區都有一座，就不必往上聚合，可直接以較細的空間解析度建模。",
    },
  },
  {
    id: "senior-ai-tech-practice-q116",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院的多模態診斷輔助系統整合影像、檢驗值與病歷文字。上線後發現當檢驗值缺漏時整體判斷品質急遽下滑。已知該系統採早期融合。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以同齡病患的檢驗平均值填補缺漏，維持早期融合的輸入完整" },
      { id: "B", text: "改為晚期融合或加入模態缺失偵測與備援路徑，並標示可信度下降" },
      { id: "C", text: "缺少檢驗值的案例一律退回人工判讀，以避免錯誤建議" },
      { id: "D", text: "提高影像模態的權重，讓檢驗值缺漏時由影像主導判斷" },
    ],
    answer: "B",
    explanation:
      "早期融合把各模態的特徵拼接後一起學，缺一段就等於輸入殘缺。晚期融合讓每個模態各有分支，缺哪個就略過哪個；同時要讓系統誠實回報「這次的判斷可信度較低」。",
    choiceExplanations: {
      A: "平均值填補讓輸入看似完整，但模型無從得知該值是填的，判斷會被拉向一般人的數值，品質下滑的根源並未解決。",
      C: "真實病歷缺項極為常見，一律退回會讓系統在多數情境下形同虛設；應讓其餘模態給出判斷並標示可信度。",
      D: "早期融合仍把殘缺的特徵一起輸入，調權重只是換一種依賴，並沒有讓模型學會在缺值時正確推論。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["早期融合", "晚期融合", "模態缺失"],
      constraints: ["reliability", "data_quality", "safety"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若檢驗值幾乎不會缺漏、而模態間的細緻互動才是判斷關鍵，早期融合仍然較佳——晚期融合是以互動資訊換韌性。",
    },
  },
  {
    id: "senior-ai-tech-practice-q117",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠整合振動訊號（每秒千筆）與熱影像（每分鐘一張）判斷設備健康。建模前最關鍵的處理是下列何者？",
    choices: [
      { id: "A", text: "把熱影像轉灰階並壓縮解析度，讓兩種資料的儲存量相近再一起建模" },
      { id: "B", text: "決定共同時間粒度並對齊到同一時間窗，例如把振動彙總為每分鐘統計特徵" },
      { id: "C", text: "把振動訊號降頻，每分鐘只取一筆瞬時值，與熱影像逐筆配對" },
      { id: "D", text: "以插值把熱影像補成每秒千筆，與振動訊號逐筆對齊" },
    ],
    answer: "B",
    explanation:
      "兩種資料的取樣頻率差了六萬倍，不先對齊到同一時間單位，每一筆訓練樣本的兩個模態就描述著不同時刻。彙總為統計特徵能在對齊的同時保留振動的波動資訊。",
    choiceExplanations: {
      A: "轉灰階會丟失熱影像的溫度色彩資訊，而且儲存量相近不代表時間對齊，兩種資料仍描述不同時刻。",
      C: "這雖然對齊了時間，但每分鐘只取一個瞬間值會丟掉振動的波動特性，不如彙總成統計特徵。",
      D: "插值補出的熱影像並非真實觀測，等於憑空製造六萬倍的資料；應把高頻訊號往下彙總，而非把低頻訊號往上虛構。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["時間對齊", "取樣頻率", "特徵彙總"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若要偵測的是毫秒級的瞬間衝擊，往分鐘彙總會把訊號抹平，此時該提高熱影像的取樣頻率而不是降低振動的粒度。",
    },
  },
  {
    id: "senior-ai-tech-practice-q118",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的多模態身分驗證同時比對人臉與聲紋。資安團隊指出近年偽造技術可同時產生影像與語音。下列強化方向何者最合理？",
    choices: [
      { id: "A", text: "加入活體偵測等走不同管道的驗證因子，因同一段偽造影片可同時騙過兩種模態" },
      { id: "B", text: "提高人臉與聲紋比對的相似度門檻，讓偽造樣本更難通過" },
      { id: "C", text: "拉長聲紋樣本的錄製時間，因為偽造語音難以長時間維持一致" },
      { id: "D", text: "再加入同由鏡頭擷取的虹膜特徵，以模態數量提升安全性" },
    ],
    answer: "A",
    explanation:
      "多模態之所以更安全，前提是兩個模態要分別被攻破。一旦同一段偽造影片能同時提供臉與聲，兩者就不再獨立，安全增益大幅縮水。要補的是走另一條管道的因子，例如活體偵測或裝置綁定。",
    choiceExplanations: {
      B: "門檻提高會讓正常使用者更常被拒，而高品質的同步偽造仍可能通過，也沒有處理兩模態不再獨立的問題。",
      C: "現今偽造技術同樣能產生長段且一致的語音；樣本拉長對同步偽造的影片幫助有限，也沒有引入獨立的驗證管道。",
      D: "新增的特徵仍由同一路影像擷取，同樣可能被同一段偽造影片騙過；關鍵是驗證因子是否走不同管道，而非模態數量。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["多因子獨立性", "活體偵測", "偽造風險"],
      constraints: ["security"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若驗證發生在臨櫃、有行員在場目視，實體在場本身就是一個獨立因子，遠端偽造的風險大幅下降。",
    },
  },
  {
    id: "senior-ai-tech-practice-q119",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育單位規劃多模態學習分析，擬蒐集學生課堂影像與發言錄音。專案啟動會議上，技術團隊已排定架構與模型選型。下列提醒何者最關鍵？",
    choices: [
      { id: "A", text: "應先確定影像與語音的融合策略，因為它會決定後續架構與成本" },
      { id: "B", text: "應先完成資料加密與存取控管設計，因為個資外洩是最大風險" },
      { id: "C", text: "應先採購足夠的 GPU 並組建標註團隊，以免延誤專案時程" },
      { id: "D", text: "應先確認蒐集未成年人影像與語音的法律依據與監護人同意" },
    ],
    answer: "D",
    explanation:
      "合法性是前提而不是其中一個項目。若蒐集本身不被允許，後面的架構、模型與硬體全部作廢。這類問題必須排在技術規劃之前確認，而不是等系統做完才發現不能上線。",
    choiceExplanations: {
      A: "融合策略是技術選擇；若蒐集本身不被允許，架構與成本的討論全部作廢。",
      B: "加密與存取控管是合法蒐集之後的保護措施，無法替代「能不能蒐集」這個前提。",
      C: "硬體與人力投入同樣建立在專案能合法執行的前提上，先投入反而可能全數浪費。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["未成年個資", "法律依據", "前提確認"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Layer Confusion",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若改為只蒐集作答紀錄這類非生物特徵資料，法律門檻大幅降低，規劃重點就回到技術面。",
    },
  },
  {
    id: "senior-ai-tech-practice-q120",
    subjectId: "senior-ai-tech",
    prompt:
      "某農業團隊要結合衛星影像（每像素 10 公尺）與氣象站資料（每站涵蓋數十公里）預測田區收成。下列處理何者最必要？",
    choices: [
      { id: "A", text: "捨棄空間資訊，以全區平均值代表所有田區的環境條件" },
      { id: "B", text: "只保留氣象站正上方的衛星像素，讓兩種資料位置完全重合" },
      { id: "C", text: "以田區為分析單元，把衛星像素聚合到田區，並對應最近氣象站的資料" },
      { id: "D", text: "把兩種資料標準化後直接相加，合成單一環境指數" },
    ],
    answer: "C",
    explanation:
      "兩種資料的空間解析度差距極大，必須先統一分析單元，同一筆樣本的各欄位才會描述同一塊土地。以田區為單元既符合實際的管理與決策粒度，也讓兩者都能對應上。",
    choiceExplanations: {
      A: "全區平均會讓不同田區的差異全部消失，無法做田區級預測。",
      B: "只留氣象站位置的像素會丟掉絕大多數田區的影像，樣本極少，也無法對應到實際要預測的田區。",
      D: "標準化只消除量綱，兩者的空間範圍仍不一致，相加後的指數無法對應到同一塊土地。",
    },
    topic: "L21104 多模態人工智慧應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["空間粒度", "分析單元", "多來源對齊"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若氣象站密度高到每塊田區都有一座，就不必往上聚合，可直接以較細的空間解析度建模。",
    },
  },

  // ── L21201 AI 導入評估（11 題）────────────────────────────────
  {
    id: "senior-ai-tech-practice-q045",
    subjectId: "senior-ai-tech",
    prompt:
      "某製造業希望導入 AI 但預算有限，需從十個候選題目中挑一個先做。下列哪一組準則最適合作為初步篩選？",
    choices: [
      { id: "A", text: "模型參數量、程式語言、開發團隊人數" },
      { id: "B", text: "高層支持度、媒體曝光度、同業採用率" },
      { id: "C", text: "伺服器品牌、機房位置、電力費率" },
      { id: "D", text: "資料可得性、商業價值、技術可行性" },
    ],
    answer: "D",
    explanation:
      "導入評估要同時回答三件事：有沒有資料可以做（資料可得性）、做了值不值得（商業價值）、做不做得出來（技術可行性）。任一項不成立，專案都難以落地。",
    choiceExplanations: {
      A: "這些是實作層面的細節，要等題目選定後才需要決定，無法用來篩選題目。",
      B: "這些反映的是組織氛圍與外部聲量，不能回答題目有沒有資料、值不值得、做不做得出來。",
      C: "機房與電力屬於基礎設施成本，影響有限且不決定題目本身的價值與可行性。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料可得性", "商業價值", "技術可行性"],
      constraints: ["cost"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若三個題目在三項準則上都相近，下一層的比較就會轉向風險可控度與利害關係人的支持度。",
    },
  },
  {
    id: "senior-ai-tech-practice-q046",
    subjectId: "senior-ai-tech",
    prompt:
      "評估 AI 導入時，若發現目標流程的歷史資料只有紙本、且沒有留下判斷結果，最合理的下一步是下列何者？",
    choices: [
      { id: "A", text: "先以紙本少量樣本訓練小模型，邊上線邊補資料" },
      { id: "B", text: "先建立資料蒐集與標註流程，把這個題目排到後期" },
      { id: "C", text: "改用參數更大的預訓練模型，以彌補資料不足的問題" },
      { id: "D", text: "直接購買同業已訓練好的模型，省下資料建置的成本" },
    ],
    answer: "B",
    explanation:
      "沒有可用的歷史資料與標籤，任何監督式模型都無從訓練。務實的做法是先把資料基礎建立起來（數位化、定義標註規範、開始累積），把這個題目排到資料成熟之後。",
    choiceExplanations: {
      A: "紙本沒有留下判斷結果，等於沒有標籤可學；邊上線邊補是在未經驗證的情況下讓模型做決策。",
      C: "預訓練模型再大，也需要本場域的標註資料才能學到判斷規律並驗證成效，參數量無法取代資料。",
      D: "同業模型是在別的資料分布上訓練的，未必適用本場域，且沒有本地資料也無從驗證成效。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料基礎", "標註流程", "題目排序"],
      constraints: ["labeled_data_scarcity"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若該流程的判斷可由規則明確描述，就不必等資料累積——沒有資料時，規則式系統才是務實的起點。",
    },
  },
  {
    id: "senior-ai-tech-practice-q047",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行評估導入 AI 信用評分模型時，下列哪一項最應在評估階段就納入考量？",
    choices: [
      { id: "A", text: "模型在歷史放款資料回測上能達到的最高準確率" },
      { id: "B", text: "評分系統與既有核心帳務系統的資料介接方式" },
      { id: "C", text: "模型決策的可解釋性與主管機關的合規要求" },
      { id: "D", text: "模型檔案格式、版本控管工具與備份方式的選擇" },
    ],
    answer: "C",
    explanation:
      "信用評分屬於高度受監理的決策，若模型無法說明拒貸理由，即使準確率再高也不能上線。可解釋性與合規要求是這個題目的可行性前提，必須在評估階段就確認。",
    choiceExplanations: {
      A: "準確率固然重要，但信用評分受高度監理，若無法說明拒貸理由，準確率再高也不能上線，因此它不是評估階段的關鍵門檻。",
      B: "系統介接是實作階段的工程細節，等題目確定可行後再規劃即可。",
      D: "檔案格式、版本控管與備份是工程細節，不會決定專案是否通過評估。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["可解釋性", "合規要求", "高度受監理決策"],
      constraints: ["explainability", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若模型只用於內部行銷名單排序、不對客戶產生拒絕決定，可解釋性的強制程度就大幅下降。",
    },
  },
  {
    id: "senior-ai-tech-practice-q048",
    subjectId: "senior-ai-tech",
    prompt:
      "評估 AI 專案的商業價值時，下列哪一種表述最適合作為可驗收的成功指標？",
    choices: [
      { id: "A", text: "讓公司各部門員工都更積極地使用 AI 工具" },
      { id: "B", text: "在六個月內把人工複驗的工時降低 30%" },
      { id: "C", text: "採用業界最先進的深度學習模型架構" },
      { id: "D", text: "模型在測試集上的準確率達到 95%" },
    ],
    answer: "B",
    explanation:
      "可驗收的成功指標必須具體、可量化、有時限，並且對應到實際的營運改善。「六個月內工時降低 30%」三者俱全，事後可以明確判定達成與否。",
    choiceExplanations: {
      A: "「更積極」沒有量測方式與時限，事後無從判定是否達成。",
      C: "使用什麼模型是手段而非目的，業界最先進不等於解決了商業問題。",
      D: "準確率是技術指標，可以量測卻不直接對應營運改善；題目要的是商業價值的驗收指標。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["可驗收指標", "量化", "時限"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若效益本質上難以量化（例如提升員工士氣），該做的是改設可觀察的代理指標，而不是放棄設定標準。",
    },
  },
  {
    id: "senior-ai-tech-practice-q049",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院評估 AI 輔助判讀專案時，發現現行流程中醫師判讀僅需 30 秒，而模型推論加上人工複核需 45 秒。下列判斷何者最合理？",
    choices: [
      { id: "A", text: "應改用推論更快的輕量模型，把總時間壓回 30 秒內" },
      { id: "B", text: "應重新檢視此專案的價值主張，效率並非其效益來源" },
      { id: "C", text: "應取消人工複核以節省時間，讓流程比現行更快" },
      { id: "D", text: "只要模型準確率高於醫師，就一定值得導入" },
    ],
    answer: "B",
    explanation:
      "既然導入後反而更慢，效率就不是這個專案的效益來源。此時應回頭問：它帶來的是漏診率下降、判讀一致性提升，還是夜間人力覆蓋？若這些都說不出來，就該重新檢視是否值得做。",
    choiceExplanations: {
      A: "換成輕量模型是在效率上硬拚，可能犧牲準確度，也沒有回答這個專案真正的效益是什麼。",
      C: "醫療判讀取消人工複核會把風險轉嫁給病患，是不可接受的取捨。",
      D: "準確率高不等於有價值；若既有流程已經又快又準，導入的邊際效益可能很小，仍須說清楚效益來源。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["價值主張", "效益來源", "流程比較"],
      constraints: ["cost", "quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若醫師判讀的 30 秒其實是尖峰時段的平均、離峰卻要排隊數小時，效率的比較基準就得改成端到端的等待時間。",
    },
  },
  {
    id: "senior-ai-tech-practice-q050",
    subjectId: "senior-ai-tech",
    prompt:
      "在 AI 導入評估中進行概念驗證（PoC）的主要目的是下列何者？",
    choices: [
      { id: "A", text: "取代需求訪談，直接以原型觀察使用者的真實需求" },
      { id: "B", text: "以最少成本直接產出可上線的完整系統" },
      { id: "C", text: "以有限成本驗證關鍵假設，再決定是否投入正式開發" },
      { id: "D", text: "透過小規模實作，確保正式專案一定會成功" },
    ],
    answer: "C",
    explanation:
      "PoC 的價值在於用小成本把最不確定的假設先試出來——資料夠不夠、模型能不能達到門檻、使用者願不願意用。驗證失敗也是有價值的結果，因為它讓公司避免更大的投入。",
    choiceExplanations: {
      A: "PoC 驗證的是技術與資料假設；原型可以輔助釐清需求，但不能取代需求訪談對流程與痛點的梳理。",
      B: "PoC 刻意省略了工程強健性與維運考量，通常不能直接當成正式系統上線。",
      D: "PoC 是為了降低不確定性，沒有任何方法能保證專案必定成功。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["概念驗證", "關鍵假設", "降低不確定性"],
      constraints: ["cost"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若關鍵不確定性不在技術而在使用者願不願意用，PoC 就該做成可試用的原型，而不是只驗證模型指標。",
    },
  },
  {
    id: "senior-ai-tech-practice-q051",
    subjectId: "senior-ai-tech",
    prompt:
      "農業合作社評估導入病害辨識 App。訪談發現農民多在戶外、網路訊號不穩。此發現最直接影響下列哪一項評估？",
    choices: [
      { id: "A", text: "病害影像標註資料的數量與各類別是否平衡" },
      { id: "B", text: "模型訓練所用的優化器種類與學習率衰減排程" },
      { id: "C", text: "部署架構的選擇（端側推論或雲端推論）" },
      { id: "D", text: "專案預算的會計科目分類與分期付款的條件" },
    ],
    answer: "C",
    explanation:
      "網路不穩代表雲端推論在現場可能無法使用，必須評估把模型壓縮後放到手機端執行。這是使用情境直接決定技術架構的典型例子，必須在評估階段就釐清。",
    choiceExplanations: {
      A: "標註資料的數量與類別平衡影響模型品質，但與現場網路訊號不穩沒有直接關聯。",
      B: "優化器與學習率影響訓練過程的收斂，與現場網路狀況無關。",
      D: "會計科目與付款條件是財務作業，不會因為網路訊號而改變技術可行性。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["端側推論", "雲端推論", "使用情境限制"],
      constraints: ["connectivity", "latency"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若農民多在有 Wi-Fi 的集貨場使用，網路限制解除，雲端推論的模型能力與維運便利就重新勝出。",
    },
  },
  {
    id: "senior-ai-tech-practice-q052",
    subjectId: "senior-ai-tech",
    prompt:
      "評估既有流程是否適合導入 AI 時，下列哪一種特徵通常代表「較適合」？",
    choices: [
      { id: "A", text: "判斷大量重複、難以窮舉成規則，且有歷史決策紀錄" },
      { id: "B", text: "規則明確且極少例外，用簡單條件判斷即可完成" },
      { id: "C", text: "每個案例都獨一無二，需要資深人員逐案蒐集資訊深入研判" },
      { id: "D", text: "流程頻繁調整，希望由 AI 自動跟上每週的新作法" },
    ],
    answer: "A",
    explanation:
      "AI 最能發揮的地方是「人做得到但很難寫成規則、且做很多次」的判斷，加上有歷史紀錄可供學習。三個條件同時成立時，導入的效益與可行性都最高。",
    choiceExplanations: {
      B: "規則明確又少例外的流程，用傳統程式邏輯就能解決，導入 AI 是殺雞用牛刀。",
      C: "每個案例都獨特就沒有可學習的重複規律，也難以累積足夠樣本驗證成效。",
      D: "流程每週劇變會讓訓練資料迅速失效，模型永遠追不上實際作業方式，反而不適合導入。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["導入適用性", "重複判斷", "歷史決策紀錄"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若判斷雖重複但正確答案要等數年後才揭曉（例如長期投資成敗），即使有紀錄也難以訓練與驗證。",
    },
  },
  {
    id: "senior-ai-tech-practice-q053",
    subjectId: "senior-ai-tech",
    prompt:
      "教育機構評估 AI 學習推薦系統的成本時，下列哪一項最容易在初期被低估？",
    choices: [
      { id: "A", text: "模型上線後的持續監控、重新訓練與資料維運成本" },
      { id: "B", text: "第一次購買 GPU 伺服器與儲存空間的費用" },
      { id: "C", text: "開發階段委外標註第一批訓練資料與建立標註規範的費用" },
      { id: "D", text: "推薦系統的軟體授權與雲端訂閱月費" },
    ],
    answer: "A",
    explanation:
      "模型上線只是開始：資料分布會漂移、內容會更新、效能要持續監控、模型要定期重訓。這些長期營運成本往往在初期預算中被嚴重低估，卻是決定專案能否持續的關鍵。",
    choiceExplanations: {
      B: "硬體採購是一次性且金額明確的支出，通常在初期就會被完整報價與估算。",
      C: "首批標註雖然不便宜，但屬於有明確報價的一次性支出，通常會列在初期預算內。",
      D: "授權與訂閱是合約上寫明的固定費用，金額可預期，不容易被低估。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["長期維運成本", "監控", "重新訓練"],
      constraints: ["cost", "maintainability"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型的輸入分布極穩定、內容也幾乎不更新，維運成本會低得多，這項低估風險隨之下降。",
    },
  },
  {
    id: "senior-ai-tech-practice-q054",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行評估是否自建或採購 AI 反詐欺系統。下列哪一項最應納入「自建」的成本考量？",
    choices: [
      { id: "A", text: "供應商的品牌知名度與在國內的市場占有率" },
      { id: "B", text: "採購方案的年度授權費與合約綁約年限" },
      { id: "C", text: "同業多半採用哪一家廠商的反詐欺方案" },
      { id: "D", text: "長期需要的資料科學與維運團隊人力" },
    ],
    answer: "D",
    explanation:
      "自建的隱形成本主要在人：模型要有人持續調整、資料管線要有人維護、上線後要有人監控。這筆長期人力支出往往超過採購授權費，是自建或採購決策的核心變數。",
    choiceExplanations: {
      A: "品牌與市占是採購方案的考量，與自建的成本結構無關。",
      B: "授權費與合約年限是「採購」方案的成本，不是自建要負擔的項目。",
      C: "同業選擇可作參考，但不構成自家自建的成本項目。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["自建與採購", "隱形人力成本"],
      constraints: ["cost", "maintainability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若銀行本來就有資料科學團隊且有餘裕，自建的邊際人力成本大幅下降，取捨會倒向自建。",
    },
  },
  {
    id: "senior-ai-tech-practice-q055",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的 AI 專案評估報告寫著「預期可提升效率」，但未說明基準值。此報告最主要的問題是下列何者？",
    choices: [
      { id: "A", text: "沒有可比較的基準線，事後無法判斷是否真的改善" },
      { id: "B", text: "沒有寫明專案採用的演算法、深度學習框架與套件版本" },
      { id: "C", text: "沒有估算專案所需的預算金額、人力配置與上線時程" },
      { id: "D", text: "沒有附上模型架構圖、資料處理流程圖與系統部署圖" },
    ],
    answer: "A",
    explanation:
      "沒有基準線（現況數值）就沒有比較的起點，上線後不論結果如何都可以宣稱有改善，也可以被質疑沒有改善。任何成效宣稱都必須先量測現況。",
    choiceExplanations: {
      B: "演算法與框架是實作細節，缺少它們不會讓成效無法驗證。",
      C: "預算與人力屬於成本面資訊，補上它們仍無法判斷效率到底有沒有改善。",
      D: "架構圖、流程圖與部署圖有助理解實作方式，但缺少它們不會讓成效無法驗證。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["基準線", "成效驗證"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若現況根本沒有量測、也無法回溯，就必須先花時間建立基準期，否則之後任何成效宣稱都無法驗證。",
    },
  },
  {
    id: "senior-ai-tech-practice-q121",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠評估四個 AI 題目，資料可得性與商業價值皆相近，但技術可行性差異大。若要在三個月內產出可驗證的成果，下列篩選邏輯何者最合理？",
    choices: [
      { id: "A", text: "優先選技術最困難的，因為挑戰大成果才顯著且能建立技術門檻" },
      { id: "B", text: "優先選技術可行性最高、失敗後果可承受的題目，先建立基準與信任" },
      { id: "C", text: "四案並行小規模試做，三個月後保留表現最好的一案" },
      { id: "D", text: "依提案部門的層級與預算規模排序，以確保資源到位" },
    ],
    answer: "B",
    explanation:
      "時程只有三個月時，能不能做出來比值不值得做更關鍵——後者四案本來就相近。先在可行性高的題目上做出可驗證的成果，組織的信任與經驗都會成為下一題的資本。",
    choiceExplanations: {
      A: "難度高的題目在三個月內做不出成果的機率大，失敗還會消耗組織對 AI 的信心，技術門檻也無從談起。",
      C: "四案並行會讓有限資源稀釋，三個月內很可能每一案都做不到可驗證的程度。",
      D: "部門層級與預算規模是政治與資源因素，與題目在三個月內能否做出成果沒有因果關係。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["技術可行性", "題目篩選", "時程限制"],
      constraints: ["risk_priority", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21202",
      decisionBoundary:
        "若組織已有多次成功導入的經驗與充足人力，就不必再從最容易的題目開始，可以直接挑戰價值最高的。",
    },
  },
  {
    id: "senior-ai-tech-practice-q122",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院評估 AI 判讀專案，發現導入後單件處理時間從 30 秒增加到 45 秒，但夜間可提供原本沒有的初步判讀。下列評估何者最正確？",
    choices: [
      { id: "A", text: "取消人工複核把時間補回 30 秒，再以效率作為主要指標" },
      { id: "B", text: "處理時間增加了 15 秒，代表效益不足，應直接否決此案" },
      { id: "C", text: "效率不是效益來源，應改以夜間覆蓋率等指標重定義價值主張" },
      { id: "D", text: "改用更快但較不準確的模型，讓處理時間回到 30 秒" },
    ],
    answer: "C",
    explanation:
      "導入後變慢，代表效率不是它的價值所在。但「原本夜間沒有判讀、現在有了」是真實的效益，只是要用對的指標去衡量——衡量錯了，一個有價值的專案會被誤判為失敗。",
    choiceExplanations: {
      A: "取消複核會把風險轉嫁給病患，而且仍以效率衡量，沒有回應價值主張的問題。",
      B: "以效率為唯一判準會漏掉夜間覆蓋這項真正的效益。",
      D: "犧牲準確度在醫療判讀上代價過高，也不是此案效益的來源。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["價值主張", "指標選擇", "效益來源"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21202",
      decisionBoundary:
        "若醫院本來就有夜間值班醫師、判讀從不延遲，夜間覆蓋這項效益就不存在，該案的價值主張確實站不住。",
    },
  },
  {
    id: "senior-ai-tech-practice-q123",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行評估 AI 專案時只核算了模型授權費與伺服器成本，稽核認為低估。下列補充項目中，通常金額最大且最常被漏算的是何者？",
    choices: [
      { id: "A", text: "首次建置時的伺服器安裝、機房空間租賃與電力費用" },
      { id: "B", text: "專案啟動時委外顧問撰寫可行性評估與需求報告的費用" },
      { id: "C", text: "模型授權費因匯率波動與供應商年度調價產生的差額" },
      { id: "D", text: "上線後持續監控、資料管線維護與定期重訓的人力" },
    ],
    answer: "D",
    explanation:
      "模型上線只是開始：資料會漂移、內容會更新、效能要有人盯、模型一升級整套流程要重測。這些長期人力支出往往超過授權費本身，卻因為分散在各期而最容易在初期預算中被忽略。",
    choiceExplanations: {
      A: "硬體與機房屬於一次性或固定的建置成本，報價明確，通常不是金額最大且最常漏算的項目。",
      B: "顧問費是一次性且有合約報價的支出，金額有限，也不容易被漏算。",
      C: "授權費差額屬於已核算項目的小幅變動，金額遠不及長期維運人力。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["總持有成本", "維運人力", "重訓成本"],
      constraints: ["cost", "maintainability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      crossNode: "L21302",
      decisionBoundary:
        "若採用完全託管的服務、監控與重訓都由供應商負責，內部維運成本會大幅下降，但供應商月費會反映這一段。",
    },
  },
  {
    id: "senior-ai-tech-practice-q124",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育機構評估兩個候選流程：甲每年執行兩萬次、規則清晰但已有規則引擎處理且錯誤率極低；乙每年執行三千次、判斷依據難以窮舉成規則、目前全靠三位資深人員經驗。下列判斷何者最合理？",
    choices: [
      { id: "A", text: "乙較適合，因其判斷難以寫成規則；甲已有低錯誤率的規則引擎" },
      { id: "B", text: "甲較適合，因為執行次數多，自動化後節省的總工時最大" },
      { id: "C", text: "兩者都不適合，因為乙的樣本量太少而甲已不需改善" },
      { id: "D", text: "兩者都適合，應同時導入，並以 AI 全面取代甲現有的規則引擎系統" },
    ],
    answer: "A",
    explanation:
      "次數多不等於值得導入。甲的規則已經寫得出來且錯誤率低，AI 能改善的空間很小；乙的判斷寫不成規則、又高度依賴少數人的經驗，正是機器學習最能發揮也最能降低組織風險的地方。",
    choiceExplanations: {
      B: "執行次數只反映規模；甲已由錯誤率極低的規則引擎自動處理，換成 AI 能節省的工時與改善空間都很有限。",
      C: "每年三千次加上資深人員的歷史判斷，足以累積可學習的樣本；乙符合「難以規則化且有經驗可學」的條件。",
      D: "甲的規則引擎錯誤率已極低，以 AI 取代只會增加成本與不可解釋性，邊際效益有限。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["導入適用性", "規則化難度", "邊際效益"],
      constraints: ["cost", "risk_priority"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若乙的三位資深人員從未留下任何決策紀錄，就沒有可學的標籤，適用性會反過來由甲勝出。",
    },
  },
  {
    id: "senior-ai-tech-practice-q125",
    subjectId: "senior-ai-tech",
    prompt:
      "某農會的 AI 專案評估報告寫「預期提升作業效率」，未列現況數值。若要讓此報告可被驗收，最關鍵的補充是下列何者？",
    choices: [
      { id: "A", text: "補上預期效率提升的百分比與達成期限，例如「一年內提升 20%」" },
      { id: "B", text: "補上模型架構圖、資料處理流程與系統整合方式的說明" },
      { id: "C", text: "補上供應商過往在農業領域的成功案例與客戶名單" },
      { id: "D", text: "以相同口徑量測現況作為基準線，並定義驗收指標、期間與門檻" },
    ],
    answer: "D",
    explanation:
      "沒有基準線就沒有比較的起點——上線後不論結果如何都可以宣稱有改善，也可以被質疑沒有改善。基準、指標、期間、門檻四者齊備，驗收才有客觀依據。",
    choiceExplanations: {
      A: "只寫目標百分比與期限卻沒有現況數值，仍不知道 20% 從哪裡算起，驗收時一樣無法比較。",
      B: "架構圖與流程說明有助理解實作，但缺少它們不會讓成效無法驗證。",
      C: "供應商案例屬於採購參考資訊，與本案成效能否驗收無關。",
    },
    topic: "L21201 AI 導入評估",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["基準線", "驗收標準", "可量測"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      crossNode: "L21202",
      decisionBoundary:
        "若現況根本沒有量測也無法回溯，就必須先安排一段基準期，否則之後任何成效宣稱都無法驗證。",
    },
  },

  // ── L21202 AI 導入規劃（11 題）────────────────────────────────
  {
    id: "senior-ai-tech-practice-q056",
    subjectId: "senior-ai-tech",
    prompt:
      "規劃 AI 專案的階段時，下列哪一種順序最合理？",
    choices: [
      { id: "A", text: "問題定義 → 模型開發 → 資料準備 → 驗證 → 部署 → 監控" },
      { id: "B", text: "資料準備 → 問題定義 → 模型開發 → 驗證 → 部署 → 監控" },
      { id: "C", text: "問題定義 → 資料準備 → 模型開發 → 部署 → 驗證 → 監控" },
      { id: "D", text: "問題定義 → 資料準備 → 模型開發 → 驗證 → 部署 → 監控" },
    ],
    answer: "D",
    explanation:
      "先確定要解決什麼問題與成功標準，才知道要準備什麼資料；資料備妥後開發與驗證，通過後部署，上線後持續監控並回饋到下一輪。順序顛倒會導致做出無人需要的模型。",
    choiceExplanations: {
      A: "先開發模型再準備資料，模型沒有可學習的對象；應先備妥資料再開發。",
      B: "在問題定義之前準備資料，會不知道該蒐集哪些欄位與標籤。",
      C: "先部署再驗證，等於讓未經驗證的模型直接影響實際業務。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["專案階段", "問題定義", "監控"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若專案是既有模型的改版，問題定義與資料準備可以壓縮，但驗證與監控這兩段不能省。",
    },
  },
  {
    id: "senior-ai-tech-practice-q057",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 專案規劃中定義「驗收標準」時，下列寫法何者最恰當？",
    choices: [
      { id: "A", text: "在訓練集上整體準確率不低於 98%，且訓練與驗證損失都持續下降" },
      { id: "B", text: "在獨立測試集上瑕疵類別召回率不低於 95%，且誤報率不高於 5%" },
      { id: "C", text: "使用者試用一個月後，滿意度問卷平均達 4 分以上" },
      { id: "D", text: "模型訓練全程不出錯，且推論延遲低於 200 毫秒" },
    ],
    answer: "B",
    explanation:
      "驗收標準要指明「在什麼資料上、用什麼指標、達到什麼數值」。同時給出召回與誤報兩個方向的門檻，也避免了只顧一邊而讓另一邊崩壞的情況。",
    choiceExplanations: {
      A: "訓練集準確率與損失曲線只反映開發過程中模型記住了多少，無法代表在新資料上的表現；整體準確率也可能掩蓋瑕疵類別抓不到的問題。",
      C: "滿意度可量測但主觀，且沒有指明模型在什麼資料上要達到什麼表現，無法作為模型驗收的技術標準。",
      D: "訓練不出錯與延遲達標只是工程前提，完全不代表模型抓瑕疵的能力。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["驗收標準", "召回率", "誤報率"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若召回與誤報的取捨還沒定案，驗收標準該先寫成「在誤報率 5% 下的召回率」這種曲線上的一點，而不是兩個各自獨立的門檻。",
    },
  },
  {
    id: "senior-ai-tech-practice-q058",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院規劃 AI 導入時安排「先在單一科別試行三個月再擴大」。這種做法的主要好處是下列何者？",
    choices: [
      { id: "A", text: "以真實環境試行取代上線前的模型驗證，縮短時程" },
      { id: "B", text: "讓模型在試行期充分學習，擴大後就不會再出錯" },
      { id: "C", text: "縮小失敗影響範圍，並在擴大前取得真實使用回饋" },
      { id: "D", text: "試行期間由廠商代為操作，可以不必訓練醫護人員" },
    ],
    answer: "C",
    explanation:
      "試行讓問題在可控範圍內先暴露出來——流程卡在哪、使用者會怎麼誤用、實際成效與預期差多少。這些回饋在擴大前修正，成本遠低於全院上線後才發現。",
    choiceExplanations: {
      A: "試行是在真實環境驗證使用情況，並不取代上線前的技術驗證，兩者互補。",
      B: "沒有任何做法能保證模型不出錯，試行的目的是及早發現而非消除錯誤。",
      D: "試行階段反而更需要醫護人員親自操作並接受訓練，才能取得有效的使用回饋。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["試行", "影響範圍", "使用回饋"],
      constraints: ["risk_priority"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若單一科別的作業方式與其他科別差異極大，試行結果就推論不到全院——範圍要小，但仍須具代表性。",
    },
  },
  {
    id: "senior-ai-tech-practice-q059",
    subjectId: "senior-ai-tech",
    prompt:
      "規劃 AI 系統的角色分工時，「領域專家」最主要的貢獻是下列何者？",
    choices: [
      { id: "A", text: "撰寫模型的訓練程式並調整超參數，以持續提升模型準確率" },
      { id: "B", text: "定義問題邊界、判定標註規則與驗證結果是否符合實務" },
      { id: "C", text: "評估雲端與地端方案的成本，並負責採購伺服器" },
      { id: "D", text: "設計資料庫結構與 ETL 流程，確保資料能穩定匯入" },
    ],
    answer: "B",
    explanation:
      "領域專家掌握的是資料科學家沒有的實務知識：哪些情況算異常、標註界線畫在哪、模型的輸出在現場合不合理。缺了這一角，模型很容易學到看似合理卻不符實務的規律。",
    choiceExplanations: {
      A: "撰寫訓練程式與調參是資料科學家或機器學習工程師的職責。",
      C: "成本評估與硬體採購屬於 IT 或採購單位的工作範圍。",
      D: "資料庫與 ETL 設計是資料工程師的專業，與領域知識不同。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["領域專家", "標註規則", "問題邊界"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若判斷標準已由法規逐條寫明、沒有模糊地帶，領域專家的邊際貢獻就下降，重點轉為規則的正確實作。",
    },
  },
  {
    id: "senior-ai-tech-practice-q060",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行規劃導入 AI 客服時，下列哪一項最適合列為專案的風險緩解措施？",
    choices: [
      { id: "A", text: "不揭露系統是 AI，以避免客戶一開始就不信任" },
      { id: "B", text: "設計信心分數低時自動轉真人客服的機制" },
      { id: "C", text: "把所有問題都交給模型回答以最大化自動化率" },
      { id: "D", text: "取消所有客服紀錄，以節省儲存空間與管理成本" },
    ],
    answer: "B",
    explanation:
      "模型不可能對所有問題都有把握，設計「不確定就轉人工」的退場機制，能在維持自動化效益的同時，避免把錯誤答案給到客戶。這是最實用的風險緩解設計。",
    choiceExplanations: {
      A: "隱瞞 AI 身分可能違反揭露要求，也會在出錯時嚴重損害信任。",
      C: "追求 100% 自動化會讓模型硬答不擅長的問題，錯誤與客訴風險大增。",
      D: "客服紀錄是追溯爭議與改善模型的依據，刪除等於放棄事後查核能力。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["信心分數", "轉真人", "風險緩解"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若信心分數本身校準不良（高信心也常錯），這個機制就失效，得先做信心校準或改以規則判斷何時轉人工。",
    },
  },
  {
    id: "senior-ai-tech-practice-q061",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 專案規劃時應同時規劃「資料標註」的哪一項，才能確保標註品質穩定？",
    choices: [
      { id: "A", text: "依標註件數計酬，以提高標註者的產出速度" },
      { id: "B", text: "招募越多標註者越好，以平均掉個人的誤差" },
      { id: "C", text: "標註規範文件與標註者間一致性的檢核機制" },
      { id: "D", text: "選用介面最直覺的標註軟體，減少操作失誤" },
    ],
    answer: "C",
    explanation:
      "標註品質的兩大支柱是「規範寫清楚」與「檢核有沒有做到」。前者讓不同標註者面對相同案例時判斷一致，後者以重疊標註計算一致性指標，及早發現規範模糊之處。",
    choiceExplanations: {
      A: "計件計酬只鼓勵速度，反而可能讓標註者草率判斷，無法確保標準一致。",
      B: "人數多若沒有共同規範，只會引入更多不同的判斷標準；平均無法修正系統性的定義分歧。",
      D: "好用的介面能減少誤點，但無法讓不同標註者對同一案例的判斷標準一致。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["標註規範", "標註者間一致性", "資料品質"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若標註只由單一位領域專家完成，就算不出標註者間一致性，此時要改以重複標註同一批樣本來檢查自身一致性。",
    },
  },
  {
    id: "senior-ai-tech-practice-q062",
    subjectId: "senior-ai-tech",
    prompt:
      "農業團隊規劃模型上線後的維運，下列哪一項最應優先建立？",
    choices: [
      { id: "A", text: "保存預測結果，但只在年度檢討時查看" },
      { id: "B", text: "每月固定更換一次模型架構以保持新鮮" },
      { id: "C", text: "模型效能與資料分布的持續監控與告警" },
      { id: "D", text: "上線後停止蒐集新資料以維持模型穩定" },
    ],
    answer: "C",
    explanation:
      "農業資料有明顯的季節性，模型效能會隨作物週期與天候變化而漂移。持續監控輸入分布與預測品質並設定告警，才能在效能下滑時及時察覺並重訓。",
    choiceExplanations: {
      A: "一年才看一次，季節性漂移造成的效能下滑要拖到整季過後才會被發現。",
      B: "頻繁更換架構會讓系統不穩定，且沒有證據支持每月都需要換。",
      D: "停止蒐集新資料會讓模型無法因應季節變化，也無從重訓。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["效能監控", "分布漂移", "告警"],
      constraints: ["maintainability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若實際收成結果要一整季後才揭曉，效能監控就會嚴重落後，此時要改以輸入分布漂移作為早期警訊。",
    },
  },
  {
    id: "senior-ai-tech-practice-q063",
    subjectId: "senior-ai-tech",
    prompt:
      "規劃 AI 導入的變革管理時，下列哪一項最能降低第一線人員的抗拒？",
    choices: [
      { id: "A", text: "說明 AI 是輔助而非取代，並讓第一線參與設計與試用" },
      { id: "B", text: "上線前一週舉辦全員說明會，介紹系統功能" },
      { id: "C", text: "以節省人力為宣傳重點，強調導入後可精簡各單位的編制" },
      { id: "D", text: "設定使用率 KPI 並與績效考核掛鉤，強制推動使用" },
    ],
    answer: "A",
    explanation:
      "抗拒多半來自不確定感與被取代的恐懼。明確說明定位、讓第一線在設計階段就參與並試用，既能降低疑慮，也能讓系統更貼近實際作業方式。",
    choiceExplanations: {
      B: "單向說明只介紹功能，沒有回應被取代的疑慮，也沒讓第一線參與，抗拒仍在。",
      C: "以精簡編制為訴求等於宣告裁員，會直接激化抗拒，也違背輔助定位的溝通策略。",
      D: "強制掛鉤考核只會讓抗拒轉為表面配合，真實的疑慮與使用問題被掩蓋。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["變革管理", "使用者參與", "定位溝通"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若導入確實會改變人力配置，隱瞞只會讓信任在事後崩潰——此時該做的是誠實說明並提供轉職或再訓練的路徑。",
    },
  },
  {
    id: "senior-ai-tech-practice-q064",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 專案規劃中的「基準模型（Baseline）」最主要的作用是下列何者？",
    choices: [
      { id: "A", text: "提供簡單的比較參考點，判斷複雜模型是否真有增益" },
      { id: "B", text: "作為最終上線的正式模型，以降低後續開發與維運成本" },
      { id: "C", text: "取代測試集，作為評估最終模型泛化能力的主要依據" },
      { id: "D", text: "估算專案所需的運算資源規模，作為決定專案預算的依據" },
    ],
    answer: "A",
    explanation:
      "沒有基準就無法判斷「85% 準確率」到底是好是壞。先用規則法或簡單模型建立基準，複雜模型必須明顯超越它才值得付出額外的複雜度與維運成本。",
    choiceExplanations: {
      B: "基準模型有時確實夠好而直接上線，但那是結果而非它被建立的目的。",
      C: "基準模型與測試集是兩回事：一個是比較對象，一個是評估泛化能力用的資料，不能互相取代。",
      D: "預算與運算資源取決於範疇與資源規劃，與建立基準模型的目的無關。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["基準模型", "增益判斷"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若基準模型的表現已經滿足業務門檻，複雜模型就不必上——基準的另一個用途正是證明「不需要更複雜」。",
    },
  },
  {
    id: "senior-ai-tech-practice-q065",
    subjectId: "senior-ai-tech",
    prompt:
      "教育平台規劃 AI 推薦功能時，決定先以 A/B 測試比較新舊版本。此設計的主要目的是下列何者？",
    choices: [
      { id: "A", text: "讓兩個版本分攤線上流量，以降低單一伺服器的運算負載" },
      { id: "B", text: "以真實流量取代離線評估，省去撰寫單元與整合測試程式" },
      { id: "C", text: "收集兩組使用者的點擊回饋，作為下一輪模型的訓練標籤" },
      { id: "D", text: "在相近的使用者族群上比較兩種版本的實際成效差異" },
    ],
    answer: "D",
    explanation:
      "A/B 測試把使用者隨機分到兩組，讓兩版本在同期、相近族群上比較，排除季節與族群差異的干擾，因此能較可信地歸因成效差異來自版本本身。",
    choiceExplanations: {
      A: "同時運行兩個版本通常增加而非減少資源消耗，分攤負載也不是 A/B 測試的目的。",
      B: "A/B 測試驗證的是成效，程式的正確性仍需要單元與整合測試把關。",
      C: "A/B 測試的產出是成效比較；回饋資料雖可後續利用，但不是此設計的主要目的。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["A/B 測試", "隨機分組", "成效歸因"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若使用者之間會互相影響（例如同班同學共用推薦結果），隨機分組的獨立性假設就不成立，該改以班級為單位分組。",
    },
  },
  {
    id: "senior-ai-tech-practice-q066",
    subjectId: "senior-ai-tech",
    prompt:
      "規劃階段若發現「模型準確率」與「使用者實際採納率」可能不一致，下列做法何者最恰當？",
    choices: [
      { id: "A", text: "同時追蹤技術與業務指標，並以業務指標判定專案成敗" },
      { id: "B", text: "以準確率作為唯一成敗依據，採納率交由宣導處理" },
      { id: "C", text: "以採納率作為唯一指標，模型品質由使用者回報即可" },
      { id: "D", text: "改以專案是否準時、在預算內完成作為成敗依據" },
    ],
    answer: "A",
    explanation:
      "準確率高但沒人用，專案就沒有創造價值；採納率高但預測品質差，反而造成錯誤決策。兩者都要追蹤，而最終成敗應以業務結果認定。",
    choiceExplanations: {
      B: "只看準確率會讓專案在技術上成功、在實務上失敗；採納率低往往反映模型不合用，不是靠宣導就能補上。",
      C: "不主動評估模型品質，可能推廣了一個持續給出錯誤建議的系統，使用者也未必察覺錯誤。",
      D: "時程與預算只反映有沒有準時完成，完全不反映做出來的東西有沒有用。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["技術指標", "業務指標", "成敗認定"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若業務指標的回饋週期長達一年，就必須先以技術指標與短期代理指標把關，不能等一年才知道成敗。",
    },
  },
  {
    id: "senior-ai-tech-practice-q126",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院的 AI 專案在單一科別試行成效良好，擴大到全院後表現明顯下滑。追查發現各科的病歷書寫慣例差異很大。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這是模型容量不足，應改用參數更大的模型以涵蓋各科差異" },
      { id: "B", text: "試行範圍不具代表性，擴大前應評估各科資料異質性並以多科樣本重新驗證" },
      { id: "C", text: "應要求全院統一病歷書寫格式，待格式一致後再重新上線" },
      { id: "D", text: "應退回只服務原本那一科，因為其他科的需求本質不同" },
    ],
    answer: "B",
    explanation:
      "試行的意義在於「小範圍但可推論到全體」。這裡的試行範圍雖小卻不具代表性，成功的結論因此推不出去。正確的處置是先量出各科的異質性，再決定要補樣本、分科建模，還是統一前處理。",
    choiceExplanations: {
      A: "模型再大也補不上訓練時完全沒見過的書寫慣例，問題出在資料代表性而非容量。",
      C: "要求全院改變書寫慣例的推動成本極高，且不應由 AI 專案來承擔。",
      D: "各科需求並非本質不同，差在書寫慣例；退回原科等於放棄擴大的效益，也沒有解決可推論性的問題。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["試行代表性", "資料異質性", "可推論性"],
      constraints: ["data_quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若各科的書寫慣例本來就高度一致，單科試行的結果就能安全推論到全院，擴大前的額外驗證可以精簡。",
    },
  },
  {
    id: "senior-ai-tech-practice-q127",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的 AI 客服規劃驗收標準時，業務端要求「準確率 95% 以上」，技術端指出這無法反映實際體驗。下列改寫何者最合理？",
    choices: [
      { id: "A", text: "改為獨立測試集上的意圖召回率、誤答率與低信心轉真人比例等多項門檻" },
      { id: "B", text: "改為「上線後使用者滿意度達 4 分以上」，以體驗取代準確率" },
      { id: "C", text: "把準確率門檻提高到 99%，以確保使用者體驗" },
      { id: "D", text: "維持 95% 準確率，另在測試集中加入更多常見問題" },
    ],
    answer: "A",
    explanation:
      "單一準確率會讓模型有動機在不確定時硬答。把驗收拆成召回、誤答與轉人工比例三項，就同時綁住了「要抓得到」「不能亂答」「不能什麼都推給人」三個方向，任何一項被犧牲都會被發現。",
    choiceExplanations: {
      B: "滿意度主觀且受許多非模型因素影響，也沒說明在什麼資料上要達到什麼表現，雙方仍難以客觀驗收。",
      C: "提高門檻仍是單一準確率，技術端指出的問題沒有解決，還會讓模型更傾向在不確定時硬答。",
      D: "測試集偏向常見問題只會讓數字更好看，單一準確率無法反映實際體驗的問題依然存在。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["驗收標準", "多指標", "轉人工比例"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若轉人工的成本極低、且客服人力充足，轉人工比例的上限就可以放寬，驗收重心會集中在誤答率。",
    },
  },
  {
    id: "senior-ai-tech-practice-q128",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的 AI 品檢專案由資料科學家獨力完成標註規範，上線後與現場判定屢屢不一致。下列處置何者最能從根本改善？",
    choices: [
      { id: "A", text: "增加訓練輪數並加入資料增強，讓模型對現場影像的變化學得更穩" },
      { id: "B", text: "要求現場人員一律以模型判定為準，以統一全廠的瑕疵判斷標準" },
      { id: "C", text: "由領域專家與現場人員共同界定標註規則，並以重疊標註量測一致性後重標" },
      { id: "D", text: "改用更複雜的模型架構，以捕捉現場判定中的細微差異與例外" },
    ],
    answer: "C",
    explanation:
      "模型學到的就是標註定義的東西。標註規則由不熟悉現場的人單獨制定，模型自然會與現場的實務判準脫節。要修的是規則本身，並用重疊標註把「大家其實看法不同」這件事量出來。",
    choiceExplanations: {
      A: "訓練再久、增強再多，學到的仍是同一套有問題的標註定義。",
      B: "以模型為準等於把錯誤的定義固定下來，現場的專業判斷被否定。",
      D: "架構再複雜也只能更精準地擬合既有標註，無法修正標註本身的定義偏差。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["標註規範", "領域專家", "標註者一致性"],
      constraints: ["data_quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若判定標準已由客戶規格逐條寫明、沒有模糊地帶，不一致就不是定義問題，該回頭查模型或影像品質。",
    },
  },
  {
    id: "senior-ai-tech-practice-q129",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育局的 AI 工具上線後，第一線教師的抗拒明顯。調查顯示教師擔心評分建議會被用來評鑑自己的教學表現。下列處置何者最能對症？",
    choices: [
      { id: "A", text: "以制度明確承諾工具輸出不作為教師考評依據，並讓教師參與調整" },
      { id: "B", text: "舉辦教師研習，加強說明模型的技術原理與準確率，讓教師信任評分建議" },
      { id: "C", text: "要求教師必須使用並納入考評，以盡快累積使用資料" },
      { id: "D", text: "暫停工具並改由教育局統一批改，以消除教師的疑慮" },
    ],
    answer: "A",
    explanation:
      "抗拒的根源不是不懂技術，而是擔心資料被轉用來評鑑自己。這種疑慮只能用制度回應——明確界定用途邊界並落實，再讓使用者參與調整以建立信任。",
    choiceExplanations: {
      B: "技術說明與準確率無法回應「這會不會被拿來考核我」的疑慮。",
      C: "納入考評正好坐實了教師的擔憂，抗拒只會加劇。",
      D: "停用放棄了工具的價值，改由上級統一批改還會加深「被監控」的感受，且問題出在用途界定而非工具本身。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["變革管理", "用途邊界", "使用者信任"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若抗拒的原因其實是建議品質太差、常常評錯，制度承諾就治不了本，該做的是回頭修模型。",
    },
  },
  {
    id: "senior-ai-tech-practice-q130",
    subjectId: "senior-ai-tech",
    prompt:
      "某農業單位規劃模型上線後的維運，但實際收成結果要一整季後才揭曉。下列監控設計何者最合理？",
    choices: [
      { id: "A", text: "不需即時監控，每年收成後以全年資料固定重訓一次即可" },
      { id: "B", text: "只在季末以實際收成量測一次準確率，未達標再重訓" },
      { id: "C", text: "監控伺服器 CPU 使用率與 API 回應時間，任一異常即自動告警" },
      { id: "D", text: "以輸入與預測分布漂移作為早期警訊，季末再用實際收成校準" },
    ],
    answer: "D",
    explanation:
      "標籤延遲一整季時，等真實結果才發現問題已經來不及。分布漂移是可以立即量測的替代訊號——輸入或輸出的分布一變，就先示警；等實際收成回來，再拿來校準效能與重訓。",
    choiceExplanations: {
      A: "沒有監控就不知道何時該重訓，一年的間隔在季節性明顯的農業中太長。",
      B: "季末才量測，中間三個月的錯誤預測已經影響了農務決策。",
      C: "CPU 與回應時間反映系統負載，模型全部答錯時它們可能完全正常。",
    },
    topic: "L21202 AI 導入規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["標籤延遲", "分布漂移監控", "早期警訊"],
      constraints: ["maintainability", "data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Layer Confusion",
      },
      crossNode: "L21302",
      decisionBoundary:
        "若能即時取得部分實際結果（例如提前採收的樣區），就該直接監控準確率，它比分布漂移更靈敏也更直接。",
    },
  },

  // ── L21203 AI 風險管理（11 題）────────────────────────────────
  {
    id: "senior-ai-tech-practice-q067",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行的貸款審核模型上線後被發現對特定郵遞區號的申請人核准率明顯偏低。此現象最可能屬於下列哪一種風險？",
    choices: [
      { id: "A", text: "資料品質不足造成的隨機誤差" },
      { id: "B", text: "模型過擬合造成的效能不穩" },
      { id: "C", text: "資料外洩與隱私侵害" },
      { id: "D", text: "演算法偏見與間接歧視" },
    ],
    answer: "D",
    explanation:
      "郵遞區號常與族群或社經背景高度相關，即使模型沒有直接使用敏感屬性，仍可能透過這種代理變數產生系統性的差別待遇，形成間接歧視。",
    choiceExplanations: {
      A: "隨機誤差會分散在各類申請人身上，不會系統性地集中在特定郵遞區號。",
      B: "過擬合表現為整體泛化變差、結果不穩，而非對特定群體穩定地偏低。",
      C: "隱私風險談的是資料被不當取得或揭露，此案沒有資料流出，問題在判斷結果的差別待遇。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["演算法偏見", "代理變數", "間接歧視"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若核准率差異完全能由還款能力解釋、且條件相同者在各郵遞區號間待遇一致，那就不構成間接歧視——要比的是條件相同的人。",
    },
  },
  {
    id: "senior-ai-tech-practice-q068",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 風險管理中的「風險矩陣」通常以哪兩個維度評估風險等級？",
    choices: [
      { id: "A", text: "偵測難度與修復成本" },
      { id: "B", text: "發生機率與影響程度" },
      { id: "C", text: "資料敏感度與使用者人數" },
      { id: "D", text: "模型準確率與部署規模" },
    ],
    answer: "B",
    explanation:
      "風險矩陣以「多可能發生」與「發生了有多嚴重」兩軸定位每項風險，落在高機率高影響象限者優先處理。這是把有限的緩解資源用在刀口上的標準工具。",
    choiceExplanations: {
      A: "偵測難度是 FMEA 的評分項之一，修復成本屬於緩解規劃；風險矩陣的兩軸是機率與影響。",
      C: "資料敏感度與使用者規模可作為判斷影響程度的素材，但本身不是風險矩陣的兩個維度。",
      D: "準確率與部署規模是系統特性，頂多是評估風險時的輸入資訊，矩陣本身的兩軸是機率與影響。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["風險矩陣", "發生機率", "影響程度"],
      constraints: ["risk_priority"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若某項風險的影響涉及人身安全，即使機率極低也會被提到最優先——安全風險不完全依相乘結果排序。",
    },
  },
  {
    id: "senior-ai-tech-practice-q069",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院導入 AI 判讀後，為避免醫師過度依賴模型建議，下列做法何者最直接？",
    choices: [
      { id: "A", text: "只顯示模型最終結論，隱藏不確定性以免造成醫師困惑" },
      { id: "B", text: "把模型結果設為預設答案，醫師有異議時再手動修改" },
      { id: "C", text: "呈現模型的信心程度與依據，並保留醫師獨立判斷的流程" },
      { id: "D", text: "定期公布模型整體準確率，讓醫師了解系統的可靠度" },
    ],
    answer: "C",
    explanation:
      "自動化偏誤來自「看到答案就照著點」。呈現信心程度與判斷依據，讓醫師知道何時該多看兩眼，並在流程上保留獨立判斷的空間，才能維持人的把關作用。",
    choiceExplanations: {
      A: "隱藏不確定性看似減少干擾，實際上讓醫師無從判斷何時該懷疑模型，反而加重過度依賴。",
      B: "預設答案讓「照著點」成為最省力的路徑，修改反而要多花力氣，正是自動化偏誤的溫床。",
      D: "整體準確率無法告訴醫師眼前這一例是否可靠，對個案層次的過度依賴幫助有限。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["自動化偏誤", "信心呈現", "獨立判斷"],
      constraints: ["safety", "explainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模型的信心分數校準不良，呈現它反而會誤導醫師——先確認分數可信，這個設計才成立。",
    },
  },
  {
    id: "senior-ai-tech-practice-q070",
    subjectId: "senior-ai-tech",
    prompt:
      "關於 AI 系統的「模型漂移（Model Drift）」，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "指模型在訓練過程中損失值反覆震盪、遲遲無法收斂的現象" },
      { id: "B", text: "指資料分布或輸入與答案的關係隨時間改變，使模型效能下降" },
      { id: "C", text: "指模型部署後持續以線上資料更新權重，使參數逐漸偏離原版" },
      { id: "D", text: "指模型在訓練集表現良好、測試集表現卻明顯較差的現象" },
    ],
    answer: "B",
    explanation:
      "漂移分兩種：輸入分布變了（資料漂移），或輸入與正確答案的關係變了（概念漂移）。兩者都會讓當初訓練好的模型逐漸失準，因此上線後必須持續監控。",
    choiceExplanations: {
      A: "損失震盪不收斂是訓練階段的最佳化問題（如學習率過高），漂移則發生在上線之後。",
      C: "多數部署中的模型權重是固定的；漂移指外在資料與關係的改變，而不是模型自己變了。",
      D: "這描述的是過擬合，上線前的評估就看得出來；漂移是上線後隨時間才出現的失準。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["模型漂移", "資料漂移", "概念漂移"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若效能是在某次部署後立刻下降、而非隨時間緩慢衰退，那多半是版本或資料管線問題，不是漂移。",
    },
  },
  {
    id: "senior-ai-tech-practice-q071",
    subjectId: "senior-ai-tech",
    prompt:
      "為降低 AI 系統遭「對抗式攻擊」的風險，下列做法何者最相關？",
    choices: [
      { id: "A", text: "增加訓練資料量並延長訓練輪數，以提升整體準確率" },
      { id: "B", text: "以對抗樣本進行訓練並限制模型輸入的異常值範圍" },
      { id: "C", text: "對模型權重檔加密，防止攻擊者取得模型參數" },
      { id: "D", text: "以 Dropout 等正則化降低過擬合，讓模型不易被擾動" },
    ],
    answer: "B",
    explanation:
      "對抗式攻擊以人眼難以察覺的擾動誘使模型誤判。以對抗樣本納入訓練可提升模型的韌性，輸入端的異常檢查則能擋掉明顯不合理的資料，兩者互補。",
    choiceExplanations: {
      A: "一般資料與更多輪數提升的是平均準確率，對刻意設計的微小擾動沒有針對性，還可能過擬合。",
      C: "加密能提高白箱攻擊的門檻，但攻擊者仍可透過反覆查詢進行黑箱攻擊，模型本身對擾動的韌性並未提升。",
      D: "正則化改善的是對一般雜訊的泛化，對專門瞄準決策邊界設計的對抗擾動效果有限。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["對抗式攻擊", "對抗訓練", "輸入檢查"],
      constraints: ["security"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若攻擊者能直接竄改模型檔案或訓練資料，對抗訓練也擋不住——那是供應鏈與存取控制的問題。",
    },
  },
  {
    id: "senior-ai-tech-practice-q072",
    subjectId: "senior-ai-tech",
    prompt:
      "教育機構使用 AI 評分作文，家長質疑評分不公。下列哪一項最能建立信任？",
    choices: [
      { id: "A", text: "以多位教師的評分訓練模型，確保結果比單一教師更公正" },
      { id: "B", text: "宣稱模型由資料驅動、不受個人情緒影響，因此客觀" },
      { id: "C", text: "公開評分向度與權重，並提供申訴與人工複評管道" },
      { id: "D", text: "公布模型整體準確率，並與人工評分的一致率做比較" },
    ],
    answer: "C",
    explanation:
      "信任來自可檢驗與可救濟。把評分向度與權重講清楚，讓學生知道被評的是什麼；再提供申訴與人工複評，讓錯誤有被糾正的途徑，質疑自然下降。",
    choiceExplanations: {
      A: "多人標註可降低個別評分者的偏差，但家長仍無從檢驗評分依據，也沒有糾正個案的途徑。",
      B: "模型會學到資料中的偏誤，「不受情緒影響」不等於公平，且這種宣稱無從佐證。",
      D: "整體一致率只說明平均表現，無法回答「我這一份為什麼得這個分數」，也沒有救濟管道。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["可檢驗性", "申訴管道", "信任建立"],
      constraints: ["explainability", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若質疑的是「整體對某類學生不利」，公開個別向度就不夠，該提供的是群體層級的評分分布比較。",
    },
  },
  {
    id: "senior-ai-tech-practice-q073",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠的 AI 品檢系統若判斷錯誤導致不良品流出，下列哪一項最應事先明確定義？",
    choices: [
      { id: "A", text: "模型的準確率目標與每月固定的再訓練排程" },
      { id: "B", text: "產線的檢驗抽樣比例與良率統計方式" },
      { id: "C", text: "責任歸屬、異常升級流程與人工介入的時機" },
      { id: "D", text: "模型的訓練資料來源與標註人員名單" },
    ],
    answer: "C",
    explanation:
      "AI 會出錯是必然，事前沒有講清楚誰負責、何時該升級處理、什麼情況必須人工介入，事故發生時就只剩推諉。這些是導入前就該白紙黑字寫下的治理安排。",
    choiceExplanations: {
      A: "準確率目標與重訓排程屬於效能管理，無法回答事故發生時誰負責、該如何處置。",
      B: "抽樣比例與良率統計是品管的量測方式，並未定義 AI 判斷錯誤時的權責與處理流程。",
      D: "資料來源有助於事後追查成因，但不能取代事前約定的責任歸屬與升級流程。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["責任歸屬", "異常升級", "人工介入"],
      constraints: ["governance", "safety"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若品檢只是既有全檢流程之外的輔助提示、不影響出貨判定，責任安排可以簡化——治理強度隨模型在決策鏈中的位置而變。",
    },
  },
  {
    id: "senior-ai-tech-practice-q074",
    subjectId: "senior-ai-tech",
    prompt:
      "關於高風險 AI 應用的治理，下列敘述何者最符合現行國際監理趨勢？",
    choices: [
      { id: "A", text: "依應用場域的風險高低分級管理，高風險應用要求較嚴格" },
      { id: "B", text: "所有 AI 應用一律適用相同強度的規範，以確保公平與一致" },
      { id: "C", text: "依技術類別分級，凡使用深度學習的系統一律列為高風險" },
      { id: "D", text: "以業者自律為主，待發生重大事故後再針對個案立法" },
    ],
    answer: "A",
    explanation:
      "風險分級是當前主流思路：一般應用維持較低的合規負擔，涉及人身安全、基本權利或重大決策的高風險應用，則附加資料治理、文件紀錄、人為監督等義務。",
    choiceExplanations: {
      B: "表面上公平一致，實際上讓低風險應用背負過重成本，高風險應用也可能管得不夠。",
      C: "監理趨勢看的是應用場域與影響，而非技術種類；同樣的深度學習用在遊戲或醫療，風險截然不同。",
      D: "事後個案立法是被動回應，現行趨勢是事前依風險分級設定義務，而非等事故發生。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["風險分級管理", "高風險應用"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若應用被歸為「不可接受風險」，那就不是加嚴要求而是原則禁止——分級的最上層並非只是「管得更嚴」。",
    },
  },
  {
    id: "senior-ai-tech-practice-q075",
    subjectId: "senior-ai-tech",
    prompt:
      "農業保險理賠模型的訓練資料多來自過去三年的乾旱年份。上線後遇到連續豪雨年，模型判斷失準。此問題最貼切的描述是下列何者？",
    choices: [
      { id: "A", text: "訓練資料未涵蓋實際運作時的情境分布" },
      { id: "B", text: "模型過擬合，訓練時的正則化強度不足" },
      { id: "C", text: "理賠規則變更造成的概念漂移" },
      { id: "D", text: "模型容量不足，無法學到天候與災損的關係" },
    ],
    answer: "A",
    explanation:
      "模型只見過乾旱年的樣態，豪雨年的災損型態、理賠金額分布都在它的經驗之外。這是代表性不足的資料造成的泛化失敗，要靠補齊涵蓋各種天候的樣本來解決。",
    choiceExplanations: {
      B: "過擬合在訓練與驗證階段就會出現落差；此處是新情境不在資料中，加強正則化也補不出沒見過的型態。",
      C: "概念漂移指輸入與答案的關係改變，題目中理賠規則並未變動，是天候型態超出了訓練資料的範圍。",
      D: "模型在乾旱年表現正常，代表它學得到既有樣態；失準來自資料沒涵蓋豪雨年，而非容量不足。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["代表性不足", "情境分布", "泛化失敗"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若豪雨年的樣本其實存在、只是被當成離群值濾掉，問題就從涵蓋不足變成前處理把有效訊號刪掉了。",
    },
  },
  {
    id: "senior-ai-tech-practice-q076",
    subjectId: "senior-ai-tech",
    prompt:
      "為降低模型在部署後「悄悄失準」的風險，下列哪一項監控設計最有效？",
    choices: [
      { id: "A", text: "每季由人工抽查一批預測結果，確認準確率是否下降" },
      { id: "B", text: "監控 API 的呼叫次數、錯誤率與回應時間，異常時發出告警" },
      { id: "C", text: "每月以最新資料自動重新訓練模型，不必另外監控" },
      { id: "D", text: "同時監控輸入分布與輸出分布的變化，並設定告警門檻" },
    ],
    answer: "D",
    explanation:
      "失準往往先反映在分布上：輸入的特徵分布偏移、或輸出的類別比例異常。同時監控兩者並設門檻告警，能在使用者抱怨之前就發現問題。",
    choiceExplanations: {
      A: "人工抽查有價值，但每季一次間隔太長、樣本也少，失準可能已影響數月決策才被發現。",
      B: "這些是服務健康指標，模型答錯時 API 仍可能正常回應、零錯誤，悄悄失準完全看不出來。",
      C: "盲目定期重訓無法得知模型何時、為何失準，若新資料本身有問題還會把錯誤學進去。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["分布監控", "告警門檻", "悄悄失準"],
      constraints: ["maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Layer Confusion",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若能即時取得實際答案（例如點擊有無），直接監控準確率會更靈敏——分布監控是答案延遲時的替代方案。",
    },
  },
  {
    id: "senior-ai-tech-practice-q077",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 系統的「可追溯性」要求，最直接的實作方式是下列何者？",
    choices: [
      { id: "A", text: "記錄每次推論的輸入、模型版本、輸出與時間以供回溯" },
      { id: "B", text: "定期匯出模型的整體準確率報表並存檔備查" },
      { id: "C", text: "只保留最終決策結果，以減少儲存與隱私風險" },
      { id: "D", text: "在模型中加入注意力權重視覺化，讓每次判斷都能解釋" },
    ],
    answer: "A",
    explanation:
      "事後要查「那天為什麼判成這樣」，必須能還原當時的輸入、用的是哪一版模型、輸出了什麼。缺少任何一項，爭議就無從釐清，改進也失去依據。",
    choiceExplanations: {
      B: "彙總報表只說明平均表現，無法還原任何一次判斷當下的輸入與模型版本。",
      C: "減少儲存看似合理，但只有結果而不知輸入與模型版本，無法重現與判斷當時的決策是否合理。",
      D: "可解釋性說明「模型看了哪裡」，但若沒留下當次輸入與版本紀錄，事後仍無法回溯是哪一次、哪一版的判斷。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["可追溯性", "推論紀錄", "模型版本"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若輸入含高度敏感個資、不宜長期保存，就要改為保存去識別化後的摘要或雜湊，在可追溯與隱私之間取得平衡。",
    },
  },
  {
    id: "senior-ai-tech-practice-q131",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的 AI 貸款模型上線後，稽核發現對特定郵遞區號的核准率明顯偏低。模型並未使用族裔或性別欄位。下列處置的順序何者最合理？",
    choices: [
      { id: "A", text: "先對該區申請人統一放寬核准門檻，待核准率拉平後再回頭調查差距成因" },
      { id: "B", text: "先移除郵遞區號欄位並重新訓練模型，再觀察各區核准率的差距是否縮小" },
      { id: "C", text: "先比較條件相同者在各區的待遇以確認間接歧視，成立後再從特徵、加權或門檻選擇介入" },
      { id: "D", text: "因模型未使用族裔或性別欄位，先以整體準確率確認模型品質，達標即可結案並留存紀錄" },
    ],
    answer: "C",
    explanation:
      "核准率有差距不必然是歧視——也可能反映真實的還款能力差異。要先比較「條件相同的人」是否待遇一致，確認確實存在間接歧視後，再依模型是否還能重訓來選擇介入的時機與手段。",
    choiceExplanations: {
      A: "未確認問題就先調門檻是掩蓋而非修正；若差距其實反映還款能力，還會製造新的不公平。",
      B: "未確認是否構成歧視就動手，其他特徵仍可能扮演代理變數；差距縮小也不代表問題已解決。",
      D: "未使用敏感欄位不代表沒有間接歧視，這正是無感知即公平的誤解；整體準確率高也說明不了各群體待遇是否一致。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["間接歧視", "代理變數", "公平性介入時機"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若模型已上線且短期內無法重訓，可用的介入就只剩後處理的門檻調整——介入手段受限於模型還能不能動。",
    },
  },
  {
    id: "senior-ai-tech-practice-q132",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院的 AI 判讀系統誤判導致醫療爭議。院方檢討時發現無法還原當時使用的是哪一版模型、輸入了什麼。下列改善何者最關鍵？",
    choices: [
      { id: "A", text: "改用經外部資料驗證、準確率更高的新版模型，並請廠商出具效能報告以降低誤判機率" },
      { id: "B", text: "建立每次推論的完整紀錄（輸入、版本、輸出、時間、操作者），並綁定程式碼與資料版本" },
      { id: "C", text: "保存每次推論的輸出結果與時間戳記，並擴充伺服器儲存空間以延長紀錄保存年限" },
      { id: "D", text: "導入 SHAP 等可解釋性工具，讓醫師在每次判讀時都能看到模型的判斷依據與重要特徵" },
    ],
    answer: "B",
    explanation:
      "爭議發生時要回答的是「那一天為什麼判成這樣」。缺少輸入、版本與輸出的對應紀錄，責任與改進都無從談起；而只有版本號還不夠，程式碼與訓練資料也要一併固定才重現得出來。",
    choiceExplanations: {
      A: "更準的模型仍會出錯，效能報告也無助於還原已發生的個案或釐清責任。",
      C: "只有輸出與時間而缺少輸入與模型版本，仍無法還原當時的判斷；儲存空間只是實作條件。",
      D: "可解釋性工具幫助當下理解，但若沒有輸入與版本紀錄，事後仍無法重現爭議個案。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["可追溯性", "版本綁定", "可重現性"],
      constraints: ["governance", "safety"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      crossNode: "L21302",
      decisionBoundary:
        "若輸入含高度敏感的完整病歷、不宜長期保存，就要改存去識別化後的摘要或雜湊，在可追溯與隱私之間取得平衡。",
    },
  },
  {
    id: "senior-ai-tech-practice-q133",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的 AI 品檢模型上線後，操作員逐漸養成「模型說good就直接放行」的習慣，即使肉眼可見異常也不再攔下。下列處置何者最能對症？",
    choices: [
      { id: "A", text: "持續提高模型準確率並擴充訓練樣本，讓操作員即使直接放行也不致造成品質問題" },
      { id: "B", text: "要求操作員每次放行前都要在系統上點選確認，並記錄點選時間供主管抽查" },
      { id: "C", text: "隱藏模型的信心分數以免干擾判斷，改由操作員全數人工複檢每一件產品" },
      { id: "D", text: "呈現模型信心與依據、保障操作員否決權並留紀錄，再以不定期盲測檢驗警覺度" },
    ],
    answer: "D",
    explanation:
      "這是自動化偏誤：人看到答案就不再獨立判斷。要讓人重新進入迴圈，得同時做三件事——讓人知道模型有多確定、保障否決權不被責難、並用盲測讓警覺度可被量測與維持。",
    choiceExplanations: {
      A: "準確率再高仍會出錯，問題在於人已經不看了；這只會讓自動化偏誤更難被察覺。",
      B: "多一個確認按鈕很快會變成反射動作，既沒提供判斷所需的資訊，也量不到人的警覺度。",
      C: "隱藏不確定性讓人失去判斷何時該懷疑的線索；全數人工複檢則抵銷導入 AI 的效益，也難以持續。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["自動化偏誤", "信心呈現", "盲測"],
      constraints: ["safety", "quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若模型的信心分數本身校準不良，呈現它反而會誤導操作員——先確認分數可信，這個設計才成立。",
    },
  },
  {
    id: "senior-ai-tech-practice-q134",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育平台的 AI 推薦系統被發現會把資源集中推給少數已經表現優異的學生。追查發現模型以點擊率為訓練目標，而點擊回饋又成為下一輪的訓練資料。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這代表模型正確識別了優秀學生，資源集中是以點擊率最佳化下的合理結果" },
      { id: "B", text: "這是資料漂移造成的偏誤，以最新一期的點擊資料重新訓練模型即可修正" },
      { id: "C", text: "這是回饋迴路造成的偏誤自我強化，應以未受點擊污染的資料評估，並保留探索比例" },
      { id: "D", text: "這是類別不平衡問題，應對表現優異學生的樣本降採樣後再重新訓練模型" },
    ],
    answer: "C",
    explanation:
      "模型推給誰、誰才有機會點擊，點擊又回頭成為訓練資料——這條迴路會讓初始的微小偏好被不斷放大。打破它需要兩件事：用不受污染的資料評估真實效果，以及在推薦中保留探索的比例。",
    choiceExplanations: {
      A: "沒有被推薦的學生根本沒有機會產生點擊，點擊差異是推薦本身造成的，不能推論為他們表現較差。",
      B: "最新的點擊資料本身就是被迴路污染的產物，重訓只會把已放大的偏誤再學一次，迴路並未切斷。",
      D: "降採樣處理的是靜態的類別比例，迴路仍會在下一輪把偏好放大；根源在於點擊回饋成為訓練資料。",
    },
    topic: "L21203 AI 風險管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["回饋迴路", "偏誤放大", "探索保留"],
      constraints: ["fairness", "data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若推薦結果不會回流成為訓練資料（例如每期都用固定的外部評估集重訓），迴路就被切斷，偏誤不會自我放大。",
    },
  },

  // ── L21301 數據準備與模型選擇（11 題）──────────────────────────
  {
    id: "senior-ai-tech-practice-q078",
    subjectId: "senior-ai-tech",
    prompt:
      "在切分訓練集與測試集時，若資料具有時間序列性質（例如以歷史交易預測未來），下列做法何者最正確？",
    choices: [
      { id: "A", text: "以分層抽樣切分，確保訓練與測試的目標比例一致" },
      { id: "B", text: "完全隨機打散後切分，讓兩邊的資料分布最相近" },
      { id: "C", text: "使用一般的 K 折交叉驗證，以多次切分的平均作為效能" },
      { id: "D", text: "依時間切分，以較早的資料訓練、較晚的資料測試" },
    ],
    answer: "D",
    explanation:
      "時間序列若隨機切分，訓練集會包含測試期之後的資訊，等於讓模型「看過未來」，評估結果會過度樂觀。依時間切分才能模擬真正上線時「只有過去可用」的情境。",
    choiceExplanations: {
      A: "分層抽樣能維持類別比例，但仍會讓訓練集混入測試期之後的資料，等於讓模型看過未來。",
      B: "分布相近看似公平，卻讓訓練集含有測試期之後的資訊，測得的效能上線時無法重現。",
      C: "一般 K 折會隨機分折，同樣讓未來的資料進入訓練；時間序列需改用依時間滾動的驗證方式。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["時間切分", "資訊洩漏", "時間序列"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Wrong Trade-off",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若各筆交易彼此獨立、且模型不預測時間趨勢而只做橫斷面分類，隨機切分就重新適用。",
    },
  },
  {
    id: "senior-ai-tech-practice-q079",
    subjectId: "senior-ai-tech",
    prompt:
      "資料前處理時發現某欄位有 40% 的缺失值，且缺失與否本身與目標高度相關。下列處理何者最不恰當？",
    choices: [
      { id: "A", text: "新增一個「是否缺失」的指示欄位並保留原欄位的填補值" },
      { id: "B", text: "直接以整體平均值填補缺失，且不另做任何標記" },
      { id: "C", text: "評估是否有其他欄位可以推估該值，例如以迴歸填補" },
      { id: "D", text: "與領域專家確認缺失的成因與資料蒐集流程" },
    ],
    answer: "B",
    explanation:
      "既然缺失本身帶有資訊（與目標相關），無標記地填平均值等於把這個訊號抹掉，還讓模型誤以為那是真實量測值。正確做法是保留「缺失」這個事實作為特徵。",
    choiceExplanations: {
      A: "新增指示欄位正是保留缺失訊號的標準做法，恰當。",
      C: "以其他欄位推估比單純填平均更能保留資訊，值得評估，屬於恰當做法。",
      D: "釐清缺失成因與蒐集流程，往往能直接指出資料品質的問題，是必要步驟。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Incorrect Statement",
      concepts: ["缺失值", "缺失指示欄位", "資訊保留"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 B 改成「以平均值填補並同時新增缺失指示欄位」，它就成為可接受的做法。",
    },
  },
  {
    id: "senior-ai-tech-practice-q080",
    subjectId: "senior-ai-tech",
    prompt:
      "下列哪一種情況最需要對特徵進行標準化或正規化？",
    choices: [
      { id: "A", text: "所有特徵的單位與數值量級本來就完全相同的資料集" },
      { id: "B", text: "使用隨機森林等樹模型，而且各特徵的數值跨越好幾個數量級" },
      { id: "C", text: "使用 KNN 等基於距離的演算法或以梯度下降訓練的模型" },
      { id: "D", text: "特徵中包含大量類別型欄位，且已完成 one-hot 編碼" },
    ],
    answer: "C",
    explanation:
      "距離型演算法會被大尺度特徵主導，梯度下降在各維度尺度懸殊時收斂緩慢。這兩類情況都必須先把特徵縮放到相近的尺度。",
    choiceExplanations: {
      A: "單位與量級本來就一致時，縮放帶來的效益有限。",
      B: "樹模型依單一特徵的門檻切分，對單調縮放不敏感；數量級懸殊本身不影響切分結果，通常不需要標準化。",
      D: "one-hot 編碼後的值本來就只有 0 與 1，尺度已經一致，縮放的必要性不高。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["特徵縮放", "距離型演算法", "梯度下降"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若在決策樹之前先做 PCA 這類依變異運作的轉換，縮放又變成必要——要看的是整條管線，不只是最後那個模型。",
    },
  },
  {
    id: "senior-ai-tech-practice-q081",
    subjectId: "senior-ai-tech",
    prompt:
      "某分類任務的正負樣本比例為 1:99。下列哪一組評估指標最能反映模型對少數類別的偵測能力？",
    choices: [
      { id: "A", text: "整體準確率與加權平均的 F1 分數" },
      { id: "B", text: "少數類別的精確率、召回率與 F1" },
      { id: "C", text: "ROC 曲線下面積與整體準確率" },
      { id: "D", text: "多數類別的精確率、召回率與特異度" },
    ],
    answer: "B",
    explanation:
      "極度不平衡時，全部猜多數類別就有 99% 準確率。要看模型對少數類別到底抓到多少、抓對多少，必須看該類別的精確率、召回率與兩者的調和平均 F1。",
    choiceExplanations: {
      A: "整體準確率在此失去鑑別力；加權平均 F1 以樣本數加權，會被佔 99% 的多數類別主導。",
      C: "ROC-AUC 在極度不平衡時容易顯得過度樂觀，搭配整體準確率仍難以看出少數類別抓到多少。",
      D: "這些衡量的是對多數類別的判斷，多數類別本來就容易判對，與少數類別有沒有被抓到無直接關係。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["類別不平衡", "精確率", "召回率", "F1"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若正負類別的錯誤成本相當、比例也接近，整體準確率就重新是有效的摘要指標。",
    },
  },
  {
    id: "senior-ai-tech-practice-q082",
    subjectId: "senior-ai-tech",
    prompt:
      "在模型選擇時，若專案要求「能向監理機關說明每一筆判斷的依據」，下列哪一類模型通常最容易滿足？",
    choices: [
      { id: "A", text: "能以自然語言產生理由說明的大型語言模型" },
      { id: "B", text: "邏輯迴歸或決策樹等本質上可解釋的模型" },
      { id: "C", text: "搭配 SHAP 事後解釋的深度神經網路" },
      { id: "D", text: "在各項指標上準確率最高的梯度提升集成模型" },
    ],
    answer: "B",
    explanation:
      "邏輯迴歸的係數與決策樹的分支路徑本身就是可讀的判斷依據，不需額外的解釋工具即可向監理者說明。在受監理場域，這種內建的可解釋性往往比幾個百分點的準確率更重要。",
    choiceExplanations: {
      A: "LLM 產生的說明不一定反映真實的判斷過程，同一輸入也可能給出不同說明，難以作為監理依據。",
      C: "SHAP 等事後解釋只是近似，需要額外工具且結果可能不穩定，不如本質可解釋的模型直接。",
      D: "集成數百棵樹讓決策路徑難以逐筆追溯，準確率高不代表能說明每一筆的依據。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["本質可解釋模型", "監理要求"],
      constraints: ["explainability", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若監理只要求「說明整體使用了哪些因子與方向」，複雜模型搭配事後解釋工具也可能過關——解釋的粒度決定模型選擇。",
    },
  },
  {
    id: "senior-ai-tech-practice-q083",
    subjectId: "senior-ai-tech",
    prompt:
      "資料準備時發現訓練資料中包含了「模型上線後不可能取得」的欄位（例如結案後才填寫的欄位）。若直接使用會造成下列哪一種問題？",
    choices: [
      { id: "A", text: "過擬合（Overfitting），模型記住訓練樣本的雜訊" },
      { id: "B", text: "資料漂移（Data Drift），上線後輸入分布逐漸改變" },
      { id: "C", text: "資料洩漏（Data Leakage），離線效能虛高但上線後失效" },
      { id: "D", text: "共線性（Multicollinearity），係數估計變得不穩定" },
    ],
    answer: "C",
    explanation:
      "這類欄位帶有答案的資訊，模型會學會依賴它，離線評估看起來極好；但上線時這個欄位還不存在，模型立刻失去依據。這是資料洩漏最典型的形式。",
    choiceExplanations: {
      A: "過擬合通常表現為訓練與驗證有落差；此處離線驗證也很好看，原因是欄位本身帶有答案。",
      B: "漂移是上線後分布隨時間改變；這裡的欄位從一開始就取不到，問題在建模時就已存在。",
      D: "共線性來自特徵彼此高度相關，與欄位能否在上線時取得無關。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料洩漏", "未來資訊", "離線效能虛高"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若該欄位在預測時點之前就會填寫完成，它就是合法特徵——判準是「預測當下取不取得到」，不是欄位的名稱。",
    },
  },
  {
    id: "senior-ai-tech-practice-q084",
    subjectId: "senior-ai-tech",
    prompt:
      "使用 K 折交叉驗證（K-Fold Cross Validation）的主要目的是下列何者？",
    choices: [
      { id: "A", text: "透過重複抽樣產生新樣本，等同增加訓練資料的總量" },
      { id: "B", text: "訓練多個模型並平均其預測以降低變異，提升最終上線模型的準確率" },
      { id: "C", text: "在資料有限時取得較穩定的效能估計，降低單次切分的運氣" },
      { id: "D", text: "讓測試集也輪流參與訓練，以充分利用全部的標註資料" },
    ],
    answer: "C",
    explanation:
      "單次切分的結果會受到那一次剛好分到哪些樣本影響。K 折輪流讓每一折當驗證集，取平均後的估計較不受單次運氣左右，在資料量有限時尤其重要。",
    choiceExplanations: {
      A: "交叉驗證只是輪流重複使用同一批資料，並沒有產生新樣本；增加資料量是資料增強的概念。",
      B: "這描述的是集成學習（如 bagging）；K 折的平均是針對效能估計，不是把 K 個模型的預測合併上線。",
      D: "K 折中每一折擔任驗證時都不參與該輪訓練；最終的獨立測試集更不應參與任何一輪。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["K折交叉驗證", "效能估計穩定性"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若資料量本來就很大、單次切分的估計已經夠穩定，K 折多花的數倍訓練時間就不划算。",
    },
  },
  {
    id: "senior-ai-tech-practice-q085",
    subjectId: "senior-ai-tech",
    prompt:
      "農業團隊要預測「明年某田區的產量（公斤）」。此任務屬於下列何者？",
    choices: [
      { id: "A", text: "迴歸" },
      { id: "B", text: "二元分類" },
      { id: "C", text: "多類別分類" },
      { id: "D", text: "分群" },
    ],
    answer: "A",
    explanation:
      "輸出是連續數值（公斤）而非有限類別，屬於迴歸任務，評估上應使用 MAE、RMSE 這類誤差指標而非準確率。",
    choiceExplanations: {
      B: "二元分類的輸出只有兩種類別，無法表示連續的產量數值。",
      C: "多類別分類仍是離散標籤，除非硬把產量分箱，否則不符合原始需求。",
      D: "分群是非監督任務，用於找出資料的自然分組，不做數值預測。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["迴歸", "連續型目標"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若業務只需要知道「產量是否低於警戒線」，改成二元分類反而更貼近決策，評估指標也跟著換。",
    },
  },
  {
    id: "senior-ai-tech-practice-q086",
    subjectId: "senior-ai-tech",
    prompt:
      "工廠的感測資料取樣頻率極高，直接建模導致訓練成本過高。下列哪一種資料準備手段最直接？",
    choices: [
      { id: "A", text: "以時間窗聚合特徵（如每分鐘平均、最大值、標準差）" },
      { id: "B", text: "把數值從 64 位元浮點數轉為 16 位元以降低記憶體用量" },
      { id: "C", text: "以 PCA 把所有感測欄位壓縮成少數幾個主成分後再建模" },
      { id: "D", text: "隨機抽出一成的時間點作為訓練樣本，其餘資料直接捨棄" },
    ],
    answer: "A",
    explanation:
      "以時間窗聚合能在大幅降低樣本數的同時保留訊號的統計特性（水準、波動、極值），是處理高頻感測資料最常用的降維手段。",
    choiceExplanations: {
      B: "降低精度能省記憶體，但樣本數不變，訓練成本的主因（筆數過多）沒有被處理，還可能丟失細微變化。",
      C: "PCA 減少的是欄位數，高頻取樣造成的是筆數過多；樣本數不變，訓練成本仍高。",
      D: "隨機抽點雖能降低筆數，但會丟失時間點之間的波動與極值，不如聚合能保留訊號的統計特性。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時間窗聚合", "高頻資料", "降維"],
      constraints: ["compute", "data_volume"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若要偵測的正是毫秒級的瞬間尖峰，往分鐘聚合會把訊號抹平——聚合粒度必須比要偵測的現象更細。",
    },
  },
  {
    id: "senior-ai-tech-practice-q087",
    subjectId: "senior-ai-tech",
    prompt:
      "教育平台要預測學生是否會在課程中途退出。標籤定義為「連續 14 天未登入」。此定義最需要注意的是下列何者？",
    choices: [
      { id: "A", text: "標籤應改為迴歸目標，預測學生還會再登入幾天較精確" },
      { id: "B", text: "最需注意類別不平衡，應先把退出樣本過採樣到與未退出相同數量" },
      { id: "C", text: "14 天門檻越短越好，可以讓模型越早發出退出預警" },
      { id: "D", text: "標籤定義須與業務認知一致，且不可用到預測時點之後的資訊" },
    ],
    answer: "D",
    explanation:
      "標籤定義決定模型到底在學什麼。若業務認定的退出與此定義不同，模型再準也解錯了題；若計算標籤時用到了預測時點之後的資料，則會造成資料洩漏。",
    choiceExplanations: {
      A: "是否退出本質是二元事件，改成預測天數是換了問題，也沒處理標籤定義是否正確與是否洩漏。",
      B: "不平衡是建模時可處理的技術問題，但標籤若定義錯或用到未來資訊，再怎麼平衡也是學錯目標。",
      C: "門檻縮短會把暫時休息的學生也標成退出，標籤與業務認知脫節；門檻該依業務定義決定，不是越短越好。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["標籤定義", "業務認知", "時點限制"],
      constraints: ["data_quality", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若業務關心的是「會不會續報下一期」而非中途停用，標籤就該改成續報與否——標籤定義一變，等於換了一個題目。",
    },
  },
  {
    id: "senior-ai-tech-practice-q088",
    subjectId: "senior-ai-tech",
    prompt:
      "醫療團隊要從一萬筆病歷中挑選訓練樣本。若直接取「最容易取得的一千筆」，最可能引入下列哪一種問題？",
    choices: [
      { id: "A", text: "選樣偏誤，使樣本無法代表真實母體" },
      { id: "B", text: "樣本數不足，導致模型變異過大而過擬合" },
      { id: "C", text: "類別不平衡，使少數疾病的樣本比例偏低" },
      { id: "D", text: "標註雜訊，因為容易取得的病歷品質較差" },
    ],
    answer: "A",
    explanation:
      "「最容易取得」往往與某些特徵有系統性關聯（例如來自同一科別、同一時期），取出的樣本因此偏離真實母體分布，模型學到的規律無法推廣到其他病患。",
    choiceExplanations: {
      B: "一千筆不算少，且就算數量充足，「最容易取得」的取法仍會讓樣本偏離母體；問題在怎麼選而非選多少。",
      C: "不平衡可能是結果之一，但核心是取樣方式帶來的系統性偏離，而且偏離不只發生在類別比例上。",
      D: "容易取得不代表標註品質差；即使標註完全正確，樣本仍可能無法代表真實母體。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["選樣偏誤", "母體代表性"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若這一千筆是以分層隨機抽樣取得、各科別與時期比例與母體一致，取樣的便利性就不再造成偏誤。",
    },
  },
  {
    id: "senior-ai-tech-practice-q135",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院的再入院預測模型以隨機切分建立訓練與測試集，AUC 達 0.91。上線後大幅下滑。已知同一位病患在資料中常有多次住院紀錄。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "測試集的病患組成與上線後不同，應改用最近一年的資料重新隨機切分" },
      { id: "B", text: "模型過擬合訓練資料，應加強正則化並減少參數量後重新訓練" },
      { id: "C", text: "同一病患紀錄跨訓練與測試造成洩漏，應改以病患為單位切分並重新評估" },
      { id: "D", text: "AUC 在不平衡資料下容易失真，應改用精確率與召回率在原測試集上重新評估" },
    ],
    answer: "C",
    explanation:
      "同一位病患的多次紀錄高度相關，隨機切分會讓模型在測試時遇到「這個人它已經見過」。若目標是預測新病患，切分就必須以病患為單位，否則測得的分數在上線時完全無法重現。",
    choiceExplanations: {
      A: "只換資料期間而仍隨機切分紀錄，同一病患照樣會跨訓練與測試兩邊，洩漏依舊存在。",
      B: "隨機切分的測試集同樣被洩漏墊高，0.91 本身就不可信；調整模型無法修正評估方式的錯誤。",
      D: "換指標不會消除資訊洩漏，在同一病患橫跨兩邊的原測試集上，任何指標都會被高估。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["群組切分", "資訊洩漏", "相關樣本"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "L21201",
      decisionBoundary:
        "若目標是預測「同一位病患的下次住院」而非推廣到新病患，依時間切分同一人的紀錄反而才是正確設計。",
    },
  },
  {
    id: "senior-ai-tech-practice-q136",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的風控模型有上千個候選特徵，其中不少彼此高度相關。若需求同時包含「向監理說明個別特徵的影響方向」與「控制推論延遲」，下列處理何者最合理？",
    choices: [
      { id: "A", text: "先以相關性與領域知識收斂特徵、處理共線性，再選用本質可解釋的輕量模型" },
      { id: "B", text: "保留全部特徵並改用深層網路，再以 SHAP 說明個別特徵的影響方向" },
      { id: "C", text: "保留全部上千個特徵訓練邏輯迴歸，並以 L2 正則化穩定係數" },
      { id: "D", text: "以主成分分析降維後建模，再向監理說明各主成分的影響方向" },
    ],
    answer: "A",
    explanation:
      "共線性會讓係數不穩甚至符號反轉，「說明影響方向」因此失真；上千特徵也讓推論變重。先收斂特徵並處理共線性，再用可解釋模型，才能同時滿足說明與延遲兩項限制。",
    choiceExplanations: {
      B: "SHAP 是事後近似，共線性下的歸因也不穩定；上千特徵的深層網路延遲更高，兩項限制都沒解決。",
      C: "L2 能壓抑係數震盪，但共線性特徵之間的影響仍會互相分攤、難以說明方向，上千特徵也未處理延遲。",
      D: "主成分是原始特徵的線性組合，延遲雖降了，卻失去可向監理說明的個別特徵意義。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["特徵收斂", "共線性", "可解釋模型"],
      constraints: ["explainability", "latency", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "L21203",
      decisionBoundary:
        "若監理只要求說明整體使用了哪些因子，主成分搭配載荷分析也可能過關——要求的解釋粒度決定了處理方式。",
    },
  },
  {
    id: "senior-ai-tech-practice-q137",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠的模型訓練資料中，「最終品質等級」欄位是產品出貨檢驗後才填寫，而模型要在製程中途預測品質。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "該欄位與目標高度相關，是最重要的預測因子，應轉為類別型特徵以提升解釋力" },
      { id: "B", text: "應保留該欄位，但訓練時先標準化並以正則化降低其權重，避免模型過度依賴" },
      { id: "C", text: "應保留該欄位，上線時改以同型號產品的歷史平均品質等級填補即可" },
      { id: "D", text: "該欄位實為標籤，作為輸入即構成洩漏；應盤點各欄位的產生時點，只留預測前可得者" },
    ],
    answer: "D",
    explanation:
      "這個欄位就是要預測的答案本身，把它放進輸入等於給模型看考卷。真正該做的是逐欄位盤點產生時點——這個檢查一次做完，能一併找出其他同樣在預測後才產生的欄位。",
    choiceExplanations: {
      A: "相關性高正是因為它就是答案，轉換型別不改變上線時取不到它的事實。",
      B: "標準化與正則化只改尺度與權重，答案仍在輸入裡；上線時取不到它，模型照樣失去依據。",
      C: "以歷史平均填補等於給同型號產品同一個值，模型依賴的訊號消失，上線表現會崩落，離線評估也仍虛高。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料洩漏", "欄位產生時點", "標籤與特徵"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      crossNode: "L21202",
      decisionBoundary:
        "若製程中途就有一份初步品質評等可取得，它就是合法特徵——判準是預測當下取不取得到。",
    },
  },
  {
    id: "senior-ai-tech-practice-q138",
    subjectId: "senior-ai-tech",
    prompt:
      "某農業團隊的訓練資料中，特定品種的樣本僅佔 2%，而該品種正是最需要準確預測的對象。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以 SMOTE 對所有品種一律過採樣到相同數量，再以整體準確率驗收" },
      { id: "B", text: "補充該品種樣本或重新加權提高其損失比重，並以分群評估單獨檢視其表現" },
      { id: "C", text: "維持原資料分布訓練，並以整體準確率達 95% 作為驗收標準" },
      { id: "D", text: "把該品種併入最相近的品種一起訓練，以擴大可用的樣本數" },
    ],
    answer: "B",
    explanation:
      "佔比 2% 的類別會被整體損失淹沒，模型幾乎不會為它調整。補樣本或加權能讓它重新被看見，而分群評估則確保改善有沒有真的發生——否則整體指標好看，它仍然是被犧牲的那一群。",
    choiceExplanations: {
      A: "過採樣方向沒錯，但所有品種一律拉平並非針對性處置，只看整體準確率也看不出該品種是否真的改善。",
      C: "整體準確率會被 98% 的其他品種主導，即使該品種全部預測錯誤也能達標。",
      D: "樣本數雖然變多，但該品種的獨特特徵被抹平，模型學到的是相近品種的規律，預測反而更不準。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["類別不平衡", "重新加權", "分群評估"],
      constraints: ["data_quality", "fairness"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若該品種在現實中就極為罕見、樣本無從補充，就只能改以重新加權並明確標示模型在該品種上的適用限制。",
    },
  },

  // ── L21302 AI 技術系統集成與部署（12 題）──────────────────────
  {
    id: "senior-ai-tech-practice-q089",
    subjectId: "senior-ai-tech",
    prompt:
      "把訓練好的模型包成 REST API 供其他系統呼叫，最主要的好處是下列何者？",
    choices: [
      { id: "A", text: "API 會自動記錄所有請求，因此不必另外建置模型監控" },
      { id: "B", text: "透過 HTTP 傳輸可壓縮模型權重，使推論速度明顯提升" },
      { id: "C", text: "呼叫端不需知道模型實作細節，模型可獨立更新與擴展" },
      { id: "D", text: "呼叫端可直接存取模型參數與訓練資料，方便各系統自行微調" },
    ],
    answer: "C",
    explanation:
      "以 API 封裝形成清楚的界面：呼叫端只送輸入、收結果，內部換模型、換框架、加機器都不影響它們。這種解耦是模型能持續迭代的前提。",
    choiceExplanations: {
      A: "請求紀錄只是原始資料，效能監控仍需另外設計，且多個系統依賴後監控只會更重要。",
      B: "封裝方式不改變模型本身的運算量，透過 HTTP 呼叫反而多了網路往返的開銷。",
      D: "這與 API 封裝的精神相反——API 的價值正是把實作細節藏起來，呼叫端不該接觸模型內部。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["REST API", "解耦", "獨立更新"],
      constraints: ["maintainability"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若呼叫端與模型必須共用同一份大型輸入資料、且延遲要求極嚴，行程內的函式庫呼叫會比跨網路的 API 更合適。",
    },
  },
  {
    id: "senior-ai-tech-practice-q090",
    subjectId: "senior-ai-tech",
    prompt:
      "以容器（Container）部署 AI 服務的主要理由是下列何者？",
    choices: [
      { id: "A", text: "把執行環境與相依套件一起打包，確保各環境行為一致" },
      { id: "B", text: "容器會自動配置 GPU 資源，讓模型推論速度大幅提升" },
      { id: "C", text: "容器之間完全隔離，部署後即可免除映像檔的資安檢查" },
      { id: "D", text: "把模型轉成跨平台格式（如 ONNX），使任何框架都能載入" },
    ],
    answer: "A",
    explanation:
      "AI 服務對套件版本極為敏感，開發機能跑、正式機掛掉是常態。容器把 Python 版本、函式庫與系統相依一起封裝，讓「在我機器上可以跑」變成「在哪都可以跑」。",
    choiceExplanations: {
      B: "容器需要另外設定才能存取 GPU，且不會改變模型本身的運算量或推論速度。",
      C: "容器隔離並不完整，映像檔漏洞、權限設定仍需定期檢查，不會免除資安考量。",
      D: "這描述的是模型交換格式，解決的是框架相容；容器解決的是整個執行環境與相依套件的一致性。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["容器", "環境一致性", "相依打包"],
      constraints: ["maintainability"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若服務需要直接存取特定硬體驅動（例如某些 GPU 或工控卡），容器化的隔離反而增加設定複雜度。",
    },
  },
  {
    id: "senior-ai-tech-practice-q091",
    subjectId: "senior-ai-tech",
    prompt:
      "銀行要把新版模型上線但擔心影響既有服務，下列哪一種部署策略最能降低風險？",
    choices: [
      { id: "A", text: "選在離峰時段直接全量切換，出問題再連夜修復" },
      { id: "B", text: "灰度發布：先導入少量流量，確認指標正常再逐步放大" },
      { id: "C", text: "先在測試環境以歷史資料完整驗證，通過後即可全量上線" },
      { id: "D", text: "先停用舊模型以釋放資源，再部署新模型承接全部流量" },
    ],
    answer: "B",
    explanation:
      "灰度發布讓新模型先服務一小部分流量，若指標異常可立刻回退，受影響範圍極小。這是把「上線」從一次性賭注變成可控實驗的標準做法。",
    choiceExplanations: {
      A: "離峰切換只減少當下受影響的人數，一旦新模型有問題，隔天所有使用者都會受影響，也沒有回退緩衝。",
      C: "離線驗證必要但不足，真實流量的分布與邊界情況常與歷史資料不同，全量上線仍是一次性賭注。",
      D: "先停舊模型會讓回退變得不可能，是風險最高的操作順序。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["灰度發布", "流量切分", "回退"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若新舊模型的成效指標要數週後才揭曉，灰度期間看不出差異，就得改以離線回測搭配影子模式先行驗證。",
    },
  },
  {
    id: "senior-ai-tech-practice-q092",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 服務上線後應保留「模型版本」資訊的主要原因是下列何者？",
    choices: [
      { id: "A", text: "問題發生時可以判斷是哪一版造成，並支援回退與稽核" },
      { id: "B", text: "讓推論服務依版本自動選用最佳化的運算路徑以降低延遲" },
      { id: "C", text: "讓新版模型能自動繼承舊版的權重，節省重新訓練的成本" },
      { id: "D", text: "讓使用者可以自行挑選偏好的模型版本，以提高使用滿意度" },
    ],
    answer: "A",
    explanation:
      "沒有版本資訊，同一筆錯誤預測就無從判斷是哪一版模型產生的，回退與究責都失去依據。版本紀錄是模型維運與稽核的最基本要求。",
    choiceExplanations: {
      B: "版本資訊只是中繼資料，延遲取決於模型與資源配置，不會因標記版本而改變。",
      C: "是否沿用舊權重是訓練策略的選擇，與在服務中保留版本資訊無關。",
      D: "版本資訊主要供維運與稽核使用，讓使用者自選版本反而造成結果不一致並增加管理負擔。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["模型版本", "回退", "稽核"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "光有版本號還不夠——若該版本的程式碼與訓練資料沒有一併固定，同一個版本號也重現不出當初的模型。",
    },
  },
  {
    id: "senior-ai-tech-practice-q093",
    subjectId: "senior-ai-tech",
    prompt:
      "醫院要把模型部署在院內而非公有雲，最主要的考量通常是下列何者？",
    choices: [
      { id: "A", text: "地端部署的推論延遲一定比公有雲低" },
      { id: "B", text: "地端硬體一次採購後，長期總持有成本必定比雲端低" },
      { id: "C", text: "病歷資料不得離開院內的法規與隱私要求" },
      { id: "D", text: "公有雲無法提供 GPU 等級的運算資源" },
    ],
    answer: "C",
    explanation:
      "醫療資料受高度規範，資料落地與存取控制往往是硬性要求。地端部署讓資料完全不離開院內網路，是最直接滿足合規的方式。",
    choiceExplanations: {
      A: "延遲取決於實際架構與硬體，地端未必較快，且這不是醫院選擇地端的主要理由。",
      B: "地端還要負擔維運人力、備援與更新，總持有成本未必較低。",
      D: "公有雲普遍提供 GPU 執行個體，運算資源反而是雲端的強項。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["地端部署", "資料落地", "合規"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若改用去識別化後的資料、且法規允許境內雲端處理，公有雲的彈性與成本優勢就重新勝出。",
    },
  },
  {
    id: "senior-ai-tech-practice-q094",
    subjectId: "senior-ai-tech",
    prompt:
      "為讓模型在手機端執行，常需先進行模型壓縮。下列哪一組是常見的壓縮手段？",
    choices: [
      { id: "A", text: "正則化與早停" },
      { id: "B", text: "量化與剪枝" },
      { id: "C", text: "分群與降維" },
      { id: "D", text: "批次正規化與殘差連接" },
    ],
    answer: "B",
    explanation:
      "量化把權重從高精度浮點數轉為低精度整數以縮小體積、加速推論；剪枝移除影響甚微的連接或神經元。兩者都是端側部署的標準前處理。",
    choiceExplanations: {
      A: "正則化與早停用於訓練時抑制過擬合，不會縮小已訓練模型的體積。",
      C: "分群與降維處理的是資料，而非壓縮已訓練好的模型。",
      D: "批次正規化與殘差連接是網路架構的設計，用於穩定訓練與加深網路，不是壓縮手段。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["量化", "剪枝", "模型壓縮"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若壓縮後準確率掉到無法接受，就得改用專為端側設計的小模型重新訓練，而不是繼續壓既有的大模型。",
    },
  },
  {
    id: "senior-ai-tech-practice-q095",
    subjectId: "senior-ai-tech",
    prompt:
      "AI 服務的「批次推論」與「線上推論」，其主要差異是下列何者？",
    choices: [
      { id: "A", text: "批次推論用於訓練階段，線上推論才是模型上線後的使用方式" },
      { id: "B", text: "批次推論只能在 GPU 上執行，線上推論則只能在 CPU 上執行" },
      { id: "C", text: "線上推論會即時以新資料更新權重，批次推論則使用固定模型" },
      { id: "D", text: "批次推論定期成批處理、不在意延遲；線上推論即時回應單筆請求" },
    ],
    answer: "D",
    explanation:
      "批次推論適合每日產出名單這類可等待的場景，可用大批次提升吞吐；線上推論要求毫秒級回應，架構重點在低延遲與高可用。兩者的取捨方向完全不同。",
    choiceExplanations: {
      A: "批次推論同樣是上線後的使用方式（如每日產出名單），與訓練階段無關。",
      B: "執行硬體依效能與成本決定，兩種推論都能使用 GPU 或 CPU。",
      C: "線上推論指即時回應請求，與即時更新權重的線上學習是不同概念。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["批次推論", "線上推論", "延遲敏感度"],
      constraints: ["latency"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若需求是「每天早上給業務一份名單」，批次即可；一旦要求使用者操作當下就看到結果，就必須改為線上推論。",
    },
  },
  {
    id: "senior-ai-tech-practice-q096",
    subjectId: "senior-ai-tech",
    prompt:
      "系統整合時，AI 服務與既有系統之間的介面最應優先明確定義下列哪一項？",
    choices: [
      { id: "A", text: "輸入輸出的欄位、型別、單位與錯誤處理" },
      { id: "B", text: "AI 服務內部使用的模型架構與訓練框架版本" },
      { id: "C", text: "既有系統資料庫的完整資料表結構與索引設計" },
      { id: "D", text: "模型準確率的驗收標準與定期重新訓練的頻率" },
    ],
    answer: "A",
    explanation:
      "介面契約沒講清楚，整合階段就會出現單位不一致、缺欄位、錯誤時不知如何處理等問題。欄位、型別、單位與錯誤語意是最容易出錯也最該白紙黑字寫下的部分。",
    choiceExplanations: {
      B: "模型架構與框架屬於服務內部的實作細節，正是介面應該隱藏的部分。",
      C: "介面應只約定交換的資料，讓 AI 服務依賴對方的資料表結構會造成緊密耦合。",
      D: "驗收標準與重訓頻率屬於服務品質協議與維運範疇，不是兩系統互通的介面規格。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["介面契約", "型別與單位", "錯誤處理"],
      constraints: ["integration"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若兩端由同一團隊維護且可同步改版，介面契約可以較寬鬆；跨團隊或跨公司時，它就必須嚴格到連錯誤碼都寫明。",
    },
  },
  {
    id: "senior-ai-tech-practice-q097",
    subjectId: "senior-ai-tech",
    prompt:
      "教育平台的推薦服務在尖峰時段延遲飆高。下列哪一項是最直接的緩解手段？",
    choices: [
      { id: "A", text: "改以更多資料重新訓練，提升模型的推薦品質" },
      { id: "B", text: "換成參數更多的模型以提升單次推論效率" },
      { id: "C", text: "垂直擴充資料庫主機以加快訓練資料讀取" },
      { id: "D", text: "水平擴展推論服務並對熱門結果加入快取" },
    ],
    answer: "D",
    explanation:
      "尖峰延遲的成因是請求量超過單一服務的處理能力。增加服務實例分攤流量，並把重複度高的推薦結果快取起來，可同時降低負載與回應時間。",
    choiceExplanations: {
      A: "訓練屬於離線階段，推薦品質提升與尖峰時段的承載能力無關。",
      B: "參數更多意味著每次推論的運算更多，延遲只會更高。",
      C: "訓練資料讀取屬於離線流程，與線上推論服務的請求承載無關。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["水平擴展", "快取", "尖峰延遲"],
      constraints: ["latency", "throughput"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若每位使用者的推薦結果都高度個人化、重複率極低，快取幾乎不會命中，就只剩水平擴展這條路。",
    },
  },
  {
    id: "senior-ai-tech-practice-q098",
    subjectId: "senior-ai-tech",
    prompt:
      "關於 MLOps，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "把 DevOps 的 CI/CD 直接套用在模型程式碼的版本控管上" },
      { id: "B", text: "專注於自動化超參數搜尋，以找出效能最佳的模型" },
      { id: "C", text: "一種讓模型可在雲端與邊緣裝置間自由遷移的部署架構" },
      { id: "D", text: "把資料、訓練、部署與監控串成可重複、可追溯的流程" },
    ],
    answer: "D",
    explanation:
      "MLOps 借用 DevOps 的思路，把機器學習從資料版本、訓練、評估到部署與監控整條鏈路自動化並留下紀錄，讓模型的產出可重現、問題可追溯。",
    choiceExplanations: {
      A: "只管程式碼不夠，MLOps 還要管理資料、模型版本與上線後的監控，這正是它與 DevOps 的差異。",
      B: "那是 AutoML 的範疇，MLOps 涵蓋的是從資料到監控的整條生命週期。",
      C: "MLOps 是工程實踐與流程，不是特定的部署架構。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["MLOps", "生命週期", "可重現性"],
      constraints: ["maintainability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若模型只訓練一次、之後永不更新，MLOps 的自動化投資就換不到相應效益——它的價值來自迭代次數。",
    },
  },
  {
    id: "senior-ai-tech-practice-q099",
    subjectId: "senior-ai-tech",
    prompt:
      "農業感測系統把模型部署在田間閘道器上。此設計最直接解決下列哪一項限制？",
    choices: [
      { id: "A", text: "訓練資料不足導致模型難以泛化到新田區" },
      { id: "B", text: "田間網路不穩導致無法即時上雲推論" },
      { id: "C", text: "感測器取樣頻率不足導致資料解析度偏低" },
      { id: "D", text: "模型體積過大導致閘道器記憶體無法載入" },
    ],
    answer: "B",
    explanation:
      "把推論放在閘道器上，判斷不必等待與雲端的往返，網路中斷時仍能持續運作，只在有連線時同步結果。這正是邊緣部署對付不穩網路的價值。",
    choiceExplanations: {
      A: "資料量不足要靠蒐集與增強解決，改變部署位置無濟於事。",
      C: "取樣頻率是感測端的硬體限制，模型放在哪裡都不改變資料解析度。",
      D: "部署到閘道器反而對模型體積要求更嚴，這是邊緣部署要克服的限制，不是它解決的問題。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["邊緣部署", "網路不穩", "本地推論"],
      constraints: ["connectivity", "latency"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若閘道器的運算能力不足以跑完整模型，就得先壓縮模型或改成「本地初篩、雲端複判」的兩段式設計。",
    },
  },
  {
    id: "senior-ai-tech-practice-q100",
    subjectId: "senior-ai-tech",
    prompt:
      "系統上線後發現模型輸出偶爾為空值，導致下游系統中斷。下列哪一項設計最能避免此類故障擴散？",
    choices: [
      { id: "A", text: "在模型端加強測試覆蓋率，確保上線之後不會再輸出空值" },
      { id: "B", text: "讓下游收到空值時立即停止服務，並自動通知工程師處理" },
      { id: "C", text: "在介面層定義預設值與錯誤回應，並讓下游能降級處理" },
      { id: "D", text: "把空值先原樣寫入資料庫，之後再由夜間批次程式統一清理" },
    ],
    answer: "C",
    explanation:
      "任何服務都可能回傳非預期結果，關鍵在於下游能不能安全地承接。介面明確定義錯誤語意、下游具備降級（使用預設值或跳過）能力，單點異常才不會演變成整條鏈路中斷。",
    choiceExplanations: {
      A: "測試能減少錯誤，但無法保證永不出錯，系統仍需在異常發生時能安全承接。",
      B: "立即停止正是故障擴散的形式；通知固然需要，但下游應能降級繼續運作。",
      D: "空值原樣寫入會讓即時查詢與下游流程先出錯，事後清理無法阻止故障擴散。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["降級處理", "錯誤語意", "故障擴散"],
      constraints: ["reliability", "integration"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若下游的決策絕對不能使用預設值（例如用藥劑量），正確的降級就是明確中止並轉人工，而不是給一個看似合理的替代值。",
    },
  },
  {
    id: "senior-ai-tech-practice-q139",
    subjectId: "senior-ai-tech",
    prompt:
      "某銀行的模型服務在尖峰時段延遲飆高，且偶爾回傳空值導致下游系統中斷。下列處置的優先順序何者最合理？",
    choices: [
      { id: "A", text: "先定義錯誤語意與預設行為讓下游能安全降級，再處理延遲，因中斷影響遠大於變慢" },
      { id: "B", text: "先水平擴展推論服務解決延遲，空值問題等流量穩定後再一併處理" },
      { id: "C", text: "先讓下游關閉錯誤檢查以避免中斷，再著手擴展推論服務的容量" },
      { id: "D", text: "先調查模型為何輸出空值並重新訓練，在修好之前延遲與中斷都暫不處理" },
    ],
    answer: "A",
    explanation:
      "兩個問題的嚴重度不同：延遲只是變慢，中斷會讓整條下游停擺。先讓下游能安全承接異常（明確的錯誤語意加降級行為），把影響範圍縮住，再回頭處理效能。",
    choiceExplanations: {
      B: "擴展能緩解延遲，但空值造成的中斷在這段期間仍會發生，影響比變慢更嚴重，順序顛倒了。",
      C: "關閉錯誤檢查會讓異常資料直接流入下游，看似不中斷，實則讓錯誤擴散得更廣。",
      D: "找根因有必要，但重訓耗時，期間下游仍會持續中斷；應先在介面層止血，再修根因。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["降級處理", "錯誤語意", "故障擴散"],
      constraints: ["reliability", "latency", "integration"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若下游的決策絕對不能使用預設值（例如轉帳金額），正確的降級就是明確中止並轉人工，而不是給一個看似合理的替代值。",
    },
  },
  {
    id: "senior-ai-tech-practice-q140",
    subjectId: "senior-ai-tech",
    prompt:
      "某醫院要把新版判讀模型上線，但新舊版的效能差異要累積數週的臨床追蹤才知道。下列部署策略何者最合理？",
    choices: [
      { id: "A", text: "以 A/B 測試讓新舊版各服務一半流量，累積數週臨床結果後再決定" },
      { id: "B", text: "先以歷史病例完成離線驗證，只要效能不低於舊版就直接全量切換" },
      { id: "C", text: "以 canary 放行 5% 流量，觀察兩天的系統指標正常即全面放行" },
      { id: "D", text: "以影子模式讓新版並行推論但只採用舊版結果，累積比對後再小流量灰度放行" },
    ],
    answer: "D",
    explanation:
      "當差異要數週才顯現，灰度期間看不出結論。影子模式讓新版在真實流量上跑但不影響病患，累積足夠的比對資料後再談放行——這是把「等待期」與「風險期」分開的做法。",
    choiceExplanations: {
      A: "一半病患要持續數週承受未經驗證的版本，風險暴露過大；影子模式能在不影響病患下取得同樣的比對資料。",
      B: "離線驗證無法反映要數週臨床追蹤才顯現的差異，全量切換後若新版較差，所有病患都會受影響。",
      C: "兩天的系統指標只能確認服務穩定，無法反映需數週才顯現的臨床差異，容易做出錯誤決定。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["影子模式", "灰度發布", "標籤延遲"],
      constraints: ["reliability", "safety"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      crossNode: "L21202",
      decisionBoundary:
        "若效能差異在數小時內就能從自動指標看出，就不必付出影子模式的雙倍推論成本，直接灰度即可。",
    },
  },
  {
    id: "senior-ai-tech-practice-q141",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠要把模型部署到產線旁的邊緣裝置，限制包含：裝置僅 2GB 記憶體、須在 100 毫秒內回應、且產線網路常中斷。下列處置組合何者最合理？",
    choices: [
      { id: "A", text: "以量化與剪枝壓縮模型，端側推論不依賴網路，並以本地緩衝在恢復連線時補傳" },
      { id: "B", text: "維持原模型改用雲端推論，並在裝置上快取最近一次的判斷結果作為備援" },
      { id: "C", text: "以量化壓縮模型並在端側完成推論，網路中斷期間產生的結果直接捨棄" },
      { id: "D", text: "改用知識蒸餾訓練小模型並部署到雲端，再以 5G 專網確保產線連線的穩定" },
    ],
    answer: "A",
    explanation:
      "三項限制各自對應一個處置：記憶體不足 → 壓縮；延遲要求與網路不穩 → 端側推論；網路中斷期間的結果不能掉 → 本地緩衝補傳。少做任何一項，都會有一項限制沒被滿足。",
    choiceExplanations: {
      B: "雲端推論在網路中斷時無法運作，快取舊結果也不能用來判斷新產品；往返延遲更難滿足 100 毫秒。",
      C: "壓縮與端側推論滿足了記憶體與延遲，但中斷期間的結果遺失，會讓追溯與統計出現缺口。",
      D: "蒸餾能縮小模型，但部署在雲端仍依賴網路，專網也無法保證產線不中斷，延遲限制同樣未解決。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["模型壓縮", "端側推論", "本地緩衝"],
      constraints: ["memory", "latency", "connectivity"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若壓縮後準確率掉到無法接受，就得改用專為端側設計的小模型重新訓練，而不是繼續壓既有的大模型。",
    },
  },
  {
    id: "senior-ai-tech-practice-q142",
    subjectId: "senior-ai-tech",
    prompt:
      "某教育平台的模型服務由三個團隊分別維護資料管線、模型訓練與線上推論。近期上線後表現不如離線評估，追查發現線上與離線的特徵計算邏輯不一致。下列處置何者最能從根本解決？",
    choices: [
      { id: "A", text: "要求三個團隊每週開會對齊特徵邏輯，並共同維護一份特徵規格文件" },
      { id: "B", text: "以特徵存放區或共用函式庫集中特徵定義，讓訓練與推論共用同一份實作" },
      { id: "C", text: "在線上推論端加上監控，偵測到特徵分布與離線不同時發出告警" },
      { id: "D", text: "把資料管線、模型訓練與線上推論合併由同一團隊負責，以減少溝通落差" },
    ],
    answer: "B",
    explanation:
      "訓練與服務各自實作一套特徵計算，是模型上線後不如預期的典型成因。靠開會對齊只能維持一時，把定義集中到單一實作才能從結構上消除分歧。",
    choiceExplanations: {
      A: "規格文件與會議能發現落差，但兩邊仍各自實作，隨特徵增加只會再度分歧，無法從結構上消除。",
      C: "監控能及早發現落差，但只是偵測，兩套實作並存的根本原因仍在。",
      D: "組織調整能減少溝通成本，但只要特徵仍有兩套實作，同一團隊也會在修改時漏改一邊。",
    },
    topic: "L21302 AI 技術系統集成與部署",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["訓練與服務一致性", "特徵存放區", "單一實作"],
      constraints: ["maintainability", "integration"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若只有一個模型、且特徵在訓練與服務端本來就由同一份程式碼計算，特徵存放區的維運成本就換不到相應效益。",
    },
  },
];
