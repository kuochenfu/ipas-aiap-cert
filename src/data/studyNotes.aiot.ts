import type { StudyNoteSection, StudyNotesBySubject } from "./types";

/**
 * AIoT 應用工程師（初級）的備考整理。
 *
 * 來源與既有五科不同，務必分清楚：`studyNotes.ts` 是官方學習指引原文的忠實重構，
 * 本檔則是**依備考 syllabus 整理的讀書筆記**——考科一參照 2026 官方《學習指引－
 * 科目一：AIoT 基礎概論》，考科二因官方尚無同等的學習指引，以 115 年度簡章公布的
 * 能力指標與評鑑內容為骨架、再補上必要的工程知識。因此本檔的內容**不等於官方原文**，
 * 需人工複審；尤其 B2.3 的 OEE／ROI／CAPEX-OPEX 等公式屬延伸補強，
 * 官方並未明文列為必考公式。
 *
 * 排版限制：筆記以純文字條目呈現（`renderNoteItems` 會逐條 escapeHtml），
 * 因此原文的 ASCII 流程圖一律改寫為「A → B → C」的單行箭頭，
 * 數學式改寫為單行純文字（例 `Levels = 2^N`），表格則一列一條。
 */
export const aiotStudyNotes: StudyNotesBySubject = {
  "aiot-junior-basics": {
    "A1.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "AI、ML、DL 的包含關係：AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Neural Networks",
            children: [
              { text: "AI：讓機器具備分析、判斷、決策能力。" },
              { text: "ML（Machine Learning）：從資料中學習規律。" },
              { text: "DL（Deep Learning）：使用多層神經網路學習高階特徵。" },
              { text: "Training：模型學習參數。Inference：使用訓練完成的模型做判斷。" },
            ],
          },
          {
            text: "AIoT 的資料特性：高頻、時間序列、雜訊、缺失值、類別不平衡。重點不只是模型本身，而是能否部署、整合與長期維運。",
          },
          {
            text: "三大機器學習類型",
            children: [
              { text: "Supervised Learning：有 Label；典型任務為 Classification 與 Regression。" },
              { text: "Unsupervised Learning：沒有 Label；典型任務為 Clustering 與 Anomaly Detection。" },
              { text: "Reinforcement Learning：Agent 與 Environment 互動，以 Reward 調整 Policy。" },
            ],
          },
          {
            text: "Classification 輸出類別、Regression 輸出連續數值",
            children: [
              { text: "正常／異常 → Classification。" },
              { text: "判斷是哪一種 Fault → Classification。" },
              { text: "Remaining Useful Life（剩餘壽命）→ Regression。" },
              { text: "預測未來溫度 → Regression。" },
            ],
          },
          {
            text: "CNN：Convolution 擷取 Local feature，擅長影像；典型應用為 AOI 瑕疵辨識。",
          },
          {
            text: "RNN / LSTM：具 Sequence 與 Memory 機制，擅長時間序列；典型應用為馬達振動、溫度趨勢、電流波形。",
          },
          {
            text: "Edge AI 的核心理由：Low Latency、Bandwidth Efficiency、Privacy。一句話——能在現場處理的，不一定要把 Raw Data 全部送上 Cloud。",
          },
          {
            text: "Training-to-Inference Pipeline：Data Collection → Preprocessing → Model Training → Model Compression → Inference Deployment → Monitoring / Versioning",
          },
          {
            text: "Model Compression：Quantization 與 Pruning",
            children: [
              { text: "Quantization 例：FP32 → INT8。" },
              { text: "效益：Model size ↓、Memory ↓、Power ↓、Inference speed ↑。" },
              { text: "代價：Accuracy 可能稍微下降。" },
            ],
          },
          {
            text: "Edge AI 硬體分工",
            children: [
              { text: "CPU：General purpose，負責作業系統與 I/O 等通用運算。" },
              { text: "GPU：大量平行運算，適合 High throughput、Multi-camera、Large model。" },
              { text: "NPU：AI inference accelerator，適合 Matrix operations、INT8 inference、Low power。" },
              { text: "FPGA：可重新配置硬體邏輯，適合 Deterministic latency、Customized processing、工業應用。" },
            ],
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "AI = Artificial Intelligence（人工智慧）" },
          { text: "ML = Machine Learning（機器學習）" },
          { text: "DL = Deep Learning（深度學習）" },
          { text: "ANN = Artificial Neural Network（人工神經網路）" },
          { text: "CNN = Convolutional Neural Network（卷積神經網路）" },
          { text: "RNN = Recurrent Neural Network（循環神經網路）" },
          { text: "LSTM = Long Short-Term Memory（長短期記憶）" },
          { text: "RL = Reinforcement Learning（強化學習）" },
          { text: "GPU = Graphics Processing Unit（圖形處理器）" },
          { text: "NPU = Neural Processing Unit（神經網路處理器）" },
          { text: "FPGA = Field Programmable Gate Array（現場可程式化邏輯閘陣列）" },
          { text: "MCU = Microcontroller Unit（微控制器）" },
          { text: "SLM = Small Language Model（小型語言模型）" },
          { text: "FL = Federated Learning（聯合學習）" },
          { text: "XAI = Explainable AI（可解釋人工智慧）" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          {
            text: "Training vs Inference",
            children: [
              { text: "Training：找參數。" },
              { text: "Inference：用參數。" },
            ],
          },
          {
            text: "Quantization vs ADC——兩者都叫「量化」但完全不同層次",
            children: [
              { text: "Quantization：AI 模型權重 FP32 → INT8。" },
              { text: "ADC：Analog signal → Digital value。" },
            ],
          },
          {
            text: "Classification vs Regression",
            children: [
              { text: "Classification 問 What category？" },
              { text: "Regression 問 How much？" },
            ],
          },
          {
            text: "Edge Computing vs Cloud Computing",
            children: [
              { text: "Edge：latency ↓、bandwidth ↓、privacy ↑，但運算資源受限。" },
              { text: "Cloud：運算資源充足、集中管理，適合模型訓練與全域分析。" },
            ],
          },
          {
            text: "NPU vs GPU",
            children: [
              { text: "NPU 重點在 inference efficiency。" },
              { text: "GPU 重點在高度平行運算的彈性。" },
            ],
          },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "Accuracy =（TP + TN）/（TP + TN + FP + FN）" },
          {
            text: "Quantization 的直覺：FP32 為 32 bits、INT8 為 8 bits，權重儲存空間理論上約可降至 1/4。",
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "馬達振動監測：Motor Vibration Sensor → Time-series → LSTM／異常偵測模型 → Edge NPU → 判定異常 → Maintenance Alert",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "馬達連續振動資料最適合哪種模型？→ RNN / LSTM。" },
          { text: "FP32 → INT8 是什麼技術？→ Quantization。" },
          { text: "Edge AI 的主要優勢「不」包含？常見干擾項為「提高原始資料上傳量」。" },
          { text: "NPU 的主要用途？→ AI inference acceleration（不是取代 CPU 做通用運算）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          {
            text: "必讀",
            children: [
              { text: "iPAS 2026 官方科目一學習指引。" },
              { text: "Edge Impulse：Edge AI Fundamentals。" },
              { text: "ESP32 / MCU 的 Edge AI 入門案例。" },
            ],
          },
          {
            text: "延伸但初級不用深入：Transformer architecture、Backpropagation 推導、LLM 訓練細節。",
          },
        ],
      },
    ],
    "A1.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "所有 AIoT 案例都可用同一個框架拆解：Input → Transport → Process / AI → Action → Security",
          },
          {
            text: "Predictive Maintenance（PdM，預測性維護）：依實際 Condition 預測未來故障",
            children: [
              { text: "不是 Breakdown Maintenance（壞了才修）。" },
              { text: "也不是固定週期的 Periodic / Preventive Maintenance。" },
            ],
          },
          {
            text: "Diagnosis vs Prognosis",
            children: [
              { text: "Diagnosis：現在出了什麼問題？→ Classification。" },
              { text: "Prognosis：還可以撐多久？→ Regression / RUL。" },
            ],
          },
          {
            text: "Sensor Fusion：整合不同 Sensor（例如 Camera + LiDAR），目的是提升 Robustness，而非單純增加感測器數量。",
          },
          {
            text: "四大場域：Smart Factory、Smart Agriculture、Smart Transportation、Smart Home。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "AIoT = Artificial Intelligence of Things" },
          { text: "PdM = Predictive Maintenance" },
          { text: "RUL = Remaining Useful Life" },
          { text: "AOI = Automated Optical Inspection" },
          { text: "HVAC = Heating, Ventilation and Air Conditioning" },
          { text: "V2X = Vehicle-to-Everything" },
          { text: "LPWAN = Low-Power Wide-Area Network" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Preventive：定期保養。Predictive：根據 Condition 預測。" },
          { text: "Diagnosis：現在的狀態。Prognosis：未來的狀態。" },
          {
            text: "Sensor Fusion 不是「感測器越多越好」，而是取得互補資訊（complementary information）與強健性（robustness）。",
          },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "RUL 在初級只需掌握概念：Current Condition ＋ Degradation Trend → Estimated Failure Time",
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "智慧農業：Soil Moisture／Temperature／Humidity → LoRa → Gateway → Cloud → Prediction → Irrigation（自動灌溉）",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "大面積農田＋電池供電感測器＋少量資料 → LoRa / LPWAN。" },
          { text: "判斷馬達正常／異常 → Diagnosis / Classification。" },
          { text: "預估軸承還能撐 20 天 → Prognosis / Regression。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 官方四大 AIoT 應用案例。" },
          { text: "Predictive Maintenance 基本案例。" },
        ],
      },
    ],
    "A2.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "IoT 三層架構（由下而上）：Perception Layer → Network Layer → Application Layer",
            children: [
              { text: "Perception Layer：Sensor、RFID、NFC、Actuator、資料擷取。" },
              { text: "Network Layer：Connectivity、Routing、Protocol conversion、Gateway。" },
              { text: "Application Layer：Cloud、Database、AI、Dashboard、商業應用。" },
            ],
          },
          {
            text: "Gateway 的角色：Protocol Conversion ＋ Aggregation ＋ Filtering ＋ Edge Processing ＋ Security",
            children: [{ text: "典型路徑：Zigbee → Gateway → TCP/IP。" }],
          },
          {
            text: "Edge vs Gateway：一台 Gateway 可以同時是 Edge Computer，但概念不同",
            children: [
              { text: "Gateway：連接不同 Network / Protocol 的節點。" },
              { text: "Edge：在資料來源附近進行 Computing。" },
            ],
          },
          {
            text: "OSI 七層：7 Application、6 Presentation、5 Session、4 Transport、3 Network、2 Data Link、1 Physical",
          },
          { text: "TCP/IP 四層：Application、Transport、Internet、Link" },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "IoT = Internet of Things；IIoT = Industrial IoT" },
          { text: "OSI = Open Systems Interconnection" },
          { text: "TCP/IP、IP、ICMP、MAC、LAN、WAN" },
          { text: "Edge、Gateway" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          {
            text: "Switch / Router / Gateway",
            children: [
              { text: "Switch：L2，依 MAC 轉送。" },
              { text: "Router：L3，依 IP 繞送。" },
              { text: "Gateway：可做 Protocol translation 或應用層轉換。" },
            ],
          },
          { text: "L2 談 MAC 與 Frame；L3 談 IP、Packet 與 Routing。" },
          { text: "Edge 做 Local decision；Cloud 做 Centralized processing。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [{ text: "傳輸時間 T = Data Size / Data Rate" }],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "Temperature Sensor → Zigbee → Gateway → Ethernet → Cloud → Dashboard",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "IP 屬於 OSI 哪一層？→ Network Layer（L3）。" },
          { text: "TCP 屬於哪一層？→ Transport Layer（L4）。" },
          { text: "Ethernet MAC 屬於哪一層？→ Data Link（L2）。" },
          { text: "Gateway 最大作用？→ 異質 Protocol / Network 的轉換。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 官方指引的 OSI / TCP-IP 章節。" },
          { text: "Cisco Networking Basics。" },
          { text: "Cloudflare Learning：TCP/IP、DNS、HTTP 基本概念。" },
        ],
      },
    ],
    "A2.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "TCP vs UDP",
            children: [
              { text: "TCP：Connection-oriented、Reliable、Ordered、可重傳，overhead 較高。" },
              { text: "UDP：Connectionless、不保證送達、overhead 低、latency 低。" },
              { text: "直覺：需要可靠傳輸用 TCP；即時影音用 UDP。" },
            ],
          },
          {
            text: "MQTT 的運作：Publisher → Broker → Subscriber",
            children: [
              { text: "核心概念：Topic、Publish、Subscribe、Broker、QoS、Retain、Last Will。" },
              { text: "QoS 0：At most once（最多一次）。" },
              { text: "QoS 1：At least once（至少一次，可能重複）。" },
              { text: "QoS 2：Exactly once（剛好一次，成本最高）。" },
            ],
          },
          { text: "HTTP / REST 常見方法：GET、POST、PUT、DELETE。" },
          {
            text: "無線技術的取捨",
            children: [
              { text: "Wi-Fi：高頻寬、功耗較高、短中距離，適合 Camera。" },
              { text: "BLE：低功耗、短距離，適合穿戴裝置。" },
              { text: "Zigbee：低功耗、Mesh 網路，適合感測器網路。" },
              { text: "LoRa / LoRaWAN：長距離、低功耗、低資料率。" },
              { text: "NB-IoT：電信級 LPWAN，走電信業者網路，涵蓋廣、低資料率、低功耗。" },
              { text: "NFC：極短距離，通常為公分級。" },
              { text: "RFID：以無線電標籤做識別（identification）。" },
            ],
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "MQTT = Message Queuing Telemetry Transport" },
          { text: "TCP = Transmission Control Protocol" },
          { text: "UDP = User Datagram Protocol" },
          { text: "HTTP = Hypertext Transfer Protocol" },
          { text: "BLE = Bluetooth Low Energy" },
          { text: "NFC = Near Field Communication" },
          { text: "RFID = Radio Frequency Identification" },
          { text: "LPWAN = Low-Power Wide-Area Network" },
          { text: "NB-IoT = Narrowband IoT" },
          { text: "QoS = Quality of Service" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          {
            text: "MQTT vs HTTP",
            children: [
              { text: "MQTT：Publish / Subscribe、需要 Broker、事件驅動、overhead 低。" },
              { text: "HTTP：Request / Response、Web 原生、可直接做 API。" },
            ],
          },
          {
            text: "TCP vs MQTT——不是同一層的東西",
            children: [
              { text: "TCP 是 Transport protocol。" },
              { text: "MQTT 是 Application protocol，通常跑在 TCP 之上。" },
            ],
          },
          {
            text: "LoRa vs LoRaWAN",
            children: [
              { text: "LoRa：實體層的無線調變技術（Physical radio technology）。" },
              { text: "LoRaWAN：其上的網路／MAC 架構。" },
            ],
          },
          {
            text: "BLE vs Bluetooth Classic：BLE 走低功耗／感測器；Classic 走持續性、較高吞吐的應用。",
          },
          {
            text: "NFC vs RFID：NFC 距離極短且雙向互動能力較強；RFID 範圍更廣，常用於識別。",
          },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "RF Link Budget 直覺：Received Power ≈ Transmit Power ＋ Gains − Losses" },
          {
            text: "實際 Throughput 通常小於 Link Rate，受 protocol overhead、重傳與干擾影響。",
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "農業感測 → LoRa。" },
          { text: "攝影機影像 → Wi-Fi / Ethernet / 5G。" },
          { text: "穿戴裝置 → BLE。" },
          { text: "門禁刷卡 → NFC。" },
          { text: "上雲遙測 → MQTT。" },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "長距離＋低功耗＋少量感測資料 → LoRaWAN。" },
          { text: "Publish / Subscribe 模型 → MQTT。" },
          { text: "要求低延遲但不需重傳 → UDP。" },
          { text: "網頁 API → HTTP / REST。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OASIS MQTT 5.0 官方規格。" },
          { text: "LoRa Alliance：LoRaWAN overview。" },
          { text: "Bluetooth SIG：BLE overview。" },
          { text: "3GPP / GSMA：NB-IoT overview。" },
        ],
      },
    ],
    "A2.3": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "OPC UA 不能只背成一個 Protocol，它同時包含 Communication ＋ Security ＋ Information Model ＋ Semantics。",
          },
          {
            text: "典型架構：PLC → OPC UA Server → OPC UA Client → SCADA / MES / Cloud / AI",
            children: [
              { text: "Client：讀寫 Server 上的資料。" },
              { text: "Server：對外揭露 Address Space。" },
              { text: "OPC UA PubSub：Publisher → Subscriber 的發布訂閱模式。" },
            ],
          },
          {
            text: "MTConnect 專注於製造設備資料，主要元件：Device → Adapter → Agent → Application",
          },
          {
            text: "Information Model 不是只有 value = 55，而是「資料＋意義＋關聯」",
            children: [
              { text: "例：Spindle 底下有 Speed、State、Temperature 三個具語意的節點。" },
            ],
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "OPC = Open Platform Communications；OPC UA = OPC Unified Architecture" },
          { text: "MTConnect（製造設備資料標準）" },
          { text: "PLC = Programmable Logic Controller" },
          { text: "HMI = Human-Machine Interface" },
          { text: "SCADA = Supervisory Control and Data Acquisition" },
          { text: "MES = Manufacturing Execution System" },
          { text: "ERP = Enterprise Resource Planning" },
          { text: "ISA-95：企業與控制系統整合的分層標準" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "MQTT：訊息傳輸（Message transport）。" },
          {
            text: "OPC UA：工業互通性＋語意＋安全＋資訊模型（Industrial interoperability）。",
          },
          { text: "Modbus：以暫存器為導向的通訊（Register-oriented）。" },
          { text: "MTConnect：製造／工具機的資料語意與監控。" },
          { text: "一句話分野：Protocol 講「怎麼送」，Information model 講「資料代表什麼」。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [{ text: "本節點無重要公式。" }],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "多品牌整合：PLC A／PLC B／PLC C → OPC UA → MES → AI Predictive Maintenance",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "不同品牌 PLC 要整合到上層系統 → OPC UA。" },
          { text: "製造機台需要標準化資料模型 → MTConnect。" },
          { text: "OPC UA 最大價值 → Interoperability ＋ 具語意的資訊模型。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OPC Foundation：OPC UA Overview。" },
          { text: "OPC UA Part 1：Overview and Concepts。" },
          { text: "MTConnect 官方 Getting Started。" },
        ],
      },
    ],
    "A2.4": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "Middleware 是 Hardware / Device 與 Application 之間的抽象層",
            children: [
              {
                text: "核心職能：Protocol conversion、Messaging、Data normalization、API、Device management、Data storage。",
              },
            ],
          },
          { text: "MQTT Broker 常見實作：Mosquitto、EMQX。" },
          { text: "Node-RED：以流程（Flow-based）方式做整合。" },
          { text: "REST API 路徑：Client →（HTTP）→ REST API → Backend → Database" },
          {
            text: "雲端服務模型",
            children: [
              { text: "IaaS：提供 Infrastructure。" },
              { text: "PaaS：提供開發與執行的 Platform。" },
              { text: "SaaS：直接提供 Software。" },
            ],
          },
          { text: "資料格式：JSON、XML。" },
          { text: "資料庫：SQL、NoSQL、Time-series DB。" },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "API = Application Programming Interface" },
          { text: "REST = Representational State Transfer" },
          { text: "JSON = JavaScript Object Notation；XML = eXtensible Markup Language" },
          { text: "CRUD = Create / Read / Update / Delete" },
          { text: "URI = Uniform Resource Identifier" },
          { text: "IaaS / PaaS / SaaS" },
          { text: "DBMS = Database Management System" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Protocol：通訊規則。API：軟體介面。" },
          { text: "Broker：訊息路由。Gateway：網路／協定／邊緣橋接。" },
          { text: "SQL：結構化的關聯式資料。NoSQL：彈性的分散式資料結構。" },
          { text: "Cloud：集中式。Edge：本地端。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [{ text: "本節點無主要公式。" }],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "ESP32 →（MQTT）→ Mosquitto Broker → Node-RED → InfluxDB → Grafana",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "GET 對應 CRUD 的哪一項？→ Read。POST → Create。" },
          { text: "提供開發與執行環境的雲端模型？→ PaaS。" },
          { text: "負責 MQTT 訊息路由的元件？→ Broker。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "Node-RED Getting Started。" },
          { text: "Eclipse Mosquitto。" },
          { text: "REST API basics。" },
          { text: "InfluxDB / Grafana tutorials。" },
        ],
      },
    ],
    "A2.5": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "CIA 三要素：Confidentiality（機密性）、Integrity（完整性）、Availability（可用性）",
          },
          {
            text: "AAA：Authentication（認證）、Authorization（授權）、Auditing / Accounting（稽核）",
            children: [
              { text: "Authentication 回答「你是誰」。" },
              { text: "Authorization 回答「你能做什麼」。" },
            ],
          },
          {
            text: "Encryption：Symmetric 用同一把金鑰；Asymmetric 用公私鑰對。",
          },
          { text: "Hash：單向函數，主要保護 Integrity。" },
          {
            text: "Digital Signature：以 Hash ＋ Private Key 產生，驗證時使用 Public Key。",
          },
          { text: "TLS：提供傳輸層的安全性（transport security）。" },
          {
            text: "常見 IoT 攻擊：MITM、DoS、DDoS、Botnet、密碼攻擊、韌體遭竄改、實體除錯介面攻擊。",
          },
          {
            text: "裝置端防護：Secure Boot、Signed Firmware、OTA 安全、每台唯一憑證／密碼、關閉 debug port。",
          },
          {
            text: "Privacy by Design（PbD）：在架構設計階段就納入隱私，而非事後補救。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "CIA = Confidentiality / Integrity / Availability" },
          { text: "AAA = Authentication / Authorization / Accounting" },
          { text: "TLS = Transport Layer Security；SSL = Secure Sockets Layer" },
          { text: "PKI = Public Key Infrastructure；CA = Certificate Authority" },
          { text: "DoS = Denial of Service；DDoS = Distributed Denial of Service" },
          { text: "MITM = Man-in-the-Middle" },
          { text: "OTA = Over-the-Air（韌體更新）" },
          { text: "PbD = Privacy by Design" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Authentication 談身分；Authorization 談權限。" },
          { text: "Encryption 提供機密性；Hash 提供完整性。" },
          {
            text: "Digital Signature 同時提供完整性、真實性與不可否認性（non-repudiation）。",
          },
          { text: "DoS 來自單一／有限來源；DDoS 來自分散的大量來源。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [{ text: "本節點無主要計算公式。" }],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "IoT Camera → Secure Boot → 每台唯一裝置憑證 → TLS → Cloud → IAM → Audit Log",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "Hash 最主要提供什麼？→ Integrity。" },
          { text: "防止中間人讀取傳輸資料 → TLS。" },
          { text: "Authentication 與 Authorization 的情境判斷題。" },
          { text: "大量被入侵的 IoT 裝置攻擊伺服器 → Botnet / DDoS。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 官方指引的 Security 章節。" },
          { text: "OWASP IoT Security Guidance。" },
          { text: "NIST IoT Cybersecurity guidance。" },
        ],
      },
    ],
    "A3.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "Sensor 的本質：把物理量轉成電氣／數位表示（Physical quantity → Electrical / Digital representation）。",
          },
          {
            text: "重要特性：Range、Resolution、Accuracy、Precision、Sensitivity、Repeatability、Linearity、Response time。",
          },
          {
            text: "必會感測器",
            children: [
              {
                text: "PIR：偵測人體移動，被動接收紅外線變化；無法辨識身分，也不擅長偵測完全靜止的人體。",
              },
              { text: "Temperature：常見為 Thermistor（熱敏電阻）。" },
              { text: "Humidity：電容式或電阻式。" },
              { text: "Ultrasonic：以 Time of Flight 量距離。" },
              { text: "Accelerometer：量線性加速度，多為 MEMS 元件。" },
              { text: "Gyroscope：量角速度。" },
              { text: "IMU：Accelerometer ＋ Gyroscope。" },
              { text: "LDR：光敏電阻，光越強電阻通常越低。" },
              { text: "Gas Sensor：以化學電阻變化反應氣體濃度。" },
            ],
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "PIR = Passive Infrared" },
          { text: "MEMS = Micro-Electro-Mechanical Systems" },
          { text: "IMU = Inertial Measurement Unit" },
          { text: "LDR = Light Dependent Resistor" },
          { text: "NTC = Negative Temperature Coefficient（熱敏電阻的一種）" },
          { text: "ToF = Time of Flight" },
          { text: "RH = Relative Humidity" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Accelerometer 量線性加速度；Gyroscope 量角速度。" },
          { text: "PIR 偵測移動；Ultrasonic 量距離；LDR 量光線。" },
          {
            text: "Accuracy（準確度，接近真值）與 Precision（精密度，重複量測的一致性）不是同一件事。",
          },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "超音波測距：d =（v × t）/ 2，除以 2 是因為聲波來回。" },
          { text: "空氣中聲速約 v ≈ 340 m/s。" },
          { text: "加速度換算：1 g ≈ 9.81 m/s²。" },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "機器人避障 → Ultrasonic。" },
          { text: "無人機姿態 → IMU。" },
          { text: "路燈自動點滅 → LDR。" },
          { text: "工廠振動監測 → Accelerometer。" },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "要量角速度 → Gyroscope。" },
          { text: "要量距離 → Ultrasonic。" },
          { text: "MEMS 三軸振動量測 → Accelerometer。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 官方指引的 Sensor 章節。" },
          { text: "Adafruit Learning System。" },
          { text: "SparkFun Sensor tutorials。" },
        ],
      },
    ],
    "A3.2": [
      {
        heading: "必懂觀念",
        items: [
          { text: "Analog 是連續電壓；Digital 是離散數值。" },
          {
            text: "ADC（Analog-to-Digital Converter）三個關鍵參數：Resolution、Reference voltage、Sampling rate。",
          },
          { text: "GPIO = General Purpose Input/Output，通用數位輸入輸出腳位。" },
          { text: "PWM = Pulse Width Modulation，以脈波寬度控制等效輸出。" },
          {
            text: "UART：TX、RX、GND 三線，非同步（Asynchronous）、點對點。",
          },
          { text: "I²C：SDA、SCL 兩線，以位址（Address）辨識裝置，可掛多裝置。" },
          {
            text: "SPI：SCLK、MOSI、MISO、CS 四線，高速、全雙工（Full duplex）。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "ADC = Analog-to-Digital Converter；DAC = Digital-to-Analog Converter" },
          { text: "GPIO = General Purpose Input/Output" },
          { text: "PWM = Pulse Width Modulation" },
          { text: "UART = Universal Asynchronous Receiver/Transmitter" },
          { text: "I²C = Inter-Integrated Circuit（SDA = Serial Data、SCL = Serial Clock）" },
          {
            text: "SPI = Serial Peripheral Interface（MOSI = Master Out Slave In、MISO = Master In Slave Out、CS = Chip Select）",
          },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          {
            text: "UART / I²C / SPI 三者比較",
            children: [
              { text: "時脈線：UART 無、I²C 有（SCL）、SPI 有（SCLK）。" },
              { text: "資料線：UART 為 TX/RX、I²C 為 SDA、SPI 為 MOSI/MISO。" },
              { text: "裝置選擇：UART 靠實體連線、I²C 靠 Address、SPI 靠 CS。" },
              { text: "速度：UART 中等、I²C 中等、SPI 高。" },
              { text: "多裝置支援：UART 弱、I²C 強、SPI 強。" },
              { text: "全雙工：UART 是、I²C 否、SPI 是。" },
            ],
          },
          { text: "ADC 是 Analog → Digital；DAC 是 Digital → Analog。" },
          { text: "PWM 輸出的是數位脈波；DAC 輸出的才是真正的類比電壓。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "ADC 階數：Levels = 2^N。12-bit 時 2^12 = 4096。" },
          {
            text: "ADC 解析度：Resolution = Vref / 2^N。例：12-bit、3.3 V → 3.3 / 4096 ≈ 0.806 mV。",
          },
          { text: "Nyquist 取樣定理：f_s ≥ 2 × f_max。" },
          { text: "PWM 責任週期：Duty =（T_ON / T）× 100%。" },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "溫濕度感測器 → I²C。" },
          { text: "外接 Flash → SPI。" },
          { text: "GPS 模組 → UART。" },
          { text: "光敏電阻 → 類比訊號 → ADC。" },
          { text: "馬達轉速控制 → PWM。" },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "兩條線＋以位址定址 → I²C。" },
          { text: "最快、且有 MOSI/MISO → SPI。" },
          { text: "TX/RX 成對 → UART。" },
          { text: "12-bit ADC 有幾階？→ 4096。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "ESP-IDF 的 UART / I²C / SPI 官方文件。" },
          { text: "Arduino ADC / PWM tutorials。" },
          { text: "SparkFun I²C / SPI / UART tutorial。" },
        ],
      },
    ],
  },
  "aiot-junior-iot": {
    "B1.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "完整 IoT 架構鏈：Physical Asset → Sensor / Actuator → MCU → Gateway / Edge → Network → Broker / API → Database → Application → AI / Analytics",
          },
          {
            text: "要能回答每個元件「為什麼存在」",
            children: [
              { text: "Sensor 取得物理量；Actuator 執行物理動作。" },
              { text: "MCU 做本地控制與資料前處理。" },
              { text: "Gateway 做異質協定轉換與匯聚。" },
              { text: "Broker 做訊息路由。" },
              { text: "Database 保存時間序列與狀態。" },
              { text: "Edge 放在資料來源附近做即時判斷；Cloud 負責集中分析與長期儲存。" },
            ],
          },
          {
            text: "控制迴路（Control Loop）：Sensor → Controller → Actuator → Physical System → 回到 Sensor，形成閉迴路。",
          },
          {
            text: "IT vs OT：IT 是 Information Technology（資訊系統）、OT 是 Operational Technology（現場操作技術），兩者的可用性與即時性要求不同。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "MCU = Microcontroller Unit" },
          { text: "PLC = Programmable Logic Controller" },
          { text: "IPC = Industrial PC" },
          { text: "HMI = Human-Machine Interface" },
          { text: "SCADA = Supervisory Control and Data Acquisition" },
          { text: "MES = Manufacturing Execution System" },
          { text: "ERP = Enterprise Resource Planning" },
          { text: "IT = Information Technology；OT = Operational Technology" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Sensor 是 input；Actuator 是 output（實際的物理動作）。" },
          { text: "PLC：工業級、具確定性的控制。MCU：嵌入式控制器。" },
          {
            text: "SCADA 做監控與監督式控制；MES 做製造執行；ERP 做企業資源規劃——三者層級不同。",
          },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "端到端延遲：T_total = T_sensor ＋ T_network ＋ T_processing ＋ T_actuation",
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "Vibration Sensor → PLC / Edge → OPC UA → MES → AI → Maintenance Alert",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "哪一層應負責 protocol conversion？→ Gateway。" },
          { text: "即時控制最不應依賴什麼？→ 遠端 Cloud 的來回往返（round trip）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 科目一的架構章節（考科二可共用）。" },
          { text: "Node-RED。" },
          { text: "Industrial IoT reference architectures。" },
        ],
      },
    ],
    "B1.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "由下而上的排查順序：Power → Physical → Link → Network → Transport → Protocol → Application → Data",
          },
          {
            text: "Step 1 電源：電壓？電流？接地？線材？",
          },
          { text: "Step 2 感測器：有沒有原始資料？校正過嗎？量測範圍對嗎？" },
          { text: "Step 3 介面：UART baud rate？I²C address？SPI 的 CS？" },
          { text: "Step 4 網路：實體鏈路？IP？Subnet？Gateway？DNS？" },
          { text: "Step 5 伺服器：Port？防火牆？Broker 狀態？認證？" },
          { text: "Step 6 應用：Topic？Payload？JSON 格式？資料庫寫入？" },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "DNS = Domain Name System" },
          { text: "DHCP = Dynamic Host Configuration Protocol" },
          { text: "IP / MAC" },
          { text: "RSSI = Received Signal Strength Indicator" },
          { text: "SNR = Signal-to-Noise Ratio" },
          { text: "CRC = Cyclic Redundancy Check" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Ping 得通 ≠ MQTT 一定連得上（可能卡在 port、認證或設定）。" },
          { text: "Broker 連得到 ≠ Topic 一定正確。" },
          { text: "Sensor 有資料 ≠ 資料格式正確。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "封包遺失率：Packet Loss =（Lost / Sent）× 100%" },
          { text: "可用率：Availability = Uptime / Total Time" },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "「Dashboard 沒資料」的逐層排查：Sensor？→ MCU？→ Wi-Fi？→ IP？→ Broker？→ 帳密？→ Topic？→ Payload？→ DB？→ Dashboard？",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "I²C 感測器沒有回應，最先檢查什麼？→ 電源／接線／位址。" },
          {
            text: "可以 Ping 到 Broker 但 MQTT 連線失敗？→ Port、認證或 MQTT 設定。",
          },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "Wireshark basics。" },
          { text: "MQTT Explorer。" },
          { text: "ping / traceroute / nslookup。" },
          { text: "ESP-IDF logs。" },
        ],
      },
    ],
    "B1.3": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "分層防護（Security by layers）：Device → Network → Platform → Application",
          },
          {
            text: "Device 層：Secure Boot、韌體簽章、OTA 安全、憑證與密碼管理、關閉 debug port。",
          },
          { text: "Network 層：TLS、Firewall、VPN、網段隔離（Segmentation）。" },
          { text: "Platform 層：IAM、最小權限原則、稽核、備份。" },
          { text: "Application 層：Authentication、Authorization、輸入驗證。" },
          {
            text: "Defense in Depth：不能只靠單一 Firewall，必須多層並行。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "IAM = Identity and Access Management" },
          { text: "RBAC = Role-Based Access Control" },
          { text: "ACL = Access Control List" },
          { text: "VPN = Virtual Private Network" },
          { text: "TLS = Transport Layer Security" },
          { text: "OTA = Over-the-Air" },
          { text: "PKI = Public Key Infrastructure" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Firewall 管的是網路流量政策。" },
          { text: "Authentication 管身分；Authorization 管權限。" },
          { text: "Secure Boot 是在執行前驗證韌體；Encryption 保護的是機密性。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [{ text: "風險估算：Risk ≈ Likelihood × Impact" }],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "Smart Camera 的完整防護＝簽章韌體 ＋ 每台唯一憑證 ＋ TLS ＋ RBAC ＋ Audit log。",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          {
            text: "IoT 安全的最佳設計通常是多層防護，而非單一 Cloud firewall。",
          },
          { text: "預設密碼（Default password）是重大風險。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OWASP IoT。" },
          { text: "NIST IoT cybersecurity。" },
          { text: "iPAS 官方指引的 Security 章節。" },
        ],
      },
    ],
    "B2.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "MCU 的基本組成：CPU、RAM、Flash、GPIO、Timer、ADC、通訊介面。",
          },
          {
            text: "輸入／輸出型態：Digital Input、Digital Output、Analog Input、PWM Output。",
          },
          {
            text: "Pull-up / Pull-down 電阻：避免輸入腳位浮接（floating）造成不穩定讀值。",
          },
          { text: "Interrupt：事件發生時通知 CPU，不必持續輪詢。" },
          { text: "Relay（繼電器）：以低壓 MCU 控制高功率負載。" },
          {
            text: "Driver：MCU 通常無法直接驅動馬達、繼電器線圈、高電流 LED，需要驅動電路。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "MCU = Microcontroller Unit" },
          { text: "CPU = Central Processing Unit" },
          { text: "RAM = Random Access Memory；ROM = Read-Only Memory" },
          { text: "Flash（非揮發性記憶體）" },
          { text: "GPIO = General Purpose Input/Output" },
          { text: "ADC = Analog-to-Digital Converter" },
          { text: "PWM = Pulse Width Modulation" },
          { text: "ISR = Interrupt Service Routine" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "GPIO 處理數位訊號；ADC 做類比量測；PWM 以數位波形做等效控制。" },
          { text: "Interrupt 是事件驅動；Polling 是持續檢查。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "歐姆定律：V = I × R" },
          { text: "功率：P = V × I" },
          { text: "電阻：R = V / I" },
        ],
      },
      {
        heading: "實務案例",
        items: [{ text: "GPIO → 電晶體驅動 → Relay → Motor" }],
      },
      {
        heading: "可能考法",
        items: [
          { text: "輸入腳位浮接怎麼處理？→ 加 Pull-up / Pull-down。" },
          { text: "MCU 為何不能直接驅動馬達？→ 供電流能力不足。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "ESP32 datasheet / ESP-IDF basics。" },
          { text: "Arduino electronics basics。" },
          { text: "All About Circuits 基礎電子學。" },
        ],
      },
    ],
    "B2.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "完整資料管線：Sensor → MCU / Edge → MQTT / HTTP → Cloud Gateway → Broker → Stream / Rules → Database → API → Dashboard / AI",
          },
          {
            text: "Telemetry：裝置定期上報的量測值，例如溫度、振動、電流。",
          },
          {
            text: "Device State：常見以 desired（期望狀態）與 reported（實際回報狀態）成對表示。",
          },
          {
            text: "JSON 範例欄位：device_id、temperature、status——實務上還必須有 timestamp。",
          },
          {
            text: "資料庫選型：Relational 以表格／列／欄組織；Time-series DB 以時間戳為核心，適合感測器資料流。",
          },
          {
            text: "雲端設計考量：Scalability、Availability、Security、Cost、Latency。",
          },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "API = Application Programming Interface" },
          { text: "JSON = JavaScript Object Notation" },
          { text: "SQL = Structured Query Language；DB = Database" },
          { text: "TSDB = Time-Series Database" },
          { text: "MQTT = Message Queuing Telemetry Transport" },
          { text: "REST = Representational State Transfer" },
          { text: "UTC = Coordinated Universal Time（時間戳的統一基準）" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          {
            text: "Telemetry 是裝置往雲端送的量測；Command 是雲端往裝置下的指令，方向相反。",
          },
          { text: "Desired state 是「希望變成的」；Reported state 是「實際是的」。" },
          { text: "SQL 擅長關聯查詢；Time-series DB 擅長帶時間戳的感測資料流。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "儲存量估算：Storage = Devices × Samples/sec × Bytes/sample × Time",
          },
          {
            text: "例：100 台裝置 × 每秒 1 筆 × 每筆 100 bytes × 86400 秒 ≈ 864 MB／天。",
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "ESP32 →（MQTT）→ Cloud IoT / MQTT Broker → Rule → Time-series DB → Dashboard",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "IoT 感測資料最常見且不可或缺的欄位？→ Timestamp。" },
          { text: "大量時間序列感測資料應選什麼資料庫？→ Time-series database。" },
          { text: "MQTT 在資料管線中扮演什麼角色？→ Telemetry messaging。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "AWS IoT Core Developer Guide。" },
          { text: "Azure IoT architecture documents。" },
          { text: "Node-RED、InfluxDB、Grafana。" },
        ],
      },
    ],
    "B2.3": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "OEE（Overall Equipment Effectiveness）由三個元素相乘：Availability、Performance、Quality。",
          },
          { text: "Downtime：設備停止生產的時間。" },
          { text: "Throughput：單位時間的產量。" },
          { text: "Cycle Time：生產一件產品所需的時間。" },
          { text: "Yield：良率。" },
          { text: "Bottleneck：限制整條產線 throughput 的節點。" },
          { text: "WIP（Work in Process）：在製品。" },
          { text: "Predictive Maintenance：目的是減少非計畫性停機（unplanned downtime）。" },
          { text: "Digital Twin：實體設備的數位分身／模擬。" },
          {
            text: "CAPEX vs OPEX：CAPEX 是資本支出（設備建置）、OPEX 是營運支出（日常營運）。",
          },
          { text: "ROI：投資報酬率。TCO：總持有成本。" },
        ],
      },
      {
        heading: "重要縮寫",
        items: [
          { text: "OEE = Overall Equipment Effectiveness" },
          { text: "KPI = Key Performance Indicator" },
          { text: "WIP = Work in Process" },
          { text: "ROI = Return on Investment" },
          { text: "TCO = Total Cost of Ownership" },
          { text: "CAPEX = Capital Expenditure；OPEX = Operating Expenditure" },
          { text: "PdM = Predictive Maintenance" },
        ],
      },
      {
        heading: "容易混淆",
        items: [
          { text: "Throughput 是「一段時間做多少」；Cycle Time 是「一件要多久」。" },
          { text: "Utilization 是設備被使用的程度；Productivity 是投入產出的效率。" },
          { text: "CAPEX 例如買機台；OPEX 例如雲端的月租帳單。" },
          { text: "Preventive 是定期保養；Predictive 是依實際狀態預測。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "OEE = Availability × Performance × Quality",
            children: [
              { text: "例：0.90 × 0.95 × 0.98 ≈ 83.8%。" },
            ],
          },
          { text: "Availability = Run Time / Planned Production Time" },
          { text: "Quality = Good Count / Total Count" },
          { text: "ROI =（Benefit − Cost）/ Cost × 100%" },
          { text: "Payback Period = Initial Investment / Annual Savings" },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "AI 預測性維護的投資評估：初始投資 NT$1,000,000；年效益 NT$700,000（降低停機損失 500,000 ＋ 人工成本 200,000）。",
            children: [
              { text: "第一年簡化 ROI =（700,000 − 1,000,000）/ 1,000,000 = −30%。" },
              { text: "Payback = 1,000,000 / 700,000 ≈ 1.43 年。" },
              { text: "結論：不能只看第一年 ROI，要看回收期與長期效益。" },
            ],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "設備可用率下降 → 影響 OEE 的 Availability。" },
          { text: "瑕疵品增加 → 影響 Quality。" },
          { text: "實際速度低於理論 cycle time → 影響 Performance。" },
          { text: "找出限制產線產量的設備 → Bottleneck。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OEE fundamentals。" },
          { text: "Lean Manufacturing basics。" },
          { text: "ISA-95 overview。" },
          { text: "Predictive Maintenance cases、Digital Twin introduction。" },
        ],
      },
    ],
  },
};

