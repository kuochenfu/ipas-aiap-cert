import "./styles.css";
import {
  renderHome, renderLevel, renderModePicker, renderQuestion, renderResult, renderStudyView,
  renderPaperPicker, renderExamPaper, renderExamReview, renderDrillEmpty,
  renderStudyLoading,
} from "./ui/render";
import { getSubject } from "./domain/catalog";
import { getQuestions } from "./data/index";
import { scoreExam, topicSummary, type AnswerState } from "./domain/exam";
import { buildAttempt } from "./state/attempt";
import { buildMockPaper, PAPER_COUNT } from "./state/mockPapers";
import { addMiss } from "./state/storage";
import { restoreDrill, parseJumpTarget } from "./domain/drill";
import { loadDrillProgress, saveDrillProgress, clearDrillProgress } from "./state/drillProgress";
import type { ChoiceId, Question } from "./data/types";
import type { Level } from "./data/types";
import type { StudyNotesBySubject } from "./data/types";
import type { DrillCounts, DrillFilter } from "./ui/render";

type View = "home" | "level" | "mode" | "paper" | "play" | "result" | "review" | "study";
type Mode = "exam" | "drill";

type Session = {
  view: View;
  level: Level;
  subjectId: string;
  mode: Mode;
  paperIndex: number;       // exam：第幾份試卷（0-based）
  questions: Question[];
  answers: AnswerState;
  index: number;
  reveal: boolean;          // drill：作答即揭曉；exam：交卷後 review 才揭曉
  deadline: number | null;  // exam 計時用 timestamp（ms）
  drillFilter: DrillFilter;
};

const app = document.querySelector<HTMLDivElement>("#app")!;
let session: Session = blankSession();
let timerId: number | null = null;
let studyNotesCache: StudyNotesBySubject | null = null;
let studyNotesPromise: Promise<StudyNotesBySubject> | null = null;
let ttsRate = 1;
let activeTtsButton: HTMLButtonElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

