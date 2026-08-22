/**
 * 官方《評鑑內容範圍》的評鑑內容節點，與新題庫（practice）各節點的題數配額。
 * 來源：AI應用規劃師能力鑑定_評鑑內容範圍參考（115.02）。
 */
export type AssessmentTopic = {
  code: string;
  name: string;
  count: number;
};

/** 節點目錄（不含配額）：用於回填題庫的 `topic` 欄位。 */
export type AssessmentNode = { code: string; name: string };

export const practiceTopics: Record<string, AssessmentTopic[]> = {
  "junior-ai-basics": [
    { code: "L11101", name: "AI 的定義與分類", count: 11 },
    { code: "L11102", name: "AI 治理概念", count: 11 },
    { code: "L11201", name: "資料基本概念與來源", count: 11 },
    { code: "L11202", name: "資料整理與分析流程", count: 11 },
    { code: "L11203", name: "資料隱私與安全", count: 11 },
    { code: "L11301", name: "機器學習基本原理", count: 11 },
    { code: "L11302", name: "常見的機器學習模型", count: 12 },
    { code: "L11401", name: "鑑別式 AI 與生成式 AI 的基本原理", count: 11 },
    { code: "L11402", name: "鑑別式 AI 與生成式 AI 的整合應用", count: 11 },
  ],
  "junior-genai": [
    { code: "L12101", name: "No Code / Low Code 的基本概念", count: 14 },
    { code: "L12102", name: "No Code / Low Code 的優勢與限制", count: 14 },
    { code: "L12201", name: "生成式 AI 應用領域與常見工具", count: 15 },
    { code: "L12202", name: "如何善用生成式 AI 工具", count: 15 },
    { code: "L12301", name: "生成式 AI 導入評估", count: 14 },
    { code: "L12302", name: "生成式 AI 導入規劃", count: 14 },
    { code: "L12303", name: "生成式 AI 風險管理", count: 14 },
  ],
  "senior-ai-tech": [
    { code: "L21101", name: "自然語言處理技術與應用", count: 11 },
    { code: "L21102", name: "電腦視覺技術與應用", count: 11 },
    { code: "L21103", name: "生成式 AI 技術與應用", count: 11 },
    { code: "L21104", name: "多模態人工智慧應用", count: 11 },
    { code: "L21201", name: "AI 導入評估", count: 11 },
    { code: "L21202", name: "AI 導入規劃", count: 11 },
    { code: "L21203", name: "AI 風險管理", count: 11 },
    { code: "L21301", name: "數據準備與模型選擇", count: 11 },
    { code: "L21302", name: "AI 技術系統集成與部署", count: 12 },
  ],
  "senior-bigdata": [
    { code: "L22101", name: "敘述性統計與資料摘要技術", count: 8 },
    { code: "L22102", name: "機率分佈與資料分佈模型", count: 8 },
    { code: "L22103", name: "假設檢定與統計推論", count: 8 },
    { code: "L22201", name: "數據收集與清理", count: 8 },
    { code: "L22202", name: "數據儲存與管理", count: 8 },
    { code: "L22203", name: "數據處理技術與工具", count: 8 },
    { code: "L22301", name: "統計學在大數據中的應用", count: 7 },
    { code: "L22302", name: "常見的大數據分析方法", count: 8 },
    { code: "L22303", name: "數據可視化工具", count: 7 },
    { code: "L22401", name: "大數據與機器學習", count: 8 },
    { code: "L22402", name: "大數據在鑑別式 AI 中的應用", count: 8 },
    { code: "L22403", name: "大數據在生成式 AI 中的應用", count: 7 },
    { code: "L22404", name: "大數據隱私保護、安全與合規", count: 7 },
  ],
  "senior-ml": [
    { code: "L23101", name: "機率／統計之機器學習基礎應用", count: 9 },
    { code: "L23102", name: "線性代數之機器學習基礎應用", count: 9 },
    { code: "L23103", name: "數值優化技術與方法", count: 8 },
    { code: "L23201", name: "機器學習原理與技術", count: 8 },
    { code: "L23202", name: "常見機器學習演算法", count: 9 },
    { code: "L23203", name: "深度學習原理與框架", count: 9 },
    { code: "L23301", name: "數據準備與特徵工程", count: 8 },
    { code: "L23302", name: "模型選擇與架構設計", count: 8 },
    { code: "L23303", name: "模型訓練、評估與驗證", count: 8 },
    { code: "L23304", name: "模型調整與優化", count: 8 },
    { code: "L23401", name: "數據隱私、安全與合規", count: 8 },
    { code: "L23402", name: "演算法偏見與公平性", count: 8 },
  ],
  // AIoT 兩科的新題庫：依 2026 iPAS AIoT 題庫生成規格 v2.0 命題，各節點題數盡量平均。
  "aiot-junior-basics": [
    { code: "A1.1", name: "AI 基礎概念", count: 11 },
    { code: "A1.2", name: "AIoT 應用案例", count: 11 },
    { code: "A2.1", name: "物聯網架構與功能", count: 11 },
    { code: "A2.2", name: "常見通訊協定與網路層技術", count: 12 },
    { code: "A2.3", name: "工業通訊標準與資訊模型", count: 11 },
    { code: "A2.4", name: "中介軟體與平台", count: 11 },
    { code: "A2.5", name: "資安與隱私基本概念", count: 11 },
    { code: "A3.1", name: "感測技術基礎", count: 11 },
    { code: "A3.2", name: "感測訊號與通訊基礎", count: 11 },
  ],
  "aiot-junior-iot": [
    { code: "B1.1", name: "系統元件與架構", count: 17 },
    { code: "B1.2", name: "簡易系統故障問題判斷與排除", count: 17 },
    { code: "B1.3", name: "物聯網資訊安全", count: 17 },
    { code: "B2.1", name: "物聯網硬體設計基礎", count: 17 },
    { code: "B2.2", name: "雲端環境數據收集與平台設計", count: 16 },
    { code: "B2.3", name: "智慧製造流程優化與成本控制", count: 16 },
  ],
};