/**
 * 跨節點的備考總整理。不屬於任何單一節點，故不放進 aiotStudyNotes，
 * 改由學習主題頁在證照層級渲染一次。
 */
export const aiotExamOverview: StudyNoteSection[] = [
  {
    heading: "使用方式與建議順序",
    items: [
      {
        text: "每個節點都按七個項目整理：必懂觀念、重要縮寫、容易混淆、公式與計算、實務案例、可能考法、推薦資源。",
      },
      {
        text: "建議學習順序（由工程基礎往上疊）：A2.2 → A2.3 → A3.2 → A2.1 → A2.4 → B1.1 → B1.2 → B2.2 → A2.5／B1.3 → A3.1 → B2.1 → B2.3 → A1.1 → A1.2",
      },
      {
        text: "資料基準：考科一以 2026 官方《學習指引－科目一：AIoT 基礎概論》為主；考科二目前沒有同等完整的學習指引，以 115 年度簡章的能力指標與評鑑內容為骨架，再補上必要的工程知識。",
      },
      {
        text: "注意：B2.3 的 OEE、ROI、CAPEX/OPEX 等公式屬於依「智慧製造流程優化與成本控制」延伸的高價值補強，不代表官方已明文列為必考公式。",
      },
    ],
  },
  {
    heading: "15 個節點的一句話記憶",
    items: [
      { text: "A1.1：AI 如何從資料學習並部署到 Edge。" },
      { text: "A1.2：Sensor ＋ Network ＋ AI 如何解決實際問題。" },
      { text: "A2.1：IoT 系統分哪些 Layer。" },
      { text: "A2.2：Data 用什麼方式傳。" },
      { text: "A2.3：工廠的 Data 如何標準化、有語意地互通。" },
      { text: "A2.4：Device 與 Application 中間怎麼串。" },
      { text: "A2.5：如何讓 Device、Network、Data 不被攻擊。" },
      { text: "A3.1：Sensor 如何把物理世界轉成資料。" },
      { text: "A3.2：Sensor 的資料如何進 MCU。" },
      { text: "B1.1：如何把所有元件組成 System。" },
      { text: "B1.2：System 壞掉時怎麼一層一層查。" },
      { text: "B1.3：怎麼從架構上做 IoT Security。" },
      { text: "B2.1：MCU 與 I/O 怎麼接真實硬體。" },
      { text: "B2.2：Data 怎麼一路進 Cloud / DB / Dashboard。" },
      { text: "B2.3：AIoT 最後如何產生 Manufacturing Value。" },
    ],
  },
  {
    heading: "最重要的六張比較表（考前應能默寫）",
    items: [
      { text: "1. TCP vs UDP" },
      { text: "2. MQTT vs HTTP" },
      { text: "3. Wi-Fi vs BLE vs Zigbee vs LoRaWAN vs NB-IoT" },
      { text: "4. UART vs I²C vs SPI" },
      { text: "5. OPC UA vs MQTT vs MTConnect" },
      { text: "6. Edge vs Gateway vs Cloud" },
    ],
  },
  {
    heading: "最重要的八條公式",
    items: [
      { text: "V = I × R" },
      { text: "P = V × I" },
      { text: "ADC Levels = 2^N" },
      { text: "ADC Resolution = Vref / 2^N" },
      { text: "f_s ≥ 2 × f_max（Nyquist）" },
      { text: "Distance =（Speed × Time）/ 2" },
      { text: "OEE = A × P × Q" },
      { text: "ROI =（Benefit − Cost）/ Cost × 100%" },
    ],
  },
  {
    heading: "建議的最小實作（一個 Lab 覆蓋 11 個節點）",
    items: [
      {
        text: "溫濕度感測器 →（I²C）→ ESP32 →（Wi-Fi）→ MQTT → Broker → Node-RED → Time-series DB → Grafana",
      },
      {
        text: "然後刻意製造故障並逐一排查：Sensor 拔掉、I²C 位址寫錯、Wi-Fi 斷線、Broker IP 填錯、MQTT 密碼錯、Topic 打錯、JSON 格式無效。",
      },
      {
        text: "這一個 Lab 同時練到 A2.1、A2.2、A2.4、A2.5、A3.1、A3.2、B1.1、B1.2、B1.3、B2.1、B2.2——15 個節點中的 11 個。",
      },
    ],
  },
];
