import { describe, it, expect } from "vitest";
import { buildMockPaper, PAPER_COUNT } from "../src/state/mockPapers";
import { getQuestions } from "../src/data/index";

describe("buildMockPaper", () => {
  it("提供固定份數，每份 50 題（題庫足夠時）", () => {
    expect(PAPER_COUNT).toBe(3);
    const p = buildMockPaper(getQuestions("junior-ai-basics"), "junior-ai-basics", 0);
    expect(p).toHaveLength(50);
  });
  it("同 seed 決定性可重現", () => {
    const bank = getQuestions("senior-ml");
    const a = buildMockPaper(bank, "senior-ml", 1).map((q) => q.id);
    const b = buildMockPaper(bank, "senior-ml", 1).map((q) => q.id);
    expect(a).toEqual(b);
  });
  it("題庫>50：三份題目集合不完全相同", () => {
    const bank = getQuestions("junior-ai-basics"); // 112
    const sets = [0, 1, 2].map((i) => new Set(buildMockPaper(bank, "junior-ai-basics", i).map((q) => q.id)));
    const same01 = [...sets[0]].every((id) => sets[1].has(id));
    expect(same01).toBe(false);
  });
  it("題庫=50：三份為同一集合的排列（集合相同、順序可不同）", () => {
    const bank = getQuestions("senior-ml").filter((q) => q.id.includes("-114-2-")); // 原公告試題恰 50 題
    const s0 = buildMockPaper(bank, "senior-ml", 0).map((q) => q.id).sort();
    const s1 = buildMockPaper(bank, "senior-ml", 1).map((q) => q.id).sort();
    expect(s0).toEqual(s1);
  });
});
