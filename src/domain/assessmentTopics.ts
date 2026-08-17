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

/** 全部已建目錄的節點，供回填與測試查表。 */
export const allNodes: Record<string, AssessmentNode[]> = {
  ...Object.fromEntries(
    Object.entries(practiceTopics).map(([id, list]) => [
      id,
      list.map(({ code, name }) => ({ code, name })),
    ]),
  ),
  ...seniorNodes,
};

export const topicLabel = (topic: AssessmentTopic | AssessmentNode): string =>
  `${topic.code} ${topic.name}`;

export const practiceTotal = (subjectId: string): number =>
  (practiceTopics[subjectId] ?? []).reduce((sum, topic) => sum + topic.count, 0);
