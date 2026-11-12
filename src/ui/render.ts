import { escapeHtml } from "./escape";
import { renderStudyVisual } from "./studyVisual";
import { renderLectureItems } from "./lecture";
import { countStudyVisuals } from "../domain/studyVisuals";
import { groupReaderSections } from "../domain/readerSections";
import type { Choice, QuestionFigure } from "../data/types";
import type { Subject } from "../domain/catalog";
import { certs, getLevels, getSubjects, subjects } from "../domain/catalog";
import { getBankStats, getTopicCounts } from "../data/index";
import { getStudyGuide } from "../data/studyGuide";
import type { Cert, Level } from "../data/types";
import type { CodeCard, CodePipeline, CodeSheet } from "../data/codeSheet.types";
import type { Question } from "../data/types";
import type {
  ReadingLink, StudyNoteItem, StudyNoteSection, StudyNoteTable, StudyNotesBySubject, StudyTopic,
} from "../data/types";
import type { Confidence, DrillFilter } from "../domain/drill";
import { CONCEPT_MIN_SAMPLE } from "../domain/diagnostics";
import type { Calibration, ConceptRow, Diagnostics, ErrorRow, MetaStatRow } from "../domain/diagnostics";
import { isTopicClassified, topicMatchesGuideCode } from "../domain/assessmentTopics";
import { examRules } from "../domain/exam";

// 介面圖示一律是內嵌 SVG（同一種線寬），不用 ← → ✓ 這類文字符號充當圖示。
const icon = (paths: string, className = "icon"): string =>
  `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const chevronLeftIcon = icon(`<path d="m15 18-6-6 6-6"></path>`);
const chevronRightIcon = icon(`<path d="m9 18 6-6-6-6"></path>`);
const checkIcon = icon(`<path d="M20 6 9 17l-5-5"></path>`);
const searchIcon = icon(`<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>`);

export type BankStats = { total: number; pastExam: number; generated: number; studyGuide: number };
export type DrillCounts = Record<DrillFilter, number>;
export type DrillControls = {
  filter: DrillFilter;
  counts: DrillCounts;
  total: number;
  /** 題庫已依評鑑節點分類時才顯示診斷入口（未分類的題庫看了也沒意義）。 */
  hasTopics?: boolean;
  /** 題庫帶命題後設資料時，診斷頁多出認知層級／題型／錯誤類型三張表，入口改名。 */
  hasMeta?: boolean;
  /**
   * 校準模式（作答前先標記信心）。三個欄位分別是：開關、這一題已標記但還沒作答的信心、
   * 以及已作答的那次記下的信心。收成一個物件是因為它們永遠一起出現、也一起消失。
   */
  confidence?: { mode: boolean; pending?: Confidence; recorded?: Confidence };
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
    <button class="${classes.join(" ")}" data-choice="${choice.id}" aria-pressed="${view.selected}">
      <span class="choice-id">${choice.id}</span>
      ${renderChoiceBody(choice, figure)}
    </button>
  `;
};

// 順序即畫面上的按鈕順序。「推薦」排在「全部」之後——它是主要的複習入口，
// 但不搶第一個位置，因為第一次讀完整份題庫時原序才是對的。
const drillFilterLabels: Record<DrillFilter, string> = {
  all: "全部",
  recommended: "推薦",
  wrong: "錯題",
  unanswered: "未答",
};

const confidenceLabels: Record<Confidence, string> = {
  sure: "有把握",
  unsure: "不確定",
};

/**
 * 作答前的信心標記（Calibration）。
 *
 * 刻意放在選項**之上**：先下注、再作答，事後才標記沒有校準意義。
 * 只在校準模式開啟且尚未揭曉時出現，其餘情況完全不佔版面。
 */
const renderConfidencePicker = (pending?: Confidence): string => `
  <div class="confidence-picker" aria-label="作答前先標記信心">
    <span class="confidence-hint">先下注：</span>
    ${(Object.keys(confidenceLabels) as Confidence[]).map((key) => `
      <button class="confidence-btn ${pending === key ? "active" : ""}"
              data-confidence="${key}" aria-pressed="${pending === key}">${confidenceLabels[key]}</button>
    `).join("")}
  </div>
`;

/**
 * 揭曉後的校準回饋。真正有資訊量的是**不一致**的兩格：
 * 有把握卻答錯＝過度自信，不確定卻答對＝低估自己。一致時只做平淡確認。
 */
const renderCalibrationNote = (recorded: Confidence | undefined, correct: boolean): string => {
  if (!recorded) return "";
  const text = recorded === "sure"
    ? (correct ? "你標記「有把握」而且答對了，信心與實力相符。" : "你標記「有把握」卻答錯了——這類題目最值得回頭看，因為你不知道自己不知道。")
    : (correct ? "你標記「不確定」但答對了。確認一下是真的懂，還是猜中的。" : "你標記「不確定」而且答錯了，至少信心是準的——把它加進複習清單。");
  const tone = recorded === "sure" && !correct ? "is-overconfident" : "";
  return `<p class="calibration-note ${tone}">${escapeHtml(text)}</p>`;
};

// 篩選列是刷題的主導覽，留在題目上方；其餘不常用的工具收進題號列右側的「工具」選單，
// 手機上題目才不會被十顆按鈕擠到第一屏之外。
const renderDrillFilters = ({ filter, counts }: DrillControls): string => `
  <div class="drill-controls">
    <div class="drill-filters" aria-label="刷題篩選">
      ${(Object.keys(drillFilterLabels) as DrillFilter[]).map((key) => `
        <button class="drill-filter ${filter === key ? "active" : ""}" data-filter="${key}" aria-pressed="${filter === key}">
          <span>${drillFilterLabels[key]}</span>
          <strong>${counts[key]}</strong>
        </button>
      `).join("")}
    </div>
    ${filter === "recommended"
      ? `<p class="drill-filter-hint">推薦順序：先複習答錯的題目，再做未作答的，最後是到期該重測的。</p>`
      : ""}
  </div>
`;

