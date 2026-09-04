import "./styles.css";
import {
  renderHome, renderCert, renderLevel, renderModePicker, renderQuestion, renderResult, renderStudyView,
  renderTopicStats,
  renderPaperPicker, renderExamPaper, renderExamReview, renderDrillEmpty,
  renderStudyLoading,
} from "./ui/render";
import { getSubject } from "./domain/catalog";
import { getQuestions } from "./data/index";
import { isTopicClassified, practiceTotal, topicMatchesGuideCode } from "./domain/assessmentTopics";
import { scoreExam, topicStats, topicSummary, type AnswerState } from "./domain/exam";
import { buildDiagnostics, hasQuestionMeta } from "./domain/diagnostics";
import { buildAttempt } from "./state/attempt";
import { buildMockPaper, PAPER_COUNT } from "./state/mockPapers";
import {
  addMiss, loadConfidenceMode, loadMisses, loadReadNodes, removeMiss, saveConfidenceMode, toggleReadNode,
} from "./state/storage";
import {
  restoreDrill, parseJumpTarget, drillMatches, filteredDrillIndices, drillFilterTarget,
  practiceProgressKey, recordAnswer,
  type AnswerRecords, type Confidence, type DrillContext, type DrillFilter,
} from "./domain/drill";
import { loadDrillProgress, saveDrillProgress, clearDrillProgress } from "./state/drillProgress";
import type { ChoiceId, Question } from "./data/types";
import type { Cert, Level } from "./data/types";
import type { StudyNoteSection, StudyNotesBySubject } from "./data/types";
import type { AbbrEntry, DrillCounts } from "./ui/render";

type View = "home" | "cert" | "level" | "mode" | "paper" | "play" | "result" | "review" | "study" | "topics";
type Mode = "exam" | "drill";
type Bank = "main" | "practice";
// 模式選單的點擊 token：practice 實際上是 mode=drill + bank=practice。
type ModeToken = "exam" | "drill" | "practice";

type Session = {
  view: View;
  cert: Cert;
  level: Level;
  subjectId: string;
  mode: Mode;
  bank: Bank;               // drill 的題庫來源：原題庫或新題庫
  /** 刷題限定在某個評鑑節點（從學習主題頁的「練這個節點」進來時設定）。 */
  topicScope?: string;
  paperIndex: number;       // exam：第幾份試卷（0-based）
  questions: Question[];
  answers: AnswerState;
  /** 逐題作答歷程（時間、次數、信心）。只有刷題會累積。 */
  records: AnswerRecords;
  /** 校準模式：作答前先標記信心。使用者可關，關掉時完全不出現。 */
  confidenceMode: boolean;
  /** 本題已標記、但還沒作答的信心；作答後即消耗掉。 */
  pendingConfidence?: Confidence;
  index: number;
  reveal: boolean;          // drill：作答即揭曉；exam：交卷後 review 才揭曉
  deadline: number | null;  // exam 計時用 timestamp（ms）
  drillFilter: DrillFilter;
};

type PracticeModule = typeof import("./data/practice");

const app = document.querySelector<HTMLDivElement>("#app")!;
let session: Session = blankSession();
let timerId: number | null = null;
type StudyContent = {
  notes: StudyNotesBySubject;
  overviews: Partial<Record<Cert, StudyNoteSection[]>>;
  abbreviations: Partial<Record<Cert, AbbrEntry[]>>;
};
let studyNotesCache: StudyContent | null = null;
let studyNotesPromise: Promise<StudyContent> | null = null;
// 新題庫（200 題）獨立成自己的 chunk，只有進入初級科目的模式選單或實際開始練習時才載入。
let practiceCache: PracticeModule | null = null;
let practicePromise: Promise<PracticeModule> | null = null;
// 錯題本（模擬考錯題）在進入刷題時讀取的快照，供「錯題」篩選器使用。
let sessionMisses: ReadonlySet<string> = new Set();
let ttsRate = 1;
let activeTtsButton: HTMLButtonElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

function blankSession(): Session {
  return {
    view: "home", cert: "aiap", level: "junior", subjectId: "", mode: "exam", bank: "main",
    topicScope: undefined, paperIndex: 0,
    questions: [], answers: {}, records: {}, confidenceMode: loadConfidenceMode(),
    pendingConfidence: undefined,
    index: 0, reveal: false, deadline: null, drillFilter: "all",
  };
}

