import { escapeHtml } from "./escape";
import type { Choice, QuestionFigure } from "../data/types";
import type { Subject } from "../domain/catalog";
import { certs, getLevels, getSubjects } from "../domain/catalog";
import { getBankStats, getTopicCounts } from "../data/index";
import { getStudyGuide } from "../data/studyGuide";
import type { Cert, Level } from "../data/types";
import type { Question } from "../data/types";
import type { StudyNoteItem, StudyNoteSection, StudyNoteTable, StudyNotesBySubject } from "../data/types";
import type { DrillFilter } from "../domain/drill";
import { isTopicClassified, topicMatchesGuideCode } from "../domain/assessmentTopics";

export type BankStats = { total: number; pastExam: number; generated: number; studyGuide: number };
export type DrillCounts = Record<DrillFilter, number>;
export type DrillControls = {
  filter: DrillFilter;
  counts: DrillCounts;
  total: number;
  /** 題庫已依評鑑節點分類時才顯示「節點表現」入口（未分類的題庫看了也沒意義）。 */
  hasTopics?: boolean;
};

/**
 * 題數統計的敘述。三種來源分別列出，讓「官方練習評量」不會被誤讀成歷屆真題。
 * 為 0 的來源不顯示，避免每張卡都拖著一串 0。
 */
const bankStatsText = (stats: BankStats): string =>
  [
    stats.pastExam > 0 ? `真題 ${stats.pastExam}` : "",
    stats.generated > 0 ? `新題 ${stats.generated}` : "",
    stats.studyGuide > 0 ? `官方練習 ${stats.studyGuide}` : "",
    `共 ${stats.total} 題`,
  ].filter(Boolean).join("　");

export const renderSubjectCard = (subject: Subject, stats: BankStats): string => {
  // 題數為 0 的科目（目前為 AIoT 考科二）不掛 data-subject，事件委派便不會處理它。
  if (stats.total === 0) {
    return `
      <div class="subject-card is-empty" aria-disabled="true">
        <span class="subject-code">${escapeHtml(subject.code)}</span>
        <span class="subject-name">${escapeHtml(subject.name)}</span>
        <span class="subject-stats">尚無題目</span>
        <span class="subject-time">作答時間 ${subject.durationMinutes} 分鐘</span>
      </div>
    `;
  }
  return `
    <button class="subject-card" data-subject="${escapeHtml(subject.id)}">
      <span class="subject-code">${escapeHtml(subject.code)}</span>
      <span class="subject-name">${escapeHtml(subject.name)}</span>
      <span class="subject-stats">${bankStatsText(stats)}</span>
      <span class="subject-time">作答時間 ${subject.durationMinutes} 分鐘</span>
    </button>
  `;
};

export type ChoiceView = { selected: boolean; reveal: boolean; correct: boolean };

// 原卷圖片（多為程式碼截圖）的文字轉錄。note/chart 為散文，其餘保留換行與縮排，
// 故以 <pre> 呈現並由 CSS 開啟橫向捲動——長程式碼列不能撐破版面。
const figureLabels: Record<QuestionFigure["kind"], string> = {
  note: "",
  code: "程式碼",
  output: "執行結果",
  table: "資料",
  chart: "圖表說明",
};

const renderFigure = (fig: QuestionFigure): string => {
  const caption = fig.caption
    ? `<p class="figure-caption">${escapeHtml(fig.caption)}</p>`
    : "";
  const label = figureLabels[fig.kind];
  const tag = `<span class="figure-label">${escapeHtml(label)}</span>`;
  const body = fig.kind === "note" || fig.kind === "chart"
    ? `<p class="figure-prose">${escapeHtml(fig.content)}</p>`
    : `<pre class="figure-pre"><code>${escapeHtml(fig.content)}</code></pre>`;
  return `<figure class="q-figure q-figure-${fig.kind}">${caption}${label ? tag : ""}${body}</figure>`;
};

export const renderFigures = (figures: QuestionFigure[] | undefined): string =>
  figures?.length ? `<div class="q-figures">${figures.map(renderFigure).join("")}</div>` : "";

