/**
 * 把子代理的 patch 套回原始碼。
 *
 *   npx tsx scripts/choice-length/apply.ts <patch.json>...
 *
 * 在每題的 `id: "<題目id>",` 區塊內精確替換：選項依 `{ id: "X", text: "..." }`、解析與干擾類型只在對應的
 * 物件字面值內、詳解整則替換。任何一處找不到或不唯一都報失敗且**一個檔案都不寫**——
 * 曾有選項寫成多行物件（id 與 text 分兩行）而套用失敗，靜默略過會讓那幾處無聲地沒改到。
 * 套用後一律再跑 verify.ts 逐欄比對。
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { loadAllLlmQuestions, type Patch } from "./banks";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const files = ["src/data/practice", "src/data/generated"].flatMap((dir) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => join(root, dir, f)),
);
const sources = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));
const questions = loadAllLlmQuestions();
const failures: string[] = [];
let applied = 0;

const replaceOnce = (text: string, from: string, to: string, label: string): string => {
  const count = text.split(from).length - 1;
  if (count !== 1) {
    failures.push(`${label}：找到 ${count} 處`);
    return text;
  }
  applied++;
  return text.replace(from, () => to);
};

for (const path of process.argv.slice(2)) {
  const patch: Patch = JSON.parse(readFileSync(path, "utf8"));
  for (const [id, p] of Object.entries(patch)) {
    const q = questions.get(id);
    if (!q) { failures.push(`${id}：不是 LLM 題庫裡的題目`); continue; }
    const marker = `id: "${id}",`;
    const file = files.find((f) => sources.get(f)!.includes(marker));
    if (!file) { failures.push(`${id}：找不到所在檔案`); continue; }
    const text = sources.get(file)!;
    const start = text.indexOf(marker);
    const rest = text.slice(start + marker.length).search(/\n {2}\{\n {4}id: "|\n\];/);
    const end = rest < 0 ? text.length : start + marker.length + rest;
    let block = text.slice(start, end);

    for (const [key, next] of Object.entries(p.choices ?? {})) {
      const old = q.choices.find((c) => c.id === key)?.text;
      if (old === undefined) { failures.push(`${id}：沒有選項 ${key}`); continue; }
      if (old === next) continue;
      block = replaceOnce(block, `{ id: "${key}", text: ${JSON.stringify(old)} }`, `{ id: "${key}", text: ${JSON.stringify(next)} }`, `${id} 選項 ${key}`);
    }
    const replaceInObject = (field: string, entries: Record<string, string>, olds: Partial<Record<string, string>> | undefined) => {
      const open = block.indexOf(`${field}: {`);
      if (open < 0) { failures.push(`${id}：沒有 ${field}`); return; }
      const close = block.indexOf("}", open);
      let part = block.slice(open, close);
      for (const [key, next] of Object.entries(entries)) {
        const old = olds?.[key];
        if (old === next) continue;
        if (old === undefined) { failures.push(`${id} ${field} ${key}：原本沒有這個鍵，請手動新增`); continue; }
        part = replaceOnce(part, `${key}: ${JSON.stringify(old)}`, `${key}: ${JSON.stringify(next)}`, `${id} ${field} ${key}`);
      }
      block = block.slice(0, open) + part + block.slice(close);
    };
    if (p.choiceExplanations) replaceInObject("choiceExplanations", p.choiceExplanations, q.choiceExplanations);
    if (p.distractorTypes) replaceInObject("distractorTypes", p.distractorTypes, q.meta?.distractorTypes);
    if (p.explanation !== undefined && p.explanation !== q.explanation) {
      block = replaceOnce(block, JSON.stringify(q.explanation), JSON.stringify(p.explanation), `${id} 詳解`);
    }
    sources.set(file, text.slice(0, start) + block + text.slice(end));
  }
}

if (failures.length) {
  console.log(`失敗 ${failures.length} 處，未寫入任何檔案：`);
  failures.forEach((f) => console.log(`  ${f}`));
  process.exit(1);
}
for (const [file, text] of sources) if (text !== readFileSync(file, "utf8")) {
  writeFileSync(file, text);
  console.log(`寫入 ${relative(root, file)}`);
}
console.log(`套用 ${applied} 處，0 失敗。接著執行 verify.ts 逐欄比對。`);