function timeText(): string {
  if (session.deadline === null) return "";
  const remain = Math.max(0, Math.floor((session.deadline - Date.now()) / 1000));
  const m = String(Math.floor(remain / 60)).padStart(2, "0");
  const s = String(remain % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function answeredCount(): number {
  return session.questions.reduce((n, q) => n + (session.answers[q.id] !== undefined ? 1 : 0), 0);
}

// 題庫是否已依評鑑節點分類（節點碼形如 L23303）。未分類的題庫顯示「節點表現」沒有意義，
// 目前初級的原題庫仍是「未分類」，只有新題庫與中級三科的原題庫帶節點碼。
function bankHasTopics(): boolean {
  if (!session.questions.length) return false;
  const coded = session.questions.filter((q) => isTopicClassified(q.topic)).length;
  return coded / session.questions.length > 0.5;
}

function drillCounts(): DrillCounts {
  return session.questions.reduce<DrillCounts>((counts, question) => {
    counts.all += 1;
    if (sessionDrillMatches(question, "unanswered")) counts.unanswered += 1;
    if (sessionDrillMatches(question, "wrong")) counts.wrong += 1;
    if (sessionDrillMatches(question, "recommended")) counts.recommended += 1;
    return counts;
  }, { all: 0, recommended: 0, wrong: 0, unanswered: 0 });
}

// 新題庫的進度與原刷題分開存：同一個 localStorage key 底下，科目 key 加上 :practice 後綴。
function drillProgressKey(): string {
  const base = session.bank === "practice"
    ? practiceProgressKey(session.subjectId)
    : session.subjectId;
  // 節點限定的刷題另存進度，否則會把整科的進度覆寫成只有那幾題。
  return session.topicScope ? `${base}:topic:${session.topicScope}` : base;
}

// 只有刷題存進度；每次作答與換題後寫入。
function persistDrill() {
  if (session.mode !== "drill" || !session.subjectId) return;
  const current = session.questions[session.index];
  if (!current) return;
  const answers: Record<string, ChoiceId> = {};
  for (const [id, choice] of Object.entries(session.answers)) {
    if (choice !== undefined) answers[id] = choice;
  }
  saveDrillProgress(drillProgressKey(), { questionId: current.id, answers, records: session.records });
}

// 以下三個為 src/domain/drill.ts 純函式的 session 綁定版本，方便呼叫端省去傳參。
// 「推薦」篩選需要作答歷程與現在時間，一併收在這個 context 裡。
function drillContext(): DrillContext {
  return { missed: sessionMisses, records: session.records };
}

function sessionDrillMatches(question: Question, filter = session.drillFilter): boolean {
  return drillMatches(question, session.answers, filter, drillContext());
}

function sessionFilteredIndices(filter = session.drillFilter): number[] {
  return filteredDrillIndices(session.questions, session.answers, filter, drillContext());
}

function moveDrill(delta: -1 | 1) {
  const indices = sessionFilteredIndices();
  if (!indices.length) return;
  const currentPosition = indices.indexOf(session.index);
  if (currentPosition >= 0) {
    const nextPosition = Math.min(indices.length - 1, Math.max(0, currentPosition + delta));
    session.index = indices[nextPosition];
  } else {
    const next = delta > 0
      ? indices.find((index) => index > session.index) ?? indices[0]
      : [...indices].reverse().find((index) => index < session.index) ?? indices[indices.length - 1];
    session.index = next;
  }
  session.reveal = revealForCurrent();
  // 信心是「對這一題」下的注，換題就作廢。
  session.pendingConfidence = undefined;
  persistDrill();
  render();
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

// 剩餘時間的播報門檻（分鐘）。計時器本身刻意不逐秒播報（見 render.ts 的 role="timer"），
// 只在跨過這些門檻時對 .sr-live 寫一次，讓螢幕閱讀器使用者掌握時間又不被每秒打斷。
const TIME_ANNOUNCE_MINUTES = [30, 10, 5, 1];
let lastAnnouncedMinute: number | null = null;

function announce(message: string) {
  const el = app.querySelector(".sr-live");
  if (el) el.textContent = message;
}

function startTimer() {
  stopTimer();
  lastAnnouncedMinute = null;
  timerId = window.setInterval(() => {
    if (session.deadline !== null && Date.now() >= session.deadline) {
      announce("時間到，已自動交卷。");
      finishExam();
      return;
    }
    const el = app.querySelector(".timer");
    if (el) el.textContent = timeText();
    if (session.deadline === null) return;
    const remainingMinutes = Math.ceil((session.deadline - Date.now()) / 60_000);
    if (TIME_ANNOUNCE_MINUTES.includes(remainingMinutes) && remainingMinutes !== lastAnnouncedMinute) {
      lastAnnouncedMinute = remainingMinutes;
      announce(`剩餘時間 ${remainingMinutes} 分鐘。`);
    }
  }, 1000);
}

function canSpeak(): boolean {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function clearTtsButton() {
  if (!activeTtsButton) return;
  activeTtsButton.classList.remove("speaking");
  activeTtsButton.setAttribute("aria-pressed", "false");
  activeTtsButton.setAttribute("title", "朗讀");
  activeTtsButton.setAttribute("aria-label", activeTtsButton.getAttribute("data-tts-label") ?? "朗讀");
  activeTtsButton = null;
}

function stopTts() {
  if (canSpeak()) window.speechSynthesis.cancel();
  activeUtterance = null;
  clearTtsButton();
}

function syncTtsRateButtons() {
  app.querySelectorAll<HTMLButtonElement>("[data-tts-rate]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.ttsRate) === ttsRate);
  });
}

function syncTtsControls() {
  const supported = canSpeak();
  syncTtsRateButtons();
  app.querySelectorAll<HTMLButtonElement>("[data-tts-rate]").forEach((button) => {
    button.disabled = !supported;
  });
  app.querySelectorAll<HTMLButtonElement>("[data-tts-section]").forEach((button) => {
    button.disabled = !supported;
    if (!supported) {
      button.setAttribute("title", "此瀏覽器不支援朗讀");
      button.setAttribute("aria-label", "此瀏覽器不支援朗讀");
    }
  });
}

function setTtsRate(rate: number) {
  if (!canSpeak()) return;
  ttsRate = rate;
  syncTtsControls();
  if (activeTtsButton) readStudySection(activeTtsButton, { restart: true });
}

function sectionSpeechText(section: HTMLElement): string {
  const heading = section.querySelector("h5")?.textContent?.trim() ?? "";
  const details = [...section.querySelectorAll(".note-text")]
    .map((item) => item.textContent?.trim() ?? "")
    .filter(Boolean);
  return [heading, ...details].join("。");
}

function markSpeaking(button: HTMLButtonElement) {
  activeTtsButton = button;
  button.dataset.ttsLabel = button.getAttribute("aria-label") ?? "朗讀";
  button.classList.add("speaking");
  button.setAttribute("aria-pressed", "true");
  button.setAttribute("title", "停止朗讀");
  button.setAttribute("aria-label", "停止朗讀");
}

function readStudySection(button: HTMLButtonElement, options: { restart?: boolean } = {}) {
  if (!canSpeak()) return;
  if (activeTtsButton === button && !options.restart) {
    stopTts();
    return;
  }

  const section = button.closest<HTMLElement>(".study-note-section");
  if (!section) return;
  const text = sectionSpeechText(section);
  if (!text) return;

  stopTts();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-TW";
  utterance.rate = ttsRate;
  utterance.onend = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
      clearTtsButton();
    }
  };
  utterance.onerror = utterance.onend;
  activeUtterance = utterance;
  markSpeaking(button);
  window.speechSynthesis.speak(utterance);
}

// 兩個筆記模組都是獨立 chunk，只有進入「學習主題」時才載入：
// studyNotes 是 AI 應用規劃師五科的官方指引重構，studyNotes.aiot 是 AIoT 的備考整理。
async function loadStudyNotes(): Promise<StudyContent> {
  if (studyNotesCache) return studyNotesCache;
  studyNotesPromise ??= Promise.all([
    import("./data/studyNotes"),
    import("./data/studyNotes.aiot"),
  ]).then(([core, aiot]) => ({
    notes: { ...core.studyNotes, ...aiot.aiotStudyNotes },
    overviews: { aiot: aiot.aiotExamOverview } as StudyContent["overviews"],
    abbreviations: { aiot: aiot.aiotAbbreviations },
  }));
  studyNotesCache = await studyNotesPromise;
  return studyNotesCache;
}

// ── 學習主題頁的就地操作 ────────────────────────────────
// 這些互動一律直接改 DOM，不呼叫 render()——學習頁很長，整頁重繪會把捲動位置與
// 已展開的節點全部打回原形。

/** 工具列現在每張證照各一份，所以要從被操作的控制項往上找它所屬的證照區塊。 */
function certSectionOf(element: HTMLElement): HTMLElement | null {
  return element.closest<HTMLElement>("[data-cert-section]");
}

function jumpToStudyNode(anchorId: string) {
  const target = document.getElementById(anchorId);
  if (!target) return;
  // 捲過去卻只看到標題沒有內容會很困惑，所以順手把該節點的筆記展開。
  target.querySelector<HTMLDetailsElement>("details.study-notes")?.setAttribute("open", "");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function runStudyAction(action: string, button: HTMLElement) {
  const section = certSectionOf(button);
  if (!section) return;
  if (action === "expand" || action === "collapse") {
    const open = action === "expand";
    for (const details of section.querySelectorAll<HTMLDetailsElement>("details")) details.open = open;
    return;
  }
  if (action === "cram") {
    const on = !section.classList.contains("is-cram");
    section.classList.toggle("is-cram", on);
    button.setAttribute("aria-pressed", String(on));
    button.classList.toggle("active", on);
    // 速記模式只留公式與易混淆兩節，但它們本身可能是收合的，得幫使用者打開。
    if (on) {
      for (const details of section.querySelectorAll<HTMLDetailsElement>("details.study-notes")) details.open = true;
      for (const details of section.querySelectorAll<HTMLDetailsElement>(
        'details[data-note-section="formula"], details[data-note-section="confuse"]',
      )) details.open = true;
    }
  }
}

function filterStudyNodes(input: HTMLInputElement) {
  const section = certSectionOf(input);
  if (!section) return;
  const query = input.value;
  const needle = query.trim().toLowerCase();
  const topics = section.querySelectorAll<HTMLElement>(".study-topic[data-node]");
  let hits = 0;
  for (const topic of topics) {
    // textContent 會涵蓋收合中的 <details> 內文，所以搜得到還沒展開的內容。
    const match = needle === "" || (topic.textContent ?? "").toLowerCase().includes(needle);
    topic.hidden = !match;
    if (match) {
      hits += 1;
      // 命中但內容藏在收合區裡等於沒找到，因此搜尋時自動展開命中的節點。
      if (needle !== "") {
        topic.querySelector<HTMLDetailsElement>("details.study-notes")?.setAttribute("open", "");
      }
    }
  }
  // 縮寫速查表不是節點，但它是最常被拿來查關鍵字的地方，所以一併篩選列。
  for (const row of section.querySelectorAll<HTMLElement>("[data-abbr-row]")) {
    row.hidden = needle !== "" && !(row.textContent ?? "").toLowerCase().includes(needle);
  }
  const count = section.querySelector<HTMLElement>("[data-study-count]");
  if (count) count.textContent = needle === "" ? "" : `命中 ${hits} / ${topics.length} 個節點`;
  section.classList.toggle("is-filtering", needle !== "");
}

/** 從學習主題頁直接練某個節點：把題庫縮到該節點，其餘流程與一般刷題相同。 */
function startTopicDrill(payload: string) {
  const separator = payload.indexOf("|");
  if (separator < 0) return;
  const subjectId = payload.slice(0, separator);
  const topic = payload.slice(separator + 1); // 學習主題碼，例 L111 或 A1.1
  const subject = getSubject(subjectId);
  if (!subject) return;
  const scoped = getQuestions(subjectId)
    .filter((question) => topicMatchesGuideCode(question.topic, topic));
  if (!scoped.length) return;
  session.cert = subject.cert;
  session.level = subject.level;
  session.subjectId = subjectId;
  session.mode = "drill";
  session.bank = "main";
  session.topicScope = topic;
  beginDrill(scoped);
}

function toggleStudyRead(code: string, button: HTMLElement) {
  const read = toggleReadNode(code);
  button.setAttribute("aria-pressed", String(read));
  button.classList.toggle("active", read);
  button.textContent = read ? "✓ 已讀" : "標記已讀";
  const section = certSectionOf(button);
  const counter = section?.querySelector<HTMLElement>("[data-study-read-count]");
  if (!section || !counter) return;
  const total = section.querySelectorAll("[data-study-read]").length;
  const done = section.querySelectorAll('[data-study-read][aria-pressed="true"]').length;
  counter.textContent = `已讀 ${done} / ${total}`;
}

app.addEventListener("input", (event) => {
  const target = event.target as HTMLElement;
  if (target instanceof HTMLInputElement && target.hasAttribute("data-study-search")) {
    filterStudyNodes(target);
  }
});

async function loadPractice(): Promise<PracticeModule> {
  if (practiceCache) return practiceCache;
  practicePromise ??= import("./data/practice");
  practiceCache = await practicePromise;
  return practiceCache;
}

// 換頁後把焦點移到新畫面的主標題。
//
// 只在「畫面切換」時移動，不是每次 render 都移——刷題作答、切篩選、翻頁都會呼叫
// render()，那時焦點應該留在使用者剛操作的按鈕上，硬拉回標題反而更糟。
let lastFocusedView: string | null = null;

function focusViewOnChange() {
  if (session.view === lastFocusedView) return;
  lastFocusedView = session.view;
  const target = app.querySelector("h1") ?? app.querySelector("main");
  if (!(target instanceof HTMLElement)) return;
  // 標題本身不該進入 Tab 順序，故用 -1；.view-anchor 負責隱藏聚焦外框。
  target.setAttribute("tabindex", "-1");
  target.classList.add("view-anchor");
  target.focus();
}

// 以 data-* 屬性描述目前焦點所在的按鈕，供重繪後找回同一顆。
// render() 走 innerHTML 整段替換，原本的 DOM 節點會被丟掉、焦點掉回 <body>；
// 刷題每作答一次就重繪一次，鍵盤使用者因此每答一題就失去位置。
const focusKeyOf = (el: Element | null): string | null => {
  if (!(el instanceof HTMLElement)) return null;
  for (const attr of ["data-choice", "data-nav", "data-filter", "data-subject", "data-mode", "data-paper"]) {
    const value = el.getAttribute(attr);
    if (value !== null) {
      const qid = el.getAttribute("data-qid");
      return qid !== null ? `[data-qid="${qid}"][${attr}="${value}"]` : `[${attr}="${value}"]`;
    }
  }
  return null;
};

function render() {
  const previousFocus = app.contains(document.activeElement) ? focusKeyOf(document.activeElement) : null;
  const previousView = session.view;
  renderView();
  focusViewOnChange();
  // 同一畫面內的重繪（刷題作答、切篩選、翻頁）：把焦點還給重繪前的那顆按鈕，
  // 使用者才聽得到剛作答那一項的正誤狀態，而不是被丟回文件開頭。
  if (session.view === previousView && previousFocus) {
    const restored = app.querySelector(previousFocus);
    if (restored instanceof HTMLElement) restored.focus();
  }
}

function renderView() {
  if (session.view !== "study") stopTts();
  if (session.view === "home") { stopTimer(); app.innerHTML = renderHome(); return; }
  if (session.view === "study") {
    stopTimer();
    if (studyNotesCache) {
      app.innerHTML = renderStudyView(studyNotesCache.notes, studyNotesCache.overviews, {
        abbreviations: studyNotesCache.abbreviations,
        readNodes: new Set(loadReadNodes()),
      });
      syncTtsControls();
    } else {
      app.innerHTML = renderStudyLoading();
      void loadStudyNotes().then((content) => {
        if (session.view === "study") {
          app.innerHTML = renderStudyView(content.notes, content.overviews, {
            abbreviations: content.abbreviations,
            readNodes: new Set(loadReadNodes()),
          });
          syncTtsControls();
        }
      });
    }
    return;
  }
  if (session.view === "cert") { stopTimer(); app.innerHTML = renderCert(session.cert); return; }
  if (session.view === "level") { stopTimer(); app.innerHTML = renderLevel(session.cert, session.level); return; }
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
    // practiceTotal 只讀節點配額（domain/assessmentTopics.ts 是靜態常量），不需要載入 200 題的新題庫本體
    // 就能算出正確題數，因此首次繪製就能顯示卡片，不會有「先無卡片、題庫載完才浮現」的閃爍。
    const practiceCount = practiceTotal(session.subjectId);
    const practice = practiceCount > 0
      ? {
        count: practiceCount,
        // 進度提示需要讀新題庫本體才能還原上次作答位置；快取還沒到位前先留空，
        // 下方背景載入完成、且畫面仍停在同一科目的模式選單時才補上（見下方 loadPractice().then）。
        progressText: practiceCache
          ? hintFor(practiceCache.getPracticeQuestions(session.subjectId), practiceProgressKey(session.subjectId))
          : undefined,
      }
      : undefined;
    const subject = getSubject(session.subjectId);
    app.innerHTML = renderModePicker({
      subjectName: subject?.name ?? "",
      drillCount: bank.length,
      drillProgressText: hintFor(bank, session.subjectId),
      practice,
      mockExam: subject?.mockExam ?? true,
    });
    if (practiceCount > 0 && !practiceCache) {
      const subjectId = session.subjectId;
      void loadPractice().then(() => {
        // 若使用者已經離開這個科目的模式選單（切到別科或別的畫面），這次載入結果就不再相關，
        // 不可覆寫使用者當下正在看的畫面——即使還是同一個 session 物件。
        if (session.view === "mode" && session.subjectId === subjectId) render();
      });
    }
    return;
  }
  if (session.view === "paper") {
    stopTimer();
    app.innerHTML = renderPaperPicker(getSubject(session.subjectId)?.name ?? "", PAPER_COUNT);
    return;
  }
  if (session.view === "play") {
    if (session.mode === "exam") {
      app.innerHTML = renderExamPaper(session.questions, session.answers, timeText(), answeredCount());
    } else {
      const filtered = sessionFilteredIndices();
      const current = session.questions[session.index];
      const controls = {
        filter: session.drillFilter, counts: drillCounts(),
        total: session.questions.length, hasTopics: bankHasTopics(),
        hasMeta: hasQuestionMeta(session.questions),
        confidence: {
          mode: session.confidenceMode,
          pending: session.pendingConfidence,
          recorded: current ? session.records[current.id]?.confidence : undefined,
        },
      };
      if (!filtered.length && !session.reveal) {
        app.innerHTML = renderDrillEmpty(controls);
        return;
      }
      if (!current) {
        app.innerHTML = renderDrillEmpty(controls);
        return;
      }
      app.innerHTML = renderQuestion(
        current, session.index, session.questions.length,
        session.answers[current.id], session.reveal, "", false, controls,
      );
    }
    return;
  }
  if (session.view === "topics") {
    stopTimer();
    app.innerHTML = renderTopicStats(
      getSubject(session.subjectId)?.name ?? "",
      topicStats(session.questions, session.answers),
      "回刷題",
      // 診斷三表需要命題後設資料；原題庫（尚未回填 meta）只呈現節點表格。
      hasQuestionMeta(session.questions)
        ? buildDiagnostics(session.questions, session.answers, session.records)
        : undefined,
    );
    return;
  }
  if (session.view === "review") {
    stopTimer();
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
  if (session.view === "result") {
    stopTimer();
    const report = scoreExam(session.questions, session.answers);
    app.innerHTML = renderResult(
      report.score, report.correct, report.wrong, report.passed,
      topicSummary(session.questions, session.answers),
    );
  }
}

// 刷題共用的收尾：放入全部題目、依原序（不打散），並還原上次進度。
function beginDrill(bank: Question[]) {
  session.questions = buildAttempt(bank, { count: bank.length, shuffle: (a) => [...a] }).questions;
  const restored = restoreDrill(session.questions, loadDrillProgress(drillProgressKey()));
  session.answers = restored.answers;
  session.records = restored.records;
  session.pendingConfidence = undefined;
  session.index = restored.index;
  session.deadline = null;
  session.drillFilter = "all";
  session.view = "play";
  // 錯題本（模擬考交卷時寫入）在進場時讀一次即可：它只會在交卷時被改寫，
  // 而交卷必然離開刷題。之後的「錯題」篩選都用這份快照，避免每次篩選都碰 localStorage。
  sessionMisses = new Set(loadMisses());
  session.reveal = revealForCurrent(); // 該題已作答則揭曉
  render();
}

function startMode(token: ModeToken) {
  // 從模式選單正常進場一律是整科範圍；殘留的節點限定會讓題庫莫名只剩幾題。
  session.topicScope = undefined;
  session.mode = token === "exam" ? "exam" : "drill";
  session.bank = token === "practice" ? "practice" : "main";
  if (session.mode === "exam") { session.view = "paper"; render(); return; }
  if (session.bank === "practice") {
    // 新題庫是動態載入的獨立 chunk：即使使用者搶在背景預載完成前就點了這張卡，
    // 這裡自己 await import 仍能正常進場，不依賴 render() 那邊的背景載入是否已完成。
    const subjectId = session.subjectId;
    void loadPractice().then((mod) => {
      // 若這段等待期間使用者已經切走（換科目、切到模擬考試、或又切回主題庫等），就不要再用舊的點擊結果覆寫畫面。
      if (
        session.subjectId !== subjectId || session.view !== "mode"
        || session.mode !== "drill" || session.bank !== "practice"
      ) return;
      beginDrill(mod.getPracticeQuestions(subjectId));
    });
    return;
  }
  beginDrill(getQuestions(session.subjectId));
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

function finishExam() {
  stopTimer();
  for (const id of scoreExam(session.questions, session.answers).missedQuestionIds) {
    addMiss(id);
  }
  session.view = "result";
  render();
}

// 檢討模式一律揭曉；刷題模式僅在該題已作答時揭曉；作答中（考試）不揭曉。
function revealForCurrent(): boolean {
  if (session.view === "review") return true;
  const q = session.questions[session.index];
  return session.mode === "drill" && q !== undefined && session.answers[q.id] !== undefined;
}

function selectChoice(choiceId: ChoiceId) {
  const q = session.questions[session.index];
  if (!q) return;
  session.answers[q.id] = choiceId;
  if (session.mode === "drill") {
    // 歷程只在刷題累積：模擬考本來就不存進度，記了也沒有地方讀。
    session.records[q.id] = recordAnswer(
      session.records[q.id], choiceId, choiceId === q.answer, Date.now(), session.pendingConfidence,
    );
    session.pendingConfidence = undefined;
    session.reveal = true;
    persistDrill();
  }
  render();
}

function setPendingConfidence(value: Confidence) {
  // 已揭曉就不再收信心——事後才說「我有把握」沒有校準意義。
  if (session.mode !== "drill" || session.reveal) return;
  session.pendingConfidence = session.pendingConfidence === value ? undefined : value;
  render();
}

function toggleConfidenceMode() {
  session.confidenceMode = !session.confidenceMode;
  saveConfidenceMode(session.confidenceMode);
  if (!session.confidenceMode) session.pendingConfidence = undefined;
  render();
}

function changeDrillFilter(filter: DrillFilter) {
  session.drillFilter = filter;
  const target = drillFilterTarget(
    session.questions, session.answers, session.index, filter, drillContext(),
  );
  session.index = target.index;
  // 沒有題目符合時強制不揭曉，render 才會走空狀態畫面而非顯示題目。
  session.reveal = target.empty ? false : revealForCurrent();
  persistDrill();
  render();
}

function jumpToDrillIndex(index: number) {
  session.index = index;
  // 目標題若不符當前篩選，切回「全部」，否則畫面不會有反應。
  if (!sessionDrillMatches(session.questions[index])) session.drillFilter = "all";
  session.reveal = revealForCurrent();
  persistDrill();
  render();
}

function submitDrillJump() {
  const input = app.querySelector<HTMLInputElement>(".drill-jump-input");
  if (!input) return;
  const index = parseJumpTarget(input.value, session.questions.length);
  if (index === null) { input.value = ""; return; } // 不合法：清空輸入、不打擾
  jumpToDrillIndex(index);
}

function resetDrill() {
  clearDrillProgress(drillProgressKey());
  // 「重置進度」是使用者明示的清空動作，本科目累積的模擬考錯題也一併清掉——
  // 否則清空作答後，「錯題」篩選器仍會被錯題本填滿，看起來像沒重置成功。
  // 只清本科目（錯題本的 id 帶 subjectId 前綴），不影響其他科目。
  for (const id of sessionMisses) {
    if (id.startsWith(`${session.subjectId}-`)) removeMiss(id);
  }
  sessionMisses = new Set();
  session.answers = {};
  session.records = {};
  session.pendingConfidence = undefined;
  session.index = 0;
  session.drillFilter = "all";
  session.reveal = false;
  render();
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest("[data-cert],[data-level],[data-subject],[data-mode],[data-paper],[data-choice],[data-confidence],[data-filter],[data-nav],[data-tts-section],[data-tts-rate],[data-study-jump],[data-study-action],[data-topic-drill],[data-study-read]");
  if (!(target instanceof HTMLElement)) return;

  if (target.hasAttribute("data-tts-section") && target instanceof HTMLButtonElement) {
    readStudySection(target);
    return;
  }

  const rate = target.getAttribute("data-tts-rate");
  if (rate) {
    setTtsRate(Number(rate));
    return;
  }

  const jump = target.getAttribute("data-study-jump");
  if (jump) { jumpToStudyNode(jump); return; }

  const studyAction = target.getAttribute("data-study-action");
  if (studyAction) { runStudyAction(studyAction, target); return; }

  const topicDrill = target.getAttribute("data-topic-drill");
  if (topicDrill) { startTopicDrill(topicDrill); return; }

  const readNode = target.getAttribute("data-study-read");
  if (readNode) { toggleStudyRead(readNode, target); return; }

  const confidence = target.getAttribute("data-confidence");
  if (confidence) { setPendingConfidence(confidence as Confidence); return; }

  const cert = target.getAttribute("data-cert");
  if (cert) { session.cert = cert as Cert; session.view = "cert"; render(); return; }

  const level = target.getAttribute("data-level");
  if (level) { session.level = level as Level; session.view = "level"; render(); return; }

  const subjectId = target.getAttribute("data-subject");
  if (subjectId) { session.subjectId = subjectId; session.topicScope = undefined; session.view = "mode"; render(); return; }

  const mode = target.getAttribute("data-mode");
  if (mode) { startMode(mode as ModeToken); return; }

  const paper = target.getAttribute("data-paper");
  if (paper !== null) { startExamPaper(Number(paper)); return; }

  const choice = target.getAttribute("data-choice");
  const qid = target.getAttribute("data-qid");
  // 單頁模擬考試：就地更新選取，不整頁重繪以保留捲動位置。
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
  if (choice && session.view === "play") {
    if (session.mode === "drill" && session.reveal) return; // 已揭曉不可改
    selectChoice(choice as ChoiceId);
    return;
  }

  const filter = target.getAttribute("data-filter");
  if (filter && session.mode === "drill") {
    changeDrillFilter(filter as DrillFilter);
    return;
  }

  const nav = target.getAttribute("data-nav");
  if (!nav) return;
  if (nav === "home") { session = blankSession(); render(); return; }
  if (nav === "study") { session.view = "study"; render(); return; }
  // 「返回」是往上一層走：級別頁回到證照頁，其餘（模式頁、選卷頁）回到級別頁。
  if (nav === "back") { session.view = session.view === "level" ? "cert" : "level"; render(); return; }
  if (nav === "back-mode") { stopTimer(); session.view = "mode"; render(); return; }
  if (nav === "quit") { stopTimer(); session.view = "level"; render(); return; }
  if (nav === "prev") {
    if (session.mode === "drill") { moveDrill(-1); return; }
    if (session.index > 0) session.index--;
    session.reveal = revealForCurrent();
    render();
    return;
  }
  if (nav === "next") {
    if (session.mode === "drill") { moveDrill(1); return; }
    if (session.index < session.questions.length - 1) session.index++;
    session.reveal = revealForCurrent();
    render();
    return;
  }
  if (nav === "submit" && session.view === "play") { finishExam(); return; }
  if (nav === "result") { session.view = "result"; render(); return; }
  if (nav === "jump" && session.mode === "drill") { submitDrillJump(); return; }
  if (nav === "drill-reset" && session.mode === "drill") { resetDrill(); return; }
  if (nav === "toggle-confidence" && session.mode === "drill") { toggleConfidenceMode(); return; }
  if (nav === "topics" && session.mode === "drill") { session.view = "topics"; render(); return; }
  if (nav === "back-play") { session.view = "play"; render(); return; }
  if (nav === "review") { session.view = "review"; session.reveal = true; session.index = 0; render(); return; }
});

window.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "Enter" && session.mode === "drill" && target instanceof HTMLInputElement && target.classList.contains("drill-jump-input")) {
    event.preventDefault();
    submitDrillJump();
    return;
  }
  if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
  if (session.mode !== "drill" || (session.view !== "play" && session.view !== "review")) return;

  const key = event.key.toUpperCase();
  if (["A", "B", "C", "D"].includes(key) && session.view === "play" && !session.reveal) {
    event.preventDefault();
    selectChoice(key as ChoiceId);
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveDrill(-1);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveDrill(1);
  }
});

render();
