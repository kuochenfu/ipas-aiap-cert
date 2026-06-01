import "./styles.css";
import {
  renderHome, renderLevel, renderModePicker, renderQuestion, renderResult, renderStudyView,
  renderPaperPicker, renderExamPaper, renderExamReview,
} from "./ui/render";
import { getSubject } from "./domain/catalog";
import { getQuestions } from "./data/index";
import { scoreExam, topicSummary, type AnswerState } from "./domain/exam";
import { buildAttempt } from "./state/attempt";
import { buildMockPaper, PAPER_COUNT } from "./state/mockPapers";
import { addMiss } from "./state/storage";
import type { ChoiceId, Question } from "./data/types";
import type { Level } from "./data/types";

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
};

const app = document.querySelector<HTMLDivElement>("#app")!;
let session: Session = blankSession();
let timerId: number | null = null;

function blankSession(): Session {
  return {
    view: "home", level: "junior", subjectId: "", mode: "exam", paperIndex: 0,
    questions: [], answers: {}, index: 0, reveal: false, deadline: null,
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

function render() {
  if (session.view === "home") { stopTimer(); app.innerHTML = renderHome(); return; }
  if (session.view === "study") { stopTimer(); app.innerHTML = renderStudyView(); return; }
  if (session.view === "level") { stopTimer(); app.innerHTML = renderLevel(session.level); return; }
  if (session.view === "mode") {
    stopTimer();
    app.innerHTML = renderModePicker(getSubject(session.subjectId)?.name ?? "");
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
      const q = session.questions[session.index];
      app.innerHTML = renderQuestion(
        q, session.index, session.questions.length,
        session.answers[q.id], session.reveal, "", false,
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
  // 刷題：放入全部題目、依考卷原序（不打散）。
  const bank = getQuestions(session.subjectId);
  session.questions = buildAttempt(bank, { count: bank.length, shuffle: (a) => [...a] }).questions;
  session.answers = {};
  session.index = 0;
  session.reveal = false; // 進入時未揭曉；作答後才揭曉
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
  session.answers[q.id] = choiceId;
  if (session.mode === "drill") session.reveal = true;
  render();
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest("[data-level],[data-subject],[data-mode],[data-paper],[data-choice],[data-nav]");
  if (!(target instanceof HTMLElement)) return;

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

  const nav = target.getAttribute("data-nav");
  if (!nav) return;
  if (nav === "home") { session = blankSession(); render(); return; }
  if (nav === "study") { session.view = "study"; render(); return; }
  if (nav === "back") { session.view = "level"; render(); return; }
  if (nav === "back-mode") { stopTimer(); session.view = "mode"; render(); return; }
  if (nav === "quit") { stopTimer(); session.view = "level"; render(); return; }
  if (nav === "prev") { if (session.index > 0) session.index--; session.reveal = revealForCurrent(); render(); return; }
  if (nav === "next") {
    if (session.index < session.questions.length - 1) session.index++;
    session.reveal = revealForCurrent();
    render();
    return;
  }
  if (nav === "submit" && session.view === "play") { finishExam(); return; }
  if (nav === "result") { session.view = "result"; render(); return; }
  if (nav === "review") { session.view = "review"; session.reveal = true; session.index = 0; render(); return; }
});

render();
