# 內容階段 3：科目1 補題 + 中級三科詳解與新題 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把科目1 新題從 12 補到 24（並 relabel 為官方主題），並為中級三科補齊各 50 題真題詳解＋第一批各 24 題新題，皆可人工複審。

**Architecture:** 沿用三來源合併設計：真題 JSON 不動，詳解寫入 `explanations/<sid>.ts`（id→文字 map），新題寫入 `generated/<sid>.ts`（Question[]）。完整性由擴充的 `tests/data.test.ts` 守護。複審標註寫入不上線的 `docs/superpowers/review/<sid>-annotations.tsv` sidecar，再由 throwaway 腳本生成 `<sid>-review.md` 工作表。

**Tech Stack:** Vite + TypeScript、Vitest、tsx（腳本）。

**參考 spec：** `docs/superpowers/specs/2026-06-01-content-phase-3-design.md`（rubric、信心度、官方主題字串）。也可參考已完成的 `explanations/junior-genai.ts`、`generated/junior-genai.ts`、`docs/superpowers/review/junior-genai-*` 作為格式範本。

---

## 共用慣例（Conventions — 每個內容任務都適用）

**官方主題標題字串（topic 欄須完全一致）：**
- `junior-ai-basics`：`人工智慧概念`、`資料處理與分析概念`、`機器學習概念`、`鑑別式 AI 與生成式 AI 概念`
- `senior-ai-tech`：`AI 相關技術應用`、`AI 導入評估規劃`、`AI 技術應用與系統部署`
- `senior-bigdata`：`機率統計基礎`、`大數據處理技術`、`大數據分析方法與工具`、`大數據在人工智慧之應用`
- `senior-ml`：`機器學習基礎數學`、`機器學習與深度學習`、`機器學習建模與參數調校`、`機器學習治理`

**詳解 rubric：** 解釋官方答案為何對、其他選項為何錯，錨定對應官方章節；不捏造統計/法條/產品規格；2–4 句；官方 `answer` 為 ground truth，絕不更動 JSON。題意模糊/選項殘缺者標**低信心**並於 sidecar 註明。

**新題規則：** 各科第一批 24 題，topic 為該科官方標題之一（3 主題→8×3；4 主題→6×4）；難度易/中/難混合；正解字母 A/B/C/D 盡量平均；每題附正解＋詳解；`source: "generated"`、正確 `subjectId`；id `<sid>-gen-qNNN` 三位數連號。

**sidecar 格式：** `docs/superpowers/review/<sid>-annotations.tsv`，標頭 `id\ttype\tsourceRef\tanswer\tLchapter\tconfidence\t依據`，tab 分隔，欄內無 tab/換行。past 列：type=`past`、sourceRef=該題 Question.sourceRef、Lchapter=該題所測章節（L2xx/L1xx）、confidence∈{高,中,低}、依據=一句。new 列：type=`new`、sourceRef=`B1`、其餘同。

**信心度：** 高=官方答案明確、詳解直接對應指引；中=需一定推論/外部知識；低=模糊/需假設/選項殘缺/不確定。

**不碰：** `past-exams/*.json`、`Question` 型別、UI、其他科目、已完成的 junior 詳解與 junior-genai 工作表。

---

## 檔案結構

| 檔案 | 動作 |
|---|---|
| `tests/data.test.ts` | 擴充：4 組完整性測試（Task 1） |
| `src/data/generated/junior-ai-basics.ts` | relabel 12 topic + 加 gen-q013–q024（Task 2） |
| `src/data/explanations/senior-ai-tech.ts` | 填 50（Task 3） |
| `src/data/generated/senior-ai-tech.ts` | 填 24（Task 4） |
| `src/data/explanations/senior-bigdata.ts` | 填 50（Task 5） |
| `src/data/generated/senior-bigdata.ts` | 填 24（Task 6） |
| `src/data/explanations/senior-ml.ts` | 填 50（Task 7） |
| `src/data/generated/senior-ml.ts` | 填 24（Task 8） |
| `docs/superpowers/review/<sid>-annotations.tsv` ×4 | 各內容任務寫入 |
| `docs/superpowers/review/<sid>-review.md` ×4 | Task 9 生成 |

---

## Task 1：完整性測試（先紅）

**Files:** Modify `tests/data.test.ts`（在檔案最末、最外層 `});` 之後附加）

- [ ] **Step 1: 附加 4 組測試**

把以下加到檔案最後（`getQuestions` 已於頂部 import）：

