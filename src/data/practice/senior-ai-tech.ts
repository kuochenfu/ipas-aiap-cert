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
      { id: "B", text: "兩者都能處理一詞多義，差別只在訓練速度" },
      { id: "C", text: "預訓練語言模型不需要任何標註資料即可直接完成分類任務" },
      { id: "D", text: "詞袋模型忽略語序與語境，預訓練語言模型能依上下文給出不同的詞表示" },
    ],
    answer: "D",
    explanation:
      "詞袋模型只統計詞出現與否或次數，語序與上下文完全被丟棄，同一個詞永遠對應同一個維度；BERT 這類預訓練語言模型則會依前後文為同一個詞產生不同的向量，因此能分辨「行」在「銀行」與「行動」中的不同意義。",
    choiceExplanations: {
      A: "描述顛倒了——依上下文產生不同向量是預訓練語言模型的能力，詞袋模型恰恰做不到。",
      B: "詞袋模型無法處理一詞多義，因為它沒有任何上下文資訊可用；差別遠不只訓練速度。",
      C: "預訓練模型仍需以標註資料微調或至少提供範例，才能對應到這家銀行自己的部門分類。",
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
        B: "Overgeneralization",
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
      { id: "A", text: "情感分析" },
      { id: "B", text: "命名實體辨識（NER）" },
      { id: "C", text: "機器翻譯" },
      { id: "D", text: "文本摘要" },
    ],
    answer: "B",
    explanation:
      "從非結構化文字中標出特定類別的片段並加以分類，正是命名實體辨識的定義。抽出藥品、劑量、頻次即為三種自訂實體類別，抽出後即可填入結構化欄位。",
    choiceExplanations: {
      A: "情感分析輸出的是文本的情緒傾向，病歷抽取要的是特定欄位的值，兩者目標不同。",
      C: "機器翻譯是把文本轉成另一種語言，並不會產生結構化欄位。",
      D: "文本摘要壓縮整段內容成短文，無法保證精確抽出每一個劑量數字並對應欄位。",
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
      { id: "A", text: "以監督式分類器訓練故障類別" },
      { id: "B", text: "以命名實體辨識標出人名與地名" },
      { id: "C", text: "以 TF-IDF 取得關鍵詞後進行分群" },
      { id: "D", text: "直接以迴歸模型預測維修工時" },
    ],
    answer: "C",
    explanation:
      "沒有標註資料時只能走非監督路線。TF-IDF 先把每張維修單轉成能反映關鍵詞重要性的向量，再以分群把相似描述聚在一起，正好對應「歸納常見故障型態」這個尚未定義類別的目標。",
    choiceExplanations: {
      A: "監督式分類器需要事先標好的故障類別，而題幹明確說明沒有任何標註資料。",
      B: "人名與地名不是故障描述用語，抽出它們對歸納故障型態沒有幫助。",
      D: "預測維修工時是另一個問題，且同樣需要標註的工時資料，無法回答「有哪些故障型態」。",
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
      { id: "B", text: "抽取式摘要從原文挑選句子組成，生成式摘要則可能改寫出原文沒有的句子" },
      { id: "C", text: "兩者都保證不會遺漏原文的任何重點" },
      { id: "D", text: "生成式摘要不需要任何語言模型即可完成" },
    ],
    answer: "B",
    explanation:
      "抽取式摘要的每一句都來自原文，忠實度高但可能不連貫；生成式摘要以語言模型重新表述，較流暢但可能出現原文沒有的說法（幻覺），忠實度需要額外檢核。",
    choiceExplanations: {
      A: "方向相反——抽取式的句子都來自原文，較不容易出現與原文矛盾；生成式才有幻覺風險。",
      C: "任何摘要都是取捨的結果，兩者都可能遺漏重點，沒有「保證不遺漏」這回事。",
      D: "生成式摘要正是以語言模型改寫產生，沒有模型就無從生成。",
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
        D: "Overgeneralization",
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
      { id: "A", text: "增加詞典中正面詞彙的數量" },
      { id: "B", text: "改用能建模上下文與句子整體語義的模型，並補充反諷樣本進行微調" },
      { id: "C", text: "把所有評論轉成小寫後再比對關鍵詞" },
      { id: "D", text: "只保留評論的第一句話進行判斷" },
    ],
    answer: "B",
    explanation:
      "反諷的關鍵在於前後語境互相矛盾，單看詞彙一定判錯。需要能讀懂整句語義關係的模型（如預訓練語言模型），並以含反諷的標註樣本微調，讓模型學到這種矛盾樣態。",
    choiceExplanations: {
      A: "反諷句裡的正面詞彙本來就存在，加更多正面詞只會讓誤判更嚴重。",
      C: "轉小寫是英文文本的正規化步驟，對中文反諷判斷沒有作用。",
      D: "反諷的轉折往往在後半句，只留第一句反而剛好丟掉判斷所需的關鍵資訊。",
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
      { id: "B", text: "詞嵌入完全不需要任何語料即可產生" },
      { id: "C", text: "詞嵌入以低維稠密向量表示詞，語意相近的詞在向量空間中距離較近" },
      { id: "D", text: "詞嵌入只能用於英文，無法應用於中文" },
    ],
    answer: "C",
    explanation:
      "詞嵌入把每個詞映射到數十至數百維的稠密向量，並讓語意或用法相近的詞在空間中彼此靠近，因此能支援語意相似度計算——這正是 TF-IDF 這種稀疏表示做不到的。",
    choiceExplanations: {
      A: "高維稀疏、維度等於詞彙表大小描述的是詞袋與 TF-IDF，不是詞嵌入。",
      B: "詞嵌入是從大量語料中學出來的，沒有語料就沒有可學的共現關係。",
      D: "詞嵌入是語言無關的方法，中文只需先完成斷詞或改用字元／子詞單位即可。",
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
      { id: "A", text: "以檢索增強生成（RAG）先檢索相關條文，再據以生成並附上出處" },
      { id: "B", text: "每次規章修訂就重新訓練一次基礎模型" },
      { id: "C", text: "直接以通用大型語言模型回答，不接任何外部資料" },
      { id: "D", text: "把問題交由關鍵字搜尋，直接回傳搜尋結果連結" },
    ],
    answer: "A",
    explanation:
      "「答案必須可追溯到條文」同時要求正確性與出處。RAG 先檢索出相關條文段落，再讓模型依這些段落生成回答並標註來源，規章更新時只要更新索引，不必重訓模型。",
    choiceExplanations: {
      B: "每次修訂都重訓基礎模型的成本與時間都不可行，且仍難以提供逐條出處。",
      C: "通用模型沒有這所學校的規章內容，答案無從追溯，且極可能編造條文。",
      D: "只回傳連結沒有回答問題，使用者仍得自己讀完規章，未達成問答系統的目的。",
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
        C: "Overgeneralization",
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
      { id: "A", text: "向量表示讓語意相近的文字在空間中距離較近，即使用詞不同" },
      { id: "B", text: "系統自動把查詢翻譯成英文再比對" },
      { id: "C", text: "兩段文字的字元完全相同" },
      { id: "D", text: "索引依照文件建立時間排序" },
    ],
    answer: "A",
    explanation:
      "語意搜尋比對的是向量而非字面。「過熱」與「溫度異常」在語料中出現的語境相近，其向量距離因此很近，即使沒有任何共同關鍵字也能被檢索到——這正是它相對關鍵字搜尋的優勢。",
    choiceExplanations: {
      B: "翻譯成英文並不會讓中文的同義表述自動對應，也不是語意搜尋的運作方式。",
      C: "兩段文字並沒有共同的關鍵字，若靠字面比對反而找不到。",
      D: "建立時間只影響排序，與能不能找到語意相近的文件無關。",
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
      { id: "A", text: "錯誤會在後續意圖判斷中被自動修正" },
      { id: "B", text: "錯誤會讓模型自動重新訓練" },
      { id: "C", text: "錯誤只影響顯示，不影響判斷結果" },
      { id: "D", text: "錯誤會往下游累積，使意圖判斷以錯誤文字為輸入而誤判" },
    ],
    answer: "D",
    explanation:
      "串接式流水線的每一階段都以前一階段的輸出為輸入，語音轉文字若把關鍵詞聽錯，後續的意圖分類就是在錯誤的句子上做判斷，錯誤會沿著管線累積放大。",
    choiceExplanations: {
      A: "下游模型並不知道上游哪裡出錯，也沒有原始語音可回頭比對，無法自動修正。",
      B: "模型不會因為輸入有誤就自行重訓，重訓是需要人為觸發的流程。",
      C: "轉出的文字正是意圖判斷的輸入，錯了就會直接影響判斷結果，不只是顯示問題。",
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
        C: "Overgeneralization",
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
      { id: "B", text: "只回報模型的信心分數" },
      { id: "C", text: "改用參數更多的模型以提高準確率" },
      { id: "D", text: "把所有高風險案件一律轉為人工審查，不提供任何說明" },
    ],
    answer: "A",
    explanation:
      "法遵要的是「為什麼判高風險」的可追溯依據。標出觸發判定的關鍵文句並連結到對應條文，審查者才能複核判斷是否合理，也才符合可解釋性的要求。",
    choiceExplanations: {
      B: "信心分數只說明模型有多確定，並未說明它依據了文件中的哪些內容。",
      C: "提高準確率不等於提供說明；更大的模型往往更難解釋，與需求方向相反。",
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
      { id: "A", text: "改用更長的上下文視窗" },
      { id: "B", text: "調高分類門檻即可" },
      { id: "C", text: "提高模型參數量" },
      { id: "D", text: "這是新類別出現而非分布漂移，應補上該類的標註樣本並重新定義類別體系，同時為未涵蓋的客訴保留「其他」出口" },
    ],
    answer: "D",
    explanation:
      "用詞分布沒變、但出現了訓練時不存在的類別，模型只能把它硬塞進既有類別而拉低整體表現。要補的是類別體系與標註樣本，並設「其他」出口讓未涵蓋的內容不被強行歸類。",
    choiceExplanations: {
      A: "上下文長度影響能讀多少字，與類別涵蓋範圍是兩回事。",
      B: "門檻調整只改變判定的鬆緊，無法讓模型認得一個它從未見過的類別。",
      C: "參數量與能否辨識新類別無關，沒有樣本就學不到。",
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
        A: "Layer Confusion",
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
      { id: "A", text: "以文本分類判斷整份病歷是否提及停藥" },
      { id: "B", text: "以生成式模型直接輸出一段用藥摘要" },
      { id: "C", text: "以關鍵字比對抽出藥名即可" },
      { id: "D", text: "以命名實體辨識抽出藥名劑量並保留字元位移，再以關係或屬性分類判斷停用與否；兩段都輸出原文位置以供追溯" },
    ],
    answer: "D",
    explanation:
      "三項需求要分開對應：抽取結構化欄位靠實體辨識、判斷停用與否是在抽出的實體上再做屬性分類、可追溯則要求全程保留字元位移。生成式摘要雖然可讀，卻無法保證每個劑量精確且指得回原文。",
    choiceExplanations: {
      A: "整份分類只回答「有沒有提到」，無法對應到個別藥品。",
      B: "生成摘要可能改寫或遺漏數字，也不保證能對應回原文的確切位置。",
      C: "關鍵字比對抓不到劑量與停用語境，同名不同劑型也無法區分。",
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
      { id: "A", text: "應提高向量的維度" },
      { id: "B", text: "向量檢索比對的是語意而非字面，精確字串容易被相近但不同的內容擠掉，應改為關鍵字與向量混合檢索" },
      { id: "C", text: "應改用更大的嵌入模型" },
      { id: "D", text: "應把所有維修單重新切塊" },
    ],
    answer: "B",
    explanation:
      "料號這種字面字串在向量空間裡沒有語意鄰居，A-1203 與 A-1204 的向量幾乎一樣近。這正是純向量檢索的盲區，處方是混合檢索：關鍵字負責精確匹配，向量負責語意召回。",
    choiceExplanations: {
      A: "提高維度不會讓相近料號在語意上被區分開。",
      C: "更大的嵌入模型同樣無法把 A-1203 與 A-1204 的語意拉開。",
      D: "重新切塊改變的是檢索單位大小，精確字串仍然不是向量擅長的。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "提高模型的生成溫度" },
      { id: "B", text: "為該縣市的分數統一加上補償分" },
      { id: "C", text: "停用該縣市的評分功能" },
      { id: "D", text: "這是訓練語料代表性不足造成的系統性偏差，應補入該縣市的樣本並以分群評估持續追蹤各縣市的分數分布" },
    ],
    answer: "D",
    explanation:
      "根因是訓練語料沒涵蓋這群學生的表達方式，模型把「不熟悉」誤判成「寫得不好」。補入樣本才是對症；而分群評估要成為常規，否則下一個沒被涵蓋的群體同樣會被埋沒在整體平均裡。",
    choiceExplanations: {
      A: "評分模型的問題在於代表性，與生成的隨機性無關。",
      B: "統一加分是掩蓋而非修正，個別學生的相對排序仍然錯，且加多少沒有依據。",
      C: "停用等於放棄該縣市學生的服務，把問題轉嫁給他們承擔。",
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
      { id: "A", text: "以通用模型直接回答" },
      { id: "B", text: "每季以最新辦法微調模型一次" },
      { id: "C", text: "把辦法全文寫進系統提示詞" },
      { id: "D", text: "以檢索增強生成檢索最新辦法條文，並要求模型在回答中標註引用的條號" },
    ],
    answer: "D",
    explanation:
      "季度更新與出處標註這兩項需求同時指向檢索：更新文件即生效、檢索到的條文本身就是可引用的依據。微調與寫死提示詞都會讓「更新」變成一次工程作業。",
    choiceExplanations: {
      A: "通用模型不知道這份辦法的內容，且無從標註條號。",
      B: "每季重訓與評估的成本高，且更新有時間差，條號也不會自動附上。",
      C: "辦法全文可能超出提示詞長度上限，每次修訂還要改程式並重測。",
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
      { id: "A", text: "把準確率當作唯一評估指標" },
      { id: "B", text: "刪除大部分良品影像使兩類數量相同即可，不做其他處理" },
      { id: "C", text: "以資料增強擴增瑕疵樣本，並考慮改用異常偵測思路" },
      { id: "D", text: "增加模型層數直到訓練準確率達到 100%" },
    ],
    answer: "C",
    explanation:
      "瑕疵樣本稀少時，一方面可用旋轉、翻轉、亮度調整等增強手法擴增少數類，另一方面可改以「只學正常樣態、偏離即為異常」的異常偵測思路，避開必須蒐集大量瑕疵樣本的困境。",
    choiceExplanations: {
      A: "在極度不平衡下，全猜良品就有超過 99% 的準確率，這個指標完全無法反映瑕疵抓到沒有。",
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
      { id: "A", text: "評估不同族群與年齡層的辨識率差異" },
      { id: "B", text: "把原始人臉影像長期保存在雲端以便日後比對" },
      { id: "C", text: "提供人臉以外的替代驗證方式" },
      { id: "D", text: "在裝置端完成特徵萃取，只上傳特徵值" },
    ],
    answer: "B",
    explanation:
      "原始人臉影像屬於高度敏感的生物特徵資料，長期保存等於持續累積外洩風險，且多數情境並非必要。正確做法是只保留不可還原的特徵值，並訂定明確的保存期限。",
    choiceExplanations: {
      A: "檢查不同族群的辨識率差異是防止演算法偏見的必要步驟，屬於恰當的設計考量。",
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
      { id: "A", text: "增加特徵圖的空間尺寸" },
      { id: "B", text: "為模型加入隨機標籤以避免過擬合" },
      { id: "C", text: "降低特徵圖尺寸、減少參數量並提供一定的位移不變性" },
      { id: "D", text: "把影像轉換成文字描述" },
    ],
    answer: "C",
    explanation:
      "池化以取最大值或平均值的方式縮小特徵圖，讓後續層的計算量與參數量下降，同時使模型對目標的小幅位移較不敏感，提升泛化能力。",
    choiceExplanations: {
      A: "池化的作用是縮小而非放大特徵圖，敘述方向相反。",
      B: "加入隨機標籤會破壞訓練訊號；避免過擬合的常見手法是 Dropout 或正則化，而非亂標。",
      D: "把影像轉成文字描述是影像標題生成任務，與池化這個層的運算無關。",
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
      { id: "A", text: "模型參數在搬移過程中遺失" },
      { id: "B", text: "B 院的病患比較健康" },
      { id: "C", text: "資料分布偏移：訓練與實際使用的影像特性不同" },
      { id: "D", text: "模型層數不足" },
    ],
    answer: "C",
    explanation:
      "不同廠牌設備的成像參數、對比與雜訊特性不同，B 院的影像分布與訓練資料不一致，模型在未見過的分布上自然退步。這是醫療影像 AI 最常見的落地障礙之一。",
    choiceExplanations: {
      A: "參數遺失會讓模型完全失效或行為異常，而不是「表現退步但仍能運作」。",
      B: "若真是病患組成差異，應同時檢查標籤分布；但題幹已明確指出設備不同，這是更直接的解釋。",
      D: "層數不足會在 A 院也表現不好，無法解釋「A 院良好、B 院退步」的落差。",
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
      { id: "A", text: "光學字元辨識（OCR）" },
      { id: "B", text: "影像超解析度" },
      { id: "C", text: "影像去霧" },
      { id: "D", text: "姿態估計" },
    ],
    answer: "A",
    explanation:
      "把影像中的文字（含手寫）轉成可編輯的字元序列正是 OCR 的任務範圍；手寫辨識屬於 OCR 中難度較高的一支，通常需要專門的手寫資料集訓練。",
    choiceExplanations: {
      B: "超解析度提升影像清晰度，可作為 OCR 的前處理，但本身不輸出文字。",
      C: "去霧是影像增強技術，用於改善能見度，與文字辨識不是同一件事。",
      D: "姿態估計偵測的是人體或物體關節位置，與支票文字無關。",
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
      { id: "C", text: "模型的參數量" },
      { id: "D", text: "訓練所需的時間" },
    ],
    answer: "A",
    explanation:
      "「不可放過瑕疵」等於要把偽陰性壓到最低，對應的指標就是瑕疵類別的召回率。提高召回通常會犧牲精確率（誤判良品為瑕疵），但在此情境下重工的成本遠低於流出的成本。",
    choiceExplanations: {
      B: "瑕疵樣本稀少時，全部判為良品也有極高的整體準確率，這個指標無法反映漏檢情況。",
      C: "參數量關係到部署成本與推論速度，與漏檢與否無關。",
      D: "訓練時間是開發成本，不能用來衡量模型有沒有把瑕疵抓出來。",
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
        C: "Layer Confusion",
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
      { id: "A", text: "隨機裁切影像的四個角落" },
      { id: "B", text: "把影像壓縮成更小的檔案" },
      { id: "C", text: "把彩色影像一律轉為黑白後不做其他處理" },
      { id: "D", text: "影像亮度與色彩正規化" },
    ],
    answer: "D",
    explanation:
      "亮度差異屬於與任務無關的變異，正規化把不同時段的影像調整到一致的統計特性，模型才不會把「拍攝時間」誤當成判斷依據，這是遙測與空拍分析的標準前處理。",
    choiceExplanations: {
      A: "隨機裁切是資料增強手段，無法消除整張影像的亮度偏移。",
      B: "壓縮改變的是檔案大小，甚至可能因失真而損失細節，對亮度差異沒有幫助。",
      C: "轉黑白會丟掉作物與土壤最關鍵的色彩差異，反而讓覆蓋率估算變困難。",
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
      { id: "A", text: "在校內的邊緣裝置上執行推論，只上傳人數統計值" },
      { id: "B", text: "把影像串流上傳公有雲進行推論，結果再回傳" },
      { id: "C", text: "把影像存到公有雲，隔日再批次分析" },
      { id: "D", text: "由人工每節課到教室清點" },
    ],
    answer: "A",
    explanation:
      "在校內邊緣裝置完成推論，影像從頭到尾不離開校園，只有匿名的人數統計上傳，同時滿足即時性與資料不出校的要求。",
    choiceExplanations: {
      B: "影像串流上傳公有雲即已離開校園，直接違反校方要求。",
      C: "上傳雲端保存同樣違反要求，且批次分析也無法滿足即時性。",
      D: "人工清點雖不涉及影像外流，但無法即時、成本高，也失去導入系統的意義。",
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
      { id: "A", text: "增加模型參數量" },
      { id: "B", text: "降低召回率目標到 90% 以減少複檢" },
      { id: "C", text: "取消複檢流程" },
      { id: "D", text: "依複檢量能與漏檢成本重新定出門檻，並補入水漬樣本作為負樣本訓練；必要時分級處理，高信心瑕疵直接下線、低信心才複檢" },
    ],
    answer: "D",
    explanation:
      "98% 召回是靠大量誤報換來的，而複檢量能是真實的硬限制。處置有兩層：資料層補入水漬的負樣本讓模型學會區分，流程層依信心分級，把人力集中在真正拿不準的案例上。",
    choiceExplanations: {
      A: "參數量增加不會讓模型自動學會區分水漬與瑕疵，缺的是樣本。",
      B: "直接降召回等於放更多瑕疵流出，把問題轉嫁給客戶端。",
      C: "取消複檢會讓誤報直接變成報廢或錯放，兩種錯誤都無人攔截。",
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
      { id: "A", text: "忽略落差，兩院共用同一模型" },
      { id: "B", text: "直接以 B 院資料從零重新訓練" },
      { id: "C", text: "要求 B 院更換為與 A 院相同廠牌的設備" },
      { id: "D", text: "先以 B 院的少量標註影像評估落差幅度，再依落差決定是做影像正規化、以 B 院資料微調，還是重新訓練" },
    ],
    answer: "D",
    explanation:
      "處置強度應與落差幅度相稱。先量出差多少，才知道是靠正規化把成像特性拉近就夠、還是需要微調甚至重訓。跳過量測直接重訓，可能花了最大的代價解一個正規化就能解的問題。",
    choiceExplanations: {
      A: "忽略落差會讓 B 院病患承擔較差的判讀品質。",
      B: "重訓成本最高且需要大量 B 院標註，在還沒確認落差幅度前就投入並不合理。",
      C: "更換設備的成本遠高於調整模型，且不具可推廣性。",
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
      { id: "A", text: "影像上傳雲端計算後刪除" },
      { id: "B", text: "在校內以人臉辨識計數，確保不重複計算" },
      { id: "C", text: "在校內邊緣裝置以物件偵測計數，不做人臉辨識也不保存原始影像，只上傳各出入口的人數統計" },
      { id: "D", text: "保存全部影像以備日後查核" },
    ],
    answer: "C",
    explanation:
      "三項限制分別對應三個設計決定：不得外流 → 端側推論；不得辨識身分 → 用物件偵測而非人臉辨識；至於不保存原始影像，則讓「日後被翻出來」的風險從源頭消失。",
    choiceExplanations: {
      A: "上傳雲端的那一刻影像已離開校園，事後刪除補不回來。",
      B: "人臉辨識直接違反不得辨識個人身分的限制，即使目的只是去重。",
      D: "保存原始影像會持續累積可識別資料的風險，且與需求無關。",
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
        D: "Wrong Trade-off",
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
      { id: "A", text: "提高空拍機的飛行高度" },
      { id: "B", text: "要求只在晴天正午飛行" },
      { id: "C", text: "增加模型層數" },
      { id: "D", text: "測試集與部署環境不同分布，應補入各時段與天候的實地影像重建測試集，並在前處理加入亮度與色彩正規化" },
    ],
    answer: "D",
    explanation:
      "測試集只涵蓋單一拍攝條件，測得的分數自然無法代表實地。要做兩件事：重建能代表部署環境的測試集，否則永遠量不準；以及在前處理消除與任務無關的光照變異。",
    choiceExplanations: {
      A: "飛行高度改變的是解析度與涵蓋範圍，與光照差異無關。",
      B: "限制飛行條件是把需求砍掉，且多數農務無法配合單一時段。",
      C: "增加層數無助於面對訓練時未見過的光照條件。",
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
        C: "Wrong Trade-off",
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
      { id: "A", text: "以物件偵測框出整張存摺" },
      { id: "B", text: "直接進行文字辨識，辨識不出來就跳過" },
      { id: "C", text: "以影像分類判斷影本是否清晰即可" },
      { id: "D", text: "先做影像增強與去陰影等前處理，再進行文字辨識，並對低信心的欄位標記為需人工確認" },
    ],
    answer: "D",
    explanation:
      "摺痕與陰影會直接壓低辨識率，前處理是提高輸入品質的最直接手段；而金額攸關帳務，低信心的結果必須交由人確認而不是靜默跳過。",
    choiceExplanations: {
      A: "框出整張存摺無助於取得金額數字。",
      B: "跳過會讓欄位留白，且沒有任何提示，錯誤會在下游才被發現。",
      C: "判斷清晰與否不產生金額，需求沒有被滿足。",
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
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Layer Confusion",
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
      { id: "A", text: "提高模型的生成溫度以增加多樣性" },
      { id: "B", text: "改用更大的通用模型" },
      { id: "C", text: "把輸出長度限制在 100 字以內" },
      { id: "D", text: "以檢索增強生成限定模型只能依據內部核准的商品文件作答" },
    ],
    answer: "D",
    explanation:
      "幻覺的根源是模型憑訓練記憶生成而缺乏事實依據。RAG 把核准過的商品文件檢索進上下文，讓模型「有本可依」，並可要求標註出處供法遵複核，是最直接的緩解手段。",
    choiceExplanations: {
      A: "提高溫度讓輸出更發散，捏造的機率反而上升，與目標相反。",
      B: "更大的通用模型仍然不知道這家銀行的商品條款，幻覺風險並未消除。",
      C: "限制長度只是讓錯誤更短，不會讓內容變得有依據。",
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
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Wrong Trade-off",
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
      { id: "A", text: "微調完全不需要評估，訓練完即可上線" },
      { id: "B", text: "微調會更新模型權重，適合讓模型穩定學會特定風格或任務格式" },
      { id: "C", text: "微調是讓知識即時更新的最佳手段" },
      { id: "D", text: "微調不需要任何訓練資料" },
    ],
    answer: "B",
    explanation:
      "微調以任務資料更新模型權重，讓模型內化特定的輸出風格、格式或領域用語。它擅長的是「怎麼說」，至於「說什麼」這種會頻繁變動的事實知識，用 RAG 更新才划算。",
    choiceExplanations: {
      A: "微調後仍須以獨立測試集評估，並檢查是否出現災難性遺忘或過擬合。",
      C: "知識一變就得重新微調，成本與時間都不划算；即時更新知識應交給檢索。",
      D: "微調的本質就是以標註資料進行訓練，沒有資料無從微調。",
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
        D: "Overgeneralization",
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
      { id: "B", text: "只在夜間送出資料以降低風險" },
      { id: "C", text: "送出前先去識別化，或改用可於院內部署的模型" },
      { id: "D", text: "把個資加密後直接貼進提示詞" },
    ],
    answer: "C",
    explanation:
      "要讓個資不外流，只有兩條路：資料本身先去識別化，或模型部署在院內讓資料不出場域。這是從源頭切斷風險，而非依賴對方的承諾。",
    choiceExplanations: {
      A: "提示詞只是輸入文字，無法約束服務端如何處理與保存資料，個資仍然已經送出。",
      B: "傳送時間與是否外流無關，夜間送出的資料一樣離開了醫院。",
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
        B: "Layer Confusion",
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
      { id: "A", text: "增加模型的上下文長度" },
      { id: "B", text: "調低生成溫度並固定提示模板，必要時對常見問題採用固定回覆" },
      { id: "C", text: "改用更多語言的模型" },
      { id: "D", text: "把手冊全部刪除重寫" },
    ],
    answer: "B",
    explanation:
      "輸出不一致主要來自取樣的隨機性與提示不固定。調低溫度使輸出更趨向高機率答案、固定提示模板減少變異，高頻問題甚至可直接走預先審過的固定回覆，一致性最有保障。",
    choiceExplanations: {
      A: "上下文長度影響能塞進多少資料，與同一問題的答案是否穩定沒有直接關係。",
      C: "多語言能力與答案一致性無關，操作員面對的是同一種語言。",
      D: "手冊內容不是問題所在，重寫成本極高且無法解決生成隨機性。",
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
        C: "Layer Confusion",
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
      { id: "A", text: "統計產生每題所需的秒數" },
      { id: "B", text: "由學科教師以抽樣方式逐題查核答案與解析是否正確" },
      { id: "C", text: "計算輸出文字的平均長度" },
      { id: "D", text: "統計使用者按讚次數" },
    ],
    answer: "B",
    explanation:
      "正確性是事實層面的判斷，只有具備學科知識的人逐題查核才算數。自動指標可以衡量流暢度或格式，但無法判斷答案對錯，這是生成式 AI 評估中最不能省的一環。",
    choiceExplanations: {
      A: "生成速度衡量的是效率，與題目內容是否正確無關。",
      C: "文字長度只反映輸出的篇幅，長不代表對。",
      D: "按讚反映的是使用者觀感，使用者未必具備判斷答案正確與否的專業。",
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
        C: "Neighbor Concept",
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
      { id: "A", text: "限制模型只能輸出很少的字數" },
      { id: "B", text: "以少量資料重新訓練模型的全部權重" },
      { id: "C", text: "在提示中提供數個輸入輸出範例，引導模型依相同格式作答" },
      { id: "D", text: "只在模型第一次使用時提供範例，之後不需要" },
    ],
    answer: "C",
    explanation:
      "少量範例提示是在推論時把幾組示範放進上下文，讓模型從中歸納出期望的格式與風格。它不更新任何權重，屬於「用提示引導」而非「用訓練改變模型」。",
    choiceExplanations: {
      A: "字數限制是輸出長度的控制，與提供範例引導格式無關。",
      B: "以資料更新權重是微調，與只在提示中放範例是兩種不同的手段。",
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
        A: "Neighbor Concept",
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
      { id: "A", text: "把所有方案寫死在系統提示詞中" },
      { id: "B", text: "每月以最新方案微調模型" },
      { id: "C", text: "以 RAG 檢索最新方案文件，模型只負責組織答覆" },
      { id: "D", text: "改由人工回覆全部問題" },
    ],
    answer: "C",
    explanation:
      "方案頻繁變動時，把知識放在可即時更新的檢索索引裡最划算：更新文件即生效，不必動模型。微調則是每次更新都要重跑訓練與評估，成本與延遲都高得多。",
    choiceExplanations: {
      A: "寫死在提示詞中每次調整都要改程式並重新測試，且提示長度有上限，方案一多就塞不下。",
      B: "每月微調要重複訓練、評估與部署，成本高且更新有時間差，方案一改就過時。",
      D: "全人工回覆失去導入客服系統的意義，且尖峰時段人力難以負荷。",
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
        D: "Wrong Trade-off",
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
      { id: "B", text: "資料最小化" },
      { id: "C", text: "模型壓縮" },
      { id: "D", text: "水平擴展" },
    ],
    answer: "A",
    explanation:
      "在決策或產出流程中保留人的審核關卡，讓最終責任仍由人承擔，正是人類監督的核心。對外文案涉及法遵與商譽風險，是最典型需要保留人工核可的場景。",
    choiceExplanations: {
      B: "資料最小化講的是只蒐集必要的個資，與產出前的人工審核不是同一件事。",
      C: "模型壓縮處理的是部署效率問題，與審核流程無關。",
      D: "水平擴展是系統承載能力的設計，與內容把關無關。",
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
      { id: "B", text: "梯度消失" },
      { id: "C", text: "過擬合" },
      { id: "D", text: "資料外洩" },
    ],
    answer: "A",
    explanation:
      "模型產生看似合理、實際上沒有依據的內容，稱為幻覺。在醫療場域尤其危險，因此摘要類應用必須搭配可追溯的出處標註與人工複核。",
    choiceExplanations: {
      B: "梯度消失是深層網路訓練時的最佳化困難，屬於訓練階段的現象。",
      C: "過擬合指模型在訓練資料表現好、未見資料表現差，描述的是泛化問題而非捏造內容。",
      D: "資料外洩指的是資料被不當揭露，而此處是模型生成了不存在的內容。",
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
      { id: "A", text: "改用只支援單輪對話的模型" },
      { id: "B", text: "把資料庫的所有歷史紀錄貼進提示詞" },
      { id: "C", text: "提高模型的生成溫度" },
      { id: "D", text: "為模型提供可呼叫的工具（如查詢 API），由模型決定何時呼叫" },
    ],
    answer: "D",
    explanation:
      "工具呼叫讓模型在需要即時資料時發出查詢請求，由系統執行後把結果回填上下文再生成答覆。這樣資料永遠是當下的，也避免把整個資料庫塞進提示。",
    choiceExplanations: {
      A: "限制成單輪對話會讓工具呼叫的多步流程無法進行，與需求方向相反。",
      B: "歷史紀錄量遠超過上下文長度，且貼進去的是靜態快照，仍然無法回答「現在」的數值。",
      C: "溫度只影響輸出的隨機性，不會讓模型取得任何它原本沒有的資料。",
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
        C: "Layer Confusion",
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
      { id: "A", text: "產出可能重現訓練資料中的受保護內容，仍須進行相似度與授權檢查" },
      { id: "B", text: "使用開源模型即可免除所有授權責任" },
      { id: "C", text: "只要不對外發佈就完全沒有風險" },
      { id: "D", text: "只要是 AI 生成的內容就一定沒有侵權疑慮" },
    ],
    answer: "A",
    explanation:
      "模型可能在特定提示下大段重現訓練語料中的受保護內容，發佈前應進行相似度比對並確認素材授權。「AI 生成」本身不構成免責事由。",
    choiceExplanations: {
      B: "開源模型的授權規範的是模型本身的使用條件，不涵蓋產出內容的著作權問題。",
      C: "內部使用風險較低但不等於零，若涉及散布或商業利用仍可能產生爭議。",
      D: "生成內容仍可能與既有受保護作品高度相似，來源是 AI 並不能自動免除責任。",
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
        D: "Overgeneralization",
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
      { id: "A", text: "應改用更大的模型" },
      { id: "B", text: "應提高生成溫度以增加多樣性" },
      { id: "C", text: "檢索保證的是有依據，不保證推論與對應正確；應加上結構化欄位比對，把費率等關鍵數值改由程式從來源直接填入而非由模型敘述" },
      { id: "D", text: "應停用檢索增強生成" },
    ],
    answer: "C",
    explanation:
      "RAG 解決的是「有沒有依據」，但模型仍可能在多份文件之間把數值對錯對象。關鍵數值不該讓模型敘述，而該由程式從來源欄位直接帶入，模型只負責串接文字。",
    choiceExplanations: {
      A: "更大的模型仍可能在多份相似文件之間混淆對應關係。",
      B: "提高溫度會讓輸出更發散，對調的機率上升。",
      D: "停用檢索會讓模型完全失去依據，錯得更嚴重。",
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
        B: "Wrong Trade-off",
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
      { id: "A", text: "為模型提供受權限控管的查詢工具，由模型決定何時呼叫，並在工具層記錄每次查詢的病患、時間與呼叫者" },
      { id: "B", text: "每小時把全院檢驗值匯入提示詞" },
      { id: "C", text: "以檢索增強生成檢索昨日的檢驗報告" },
      { id: "D", text: "讓模型依訓練知識推估檢驗值" },
    ],
    answer: "A",
    explanation:
      "要當下的值就必須即時查詢，而查詢紀錄要留在工具層——因為那是真正發生存取的地方，也才擋得住越權。把權限與稽核放在工具層，模型換了也不影響。",
    choiceExplanations: {
      B: "全院檢驗值遠超過提示詞長度，且把所有病患的資料塞給每一次對話違反最小權限。",
      C: "昨日報告無法回答「當下」的檢驗值，時效不符。",
      D: "檢驗值是個別病患的實測數據，模型無從推估，硬答就是幻覺。",
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
      { id: "A", text: "格式與語氣屬穩定需求，適合以微調或提示模板固定；教材內容每週變動，適合以檢索引入——兩者分工而非二選一" },
      { id: "B", text: "全部以微調處理，每週重訓一次" },
      { id: "C", text: "全部以檢索處理，格式也交給檢索" },
      { id: "D", text: "兩者都不需要，提高溫度即可" },
    ],
    answer: "A",
    explanation:
      "判準是變動頻率：不會變的（格式、語氣）寫進模型或模板最省；會變的（教材）留在可即時更新的檢索索引。把兩者混在同一種手段上，就會出現「改一次要重訓一次」或「格式時好時壞」。",
    choiceExplanations: {
      B: "每週重訓的成本與時間差都不可行，教材一改就過時。",
      C: "檢索提供的是知識來源，不直接控制輸出格式與語氣的一致性。",
      D: "提高溫度會讓格式更不穩定，方向相反。",
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
      { id: "A", text: "把手冊重新撰寫" },
      { id: "B", text: "再把溫度調到 0 即可" },
      { id: "C", text: "改用更大的模型" },
      { id: "D", text: "對高頻問題建立經審核的固定回覆，由分類器命中後直接回傳，僅在未命中時才走生成" },
    ],
    answer: "D",
    explanation:
      "調低溫度能減少隨機性，但只要走生成路徑，措辭就仍可能因提示或檢索片段的細微差異而變動。對答案固定的高頻問題，最可靠的做法是繞開生成，直接回傳審核過的內容。",
    choiceExplanations: {
      A: "手冊內容並非問題所在，重寫成本極高也無法解決生成的變異。",
      B: "即使溫度為 0，檢索到的片段不同仍會導致措辭變化，且已試過未解決。",
      C: "更大的模型不保證措辭穩定，成本卻上升。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "以文字長度判斷內容是否完整" },
      { id: "B", text: "模型產出後直接發布，有錯再更正" },
      { id: "C", text: "以另一個生成式模型檢查前一個的輸出即可" },
      { id: "D", text: "由模型產出草稿、承辦人員逐項核對數字與條件後才發布，並保留核對紀錄" },
    ],
    answer: "D",
    explanation:
      "對外文案涉及民眾權益，事實正確性只能由知道正確答案的人確認。保留核對紀錄則讓日後發生爭議時，責任與流程都說得清楚。",
    choiceExplanations: {
      A: "長度與正確性無關，長的文案一樣可能寫錯金額。",
      B: "錯誤資訊一旦發布就可能造成民眾誤解與申請失敗，事後更正補不回來。",
      C: "第二個生成式模型同樣可能產生看似合理的錯誤，無法取代對事實的查核。",
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
        A: "Neighbor Concept",
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
      { id: "A", text: "單模態影像分類" },
      { id: "B", text: "時間序列預測" },
      { id: "C", text: "純規則式專家系統" },
      { id: "D", text: "多模態人工智慧應用" },
    ],
    answer: "D",
    explanation:
      "同時處理影像與文字兩種模態，並把兩者的資訊融合後做出判斷，正是多模態應用的定義。任一模態單獨看都可能不足以判斷案件類型。",
    choiceExplanations: {
      A: "單模態影像分類只看照片，會忽略文字描述中的關鍵情境資訊。",
      B: "時間序列預測處理的是隨時間變化的數值，與本案的圖文判斷無關。",
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
      { id: "A", text: "模型部署在雲端或邊緣" },
      { id: "B", text: "在特徵層就合併各模態，或各模態先各自預測再合併結果" },
      { id: "C", text: "訓練資料的收集時間先後" },
      { id: "D", text: "使用的程式語言不同" },
    ],
    answer: "B",
    explanation:
      "早期融合把各模態的特徵先拼接再一起學習，能捕捉模態間的細緻互動；晚期融合讓各模態各自預測、最後才整合分數，較模組化且對缺失模態更有韌性。",
    choiceExplanations: {
      A: "部署位置是工程議題，早期或晚期融合的模型都可以部署在雲端或邊緣。",
      C: "融合策略講的是模型架構中資訊在哪一階段合併，與資料何時蒐集無關。",
      D: "程式語言只是實作工具，與融合發生在哪一層無關。",
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
        D: "Layer Confusion",
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
      { id: "A", text: "以隨機數值填補缺失的檢驗值" },
      { id: "B", text: "直接拒絕處理任何缺少模態的案例" },
      { id: "C", text: "採晚期融合並允許缺失模態時以其餘模態的預測結果加權" },
      { id: "D", text: "把缺失欄位一律填 0 且不作任何標記" },
    ],
    answer: "C",
    explanation:
      "晚期融合讓每個模態各有一個預測分支，缺哪一個就略過哪一個，其餘分支仍能給出判斷。這種設計對真實醫療資料常見的缺漏最有韌性。",
    choiceExplanations: {
      A: "隨機填值等於注入雜訊，可能導向完全錯誤的診斷建議，在醫療場域尤其危險。",
      B: "真實病歷缺項極為常見，一律拒絕會讓系統在多數情境下無法使用。",
      D: "填 0 且不標記會讓模型把「沒測」誤解成「數值為零」，形成系統性偏誤。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "一定能讓模型參數量下降" },
      { id: "B", text: "不同模態提供互補資訊，可提升判斷的強健性" },
      { id: "C", text: "可以完全免除感測器校正的需求" },
      { id: "D", text: "能保證推論速度更快" },
    ],
    answer: "B",
    explanation:
      "振動可能受環境干擾、熱影像可能被遮蔽、文字紀錄可能不完整，但三者同時失真的機率遠低於單一來源。互補資訊帶來的強健性，正是多模態的核心價值。",
    choiceExplanations: {
      A: "多接一個模態通常要多一組編碼器，參數量往往上升而非下降。",
      C: "每一種感測器仍各自需要校正，模態變多反而讓校正工作增加。",
      D: "要處理多種輸入，推論成本一般會提高，速度不會因此變快。",
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
        C: "Overgeneralization",
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
      { id: "A", text: "時間序列預測加上分群" },
      { id: "B", text: "影像辨識／OCR 加上語言模型" },
      { id: "C", text: "強化學習加上關聯規則探勘" },
      { id: "D", text: "語音合成加上異常偵測" },
    ],
    answer: "B",
    explanation:
      "要先把手寫內容轉成可處理的文字或結構（影像辨識／OCR），再由語言模型理解解題步驟並產生回饋，兩段串接才能完成從照片到文字建議的流程。",
    choiceExplanations: {
      A: "時間序列與分群處理的是數值資料的走勢與群組，與辨識手寫內容無關。",
      C: "強化學習與關聯規則各有適用場景，但都無法把手寫影像轉成文字理解。",
      D: "語音合成是輸出語音，異常偵測是找離群樣本，兩者都對不上此流程。",
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
        C: "Neighbor Concept",
        D: "Neighbor Concept",
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
      { id: "A", text: "把影像轉成灰階" },
      { id: "B", text: "刪除所有感測資料只留影像" },
      { id: "C", text: "把所有資料依時間對齊並決定共同的時間粒度" },
      { id: "D", text: "把兩種資料分別建模後永不整合" },
    ],
    answer: "C",
    explanation:
      "不同來源要一起建模，前提是每一筆訓練樣本的各模態指向同一個時間區間。必須先決定共同粒度（例如以週為單位彙總感測資料），再依時間對齊，否則模型學到的是錯位的對應關係。",
    choiceExplanations: {
      A: "轉灰階會丟失作物與土壤的色彩資訊，且與時間對齊這個必要步驟無關。",
      B: "刪掉感測資料等於放棄多模態，回到單一來源，與題目的建模目標相違。",
      D: "永不整合就無法產生綜合判斷，失去結合兩種資料的意義。",
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
      { id: "A", text: "多模態驗證必然比單模態更快" },
      { id: "B", text: "只要有兩種模態就不需要考慮隱私法規" },
      { id: "C", text: "兩種生物特徵並用可降低單一模態被偽造時的風險" },
      { id: "D", text: "聲紋與人臉屬於非個人資料，可自由蒐集" },
    ],
    answer: "C",
    explanation:
      "攻擊者要同時偽造人臉與聲紋的難度遠高於偽造其中之一，因此多因子的生物特徵驗證能提高安全水準。這也是金融場域常見的設計。",
    choiceExplanations: {
      A: "要多做一次擷取與比對，整體驗證時間通常增加而非減少。",
      B: "模態越多、蒐集的生物特徵越多，隱私法規的要求只會更嚴格而非放寬。",
      D: "人臉與聲紋都是可識別特定個人的生物特徵，屬於高敏感個資，蒐集須有法律依據與告知同意。",
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
      { id: "C", text: "語音到語音" },
      { id: "D", text: "文字到語音" },
    ],
    answer: "A",
    explanation:
      "輸入是影像、輸出是文字描述，屬於影像到文字的生成任務（影像標題生成或報告生成）。醫療報告生成對事實正確性要求極高，實務上必須搭配醫師複核。",
    choiceExplanations: {
      B: "文字到影像是依描述生成圖片，方向與本任務相反。",
      C: "語音到語音處理的是聲音訊號的轉換，與 X 光影像無關。",
      D: "文字到語音是把文字唸出來，並未涉及影像理解。",
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
        D: "Neighbor Concept",
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
      { id: "B", text: "把熱影像的權重調到最高" },
      { id: "C", text: "取消所有其他模態，只保留熱影像" },
      { id: "D", text: "在鏡頭故障時輸出隨機結果" },
    ],
    answer: "A",
    explanation:
      "系統應該能察覺某個模態失效，並切換到只用其餘模態的備援模型或路徑，同時把可信度標示降低。這樣單點故障就不會拖垮整個判斷能力。",
    choiceExplanations: {
      B: "提高熱影像權重會讓系統對它更依賴，故障時的衝擊反而更大。",
      C: "只保留熱影像等於把單點故障變成唯一依賴，脆弱性升到最高。",
      D: "輸出隨機結果會讓下游做出錯誤決策，比明確回報失效危險得多。",
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
      { id: "A", text: "伺服器機殼的顏色" },
      { id: "B", text: "系統的介面是否使用最新的前端框架" },
      { id: "C", text: "模型是否使用最多的參數量" },
      { id: "D", text: "蒐集學生影像與語音是否具備法律依據與家長同意" },
    ],
    answer: "D",
    explanation:
      "涉及未成年人的影像與語音屬於高敏感個資，蒐集的法律依據與監護人同意是能不能做這件事的前提，必須在技術評估之前就確認。",
    choiceExplanations: {
      A: "機殼顏色與系統評估的任何實質面向都無關。",
      B: "前端框架是實作選擇，與是否可以合法蒐集資料無關。",
      C: "參數量多寡是技術規格，不會讓不合法的資料蒐集變得合法。",
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
      { id: "A", text: "先決定分析單元（如以田區為單位）並把兩種資料聚合到相同空間粒度" },
      { id: "B", text: "直接把兩種資料的數值相加" },
      { id: "C", text: "捨棄空間資訊，全部視為單一點" },
      { id: "D", text: "把衛星影像放大到與氣象站數量相同" },
    ],
    answer: "A",
    explanation:
      "多來源空間資料必須先統一分析單元，才能讓同一筆樣本的各欄位描述的是同一塊土地。以田區為單位聚合衛星像素、並對應到最近的氣象站資料，是遙測分析的標準做法。",
    choiceExplanations: {
      B: "兩種資料的單位與物理意義完全不同，相加沒有任何意義。",
      C: "捨棄空間資訊會讓不同田區的差異全部消失，無法做田區級的收成預測。",
      D: "把影像「放大」不會增加真實資訊，只是插值放大像素，並未解決粒度對齊問題。",
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
        D: "Overgeneralization",
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
      { id: "A", text: "以隨機值填補缺漏的檢驗值" },
      { id: "B", text: "改為晚期融合或加入模態缺失偵測與備援路徑，讓缺哪一個模態就以其餘模態的分支給出判斷並標示可信度下降" },
      { id: "C", text: "拒絕處理任何缺少模態的案例" },
      { id: "D", text: "提高影像模態的權重" },
    ],
    answer: "B",
    explanation:
      "早期融合把各模態的特徵拼接後一起學，缺一段就等於輸入殘缺。晚期融合讓每個模態各有分支，缺哪個就略過哪個；同時要讓系統誠實回報「這次的判斷可信度較低」。",
    choiceExplanations: {
      A: "隨機填值等於注入雜訊，在醫療場域可能導向完全錯誤的建議。",
      C: "真實病歷缺項極為常見，一律拒絕會讓系統在多數情境下無法使用。",
      D: "提高影像權重只是換一種依賴，檢驗值缺漏時仍然沒有補上資訊。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "把熱影像轉為灰階" },
      { id: "B", text: "決定共同的時間粒度並把兩種資料對齊到同一時間窗，例如把振動彙總為每分鐘的統計特徵" },
      { id: "C", text: "把振動訊號降頻到每分鐘一筆取樣值" },
      { id: "D", text: "兩種資料分別建模且永不整合" },
    ],
    answer: "B",
    explanation:
      "兩種資料的取樣頻率差了六萬倍，不先對齊到同一時間單位，每一筆訓練樣本的兩個模態就描述著不同時刻。彙總為統計特徵能在對齊的同時保留振動的波動資訊。",
    choiceExplanations: {
      A: "轉灰階會丟失熱影像最關鍵的溫度色彩資訊，且與對齊無關。",
      C: "每分鐘只取一個瞬間值會丟掉振動的波動特性，不如彙總統計量。",
      D: "不整合就無法產生綜合判斷，違背多模態的目的。",
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
      { id: "A", text: "加入活體偵測等與偽造管道不同的驗證因子，因為兩種模態若能被同一段偽造影片一次騙過，多模態的獨立性假設就不成立" },
      { id: "B", text: "提高人臉比對的相似度門檻" },
      { id: "C", text: "增加聲紋樣本的長度" },
      { id: "D", text: "改為只用人臉單一模態" },
    ],
    answer: "A",
    explanation:
      "多模態之所以更安全，前提是兩個模態要分別被攻破。一旦同一段偽造影片能同時提供臉與聲，兩者就不再獨立，安全增益大幅縮水。要補的是走另一條管道的因子，例如活體偵測或裝置綁定。",
    choiceExplanations: {
      B: "提高門檻會增加正常使用者被拒的機率，對高品質偽造仍可能通過。",
      C: "樣本更長對同步偽造的影片沒有幫助，偽造語音同樣可以更長。",
      D: "減少模態只會讓攻擊面更集中，安全性下降。",
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
        D: "Wrong Trade-off",
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
      { id: "A", text: "應先設計儀表板的配色" },
      { id: "B", text: "應先決定使用哪一種融合策略" },
      { id: "C", text: "應先採購足夠的 GPU" },
      { id: "D", text: "未成年人的影像與語音屬高敏感個資，蒐集的法律依據與監護人同意是能否進行的前提，應在技術規劃之前確認" },
    ],
    answer: "D",
    explanation:
      "合法性是前提而不是其中一個項目。若蒐集本身不被允許，後面的架構、模型與硬體全部作廢。這類問題必須排在技術規劃之前確認，而不是等系統做完才發現不能上線。",
    choiceExplanations: {
      A: "配色屬於呈現層細節，與能否合法蒐集無關。",
      B: "融合策略是技術選擇，前提不成立時沒有意義。",
      C: "硬體採購同樣建立在專案能執行的前提上。",
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
        B: "Layer Confusion",
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
      { id: "A", text: "捨棄空間資訊，全部視為單一點" },
      { id: "B", text: "把衛星影像插值放大到與氣象站數量相同" },
      { id: "C", text: "先決定以田區為分析單元，把衛星像素聚合到田區、並把最近氣象站的資料對應到該田區" },
      { id: "D", text: "把兩種資料的數值直接相加" },
    ],
    answer: "C",
    explanation:
      "兩種資料的空間解析度差距極大，必須先統一分析單元，同一筆樣本的各欄位才會描述同一塊土地。以田區為單元既符合實際的管理與決策粒度，也讓兩者都能對應上。",
    choiceExplanations: {
      A: "捨棄空間資訊會讓不同田區的差異全部消失，無法做田區級預測。",
      B: "插值放大不會增加真實資訊，也沒有解決粒度對齊的問題。",
      D: "兩者的單位與物理意義完全不同，相加沒有任何意義。",
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
      { id: "A", text: "模型參數量、程式語言、開發者人數" },
      { id: "B", text: "專案名稱、簡報張數、會議次數" },
      { id: "C", text: "伺服器品牌、機房位置、電力費率" },
      { id: "D", text: "資料可得性、商業價值、技術可行性" },
    ],
    answer: "D",
    explanation:
      "導入評估要同時回答三件事：有沒有資料可以做（資料可得性）、做了值不值得（商業價值）、做不做得出來（技術可行性）。任一項不成立，專案都難以落地。",
    choiceExplanations: {
      A: "這些是實作層面的細節，要等題目選定後才需要決定，無法用來篩選題目。",
      B: "這些是行政產出，與專案能否成功沒有因果關係。",
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
      { id: "A", text: "立即開始訓練模型" },
      { id: "B", text: "先建立資料蒐集與標註流程，把這個題目排到後期" },
      { id: "C", text: "改用參數更大的模型以彌補資料不足" },
      { id: "D", text: "直接購買其他公司的模型即可" },
    ],
    answer: "B",
    explanation:
      "沒有可用的歷史資料與標籤，任何監督式模型都無從訓練。務實的做法是先把資料基礎建立起來（數位化、定義標註規範、開始累積），把這個題目排到資料成熟之後。",
    choiceExplanations: {
      A: "沒有訓練資料就無法訓練，這一步在技術上根本不可能執行。",
      C: "模型再大也需要資料才能學到這個場域的規律，參數量無法取代資料。",
      D: "他人的模型是在別的資料分布上訓練的，未必適用本場域，且仍需資料驗證成效。",
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
      { id: "A", text: "訓練用的顯示卡型號" },
      { id: "B", text: "專案的簡報配色" },
      { id: "C", text: "模型決策的可解釋性與主管機關的合規要求" },
      { id: "D", text: "模型檔案的副檔名" },
    ],
    answer: "C",
    explanation:
      "信用評分屬於高度受監理的決策，若模型無法說明拒貸理由，即使準確率再高也不能上線。可解釋性與合規要求是這個題目的可行性前提，必須在評估階段就確認。",
    choiceExplanations: {
      A: "硬體型號屬於實作階段的採購細節，不影響這個題目能不能做。",
      B: "簡報配色與專案的可行性、合規性完全無關。",
      D: "檔案格式是工程細節，不會決定專案是否通過評估。",
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
        A: "Layer Confusion",
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
      { id: "A", text: "讓公司更有科技感" },
      { id: "B", text: "在六個月內把人工複驗的工時降低 30%" },
      { id: "C", text: "使用最先進的深度學習模型" },
      { id: "D", text: "產出一份技術白皮書" },
    ],
    answer: "B",
    explanation:
      "可驗收的成功指標必須具體、可量化、有時限，並且對應到實際的營運改善。「六個月內工時降低 30%」三者俱全，事後可以明確判定達成與否。",
    choiceExplanations: {
      A: "「有科技感」無法量測，也沒有對應的營運效益，無從驗收。",
      C: "使用什麼模型是手段而非目的，先進不等於解決了商業問題。",
      D: "白皮書是產出物，不代表流程或成本真的改善了。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "應改用更慢但更準的模型" },
      { id: "B", text: "應重新檢視此專案的價值主張，效率並非其效益來源" },
      { id: "C", text: "應該取消人工複核以節省時間" },
      { id: "D", text: "只要模型準確率夠高就一定值得導入" },
    ],
    answer: "B",
    explanation:
      "既然導入後反而更慢，效率就不是這個專案的效益來源。此時應回頭問：它帶來的是漏診率下降、判讀一致性提升，還是夜間人力覆蓋？若這些都說不出來，就該重新檢視是否值得做。",
    choiceExplanations: {
      A: "更慢的模型會讓已經不利的效率比較更糟，除非準確率提升帶來明確的臨床效益。",
      C: "醫療判讀取消人工複核會把風險轉嫁給病患，是不可接受的取捨。",
      D: "準確率高不等於有價值，若既有流程已經又快又準，導入的邊際效益可能很小。",
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
      { id: "A", text: "取代需求訪談" },
      { id: "B", text: "直接產出可上線的完整系統" },
      { id: "C", text: "以有限成本驗證關鍵假設是否成立，再決定是否投入正式開發" },
      { id: "D", text: "確保專案一定會成功" },
    ],
    answer: "C",
    explanation:
      "PoC 的價值在於用小成本把最不確定的假設先試出來——資料夠不夠、模型能不能達到門檻、使用者願不願意用。驗證失敗也是有價值的結果，因為它讓公司避免更大的投入。",
    choiceExplanations: {
      A: "PoC 驗證的是技術與資料假設，並不能取代釐清需求與流程的訪談。",
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
      { id: "A", text: "程式碼的註解風格" },
      { id: "B", text: "模型訓練所用的優化器" },
      { id: "C", text: "部署架構的選擇（端側推論或雲端推論）" },
      { id: "D", text: "專案的會計科目" },
    ],
    answer: "C",
    explanation:
      "網路不穩代表雲端推論在現場可能無法使用，必須評估把模型壓縮後放到手機端執行。這是使用情境直接決定技術架構的典型例子，必須在評估階段就釐清。",
    choiceExplanations: {
      A: "註解風格屬於開發規範，與使用情境的限制無關。",
      B: "優化器影響訓練過程的收斂，與現場網路狀況無關。",
      D: "會計科目是財務作業，不會因為網路訊號而改變技術可行性。",
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
        A: "Layer Confusion",
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
      { id: "A", text: "有大量重複的判斷、判斷依據難以窮舉成規則、且有歷史決策紀錄" },
      { id: "B", text: "規則明確且極少例外，用簡單條件判斷即可完成" },
      { id: "C", text: "每個案例都獨一無二且沒有任何歷史紀錄" },
      { id: "D", text: "流程每週都會整個改變一次" },
    ],
    answer: "A",
    explanation:
      "AI 最能發揮的地方是「人做得到但很難寫成規則、且做很多次」的判斷，加上有歷史紀錄可供學習。三個條件同時成立時，導入的效益與可行性都最高。",
    choiceExplanations: {
      B: "規則明確又少例外的流程，用傳統程式邏輯就能解決，導入 AI 是殺雞用牛刀。",
      C: "每個案例都獨特且無歷史紀錄，模型沒有可學習的規律，也無從驗證成效。",
      D: "流程頻繁劇烈變動會讓訓練資料迅速失效，模型永遠追不上實際作業方式。",
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
      { id: "B", text: "第一次購買伺服器的費用" },
      { id: "C", text: "專案啟動會議的場地費" },
      { id: "D", text: "官方網站的網域費用" },
    ],
    answer: "A",
    explanation:
      "模型上線只是開始：資料分布會漂移、內容會更新、效能要持續監控、模型要定期重訓。這些長期營運成本往往在初期預算中被嚴重低估，卻是決定專案能否持續的關鍵。",
    choiceExplanations: {
      B: "硬體採購是一次性且金額明確的支出，通常在初期就會被完整估算。",
      C: "場地費屬於金額極小的行政成本，不構成專案的成本風險。",
      D: "網域費用一年僅數百至數千元，對整體成本結構影響微乎其微。",
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
      { id: "A", text: "供應商的品牌知名度" },
      { id: "B", text: "產品說明書的頁數" },
      { id: "C", text: "同業採用哪一家廠商" },
      { id: "D", text: "長期需要的資料科學與維運團隊人力" },
    ],
    answer: "D",
    explanation:
      "自建的隱形成本主要在人：模型要有人持續調整、資料管線要有人維護、上線後要有人監控。這筆長期人力支出往往超過採購授權費，是自建或採購決策的核心變數。",
    choiceExplanations: {
      A: "品牌知名度是採購方案的考量，與自建的成本結構無關。",
      B: "說明書頁數與成本評估沒有實質關聯。",
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
      { id: "B", text: "字數太少" },
      { id: "C", text: "沒有使用英文撰寫" },
      { id: "D", text: "沒有附上模型架構圖" },
    ],
    answer: "A",
    explanation:
      "沒有基準線（現況數值）就沒有比較的起點，上線後不論結果如何都可以宣稱有改善，也可以被質疑沒有改善。任何成效宣稱都必須先量測現況。",
    choiceExplanations: {
      B: "報告的問題在於缺少關鍵資訊，不是篇幅長短。",
      C: "撰寫語言不影響評估的實質品質。",
      D: "架構圖有助理解實作方式，但缺少它不會讓成效無法驗證。",
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
      { id: "A", text: "優先選技術最困難的，因為挑戰大成果才顯著" },
      { id: "B", text: "優先選技術可行性最高、且失敗後果可承受的題目，先建立基準與信任，再處理難度高的" },
      { id: "C", text: "四案並行，三個月後比較誰先做出來" },
      { id: "D", text: "依提案部門的層級決定" },
    ],
    answer: "B",
    explanation:
      "時程只有三個月時，能不能做出來比值不值得做更關鍵——後者四案本來就相近。先在可行性高的題目上做出可驗證的成果，組織的信任與經驗都會成為下一題的資本。",
    choiceExplanations: {
      A: "難度高的題目在三個月內做不出成果的機率大，失敗還會消耗組織對 AI 的信心。",
      C: "四案並行會讓資源稀釋，很可能四案都做不完。",
      D: "部門層級是政治因素，與專案能否成功沒有因果關係。",
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
      { id: "A", text: "應取消人工複核以把時間補回來" },
      { id: "B", text: "因為變慢了，應直接否決" },
      { id: "C", text: "效率不是此案的效益來源，應改以「夜間覆蓋率」與「夜間到隔日確診的時間縮短」等指標重新定義價值主張" },
      { id: "D", text: "應改用更快但較不準確的模型" },
    ],
    answer: "C",
    explanation:
      "導入後變慢，代表效率不是它的價值所在。但「原本夜間沒有判讀、現在有了」是真實的效益，只是要用對的指標去衡量——衡量錯了，一個有價值的專案會被誤判為失敗。",
    choiceExplanations: {
      A: "取消複核會把風險轉嫁給病患，且並未回應價值主張的問題。",
      B: "以效率為唯一判準會漏掉夜間覆蓋這項真正的效益。",
      D: "犧牲準確度在醫療判讀上代價過高，也不是效益的來源。",
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
      { id: "A", text: "名片印刷費" },
      { id: "B", text: "專案啟動會議的場地費" },
      { id: "C", text: "官方網站的網域費用" },
      { id: "D", text: "上線後的持續監控、資料管線維護、定期重訓與模型升級的重測人力" },
    ],
    answer: "D",
    explanation:
      "模型上線只是開始：資料會漂移、內容會更新、效能要有人盯、模型一升級整套流程要重測。這些長期人力支出往往超過授權費本身，卻因為分散在各期而最容易在初期預算中被忽略。",
    choiceExplanations: {
      A: "名片印刷與專案成本結構無關。",
      B: "場地費是一次性且金額極小的行政成本。",
      C: "網域費用一年僅數千元，對成本結構影響微乎其微。",
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
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
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
      { id: "A", text: "乙較適合——AI 的價值在於處理難以寫成規則的判斷；甲已有低錯誤率的規則引擎，導入 AI 的邊際效益有限" },
      { id: "B", text: "甲較適合，因為執行次數多" },
      { id: "C", text: "兩者都不適合" },
      { id: "D", text: "應依哪個部門先提案決定" },
    ],
    answer: "A",
    explanation:
      "次數多不等於值得導入。甲的規則已經寫得出來且錯誤率低，AI 能改善的空間很小；乙的判斷寫不成規則、又高度依賴少數人的經驗，正是機器學習最能發揮也最能降低組織風險的地方。",
    choiceExplanations: {
      B: "執行次數只反映規模，甲的既有解法已經夠好，替換的效益有限。",
      C: "乙符合「難以規則化且有經驗可學」的條件，是合適的候選。",
      D: "提案順序與專案價值無關。",
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
        D: "Wrong Trade-off",
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
      { id: "A", text: "把報告翻譯成英文" },
      { id: "B", text: "補上模型架構圖" },
      { id: "C", text: "補上供應商簡介" },
      { id: "D", text: "以相同口徑量測現況作為基準線，並明確定義驗收時要比較的指標、期間與達標門檻" },
    ],
    answer: "D",
    explanation:
      "沒有基準線就沒有比較的起點——上線後不論結果如何都可以宣稱有改善，也可以被質疑沒有改善。基準、指標、期間、門檻四者齊備，驗收才有客觀依據。",
    choiceExplanations: {
      A: "語言不影響評估的實質品質。",
      B: "架構圖有助理解實作，但缺少它不會讓成效無法驗證。",
      C: "供應商簡介屬於採購資訊，與成效驗收無關。",
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
        A: "Layer Confusion",
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
      { id: "A", text: "資料準備 → 部署 → 問題定義 → 驗證" },
      { id: "B", text: "模型開發 → 問題定義 → 部署 → 資料準備" },
      { id: "C", text: "部署 → 監控 → 問題定義 → 模型開發" },
      { id: "D", text: "問題定義 → 資料準備 → 模型開發 → 驗證 → 部署 → 監控" },
    ],
    answer: "D",
    explanation:
      "先確定要解決什麼問題與成功標準，才知道要準備什麼資料；資料備妥後開發與驗證，通過後部署，上線後持續監控並回饋到下一輪。順序顛倒會導致做出無人需要的模型。",
    choiceExplanations: {
      A: "在問題定義之前準備資料，會不知道該蒐集哪些欄位與標籤。",
      B: "先開發模型再定義問題，等於還不知道要解什麼就開始解，方向極可能錯誤。",
      C: "尚未開發模型就先部署，沒有東西可以部署，順序在邏輯上不成立。",
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
      { id: "A", text: "模型表現良好即可" },
      { id: "B", text: "在獨立測試集上瑕疵類別召回率不低於 95%，且誤報率不高於 5%" },
      { id: "C", text: "使用者覺得好用" },
      { id: "D", text: "模型訓練不出錯" },
    ],
    answer: "B",
    explanation:
      "驗收標準要指明「在什麼資料上、用什麼指標、達到什麼數值」。同時給出召回與誤報兩個方向的門檻，也避免了只顧一邊而讓另一邊崩壞的情況。",
    choiceExplanations: {
      A: "「表現良好」沒有指標也沒有門檻，雙方對它的解讀必然不同。",
      C: "使用者感受重要但主觀，應轉化為可量測的行為指標（如採用率、修正次數）。",
      D: "訓練能跑完只是最基本的技術前提，完全不代表模型有用。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "可以完全省略模型驗證" },
      { id: "B", text: "確保模型永遠不會出錯" },
      { id: "C", text: "縮小失敗影響範圍，並在擴大前取得真實使用回饋" },
      { id: "D", text: "可以不必訓練醫護人員" },
    ],
    answer: "C",
    explanation:
      "試行讓問題在可控範圍內先暴露出來——流程卡在哪、使用者會怎麼誤用、實際成效與預期差多少。這些回饋在擴大前修正，成本遠低於全院上線後才發現。",
    choiceExplanations: {
      A: "試行是在真實環境驗證，並不取代上線前的技術驗證，兩者互補。",
      B: "沒有任何做法能保證模型不出錯，試行的目的是及早發現而非消除錯誤。",
      D: "試行階段反而更需要教育訓練，才能取得有效的使用回饋。",
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
      { id: "A", text: "撰寫模型的訓練程式" },
      { id: "B", text: "定義問題邊界、判定標註規則與驗證結果是否符合實務" },
      { id: "C", text: "採購伺服器硬體" },
      { id: "D", text: "設計資料庫索引" },
    ],
    answer: "B",
    explanation:
      "領域專家掌握的是資料科學家沒有的實務知識：哪些情況算異常、標註界線畫在哪、模型的輸出在現場合不合理。缺了這一角，模型很容易學到看似合理卻不符實務的規律。",
    choiceExplanations: {
      A: "撰寫訓練程式是資料科學家或機器學習工程師的職責。",
      C: "硬體採購屬於 IT 或採購單位的工作範圍。",
      D: "資料庫索引設計是資料工程師的專業，與領域知識不同。",
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
      { id: "A", text: "隱藏系統是 AI 的事實" },
      { id: "B", text: "設計信心分數低時自動轉真人客服的機制" },
      { id: "C", text: "把所有問題都交給模型回答以最大化自動化率" },
      { id: "D", text: "取消所有客服紀錄以節省儲存空間" },
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
      { id: "A", text: "標註工作的午餐供應方式" },
      { id: "B", text: "標註者的座位安排" },
      { id: "C", text: "標註規範文件與標註者間一致性的檢核機制" },
      { id: "D", text: "標註軟體的介面配色" },
    ],
    answer: "C",
    explanation:
      "標註品質的兩大支柱是「規範寫清楚」與「檢核有沒有做到」。前者讓不同標註者面對相同案例時判斷一致，後者以重疊標註計算一致性指標，及早發現規範模糊之處。",
    choiceExplanations: {
      A: "餐飲安排屬於行政福利，與標註品質無關。",
      B: "座位安排屬於工作環境，對標註標準是否一致沒有直接影響。",
      D: "介面配色影響操作舒適度，但無法確保判斷標準一致。",
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
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "把所有預測結果直接刪除" },
      { id: "B", text: "每月更換一次模型架構" },
      { id: "C", text: "模型效能與資料分布的持續監控與告警" },
      { id: "D", text: "停止蒐集新資料" },
    ],
    answer: "C",
    explanation:
      "農業資料有明顯的季節性，模型效能會隨作物週期與天候變化而漂移。持續監控輸入分布與預測品質並設定告警，才能在效能下滑時及時察覺並重訓。",
    choiceExplanations: {
      A: "刪除預測結果就失去了與實際結果比對、評估模型表現的依據。",
      B: "頻繁更換架構會讓系統不穩定，且沒有證據支持每月都需要換。",
      D: "停止蒐集新資料會讓模型無法因應變化，也無從重訓。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "說明 AI 的定位是輔助而非取代，並讓第一線參與設計與試用" },
      { id: "B", text: "在上線當天才通知使用者" },
      { id: "C", text: "以裁員作為導入的宣傳重點" },
      { id: "D", text: "禁止使用者提出任何回饋" },
    ],
    answer: "A",
    explanation:
      "抗拒多半來自不確定感與被取代的恐懼。明確說明定位、讓第一線在設計階段就參與並試用，既能降低疑慮，也能讓系統更貼近實際作業方式。",
    choiceExplanations: {
      B: "臨上線才通知會讓使用者措手不及，抗拒與誤用的機率大幅提高。",
      C: "以裁員為訴求會直接激化抗拒，也違背輔助定位的溝通策略。",
      D: "禁止回饋不僅無法消除抗拒，還會讓真實的使用問題被掩蓋。",
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
        B: "Wrong Trade-off",
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
      { id: "A", text: "提供一個簡單可比較的參考點，用以判斷複雜模型是否真的有增益" },
      { id: "B", text: "作為最終上線的模型" },
      { id: "C", text: "取代測試集" },
      { id: "D", text: "決定專案預算" },
    ],
    answer: "A",
    explanation:
      "沒有基準就無法判斷「85% 準確率」到底是好是壞。先用規則法或簡單模型建立基準，複雜模型必須明顯超越它才值得付出額外的複雜度與維運成本。",
    choiceExplanations: {
      B: "基準模型有時確實夠好而直接上線，但那是結果而非它被建立的目的。",
      C: "基準模型與測試集是兩回事：一個是比較對象，一個是評估用的資料。",
      D: "預算取決於範疇與資源規劃，與是否建立基準模型無關。",
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
      { id: "A", text: "減少伺服器成本" },
      { id: "B", text: "避免撰寫測試程式" },
      { id: "C", text: "加快模型訓練速度" },
      { id: "D", text: "在相近的使用者族群上比較兩種版本的實際成效差異" },
    ],
    answer: "D",
    explanation:
      "A/B 測試把使用者隨機分到兩組，讓兩版本在同期、相近族群上比較，排除季節與族群差異的干擾，因此能較可信地歸因成效差異來自版本本身。",
    choiceExplanations: {
      A: "同時運行兩個版本通常增加而非減少資源消耗。",
      B: "A/B 測試驗證的是成效，程式的正確性仍需要單元與整合測試把關。",
      C: "A/B 測試發生在上線後的評估階段，與訓練速度無關。",
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
        C: "Layer Confusion",
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
      { id: "A", text: "同時追蹤技術指標與業務指標，並以業務指標作為專案成敗的依據" },
      { id: "B", text: "只看準確率，忽略採納率" },
      { id: "C", text: "只看採納率，不必評估模型品質" },
      { id: "D", text: "兩者都不追蹤，改看專案時程" },
    ],
    answer: "A",
    explanation:
      "準確率高但沒人用，專案就沒有創造價值；採納率高但預測品質差，反而造成錯誤決策。兩者都要追蹤，而最終成敗應以業務結果認定。",
    choiceExplanations: {
      B: "只看準確率會讓專案在技術上成功、在實務上失敗，這是 AI 專案最常見的死法。",
      C: "不評估模型品質，可能推廣了一個持續給出錯誤建議的系統。",
      D: "時程只反映有沒有準時，完全不反映做出來的東西有沒有用。",
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
      { id: "A", text: "這是模型容量不足，應改用更大的模型" },
      { id: "B", text: "試行範圍不具代表性——擴大前應先評估各科的資料異質性，並以涵蓋多科的樣本重新驗證與調整" },
      { id: "C", text: "應要求全院統一病歷書寫格式後再上線" },
      { id: "D", text: "應退回只服務原本那一科" },
    ],
    answer: "B",
    explanation:
      "試行的意義在於「小範圍但可推論到全體」。這裡的試行範圍雖小卻不具代表性，成功的結論因此推不出去。正確的處置是先量出各科的異質性，再決定要補樣本、分科建模，還是統一前處理。",
    choiceExplanations: {
      A: "模型再大也補不上訓練時完全沒見過的書寫慣例。",
      C: "要求全院改變書寫慣例的推動成本極高，且不應由 AI 專案來承擔。",
      D: "退回原科等於放棄擴大的效益，也沒有解決可推論性的問題。",
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
      { id: "A", text: "改為在獨立測試集上「意圖分類召回率不低於 92%、誤答率不高於 3%、且低信心時轉真人的比例不超過 20%」等多項可量測條件" },
      { id: "B", text: "改為「使用者覺得好用」" },
      { id: "C", text: "改為「模型訓練不出錯」" },
      { id: "D", text: "維持單一準確率門檻即可" },
    ],
    answer: "A",
    explanation:
      "單一準確率會讓模型有動機在不確定時硬答。把驗收拆成召回、誤答與轉人工比例三項，就同時綁住了「要抓得到」「不能亂答」「不能什麼都推給人」三個方向，任何一項被犧牲都會被發現。",
    choiceExplanations: {
      B: "主觀感受無法量測，雙方對它的解讀必然不同。",
      C: "訓練能跑完只是最基本的技術前提，完全不代表模型有用。",
      D: "單一門檻正是技術端指出的問題所在，維持不變等於沒有處理。",
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
        B: "Wrong Trade-off",
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
      { id: "A", text: "增加訓練輪數" },
      { id: "B", text: "要求現場人員一律以模型判定為準" },
      { id: "C", text: "由領域專家與現場人員共同界定標註規則與模糊案例的判準，並以重疊標註量測一致性後再重新標註" },
      { id: "D", text: "改用更複雜的模型架構" },
    ],
    answer: "C",
    explanation:
      "模型學到的就是標註定義的東西。標註規則由不熟悉現場的人單獨制定，模型自然會與現場的實務判準脫節。要修的是規則本身，並用重疊標註把「大家其實看法不同」這件事量出來。",
    choiceExplanations: {
      A: "訓練再久，學到的仍是同一套有問題的標註定義。",
      B: "以模型為準等於把錯誤的定義固定下來，現場的專業判斷被否定。",
      D: "架構再複雜也無法修正標註本身的定義偏差。",
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
      { id: "A", text: "明確承諾並以制度落實「本工具的輸出不作為教師考評依據」，同時讓教師參與後續調整" },
      { id: "B", text: "加強說明模型的技術原理" },
      { id: "C", text: "要求教師必須使用並納入考評" },
      { id: "D", text: "停用工具" },
    ],
    answer: "A",
    explanation:
      "抗拒的根源不是不懂技術，而是擔心資料被轉用來評鑑自己。這種疑慮只能用制度回應——明確界定用途邊界並落實，再讓使用者參與調整以建立信任。",
    choiceExplanations: {
      B: "技術說明無法回應「這會不會被拿來考核我」的疑慮。",
      C: "納入考評正好坐實了教師的擔憂，抗拒只會加劇。",
      D: "停用放棄了工具的價值，且問題出在用途界定而非工具本身。",
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
      { id: "A", text: "不需監控，每年重訓一次" },
      { id: "B", text: "只在季末量測一次準確率即可" },
      { id: "C", text: "只監控伺服器的 CPU 使用率" },
      { id: "D", text: "以輸入特徵分布與預測分布的漂移作為早期警訊，季末再以實際收成回頭校準模型效能" },
    ],
    answer: "D",
    explanation:
      "標籤延遲一整季時，等真實結果才發現問題已經來不及。分布漂移是可以立即量測的替代訊號——輸入或輸出的分布一變，就先示警；等實際收成回來，再拿來校準效能與重訓。",
    choiceExplanations: {
      A: "沒有監控就不知道何時該重訓，一年的間隔在季節性明顯的農業中太長。",
      B: "季末才量測，中間三個月的錯誤預測已經影響了農務決策。",
      C: "CPU 使用率反映系統負載，模型全部答錯時它可能完全正常。",
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
      { id: "A", text: "使用者介面不友善" },
      { id: "B", text: "模型推論速度不足" },
      { id: "C", text: "資料庫容量不足" },
      { id: "D", text: "演算法偏見與間接歧視" },
    ],
    answer: "D",
    explanation:
      "郵遞區號常與族群或社經背景高度相關，即使模型沒有直接使用敏感屬性，仍可能透過這種代理變數產生系統性的差別待遇，形成間接歧視。",
    choiceExplanations: {
      A: "介面友善度影響使用體驗，不會改變模型對不同區域的判斷傾向。",
      B: "推論速度是效能問題，不會造成特定群體的核准率偏低。",
      C: "資料庫容量影響的是儲存與查詢，與判斷結果的公平性無關。",
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
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
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
      { id: "A", text: "模型大小與訓練時間" },
      { id: "B", text: "發生機率與影響程度" },
      { id: "C", text: "團隊人數與會議次數" },
      { id: "D", text: "開發成本與程式行數" },
    ],
    answer: "B",
    explanation:
      "風險矩陣以「多可能發生」與「發生了有多嚴重」兩軸定位每項風險，落在高機率高影響象限者優先處理。這是把有限的緩解資源用在刀口上的標準工具。",
    choiceExplanations: {
      A: "模型大小與訓練時間是技術規格，不構成風險的評估維度。",
      C: "團隊規模與會議頻率反映的是投入程度，與風險本身的性質無關。",
      D: "開發成本與程式規模屬於專案管理指標，不用來評估風險嚴重度。",
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
        A: "Layer Confusion",
        C: "Layer Confusion",
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
      { id: "A", text: "隱藏模型的不確定性資訊" },
      { id: "B", text: "把模型結果設為預設答案並自動送出" },
      { id: "C", text: "在介面上呈現模型的信心程度與依據，並保留醫師獨立判斷的流程設計" },
      { id: "D", text: "要求醫師必須採納模型建議" },
    ],
    answer: "C",
    explanation:
      "自動化偏誤來自「看到答案就照著點」。呈現信心程度與判斷依據，讓醫師知道何時該多看兩眼，並在流程上保留獨立判斷的空間，才能維持人的把關作用。",
    choiceExplanations: {
      A: "隱藏不確定性會讓使用者高估模型可靠度，加重過度依賴。",
      B: "預設並自動送出等於把決定權交給模型，正是要避免的過度依賴。",
      D: "強制採納直接取消了人的判斷，風險完全轉嫁給模型。",
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
        D: "Wrong Trade-off",
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
      { id: "A", text: "指模型檔案在傳輸中損毀" },
      { id: "B", text: "指真實世界的資料分布或輸入與答案的關係隨時間改變，使模型效能下降" },
      { id: "C", text: "指模型參數量隨時間自動增加" },
      { id: "D", text: "指模型的推論速度變慢" },
    ],
    answer: "B",
    explanation:
      "漂移分兩種：輸入分布變了（資料漂移），或輸入與正確答案的關係變了（概念漂移）。兩者都會讓當初訓練好的模型逐漸失準，因此上線後必須持續監控。",
    choiceExplanations: {
      A: "檔案損毀是資訊完整性問題，會造成模型完全無法載入，而非效能緩慢下降。",
      C: "模型參數量在部署後是固定的，不會自行增加。",
      D: "推論變慢屬於效能與資源問題，與預測準確度下降是不同現象。",
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
        C: "Overgeneralization",
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
      { id: "A", text: "延長模型的訓練時間" },
      { id: "B", text: "以對抗樣本進行訓練並限制模型輸入的異常值範圍" },
      { id: "C", text: "把模型改成單執行緒運作" },
      { id: "D", text: "增加伺服器的硬碟容量" },
    ],
    answer: "B",
    explanation:
      "對抗式攻擊以人眼難以察覺的擾動誘使模型誤判。以對抗樣本納入訓練可提升模型的韌性，輸入端的異常檢查則能擋掉明顯不合理的資料，兩者互補。",
    choiceExplanations: {
      A: "單純延長訓練時間可能導致過擬合，對抵抗刻意設計的擾動沒有幫助。",
      C: "執行緒數量影響效能，不改變模型對擾動的敏感度。",
      D: "硬碟容量與模型是否容易被擾動誤導完全無關。",
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
        C: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "不揭露任何評分依據" },
      { id: "B", text: "宣稱模型絕對客觀" },
      { id: "C", text: "公開評分向度與權重，並提供申訴與人工複評管道" },
      { id: "D", text: "以模型準確率數字回應所有質疑" },
    ],
    answer: "C",
    explanation:
      "信任來自可檢驗與可救濟。把評分向度與權重講清楚，讓學生知道被評的是什麼；再提供申訴與人工複評，讓錯誤有被糾正的途徑，質疑自然下降。",
    choiceExplanations: {
      A: "不揭露依據只會加深疑慮，也讓錯誤無從發現。",
      B: "模型從資料學習，必然帶有資料中的偏誤，宣稱絕對客觀既不真實也無法佐證。",
      D: "整體準確率無法回答「我這一份為什麼被評這個分數」的個案質疑。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "訓練資料的檔案命名規則" },
      { id: "B", text: "模型使用的深度學習框架版本" },
      { id: "C", text: "責任歸屬、異常升級流程與人工介入的時機" },
      { id: "D", text: "機台的塗裝顏色" },
    ],
    answer: "C",
    explanation:
      "AI 會出錯是必然，事前沒有講清楚誰負責、何時該升級處理、什麼情況必須人工介入，事故發生時就只剩推諉。這些是導入前就該白紙黑字寫下的治理安排。",
    choiceExplanations: {
      A: "檔案命名影響開發便利性，不構成風險管理的要件。",
      B: "框架版本屬於技術實作細節，與事故發生後的處理責任無關。",
      D: "塗裝顏色與品檢錯誤的處理流程毫無關聯。",
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
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "依應用場域的風險高低採取分級管理，高風險應用有較嚴格的要求" },
      { id: "B", text: "所有 AI 應用一律適用相同強度的規範" },
      { id: "C", text: "只要不涉及個資就完全不受規範" },
      { id: "D", text: "只有政府機關使用的 AI 才需要治理" },
    ],
    answer: "A",
    explanation:
      "風險分級是當前主流思路：一般應用維持較低的合規負擔，涉及人身安全、基本權利或重大決策的高風險應用，則附加資料治理、文件紀錄、人為監督等義務。",
    choiceExplanations: {
      B: "一體適用會讓低風險應用背負過重成本，也可能對高風險應用管得不夠。",
      C: "AI 風險不只涉及個資，安全、公平與可靠性同樣受到規範關注。",
      D: "民間高風險應用（如醫療、金融、招募）同樣是治理重點。",
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
        C: "Overgeneralization",
        D: "Overgeneralization",
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
      { id: "B", text: "模型的學習率設定過高" },
      { id: "C", text: "資料庫索引失效" },
      { id: "D", text: "使用者操作錯誤" },
    ],
    answer: "A",
    explanation:
      "模型只見過乾旱年的樣態，豪雨年的災損型態、理賠金額分布都在它的經驗之外。這是代表性不足的資料造成的泛化失敗，要靠補齊涵蓋各種天候的樣本來解決。",
    choiceExplanations: {
      B: "學習率問題會在訓練階段就表現為不收斂或震盪，而非上線後遇到新情境才失準。",
      C: "索引失效影響查詢效率，不會改變模型的判斷品質。",
      D: "使用者操作與模型面對未見過的天候型態無關。",
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
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "只在每年年底人工檢查一次" },
      { id: "B", text: "只記錄呼叫次數" },
      { id: "C", text: "只監控伺服器的 CPU 使用率" },
      { id: "D", text: "同時監控輸入資料的統計分布與模型輸出的分布變化，並設定告警門檻" },
    ],
    answer: "D",
    explanation:
      "失準往往先反映在分布上：輸入的特徵分布偏移、或輸出的類別比例異常。同時監控兩者並設門檻告警，能在使用者抱怨之前就發現問題。",
    choiceExplanations: {
      A: "一年檢查一次的間隔太長，問題可能已經影響了數個月的決策。",
      B: "呼叫次數只說明有多少人在用，完全不反映答得對不對。",
      C: "CPU 使用率反映系統負載，模型答錯時 CPU 可能完全正常。",
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
        B: "Neighbor Concept",
        C: "Layer Confusion",
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
      { id: "A", text: "記錄每次推論的輸入、模型版本、輸出與時間，並可回溯查詢" },
      { id: "B", text: "把所有紀錄定期刪除" },
      { id: "C", text: "只保留最終決策結果" },
      { id: "D", text: "把模型版本號隱藏起來" },
    ],
    answer: "A",
    explanation:
      "事後要查「那天為什麼判成這樣」，必須能還原當時的輸入、用的是哪一版模型、輸出了什麼。缺少任何一項，爭議就無從釐清，改進也失去依據。",
    choiceExplanations: {
      B: "定期刪除紀錄會讓可追溯性徹底喪失，與需求完全相反。",
      C: "只有結果而不知輸入與模型版本，無法重現與判斷當時的決策是否合理。",
      D: "隱藏版本號會讓人無法分辨問題來自哪一版模型，妨礙除錯與究責。",
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
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
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
      { id: "A", text: "對該區申請人統一放寬門檻" },
      { id: "B", text: "立即移除郵遞區號欄位即可" },
      { id: "C", text: "先比較條件相同者在各區的待遇是否一致以確認是否為間接歧視，若成立再從特徵、重新加權或門檻調整三個層次選擇介入方式" },
      { id: "D", text: "因為未使用敏感欄位，可判定無歧視並結案" },
    ],
    answer: "C",
    explanation:
      "核准率有差距不必然是歧視——也可能反映真實的還款能力差異。要先比較「條件相同的人」是否待遇一致，確認確實存在間接歧視後，再依模型是否還能重訓來選擇介入的時機與手段。",
    choiceExplanations: {
      A: "統一放寬門檻是掩蓋而非修正，還可能製造出新的不公平。",
      B: "移除欄位可能讓其他特徵繼續扮演代理變數，且未先確認問題是否存在。",
      D: "未使用敏感欄位不代表沒有間接歧視，這正是無感知即公平的誤解。",
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
      { id: "A", text: "改用準確率更高的模型" },
      { id: "B", text: "建立每次推論的完整紀錄（輸入、模型版本、輸出、時間、操作者），並與程式碼與訓練資料版本綁定以確保可重現" },
      { id: "C", text: "增加伺服器的儲存空間" },
      { id: "D", text: "要求醫師簽署免責同意書" },
    ],
    answer: "B",
    explanation:
      "爭議發生時要回答的是「那一天為什麼判成這樣」。缺少輸入、版本與輸出的對應紀錄，責任與改進都無從談起；而只有版本號還不夠，程式碼與訓練資料也要一併固定才重現得出來。",
    choiceExplanations: {
      A: "更準的模型仍會出錯，且無助於還原已發生的個案。",
      C: "儲存空間是實作條件，不等於建立了紀錄機制。",
      D: "免責同意書無法取代對事故的追溯與改進，也未必有效。",
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
        C: "Layer Confusion",
        D: "Wrong Trade-off",
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
      { id: "A", text: "提高模型的準確率即可" },
      { id: "B", text: "要求操作員必須採信模型判定" },
      { id: "C", text: "隱藏模型的信心分數以免干擾" },
      { id: "D", text: "在介面呈現模型的信心程度與判斷依據，並保留操作員否決的權限與紀錄，同時設計不定期的盲測樣本檢驗人的警覺度" },
    ],
    answer: "D",
    explanation:
      "這是自動化偏誤：人看到答案就不再獨立判斷。要讓人重新進入迴圈，得同時做三件事——讓人知道模型有多確定、保障否決權不被責難、並用盲測讓警覺度可被量測與維持。",
    choiceExplanations: {
      A: "準確率再高仍會出錯，而問題在於人已經不看了。",
      B: "強制採信直接取消了人的判斷，風險完全轉嫁給模型。",
      C: "隱藏不確定性會讓使用者高估模型可靠度，加重過度依賴。",
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
        B: "Wrong Trade-off",
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
      { id: "A", text: "這代表模型正確識別了優秀學生" },
      { id: "B", text: "這是資料漂移，重訓即可" },
      { id: "C", text: "這是回饋迴路造成的偏誤自我強化，應引入不受歷史點擊污染的評估資料，並在推薦中保留一定比例的探索" },
      { id: "D", text: "應提高點擊率的權重以強化訓練訊號" },
    ],
    answer: "C",
    explanation:
      "模型推給誰、誰才有機會點擊，點擊又回頭成為訓練資料——這條迴路會讓初始的微小偏好被不斷放大。打破它需要兩件事：用不受污染的資料評估真實效果，以及在推薦中保留探索的比例。",
    choiceExplanations: {
      A: "沒有被推薦的學生根本沒有機會產生點擊，這不能推論為他們表現較差。",
      B: "單純重訓只會把已被放大的偏誤再學一次，迴路本身沒有被切斷。",
      D: "提高點擊率權重會讓迴路收得更緊，偏誤放大得更快。",
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
        D: "Wrong Trade-off",
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
      { id: "A", text: "只用最後一天的資料訓練" },
      { id: "B", text: "完全隨機打散後切分" },
      { id: "C", text: "把測試集也放進訓練以提高準確率" },
      { id: "D", text: "依時間切分，以較早的資料訓練、較晚的資料測試" },
    ],
    answer: "D",
    explanation:
      "時間序列若隨機切分，訓練集會包含測試期之後的資訊，等於讓模型「看過未來」，評估結果會過度樂觀。依時間切分才能模擬真正上線時「只有過去可用」的情境。",
    choiceExplanations: {
      A: "單日資料量過少且不具代表性，模型學不到跨期的規律。",
      B: "隨機打散會造成資訊洩漏，測得的效能在實際上線時完全無法重現。",
      C: "測試集一旦參與訓練就失去評估意義，得到的數字只是自我測驗的結果。",
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
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
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
      { id: "B", text: "直接以平均值填補且不做任何標記" },
      { id: "C", text: "評估是否有其他欄位可以推估該值" },
      { id: "D", text: "與領域專家確認缺失的成因" },
    ],
    answer: "B",
    explanation:
      "既然缺失本身帶有資訊（與目標相關），無標記地填平均值等於把這個訊號抹掉，還讓模型誤以為那是真實量測值。正確做法是保留「缺失」這個事實作為特徵。",
    choiceExplanations: {
      A: "新增指示欄位正是保留缺失訊號的標準做法，恰當。",
      C: "以其他欄位推估（如迴歸填補）比單純填平均更能保留資訊，值得評估。",
      D: "釐清缺失成因往往能直接指出資料蒐集流程的問題，是必要步驟。",
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
      { id: "A", text: "所有特徵的單位本來就完全相同" },
      { id: "B", text: "使用決策樹且不做任何組合" },
      { id: "C", text: "使用基於距離的演算法（如 KNN）或以梯度下降訓練的模型" },
      { id: "D", text: "資料只有一個特徵" },
    ],
    answer: "C",
    explanation:
      "距離型演算法會被大尺度特徵主導，梯度下降在各維度尺度懸殊時收斂緩慢。這兩類情況都必須先把特徵縮放到相近的尺度。",
    choiceExplanations: {
      A: "單位與量級本來就一致時，縮放帶來的效益有限。",
      B: "決策樹依單一特徵的門檻切分，對特徵的線性縮放不敏感，通常不需要標準化。",
      D: "只有一個特徵時不存在「不同尺度互相壓制」的問題。",
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
      { id: "A", text: "整體準確率與訓練損失" },
      { id: "B", text: "少數類別的精確率、召回率與 F1" },
      { id: "C", text: "模型的參數量與推論延遲" },
      { id: "D", text: "訓練輪數（epoch）與批次大小" },
    ],
    answer: "B",
    explanation:
      "極度不平衡時，全部猜多數類別就有 99% 準確率。要看模型對少數類別到底抓到多少、抓對多少，必須看該類別的精確率、召回率與兩者的調和平均 F1。",
    choiceExplanations: {
      A: "整體準確率在此完全失去鑑別力，訓練損失也不直接對應少數類別的表現。",
      C: "參數量與延遲是部署考量，與偵測能力無關。",
      D: "訓練輪數與批次大小是超參數設定，不是評估指標。",
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
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "大型語言模型" },
      { id: "B", text: "邏輯迴歸或決策樹等本質上可解釋的模型" },
      { id: "C", text: "數十層的深度神經網路" },
      { id: "D", text: "多模型集成的黑箱系統" },
    ],
    answer: "B",
    explanation:
      "邏輯迴歸的係數與決策樹的分支路徑本身就是可讀的判斷依據，不需額外的解釋工具即可向監理者說明。在受監理場域，這種內建的可解釋性往往比幾個百分點的準確率更重要。",
    choiceExplanations: {
      A: "大型語言模型的輸出過程不透明，且可能對同一輸入給出不同說明。",
      C: "深層網路的判斷分散在大量權重中，需要額外的解釋方法且結果仍屬近似。",
      D: "集成多個模型會讓決策路徑更難追溯，可解釋性通常更差。",
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
        C: "Wrong Trade-off",
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
      { id: "A", text: "資料庫空間不足" },
      { id: "B", text: "模型推論速度變慢" },
      { id: "C", text: "資料洩漏（Data Leakage），離線效能虛高但上線後失效" },
      { id: "D", text: "模型檔案無法儲存" },
    ],
    answer: "C",
    explanation:
      "這類欄位帶有答案的資訊，模型會學會依賴它，離線評估看起來極好；但上線時這個欄位還不存在，模型立刻失去依據。這是資料洩漏最典型的形式。",
    choiceExplanations: {
      A: "單一欄位不會造成儲存空間的瓶頸。",
      B: "多一個欄位對推論速度的影響微乎其微，不是這裡的核心問題。",
      D: "欄位選擇不影響模型檔案能否寫入磁碟。",
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
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "增加訓練資料的總量" },
      { id: "B", text: "縮短訓練時間" },
      { id: "C", text: "在資料有限時取得較穩定的效能估計，降低單次切分的運氣成分" },
      { id: "D", text: "自動選出最佳的特徵" },
    ],
    answer: "C",
    explanation:
      "單次切分的結果會受到那一次剛好分到哪些樣本影響。K 折輪流讓每一折當驗證集，取平均後的估計較不受單次運氣左右，在資料量有限時尤其重要。",
    choiceExplanations: {
      A: "交叉驗證只是重複使用同一批資料，並沒有增加任何新樣本。",
      B: "K 折要訓練 K 次，總訓練時間反而是單次切分的數倍。",
      D: "特徵選擇是另一組方法，交叉驗證只是評估流程的一部分。",
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
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Neighbor Concept",
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
      { id: "A", text: "以時間窗聚合特徵（如每分鐘的平均、最大值、標準差）" },
      { id: "B", text: "把所有數值四捨五入到整數" },
      { id: "C", text: "隨機刪除一半的欄位" },
      { id: "D", text: "把資料轉成圖片格式儲存" },
    ],
    answer: "A",
    explanation:
      "以時間窗聚合能在大幅降低樣本數的同時保留訊號的統計特性（水準、波動、極值），是處理高頻感測資料最常用的降維手段。",
    choiceExplanations: {
      B: "四捨五入只減少數值精度，樣本數與訓練成本幾乎不變，卻可能丟失細微變化。",
      C: "隨機刪欄位是盲目地丟資訊，可能剛好刪掉最關鍵的特徵。",
      D: "轉成圖片不會減少資料量，反而增加儲存與處理負擔。",
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
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
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
      { id: "A", text: "標籤欄位要放在資料表的第一欄" },
      { id: "B", text: "標籤必須使用英文命名" },
      { id: "C", text: "標籤必須是浮點數" },
      { id: "D", text: "標籤定義必須與業務認知一致，且在預測時點之前不可使用未來資訊" },
    ],
    answer: "D",
    explanation:
      "標籤定義決定模型到底在學什麼。若業務認定的退出與此定義不同，模型再準也解錯了題；若計算標籤時用到了預測時點之後的資料，則會造成資料洩漏。",
    choiceExplanations: {
      A: "欄位順序不影響模型學習，只是資料表的排列方式。",
      B: "欄位命名語言屬於工程慣例，與標籤是否定義正確無關。",
      C: "是否退出是二元事件，用布林或 0/1 表示即可，不需要浮點數。",
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
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
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
      { id: "A", text: "選樣偏誤，使訓練樣本無法代表真實母體" },
      { id: "B", text: "模型檔案過大" },
      { id: "C", text: "訓練速度過慢" },
      { id: "D", text: "程式碼可讀性下降" },
    ],
    answer: "A",
    explanation:
      "「最容易取得」往往與某些特徵有系統性關聯（例如來自同一科別、同一時期），取出的樣本因此偏離真實母體分布，模型學到的規律無法推廣到其他病患。",
    choiceExplanations: {
      B: "樣本數變少通常讓模型更小而非更大，且與選樣方式無關。",
      C: "只取一千筆會讓訓練更快，與速度變慢的敘述相反。",
      D: "選樣策略是資料層面的決策，與程式碼的可讀性無關。",
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
        B: "Layer Confusion",
        C: "Overgeneralization",
        D: "Layer Confusion",
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
      { id: "A", text: "應提高 AUC 的門檻標準" },
      { id: "B", text: "應增加模型參數量" },
      { id: "C", text: "同一病患的紀錄同時落在訓練與測試兩邊造成資訊洩漏，應改以病患為單位切分並重新評估" },
      { id: "D", text: "應改用準確率作為指標" },
    ],
    answer: "C",
    explanation:
      "同一位病患的多次紀錄高度相關，隨機切分會讓模型在測試時遇到「這個人它已經見過」。若目標是預測新病患，切分就必須以病患為單位，否則測得的分數在上線時完全無法重現。",
    choiceExplanations: {
      A: "提高門檻只是換一個數字，虛高的分數依然虛高。",
      B: "參數量與切分造成的評估失真無關。",
      D: "換指標不會消除資訊洩漏，準確率同樣會被高估。",
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
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
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
      { id: "A", text: "先以相關性與領域知識收斂特徵集、處理共線性，再選用本質可解釋的模型，讓係數方向穩定且推論輕量" },
      { id: "B", text: "保留全部特徵並改用深層網路" },
      { id: "C", text: "隨機挑選一百個特徵" },
      { id: "D", text: "以主成分分析降維後直接說明各主成分的影響" },
    ],
    answer: "A",
    explanation:
      "共線性會讓係數不穩甚至符號反轉，「說明影響方向」因此失真；上千特徵也讓推論變重。先收斂特徵並處理共線性，再用可解釋模型，才能同時滿足說明與延遲兩項限制。",
    choiceExplanations: {
      B: "深層網路的個別特徵影響難以說明，延遲也更高，兩項限制都惡化。",
      C: "隨機挑選可能剛好丟掉最關鍵的特徵，也沒有解決共線性。",
      D: "主成分是原始特徵的線性組合，已失去可向監理說明的物理意義。",
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
        C: "Wrong Trade-off",
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
      { id: "A", text: "應把該欄位轉為類別型" },
      { id: "B", text: "應把該欄位標準化後使用" },
      { id: "C", text: "應增加該欄位的權重" },
      { id: "D", text: "該欄位是標籤而非特徵，若被當成輸入即構成資料洩漏；應盤點所有欄位的產生時點，只保留預測時點之前可取得者" },
    ],
    answer: "D",
    explanation:
      "這個欄位就是要預測的答案本身，把它放進輸入等於給模型看考卷。真正該做的是逐欄位盤點產生時點——這個檢查一次做完，能一併找出其他同樣在預測後才產生的欄位。",
    choiceExplanations: {
      A: "轉換型別同樣不改變它是答案的事實。",
      B: "標準化只改變數值尺度，答案仍然在輸入裡。",
      C: "提高權重會讓模型更依賴這個上線時取不到的欄位。",
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
        B: "Layer Confusion",
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
      { id: "A", text: "刪除該品種的樣本以簡化問題" },
      { id: "B", text: "針對該品種補充樣本或以重新加權提高其在損失中的比重，並以分群評估單獨檢視該品種的表現" },
      { id: "C", text: "只看整體準確率即可" },
      { id: "D", text: "把該品種併入最相近的品種一起訓練" },
    ],
    answer: "B",
    explanation:
      "佔比 2% 的類別會被整體損失淹沒，模型幾乎不會為它調整。補樣本或加權能讓它重新被看見，而分群評估則確保改善有沒有真的發生——否則整體指標好看，它仍然是被犧牲的那一群。",
    choiceExplanations: {
      A: "刪除的正是最需要準確預測的對象，與目標完全相反。",
      C: "整體準確率會被 98% 的其他品種主導，完全反映不出該品種的表現。",
      D: "併入相近品種會讓它的獨特特徵被抹平，預測反而更不準。",
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
        A: "Wrong Trade-off",
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
      { id: "A", text: "不再需要監控模型效能" },
      { id: "B", text: "模型的準確率會自動提升" },
      { id: "C", text: "呼叫端不需知道模型實作細節，模型可獨立更新與擴展" },
      { id: "D", text: "訓練資料可以不必保留" },
    ],
    answer: "C",
    explanation:
      "以 API 封裝形成清楚的界面：呼叫端只送輸入、收結果，內部換模型、換框架、加機器都不影響它們。這種解耦是模型能持續迭代的前提。",
    choiceExplanations: {
      A: "上線後的效能監控只會更重要，因為現在有多個系統依賴這個服務。",
      B: "封裝方式不改變模型本身的預測能力，準確率與部署形式無關。",
      D: "訓練資料仍需保留以供重訓、稽核與問題追溯。",
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
        D: "Overgeneralization",
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
      { id: "B", text: "自動提升模型準確率" },
      { id: "C", text: "免除所有資安考量" },
      { id: "D", text: "讓模型不需要任何運算資源" },
    ],
    answer: "A",
    explanation:
      "AI 服務對套件版本極為敏感，開發機能跑、正式機掛掉是常態。容器把 Python 版本、函式庫與系統相依一起封裝，讓「在我機器上可以跑」變成「在哪都可以跑」。",
    choiceExplanations: {
      B: "容器只影響執行環境的一致性，不會改變模型的預測品質。",
      C: "容器本身也有映像檔漏洞、權限設定等資安議題，不會免除考量。",
      D: "容器內的模型仍需 CPU、記憶體甚至 GPU 才能推論。",
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
        D: "Overgeneralization",
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
      { id: "A", text: "直接全量切換到新模型" },
      { id: "B", text: "灰度發布：先導入少量流量，確認指標正常再逐步放大" },
      { id: "C", text: "在沒有監控的情況下上線" },
      { id: "D", text: "先刪除舊模型再部署新模型" },
    ],
    answer: "B",
    explanation:
      "灰度發布讓新模型先服務一小部分流量，若指標異常可立刻回退，受影響範圍極小。這是把「上線」從一次性賭注變成可控實驗的標準做法。",
    choiceExplanations: {
      A: "全量切換一旦新模型有問題，所有使用者立即受影響，沒有緩衝空間。",
      C: "沒有監控就無法察覺問題，等於把風險完全暴露。",
      D: "先刪舊模型會讓回退變得不可能，是風險最高的操作順序。",
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
        C: "Wrong Trade-off",
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
      { id: "B", text: "可以減少推論的運算量" },
      { id: "C", text: "可以省下儲存空間" },
      { id: "D", text: "可以自動提升服務的吞吐量" },
    ],
    answer: "A",
    explanation:
      "沒有版本資訊，同一筆錯誤預測就無從判斷是哪一版模型產生的，回退與究責都失去依據。版本紀錄是模型維運與稽核的最基本要求。",
    choiceExplanations: {
      B: "版本標記只是中繼資料，不影響推論的運算量。",
      C: "保留版本資訊需要額外儲存，不會省空間。",
      D: "吞吐量取決於資源配置與模型效率，與版本標記無關。",
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
        C: "Wrong Trade-off",
        D: "Layer Confusion",
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
      { id: "A", text: "地端部署不需要任何維運" },
      { id: "B", text: "院內的網路一定比較快" },
      { id: "C", text: "病歷資料不得離開院內的法規與隱私要求" },
      { id: "D", text: "地端部署一定比較便宜" },
    ],
    answer: "C",
    explanation:
      "醫療資料受高度規範，資料落地與存取控制往往是硬性要求。地端部署讓資料完全不離開院內網路，是最直接滿足合規的方式。",
    choiceExplanations: {
      A: "地端反而需要自行負責備援、更新與監控，維運負擔更重。",
      B: "網路速度取決於實際架構，地端未必比雲端快，且這不是主要考量。",
      D: "地端要自行採購硬體與維運人力，總成本未必較低。",
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
      { id: "A", text: "資料增強與交叉驗證" },
      { id: "B", text: "量化與剪枝" },
      { id: "C", text: "分群與降維" },
      { id: "D", text: "A/B 測試與灰度發布" },
    ],
    answer: "B",
    explanation:
      "量化把權重從高精度浮點數轉為低精度整數以縮小體積、加速推論；剪枝移除影響甚微的連接或神經元。兩者都是端側部署的標準前處理。",
    choiceExplanations: {
      A: "資料增強與交叉驗證屬於訓練與評估階段的方法，不改變模型體積。",
      C: "分群與降維處理的是資料，而非壓縮已訓練好的模型。",
      D: "A/B 測試與灰度發布是上線策略，與模型大小無關。",
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
        D: "Neighbor Concept",
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
      { id: "A", text: "批次推論一定比線上推論準確" },
      { id: "B", text: "兩者使用的模型必定不同" },
      { id: "C", text: "線上推論不需要任何監控" },
      { id: "D", text: "批次推論定期成批處理、對延遲不敏感；線上推論即時回應單筆請求" },
    ],
    answer: "D",
    explanation:
      "批次推論適合每日產出名單這類可等待的場景，可用大批次提升吞吐；線上推論要求毫秒級回應，架構重點在低延遲與高可用。兩者的取捨方向完全不同。",
    choiceExplanations: {
      A: "準確率取決於模型與資料，與何時執行推論無關。",
      B: "同一個模型可以同時支援批次與線上兩種推論方式。",
      C: "線上推論直接面對使用者，監控需求只會更高。",
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
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Overgeneralization",
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
      { id: "A", text: "輸入輸出的欄位、型別、單位與錯誤處理方式" },
      { id: "B", text: "雙方團隊的座位樓層" },
      { id: "C", text: "程式碼的縮排寬度" },
      { id: "D", text: "會議紀錄的字型" },
    ],
    answer: "A",
    explanation:
      "介面契約沒講清楚，整合階段就會出現單位不一致、缺欄位、錯誤時不知如何處理等問題。欄位、型別、單位與錯誤語意是最容易出錯也最該白紙黑字寫下的部分。",
    choiceExplanations: {
      B: "團隊座位屬於行政安排，與系統介面的正確性無關。",
      C: "縮排寬度是程式風格，不影響兩個系統能否正確互通。",
      D: "文件字型與技術整合毫無關聯。",
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
        C: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "延長模型的訓練時間" },
      { id: "B", text: "把模型換成參數更多的版本" },
      { id: "C", text: "增加訓練資料量" },
      { id: "D", text: "水平擴展推論服務並對熱門結果加入快取" },
    ],
    answer: "D",
    explanation:
      "尖峰延遲的成因是請求量超過單一服務的處理能力。增加服務實例分攤流量，並把重複度高的推薦結果快取起來，可同時降低負載與回應時間。",
    choiceExplanations: {
      A: "訓練時間屬於離線階段，對線上延遲沒有任何幫助。",
      B: "更大的模型推論更慢，會讓延遲問題雪上加霜。",
      C: "訓練資料量影響的是模型品質，與線上服務的併發承載無關。",
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
      { id: "A", text: "專指購買機器學習軟體的採購流程" },
      { id: "B", text: "只負責撰寫模型訓練程式" },
      { id: "C", text: "是一種深度學習模型架構" },
      { id: "D", text: "把資料、訓練、部署與監控串成可重複、可追溯的流程" },
    ],
    answer: "D",
    explanation:
      "MLOps 借用 DevOps 的思路，把機器學習從資料版本、訓練、評估到部署與監控整條鏈路自動化並留下紀錄，讓模型的產出可重現、問題可追溯。",
    choiceExplanations: {
      A: "採購屬於行政流程，與 MLOps 所指的技術實踐無關。",
      B: "撰寫訓練程式只是其中一環，MLOps 涵蓋的是整條生命週期。",
      C: "MLOps 是工程實踐與流程，不是模型架構。",
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
        A: "Neighbor Concept",
        B: "Partial Truth",
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
      { id: "A", text: "標註品質不佳" },
      { id: "B", text: "田間網路不穩導致無法即時上雲推論" },
      { id: "C", text: "模型訓練資料不足" },
      { id: "D", text: "團隊人力不足" },
    ],
    answer: "B",
    explanation:
      "把推論放在閘道器上，判斷不必等待與雲端的往返，網路中斷時仍能持續運作，只在有連線時同步結果。這正是邊緣部署對付不穩網路的價值。",
    choiceExplanations: {
      A: "標註品質取決於標註流程與規範，與模型放在哪裡無關。",
      C: "資料量不足要靠蒐集與增強解決，改變部署位置無濟於事。",
      D: "人力問題屬於組織資源，不會因為邊緣部署而改變。",
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
        D: "Layer Confusion",
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
      { id: "A", text: "要求模型永遠不得出錯" },
      { id: "B", text: "在下游系統關閉所有錯誤處理" },
      { id: "C", text: "在介面層定義預設值與錯誤回應，並讓下游具備降級處理能力" },
      { id: "D", text: "把空值直接寫入資料庫不做任何處理" },
    ],
    answer: "C",
    explanation:
      "任何服務都可能回傳非預期結果，關鍵在於下游能不能安全地承接。介面明確定義錯誤語意、下游具備降級（使用預設值或跳過）能力，單點異常才不會演變成整條鏈路中斷。",
    choiceExplanations: {
      A: "「不得出錯」是期望而非設計，無法在工程上實現。",
      B: "關閉錯誤處理會讓異常直接擴散，是與目標完全相反的做法。",
      D: "把空值原樣寫入只是把問題往後推，後續查詢與分析同樣會出錯。",
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
      { id: "A", text: "先在介面層定義錯誤語意與預設行為讓下游能安全降級，再處理延遲——中斷的影響範圍遠大於變慢" },
      { id: "B", text: "先水平擴展解決延遲，空值之後再說" },
      { id: "C", text: "要求下游關閉錯誤處理以免中斷" },
      { id: "D", text: "把空值直接寫入資料庫" },
    ],
    answer: "A",
    explanation:
      "兩個問題的嚴重度不同：延遲只是變慢，中斷會讓整條下游停擺。先讓下游能安全承接異常（明確的錯誤語意加降級行為），把影響範圍縮住，再回頭處理效能。",
    choiceExplanations: {
      B: "擴展能緩解延遲，但空值造成的中斷仍會發生，影響更嚴重。",
      C: "關閉錯誤處理會讓異常直接擴散，與目標完全相反。",
      D: "寫入空值只是把問題往後推，後續查詢與分析同樣會出錯。",
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
      { id: "A", text: "新舊版各服務一半流量並長期並行" },
      { id: "B", text: "直接全量切換到新版" },
      { id: "C", text: "以 canary 放行後兩天內決定" },
      { id: "D", text: "先以影子模式讓新版與舊版同時推論但只採用舊版結果，累積比對資料後再以小流量灰度放行" },
    ],
    answer: "D",
    explanation:
      "當差異要數週才顯現，灰度期間看不出結論。影子模式讓新版在真實流量上跑但不影響病患，累積足夠的比對資料後再談放行——這是把「等待期」與「風險期」分開的做法。",
    choiceExplanations: {
      A: "長期並行會讓一半病患持續承受不確定的版本，且沒有收斂的機制。",
      B: "全量切換一旦新版較差，所有病患立即受影響，且要數週後才發現。",
      C: "兩天的樣本不足以反映需數週才顯現的差異，容易做出錯誤決定。",
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
        B: "Wrong Trade-off",
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
      { id: "A", text: "以量化與剪枝壓縮模型到可載入的體積，端側完成推論以不依賴網路，並保留本地緩衝於恢復連線時補傳結果" },
      { id: "B", text: "維持原模型並改以雲端推論" },
      { id: "C", text: "提高裝置的螢幕更新率" },
      { id: "D", text: "延長模型的訓練時間" },
    ],
    answer: "A",
    explanation:
      "三項限制各自對應一個處置：記憶體不足 → 壓縮；延遲要求與網路不穩 → 端側推論；網路中斷期間的結果不能掉 → 本地緩衝補傳。少做任何一項，都會有一項限制沒被滿足。",
    choiceExplanations: {
      B: "雲端推論在網路中斷時完全無法運作，且往返延遲難以滿足 100 毫秒。",
      C: "螢幕更新率屬於顯示規格，與推論資源無關。",
      D: "訓練時間屬於離線階段，對部署限制沒有任何幫助。",
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
        C: "Layer Confusion",
        D: "Layer Confusion",
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
      { id: "A", text: "要求三個團隊每週開會對齊" },
      { id: "B", text: "建立集中管理的特徵定義（特徵存放區或共用函式庫），讓訓練與線上推論使用同一份實作" },
      { id: "C", text: "改用更大的模型" },
      { id: "D", text: "把離線評估的門檻調低" },
    ],
    answer: "B",
    explanation:
      "訓練與服務各自實作一套特徵計算，是模型上線後不如預期的典型成因。靠開會對齊只能維持一時，把定義集中到單一實作才能從結構上消除分歧。",
    choiceExplanations: {
      A: "會議能發現問題但無法防止再度分歧，隨著特徵增加只會更難維持。",
      C: "更大的模型仍然吃到不同的特徵值，落差依舊存在。",
      D: "調低門檻是掩蓋落差，線上表現並沒有變好。",
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
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L21301",
      decisionBoundary:
        "若只有一個模型、且特徵在訓練與服務端本來就由同一份程式碼計算，特徵存放區的維運成本就換不到相應效益。",
    },
  },
];
