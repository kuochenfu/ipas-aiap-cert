import type { Question } from "../types";

/**
 * AIoT 考科一新題庫的第二批（q101–q190，每個評鑑內容節點各 10 題），2026-09-19 命製。
 *
 * 與第一批（`aiot-junior-basics.ts`，q001–q100）同一套規格（`docs/question-authoring.md`），
 * 但情境刻意偏向 2026 年的技術現況：端側 NPU 與小型語言模型、聯邦學習、Matter／Thread、
 * 5G RedCap 與 NB-IoT 漫遊、衛星物聯網、OPC UA PubSub 與 Sparkplug、資產管理殼、
 * 時效性網路、歐盟《網路韌性法》、零信任、AI 代理的提示注入與工具護欄等。
 *
 * 獨立成檔而不併入第一批，是為了讓 `scripts/rebalance-answers.ts` 只對本批重排正解字母
 * （該工具不是冪等的，不能對既有題庫重跑）；兩批在 `practice/index.ts` 合併後才是完整題庫。
 *
 * ⚠️ 內容為 LLM 命製、未經人工事實查核，與第一批屬同一批風險（見 docs/backlog.md）。
 */
export const practiceQuestions: Question[] = [
  // ── A1.1 AI 基礎概念（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q101",
    subjectId: "aiot-junior-basics",
    prompt:
      "某風場的維運團隊想在每座風機的控制櫃內，以一顆內建 NPU 的微控制器判讀齒輪箱振動是否異常。可用資料是三年份正常運轉波形，以及僅 9 次確認故障的片段；控制櫃對外只有每小時一次的窄頻回報。就模型的學習方式而言，下列何者最合理？",
    choices: [
      { id: "A", text: "以獎勵函數讓模型在運轉中自行嘗試不同判斷" },
      { id: "B", text: "以正常波形學習其分布，對偏離者發出警示" },
      { id: "C", text: "以 9 次故障片段訓練二元分類器" },
      { id: "D", text: "把波形逐段上傳，由雲端大型模型逐筆判讀" },
    ],
    answer: "B",
    explanation:
      "故障樣本只有個位數，任何監督式分類器都學不到可泛化的決策邊界；而正常資料充足，正是非監督式異常偵測（如自編碼器重建誤差、單類別模型）的適用條件。這類模型體積小，也符合在 NPU 微控制器上就地推論、僅回報異常事件的頻寬限制。",
    choiceExplanations: {
      A: "強化學習需要環境能對每次決策回饋獎勵，風機不可能讓模型反覆嘗試「誤判」來換取訊號，且它解決的是決策序列問題，不是辨識問題。",
      C: "9 筆正樣本對上數萬筆負樣本，分類器會學到「永遠回答正常」仍有極高準確率，故障特徵根本沒有被學到；標籤量不足時應先改用只需正常資料的方法。",
      D: "每小時一次的窄頻回報無法承載連續振動波形，逐筆上傳在通訊上就不可行；判讀也應在現場完成，雲端只需收到異常摘要。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["異常偵測", "非監督式學習", "端側推論", "資料不平衡"],
      constraints: ["data", "bandwidth", "compute"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Correct in Different Context",
        D: "Layer Confusion",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若故障紀錄累積到每種型態各有數百筆且標註一致，監督式分類會反過來更有價值，因為它能直接指出「是哪一種故障」而不只是「不正常」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q102",
    subjectId: "aiot-junior-basics",
    prompt:
      "某物流公司想在冷藏車的車機上執行一個小型語言模型，讓司機用口語詢問「這趟貨的溫度紀錄有沒有超標」。車機只有 4 GB 記憶體、無 GPU，且隧道與郊區常無網路。關於模型部署前的處理，下列敘述何者正確？",
    choices: [
      { id: "A", text: "壓縮權重會讓模型忘記訓練資料，因此每次上車前都必須重新訓練" },
      { id: "B", text: "把權重從 16 位元浮點壓成 4 位元整數後，模型參數數量會減為原本的四分之一" },
      { id: "C", text: "只要模型能在雲端執行，車機就一定能以相同精度執行，差別只在回應速度" },
      { id: "D", text: "把權重從 16 位元浮點壓成 4 位元整數，可讓模型放進記憶體，但回答品質會略為下降" },
    ],
    answer: "D",
    explanation:
      "量化是把每個權重改用較少位元表示，參數數量不變、體積與記憶體需求大幅縮小，代價是數值精度損失導致回答品質略降。把 16 位元壓到 4 位元約可縮小四倍，是讓小型語言模型塞進無 GPU 車機並離線運作的常見做法。",
    choiceExplanations: {
      A: "量化是一次性的離線轉換，模型的知識仍在權重裡，不需要也不會每次重新訓練；退化的是精度而不是記憶。",
      B: "量化改變的是每個參數占用的位元數，不會刪除任何參數；參數數量減少是剪枝或蒸餾的效果，兩者常被混淆。",
      C: "雲端有充足的記憶體與加速器，車機沒有；同一個模型若不經量化或縮小，根本載不進 4 GB 記憶體，談不上相同精度。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["模型量化", "小型語言模型", "端側部署", "記憶體限制"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Terminology Swap",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若車機改配 16 GB 記憶體與 NPU，量化的必要性降低，此時可優先保留 8 位元或原始精度以換取回答品質，決策重點轉為推論延遲與功耗。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q103",
    subjectId: "aiot-junior-basics",
    prompt:
      "某連鎖健身房在各分店的門口攝影機上部署人數計數模型。上線八個月後，同一批攝影機的計數誤差從 3% 升到 15%，硬體、鏡頭清潔與網路均已確認正常。夏季門口新增了大型遮陽棚，畫面光線明顯改變。此現象最貼切的描述是下列何者？",
    choices: [
      { id: "A", text: "輸入資料的分布已偏離訓練時的情況" },
      { id: "B", text: "模型過擬合訓練資料，需要增加正規化" },
      { id: "C", text: "模型的參數在推論期間被逐步改寫" },
      { id: "D", text: "攝影機的取樣率不足以捕捉移動中的人" },
    ],
    answer: "A",
    explanation:
      "模型上線時表現良好，之後因環境（光線、遮陽棚陰影）改變而退化，是典型的資料漂移：模型沒有變，變的是輸入的分布。處置是用新環境的影像補資料再訓練或微調，並建立長期的效能監控。",
    choiceExplanations: {
      B: "過擬合在上線初期就會表現不佳，不會先好八個月再退化；本題的時間軸指向環境改變而非訓練問題。",
      C: "推論階段模型參數是唯讀的，不會被改寫；把退化歸咎於參數變動是對推論流程的誤解。",
      D: "取樣率若不足，從第一天起就會漏算，且與遮陽棚無關；題幹已說硬體正常，退化也是漸進而非固定的。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["資料漂移", "模型監控", "再訓練"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若門口的計數標準本身改變（例如改為只計會員、不計訪客），那就是概念漂移而非資料漂移，單靠補新環境影像無法修正，必須重新定義標籤。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q104",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫療器材公司想用五家醫院的心電圖資料改善心律不整偵測模型，但各院依法不得把病患原始資料交給任何外部單位。下列訓練方式何者能在符合限制的前提下讓五家醫院的資料都貢獻到模型？",
    choices: [
      { id: "A", text: "只選一家願意提供資料的醫院訓練，再推廣到其他院" },
      { id: "B", text: "各院把資料去識別化後集中到公司的伺服器訓練" },
      { id: "C", text: "各院在本地訓練，只上傳模型更新量到中央彙整" },
      { id: "D", text: "由公司自行合成心電圖資料，不使用醫院資料" },
    ],
    answer: "C",
    explanation:
      "聯邦學習讓每家醫院在院內用自己的資料訓練，只把模型的梯度或權重更新送到中央彙整，原始資料從未離開醫院，正好符合資料不得外流的法規限制，又能讓五家的資料共同貢獻。",
    choiceExplanations: {
      A: "單一醫院的病患族群有限，模型泛化到其他院時容易失效，也沒有讓其餘四家的資料參與。",
      B: "去識別化後集中仍是把病患資料交給外部單位，且心電圖本身具高度可再識別性，並未滿足「不得交給外部」的限制。",
      D: "合成資料可作為補充，但無法涵蓋真實病患的多樣性與罕見型態，等於放棄五家醫院資料的價值，並未回答如何讓它們貢獻。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["聯邦學習", "資料隱私", "分散式訓練"],
      constraints: ["privacy", "regulation"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Correct in Different Context",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若各院之間允許在受控的資料信託平台上集中訓練，集中式訓練會更簡單且收斂更快，聯邦學習的通訊與協調成本就不再值得。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q105",
    subjectId: "aiot-junior-basics",
    prompt:
      "某電子廠的表面貼裝產線要辨識焊點是否有橋接或空焊。工程師比較兩種方案：甲、用數千張已標註影像訓練一個卷積網路；乙、直接用一個具影像理解能力的大型多模態模型，以文字提示描述缺陷即可判斷。在「每件產品 0.5 秒內判完、產線無外網」的條件下，下列評估何者最正確？",
    choices: [
      { id: "A", text: "乙的判斷結果可作為訓練標籤，因此可完全取代品檢員的標註" },
      { id: "B", text: "乙不需標註就能辨識新型缺陷，因此在節拍與離線條件下仍優於甲" },
      { id: "C", text: "甲與乙都必須連上雲端才能執行，因此本案無法用 AI" },
      { id: "D", text: "甲能在現場小型硬體上穩定達到節拍，乙的延遲難以符合" },
    ],
    answer: "D",
    explanation:
      "大型多模態模型的優勢是零樣本泛化，但推論需要大量運算，且多數只能在雲端或高階 GPU 上以秒級回應；產線要求半秒內判完又無外網，量身訓練的小型卷積網路在邊緣硬體上更能穩定達到節拍。",
    choiceExplanations: {
      A: "大型模型的判斷可以輔助初步標註，但它本身會出錯，直接當作真值會把錯誤學進模型，仍需人工複核。",
      B: "免標註、可辨識新缺陷是真實優點，但大型多模態模型的推論延遲與運算需求，在半秒節拍與無外網的條件下正是它的弱點，不是強項。",
      C: "小型卷積網路可以完全在現場的工業電腦或 NPU 上執行，不需要雲端；把兩者都說成必須連網並不正確。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["多模態模型", "卷積神經網路", "推論延遲", "邊緣推論"],
      constraints: ["latency", "connectivity", "cost"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若任務改為「離線分析每日抽檢影像並產生文字報告」，節拍與連線限制消失，多模態模型免標註、可解釋的優勢就會勝出。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q106",
    subjectId: "aiot-junior-basics",
    prompt:
      "某污水處理廠想用 AI 協助操作員決定曝氣量。廠方提出四種輸出形式，何者屬於「迴歸」而非「分類」任務？",
    choices: [
      { id: "A", text: "判斷目前水質是否符合放流標準" },
      { id: "B", text: "把每天的進流水分成三種負荷等級" },
      { id: "C", text: "預測未來一小時的溶氧濃度數值" },
      { id: "D", text: "辨識曝氣機是否出現異常聲響" },
    ],
    answer: "C",
    explanation:
      "迴歸的輸出是連續數值，預測溶氧濃度正是如此；符合與否、負荷等級、是否異常都是離散類別，屬於分類任務。區分兩者決定了損失函數與評估指標的選擇。",
    choiceExplanations: {
      A: "「符合／不符合」是二元類別，屬於分類任務，評估會用準確率或召回率而非誤差量。",
      B: "三種負荷等級是有限的離散類別，即使等級有高低順序，仍是分類（或序數分類）而非迴歸。",
      D: "「是否異常」是二元判斷，屬於分類；聲響的原始訊號雖是連續波形，但輸出仍是類別。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Concept Boundary",
      concepts: ["迴歸", "分類", "任務類型"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若題目改為「預測溶氧是否會在一小時內低於 2 mg/L」，同一個量測目標就從迴歸變成分類，因為輸出變成了是或否。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q107",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠導入 AI 助理，讓維修人員用自然語言查詢設備手冊與歷史工單。試用時發現助理常引用不存在的零件編號。在不重新訓練模型的前提下，下列改善何者最直接？",
    choices: [
      { id: "A", text: "先從手冊與工單檢索相關段落，再依段落作答" },
      { id: "B", text: "把模型的輸出長度上限調高，讓它有空間寫完整" },
      { id: "C", text: "改用參數量更大的模型，以更多預訓練知識涵蓋零件編號" },
      { id: "D", text: "要求助理在每則回答末尾附上免責聲明" },
    ],
    answer: "A",
    explanation:
      "捏造零件編號是語言模型的幻覺。檢索增強生成讓模型先從廠內真實文件取回相關段落、再依據段落回答，並可附上出處，能在不重訓的情況下把回答錨定在實際資料上。",
    choiceExplanations: {
      B: "輸出長度與內容真偽無關，給更多空間只會讓錯誤的編號寫得更完整。",
      C: "預訓練知識再多也不包含這家工廠的零件編號，幻覺的根源是缺少廠內資料的依據，而不是模型太小。",
      D: "免責聲明只是轉移責任，維修人員仍會拿到錯的編號，問題本身沒有被處理。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["生成式 AI", "幻覺", "檢索增強生成"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若手冊內容穩定多年且允許重新訓練，把文件微調進模型也能改善；但只要文件會持續更新，檢索的方式在維護成本上仍然勝出。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q108",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於在感測節點上執行機器學習（常稱 TinyML）的敘述，下列何者「不」正確？",
    choices: [
      { id: "A", text: "節點端推論可讓裝置只在偵測到事件時才啟動無線傳輸" },
      { id: "B", text: "微控制器的記憶體通常以 KB 到數 MB 計，模型必須經過縮小" },
      { id: "C", text: "節點端可直接用蒐集到的資料持續重新訓練整個深度模型" },
      { id: "D", text: "模型通常先在伺服器訓練，再轉換成可在微控制器執行的格式" },
    ],
    answer: "C",
    explanation:
      "微控制器的運算與記憶體只夠執行已縮小的模型做推論，完整的深度模型訓練仍在伺服器進行；節點端至多做極輕量的參數微調。其餘三項都是 TinyML 的典型流程與效益。",
    choiceExplanations: {
      A: "在節點判斷後只回傳事件，是端側推論最主要的省電與省頻寬理由，敘述正確。",
      B: "微控制器資源以 KB 到 MB 計，模型必須量化、剪枝或重新設計才放得下，敘述正確。",
      D: "訓練在伺服器、推論在節點，是 TinyML 的標準分工，轉換工具會把模型量化並產生可嵌入的程式碼。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["TinyML", "端側推論", "微控制器", "模型縮小"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若節點升級為帶 NPU 與數百 MB 記憶體的邊緣模組，在裝置上做增量微調就變得可行，這一項的判斷會隨硬體等級改變。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q109",
    subjectId: "aiot-junior-basics",
    prompt:
      "某捷運公司要評估月台跌落偵測模型。測試資料中有 10,000 段影片，其中 50 段真的有人跌落。模型把全部影片都判為「無跌落」時，準確率為 99.5%。下列對此結果的解讀何者正確？",
    choices: [
      { id: "A", text: "準確率極高且誤報為零，模型可以直接上線使用" },
      { id: "B", text: "應改看召回率，因為模型一次跌落都沒抓到" },
      { id: "C", text: "測試資料的正樣本只占 0.5%，無法評估任何指標" },
      { id: "D", text: "應改看精確率，因為模型對跌落事件的誤報明顯太多" },
    ],
    answer: "B",
    explanation:
      "正負樣本極度不平衡時，準確率會被多數類別淹沒；一個從不報警的模型也能得到 99.5%。安全事件的重點是「該抓的有沒有抓到」，也就是召回率，此模型的召回率是 0%，完全不能用。",
    choiceExplanations: {
      A: "誤報為零是因為模型從不報警，準確率在不平衡資料上沒有鑑別力，這個 99.5% 對應的是一個完全沒有偵測能力的模型。",
      C: "正樣本比例低不等於無法評估，五十個正樣本足以計算召回率，問題出在選錯指標而非資料量。",
      D: "精確率衡量的是報警中有多少是真的，本模型根本沒有報警，問題不在誤報而在漏報。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["準確率", "召回率", "類別不平衡", "模型評估"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Layer Confusion",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若情境改為垃圾郵件過濾，把正常郵件誤判為垃圾的代價較高，評估重心就會轉向精確率而非召回率。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q110",
    subjectId: "aiot-junior-basics",
    prompt:
      "某智慧農場計畫讓 AI 代理程式自動調度灌溉、施肥與溫室通風，代理程式可呼叫各設備的控制介面。從 AI 系統設計的角度，下列哪一項設計最能防止代理程式在推理出錯時造成實體損害？",
    choices: [
      { id: "A", text: "把代理程式的回應溫度參數設為零，讓輸出穩定可重現" },
      { id: "B", text: "讓代理程式使用參數量最大的模型以降低推理錯誤" },
      { id: "C", text: "要求代理程式在每次動作前先輸出完整的推理過程" },
      { id: "D", text: "限制可呼叫的控制動作範圍，超出需人工確認" },
    ],
    answer: "D",
    explanation:
      "代理程式可以直接驅動實體設備，推理錯誤會變成真實動作。最有效的防線是在工具層設定護欄：限制動作範圍（如單次灌溉上限、通風不得全關）、高風險動作需人在迴圈確認。這是把安全交給確定性的規則，而不是寄望模型不出錯。",
    choiceExplanations: {
      A: "溫度設為零只讓輸出可重現，不代表推理正確；同樣的錯誤會被穩定地重複執行，無法防止實體損害。",
      B: "更大的模型仍會出錯，且成本與延遲更高；安全不能只依賴模型本身的可靠度。",
      C: "輸出推理過程有助於事後追查，但過程寫得再詳細，錯誤的動作照樣會被執行，並不能阻止損害。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["AI 代理", "工具呼叫", "護欄", "人在迴圈"],
      constraints: ["safety", "reliability"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        C: "Partial Truth",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若代理程式只做建議、由人手動執行每一項動作，工具層護欄的必要性大幅降低，設計重點會轉為建議的可解釋性與追溯。",
    },
  },
  // ── A1.2 AIoT 應用案例（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q111",
    subjectId: "aiot-junior-basics",
    prompt:
      "某社區停車場設有 40 支電動車充電樁，契約容量固定。營運商希望在不超約的前提下讓最多車輛充飽，並優先照顧隔天早班的住戶。下列 AIoT 設計何者最能達成？",
    choices: [
      { id: "A", text: "所有充電樁固定以最大功率輸出，超約時由台電端跳脫" },
      { id: "B", text: "依各車預計離場時間與即時總負載，動態分配各樁功率" },
      { id: "C", text: "每支充電樁平均分配契約容量，不隨車輛電量與離場時間調整" },
      { id: "D", text: "把充電時段一律排到深夜離峰時段，其餘時間停止供電" },
    ],
    answer: "B",
    explanation:
      "這是典型的智慧能源管理：結合每輛車的預估離場時間、目前電量與總負載上限，用最佳化或排程模型動態調配功率，既不超約又能滿足多數需求。它同時需要感測（電表、充電樁狀態）與預測（離場時間），正是 AIoT 的價值所在。",
    choiceExplanations: {
      A: "讓契約容量被超過再靠跳脫保護，會造成整批充電中斷與超約罰款，是最糟的做法。",
      C: "平均分配沒有考慮各車的急迫程度與電量，早班住戶可能仍充不飽，功率也常閒置在已充滿的樁上。",
      D: "只排深夜離峰雖然電價低，卻無法照顧下午進場、晚間就要出車的住戶，也浪費白天太陽能發電的低價電力。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["智慧充電", "負載管理", "需量控制", "排程最佳化"],
      constraints: ["power", "fairness"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若契約容量遠大於 40 支樁的總功率，動態分配的效益消失，固定最大功率輸出反而最簡單可靠。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q112",
    subjectId: "aiot-junior-basics",
    prompt:
      "某長照機構打算導入非接觸式的夜間照護監測，要求能偵測長者是否離床或跌倒，且住民與家屬明確反對在房內裝設攝影機。下列感測方案最符合需求？",
    choices: [
      { id: "A", text: "毫米波雷達感測姿態與呼吸，僅回傳事件而非影像" },
      { id: "B", text: "低解析度攝影機搭配人臉模糊處理，只在夜間開啟" },
      { id: "C", text: "床邊安裝麥克風陣列辨識呼救聲與跌倒撞擊聲" },
      { id: "D", text: "要求長者配戴智慧手錶偵測跌倒並自動通報" },
    ],
    answer: "A",
    explanation:
      "毫米波雷達不成像、可穿透薄物，能在黑暗中偵測離床、跌倒甚至呼吸頻率，輸出只是事件與數值，從技術上就不會產生可辨識的影像，最貼合「非接觸、無攝影機」的雙重限制。",
    choiceExplanations: {
      B: "即使模糊臉部，房內仍有攝影機在錄影，住民反對的是攝影機本身，且模糊處理可被還原或關閉，信任問題未解。",
      C: "跌倒後未必能呼救，夜間離床更不會有聲音；麥克風也會錄到談話內容，隱私疑慮不比攝影機小。",
      D: "題幹要求非接觸式，穿戴裝置需要長者記得配戴與充電，失智或臥床者常無法配合。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["毫米波雷達", "跌倒偵測", "隱私", "非接觸感測"],
      constraints: ["privacy", "usability"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若機構只需監測公共走廊且住民同意錄影，攝影機加姿態辨識的成本更低、可辨識的行為也更豐富，雷達的優勢便不明顯。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q113",
    subjectId: "aiot-junior-basics",
    prompt:
      "某城市想減少路口的行人事故，規劃在號誌控制器上加裝 AI 攝影機，當偵測到行人尚在斑馬線上時延長綠燈。下列哪一項是此應用「必須」在現場完成、而不能交由雲端處理的環節？",
    choices: [
      { id: "A", text: "判斷斑馬線上是否仍有行人並調整號誌" },
      { id: "B", text: "每月統計各路口的行人流量與尖峰時段趨勢" },
      { id: "C", text: "以現場影像重新訓練行人偵測模型" },
      { id: "D", text: "彙整事故紀錄並產生年度交通安全報告" },
    ],
    answer: "A",
    explanation:
      "延長綠燈的判斷牽涉人身安全且必須在秒級內完成，一旦網路中斷或延遲，決策就會失效；這種即時且攸關安全的閉迴路必須在現場控制器完成。統計、再訓練與報告都可以離線在雲端進行。",
    choiceExplanations: {
      B: "月度趨勢統計不需即時，資料可以彙整後在雲端處理，網路延遲對它沒有影響。",
      C: "即使用的是現場影像，重新訓練仍需大量運算與歷史資料，適合在雲端或資料中心進行，再把新模型下發到現場。",
      D: "年度報告是離線分析工作，與即時號誌控制無關，放在雲端最合適。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["邊緣運算", "即時控制", "端邊雲分工"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A2.1",
      decisionBoundary:
        "若路口與交控中心之間有專用光纖且延遲穩定在毫秒級，集中判斷在技術上可行，但單點失效風險仍讓現場判斷成為安全應用的首選。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q114",
    subjectId: "aiot-junior-basics",
    prompt:
      "某食品廠導入冷凍庫溫度監測與 AI 預警系統一年後，想向董事會證明成效。下列哪一組證據最能支持「系統有效」的結論？",
    choices: [
      { id: "A", text: "系統每天產生的溫度資料筆數與上傳成功率" },
      { id: "B", text: "供應商提供的其他客戶成功案例與推薦信" },
      { id: "C", text: "上線後一年的溫度超標報廢損失與前一年的差額" },
      { id: "D", text: "AI 模型在測試資料集上的準確率與召回率" },
    ],
    answer: "C",
    explanation:
      "導入成效要用業務結果衡量：與導入前的同期基線比較，報廢損失降低多少，才是董事會關心的可驗收指標。資料量、模型指標與他人案例都不等於自家工廠的實際效益。",
    choiceExplanations: {
      A: "資料筆數只說明系統在運作，不代表任何損失被避免，是活動指標而非成果指標。",
      B: "其他客戶的成果不能證明本廠的效益，董事會要的是自家的數字。",
      D: "測試集準確率是技術指標，模型準確不代表預警被及時處理、也不代表損失真的下降。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["導入效益", "基線比較", "成果指標"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若前一年剛好沒有任何超標事件，單純比較差額會失去意義，此時應改用預警次數與每次的處置時間等過程指標搭配風險估算。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q115",
    subjectId: "aiot-junior-basics",
    prompt:
      "某大樓管理公司想用 AIoT 降低空調用電，現況是各樓層的溫度、人數與外氣資料都已回傳到平台。下列做法何者最能展現「AI」相對於傳統定時控制的附加價值？",
    choices: [
      { id: "A", text: "溫度超過 26 度時開啟、低於 24 度時關閉，維持設定區間" },
      { id: "B", text: "在每天 18 點準時把所有樓層的空調關閉" },
      { id: "C", text: "把所有感測資料匯出成試算表，供人工查閱後調整設定" },
      { id: "D", text: "依人數與外氣預測冷負荷，提前調整主機出水溫度" },
    ],
    answer: "D",
    explanation:
      "傳統定時或門檻控制只能被動反應；AI 的價值在於用多來源資料預測未來負荷，提前調整主機運轉點，避免過冷過熱與尖峰用電。這才是把感測資料轉成決策的差異所在。",
    choiceExplanations: {
      A: "門檻控制是簡單的規則迴路，任何恆溫器都做得到，與 AI 無關。",
      B: "定時關閉是最傳統的時間表控制，沒有用到任何感測資料或預測。",
      C: "匯出資料給人看只是把判斷交回人力，沒有任何自動化決策，談不上 AI。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["智慧建築", "負荷預測", "AIoT 與 IoT 差異"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若大樓的使用模式極為固定且外氣變化小，簡單的時程與門檻控制已能接近最佳，預測模型的額外節能就不足以支付建置成本。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q116",
    subjectId: "aiot-junior-basics",
    prompt:
      "某茶園要在 30 公頃山坡地監測土壤濕度與微氣候，並用模型建議灌溉時機。園區無市電、手機訊號微弱，節點需以電池運作三年、每 30 分鐘回報一次少量數值。下列整體方案何者最合理？",
    choices: [
      { id: "A", text: "以 Wi-Fi 網狀網路覆蓋全園區，節點市電供電" },
      { id: "B", text: "每個節點內建 4G 模組與攝影機，以影像上傳雲端分析葉片與土壤" },
      { id: "C", text: "低功耗廣域網路節點回傳數值，模型在閘道器或雲端運算" },
      { id: "D", text: "每個節點內建 GPU 執行深度模型並保留所有資料" },
    ],
    answer: "C",
    explanation:
      "少量數值、低頻回報、長距離、電池運作三年，正是低功耗廣域網路（如 LoRaWAN）的典型適用情境；灌溉建議不需毫秒回應，模型放在閘道器或雲端即可。這是依資料量、功耗與距離做整體選型的範例。",
    choiceExplanations: {
      A: "園區沒有市電，Wi-Fi 的覆蓋距離短、耗電高，30 公頃山坡地要鋪網狀網路既貴又難供電。",
      B: "4G 與攝影機的耗電是電池節點無法負擔的，影像也遠超需求，訊號微弱更讓上傳不可靠。",
      D: "GPU 節點的功耗以瓦計，電池撐不了幾天；灌溉建議也不需要在每個節點上跑深度模型。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["低功耗廣域網路", "智慧農業", "電池續航", "系統選型"],
      constraints: ["power", "range", "bandwidth"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若園區改為需要即時病蟲害影像判讀，資料量與運算需求都跳升，就得在少數有供電的位置設置攝影機與邊緣運算節點，而不是全面沿用低功耗網路。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q117",
    subjectId: "aiot-junior-basics",
    prompt:
      "某汽車零件廠要建立產線的數位分身，用來在導入新排程前先模擬對產出的影響。下列哪一項是讓數位分身「有用」的最關鍵前提？",
    choices: [
      { id: "A", text: "分身必須由設備原廠而非自家團隊建置" },
      { id: "B", text: "分身的 3D 畫面必須與現場設備外觀完全一致" },
      { id: "C", text: "分身必須部署在雲端而非廠內伺服器" },
      { id: "D", text: "分身模型能持續以現場的即時資料校正自身狀態" },
    ],
    answer: "D",
    explanation:
      "數位分身的價值在於它與實體之間有持續的資料連結：現場的稼動、節拍、庫存不斷回饋更新分身狀態，模擬結果才能反映現況。少了這條即時資料鏈，它只是一個靜態的模擬模型。",
    choiceExplanations: {
      A: "由誰建置不是前提，自家團隊只要掌握製程資料與模型同樣能建置有效的分身。",
      B: "外觀擬真只影響視覺呈現，對排程模擬的正確性沒有幫助；許多有效的分身根本沒有 3D 畫面。",
      C: "部署位置是工程選擇，廠內伺服器同樣可以承載分身，與它是否有用無關。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Direct Concept",
      concepts: ["數位分身", "即時資料同步", "模擬"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若目的只是設計階段的一次性產能試算，靜態模擬模型就足夠，即時資料同步的建置成本就不必先投入。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q118",
    subjectId: "aiot-junior-basics",
    prompt:
      "某零售連鎖在門市貨架上部署重量感測與攝影機，希望自動補貨。試營運時發現：貨架資料準確，但補貨建議常在貨已上架後才送達，導致重複補貨。此問題最可能出在系統的哪一個環節？",
    choices: [
      { id: "A", text: "感測到決策再到通知的整體延遲過長" },
      { id: "B", text: "重量感測器的解析度不足以分辨單件商品" },
      { id: "C", text: "攝影機影像模型的商品辨識準確率太低" },
      { id: "D", text: "貨架感測器的電源供應不穩定導致斷訊" },
    ],
    answer: "A",
    explanation:
      "題幹已說貨架資料準確，問題是建議「太晚」到達，這是端到端延遲問題：資料上傳頻率、雲端批次處理、通知派送任一環節過慢，都會讓決策落後於現場。處置是縮短處理週期或把補貨判斷移到門市端。",
    choiceExplanations: {
      B: "解析度不足會讓資料不準，但題幹已確認貨架資料準確，感測層不是問題所在。",
      C: "模型準確率低會產生錯誤建議，而不是正確但延遲的建議；症狀不符。",
      D: "電源不穩會造成資料中斷或缺漏，題幹描述的是完整但遲到的建議。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["端到端延遲", "資料管線", "智慧零售"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A2.1",
      decisionBoundary:
        "若補貨建議準時但內容常錯，問題就會轉向感測精度或模型，排查的重點從資料管線的時間軸轉為資料品質。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q119",
    subjectId: "aiot-junior-basics",
    prompt:
      "某公司規劃「智慧家庭」產品線，涵蓋門鎖、燈具、空調與能源管理。關於此類消費性 AIoT 應用，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "跨品牌互通標準可讓不同廠牌裝置以同一個控制器管理" },
      { id: "B", text: "家庭裝置因不涉及生產，資安風險可以忽略" },
      { id: "C", text: "家用能源管理可結合太陽能與電動車，依電價時段調度用電" },
      { id: "D", text: "本地語音或自動化規則可在斷網時維持基本功能" },
    ],
    answer: "B",
    explanation:
      "家庭裝置直接關係到住家安全與個人隱私：門鎖被入侵、攝影機被窺視、裝置被納入殭屍網路發動攻擊，都是真實案例；近年法規更要求消費性連網產品負起安全更新義務。其餘三項都是智慧家庭的正確趨勢。",
    choiceExplanations: {
      A: "跨品牌互通標準（如 Matter）正是為了讓不同廠牌的裝置以同一控制器管理，敘述正確。",
      C: "家用能源管理系統結合太陽能、儲能與電動車依時間電價調度，是智慧家庭的主流應用，敘述正確。",
      D: "本地執行的自動化與語音處理讓斷網時仍能開燈、開鎖，是近年產品設計的重點，敘述正確。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["智慧家庭", "互通標準", "家庭能源管理", "消費性資安"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若產品完全離線且不與任何網路連接，網路攻擊面確實大幅縮小，但實體與韌體層的安全仍不能忽略。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q120",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫院想讓病房的輸液幫浦、生理監視器與床位系統的資料匯流，並用 AI 提前預警病情惡化。院方要求病患資料不得離開院區，且模型須能在新增設備品牌時快速接入。下列架構規劃何者最合理？",
    choices: [
      { id: "A", text: "把所有設備資料上傳公有雲，由雲端統一建模與即時預警" },
      { id: "B", text: "院內建置整合平台統一各設備資料格式，模型在院內伺服器運算" },
      { id: "C", text: "每種設備各寫一套獨立的預警程式，互不整合" },
      { id: "D", text: "各設備直接連到廠商雲端，院方再從各家雲端以 API 拉取資料" },
    ],
    answer: "B",
    explanation:
      "資料不得離院，模型就要在院內運算；設備品牌會增加，就需要一個統一格式的整合層，新設備只要接上整合層即可被模型使用。院內整合平台加院內運算同時滿足兩項限制。",
    choiceExplanations: {
      A: "上傳公有雲直接違反資料不得離院的要求。",
      C: "各寫一套無法看到跨設備的綜合徵象，預警能力大打折扣，新增品牌時也要從頭再寫。",
      D: "資料進了各家廠商的雲端就已經離開院區，違反限制，且從多家雲端拉資料的整合成本更高。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Architecture",
      concepts: ["醫療物聯網", "資料整合層", "院內運算", "可擴充性"],
      constraints: ["privacy", "interoperability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若法規允許去識別化後的資料上雲，雲端統一建模在跨院學習與維護成本上會更有優勢，院內平台可縮減為資料前處理與去識別化的角色。",
    },
  },
  // ── A2.1 物聯網架構與功能（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q121",
    subjectId: "aiot-junior-basics",
    prompt:
      "某連鎖超市在 200 家門市各裝設冷藏櫃溫度感測器與一台邊緣閘道器，總部平台負責跨店分析。近期總部要求「每家門市的溫度異常告警必須在斷網時仍能本地發出，且連線恢復後不得遺漏任何歷史資料」。下列哪一項功能應放在邊緣閘道器上？",
    choices: [
      { id: "A", text: "全公司使用者的帳號、角色與權限管理" },
      { id: "B", text: "所有門市感測器與閘道器的韌體版本管理" },
      { id: "C", text: "門檻判斷與本地告警，並在本地暫存待上傳的資料" },
      { id: "D", text: "跨店的溫度趨勢比較與每月的能耗報表產製" },
    ],
    answer: "C",
    explanation:
      "斷網時仍要告警，判斷邏輯就必須在門市本地執行；連線恢復後不得遺漏資料，閘道器就需要本地緩衝與重送。這兩項都是邊緣層的典型職責，其餘三項屬於需要全域視角的平台層功能。",
    choiceExplanations: {
      A: "帳號與權限是全公司共用的身分服務，屬平台或身分層，與門市的即時判斷無關。",
      B: "韌體版本管理需要統一的裝置登錄與派送機制，是平台層的裝置管理功能，各店閘道器只是被管理的對象。",
      D: "跨店比較需要所有門市的資料，只有總部平台看得到全局，放在單一門市的閘道器上做不到。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["邊緣閘道器", "本地緩衝", "端邊雲分工", "離線運作"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若門市網路有雙路備援且允許告警延遲數分鐘，本地判斷的必要性降低，把邏輯集中在平台可減少 200 台閘道器的維護負擔。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q122",
    subjectId: "aiot-junior-basics",
    prompt:
      "在一般的物聯網四層架構（感知層、網路層、平台層、應用層）中，「把 Modbus RTU 電表的讀值轉成 MQTT 訊息並送往後端」的工作，主要落在哪一層？",
    choices: [
      { id: "A", text: "平台層" },
      { id: "B", text: "感知層" },
      { id: "C", text: "網路層" },
      { id: "D", text: "應用層" },
    ],
    answer: "C",
    explanation:
      "協定轉換與資料傳送是閘道器的工作，閘道器在四層架構中歸屬網路層：它把現場的串列協定橋接到 IP 網路與訊息協定。感知層只負責量測，平台層負責儲存與處理，應用層則面向使用者。",
    choiceExplanations: {
      A: "平台層接收已經到達後端的訊息並儲存、處理，協定轉換發生在資料抵達平台之前。",
      B: "感知層是電表與感測器本身，它產生讀值但不負責轉成 MQTT 或送上網路。",
      D: "應用層是儀表板與業務功能，離現場協定最遠。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["物聯網四層架構", "閘道器", "協定轉換"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若採用「端、邊、雲」三層說法，同一件工作會被歸到「邊」；層次名稱隨架構模型而異，重點是它發生在資料離開現場、進入後端之前。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q123",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫院在 30 個護理站各部署一台邊緣主機，執行病房監測的 AI 模型。資訊室反映每次模型改版都要派人到各站手動更新，且各站版本不一。下列改善何者最直接？",
    choices: [
      { id: "A", text: "把所有模型集中到雲端執行，取消各站的邊緣主機與本地推論" },
      { id: "B", text: "以容器封裝模型，由邊緣管理平台統一派送與回滾" },
      { id: "C", text: "把模型改為每週用隨身碟由資訊人員巡迴更新並記錄版本" },
      { id: "D", text: "為每個護理站各聘一名工程師，負責模型更新與版本維護" },
    ],
    answer: "B",
    explanation:
      "邊緣節點數量一多，部署與版本管理就必須自動化。以容器封裝模型與相依環境，透過邊緣管理平台集中派送、監控版本、失敗時回滾，是目前邊緣運算的標準做法，能同時解決人力與版本不一的問題。",
    choiceExplanations: {
      A: "病房監測需要低延遲與斷網可用，集中到雲端會犧牲這兩點；管理問題應以管理工具解決，而不是拆掉架構。",
      C: "巡迴更新並記錄版本只是把手動作業排成固定週期，一週內各站仍可能版本不一，人力負擔也還在，還新增了媒體遺失的風險。",
      D: "以人力堆疊來解決自動化缺口，成本與一致性都無法接受。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["邊緣運算", "容器化", "邊緣編排", "版本管理"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若邊緣主機只有兩三台且模型一年才改一次，導入編排平台的建置成本可能高於手動更新，此時簡單的腳本派送就足夠。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q124",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠將 500 台設備的振動資料直接以每秒 1 kB 的速率送上雲端。財務部門發現雲端流量與儲存費用逐月暴增，而分析部門其實只需要每台設備的每分鐘統計值與異常事件。下列架構調整何者最合理？",
    choices: [
      { id: "A", text: "把設備數量減半，只保留關鍵機台以降低資料量" },
      { id: "B", text: "把上傳頻率改為每小時一次，每次送出該小時的全部原始資料" },
      { id: "C", text: "改用更便宜的雲端儲存等級保存原始資料" },
      { id: "D", text: "在邊緣先做統計摘要與異常判斷，只上傳摘要與事件" },
    ],
    answer: "D",
    explanation:
      "分析只需要摘要與事件，卻把全部原始資料上雲，是頻寬與儲存的浪費。在邊緣做前處理，把資料量在源頭縮減到需求的尺度，是「端邊雲」分工的核心理由之一，同時也降低了對外網路的依賴。",
    choiceExplanations: {
      A: "減少監測設備是犧牲監測範圍換取費用，與需求相違，不是架構問題的解法。",
      B: "改變上傳週期不會減少總資料量，流量與儲存費用依然存在，只是變成批次而已。",
      C: "降低儲存單價只能緩解一部分費用，傳輸流量與後續處理的成本並未改變，且原始資料根本沒有人用。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["邊緣前處理", "資料縮減", "雲端成本", "端邊雲分工"],
      constraints: ["bandwidth", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若分析部門日後要用原始波形訓練新模型，就需要在邊緣保留一段時間的原始資料或以抽樣方式上傳，摘要化的程度要隨用途重新協商。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q125",
    subjectId: "aiot-junior-basics",
    prompt:
      "某系統在雲端平台上為每台裝置維護一份「裝置影子」，記錄裝置最後回報的狀態與平台希望它進入的狀態。下列哪一種情境最能說明這個機制的用途？",
    choices: [
      { id: "A", text: "在雲端以 3D 模型即時顯示裝置外觀與運轉動畫" },
      { id: "B", text: "把裝置的韌體備份到雲端以便損壞時還原" },
      { id: "C", text: "裝置離線時下達的設定，上線後自動套用" },
      { id: "D", text: "把裝置的網路流量鏡射到雲端分析是否遭入侵" },
    ],
    answer: "C",
    explanation:
      "裝置影子分為「期望狀態」與「回報狀態」兩部分：平台把使用者的設定寫入期望狀態，裝置離線也無妨，等它重新連線時讀取差異並套用、再回報新狀態。這讓應用端不必關心裝置當下是否在線。",
    choiceExplanations: {
      A: "3D 呈現是數位分身的視覺化功能，影子只是一份小型的狀態文件，兩者常被混淆。",
      B: "影子記錄的是狀態值（如目標溫度、開關），不是韌體映像；韌體備份是另外的裝置管理功能。",
      D: "流量鏡射是網路資安監控的做法，用來偵測入侵，與裝置期望狀態和回報狀態的同步無關。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Direct Concept",
      concepts: ["裝置影子", "期望狀態", "回報狀態", "離線同步"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若裝置永遠在線且指令必須即時生效（例如緊急停機），直接的命令通道比影子更合適，影子的非同步特性反而會讓人誤以為指令已執行。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q126",
    subjectId: "aiot-junior-basics",
    prompt:
      "某高速公路的路側單元要與行經車輛交換「前方事故」訊息，並在幾十毫秒內轉發給後方車輛。關於此類車聯網通訊的架構，下列敘述何者正確？",
    choices: [
      { id: "A", text: "路側單元只能被動接收資料，不能主動廣播" },
      { id: "B", text: "所有訊息都必須先上傳到雲端再下發，才能確保一致" },
      { id: "C", text: "車輛之間不可能直接通訊，必須透過基地台" },
      { id: "D", text: "車與路側單元之間可直接短距離通訊，不需經過雲端轉發" },
    ],
    answer: "D",
    explanation:
      "車聯網的安全訊息講求低延遲，車對路側、車對車的直接通訊（如 C-V2X 的 PC5 介面）讓訊息在幾十毫秒內就地交換，不需經過雲端；雲端負責的是非即時的交通資訊整合。",
    choiceExplanations: {
      A: "路側單元本來就會主動廣播號誌、事故與施工訊息給行經車輛。",
      B: "經雲端往返會增加數十到數百毫秒延遲，且網路中斷時安全訊息就失效，安全類訊息不走這條路。",
      C: "車對車直接通訊正是車聯網的核心能力之一，不需經過基地台。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["車聯網", "路側單元", "直接通訊", "低延遲"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Overgeneralization",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若訊息是「前方 10 公里的即時路況地圖」這類非安全性資訊，經由基地台與雲端整合再下發反而更合適，因為它需要更廣的視角而非最低延遲。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q127",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠的資料鏈路為「感測器 → PLC → 邊緣閘道器 → 平台 → 儀表板」。品保發現儀表板上的壓力曲線每隔十分鐘就出現一段平坦的直線，但現場壓力表確有起伏。下列排查何者最能縮小範圍？",
    choices: [
      { id: "A", text: "直接更換該機台的壓力感測器與類比訊號線" },
      { id: "B", text: "把儀表板的曲線圖改成折線圖並縮小時間範圍" },
      { id: "C", text: "重新安裝平台軟體並清除歷史資料後再觀察" },
      { id: "D", text: "比對閘道器本地日誌與平台收到的資料，找出斷點" },
    ],
    answer: "D",
    explanation:
      "多層鏈路的排查原則是先定位斷點：閘道器本地日誌若有完整資料而平台缺段，問題在閘道器到平台之間；閘道器本身就缺，問題在更前面。用分段比對取代猜測，是最有效率的做法。",
    choiceExplanations: {
      A: "感測器有起伏的證據是現場壓力表，題幹沒有任何指向感測器故障的線索，更換只是猜測。",
      B: "圖表型式不會憑空補回缺失的資料，平坦直線是資料本身缺段或重複的表現。",
      C: "沒有證據指向平台軟體，重裝的代價高且很可能無效。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料鏈路", "分段排查", "日誌比對"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若平坦段出現的時間與閘道器的排程任務（如每十分鐘上傳一批）吻合，就要把焦點放在閘道器的緩衝與上傳邏輯，而不是網路。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q128",
    subjectId: "aiot-junior-basics",
    prompt:
      "某公司同時經營三個廠區，各廠已有自己的設備監控系統。總部想建立跨廠的 AI 能耗最佳化，但各廠不願改動既有系統。下列架構方案何者最能在最少改動下達成？",
    choices: [
      { id: "A", text: "在各廠系統旁建資料訂閱介面，由總部匯流分析" },
      { id: "B", text: "把三個廠區的系統全部汰換為同一套新系統再統一分析" },
      { id: "C", text: "各廠每月人工匯出試算表寄給總部彙整" },
      { id: "D", text: "由總部直接連進各廠的 PLC 讀取即時資料" },
    ],
    answer: "A",
    explanation:
      "既有系統不動，只在其旁邊加一層資料輸出（如 OPC UA 伺服器或 MQTT 發布），總部平台訂閱各廠資料後統一分析，是整合舊系統時改動最少的模式，也讓各廠保有自己的控制權。",
    choiceExplanations: {
      B: "全面汰換的成本與風險最高，且直接違反各廠不願改動的前提。",
      C: "月報試算表無法支援即時或日級的最佳化，資料格式也難以統一。",
      D: "跨過廠區系統直接連 PLC，會繞過現場的安全與變更管理，也讓總部得處理三套不同的底層協定。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Architecture",
      concepts: ["系統整合", "資料匯流", "既有系統", "訂閱介面"],
      constraints: ["legacy", "cost"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      crossNode: "A2.3",
      decisionBoundary:
        "若三廠的系統都已屆汰換年限，統一換成同一套平台反而能一次解決資料格式與維護的問題，整合層的方案只是過渡。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q129",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於「數位分身」與「裝置影子」的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "前者可包含物理模型與模擬能力，後者只是裝置狀態的同步副本" },
      { id: "B", text: "兩者只是不同雲端廠商對同一狀態同步功能的不同命名" },
      { id: "C", text: "前者只能在雲端執行，後者只能在裝置端本機執行" },
      { id: "D", text: "前者用於消費性產品，後者用於工業設備與廠房" },
    ],
    answer: "A",
    explanation:
      "裝置影子是一份輕量的狀態文件，用來同步期望與回報狀態；數位分身則進一步包含物理模型、歷史資料與模擬能力，可用來預測與最佳化。影子可以是分身的一個資料來源，但兩者的目的與複雜度不同。",
    choiceExplanations: {
      B: "兩者的功能範疇不同，不是命名差異；把分身當成影子會低估它所需的模型與資料整合工作。",
      C: "執行位置不是區分依據，分身與影子都可以放在雲端或邊緣。",
      D: "產品領域不是區分依據，工業與消費性應用都同時使用這兩種機制。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["數位分身", "裝置影子", "狀態同步", "模擬"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若應用只需要「知道裝置現在的設定並在離線時排隊指令」，影子就足夠；一旦需要「預測若改變參數會發生什麼」，才需要建置分身。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q130",
    subjectId: "aiot-junior-basics",
    prompt:
      "某養雞場的環控系統原本由單一雲端服務判斷風扇與水簾的開關。夏季某日對外光纖被挖斷四小時，雞舍溫度失控造成損失。事後檢討，下列架構改善何者最能防止同類事件？",
    choices: [
      { id: "A", text: "把感測器的回報頻率提高一倍以更快發現異常" },
      { id: "B", text: "在雞舍增設本地控制器，斷網時自主控制" },
      { id: "C", text: "改用另一家可用性承諾更高的雲端服務商" },
      { id: "D", text: "在雲端增加更多跨區域的備援伺服器" },
    ],
    answer: "B",
    explanation:
      "失效的環節是「控制判斷完全依賴對外網路」。把基本的環控邏輯下放到本地控制器，雲端只負責最佳化與遠端監看，斷網時本地仍能依最後同步的規則維持安全狀態，這是攸關生命與財產的控制迴路應有的設計。",
    choiceExplanations: {
      A: "回報更頻繁在斷網時一樣送不出去，對失控毫無幫助。",
      C: "換雲端廠商不能解決光纖被挖斷的問題，斷點在對外網路而不是雲端。",
      D: "雲端再多備援，雞舍連不上雲端時一切都是空的；備援放錯了位置。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["本地自主控制", "單點失效", "斷網韌性", "端邊雲分工"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若雞舍有雙路獨立的對外線路（光纖加行動網路），本地控制器的必要性降低，但只要失控後果嚴重，本地的最後防線仍然值得保留。",
    },
  },
  // ── A2.2 常見通訊協定與網路層技術（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q131",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工廠有 300 台裝置以 MQTT 回報狀態，後端有五個分析服務都要消費同一個主題的訊息，且希望負載能平均分攤到五個服務、每則訊息只被處理一次。下列 MQTT 機制何者最直接對應？",
    choices: [
      { id: "A", text: "遺囑訊息" },
      { id: "B", text: "保留訊息" },
      { id: "C", text: "共享訂閱" },
      { id: "D", text: "QoS 2" },
    ],
    answer: "C",
    explanation:
      "MQTT 5 的共享訂閱讓多個訂閱者組成一個群組，Broker 把同一主題的每則訊息只分派給群組中的一個成員，天然達成負載分攤與單次處理。傳統訂閱則會把每則訊息複製給所有訂閱者。",
    choiceExplanations: {
      A: "遺囑訊息是裝置異常斷線時由 Broker 代發的通知，屬於連線狀態管理。",
      B: "保留訊息是讓新訂閱者立即取得該主題的最後一筆值，與多個消費者分攤負載無關。",
      D: "QoS 2 保證每則訊息恰好送達一次，但仍會送給每一個訂閱者，無法分攤負載。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["MQTT 5", "共享訂閱", "負載分攤", "發布訂閱"],
      constraints: ["scalability", "reliability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若五個服務各自需要完整的資料流（例如一個存檔、一個告警、一個分析），就要回到一般訂閱讓每個服務都收到每則訊息，共享訂閱反而會造成漏收。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q132",
    subjectId: "aiot-junior-basics",
    prompt:
      "某智慧家庭新品要同時支援門鎖、溫濕度感測器與燈泡，要求「電池裝置續航數月、裝置之間可互相轉發以延伸覆蓋、透過家中的邊界路由器接上 IP 網路」。下列無線技術何者最符合？",
    choices: [
      { id: "A", text: "NB-IoT" },
      { id: "B", text: "Wi-Fi 7" },
      { id: "C", text: "藍牙 Classic" },
      { id: "D", text: "Thread" },
    ],
    answer: "D",
    explanation:
      "Thread 是基於 IEEE 802.15.4 與 IPv6 的低功耗網狀網路：電池裝置可休眠、路由器節點可互相轉發、邊界路由器直接橋接到家中的 IP 網路，正是 Matter 生態系中電池型裝置的主要傳輸層。",
    choiceExplanations: {
      A: "NB-IoT 走電信基地台，適合戶外廣域的少量資料回報，家中裝置不需付月租走電信網路，也無法組成室內網狀網路。",
      B: "Wi-Fi 7 追求的是高吞吐與低延遲，功耗遠超電池型門鎖與感測器能負擔，也不以裝置互相轉發為設計目標。",
      C: "藍牙 Classic 耗電高、以點對點串流為主，不具備低功耗網狀與 IP 原生的特性。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["Thread", "低功耗網狀網路", "邊界路由器", "Matter"],
      constraints: ["power", "range", "interoperability"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若裝置改為市電供電的攝影機且需要串流影像，頻寬需求壓過功耗考量，Wi-Fi 就會成為正確選擇。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q133",
    subjectId: "aiot-junior-basics",
    prompt:
      "某港口要為 2,000 個貨櫃追蹤器選擇蜂巢式通訊。追蹤器需以電池運作五年、每小時回報一次位置、可能被運到海外港口。下列技術選擇與理由何者最合理？",
    choices: [
      { id: "A", text: "Wi-Fi，因為各港口的碼頭多半已有無線網路覆蓋" },
      { id: "B", text: "NB-IoT 或 LTE-M，因為低功耗且多數電信商支援漫遊" },
      { id: "C", text: "5G 增強型行動寬頻，因為速度最快且延遲最低，可即時回報" },
      { id: "D", text: "私有 LoRaWAN，因為不需付電信月租費且可在各港自建閘道器" },
    ],
    answer: "B",
    explanation:
      "少量資料、長續航、跨國移動，正是低功耗蜂巢技術的設計目標：NB-IoT 與 LTE-M 支援省電模式與延長不連續接收，且多數電信商已提供國際漫遊，讓貨櫃到海外港口仍能回報。",
    choiceExplanations: {
      A: "貨櫃在海上與各國港口間移動，無法依賴特定港口的 Wi-Fi，覆蓋範圍完全不夠。",
      C: "每小時一筆位置資料不需要即時與高速，增強型行動寬頻模組的功耗與價格反而讓電池撐不了五年。",
      D: "海外港口不歸自家管理，無法在各港自建閘道器，貨櫃在海上與他國港口時就會失聯，跨國漫遊做不到。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["NB-IoT", "LTE-M", "低功耗蜂巢", "漫遊", "資產追蹤"],
      constraints: ["power", "coverage", "mobility"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若追蹤器只在自家港區內移動且可定期充電，私有 LoRaWAN 免月租的優勢就會勝出，蜂巢式的漫遊能力不再是必要條件。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q134",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠內的 AGV 搬運車以 Wi-Fi 連線，經常在特定走道發生短暫斷線。工程師量測發現該區有多台微波爐與舊型無線電話，且 AGV 使用 2.4 GHz 頻段。下列改善何者最直接？",
    choices: [
      { id: "A", text: "把 AGV 的 IP 位址改為固定並加入白名單" },
      { id: "B", text: "把 AGV 的 MQTT 傳輸改為 QoS 2 以確保送達" },
      { id: "C", text: "讓 AGV 改用 5 GHz 或 6 GHz 頻段並調整漫遊參數" },
      { id: "D", text: "縮短 AGV 的資料回報間隔，以更快偵測並補償掉線" },
    ],
    answer: "C",
    explanation:
      "2.4 GHz 頻段與微波爐、舊型無線電話共用，干擾嚴重；5 GHz 與 Wi-Fi 6E/7 開放的 6 GHz 頻段乾淨許多。搭配漫遊參數調整，讓 AGV 在走道間切換基地台時不掉線，是針對根因的實體層與鏈路層處置。",
    choiceExplanations: {
      A: "IP 位址固定與否和無線干擾無關，斷線是實體層的問題。",
      B: "QoS 是應用層訊息協定的保證機制，無線鏈路斷了訊息一樣送不出去，只是會在重連後補送，斷線本身沒有解決。",
      D: "更頻繁回報只是讓斷線更早被發現，干擾源仍在 2.4 GHz 頻段上；多出的流量反而加重碰撞與重傳，沒有消除斷線的原因。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["Wi-Fi 頻段", "干擾", "漫遊", "2.4 GHz"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若斷線集中在 AGV 穿越金屬貨架的死角而非干擾源附近，問題就變成覆蓋不足，處置應改為增設基地台或改用私有 5G。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q135",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 MQTT 與 CoAP 的比較，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "MQTT 建立在 TCP 之上，CoAP 預設使用 UDP" },
      { id: "B", text: "CoAP 的封包負擔比 MQTT 大，因此較不適合受限裝置" },
      { id: "C", text: "MQTT 需要 Broker 轉送，CoAP 可在裝置與伺服器間直接通訊" },
      { id: "D", text: "CoAP 採用類似 HTTP 的請求回應模型，並支援觀察機制" },
    ],
    answer: "B",
    explanation:
      "CoAP 正是為受限裝置與低功耗網路設計，標頭只有 4 位元組、走 UDP，封包負擔比 MQTT 更小。其餘三項都是兩者的正確差異：傳輸層、通訊模型與是否需要 Broker。",
    choiceExplanations: {
      A: "MQTT 依賴 TCP 的可靠連線，CoAP 預設走 UDP 並自行處理重送，敘述正確。",
      C: "MQTT 是發布訂閱、需要 Broker 中介；CoAP 是用戶端伺服器模型，可以直接通訊，敘述正確。",
      D: "CoAP 有 GET、PUT 等方法對應 HTTP，並以 Observe 選項讓伺服器主動推送變化，敘述正確。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["MQTT", "CoAP", "UDP", "請求回應模型"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若場景需要多對多的事件分發與離線佇列，MQTT 的 Broker 模型會比 CoAP 的點對點更合適，封包大小的差距就不再是決定因素。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q136",
    subjectId: "aiot-junior-basics",
    prompt:
      "某倉儲要對數千件貨物做「公分級」的室內定位，用於找出被放錯位置的棧板。下列無線技術何者最符合此精度需求？",
    choices: [
      { id: "A", text: "Wi-Fi 訊號強度三角定位" },
      { id: "B", text: "超寬頻（UWB）" },
      { id: "C", text: "GPS 衛星定位" },
      { id: "D", text: "LoRaWAN 閘道器定位" },
    ],
    answer: "B",
    explanation:
      "超寬頻以極短脈衝量測飛行時間，室內可達 10 至 30 公分的定位精度，是目前公分級室內定位的主流選擇。訊號強度定位受多路徑影響只有公尺級，GPS 在室內幾乎無訊號，LoRaWAN 定位更是數十公尺級。",
    choiceExplanations: {
      A: "訊號強度受牆面、貨架與人體影響劇烈，室內精度通常只有數公尺，找不出相鄰棧板的錯置。",
      C: "衛星訊號穿不透倉庫屋頂，室內定位不可用。",
      D: "LoRaWAN 的定位靠多個閘道器的到達時間差，精度以數十到數百公尺計，適合戶外資產大致追蹤。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["超寬頻", "室內定位", "飛行時間", "定位精度"],
      constraints: ["accuracy", "indoor"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若需求放寬到「知道棧板在哪一個 10 公尺見方的儲區」，藍牙信標或 Wi-Fi 定位的成本更低，超寬頻的錨點建置就不划算。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q137",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 LoRaWAN 農業感測網在增加節點後，部分節點的資料開始遺失。閘道器記錄顯示這些節點使用最高的展頻因子，且集中在同一時段回報。下列判讀何者最合理？",
    choices: [
      { id: "A", text: "高展頻因子讓封包空中時間變長，同時段回報造成碰撞" },
      { id: "B", text: "閘道器的乙太網路頻寬不足以承載這些節點的資料量" },
      { id: "C", text: "節點的電池電壓不足，導致發射功率下降而失敗" },
      { id: "D", text: "伺服器的資料庫寫入速度太慢，來不及處理尖峰" },
    ],
    answer: "A",
    explanation:
      "展頻因子越高，傳輸距離越遠但每筆封包的空中時間也越長（可達一秒以上），多個節點在同一時段發送就容易碰撞，也更快用盡法規的工作週期配額。處置是錯開回報時間、啟用自適應資料速率讓近距離節點降低展頻因子。",
    choiceExplanations: {
      B: "LoRaWAN 每筆封包只有數十位元組，閘道器的乙太網路頻寬綽綽有餘，瓶頸在無線空中介面。",
      C: "電池不足會讓節點完全停止回報，不會呈現「同時段集中遺失」的模式，且題幹指出問題出現在增加節點之後。",
      D: "資料庫寫入瓶頸會影響所有節點，不會只挑高展頻因子且同時段回報的節點；題幹的線索指向無線空中介面的碰撞，而非後端處理。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["LoRaWAN", "展頻因子", "空中時間", "工作週期", "自適應資料速率"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若遺失的節點不分展頻因子且時段隨機，就要轉向檢查閘道器的回傳鏈路或伺服器端，而不是空中介面的碰撞。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q138",
    subjectId: "aiot-junior-basics",
    prompt:
      "某遠洋漁業公司要在船隊上部署冷凍艙溫度與引擎狀態監測，船隻大部分時間離岸數百公里。下列通訊方案何者最能維持回報？",
    choices: [
      { id: "A", text: "每台感測器內建 4G 模組，以最大發射功率直接回報" },
      { id: "B", text: "感測器以 LoRaWAN 最高展頻因子回傳到岸上閘道器" },
      { id: "C", text: "船上以 Wi-Fi 連到最近的港口基地台" },
      { id: "D", text: "船上以區域網路收集，經衛星物聯網定時回傳摘要" },
    ],
    answer: "D",
    explanation:
      "離岸數百公里只有衛星能覆蓋。近年 3GPP 的非地面網路（NTN）與各家低軌衛星物聯網服務讓少量資料回傳變得可行，但頻寬與費用有限，因此船上先以區域網路彙整、只回傳摘要與事件是合理的架構。",
    choiceExplanations: {
      A: "陸地蜂巢式基地台的覆蓋離岸僅數十公里，提高發射功率也無法跨越數百公里，遠洋仍收不到訊號。",
      B: "LoRaWAN 的實用距離通常在數公里到十餘公里，即使把展頻因子調到最高、海面視距良好，也遠不及數百公里，岸上閘道器收不到。",
      C: "Wi-Fi 的距離以百公尺計，離岸後根本連不到港口。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["衛星物聯網", "非地面網路", "覆蓋範圍", "資料彙整"],
      constraints: ["coverage", "bandwidth", "cost"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      crossNode: "A2.1",
      decisionBoundary:
        "若船隻只在近岸作業且每天返港，可改為航行中本地暫存、返港後以 Wi-Fi 或 4G 批次上傳，衛星通道的費用就省下來了。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q139",
    subjectId: "aiot-junior-basics",
    prompt:
      "某系統以 MQTT 傳送機台的「即時運轉狀態」，要求任一訂閱者在機台斷電時能在幾秒內得知。下列設計組合何者最直接？",
    choices: [
      { id: "A", text: "連線時登記遺囑訊息，並設定較短的保活間隔" },
      { id: "B", text: "訂閱者每分鐘輪詢一次機台的狀態主題並比對時間戳" },
      { id: "C", text: "把狀態訊息的 QoS 提高到 2 以確保送達" },
      { id: "D", text: "在 Broker 上啟用訊息持久化與保留訊息" },
    ],
    answer: "A",
    explanation:
      "遺囑訊息由 Broker 在偵測到裝置異常斷線時代為發布；而 Broker 是靠保活間隔判斷斷線，間隔越短、偵測越快。兩者搭配讓訂閱者在幾秒內收到「機台離線」的通知，不需裝置自己有能力在斷電時發送。",
    choiceExplanations: {
      B: "比對時間戳可以推測機台已沉默，但每分鐘輪詢最快也要等到下一次輪詢才發現，達不到幾秒內得知，也違背 MQTT 的推送模型。",
      C: "QoS 2 保證的是訊息不重複、不遺失，機台斷電根本沒有訊息可送，QoS 幫不上忙。",
      D: "持久化讓離線的訂閱者上線後補收訊息，保留訊息讓新訂閱者取得最後一筆值，兩者都不會偵測發布端斷線。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["MQTT", "遺囑訊息", "保活", "斷線偵測"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若機台有不斷電系統且能在斷電前主動發送「正常關機」訊息，遺囑訊息就變成備援，保活間隔可以放長以減少網路流量。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q140",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠要為 5,000 個無電池的貨架標籤建置庫存感測，標籤需靠讀取器的無線能量供電，回報距離約數公尺。下列技術與理由何者正確？",
    choices: [
      { id: "A", text: "被動式 RFID 或無電池藍牙標籤，由讀取器射頻能量驅動" },
      { id: "B", text: "Wi-Fi 標籤，因為廠內已有無線網路覆蓋不必再建" },
      { id: "C", text: "Zigbee 標籤，因為可組成網狀網路互相轉發" },
      { id: "D", text: "NB-IoT 標籤，因為覆蓋範圍最廣且訊號不受廠房金屬遮蔽" },
    ],
    answer: "A",
    explanation:
      "無電池是關鍵限制。被動式 RFID 標籤由讀取器的射頻能量喚醒並回傳，近年的無電池藍牙標籤（Ambient IoT 的一類）也採能量擷取，都能在數公尺內以極低成本大量部署。其餘技術都需要電池或市電。",
    choiceExplanations: {
      B: "Wi-Fi 模組的耗電需要電池或外部電源，無法靠射頻能量驅動，5,000 個標籤的電池維護也不可行。",
      C: "Zigbee 節點需要電池，網狀轉發更會增加耗電，與無電池的前提衝突。",
      D: "NB-IoT 的穿透力雖好，但模組同樣需要電池，且走電信網路需付月租，數公尺的室內貨架不需要廣域覆蓋。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["被動式 RFID", "能量擷取", "Ambient IoT", "無電池標籤"],
      constraints: ["power", "cost", "range"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若標籤需要主動每分鐘回報溫度而不只是被讀取時應答，被動式的能量不足以支撐，就得改用有電池的低功耗藍牙或 Zigbee 標籤。",
    },
  },
  // ── A2.3 工業通訊標準與資訊模型（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q141",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠有 40 台不同品牌的 CNC 工具機，上層系統要統一取得每台的「程式名稱、主軸負載、當前刀具」，且希望欄位名稱與語意在各品牌之間一致。下列做法何者最直接？",
    choices: [
      { id: "A", text: "由操作員每小時手動抄錄後輸入系統，再由系統統一格式" },
      { id: "B", text: "為每台機台各寫一組 Modbus 暫存器對照表，並由中央集中維護" },
      { id: "C", text: "採用工具機的 OPC UA 伴隨規範，各機台依同一資訊模型提供資料" },
      { id: "D", text: "統一改用同一個品牌的工具機，讓欄位名稱與介面自然一致" },
    ],
    answer: "C",
    explanation:
      "OPC UA 只規範通訊與資訊模型的語法，各產業再以伴隨規範（如工具機的 umati）定義共同的物件、變數與語意。各品牌依同一伴隨規範實作後，上層系統讀到的欄位名稱與意義一致，不必為每台機器各寫對照。",
    choiceExplanations: {
      A: "人工抄錄無法即時、也會出錯，不是系統整合的方案。",
      B: "集中維護只是把對照表放在一起；Modbus 只有位址與數值、沒有語意，40 台機器就要維護 40 份對照表，換一台機器就要重來，正是題幹想避免的。",
      D: "汰換全部機台的成本遠超過導入標準資訊模型，且新品牌日後仍會出現，問題只是延後。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["OPC UA", "伴隨規範", "資訊模型", "語意互通"],
      constraints: ["interoperability", "maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若廠內只有兩台同品牌機器且短期不會擴充，直接讀該品牌的原生介面反而最快，伴隨規範的價值要在機台數與品牌數增加時才顯現。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q142",
    subjectId: "aiot-junior-basics",
    prompt:
      "在工業 4.0 的框架中，用來描述一項資產（設備、零件或軟體）的所有資訊、並讓它能在整個生命週期中以標準化方式被讀取的「數位外殼」，稱為下列何者？",
    choices: [
      { id: "A", text: "資產管理殼（AAS）" },
      { id: "B", text: "物料清單（BOM）" },
      { id: "C", text: "裝置影子" },
      { id: "D", text: "製造執行系統（MES）" },
    ],
    answer: "A",
    explanation:
      "資產管理殼（Asset Administration Shell）是工業 4.0 平台定義的標準化數位表示，把資產的識別、技術資料、文件、狀態等組織成子模型，是實現互通數位分身的基礎，可透過 OPC UA、REST 等方式存取。",
    choiceExplanations: {
      B: "物料清單列出產品由哪些零件組成，是設計與生產的資料，不是描述單一資產的數位表示。",
      C: "裝置影子只同步裝置的當前狀態，沒有涵蓋資產在設計、採購、維護等整個生命週期的資訊。",
      D: "製造執行系統是管理生產工單與履歷的軟體系統，不是資產的數位描述。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資產管理殼", "工業 4.0", "數位分身", "生命週期"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若只需要同步設備的即時狀態而不涉及跨廠商交換技術文件與型錄資料，裝置影子或一般的 OPC UA 資訊模型就足夠，資產管理殼的建置成本可暫緩。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q143",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠已用 OPC UA 用戶端／伺服器模式讓 MES 讀取 PLC 資料。現在要把同一批資料再分送給雲端分析、能源管理與品質系統，且各系統在不同網段、數量還會增加。下列調整何者最合理？",
    choices: [
      { id: "A", text: "改以 OPC UA PubSub 經 MQTT 發布，各系統訂閱所需主題" },
      { id: "B", text: "讓每個新系統各自再與 PLC 建立一條 OPC UA 用戶端連線並輪詢" },
      { id: "C", text: "由 MES 每日匯出報表，再轉寄給其他各系統使用" },
      { id: "D", text: "在 PLC 上增加更多輸出點，以硬接線供各系統讀取" },
    ],
    answer: "A",
    explanation:
      "用戶端／伺服器模式每多一個消費者就多一條連線與一份負載，且跨網段與雲端不易。OPC UA 的 PubSub 規範可把同一資訊模型的資料經 MQTT Broker 發布，消費者只需訂閱，PLC 端負載固定，新增系統也不必改動現場。",
    choiceExplanations: {
      B: "每個系統各連 PLC 會讓 PLC 的連線數與負載隨系統數線性成長，跨網段還要逐一開防火牆，擴充性最差。",
      C: "每日匯出的報表是批次、非即時的，也讓 MES 承擔它不該負責的資料分發角色，系統增加時轉寄負擔也跟著增加。",
      D: "實體輸出點與硬接線是給控制迴路用的，用它來分發資料既昂貴又無法承載結構化的資訊模型，跨網段更做不到。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Architecture",
      concepts: ["OPC UA PubSub", "MQTT", "發布訂閱", "一對多分發"],
      constraints: ["scalability", "network"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若消費者只有 MES 一個且需要對 PLC 寫入參數，用戶端／伺服器模式的雙向讀寫仍是正確選擇，PubSub 主要解決的是一對多的唯讀分發。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q144",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 Modbus TCP、PROFINET 與 EtherCAT 三種工業乙太網路協定，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "PROFINET 有不同的即時等級，可同時承載一般 TCP/IP 流量" },
      { id: "B", text: "三者都內建加密與身分驗證，可直接暴露於網際網路" },
      { id: "C", text: "EtherCAT 以主站發出的訊框依序流經各從站處理，適合微秒級的運動控制" },
      { id: "D", text: "Modbus TCP 結構簡單、廠商支援廣，但沒有內建的即時性保證" },
    ],
    answer: "B",
    explanation:
      "傳統工業乙太網路協定為了即時性與簡單，多半沒有加密與身分驗證，必須靠網段隔離與閘道保護，絕不能直接暴露於網際網路；這正是 OT 資安的主要課題。其餘三項對各協定的特性描述正確。",
    choiceExplanations: {
      A: "PROFINET 分為 RT 與 IRT 等即時等級，且與標準 TCP/IP 共存於同一網路，敘述正確。",
      C: "EtherCAT 的「飛行中處理」讓單一訊框通過所有從站，週期可到微秒級，敘述正確。",
      D: "Modbus TCP 只是把暫存器讀寫包在 TCP 裡，簡單普及但沒有時序保證，敘述正確。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["Modbus TCP", "PROFINET", "EtherCAT", "工業乙太網路", "OT 資安"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若改為使用具備安全模式的 OPC UA 並正確設定憑證與簽章，通訊本身就有加密與驗證，但即使如此，把控制網路直接暴露於網際網路仍不是被接受的做法。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q145",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠的 MQTT 系統中，各邊緣程式自行決定主題名稱與酬載欄位，導致平台端要為每支程式維護解析程式，且無法得知裝置是否在線。工程師提議採用一套「定義主題結構、酬載編碼與裝置狀態管理」的 MQTT 應用層規範。下列何者最符合此描述？",
    choices: [
      { id: "A", text: "Modbus" },
      { id: "B", text: "ISA-95" },
      { id: "C", text: "Sparkplug" },
      { id: "D", text: "MTConnect" },
    ],
    answer: "C",
    explanation:
      "Sparkplug 在 MQTT 之上定義了統一的主題命名空間、以 Protobuf 編碼的酬載、以及裝置與邊緣節點的出生／死亡憑證，讓平台能一致解析資料並掌握線上狀態，正是題幹描述的三項需求。",
    choiceExplanations: {
      A: "Modbus 是現場匯流排協定，與 MQTT 的應用層規範無關。",
      B: "ISA-95 是企業與控制系統之間的整合層級模型與資料交換架構，不規範 MQTT 主題。",
      D: "MTConnect 是工具機資料的唯讀資訊模型與 HTTP/XML 介面，不是 MQTT 之上的主題與酬載規範。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Sparkplug", "MQTT 應用層規範", "主題命名空間", "狀態管理"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若廠內所有裝置都原生支援 OPC UA 且平台也以 OPC UA 為主，直接採用 OPC UA PubSub 的資訊模型即可，不必另外引入 MQTT 之上的規範。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q146",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠規劃在同一條乙太網路上同時跑「每 250 微秒一次的伺服控制」與「每秒數 MB 的機台影像上傳」，要求控制訊框的延遲與抖動不受影像流量影響。下列技術最直接對應此需求？",
    choices: [
      { id: "A", text: "在應用層為每則控制訊息加上時間戳，由接收端依時序重排" },
      { id: "B", text: "時效性網路（TSN）的時間感知排程與流量整形" },
      { id: "C", text: "把交換器換成更高速的 10G 埠，讓頻寬遠大於影像流量" },
      { id: "D", text: "把影像改用 QoS 2 的 MQTT 傳送，確保每則只送達一次" },
    ],
    answer: "B",
    explanation:
      "時效性網路是 IEEE 802.1 的一組標準，透過時間同步、時間感知排程與流量整形，在標準乙太網路上為關鍵流量保留固定的傳輸時槽，讓控制訊框不會被大量影像流量排擠，是融合控制與資料流量的標準解法。",
    choiceExplanations: {
      A: "時間戳與重排只能讓接收端知道訊息遲到並調整順序，無法阻止它在交換器排隊而遲到。",
      C: "頻寬再大也只是降低壅塞的機率，沒有任何確定性保證，突發的影像流量仍可能延遲控制訊框。",
      D: "MQTT 的 QoS 只保證訊息送達次數，對交換器層的排隊與抖動沒有任何控制，影像仍會佔用鏈路。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時效性網路", "確定性通訊", "流量整形", "融合網路"],
      constraints: ["latency", "jitter", "bandwidth"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若控制與影像可以物理分成兩條獨立網路，用兩張網卡各走各的是更簡單的做法，時效性網路的價值在於必須共用同一條網路時。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q147",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠的 OPC UA 伺服器對外開放後，上層系統讀到的變數名稱是「ns=2;i=1047」這類節點識別碼，工程師得靠人工文件才知道它代表主軸溫度。下列補強何者最能改善「資料的語意可被機器理解」？",
    choices: [
      { id: "A", text: "把節點識別碼重新編成連續整數，並依設備類別分段保留號碼區間" },
      { id: "B", text: "把所有變數統一改以字串型別傳送，方便用戶端顯示" },
      { id: "C", text: "依資訊模型在位址空間建立物件與變數，附上單位與描述" },
      { id: "D", text: "提高伺服器的取樣頻率，讓用戶端拿到更新的數值" },
    ],
    answer: "C",
    explanation:
      "OPC UA 的價值在於位址空間可以承載資訊模型：把變數掛在有型別的物件之下、附上顯示名稱、描述與工程單位，用戶端就能瀏覽並理解「這是哪一台機器的主軸溫度、單位是攝氏」，不再依賴外部文件。",
    choiceExplanations: {
      A: "識別碼連續或分段只方便人工查表，機器仍不知道每個號碼代表什麼，語意問題沒有解決。",
      B: "把數值改成字串反而失去型別資訊，讓用戶端更難處理，與語意無關。",
      D: "取樣頻率影響資料的時間解析度，與變數的意義是否可被理解無關。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["OPC UA 位址空間", "資訊模型", "語意", "工程單位"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若只有一個固定的用戶端且變數不到十個，靠一份對照表也能運作；資訊模型的投資要在變數數量、品牌數與用戶端數增加時才回收。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q148",
    subjectId: "aiot-junior-basics",
    prompt:
      "依 ISA-95 的階層模型，「依訂單排定各機台的生產順序並追蹤在製品」與「依感測值調整加熱器輸出」兩項功能，分別落在哪兩個層級？",
    choices: [
      { id: "A", text: "第 4 層企業資源規劃與第 1 層感測控制" },
      { id: "B", text: "第 4 層企業資源規劃與第 2 層監控" },
      { id: "C", text: "第 2 層監控與第 0 層製程" },
      { id: "D", text: "第 3 層製造營運管理與第 1 層感測控制" },
    ],
    answer: "D",
    explanation:
      "ISA-95 把工廠分為第 0 層實體製程、第 1 層感測與基本控制、第 2 層監控、第 3 層製造營運管理（MES 所在）與第 4 層企業層。排程與在製品追蹤是 MES 的典型功能，屬第 3 層；依感測值直接調整致動器是基本控制迴路，屬第 1 層。",
    choiceExplanations: {
      A: "後半正確，但排程與在製品追蹤是製造營運管理層的工作，不在企業資源規劃層。",
      B: "企業層處理的是訂單、財務與長期規劃，不做機台級的排程；監控層是操作畫面與資料收集，不直接執行控制迴路。",
      C: "第 0 層是製程本身（物料、能量），不是控制功能；監控層也不負責訂單排程。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["ISA-95", "階層模型", "MES", "基本控制"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若排程只是月度的產能規劃而不落到單一機台的順序，那就屬於企業層的範圍；層級的判斷依據是時間尺度與決策的顆粒度。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q149",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠要蒐集 20 台不同品牌工具機的運轉狀態，其中 12 台原生支援 MTConnect、8 台只有 OPC UA。上層系統只想用一種介面。下列整合策略何者最務實？",
    choices: [
      { id: "A", text: "放棄 8 台只有 OPC UA 的機器，只接原生支援的 12 台" },
      { id: "B", text: "要求供應商把 20 台機器的韌體全部改成同一種通訊介面" },
      { id: "C", text: "上層系統同時實作兩種用戶端，分別對接兩類機器" },
      { id: "D", text: "以轉接器把一種轉成另一種，讓上層只對接單一介面" },
    ],
    answer: "D",
    explanation:
      "MTConnect 與 OPC UA 都是開放標準，兩者之間有公開的對應規範與現成的轉接器。在整合層做一次轉換，上層系統就只需要一種用戶端，日後新機器不論支援哪一種都能接入，是最務實的做法。",
    choiceExplanations: {
      A: "放棄八台機器等於放棄四成的資料，不是整合方案。",
      B: "要求供應商改介面通常做不到，也牽涉韌體與保固，成本與時程都不可控。",
      C: "上層同時維護兩種用戶端可以運作，但每新增一種介面就要再加一套，長期維護成本高於在整合層轉換。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["MTConnect", "OPC UA", "協定轉接", "整合層"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若廠內未來的機器幾乎都會原生支援 OPC UA，把 MTConnect 轉成 OPC UA 是合理方向；反之則轉另一邊，轉換方向應依未來的主流決定。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q150",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠將「所有設備資料統一匯流到單一的階層式主題結構，各系統只向它訂閱或發布」的架構稱為統一命名空間。關於此架構的效益，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "現場 PLC 的控制迴路延遲會因資料集中發布而明顯降低" },
      { id: "B", text: "新系統只需訂閱既有主題，不必與各資料來源個別串接" },
      { id: "C", text: "可以取代歷史資料庫與報表系統，成為唯一的資料儲存處" },
      { id: "D", text: "所有進入的資料都會自動被清洗、去重與補齊單位" },
    ],
    answer: "B",
    explanation:
      "統一命名空間的核心價值是解耦：資料來源只發布一次，任何消費者都從同一個結構化的主題樹訂閱，系統之間不再兩兩串接，新增系統的整合成本大幅下降。它不負責資料品質、控制迴路或長期儲存。",
    choiceExplanations: {
      A: "控制迴路仍在 PLC 內完成，資料集中發布影響的是監控與分析資料的流向，對迴路延遲沒有影響。",
      C: "命名空間傳遞的是即時狀態，不是長期儲存；歷史資料的保存與查詢仍需要資料庫。",
      D: "資料清洗與去重要另外在邊緣或平台端實作，命名空間只是分發結構。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Direct Concept",
      concepts: ["統一命名空間", "發布訂閱", "解耦", "系統整合"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若廠內只有兩個系統且不會再增加，直接點對點串接更簡單；命名空間的效益隨系統數量成長而顯現。",
    },
  },
  // ── A2.4 中介軟體與平台（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q151",
    subjectId: "aiot-junior-basics",
    prompt:
      "某能源公司平台每秒接收十萬筆智慧電表讀值，下游有即時告警、月帳單計算與 AI 負載預測三個系統，各自的處理速度差異很大，且任何一個系統維護時都不得讓資料遺失。下列中介元件何者最適合放在接收與下游之間？",
    choices: [
      { id: "A", text: "檔案伺服器上的共享資料夾，以批次檔案交換資料" },
      { id: "B", text: "關聯式資料庫的資料表，由各下游定時輪詢新增的列" },
      { id: "C", text: "直接以 HTTP 同步呼叫三個系統各自的 API" },
      { id: "D", text: "可持久化、可重播的分散式事件串流平台" },
    ],
    answer: "D",
    explanation:
      "高吞吐、多個速度不同的消費者、消費者離線時資料不得遺失，正是分散式事件串流平台（如 Kafka 類系統）的設計目標：資料持久化在分割區中，各消費者以自己的速度讀取，維護後可從上次位置繼續。",
    choiceExplanations: {
      A: "共享資料夾與批次檔案交換沒有順序、原子性與進度追蹤，延遲也高，多個系統同時讀寫會混亂。",
      B: "關聯式資料庫難以承受每秒十萬筆寫入再加上三個系統反覆輪詢，也沒有讓各消費者獨立追蹤進度與重播的機制。",
      C: "直接呼叫 API 讓接收端與三個系統緊耦合，任何一個系統變慢或停機都會阻塞或遺失資料。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["事件串流", "持久化", "解耦", "高吞吐"],
      constraints: ["throughput", "reliability", "scalability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若每秒只有數十筆且下游只有一個系統，MQTT Broker 加上一個訂閱者就足夠，事件串流平台的維運複雜度反而是負擔。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q152",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台以雲端「函式即服務」處理裝置上傳的事件：每則訊息觸發一次函式執行。上線後發現每天固定的尖峰時段成本暴增，且部分函式因冷啟動延遲超過一秒。下列調整何者最合理？",
    choices: [
      { id: "A", text: "把函式的記憶體配置調到最低以降低每次計費" },
      { id: "B", text: "把所有處理全部改成函式，以節省常駐服務的閒置成本" },
      { id: "C", text: "把高頻穩定的處理改為常駐服務，低頻事件才用函式" },
      { id: "D", text: "要求裝置在尖峰時段暫停上傳，改為離峰時段批次補傳" },
    ],
    answer: "C",
    explanation:
      "函式即服務適合零散、突發的事件；當流量高且穩定時，每則訊息計費與冷啟動的延遲都成為缺點。依負載型態拆分：穩定高頻的路徑用常駐服務或串流處理，低頻的例外事件保留函式，是平台成本與延遲的常見取捨。",
    choiceExplanations: {
      A: "降低記憶體會讓執行更慢、冷啟動更明顯，且每則訊息仍要計費，對尖峰成本幫助有限。",
      B: "問題正是函式在高頻情境下的成本與冷啟動，全部改函式只會放大問題。",
      D: "為了平台成本要求裝置停止上傳是本末倒置，會遺失尖峰時段最重要的資料。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "難",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["函式即服務", "冷啟動", "雲端成本", "常駐服務"],
      constraints: ["cost", "latency"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若流量極不規則、多數時間近乎零，函式按次計費反而最省，常駐服務閒置的成本就不划算。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q153",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台的儀表板查詢「某台設備過去 30 天每小時的平均振動值」要跑 40 秒。資料以每秒一筆存放在時序資料庫中。下列平台端的調整何者最直接？",
    choices: [
      { id: "A", text: "建立連續彙總，事先算好每小時統計值供查詢" },
      { id: "B", text: "把資料改存到物件儲存以降低儲存成本" },
      { id: "C", text: "把查詢改成每分鐘自動重跑一次並快取結果" },
      { id: "D", text: "把儀表板改用另一套渲染更快的前端框架" },
    ],
    answer: "A",
    explanation:
      "每秒一筆、30 天就是 260 萬筆，每次查詢都即時聚合當然慢。時序資料庫普遍支援連續彙總或降採樣，把每小時的平均事先算好存成另一張表，查詢只需讀 720 筆，這是時序資料平台的標準最佳化。",
    choiceExplanations: {
      B: "物件儲存適合冷資料歸檔，查詢聚合的速度比時序資料庫更慢。",
      C: "自動重跑不會讓單次查詢變快，反而讓資料庫持續承受 40 秒的重負載。",
      D: "前端框架不影響資料庫聚合 260 萬筆的時間，瓶頸不在畫面。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["時序資料庫", "連續彙總", "降採樣", "查詢效能"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若查詢的是「過去十分鐘的原始值」，原始表本來就快，連續彙總沒有幫助；它針對的是長區間的聚合查詢。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q154",
    subjectId: "aiot-junior-basics",
    prompt:
      "某公司同時經營自家工廠與客戶託管的設備監控服務，要求「各客戶的資料在同一平台上彼此完全看不到，但平台程式只維護一份」。此需求最貼切的平台設計概念是下列何者？",
    choices: [
      { id: "A", text: "邊緣運算" },
      { id: "B", text: "水平擴展" },
      { id: "C", text: "資料湖" },
      { id: "D", text: "多租戶隔離" },
    ],
    answer: "D",
    explanation:
      "多租戶是讓同一套平台服務多個組織，並在資料、身分與設定層面把各租戶嚴格隔離，同時共用程式與基礎設施，正是「一份程式、彼此看不到」的需求。",
    choiceExplanations: {
      A: "邊緣運算是把處理放到現場，與平台上多客戶隔離的設計無關。",
      B: "水平擴展是靠增加節點承載更多負載，與租戶之間的隔離無關。",
      C: "資料湖是集中存放原始資料的儲存架構，並不提供租戶隔離的語意。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["多租戶", "資料隔離", "平台設計"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若客戶要求資料落在自己專屬的實體環境且不與他人共用任何元件，就會走向為每個客戶各部署一套的單租戶模式，共用程式的優勢要以部署自動化來彌補。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q155",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台的裝置韌體更新流程為：平台發布新版 → 全部 3,000 台裝置同時下載並更新。上次更新有 5% 裝置因新版相容問題離線，必須派人現場復原。下列平台端的改善何者最能降低風險？",
    choices: [
      { id: "A", text: "改為每台裝置各自決定何時更新，並自行回報更新結果" },
      { id: "B", text: "分批推送並監控每批健康度，異常即停止並回滾" },
      { id: "C", text: "把更新檔壓縮得更小，以縮短下載時間並減少中斷機率" },
      { id: "D", text: "更新前先讓所有裝置停機，避免更新過程中被操作使用" },
    ],
    answer: "B",
    explanation:
      "大規模的空中更新必須分批（金絲雀）推送：先更新一小群，觀察連線率、錯誤率等指標，正常再擴大，異常則停止並回滾到上一版。這讓相容問題只影響一小批裝置，而不是 5% 的全體。",
    choiceExplanations: {
      A: "裝置各自決定會讓版本混亂，事後回報也無法集中控制推送節奏，問題出現時難以及時止血。",
      C: "壓縮只改善傳輸時間與中斷機率，與新版相容性無關，下載再順也會更新到有問題的版本。",
      D: "關機無法檢查新版的相容性，且對營運造成中斷。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["空中更新", "分批推送", "回滾", "裝置管理"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若裝置只有二十台且都在同一廠區可立即現場處理，分批推送的流程可簡化為先更新一台測試再全部更新。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q156",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台團隊要讓維運人員在不寫程式的情況下，把「MQTT 訊息 → 條件判斷 → 呼叫 REST API → 通知群組」串接起來，並能視覺化檢視流程。同時，一組資料科學家要把大型語言模型接上平台的工單資料庫做問答。下列工具的分工何者最合理？",
    choices: [
      { id: "A", text: "兩者都直接寫在 PLC 的階梯圖裡，由現場控制工程師統一維護" },
      { id: "B", text: "兩者都用試算表巨集實作，由維運人員統一維護" },
      { id: "C", text: "前者用低程式碼流程編排工具，後者用標準模型工具介接協定" },
      { id: "D", text: "前者由資料科學家手寫程式串接，後者用低程式碼流程編排工具" },
    ],
    answer: "C",
    explanation:
      "低程式碼的流程編排工具（如 Node-RED 類）正是為維運人員視覺化串接訊息、條件與通知而設計；語言模型要存取工單資料庫，則用近年成形的模型與工具之間的標準介接協定（如 MCP），讓模型透過統一介面呼叫查詢功能，而不是各自硬寫整合。",
    choiceExplanations: {
      A: "PLC 階梯圖處理的是現場控制邏輯，不是平台層的訊息流程或語言模型整合。",
      B: "試算表巨集無法訂閱 MQTT、也無法承載模型與資料庫的即時介接，兩者都不適合。",
      D: "分工顛倒：流程串接不需要資料科學家手寫，模型介接也不是流程編排工具的強項。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["低程式碼流程編排", "模型工具介接協定", "平台整合", "語言模型"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Terminology Swap",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若流程需要複雜的狀態管理與高吞吐，低程式碼工具會力不從心，此時改由工程師以程式實作串流處理才是正解。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q157",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 IaaS、PaaS 與 SaaS 在物聯網平台上的差異，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "PaaS 提供受管的資料庫、訊息服務等，使用者專注在應用程式" },
      { id: "B", text: "採用 SaaS 後，資料的存取控制與合規責任完全轉移給服務商" },
      { id: "C", text: "SaaS 是直接可用的應用軟體，使用者只需設定與使用" },
      { id: "D", text: "IaaS 提供虛擬機與網路，作業系統以上都由使用者自行管理" },
    ],
    answer: "B",
    explanation:
      "雲端服務採共同責任模型：即使是 SaaS，服務商負責平台安全，使用者仍要負責帳號權限、資料分類與合規義務。「責任完全轉移」是常見的誤解。其餘三項對三種服務模型的描述正確。",
    choiceExplanations: {
      A: "PaaS 把資料庫、訊息佇列等當成受管服務提供，使用者不必維護伺服器，敘述正確。",
      C: "SaaS 是現成的軟體服務，使用者不接觸底層，敘述正確。",
      D: "IaaS 只提供運算、儲存與網路等基礎資源，作業系統與其上的一切由使用者管理，敘述正確。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["IaaS", "PaaS", "SaaS", "共同責任模型"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若合約中服務商明確承擔特定合規認證的義務（如資料在地化），部分責任確實可以契約轉移，但帳號管理與資料分類仍在使用者手上。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q158",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台的裝置資料經過三個團隊各自維護的服務：邊緣程式、資料管線、分析服務。近期邊緣團隊把「溫度」欄位從整數改為小數並改名，資料管線與分析服務隨即出錯。下列平台治理做法何者最能防止再發？",
    choices: [
      { id: "A", text: "以綱要註冊與版本化的資料契約約束欄位變更" },
      { id: "B", text: "要求邊緣團隊以後不得修改任何既有欄位的名稱與型別" },
      { id: "C", text: "把三個服務合併成單一程式，由同一團隊維護" },
      { id: "D", text: "在資料管線與分析服務裡加上更多例外處理" },
    ],
    answer: "A",
    explanation:
      "多團隊共用資料時，欄位的名稱、型別與語意就是一份契約。以綱要註冊集中管理、變更必須向後相容或明確升版，消費端才能在變更前得知並調整；這是資料管線治理的標準做法。",
    choiceExplanations: {
      B: "禁止變更不切實際，需求會演進；問題不在改，而在改了沒有人知道。",
      C: "合併團隊只是把協調問題藏進單一團隊，規模一大仍會出現同樣的變更失控。",
      D: "例外處理只讓分析服務不當機，資料依然是錯的，且每個消費者都得各自防禦。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料契約", "綱要註冊", "版本化", "資料治理"],
      constraints: ["maintainability", "compatibility"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若整條管線只有一個團隊、一個消費者且變更頻率極低，一份共用的文件加程式碼審查就足夠，綱要註冊的基礎建設可以延後。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q159",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台要對外提供裝置資料給合作夥伴的系統，需求包含：統一的身分驗證、每個夥伴的呼叫次數上限、以及呼叫紀錄。下列中介元件何者最直接對應？",
    choices: [
      { id: "A", text: "負載平衡器" },
      { id: "B", text: "MQTT Broker" },
      { id: "C", text: "時序資料庫" },
      { id: "D", text: "API 閘道" },
    ],
    answer: "D",
    explanation:
      "API 閘道集中處理對外介面的身分驗證、速率限制、配額與稽核紀錄，後端服務不必各自實作這些橫切關注點，是對外開放資料介面的標準前門。",
    choiceExplanations: {
      A: "負載平衡器只分配流量到多個後端，不做身分驗證、配額與紀錄。",
      B: "Broker 負責裝置與平台之間的訊息分發，不是對外的 API 管理元件，也沒有依夥伴計次的機制。",
      C: "時序資料庫負責儲存與查詢，不處理身分驗證與流量控制。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["API 閘道", "速率限制", "身分驗證", "稽核"],
      constraints: ["security", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若對外只有一個內部系統呼叫且無需計費或配額，直接在服務上做簡單驗證即可，閘道的價值在夥伴數與治理需求增加時才顯現。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q160",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台團隊發現：裝置回報「離線」的告警常在數分鐘後自動恢復，且集中在同一區域的閘道器。平台上的 Broker、資料庫與應用皆正常。下列平台端的觀測性做法最能協助判斷是網路還是裝置的問題？",
    choices: [
      { id: "A", text: "把閘道器連線事件、網路品質指標與裝置日誌對齊時間軸" },
      { id: "B", text: "重新啟動平台上的 Broker、資料庫與應用服務以排除暫態" },
      { id: "C", text: "把離線告警的門檻放寬到十分鐘，讓數分鐘的短暫中斷不再觸發" },
      { id: "D", text: "把該區域的閘道器更換為新機，並將裝置改連到鄰近的閘道器" },
    ],
    answer: "A",
    explanation:
      "可觀測性的核心是把指標、日誌與事件放在同一時間軸關聯：若離線事件與該區閘道器的鏈路品質下降同步出現，就是網路問題；若裝置日誌顯示自行重啟，就是裝置問題。沒有關聯檢視只能猜。",
    choiceExplanations: {
      B: "平台服務已確認正常，重啟沒有依據，還會造成全平台的短暫中斷。",
      C: "放寬門檻只是把問題藏起來，真正的間歇性斷線仍在發生。",
      D: "沒有證據指向閘道器硬體本身，貿然更換與改接成本高且可能無效，也無法判斷問題是網路還是裝置。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["可觀測性", "日誌關聯", "指標", "間歇性故障"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.1",
      decisionBoundary:
        "若離線事件不分區域、隨機分布於全部裝置，焦點就應轉回平台端的 Broker 連線數或保活設定，而不是某一區的網路。",
    },
  },
  // ── A2.5 資安與隱私基本概念（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q161",
    subjectId: "aiot-junior-basics",
    prompt:
      "某公司要為 10,000 台新出貨的路燈控制器建立雲端連線身分，要求「每台裝置的私鑰不可被讀出、遭複製也無法冒充」。下列做法何者最符合？",
    choices: [
      { id: "A", text: "把私鑰存在韌體的設定檔中，出廠後由使用者修改" },
      { id: "B", text: "所有裝置共用同一組帳號密碼，由平台限制登入次數" },
      { id: "C", text: "製造時把每台專屬金鑰放進安全元件，憑證與硬體綁定" },
      { id: "D", text: "裝置首次連線時由平台以明文下發專屬私鑰，之後存在快閃記憶體" },
    ],
    answer: "C",
    explanation:
      "安全元件（或 MCU 內建的安全區）把私鑰保存在無法讀出的硬體中，簽章運算在元件內完成；每台裝置有專屬憑證，被入侵的單一裝置無法冒充其他裝置，也無法把金鑰複製到別的硬體，是大規模裝置身分的標準做法。",
    choiceExplanations: {
      A: "設定檔可被讀出與複製，違反私鑰不可讀出的要求；期待使用者修改一萬台路燈更不可行。",
      B: "共用帳號密碼一旦外洩就是全體失守，也無法區分是哪一台裝置在連線，登入次數限制擋不住這個問題。",
      D: "以明文下發私鑰等於在網路上公開它，任何人攔截後都能冒充；存在一般快閃記憶體也可被讀出複製。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["裝置身分", "安全元件", "憑證", "金鑰保護"],
      constraints: ["security", "scale"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若裝置只在封閉的實驗室網路運作、不對外連線，硬體級金鑰保護的必要性下降，但只要裝置會離開受控環境就應維持。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q162",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠的資安政策從「內網即可信」改為「每次存取都要驗證身分與裝置狀態，且只授予該次所需的最小權限」。此原則最貼切的名稱是下列何者？",
    choices: [
      { id: "A", text: "入侵偵測" },
      { id: "B", text: "縱深防禦" },
      { id: "C", text: "零信任" },
      { id: "D", text: "網段隔離" },
    ],
    answer: "C",
    explanation:
      "零信任的核心是不以網路位置決定信任：每一次存取都要驗證身分、裝置健康與情境，並依最小權限授權。它取代了「進了內網就安全」的邊界思維，特別適合裝置與服務散布各處的物聯網環境。",
    choiceExplanations: {
      A: "入侵偵測是監控異常行為的機制，不是存取控制的原則。",
      B: "縱深防禦是層層設防的整體策略，零信任可以是其中一層，但題幹描述的「不再信任內網、逐次驗證」是零信任的定義。",
      D: "網段隔離是把網路切成區域限制橫向移動，仍以位置為信任依據，與逐次驗證的原則不同。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["零信任", "最小權限", "存取控制"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若環境是完全封閉、實體隔離的小型控制網路，邊界防護仍是主要手段；零信任的效益在裝置與使用者跨越多個網路與雲端時最明顯。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q163",
    subjectId: "aiot-junior-basics",
    prompt:
      "某智慧電表廠商準備把產品銷往歐盟。法務提醒 2027 年底起適用的《網路韌性法》。關於該法對此類產品的要求，下列敘述何者正確？",
    choices: [
      { id: "A", text: "產品上市前通過一次符合性評鑑後，製造商便不再有後續義務" },
      { id: "B", text: "製造商須在支援期間提供安全更新，並通報被主動利用的漏洞" },
      { id: "C", text: "該法只規範單獨販售的軟體，含韌體的硬體裝置不在範圍內" },
      { id: "D", text: "使用者簽署免責條款後，製造商即可免除漏洞通報的責任" },
    ],
    answer: "B",
    explanation:
      "《網路韌性法》要求含數位元件的產品在整個支援期間內維持安全：製造商須提供安全更新、對已被主動利用的漏洞在期限內通報，並提供軟體物料清單等資訊。它把安全從「出廠合規」延伸到「生命週期義務」。",
    choiceExplanations: {
      A: "該法除上市前的符合性評鑑，還要求支援期間的持續更新與漏洞處理，一次性評鑑並不足夠。",
      C: "該法涵蓋含數位元件的產品，硬體與其韌體都在範圍內，智慧電表這類連網裝置正是主要對象。",
      D: "漏洞通報與安全更新是法定義務，不因與使用者簽訂的免責條款而消失。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["網路韌性法", "安全更新", "漏洞通報", "產品生命週期"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若產品只在歐盟以外市場銷售，該法不直接適用，但同類的生命週期安全要求已陸續出現在其他市場的法規與採購規範中。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q164",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫院要把病房感測資料用於院外的 AI 研究合作，法遵要求「即使研究者拿到資料，也無法推回任何特定病患」。下列處理何者最符合？",
    choices: [
      { id: "A", text: "把病歷號用固定的雜湊值取代，其餘欄位不變" },
      { id: "B", text: "只移除姓名與身分證字號欄位，其餘照原樣提供" },
      { id: "C", text: "把整份資料加密後，連同解密金鑰交給研究者" },
      { id: "D", text: "移除直接識別欄位，並將準識別欄位泛化到多人共用" },
    ],
    answer: "D",
    explanation:
      "去識別化不只是拿掉姓名：出生日期、郵遞區號、入院日期等準識別欄位的組合仍可唯一指向某人。對這些欄位泛化（如年齡改為區間）並確保每組組合至少對應 k 位病患，才能達到「無法推回特定個人」的要求。",
    choiceExplanations: {
      A: "固定的雜湊只是假名化：同一病患的紀錄仍可被串連，且病歷號空間小、可被暴力反推。",
      B: "只拿掉姓名，剩下的出生日期與住址組合仍幾乎能唯一識別一個人，這是最常見的去識別化失敗。",
      C: "把金鑰一併交出等於沒有加密，研究者仍拿到完整的原始資料。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["去識別化", "準識別欄位", "k-匿名", "假名化"],
      constraints: ["privacy", "regulation"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若研究者只需要統計結果而不需要逐筆資料，改為只提供加入雜訊的聚合查詢結果（差分隱私）會更安全，也免去逐筆去識別化的工作。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q165",
    subjectId: "aiot-junior-basics",
    prompt:
      "某公司的產品用了數十個開源函式庫。某天一個廣泛使用的函式庫爆出重大漏洞，客戶要求在 24 小時內回覆「貴公司哪些產品版本受影響」。下列準備何者最能讓公司做到？",
    choices: [
      { id: "A", text: "每個韌體版本都產生並保存軟體物料清單" },
      { id: "B", text: "所有韌體都以最高強度加密後才發布" },
      { id: "C", text: "每年委外做一次完整的滲透測試並保存測試報告" },
      { id: "D", text: "在每台裝置上安裝防毒與入侵偵測軟體並集中回報" },
    ],
    answer: "A",
    explanation:
      "軟體物料清單（SBOM）列出每個版本使用的元件與版本號，漏洞公布時只要比對清單就能在數小時內回答哪些產品受影響。近年的法規與大型客戶採購也已把它列為要求。",
    choiceExplanations: {
      B: "加密保護的是韌體不被讀出，與「知道自己用了哪些元件」無關，漏洞仍在裡面。",
      C: "年度滲透測試找的是當時已知的弱點，無法回答新爆出漏洞的影響範圍。",
      D: "嵌入式裝置通常無法安裝防毒軟體，且防毒與入侵偵測的回報只告訴你有無攻擊，不會告訴你產品用了哪些元件。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["軟體物料清單", "供應鏈安全", "漏洞管理"],
      constraints: ["time", "traceability"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Correct in Different Context",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若產品完全自行開發、不含任何第三方元件，物料清單的價值大減，但這在現代韌體中幾乎不存在。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q166",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠依 IEC 62443 的概念，把控制網路劃分為多個區域，區域之間只能透過受控的通道溝通。下列哪一種配置最符合此精神？",
    choices: [
      { id: "A", text: "每台 PLC 配置公網 IP，並以強密碼保護供原廠遠端維護" },
      { id: "B", text: "PLC 與 HMI 同區、MES 另一區，兩區間只開放特定 OPC UA 連線" },
      { id: "C", text: "所有 OT 與 IT 設備放在同一個扁平網段，以簡化管理與除錯" },
      { id: "D", text: "只在辦公網路的網際網路出口設置一台次世代防火牆並開啟深度檢測" },
    ],
    answer: "B",
    explanation:
      "區域與通道模型把功能相近、安全等級相同的資產放在同一區，區域之間的往來只經過明確定義的通道，並限制協定、埠與方向。控制層與營運管理層分區、僅開放必要的 OPC UA 連線，正是此模型的典型落地。",
    choiceExplanations: {
      A: "即使有強密碼，把 PLC 直接暴露於公網仍是最危險的配置，與分區隔離完全相反。",
      C: "扁平網段讓任何一台被入侵的裝置都能直接觸及所有設備，正是分區想避免的情況。",
      D: "防火牆再先進，只有一道邊界等於內部沒有任何分區，攻擊者進入後仍可橫向移動到控制網路。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["IEC 62443", "區域與通道", "網段隔離", "OT 資安"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "A2.3",
      decisionBoundary:
        "若廠內只有一條產線、五台設備且沒有任何對外連線，一個區域加一道邊界就已足夠；分區的細緻度應與資產數量和連線需求相稱。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q167",
    subjectId: "aiot-junior-basics",
    prompt:
      "某智慧音箱廠商宣稱「語音喚醒詞的判斷在裝置上完成，只有喚醒後的語音才上傳」。從隱私設計的角度，此做法主要體現下列何項原則？",
    choices: [
      { id: "A", text: "資料最小化" },
      { id: "B", text: "不可否認性" },
      { id: "C", text: "可用性保證" },
      { id: "D", text: "完整性保護" },
    ],
    answer: "A",
    explanation:
      "資料最小化是只蒐集與處理達成目的所需的最少資料。把喚醒判斷留在裝置上，日常談話不會離開家中，上傳的只有使用者明確喚醒後的指令，正是在源頭減少蒐集範圍。",
    choiceExplanations: {
      B: "不可否認性是讓行為者無法否認曾做過某事，屬於稽核與簽章的範疇。",
      C: "可用性是確保服務能持續運作，與隱私設計的蒐集範圍無關。",
      D: "完整性是防止資料被竄改，與減少蒐集範圍無關。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["資料最小化", "隱私設計", "端側處理"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若喚醒後的完整語音也在裝置上辨識、只上傳結構化的指令文字，最小化的程度會再提高，但裝置的運算成本也隨之上升。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q168",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠有 2,000 台裝置用憑證連線平台，憑證有效期兩年。資安顧問建議把有效期縮短到 90 天並自動換發。下列對此建議的評估何者最正確？",
    choices: [
      { id: "A", text: "縮短有效期會讓憑證使用的加密演算法強度變高" },
      { id: "B", text: "縮短有效期沒有實質安全效益，只會增加換發與部署的維運工作" },
      { id: "C", text: "縮短有效期後，撤銷機制與撤銷清單就不再需要" },
      { id: "D", text: "縮短有效期能縮小金鑰外洩後的利用窗口，但須自動換發" },
    ],
    answer: "D",
    explanation:
      "憑證有效期越短，一旦私鑰外洩，攻擊者可利用的時間窗就越小，也讓憑證輪替成為常態而非災難。但 2,000 台裝置每 90 天換發一次，沒有自動化就會變成停機事故；自動換發是縮短有效期的前提。",
    choiceExplanations: {
      A: "加密強度由演算法與金鑰長度決定，與有效期長短無關。",
      B: "縮短外洩後的可利用時間是真實的安全效益，這個評估忽略了它。",
      C: "有效期內若發現外洩仍需立即撤銷，短效期只是縮小損害窗口，不能取代撤銷。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["憑證生命週期", "自動換發", "撤銷", "金鑰輪替"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若裝置多數時間離線、每年只上線幾次，90 天的有效期會讓它們上線時憑證已過期，此時應延長有效期並改以撤銷清單與上線時的健康檢查補強。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q169",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠的攝影機 AI 檢測系統近期被發現：攻擊者只要在產品上貼一小片特定圖樣，就能讓模型把瑕疵品判成良品。此類攻擊最貼切的分類是下列何者？",
    choices: [
      { id: "A", text: "中間人攻擊" },
      { id: "B", text: "阻斷服務攻擊" },
      { id: "C", text: "對抗樣本攻擊" },
      { id: "D", text: "密碼暴力破解" },
    ],
    answer: "C",
    explanation:
      "對抗樣本是刻意設計的輸入擾動（實體世界中可以是貼紙或圖樣），讓模型產生錯誤判斷而人眼不覺有異。這是 AI 系統特有的攻擊面，傳統的網路與帳號防護擋不住，需靠對抗訓練、輸入檢查與人工抽驗。",
    choiceExplanations: {
      A: "中間人攻擊是攔截或竄改通訊，本題沒有涉及任何通訊鏈路。",
      B: "阻斷服務是讓系統無法提供服務，本題的系統照常運作，只是判斷被誤導。",
      D: "暴力破解針對的是帳號密碼，與影像模型的判斷無關。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["對抗樣本", "AI 安全", "模型攻擊面"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若攻擊者是在訓練階段混入錯誤標註的影像讓模型學壞，那是資料投毒而非對抗樣本，防禦重點會轉向訓練資料的來源與驗證。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q170",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠導入以大型語言模型為核心的維運助理，它可讀取工單、設備手冊與外部供應商的技術公告，並能對設備下達重啟指令。資安團隊擔心「供應商公告中若被植入惡意文字，可能誘使助理執行不當指令」。下列防護何者最直接？",
    choices: [
      { id: "A", text: "在助理的每則回答前加上「僅供參考」警語並記錄對話" },
      { id: "B", text: "禁止助理讀取任何外部文件，只允許回答工單內的問題" },
      { id: "C", text: "把模型換成參數量更大、推理能力更強且經安全對齊的版本" },
      { id: "D", text: "外部文件視為不可信輸入，重啟等高風險動作須經人工確認" },
    ],
    answer: "D",
    explanation:
      "這是提示注入的風險：模型無法可靠區分「資料」與「指令」，外部文件中的文字可能被當成命令。防禦要在系統層做：外部內容以不可信輸入處理、工具呼叫套用最小權限、重啟等高風險動作強制人工確認，而不是寄望模型自己分辨。",
    choiceExplanations: {
      A: "警語與對話紀錄都不會阻止指令被執行，事後查到時設備已經被重啟了。",
      B: "讀取文件正是助理的價值所在，全面禁止等於放棄功能；風險應由權限與確認機制控制。",
      C: "更大或經過安全對齊的模型仍會受提示注入影響，模型本身不是可靠的防線，必須在系統層管控工具呼叫。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["提示注入", "AI 代理安全", "最小權限", "人在迴圈"],
      constraints: ["security", "safety"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Overgeneralization",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若助理只能回答問題、沒有任何可執行的工具，提示注入的後果就只剩錯誤回答，防護重點會轉為輸出審核而非動作授權。",
    },
  },
  // ── A3.1 感測技術基礎（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q171",
    subjectId: "aiot-junior-basics",
    prompt:
      "某半導體廠的爐管溫度需在 800 至 1,100 度之間量測，並要求長期穩定、可承受高溫。工程師比較熱電偶、白金電阻式溫度計與熱敏電阻。下列選型判斷何者最正確？",
    choices: [
      { id: "A", text: "白金電阻式溫度計，因為線性度最佳且準確度最高" },
      { id: "B", text: "熱敏電阻，因為靈敏度最高、能察覺微小溫度變化" },
      { id: "C", text: "熱電偶，因為量測範圍涵蓋高溫且結構耐用" },
      { id: "D", text: "三者皆可，只要加裝耐熱的保護套管就能承受爐溫" },
    ],
    answer: "C",
    explanation:
      "熱敏電阻通常只到 150 度左右，白金電阻式在 600 度以上準確度與壽命都明顯下降，而熱電偶（如 K 型、S 型）可量到千度以上且結構簡單耐用，是高溫爐管的標準選擇；它的線性度較差可由查表或補償解決。",
    choiceExplanations: {
      A: "白金電阻式的線性度與準確度在中低溫區確實最佳，但 1,100 度接近或超過其可靠上限，長期穩定性不足。",
      B: "熱敏電阻靈敏度高但量測上限低、在高溫下會失效，1,100 度完全超出其適用範圍。",
      D: "保護套管只保護元件不受機械與化學損傷，無法提高元件本身的溫度上限；熱敏電阻與白金電阻在千度下仍會失效或漂移。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["熱電偶", "電阻式溫度計", "熱敏電阻", "量測範圍"],
      constraints: ["range", "durability"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若量測範圍改為 0 至 200 度且要求 0.1 度的準確度，白金電阻式溫度計的線性與穩定性就會勝出，熱電偶的優勢不再。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q172",
    subjectId: "aiot-junior-basics",
    prompt:
      "某倉儲要偵測貨架走道是否有人，用於自動照明。需求是：無人時關燈、有人靜止站立揀貨時不得誤關、不可安裝攝影機。下列感測器選擇何者最合適？",
    choices: [
      { id: "A", text: "毫米波雷達存在感測器" },
      { id: "B", text: "溫濕度感測器" },
      { id: "C", text: "光遮斷器" },
      { id: "D", text: "被動式紅外線人體感測器" },
    ],
    answer: "A",
    explanation:
      "被動式紅外線靠溫度變化偵測移動，人一靜止就偵測不到，正是「靜止站立時誤關燈」的成因。毫米波雷達能感測呼吸與微小動作，靜止的人仍可被判定為存在，且不成像，符合不可裝攝影機的限制。",
    choiceExplanations: {
      B: "溫濕度的變化太慢且與人的存在關聯薄弱，無法作為存在偵測。",
      C: "光遮斷器只能偵測有物體穿越一條光束的瞬間，無法知道人是否還在走道內。",
      D: "被動式紅外線只對移動中的熱源反應，人靜止揀貨時會被判為無人，正是題幹要避免的誤關。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["毫米波雷達", "被動式紅外線", "存在偵測", "感測原理"],
      constraints: ["privacy", "accuracy"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若走道只需偵測「有人經過」來觸發短暫照明、不在乎靜止時的持續判斷，被動式紅外線成本低、耗電少，反而是更合理的選擇。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q173",
    subjectId: "aiot-junior-basics",
    prompt:
      "某氣體感測器規格書標示「準確度 ±2% FS，解析度 1 ppm，量程 0 至 1,000 ppm」。工程師讀到 500 ppm 時，下列解讀何者正確？",
    choices: [
      { id: "A", text: "真值可能落在 499 至 501 ppm 之間" },
      { id: "B", text: "真值可能落在 490 至 510 ppm 之間" },
      { id: "C", text: "真值可能落在 480 至 520 ppm 之間" },
      { id: "D", text: "讀值的誤差恆為 1 ppm" },
    ],
    answer: "C",
    explanation:
      "「±2% FS」的 FS 指滿刻度，誤差是量程的 2%，即 ±20 ppm，與當前讀值無關；因此 500 ppm 的真值可能落在 480 至 520 ppm。解析度 1 ppm 只說明顯示能分辨的最小變化，不代表準確度。",
    choiceExplanations: {
      A: "把解析度當成準確度是常見誤解，能顯示到 1 ppm 不表示誤差只有 1 ppm。",
      B: "±10 ppm 是把 2% 誤當成讀值的 2%（500 的 2%），而規格明確寫的是滿刻度的百分比。",
      D: "1 ppm 是解析度，不是誤差；準確度規格是 ±20 ppm。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["準確度", "滿刻度", "解析度", "規格判讀"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若規格改寫為「±2% of reading」，誤差才會隨讀值變化，500 ppm 時為 ±10 ppm；讀規格時要先確認百分比的基準是滿刻度還是讀值。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q174",
    subjectId: "aiot-junior-basics",
    prompt:
      "某戶外空氣品質站的 PM2.5 感測器在使用一年後，讀值與標準站相比逐漸偏高，且偏差量隨時間增加，但短期內重複量測仍很一致。此現象最貼切的描述與處置是下列何者？",
    choices: [
      { id: "A", text: "感測器遲滯過大，應固定由同一方向趨近量測點" },
      { id: "B", text: "感測器發生漂移，應定期以標準源重新校正或建立補償" },
      { id: "C", text: "感測器解析度不足，應更換為更高位元的 ADC" },
      { id: "D", text: "感測器的雜訊變大，應加強濾波並增加取樣平均次數" },
    ],
    answer: "B",
    explanation:
      "重複量測一致代表精密度沒問題，但系統性偏差隨時間增長，這是感測元件老化或污染造成的漂移。處置是定期對照標準源校正，或依歷史偏差建立時間相關的補償模型，並在偏差超過容許值時更換。",
    choiceExplanations: {
      A: "遲滯是升降方向讀值不同的現象，固定趨近方向也無法消除隨時間累積的單向偏差。",
      C: "解析度不足是無法分辨小變化，不會造成逐漸增大的偏差。",
      D: "雜訊會讓重複量測的離散度變大，題幹說短期一致性良好，濾波與平均也消除不了逐漸增大的系統性偏差。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["漂移", "校正", "精密度與準確度", "感測器老化"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若偏差不隨時間變化而是固定的常數，那是偏移誤差，一次性的零點校正就能解決，不需要定期或時間相關的補償。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q175",
    subjectId: "aiot-junior-basics",
    prompt:
      "某自動搬運車要在室內量測前方 0.2 至 8 公尺的障礙物距離，需在強光與透明玻璃隔板環境下可靠運作。下列感測技術的取捨何者最正確？",
    choices: [
      { id: "A", text: "超音波與飛時測距互補，各自補上對方的盲點" },
      { id: "B", text: "只用飛時測距，因為精度最高且反應最快" },
      { id: "C", text: "只用超音波，因為成本最低且不受光線影響" },
      { id: "D", text: "只用單目攝影機，因為可以同時辨識障礙物種類" },
    ],
    answer: "A",
    explanation:
      "光學飛時測距對透明玻璃幾乎無反射，且強光會抬高背景雜訊；超音波對玻璃有良好回波、不受光線影響，但角度解析差、易受風與吸音材干擾。兩者在失效條件上互補，安全相關的避障通常採融合設計。",
    choiceExplanations: {
      B: "飛時測距在玻璃隔板前會量不到障礙，車輛可能直接撞上，精度高不等於可靠。",
      C: "超音波無法分辨障礙物的方位與細節，單獨使用會漏掉狹窄或吸音的物體。",
      D: "單目攝影機本身無法直接量測距離，且強光下影像會過曝，不適合作為主要的避障感測。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["超音波感測", "飛時測距", "感測融合", "失效模式"],
      constraints: ["safety", "environment"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "A1.2",
      decisionBoundary:
        "若環境沒有玻璃且光線受控，單一的飛時測距就足以提供高精度距離，融合的成本可以省下。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q176",
    subjectId: "aiot-junior-basics",
    prompt:
      "某穿戴裝置要估算使用者的步數與姿態，並在跌倒時判斷「是自由落下後撞擊」還是「快速坐下」。下列感測器組合最能支援此判斷？",
    choices: [
      { id: "A", text: "單一的高精度氣壓計偵測高度驟降" },
      { id: "B", text: "GPS 接收器搭配電子羅盤" },
      { id: "C", text: "溫度感測器與心率感測器" },
      { id: "D", text: "三軸加速度計搭配三軸陀螺儀" },
    ],
    answer: "D",
    explanation:
      "加速度計能捕捉自由落下時的近零重力與撞擊時的尖峰，陀螺儀提供角速度以判斷身體是否翻轉；兩者組成的慣性量測單元讓演算法能區分跌倒與快速坐下這類相似的加速度事件。",
    choiceExplanations: {
      A: "跌倒與快速坐下都有高度下降，氣壓計再精確也只能估高度變化，分不出撞擊與身體翻轉的動態。",
      B: "GPS 室內無訊號、更新率低且精度以公尺計，電子羅盤只給方位，兩者都無法感知身體的瞬間動作。",
      C: "溫度與心率反映的是生理狀態，變化緩慢，跌倒發生的瞬間不會有可辨識的訊號。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["加速度計", "陀螺儀", "慣性量測單元", "跌倒偵測"],
      constraints: ["accuracy", "power"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Layer Confusion",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若只需要計步而不必分辨跌倒型態，單一的三軸加速度計就足夠，省下陀螺儀可明顯延長電池續航。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q177",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於感測器的「靈敏度」，下列敘述何者正確？",
    choices: [
      { id: "A", text: "感測器能量測的最大值與最小值之差" },
      { id: "B", text: "輸入量每變化一個單位時，輸出訊號變化的大小" },
      { id: "C", text: "重複量測同一輸入時讀值的離散程度" },
      { id: "D", text: "感測器從輸入變化到輸出穩定所需的時間" },
    ],
    answer: "B",
    explanation:
      "靈敏度是輸出對輸入的變化率，例如某壓力感測器每 1 kPa 輸出變化 10 mV，靈敏度即 10 mV/kPa。它決定了訊號需要多少放大，與量程、精密度、響應時間是不同的規格。",
    choiceExplanations: {
      A: "最大值與最小值之差是量程（span），描述的是可量測的範圍。",
      C: "重複量測的離散程度是精密度（或重複性），描述的是穩定度。",
      D: "從輸入變化到輸出穩定的時間是響應時間，描述的是動態特性。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["靈敏度", "量程", "精密度", "響應時間"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Terminology Swap",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若題目改問「每單位輸出對應多少輸入」，那是靈敏度的倒數（刻度係數），讀規格時要注意分子分母的方向。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q178",
    subjectId: "aiot-junior-basics",
    prompt:
      "某牧場要在 2,000 公頃草原上長期監測土壤濕度與牲畜位置，節點無法更換電池。下列哪一種感測節點的供電設計最能配合「數年免維護」的需求？",
    choices: [
      { id: "A", text: "大容量一次性鋰電池，並持續以最高頻率量測回報" },
      { id: "B", text: "由讀取器的射頻能量供電，節點本身不帶電池而可免維護" },
      { id: "C", text: "每個節點各拉一條市電線路，並加裝不斷電系統" },
      { id: "D", text: "小型太陽能板搭配儲能元件，並讓節點大部分時間休眠" },
    ],
    answer: "D",
    explanation:
      "戶外草原有充足日照，能量擷取加上低漏電的儲能與深度休眠的工作週期，可以讓節點的能量收支長期平衡，達到數年免維護；量測頻率則依需求設在能量預算允許的範圍。",
    choiceExplanations: {
      A: "再大的一次性電池在持續高頻量測下也會在一兩年內耗盡，且無法更換，與免維護衝突。",
      B: "射頻能量供電的距離只有數公尺，2,000 公頃的草原不可能布滿讀取器。",
      C: "廣大草原拉市電的成本與可行性都不切實際。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["能量擷取", "太陽能", "工作週期", "免維護節點"],
      constraints: ["power", "maintenance", "range"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若節點裝在牲畜身上而非固定位置，太陽能板的面積與朝向都受限，此時改用可在牧場入口批次充電或更換的方案會更實際。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q179",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠用電化學式氣體感測器監測氨氣。工程師發現：感測器在高濕環境下讀值偏高，且對另一種同時存在的氣體也有反應。關於此感測原理的限制，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "此原理有交叉敏感性且受濕度影響，需以補償或多感測器辨識" },
      { id: "B", text: "電化學式感測器不受任何環境因素影響，讀值偏高必是故障" },
      { id: "C", text: "只要提高取樣頻率並做移動平均，就能消除交叉敏感性" },
      { id: "D", text: "電化學式感測器壽命極長，安裝後不需定期更換或校正" },
    ],
    answer: "A",
    explanation:
      "電化學式感測器依電極上的氧化還原反應產生電流，對化學性質相近的氣體會有交叉反應，且電解液受溫濕度影響。實務上要做溫濕度補償、以多種感測器組成陣列辨識，並定期以標準氣校正與更換耗損的元件。",
    choiceExplanations: {
      B: "電化學元件明顯受溫濕度影響，高濕偏高是已知特性而非故障。",
      C: "取樣頻率與移動平均只影響時間解析度與隨機雜訊，對感測器本身對其他氣體的系統性反應毫無作用。",
      D: "電化學元件的電解液會消耗，壽命通常一到三年，必須定期校正與更換。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["電化學式氣體感測器", "交叉敏感性", "濕度補償", "感測器壽命"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若氨氣濃度需在乾燥且單一氣體的密閉環境中量測，交叉敏感與濕度的問題自然消失，單一電化學感測器就已足夠。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q180",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫院要在藥品冷藏庫內裝設溫度感測，並要求量測結果可追溯到國家標準以符合稽核。下列做法何者最直接滿足此要求？",
    choices: [
      { id: "A", text: "採購價格最高、規格最完整的感測器" },
      { id: "B", text: "感測器定期送具認證的實驗室校正並保存校正報告" },
      { id: "C", text: "以兩顆同型感測器互相比對並取平均值，差異過大才送修" },
      { id: "D", text: "把感測器的取樣頻率提高到每秒一次並保存原始紀錄" },
    ],
    answer: "B",
    explanation:
      "可追溯性指量測結果能透過一連串有文件記錄的校正，連結到國家或國際標準。定期送經認證的校正實驗室、取得載明不確定度的校正報告，正是建立追溯鏈的方式，也是稽核時的證據。",
    choiceExplanations: {
      A: "價格與追溯性無關，昂貴的感測器沒有校正紀錄一樣不符合稽核要求。",
      C: "兩顆未經校正的感測器互比只能發現彼此不一致，即使差異小也可能同向偏差，無法證明任何一顆連結到標準。",
      D: "取樣頻率與原始紀錄只證明有量測過，無法證明讀值能透過校正鏈連結到國家標準。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Direct Concept",
      concepts: ["可追溯性", "校正", "不確定度", "稽核"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若應用只是辦公室舒適度監測、沒有法規稽核要求，出廠校正即可，定期送校的成本就不必投入。",
    },
  },
  // ── A3.2 感測訊號與通訊基礎（10 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q181",
    subjectId: "aiot-junior-basics",
    prompt:
      "某化工廠要把一顆壓力變送器接到 150 公尺外的控制器，現場有變頻器等強電磁干擾源。變送器提供「0 至 10 V」與「4 至 20 mA」兩種輸出。下列選擇與理由何者最正確？",
    choices: [
      { id: "A", text: "4 至 20 mA，因迴路電流不受線阻影響且可偵測斷線" },
      { id: "B", text: "0 至 10 V，因為電壓訊號的抗干擾能力較強，長線上也較穩定" },
      { id: "C", text: "兩者相同，長距離下都會衰減，需每隔一段加裝中繼放大器" },
      { id: "D", text: "0 至 10 V，因為電壓訊號較直觀、接線簡單且便於並接" },
    ],
    answer: "A",
    explanation:
      "電流迴路中的電流在迴路各處相同，長線的電阻壓降不影響讀值，且高阻抗的干擾難以改變迴路電流；4 mA 的活零點更能區分「量測值為零」與「線路斷開」。這是工業長距離類比傳輸採用 4 至 20 mA 的核心理由。",
    choiceExplanations: {
      B: "理由正好相反：電壓訊號在長線上會受線阻壓降影響，抗干擾能力也比電流迴路差。",
      C: "電流迴路不會因線長而衰減，兩者在長距離下的表現差異很大。",
      D: "電壓訊號在 150 公尺的線阻上會有壓降，且高阻抗輸入容易耦合干擾；直觀與便於並接都不是此情境的選型依據。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["4-20 mA 電流迴路", "電壓訊號", "抗干擾", "斷線偵測"],
      constraints: ["distance", "noise"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若感測器與控制器在同一塊電路板上、距離只有幾公分且無強干擾，電壓輸出接 ADC 最簡單，電流迴路的取樣電阻與供電反而是多餘的。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q182",
    subjectId: "aiot-junior-basics",
    prompt:
      "某軸承振動監測需分析到 10 kHz 的頻率成分。工程師以 20 kHz 取樣，但頻譜上仍出現不該存在的低頻成分。下列改善何者最直接？",
    choices: [
      { id: "A", text: "把 ADC 換成位元數更高的型號提升解析度" },
      { id: "B", text: "把取樣率降到 10 kHz，減少資料量與運算負擔" },
      { id: "C", text: "在取樣之後於數位端加上低通濾波去除低頻成分" },
      { id: "D", text: "在 ADC 前加類比抗混疊濾波器，並提高取樣率留裕度" },
    ],
    answer: "D",
    explanation:
      "取樣定理要求取樣率高於最高頻率的兩倍，但實際訊號中高於 10 kHz 的成分（機械雜訊、電氣干擾）若未在取樣前濾除，會折疊成假的低頻成分。抗混疊濾波必須在類比端、ADC 之前完成，並保留取樣率裕度讓濾波器有過渡帶。",
    choiceExplanations: {
      A: "位元數影響振幅解析度，與頻率折疊無關。",
      B: "降到 10 kHz 連 5 kHz 以上的成分都無法正確取樣，混疊會更嚴重。",
      C: "混疊發生在取樣的瞬間，資料一旦折疊成假訊號，數位濾波已無法分辨真假。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["取樣定理", "混疊", "抗混疊濾波", "取樣率"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若感測器本身的頻寬已遠低於 10 kHz（例如機械結構天然衰減高頻），它本身就是抗混疊濾波器，額外的類比濾波器可以省略。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q183",
    subjectId: "aiot-junior-basics",
    prompt:
      "以 16 位元 ADC、參考電壓 2.5 V 量測一顆輸出 0 至 2.5 V 的感測器，其理論上可分辨的最小電壓變化最接近下列何者？",
    choices: [
      { id: "A", text: "約 38 微伏" },
      { id: "B", text: "約 156 微伏" },
      { id: "C", text: "約 2.4 毫伏" },
      { id: "D", text: "約 610 微伏" },
    ],
    answer: "A",
    explanation:
      "解析度等於參考電壓除以 2 的位元數次方：2.5 V ÷ 65,536 ≈ 38 μV。實際可用的解析度還會受雜訊與 ADC 的有效位元數限制，但理論值即為此。",
    choiceExplanations: {
      B: "156 μV 是 14 位元（16,384 階）的結果。",
      C: "2.4 mV 是 10 位元（1,024 階）的結果。",
      D: "610 μV 是 12 位元（4,096 階）的結果，位元數算錯了。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["ADC 解析度", "參考電壓", "位元數"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若感測器輸出只有 0 至 0.25 V 而參考電壓仍為 2.5 V，實際只用到十分之一的量程，有效解析度會少約 3 位元，此時應加放大器或降低參考電壓。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q184",
    subjectId: "aiot-junior-basics",
    prompt:
      "某電路板上要連接一顆高速影像感測器（每秒數十 MB）與一顆低速溫濕度感測器，MCU 的腳位有限。下列介面分配何者最合理？",
    choices: [
      { id: "A", text: "影像感測器用 I²C，溫濕度感測器用 SPI" },
      { id: "B", text: "影像感測器用 SPI 或平行介面，溫濕度用 I²C" },
      { id: "C", text: "兩者都掛在同一條 I²C 匯流排上以節省腳位" },
      { id: "D", text: "兩者都用 UART，以非同步串列分別傳輸" },
    ],
    answer: "B",
    explanation:
      "I²C 只用兩條線、可多裝置共享，但速率通常在數百 kbps 到數 Mbps，適合低速的溫濕度感測器；影像資料量大，需要 SPI（可達數十 Mbps）或專用的平行／串列影像介面。依速率需求分配介面才能同時省腳位又不成為瓶頸。",
    choiceExplanations: {
      A: "分配顛倒：高速的影像放在慢介面上會卡住，低速感測器用 SPI 則浪費腳位。",
      C: "I²C 的速率遠不足以承載每秒數十 MB 的影像，會嚴重掉幀。",
      D: "UART 是點對點、無時脈的低速介面，兩者都不適合，影像更是完全無法承載。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["I²C", "SPI", "介面速率", "腳位分配"],
      constraints: ["bandwidth", "pins"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若影像感測器只輸出每秒數幀的低解析縮圖，資料量降到數百 kB，I²C 或 UART 也可能足夠，介面選擇應回到實際的資料速率。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q185",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠以 RS-485 匯流排串接 20 台 Modbus RTU 電表，總線長約 800 公尺。近期最遠端的幾台常出現 CRC 錯誤。下列排查方向何者最應優先？",
    choices: [
      { id: "A", text: "確認兩端終端電阻與接地，並檢查分支是否過長" },
      { id: "B", text: "把所有電表的 Modbus 位址重新編號，排除位址衝突" },
      { id: "C", text: "把鮑率調高，以縮短每筆訊框在長線上的傳輸與等待時間" },
      { id: "D", text: "更換最遠端幾台電表的韌體，並重新設定通訊逾時參數" },
    ],
    answer: "A",
    explanation:
      "RS-485 長距離匯流排若缺少終端電阻、接地不良或有長分支，訊號反射與共模電壓會在遠端最先顯現為 CRC 錯誤。實體層的拓樸與終端是長線通訊問題的首要排查點。",
    choiceExplanations: {
      B: "位址衝突會造成完全無回應或錯亂回應，不會呈現距離相關的 CRC 錯誤。",
      C: "鮑率越高，長線上的訊號完整性越差，遠端的錯誤只會更多。",
      D: "多台遠端電表同時出錯，指向共同的實體線路而不是個別韌體或參數設定。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["RS-485", "終端電阻", "訊號反射", "Modbus RTU"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "A2.3",
      decisionBoundary:
        "若錯誤只出現在單一台電表且與距離無關，焦點就應轉向該台的接線或硬體，而不是整條匯流排的終端與接地。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q186",
    subjectId: "aiot-junior-basics",
    prompt:
      "某應變規式荷重元的輸出只有數毫伏，要接到 3.3 V 滿刻度的 ADC。訊號調節鏈中最關鍵的元件是下列何者？",
    choices: [
      { id: "A", text: "電壓分壓器" },
      { id: "B", text: "儀表放大器" },
      { id: "C", text: "光耦合器" },
      { id: "D", text: "數位類比轉換器" },
    ],
    answer: "B",
    explanation:
      "荷重元的惠斯登電橋輸出是微弱的差動訊號，且帶有共模電壓；儀表放大器提供高輸入阻抗、高共模抑制比與精確的增益，把毫伏級差動訊號放大到 ADC 的滿刻度範圍，是應變式感測器的標準前端。",
    choiceExplanations: {
      A: "分壓器是把電壓變小，本題需要的是放大，方向相反。",
      C: "光耦合器用於電氣隔離的數位訊號傳遞，不能精確放大類比微訊號。",
      D: "數位類比轉換器是把數位值轉成類比輸出，與讀取感測器訊號無關。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["儀表放大器", "訊號調節", "惠斯登電橋", "共模抑制"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若感測器本身已內建放大與數位輸出（例如帶 I²C 介面的數位荷重元模組），外部就不再需要儀表放大器，訊號調節已在感測器內完成。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q187",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工程師設計電池供電的溫度節點，感測器每小時只需讀一次。他在兩種做法間猶豫：甲、MCU 以 1 kHz 連續取樣並平均；乙、MCU 深度休眠，每小時喚醒取樣數次後回傳。從訊號與功耗的角度，下列評估何者最正確？",
    choices: [
      { id: "A", text: "兩者功耗相同，差別只在資料量與儲存空間" },
      { id: "B", text: "甲較合理，因為取樣越多準確度一定越高且不怕漏掉變化" },
      { id: "C", text: "乙較合理，因為溫度變化緩慢，高頻取樣只是耗電" },
      { id: "D", text: "甲較合理，因為連續取樣可避免混疊並保留完整波形" },
    ],
    answer: "C",
    explanation:
      "取樣率應依訊號的變化速度決定：環境溫度的變化以分鐘計，每小時取幾次已足夠。連續高頻取樣讓 MCU 與 ADC 無法休眠，功耗高出數個數量級，卻不會增加任何有意義的資訊，是電池節點最常見的設計錯誤。",
    choiceExplanations: {
      A: "連續取樣讓系統無法進入深度休眠，功耗差距通常在百倍以上，絕非相同。",
      B: "平均多次取樣可以壓低雜訊，但對變化極慢的溫度，喚醒後取幾次平均就有同樣效果，不需要連續 1 kHz。",
      D: "混疊的顧慮是針對有高頻成分的訊號，溫度的頻譜極低，每小時取樣遠高於所需的兩倍。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["取樣率選擇", "工作週期", "深度休眠", "功耗"],
      constraints: ["power", "bandwidth"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Correct in Different Context",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若量測對象改為振動或聲音這類高頻訊號，連續高速取樣就是必要的，此時要改以事件觸發喚醒與短時間高速擷取來兼顧功耗。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q188",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫療設備要把感測前端與主控板之間的數位訊號做電氣隔離，以保護病患免受漏電流影響。下列元件何者最直接對應？",
    choices: [
      { id: "A", text: "去耦電容" },
      { id: "B", text: "上拉電阻" },
      { id: "C", text: "電壓轉換器（位準轉換）" },
      { id: "D", text: "數位隔離器或光耦合器" },
    ],
    answer: "D",
    explanation:
      "光耦合器與數位隔離器（磁耦或容耦）在兩側之間沒有導電路徑，訊號以光或電磁場跨越隔離屏障，能阻斷漏電流與接地迴路，是醫療與工業設備隔離數位訊號的標準元件。",
    choiceExplanations: {
      A: "去耦電容用於穩定電源、濾除高頻雜訊，不提供隔離。",
      B: "上拉電阻只是把浮接的訊號線定義為高電位，兩側仍是電氣相連的。",
      C: "位準轉換只是把不同電壓標準的訊號互相對應，兩側仍共地，沒有隔離。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["電氣隔離", "光耦合器", "數位隔離器", "漏電流"],
      constraints: ["safety"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若要隔離的是類比訊號而不是數位訊號，就要改用隔離放大器，光耦合器的非線性會讓類比值失真。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q189",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 I²C 感測器在示波器上看到時脈線正常，但資料線始終維持高電位、MCU 讀不到任何回應。接線與供電確認無誤。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "時脈頻率設得太低，感測器來不及回應" },
      { id: "B", text: "資料線的上拉電阻阻值太小，使電位無法拉低" },
      { id: "C", text: "送出的裝置位址與感測器不符，因此沒有確認位元" },
      { id: "D", text: "感測器內部的量測範圍暫存器設定錯誤" },
    ],
    answer: "C",
    explanation:
      "I²C 由主機發出位址後，只有位址相符的裝置會把資料線拉低作為確認。資料線始終為高、無任何確認，最典型的原因是位址不符（例如位址腳位接法不同或用了 8 位元與 7 位元位址的差異）。",
    choiceExplanations: {
      A: "時脈太低只會讓通訊變慢，裝置仍會回應確認，不會讓資料線一直維持高電位。",
      B: "上拉電阻太小會讓裝置難以把線拉低，但通常表現為波形邊緣異常或部分位元錯誤，而不是完全無回應；且題幹已確認接線無誤。",
      D: "量測範圍是裝置內部的暫存器設定，即使設錯，裝置在位址階段仍會回應確認。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["I²C", "裝置位址", "確認位元", "匯流排除錯"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若資料線有確認位元但後續讀到的值全為 0xFF 或固定值，問題就會轉向暫存器位址或裝置的初始化順序，而不是匯流排位址。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q190",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於「雜訊」與「解析度」對量測系統的影響，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "當雜訊的峰對峰值超過 ADC 的一個最低位元時，增加位元數不會提高有效解析度" },
      { id: "B", text: "只要把 ADC 換成更高位元的型號，量測的準確度就一定提升" },
      { id: "C", text: "縮短感測器到 ADC 的線長、使用雙絞線，有助於降低耦合進來的雜訊" },
      { id: "D", text: "對多次取樣取平均可以降低隨機雜訊的影響" },
    ],
    answer: "B",
    explanation:
      "準確度受感測器誤差、參考電壓、雜訊與校正的共同限制；在雜訊已經超過一個最低位元的系統上換更高位元的 ADC，只是把雜訊看得更清楚，準確度不會提升。其餘三項都是正確的訊號處理常識。",
    choiceExplanations: {
      A: "雜訊淹沒最低位元後，多出來的位元只是在量化雜訊，有效位元數不會增加，敘述正確。",
      C: "短線與雙絞線減少天線效應與磁場耦合，是降低外部雜訊的基本做法，敘述正確。",
      D: "隨機雜訊的平均會隨取樣次數的平方根下降，這是常用的降噪方法，敘述正確。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["雜訊", "有效位元數", "平均降噪", "準確度"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若系統的雜訊已經遠低於一個最低位元、且感測器與參考電壓的誤差也很小，此時 ADC 的位元數才會成為瓶頸，升級才有意義。",
    },
  },
];
