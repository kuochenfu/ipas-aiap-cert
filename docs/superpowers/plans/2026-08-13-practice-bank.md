# 新題庫練習（依評鑑內容分類）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 初級兩科各新增 100 題、依官方評鑑內容碼分類的全新題庫，並在模式選單提供獨立的「新題庫練習」入口，原刷題區與模擬考試完全不受影響。

**Architecture:** 不新增第三種 Mode，改以 `session.bank: "main" | "practice"` 作為題庫來源維度，讓所有既有的 drill 行為分流（揭曉、篩選、跳題、進度）一行都不必改。題目資料放在全新的 `src/data/practice/`，不接入 `src/data/index.ts`。進度以 `${subjectId}:practice` 為 key，沿用既有的 `drillProgress` 模組。

**Tech Stack:** Vite + TypeScript 純前端；vitest。

## Global Constraints

- **不得改動 `src/data/index.ts` 的 `getQuestions`**，也不得改動 `src/data/past-exams/`、`src/data/generated/`、`src/data/explanations/`。原題庫題數必須維持 `junior-ai-basics` 222 題、`junior-genai` 213 題。
- localStorage 只用既有的 `ipas-aiap-drill-progress`；新題庫的進度 key 為 `${subjectId}:practice`。**不得新增 localStorage key，不得更動 `ipas-aiap-misses`。**
- 模式選單第三張卡使用 `data-mode="practice"`，**不新增 data-\* 屬性**（`data-mode` 已在 `main.ts` 的事件委派 `closest(...)` 選擇器清單中）。
- 所有動態文字經 `src/ui/escape.ts` 的 `escapeHtml` 後才進 `innerHTML`。
- 每次改完跑 `npm run build`（tsc）與 `npm run test`。既有 140 個測試須維持通過。

### 出題契約（所有內容任務共用）

每題為 `src/data/types.ts` 的 `Question`，欄位規則：

| 欄位 | 規則 |
|---|---|
| `id` | `<subjectId>-practice-qNNN`，NNN 為三位數、全科目連號、不重複 |
| `subjectId` | 該科 id |
| `topic` | 評鑑內容碼＋半形空格＋名稱，例：`L11101 AI 的定義與分類` |
| `choices` | 恰好四個，id 為 `A`/`B`/`C`/`D`，文字非空 |
| `answer` | `A`–`D` 其一 |
| `explanation` | 整題詳解，說明為何正解成立 |
| `choiceExplanations` | 物件，**恰好包含三個錯誤選項**的 key，各一句話說明為何不選；**不得包含正解的 key** |
| `difficulty` | `"易"`／`"中"`／`"難"`，依題目實際難度判定 |
| `source` | `"generated"` |
| `sourceRef` | 產業場景，五選一：`金融`／`醫療`／`工廠`／`教育`／`農業` |

**品質要求：**
- 以情境題為主，避免單純名詞背誦。
- 四個選項長度相近；錯誤選項須「似是而非」（常見誤解、相鄰概念），不得明顯荒謬。
- **不得出現「以上皆是」「以上皆非」「A 和 B」這類選項。**
- 同一節點內的題目不得重複考同一個切入點。
- 正解字母在整份題庫中分佈大致均勻，不得集中於某一字母。

**2026 事實（需要引用時一律以此為準）：**
- 我國《人工智慧基本法》2025-12-23 三讀、**2026-01-14 總統公布施行**，全文 20 條，中央主管機關為**國家科學及技術委員會**，第 4 條七大原則：永續發展與福祉、人類自主、隱私保護與資料治理、資安與安全、透明與可解釋、公平與不歧視、問責。
- EU AI Act 四級風險分級；高風險義務經 Digital Omnibus（Regulation (EU) 2026/1744）延後——附錄 III 獨立型延至 **2027-12-02**、附錄 I 嵌入型延至 2028-08-02；第 50 條透明義務仍自 2026-08-02 適用。
- 金管會《金融業運用人工智慧（AI）指引》六大核心原則；直接與消費者互動時須揭露 AI 之使用，但**不需公開模型原始碼或完整訓練資料**。
- 數位發展部 AI 產品與系統評測中心（AIEC）主要評測構面：準確性、可靠性、公平性、隱私、資安。
- MCP 由 Anthropic 提出後於 2025-12 捐予 Linux Foundation；A2A 亦已捐出；2026 年成立 Agentic AI Foundation（AAIF）。

**產業場景對應原則：** 隱私／合規／風險／治理 → 金融、醫療；電腦視覺／異常偵測／預測性維護 → 工廠、農業；內容生成／個人化／評量 → 教育；導入評估／成本效益／流程自動化 → 五者依情境挑選。

---

### Task 1: 評鑑內容主題目錄

**Files:**
- Create: `src/domain/assessmentTopics.ts`
- Test: `tests/assessmentTopics.test.ts`

**Interfaces:**
- Consumes: 無
- Produces:
  - `export type AssessmentTopic = { code: string; name: string; count: number }`
  - `export const practiceTopics: Record<string, AssessmentTopic[]>`（key 為 subjectId）
  - `export const topicLabel = (topic: AssessmentTopic): string`（回傳 `` `${code} ${name}` ``）
  - `export const practiceTotal = (subjectId: string): number`

