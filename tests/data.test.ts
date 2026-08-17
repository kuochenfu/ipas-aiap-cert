import { describe, it, expect } from "vitest";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { allNodes, seniorNodes, topicLabel } from "../src/domain/assessmentTopics";

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

  // 2026-08-17（backlog T7）起，五科的 topic 一律改用五碼評鑑節點，真題與新題共用同一組。
  it("新題 topic ∈ 官方評鑑節點目錄", () => {
    const allowed = new Set(allNodes["junior-genai"].map(topicLabel));
    for (const q of generated) {
      expect(allowed.has(q.topic)).toBe(true);
    }
  });
});

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
      // 中級三科各有 114年第二梯次、115年第一次兩份公告試題，每份 50 題。
      const sittings = ["114-2", "115-1"];
      for (const sitting of sittings) {
        expect(past.filter((q) => q.id.includes(`-${sitting}-`)).length).toBe(50);
      }
      expect(past.length).toBe(50 * sittings.length + expectedGuideCounts[sid]);
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
    // 2026-08-17（backlog T7）起，中級三科的 topic 一律改用五碼評鑑節點，
    // 真題與新題共用同一組節點——否則成績頁的主題統計會把相同概念拆成兩列。
    it("新題 topic ∈ 官方評鑑節點目錄", () => {
      const allowed = new Set(seniorNodes[sid].map(topicLabel));
      const offenders = generated.filter((q) => !allowed.has(q.topic)).map((q) => `${q.id}=${q.topic}`);
      expect(offenders).toEqual([]);
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
  it("新題 topic ∈ 官方評鑑節點目錄", () => {
    const allowed = new Set(allNodes["junior-ai-basics"].map(topicLabel));
    const offenders = generated.filter((q) => !allowed.has(q.topic)).map((q) => `${q.id}=${q.topic}`);
    expect(offenders).toEqual([]);
  });
});

describe("2025-2026 補充講義新題", () => {
  const REF_PREFIX = "2025-2026補充講義";
  const targets: Record<string, string[]> = {
    "junior-ai-basics": allNodes["junior-ai-basics"].map(topicLabel),
    "junior-genai": allNodes["junior-genai"].map(topicLabel),
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
