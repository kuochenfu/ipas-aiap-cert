import type { Question } from "../types";

// 依評鑑內容節點分批撰寫；配額見 src/domain/assessmentTopics.ts。
// 內容為 LLM 產出，正確性需人工複審。
export const practiceQuestions: Question[] = [
  // ── L11101 AI 的定義與分類（11 題）──────────────────────────────
  {
    id: "junior-ai-basics-practice-q001",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技新創開發影像辨識系統判斷作物病害，並以深度神經網路訓練該模型；公司行銷文案將「人工智慧」「機器學習」「深度學習」三個詞交替使用，技術長希望對外簡報時能正確說明三者的關係，避免造成誤解。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "三者為層層包含關係：人工智慧包含機器學習，機器學習包含深度學習" },
      { id: "B", text: "機器學習包含深度學習與人工智慧，兩者皆為機器學習底下的分支" },
      { id: "C", text: "三者原本是各自獨立發展的技術領域，彼此少有重疊或關聯" },
      { id: "D", text: "人工智慧是深度學習的下位概念，機器學習則與兩者平行發展" },
    ],
    answer: "A",
    explanation:
      "人工智慧是最外層概念，機器學習是其中一種「由資料學規則」的方法，深度學習又是機器學習中以多層神經網路實作的一支，三者為層層包含關係，而非各自獨立或彼此顛倒。",
    choiceExplanations: {
      B: "包含關係顛倒了——機器學習是人工智慧的子集，深度學習又是機器學習的子集，並非機器學習包含另外兩者。",
      C: "三者並非彼此獨立，而是層層包含；把它們視為互不重疊的領域會誤判技術選型範圍。",
      D: "包含關係顛倒；人工智慧才是最外層，深度學習是機器學習之下最內層的一支。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["人工智慧", "機器學習", "深度學習", "包含關係"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      crossNode: "L11401",
      decisionBoundary:
        "若再把生成式 AI 加進來，它不會變成第四層——層級由「用什麼技術實作」決定，不是由技術出現的先後決定。",
    },
  },
  {
    id: "junior-ai-basics-practice-q002",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠導入生成式AI自動撰寫設備維修報告，工程師在教育訓練簡報中把「人工智慧、機器學習、深度學習、生成式AI」畫成由外而內的四層同心圓，將生成式AI列為獨立於深度學習之外的第四層；主管審閱後認為分層方式有誤。下列說明何者正確？",
    choices: [
      { id: "A", text: "生成式AI是深度學習之外獨立的第四層技術，與前三者並列" },
      { id: "B", text: "生成式AI是依輸出型態劃分的用途分類，主流實作仍屬於深度學習範圍" },
      { id: "C", text: "生成式AI與深度學習所指的技術範圍相同，兩者可視為同一件事、交替使用不影響理解" },
      { id: "D", text: "生成式AI是人工智慧與機器學習的交集，但與深度學習無關" },
    ],
    answer: "B",
    explanation:
      "生成式AI不是繼人工智慧、機器學習、深度學習之後的第四層技術架構，而是依「輸出型態（能否生成新內容）」切分的用途分類，其主流實作方式仍落在深度學習之內，因此不宜畫成獨立的第四層同心圓。",
    choiceExplanations: {
      A: "生成式AI並非獨立於深度學習之外的另一層架構，而是深度學習之內依用途劃分的一種分類方式。",
      C: "生成式AI是深度學習底下依用途區分的一支，兩者所指技術範圍並不相同，貿然交替使用容易混淆分類層級。",
      D: "生成式AI的主流實作正是建立在深度學習技術之上，並非與深度學習無關。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["生成式AI", "深度學習", "分類層級"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      crossNode: "L11401",
      decisionBoundary:
        "若某個生成式工具改以規則模板拼湊文字、完全不含神經網路，它就不屬於深度學習——「生成式」講的是輸出型態，不保證實作方式。",
    },
  },
  {
    id: "junior-ai-basics-practice-q003",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠沿用二十年的瑕疵判定系統，其邏輯是資深工程師依過往經驗手寫的一連串「若條件成立則判定」規則，從未使用任何訓練資料調整參數；新進資料科學家想比較它與新導入之機器學習瑕疵檢測模型的性質差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩套系統都屬於機器學習，兩者差異在於採用的訓練演算法不同" },
      { id: "B", text: "舊系統不屬於人工智慧，唯有新導入的機器學習模型才能算作人工智慧" },
      { id: "C", text: "兩套系統都不屬於人工智慧，性質上比較接近一般自動化判斷程式" },
      { id: "D", text: "舊系統屬於專家系統：規則由人工撰寫、非資料學習得來，屬AI但不屬於ML" },
    ],
    answer: "D",
    explanation:
      "專家系統的判斷邏輯是由領域專家人工撰寫的規則庫，而非透過訓練資料學習得來，因此它屬於人工智慧的一支，但不屬於機器學習——這是判斷「屬AI但非ML」最典型的例子。",
    choiceExplanations: {
      A: "舊系統的規則由人工撰寫、未經資料訓練，不符合機器學習「從資料學習規則」的定義，兩者的差異不只是演算法不同。",
      B: "舊系統雖非機器學習，但仍屬於人工智慧的範疇（規則式系統／專家系統），並非「不算人工智慧」。",
      C: "專家系統雖以規則驅動，但仍屬於人工智慧的技術之一，不能簡化為與AI無關的一般自動化程式。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["專家系統", "規則式AI", "機器學習定義"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      crossNode: "L11301",
      decisionBoundary:
        "若舊系統的規則是從歷史資料自動挖掘出來的（例如決策樹學到的判斷條件），它就同時屬於 AI 與 ML——判準是規則從哪裡來，不是規則長什麼樣。",
    },
  },
  {
    id: "junior-ai-basics-practice-q004",
    subjectId: "junior-ai-basics",
    prompt:
      "某補習班導入的AI批改系統，能精準判斷數學選擇題的作答是否正確，但完全無法用來批改作文或規劃學生的學習路徑；教師在教學會議中討論這套系統屬於哪一類AI，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "只要之後持續升級演算法，這套系統就會逐漸具備強AI（通用人工智慧）的能力" },
      { id: "B", text: "強AI與弱AI的差別主要在於運算速度與資料處理量的高低，與任務範圍無關" },
      { id: "C", text: "這套系統雖然功能侷限於選擇題判分，但因判題精準，已經可視為達到強AI的水準" },
      { id: "D", text: "這套系統屬於弱AI：因應特定任務設計，能力無法遷移到其他任務" },
    ],
    answer: "D",
    explanation:
      "弱AI只為特定任務設計，訓練目標侷限於該範圍，能力無法直接遷移到其他任務；強AI（通用人工智慧）指具備與人類相當的跨領域理解與學習能力，目前尚未實現。這套批改系統只能處理選擇題判分，屬於典型的弱AI。",
    choiceExplanations: {
      A: "強弱AI的差別不在演算法反覆調整，而在能否跨任務自主遷移，持續調參不會使系統逐漸獲得通用能力。",
      B: "判準是能否跨領域自主學習與遷移，而非運算速度或資料處理量；速度快、資料量大的系統仍可能只是弱AI。",
      C: "在單一任務上表現精準，不等於具備跨領域理解與學習能力，判準是能力能否遷移，而非單一任務的準確度。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["弱AI", "強AI", "任務遷移"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若系統能在沒受過訓練的新科目上自行摸索出批改標準，判準才會往強 AI 移動——關鍵是能否遷移，不是單一任務的準確度。",
    },
  },
  {
    id: "junior-ai-basics-practice-q005",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育科技公司的AI助教能同時完成批改作業、生成練習題、回答學生提問等多項任務，行銷部門想以「已達到強人工智慧（AGI）水準」作為宣傳賣點，技術主管認為此說法有誤，下列說明何者最能反映AI能力分類的正確判準？",
    choices: [
      { id: "A", text: "判斷強弱AI的關鍵在於能否跨領域自主學習與遷移，而非任務數量多寡" },
      { id: "B", text: "只要導入生成式AI技術，系統的能力就會逐步邁向強AI的水準" },
      { id: "C", text: "AI助教能同時處理的任務種類越多、越多樣化，就代表越接近強AI的能力水準" },
      { id: "D", text: "強AI已經在教育領域普遍實現，尚未推廣到其他產業應用" },
    ],
    answer: "A",
    explanation:
      "判斷強弱AI的關鍵在於系統是否具備跨領域的自主理解、學習與遷移能力，而不是它能同時執行多少項功能。即使AI助教涵蓋批改、出題、問答等多項任務，這些任務仍各自預先設計、彼此侷限，因此仍屬弱AI；目前所有商用系統（含大型語言模型）皆屬弱AI，強AI尚未實現。",
    choiceExplanations: {
      B: "生成式AI仍是依訓練目標運作的弱AI技術，導入生成式AI不會使系統逐步具備跨領域自主學習能力。",
      C: "任務數量多寡是功能廣度的問題，與是否具備跨領域自主遷移能力無關，兩者判準不同。",
      D: "強AI（通用人工智慧）目前尚未在任何產業實現，並非已在教育領域普遍實現。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["強AI", "弱AI", "跨領域遷移"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若把問題改成「這套助教有沒有商業價值」，任務數量就變成有效指標了——任務廣度衡量的是產品面，不是 AI 的能力分類。",
    },
  },
  {
    id: "junior-ai-basics-practice-q006",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業合作社同時使用兩套AI工具：一套彙整過去五年的氣象與土壤感測資料，找出影響產量的關鍵模式；另一套則依這些歷史資料推估下一季的收成量與天氣風險。技術顧問在簡報中把前者歸類為分析型AI、後者歸類為預測型AI，下列敘述何者最能說明兩者的分工差異？",
    choices: [
      { id: "A", text: "分析型AI與預測型AI是同一種技術在不同階段的稱呼，兩者功能與定位並無分別" },
      { id: "B", text: "分析型AI的角色是把分析結果轉成文字報告，預測型AI則專門處理影像資料的辨識工作" },
      { id: "C", text: "分析型AI著重從既有資料洞悉模式，預測型AI著重依歷史資料推估未來趨勢" },
      { id: "D", text: "預測型AI主要用於金融市場預測，農業場景較不適合導入這類技術" },
    ],
    answer: "C",
    explanation:
      "分析型AI主要用於洞悉資料模式、分析與處理大量資料以提供見解；預測型AI則基於歷史資料預測未來的趨勢與行為，常應用於市場預測、風險評估等領域。合作社彙整歷史資料找模式的工具屬分析型AI，而依歷史資料推估下一季收成與風險的工具屬預測型AI，兩者分工明確、互補而非相同。",
    choiceExplanations: {
      A: "兩者定位不同——分析型著重洞悉既有模式，預測型著重推估未來趨勢，並非同一技術在不同階段的稱呼。",
      B: "把分析型AI限定為「轉成文字報告」、預測型AI限定為「處理影像」，是依輸出格式做的錯誤區分，實際區分依據是任務目的不同。",
      D: "預測型AI的應用場景不限於金融，農業的收成與天氣風險預測同樣是常見且合適的應用。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["分析型AI", "預測型AI"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若第二套工具改成「解釋去年為什麼減產」，它就回到分析型——分野在時間方向（回看既有／推估未來），不在資料來源。",
    },
  },
  {
    id: "junior-ai-basics-practice-q007",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠導入一套AI工具，能依工程師輸入的提示詞自動產出維修作業指導書的初稿文字；這套工具與用來偵測異常趨勢的預測型AI相比，最主要的特徵為何？",
    choices: [
      { id: "A", text: "它與預測型AI的運作原理相通，都是依歷史資料推估未來可能發生的異常趨勢" },
      { id: "B", text: "它不需要任何模型運作，單純是查詢既有維修紀錄資料庫後回傳的結果" },
      { id: "C", text: "它依提示詞生成新的文字內容，屬於生成型AI，核心目的是創造內容而非預測數值" },
      { id: "D", text: "它其實是分析型AI的另一種操作介面，用途與資料模式分析相同，並非新的AI類型" },
    ],
    answer: "C",
    explanation:
      "生成型AI是近年快速發展的AI類型，可根據使用者輸入的提示詞生成文字、語音、圖像等各類素材；這套依提示詞產出維修指導書初稿的工具，核心目的是「創造新內容」，而非像預測型AI那樣推估未來的數值或趨勢，也不是單純查詢既有資料庫或分析型AI的另一種介面，因此應歸類為生成型AI。",
    choiceExplanations: {
      A: "這套工具的核心目的是依提示詞生成新的文字內容，而非依歷史資料推估未來的異常趨勢數值，兩者任務性質不同。",
      B: "生成文字內容仍需依賴訓練過的生成式模型運作，並非單純查詢既有資料庫、不涉及模型推論。",
      D: "分析型AI著重從既有資料洞悉模式，而這套工具的核心是生成新內容，兩者任務目的不同，並非同一類型AI的不同介面。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["生成型AI", "預測型AI", "提示詞"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        D: "Neighbor Concept",
      },
      crossNode: "L11401",
      decisionBoundary:
        "若工具改成從既有維修紀錄中挑一份最相近的整份回傳，它就是檢索而不是生成——差別在輸出是新產生的還是既有的。",
    },
  },
  {
    id: "junior-ai-basics-practice-q008",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠工程師認為，只要把現有的瑕疵偵測模型換成參數量更大的模型，系統就會自動具備「AI代理人（Agent）」能自主規劃巡檢路線、呼叫感測器並依結果調整下一步的能力。資訊部門主管認為這個想法有誤，下列說明何者最正確？",
    choices: [
      { id: "A", text: "AI系統與Agent指的是同一層概念，兩者的角色都是把模型組裝起來完成任務" },
      { id: "B", text: "Agent其實是模型的另一種稱呼方式，兩者所指的技術範圍相同，可以互換使用" },
      { id: "C", text: "模型參數越大，通常就會逐漸具備規劃與呼叫工具的能力，兩者本質上是同一件事" },
      { id: "D", text: "Agent是建立在AI系統之上的編排層，能自行規劃步驟、呼叫工具並依回饋調整行動" },
    ],
    answer: "D",
    explanation:
      "模型回答「怎麼計算」，AI系統把模型、資料、介面與規則組裝起來以完成任務，而Agent是系統之上的編排層，能依目標自行規劃步驟、呼叫工具，並依工具回傳結果調整下一步。單純把模型換成參數量更大的版本，並不會補上規劃、工具呼叫與執行迴圈這層能力，因此不會自動具備Agent的行為。",
    choiceExplanations: {
      A: "AI系統負責把模型、資料、介面與規則組裝起來完成任務，Agent則是其上的編排層，兩者是不同層級的概念，並非同一層。",
      B: "Agent不是模型的另一種稱呼，模型是回答「怎麼計算」的運算單元，Agent是規劃與呼叫工具的編排層，層級不同不可互換。",
      C: "換更大的模型只提升單次運算能力，缺的是規劃、工具呼叫與執行迴圈，這些能力不會隨模型變大而逐漸出現。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Architecture",
      concepts: ["AI Agent", "AI系統", "模型", "編排層"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Terminology Swap",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若那套系統只照固定順序呼叫感測器、不會依結果改變下一步，它就只是自動化流程而不是 Agent——Agent 的關鍵在依回饋自行調整。",
    },
  },
  {
    id: "junior-ai-basics-practice-q009",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的技術文件區分「批改模型」與「批改系統」兩個詞：前者指單純輸入答案、輸出對錯判斷的運算單元；後者則包含該模型、題庫資料、教師介面與評分規則等整套組裝。下列敘述何者最能說明兩者的差異？",
    choices: [
      { id: "A", text: "AI系統其實是模型功能經過簡化後的版本，涵蓋的能力範圍比模型更少" },
      { id: "B", text: "模型與AI系統指的是同一個概念，兩者的用詞可以交替使用而不影響理解" },
      { id: "C", text: "模型負責「怎麼計算」，AI系統則把模型、資料、介面與規則組裝起來以完成任務" },
      { id: "D", text: "模型主要負責使用者介面與互動設計，AI系統則負責背後的運算邏輯部分" },
    ],
    answer: "C",
    explanation:
      "模型回答的是「怎麼計算」——給定輸入產生輸出；AI系統則是把模型、資料、介面與規則組裝起來，回答「如何完成任務」。批改模型只做對錯判斷的運算，批改系統則整合題庫、介面與評分規則，兩者層級不同，系統是比模型更完整的組裝，而非簡化版。",
    choiceExplanations: {
      A: "AI系統是把模型、資料、介面與規則整合起來以完成完整任務，涵蓋範圍比單一模型更完整，而非精簡版本。",
      B: "兩者是不同層級的概念——模型是運算單元，AI系統是整套組裝，用詞不同反映的是實質差異，並非可任意交替使用。",
      D: "描述剛好顛倒——介面屬於AI系統組裝的一部分，模型負責的是運算邏輯本身，並非模型負責介面設計。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["模型", "AI系統", "組裝"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若那套批改系統只剩模型本身、沒有題庫與教師介面，它就退回成模型——AI 系統的定義在於「組裝起來能完成任務」。",
    },
  },
  {
    id: "junior-ai-basics-practice-q010",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育科技公司評估要採用的AI工具，技術文件分別提到「基礎模型」「大型語言模型（LLM）」「多模態模型」三個詞，教學設計師想了解三者關係以挑選合適工具，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "多模態模型與LLM指的是相同的技術範圍，兩者名稱不同純屬行銷包裝上的差異" },
      { id: "B", text: "基礎模型是大規模預訓練的通用模型；LLM是處理文字的一支，多模態模型能處理多種資料型態" },
      { id: "C", text: "基礎模型這個詞專門指稱影像辨識類型的模型，與處理文字的LLM屬於不相關的技術" },
      { id: "D", text: "LLM是這三者中最上位的概念，基礎模型與多模態模型都是由LLM衍生出的子類技術" },
    ],
    answer: "B",
    explanation:
      "基礎模型指以大規模資料預訓練、可支援多種下游任務的通用模型；大型語言模型（LLM）是其中處理文字者，核心運作是依上下文預測下一個token；多模態模型則能共同理解或生成文字、影像、音訊、影片等多種型態的資料。三者關係是基礎模型為上位概念，LLM與多模態模型是依處理資料型態區分的下位類別。",
    choiceExplanations: {
      A: "多模態模型能處理文字以外的影像、音訊等多種型態資料，與僅處理文字的LLM技術範圍並不相同，並非只是行銷包裝差異。",
      C: "基礎模型並非專指影像模型，LLM本身正是以大規模文字資料預訓練而成的一種基礎模型。",
      D: "包含關係顛倒了——基礎模型才是上位概念，LLM與多模態模型是依處理資料型態區分出的下位類別。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["基礎模型", "LLM", "多模態模型"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若某個模型只為單一任務從頭訓練、無法支援其他下游任務，它就不是基礎模型——判準是能否作為多種下游任務的共同起點。",
    },
  },
  {
    id: "junior-ai-basics-practice-q011",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司的AI供應商提供「一般版」與「推理版」兩種模型，推理版在回答複雜的病蟲害防治規劃問題時準確度較高，但回應時間明顯變長、使用成本也提高。採購人員誤以為推理版必然是完全不同的模型架構，下列說明何者最能澄清這個誤解？",
    choices: [
      { id: "A", text: "推理模型與一般模型的差異，通常代表供應商換成了另一套獨立開發的神經網路架構" },
      { id: "B", text: "推理版回應時間比一般版長，這通常代表模型運作出現異常或故障，與是否為推理模型無關" },
      { id: "C", text: "推理模型在推論時投入較多計算以處理多步問題，因而伴隨延遲與成本上升，未必是換了不同架構" },
      { id: "D", text: "推理版的差異主要來自於命名與定價策略，實際運作方式與一般版並無差異" },
    ],
    answer: "C",
    explanation:
      "推理模型（Reasoning model）在推論時投入較多計算以處理多步問題，通常伴隨延遲與成本上升；同一家族的推理版與一般版可能共用底層模型，差異未必在於架構不同，而在於推論階段投入的計算量。推理版準確度較高但回應變慢、成本上升，正是這種特性的典型表現。",
    choiceExplanations: {
      A: "推理版與一般版的差異不必然是架構不同，同家族的兩者可能共用底層模型，只是推論時投入的計算量不同。",
      B: "回應時間變長是推理模型在推論時投入較多計算以處理多步問題的正常特性，並非故障徵兆。",
      D: "推理版與一般版在推論階段投入的計算量不同，導致準確度與回應時間有實質差異，並非只是命名或定價策略上的差異。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["推理模型", "推論時計算", "延遲與成本"],
      constraints: ["cost", "latency"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若延遲與成本上升卻沒換到多步問題的準確度提升，那就不是推理模型應有的取捨，該回頭懷疑部署設定或流量問題。",
    },
  },
  {
    id: "junior-ai-basics-practice-q101",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院同時評估三套系統：甲是資深醫師寫下的用藥禁忌規則庫；乙是以十萬張影像訓練的判讀模型；丙能依醫師的指令自行決定要先查檢驗值、再查藥歷，並依查到的結果調整下一步。資訊長要在採購文件上標明三者的技術層級與對應的驗證方式，下列安排何者最合理？",
    choices: [
      { id: "A", text: "三者都屬於機器學習，驗證方式一律以測試集準確率為準" },
      { id: "B", text: "丙因為能自行規劃，屬於強 AI，應以通用能力測驗驗證" },
      { id: "C", text: "甲為規則式 AI 應以規則覆蓋率驗證、乙為機器學習應以獨立測試集驗證、丙為 Agent 還須驗證其工具呼叫與行動的正確性" },
      { id: "D", text: "甲不屬於 AI，不需要任何驗證" },
    ],
    answer: "C",
    explanation:
      "三者分屬不同層級，驗證的對象也不同：規則庫要檢查規則是否涵蓋所有情況且彼此不衝突；模型要以未見過的資料估計泛化能力；Agent 除了底層模型，還多了「它決定去呼叫什麼、依結果怎麼調整」這一層，錯誤可能出在規劃而非判斷，必須單獨驗證。",
    choiceExplanations: {
      A: "甲的規則由人工撰寫、未經資料訓練，不符合機器學習的定義，也沒有測試集可用。",
      B: "能自行規劃步驟仍是在既定目標內運作，不具備跨領域自主學習能力，並未達到強 AI。",
      D: "規則式系統屬於人工智慧的一支，且用藥禁忌攸關病人安全，更需要嚴格驗證。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["規則式AI", "機器學習", "AI Agent", "驗證方式"],
      constraints: ["safety", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "L11102",
      decisionBoundary:
        "若丙的執行順序其實是寫死的、不會依查到的結果改變，它就退回成一般 AI 系統，不需要額外驗證行動規劃那一層。",
    },
  },
  {
    id: "junior-ai-basics-practice-q102",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行要為「自動生成客戶投資建議書初稿」與「判斷交易是否為盜刷」兩項需求選型。前者需輸出流暢的長段文字，後者需在 50 毫秒內給出是否攔截的判斷且必須可稽核。下列選型與理由何者最合理？",
    choices: [
      { id: "A", text: "建議書用生成式模型，盜刷判斷用鑑別式模型，因為兩者的輸出型態與延遲、稽核要求不同" },
      { id: "B", text: "兩項都用傳統分類模型，因為銀行業必須可解釋" },
      { id: "C", text: "兩項都用大型語言模型，統一技術棧可降低維運成本" },
      { id: "D", text: "依供應商報價決定，技術類型與需求無關" },
    ],
    answer: "A",
    explanation:
      "生成式模型擅長產出新內容，但逐 token 生成慢且輸出難以逐條稽核；鑑別式分類模型輸出單一判斷、延遲低且係數或路徑可追溯。兩項需求在輸出型態、延遲與稽核三個面向都相反，硬要統一技術棧會讓其中一項失敗。",
    choiceExplanations: {
      B: "傳統分類模型無法產出流暢的長段建議書文字，前一項需求會落空。",
      C: "大型語言模型的逐 token 生成無法滿足 50 毫秒的攔截判斷，稽核也困難。",
      D: "報價是採購考量，但技術類型不符需求時，再便宜也無法上線。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["生成式AI", "鑑別式AI", "延遲", "可稽核性"],
      constraints: ["latency", "explainability", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L11401",
      decisionBoundary:
        "若盜刷判斷改為離線的每日批次覆核、不再有 50 毫秒的限制，用生成式模型寫出可讀的可疑原因說明反而有價值。",
    },
  },
  {
    id: "junior-ai-basics-practice-q103",
    subjectId: "junior-ai-basics",
    prompt:
      "某農會導入一套系統，能依當日氣象與土壤資料「推估未來七天的病害風險指數」，另一套則能「從歷年紀錄中歸納出哪些條件組合最常伴隨病害發生」。若要向理事會說明兩者的角色分工，下列說明何者最恰當？",
    choices: [
      { id: "A", text: "前者是預測型 AI，後者是分析型 AI，兩者分別回答「將會如何」與「過去為何如此」" },
      { id: "B", text: "兩者都是預測型 AI，差別只在時間長短" },
      { id: "C", text: "前者是分析型 AI，後者是預測型 AI" },
      { id: "D", text: "兩者都屬於生成型 AI，因為都會產出報告" },
    ],
    answer: "A",
    explanation:
      "分野在時間方向：推估未來的風險指數屬於預測型，歸納歷史條件組合屬於分析型。兩者互補——分析找出可能的成因，預測把它用在還沒發生的日子上。",
    choiceExplanations: {
      B: "歸納歷史條件組合並未推估任何未來值，不屬於預測型。",
      C: "對應顛倒了，推估未來的才是預測型。",
      D: "生成型指的是產出訓練集中未曾出現的新內容，兩者的輸出都是既有資料的分析或推估。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["預測型AI", "分析型AI", "時間方向"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若第二套系統改成「依歸納出的條件自動撰寫一份防治建議書」，它就同時具備生成型的性質。",
    },
  },
  {
    id: "junior-ai-basics-practice-q104",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的技術文件把「模型」「AI 系統」「Agent」三個詞混用，導致採購時無法界定驗收範圍。若要釐清驗收邊界，下列做法何者最正確？",
    choices: [
      { id: "A", text: "三者都無法驗收，只能靠使用者滿意度" },
      { id: "B", text: "三者驗收方式相同，都以準確率為準" },
      { id: "C", text: "只驗收模型即可，其餘兩者是模型的包裝" },
      { id: "D", text: "模型驗收其預測品質，AI 系統驗收整套流程能否完成任務，Agent 另需驗收其自行規劃與呼叫工具的行為" },
    ],
    answer: "D",
    explanation:
      "三個詞指的是三個層級：模型是運算單元、AI 系統是把模型與資料介面規則組裝起來完成任務、Agent 再往上多了自行規劃與呼叫工具的編排層。層級不同，該驗的東西也不同，混用會讓驗收範圍無法界定。",
    choiceExplanations: {
      A: "三個層級各有可量測的驗收標準，滿意度只是其中一項補充。",
      B: "準確率只衡量模型的預測品質，無法驗收流程是否走得通或行動規劃是否正確。",
      C: "AI 系統的資料介接、規則與例外處理都可能出錯，不是模型的附屬包裝。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["模型", "AI系統", "Agent", "驗收範圍"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若採購的只是一支預測 API、串接與流程都由院內自行開發，驗收範圍就縮回模型那一層。",
    },
  },
  {
    id: "junior-ai-basics-practice-q105",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠評估兩種模型供應方案：方案一是通用的大型語言模型，方案二是專為瑕疵分類訓練的小模型。已知任務單一、每日推論百萬次、且產線網路頻寬有限。下列判斷何者最合理？",
    choices: [
      { id: "A", text: "選方案一，因為通用模型的能力較強" },
      { id: "B", text: "兩案並行，讓兩個模型互相投票" },
      { id: "C", text: "選方案二，任務單一時專用小模型在成本、延遲與可部署性上都占優勢" },
      { id: "D", text: "依模型參數量大小決定，越大越好" },
    ],
    answer: "C",
    explanation:
      "通用模型的優勢在於能處理沒見過的多樣任務，而這裡的任務固定、量大且要能部署在頻寬受限的現場。專用小模型在單位推論成本、延遲與端側部署三方面都明顯較佳，通用能力在此換不到相應價值。",
    choiceExplanations: {
      A: "通用能力在單一固定任務上用不到，卻要付出更高的推論成本與延遲。",
      B: "雙模型投票讓成本加倍、延遲更長，在任務單一時效益有限。",
      D: "參數量是規格而非目標，越大通常越慢也越貴。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["通用模型", "專用模型", "推論成本"],
      constraints: ["cost", "latency", "connectivity"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若任務會頻繁變動、每次都要重新定義瑕疵類別，通用模型的彈性就開始值錢，取捨會往方案一移動。",
    },
  },

  // ── L11102 AI 治理概念（11 題）──────────────────────────────────
  {
    id: "junior-ai-basics-practice-q012",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行法遵部門在規劃導入AI審核信用卡申請流程前，需先確認我國《人工智慧基本法》的施行狀態與主管機關，以評估合規時程。下列敘述何者正確？",
    choices: [
      { id: "A", text: "《人工智慧基本法》目前仍停留在行政院審議階段，尚未經立法院完成三讀程序" },
      { id: "B", text: "《人工智慧基本法》已於2026年1月14日公布施行，中央主管機關為國家科學及技術委員會" },
      { id: "C", text: "《人工智慧基本法》的規範對象限定於中央政府機關，民間企業不受其規範" },
      { id: "D", text: "《人工智慧基本法》施行後，中央主管機關改由金融監督管理委員會擔任" },
    ],
    answer: "B",
    explanation:
      "《人工智慧基本法》於2025年12月23日經立法院三讀通過，2026年1月14日總統公布施行，全文20條，中央主管機關為國家科學及技術委員會（地方為直轄市、縣市政府）。銀行在規劃AI審核流程時，應以此作為合規時程的依據。",
    choiceExplanations: {
      A: "本法已於2025年12月完成三讀、2026年1月由總統公布施行，並非仍停留在行政院審議階段。",
      C: "本法是規範人工智慧發展與應用的框架性法律，並非僅適用於中央政府機關，民間企業運用AI同樣受其原則性規範。",
      D: "本法的中央主管機關為國家科學及技術委員會，並非金融監督管理委員會；金管會另訂有金融業專屬的AI指引。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["人工智慧基本法", "中央主管機關"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若問的是金融業運用 AI 的具體規範，主管機關就換成金管會——基本法是框架法，各業別另有主管機關與指引。",
    },
  },
  {
    id: "junior-ai-basics-practice-q013",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院導入AI輔助診斷系統前，資訊治理委員會依《人工智慧基本法》第4條的七大基本原則檢視導入計畫是否周全，發現目前的計畫書只談到資安防護與模型準確率，未涵蓋其他面向。下列哪一組原則最完整對應第4條揭示的七大基本原則？",
    choices: [
      {
        id: "A",
        text: "永續發展與福祉、人類自主、隱私保護與資料治理、資安與安全、透明與可解釋、公平與不歧視、問責",
      },
      { id: "B", text: "永續發展與福祉、人類自主、資安與安全、成本效益、系統效能、公平與不歧視、問責" },
      { id: "C", text: "隱私保護與資料治理、資安與安全、透明與可解釋、公平與不歧視、問責、系統反應速度、使用者滿意度" },
      { id: "D", text: "人類自主、透明與可解釋、公平與不歧視、問責、資安與安全、市場競爭力、獲利能力" },
    ],
    answer: "A",
    explanation:
      "《人工智慧基本法》第4條揭示的七大基本原則為：永續發展與福祉、人類自主、隱私保護與資料治理、資安與安全、透明與可解釋、公平與不歧視、問責。醫院的AI治理計畫若只涵蓋資安與準確率，遺漏了隱私保護、透明可解釋、問責等原則，並不完整。",
    choiceExplanations: {
      B: "「成本效益」與「系統效能」並非第4條列出的基本原則，七大原則中應為隱私保護與資料治理、透明與可解釋，而非這兩項工程指標。",
      C: "「系統反應速度」與「使用者滿意度」並非第4條列出的基本原則，且此選項遺漏了永續發展與福祉、人類自主兩項。",
      D: "「市場競爭力」與「獲利能力」屬於商業經營指標，並非第4條揭示的基本原則，且此選項同時遺漏了永續發展與福祉、隱私保護與資料治理兩項原則。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["人工智慧基本法第4條", "七大基本原則"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把問題改成「導入專案該評估哪些面向」，成本效益與系統效能就是合理答案——它們是專案管理指標，只是不在第 4 條的法定原則裡。",
    },
  },
  {
    id: "junior-ai-basics-practice-q014",
    subjectId: "junior-ai-basics",
    prompt:
      "某跨國金融機構的歐洲分公司在評估一套用於徵信評分的AI系統是否受歐盟AI Act高風險義務規範前，法遵人員先確認AI Act的風險分級架構。下列敘述何者正確？",
    choices: [
      { id: "A", text: "歐盟AI Act的風險分級方式，實際上分為「合規」與「不合規」兩種結果，沒有中間風險等級" },
      { id: "B", text: "歐盟AI Act依風險分為不可接受、高風險、有限風險、最小風險四級，普遍性社會評分屬不可接受風險" },
      { id: "C", text: "歐盟AI Act的風險分級主要依系統的運算速度與資料處理量決定，與實際應用場景較無關聯" },
      { id: "D", text: "歐盟AI Act規範的對象限定於公部門使用的AI系統，民間金融機構的徵信系統不在規範範圍內" },
    ],
    answer: "B",
    explanation:
      "歐盟AI Act依風險程度分為不可接受風險（原則禁止，例如政府對國民的普遍性社會評分）、高風險、有限風險（課予透明義務）、最小風險四級。金融機構用於徵信評分的AI系統通常落在高風險等級，須留意對應義務與適用時程，而非只有合規與不合規兩種結果。",
    choiceExplanations: {
      A: "歐盟AI Act採四級風險分級（不可接受、高風險、有限風險、最小風險），並非只有合規與不合規兩種結果。",
      C: "風險分級是依應用場景與潛在危害程度決定，並非依運算速度或資料量這類技術指標判定。",
      D: "歐盟AI Act規範對象涵蓋公部門與民間，金融機構的徵信評分系統若屬高風險應用，同樣受規範。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["歐盟AI Act", "風險分級", "社會評分"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若同一套徵信系統只用於內部研究、不對申請人產生任何決策效果，風險等級就會下降——分級看的是用途與影響，不是技術本身。",
    },
  },
  {
    id: "junior-ai-basics-practice-q015",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院計畫在歐盟設有分院的急診部門導入一套AI檢傷分類（triage）系統，用來協助判斷病患就診的緊急優先順序；此類「緊急醫療服務的檢傷分類」應用屬於歐盟AI Act附錄III所列的高風險系統類型。醫院法務部門原本以為附錄III所列的高風險義務將於2026年8月2日全面適用，需重新確認實際時程。下列敘述何者正確？",
    choices: [
      { id: "A", text: "附錄III所列高風險義務的原訂時程並未調整，仍自2026年8月2日起全面適用" },
      { id: "B", text: "所有高風險義務，含第50條透明義務，都已一併延後至2028年8月2日才適用" },
      { id: "C", text: "本次延後的對象是附錄I所列的嵌入型系統，附錄III所列的獨立型系統時程維持不變" },
      { id: "D", text: "附錄III高風險義務延至2027年12月2日適用，第50條透明義務仍自2026年8月2日起適用" },
    ],
    answer: "D",
    explanation:
      "歐盟AI Act附錄III所列的高風險系統（含緊急醫療服務的檢傷分類應用）原訂於2026年8月2日適用的義務，經Digital Omnibus on AI（Regulation (EU) 2026/1744）延後至2027年12月2日；附錄I所列的嵌入型高風險系統則延至2028年8月2日。第50條的透明義務不受此次延後影響，仍自2026年8月2日起適用。這套急診檢傷分類AI屬附錄III所列的高風險系統，其義務時程因而延至2027年12月2日。",
    choiceExplanations: {
      A: "附錄III所列高風險系統的義務時程已因Digital Omnibus on AI延後至2027年12月2日，並非維持原訂2026年8月2日全面適用。",
      B: "第50條透明義務並未隨高風險義務一併延後，仍自2026年8月2日起適用，並非延至2028年8月2日。",
      C: "本次延後同時涵蓋附錄III獨立型系統（延至2027年12月2日）與附錄I嵌入型系統（延至2028年8月2日），並非只有嵌入型系統的時程調整。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["歐盟AI Act", "附錄III", "適用時程"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若該應用不在附錄 III 而屬於附錄 I 的嵌入型系統，適用時程就變成 2028 年 8 月 2 日——延後的期限依附錄別而不同。",
    },
  },
  {
    id: "junior-ai-basics-practice-q016",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行推出AI理財顧問服務，法遵人員依金管會《金融業運用人工智慧（AI）指引》檢視應揭露給客戶的事項，草擬的公告中列出「AI是否參與服務」「服務用途與限制」「申訴管道」，並考慮是否需一併公開模型原始程式碼供客戶查閱。下列說明何者正確？",
    choices: [
      { id: "A", text: "依指引規定，銀行必須公開理財AI模型的原始程式碼與完整訓練資料內容，才符合透明性原則" },
      { id: "B", text: "只要客戶事後才主動提出詢問，銀行便不需要在服務過程中主動告知AI之使用情形" },
      { id: "C", text: "指引要求揭露的內容只限於「是否使用AI」一項，公告不需說明服務限制或申訴管道" },
      {
        id: "D",
        text: "指引要求於直接與消費者互動時揭露AI之使用，揭露事項為用途、限制、申訴管道等消費者能理解的資訊",
      },
    ],
    answer: "D",
    explanation:
      "金管會《金融業運用人工智慧（AI）指引》要求機構於直接與消費者互動時揭露AI之使用，揭露的對象是消費者能理解的資訊，例如有無AI參與、用途、限制與申訴管道，而不需要公開模型原始程式碼或完整訓練資料——這是這類題目最常見的誤解。",
    choiceExplanations: {
      A: "指引明訂不需公開模型原始程式碼或完整訓練資料，把透明性誤解為公開技術細節是常見的錯誤選項。",
      B: "指引要求機構於直接與消費者互動時主動揭露AI之使用，並非等客戶主動要求才需揭露。",
      C: "指引揭露義務的內容應涵蓋用途、限制與申訴管道等消費者能理解的資訊，並非只揭露「是否使用AI」一項。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["金融業AI指引", "透明性", "揭露義務"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若揭露對象改成主管機關的金檢而非消費者，需要提供的資訊就會深入到模型與資料層次——揭露的深度隨對象而變。",
    },
  },
  {
    id: "junior-ai-basics-practice-q017",
    subjectId: "junior-ai-basics",
    prompt:
      "某證券商規劃導入AI選股輔助工具，法遵部門依金管會《金融業運用人工智慧（AI）指引》檢視應具備哪些治理措施，董事會提出「每日公開系統運作狀況供社會大眾檢視」作為主要合規方案，法遵主管認為此方案並非指引明訂的必要措施。下列何者才是指引明訂、機構應具備的治理措施？",
    choices: [
      { id: "A", text: "建立內部治理架構、指定專責單位或人員，並於直接與消費者互動時揭露AI之使用" },
      { id: "B", text: "指引規定機構應每日公布AI系統的運作狀況數據，供社會大眾公開檢視" },
      { id: "C", text: "指引規定機構只需取得主管機關的個案核准即可上線，不必另外建立內部治理架構" },
      { id: "D", text: "指引規定的治理措施集中於系統上線後的事後稽核，上線前不需要任何內部審查程序" },
    ],
    answer: "A",
    explanation:
      "金管會《金融業運用人工智慧（AI）指引》要求機構建立內部治理架構、指定專責單位或人員，並於直接與消費者互動時揭露AI之使用；「每日公布系統運作狀況」並非指引明訂的治理措施，屬於過度延伸的誤解。",
    choiceExplanations: {
      B: "「每日公布人工智慧系統運作狀況」並非指引明訂的治理措施，是常見的誤解選項，指引真正要求的是建立內部治理架構與專責單位。",
      C: "指引要求機構自行建立內部治理架構與專責單位，並非只需取得主管機關個案核准、不必建立內部治理機制。",
      D: "指引要求的內部治理架構應涵蓋系統上線前的規劃與治理，並非只集中於上線後的事後稽核。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["金融業AI指引", "內部治理架構", "專責單位"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若機構完全不直接面對消費者（例如只做後台清算），揭露義務的觸發條件就不成立，但內部治理架構仍然要建。",
    },
  },
  {
    id: "junior-ai-basics-practice-q018",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院採購一套AI輔助診斷系統前，依規定送交數位發展部AI產品與系統評測中心（AIEC）進行評測，廠商提供的效能報告強調系統「回應速度快、介面操作流暢」，評測人員認為這些指標不在AIEC的主要評測構面內。下列何者屬於AIEC的主要評測構面？",
    choices: [
      { id: "A", text: "效率性、互動性、相容性、易用性、擴充性" },
      { id: "B", text: "準確性、可靠性、效率性、互動性、資安" },
      { id: "C", text: "準確性、可靠性、公平性、隱私、資安" },
      { id: "D", text: "可靠性、公平性、隱私、資安、系統效能" },
    ],
    answer: "C",
    explanation:
      "數位發展部AI產品與系統評測中心（AIEC）的主要評測構面為準確性、可靠性、公平性、隱私、資安。效率、互動性、相容性、易用性、擴充性、系統效能等屬於產品體驗或工程指標，不在AIEC的可信任AI評測構面之內；即使選項中混入部分正確構面，只要摻雜了不在清單內的項目，就不是完整正確的答案。",
    choiceExplanations: {
      A: "這五項都屬於軟體工程或使用體驗常見的品質屬性，但全部不在AIEC以準確性、可靠性、公平性、隱私、資安為核心的評測構面內。",
      B: "雖然準確性、可靠性、資安屬於AIEC評測構面，但效率性與互動性並不在其中，混入這兩項就不是完整正確的清單。",
      D: "雖然可靠性、公平性、隱私、資安屬於AIEC評測構面，但系統效能並不在其中，混入這一項就不是完整正確的清單。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["AIEC", "評測構面"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若採購評估要看的是使用體驗，效率與易用性就是合理指標——它們只是不在 AIEC 的五個評測構面裡。",
    },
  },
  {
    id: "junior-ai-basics-practice-q019",
    subjectId: "junior-ai-basics",
    prompt:
      "某金融科技公司同時規劃三種AI輔助流程的人類監督機制：（一）一般帳戶餘額查詢由AI直接回覆，公司僅在系統整體層級決定要不要啟用這項功能；（二）大額匯款交易由AI產出建議金額與收款帳戶，需經行員逐筆核准後才會執行；（三）日常小額消費異常偵測由AI自主判斷並攔截可疑交易，風控人員在後台持續監看、可隨時介入解除。技術主管想確認這三種情境各自適合對應到哪個人類監督層級，下列對應何者正確？",
    choices: [
      { id: "A", text: "（一）對應Human-in-command、（二）對應Human-in-the-loop、（三）對應Human-over-the-loop" },
      { id: "B", text: "（一）對應Human-in-the-loop、（二）對應Human-over-the-loop、（三）對應Human-in-command" },
      { id: "C", text: "三種情境不論風險高低或是否可逆，都應統一採用Human-in-the-loop逐筆核准的監督層級" },
      { id: "D", text: "（一）對應Human-over-the-loop、（二）對應Human-in-command、（三）對應Human-in-the-loop" },
    ],
    answer: "A",
    explanation:
      "人類監督可分三個層級：Human-in-command是人類保留是否啟用、停用整套系統的最終權力，適合風險低、可逆的一般查詢功能；Human-in-the-loop是每筆決策都需人工事前核可才生效，適合大額匯款這類不可逆的高風險決策；Human-over-the-loop是AI自主運行、人類持續監督並可隨時介入修正，適合風險中等、需要即時反應的異常偵測情境。三種情境應依風險與可逆性搭配對應的監督層級，而非一律採用同一層級。",
    choiceExplanations: {
      B: "對應錯置——大額匯款屬不可逆的高風險決策，應採事前逐筆核可的Human-in-the-loop，而非事中監看的Human-over-the-loop；一般查詢功能才適合Human-in-command。",
      C: "監督層級應依風險高低與決策可逆性搭配選擇，一律採用逐筆核准會讓低風險的日常查詢流程失去效率，也不符合分層治理的精神。",
      D: "對應同樣錯置——一般查詢功能風險低，適合Human-in-command而非需要持續監看的Human-over-the-loop；大額匯款則需要事前逐筆核可的Human-in-the-loop，而非最終權力層級的Human-in-command。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["人類監督", "Human-in-the-loop", "Human-over-the-loop", "Human-in-command"],
      constraints: ["risk_priority", "governance"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若大額匯款改成可在 24 小時內無條件撤回，決策就從不可逆變成可逆，監督層級可以下修到 Human-over-the-loop。",
    },
  },
  {
    id: "junior-ai-basics-practice-q020",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院部署AI輔助用藥劑量建議系統，設計上要求每一筆建議劑量都須經藥師核可後才能執行，藥師若不核可則系統不會送出建議；院方在教育訓練中說明這種監督層級的名稱與特性。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這種設計屬於Human-over-the-loop，特徵是AI自主運行、人類持續監督並可隨時介入修正" },
      { id: "B", text: "這種設計屬於Human-in-command，特徵是人類保留的是啟用或停用整套系統的最終權力" },
      { id: "C", text: "這種設計其實不需要藥師逐筆參與核可，因為AI建議的準確度已經足夠可靠、值得信賴" },
      { id: "D", text: "這種設計屬於Human-in-the-loop，特徵是每筆決策都需人工確認後才生效" },
    ],
    answer: "D",
    explanation:
      "Human-in-the-loop指每筆決策都需人工確認後才生效。此用藥劑量建議系統要求每一筆建議都經藥師核可後才執行，若未核可則不會送出，正符合Human-in-the-loop「事前逐筆核可」的特徵；相對地，Human-over-the-loop是AI自主運行、人類持續監督並可隨時介入修正，屬於「事中監看」，與本題的「事前核可」機制不同。",
    choiceExplanations: {
      A: "Human-over-the-loop確實是AI自主運行、人類持續監督可介入修正，但此系統要求每筆決策都須先經藥師核可才執行，屬於事前逐筆核可的Human-in-the-loop，而非事中監督的Human-over-the-loop。",
      B: "Human-in-command是人類保留啟用或停用整套系統的最終權力，層級比逐筆核可更高，與本題描述的逐筆核可機制不同。",
      C: "用藥劑量涉及病人安全的高風險決策，不能省略人類核可這一步，此系統的設計正是為了確保人類逐筆把關。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Human-in-the-loop", "逐筆核可"],
      constraints: ["safety"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若改成藥師只在系統送出後抽查、不核可也不影響送出，它就變成 Human-over-the-loop。",
    },
  },
  {
    id: "junior-ai-basics-practice-q021",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的AI反詐欺系統原採Human-in-the-loop設計，每筆凍結帳戶的建議都須經風控人員逐筆核可才會執行；因交易量暴增導致核可延遲、詐欺損失擴大，管理層考慮改為「AI自主凍結可疑帳戶、風控人員持續監看並可隨時介入解除」的設計。下列說明何者最正確？",
    choices: [
      { id: "A", text: "新設計仍應歸類為Human-in-the-loop，因為風控人員仍然會查看並確認系統做出的判斷結果" },
      { id: "B", text: "新設計屬於Human-over-the-loop：人類不再逐筆事前核可，而是在AI自主運行時持續監督並可隨時介入" },
      { id: "C", text: "新設計等於大幅移除了人類監督機制，風控人員的角色已完全與治理架構脫鉤，形同放棄監督責任" },
      { id: "D", text: "Human-in-the-loop與Human-over-the-loop的風險控管效果並無差異，改與不改結果相同" },
    ],
    answer: "B",
    explanation:
      "Human-in-the-loop是每筆決策都需人工事前確認才生效；Human-over-the-loop則是AI自主運行、人類持續監督並可隨時介入修正。銀行改為「AI自主凍結、風控人員持續監看並可介入解除」，已從事前逐筆核可轉為事中監督，正是Human-over-the-loop的特徵，兩者在核可時點與人類角色上有實質差異。",
    choiceExplanations: {
      A: "風控人員不再於AI執行前逐筆核可，而是在AI已自主執行後監看並視需要介入，這已不符合Human-in-the-loop「事前確認才生效」的定義。",
      C: "風控人員雖不再逐筆事前核可，但仍持續監督並保有隨時介入解除的權力，這正是治理設計的一部分，並非大幅移除人類監督。",
      D: "兩者的核可時點不同——Human-in-the-loop是事前逐筆核可，Human-over-the-loop是事中監看可介入，對不可逆風險的控管效果有實質差異，並非結果相同。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["Human-over-the-loop", "監督層級", "風險取捨"],
      constraints: ["risk_priority", "latency"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若凍結改成不可撤銷、且錯誤凍結會造成重大損害，即使核可會塞車也不該下修到事後監督——可逆性是這個取捨成立的前提。",
    },
  },
  {
    id: "junior-ai-basics-practice-q022",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院的AI輔助診斷系統上線半年後，資訊治理委員會檢討三起爭議案例：案例一是主治醫師無法理解系統判斷某病患為高風險的具體依據；案例二是系統對特定族裔病患的誤診率顯著高於其他族裔；案例三是病患的診斷資料未經告知同意即被用於模型再訓練。委員會欲將三起案例分別對應到AI倫理的核心原則，下列對應何者正確？",
    choices: [
      { id: "A", text: "案例一對應公平性、案例二對應隱私性、案例三對應透明性" },
      { id: "B", text: "案例一對應透明性、案例二對應公平性、案例三對應隱私性" },
      { id: "C", text: "三起案例的核心爭議其實都同屬隱私性範疇，與透明性、公平性較無關聯" },
      { id: "D", text: "案例一對應問責性、案例二對應可靠性與安全性、案例三對應透明性" },
    ],
    answer: "B",
    explanation:
      "AI倫理常見核心原則包含透明性（可說明決策依據）、公平性（不因族群產生系統性差別待遇）、隱私性（合法蒐集、告知同意）等。案例一是醫師無法理解判斷依據，對應透明性；案例二是特定族裔誤診率顯著偏高，對應公平性（模型判斷錯誤本身不必然是公平性問題，只有錯誤在不同群體間分布不均時才是）；案例三是未告知即用於再訓練，對應隱私性（未告知的資料再利用屬隱私而非透明）。",
    choiceExplanations: {
      A: "對應錯置——案例一的「無法理解判斷依據」對應的是透明性而非公平性，案例三的「未告知即再訓練」對應的是隱私性而非透明性。",
      C: "三起案例分別對應透明性、公平性、隱私性三個不同原則，並非全部同屬隱私性範疇。",
      D: "案例一的「無法理解判斷依據」對應透明性而非問責性；案例二的「誤診率因族裔而異」對應公平性而非可靠性與安全性。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["AI倫理", "透明性", "公平性", "隱私性"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若案例一改成「醫師看得懂依據，但誤診後沒人能負責」，對應的原則就從透明性移到問責性。",
    },
  },
  {
    id: "junior-ai-basics-practice-q106",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的 AI 貸款系統採 Human-over-the-loop：模型自動核准小額貸款，風控人員事後抽查並可撤銷。上線三個月後發現風控人員因案量過大，抽查比例已降到千分之一，且從未撤銷過任何一筆。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "抽查比例低但流程仍在，治理設計沒有問題" },
      { id: "B", text: "從未撤銷代表模型判斷完全正確，可以取消抽查" },
      { id: "C", text: "應改為 Human-in-command，只保留停用整套系統的權力" },
      { id: "D", text: "監督已名存實亡，應重新評估抽查量能或把不可逆的高風險案件改回事前核可" },
    ],
    answer: "D",
    explanation:
      "監督層級不是寫在文件上就成立，它要靠實際的量能支撐。抽查降到千分之一、且從未撤銷，代表這道關卡已經不會攔下任何東西。正確的處置是回頭校準：補足量能，或把撤銷成本最高的那些案件改回逐筆事前核可。",
    choiceExplanations: {
      A: "流程存在但實際上不發生作用，等於沒有監督，這正是治理最容易失效的形態。",
      B: "從未撤銷也可能是抽查樣本太小而根本沒抽到問題案件，不能倒推模型正確。",
      C: "往上調到只保留啟停權會讓監督更弱，與問題的方向相反。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["人類監督", "Human-over-the-loop", "量能"],
      constraints: ["governance", "risk_priority"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若這些貸款可在核准後 24 小時內無條件撤銷、且金額極小，事後抽查的強度確實可以放寬——監督強度該隨可逆性與損害上限而定。",
    },
  },
  {
    id: "junior-ai-basics-practice-q107",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院的 AI 檢傷系統同時要滿足三項要求：歐盟 AI Act 的高風險義務、我國《人工智慧基本法》第 4 條的原則、以及院內醫療品質稽核。專案經理主張「先做完歐盟的文件，其餘自然涵蓋」。下列評估何者最正確？",
    choices: [
      { id: "A", text: "歐盟 AI Act 最嚴格，做完必然涵蓋其餘兩者" },
      { id: "B", text: "三者的規範對象與細節不同，應先盤點各自要求並找出交集與缺口，而非假設涵蓋" },
      { id: "C", text: "我國法規為框架性原則，不需具體落實" },
      { id: "D", text: "院內稽核屬於內部事務，不需與法規一併規劃" },
    ],
    answer: "B",
    explanation:
      "三套要求的來源與著眼點不同：歐盟 AI Act 針對高風險系統課予資料治理與人為監督等義務、基本法揭示七大原則、院內稽核關注臨床品質與病安。以「最嚴的做完就涵蓋」為前提，最容易漏掉的正是彼此沒有交集的那幾項。",
    choiceExplanations: {
      A: "嚴格程度不等於涵蓋範圍，各套規範關注的面向並不完全重疊。",
      C: "框架性原則仍須在具體制度中落實，否則就只是宣示。",
      D: "院內稽核與法規要求常有重疊，分開規劃會造成重工與遺漏。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["多重法遵", "要求盤點", "缺口分析"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若該系統完全不在歐盟境內提供服務，歐盟 AI Act 就不適用，盤點的範圍會縮小到國內法規與院內稽核。",
    },
  },
  {
    id: "junior-ai-basics-practice-q108",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育局的 AI 入學分發系統被家長質疑不公。稽核發現：模型本身未使用任何個人背景欄位，但使用了「國中畢業學校代碼」。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "未使用個人背景欄位即符合公平，質疑無據" },
      { id: "B", text: "應把學校代碼改為亂數編碼即可解決" },
      { id: "C", text: "學校代碼可能是社經背景的代理變數，須檢視各群體的分發結果是否存在系統性差異" },
      { id: "D", text: "公平性只需在模型上線後由家長申訴時處理" },
    ],
    answer: "C",
    explanation:
      "移除敏感欄位不等於消除歧視。學區與家戶社經背景高度相關，學校代碼因此可能把被移除的資訊間接帶回模型。判斷有沒有問題不能只看用了什麼欄位，要看不同群體的實際結果是否出現系統性落差。",
    choiceExplanations: {
      A: "這正是「無感知即公平」的常見誤解，代理變數會讓效果依然存在。",
      B: "改成亂數編碼只是換個代號，模型仍能從中學到同一組學校的共同傾向。",
      D: "偏誤在資料與設計階段就已埋入，等到申訴才處理，受影響的分發已經發生。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["代理變數", "間接歧視", "群體結果檢視"],
      constraints: ["fairness", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若檢視後發現各群體的分發結果在條件相同者之間並無落差，學校代碼就只是承載了學力資訊而非社經背景，質疑即可釐清。",
    },
  },
  {
    id: "junior-ai-basics-practice-q109",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠導入 AI 品檢後，決定把「模型判定為良品」的產品直接出貨、不再人工複檢。品保主管要求先評估此變更的風險。下列評估重點何者最關鍵？",
    choices: [
      { id: "A", text: "模型的訓練時間是否足夠長" },
      { id: "B", text: "供應商的品牌知名度" },
      { id: "C", text: "模型檔案的儲存格式" },
      { id: "D", text: "漏檢的瑕疵品流到客戶端的後果，以及是否有下游關卡能攔下" },
    ],
    answer: "D",
    explanation:
      "取消人工複檢等於把最後一道關卡拿掉，風險評估的核心是「錯了會怎樣、還有沒有人接得住」。若下游沒有任何攔截機制、且流出的後果嚴重，就不該取消；若客戶端有進料檢驗可攔，風險就大幅下降。",
    choiceExplanations: {
      A: "訓練時間長短與漏檢率沒有直接關係，該看的是實測的召回率。",
      B: "品牌知名度不能替代對實際後果的評估。",
      C: "儲存格式屬於工程細節，與風險等級無關。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["風險評估", "人工複檢", "下游攔截"],
      constraints: ["risk_priority", "quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      crossNode: "L11302",
      decisionBoundary:
        "若客戶端本來就有嚴格的進料全檢，漏檢的後果被下游吸收，取消內部複檢的風險就落到可接受的範圍。",
    },
  },
  {
    id: "junior-ai-basics-practice-q110",
    subjectId: "junior-ai-basics",
    prompt:
      "某證券商要為 AI 選股工具建立治理文件。下列哪一組內容最能支撐日後的稽核與爭議釐清？",
    choices: [
      { id: "A", text: "模型版本、訓練資料範圍、每次建議的輸入與輸出紀錄、以及人工覆核的紀錄" },
      { id: "B", text: "開發團隊的人數與會議次數" },
      { id: "C", text: "程式碼的註解密度與命名規範" },
      { id: "D", text: "每月的系統上線時數統計" },
    ],
    answer: "A",
    explanation:
      "稽核要回答的是「那一天為什麼給出這個建議、誰看過、依據哪一版模型」。版本、資料範圍、輸入輸出與覆核紀錄四者齊全，才有辦法回溯重現；缺任何一項，爭議就無從釐清。",
    choiceExplanations: {
      B: "投入程度不能說明個別建議的產生依據。",
      C: "程式風格影響維護便利性，與個案的可追溯性無關。",
      D: "上線時數是可用性指標，不涉及判斷依據。",
    },
    topic: "L11102 AI 治理概念",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["可追溯性", "稽核紀錄", "模型版本"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若輸入含高度敏感的客戶持股明細、不宜長期保存，就要改存去識別化後的摘要或雜湊，在可追溯與隱私之間取得平衡。",
    },
  },

  // ── L11201 資料基本概念與來源（11 題）────────────────────────────
  {
    id: "junior-ai-basics-practice-q023",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的核心交易系統將每筆匯款記錄存放在具有固定欄位（帳號、金額、時間、幣別）的關聯式資料庫資料表中，欄位型態與長度事先定義完成；資料工程師欲向新進同仁說明這類資料的分類。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "資料的欄位是否固定，只會影響儲存所需的硬碟空間大小，與資料型態判別無關" },
      { id: "B", text: "這類資料屬於半結構化資料，因為關聯式資料庫本身即為半結構化的儲存形式" },
      { id: "C", text: "這類資料的欄位型態事先定義完成，屬於結構化資料，適合以資料表儲存" },
      { id: "D", text: "這類資料因儲存於資料庫中，本質上屬於非結構化資料，需先經過欄位解析才能使用" },
    ],
    answer: "C",
    explanation:
      "結構化資料具有事先定義好的欄位與型態，能整齊地存放在關聯式資料庫的資料表中，此銀行交易紀錄正符合此特徵，屬於結構化資料；非結構化資料指無固定格式者（如文字、影像），半結構化資料則介於兩者之間（如JSON、XML），皆與此情境不符。",
    choiceExplanations: {
      A: "是否具有事先定義的固定欄位與型態，正是判別結構化與否的核心依據，並非無關。",
      B: "半結構化資料指沒有固定欄位、但仍帶有標籤或層級（如JSON、XML）的資料，關聯式資料庫的固定欄位資料表屬於結構化資料，並非半結構化。",
      D: "資料存放於資料庫中且具有固定欄位定義，正是結構化資料的典型特徵，並非非結構化資料。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["結構化資料", "關聯式資料庫"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若同一批交易紀錄改以每筆附加不同欄位的 JSON 存放，它就退成半結構化——判準是欄位是否事先固定，不是存在哪裡。",
    },
  },
  {
    id: "junior-ai-basics-practice-q024",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠的設備監控系統將每次警報事件輸出為JSON格式紀錄，每筆紀錄包含設備代號、時間戳記、警報等級等欄位，但不同設備類型附加的欄位數量與名稱並不完全相同；資料團隊欲判斷這類紀錄屬於哪種資料型態。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "不同設備附加欄位不同，代表這類資料本質上屬於非結構化資料，不具備格式規則" },
      { id: "B", text: "這類資料帶有標籤但欄位不固定，屬於半結構化資料，格式如JSON、XML" },
      { id: "C", text: "因為每筆紀錄都有時間戳記與設備代號欄位，這類資料應歸類為結構化資料" },
      { id: "D", text: "這類紀錄因為儲存為文字檔案，性質上應歸類為非結構化資料" },
    ],
    answer: "B",
    explanation:
      "半結構化資料指帶有標籤、層級或巢狀結構，但欄位不像關聯式資料庫那樣完全固定的資料，JSON、XML是典型格式。此警報紀錄雖有共同欄位，但不同設備附加欄位不一，不符合結構化資料要求所有紀錄欄位完全一致的特性，也非全無格式規則的非結構化資料，應歸類為半結構化資料。",
    choiceExplanations: {
      A: "這類資料仍具備欄位標籤與層級（JSON鍵值結構），並非全無格式規則，因此不屬於非結構化資料，而是半結構化資料。",
      C: "結構化資料要求所有紀錄的欄位型態與數量完全一致，此處不同設備附加欄位並不相同，不符合完全結構化的定義。",
      D: "判別依據是資料是否具有標籤化的層級結構，而非儲存的檔案格式本身；JSON雖以文字檔儲存，仍帶有明確的欄位標籤，屬半結構化而非非結構化。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["半結構化資料", "JSON", "欄位不固定"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若所有設備都被要求輸出完全相同的欄位集合，這批資料就變成結構化——半結構化的關鍵是「有標籤但欄位不固定」。",
    },
  },
  {
    id: "junior-ai-basics-practice-q025",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業合作社使用空拍機定期拍攝田區影像，用以評估作物生長狀況；這些影像檔案沒有預先定義的欄位或標籤結構。資料團隊欲說明這類影像資料的分類。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "影像資料經過壓縮處理後，就會具備固定的欄位與標籤結構，成為結構化資料" },
      { id: "B", text: "這類影像資料沒有固定欄位或標籤，屬於非結構化資料，需靠影像辨識判讀" },
      { id: "C", text: "影像檔案帶有拍攝時間與地點的中繼資料，因此應歸類為結構化資料" },
      { id: "D", text: "影像資料因檔案較大，判別型態的依據是檔案大小而非有無固定欄位結構" },
    ],
    answer: "B",
    explanation:
      "非結構化資料指沒有預先定義欄位或固定格式的資料，例如影像、音訊、自由文字，通常需仰賴影像辨識、自然語言處理等技術才能萃取資訊。空拍影像本身不具備欄位結構，即使檔案帶有拍攝時間等中繼資料，影像內容本體仍屬非結構化資料。",
    choiceExplanations: {
      A: "壓縮只改變儲存方式，不會為影像資料建立起欄位與標籤的結構，壓縮後的影像仍屬非結構化資料。",
      C: "少量中繼資料（如拍攝時間）不能使整份影像檔案轉為結構化資料，判別依據是影像內容本身是否具有固定欄位結構，而非有無附帶中繼資料。",
      D: "判別結構化與否的依據是資料有無固定欄位與格式規則，與檔案大小無關，即使是小檔案的自由格式文字仍屬非結構化資料。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["非結構化資料", "影像"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若先以影像辨識把每張空拍圖轉成「田區代號＋病害等級＋面積」的表格，產出的那份資料就是結構化的了。",
    },
  },
  {
    id: "junior-ai-basics-practice-q026",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠在產線上部署數千個感測器，每秒鐘產生的量測數據總量高達數GB，遠超過人工檢視所能負荷；工程團隊在導入大數據分析平台前，欲以5V架構向管理層說明這項特徵屬於哪一個構面。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這項特徵屬於Volume（數量），指資料規模龐大到超出傳統處理方式負荷" },
      { id: "B", text: "這項特徵屬於Veracity（真實性），因為資料量龐大代表其可信度較高" },
      { id: "C", text: "這項特徵屬於Variety（多樣性），因為感測器數量多、資料種類自然增加" },
      { id: "D", text: "這項特徵屬於Value（價值），因為資料量越大代表能萃取出的商業價值越高" },
    ],
    answer: "A",
    explanation:
      "大數據5V中的Volume（數量）指資料規模龐大，超出傳統系統或人工處理能力，此工廠感測器每秒產生數GB數據、遠超人工檢視負荷，正是Volume的典型特徵；資料量大不等於真實性高（Veracity）或價值高（Value），感測器數量多也不必然代表資料種類（Variety）增加。",
    choiceExplanations: {
      B: "Veracity（真實性）指資料是否可信、有無雜訊或誤差，與資料量的大小是兩個不同構面，資料量大不代表可信度較高。",
      C: "Variety（多樣性）指資料型態與來源的種類多寡，此情境描述的是「量測數據總量龐大」，是規模問題而非種類問題，屬於Volume而非Variety。",
      D: "Value（價值）指從資料中萃取出的商業效益，資料量龐大只是原始素材多，未必等於能萃取的價值也隨之提高，兩者屬不同構面。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["大數據5V", "Volume"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若情境改成「感測器種類從溫度擴增到影像與音訊」，同一批資料要談的構面就從 Volume 換成 Variety。",
    },
  },
  {
    id: "junior-ai-basics-practice-q027",
    subjectId: "junior-ai-basics",
    prompt:
      "某證券商的高頻交易系統每毫秒都會產生新的報價與成交紀錄，系統必須即時處理這些資料流才能掌握市場變化；風控部門欲以5V架構描述這項特徵。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這項特徵屬於Velocity（速度），指資料產生與處理的速度極快，須即時反應" },
      { id: "B", text: "這項特徵屬於Volume（數量），因為每毫秒產生資料，代表資料總量必定達到大數據等級" },
      { id: "C", text: "這項特徵屬於Value（價值），因為即時處理的資料通常比歷史資料更具商業價值" },
      { id: "D", text: "這項特徵屬於Variety（多樣性），因為報價與成交紀錄是兩種不同型態的資料" },
    ],
    answer: "A",
    explanation:
      "大數據5V中的Velocity（速度）指資料產生、傳輸與需要被處理的速度極快，往往須即時或近即時反應，高頻交易系統每毫秒產生新報價、需即時處理正是典型的Velocity特徵；報價與成交紀錄同屬數值型資料、型態相近，較難直接歸為Variety，資料速度快也不代表總量必然最大或價值必然更高。",
    choiceExplanations: {
      B: "資料產生速度快不代表資料總量（Volume）必定達到大數據等級，速度與數量是不同構面，須分別評估。",
      C: "即時處理雖有助掌握市場先機，但「處理速度快」本身與「資料價值高低」是兩個不同構面，不能直接畫上等號。",
      D: "Variety（多樣性）指資料型態與來源的種類多寡，報價與成交紀錄同屬數值型的交易資料，型態相近，此情境描述的重點是處理速度極快，屬於Velocity而非Variety。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["大數據5V", "Velocity"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若系統改成每日收盤後才批次結算，速度就不再是瓶頸，該談的構面會轉向 Volume 或 Value。",
    },
  },
  {
    id: "junior-ai-basics-practice-q028",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業合作社同時蒐集氣象資料（數值時序）、土壤感測器讀數（數值時序）、田區空拍影像（影像檔）與農民巡田筆記（自由文字）四種資料，欲整合分析以提升產量預測；資料團隊以5V架構描述這種資料組合的特徵。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這種特徵屬於Veracity（真實性），因為來源種類多，資料的可信程度會隨之提高" },
      { id: "B", text: "這種特徵屬於Velocity（速度），因為四種資料來源同時蒐集，代表處理速度極快" },
      { id: "C", text: "這種特徵屬於Volume（數量），來源種類的多寡決定了資料總量是否達到大數據等級" },
      { id: "D", text: "這種特徵屬於Variety（多樣性），指資料型態與來源多元，涵蓋數值與影像格式" },
    ],
    answer: "D",
    explanation:
      "大數據5V中的Variety（多樣性）指資料型態與來源種類多元，可能涵蓋結構化數值、影像、文字等不同格式。此情境同時蒐集數值時序、影像檔與自由文字三種不同型態的資料，正是Variety的典型特徵；同時蒐集不代表處理速度必然極快（Velocity），來源種類多也不保證可信度（Veracity）或總量（Volume）會隨之提高。",
    choiceExplanations: {
      A: "Veracity（真實性）指資料本身有無雜訊或誤差，來源種類多寡與資料可信度高低並無必然關聯，農民手寫筆記反而可能主觀誤差較大。",
      B: "資料來源種類多與處理速度快慢是不同構面，同時蒐集多種資料不代表必須即時處理，此情境的重點在型態多元而非速度。",
      C: "來源種類多不會自動使資料總量達到大數據規模，資料量大小仍取決於實際蒐集的筆數與頻率，兩者是不同構面。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["大數據5V", "Variety"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若四種來源其實全是數值時序、只是欄位名稱不同，多樣性就不成立，問題會回到資料整合而非型態多元。",
    },
  },
  {
    id: "junior-ai-basics-practice-q029",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠的溫度感測器因線路老化，量測值不時出現明顯偏離實際溫度的雜訊讀數，資料工程師在清洗資料前，欲以5V架構描述這項資料品質問題所對應的構面。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這項問題屬於Velocity（速度），因為雜訊讀數通常會拖慢整體資料傳輸的速度" },
      { id: "B", text: "這項問題屬於Veracity（真實性），指資料可信程度，需清洗才能提升品質" },
      { id: "C", text: "這項問題屬於Volume（數量），因為雜訊讀數會使資料總筆數大幅增加" },
      { id: "D", text: "這項問題屬於Value（價值），移除所有感測器資料可解決可信度不足的問題" },
    ],
    answer: "B",
    explanation:
      "大數據5V中的Veracity（真實性）指資料的可信程度，包含是否存在雜訊、誤差或矛盾。感測器因線路老化產生偏離實際的雜訊讀數，正是Veracity不足的典型情境，需透過資料清洗（如離群值偵測、校正）來提升品質，而非單純移除全部資料；雜訊本身不會使資料筆數暴增或拖慢傳輸速度，這些屬於Volume與Velocity的範疇。",
    choiceExplanations: {
      A: "雜訊讀數影響的是資料的可信程度，與資料傳輸速度快慢是不同構面，線路老化產生的量測誤差不必然拖慢傳輸。",
      C: "雜訊讀數是既有資料筆數中「品質不佳」的部分，並不會使資料總筆數因此暴增，資料量多寡屬於Volume而非此處的品質問題。",
      D: "解決可信度不足的作法是清洗、校正或標示可疑資料，而非直接移除全部感測器資料，後者會使工廠失去可用的監控資訊。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["大數據5V", "Veracity", "資料清洗"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      crossNode: "L11202",
      decisionBoundary:
        "若那些偏離值其實反映真實的異常升溫，它就不是雜訊而是最有價值的訊號——同一筆離群值是雜訊還是訊號，取決於物理上是否可能發生。",
    },
  },
  {
    id: "junior-ai-basics-practice-q030",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行蒐集了大量客戶瀏覽網路銀行的點擊紀錄，但資料團隊發現多數欄位對於預測客戶流失並無實質幫助，僅有少數特徵具有分析意義；主管欲以5V架構說明這種「量大但可用資訊有限」的現象。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這種現象屬於Veracity（真實性），指點擊紀錄的數量越多，代表資料的可信程度越高" },
      { id: "B", text: "這種現象屬於Volume（數量），持續蒐集更多點擊紀錄會提高可用資訊的比例" },
      { id: "C", text: "這種現象屬於Variety（多樣性），因為點擊紀錄的欄位種類繁多，代表資料本身價值已經很高" },
      { id: "D", text: "這種現象屬於Value（價值），指資料量大不等於價值高，需經萃取才能取得具分析意義的資訊" },
    ],
    answer: "D",
    explanation:
      "大數據5V中的Value（價值）指從龐大資料中萃取出的實際效益，資料量大不代表價值高，往往只有少數特徵對分析目標真正有幫助，須經特徵篩選等流程才能取得具分析意義的資訊。此情境點擊紀錄量雖大，多數欄位對預測流失無實質幫助，正是Value構面待解決的問題，而非單純增加資料量、欄位種類或資料可信度就能改善。",
    choiceExplanations: {
      A: "Veracity（真實性）指資料是否可信、有無雜訊，與資料筆數多寡是不同構面，點擊紀錄數量多不代表其可信程度就一定較高。",
      B: "持續蒐集更多點擊紀錄只會增加資料總量（Volume），不會自動提高可用資訊的比例，價值萃取仍需仰賴特徵篩選等分析工作。",
      C: "欄位種類繁多屬於Variety（多樣性）的範疇，種類多寡與資料本身的分析價值高低並無必然關聯，多數欄位可能仍無助於預測目標。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["大數據5V", "Value", "特徵篩選"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      crossNode: "L11202",
      decisionBoundary:
        "若那些欄位對「預測流失」沒用、但對「推薦商品」很有用，價值判斷就會翻轉——Value 永遠是相對於分析目標而言的。",
    },
  },
  {
    id: "junior-ai-basics-practice-q031",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司同時取得兩批資料：一批是自家智慧灌溉裝置在農民使用過程中自動回傳的用水量紀錄，另一批是團隊撰寫程式定期擷取公開農產品交易網站上的每日行情頁面內容；資料團隊欲正確標示這兩批資料各自的來源型態。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "灌溉裝置回傳的用水量紀錄屬於自有產品資料，行情頁面則屬於網路爬蟲資料" },
      { id: "B", text: "灌溉裝置回傳的用水量紀錄屬於網路爬蟲資料，行情頁面內容屬於自有產品資料" },
      { id: "C", text: "兩批資料都應歸類為網路爬蟲資料，因為兩者最終都是透過網路傳輸取得的" },
      { id: "D", text: "兩批資料都屬於自有產品資料，因為公司對外部網站頁面同樣擁有完整使用權利" },
    ],
    answer: "A",
    explanation:
      "自有產品資料指企業自身產品或服務在使用過程中產生、直接回傳給企業的資料，例如智慧灌溉裝置的用水量紀錄；網路爬蟲資料則是透過程式定期擷取他人網站公開頁面內容取得的資料，例如農產品交易網站的行情頁面。此情境中兩批資料的來源型態應正確對應為自有產品與網路爬蟲兩種不同型態。",
    choiceExplanations: {
      B: "兩者的對應恰好相反——用水量紀錄是自有產品資料，行情頁面內容才是網路爬蟲取得的資料。",
      C: "灌溉裝置的用水量紀錄是自家產品運作過程中直接產生、回傳給公司的資料，屬於自有產品資料，並非透過程式擷取他人網站取得的爬蟲資料。",
      D: "公司對自家灌溉裝置回傳的資料擁有完整所有權，但對外部交易網站的頁面內容並無所有權，僅是以程式擷取公開內容，兩者性質不同，不能都歸為自有產品資料。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["自有產品資料", "網路爬蟲資料", "資料來源型態"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若那個行情網站改為提供正式 API 並簽了授權，同一批資料就從爬蟲資料變成公開 API 或外部購買資料，權利關係也隨之不同。",
    },
  },
  {
    id: "junior-ai-basics-practice-q032",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠資料團隊盤點手上三批資料的來源：第一批是產線上溫濕度感測器持續回傳的即時量測值；第二批是向中央氣象單位開放平台呼叫取得的區域天氣預報資料；第三批是向資料供應商付費取得的同業設備故障統計資料庫。下列標示何者最正確？",
    choices: [
      { id: "A", text: "第一批屬於公開API資料、第二批屬於外部購買資料、第三批屬於感測器網路資料" },
      { id: "B", text: "三批資料雖然皆用於工廠內部分析，性質上仍應視為自有產品資料" },
      { id: "C", text: "第一批屬於感測器網路資料、第二批屬於公開API、第三批屬於外部購買資料" },
      { id: "D", text: "第一批屬於外部購買資料、第二批屬於感測器網路資料、第三批屬於公開API資料" },
    ],
    answer: "C",
    explanation:
      "感測器網路資料指由部署於實體環境中的感測裝置持續量測回傳的資料，如產線溫濕度感測器；公開API資料指透過開放平台介面呼叫取得的資料，如氣象單位的開放天氣預報API；外部購買資料則是向第三方供應商付費取得的資料，如同業設備故障統計資料庫。三批資料應依此依序對應，其餘排列組合皆有誤置。",
    choiceExplanations: {
      A: "對應錯置——溫濕度感測器資料屬於感測器網路，向開放平台呼叫取得的天氣資料屬於公開API，付費取得的資料庫才是外部購買；此選項把三者對應整體循環錯位了一格，並非正確排列。",
      B: "感測器網路、公開API、外部購買三種來源型態各有不同的取得方式與權利關係，即使最終都用於工廠內部分析，也不能因用途相同就一律視為自有產品資料。",
      D: "對應錯置——溫濕度感測器持續量測回傳的資料屬於感測器網路資料，而非外部購買；付費向供應商取得的故障統計資料庫才是外部購買資料，而非公開API。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["感測器網路", "公開API", "外部購買"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若氣象資料改成自行架設氣象站量測，它就從公開 API 變成感測器網路資料——來源型態看的是取得方式，不是內容主題。",
    },
  },
  {
    id: "junior-ai-basics-practice-q033",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行同時擁有存款系統、信用卡系統與理財顧問系統三套各自獨立的資料庫，客戶資訊分散且格式不一；資料團隊規劃建立資料整合平台，會議中有人提議「整合後應同時統一調整各系統資料的保存期限，作為整合專案的核心目標之一」。下列說明何者最正確？",
    choices: [
      { id: "A", text: "資料整合是把各系統資料集中儲存在同一個檔案的動作，不包含格式、定義或欄位的一致化" },
      { id: "B", text: "資料整合的目的與資料保存期限彼此無關，兩者在資料治理上不應同時規劃或討論" },
      { id: "C", text: "資料整合的核心目的正是統一調整各系統資料的保存期限，這是整合專案不可或缺的一環" },
      { id: "D", text: "資料整合的目的是打破系統孤島、建立一致的客戶視圖，統一保存期限並非其核心目的" },
    ],
    answer: "D",
    explanation:
      "資料整合的核心目的是打破分散於不同系統的資料孤島，透過格式、定義與欄位的一致化，建立單一且一致的客戶視圖，以支援跨系統分析與決策；調整資料保存期限屬於資料保存政策或法遵留存規範的範疇，並非資料整合專案本身的核心目的，兩者雖可能在治理架構中相關，但不應混為整合的核心目標。",
    choiceExplanations: {
      A: "資料整合不只是物理上集中儲存，還須處理格式、定義與欄位的一致化，才能建立可信賴的單一客戶視圖，並非單純合併檔案。",
      B: "保存期限與資料整合雖非同一件事，但兩者在資料治理架構下仍可能相關聯（例如整合後仍須遵循各類資料的留存規範），並非完全無關、不可同時討論。",
      C: "保存期限的訂定屬於資料保存政策與法遵留存規範的範疇，並非資料整合專案的核心目的，把它列為整合的核心目標會模糊整合真正要解決的孤島問題。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["資料整合", "資料孤島", "單一客戶視圖"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若三套系統的欄位定義本來就一致、只是分開存放，整合就退化成單純的集中儲存，重點會從一致化轉為存取效能。",
    },
  },
  {
    id: "junior-ai-basics-practice-q111",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠要建立設備健康度模型，可取得四種資料：產線感測器讀值（每秒一筆、五年）、維修工單（自由文字、三年）、外部購買的同業故障統計（僅年度彙總）、供應商 API 提供的零件規格。若目標是預測「某台設備未來一週是否故障」，下列判斷何者最正確？",
    choices: [
      { id: "A", text: "感測讀值與維修工單是核心（提供時序特徵與故障標籤），年度彙總因粒度過粗難以對應到單台設備與單週" },
      { id: "B", text: "四種資料一律等權納入，資料越多越好" },
      { id: "C", text: "應以外部購買的同業統計為主，因為樣本數最大" },
      { id: "D", text: "只用零件規格即可，因為它最結構化" },
    ],
    answer: "A",
    explanation:
      "要預測「某台設備、未來一週」，資料的粒度必須對得上這個單位。感測讀值提供時序特徵、維修工單提供故障事件與時間點（也就是標籤），兩者都能落到單台單週；年度彙總的最小單位是一年一個產業，無法對應。",
    choiceExplanations: {
      B: "粒度對不上的資料納進來只會增加雜訊，等權更會稀釋真正有訊號的來源。",
      C: "樣本數大但粒度粗，無法回答單台設備的問題，也沒有對應的時間解析度。",
      D: "零件規格是靜態屬性，同型號設備的規格相同，無法區分哪一台快壞了。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料粒度", "標籤來源", "資料來源型態"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "L11202",
      decisionBoundary:
        "若預測目標改成「本廠明年的整體維修預算」，年度彙總的粒度就對得上，它反而成為最有價值的參考基準。",
    },
  },
  {
    id: "junior-ai-basics-practice-q112",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行以網路爬蟲蒐集公開的房地產成交行情，用於強化房貸估價模型。法遵人員提出疑慮。下列評估重點何者最完整？",
    choices: [
      { id: "A", text: "只要資料是公開的就沒有任何問題" },
      { id: "B", text: "只要不轉售資料就完全合法" },
      { id: "C", text: "應確認網站服務條款是否允許擷取、擷取行為是否造成對方負擔、以及資料用於商業估價的權利基礎" },
      { id: "D", text: "爬蟲屬於技術問題，法遵不需介入" },
    ],
    answer: "C",
    explanation:
      "「公開可見」與「可自由利用」是兩件事。服務條款可能明文禁止自動擷取、高頻擷取可能構成對他人系統的負擔、而把資料用於商業估價還牽涉利用目的的權利基礎。三者都要確認，缺一項就可能出事。",
    choiceExplanations: {
      A: "公開只代表可被看見，不代表可被大量擷取並商業利用。",
      B: "不轉售只排除了其中一種利用方式，擷取行為本身與其他利用仍受條款與法規拘束。",
      D: "擷取與利用的合法性正是法遵的職責範圍，技術可行不等於可以做。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["網路爬蟲", "服務條款", "利用目的"],
      constraints: ["governance", "privacy"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若該資料改由官方開放平台以 API 提供、且授權明訂可商業利用，這三項疑慮就一次解除。",
    },
  },
  {
    id: "junior-ai-basics-practice-q113",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院想分析「病患術後恢復速度」，可用的資料包含結構化的檢驗數值、半結構化的護理紀錄 JSON、以及非結構化的醫師手寫病程。若團隊的時程只夠先做一種，下列選擇與理由何者最合理？",
    choices: [
      { id: "A", text: "先用手寫病程，因為醫師的判斷最準確" },
      { id: "B", text: "先用結構化的檢驗數值，因為它可直接進入分析、投入產出比最高" },
      { id: "C", text: "三種同時做才有意義，否則不要開始" },
      { id: "D", text: "依檔案大小決定，先做最小的" },
    ],
    answer: "B",
    explanation:
      "時程有限時應先取「已經可用」的資料。結構化檢驗數值不需額外的抽取或標註即可分析；手寫病程要先數位化與資訊抽取，成本最高。先做出可驗證的第一版，再決定值不值得往下投入。",
    choiceExplanations: {
      A: "手寫病程資訊最豐富，但要先數位化與抽取實體，前置成本遠超過現有時程。",
      C: "堅持三種同時做等於什麼都做不出來，也違背先驗證再投入的原則。",
      D: "檔案大小與資料的可用性、分析價值都無關。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["結構化資料", "半結構化", "非結構化", "投入產出"],
      constraints: ["cost", "data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若檢驗數值與恢復速度的關聯已知很弱，而關鍵資訊只寫在病程裡，那就得咬牙先做抽取——先做哪一種取決於訊號在哪裡，不只是取得成本。",
    },
  },
  {
    id: "junior-ai-basics-practice-q114",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業團隊以大數據 5V 檢視手上的資料：每分鐘一筆的土壤讀值累積了三年、來源包含感測器與人工日誌、其中人工日誌有明顯漏填。若要決定下一步投入哪一項改善，下列判斷何者最合理？",
    choices: [
      { id: "A", text: "優先提升 Velocity，把取樣頻率提高到每秒一筆" },
      { id: "B", text: "優先擴充 Volume，資料越多結論越穩" },
      { id: "C", text: "優先增加 Variety，再接更多種感測器" },
      { id: "D", text: "優先處理 Veracity——人工日誌的漏填會讓分析結論不可靠，且無法靠增加資料量彌補" },
    ],
    answer: "D",
    explanation:
      "資料量已有三年、來源也有兩種，真正的瓶頸是品質：漏填的人工日誌會讓對應時段的分析失真，而這種缺口不會因為再多蒐集三年而消失。先把可信度補起來，後面的量與多樣性才有意義。",
    choiceExplanations: {
      A: "每分鐘一筆對土壤變化已經足夠，提高頻率只增加儲存與處理成本。",
      B: "在既有資料已有品質缺口時擴大量體，只是把不可靠的部分等比放大。",
      C: "多接感測器增加的是型態多樣性，無助於既有日誌的漏填。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["大數據5V", "Veracity", "改善優先序"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若漏填只集中在與分析目標無關的欄位，Veracity 的急迫性就下降，資源可以轉向擴充其他來源。",
    },
  },
  {
    id: "junior-ai-basics-practice-q115",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台同時擁有自家 App 的學習行為紀錄、向第三方購買的學區人口統計、以及從公開 API 取得的教育部課綱資料。若要建立「學生輟學風險」模型，關於這三種來源的使用，下列考量何者最重要？",
    choices: [
      { id: "A", text: "自家行為紀錄的權利最完整、粒度也對得上個別學生；外購與公開資料多為區域層級，適合作為背景特徵而非主要依據" },
      { id: "B", text: "三種來源的權利與粒度相同，可等同對待" },
      { id: "C", text: "應以外購的人口統計為主，因為它涵蓋範圍最廣" },
      { id: "D", text: "公開 API 的資料因為免費，應優先大量使用" },
    ],
    answer: "A",
    explanation:
      "要預測個別學生，特徵必須能落到個人層級。自家 App 的行為紀錄既是自有產品資料、權利清楚，粒度也對得上；外購與公開資料多為學區或全國層級，只能當作背景脈絡，硬用會讓同一學區的學生被賦予相同的風險。",
    choiceExplanations: {
      B: "自有、外購、公開三種來源的權利義務與可利用範圍差異很大，不能等同對待。",
      C: "區域層級的統計無法區分同一學區內不同學生的差異。",
      D: "是否免費與是否適合此任務無關，粒度不合仍然沒有用。",
    },
    topic: "L11201 資料基本概念與來源",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["自有產品資料", "外部購買", "公開API", "粒度"],
      constraints: ["governance", "data_quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若預測目標改成「哪一個學區該優先投入輔導資源」，區域層級的人口統計就從背景特徵升格為主要依據。",
    },
  },

  // ── L11202 資料整理與分析流程（11 題）────────────────────────────
  {
    id: "junior-ai-basics-practice-q034",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠評估建置資料倉儲的處理流程，方案一是先在來源端完成資料清洗與轉換後才載入倉儲，方案二是先把原始資料整批載入雲端倉儲，再利用倉儲的運算能力進行轉換。資料架構師欲向團隊說明這兩種流程的正確名稱與差異。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩種方案的本質相同，流程步驟的先後順序不同並不影響本質，也無專屬名稱之分" },
      { id: "B", text: "方案一屬於ELT、方案二屬於ETL，兩者差別在於轉換發生於倉儲之外或之內" },
      { id: "C", text: "兩種方案的差異只在於是否使用雲端或地端倉儲，與轉換步驟的先後順序無關" },
      { id: "D", text: "方案一屬於ETL、方案二屬於ELT，差異在轉換發生於載入倉儲之前或之後" },
    ],
    answer: "D",
    explanation:
      "ETL（Extract-Transform-Load）先在來源端完成清洗與轉換，再把處理過的資料載入倉儲；ELT（Extract-Load-Transform）則先把原始資料整批載入倉儲，再利用倉儲本身的運算能力進行轉換。方案一先清洗轉換再載入，屬於ETL；方案二先載入再轉換，屬於ELT，兩者的核心差異正是轉換步驟發生的時間點與位置。",
    choiceExplanations: {
      A: "ETL與ELT在轉換步驟的時間點與位置有實質差異，各有專屬名稱與適用情境，並非只是順序不同、無區別意義。",
      B: "對應恰好顛倒——方案一先清洗轉換再載入，屬於ETL；方案二先載入再轉換，才是ELT。",
      C: "兩者的核心差異在於轉換步驟發生於載入之前（ETL）或之後（ELT），而非使用雲端或地端倉儲這項基礎設施的選擇。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["ETL", "ELT", "資料倉儲"],
      constraints: ["cost"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Neighbor Concept",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若倉儲的運算成本遠高於來源端、或原始資料含不得入倉的個資，ETL 就勝出——選擇取決於轉換要花誰的算力、以及原始資料能不能落地。",
    },
  },
  {
    id: "junior-ai-basics-practice-q035",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的學生測驗成績資料中，約有3%的紀錄因網路中斷未能上傳分數而缺值，且經檢查這些缺值與學生程度高低並無明顯關聯；資料團隊欲選擇合適的處理方式以維持後續分析的代表性。下列作法何者最合適？",
    choices: [
      { id: "A", text: "直接以0分填補所有缺值，因為填0分不會改變成績的整體排名分布狀態" },
      { id: "B", text: "以全體學生的最高分填補缺值，可確保分析結果不會低估整體學習成效" },
      { id: "C", text: "可考慮以中位數或平均數插補，缺值比例低，對整體分布影響有限" },
      { id: "D", text: "刪除有缺值的整筆紀錄，是各種缺值比例下普遍適用的標準作法" },
    ],
    answer: "C",
    explanation:
      "遺缺值處理需視缺值比例與缺值成因而定。此情境缺值比例低（約3%）且與學生程度無關（屬隨機缺失），以平均數或中位數插補是常見且合理的作法，能在不大幅扭曲整體分布的前提下保留樣本數；以0分或最高分填補會人為扭曲成績分布，刪除整筆紀錄則並非任何缺值比例下都是標準作法，須視情況判斷是否會損失過多樣本。",
    choiceExplanations: {
      A: "以0分填補會人為壓低這些學生的成績，使整體分布出現不存在的低分堆積，扭曲原本的成績分布。",
      B: "以最高分填補會人為推升這些學生的成績，同樣扭曲整體分布，使分析結果高估整體學習成效，並非「確保不低估」的合理理由。",
      D: "是否刪除整筆紀錄需視缺值比例與資料量而定，並非任何比例下都應採用；當缺值比例低且與分析目標無關時，插補通常是更合適的作法。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["遺缺值處理", "插補", "隨機缺失"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若缺值高達三成、且集中在低分學生（非隨機缺失），插補就會製造系統性偏誤，此時應改為保留缺值指示變數或直接刪除。",
    },
  },
  {
    id: "junior-ai-basics-practice-q036",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行分析信用卡消費金額資料，欲以四分位距（IQR）方法找出可能的異常交易金額；分析師已算出第一四分位數（Q1）與第三四分位數（Q3）。下列何者最正確地描述以IQR判定離群值的方式？",
    choices: [
      { id: "A", text: "交易金額的Z-score絕對值超過3，即為IQR方法判定的離群值" },
      { id: "B", text: "低於Q1減1.5倍IQR或高於Q3加1.5倍IQR，視為離群值" },
      { id: "C", text: "交易金額低於Q1或高於Q3，判定為離群值時不需考慮距離的遠近" },
      { id: "D", text: "某筆交易金額超過全體交易金額計算出的平均值，即應視為離群值" },
    ],
    answer: "B",
    explanation:
      "IQR（四分位距）方法計算IQR=Q3-Q1，並以「低於Q1-1.5×IQR」或「高於Q3+1.5×IQR」作為判定離群值的常見門檻，而非單純以平均值或落在Q1、Q3範圍之外就判定；以Z-score絕對值超過3判定離群值屬於另一種方法（Z-score法），並非IQR方法。",
    choiceExplanations: {
      A: "Z-score絕對值超過3是另一種離群值判定方法（Z-score法），依賴平均數與標準差，並非IQR方法的判定方式。",
      C: "IQR方法設有1.5倍IQR的緩衝範圍，只要落在Q1至Q3之間、甚至略微超出但未達1.5倍IQR的距離，仍不視為離群值，並非只要低於Q1或高於Q3就一律判定。",
      D: "單純超過平均值並非IQR方法的判定依據，平均值容易受極端值拉動，IQR方法是以四分位數為基礎設定門檻。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["IQR", "離群值", "四分位數"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若資料明顯非常態且有厚尾，1.5 倍 IQR 會把大量正常值判為離群，門檻應放寬到 3 倍或改用領域上下限。",
    },
  },
  {
    id: "junior-ai-basics-practice-q037",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠的振動感測器讀數近似常態分布，資料工程師欲以Z-score方法找出異常讀數，並設定Z-score絕對值超過3作為判定門檻。下列說明何者最正確？",
    choices: [
      { id: "A", text: "Z-score指讀數與平均值相差的標準差倍數，絕對值越大代表越偏離集中趨勢" },
      { id: "B", text: "Z-score的門檻值取決於資料集本身的樣本規模大小，樣本數越多門檻應設得越高" },
      { id: "C", text: "Z-score方法較適合資料呈右偏分布的情境，常態分布下改用IQR方法效果更好" },
      { id: "D", text: "Z-score方法計算讀數與中位數的差距，不涉及平均值與標準差這兩個統計量" },
    ],
    answer: "A",
    explanation:
      "Z-score計算方式為（讀數-平均值）/標準差，代表某筆讀數與平均值相差幾個標準差，絕對值越大代表越偏離資料集中趨勢，常搭配門檻（如絕對值超過3）判定為離群值；此方法恰好適用於資料近似常態分布的情境，且門檻值可依資料特性與應用需求調整，並非固定不變，也需要計算平均值與標準差才能求得。",
    choiceExplanations: {
      B: "此情境的Z-score判定門檻是資料工程師依資料特性與應用需求直接選定的參考值（絕對值超過3），實務上多以這類固定門檻為準，並非依樣本規模來決定。",
      C: "Z-score方法假設資料接近常態分布時效果較佳，此情境振動讀數已近似常態分布，正是適用的情境；右偏分布資料反而較常改採IQR或先做對數轉換。",
      D: "Z-score的定義正是讀數與平均值的差距除以標準差，須用到平均值與標準差這兩個統計量，並非改用中位數計算、不涉及兩者。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Z-score", "標準差", "常態分布"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Terminology Swap",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若讀數分布明顯右偏，平均數與標準差都會被極端值拉動，Z-score 的判定就失準，該改用以四分位數為基礎的 IQR。",
    },
  },
  {
    id: "junior-ai-basics-practice-q038",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台欲將學生的「測驗總分（0至100分）」與「每週登入次數（0至50次）」兩項特徵一併輸入模型，因兩者量綱與範圍差異大，資料工程師需先將數值縮放到相近尺度。下列說明何者最正確？",
    choices: [
      { id: "A", text: "正規化通常縮放數值到固定區間，標準化則轉換為平均值0、標準差1分布" },
      { id: "B", text: "正規化是將資料轉換為平均值為0、標準差為1的分布，與資料的最大最小值無關" },
      { id: "C", text: "正規化與標準化是同一種方法的不同名稱，兩者的計算公式與結果相同" },
      { id: "D", text: "資料筆數增加後，模型即能公平看待量綱不同的兩項特徵，不需要正規化或標準化" },
    ],
    answer: "A",
    explanation:
      "正規化（Normalization）通常把數值線性縮放到固定區間，例如0至1，依資料的最大最小值計算；標準化（Standardization）則將資料轉換為平均值0、標準差1的分布，依平均值與標準差計算。兩者計算公式與結果並不相同，是兩種不同的縮放方法；當特徵量綱差異大時，若不縮放，數值範圍較大的特徵可能主導模型學習，因此資料筆數多寡並不能取代縮放的必要性。",
    choiceExplanations: {
      B: "「轉換為平均值0、標準差1」描述的是標準化，而非正規化；正規化的核心是依最大最小值將數值縮放到固定區間。",
      C: "正規化依最大最小值做線性縮放，標準化依平均值與標準差做分布轉換，兩者的計算公式與適用情境並不相同，並非同一方法的不同名稱。",
      D: "資料筆數多寡不影響特徵間量綱差異造成的主導效應，即使樣本充足，範圍較大的特徵仍可能在未縮放前主導模型學習，仍需正規化或標準化。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["正規化", "標準化", "量綱"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "L11302",
      decisionBoundary:
        "若模型改成決策樹或隨機森林這類以分割點運作的模型，兩者都不必做——縮放只影響距離或梯度敏感的模型。",
    },
  },
  {
    id: "junior-ai-basics-practice-q039",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的貸款申請資料中有一個類別欄位「還款方式」，內容為「按月平均攤還」「到期一次還本」「彈性還款」三種選項，彼此之間並無大小或順序關係；資料工程師欲決定合適的編碼方式輸入模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "One-hot與Label Encoding對此欄位的編碼結果相同，選用哪一種都不影響模型判讀" },
      { id: "B", text: "Label Encoding最適合此欄位，因為它會將三種還款方式分別轉為0、1、2等有大小關係的數字" },
      { id: "C", text: "One-hot較適合此欄位，因為類別間無順序關係，可避免模型誤判類別間存在大小順序" },
      { id: "D", text: "這個欄位不需要編碼轉換，模型能直接讀懂文字類別內容並正確判斷彼此關係" },
    ],
    answer: "C",
    explanation:
      "當類別變數彼此之間沒有大小或順序關係時（如還款方式的三種選項），適合採用One-hot Encoding，將每個類別轉為獨立的二元欄位，避免模型誤以為類別之間存在大小順序；Label Encoding則是把類別直接轉為0、1、2等連續數字，較適用於類別本身具有順序關係的情境（如低、中、高風險），若用於無序類別，模型可能誤判類別間的大小關係。",
    choiceExplanations: {
      A: "兩種編碼方式的結果並不相同——One-hot產生多個二元欄位、不隱含順序，Label Encoding產生單一數值欄位、隱含順序，選用哪一種會實質影響模型是否誤判類別間的關係。",
      B: "Label Encoding會賦予類別0、1、2等具大小關係的數字，用於「還款方式」這種無順序關係的類別，反而容易讓模型誤判類別間存在不存在的大小順序，並非最適合的選擇。",
      D: "多數機器學習模型仍需要數值化的輸入，無法直接處理原始文字類別，仍須經過編碼轉換才能輸入模型。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["One-hot Encoding", "Label Encoding", "類別編碼"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若欄位改成「低／中／高風險」這種本身帶順序的類別，Label Encoding 反而正確——順序存在時保留它是有資訊的。",
    },
  },
  {
    id: "junior-ai-basics-practice-q040",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠設備的故障間隔時間資料呈明顯右偏分布，多數設備故障間隔集中在短時間內，但少數設備間隔時間極長，使資料分布出現長尾；資料工程師考慮以對數轉換處理這項特徵。下列說明何者最正確？",
    choices: [
      { id: "A", text: "對數轉換後的數值會失去原始資料的大小順序，因此不適合用於後續分析" },
      { id: "B", text: "對數轉換能壓縮數值範圍、緩解右偏分布長尾，使資料分布較接近常態" },
      { id: "C", text: "對數轉換是針對左偏分布資料設計的技巧，右偏分布的資料並不適合採用" },
      { id: "D", text: "對數轉換的效果與正規化相同，兩者都是把數值縮放到0至1的固定區間" },
    ],
    answer: "B",
    explanation:
      "對數轉換（如取log）能壓縮數值範圍，對於右偏分布中少數極大值造成的長尾特別有效，可使轉換後的資料分布較接近常態，有助於後續統計分析或模型訓練；此故障間隔時間資料多數集中短時間、少數極長，正是右偏分布的典型情境，適合以對數轉換處理，而非僅適用於左偏資料。對數轉換屬單調遞增函數，不會改變原始數值的大小順序，也與正規化（縮放至固定區間）是不同的方法。",
    choiceExplanations: {
      A: "對數轉換屬於單調遞增函數，數值大小的相對順序在轉換前後保持一致，不會因此喪失原始資料的大小順序。",
      C: "對數轉換對於右偏分布（多數集中低值、少數極大值造成長尾）特別有效，此情境的故障間隔時間資料正屬於右偏分布，並非只適用於左偏分布。",
      D: "對數轉換是以取對數的方式壓縮數值範圍、緩解長尾，正規化則是依最大最小值線性縮放到固定區間，兩者計算方式與效果並不相同。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["對數轉換", "右偏分布", "長尾"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若資料中含有 0 或負值，直接取對數會失效，須先平移（如 log1p）或改用其他轉換。",
    },
  },
  {
    id: "junior-ai-basics-practice-q041",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行預測客戶是否會申辦信用卡加值服務，資料科學家原本分別使用「年齡」與「月收入」兩個特徵，發現預測效果有限；後來將兩者相乘產生一個新特徵「年齡×月收入」納入模型，預測效果明顯改善。下列說明最能解釋這項作法的名稱與原理？",
    choices: [
      { id: "A", text: "這項作法稱為對數轉換，目的是壓縮兩個原始特徵各自的數值範圍" },
      { id: "B", text: "這項作法稱為One-hot Encoding，目的是將兩個數值特徵轉換為類別型欄位" },
      { id: "C", text: "這項作法稱為特徵交叉，透過組合兩個既有特徵，捕捉單一特徵無法呈現的交互作用關係" },
      { id: "D", text: "這項作法稱為標準化，目的是讓兩個原始特徵的平均值與標準差趨於一致" },
    ],
    answer: "C",
    explanation:
      "特徵交叉（Feature Crossing）指將兩個或多個既有特徵組合（如相乘、相除）產生新特徵，藉此捕捉單一特徵各自無法呈現的交互作用關係。此情境將「年齡」與「月收入」相乘產生新特徵，可能反映出「特定年齡層搭配特定收入水準」對申辦意願的組合效應，屬於典型的特徵交叉，而非對數轉換、編碼或標準化這類針對單一特徵的前處理方法。",
    choiceExplanations: {
      A: "對數轉換是針對單一特徵取對數以壓縮數值範圍、緩解偏態，此情境是將兩個特徵相乘產生新特徵，屬於特徵交叉而非對數轉換。",
      B: "One-hot Encoding是把類別型欄位轉為二元欄位，此情境的年齡與月收入原本就是數值型特徵，作法也是相乘而非類別化，並非One-hot Encoding。",
      D: "標準化是將單一特徵轉換為平均值0、標準差1的分布，此情境的重點是組合兩個特徵產生新特徵以捕捉交互作用，並非調整數值分布的標準化。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["特徵交叉", "交互作用", "特徵工程"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "L11302",
      decisionBoundary:
        "若改用本來就能捕捉交互作用的樹模型或神經網路，手工特徵交叉的邊際效益會大幅下降。",
    },
  },
  {
    id: "junior-ai-basics-practice-q042",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的資料團隊在建立學習成效預測模型前，先自由繪製各項特徵的分布圖、觀察變數間可能的關聯，尚未預設任何具體假設；完成初步觀察後，才針對「每週練習時數是否顯著影響測驗分數」提出假設並以統計檢定驗證。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "先進行的自由觀察階段才屬於CDA分析，後續假設檢定階段則屬於EDA分析" },
      { id: "B", text: "自由觀察階段屬於EDA（探索式），假設檢定階段則屬於CDA（驗證式）" },
      { id: "C", text: "兩個階段都屬於CDA（驗證式資料分析），差異只在於使用的圖表種類不同" },
      { id: "D", text: "兩個階段都屬於EDA（探索式資料分析），因為兩者都涉及資料視覺化的操作" },
    ],
    answer: "B",
    explanation:
      "EDA（探索式資料分析）指在尚未預設具體假設前，透過視覺化與初步統計，自由探索資料的分布與變數間可能的關聯；CDA（驗證式資料分析）則是針對明確提出的假設，以統計檢定等方法驗證其是否成立。此情境中自由繪圖、觀察關聯的階段屬於EDA，而針對「練習時數是否顯著影響分數」提出假設並檢定的階段則屬於CDA，兩階段的核心差異在於是否已有明確待驗證的假設，而非圖表種類或是否使用視覺化。",
    choiceExplanations: {
      A: "對應恰好顛倒——自由觀察、尚未預設假設的階段屬於EDA，針對明確假設進行統計檢定的階段才屬於CDA。",
      C: "兩階段的差異核心在於是否已有明確待驗證的假設，而非圖表種類——自由觀察未預設假設屬EDA，針對假設做統計檢定才屬CDA。",
      D: "EDA同樣可能使用視覺化工具，但關鍵在於「探索」而非「驗證」；第二階段已針對明確假設進行統計檢定，屬於CDA，並非兩階段都算EDA。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["EDA", "CDA", "假設檢定"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若團隊在看圖表之前就已寫下「練習時數會提高分數」這個假設，第一階段就直接是 CDA——分野在有沒有預設假設，不在用不用圖表。",
    },
  },
  {
    id: "junior-ai-basics-practice-q043",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行分析客戶年繳保費金額，發現平均數明顯高於中位數，且直方圖右側出現一條長尾，多數客戶的繳費金額集中在較低區間、少數客戶金額極高。分析師欲說明這種分布型態的名稱與平均數、中位數的相對位置關係。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這種分布稱為左偏分布，特徵是平均數會被少數極低值向下拉低、低於中位數" },
      { id: "B", text: "平均數與中位數的相對位置無法反映資料分布的偏態方向，兩者純屬巧合" },
      { id: "C", text: "這種分布稱為右偏分布，但少數極端高值對平均數的影響其實微乎其微" },
      { id: "D", text: "這種分布稱為右偏分布，少數極端高值會把平均數拉高，使其高於中位數" },
    ],
    answer: "D",
    explanation:
      "當資料分布右側出現長尾（少數極端高值）時，稱為右偏分布（正偏態），這些極端高值會把平均數向右拉高，使平均數高於中位數，因為平均數對極端值較敏感，中位數則較穩健、不易受極端值影響。此情境保費資料平均數高於中位數、右側出現長尾，正是右偏分布的典型特徵，而非左偏分布，且平均數確實會受到少數極端高值的顯著影響，並非無關或不受影響。",
    choiceExplanations: {
      A: "左偏分布是左側出現長尾（少數極低值），平均數會被向下拉低、低於中位數，此情境是平均數高於中位數、右側長尾，屬於右偏分布而非左偏分布。",
      B: "平均數與中位數的相對位置正是判讀偏態方向的常用依據——平均數高於中位數通常代表右偏，低於中位數通常代表左偏，兩者關係並非巧合。",
      C: "少數極端高值正是導致平均數被向右拉高、高於中位數的主因，對平均數的影響顯著，並非「其實微乎其微」。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["右偏分布", "平均數", "中位數"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若改用中位數與四分位距描述這批保費，極端值的影響就被隔離，結論會比用平均數穩健得多。",
    },
  },
  {
    id: "junior-ai-basics-practice-q044",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台資料團隊欲分析「學生每週練習時數」與「測驗分數」兩個連續型變數之間是否存在關聯趨勢，希望透過圖表直觀呈現兩者的關係。下列圖表選擇何者最合適？",
    choices: [
      { id: "A", text: "箱型圖，因為它的主要用途是比較兩個連續變數之間是否存在線性關聯" },
      { id: "B", text: "直方圖，因為這種圖表最適合同時呈現兩個連續變數之間的關聯趨勢" },
      { id: "C", text: "圖表種類的選用與變數型態或分析目的無關，任意選用皆能達成相同效果" },
      { id: "D", text: "散佈圖，將練習時數與測驗分數分別作為兩軸座標，觀察點的分布趨勢" },
    ],
    answer: "D",
    explanation:
      "散佈圖以兩個連續變數分別作為兩軸座標，能直觀呈現兩變數之間的關聯趨勢（如正相關、負相關或無明顯關聯），最適合此情境的分析目的；直方圖主要用於呈現單一變數的分布形狀（如是否偏態），箱型圖主要用於呈現單一變數的中位數、四分位距與離群值分布，或用於比較不同類別間同一變數的分布差異，皆非用於呈現兩連續變數間的關聯趨勢。",
    choiceExplanations: {
      A: "箱型圖的主要用途是呈現單一變數的中位數、四分位距與離群值，或比較不同類別間的分布差異，並非用於檢視兩個連續變數之間的線性關聯。",
      B: "直方圖是呈現單一連續變數的分布形狀（如集中趨勢、偏態），無法同時呈現兩個變數之間的關聯趨勢，此情境須改用散佈圖。",
      C: "不同圖表對應不同的變數型態與分析目的，選用是否恰當會直接影響能否正確呈現資料關係，並非任意選用都能達成相同效果。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["散佈圖", "連續變數", "視覺化"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若其中一個變數改成「班級」這種類別型，散佈圖就不適用，應改用箱型圖比較各類別的分布。",
    },
  },
  {
    id: "junior-ai-basics-practice-q116",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院的住院天數預測模型在測試集表現優異，上線後卻明顯失準。回頭檢查前處理流程，發現「出院時的最終診斷碼」被當成特徵之一。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這是模型容量不足，應改用更複雜的模型" },
      { id: "B", text: "這是資料洩漏——該欄位在預測當下尚未產生，測試分數因此虛高" },
      { id: "C", text: "這是資料漂移，應重新訓練" },
      { id: "D", text: "這是標籤雜訊，應重新標註" },
    ],
    answer: "B",
    explanation:
      "最終診斷碼在出院時才確定，而預測要在入院時做出。訓練與測試時它存在，模型學會依賴它；上線後這個欄位還是空的，依據就消失了。判準是「預測當下取不取得到」，不是欄位本身合不合理。",
    choiceExplanations: {
      A: "模型容量不足會讓測試集表現也不好，無法解釋「測試好、上線差」的落差。",
      C: "資料漂移是隨時間逐漸失準，此處是一上線就失準，成因不同。",
      D: "標籤雜訊會讓測試分數也被壓低，與此處的虛高相反。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料洩漏", "預測時點", "特徵可得性"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "L11301",
      decisionBoundary:
        "若該診斷碼其實在入院評估時就已初步填寫、之後極少更動，它就是合法特徵——取得時點才是判準。",
    },
  },
  {
    id: "junior-ai-basics-practice-q117",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的客戶資料中，「年收入」欄位有 25% 缺值，且經查缺值集中在未提供財力證明的客戶，而這群客戶的違約率明顯較高。下列處理何者最恰當？",
    choices: [
      { id: "A", text: "保留缺值並新增「是否提供財力證明」的指示欄位，讓缺失本身成為特徵" },
      { id: "B", text: "刪除所有缺值紀錄" },
      { id: "C", text: "以全體平均填補，讓資料完整" },
      { id: "D", text: "以最高收入填補，避免低估客戶價值" },
    ],
    answer: "A",
    explanation:
      "這裡的缺失不是隨機的——它本身就帶有訊號（沒提供財力證明的人違約率較高）。填平均會把這個訊號抹掉，還讓模型誤以為那是實際量測值。保留缺失並額外標記，才能把資訊留下來。",
    choiceExplanations: {
      B: "刪除等於丟掉四分之一的資料，而且刪掉的正好是風險較高的那一群，造成嚴重偏誤。",
      C: "填平均會抹掉「沒提供」這個具預測力的事實，並製造出不存在的收入數字。",
      D: "填最高收入會系統性低估這群人的風險，方向與事實相反。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["非隨機缺失", "缺失指示欄位", "偏誤"],
      constraints: ["data_quality", "fairness"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若缺值與違約率完全無關（隨機缺失）且比例低，以中位數插補就是簡單而合理的做法。",
    },
  },
  {
    id: "junior-ai-basics-practice-q118",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠要把三套系統的資料整合成單一分析表：MES 用「機台編號」、ERP 用「資產編號」、維修系統用「設備名稱」指涉同一批設備，且三者沒有共用的鍵。下列處理順序何者最合理？",
    choices: [
      { id: "A", text: "直接以設備名稱做字串比對合併" },
      { id: "B", text: "先建立設備主檔與三套編碼的對照關係，再以主檔為中心合併" },
      { id: "C", text: "三套資料各自分析，永不整合" },
      { id: "D", text: "以資料筆數最多的系統為準，其餘捨棄" },
    ],
    answer: "B",
    explanation:
      "沒有共用鍵時，整合的第一步是建立能把三套編碼連起來的主檔。有了主檔，之後每一套資料只要對到主檔即可，新增第四套系統時也只要多一組對照，而不是重做兩兩比對。",
    choiceExplanations: {
      A: "設備名稱常有簡稱、錯字與同名不同機的情形，字串比對的錯誤率高且無法稽核。",
      C: "不整合就無法做跨系統分析，等於放棄整合專案的目的。",
      D: "捨棄其他系統會失去維修與財務面的資訊，而這些正是分析所需。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料整合", "主資料", "鍵對照"],
      constraints: ["data_quality", "maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若三套系統本來就共用同一組資產編號，整合就退化成單純的鍵值合併，不需要另建主檔。",
    },
  },
  {
    id: "junior-ai-basics-practice-q119",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的分析師想比較兩種資料處理流程：一是把原始學習紀錄先清洗轉換再載入倉儲，二是先整批載入雲端倉儲再以 SQL 轉換。已知原始紀錄含有學生姓名等個資，且倉儲由外部雲端服務商提供。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "兩者皆可，個資問題與流程順序無關" },
      { id: "B", text: "應採 ELT，因為雲端倉儲的運算能力較強" },
      { id: "C", text: "應採 ETL——個資必須在載入外部倉儲之前就去識別化，ELT 的「先載入」在此不成立" },
      { id: "D", text: "應採 ELT，並在載入後立即刪除姓名欄位" },
    ],
    answer: "C",
    explanation:
      "ELT 的前提是原始資料可以先落地到目標系統。這裡的原始紀錄含個資、倉儲又在外部服務商手上，「先載入」的那一刻個資就已經離開了自家環境。此時轉換必須發生在載入之前，也就是 ETL。",
    choiceExplanations: {
      A: "流程順序決定了個資在哪個時點離開自家環境，兩者高度相關。",
      B: "運算能力是效率考量，但它換不掉個資不得先外流的限制。",
      D: "載入後才刪除，個資已經進入外部系統並可能留在日誌或備份中。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["ETL", "ELT", "個資落地"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若倉儲建在自家機房、或原始資料本來就不含個資，ELT 的運算優勢就重新成立。",
    },
  },
  {
    id: "junior-ai-basics-practice-q120",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業團隊發現作物產量資料呈明顯右偏，且要與呈常態分布的降雨量一起輸入同一個模型。下列前處理組合何者最合理？",
    choices: [
      { id: "A", text: "把兩者都轉成類別型欄位" },
      { id: "B", text: "只對降雨量取對數，產量維持原狀" },
      { id: "C", text: "兩者都不處理，模型會自行調整" },
      { id: "D", text: "對產量取對數轉換以緩解偏態，再將兩個特徵一併標準化到相近尺度" },
    ],
    answer: "D",
    explanation:
      "兩個問題要分開處理：偏態靠對數轉換緩解、尺度差異靠標準化。先轉換再標準化，兩個特徵才會在分布形狀與量級上都可比。",
    choiceExplanations: {
      A: "轉成類別會丟失數值的連續資訊，且分箱邊界又是新的任意選擇。",
      B: "降雨量已近常態，取對數反而製造出新的偏態；產量的長尾則沒被處理。",
      C: "對尺度與分布敏感的模型不會自行調整，偏態與量級差異會直接影響結果。",
    },
    topic: "L11202 資料整理與分析流程",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["對數轉換", "標準化", "前處理順序"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Terminology Swap",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若模型改成決策樹這類依門檻切分的模型，標準化就沒有必要，但對數轉換對極端值的緩解仍有幫助。",
    },
  },

  // ── L11203 資料隱私與安全（11 題）────────────────────────────────
  {
    id: "junior-ai-basics-practice-q045",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院將病歷資料用於研究，作法是把病患姓名與病歷號替換為代碼，並將代碼與真實身分的對照表另外保存在管制嚴格的系統中，日後仍可透過對照表復原病患身分；資訊安全人員欲說明這種處理方式的正確名稱。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "保留對照表這件事，會使這批資料不受個人資料保護相關規範的拘束" },
      { id: "B", text: "這種處理方式稱為假名化，因保留可復原身分的對照表，屬於可逆處理" },
      { id: "C", text: "這種處理方式與刪除病患所有身分資訊的作法並無差異，效果相同" },
      { id: "D", text: "這種處理方式稱為匿名化，因為病歷資料中已不含病患姓名等直接識別資訊" },
    ],
    answer: "B",
    explanation:
      "假名化（Pseudonymization）指以代碼取代直接識別資訊，但另外保存對照表，日後仍可透過對照表復原真實身分，屬於「可逆」的處理方式；匿名化（Anonymization）則是徹底移除或轉換到無法（或極難）復原真實身分的程度，屬於「不可逆」處理。此醫院的作法保留了可復原身分的對照表，屬於假名化而非匿名化，也因為資料仍可復原識別，通常仍受個人資料保護規範的拘束，並非等同於完全刪除身分資訊。",
    choiceExplanations: {
      A: "假名化後的資料仍可透過對照表復原為可識別的個人資料，通常仍屬於個人資料保護規範所稱的個人資料，並非完全不受規範。",
      C: "假名化仍保留對照表以供日後復原身分，與完全刪除所有身分資訊（不可復原）的效果並不相同，兩者的隱私保護程度有實質差異。",
      D: "匿名化要求資料在事實上無法（或極難）復原真實身分，此情境保留了可復原身分的對照表，屬於可逆的假名化，而非匿名化。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["假名化", "匿名化", "可逆性"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若對照表被完全銷毀、且無其他途徑可復原身分，這批資料才會從假名化進入匿名化的範疇。",
    },
  },
  {
    id: "junior-ai-basics-practice-q046",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行將一批客戶信用卡消費紀錄提供給學術研究單位，作法是移除姓名、身分證字號等直接識別欄位，僅保留出生年月、五碼郵遞區號、性別與消費金額；資訊安全人員提醒，研究單位仍可能透過與其他公開資料集交叉比對，重新指認出特定個人身分。下列說明何者最能反映這種風險與對應概念？",
    choices: [
      { id: "A", text: "重新識別的風險只在保留姓名或身分證字號時才存在，移除兩項欄位便等同於嚴謹的匿名化處理" },
      { id: "B", text: "移除姓名與身分證字號後，出生年月、郵遞區號與性別等其餘欄位已不再具備重新識別個人的風險" },
      { id: "C", text: "準識別欄位組合若夠獨特，可能與外部資料連結而重新識別，k-匿名即為降低此風險而設計" },
      { id: "D", text: "k-匿名技術的作用是強化傳輸過程的加密強度，與資料集本身是否可能被重新識別無關" },
    ],
    answer: "C",
    explanation:
      "僅移除姓名、身分證字號等直接識別欄位，並不足以構成嚴謹的匿名化——出生年月、五碼郵遞區號、性別等「準識別欄位（quasi-identifiers）」的特定組合，往往在資料集中仍相當獨特，可與其他公開或外部資料集交叉比對、連結出特定個人身分，這正是常見的連結攻擊（linkage attack）風險。k-匿名（k-anonymity）等技術的設計目的，就是讓每一種準識別欄位組合至少對應k筆紀錄，使任一個人難以在群體中被單獨鎖定，藉此降低連結攻擊帶來的再識別風險。",
    choiceExplanations: {
      A: "即使未保留姓名或身分證字號，準識別欄位組合仍可能構成連結攻擊的風險，移除這兩項欄位不足以等同於嚴謹的匿名化處理。",
      B: "出生年月、郵遞區號、性別等準識別欄位的特定組合仍可能在資料集中相當獨特，並非移除姓名與身分證字號後就不再具備重新識別的風險。",
      D: "k-匿名處理的是準識別欄位組合造成的重新識別風險，屬於資料揭露前的去識別化設計，與傳輸過程的加密強度是不同的技術層面。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["準識別欄位", "k-匿名", "連結攻擊"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若把出生年月粗化成五歲一組、郵遞區號只留三碼，準識別組合的獨特性下降，重新識別風險就隨之降低。",
    },
  },
  {
    id: "junior-ai-basics-practice-q047",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院原本蒐集病患資料的目的是提供醫療診斷服務，行銷部門欲將既有病患的聯絡資料直接用於健檢方案的促銷簡訊，未另行取得病患同意或告知新目的；法遵人員認為此作法可能違反個人資料保護的相關原則。下列說明何者最正確？",
    choices: [
      { id: "A", text: "個人資料的蒐集與利用應限於特定目的範圍內，逾越原目的的利用通常須另行取得同意" },
      { id: "B", text: "目的限制原則適用於政府機關蒐集的個人資料，民間醫院的病患資料則不受此原則規範" },
      { id: "C", text: "病患聯絡資料是否能用於行銷用途，取決於醫院內部行政程序是否核准，與病患同意與否無關" },
      { id: "D", text: "資料是醫院合法蒐集取得的，因此日後可不受目的限制、自由用於各種用途" },
    ],
    answer: "A",
    explanation:
      "個人資料保護的目的限制原則要求，個人資料的蒐集與利用應限於特定目的範圍內；若欲將資料用於原蒐集目的以外的用途（如將醫療診斷用途的病患資料改用於行銷促銷），通常須另行取得當事人同意或符合其他法定要件，而不能僅憑醫院內部行政程序核准，或以「合法蒐集」為由不受目的限制。目的限制原則同樣適用於民間機構蒐集的個人資料，並非僅限於政府機關。",
    choiceExplanations: {
      B: "目的限制原則同樣適用於民間機構（含醫院）蒐集的個人資料，並非僅限於政府機關蒐集的資料。",
      C: "逾越原蒐集目的的利用，通常須另行取得當事人同意或符合法定要件，並非僅憑醫院內部行政程序核准即可決定，仍須考量病患本人的同意。",
      D: "合法蒐集只代表取得資料的過程符合規範，日後利用仍須限於原蒐集目的範圍內，逾越目的的利用仍受規範，並非可自由用於任何用途。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["目的限制原則", "另行同意"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若病患在初診時就被明確告知並同意「聯絡資料得用於健檢方案通知」，此利用就落在原蒐集目的範圍內。",
    },
  },
  {
    id: "junior-ai-basics-practice-q048",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的客戶欲查詢自己存放於該行系統中的個人資料內容，並要求更正其中一筆過時的聯絡電話；客服人員以「系統資料一經建檔即不得更動」為由拒絕受理。法遵部門認為此處理方式有誤。下列說明何者最正確？",
    choices: [
      { id: "A", text: "銀行對客戶提出的查詢或更正請求，可依內部系統技術限制為由拒絕受理" },
      { id: "B", text: "個人資料保護規範只保障當事人查詢資料的權利，並未賦予當事人要求更正資料的權利" },
      { id: "C", text: "個人資料保護規範通常賦予當事人查詢、更正等權利，銀行應提供適當管道受理請求" },
      { id: "D", text: "當事人的查詢與更正權利，適用對象是政府機關保有的個人資料，民間銀行不在適用範圍" },
    ],
    answer: "C",
    explanation:
      "個人資料保護規範通常賦予當事人對其個人資料享有查詢、複製、更正等權利，機構原則上應建立適當管道受理當事人提出的此類請求，而非以「系統一經建檔即不得更動」等技術理由一律拒絕。這些權利同樣適用於民間機構（含銀行）保有的個人資料，並非僅限於政府機關保有者，也不僅限於查詢、不含更正。",
    choiceExplanations: {
      A: "內部系統技術限制不能作為拒絕受理當事人合法查詢或更正請求的理由，機構原則上應調整流程或系統以配合受理，而非一律拒絕。",
      B: "個人資料保護規範通常同時賦予當事人查詢與更正等權利，並非僅保障查詢、不含更正資料的權利。",
      D: "當事人的查詢與更正權利同樣適用於民間機構保有的個人資料，並非僅限於政府機關保有的個人資料。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["當事人權利", "查詢", "更正"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若請求的是刪除一筆仍在法定留存年限內的交易紀錄，機構可依法拒絕——當事人權利並非沒有邊界。",
    },
  },
  {
    id: "junior-ai-basics-practice-q049",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫學研究機構欲公開一份彙整病患統計數據的查詢介面，供外部研究者查詢「特定疾病在各年齡層的盛行率」，但擔心即使只回傳統計數字，仍可能被有心人士透過反覆查詢推論出特定個人的病歷資訊；技術團隊考慮導入差分隱私機制。下列說明何者最正確？",
    choices: [
      { id: "A", text: "差分隱私的作法是先將所有病患姓名以代碼取代，再開放外部研究者直接查詢原始病歷" },
      { id: "B", text: "差分隱私是用來保護實體檔案傳輸安全的技術，與統計查詢結果是否洩漏個人資訊是兩回事" },
      { id: "C", text: "差分隱私是在統計查詢結果中加入經校準的隨機雜訊，使個別資料難以被推論存在" },
      { id: "D", text: "查詢介面設計為回傳統計數字、不回傳個別病歷，如此即不會洩漏個人資訊，無須額外機制" },
    ],
    answer: "C",
    explanation:
      "差分隱私（Differential Privacy）是一種在統計查詢結果中加入經過數學校準的隨機雜訊的技術，使得攻擊者難以透過比對查詢結果推論出特定個人的資料是否存在於資料集中，即使查詢介面只回傳彙整統計數字，仍可能因反覆查詢比對而洩漏個人資訊，因此差分隱私正是為了防範這類「統計揭露」風險而設計，而非單純的代碼取代或傳輸加密技術。",
    choiceExplanations: {
      A: "以代碼取代姓名屬於假名化處理，而差分隱私的核心是在統計查詢結果中加入隨機雜訊，兩者是不同的技術手段，且差分隱私的重點並非開放查詢原始病歷。",
      B: "差分隱私要處理的正是傳輸安全以外的問題——資料使用階段查詢結果可能造成的推論風險，與傳輸過程的加密防護是不同的保護面向。",
      D: "即使查詢介面只回傳彙整統計數字，攻擊者仍可能透過反覆查詢比對推論出特定個人的資料是否存在，這正是差分隱私要防範的風險，並非「必然不會洩漏」。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["差分隱私", "隨機雜訊", "推論攻擊"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若改為只允許回傳樣本數 100 以上的統計量並限制查詢次數，也能降低推論風險，但保護強度不像差分隱私那樣可量化。",
    },
  },
  {
    id: "junior-ai-basics-practice-q050",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的網路銀行系統在客戶輸入帳號密碼並送出登入請求時，資料會經過加密後才在網路上傳輸，即使封包遭攔截，攻擊者也難以直接讀取其中內容。資安人員欲向新進同仁說明這項機制的作用。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "傳輸加密的主要作用是防止資料庫遭到未經授權的內部人員存取，與網路傳輸過程無關" },
      { id: "B", text: "傳輸加密能防止資料在傳輸過程中被攔截後直接讀取內容，是防範竊聽的重要機制" },
      { id: "C", text: "傳輸加密防止的是資料在傳輸過程中遭竄改，資料內容被直接讀取的風險不在其防護範圍" },
      { id: "D", text: "採用傳輸加密後，攻擊者攔截封包時仍可直接讀取其中的帳號密碼內容" },
    ],
    answer: "B",
    explanation:
      "傳輸加密（如TLS/HTTPS）的核心作用是將資料在網路傳輸過程中加密，使攻擊者即使攔截封包，也難以直接讀取其中的明文內容，是防範竊聽（如中間人攻擊）的重要機制；這項機制針對的是網路傳輸階段的風險，而非資料庫內部存取控管（那屬於存取控制的範疇），加密後的封包內容也並非仍可被直接讀取。",
    choiceExplanations: {
      A: "傳輸加密保護的是資料在網路上傳輸過程中的安全，防止的是外部攔截竊聽的風險，內部人員對資料庫的存取則須另由存取控制與稽核機制管理，兩者是不同的防護面向。",
      C: "傳輸加密除了能降低資料遭竄改後不被察覺的風險，也能防止封包內容被直接讀取，並非僅具備防竄改功能而完全無法保護內容不被讀取。",
      D: "傳輸加密的目的正是使攔截封包的攻擊者難以直接讀取其中內容，若攔截後仍可直接讀取明文，代表加密機制本身失效，並非傳輸加密正常運作下的結果。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["傳輸加密", "TLS", "竊聽"],
      constraints: ["security"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若攻擊者取得的是資料庫備份檔而非網路封包，傳輸加密完全幫不上忙，該靠的是靜態資料加密與存取控制。",
    },
  },
  {
    id: "junior-ai-basics-practice-q051",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院的遠距診療系統，若醫師端與病患端在建立連線時未確實驗證對方的數位憑證，攻擊者便有機會在雙方之間插入自己的裝置，同時偽裝成醫師與病患，攔截並竄改雙方傳輸的診療資訊而不被察覺。資安人員欲說明這種攻擊型態的名稱與防範方式。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這種攻擊稱為差分隱私攻擊，防範方式是在傳輸資料中加入隨機雜訊" },
      { id: "B", text: "診療資料本身有加密這件事，已經足以避免這種攻擊發生，無須另外驗證憑證" },
      { id: "C", text: "這種攻擊屬於資料庫層級的存取控制問題，與連線建立時的憑證驗證程序無關" },
      { id: "D", text: "這種攻擊稱為中間人攻擊，確實驗證憑證是防範此類攻擊的重要措施之一" },
    ],
    answer: "D",
    explanation:
      "中間人攻擊（Man-in-the-Middle Attack）指攻擊者在通訊雙方之間插入自己的裝置，偽裝成對方角色，攔截甚至竄改雙方傳輸的資訊而不被察覺；確實驗證數位憑證（確認連線對象身分無誤）是防範此類攻擊的重要措施之一，能避免攻擊者冒充合法一方介入連線。差分隱私是另一種與統計查詢相關的技術，與中間人攻擊無關；若未確實驗證憑證，即使資料加密，攻擊者仍可能透過偽裝身分介入連線本身；此攻擊發生在連線建立與傳輸階段，而非資料庫存取層級。",
    choiceExplanations: {
      A: "差分隱私是在統計查詢結果中加入雜訊以保護個體隱私，與防範攻擊者偽裝身分介入通訊連線的中間人攻擊是不同的概念與防範手段。",
      B: "若未確實驗證憑證，攻擊者仍可能偽裝成合法一方介入連線本身，即使資料本身有加密，也無法完全排除攻擊者冒充身分的風險，驗證憑證仍是必要措施。",
      C: "中間人攻擊發生在通訊雙方建立連線與傳輸資料的過程，防範重點在於連線建立時的憑證驗證，而非資料庫層級的存取控制。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["中間人攻擊", "憑證驗證"],
      constraints: ["security"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若雙方改用預先內建的憑證釘選（certificate pinning），即使攻擊者取得合法簽發的憑證也無法冒充，防護會再往上一層。",
    },
  },
  {
    id: "junior-ai-basics-practice-q052",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的核心系統管理員原本僅需檢視客戶帳戶餘額即可完成日常維運工作，但系統設定卻讓其帳號同時擁有修改客戶密碼、匯出全部客戶資料等高權限功能；資安稽核發現此設定有疑慮。下列說明何者最正確？",
    choices: [
      { id: "A", text: "系統設有完整的操作日誌紀錄，因此權限範圍設定得寬鬆一些不會產生資安疑慮" },
      { id: "B", text: "存取控制的目的只在於管理系統效能與運作穩定，與資料外洩風險的防範無關" },
      { id: "C", text: "系統管理員基於職務需要，理應擁有系統中所有功能的最高操作權限，不應設限" },
      { id: "D", text: "應依最小權限原則，只授予職務所需的最低權限，並搭配稽核監控異常存取" },
    ],
    answer: "D",
    explanation:
      "存取控制的核心原則之一是最小權限原則（Least Privilege），僅授予使用者完成職務所需的最低限度權限，並搭配稽核日誌記錄與監控存取行為，以降低權限過大導致資料外洩或誤用的風險。此系統管理員僅需檢視帳戶餘額，卻擁有修改密碼、匯出全部客戶資料等高權限功能，明顯逾越其職務所需，即使有完整操作日誌，權限範圍過寬本身仍是資安疑慮，稽核紀錄是事後追蹤的輔助機制，不能取代事前的最小權限設計。",
    choiceExplanations: {
      A: "操作日誌有助於事後追蹤異常行為，但無法取代事前限制權限範圍的必要性，權限設定過寬仍會增加資料遭誤用或外洩的風險，並非有日誌就不會產生疑慮。",
      B: "存取控制的目的正包含降低資料被未經授權存取或外洩的風險，與系統效能或運作穩定是不同的考量面向，並非與資料外洩風險無關。",
      C: "是否擁有高權限應依職務實際需要判定，而非以「基於職務需要」為由賦予所有功能的最高權限；僅需檢視餘額的職務並不需要修改密碼或匯出全部資料的權限。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["最小權限原則", "存取控制", "稽核"],
      constraints: ["security", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若該管理員的職務確實包含重設密碼，那項權限就該保留——最小權限是「職務所需的最低」，不是「一律最低」。",
    },
  },
  {
    id: "junior-ai-basics-practice-q053",
    subjectId: "junior-ai-basics",
    prompt:
      "多家醫院想合作訓練一套疾病預測模型，但受限於病患資料不得跨院流出的規範，無法將各院病歷集中到同一處進行訓練；技術團隊評估以聯邦學習方式進行協作。下列說明何者最正確？",
    choices: [
      { id: "A", text: "聯邦學習讓各院在本地訓練模型，只交換模型參數更新，資料不須離開院內" },
      { id: "B", text: "聯邦學習與同態加密指的是同一種技術，兩者的運作方式與適用情境相同" },
      { id: "C", text: "導入聯邦學習後，各院病歷資料仍需要實際離開院內系統，才能完成模型的協作訓練" },
      { id: "D", text: "聯邦學習的作法是先將各院病歷資料加密後，統一傳輸集中到單一伺服器再訓練模型" },
    ],
    answer: "A",
    explanation:
      "聯邦學習（Federated Learning）讓各參與方（此處為各醫院）在本地端以自有資料訓練模型，僅將模型參數或梯度更新上傳彙整，資料本身不須離開院內系統，適合病患資料不得跨院流出、但又想協作訓練共用模型的情境；這與同態加密（在加密狀態下直接進行運算）是不同的技術與適用情境，也並非把加密後的原始資料集中傳輸到單一伺服器訓練。",
    choiceExplanations: {
      B: "聯邦學習與同態加密是兩種不同的隱私保護技術，聯邦學習著重於分散式本地訓練並交換模型更新，同態加密著重於在加密狀態下直接進行運算，兩者運作方式與適用情境並不相同。",
      C: "聯邦學習的設計目的正是讓資料留在院內、不須離開本地系統，僅交換模型參數更新，並非仍需要資料實際離開院內系統才能協作訓練。",
      D: "聯邦學習的核心正是避免將原始病歷資料集中傳輸，即使資料經過加密，集中傳輸仍不符合聯邦學習「資料留在本地、只交換模型更新」的運作方式。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["聯邦學習", "本地訓練", "參數更新"],
      constraints: ["privacy"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      crossNode: "L11301",
      decisionBoundary:
        "若模型參數更新本身就會洩漏個別病患資訊，聯邦學習仍然不夠，需要再疊上差分隱私或安全聚合。",
    },
  },
  {
    id: "junior-ai-basics-practice-q054",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行欲委託雲端服務商代為運算客戶的信用評分模型，但基於資安考量，不希望雲端服務商在運算過程中能夠看到客戶原始資料的明文內容；技術團隊評估採用同態加密技術。下列說明何者最正確？",
    choices: [
      { id: "A", text: "同態加密讓雲端服務商在加密狀態下直接運算，無須取得明文內容" },
      { id: "B", text: "採用同態加密後，雲端服務商在運算過程中會需要客戶資料的明文與加密金鑰" },
      { id: "C", text: "同態加密的運算速度通常比明文運算更快，適合大規模即時運算場景" },
      { id: "D", text: "同態加密的運作方式，是先將資料解密為明文後，再交由雲端服務商進行運算" },
    ],
    answer: "A",
    explanation:
      "同態加密（Homomorphic Encryption）允許在資料維持加密狀態下直接進行運算，運算結果解密後與對明文運算的結果一致，因此雲端服務商在整個運算過程中無須取得客戶資料的明文內容或解密金鑰，適合此情境「委外運算但不希望對方看到明文」的需求；但加密狀態下的運算成本遠高於明文運算，速度通常慢上許多，是採用時須權衡的實務限制。",
    choiceExplanations: {
      B: "同態加密運算全程只需加密後的資料，雲端服務商不需要、也不應取得明文或解密金鑰，否則便失去採用同態加密保護資料的意義。",
      C: "同態加密因需在加密狀態下執行運算，計算成本遠高於明文運算、速度通常慢上許多，並非比明文運算更快，也不特別適合大規模即時運算場景。",
      D: "同態加密的核心正是讓資料「不需解密」也能直接運算，若先解密為明文才運算，雲端服務商便能看到明文內容，違背此情境「不希望對方看到明文」的需求，也不符合同態加密的定義。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["同態加密", "密文運算"],
      constraints: ["privacy", "cost"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若運算量大到同態加密的成本無法承受，替代方案是可信執行環境（TEE）——保護較弱，但速度接近明文運算。",
    },
  },
  {
    id: "junior-ai-basics-practice-q055",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫療機構訓練的AI問診輔助模型上線後，研究人員意外發現只要輸入特定提示語，模型會逐字覆誦出訓練資料中某位病患的完整病歷細節，即使該病歷從未被公開發布過。資安團隊欲說明此現象的成因與可能防範方向。下列說明何者最正確？",
    choices: [
      { id: "A", text: "這種現象只可能是資料庫遭到外部駭客入侵所致，與模型訓練過程本身無關" },
      { id: "B", text: "這種現象屬於中間人攻擊的一種型態，防範方式是加強連線時的憑證驗證程序" },
      { id: "C", text: "模型通過標準的準確率測試，即代表訓練資料不存在被逐字記憶並外洩的風險" },
      { id: "D", text: "模型可能在訓練時記憶樣本，被提示誘發逐字重現，即訓練資料記憶洩漏" },
    ],
    answer: "D",
    explanation:
      "大型模型在訓練過程中，可能不只學到一般化的規律，也記憶了特定訓練樣本的具體內容，日後若被特定提示語誘發，可能逐字或近乎逐字重現訓練資料中的原始內容，即使該內容從未公開發布，這屬於「訓練資料記憶」造成的洩漏風險，防範方向包括差分隱私訓練、資料去識別化、輸出過濾等，而非單純的外部入侵、準確率測試或連線憑證驗證問題。",
    choiceExplanations: {
      A: "此現象源於模型訓練過程中對特定樣本的記憶效應，資料本身可能從未離開受控環境、也未遭外部入侵，純粹是模型行為本身造成的洩漏風險，並非只可能來自外部駭客入侵。",
      B: "中間人攻擊發生在通訊雙方傳輸資料的連線過程，此現象則是模型本身在推論階段重現訓練資料內容，成因與防範方向皆與連線憑證驗證無關。",
      C: "標準準確率測試評估的是模型整體預測表現，無法檢測出模型是否對特定訓練樣本產生逐字記憶，通過準確率測試不代表不存在訓練資料記憶外洩的風險。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["訓練資料記憶", "模型洩漏", "提示誘發"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Overgeneralization",
      },
      crossNode: "L11401",
      decisionBoundary:
        "若模型重現的只是訓練資料的統計傾向而非逐字內容，那是一般化而非記憶洩漏——判準是能否還原到可識別特定個人的程度。",
    },
  },
  {
    id: "junior-ai-basics-practice-q121",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院要把病歷提供給外部研究團隊，考慮三種方案：甲是移除姓名與病歷號、乙是甲再加上把出生年月粗化為五歲一組並把郵遞區號縮為三碼、丙是只提供彙總統計。研究團隊需要個體層級的資料做存活分析。下列建議何者最合理？",
    choices: [
      { id: "A", text: "採甲即可，已移除直接識別欄位" },
      { id: "B", text: "採乙，兼顧個體層級的研究需求與降低準識別欄位組合的獨特性，並搭配資料使用協議" },
      { id: "C", text: "採丙，最安全" },
      { id: "D", text: "三者皆不可行，應拒絕分享" },
    ],
    answer: "B",
    explanation:
      "研究需要個體層級資料，丙直接排除；甲只移除直接識別欄位，出生年月加郵遞區號的組合仍可能在外部資料中鎖定到人。乙把準識別欄位粗化後，重新識別的難度大幅上升，又保留了存活分析所需的個體結構。",
    choiceExplanations: {
      A: "移除姓名與病歷號不足以構成嚴謹的去識別化，準識別欄位組合仍可能造成連結攻擊。",
      C: "彙總統計無法支撐存活分析，研究目的會完全落空。",
      D: "在適當的去識別化與使用協議下分享是可行的，一律拒絕放棄了資料的公共價值。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["去識別化", "準識別欄位", "k-匿名", "研究需求"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若該疾病極為罕見、全國僅數十例，即使粗化後仍可能因人數過少而被鎖定，此時只能走安全運算環境而非釋出資料。",
    },
  },
  {
    id: "junior-ai-basics-practice-q122",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的資安稽核發現三件事：客服系統的所有人員都能查詢全部客戶明細、對外 API 未啟用傳輸加密、備份檔案以明文存放於雲端。若只能先修一項，下列判斷與理由何者最合理？",
    choices: [
      { id: "A", text: "先修傳輸加密，因為它最容易實作" },
      { id: "B", text: "先修存取控制，因為內部人員最不可信" },
      { id: "C", text: "先評估各項的可觸及範圍與被利用難度——明文備份一旦外洩即全量曝光且無從察覺，通常風險最高" },
      { id: "D", text: "三者風險相同，依編號順序處理" },
    ],
    answer: "C",
    explanation:
      "排序不能憑印象，要看「一旦被利用，會曝光多少、多容易被發現」。明文備份是靜態的全量資料，取得後可離線慢慢解析且不會留下存取紀錄；相較之下傳輸攔截需要即時介入、越權查詢至少還留在日誌裡。",
    choiceExplanations: {
      A: "實作難易度是執行考量，不能取代對曝光範圍的評估。",
      B: "內部越權確實是風險，但它至少留有稽核軌跡，範圍也受單次查詢限制。",
      D: "三者的曝光範圍與可偵測性差異很大，等同對待等於放棄風險排序。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["風險排序", "曝光範圍", "可偵測性"],
      constraints: ["security", "risk_priority"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L11102",
      decisionBoundary:
        "若備份其實存放在完全隔離、無對外通路的內部儲存區，它的可觸及性大幅下降，排序就會讓位給對外的 API。",
    },
  },
  {
    id: "junior-ai-basics-practice-q123",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的家長要求刪除其子女的全部學習資料。平台已用這批資料訓練過推薦模型。下列處理何者最完整？",
    choices: [
      { id: "A", text: "刪除原始資料與備份，並評估模型是否可能記憶該筆資料，必要時重訓或採機器遺忘，同時保留刪除作業本身的紀錄" },
      { id: "B", text: "刪除原始資料即可，模型不必處理" },
      { id: "C", text: "以匿名化取代刪除，資料仍可繼續使用" },
      { id: "D", text: "拒絕刪除，因為模型已經訓練完成無法回復" },
    ],
    answer: "A",
    explanation:
      "刪除權要落實到「這個人的資料不再影響任何處理」。原始資料與備份都要清、模型權重中的殘留要評估，同時刪除這件事本身也要留下紀錄以備查核——留紀錄與刪資料並不矛盾，紀錄的是作業而非內容。",
    choiceExplanations: {
      B: "模型權重可能仍帶有該筆資料的影響，只刪來源未必足夠。",
      C: "匿名化是另一種處理方式，不能單方面用來替代當事人明確要求的刪除。",
      D: "技術上的困難不構成拒絕行使權利的理由，應以評估與必要措施回應。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["刪除權", "機器遺忘", "殘留風險"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若該筆資料在訓練集中佔比極小、且已驗證模型無記憶跡象，殘留風險低到只需刪除來源，不必付出重訓成本。",
    },
  },
  {
    id: "junior-ai-basics-practice-q124",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠要與三家供應商共同訓練一套零件瑕疵模型，但各家都不願提供原始影像。下列技術組合何者最能同時滿足協作與保密？",
    choices: [
      { id: "A", text: "請各家把影像壓縮到低解析度後集中" },
      { id: "B", text: "各家把影像加密後集中到同一台伺服器訓練" },
      { id: "C", text: "各家自行訓練後不做任何整合" },
      { id: "D", text: "聯邦學習讓影像留在各廠本地，只交換模型更新，必要時再對更新加入雜訊或安全彙總" },
    ],
    answer: "D",
    explanation:
      "要求是「資料不出廠但模型要共同變好」，這正是聯邦學習的定義場景。若擔心模型更新本身洩漏資訊，再疊上安全彙總或差分隱私，保護層次可以逐步加深。",
    choiceExplanations: {
      A: "降低解析度只是減少資訊量，影像仍然離開了各廠，且瑕疵細節可能一併損失。",
      B: "集中即使加密，訓練時仍需解密使用，影像實質上已離開各廠。",
      C: "不整合就沒有協作效益，等於各做各的。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["聯邦學習", "安全彙總", "差分隱私"],
      constraints: ["privacy", "integration"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L11301",
      decisionBoundary:
        "若三家的瑕疵型態差異極大，聯邦學習訓出的全域模型可能對誰都不夠好，此時要改為各自微調的個人化聯邦。",
    },
  },
  {
    id: "junior-ai-basics-practice-q125",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院的 AI 問診系統對外提供統計查詢介面。資安團隊擔心研究者以反覆查詢的方式推論出特定病患是否在資料集中。下列做法何者最能提供可量化的保護？",
    choices: [
      { id: "A", text: "在統計查詢結果中加入經校準的隨機雜訊，並設定累積的隱私預算上限" },
      { id: "B", text: "限制只有具研究者身分的人可以查詢" },
      { id: "C", text: "把查詢結果四捨五入到整數" },
      { id: "D", text: "把資料庫的傳輸通道加密" },
    ],
    answer: "A",
    explanation:
      "差分隱私的價值在於它給出的是可量化的保證：某個人在不在資料集中，對輸出分布的影響有數學上的上限。搭配隱私預算，還能限制反覆查詢累積起來的洩漏量。",
    choiceExplanations: {
      B: "身分限制是存取控制，有權者仍可反覆查詢並反推，無法防止推論攻擊。",
      C: "四捨五入的擾動幅度不是依隱私目標校準的，保護程度無法量化也容易被大量查詢平均掉。",
      D: "傳輸加密防的是路上被攔截，與查詢結果本身洩漏個體資訊是兩件事。",
    },
    topic: "L11203 資料隱私與安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["差分隱私", "隱私預算", "推論攻擊"],
      constraints: ["privacy"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若查詢介面只回傳全院層級、樣本數以萬計的統計量且不接受任何篩選條件，個體推論的空間本來就極小，差分隱私的必要性隨之下降。",
    },
  },

  // ── L11301 機器學習基本原理（11 題）──────────────────────────────
  {
    id: "junior-ai-basics-practice-q056",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司同時進行兩項分析工作：第一項是蒐集大量已標註病害類型的作物照片，用來訓練模型辨識新照片屬於哪一種病害；第二項是把各田區的土壤感測數值在完全沒有標籤的情況下，依特徵相似程度分成幾個群組，供農學專家事後觀察規律。資料科學家欲向團隊說明這兩項工作各自屬於哪種學習典範。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩項工作都須先由人工為資料標註類別才能進行後續分析，差異在於標註的資料筆數多寡" },
      {
        id: "B",
        text: "第一項屬於非監督式學習，因為模型最終仍須自行判斷新照片的病害類型；第二項因土壤數值本身即是一種標籤，屬於監督式學習",
      },
      { id: "C", text: "監督式與非監督式學習的區分依據主要是資料筆數的多寡，兩項工作實際上屬於同一種學習典範" },
      { id: "D", text: "第一項以標註過病害類型的資料訓練，屬於監督式學習；第二項無標籤、依特徵相似度分群，屬於非監督式學習" },
    ],
    answer: "D",
    explanation:
      "監督式學習使用已標註正確答案（病害類型）的資料訓練模型學習輸入與輸出的對應關係；非監督式學習則沒有標籤，僅依資料本身的特徵尋找群組或結構。第一項工作以標註過病害類型的照片訓練模型，屬於監督式學習；第二項工作在沒有標籤的情況下依特徵相似度分群，屬於非監督式學習，兩者的區分依據並非資料量大小或是否事後仍需人工判讀。",
    choiceExplanations: {
      A: "第二項工作的土壤感測數值本身沒有經過人工標註類別，並非只是標註數量較少，而是完全沒有標籤依據可循。",
      B: "這個對應把兩種學習典範互相對調了，且土壤感測數值只是量測特徵、並非事先標註的正確答案，不能視為標籤。",
      C: "兩種學習典範的核心差異在於資料是否具備標籤，而非資料筆數多寡，此處兩項工作在有無標籤上有本質差異，並非同一類型。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["監督式學習", "非監督式學習", "標籤"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若土壤數值後來被人工標上「適合／不適合種植」的判定，第二項工作就轉為監督式學習——分野在有沒有標籤，不在資料型態。",
    },
  },
  {
    id: "junior-ai-basics-practice-q057",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院蒐集了大量胸腔X光影像，其中僅有一小部分影像已由放射科醫師標註病灶位置，其餘絕大多數影像沒有任何標註；另一組研究團隊則設計了一種訓練方式，讓模型自行遮蔽影像中的一小塊區域，再要求模型依周圍內容預測被遮蔽部位原本的樣子，藉此讓模型無須人工標籤即可學習影像特徵。技術主管欲釐清這兩種作法各自的名稱。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩種作法本質相同，都是先以少量標籤訓練，再逐步擴大標籤數量直到全部資料都有標籤" },
      {
        id: "B",
        text: "前者屬於自監督式學習，因為只用了少量標籤；後者屬於半監督式學習，因為遮蔽區域也算一種標籤形式",
      },
      { id: "C", text: "前者結合少量標籤與大量未標記資料訓練，屬於半監督式學習；後者由資料本身產生訓練訊號，屬於自監督式學習" },
      { id: "D", text: "前者因為仍有醫師標註部分影像，屬於監督式學習；後者因為沒有人工標籤介入訓練過程，不能算是機器學習的一種方法" },
    ],
    answer: "C",
    explanation:
      "半監督式學習使用少量已標記資料搭配大量未標記資料一起訓練，此醫院僅有少數X光影像經醫師標註、其餘未標註，正符合半監督式學習的情境；自監督式學習則是設計「前置任務」讓模型從資料本身自動產生監督訊號（如遮蔽後預測被遮蔽的內容），無須人工標籤，第二組團隊的作法正屬於此類。兩者皆與監督式學習（需要完整標籤）或非機器學習不同。",
    choiceExplanations: {
      A: "半監督式學習並非把少量標籤逐步擴大到全部資料都有標籤，而是同時運用少量標籤與大量未標記資料一起訓練，未標記部分並不會被額外標註。",
      B: "這個對應把兩種作法互相對調了，遮蔽區域是模型自行從資料產生的訓練訊號，而非人工標籤，不能算作半監督式學習的標籤依據。",
      D: "醫師標註的只是少量資料，並不符合監督式學習需要完整標籤資料的定義；第二組團隊設計的遮蔽預測方式雖然不倚賴人工標籤，但仍是機器學習中用來訓練模型的一種方法，並非不屬於機器學習範疇。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["半監督式學習", "自監督式學習", "前置任務"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若醫師把全部影像都標註完成，第一種作法就退回成一般監督式學習——半監督的價值正來自「未標記遠多於標記」。",
    },
  },
  {
    id: "junior-ai-basics-practice-q058",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠導入一套機器人手臂路徑規劃系統，這套系統一開始並不知道最佳的移動路徑，而是讓機器人手臂反覆嘗試不同動作，每次動作後依據是否減少完成時間與碰撞次數而獲得對應的獎勵或懲罰訊號，逐步調整策略以取得最大化的長期獎勵。工程師欲說明這種訓練方式屬於哪一種學習典範。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "這種訓練方式屬於監督式學習，因為每個動作都對應一組事先標註好的正確路徑" },
      { id: "B", text: "這種訓練方式屬於非監督式學習，因為機器人手臂是在沒有回饋訊號的情況下自行摸索路徑" },
      { id: "C", text: "這種訓練方式讓代理人依環境回饋的獎勵訊號調整策略，屬於強化式學習" },
      { id: "D", text: "這種訓練方式屬於自監督式學習，因為獎勵訊號是機器人手臂自己產生的標籤" },
    ],
    answer: "C",
    explanation:
      "強化式學習指代理人（agent）在環境中採取行動，依據行動後獲得的獎勵或懲罰訊號調整策略，以追求長期累積獎勵最大化，此工廠機器人手臂依完成時間與碰撞次數獲得獎勵並調整動作策略，正符合強化式學習的特徵；並非事先有標註好的正確路徑（監督式學習），也並非完全沒有回饋訊號（非監督式學習），更不是自監督式學習所指「從資料本身設計前置任務產生訊號」的情境。",
    choiceExplanations: {
      A: "系統並沒有事先標註好的正確路徑可供對照學習，而是透過獎勵訊號逐步調整策略，這與監督式學習依賴標籤資料的方式不同。",
      B: "機器人手臂每次動作後都會收到獎勵或懲罰訊號作為回饋，這與非監督式學習沒有標籤、也沒有回饋訊號的情境不同。",
      D: "獎勵訊號反映的是外部環境對行動結果的評估，而非模型從資料本身設計前置任務產生的訓練訊號，這與自監督式學習的機制不同。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["強化式學習", "獎勵訊號", "代理人"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若改成先由老師傅示範上千條正確路徑、再讓模型模仿，它就變成監督式學習（模仿學習），不再需要獎勵訊號。",
    },
  },
  {
    id: "junior-ai-basics-practice-q059",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司開發作物產量預測模型，資料科學家將全部歷史資料切分為訓練集、驗證集與測試集三部分，並向新進同仁說明各自的用途。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "三個資料集的用途基本相同，切分成三份的作法只是為了方便平行運算、加快訓練速度" },
      { id: "B", text: "訓練集用於學習模型參數，驗證集用於調整超參數與比較模型，測試集則用於最終評估模型的實際表現" },
      { id: "C", text: "驗證集與測試集的用途基本相同，訓練過程中可以互相替代使用，不需要另外切出獨立的測試集" },
      { id: "D", text: "訓練集資料量增加後，其誤差表現即可視為模型面對新資料的實際表現，無須另外保留驗證集或測試集" },
    ],
    answer: "B",
    explanation:
      "訓練集用於學習模型的參數；驗證集用於在訓練過程中比較不同模型或調整超參數（如選擇最佳的樹深度、學習率）；測試集則是在模型與超參數都確定之後，用來評估模型對未見過資料的實際表現，三者用途不同且不應混用，才能避免評估結果過度樂觀。",
    choiceExplanations: {
      A: "三個資料集切分的目的是讓不同階段（學習參數、調整超參數、最終評估）使用彼此獨立的資料，並非只是為了加快運算速度。",
      C: "驗證集在訓練過程中被反覆用來比較與調整模型，測試集則只在最後用一次以評估最終表現；若兩者互相替代使用，測試集會失去獨立性，評估結果容易偏樂觀。",
      D: "訓練集資料量增加雖然有助於模型學習更完整的規律，但訓練集本身的表現不會因此等同於模型面對全新資料時的實際表現，仍需要獨立的驗證集與測試集分別用於調整超參數與最終評估。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["訓練集", "驗證集", "測試集"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若測試集被拿來反覆比較模型，它就退化成第二個驗證集，最終評估的樂觀偏誤又會回來。",
    },
  },
  {
    id: "junior-ai-basics-practice-q060",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠工程師建立設備故障預測模型，在進行特徵標準化時，使用了包含訓練集與測試集在內的「全部資料」一起計算平均值與標準差，再分別套用到訓練集與測試集上；模型上線後的實際表現明顯低於測試階段的評估結果。資料科學家檢視流程後，認為問題出在這個標準化步驟。下列說明何者最正確？",
    choices: [
      { id: "A", text: "使用全部資料一起計算標準化參數是常見且正確的作法，與模型上線後表現變差沒有關聯" },
      { id: "B", text: "這個作法讓測試集的統計資訊滲入訓練流程，屬於資料洩漏，導致測試階段的評估結果過於樂觀" },
      { id: "C", text: "資料洩漏指的是訓練資料筆數不足，此情境的問題其實出在訓練集樣本數太少" },
      { id: "D", text: "測試集準確率偏高，代表資料洩漏的疑慮已經可以排除，後續不需要再進一步檢查標準化流程是否存在問題" },
    ],
    answer: "B",
    explanation:
      "資料洩漏（Data Leakage）指模型在訓練階段間接取得了不應取得的測試集資訊，使評估結果過於樂觀、無法反映真實效能。此情境以全部資料（含測試集）一起計算標準化的平均值與標準差，等於讓測試集的統計特性滲入了訓練流程，屬於典型的資料洩漏，這也解釋了為何測試階段評估結果良好，但上線後實際表現卻明顯下滑；正確作法應僅以訓練集計算標準化參數，再套用到驗證集與測試集。",
    choiceExplanations: {
      A: "以全部資料（含測試集）一起計算標準化參數，會讓測試集的統計資訊間接影響訓練流程，這正是導致上線後表現下滑的資料洩漏問題，並非常見且正確的作法。",
      C: "資料洩漏指的是不應取得的資訊滲入訓練流程，與訓練集樣本數多寡是不同的問題，此情境的訓練集樣本數並非題目描述的重點。",
      D: "測試集準確率偏高有可能正是資料洩漏造成的假象，因為測試集的統計資訊已間接影響訓練流程，不能僅憑準確率高就排除資料洩漏的疑慮，仍應檢查前處理流程是否有資訊滲入。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料洩漏", "標準化", "評估樂觀偏誤"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若標準化參數改為只用訓練集計算、再原樣套用到測試集，流程就正確了——關鍵是測試集的統計量不得回流。",
    },
  },
  {
    id: "junior-ai-basics-practice-q061",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院蒐集病患多年來的定期回診檢驗數值，欲建立疾病惡化趨勢預測模型；資料科學家原本打算採用標準k摺交叉驗證，隨機把資料切成k份輪流訓練與驗證，同事提醒這種作法可能不適合時間序列資料。下列說明何者最正確？",
    choices: [
      { id: "A", text: "標準k摺交叉驗證的隨機切分方式，對時間序列資料的評估結果不會造成影響，可比照一般資料直接使用" },
      { id: "B", text: "標準k摺交叉驗證的問題在於運算時間過長，與資料是否具有時間先後順序無關" },
      { id: "C", text: "標準k摺隨機切分可能讓未來的資料被用來預測過去，時間序列資料應改採依時間順序切分的驗證方式" },
      { id: "D", text: "把時間序列樣本的先後順序隨機打亂，是業界處理時間序列交叉驗證的標準作法，能提升評估結果的可靠性" },
    ],
    answer: "C",
    explanation:
      "標準k摺交叉驗證會將資料隨機切成k份、輪流作為驗證集，若直接套用在具有時間先後順序的資料上，可能讓時間點較晚（未來）的資料被分到訓練集、用來預測時間點較早（過去）的驗證資料，這在實際應用中並不合理（模型不可能用未來資料預測過去），因此時間序列資料通常改採依時間順序切分的驗證方式（如以較早期間訓練、較晚期間驗證），而非隨機切分。",
    choiceExplanations: {
      A: "標準k摺隨機切分可能讓時間點較晚的資料進入訓練集、用來預測時間點較早的驗證資料，這種安排對時間序列資料的評估結果有實質影響，並非可以比照一般資料直接套用。",
      B: "標準k摺交叉驗證在時間序列資料上的疑慮，主要在於隨機切分可能違反時間先後順序、造成用未來資料預測過去的問題，而不是運算時間長短的考量。",
      D: "隨機打亂時間序列樣本的先後順序，並不是業界處理時間序列交叉驗證的標準作法，這麼做反而會抹除資料原有的時間脈絡，讓評估結果誤判模型在真實情境下的表現。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["k摺交叉驗證", "時間序列", "切分方式"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若各病患彼此獨立、且模型不預測時間趨勢而只做橫斷面分類，隨機 k 摺就重新適用。",
    },
  },
  {
    id: "junior-ai-basics-practice-q062",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司訓練作物產量預測模型，發現模型在訓練資料上的誤差非常低，但套用到新一季從未見過的田區資料時，誤差卻大幅上升；另一個團隊訓練的模型則是在訓練資料與新資料上的誤差都偏高、表現平庸。資料科學家欲分別說明這兩種現象的名稱。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "前者屬於過擬合，模型過度配適訓練資料的細節與雜訊；後者屬於欠擬合，模型複雜度不足以捕捉資料中的規律" },
      { id: "B", text: "前者屬於欠擬合，因為訓練誤差偏低代表模型學得不夠深入；後者屬於過擬合，因為兩種資料的誤差表現一致" },
      { id: "C", text: "兩種現象其實是同一件事，差別只在於模型訓練所使用的資料筆數多寡不同" },
      { id: "D", text: "持續增加模型訓練的回合數，通常被認為是同時改善過擬合與欠擬合兩種現象最常用且效果穩定的作法" },
    ],
    answer: "A",
    explanation:
      "過擬合指模型過度配適訓練資料中的細節甚至雜訊，導致訓練誤差很低，但套用到新資料時因無法一般化而誤差大幅上升；欠擬合則是模型複雜度不足以捕捉資料中真正的規律，使得訓練誤差與新資料誤差皆偏高、整體表現平庸。前者情境正是訓練誤差低、新資料誤差高的過擬合，後者則是兩者誤差皆偏高的欠擬合，兩者成因與應對方式（如簡化模型或增加正則化因應過擬合、增加模型複雜度或特徵因應欠擬合）並不相同。",
    choiceExplanations: {
      B: "這個對應把兩種現象互相對調了，訓練誤差偏低但新資料誤差偏高是過擬合的特徵，而非欠擬合；兩種資料誤差表現一致且皆偏高才是欠擬合的特徵。",
      C: "過擬合與欠擬合的核心差異在於模型複雜度與資料配適程度是否恰當，而非單純取決於訓練資料筆數多寡。",
      D: "增加訓練回合數可能讓原本欠擬合的模型逐漸改善，但也可能讓模型更進一步過度配適訓練資料，反而加劇過擬合的問題，並非能同時改善兩種現象的常用作法。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["過擬合", "欠擬合", "一般化"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若訓練誤差與新資料誤差都很低，兩種現象都不存在——診斷必須同時看兩個誤差，只看其中一個一定會判錯。",
    },
  },
  {
    id: "junior-ai-basics-practice-q063",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠設備異常偵測團隊比較兩個模型：模型甲結構非常簡單，對訓練資料與新資料的預測誤差都偏高且相近；模型乙結構複雜，訓練誤差極低，但在不同批次新資料上的預測結果起伏很大、誤差變化明顯。工程師欲以偏差—變異概念說明兩個模型的問題。下列敘述何者最正確？",
    choices: [
      {
        id: "A",
        text: "模型甲偏差高、變異低，因結構過於簡單而配適不足；模型乙偏差低、變異高，因結構過於複雜而對資料波動過度敏感",
      },
      { id: "B", text: "模型甲偏差低、變異高，因結構簡單使預測結果不穩定；模型乙偏差高、變異低，因結構複雜使預測穩定但配適不足" },
      { id: "C", text: "偏差與變異其實是同一種誤差來源在不同訓練階段所使用的名稱，兩個模型面臨的問題成因基本相同" },
      { id: "D", text: "模型乙變異偏高的原因主要是訓練資料量不足所致，這與模型本身的結構複雜度並無直接關聯，可以先排除結構因素" },
    ],
    answer: "A",
    explanation:
      "偏差（bias）指模型因假設過於簡化，無法充分捕捉資料規律而產生的系統性誤差；變異（variance）則指模型對訓練資料的微小變動過度敏感，導致在不同資料批次上預測結果起伏不定。模型甲結構簡單、誤差偏高且穩定，屬於高偏差、低變異（配適不足）；模型乙結構複雜、訓練誤差低但新資料預測起伏大，屬於低偏差、高變異（對資料波動過度敏感），兩者的問題來源與應對方式（簡化或增加模型複雜度、增加正則化等）並不相同。",
    choiceExplanations: {
      B: "這個對應把兩個模型的偏差與變異表現互相對調了，結構簡單、誤差偏高且穩定的模型甲屬於高偏差低變異，而非低偏差高變異。",
      C: "偏差與變異是造成模型誤差的兩種不同來源，分別對應配適不足與對資料波動過度敏感兩種不同問題，並非同一種誤差來源在不同階段的名稱。",
      D: "模型乙變異偏高的原因主要是結構複雜、對資料波動較敏感，而非訓練資料量不足；即使增加資料量，複雜結構仍可能使預測結果對資料變動敏感。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["偏差", "變異", "模型複雜度"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若模型乙在大量增加訓練資料後變異明顯下降，資料量確實也是主因之一——偏差與變異的診斷要靠學習曲線驗證，不能只看單次結果。",
    },
  },
  {
    id: "junior-ai-basics-practice-q064",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院訓練一套以患者多項生理指標預測住院天數的迴歸模型，原始特徵多達上百個，其中許多特徵彼此高度相關或對預測幫助有限；資料科學家考慮在損失函數中加入正則化項，並比較L1與L2兩種正則化方式的特性。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "L1與L2正則化的差異只在於程式實作時使用的函式名稱不同，兩者對係數的影響方式並無區別" },
      { id: "B", text: "L1正則化會讓不重要特徵的係數趨近但通常不會恰好等於零，L2正則化則會將部分係數直接壓縮至零形成稀疏解" },
      { id: "C", text: "加入正則化項的目的是加快模型訓練的運算速度，與抑制模型過度配適訓練資料並無關聯" },
      { id: "D", text: "L1正則化傾向將不重要特徵的係數壓縮至零、產生稀疏解，L2正則化則讓係數整體縮小但通常不會恰好為零" },
    ],
    answer: "D",
    explanation:
      "L1正則化（Lasso）在損失函數中加入係數絕對值的懲罰項，傾向讓不重要特徵的係數被壓縮至恰好為零，產生稀疏解，具有特徵篩選的效果；L2正則化（Ridge）則加入係數平方的懲罰項，讓所有係數整體縮小但通常不會恰好為零。此醫院原始特徵多達上百個且部分特徵高度相關或助益有限，若欲同時達到抑制過度配適並篩選出重要特徵的效果，可考慮L1正則化的稀疏化特性。",
    choiceExplanations: {
      A: "L1與L2正則化在數學形式（絕對值懲罰與平方懲罰）與對係數的影響方式（稀疏化或整體縮小）上有實質差異，並非只是函式名稱不同、影響方式並無區別。",
      B: "這個對應把L1與L2正則化的特性互相對調了，將係數壓縮至恰好為零、產生稀疏解的是L1正則化，讓係數整體縮小但通常不為零的才是L2正則化。",
      C: "加入正則化項的主要目的是抑制模型過度配適訓練資料、提升對新資料的一般化能力，並非為了加快運算速度，加入額外的懲罰項計算反而可能略微增加運算負擔。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["L1正則化", "L2正則化", "稀疏解"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若目標是保留全部特徵、只想壓抑係數幅度以穩定模型，L2 才對；要順便做特徵篩選才選 L1。",
    },
  },
  {
    id: "junior-ai-basics-practice-q065",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司訓練作物產量迴歸模型，團隊成員對「損失函數」與「優化器」兩者的分工有些混淆，想釐清各自在訓練過程中扮演的角色。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "損失函數負責衡量模型預測值與實際值之間的差距，優化器則依據這個差距調整模型參數以縮小誤差" },
      { id: "B", text: "損失函數與優化器指的是同一個訓練元件，兩個名稱只是在不同教材中的不同稱呼方式" },
      { id: "C", text: "優化器負責衡量模型預測值與實際值之間的差距，損失函數則依據這個差距調整模型參數" },
      { id: "D", text: "損失函數的作用是決定模型的網路層數與神經元數量，優化器則負責準備與清洗訓練資料的前處理工作" },
    ],
    answer: "A",
    explanation:
      "損失函數（Loss Function）負責衡量模型當前預測值與實際值之間的差距，產出一個可供比較與最小化的數值；優化器（Optimizer，如梯度下降）則依據損失函數計算出的差距（及其梯度）調整模型參數，逐步縮小預測誤差。此農業產量預測模型訓練時，損失函數與優化器分工明確——損失函數評估誤差、優化器據以調整參數，兩者並非同一元件，也不負責決定網路架構或準備資料。",
    choiceExplanations: {
      B: "損失函數負責衡量預測誤差、優化器負責依誤差調整參數，兩者在訓練流程中扮演不同角色，並非同一元件在不同教材中的不同稱呼。",
      C: "這個對應把兩者的角色互相對調了，衡量預測值與實際值差距的是損失函數，依據這個差距調整模型參數的才是優化器。",
      D: "決定網路層數與神經元數量屬於模型架構設計的範疇，準備訓練資料屬於資料前處理的範疇，兩者皆非損失函數或優化器在訓練過程中的職責。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["損失函數", "優化器", "參數更新"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若換掉損失函數，模型追求的目標就變了；若只換優化器，目標不變、只是走向最低點的路徑不同。",
    },
  },
  {
    id: "junior-ai-basics-practice-q066",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠瑕疵檢測團隊蒐集到的瑕疵影像樣本數量偏少，為避免模型因樣本不足而表現不佳，工程師考慮對既有瑕疵影像進行旋轉、翻轉、調整亮度等變化，產生更多樣化的訓練樣本，而不重新拍攝實體影像。下列說明何者最正確？",
    choices: [
      { id: "A", text: "這種作法稱為正規化，主要目的是把影像像素值縮放到相同的數值範圍，與樣本數量多寡無關" },
      { id: "B", text: "這種作法會讓模型直接學到原本沒有的瑕疵類型，等同於取得了全新種類的真實樣本" },
      { id: "C", text: "這種作法稱為資料增強，藉由既有樣本的變化版本增加訓練資料的多樣性，有助於降低過擬合風險" },
      { id: "D", text: "這種作法對訓練效果沒有實質幫助，唯有蒐集全新拍攝的實體影像才能改善模型表現" },
    ],
    answer: "C",
    explanation:
      "資料增強（Data Augmentation）指對既有樣本進行旋轉、翻轉、調整亮度、裁切等變化，產生變化版本以增加訓練資料的多樣性，而不需要重新蒐集全新的實體樣本，有助於在樣本數量有限時降低模型過度配適訓練資料的風險。此工廠瑕疵影像樣本數量偏少，以旋轉、翻轉、調整亮度等方式擴增樣本，正是典型的資料增強作法；它並非把像素值縮放到固定範圍的正規化，產生的也只是既有瑕疵的變化版本、而非全新種類的瑕疵樣本，也並非對訓練效果沒有幫助。",
    choiceExplanations: {
      A: "把像素值縮放到相同數值範圍指的是正規化，而此情境的重點是藉由旋轉、翻轉等方式增加樣本多樣性，兩者是不同的前處理技術。",
      B: "資料增強產生的仍是既有瑕疵影像的變化版本，瑕疵類型本身並未改變，並不等同於取得了全新種類的真實樣本。",
      D: "資料增強在樣本數量有限時，通常能以較低成本增加訓練資料的多樣性、降低過擬合風險，對訓練效果具有實質幫助，並非只有重新拍攝實體影像才有效。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["資料增強", "樣本不足", "過擬合"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若某種瑕疵在資料集中一個樣本都沒有，增強救不了——它只能擴充既有類型的變化，不能無中生有新類別。",
    },
  },
  {
    id: "junior-ai-basics-practice-q126",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠的瑕疵預測模型，訓練誤差 2%、驗證誤差 3%、上線後實測誤差 18%。已確認上線資料的特徵分布與訓練期相近。下列推論何者最可能？",
    choices: [
      { id: "A", text: "模型過擬合，應加強正則化" },
      { id: "B", text: "特徵尺度未標準化" },
      { id: "C", text: "模型欠擬合，應增加層數" },
      { id: "D", text: "驗證集與上線環境之間存在落差，例如驗證集切分方式讓相鄰時點的樣本同時進入兩邊" },
    ],
    answer: "D",
    explanation:
      "訓練與驗證都很好卻在上線後崩壞，且輸入分布沒變，代表驗證本身高估了泛化能力。最常見的成因是切分方式讓高度相關的樣本同時落在訓練與驗證兩邊，使驗證等於在考已經看過的題目。",
    choiceExplanations: {
      A: "過擬合的典型症狀是訓練好、驗證差；此處驗證也很好，不符合。",
      B: "尺度問題會同時影響訓練與驗證表現，不會只在上線後才出現。",
      C: "欠擬合會讓訓練誤差也偏高，與 2% 的訓練誤差矛盾。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["驗證失真", "相關樣本", "切分方式"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Terminology Swap",
      },
      crossNode: "L11202",
      decisionBoundary:
        "若上線資料的特徵分布明顯與訓練期不同，診斷就改為資料漂移，處方也從「改切分」變成「以新資料重訓」。",
    },
  },
  {
    id: "junior-ai-basics-practice-q127",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院要訓練罕病篩檢模型，全院五年僅累積 40 例陽性、12 萬例陰性。團隊考慮四種路線。下列評估何者最合理？",
    choices: [
      { id: "A", text: "以整體準確率為目標訓練二元分類器，簡單直接" },
      { id: "B", text: "40 例陽性難以支撐監督式分類，應優先考慮以正常樣本建模的異常偵測，並以召回率與人工複核成本評估" },
      { id: "C", text: "刪除大部分陰性樣本使兩類數量相同" },
      { id: "D", text: "增加模型參數量以彌補樣本不足" },
    ],
    answer: "B",
    explanation:
      "40 例正樣本要涵蓋罕病的各種表現形態幾乎不可能，監督式分類會嚴重過擬合到那幾十例。改以「只學正常樣態、偏離即標為可疑」的異常偵測，就繞開了必須蒐集足夠陽性樣本這個前提，再以召回率與複核量能決定門檻。",
    choiceExplanations: {
      A: "陽性佔比萬分之三，全猜陰性就有 99.97% 準確率，這個目標完全無法引導模型。",
      C: "刪掉十幾萬筆陰性會丟失絕大部分關於正常樣態的資訊，模型反而更學不會分辨。",
      D: "參數量增加只會讓模型更容易背下那 40 例，泛化更差。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["極度不平衡", "異常偵測", "召回率"],
      constraints: ["labeled_data_scarcity", "quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L11302",
      decisionBoundary:
        "若能透過跨院合作把陽性樣本累積到數百例且涵蓋各種表現型態，監督式分類就會勝出，因為它能指出是哪一型。",
    },
  },
  {
    id: "junior-ai-basics-practice-q128",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業團隊有大量未標註的空拍影像與少量已標註的病害樣本，標註需仰賴專家且成本高。下列學習策略何者最貼近此情境？",
    choices: [
      { id: "A", text: "半監督式學習，以少量標註搭配大量未標註資料一起訓練" },
      { id: "B", text: "強化式學習，以獎勵訊號調整策略" },
      { id: "C", text: "監督式學習，先把全部影像標註完成" },
      { id: "D", text: "僅用非監督分群，不使用任何標註" },
    ],
    answer: "A",
    explanation:
      "標註昂貴但原始資料充足，正是半監督式學習的設計場景：用少量標註建立初步判斷，再借助大量未標註資料的分布結構把決策邊界推得更準。",
    choiceExplanations: {
      B: "強化式學習需要能與環境互動並取得獎勵訊號，影像判讀沒有這樣的互動迴圈。",
      C: "全部標註正是成本上做不到的事，這個前提與題幹衝突。",
      D: "完全不用已有的標註會浪費專家投入，分群結果也未必對應到病害類別。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["半監督式學習", "標註成本", "群聚假設"],
      constraints: ["labeled_data_scarcity", "cost"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若未標註影像與標註影像來自不同季節或不同地區、分布明顯不同，半監督的群聚假設反而會把模型帶偏。",
    },
  },
  {
    id: "junior-ai-basics-practice-q129",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行以三年交易紀錄預測未來一季的違約。資料科學家打算隨機打散後切成訓練與測試集。下列建議何者最正確？",
    choices: [
      { id: "A", text: "應把測試集也納入訓練以提高準確率" },
      { id: "B", text: "隨機切分即可，只要比例正確" },
      { id: "C", text: "應改為依時間切分，以較早的資料訓練、較晚的資料測試" },
      { id: "D", text: "應依客戶姓名筆劃排序後切分" },
    ],
    answer: "C",
    explanation:
      "隨機打散會讓時間點較晚的交易進入訓練集，等於讓模型「看過未來」再回頭預測過去。依時間切分才能模擬上線時「只有過去可用」的真實條件。",
    choiceExplanations: {
      A: "測試集一旦參與訓練就失去評估意義，得到的只是自我測驗的分數。",
      B: "比例正確但順序被打亂，資訊洩漏依然存在，測得的分數無法在上線時重現。",
      D: "依姓名排序切分會造成訓練與測試的客群結構不同，是另一種嚴重的錯誤。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時間切分", "資訊洩漏", "泛化評估"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若各筆交易彼此獨立、且模型不預測時間趨勢而只做橫斷面分類，隨機切分就重新適用。",
    },
  },
  {
    id: "junior-ai-basics-practice-q130",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的成績預測模型訓練誤差與驗證誤差都偏高且相近。下列調整何者最合理？",
    choices: [
      { id: "A", text: "把驗證集併入訓練集" },
      { id: "B", text: "加強正則化以抑制過擬合" },
      { id: "C", text: "減少訓練資料量" },
      { id: "D", text: "增加模型容量或補上更有資訊量的特徵" },
    ],
    answer: "D",
    explanation:
      "兩邊誤差都高且相近是欠擬合的典型徵狀：模型連訓練資料的規律都沒學到。此時要放寬限制而不是收緊——增加容量、延長訓練，或回頭檢查特徵是否根本帶不動訊號。",
    choiceExplanations: {
      A: "併入驗證集會讓人失去偵測問題的能力，且不解決容量不足。",
      B: "正則化治的是過擬合，在欠擬合時加強只會讓模型更學不動。",
      C: "減少資料會讓模型能學到的規律更少，方向相反。",
    },
    topic: "L11301 機器學習基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["欠擬合", "模型容量", "特徵資訊量"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Terminology Swap",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若訓練誤差很低而驗證誤差偏高，診斷就翻轉成過擬合，處方也從「加容量」變成「加正則化」。",
    },
  },

  // ── L11302 常見的機器學習模型（12 題）────────────────────────────
  {
    id: "junior-ai-basics-practice-q067",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行欲以客戶的年收入、信用卡使用年數等連續型特徵，預測客戶下一年度的信用卡年消費總額（一個連續數值）；資料科學家評估採用線性迴歸模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "線性迴歸假設目標變數與特徵之間存在線性關係，輸出為連續數值，適合預測消費總額這類連續型目標" },
      { id: "B", text: "線性迴歸的輸出經過轉換後只會落在0到1之間，適合直接用來預測消費總額是否超過某個門檻" },
      { id: "C", text: "線性迴歸的參數估計方式與特徵之間是否存在線性關係無關，即使關係明顯非線性也不影響模型的配適效果" },
      { id: "D", text: "線性迴歸的設計限定為單一特徵的迴歸分析，多項特徵同時輸入時模型會無法完成訓練" },
    ],
    answer: "A",
    explanation:
      "線性迴歸假設目標變數可以表示為特徵的線性組合，透過最小化誤差（如最小平方法）估計各特徵的係數，輸出為連續數值，適合預測消費總額這類連續型目標。若特徵與目標變數的關係明顯偏離線性，模型的配適效果通常會變差，需考慮特徵轉換或改用其他模型；輸出限制在0到1之間、適合分類判斷的是邏輯迴歸而非線性迴歸；線性迴歸也能同時處理多項特徵（多元線性迴歸），並非僅限單一特徵。",
    choiceExplanations: {
      B: "把輸出轉換至0到1之間、用於判斷是否超過門檻，是邏輯迴歸的特性，線性迴歸的原始輸出並不會被限制在固定區間內。",
      C: "線性迴歸的配適效果與特徵和目標變數之間是否存在線性關係有直接關聯，當實際關係明顯偏離線性時，模型的配適誤差通常會明顯上升。",
      D: "線性迴歸可以同時納入多項特徵進行訓練（即多元線性迴歸），並非僅能處理單一特徵的迴歸問題。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["線性迴歸", "連續型目標"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若目標改成「會不會違約」這種二元結果，線性迴歸就不適用，該換成輸出落在 0 到 1 的邏輯迴歸。",
    },
  },
  {
    id: "junior-ai-basics-practice-q068",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠欲根據設備的振動、溫度等感測數值，預測該設備在未來24小時內是否會發生故障（故障或不故障的二元結果）；資料科學家評估採用邏輯迴歸模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "邏輯迴歸透過sigmoid函數將線性組合的輸出轉換為0到1之間的機率值，適合處理這類二元分類問題" },
      { id: "B", text: "邏輯迴歸的輸出直接是感測數值的加總結果，數值範圍與輸入特徵的原始範圍相同" },
      { id: "C", text: "邏輯迴歸的估計過程要求特徵之間互不相關，特徵間存在相關性時，模型將無法完成訓練並產出係數" },
      { id: "D", text: "邏輯迴歸的訓練目標是讓輸出結果盡量接近目標變數的中位數，而非最大化分類的正確機率" },
    ],
    answer: "A",
    explanation:
      "邏輯迴歸將特徵的線性組合透過sigmoid函數轉換為0到1之間的機率值，再依門檻（如0.5）判定類別，適合處理故障／不故障這類二元分類問題；其輸出經過sigmoid轉換，並非直接等於特徵加總的原始數值範圍，訓練目標是以最大概似估計等方法讓模型輸出的機率盡量貼近實際類別，而非讓輸出接近目標變數的中位數。特徵之間存在一定相關性時，邏輯迴歸通常仍可運作，只是估計結果的穩定性可能受影響。",
    choiceExplanations: {
      B: "邏輯迴歸的輸出經過sigmoid函數轉換為0到1之間的機率值，並非直接等於特徵加總後的原始數值範圍。",
      C: "邏輯迴歸在特徵之間存在一定相關性時通常仍可完成訓練並產出係數，只是估計結果的穩定性可能受到影響，並非特徵一有相關性模型就無法訓練。",
      D: "邏輯迴歸的訓練目標是讓模型預測的機率盡量貼近實際類別（即最大化分類的正確機率），而非讓輸出結果接近目標變數的中位數。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["邏輯迴歸", "sigmoid", "二元分類"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若目標改成預測「未來 24 小時內故障幾次」這種計數，邏輯迴歸就不適用，該換成卜瓦松迴歸或一般迴歸模型。",
    },
  },
  {
    id: "junior-ai-basics-practice-q069",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司蒐集了各田區的多項土壤與氣象特徵，並依收成品質標記為「優」「良」「普通」三個等級；資料科學家欲以K最近鄰（KNN）演算法為一筆新田區資料分類，先計算新資料與訓練集中各筆資料的距離，再依最近的K筆鄰居的多數類別決定分類結果。下列說明何者最正確？",
    choices: [
      { id: "A", text: "KNN在分類時會先建立一個明確的數學公式或決策邊界方程式，再依方程式判斷新資料的類別，不需逐筆計算距離" },
      { id: "B", text: "KNN是一種依樣本間距離判斷分類的方法，K值的選擇會影響模型對雜訊的敏感程度與分類邊界的平滑程度" },
      { id: "C", text: "KNN的分類結果與K值的大小無關，不同的K值設定下，同一筆新資料的分類結果通常保持一致" },
      { id: "D", text: "KNN在訓練階段需要對資料進行複雜的參數估計與反覆疊代求解，分類時只需查表即可迅速得出結果" },
    ],
    answer: "B",
    explanation:
      "K最近鄰（KNN）是一種依樣本間距離（如歐氏距離）判斷分類的方法，對新資料計算其與訓練集中各筆資料的距離，取最近的K筆鄰居，依多數類別決定分類結果；K值的選擇會影響模型行為——K值較小時模型對雜訊較敏感、分類邊界較不平滑，K值較大時邊界較平滑但可能忽略局部細節。KNN屬於「惰性學習」，訓練階段幾乎不需要參數估計，主要運算集中在分類（預測）階段逐筆計算距離，而非先建立決策邊界方程式或需要複雜的疊代求解。",
    choiceExplanations: {
      A: "KNN在分類階段是逐筆計算新資料與訓練集中各筆資料的距離，並依鄰居的多數類別判斷，並不會事先建立明確的數學公式或決策邊界方程式。",
      C: "K值的大小會直接影響納入考量的鄰居數量與分類邊界的平滑程度，不同的K值通常會得到不同的分類結果，而非與K值大小無關。",
      D: "KNN的訓練階段主要只是保留訓練資料本身，不涉及複雜的參數估計或疊代求解；真正需要逐筆計算距離、耗費運算資源的階段是分類（預測）時，而非訓練階段。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["KNN", "距離", "K值"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若特徵維度極高，樣本間距離會趨於一致（維度詛咒），KNN 的判斷失去鑑別力，該先降維或換模型。",
    },
  },
  {
    id: "junior-ai-basics-practice-q070",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行欲建立一套可解釋的貸款核准判斷模型，方便法遵人員逐步理解每一筆判斷背後的邏輯；資料科學家評估採用決策樹模型，依收入、負債比、信用評分等特徵逐層切分資料。下列說明何者最正確？",
    choices: [
      { id: "A", text: "決策樹的每一層切分都是隨機選擇特徵進行，與各特徵對降低分類不純度的貢獻程度無關" },
      { id: "B", text: "決策樹的判斷邏輯難以逐步追蹤，法遵人員無法像其他模型一樣清楚看出每一步的切分依據" },
      { id: "C", text: "決策樹的切分機制是設計給類別型特徵使用，若輸入收入、負債比等連續數值型特徵，需要先自行轉換為類別才能訓練" },
      { id: "D", text: "決策樹依特徵對降低分類不純度的貢獻程度逐層切分資料，切分路徑可逐步追蹤，具有較高的可解釋性" },
    ],
    answer: "D",
    explanation:
      "決策樹在每一層切分時，會依某種不純度指標（如吉尼不純度或熵）評估各特徵切分後能降低不純度的程度，選擇貢獻最大的特徵與門檻值進行切分，如此逐層建立樹狀結構；由於每一步切分的依據明確，判斷路徑可以逐步追蹤還原，決策樹因此具有較高的可解釋性，適合此銀行希望法遵人員能理解判斷邏輯的情境。決策樹的切分並非隨機選擇特徵，也能直接處理連續數值型特徵（依門檻值切分），並非只能處理類別型特徵。",
    choiceExplanations: {
      A: "決策樹在每一層切分時，是依特徵對降低分類不純度的貢獻程度來選擇切分依據，而非隨機選擇特徵。",
      B: "決策樹的每一步切分依據（選用的特徵與門檻值）都可以清楚記錄下來、逐步追蹤還原判斷路徑，這正是決策樹常被認為具有較高可解釋性的原因，並非難以追蹤。",
      C: "決策樹能夠直接依門檻值處理連續數值型特徵（如收入、負債比）進行切分，不需要事先將這些特徵轉換為類別型態才能訓練。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["決策樹", "不純度", "可解釋性"],
      constraints: ["explainability"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若樹長到數十層、上千個節點，可解釋性就名存實亡——可解釋來自路徑短到人讀得完，不是來自模型種類。",
    },
  },
  {
    id: "junior-ai-basics-practice-q071",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠欲提升瑕疵分類模型的穩定性，資料科學家評估以隨機森林取代單一決策樹，方法是同時訓練多棵決策樹、各棵樹使用隨機抽樣的訓練樣本與特徵子集，最後綜合多棵樹的預測結果。下列說明何者最正確？",
    choices: [
      { id: "A", text: "隨機森林中的每一棵決策樹都使用彼此相同的訓練樣本與特徵組合，訓練過程中樹與樹之間的差異只在於初始參數設定不同" },
      { id: "B", text: "隨機森林的預測結果由樹群中單一表現最好的一棵樹決定，其餘各棵樹的預測結果並不會納入最終判斷" },
      { id: "C", text: "隨機森林由於同時訓練多棵樹，運算成本比單一決策樹更低，且分類穩定度通常不如單一決策樹" },
      { id: "D", text: "隨機森林透過隨機抽樣樣本與特徵訓練多棵決策樹，再綜合各樹的預測結果，通常比單一決策樹更穩定、較不易過度配適" },
    ],
    answer: "D",
    explanation:
      "隨機森林（Random Forest）是一種集成學習方法，同時訓練多棵決策樹，各棵樹使用隨機抽樣（如放回抽樣）的訓練樣本與隨機抽取的特徵子集，彼此存在差異，最終再綜合（如多數決或平均）多棵樹的預測結果。這種作法通常比單一決策樹更穩定、較不易受個別樹的雜訊或過度配適影響，適合此工廠希望提升瑕疵分類模型穩定性的需求。隨機森林各樹的訓練樣本與特徵組合並不相同，運算成本通常高於單一決策樹（因需訓練多棵樹），最終判斷也是綜合多棵樹而非僅依賴單一表現最好的樹。",
    choiceExplanations: {
      A: "隨機森林中各棵決策樹是以隨機抽樣的訓練樣本與隨機抽取的特徵子集分別訓練，樹與樹之間的差異不只在於初始參數，樣本與特徵組合本身就不相同。",
      B: "隨機森林的最終預測結果是綜合（如多數決或平均）樹群中所有樹的預測結果，而非僅由單一表現最好的一棵樹決定。",
      C: "隨機森林因需同時訓練多棵決策樹，運算成本通常高於單一決策樹；且其分類穩定度通常優於單一決策樹，而非不如單一決策樹。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["隨機森林", "集成學習", "隨機抽樣"],
      constraints: ["explainability", "cost"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若需求是「向法遵人員逐步說明每一筆判斷」，穩定性的優勢會被可解釋性的損失抵銷，單一決策樹反而合適。",
    },
  },
  {
    id: "junior-ai-basics-practice-q072",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司只蒐集到少量但特徵維度很高的作物病害光譜資料（樣本數僅數百筆，每筆樣本卻有上千個光譜波段特徵），欲訓練分類模型判斷病害類型；資料科學家比較支援向量機（SVM）與其他模型的適用性。下列說明何者最正確？",
    choices: [
      { id: "A", text: "SVM在特徵維度遠高於樣本數的情境下，模型通常會因特徵過多而難以收斂，較適合特徵數量少於樣本數的資料集" },
      { id: "B", text: "SVM的訓練成本與資料集規模大小無關，即使資料筆數成長到數百萬筆，訓練所需時間也大致相同" },
      { id: "C", text: "SVM在高維度、小樣本的情境下常有不錯的表現，但當資料筆數大幅增加時，訓練成本通常會顯著上升" },
      { id: "D", text: "SVM的核心概念是計算每筆新資料與訓練集中各筆資料的距離，依多數鄰居的類別決定分類結果" },
    ],
    answer: "C",
    explanation:
      "支援向量機（SVM）透過尋找能最大化類別間邊界（margin）的分隔超平面進行分類，在高維度、小樣本的情境下（如本題數百筆樣本、上千個特徵）常有不錯的表現，是這類資料常見的模型選擇之一；但當訓練資料筆數大幅增加時，SVM的訓練成本（尤其是核函數的計算）通常會顯著上升，不若在中大型資料集上如樹模型等方法來得有效率。依距離與多數鄰居類別決定分類結果的作法是KNN的核心概念，而非SVM。",
    choiceExplanations: {
      A: "SVM在特徵維度遠高於樣本數的情境下，反而是常見且表現不錯的應用場景之一，收斂與否主要取決於核函數與參數設定，並非特徵數量多就會難以收斂，也並非只適合特徵少於樣本數的資料集。",
      B: "SVM的訓練成本通常會隨資料筆數增加而顯著上升（尤其涉及核函數運算時），並非與資料集規模大小無關、訓練時間大致相同。",
      D: "依距離計算並由多數鄰居類別決定分類結果，描述的是KNN的核心概念，SVM的核心概念是尋找最大化類別間邊界的分隔超平面，並非依鄰居多數決分類。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["SVM", "高維小樣本", "核函數"],
      constraints: ["data_volume", "compute"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若樣本數成長到數百萬筆，核函數的運算成本會變得無法承受，該改用線性模型或梯度提升樹。",
    },
  },
  {
    id: "junior-ai-basics-practice-q073",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行欲依客戶的消費行為特徵，將客戶分成幾個消費族群以利差異化行銷，但事前並不知道客戶實際應分成幾群、也沒有任何客群標籤；資料科學家評估採用K-means分群演算法。下列說明何者最正確？",
    choices: [
      { id: "A", text: "K-means在執行前不需要決定分群的群數K，演算法會在訓練過程中自動決定最合適的群數" },
      { id: "B", text: "K-means的分群結果幾乎不受初始中心點位置的影響，不論初始設定為何，多次執行後最終收斂到的分群結果通常都會一致" },
      { id: "C", text: "K-means是一種監督式學習演算法，必須先取得每位客戶正確的族群標籤才能進行訓練" },
      { id: "D", text: "K-means需要事先指定群數K，演算法透過反覆計算樣本與各群中心的距離、更新群中心，將樣本分派到最近的群" },
    ],
    answer: "D",
    explanation:
      "K-means是一種非監督式分群演算法，執行前須先指定群數K，接著隨機初始化K個群中心，反覆計算各樣本與群中心的距離，將樣本分派到最近的群，再依分派結果更新群中心，直到收斂；此銀行客群分析情境下並無事前標籤，K-means正適合這類非監督式分群需求。K-means並不會在訓練過程中自動決定最合適的群數（通常需另外以手肘法等方式評估），分群結果也會受初始中心點位置影響（可能收斂到不同的局部解），因此並非不受影響、結果一致。",
    choiceExplanations: {
      A: "K-means在執行前須由使用者事先指定群數K，演算法本身並不會在訓練過程中自動決定最合適的群數。",
      B: "K-means的分群結果實際上會受初始中心點位置影響，不同的初始設定可能收斂到不同的局部解，並非結果通常一致、幾乎不受影響。",
      C: "K-means是一種非監督式學習演算法，執行時不需要客戶的族群標籤，這與此情境事前沒有任何客群標籤的狀況正好相符。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["K-means", "群數K", "非監督式"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若群的形狀不是球狀而是細長或環狀，K-means 的距離假設就失效，該改用 DBSCAN 這類密度式分群。",
    },
  },
  {
    id: "junior-ai-basics-practice-q074",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠設備監控系統蒐集了上百個感測器的量測特徵，資料科學家欲先透過主成分分析（PCA）將特徵維度降低，再輸入異常偵測模型；團隊成員對PCA的原理有些誤解。下列說明何者最正確？",
    choices: [
      { id: "A", text: "PCA挑選出的主成分，通常就是原始感測器特徵中的某幾個，其餘沒被選中的感測器特徵則會直接捨棄不用" },
      { id: "B", text: "PCA降維後得到的主成分，仍然保有與原始各感測器特徵相同的物理意義與量測單位" },
      { id: "C", text: "PCA的目的是將特徵分成幾個類別群組，類似分群演算法，而非產生新的連續型特徵" },
      { id: "D", text: "PCA將原始特徵轉換為彼此不相關的主成分，依序挑選能保留最多資料變異的方向作為新特徵" },
    ],
    answer: "D",
    explanation:
      "主成分分析（PCA）透過線性轉換，將原始的多項特徵組合成彼此不相關（正交）的「主成分」，並依能保留的資料變異量大小排序，選取前幾個能保留最多變異的主成分作為新的低維度特徵；這些主成分是原始特徵的線性組合，並非直接從原始感測器特徵中挑選出的某幾個，也不再保有與原始感測器相同的物理意義或量測單位。PCA屬於降維技術，產生的是連續型的新特徵，與將樣本分成類別群組的分群演算法性質不同。",
    choiceExplanations: {
      A: "PCA的主成分是原始特徵經線性組合後產生的新變數，並非直接從原始感測器特徵中挑選出的某幾個、捨棄其餘特徵。",
      B: "PCA產生的主成分是原始特徵的線性組合，通常已不再對應單一感測器原本的物理意義或量測單位，並非與原始特徵保有相同的意義。",
      C: "PCA是產生新的連續型特徵（主成分）以降低維度，目的與將樣本分成類別群組的分群演算法不同，並不是一種分群方法。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["PCA", "降維", "主成分"],
      constraints: ["explainability"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若後續必須向稽核說明「是哪一顆感測器異常」，主成分已失去物理意義，該改用特徵篩選而不是降維。",
    },
  },
  {
    id: "junior-ai-basics-practice-q075",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司欲訓練模型辨識空拍影像中的作物病害區域，資料科學家評估採用卷積神經網路（CNN），並向團隊說明CNN處理影像資料的特性。下列說明何者最正確？",
    choices: [
      { id: "A", text: "CNN處理影像時，是把每個像素視為互不相關的獨立特徵，分別輸入到全連接層進行運算" },
      { id: "B", text: "CNN不具備捕捉影像局部區域特徵（如邊緣、紋理）的能力，這項工作仍須仰賴人工設計特徵" },
      { id: "C", text: "CNN透過卷積層擷取影像局部區域的特徵（如邊緣、紋理），並透過參數共享降低整體參數量" },
      { id: "D", text: "CNN的卷積層在訓練過程中專門辨識影像中的顏色資訊，並不會擷取邊緣、紋理等其他視覺特徵" },
    ],
    answer: "C",
    explanation:
      "卷積神經網路（CNN）透過卷積層以濾波器（卷積核）在影像上滑動，擷取局部區域的特徵（如邊緣、紋理、形狀等），同一個濾波器在整張影像上重複使用（參數共享），相較於全連接層能大幅降低模型參數量，適合處理空拍影像這類具有空間局部關聯性的資料。CNN並非把每個像素視為互不相關的獨立特徵輸入全連接層，而是善於捕捉局部區域特徵，不需要仰賴人工設計特徵，且擷取的特徵範圍不限於顏色資訊，也涵蓋邊緣、紋理等其他視覺特徵。",
    choiceExplanations: {
      A: "CNN的卷積層正是利用影像中像素彼此的空間關聯性，以濾波器擷取局部區域的特徵，而非把每個像素視為互不相關的獨立特徵分別處理。",
      B: "CNN的卷積層正是為了自動擷取影像局部區域的特徵（如邊緣、紋理）而設計，不需要仰賴人工另外設計特徵。",
      D: "CNN的卷積層可以擷取邊緣、紋理、形狀等多種視覺特徵，並不限於顏色資訊。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["CNN", "卷積層", "參數共享"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若輸入改成欄位之間沒有空間鄰近關係的表格資料，卷積的局部性假設就不成立，CNN 的優勢也隨之消失。",
    },
  },
  {
    id: "junior-ai-basics-practice-q076",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行欲以客戶過去24個月的月消費金額序列，預測其下個月的消費金額；資料科學家比較循環神經網路（RNN）與長短期記憶網路（LSTM）處理這類序列資料的特性。下列說明何者最正確？",
    choices: [
      { id: "A", text: "RNN與LSTM處理序列資料的方式與資料的先後順序無關，即使把月份順序打亂輸入模型，預測結果通常也不會受到影響" },
      { id: "B", text: "LSTM的設計目的是加快模型的訓練速度，與是否能記住較長期的序列資訊並無直接關聯" },
      { id: "C", text: "RNN在處理較長序列時容易出現長期依賴難以保留的問題，LSTM透過閘門機制改善此問題、較能保留長期資訊" },
      { id: "D", text: "RNN與LSTM在設計上限定輸入長度為一個月，無法直接處理24個月這種較長的歷史序列" },
    ],
    answer: "C",
    explanation:
      "循環神經網路（RNN）在處理序列資料時，將前一時間點的隱藏狀態傳遞到下一時間點，但在處理較長序列時，較早期的資訊容易在多次傳遞過程中逐漸消失或失真，難以保留長期依賴關係；長短期記憶網路（LSTM）則透過輸入閘、遺忘閘、輸出閘等閘門機制，選擇性保留或捨棄資訊，較能保留長期依賴的序列資訊，因此在處理客戶24個月消費序列這類較長期序列時，LSTM通常優於傳統RNN。序列資料的先後順序正是RNN與LSTM設計上刻意納入考量的關鍵資訊，打亂順序通常會影響預測結果，兩者也並非只能接受固定長度為一個月的輸入。",
    choiceExplanations: {
      A: "RNN與LSTM的設計核心正是要捕捉序列資料中的先後順序關係，打亂月份順序會破壞原本的時間脈絡，通常會影響模型的預測結果。",
      B: "LSTM的閘門機制主要目的是改善長期依賴資訊難以保留的問題，而非用來加快模型訓練速度，兩者的設計初衷並不相同。",
      D: "RNN與LSTM設計上皆能處理長度不固定的序列資料，可以接收24個月這類較長的歷史序列作為輸入，並非只能接受固定長度為一個月的輸入。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["RNN", "LSTM", "長期依賴"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若序列很短（例如只看前三個月），長期依賴問題不明顯，LSTM 的額外參數就換不到相應的效益。",
    },
  },
  {
    id: "junior-ai-basics-practice-q077",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠欲偵測設備感測數值中的異常狀態，但實際發生故障的樣本數量極少、大多數蒐集到的都是正常運作時的數值；資料科學家評估以自編碼器（Autoencoder）進行異常偵測，先只用正常運作的資料訓練模型學習「重建」輸入，再依重建誤差大小判斷是否異常。下列說明何者最正確？",
    choices: [
      { id: "A", text: "自編碼器訓練時必須同時使用大量正常樣本與大量異常樣本，才能學會分辨兩者的差異" },
      { id: "B", text: "自編碼器以正常資料訓練後，面對異常資料時通常較難準確重建，重建誤差偏大的樣本便可能被判定為異常" },
      { id: "C", text: "自編碼器的重建誤差大小與資料是否異常沒有關聯，判斷異常與否須另外仰賴人工設定的規則" },
      { id: "D", text: "自編碼器的架構設計目的是擴增可用的訓練樣本數量，這與模型學習資料的壓縮及重建能力兩者並沒有關聯" },
    ],
    answer: "B",
    explanation:
      "自編碼器（Autoencoder）由編碼器與解碼器組成，訓練目標是讓輸出盡量重建原始輸入；若僅以正常運作的資料訓練，模型會學到正常資料的典型模式與壓縮表示，當輸入異常資料時，由於偏離了模型學到的正常模式，通常較難被準確重建，重建誤差會相對偏大，因此可以依重建誤差大小作為判斷是否異常的依據，適合此工廠故障樣本稀少的情境。自編碼器的訓練通常不需要大量異常樣本（這正是其優勢，可只用正常資料訓練），其架構目的是學習資料的壓縮與重建能力，而非單純擴增樣本數量，重建誤差與是否異常也有直接關聯，並非須另外仰賴人工規則判斷。",
    choiceExplanations: {
      A: "自編碼器可以只用正常運作的資料訓練即可用於異常偵測，不需要同時蒐集大量異常樣本，這正是它適合故障樣本稀少情境的優勢。",
      C: "自編碼器的重建誤差大小正是判斷資料是否異常的核心依據，異常資料通常因偏離學到的正常模式而重建誤差偏大，並非須另外仰賴人工設定的規則。",
      D: "自編碼器的架構設計目的是學習資料的壓縮表示與重建能力，而非用來擴增訓練樣本數量，兩者是不同的技術目的。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["自編碼器", "重建誤差", "異常偵測"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      crossNode: "L11301",
      decisionBoundary:
        "若訓練用的「正常資料」裡混進了未被察覺的異常，模型會把異常也學成正常，重建誤差就不再分得開兩者。",
    },
  },
  {
    id: "junior-ai-basics-practice-q078",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司同時蒐集了「土壤氮含量（數值範圍0至50）」與「日照時數（數值範圍0至4000）」兩項量綱差異極大的特徵，欲訓練決策樹模型預測作物產量；資料科學家考慮是否需要先對這兩項特徵進行正規化或標準化。下列說明何者最正確？",
    choices: [
      { id: "A", text: "決策樹模型與線性迴歸、KNN等模型相同，若不先將特徵縮放到相近尺度，模型的預測效果會明顯變差" },
      { id: "B", text: "決策樹依單一特徵的門檻值逐層切分資料，判斷依據是數值大小的相對順序，通常不需要先縮放特徵尺度" },
      { id: "C", text: "是否需要先縮放特徵尺度，只與資料筆數多寡有關，與模型種類是決策樹或其他模型並無關聯" },
      { id: "D", text: "決策樹模型要求所有輸入特徵的數值範圍都必須彼此一致，否則模型在訓練前就會直接拒絕接受這些特徵作為輸入資料" },
    ],
    answer: "B",
    explanation:
      "決策樹在每一層切分時，是依單一特徵的門檻值（如「日照時數是否大於2000」）將資料分成兩群，判斷依據是該特徵數值的相對大小順序，而非數值的絕對範圍或與其他特徵的相對量級；因此決策樹（以及以決策樹為基礎的隨機森林等模型）通常不需要像線性迴歸、KNN、SVM等對數值範圍敏感的模型那樣，先將特徵正規化或標準化到相近尺度。是否需要縮放特徵，取決於模型種類本身的運作原理，而非資料筆數多寡；決策樹也不會因為特徵數值範圍不同就拒絕接受這些特徵作為輸入。",
    choiceExplanations: {
      A: "決策樹的切分依據是單一特徵數值的相對大小順序，並不像線性迴歸、KNN等模型那樣容易受特徵尺度差異影響，通常不需要事先縮放特徵尺度也能維持預測效果。",
      C: "是否需要先縮放特徵尺度，主要取決於模型本身如何使用特徵數值（如是否比較不同特徵的絕對量級），而非資料筆數多寡。",
      D: "決策樹在切分時只需比較單一特徵在不同門檻值下的表現，並不要求所有輸入特徵的數值範圍彼此一致，也不會因為特徵尺度不同就拒絕接受作為輸入。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["決策樹", "特徵縮放", "門檻切分"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      crossNode: "L11202",
      decisionBoundary:
        "若模型改成 KNN 或含正則化的線性迴歸，縮放就變成必要步驟——需不需要縮放取決於模型怎麼使用數值。",
    },
  },
  {
    id: "junior-ai-basics-practice-q131",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的信用評分需同時滿足：向監理機關逐案說明拒貸理由、在 100 毫秒內回應、且特徵中有多個高度相關的財務比率。下列選型何者最合理？",
    choices: [
      { id: "A", text: "深層神經網路，準確率最高" },
      { id: "B", text: "大型語言模型，可直接生成拒貸說明" },
      { id: "C", text: "多模型堆疊集成，兼顧各家之長" },
      { id: "D", text: "邏輯迴歸或淺層決策樹，並先處理共線性以穩定係數解釋" },
    ],
    answer: "D",
    explanation:
      "三項限制同時指向本質可解釋的簡單模型：邏輯迴歸的係數與決策樹的路徑本身就是理由、推論極快。而共線性會讓係數不穩甚至符號反轉，解釋因此失真，所以要先處理它——否則「可解釋」只是形式上的。",
    choiceExplanations: {
      A: "深層網路的判斷分散在大量權重中，逐案說明只能靠事後近似，難以通過監理審查。",
      B: "生成的說明流暢但未必是模型真正的判斷依據，反而有製造合理化說詞的風險。",
      C: "堆疊會讓決策路徑更難追溯，可解釋性通常比單一模型更差。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["可解釋模型", "共線性", "延遲"],
      constraints: ["explainability", "latency", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L11102",
      decisionBoundary:
        "若監理只要求說明「整體使用了哪些因子與方向」而非逐案理由，複雜模型搭配事後解釋工具也可能過關。",
    },
  },
  {
    id: "junior-ai-basics-practice-q132",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院用 K-means 把病患依就醫行為分群，結果總是切出大小相近的球形群，但臨床上明顯存在一小群「極高頻就診」的特殊病患被併入了大群。下列處置何者最合理？",
    choices: [
      { id: "A", text: "K-means 的距離假設偏好大小相近的球形群，應改用密度式分群並允許標示雜訊點" },
      { id: "B", text: "增加 K 值直到那群被切出來" },
      { id: "C", text: "把極高頻病患視為離群值刪除" },
      { id: "D", text: "改用監督式分類" },
    ],
    answer: "A",
    explanation:
      "問題不在 K 值而在演算法的假設：K-means 依到中心的距離分配，天生偏好大小密度相近的球形群，小而密的特殊群容易被鄰近的大群吸收。密度式分群直接以密度定義群集，能把這種小群單獨切出來。",
    choiceExplanations: {
      B: "增加 K 會把大群切碎，那一小群仍可能繼續被併入某個碎片。",
      C: "這群病患正是臨床上最需要辨識的對象，刪除等於丟掉分析目的。",
      D: "題幹並沒有既定的分類標籤可用，監督式分類的前提不成立。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["K-means假設", "密度式分群", "小群集"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若各群的密度差異也很大，單一組鄰域參數同樣無法適配，此時要改用可處理多層密度的變形演算法。",
    },
  },
  {
    id: "junior-ai-basics-practice-q133",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠要以感測特徵預測設備剩餘壽命（連續數值），且要求能說明哪些特徵最有影響。下列選型何者最合適？",
    choices: [
      { id: "A", text: "K-means 分群" },
      { id: "B", text: "邏輯迴歸，因為它可解釋" },
      { id: "C", text: "迴歸型的樹系集成，並輔以特徵重要度分析" },
      { id: "D", text: "影像分類模型" },
    ],
    answer: "C",
    explanation:
      "目標是連續數值，屬於迴歸；樹系集成在表格式感測資料上表現通常最好，且能輸出特徵重要度滿足「哪些特徵最有影響」的需求。",
    choiceExplanations: {
      A: "分群把樣本分組，不做數值預測。",
      B: "邏輯迴歸輸出的是機率、用於分類，無法直接預測剩餘壽命這個連續值。",
      D: "輸入是感測數值而非影像，模型類型不對應。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["迴歸", "樹系集成", "特徵重要度"],
      constraints: ["explainability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若需求改成「這台設備本週會不會故障」，目標就從連續值變成二元分類，評估指標也從誤差換成召回與精確率。",
    },
  },
  {
    id: "junior-ai-basics-practice-q134",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業團隊的作物影像分類模型，訓練樣本僅數百張。下列做法何者最能在小樣本下取得堪用的表現？",
    choices: [
      { id: "A", text: "從零開始訓練一個大型網路" },
      { id: "B", text: "以預訓練的卷積網路做遷移學習，並搭配資料增強擴充樣本多樣性" },
      { id: "C", text: "改用 K 最近鄰直接比對原始像素" },
      { id: "D", text: "把影像轉成表格後用線性迴歸" },
    ],
    answer: "B",
    explanation:
      "數百張影像不足以從零學到邊緣與紋理這類通用特徵。遷移學習把大型資料集上學到的特徵萃取能力搬過來，只需微調最後幾層；資料增強再以旋轉翻轉等變化擴大有效樣本量。",
    choiceExplanations: {
      A: "從零訓練大型網路需要數萬張以上的樣本，在此必然嚴重過擬合。",
      C: "直接比對原始像素對光線、角度極度敏感，且高維下距離失去鑑別力。",
      D: "線性迴歸預測連續值且無法捕捉影像的空間結構，任務類型也不對。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["遷移學習", "資料增強", "小樣本"],
      constraints: ["labeled_data_scarcity"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若目標影像的特性與預訓練資料差距極大（例如多光譜或熱影像），預訓練特徵的助益會大幅下降，此時得考慮自建較小的專用架構。",
    },
  },
  {
    id: "junior-ai-basics-practice-q135",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台要在「模型 A：準確率 88%、可逐步追蹤判斷路徑」與「模型 B：準確率 91%、判斷過程不透明」之間選擇，而該模型的輸出會影響學生是否被列入輔導名單。下列判斷何者最合理？",
    choices: [
      { id: "A", text: "選 B，準確率較高" },
      { id: "B", text: "兩者並用，取平均" },
      { id: "C", text: "選 A，因為此決策影響學生權益，可說明性帶來的信任與可救濟性，勝過三個百分點的準確率" },
      { id: "D", text: "依訓練時間長短決定" },
    ],
    answer: "C",
    explanation:
      "影響個人權益的決策，「為什麼是我」必須答得出來，否則家長與學生無從檢驗也無從申訴。三個百分點的準確率換不到這件事，而缺少說明的代價會在爭議發生時一次付清。",
    choiceExplanations: {
      A: "準確率高但無法說明，在涉及權益的場景可能根本無法上線。",
      B: "兩模型取平均會讓判斷路徑同樣變得不可追溯，失去 A 的唯一優勢。",
      D: "訓練時間是開發成本，與該不該採用的判準無關。",
    },
    topic: "L11302 常見的機器學習模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["可解釋性", "權益影響", "模型取捨"],
      constraints: ["explainability", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "L11102",
      decisionBoundary:
        "若模型只用於推薦補充教材、不影響任何權益，這三個百分點就值得拿，取捨會倒向 B。",
    },
  },
  // ── L11401 鑑別式 AI 與生成式 AI 的基本原理（11 題）────────────────
  {
    id: "junior-ai-basics-practice-q079",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院導入一套AI輔助判讀系統，僅需輸入乳房超音波影像，系統便直接輸出「良性」或「惡性」的分類結果，並未產生任何新的影像內容；放射科醫師想理解這套系統背後鑑別式模型（Discriminative Model）的核心運作原理。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "鑑別式模型的運作原理是先學會影像資料的整體分布，再依分布反推分類結果" },
      { id: "B", text: "鑑別式模型直接學習輸入特徵到類別標籤的條件機率，聚焦分辨輸入屬於何種類別" },
      { id: "C", text: "鑑別式模型的訓練目標包含產生與訓練影像相似的全新影像，作為輔助判斷的參考素材" },
      { id: "D", text: "鑑別式模型判斷類別時，須先計算每個類別各自對應的影像資料聯合分布，再取其中比例最高者" },
    ],
    answer: "B",
    explanation:
      "鑑別式模型（Discriminative Model）直接學習從輸入特徵到類別標籤的條件機率P(y|x)，或直接找出區分不同類別的決策邊界，目的是分辨輸入屬於哪一類，而不是先學會資料的整體分布再產生新樣本或計算聯合分布。此判讀系統只需輸出良性/惡性分類結果、不產生新影像，正是這種直接學決策邊界的鑑別式模型。",
    choiceExplanations: {
      A: "先學資料整體分布再反推分類，是生成式模型建立聯合分布後可用於分類的間接做法，鑑別式模型的做法是直接學習輸入到標籤的條件機率或決策邊界，不需要先學整體分布。",
      C: "鑑別式模型的訓練目標是分辨類別，並不包含產生與訓練影像相似的全新影像，這種生成新樣本的能力屬於生成式模型的特徵。",
      D: "逐類別計算聯合分布再比較機率，是生成式方法（如以貝氏定理反推類別）常見的做法，鑑別式模型通常不需要先建立每個類別各自的聯合分布。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["鑑別式模型", "條件機率", "決策邊界"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若同一份影像改用「先建立各類別分布、再以貝氏定理反推」的方式分類，它就成了生成式做法——輸出相同，內部學的東西不同。",
    },
  },
  {
    id: "junior-ai-basics-practice-q080",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫學影像研究團隊訓練了一個生成式模型，讓它學習大量皮膚病灶影像的特徵分布；訓練完成後，只要給定隨機雜訊或簡單條件，這個模型就能產生從未出現在訓練集中的全新病灶影像。研究員想向團隊說明這種能力反映的是生成式模型的哪一項核心原理？",
    choices: [
      { id: "A", text: "生成式模型之所以能產生新影像，是因為它把每一張訓練影像都儲存下來，再依需要直接複製貼上其中片段" },
      { id: "B", text: "生成式模型學習訓練資料背後的機率分布，因而能依此分布產生統計特性相似、但內容全新的樣本" },
      { id: "C", text: "生成式模型產生新影像的能力，來自於它先對每張輸入影像做良性或惡性的分類，再依分類結果組合出新影像" },
      { id: "D", text: "生成式模型產生新影像的作法，是仰賴人類醫師事先繪製一整套病灶形狀範本，模型再依範本套用局部變化" },
    ],
    answer: "B",
    explanation:
      "生成式模型（Generative Model）的核心原理是學習訓練資料背後的機率分布，一旦掌握了這個分布，就能依此產生統計特性相似、但實際內容全新、未曾出現在訓練集中的樣本，而不是複製既有影像片段、依賴人類手繪範本，或先做分類再組合影像。這個皮膚病灶影像生成模型正是依此原理運作。",
    choiceExplanations: {
      A: "生成式模型並非把每張訓練影像儲存下來再拼貼片段，而是學習資料背後的機率分布，據此產生內容全新的樣本，訓練完成後模型本身通常不會保留可供複製貼上的原始影像。",
      C: "生成式模型產生新影像的原理是依學到的資料分布取樣，並不需要先對輸入影像做良性或惡性分類，分類是鑑別式模型的任務，兩者運作原理不同。",
      D: "生成式模型能透過學習大量影像的資料分布自行歸納出病灶的形狀特徵，不需要仰賴人類醫師事先繪製形狀範本。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["生成式模型", "機率分布", "取樣"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若產出的影像與某張訓練影像幾乎逐像素相同，那不是學到分布而是記憶了樣本，屬於過擬合甚至隱私風險。",
    },
  },
  {
    id: "junior-ai-basics-practice-q081",
    subjectId: "junior-ai-basics",
    prompt:
      "某線上教育平台同時提供兩項AI功能：功能一是判斷學生繳交的申論題答案屬於「正確」或「錯誤」；功能二是依課綱主題自動撰寫一份全新的申論題題目與參考答案。教學設計師想確認這兩項功能各自屬於判別任務還是生成任務。下列歸類何者正確？",
    choices: [
      { id: "A", text: "功能一與功能二都屬於判別任務，兩者的差別只是判斷對象換成了答案或題目而已" },
      { id: "B", text: "功能一與功能二都屬於生成任務，這是因為兩者運作前都需要AI先理解題目文字內容" },
      { id: "C", text: "功能一屬於判別任務，功能二屬於生成任務，兩者因輸出性質不同而分屬不同類型" },
      { id: "D", text: "功能一其實屬於生成任務，因為判斷對錯的過程中模型會生成一段評語文字；功能二則屬於判別任務" },
    ],
    answer: "C",
    explanation:
      "判別任務指模型從既有的類別或選項中做出分類判斷，輸出是已知選項之一（如正確/錯誤）；生成任務則指模型產出訓練集中未曾出現過的全新內容（如一段新的題目文字）。功能一只需輸出「正確」或「錯誤」的分類結果，屬於判別任務；功能二則需要撰寫全新的題目與參考答案內容，屬於生成任務，兩者依輸出性質分屬不同類型，並非同一類任務，也不是判別／生成角色對調。",
    choiceExplanations: {
      A: "功能二的輸出是全新撰寫的題目與參考答案內容，並非從既有選項中挑選分類結果，屬於生成任務而非判別任務，兩者性質不同。",
      B: "功能一的輸出僅是「正確」或「錯誤」這類既有分類結果，並不涉及產生訓練集中未曾出現過的新內容，屬於判別任務而非生成任務。",
      D: "功能一在題目描述中僅輸出正確／錯誤的分類結果，並未提及生成評語文字，仍屬於判別任務；功能二才是產出全新內容的生成任務。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["判別任務", "生成任務", "輸出性質"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若功能一改成「指出答案錯在哪並寫一段評語」，它就同時含生成任務——判準看的是輸出有沒有新內容，不是輸入是什麼。",
    },
  },
  {
    id: "junior-ai-basics-practice-q082",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠導入GAN（生成對抗網路）來合成瑕疵樣本影像，藉此補足實際故障案例稀少的問題。系統中的生成器（Generator）持續嘗試產生逼真的瑕疵影像，判別器（Discriminator）則負責判斷輸入影像是真實瑕疵照片還是生成器合成的假影像；訓練過程中兩者反覆較量。工程師想確認這種設計的運作原理，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "生成器與判別器透過對抗訓練，生成器學著產出更難被判別器分辨真偽的影像，判別器也提升辨識能力" },
      { id: "B", text: "判別器的任務其實是產生新的瑕疵影像供生成器學習模仿，生成器則負責判斷影像的真偽是否合格" },
      { id: "C", text: "生成器與判別器各自獨立訓練、彼此沒有互動，最終效果只是兩個模型單獨訓練結果的加總而已" },
      { id: "D", text: "判別器與生成器的訓練通常會在判別器準確率達到高點後自動停止，兩者不需要持續交替更新參數" },
    ],
    answer: "A",
    explanation:
      "GAN由生成器與判別器組成，兩者採取對抗式訓練：生成器嘗試產出足以騙過判別器的合成影像，判別器則嘗試分辨真實影像與生成器產出的合成影像，訓練過程中兩者反覆較量、互相促進——生成器產出的影像越來越逼真，判別器辨識真偽的能力也隨之提升。這與生成器和判別器角色對調、兩者各自獨立訓練互不影響，或訓練會在某個時點自動停止的說法都不同。",
    choiceExplanations: {
      B: "生成器負責產生新的合成影像，判別器負責判斷影像真偽，此選項把兩者的任務對調了，與GAN實際的角色分工相反。",
      C: "生成器與判別器在訓練過程中持續互相較量、彼此的表現會影響對方的更新方向，並非各自獨立訓練、互不影響。",
      D: "GAN的訓練是生成器與判別器持續交替更新參數的過程，並不會因判別器準確率達到某個高點就自動停止，需要人為設定訓練回合數或收斂條件。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["GAN", "生成器", "判別器", "對抗訓練"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若判別器強到生成器永遠騙不過，梯度會消失、生成器停止進步——對抗訓練要求兩者能力相當，不是其中一方越強越好。",
    },
  },
  {
    id: "junior-ai-basics-practice-q083",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫學影像團隊使用VAE（變分自編碼器）處理病灶影像：先由編碼器將影像壓縮為潛在空間中的一組向量，再由解碼器依這組向量重建影像；團隊也嘗試在潛在空間中取樣新的向量、交給解碼器產生從未見過的病灶影像。下列說明何者最正確？",
    choices: [
      { id: "A", text: "編碼器負責將影像壓縮為潛在空間表示，解碼器依此重建或生成影像，讓VAE兼具壓縮與生成能力" },
      { id: "B", text: "解碼器的功能是將影像壓縮為潛在空間表示，編碼器則負責將潛在表示還原為影像" },
      { id: "C", text: "VAE的潛在空間中每個向量位置固定對應一張特定的訓練影像，因此無法產生訓練集中未曾出現過的新影像" },
      { id: "D", text: "VAE的編碼器與解碼器承擔相同的壓縮功能，兩者的差別只是採用的類神經網路層數不同而已" },
    ],
    answer: "A",
    explanation:
      "VAE（變分自編碼器）由編碼器與解碼器組成：編碼器負責將輸入影像壓縮為潛在空間中的向量表示，解碼器則依這組潛在向量重建原始影像，或在潛在空間中取樣新的向量後產生從未出現過的新影像。這讓VAE同時具備資料壓縮與生成新樣本兩種能力，而非編碼器與解碼器角色對調、潛在空間向量與訓練影像一對一固定對應，或兩者功能相同只是層數不同。",
    choiceExplanations: {
      B: "編碼器負責將影像壓縮為潛在空間表示，解碼器負責依潛在表示重建或生成影像，此選項把兩者的功能對調了，與VAE實際的分工相反。",
      C: "VAE的潛在空間是連續空間，取樣潛在空間中新的向量位置即可解碼出相似但不同的影像，並非每個位置都固定對應單一訓練影像，因此仍能產生訓練集中未曾出現過的新影像。",
      D: "編碼器負責壓縮影像為潛在向量，解碼器負責依潛在向量重建或生成影像，兩者功能不同，並非都只做壓縮、僅層數有別。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["VAE", "編碼器", "解碼器", "潛在空間"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若潛在空間不連續、取樣點解碼後只是雜訊，VAE 就只剩壓縮能力而失去生成能力——生成能力來自潛在空間的連續性。",
    },
  },
  {
    id: "junior-ai-basics-practice-q084",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠研發團隊測試擴散模型（Diffusion Model）合成瑕疵樣本影像：訓練時先讓乾淨影像逐步加入雜訊直到成為純雜訊，接著訓練模型學習如何逐步去除雜訊；生成新影像時，則從一張純雜訊影像開始，讓模型反覆執行去噪步驟，逐漸產生清晰的瑕疵影像。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "擴散模型生成新影像時，是一次性地將雜訊影像轉換為最終清晰影像，不需要經過多個去噪步驟" },
      { id: "B", text: "擴散模型訓練時只需要少量瑕疵影像即可完成訓練，且不需要進行加入雜訊的前置處理步驟" },
      { id: "C", text: "擴散模型的生成過程是從雜訊出發，透過反覆多個步驟逐步去除雜訊，最終產生清晰影像" },
      { id: "D", text: "擴散模型的加入雜訊步驟屬於資料視覺化用途，與模型實際學習去噪能力的訓練過程沒有關聯" },
    ],
    answer: "C",
    explanation:
      "擴散模型（Diffusion Model）的生成過程是從一張純雜訊影像出發，透過反覆多個去噪步驟，逐步將雜訊去除、產生逐漸清晰的影像，而非一次性直接轉換完成。訓練階段則需要先讓乾淨影像逐步加入雜訊，讓模型學習每一步該如何去除多少雜訊，這個加入雜訊的過程正是訓練的核心一環，並非只是用於效能評估或可視化的附加用途。",
    choiceExplanations: {
      A: "擴散模型生成新影像的特色正是反覆多步驟的漸進去噪過程，而非一次性直接把雜訊影像轉換為最終清晰影像。",
      B: "擴散模型的訓練需要先對乾淨影像逐步加入雜訊、再學習如何逐步去除，這是訓練過程中不可省略的前置步驟，並非可以略過，通常仍需要足量樣本以學習去噪規律。",
      D: "加入雜訊的步驟是讓模型學會在各個雜訊程度下該如何去噪的訓練依據，屬於訓練過程的核心一環，而非只用於資料視覺化、與訓練學習能力無關。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["擴散模型", "去噪", "逐步生成"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若把去噪步數從上千步壓到十步以內，生成速度大增但細節品質通常下降——步數是品質與速度的直接取捨。",
    },
  },
  {
    id: "junior-ai-basics-practice-q085",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育科技公司評估採用以Transformer架構為基礎的模型來處理課文分析與作文批改，工程師想向團隊解釋Transformer核心的自注意力（Self-Attention）機制在處理一段文字時的運作特性。下列說明何者最正確？",
    choices: [
      { id: "A", text: "自注意力機制主要依序逐字比對相鄰兩個詞彙的關係，較難同時考量整段文字中距離較遠的詞彙之間的關聯" },
      { id: "B", text: "自注意力機制的設計目的限定在生成式模型中使用，並不適合用於鑑別式的分類或批改任務" },
      { id: "C", text: "自注意力機制在處理文字時，會先將整段文字轉換成一張影像後再進行卷積運算，取得詞彙間的關聯" },
      { id: "D", text: "自注意力機制能讓模型同時衡量每個詞彙與段落中其他詞彙的關聯程度，掌握全域語意脈絡" },
    ],
    answer: "D",
    explanation:
      "Transformer架構的核心是自注意力（Self-Attention）機制，它讓模型在處理一段文字中的每個詞彙時，能同時衡量該詞彙與同一段落中其他所有詞彙之間的關聯程度（不侷限於相鄰詞彙），藉此掌握全域的語意脈絡；這個機制既是生成式模型（如文字生成）的骨幹，也常用於鑑別式的分類或批改任務中，並非限定用於生成式模型，也不涉及先把文字轉成影像做卷積運算。",
    choiceExplanations: {
      A: "自注意力機制的特色正是能同時衡量整段文字中所有詞彙彼此的關聯，不侷限於逐字比對相鄰詞彙，因此能掌握距離較遠詞彙之間的關聯。",
      B: "自注意力機制是文字類生成式模型與鑑別式模型（如分類、批改任務）共同採用的骨幹架構，並非限定用在生成式模型中。",
      C: "自注意力機制直接對詞彙之間的關聯程度做加權計算，並不需要先把文字轉換成影像再進行卷積運算，那是卷積神經網路處理影像的方式。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Transformer", "自注意力", "全域語意"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若序列長到數萬個 token，自注意力隨長度平方成長的運算量會成為瓶頸，此時要改用稀疏或線性注意力的變形。",
    },
  },
  {
    id: "junior-ai-basics-practice-q086",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠以GAN合成瑕疵影像數月後，工程師發現生成器產出的瑕疵影像雖然逼真，但翻閱大量產出後發現樣式高度雷同，實際上反覆呈現兩三種固定的瑕疵型態，未能涵蓋原始資料中多樣的瑕疵類型。資深工程師判斷這是GAN訓練中常見的一種現象，下列說明何者最正確？",
    choices: [
      { id: "A", text: "這種現象代表判別器已經喪失分辨真偽的能力，生成器輸出的影像因而擺脫了判別器原本的限制" },
      { id: "B", text: "這種現象是資料前處理階段忘記將影像做正規化所導致，與生成器判別器的對抗訓練機制無關" },
      { id: "C", text: "這種現象代表生成器已經確實學會資料的真實分布，訓練已經可以視為成功結束" },
      { id: "D", text: "這種現象稱為模式崩潰，指生成器主要產生資料分布中少數幾種樣式，未涵蓋整體多樣性" },
    ],
    answer: "D",
    explanation:
      "模式崩潰（Mode Collapse）是GAN訓練中常見的問題，指生成器為了持續騙過判別器，收斂到主要產生資料分布中的少數幾種樣式，而未能涵蓋原始資料分布應有的多樣性——這正符合工廠案例中瑕疵影像逼真卻高度雷同、只呈現兩三種固定型態的現象。這與判別器喪失分辨能力、資料正規化疏漏，或代表生成器已成功學會完整分布等說法都不同。",
    choiceExplanations: {
      A: "模式崩潰通常源於生成器收斂到少數幾種容易騙過判別器的樣式，判別器仍持續運作、並未喪失分辨能力，只是生成器產出的多樣性不足。",
      B: "模式崩潰的成因與生成器和判別器之間的對抗訓練動態有關（如生成器找到局部捷徑），並非單純資料正規化步驟疏漏所致。",
      C: "樣式高度雷同、缺乏多樣性正是生成器未能完整學會資料真實分布的徵兆，不能視為訓練成功的結果。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["模式崩潰", "GAN", "多樣性"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若生成影像多樣但細節模糊、判別器輕易分辨真偽，那是生成器能力不足而非模式崩潰——兩者的徵狀正好相反。",
    },
  },
  {
    id: "junior-ai-basics-practice-q087",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台用單純貝氏（Naive Bayes）分類器判斷學生作文的情感傾向（正面／負面／中立），演算法在訓練時分別估計「正面作文常出現的詞彙分布」「負面作文常出現的詞彙分布」等各類別的特徵分布，再依貝氏定理反推一篇新作文最可能屬於哪個類別。工程師想確認單純貝氏屬於鑑別式模型還是生成式模型，下列說明何者最正確？",
    choices: [
      { id: "A", text: "單純貝氏屬於鑑別式模型，因為它最終輸出的是明確分類標籤，並非產生新的文字內容" },
      { id: "B", text: "單純貝氏屬於生成式模型，因為它先對各類別建立特徵機率分布，再依貝氏定理反推類別" },
      { id: "C", text: "單純貝氏無法歸類為鑑別式或生成式模型的其中一種，因為它同時具備兩種模型的做法特徵" },
      { id: "D", text: "單純貝氏與邏輯迴歸的運作原理基本一致，兩者都是直接學習輸入到類別標籤的條件機率邊界" },
    ],
    answer: "B",
    explanation:
      "單純貝氏（Naive Bayes）屬於生成式模型：它針對每個類別分別建立特徵的機率分布（如各類別作文常出現的詞彙分布），再依貝氏定理反推一筆新資料最可能屬於哪個類別，這種「先建立各類別的資料分布、再反推類別」的做法正是生成式模型的典型特徵，即使它最終輸出的是分類標籤，也不影響其生成式模型的歸類；這與鑑別式模型直接學習類別邊界的做法不同，單純貝氏和邏輯迴歸的原理也並不相同。",
    choiceExplanations: {
      A: "判斷是鑑別式或生成式模型的依據，是模型內部如何學習（是否先建立各類別的特徵分布），而不是最終輸出是否為明確的分類標籤；單純貝氏雖輸出分類標籤，但學習過程是生成式的做法。",
      C: "單純貝氏的學習方式明確符合生成式模型「先建立各類別特徵分布、再反推類別」的做法，可歸類為生成式模型，並非無法歸類或混合了兩種做法。",
      D: "邏輯迴歸是直接學習輸入到類別標籤的條件機率邊界，屬於鑑別式模型的做法；單純貝氏則是先建立各類別的特徵分布再反推類別，兩者的運作原理並不相同。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["單純貝氏", "生成式模型", "貝氏定理"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若換成直接學習決策邊界的邏輯迴歸，即使輸出的類別完全相同，它也屬於鑑別式——歸類看的是內部怎麼學，不是輸出長什麼樣。",
    },
  },
  {
    id: "junior-ai-basics-practice-q088",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台的AI助教在對話過程中，會依照使用者目前輸入的問題與先前的對話內容，一個字一個字地產生回覆文字；工程師想向教學團隊說明這套大型語言模型（LLM）在生成回覆時的核心運作機制。下列說明何者最正確？",
    choices: [
      { id: "A", text: "LLM依上下文逐一預測下一個最可能的token，再併入上下文繼續預測，如此反覆生成完整回覆" },
      { id: "B", text: "LLM在生成回覆前，會先把整段回覆的完整文字一次性計算完成，再逐字顯示出來營造打字效果" },
      { id: "C", text: "LLM生成回覆文字的順序，是先產生句子的最後一個字，再依序往前補齊前面的字詞" },
      { id: "D", text: "LLM生成回覆時主要依據當前最後輸入的單一問題，先前的對話內容通常不會納入預測下一個字的考量" },
    ],
    answer: "A",
    explanation:
      "大型語言模型（LLM）生成文字的核心機制是自回歸生成：依據目前累積的上下文（包含先前對話與已生成的內容），逐一預測下一個最可能出現的token，並把新產生的token併入上下文，再繼續預測下一步，如此反覆直到生成完整回覆。這與先一次算完整段文字再逐字顯示、由句尾往句首倒著生成，或不參考先前對話內容等說法都不同。",
    choiceExplanations: {
      B: "LLM是逐一預測下一個token再據以產生下一步，並非先把整段文字一次性算完再逐字顯示，兩者的實際生成順序不同。",
      C: "LLM生成文字的順序是由前往後逐步產生下一個token，並非先產生句尾再倒著往前補齊。",
      D: "LLM預測下一個token時，是把先前的對話內容與目前累積的上下文一併納入考量，並非只依據當前最後輸入的單一問題。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["LLM", "自回歸生成", "token"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若對話長度超出模型的上下文視窗，較早的內容會被截掉、不再影響預測——「納入先前對話」是有上限的。",
    },
  },
  {
    id: "junior-ai-basics-practice-q089",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院導入生成式AI協助撰寫衛教文案初稿，品管人員原本比照鑑別式診斷模型的做法，想用「準確率」這個單一指標來驗收衛教文案的品質，卻發現難以套用。資訊部門主管說明兩者評估方式的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "生成式模型的輸出品質同樣可以用準確率這項單一指標衡量，只是計算公式與鑑別式模型不同，套用時不需調整" },
      { id: "B", text: "生成式模型的輸出不需要額外的品質驗收流程，模型訓練完成後，產出內容即可直接對外發布給民眾閱讀" },
      { id: "C", text: "鑑別式任務有正確答案可比對計算準確率，生成式任務沒有單一標準答案，通常需人工評分或搭配其他品質指標" },
      { id: "D", text: "準確率其實是專門用來衡量生成式模型的指標，鑑別式模型的品質評估則普遍使用人工評分方式" },
    ],
    answer: "C",
    explanation:
      "鑑別式任務（如良性／惡性分類）通常有明確、唯一的正確答案，可以直接比對預測結果與答案計算準確率；生成式任務（如撰寫衛教文案）的輸出型態多元，同一個提示可能有多種都算合理的寫法，沒有單一標準答案可供比對，因此通常需要仰賴人工評分，或搭配其他品質指標（如內容是否正確、是否符合醫療用語規範）來評估，而不是直接套用準確率這個單一指標，也不是完全不需要品質驗收，更不是準確率與人工評分的適用對象剛好相反。",
    choiceExplanations: {
      A: "生成式任務的輸出沒有單一標準答案可供比對，準確率這項指標的計算前提（明確對錯）並不成立，因此無法直接套用同一套準確率公式來完整衡量生成式輸出的品質。",
      B: "生成式AI產出的文案內容仍可能包含錯誤或不適當的用語，尤其衛教文案涉及醫療資訊正確性，仍需要人工複核或品質指標驗收後才適合對外發布，並非訓練完成就可以直接發布。",
      D: "準確率適用於有明確正確答案的鑑別式任務，人工評分則較常用於評估生成式任務這類沒有單一標準答案的輸出，此選項把兩者的適用對象說反了。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["準確率", "生成式評估", "人工評分"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若把生成任務限縮成「從三個既有範本中挑一個」，它就退回成判別任務，準確率又可以用了。",
    },
  },
  {
    id: "junior-ai-basics-practice-q136",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫學團隊發現生成模型產出的病灶影像中，有一張與訓練集裡某位病患的影像幾乎逐像素相同。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這代表模型學得很好，能精確重現真實病灶" },
      { id: "B", text: "這是記憶而非學到分布，同時構成過擬合與隱私風險，應以去重與輸出檢測處理" },
      { id: "C", text: "這是幻覺，模型捏造了不存在的內容" },
      { id: "D", text: "這是模式崩潰，生成器只會產生少數樣式" },
    ],
    answer: "B",
    explanation:
      "生成模型該學的是資料背後的分布，產出統計特性相似但內容全新的樣本。逐像素重現某一張訓練影像，代表它把那個樣本背了下來——這既是過擬合，也可能直接洩漏該病患的可識別影像。",
    choiceExplanations: {
      A: "逐字逐像素重現是缺陷而非能力，它意味著模型沒有真正一般化。",
      C: "幻覺是產出「不存在但看似合理」的內容，這裡的內容是真實存在於訓練集的。",
      D: "模式崩潰的徵狀是輸出樣式高度雷同而缺乏多樣性，與重現特定樣本不同。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["訓練資料記憶", "過擬合", "隱私風險"],
      constraints: ["privacy", "quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "L11203",
      decisionBoundary:
        "若重現的只是該類病灶的典型樣態、與任何單一張訓練影像都不相同，那就是正常的一般化而非記憶。",
    },
  },
  {
    id: "junior-ai-basics-practice-q137",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠以 GAN 合成瑕疵影像，訓練數週後判別器準確率穩定在 99%、生成器產出的影像明顯粗糙且幾乎沒有進步。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這是模式崩潰，生成器收斂到少數樣式" },
      { id: "B", text: "判別器過強使生成器得不到有效的梯度訊號，應調整兩者的訓練步調或降低判別器能力" },
      { id: "C", text: "訓練已成功，判別器準確率高代表模型品質好" },
      { id: "D", text: "應大幅提高生成器的學習率直到判別器失效" },
    ],
    answer: "B",
    explanation:
      "對抗訓練要求兩者能力相當。判別器強到幾乎全對時，生成器無論怎麼改都被識破，回傳的梯度趨近於零，於是停在原地。處置是讓兩者重新旗鼓相當，而不是單方面加大某一邊。",
    choiceExplanations: {
      A: "模式崩潰的徵狀是輸出逼真但樣式雷同，此處是輸出粗糙且不進步，兩者相反。",
      C: "判別器準確率高代表它輕易分辨真偽，正說明生成器沒有學好。",
      D: "大幅提高學習率會讓訓練更不穩定，且沒有解決兩者能力失衡的根本。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["GAN", "梯度消失", "訓練平衡"],
      constraints: ["quality", "compute"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若生成影像逼真卻反覆只有兩三種樣式，診斷就翻轉成模式崩潰，處方也從「平衡兩者」變成「增加多樣性懲罰」。",
    },
  },
  {
    id: "junior-ai-basics-practice-q138",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的智能客服要在「判斷客戶意圖屬於哪一類」與「撰寫回覆文字」兩件事之間選用模型。下列配置何者最合理？",
    choices: [
      { id: "A", text: "意圖判斷用鑑別式模型、回覆撰寫用生成式模型，兩者分工" },
      { id: "B", text: "兩者都用鑑別式模型" },
      { id: "C", text: "兩者都用生成式模型，讓意圖也由模型生成文字描述" },
      { id: "D", text: "兩者都不需要模型，用關鍵字比對即可" },
    ],
    answer: "A",
    explanation:
      "意圖判斷的輸出是既有類別之一，屬判別任務，用鑑別式模型又快又可稽核；回覆撰寫要產出訓練集中沒有的新文字，屬生成任務。兩者的輸出型態不同，分工是最自然的配置。",
    choiceExplanations: {
      B: "鑑別式模型只能從既有選項中挑選，無法產出流暢的新回覆文字。",
      C: "讓意圖也用生成方式輸出，會失去固定類別帶來的可稽核性與低延遲。",
      D: "關鍵字比對無法處理口語與同義表述的多樣性，也寫不出回覆。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["判別任務", "生成任務", "分工"],
      constraints: ["latency", "governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若意圖類別多達數百種且會頻繁新增，維護分類器的成本上升，改用生成式模型直接輸出意圖標籤反而較有彈性。",
    },
  },
  {
    id: "junior-ai-basics-practice-q139",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台想評估生成式出題助手的品質，品管人員沿用鑑別式模型的「準確率」卻無法計算。下列調整何者最合理？",
    choices: [
      { id: "A", text: "放棄評估，直接上線" },
      { id: "B", text: "改以輸出字數作為品質指標" },
      { id: "C", text: "改以生成速度作為品質指標" },
      { id: "D", text: "改以學科教師抽樣逐題查核正確性，並另設格式合規與難度分布等可自動檢查的指標" },
    ],
    answer: "D",
    explanation:
      "生成任務沒有單一標準答案，準確率的計算前提不成立。品質要拆開處理：內容正確性只能靠具學科知識的人抽查，格式與難度分布這類有明確規則的部分則可自動檢查。",
    choiceExplanations: {
      A: "出題內容會直接影響學生，不評估就上線的風險過高。",
      B: "字數只反映篇幅，長不代表題目正確或合用。",
      C: "生成速度衡量效率，與題目品質是不同面向。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["生成式評估", "人工查核", "自動指標"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若把任務限縮成「從既有題庫挑三題」，它就退回成判別任務，準確率又可以用了。",
    },
  },
  {
    id: "junior-ai-basics-practice-q140",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業團隊比較兩種生成模型：一種從純雜訊出發、經多步去噪產生影像；另一種以編碼器壓縮到潛在空間再由解碼器還原。關於兩者，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者運作原理相同，只是名稱不同" },
      { id: "B", text: "前者為變分自編碼器、後者為擴散模型" },
      { id: "C", text: "前者為擴散模型、後者為變分自編碼器；前者多步去噪品質通常較細緻但推論較慢" },
      { id: "D", text: "兩者都需要判別器參與對抗訓練" },
    ],
    answer: "C",
    explanation:
      "多步去噪是擴散模型的標誌，編碼—潛在空間—解碼則是變分自編碼器的結構。擴散模型以較多的推論步數換取細節品質，代價是生成速度較慢。",
    choiceExplanations: {
      A: "生成路徑完全不同：一個逐步去噪、一個經由潛在向量還原。",
      B: "兩者的描述被對調了。",
      D: "對抗訓練是生成對抗網路的機制，這兩者都不需要判別器。",
    },
    topic: "L11401 鑑別式 AI 與生成式 AI 的基本原理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["擴散模型", "變分自編碼器", "生成路徑"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若把擴散模型的去噪步數壓到十步以內，速度大增但細節品質下降，兩者在品質與速度上的差距就會縮小。",
    },
  },

  // ── L11402 鑑別式 AI 與生成式 AI 的整合應用（11 題）────────────────
  {
    id: "junior-ai-basics-practice-q090",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院想訓練一套鑑別式AI模型，自動判讀某種罕見皮膚病灶影像是否為惡性；但院內收集到的真實罕見病例影像數量極少，直接訓練容易表現不佳。研究團隊考慮先用生成式模型合成大量近似的病灶影像，補進訓練集後再訓練鑑別式判讀模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "用生成式模型合成影像補足資料後，鑑別式模型即可直接上線使用，不需要再進行驗證或測試" },
      { id: "B", text: "合成影像數量足夠多時，訓練集中可以捨棄大部分真實罕見病例影像，不影響模型判讀能力" },
      { id: "C", text: "用生成式模型合成影像補足稀缺樣本是常見整合做法，但合成資料品質仍需留意、避免偏離真實分布" },
      { id: "D", text: "生成式模型合成的影像品質不受原始資料分布影響，可以直接取代真實影像作為訓練依據" },
    ],
    answer: "C",
    explanation:
      "當真實的稀缺樣本（如罕見病灶影像）數量不足，可以用生成式模型合成近似的樣本補進訓練集，讓鑑別式模型有更多資料可學習、獲得更完整的特徵分布，這是資料稀缺情境下常見的生成式與鑑別式整合應用；但合成資料終究是模型推估出來的近似分布，品質可能與真實分布有落差，仍應保留足量真實樣本並留意合成資料的品質與代表性，而不是可以捨棄真實影像、略過驗證測試，或誤以為合成影像足以取代真實影像。",
    choiceExplanations: {
      A: "合成資料補進訓練集只是資料準備階段的一環，鑑別式模型訓練完成後仍需要經過驗證與測試才能確認表現是否可靠，並非補足資料後就能直接跳過驗證上線。",
      B: "合成影像是依生成式模型學到的近似分布產生，仍可能與真實資料分布有落差，捨棄大部分真實罕見病例影像會讓模型失去校準依據，並非數量夠多就能取代真實樣本。",
      D: "合成影像的品質正是取決於生成式模型從原始資料分布學到的近似程度，並非不受原始資料分布影響，通常也無法直接取代真實影像作為訓練依據，訓練集仍應保留真實病例影像。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["合成資料", "稀缺樣本", "資料分布"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      crossNode: "L11301",
      decisionBoundary:
        "若合成影像在訓練集中的佔比過高，模型會學到生成器的偏好而不是真實病灶特徵——真實樣本必須留下來當錨點。",
    },
  },
  {
    id: "junior-ai-basics-practice-q091",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行資安團隊想強化反詐欺偵測模型，但實際詐欺交易案例數量遠少於正常交易，難以涵蓋各種詐欺手法。團隊考慮用生成式模型模擬各種可能的詐欺交易樣態（如異常轉帳模式、可疑收款帳戶組合），產生大量模擬樣本，再用這些樣本訓練鑑別式的反詐欺偵測模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "這種做法只適用於資安攻擊模擬情境，金融交易詐欺偵測領域無法採用這種生成式模擬強化整合方式" },
      { id: "B", text: "用生成式模型模擬多樣的詐欺樣態，可補足真實案例稀少的限制，協助鑑別式模型學到更廣泛特徵" },
      { id: "C", text: "生成式模型模擬的詐欺樣態需要與過去發生過的真實案例逐筆相符，否則便無助於鑑別式模型的訓練" },
      { id: "D", text: "這種做法會讓鑑別式偵測模型的判斷交由生成式模型決定，鑑別式模型不需要自行學習分辨真偽的能力" },
    ],
    answer: "B",
    explanation:
      "真實的詐欺交易案例通常數量稀少，且手法不斷翻新，難以涵蓋各種可能樣態；用生成式模型模擬多樣的詐欺交易情境（如異常轉帳模式、可疑收款組合），可以補足這項限制，讓鑑別式偵測模型接觸到更廣泛的詐欺特徵、提升偵測能力，這種整合方式並不限於資安攻擊模擬，金融詐欺偵測同樣適用；模擬樣態也不需要與真實案例逐筆相符，鑑別式模型仍須自行從這些樣本中學習分辨真偽的能力，並非把判斷權交給生成式模型。",
    choiceExplanations: {
      A: "生成式模擬樣態補足鑑別式訓練資料的整合做法，同樣適用於金融交易詐欺偵測領域，此題情境本身就是一個實際案例，並非只限於資安攻擊模擬。",
      C: "生成式模擬的價值正在於能產生涵蓋更廣泛手法、甚至真實案例中尚未出現過的樣態，藉此擴大鑑別式模型的學習範圍，並不需要與過去真實案例逐筆相符才有幫助。",
      D: "鑑別式偵測模型仍須用這些模擬樣本自行訓練、學習分辨真偽的判斷依據，生成式模型只負責產生訓練用的樣本，並不會取代鑑別式模型本身的判斷能力。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["生成式模擬", "反詐欺", "樣本稀少"],
      constraints: ["data_quality", "security"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若模擬樣態全部照著已知手法產生、沒涵蓋新型態，它補的只是數量而不是廣度，對偵測新手法沒有幫助。",
    },
  },
  {
    id: "junior-ai-basics-practice-q092",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠導入無人搬運車（AGV）負責廠內物料運送，工程團隊想強化其避障鑑別模型的可靠度，但實際廠區中罕見發生的突發狀況（如貨物突然掉落、人員臨時穿越）樣本極少。團隊使用生成式模型模擬各種罕見的廠區情境影像與感測資料，再用這些模擬情境測試與訓練AGV的避障鑑別模型。下列說明何者最正確？",
    choices: [
      { id: "A", text: "生成式模擬情境的用途限定在測試已經訓練完成的避障模型，不能用來產生額外的訓練資料" },
      { id: "B", text: "AGV的避障鑑別模型通過生成式模擬情境的測試後，便不需要再於實際廠區環境中驗證" },
      { id: "C", text: "生成式模型模擬罕見廠區情境，可補足真實案例稀少的限制，供避障模型訓練與測試，但仍需搭配實地驗證" },
      { id: "D", text: "生成式模擬情境的畫面與感測資料若在視覺上與真實廠區相似，避障鑑別模型的表現便會大幅提升" },
    ],
    answer: "C",
    explanation:
      "廠區中罕見發生的突發狀況（如貨物掉落、人員臨時穿越）樣本稀少，難以單靠真實案例涵蓋各種可能情境；用生成式模型模擬這類罕見情境的影像與感測資料，可以補足這項限制，讓避障鑑別模型在更多樣的模擬情境下訓練與測試，但模擬情境終究是近似真實世界的推估，仍需搭配實際廠區環境的驗證，才能確認模型在真實條件下同樣可靠——這種整合方式不只用於事後測試，也可用於補充訓練資料；模擬測試通過也不能取代實地驗證；模擬情境是否有幫助，關鍵在於能否涵蓋足夠多樣的突發狀況，而非畫面在視覺上是否相似。",
    choiceExplanations: {
      A: "生成式模擬情境同樣可以作為訓練資料的一部分，讓避障鑑別模型在更多樣的情境下學習，用途並不限定於測試已訓練完成的模型。",
      B: "模擬情境是對真實世界的近似推估，仍可能與實際廠區的物理條件、感測器雜訊等細節有落差，通過模擬測試後仍需要在實際廠區環境中進一步驗證，而非可以省略。",
      D: "模擬情境是否有助於提升避障模型的表現，關鍵在於是否涵蓋足夠多樣的突發狀況與感測資料特性，而非單純視覺上與真實廠區相似即可帶來大幅提升。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["模擬情境", "避障", "實地驗證"],
      constraints: ["safety", "data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模擬與實地驗證出現明顯落差，該修的是模擬的物理與感測雜訊模型，而不是把模擬情境的數量再調高。",
    },
  },
  {
    id: "junior-ai-basics-practice-q093",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行導入AI客服系統：生成式模型先依客戶提問撰寫回覆草稿，接著由另一個鑑別式模型檢查草稿是否包含不當用語、違規的投資建議或洩漏客戶個資等問題，通過檢查後才會發送給客戶；若被判定有疑慮，則轉由真人客服人員處理。下列說明何者最正確？",
    choices: [
      { id: "A", text: "這種設計違反了生成式與鑑別式模型不能在同一套系統中共同使用的限制，銀行應改採單一模型" },
      { id: "B", text: "鑑別式模型在這套系統中的角色是負責撰寫客服回覆草稿，生成式模型則負責檢查草稿是否有疑慮" },
      { id: "C", text: "生成式模型的訓練資料品質若夠好，草稿內容便不會出現不當用語或違規建議，不需另設鑑別式模型把關" },
      { id: "D", text: "這套系統是生成式與鑑別式模型分工整合的設計：生成式產出草稿內容，鑑別式審核是否符合規範" },
    ],
    answer: "D",
    explanation:
      "此系統是生成式與鑑別式模型整合應用的典型設計：生成式模型負責依客戶提問產出回覆草稿，鑑別式模型則負責審核草稿是否包含不當用語、違規投資建議或個資疑慮，兩者各司其職、分工互補，通過審核才發送給客戶，未通過則轉真人處理。這與角色對調、兩種模型不能共存於同一系統，或誤以為訓練資料品質夠好就能省略審核機制等說法都不同。",
    choiceExplanations: {
      A: "生成式模型與鑑別式模型可以在同一套系統中分工合作，此系統正是兩者搭配互補的常見整合設計，並非有互斥使用的限制。",
      B: "生成式模型負責撰寫回覆草稿，鑑別式模型負責審核草稿是否有疑慮，此選項把兩者的角色對調了，與系統實際的分工相反。",
      C: "即使訓練資料品質良好，生成式模型仍可能因提示內容、上下文理解偏差等因素產出不當或不精確的回覆，保留鑑別式模型的審核把關仍有其必要性，並非可以省略。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Architecture",
      concepts: ["生成式", "鑑別式", "分工整合"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若鑑別式審核模型本身誤判率偏高，把關就會變成瓶頸——整合設計必須連審核模型的準確度一起評估。",
    },
  },
  {
    id: "junior-ai-basics-practice-q094",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院導入一套多模態AI系統：系統同時讀取病患的X光影像與病歷文字紀錄，整合兩種型態的資訊後，產生一份包含影像判讀重點與病史摘要的診斷報告草稿。放射科主任想理解這套系統的整合方式，下列說明何者最正確？",
    choices: [
      { id: "A", text: "多模態AI系統能同時處理影像與文字等不同型態的資料，並將各模態的資訊整合起來，共同支援診斷報告的產生" },
      { id: "B", text: "多模態AI系統其實限定處理單一種資料型態，之所以稱為多模態，是因為系統會呼叫多套彼此獨立、互不整合的子系統" },
      { id: "C", text: "這套系統的X光影像判讀與病歷文字摘要，是先各自獨立產生報告後，再由人工於事後拼接成同一份文件，AI系統本身不涉及整合" },
      { id: "D", text: "多模態AI系統處理不同型態資料時，通常會先把所有資料型態都轉換成文字後才能進行後續運算" },
    ],
    answer: "A",
    explanation:
      "多模態AI系統的特色是能同時處理與整合文字、影像、音訊等不同型態的資料，此系統同時讀取X光影像與病歷文字，並將兩者的資訊整合起來共同產生診斷報告草稿，正是多模態整合的典型應用；這與系統只能處理單一資料型態、影像與文字報告各自獨立產生後才由人工拼接，或必須先把所有資料都轉成文字才能運算等說法都不同。",
    choiceExplanations: {
      B: "此系統同時讀取並整合影像與文字兩種資料型態，正是能處理多種資料型態的多模態系統，並非限定只能處理單一型態、靠多套互不整合的子系統拼湊而成。",
      C: "題目描述系統本身即整合兩種型態的資訊、共同產生診斷報告草稿，整合是AI系統運算過程的一部分，並非影像判讀與文字摘要各自獨立產生後才由人工事後拼接。",
      D: "多模態模型通常是在共享的向量表示空間中直接處理與整合不同型態的資料，不一定需要先把所有資料都轉換成文字這個單一格式才能運算。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["多模態", "模態整合"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若系統只是分別跑兩個模型、再把兩份輸出並排呈現而彼此不影響，它就不是多模態整合，只是兩套單模態系統。",
    },
  },
  {
    id: "junior-ai-basics-practice-q095",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠將GAN生成式模組與鑑別式瑕疵判別模組整合為同一套訓練管線，工程師發現訓練過程中損失數值大幅震盪，有時生成器突然大幅壓過判別器、有時反過來，難以收斂到穩定狀態，須反覆調整學習率與訓練步驟比例才能改善。下列說明何者最能反映這種現象背後的整合挑戰？",
    choices: [
      { id: "A", text: "這種訓練震盪現象與生成式和鑑別式模組是否整合在同一訓練管線無關，單獨訓練生成式模型同樣會出現相同震盪" },
      { id: "B", text: "這是整合訓練時常見的訓練穩定性挑戰：兩個模組的更新步調需謹慎搭配，否則一方容易壓過另一方" },
      { id: "C", text: "把生成式模組整個移除、單獨訓練鑑別式模組，損失震盪的問題便會自動改善，且不影響瑕疵判別效能" },
      { id: "D", text: "訓練損失震盪代表這套整合管線的架構設計有嚴重錯誤，因此應該放棄GAN、改用其他生成技術" },
    ],
    answer: "B",
    explanation:
      "GAN將生成器與判別器整合在同一套訓練管線中，兩者依對抗方式互相更新；若其中一方的更新步調過快或過慢，容易出現一方大幅壓過另一方、損失數值震盪難以收斂的訓練穩定性問題，這是生成式與鑑別式模組整合訓練時常見的挑戰，通常需要透過調整學習率、訓練步驟比例等方式改善，而不是移除生成式模組、或斷定架構設計本身有錯誤而必須放棄GAN；這種震盪現象也與是否整合在同一管線中密切相關，並非與整合無關。",
    choiceExplanations: {
      A: "這種震盪現象正是源自生成器與判別器在同一訓練管線中互相對抗、更新步調難以搭配所致，與是否整合在同一管線密切相關，並非與整合無關的單獨現象。",
      C: "移除生成式模組雖然可能減少對抗訓練帶來的震盪，但也會失去用生成式模組補足瑕疵樣本的效益，未必能在不影響判別效能的前提下改善問題。",
      D: "訓練損失震盪是GAN類對抗式訓練中常見的現象，通常可透過調整學習率、訓練步驟比例等方式改善，不代表架構設計本身有嚴重錯誤、必須放棄GAN技術。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["對抗訓練", "訓練穩定性", "更新步調"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若震盪其實來自資料本身（例如每批次的瑕疵比例差異極大），調整學習率不會有幫助，該先固定批次的類別組成。",
    },
  },
  {
    id: "junior-ai-basics-practice-q096",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的歷史信用資料中，特定族群的核貸資料量原本就偏少且核貸結果分布不均；團隊用生成式模型依這批歷史資料合成更多樣本以擴充信用評分模型的訓練集。上線後才發現，鑑別式核貸模型對該族群的核貸建議比只用原始資料訓練時更為不利。下列說明何者最能解釋這個現象？",
    choices: [
      { id: "A", text: "生成式模型依既有歷史資料的分布合成新樣本，若原始資料已存在偏差，合成樣本可能延續甚至放大該偏差" },
      { id: "B", text: "這種結果與原始歷史資料是否存在偏差沒有關聯，純屬合成樣本產生過程中的隨機誤差所致" },
      { id: "C", text: "生成式模型合成的樣本數量若夠多，便能自動修正原始歷史資料中原本存在的核貸分布不均問題" },
      { id: "D", text: "資料偏差問題是使用生成式模型擴充資料才會產生的新問題，直接使用原始歷史資料訓練不會有偏差" },
    ],
    answer: "A",
    explanation:
      "生成式模型是依既有歷史資料學到的分布來合成新樣本，若原始資料中某個族群的樣本本身數量偏少、核貸結果分布不均（即已存在偏差），生成式模型合成的樣本很可能延續甚至放大這種偏差，導致鑑別式核貸模型在這批擴充後的資料上學到更嚴重的偏誤，這正是整合應用中常見的資料偏差放大挑戰。這與純屬隨機誤差、合成樣本數量夠多就能自動修正偏差，或誤以為原始歷史資料本身沒有偏差問題等說法都不同。",
    choiceExplanations: {
      B: "生成式模型合成樣本的統計特性是依原始歷史資料的分布學來的，原始資料若存在偏差，合成樣本延續甚至放大該偏差是可預期的結果，並非與原始資料偏差程度無關的隨機巧合。",
      C: "生成式模型只依既有分布合成更多樣本，本身不具備判斷分布是否公平、進而主動修正偏差的機制，合成樣本數量增加反而可能讓既有偏差被放大而非自動修正。",
      D: "題目已說明原始歷史資料中該族群的核貸結果分布本就不均，代表偏差在使用生成式模型擴充資料前就已存在於原始資料中，並非只有擴充資料後才出現的新問題。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料偏差", "合成資料", "公平性"],
      constraints: ["fairness", "data_quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "L11102",
      decisionBoundary:
        "若在合成之前先對該族群重新取樣或加權，讓生成器學到的是平衡後的分布，放大偏差的路徑才會被切斷。",
    },
  },
  {
    id: "junior-ai-basics-practice-q097",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司想整合生成式模型（合成病害葉片影像補充稀有病害樣本）與鑑別式模型（判斷葉片病害類型）為同一套系統，但兩個模組是不同團隊各自開發、輸出入資料格式與更新頻率都不一致，導致合成影像無法順利銜接進鑑別式模型的訓練流程，專案因此延宕。下列說明何者最能反映此案例反映的整合挑戰？",
    choices: [
      { id: "A", text: "這個延宕問題與系統架構設計無關，純粹是因為選用的生成式演算法本身效能不足所致" },
      { id: "B", text: "這反映了整合時常見的架構設計挑戰：需事先規劃兩模組間的資料格式、介面與更新頻率如何銜接" },
      { id: "C", text: "兩個團隊分別把各自模組的效能調到最佳後，資料格式與介面不一致的問題便會自然消失" },
      { id: "D", text: "生成式與鑑別式模組屬於相同的技術架構，理論上不需要額外的介面銜接設計，延宕另有其他原因" },
    ],
    answer: "B",
    explanation:
      "生成式模組與鑑別式模組即使各自表現良好，若在整合前沒有事先規劃好資料格式、介面與更新頻率如何銜接，仍可能因為輸出入不相容而難以順利整合運作，這是整合應用中常見的架構設計挑戰，此農業案例正是兩個模組各自開發、格式與頻率不一致才導致延宕，並非單純演算法效能不足、兩個團隊各自優化效能就能自然解決，也不是因為兩者屬於相同架構而不需要介面銜接設計。",
    choiceExplanations: {
      A: "案例中提到的問題是資料格式與更新頻率不一致、無法順利銜接，屬於架構整合層面的規劃疏漏，並非單純生成式演算法本身的效能問題。",
      C: "資料格式與介面是否相容，取決於整合前是否有事先規劃好銜接方式，並不會因為兩個模組各自的效能調到最佳就自然一致，仍需要額外的架構設計工作。",
      D: "生成式模組與鑑別式模組的運作原理與輸出入型態通常不同，整合這兩類不同性質的模組，仍需要額外規劃資料格式與介面的銜接設計，並非不需要介面銜接。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["模組整合", "介面設計", "更新頻率"],
      constraints: ["maintainability"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若兩個模組本來就由同一團隊、同一套資料規格開發，這個挑戰不會出現——它是組織邊界造成的問題，不是技術限制。",
    },
  },
  {
    id: "junior-ai-basics-practice-q098",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院討論是否讓生成式AI直接依病歷內容產生「是否核准進行某項高風險手術」的結論，以加快作業流程；資訊治理委員會認為這個構想不妥，建議手術是否核准的判斷仍應交由鑑別式模型或醫師本人。下列說明何者最能支持委員會的立場？",
    choices: [
      { id: "A", text: "生成式模型缺乏分析病歷內容的能力，因此不適合參與這類醫療決策的討論過程" },
      { id: "B", text: "生成式模型的輸出著重流暢合理的內容，未必等同精確判斷；高風險決策較適合交由鑑別式模型或人類把關" },
      { id: "C", text: "讓生成式模型直接產生手術核准結論，可以取代醫師的專業判斷，因此委員會的疑慮並無根據" },
      { id: "D", text: "生成式模型與鑑別式模型的輸出結果向來高度一致，哪一種模型負責核准判斷結果通常不會有差異" },
    ],
    answer: "B",
    explanation:
      "生成式模型擅長產生流暢、合理的文字內容，但其輸出未必等同精確、可驗證的分類判斷；手術是否核准這類高風險決策，需要明確、可追溯的判斷依據，較適合交由鑑別式模型（依明確特徵做分類判斷）或人類專業人員把關，而不是直接讓生成式模型論斷結果。生成式模型並非完全不具備分析病歷的能力（它可以協助摘要或提供參考資訊），也不能因此取代醫師的專業判斷，生成式與鑑別式模型的輸出性質也不會向來一致。",
    choiceExplanations: {
      A: "生成式模型仍可協助分析與摘要病歷內容、提供參考資訊，並非完全不具備相關能力；委員會疑慮的重點是生成式輸出不適合直接作為高風險判斷的最終依據，而非它無法參與討論過程。",
      C: "生成式模型的輸出著重流暢合理的內容，未必具備精確可靠的判斷依據，讓它直接取代醫師對手術核准的專業判斷，反而可能忽略醫療決策所需的明確佐證，這正是委員會疑慮的根源。",
      D: "生成式模型與鑑別式模型的訓練目標與輸出性質不同（前者著重內容生成、後者著重分類判斷的準確性），兩者對同一問題的輸出結果不會向來一致，選擇哪種模型負責核准判斷會影響最終結果的可靠性。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["高風險決策", "生成式輸出", "人類把關"],
      constraints: ["safety", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      crossNode: "L11102",
      decisionBoundary:
        "若把生成式模型的角色限縮成「整理病歷摘要供醫師閱讀」，它就從決策者退回成輔助工具，疑慮也隨之消失。",
    },
  },
  {
    id: "junior-ai-basics-practice-q099",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業科技公司持續用生成式模型合成作物病害影像補充訓練資料，且每一代新模型都直接拿前一代模型合成的影像繼續訓練，較少補充新的真實影像；使用數個世代後，團隊發現生成的影像樣式逐漸變得單一、細節模糊，鑑別式病害判別模型的表現也隨之下降。下列說明何者最能解釋這個現象？",
    choices: [
      { id: "A", text: "這種品質下降現象與是否重複使用合成資料訓練無關，純粹是模型參數量不足所致" },
      { id: "B", text: "提高生成式模型的參數量後，即使持續只以合成影像訓練、不再補充真實影像，仍可避免品質下降" },
      { id: "C", text: "這種現象代表鑑別式模型的架構設計有誤，與生成式模型合成資料的方式無關" },
      { id: "D", text: "這是持續拿模型自己生成的資料反覆訓練下一代模型、少補充真實資料所致的品質衰退，多樣性逐代流失" },
    ],
    answer: "D",
    explanation:
      "當生成式模型的訓練資料主要來自前一代模型自己合成的影像、卻很少補充新的真實影像，經過多個世代之後，合成資料中原本存在的多樣性與細節容易逐代流失、樣式趨於單一，這種「用模型自己生成的資料反覆訓練下一代模型」所導致的品質衰退，是生成式與鑑別式模型整合應用中需要留意的風險，鑑別式模型若持續拿這類逐漸失真的合成影像訓練，表現自然也會受影響。這與參數量不足、鑑別式模型架構設計本身有誤等說法不同，單靠提高生成式模型的參數量也無法取代持續補充真實資料的必要性。",
    choiceExplanations: {
      A: "品質下降的原因是反覆拿合成資料訓練下一代模型、缺乏真實資料校正，而不是單純模型參數量不足；提高參數量無法解決資料來源本身逐代失真的問題。",
      B: "即使提高生成式模型的參數量，持續缺乏真實影像校正、反覆用自己生成的資料訓練下一代模型，多樣性與真實性仍會逐代流失，參數量並非解決此問題的關鍵。",
      C: "表現下降的根源在於訓練鑑別式模型所用的合成影像資料本身逐代失真、多樣性不足，而不是鑑別式模型的架構設計出了問題。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["合成資料反覆訓練", "多樣性衰退", "真實資料錨點"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若每一代都固定混入足量的新真實影像，多樣性就有錨點可回歸——關鍵在真實資料的比例，不在模型多大。",
    },
  },
  {
    id: "junior-ai-basics-practice-q100",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行的AI客服系統同時運行生成式模型（撰寫回覆內容）與鑑別式模型（判斷客戶提問的意圖分類，決定要不要轉真人客服）；上線後系統維運團隊發現尖峰時段整體回應延遲明顯變長，追查後確認主要瓶頸來自生成式模型逐字生成回覆所需的運算時間，遠高於鑑別式意圖分類模型的判斷時間。下列說明何者最能反映整合這兩類模型時應留意的系統設計考量？",
    choices: [
      { id: "A", text: "生成式模型逐步生成內容通常比鑑別式模型耗費更多運算資源與時間，整合設計需納入算力與延遲差異考量" },
      { id: "B", text: "生成式模型與鑑別式模型在運算資源與回應時間上的需求向來相同，延遲瓶頸應該另有原因，與模型種類無關" },
      { id: "C", text: "把鑑別式意圖分類模型也改成生成式模型後，系統整體的回應延遲便會自動縮短" },
      { id: "D", text: "系統回應延遲增加代表這套整合設計本身有嚴重瑕疵，銀行應該停用生成式模型，單獨保留鑑別式模型運作" },
    ],
    answer: "A",
    explanation:
      "生成式模型通常需要逐步（逐token）生成內容，運算所需的時間與資源通常高於鑑別式模型直接輸出分類結果所需的時間，這是整合這兩類模型時常見的系統設計考量：可以先用運算較快的鑑別式模型做初步篩選或分類，只在真正需要生成內容時才呼叫較耗資源的生成式模型，藉此降低整體延遲。這與誤以為兩者資源需求向來相同、把鑑別式模型也改成生成式模型反而能縮短延遲，或延遲問題必然代表整合設計本身有嚴重瑕疵、應停用生成式模型等說法都不同。",
    choiceExplanations: {
      B: "案例已追查確認延遲瓶頸來自生成式模型逐字生成回覆所需的運算時間，代表延遲確實與模型種類的運算特性有關，並非兩者資源需求向來相同、另有其他原因。",
      C: "生成式模型逐步生成內容通常比鑑別式模型的分類判斷更耗費運算資源與時間，把鑑別式模型也改成生成式模型，反而可能讓整體延遲更長，而不是自動縮短。",
      D: "延遲增加反映的是兩類模型運算特性本就不同、整合時需要妥善規劃呼叫順序與資源配置，透過設計（如先篩選再視需要才生成）即可改善，並不代表整合設計本身有嚴重瑕疵、必須停用生成式模型。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["推論延遲", "算力配置", "呼叫順序"],
      constraints: ["latency", "compute", "cost"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若把鑑別式意圖分類放到最前面、先篩掉可直接轉真人的提問，生成式模型的呼叫量下降，延遲問題會大幅緩解。",
    },
  },
  {
    id: "junior-ai-basics-practice-q141",
    subjectId: "junior-ai-basics",
    prompt:
      "某銀行以生成式模型合成詐欺樣本補足訓練資料，半年後發現偵測模型對「合成樣本相似的手法」表現極佳，但對新出現的真實手法反而比導入前更差。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "這是概念漂移，與合成資料無關" },
      { id: "B", text: "應再增加合成樣本數量以涵蓋更多手法" },
      { id: "C", text: "合成樣本佔比過高，模型學到的是生成器的偏好而非真實詐欺樣態，應降低合成比例並持續補入真實案例" },
      { id: "D", text: "應停用偵測模型，改為全人工審查" },
    ],
    answer: "C",
    explanation:
      "生成器只能依它學過的分布產樣本，合成得再多也不會憑空出現訓練資料裡沒有的新手法。當合成樣本在訓練集中佔比過高，模型的決策邊界會被生成器的偏好主導，對真實新手法自然更鈍。",
    choiceExplanations: {
      A: "手法翻新確實存在，但此處的關鍵是導入合成資料「之後反而變差」，指向合成比例而非單純漂移。",
      B: "增加數量只會讓生成器的偏好更被強化，對新手法的盲區更大。",
      D: "停用會失去自動偵測的效益，且問題出在資料配比而非模型不可用。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["合成資料佔比", "分布偏離", "真實樣本錨點"],
      constraints: ["data_quality", "security"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若合成樣本只用於補強某個已知且定義明確的手法、且以真實案例驗證過，這個風險就相對可控。",
    },
  },
  {
    id: "junior-ai-basics-practice-q142",
    subjectId: "junior-ai-basics",
    prompt:
      "某醫院的 AI 報告系統由生成式模型撰寫初稿、鑑別式模型審核是否含不當內容。上線後發現審核模型本身誤判率偏高，導致大量正常初稿被攔下轉人工。下列處置何者最合理？",
    choices: [
      { id: "A", text: "審核模型的門檻與品質是整合設計的一部分，應評估其誤報成本並校準門檻，必要時分級處理" },
      { id: "B", text: "直接取消審核模型，讓初稿全部通過" },
      { id: "C", text: "提高生成模型的輸出品質即可" },
      { id: "D", text: "把兩個模型合併成一個" },
    ],
    answer: "A",
    explanation:
      "把關模型自己就是一道會出錯的關卡。誤報太多會讓人工負擔暴增、最終被繞過，這時要回頭校準門檻——高風險內容維持嚴格、低風險內容放寬，而不是任由它一律從嚴。",
    choiceExplanations: {
      B: "取消把關會讓不當內容直接流出，在醫療場域風險過高。",
      C: "初稿品質再好，審核模型的誤判仍會把正常內容攔下，瓶頸不在生成端。",
      D: "合併成一個模型會讓「產出」與「把關」的職責混在一起，反而更難調校與稽核。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["整合設計", "把關模型", "誤報成本"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若被攔下的內容中確實有相當比例是真的不當，那就不是誤判過高而是生成端品質不足，該修的變成生成模型。",
    },
  },
  {
    id: "junior-ai-basics-practice-q143",
    subjectId: "junior-ai-basics",
    prompt:
      "某工廠的 AI 助理同時具備「回報當前產線稼動率」與「摘要本週異常趨勢」兩項功能。前者需即時查詢資料庫、後者需彙整文字。下列整合設計何者最合理？",
    choices: [
      { id: "A", text: "兩項都改由人工回報" },
      { id: "B", text: "兩項都由生成式模型依訓練知識直接回答" },
      { id: "C", text: "把整個資料庫的歷史紀錄貼入提示詞" },
      { id: "D", text: "稼動率以工具呼叫即時查詢資料庫取得，摘要由生成式模型依查得的資料撰寫" },
    ],
    answer: "D",
    explanation:
      "即時數值必須來自當下的資料庫，不能靠模型的訓練記憶；文字摘要則是生成模型的強項。讓模型呼叫工具取得真實數值、再據以撰寫摘要，兩者各司其職且數值永遠是最新的。",
    choiceExplanations: {
      A: "改為人工會失去即時性與自動化效益，也不是整合設計的問題所在。",
      B: "訓練知識停在過去某個時點，無法回答「現在」的稼動率。",
      C: "歷史紀錄量遠超過上下文長度，且貼進去的仍是靜態快照。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["工具呼叫", "即時資料", "生成摘要"],
      constraints: ["integration", "latency"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若稼動率每天只更新一次，把當日快照放進檢索索引就夠了，不必付出工具呼叫的複雜度。",
    },
  },
  {
    id: "junior-ai-basics-practice-q144",
    subjectId: "junior-ai-basics",
    prompt:
      "某教育平台整合生成式出題與鑑別式難度分類兩個模組，卻因兩隊各自定義題目格式而無法串接。下列處置何者最能從根本解決？",
    choices: [
      { id: "A", text: "以人工在中間手動轉檔" },
      { id: "B", text: "讓兩隊各自把模組效能調到最好" },
      { id: "C", text: "把兩個模組合併由同一隊重寫" },
      { id: "D", text: "事先協定兩模組之間的資料格式、欄位與錯誤處理方式，並以此為介面契約" },
    ],
    answer: "D",
    explanation:
      "問題出在兩模組之間沒有講清楚介面。把欄位、型別與錯誤語意寫成契約後，兩隊可以各自演進而不互相破壞；這比重寫或人工轉檔都更根本也更省。",
    choiceExplanations: {
      A: "人工轉檔是短期權宜，量一大就成為瓶頸，也無法自動化。",
      B: "各自效能再好，格式不相容仍然串不起來。",
      C: "合併重寫成本極高，且沒有契約的話，日後接第三個模組會再犯一次。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["介面契約", "模組整合", "錯誤處理"],
      constraints: ["integration", "maintainability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若兩模組本來就由同一團隊維護且可同步改版，契約可以較寬鬆；跨團隊時它就必須嚴格到連錯誤碼都寫明。",
    },
  },
  {
    id: "junior-ai-basics-practice-q145",
    subjectId: "junior-ai-basics",
    prompt:
      "某農業服務整合生成式與鑑別式模型後，尖峰時段的回應延遲明顯拉長，追查確認瓶頸在生成式模型逐字產出的時間。下列調整何者最直接有效？",
    choices: [
      { id: "A", text: "把鑑別式模型也改成生成式模型" },
      { id: "B", text: "把鑑別式分類放到最前面，先篩掉可用固定回覆處理的提問，降低生成式模型的呼叫量" },
      { id: "C", text: "延長模型的訓練時間" },
      { id: "D", text: "增加訓練資料量" },
    ],
    answer: "B",
    explanation:
      "瓶頸在生成式模型的呼叫量，最直接的做法就是讓它少被呼叫。用便宜的鑑別式分類先把常見且答案固定的提問分流掉，生成式模型只處理真正需要它的那些。",
    choiceExplanations: {
      A: "生成式的逐字產出比分類更慢，改過去會讓延遲更嚴重。",
      C: "訓練時間屬於離線階段，對線上延遲沒有幫助。",
      D: "資料量影響的是模型品質，與線上的併發承載無關。",
    },
    topic: "L11402 鑑別式 AI 與生成式 AI 的整合應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["延遲瓶頸", "前置分流", "呼叫順序"],
      constraints: ["latency", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若提問高度個人化、幾乎沒有可用固定回覆處理的部分，分流就攔不下多少流量，此時只剩水平擴展或改用更小的生成模型。",
    },
  },
];
