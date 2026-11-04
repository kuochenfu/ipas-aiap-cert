/**
 * 題庫覆蓋矩陣報表：`npm run report:coverage`
 *
 * 「題庫完整度不是題數」——一個節點有 30 題但全是 L1 記憶題，仍然是低品質覆蓋。
 * 這支腳本把 `QuestionMeta` 依 節點 × 認知層級 × 題型 攤開，輸出到
 * `docs/coverage/coverage-matrix.md`，讓覆蓋缺口變成看得見的東西。
 *
 * 「缺口」以**原題庫＋新題庫合併**判斷：兩者都是同一科的刷題來源，學習者練得到的是兩者的聯集。
 * 2026-11-04 以前是逐題庫判斷，結果把 AIoT 考科一的官方 80 題（單層、本來就沒有 L3／L4、也不能塞 LLM 題）
 * 與只有 2 題的 L22402 原題庫列成缺口，而它們在新題庫各有 6–14 題 L3／L4（backlog「這一輪之後還剩什麼」第 1 項）。
 * 各題庫自己的分布仍照實列出，但不再標缺口。
 *
 * 純讀取、不改任何題庫資料；產物是文件，可安全重跑。
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { getPracticeQuestions } from "../src/data/practice";
import { archetypeLabels, cognitiveLevelLabels, type CognitiveLevel } from "../src/domain/diagnostics";
import { concepts, conceptsOf } from "../src/domain/concepts";
import type { Question, QuestionArchetype } from "../src/data/types";

const here = dirname(fileURLToPath(import.meta.url));
const outFile = join(here, "..", "docs", "coverage", "coverage-matrix.md");

const LEVELS = Object.keys(cognitiveLevelLabels) as CognitiveLevel[];
const ARCHETYPES = Object.keys(archetypeLabels) as QuestionArchetype[];

const pct = (n: number, total: number): string =>
  total === 0 ? "—" : `${Math.round((n / total) * 100)}%`;

/** 只有帶 meta 的題目能進矩陣；沒有 meta 的題數另外誠實列出。 */
const withMeta = (questions: Question[]): Question[] => questions.filter((q) => q.meta);

const subjectSection = (name: string, bankLabel: string, bank: Question[]): string => {
  const tagged = withMeta(bank);
  if (tagged.length === 0) {
    return `### ${name}｜${bankLabel}\n\n共 ${bank.length} 題，**尚未回填 meta**，無法產生矩陣。\n`;
  }

  // ── 節點 × 認知層級 ──
  const byNode = new Map<string, Question[]>();
  for (const question of tagged) {
    const list = byNode.get(question.topic) ?? [];
    list.push(question);
    byNode.set(question.topic, list);
  }
  const nodeRows = [...byNode.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([topic, list]) => {
      const counts = LEVELS.map((level) => list.filter((q) => q.meta!.cognitiveLevel === level).length);
      const cross = list.filter((q) => q.meta!.crossNode).length;
      return `| ${topic} | ${list.length} | ${counts.join(" | ")} | ${cross} |`;
    });

  const levelTotals = LEVELS.map((level) => tagged.filter((q) => q.meta!.cognitiveLevel === level).length);
  const archetypeRows = ARCHETYPES
    .map((archetype) => ({ archetype, n: tagged.filter((q) => q.meta!.archetype === archetype).length }))
    .filter((row) => row.n > 0)
    .sort((a, b) => b.n - a.n)
    .map((row) => `| ${archetypeLabels[row.archetype]} | ${row.n} | ${pct(row.n, tagged.length)} |`);

  const untagged = bank.length - tagged.length;
  const untaggedNote = untagged > 0 ? `（另有 ${untagged} 題未帶 meta，未計入）` : "";

  return `### ${name}｜${bankLabel}

共 ${tagged.length} 題${untaggedNote}。認知層級分布：${
    LEVELS.map((level, i) => `${level} ${levelTotals[i]}（${pct(levelTotals[i], tagged.length)}）`).join("、")
  }

| 評鑑內容節點 | 題數 | ${LEVELS.join(" | ")} | 跨節點 |
|---|---:|---:|---:|---:|---:|---:|
${nodeRows.join("\n")}

| 題型原型 | 題數 | 佔比 |
|---|---:|---:|
${archetypeRows.join("\n")}
`;
};

const isHigherOrder = (q: Question): boolean =>
  q.meta?.cognitiveLevel === "L3" || q.meta?.cognitiveLevel === "L4";

type CombinedRow = { subject: string; topic: string; total: number; practiceHi: number; mainHi: number };

/** 每科一張：兩個題庫合併後，各節點有幾題 L3／L4。缺口只在這裡判斷。 */
const combinedRows = (subjectName: string, main: Question[], practice: Question[]): CombinedRow[] => {
  const byNode = new Map<string, CombinedRow>();
  for (const [bank, isPractice] of [[main, false], [practice, true]] as const) {
    for (const q of withMeta(bank)) {
      const row = byNode.get(q.topic) ?? { subject: subjectName, topic: q.topic, total: 0, practiceHi: 0, mainHi: 0 };
      row.total += 1;
      if (isHigherOrder(q)) {
        if (isPractice) row.practiceHi += 1;
        else row.mainHi += 1;
      }
      byNode.set(q.topic, row);
    }
  }
  return [...byNode.values()].sort((a, b) => a.topic.localeCompare(b.topic));
};

