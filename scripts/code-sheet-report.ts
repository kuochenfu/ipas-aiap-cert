/**
 * 由 `src/data/codeSheet.senior-ml.ts` 產生 `docs/senior-ml-code-reference.md`。
 * 畫面（學習主題 → 程式速查）與這份文件共用同一份資料；要改內容請改資料檔再重跑：
 *   npm run report:code-sheet
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { seniorMlCodeSheet as sheet } from "../src/data/codeSheet.senior-ml";
import { questions } from "../src/data/senior-ml";
import type { CodeCard } from "../src/data/codeSheet.types";

const examLabel = (id: string): string => {
  const m = /-(\d{3})-(\d)-q0*(\d+)$/.exec(id);
  return m ? `${m[1]}-${m[2]} 第 ${m[3]} 題` : id;
};
const cell = (s: string): string => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const link = (d: { title: string; url: string }): string => `[${d.title}](${d.url})`;

const cards: CodeCard[] = sheet.sections.flatMap((s) => s.cards);
const prompts = new Map(questions.map((q) => [q.id, q.prompt]));
const examIds = [...new Set(cards.flatMap((c) => c.exams))].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

const out: string[] = [];
out.push(
  "# 中級科目三「機器學習技術與應用」程式速查：來源、高機率函式與真題對照",
  "",
  "> 本檔由 `npm run report:code-sheet` 自 `src/data/codeSheet.senior-ml.ts` 產生，勿手改。",
  "> 網站上的對應頁面：學習主題 → AI 應用規劃師 → 「中級科目3 程式速查」。",
  "",
  `範圍：114 年第二次、115 年第一次兩份真題中所有附程式碼的題目，共 ${examIds.length} 題（兩卷合計 100 題）。`,
  "",
  "## 一、程式來源（最新穩定版）",
  "",
  `${sheet.checkedAt} 以 PyPI 查核最新穩定版；文件連結一律指向官方 stable 版本（查核時全數回應 200）。`,
  "",
  "| 套件 | 最新穩定版 | 發布日 | 官方文件 | 備註 |",
  "|---|---|---|---|---|",
  ...sheet.versions.map((v) => `| ${v.lib} | ${v.version} | ${v.released} | ${v.docs} | ${cell(v.note ?? "")} |`),
  "",
  "**驗證方式**：以上表版本建立獨立環境（Python 3.12；Keras 以 torch 後端執行），實際執行本檔每一項程式行為宣稱",
  "（例如 `cross_val_score(scoring=\"f1\")` 在多類別資料的結果、`model.requires_grad = False` 是否凍結參數、VGG16 參數量）。",
  "TensorFlow 2.21.0 未實跑：TF 2.16 起 `tf.keras` 即 Keras 3，考卷的 `tensorflow.keras` 寫法以 Keras 3.15.1 對照。",
  "觀念敘述由 AI 整理，尚未經人工查核。",
  "",
  "## 二、使用機率極高的程式函式與理由",
  "",
  "排序：**必考**＝兩份真題都考過，或同一份考了兩題以上；**高機率**＝真題考過一次，或雖未考但屬評鑑內容的核心操作。",
  "",
);
for (const [label, tier] of [["必考", "core"], ["高機率", "high"]] as const) {
  out.push(`### ${label}`, "");
  cards.filter((c) => c.priority === tier).forEach((c, i) => {
    out.push(
      `${i + 1}. **\`${c.api}\`**（${c.lib}）`,
      `   - 為什麼：${c.why}`,
      `   - 考點：${c.point}`,
      `   - 考過：${c.exams.length ? c.exams.map(examLabel).join("、") : "尚未（高機率延伸）"}`,
    );
  });
  out.push("");
}

out.push(
  "## 三、真題考過的程式題 × 函式 × 實務應用",
  "",
  "每一題列出用到的函式、考點、實務上的用途與官方文件連結。",
  "",
);
for (const id of examIds) {
  const related = cards.filter((c) => c.exams.includes(id));
  const prompt = (prompts.get(id) ?? "").replace(/\s+/g, " ");
  out.push(`### ${examLabel(id)}`, "", `> ${prompt.length > 90 ? `${prompt.slice(0, 90)}…` : prompt}`, "");
  out.push("| 函式 | 考點 | 實務應用 | 官方文件 |", "|---|---|---|---|");
  for (const c of related) {
    out.push(`| \`${cell(c.api)}\` | ${cell(c.point)} | ${cell(c.practice)} | ${c.docs.map(link).join("<br>")} |`);
  }
  out.push("");
}

const versionCards = cards.filter((c) => c.versionNote);
out.push("## 四、考卷寫法與最新穩定版的差異", "", "考試照考卷寫法作答；實務寫程式請用新寫法。", "");
for (const c of versionCards) out.push(`- **\`${c.api}\`**：${c.versionNote}`);
out.push("", "## 五、考前陷阱", "");
sheet.traps.forEach((t, i) => out.push(`${i + 1}. ${t.text}${t.exams.length ? `（${t.exams.map(examLabel).join("、")}）` : ""}`));
out.push("", "## 六、速算公式", "", "| 項目 | 公式 | 說明 |", "|---|---|---|");
for (const f of sheet.formulas) out.push(`| ${f.label} | \`${cell(f.expr)}\` | ${cell(f.note)} |`);
out.push("");

const target = join(import.meta.dirname, "..", "docs", "senior-ml-code-reference.md");
writeFileSync(target, out.join("\n"));
console.log(`已寫入 ${target}（${cards.length} 張卡片、${examIds.length} 題真題）`);
