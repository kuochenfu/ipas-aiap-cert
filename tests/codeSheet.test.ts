import { describe, it, expect } from "vitest";
import { questions } from "../src/data/senior-ml";
import { seniorMlCodeSheet as sheet } from "../src/data/codeSheet.senior-ml";
import {
  codeSheetExamIds, examRefLabel, parseStudyPageKey, renderStudyIndex, renderStudyReader, studyPageKey,
} from "../src/ui/render";

/**
 * 科目三程式速查的守衛。
 *
 * 這一頁的價值在於「每張卡片都回溯得到真題與官方文件」：題號寫錯、連結指向非官方網站，
 * 或日後新增的真題程式題沒有被收進來，型別檢查都抓不到。
 */

const cards = sheet.sections.flatMap((section) => section.cards);
const byId = new Map(questions.map((q) => [q.id, q]));

/** 真題裡附程式碼或程式輸出的題目（含選項本身是程式碼的）。 */
const pastCodeQuestionIds = questions
  .filter((q) => q.source === "past-exam")
  .filter((q) =>
    (q.figures ?? []).some((f) => f.kind === "code" || f.kind === "output") ||
    Object.keys(q.choiceFigures ?? {}).length > 0)
  .map((q) => q.id);

const OFFICIAL_HOSTS = new Set([
  "scikit-learn.org", "numpy.org", "docs.pytorch.org", "keras.io", "www.tensorflow.org",
  "pandas.pydata.org", "github.com",
]);

describe("科目三程式速查", () => {
  it("引用的題號都是存在的真題", () => {
    const refs = [...cards.flatMap((c) => c.exams), ...sheet.traps.flatMap((t) => t.exams)];
    for (const id of refs) {
      expect(byId.get(id)?.source, id).toBe("past-exam");
    }
  });

  it("每一題附程式碼的真題都至少被一張卡片收錄", () => {
    const covered = new Set(cards.flatMap((c) => c.exams));
    expect(pastCodeQuestionIds.length).toBeGreaterThanOrEqual(20);
    expect(pastCodeQuestionIds.filter((id) => !covered.has(id))).toEqual([]);
  });

  it("卡片 id 不重複、每張都有考點、實務與官方文件", () => {
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    for (const card of cards) {
      expect(card.point.trim(), card.id).not.toBe("");
      expect(card.why.trim(), card.id).not.toBe("");
      expect(card.practice.trim(), card.id).not.toBe("");
      expect(card.docs.length, card.id).toBeGreaterThan(0);
    }
  });

  it("文件連結都是 https 的官方來源", () => {
    const urls = [...cards.flatMap((c) => c.docs.map((d) => d.url)), ...sheet.versions.map((v) => v.docs)];
    for (const url of urls) {
      const parsed = new URL(url);
      expect(parsed.protocol, url).toBe("https:");
      expect(OFFICIAL_HOSTS.has(parsed.hostname), url).toBe(true);
    }
  });

  it("「必考」只給兩卷都考過或同卷考兩題以上的卡片", () => {
    const paper = (id: string) => id.replace(/-q\d+$/, "");
    for (const card of cards.filter((c) => c.priority === "core")) {
      const papers = new Set(card.exams.map(paper));
      expect(papers.size >= 2 || card.exams.length >= 2, card.id).toBe(true);
    }
  });

  it("全局圖：步驟引用的卡片都存在，每張卡片至少落在一個步驟，迴圈指向存在的步驟", () => {
    const pipeline = sheet.pipeline!;
    expect(pipeline).toBeDefined();
    const cardIds = new Set(cards.map((c) => c.id));
    const stages = pipeline.phases.flatMap((p) => p.stages);
    const stageIds = new Set(stages.map((s) => s.id));
    expect(stageIds.size).toBe(stages.length);
    for (const stage of stages) {
      for (const id of stage.cards) expect(cardIds.has(id), `${stage.id} → ${id}`).toBe(true);
      for (const text of [stage.goal, stage.doing, stage.system, stage.risk]) expect(text.trim(), stage.id).not.toBe("");
    }
    for (const item of pipeline.crosscut) {
      for (const id of item.cards) expect(cardIds.has(id), `${item.title} → ${id}`).toBe(true);
    }
    const placed = new Set(stages.flatMap((s) => s.cards));
    expect(cards.filter((c) => !placed.has(c.id)).map((c) => c.id)).toEqual([]);
    for (const loop of pipeline.loops) {
      expect(stageIds.has(loop.from), loop.from).toBe(true);
      expect(stageIds.has(loop.to), loop.to).toBe(true);
    }
  });

  it("題號標籤以卷次與題號顯示", () => {
    expect(examRefLabel("senior-ml-114-2-q47")).toBe("114 年第 2 次・第 47 題");
    expect(examRefLabel("senior-ml-115-1-q05")).toBe("115 年第 1 次・第 5 題");
  });
});

describe("程式速查頁的呈現", () => {
  const codeSheets = { [sheet.subjectId]: sheet };

  it("頁面鍵可以來回轉換，未知科目不成立", () => {
    const key = studyPageKey({ kind: "code", subjectId: "senior-ml" });
    expect(key).toBe("code|senior-ml");
    expect(parseStudyPageKey(key)).toEqual({ kind: "code", subjectId: "senior-ml" });
    expect(parseStudyPageKey("code|nope")).toBeUndefined();
  });

  it("只在有速查資料的證照索引出現入口", () => {
    expect(renderStudyIndex({ cert: "aiap", codeSheets })).toContain('data-study-open="code|senior-ml"');
    expect(renderStudyIndex({ cert: "aiot", codeSheets })).not.toContain("code|senior-ml");
  });

  it("閱讀器列出每張卡片、陷阱與版本表，外部連結開新分頁", () => {
    const html = renderStudyReader({ page: { kind: "code", subjectId: "senior-ml" }, codeSheets });
    expect(html.match(/class="code-card"/g)?.length).toBe(cards.length);
    expect(html).toContain(`${codeSheetExamIds(sheet).length} 題真題程式題`);
    for (const v of sheet.versions) expect(html).toContain(v.version);
    const anchors = html.match(/<a [^>]*>/g) ?? [];
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) expect(a).toContain('target="_blank" rel="noopener noreferrer"');
  });

  it("全局圖排在第一段，每個跳轉都有對應的目標", () => {
    const html = renderStudyReader({ page: { kind: "code", subjectId: "senior-ml" }, codeSheets });
    const stages = sheet.pipeline!.phases.flatMap((p) => p.stages);
    expect(html.match(/class="ml-node"/g)?.length).toBe(stages.length);
    expect(html.indexOf('id="code-pipeline"')).toBeLessThan(html.indexOf('id="code-traps"'));
    const targets = [...html.matchAll(/data-study-jump="([^"]+)"/g)].map((m) => m[1]);
    expect(targets.length).toBeGreaterThan(stages.length);
    for (const id of new Set(targets)) expect(html, id).toContain(`id="${id}"`);
  });

  it("沒有資料時顯示找不到頁面", () => {
    expect(renderStudyReader({ page: { kind: "code", subjectId: "senior-ml" } })).toContain("找不到這一頁");
  });
});
