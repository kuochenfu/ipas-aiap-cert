import { escapeHtml } from "./escape";
import type { Choice } from "../data/types";
import type { Subject } from "../domain/catalog";
import { getSubjectsByLevel, subjects } from "../domain/catalog";
import { getBankStats } from "../data/index";
import { getStudyGuide } from "../data/studyGuide";
import type { Level } from "../data/types";
import type { Question } from "../data/types";
import type { StudyNoteItem, StudyNoteSection, StudyNotesBySubject } from "../data/types";
import { composeGlossaryAnalysis } from "../data/choiceAnalysis";
import type { DrillFilter } from "../domain/drill";

export type BankStats = { total: number; pastExam: number; generated: number };
export type DrillCounts = Record<DrillFilter, number>;
export type DrillControls = {
  filter: DrillFilter;
  counts: DrillCounts;
  total: number;
};

export const renderSubjectCard = (subject: Subject, stats: BankStats): string => `
  <button class="subject-card" data-subject="${escapeHtml(subject.id)}">
    <span class="subject-code">${escapeHtml(subject.code)}</span>
    <span class="subject-name">${escapeHtml(subject.name)}</span>
    <span class="subject-stats">真題 ${stats.pastExam}　新題 ${stats.generated}　共 ${stats.total} 題</span>
    <span class="subject-time">作答時間 ${subject.durationMinutes} 分鐘</span>
  </button>
`;

export type ChoiceView = { selected: boolean; reveal: boolean; correct: boolean };

export const renderChoice = (choice: Choice, view: ChoiceView): string => {
  const classes = ["choice"];
  if (view.selected) classes.push("selected");
  if (view.reveal && view.correct) classes.push("correct");
  if (view.reveal && view.selected && !view.correct) classes.push("wrong");
  return `
    <button class="${classes.join(" ")}" data-choice="${choice.id}">
      <span class="choice-id">${choice.id}</span>
      <span class="choice-text">${escapeHtml(choice.text)}</span>
    </button>
  `;
};

const drillFilterLabels: Record<DrillFilter, string> = {
  all: "全部",
  wrong: "錯題",
  unanswered: "未答",
};

const renderDrillFilters = ({ filter, counts, total }: DrillControls): string => `
  <div class="drill-controls">
    <div class="drill-filters" aria-label="刷題篩選">
      ${(Object.keys(drillFilterLabels) as DrillFilter[]).map((key) => `
        <button class="drill-filter ${filter === key ? "active" : ""}" data-filter="${key}" aria-pressed="${filter === key}">
          <span>${drillFilterLabels[key]}</span>
          <strong>${counts[key]}</strong>
        </button>
      `).join("")}
    </div>
    <div class="drill-jump">
      <label class="drill-jump-label">
        跳至
        <input class="drill-jump-input" type="number" inputmode="numeric" min="1" max="${total}"
               aria-label="跳至第幾題（1 到 ${total}）">
        題
      </label>
      <button class="drill-jump-go" data-nav="jump">前往</button>
      <button class="drill-reset" data-nav="drill-reset">重置進度</button>
    </div>
  </div>
`;

const renderAnswerSummary = (q: Question, selected: string | undefined): string => {
  const correctChoice = q.choices.find((choice) => choice.id === q.answer);
  const isCorrect = selected === q.answer;
  return `
    <div class="answer-summary ${isCorrect ? "is-correct" : "is-wrong"}">
      <strong>${isCorrect ? "答對" : "答錯"}，正解：${q.answer}.</strong>
      <span>${escapeHtml(correctChoice?.text ?? "")}</span>
    </div>
  `;
};

const explanationSegmentForChoice = (explanation: string, choiceId: string): string | undefined => {
  const markerPattern = /(^|[。；;，,\n])\s*([ABCD])(?:[、.．：:]|\s|的)/g;
  const markers: { choiceId: string; start: number; contentStart: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = markerPattern.exec(explanation)) !== null) {
    markers.push({
      choiceId: match[2],
      start: match.index + match[1].length,
      contentStart: markerPattern.lastIndex,
    });
  }
  const markerIndex = markers.findIndex((marker) => marker.choiceId === choiceId);
  if (markerIndex < 0) return undefined;
  const marker = markers[markerIndex];
  const next = markers[markerIndex + 1];
  const end = next ? next.start : explanation.length;
  const segment = explanation.slice(marker.start, end).trim().replace(/[。；;，,]\s*$/, "");
  return segment.length >= 8 ? segment : undefined;
};

