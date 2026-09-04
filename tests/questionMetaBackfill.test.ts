import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { archetypeLabels, cognitiveLevelLabels } from "../src/domain/diagnostics";
import type { QuestionArchetype } from "../src/data/types";

/**
 * 原題庫（1,057 題真題／官方練習評量／自編新題）的 meta 回填守衛。
 *
 * 這一層的失敗方式是**沉默的**：漏標一題，該題只是不出現在診斷表裡，畫面完全正常；
 * id 打錯，回填就套不上去，同樣看不出來。因此這裡守住三件事——
 * 每題都有、沒有孤兒 id、值都在型別允許的集合內。
 *
 * 分布不設區間：這些是**已經存在的官方真題**，分布是量出來的事實，不是可以設計的目標
 * （新題庫的分布契約在 `tests/questionBankMeta.test.ts`，那才是命題時控得住的）。
 * 但仍記錄一條下限：L3＋L4 至少要佔兩成，低於此代表回填可能整批標得太保守。
 */

const LEVELS = new Set(Object.keys(cognitiveLevelLabels));
const ARCHETYPES = new Set(Object.keys(archetypeLabels));

describe("原題庫的 meta 回填", () => {
  for (const subject of subjects) {
    const questions = getQuestions(subject.id);
    if (questions.length === 0) continue;

    it(`${subject.id}：每一題都有認知層級與題型原型`, () => {
      const missing = questions.filter((question) => !question.meta).map((question) => question.id);
      expect(missing, `未回填：${missing.slice(0, 5).join("、")}`).toEqual([]);
    });

    it(`${subject.id}：值都在允許的集合內`, () => {
      for (const question of questions) {
        expect(LEVELS.has(question.meta!.cognitiveLevel), question.id).toBe(true);
        expect(ARCHETYPES.has(question.meta!.archetype), `${question.id}：${question.meta!.archetype}`).toBe(true);
      }
    });

    it(`${subject.id}：回填層不含題庫裡沒有的 id（孤兒項）`, async () => {
      const map = (await import(`../src/data/meta/${subject.id}`)).questionMeta as Record<string, unknown>;
      const ids = new Set(questions.map((question) => question.id));
      const orphans = Object.keys(map).filter((id) => !ids.has(id));
      expect(orphans, `孤兒 id：${orphans.slice(0, 5).join("、")}`).toEqual([]);
    });
  }

  it("全題庫的 L3＋L4 佔比不低於兩成", () => {
    const all = subjects.flatMap((subject) => getQuestions(subject.id));
    const higher = all.filter((question) => {
      const level = question.meta!.cognitiveLevel;
      return level === "L3" || level === "L4";
    }).length;
    expect(higher / all.length).toBeGreaterThan(0.2);
  });

  it("題型原型不會退化成只有一兩種", () => {
    // 回填若整批偷懶標成同一型，診斷表就失去意義。
    const used = new Set<QuestionArchetype>();
    for (const subject of subjects) {
      for (const question of getQuestions(subject.id)) used.add(question.meta!.archetype);
    }
    expect(used.size).toBeGreaterThanOrEqual(8);
  });
});
