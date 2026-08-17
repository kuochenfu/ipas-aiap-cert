import { escapeHtml } from "./escape";
import type { Choice, QuestionFigure } from "../data/types";
import type { Subject } from "../domain/catalog";
import { getSubjectsByLevel, subjects } from "../domain/catalog";
import { getBankStats } from "../data/index";
import { getStudyGuide } from "../data/studyGuide";
import type { Level } from "../data/types";
import type { Question } from "../data/types";
import type { StudyNoteItem, StudyNoteSection, StudyNotesBySubject } from "../data/types";
import type { DrillFilter } from "../domain/drill";

export type BankStats = { total: number; pastExam: number; generated: number };
export type DrillCounts = Record<DrillFilter, number>;
export type DrillControls = {
  filter: DrillFilter;
  counts: DrillCounts;
  total: number;
  /** 題庫已依評鑑節點分類時才顯示「節點表現」入口（未分類的題庫看了也沒意義）。 */
  hasTopics?: boolean;
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
      ${q.topic && /^L\d{5} /.test(q.topic) ? `<span class="q-topic">${escapeHtml(q.topic)}</span>` : ""}
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
        <p class="prompt"><span class="qnum">${i + 1}.</span> ${escapeHtml(q.prompt)}</p>
        ${renderFigures(q.figures)}
        <div class="choices">${choices}</div>
        <p class="your-answer">${escapeHtml(yours)}</p>
        <div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>
        ${q.choiceExplanations ? renderChoiceExplanations(q) : ""}
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