const fallbackChoiceExplanation = (q: Question, choice: Choice): string => {
  const correctChoice = q.choices.find((item) => item.id === q.answer);
  const correctText = correctChoice?.text ?? "";
  if (choice.id === q.answer) {
    return (
      composeGlossaryAnalysis({
        choiceText: choice.text,
        choiceId: choice.id,
        isCorrect: true,
        correctText,
      }) ?? "這是本題正解；請搭配下方詳解掌握判斷依據。"
    );
  }
  const segment = explanationSegmentForChoice(q.explanation, choice.id);
  if (segment) return segment;
  return (
    composeGlossaryAnalysis({
      choiceText: choice.text,
      choiceId: choice.id,
      isCorrect: false,
      correctText,
    }) ??
    `此選項不是本題答案；它描述的是「${choice.text}」，但本題正解應判斷為「${q.answer}. ${correctText}」。請對照完整詳解，確認題目情境與關鍵概念的差異。`
  );
};

const renderChoiceExplanations = (q: Question): string => `
  <div class="choice-explanations">
    <strong>選項解析</strong>
    <div class="choice-explanation-list">
      ${q.choices.map((choice) => {
        const classes = ["choice-explanation"];
        if (choice.id === q.answer) classes.push("correct");
        const text = q.choiceExplanations?.[choice.id] ?? fallbackChoiceExplanation(q, choice);
        return `
          <div class="${classes.join(" ")}">
            <span class="choice-id">${choice.id}</span>
            <p>${escapeHtml(text)}</p>
          </div>
        `;
      }).join("")}
    </div>
  </div>
`;

export const renderHome = (): string => `
  <header class="topbar"><h1>iPAS AI 應用規劃師 練習</h1></header>
  <main class="home">
    <p class="lead">選擇級別開始練習</p>
    <div class="level-grid">
      <button class="level-card" data-level="junior"><h2>初級</h2><p>人工智慧基礎概論 ・ 生成式 AI 應用與規劃</p></button>
      <button class="level-card" data-level="senior"><h2>中級</h2><p>技術應用規劃 ・ 大數據 ・ 機器學習</p></button>
    </div>
      <button class="study-entry" data-nav="study">📚 學習主題（延伸閱讀）</button>
  </main>
`;

export const renderLevel = (level: Level): string => {
  const cards = getSubjectsByLevel(level)
    .map((s) => renderSubjectCard(s, getBankStats(s.id)))
    .join("");
  return `
    <header class="topbar">
      <button class="back" data-nav="home">← 返回</button>
      <h1>${level === "junior" ? "初級" : "中級"}</h1>
    </header>
    <main class="subject-list">${cards}</main>
  `;
};

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

export const renderQuestion = (
  q: Question, index: number, total: number,
  selected: string | undefined, reveal: boolean, timeText: string,
  review: boolean,
  drillControls?: DrillControls,
): string => {
  const choices = q.choices
    .map((c) => renderChoice(c, { selected: selected === c.id, reveal, correct: c.id === q.answer }))
    .join("");
  const explanation = reveal
    ? `
      ${renderAnswerSummary(q, selected)}
      <div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>
      ${renderChoiceExplanations(q)}
    `
    : "";
  // 刷題作答不需要交卷；檢討模式保留回成績入口。
  const lastButton = review
    ? `<button class="submit" data-nav="result">回成績</button>`
    : "";
  return `
    <header class="topbar">
      <button class="back" data-nav="quit">結束</button>
      <span class="progress">第 ${index + 1} / ${total} 題</span>
      <span class="timer">${timeText}</span>
    </header>
    <main class="question">
      ${drillControls ? renderDrillFilters(drillControls) : ""}
      ${q.topic && q.topic !== "未分類" ? `<span class="q-topic">${escapeHtml(q.topic)}</span>` : ""}
      <p class="prompt">${escapeHtml(q.prompt)}</p>
      <div class="choices">${choices}</div>
      ${explanation}
      <div class="qnav">
        <button class="prev" data-nav="prev">上一題</button>
        <button class="next" data-nav="next">下一題</button>
        ${lastButton}
      </div>
    </main>
  `;
};

export const renderDrillEmpty = (controls: DrillControls): string => `
  <header class="topbar">
    <button class="back" data-nav="quit">結束</button>
    <span class="progress">刷題練習</span>
  </header>
  <main class="question">
    ${renderDrillFilters(controls)}
    <div class="empty-state">
      <h2>${drillFilterLabels[controls.filter]}目前沒有題目</h2>
      <p>切換到其他篩選繼續練習。</p>
    </div>
  </main>
`;