const renderDrillTools = ({ total, hasTopics, hasMeta, confidence }: DrillControls): string => `
  <details class="drill-tools">
    <summary>工具${confidence?.mode ? `<span class="drill-tools-flag">校準中</span>` : ""}</summary>
    <div class="drill-tools-panel">
      <div class="drill-jump">
        <label class="drill-jump-label">
          跳至第
          <input class="drill-jump-input" type="number" inputmode="numeric" min="1" max="${total}"
                 aria-label="跳至第幾題（1 到 ${total}）">
          題
        </label>
        <button class="drill-jump-go" data-nav="jump">前往</button>
      </div>
      ${confidence
        ? `<div class="drill-tool">
             <button class="drill-confidence ${confidence.mode ? "active" : ""}" data-nav="toggle-confidence"
                     aria-pressed="${confidence.mode}">校準模式：${confidence.mode ? "開" : "關"}</button>
             <p class="drill-tool-hint">作答前先標記「有把握／不確定」，學習診斷會比較兩者的實際答對率。</p>
           </div>`
        : ""}
      ${hasTopics ? `<button class="drill-topics" data-nav="topics">${hasMeta ? "學習診斷" : "節點表現"}${chevronRightIcon}</button>` : ""}
      <button class="drill-reset" data-nav="drill-reset">重置本科進度…</button>
      <p class="drill-keys">鍵盤：A–D 作答・← → 換題</p>
    </div>
  </details>
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

// 匯出給 scripts/choice-length/check.ts 使用：改題時讓子代理看到畫面上實際會切出的解析。
export const explanationSegmentForChoice = (explanation: string, choiceId: string): string | undefined => {
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
    return "這是本題正解；判斷依據見上方詳解。";
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
    <button class="study-entry" data-nav="study">
      <span class="study-entry-title">學習主題</span>
      <span class="study-entry-sub">各科重點筆記、考前速記與延伸閱讀</span>
    </button>
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
      <button class="back" data-nav="home">${chevronLeftIcon}返回</button>
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
      <button class="back" data-nav="back">${chevronLeftIcon}返回</button>
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
  /** 模擬考的作答時間；省略時不寫分鐘數。 */
  durationMinutes?: number;
};

// 及格線換算成題數：考生在考場上算的是「還能錯幾題」，不是分數。
const PASS_CORRECT = Math.ceil(examRules.passScore / examRules.pointsPerQuestion);

export const renderModePicker = ({
  subjectName,
  drillCount,
  drillProgressText,
  practice,
  mockExam = true,
  durationMinutes,
}: ModePickerView): string => `
  <header class="topbar"><button class="back" data-nav="back">${chevronLeftIcon}返回</button><h1>${escapeHtml(subjectName)}</h1></header>
  <main class="mode-picker">
    ${mockExam
      ? `<button class="mode-card" data-mode="exam">
           <h2>模擬考試</h2>
           <p>${examRules.totalQuestions} 題・${durationMinutes ? `限時 ${durationMinutes} 分鐘` : "計時"}・${examRules.passScore} 分及格</p>
           <p class="mode-card-rule">最多可失分 ${examRules.maxWrongToPass} 題（答對 ${PASS_CORRECT} 題即及格）</p>
         </button>`
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
      ${renderCalibrationNote(drillControls?.confidence?.recorded, selected === q.answer)}
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
      <button class="back" data-nav="quit">${chevronLeftIcon}結束</button>
      <span class="progress">第 ${index + 1} / ${total} 題</span>
      ${drillControls ? renderDrillTools(drillControls) : `<span class="timer">${timeText}</span>`}
    </header>
    <main class="question">
      ${drillControls ? renderDrillFilters(drillControls) : ""}
      ${q.topic && isTopicClassified(q.topic) ? `<span class="q-topic">${escapeHtml(q.topic)}</span>` : ""}
      ${renderSourceNote(q)}
      <p class="prompt">${escapeHtml(q.prompt)}</p>
      ${renderFigures(q.figures)}
      ${drillControls?.confidence?.mode && !reveal
        ? renderConfidencePicker(drillControls.confidence.pending)
        : ""}
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
    <button class="back" data-nav="quit">${chevronLeftIcon}結束</button>
    <span class="progress">刷題練習</span>
    ${renderDrillTools(controls)}
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
/**
 * 診斷表共用的一列：已作答 / 總題數 ＋ 答對率長條。
 * 與節點表格刻意共用 `.topic-*` 的樣式，四張表掃視起來才是同一種東西。
 */
const renderMetaStatRow = (row: MetaStatRow): string => {
  const rate = row.answered > 0 ? Math.round((row.correct / row.answered) * 100) : null;
  const bar = rate === null
    ? `<span class="topic-bar-empty">尚未作答</span>`
    : `<span class="topic-bar" style="--rate:${rate}%"><span class="topic-bar-fill"></span></span>`;
  return `
    <tr>
      <td class="topic-name">${escapeHtml(row.label)}</td>
      <td class="topic-progress">${row.answered} / ${row.total}</td>
      <td class="topic-rate">${rate === null ? "—" : `${row.correct}／${row.answered}　${rate}%`}</td>
      <td class="topic-visual">${bar}</td>
    </tr>`;
};

const renderMetaStatTable = (caption: string, header: string, rows: MetaStatRow[]): string =>
  rows.length === 0 ? "" : `
    <h2 class="diag-heading">${escapeHtml(caption)}</h2>
    <table class="topic-table">
      <thead><tr><th>${escapeHtml(header)}</th><th>已作答</th><th>答對率</th><th></th></tr></thead>
      <tbody>${rows.map(renderMetaStatRow).join("")}</tbody>
    </table>`;

/**
 * 錯誤類型分布。刻意不畫成圓餅圖——使用者要的不是比例，是「這類錯誤該怎麼辦」，
 * 所以每一列都帶著含義與下一步，且下一步一律指向站上已經存在的東西。
 */
const renderErrorRows = (errors: ErrorRow[], unclassifiedWrong: number): string => {
  if (errors.length === 0) {
    return `<p class="diag-empty">目前還沒有可分析的錯題。答錯時，本站會依該選項的干擾類型判斷你是哪一種理解缺口。</p>`;
  }
  const total = errors.reduce((n, row) => n + row.count, 0);
  const items = errors.map((row) => `
    <li class="diag-error">
      <div class="diag-error-head">
        <span class="diag-error-label">${escapeHtml(row.label)}</span>
        <span class="diag-error-class">${escapeHtml(row.errorClass)}</span>
        <strong class="diag-error-count">${row.count} 題</strong>
      </div>
      <p class="diag-error-meaning">${escapeHtml(row.meaning)}</p>
      <p class="diag-error-advice">下一步：${escapeHtml(row.advice)}</p>
    </li>`).join("");
  const note = unclassifiedWrong > 0
    ? `<p class="topic-note">另有 ${unclassifiedWrong} 題錯題沒有干擾類型標註，未計入上表。</p>`
    : "";
  return `
    <p class="lead">已分析 ${total} 題錯題，依你選到的那個選項是「用什麼方式誘答」分類。</p>
    <ul class="diag-errors">${items}</ul>
    ${note}`;
};

/**
 * 校準表。沒有任何標記時整段不顯示，只留一行說明怎麼開啟——
 * 一張全空的表會讓人以為功能壞了。
 */
const renderCalibration = (calibration: Calibration): string => {
  if (calibration.rows.length === 0) {
    return `
      <h2 class="diag-heading">信心校準</h2>
      <p class="diag-empty">尚無資料。在刷題頁開啟「校準模式」後，作答前先標記「有把握／不確定」，這裡會比較兩者的實際答對率。</p>`;
  }
  const body = calibration.rows.map((row) => {
    const rate = Math.round((row.correct / row.answered) * 100);
    return `
      <tr>
        <td class="topic-name">${escapeHtml(row.label)}</td>
        <td class="topic-progress">${row.answered} 題</td>
        <td class="topic-rate">${row.correct}／${row.answered}　${rate}%</td>
        <td class="topic-visual"><span class="topic-bar" style="--rate:${rate}%"><span class="topic-bar-fill"></span></span></td>
      </tr>`;
  }).join("");
  const sure = calibration.rows.find((row) => row.key === "sure");
  const unsure = calibration.rows.find((row) => row.key === "unsure");
  // 兩者都有資料時才下判讀——只有一格時比較不出東西。
  let verdict = "";
  if (sure && unsure) {
    const gap = (sure.correct / sure.answered) - (unsure.correct / unsure.answered);
    verdict = gap >= 0.2
      ? "信心與實力相符：你有把握時確實比較會答對。"
      : "兩者的答對率接近，代表你目前分不太出自己會不會——先練「有把握卻答錯」的那些題。";
  }
  const note = calibration.unmarked > 0
    ? `<p class="topic-note">另有 ${calibration.unmarked} 題已作答但未標記信心，未計入。</p>`
    : "";
  return `
    <h2 class="diag-heading">信心校準</h2>
    <table class="topic-table">
      <thead><tr><th>作答前的標記</th><th>題數</th><th>答對率</th><th></th></tr></thead>
      <tbody>${body}</tbody>
    </table>
    ${verdict ? `<p class="diag-verdict">${escapeHtml(verdict)}</p>` : ""}
    ${note}`;
};

/**
 * 最弱概念。只顯示前幾名——列出全部會變成另一張大表，而使用者要的是「先看哪裡」。
 * 比對是啟發式的，這件事必須寫在表下，否則會被當成精確評分。
 */
const CONCEPT_ROWS = 8;

const renderConceptWeakness = (rows: ConceptRow[]): string => {
  if (rows.length === 0) {
    return `
      <h2 class="diag-heading">概念表現</h2>
      <p class="diag-empty">同一個概念累積作答滿 ${CONCEPT_MIN_SAMPLE} 題後，這裡會列出答對率最低的概念。</p>`;
  }
  const body = rows.slice(0, CONCEPT_ROWS).map((row) => {
    const rate = Math.round((row.correct / row.answered) * 100);
    return `
      <tr>
        <td class="topic-name">${escapeHtml(row.label)}</td>
        <td class="topic-progress">${row.answered} 題</td>
        <td class="topic-rate">${row.correct}／${row.answered}　${rate}%</td>
        <td class="topic-visual"><span class="topic-bar" style="--rate:${rate}%"><span class="topic-bar-fill"></span></span></td>
      </tr>`;
  }).join("");
  return `
    <h2 class="diag-heading">最弱的概念</h2>
    <table class="topic-table">
      <thead><tr><th>概念</th><th>已作答</th><th>答對率</th><th></th></tr></thead>
      <tbody>${body}</tbody>
    </table>
    <p class="topic-note">概念以關鍵詞比對題幹與命題標註取得，屬<strong>建議性</strong>分類：題幹提到但不是考點的詞也可能被算進去，一題也可能同時算進數個概念。請當成「先看哪裡」的線索，而不是精確的能力評分。</p>`;
};

export const renderTopicStats = (
  subjectName: string, rows: TopicStatRow[], backLabel: string,
  diagnostics?: Diagnostics,
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
  // 診斷各表只有在題庫帶 meta 時才有資料；沒有就只呈現節點表格，標題也退回原本的名字。
  const extra = diagnostics
    ? `
      ${renderMetaStatTable("認知層級表現", "認知層級", diagnostics.levels)}
      ${renderMetaStatTable("題型表現", "題型原型", diagnostics.archetypes)}
      <h2 class="diag-heading">錯誤類型</h2>
      ${renderErrorRows(diagnostics.errors, diagnostics.unclassifiedWrong)}
      ${renderConceptWeakness(diagnostics.conceptWeakness)}
      ${renderCalibration(diagnostics.calibration)}`
    : "";
  return `
    <header class="topbar">
      <button class="back" data-nav="back-play">${chevronLeftIcon}${escapeHtml(backLabel)}</button>
      <h1>${diagnostics ? "學習診斷" : "節點表現"}</h1>
    </header>
    <main class="topic-stats">
      <p class="lead">${escapeHtml(subjectName)}　已作答 ${answered} 題，答對 ${correct} 題</p>
      ${diagnostics ? `<h2 class="diag-heading">評鑑節點表現</h2>` : ""}
      <table class="topic-table">
        <thead><tr><th>評鑑內容節點</th><th>已作答</th><th>答對率</th><th></th></tr></thead>
        <tbody>${body}</tbody>
      </table>
      ${extra}
      <p class="topic-note">節點依官方《評鑑內容範圍參考》分類；「已作答」為本科目目前的刷題進度。認知層級與題型為每題標註的後設資料；錯誤類型需要逐選項的干擾類型標註，目前只有新題庫具備。</p>
    </main>
  `;
};

export type ResultView = {
  subjectId: string;
  score: number;
  correct: number;
  /** 失分題數＝答錯＋未作答（與 scoreExam 的 wrong 相同口徑）。 */
  missed: number;
  unanswered: number;
  passed: boolean;
  topics: { topic: string; total: number; correct: number }[];
};

/**
 * 成績頁。主角不是分數本身，而是「離及格線多遠」——iPAS 的規則是最多失分 15 題，
 * 所以用 50 格的作答帶把答對、答錯、未作答排開，並在第 35 格畫出及格線。
 * 節點表依答對率由弱到強排序，每列都能直接進入該節點的刷題。
 */
export const renderResult = (
  { subjectId, score, correct, missed, unanswered, passed, topics }: ResultView,
): string => {
  const total = correct + missed;
  const answeredWrong = missed - unanswered;
  const gap = PASS_CORRECT - correct;
  const verdictLine = passed
    ? `比及格線多答對 ${correct - PASS_CORRECT} 題；失分額度 ${examRules.maxWrongToPass} 題，這次用了 ${missed} 題。`
    : `差 ${gap} 題及格：最多只能失分 ${examRules.maxWrongToPass} 題，這次失分 ${missed} 題。`;
  const cells = [
    ...Array.from({ length: correct }, () => "is-correct"),
    ...Array.from({ length: answeredWrong }, () => "is-wrong"),
    ...Array.from({ length: unanswered }, () => "is-skip"),
  ].map((kind) => `<span class="strip-cell ${kind}"></span>`).join("");
  const stripLabel = `答對 ${correct} 題、答錯 ${answeredWrong} 題、未作答 ${unanswered} 題；及格需答對 ${PASS_CORRECT} 題`;
  const rate = (t: { total: number; correct: number }) => (t.total ? t.correct / t.total : 0);
  const rows = [...topics]
    .sort((a, b) => rate(a) - rate(b) || b.total - a.total)
    .map((t) => {
      const code = t.topic.split(" ")[0];
      const action = isTopicClassified(t.topic)
        ? `<button class="node-drill" data-topic-drill="${escapeHtml(subjectId)}|${escapeHtml(code)}">練這個節點</button>`
        : "";
      return `
        <tr>
          <td class="topic-name">${escapeHtml(t.topic)}</td>
          <td class="topic-rate">${t.correct} / ${t.total}</td>
          <td class="topic-action">${action}</td>
        </tr>`;
    })
    .join("");
  return `
    <header class="topbar"><button class="back" data-nav="home">${chevronLeftIcon}回首頁</button><h1>成績</h1></header>
    <main class="result">
      <section class="result-verdict ${passed ? "is-pass" : "is-fail"}">
        <p class="score">${score} 分<span class="score-verdict">${passed ? "及格" : "不及格"}</span></p>
        <p class="result-line">${verdictLine}</p>
      </section>
      <figure class="answer-strip">
        <div class="strip" role="img" aria-label="${stripLabel}">
          <div class="strip-cells">${cells}</div>
          <span class="strip-line" style="--line:${(PASS_CORRECT / total) * 100}%" aria-hidden="true"></span>
        </div>
        <figcaption class="strip-legend">
          <span class="legend-item is-correct">答對 ${correct}</span>
          <span class="legend-item is-wrong">答錯 ${answeredWrong}</span>
          <span class="legend-item is-skip">未作答 ${unanswered}</span>
          <span class="legend-item is-line">及格線：答對 ${PASS_CORRECT} 題</span>
        </figcaption>
      </figure>
      <div class="result-actions">
        <button class="submit" data-nav="review">逐題檢討</button>
      </div>
      ${missed > 0
        ? `<p class="topic-note">這次失分的 ${missed} 題已加入錯題本；回到刷題練習選「錯題」就能複習。</p>`
        : ""}
      <h2 class="diag-heading">各節點表現（由弱到強）</h2>
      <table class="topic-table result-table">
        <thead><tr><th>評鑑內容節點</th><th>答對</th><th><span class="sr-only">動作</span></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
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
  if (item.visual) return renderStudyVisual(item.text, item.visual);
  if (item.table) return renderNoteTable(item.text, item.table);
  if (item.formula) return renderNoteFormula(item.text, item.formula);
  if (item.flow) return renderNoteFlow(item.text, item.flow);
  return `<span class="note-text">${escapeHtml(item.text)}</span>`;
};

const renderNoteItems = (items: StudyNoteItem[]): string => `
  <ul>
    ${items.map((item) => `
      <li${item.table || item.formula || item.flow || item.visual ? ` class="note-block"` : ""}>
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

const noteSectionKey = (heading: string): string =>
  heading.startsWith("補充 C｜") ? "learning" : NOTE_SECTION_KEYS[heading] ?? "other";

const renderNoteSectionBody = (section: StudyNoteSection, headingTag: "h2" | "h3" | "h5", displayHeading = section.heading, lecture = false): string => `
  <div class="study-note-heading">
    <${headingTag} class="study-note-title">${escapeHtml(displayHeading)}</${headingTag}>
    <button class="tts-button" data-tts-section aria-label="朗讀 ${escapeHtml(section.heading)}" title="朗讀" aria-pressed="false">
      ${speakerIcon}
    </button>
  </div>
  ${lecture ? renderLectureItems(section.items, renderNoteBody) : renderNoteItems(section.items)}
`;

export const renderStudyLoading = (): string => `
  <header class="topbar">
    <button class="back" data-nav="home">${chevronLeftIcon}返回</button>
    <h1>學習主題</h1>
  </header>
  <main class="study">
    <p class="lead">正在載入學習筆記…</p>
  </main>
`;

// ── 學習主題頁：索引 → 單節點閱讀器 ─────────────────────────
// 一個評鑑節點＝一章。舊版把兩張證照、七科、所有節點攤在同一頁（收合後仍有一萬兩千像素），
// 筆記又包了三層 <details>；手機上讀一節要先找、再展開兩次，讀完也不知道下一節在哪。
// 現在索引只放一張證照的節點清單與「接著讀」，點進去才是那一節的完整筆記。


/** 閱讀器的頁面：一個評鑑節點、證照層級的「備考總整理」與「縮寫速查」，或科目層級的「程式速查」。 */
export type StudyPageRef =
  | { kind: "node"; subjectId: string; code: string }
  | { kind: "overview" | "abbr"; cert: Cert }
  | { kind: "code"; subjectId: string };

/** data-study-open 的值。節點碼含 `.` 但不含 `|`，科目 id 也不會撞到 overview／abbr／code。 */
export const studyPageKey = (ref: StudyPageRef): string => {
  if (ref.kind === "node") return `${ref.subjectId}|${ref.code}`;
  if (ref.kind === "code") return `code|${ref.subjectId}`;
  return `${ref.kind}|${ref.cert}`;
};

export const parseStudyPageKey = (key: string): StudyPageRef | undefined => {
  const separator = key.indexOf("|");
  if (separator <= 0 || separator === key.length - 1) return undefined;
  const head = key.slice(0, separator);
  const tail = key.slice(separator + 1);
  if (head === "overview" || head === "abbr") {
    return certs.some((cert) => cert.id === tail) ? { kind: head, cert: tail as Cert } : undefined;
  }
  if (head === "code") {
    return subjects.some((subject) => subject.id === tail) ? { kind: "code", subjectId: tail } : undefined;
  }
  return { kind: "node", subjectId: head, code: tail };
};

export type StudyNodeEntry = { subject: Subject; topic: StudyTopic };

/** 一張證照的節點，依級別 → 科目 → 評鑑碼排好；閱讀器的上一節／下一節就沿這個順序走。 */
export const listStudyNodes = (cert: Cert, notes?: StudyNotesBySubject): StudyNodeEntry[] =>
  getLevels(cert)
    .flatMap((level) => getSubjects(cert, level))
    .flatMap((subject) =>
      (getStudyGuide(subject.id, notes)?.topics ?? []).map((topic) => ({ subject, topic })),
    );

const entryKey = (entry: StudyNodeEntry): string => `${entry.subject.id}|${entry.topic.code}`;

/** 兩個級別都有科目時，光看「科目1」分不出初級還是中級。 */
const subjectLabel = (subject: Subject): string =>
  getLevels(subject.cert).length > 1 ? `${levelName(subject.level)}${subject.code}` : subject.code;

/** 標籤要對得上出處：五科是官方學習指引的重構，AIoT 是備考 syllabus 的整理。不要統一成同一個字。 */
const notesLabelFor = (subject: Subject): string =>
  subject.cert === "aiot" ? "備考整理" : "學習指引整理";

/**
 * 節標題前的「3.1」「4.2」是官方學習指引的章節號碼（第 1、2 章是報考資格與職能基準，內容從第 3 章起），
 * 單節點閱讀器一頁只放一個主題，讀者看不到整本書的脈絡，因此在頁首標出對應的章或節。
 * 以節標題的編號推得：同一頁的編號節都屬同一章時標「第 N 章」，只有一個編號節時標「N.M 節」；
 * 沒有編號（AIoT 備考整理）或跨章時不標，不猜。
 */
export const guideChapterLabel = (sections: StudyNoteSection[]): string | undefined => {
  const numbered = sections
    .map((section) => section.heading.match(/^(\d+)\.(\d+)\s/))
    .filter((match): match is RegExpMatchArray => match !== null);
  if (numbered.length === 0) return undefined;
  const chapters = new Set(numbered.map((match) => match[1]));
  if (chapters.size !== 1) return undefined;
  return numbered.length === 1
    ? `學習指引 ${numbered[0][1]}.${numbered[0][2]} 節`
    : `學習指引第 ${numbered[0][1]} 章`;
};

/** 一個學習主題可能涵蓋數個題目節點（五科的 L111 → L11101、L11102…），故以前綴加總。 */
const topicQuestionCount = (counts: Record<string, number>, code: string): number =>
  Object.entries(counts).reduce(
    (sum, [topic, n]) => sum + (topicMatchesGuideCode(topic, code) ? n : 0),
    0,
  );

const noteLeafCount = (sections: StudyNoteSection[] | undefined): number =>
  (sections ?? []).reduce((sum, section) => sum + countNoteLeaves(section.items), 0);

/** 節點底下練過的題目（從「練這一節」的節點限定進度算出）。 */
export type NodePractice = { answered: number; correct: number };

export type StudyResume = { entry: StudyNodeEntry; reason: "last" | "next" | "first" };

/**
 * 「接著讀」要指向哪一節：上次打開但還沒讀完的那節優先；否則從上次那節往後找第一個未讀；
 * 全部讀完時回傳 undefined。沒有任何紀錄時就是第一個未讀節點。
 */
export const pickStudyResume = (
  entries: StudyNodeEntry[],
  readNodes: ReadonlySet<string>,
  lastKey?: string,
): StudyResume | undefined => {
  const lastIndex = lastKey ? entries.findIndex((entry) => entryKey(entry) === lastKey) : -1;
  if (lastIndex >= 0 && !readNodes.has(entries[lastIndex].topic.code)) {
    return { entry: entries[lastIndex], reason: "last" };
  }
  for (let step = 1; step <= entries.length; step += 1) {
    const entry = entries[(Math.max(lastIndex, -1) + step) % entries.length];
    if (!readNodes.has(entry.topic.code)) {
      return { entry, reason: lastIndex >= 0 || readNodes.size > 0 ? "next" : "first" };
    }
  }
  return undefined;
};

export type StudyIndexData = {
  cert: Cert;
  notes?: StudyNotesBySubject;
  overviews?: Partial<Record<Cert, StudyNoteSection[]>>;
  /** 各證照的縮寫速查資料，與筆記同屬 lazy chunk；沒有資料的證照就不出這個入口。 */
  abbreviations?: Partial<Record<Cert, AbbrEntry[]>>;
  /** 以科目 id 為鍵的程式速查；同樣只有有資料的科目才出入口。 */
  codeSheets?: Record<string, CodeSheet>;
  /** 已讀的節點碼。 */
  readNodes?: ReadonlySet<string>;
  /** 上次打開的節點（studyPageKey）。 */
  lastNode?: string;
  /** 以 `科目id|節點碼` 為鍵的練題成績。 */
  practice?: Record<string, NodePractice>;
  /** 從閱讀器回來時保留的搜尋字。 */
  query?: string;
};

const renderPracticeMeta = (practice: NodePractice | undefined): string =>
  practice && practice.answered > 0 ? `・練過 ${practice.answered} 題答對 ${practice.correct}` : "";

const renderStudyNodeRow = (
  entry: StudyNodeEntry,
  questionCount: number,
  read: boolean,
  practice: NodePractice | undefined,
): string => {
  const sections = entry.topic.notes?.length ?? 0;
  const meta = [
    sections > 0 ? `${sections} 節筆記` : "尚無筆記",
    ...(countStudyVisuals(entry.topic.notes) ? [`${countStudyVisuals(entry.topic.notes)} 張圖解`] : []),
    questionCount > 0 ? `${questionCount} 題` : "尚無題目",
  ].join("・") + renderPracticeMeta(practice);
  return `
    <li data-node="${escapeHtml(entry.topic.code)}">
      <button class="study-node${read ? " is-read" : ""}" data-study-open="${escapeHtml(entryKey(entry))}">
        <span class="node-code">${escapeHtml(entry.topic.code)}</span>
        <span class="study-node-text">
          <span class="study-node-title">${escapeHtml(entry.topic.title)}</span>
          <span class="study-node-meta">${escapeHtml(meta)}</span>
        </span>
        <span class="study-node-state">${read ? `${checkIcon}<span class="sr-only">已讀</span>` : ""}</span>
      </button>
    </li>
  `;
};

const renderStudyResume = (
  resume: StudyResume | undefined,
  readCount: number,
  total: number,
): string => {
  const percent = total ? Math.round((readCount / total) * 100) : 0;
  const progress = `
    <div class="study-progress">
      <span class="study-progress-text">已讀 <strong>${readCount}</strong> / ${total} 個節點</span>
      <span class="study-progress-bar" aria-hidden="true"><span style="width: ${percent}%"></span></span>
    </div>
  `;
  if (!resume) {
    return `
      <section class="study-resume" aria-label="閱讀進度">
        ${progress}
        <p class="study-resume-done">${total} 個節點都讀過了。考前用下面的搜尋直接查關鍵字，或點任一節重讀。</p>
      </section>
    `;
  }
  const { entry, reason } = resume;
  const verb = reason === "last" ? "接著讀" : reason === "first" ? "開始讀" : "讀下一節";
  const sections = entry.topic.notes?.length ?? 0;
  return `
    <section class="study-resume" aria-label="閱讀進度">
      ${progress}
      <button class="study-resume-card" data-study-open="${escapeHtml(entryKey(entry))}">
        <span class="study-resume-text">
          <span class="study-resume-title"><span class="node-code">${escapeHtml(entry.topic.code)}</span>${escapeHtml(entry.topic.title)}</span>
          <span class="study-resume-meta">${escapeHtml(subjectLabel(entry.subject))}・${escapeHtml(entry.subject.name)}${sections ? `・${sections} 節筆記` : ""}</span>
        </span>
        <span class="study-resume-go">${verb}${chevronRightIcon}</span>
      </button>
    </section>
  `;
};

/** 搜尋時順帶列出命中的縮寫——考前最常查的就是縮寫，不必再點進速查表。 */
export const renderAbbrHits = (abbreviations: AbbrEntry[], query: string, limit = 6): string => {
  const needle = query.trim().toLowerCase();
  if (!needle) return "";
  const hits = abbreviations.filter((a) =>
    `${a.term} ${a.full} ${a.zh ?? ""}`.toLowerCase().includes(needle),
  );
  if (!hits.length) return "";
  const rest = hits.length - limit;
  return `
    <h2 class="study-abbr-hits-title">縮寫</h2>
    <dl class="abbr-hits">
      ${hits.slice(0, limit).map((a) => `
        <div class="abbr-hit">
          <dt>${escapeHtml(a.term)}</dt>
          <dd>${escapeHtml(a.full)}${a.zh ? `<span class="abbr-hit-zh">${escapeHtml(a.zh)}</span>` : ""}<span class="abbr-hit-nodes">${escapeHtml(a.nodes.join("、"))}</span></dd>
        </div>
      `).join("")}
    </dl>
    ${rest > 0 ? `<p class="abbr-hits-more">另有 ${rest} 個縮寫符合，完整清單在「縮寫速查」。</p>` : ""}
  `;
};

export const renderStudyIndex = (data: StudyIndexData): string => {
  const {
    cert, notes, overviews, abbreviations, codeSheets = {}, readNodes = new Set<string>(), lastNode, practice = {}, query = "",
  } = data;
  const certInfo = certs.find((c) => c.id === cert) ?? certs[0];
  const entries = listStudyNodes(cert, notes);
  const readCount = entries.filter((entry) => readNodes.has(entry.topic.code)).length;
  const resume = pickStudyResume(entries, readNodes, lastNode);
  const countsBySubject = new Map<string, Record<string, number>>();
  const countsFor = (subjectId: string) => {
    if (!countsBySubject.has(subjectId)) countsBySubject.set(subjectId, getTopicCounts(subjectId));
    return countsBySubject.get(subjectId)!;
  };

  const groups = getLevels(cert)
    .flatMap((level) => getSubjects(cert, level))
    .map((subject) => {
      const rows = entries.filter((entry) => entry.subject.id === subject.id);
      if (!rows.length) return "";
      const read = rows.filter((entry) => readNodes.has(entry.topic.code)).length;
      return `
        <section class="study-group">
          <div class="study-group-head">
            <h2><span class="study-group-code">${escapeHtml(subjectLabel(subject))}</span>${escapeHtml(subject.name)}</h2>
            <span class="study-group-count">${read} / ${rows.length}</span>
          </div>
          <ol class="study-node-list">
            ${rows.map((entry) => renderStudyNodeRow(
              entry,
              topicQuestionCount(countsFor(subject.id), entry.topic.code),
              readNodes.has(entry.topic.code),
              practice[entryKey(entry)],
            )).join("")}
          </ol>
        </section>
      `;
    })
    .join("");

  const overview = overviews?.[cert];
  const abbrs = abbreviations?.[cert] ?? [];
  const extras = [
    overview?.length
      ? `<button class="study-extra" data-study-open="overview|${escapeHtml(cert)}">
           <span class="study-extra-title">備考總整理</span>
           <span class="study-extra-meta">${overview.length} 節・${noteLeafCount(overview)} 則重點</span>
         </button>`
      : "",
    abbrs.length
      ? `<button class="study-extra" data-study-open="abbr|${escapeHtml(cert)}">
           <span class="study-extra-title">縮寫速查</span>
           <span class="study-extra-meta">${abbrs.length} 個縮寫</span>
         </button>`
      : "",
    ...getLevels(cert).flatMap((level) => getSubjects(cert, level)).map((subject) => {
      const sheet = codeSheets[subject.id];
      if (!sheet) return "";
      return `<button class="study-extra" data-study-open="${escapeHtml(studyPageKey({ kind: "code", subjectId: subject.id }))}">
           <span class="study-extra-title">${escapeHtml(subjectLabel(subject))} ${escapeHtml(sheet.title)}</span>
           <span class="study-extra-meta">${codeCardCount(sheet)} 個函式・${codeSheetExamIds(sheet).length} 題真題程式題</span>
         </button>`;
    }),
  ].filter(Boolean).join("");

  return `
    <header class="topbar">
      <button class="back" data-nav="home">${chevronLeftIcon}返回</button>
      <h1>學習主題</h1>
    </header>
    <main class="study study-index" data-cert-section="${escapeHtml(cert)}">
      <div class="study-cert-switch" role="group" aria-label="選擇證照">
        ${certs.map((c) => `
          <button class="study-cert-tab${c.id === cert ? " active" : ""}" data-study-cert="${escapeHtml(c.id)}"
                  aria-pressed="${c.id === cert}">${escapeHtml(c.name)}</button>
        `).join("")}
      </div>
      ${renderStudyResume(resume, readCount, entries.length)}
      <div class="study-search-row">
        ${searchIcon}
        <input class="study-search" type="search" data-study-search value="${escapeHtml(query)}"
               placeholder="搜尋節點、縮寫或筆記內文" aria-label="搜尋${escapeHtml(certInfo.name)}的學習筆記">
      </div>
      <p class="study-search-count" data-study-count role="status" aria-live="polite"></p>
      <div class="study-abbr-hits" data-study-abbr-hits></div>
      ${extras ? `<div class="study-extras">${extras}</div>` : ""}
      ${groups}
    </main>
  `;
};

/** 白話導讀顯示評鑑細項，避免多個「補充 C」分節籤無法辨識。其他標題沿用原標籤。 */
const sectionChipLabel = (heading: string): string => {
  const learning = /^補充 C｜(L\d{3}(?:\d{2})?)\s+([^：]+)/.exec(heading);
  if (learning) return learning[1].length === 4 ? "學習地圖" : `${learning[1]} ${learning[2]}`;
  return heading.split("｜")[0].trim();
};

const renderReaderSections = (
  sections: StudyNoteSection[], links: ReadingLink[] = [], source: "guide" | "notes" = "notes",
): string => {
  const groups = groupReaderSections(sections, source);
  const showCram = sections.some((section) => ["formula", "confuse"].includes(noteSectionKey(section.heading)));
  const sectionCount = sections.length + (links.length ? 1 : 0);
  const chips = groups.map((group) => `
    <div class="reader-toc-group is-${group.kind}">
      <p class="reader-toc-label">${escapeHtml(group.title)}<span>${group.sections.length}</span></p>
      <div class="reader-toc-list">${group.sections.map(({ section, id }) => `
        <button class="reader-toc-chip" data-study-jump="${id}" data-note-section="${noteSectionKey(section.heading)}">${escapeHtml(sectionChipLabel(section.heading))}</button>
      `).join("")}</div>
    </div>
  `).join("");
  const options = groups.map((group) => `
    <optgroup label="${escapeHtml(group.title)}">${group.sections.map(({ section, id }) => `
      <option value="${id}" data-note-section="${noteSectionKey(section.heading)}">${escapeHtml(sectionChipLabel(section.heading))}</option>
    `).join("")}</optgroup>
  `).join("");
  const toc = sectionCount > 1 || showCram ? `
    <nav class="reader-toc" aria-label="本頁段落">
      <p class="reader-toc-heading">本頁目錄<span>${sectionCount} 個段落</span></p>
      <label class="reader-toc-mobile">跳至段落
        <select class="reader-section-picker" data-reader-section aria-label="跳至本頁段落">
          ${options}${links.length ? `<optgroup label="延伸閱讀"><option value="sec-links" data-note-section="resource">延伸閱讀</option></optgroup>` : ""}
        </select>
      </label>
      <div class="reader-toc-track">${chips}${links.length ? `
        <div class="reader-toc-group is-resources"><p class="reader-toc-label">延伸閱讀</p><div class="reader-toc-list">
          <button class="reader-toc-chip" data-study-jump="sec-links" data-note-section="resource">外部資源</button>
        </div></div>` : ""}</div>
      ${showCram ? `<button class="reader-cram" data-study-action="cram" aria-pressed="false">只看公式與易混淆</button>` : ""}
    </nav>
  ` : "";
  const body = groups.map((group) => `
    <div class="reader-content-group is-${group.kind}">
      <header class="reader-group-head">
        <div class="reader-group-heading"><h2 class="reader-group-title">${escapeHtml(group.title)}<span>${group.sections.length} 節</span></h2><span class="reader-group-source">${escapeHtml(group.source)}</span></div>
        <p>${escapeHtml(group.description)}</p>
      </header>
      ${group.sections.map(({ section, id }) => `
        <section class="study-note-section reader-section" id="${id}" data-note-section="${noteSectionKey(section.heading)}">
          ${renderNoteSectionBody(section, "h3", section.heading.replace(/^補充 C｜/, "").replace(/（非官方講義）$/, ""), group.kind === "lecture")}
        </section>
      `).join("")}
    </div>
  `).join("");
  const linkSection = links.length ? `
    <div class="reader-content-group is-resources">
      <section class="reader-section reader-links" id="sec-links" data-note-section="resource">
        <h2 class="study-note-title">延伸閱讀</h2>
        <ul class="study-links">${links.map(renderReadingLink).join("")}</ul>
      </section>
    </div>
  ` : "";
  return `<div class="reader-layout${toc ? "" : " is-single-column"}">${toc}<div class="reader-body">${body}${linkSection}</div></div>`;
};

const renderTtsRate = (): string => `
  <div class="tts-rate" role="group" aria-label="朗讀語速">
    <span>朗讀語速（各節標題旁的喇叭按鈕）</span>
    <button data-tts-rate="0.9">0.9x</button>
    <button class="active" data-tts-rate="1">1.0x</button>
    <button data-tts-rate="1.2">1.2x</button>
  </div>
`;

export type StudyReaderData = {
  page: StudyPageRef;
  notes?: StudyNotesBySubject;
  overviews?: Partial<Record<Cert, StudyNoteSection[]>>;
  abbreviations?: Partial<Record<Cert, AbbrEntry[]>>;
  codeSheets?: Record<string, CodeSheet>;
  readNodes?: ReadonlySet<string>;
};

const renderReaderTopbar = (crumb: string): string => `
  <header class="topbar reader-topbar">
    <button class="back" data-nav="study">${chevronLeftIcon}目錄</button>
    <span class="reader-crumb">${escapeHtml(crumb)}</span>
  </header>
`;

const renderNodeReader = (
  page: Extract<StudyPageRef, { kind: "node" }>,
  notes: StudyNotesBySubject | undefined,
  readNodes: ReadonlySet<string>,
): string => {
  const subject = subjects.find((s) => s.id === page.subjectId);
  if (!subject) return renderStudyMissing();
  const entries = listStudyNodes(subject.cert, notes);
  const index = entries.findIndex((entry) => entry.subject.id === page.subjectId && entry.topic.code === page.code);
  if (index < 0) return renderStudyMissing();
  const { topic } = entries[index];
  const prev = entries[index - 1];
  const next = entries[index + 1];
  const read = readNodes.has(topic.code);
  const count = topicQuestionCount(getTopicCounts(subject.id), topic.code);
  const sections = topic.notes ?? [];
  const drillKey = `${escapeHtml(subject.id)}|${escapeHtml(topic.code)}`;
  const step = (entry: StudyNodeEntry | undefined, direction: "prev" | "next"): string => {
    if (!entry) return `<span class="dock-step is-placeholder" aria-hidden="true"></span>`;
    const label = `${direction === "prev" ? "上一節" : "下一節"}：${entry.topic.code} ${entry.topic.title}`;
    return `
      <button class="dock-step is-${direction}" data-study-open="${escapeHtml(entryKey(entry))}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">
        ${direction === "prev" ? chevronLeftIcon : ""}<span class="dock-step-code">${escapeHtml(entry.topic.code)}</span>${direction === "next" ? chevronRightIcon : ""}
      </button>
    `;
  };
  const nextLabel = next
    ? `${read ? "" : "標記已讀，"}下一節 ${next.topic.code}`
    : `${read ? "" : "標記已讀，"}回到目錄`;
  return `
    ${renderReaderTopbar(`${subjectLabel(subject)}・${subject.name}`)}
    <main class="study study-reader" data-cert-section="${escapeHtml(subject.cert)}" data-reader="${escapeHtml(topic.code)}">
      <header class="reader-head">
        <div class="reader-heading">
        <h1><span class="node-code">${escapeHtml(topic.code)}</span>${escapeHtml(topic.title)}</h1>
        <p class="reader-meta">
          <span class="reader-source">${notesLabelFor(subject)}</span>
          ${subject.cert === "aiap" && guideChapterLabel(sections) ? `<span>${escapeHtml(guideChapterLabel(sections)!)}</span>` : ""}
          <span>${sections.length} 節・${noteLeafCount(sections)} 則重點</span>
          ${countStudyVisuals(sections) ? `<span class="reader-visual-count">${countStudyVisuals(sections)} 張教學圖解</span>` : ""}
        </p>
        </div>
        <div class="reader-header-tools">
          <details class="reader-scope">
            <summary>評鑑範圍<span>${topic.contents.length} 項重點</span></summary>
            <ul>${topic.contents.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
          </details>
          ${sections.length ? `<details class="reader-settings"><summary>朗讀設定</summary>${renderTtsRate()}</details>` : ""}
        </div>
      </header>
      ${renderReaderSections(sections, topic.links, subject.cert === "aiap" ? "guide" : "notes")}
      ${sections.length ? "" : `<p class="reader-empty">這一節還沒有整理筆記，先看上面的評鑑範圍與延伸閱讀。</p>`}
      <section class="reader-end" aria-label="讀完這一節">
        <div class="reader-end-actions">
          ${count > 0 ? `<button class="submit" data-topic-drill="${drillKey}">練這一節的 ${count} 題</button>` : ""}
          <button class="reader-next" data-study-action="read-next">${escapeHtml(nextLabel)}${chevronRightIcon}</button>
        </div>
      </section>
    </main>
    <nav class="reader-dock" aria-label="節點切換">
      <div class="reader-dock-inner">
        ${step(prev, "prev")}
        <button class="node-read${read ? " active" : ""}" data-study-read="${escapeHtml(topic.code)}"
                aria-pressed="${read}">${checkIcon}<span class="node-read-label">${read ? "已讀" : "標記已讀"}</span></button>
        ${count > 0
          ? `<button class="node-drill" data-topic-drill="${drillKey}">練 ${count} 題</button>`
          : `<span class="node-drill is-empty">尚無題目</span>`}
        ${step(next, "next")}
      </div>
    </nav>
  `;
};

const renderOverviewReader = (cert: Cert, sections: StudyNoteSection[] | undefined): string => {
  if (!sections?.length) return renderStudyMissing();
  const certInfo = certs.find((c) => c.id === cert) ?? certs[0];
  return `
    ${renderReaderTopbar(certInfo.name)}
    <main class="study study-reader" data-cert-section="${escapeHtml(cert)}">
      <header class="reader-head">
        <h1>備考總整理</h1>
        <p class="reader-meta">
          <span class="reader-source">備考整理</span>
          <span>${sections.length} 節・${noteLeafCount(sections)} 則重點・跨節點的內容</span>
        </p>
        <div class="reader-header-tools"><details class="reader-settings"><summary>朗讀設定</summary>${renderTtsRate()}</details></div>
      </header>
      ${renderReaderSections(sections)}
    </main>
  `;
};

const renderAbbrReader = (cert: Cert, abbreviations: AbbrEntry[]): string => {
  if (!abbreviations.length) return renderStudyMissing();
  const certInfo = certs.find((c) => c.id === cert) ?? certs[0];
  return `
    ${renderReaderTopbar(certInfo.name)}
    <main class="study study-reader study-abbr" data-cert-section="${escapeHtml(cert)}">
      <header class="reader-head">
        <h1>縮寫速查</h1>
        <p class="reader-meta"><span>${abbreviations.length} 個縮寫・各節點「重要縮寫」的彙整</span></p>
      </header>
      <div class="study-search-row">
        ${searchIcon}
        <input class="study-search" type="search" data-abbr-filter
               placeholder="篩選縮寫、全名或中文" aria-label="篩選縮寫">
      </div>
      <p class="study-search-count" data-study-count role="status" aria-live="polite"></p>
      <div class="note-table-wrap">
        <table class="note-table abbr-table">
          <thead>
            <tr><th>縮寫</th><th>全名</th><th>中文</th><th>節點</th></tr>
          </thead>
          <tbody>
            ${abbreviations.map((a) => `
              <tr data-abbr-row>
                <th scope="row">${escapeHtml(a.term)}</th>
                <td>${escapeHtml(a.full)}</td>
                <td>${escapeHtml(a.zh ?? "—")}</td>
                <td>${escapeHtml(a.nodes.join("、"))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </main>
  `;
};

// ── 程式速查：真題考過的程式 × 最新穩定版文件 ─────────────────────
// 考前快讀：卡片正面只放「考點／陷阱／新版差異／最小範例」，為什麼重要、實務與文件收在 <details> 裡。
// 分節沿用閱讀器的目錄籤（data-study-jump＋.reader-section[id]），捲動同步與跳轉都不必另寫。

export const codeCardCount = (sheet: CodeSheet): number =>
  sheet.sections.reduce((sum, section) => sum + section.cards.length, 0);

/** 卡片引用到的真題 id（去重、依卷次與題號排序）。 */
export const codeSheetExamIds = (sheet: CodeSheet): string[] =>
  [...new Set(sheet.sections.flatMap((section) => section.cards.flatMap((card) => card.exams)))]
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

/** `senior-ml-114-2-q47` → `114 年第 2 次・第 47 題`；認不得的 id 原樣顯示。 */
export const examRefLabel = (id: string): string => {
  const match = /-(\d{3})-(\d)-q0*(\d+)$/.exec(id);
  return match ? `${match[1]} 年第 ${match[2]} 次・第 ${match[3]} 題` : id;
};

const renderExamRefs = (ids: string[]): string => ids.length
  ? `<p class="code-exams"><span class="code-exams-label">考過</span>${ids.map((id) => `<span class="code-exam">${escapeHtml(examRefLabel(id))}</span>`).join("")}</p>`
  : `<p class="code-exams"><span class="code-exams-label">真題未考</span><span class="code-exam is-forecast">高機率延伸</span></p>`;

const renderCodeCard = (card: CodeCard): string => `
  <article class="code-card" id="code-card-${escapeHtml(card.id)}">
    <header class="code-card-head">
      <h4 class="code-card-api">${escapeHtml(card.api)}</h4>
      <span class="code-card-tags">
        <span class="code-badge${card.priority === "core" ? " is-core" : ""}">${card.priority === "core" ? "必考" : "高機率"}</span>
        <span class="code-lib">${escapeHtml(card.lib)}</span>
      </span>
    </header>
    <p class="code-point">${escapeHtml(card.point)}</p>
    ${card.trap ? `<p class="code-note is-trap"><span class="code-note-label">陷阱</span>${escapeHtml(card.trap)}</p>` : ""}
    ${card.versionNote ? `<p class="code-note is-version"><span class="code-note-label">新版</span>${escapeHtml(card.versionNote)}</p>` : ""}
    ${card.code ? `<pre class="figure-pre code-snippet"><code>${escapeHtml(card.code)}</code></pre>` : ""}
    ${card.table ? renderNoteTable(card.table.caption, card.table) : ""}
    ${renderExamRefs(card.exams)}
    <details class="code-more">
      <summary>為什麼重要・實務應用・官方文件</summary>
      <dl class="code-more-list">
        <dt>為什麼重要</dt><dd>${escapeHtml(card.why)}</dd>
        <dt>實務應用</dt><dd>${escapeHtml(card.practice)}</dd>
      </dl>
      <ul class="study-links">${card.docs.map(renderReadingLink).join("")}</ul>
    </details>
  </article>
`;

const renderCodeChips = (ids: string[], cardsById: Map<string, CodeCard>): string =>
  ids.map((id) => cardsById.get(id))
    .filter((card): card is CodeCard => card !== undefined)
    .map((card) => `<button class="ml-chip" data-study-jump="code-card-${escapeHtml(card.id)}">${escapeHtml(card.short)}</button>`)
    .join("");

/**
 * 全局圖：三條帶（定義與資料 → 建模 → 上線）由上而下，帶內的步驟由左而右。
 * 桌面四欄對齊，讓三條帶的步驟上下對得起來；上線帶只有一步，剩下的欄位放回饋迴圈。
 * 用 HTML 而非 SVG：手機上要能重排成兩欄，文字也要能選取、被搜尋與朗讀。
 */
const renderCodePipeline = (pipeline: CodePipeline, cards: CodeCard[]): string => {
  const cardsById = new Map(cards.map((card) => [card.id, card]));
  const stages = pipeline.phases.flatMap((phase) => phase.stages.map((stage) => ({ phase, stage })));
  const numberOf = new Map(stages.map(({ stage }, index) => [stage.id, index + 1]));
  const stageTitle = (id: string): string => {
    const found = stages.find(({ stage }) => stage.id === id);
    return found ? `${numberOf.get(id)} ${found.stage.title}` : id;
  };
  const examCount = (ids: string[]): number =>
    new Set(ids.flatMap((id) => cardsById.get(id)?.exams ?? [])).size;
  const loops = pipeline.loops.length ? `
    <ul class="ml-loops" aria-label="回饋迴圈" style="--span: ${4 - (pipeline.phases.at(-1)?.stages.length ?? 1)}">
      ${pipeline.loops.map((loop) => `
        <li><span class="ml-loop-icon" aria-hidden="true">↺</span>
          <span><strong>${escapeHtml(stageTitle(loop.from))} → ${escapeHtml(stageTitle(loop.to))}</strong>${escapeHtml(loop.text)}</span></li>
      `).join("")}
    </ul>` : "";
  const bands = pipeline.phases.map((phase, phaseIndex) => {
    const last = phaseIndex === pipeline.phases.length - 1;
    const span = last && loops ? phase.stages.length : 4;
    return `
      <div class="ml-band is-${escapeHtml(phase.id)}">
        <p class="ml-band-label"><strong>${escapeHtml(phase.name)}</strong><span>${escapeHtml(phase.role)}</span></p>
        <div class="ml-band-body">
          <ol class="ml-band-stages" style="--span: ${span}" start="${numberOf.get(phase.stages[0]?.id ?? "") ?? 1}">
            ${phase.stages.map((stage) => `
              <li class="ml-node">
                <button class="ml-node-link" data-study-jump="code-stage-${escapeHtml(stage.id)}">
                  <span class="ml-node-no">${numberOf.get(stage.id)}</span>
                  <span class="ml-node-title">${escapeHtml(stage.title)}</span>
                  <span class="ml-node-goal">${escapeHtml(stage.goal)}</span>
                  <span class="ml-node-exams">真題 ${examCount(stage.cards)} 題・${stage.cards.length} 個函式</span>
                </button>
              </li>
            `).join("")}
          </ol>
          ${last ? loops : ""}
        </div>
      </div>
    `;
  }).join("");
  const details = stages.map(({ phase, stage }) => `
    <li class="ml-stage" id="code-stage-${escapeHtml(stage.id)}">
      <h3 class="ml-stage-title"><span class="ml-node-no">${numberOf.get(stage.id)}</span>${escapeHtml(stage.title)}<span class="ml-stage-phase">${escapeHtml(phase.name)}</span></h3>
      <dl class="code-more-list">
        <dt>做什麼</dt><dd>${escapeHtml(stage.doing)}</dd>
        <dt>系統觀念</dt><dd>${escapeHtml(stage.system)}</dd>
        <dt>出錯的代價</dt><dd>${escapeHtml(stage.risk)}</dd>
      </dl>
      <p class="ml-chips"><span class="code-exams-label">本頁函式</span>${renderCodeChips(stage.cards, cardsById)}</p>
    </li>
  `).join("");
  return `
    <p class="code-section-summary">${escapeHtml(pipeline.summary)}</p>
    <figure class="ml-map">
      <figcaption class="ml-map-caption">機器學習 Pipeline 全局圖：由上而下、由左而右是先後順序，點步驟看系統觀念</figcaption>
      ${bands}
      <div class="ml-crosscut">
        <p class="ml-band-label"><strong>貫穿全程</strong><span>每一步都要顧到</span></p>
        <ul class="ml-crosscut-list">
          ${pipeline.crosscut.map((item) => `
            <li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text)}</span>
              <span class="ml-chips">${renderCodeChips(item.cards, cardsById)}</span></li>
          `).join("")}
        </ul>
      </div>
    </figure>
    <ol class="ml-stage-list">${details}</ol>
  `;
};

const renderCodeSheetReader = (subjectId: string, sheet: CodeSheet | undefined): string => {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!sheet || !subject) return renderStudyMissing();
  const examIds = codeSheetExamIds(sheet);
  const cards = sheet.sections.flatMap((section) => section.cards);
  const parts: { id: string; label: string; title: string; body: string }[] = [
    ...(sheet.pipeline ? [{
      id: "code-pipeline", label: "全局圖", title: "全局圖：機器學習 Pipeline",
      body: renderCodePipeline(sheet.pipeline, cards),
    }] : []),
    {
      id: "code-traps", label: "考前陷阱", title: `考前 ${sheet.traps.length} 個陷阱`,
      body: `<ol class="code-traps">${sheet.traps.map((trap) => `
        <li><span>${escapeHtml(trap.text)}</span>${trap.exams.length ? `<span class="code-trap-refs">${trap.exams.map((id) => escapeHtml(examRefLabel(id))).join("、")}</span>` : ""}</li>
      `).join("")}</ol>`,
    },
    {
      id: "code-formulas", label: "速算公式", title: "速算公式",
      body: `<ul class="code-formulas">${sheet.formulas.map((f) => `<li class="note-block">${renderNoteFormula(f.label, { expr: f.expr, note: f.note })}</li>`).join("")}</ul>`,
    },
    ...sheet.sections.map((section) => ({
      id: `code-${section.id}`,
      label: section.title.split("｜")[0],
      title: section.title,
      body: `<p class="code-section-summary">${escapeHtml(section.summary)}</p>${section.cards.map(renderCodeCard).join("")}`,
    })),
    {
      id: "code-versions", label: "版本與來源", title: "版本與官方文件",
      body: `
        <p class="code-section-summary">${escapeHtml(sheet.checkedAt)} 查核 PyPI 的最新穩定版，並以這些版本實際執行本頁每一項程式行為；文件連結都指向官方的 stable 版本。</p>
        <div class="note-table-wrap">
          <table class="note-table">
            <thead><tr><th>套件</th><th>穩定版</th><th>發布日</th><th>備註</th></tr></thead>
            <tbody>${sheet.versions.map((v) => `
              <tr><th scope="row"><a class="reading-link" href="${escapeHtml(v.docs)}" target="_blank" rel="noopener noreferrer">${escapeHtml(v.lib)}</a></th>
              <td>${escapeHtml(v.version)}</td><td>${escapeHtml(v.released)}</td><td>${escapeHtml(v.note ?? "")}</td></tr>
            `).join("")}</tbody>
          </table>
        </div>
        <p class="code-section-summary">卡片內容由 AI 整理，程式行為已實際執行驗證，觀念敘述尚未經人工查核。</p>
      `,
    },
  ];
  return `
    ${renderReaderTopbar(`${subjectLabel(subject)} ${subject.name}`)}
    <main class="study study-reader study-code" data-cert-section="${escapeHtml(subject.cert)}">
      <header class="reader-head">
        <h1>${escapeHtml(subjectLabel(subject))} ${escapeHtml(sheet.title)}</h1>
        <p class="reader-meta">
          <span class="reader-source">真題 × 官方文件</span>
          <span>${codeCardCount(sheet)} 個函式・涵蓋 ${examIds.length} 題真題程式題・${escapeHtml(sheet.checkedAt)} 版本查核</span>
        </p>
      </header>
      <div class="reader-layout">
        <nav class="reader-toc" aria-label="本頁段落">
          <p class="reader-toc-heading">本頁目錄<span>${parts.length} 個段落</span></p>
          <label class="reader-toc-mobile">跳至段落
            <select class="reader-section-picker" data-reader-section aria-label="跳至本頁段落">
              ${parts.map((part) => `<option value="${part.id}">${escapeHtml(part.label)}</option>`).join("")}
            </select>
          </label>
          <div class="reader-toc-track"><div class="reader-toc-group"><div class="reader-toc-list">
            ${parts.map((part) => `<button class="reader-toc-chip" data-study-jump="${part.id}">${escapeHtml(part.label)}</button>`).join("")}
          </div></div></div>
        </nav>
        <div class="reader-body">
          ${parts.map((part) => `
            <section class="reader-section code-section" id="${part.id}">
              <h2 class="study-note-title">${escapeHtml(part.title)}</h2>
              ${part.body}
            </section>
          `).join("")}
        </div>
      </div>
    </main>
  `;
};

const renderStudyMissing = (): string => `
  ${renderReaderTopbar("學習主題")}
  <main class="study study-reader">
    <p class="reader-empty">找不到這一頁，可能是筆記已經改版。回到目錄重新選一節。</p>
  </main>
`;

export const renderStudyReader = (data: StudyReaderData): string => {
  const { page, notes, overviews, abbreviations, codeSheets, readNodes = new Set<string>() } = data;
  if (page.kind === "node") return renderNodeReader(page, notes, readNodes);
  if (page.kind === "code") return renderCodeSheetReader(page.subjectId, codeSheets?.[page.subjectId]);
  if (page.kind === "overview") return renderOverviewReader(page.cert, overviews?.[page.cert]);
  return renderAbbrReader(page.cert, abbreviations?.[page.cert] ?? []);
};

export type AbbrEntry = { term: string; full: string; zh?: string; nodes: string[] };

export const renderPaperPicker = (subjectName: string, paperCount: number): string => {
  const cards = Array.from({ length: paperCount }, (_, i) => `
    <button class="mode-card" data-paper="${i}"><h2>第 ${i + 1} 份</h2><p>50 題・單頁作答・計時</p></button>
  `).join("");
  return `
    <header class="topbar"><button class="back" data-nav="back-mode">${chevronLeftIcon}返回</button><h1>${escapeHtml(subjectName)}</h1></header>
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
    <button class="${classes.join(" ")}" data-qid="${escapeHtml(qid)}" data-choice="${choice.id}" aria-pressed="${selected}">
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
    <section class="exam-q" id="exam-q-${i}" data-qid="${escapeHtml(q.id)}">
      ${renderSourceNote(q)}
      <p class="prompt"><span class="qnum">${i + 1}.</span> ${escapeHtml(q.prompt)}</p>
      ${renderFigures(q.figures)}
      <div class="choices">${q.choices.map((c) => renderExamChoice(q.id, c, answers[q.id] === c.id, q.choiceFigures?.[c.id])).join("")}</div>
    </section>`).join("");
  // 題號地圖：50 題的單頁考卷沒有它，就得靠記憶找回跳過的題目。
  // 格子的「已作答」與上方計數一樣由 main.ts 就地更新，不整頁重繪。
  const mapCells = questions.map((q, i) => {
    const done = answers[q.id] !== undefined;
    return `<button class="exam-map-cell${done ? " is-answered" : ""}" data-exam-jump="${i}"
      aria-label="第 ${i + 1} 題${done ? "，已作答" : "，未作答"}">${i + 1}</button>`;
  }).join("");
  return `
    <header class="topbar exam-bar">
      <button class="back exam-quit" data-nav="quit">結束</button>
      <details class="exam-map">
        <!-- 已作答數只在使用者點選項時變動，是對操作的直接回饋，用 polite 播報剛好。 -->
        <summary><span class="progress" aria-live="polite" aria-atomic="true"><span class="progress-label">已作答 </span><span class="answered-count">${answered}</span> / ${questions.length}</span></summary>
        <div class="exam-map-panel">
          <p class="exam-map-hint">點題號跳到該題；實心格為已作答。</p>
          <div class="exam-map-grid">${mapCells}</div>
        </div>
      </details>
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
    <header class="topbar"><button class="back" data-nav="result">${chevronLeftIcon}${escapeHtml(backLabel)}</button><h1>逐題檢討</h1></header>
    <main class="exam-paper review">
      <p class="lead">本次得分 ${scoreLine} 分</p>
      ${blocks}
    </main>
  `;
};

export type ConfirmDialogView = {
  title: string;
  body: string;
  /** 依序排列的按鈕；第一顆取得預設焦點，因此應放「安全」的選項。 */
  actions: { label: string; value: string; tone?: "primary" | "danger" | "plain" }[];
};

/**
 * 不可逆操作（交卷、放棄考試、重置進度）前的確認框。用原生 <dialog> 的
 * `method="dialog"` 表單，按鈕的 value 即為 returnValue，不需要額外的 data-* 委派；
 * Esc 關閉時 returnValue 為空字串，呼叫端一律當成取消。
 */
export const renderConfirmDialog = ({ title, body, actions }: ConfirmDialogView): string => `
  <form method="dialog" class="confirm-form">
    <h2 class="confirm-title">${escapeHtml(title)}</h2>
    <p class="confirm-body">${escapeHtml(body)}</p>
    <div class="confirm-actions">
      ${actions.map((action, index) => `
        <button value="${escapeHtml(action.value)}" class="confirm-btn is-${action.tone ?? "plain"}"${index === 0 ? " autofocus" : ""}>${escapeHtml(action.label)}</button>
      `).join("")}
    </div>
  </form>
`;
