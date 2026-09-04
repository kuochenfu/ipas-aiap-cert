/**
 * 題庫覆蓋矩陣報表：`npm run report:coverage`
 *
 * 「題庫完整度不是題數」——一個節點有 30 題但全是 L1 記憶題，仍然是低品質覆蓋。
 * 這支腳本把 `QuestionMeta` 依 節點 × 認知層級 × 題型 攤開，輸出到
 * `docs/coverage/coverage-matrix.md`，讓覆蓋缺口變成看得見的東西。
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
      // 一個節點若完全沒有 L3/L4，代表它只考得出「記得嗎」，是真正的覆蓋缺口。
      const gap = counts[2] + counts[3] === 0 ? "⚠ 無 L3/L4" : "";
      return `| ${topic} | ${list.length} | ${counts.join(" | ")} | ${cross} | ${gap} |`;
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

| 評鑑內容節點 | 題數 | ${LEVELS.join(" | ")} | 跨節點 | 缺口 |
|---|---:|---:|---:|---:|---:|---:|---|
${nodeRows.join("\n")}

| 題型原型 | 題數 | 佔比 |
|---|---:|---:|
${archetypeRows.join("\n")}
`;
};

const sections: string[] = [];
let totalTagged = 0;
let totalAll = 0;

for (const subject of subjects) {
  const main = getQuestions(subject.id);
  const practice = getPracticeQuestions(subject.id);
  totalAll += main.length + practice.length;
  totalTagged += withMeta(main).length + withMeta(practice).length;
  if (practice.length > 0) {
    sections.push(subjectSection(subject.name, "新題庫", practice));
  }
  if (withMeta(main).length > 0) {
    sections.push(subjectSection(subject.name, "原題庫", main));
  }
}

const doc = `# 題庫覆蓋矩陣

> 由 \`npm run report:coverage\` 產生，**請勿手改**——重跑會覆寫。
> 產生時間：${new Date().toISOString().slice(0, 10)}

覆蓋度不是題數：一個節點有 30 題但全是 L1 記憶題，仍然是低品質覆蓋。
下表把每一科攤成 **節點 × 認知層級 × 題型**，「缺口」欄標出完全沒有 L3／L4 題的節點。

全站共 ${totalAll} 題，其中 ${totalTagged} 題（${pct(totalTagged, totalAll)}）帶命題後設資料。${
  totalTagged < totalAll
    ? "\n未帶 meta 的題目無法進入矩陣——這本身就是最大的覆蓋盲點。"
    : ""
}

認知層級：${LEVELS.map((level) => cognitiveLevelLabels[level]).join("、")}。

${sections.join("\n")}`;

writeFileSync(outFile, doc, "utf8");
console.log(`✔ 已寫入 ${outFile}（${totalTagged}/${totalAll} 題帶 meta）`);
