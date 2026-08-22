import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getQuestions } from "../src/data/index";
import type { Question, QuestionFigure } from "../src/data/types";
import { subjects } from "../src/domain/catalog";

// 只有「經解析器產生過 JSON」的科目才需要檢查機器產物；純自編題庫的科目
// （AIoT 考科二）沒有 past-exams 檔案，納入會直接讀檔失敗。
const allSubjectIds = subjects
  .map((s) => s.id)
  .filter((id) => existsSync(join(__dirname, "..", "src/data/past-exams", `${id}.json`)));
const allQuestions: Question[] = allSubjectIds.flatMap((id) => getQuestions(id));

const validKinds = new Set<QuestionFigure["kind"]>(["note", "code", "output", "table", "chart"]);

const figuresOf = (q: Question): QuestionFigure[] => [
  ...(q.figures ?? []),
  ...Object.values(q.choiceFigures ?? {}),
];

describe("原卷圖片的文字轉錄", () => {
  // 這是本專案「題目可作答」的底線：原卷把選項印成圖片時，pdftotext 會留下空字串，
  // 該題在站上等同壞題。手寫轉錄經 resolvePastExamExplanations 補回選項文字後，
  // 這個不變式才成立；若日後新增考卷又出現圖片選項，這裡會第一時間擋下。
  it("沒有任何題目帶著空白選項", () => {
    const broken = allQuestions
      .filter((q) => q.choices.some((c) => c.text.trim().length === 0))
      .map((q) => q.id);
    expect(broken).toEqual([]);
  });

  it("每題仍為四個選項且 id 為 A-D", () => {
    for (const q of allQuestions) {
      expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
    }
  });

  it("轉錄內容非空且 kind 合法", () => {
    for (const q of allQuestions) {
      for (const fig of figuresOf(q)) {
        expect(validKinds.has(fig.kind), `${q.id} kind=${fig.kind}`).toBe(true);
        expect(fig.content.trim().length, `${q.id} 轉錄內容為空`).toBeGreaterThan(0);
      }
    }
  });

  it("choiceFigures 的鍵只能是 A-D，且該選項文字已由轉錄補上", () => {
    for (const q of allQuestions) {
      if (!q.choiceFigures) continue;
      for (const [id, fig] of Object.entries(q.choiceFigures)) {
        expect(["A", "B", "C", "D"]).toContain(id);
        const choice = q.choices.find((c) => c.id === id);
        expect(choice?.text.trim().length, `${q.id} 選項 ${id} 文字為空`).toBeGreaterThan(0);
        expect(fig.content.trim().length).toBeGreaterThan(0);
      }
    }
  });

  // 轉錄屬於手寫層。若有人把它寫進 past-exams/*.json，下次跑 npm run parse:papers
  // 就會被機器產物覆寫而全部消失——這正是三來源設計要避免的事。
  it("轉錄不得存在於真題 JSON（機器產物）中", () => {
    const root = join(__dirname, "..");
    for (const id of allSubjectIds) {
      const raw = readFileSync(join(root, "src/data/past-exams", `${id}.json`), "utf8");
      expect(raw.includes("\"figures\""), `${id}.json 混入 figures`).toBe(false);
      expect(raw.includes("\"choiceFigures\""), `${id}.json 混入 choiceFigures`).toBe(false);
    }
  });

  // 已知會用到附圖的題目；補完後不應再退化。數字若因新增考卷而變動，
  // 請確認新卷的附圖也已轉錄後再更新。
  it("中級三科的附圖轉錄覆蓋數不低於既有水準", () => {
    const counts = Object.fromEntries(
      ["senior-ai-tech", "senior-bigdata", "senior-ml"].map((id) => [
        id,
        getQuestions(id).filter((q) => figuresOf(q).length > 0).length,
      ]),
    );
    expect(counts["senior-ai-tech"]).toBeGreaterThanOrEqual(1);
    expect(counts["senior-bigdata"]).toBeGreaterThanOrEqual(19);
    expect(counts["senior-ml"]).toBeGreaterThanOrEqual(22);
  });
});
