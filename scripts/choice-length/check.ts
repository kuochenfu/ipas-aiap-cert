/**
 * 子代理的自我驗收：把 patch 套在批次上（只在記憶體裡），量名次分布並列出錯誤與警告。
 *
 *   npx tsx scripts/choice-length/check.ts <batch.json> <patch.json> [--range 18-32] [--rank2 14-25] ...
 *
 * - `--range lo-hi`：四個名次共同的目標區間。預設 18–32%，批次少於 40 題時放寬為 15–35%。
 * - `--rankN lo-hi`（N＝1–4）：單獨覆寫某個名次。例如題庫裡有不動的程式題、其「第二長」偏高時，
 *   其餘題目的 `--rank2` 要壓低，整個題庫合起來才會均勻（2026-11-04 senior-ml 用 14–25）。
 *
 * 錯誤（exit 1）：名次超出目標、「挑中間兩個」>35 分、帶絕對語的干擾項變多、正解達最長干擾項 1.3 倍、
 *   patch 含不允許的欄位或正解的鍵、干擾類型不在集合內、選項解析為空。
 * 警告：改了正解文字（要人看句式）、選項改了但解析／主詳解沒改、主詳解切不出某選項的解析、
 *   四個選項長短差距過大、疑似簡體字。
 *
 * 這些規則都是前幾輪改題的實際教訓，緣由見 docs/retrospective-2026-10-28-longest-option-cue.md。
 */
import { readFileSync } from "node:fs";
import { explanationSegmentForChoice } from "../../src/ui/render";
import { len, rankShares, type Batch, type Patch } from "./banks";

const argv = process.argv.slice(2);
const positional = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const option = (name: string): [number, number] | undefined => {
  const i = argv.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const [lo, hi] = (argv[i + 1] ?? "").split("-").map(Number);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) throw new Error(`--${name} 應寫成 lo-hi`);
  return [lo, hi];
};
const [batchPath, patchPath] = positional;
if (!batchPath || !patchPath) {
  console.error("用法：check.ts <batch.json> <patch.json> [--range lo-hi] [--rank1..4 lo-hi]");
  process.exit(1);
}
const batch: Batch = JSON.parse(readFileSync(batchPath, "utf8"));
const patch: Patch = JSON.parse(readFileSync(patchPath, "utf8"));
const n = batch.questions.length;
const range = option("range") ?? (n < 40 ? [15, 35] : [18, 32]);
const target = [1, 2, 3, 4].map((k) => option(`rank${k}`) ?? range);

const ALLOWED_PATCH_KEYS = new Set(["choices", "choiceExplanations", "distractorTypes", "explanation"]);
const ALLOWED_DISTRACTOR_TYPES = new Set([
  "Neighbor Concept", "Correct in Different Context", "Layer Confusion", "Partial Truth",
  "Overgeneralization", "Terminology Swap", "Wrong Trade-off",
]);
// 只收在繁體中文裡不會出現的簡體字。字表誤收（曾誤收「量」「化」）會讓子代理把正確術語改壞，
// 誤報比漏報危險，新增字元前先確認它不是繁體字。
const SIMPLIFIED = /[们这个为说时么应该发现数据网络线连选项题规实际处过还进动态测试结构标签设计机储资讯观认识键传输协议压缩码验证产业务优图层级频响调节湿边缘点链录载达号误训练损权维类别确习学样积简单]/;
const ABSOLUTE = /必定|一定|完全|絕對|所有|任何|永遠|必然|即可|保證|唯一|都能|皆可|從不|總是/;

const errors: string[] = [];
const warns: string[] = [];
const batchIds = new Set(batch.questions.map((q) => q.id));
for (const id of Object.keys(patch)) if (!batchIds.has(id)) errors.push(`${id}：不在本批題目內`);