- [ ] **Step 1: 寫失敗測試**

建立 `tests/assessmentTopics.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { practiceTopics, practiceTotal, topicLabel } from "../src/domain/assessmentTopics";

describe("評鑑內容主題目錄", () => {
  it("初級兩科各配置 100 題", () => {
    expect(practiceTotal("junior-ai-basics")).toBe(100);
    expect(practiceTotal("junior-genai")).toBe(100);
  });

  it("junior-ai-basics 有 9 個評鑑內容節點", () => {
    expect(practiceTopics["junior-ai-basics"]).toHaveLength(9);
  });

  it("junior-genai 有 7 個評鑑內容節點", () => {
    expect(practiceTopics["junior-genai"]).toHaveLength(7);
  });

  it("代碼格式為 L + 五位數字且不重複", () => {
    const codes = Object.values(practiceTopics).flat().map((t) => t.code);
    for (const code of codes) expect(code).toMatch(/^L\d{5}$/);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("每個節點題數為正整數", () => {
    for (const topic of Object.values(practiceTopics).flat()) {
      expect(Number.isInteger(topic.count)).toBe(true);
      expect(topic.count).toBeGreaterThan(0);
    }
  });

  it("topicLabel 組出「代碼 名稱」", () => {
    expect(topicLabel({ code: "L11101", name: "AI 的定義與分類", count: 11 }))
      .toBe("L11101 AI 的定義與分類");
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/assessmentTopics.test.ts`
Expected: FAIL — `Failed to resolve import "../src/domain/assessmentTopics"`

- [ ] **Step 3: 寫實作**

建立 `src/domain/assessmentTopics.ts`：

```ts
/**
 * 官方《評鑑內容範圍》的評鑑內容節點，與新題庫（practice）各節點的題數配額。
 * 來源：AI應用規劃師能力鑑定_評鑑內容範圍參考（115.02）。
 * 中級三科尚未納入，見 docs/superpowers/specs/2026-08-13-practice-bank-design.md 的 Backlog。
 */
export type AssessmentTopic = {
  code: string;
  name: string;
  count: number;
};

export const practiceTopics: Record<string, AssessmentTopic[]> = {
  "junior-ai-basics": [
    { code: "L11101", name: "AI 的定義與分類", count: 11 },
    { code: "L11102", name: "AI 治理概念", count: 11 },
    { code: "L11201", name: "資料基本概念與來源", count: 11 },
    { code: "L11202", name: "資料整理與分析流程", count: 11 },
    { code: "L11203", name: "資料隱私與安全", count: 11 },
    { code: "L11301", name: "機器學習基本原理", count: 11 },
    { code: "L11302", name: "常見的機器學習模型", count: 12 },
    { code: "L11401", name: "鑑別式 AI 與生成式 AI 的基本原理", count: 11 },
    { code: "L11402", name: "鑑別式 AI 與生成式 AI 的整合應用", count: 11 },
  ],
  "junior-genai": [
    { code: "L12101", name: "No Code / Low Code 的基本概念", count: 14 },
    { code: "L12102", name: "No Code / Low Code 的優勢與限制", count: 14 },
    { code: "L12201", name: "生成式 AI 應用領域與常見工具", count: 15 },
    { code: "L12202", name: "如何善用生成式 AI 工具", count: 15 },
    { code: "L12301", name: "生成式 AI 導入評估", count: 14 },
    { code: "L12302", name: "生成式 AI 導入規劃", count: 14 },
    { code: "L12303", name: "生成式 AI 風險管理", count: 14 },
  ],
};

export const topicLabel = (topic: AssessmentTopic): string => `${topic.code} ${topic.name}`;

export const practiceTotal = (subjectId: string): number =>
  (practiceTopics[subjectId] ?? []).reduce((sum, topic) => sum + topic.count, 0);
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/assessmentTopics.test.ts && npm run build`
Expected: 6 tests PASS；build 無錯誤

- [ ] **Step 5: 提交**

```bash
git add src/domain/assessmentTopics.ts tests/assessmentTopics.test.ts
git commit -m "feat: assessment topic catalog and practice bank quotas"
```

---

### Task 2: 新題庫資料存取層

**Files:**
- Create: `src/data/practice/junior-ai-basics.ts`
- Create: `src/data/practice/junior-genai.ts`
- Create: `src/data/practice/index.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `practiceTopics`、`topicLabel`（Task 1）
- Produces:
  - `getPracticeQuestions(subjectId: string): Question[]`
  - `getPracticeStats(subjectId: string): { total: number; byTopic: Record<string, number> }`
  - 兩個科目檔各 `export const practiceQuestions: Question[]`

本任務建立**空陣列**的題庫檔與存取層，測試只驗「形狀契約」與「不得超額／不得用未知代碼」——這些在題庫為空時即成立，之後每個內容任務再逐一補上該節點的數量斷言。

- [ ] **Step 1: 寫失敗測試**

建立 `tests/practiceBank.test.ts`：

```ts
import { describe, it, expect } from "vitest";
import { getPracticeQuestions, getPracticeStats } from "../src/data/practice";
import { practiceTopics, topicLabel } from "../src/domain/assessmentTopics";
import type { ChoiceId } from "../src/data/types";

