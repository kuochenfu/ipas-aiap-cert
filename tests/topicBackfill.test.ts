import { describe, expect, it } from "vitest";
import { getQuestions } from "../src/data/index";
import { allNodes, seniorNodes, topicLabel } from "../src/domain/assessmentTopics";
import { subjects } from "../src/domain/catalog";

const ALL = subjects.map((s) => s.id);

/**
 * 五科真題與新題的 `topic` 回填（backlog T7）。
 *
 * 真題 JSON 由解析器產生時 `topic` 一律是「未分類」，回填寫在手寫層
 * `explanations/*.ts` 的 `topic` 欄位，由 `resolvePastExamExplanations` 依 id 合併——
 * 因此重跑 `npm run parse:papers` 不會把分類洗掉。
 */
describe("五科的評鑑節點回填", () => {
  for (const subjectId of ALL) {
    // 真題與新題共用同一組節點——分開用會讓成績頁把相同概念拆成兩列。
    const questions = getQuestions(subjectId);
    const valid = new Set(allNodes[subjectId].map(topicLabel));

    it(`${subjectId}：沒有「未分類」`, () => {
      expect(questions.filter((q) => q.topic === "未分類").map((q) => q.id)).toEqual([]);
    });

    it(`${subjectId}：每題的 topic 都是目錄裡的節點，格式為「五碼 名稱」`, () => {
      const offenders = questions.filter((q) => !valid.has(q.topic)).map((q) => `${q.id}=${q.topic}`);
      expect(offenders).toEqual([]);
      for (const q of questions) expect(q.topic).toMatch(/^L\d{5} /);
    });

    it(`${subjectId}：目錄裡每個節點至少有一題`, () => {
      const used = new Set(questions.map((q) => q.topic));
      const empty = allNodes[subjectId].filter((n) => !used.has(topicLabel(n)));
      expect(empty.map((n) => n.code)).toEqual([]);
    });
  }

  // L233 底下官方把第三、四個節點誤編為 L22303/L22304，而 L22303 已被 L223 用掉。
  // 本專案改用 L23303/L23304；節點碼是分組用的唯一鍵，撞號會讓兩科的節點合併。
  it("節點碼在全體科目間唯一（官方 L233 的撞號已修正）", () => {
    const seen = new Map<string, string>();
    for (const [subjectId, nodes] of Object.entries(allNodes)) {
      for (const node of nodes) {
        const previous = seen.get(node.code);
        expect(previous, `${node.code} 同時出現在 ${previous} 與 ${subjectId}`).toBeUndefined();
        seen.set(node.code, subjectId);
      }
    }
  });

  it("節點碼前綴與科目相符（junior-ai-basics 為 L11xxx，餘類推）", () => {
    const prefix: Record<string, string> = {
      "junior-ai-basics": "L11", "junior-genai": "L12",
      "senior-ai-tech": "L21", "senior-bigdata": "L22", "senior-ml": "L23",
    };
    for (const subjectId of ALL) {
      for (const node of allNodes[subjectId]) {
        expect(node.code.startsWith(prefix[subjectId]), `${node.code} @ ${subjectId}`).toBe(true);
      }
    }
  });

  it("中級節點目錄與 allNodes 一致（seniorNodes 是它的子集）", () => {
    for (const [subjectId, nodes] of Object.entries(seniorNodes)) {
      expect(allNodes[subjectId].map(topicLabel)).toEqual(nodes.map(topicLabel));
    }
  });
});