```ts
const officialTopics: Record<string, string[]> = {
  "junior-ai-basics": ["人工智慧概念", "資料處理與分析概念", "機器學習概念", "鑑別式 AI 與生成式 AI 概念"],
  "senior-ai-tech": ["AI 相關技術應用", "AI 導入評估規劃", "AI 技術應用與系統部署"],
  "senior-bigdata": ["機率統計基礎", "大數據處理技術", "大數據分析方法與工具", "大數據在人工智慧之應用"],
  "senior-ml": ["機器學習基礎數學", "機器學習與深度學習", "機器學習建模與參數調校", "機器學習治理"],
};

for (const sid of ["senior-ai-tech", "senior-bigdata", "senior-ml"]) {
  describe(`${sid} 內容完整性`, () => {
    const questions = getQuestions(sid);
    const past = questions.filter((q) => q.source === "past-exam");
    const generated = questions.filter((q) => q.source === "generated");

    it("50 題真題詳解皆非空", () => {
      expect(past.length).toBe(50);
      expect(past.filter((q) => q.explanation.trim().length === 0).map((q) => q.id)).toEqual([]);
    });
    it("新題數 ≥16", () => {
      expect(generated.length).toBeGreaterThanOrEqual(16);
    });
    it("新題 id 規則且唯一", () => {
      const re = new RegExp(`^${sid}-gen-q\\d{3}$`);
      const ids = generated.map((q) => q.id);
      for (const id of ids) expect(id).toMatch(re);
      expect(new Set(ids).size).toBe(ids.length);
    });
    it("新題 topic ∈ 官方主題", () => {
      const allowed = new Set(officialTopics[sid]);
      for (const q of generated) expect(allowed.has(q.topic)).toBe(true);
    });
  });
}

describe("junior-ai-basics 新題完整性", () => {
  const generated = getQuestions("junior-ai-basics").filter((q) => q.source === "generated");
  it("新題數 ===24", () => {
    expect(generated.length).toBe(24);
  });
  it("新題 topic ∈ L111–L114 官方主題", () => {
    const allowed = new Set(officialTopics["junior-ai-basics"]);
    for (const q of generated) expect(allowed.has(q.topic)).toBe(true);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗（紅）**

Run: `npx vitest run tests/data.test.ts`
Expected: FAIL。senior 三科「50 題真題詳解皆非空」「新題數 ≥16」失敗（目前 explanations/generated 皆空）；junior-ai-basics「新題數 ===24」失敗（目前 12）、「topic ∈ L111–L114」失敗（目前自訂 topic）。

- [ ] **Step 3: Commit**

```bash
git add tests/data.test.ts
git commit -m "test: content phase 3 completeness (red)"
```

---

## Task 2：科目1 relabel + 補 12 題

**Files:** Modify `src/data/generated/junior-ai-basics.ts`；Create `docs/superpowers/review/junior-ai-basics-annotations.tsv`

科目1 既有 12 題（gen-q001–q012）目前 topic 為自訂字串。先把這 12 題的 `topic` 改為對應的官方標題（依題目內容歸入 L111 人工智慧概念／L112 資料處理與分析概念／L113 機器學習概念／L114 鑑別式 AI 與生成式 AI 概念 之一），再新增 12 題（gen-q013–q024）。

- [ ] **Step 1: relabel 既有 12 題 topic**

讀 `src/data/generated/junior-ai-basics.ts`，逐題把 `topic:` 改成最貼切的官方標題（四選一）。例如原 `topic: "機器學習基礎"` → `topic: "機器學習概念"`；原 `topic: "深度學習"`→ 多歸 `"機器學習概念"`；`"生成式AI"`→`"鑑別式 AI 與生成式 AI 概念"`；`"資料處理"`→`"資料處理與分析概念"`；`"評估指標"`→ 視內容歸 L113 或 L112；`"AI治理"`→ 視內容歸 L111。**只改 topic 字串，prompt/choices/answer/explanation 不動。**

- [ ] **Step 2: 新增 gen-q013–q024（12 題）**

比照既有題目格式，在陣列尾端加 12 題，topic 用官方標題、四主題盡量涵蓋，難度混合，正解字母平均。範例一題：

```ts
  {
    id: "junior-ai-basics-gen-q013",
    subjectId: "junior-ai-basics",
    prompt:
      "下列關於「過擬合（Overfitting）」的敘述，何者最正確？",
    choices: [
      { id: "A", text: "模型在訓練資料表現很好，但在未見過的測試資料表現明顯變差" },
      { id: "B", text: "模型在訓練與測試資料上表現都很差" },
      { id: "C", text: "模型完全無法從訓練資料學到任何規律" },
      { id: "D", text: "訓練資料量越大一定會造成過擬合" },
    ],
    answer: "A",
    explanation:
      "過擬合是模型過度記憶訓練資料的細節與雜訊，導致在訓練集表現好、對未見資料（測試集）泛化差（A）。兩者都差是欠擬合（B）；完全學不到是欠擬合或訓練失敗（C）；資料量越大通常反而緩解過擬合（D）。",
    topic: "機器學習概念",
    difficulty: "中",
    source: "generated",
  },