const subjects = ["junior-ai-basics", "junior-genai"];
const choiceIds: ChoiceId[] = ["A", "B", "C", "D"];

describe("新題庫形狀契約", () => {
  it("未知科目回空陣列", () => {
    expect(getPracticeQuestions("nope")).toEqual([]);
  });

  for (const subjectId of subjects) {
    it(`${subjectId}：id 唯一且格式正確`, () => {
      const qs = getPracticeQuestions(subjectId);
      const ids = qs.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(new RegExp(`^${subjectId}-practice-q\\d{3}$`));
    });

    it(`${subjectId}：每題四個選項、答案合法、文字非空`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        expect(q.choices.map((c) => c.id), q.id).toEqual(choiceIds);
        for (const c of q.choices) expect(c.text.trim().length, `${q.id} ${c.id}`).toBeGreaterThan(0);
        expect(choiceIds, q.id).toContain(q.answer);
        expect(q.prompt.trim().length, q.id).toBeGreaterThan(0);
        expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
        expect(q.subjectId, q.id).toBe(subjectId);
        expect(q.source, q.id).toBe("generated");
      }
    });

    it(`${subjectId}：選項解析恰好涵蓋三個錯誤選項`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        const keys = Object.keys(q.choiceExplanations ?? {}).sort();
        const expected = choiceIds.filter((id) => id !== q.answer).sort();
        expect(keys, q.id).toEqual(expected);
        for (const key of keys) {
          expect((q.choiceExplanations as Record<string, string>)[key].trim().length, `${q.id} ${key}`)
            .toBeGreaterThan(0);
        }
      }
    });

    it(`${subjectId}：sourceRef 為五大產業之一`, () => {
      const industries = ["金融", "醫療", "工廠", "教育", "農業"];
      for (const q of getPracticeQuestions(subjectId)) {
        expect(industries, q.id).toContain(q.sourceRef);
      }
    });

    it(`${subjectId}：topic 為合法評鑑內容節點，且各節點不超額`, () => {
      const allowed = new Map(practiceTopics[subjectId].map((t) => [topicLabel(t), t.count]));
      const stats = getPracticeStats(subjectId);
      for (const [label, count] of Object.entries(stats.byTopic)) {
        expect(allowed.has(label), `未知主題：${label}`).toBe(true);
        expect(count, `${label} 超額`).toBeLessThanOrEqual(allowed.get(label)!);
      }
    });
  }
});

