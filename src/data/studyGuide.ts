import type { StudyNotesBySubject, SubjectStudyGuide } from "./types";

export const studyGuides: SubjectStudyGuide[] = [
  {
    subjectId: "junior-ai-basics",
    topics: [
      {
        code: "L111",
        title: "人工智慧概念",
        contents: [
          "AI 的定義與分類",
          "AI 治理概念（如歐盟 AI Act、數位發展部《公部門人工智慧應用參考手冊》、金管會《金融業運用 AI 指引》、AI 風險評估與監管等）",
        ],
        links: [
          { title: "人工智慧 - 維基百科", url: "https://zh.wikipedia.org/wiki/人工智慧" },
          {
            title: "人工智慧基本法（115.01.14 公布）- 全國法規資料庫",
            url: "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=H0160093",
          },
          {
            title: "立法院三讀通過《人工智慧基本法》- 數位發展部新聞發布",
            url: "https://moda.gov.tw/press/press-releases/18316",
          },
          { title: "AI 產品與系統評測中心（AIEC）", url: "https://www.aiec.org.tw/" },
          {
            title: "EU AI Act 監管框架 - 歐盟執委會 Digital Strategy",
            url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
          },
          { title: "金融監督管理委員會（金管會）官網", url: "https://www.fsc.gov.tw/ch/index.jsp" },
        ],
      },
      {
        code: "L112",
        title: "資料處理與分析概念",
        contents: [
          "資料基本概念與來源（大數據、數值型／文字／圖像等資料型態與結構）",
          "資料整理與分析流程（資料收集、清理、分析與呈現、特徵工程、資料標準化等）",
          "資料隱私與安全",
        ],
        links: [
          { title: "大數據 - 維基百科", url: "https://zh.wikipedia.org/wiki/大数据" },
          { title: "特徵工程 - 維基百科", url: "https://zh.wikipedia.org/wiki/特征工程" },
          { title: "pandas 使用者指南（資料處理）", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
        ],
      },
      {
        code: "L113",
        title: "機器學習概念",
        contents: [
          "機器學習基本原理（基本原理與目的、模型訓練與泛化機制概念等）",
          "常見的機器學習模型與評估（監督式、非監督式、半監督式、強化式、多模態、深度學習等）",
        ],
        links: [
          { title: "機器學習 - 維基百科", url: "https://zh.wikipedia.org/wiki/机器学习" },
          { title: "監督式學習 - 維基百科", url: "https://zh.wikipedia.org/wiki/監督式學習" },
          { title: "Supervised learning - scikit-learn", url: "https://scikit-learn.org/stable/supervised_learning.html" },
        ],
      },
      {
        code: "L114",
        title: "鑑別式 AI 與生成式 AI 概念",
        contents: [
          "鑑別式 AI 與生成式 AI 的基本原理（運用技術測試與驗證、目的與特性、模型部署與效能管理等）",
          "鑑別式 AI 與生成式 AI 的整合應用（電腦視覺、語音辨識、生成技術等應用場域與情境）",
        ],
        links: [
          { title: "生成式人工智慧 - 維基百科", url: "https://zh.wikipedia.org/wiki/生成式人工智慧" },
          { title: "電腦視覺 - 維基百科", url: "https://zh.wikipedia.org/wiki/電腦視覺" },
          { title: "語音辨識 - 維基百科", url: "https://zh.wikipedia.org/wiki/語音辨識" },
        ],
      },
    ],
  },
  {
    subjectId: "junior-genai",
    topics: [
      {
        code: "L121",
        title: "No code / Low code 概念",
        contents: [
          "No Code / Low Code 的基本概念（工具本身的基本認知與基礎概念）",
          "No Code / Low Code 的優勢與限制（一般理論知識與各場域實際應用情況）",
        ],
        links: [
          { title: "No-code development platform - Wikipedia", url: "https://en.wikipedia.org/wiki/No-code_development_platform" },
          { title: "Low-code development platform - Wikipedia", url: "https://en.wikipedia.org/wiki/Low-code_development_platform" },
        ],
      },
      {
        code: "L122",
        title: "生成式 AI 應用領域與工具使用",
        contents: [
          "生成式 AI 應用領域與常見工具（文本／圖像／聲音；OpenAI API、ChatGPT、Midjourney、Copilot Studio、GitHub Copilot、Cursor、Gemini 等）",
          "如何善用生成式 AI 工具（提示工程：提示詞框架／設計／優化、RAG、AI 工具整合等）",
        ],
        links: [
          { title: "Learn Prompting 提示工程入門", url: "https://learnprompting.org/docs/introduction" },
          { title: "Prompt engineering 指南 - OpenAI Developers", url: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
          { title: "檢索增強生成（RAG）- 維基百科", url: "https://zh.wikipedia.org/wiki/检索增强生成" },
          { title: "Model Context Protocol 官方文件", url: "https://modelcontextprotocol.io/" },
          { title: "C2PA 內容出處與真實性標準", url: "https://c2pa.org/" },
          { title: "SynthID 數位浮水印 - Google DeepMind", url: "https://deepmind.google/technologies/synthid/" },
        ],
      },
      {
        code: "L123",
        title: "生成式 AI 導入評估規劃",
        contents: [
          "生成式 AI 導入評估（技術／工具／模型／效能評估、解決方案選擇、成本效益分析、AI 代理；經濟部產業發展署《AI 導入指引》等）",
          "生成式 AI 導入規劃（目標設置、資源分配、導入策略、因應措施、測試等）",
          "生成式 AI 風險管理（倫理風險、資料安全隱私與合規性、風險影響等）",
        ],
        links: [
          {
            title: "EU AI Act 監管框架（風險與合規）- 歐盟執委會",
            url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
          },
          { title: "Azure 上的 AI/ML 架構（導入與部署參考）- Microsoft Learn", url: "https://learn.microsoft.com/zh-tw/azure/architecture/ai-ml/" },
          { title: "EU AI Act 條文與時程總覽（風險分級）", url: "https://artificialintelligenceact.eu/" },
          { title: "數位發展部（AI 政策與導入治理）", url: "https://moda.gov.tw/" },
        ],
      },
    ],
  },
  {
    subjectId: "senior-ai-tech",
    topics: [
      {
        code: "L211",
        title: "AI 相關技術應用",
        contents: [
          "自然語言處理技術與應用",
          "電腦視覺技術與應用",
          "生成式 AI 技術與應用",
          "多模態人工智慧應用（文字、圖像、聲音等）",
        ],
        links: [
          { title: "自然語言處理 - 維基百科", url: "https://zh.wikipedia.org/wiki/自然语言处理" },
          { title: "電腦視覺 - 維基百科", url: "https://zh.wikipedia.org/wiki/電腦視覺" },
          { title: "多模態學習 - 維基百科", url: "https://zh.wikipedia.org/wiki/多模态学习" },
        ],
      },
      {
        code: "L212",
        title: "AI 導入評估規劃",
        contents: [
          "AI 導入評估（技術或工具效能評估、解決方案選擇、成本效益分析等）",
          "AI 導入規劃（需求分析、技術應用方案設計、目標設置、資源分配等）",
          "AI 風險管理（風險識別、安全與合規性、AI 倫理、負責任 AI 等）",
        ],
        links: [
          {
            title: "EU AI Act 監管框架（負責任 AI 與合規）- 歐盟執委會",
            url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
          },
          { title: "Azure 上的 AI/ML 架構 - Microsoft Learn", url: "https://learn.microsoft.com/zh-tw/azure/architecture/ai-ml/" },
          { title: "國家發展委員會（AI 導入政策與規劃）", url: "https://www.ndc.gov.tw/" },
        ],
      },
      {
        code: "L213",
        title: "AI 技術應用與系統部署",
        contents: [
          "數據準備與模型選擇（數據收集、清洗與預處理、特徵工程、不同模型優缺點等）",
          "AI 技術系統集成與部署（系統架構設計、模型部署、效能監控與更新管理、系統測試與驗證、穩定性與可用性、雲端環境建置等）",
        ],
        links: [
          { title: "MLOps - Wikipedia", url: "https://en.wikipedia.org/wiki/MLOps" },
          { title: "Azure 上的 AI/ML 架構與部署 - Microsoft Learn", url: "https://learn.microsoft.com/zh-tw/azure/architecture/ai-ml/" },
        ],
      },
    ],
  },
  {
    subjectId: "senior-bigdata",
    topics: [
      {
        code: "L221",
        title: "機率統計基礎",
        contents: [
          "敘述性統計與資料摘要技術（集中趨勢、離散程度與分佈型態、數據清理與剖析等）",
          "機率分佈與資料分佈模型（機率理論模型與分佈特性等）",
          "假設檢定與統計推論",
        ],
        links: [
          { title: "描述統計學 - 維基百科", url: "https://zh.wikipedia.org/wiki/描述統計學" },
          { title: "機率分布 - 維基百科", url: "https://zh.wikipedia.org/wiki/概率分布" },
          { title: "假設檢定 - 維基百科", url: "https://zh.wikipedia.org/wiki/假設檢定" },
        ],
      },
      {
        code: "L222",
        title: "大數據處理技術",
        contents: [
          "數據收集與清理（數據預處理、特徵提取等）",
          "數據儲存與管理（資料庫架構、儲存機制、模型訓練等）",
          "數據處理技術與工具",
        ],
        links: [
          { title: "資料庫 - 維基百科", url: "https://zh.wikipedia.org/wiki/数据库" },
          { title: "Apache Hadoop - 維基百科", url: "https://zh.wikipedia.org/wiki/Apache_Hadoop" },
          { title: "Apache Spark - 維基百科", url: "https://zh.wikipedia.org/wiki/Apache_Spark" },
        ],
      },
      {
        code: "L223",
        title: "大數據分析方法與工具",
        contents: [
          "統計學在大數據中的應用（數據轉換、縮放與分佈調整、特徵工程等）",
          "常見的大數據分析方法（數據分析演算法、模式識別、資料不平衡處理策略等）",
          "數據可視化工具（資訊呈現原則、圖表類型選擇、視覺化效能等）",
        ],
        links: [
          { title: "資料轉換與縮放 - scikit-learn", url: "https://scikit-learn.org/stable/data_transforms.html" },
          { title: "數據可視化 - 維基百科", url: "https://zh.wikipedia.org/wiki/数据可视化" },
          { title: "什麼是資料視覺化 - AWS", url: "https://aws.amazon.com/tw/what-is/data-visualization/" },
        ],
      },
      {
        code: "L224",
        title: "大數據在人工智慧之應用",
        contents: [
          "大數據與機器學習（大數據特性對機器學習演算法的底層影響與挑戰等）",
          "大數據在鑑別式 AI 中的應用（預測、分類等鑑別式任務）",
          "大數據在生成式 AI 中的應用（生成式模型處理大規模語料的技術需求）",
          "大數據隱私保護、安全與合規（數據安全性與法律合規技術等）",
        ],
        links: [
          { title: "大數據 - 維基百科", url: "https://zh.wikipedia.org/wiki/大数据" },
          { title: "機器學習 - 維基百科", url: "https://zh.wikipedia.org/wiki/机器学习" },
          { title: "隱私 - 維基百科", url: "https://zh.wikipedia.org/wiki/隐私" },
        ],
      },
    ],
  },
  {
    subjectId: "senior-ml",
    topics: [
      {
        code: "L231",
        title: "機器學習基礎數學",
        contents: [
          "機率／統計之機器學習基礎應用（數據的數學分佈特性、變異解釋等）",
          "線性代數之機器學習基礎應用（特徵提取、資料降維與壓縮等）",
          "數值優化技術與方法（演算法效率與可擴展性評估等）",
        ],
        links: [
          { title: "機率分布 - 維基百科", url: "https://zh.wikipedia.org/wiki/概率分布" },
          { title: "線性代數 - 維基百科", url: "https://zh.wikipedia.org/wiki/线性代数" },
          { title: "數學優化 - 維基百科", url: "https://zh.wikipedia.org/wiki/数学优化" },
        ],
      },
      {
        code: "L232",
        title: "機器學習與深度學習",
        contents: [
          "機器學習原理與技術（基礎理論、機率推論與模擬驗證技術等）",
          "常見機器學習演算法（技術原理、應用與優化等）",
          "深度學習原理與框架（類神經網路架構、層級運算機制與模型效能分析等）",
        ],
        links: [
          { title: "深度學習 - 維基百科", url: "https://zh.wikipedia.org/wiki/深度学习" },
          { title: "人工神經網路 - 維基百科", url: "https://zh.wikipedia.org/wiki/人工神经网络" },
          { title: "台大李宏毅 機器學習課程（2023 春）", url: "https://speech.ee.ntu.edu.tw/~hylee/ml/2023-spring.php" },
        ],
      },
      {
        code: "L233",
        title: "機器學習建模與參數調校",
        contents: [
          "數據準備與特徵工程",
          "模型選擇與架構設計（模型架構定義、層級設定、訓練前的核心配置）",
          "模型訓練、評估與驗證（泛化能力與穩定性評估等）",
          "模型調整與優化（訓練過程參數調整策略、優化控制與效能提升策略等）",
        ],
        links: [
          { title: "特徵工程 - 維基百科", url: "https://zh.wikipedia.org/wiki/特征工程" },
          { title: "模型評估 metrics - scikit-learn", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" },
          { title: "超參數調校（Grid Search）- scikit-learn", url: "https://scikit-learn.org/stable/modules/grid_search.html" },
        ],
      },
      {
        code: "L234",
        title: "機器學習治理",
        contents: [
          "數據隱私、安全與合規（資料安全性、隱私保護、符合法規要求等）",
          "演算法偏見與公平性（識別資料或模型中潛在偏誤來源與調整策略等）",
        ],
        links: [
          { title: "隱私 - 維基百科", url: "https://zh.wikipedia.org/wiki/隐私" },
          { title: "Algorithmic bias - Wikipedia", url: "https://en.wikipedia.org/wiki/Algorithmic_bias" },
          { title: "數位發展部（數位治理與資安）", url: "https://moda.gov.tw/" },
        ],
      },
    ],
  },
  // AIoT 應用工程師（初級）：官方目前只有考科一有學習指引，考科二僅有簡章的兩層大綱，
  // 因此兩科都先只放官方評鑑內容，沒有學習筆記與延伸閱讀（links 為空陣列）。
  {
    subjectId: "aiot-junior-basics",
    topics: [
      {
        code: "A1.1",
        title: "AI 基礎概念",
        contents: ["機器學習三種範式、深度學習模型（CNN、RNN/LSTM）、訓練到推論的工程流程、邊緣運算與 Edge AI、模型壓縮（量化、剪枝）、NPU 等加速器、AI 倫理與治理"],
        links: [
          { title: "iPAS AIoT 應用工程師 官方考試資訊", url: "https://ipd.nat.gov.tw/ipas/certification/AIOT/exam-info" },
          { title: "Edge Impulse 文件（Edge AI 入門）", url: "https://docs.edgeimpulse.com/" },
          { title: "LiteRT（原 TensorFlow Lite）- Google AI Edge", url: "https://ai.google.dev/edge/litert" },
          { title: "ExecuTorch - PyTorch 端側推論", url: "https://pytorch.org/executorch/" },
          { title: "ONNX Runtime", url: "https://onnxruntime.ai/" },
        ],
      },
      {
        code: "A1.2",
        title: "AIoT 應用案例",
        contents: ["智慧製造、預測性維護、智慧農業、智慧城市等場域的 AIoT 導入案例與效益評估"],
        links: [
          { title: "Predictive maintenance - Wikipedia", url: "https://en.wikipedia.org/wiki/Predictive_maintenance" },
          { title: "Digital twin - Wikipedia", url: "https://en.wikipedia.org/wiki/Digital_twin" },
        ],
      },
      {
        code: "A2.1",
        title: "物聯網架構與功能",
        contents: ["感知層、網路層、應用層的三層架構與各層職責，端、邊、雲的分工"],
        links: [
          { title: "Internet of things - Wikipedia", url: "https://en.wikipedia.org/wiki/Internet_of_things" },
          { title: "物聯網 - 維基百科", url: "https://zh.wikipedia.org/wiki/%E7%89%A9%E8%81%AF%E7%B6%B2" },
          { title: "OSI 模型 - 維基百科", url: "https://zh.wikipedia.org/wiki/OSI%E6%A8%A1%E5%9E%8B" },
        ],
      },
      {
        code: "A2.2",
        title: "常見通訊協定與網路層技術",
        contents: ["MQTT、CoAP、HTTP 等應用層協定；LoRa、NB-IoT、Zigbee、Wi-Fi、藍牙等無線技術的頻寬、耗電與涵蓋範圍取捨"],
        links: [
          { title: "MQTT 官方網站", url: "https://mqtt.org/" },
          { title: "OASIS MQTT 5.0 規格", url: "https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html" },
          { title: "LoRa Alliance：關於 LoRaWAN", url: "https://lora-alliance.org/about-lorawan/" },
          { title: "Matter - Connectivity Standards Alliance", url: "https://csa-iot.org/all-solutions/matter/" },
          { title: "Thread Group", url: "https://www.threadgroup.org/" },
          { title: "Bluetooth SIG：技術總覽", url: "https://www.bluetooth.com/learn-about-bluetooth/tech-overview/" },
        ],
      },
      {
        code: "A2.3",
        title: "工業通訊標準與資訊模型",
        contents: ["OPC UA、MTConnect、Modbus 等工業通訊標準，以及資訊模型（Information Model）的角色"],
        links: [
          { title: "OPC Foundation：OPC UA", url: "https://opcfoundation.org/about/opc-technologies/opc-ua/" },
          { title: "MTConnect 官方網站", url: "https://www.mtconnect.org/" },
          { title: "Eclipse Sparkplug", url: "https://sparkplug.eclipse.org/" },
          { title: "IEEE 802.1 TSN Task Group", url: "https://1.ieee802.org/tsn/" },
          { title: "ANSI/ISA-95 - Wikipedia", url: "https://en.wikipedia.org/wiki/ANSI/ISA-95" },
        ],
      },
      {
        code: "A2.4",
        title: "中介軟體與平台",
        contents: ["訊息中介軟體、IoT 平台的裝置管理與資料匯流、雲端服務整合"],
        links: [
          { title: "Node-RED 入門", url: "https://nodered.org/docs/getting-started/" },
          { title: "Eclipse Mosquitto", url: "https://mosquitto.org/" },
          { title: "InfluxDB 文件", url: "https://docs.influxdata.com/influxdb/" },
          { title: "Grafana 文件", url: "https://grafana.com/docs/grafana/latest/" },
        ],
      },
      {
        code: "A2.5",
        title: "資安與隱私基本概念",
        contents: ["資料外洩與設備入侵風險、認證與加密、由設計起始的隱私（Privacy by Design）、邊緣端去識別化"],
        links: [
          { title: "OWASP Internet of Things Project", url: "https://owasp.org/www-project-internet-of-things/" },
          { title: "NIST Cybersecurity for IoT Program", url: "https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program" },
          { title: "歐盟 Cyber Resilience Act（CRA）", url: "https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act" },
          { title: "EU AI Act 實施時程", url: "https://artificialintelligenceact.eu/implementation-timeline/" },
        ],
      },
      {
        code: "A3.1",
        title: "感測技術基礎",
        contents: ["常見感測器原理（溫度、濕度、加速度、影像等）、量測特性（靈敏度、線性度、遲滯）與選用考量"],
        links: [
          { title: "SparkFun 教學總覽", url: "https://learn.sparkfun.com/tutorials" },
          { title: "Adafruit Learning System", url: "https://learn.adafruit.com/" },
          { title: "MEMS - Wikipedia", url: "https://en.wikipedia.org/wiki/Microelectromechanical_systems" },
        ],
      },
      {
        code: "A3.2",
        title: "感測訊號與通訊基礎",
        contents: ["UART、I²C、SPI 等介面，類比數位轉換（ADC）、取樣率與解析度，串列與並列通訊的取捨"],
        links: [
          { title: "SparkFun：I2C", url: "https://learn.sparkfun.com/tutorials/i2c" },
          { title: "SparkFun：SPI", url: "https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi" },
          { title: "SparkFun：序列通訊（UART）", url: "https://learn.sparkfun.com/tutorials/serial-communication" },
          { title: "ESP-IDF 週邊 API 參考", url: "https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/index.html" },
          { title: "Nyquist–Shannon 取樣定理 - Wikipedia", url: "https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem" },
        ],
      },
    ],
  },
  {
    subjectId: "aiot-junior-iot",
    topics: [
      { code: "B1.1", title: "系統元件與架構", contents: ["物聯網系統的軟硬體元件組成與整體架構規劃"], links: [
          { title: "ANSI/ISA-95 - Wikipedia", url: "https://en.wikipedia.org/wiki/ANSI/ISA-95" },
          { title: "Node-RED 入門", url: "https://nodered.org/docs/getting-started/" },
          { title: "Internet of things - Wikipedia", url: "https://en.wikipedia.org/wiki/Internet_of_things" },
        ] },
      { code: "B1.2", title: "簡易系統故障問題判斷與排除", contents: ["常見故障徵狀的判斷流程與排除方法"], links: [
          { title: "Wireshark 使用者手冊", url: "https://www.wireshark.org/docs/wsug_html_chunked/" },
          { title: "MQTT Explorer", url: "https://mqtt-explorer.com/" },
          { title: "ESP-IDF：Logging library", url: "https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/system/log.html" },
        ] },
      { code: "B1.3", title: "物聯網資訊安全", contents: ["物聯網環境的資安威脅、防護措施與隱私權議題"], links: [
          { title: "OWASP Internet of Things Project", url: "https://owasp.org/www-project-internet-of-things/" },
          { title: "NISTIR 8259：IoT 裝置製造商的基礎活動", url: "https://csrc.nist.gov/pubs/ir/8259/final" },
          { title: "歐盟 Cyber Resilience Act（CRA）", url: "https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act" },
        ] },
      { code: "B2.1", title: "物聯網硬體設計基礎", contents: ["I/O 通訊與控制方式基礎、開源硬體的規劃與授權規範"], links: [
          { title: "Espressif 技術文件（ESP32 datasheet）", url: "https://www.espressif.com/en/support/documents/technical-documents" },
          { title: "Arduino 官方文件", url: "https://docs.arduino.cc/" },
          { title: "SparkFun：What is an Arduino?", url: "https://learn.sparkfun.com/tutorials/what-is-an-arduino" },
        ] },
      { code: "B2.2", title: "雲端環境數據收集與平台設計", contents: ["雲端資料交換格式、資料庫設計基礎、開源軟體規劃與授權規範"], links: [
          { title: "AWS IoT Core 開發者指南", url: "https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html" },
          { title: "Azure IoT 參考架構", url: "https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/iot" },
          { title: "InfluxDB 文件", url: "https://docs.influxdata.com/influxdb/" },
          { title: "Grafana 文件", url: "https://grafana.com/docs/grafana/latest/" },
        ] },
      { code: "B2.3", title: "智慧製造流程優化與成本控制", contents: ["以物聯網數據優化製造流程並控制成本"], links: [
          { title: "OEE.com：OEE 基礎", url: "https://www.oee.com/" },
          { title: "Lean manufacturing - Wikipedia", url: "https://en.wikipedia.org/wiki/Lean_manufacturing" },
          { title: "Digital twin - Wikipedia", url: "https://en.wikipedia.org/wiki/Digital_twin" },
        ] },
    ],
  },
];

export const getStudyGuide = (
  subjectId: string,
  notesBySubject?: StudyNotesBySubject,
): SubjectStudyGuide | undefined => {
  const guide = studyGuides.find((item) => item.subjectId === subjectId);
  if (!guide) return undefined;
  return {
    ...guide,
    topics: guide.topics.map((topic) => ({
      ...topic,
      notes: notesBySubject?.[subjectId]?.[topic.code] ?? topic.notes,
    })),
  };
};
