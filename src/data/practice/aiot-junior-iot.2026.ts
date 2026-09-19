import type { Question } from "../types";

/**
 * AIoT 考科二新題庫的第二批（q101–q160，每個評鑑內容節點各 10 題），2026-09-19 命製。
 *
 * 與第一批（`aiot-junior-iot.ts`，q001–q100）同一套規格（`docs/question-authoring.md`），
 * 情境偏向 2026 年的整合現況：安全 PLC 與邊緣 AI 的分工、時間同步、憑證到期與輪替、
 * IEC 62443 區域與通道、漏洞回應與軟體物料清單、邊緣去識別化、磷酸鐵鋰與 IP 等級、
 * 裝置影子的設定管理、基礎設施即程式碼、碳足跡計量、期望成本的維護決策等。
 *
 * 獨立成檔的理由與考科一第二批相同：讓 rebalance 只對本批執行。
 *
 * ⚠️ 考科二沒有官方學習指引也沒有公告真題，內容為 LLM 命製、未經人工事實查核。
 */
export const practiceQuestions: Question[] = [
  // ── B1.1 系統元件與架構（10 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q101",
    subjectId: "aiot-junior-iot",
    prompt:
      "某射出成型廠要導入「模具溫度異常即時停機」與「每日能耗報表」兩項功能。廠內已有 PLC 控制各機台，對外網路偶有中斷。下列元件配置何者最合理？",
    choices: [
      { id: "A", text: "兩項功能都寫在 PLC 裡，不依賴任何外部系統" },
      { id: "B", text: "兩項功能都放在雲端平台，以便統一維護與更新" },
      { id: "C", text: "停機判斷寫在 PLC 或現場邊緣控制器，能耗彙整放在雲端平台" },
      { id: "D", text: "停機判斷放在雲端，能耗報表寫在 PLC 裡" },
    ],
    answer: "C",
    explanation:
      "停機牽涉安全與即時性，且網路會中斷，判斷必須在現場的 PLC 或邊緣控制器完成；能耗報表是非即時的彙整分析，放在雲端可跨機台統計且不受現場資源限制。依「延遲與可用性需求」分配功能位置是架構設計的基本原則。",
    choiceExplanations: {
      A: "PLC 的記憶體與運算適合控制邏輯，跨機台的每日報表需要歷史資料庫與統計，塞進 PLC 既困難又難維護。",
      B: "網路中斷時雲端無法下達停機指令，模具會持續在異常溫度下運作，安全功能不能依賴對外網路。",
      D: "分配顛倒：安全停機放在延遲不確定的雲端、報表放在資源有限的 PLC，兩邊都不合適。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["功能分層", "PLC", "邊緣控制", "雲端分析"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若廠內部署了穩定的私有網路與本地伺服器，能耗彙整也可以留在廠內；但只要功能攸關安全，判斷位置就不會往雲端移。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q102",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的邊緣 AI 檢測站需在每件產品通過的 300 毫秒內完成影像判斷，並把結果寫回 PLC 決定分流。工程師規劃的資料流為「攝影機 → 邊緣主機推論 → MQTT Broker（雲端）→ PLC」。此設計最主要的問題是下列何者？",
    choices: [
      { id: "A", text: "攝影機不應直接連到邊緣主機，應先經過交換器" },
      { id: "B", text: "判斷結果繞經雲端再回 PLC，延遲與可用性無法保證" },
      { id: "C", text: "邊緣主機不能執行推論，應交由雲端 GPU" },
      { id: "D", text: "PLC 無法接收任何外部系統送來的訊號" },
    ],
    answer: "B",
    explanation:
      "推論已在現場完成，結果卻要上雲端再下來，每次多出網路往返且斷網就無法分流。300 毫秒的節拍要求結果應以現場的工業協定（如 OPC UA、Modbus TCP 或數位輸出）直接送到 PLC，雲端只收檢測紀錄。",
    choiceExplanations: {
      A: "攝影機直連邊緣主機正是低延遲推論的正確配置，不是問題所在。",
      C: "邊緣主機執行推論是此架構的核心，也是符合節拍的關鍵。",
      D: "PLC 本來就能透過數位輸入或工業協定接收外部訊號。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料流設計", "延遲", "邊緣推論", "現場整合"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若 Broker 部署在廠內的邊緣伺服器且網路為有線區域網路，經 Broker 轉送的延遲可降到毫秒級，此設計就可以接受。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q103",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠有 30 台不同年份的機台，新機台支援 OPC UA，舊機台只有 RS-485 Modbus，還有幾台只有指示燈與電流錶。系統整合的目標是全部機台的稼動狀態都能進入同一個監控平台。下列整合策略何者最完整？",
    choices: [
      { id: "A", text: "新機台接 OPC UA，舊機台經閘道器，無介面者外掛感測" },
      { id: "B", text: "只接有標準介面的新機台，舊機台等汰換後再納入" },
      { id: "C", text: "為每台機台各買一套獨立的監控軟體與看板" },
      { id: "D", text: "所有機台都改裝新的控制器，統一成同一種介面" },
    ],
    answer: "A",
    explanation:
      "異質機台整合要分層處理：有標準介面的直接接、有舊協定的用閘道器轉、完全沒有介面的以非侵入式外掛感測（電流鉤表、光感測讀指示燈）推估運轉狀態。這樣才能在不改動機台的前提下覆蓋全部設備。",
    choiceExplanations: {
      B: "只接新機台無法達成「全部機台」的目標，舊機台往往是稼動率最需要掌握的。",
      C: "各買各的軟體會產生數十個孤島，資料無法在同一平台比較，正是要避免的結果。",
      D: "改裝控制器成本極高、牽涉停機與安規重新驗證，多數老機台也沒有必要。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["異質設備整合", "閘道器", "非侵入式感測", "稼動監控"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "B2.1",
      decisionBoundary:
        "若無介面的機台只有兩三台且即將報廢，外掛感測的投資可以省略，改以人工回報過渡；整合的深度要與設備的剩餘壽命相稱。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q104",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統要對全廠 200 台設備的事件做精確的先後排序，用於分析連鎖跳機的根因。各設備自行打時間戳，但事後發現時間戳彼此相差數秒。下列架構補強何者最直接？",
    choices: [
      { id: "A", text: "要求操作員在事件發生時手動記錄時間" },
      { id: "B", text: "改由平台在收到訊息時打時間戳，覆蓋裝置的時間" },
      { id: "C", text: "把事件的上傳頻率提高，縮小時間誤差" },
      { id: "D", text: "在廠內建置時間同步服務，所有設備與閘道器對其校時" },
    ],
    answer: "D",
    explanation:
      "分析先後關係需要所有裝置共用同一時間基準。廠內部署 NTP（毫秒級）或 PTP（微秒級）時間伺服器，讓所有設備與閘道器定期校時，事件的時間戳才能互相比較；這是分散式系統做因果分析的前提。",
    choiceExplanations: {
      A: "人工記錄的精度以分鐘計，且無法覆蓋 200 台設備的每個事件。",
      B: "平台收到的時間包含各裝置不同的網路延遲與緩衝，順序可能與實際發生順序不同，無法用於根因分析。",
      C: "上傳頻率不會讓各裝置的時鐘一致，時間戳仍然錯開。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時間同步", "NTP", "PTP", "事件排序"],
      constraints: ["accuracy", "scale"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Layer Confusion",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若只需要知道事件發生在哪一分鐘、不必排序毫秒級的先後，各裝置定期向網際網路 NTP 校時就已足夠，廠內時間伺服器可以省略。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q105",
    subjectId: "aiot-junior-iot",
    prompt:
      "某養殖場的水質監控系統由「感測器 → 控制器 → 4G 路由器 → 雲端 → 手機 App」組成。場主要求「即使 4G 中斷，增氧機仍要依溶氧自動啟停，且中斷期間的資料事後要能補上」。下列元件的職責配置何者符合要求？",
    choices: [
      { id: "A", text: "控制器負責本地啟停邏輯與資料暫存，連線恢復後補傳" },
      { id: "B", text: "雲端負責啟停邏輯，控制器只轉送資料" },
      { id: "C", text: "手機 App 負責啟停邏輯，控制器只執行指令" },
      { id: "D", text: "4G 路由器負責啟停邏輯並直接驅動增氧機" },
    ],
    answer: "A",
    explanation:
      "斷網仍要控制，邏輯就必須在現場控制器；斷網期間資料要補上，控制器就要有本地儲存與重送。這是「本地自治加事後同步」的標準模式，雲端與 App 只負責監看、設定與歷史分析。",
    choiceExplanations: {
      B: "雲端邏輯在 4G 中斷時完全失效，增氧機不會動作，魚群會缺氧。",
      C: "App 依賴網路與使用者的手機在線，既不可靠也不即時。",
      D: "路由器是網路設備，不具備讀取感測器與控制設備的能力。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["本地自治", "離線緩衝", "元件職責", "斷網韌性"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若場區有雙路網路且允許短暫失控，把邏輯集中在雲端可簡化多場區的維護；但養殖的缺氧後果嚴重，實務上仍會保留本地邏輯。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q106",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於在工廠導入邊緣 AI 主機時，「安全 PLC」與「一般邊緣主機」的職責分工，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "人身安全相關的緊急停機應由安全 PLC 依安規實作，不交給 AI 主機" },
      { id: "B", text: "AI 主機可提供品質判斷與預測結果，透過標準介面通知控制系統" },
      { id: "C", text: "AI 模型的準確率夠高時，可以直接取代安全 PLC 的功能" },
      { id: "D", text: "AI 主機的軟體更新不應影響安全迴路的運作" },
    ],
    answer: "C",
    explanation:
      "安全功能有明確的安規等級要求（如 SIL、PL），需要確定性、可驗證的邏輯與經認證的硬體；AI 模型是機率性的，準確率再高也不符合安規的可驗證性，只能作為輔助訊號。其餘三項是正確的分工原則。",
    choiceExplanations: {
      A: "緊急停機由安全 PLC 依安規實作是不可妥協的原則，敘述正確。",
      B: "AI 主機提供判斷結果並經標準介面通知控制系統，是典型的整合方式，敘述正確。",
      D: "AI 主機與安全迴路解耦，更新時不影響安全功能，是正確的設計要求。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["安全 PLC", "功能安全", "AI 輔助", "職責分離"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Partial Truth",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若 AI 的判斷只影響品質分流而不涉及人身安全，它可以直接驅動分流機構；分工的界線在於「失效會不會傷人」。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q107",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司要為 12 個分散的太陽能電站建置監控，每站有逆變器、電表與氣象感測器。總部要看全部電站的即時發電與歷史效率，各站也要能在網路不佳時獨立記錄。下列架構何者最合理？",
    choices: [
      { id: "A", text: "每個逆變器與感測器各自直接連到總部平台" },
      { id: "B", text: "每站一台邊緣閘道器彙整並暫存，經網路上傳到總部的中央平台" },
      { id: "C", text: "每站各自架設獨立的完整平台，總部逐站登入查看" },
      { id: "D", text: "總部派人每週到各站抄錄數據" },
    ],
    answer: "B",
    explanation:
      "分站彙整、中央統一的「邊緣加中央」架構：站內閘道器整合逆變器、電表與感測器的不同協定，網路不佳時本地暫存，恢復後上傳；總部平台則做跨站比較與歷史分析。這是多場域監控的標準拓樸。",
    choiceExplanations: {
      A: "每個裝置各自連外會讓連線數暴增、協定各異，且網路不佳時沒有任何暫存機制。",
      C: "12 套獨立平台讓總部無法做跨站比較，維護成本也是 12 倍。",
      D: "人工抄錄無法提供即時發電資料，也不可能取得逆變器的細部參數。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["多場域架構", "邊緣閘道器", "中央平台", "離線暫存"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若各站都有穩定的光纖且裝置本身支援直接上雲的標準協定，閘道器可以簡化為純網路設備；但協定整合與暫存的需求通常仍讓它有存在價值。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q108",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的監控系統規劃書寫著：「所有機台資料經閘道器上傳雲端，雲端每 10 分鐘計算一次 OEE 並回傳看板」。品保反映他們需要「機台一停就立刻在看板上看到原因」。此需求衝突最應如何解決？",
    choices: [
      { id: "A", text: "廠內增設即時事件通道推送停機事件，OEE 維持批次計算" },
      { id: "B", text: "把雲端的 OEE 計算週期縮短到每秒重算一次" },
      { id: "C", text: "取消 OEE 計算，看板只顯示各機台的即時狀態" },
      { id: "D", text: "告訴品保 10 分鐘的延遲已經足夠，不需調整" },
    ],
    answer: "A",
    explanation:
      "「即時事件」與「週期統計」是兩種不同性質的資料流：停機事件應走低延遲的推送通道（如廠內 MQTT），OEE 這類聚合指標批次計算即可。把兩者分開設計，既滿足即時需求又不讓統計負載拖累事件路徑。",
    choiceExplanations: {
      B: "每秒重算全廠 OEE 是巨大的浪費，且雲端往返的延遲仍在，事件的即時性沒有真正解決。",
      C: "OEE 是管理層需要的指標，取消它是犧牲一個需求換另一個。",
      D: "品保的需求是合理的，停機原因延遲 10 分鐘才顯示會錯過現場處置的黃金時間。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["事件流與批次", "即時推送", "OEE", "資料流分離"],
      constraints: ["latency", "cost"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      crossNode: "B2.3",
      decisionBoundary:
        "若廠內只有三台機台且停機極少，把計算週期縮到一分鐘可能就能兩者兼顧；資料流分離的價值隨規模與事件頻率上升。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q109",
    subjectId: "aiot-junior-iot",
    prompt:
      "在物聯網系統中，「閘道器」與「訊息代理（Broker）」的職責差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "閘道器負責儲存歷史資料，Broker 負責控制致動器" },
      { id: "B", text: "兩者是同一種設備的不同名稱" },
      { id: "C", text: "閘道器在現場橋接協定與網路，Broker 在後端分發訊息給訂閱者" },
      { id: "D", text: "Broker 必須安裝在每一個感測節點上" },
    ],
    answer: "C",
    explanation:
      "閘道器位於現場邊界，把 Modbus、Zigbee 等現場協定轉為 IP 與 MQTT 等網路協定；Broker 位於後端（或邊緣伺服器），依主題把訊息分發給訂閱者。兩者常一起出現但職責不同，閘道器也可以內建一個本地 Broker。",
    choiceExplanations: {
      A: "歷史資料由資料庫儲存、致動器由控制器驅動，這兩項都不是閘道器與 Broker 的主要職責。",
      B: "兩者的位置與功能不同，閘道器可以不含 Broker，Broker 也可以獨立部署於雲端。",
      D: "Broker 是集中式的分發點，安裝在每個節點上既無必要也違背發布訂閱的設計。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Concept Boundary",
      concepts: ["閘道器", "訊息代理", "協定橋接", "發布訂閱"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若現場裝置本身就以 MQTT 直接連線，閘道器的協定轉換角色消失，剩下的可能只是網路路由與本地緩衝。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q110",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的機聯網系統上線後，工程師想知道「若某台邊緣閘道器故障，會影響哪些機台與哪些下游功能」。下列文件何者最能直接回答？",
    choices: [
      { id: "A", text: "模型訓練的準確率報告與驗證紀錄" },
      { id: "B", text: "各感測器與閘道器的採購規格書" },
      { id: "C", text: "平台的使用者操作手冊與教育訓練教材" },
      { id: "D", text: "標示元件連接關係與資料流向的系統架構圖" },
    ],
    answer: "D",
    explanation:
      "影響範圍分析需要知道元件之間的依賴：哪些機台接在這台閘道器、閘道器的資料流向哪些服務。這正是系統架構圖（含資料流）的用途，也是它必須在建置時就維護、上線後持續更新的理由。",
    choiceExplanations: {
      A: "模型準確率與系統元件的故障影響範圍無關。",
      B: "規格書描述單一感測器的性能，看不出它接在哪台閘道器、影響哪些功能。",
      C: "操作手冊教使用者怎麼用平台，不描述底層元件的依賴關係。",
    },
    topic: "B1.1 系統元件與架構",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["系統架構圖", "依賴關係", "影響分析", "文件管理"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若系統只有一台閘道器與三台機台，影響範圍一目了然，架構圖的價值在元件數量與依賴複雜到無法靠記憶時才顯現。",
    },
  },
  // ── B1.2 簡易系統故障問題判斷與排除（10 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q111",
    subjectId: "aiot-junior-iot",
    prompt:
      "某批裝置在某天凌晨起全部無法連上雲端平台，裝置日誌顯示「憑證驗證失敗」，網路 ping 與 DNS 都正常，平台端沒有任何變更。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "裝置的 IP 位址被 DHCP 重新分配" },
      { id: "B", text: "裝置端的憑證或平台的根憑證在該時刻到期" },
      { id: "C", text: "MQTT 主題名稱被改動" },
      { id: "D", text: "感測器的校正值過期" },
    ],
    answer: "B",
    explanation:
      "整批裝置在同一時刻開始失敗、錯誤明確指向憑證驗證、網路層正常，最典型的原因是憑證到期：不論是裝置憑證、中繼憑證或平台的根憑證，到期時間一到，TLS 交握就會全部失敗。處置是換發憑證並建立到期監控。",
    choiceExplanations: {
      A: "IP 變動不會造成憑證驗證錯誤，且 ping 正常表示網路連通。",
      C: "主題名稱錯誤會發生在連線成功之後的發布或訂閱階段，不會出現憑證驗證失敗。",
      D: "感測器校正與 TLS 連線完全無關。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["憑證到期", "TLS", "同時失效", "日誌判讀"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      crossNode: "B1.3",
      decisionBoundary:
        "若裝置的系統時間因 RTC 電池耗盡而重設到 2000 年，也會出現憑證「尚未生效」的驗證錯誤，此時要先檢查裝置時間而非換發憑證。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q112",
    subjectId: "aiot-junior-iot",
    prompt:
      "某戶外閘道器每到中午前後就與平台斷線十幾分鐘，其餘時段正常，日誌顯示斷線前 CPU 溫度持續上升。最合理的判讀與處置是下列何者？",
    choices: [
      { id: "A", text: "機箱在日照下過熱觸發保護或降頻，應改善散熱或遮陽" },
      { id: "B", text: "平台在中午有排程維護，應更改平台排程" },
      { id: "C", text: "裝置的憑證在中午到期，應換發憑證" },
      { id: "D", text: "MQTT 保活間隔太長，應縮短" },
    ],
    answer: "A",
    explanation:
      "故障與時段強相關、且伴隨溫度上升的證據，指向環境熱負載：戶外機箱在正午日照下內部溫度超過元件規格，觸發過熱保護或無線模組降頻。處置是加裝遮陽、改善通風或改用工業溫度等級的設備。",
    choiceExplanations: {
      B: "平台維護會影響所有裝置而非單一戶外閘道器，且與溫度上升的證據無關。",
      C: "憑證到期是一次性且永久的失敗，不會每天中午重複發生又自行恢復。",
      D: "保活設定的問題會隨機出現，不會固定在正午且與溫度同步。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["環境因素", "過熱保護", "時間相關故障", "證據推理"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Correct in Different Context",
        D: "Layer Confusion",
      },
      crossNode: "B2.1",
      decisionBoundary:
        "若斷線與溫度無關、但與附近某台設備的啟動時間吻合，焦點就轉向電磁干擾或供電瞬降，處置變成隔離與濾波。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q113",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠新增第二台 MQTT 裝置後，兩台裝置開始輪流斷線又重連，Broker 日誌顯示「用戶端識別碼已在使用中」。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "兩台裝置的用戶端識別碼相同，Broker 依規範踢掉舊連線" },
      { id: "B", text: "Broker 的最大連線數上限太低，新連線被拒絕" },
      { id: "C", text: "兩台裝置的 IP 位址重複，造成封包互相干擾" },
      { id: "D", text: "訂閱的主題含萬用字元，兩台裝置互相收到對方訊息" },
    ],
    answer: "A",
    explanation:
      "MQTT 規範要求用戶端識別碼在 Broker 上唯一，新連線若使用已存在的識別碼，Broker 會中斷舊連線；兩台裝置若複製了同一份設定，就會互相踢掉、無限輪替。處置是讓識別碼包含序號或 MAC 位址。",
    choiceExplanations: {
      B: "連線數上限會讓新連線被拒絕，而不是舊連線被踢掉，日誌訊息也不同。",
      C: "IP 重複的症狀是網路層時通時不通，不會出現 Broker 的識別碼衝突訊息。",
      D: "主題萬用字元只影響收到哪些訊息，不會造成連線被中斷。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["MQTT 用戶端識別碼", "設定複製", "連線互踢"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若 Broker 日誌顯示的是「認證失敗」而非識別碼衝突，問題就轉向帳號或憑證，而不是識別碼唯一性。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q114",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的 Wi-Fi 感測節點在搬到新廠房後，訊號強度顯示良好，但資料常延遲數秒到數十秒才抵達，偶爾整批遺失。工程師發現新廠房同一頻道上有數十個鄰近網路。最可能的原因與處置是下列何者？",
    choices: [
      { id: "A", text: "節點的天線損壞，應更換天線" },
      { id: "B", text: "同頻道擁塞造成重傳與等待，應改用較空閒的頻道或 5 GHz 頻段" },
      { id: "C", text: "節點的 MQTT QoS 太低，應改為 QoS 2" },
      { id: "D", text: "平台的資料庫寫入太慢，應擴充資料庫" },
    ],
    answer: "B",
    explanation:
      "訊號強度良好但延遲與遺失嚴重，是「有訊號但擠不進去」的頻道擁塞：Wi-Fi 的載波感測機制讓節點在頻道忙碌時必須等待，碰撞後重傳。頻譜掃描確認後，改用干擾少的頻道或 5 GHz 頻段是直接的處置。",
    choiceExplanations: {
      A: "天線損壞會表現為訊號強度低，題幹明說強度良好。",
      C: "QoS 是應用層的送達保證，無線層擁塞時提高 QoS 只會產生更多重傳，延遲更長。",
      D: "資料庫瓶頸會影響所有來源的資料，不會只在搬到新廠房後出現於 Wi-Fi 節點。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["Wi-Fi 頻道擁塞", "訊號強度與吞吐", "頻譜掃描"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若頻譜掃描顯示頻道空閒但延遲依舊，問題就轉向基地台的負載或有線回程，處置變成檢查基地台與交換器。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q115",
    subjectId: "aiot-junior-iot",
    prompt:
      "某台邊緣閘道器每隔約三週會自動重啟一次，重啟前的日誌顯示可用記憶體逐日下降、最後出現記憶體不足。下列處置何者最能根治？",
    choices: [
      { id: "A", text: "關閉日誌記錄以節省記憶體與儲存空間" },
      { id: "B", text: "設定每週自動重啟一次，避免撐到記憶體耗盡" },
      { id: "C", text: "把閘道器的記憶體加倍，延長發作的間隔" },
      { id: "D", text: "找出持續增長的程序並修正其資源未釋放的問題" },
    ],
    answer: "D",
    explanation:
      "記憶體隨時間單調增長直到耗盡，是資源洩漏的典型特徵；根治的方法是找出洩漏的程序（如未關閉的連線、無限增長的緩衝）並修正。定期重啟與加記憶體只是延後發作，關閉日誌更會失去除錯的證據。",
    choiceExplanations: {
      A: "日誌是找出洩漏來源的關鍵證據，關閉它讓問題更難診斷，節省的記憶體也微不足道。",
      B: "定期重啟是掩蓋症狀，每次重啟都會造成短暫中斷，洩漏也可能因負載變化而更快發作。",
      C: "記憶體加倍只是把三週延長到六週，問題依然存在。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["記憶體洩漏", "根因修正", "症狀掩蓋"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若洩漏來自無法修改的第三方閉源元件且廠商短期無法修補，受控的定期重啟可作為暫時措施，但必須記錄為已知問題並追蹤修補。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q116",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的儀表板顯示一台機台的溫度曲線在某時刻後變成一條固定不變的直線，數值仍在正常範圍，機台實際仍在運轉。下列判斷何者最合理？",
    choices: [
      { id: "A", text: "儀表板的縱軸縮放比例設定錯誤，看不出變化" },
      { id: "B", text: "機台溫度真的完全不變，系統顯示正常" },
      { id: "C", text: "感測器或讀取程式已停止更新，畫面顯示的是最後一筆舊值" },
      { id: "D", text: "網路頻寬不足，資料到達後被壓縮成常數" },
    ],
    answer: "C",
    explanation:
      "運轉中的機台溫度不可能毫無波動，數值「凍結」在正常範圍是最容易被忽略的故障：感測器斷線、讀取程式當掉或閘道器重送舊值，都會讓畫面持續顯示最後一筆資料。良好的設計會標示資料的時間戳與「陳舊」狀態。",
    choiceExplanations: {
      A: "縮放錯誤會讓曲線看起來很平但仍有微幅變化，不會是完全不變的常數。",
      B: "實體溫度必有微小波動，完全的直線是資料層的問題而不是物理現象。",
      D: "頻寬不足會造成資料延遲或缺漏，畫面上會出現斷點而不是持續的固定值。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料陳舊", "凍結值", "資料新鮮度", "監控盲點"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        D: "Neighbor Concept",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若儀表板同時顯示該筆資料的時間戳且時間戳仍在更新，那就是感測器本身輸出卡住（如 ADC 飽和或感測器故障），排查方向從軟體轉向硬體。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q117",
    subjectId: "aiot-junior-iot",
    prompt:
      "某系統的告警規則為「溫度超過 80 度即發告警」。上線後每天收到上百則告警，多數是溫度在 79 至 81 度之間來回跳動造成的。下列調整何者最直接有效？",
    choices: [
      { id: "A", text: "把告警改為每天彙整一次，以摘要郵件寄出" },
      { id: "B", text: "把門檻提高到 100 度，只在真正嚴重時才通知" },
      { id: "C", text: "關閉這條告警，改由值班人員定時查看曲線" },
      { id: "D", text: "加入遲滯與持續時間條件，越界持續一段時間才告警" },
    ],
    answer: "D",
    explanation:
      "單一門檻在訊號於門檻附近震盪時會反覆觸發與解除，這是告警抖動。加入遲滯（觸發與解除用不同門檻）與持續時間條件，能濾掉短暫的越界，只保留真正的異常，是告警設計的基本做法。",
    choiceExplanations: {
      A: "每天彙整讓真正的緊急異常延遲一整天才被看到，喪失告警的即時意義。",
      B: "門檻提高到 100 度會讓真正需要注意的 85 度異常完全不再被通知，等於放棄監控。",
      C: "關閉告警是放棄監控，問題被隱藏而非解決。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["告警抖動", "遲滯", "持續時間條件", "告警疲勞"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若溫度一超過 80 度就會在數秒內造成損壞，持續時間條件就不能加，只能保留遲滯並搭配更快的自動處置。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q118",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠有 50 台裝置透過同一台閘道器上傳。某日起全部裝置的資料時間戳都比實際晚了整整 8 小時，資料內容正確。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "感測器的取樣週期被設成 8 小時一次" },
      { id: "B", text: "網路延遲在該日之後增加到 8 小時" },
      { id: "C", text: "時區設定被改動，本地時間被當成 UTC 處理" },
      { id: "D", text: "資料庫的儲存空間不足，寫入被延後" },
    ],
    answer: "C",
    explanation:
      "整批資料一致偏移固定的 8 小時（正是台灣與 UTC 的時差），內容正確，幾乎可以確定是時區處理的問題：某一端把本地時間當成 UTC 或反之。時間戳統一用 UTC 儲存、顯示時再轉換，是避免此類問題的通則。",
    choiceExplanations: {
      A: "取樣週期影響資料的間隔，不會讓所有時間戳整體平移。",
      B: "網路延遲不可能穩定為 8 小時，且延遲會讓資料晚到而不是時間戳本身錯誤。",
      D: "儲存空間不足會造成寫入失敗或資料遺失，不會改變時間戳。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["時區", "UTC", "時間戳偏移", "資料一致性"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若偏移量不是整數小時而是逐日增加的幾秒，問題就是時鐘漂移而非時區，處置變成校時而不是修改時區設定。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q119",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠在排查一台裝置間歇性斷線時，工程師同時更換了電源供應器、改了 Wi-Fi 頻道並更新韌體，之後問題消失。從故障排除方法的角度，此做法最主要的缺點是下列何者？",
    choices: [
      { id: "A", text: "花費的時間比逐一排查更長，影響產線" },
      { id: "B", text: "無法確定真正的原因，日後再發仍無從下手" },
      { id: "C", text: "同時更換三項零件的成本比逐一更換高" },
      { id: "D", text: "韌體更新可能引入新的資安風險與相容問題" },
    ],
    answer: "B",
    explanation:
      "一次改變多個變數雖然可能讓症狀消失，卻失去了「哪一個變更有效」的資訊。廠內同型裝置再出現問題時只能再全部換一遍。故障排除應一次只改一個變數並觀察結果，把根因記錄下來供全廠沿用。",
    choiceExplanations: {
      A: "同時處理三件事在時間上反而可能較快，時間不是這個做法的主要缺點。",
      C: "零件成本是次要考量，重點在於知識沒有累積。",
      D: "更新韌體通常是降低而非增加資安風險，與這個做法的缺點無關。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["單一變數原則", "根因分析", "知識累積"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若這台裝置是全廠唯一一台且停機損失極大，先一次全換讓它恢復、事後再在備品上逐一驗證，是可以接受的權宜之計。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q120",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台顯示一批 LoRaWAN 節點的資料到達率從 99% 降到 60%，節點電池電壓正常，閘道器在線。工程師取得每筆封包的訊號雜訊比與展頻因子後，發現到達率低的節點都位在新蓋的鐵皮倉庫後方。下列處置最合理？",
    choices: [
      { id: "A", text: "重新安裝平台軟體並重建節點清單" },
      { id: "B", text: "把所有節點的回報頻率提高以補償遺失" },
      { id: "C", text: "把節點的電池全部換新並提高發射功率" },
      { id: "D", text: "增設或搬移閘道器，補上倉庫後方的覆蓋" },
    ],
    answer: "D",
    explanation:
      "證據指向新建築造成的遮蔽：受影響的節點位置集中、訊號雜訊比下降。無線覆蓋的問題要用無線覆蓋的手段解決，增設閘道器或調整位置與天線高度，讓被遮蔽的節點重新獲得足夠的鏈路裕度。",
    choiceExplanations: {
      A: "平台軟體與特定位置節點的無線覆蓋無關。",
      B: "提高回報頻率會耗盡電池與工作週期配額，遮蔽造成的遺失比例並不會改善。",
      C: "題幹已確認電池電壓正常，更換電池沒有依據。",
    },
    topic: "B1.2 簡易系統故障問題判斷與排除",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["無線覆蓋", "遮蔽", "訊號雜訊比", "閘道器布建"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若到達率下降的節點分布隨機、與位置無關，就要轉向檢查閘道器的回傳網路或伺服器端的處理，而不是無線覆蓋。",
    },
  },
  // ── B1.3 物聯網資訊安全（10 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q121",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的 MQTT Broker 上，所有裝置都用同一組帳號、且該帳號可以發布與訂閱任何主題。資安評估指出此設計的最大風險，並建議改善。下列改善何者最符合最小權限原則？",
    choices: [
      { id: "A", text: "所有裝置改為匿名連線，以簡化憑證管理" },
      { id: "B", text: "把共用帳號的密碼改得更長並定期更換" },
      { id: "C", text: "把 Broker 的連接埠改成非標準埠並隱藏" },
      { id: "D", text: "每台裝置各有身分，並以存取清單限制其主題的發布與訂閱" },
    ],
    answer: "D",
    explanation:
      "共用帳號加全域權限意味著任何一台被入侵的裝置都能冒充其他裝置發布假資料、或訂閱全廠指令。每台裝置獨立身分加主題層級的存取控制，讓單一裝置的失守只能影響它自己的主題，是最小權限在 Broker 上的落實。",
    choiceExplanations: {
      A: "匿名連線連身分都沒有，比共用帳號更糟。",
      B: "密碼再長，只要仍是共用且全域權限，一台裝置外洩就是全廠失守。",
      C: "改埠只是隱匿，掃描工具幾分鐘就能找到，對權限問題毫無幫助。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["最小權限", "主題存取控制", "裝置身分", "MQTT 安全"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若 Broker 只在完全隔離的實驗網路且只有兩台裝置，共用帳號的風險有限；但只要接上生產網路，逐裝置身分就是必要的。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q122",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的空中韌體更新流程為：平台把韌體檔放在網頁伺服器，裝置下載後直接寫入並重啟。資安團隊指出最應優先補上的防護是下列何者？",
    choices: [
      { id: "A", text: "韌體以製造商私鑰簽章，裝置在寫入前驗證簽章與版本" },
      { id: "B", text: "把韌體檔改成壓縮格式以縮短下載時間" },
      { id: "C", text: "更新完成後自動寄送電子郵件通知管理員" },
      { id: "D", text: "把裝置的下載頻率限制為每天最多一次" },
    ],
    answer: "A",
    explanation:
      "沒有簽章驗證的更新機制，等於讓任何能把檔案放進裝置下載路徑的人都能植入惡意韌體。裝置端驗證簽章確保韌體來自製造商且未被竄改，加上版本檢查防止降級到有漏洞的舊版，是空中更新最核心的防線。",
    choiceExplanations: {
      B: "壓縮只影響檔案大小與下載時間，對真偽與完整性沒有任何保護。",
      C: "通知只是事後告知，惡意韌體已經寫入並執行了。",
      D: "頻率限制減緩不了一次成功的惡意更新。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["韌體簽章", "空中更新", "防降級", "完整性"],
      constraints: ["security", "integrity"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若裝置的開機流程已有安全開機且只接受簽章韌體，下載端的驗證仍應保留，因為它能在寫入前就擋下、避免裝置變磚後才由安全開機拒絕。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q123",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠有一台舊型 PLC 只支援無加密的 Modbus TCP，短期無法汰換，但必須被廠外的維護廠商遠端讀取。下列做法何者最能在不改動 PLC 的前提下降低風險？",
    choices: [
      { id: "A", text: "要求廠商簽署保密協定後開放全部存取" },
      { id: "B", text: "直接在防火牆上開放 PLC 的 Modbus 埠給廠商的 IP" },
      { id: "C", text: "把 PLC 放在隔離網段，廠商經 VPN 與跳板主機以唯讀方式存取" },
      { id: "D", text: "把 PLC 的 IP 改成不易猜到的位址" },
    ],
    answer: "C",
    explanation:
      "無法為協定加上安全性時，就用網路架構補償：PLC 留在隔離的控制網段，外部只能經 VPN 進入跳板主機，再由跳板以唯讀代理讀取 PLC；跳板記錄所有操作。這是 IEC 62443 區域與通道概念的實務落地。",
    choiceExplanations: {
      A: "保密協定是法律文件，擋不住廠商端被入侵或人員誤操作。",
      B: "直接開放埠讓 PLC 暴露於網際網路，IP 白名單可被偽造或因廠商端失守而失效，且無法限制只讀不寫。",
      D: "更改 IP 只是隱匿，掃描工具很快就能找到。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["補償性控制", "跳板主機", "網段隔離", "遠端維護"],
      constraints: ["security", "legacy"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若 PLC 可以升級為支援 OPC UA 安全模式的型號，協定本身就有加密與驗證，補償性控制可以簡化，但隔離網段仍是良好實務。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q124",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司的智慧門鎖產品在量產前做資安檢視，發現電路板上保留了未加保護的除錯介面，任何人拆開外殼就能讀出韌體與金鑰。下列處置何者最根本？",
    choices: [
      { id: "A", text: "量產版在出廠時鎖定除錯介面並啟用金鑰的硬體保護" },
      { id: "B", text: "在外殼接縫貼上防拆貼紙並記錄序號" },
      { id: "C", text: "在說明書上警告使用者不得自行拆開外殼" },
      { id: "D", text: "把除錯介面的接點改成不常見的規格" },
    ],
    answer: "A",
    explanation:
      "除錯介面是開發時的必要工具，但量產品必須在出廠時以熔絲或設定永久鎖定，並把金鑰放進不可讀出的安全區。物理接觸的攻擊者不會被貼紙或說明書阻止，只有硬體層的保護才算根本處置。",
    choiceExplanations: {
      B: "防拆貼紙只能事後發現被拆過，攻擊者早已把韌體與金鑰讀走。",
      C: "警語對惡意攻擊者沒有任何約束力。",
      D: "不常見的接點只是增加一點麻煩，工具與轉接板很容易取得。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["除錯介面鎖定", "硬體安全", "金鑰保護", "實體攻擊"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "B2.1",
      decisionBoundary:
        "若產品只在自家受控的廠房內使用、外人無法實體接觸，除錯介面的風險降低；但消費性產品必然離開受控環境，鎖定是必須的。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q125",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠導入 IEC 62443 的概念做風險評估，把「攻擊者從辦公網路入侵並改寫產線 PLC 參數」列為情境。下列哪一組控制措施最直接對應此情境的三個環節（進入、橫向移動、改寫）？",
    choices: [
      { id: "A", text: "只依賴員工的資安教育訓練與釣魚演練" },
      { id: "B", text: "更長的 Wi-Fi 密碼、更頻繁的備份、更大的硬碟" },
      { id: "C", text: "只依賴端點防毒軟體與定期掃描" },
      { id: "D", text: "網段間防火牆、控制網段內存取控制、PLC 寫入權限與變更記錄" },
    ],
    answer: "D",
    explanation:
      "攻擊鏈有三個環節就要有三層對應的控制：網段之間的防火牆與通道限制阻擋進入、控制網段內的身分與存取控制限制橫向移動、PLC 的寫入保護與變更記錄防止或至少偵測參數被改。這就是縱深防禦對應攻擊路徑的思維。",
    choiceExplanations: {
      A: "教育訓練降低釣魚成功率，但無法對應橫向移動與 PLC 寫入這兩個環節。",
      B: "這三項與描述的攻擊路徑無關，備份與硬碟只能在事後復原。",
      C: "防毒軟體無法安裝在 PLC 上，也擋不住合法協定的惡意寫入。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Architecture",
      concepts: ["IEC 62443", "攻擊鏈", "縱深防禦", "變更記錄"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        C: "Overgeneralization",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若辦公網路與控制網路是實體隔離、完全沒有連線，「進入」這一環節就不存在，控制措施的重心會轉向可攜式媒體與維護筆電的管控。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q126",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司收到通報：其產品使用的某開源網路函式庫有遠端執行漏洞。公司有三款產品、共十個韌體版本在市場上。下列處理順序何者最合理？",
    choices: [
      { id: "A", text: "立即對所有產品推送最新韌體，不需逐一評估影響" },
      { id: "B", text: "以物料清單定位受影響版本，評估後發布修補並通知客戶" },
      { id: "C", text: "等客戶回報實際問題後再處理，避免不必要的更新" },
      { id: "D", text: "只在公司網站公告漏洞資訊，由客戶自行決定" },
    ],
    answer: "B",
    explanation:
      "漏洞回應要有流程：先用軟體物料清單精確定位受影響的產品與版本，評估該漏洞在自家產品的可利用性與衝擊以決定優先順序，發布經測試的修補並通知客戶，最後記錄以供稽核與法規通報。這也是近年產品資安法規的要求。",
    choiceExplanations: {
      A: "未經評估與測試的全面推送可能把不相容的韌體推到不受影響的產品上，造成新的故障。",
      C: "遠端執行漏洞可能在客戶察覺前就被利用，被動等待違反製造商的責任。",
      D: "只公告不修補等於把風險留給客戶，也不符合法規對製造商的義務。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "家庭",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["漏洞回應流程", "軟體物料清單", "修補管理", "產品資安"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若漏洞需要實體接觸才能利用且產品都部署在受控環境，修補可以排入下一次例行更新；優先順序由可利用性與衝擊決定，而不是漏洞本身的嚴重度分數。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q127",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於「傳輸層加密（TLS）」在物聯網系統中能與不能防範的風險，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "TLS 可防止資料在網路傳輸途中被竊聽或竄改" },
      { id: "B", text: "啟用 TLS 後，裝置上的韌體與金鑰就不會被實體讀出" },
      { id: "C", text: "TLS 無法防止已被入侵的裝置發布假資料" },
      { id: "D", text: "TLS 搭配伺服器憑證驗證可防止裝置連到假冒的平台" },
    ],
    answer: "B",
    explanation:
      "TLS 保護的是「傳輸中」的資料：竊聽、竄改與假冒端點。它對裝置本身的安全（韌體被讀出、金鑰被拆解、裝置被入侵後的行為）沒有任何保護，那些屬於安全開機、硬體金鑰保護與行為監控的範圍。",
    choiceExplanations: {
      A: "機密性與完整性正是 TLS 的核心保證，敘述正確。",
      C: "被入侵的裝置仍持有合法金鑰，它發出的假資料在 TLS 看來完全合法，敘述正確。",
      D: "裝置驗證伺服器憑證可防止中間人假冒平台，若再加上用戶端憑證則可雙向驗證，敘述正確。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["TLS", "傳輸安全", "裝置安全", "防護邊界"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若系統只在完全隔離的封閉網路內運作且不擔心內部竊聽，TLS 的必要性下降，但裝置端的實體與韌體保護需求完全不變。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q128",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的 AI 品檢系統會把不良品影像上傳雲端做再訓練。影像中有時會拍到作業員的臉與工號牌。資安與法遵要求「訓練資料不得含可識別個人的資訊」。下列做法何者最直接？",
    choices: [
      { id: "A", text: "要求作業員在產線上不得露臉且收好工號牌" },
      { id: "B", text: "在雲端訓練前由人工逐張檢查並刪除有人的影像" },
      { id: "C", text: "在邊緣端上傳前偵測並遮蔽人臉與工號，只保留產品區" },
      { id: "D", text: "把影像解析度降到看不清人臉的程度再上傳" },
    ],
    answer: "C",
    explanation:
      "在資料離開廠區前就去除可識別資訊，是「由設計起始的隱私」與資料最小化的落實：邊緣端自動偵測人臉與工號牌區域並遮蔽、或直接裁切只保留產品區域，雲端從一開始就收不到個資。",
    choiceExplanations: {
      A: "要求作業員改變行為既不可靠也不合理，且工號牌仍可能入鏡。",
      B: "人工檢查成本高、易漏，且影像上傳到雲端時個資已經離開廠區，違反了要求的時間點。",
      D: "降低解析度會同時毀掉產品瑕疵的細節，讓再訓練失去意義。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["隱私設計", "邊緣去識別化", "資料最小化", "AI 訓練資料"],
      constraints: ["privacy", "regulation"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若攝影機的取景本來就只涵蓋產品輸送帶、物理上拍不到人，遮蔽處理可以省略；設計時先從取景角度排除個資是成本最低的做法。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q129",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠計畫讓語音助理整合維修系統，維修人員可以用口語查詢並「派工」。下列哪一項設計最能防止「任何人在現場喊一句話就能派工」的濫用？",
    choices: [
      { id: "A", text: "把語音助理的收音靈敏度與音量調小" },
      { id: "B", text: "查詢可開放，會改變狀態的派工須綁定已驗證身分與權限" },
      { id: "C", text: "只在白天上班時段開放語音功能" },
      { id: "D", text: "所有動作都不需驗證，以維持現場操作的便利" },
    ],
    answer: "B",
    explanation:
      "存取控制要依動作的影響分級：唯讀查詢風險低可放寬，會改變系統狀態的派工必須確認「是誰」以及「他有沒有權限」，例如綁定已登入的裝置、聲紋加二次確認。這是把最小權限套用到新型介面上的方式。",
    choiceExplanations: {
      A: "音量與授權無關，任何人靠近一點照樣能下指令。",
      C: "時段限制擋不住白天的濫用，也讓夜班無法使用。",
      D: "為了便利放棄驗證，等於讓任何人都能操作維修系統。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Best Engineering Decision",
      concepts: ["存取控制", "動作分級", "身分驗證", "新型介面安全"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若派工只是建議、最終仍需主管在系統上核准，語音端的驗證可以放寬，因為狀態改變的閘門移到了核准步驟。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q130",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的資安稽核要求「事後能證明某台裝置在某時刻上傳的資料未被竄改，且確實出自該裝置」。下列機制何者最直接對應？",
    choices: [
      { id: "A", text: "裝置以對稱金鑰加密資料後再上傳" },
      { id: "B", text: "平台把資料存成唯讀檔案並定期核對" },
      { id: "C", text: "裝置以私鑰對每筆資料簽章，平台保存簽章" },
      { id: "D", text: "平台定期備份資料庫並異地保存" },
    ],
    answer: "C",
    explanation:
      "「未被竄改」需要完整性證明，「確實出自該裝置」需要來源不可否認，兩者由裝置私鑰的數位簽章同時提供：任何人都能用公鑰驗證，而只有持有私鑰的裝置能產生簽章。平台保存簽章即為稽核證據。",
    choiceExplanations: {
      A: "對稱加密提供機密性，但平台與裝置共用同一把金鑰，無法區分是誰產生的，不具不可否認性。",
      B: "唯讀只能防止平台端事後修改，無法證明資料在到達平台前沒被改、也無法證明來源。",
      D: "備份是可用性措施，與資料的完整性與來源證明無關。",
    },
    topic: "B1.3 物聯網資訊安全",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["數位簽章", "完整性", "不可否認性", "稽核證據"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若稽核只要求「資料在平台上沒被改過」而不追究來源，平台端的雜湊鏈或不可變儲存就已足夠，裝置端簽章的運算負擔可以省下。",
    },
  },
  // ── B2.1 物聯網硬體設計基礎（10 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q131",
    subjectId: "aiot-junior-iot",
    prompt:
      "某電池供電的土壤感測節點設計目標是續航兩年。工程師量得：休眠電流 15 μA、每小時喚醒一次工作 3 秒、工作電流 60 mA。忽略無線傳輸以外的細節，此設計的平均電流最接近下列何者？",
    choices: [
      { id: "A", text: "約 65 μA" },
      { id: "B", text: "約 15 μA" },
      { id: "C", text: "約 600 μA" },
      { id: "D", text: "約 60 mA" },
    ],
    answer: "A",
    explanation:
      "每小時 3,600 秒中工作 3 秒：工作的平均貢獻為 60 mA × 3 ÷ 3,600 = 50 μA，加上休眠的 15 μA，平均約 65 μA。以 2,000 mAh 電池估算約可撐 30,000 小時（三年餘），符合目標；此類計算是低功耗設計的第一步。",
    choiceExplanations: {
      B: "只算了休眠電流，忽略了每小時 3 秒 60 mA 的工作電流，其貢獻其實是休眠的三倍多。",
      C: "把工作時間誤算為 30 秒（60 mA × 30 ÷ 3,600 ≈ 500 μA）才會得到此值。",
      D: "這是工作時的瞬間電流，不是平均值；平均要依工作時間比例加權。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["平均電流", "工作週期", "休眠電流", "電池續航估算"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若回報頻率改為每分鐘一次，工作電流的貢獻變成 3 mA，休眠電流就無足輕重，此時設計重點轉為縮短每次工作的時間。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q132",
    subjectId: "aiot-junior-iot",
    prompt:
      "某戶外閘道器需在攝氏 −30 至 70 度運作、由太陽能充電、夜間靠電池供電。工程師在磷酸鐵鋰與一般鋰聚合物電池之間選擇。下列考量何者最正確？",
    choices: [
      { id: "A", text: "磷酸鐵鋰循環壽命長、熱穩定性佳，但低溫充電仍需保護" },
      { id: "B", text: "鋰聚合物能量密度高，因此在任何條件下都是較好的選擇" },
      { id: "C", text: "兩者在高溫下都完全安全，不需任何保護電路" },
      { id: "D", text: "電池種類不影響設計，只要容量夠大即可" },
    ],
    answer: "A",
    explanation:
      "戶外每日充放意味著數千次循環，磷酸鐵鋰的循環壽命與熱穩定性明顯優於一般鋰聚合物，較不易在高溫下熱失控；但兩種鋰電池在低溫充電都會析鋰損壞，保護電路仍必須依溫度限制充電。",
    choiceExplanations: {
      B: "能量密度高適合體積受限的消費性產品，戶外長期每日循環更看重壽命與熱安全，「任何條件下都較好」過於絕對。",
      C: "鋰電池在高溫下有熱失控風險，保護電路與溫度監控是必要的。",
      D: "電池化學特性決定了循環壽命、溫度範圍與安全性，容量只是其中一項。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["電池化學", "磷酸鐵鋰", "循環壽命", "溫度範圍"],
      constraints: ["environment", "lifetime", "safety"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若裝置是室內、每年才充放幾次的備援用途，能量密度與價格會成為主要考量，鋰聚合物反而合理。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q133",
    subjectId: "aiot-junior-iot",
    prompt:
      "某控制板的 MCU 以 3.3 V 供電，需要讀取一顆輸出 0 至 5 V 的類比感測器，並驅動一個 5 V 邏輯的繼電器模組。下列硬體介接何者正確？",
    choices: [
      { id: "A", text: "感測器直接接 ADC，繼電器經分壓後接 MCU" },
      { id: "B", text: "兩者都直接接到 MCU 腳位即可，不需額外電路" },
      { id: "C", text: "感測器輸出經分壓後接 ADC，繼電器模組經位準轉換或電晶體驅動" },
      { id: "D", text: "兩者都經光耦合器隔離後直接接 MCU 腳位" },
    ],
    answer: "C",
    explanation:
      "5 V 訊號直接進 3.3 V 的 ADC 會超過絕對最大額定值而損壞腳位，需先分壓到 3.3 V 以內；反過來 3.3 V 的輸出可能不足以驅動 5 V 邏輯的繼電器模組，需用位準轉換器或電晶體開關。方向不同、處理不同。",
    choiceExplanations: {
      A: "方向顛倒：輸入需要降壓、輸出需要升壓驅動。",
      B: "5 V 直接進 3.3 V 腳位會損壞 MCU，3.3 V 也未必能可靠觸發 5 V 模組。",
      D: "隔離不是本題的需求，且光耦合器不解決類比訊號的電壓範圍問題。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["位準轉換", "分壓", "ADC 輸入範圍", "繼電器驅動"],
      constraints: ["voltage", "safety"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Overgeneralization",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若改用可容忍 5 V 輸入的 MCU 腳位且繼電器模組支援 3.3 V 觸發，兩側的轉換電路都可以省略，選型時先看規格書的電壓容忍範圍。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q134",
    subjectId: "aiot-junior-iot",
    prompt:
      "某感測節點在實驗室穩定運作，裝到工廠的馬達旁後，讀值偶爾出現無法解釋的尖峰，且 MCU 偶爾當機。電路板上未做任何抗干擾設計。下列改善組合何者最對症？",
    choices: [
      { id: "A", text: "電源與訊號線加濾波與保護、感測線改屏蔽雙絞、啟用看門狗" },
      { id: "B", text: "把 MCU 的時脈調快以縮短每次處理的時間" },
      { id: "C", text: "把感測器的取樣頻率降低，減少讀到尖峰的機會" },
      { id: "D", text: "改用更大容量的電池，讓供電更穩定" },
    ],
    answer: "A",
    explanation:
      "馬達的電磁干擾與電源瞬變會耦合進訊號線與電源，造成尖峰與當機。對症的做法是三層：電源與訊號端加濾波與瞬態抑制、訊號線屏蔽並雙絞以抵消耦合、看門狗在當機時自動復位。這是工業環境硬體設計的基本功。",
    choiceExplanations: {
      B: "時脈快慢與干擾耦合無關，甚至可能讓 MCU 更敏感。",
      C: "降低取樣頻率只是少看到幾次尖峰，干擾與當機的根源仍在。",
      D: "電池容量與電磁干擾無關。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["電磁干擾", "濾波", "屏蔽雙絞線", "看門狗"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若尖峰只出現在某條特定的感測線而 MCU 從不當機，問題可能只是該線的接地迴路，把單端訊號改成差動量測就能解決，不必全面補強。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q135",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於 MCU 的「看門狗計時器」，下列敘述何者正確？",
    choices: [
      { id: "A", text: "它會在程式出錯時自動修正錯誤的指令" },
      { id: "B", text: "它負責量測外部事件之間的時間間隔" },
      { id: "C", text: "它是讓 MCU 進入低功耗休眠並定時喚醒的計時器" },
      { id: "D", text: "程式必須定期重設它，若逾時未重設，硬體會自動重新啟動 MCU" },
    ],
    answer: "D",
    explanation:
      "看門狗是一個獨立倒數的硬體計時器：正常運作的程式會在逾時前定期「餵狗」重設它；若程式當機或陷入死迴圈而未重設，計時器歸零時會強制重啟 MCU，讓無人值守的裝置能自我復原。",
    choiceExplanations: {
      A: "看門狗無法理解或修正程式邏輯，它只能在偵測到停止回應時重啟。",
      B: "量測外部事件間隔是一般計時器或輸入捕捉功能的工作。",
      C: "喚醒休眠的是即時時鐘或低功耗計時器，看門狗的目的是偵測當機。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["看門狗計時器", "自我復原", "無人值守"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若裝置有人隨時看顧、當機時可手動重啟，看門狗的價值有限；它的意義在於部署在無人可及的位置。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q136",
    subjectId: "aiot-junior-iot",
    prompt:
      "某工程師為一顆 MCU 選擇外部記憶體：需求是「儲存每 10 秒一筆、保存 30 天的量測紀錄，斷電不遺失」。下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "Flash 或 EEPROM 這類非揮發性記憶體斷電後資料仍在，適合此需求" },
      { id: "B", text: "只要容量夠，Flash 可以無限次覆寫同一個位址而不損壞" },
      { id: "C", text: "Flash 有寫入次數限制，設計時應以磨損平均或循環寫入分散壽命" },
      { id: "D", text: "RAM 速度快但斷電即失，不適合作為主要儲存" },
    ],
    answer: "B",
    explanation:
      "Flash 每個區塊的抹寫次數有限（常見為數萬到十萬次），反覆寫同一位址會提早損壞。每 10 秒一筆、30 天約 26 萬筆，若都寫在同一區塊會很快超過壽命，必須用循環緩衝或磨損平均把寫入分散。其餘三項是正確的記憶體常識。",
    choiceExplanations: {
      A: "非揮發性記憶體斷電保存資料，是紀錄儲存的正確選擇，敘述正確。",
      C: "磨損平均與循環寫入正是因應 Flash 抹寫壽命的標準做法，敘述正確。",
      D: "RAM 揮發的特性讓它只適合暫存，敘述正確。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["非揮發性記憶體", "Flash 抹寫壽命", "磨損平均", "資料記錄"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若改用 FRAM 這類抹寫次數極高的記憶體，磨損平均的顧慮幾乎消失，但單價與容量會成為新的取捨。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q137",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產品要在戶外雨淋與粉塵環境下運作，規格書要求外殼防護等級 IP67。關於此等級的意義，下列敘述何者正確？",
    choices: [
      { id: "A", text: "數字越小防護越好，IP67 低於 IP54" },
      { id: "B", text: "可長時間在水下運作，適合水底感測器" },
      { id: "C", text: "只能防潑水與少量粉塵，不能防塵" },
      { id: "D", text: "完全防塵，且可短時間浸入水中 1 公尺深而不進水" },
    ],
    answer: "D",
    explanation:
      "IP 等級的第一位數字是防固體與粉塵（6 為完全防塵），第二位是防水（7 為可浸入 1 公尺水深 30 分鐘）。IP67 因此表示完全防塵且可短時浸水，是戶外裝置常見的要求；長時間水下運作需要 IP68。",
    choiceExplanations: {
      A: "IP 等級的數字越大代表防護越嚴格。",
      B: "長時間或更深的浸水屬於 IP68，IP67 只保證短時間浸入 1 公尺。",
      C: "第二位 7 遠高於潑水等級（4），第一位 6 是完全防塵，敘述與定義相反。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["IP 防護等級", "外殼設計", "戶外環境"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若裝置只裝在有遮蔽的機櫃內，IP54 可能已足夠，過高的防護等級會增加散熱困難與成本。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q138",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司要把驗證過的原型板量產 5,000 片。原型使用開發板加杜邦線，供電來自 USB。下列量產前的硬體工作何者最關鍵？",
    choices: [
      { id: "A", text: "採購 5,000 片相同的開發板與杜邦線，直接組裝" },
      { id: "B", text: "重新設計專用 PCB 並整合電源與保護，再做環境與電磁相容測試" },
      { id: "C", text: "只把外殼做得更漂亮並印上公司商標" },
      { id: "D", text: "把韌體加密後直接出貨，硬體維持原型" },
    ],
    answer: "B",
    explanation:
      "原型驗證的是功能，量產要驗證的是可靠度、成本與法規：專用 PCB 消除接觸不良、整合穩壓與保護、選用可靠的連接器，並通過溫度、震動與電磁相容測試。跳過這一步的量產品在現場的故障率會遠高於實驗室。",
    choiceExplanations: {
      A: "開發板與杜邦線的接觸可靠度與抗震能力都不適合現場長期使用，成本也偏高。",
      C: "外殼是必要的，但電氣與可靠度設計沒做好，外殼再漂亮也會故障。",
      D: "韌體保護是必要工作之一，但不能取代硬體本身的量產設計。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Best Engineering Decision",
      concepts: ["原型到量產", "PCB 設計", "可靠度測試", "電磁相容"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若只需要 20 台供內部試用且環境受控，用開發板加客製擴充板是可接受的過渡做法，專用 PCB 的投資可等需求確認後再做。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q139",
    subjectId: "aiot-junior-iot",
    prompt:
      "某節點以 MCU 內建的 NPU 執行振動異常判斷，並在異常時才啟動無線模組上傳。與「持續上傳原始資料、雲端判斷」相比，此設計在硬體資源上最主要的取捨是下列何者？",
    choices: [
      { id: "A", text: "節點的記憶體需求會降低，可選更小的 MCU" },
      { id: "B", text: "本地判斷一定比雲端判斷更準確、更穩定" },
      { id: "C", text: "節點不再需要任何無線模組，可完全離線" },
      { id: "D", text: "以較多的本地運算與韌體複雜度，換取大幅降低的無線功耗與頻寬" },
    ],
    answer: "D",
    explanation:
      "無線傳輸通常是電池節點最大的耗電來源，把判斷放在節點上讓無線模組大部分時間關閉，代價是要在 MCU 上放模型、管理推論與更新，韌體更複雜、記憶體需求更高。這是端側智慧的核心取捨。",
    choiceExplanations: {
      A: "本地要放模型與推論緩衝，記憶體需求是上升而非下降。",
      B: "雲端可用更大的模型與更多上下文，準確度未必輸；本地判斷的優勢是功耗、延遲與離線可用，不是準確度。",
      C: "異常時仍要上傳，無線模組不可少，只是使用時間縮短。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["端側推論", "NPU", "無線功耗", "韌體複雜度"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若節點有市電且網路頻寬充裕，持續上傳原始資料讓雲端保有完整波形以供再訓練，反而是更有價值的設計。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q140",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的 24 V 直流電源同時供給 PLC、感測器與一台大電流的電磁閥。電磁閥動作瞬間，感測器讀值會跳動、PLC 偶爾重啟。下列硬體改善何者最根本？",
    choices: [
      { id: "A", text: "把感測器的取樣平均次數增加以濾掉跳動" },
      { id: "B", text: "把電磁閥的動作頻率降低，減少瞬變發生次數" },
      { id: "C", text: "電磁閥改由獨立電源，並加續流二極體與儲能電容" },
      { id: "D", text: "把 PLC 的程式掃描週期拉長以避開瞬變" },
    ],
    answer: "C",
    explanation:
      "電感性負載切換會在共用電源上產生電壓瞬降與反電動勢尖峰，讓同一電源上的敏感裝置誤動作或重啟。根本解法是把高瞬變負載與敏感負載的電源分開，並在負載端加續流二極體與儲能電容吸收瞬變。",
    choiceExplanations: {
      A: "平均可以濾掉部分跳動，但無法阻止 PLC 因電源瞬降而重啟。",
      B: "降低頻率只是減少發生次數，每次動作仍會造成瞬變。",
      D: "掃描週期與電源瞬變無關，拉長只會讓控制變慢。",
    },
    topic: "B2.1 物聯網硬體設計基礎",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["電源瞬變", "電感性負載", "續流二極體", "電源分離"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Layer Confusion",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若電源供應器的容量遠大於總負載且線路極短，瞬變可能小到不影響其他裝置；問題的嚴重度取決於電源的內阻與負載的比例。",
    },
  },
  // ── B2.2 雲端環境數據收集與平台設計（10 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q141",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台的裝置因網路不穩會重送訊息，導致同一筆量測被寫入資料庫多次，日報表的用電量因而偏高。下列平台端設計何者最能根本避免？",
    choices: [
      { id: "A", text: "報表計算時把總量依估計的重複比例扣除" },
      { id: "B", text: "要求裝置在網路不穩時不要重送，避免重複" },
      { id: "C", text: "每筆訊息帶唯一識別碼，寫入時依識別碼去重" },
      { id: "D", text: "把資料庫換成更大的機器以吸收重複寫入" },
    ],
    answer: "C",
    explanation:
      "網路不穩時重送是必要的，問題在於平台端沒有冪等處理。讓每筆訊息帶裝置序號加序號或時間戳組成的唯一鍵，寫入時「相同鍵只保留一筆」，重送幾次都只會有一筆紀錄。這是資料管線的基本設計。",
    choiceExplanations: {
      A: "重複的比例不固定，除以二只是猜測，報表仍然不準。",
      B: "不重送會讓網路不穩時的資料直接遺失，用電量會偏低，問題只是換了方向。",
      D: "機器大小與重複寫入無關。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "易",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["冪等性", "去重", "唯一識別碼", "重送"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若訊息協定本身提供恰好一次的送達保證且端到端都支援，平台端的去重可以簡化；但跨越多個系統邊界時，應用層的唯一鍵仍是最可靠的防線。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q142",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台保存 3,000 台設備每秒一筆的感測資料。分析團隊表示：近一個月的資料需要秒級細節，一年內的只需分鐘級趨勢，更久的只需每日統計。從儲存成本與查詢效率的角度，下列策略何者最合理？",
    choices: [
      { id: "A", text: "所有資料永久以原始解析度存在高效能資料庫中" },
      { id: "B", text: "依資料年齡分層，舊資料降採樣後移到較便宜的儲存層" },
      { id: "C", text: "只保留最近一個月的資料，超過即刪除" },
      { id: "D", text: "所有資料都只存每日統計值，不留原始資料" },
    ],
    answer: "B",
    explanation:
      "資料的價值密度隨時間下降，儲存策略應跟著分層：近期原始資料放在高效能的時序資料庫，超過期限就降採樣成分鐘級、日級並移到物件儲存等低成本層。這種保留策略同時控制成本又保住分析所需的粒度。",
    choiceExplanations: {
      A: "3,000 台每秒一筆，一年近千億筆，全部以原始解析度放在高效能資料庫的成本無法接受，且大部分永遠不會被查。",
      C: "一年內的趨勢分析與長期比較會全部失去依據。",
      D: "近一個月需要秒級細節的需求會被犧牲，異常事件的細節無法回溯。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料分層", "降採樣", "保留策略", "儲存成本"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若法規要求原始資料保存七年（如某些醫療或金融場景），降採樣就不能取代原始資料，只能把原始資料移到冷儲存而不刪除。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q143",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於「串流處理」與「批次處理」在物聯網平台上的分工，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "採用串流處理後，批次處理就完全沒有存在的必要" },
      { id: "B", text: "批次處理適合週期性的大量彙整，例如日報與模型再訓練" },
      { id: "C", text: "同一個平台可以同時採用兩者，各自負責不同時效的需求" },
      { id: "D", text: "串流處理適合在資料到達時即刻計算，例如即時告警與滑動視窗統計" },
    ],
    answer: "A",
    explanation:
      "兩者解決的問題不同：串流處理的強項是低延遲的逐筆或視窗計算，批次處理的強項是對大量歷史資料做完整、可重算的分析（如再訓練、月結）。多數平台兩者並存，各司其職，串流並不能取代批次。",
    choiceExplanations: {
      B: "日報與再訓練需要完整的歷史資料集，批次處理最合適，敘述正確。",
      C: "兩者並存、依時效需求分工，是實務上的常態，敘述正確。",
      D: "即時告警與滑動視窗統計正是串流處理的典型用途，敘述正確。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["串流處理", "批次處理", "時效需求", "資料架構"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若平台的所有需求都是秒級即時且不需要歷史重算，批次處理的比重可以極低，但模型再訓練與稽核報表幾乎總會把它帶回來。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q144",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司同時在三家公有雲上有物聯網服務，維運團隊反映每次新增環境都要手動點選數十個設定，且三家的設定常不一致。下列做法何者最能改善？",
    choices: [
      { id: "A", text: "以基礎設施即程式碼描述環境並自動化部署" },
      { id: "B", text: "寫一份更詳細、逐步截圖的操作手冊" },
      { id: "C", text: "只保留一家雲端，其餘全部下線" },
      { id: "D", text: "指派專人負責記住並執行所有設定" },
    ],
    answer: "A",
    explanation:
      "基礎設施即程式碼把網路、資料庫、訊息服務等資源以宣告式檔案描述，同一份定義可重複部署到多個環境，差異一目了然、變更可審查、可回滾。它是消除手動設定漂移與跨環境不一致的標準做法。",
    choiceExplanations: {
      B: "手冊仍是人工操作，錯誤與不一致的根源沒有消除。",
      C: "收斂到單一雲端可能有其他理由，但題幹的問題是手動設定，換成單一雲端仍會有手動漂移。",
      D: "依賴個人記憶是最脆弱的做法，人員異動時知識就流失。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["基礎設施即程式碼", "設定漂移", "自動化部署", "多雲"],
      constraints: ["maintainability", "consistency"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若只有一個環境且一年才改一次設定，手動操作加上詳細紀錄可能足夠；自動化的投資在環境數與變更頻率增加時才回收。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q145",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台把設備資料提供給 AI 團隊訓練預測模型。AI 團隊發現三成的紀錄缺少「設備型號」欄位，且部分溫度值單位混用攝氏與華氏。從平台設計的角度，這類問題最應在哪個環節防堵？",
    choices: [
      { id: "A", text: "在感測器上貼標籤註明單位與型號" },
      { id: "B", text: "AI 團隊訓練前自行清理並記錄清理規則" },
      { id: "C", text: "儀表板顯示時依裝置型號做單位轉換" },
      { id: "D", text: "在資料進入平台的驗證與標準化層攔下不符綱要的資料" },
    ],
    answer: "D",
    explanation:
      "資料品質問題越早攔截成本越低。平台的接收層應依綱要驗證必填欄位、統一單位與型別，不合格的資料標記或退回。若讓每個下游各自清理，同樣的錯誤會被修很多次且修法不一，資料契約也無從建立。",
    choiceExplanations: {
      A: "實體標籤不會改變上傳的數值，平台仍收到混用的單位。",
      B: "下游各自清理是重複勞動，且不同團隊可能用不同規則修正，結果彼此不一致。",
      C: "儀表板只是眾多消費者之一，其他系統與模型仍拿到髒資料。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料驗證", "綱要", "單位標準化", "資料品質"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Layer Confusion",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若資料來源是無法改動的第三方系統且格式已知固定，在接收層做一次性的轉換對照即可，不必建立完整的綱要治理。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q146",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台要對 5 萬台裝置下達「更新回報間隔」的設定，其中約三成裝置當下離線。下列平台機制何者能確保離線裝置上線後也能套用新設定？",
    choices: [
      { id: "A", text: "等所有裝置都上線後再一次發送" },
      { id: "B", text: "對每台裝置直接發送一次指令，失敗即略過" },
      { id: "C", text: "在儀表板上提醒維運人員手動重送" },
      { id: "D", text: "把設定寫入每台裝置的期望狀態，裝置連線時比對並套用" },
    ],
    answer: "D",
    explanation:
      "裝置影子（或稱數位孿生的狀態部分）把「平台希望的設定」與「裝置回報的設定」分開保存；平台只需更新期望狀態，裝置上線時讀取差異並套用、再回報，離線與否都不影響最終一致。這是大規模裝置設定管理的標準模式。",
    choiceExplanations: {
      A: "五萬台裝置不可能同時在線，這一天永遠不會到來。",
      B: "離線裝置的指令會遺失，三成裝置永遠不會拿到新設定。",
      C: "五萬台的規模下靠人工重送不可行，也無法確保完整。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "能源",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["裝置影子", "期望狀態", "最終一致", "設定管理"],
      constraints: ["scale", "availability"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若指令是一次性的動作（例如「現在拍一張照」）而非持久的設定，影子的期望狀態就不適用，應改用帶過期時間的指令佇列。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q147",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台團隊比較「自建 MQTT Broker 與時序資料庫」與「使用雲端受管的物聯網服務」。下列評估何者最正確？",
    choices: [
      { id: "A", text: "自建在任何規模下都比受管服務便宜且更安全" },
      { id: "B", text: "受管服務降低維運負擔，但需接受功能邊界與鎖定風險" },
      { id: "C", text: "受管服務不需要使用者做任何資安設定" },
      { id: "D", text: "自建與受管的差別只在管理介面的外觀" },
    ],
    answer: "B",
    explanation:
      "受管服務把高可用、擴展、修補等維運工作交給供應商，小團隊能專注在應用；代價是功能受限於供應商提供的範圍、資料與介面與該平台耦合，日後遷移成本高。自建則相反：彈性最大但維運與人力成本要自己扛。",
    choiceExplanations: {
      A: "自建要算入硬體、人力、備援與修補的總成本，小規模時通常比受管服務貴；只有在大規模且有專職團隊時才可能反轉。",
      C: "受管服務仍需使用者設定身分、權限與網路存取，共同責任模型下資安不會自動完成。",
      D: "兩者在維運責任、擴展方式與鎖定風險上差異巨大，不只是介面。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Comparison",
      concepts: ["受管服務", "自建", "供應商鎖定", "維運成本"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      crossNode: "B2.3",
      decisionBoundary:
        "若法規要求資料與服務都必須落在自家機房、且已有成熟的維運團隊，自建就成為唯一或最合理的選擇，受管服務的便利性不再是決定因素。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q148",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台在裝置數從 2,000 台成長到 20,000 台後，訊息接收服務的延遲從毫秒級升到數秒。經查單一接收服務的 CPU 已滿載。下列擴展做法何者最符合水平擴展的原則？",
    choices: [
      { id: "A", text: "部署多個接收服務實例，以負載平衡或分割區把裝置分散到各實例" },
      { id: "B", text: "把單一接收服務搬到 CPU 核心數更多的機器" },
      { id: "C", text: "要求裝置降低上傳頻率以減少接收負載" },
      { id: "D", text: "把接收服務的逾時時間拉長以容忍延遲" },
    ],
    answer: "A",
    explanation:
      "水平擴展是增加實例數量並把負載分散，容量可隨裝置數線性成長且單一實例故障不影響整體；前提是服務為無狀態或依分割區設計。垂直擴展（換更大的機器）有上限且仍是單點。",
    choiceExplanations: {
      B: "這是垂直擴展，有硬體上限、成本非線性上升，且仍是單點故障。",
      C: "降低上傳頻率是犧牲資料換取容量，不是擴展。",
      D: "拉長逾時只是讓延遲被容忍，服務的處理能力沒有增加。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["水平擴展", "垂直擴展", "負載平衡", "分割區"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若接收服務有無法拆分的狀態（例如必須依序處理同一裝置的訊息），就要先依裝置做分割區再水平擴展，否則單純加實例會破壞順序。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q149",
    subjectId: "aiot-junior-iot",
    prompt:
      "某平台團隊要為「裝置停止上傳」建立監控。裝置正常時每 5 分鐘上傳一次。下列告警設計何者最合理？",
    choices: [
      { id: "A", text: "每收到一筆資料就發一則通知給維運人員" },
      { id: "B", text: "以每台裝置的最後上傳時間為依據，逾 15 分鐘即告警" },
      { id: "C", text: "只監控平台的接收服務是否在線與 CPU 負載" },
      { id: "D", text: "每週由維運人員人工檢查一次裝置清單" },
    ],
    answer: "B",
    explanation:
      "「沒有資料進來」本身不會產生任何事件，所以要用「最後上傳時間」這種存活訊號來偵測：門檻設為正常週期的兩三倍（15 分鐘）以容忍偶發延遲，逐台判斷才能指出是哪些裝置停了。",
    choiceExplanations: {
      A: "每筆都通知是資料流而不是告警，收到資料時反而代表正常。",
      C: "平台在線不代表裝置在上傳，裝置端或網路的問題完全看不到。",
      D: "每週檢查一次會讓裝置停擺長達一週才被發現。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["存活監控", "最後上傳時間", "缺席偵測", "告警設計"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.2",
      decisionBoundary:
        "若裝置是事件驅動、平常本來就可能數天不上傳，就要改讓裝置定期送心跳訊息，再以心跳的缺席作為告警依據。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q150",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於在平台上以「事件驅動」方式整合裝置資料與業務系統，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "事件驅動只適用於低頻、少量的資料" },
      { id: "B", text: "事件驅動要求所有消費者必須同步回應後才能繼續" },
      { id: "C", text: "生產者發布事件後不需知道消費者，新增消費者不必改生產者" },
      { id: "D", text: "事件驅動架構不需要任何訊息中介或串流平台" },
    ],
    answer: "C",
    explanation:
      "事件驅動的核心是解耦：裝置或服務把「發生了什麼」發布到事件通道，感興趣的消費者各自訂閱，生產者不需知道消費者的存在。新增報表、告警或 AI 分析只要再訂閱一次，不必回頭改裝置端。",
    choiceExplanations: {
      A: "事件串流平台每秒可處理數十萬則事件，高頻正是它的強項。",
      B: "事件驅動是非同步的，生產者發布後即可繼續，不等待消費者回應。",
      D: "解耦通常靠訊息中介或事件串流平台實現，直接呼叫就不是事件驅動了。",
    },
    topic: "B2.2 雲端環境數據收集與平台設計",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["事件驅動架構", "解耦", "發布訂閱", "非同步"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若某個流程必須立刻得到結果才能繼續（例如付款確認），同步的請求回應反而更合適，事件驅動不是所有整合的唯一答案。",
    },
  },
  // ── B2.3 智慧製造流程優化與成本控制（10 題）───────────────────────────────
  {
    id: "aiot-junior-iot-practice-q151",
    subjectId: "aiot-junior-iot",
    prompt:
      "某產線導入設備感測後量得：一班 8 小時中計畫停機 40 分鐘、非計畫停機 50 分鐘；理論節拍每件 30 秒，實際產出 700 件；其中 14 件不良。此設備的 OEE 最接近下列何者？",
    choices: [
      { id: "A", text: "約 68%" },
      { id: "B", text: "約 88%" },
      { id: "C", text: "約 78%" },
      { id: "D", text: "約 93%" },
    ],
    answer: "C",
    explanation:
      "計畫生產時間 480 − 40 = 440 分鐘，運轉時間 440 − 50 = 390 分鐘，時間稼動率 390 ÷ 440 ≈ 88.6%；性能效率 = 700 件 × 0.5 分鐘 ÷ 390 分鐘 ≈ 89.7%；良品率 = 686 ÷ 700 = 98%。OEE ≈ 0.886 × 0.897 × 0.98 ≈ 77.9%。",
    choiceExplanations: {
      A: "約 68% 是把計畫停機也算成損失（390 ÷ 480 ≈ 81%）再乘上其他兩項的結果，計畫停機不應扣在稼動率裡。",
      B: "約 88% 是時間稼動率單獨的數值，漏乘了性能效率與良品率。",
      D: "約 93% 大致是三項中最高的兩項相乘，遺漏了最低的一項。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["OEE", "時間稼動率", "性能效率", "良品率"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若廠內把換模時間視為非計畫停機而非計畫停機，時間稼動率的分母與分子都會改變，同一組資料算出的 OEE 就不同；比較 OEE 前要先統一定義。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q152",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠評估兩個 AIoT 專案：甲、預測性維護，一次性投資 200 萬、每年節省 120 萬；乙、能源管理，一次性投資 80 萬、每年節省 30 萬。若只看簡易投資回收期，且公司要求回收期不得超過兩年，下列判斷何者正確？",
    choices: [
      { id: "A", text: "兩者回收期都超過兩年，皆不符合要求" },
      { id: "B", text: "乙投資較少，因此回收期一定較短" },
      { id: "C", text: "甲約 1.7 年符合要求，乙約 2.7 年不符合" },
      { id: "D", text: "兩者回收期都在兩年內，皆符合要求" },
    ],
    answer: "C",
    explanation:
      "簡易回收期 = 投資 ÷ 每年節省：甲為 200 ÷ 120 ≈ 1.67 年，乙為 80 ÷ 30 ≈ 2.67 年。投資金額小不代表回收快，關鍵是投資與年效益的比例。當然，回收期只是初步篩選，還應看整體壽命內的淨效益。",
    choiceExplanations: {
      A: "甲的 1.67 年在兩年內，此敘述錯誤。",
      B: "回收期看的是投資與年節省的比值，乙的年節省太少，回收反而慢。",
      D: "乙的 2.67 年超過兩年，此敘述錯誤。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["投資回收期", "投資評估", "年效益"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把設備壽命納入（例如甲的效益只持續三年、乙可持續十年），乙的總淨效益 220 萬會超過甲的 160 萬，用淨現值評估時結論可能反轉。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q153",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠導入 AIoT 後，設備稼動率從 70% 提升到 85%，但月產出幾乎沒有增加。經查該設備的下游工站產能本來就只夠消化 72% 稼動率的產出。此現象最貼切的解讀是下列何者？",
    choices: [
      { id: "A", text: "感測資料有誤，稼動率其實沒有真的提升" },
      { id: "B", text: "改善了非瓶頸工站，整線產出仍受下游瓶頸限制" },
      { id: "C", text: "AIoT 對製造業沒有效益，應停止投資" },
      { id: "D", text: "應繼續提升該設備的稼動率到 100%" },
    ],
    answer: "B",
    explanation:
      "整線的產出由瓶頸決定。在非瓶頸工站提升稼動率只會在瓶頸前堆積在製品，產出不會增加。限制理論的做法是先找出瓶頸、讓它滿載、再讓其他工站配合，導入資源應投向下游的瓶頸工站。",
    choiceExplanations: {
      A: "稼動率提升是真的，只是提升在錯的地方，資料沒有問題。",
      C: "效益的缺乏來自投錯位置，不是技術無效；同樣的技術用在瓶頸上就會有效。",
      D: "非瓶頸工站再提升也只是製造更多在製品庫存，反而增加成本。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["瓶頸", "限制理論", "整線產出", "在製品"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若下游工站同時被擴充到能消化 90% 的產出，該設備就會成為新的瓶頸，先前的稼動率提升才會轉化為產出增加。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q154",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠要向客戶提供產品碳足跡，並依碳費制度盤查廠內排放。下列 AIoT 的應用方式何者最直接支援此需求？",
    choices: [
      { id: "A", text: "由供應商提供的估計值直接填報並存檔" },
      { id: "B", text: "在廠區周邊種樹並用攝影機計算樹木數量" },
      { id: "C", text: "只用每月的總電費反推全廠的碳排放量" },
      { id: "D", text: "以設備級電表與流量計按工單分攤能耗，換算成排放量" },
    ],
    answer: "D",
    explanation:
      "產品碳足跡需要把能耗分攤到產品或工單層級，這要靠設備級的電表與流量計即時計量，再依排放係數換算；碳盤查也要求可稽核的計量依據。AIoT 的價值正是把「全廠一張電費單」變成可追溯到每件產品的排放資料。",
    choiceExplanations: {
      A: "供應商估計值不是實測，稽核時缺乏依據，也無法反映自家製程的改善。",
      B: "種樹屬於抵換措施，與計量廠內實際排放無關。",
      C: "總電費只能給出全廠的粗估，無法分攤到產品，也無法辨識哪些設備是排放熱點。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["碳足跡", "能耗分攤", "碳盤查", "設備級計量"],
      constraints: ["regulation", "traceability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Layer Confusion",
        C: "Partial Truth",
      },
      crossNode: "B2.2",
      decisionBoundary:
        "若客戶只要求廠級的年度排放總量，總電費乘上排放係數已經足夠，設備級計量的投資可以延後到需要產品級數據時。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q155",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的 AI 瑕疵檢測模型上線後，品保統計：每 1,000 件中把 30 件良品誤判為不良（需人工複檢）、把 2 件不良誤判為良品（流到客戶端）。已知一次人工複檢成本 50 元、一件不良品流出的平均損失 20,000 元。下列調整方向何者最合理？",
    choices: [
      { id: "A", text: "調整判定門檻讓模型更傾向判為不良，接受複檢增加以換取流出減少" },
      { id: "B", text: "調整門檻讓模型更傾向判為良品，以減少複檢人力" },
      { id: "C", text: "維持現狀，因為誤判率已經很低" },
      { id: "D", text: "停用 AI 檢測改回全人工" },
    ],
    answer: "A",
    explanation:
      "每千件的成本：複檢 30 × 50 = 1,500 元，流出 2 × 20,000 = 40,000 元，流出的損失遠大於複檢。把門檻往「寧可多判不良」移動，即使複檢增加到數百件（成本數萬元）也可能換得流出降到零，總成本更低。門檻的設定應依兩種錯誤的成本比例決定。",
    choiceExplanations: {
      B: "減少複檢只省下千元級的成本，卻會讓流出增加，每多一件就多兩萬元的損失。",
      C: "誤判率低不等於成本低，2 件流出的損失是複檢成本的 27 倍，仍有明顯的改善空間。",
      D: "全人工的漏檢率通常不低於 AI，且成本更高，問題只是門檻設定而非 AI 本身。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["誤判成本", "判定門檻", "漏檢與誤報", "成本導向調校"],
      constraints: ["cost", "quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若產品單價極低、流出的損失只有數十元，複檢成本就會主導，門檻應反過來往減少誤報的方向調整。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q156",
    subjectId: "aiot-junior-iot",
    prompt:
      "關於 AIoT 導入專案的「總持有成本」，下列敘述何者「不」正確？",
    choices: [
      { id: "A", text: "除了硬體與軟體採購，還應計入整合、訓練、維運與汰換的成本" },
      { id: "B", text: "雲端服務的月費與資料傳輸費屬於持續性成本，應以專案壽命累計" },
      { id: "C", text: "感測器與電池的定期更換是常被低估的長期成本" },
      { id: "D", text: "總持有成本只需計算第一年的支出" },
    ],
    answer: "D",
    explanation:
      "總持有成本涵蓋專案整個壽命期間的一次性與持續性支出：採購、整合、訓練、雲端費用、維護、耗材更換與最終汰換。只看第一年會嚴重低估雲端月費與耗材這類累積型成本，導致投資評估失真。其餘三項都是正確的成本項目。",
    choiceExplanations: {
      A: "整合與維運常占總成本的大宗，必須納入，敘述正確。",
      B: "雲端費用隨時間與資料量累積，應以壽命期累計，敘述正確。",
      C: "感測器老化與電池更換是現場常見卻在規劃時被忽略的成本，敘述正確。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Incorrect Statement",
      concepts: ["總持有成本", "持續性成本", "投資評估"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若專案本身就設計為一年期的試點且之後會全面重建，以一年為評估期是合理的，但這應明確寫在評估假設裡。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q157",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠計畫用歷史製程資料建立數位分身，在導入新排程前先模擬對交期與能耗的影響。下列哪一項是讓模擬結果「可信」的最關鍵前提？",
    choices: [
      { id: "A", text: "先以過去實際發生的情境驗證，誤差在可接受範圍" },
      { id: "B", text: "分身的 3D 動畫流暢美觀，主管一看就懂" },
      { id: "C", text: "分身由知名供應商建置並附完整的操作訓練" },
      { id: "D", text: "模擬時納入的參數越多越好，越接近真實" },
    ],
    answer: "A",
    explanation:
      "模擬模型的可信度來自驗證：拿過去已知結果的情境輸入分身，比較模擬產出與實際紀錄，誤差在可接受範圍才能相信它對未知情境的預測。未經驗證的分身，模擬結果再精美也只是猜測。",
    choiceExplanations: {
      B: "視覺呈現與預測準確度無關。",
      C: "供應商的名氣不能取代對自家製程的驗證。",
      D: "參數多不等於準確，未經驗證的參數只會增加不確定性。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["數位分身", "模型驗證", "模擬可信度"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若分身只用來做視覺化的教育訓練而非決策，驗證的嚴謹度可以降低；驗證的深度應與決策的風險相稱。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q158",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠的預測性維護系統建議「軸承 A 在未來兩週內有 80% 的機率失效」。維修主管有兩個選擇：立即安排停機更換（停機成本 5 萬、零件 2 萬），或等到失效再修（預估非計畫停機損失 40 萬、零件 2 萬）。以期望成本比較，下列判斷何者正確？",
    choices: [
      { id: "A", text: "等待失效的期望成本較低，應等到失效再修" },
      { id: "B", text: "立即更換期望成本 7 萬，低於等待的 34 萬，應立即更換" },
      { id: "C", text: "兩者期望成本相同，可依維修人力安排決定" },
      { id: "D", text: "機率 80% 不到 100%，因此不應更換" },
    ],
    answer: "B",
    explanation:
      "立即更換的成本確定為 5 + 2 = 7 萬。等待的期望成本 = 0.8 × (40 + 2) = 33.6 萬（若不失效則暫無成本）。即使有兩成機率白等，期望值仍是 7 萬對 33.6 萬，應立即更換。預測性維護的價值就在於把機率轉成可比較的期望成本。",
    choiceExplanations: {
      A: "等待的期望成本 33.6 萬遠高於 7 萬，方向相反。",
      C: "兩者相差近五倍，並不相同。",
      D: "決策看的是期望成本而非機率是否達到 100%，80% 的失效機率乘上 42 萬的損失已遠超更換成本。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["期望成本", "預測性維護決策", "非計畫停機"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若失效機率只有 10%，等待的期望成本降到 4.2 萬、低於立即更換的 7 萬，決策就會反轉；門檻機率約在 17% 附近。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q159",
    subjectId: "aiot-junior-iot",
    prompt:
      "某公司同時規劃在五條產線全面導入 AIoT，或先在一條產線試點三個月再決定。從專案風險與成本控制的角度，下列評估何者最正確？",
    choices: [
      { id: "A", text: "試點應該做到完美再擴展，不論花多久" },
      { id: "B", text: "全面導入一定比較省，因為可以一次議價" },
      { id: "C", text: "試點沒有意義，因為每條產線都不一樣" },
      { id: "D", text: "先試點以較小投入驗證假設與整合難度，再決定擴展範圍" },
    ],
    answer: "D",
    explanation:
      "試點把不確定性最高的部分（資料品質、整合難度、實際效益）先以小規模驗證，失敗的代價有限，成功的經驗可複製。全面導入若假設錯誤，五條產線的損失同時發生。這是分階段投資控制風險的基本邏輯。",
    choiceExplanations: {
      A: "試點的目的是學習而非完美，拖太久會失去時效與組織動能，應設定明確的驗證目標與期限。",
      B: "議價的折扣遠小於假設錯誤時五倍規模的損失，且試點後仍可整批議價。",
      C: "產線不同正是試點要驗證的事：找出哪些做法可複製、哪些要因線調整。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["試點", "分階段投資", "專案風險", "擴展策略"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若五條產線完全相同且公司已在他廠成功導入同一方案，試點的學習價值降低，直接全面導入可以縮短時程。",
    },
  },
  {
    id: "aiot-junior-iot-practice-q160",
    subjectId: "aiot-junior-iot",
    prompt:
      "某廠導入能源管理系統後，工程師發現三台空壓機在夜間低負載時仍全部運轉，各自負載只有 30%。下列改善何者最直接降低能耗？",
    choices: [
      { id: "A", text: "在儀表板上顯示更多的能耗圖表與排名" },
      { id: "B", text: "把三台空壓機全部換成更大的機型" },
      { id: "C", text: "依即時需求自動調度，夜間只運轉一台並讓其餘待機" },
      { id: "D", text: "把夜間的產線全部停掉" },
    ],
    answer: "C",
    explanation:
      "空壓機在低負載時效率極差，三台各 30% 的負載讓能耗遠高於一台 90% 的負載。能源管理系統的價值在於依即時需求做機組調度：夜間只開一台、需求升高再依序啟動，這是最直接、投資最小的節能措施。",
    choiceExplanations: {
      A: "圖表只是呈現，不會自動改變運轉方式，節能要靠實際的控制動作。",
      B: "換更大的機型在低負載時效率同樣差，問題在調度而不是機器大小，且投資龐大。",
      D: "停產線是犧牲產出換節能，與需求不符。",
    },
    topic: "B2.3 智慧製造流程優化與成本控制",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["能源管理", "機組調度", "部分負載效率", "節能"],
      constraints: ["energy", "cost"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "B1.1",
      decisionBoundary:
        "若夜間需求本身就接近三台的合計容量，調度沒有空間，節能就要轉向修補管路洩漏或降低系統壓力設定。",
    },
  },
];
