import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { getPracticeQuestions } from "../src/data/practice";
import type { Question } from "../src/data/types";

/**
 * 中級程式閱讀題（2026-10-29）。
 *
 * 官方真題的科目二、科目三約有 22% 是程式題，新題庫原本一題都沒有。這批依真題比例補上，
 * 每題附一支在固定版本環境實際執行的驗證腳本（scripts/code-questions/，CI 沒有 Python，
 * 所以腳本本身不在這裡跑）。這裡守的是兩件不需要 Python 就能檢查的事：
 * 比例不被日後加題稀釋，以及題目與驗證腳本一一對應。
 * 計畫見 docs/superpowers/plans/2026-10-29-senior-code-reading-questions.md。
 */

const hasCode = (q: Question) =>
  (q.figures ?? []).some((f) => f.kind === "code" || f.kind === "output")
  || Object.keys(q.choiceFigures ?? {}).length > 0;

const scriptIds = new Set(
  readdirSync(join(__dirname, "..", "scripts/code-questions"))
    .filter((f) => f.endsWith(".py"))
    .map((f) => f.replace(/\.py$/, "")),
);

describe("中級程式閱讀題", () => {
  for (const subjectId of ["senior-bigdata", "senior-ml"]) {
    it(`${subjectId}：帶程式碼附圖的題目占新題庫 20% 以上（真題約 22%）`, () => {
      const qs = getPracticeQuestions(subjectId);
      const share = (qs.filter(hasCode).length / qs.length) * 100;
      expect(share, `${share.toFixed(1)}%`).toBeGreaterThanOrEqual(20);
    });
  }

  it("每題帶程式碼的新題都有驗證腳本，且每支腳本都對得到題目", () => {
    const senior = ["senior-ai-tech", "senior-bigdata", "senior-ml"].flatMap((id) => getPracticeQuestions(id));
    const missing = senior.filter(hasCode).map((q) => q.id).filter((id) => !scriptIds.has(id));
    const ids = new Set(senior.map((q) => q.id));
    const orphans = [...scriptIds].filter((id) => !ids.has(id));
    expect(missing, "缺驗證腳本").toEqual([]);
    expect(orphans, "腳本對不到題目").toEqual([]);
  });
});