const combinedSection = (name: string, rows: CombinedRow[]): string => `### ${name}｜兩個題庫合併

| 評鑑內容節點 | 題數 | L3/L4 新題庫 | L3/L4 原題庫 | L3/L4 合計 | 缺口 |
|---|---:|---:|---:|---:|---|
${rows
  .map((r) => {
    const hi = r.practiceHi + r.mainHi;
    // 合併後仍完全沒有 L3/L4，代表這個節點只考得出「記得嗎」，才是真正的覆蓋缺口。
    return `| ${r.topic} | ${r.total} | ${r.practiceHi} | ${r.mainHi} | ${hi} | ${hi === 0 ? "⚠ 無 L3/L4" : ""} |`;
  })
  .join("\n")}
`;

const allCombined: CombinedRow[] = [];
const sections: string[] = [];
let totalTagged = 0;
let totalAll = 0;

for (const subject of subjects) {
  const main = getQuestions(subject.id);
  const practice = getPracticeQuestions(subject.id);
  totalAll += main.length + practice.length;
  totalTagged += withMeta(main).length + withMeta(practice).length;
  const rows = combinedRows(subject.name, main, practice);
  allCombined.push(...rows);
  if (rows.length > 0) sections.push(combinedSection(subject.name, rows));
  if (practice.length > 0) {
    sections.push(subjectSection(subject.name, "新題庫", practice));
  }
  if (withMeta(main).length > 0) {
    sections.push(subjectSection(subject.name, "原題庫", main));
  }
}

// ── 概念覆蓋 ──
// 受控詞彙（`domain/concepts.ts`）裡完全沒有題目的概念，就是該考點目前沒被練到。
const allQuestions = subjects.flatMap((subject) => [
  ...getQuestions(subject.id),
  ...getPracticeQuestions(subject.id),
]);
const conceptHits = new Map<string, number>();
let unmatched = 0;
for (const question of allQuestions) {
  const matched = conceptsOf(question);
  if (matched.length === 0) unmatched += 1;
  for (const concept of matched) conceptHits.set(concept.id, (conceptHits.get(concept.id) ?? 0) + 1);
}
const emptyConcepts = concepts.filter((concept) => !conceptHits.has(concept.id));
const conceptSection = `## 概念覆蓋

受控詞彙共 ${concepts.length} 條（\`src/domain/concepts.ts\`）。
${allQuestions.length - unmatched} 題（${pct(allQuestions.length - unmatched, allQuestions.length)}）至少對上一個概念。

${
  emptyConcepts.length === 0
    ? "每一條概念都有題目。"
    : `**目前沒有任何題目的概念（${emptyConcepts.length} 條）**：${
        emptyConcepts.map((concept) => concept.label).join("、")
      }。這些是考點有列、題庫卻沒練到的地方。`
}

概念比對是啟發式的（比對概念標註、題幹與正解），僅供覆蓋盤點，不作為配額依據。
`;

const hiOf = (r: CombinedRow): number => r.practiceHi + r.mainHi;
const gapCount = allCombined.filter((r) => hiOf(r) === 0).length;
const thinnest = [...allCombined].sort((a, b) => hiOf(a) - hiOf(b) || a.topic.localeCompare(b.topic)).slice(0, 10);
const sortedHi = allCombined.map(hiOf).sort((a, b) => a - b);
const medianHi = sortedHi.length ? sortedHi[Math.floor(sortedHi.length / 2)] : 0;
const thinSection = `## 摘要：L3／L4 最少的節點（兩個題庫合併）

共 ${allCombined.length} 個節點，${
  gapCount === 0 ? "**每個節點都有 L3／L4 題**" : `**${gapCount} 個節點完全沒有 L3／L4 題**（下方各科表格標 ⚠）`
}；每節點 L3／L4 題數中位數 ${medianHi}。擴充新題時，優先補下表最前面的節點。

| 科目 | 評鑑內容節點 | 題數 | L3/L4 合計 |
|---|---|---:|---:|
${thinnest.map((r) => `| ${r.subject} | ${r.topic} | ${r.total} | ${hiOf(r)} |`).join("\n")}
`;

const doc = `# 題庫覆蓋矩陣

> 由 \`npm run report:coverage\` 產生，**請勿手改**——重跑會覆寫。
> 產生時間：${new Date().toISOString().slice(0, 10)}

覆蓋度不是題數：一個節點有 30 題但全是 L1 記憶題，仍然是低品質覆蓋。
下表把每一科攤成 **節點 × 認知層級 × 題型**。原題庫與新題庫都是同一科的刷題來源，
因此「缺口」以兩者合併判斷（各科的「兩個題庫合併」表）；各題庫自己的分布照實列出，不另標缺口——
例如 AIoT 考科一的原題庫是官方學習指引的 80 題練習評量，本來就沒有 L3／L4，那是官方題的事實，不是待補的洞。

全站共 ${totalAll} 題，其中 ${totalTagged} 題（${pct(totalTagged, totalAll)}）帶命題後設資料。${
  totalTagged < totalAll
    ? "\n未帶 meta 的題目無法進入矩陣——這本身就是最大的覆蓋盲點。"
    : ""
}

認知層級：${LEVELS.map((level) => cognitiveLevelLabels[level]).join("、")}。

${thinSection}
${sections.join("\n")}
${conceptSection}`;

writeFileSync(outFile, doc, "utf8");
console.log(`✔ 已寫入 ${outFile}（${totalTagged}/${totalAll} 題帶 meta）`);
