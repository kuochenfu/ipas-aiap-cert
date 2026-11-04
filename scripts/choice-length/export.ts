/**
 * 把題庫切成批次 JSON 交給子代理。
 *
 *   npx tsx scripts/choice-length/export.ts <輸出目錄> <subject:bank[:份數]>... [--include-code]
 *
 * 例：export.ts /tmp/q3 aiot-junior-iot:practice:3 senior-ml:generated
 * 每批建議 45–60 題。預設排除中級程式閱讀題（見 banks.ts 的 codeQuestionIds）。
 * 輸出檔名為 <subjectId>.<bank>.<序號>.json。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { codeQuestionIds, len, loadBank, parseBankRef, rankShares, type Batch } from "./banks";

const argv = process.argv.slice(2);
const includeCode = argv.includes("--include-code");
const [outDir, ...specs] = argv.filter((a) => a !== "--include-code");
if (!outDir || specs.length === 0) {
  console.error("用法：export.ts <輸出目錄> <subject:bank[:份數]>... [--include-code]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

for (const spec of specs) {
  const [subjectId, bank, partsText] = spec.split(":");
  const ref = parseBankRef(`${subjectId}:${bank}`);
  const parts = Math.max(1, Number(partsText ?? 1));
  const questions = loadBank(ref).filter((q) => includeCode || !codeQuestionIds.has(q.id));
  const size = Math.ceil(questions.length / parts);
  for (let p = 0; p < parts; p++) {
    const batch: Batch = {
      ...ref,
      questions: questions.slice(p * size, (p + 1) * size).map((q) => ({
        id: q.id,
        topic: q.topic,
        prompt: q.prompt,
        answer: q.answer,
        answerRank: rankShares(q.choices, q.answer).findIndex((v) => v > 0) + 1,
        choices: q.choices.map((c) => ({ id: c.id, text: c.text, len: len(c.text) })),
        explanation: q.explanation,
        choiceExplanations: q.choiceExplanations,
        distractorTypes: q.meta?.distractorTypes,
        decisionBoundary: q.meta?.decisionBoundary,
      })),
    };
    const file = join(outDir, `${ref.subjectId}.${ref.bank}.${p + 1}.json`);
    writeFileSync(file, JSON.stringify(batch, null, 2));
    console.log(`${file}：${batch.questions.length} 題`);
  }
}
