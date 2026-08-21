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
 * 標註「2026」的段落是依 2026-08 查得的公開資訊補入的產業現況，
 * 用意是讓案例與技術現狀不過時；這類內容**時效性最強、最需要定期複查**。
 */

/** 縮寫的單一真實來源：每個節點的「重要縮寫」表與速查表都由這份清單生成。 */
export type AiotAbbreviation = {
  term: string;
  full: string;
  zh?: string;
  /** 出現在哪些節點（可跨節點，例 MCU 同時屬於 A1.1 與 B2.1）。 */
  nodes: string[];
};

export const aiotAbbreviations: AiotAbbreviation[] = [
  // A1.1 AI 基礎概念
  { term: "AI", full: "Artificial Intelligence", zh: "人工智慧", nodes: ["A1.1"] },
  { term: "ML", full: "Machine Learning", zh: "機器學習", nodes: ["A1.1"] },
  { term: "DL", full: "Deep Learning", zh: "深度學習", nodes: ["A1.1"] },
  { term: "ANN", full: "Artificial Neural Network", zh: "人工神經網路", nodes: ["A1.1"] },
  { term: "CNN", full: "Convolutional Neural Network", zh: "卷積神經網路", nodes: ["A1.1"] },
  { term: "RNN", full: "Recurrent Neural Network", zh: "循環神經網路", nodes: ["A1.1"] },
  { term: "LSTM", full: "Long Short-Term Memory", zh: "長短期記憶", nodes: ["A1.1"] },
  { term: "RL", full: "Reinforcement Learning", zh: "強化學習", nodes: ["A1.1"] },
  { term: "GPU", full: "Graphics Processing Unit", zh: "圖形處理器", nodes: ["A1.1"] },
  { term: "NPU", full: "Neural Processing Unit", zh: "神經網路處理器", nodes: ["A1.1", "B2.1"] },
  { term: "FPGA", full: "Field Programmable Gate Array", zh: "現場可程式化邏輯閘陣列", nodes: ["A1.1"] },
  { term: "MCU", full: "Microcontroller Unit", zh: "微控制器", nodes: ["A1.1", "B1.1", "B2.1"] },
  { term: "TinyML", full: "Tiny Machine Learning", zh: "微型機器學習", nodes: ["A1.1"] },
  { term: "SLM", full: "Small Language Model", zh: "小型語言模型", nodes: ["A1.1"] },
  { term: "PTQ", full: "Post-Training Quantization", zh: "訓練後量化", nodes: ["A1.1"] },
  { term: "QAT", full: "Quantization-Aware Training", zh: "量化感知訓練", nodes: ["A1.1"] },
  { term: "FL", full: "Federated Learning", zh: "聯合學習", nodes: ["A1.1"] },
  { term: "XAI", full: "Explainable AI", zh: "可解釋人工智慧", nodes: ["A1.1"] },
  { term: "ONNX", full: "Open Neural Network Exchange", zh: "開放神經網路交換格式", nodes: ["A1.1"] },

  // A1.2 AIoT 應用案例
  { term: "AIoT", full: "Artificial Intelligence of Things", zh: "人工智慧物聯網", nodes: ["A1.2"] },
  { term: "PdM", full: "Predictive Maintenance", zh: "預測性維護", nodes: ["A1.2", "B2.3"] },
  { term: "RUL", full: "Remaining Useful Life", zh: "剩餘使用壽命", nodes: ["A1.2"] },
  { term: "AOI", full: "Automated Optical Inspection", zh: "自動光學檢測", nodes: ["A1.2"] },
  { term: "HVAC", full: "Heating, Ventilation and Air Conditioning", zh: "暖通空調", nodes: ["A1.2"] },
  { term: "V2X", full: "Vehicle-to-Everything", zh: "車聯網通訊", nodes: ["A1.2"] },

  // A2.1 物聯網架構與功能
  { term: "IoT", full: "Internet of Things", zh: "物聯網", nodes: ["A2.1"] },
  { term: "IIoT", full: "Industrial Internet of Things", zh: "工業物聯網", nodes: ["A2.1"] },
  { term: "OSI", full: "Open Systems Interconnection", zh: "開放式系統互連", nodes: ["A2.1"] },
  { term: "TCP/IP", full: "Transmission Control Protocol / Internet Protocol", zh: "網際網路協定組", nodes: ["A2.1"] },
  { term: "ICMP", full: "Internet Control Message Protocol", zh: "網際網路控制訊息協定", nodes: ["A2.1"] },
  { term: "MAC", full: "Media Access Control", zh: "媒體存取控制", nodes: ["A2.1", "B1.2"] },
  { term: "LAN", full: "Local Area Network", zh: "區域網路", nodes: ["A2.1"] },
  { term: "WAN", full: "Wide Area Network", zh: "廣域網路", nodes: ["A2.1"] },

  // A2.2 常見通訊協定與網路層技術
  { term: "MQTT", full: "Message Queuing Telemetry Transport", zh: "訊息佇列遙測傳輸", nodes: ["A2.2", "A2.3", "B2.2"] },
  { term: "TCP", full: "Transmission Control Protocol", zh: "傳輸控制協定", nodes: ["A2.2"] },
  { term: "UDP", full: "User Datagram Protocol", zh: "使用者資料包協定", nodes: ["A2.2"] },
  { term: "HTTP", full: "Hypertext Transfer Protocol", zh: "超文字傳輸協定", nodes: ["A2.2"] },
  { term: "CoAP", full: "Constrained Application Protocol", zh: "受限應用協定", nodes: ["A2.2"] },
  { term: "QoS", full: "Quality of Service", zh: "服務品質", nodes: ["A2.2"] },
  { term: "BLE", full: "Bluetooth Low Energy", zh: "低功耗藍牙", nodes: ["A2.2"] },
  { term: "NFC", full: "Near Field Communication", zh: "近場通訊", nodes: ["A2.2"] },
  { term: "RFID", full: "Radio Frequency Identification", zh: "無線射頻辨識", nodes: ["A2.2"] },
  { term: "LPWAN", full: "Low-Power Wide-Area Network", zh: "低功耗廣域網路", nodes: ["A1.2", "A2.2"] },
  { term: "NB-IoT", full: "Narrowband Internet of Things", zh: "窄頻物聯網", nodes: ["A2.2"] },
  { term: "RedCap", full: "Reduced Capability (5G NR-Light)", zh: "5G 精簡型終端", nodes: ["A2.2"] },

  // A2.3 工業通訊標準與資訊模型
  { term: "OPC UA", full: "OPC Unified Architecture", zh: "OPC 統一架構", nodes: ["A2.3"] },
  { term: "MTConnect", full: "MTConnect", zh: "製造設備資料標準", nodes: ["A2.3"] },
  { term: "TSN", full: "Time-Sensitive Networking", zh: "時效性網路", nodes: ["A2.3"] },
  { term: "UNS", full: "Unified Namespace", zh: "統一命名空間", nodes: ["A2.3", "B2.2"] },
  { term: "PLC", full: "Programmable Logic Controller", zh: "可程式邏輯控制器", nodes: ["A2.3", "B1.1"] },
  { term: "HMI", full: "Human-Machine Interface", zh: "人機介面", nodes: ["A2.3", "B1.1"] },
  { term: "SCADA", full: "Supervisory Control and Data Acquisition", zh: "監控與資料擷取系統", nodes: ["A2.3", "B1.1"] },
  { term: "MES", full: "Manufacturing Execution System", zh: "製造執行系統", nodes: ["A2.3", "B1.1"] },
  { term: "ERP", full: "Enterprise Resource Planning", zh: "企業資源規劃", nodes: ["A2.3", "B1.1"] },
  { term: "ISA-95", full: "ANSI/ISA-95 Enterprise-Control System Integration", zh: "企業與控制系統整合標準", nodes: ["A2.3"] },

  // A2.4 中介軟體與平台
  { term: "API", full: "Application Programming Interface", zh: "應用程式介面", nodes: ["A2.4", "B2.2"] },
  { term: "REST", full: "Representational State Transfer", zh: "表現層狀態轉換", nodes: ["A2.4", "B2.2"] },
  { term: "JSON", full: "JavaScript Object Notation", zh: "JavaScript 物件表示法", nodes: ["A2.4", "B2.2"] },
  { term: "XML", full: "eXtensible Markup Language", zh: "可延伸標記語言", nodes: ["A2.4"] },
  { term: "CRUD", full: "Create, Read, Update, Delete", zh: "增查改刪", nodes: ["A2.4"] },
  { term: "URI", full: "Uniform Resource Identifier", zh: "統一資源識別碼", nodes: ["A2.4"] },
  { term: "IaaS", full: "Infrastructure as a Service", zh: "基礎架構即服務", nodes: ["A2.4"] },
  { term: "PaaS", full: "Platform as a Service", zh: "平台即服務", nodes: ["A2.4"] },
  { term: "SaaS", full: "Software as a Service", zh: "軟體即服務", nodes: ["A2.4"] },
  { term: "DBMS", full: "Database Management System", zh: "資料庫管理系統", nodes: ["A2.4"] },

  // A2.5 資安與隱私基本概念
  { term: "CIA", full: "Confidentiality, Integrity, Availability", zh: "機密性、完整性、可用性", nodes: ["A2.5"] },
  { term: "AAA", full: "Authentication, Authorization, Accounting", zh: "認證、授權、稽核", nodes: ["A2.5"] },
  { term: "TLS", full: "Transport Layer Security", zh: "傳輸層安全性", nodes: ["A2.5", "B1.3"] },
  { term: "PKI", full: "Public Key Infrastructure", zh: "公開金鑰基礎建設", nodes: ["A2.5", "B1.3"] },
  { term: "CA", full: "Certificate Authority", zh: "憑證機構", nodes: ["A2.5"] },
  { term: "DoS", full: "Denial of Service", zh: "阻斷服務攻擊", nodes: ["A2.5"] },
  { term: "DDoS", full: "Distributed Denial of Service", zh: "分散式阻斷服務攻擊", nodes: ["A2.5"] },
  { term: "MITM", full: "Man-in-the-Middle", zh: "中間人攻擊", nodes: ["A2.5"] },
  { term: "OTA", full: "Over-the-Air", zh: "空中韌體更新", nodes: ["A2.5", "B1.3"] },
  { term: "PbD", full: "Privacy by Design", zh: "由設計起始的隱私", nodes: ["A2.5"] },
  { term: "CRA", full: "Cyber Resilience Act", zh: "歐盟網路韌性法", nodes: ["A2.5", "B1.3"] },
  { term: "SBOM", full: "Software Bill of Materials", zh: "軟體物料清單", nodes: ["A2.5", "B1.3"] },

  // A3.1 感測技術基礎
  { term: "PIR", full: "Passive Infrared", zh: "被動式紅外線", nodes: ["A3.1"] },
  { term: "MEMS", full: "Micro-Electro-Mechanical Systems", zh: "微機電系統", nodes: ["A3.1"] },
  { term: "IMU", full: "Inertial Measurement Unit", zh: "慣性量測單元", nodes: ["A3.1"] },
  { term: "LDR", full: "Light Dependent Resistor", zh: "光敏電阻", nodes: ["A3.1"] },
  { term: "NTC", full: "Negative Temperature Coefficient", zh: "負溫度係數熱敏電阻", nodes: ["A3.1"] },
  { term: "ToF", full: "Time of Flight", zh: "飛行時間", nodes: ["A3.1"] },
  { term: "RH", full: "Relative Humidity", zh: "相對濕度", nodes: ["A3.1"] },

  // A3.2 感測訊號與通訊基礎
  { term: "ADC", full: "Analog-to-Digital Converter", zh: "類比數位轉換器", nodes: ["A3.2", "B2.1"] },
  { term: "DAC", full: "Digital-to-Analog Converter", zh: "數位類比轉換器", nodes: ["A3.2"] },
  { term: "GPIO", full: "General Purpose Input/Output", zh: "通用輸入輸出", nodes: ["A3.2", "B2.1"] },
  { term: "PWM", full: "Pulse Width Modulation", zh: "脈波寬度調變", nodes: ["A3.2", "B2.1"] },
  { term: "UART", full: "Universal Asynchronous Receiver/Transmitter", zh: "通用非同步收發器", nodes: ["A3.2"] },
  { term: "I²C", full: "Inter-Integrated Circuit", zh: "積體電路匯流排", nodes: ["A3.2"] },
  { term: "SPI", full: "Serial Peripheral Interface", zh: "序列週邊介面", nodes: ["A3.2"] },
  { term: "SDA / SCL", full: "Serial Data / Serial Clock", zh: "I²C 的資料線與時脈線", nodes: ["A3.2"] },
  { term: "MOSI / MISO", full: "Master Out Slave In / Master In Slave Out", zh: "SPI 的雙向資料線", nodes: ["A3.2"] },
  { term: "CS", full: "Chip Select", zh: "晶片選擇", nodes: ["A3.2"] },

  // B1.1 系統元件與架構
  { term: "IPC", full: "Industrial PC", zh: "工業電腦", nodes: ["B1.1"] },
  { term: "IT", full: "Information Technology", zh: "資訊技術", nodes: ["B1.1"] },
  { term: "OT", full: "Operational Technology", zh: "操作技術", nodes: ["B1.1"] },

  // B1.2 故障排除
  { term: "DNS", full: "Domain Name System", zh: "網域名稱系統", nodes: ["B1.2"] },
  { term: "DHCP", full: "Dynamic Host Configuration Protocol", zh: "動態主機設定協定", nodes: ["B1.2"] },
  { term: "RSSI", full: "Received Signal Strength Indicator", zh: "接收訊號強度指標", nodes: ["B1.2"] },
  { term: "SNR", full: "Signal-to-Noise Ratio", zh: "訊雜比", nodes: ["B1.2"] },
  { term: "CRC", full: "Cyclic Redundancy Check", zh: "循環冗餘校驗", nodes: ["B1.2"] },

  // B1.3 物聯網資訊安全
  { term: "IAM", full: "Identity and Access Management", zh: "身分與存取管理", nodes: ["B1.3"] },
  { term: "RBAC", full: "Role-Based Access Control", zh: "角色型存取控制", nodes: ["B1.3"] },
  { term: "ACL", full: "Access Control List", zh: "存取控制清單", nodes: ["B1.3"] },
  { term: "VPN", full: "Virtual Private Network", zh: "虛擬私人網路", nodes: ["B1.3"] },

  // B2.1 物聯網硬體設計基礎
  { term: "CPU", full: "Central Processing Unit", zh: "中央處理器", nodes: ["B2.1"] },
  { term: "RAM", full: "Random Access Memory", zh: "隨機存取記憶體", nodes: ["B2.1"] },
  { term: "ROM", full: "Read-Only Memory", zh: "唯讀記憶體", nodes: ["B2.1"] },
  { term: "ISR", full: "Interrupt Service Routine", zh: "中斷服務常式", nodes: ["B2.1"] },

  // B2.2 雲端環境數據收集與平台設計
  { term: "TSDB", full: "Time-Series Database", zh: "時間序列資料庫", nodes: ["B2.2"] },
  { term: "UTC", full: "Coordinated Universal Time", zh: "世界協調時間", nodes: ["B2.2"] },
  { term: "SQL", full: "Structured Query Language", zh: "結構化查詢語言", nodes: ["B2.2"] },

  // B2.3 智慧製造流程優化與成本控制
  { term: "OEE", full: "Overall Equipment Effectiveness", zh: "整體設備效率", nodes: ["B2.3"] },
  { term: "KPI", full: "Key Performance Indicator", zh: "關鍵績效指標", nodes: ["B2.3"] },
  { term: "WIP", full: "Work in Process", zh: "在製品", nodes: ["B2.3"] },
  { term: "ROI", full: "Return on Investment", zh: "投資報酬率", nodes: ["B2.3"] },
  { term: "TCO", full: "Total Cost of Ownership", zh: "總持有成本", nodes: ["B2.3"] },
  { term: "CAPEX", full: "Capital Expenditure", zh: "資本支出", nodes: ["B2.3"] },
  { term: "OPEX", full: "Operating Expenditure", zh: "營運支出", nodes: ["B2.3"] },
];

