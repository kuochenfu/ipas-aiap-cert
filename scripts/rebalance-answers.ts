import { readFileSync, writeFileSync } from "node:fs";

/**
 * 重新配置新題庫的正解字母。
 *
 * 為什麼需要這支工具：一次寫出一整個節點的題目時，正解字母會嚴重偏向 A——實測
 * senior-ai-tech 是 A:69/B:27/C:4/D:0，aiot-junior-basics 是 A:86。使用者只要發現
 * 「不會就選 A」有七成命中率，這個題庫的鑑別度就沒了。
 *
 * 做法是交換「正解選項」與「目標字母選項」的**文字**，題目語意完全不變，只是正解換了位置。
 * 隨之必須同步搬移的東西有三樣，漏任一樣型別檢查都抓不到（見 docs/question-authoring.md）：
 *   1. choiceExplanations 的鍵
 *   2. meta.distractorTypes 的鍵
 *   3. 詳解裡「若把選項 C 改成⋯」這類指名字母的句型（指的一律是正解）
 *
 * 目標序列**逐節點**生成，而不是同長度共用一條——共用會讓餘數固定偏向同幾個字母
 * （實測讓 aiot-junior-basics 的 D 只剩 19 題）。每條序列都先通過 tests/practiceBank.test.ts
 * 的兩項檢查（週期分組不得全同字母、連續四題恰為 ABCD 排列的區塊比例 ≤50%），
 * 並在節點之間讓全科字母總數收斂。
 *
 * 用法（預設為 dry-run，只報告不寫檔）：
 *   npx tsx scripts/rebalance-answers.ts src/data/practice/<subject>.ts
 *   npx tsx scripts/rebalance-answers.ts src/data/practice/<subject>.ts --write
 *   npx tsx scripts/rebalance-answers.ts src/data/practice/<subject>.ts --write --seed 20260822
 *
 * 這支工具只在**新題庫首次寫完時跑一次**，跑完就把結果提交。它每次都會產生新的配置，
 * 不是冪等的——不要放進 CI，也不要對既有題庫重跑（會製造無意義的 diff）。
 */
const LETTERS = ["A", "B", "C", "D"] as const;
type Letter = (typeof LETTERS)[number];

/** 決定性亂數：同一個 seed 必得同一份結果，回顧與重現才有意義。 */
const makeRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

/** 週期檢查：任一間隔 2–6 的分組，樣本數 ≥3 時不得全是同一個字母。 */
const periodOk = (seq: Letter[]): boolean => {
  for (let p = 2; p <= 6; p += 1) {
    for (let r = 0; r < p; r += 1) {
      const group = seq.filter((_, i) => i % p === r);
      if (group.length >= 3 && new Set(group).size === 1) return false;
    }
  }
  return true;
};

/** 區塊檢查：連續四題恰為 ABCD 排列的比例。滑動窗，與測試裡的實作一致。 */
const blockPermutationRatio = (seq: Letter[]): number => {
  const blocks: Letter[][] = [];
  for (let i = 0; i + 4 <= seq.length; i += 1) blocks.push(seq.slice(i, i + 4));
  if (blocks.length === 0) return 0;
  return blocks.filter((b) => new Set(b).size === 4).length / blocks.length;
};

const counted = (seq: Letter[]): Record<Letter, number> => {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const letter of seq) counts[letter] += 1;
  return counts;
};

const candidateSequence = (n: number, random: () => number): Letter[] | undefined => {
  const pool: Letter[] = [];
  for (let i = 0; i < Math.floor(n / 4); i += 1) pool.push(...LETTERS);
  const extras = [...LETTERS].sort(() => random() - 0.5).slice(0, n % 4);
  pool.push(...extras);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  if (!periodOk(pool)) return undefined;
  if (blockPermutationRatio(pool) > 0.5) return undefined;
  // 連續三題同字母在畫面上看得出來，即使通過上面兩項檢查也不要。
  for (let i = 0; i + 2 < pool.length; i += 1) {
    if (pool[i] === pool[i + 1] && pool[i + 1] === pool[i + 2]) return undefined;
  }
  return pool;
};

/** 為一個節點挑序列：在通過檢查的候選中，選讓全科字母總數最平的那一條。 */
const pickSequence = (n: number, running: Record<Letter, number>, random: () => number): Letter[] => {
  let best: Letter[] | undefined;
  let bestScore = Number.POSITIVE_INFINITY;
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const candidate = candidateSequence(n, random);
    if (!candidate) continue;
    const after = counted(candidate);
    const totals = LETTERS.map((l) => running[l] + after[l]);
    const score = Math.max(...totals) - Math.min(...totals);
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
    if (bestScore === 0) break;
  }
  if (!best) throw new Error(`找不到長度 ${n} 的合格序列`);
  return best;
};

