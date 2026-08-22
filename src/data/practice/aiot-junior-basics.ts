import type { Question } from "../types";

/**
 * AIoT 考科一的新題庫，依 2026 iPAS AIoT 題庫生成規格 v2.0 命題。
 *
 * 與 `src/data/generated/*` 的差別在於**命題方法**：每題都先決定節點、認知層級、
 * 題型原型、干擾項策略與難度，再寫題目；每個錯誤選項都標註干擾類型，
 * 並附「條件改變時答案如何變化」的 Decision Boundary。
 * 分布規範（認知層級、難度、Definition 題上限、跨節點比例）由
 * `tests/aiotQuestionBank.test.ts` 強制。
 *
 * 內容為 LLM 命題，正確性需人工複審。
 */
export const practiceQuestions: Question[] = [
  // ── A1.1 AI 基礎概念（11 題）──────────────────────────────────
  {
    id: "aiot-junior-basics-practice-q001",
    subjectId: "aiot-junior-basics",
    prompt:
      "某產線的振動監測系統需在馬達出現異常前發出預警。工程師手上有兩年份的連續振動波形，但只有 12 筆確認故障的紀錄，且每次故障的成因都不完全相同。下列建模取向何者最合理？",
    choices: [
      { id: "A", text: "以 12 筆故障紀錄訓練多類別分類器，直接判斷故障型態" },
      { id: "B", text: "以迴歸模型預測下一秒的振動振幅，超過門檻即告警" },
      { id: "C", text: "以大量正常運轉資料建立行為分布，偵測偏離分布的樣本" },
      { id: "D", text: "以強化學習讓模型自行嘗試不同的維修策略" },
    ],
    answer: "C",
    explanation:
      "正樣本只有 12 筆、且成因分散，任何監督式方法都會嚴重欠缺代表性；但正常資料極多。此時改以非監督的異常偵測——先學會「正常長什麼樣」，偏離即告警——是把資料優勢用在刀口上的做法。",
    choiceExplanations: {
      A: "12 筆樣本要撐起多類別分類，每一類可能只有兩三筆，模型學到的是那幾筆的細節而非故障的共通樣態。若日後累積到每類數百筆，這才會是更精準的選擇。",
      B: "預測下一秒振幅是把問題換成迴歸，但門檻仍要人訂，且單點振幅超標與「即將故障」不是同一件事，反而丟掉了時間樣態的資訊。",
      D: "強化學習需要能反覆試錯的環境與明確獎勵，在真實產線上讓模型「試試看怎麼修」既不安全也無法取得足夠回合數。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["異常偵測", "監督式學習", "類別不平衡"],
      constraints: ["labeled_data_scarcity", "data_volume", "safety"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若故障紀錄累積到每種型態數百筆且標註一致，監督式分類會反過來優於異常偵測，因為它能直接指出「是哪一種故障」而不只是「不正常」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q002",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於邊緣裝置上「模型量化」與「類比數位轉換」的敘述，何者正確？",
    choices: [
      { id: "A", text: "兩者都把連續值轉為離散值，前者處理的是模型權重、後者處理的是感測訊號" },
      { id: "B", text: "兩者都把連續值轉為離散值，前者處理的是感測訊號、後者處理的是模型權重" },
      { id: "C", text: "模型量化會提高推論精度，類比數位轉換會降低訊號精度" },
      { id: "D", text: "兩者都必須在雲端執行，邊緣裝置無法負擔" },
    ],
    answer: "A",
    explanation:
      "兩者中文都叫「量化」，但作用對象完全不同：模型量化把權重從 FP32 降到 INT8 以縮小模型；ADC 把感測器輸出的連續電壓轉成數位碼。搞混這兩者是這一節最典型的失分點。",
    choiceExplanations: {
      B: "對象被對調了——處理感測訊號的是 ADC，處理權重的才是模型量化。",
      C: "模型量化通常會略微降低精度以換取體積與速度，說它提高精度剛好相反。",
      D: "兩者恰恰都是為了在資源受限的邊緣端執行而存在，ADC 更是內建在 MCU 裡。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["模型量化", "ADC", "Edge AI"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若題目改問「如何在不換硬體的前提下讓 12 位元感測讀值更細緻」，答案會落到 ADC 的參考電壓與位元數，而與模型量化無關。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q003",
    subjectId: "aiot-junior-basics",
    prompt:
      "某智慧路燈專案要在燈桿上的微控制器執行影像判斷，硬體規格為 512 KB RAM、無 GPU、電池搭配太陽能供電。原本在伺服器上訓練的模型檔案為 45 MB。下列處理順序何者最合理？",
    choices: [
      { id: "A", text: "先提高微控制器時脈，再直接載入原模型" },
      { id: "B", text: "先把影像上傳雲端推論，再把結果寫回燈桿" },
      { id: "C", text: "先量化與剪枝壓縮模型，再評估是否仍需簡化網路架構" },
      { id: "D", text: "先增加訓練資料量，再重新訓練同一個模型" },
    ],
    answer: "C",
    explanation:
      "45 MB 的模型在 512 KB RAM 上完全放不下，差距是兩個數量級。壓縮（量化、剪枝）是成本最低的第一步；若壓完仍放不下，才需要換更小的網路架構重訓。",
    choiceExplanations: {
      A: "時脈影響的是運算速度，不會讓 45 MB 的模型塞進 512 KB 記憶體，瓶頸被誤判了。",
      B: "上雲推論在網路穩定且不在意延遲時是合理架構，但本題的限制是電池供電——持續上傳影像的通訊功耗往往比本地推論更高。",
      D: "增加資料量是改善精度的手段，模型體積不會因此縮小，與本題的資源限制無關。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["模型壓縮", "量化", "剪枝", "Edge AI"],
      constraints: ["memory", "power", "no_gpu"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若燈桿改為市電供電且已拉光纖，上雲推論的功耗與頻寬顧慮消失，B 會變成更省事的選擇——維護模型只需更新雲端一處。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q004",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於神經網路處理器（NPU），下列敘述何者正確？",
    choices: [
      { id: "A", text: "NPU 具備通用運算能力，可取代 CPU 負責作業系統排程" },
      { id: "B", text: "NPU 只支援浮點運算，無法執行整數量化後的模型" },
      { id: "C", text: "NPU 擅長 AI 加速，因此主要用於雲端的大型模型訓練" },
      { id: "D", text: "NPU 專為矩陣運算最佳化，適合在裝置端執行推論" },
    ],
    answer: "D",
    explanation:
      "NPU 是協同處理器，把神經網路中最密集的矩陣乘加運算硬體化，因此能以極低功耗完成推論。它不處理通用邏輯，也不是為訓練設計的。",
    choiceExplanations: {
      A: "NPU 沒有通用指令集與中斷處理能力，作業系統排程與 I/O 仍必須由 CPU 負責。",
      B: "情況相反，NPU 的強項正是 INT8 這類整數量化推論，比浮點更省電也更快。",
      C: "前半句對、後半句錯——雲端訓練用的是高算力的 GPU 或 TPU，邊緣 NPU 的算力與記憶體都不足以支撐訓練。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["NPU", "推論加速", "量化"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若情境改為「要在機房訓練一個上億參數的模型」，答案會轉向 GPU 或 TPU——NPU 的設計目標從一開始就不包含訓練。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q005",
    subjectId: "aiot-junior-basics",
    prompt:
      "農場要判斷灌溉閥門「該開」或「該關」，並同時預測「未來六小時的土壤含水量」。關於這兩個任務的性質，下列敘述何者正確？",
    choices: [
      { id: "A", text: "前者為迴歸、後者為分類" },
      { id: "B", text: "兩者都是分群，因為都沒有標準答案" },
      { id: "C", text: "兩者都是分類，只是類別數不同" },
      { id: "D", text: "前者為分類、後者為迴歸" },
    ],
    answer: "D",
    explanation:
      "輸出是有限的離散選項（開／關）就是分類；輸出是連續數值（含水量百分比）就是迴歸。同一個系統中兩種任務並存是 AIoT 的常態，評估指標也必須分開選用。",
    choiceExplanations: {
      A: "兩者被對調了——開關是離散決策，含水量是連續數值。",
      B: "分群是非監督任務，用於沒有目標變數時找出資料結構；本題兩個任務都有明確的預測目標。",
      C: "含水量若硬分成幾個區間確實可以當分類做，但那會丟失精度，且題目問的是原始任務性質。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["分類", "迴歸", "分群"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若需求改成「把農地依歷史含水樣態分成幾個管理區，但事先不知道要分幾區」，任務性質就轉為分群，評估方式也從準確率換成輪廓係數這類內部指標。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q006",
    subjectId: "aiot-junior-basics",
    prompt:
      "某冷鏈物流以車載感測器監控溫度，模型部署於車上的邊緣裝置。導入半年後，判斷準確度明顯下滑，工程師確認硬體與韌體均正常、感測器校正無誤。下列何者最可能是原因？",
    choices: [
      { id: "A", text: "模型的參數在推論過程中被逐步改寫" },
      { id: "B", text: "車隊改運不同品項後，貨物的熱特性與訓練時不同，輸入分布已經改變" },
      { id: "C", text: "邊緣裝置的儲存空間逐漸被日誌佔滿" },
      { id: "D", text: "感測器的取樣頻率被自動調高" },
    ],
    answer: "B",
    explanation:
      "硬體、韌體與校正都排除後，剩下的變數就是「模型看到的資料變了」。運送品項改變會讓溫度變化的樣態偏離訓練分布，這是典型的資料漂移，需要以新資料重訓並建立持續監控。",
    choiceExplanations: {
      A: "推論階段不會更新權重，模型參數在部署後是固定的；會自我改寫是對線上學習的誤解。",
      C: "空間不足通常導致寫入失敗或服務中斷，症狀是「不能用」而不是「判斷變差」。",
      D: "取樣頻率不會自動改變；即使變了，通常影響的是資料量與功耗，而非判斷方向的系統性偏移。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料漂移", "模型監控", "推論"],
      constraints: ["deployment_duration", "environment_change"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若同時發現同一批車的讀值全部偏移固定值，優先懷疑的就不是漂移而是感測器校正或安裝位置改變——那是硬體問題而非模型問題。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q007",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於在 AIoT 系統中導入深度學習，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "卷積網路擅長擷取空間局部特徵，常用於影像式檢測" },
      { id: "B", text: "循環網路與長短期記憶模型適合處理有時間順序的感測序列" },
      { id: "C", text: "模型壓縮可讓深度模型部署到資源受限的端側裝置" },
      { id: "D", text: "深度模型能自動萃取特徵，因此資料品質不再影響結果" },
    ],
    answer: "D",
    explanation:
      "自動萃取特徵指的是不必人工設計濾波器，但模型仍然只能從資料裡學東西。標註錯誤、感測失真或樣本不具代表性，深度模型一樣會學到錯誤規律，甚至因為容量大而學得更徹底。",
    choiceExplanations: {
      A: "卷積以濾波器擷取局部空間樣態，用於瑕疵檢測是標準應用，敘述正確。",
      B: "遞迴結構帶有狀態記憶，適合振動、電流這類時間序列，敘述正確。",
      C: "量化與剪枝正是讓深度模型能塞進 MCU 或邊緣裝置的手段，敘述正確。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["CNN", "RNN", "特徵萃取", "資料品質"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 D 改成「深度模型能省去人工設計特徵的步驟」，它就會變成正確敘述——差別只在有沒有把「省去人工特徵工程」誇大成「資料品質不重要」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q008",
    subjectId: "aiot-junior-basics",
    prompt:
      "一套從資料到上線的 AIoT 模型流程包含以下環節，何者的順序最合理？",
    choices: [
      { id: "A", text: "資料收集 → 模型訓練 → 部署推論 → 前處理 → 模型壓縮 → 持續監控" },
      { id: "B", text: "資料收集 → 前處理 → 模型訓練 → 模型壓縮 → 部署推論 → 持續監控" },
      { id: "C", text: "模型訓練 → 資料收集 → 前處理 → 部署推論 → 持續監控 → 模型壓縮" },
      { id: "D", text: "部署推論 → 持續監控 → 資料收集 → 模型訓練 → 前處理 → 模型壓縮" },
    ],
    answer: "B",
    explanation:
      "前處理必須在訓練之前（否則模型吃到的是髒資料），壓縮必須在訓練之後（壓的是已訓練好的權重），監控則在上線之後持續進行並回饋到下一輪。這條順序反映的是資料與模型的依賴關係。",
    choiceExplanations: {
      A: "把前處理放到部署之後，代表訓練時用的是未清理的資料，上線後才處理已無意義。",
      C: "還沒有資料就開始訓練在邏輯上不成立，壓縮也不會排在監控之後。",
      D: "尚未訓練出模型就先部署，整條流程的起點就錯了。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Architecture",
      concepts: ["訓練到推論流程", "模型壓縮", "監控"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若模型改為在雲端以充足資源推論，「模型壓縮」這一環可以省略；但監控與前處理的位置不會因此改變。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q009",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於監督式學習與非監督式學習，下列敘述何者正確？",
    choices: [
      { id: "A", text: "監督式學習需要標籤，非監督式學習從資料本身的結構找規律" },
      { id: "B", text: "非監督式學習需要標籤，監督式學習不需要" },
      { id: "C", text: "兩者的差別在於資料量多寡，與有無標籤無關" },
      { id: "D", text: "非監督式學習只能用於影像，監督式學習只能用於數值" },
    ],
    answer: "A",
    explanation:
      "有沒有「正確答案」是兩者的分界：監督式以標籤為學習訊號，非監督式則靠資料的分布與相似性自行發現群集或異常。AIoT 現場故障樣本稀少，因此非監督路線經常是務實選擇。",
    choiceExplanations: {
      B: "兩者被對調了，需要標籤的是監督式學習。",
      C: "資料量會影響效果，但不是兩者的定義性差異。",
      D: "兩種範式都與資料型別無關，影像與數值都能各自使用。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["監督式學習", "非監督式學習"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若情境改為「只有少量標註但有大量未標註資料」，最合適的就不是純監督或純非監督，而是半監督式學習。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q010",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫院要在病房端裝置上執行跌倒偵測，院方要求影像不得離開病房、判斷延遲需低於 200 毫秒，且裝置僅以 PoE 供電、無獨立顯示卡。下列方案何者最符合全部條件？",
    choices: [
      { id: "A", text: "在病房端以整合 NPU 的裝置執行量化後的輕量模型" },
      { id: "B", text: "把影像串流至院內伺服器叢集，由 GPU 集中推論" },
      { id: "C", text: "把影像上傳公有雲，使用託管的視覺辨識服務" },
      { id: "D", text: "在病房端只做錄影，每日夜間批次分析" },
    ],
    answer: "A",
    explanation:
      "三個限制同時成立：影像不出病房（排除任何上傳）、延遲低於 200 毫秒（排除批次）、無顯示卡且功耗受限（排除高耗能方案）。整合 NPU 的端側裝置搭配量化模型是唯一能同時滿足的組合。",
    choiceExplanations: {
      B: "院內伺服器雖然沒有離開醫院，但影像已離開病房，且串流本身會增加延遲與網路負擔，不符合最嚴格的那條限制。",
      C: "上傳公有雲直接違反資料不得離開病房的要求，延遲也最不可控。",
      D: "夜間批次分析在跌倒發生後數小時才知道，完全達不到即時偵測的目的。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["Edge AI", "NPU", "隱私", "延遲"],
      constraints: ["privacy", "latency", "power", "no_gpu"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若院方把限制放寬為「影像可留在院內網路」且延遲要求放寬到數秒，B 的集中式 GPU 推論會更划算——模型只需維護一份，也更容易升級。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q011",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於在端側部署 AI 模型，下列敘述中「甲、乙、丙、丁」何者正確？甲：量化可縮小模型體積；乙：剪枝移除貢獻極小的連結；丙：端側推論一定比雲端推論準確；丁：端側部署可降低對網路連線的依賴。",
    choices: [
      { id: "A", text: "乙、丙、丁" },
      { id: "B", text: "甲、乙、丙" },
      { id: "C", text: "甲、乙、丁" },
      { id: "D", text: "甲、丙、丁" },
    ],
    answer: "C",
    explanation:
      "甲與乙分別是兩種標準的模型壓縮手段，丁點出邊緣部署最核心的價值。丙是錯的——端側跑的往往是壓縮過的較小模型，準確度通常略低於雲端的大模型，換來的是延遲與隱私上的好處。",
    choiceExplanations: {
      A: "同樣包含丙，且漏掉了甲這個最基本的壓縮手段。",
      B: "包含了丙。端側的優勢在延遲、頻寬與隱私，而不是準確度；把取捨的方向說反了。",
      D: "包含丙並漏掉乙，剪枝與量化是並列的兩種壓縮方式，不應只承認其一。",
    },
    topic: "A1.1 AI 基礎概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Multi-Statement",
      concepts: ["量化", "剪枝", "邊緣推論"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若端側改用與雲端相同規模的未壓縮模型（例如裝了高階加速卡的邊緣伺服器），丙的準確度落差就會消失，此時選擇端或雲的依據會回到延遲、頻寬與隱私。",
    },
  },

  // ── A1.2 AIoT 應用案例（11 題）────────────────────────────────
  {
    id: "aiot-junior-basics-practice-q012",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工具機廠目前採固定週期保養：不論狀況，每 500 小時更換主軸軸承。近期發現有些軸承換下來仍良好，另有兩次在週期內就發生失效。下列改善方向何者最能同時處理這兩個問題？",
    choices: [
      { id: "A", text: "依振動與溫度資料評估實際劣化程度，據此安排更換" },
      { id: "B", text: "改為故障後再更換，以完全避免過度保養" },
      { id: "C", text: "延長保養週期以降低更換成本" },
      { id: "D", text: "縮短保養週期為每 300 小時更換一次" },
    ],
    answer: "A",
    explanation:
      "「換太早浪費」與「換太晚失效」是同一個病因的兩面：以時間為依據，而時間不等於劣化程度。改看實際狀態才能同時解決兩者，這正是預測性維護相對於定期保養的價值。",
    choiceExplanations: {
      B: "壞了再修雖然沒有過度保養，但非計畫停機的連鎖成本通常遠高於零件本身，在產線上是最貴的策略。",
      C: "延長週期恰好相反，會讓週期內失效的次數增加，風險上升。",
      D: "縮短週期只處理了「換太晚」，卻讓「換太早」的浪費更嚴重，兩個問題只解一半。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["預測性維護", "定期保養", "事後維修"],
      constraints: ["cost", "reliability"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若設備極為廉價、更換只需數分鐘且故障不影響其他工序（例如照明燈管），壞了再換反而是總成本最低的策略，不值得為它建立監測系統。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q013",
    subjectId: "aiot-junior-basics",
    prompt:
      "維修部門要區分兩個需求：其一「這台設備現在出了什麼問題」，其二「這台設備還能運轉多久」。關於兩者對應的任務性質，下列敘述何者正確？",
    choices: [
      { id: "A", text: "前者為預後、屬迴歸；後者為診斷、屬分類" },
      { id: "B", text: "前者為診斷、屬分類；後者為預後、屬迴歸" },
      { id: "C", text: "兩者都屬診斷，差別只在時間點" },
      { id: "D", text: "兩者都屬預後，因為都需要預測未來" },
    ],
    answer: "B",
    explanation:
      "診斷回答「現在是哪一種故障」，輸出為類別；預後回答「剩餘使用壽命還有多少」，輸出為連續數值。兩者的資料需求、模型與評估指標都不同，混為一談會導致選錯評估方式。",
    choiceExplanations: {
      A: "兩者的對應關係被完全對調。",
      C: "「還能運轉多久」預測的是未來，不屬於診斷當下狀態的範疇。",
      D: "「現在出了什麼問題」是對當下的判斷，不需要預測未來。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["診斷", "預後", "RUL"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把「還能運轉多久」改成「未來 7 天內是否會故障」，它就從迴歸變回二元分類，評估指標也從 MAE 換成召回率與精確率。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q014",
    subjectId: "aiot-junior-basics",
    prompt:
      "某自駕巡檢車同時配置攝影機與光達。工程師主張「既然光達精度高，可以移除攝影機以降低成本」。下列回應何者最合理？",
    choices: [
      { id: "A", text: "應該改為移除光達，因為攝影機的解析度較高" },
      { id: "B", text: "兩者提供互補資訊，移除其一會在特定情境下失去判斷依據" },
      { id: "C", text: "應該同意，感測器越少系統越穩定" },
      { id: "D", text: "應該兩者都移除，改以超音波感測器取代" },
    ],
    answer: "B",
    explanation:
      "感測融合的價值不在數量而在互補：光達給精確的距離與形狀但沒有顏色與紋理，攝影機能讀標誌與號誌卻對距離估計較弱。移除任一方，都會在對方擅長的情境留下盲區。",
    choiceExplanations: {
      A: "解析度高低不是取捨依據，兩者量測的是不同物理量，無法互相取代。",
      C: "減少感測器確實降低成本與故障點，但代價是失去互補性；「越少越穩定」把成本考量誤當成可靠度原則。",
      D: "超音波的作用距離僅數公尺且易受環境影響，無法承擔車輛級的環境感知。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["感測融合", "光達", "攝影機", "強健性"],
      constraints: ["cost", "reliability", "environment"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若應用場域改成固定光線的室內倉儲、且只需量測貨架距離，單一感測器（甚至只用超音波）就足夠，融合帶來的成本就不再划算。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q015",
    subjectId: "aiot-junior-basics",
    prompt:
      "某果園要部署 300 個土壤感測節點，範圍約 4 公里，節點以電池供電需運作兩年，每 10 分鐘回報 20 位元組資料，園區無電信涵蓋且無市電。下列通訊方案何者最適合？",
    choices: [
      { id: "A", text: "自建 LoRaWAN 閘道器與節點" },
      { id: "B", text: "為每個節點加裝 Wi-Fi 模組並架設多個基地台" },
      { id: "C", text: "以藍牙低功耗讓節點兩兩接力回傳" },
      { id: "D", text: "為每個節點申請 NB-IoT 門號" },
    ],
    answer: "A",
    explanation:
      "四個限制一起看：公里級距離、電池兩年、每次僅 20 位元組、沒有電信涵蓋。LoRaWAN 正是為長距離、極低功耗、低資料率設計，且可自建閘道器而不依賴電信網路。",
    choiceExplanations: {
      B: "Wi-Fi 在頻寬上綽綽有餘，但功耗與涵蓋距離都不符——要覆蓋 4 公里得架大量基地台，而這些基地台還需要市電。",
      C: "藍牙低功耗的單跳距離僅數十公尺，300 個節點接力會讓延遲與可靠度都難以控制，且中繼節點耗電會急遽增加。",
      D: "NB-IoT 的功耗與資料率都合適，但題目明確指出園區無電信涵蓋，前提就不成立。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["LoRaWAN", "Wi-Fi", "BLE", "NB-IoT"],
      constraints: ["range", "power", "data_rate", "no_cellular_coverage"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若園區其實有電信涵蓋且不想自建與維運閘道器，NB-IoT 會是更省事的選擇；若改成回傳果實影像，兩者都不夠，得換成 Wi-Fi 或 4G/5G。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q016",
    subjectId: "aiot-junior-basics",
    prompt:
      "評估一項 AIoT 導入案的效益時，下列哪一項最適合作為可驗收的指標？",
    choices: [
      { id: "A", text: "讓產線更智慧化" },
      { id: "B", text: "非計畫停機時數較導入前基準降低 20%" },
      { id: "C", text: "採用業界最新的深度學習模型" },
      { id: "D", text: "完成一份系統架構文件" },
    ],
    answer: "B",
    explanation:
      "可驗收的指標要能對照基準、可量測、且直接對應營運價值。「相較基準降低 20%」三者俱全，事後可明確判定達成與否。",
    choiceExplanations: {
      A: "「更智慧化」沒有量測方式也沒有基準，任何結果都能被說成達標或未達標。",
      C: "使用什麼模型是手段而非目的，先進的模型未必帶來營運改善。",
      D: "文件是過程產出，不代表停機、良率或成本真的改變了。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["效益衡量", "KPI", "基準線"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "B2.3",
      decisionBoundary:
        "若導入目的其實是「取得產線資料以供日後分析」而非立即降低停機，驗收指標就應改為資料覆蓋率與完整性，而不是停機時數。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q017",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於智慧建築中的 AIoT 應用，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "以人流與溫濕度資料動態調整空調，可在維持舒適的前提下節能" },
      { id: "B", text: "以電力用量的異常樣態可推測設備故障或異常用電" },
      { id: "C", text: "照明控制可結合光照感測與排程，減少不必要的耗電" },
      { id: "D", text: "只要裝設足夠多的感測器，就能保證節能目標達成" },
    ],
    answer: "D",
    explanation:
      "感測器只提供資料，節能來自「依資料做出正確的控制決策」並落實執行。裝了大量感測器卻沒有調整控制邏輯，只會多出一堆沒人看的數據與額外的維運成本。",
    choiceExplanations: {
      A: "依實際人流與環境調節而非固定排程，正是空調節能的標準做法，敘述正確。",
      B: "用電樣態偏離常態往往是設備劣化或異常運轉的早期訊號，敘述正確。",
      C: "結合自然採光與使用排程調整照明，是最容易見效的節能措施之一，敘述正確。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["智慧建築", "節能", "感測佈署"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 D 改成「足夠的感測覆蓋是節能分析的前提」，它就成立了——差別在於把「必要條件」誤說成「充分條件」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q018",
    subjectId: "aiot-junior-basics",
    prompt:
      "某養殖場導入水質監測與自動投餌，系統在颱風期間因對外網路中斷而完全停擺，造成損失。下列改善設計何者最直接？",
    choices: [
      { id: "A", text: "增加感測器的取樣頻率以提早發現異常" },
      { id: "B", text: "提高雲端伺服器的規格以加快回應" },
      { id: "C", text: "讓現場控制器具備離線自主運作與資料暫存，恢復連線後再同步" },
      { id: "D", text: "把所有控制邏輯搬到雲端以便統一管理" },
    ],
    answer: "C",
    explanation:
      "問題的本質是「控制決策依賴一條會斷的網路」。把基本控制邏輯留在現場、斷線期間先本地運作並暫存資料，才能讓網路中斷從「停擺」降級成「暫時無法遠端監看」。",
    choiceExplanations: {
      A: "取樣再密，資料送不出去、控制指令回不來，仍然無法投餌。",
      B: "雲端再快也救不了斷線；瓶頸在連線本身而非伺服器效能。",
      D: "把邏輯全部上雲會讓對網路的依賴更深，正是造成本次事故的原因。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["邊緣自主", "容錯設計", "離線暫存"],
      constraints: ["cloud_availability", "reliability", "environment"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若場域網路極為穩定（例如廠內有備援專線），把邏輯集中在雲端反而較好維護；離線自主的價值與網路可用度成反比。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q019",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列哪一項最能說明「AIoT」相較於單純「IoT」的差異？",
    choices: [
      { id: "A", text: "在既有的感測與連網之上，加入從資料中學習並自動判斷的能力" },
      { id: "B", text: "使用更多種類的感測器" },
      { id: "C", text: "把所有資料都保存到雲端" },
      { id: "D", text: "採用更高速的通訊協定" },
    ],
    answer: "A",
    explanation:
      "IoT 解決的是「把東西連起來並取得資料」，AIoT 則在其上加入分析與判斷，讓系統能從資料中學到規律並自動反應。關鍵差別在於「會不會學與判斷」，不是感測器或頻寬的數量。",
    choiceExplanations: {
      B: "感測器種類增加只是擴大資料來源，資料再多沒有分析仍然只是 IoT。",
      C: "把資料存起來是資料工程，保存本身不會產生任何判斷能力。",
      D: "更快的協定改善的是傳輸效率，與是否具備學習能力無關。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["AIoT", "IoT"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若一套系統只是把感測資料畫成儀表板供人判讀，即使用了雲端與高速網路，它仍屬於 IoT；加入自動判斷之後才跨入 AIoT。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q020",
    subjectId: "aiot-junior-basics",
    prompt:
      "醫院要導入病房設備的異常預警。評估後發現：現有設備多為十年以上的舊機型、無標準通訊介面，且院方要求不得改動設備本體。下列做法何者最務實？",
    choices: [
      { id: "A", text: "全面汰換為具備連網功能的新設備" },
      { id: "B", text: "要求所有設備原廠開放內部通訊協定" },
      { id: "C", text: "以外掛式感測器（如電流勾表、振動貼片）取得間接訊號後建模" },
      { id: "D", text: "放棄預警，改為加強人工巡檢頻率" },
    ],
    answer: "C",
    explanation:
      "限制是「不能改動設備、沒有標準介面」。外掛式感測從外部量測電流、振動這類間接訊號，不需要設備配合就能取得狀態資料，是舊設備數位化最常用的切入方式。",
    choiceExplanations: {
      A: "全面汰換能一次解決介面問題，但成本與停機衝擊極高，且違反「不得改動設備」的前提。",
      B: "十年以上的機型原廠未必仍支援，且開放協定的時程與意願都不在專案可控範圍內。",
      D: "加強巡檢是保守的替代方案，但完全放棄了自動預警的價值，屬於退回原點而非解法。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["舊設備數位化", "間接量測", "外掛感測"],
      constraints: ["legacy_equipment", "no_modification", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若設備本身已支援 Modbus 或 OPC UA，就不必外掛感測器——直接讀取設備自己的參數，資料品質與涵蓋面都遠優於間接訊號。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q021",
    subjectId: "aiot-junior-basics",
    prompt:
      "某零售門市原本以店內攝影機計算來客數，資料上傳雲端分析。若需求改為「在收銀台即時判斷商品是否被正確掃描」，下列調整何者最關鍵？",
    choices: [
      { id: "A", text: "增加雲端儲存空間以保存更多影像" },
      { id: "B", text: "提高攝影機的畫素以增加細節" },
      { id: "C", text: "把分析週期從每小時改為每十分鐘" },
      { id: "D", text: "把推論移到收銀台端執行，以滿足即時回饋的延遲要求" },
    ],
    answer: "D",
    explanation:
      "需求從「事後統計」變成「當下回饋」，最關鍵的約束由資料量換成了延遲。判斷必須在顧客還站在收銀台時完成，因此推論位置要從雲端移到端側。",
    choiceExplanations: {
      A: "儲存空間關係到能保留多久的影像，與判斷能不能即時完成無關。",
      B: "畫素提高有助辨識細節，但影像更大反而讓上傳與推論更慢，沒有解決延遲這個核心限制。",
      C: "十分鐘的分析週期對「即時判斷」仍然遠遠不夠，只是把事後統計做得密一點。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["邊緣推論", "延遲", "雲端分析"],
      constraints: ["latency", "real_time_requirement"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Correct in Different Context",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若需求再改回「每日統計各時段來客數」，延遲不再重要，把推論放回雲端反而更省成本，也更容易統一更新模型。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q022",
    subjectId: "aiot-junior-basics",
    prompt:
      "某製造業導入 AI 影像檢測後，品檢員反映「系統常把可接受的輕微色差判為不良」，導致重工量大增。下列處理何者最應優先進行？",
    choices: [
      { id: "A", text: "改用更高階的工業相機" },
      { id: "B", text: "直接調高模型判為不良的門檻以減少誤報" },
      { id: "C", text: "增加模型的層數以提升辨識能力" },
      { id: "D", text: "與品檢員重新確認判定標準，檢視標註規範是否與現場認定一致" },
    ],
    answer: "D",
    explanation:
      "誤報集中在「輕微色差」這個特定樣態，指向的是標註時對可接受範圍的認定與現場不同——也就是標籤本身的問題。門檻與模型都建立在標籤之上，標準沒對齊就先調參數，只是把錯誤往另一邊推。",
    choiceExplanations: {
      A: "影像品質若足以讓人判斷，就不是設備問題；換相機無法解決認定標準的落差。",
      B: "調門檻能立刻減少誤報，但也會同步放過真正的不良品；在還沒確認標準之前，這是拿漏檢換重工。",
      C: "模型容量不是瓶頸——它已經很忠實地學會了標註中的判準，只是那個判準與現場不一致。",
    },
    topic: "A1.2 AIoT 應用案例",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["標註品質", "誤報", "AOI"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若確認標註標準無誤、且誤報平均分布於各種樣態而非集中在色差，問題才可能真的出在模型容量或影像品質，此時 C、D 才值得考慮。",
    },
  },

  // ── A2.1 物聯網架構與功能（11 題）──────────────────────────────
  {
    id: "aiot-junior-basics-practice-q023",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠區有 Zigbee 溫濕度節點、Modbus RTU 電表與乙太網路的工業電腦，需把三者的資料統一送到後端平台。下列元件最能承擔此職責的是何者？",
    choices: [
      { id: "A", text: "閘道器" },
      { id: "B", text: "交換器" },
      { id: "C", text: "路由器" },
      { id: "D", text: "中繼器" },
    ],
    answer: "A",
    explanation:
      "三種來源使用完全不同的實體介面與協定，需要的是能在協定之間轉譯並統一上行格式的節點。這正是閘道器的定義性職責，交換器與路由器只在同一套 TCP/IP 體系內轉送封包。",
    choiceExplanations: {
      B: "交換器依 MAC 位址在第二層轉送訊框，前提是雙方已經在同一種網路上，無法讓 Zigbee 與 Modbus 互通。",
      C: "路由器依 IP 在第三層繞送封包，同樣要求兩端都跑 IP，Modbus RTU 走的是串列介面。",
      D: "中繼器只放大或重整訊號以延長距離，完全不涉及協定轉換。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["Gateway", "Switch", "Router", "Repeater"],
      constraints: ["heterogeneous_protocols"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若三種設備本來就都以乙太網路跑 TCP/IP、只是分屬不同網段，需要的就只是路由器；閘道器的必要性來自「協定異質」而非「網段不同」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q024",
    subjectId: "aiot-junior-basics",
    prompt:
      "在 OSI 模型中，IP 與 TCP 分別位於哪一層？",
    choices: [
      { id: "A", text: "IP 在傳輸層、TCP 在網路層" },
      { id: "B", text: "IP 在網路層、TCP 在傳輸層" },
      { id: "C", text: "兩者都在網路層" },
      { id: "D", text: "兩者都在應用層" },
    ],
    answer: "B",
    explanation:
      "IP 負責跨網段定址與繞送，屬第三層網路層；TCP 負責端到端的連線、順序與可靠性，屬第四層傳輸層。分層的意義在於各自解決不同層次的問題。",
    choiceExplanations: {
      A: "兩者的層級被對調，是最常見的記憶錯誤。",
      C: "TCP 提供的連線與重傳機制屬於傳輸層職責，不在網路層。",
      D: "應用層是 HTTP、MQTT 這類協定所在的位置，IP 與 TCP 都在其下。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["OSI", "IP", "TCP"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若問的是 MQTT 位於哪一層，答案會是應用層——它跑在 TCP 之上，兩者是上下層關係而非並列。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q025",
    subjectId: "aiot-junior-basics",
    prompt:
      "某產線只有單一品牌的 PLC（皆支援 OPC UA），但需要在 50 毫秒內就地判斷是否停機。廠區對外網路穩定、頻寬充足。下列部署何者最合理？",
    choices: [
      { id: "A", text: "同時部署閘道器與雲端判斷，以求架構完整" },
      { id: "B", text: "部署邊緣運算節點執行判斷，不需額外的協定轉換閘道" },
      { id: "C", text: "部署協定轉換閘道器，判斷仍交由雲端執行" },
      { id: "D", text: "不部署任何現場設備，全部交由雲端處理" },
    ],
    answer: "B",
    explanation:
      "兩個限制決定答案：協定單一（不需要轉換）、50 毫秒內要判斷（不能上雲來回）。因此需要的是邊緣「運算」而非「協定轉換」——這正是閘道器與邊緣兩個概念必須分清楚的原因。",
    choiceExplanations: {
      A: "為了架構完整而加入不必要的元件，只會增加成本與故障點，不符合工程判斷。",
      C: "協定本來就統一，轉換閘道沒有工作可做；把判斷放雲端也違反 50 毫秒的限制。",
      D: "全部上雲的往返延遲通常在數十毫秒以上且抖動不可控，撐不住 50 毫秒的要求。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["Gateway", "Edge Computing", "OPC UA"],
      constraints: ["latency", "homogeneous_protocol", "bandwidth"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.3",
      decisionBoundary:
        "若產線改為混用三種品牌且各走不同協定，閘道器就變成必要元件；而若判斷可容忍數秒延遲，邊緣運算又可以省略。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q026",
    subjectId: "aiot-junior-basics",
    prompt:
      "以 1 Mbps 的鏈路傳送 2 MB 的檔案，不計協定額外負擔時，理論傳輸時間最接近下列何者？",
    choices: [
      { id: "A", text: "約 2 秒" },
      { id: "B", text: "約 0.5 秒" },
      { id: "C", text: "約 128 秒" },
      { id: "D", text: "約 16 秒" },
    ],
    answer: "D",
    explanation:
      "傳輸時間 = 資料量 / 資料率。2 MB = 16 Mb（1 位元組 = 8 位元），除以 1 Mbps 得 16 秒。位元組與位元的換算是這類題最常出錯的地方。",
    choiceExplanations: {
      A: "2 秒是把 2 MB 直接除以 1 Mbps，漏掉了位元組轉位元的 8 倍。",
      B: "0.5 秒比正確值小 32 倍，方向與量級都不對。",
      C: "128 秒等於多乘了一次 8，把換算做了兩遍。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["傳輸時間", "頻寬", "位元與位元組"],
      constraints: ["bandwidth", "data_volume"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若把鏈路換成 10 Mbps，時間降為約 1.6 秒；但實際傳輸還要加上協定額外負擔與重傳，實測值一定大於理論值。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q027",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠區導入案要盤點各元件的職責歸屬。已知現場有 RFID 讀取器、把 Zigbee 轉成 TCP/IP 的閘道器、以及提供報表的網頁系統。若依物聯網三層架構歸類，下列對應何者正確？",
    choices: [
      { id: "A", text: "RFID 讀取器屬網路層、閘道器屬感知層、報表系統屬應用層" },
      { id: "B", text: "三者都屬於感知層，只是功能不同" },
      { id: "C", text: "RFID 讀取器屬感知層、閘道器屬網路層、報表系統屬應用層" },
      { id: "D", text: "閘道器屬應用層，因為它決定資料要送到哪個系統" },
    ],
    answer: "C",
    explanation:
      "歸類的依據是「這個元件解決哪一層的問題」：RFID 讀取器把物理世界的標籤轉成訊號（感知層）、閘道器讓異質網路互通（網路層）、報表系統面向使用者與商業邏輯（應用層）。",
    choiceExplanations: {
      A: "兩者的層級被對調——讀取器直接接觸物理世界，屬感知層；閘道器處理的是網路之間的轉換。",
      B: "若三者都在感知層，就不需要分層架構了；閘道器與報表系統都不直接量測物理量。",
      D: "閘道器雖然涉及轉送目的地，但它處理的是協定與網路層次的轉換，不承載商業邏輯。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["感知層", "網路層", "應用層", "Gateway"],
      constraints: ["heterogeneous_protocols", "system_mapping"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若閘道器上另外執行了推論並直接下達控制指令，它同時扮演邊緣運算角色，但就分層職責而言仍以網路層的協定轉換為主。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q028",
    subjectId: "aiot-junior-basics",
    prompt:
      "某物流倉儲原以有線乙太網路連接固定式讀取器。若改為讓堆高機在移動中即時回報位置與貨況，架構上最需要調整的是下列何者？",
    choices: [
      { id: "A", text: "提高應用層儀表板的更新頻率" },
      { id: "B", text: "把資料庫從關聯式換成時間序列" },
      { id: "C", text: "增加後端伺服器的硬碟容量" },
      { id: "D", text: "改用支援移動性的無線接取，並處理漫遊時的連線中斷" },
    ],
    answer: "D",
    explanation:
      "新增的限制是「移動性」。固定佈線無法跟著堆高機走，因此接取方式必須換成無線，並額外處理跨接取點漫遊時的斷線與重連，否則資料會出現空窗。",
    choiceExplanations: {
      A: "儀表板更新再快，前提仍是資料要能持續送達。",
      B: "時間序列資料庫確實適合這類回報資料，但那是儲存層的最佳化，解決不了「車在動、線接不上」的問題。",
      C: "硬碟容量關係到能存多久，與移動中的連線穩定性無關。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["移動性", "無線接取", "漫遊"],
      constraints: ["mobility", "reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Correct in Different Context",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若堆高機改為只在固定充電站停靠時回報，移動性限制消失，有線或定點無線都可行，架構就不必為漫遊付出複雜度。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q029",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於「端、邊、雲」的職責分工，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "端負責取得與初步處理，邊負責就近即時判斷，雲負責集中分析與長期保存" },
      { id: "B", text: "端負責集中分析，邊負責長期保存，雲負責取得資料" },
      { id: "C", text: "三者職責相同，只是硬體規格不同" },
      { id: "D", text: "有了雲之後，端與邊都不需要運算能力" },
    ],
    answer: "A",
    explanation:
      "分工的依據是「離資料多近」與「資源多充足」：端最近但最受限，雲最遠但資源最足，邊在兩者之間補上即時性。三者是互補而非取代關係。",
    choiceExplanations: {
      B: "三者的職責被打亂，取得資料的必然是最靠近物理世界的端。",
      C: "若職責相同就不需要分成三層，分層的意義正是各自承擔不同任務。",
      D: "端與邊仍需運算以完成前處理與即時反應，否則延遲與頻寬問題會回頭吃掉雲端的優勢。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Architecture",
      concepts: ["端邊雲", "分層架構"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若應用完全不要求即時性（例如每月盤點），邊這一層可以省略，端直接把資料送雲即可——邊的必要性來自延遲與頻寬的壓力。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q030",
    subjectId: "aiot-junior-basics",
    prompt:
      "某系統的資料鏈路為「感測器 → MCU → 閘道器 → 網路 → Broker → 資料庫 → 應用」。若應用端顯示的溫度單位錯誤（攝氏被當成華氏），最應優先檢查的是下列何者？",
    choices: [
      { id: "A", text: "各環節對資料格式與單位的約定是否一致" },
      { id: "B", text: "感測器的供電是否穩定" },
      { id: "C", text: "Broker 的連線數是否達到上限" },
      { id: "D", text: "資料庫的磁碟是否已滿" },
    ],
    answer: "A",
    explanation:
      "資料能一路抵達應用端，代表鏈路本身是通的，錯的是「怎麼解讀」。單位屬於介面契約的一部分，任一環節的約定不同就會產生這種數值合理卻語意錯誤的問題。",
    choiceExplanations: {
      B: "供電不穩會造成讀值跳動或裝置離線，症狀不會是單位被系統性誤解。",
      C: "連線數達上限會讓新連線被拒，已連上的資料不會因此換算錯誤。",
      D: "磁碟滿會導致寫入失敗，表現為資料缺漏而非單位錯誤。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["介面契約", "資料格式", "端到端鏈路"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若症狀改成「資料完全沒有進來」，檢查順序就要回到最底層的供電與連線，而不是單位約定。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q031",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於「Ambient IoT」的敘述，何者最正確？",
    choices: [
      { id: "A", text: "以高頻寬傳輸影像為主要應用" },
      { id: "B", text: "以環境能量採集或無線供電運作，目標是免除電池更換" },
      { id: "C", text: "專指部署在雲端機房內的伺服器叢集" },
      { id: "D", text: "必須依賴市電供應才能運作" },
    ],
    answer: "B",
    explanation:
      "Ambient IoT 的核心是「不用電池」：靠光、振動、射頻等環境能量或無線供電維持超低功耗運作，適合大量、長期、難以更換電池的標籤與感測應用。",
    choiceExplanations: {
      A: "能量採集所能提供的功率極小，只夠支撐極低資料率的間歇回報，與高頻寬影像相反。",
      C: "它描述的是端側裝置的供電方式，與雲端機房無關。",
      D: "依賴市電正是它要擺脫的限制，敘述與定義相反。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Ambient IoT", "能量採集"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若應用需要持續回傳高頻資料，能量採集的功率預算撐不住，還是得回到電池或市電供電的設計。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q032",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工廠評估把「品質判定」放在閘道器或雲端執行。已知產線節拍為每 2 秒一件、判定須在下一件到達前完成，且廠區對外頻寬有限、每件影像 3 MB。下列判斷何者最合理？",
    choices: [
      { id: "A", text: "應改為離線批次判定以節省成本" },
      { id: "B", text: "應放在雲端執行，因為雲端運算資源較充足" },
      { id: "C", text: "應放在閘道器端執行，雲端無法同時滿足節拍與頻寬限制" },
      { id: "D", text: "兩者皆可，差別僅在維運習慣" },
    ],
    answer: "C",
    explanation:
      "每 2 秒 3 MB 意味著持續約 12 Mbps 的上行，加上來回延遲必須壓在 2 秒內完成——兩個限制同時把雲端排除。就近在閘道器判定既省頻寬也保得住節拍。",
    choiceExplanations: {
      A: "離線批次雖然省錢，但不良品在判定出來之前早已流到下一站，失去即時攔截的意義。",
      B: "運算資源確實較充足，但題目的瓶頸是頻寬與延遲，不是算力；把充足資源當成萬用理由正是常見的誤判。",
      D: "在明確的節拍與頻寬限制下，兩者並非等價，說成習慣問題等於忽略了工程約束。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["邊緣運算", "雲端運算", "節拍", "頻寬"],
      constraints: ["latency", "bandwidth", "real_time_requirement"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Correct in Different Context",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若改為每小時抽驗一件、且廠區有專線，雲端判定會更划算：模型集中維護、可用更大的模型提升準確度。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q033",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 OSI 模型與 TCP/IP 模型的對應，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "TCP/IP 的連結層對應 OSI 的資料連結層與實體層" },
      { id: "B", text: "TCP/IP 的網際層對應 OSI 的網路層" },
      { id: "C", text: "TCP/IP 共有七層，與 OSI 完全一一對應" },
      { id: "D", text: "TCP/IP 的應用層大致對應 OSI 的應用層、表達層與會話層" },
    ],
    answer: "C",
    explanation:
      "TCP/IP 是四層模型（應用、傳輸、網際、連結），把 OSI 上三層併為應用層、下兩層併為連結層。說它有七層且一一對應，等於把兩個模型混為一談。",
    choiceExplanations: {
      A: "TCP/IP 的連結層涵蓋了訊框與實體傳輸兩個層次，敘述正確。",
      B: "兩者在這一層的職責完全相同，都是以 IP 進行定址與繞送，敘述正確。",
      D: "OSI 的上三層在 TCP/IP 中確實合併為單一應用層，敘述正確。",
    },
    topic: "A2.1 物聯網架構與功能",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["OSI", "TCP/IP", "分層對應"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若題目問的是「哪一個模型在實務網路中被實際實作」，答案是 TCP/IP；OSI 主要作為教學與討論的參考框架。",
    },
  },

  // ── A2.2 常見通訊協定與網路層技術（12 題）─────────────────────
  {
    id: "aiot-junior-basics-practice-q034",
    subjectId: "aiot-junior-basics",
    prompt:
      "某監控系統要把即時影像串流到值班室，可容忍偶爾的畫面破格，但不能接受畫面愈拖愈慢。傳輸層協定應如何選擇？",
    choices: [
      { id: "A", text: "選 UDP，避免重傳造成延遲累積" },
      { id: "B", text: "選 TCP，確保每一格畫面都完整送達" },
      { id: "C", text: "選 TCP 並開啟最高等級的重傳機制" },
      { id: "D", text: "兩者皆可，因為影像編碼會自動修補" },
    ],
    answer: "A",
    explanation:
      "即時串流的敵人是延遲累積：TCP 為了補回遺失的封包會等待與重傳，畫面因此愈拖愈慢。UDP 丟了就丟了，換來的是穩定的時間軸——「寧可破格也不要延遲」正是這個取捨。",
    choiceExplanations: {
      B: "確保完整送達在檔案傳輸上是優點，但在即時串流會把丟包轉換成延遲，恰好違反題目的要求。",
      C: "加強重傳會讓延遲問題更嚴重，方向與需求相反。",
      D: "編碼可以掩飾少量丟包，但無法消除 TCP 重傳造成的延遲，兩者並非等價。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["TCP", "UDP", "即時串流"],
      constraints: ["latency", "reliability", "real_time_requirement"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若需求改成「把錄影檔完整下載回總部存證」，完整性壓倒即時性，TCP 就成為唯一合理的選擇。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q035",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 MQTT 的 QoS 等級，下列敘述何者正確？",
    choices: [
      { id: "A", text: "QoS 1 保證至少送達一次，接收端可能收到重複訊息" },
      { id: "B", text: "QoS 1 保證剛好送達一次，不會重複" },
      { id: "C", text: "QoS 0 保證送達但不保證順序" },
      { id: "D", text: "QoS 2 不保證送達，僅盡力而為" },
    ],
    answer: "A",
    explanation:
      "三個等級分別是：QoS 0 最多一次（可能遺失）、QoS 1 至少一次（可能重複）、QoS 2 剛好一次（成本最高）。等級越高保證越強，往返確認的成本也越高。",
    choiceExplanations: {
      B: "剛好一次是 QoS 2 的語意，QoS 1 的代價正是可能重複。",
      C: "QoS 0 連送達都不保證，說它保證送達與定義相反。",
      D: "盡力而為描述的是 QoS 0，QoS 2 反而是保證最強的等級。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["MQTT", "QoS"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若應用是每秒回報一次的溫度且偶爾遺失無妨，QoS 0 反而最合適——省下確認往返，也降低電池裝置的功耗。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q036",
    subjectId: "aiot-junior-basics",
    prompt:
      "某系統原以 HTTP 讓 500 台裝置每 30 秒輪詢一次伺服器取得設定。改用 MQTT 之後最直接的效益是下列何者？",
    choices: [
      { id: "A", text: "裝置的運算能力可以降低一半" },
      { id: "B", text: "設定變更時由伺服器主動推送，免除大量無效輪詢" },
      { id: "C", text: "傳輸內容自動獲得加密保護" },
      { id: "D", text: "感測器的量測精度提升" },
    ],
    answer: "B",
    explanation:
      "輪詢的浪費在於「絕大多數次都沒有變更」。MQTT 的發布訂閱讓伺服器在有變更時才推送，500 台裝置的無效請求因此消失，頻寬與功耗同步下降。",
    choiceExplanations: {
      A: "協定改變不會改變裝置需要多少運算能力，兩者沒有因果關係。",
      C: "MQTT 本身不含加密，要靠 TLS 提供；把安全性視為協定自帶是常見誤解。",
      D: "量測精度由感測器硬體與 ADC 決定，與資料怎麼傳無關。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["MQTT", "HTTP", "發布訂閱", "輪詢"],
      constraints: ["bandwidth", "power", "scalability"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若情境改成「後台系統偶爾查詢一次裝置清單」，HTTP 的請求回應模型反而更簡單直接，不需要為此維運一個 Broker。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q037",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於 LoRa 與 LoRaWAN 的敘述，何者正確？",
    choices: [
      { id: "A", text: "LoRa 是實體層的調變技術，LoRaWAN 是其上的網路與存取架構" },
      { id: "B", text: "LoRa 是網路架構，LoRaWAN 是調變技術" },
      { id: "C", text: "兩者是同一件事的不同商標" },
      { id: "D", text: "兩者都屬於應用層協定" },
    ],
    answer: "A",
    explanation:
      "LoRa 解決的是「訊號怎麼在空中傳」，LoRaWAN 解決的是「裝置如何入網、如何定址、如何管理」。兩者是上下層關係，常被混用但職責完全不同。",
    choiceExplanations: {
      B: "兩者的層級被對調，是這一組最常見的混淆。",
      C: "若是同一件事，就不會有「用 LoRa 調變但不跑 LoRaWAN」的私有網路方案。",
      D: "兩者都在實體層與 MAC／網路層，與應用層無關。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["LoRa", "LoRaWAN"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若只需要兩台裝置點對點傳資料、不需要入網管理，可以只用 LoRa 而不導入 LoRaWAN，省下伺服器與網路管理的複雜度。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q038",
    subjectId: "aiot-junior-basics",
    prompt:
      "某智慧家庭方案要讓不同品牌的門鎖、燈具與感測器互通，且使用者不希望為每個品牌各裝一個 App。下列技術何者最直接對應此需求？",
    choices: [
      { id: "A", text: "Wi-Fi 6" },
      { id: "B", text: "Matter" },
      { id: "C", text: "Zigbee" },
      { id: "D", text: "MQTT" },
    ],
    answer: "B",
    explanation:
      "需求是「跨品牌互通」，這是應用層的互通標準要解決的問題。Matter 定義了裝置類型與行為的共同語言，使不同品牌能在同一個生態中被辨識與控制。",
    choiceExplanations: {
      A: "Wi-Fi 6 是接取技術，只保證「連得上」，不保證「聽得懂」。",
      C: "Zigbee 提供的是低功耗的無線承載，同樣走 Zigbee 的兩個品牌仍可能各說各話。",
      D: "MQTT 是訊息傳輸協定，本身不定義裝置的能力模型，跨品牌仍需另訂主題與酬載格式。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["Matter", "Zigbee", "Wi-Fi", "MQTT"],
      constraints: ["interoperability", "usability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若情境改為「同一品牌的大量感測器要在住宅內組成低功耗網狀網路」，Zigbee 或 Thread 這類承載技術才是選型重點，互通標準反而不是關鍵。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q039",
    subjectId: "aiot-junior-basics",
    prompt:
      "某穿戴裝置需與手機在數公尺內同步心率資料，每次僅數十位元組，且要求電池續航達數週。下列通訊技術何者最適合？",
    choices: [
      { id: "A", text: "Wi-Fi" },
      { id: "B", text: "藍牙低功耗" },
      { id: "C", text: "LoRaWAN" },
      { id: "D", text: "NFC" },
    ],
    answer: "B",
    explanation:
      "三個限制：短距離、極小酬載、數週續航。藍牙低功耗正是為這種間歇性小資料量的個人裝置設計，且手機原生支援不需額外閘道。",
    choiceExplanations: {
      A: "Wi-Fi 頻寬遠超需求，但持續連線的功耗會讓數週續航難以達成。",
      C: "LoRaWAN 適合公里級的廣域回報，用在數公尺的個人裝置上不但過度設計，還需要額外的網路基礎設施。",
      D: "NFC 的作用距離僅公分級且為觸碰式互動，無法持續同步資料。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["BLE", "Wi-Fi", "LoRaWAN", "NFC"],
      constraints: ["range", "power", "data_rate"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若改成「在 3 公里外的田間每 10 分鐘回報一次」，同樣是小酬載低功耗，答案卻會換成 LoRaWAN——距離這一個條件就足以翻轉選型。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q040",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 5G RedCap（NR-Light），下列敘述何者最正確？",
    choices: [
      { id: "A", text: "只能用於固定式設備，不支援移動" },
      { id: "B", text: "是專為超低功耗、極低資料率設計的窄頻技術" },
      { id: "C", text: "是不需電信網路的自組網技術" },
      { id: "D", text: "為需求介於 NB-IoT 與完整 5G 之間的中階裝置提供精簡型規格" },
    ],
    answer: "D",
    explanation:
      "RedCap 針對的是工業相機、穿戴與監控這類「NB-IoT 太慢、完整 5G 太貴太耗電」的中間地帶，以精簡的終端規格降低成本與功耗。",
    choiceExplanations: {
      A: "作為蜂巢式技術，它天生支援移動與換手，這正是它相對於 Wi-Fi 的優勢之一。",
      B: "超低功耗、極低資料率描述的是 NB-IoT，RedCap 的資料率明顯高於它。",
      C: "RedCap 屬於 3GPP 標準，仍運行在電信業者的網路上，不是自組網。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["5G RedCap", "NB-IoT", "5G"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若裝置只需每小時回報數十位元組且要用五年電池，NB-IoT 仍然更划算；RedCap 的價值要在資料率需求上升時才顯現。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q041",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 MQTT 系統中，新加入的訂閱者必須立刻取得該主題「最後一次已知的狀態」，而不是等到下次發布。下列機制何者最直接對應此需求？",
    choices: [
      { id: "A", text: "提高 QoS 至 2" },
      { id: "B", text: "Last Will and Testament" },
      { id: "C", text: "Retained Message" },
      { id: "D", text: "縮短 Keepalive 間隔" },
    ],
    answer: "C",
    explanation:
      "保留訊息讓 Broker 為每個主題留住最後一則，新訂閱者一連上就立刻收到當前狀態，不必空等下一次發布。這對狀態型資料（例如開關位置）特別重要。",
    choiceExplanations: {
      A: "QoS 管的是單次傳遞的可靠度，不會讓 Broker 保存歷史訊息給未來的訂閱者。",
      B: "遺言訊息是在用戶端非預期斷線時由 Broker 代為發布，用途是通知離線而非提供當前狀態。",
      D: "Keepalive 決定多久判定連線中斷，與新訂閱者能否取得既有狀態無關。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["MQTT", "Retain", "Last Will", "QoS"],
      constraints: ["state_availability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求改成「裝置突然斷線時要讓後台立刻知道」，答案就換成 Last Will——兩者一個管「新訂閱者的第一則」，一個管「發布者的最後一則」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q042",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 CoAP 與 HTTP 的比較，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "CoAP 為受限裝置設計，酬載與標頭較精簡" },
      { id: "B", text: "CoAP 常運行於 UDP 之上，HTTP 則運行於 TCP" },
      { id: "C", text: "兩者都採用請求／回應的互動模型" },
      { id: "D", text: "CoAP 因為輕量，所以不支援任何可靠傳輸機制" },
    ],
    answer: "D",
    explanation:
      "CoAP 雖跑在 UDP 上，仍以確認訊息（Confirmable）提供可選的可靠傳遞。把「輕量」等同於「毫無保證」是常見的過度推論。",
    choiceExplanations: {
      A: "精簡標頭正是 CoAP 為受限裝置所做的設計，敘述正確。",
      B: "這是兩者在傳輸層上的標準差異，敘述正確。",
      C: "CoAP 刻意沿用類似 HTTP 的方法與資源模型，敘述正確。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["CoAP", "HTTP", "UDP"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 D 改成「CoAP 的可靠傳遞由自身的確認機制提供，而非由傳輸層保證」，它就會變成正確敘述。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q043",
    subjectId: "aiot-junior-basics",
    prompt:
      "某戶外空品監測站原使用 LoRaWAN 每 15 分鐘回報一次數值。若需求改為「即時回傳現場高解析影像供人工判讀」，通訊選型應如何調整？",
    choices: [
      { id: "A", text: "改用 NFC 以避免干擾" },
      { id: "B", text: "維持 LoRaWAN，只需提高展頻因子" },
      { id: "C", text: "改用 4G/5G 或 Wi-Fi 等高頻寬技術，並重新評估供電方式" },
      { id: "D", text: "維持 LoRaWAN，改為壓縮影像後傳送" },
    ],
    answer: "C",
    explanation:
      "需求從「每 15 分鐘幾十位元組」跳到「即時高解析影像」，資料量差了好幾個數量級。LoRaWAN 的資料率天生無法承載，必須換到高頻寬技術，同時因為功耗上升而重新評估供電。",
    choiceExplanations: {
      A: "NFC 只有公分級作用距離，完全不適用於戶外監測站。",
      B: "提高展頻因子會換來更遠距離但更低的資料率，與需求方向完全相反。",
      D: "壓縮能減少資料量，但高解析影像即使壓縮後仍遠超 LoRaWAN 的承載能力，且壓縮會犧牲判讀所需的細節。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["LoRaWAN", "4G/5G", "Wi-Fi", "頻寬"],
      constraints: ["bandwidth", "power", "real_time_requirement"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若折衷為「僅在偵測到異常時上傳一張低解析縮圖」，資料量大幅下降，NB-IoT 或 RedCap 這類中階技術就可能足夠，不必跳到 5G。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q044",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠區 MQTT 系統中，一台感測器的資料在後台時有時無。已知該裝置可 ping 通、Broker 服務正常、其他同型裝置皆正常。下列檢查順序何者最有效率？",
    choices: [
      { id: "A", text: "先重裝 Broker，再檢查資料庫索引" },
      { id: "B", text: "先更換後台伺服器，再檢查應用程式介面" },
      { id: "C", text: "先查該裝置的無線訊號品質與重連紀錄，再查其發布主題與 QoS 設定" },
      { id: "D", text: "先調整儀表板的更新頻率，再檢查感測器規格" },
    ],
    answer: "C",
    explanation:
      "「同型裝置正常、只有這台時好時壞」把問題範圍縮到該裝置本身與它的鏈路。無線品質不穩會造成間歇性斷線，QoS 0 又不重送——兩者都能解釋「時有時無」，且檢查成本最低。",
    choiceExplanations: {
      A: "Broker 服務正常且其他裝置都收得到，重裝它既無根據又會影響全廠。",
      B: "後台若有問題，所有裝置都會受影響，與「只有一台異常」的症狀不符。",
      D: "儀表板更新頻率只影響顯示，不會造成資料本身時有時無。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["MQTT", "QoS", "無線品質", "排錯順序"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若症狀改為「全廠裝置同時都收不到」，範圍就從單一裝置擴大到共用元件，此時優先檢查 Broker、網路核心與認證設定才合理。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q045",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 MQTT，下列「甲、乙、丙、丁」四項敘述中，哪幾項正確？甲：採發布訂閱模型；乙：通常需要 Broker 轉送；丙：屬於 OSI 傳輸層協定；丁：QoS 1 保證剛好送達一次。",
    choices: [
      { id: "A", text: "乙、丙、丁" },
      { id: "B", text: "甲、乙、丙" },
      { id: "C", text: "甲、丙、丁" },
      { id: "D", text: "甲、乙" },
    ],
    answer: "D",
    explanation:
      "甲與乙是 MQTT 的核心特徵。丙錯——MQTT 是應用層協定，跑在傳輸層的 TCP 之上；丁錯——剛好一次是 QoS 2，QoS 1 為至少一次、可能重複。",
    choiceExplanations: {
      A: "同時包含丙與丁兩個錯誤敘述，且漏掉了最基本的甲。",
      B: "多納入了丙，把應用層協定誤放到傳輸層，是層級混淆。",
      C: "包含丙與丁兩個錯誤，僅甲正確。",
    },
    topic: "A2.2 常見通訊協定與網路層技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Multi-Statement",
      concepts: ["MQTT", "OSI", "QoS", "Broker"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若把丙改成「MQTT 通常以 TCP 作為傳輸層」，它就成立了；差別只在於把 MQTT 自己的層級與它所依賴的層級搞混。",
    },
  },

  // ── A2.3 工業通訊標準與資訊模型（11 題）───────────────────────
  {
    id: "aiot-junior-basics-practice-q046",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工廠有三個品牌的 PLC，上層 MES 需取得各機台的轉速、狀態與溫度，且希望不必為每台機器各寫一套對照表。下列技術何者最直接對應此需求？",
    choices: [
      { id: "A", text: "OPC UA" },
      { id: "B", text: "Modbus RTU" },
      { id: "C", text: "MQTT" },
      { id: "D", text: "HTTP" },
    ],
    answer: "A",
    explanation:
      "痛點在於「每台機器的資料代表什麼都不一樣」。OPC UA 除了通訊之外還帶資訊模型與語意，讓 Spindle 的 Speed、State、Temperature 有共同的表達方式，上層因此不必逐台維護對照。",
    choiceExplanations: {
      B: "Modbus 以暫存器位址存取，位址對應什麼意義完全由廠商自訂，正是造成逐台對照的原因。",
      C: "MQTT 負責把訊息送到，但不規定酬載長什麼樣，三個品牌仍可能各送各的格式。",
      D: "HTTP 同樣只是傳輸方式，不提供工業設備的資料模型。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["OPC UA", "Modbus", "MQTT", "資訊模型"],
      constraints: ["interoperability", "heterogeneous_vendors"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若全廠只有一款 PLC、且只需讀少數幾個暫存器，Modbus 反而更輕便——OPC UA 的價值來自異質整合，單一品牌時它的複雜度不划算。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q047",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於「通訊協定」與「資訊模型」的區別，何者最正確？",
    choices: [
      { id: "A", text: "協定規範資料的意義，資訊模型規範傳輸方式" },
      { id: "B", text: "協定規範資料怎麼傳，資訊模型規範資料代表什麼意義" },
      { id: "C", text: "兩者是同一件事，只是不同文件的用語" },
      { id: "D", text: "資訊模型只存在於雲端，與現場設備無關" },
    ],
    answer: "B",
    explanation:
      "這是本節點最核心的分野。同樣一個數值 55，協定保證它能正確送達，資訊模型才回答「這是主軸轉速、單位是 rpm、屬於哪一台機器」。缺了後者，資料再多也難以自動化利用。",
    choiceExplanations: {
      A: "兩者的職責被完全對調。",
      C: "若是同一件事，MQTT 就不需要額外搭配 Sparkplug B 來補上資料模型。",
      D: "OPC UA 的資訊模型正是由現場的伺服器對外揭露，起點在設備端而非雲端。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["通訊協定", "資訊模型", "語意"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若整合對象只有一種設備且欄位固定不變，資訊模型的價值會被低估；設備種類一多，缺少模型的維護成本立刻浮現。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q048",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠已用 MQTT 把資料送到後台，但發現各邊緣程式送出的主題命名與酬載格式各不相同，後台得為每一支程式寫解析。下列補強何者最直接？",
    choices: [
      { id: "A", text: "改用更高效能的 Broker" },
      { id: "B", text: "導入 Sparkplug B，為主題命名與酬載定義統一規範" },
      { id: "C", text: "把 QoS 從 0 提高到 2" },
      { id: "D", text: "為每支程式增加重試次數" },
    ],
    answer: "B",
    explanation:
      "問題不在「送不到」而在「送到了卻各說各話」。Sparkplug B 正是為 MQTT 補上資料模型、狀態管理與標準化主題命名空間的規範，讓後台能以一致方式解析。",
    choiceExplanations: {
      A: "效能不是瓶頸——訊息都有送達，只是格式不一致。",
      C: "QoS 提升的是送達保證，酬載格式混亂的問題完全不會因此改善。",
      D: "重試處理的是失敗傳輸，與格式規範無關。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["Sparkplug B", "MQTT", "命名空間"],
      constraints: ["interoperability", "maintainability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若全廠只有一支邊緣程式、格式由同一個團隊維護，額外導入 Sparkplug B 的規範成本可能高於它帶來的一致性效益。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q049",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工具機廠要蒐集各機台的主軸轉速、運轉狀態與刀具資訊，並希望採用製造業已有共識的資料標準，讓上層監控系統不必為每台機器各寫解析。下列標準何者最直接對應此需求？",
    choices: [
      { id: "A", text: "Matter" },
      { id: "B", text: "Modbus RTU" },
      { id: "C", text: "HTTP" },
      { id: "D", text: "MTConnect" },
    ],
    answer: "D",
    explanation:
      "需求是「工具機的資料要有共同的表達方式」。MTConnect 以 XML 定義製造設備的資料語意，透過 Adapter 與 Agent 對外提供，正是為工具機監控而生的標準。",
    choiceExplanations: {
      A: "Matter 解決的是智慧家庭裝置的跨品牌互通，應用領域與製造設備完全不同。",
      B: "Modbus 以暫存器位址存取，位址代表什麼由廠商自訂，正是造成逐台解析的原因。",
      C: "HTTP 只是傳輸方式，不定義主軸轉速這類欄位的語意，各廠仍可各送各的格式。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["MTConnect", "Modbus", "資料語意"],
      constraints: ["interoperability", "maintainability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若整合對象是流程工業的儀控設備而非工具機，OPC UA 的涵蓋面通常比 MTConnect 更合適。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q050",
    subjectId: "aiot-junior-basics",
    prompt:
      "某產線要在乙太網路上同時承載「毫秒級的運動控制」與「一般的監控資料」，且控制訊號不得因監控流量而延遲。下列技術何者最直接對應此需求？",
    choices: [
      { id: "A", text: "提高交換器的埠速率至 10 Gbps" },
      { id: "B", text: "為監控資料增加壓縮" },
      { id: "C", text: "把監控資料改以 UDP 傳送" },
      { id: "D", text: "時效性網路（TSN）" },
    ],
    answer: "D",
    explanation:
      "需求是「確定性」而不只是「夠快」。TSN 在標準乙太網路上以時間感知排程為關鍵流量保留傳輸窗，使控制訊號的延遲上限可被保證，而不受其他流量影響。",
    choiceExplanations: {
      A: "更高的頻寬能降低平均延遲，但突發流量仍可能造成排隊抖動，無法保證最壞情況。",
      B: "壓縮減少了資料量，仍然沒有為控制訊號建立任何優先保證。",
      C: "換成 UDP 只是去掉重傳，監控流量照樣與控制訊號競爭同一條鏈路。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["TSN", "確定性延遲", "乙太網路"],
      constraints: ["latency", "determinism", "mixed_traffic"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若控制與監控本來就走實體隔離的兩張網路，確定性由隔離提供，就不需要 TSN 的排程機制。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q051",
    subjectId: "aiot-junior-basics",
    prompt:
      "在 OPC UA 中，若用戶端希望在「設備發生故障警報」時被動收到通知，應使用下列哪一種存取方式？",
    choices: [
      { id: "A", text: "事件通知（Event Notification）" },
      { id: "B", text: "讀寫變數（Read/Write Variable）" },
      { id: "C", text: "呼叫方法（Invoke Method）" },
      { id: "D", text: "瀏覽位址空間（Browse）" },
    ],
    answer: "A",
    explanation:
      "「被動收到特定事件」對應的是事件訂閱：用戶端登記感興趣的事件類型，伺服器在事件發生時主動推送通知，不必反覆詢問。",
    choiceExplanations: {
      B: "讀寫變數是主動去取某個節點的當前值，屬於拉取模式。",
      C: "呼叫方法是要求伺服器執行某個動作並回傳結果，同樣由用戶端發起。",
      D: "瀏覽位址空間是探索伺服器有哪些節點，屬於一次性的查詢動作。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["OPC UA", "事件通知", "訂閱"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求改成「只要數值一變就通知」而非「特定事件發生」，對應的機制會是資料變更通知（Data Change Notification）。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q052",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於工業場域中 OPC UA 與 MQTT 的分工，下列敘述何者最符合目前實務？",
    choices: [
      { id: "A", text: "MQTT 負責機台的資訊模型，OPC UA 負責雲端傳輸" },
      { id: "B", text: "兩者互斥，導入其一就不應使用另一個" },
      { id: "C", text: "機台側以 OPC UA 取得具語意的資料，廠級事件流以 MQTT 發布訂閱" },
      { id: "D", text: "OPC UA 已完全取代 MQTT，後者不再使用" },
    ],
    answer: "C",
    explanation:
      "兩者解決不同層次的問題，實務上經常並存：OPC UA 擅長把機台資料變得有語意，MQTT 擅長把事件輕量地散布到全廠與雲端，中間由邊緣閘道銜接。",
    choiceExplanations: {
      A: "兩者的角色被對調——資訊模型是 OPC UA 的強項，MQTT 本身不含模型。",
      B: "互斥的說法忽略了它們的職責差異，混合架構才是常見做法。",
      D: "MQTT 在雲端與跨廠傳輸上的輕量優勢仍無可取代，沒有被取代的跡象。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["OPC UA", "MQTT", "架構分工"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "A2.4",
      decisionBoundary:
        "若整套系統只在單一機台上運作、沒有跨廠散布的需求，只用 OPC UA 就夠，不必再疊一層訊息中介。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q053",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 ISA-95，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "規範感測器的電氣接腳定義" },
      { id: "B", text: "是一種工業無線通訊協定" },
      { id: "C", text: "定義企業與控制系統整合的分層參考模型，用於界定各層系統的職責" },
      { id: "D", text: "是雲端服務的計費標準" },
    ],
    answer: "C",
    explanation:
      "ISA-95 把從現場控制到企業規劃分成數個層級，讓 SCADA、MES、ERP 各自的職責與介面有共同的討論框架，是規劃工廠資訊架構時的參考。",
    choiceExplanations: {
      A: "接腳與電氣特性由感測器或匯流排規格定義，與 ISA-95 無關。",
      B: "它不定義任何實體傳輸或無線調變方式。",
      D: "它是架構參考模型，與商業計費完全無關。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["ISA-95", "分層模型", "MES"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若討論的是「資料如何在兩台機器之間傳」，該引用的是 OPC UA 或 Modbus 這類通訊標準，而非 ISA-95 這種組織層級的參考模型。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q054",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠導入 OPC UA 後，發現部分老舊 PLC 不支援。下列處理何者最務實？",
    choices: [
      { id: "A", text: "把老舊設備排除在資料收集範圍之外" },
      { id: "B", text: "要求所有老舊設備立即汰換為支援 OPC UA 的新機" },
      { id: "C", text: "放棄 OPC UA，全廠改回各自的私有協定" },
      { id: "D", text: "以閘道器把老舊設備的 Modbus 資料轉譯為 OPC UA 對外提供" },
    ],
    answer: "D",
    explanation:
      "閘道器的核心職責就是協定轉譯。以它把 Modbus 暫存器包裝成具語意的 OPC UA 節點，既保住了統一介面，又不必動到產線上的老設備。",
    choiceExplanations: {
      A: "排除老設備等於放棄了最可能需要監測的那一批資產。",
      B: "全面汰換能徹底解決問題，但成本與停機衝擊通常讓專案胎死腹中。",
      C: "退回私有協定會讓先前的整合成果全部作廢，問題反而擴大。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["OPC UA", "Modbus", "閘道器轉譯"],
      constraints: ["legacy_equipment", "cost", "interoperability"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "A2.1",
      decisionBoundary:
        "若老舊設備即將在半年內汰換，臨時架轉譯閘道的投入可能不划算，直接等新機到位反而簡單。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q055",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 OPC UA 的安全性，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "規範本身即納入認證、加密與簽章等安全機制" },
      { id: "B", text: "可在多種作業系統與硬體平台上實作" },
      { id: "C", text: "採用後即可完全免除工控網路的資安風險" },
      { id: "D", text: "支援用戶端／伺服器與發布訂閱兩種通訊模式" },
    ],
    answer: "C",
    explanation:
      "OPC UA 提供的是通訊層面的安全能力，但工控資安還牽涉裝置韌體、網段隔離、帳號權限與實體存取。把單一協定當成完整防護，是典型的過度推論。",
    choiceExplanations: {
      A: "安全機制內建於規範，正是 OPC UA 相對於舊式工業協定的重要優勢，敘述正確。",
      B: "跨平台是它擺脫 COM/DCOM 綁定後的特色，敘述正確。",
      D: "除了傳統的用戶端／伺服器，規範中也定義了 PubSub 模式，敘述正確。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["OPC UA", "工控資安"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若把選項 C 改成「OPC UA 可為機台通訊提供傳輸層的機密性與完整性保護」，它就會變成正確敘述。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q056",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工具機廠要建立「全廠即時資料匯流、各系統自行訂閱所需資料」的架構，避免系統之間兩兩串接。此架構樣式最接近下列何者？",
    choices: [
      { id: "A", text: "點對點的專用資料介面" },
      { id: "B", text: "統一命名空間（Unified Namespace）" },
      { id: "C", text: "每日一次的批次檔案交換" },
      { id: "D", text: "為每個系統各建一座資料倉儲" },
    ],
    answer: "B",
    explanation:
      "把 N×N 的兩兩串接改成 N 條「連到單一命名空間」，新增系統時只需訂閱既有主題而不必改動他人——這正是統一命名空間要解決的整合複雜度問題。",
    choiceExplanations: {
      A: "點對點介面正是題目要避免的做法，系統一多維護量會爆炸。",
      C: "批次檔案交換無法滿足即時匯流的需求，且同樣需要各自約定格式。",
      D: "各建一座倉儲會讓同一份資料被複製多次，一致性反而更難維持。",
    },
    topic: "A2.3 工業通訊標準與資訊模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["Unified Namespace", "系統整合", "發布訂閱"],
      constraints: ["scalability", "maintainability", "real_time_requirement"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若全廠只有兩套系統需要交換資料，直接點對點串接更簡單；統一命名空間的效益要在系統數量成長後才顯現。",
    },
  },

  // ── A2.4 中介軟體與平台（11 題）───────────────────────────────
  {
    id: "aiot-junior-basics-practice-q057",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台需求為「開發團隊只想寫應用程式與管理資料，不想維護作業系統與資料庫伺服器」。此需求最符合下列哪一種雲端服務模型？",
    choices: [
      { id: "A", text: "地端自建機房" },
      { id: "B", text: "平台即服務（PaaS）" },
      { id: "C", text: "軟體即服務（SaaS）" },
      { id: "D", text: "基礎架構即服務（IaaS）" },
    ],
    answer: "B",
    explanation:
      "PaaS 提供作業系統、執行環境與託管資料庫，團隊只需部署自己的程式與管理資料，正好落在「不想碰基礎設施、但仍要自己寫應用」的中間位置。",
    choiceExplanations: {
      A: "自建機房要負責的層次比 IaaS 更多，與「不想維護」的訴求完全相反。",
      C: "SaaS 是直接使用現成軟體，團隊連應用程式都不必寫，超出了題目描述的需求。",
      D: "IaaS 只提供運算與儲存資源，作業系統與資料庫仍須自行安裝與維護，與題意不符。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["PaaS", "IaaS", "SaaS"],
      constraints: ["maintainability", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若團隊需要對作業系統核心參數或特殊硬體驅動有完全控制權，PaaS 的封裝會變成阻礙，此時 IaaS 才合適。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q058",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台新接一套分析系統，要求「補齊過去 24 小時的所有感測訊息」。現行架構為裝置以 MQTT 發布至 Broker，Broker 轉送給既有的消費端。下列處置何者最直接？",
    choices: [
      { id: "A", text: "由歷史資料庫查詢並回補，或改用具持久化與重播能力的串流平台" },
      { id: "B", text: "把 Broker 的 Retain 打開，即可取回 24 小時的訊息" },
      { id: "C", text: "把 QoS 提高到 2，讓 Broker 保存所有訊息" },
      { id: "D", text: "延長 Broker 的 Keepalive 時間" },
    ],
    answer: "A",
    explanation:
      "Broker 是通道不是倉庫，訊息轉送後即不再保留。要回補歷史只能從已經落地的資料庫取，或改用本身具備持久化與重播能力的串流平台。",
    choiceExplanations: {
      B: "Retain 只保留每個主題的「最後一則」，用來讓新訂閱者知道當前狀態，無法回溯 24 小時。",
      C: "QoS 管的是單次傳遞的可靠度，不會讓 Broker 為未來的訂閱者保存歷史。",
      D: "Keepalive 決定多久判定連線中斷，與訊息保存完全無關。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["Broker", "Retain", "持久化", "重播"],
      constraints: ["data_recovery", "architecture"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若新系統只需要「知道每個裝置現在的狀態」而非完整歷史，打開 Retain 就足夠，不必動到儲存架構。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q059",
    subjectId: "aiot-junior-basics",
    prompt:
      "某系統以 REST API 提供裝置清單查詢。若要新增一台裝置，依 REST 慣例應使用哪一個 HTTP 方法？",
    choices: [
      { id: "A", text: "DELETE" },
      { id: "B", text: "GET" },
      { id: "C", text: "HEAD" },
      { id: "D", text: "POST" },
    ],
    answer: "D",
    explanation:
      "REST 以 HTTP 方法對應資源操作：POST 建立、GET 讀取、PUT/PATCH 更新、DELETE 刪除。GET 應為安全且冪等，不該產生副作用。",
    choiceExplanations: {
      A: "DELETE 是移除資源，與新增方向相反。",
      B: "GET 用於取得資源，依規範不應改變伺服器狀態。",
      C: "HEAD 只取回標頭而不含內容，用於檢查資源是否存在。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["REST", "HTTP 方法", "CRUD"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若操作改為「以指定 ID 覆寫整筆裝置設定」，慣例上會使用 PUT；POST 通常用於由伺服器決定新資源識別碼的情況。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q060",
    subjectId: "aiot-junior-basics",
    prompt:
      "某中介層需把三種格式的感測資料統一為一致的欄位與單位再送往後端。此職責最貼切的描述是下列何者？",
    choices: [
      { id: "A", text: "負載平衡" },
      { id: "B", text: "身分驗證" },
      { id: "C", text: "資料正規化" },
      { id: "D", text: "資料壓縮" },
    ],
    answer: "C",
    explanation:
      "把來源各異的資料轉換為共同的結構、命名與單位，讓後端只需面對單一格式，正是中介軟體「資料正規化」的職責。",
    choiceExplanations: {
      A: "負載平衡是把流量分散到多個實例以提升吞吐與可用性，與格式無關。",
      B: "身分驗證確認來源是誰，不改變資料的結構。",
      D: "壓縮只縮小體積，欄位與單位的不一致依然存在。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料正規化", "中介軟體"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若三種來源本來就使用同一份規範（例如都經 OPC UA 資訊模型輸出），正規化的工作在來源端就已完成，中介層不必再處理。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q061",
    subjectId: "aiot-junior-basics",
    prompt:
      "某平台原以關聯式資料庫保存每秒一筆的感測讀值，半年後查詢「某裝置最近一小時趨勢」變得極慢。下列調整何者最直接？",
    choices: [
      { id: "A", text: "把資料表的欄位數量減少" },
      { id: "B", text: "把應用程式改用另一種程式語言" },
      { id: "C", text: "改用時間序列資料庫並依時間分區" },
      { id: "D", text: "增加前端儀表板的快取時間" },
    ],
    answer: "C",
    explanation:
      "存取樣態是「大量寫入、依時間範圍查詢、幾乎不更新」，這正是時間序列資料庫的最佳化目標；搭配時間分區後，查詢只需掃描相關分區而非整張表。",
    choiceExplanations: {
      A: "減少欄位能省一點空間，但查詢慢的主因是要掃過半年份的資料列，不是欄位寬度。",
      B: "語言影響應用層效能，資料庫端的掃描成本不會因此改變。",
      D: "快取能讓重複查詢變快，但第一次查詢與新區間的查詢仍然一樣慢。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["時間序列資料庫", "分區", "查詢效能"],
      constraints: ["data_volume", "query_latency"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        D: "Partial Truth",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若查詢型態改為「跨裝置的關聯統計與交易一致性」，關聯式資料庫仍是較好的選擇——存取樣態才是選型的依據。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q062",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 IoT 平台的「裝置管理」功能，下列何者「不」屬於其典型範圍？",
    choices: [
      { id: "A", text: "決定感測器要採用哪一種量測原理" },
      { id: "B", text: "裝置上線狀態與心跳監控" },
      { id: "C", text: "裝置註冊、憑證配發與韌體更新管理" },
      { id: "D", text: "裝置分群與批次設定下發" },
    ],
    answer: "A",
    explanation:
      "量測原理是硬體選型的決定，發生在採購與設計階段。平台的裝置管理處理的是「已經存在的裝置如何被納管」——註冊、憑證、更新、監控與批次設定。",
    choiceExplanations: {
      B: "以心跳判斷裝置是否在線是平台的基本能力，屬於典型範圍。",
      C: "註冊、憑證與韌體更新是裝置生命週期管理的核心，屬於典型範圍。",
      D: "分群與批次下發是大量裝置維運的必要功能，屬於典型範圍。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["裝置管理", "平台功能"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若題目問的是「誰決定要用熱電偶還是熱敏電阻」，那是感測選型的範疇，與平台功能屬於不同階段的決策。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q063",
    subjectId: "aiot-junior-basics",
    prompt:
      "某團隊要以最少的程式碼把「MQTT 訊息 → 條件判斷 → 寫入資料庫 → 觸發通知」串起來，並讓非後端工程師也能維護。下列工具何者最合適？",
    choices: [
      { id: "A", text: "為每個步驟各寫一支獨立的微服務" },
      { id: "B", text: "以流程式整合工具（如 Node-RED）建立資料流" },
      { id: "C", text: "以組合語言撰寫常駐服務" },
      { id: "D", text: "以試算表手動複製貼上資料" },
    ],
    answer: "B",
    explanation:
      "需求是「串接既有元件」而非「開發複雜邏輯」，且維護者不一定是後端工程師。流程式工具以視覺化節點連接輸入、判斷與輸出，正好對應這種整合場景。",
    choiceExplanations: {
      A: "微服務適合需要獨立擴展與部署的複雜系統，對這種線性資料流而言是過度設計。",
      C: "組合語言的開發與維護成本極高，與「最少程式碼、易維護」的要求完全相反。",
      D: "手動作業無法即時、無法持續，也不具備任何自動化價值。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["Node-RED", "流程式整合", "低程式碼"],
      constraints: ["maintainability", "cost"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若流程逐漸長出複雜的商業邏輯、需要單元測試與版本控管，改寫成正式的服務程式碼會比繼續堆疊視覺化節點更好維護。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q064",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 LoRaWAN 節點每次上行酬載上限僅約 50 位元組，目前以 JSON 傳送含 6 個欄位的量測結果，經常超出上限而被截斷。下列調整何者最直接有效？",
    choices: [
      { id: "A", text: "把 JSON 的欄位名稱改成中文以增加可讀性" },
      { id: "B", text: "改用固定欄位順序的二進位編碼，於伺服器端還原欄位名稱" },
      { id: "C", text: "提高節點的發射功率" },
      { id: "D", text: "把回報間隔從 10 分鐘縮短為 1 分鐘" },
    ],
    answer: "B",
    explanation:
      "JSON 的成本在於每一筆都重複攜帶欄位名稱與符號。改成雙方約定順序的二進位編碼，同樣 6 個數值可能只需十餘位元組，欄位名稱由伺服器端依約定還原即可。",
    choiceExplanations: {
      A: "中文欄位名稱以 UTF-8 編碼後通常比英文更長，酬載會更大而非更小。",
      C: "發射功率影響傳輸距離與可靠度，不會改變單次酬載的長度上限。",
      D: "縮短間隔會讓總傳輸量與功耗上升，單次仍然超限，問題完全沒解決。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["JSON", "二進位編碼", "酬載上限"],
      constraints: ["payload_size", "bandwidth", "power"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若改以 Wi-Fi 或乙太網路傳輸，酬載限制消失，JSON 的可讀性與彈性反而讓它成為更好的選擇。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q065",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 IoT 平台在裝置數從 500 成長到 5000 後開始出現訊息積壓。下列處置何者最應優先評估？",
    choices: [
      { id: "A", text: "把資料庫從時間序列改回關聯式" },
      { id: "B", text: "把每台裝置的回報頻率提高以加快資料更新" },
      { id: "C", text: "水平擴展 Broker 或消費端實例，並檢視訊息處理是否成為瓶頸" },
      { id: "D", text: "增加前端儀表板的圖表數量" },
    ],
    answer: "C",
    explanation:
      "積壓代表「進的比出的快」。優先確認瓶頸在 Broker 轉送還是下游消費，再以增加實例分攤負載——這是承載量成長十倍時最直接的處理方向。",
    choiceExplanations: {
      A: "換回關聯式資料庫在高頻寫入下通常更慢，方向相反。",
      B: "提高回報頻率會讓進入速率更高，積壓只會惡化。",
      D: "儀表板圖表是呈現層，與後端訊息處理能力無關。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["水平擴展", "訊息積壓", "瓶頸分析"],
      constraints: ["scalability", "data_volume"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若積壓只在每日特定時段出現、其餘時間正常，優先做的不是擴充實例而是把回報時間錯開，避免所有裝置同時上報。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q066",
    subjectId: "aiot-junior-basics",
    prompt:
      "在資料鏈路「感測器 → 閘道器 → Broker → 資料庫 → 儀表板」中，若要在資料進入資料庫之前先過濾掉明顯異常的讀值，最適合承擔此工作的位置是下列何者？",
    choices: [
      { id: "A", text: "資料庫的備份程序" },
      { id: "B", text: "儀表板的前端程式" },
      { id: "C", text: "感測器的類比電路" },
      { id: "D", text: "閘道器或串流處理環節" },
    ],
    answer: "D",
    explanation:
      "要「在進資料庫之前」處理，位置就必須在資料庫上游。閘道器或串流規則引擎正好在這一段，既能及早丟掉髒資料，也能同時降低儲存成本。",
    choiceExplanations: {
      A: "備份是把已存在的資料複製一份，與寫入前的過濾無關。",
      B: "儀表板在資料庫下游，此時髒資料早已寫入，過濾只是把它藏起來不顯示。",
      C: "類比電路能做基本濾波，但無法依業務規則判斷「這個讀值不合理」。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["資料管線", "串流處理", "前處理位置"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若需求改成「保留原始讀值以供事後稽核，但分析時排除異常」，過濾就應該移到查詢或分析階段，而不是在寫入前丟掉。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q067",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於中介軟體在 AIoT 系統中的價值，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "使新增裝置或應用時的改動範圍縮小" },
      { id: "B", text: "提供訊息路由、資料正規化與裝置管理等共用能力" },
      { id: "C", text: "讓應用層不必直接面對各種裝置的協定差異" },
      { id: "D", text: "導入後即可免除對系統架構與資料模型的設計" },
    ],
    answer: "D",
    explanation:
      "中介軟體提供的是共用機制，不是替你決定資料該長什麼樣。主題怎麼命名、欄位怎麼定義、系統怎麼分層，仍然要靠設計；缺了這一步，平台只會變成混亂資料的集散地。",
    choiceExplanations: {
      A: "解耦讓兩端的變動不互相牽動，敘述正確。",
      B: "這三項都是 IoT 平台的標準能力，敘述正確。",
      C: "隔離協定差異正是中介層存在的首要理由，敘述正確。",
    },
    topic: "A2.4 中介軟體與平台",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["中介軟體", "架構設計"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 D 改成「導入後可減少各應用重複實作連線與解析的工作」，它就會變成正確敘述——差別在於減少重複工作，而不是免除設計。",
    },
  },

  // ── A2.5 資安與隱私基本概念（11 題）───────────────────────────
  {
    id: "aiot-junior-basics-practice-q068",
    subjectId: "aiot-junior-basics",
    prompt:
      "某系統要證明「這份韌體確實由原廠發布且未被竄改」。下列機制何者最直接對應此需求？",
    choices: [
      { id: "A", text: "存取控制清單" },
      { id: "B", text: "對稱式加密" },
      { id: "C", text: "數位簽章" },
      { id: "D", text: "傳輸層加密" },
    ],
    answer: "C",
    explanation:
      "需求同時包含「來源真實」與「內容未被改」。數位簽章以原廠私鑰簽署、任何人以公鑰驗證，同時提供完整性、真實性與不可否認性，正好三者兼具。",
    choiceExplanations: {
      A: "存取控制決定誰能取得檔案，不證明檔案內容的真偽。",
      B: "對稱金鑰雙方共有，任一方都能產生相同密文，因此無法證明是「原廠」而非「另一方」所發。",
      D: "傳輸加密保護的是傳送過程，檔案落地後是否被替換它管不到。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["數位簽章", "對稱加密", "TLS"],
      constraints: ["integrity", "authenticity"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若需求只是「檔案在下載過程中不被偷看」，TLS 就足夠；要證明來源與完整性才需要簽章。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q069",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於認證（Authentication）與授權（Authorization），下列敘述何者正確？",
    choices: [
      { id: "A", text: "認證決定「你能做什麼」，授權確認「你是誰」" },
      { id: "B", text: "只要通過認證，就自動擁有全部權限" },
      { id: "C", text: "兩者是同一道程序的不同名稱" },
      { id: "D", text: "認證確認「你是誰」，授權決定「你能做什麼」" },
    ],
    answer: "D",
    explanation:
      "先確認身分、再依身分決定可執行的操作，兩者是先後而非同一件事。把它們混為一談，往往導致「登入即全開」這種權限設計缺陷。",
    choiceExplanations: {
      A: "兩者的定義被完全對調，是這一組最常見的失分點。",
      B: "這正是違反最小權限原則的做法，通過認證只代表身分成立。",
      C: "若是同一道程序，就不會有「認證成功但無權限操作」的情況。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Authentication", "Authorization"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若情境改為「同一位使用者在不同部門有不同操作範圍」，需要加強的是授權模型（如 RBAC），而不是認證方式。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q070",
    subjectId: "aiot-junior-basics",
    prompt:
      "某批 IoT 攝影機出廠密碼相同且未強制修改，最可能被利用的後果是下列何者？",
    choices: [
      { id: "A", text: "裝置的電池壽命縮短" },
      { id: "B", text: "被大量收編為殭屍網路，用於發動分散式阻斷服務攻擊" },
      { id: "C", text: "影像感測器的解析度自動下降" },
      { id: "D", text: "裝置無法取得 IP 位址" },
    ],
    answer: "B",
    explanation:
      "共用預設密碼讓攻擊者試出一組就能自動化登入同型號的所有裝置。Mirai 正是以此收編數十萬台裝置後發動大規模 DDoS，是 IoT 資安最經典的教訓。",
    choiceExplanations: {
      A: "續航取決於功耗設計；即使被入侵而增加運算，也不是「預設密碼」的直接後果。",
      C: "解析度由硬體與設定決定，與帳號密碼強度沒有因果關係。",
      D: "取得 IP 屬於網路設定，與管理密碼是否為預設值無關。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["預設密碼", "Botnet", "DDoS"],
      constraints: ["security"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若廠商改為出廠即配發每台唯一密碼並強制首次變更，這條攻擊路徑就被切斷，攻擊者必須逐台破解而非一次通吃。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q071",
    subjectId: "aiot-junior-basics",
    prompt:
      "某社區監控系統把住戶影像上傳雲端做人流分析。若要在維持分析功能的前提下降低隱私風險，下列做法何者最符合「由設計起始的隱私」？",
    choices: [
      { id: "A", text: "上傳原始影像但延長保存期限以便查證" },
      { id: "B", text: "在攝影機端就完成人數計算，只上傳統計數字" },
      { id: "C", text: "在使用條款中加註免責聲明" },
      { id: "D", text: "把影像解析度略為降低後仍全部上傳" },
    ],
    answer: "B",
    explanation:
      "隱私風險的源頭是「可辨識影像離開了現場」。在端側完成計算、只上傳無法還原成人臉的統計值，等於從架構上切斷風險，而分析功能完全保留。",
    choiceExplanations: {
      A: "保存越久，暴露窗口越長，風險反而升高，與目標相反。",
      C: "免責聲明是法律文件上的安排，不會減少資料實際外洩的機率或後果。",
      D: "降低解析度仍是上傳可辨識的人像，風險只是變小而非消除，且可能損及分析準確度。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["Privacy by Design", "邊緣處理", "去識別化"],
      constraints: ["privacy", "bandwidth"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若法規要求保留原始影像供事後調閱（例如公共場域的治安需求），就無法只上傳統計值，此時重點會轉為加密儲存、嚴格存取控制與保存期限管理。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q072",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於雜湊（Hash）的敘述，何者正確？",
    choices: [
      { id: "A", text: "可以用金鑰還原出原始資料" },
      { id: "B", text: "能證明資料由特定發送者所送出" },
      { id: "C", text: "主要用於保護資料的機密性" },
      { id: "D", text: "為單向運算，主要用於驗證資料是否被竄改" },
    ],
    answer: "D",
    explanation:
      "雜湊把任意長度資料壓成固定長度摘要且不可逆，比對摘要即可判斷內容有沒有被改過——它提供的是完整性，不是機密性也不是身分證明。",
    choiceExplanations: {
      A: "不可逆是雜湊的定義性特徵；能還原的是加密而非雜湊。",
      B: "證明發送者需要私鑰簽署，也就是數位簽章；任何人都能算出同一份資料的雜湊值。",
      C: "保護機密性要靠加密；單獨的雜湊值仍可能被字典或彩虹表比對。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Hash", "完整性", "加密"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求變成「同時證明沒被改且確實是某人所送」，單靠雜湊不夠，必須升級為以私鑰簽署雜湊值的數位簽章。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q073",
    subjectId: "aiot-junior-basics",
    prompt:
      "某裝置與雲端之間已啟用傳輸層加密，但韌體未經簽章驗證。此系統尚未被處理的攻擊面是下列何者？",
    choices: [
      { id: "A", text: "攻擊者冒充雲端伺服器與裝置建立連線" },
      { id: "B", text: "攻擊者在傳輸途中讀取上傳的感測數值" },
      { id: "C", text: "攻擊者在傳輸途中修改上行封包內容" },
      { id: "D", text: "攻擊者以竄改後的韌體取代原韌體，取得裝置控制權" },
    ],
    answer: "D",
    explanation:
      "傳輸加密守住的是「路上」，韌體驗證守住的是「裝置上跑什麼」。少了安全開機與簽章驗證，攻擊者只要能寫入韌體就能完全接管裝置，加密再強也擋不住。",
    choiceExplanations: {
      A: "伺服器憑證驗證是傳輸層安全的一部分，冒充伺服器會在握手階段被擋下。",
      B: "讀取傳輸內容正是傳輸加密所防範的，這個攻擊面已被覆蓋。",
      C: "傳輸層的完整性保護會讓中途修改被偵測，這個面向同樣已被處理。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["TLS", "Secure Boot", "韌體簽章", "攻擊面"],
      constraints: ["security"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若改為韌體已簽章但通訊未加密，尚未處理的攻擊面就會反過來變成竊聽與中間人——兩道防線各守一段，缺哪一段就露哪一段。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q074",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工廠的監控系統遭大量偽造封包灌爆，導致操作員在事故當下無法讀取任何機台狀態，但資料本身並未外洩或被竄改。此事件主要損害的是資安三要素中的哪一項？",
    choices: [
      { id: "A", text: "可用性" },
      { id: "B", text: "機密性" },
      { id: "C", text: "完整性" },
      { id: "D", text: "不可否認性" },
    ],
    answer: "A",
    explanation:
      "資料沒被看走也沒被改，但「需要用的時候用不到」——受損的正是可用性。工控場域對可用性的重視往往高於機密性，因為停機的代價最直接。",
    choiceExplanations: {
      B: "機密性受損指的是資料被不該看的人看到，題目明確排除了外洩。",
      C: "完整性受損指資料遭竄改，題目同樣明確排除。",
      D: "不可否認性處理的是「事後無法否認曾送出訊息」，與服務中斷不是同一件事。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["CIA", "可用性", "DDoS"],
      constraints: ["security", "availability"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若同一起事件中攻擊者還竄改了溫度讀值使操作員誤判，受損的就同時包含完整性，應變重點會從抗流量轉向資料驗證與稽核。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q075",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於歐盟《網路韌性法》（CRA）對連網產品製造商的要求，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "產品須符合「由設計起始的安全」並提供軟體物料清單" },
      { id: "B", text: "須在宣告的支援期內持續處理已知漏洞" },
      { id: "C", text: "產品上市取得標章後即無後續資安義務" },
      { id: "D", text: "已遭利用的漏洞須依規定於時限內通報" },
    ],
    answer: "C",
    explanation:
      "CRA 的核心轉變正是把資安從「上市前檢查一次」變成「整個生命週期的持續義務」：上市後仍須監控、修補與通報。「賣完就沒事」正是它要終結的做法。",
    choiceExplanations: {
      A: "secure by design 與 SBOM 都是明文要求，敘述正確。",
      B: "支援期內的漏洞處理義務是規範重點之一，敘述正確。",
      D: "已遭利用漏洞的限時通報是 CRA 最受關注的條款之一，敘述正確。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["CRA", "SBOM", "生命週期資安"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若產品完全不連網、也不含可更新的軟體元件，CRA 的適用範圍與義務會大幅不同——它針對的是「具數位元素的產品」。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q076",
    subjectId: "aiot-junior-basics",
    prompt:
      "某工廠要把 IoT 裝置與辦公室電腦分離，避免其中一方被入侵後波及另一方。下列措施何者最直接？",
    choices: [
      { id: "A", text: "以 VLAN 或防火牆規則進行網段隔離" },
      { id: "B", text: "為所有裝置安裝相同的防毒軟體" },
      { id: "C", text: "把兩者接到同一台交換器以便集中管理" },
      { id: "D", text: "縮短所有裝置的 DHCP 租約時間" },
    ],
    answer: "A",
    explanation:
      "需求是「限制橫向移動」。把不同信任等級的資產切到不同網段並以規則控管往來，攻擊者拿下一台辦公電腦後也無法直接觸及產線裝置。",
    choiceExplanations: {
      B: "端點防護能降低被入侵機率，但無法限制已被入侵者在網路內的移動範圍。",
      C: "接在同一台交換器等於放在同一個廣播域，與隔離的目標完全相反。",
      D: "租約時間影響位址回收頻率，對隔離沒有任何作用。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["網段隔離", "VLAN", "防火牆"],
      constraints: ["security", "blast_radius"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若兩邊本來就在實體獨立的網路上，隔離已經成立；此時該加強的是跨網段的資料交換點（如單向閘道）而非再切一次 VLAN。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q077",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於 IoT 資安防護的敘述，何者最正確？",
    choices: [
      { id: "A", text: "資安只需在系統上線前檢查一次" },
      { id: "B", text: "只要在雲端部署一道強力防火牆即可" },
      { id: "C", text: "應在裝置、網路、平台與應用各層分別設防，任一層被突破仍有其他防線" },
      { id: "D", text: "只要使用加密就不需要存取控制" },
    ],
    answer: "C",
    explanation:
      "縱深防禦的前提是「任何單一防線都可能被突破」。在各層各自設防，攻擊者即使拿下一層也無法長驅直入，這也是 IoT 這種攻擊面分散的系統最需要的思路。",
    choiceExplanations: {
      A: "新漏洞與新攻擊手法會持續出現，一次性檢查只能證明某個時點合格。",
      B: "把賭注全押在單一防火牆，一旦攻擊來自內網或裝置本身被入侵就毫無阻礙。",
      D: "加密保護資料內容，存取控制決定誰能取得資料，兩者解決的問題不同、無法互相取代。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["縱深防禦", "存取控制", "加密"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若系統極為單純（例如單一離線裝置、無網路連接），縱深防禦的層數可以大幅簡化，防護重點會轉向實體安全。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q078",
    subjectId: "aiot-junior-basics",
    prompt:
      "某醫療穿戴裝置需上傳生理資料。已知：資料屬高敏感個資、裝置為電池供電、需在院內外皆可運作。下列設計組合何者最合理？",
    choices: [
      { id: "A", text: "端側先去識別化與聚合，以 TLS 上傳，並為每台裝置配發唯一憑證" },
      { id: "B", text: "以明文上傳但縮短保存期限" },
      { id: "C", text: "所有裝置共用一組帳號密碼以簡化管理" },
      { id: "D", text: "把原始資料完整上傳並公開於研究網站" },
    ],
    answer: "A",
    explanation:
      "三個限制對應三個設計：高敏感個資 → 端側減量與去識別化；跨網域傳輸 → TLS；大量裝置 → 每台唯一憑證，讓單一裝置外洩不致波及全體。三者缺一都留下明顯缺口。",
    choiceExplanations: {
      B: "明文上傳等於在傳輸途中完全暴露，縮短保存期限並不能彌補這一點。",
      C: "共用憑證讓一台裝置被破解就等於全部淪陷，正是預設密碼災難的翻版。",
      D: "公開高敏感生理資料違反個資保護的基本要求，風險不可逆。",
    },
    topic: "A2.5 資安與隱私基本概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["TLS", "去識別化", "裝置憑證", "最小化"],
      constraints: ["privacy", "power", "mobility", "security"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若資料改為完全不含個人識別的環境參數（如病房溫濕度），去識別化與唯一憑證的必要性下降，設計可以大幅簡化。",
    },
  },

  // ── A3.1 感測技術基礎（11 題）─────────────────────────────────
  {
    id: "aiot-junior-basics-practice-q079",
    subjectId: "aiot-junior-basics",
    prompt:
      "某溫度量測系統的讀值每次都比標準器高出固定的 0.5 度，重複量測的離散程度很小。若要讓量測結果可信，下列處置何者最有效率？",
    choices: [
      { id: "A", text: "加裝低通濾波器以濾除雜訊" },
      { id: "B", text: "進行零點或偏移校正，把固定偏差修掉" },
      { id: "C", text: "更換為解析度更高的感測器" },
      { id: "D", text: "提高取樣次數並取平均以降低誤差" },
    ],
    answer: "B",
    explanation:
      "離散小代表精密度良好、隨機誤差不大；固定高 0.5 度是系統誤差。系統誤差不會因為多量幾次而消失，只能靠校正修掉——先分清是哪一種誤差，才知道該用哪種手段。",
    choiceExplanations: {
      A: "濾波處理的是雜訊造成的跳動，本題的讀值已經很穩定，濾波沒有作用對象。",
      C: "解析度不足會表現為無法分辨細微變化，與固定偏移是兩回事，換了仍然偏高。",
      D: "取平均能壓低隨機誤差，但對每次都往同方向偏的系統誤差完全無效，平均後仍高 0.5 度。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["系統誤差", "隨機誤差", "校正", "精密度"],
      constraints: ["measurement", "accuracy"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若症狀改為「讀值忽高忽低但平均接近真值」，那是隨機誤差，此時取平均與濾波才是有效手段，校正反而無從下手。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q080",
    subjectId: "aiot-junior-basics",
    prompt:
      "某超音波感測器量得回波時間為 20 毫秒，空氣中聲速取 340 公尺／秒。待測物距離最接近下列何者？",
    choices: [
      { id: "A", text: "約 6.8 公尺" },
      { id: "B", text: "約 3.4 公尺" },
      { id: "C", text: "約 1.7 公尺" },
      { id: "D", text: "約 17 公尺" },
    ],
    answer: "B",
    explanation:
      "d =（v × t）/ 2 =（340 × 0.02）/ 2 = 3.4 公尺。除以 2 是因為量到的是來回時間，這一步最容易被忽略。",
    choiceExplanations: {
      A: "6.8 公尺是漏掉除以 2 的結果，把來回距離當成單程。",
      C: "1.7 公尺是多除了一次 2，等於把來回算成四段。",
      D: "17 公尺的量級明顯不對，可能是把時間單位換算錯誤。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["超音波", "ToF", "距離計算"],
      constraints: ["measurement"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若量測環境溫度大幅改變，聲速會隨之變化（約每升高 1 度增加 0.6 m/s），高精度應用需要以溫度補償聲速。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q081",
    subjectId: "aiot-junior-basics",
    prompt:
      "某長照機構要偵測長者是否跌倒，裝置需配戴於手腕、電池續航需數日。下列感測方案何者最適合？",
    choices: [
      { id: "A", text: "三軸加速度計搭配姿態變化判斷" },
      { id: "B", text: "在房間天花板加裝攝影機做影像判斷" },
      { id: "C", text: "以超音波感測器量測人體距離地面高度" },
      { id: "D", text: "以光敏電阻偵測光線變化" },
    ],
    answer: "A",
    explanation:
      "限制是「配戴於手腕、續航數日」。加速度計功耗極低、體積小，且跌倒時的加速度突變與後續靜止是明確可辨的樣態，正是穿戴式跌倒偵測的標準做法。",
    choiceExplanations: {
      B: "攝影機的偵測效果可能更好，但無法配戴於手腕，且涉及居住空間的隱私問題。",
      C: "超音波需要固定的參考面與朝向，戴在手腕上會隨手臂擺動而失去基準。",
      D: "光線變化與跌倒沒有可靠的對應關係，遮光或關燈都會誤判。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["加速度計", "PIR", "超音波", "穿戴裝置"],
      constraints: ["power", "form_factor", "privacy"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若改為「在公共走廊偵測跌倒且不要求配戴」，攝影機或毫米波雷達會更合適——限制條件從穿戴改成固定安裝時，選型就整個翻轉。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q082",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於加速度計與陀螺儀，下列敘述何者正確？",
    choices: [
      { id: "A", text: "加速度計量角速度，陀螺儀量線性加速度" },
      { id: "B", text: "兩者量測的物理量相同，差別在精度" },
      { id: "C", text: "加速度計量線性加速度，陀螺儀量角速度" },
      { id: "D", text: "兩者都只能量測靜態的位置" },
    ],
    answer: "C",
    explanation:
      "兩者量的是不同的物理量，因此常被整合成慣性量測單元互補使用：加速度計在靜止時可推得傾角但易受振動干擾，陀螺儀對短時間旋轉敏感但會漂移。",
    choiceExplanations: {
      A: "兩者的量測對象被對調。",
      B: "若量測相同物理量就不需要同時配置，也不會有互補的價值。",
      D: "兩者量的都是運動狀態的變化量，無法直接得到絕對位置。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "交通",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["加速度計", "陀螺儀", "IMU"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求是取得絕對位置而非運動變化，慣性感測必須搭配 GPS 或其他定位來源，否則積分誤差會隨時間發散。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q083",
    subjectId: "aiot-junior-basics",
    prompt:
      "某熱敏電阻的阻值隨溫度上升而下降。此元件屬於下列何者？",
    choices: [
      { id: "A", text: "正溫度係數（PTC）熱敏電阻" },
      { id: "B", text: "應變規" },
      { id: "C", text: "熱電偶" },
      { id: "D", text: "負溫度係數（NTC）熱敏電阻" },
    ],
    answer: "D",
    explanation:
      "阻值與溫度呈反向變化即為負溫度係數，一般市售「熱敏電阻」多半指的就是 NTC，常用於溫度量測與過熱保護。",
    choiceExplanations: {
      A: "PTC 的阻值隨溫度上升而增加，與題目描述的方向相反。",
      B: "應變規的阻值變化來自受力形變，與溫度不是同一個機制。",
      C: "熱電偶輸出的是兩種金屬因溫差產生的電位差，不是阻值變化。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["NTC", "PTC", "熱電偶"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若量測範圍需達數百度以上，NTC 的線性範圍不足，通常改用熱電偶或鉑電阻。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q084",
    subjectId: "aiot-junior-basics",
    prompt:
      "工程師要量測極微小的機械振動，下列選型考量何者最正確？",
    choices: [
      { id: "A", text: "感測器質量只要比待測物輕即可，不需其他考量" },
      { id: "B", text: "應選靈敏度較低的加速規以避免飽和" },
      { id: "C", text: "應改用光敏電阻量測振動" },
      { id: "D", text: "應選靈敏度較高的加速規，並注意感測器質量不可影響待測結構" },
    ],
    answer: "D",
    explanation:
      "微小訊號需要高靈敏度才不會埋在雜訊裡；同時感測器本身的質量會改變待測結構的動態特性（質量效應），一般要求遠小於待測物而非只是「比較輕」。",
    choiceExplanations: {
      A: "「比較輕」不夠——常見經驗要求是待測物質量的十分之一以下，否則量到的是被改變後的行為。",
      B: "低靈敏度適合大振幅場合，用在微振動上會讓訊號淹沒於雜訊。",
      C: "光敏電阻量的是光照度，無法直接反映機械振動。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["靈敏度", "質量效應", "加速規選型"],
      constraints: ["measurement", "environment"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Correct in Different Context",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若待測物是大型機台且振幅可觀，質量效應可忽略，此時反而該優先考慮量程是否足夠而非靈敏度。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q085",
    subjectId: "aiot-junior-basics",
    prompt:
      "某辦公室以被動式紅外線感測器控制照明，卻常在有人靜坐辦公時自動關燈。此現象的根本原因是下列何者？",
    choices: [
      { id: "A", text: "PIR 偵測的是紅外線的變化，靜止不動時偵測不到" },
      { id: "B", text: "PIR 的偵測距離不足" },
      { id: "C", text: "PIR 無法在室內使用" },
      { id: "D", text: "PIR 只能偵測金屬物體" },
    ],
    answer: "A",
    explanation:
      "PIR 靠的是視野內紅外線輻射的「變化」觸發，人一旦長時間靜止，訊號趨於穩定就被判定為無人。這是它的原理限制，不是安裝或設定的問題。",
    choiceExplanations: {
      B: "若是距離不足，靠近時應該正常；但症狀是「靜止就失效」，與距離無關。",
      C: "PIR 正是室內照明與保全最常用的感測器之一，說它不能室內使用與事實不符。",
      D: "PIR 感測的是人體發出的紅外線，與金屬完全無關。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["PIR", "紅外線", "感測原理限制"],
      constraints: ["environment"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若必須偵測靜止的人，應改用毫米波雷達或熱影像這類能感測靜態存在（呼吸、體溫分布）的技術，而不是調整 PIR 的靈敏度。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q086",
    subjectId: "aiot-junior-basics",
    prompt:
      "某壓力量測需求為「量程 0～10 bar、必須能分辨 0.01 bar 的變化」。工程師手上的 ADC 為 10 位元。下列判斷何者正確？",
    choices: [
      { id: "A", text: "只要更換靈敏度更高的感測器，位元數就不重要" },
      { id: "B", text: "10 位元可分成 10000 階，綽綽有餘" },
      { id: "C", text: "只要提高取樣率即可提升可分辨的最小變化量" },
      { id: "D", text: "10 位元僅能分成 1024 階、每階約 0.01 bar，裕度不足，應提高位元數或縮小量程" },
    ],
    answer: "D",
    explanation:
      "10 位元為 2^10 = 1024 階，10 bar 除以 1024 約為 0.0098 bar，剛好卡在需求邊緣、毫無雜訊裕度。實務上應提高到 12 位元，或把量程縮小到實際使用範圍。",
    choiceExplanations: {
      A: "感測器靈敏度再高，最後仍要通過 ADC 量化；位元數不足時細節在轉換階段就已遺失。",
      B: "10 位元是 1024 階而非 10000 階，把位元數與十進位位數混淆了。",
      C: "取樣率決定能追上多快的變化，與每一階代表多少壓力無關。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["解析度", "量程", "ADC 位元數"],
      constraints: ["measurement", "resolution", "range"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Neighbor Concept",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若實際製程只在 0～2 bar 之間運作，把量程縮到 2 bar 就能讓同一顆 10 位元 ADC 的每階降到約 0.002 bar，不必換硬體。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q087",
    subjectId: "aiot-junior-basics",
    prompt:
      "某廠房要偵測可燃氣體外洩，下列感測器何者最適合？",
    choices: [
      { id: "A", text: "氣體感測器" },
      { id: "B", text: "壓力感測器" },
      { id: "C", text: "光學感測器" },
      { id: "D", text: "溫濕度感測器" },
    ],
    answer: "A",
    explanation:
      "要偵測的物理量是「特定氣體的濃度」，只有氣體感測器直接量測這一項。其餘選項量的都是其他物理量，只能間接、且不可靠地推測。",
    choiceExplanations: {
      B: "管線壓力在小量外洩時未必有可辨識的變化，靈敏度不足以作為早期警示。",
      C: "多數可燃氣體無色，光學感測難以直接偵測，且易受環境照明干擾。",
      D: "溫濕度與可燃氣體濃度沒有可靠的對應關係。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["氣體感測器", "感測選型"],
      constraints: ["safety", "measurement"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若目的改為「偵測管線是否破裂」而非氣體濃度，壓力感測器搭配流量計反而更直接，因為量的是不同的失效徵狀。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q088",
    subjectId: "aiot-junior-basics",
    prompt:
      "某位移感測器在升壓與降壓過程中，對同一個實際位移給出相差約 2% 的讀數；量測若只在單一方向進行則一致性良好。工程師應如何處理？",
    choices: [
      { id: "A", text: "改以平均值取代單次讀值" },
      { id: "B", text: "提高取樣率以捕捉更多資料點" },
      { id: "C", text: "確認規格書的遲滯值並固定量測方向，必要時改選遲滯較小的元件" },
      { id: "D", text: "擴大量程以避免溢位" },
    ],
    answer: "C",
    explanation:
      "「同一輸入依來的方向不同而輸出不同、單向量測卻一致」正是遲滯的特徵。它是元件的物理特性，處理方式是查規格、固定量測路徑，或換遲滯規格更好的感測器。",
    choiceExplanations: {
      A: "上升與下降的讀值取平均只會得到一個介於兩者之間的數字，並未消除方向依賴。",
      B: "取樣率影響能否追上快速變化，對方向性造成的偏差沒有作用。",
      D: "量程溢位會表現為超出範圍後被截斷，與雙向讀值不一致無關。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["遲滯", "量測方向", "感測選型"],
      constraints: ["measurement", "accuracy"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若讀值的偏差與方向無關、而是隨時間緩慢漂移，該懷疑的就不是遲滯而是溫漂或元件老化，處理方式改為定期校正。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q089",
    subjectId: "aiot-junior-basics",
    prompt:
      "某溫室要同時量測空氣溫濕度、土壤含水量與光照度，且節點以電池供電、每 15 分鐘回報一次。下列感測配置的考量何者最重要？",
    choices: [
      { id: "A", text: "把所有感測器改為持續取樣以提高資料密度" },
      { id: "B", text: "各感測器的量測週期與喚醒策略，讓多數時間維持在低功耗狀態" },
      { id: "C", text: "選擇解析度最高的型號，不需考慮功耗" },
      { id: "D", text: "把感測器全部改為有線供電" },
    ],
    answer: "B",
    explanation:
      "每 15 分鐘才需要一筆資料，代表裝置有 99% 以上的時間可以睡眠。喚醒—量測—回傳—休眠的節奏設計，才是電池供電節點續航的決定因素。",
    choiceExplanations: {
      A: "持續取樣會讓功耗上升數個數量級，對每 15 分鐘一筆的需求而言毫無必要。",
      C: "解析度提高通常伴隨更高的功耗與成本，在電池供電的前提下不能不考慮。",
      D: "改為有線供電確實解決功耗問題，但溫室中大量佈線的成本與彈性損失往往不可接受。",
    },
    topic: "A3.1 感測技術基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["低功耗設計", "取樣策略", "感測配置"],
      constraints: ["power", "sampling_rate", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      crossNode: "B2.1",
      decisionBoundary:
        "若需求改為「偵測突發的病蟲害徵兆、需秒級反應」，低功耗睡眠策略就不再適用，供電方式與通訊選型都得重新設計。",
    },
  },

  // ── A3.2 感測訊號與通訊基礎（11 題）───────────────────────────
  {
    id: "aiot-junior-basics-practice-q090",
    subjectId: "aiot-junior-basics",
    prompt:
      "以 12 位元 ADC 搭配 3.3 V 參考電壓量測訊號，可分辨的最小電壓變化最接近下列何者？",
    choices: [
      { id: "A", text: "約 0.27 毫伏" },
      { id: "B", text: "約 0.81 毫伏" },
      { id: "C", text: "約 8.1 毫伏" },
      { id: "D", text: "約 3.3 毫伏" },
    ],
    answer: "B",
    explanation:
      "解析度 = Vref / 2^N = 3.3 / 4096 ≈ 0.000806 V，約 0.81 毫伏。位元數決定階數，參考電壓決定每階代表多少電壓。",
    choiceExplanations: {
      A: "0.27 毫伏約為正確值的三分之一，量級不符。",
      C: "8.1 毫伏是正確值的十倍，通常來自 4096 誤算成約 400。",
      D: "3.3 毫伏相當於把量程分成 1000 階，對應約 10 位元而非 12 位元。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["ADC", "解析度", "參考電壓"],
      constraints: ["measurement"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把參考電壓降到 1.65 V 而位元數不變，解析度會提高一倍（約 0.4 毫伏），代價是可量測的電壓上限也砍半。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q091",
    subjectId: "aiot-junior-basics",
    prompt:
      "某振動訊號的最高頻率成分為 2 kHz。依取樣定理，取樣率至少應為多少才能避免頻疊？",
    choices: [
      { id: "A", text: "2 kHz" },
      { id: "B", text: "500 Hz" },
      { id: "C", text: "1 kHz" },
      { id: "D", text: "4 kHz" },
    ],
    answer: "D",
    explanation:
      "Nyquist 取樣定理要求 f_s ≥ 2 × f_max，因此至少 4 kHz。實務上還會取更高的倍數並搭配抗頻疊濾波器，以留下裕度。",
    choiceExplanations: {
      A: "2 kHz 剛好等於訊號最高頻率，只有它的一半，必然產生頻疊。",
      B: "500 Hz 更不足，重建出的波形與原訊號完全不同。",
      C: "1 kHz 遠低於需求，高頻成分會被錯誤地折疊成低頻假訊號。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["Nyquist", "取樣率", "頻疊"],
      constraints: ["sampling_rate"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若無法提高取樣率（受限於功耗或頻寬），就必須先用類比低通濾波器把 2 kHz 以上成分濾掉，否則它們會混入結果而無法事後分離。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q092",
    subjectId: "aiot-junior-basics",
    prompt:
      "某電路板上要掛 6 顆溫濕度感測器，希望佔用的 MCU 腳位最少且每顆可獨立定址。下列介面何者最適合？",
    choices: [
      { id: "A", text: "I²C" },
      { id: "B", text: "SPI" },
      { id: "C", text: "UART" },
      { id: "D", text: "類比電壓輸出" },
    ],
    answer: "A",
    explanation:
      "I²C 只需 SDA 與 SCL 兩條線即可掛多個裝置，並以位址區分——「腳位少 + 多裝置定址」正是它的招牌組合。",
    choiceExplanations: {
      B: "SPI 速度更快，但每個從裝置各需一條 CS 腳位，6 顆就多出 6 支腳，與腳位最少的要求相反。",
      C: "UART 是點對點介面，6 顆感測器需要 6 組 TX/RX，腳位消耗最兇。",
      D: "類比輸出每顆各佔一個 ADC 通道，且完全沒有定址概念。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["I²C", "SPI", "UART"],
      constraints: ["pin_count", "multi_device"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若改成「接一顆高速外接 Flash、要求最大吞吐」，SPI 的全雙工與高時脈會勝過 I²C——腳位不再是限制時，速度就成為主要考量。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q093",
    subjectId: "aiot-junior-basics",
    prompt:
      "關於 UART、I²C 與 SPI 的比較，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "UART 為非同步傳輸，收發雙方需事先約定鮑率" },
      { id: "B", text: "I²C 以位址辨識裝置，屬半雙工" },
      { id: "C", text: "SPI 具備 MOSI 與 MISO，可全雙工" },
      { id: "D", text: "三者皆具備時脈線，因此都屬於同步傳輸" },
    ],
    answer: "D",
    explanation:
      "UART 沒有時脈線，屬非同步傳輸，靠雙方各自以約定鮑率計時取樣；I²C 與 SPI 才有時脈線。把三者一概而論正是這題的陷阱。",
    choiceExplanations: {
      A: "非同步與鮑率約定是 UART 的定義性特徵，敘述正確。",
      B: "I²C 只有一條雙向資料線 SDA，無法同時收發，敘述正確。",
      C: "兩條獨立的資料線讓 SPI 得以全雙工，敘述正確。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["UART", "I²C", "SPI", "同步與非同步"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 D 改成「I²C 與 SPI 具備時脈線，屬同步傳輸」，它就成立了——錯誤只在於把 UART 也算了進去。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q094",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 UART 連線收到的字元全為亂碼，但接線與供電經確認無誤。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "收發雙方的鮑率設定不一致" },
      { id: "B", text: "兩端的 IP 位址不在同一網段" },
      { id: "C", text: "MQTT 的 QoS 等級設定錯誤" },
      { id: "D", text: "感測器的量程設定過大" },
    ],
    answer: "A",
    explanation:
      "UART 沒有共用時脈，全靠雙方以約定鮑率各自計時取樣。鮑率不一致時取樣點會逐位元偏移，收到的每個位元組都錯——症狀正是整片亂碼。",
    choiceExplanations: {
      B: "UART 是實體串列介面，沒有 IP 的概念，網段設定與它無關。",
      C: "QoS 屬於 MQTT 應用層的送達保證，與位元層級的取樣完全是兩回事。",
      D: "量程設定錯誤會讓數值換算不合理，但字元本身仍可正確解碼。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["UART", "鮑率", "非同步傳輸"],
      constraints: ["reliability"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若症狀改為「大部分正確、偶爾出現錯字」，就不像鮑率不符，而更可能是線太長、雜訊干擾或缺少共地。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q095",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 PWM 訊號週期為 20 毫秒，其中高電位持續 5 毫秒。其責任週期為下列何者？",
    choices: [
      { id: "A", text: "50%" },
      { id: "B", text: "25%" },
      { id: "C", text: "20%" },
      { id: "D", text: "75%" },
    ],
    answer: "B",
    explanation:
      "責任週期 =（T_ON / T）× 100% =（5 / 20）× 100% = 25%。它決定等效的平均輸出，是以純數位訊號達成類比調控的關鍵參數。",
    choiceExplanations: {
      A: "50% 需要高低電位各佔 10 毫秒。",
      C: "20% 對應的是高電位 4 毫秒，與題目給的 5 毫秒不符。",
      D: "75% 是把高低電位的角色對調後的結果。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["PWM", "責任週期"],
      constraints: ["measurement"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若要驅動需要真正類比電壓的元件（而非靠平均值即可的負載），PWM 就必須再加低通濾波，或直接改用 DAC。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q096",
    subjectId: "aiot-junior-basics",
    prompt:
      "某控制器需輸出 0～10 V 的連續電壓訊號給比例式閥門，以調節流量。已知 MCU 只有數位輸出腳位。下列做法何者最直接？",
    choices: [
      { id: "A", text: "直接以 GPIO 高低電位驅動閥門" },
      { id: "B", text: "使用 ADC 把數位值轉為類比電壓" },
      { id: "C", text: "使用 DAC，或以 PWM 搭配低通濾波產生等效類比電壓" },
      { id: "D", text: "提高 MCU 時脈以產生更平滑的電壓" },
    ],
    answer: "C",
    explanation:
      "需求是「數位系統要產生連續電壓」，方向是數位轉類比。DAC 直接輸出類比電壓；若無 DAC，也可用 PWM 加低通濾波取其平均值來近似，再視需要放大到 0～10 V。",
    choiceExplanations: {
      A: "GPIO 只有高與低兩種狀態，無法表達 0～10 V 之間的連續開度。",
      B: "ADC 的方向相反，它把類比訊號轉成數位值，無法用來產生輸出電壓。",
      D: "時脈影響的是運算與訊號頻率，本身不會產生類比電壓。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["DAC", "ADC", "PWM", "低通濾波"],
      constraints: ["output_type", "hardware_limitation"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若閥門本身接受 PWM 輸入（許多比例閥與馬達驅動器如此），就不需要濾波電路，直接輸出脈波即可。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q097",
    subjectId: "aiot-junior-basics",
    prompt:
      "某 I²C 匯流排原本運作正常，工程師把感測器移到 3 公尺外並延長排線後，通訊開始間歇失敗。已知電壓正常、位址無衝突。下列最合理的下一步是何者？",
    choices: [
      { id: "A", text: "縮短線長或降低時脈速率，並檢視上拉電阻是否需調整" },
      { id: "B", text: "提高 MCU 的時脈頻率" },
      { id: "C", text: "更換為容量更大的 Flash" },
      { id: "D", text: "把 QoS 提高到 2" },
    ],
    answer: "A",
    explanation:
      "I²C 是為板內短距設計，線一長就增加電容負載，訊號邊緣變鈍而在高時脈下取樣失敗。縮短線長、降低時脈或調整上拉電阻，都是直接對症的處理。",
    choiceExplanations: {
      B: "提高 MCU 時脈不會改善匯流排的訊號完整性，反而可能讓匯流排時脈更快而更容易失敗。",
      C: "Flash 容量與匯流排的電氣特性完全無關。",
      D: "QoS 屬於 MQTT 應用層的機制，與板級的 I²C 傳輸無關。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["I²C", "線長", "上拉電阻", "訊號完整性"],
      constraints: ["distance", "reliability"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若感測器確實必須放在數公尺外，正確做法是改用為長距設計的介面（如 RS-485）或加裝 I²C 中繼器，而不是勉強延長匯流排。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q098",
    subjectId: "aiot-junior-basics",
    prompt:
      "在「感測器 →（I²C）→ MCU →（Wi-Fi）→ MQTT Broker」的資料路徑中，I²C 與 MQTT 分別位於系統的哪一段？",
    choices: [
      { id: "A", text: "I²C 在裝置與後端之間，MQTT 在板級的元件之間" },
      { id: "B", text: "I²C 在板級的元件之間，MQTT 在裝置與後端之間的應用層" },
      { id: "C", text: "兩者都在板級的元件之間" },
      { id: "D", text: "兩者都屬於應用層協定" },
    ],
    answer: "B",
    explanation:
      "I²C 解決的是「同一塊板子上晶片之間怎麼通訊」，MQTT 解決的是「裝置與後端之間怎麼交換訊息」。兩者的作用範圍差了好幾個層級，只是恰好都出現在同一條資料路徑上。",
    choiceExplanations: {
      A: "兩者的作用範圍被完全對調。",
      C: "MQTT 需要 IP 網路承載，不可能在板級的兩顆晶片之間直接使用。",
      D: "I²C 是實體與資料連結層級的匯流排，不是應用層協定。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Architecture",
      concepts: ["I²C", "MQTT", "分層"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若把 Wi-Fi 換成 LoRaWAN，MQTT 的位置不會改變（仍在應用層），但因為酬載限制，實務上會改在閘道器端才轉成 MQTT。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q099",
    subjectId: "aiot-junior-basics",
    prompt:
      "下列關於串列與並列通訊的敘述，何者「不」正確？",
    choices: [
      { id: "A", text: "並列通訊同時以多條線傳送多個位元，短距離下速率較高" },
      { id: "B", text: "串列通訊線路較少，成本與佈線複雜度較低" },
      { id: "C", text: "並列通訊的線路成本較低，因此長距離傳輸多採用並列" },
      { id: "D", text: "並列通訊在長距離下易受線間串音與時序偏移影響" },
    ],
    answer: "C",
    explanation:
      "並列要拉多條線，成本與佈線複雜度都較高，且長距離時各線的到達時間差（skew）與串音會使可靠度急遽下降——長距離傳輸恰恰以串列為主。",
    choiceExplanations: {
      A: "在極短距離下同時送多位元確實有速率優勢，敘述正確。",
      B: "線少正是串列的核心優點，敘述正確。",
      D: "串音與時序偏移是並列在長距離失效的主因，敘述正確。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["串列通訊", "並列通訊", "串音"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若距離縮短到晶片之間的數公分（例如記憶體匯流排），並列的速率優勢就會勝過其成本與時序代價。",
    },
  },
  {
    id: "aiot-junior-basics-practice-q100",
    subjectId: "aiot-junior-basics",
    prompt:
      "某資料擷取系統原以 12 位元 ADC、每秒 100 次取樣量測製程溫度。若需求改為「擷取馬達的高頻振動以判斷軸承劣化」，下列調整何者最關鍵？",
    choices: [
      { id: "A", text: "把感測器的量程調大" },
      { id: "B", text: "把 ADC 位元數從 12 位元提高到 16 位元即可" },
      { id: "C", text: "大幅提高取樣率至涵蓋振動頻帶的兩倍以上，並確認 ADC 吞吐足夠" },
      { id: "D", text: "把資料上傳頻率從每秒一次改為每分鐘一次" },
    ],
    answer: "C",
    explanation:
      "溫度變化以秒計，振動則在數百至數千赫茲。限制從「解析度」換成了「頻寬」，因此關鍵是取樣率必須滿足 Nyquist，否則高頻成分會頻疊成假訊號，位元數再高也救不回來。",
    choiceExplanations: {
      A: "量程影響可量測的振幅範圍，與能不能捕捉到高頻成分無關。",
      B: "提高位元數增加的是幅度解析度，對於取樣率不足造成的頻疊完全沒有幫助。",
      D: "降低上傳頻率只會讓資料更少，與擷取高頻訊號的需求方向相反。",
    },
    topic: "A3.2 感測訊號與通訊基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["取樣率", "Nyquist", "ADC 吞吐", "振動量測"],
      constraints: ["sampling_rate", "bandwidth", "data_volume"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若只需判斷「軸承是否已明顯劣化」而不需分析頻譜細節，可在感測端先算出均方根值等統計量再低速回傳，取樣率仍要高但傳輸量可大幅降低。",
    },
  },
];
