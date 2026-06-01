# 單頁三份模擬試卷 ＋ 全題庫刷題 Implementation Plan

> **For agentic workers:** 採直接實作（變更跨 main.ts/render.ts 且含就地 DOM 互動，緊密耦合）。TDD 涵蓋可測單元（mockPapers、render 純函式），單頁互動以瀏覽器驗證。

**Goal:** 刷題放入全部題目（原序）；模擬考試改為單頁、每科 3 份固定試卷，交卷後單頁檢討。

**Tech Stack:** Vite、TypeScript、Vitest。無新依賴。

---

## Task 1: mockPapers 模組（決定性 3 份試卷）

**Files:** Create `src/state/mockPapers.ts`; Test `tests/mockPapers.test.ts`

- [ ] Step 1：測試（決定性、份數、集合關係）

```ts
import { describe, it, expect } from "vitest";
import { buildMockPaper, PAPER_COUNT } from "../src/state/mockPapers";
import { getQuestions } from "../src/data/index";

describe("buildMockPaper", () => {
  it("提供固定份數，每份 50 題（題庫足夠時）", () => {
    expect(PAPER_COUNT).toBe(3);
    const p = buildMockPaper(getQuestions("junior-ai-basics"), "junior-ai-basics", 0);
    expect(p).toHaveLength(50);
  });
  it("同 seed 決定性可重現", () => {
    const bank = getQuestions("senior-ml");
    const a = buildMockPaper(bank, "senior-ml", 1).map((q) => q.id);
    const b = buildMockPaper(bank, "senior-ml", 1).map((q) => q.id);
    expect(a).toEqual(b);
  });
  it("題庫>50：三份題目集合不完全相同", () => {
    const bank = getQuestions("junior-ai-basics"); // 112
    const sets = [0, 1, 2].map((i) => new Set(buildMockPaper(bank, "junior-ai-basics", i).map((q) => q.id)));
    const same01 = [...sets[0]].every((id) => sets[1].has(id));
    expect(same01).toBe(false);
  });
  it("題庫=50：三份為同一集合的排列（集合相同、順序可不同）", () => {
    const bank = getQuestions("senior-ml"); // 50
    const s0 = buildMockPaper(bank, "senior-ml", 0).map((q) => q.id).sort();
    const s1 = buildMockPaper(bank, "senior-ml", 1).map((q) => q.id).sort();
    expect(s0).toEqual(s1);
  });
});
```

- [ ] Step 2：實作 `src/state/mockPapers.ts`

