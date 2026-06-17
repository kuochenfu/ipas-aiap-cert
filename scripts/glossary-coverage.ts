import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeChoiceTerm } from "../src/data/choiceAnalysis";
import { glossary } from "../src/data/glossary";

const here = dirname(fileURLToPath(import.meta.url));
const pastDir = join(here, "../src/data/past-exams");

// 具名概念型啟發式：正規化後字數短、無句末標點
const isNamedConcept = (term: string): boolean =>
  term.length > 0 && term.length <= 12 && !/[。，、；？！]/.test(term);

type Choice = { id: string; text: string };
type Q = { choices: Choice[] };

let total = 0;
let hit = 0;
let named = 0;
let sentence = 0;
const missing = new Map<string, number>();

for (const file of readdirSync(pastDir).filter((f) => f.endsWith(".json"))) {
  const questions: Q[] = JSON.parse(readFileSync(join(pastDir, file), "utf8"));
  for (const q of questions) {
    for (const c of q.choices) {
      total += 1;
      const term = normalizeChoiceTerm(c.text);
      if (glossary[term]) {
        hit += 1;
        continue;
      }
      if (isNamedConcept(term)) {
        named += 1;
        missing.set(term, (missing.get(term) ?? 0) + 1);
      } else {
        sentence += 1;
      }
    }
  }
}

const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;
console.log(`總選項數：${total}`);
console.log(`已命中：${hit}（${pct(hit)}）`);
console.log(`未命中—具名概念型：${named}（${pct(named)}）`);
console.log(`未命中—整句型：${sentence}（${pct(sentence)}）`);
console.log("\n最高頻未命中具名概念（前 30）：");
[...missing.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([term, n]) => console.log(`  ${n.toString().padStart(4)}  ${term}`));
