import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";

describe("題庫完整性", () => {
  for (const subject of subjects) {
    describe(subject.id, () => {
      const questions = getQuestions(subject.id);
      it("題庫非空", () => {
        expect(questions.length).toBeGreaterThan(0);
      });
      it("每題四選項、答案為A-D、id唯一、subjectId相符", () => {
        const ids = new Set<string>();
        for (const q of questions) {
          expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
          expect(["A", "B", "C", "D"]).toContain(q.answer);
          expect(q.subjectId).toBe(subject.id);
          expect(ids.has(q.id)).toBe(false);
          ids.add(q.id);
        }
      });
      it("真題在合併後皆有詳解（無例外；品質門檻另見 tests/explanationsCoverage.test.ts）", () => {
        const missing = questions
          .filter((q) => q.source === "past-exam" && q.explanation.trim().length === 0)
          .map((q) => q.id);
        expect(missing).toEqual([]);
      });
    });
  }
});

describe("junior-genai 內容完整性", () => {
  const questions = getQuestions("junior-genai");
  const past = questions.filter((q) => q.source === "past-exam");
  const generated = questions.filter((q) => q.source === "generated");

  it("179 題真題；已補詳解的舊梯次與學習指引皆非空", () => {
    expect(past.length).toBe(179);
    const legacy = past.filter((q) => !q.id.includes("-115-2-") && !q.id.includes("-guide-"));
    expect(legacy.length).toBe(100);
    const missing = legacy.filter((q) => q.explanation.trim().length === 0);
    expect(missing.map((q) => q.id)).toEqual([]);
    const guide = past.filter((q) => q.id.includes("-guide-"));
    expect(guide.length).toBe(29);
    expect(guide.filter((q) => q.explanation.trim().length === 0).map((q) => q.id)).toEqual([]);
  });

  it("115年第二次真題匯入 50 題且保留來源", () => {
    const second = past.filter((q) => q.id.includes("-115-2-"));
    expect(second.length).toBe(50);
    expect(second.map((q) => q.sourceRef)).toContain("115年第二次 第1題");
    expect(second.map((q) => q.sourceRef)).toContain("115年第二次 第50題");
    // 手寫詳解／選項解析的覆蓋率與品質斷言見 tests/explanationsCoverage.test.ts。
  });

  it("新題數 ≥10", () => {
    expect(generated.length).toBeGreaterThanOrEqual(10);
  });

  it("新題 id 符合 junior-genai-gen-qNNN 規則且唯一", () => {
    const ids = generated.map((q) => q.id);
    for (const id of ids) {
      expect(id).toMatch(/^junior-genai-gen-q\d{3}$/);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("新題 topic 為三個官方主題之一（非未分類）", () => {
    const allowed = new Set([
      "No code / Low code 概念",
      "生成式 AI 應用領域與工具使用",
      "生成式 AI 導入評估規劃",
    ]);
    for (const q of generated) {
      expect(allowed.has(q.topic)).toBe(true);
    }
  });
});

const officialTopics: Record<string, string[]> = {
  "junior-ai-basics": ["人工智慧概念", "資料處理與分析概念", "機器學習概念", "鑑別式 AI 與生成式 AI 概念"],
  "senior-ai-tech": ["AI 相關技術應用", "AI 導入評估規劃", "AI 技術應用與系統部署"],
  "senior-bigdata": ["機率統計基礎", "大數據處理技術", "大數據分析方法與工具", "大數據在人工智慧之應用"],
  "senior-ml": ["機器學習基礎數學", "機器學習與深度學習", "機器學習建模與參數調校", "機器學習治理"],
};

for (const sid of ["senior-ai-tech", "senior-bigdata", "senior-ml"]) {
  describe(`${sid} 內容完整性`, () => {
    const questions = getQuestions(sid);
    const past = questions.filter((q) => q.source === "past-exam");
    const generated = questions.filter((q) => q.source === "generated");

    it("公告真題與學習指引參考題詳解皆非空", () => {
      const expectedGuideCounts: Record<string, number> = {
        "senior-ai-tech": 30,
        "senior-bigdata": 40,
        "senior-ml": 40,
      };
      expect(past.length).toBe(50 + expectedGuideCounts[sid]);
      const guide = past.filter((q) => q.id.includes("-guide-"));
      expect(guide.length).toBe(expectedGuideCounts[sid]);
      expect(past.filter((q) => q.explanation.trim().length === 0).map((q) => q.id)).toEqual([]);
    });
    it("新題數 ≥16", () => {
      expect(generated.length).toBeGreaterThanOrEqual(16);
    });
    it("新題 id 規則且唯一", () => {
      const re = new RegExp(`^${sid}-gen-q\\d{3}$`);
      const ids = generated.map((q) => q.id);
      for (const id of ids) expect(id).toMatch(re);
      expect(new Set(ids).size).toBe(ids.length);
    });
    it("新題 topic ∈ 官方主題", () => {
      const allowed = new Set(officialTopics[sid]);
      for (const q of generated) expect(allowed.has(q.topic)).toBe(true);
    });
  });
}

describe("junior-ai-basics 新題完整性", () => {
  const questions = getQuestions("junior-ai-basics");
  const past = questions.filter((q) => q.source === "past-exam");
  const generated = questions.filter((q) => q.source === "generated");

  it("190 題真題；115年第二次與學習指引皆已匯入且保留來源", () => {
    expect(past.length).toBe(190);
    const second = past.filter((q) => q.id.includes("-115-2-"));
    expect(second.length).toBe(50);
    expect(second.map((q) => q.sourceRef)).toContain("115年第二次 第1題");
    expect(second.map((q) => q.sourceRef)).toContain("115年第二次 第50題");
    // 手寫詳解／選項解析的覆蓋率與品質斷言見 tests/explanationsCoverage.test.ts。
    const guide = past.filter((q) => q.id.includes("-guide-"));
    expect(guide.length).toBe(40);
    expect(guide.map((q) => q.sourceRef)).toContain("初級科目一學習指引參考題 第1題");
    expect(guide.map((q) => q.sourceRef)).toContain("初級科目一學習指引參考題 第40題");
    expect(guide.filter((q) => q.explanation.trim().length === 0).map((q) => q.id)).toEqual([]);
    expect(past.find((q) => q.id === "junior-ai-basics-guide-q013")?.answer).toBe("A");
  });

  it("新題數 ===32", () => {
    expect(generated.length).toBe(32);
  });
  it("新題 topic ∈ L111–L114 官方主題", () => {
    const allowed = new Set(officialTopics["junior-ai-basics"]);
    for (const q of generated) expect(allowed.has(q.topic)).toBe(true);
  });
});

describe("2025-2026 補充講義新題", () => {
  const REF_PREFIX = "2025-2026補充講義";
  const targets: Record<string, string[]> = {
    "junior-ai-basics": officialTopics["junior-ai-basics"],
    "junior-genai": ["No code / Low code 概念", "生成式 AI 應用領域與工具使用", "生成式 AI 導入評估規劃"],
  };

  const guideQuestions = Object.keys(targets).flatMap((sid) =>
    getQuestions(sid).filter((q) => q.source === "generated" && (q.sourceRef ?? "").startsWith(REF_PREFIX)),
  );

  it("兩科皆有以補充講義為來源的新題", () => {
    for (const sid of Object.keys(targets)) {
      const forSubject = guideQuestions.filter((q) => q.subjectId === sid);
      expect(forSubject.length).toBeGreaterThan(0);
    }
  });

  it("補充講義新題合計 ≥18", () => {
    expect(guideQuestions.length).toBeGreaterThanOrEqual(18);
  });

  it("每題四選項、詳解非空、topic 在該科官方白名單內", () => {
    for (const q of guideQuestions) {
      expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
      expect(["A", "B", "C", "D"]).toContain(q.answer);
      expect(q.explanation.trim().length).toBeGreaterThan(0);
      expect(new Set(targets[q.subjectId]).has(q.topic)).toBe(true);
    }
  });
});
