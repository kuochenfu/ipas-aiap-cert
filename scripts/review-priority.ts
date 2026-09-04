/**
 * 人工複審的風險排序報表：`npm run report:review`
 *
 * 把「1,113 題 LLM 命製、待複審」轉成一份可以照著做的清單。
 * 純讀取、產物是文件，可安全重跑。評分邏輯在 `src/domain/reviewRisk.ts`（有測試）。
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { subjects } from "../src/domain/catalog";
import { getQuestions } from "../src/data/index";
import { getPracticeQuestions } from "../src/data/practice";
import { rankByReviewRisk, type RiskAssessment } from "../src/domain/reviewRisk";
import type { Question } from "../src/data/types";

const here = dirname(fileURLToPath(import.meta.url));
const outFile = join(here, "..", "docs", "coverage", "review-priority.md");

/** 與 `tests/duplicates.test.ts` 的已知清單一致。 */
const NEAR_DUPLICATE_IDS = new Set([
  "aiot-junior-iot-gen-q003", "aiot-junior-iot-practice-q003",
  "aiot-junior-iot-gen-q008", "aiot-junior-iot-practice-q008",
  "aiot-junior-iot-gen-q026", "aiot-junior-iot-practice-q040",
]);

/** 每科列出的題數。列太多就回到「逐題硬掃」，失去排序的意義。 */
const TOP_PER_SUBJECT = 20;

/**
 * 進入清單的門檻。
 *
 * **4 是所有 LLM 命題的基準分**（「無官方答案鍵」一項），因此 4 到 6 分不具鑑別力——
 * 那是整個新題庫的共同狀態，不是個別題目的訊號。7 分起才代表這題**還額外**帶著
 * 計算、詳解過短、對不上概念之類的具體風險。
 */
const ACTIONABLE_SCORE = 7;

const byId = new Map<string, Question>();
const sections: string[] = [];
let total = 0;
let unofficial = 0;
const scoreBuckets = new Map<number, number>();

for (const subject of subjects) {
  const bank = [...getQuestions(subject.id), ...getPracticeQuestions(subject.id)];
  if (bank.length === 0) continue;
  for (const question of bank) byId.set(question.id, question);
  total += bank.length;
  unofficial += bank.filter((question) => question.source === "generated").length;

  const ranked = rankByReviewRisk(bank, { nearDuplicateIds: NEAR_DUPLICATE_IDS });
  for (const item of ranked) {
    scoreBuckets.set(item.score, (scoreBuckets.get(item.score) ?? 0) + 1);
  }

  const actionable = ranked.filter((item) => item.score >= ACTIONABLE_SCORE);
  const rows = actionable
    .slice(0, TOP_PER_SUBJECT)
    .map((item: RiskAssessment) => {
      const question = byId.get(item.questionId)!;
      const prompt = question.prompt.replace(/\s+/g, " ").slice(0, 44);
      return `| ${item.score} | \`${item.questionId}\` | ${prompt}… | ${
        item.factors.map((factor) => factor.label).join("、")
      } |`;
    });

  if (actionable.length === 0) {
    sections.push(`### ${subject.name}

共 ${bank.length} 題，**沒有題目達到 ${ACTIONABLE_SCORE} 分**。
`);
    continue;
  }
  sections.push(`### ${subject.name}

共 ${bank.length} 題，其中 **${actionable.length} 題**達到 ${ACTIONABLE_SCORE} 分以上。${
    actionable.length > TOP_PER_SUBJECT ? `以下列出分數最高的 ${TOP_PER_SUBJECT} 題：` : ""
  }

| 分數 | 題目 | 題幹 | 風險因子 |
|---:|---|---|---|
${rows.join("\n")}
`);
}

const distribution = [...scoreBuckets.entries()]
  .sort((a, b) => b[0] - a[0])
  .map(([score, count]) => `| ${score} | ${count} |`)
  .join("\n");

const doc = `# 人工複審風險排序

> 由 \`npm run report:review\` 產生，**請勿手改**——重跑會覆寫。
> 產生時間：${new Date().toISOString().slice(0, 10)}

全站 ${total} 題，其中 **${unofficial} 題為 LLM 命製、未經人工事實查核**。
逐題硬掃不會發生，因此改以**可觀察的訊號**排序，把它變成「先看這幾題」。

**分數不是品質判斷，是該優先查證的程度。** 因子與權重定義在
\`src/domain/reviewRisk.ts\`（有測試），每一個都必須能從資料算出來：

| 因子 | 權重 | 為什麼 |
|---|---:|---|
| 無官方答案鍵（LLM 命製） | 4 | 真題與官方學習指引的答案錯了是官方錯；自編題錯了是本站錯 |
| 計算題 | 3 | 算錯是靜默的——格式、配額、分布的測試全都會放行 |
| 詳解過短 | 2 | 當初寫得草率的訊號 |
| 對不上任何受控概念 | 2 | 題目可能在講落在考綱之外的東西，或敘述含糊 |
| 連粗略的出處都沒有 | 2 | 無從回溯 |
| 與另一題近重複 | 2 | 兩題必須一起看，否則會改出矛盾 |
| L4 分析題 | 1 | 判準最難做到唯一 |
| 跨節點題 | 1 | 兩個節點的敘述都要對 |
| 錯誤選項解析不足三條 | 1 | 未逐項排除，正解的唯一性沒被驗過 |

**4 分是所有 LLM 命題的基準**（只因為「無官方答案鍵」），因此 4–6 分不具鑑別力。
下方各科只列 **${ACTIONABLE_SCORE} 分以上**的題目——那才代表這題還額外帶著具體風險。

## 分數分布

| 分數 | 題數 |
|---:|---:|
${distribution}

${sections.join("\n")}`;

writeFileSync(outFile, doc, "utf8");
console.log(`✔ 已寫入 ${outFile}（${total} 題，其中 ${unofficial} 題為 LLM 命製）`);