/**
 * 中級三科的評鑑內容節點目錄。
 *
 * **與官方文件的一處刻意差異**：官方《評鑑內容範圍參考》在 L233（機器學習建模與參數調校）
 * 底下把第三、第四個節點編為 `L22303`／`L22304`，但 `L22303` 在同一份文件已被
 * L223 的「數據可視化工具」用掉——是真的撞號而非單純筆誤。此處採用修正後的
 * `L23303`／`L23304`，理由是節點碼在本專案是唯一鍵（題庫 `topic` 與統計都靠它分組），
 * 沿用官方編號會讓兩個不同科目的節點合併成同一組。日後官方勘誤若採其他編法，改這裡即可。
 */
export const seniorNodes: Record<string, AssessmentNode[]> = {
  "senior-ai-tech": [
    { code: "L21101", name: "自然語言處理技術與應用" },
    { code: "L21102", name: "電腦視覺技術與應用" },
    { code: "L21103", name: "生成式 AI 技術與應用" },
    { code: "L21104", name: "多模態人工智慧應用" },
    { code: "L21201", name: "AI 導入評估" },
    { code: "L21202", name: "AI 導入規劃" },
    { code: "L21203", name: "AI 風險管理" },
    { code: "L21301", name: "數據準備與模型選擇" },
    { code: "L21302", name: "AI 技術系統集成與部署" },
  ],
  "senior-bigdata": [
    { code: "L22101", name: "敘述性統計與資料摘要技術" },
    { code: "L22102", name: "機率分佈與資料分佈模型" },
    { code: "L22103", name: "假設檢定與統計推論" },
    { code: "L22201", name: "數據收集與清理" },
    { code: "L22202", name: "數據儲存與管理" },
    { code: "L22203", name: "數據處理技術與工具" },
    { code: "L22301", name: "統計學在大數據中的應用" },
    { code: "L22302", name: "常見的大數據分析方法" },
    { code: "L22303", name: "數據可視化工具" },
    { code: "L22401", name: "大數據與機器學習" },
    { code: "L22402", name: "大數據在鑑別式 AI 中的應用" },
    { code: "L22403", name: "大數據在生成式 AI 中的應用" },
    { code: "L22404", name: "大數據隱私保護、安全與合規" },
  ],
  "senior-ml": [
    { code: "L23101", name: "機率／統計之機器學習基礎應用" },
    { code: "L23102", name: "線性代數之機器學習基礎應用" },
    { code: "L23103", name: "數值優化技術與方法" },
    { code: "L23201", name: "機器學習原理與技術" },
    { code: "L23202", name: "常見機器學習演算法" },
    { code: "L23203", name: "深度學習原理與框架" },
    { code: "L23301", name: "數據準備與特徵工程" },
    { code: "L23302", name: "模型選擇與架構設計" },
    { code: "L23303", name: "模型訓練、評估與驗證" },
    { code: "L23304", name: "模型調整與優化" },
    { code: "L23401", name: "數據隱私、安全與合規" },
    { code: "L23402", name: "演算法偏見與公平性" },
  ],
};