```

- [ ] **Step 3: 建立 annotations sidecar（24 new 列）**

Create `docs/superpowers/review/junior-ai-basics-annotations.tsv`：標頭一行，後接 24 列（gen-q001–q024 全部，type=`new`、sourceRef=`B1`、Lchapter=該題官方章節代碼 L111–L114、confidence、依據）。

- [ ] **Step 4: 跑測試**

Run: `npx vitest run tests/data.test.ts -t "junior-ai-basics 新題完整性"`
Expected: 兩項 PASS（新題===24、topic∈官方）。再跑 `npx vitest run tests/data.test.ts` 確認泛科「題庫完整性」仍綠。

- [ ] **Step 5: build + commit**

```bash
npm run build
git add src/data/generated/junior-ai-basics.ts docs/superpowers/review/junior-ai-basics-annotations.tsv
git commit -m "content: junior-ai-basics relabel topics + new questions to 24"
```

---

## Task 3：senior-ai-tech 50 題詳解

**Files:** Modify `src/data/explanations/senior-ai-tech.ts`；Create `docs/superpowers/review/senior-ai-tech-annotations.tsv`

讀 `src/data/past-exams/senior-ai-tech.json`（50 題，id `senior-ai-tech-114-2-q01..q50`，含官方 `answer`、`sourceRef`）。依共用 rubric 為每題寫詳解，錨定 L211/L212/L213。

- [ ] **Step 1: 填 50 條詳解**

把 `src/data/explanations/senior-ai-tech.ts` 從空 map 填到 50 條：

```ts
// questionId -> 中文詳解。
export const explanations: Record<string, string> = {
  "senior-ai-tech-114-2-q01": "……（依官方答案撰寫）……",
  // … q02 … q50
};
```

- [ ] **Step 2: 寫 sidecar（50 past 列）**

Create `docs/superpowers/review/senior-ai-tech-annotations.tsv`：標頭 + 50 列（type=`past`、sourceRef=Question.sourceRef、Lchapter∈{L211,L212,L213}、confidence、依據）。

- [ ] **Step 3: 跑測試**

Run: `npx vitest run tests/data.test.ts -t "senior-ai-tech 內容完整性"`
Expected: 「50 題真題詳解皆非空」PASS。（「新題數 ≥16」仍 FAIL，Task 4 處理。）

- [ ] **Step 4: build + commit**

```bash
npm run build
git add src/data/explanations/senior-ai-tech.ts docs/superpowers/review/senior-ai-tech-annotations.tsv
git commit -m "content: senior-ai-tech 50 explanations"
```

---

## Task 4：senior-ai-tech 24 題新題（B1）

**Files:** Modify `src/data/generated/senior-ai-tech.ts`；Append `docs/superpowers/review/senior-ai-tech-annotations.tsv`

依共用「新題規則」寫 24 題（L211/L212/L213 各 8），id `senior-ai-tech-gen-q001..q024`。

- [ ] **Step 1: 寫 24 題**

```ts
import type { Question } from "../types";