export const renderResult = (
  score: number, correct: number, wrong: number, passed: boolean,
  topics: { topic: string; total: number; correct: number }[],
): string => {
  const rows = topics
    .map((t) => `<tr><td>${escapeHtml(t.topic)}</td><td>${t.correct}/${t.total}</td></tr>`)
    .join("");
  return `
    <header class="topbar"><button class="back" data-nav="home">回首頁</button><h1>成績</h1></header>
    <main class="result">
      <p class="score ${passed ? "pass" : "fail"}">${score} 分　${passed ? "及格" : "不及格"}</p>
      <p>答對 ${correct} 題、答錯 ${wrong} 題（及格 70 分）</p>
      <table class="topic-table"><thead><tr><th>主題</th><th>答對/總數</th></tr></thead><tbody>${rows}</tbody></table>
      <button class="review-btn" data-nav="review">逐題檢討</button>
    </main>
  `;
};

const renderReadingLink = (link: { title: string; url: string }): string =>
  `<li><a class="reading-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a></li>`;

const speakerIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 5 6 9H3v6h3l5 4V5Z"></path>
    <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
    <path d="M18 5.5a9 9 0 0 1 0 13"></path>
  </svg>
`;

const renderNoteItems = (items: StudyNoteItem[]): string => `
  <ul>
    ${items.map((item) => `
      <li>
        <span class="note-text">${escapeHtml(item.text)}</span>
        ${item.children?.length ? renderNoteItems(item.children) : ""}
      </li>
    `).join("")}
  </ul>
`;

const countNoteLeaves = (items: StudyNoteItem[]): number =>
  items.reduce(
    (sum, item) => sum + (item.children?.length ? countNoteLeaves(item.children) : 1),
    0,
  );

const renderStudyNotes = (notes: StudyNoteSection[] | undefined): string => {
  if (!notes?.length) return "";
  const count = notes.reduce((sum, section) => sum + countNoteLeaves(section.items), 0);
  return `
    <details class="study-notes">
      <summary>學習指引整理 <span>${count} 則重點</span></summary>
      <div class="study-note-sections">
        ${notes.map((section) => `
          <section class="study-note-section">
            <div class="study-note-heading">
              <h5>${escapeHtml(section.heading)}</h5>
              <button class="tts-button" data-tts-section aria-label="朗讀 ${escapeHtml(section.heading)}" title="朗讀" aria-pressed="false">
                ${speakerIcon}
              </button>
            </div>
            ${renderNoteItems(section.items)}
          </section>
        `).join("")}
      </div>
    </details>
  `;
};

export const renderStudyLoading = (): string => `
  <header class="topbar">
    <button class="back" data-nav="home">← 返回</button>
    <h1>學習主題（延伸閱讀）</h1>
  </header>
  <main class="study">
    <p class="lead">正在載入學習指引整理...</p>
  </main>
`;

export const renderStudyView = (studyNotes?: StudyNotesBySubject): string => {
  const sections = (["junior", "senior"] as const).map((level) => {
    const subjectsHtml = subjects
      .filter((s) => s.level === level)
      .map((s) => {
        const guide = getStudyGuide(s.id, studyNotes);
        const topics = (guide?.topics ?? [])
          .map((t) => `
            <div class="study-topic">
              <h4>${escapeHtml(t.code)}　${escapeHtml(t.title)}</h4>
              <ul class="study-contents">${t.contents.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
              ${renderStudyNotes(t.notes)}
              <ul class="study-links">${t.links.map(renderReadingLink).join("")}</ul>
            </div>
          `)
          .join("");
        return `
          <section class="study-subject">
            <h3>${escapeHtml(s.code)}　${escapeHtml(s.name)}</h3>
            ${topics}
          </section>
        `;
      })
      .join("");
    return `
      <section class="study-level">
        <h2>${level === "junior" ? "初級" : "中級"}</h2>
        ${subjectsHtml}
      </section>
    `;
  }).join("");
  return `
    <header class="topbar">
      <button class="back" data-nav="home">← 返回</button>
      <h1>學習主題（延伸閱讀）</h1>
    </header>
    <main class="study">
      <p class="lead">依官方評鑑範圍，掌握各科應讀主題與延伸閱讀。</p>
      <div class="tts-rate" aria-label="朗讀語速">
        <span>語速</span>
        <button data-tts-rate="0.9">0.9x</button>
        <button class="active" data-tts-rate="1">1.0x</button>
        <button data-tts-rate="1.2">1.2x</button>
      </div>
      ${sections}
    </main>
  `;
};

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
const renderExamChoice = (qid: string, choice: Choice, selected: boolean): string => {
  const classes = ["choice"];
  if (selected) classes.push("selected");
  return `
    <button class="${classes.join(" ")}" data-qid="${escapeHtml(qid)}" data-choice="${choice.id}">
      <span class="choice-id">${choice.id}</span>
      <span class="choice-text">${escapeHtml(choice.text)}</span>
    </button>`;
};

export const renderExamPaper = (
  questions: Question[],
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
  questions: Question[],
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
        <p class="your-answer">${escapeHtml(yours)}</p>
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
