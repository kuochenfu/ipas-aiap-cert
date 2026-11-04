/**
 * 套用後重新載入資料，逐欄和 patch 比對。須在 apply.ts 之後以新的行程執行（才會讀到改過的原始碼）。
 *
 *   npx tsx scripts/choice-length/verify.ts <patch.json>...
 */
import { readFileSync } from "node:fs";
import { loadAllLlmQuestions, type Patch } from "./banks";

const questions = loadAllLlmQuestions();
const mismatches: string[] = [];
let compared = 0;
const expectEqual = (actual: string | undefined, expected: string, label: string) => {
  compared++;
  if (actual !== expected) mismatches.push(label);
};

for (const path of process.argv.slice(2)) {
  const patch: Patch = JSON.parse(readFileSync(path, "utf8"));
  for (const [id, p] of Object.entries(patch)) {
    const q = questions.get(id);
    if (!q) { mismatches.push(`${id}：找不到題目`); continue; }
    for (const [k, v] of Object.entries(p.choices ?? {})) expectEqual(q.choices.find((c) => c.id === k)?.text, v, `${id} 選項 ${k}`);
    for (const [k, v] of Object.entries(p.choiceExplanations ?? {})) expectEqual(q.choiceExplanations?.[k as keyof typeof q.choiceExplanations], v, `${id} 解析 ${k}`);
    for (const [k, v] of Object.entries(p.distractorTypes ?? {})) expectEqual(q.meta?.distractorTypes?.[k as keyof NonNullable<typeof q.meta>["distractorTypes"]], v, `${id} 干擾類型 ${k}`);
    if (p.explanation !== undefined) expectEqual(q.explanation, p.explanation, `${id} 詳解`);
  }
}

console.log(`比對 ${compared} 欄，不一致 ${mismatches.length}`);
mismatches.forEach((m) => console.log(`  ${m}`));
process.exit(mismatches.length ? 1 : 0);