```ts
import type { Question } from "../data/types";
import { shuffleWith } from "./attempt";
import { examRules } from "../domain/exam";

export const PAPER_COUNT = 3;

const hashSeed = (s: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// 依 subjectId + 份次 產生穩定、可重現的 50 題試卷。
export const buildMockPaper = (bank: Question[], subjectId: string, paperIndex: number): Question[] => {
  const rng = mulberry32(hashSeed(`${subjectId}#${paperIndex}`));
  return shuffleWith(bank, rng).slice(0, Math.min(examRules.totalQuestions, bank.length));
};
```

- [ ] Step 3：`npx vitest run tests/mockPapers.test.ts` → PASS。
- [ ] Step 4：commit `feat: add deterministic mock-paper builder`.

---

## Task 2: render — 單頁考卷與單頁檢討

**Files:** Modify `src/ui/render.ts`; Modify `tests/render.test.ts`

- [ ] Step 1：render 測試（加 import `renderExamPaper, renderExamReview, renderPaperPicker`）

```ts
describe("renderPaperPicker", () => {
  it("含科目名稱與三份按鈕", () => {
    const html = renderPaperPicker("人工智慧基礎概論", 3);
    expect(html).toContain("人工智慧基礎概論");
    expect((html.match(/data-paper="/g) ?? []).length).toBe(3);
  });
});

describe("renderExamPaper", () => {
  const qs = [
    { id: "q1", subjectId: "s", prompt: "P1<x>", choices: [
      { id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
      answer: "A", explanation: "", topic: "T", difficulty: "中", source: "past-exam" },
  ] as any;
  it("含 data-qid、已作答計數、交卷、跳脫；依 answers 標 selected", () => {
    const html = renderExamPaper(qs, { q1: "B" }, "10:00", 1);
    expect(html).toContain('data-qid="q1"');
    expect(html).toContain("已作答");
    expect(html).toContain('data-nav="submit"');
    expect(html).toContain("&lt;x&gt;");
    expect(html).toMatch(/data-choice="B"[^>]*class="[^"]*selected/);
  });
});

describe("renderExamReview", () => {
  const qs = [
    { id: "q1", subjectId: "s", prompt: "P1", choices: [
      { id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
      answer: "A", explanation: "因為 A", topic: "T", difficulty: "中", source: "past-exam" },
  ] as any;
  it("標示正解與你的作答、含詳解", () => {
    const html = renderExamReview(qs, { q1: "B" }, 0, "回成績");
    expect(html).toContain("因為 A");
    expect(html).toMatch(/data-choice="A"[^>]*class="[^"]*correct/);
    expect(html).toMatch(/data-choice="B"[^>]*class="[^"]*wrong/);
  });
});
```

- [ ] Step 2：run → FAIL（未定義）。

- [ ] Step 3：實作（append 至 `src/ui/render.ts`）。新增匯入：`import { examRules } from "../domain/exam";`（若未匯入）。

```ts
export const renderPaperPicker = (subjectName: string, paperCount: number): string => {
  const cards = Array.from({ length: paperCount }, (_, i) => `
    <button class="mode-card" data-paper="${i}"><h2>第 ${i + 1} 份</h2><p>50 題・單頁作答・計時</p></button>
  `).join("");
  return `
    <header class="topbar"><button class="back" data-nav="back-mode">← 返回</button><h1>${escapeHtml(subjectName)}</h1></header>
    <main class="mode-picker">${cards}</main>
  `;
};

// 單頁考卷中的選項（含 data-qid，作答中不揭曉對錯）。
const renderExamChoice = (qid: string, choice: { id: string; text: string }, selected: boolean): string => {
  const classes = ["choice"];
  if (selected) classes.push("selected");
  return `
    <button class="${classes.join(" ")}" data-qid="${escapeHtml(qid)}" data-choice="${choice.id}">
      <span class="choice-id">${choice.id}</span>
      <span class="choice-text">${escapeHtml(choice.text)}</span>
    </button>`;
};

export const renderExamPaper = (
  questions: import("../data/types").Question[],
  answers: Record<string, string | undefined>,
  timeText: string,
  answered: number,
): string => {
  const blocks = questions.map((q, i) => `
    <section class="exam-q" data-qid="${escapeHtml(q.id)}">
      <p class="prompt"><span class="qnum">${i + 1}.</span> ${escapeHtml(q.prompt)}</p>
      <div class="choices">${q.choices.map((c) => renderExamChoice(q.id, c, answers[q.id] === c.id)).join("")}</div>
    </section>`).join("");
  return `
    <header class="topbar exam-bar">
      <button class="back" data-nav="quit">結束</button>
      <span class="progress">已作答 <span class="answered-count">${answered}</span> / ${questions.length}</span>
      <span class="timer">${timeText}</span>
      <button class="submit" data-nav="submit">交卷</button>
    </header>
    <main class="exam-paper">
      ${blocks}
      <button class="submit submit-bottom" data-nav="submit">交卷</button>
    </main>
  `;
};

export const renderExamReview = (
  questions: import("../data/types").Question[],
  answers: Record<string, string | undefined>,
  scoreLine: number,
  backLabel: string,
): string => {
  const blocks = questions.map((q, i) => {
    const mine = answers[q.id];
    const choices = q.choices.map((c) => {
      const classes = ["choice"];
      if (c.id === q.answer) classes.push("correct");
      if (mine === c.id && c.id !== q.answer) classes.push("wrong");
      return `<div class="${classes.join(" ")}"><span class="choice-id">${c.id}</span><span class="choice-text">${escapeHtml(c.text)}</span></div>`;
    }).join("");
    const yours = mine ? `你的作答：${mine}` : "未作答";
    return `
      <section class="exam-q">
        <p class="prompt"><span class="qnum">${i + 1}.</span> ${escapeHtml(q.prompt)}</p>
        <div class="choices">${choices}</div>
        <p class="your-answer">${yours}</p>
        <div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>
      </section>`;
  }).join("");
  return `
    <header class="topbar"><button class="back" data-nav="result">← ${escapeHtml(backLabel)}</button><h1>逐題檢討</h1></header>
    <main class="exam-paper review">
      <p class="lead">本次得分 ${scoreLine} 分</p>
      ${blocks}
    </main>
  `;
};
```
（註：`scoreLine` 由呼叫端傳入分數；`renderExamReview` 的 `backLabel` 用「回成績」。）

- [ ] Step 4：run → PASS。
- [ ] Step 5：commit `feat: add one-page exam paper, review, and paper-picker renderers`.

---

## Task 3: main.ts 串接（刷題全題、單頁考卷、就地選取、檢討分流）

**Files:** Modify `src/main.ts`

- [ ] Step 1：匯入新 render 與 mockPapers

把第 2–4 行的匯入清單加上 `renderExamPaper, renderExamReview, renderPaperPicker`。
新增：`import { buildMockPaper, PAPER_COUNT } from "./state/mockPapers";`

- [ ] Step 2：型別與 Session

- `type View = "home" | "level" | "mode" | "paper" | "play" | "result" | "review" | "study";`
- `Session` 新增 `paperIndex: number;`
- `blankSession()` 內加 `paperIndex: 0,`

- [ ] Step 3：輔助函式（answered 計數）

於 `timeText` 之後新增：
```ts
function answeredCount(): number {
  return session.questions.reduce((n, q) => n + (session.answers[q.id] !== undefined ? 1 : 0), 0);
}
```

- [ ] Step 4：render() 調整

- 新增 `paper` 視圖分支（在 `mode` 之後）：
```ts
  if (session.view === "paper") {
    stopTimer();
    app.innerHTML = renderPaperPicker(getSubject(session.subjectId)?.name ?? "", PAPER_COUNT);
    return;
  }
```
- 將 `play`/`review` 分支改為依模式分流：
```ts
  if (session.view === "play") {
    if (session.mode === "exam") {
      app.innerHTML = renderExamPaper(session.questions, session.answers, timeText(), answeredCount());
    } else {
      const q = session.questions[session.index];
      app.innerHTML = renderQuestion(
        q, session.index, session.questions.length,
        session.answers[q.id], session.reveal, "", false,
      );
    }
    return;
  }
  if (session.view === "review") {
    if (session.mode === "exam") {
      const report = scoreExam(session.questions, session.answers);
      app.innerHTML = renderExamReview(session.questions, session.answers, report.score, "回成績");
    } else {
      const q = session.questions[session.index];
      app.innerHTML = renderQuestion(
        q, session.index, session.questions.length,
        session.answers[q.id], true, "", true,
      );
    }
    return;
  }
```
（移除原本合併的 `play || review` 分支。）

- [ ] Step 5：模式啟動分流

把 `startMode` 改為：drill 直接開始（全部題目、原序）；exam 先進 `paper` 選卷。
```ts
function startMode(mode: Mode) {
  session.mode = mode;
  if (mode === "exam") { session.view = "paper"; render(); return; }
  // drill：全部題目、原序（identity shuffle）
  const bank = getQuestions(session.subjectId);
  session.questions = buildAttempt(bank, { count: bank.length, shuffle: (a) => [...a] }).questions;
  session.answers = {};
  session.index = 0;
  session.reveal = false;
  session.deadline = null;
  session.view = "play";
  render();
}

function startExamPaper(paperIndex: number) {
  const subject = getSubject(session.subjectId)!;
  const bank = getQuestions(session.subjectId);
  session.paperIndex = paperIndex;
  session.questions = buildMockPaper(bank, session.subjectId, paperIndex);
  session.answers = {};
  session.index = 0;
  session.reveal = false;
  session.view = "play";
  session.deadline = Date.now() + subject.durationMinutes * 60_000;
  startTimer();
  render();
}
```

- [ ] Step 6：點擊委派

- `data-mode` 仍呼叫 `startMode`（exam 會進選卷頁）。
- 新增 `data-paper`（選卷）：
```ts
  const paper = target.getAttribute("data-paper");
  if (paper !== null) { startExamPaper(Number(paper)); return; }
```
- 單頁考卷的選項就地更新（取代「整頁重繪」）：在既有 `data-choice` 處理前，新增 exam 單頁分支：
```ts
  const choice = target.getAttribute("data-choice");
  const qid = target.getAttribute("data-qid");
  if (choice && qid && session.view === "play" && session.mode === "exam") {
    session.answers[qid] = choice as ChoiceId;
    const group = target.closest(".exam-q");
    group?.querySelectorAll<HTMLElement>("[data-choice]").forEach((b) => {
      b.classList.toggle("selected", b === target);
    });
    const countEl = app.querySelector(".answered-count");
    if (countEl) countEl.textContent = String(answeredCount());
    return;
  }
```
（保留原 drill 的 `data-choice` 處理：`if (choice && session.view === "play") { ... selectChoice ... }`。）
- nav 新增 `back-mode`（從選卷頁返回模式選擇）：
```ts
  if (nav === "back-mode") { stopTimer(); session.view = "mode"; render(); return; }
```
- `revealForCurrent`、drill 的 prev/next/submit/review 維持不變（review 分流已在 render 處理）。

- [ ] Step 7：`npm run build` → clean；`npx vitest run` → 全綠。
- [ ] Step 8：commit `feat: full-bank drill and one-page 3-paper mock exam`.

---

## Task 4: 樣式

**Files:** Modify `src/styles.css`（append）

- [ ] Step 1：新增單頁考卷樣式

```css
.exam-bar { position: sticky; top: 0; z-index: 5; background: rgba(245,242,235,0.94);
  backdrop-filter: blur(10px); padding: 10px 4px; border-bottom: 1px solid var(--border); }
.exam-bar .submit { flex: none; padding: 8px 16px; }
.exam-paper { display: grid; gap: 14px; }
.exam-q { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
.exam-q .prompt { margin-top: 0; }
.qnum { color: var(--accent); font-weight: 800; margin-right: 4px; }
.exam-paper .choices { grid-template-columns: 1fr; }
.submit-bottom { width: 100%; padding: 14px; font-size: 1.05rem; }
.your-answer { margin: 8px 0 0; color: var(--muted); font-weight: 700; }
.exam-paper.review .explanation { margin-top: 10px; }
```

- [ ] Step 2：`npm run build` → clean。commit `style: one-page exam paper styling`.

---

## Task 5: 瀏覽器驗證（單頁互動）

- [ ] 模擬考試：選科 → 出現「第 1/2/3 份」→ 選一份 → 單頁 50 題、頂部計時與「已作答 X/50」。
- [ ] 點選項即標記、改選正常、捲動位置不跳動；計數即時更新。
- [ ] 交卷 → 成績頁 → 逐題檢討為單頁、標正解/誤答與詳解。
- [ ] 刷題：進入後題數 = 全部（如初級科目1 為 112）、原序（第 1 題 = 該科第一份考卷第 1 題）、即時詳解、上一題/下一題正常。
- [ ] `npm run test && npm run build` 全綠。

---

## Self-Review 紀錄

- Spec 覆蓋：mockPapers 決定性 3 份(Task 1)、單頁考卷/檢討/選卷渲染(Task 2)、刷題全題原序＋單頁考試串接＋就地選取＋檢討分流(Task 3)、樣式(Task 4)、瀏覽器驗證(Task 5)。
- 型別一致：`buildMockPaper`/`PAPER_COUNT`、`renderExamPaper/Review/PaperPicker` 簽名與 main.ts 呼叫一致；`View` 新增 `paper`、`Session.paperIndex` 一致；exam 單頁 `data-qid+data-choice` 就地更新與 drill 的 `data-choice` 全頁渲染並存且互斥（依 `session.mode` 與 `data-qid` 有無分流）。
- 既有不變：drill 逐題卡片、計分規則、錯題本、學習主題、計時與自動交卷不變。