export const generated: Question[] = [
  {
    id: "senior-ai-tech-gen-q001",
    subjectId: "senior-ai-tech",
    prompt: "……",
    choices: [
      { id: "A", text: "……" },
      { id: "B", text: "……" },
      { id: "C", text: "……" },
      { id: "D", text: "……" },
    ],
    answer: "B",
    explanation: "……",
    topic: "AI 相關技術應用",
    difficulty: "中",
    source: "generated",
  },
  // … q002 … q024（L211/L212/L213 各 8；難度混合；正解字母平均）
];
```

- [ ] **Step 2: 追加 sidecar（24 new 列）**

APPEND 24 列到 `senior-ai-tech-annotations.tsv`（type=`new`、sourceRef=`B1`），勿改既有 50 past 列。

- [ ] **Step 3: 跑測試**

Run: `npx vitest run tests/data.test.ts -t "senior-ai-tech 內容完整性"`
Expected: 四項全 PASS。再跑 `npx vitest run tests/data.test.ts` 全綠（泛科格式測試涵蓋新題）。

- [ ] **Step 4: build + commit**

```bash
npm run build
git add src/data/generated/senior-ai-tech.ts docs/superpowers/review/senior-ai-tech-annotations.tsv
git commit -m "content: senior-ai-tech new questions batch B1 (24)"
```

---

## Task 5：senior-bigdata 50 題詳解

同 Task 3，科目改 `senior-bigdata`，章節錨定 L221/L222/L223/L224。

**Files:** Modify `src/data/explanations/senior-bigdata.ts`；Create `docs/superpowers/review/senior-bigdata-annotations.tsv`

- [ ] **Step 1: 填 50 條詳解**（讀 `src/data/past-exams/senior-bigdata.json`，id `senior-bigdata-114-2-q01..q50`）
- [ ] **Step 2: 寫 sidecar 50 past 列**（Lchapter∈{L221,L222,L223,L224}）
- [ ] **Step 3:** Run `npx vitest run tests/data.test.ts -t "senior-bigdata 內容完整性"` → 「50 題真題詳解皆非空」PASS。
- [ ] **Step 4: build + commit**

```bash
npm run build
git add src/data/explanations/senior-bigdata.ts docs/superpowers/review/senior-bigdata-annotations.tsv
git commit -m "content: senior-bigdata 50 explanations"
```

---

## Task 6：senior-bigdata 24 題新題（B1）

同 Task 4，科目 `senior-bigdata`，topic 四主題各 6（L221–L224 各 6），id `senior-bigdata-gen-q001..q024`。

**Files:** Modify `src/data/generated/senior-bigdata.ts`；Append `docs/superpowers/review/senior-bigdata-annotations.tsv`

- [ ] **Step 1: 寫 24 題**（四主題各 6；難度混合；正解平均；格式同 Task 4 Step 1）
- [ ] **Step 2: 追加 sidecar 24 new 列**
- [ ] **Step 3:** Run `npx vitest run tests/data.test.ts -t "senior-bigdata 內容完整性"` → 四項 PASS；再 `npx vitest run tests/data.test.ts` 全綠。
- [ ] **Step 4: build + commit**

```bash
npm run build
git add src/data/generated/senior-bigdata.ts docs/superpowers/review/senior-bigdata-annotations.tsv
git commit -m "content: senior-bigdata new questions batch B1 (24)"
```

---

## Task 7：senior-ml 50 題詳解

同 Task 3，科目 `senior-ml`，章節 L231/L232/L233/L234。**注意 `senior-ml-114-2-q45`：原始 PDF 選項為圖片，choices 文字為空。** 仍依題幹與官方答案寫詳解（解釋為何選該字母），並在 sidecar 標 **低信心** 且「依據」註明「原題選項為圖片、文字缺失」。

**Files:** Modify `src/data/explanations/senior-ml.ts`；Create `docs/superpowers/review/senior-ml-annotations.tsv`

- [ ] **Step 1: 填 50 條詳解**（讀 `src/data/past-exams/senior-ml.json`，id `senior-ml-114-2-q01..q50`；q45 特別處理如上）
- [ ] **Step 2: 寫 sidecar 50 past 列**（Lchapter∈{L231,L232,L233,L234}；q45 confidence=低）
- [ ] **Step 3:** Run `npx vitest run tests/data.test.ts -t "senior-ml 內容完整性"` → 「50 題真題詳解皆非空」PASS（q45 詳解非空即可）。
- [ ] **Step 4: build + commit**

```bash
npm run build
git add src/data/explanations/senior-ml.ts docs/superpowers/review/senior-ml-annotations.tsv
git commit -m "content: senior-ml 50 explanations"
```

---

## Task 8：senior-ml 24 題新題（B1）

同 Task 4，科目 `senior-ml`，topic 四主題各 6（L231–L234 各 6），id `senior-ml-gen-q001..q024`。新題自行命題（不依賴 q45 圖片）。

**Files:** Modify `src/data/generated/senior-ml.ts`；Append `docs/superpowers/review/senior-ml-annotations.tsv`

- [ ] **Step 1: 寫 24 題**（四主題各 6；難度混合；正解平均）
- [ ] **Step 2: 追加 sidecar 24 new 列**
- [ ] **Step 3:** Run `npx vitest run tests/data.test.ts -t "senior-ml 內容完整性"` → 四項 PASS；再 `npx vitest run tests/data.test.ts` 全綠。
- [ ] **Step 4: build + commit**

```bash
npm run build
git add src/data/generated/senior-ml.ts docs/superpowers/review/senior-ml-annotations.tsv
git commit -m "content: senior-ml new questions batch B1 (24)"
```

---

## Task 9：生成 4 份複審工作表

**Files:** Create `docs/superpowers/review/{junior-ai-basics,senior-ai-tech,senior-bigdata,senior-ml}-review.md`

用 throwaway tsx 腳本（比照 junior-genai 的做法）為 4 科生成工作表；腳本不入版控。

- [ ] **Step 1: 寫並執行生成腳本**

建立 `scripts/_gen-review.ts`：對 4 個 subjectId 各做：`import {getQuestions}` 建 id→Question map；讀對應 `<sid>-annotations.tsv`（split `\n`、`\t`，跳標頭）；以 id join；欄位：`id｜年次題號(past=Question.sourceRef；new="新題")｜答案(Question.answer，須==TSV answer，否則 throw)｜L章節(TSV Lchapter)｜信心(TSV confidence)｜依據(一句)(TSV 依據)｜詳解全文(Question.explanation，`|`→`\|`、換行→空白)｜狀態("待複審")｜批次(new=TSV sourceRef=B1；past 空)｜依據資料(new=TSV 依據；past 空)`；依信心 `低(0)<中(1)<高(2)` 再 id 排序；寫出 `<sid>-review.md`，檔頭含說明與 `**新題進度 N / M**`（junior-ai-basics 24/100、senior 各 24/50）。執行：`npx tsx scripts/_gen-review.ts`。

- [ ] **Step 2: 刪除腳本並驗證**

`rm scripts/_gen-review.ts`。驗證每檔資料列數：junior-ai-basics=24、senior 三科各=74（50+24）。`grep -c '^| ' <file>`（扣標頭/分隔列）或腳本自報。確認 `ls scripts/_gen-review.ts` 不存在、`git status` 只見 4 個新 `.md`。

- [ ] **Step 3: commit**

```bash
git add docs/superpowers/review/junior-ai-basics-review.md docs/superpowers/review/senior-ai-tech-review.md docs/superpowers/review/senior-bigdata-review.md docs/superpowers/review/senior-ml-review.md
git commit -m "docs: review worksheets for phase 3 subjects (not shipped)"
```

---

## Task 10：全量驗證 + 瀏覽器實測

**Files:** 無

- [ ] **Step 1:** Run `npm run build` → 無 TS 錯。
- [ ] **Step 2:** Run `npm run test` → 全綠（含新增 4 組完整性測試）。
- [ ] **Step 3: 瀏覽器實測** `npm run dev`，開 `http://127.0.0.1:5173/ipas-aiap-cert/`：
  - 初級科目1 卡片顯示「真題 100 新題 24 共 124 題」。
  - 中級三科卡片各顯示「真題 50 新題 24 共 74 題」。
  - 各科進刷題：真題作答後揭曉顯示詳解；新題（題庫尾端）可作答並揭曉。
  - 主控台只有既知 favicon 404。