describe("原題庫未受影響", () => {
  it("getQuestions 的題數不變", async () => {
    const { getQuestions } = await import("../src/data/index");
    expect(getQuestions("junior-ai-basics")).toHaveLength(222);
    expect(getQuestions("junior-genai")).toHaveLength(213);
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `Failed to resolve import "../src/data/practice"`

- [ ] **Step 3: 寫實作**

建立 `src/data/practice/junior-ai-basics.ts`：

```ts
import type { Question } from "../types";

// 依評鑑內容節點分批撰寫；配額見 src/domain/assessmentTopics.ts。
// 內容為 LLM 產出，正確性需人工複審。
export const practiceQuestions: Question[] = [];
```

建立 `src/data/practice/junior-genai.ts`（內容同上，僅註解相同）：

```ts
import type { Question } from "../types";

// 依評鑑內容節點分批撰寫；配額見 src/domain/assessmentTopics.ts。
// 內容為 LLM 產出，正確性需人工複審。
export const practiceQuestions: Question[] = [];
```

建立 `src/data/practice/index.ts`：

```ts
import type { Question } from "../types";
import { practiceQuestions as juniorAiBasics } from "./junior-ai-basics";
import { practiceQuestions as juniorGenai } from "./junior-genai";

const banks: Record<string, Question[]> = {
  "junior-ai-basics": juniorAiBasics,
  "junior-genai": juniorGenai,
};

/** 新題庫（依評鑑內容分類）。與 src/data/index.ts 的原題庫完全獨立。 */
export const getPracticeQuestions = (subjectId: string): Question[] => banks[subjectId] ?? [];

export const getPracticeStats = (
  subjectId: string,
): { total: number; byTopic: Record<string, number> } => {
  const questions = getPracticeQuestions(subjectId);
  const byTopic: Record<string, number> = {};
  for (const question of questions) {
    byTopic[question.topic] = (byTopic[question.topic] ?? 0) + 1;
  }
  return { total: questions.length, byTopic };
};
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS；build 無錯誤

- [ ] **Step 5: 提交**

```bash
git add src/data/practice tests/practiceBank.test.ts
git commit -m "feat: practice bank data layer, independent of the main bank"
```

---

### Task 3: UI 與狀態接線

**Files:**
- Modify: `src/main.ts`
- Modify: `src/ui/render.ts`
- Test: `tests/render.test.ts`

**Interfaces:**
- Consumes: `getPracticeQuestions`（Task 2）
- Produces:
  - `renderModePicker(subjectName, drillCount, drillProgressText?, practice?)`，其中 `practice?: { count: number; progressText?: string }`
  - `session.bank: "main" | "practice"`；`startMode` 改收 `ModeToken = "exam" | "drill" | "practice"`

題庫為空時第三張卡不顯示，因此本任務可在內容之前落地。

- [ ] **Step 1: 寫失敗測試**

在 `tests/render.test.ts` 末尾追加：

```ts
describe("模式選單的新題庫卡", () => {
  it("有新題庫時顯示第三張卡與題數", () => {
    const html = renderModePicker("科目", 222, undefined, { count: 100 });
    expect(html).toContain('data-mode="practice"');
    expect(html).toContain("新題庫練習");
    expect(html).toContain("依評鑑主題分類 100 題");
  });

  it("新題庫為空時不顯示第三張卡", () => {
    expect(renderModePicker("科目", 222, undefined, { count: 0 })).not.toContain('data-mode="practice"');
    expect(renderModePicker("科目", 222)).not.toContain('data-mode="practice"');
  });

  it("新題庫進度提示會被跳脫", () => {
    const html = renderModePicker("科目", 222, undefined, { count: 100, progressText: "上次進度：第 3 題<x>" });
    expect(html).toContain("第 3 題&lt;x&gt;");
    expect(html).not.toContain("第 3 題<x>");
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/render.test.ts`
Expected: FAIL — 找不到 `data-mode="practice"`

- [ ] **Step 3: 改 `renderModePicker`**

把 `src/ui/render.ts` 的 `renderModePicker` 整個換成：

```ts
export const renderModePicker = (
  subjectName: string,
  drillCount: number,
  drillProgressText?: string,
  practice?: { count: number; progressText?: string },
): string => `
  <header class="topbar"><button class="back" data-nav="back">← 返回</button><h1>${escapeHtml(subjectName)}</h1></header>
  <main class="mode-picker">
    <button class="mode-card" data-mode="exam"><h2>模擬考試</h2><p>50 題・計時・100 分制・70 分及格</p></button>
    <button class="mode-card" data-mode="drill">
      <h2>刷題練習</h2>
      <p>全部 ${drillCount} 題・即時對錯與詳解・不計時</p>
      ${drillProgressText ? `<p class="drill-progress-hint">${escapeHtml(drillProgressText)}</p>` : ""}
    </button>
    ${practice && practice.count > 0 ? `
      <button class="mode-card" data-mode="practice">
        <h2>新題庫練習</h2>
        <p>依評鑑主題分類 ${practice.count} 題・附選項解析・不計時</p>
        ${practice.progressText ? `<p class="drill-progress-hint">${escapeHtml(practice.progressText)}</p>` : ""}
      </button>
    ` : ""}
  </main>
`;
```

- [ ] **Step 4: 改 `src/main.ts` 的型別與 session**

在 `type Mode = "exam" | "drill";` 之後加入：

```ts
type Bank = "main" | "practice";
// 模式選單的點擊 token：practice 實際上是 mode=drill + bank=practice。
type ModeToken = "exam" | "drill" | "practice";
```

`Session` 型別加一個欄位（放在 `mode` 之後）：

```ts
  bank: Bank;               // drill 的題庫來源：原題庫或新題庫
```

`blankSession()` 的回傳物件加上 `bank: "main",`。

加入 import：

```ts
import { getPracticeQuestions } from "./data/practice";
```

- [ ] **Step 5: 加入進度 key helper 並改三處呼叫**

在 `persistDrill` 之前加入：

```ts
// 新題庫的進度與原刷題分開存：同一個 localStorage key 底下，科目 key 加上 :practice 後綴。
function drillProgressKey(): string {
  return session.bank === "practice" ? `${session.subjectId}:practice` : session.subjectId;
}
```

把 `persistDrill` 內的 `saveDrillProgress(session.subjectId, ...)` 改為 `saveDrillProgress(drillProgressKey(), ...)`。

把 `resetDrill` 內的 `clearDrillProgress(session.subjectId)` 改為 `clearDrillProgress(drillProgressKey())`。

- [ ] **Step 6: 改 `startMode`**

整個換成：

```ts
function startMode(token: ModeToken) {
  session.mode = token === "exam" ? "exam" : "drill";
  session.bank = token === "practice" ? "practice" : "main";
  if (session.mode === "exam") { session.view = "paper"; render(); return; }
  // 刷題：放入全部題目、依原序（不打散），並還原上次進度。
  const bank = session.bank === "practice"
    ? getPracticeQuestions(session.subjectId)
    : getQuestions(session.subjectId);
  session.questions = buildAttempt(bank, { count: bank.length, shuffle: (a) => [...a] }).questions;
  const restored = restoreDrill(session.questions, loadDrillProgress(drillProgressKey()));
  session.answers = restored.answers;
  session.index = restored.index;
  session.deadline = null;
  session.drillFilter = "all";
  session.view = "play";
  session.reveal = revealForCurrent(); // 該題已作答則揭曉
  render();
}
```

把 click 委派中的 `if (mode) { startMode(mode as Mode); return; }` 改為 `if (mode) { startMode(mode as ModeToken); return; }`。

- [ ] **Step 7: 改 `render()` 的 mode 分支**

整個換成：

```ts
  if (session.view === "mode") {
    stopTimer();
    const bank = getQuestions(session.subjectId);
    // 這裡對 bank（原始題庫）算索引，只是為了顯示「上次進度」提示；
    // 必須和 startMode 實際還原用的題目序列（buildAttempt 之後的 questions）一致，
    // 否則提示的第 N 題會跟真正續作的位置對不上。目前 buildAttempt 的 identity shuffle
    // 回傳的陣列與 bank 相等，兩處恰好同步——若刷題排序邏輯改變，這裡也要跟著改。
    const hintFor = (questions: Question[], key: string): string | undefined => {
      const restored = restoreDrill(questions, loadDrillProgress(key));
      const answered = Object.keys(restored.answers).length;
      return answered > 0 || restored.index > 0
        ? `上次進度：第 ${restored.index + 1} 題・已作答 ${answered} 題`
        : undefined;
    };
    const practiceBank = getPracticeQuestions(session.subjectId);
    app.innerHTML = renderModePicker(
      getSubject(session.subjectId)?.name ?? "",
      bank.length,
      hintFor(bank, session.subjectId),
      { count: practiceBank.length, progressText: hintFor(practiceBank, `${session.subjectId}:practice`) },
    );
    return;
  }
```

- [ ] **Step 8: 執行測試與型別檢查**

Run: `npm run build && npm run test`
Expected: build 無錯誤；測試全綠

- [ ] **Step 9: 提交**

```bash
git add src/main.ts src/ui/render.ts tests/render.test.ts
git commit -m "feat: practice bank entry in mode picker with isolated progress"
```

---

## 內容任務共通流程

Task 4–11 都是內容任務，流程一致：

1. 在 `tests/practiceBank.test.ts` 的「新題庫形狀契約」describe 之後，加入本批節點的數量斷言。
2. 執行測試確認失敗（數量不符）。
3. 依出題契約撰寫題目，追加到對應科目檔的 `practiceQuestions` 陣列。
4. 執行 `npx vitest run tests/practiceBank.test.ts && npm run build` 確認通過。
5. 提交。

數量斷言的寫法（以 Task 4 為例，其餘任務照樣改代碼與數字）：

```ts
describe("junior-ai-basics 節點題數", () => {
  it("L11101 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11101 AI 的定義與分類"]).toBe(11);
  });
});
```

**id 連號規則：** 各科的 `qNNN` 從 001 起連號，依任務順序遞增。每個內容任務開始前先看該科檔案現有最後一題的編號，接續往下編。

---

### Task 4: junior-ai-basics L111（22 題）

**Files:**
- Modify: `src/data/practice/junior-ai-basics.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-ai-basics-practice-q001` ~ `q022`

- [ ] **Step 1: 加入數量斷言**

```ts
describe("junior-ai-basics 節點題數", () => {
  it("L11101 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11101 AI 的定義與分類"]).toBe(11);
  });
  it("L11102 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11102 AI 治理概念"]).toBe(11);
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 11`

- [ ] **Step 3: 撰寫 22 題**

`topic` 分別為 `L11101 AI 的定義與分類`（11 題，id q001–q011）與 `L11102 AI 治理概念`（11 題，id q012–q022）。

- **L11101** 涵蓋：AI／ML／DL 的包含關係、弱 AI 與強 AI、分析型／預測型／生成型 AI 的分工、模型與 AI 系統與 Agent 的層級、基礎模型與 LLM 與多模態與推理模型的定位、專家系統屬 AI 但非 ML。產業以教育、農業、工廠為主。
- **L11102** 涵蓋：我國《人工智慧基本法》的施行狀態、主管機關、第 4 條七大原則；EU AI Act 四級風險分級與延後時程；金管會指引的揭露義務界線（不需公開原始碼）；AIEC 評測構面；human-in／over-the-loop 的差別；AI 倫理原則與違反情境的對應。產業以金融、醫療為主。

格式範例（照此結構寫，內容不得照抄）：

```ts
  {
    id: "junior-ai-basics-practice-q001",
    subjectId: "junior-ai-basics",
    prompt: "某教育科技公司導入 AI 產生個人化練習題，技術主管在向董事會說明時，需要釐清人工智慧、機器學習與深度學習三者的關係。下列敘述何者最正確？",
    choices: [
      { id: "A", text: "三者為並列的技術分支，各自獨立發展" },
      { id: "B", text: "深度學習是機器學習的子集，機器學習又是人工智慧的子集" },
      { id: "C", text: "機器學習是深度學習的子集，兩者都不屬於人工智慧" },
      { id: "D", text: "人工智慧是機器學習的子集，深度學習則與兩者無關" },
    ],
    answer: "B",
    explanation: "人工智慧是最外層的概念，機器學習是其中一種「由資料學規則」的方法，深度學習又是機器學習中以多層神經網路實作的一支。專家系統屬於人工智慧但不屬於機器學習——它的規則由人撰寫，不是從資料學來的。",
    choiceExplanations: {
      A: "三者是層層包含而非並列；把它們視為獨立分支會誤判技術選型的範圍。",
      C: "包含關係顛倒了，且兩者都在人工智慧的範圍內。",
      D: "包含關係完全顛倒；深度學習與另外兩者關係最為緊密。",
    },
    topic: "L11101 AI 的定義與分類",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
  },
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-ai-basics.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L111 (junior-ai-basics, 22 questions)"
```

---

### Task 5: junior-ai-basics L112（33 題）

**Files:**
- Modify: `src/data/practice/junior-ai-basics.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-ai-basics-practice-q023` ~ `q055`

- [ ] **Step 1: 加入數量斷言**

在既有的 `describe("junior-ai-basics 節點題數")` 內追加：

```ts
  it("L11201 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11201 資料基本概念與來源"]).toBe(11);
  });
  it("L11202 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11202 資料整理與分析流程"]).toBe(11);
  });
  it("L11203 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11203 資料隱私與安全"]).toBe(11);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 11`

- [ ] **Step 3: 撰寫 33 題**

- **L11201 資料基本概念與來源**（11 題，q023–q033）：結構化／半結構化／非結構化資料的判別、大數據 5V（Volume／Velocity／Variety／Veracity／Value）、資料來源型態（自有產品、感測器網路、公開 API、網路爬蟲、外部購買）、資料整合的目的與其界線（保存期限不屬整合目的）。產業以工廠、農業、金融為主。
- **L11202 資料整理與分析流程**（11 題，q034–q044）：ETL 與 ELT、遺缺值處理（平均／中位數／插補／刪除）、離群值偵測（IQR、Z-score）、正規化與標準化、One-hot 與 Label Encoding、對數轉換、特徵交叉、EDA 與 CDA 的差別、敘述統計與偏態判讀（平均數與中位數的相對位置）、圖表選用（直方圖／散佈圖／箱型圖）。產業以工廠、金融、教育為主。
- **L11203 資料隱私與安全**（11 題，q045–q055）：去識別化／假名化／匿名化的差別、個資法的目的最小化與當事人權利、差分隱私、傳輸加密與中間人攻擊、存取控制與稽核、聯邦學習與同態加密的適用情境差異、訓練資料記憶造成的洩漏。產業以醫療、金融為主。

格式與品質依「出題契約」。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-ai-basics.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L112 (junior-ai-basics, 33 questions)"
```