const totals = [0, 0, 0, 0];
let changed = 0;
let absoluteBefore = 0;
let absoluteAfter = 0;
for (const q of batch.questions) {
  const p = patch[q.id] ?? {};
  for (const key of Object.keys(p)) if (!ALLOWED_PATCH_KEYS.has(key)) errors.push(`${q.id}：patch 不得含 ${key}`);
  if (Object.keys(p).length) changed++;

  const choices = q.choices.map((c) => ({ id: c.id, text: p.choices?.[c.id] ?? c.text }));
  const explanation = p.explanation ?? q.explanation;
  const choiceExplanations = { ...(q.choiceExplanations ?? {}), ...(p.choiceExplanations ?? {}) };
  rankShares(choices, q.answer).forEach((v, k) => (totals[k] += v));

  const lengths = choices.map((c) => len(c.text));
  const correct = len(choices.find((c) => c.id === q.answer)?.text ?? "");
  const longestOther = Math.max(...choices.filter((c) => c.id !== q.answer).map((c) => len(c.text)));
  if (correct >= 1.3 * longestOther && correct - longestOther >= 3) errors.push(`${q.id}：正解達最長干擾項 1.3 倍以上`);
  if (Math.max(...lengths) > 3 * Math.min(...lengths) && Math.max(...lengths) - Math.min(...lengths) > 15) {
    warns.push(`${q.id}：四個選項長短差距過大（${lengths.join("/")}）`);
  }

  for (const c of q.choices) {
    const next = p.choices?.[c.id];
    if (c.id !== q.answer && ABSOLUTE.test(c.text)) absoluteBefore++;
    if (c.id !== q.answer && ABSOLUTE.test(next ?? c.text)) absoluteAfter++;
    if (next === undefined || next === c.text) continue;
    const simplified = next.match(SIMPLIFIED);
    if (simplified) warns.push(`${q.id} ${c.id}：疑似簡體字「${simplified[0]}」（若為誤報請忽略，不要為了消警告改掉正確用詞）`);
    if (c.id === q.answer) {
      warns.push(`${q.id}：改了正解文字（${len(c.text)}→${len(next)} 字），請確認句式仍與其他選項一致、意思未變`);
    } else if (q.choiceExplanations && !(p.choiceExplanations && c.id in p.choiceExplanations)) {
      warns.push(`${q.id} ${c.id}：選項改了但選項解析沒改，請確認解析仍回應新的說法`);
    }
    if (!q.choiceExplanations && p.explanation === undefined) {
      warns.push(`${q.id} ${c.id}：選項改了但主詳解沒改（本題無手寫選項解析，畫面上的解析由主詳解切出）`);
    }
  }

  for (const key of Object.keys(p.choiceExplanations ?? {})) {
    if (key === q.answer) errors.push(`${q.id}：choiceExplanations 不得含正解 ${key}`);
  }
  for (const [key, value] of Object.entries(p.distractorTypes ?? {})) {
    if (key === q.answer) errors.push(`${q.id}：distractorTypes 不得含正解 ${key}`);
    if (!ALLOWED_DISTRACTOR_TYPES.has(value)) errors.push(`${q.id}：distractorTypes ${key} 的值「${value}」不在允許集合`);
  }
  for (const [key, value] of Object.entries(p.choiceExplanations ?? {})) {
    const simplified = value.match(SIMPLIFIED);
    if (simplified) warns.push(`${q.id} 解析 ${key}：疑似簡體字「${simplified[0]}」（誤報請忽略）`);
  }
  const simplifiedExplanation = p.explanation?.match(SIMPLIFIED);
  if (simplifiedExplanation) warns.push(`${q.id} 詳解：疑似簡體字「${simplifiedExplanation[0]}」（誤報請忽略）`);

  if (q.choiceExplanations) {
    for (const c of choices) {
      if (c.id !== q.answer && !(choiceExplanations[c.id] ?? "").trim()) errors.push(`${q.id} ${c.id}：選項解析為空`);
    }
  } else {
    // 無手寫解析（中級 generated）：檢查畫面上實際會切出來的解析。
    for (const c of choices) {
      if (c.id !== q.answer && !explanationSegmentForChoice(explanation, c.id)) {
        warns.push(`${q.id} ${c.id}：主詳解切不出此選項的解析（會落到通用填充句），請在詳解中以（${c.id}）點名`);
      }
    }
    if (p.explanation !== undefined && !explanation.includes(`（${q.answer}）`) && !explanation.includes(`(${q.answer})`)) {
      warns.push(`${q.id}：新詳解沒有以（${q.answer}）點名正解`);
    }
  }
}

const pct = totals.map((t) => Math.round((100 * t) / n));
const middle = Math.round((pct[1] + pct[2]) / 2);
pct.forEach((v, k) => {
  if (v < target[k][0] || v > target[k][1]) errors.push(`名次 ${k + 1} 為 ${v}%，超出目標 ${target[k].join("–")}%`);
});
if (middle > 35) errors.push(`「挑中間兩個」得分 ${middle} > 35`);
if (absoluteAfter > absoluteBefore) errors.push(`帶絕對語的干擾項增加了（${absoluteBefore} → ${absoluteAfter}）`);

console.log(`題數 ${n}，有改動 ${changed} 題`);
console.log(`正解長度名次 最長/第二/第三/最短：${pct.join(" / ")}%（目標 ${target.map((t) => t.join("–")).join(" / ")}）`);
console.log(`「挑中間兩個」得分 ${middle}（須 ≤35）`);
console.log(`帶絕對語的干擾項：${absoluteBefore} → ${absoluteAfter}（不要增加）`);
console.log(`\n錯誤 ${errors.length}`);
errors.forEach((e) => console.log(`  ✗ ${e}`));
console.log(`警告 ${warns.length}`);
warns.forEach((w) => console.log(`  ! ${w}`));
process.exit(errors.length ? 1 : 0);
