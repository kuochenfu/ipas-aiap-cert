import type { Question } from "../types";

export const generated: Question[] = [
  {
    id: "senior-ai-tech-gen-q001",
    subjectId: "senior-ai-tech",
    prompt:
      "在自然語言處理中，Transformer 的自注意力（Self-Attention）機制相較於傳統 RNN，主要的關鍵優勢為下列何者？",
    choices: [
      { id: "A", text: "完全不需要任何訓練資料即可運作" },
      { id: "B", text: "只能處理固定長度且極短的輸入序列" },
      { id: "C", text: "可平行計算序列中各位置的關聯，並較佳地捕捉長距離依賴" },
      { id: "D", text: "以遞迴方式逐字處理，因此推論延遲一定低於 RNN" },
    ],
    answer: "C",
    explanation:
      "自注意力讓序列中每個位置可直接計算與其他所有位置的關聯，因此能平行化運算並較佳地捕捉長距離依賴（C）。它仍需訓練資料（A）、可處理較長序列而非僅固定極短輸入（B）；RNN 才是逐字遞迴、難以平行的架構，故 D 的描述張冠李戴。",
    topic: "AI 相關技術應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q002",
    subjectId: "senior-ai-tech",
    prompt:
      "電腦視覺任務中，「語意分割（Semantic Segmentation）」與「物件偵測（Object Detection）」最主要的差異為下列何者？",
    choices: [
      { id: "A", text: "語意分割對每個像素分類，物件偵測則以邊界框定位並標示物件類別" },
      { id: "B", text: "語意分割只能處理灰階影像，物件偵測只能處理彩色影像" },
      { id: "C", text: "物件偵測會逐像素標註，語意分割只輸出單一整張圖的類別" },
      { id: "D", text: "兩者完全相同，只是名稱不同" },
    ],
    answer: "A",
    explanation:
      "語意分割是對影像中每個像素指派類別標籤，物件偵測則是用邊界框定位個別物件並標示其類別（A）。兩者皆不限灰階或彩色（B）；逐像素標註是分割而非偵測，故 C 顛倒；兩者目標不同並非同義（D）。",
    topic: "AI 相關技術應用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q003",
    subjectId: "senior-ai-tech",
    prompt:
      "在語音技術中，自動語音辨識（ASR）與語音合成（TTS）的功能方向為下列何者？",
    choices: [
      { id: "A", text: "ASR 將文字轉為語音，TTS 將語音轉為文字" },
      { id: "B", text: "兩者都只負責將語音轉成另一段語音" },
      { id: "C", text: "兩者都只負責將文字轉成另一段文字" },
      { id: "D", text: "ASR 將語音轉為文字，TTS 將文字轉為語音" },
    ],
    answer: "D",
    explanation:
      "ASR（自動語音辨識）是把語音訊號轉成文字，TTS（語音合成）則是把文字轉成語音（D），兩者方向相反。A 把兩者方向寫反；B、C 將輸入輸出同型別的敘述都不符合語音與文字互轉的本質。",
    topic: "AI 相關技術應用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q004",
    subjectId: "senior-ai-tech",
    prompt:
      "關於「多模態（Multimodal）」AI 模型的描述，下列何者最為正確？",
    choices: [
      { id: "A", text: "指同時部署多台伺服器以分散運算負載的架構" },
      { id: "B", text: "能同時處理並融合文字、影像、語音等不同型態的資料以完成任務" },
      { id: "C", text: "指模型只能在單一資料型態（如純文字）上運作" },
      { id: "D", text: "專指將模型壓縮成多種量化版本的技術" },
    ],
    answer: "B",
    explanation:
      "多模態模型的核心是能同時處理並融合文字、影像、語音等不同型態的資料來完成任務，例如看圖回答問題（B）。多台伺服器分散負載屬部署架構（A）；只能單一型態正好與多模態相反（C）；多種量化版本是模型壓縮概念（D），皆非多模態。",
    topic: "AI 相關技術應用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q005",
    subjectId: "senior-ai-tech",
    prompt:
      "在命名實體辨識（NER）任務中，模型的主要目標為下列何者？",
    choices: [
      { id: "A", text: "從文字中辨識並標註人名、地名、組織等特定類型的實體" },
      { id: "B", text: "將整段文章壓縮成一句摘要" },
      { id: "C", text: "判斷整篇評論的情感是正面或負面" },
      { id: "D", text: "把一種語言的句子翻譯成另一種語言" },
    ],
    answer: "A",
    explanation:
      "命名實體辨識（NER）的目標是從文字中找出並分類人名、地名、組織名等特定類型的實體（A）。產生摘要（B）屬文本摘要、判斷情感正負（C）屬情感分析、跨語言轉換（D）屬機器翻譯，皆為不同的 NLP 任務。",
    topic: "AI 相關技術應用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q006",
    subjectId: "senior-ai-tech",
    prompt:
      "在影像分類的卷積神經網路（CNN）中，「卷積層（Convolutional Layer）」相較於全連接層的主要特性為下列何者？",
    choices: [
      { id: "A", text: "每個輸出節點都與所有輸入像素獨立連接，參數量最大" },
      { id: "B", text: "完全不使用任何可學習參數" },
      { id: "C", text: "只能用於一維文字資料而無法處理影像" },
      { id: "D", text: "以共享的卷積核在局部感受野上滑動，能擷取局部特徵並大幅減少參數" },
    ],
    answer: "D",
    explanation:
      "卷積層以共享權重的卷積核在局部感受野上滑動，能擷取邊緣、紋理等局部特徵，並透過權重共享大幅減少參數（D）。全連接才是每節點連接所有輸入、參數量大（A）；卷積核本身即為可學習參數（B）；CNN 廣泛用於影像（C 錯誤）。",
    topic: "AI 相關技術應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q007",
    subjectId: "senior-ai-tech",
    prompt:
      "詞嵌入（Word Embedding，如 Word2Vec）相較於傳統 One-hot 編碼，最主要的優勢為下列何者？",
    choices: [
      { id: "A", text: "向量維度一定等於詞彙表大小，且彼此正交" },
      { id: "B", text: "以低維稠密向量表示詞語，能反映詞與詞之間的語意相似性" },
      { id: "C", text: "每個詞都以唯一且互不相關的稀疏向量表示" },
      { id: "D", text: "完全不需要任何語料即可直接得到向量" },
    ],
    answer: "B",
    explanation:
      "詞嵌入以低維稠密向量表示詞語，語意相近的詞在向量空間中距離較近，能反映語意相似性（B）。One-hot 才是維度等於詞彙表、彼此正交且稀疏、無法表達相似性的表示法（A、C 描述的是 One-hot）；詞嵌入需從語料學習得到（D 錯誤）。",
    topic: "AI 相關技術應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q008",
    subjectId: "senior-ai-tech",
    prompt:
      "擴散模型（Diffusion Model）用於影像生成時，其核心運作概念為下列何者？",
    choices: [
      { id: "A", text: "以兩個網路互相對抗，使生成器騙過判別器" },
      { id: "B", text: "將輸入影像直接以規則式範本拼貼成新圖" },
      { id: "C", text: "先對資料逐步加入雜訊，再訓練模型學會逐步去雜訊以還原或生成影像" },
      { id: "D", text: "僅以查表方式檢索資料庫中最相似的既有影像回傳" },
    ],
    answer: "C",
    explanation:
      "擴散模型的核心是先對資料逐步加入雜訊（前向過程），再訓練模型學會逐步去除雜訊（反向過程），從純雜訊還原或生成影像（C）。生成器與判別器對抗是 GAN 的概念（A）；規則式拼貼（B）與查表檢索（D）都不是擴散模型的生成機制。",
    topic: "AI 相關技術應用",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q009",
    subjectId: "senior-ai-tech",
    prompt:
      "評估一個類別嚴重不平衡（如詐欺偵測，正例僅約 1%）的分類模型時，下列哪一種做法較能避免被誤導？",
    choices: [
      { id: "A", text: "只看整體準確率（Accuracy），數值越高即代表模型越好" },
      { id: "B", text: "改以精確率、召回率與 F1（或 PR-AUC）等指標綜合評估少數類別的偵測能力" },
      { id: "C", text: "把所有樣本一律預測為多數類別，以追求最高準確率" },
      { id: "D", text: "刪除所有少數類別樣本後再計算準確率" },
    ],
    answer: "B",
    explanation:
      "在嚴重不平衡情境下，準確率會被多數類別主導而失真，應改以精確率、召回率、F1 或 PR-AUC 等綜合評估少數類別的偵測能力（B）。只看準確率（A）、一律預測多數類（C）雖準確率高卻完全抓不到少數類；刪除少數類樣本（D）更使評估失去意義。",
    topic: "AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q010",
    subjectId: "senior-ai-tech",
    prompt:
      "企業在「自行訓練客製模型」與「直接採用商用 API 服務」之間進行解決方案選擇時，下列哪一項屬於應一併納入的關鍵評估構面？",
    choices: [
      { id: "A", text: "只比較初期授權費，費用最低者必為最佳方案" },
      { id: "B", text: "一律自行訓練，因為長期成本一定最低" },
      { id: "C", text: "純依開發團隊的個人偏好，不需考慮資料安全" },
      { id: "D", text: "綜合比較資料隱私可控性、總體擁有成本、維運能力與客製需求" },
    ],
    answer: "D",
    explanation:
      "自建與採用 API 的取捨應綜合資料隱私可控性、總體擁有成本（含維運）、團隊維運能力與客製需求等構面（D）。只看初期費用（A）忽略長期成本；認定自建必最省（B）忽略人力與維運負擔；純憑偏好而忽略資料安全（C）都不是負責任的評估。",
    topic: "AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q011",
    subjectId: "senior-ai-tech",
    prompt:
      "下列哪一項最能描述「負責任 AI（Responsible AI）」中『可解釋性（Explainability）』所要達成的目標？",
    choices: [
      { id: "A", text: "讓利害關係人能理解模型做出某項決策的依據與影響因素" },
      { id: "B", text: "刻意隱藏模型邏輯以保護商業機密，使任何人都無法檢視" },
      { id: "C", text: "只要求模型在驗證集上的準確率越高越好" },
      { id: "D", text: "確保模型推論速度盡可能快速" },
    ],
    answer: "A",
    explanation:
      "可解釋性的目標是讓利害關係人能理解模型決策的依據與重要影響因素，以利信任、稽核與問責（A）。刻意隱藏邏輯（B）與可解釋性背道而馳；單看準確率（C）與推論速度（D）分屬效能面向，並非可解釋性所要達成的目標。",
    topic: "AI 導入評估規劃",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q012",
    subjectId: "senior-ai-tech",
    prompt:
      "在切分訓練、驗證與測試資料以評估模型時，下列哪一種做法會造成「資料洩漏（Data Leakage）」而高估效能？",
    choices: [
      { id: "A", text: "先切分資料，僅以訓練集統計量做特徵標準化，再套用到驗證與測試集" },
      { id: "B", text: "測試集在最終評估前完全不參與任何訓練或調參" },
      { id: "C", text: "以整份資料（含測試集）先做標準化或特徵選擇，再切分訓練與測試" },
      { id: "D", text: "依時間序列以較早資料訓練、較晚資料測試" },
    ],
    answer: "C",
    explanation:
      "在切分前就用整份資料（含測試集）做標準化或特徵選擇，會把測試集資訊滲入訓練流程，造成資料洩漏而高估效能（C）。正確做法是先切分、僅以訓練集統計量轉換（A），測試集最終才用（B），時序資料用過去預測未來（D）也合理。",
    topic: "AI 導入評估規劃",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q013",
    subjectId: "senior-ai-tech",
    prompt:
      "企業導入 AI 進行成本效益分析時，下列哪一項較屬於模型上線後應持續評估的「持續性營運成本」，而非一次性建置成本？",
    choices: [
      { id: "A", text: "概念驗證（PoC）階段的一次性顧問評估費" },
      { id: "B", text: "上線後模型推論的運算資源、再訓練與監控維運費用" },
      { id: "C", text: "建置初期採購開發用工作站的一次性硬體支出" },
      { id: "D", text: "專案啟動時的一次性教育訓練課程費用" },
    ],
    answer: "B",
    explanation:
      "模型上線後會隨使用持續產生推論運算、定期再訓練與監控維運等費用，屬於持續性營運成本（B）。PoC 顧問費（A）、初期工作站採購（C）、啟動教育訓練（D）皆為一次性建置或導入支出，不屬於營運期持續成本。",
    topic: "AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q014",
    subjectId: "senior-ai-tech",
    prompt:
      "下列哪一項屬於 AI 導入時針對「公平性（Fairness）／偏誤」風險最直接的評估與緩解作為？",
    choices: [
      { id: "A", text: "檢視訓練資料代表性，並比較模型在不同族群子群上的表現差異" },
      { id: "B", text: "提高 GPU 數量以加快訓練速度" },
      { id: "C", text: "將模型推論延遲降到最低" },
      { id: "D", text: "把模型部署到更多地區的資料中心" },
    ],
    answer: "A",
    explanation:
      "處理公平性與偏誤風險，最直接的是檢視訓練資料是否具代表性，並比較模型在不同敏感族群子群上的表現差異，據以緩解（A）。增加 GPU（B）、降低延遲（C）、擴大部署地區（D）皆屬效能或部署考量，無法處理偏誤問題。",
    topic: "AI 導入評估規劃",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q015",
    subjectId: "senior-ai-tech",
    prompt:
      "在模型選擇與超參數調校時，相較於僅用單一次的訓練／驗證切分，採用「K 折交叉驗證（K-fold Cross-Validation）」的主要好處為下列何者？",
    choices: [
      { id: "A", text: "可完全免除對測試集的需求" },
      { id: "B", text: "保證所選模型在實務上絕不會過擬合" },
      { id: "C", text: "讓訓練資料量變成原來的 K 倍" },
      { id: "D", text: "讓每筆資料都輪流作為驗證資料，使效能估計更穩定、降低單次切分的偶然性" },
    ],
    answer: "D",
    explanation:
      "K 折交叉驗證讓資料輪流作為驗證集，平均多次結果可得到更穩定、較不受單次切分偶然性影響的效能估計（D）。它不能取代獨立測試集（A）、無法保證絕不過擬合（B），也不會憑空增加資料量（C）。",
    topic: "AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q016",
    subjectId: "senior-ai-tech",
    prompt:
      "為降低生成式 AI 在企業應用中產生「幻覺（Hallucination）」造成的合規與營運風險，下列哪一項導入規劃作為最為直接合適？",
    choices: [
      { id: "A", text: "提高生成溫度（temperature）以增加回答多樣性" },
      { id: "B", text: "假設模型輸出永遠正確，不需任何查核" },
      { id: "C", text: "對高風險輸出導入檢索增強生成（RAG）與人工審查／事實查核機制" },
      { id: "D", text: "僅以回應速度作為唯一品質指標" },
    ],
    answer: "C",
    explanation:
      "面對幻覺風險，較直接的是讓回答有可靠依據並設置把關，例如導入 RAG 以引用可信來源，並對高風險輸出加上人工審查與事實查核（C）。提高溫度（A）反而增加不確定性；假設輸出永遠正確（B）忽視風險；只看速度（D）未涵蓋正確性。",
    topic: "AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q017",
    subjectId: "senior-ai-tech",
    prompt:
      "MLOps 中導入「持續整合／持續部署（CI/CD）」管線於機器學習系統，最主要的目的為下列何者？",
    choices: [
      { id: "A", text: "將程式碼、資料與模型的建置、測試與部署自動化，提升交付的一致性與可重現性" },
      { id: "B", text: "讓資料科學家不必再撰寫任何測試" },
      { id: "C", text: "完全取代模型上線後的監控需求" },
      { id: "D", text: "確保模型一旦部署就永遠不需要再更新" },
    ],
    answer: "A",
    explanation:
      "在 ML 系統導入 CI/CD 是為了把程式碼、資料與模型的建置、測試與部署自動化，提升交付一致性與可重現性、降低人為錯誤（A）。它強調而非免除測試（B）；上線後仍需監控（C）；模型會因資料漂移等需持續更新（D 錯誤）。",
    topic: "AI 技術應用與系統部署",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q018",
    subjectId: "senior-ai-tech",
    prompt:
      "模型上線後，輸入資料的統計分布隨時間逐漸偏離訓練時的分布，導致效能下降，這種現象通常稱為下列何者？",
    choices: [
      { id: "A", text: "過擬合（Overfitting）" },
      { id: "B", text: "梯度消失（Vanishing Gradient）" },
      { id: "C", text: "資料／概念漂移（Data / Concept Drift）" },
      { id: "D", text: "資料洩漏（Data Leakage）" },
    ],
    answer: "C",
    explanation:
      "上線後輸入資料分布隨時間偏離訓練分布、使效能衰退，稱為資料漂移；若是輸入與目標的關係改變則為概念漂移（C），需以監控偵測並觸發再訓練。過擬合（A）是訓練階段過度貼合訓練集、梯度消失（B）是訓練難題、資料洩漏（D）是評估流程汙染，皆非此現象。",
    topic: "AI 技術應用與系統部署",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q019",
    subjectId: "senior-ai-tech",
    prompt:
      "在生產環境部署模型時採用「藍綠部署（Blue-Green Deployment）」，其主要目的為下列何者？",
    choices: [
      { id: "A", text: "讓模型推論完全不需要任何運算資源" },
      { id: "B", text: "維持新舊兩套環境並可快速切換流量，降低上線風險並便於快速回滾" },
      { id: "C", text: "永久關閉舊版本，使其無法再被使用" },
      { id: "D", text: "把訓練與推論合併在同一個批次工作中執行" },
    ],
    answer: "B",
    explanation:
      "藍綠部署同時維持新（綠）舊（藍）兩套環境，先驗證新版再切換流量，一旦異常可快速切回，降低上線風險（B）。它仍需運算資源（A）；保留舊版正是為了能回滾，而非永久關閉（C）；它是部署策略，與訓練／推論合併（D）無關。",
    topic: "AI 技術應用與系統部署",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q020",
    subjectId: "senior-ai-tech",
    prompt:
      "將訓練好的模型封裝成「容器（Container，如 Docker 映像）」再部署，最主要帶來的好處為下列何者？",
    choices: [
      { id: "A", text: "可省去所有模型監控的需求" },
      { id: "B", text: "能自動提升模型在測試集上的準確率" },
      { id: "C", text: "保證模型永遠不會發生資料漂移" },
      { id: "D", text: "把相依套件與環境一併打包，使部署在不同環境間具一致性與可移植性" },
    ],
    answer: "D",
    explanation:
      "容器化把模型程式、相依套件與執行環境一併打包，讓應用在開發、測試與生產等不同環境間表現一致、易於移植與擴展（D）。它與是否需要監控（A）、模型準確率（B）、是否發生資料漂移（C）並無因果關係。",
    topic: "AI 技術應用與系統部署",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q021",
    subjectId: "senior-ai-tech",
    prompt:
      "當線上推論服務的請求量在尖峰時段大幅成長，下列哪一種擴展策略屬於典型的「水平擴展（Scale Out）」？",
    choices: [
      { id: "A", text: "增加服務實例數並透過負載平衡分流，必要時搭配自動伸縮" },
      { id: "B", text: "把單一伺服器的 CPU 與記憶體升級到更高規格" },
      { id: "C", text: "降低模型的請求量上限，拒絕多餘流量" },
      { id: "D", text: "將模型改為離線批次處理，不再提供即時服務" },
    ],
    answer: "A",
    explanation:
      "水平擴展（Scale Out）是增加服務實例數並以負載平衡分流，必要時用自動伸縮依負載動態調整數量（A）。升級單機規格屬垂直擴展（Scale Up，B）；限流拒絕請求（C）與改為批次（D）是降載或改變服務型態，並非水平擴展。",
    topic: "AI 技術應用與系統部署",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q022",
    subjectId: "senior-ai-tech",
    prompt:
      "在 MLOps 中導入「特徵儲存庫（Feature Store）」，最主要解決的問題為下列何者？",
    choices: [
      { id: "A", text: "完全取代模型版本管理（Model Registry）的功能" },
      { id: "B", text: "自動決定模型應採用哪一種演算法" },
      { id: "C", text: "確保模型不需要任何訓練資料即可運作" },
      { id: "D", text: "集中管理並共享特徵，使訓練與線上推論使用一致的特徵、避免訓練／服務偏斜" },
    ],
    answer: "D",
    explanation:
      "特徵儲存庫集中管理並共享特徵，讓訓練與線上推論取用一致的特徵定義與資料，避免「訓練／服務偏斜（training-serving skew）」並促進重用（D）。它不取代模型版本管理（A）、不替你選演算法（B），也無法讓模型免於訓練資料（C）。",
    topic: "AI 技術應用與系統部署",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q023",
    subjectId: "senior-ai-tech",
    prompt:
      "針對線上 AI 推論服務的「可觀測性／監控」，下列哪一組指標較能同時涵蓋系統健康與模型品質？",
    choices: [
      { id: "A", text: "辦公室面積與員工座位數" },
      { id: "B", text: "推論延遲與吞吐量、錯誤率，以及預測分布與輸入資料漂移情形" },
      { id: "C", text: "公司股利政策與董事會席次組成" },
      { id: "D", text: "僅監看伺服器機房的室內溫度" },
    ],
    answer: "B",
    explanation:
      "良好的線上監控應同時涵蓋系統面（延遲、吞吐量、錯誤率）與模型品質面（預測分布變化、輸入資料漂移），才能及早發現異常並觸發處置（B）。辦公面積（A）、股利政策（C）屬非技術面向；只看機房溫度（D）僅涵蓋極小部分基礎設施，皆不足以監控 AI 服務。",
    topic: "AI 技術應用與系統部署",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-ai-tech-gen-q024",
    subjectId: "senior-ai-tech",
    prompt:
      "在系統架構設計中，將大型模型推論服務以「API／微服務」方式對外提供，而非直接嵌入各個應用程式內，最主要的好處為下列何者？",
    choices: [
      { id: "A", text: "可確保模型永遠不需要更新或重新部署" },
      { id: "B", text: "能自動消除所有資料隱私與安全疑慮" },
      { id: "C", text: "讓推論服務獨立部署、版本控管與擴展，並供多個應用以統一介面重用" },
      { id: "D", text: "使模型在測試集上的準確率自動提升" },
    ],
    answer: "C",
    explanation:
      "以 API／微服務方式提供推論，可讓服務獨立部署、獨立版本控管與擴展，並讓多個應用以統一介面重用同一模型、降低耦合（C）。它不保證免於更新（A）、不會自動消除隱私安全疑慮（B），也與模型準確率（D）無因果關係。",
    topic: "AI 技術應用與系統部署",
    difficulty: "難",
    source: "generated",
  },
];