/** 由縮寫清單生成該節點的「重要縮寫」表——縮寫只有一份來源，不會兩處漂移。 */
const abbrSection = (node: string): StudyNoteSection => ({
  heading: "重要縮寫",
  items: [{
    text: `本節點縮寫（${aiotAbbreviations.filter((a) => a.nodes.includes(node)).length} 個）`,
    table: {
      headers: ["縮寫", "全名", "中文"],
      rows: aiotAbbreviations
        .filter((a) => a.nodes.includes(node))
        .map((a) => [a.term, a.full, a.zh ?? "—"]),
    },
  }],
});

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
              { text: "ML：從資料中學習規律。" },
              { text: "DL：使用多層神經網路自動學習高階特徵。" },
              { text: "Training 是找參數，Inference 是用參數——AIoT 的裝置端幾乎只做後者。" },
            ],
          },
          {
            text: "AIoT 的資料特性：高頻、時間序列、雜訊、缺失值、類別不平衡。難點不在模型本身，而在能否部署、整合與長期維運。",
          },
          {
            text: "三大機器學習範式",
            table: {
              headers: ["範式", "有無標籤", "典型任務", "AIoT 應用"],
              rows: [
                ["Supervised", "有 Label", "Classification、Regression", "故障分類、RUL 預測"],
                ["Unsupervised", "無 Label", "Clustering、Anomaly Detection", "運轉狀態分群、異常偵測"],
                ["Reinforcement", "以 Reward 回饋", "策略最佳化", "HVAC 節能控制"],
              ],
            },
          },
          {
            text: "Classification 輸出類別、Regression 輸出連續數值",
            children: [
              { text: "正常／異常、是哪一種 Fault → Classification。" },
              { text: "剩餘壽命（RUL）、未來溫度、能耗 → Regression。" },
            ],
          },
          {
            text: "深度學習兩大主力",
            table: {
              headers: ["模型", "擅長的資料", "原理關鍵字", "AIoT 典型應用"],
              rows: [
                ["CNN", "影像、空間結構", "Convolution、Local feature", "AOI 瑕疵檢測、LiDAR 點雲"],
                ["RNN / LSTM", "時間序列", "Sequence、Memory、閘控", "振動、電流、溫度趨勢"],
              ],
            },
          },
          {
            text: "Edge AI 的核心理由：Low Latency、Bandwidth Efficiency、Privacy。一句話——能在現場處理的，不一定要把 Raw Data 全部送上 Cloud。",
          },
          {
            text: "從訓練到推論的工程流程",
            flow: [
              "Data Collection",
              "Preprocessing",
              "Model Training",
              "Model Compression",
              "Inference Deployment",
              "Monitoring / Versioning",
            ],
          },
          {
            text: "Model Compression：Quantization 與 Pruning",
            children: [
              { text: "Quantization 例：FP32 → INT8，模型變小、記憶體與功耗降低、推論加速。" },
              { text: "代價是 Accuracy 可能略降，因此要在部署前重新驗證。" },
              { text: "PTQ（訓練後量化）流程簡單；QAT（量化感知訓練）在訓練時就模擬量化誤差，精度較佳但成本高。" },
              { text: "2026 現況：8-bit PTQ 仍是各家推論框架最可靠的預設；權重 4-bit ＋ 激活 8-bit 是進階組合。" },
            ],
          },
          {
            text: "Edge AI 硬體分工",
            table: {
              headers: ["硬體", "角色", "適合"],
              rows: [
                ["CPU", "通用運算", "作業系統、I/O、控制流程"],
                ["GPU", "大量平行運算", "高吞吐、多路攝影機、大模型"],
                ["NPU", "AI 推論加速器", "矩陣運算、INT8 推論、低功耗"],
                ["FPGA", "可重組硬體邏輯", "確定性延遲、客製處理、工業場域"],
              ],
            },
          },
          {
            text: "2026 產業現況（時效性內容，需定期複查）",
            children: [
              { text: "TinyML：跑著某種 TinyML 的 IoT 裝置數在 2026 上看 10 億台，技術已商品化。" },
              { text: "MCU 內建 NPU 成為趨勢，例如 STMicroelectronics STM32N6 整合神經加速器；NXP 則以 Cortex-M 搭配強化 DSP 與 ML 加速，MCU 與應用處理器的界線逐漸模糊。" },
              { text: "SLM 已能在裝置端執行：Microsoft Phi-3 Mini（3.8B）、Google Gemma 2B、Apple 端側約 3B 模型；TinyML 的進展也讓精簡 SLM 有機會跑在 MCU 上做語音喚醒與異常偵測。" },
              { text: "推論框架三強：LiteRT（TensorFlow Lite 改名，保留相容性並強化硬體委派）、ExecuTorch（PyTorch 端側方案，base footprint 約 50 KB，可跑到 MCU）、ONNX Runtime（以 execution provider 對接各家 NPU）。" },
            ],
          },
        ],
      },
      abbrSection("A1.1"),
      {
        heading: "容易混淆",
        items: [
          {
            text: "Training vs Inference",
            children: [{ text: "Training：找參數，通常在雲端或 GPU 工作站。" }, { text: "Inference：用參數，可在邊緣或端側。" }],
          },
          {
            text: "Quantization vs ADC——中文都可能講成「量化」，但層次完全不同",
            children: [
              { text: "Quantization：AI 模型權重的數值精度轉換（FP32 → INT8）。" },
              { text: "ADC：把類比訊號轉成數位值（見 A3.2）。" },
            ],
          },
          { text: "Classification 問 What category；Regression 問 How much。" },
          {
            text: "Edge vs Cloud",
            table: {
              headers: ["面向", "Edge", "Cloud"],
              rows: [
                ["延遲", "低", "高（含來回往返）"],
                ["頻寬需求", "低", "高"],
                ["隱私", "資料可不出場域", "需上傳"],
                ["運算資源", "受限", "充足"],
                ["典型職責", "即時推論、前處理", "訓練、全域分析、長期儲存"],
              ],
            },
          },
          { text: "NPU 重點在推論能效；GPU 重點在平行運算的彈性與吞吐。" },
          { text: "PTQ vs QAT：前者訓練後直接量化、快；後者訓練時模擬量化、準度較好但成本高。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "準確率", formula: { expr: "Accuracy = (TP + TN) / (TP + TN + FP + FN)" } },
          {
            text: "量化的記憶體效益",
            formula: { expr: "FP32 → INT8 = 32 bits → 8 bits", note: "權重儲存空間理論上約降至 1/4" },
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "馬達振動的端側異常偵測",
            flow: ["振動感測器", "時間序列前處理", "LSTM／異常模型", "Edge NPU 推論", "判定異常", "維護告警"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "馬達連續振動資料最適合哪種模型？→ RNN / LSTM。" },
          { text: "FP32 → INT8 是什麼技術？→ Quantization（不是 ADC）。" },
          { text: "Edge AI 的主要優勢「不」包含？常見干擾項為「提高原始資料上傳量」。" },
          { text: "NPU 的主要用途？→ AI 推論加速；通用運算仍由 CPU 負責。" },
          { text: "想在 MCU 上跑模型但記憶體不足，最直接的手段？→ 量化與剪枝等模型壓縮。" },
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
              { text: "LiteRT／ExecuTorch 的 Getting Started（了解端側部署流程即可）。" },
            ],
          },
          { text: "延伸但初級不用深入：Transformer 架構、反向傳播推導、LLM 訓練細節。" },
        ],
      },
    ],
    "A1.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "所有 AIoT 案例都能用同一個框架拆解",
            flow: ["Input（感測）", "Transport（傳輸）", "Process / AI（處理）", "Action（行動）", "Security（貫穿全程）"],
          },
          {
            text: "三種維護策略的分野",
            table: {
              headers: ["策略", "觸發依據", "缺點"],
              rows: [
                ["Breakdown（事後）", "壞了才修", "非計畫停機成本最高"],
                ["Preventive（定期）", "固定週期", "過度保養或仍會突發故障"],
                ["Predictive（預測）", "實際狀態與劣化趨勢", "需感測資料與模型維運"],
              ],
            },
          },
          {
            text: "Diagnosis vs Prognosis",
            children: [
              { text: "Diagnosis：現在出了什麼問題？→ Classification。" },
              { text: "Prognosis：還能撐多久？→ Regression / RUL。" },
            ],
          },
          { text: "Sensor Fusion：整合互補的感測器（例 Camera + LiDAR）以提升 Robustness，不是感測器越多越好。" },
          { text: "四大場域：Smart Factory、Smart Agriculture、Smart Transportation、Smart Home。" },
          {
            text: "2026 產業現況（時效性內容，需定期複查）",
            children: [
              { text: "Gartner 預測到 2030 年，半自主 AI agent 將編排約 10% 的生產、品質與維護作業（今日約 2%），且人類保留最終核可權。" },
              { text: "數位分身（Digital Twin）2026 的採用預估成長約 35%，並從「預測結果」走向「閉迴路自動執行」。" },
              { text: "AI agent 開始自動排維修工單、叫料與調參數，而不只是發出告警。" },
            ],
          },
        ],
      },
      abbrSection("A1.2"),
      {
        heading: "容易混淆",
        items: [
          { text: "Preventive 是定期；Predictive 是依實際狀態。" },
          { text: "Diagnosis 談現在；Prognosis 談未來。" },
          { text: "Sensor Fusion 的目的是互補資訊與強健性，不是單純增加感測器數量（成本反而上升）。" },
          { text: "Digital Twin 是實體資產的數位分身與模擬；不等於單純的儀表板或 3D 模型。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "RUL 的概念式（初級只需掌握概念）",
            formula: { expr: "目前狀態 + 劣化趨勢 → 預估失效時間", note: "輸出為連續數值，屬 Regression" },
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "智慧農業：大面積、電池供電、少量資料",
            flow: ["土壤濕度／溫濕度感測", "LoRa", "Gateway", "Cloud", "預測模型", "自動灌溉"],
          },
          {
            text: "2026 實例：GE Aerospace 以 AI 驅動的數位分身監看噴射引擎機隊，近十年做到預防性維護提前 60% 前置時間、誤報減半。",
          },
          {
            text: "2026 實例：PepsiCo 以 Siemens Digital Twin Composer 為美國製造與倉儲廠建立物理級精度的數位分身，AI agent 持續監看現場資料、標記異常並直接向操作員建議修正動作。",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "大面積農田＋電池感測器＋少量資料 → LoRa / LPWAN。" },
          { text: "判斷馬達正常／異常 → Diagnosis / Classification。" },
          { text: "預估軸承還能撐 20 天 → Prognosis / Regression。" },
          { text: "導入 AIoT 的效益要如何衡量？→ 停機時間、良率、維護成本等可量化 KPI（接 B2.3）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 官方四大 AIoT 應用案例。" },
          { text: "Predictive Maintenance 基本案例與導入前提（資料量、標註、感測覆蓋）。" },
        ],
      },
    ],
    "A2.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "IoT 三層架構（由下而上）",
            table: {
              headers: ["層", "職責", "典型元件"],
              rows: [
                ["Perception 感知層", "取得物理量、執行動作", "Sensor、Actuator、RFID、NFC"],
                ["Network 網路層", "連線、繞送、協定轉換", "Gateway、Router、無線模組"],
                ["Application 應用層", "儲存、分析、呈現、商業邏輯", "Cloud、DB、AI、Dashboard"],
              ],
            },
          },
          {
            text: "Gateway 的五個角色",
            children: [
              { text: "協定轉換（Protocol Conversion）——最常考的一項。" },
              { text: "匯聚（Aggregation）、過濾（Filtering）。" },
              { text: "邊緣處理（Edge Processing）、安全把關（Security）。" },
              { text: "典型路徑：Zigbee → Gateway → TCP/IP。" },
            ],
          },
          {
            text: "Edge vs Gateway：一台 Gateway 可以同時是 Edge Computer，但概念不同——Gateway 談「連接異質網路」，Edge 談「在資料來源附近運算」。",
          },
          {
            text: "OSI 七層與 TCP/IP 四層的對應",
            table: {
              headers: ["OSI", "TCP/IP", "代表協定／單位"],
              rows: [
                ["7 Application / 6 Presentation / 5 Session", "Application", "HTTP、MQTT、CoAP"],
                ["4 Transport", "Transport", "TCP、UDP（Segment）"],
                ["3 Network", "Internet", "IP、ICMP（Packet）"],
                ["2 Data Link / 1 Physical", "Link", "Ethernet MAC、Wi-Fi（Frame／Bit）"],
              ],
            },
          },
          {
            text: "2026 新類別：Ambient IoT——靠環境能量採集或無線供電運作的「無電池」裝置，目標是解決每日大量廢棄電池的問題，適合超低功耗的標籤與感測。",
          },
        ],
      },
      abbrSection("A2.1"),
      {
        heading: "容易混淆",
        items: [
          {
            text: "Switch / Router / Gateway",
            table: {
              headers: ["裝置", "工作層", "依據"],
              rows: [
                ["Switch", "L2 資料連結層", "MAC 位址"],
                ["Router", "L3 網路層", "IP 位址與路由表"],
                ["Gateway", "可到 L7", "協定／應用層轉換"],
              ],
            },
          },
          { text: "L2 談 MAC 與 Frame；L3 談 IP、Packet 與 Routing。" },
          { text: "Edge 做本地決策；Cloud 做集中處理。兩者是分工，不是取代。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "傳輸時間", formula: { expr: "T = Data Size / Data Rate", note: "實際還要加上協定 overhead 與重傳" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "典型端到雲路徑", flow: ["溫度感測器", "Zigbee", "Gateway", "Ethernet", "Cloud", "Dashboard"] },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "IP 屬於 OSI 哪一層？→ Network Layer（L3）。" },
          { text: "TCP？→ Transport Layer（L4）。Ethernet MAC？→ Data Link（L2）。" },
          { text: "Gateway 最大作用？→ 異質協定／網路的轉換。" },
          { text: "感測器屬於哪一層？→ 感知層。" },
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
            table: {
              headers: ["面向", "TCP", "UDP"],
              rows: [
                ["連線", "連線導向", "非連線"],
                ["可靠性", "保證送達、可重傳", "不保證"],
                ["順序", "有序", "不保證"],
                ["Overhead", "高", "低"],
                ["延遲", "較高", "低"],
                ["適用", "需可靠的資料", "即時影音、可容忍丟包"],
              ],
            },
          },
          {
            text: "MQTT 的發布訂閱模型",
            flow: ["Publisher", "Broker", "Subscriber"],
            children: [
              { text: "核心概念：Topic、Publish／Subscribe、Broker、QoS、Retain、Last Will。" },
              { text: "與 HTTP 最大的不同是「解耦」——發布者不需要知道誰在訂閱。" },
            ],
          },
          {
            text: "MQTT 的三個 QoS 等級",
            table: {
              headers: ["等級", "語意", "重複可能", "成本"],
              rows: [
                ["QoS 0", "At most once（最多一次）", "不會重複，但可能遺失", "最低"],
                ["QoS 1", "At least once（至少一次）", "可能重複", "中"],
                ["QoS 2", "Exactly once（剛好一次）", "不重複不遺失", "最高"],
              ],
            },
          },
          { text: "HTTP / REST 常見方法：GET（讀）、POST（新增）、PUT（更新）、DELETE（刪除）。CoAP 則是為受限裝置設計的輕量版、跑在 UDP 上。" },
          {
            text: "無線技術的取捨（最常考的一張表）",
            table: {
              headers: ["技術", "距離", "功耗", "資料率", "典型應用"],
              rows: [
                ["Wi-Fi", "短中", "高", "高", "攝影機、影像"],
                ["BLE", "短", "很低", "低", "穿戴、信標"],
                ["Zigbee", "短中（Mesh）", "低", "低", "感測器網路、智慧家庭"],
                ["LoRaWAN", "長（公里級）", "很低", "很低", "農業、水電表"],
                ["NB-IoT", "長（電信涵蓋）", "低", "低", "廣域資產追蹤"],
                ["5G RedCap", "電信涵蓋", "中", "中", "工業相機、穿戴、監控"],
                ["NFC", "公分級", "極低", "低", "門禁、支付"],
              ],
            },
          },
          {
            text: "2026 連網技術現況（時效性內容，需定期複查）",
            children: [
              { text: "Matter 1.5（2025-11-20 發布）首度納入攝影機與視訊門鈴的標準模型，並擴充門窗遮蔽、土壤感測、能源費率、智慧電表與 EV 充電行為。" },
              { text: "Thread 1.4 自 2026-01-01 起成為 Thread 聯盟唯一認證的版本，讓不同品牌裝置能加入同一個 mesh。" },
              { text: "Wi-Fi 7 與 Thread 的協定不同，需要 Matter 作為轉譯層才能互通。" },
              { text: "5G RedCap（NR-Light）補上「不需完整 5G 規格」的中階裝置缺口，eRedCap 模組自 2026 起陸續出貨。" },
            ],
          },
        ],
      },
      abbrSection("A2.2"),
      {
        heading: "容易混淆",
        items: [
          {
            text: "MQTT vs HTTP",
            table: {
              headers: ["面向", "MQTT", "HTTP"],
              rows: [
                ["互動模型", "Publish / Subscribe", "Request / Response"],
                ["中介", "需要 Broker", "不需要"],
                ["驅動方式", "事件驅動", "用戶端主動要求"],
                ["Overhead", "低", "較高"],
                ["適用", "裝置遙測、一對多", "Web API、單次查詢"],
              ],
            },
          },
          {
            text: "TCP vs MQTT 不是同一層：TCP 是傳輸層協定，MQTT 是應用層協定且通常跑在 TCP 之上。",
          },
          { text: "LoRa 是實體層的無線調變技術；LoRaWAN 是其上的網路／MAC 架構。" },
          { text: "BLE 走低功耗與感測情境；Bluetooth Classic 走持續性、較高吞吐的應用（如音訊）。" },
          { text: "NFC 距離極短且雙向互動能力強；RFID 範圍較廣，主要做識別。" },
          { text: "Zigbee 是自組 Mesh 的無線協定；Matter 是跨品牌的應用層互通標準，兩者不在同一層。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "RF 鏈路預算直覺",
            formula: { expr: "Received Power ≈ Transmit Power + Gains − Losses" },
          },
          {
            text: "實際吞吐",
            formula: { expr: "Throughput < Link Rate", note: "差距來自協定 overhead、重傳與干擾" },
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "農業感測 → LoRa；攝影機影像 → Wi-Fi／Ethernet／5G；穿戴 → BLE；門禁 → NFC；上雲遙測 → MQTT。" },
          { text: "同一座工廠常同時存在多種技術，Gateway 負責把它們收斂成一致的上行格式。" },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "長距離＋低功耗＋少量感測資料 → LoRaWAN。" },
          { text: "Publish / Subscribe → MQTT；Request / Response → HTTP。" },
          { text: "要求低延遲但不需重傳 → UDP。" },
          { text: "要求「剛好一次」的送達語意 → MQTT QoS 2。" },
          { text: "跨品牌智慧家庭裝置互通 → Matter（搭配 Thread 或 Wi-Fi）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OASIS MQTT 5.0 官方規格。" },
          { text: "LoRa Alliance：LoRaWAN overview。" },
          { text: "Connectivity Standards Alliance：Matter 與 Thread 規格說明。" },
          { text: "3GPP / GSMA：NB-IoT 與 RedCap overview。" },
        ],
      },
    ],
    "A2.3": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "OPC UA 不只是一個 Protocol，它同時包含四件事",
            children: [
              { text: "Communication：怎麼傳。" },
              { text: "Security：認證、加密、簽章內建於規範。" },
              { text: "Information Model：資料的結構與型別。" },
              { text: "Semantics：資料代表什麼意義。" },
            ],
          },
          {
            text: "典型工業資料鏈",
            flow: ["PLC", "OPC UA Server", "OPC UA Client", "SCADA / MES / Cloud / AI"],
            children: [
              { text: "Server 對外揭露 Address Space；Client 讀寫其中的節點。" },
              { text: "OPC UA PubSub 則是 Publisher → Subscriber 的發布訂閱模式。" },
            ],
          },
          {
            text: "MTConnect 專注於製造設備（尤其工具機）的資料",
            flow: ["Device", "Adapter", "Agent", "Application"],
          },
          {
            text: "Information Model 不是只有 value = 55，而是「資料 ＋ 意義 ＋ 關聯」",
            children: [
              { text: "例：Spindle 底下掛 Speed、State、Temperature，且各自有單位與型別。" },
              { text: "沒有資訊模型，上層就得為每一台機器寫一套對照表——這正是互通性的痛點。" },
            ],
          },
          {
            text: "2026 工業通訊現況（時效性內容，需定期複查）",
            children: [
              { text: "MQTT Sparkplug B 補上 MQTT 原本缺的三件事：資料模型、狀態管理、標準化的 Topic 命名空間；它已於 2023 年成為 ISO/IEC 國際標準。" },
              { text: "Unified Namespace（UNS）成為廠級資料架構的主流樣式：全廠事件以單一命名空間匯流，各系統各取所需。" },
              { text: "實務分工是「機台網用 OPC UA 處理複雜 PLC 結構、廠級事件流用 MQTT + Sparkplug B」，而不是二選一。" },
              { text: "OPC UA over TSN 提供乙太網路上的即時、確定性傳輸。" },
              { text: "OPC UA PubSub 雖在規範內，但生產級 broker 實作與採用度仍遠不及 MQTT 生態。" },
            ],
          },
        ],
      },
      abbrSection("A2.3"),
      {
        heading: "容易混淆",
        items: [
          {
            text: "四種工業資料技術的定位",
            table: {
              headers: ["技術", "本質", "強項"],
              rows: [
                ["Modbus", "暫存器導向的通訊", "簡單、老設備普及"],
                ["OPC UA", "互通架構＋語意＋安全", "跨品牌整合、資訊模型"],
                ["MQTT", "訊息傳輸", "輕量、解耦、雲原生"],
                ["MTConnect", "製造設備資料語意", "工具機監控與標準化"],
              ],
            },
          },
          { text: "Protocol 講「怎麼送」；Information Model 講「資料代表什麼」。這是本節點最核心的分野。" },
          { text: "MQTT 本身沒有資料模型；要有模型與狀態管理得加上 Sparkplug B。" },
          { text: "ISA-95 是企業與控制系統整合的分層標準（L0 現場～L4 ERP），不是通訊協定。" },
        ],
      },
      { heading: "公式與計算", items: [{ text: "本節點無重要公式，重點在標準的定位與分工。" }] },
      {
        heading: "實務案例",
        items: [
          {
            text: "多品牌 PLC 的整合",
            flow: ["PLC A / B / C", "OPC UA", "MES", "AI 預測性維護"],
          },
          {
            text: "2026 常見的混合架構：機台側以 OPC UA 取值，再由邊緣閘道以 MQTT + Sparkplug B 發佈到全廠的 Unified Namespace，雲端與 AI 皆從 UNS 訂閱。",
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "不同品牌 PLC 要整合到上層系統 → OPC UA。" },
          { text: "製造機台需要標準化資料模型 → MTConnect。" },
          { text: "OPC UA 最大價值 → 互通性與具語意的資訊模型（不是速度最快）。" },
          { text: "要在乙太網路上取得確定性即時傳輸 → TSN。" },
          { text: "MQTT 缺乏資料模型與狀態管理，業界的補法 → Sparkplug B。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OPC Foundation：OPC UA Overview、Part 1 Overview and Concepts。" },
          { text: "MTConnect 官方 Getting Started。" },
          { text: "Eclipse Sparkplug 規範與 Unified Namespace 介紹。" },
        ],
      },
    ],
    "A2.4": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "Middleware 是 Hardware／Device 與 Application 之間的抽象層",
            children: [
              { text: "職能：協定轉換、訊息傳遞、資料正規化、API、裝置管理、資料儲存。" },
              { text: "沒有中介層，每個應用都要自己面對每一種裝置與協定。" },
            ],
          },
          { text: "常見元件：MQTT Broker（Mosquitto、EMQX、HiveMQ）、流程整合工具（Node-RED）、時序資料庫（InfluxDB）、視覺化（Grafana）。" },
          {
            text: "REST API 的資料路徑",
            flow: ["Client", "HTTP 請求", "REST API", "Backend", "Database"],
          },
          {
            text: "雲端服務模型",
            table: {
              headers: ["模型", "你管什麼", "例子"],
              rows: [
                ["IaaS", "作業系統以上全部", "虛擬機、儲存"],
                ["PaaS", "只管應用與資料", "託管執行環境、託管資料庫"],
                ["SaaS", "只管使用", "現成的雲端服務"],
              ],
            },
          },
          {
            text: "資料格式與資料庫",
            table: {
              headers: ["選項", "特性", "適合"],
              rows: [
                ["JSON", "輕量、易讀、Web 原生", "裝置遙測、API"],
                ["XML", "結構嚴謹、可驗證", "既有企業系統交換"],
                ["SQL", "關聯、交易一致性", "主檔、訂單、設定"],
                ["NoSQL", "彈性結構、水平擴展", "半結構化資料"],
                ["Time-series DB", "以時間戳為核心、壓縮率高", "感測器資料流"],
              ],
            },
          },
        ],
      },
      abbrSection("A2.4"),
      {
        heading: "容易混淆",
        items: [
          { text: "Protocol 是通訊規則；API 是軟體介面；Broker 做訊息路由；Gateway 做網路／協定橋接。四者常同時出現在一張架構圖上。" },
          { text: "SQL 擅長關聯查詢；Time-series DB 擅長「同一個裝置隨時間變化」的查詢。" },
          { text: "PaaS 與 SaaS 的分界在於「你是否還要寫應用程式」。" },
        ],
      },
      { heading: "公式與計算", items: [{ text: "本節點無主要公式；容量估算請見 B2.2。" }] },
      {
        heading: "實務案例",
        items: [
          {
            text: "最常見的開源組合",
            flow: ["ESP32", "MQTT", "Mosquitto Broker", "Node-RED", "InfluxDB", "Grafana"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "GET 對應 CRUD 的哪一項？→ Read；POST → Create。" },
          { text: "提供開發與執行環境的雲端模型？→ PaaS。" },
          { text: "負責 MQTT 訊息路由的元件？→ Broker。" },
          { text: "大量感測資料要存哪種資料庫？→ Time-series DB。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "Node-RED Getting Started。" },
          { text: "Eclipse Mosquitto 文件。" },
          { text: "InfluxDB / Grafana tutorials。" },
        ],
      },
    ],
    "A2.5": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "資安三要素 CIA",
            table: {
              headers: ["要素", "保護什麼", "常見手段"],
              rows: [
                ["Confidentiality 機密性", "不該看的人看不到", "加密、存取控制"],
                ["Integrity 完整性", "資料沒有被竄改", "Hash、數位簽章"],
                ["Availability 可用性", "服務持續可用", "備援、抗 DDoS"],
              ],
            },
          },
          {
            text: "AAA：Authentication（你是誰）、Authorization（你能做什麼）、Accounting／Auditing（你做了什麼）。",
          },
          {
            text: "加密與雜湊的分工",
            table: {
              headers: ["技術", "方向", "主要提供"],
              rows: [
                ["對稱式加密", "同一把金鑰加解密", "機密性、速度快"],
                ["非對稱式加密", "公鑰加密／私鑰解密", "金鑰交換、身分驗證"],
                ["Hash", "單向、不可逆", "完整性"],
                ["數位簽章", "私鑰簽、公鑰驗", "完整性＋真實性＋不可否認"],
              ],
            },
          },
          { text: "TLS 提供傳輸層的安全性（加密＋伺服器身分驗證），是 IoT 上雲的基本要求。" },
          {
            text: "常見 IoT 攻擊：MITM、DoS／DDoS、Botnet、密碼攻擊、韌體竄改、實體除錯介面（JTAG/UART）攻擊。",
          },
          {
            text: "裝置端防護清單",
            children: [
              { text: "Secure Boot：執行前驗證韌體簽章。" },
              { text: "Signed Firmware 與安全的 OTA 更新通道。" },
              { text: "每台唯一的憑證或密碼——預設密碼是最常見的重大風險。" },
              { text: "關閉或保護量產品的 debug port。" },
            ],
          },
          { text: "Privacy by Design（PbD）：在架構設計階段就納入隱私，例如在邊緣端就去識別化，只上傳特徵值或骨架資訊。" },
          {
            text: "2026 法規時程（時效性內容，且很適合出考題）",
            children: [
              { text: "歐盟 CRA（網路韌性法，Regulation 2024/2847）要求連網產品 secure by design、提供 SBOM（CycloneDX／SPDX 格式）。" },
              { text: "CRA 的漏洞與事件通報義務自 2026-09-11 生效，已遭利用的漏洞須於 24 小時內通報；全部要求於 2027-12-11 全面適用。" },
              { text: "CRA 的支援期要求：取產品宣告支援期、預期壽命與「至少 5 年」三者中較長者。" },
              { text: "歐盟 AI Act 於 2026-05-07 的 Digital Omnibus 協議後大幅調整時程：Annex III 高風險義務自 2026-08-02 延至 2027-12-02，Annex I（含無線電設備等產品法規類）自 2027-08-02 延至 2028-08-02，合成內容標示義務延至 2026-12-02，各國監理沙盒延至 2027-08-02。" },
            ],
          },
        ],
      },
      abbrSection("A2.5"),
      {
        heading: "容易混淆",
        items: [
          { text: "Authentication 談身分；Authorization 談權限。情境題最愛在這裡設陷阱。" },
          { text: "Encryption 提供機密性；Hash 提供完整性。Hash 不是加密（不可逆、也不用來還原）。" },
          { text: "數位簽章同時提供完整性、真實性與不可否認性——比單純 Hash 多兩項。" },
          { text: "DoS 來自單一或有限來源；DDoS 來自分散的大量來源（常由 Botnet 發動）。" },
          { text: "Secure Boot 驗的是「韌體可不可以執行」；TLS 保的是「傳輸中的資料」。兩者不能互相取代。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "風險的定性估算", formula: { expr: "Risk ≈ Likelihood × Impact" } },
          { text: "CRA 支援期", formula: { expr: "支援期 = max(宣告支援期, 預期壽命, 5 年)" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "一台合規的 IoT 攝影機",
            flow: ["Secure Boot", "唯一裝置憑證", "TLS 上雲", "IAM 權限控管", "Audit Log", "安全 OTA 更新"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "Hash 最主要提供？→ Integrity。" },
          { text: "防止中間人讀取傳輸資料 → TLS。" },
          { text: "大量被入侵的 IoT 裝置攻擊伺服器 → Botnet／DDoS。" },
          { text: "「在邊緣端只傳特徵值、不傳原始影像」體現哪個原則？→ Privacy by Design。" },
          { text: "歐盟要求連網產品提供軟體元件清單，指的是？→ SBOM。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OWASP IoT Security Guidance（含 Top 10）。" },
          { text: "NIST IoT Cybersecurity guidance。" },
          { text: "歐盟 CRA（Regulation 2024/2847）官方說明頁。" },
        ],
      },
    ],
    "A3.1": [
      {
        heading: "必懂觀念",
        items: [
          { text: "Sensor 的本質：把物理量轉成電氣或數位表示。" },
          {
            text: "感測器的量測特性（選型時逐項對規格書）",
            table: {
              headers: ["特性", "意義"],
              rows: [
                ["Range 量程", "可量測的上下限"],
                ["Resolution 解析度", "可分辨的最小變化"],
                ["Accuracy 準確度", "與真值的接近程度"],
                ["Precision 精密度", "重複量測的一致性"],
                ["Sensitivity 靈敏度", "輸出變化／輸入變化"],
                ["Linearity 線性度", "輸出與輸入是否成正比"],
                ["Response time 響應時間", "跟得上多快的變化"],
              ],
            },
          },
          {
            text: "必會感測器對照",
            table: {
              headers: ["感測器", "量什麼", "原理關鍵字"],
              rows: [
                ["PIR", "人體移動", "被動接收紅外線變化"],
                ["Thermistor / NTC", "溫度", "電阻隨溫度變化"],
                ["濕度感測器", "相對濕度 RH", "電容式或電阻式"],
                ["Ultrasonic", "距離", "Time of Flight"],
                ["Accelerometer", "線性加速度", "MEMS"],
                ["Gyroscope", "角速度", "MEMS 科氏力"],
                ["IMU", "姿態", "加速度計 ＋ 陀螺儀"],
                ["LDR", "光照度", "光越強電阻越低"],
                ["Gas Sensor", "氣體濃度", "化學電阻變化"],
              ],
            },
          },
          { text: "PIR 的兩個限制常入題：無法辨識身分，也不擅長偵測完全靜止的人體。" },
          { text: "2026 補充：Matter 1.5 已納入土壤感測（soil sensor）的標準模型，農業與園藝場域的感測器互通性提升。" },
        ],
      },
      abbrSection("A3.1"),
      {
        heading: "容易混淆",
        items: [
          {
            text: "Accuracy vs Precision——最常考的一組",
            table: {
              headers: ["情況", "Accuracy", "Precision"],
              rows: [
                ["每次都準", "高", "高"],
                ["每次都偏同一個量", "低", "高"],
                ["每次結果分散但平均接近真值", "高（平均）", "低"],
              ],
            },
          },
          { text: "Accelerometer 量線性加速度；Gyroscope 量角速度。兩者合起來才是 IMU。" },
          { text: "PIR 偵測「移動」；Ultrasonic 量「距離」；LDR 量「光」。情境題靠這個直接對應。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "超音波測距",
            formula: { expr: "d = (v × t) / 2", note: "除以 2 是因為聲波來回；空氣中 v ≈ 340 m/s" },
          },
          { text: "重力加速度換算", formula: { expr: "1 g ≈ 9.81 m/s²" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "機器人避障 → Ultrasonic；無人機姿態 → IMU；路燈自動點滅 → LDR；工廠振動監測 → Accelerometer。" },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "要量角速度 → Gyroscope。要量距離 → Ultrasonic。" },
          { text: "MEMS 三軸振動量測 → Accelerometer。" },
          { text: "「每次量都偏高 0.5 度」屬於？→ 準確度問題（精密度仍可能很好）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 官方指引的 Sensor 章節。" },
          { text: "Adafruit Learning System、SparkFun Sensor tutorials。" },
        ],
      },
    ],
    "A3.2": [
      {
        heading: "必懂觀念",
        items: [
          { text: "Analog 是連續電壓；Digital 是離散數值。感測器多為類比，MCU 內部為數位，中間靠 ADC。" },
          {
            text: "ADC 的三個關鍵參數",
            children: [
              { text: "Resolution（位元數）：決定能分幾階。" },
              { text: "Reference voltage（Vref）：決定量測範圍。" },
              { text: "Sampling rate（取樣率）：決定跟得上多快的訊號。" },
            ],
          },
          { text: "GPIO 是通用數位輸入輸出；PWM 以脈波寬度控制等效輸出（調光、調速）。" },
          {
            text: "三種序列介面",
            table: {
              headers: ["", "UART", "I²C", "SPI"],
              rows: [
                ["時脈線", "無（非同步）", "有（SCL）", "有（SCLK）"],
                ["資料線", "TX / RX", "SDA（雙向）", "MOSI / MISO"],
                ["裝置選擇", "靠實體接線", "靠位址 Address", "靠 CS 腳位"],
                ["速度", "中等", "中等", "高"],
                ["多裝置", "弱（點對點）", "強", "強（每台一條 CS）"],
                ["全雙工", "是", "否", "是"],
                ["典型週邊", "GPS、除錯輸出", "溫濕度、EEPROM", "外接 Flash、顯示器"],
              ],
            },
          },
        ],
      },
      abbrSection("A3.2"),
      {
        heading: "容易混淆",
        items: [
          { text: "ADC 是 Analog → Digital；DAC 是 Digital → Analog。" },
          { text: "PWM 輸出的是數位脈波（靠平均值等效）；DAC 輸出的才是真正的類比電壓。" },
          { text: "訊號量化（ADC）與模型量化（A1.1 的 Quantization）中文都叫量化，但一個處理訊號、一個處理權重。" },
          { text: "I²C 用位址、SPI 用 CS——「兩條線就能掛多裝置」是 I²C 的招牌。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "ADC 階數", formula: { expr: "Levels = 2^N", note: "12-bit → 2^12 = 4096 階" } },
          {
            text: "ADC 解析度",
            formula: { expr: "Resolution = Vref / 2^N", note: "12-bit、3.3 V → 3.3 / 4096 ≈ 0.806 mV" },
          },
          { text: "Nyquist 取樣定理", formula: { expr: "f_s ≥ 2 × f_max", note: "取樣率不足會產生頻疊（aliasing）" } },
          { text: "PWM 責任週期", formula: { expr: "Duty = (T_ON / T) × 100%" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "溫濕度感測器 → I²C；外接 Flash → SPI；GPS 模組 → UART；光敏電阻 → ADC；馬達轉速 → PWM。" },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "兩條線＋以位址定址 → I²C。" },
          { text: "最快、且有 MOSI／MISO → SPI。TX/RX 成對 → UART。" },
          { text: "12-bit ADC 有幾階？→ 4096。" },
          { text: "訊號最高頻率 1 kHz，取樣率至少要多少？→ 2 kHz（Nyquist）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "ESP-IDF 的 UART / I²C / SPI 官方文件。" },
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
            text: "完整 IoT 架構鏈",
            flow: [
              "Physical Asset",
              "Sensor / Actuator",
              "MCU",
              "Gateway / Edge",
              "Network",
              "Broker / API",
              "Database",
              "Application",
              "AI / Analytics",
            ],
          },
          {
            text: "每個元件為什麼存在（要能逐一回答）",
            table: {
              headers: ["元件", "職責", "拿掉會怎樣"],
              rows: [
                ["Sensor", "取得物理量", "系統沒有輸入"],
                ["Actuator", "執行物理動作", "只能看不能動"],
                ["MCU", "本地控制與前處理", "所有判斷都得上雲"],
                ["Gateway", "協定轉換與匯聚", "異質裝置無法互通"],
                ["Broker", "訊息路由與解耦", "每個應用都要直連裝置"],
                ["Database", "保存時序與狀態", "無法回溯與訓練模型"],
                ["Edge", "就近即時判斷", "延遲受網路支配"],
                ["Cloud", "集中分析與長期儲存", "無法跨場域彙整"],
              ],
            },
          },
          {
            text: "控制迴路（閉迴路）",
            flow: ["Sensor 量測", "Controller 判斷", "Actuator 執行", "Physical System 改變", "回到 Sensor"],
          },
          {
            text: "IT 與 OT 的差異——這是工業場域最常見的組織與技術衝突點",
            table: {
              headers: ["面向", "IT", "OT"],
              rows: [
                ["首要目標", "資料機密性", "產線可用性與安全"],
                ["可停機性", "可排維護窗口", "停機成本極高"],
                ["更新頻率", "頻繁", "保守、需驗證"],
                ["生命週期", "3～5 年", "10～20 年"],
              ],
            },
          },
          { text: "2026 趨勢：AI agent 從「發告警」走向「自動排工單、叫料、調參數」，但人類保留最終核可權，因此系統設計要留下審核與回溯的介面。" },
        ],
      },
      abbrSection("B1.1"),
      {
        heading: "容易混淆",
        items: [
          { text: "Sensor 是 input；Actuator 是 output（實際的物理動作）。" },
          { text: "PLC 是工業級、具確定性的控制器；MCU 是嵌入式控制器。工業現場的即時控制通常交給 PLC。" },
          {
            text: "工廠資訊系統的三層",
            table: {
              headers: ["系統", "管什麼", "時間尺度"],
              rows: [
                ["SCADA", "現場監控與監督式控制", "秒級"],
                ["MES", "製造執行、工單與追溯", "分鐘～小時"],
                ["ERP", "企業資源與訂單規劃", "天～月"],
              ],
            },
          },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "端到端延遲",
            formula: {
              expr: "T_total = T_sensor + T_network + T_processing + T_actuation",
              note: "即時控制若把 T_network 放到雲端來回，抖動會直接吃掉裕度",
            },
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "從振動到工單的完整鏈路",
            flow: ["振動感測器", "PLC / Edge", "OPC UA", "MES", "AI 分析", "維護工單"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "哪一層應負責協定轉換？→ Gateway。" },
          { text: "即時控制最不應依賴什麼？→ 遠端 Cloud 的來回往返。" },
          { text: "工單與生產追溯屬於哪個系統？→ MES。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "iPAS 科目一的架構章節（考科二可共用）。" },
          { text: "Industrial IoT reference architectures、ISA-95 分層概念。" },
        ],
      },
    ],
    "B1.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "由下而上的排查順序——先確認底層，再往上爬",
            flow: ["Power", "Physical", "Link", "Network", "Transport", "Protocol", "Application", "Data"],
          },
          {
            text: "六個檢查站與該問的問題",
            table: {
              headers: ["層", "先問什麼", "常見兇手"],
              rows: [
                ["電源", "電壓？電流？接地？線材？", "供電不足、共地未接"],
                ["感測器", "有原始資料嗎？校正過嗎？", "量程錯、線序反"],
                ["介面", "UART baud？I²C 位址？SPI 的 CS？", "位址衝突、鮑率不符"],
                ["網路", "鏈路？IP？子網路？閘道？DNS？", "DHCP 沒拿到、子網路錯"],
                ["伺服器", "Port？防火牆？Broker？認證？", "1883/8883 被擋、帳密錯"],
                ["應用", "Topic？Payload？JSON？寫入 DB？", "Topic 打錯、欄位型別不符"],
              ],
            },
          },
          { text: "排查的心法：每一步都要能「證明」而不是「猜」——量電壓、看 log、抓封包、訂閱同一個 Topic 驗證。" },
        ],
      },
      abbrSection("B1.2"),
      {
        heading: "容易混淆",
        items: [
          { text: "Ping 得通 ≠ MQTT 一定連得上（可能卡在 port、TLS 或認證）。" },
          { text: "Broker 連得到 ≠ Topic 一定正確（訂閱錯 Topic 會安靜地什麼都收不到）。" },
          { text: "Sensor 有資料 ≠ 資料格式正確（JSON 少一個引號，整筆就進不了 DB）。" },
          { text: "RSSI 是訊號強度、SNR 是訊雜比——訊號強但雜訊更強，一樣收不到。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "封包遺失率", formula: { expr: "Packet Loss = (Lost / Sent) × 100%" } },
          { text: "可用率", formula: { expr: "Availability = Uptime / Total Time" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "「Dashboard 沒資料」的逐層排查",
            flow: ["Sensor", "MCU", "Wi-Fi", "IP", "Broker", "帳密", "Topic", "Payload", "DB", "Dashboard"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "I²C 感測器沒有回應，最先檢查什麼？→ 電源／接線／位址。" },
          { text: "可以 Ping 到 Broker 但 MQTT 連線失敗？→ Port、TLS、認證或設定。" },
          { text: "資料偶爾才進得來，最可能的量測指標？→ 封包遺失率、RSSI／SNR。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "Wireshark basics、MQTT Explorer。" },
          { text: "ping / traceroute / nslookup 的判讀。" },
        ],
      },
    ],
    "B1.3": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "分層防護（Security by layers）",
            table: {
              headers: ["層", "做什麼"],
              rows: [
                ["Device", "Secure Boot、韌體簽章、安全 OTA、唯一憑證、關閉 debug port"],
                ["Network", "TLS、防火牆、VPN、網段隔離"],
                ["Platform", "IAM、最小權限、稽核、備份"],
                ["Application", "認證、授權、輸入驗證"],
              ],
            },
          },
          { text: "Defense in Depth：任何單一防線都會被突破，所以要多層並行。只靠一道雲端防火牆是典型的錯誤答案。" },
          { text: "最小權限原則（Least Privilege）：每個身分只拿它需要的權限，配合 RBAC 落實。" },
          { text: "2026 合規要求：CRA 的 secure by design、SBOM 與最短 5 年支援期，把「安全」從一次性設計變成整個生命週期的義務（詳見 A2.5 的時程）。" },
        ],
      },
      abbrSection("B1.3"),
      {
        heading: "容易混淆",
        items: [
          { text: "Firewall 管網路流量政策；IAM 管身分與權限。兩者不是同一件事。" },
          { text: "Secure Boot 在執行前驗證韌體；Encryption 保護資料機密性。" },
          { text: "VPN 保護的是「通道」，不代表端點本身是安全的。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "風險估算", formula: { expr: "Risk ≈ Likelihood × Impact", note: "用於決定先修哪一個漏洞" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "一台合規智慧攝影機的防護堆疊",
            flow: ["簽章韌體", "唯一憑證", "TLS", "RBAC", "Audit log", "SBOM 與漏洞通報流程"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "IoT 安全的最佳設計？→ 多層防護，而非單一 Cloud firewall。" },
          { text: "出廠預設密碼相同 → 重大風險（Botnet 最愛）。" },
          { text: "要證明「這個韌體是原廠的」→ 數位簽章＋Secure Boot。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OWASP IoT Top 10。" },
          { text: "NIST IoT cybersecurity guidance。" },
          { text: "CRA 對製造商的義務摘要。" },
        ],
      },
    ],
    "B2.1": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "MCU 的基本組成",
            table: {
              headers: ["區塊", "作用"],
              rows: [
                ["CPU", "執行程式"],
                ["RAM", "執行期資料（斷電消失）"],
                ["Flash", "程式與設定（斷電保留）"],
                ["GPIO", "數位輸入輸出"],
                ["Timer", "計時、產生 PWM"],
                ["ADC", "類比量測"],
                ["通訊介面", "UART／I²C／SPI 等"],
              ],
            },
          },
          { text: "四種 I/O 型態：Digital Input、Digital Output、Analog Input、PWM Output。" },
          { text: "Pull-up / Pull-down 電阻：避免輸入腳位浮接（floating）而讀到不穩定的隨機值。" },
          { text: "Interrupt 是事件驅動、Polling 是持續檢查；低功耗設計偏好中斷加睡眠。" },
          { text: "驅動能力：MCU 腳位電流通常只有數 mA，無法直接驅動馬達、繼電器線圈或高電流 LED，必須經電晶體／驅動 IC，並注意續流二極體。" },
          { text: "2026 補充：MCU 內建 NPU（如 STM32N6）讓「感測 → 推論 → 動作」可以全部發生在同一顆晶片上，這類元件正在把 Edge AI 推進到終端。" },
        ],
      },
      abbrSection("B2.1"),
      {
        heading: "容易混淆",
        items: [
          { text: "GPIO 處理數位訊號；ADC 做類比量測；PWM 以數位波形做等效控制。" },
          { text: "RAM 斷電消失、Flash 斷電保留——設定值要寫 Flash。" },
          { text: "Interrupt vs Polling：前者省電、反應快；後者實作簡單但浪費 CPU。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          { text: "歐姆定律", formula: { expr: "V = I × R" } },
          { text: "功率", formula: { expr: "P = V × I" } },
          {
            text: "限流電阻（LED 應用）",
            formula: { expr: "R = (V_supply − V_LED) / I_LED", note: "例：(5 − 2) / 0.01 = 300 Ω" },
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          { text: "用低壓控制高壓負載", flow: ["GPIO", "電晶體驅動", "Relay", "Motor"] },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "輸入腳位浮接怎麼處理？→ 加 Pull-up / Pull-down。" },
          { text: "MCU 為何不能直接驅動馬達？→ 輸出電流能力不足。" },
          { text: "需要立即反應的外部事件？→ 用 Interrupt 而非 Polling。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "ESP32 datasheet / ESP-IDF basics。" },
          { text: "All About Circuits 基礎電子學。" },
        ],
      },
    ],
    "B2.2": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "完整資料管線",
            flow: [
              "Sensor",
              "MCU / Edge",
              "MQTT / HTTP",
              "Cloud Gateway",
              "Broker",
              "Stream / Rules",
              "Database",
              "API",
              "Dashboard / AI",
            ],
          },
          {
            text: "四種訊息的方向與意義",
            table: {
              headers: ["名稱", "方向", "意義"],
              rows: [
                ["Telemetry", "裝置 → 雲", "定期上報的量測值"],
                ["Command", "雲 → 裝置", "要裝置執行的動作"],
                ["Desired state", "雲 → 裝置", "希望裝置變成的狀態"],
                ["Reported state", "裝置 → 雲", "裝置實際的狀態"],
              ],
            },
          },
          {
            text: "一筆合格的遙測 JSON 至少要有：裝置識別、時間戳（建議 UTC）、量測值與單位、狀態。缺時間戳是最常見的設計錯誤。",
          },
          { text: "邊緣前處理（濾波、抽樣、聚合）能同時降低頻寬與儲存成本，是雲端成本控制的第一道閘門。" },
          {
            text: "雲端設計的五個考量：Scalability、Availability、Security、Cost、Latency——通常互相拉扯，要按場域取捨。",
          },
          { text: "2026 架構樣式：全廠資料匯流到 Unified Namespace，各系統（MES、AI、看板）改為訂閱 UNS，而不是彼此點對點串接。" },
        ],
      },
      abbrSection("B2.2"),
      {
        heading: "容易混淆",
        items: [
          { text: "Telemetry 與 Command 方向相反；Desired 與 Reported 是「想要的」與「實際的」。" },
          { text: "SQL 擅長關聯查詢；Time-series DB 擅長「同一裝置隨時間」的查詢與壓縮。" },
          { text: "Broker 負責路由，資料庫負責保存——兩者職責不同，不要把 Broker 當儲存。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "儲存量估算",
            formula: {
              expr: "Storage = Devices × Samples/sec × Bytes/sample × Time",
              note: "100 台 × 1 筆/秒 × 100 bytes × 86400 秒 ≈ 864 MB／天",
            },
          },
          {
            text: "上行頻寬估算",
            formula: { expr: "Bandwidth = Devices × Samples/sec × Bytes/sample × 8", note: "單位為 bit/s" },
          },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "最小可用的雲端管線",
            flow: ["ESP32", "MQTT", "Broker", "Rule / Stream", "Time-series DB", "Dashboard"],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "IoT 感測資料最不可或缺的欄位？→ Timestamp。" },
          { text: "大量時間序列資料應選什麼資料庫？→ Time-series DB。" },
          { text: "要降低雲端儲存成本，最先做什麼？→ 邊緣端前處理／降低取樣或聚合。" },
          { text: "「裝置回報自己現在是關閉狀態」屬於？→ Reported state。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "AWS IoT Core Developer Guide、Azure IoT architecture documents。" },
          { text: "Node-RED、InfluxDB、Grafana 的入門教學。" },
        ],
      },
    ],
    "B2.3": [
      {
        heading: "必懂觀念",
        items: [
          {
            text: "OEE 的三個元素——先記住「相乘」這件事",
            table: {
              headers: ["元素", "衡量什麼", "被什麼拖累"],
              rows: [
                ["Availability 可用率", "有沒有在跑", "停機、換模、故障"],
                ["Performance 效能", "跑得夠不夠快", "空轉、小停頓、降速"],
                ["Quality 良率", "做出來的能不能用", "瑕疵、重工"],
              ],
            },
          },
          {
            text: "現場常用指標",
            table: {
              headers: ["指標", "定義"],
              rows: [
                ["Downtime", "設備停止生產的時間"],
                ["Throughput", "單位時間的產出量"],
                ["Cycle Time", "生產一件產品所需時間"],
                ["Yield", "良率"],
                ["Bottleneck", "限制整條產線產出的節點"],
                ["WIP", "在製品數量"],
              ],
            },
          },
          { text: "預測性維護的商業價值就是「把非計畫停機換成計畫停機」——前者昂貴且連鎖，後者可排程。" },
          { text: "Digital Twin：實體設備的數位分身與模擬，可在不動產線的情況下試驗參數與情境。" },
          {
            text: "成本語彙",
            table: {
              headers: ["名詞", "意義", "例子"],
              rows: [
                ["CAPEX", "資本支出", "買機台、建置產線"],
                ["OPEX", "營運支出", "雲端月費、電費、維護人力"],
                ["TCO", "總持有成本", "整個生命週期的 CAPEX ＋ OPEX"],
                ["ROI", "投資報酬率", "效益相對於成本的比率"],
              ],
            },
          },
          { text: "2026 趨勢：數位分身採用預估成長約 35%，且從「預測」走向「閉迴路自動執行」；Gartner 預測 2030 年半自主 agent 將編排約 10% 的生產／品質／維護作業。" },
        ],
      },
      abbrSection("B2.3"),
      {
        heading: "容易混淆",
        items: [
          { text: "Throughput 是「一段時間做多少」；Cycle Time 是「一件要多久」。兩者互為倒數關係但不是同一件事。" },
          { text: "Utilization 是設備被使用的程度；Productivity 是投入產出的效率。" },
          { text: "CAPEX 是買機台；OPEX 是雲端月租。導入 AIoT 常是把 CAPEX 換成 OPEX。" },
          { text: "Preventive 是定期保養；Predictive 是依實際狀態預測（呼應 A1.2）。" },
        ],
      },
      {
        heading: "公式與計算",
        items: [
          {
            text: "整體設備效率",
            formula: { expr: "OEE = Availability × Performance × Quality", note: "0.90 × 0.95 × 0.98 ≈ 83.8%" },
          },
          { text: "可用率", formula: { expr: "Availability = Run Time / Planned Production Time" } },
          { text: "效能", formula: { expr: "Performance = (理想 Cycle Time × 產出數) / Run Time" } },
          { text: "良率", formula: { expr: "Quality = Good Count / Total Count" } },
          { text: "投資報酬率", formula: { expr: "ROI = (Benefit − Cost) / Cost × 100%" } },
          { text: "回收期", formula: { expr: "Payback = Initial Investment / Annual Savings" } },
        ],
      },
      {
        heading: "實務案例",
        items: [
          {
            text: "AI 預測性維護的投資評估：初始投資 NT$1,000,000，年效益 NT$700,000（降低停機損失 500,000 ＋ 人工成本 200,000）",
            children: [
              { text: "第一年簡化 ROI =（700,000 − 1,000,000）/ 1,000,000 = −30%。" },
              { text: "Payback = 1,000,000 / 700,000 ≈ 1.43 年。" },
              { text: "結論：不能只看第一年 ROI，要看回收期與生命週期的 TCO。" },
            ],
          },
        ],
      },
      {
        heading: "可能考法",
        items: [
          { text: "設備可用率下降 → 影響 OEE 的 Availability。" },
          { text: "瑕疵品增加 → Quality；實際速度低於理論 cycle → Performance。" },
          { text: "找出限制產線產量的設備 → Bottleneck。" },
          { text: "OEE 三元素皆 90%，OEE 是多少？→ 0.9³ ≈ 72.9%（不是 90%）。" },
        ],
      },
      {
        heading: "推薦資源",
        items: [
          { text: "OEE fundamentals、Lean Manufacturing basics。" },
          { text: "ISA-95 overview、Digital Twin introduction。" },
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
        text: "建議學習順序（由工程基礎往上疊）",
        flow: [
          "A2.2 通訊協定",
          "A2.3 工業標準",
          "A3.2 訊號介面",
          "A2.1 架構",
          "A2.4 平台",
          "B1.1 系統組成",
          "B1.2 故障排除",
          "B2.2 雲端管線",
          "A2.5／B1.3 資安",
          "A3.1 感測器",
          "B2.1 硬體",
          "B2.3 製造價值",
          "A1.1 AI 基礎",
          "A1.2 應用案例",
        ],
      },
      {
        text: "資料基準：考科一以 2026 官方《學習指引－科目一：AIoT 基礎概論》為主；考科二目前沒有同等完整的學習指引，以 115 年度簡章的能力指標與評鑑內容為骨架，再補上必要的工程知識。",
      },
      {
        text: "注意：B2.3 的 OEE、ROI、CAPEX/OPEX 等公式屬於依「智慧製造流程優化與成本控制」延伸的高價值補強，不代表官方已明文列為必考公式。",
      },
      {
        text: "標註「2026」的段落是依 2026-08 查得的公開資訊補入的產業現況（Matter／Thread 版本、CRA 與 AI Act 時程、Edge AI 生態等），時效性最強，考前請再確認一次。",
      },
    ],
  },
  {
    heading: "15 個節點的一句話記憶",
    items: [
      {
        text: "考科一：AIoT 基礎概論",
        table: {
          headers: ["節點", "一句話"],
          rows: [
            ["A1.1", "AI 如何從資料學習並部署到 Edge"],
            ["A1.2", "Sensor ＋ Network ＋ AI 如何解決實際問題"],
            ["A2.1", "IoT 系統分哪些 Layer"],
            ["A2.2", "Data 用什麼方式傳"],
            ["A2.3", "工廠的 Data 如何標準化、有語意地互通"],
            ["A2.4", "Device 與 Application 中間怎麼串"],
            ["A2.5", "如何讓 Device、Network、Data 不被攻擊"],
            ["A3.1", "Sensor 如何把物理世界轉成資料"],
            ["A3.2", "Sensor 的資料如何進 MCU"],
          ],
        },
      },
      {
        text: "考科二：物聯網系統與應用",
        table: {
          headers: ["節點", "一句話"],
          rows: [
            ["B1.1", "如何把所有元件組成 System"],
            ["B1.2", "System 壞掉時怎麼一層一層查"],
            ["B1.3", "怎麼從架構上做 IoT Security"],
            ["B2.1", "MCU 與 I/O 怎麼接真實硬體"],
            ["B2.2", "Data 怎麼一路進 Cloud / DB / Dashboard"],
            ["B2.3", "AIoT 最後如何產生 Manufacturing Value"],
          ],
        },
      },
    ],
  },
  {
    heading: "最重要的六張比較表（考前應能默寫）",
    items: [
      {
        text: "1. TCP vs UDP",
        table: {
          headers: ["", "TCP", "UDP"],
          rows: [["連線", "有", "無"], ["可靠", "是", "否"], ["延遲", "較高", "低"], ["場景", "可靠資料", "即時串流"]],
        },
      },
      {
        text: "2. MQTT vs HTTP",
        table: {
          headers: ["", "MQTT", "HTTP"],
          rows: [["模型", "Pub/Sub", "Req/Res"], ["中介", "Broker", "無"], ["Overhead", "低", "較高"], ["場景", "裝置遙測", "Web API"]],
        },
      },
      {
        text: "3. 五種無線技術",
        table: {
          headers: ["", "距離", "功耗", "資料率"],
          rows: [
            ["Wi-Fi", "短中", "高", "高"],
            ["BLE", "短", "很低", "低"],
            ["Zigbee", "短中 Mesh", "低", "低"],
            ["LoRaWAN", "公里級", "很低", "很低"],
            ["NB-IoT", "電信涵蓋", "低", "低"],
          ],
        },
      },
      {
        text: "4. UART vs I²C vs SPI",
        table: {
          headers: ["", "UART", "I²C", "SPI"],
          rows: [
            ["時脈", "無", "SCL", "SCLK"],
            ["資料線", "TX/RX", "SDA", "MOSI/MISO"],
            ["選裝置", "接線", "位址", "CS"],
            ["速度", "中", "中", "高"],
            ["全雙工", "是", "否", "是"],
          ],
        },
      },
      {
        text: "5. OPC UA vs MQTT vs MTConnect",
        table: {
          headers: ["", "本質", "強項"],
          rows: [
            ["OPC UA", "互通架構＋語意", "跨品牌整合"],
            ["MQTT", "訊息傳輸", "輕量解耦"],
            ["MTConnect", "設備資料語意", "工具機監控"],
          ],
        },
      },
      {
        text: "6. Edge vs Gateway vs Cloud",
        table: {
          headers: ["", "重點"],
          rows: [
            ["Edge", "就近運算、低延遲"],
            ["Gateway", "協定轉換、匯聚"],
            ["Cloud", "集中分析、長期儲存"],
          ],
        },
      },
    ],
  },
  {
    heading: "最重要的八條公式",
    items: [
      { text: "歐姆定律", formula: { expr: "V = I × R" } },
      { text: "功率", formula: { expr: "P = V × I" } },
      { text: "ADC 階數", formula: { expr: "Levels = 2^N", note: "12-bit → 4096" } },
      { text: "ADC 解析度", formula: { expr: "Resolution = Vref / 2^N", note: "12-bit、3.3 V → ≈ 0.806 mV" } },
      { text: "取樣定理", formula: { expr: "f_s ≥ 2 × f_max" } },
      { text: "超音波測距", formula: { expr: "d = (v × t) / 2", note: "v ≈ 340 m/s" } },
      { text: "整體設備效率", formula: { expr: "OEE = A × P × Q" } },
      { text: "投資報酬率", formula: { expr: "ROI = (Benefit − Cost) / Cost × 100%" } },
    ],
  },
  {
    heading: "建議的最小實作（一個 Lab 覆蓋 11 個節點）",
    items: [
      {
        text: "端到端的最小可用鏈路",
        flow: ["溫濕度感測器", "I²C", "ESP32", "Wi-Fi", "MQTT", "Broker", "Node-RED", "Time-series DB", "Grafana"],
      },
      {
        text: "然後刻意製造故障並逐一排查",
        children: [
          { text: "把感測器拔掉、把 I²C 位址寫錯。" },
          { text: "讓 Wi-Fi 斷線、把 Broker IP 填錯、把 MQTT 密碼改錯。" },
          { text: "把 Topic 打錯、送出格式無效的 JSON。" },
        ],
      },
      {
        text: "這一個 Lab 同時練到 A2.1、A2.2、A2.4、A2.5、A3.1、A3.2、B1.1、B1.2、B1.3、B2.1、B2.2——15 個節點中的 11 個。",
      },
    ],
  },
];