---

### Task 6: junior-ai-basics L113（23 題）

**Files:**
- Modify: `src/data/practice/junior-ai-basics.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-ai-basics-practice-q056` ~ `q078`

- [ ] **Step 1: 加入數量斷言**

在既有的 `describe("junior-ai-basics 節點題數")` 內追加：

```ts
  it("L11301 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11301 機器學習基本原理"]).toBe(11);
  });
  it("L11302 有 12 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11302 常見的機器學習模型"]).toBe(12);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 11`

- [ ] **Step 3: 撰寫 23 題**

- **L11301 機器學習基本原理**（11 題，q056–q066）：監督式／非監督式／半監督式／自監督式／強化式的判別與適用情境、訓練與驗證與測試的切分、資料洩漏、交叉驗證與時間序列不適用 k-fold、過擬合與欠擬合、偏差—變異權衡、正則化（L1 稀疏性 vs L2）、損失函數與優化器的分工、資料增強。產業以農業、工廠、醫療為主。
- **L11302 常見的機器學習模型**（12 題，q067–q078）：線性迴歸、邏輯迴歸、KNN、決策樹、隨機森林、SVM（高維小樣本佳、大資料成本高）、K-means、PCA、CNN、RNN 與 LSTM、自編碼器用於異常偵測、樹模型對特徵尺度不敏感。產業以金融、工廠、農業為主。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-ai-basics.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L113 (junior-ai-basics, 23 questions)"
```

---

### Task 7: junior-ai-basics L114（22 題）

**Files:**
- Modify: `src/data/practice/junior-ai-basics.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-ai-basics-practice-q079` ~ `q100`

- [ ] **Step 1: 加入數量斷言**

在既有的 `describe("junior-ai-basics 節點題數")` 內追加：

```ts
  it("L11401 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11401 鑑別式 AI 與生成式 AI 的基本原理"]).toBe(11);
  });
  it("L11402 有 11 題", () => {
    expect(getPracticeStats("junior-ai-basics").byTopic["L11402 鑑別式 AI 與生成式 AI 的整合應用"]).toBe(11);
  });
  it("整科合計 100 題", () => {
    expect(getPracticeStats("junior-ai-basics").total).toBe(100);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 11`

- [ ] **Step 3: 撰寫 22 題**

- **L11401 基本原理**（11 題，q079–q089）：鑑別式學 P(y|x) 決策邊界、生成式學資料分布並產生新樣本、判別任務與生成任務的歸類、GAN 的生成器與判別器、VAE 的編碼器與解碼器、擴散模型的逐步去噪、Transformer 與自注意力、模式崩潰、單純貝氏屬生成式模型、LLM 依上下文預測下一個 token。產業以醫療、工廠、教育為主。
- **L11402 整合應用**（11 題，q090–q100）：以生成式補足稀缺樣本再交鑑別式訓練、生成式模擬攻擊強化資安偵測、自駕情境模擬、生成內容再由鑑別式審核、多模態整合、整合應用的挑戰（訓練穩定性、資料偏差放大、架構設計）、生成式不適合承擔判別型高風險決策。產業以醫療、工廠、金融、農業為主。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS，且 `junior-ai-basics` 合計 100 題

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-ai-basics.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L114 (junior-ai-basics, 22 questions) — subject complete"
```

---

### Task 8: junior-genai L121（28 題）

**Files:**
- Modify: `src/data/practice/junior-genai.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-genai-practice-q001` ~ `q028`

- [ ] **Step 1: 加入數量斷言**

```ts
describe("junior-genai 節點題數", () => {
  it("L12101 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12101 No Code / Low Code 的基本概念"]).toBe(14);
  });
  it("L12102 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12102 No Code / Low Code 的優勢與限制"]).toBe(14);
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 14`

- [ ] **Step 3: 撰寫 28 題**

- **L12101 基本概念**（14 題，q001–q014）：No Code 與 Low Code 的差別與適用對象、平台元件語彙（資料模型、條件分支、Webhook、API 介接）、公民開發者、AI 民主化、AutoML 與 No-Code 的分工、工作流自動化工具的定位、Vibe Coding 與 Low-Code 的差異。產業以教育、農業、工廠為主。
- **L12102 優勢與限制**（14 題，q015–q028）：降低門檻與縮短上市時間、供應商鎖定與資料可攜、效能天花板（毫秒級延遲與高吞吐不適用）、可測試性與自動化整合測試、邊緣裝置資源限制、治理失控（功能重複、欄位定義不一致、未審核上線）、無法完全取代專業開發。產業以金融、工廠、醫療為主。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-genai.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L121 (junior-genai, 28 questions)"
```

---

### Task 9: junior-genai L122（30 題）

**Files:**
- Modify: `src/data/practice/junior-genai.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-genai-practice-q029` ~ `q058`

- [ ] **Step 1: 加入數量斷言**

在既有的 `describe("junior-genai 節點題數")` 內追加：

```ts
  it("L12201 有 15 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12201 生成式 AI 應用領域與常見工具"]).toBe(15);
  });
  it("L12202 有 15 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12202 如何善用生成式 AI 工具"]).toBe(15);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 15`

- [ ] **Step 3: 撰寫 30 題**

- **L12201 應用領域與常見工具**（15 題，q029–q043）：文字／圖像／語音／影片生成工具的定位（ChatGPT、Claude、Gemini、Midjourney、Whisper、TTS）、程式碼助手（GitHub Copilot、Cursor）與其限制、Agentic Coding 工具、工作流平台（n8n、Dify）、AgentKit、即時語音模型、各產業的實際應用場景。產業五者並用。
- **L12202 如何善用生成式 AI 工具**（15 題，q044–q058）：提示策略體系（Zero-shot／Few-shot／CoT／ToT／Graph Prompting／Role Prompting）、Few-shot 遇領域偏移的失效、上下文工程與 Token 預算、對話記憶、RAG 全套（Embedding、向量資料庫、Chunking、增量索引）、RAG 不保證正確、RAG 與微調與提示的取捨、MCP 與 RAG 的定位差異、函數呼叫、生成參數（溫度）。產業以金融、醫療、教育為主。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-genai.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L122 (junior-genai, 30 questions)"
```