// 選項內容：一般為單行文字；選項本身是圖（例四段程式碼截圖）時改用 <pre>。
const renderChoiceBody = (choice: Choice, figure?: QuestionFigure): string =>
  figure
    ? `<pre class="choice-figure"><code>${escapeHtml(figure.content)}</code></pre>`
    : `<span class="choice-text">${escapeHtml(choice.text)}</span>`;

export const renderChoice = (choice: Choice, view: ChoiceView, figure?: QuestionFigure): string => {
  const classes = ["choice"];
  if (view.selected) classes.push("selected");
  if (view.reveal && view.correct) classes.push("correct");
  if (view.reveal && view.selected && !view.correct) classes.push("wrong");
  return `
    <button class="${classes.join(" ")}" data-choice="${choice.id}">
      <span class="choice-id">${choice.id}</span>
      ${renderChoiceBody(choice, figure)}
    </button>
  `;
};

const drillFilterLabels: Record<DrillFilter, string> = {
  all: "全部",
  wrong: "錯題",
  unanswered: "未答",
};

const renderDrillFilters = ({ filter, counts, total, hasTopics }: DrillControls): string => `
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
      ${hasTopics ? `<button class="drill-topics" data-nav="topics">節點表現</button>` : ""}
      <button class="drill-reset" data-nav="drill-reset">重置進度</button>
    </div>
  </div>
`;

const renderAnswerSummary = (q: Question, selected: string | undefined): string => {
  const correctChoice = q.choices.find((choice) => choice.id === q.answer);
  const isCorrect = selected === q.answer;
  const correctFigure = q.choiceFigures?.[q.answer];
  // 正解本身是程式碼區塊時，沿用 <pre> 呈現；否則擠成一行會失去縮排與換行。
  const body = correctFigure
    ? `<pre class="choice-figure"><code>${escapeHtml(correctFigure.content)}</code></pre>`
    : `<span>${escapeHtml(correctChoice?.text ?? "")}</span>`;
  return `
    <div class="answer-summary ${isCorrect ? "is-correct" : "is-wrong"}${correctFigure ? " has-figure" : ""}">
      <strong>${isCorrect ? "答對" : "答錯"}，正解：${q.answer}.</strong>
      ${body}
    </div>
  `;
};

const CLAUSE_BOUNDARY = /[。；;，,\n]/;

const explanationSegmentForChoice = (explanation: string, choiceId: string): string | undefined => {
  // 詳解裡指涉某個選項有三種常見寫法，都要認得：
  //   1. 子句開頭直接寫字母——「⋯；C 說它是單向語言模型，⋯」
  //   2. 字母夾在括號裡、跟在名詞後面——「TF-IDF（A）產生的是稀疏向量，⋯」
  //   3. 以連接詞串在同一子句裡——「C 的正整數與 D 的任意整數都⋯」
  // 第 2 種的段落應從**該子句開頭**取起（也就是連同「TF-IDF」一起），
  // 只從括號後取會得到「產生的是⋯」這種沒有主詞的殘句。
  const markerPattern =
    /(^|[。；;，,\n]|[與和及或、])\s*([ABCD])(?:[、.．：:]|\s|的)|[（(]([ABCD])[）)]/g;
  const markers: { choiceId: string; start: number; contentStart: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = markerPattern.exec(explanation)) !== null) {
    if (match[2] !== undefined) {
      markers.push({
        choiceId: match[2],
        start: match.index + match[1].length,
        contentStart: markerPattern.lastIndex,
      });
      continue;
    }
    // 括號寫法：往回找最近的子句邊界，作為這一段的起點。
    let start = match.index;
    while (start > 0 && !CLAUSE_BOUNDARY.test(explanation[start - 1])) start -= 1;
    markers.push({ choiceId: match[3], start, contentStart: start });
  }
  // 同一個子句裡可能一次談兩個選項——「C 的正整數與 D 的任意整數雖然都是離散取值，
  // 但範圍遠大於兩個值」。這句話確實同時解釋了 C 與 D，因此把子句內連續出現的標記
  // 併成一組、共用同一段文字；否則後面那個選項會被切成空白而落回通用填充句。
  const groups: { ids: string[]; start: number }[] = [];
  for (const marker of markers) {
    const previous = groups[groups.length - 1];
    const sameClause = previous
      && !CLAUSE_BOUNDARY.test(explanation.slice(previous.start, marker.start));
    if (sameClause) previous.ids.push(marker.choiceId);
    else groups.push({ ids: [marker.choiceId], start: marker.start });
  }

  const groupIndex = groups.findIndex((group) => group.ids.includes(choiceId));
  if (groupIndex < 0) return undefined;
  const group = groups[groupIndex];
  const next = groups[groupIndex + 1];
  const end = next ? next.start : explanation.length;
  const segment = explanation
    .slice(group.start, end)
    .trim()
    .replace(/[。；;，,]\s*$/, "")
    // 詳解結尾的評鑑主題標註（如「（L211 自然語言處理）」）屬於整則詳解，
    // 不屬於最後那個選項的解析，取到最後一段時要拿掉。
    // 必須在去掉句末標點「之後」才比對得到，因為標註後面通常還有一個句號。
    .replace(/（L\d{3}[^）]*）$/, "")
    .trim()
    .replace(/[。；;，,]\s*$/, "");
  return segment.length >= 8 ? segment : undefined;
};

