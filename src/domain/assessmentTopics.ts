/**
 * 官方《評鑑內容範圍》的評鑑內容節點，與新題庫（practice）各節點的題數配額。
 * 來源：AI應用規劃師能力鑑定_評鑑內容範圍參考（115.02）。
 * 中級三科尚未納入，見 docs/superpowers/specs/2026-08-13-practice-bank-design.md 的 Backlog。
 */
export type AssessmentTopic = {
  code: string;
  name: string;
  count: number;
};

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

export const topicLabel = (topic: AssessmentTopic): string => `${topic.code} ${topic.name}`;

export const practiceTotal = (subjectId: string): number =>
  (practiceTopics[subjectId] ?? []).reduce((sum, topic) => sum + topic.count, 0);