function blankSession(): Session {
  return {
    view: "home", level: "junior", subjectId: "", mode: "exam", paperIndex: 0,
    questions: [], answers: {}, index: 0, reveal: false, deadline: null, drillFilter: "all",
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

function drillCounts(): DrillCounts {
  return session.questions.reduce<DrillCounts>((counts, question) => {
    const answer = session.answers[question.id];
    counts.all += 1;
    if (answer === undefined) counts.unanswered += 1;
    if (answer !== undefined && answer !== question.answer) counts.wrong += 1;
    return counts;
  }, { all: 0, wrong: 0, unanswered: 0 });
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
  saveDrillProgress(session.subjectId, { questionId: current.id, answers });
}

function drillMatches(question: Question, filter = session.drillFilter): boolean {
  const answer = session.answers[question.id];
  if (filter === "all") return true;
  if (filter === "unanswered") return answer === undefined;
  return answer !== undefined && answer !== question.answer;
}

function filteredDrillIndices(filter = session.drillFilter): number[] {
  return session.questions
    .map((question, index) => drillMatches(question, filter) ? index : -1)
    .filter((index) => index >= 0);
}

function firstDrillIndex(filter: DrillFilter): number | undefined {
  return filteredDrillIndices(filter)[0];
}

function moveDrill(delta: -1 | 1) {
  const indices = filteredDrillIndices();
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
  persistDrill();
  render();
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(() => {
    if (session.deadline !== null && Date.now() >= session.deadline) {
      finishExam();
      return;
    }
    const el = app.querySelector(".timer");
    if (el) el.textContent = timeText();
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

async function loadStudyNotes(): Promise<StudyNotesBySubject> {
  if (studyNotesCache) return studyNotesCache;
  studyNotesPromise ??= import("./data/studyNotes").then((module) => module.studyNotes);
  studyNotesCache = await studyNotesPromise;
  return studyNotesCache;
}

function render() {
  if (session.view !== "study") stopTts();
  if (session.view === "home") { stopTimer(); app.innerHTML = renderHome(); return; }
  if (session.view === "study") {
    stopTimer();
    if (studyNotesCache) {
      app.innerHTML = renderStudyView(studyNotesCache);
      syncTtsControls();
    } else {
      app.innerHTML = renderStudyLoading();
      void loadStudyNotes().then((notes) => {
        if (session.view === "study") {
          app.innerHTML = renderStudyView(notes);
          syncTtsControls();
        }
      });
    }
    return;
  }
  if (session.view === "level") { stopTimer(); app.innerHTML = renderLevel(session.level); return; }
  if (session.view === "mode") {
    stopTimer();
    const bank = getQuestions(session.subjectId);
    const restored = restoreDrill(bank, loadDrillProgress(session.subjectId));
    const answered = Object.keys(restored.answers).length;
    const hint = answered > 0 || restored.index > 0
      ? `上次進度：第 ${restored.index + 1} 題・已作答 ${answered} 題`
      : undefined;
    app.innerHTML = renderModePicker(getSubject(session.subjectId)?.name ?? "", bank.length, hint);
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
      const filtered = filteredDrillIndices();
      const controls = { filter: session.drillFilter, counts: drillCounts(), total: session.questions.length };
      if (!filtered.length && !session.reveal) {
        app.innerHTML = renderDrillEmpty(controls);
        return;
      }
      const q = session.questions[session.index];
      if (!q) {
        app.innerHTML = renderDrillEmpty(controls);
        return;
      }
      app.innerHTML = renderQuestion(
        q, session.index, session.questions.length,
        session.answers[q.id], session.reveal, "", false, controls,
      );
    }
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

function startMode(mode: Mode) {
  session.mode = mode;
  if (mode === "exam") { session.view = "paper"; render(); return; }
  // 刷題：放入全部題目、依考卷原序（不打散），並還原上次進度。
  const bank = getQuestions(session.subjectId);
  session.questions = buildAttempt(bank, { count: bank.length, shuffle: (a) => [...a] }).questions;
  const restored = restoreDrill(session.questions, loadDrillProgress(session.subjectId));
  session.answers = restored.answers;
  session.index = restored.index;
  session.deadline = null;
  session.drillFilter = "all";
  session.view = "play";
  session.reveal = revealForCurrent(); // 該題已作答則揭曉
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
  return session.mode === "drill" && session.answers[q.id] !== undefined;
}

function selectChoice(choiceId: ChoiceId) {
  const q = session.questions[session.index];
  if (!q) return;
  session.answers[q.id] = choiceId;
  if (session.mode === "drill") {
    session.reveal = true;
    persistDrill();
  }
  render();
}

function changeDrillFilter(filter: DrillFilter) {
  session.drillFilter = filter;
  const first = firstDrillIndex(filter);
  if (first === undefined) {
    session.index = 0;
    session.reveal = false;
  } else {
    session.index = first;
    session.reveal = revealForCurrent();
  }
  persistDrill();
  render();
}

function jumpToDrillIndex(index: number) {
  session.index = index;
  // 目標題若不符當前篩選，切回「全部」，否則畫面不會有反應。
  if (!drillMatches(session.questions[index])) session.drillFilter = "all";
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
  clearDrillProgress(session.subjectId);
  session.answers = {};
  session.index = 0;
  session.drillFilter = "all";
  session.reveal = false;
  render();
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest("[data-level],[data-subject],[data-mode],[data-paper],[data-choice],[data-filter],[data-nav],[data-tts-section],[data-tts-rate]");
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

  const level = target.getAttribute("data-level");
  if (level) { session.level = level as Level; session.view = "level"; render(); return; }

  const subjectId = target.getAttribute("data-subject");
  if (subjectId) { session.subjectId = subjectId; session.view = "mode"; render(); return; }

  const mode = target.getAttribute("data-mode");
  if (mode) { startMode(mode as Mode); return; }

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
  if (nav === "back") { session.view = "level"; render(); return; }
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
  if (nav === "review") { session.view = "review"; session.reveal = true; session.index = 0; render(); return; }
});

window.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "Enter" && target instanceof HTMLInputElement && target.classList.contains("drill-jump-input")) {
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