---

### Task 10: junior-genai L12301＋L12302（28 題）

**Files:**
- Modify: `src/data/practice/junior-genai.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-genai-practice-q059` ~ `q086`

- [ ] **Step 1: 加入數量斷言**

在既有的 `describe("junior-genai 節點題數")` 內追加：

```ts
  it("L12301 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12301 生成式 AI 導入評估"]).toBe(14);
  });
  it("L12302 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12302 生成式 AI 導入規劃"]).toBe(14);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 14`

- [ ] **Step 3: 撰寫 28 題**

- **L12301 導入評估**（14 題，q059–q072）：痛點識別與應用場景分析、技術與效能評估指標（延遲、輸出品質、任務準確度）、TCO 與 ROI 的範圍界線（效率提升屬效益不屬成本）、Token Economics、自建開源與商用 API 的取捨、部署形態抉擇（公有雲／地端／混合）與資料分級、PoC 的範圍界線。產業以金融、醫療、工廠為主。
- **L12302 導入規劃**（14 題，q073–q086）：導入步驟順序（先定目標與 KPI，再資料，再技術選型，再流程設計）、試辦目標須可評估可驗收、資料品質與持續更新機制、人員培訓與文化、效能監控與重新訓練、資料漂移與概念漂移、多模組系統的改進優先順序、上線後的受控更新（shadow／canary／rollback）。產業以教育、農業、金融為主。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-genai.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L12301+L12302 (junior-genai, 28 questions)"
```

---

### Task 11: junior-genai L12303（14 題）

**Files:**
- Modify: `src/data/practice/junior-genai.ts`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: `getPracticeStats`（Task 2）
- Produces: `junior-genai-practice-q087` ~ `q100`

- [ ] **Step 1: 加入數量斷言**

在既有的 `describe("junior-genai 節點題數")` 內追加：

```ts
  it("L12303 有 14 題", () => {
    expect(getPracticeStats("junior-genai").byTopic["L12303 生成式 AI 風險管理"]).toBe(14);
  });
  it("整科合計 100 題", () => {
    expect(getPracticeStats("junior-genai").total).toBe(100);
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run tests/practiceBank.test.ts`
Expected: FAIL — `expected undefined to be 14`

- [ ] **Step 3: 撰寫 14 題**

**L12303 風險管理**（14 題，q087–q100）：幻覺與事實查核、直接與間接提示注入及其多層防禦、Guardrails 的目的界線、最小權限與高風險動作的核准後執行、訓練資料記憶造成的洩漏、偏見檢測與偏見緩解的區分、黑箱與責任歸屬、生成內容的出處標示（C2PA、SynthID）、版權與資料來源合法性、EU AI Act 的不可接受風險、風險應對策略（迴避／緩解／轉移／接受）、human-in-the-loop 審查。產業以金融、醫療、教育為主。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run tests/practiceBank.test.ts && npm run build`
Expected: PASS，且 `junior-genai` 合計 100 題

- [ ] **Step 5: 提交**

```bash
git add src/data/practice/junior-genai.ts tests/practiceBank.test.ts
git commit -m "content: practice bank L12303 (junior-genai, 14 questions) — subject complete"
```

---

### Task 12: 最終驗證與文件

**Files:**
- Create: `docs/coverage/practice-bank.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `docs/architecture.md`
- Test: `tests/practiceBank.test.ts`

**Interfaces:**
- Consumes: 全部前置任務
- Produces: 無

- [ ] **Step 1: 加入正解分佈與重複題幹的健檢**

在 `tests/practiceBank.test.ts` 末尾追加：

```ts
describe("新題庫整體品質", () => {
  for (const subjectId of ["junior-ai-basics", "junior-genai"]) {
    it(`${subjectId}：正解字母分佈不極端（每個字母至少 15 題）`, () => {
      const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      for (const q of getPracticeQuestions(subjectId)) counts[q.answer] += 1;
      for (const letter of ["A", "B", "C", "D"]) {
        expect(counts[letter], `${letter} 只有 ${counts[letter]} 題`).toBeGreaterThanOrEqual(15);
      }
    });

    it(`${subjectId}：題幹不重複`, () => {
      const prompts = getPracticeQuestions(subjectId).map((q) => q.prompt);
      expect(new Set(prompts).size).toBe(prompts.length);
    });

    it(`${subjectId}：選項內不出現「以上皆是／皆非」`, () => {
      for (const q of getPracticeQuestions(subjectId)) {
        for (const c of q.choices) {
          expect(c.text, `${q.id} ${c.id}`).not.toMatch(/以上皆[是非]/);
        }
      }
    });
  }
});
```

- [ ] **Step 2: 執行測試**

Run: `npm run test`
Expected: 全綠。若正解分佈或重複題幹不符，回到對應內容檔調整題目後再跑。

- [ ] **Step 3: 寫覆蓋文件**

建立 `docs/coverage/practice-bank.md`，內容包含：新題庫的目的、兩科各節點的題數對照表（與 `src/domain/assessmentTopics.ts` 一致）、產業場景分佈統計、以及「內容為 LLM 產出、尚未人工事實查核」的複審狀態說明與複審方法（逐題核對 `explanation` 與 `choiceExplanations` 是否與 `answer` 一致）。

產業分佈統計用這段指令產生後填入：

```bash
npx tsx -e "
import {getPracticeQuestions} from './src/data/practice/index.ts';
for (const s of ['junior-ai-basics','junior-genai']) {
  const c: Record<string, number> = {};
  for (const q of getPracticeQuestions(s)) c[q.sourceRef ?? '未標'] = (c[q.sourceRef ?? '未標'] ?? 0) + 1;
  console.log(s, c);
}
"
```

- [ ] **Step 4: 更新三份不變式文件**

- `docs/architecture.md`：在 `src/domain/` 表格加 `assessmentTopics.ts`（官方評鑑內容節點與新題庫配額）；在 `src/data/` 表格加 `practice/`（依評鑑內容分類的新題庫，與原題庫完全獨立，不經 `getQuestions`）。
- `AGENTS.md`：在核心不變式加一則——新題庫（`src/data/practice/`）不得併入 `getQuestions`；其進度存於既有 key `ipas-aiap-drill-progress` 底下的 `${subjectId}:practice`；模式選單第三張卡以 `data-mode="practice"` 觸發，實際為 `mode=drill` ＋ `bank=practice`。
- `CLAUDE.md`：在「容易踩到的點」加一則——`session.bank` 決定 drill 的題庫來源，改刷題相關邏輯時要確認兩種來源都成立；新題庫的題數與配額由 `src/domain/assessmentTopics.ts` 定義，改配額要同步改測試。

- [ ] **Step 5: 瀏覽器實測**

Run: `npm run dev`，開 `http://127.0.0.1:5173/ipas-aiap-cert/`

逐項確認：
1. 初級兩科的模式選單都出現第三張「新題庫練習」卡，顯示 100 題；中級三科不出現該卡。
2. 進入新題庫練習，題目正常、作答後顯示詳解與三個錯誤選項的解析。
3. 篩選器、跳題、重置進度都正常。
4. 在新題庫作答數題後離開，回到模式選單——**新題庫卡顯示進度、原刷題卡的進度不受影響**（兩者互不干擾）。
5. 進入原刷題區，題數仍為 222／213，題目與先前相同。
6. 模擬考試流程不受影響。
7. 作答後到成績頁，主題統計以評鑑內容碼分列。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "docs: practice bank coverage notes and project invariants"
```

---

## 完成後

依 `superpowers:finishing-a-development-branch` 收尾：跑完整測試 → 詢問整合方式。