/**
 * AIoT 應用工程師（初級）的評鑑內容節點，依 115 年度簡章 2.5 節。
 * 節點碼採兩層碼：A = 考科一 AIoT 基礎概論、B = 考科二 物聯網系統與應用。
 * 官方沒有為此證照編五碼節點，故自訂；格式須與 isTopicClassified 一致。
 */
export const aiotNodes: Record<string, AssessmentNode[]> = {
  "aiot-junior-basics": [
    { code: "A1.1", name: "AI 基礎概念" },
    { code: "A1.2", name: "AIoT 應用案例" },
    { code: "A2.1", name: "物聯網架構與功能" },
    { code: "A2.2", name: "常見通訊協定與網路層技術" },
    { code: "A2.3", name: "工業通訊標準與資訊模型" },
    { code: "A2.4", name: "中介軟體與平台" },
    { code: "A2.5", name: "資安與隱私基本概念" },
    { code: "A3.1", name: "感測技術基礎" },
    { code: "A3.2", name: "感測訊號與通訊基礎" },
  ],
  "aiot-junior-iot": [
    { code: "B1.1", name: "系統元件與架構" },
    { code: "B1.2", name: "簡易系統故障問題判斷與排除" },
    { code: "B1.3", name: "物聯網資訊安全" },
    { code: "B2.1", name: "物聯網硬體設計基礎" },
    { code: "B2.2", name: "雲端環境數據收集與平台設計" },
    { code: "B2.3", name: "智慧製造流程優化與成本控制" },
  ],
};

/** 全部已建目錄的節點，供回填與測試查表。 */
export const allNodes: Record<string, AssessmentNode[]> = {
  ...Object.fromEntries(
    Object.entries(practiceTopics).map(([id, list]) => [
      id,
      list.map(({ code, name }) => ({ code, name })),
    ]),
  ),
  ...seniorNodes,
  ...aiotNodes,
};

export const topicLabel = (topic: AssessmentTopic | AssessmentNode): string =>
  `${topic.code} ${topic.name}`;

export const practiceTotal = (subjectId: string): number =>
  (practiceTopics[subjectId] ?? []).reduce((sum, topic) => sum + topic.count, 0);

/**
 * 題目的 topic 是否已分類。兩種節點碼格式並存：
 * AI 應用規劃師用官方五碼（L23303 …），AIoT 用兩層碼（A1.1 …）。
 * 主題徽章與刷題的節點統計都以此判斷，務必只留這一處定義。
 */
export const isTopicClassified = (topic: string): boolean =>
  /^L\d{5} /.test(topic) || /^[AB]\d\.\d /.test(topic);

/**
 * 題目的 topic 是否屬於學習主題頁上的某個主題碼。
 *
 * 兩張證照的層級不同，靠「碼的前綴」統一處理：
 * - AI 應用規劃師：學習主題是三碼評鑑主題（L111），題目掛在五碼評鑑內容（L11101）上，
 *   一個主題涵蓋數個節點。
 * - AIoT：學習主題就是評鑑內容本身（A1.1），前綴比對等同完全相符。
 */
export const topicMatchesGuideCode = (questionTopic: string, guideCode: string): boolean =>
  questionTopic.split(" ")[0].startsWith(guideCode);
