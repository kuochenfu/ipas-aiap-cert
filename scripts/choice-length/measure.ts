/**
 * 量測各 LLM 題庫的正解長度名次分布（＝每題挑第 k 長的期望得分）。
 *
 *   npx tsx scripts/choice-length/measure.ts                       # 全部 13 個 LLM 題庫
 *   npx tsx scripts/choice-length/measure.ts senior-ml:practice    # 指定題庫，可逗號或空白分隔
 *
 * 純讀取。隨機猜為各 25 分；tests/choiceLength.test.ts 要求每個名次 ≤40%。
 */
import { LLM_BANKS, loadBank, parseBankRef, rankDistribution, type BankRef } from "./banks";

const args = process.argv.slice(2).flatMap((a) => a.split(",")).filter(Boolean);
const refs: BankRef[] = args.length ? args.map(parseBankRef) : LLM_BANKS;

console.log("| 題庫 | 題數 | 最長 | 第二 | 第三 | 最短 |");
console.log("|---|---:|---:|---:|---:|---:|");
for (const ref of refs) {
  const questions = loadBank(ref);
  const [a, b, c, d] = rankDistribution(questions);
  console.log(`| ${ref.subjectId}（${ref.bank}） | ${questions.length} | ${a} | ${b} | ${c} | ${d} |`);
}
