import type { Question } from "../types";

/**
 * AIoT 考科二的新題庫，依 2026 iPAS AIoT 題庫生成規格 v2.0 命題。
 *
 * 考科二偏重系統整合與故障排除，因此 L3／L4 的比重高於考科一。
 * 每題都標註認知層級、題型原型、干擾項類型與工程限制條件，並附
 * 「條件改變時答案如何變化」的 Decision Boundary；分布規範由
 * `tests/aiotQuestionBank.test.ts` 強制。
 *
 * ⚠️ 考科二**沒有官方學習指引也沒有公告真題**，題目依 115 年度簡章的評鑑內容
 * 大綱與一般工程知識命製，內容正確性需人工複審。
 */
export const practiceQuestions: Question[] = [
  // ── B1.1 系統元件與架構（17 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q001",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線的沖壓機需在偵測到異物時於 5 毫秒內停機。系統設計者提出四種架構，下列何者最能滿足此要求？",
    choices: [
      { id: "A", text: "由廠內邊緣伺服器接收訊號後回傳停機指令" },
      { id: "B", text: "由現場 PLC 直接讀取光柵訊號並輸出停機指令" },
      { id: "C", text: "由雲端服務判斷後透過閘道器下達停機指令" },
      { id: "D", text: "由監控人員看到告警後手動按下停止鈕" },
    ],
    answer: "B",
    explanation:
      "5 毫秒是控制迴路等級的要求，任何經過網路的往返都可能吃掉全部裕度。PLC 直接在現場完成感測到致動的閉迴路，掃描週期即為毫秒等級且具確定性，是唯一穩妥的選擇。",
    choiceExplanations: {
      A: "邊緣伺服器雖在廠內，但仍需經過網路堆疊與作業系統排程，抖動不可預期；它適合的是數十毫秒到秒級的判斷。",
      C: "雲端往返通常在數十毫秒以上，且網路一斷保護就失效，用在人身安全相關的停機上不可接受。",
      D: "人的反應時間以百毫秒計，比要求慢了兩個數量級，不能作為安全機制的主要手段。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["PLC", "邊緣運算", "即時控制", "閉迴路"],
      constraints: ["latency", "safety", "reliability"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若要求放寬為「30 秒內通知維修人員異常」，邊緣或雲端判斷都足夠，此時架構選型的重點會從延遲轉為維護成本與模型更新便利性。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q002",
    subjectId: "aiot-junior-iot",
    prompt:
      "在「感測器 → MCU → 閘道器 → Broker → 資料庫 → 應用」的鏈路中，若要新增一套 AI 分析系統取用相同資料，改動範圍最小的接入點是下列何者？",
    choices: [
      { id: "A", text: "直接接到感測器的類比輸出" },
      { id: "B", text: "在每個 MCU 上增加一條額外的上傳程式" },
      { id: "C", text: "向 Broker 訂閱既有主題" },
      { id: "D", text: "修改應用系統的程式碼以轉發資料" },
    ],
    answer: "C",
    explanation:
      "發布訂閱模型的價值正在於此：新增消費端只要訂閱既有主題，發布端完全不必知道它的存在，也不需要任何改動——這就是解耦帶來的可擴充性。",
    choiceExplanations: {
      A: "直接接類比輸出等於重做一次感測與數位化，成本高且會干擾既有量測。",
      B: "要動到每一台 MCU 的韌體，改動範圍最大，且日後每新增一個消費端都要再改一次。",
      D: "把應用系統改成轉發者會讓它承擔不屬於它的職責，形成難以維護的相依。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["發布訂閱", "解耦", "系統擴充"],
      constraints: ["maintainability", "scalability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若 AI 系統需要的是「過去三個月的歷史資料」而非即時訊息，接入點就應改為資料庫而非 Broker。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q003",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於 IT 與 OT 環境的差異，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "OT 系統可比照 IT 隨時套用最新修補程式" },
      { id: "B", text: "OT 對非計畫停機的容忍度通常低於 IT" },
      { id: "C", text: "IT 較重視資料機密性，OT 較重視產線可用性與人員安全" },
      { id: "D", text: "OT 設備的服役年限通常遠長於 IT 設備" },
    ],
    answer: "A",
    explanation:
      "OT 的更新必須先驗證不影響製程與人員安全，且多半要配合排定的停機窗口，因此節奏遠比 IT 保守。這正是工控環境常見大量未修補系統的結構性原因。",
    choiceExplanations: {
      B: "產線停機直接等於損失產值，容忍度確實更低，敘述正確。",
      C: "兩者的優先順序差異是 IT/OT 整合最常被提及的對比，敘述正確。",
      D: "產線設備動輒服役十年以上，遠長於三到五年即汰換的 IT 設備，敘述正確。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["IT", "OT", "修補管理"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 A 改成「OT 系統的修補須經製程驗證並配合停機窗口」，它就成為正確敘述——差別在於節奏而非要不要修補。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q004",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠要導入「工單進度追蹤與生產履歷記錄」，並希望與現場機台的即時狀態監控分開管理。這兩項需求分別對應下列哪一組系統？",
    choices: [
      { id: "A", text: "兩者都由 ERP 負責" },
      { id: "B", text: "MES 負責工單與履歷，SCADA 負責現場即時監控" },
      { id: "C", text: "SCADA 負責工單與履歷，MES 負責現場即時監控" },
      { id: "D", text: "兩者都由 HMI 負責" },
    ],
    answer: "B",
    explanation:
      "MES 管的是「工單如何被執行」——派工、在製品追蹤與履歷；SCADA 管的是「設備現在怎麼樣」——秒級的監控與監督式控制。兩者的時間尺度與關注對象都不同。",
    choiceExplanations: {
      A: "ERP 處理的是企業層級的訂單、物料與財務規劃，時間尺度以天或月計，不追蹤機台上的在製品。",
      C: "兩個系統的職責被完全對調。",
      D: "HMI 是操作員與機台互動的介面，不是管理工單或彙整全廠狀態的系統。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["MES", "SCADA", "ERP", "HMI"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若需求改成「依訂單與物料存量規劃下個月的產能」，負責的系統就上移到 ERP，而不是 MES。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q005",
    subjectId: "aiot-junior-iot",
    prompt:
      "某物聯網系統的端到端延遲為 T = T感測 + T網路 + T運算 + T致動，實測總延遲為 380 毫秒。已知 T感測約 2 毫秒、T運算約 25 毫秒、T致動約 15 毫秒。工程師應優先處理下列何者？",
    choices: [
      { id: "A", text: "致動段，因為它直接影響物理動作" },
      { id: "B", text: "感測段，因其為整條鏈路的起點" },
      { id: "C", text: "網路傳輸段，因其佔了超過八成的延遲" },
      { id: "D", text: "運算段，因為模型推論最耗資源" },
    ],
    answer: "C",
    explanation:
      "扣掉已知的 42 毫秒，網路段約佔 338 毫秒，超過總延遲的八成。優化應該從佔比最大的環節下手，這是最基本的效能分析原則。",
    choiceExplanations: {
      A: "致動 15 毫秒受機構物理限制，改善空間小且佔比僅約 4%。",
      B: "感測僅佔 2 毫秒，就算歸零也只改善 0.5%，投入與回報完全不成比例。",
      D: "運算 25 毫秒約佔 6.6%，即使加速一倍也只省下十餘毫秒。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["端到端延遲", "瓶頸分析"],
      constraints: ["latency"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把架構改為邊緣就地判斷，網路段幾乎消失，屆時最大的一塊會變成運算段，優化重點就轉向模型壓縮與推論加速。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q006",
    subjectId: "aiot-junior-iot",
    prompt:
      "在閉迴路控制中，若移除「感測器回授」這一段，系統會變成下列何者？",
    choices: [
      { id: "A", text: "變成分散式控制系統" },
      { id: "B", text: "仍為閉迴路，只是反應變慢" },
      { id: "C", text: "變成非監督式學習系統" },
      { id: "D", text: "開迴路控制，依既定指令動作而不管實際結果" },
    ],
    answer: "D",
    explanation:
      "回授正是「閉」的定義。少了它，控制器無從知道實際結果是否符合期望，只能依既定指令輸出——這就是開迴路，對擾動完全沒有修正能力。",
    choiceExplanations: {
      A: "分散式控制描述的是控制器的部署方式，與有無回授是兩個獨立面向。",
      B: "沒有回授就沒有迴路可言，不是快慢的問題而是本質改變。",
      C: "非監督式學習是資料分析的範式，與控制迴路的結構無關。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["閉迴路", "開迴路", "回授"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若受控對象極為穩定且擾動可忽略（例如定時開關的照明），開迴路反而更簡單可靠，不必為它加上感測與回授。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q007",
    subjectId: "aiot-junior-iot",
    prompt:
      "某跨廠區監控專案要在設計階段就定案的項目中，下列何者一旦事後才修改，代價最高？",
    choices: [
      { id: "A", text: "裝置命名規則與時間戳基準" },
      { id: "B", text: "儀表板的圖表配色" },
      { id: "C", text: "報表的寄送對象名單" },
      { id: "D", text: "告警訊息的文字用語" },
    ],
    answer: "A",
    explanation:
      "命名與時間基準是所有歷史資料的地基。等到累積數月才更改，代價是整批資料的清洗、轉換與重新驗證，而且期間的分析結果全部要重做。",
    choiceExplanations: {
      B: "配色屬於呈現層設定，隨時可調且不影響已收集的資料。",
      C: "寄送名單是營運流程設定，改動成本極低。",
      D: "告警用語可隨時修訂，不影響資料結構與歷史紀錄。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料治理", "命名規則", "時間基準"],
      constraints: ["maintainability", "data_quality", "scalability"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若系統只在單一廠區、且不保留歷史資料供跨期比較，命名與時間基準的變更代價會低得多，可以邊做邊調。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q008",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於 PLC 與一般 MCU 在工業現場的定位，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "MCU 時脈較高，因此必定比 PLC 更適合產線控制" },
      { id: "B", text: "PLC 無法與上層系統交換資料，只能獨立運作" },
      { id: "C", text: "兩者完全等價，差別僅在售價" },
      { id: "D", text: "PLC 強調確定性掃描週期與環境耐受度，適合現場即時控制" },
    ],
    answer: "D",
    explanation:
      "PLC 的價值不在算得快，而在「算得準時」：固定掃描週期、耐震耐溫耐電磁干擾，以及成熟的現場配線與診斷生態，這些正是產線控制所需。",
    choiceExplanations: {
      A: "時脈高只代表指令執行快，不代表反應時間可預測；工業控制看重確定性而非峰值效能。",
      B: "現代 PLC 普遍支援 OPC UA 與 Modbus TCP，與 SCADA、MES 交換資料是標準做法。",
      C: "兩者的設計目標、環境規格與程式模型都不同，PLC 使用 IEC 61131-3 的梯形圖即為一例。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["PLC", "MCU", "確定性"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若應用是實驗室裡的單機資料擷取、無環境干擾也無即時要求，MCU 的成本與彈性反而勝過 PLC。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q009",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統在規劃階段要決定「哪些判斷放現場、哪些放雲端」。下列判準何者最適合作為主要依據？",
    choices: [
      { id: "A", text: "開發團隊比較熟悉哪一種技術" },
      { id: "B", text: "該判斷的延遲要求與斷網時是否仍須運作" },
      { id: "C", text: "雲端服務商目前的促銷方案" },
      { id: "D", text: "現場機櫃是否還有空間" },
    ],
    answer: "B",
    explanation:
      "延遲要求決定判斷能不能等網路往返，斷網容忍度決定它能不能依賴雲端。這兩項是功能性的硬約束，應先於團隊偏好與成本考量。",
    choiceExplanations: {
      A: "團隊熟悉度影響開發效率，但不應凌駕於系統能不能達成需求之上。",
      C: "促銷是短期價格因素，架構決策的生命週期遠長於任何優惠期。",
      D: "機櫃空間是實體限制，可以透過選型解決，不是決定運算位置的首要判準。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["邊緣與雲端", "架構決策", "斷網容錯"],
      constraints: ["latency", "cloud_availability", "reliability"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若所有判斷都不涉及即時控制、且場域網路有備援專線，運算位置的決定就會回歸成本與維運便利性。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q010",
    subjectId: "aiot-junior-iot",
    prompt:
      "下列元件與職責的配對，何者「不」正確？",
    choices: [
      { id: "A", text: "致動器——把電氣訊號轉為物理動作" },
      { id: "B", text: "閘道器——在異質網路之間轉換協定" },
      { id: "C", text: "感測器——把物理量轉為電氣或數位訊號" },
      { id: "D", text: "Broker——長期保存歷史資料供查詢" },
    ],
    answer: "D",
    explanation:
      "Broker 是訊息通道，轉送後即不再保留（Retain 也只留最後一則）。長期保存與查詢是資料庫的職責，把 Broker 當儲存是常見的架構錯誤。",
    choiceExplanations: {
      A: "把訊號轉成物理動作正是致動器的定義，配對正確。",
      B: "協定轉換是閘道器最核心的職責，配對正確。",
      C: "把物理量轉成可處理的訊號是感測器的定義，配對正確。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["致動器", "閘道器", "Broker", "感測器"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若改用具持久化能力的串流平台（而非傳統 MQTT Broker），它確實能保存並重播訊息，此時選項 D 的敘述就不再全錯。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q011",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統原本由單一伺服器同時承擔訊息接收、資料儲存與報表產生。裝置數成長後報表查詢一跑，即時資料接收就開始掉封包。最合理的改善方向是下列何者？",
    choices: [
      { id: "A", text: "縮短報表的產生週期以分散負載" },
      { id: "B", text: "降低裝置的回報頻率以配合報表" },
      { id: "C", text: "把即時接收與分析查詢的工作負載分離到不同資源上" },
      { id: "D", text: "把報表改為彩色以提升可讀性" },
    ],
    answer: "C",
    explanation:
      "症狀是兩種性質截然不同的負載互相干擾：即時接收要求低延遲與穩定吞吐，報表查詢是突發的重度運算。把兩者分離（不同節點或讀寫分離）才是對症的架構調整。",
    choiceExplanations: {
      A: "報表跑得更頻繁只會讓干擾更頻繁地發生，方向相反。",
      B: "犧牲資料密度來遷就報表，等於用系統的核心價值換取暫時的穩定。",
      D: "呈現形式與伺服器的資源競爭完全無關。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["工作負載分離", "資源競爭", "擴展"],
      constraints: ["scalability", "reliability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若裝置數不再成長且報表只在離峰時段執行，以排程錯開兩種負載就足夠，不必付出架構分離的成本。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q012",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠導入 AI 排程助理，可自動產生維修工單。安全與治理上最應納入的設計是下列何者？",
    choices: [
      { id: "A", text: "讓助理直接派工並關閉通知以免干擾" },
      { id: "B", text: "保留人工核可關卡，並記錄每張工單的產生依據" },
      { id: "C", text: "隱藏工單是由 AI 產生的事實" },
      { id: "D", text: "刪除產生過程的紀錄以節省儲存空間" },
    ],
    answer: "B",
    explanation:
      "自動化程度越高，越需要保留人的判斷關卡與可追溯的依據。核可讓錯誤在造成損失前被攔下，紀錄則讓事後能回答「為什麼會派這張工單」。",
    choiceExplanations: {
      A: "直接派工又關閉通知，等於把決策完全交出去且無人知情，風險最高。",
      C: "隱瞞 AI 身分會在出錯時嚴重損害信任，也讓使用者無從調整信賴程度。",
      D: "刪除紀錄會讓事故無從追查，也失去改善模型的依據。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["人類監督", "可追溯性", "自動化治理"],
      constraints: ["governance", "safety"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若助理只是「建議」而不會實際派工、且建議由人自行取用，人工核可關卡可以簡化，但紀錄仍應保留。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q013",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統需在斷網期間仍持續進行本地控制，並在恢復連線後把期間的資料補上。下列設計組合何者最合理？",
    choices: [
      { id: "A", text: "提高雲端伺服器規格以縮短斷線時間" },
      { id: "B", text: "把控制邏輯全部放雲端，斷網時暫停生產" },
      { id: "C", text: "斷網期間丟棄資料，僅保留連線正常時的紀錄" },
      { id: "D", text: "現場控制器保有完整控制邏輯，並以本地佇列暫存資料待連線恢復後同步" },
    ],
    answer: "D",
    explanation:
      "兩個需求分別對應兩個設計：控制不中斷 → 邏輯留在現場；資料不遺失 → 本地佇列暫存後補送。兩者合起來，網路中斷就從「停擺」降級為「暫時看不到遠端畫面」。",
    choiceExplanations: {
      A: "伺服器規格與網路是否中斷無關，提高規格救不了斷線。",
      B: "把邏輯全放雲端正是造成斷網即停擺的原因，與需求相反。",
      C: "丟棄資料會在履歷與分析上留下空洞，事後無法還原斷網期間發生了什麼。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["離線自主", "本地佇列", "資料同步"],
      constraints: ["cloud_availability", "reliability", "data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若場域網路可用度極高且短暫中斷可接受，本地佇列仍值得保留，但完整控制邏輯下放的必要性會降低。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q014",
    subjectId: "aiot-junior-iot",
    prompt:
      "在系統整合的介面設計中，下列哪一項最應在雙方動工前以文件明確約定？",
    choices: [
      { id: "A", text: "欄位名稱、資料型別、單位與錯誤回應的語意" },
      { id: "B", text: "雙方工程師的辦公座位" },
      { id: "C", text: "程式碼的縮排寬度" },
      { id: "D", text: "專案簡報使用的字型" },
    ],
    answer: "A",
    explanation:
      "介面契約沒講清楚，整合階段就會冒出單位不一致、缺欄位、錯誤時不知如何處理等問題，且往往在最後階段才爆發、修改成本最高。",
    choiceExplanations: {
      B: "座位安排屬於行政事項，與系統能否正確互通無關。",
      C: "縮排是程式風格，各團隊各自遵循即可，不影響互通。",
      D: "簡報字型與技術整合毫無關聯。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["介面契約", "系統整合"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若兩端由同一個團隊開發且可隨時同步修改，介面文件的正式程度可以降低；跨團隊或跨廠商時它就是必要的。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q015",
    subjectId: "aiot-junior-iot",
    prompt:
      "某舊產線的設備無標準通訊介面，且不允許改動設備本體。若要取得其運轉狀態，下列做法最務實的是何者？",
    choices: [
      { id: "A", text: "全面汰換為新設備" },
      { id: "B", text: "要求原廠開放內部通訊協定" },
      { id: "C", text: "以外掛式感測器（電流勾表、振動貼片）取得間接訊號" },
      { id: "D", text: "放棄資料收集，改為人工每小時抄表" },
    ],
    answer: "C",
    explanation:
      "限制是「不能改設備、沒有介面」。外掛感測從外部量測電流或振動，不需設備配合即可推知運轉與停機，是舊設備數位化最常見也最快見效的切入點。",
    choiceExplanations: {
      A: "全面汰換能一次解決，但成本與停機衝擊極高，且違反不得改動設備的前提。",
      B: "老舊機型原廠未必仍支援，且開放與否的時程完全不在專案可控範圍內。",
      D: "人工抄表雖可行，但頻率與精度都遠不及自動量測，也無法支撐後續分析。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["舊設備整合", "間接量測"],
      constraints: ["legacy_equipment", "no_modification", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若設備其實支援 Modbus，直接讀取原生參數的資料品質與涵蓋面都遠優於外掛的間接訊號，就不需要繞這一圈。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q016",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統的架構圖顯示：感測器直接以 MQTT 發布到雲端 Broker，現場沒有任何閘道器或邊緣節點。下列何者最可能成為此架構的弱點？",
    choices: [
      { id: "A", text: "每台感測器都需具備 IP 連網與 TLS 能力，且斷網時無本地緩衝" },
      { id: "B", text: "雲端 Broker 無法處理 MQTT 訊息" },
      { id: "C", text: "感測器無法量測物理量" },
      { id: "D", text: "資料庫無法儲存時間序列" },
    ],
    answer: "A",
    explanation:
      "少了現場的匯聚層，每一台感測器都得自己承擔連網、加密與憑證管理，成本與功耗都上升；一旦對外斷線，也沒有任何地方能暫存資料。",
    choiceExplanations: {
      B: "處理 MQTT 正是 Broker 的本職，不構成弱點。",
      C: "量測物理量是感測器的基本功能，與架構選擇無關。",
      D: "時間序列資料庫本來就為此設計，不是這個架構的問題所在。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Architecture",
      concepts: ["閘道器", "架構弱點", "本地緩衝"],
      constraints: ["cost", "power", "cloud_availability"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若感測器數量極少（例如三台）、皆為市電供電且場域網路穩定，直連雲端反而省下閘道器的建置與維運成本。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q017",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於系統中「感測器」與「致動器」的角色，下列敘述何者正確？",
    choices: [
      { id: "A", text: "感測器為輸入端、致動器為輸出端，兩者方向相反" },
      { id: "B", text: "感測器為輸出端、致動器為輸入端" },
      { id: "C", text: "兩者都是輸入端，只是量測對象不同" },
      { id: "D", text: "兩者都是輸出端，只是驅動方式不同" },
    ],
    answer: "A",
    explanation:
      "感測器把物理世界的狀態送進系統（輸入），致動器把系統的決策送回物理世界（輸出）。兩者在感知層構成一對方向相反的角色，缺一則迴路不完整。",
    choiceExplanations: {
      B: "兩者的方向被完全對調。",
      C: "致動器不量測任何東西，它執行動作。",
      D: "感測器不驅動任何物理動作，它只提供訊號。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["感測器", "致動器", "輸入輸出"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若元件同時具備量測與動作能力（例如帶位置回授的伺服馬達），它在架構圖上會同時出現在輸入與輸出兩側。",
    },
  },

  // ── B1.2 簡易系統故障問題判斷與排除（17 題）───────────────────
  {
    id: "aiot-junior-iot-practice-q018",
    subjectId: "aiot-junior-iot",
    prompt:
      "某節點可被 ping 通，但 MQTT 連線一直失敗。下列何者「最不可能」是原因？",
    choices: [
      { id: "A", text: "Broker 的 1883／8883 連接埠被防火牆阻擋" },
      { id: "B", text: "節點與 Broker 之間的實體網路完全中斷" },
      { id: "C", text: "用戶端憑證或帳號密碼不正確" },
      { id: "D", text: "Broker 只接受 TLS 連線，但用戶端以明文連線" },
    ],
    answer: "B",
    explanation:
      "ping 通已經證明 IP 層可達，實體與網路層都沒斷。既然如此，問題必然出在更上層：連接埠、認證或加密設定。這正是「ping 通不等於服務通」的典型情境。",
    choiceExplanations: {
      A: "ping 走 ICMP，與 TCP 連接埠是兩回事；埠被擋時 ping 依然會通，完全符合症狀。",
      C: "認證失敗發生在 TCP 連上之後，症狀正是「連得到但建不了 MQTT 工作階段」。",
      D: "用戶端以明文連 TLS 埠會在握手階段失敗，同樣是 ping 通卻連不上的常見原因。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["ping", "MQTT", "連接埠", "TLS"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若症狀改為「ping 也不通」，範圍就回到實體與網路層，該檢查的是線路、IP 設定與路由，而非認證。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q019",
    subjectId: "aiot-junior-iot",
    prompt:
      "一顆 I²C 感測器完全讀不到值。依由下而上的排查原則，最先應確認的是下列何者？",
    choices: [
      { id: "A", text: "MQTT 主題字串是否正確" },
      { id: "B", text: "雲端儀表板的圖表設定" },
      { id: "C", text: "供電電壓、接線與是否共地" },
      { id: "D", text: "資料庫的寫入權限" },
    ],
    answer: "C",
    explanation:
      "電源與實體接線是最底層的前提，沒電或沒共地時上面每一層都不可能正常。先確認它，再往介面設定（位址、時脈）、網路、應用逐層往上。",
    choiceExplanations: {
      A: "Topic 錯會造成「有送出但收不到」，但此時資料根本還沒產生。",
      B: "儀表板是整條鏈路的最末端，感測器連值都讀不到時先查它等於跳過所有更可能的原因。",
      D: "資料庫權限影響寫入階段，同樣在感測讀值之後。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["排查順序", "I²C", "供電"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若症狀是「讀得到值但數值不合理」，底層供電顯然正常，排查起點就應直接跳到單位換算與位元組順序。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q020",
    subjectId: "aiot-junior-iot",
    prompt:
      "同一條 I²C 匯流排上原有一顆感測器運作正常，加入第二顆同型號感測器後兩顆都讀不到。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "兩顆感測器的量測範圍不同" },
      { id: "B", text: "SCL 時脈設定過慢" },
      { id: "C", text: "兩顆裝置的 I²C 位址相同而在匯流排上衝突" },
      { id: "D", text: "MCU 的 Flash 容量不足" },
    ],
    answer: "C",
    explanation:
      "I²C 靠位址辨識裝置，同型號預設位址往往相同。兩顆同時回應會造成匯流排訊號衝突，結果是兩顆都讀不到。解法是改用位址設定腳、換型號或加多工器。",
    choiceExplanations: {
      A: "量測範圍影響的是數值解讀，不會讓通訊本身失敗。",
      B: "時脈偏慢只會讓傳輸變慢，不會造成完全讀不到，且問題不會因為多接一顆才出現。",
      D: "Flash 不足會在燒錄或執行時就出問題，與匯流排上多掛一顆裝置沒有因果關係。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["I²C 位址", "匯流排衝突"],
      constraints: ["multi_device", "reliability"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若加入的是不同型號、位址本就不同的感測器卻仍失敗，該懷疑的就轉為上拉電阻是否足夠或總線電容過大。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q021",
    subjectId: "aiot-junior-iot",
    prompt:
      "某 LoRa 節點在廠區內時好時壞。實測 RSSI 尚可但 SNR 很低。最合理的判讀與處置是下列何者？",
    choices: [
      { id: "A", text: "環境雜訊偏高，應設法找出干擾源或調整節點位置與參數" },
      { id: "B", text: "訊號強度不足，應提高發射功率" },
      { id: "C", text: "電池電量不足，應更換電池" },
      { id: "D", text: "閘道器儲存空間已滿，應清理磁碟" },
    ],
    answer: "A",
    explanation:
      "RSSI 尚可代表訊號有收到，SNR 低代表雜訊跟著一起大——問題出在訊雜比而非絕對強度。一味加大功率會讓訊號與雜訊一起放大，效果有限還多耗電。",
    choiceExplanations: {
      B: "在 RSSI 已足夠的情況下提高功率，訊雜比未必改善，卻直接犧牲電池壽命。",
      C: "電量不足通常表現為裝置直接失聯或重開，而不是收得到但訊雜比差。",
      D: "閘道器儲存空間與無線鏈路品質分屬不同層次，不會反映在 RSSI 與 SNR 上。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["RSSI", "SNR", "干擾"],
      constraints: ["reliability", "environment"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若量到的是 RSSI 很低而 SNR 尚可，那才是純粹的訊號衰減問題，提高功率、改善天線或縮短距離就會有效。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q022",
    subjectId: "aiot-junior-iot",
    prompt:
      "裝置回報一切正常、Broker 也顯示收到訊息，但訂閱端始終收不到任何資料。最值得優先檢查的是下列何者？",
    choices: [
      { id: "A", text: "發布與訂閱的主題字串是否完全一致（含大小寫與階層）" },
      { id: "B", text: "感測器的供電電壓" },
      { id: "C", text: "MCU 的時脈頻率" },
      { id: "D", text: "機櫃的散熱風扇是否運轉" },
    ],
    answer: "A",
    explanation:
      "MQTT 主題區分大小寫並以斜線分層，只要一個字元或一層對不上，Broker 就會安靜地把訊息送到別處——不報錯，但訂閱端永遠收不到。這是最典型的「無聲失敗」。",
    choiceExplanations: {
      B: "供電有問題時裝置根本無法回報正常，與題目描述矛盾。",
      C: "時脈異常會讓裝置整體行為失常，而不是只有訂閱端收不到。",
      D: "散熱屬於環境條件，除非已導致當機，否則不會表現為訊息路由不到。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["MQTT 主題", "無聲失敗"],
      constraints: ["reliability"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若訂閱端偶爾收得到、偶爾收不到，主題就應該是對的，該轉而懷疑 QoS 設定、網路穩定度或 Broker 的連線上限。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q023",
    subjectId: "aiot-junior-iot",
    prompt:
      "某裝置每次重開機後都取不到網路連線，但手動設定固定 IP 就能正常運作。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "MQTT 的 QoS 設為 0" },
      { id: "B", text: "感測器校正參數遺失" },
      { id: "C", text: "DHCP 服務異常或可配發的位址已耗盡" },
      { id: "D", text: "資料庫索引損毀" },
    ],
    answer: "C",
    explanation:
      "手動給固定 IP 就能連，代表實體鏈路、路由與上層服務都正常，唯一被略過的環節就是「自動取得位址」。這直接指向 DHCP：服務沒回應或位址池用完。",
    choiceExplanations: {
      A: "QoS 影響訊息送達保證，前提是已經連上網路，階段完全不同。",
      B: "校正參數遺失會讓量測數值不準，與能否取得 IP 位址無關。",
      D: "資料庫屬於後端儲存層，裝置連不連得上網路與它無關。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["DHCP", "IP 設定"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若固定 IP 也連不上，問題就往下層移，該檢查的是網路線、交換器埠與 VLAN 設定。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q024",
    subjectId: "aiot-junior-iot",
    prompt:
      "資料成功寫入資料庫，但室溫欄位顯示 850 度。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "數值的單位換算或多位元組的高低位順序解析錯誤" },
      { id: "B", text: "網路頻寬不足" },
      { id: "C", text: "Broker 的連線數已達上限" },
      { id: "D", text: "儀表板的字型設定錯誤" },
    ],
    answer: "A",
    explanation:
      "資料能寫進資料庫代表整條傳輸鏈路是通的，問題出在「解讀」而非「傳輸」。常見成因是原始值以 0.1 度為單位卻未換算，或高低位順序解錯，兩者都會產生量級明顯錯誤的數值。",
    choiceExplanations: {
      B: "頻寬不足造成的是資料延遲或遺失，而不是數值本身失真。",
      C: "連線數達上限會讓新裝置連不上，已寫入的資料不會因此變成錯值。",
      D: "字型只影響顯示外觀，不會改變資料庫裡實際存放的數字。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["單位換算", "位元組順序", "資料解析"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若數值只是略微偏高（例如高 2 度）而非量級錯誤，該懷疑的就不是解析錯誤而是感測器校正或安裝位置受熱源影響。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q025",
    subjectId: "aiot-junior-iot",
    prompt:
      "某 UART 連線收到的字元全為亂碼，接線與供電確認無誤。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "兩端的 IP 位址不在同一網段" },
      { id: "B", text: "收發雙方的鮑率設定不一致" },
      { id: "C", text: "MQTT 的 QoS 設定錯誤" },
      { id: "D", text: "資料庫的字元集設定錯誤" },
    ],
    answer: "B",
    explanation:
      "UART 沒有共用時脈，靠雙方以約定鮑率各自計時取樣。鮑率不一致時取樣點逐位元偏移，每個位元組都錯——症狀正是整片亂碼。",
    choiceExplanations: {
      A: "UART 是實體串列介面，沒有 IP 概念，網段設定與它無關。",
      C: "QoS 屬於 MQTT 應用層機制，與位元層級的取樣是完全不同的層次。",
      D: "資料庫字元集會影響儲存與顯示，但此處在資料進入資料庫之前就已經是亂碼。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["UART", "鮑率"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若只是偶爾出現錯字而非全片亂碼，鮑率應該是對的，該轉而懷疑線太長、雜訊干擾或缺少共地。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q026",
    subjectId: "aiot-junior-iot",
    prompt:
      "儀表板上有三成裝置的資料在每天早上八點前後固定中斷約十分鐘，其餘時間正常。最值得優先調查的方向是下列何者？",
    choices: [
      { id: "A", text: "感測器的量測原理是否正確" },
      { id: "B", text: "儀表板的配色是否易讀" },
      { id: "C", text: "資料庫的欄位命名是否規範" },
      { id: "D", text: "該時段是否有共用資源的競爭或排程作業（如批次同步、換班設備啟動）" },
    ],
    answer: "D",
    explanation:
      "「固定時段、固定持續時間、只影響部分裝置」是強烈的規律性線索，指向排程性事件而非隨機故障。優先比對該時段的作業排程與網路流量最有機會一次命中。",
    choiceExplanations: {
      A: "量測原理若有問題，症狀會是持續性的數值異常，而不是每天固定時段中斷。",
      B: "配色與資料是否送達完全無關。",
      C: "欄位命名屬於資料治理，不會造成週期性的資料中斷。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["規律性故障", "資源競爭", "排程作業"],
      constraints: ["reliability", "scalability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若中斷時間完全隨機、且分布於所有裝置，規律性線索消失，就該回到基礎的網路品質與 Broker 負載檢查。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q027",
    subjectId: "aiot-junior-iot",
    prompt:
      "在排查系統故障時，下列做法何者最符合「以證據推進」的原則？",
    choices: [
      { id: "A", text: "把所有設定一次全部改掉，看看會不會好" },
      { id: "B", text: "憑經驗猜一個最可能的原因，直接更換該零件" },
      { id: "C", text: "在每一層取得可觀察的證據後再下判斷，並記錄排除了哪些可能" },
      { id: "D", text: "反覆重開機直到問題暫時消失" },
    ],
    answer: "C",
    explanation:
      "逐層取證才能確定問題被排除在哪個範圍之外；同時留下的紀錄讓故障可重現、可交接，下次再發生時能快速定位。",
    choiceExplanations: {
      A: "一次改多項會讓因果關係徹底混淆，就算好了也不知道是哪一項造成的。",
      B: "猜測換件運氣好時有效，但無法排除其他原因，也留不下任何可供下次參考的資訊。",
      D: "重開機常常只是把狀態暫時清掉，根因仍在，問題會以更難預測的方式再現。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["排錯方法", "證據導向"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若產線正在停機、必須先恢復生產，可以先做暫時性處置（如切換備援），但根因調查仍須在事後補做。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q028",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統的封包遺失率在尖峰時段從 0.1% 上升到 8%。下列處置何者最應優先評估？",
    choices: [
      { id: "A", text: "更換所有感測器" },
      { id: "B", text: "檢視尖峰時段的頻寬使用與裝置回報是否集中在同一時刻" },
      { id: "C", text: "把資料庫改為 NoSQL" },
      { id: "D", text: "調整儀表板的重新整理間隔" },
    ],
    answer: "B",
    explanation:
      "遺失率只在尖峰上升，指向的是容量與時序問題而非硬體故障。先看頻寬是否吃滿、回報是否全部擠在同一秒，再決定要擴充頻寬還是把回報時間錯開。",
    choiceExplanations: {
      A: "感測器若真有故障，遺失率不會只在尖峰時段升高，且全面更換成本極高。",
      C: "資料庫型別與網路封包是否遺失分屬不同層次。",
      D: "儀表板的更新頻率只影響顯示，不會改變網路上的封包流量。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["封包遺失", "頻寬", "回報時序"],
      constraints: ["bandwidth", "scalability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若遺失率是全時段一致地偏高，就不是容量問題，該檢查的是實體線路品質、干擾源或設備故障。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q029",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統的可用率計算為 Uptime / Total Time。若某月總時數 720 小時、非計畫停機 18 小時，可用率最接近下列何者？",
    choices: [
      { id: "A", text: "18%" },
      { id: "B", text: "99.75%" },
      { id: "C", text: "82.5%" },
      { id: "D", text: "97.5%" },
    ],
    answer: "D",
    explanation:
      "(720 − 18) / 720 = 702 / 720 = 0.975，即 97.5%。可用率的分母是總時間，分子是實際可用時間。",
    choiceExplanations: {
      A: "18% 是把停機時數直接當成百分比，混淆了時數與比率。",
      B: "99.75% 對應的停機時間約為 1.8 小時，比題目給的少了一個數量級。",
      C: "82.5% 對應的停機約 126 小時，與 18 小時不符。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["可用率", "停機時間"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      crossNode: "B2.3",
      decisionBoundary:
        "若把分母改為「計畫生產時間」而非總時數，計畫內的保養停機就不列入扣減，算出的數字會更高——這正是 OEE 的可用率與此處的差別。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q030",
    subjectId: "aiot-junior-iot",
    prompt:
      "工程師懷疑某段通訊有問題，想確認「封包實際上有沒有送出、內容是什麼」。最適合的工具是下列何者？",
    choices: [
      { id: "A", text: "影像編輯軟體" },
      { id: "B", text: "封包擷取分析工具" },
      { id: "C", text: "簡報製作軟體" },
      { id: "D", text: "試算表軟體" },
    ],
    answer: "B",
    explanation:
      "要回答「線上到底流過什麼」，只有直接擷取封包能提供第一手證據，而不是靠推測。這也是排錯時把「猜測」升級為「證據」的關鍵一步。",
    choiceExplanations: {
      A: "影像編輯與網路封包完全無關。",
      C: "簡報軟體用於呈現結論，不具備任何診斷能力。",
      D: "試算表可以分析已匯出的紀錄，但無法擷取網路上實際流動的封包。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["封包擷取", "診斷工具"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若通訊已加密，封包擷取只能看到有無流量與大小，要看內容就得在端點側以應用層日誌或 MQTT 用戶端工具檢視。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q031",
    subjectId: "aiot-junior-iot",
    prompt:
      "某閘道器在連續運作數天後開始間歇性重啟，重啟前記憶體使用量持續上升。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "程式存在記憶體洩漏，資源耗盡後觸發重啟" },
      { id: "B", text: "感測器的取樣精度不足" },
      { id: "C", text: "MQTT 主題命名不規範" },
      { id: "D", text: "儀表板的圖表過多" },
    ],
    answer: "A",
    explanation:
      "「隨運作時間單調上升的記憶體 + 週期性重啟」是記憶體洩漏的典型指紋。應以監控確認上升趨勢，再從長時間持有的物件或未釋放的連線著手。",
    choiceExplanations: {
      B: "取樣精度影響數值品質，不會造成記憶體隨時間累積。",
      C: "主題命名不規範會造成訂閱錯誤，但不會讓記憶體單調上升。",
      D: "儀表板執行於使用者端，與閘道器的記憶體用量無關。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["記憶體洩漏", "長時間運作", "資源監控"],
      constraints: ["reliability", "memory"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若記憶體用量穩定卻仍週期性重啟，該懷疑的就轉為看門狗逾時、供電不穩或散熱造成的保護性重啟。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q032",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統的告警在三天內發出兩千則，值班人員已不再查看。此現象最貼切的描述與處置是下列何者？",
    choices: [
      { id: "A", text: "屬正常現象，值班人員應加強紀律" },
      { id: "B", text: "告警不足：應再增加更多監控項目" },
      { id: "C", text: "應直接關閉所有告警以免干擾" },
      { id: "D", text: "告警疲勞：應收斂門檻、合併重複告警並分級，讓真正重要的浮出來" },
    ],
    answer: "D",
    explanation:
      "告警的價值在於「被看見並被處理」。兩千則的量已超過人可負荷，實質等於沒有告警。正確做法是收斂門檻、抑制重複、依嚴重度分級，而不是責備人或全部關掉。",
    choiceExplanations: {
      A: "把系統設計缺陷歸咎於人的紀律，無法解決根本問題。",
      B: "增加監控項目會讓告警更多，直接惡化問題。",
      C: "全部關閉會讓真正的重大事故也失去通知，風險反而最高。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["告警疲勞", "門檻設定", "告警分級"],
      constraints: ["usability", "reliability"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若告警數量本來就少、卻經常漏掉真實異常，問題就反過來是門檻過寬或監控覆蓋不足，處置方向完全相反。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q033",
    subjectId: "aiot-junior-iot",
    prompt:
      "下列關於故障排除的敘述，何者「不」正確？",
    choices: [
      { id: "A", text: "感測器有輸出不代表資料格式一定正確" },
      { id: "B", text: "Broker 連得上不代表主題訂閱一定正確" },
      { id: "C", text: "只要重開機後問題消失，即可確認根因已排除" },
      { id: "D", text: "ping 得通不代表應用層服務一定可用" },
    ],
    answer: "C",
    explanation:
      "重開機清掉的往往是累積的狀態（記憶體、連線、暫存），根因仍在。把「症狀消失」當成「問題解決」，只會讓它在更不方便的時候再次發生。",
    choiceExplanations: {
      A: "有輸出只代表電氣與介面正常，單位與編碼仍可能錯誤，敘述正確。",
      B: "連線成功與訂閱正確是兩件事，主題打錯會安靜地收不到，敘述正確。",
      D: "ping 只驗證到網路層，連接埠、認證與服務狀態都還沒被驗證，敘述正確。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["根因分析", "排錯原則"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若重開機後問題再也沒有出現、且已找到並修正明確的觸發條件，才算根因排除；單憑「沒再發生」不足以下此結論。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q034",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線的三台同型設備中，只有一台的資料時常缺漏。已知三台的韌體版本、設定與網路環境皆相同。下列排查方向何者最有效率？",
    choices: [
      { id: "A", text: "重寫全廠的資料收集程式" },
      { id: "B", text: "調整儀表板的顯示範圍" },
      { id: "C", text: "更換後端資料庫" },
      { id: "D", text: "比對該台與其餘兩台的實體差異（線路、供電、安裝位置、周邊干擾源）" },
    ],
    answer: "D",
    explanation:
      "「同型、同設定、同環境，只有一台異常」把變因縮到那台獨有的條件上。比對實體差異是成本最低且命中率最高的下一步，這也是控制變因的基本應用。",
    choiceExplanations: {
      A: "程式若有問題，三台應同時異常；重寫全廠程式風險高又打不到重點。",
      B: "顯示範圍只影響看得到什麼，不影響資料是否進來。",
      C: "後端若有問題同樣會影響三台，不符合單台異常的症狀。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["控制變因", "差異比對"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若三台都間歇缺漏，共同因素才是嫌疑對象，排查就該轉向共用的網路、Broker 或供電迴路。",
    },
  },

  // ── B1.3 物聯網資訊安全（17 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q035",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠的裝置與雲端之間已啟用 TLS，但韌體未經簽章驗證、且所有裝置共用同一組管理密碼。下列何者是「最優先」應補上的防護？",
    choices: [
      { id: "A", text: "為每台裝置配發唯一憑證或密碼，並導入韌體簽章驗證" },
      { id: "B", text: "把 TLS 的加密強度再提高一級" },
      { id: "C", text: "增加雲端防火牆的規則數量" },
      { id: "D", text: "縮短資料在雲端的保存期限" },
    ],
    answer: "A",
    explanation:
      "TLS 已守住傳輸，但裝置本身有兩個大洞：共用密碼讓一台淪陷等於全部淪陷，未驗簽韌體讓攻擊者能直接置換執行的程式。這兩者的風險等級遠高於再加強已經足夠的加密。",
    choiceExplanations: {
      B: "傳輸加密已經生效，再提高強度屬於邊際效益極低的加強，無助於堵住裝置端的缺口。",
      C: "雲端防火牆管的是進雲流量，對「裝置本身被接管」這條路徑沒有作用。",
      D: "縮短保存期限降低的是外洩後的影響面，但沒有阻止入侵發生。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["唯一憑證", "韌體簽章", "TLS", "風險排序"],
      constraints: ["security", "risk_priority"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Layer Confusion",
        D: "Partial Truth",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若裝置端已有唯一憑證與安全開機，而通訊仍為明文，優先順序就會反過來——先補 TLS 才是最急的一步。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q036",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於最小權限原則在 IoT 平台上的落實，下列做法何者最符合？",
    choices: [
      { id: "A", text: "為所有服務配發同一組管理員金鑰以便維護" },
      { id: "B", text: "為資料收集服務只開放特定主題的訂閱權限，不給發布或管理權" },
      { id: "C", text: "先給予全部權限，出問題再逐項收回" },
      { id: "D", text: "只要通過認證即自動取得全部操作權限" },
    ],
    answer: "B",
    explanation:
      "最小權限的核心是「只給完成任務所需的最低權限」。收集服務只需要讀取特定主題，因此不給發布與管理權；如此即使該憑證外洩，攻擊者能做的事也被限縮。",
    choiceExplanations: {
      A: "共用管理員金鑰讓任何一處外洩都造成全域淪陷，是最典型的反例。",
      C: "先全開再收回，實務上收回往往永遠不會發生，且期間風險完全暴露。",
      D: "這是把認證與授權混為一談，通過認證只代表身分成立，不代表該有全部權限。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["最小權限", "RBAC", "認證與授權"],
      constraints: ["security"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若該服務日後也需要下達控制指令，就應為它新增「特定主題的發布權」，而不是索性升級成管理員。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q037",
    subjectId: "aiot-junior-iot",
    prompt:
      "某 OTA 韌體更新機制的設計中，下列哪一項對安全最關鍵？",
    choices: [
      { id: "A", text: "更新後自動清空所有日誌" },
      { id: "B", text: "把更新檔壓縮到最小以縮短下載時間" },
      { id: "C", text: "固定在深夜執行更新" },
      { id: "D", text: "驗證更新檔的數位簽章，並以加密通道傳輸" },
    ],
    answer: "D",
    explanation:
      "OTA 是把程式碼送進裝置的通道，一旦被利用等於直接取得控制權。驗簽確認來源與完整性、加密通道防止被掉包，兩者缺一不可。",
    choiceExplanations: {
      A: "清空日誌會讓更新後的異常無從追查，反而是安全上的倒退。",
      B: "檔案大小影響傳輸成本與時間，與更新是否安全無關。",
      C: "選離峰時段可降低影響範圍，屬於營運考量，但無法阻止惡意韌體被植入。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["OTA", "數位簽章", "加密通道"],
      constraints: ["security"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若更新檔只在完全隔離的產線內網以人工方式燒錄，傳輸通道的風險下降，但簽章驗證仍不可省——它防的是檔案本身被替換。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q038",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司要盤點「自家產品是否使用了剛爆出重大漏洞的開源函式庫」。下列何者最能讓這件事在數小時內完成？",
    choices: [
      { id: "A", text: "重新編譯所有產品的韌體" },
      { id: "B", text: "查閱各版本產品的軟體物料清單（SBOM）" },
      { id: "C", text: "請工程師逐一回憶用過哪些套件" },
      { id: "D", text: "等待供應商主動通知" },
    ],
    answer: "B",
    explanation:
      "SBOM 記錄產品內含哪些第三方元件與版本，漏洞公布時只要比對清單即可盤點受影響範圍。沒有它就只能靠人工翻原始碼，時間以週計而非小時。",
    choiceExplanations: {
      A: "重新編譯不會產生元件清單，且耗時甚久也解答不了「有沒有用到」。",
      C: "靠記憶既不完整也不可稽核，跨版本與跨團隊時尤其不可靠。",
      D: "被動等待會錯過黃金應變時間，且供應商未必掌握你的組合方式。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["SBOM", "漏洞管理", "供應鏈"],
      constraints: ["security", "response_time"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若產品完全自研、不含任何第三方元件，SBOM 的價值會降低；但現代韌體幾乎不可能沒有開源相依。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q039",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠把 IoT 裝置與辦公網路放在同一個網段。從資安角度，此設計最主要的風險是下列何者？",
    choices: [
      { id: "A", text: "任一側被入侵後可直接橫向移動到另一側" },
      { id: "B", text: "IoT 裝置的取樣頻率會下降" },
      { id: "C", text: "辦公電腦的螢幕解析度會受影響" },
      { id: "D", text: "資料庫的欄位會被自動改名" },
    ],
    answer: "A",
    explanation:
      "同網段意味著彼此可直接連通。一封釣魚信讓辦公電腦淪陷後，攻擊者就能直接掃描並攻擊產線裝置——這正是網段隔離要阻斷的路徑。",
    choiceExplanations: {
      B: "取樣頻率由裝置設定決定，與網段規劃無關。",
      C: "螢幕解析度與網路架構完全無關。",
      D: "資料庫結構不會因為網段設定而改變。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Scenario Selection",
      concepts: ["網段隔離", "橫向移動"],
      constraints: ["security"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若兩者已在不同網段但仍需交換資料，風險焦點就從「能不能連通」轉為「跨網段的那個交換點是否受控」。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q040",
    subjectId: "aiot-junior-iot",
    prompt:
      "在風險評估中以「Risk ≈ Likelihood × Impact」排序待修項目，其主要用意是下列何者？",
    choices: [
      { id: "A", text: "取代滲透測試" },
      { id: "B", text: "精確計算修補所需的金額" },
      { id: "C", text: "證明系統已無任何風險" },
      { id: "D", text: "在資源有限下決定先處理哪些風險" },
    ],
    answer: "D",
    explanation:
      "資源永遠不足以同時修完所有問題。把發生機率與影響程度相乘，可以把「很可能發生且後果嚴重」的項目排到最前面，讓有限人力先處理真正要命的風險。",
    choiceExplanations: {
      A: "滲透測試實際驗證漏洞可否被利用，與紙上評估互補而非互相取代。",
      B: "兩個因子多為分級估計值，相乘的結果是相對排序而非金額。",
      C: "評估的產出是風險高低的排序，從來不是零風險的證明。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["風險評估", "優先順序"],
      constraints: ["security", "cost"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若某風險的影響涉及人身安全，即使發生機率極低，實務上也會被提到最優先——安全相關的風險通常不完全依相乘結果排序。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q041",
    subjectId: "aiot-junior-iot",
    prompt:
      "某智慧攝影機的防護設計包含：韌體簽章、唯一裝置憑證、TLS 傳輸、角色型存取控制與稽核日誌。此設計最貼切的名稱是下列何者？",
    choices: [
      { id: "A", text: "縱深防禦" },
      { id: "B", text: "單點防護" },
      { id: "C", text: "負載平衡" },
      { id: "D", text: "資料正規化" },
    ],
    answer: "A",
    explanation:
      "五項措施分別落在裝置、傳輸、平台與稽核各層，任一層被突破仍有其他防線——這正是縱深防禦的具體樣貌。",
    choiceExplanations: {
      B: "單點防護指的是把賭注押在單一措施上，與本題的多層設計相反。",
      C: "負載平衡是效能與可用性的設計，不屬於資安防護層次。",
      D: "資料正規化處理的是格式一致性，與防護無關。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "易",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["縱深防禦", "分層防護"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若五項措施全部集中在同一層（例如都在網路層），即使數量多也不構成縱深，只是同一道防線的加厚。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q042",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統要求「事後能追查是誰在何時對哪台裝置下了什麼指令」。下列機制何者最直接對應？",
    choices: [
      { id: "A", text: "傳輸加密" },
      { id: "B", text: "稽核日誌，記錄操作者、時間、對象與動作" },
      { id: "C", text: "資料壓縮" },
      { id: "D", text: "負載平衡" },
    ],
    answer: "B",
    explanation:
      "追查行為需要的是「留下紀錄」。稽核日誌把操作者、時間、對象與動作四要素記下來，事後才能重建事件經過並釐清責任。",
    choiceExplanations: {
      A: "加密保護傳輸內容不被讀取，但不會產生任何可供追查的行為紀錄。",
      C: "壓縮只縮小資料體積，與行為追蹤無關。",
      D: "負載平衡分散流量以提升效能，同樣不記錄誰做了什麼。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Scenario Selection",
      concepts: ["稽核日誌", "可追溯性"],
      constraints: ["governance", "security"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求改為「證明這筆指令確實由某人發出、他不能否認」，光有日誌不夠，還需要以數位簽章綁定身分。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q043",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線裝置的除錯介面（如 UART console）在量產品上仍然開啟且無密碼保護。此設計最可能導致下列何者？",
    choices: [
      { id: "A", text: "裝置的取樣精度下降" },
      { id: "B", text: "資料庫索引失效" },
      { id: "C", text: "網路頻寬被佔滿" },
      { id: "D", text: "具實體接觸機會者可直接取得系統權限並讀取金鑰" },
    ],
    answer: "D",
    explanation:
      "開放的除錯介面等於在裝置上留了一道無鎖後門。只要能實體接觸（維修、外借、遭竊），就可能直接進入系統、讀出憑證與金鑰，讓上層所有防護一併失效。",
    choiceExplanations: {
      A: "除錯介面是否開啟與感測精度沒有因果關係。",
      B: "資料庫索引屬於後端，與裝置的除錯埠無關。",
      C: "本地序列介面不佔用網路頻寬。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["除錯介面", "實體安全", "金鑰保護"],
      constraints: ["security", "physical_access"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若裝置部署在門禁嚴格的機房內、無外人可接觸，此風險等級下降，但量產品仍應關閉或加保護——部署環境不一定永遠可控。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q044",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於「安全開機（Secure Boot）」與「傳輸加密（TLS）」的分工，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者功能重疊，擇一即可" },
      { id: "B", text: "安全開機保護傳輸資料，TLS 驗證韌體" },
      { id: "C", text: "安全開機驗證裝置上要執行的程式，TLS 保護資料在網路上的傳輸" },
      { id: "D", text: "兩者都只在雲端執行" },
    ],
    answer: "C",
    explanation:
      "一個守「裝置上跑什麼」，一個守「路上傳什麼」，防護的是完全不同的攻擊面。缺哪一個就露哪一段，不能互相替代。",
    choiceExplanations: {
      A: "若功能重疊，只做其一時就不會留下明確的攻擊面；實際上兩者各有無法覆蓋的區域。",
      B: "兩者的職責被完全對調。",
      D: "安全開機在裝置端執行，TLS 則是端與端之間的協定，都不是雲端專屬。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Secure Boot", "TLS", "攻擊面"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Layer Confusion",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若裝置完全離線運作，TLS 的必要性下降，但安全開機仍應保留——實體接觸與韌體置換的風險並不因離線而消失。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q045",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司發現資料外洩事件正在進行中。下列處置順序何者最合理？",
    choices: [
      { id: "A", text: "先刪除相關日誌以免被追究，再對外宣稱無事" },
      { id: "B", text: "先公開所有內部資料以示透明" },
      { id: "C", text: "等待事件自行結束後再評估" },
      { id: "D", text: "先阻斷外洩途徑並保全日誌與證據，再依規定通報" },
    ],
    answer: "D",
    explanation:
      "應變的順序是止血、保全證據、依法通報。先阻斷才能限制損害範圍，保全日誌則是後續鑑識與究責的唯一依據，通報則有法定時限不能拖。",
    choiceExplanations: {
      A: "刪除日誌會摧毀鑑識證據，本身可能構成湮滅證據等更嚴重的責任。",
      B: "公開內部資料會讓損害從特定資料擴大到全部，是最糟的處置。",
      C: "資料外洩不會自行結束，拖延只會擴大損害並錯過法定通報時限。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["事故應變", "證據保全", "通報義務"],
      constraints: ["security", "governance", "response_time"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若外洩已經結束且範圍確定，第一步就從「阻斷」轉為「評估影響範圍與通報」，但保全證據的優先順序不變。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q046",
    subjectId: "aiot-junior-iot",
    prompt:
      "下列關於 IoT 資安的敘述，何者「不」正確？",
    choices: [
      { id: "A", text: "預設密碼未強制變更是重大風險" },
      { id: "B", text: "採用 TLS 後即可免除其他所有資安措施" },
      { id: "C", text: "裝置、網路、平台與應用各層都應有對應防護" },
      { id: "D", text: "稽核日誌有助於事後追查與究責" },
    ],
    answer: "B",
    explanation:
      "TLS 只保護傳輸中的資料，對裝置被實體接管、憑證外洩、權限設計不當、韌體遭置換等狀況都無能為力。把單一措施當成完整防護是典型的過度推論。",
    choiceExplanations: {
      A: "共用預設密碼是 IoT 最經典的重大風險，敘述正確。",
      C: "分層設防正是縱深防禦的要求，敘述正確。",
      D: "日誌是事後追查的唯一依據，敘述正確。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Incorrect Statement",
      concepts: ["TLS", "縱深防禦", "預設密碼"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 B 改成「TLS 可保護資料在傳輸過程中的機密性與完整性」，它就會變成正確敘述。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q047",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司要讓維修廠商臨時連入產線網路檢修設備。下列做法何者最能兼顧作業需求與資安？",
    choices: [
      { id: "A", text: "讓廠商直接連上辦公網路再自行尋找設備" },
      { id: "B", text: "開設限定時間、限定目標與權限的專用帳號，並全程記錄操作" },
      { id: "C", text: "臨時關閉防火牆以免影響檢修" },
      { id: "D", text: "把管理員帳號密碼提供給廠商" },
    ],
    answer: "B",
    explanation:
      "外部存取的三個控制點是範圍、時間與可追溯性。限定目標與權限縮小可觸及範圍、限定時間讓權限自動失效、全程記錄讓事後可追查，三者同時滿足作業與資安。",
    choiceExplanations: {
      A: "讓外部人員在網路中自行探索，等於主動提供橫向移動的機會。",
      C: "關閉防火牆會讓整段期間門戶大開，風險遠超過檢修帶來的便利。",
      D: "交出管理員帳號等於放棄所有權限控制，事後也無法區分是誰做的操作。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["臨時存取", "最小權限", "稽核"],
      constraints: ["security", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若廠商需要長期例行維護，臨時帳號就應升級為具名的長期帳號並納入定期權限盤點，而不是反覆開關臨時通道。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q048",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統的資安設計中，下列哪一項屬於「平台層」而非「裝置層」的防護？",
    choices: [
      { id: "A", text: "為每台裝置燒錄唯一金鑰" },
      { id: "B", text: "安全開機與韌體簽章" },
      { id: "C", text: "身分與存取管理、權限盤點與稽核" },
      { id: "D", text: "關閉量產品的除錯介面" },
    ],
    answer: "C",
    explanation:
      "身分與存取管理處理的是「誰能在平台上做什麼」，屬於平台層；其餘三項都是在裝置本體上實施的措施，屬裝置層。分清層次才能檢查有沒有哪一層被漏掉。",
    choiceExplanations: {
      A: "金鑰燒錄發生在裝置生產階段，同樣屬裝置層。",
      B: "安全開機在裝置啟動時驗證韌體，是裝置層防護。",
      D: "除錯介面存在於裝置硬體上，屬裝置層。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Architecture",
      concepts: ["分層防護", "IAM", "裝置安全"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若題目改問「哪一項屬於網路層」，答案會落在 TLS、防火牆或網段隔離，這三者又是另一組不同的措施。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q049",
    subjectId: "aiot-junior-iot",
    prompt:
      "某裝置的憑證即將到期，但現場有三千台且分散於全國。最合理的處理方式是下列何者？",
    choices: [
      { id: "A", text: "把憑證有效期限設為永久以免麻煩" },
      { id: "B", text: "等到期失效後再派工程師逐台現場更換" },
      { id: "C", text: "在到期前以自動化的憑證輪替機制批次更新，並保留失敗重試" },
      { id: "D", text: "把所有裝置改用同一張長期憑證" },
    ],
    answer: "C",
    explanation:
      "三千台分散全國，人工更換不可行。憑證管理必須在設計階段就規劃自動輪替與重試，否則到期日就會變成大規模斷線事故。",
    choiceExplanations: {
      A: "永久憑證失去了「金鑰定期更換以限制外洩影響」的意義，是安全上的倒退。",
      B: "等失效後才處理，代表全部裝置會先中斷服務，且現場逐台更換的成本與時間都極高。",
      D: "共用憑證讓一台外洩等於全部淪陷，把可控的到期問題換成不可控的資安風險。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["憑證輪替", "金鑰生命週期", "大規模維運"],
      constraints: ["security", "scalability", "maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若裝置數量只有數台且皆在機房內，人工更換是可接受的；自動輪替的必要性與裝置數量、分散程度成正比。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q050",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠導入 AI 影像檢測，攝影機畫面中會拍到作業員。從隱私角度，下列設計何者最適當？",
    choices: [
      { id: "A", text: "在端側只擷取產品區域或去識別化人臉，不上傳可辨識影像" },
      { id: "B", text: "完整上傳並長期保存以備查證" },
      { id: "C", text: "在公告欄張貼告示後即可自由使用影像" },
      { id: "D", text: "把影像提供給所有部門共用" },
    ],
    answer: "A",
    explanation:
      "檢測需要的是產品影像，不是作業員的臉。在端側就裁切區域或遮蔽人臉，等於從源頭消除不必要的個資，功能不受影響。",
    choiceExplanations: {
      B: "長期保存可辨識影像會持續累積風險，且多數情境並非必要。",
      C: "告示可滿足告知義務，但不代表可以蒐集超出必要範圍的個資。",
      D: "跨部門共用會擴大接觸面，違反最小必要與目的限制原則。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["隱私", "去識別化", "資料最小化"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若目的本身就是「工安行為偵測」（例如是否配戴防護具），人員影像就是必要的，此時重點轉為存取控制、保存期限與告知同意。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q051",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司計畫在產品上市後停止提供韌體更新。從近年的法規趨勢看，此決定最可能面臨的問題是下列何者？",
    choices: [
      { id: "A", text: "產品的外觀設計需重新申請專利" },
      { id: "B", text: "產品的包裝材質不符環保規定" },
      { id: "C", text: "與「宣告支援期內須持續處理漏洞」的合規要求相牴觸" },
      { id: "D", text: "產品的售價需重新核備" },
    ],
    answer: "C",
    explanation:
      "近年的連網產品法規把資安視為整個生命週期的義務，要求製造商在宣告的支援期內持續辨識與修補漏洞。「上市即停止更新」與這個方向直接衝突。",
    choiceExplanations: {
      A: "外觀專利與韌體更新政策沒有關聯。",
      B: "包裝環保規範屬於另一套法規，與資安義務無關。",
      D: "售價核備與產品的資安支援政策分屬不同領域。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["支援期", "漏洞管理", "合規"],
      constraints: ["governance", "security"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "若產品不具連網能力也無可更新的軟體元件，這類義務的適用範圍會大不相同——規範針對的是具數位元素的產品。",
    },
  },

  // ── B2.1 物聯網硬體設計基礎（17 題）───────────────────────────
  {
    id: "aiot-junior-iot-practice-q052",
    subjectId: "aiot-junior-iot",
    prompt:
      "要以 5 V 電源驅動一顆順向電壓 2 V、額定電流 20 mA 的 LED，串聯限流電阻應約為多少？",
    choices: [
      { id: "A", text: "150 Ω" },
      { id: "B", text: "100 Ω" },
      { id: "C", text: "250 Ω" },
      { id: "D", text: "350 Ω" },
    ],
    answer: "A",
    explanation:
      "電阻承擔的是電源與 LED 順向電壓的差：(5 − 2) = 3 V。依歐姆定律 R = V / I = 3 / 0.02 = 150 Ω。",
    choiceExplanations: {
      B: "100 Ω 對應電流 30 mA，超出額定值 50%，長期使用會縮短 LED 壽命。",
      C: "250 Ω 對應電流僅 12 mA，亮度會明顯不足。",
      D: "350 Ω 對應電流不到 9 mA，遠低於額定工作點。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["歐姆定律", "限流電阻", "LED"],
      constraints: ["voltage", "current"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若電源改為 3.3 V，壓差只剩 1.3 V，電阻應降到約 65 Ω 才能維持相同電流——電源電壓一變，整個計算就得重算。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q053",
    subjectId: "aiot-junior-iot",
    prompt:
      "某 MCU 的 GPIO 每支腳位最大輸出電流為 20 mA，工程師想直接驅動一顆啟動電流 800 mA 的直流馬達。下列判斷何者正確？",
    choices: [
      { id: "A", text: "可以直接驅動，馬達會自動限制電流" },
      { id: "B", text: "可以直接驅動，只要提高 GPIO 的輸出電壓" },
      { id: "C", text: "可以直接驅動，只要把多支 GPIO 並聯即可" },
      { id: "D", text: "不可直接驅動，必須經電晶體或馬達驅動 IC 放大" },
    ],
    answer: "D",
    explanation:
      "800 mA 是 GPIO 能力的 40 倍，直接連接會讓 MCU 過載甚至燒毀。正確做法是以小電流控制電晶體或驅動 IC，由它們去承擔馬達的大電流。",
    choiceExplanations: {
      A: "馬達不會自我限流，啟動瞬間的電流反而是最高的。",
      B: "電壓與電流是兩回事；GPIO 的電壓通常固定，且提高電壓不會改變它的電流輸出能力。",
      C: "並聯多支腳位在工程上不可靠，各腳的內阻與時序差異會造成電流分配不均，仍可能燒毀。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["GPIO 驅動能力", "電晶體", "馬達驅動"],
      constraints: ["current", "hardware_limitation"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若負載改為一顆 5 mA 的指示 LED，GPIO 就能直接驅動，不需要額外的驅動級。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q054",
    subjectId: "aiot-junior-iot",
    prompt:
      "某按鈕輸入腳位在未按下時讀值飄忽不定。最直接的處理方式是下列何者？",
    choices: [
      { id: "A", text: "改用更高解析度的 ADC" },
      { id: "B", text: "加上上拉或下拉電阻，給腳位一個確定的預設電位" },
      { id: "C", text: "增加 Flash 容量" },
      { id: "D", text: "提高 MCU 的時脈頻率" },
    ],
    answer: "B",
    explanation:
      "浮接的輸入腳等於一根小天線，容易被環境雜訊耦合而讀值跳動。上拉或下拉電阻讓它在未按下時穩定停在高或低電位，按下時才切換。",
    choiceExplanations: {
      A: "按鈕是數位輸入，不經 ADC，提高 ADC 解析度沒有作用對象。",
      C: "Flash 容量與輸入腳的電氣行為無關。",
      D: "時脈影響執行速度，不會改變腳位的電位狀態。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["浮接", "上拉電阻", "數位輸入"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若讀值是在按下的瞬間出現多次跳變，那是機械彈跳（bounce），要靠軟體去彈跳或加 RC 電路，而不是上拉電阻。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q055",
    subjectId: "aiot-junior-iot",
    prompt:
      "某電池供電節點每 10 分鐘量測並回傳一次資料，其餘時間無事可做。下列設計何者對續航力幫助最大？",
    choices: [
      { id: "A", text: "閒置期間進入深度睡眠，由計時器或中斷喚醒" },
      { id: "B", text: "持續以最高時脈輪詢感測器狀態" },
      { id: "C", text: "把程式碼的註解全部刪除" },
      { id: "D", text: "改用外觀顏色較淺的外殼" },
    ],
    answer: "A",
    explanation:
      "續航的關鍵是「醒著的時間佔比」。深度睡眠可把電流從毫安等級降到微安等級，讓裝置 99% 以上的時間幾乎不耗電，這遠比任何程式最佳化都有效。",
    choiceExplanations: {
      B: "持續輪詢是最耗電的做法，與需求完全相反。",
      C: "註解在編譯後不佔用執行資源，刪除它不影響任何耗電。",
      D: "外殼顏色影響吸熱，對電子電路的耗電沒有實質作用。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Best Engineering Decision",
      concepts: ["低功耗", "深度睡眠", "喚醒"],
      constraints: ["power", "sampling_rate"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若改為必須秒級即時回應外部事件，深度睡眠的喚醒延遲可能無法接受，設計會轉向較淺的睡眠模式或常態供電。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q056",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於中斷（Interrupt）與輪詢（Polling）的比較，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "中斷只能用於數位輸入，不能用於通訊" },
      { id: "B", text: "輪詢由事件觸發，中斷需持續檢查" },
      { id: "C", text: "中斷由事件觸發、CPU 平時可休眠；輪詢需持續檢查、較耗資源" },
      { id: "D", text: "兩者的耗電量完全相同" },
    ],
    answer: "C",
    explanation:
      "中斷讓硬體在事件發生時主動通知 CPU，平時可進入低功耗；輪詢則要求 CPU 不斷回頭查看，既耗電又可能錯過短暫事件。這對電池裝置的差異極大。",
    choiceExplanations: {
      A: "UART、I²C、SPI 等通訊週邊普遍支援中斷或 DMA，並不限於數位輸入。",
      B: "兩者的機制被完全對調。",
      D: "輪詢讓 CPU 無法休眠，耗電通常明顯高於中斷驅動的設計。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["中斷", "輪詢", "低功耗"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若事件發生極為頻繁（例如每毫秒一次），中斷的進出開銷反而可能超過輪詢，此時改用 DMA 或批次處理更合適。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q057",
    subjectId: "aiot-junior-iot",
    prompt:
      "下列資料何者最適合存放在 MCU 的 Flash 而非 RAM？",
    choices: [
      { id: "A", text: "中斷處理中的暫存旗標" },
      { id: "B", text: "每次取樣的暫存讀值" },
      { id: "C", text: "函式呼叫時的區域變數" },
      { id: "D", text: "斷電後仍須保留的校正參數與網路設定" },
    ],
    answer: "D",
    explanation:
      "Flash 為非揮發性記憶體，斷電後內容仍在，適合存放設定與校正參數；RAM 斷電即失去內容，用於執行期的暫存資料。",
    choiceExplanations: {
      A: "中斷旗標需要極快的存取速度且不需保存，放 RAM 才合理。",
      B: "暫存讀值變動頻繁且不需保留，寫進 Flash 反而加速其寫入壽命耗損。",
      C: "區域變數在函式結束後即失效，本質上就是堆疊中的暫時資料。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Flash", "RAM", "非揮發性"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若設定值需要每秒更新一次，直接寫 Flash 會迅速耗盡寫入次數，此時應改用具磨損平衡的外部儲存或先在 RAM 累積再定期寫入。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q058",
    subjectId: "aiot-junior-iot",
    prompt:
      "某控制器要以低壓訊號控制 220 V 的加熱器，並要求控制側與負載側電氣隔離。下列元件何者最直接對應此需求？",
    choices: [
      { id: "A", text: "運算放大器" },
      { id: "B", text: "繼電器或固態繼電器" },
      { id: "C", text: "分壓電阻" },
      { id: "D", text: "類比數位轉換器" },
    ],
    answer: "B",
    explanation:
      "繼電器以低壓側線圈（或光耦）驅動接點，兩側之間沒有直接的電氣連接，正好同時滿足「開關高壓負載」與「電氣隔離」兩個需求。",
    choiceExplanations: {
      A: "運算放大器用於放大或調理類比訊號，不具備切換高壓負載的能力。",
      C: "分壓電阻只是分配電壓，兩側仍在同一迴路上，完全不隔離。",
      D: "ADC 把類比訊號轉成數位值，與驅動負載無關。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["繼電器", "電氣隔離", "高壓負載"],
      constraints: ["voltage", "safety", "isolation"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若負載是低壓直流小電流（例如 5 V 指示燈），用電晶體即可，不必付出繼電器的體積、噪音與機械壽命代價。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q059",
    subjectId: "aiot-junior-iot",
    prompt:
      "某裝置以 3.7 V 鋰電池供電，實測平均電流為 2 mA。若電池容量為 2000 mAh，理論續航最接近下列何者？",
    choices: [
      { id: "A", text: "約 1000 小時" },
      { id: "B", text: "約 100 小時" },
      { id: "C", text: "約 4000 小時" },
      { id: "D", text: "約 10 小時" },
    ],
    answer: "A",
    explanation:
      "續航時間 = 容量 / 平均電流 = 2000 mAh / 2 mA = 1000 小時（約 41 天）。實務上還要扣掉自放電與低溫時的容量衰減，因此設計上會再打折。",
    choiceExplanations: {
      B: "100 小時對應的是 20 mA 平均電流，比題目給的高十倍。",
      C: "4000 小時對應 0.5 mA，比題目給的低四倍。",
      D: "10 小時對應 200 mA，量級完全不符。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["電池容量", "平均電流", "續航估算"],
      constraints: ["power", "battery_life"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若把回報間隔從 10 分鐘拉長到 1 小時，平均電流可能降到數百微安，續航就從月級延長到年級——間隔是續航最有效的槓桿。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q060",
    subjectId: "aiot-junior-iot",
    prompt:
      "某節點在馬達啟動的瞬間經常重新開機，但平時運作正常。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "MCU 的 Flash 容量不足" },
      { id: "B", text: "馬達啟動的湧浪電流造成電源電壓瞬間下降，觸發低電壓重置" },
      { id: "C", text: "MQTT 的主題命名錯誤" },
      { id: "D", text: "儀表板的更新頻率過高" },
    ],
    answer: "B",
    explanation:
      "「只在馬達啟動瞬間發生」是強烈的電源線索。啟動電流可達額定的數倍，若電源設計裕度不足或未做隔離與儲能，電壓瞬間塌陷就會讓 MCU 重置。",
    choiceExplanations: {
      A: "Flash 不足會在燒錄或執行特定功能時出問題，不會與馬達啟動時刻同步。",
      C: "主題命名錯誤造成的是訊息收不到，不會讓裝置重開機。",
      D: "儀表板執行於使用者端，與現場裝置的供電完全無關。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["湧浪電流", "電源設計", "低電壓重置"],
      constraints: ["power", "reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若重啟與馬達無關而是隨機發生，該懷疑的就轉為看門狗逾時、韌體例外或散熱造成的保護性重置。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q061",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於開源硬體的使用，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "開源硬體沒有授權條款的概念" },
      { id: "B", text: "開源即代表可任意商用且無須標示來源" },
      { id: "C", text: "應逐條確認授權條款，可能要求標示出處或以相同條款釋出衍生設計" },
      { id: "D", text: "只要不修改原設計就完全不受條款約束" },
    ],
    answer: "C",
    explanation:
      "「開源」不等於「沒有條件」。CERN OHL、CC BY-SA 等授權各有不同要求，可能規定標示原作者、以相同條款釋出衍生設計，或限制商業用途，使用前必須逐條確認。",
    choiceExplanations: {
      A: "開源硬體同樣以授權條款界定權利義務，並非沒有規範。",
      B: "許多授權明確要求標示來源，部分還限制商用，任意使用可能構成侵權。",
      D: "即使原封不動地使用與散布，仍須遵守標示出處等要求。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["開源硬體", "授權條款"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若僅在公司內部研究使用、完全不對外散布，多數授權的義務不會被觸發；一旦要出貨或公開，條款就開始生效。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q062",
    subjectId: "aiot-junior-iot",
    prompt:
      "某設計要以 PWM 控制風扇轉速。關於責任週期（Duty Cycle）與轉速的關係，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "責任週期越高，輸出電壓峰值越大" },
      { id: "B", text: "責任週期與轉速無關，需改用 DAC 才能調速" },
      { id: "C", text: "責任週期改變的是訊號頻率" },
      { id: "D", text: "責任週期越高，等效平均電壓越大，轉速通常越快" },
    ],
    answer: "D",
    explanation:
      "PWM 的高電位電壓固定，改變的是它在一個週期中所佔的時間比例。比例越高，負載感受到的平均電壓越大，風扇轉速隨之提高。",
    choiceExplanations: {
      A: "峰值電壓由電源決定且固定不變，責任週期不會改變它。",
      B: "PWM 正是最常見的風扇調速方式，不需要 DAC。",
      C: "頻率由週期決定，責任週期改的是高電位在週期內的佔比，兩者是獨立參數。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["PWM", "責任週期", "平均電壓"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若負載需要真正平滑的類比電壓（例如某些比例閥），PWM 就必須加上低通濾波，或直接改用 DAC。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q063",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工程師要在電路板上為 MCU 選擇通訊介面，需求為「連接一顆外部 Flash、要求最高吞吐」。下列選擇何者最適合？",
    choices: [
      { id: "A", text: "UART" },
      { id: "B", text: "I²C" },
      { id: "C", text: "SPI" },
      { id: "D", text: "GPIO 直接讀寫" },
    ],
    answer: "C",
    explanation:
      "SPI 具備獨立的收發資料線與較高的時脈，可全雙工且吞吐最高，是外接 Flash、顯示器這類需要大量資料搬運的標準選擇。",
    choiceExplanations: {
      A: "UART 為點對點的非同步介面，速率與可靠度都不適合大量資料搬運。",
      B: "I²C 只有一條雙向資料線且時脈較低，吞吐明顯不如 SPI，適合低速的感測器。",
      D: "以 GPIO 手動模擬時序既慢又佔用 CPU，只在沒有硬體介面時才作為權宜之計。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["SPI", "I²C", "UART"],
      constraints: ["throughput", "pin_count"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若需求換成「掛六顆低速溫濕度感測器且腳位有限」，I²C 的兩線多裝置定址會勝過 SPI。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q064",
    subjectId: "aiot-junior-iot",
    prompt:
      "某裝置在戶外運作，白天正常但入夜後偶爾停止回報。下列調查方向何者最應優先？",
    choices: [
      { id: "A", text: "確認供電是否依賴太陽能且蓄電容量不足，以及低溫對電池容量的影響" },
      { id: "B", text: "檢查儀表板的深色主題設定" },
      { id: "C", text: "重新命名 MQTT 主題" },
      { id: "D", text: "更換後端資料庫" },
    ],
    answer: "A",
    explanation:
      "「白天正常、入夜異常」同時指向兩個與時間相關的物理因素：太陽能停止發電後靠蓄電支撐，以及夜間低溫使電池可用容量下降。兩者都會在入夜後才顯現。",
    choiceExplanations: {
      B: "儀表板主題屬於顯示設定，與裝置是否回報無關。",
      C: "主題命名若有誤，白天同樣會收不到，與晝夜規律不符。",
      D: "後端若有問題不會只在夜間發生，且會影響所有裝置。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["太陽能供電", "蓄電容量", "低溫效應"],
      constraints: ["power", "environment"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若異常改為「陰雨天連續數日才發生」，同樣指向能量收支，但重點會從夜間低溫轉為蓄電容量的天數裕度。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q065",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於 MCU 的組成，下列配對何者「不」正確？",
    choices: [
      { id: "A", text: "RAM——執行期資料，斷電後內容消失" },
      { id: "B", text: "Flash——程式與設定，斷電後仍保留" },
      { id: "C", text: "ADC——把數位值轉為類比電壓輸出" },
      { id: "D", text: "GPIO——通用的數位輸入與輸出腳位" },
    ],
    answer: "C",
    explanation:
      "ADC 的方向是類比轉數位；把數位值轉成類比電壓的是 DAC。這組方向搞反是最常見的失分點。",
    choiceExplanations: {
      A: "揮發性、存放執行期資料正是 RAM 的特性，配對正確。",
      B: "非揮發、存放韌體與設定正是 Flash 的角色，配對正確。",
      D: "通用數位輸入輸出即為 GPIO 的定義，配對正確。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["RAM", "Flash", "ADC", "GPIO"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 C 改成「ADC——把類比訊號轉為數位值」，四個配對就全部正確，本題也就不成立了。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q066",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產品要在攝氏 −20 度至 60 度的戶外環境長期運作。硬體選型時最應優先確認的是下列何者？",
    choices: [
      { id: "A", text: "程式碼的註解是否完整" },
      { id: "B", text: "外殼的顏色是否美觀" },
      { id: "C", text: "產品說明書的頁數" },
      { id: "D", text: "各元件的工作溫度範圍與電池在低溫下的容量衰減" },
    ],
    answer: "D",
    explanation:
      "溫度是這個場域的硬約束。一般商規元件的下限多在 0 度，鋰電池在低溫下的可用容量也會顯著下降，兩者都可能讓裝置在冬季直接失效。",
    choiceExplanations: {
      A: "註解屬於開發品質，與硬體的環境耐受度無關。",
      B: "外觀不影響電子元件能否在極端溫度下運作。",
      C: "說明書篇幅與產品的可靠度沒有關聯。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["工作溫度範圍", "工規元件", "電池特性"],
      constraints: ["environment", "reliability", "power"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若部署在恆溫的室內機房，溫度限制解除，選型重點就會回到成本、功耗與供貨穩定度。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q067",
    subjectId: "aiot-junior-iot",
    prompt:
      "某電路以 12 V 供電、負載電流 0.5 A。此負載消耗的功率為下列何者？",
    choices: [
      { id: "A", text: "12.5 W" },
      { id: "B", text: "24 W" },
      { id: "C", text: "0.6 W" },
      { id: "D", text: "6 W" },
    ],
    answer: "D",
    explanation:
      "P = V × I = 12 × 0.5 = 6 W。功率估算是選擇電源供應器與散熱設計的起點，低估會導致電源過載。",
    choiceExplanations: {
      A: "12.5 W 看似接近電壓值，但與電流相乘的結果不符。",
      B: "24 W 對應的是 2 A 的電流，比題目給的高四倍。",
      C: "0.6 W 少了一個數量級，可能是把 0.5 A 誤當成 0.05 A。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["功率", "電壓", "電流"],
      constraints: ["power"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若負載為間歇工作（例如一分鐘只運轉五秒），平均功率會遠低於峰值，但電源供應器仍必須撐得住峰值。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q068",
    subjectId: "aiot-junior-iot",
    prompt:
      "某原型板以麵包板接線在實驗室運作正常，移到產線後頻繁出現接觸不良與雜訊。最合理的下一步是下列何者？",
    choices: [
      { id: "A", text: "把麵包板的顏色換成金屬色" },
      { id: "B", text: "改為正式的印刷電路板並加強接地與屏蔽" },
      { id: "C", text: "提高 MCU 的時脈以克服雜訊" },
      { id: "D", text: "增加程式的重試次數即可" },
    ],
    answer: "B",
    explanation:
      "麵包板的接點靠彈片摩擦，在震動與電磁環境下極不可靠。要進到產線就必須換成焊接固定的正式電路板，並處理接地與屏蔽以抵抗現場的干擾。",
    choiceExplanations: {
      A: "外觀顏色不會改變接點的機械可靠度或抗干擾能力。",
      C: "提高時脈通常讓訊號完整性更難維持，反而加劇問題。",
      D: "重試能掩蓋偶發錯誤，但接觸不良會持續惡化，治標不治本。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["原型與量產", "訊號完整性", "接地屏蔽"],
      constraints: ["reliability", "environment"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若仍在概念驗證階段、只需在實驗室展示，麵包板的便利性勝過可靠度；一旦要進入現場長期運作，取捨就完全翻轉。",
    },
  },


  // ── B2.2 雲端環境數據收集與平台設計（16 題）───────────────────
  {
    id: "aiot-junior-iot-practice-q069",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠有 2000 台設備、每秒各上傳一筆振動值，需長期保存並頻繁查詢「某台設備某時間區間的趨勢」。平台端最適合的儲存選擇是下列何者？",
    choices: [
      { id: "A", text: "把每筆資料存成一個獨立的 JSON 檔案" },
      { id: "B", text: "時序資料庫，以裝置與時間為索引並設定資料保存政策" },
      { id: "C", text: "以單一關聯式資料表存放，不建任何索引" },
      { id: "D", text: "只保存在裝置本地，查詢時再逐台連線抓取" },
    ],
    answer: "B",
    explanation:
      "每秒 2000 筆是典型的時序負載，查詢型態又固定是「某裝置＋某時間窗」。時序資料庫針對這種寫多讀窗的模式最佳化，且內建的保存政策可自動汰除或降頻舊資料。",
    choiceExplanations: {
      A: "每筆一檔會產生海量小檔，metadata 開銷遠大於資料本身，查詢也極慢。",
      C: "沒有索引的關聯式表在資料量達億筆後，單次區間查詢就得全表掃描，回應時間無法接受。",
      D: "逐台連線抓取受限於裝置的網路與運算能力，且裝置離線時就查不到，無法支撐長期分析。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["時序資料庫", "資料保存政策", "查詢模式"],
      constraints: ["data_volume", "query_latency", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若查詢型態改為「跨裝置的複雜關聯與交易一致性」（例如工單、料號、客戶的關聯查詢），關聯式資料庫才是正確選擇。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q070",
    subjectId: "aiot-junior-iot",
    prompt:
      "在 IoT 資料管線中，「資料湖（Data Lake）」與「資料倉儲（Data Warehouse）」最主要的差異是下列何者？",
    choices: [
      { id: "A", text: "兩者功能完全相同，只是名稱不同" },
      { id: "B", text: "資料湖只能存圖片，倉儲只能存文字" },
      { id: "C", text: "資料湖不需要任何權限控管" },
      { id: "D", text: "資料湖存放原始或半結構化資料、讀取時定義結構；倉儲存放已清洗建模的結構化資料" },
    ],
    answer: "D",
    explanation:
      "差別在「結構何時定義」。資料湖先照原樣收進來、分析時才決定怎麼解讀（schema-on-read）；倉儲則在寫入前就完成清洗與建模（schema-on-write），查詢快但彈性低。",
    choiceExplanations: {
      A: "兩者的設計取向與適用場景明顯不同，實務上常並存而非互相取代。",
      B: "兩者都能存放多種格式，區分點不在檔案型態。",
      C: "資料湖同樣需要嚴格的權限與治理，缺乏治理正是它退化成「資料沼澤」的原因。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["資料湖", "資料倉儲", "schema-on-read"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若需求是「固定報表、要求毫秒級回應且欄位定義穩定」，倉儲勝出；若是「先收下來、之後才知道要怎麼用」的探索性分析，資料湖才划算。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q071",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台需在「感測值超過門檻後 200 毫秒內」觸發產線停機。下列架構何者最合適？",
    choices: [
      { id: "A", text: "把資料寫入資料湖，隔日以報表通知現場人員" },
      { id: "B", text: "全部資料上雲，由雲端每小時批次計算後回傳指令" },
      { id: "C", text: "在邊緣端就地判斷並直接下達停機指令，同時把事件上傳雲端存查" },
      { id: "D", text: "由人員盯著儀表板，發現異常時手動按下停機" },
    ],
    answer: "C",
    explanation:
      "200 毫秒的預算容不下往返雲端的網路延遲與排隊時間。判斷必須留在邊緣，雲端則負責存查、彙整與模型更新——這是延遲需求決定架構的典型案例。",
    choiceExplanations: {
      A: "隔日報表屬於事後分析，無法阻止當下的異常擴大。",
      B: "每小時批次的延遲是需求的上萬倍，量級完全不符。",
      D: "人的反應時間以秒計，且無法全天候不間斷盯著畫面。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["邊緣運算", "延遲預算", "雲邊協同"],
      constraints: ["latency", "safety", "connectivity"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "A3.2",
      decisionBoundary:
        "若容許延遲放寬到數十秒（例如通知維修排程），雲端判斷就足夠，還能享有集中管理與更大模型的好處。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q072",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台採「串流處理」而非「批次處理」的主要理由是下列何者？",
    choices: [
      { id: "A", text: "串流處理必定比批次處理省錢" },
      { id: "B", text: "串流處理可自動保證資料完全正確" },
      { id: "C", text: "串流處理不需要處理亂序與延遲抵達的資料" },
      { id: "D", text: "資料持續產生且需在短時間內產出結果" },
    ],
    answer: "D",
    explanation:
      "選串流是為了新鮮度：事件一到就處理、結果隨時可用。批次則以等待換取吞吐與簡單性，適合可以接受數小時延遲的作業。",
    choiceExplanations: {
      A: "串流需要常駐資源與更複雜的狀態管理，成本通常高於批次，不是省錢的選擇。",
      B: "處理方式不保證資料本身的正確性，品質仍須靠驗證規則把關。",
      C: "亂序與遲到資料正是串流處理最棘手的問題，需要以水位線與視窗機制處理。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["串流處理", "批次處理", "資料新鮮度"],
      constraints: ["latency", "cost"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若下游只需要每日結算的統計數字，批次不但更便宜也更容易重跑與稽核，此時導入串流是過度設計。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q073",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台發現同一筆感測資料被寫入兩次，造成統計偏高。下列設計何者最能避免？",
    choices: [
      { id: "A", text: "縮短資料保存期限" },
      { id: "B", text: "為每筆訊息帶唯一識別碼，寫入端依此做去重的冪等處理" },
      { id: "C", text: "把統計結果直接除以二" },
      { id: "D", text: "把 QoS 調成 0 以減少重送" },
    ],
    answer: "B",
    explanation:
      "至少一次傳遞必然帶來重複。給每筆訊息一個唯一識別碼，寫入端據以判斷「這筆已經處理過」，重複到達也不會重複計入——這就是冪等寫入。",
    choiceExplanations: {
      A: "保存期限與是否重複計算無關。",
      C: "除以二是對症狀動手腳，重複次數不固定時只會讓數字更錯。",
      D: "QoS 0 確實不重送，但代價是訊息可能直接遺失，把重複問題換成遺漏問題。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["冪等性", "去重", "傳遞保證"],
      constraints: ["data_integrity", "reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若統計偏高但每筆識別碼都不同，重複就不是原因，該轉去查是否有兩台裝置誤用了同一個裝置編號。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q074",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於 IoT 平台的「裝置影子（Device Shadow）」機制，下列敘述最正確者為何？",
    choices: [
      { id: "A", text: "用來加密裝置與雲端之間的通訊" },
      { id: "B", text: "用於複製裝置的實體外觀以便渲染 3D 模型" },
      { id: "C", text: "只是裝置日誌的別名" },
      { id: "D", text: "在雲端保存裝置的最後已知狀態與期望狀態，讓應用在裝置離線時仍可讀寫" },
    ],
    answer: "D",
    explanation:
      "影子把「應用想要的狀態」與「裝置回報的狀態」分開存放。應用隨時可寫入期望值，裝置上線後再同步差異，因此不必要求兩端同時在線。",
    choiceExplanations: {
      A: "通訊加密由 TLS 負責，不是影子的職責。",
      B: "影子存的是狀態資料，與外觀模型無關。",
      C: "日誌記錄的是歷史事件序列，影子存的是當前狀態，兩者用途不同。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["裝置影子", "狀態同步", "離線容忍"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Terminology Swap",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若應用要求「指令必須立刻生效、否則就報錯」，影子的延後同步語意反而造成誤解，此時應改用同步的請求／回應模式。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q075",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台的雲端費用逐月上升，經查主因是「每秒一筆的原始資料全部長期保存」。下列調整何者最能兼顧成本與分析需求？",
    choices: [
      { id: "A", text: "直接刪除所有超過一週的資料" },
      { id: "B", text: "近期保留原始資料，較舊的降頻為分鐘或小時彙總後轉入低價儲存" },
      { id: "C", text: "把取樣頻率降到每小時一次" },
      { id: "D", text: "把資料改存在裝置端以節省雲端費用" },
    ],
    answer: "B",
    explanation:
      "分層保存的邏輯是：細節的價值隨時間衰減。近期資料需要原始解析度以便排查，舊資料多半只用來看趨勢，彙總後再轉冷儲存可大幅降價又不失去分析能力。",
    choiceExplanations: {
      A: "一刀切刪除會失去年度趨勢與稽核依據，且異常事件的歷史比對也無從做起。",
      C: "降低來源取樣會連近期的細節一併失去，異常排查與模型訓練都會受害。",
      D: "裝置儲存空間有限、可靠度低，且資料分散在數千台上等於無法分析。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Constraint Change",
      concepts: ["資料分層", "降頻彙總", "冷儲存"],
      constraints: ["cost", "data_volume", "analysis_need"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若法規要求原始資料須完整保存數年，就不能降頻，只能改以壓縮與更便宜的封存層來控制成本。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q076",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台要接收數萬台裝置的資料，且下游有多個系統各自處理。下列架構何者最能解耦上下游？",
    choices: [
      { id: "A", text: "以訊息佇列或串流平台作為中介，下游各自訂閱所需資料" },
      { id: "B", text: "讓每台裝置直接呼叫每個下游系統的 API" },
      { id: "C", text: "由下游系統定期登入裝置抓取資料" },
      { id: "D", text: "把所有下游邏輯寫進同一支程式" },
    ],
    answer: "A",
    explanation:
      "中介的佇列讓上游只管發布、下游只管訂閱。新增或移除一個下游系統不必更動裝置韌體，某個下游暫停也不會拖垮資料收集，同時提供緩衝以吸收流量尖峰。",
    choiceExplanations: {
      B: "裝置直連多個下游會讓耦合度隨系統數量相乘，任何一個下游變更都要更新數萬台韌體。",
      C: "由下游反向連線裝置需要處理數萬台的連線與認證，且裝置離線就抓不到。",
      D: "全部寫成一支程式會讓任一功能的變更都需重新部署整體，故障也會擴散到所有下游。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["訊息佇列", "發布訂閱", "解耦"],
      constraints: ["scalability", "maintainability"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若只有一台裝置與一個下游系統，直接呼叫 API 更簡單；佇列的價值隨裝置數與下游數的成長而快速放大。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q077",
    subjectId: "aiot-junior-iot",
    prompt:
      "某儀表板顯示的溫度出現 −999 這種明顯不合理的值。平台端最適當的處理是下列何者？",
    choices: [
      { id: "A", text: "在資料進入時以合理範圍檢查標記或濾除異常值，並記錄來源以便追查" },
      { id: "B", text: "在儀表板上把 −999 直接顯示為 25 度" },
      { id: "C", text: "忽略它，讓使用者自行判斷" },
      { id: "D", text: "把資料庫的欄位型別改成文字" },
    ],
    answer: "A",
    explanation:
      "−999 通常是感測器的錯誤代碼。在入口就做範圍檢查、標記並保留原始紀錄，既讓下游統計不被污染，也保留了追查感測器故障的線索。",
    choiceExplanations: {
      B: "把錯誤值改寫成看似正常的數字是竄改資料，會掩蓋感測器故障。",
      C: "放著不管會讓平均值等統計嚴重失真，也錯過了故障的早期訊號。",
      D: "改成文字型別只是讓錯誤值更難被檢查，並未處理資料品質問題。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料品質", "範圍檢查", "異常值"],
      constraints: ["data_integrity", "observability"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若異常值落在物理上可能的範圍內（例如攝氏 45 度），範圍檢查抓不到，就得改用與鄰近裝置或歷史趨勢比對的方式判別。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q078",
    subjectId: "aiot-junior-iot",
    prompt:
      "某跨國工廠的裝置分別記錄本地時間上傳，導致資料合併後時序錯亂。最合理的修正是下列何者？",
    choices: [
      { id: "A", text: "要求所有工廠改用同一個當地時區的牆上時鐘" },
      { id: "B", text: "統一以 UTC 記錄時間戳，顯示時再依使用者所在時區轉換" },
      { id: "C", text: "以資料抵達雲端的時間取代裝置的時間戳" },
      { id: "D", text: "在報表上加註「時間僅供參考」" },
    ],
    answer: "B",
    explanation:
      "儲存用 UTC、顯示才轉時區，是跨時區系統的標準做法。它同時解決了時區差與日光節約時間造成的重複或跳過的小時。",
    choiceExplanations: {
      A: "強迫各廠使用外地時間會讓現場人員的作業紀錄與實際作息脫節，製造新的混亂。",
      C: "抵達時間受網路延遲與斷線補送影響，會把事件錯放在錯誤的時間點上。",
      D: "加註聲明沒有修正任何資料，時序分析與追溯仍然不可用。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["UTC", "時間戳", "時區處理"],
      constraints: ["data_integrity", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "裝置本身的時鐘也可能飄移或未校時，因此除了統一 UTC，還需要 NTP 之類的校時機制，否則時間戳一致但仍然不準。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q079",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台要讓維運人員能及早察覺「某批裝置停止上傳」。下列做法最直接有效者為何？",
    choices: [
      { id: "A", text: "把資料保存期限延長" },
      { id: "B", text: "每天人工翻閱原始資料表" },
      { id: "C", text: "以最後上傳時間設定逾時告警，並依裝置群組彙整通知" },
      { id: "D", text: "在儀表板增加更多顏色" },
    ],
    answer: "C",
    explanation:
      "「沒有資料」本身就是一種訊號，但它不會主動出現在圖表上。以最後上傳時間設定逾時門檻，才能把沉默轉成可被察覺的告警；依群組彙整則避免上百則通知淹沒維運人員。",
    choiceExplanations: {
      A: "延長保存期限與是否能及早察覺中斷無關。",
      B: "人工翻閱既慢又容易漏看，且無法在夜間或假日即時反應。",
      D: "顏色是呈現方式，不會讓缺少的資料自己浮現。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["逾時告警", "可觀測性", "告警彙整"],
      constraints: ["observability", "response_time"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若裝置本來就是低頻回報（例如每天一次），逾時門檻必須依各群組的回報週期分別設定，否則不是誤報連連就是形同虛設。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q080",
    subjectId: "aiot-junior-iot",
    prompt:
      "下列關於 IoT 雲端平台的敘述，何者「不」正確？",
    choices: [
      { id: "A", text: "只要把資料全部收進雲端，分析結果自然正確" },
      { id: "B", text: "時序資料庫適合大量帶時間戳的感測資料" },
      { id: "C", text: "資料保存政策有助於控制長期儲存成本" },
      { id: "D", text: "訊息佇列可吸收流量尖峰並解耦上下游" },
    ],
    answer: "A",
    explanation:
      "資料量不等於資料品質。若來源本身有校正偏差、時間戳錯亂或裝置故障，收得越多只是把錯誤放大，分析結果反而更有說服力地錯下去。",
    choiceExplanations: {
      B: "時序資料庫本就是為此類負載設計，敘述正確。",
      C: "保存政策自動汰除或降頻舊資料，確實能控制成本，敘述正確。",
      D: "緩衝尖峰與解耦正是佇列的核心價值，敘述正確。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Incorrect Statement",
      concepts: ["資料品質", "訊息佇列", "時序資料庫", "保存政策"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若把選項 A 改成「須搭配資料驗證與校正機制，分析結果才可信」，四項敘述就全部成立。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q081",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台需支援從一千台擴增到十萬台裝置。下列設計何者最有助於水平擴展？",
    choices: [
      { id: "A", text: "服務設計為無狀態，狀態外置於佇列與資料庫，依負載增減執行個體" },
      { id: "B", text: "把所有連線狀態保存在單一伺服器的記憶體中" },
      { id: "C", text: "持續為同一台伺服器升級規格" },
      { id: "D", text: "限制每天只允許一部分裝置連線" },
    ],
    answer: "A",
    explanation:
      "無狀態服務可以任意增減複本，任何一台掛掉也不會帶走狀態。把狀態集中到專責的佇列與資料庫，才能讓運算層真正依流量彈性伸縮。",
    choiceExplanations: {
      B: "狀態綁在單機記憶體會讓該機成為瓶頸與單點故障，也無法把流量分散到其他複本。",
      C: "垂直升級有物理上限且成本非線性上升，十萬台的規模無法只靠單機支撐。",
      D: "限制連線是把需求砍掉，而非讓系統支援需求。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Constraint Change",
      concepts: ["無狀態服務", "水平擴展", "狀態外置"],
      constraints: ["scalability", "availability", "cost"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若裝置數固定在數十台且不會成長，單機部署的簡單性勝過分散式架構的維運複雜度。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q082",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台的儀表板需同時呈現「即時狀態」與「近三年趨勢」。最合理的設計是下列何者？",
    choices: [
      { id: "A", text: "兩個區塊都只查最近一分鐘的資料" },
      { id: "B", text: "兩個區塊都即時掃描三年的原始資料" },
      { id: "C", text: "即時區塊查詢近期高解析資料，趨勢區塊查詢預先彙總的日／月統計表" },
      { id: "D", text: "把三年資料全部載入瀏覽器後再由前端計算" },
    ],
    answer: "C",
    explanation:
      "兩種需求的資料解析度差了好幾個量級。即時看細節、趨勢看彙總，各取所需才能同時滿足回應速度與時間跨度；預先彙總把昂貴的計算從查詢時搬到寫入時。",
    choiceExplanations: {
      A: "只查一分鐘無法呈現三年趨勢，直接不符需求。",
      B: "每次開啟儀表板都掃三年原始資料，回應時間與查詢成本都不可接受。",
      D: "把數億筆資料送到瀏覽器會耗盡頻寬與記憶體，前端也無力完成這種規模的運算。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["預先彙總", "查詢最佳化", "資料解析度"],
      constraints: ["query_latency", "cost", "data_volume"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "預先彙總的代價是彈性：若使用者要自由選擇任意的統計維度與區間，就得保留即時查詢原始資料的路徑，或改用支援即席查詢的分析引擎。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q083",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司評估「自建機房」與「使用公有雲」承載 IoT 平台。下列敘述何者最能反映公有雲的主要優勢？",
    choices: [
      { id: "A", text: "長期總持有成本必定低於自建" },
      { id: "B", text: "使用公有雲後即不需要任何資安措施" },
      { id: "C", text: "可依實際用量彈性增減資源，前期投資與擴充前置時間較低" },
      { id: "D", text: "公有雲不會發生任何服務中斷" },
    ],
    answer: "C",
    explanation:
      "公有雲的核心價值是彈性與速度：不必為尖峰預先採購硬體，需求成長時幾分鐘就能擴充。這在裝置數難以預測的 IoT 專案尤其重要。",
    choiceExplanations: {
      A: "在負載穩定且可預測的長期場景，自建的總持有成本反而可能較低，並非必定。",
      B: "雲服務採責任共擔模型，作業系統之上的設定、權限與應用安全仍由使用者負責。",
      D: "任何服務都可能中斷，因此才需要跨可用區部署與備援設計。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["公有雲", "彈性擴充", "責任共擔"],
      constraints: ["cost", "scalability", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若法規要求資料不得離開特定境內機房、且負載長期穩定，自建或私有雲的合規性與成本優勢就會勝過公有雲的彈性。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q084",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台導入「資料治理」，下列何者最貼近其涵蓋範圍？",
    choices: [
      { id: "A", text: "挑選儀表板的配色方案" },
      { id: "B", text: "決定伺服器機櫃的擺放位置" },
      { id: "C", text: "設定裝置外殼的防水等級" },
      { id: "D", text: "定義資料的擁有者、分級、保存期限、存取權限與品質標準" },
    ],
    answer: "D",
    explanation:
      "資料治理處理的是「誰對哪些資料負責、能被誰使用、保存多久、品質要求為何」。缺了它，資料湖很快就會淪為沒人敢用的資料沼澤。",
    choiceExplanations: {
      A: "配色屬於視覺設計，與資料的權責與品質規範無關。",
      B: "機櫃配置屬於機房實體設施管理，不在資料治理範疇。",
      C: "防水等級是硬體規格，屬於裝置選型的議題。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料治理", "資料分級", "存取權限"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      crossNode: "A2.5",
      decisionBoundary:
        "治理定義的是規則；規則能否落實還需要技術上的存取控制與稽核來執行，兩者缺一不可。",
    },
  },

  // ── B2.3 智慧製造流程優化與成本控制（16 題）───────────────────
  {
    id: "aiot-junior-iot-practice-q085",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線設備一班 8 小時，計畫停機 30 分鐘、實際運轉 390 分鐘。其時間稼動率（Availability）最接近下列何者？",
    choices: [
      { id: "A", text: "約 95%" },
      { id: "B", text: "約 87%" },
      { id: "C", text: "約 81%" },
      { id: "D", text: "約 75%" },
    ],
    answer: "B",
    explanation:
      "可用時間為 480 − 30 = 450 分鐘，實際運轉 390 分鐘，稼動率 = 390 / 450 ≈ 86.7%，約 87%。計畫停機不計入分母，是這個指標最常被算錯的地方。",
    choiceExplanations: {
      A: "95% 高於實際比值，對應的是只停約 22 分鐘的情況。",
      C: "81% 是把 390 除以未扣除計畫停機的 480 分鐘所得，分母用錯。",
      D: "75% 遠低於實際比值，與題目給的數字不符。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["稼動率", "OEE", "計畫停機"],
      constraints: ["measurement_definition"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若管理目標改為「衡量設備占用整個班別的產出效率」，分母才會改用 480 分鐘，得到的就是另一個指標而非稼動率。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q086",
    subjectId: "aiot-junior-iot",
    prompt:
      "某設備的時間稼動率 90%、性能效率 95%、良品率 98%。其 OEE 最接近下列何者？",
    choices: [
      { id: "A", text: "約 78%" },
      { id: "B", text: "約 94%" },
      { id: "C", text: "約 98%" },
      { id: "D", text: "約 84%" },
    ],
    answer: "D",
    explanation:
      "OEE = 0.90 × 0.95 × 0.98 ≈ 0.838，約 84%。三項相乘的意義是損失會層層疊加——每項看起來都不差，整體卻掉了六分之一。",
    choiceExplanations: {
      A: "78% 低於正確值，與三項相乘的結果不符。",
      B: "94% 接近三者的平均值，但 OEE 是相乘而非取平均。",
      C: "98% 只是其中一項的數值，不是三者的綜合結果。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["OEE", "性能效率", "良品率"],
      constraints: ["measurement_definition"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "改善時應先看三項中最低的那一項，因為相乘結構下，提升最弱環節帶來的整體增幅最大。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q087",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠導入設備感測與資料收集後，希望從「壞了才修」轉為「預測何時該修」。此轉變最貼切的名稱是下列何者？",
    choices: [
      { id: "A", text: "定期保養" },
      { id: "B", text: "事後維護" },
      { id: "C", text: "預測性維護" },
      { id: "D", text: "全面品質管理" },
    ],
    answer: "C",
    explanation:
      "預測性維護以設備的即時狀態與歷史資料推估剩餘壽命，在故障發生前、且盡量接近該時點時才安排維修，兼顧可用率與維護成本。",
    choiceExplanations: {
      A: "定期保養依固定週期執行，不看設備實際狀態，會出現「還很健康卻換件」或「撐不到下次卻已故障」。",
      B: "事後維護正是「壞了才修」的原本做法，是被取代的一方。",
      D: "全面品質管理著眼於全員參與的品質改善，不是針對設備維修時機的策略。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["預測性維護", "維護策略"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      crossNode: "A1.2",
      decisionBoundary:
        "若設備便宜、更換容易且故障不影響安全，事後維護反而是總成本最低的策略——預測性維護的投資要由停機損失來支撐。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q088",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線由四道工序串接，各站每小時產能分別為 120、80、150、110 件。整線的每小時產出最接近下列何者？",
    choices: [
      { id: "A", text: "115 件" },
      { id: "B", text: "80 件" },
      { id: "C", text: "150 件" },
      { id: "D", text: "460 件" },
    ],
    answer: "B",
    explanation:
      "串接產線的產出受限於最慢的一站。第二站每小時只能處理 80 件，前面再快也只會在它面前堆積，因此整線產出就是 80 件。",
    choiceExplanations: {
      A: "115 件接近四站的平均值，但串接系統的產出由瓶頸決定而非平均。",
      C: "150 件是最快一站的產能，前後站不可能配合到這個速度。",
      D: "460 件是四站產能的總和，但工序是串接而非並聯，不能相加。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["瓶頸", "產線平衡", "限制理論"],
      constraints: ["throughput"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若把第二站提升到 110 件，瓶頸就轉移到第四站，整線產出變成 110 件——改善瓶頸後必須重新找出新的瓶頸。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q089",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠打算投入資源改善產線，但只能擇一。下列何者最符合「以瓶頸為優先」的原則？",
    choices: [
      { id: "A", text: "先改善最靠近出貨端的工站" },
      { id: "B", text: "先提升目前產能最高那一站的效率" },
      { id: "C", text: "平均分配資源給所有工站" },
      { id: "D", text: "先提升目前產能最低那一站的效率" },
    ],
    answer: "D",
    explanation:
      "只有瓶頸站的改善會直接轉化為整線產出的提升。投在非瓶頸站的資源，換來的只是更多在瓶頸前堆積的半成品，帳面效率上升但實際交付不變。",
    choiceExplanations: {
      A: "位置遠近不決定產出，除非該站剛好就是瓶頸。",
      B: "最快的一站本來就有餘裕，再加速只會讓瓶頸前的堆積更嚴重。",
      C: "平均分配把大部分資源投在不會影響產出的地方，整體效益最低。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["限制理論", "瓶頸改善", "資源配置"],
      constraints: ["cost", "throughput"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若瓶頸站的改善成本極高、而次瓶頸站只要小投入就能大幅改善，實務上可能先做後者以累積效益，但整線產出在瓶頸解除前不會提升。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q090",
    subjectId: "aiot-junior-iot",
    prompt:
      "某導入案的一次性投資為 300 萬元，預估每年可節省 100 萬元。其簡易投資回收期最接近下列何者？",
    choices: [
      { id: "A", text: "0.3 年" },
      { id: "B", text: "1 年" },
      { id: "C", text: "10 年" },
      { id: "D", text: "3 年" },
    ],
    answer: "D",
    explanation:
      "簡易回收期 = 投資額 / 年節省 = 300 / 100 = 3 年。這個指標忽略貨幣時間價值與後續效益，但因計算直觀，常用於初步篩選提案。",
    choiceExplanations: {
      A: "0.3 年是把兩個數字倒過來相除的結果。",
      B: "1 年對應的是每年節省 300 萬元，與題目給的節省金額不符。",
      C: "10 年對應每年節省 30 萬元，同樣不符。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["投資回收期", "效益評估"],
      constraints: ["cost"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若專案還有每年 20 萬元的維運費用，實際淨節省降為 80 萬元，回收期就拉長到 3.75 年——營運成本必須計入才不會高估效益。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q091",
    subjectId: "aiot-junior-iot",
    prompt:
      "評估 AIoT 導入案時，除了設備採購金額外，最不應被忽略的成本項目是下列何者？",
    choices: [
      { id: "A", text: "系統整合、教育訓練與後續維運等總持有成本" },
      { id: "B", text: "設備外箱的印刷費用" },
      { id: "C", text: "廠區的植栽維護費" },
      { id: "D", text: "員工制服的更換費用" },
    ],
    answer: "A",
    explanation:
      "硬體常只占總支出的一部分。與既有系統整合、人員訓練、雲端費用與長期維運往往加總起來更高，卻最容易在提案階段被漏算，導致專案中途缺錢。",
    choiceExplanations: {
      B: "外箱印刷屬於零星耗材，金額與導入決策無關。",
      C: "植栽維護是廠務日常支出，與 AIoT 專案的成本結構無關。",
      D: "制服更換屬於一般人事庶務，不因導入 AIoT 而改變。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["總持有成本", "導入成本"],
      constraints: ["cost"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "A1.2",
      decisionBoundary:
        "若導入的是完全託管的訂閱式服務，採購與維運費用合併為單一月費，成本結構就從資本支出轉為營運支出，評估方式也隨之改變。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q092",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠的 AI 瑕疵檢測若判定為良品但實際為瑕疵，客戶端將發生退貨與商譽損失。此情境下模型調校最應優先降低下列何者？",
    choices: [
      { id: "A", text: "模型的訓練時間" },
      { id: "B", text: "偽陽性（誤判為瑕疵）" },
      { id: "C", text: "偽陰性（漏檢）" },
      { id: "D", text: "模型的檔案大小" },
    ],
    answer: "C",
    explanation:
      "漏檢的瑕疵會流到客戶手上，代價是退貨、賠償與商譽；誤判只是多花一次人工複檢。兩類錯誤的成本不對稱時，門檻就該往降低高成本那一類的方向調。",
    choiceExplanations: {
      A: "訓練時間屬於開發階段的效率議題，與檢測錯誤的成本無關。",
      B: "誤判為瑕疵只增加內部複檢成本，遠低於流出到客戶的損失。",
      D: "檔案大小影響部署便利性，不影響兩類錯誤的取捨。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["偽陰性", "錯誤成本", "門檻調整"],
      constraints: ["cost", "quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Correct in Different Context",
        D: "Layer Confusion",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若改成「誤判會導致整批昂貴的原料報廢、而漏檢僅在下一站就被攔下」，成本結構翻轉，該優先壓低的就變成偽陽性。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q093",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠導入 AIoT 一年後，希望證明專案有效。下列做法何者最具說服力？",
    choices: [
      { id: "A", text: "統計儀表板的登入次數" },
      { id: "B", text: "統計系統累積收集的資料筆數" },
      { id: "C", text: "以導入前後同口徑的 OEE、不良率與停機時間對比，並排除其他重大變動因素" },
      { id: "D", text: "請主管以主觀感受評分" },
    ],
    answer: "C",
    explanation:
      "效益必須落在營運指標上，且比較的口徑要一致。同時說明期間是否有換料、換線或訂單結構改變，才能排除把外部變化算成專案成效的疑慮。",
    choiceExplanations: {
      A: "登入次數是使用行為指標，與產出、品質或成本無直接關聯。",
      B: "資料量代表系統在運轉，不代表流程因此變好。",
      D: "主觀評分容易受期待與立場影響，無法作為投資決策的依據。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["效益驗證", "同口徑比較", "干擾因素"],
      constraints: ["measurement_definition", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      crossNode: "A1.2",
      decisionBoundary:
        "若能保留一條未導入的對照產線同期比較，說服力還會更高——這等於把前後對比升級成有對照組的設計。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q094",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於「數位分身（Digital Twin）」在智慧製造中的用途，下列敘述最正確者為何？",
    choices: [
      { id: "A", text: "以即時資料維持虛擬模型與實體設備同步，用於模擬、預測與方案驗證" },
      { id: "B", text: "只是設備的一張靜態 3D 圖片" },
      { id: "C", text: "用於備份設備的韌體" },
      { id: "D", text: "用於取代所有實體設備" },
    ],
    answer: "A",
    explanation:
      "數位分身的關鍵在「持續同步」。有了與實體同步的模型，就能在虛擬環境試不同參數與排程，找到最佳解後再套用到實體，避免在真實產線上冒險試錯。",
    choiceExplanations: {
      B: "靜態 3D 圖沒有資料回流與模擬能力，只是視覺呈現。",
      C: "韌體備份屬於版本管理，與模擬預測無關。",
      D: "數位分身用來輔助決策，實體設備仍是實際生產的執行者。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["數位分身", "模擬驗證", "即時同步"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      crossNode: "A1.1",
      decisionBoundary:
        "若模型不再接收實體資料而只是一次性建模，它就退回成模擬模型，失去數位分身最核心的同步特性。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q095",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠想降低在製品（WIP）庫存與生產前置時間。下列做法最直接對應者為何？",
    choices: [
      { id: "A", text: "提前備妥數週份的半成品" },
      { id: "B", text: "依實際需求拉動生產，控制各站投料量並縮小批量" },
      { id: "C", text: "增加每批的生產數量以攤提換線時間" },
      { id: "D", text: "各站盡量滿載生產以提高帳面稼動率" },
    ],
    answer: "B",
    explanation:
      "拉式生產讓後站的實際需求決定前站投料，加上小批量流動，在製品自然減少，前置時間也隨之縮短——庫存不再堆在工序之間等待。",
    choiceExplanations: {
      A: "提前囤積半成品正是在製品庫存的來源，與目標背道而馳。",
      C: "大批量雖攤薄換線時間，卻讓每批等待與搬運的時間拉長，前置時間反而增加。",
      D: "各站滿載會在非瓶頸站生產出用不到的半成品，帳面漂亮但在製品大增。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["拉式生產", "在製品", "小批量"],
      constraints: ["cost", "lead_time"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若換線時間極長而無法縮短，小批量的代價會高到吃掉全部效益，此時要先投資快速換模，否則大批量仍是較經濟的選擇。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q096",
    subjectId: "aiot-junior-iot",
    prompt:
      "下列關於智慧製造導入的敘述，何者「不」正確？",
    choices: [
      { id: "A", text: "應先確認要改善的營運指標，再決定要收集哪些資料" },
      { id: "B", text: "改善非瓶頸工站不一定能提升整線產出" },
      { id: "C", text: "只要導入 AI，產線效率必定顯著提升" },
      { id: "D", text: "評估效益時應計入維運與訓練等長期成本" },
    ],
    answer: "C",
    explanation:
      "效率提升來自流程改變，AI 只是手段。若瓶頸在換線、料件供應或人力調度，模型再準也動不了整線產出；資料品質不足時甚至可能誤導決策。",
    choiceExplanations: {
      A: "從指標倒推資料需求可避免收集了一堆用不到的資料，敘述正確。",
      B: "這正是限制理論的核心結論，敘述正確。",
      D: "長期成本常被低估，納入評估才不會高估效益，敘述正確。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Incorrect Statement",
      concepts: ["導入策略", "瓶頸", "總持有成本"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      crossNode: "A1.2",
      decisionBoundary:
        "若把選項 C 改成「AI 需搭配流程調整與足夠品質的資料，才可能帶來效率提升」，四項敘述就全部成立。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q097",
    subjectId: "aiot-junior-iot",
    prompt:
      "某設備的預測性維護模型頻繁發出警報，但實際檢查多為正常，維修人員開始忽略警報。最合理的處置是下列何者？",
    choices: [
      { id: "A", text: "檢討門檻與特徵、以實際維修結果回饋校正，並依嚴重度分級發送" },
      { id: "B", text: "直接關閉所有警報" },
      { id: "C", text: "要求維修人員每次都必須到場檢查" },
      { id: "D", text: "把警報改成更醒目的紅色" },
    ],
    answer: "A",
    explanation:
      "警報疲勞的根因是誤報率太高。用實際檢修結果回饋調整門檻與特徵，並讓低嚴重度的訊息不要以同等強度打擾人員，才能讓警報重新被信任。",
    choiceExplanations: {
      B: "全部關閉會連真正的故障預警一併失去，風險比誤報更高。",
      C: "強制到場只是增加人力負擔，誤報率不變，疲勞感只會更重。",
      D: "改變顏色不影響誤報率，人員很快會對紅色同樣麻木。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["警報疲勞", "誤報率", "回饋校正"],
      constraints: ["quality", "cost", "human_factors"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      crossNode: "A3.1",
      decisionBoundary:
        "若該設備一旦故障會造成人員危險，提高門檻減少誤報就必須非常保守——安全情境下寧可承受誤報也不能放過漏報。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q098",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司規劃 AIoT 導入的推進方式。下列策略何者風險最低且最易累積經驗？",
    choices: [
      { id: "A", text: "一次在所有廠區同步全面導入" },
      { id: "B", text: "先在單一產線試點、驗證效益後再逐步擴展到全廠" },
      { id: "C", text: "先採購全部硬體再思考應用場景" },
      { id: "D", text: "等到技術完全成熟後才開始評估" },
    ],
    answer: "B",
    explanation:
      "試點把風險與投資限制在可控範圍，同時產出真實的效益數據與踩過的坑，讓後續擴展有依據。這也是取得內部支持最有效的方式。",
    choiceExplanations: {
      A: "全面同步導入把所有風險集中在一次，任何設計失誤都會放大到全公司規模。",
      C: "先買硬體再找場景，往往買到用不上的設備，也讓需求被既有採購綁死。",
      D: "無限期等待會錯失學習曲線與競爭時機，且技術不會有「完全成熟」的一天。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Best Engineering Decision",
      concepts: ["試點", "分階段導入", "風險控制"],
      constraints: ["cost", "risk_priority"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "A1.2",
      decisionBoundary:
        "若試點成功後遲遲不擴展，效益會停在單線規模而無法攤提平台投資——試點的意義在於後續複製，不是停在試點。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q099",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線的不良率長期維持在 3%，經分析主因集中在兩種缺陷型態。下列做法最符合「以資料驅動改善」的精神？",
    choices: [
      { id: "A", text: "以柏拉圖分析找出主要缺陷，追查其製程參數並針對性改善後追蹤成效" },
      { id: "B", text: "全面提高所有工站的檢驗頻率" },
      { id: "C", text: "把不良品重工後併入良品計算，讓數字變好看" },
      { id: "D", text: "要求作業員更加專心" },
    ],
    answer: "A",
    explanation:
      "少數缺陷型態往往占了多數不良。鎖定它們、回頭找對應的製程參數並驗證改善效果，才能把有限資源用在影響最大的地方，而且成效可被量測。",
    choiceExplanations: {
      B: "提高檢驗只是更早發現不良，不會減少不良的產生，還增加成本。",
      C: "更改計算方式是掩蓋問題，實際的重工成本與客戶風險並未消失。",
      D: "訴諸個人努力無法系統性解決製程問題，也無從追蹤與複製。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["柏拉圖分析", "根因分析", "資料驅動改善"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "A2.2",
      decisionBoundary:
        "若各種缺陷型態的比例相當平均，柏拉圖就找不出重點，改善方向應轉為檢視共通的製程能力或量測系統本身。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q100",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工廠評估在產線上加裝上千個感測器。從成本效益角度，最合理的做法是下列何者？",
    choices: [
      { id: "A", text: "只裝最便宜的感測器以壓低預算" },
      { id: "B", text: "一次裝滿所有可能的量測點，日後再決定用途" },
      { id: "C", text: "完全不裝，改以人工每小時記錄一次" },
      { id: "D", text: "先依改善目標篩選出關鍵量測點，分批加裝並驗證每批的效益" },
    ],
    answer: "D",
    explanation:
      "感測器的成本不只在採購，還包含布線、維護、資料儲存與後續處理。從要改善的指標倒推需要哪些量測點，才能避免收集了大量無人使用的資料。",
    choiceExplanations: {
      A: "只看單價可能買到精度或耐用度不足的感測器，資料不可信反而讓整個專案失效。",
      B: "先裝滿再想用途會產生大量無用資料與持續的維護負擔，且初期投資無法回收。",
      C: "人工每小時一次的解析度過低，也無法即時反應，難以支撐流程改善。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Constraint Change",
      concepts: ["感測器布建", "成本效益", "目標倒推"],
      constraints: ["cost", "data_volume", "maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "B2.1",
      decisionBoundary:
        "若目的是為日後尚未確定的 AI 應用預留資料基礎，適度的「多裝一些」是有意義的投資，但仍應以資料保存成本設下上限。",
    },
  },
];