const fallbackChoiceExplanation = (q: Question, choice: Choice): string => {
  const correctChoice = q.choices.find((item) => item.id === q.answer);
  const correctText = correctChoice?.text ?? "";
  if (choice.id === q.answer) {
    return "這是本題正解；請搭配下方詳解掌握判斷依據。";
  }
  // 部分題目的詳解本身帶有「（A）…（B）…」的逐項說明，優先抽取該片段。
  const segment = explanationSegmentForChoice(q.explanation, choice.id);
  if (segment) return segment;
  return `此選項不是本題答案；它描述的是「${choice.text}」，但本題正解應判斷為「${q.answer}. ${correctText}」。請對照完整詳解，確認題目情境與關鍵概念的差異。`;
};

/**
 * 「判斷分界」：條件變成什麼樣時，同一題的答案就會換人。AIoT 兩科的新題庫每題都寫了
 * 一句（`meta.decisionBoundary`），它是這批題目最有價值的部分——只背答案的人拿不到它。
 * 其餘題庫沒有 meta，這裡就整段不輸出，不會在畫面上留下空殼。
 */
const renderDecisionBoundary = (q: Question): string => {
  const text = q.meta?.decisionBoundary?.trim();
  if (!text) return "";
  return `<div class="decision-boundary"><strong>判斷分界</strong><p>${escapeHtml(text)}</p></div>`;
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

const levelName = (level: Level): string => (level === "junior" ? "初級" : "中級");

export const renderHome = (): string => `
  <header class="topbar"><h1>iPAS 能力鑑定 練習</h1></header>
  <main class="home">
    <p class="lead">選擇證照開始練習</p>
    <div class="cert-grid">
      ${certs.map((cert) => `
        <button class="cert-card" data-cert="${escapeHtml(cert.id)}">
          <h2>${escapeHtml(cert.name)}</h2>
          <p>${escapeHtml(cert.subtitle)}</p>
        </button>
      `).join("")}
    </div>
      <button class="study-entry" data-nav="study">📚 學習主題（延伸閱讀）</button>
  </main>
`;

/** 證照底下的級別選單。AIoT 目前只有初級，但保留這一層，日後出中級直接長出來。 */
export const renderCert = (cert: Cert): string => {
  const info = certs.find((c) => c.id === cert);
  const cards = getLevels(cert)
    .map((level) => {
      const names = getSubjects(cert, level).map((s) => s.name).join(" ・ ");
      return `
        <button class="level-card" data-level="${level}">
          <h2>${levelName(level)}</h2>
          <p>${escapeHtml(names)}</p>
        </button>
      `;
    })
    .join("");
  return `
    <header class="topbar">
      <button class="back" data-nav="home">← 返回</button>
      <h1>${escapeHtml(info?.name ?? "")}</h1>
    </header>
    <main class="home">
      <p class="lead">選擇級別開始練習</p>
      <div class="level-grid">${cards}</div>
    </main>
  `;
};

export const renderLevel = (cert: Cert, level: Level): string => {
  const cards = getSubjects(cert, level)
    .map((s) => renderSubjectCard(s, getBankStats(s.id)))
    .join("");
  return `
    <header class="topbar">
      <button class="back" data-nav="back">← 返回</button>
      <h1>${levelName(level)}</h1>
    </header>
    <main class="subject-list">${cards}</main>
  `;
};

export type ModePickerView = {
  subjectName: string;
  drillCount: number;
  drillProgressText?: string;
  practice?: { count: number; progressText?: string };
  /** 省略時視為開放。AIoT 兩科為 false——官方未公告題數，模擬考規則無從訂定。 */
  mockExam?: boolean;
};

export const renderModePicker = ({
  subjectName,
  drillCount,
  drillProgressText,
  practice,
  mockExam = true,
}: ModePickerView): string => `
  <header class="topbar"><button class="back" data-nav="back">← 返回</button><h1>${escapeHtml(subjectName)}</h1></header>
  <main class="mode-picker">
    ${mockExam
      ? `<button class="mode-card" data-mode="exam"><h2>模擬考試</h2><p>50 題・計時・100 分制・70 分及格</p></button>`
      : `<p class="mode-note">官方尚未公告題數與配分，暫不提供模擬考試。</p>`}
    <button class="mode-card" data-mode="drill">
      <h2>刷題練習</h2>
      <p>全部 ${drillCount} 題・即時對錯與詳解・不計時</p>
      ${drillProgressText ? `<p class="drill-progress-hint">${escapeHtml(drillProgressText)}</p>` : ""}
    </button>
    ${practice && practice.count > 0 ? `
      <button class="mode-card" data-mode="practice">
        <h2>新題庫練習</h2>
        <p>依評鑑主題分類 ${practice.count} 題・附選項解析・不計時</p>
        <p class="mode-card-warn">整份題庫由 LLM 命製，內容尚待人工複審</p>
        ${practice.progressText ? `<p class="drill-progress-hint">${escapeHtml(practice.progressText)}</p>` : ""}
      </button>
    ` : ""}
  </main>
`;

/**
 * LLM 命題的提示。`source === "generated"` 涵蓋 `generated/*` 的補充新題與
 * `practice/*` 的評鑑節點新題庫——兩者都由 LLM 依官方學習指引與評鑑節點命製，
 * 目前只有格式與分布的自動測試，內容正確性尚待人工複審。考生據此判斷可信度，
 * 因此題目出現在哪裡就標在哪裡（刷題、模擬考卷、逐題檢討）。
 * 官方真題（past-exam）與官方學習指引的練習評量（study-guide）不標。
 */
const renderSourceNote = (q: Question): string =>
  q.source === "generated"
    ? `<span class="q-source" title="本題由 LLM 命製，內容尚未經人工複審">AI 命題・待複審</span>`
    : "";

export const renderQuestion = (
  q: Question, index: number, total: number,
  selected: string | undefined, reveal: boolean, timeText: string,
  review: boolean,
  drillControls?: DrillControls,
): string => {
  const choices = q.choices
    .map((c) => renderChoice(
      c,
      { selected: selected === c.id, reveal, correct: c.id === q.answer },
      q.choiceFigures?.[c.id],
    ))
    .join("");
  const explanation = reveal
    ? `
      ${renderAnswerSummary(q, selected)}
      <div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>
      ${renderChoiceExplanations(q)}
      ${renderDecisionBoundary(q)}
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
      ${q.topic && isTopicClassified(q.topic) ? `<span class="q-topic">${escapeHtml(q.topic)}</span>` : ""}
      ${renderSourceNote(q)}
      <p class="prompt">${escapeHtml(q.prompt)}</p>
      ${renderFigures(q.figures)}
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

export type TopicStatRow = { topic: string; total: number; correct: number; answered: number };

/**
 * 刷題的「節點表現」：依官方評鑑內容節點列出作答狀況。
 *
 * 與成績頁的主題統計不同，刷題可以只作答一部分，因此每個節點要分別呈現
 * 「已作答幾題」與「其中答對幾題」——只給答對率會讓一題答對的節點看起來滿分。
 */
export const renderTopicStats = (
  subjectName: string, rows: TopicStatRow[], backLabel: string,
): string => {
  const body = rows.map((row) => {
    const rate = row.answered > 0 ? Math.round((row.correct / row.answered) * 100) : null;
    const bar = rate === null
      ? `<span class="topic-bar-empty">尚未作答</span>`
      : `<span class="topic-bar" style="--rate:${rate}%"><span class="topic-bar-fill"></span></span>`;
    return `
      <tr>
        <td class="topic-name">${escapeHtml(row.topic)}</td>
        <td class="topic-progress">${row.answered} / ${row.total}</td>
        <td class="topic-rate">${rate === null ? "—" : `${row.correct}／${row.answered}　${rate}%`}</td>
        <td class="topic-visual">${bar}</td>
      </tr>`;
  }).join("");
  const answered = rows.reduce((n, r) => n + r.answered, 0);
  const correct = rows.reduce((n, r) => n + r.correct, 0);
  return `
    <header class="topbar">
      <button class="back" data-nav="back-play">← ${escapeHtml(backLabel)}</button>
      <h1>節點表現</h1>
    </header>
    <main class="topic-stats">
      <p class="lead">${escapeHtml(subjectName)}　已作答 ${answered} 題，答對 ${correct} 題</p>
      <table class="topic-table">
        <thead><tr><th>評鑑內容節點</th><th>已作答</th><th>答對率</th><th></th></tr></thead>
        <tbody>${body}</tbody>
      </table>
      <p class="topic-note">節點依《AI 應用規劃師能力鑑定 — 評鑑內容範圍參考》分類；「已作答」為本科目目前的刷題進度。</p>
    </main>
  `;
};

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

// 比較表包一層 .note-table-wrap 由 CSS 開啟橫向捲動——寬表在手機上不能撐破版面。
const renderNoteTable = (caption: string, table: StudyNoteTable): string => `
  <div class="note-table-wrap">
    <table class="note-table">
      <caption>${escapeHtml(caption)}</caption>
      <thead>
        <tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${table.rows.map((row) => `
          <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
        `).join("")}
      </tbody>
    </table>
  </div>
`;

const renderNoteFormula = (label: string, formula: { expr: string; note?: string }): string => `
  <div class="note-formula">
    <span class="note-formula-label">${escapeHtml(label)}</span>
    <code class="note-formula-expr">${escapeHtml(formula.expr)}</code>
    ${formula.note ? `<span class="note-formula-note">${escapeHtml(formula.note)}</span>` : ""}
  </div>
`;

const renderNoteFlow = (label: string, steps: string[]): string => `
  <div class="note-flow">
    <span class="note-flow-label">${escapeHtml(label)}</span>
    <ol class="note-flow-steps">
      ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
    </ol>
  </div>
`;

const renderNoteBody = (item: StudyNoteItem): string => {
  if (item.table) return renderNoteTable(item.text, item.table);
  if (item.formula) return renderNoteFormula(item.text, item.formula);
  if (item.flow) return renderNoteFlow(item.text, item.flow);
  return `<span class="note-text">${escapeHtml(item.text)}</span>`;
};

const renderNoteItems = (items: StudyNoteItem[]): string => `
  <ul>
    ${items.map((item) => `
      <li${item.table || item.formula || item.flow ? ` class="note-block"` : ""}>
        ${renderNoteBody(item)}
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

type StudyNotesOptions = {
  label?: string;
  /**
   * 各節各自摺疊，只有第一節預設展開。一次倒出上百條純文字會變成文字牆
   * （五科單一主題最多有 277 則重點），因此兩張證照都開啟；
   * 證照層級的「備考總整理」不開，那本來就是要一次讀完的。
   */
  collapsibleSections?: boolean;
};

/** 供「考前速記」模式以 CSS 篩選用的穩定鍵；未列出的標題歸為 other。 */
const NOTE_SECTION_KEYS: Record<string, string> = {
  "必懂觀念": "concept",
  "重要縮寫": "abbr",
  "容易混淆": "confuse",
  "公式與計算": "formula",
  "實務案例": "case",
  "可能考法": "exam",
  "推薦資源": "resource",
};

const noteSectionKey = (heading: string): string => NOTE_SECTION_KEYS[heading] ?? "other";

const renderNoteSectionBody = (section: StudyNoteSection): string => `
  <div class="study-note-heading">
    <h5>${escapeHtml(section.heading)}</h5>
    <button class="tts-button" data-tts-section aria-label="朗讀 ${escapeHtml(section.heading)}" title="朗讀" aria-pressed="false">
      ${speakerIcon}
    </button>
  </div>
  ${renderNoteItems(section.items)}
`;

const renderStudyNotes = (
  notes: StudyNoteSection[] | undefined,
  { label = "學習指引整理", collapsibleSections = false }: StudyNotesOptions = {},
): string => {
  if (!notes?.length) return "";
  const count = notes.reduce((sum, section) => sum + countNoteLeaves(section.items), 0);
  const sections = notes.map((section, index) => {
    if (!collapsibleSections) {
      return `<section class="study-note-section" data-note-section="${noteSectionKey(section.heading)}">${renderNoteSectionBody(section)}</section>`;
    }
    return `
      <details class="study-note-section is-collapsible" data-note-section="${noteSectionKey(section.heading)}"${index === 0 ? " open" : ""}>
        <summary>${escapeHtml(section.heading)} <span>${countNoteLeaves(section.items)}</span></summary>
        ${renderNoteSectionBody(section)}
      </details>
    `;
  }).join("");
  return `
    <details class="study-notes">
      <summary>${escapeHtml(label)} <span>${count} 則重點</span></summary>
      <div class="study-note-sections">${sections}</div>
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

/** 節點碼含有 `.`，直接當 id 會讓 querySelector 需要跳脫，故一律轉成 `-`。 */
export const nodeAnchorId = (code: string): string => `node-${code.replace(/\./g, "-")}`;

/**
 * 節點的動作列：直接練這個節點的題目、以及已讀標記。
 * topic 對應的題數為 0 時（目前是考科二整科）不出練題按鈕，避免點了進到空題庫。
 */
const renderNodeActions = (
  subjectId: string,
  code: string,
  counts: Record<string, number>,
  readNodes: ReadonlySet<string>,
): string => {
  // 一個學習主題可能涵蓋數個題目節點（五科的 L111 → L11101、L11102…），故以前綴加總。
  const count = Object.entries(counts).reduce(
    (sum, [topic, n]) => sum + (topicMatchesGuideCode(topic, code) ? n : 0),
    0,
  );
  const read = readNodes.has(code);
  return `
    <div class="node-actions">
      ${count > 0
        ? `<button class="node-drill" data-topic-drill="${escapeHtml(subjectId)}|${escapeHtml(code)}">
             練這個主題的 ${count} 題 →
           </button>`
        : `<span class="node-drill is-empty">尚無題目</span>`}
      <button class="node-read${read ? " active" : ""}" data-study-read="${escapeHtml(code)}"
              aria-pressed="${read}">${read ? "✓ 已讀" : "標記已讀"}</button>
    </div>
  `;
};

/** 縮寫速查：15 個節點的縮寫彙整成一張表，考前查得到、搜尋也篩得到。 */
const renderAbbrLookup = (abbreviations: AbbrEntry[]): string => {
  if (!abbreviations.length) return "";
  return `
    <details class="study-notes abbr-lookup">
      <summary>縮寫速查 <span>${abbreviations.length} 個</span></summary>
      <div class="note-table-wrap">
        <table class="note-table">
          <thead>
            <tr><th>縮寫</th><th>全名</th><th>中文</th><th>節點</th></tr>
          </thead>
          <tbody>
            ${abbreviations.map((a) => `
              <tr data-abbr-row>
                <td>${escapeHtml(a.term)}</td>
                <td>${escapeHtml(a.full)}</td>
                <td>${escapeHtml(a.zh ?? "—")}</td>
                <td>${escapeHtml(a.nodes.join("、"))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </details>
  `;
};

/** 學習頁的工具列與節點目錄。搜尋與展開收合都由 main.ts 就地操作 DOM，不整頁重繪。 */
const renderStudyTools = (
  cert: Cert,
  readCount: number,
  totalNodes: number,
  showCram: boolean,
): string => {
  const multiLevel = getLevels(cert).length > 1;
  const chips = getLevels(cert)
    .flatMap((level) => getSubjects(cert, level).map((subject) => ({ level, subject })))
    .map(({ level, subject }) => {
      const topics = getStudyGuide(subject.id)?.topics ?? [];
      if (!topics.length) return "";
      // 兩個級別都有科目時，光看「科目1」分不出初級還是中級。
      const groupLabel = multiLevel ? `${levelName(level)}${subject.code}` : subject.code;
      return `
        <div class="study-toc-group">
          <span class="study-toc-label">${escapeHtml(groupLabel)}</span>
          ${topics.map((t) => `
            <button class="study-toc-chip" data-study-jump="${nodeAnchorId(t.code)}"
                    title="${escapeHtml(t.title)}">${escapeHtml(t.code)}</button>
          `).join("")}
        </div>
      `;
    })
    .join("");
  return `
    <div class="study-tools">
      <div class="study-tools-row">
        <input class="study-search" type="search" data-study-search
               placeholder="搜尋節點、縮寫或內文…" aria-label="搜尋 AIoT 備考整理">
        <span class="study-search-count" data-study-count role="status" aria-live="polite"></span>
      </div>
      <div class="study-tools-row">
        <span class="study-read-count" data-study-read-count>已讀 ${readCount} / ${totalNodes}</span>
        <button class="study-action" data-study-action="expand">全部展開</button>
        <button class="study-action" data-study-action="collapse">全部收合</button>
        ${showCram ? `<button class="study-action" data-study-action="cram" aria-pressed="false">考前速記</button>` : ""}
      </div>
      <nav class="study-toc" aria-label="節點目錄">${chips}</nav>
    </div>
  `;
};

export type AbbrEntry = { term: string; full: string; zh?: string; nodes: string[] };

export type StudyViewData = {
  notes?: StudyNotesBySubject;
  examOverviews?: Partial<Record<Cert, StudyNoteSection[]>>;
  /** 各證照的縮寫速查資料，與筆記同屬 lazy chunk；沒有資料的證照就不渲染這張表。 */
  abbreviations?: Partial<Record<Cert, AbbrEntry[]>>;
  /** 已讀的節點碼。 */
  readNodes?: ReadonlySet<string>;
};

export const renderStudyView = (
  studyNotes?: StudyNotesBySubject,
  examOverviews?: Partial<Record<Cert, StudyNoteSection[]>>,
  extra: Pick<StudyViewData, "abbreviations" | "readNodes"> = {},
): string => {
  const { abbreviations, readNodes = new Set<string>() } = extra;
  const sections = certs.map((cert) => {
    const levelsHtml = getLevels(cert.id).map((level) => {
    const subjectsHtml = getSubjects(cert.id, level)
      .map((s) => {
        const guide = getStudyGuide(s.id, studyNotes);
        // 標籤要對得上出處：五科是官方學習指引的重構，AIoT 是備考 syllabus 的整理。
        const isAiot = s.cert === "aiot";
        const notesLabel = isAiot ? "備考整理" : "學習指引整理";
        const topicCounts = getTopicCounts(s.id);
        const topics = (guide?.topics ?? [])
          .map((t) => `
            <div class="study-topic" id="${nodeAnchorId(t.code)}" data-node="${escapeHtml(t.code)}">
              <h4>${escapeHtml(t.code)}　${escapeHtml(t.title)}</h4>
              <ul class="study-contents">${t.contents.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
              ${renderNodeActions(s.id, t.code, topicCounts, readNodes)}
              ${renderStudyNotes(t.notes, { label: notesLabel, collapsibleSections: true })}
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
        <h3 class="study-level-name">${levelName(level)}</h3>
        ${subjectsHtml}
      </section>
    `;
    }).join("");
    // 工具列與節點目錄目前只給 AIoT——五科的 40 個主題維持原樣，待這邊驗證後再推。
    const certTopics = getLevels(cert.id)
      .flatMap((level) => getSubjects(cert.id, level))
      .flatMap((subject) => getStudyGuide(subject.id, studyNotes)?.topics ?? []);
    const nodeCodes = certTopics.map((t) => t.code);
    // 「考前速記」靠 formula／confuse 兩節篩選；該證照的筆記若沒有這兩種節，
    // 按了會整片空白，因此依資料決定要不要出這顆按鈕。
    const showCram = certTopics.some((t) =>
      (t.notes ?? []).some((section) => ["formula", "confuse"].includes(noteSectionKey(section.heading))),
    );
    const tools = nodeCodes.length === 0 ? "" : renderStudyTools(
      cert.id,
      nodeCodes.filter((c) => readNodes.has(c)).length,
      nodeCodes.length,
      showCram,
    ) + renderAbbrLookup(abbreviations?.[cert.id] ?? []);
    return `
      <section class="study-cert" data-cert-section="${escapeHtml(cert.id)}">
        <h2>${escapeHtml(cert.name)}</h2>
        ${tools}
        ${renderStudyNotes(examOverviews?.[cert.id], { label: "備考總整理" })}
        ${levelsHtml}
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
const renderExamChoice = (
  qid: string, choice: Choice, selected: boolean, figure?: QuestionFigure,
): string => {
  const classes = ["choice"];
  if (selected) classes.push("selected");
  return `
    <button class="${classes.join(" ")}" data-qid="${escapeHtml(qid)}" data-choice="${choice.id}">
      <span class="choice-id">${choice.id}</span>
      ${renderChoiceBody(choice, figure)}
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
      ${renderSourceNote(q)}
      <p class="prompt"><span class="qnum">${i + 1}.</span> ${escapeHtml(q.prompt)}</p>
      ${renderFigures(q.figures)}
      <div class="choices">${q.choices.map((c) => renderExamChoice(q.id, c, answers[q.id] === c.id, q.choiceFigures?.[c.id])).join("")}</div>
    </section>`).join("");
  return `
    <header class="topbar exam-bar">
      <button class="back" data-nav="quit">結束</button>
      <!-- 已作答數只在使用者點選項時變動，是對操作的直接回饋，用 polite 播報剛好。 -->
      <span class="progress" aria-live="polite" aria-atomic="true">已作答 <span class="answered-count">${answered}</span> / ${questions.length}</span>
      <!-- 計時器每秒就地更新（main.ts 的 startTimer）。role="timer" 依規範隱含
           aria-live="off"——刻意不逐秒播報，否則會蓋掉正在朗讀的題目；
           改由 main.ts 在剩 10/5/1 分鐘等門檻時寫入下方的 .sr-live 區域。 -->
      <span class="timer" role="timer" aria-label="剩餘時間">${timeText}</span>
      <button class="submit" data-nav="submit">交卷</button>
    </header>
    <p class="sr-live" role="status" aria-live="assertive" aria-atomic="true"></p>
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
      return `<div class="${classes.join(" ")}"><span class="choice-id">${c.id}</span>${renderChoiceBody(c, q.choiceFigures?.[c.id])}</div>`;
    }).join("");
    const yours = mine ? `你的作答：${mine}` : "未作答";
    return `
      <section class="exam-q">
        ${renderSourceNote(q)}
        <p class="prompt"><span class="qnum">${i + 1}.</span> ${escapeHtml(q.prompt)}</p>
        ${renderFigures(q.figures)}
        <div class="choices">${choices}</div>
        <p class="your-answer">${escapeHtml(yours)}</p>
        <div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>
        ${q.choiceExplanations ? renderChoiceExplanations(q) : ""}
        ${renderDecisionBoundary(q)}
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