/** 把整個題目物件的正解換到 target 字母上，並同步搬移三樣附帶資料。 */
const moveAnswer = (block: string, target: Letter): string => {
  const answer = block.match(/answer: "([A-D])"/)?.[1] as Letter | undefined;
  if (!answer) throw new Error(`題目沒有 answer 欄位：${block.slice(0, 80)}`);
  if (answer === target) return block;

  const choices = new Map<string, string>();
  for (const m of block.matchAll(/\{ id: "([A-D])", text: "((?:[^"\\]|\\.)*)" \}/g)) {
    choices.set(m[1], m[2]);
  }
  if (choices.size !== 4) throw new Error(`選項數不是 4：${block.slice(0, 80)}`);

  const swapped = new Map(choices);
  swapped.set(answer, choices.get(target)!);
  swapped.set(target, choices.get(answer)!);

  let out = block;
  for (const id of LETTERS) {
    out = out.replace(
      `{ id: "${id}", text: "${choices.get(id)}" }`,
      `{ id: "${id}", text: "${swapped.get(id)}" }`,
    );
  }
  out = out.replace(`answer: "${answer}",`, `answer: "${target}",`);

  // choiceExplanations：原本 target 的那條解析現在屬於 answer 這個位置。
  out = out.replace(new RegExp(`(\\n      )${target}: "`), `$1${answer}: "`);
  out = resortKeyedBlock(out, /choiceExplanations: \{\n([\s\S]*?)\n    \},/, 6);

  // meta.distractorTypes：同樣的搬移，漏了就會把干擾類型標到別的選項上。
  out = out.replace(new RegExp(`(\\n        )${target}: "`), `$1${answer}: "`);
  out = resortKeyedBlock(out, /distractorTypes: \{\n([\s\S]*?)\n      \},/, 8);

  return out;
};

/** 把 A/B/C/D 為鍵的區塊重新依字母排序，避免換位後鍵的順序變成 B、A、D。 */
const resortKeyedBlock = (source: string, pattern: RegExp, indent: number): string => {
  const match = source.match(pattern);
  if (!match || match.index === undefined) return source;
  const body = match[1];
  const pad = " ".repeat(indent);
  const entries = [...body.matchAll(/^\s*([A-D]): "((?:[^"\\]|\\.)*)",$/gm)]
    .map((m) => [m[1], m[2]] as const)
    .sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return source;
  const start = match.index + match[0].indexOf(body);
  return source.slice(0, start) + entries.map(([k, v]) => `${pad}${k}: "${v}",`).join("\n")
    + source.slice(start + body.length);
};

/** 詳解裡「選項 X」談的一律是正解，換位後要跟著改。 */
const repointLetterReferences = (block: string): string => {
  const answer = block.match(/answer: "([A-D])"/)?.[1];
  if (!answer) return block;
  return block.replace(/選項\s*[A-D]/g, `選項 ${answer}`);
};

const main = () => {
  const args = process.argv.slice(2);
  const path = args.find((a) => !a.startsWith("--"));
  if (!path) {
    console.error("用法：npx tsx scripts/rebalance-answers.ts <題庫檔> [--write] [--seed N]");
    process.exit(1);
  }
  const write = args.includes("--write");
  const seedArg = args[args.indexOf("--seed") + 1];
  const seed = args.includes("--seed") ? Number(seedArg) : 20260822;
  const random = makeRandom(seed);

  const source = readFileSync(path, "utf8");

  // 題目物件以「兩格縮排的大括號 + id 欄位」起頭，這是 practice/ 各檔一致的格式。
  const blockPattern = /\n  \{\n    id: "([^"]+)",\n[\s\S]*?\n  \},/g;
  const blocks = [...source.matchAll(blockPattern)];
  if (blocks.length === 0) throw new Error("找不到任何題目物件，確認檔案格式");

  const byTopic = new Map<string, number[]>();
  blocks.forEach((block, index) => {
    const topic = block[0].match(/topic: "([^"]+)"/)?.[1];
    if (!topic) throw new Error(`題目沒有 topic：${block[1]}`);
    if (!byTopic.has(topic)) byTopic.set(topic, []);
    byTopic.get(topic)!.push(index);
  });

  const running: Record<Letter, number> = { A: 0, B: 0, C: 0, D: 0 };
  const targets = new Map<number, Letter>();
  for (const [, indices] of byTopic) {
    const seq = pickSequence(indices.length, running, random);
    indices.forEach((questionIndex, i) => targets.set(questionIndex, seq[i]));
    for (const letter of seq) running[letter] += 1;
  }

  let moved = 0;
  let output = "";
  let cursor = 0;
  blocks.forEach((block, index) => {
    const before = block[0];
    const after = repointLetterReferences(moveAnswer(before, targets.get(index)!));
    if (after !== before) moved += 1;
    output += source.slice(cursor, block.index!) + after;
    cursor = block.index! + before.length;
  });
  output += source.slice(cursor);

  console.log(`${path}`);
  console.log(`  節點 ${byTopic.size} 個、題目 ${blocks.length} 題，調整 ${moved} 題`);
  console.log(`  字母分布 ${LETTERS.map((l) => `${l}:${running[l]}`).join("  ")}`);
  if (write) {
    writeFileSync(path, output);
    console.log("  已寫回。請接著跑 npm run build && npm run test。");
  } else {
    console.log("  （dry-run，未寫檔；加上 --write 才會實際修改）");
  }
};

main();