- [ ] **Step 4: 交 4 份工作表複審（人工關卡）** — 交使用者。依回饋修正旗標題（改 `.ts` + 工作表同列），每輪重跑 build/test。

---

## Task 11：合併與部署

**Files:** Modify `docs/retrospective-2026-06-01.md`

- [ ] **Step 1:** 更新回顧待辦：內容階段 3 — 科目1 新題 24/100、中級三科詳解完成、新題各 24/50。

```bash
git add docs/retrospective-2026-06-01.md
git commit -m "docs: mark content phase 3 progress"
```

- [ ] **Step 2: 經使用者確認後合併推送**

```bash
git checkout main
git merge --no-ff content/phase-3-explanations -m "Merge: content phase 3 (科目1 top-up + senior 3 subjects)"
npm run build && npm run test
git push origin main
```

- [ ] **Step 3:** 確認 GitHub Actions deploy 成功。

---

## Self-Review 紀錄

- **Spec 覆蓋**：科目1 relabel+補題（Task 2）、senior 三科各 50 詳解（Task 3/5/7）＋各 24 新題（Task 4/6/8）、4 工作表（Task 9）、4 組測試（Task 1）、q45 邊界（Task 7）、驗證/瀏覽器（Task 10）、合併部署（Task 11）。皆有任務。
- **Placeholder**：詳解/新題本體為執行階段依 rubric 產生的交付物；測試碼、官方主題字串、id 規則、sidecar 格式、腳本邏輯、指令均完整。內容任務的 prompt/choices 以 `……` 標示為「執行時填入的生成內容」，非規格留白。
- **型別一致**：官方主題字串在 Task 1 測試 `officialTopics` 與各內容任務 topic 寫入處一致；id 規則 `^<sid>-gen-q\d{3}$` 與各 new-question 任務連號一致；sidecar 7 欄、工作表 10 欄與 junior-genai 既有檔一致；`getQuestions`/`source`/`sourceRef` 與 `src/data/index.ts`、`types.ts` 相符。
