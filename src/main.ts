import "./styles.css";
import {
  renderHome, renderLevel, renderModePicker, renderQuestion, renderResult,
} from "./ui/render";
import { getSubject } from "./domain/catalog";
import { getQuestions } from "./data/index";
import { examRules, scoreExam, topicSummary, type AnswerState } from "./domain/exam";
import { buildAttempt } from "./state/attempt";
import { addMiss } from "./state/storage";
import type { ChoiceId, Question } from "./data/types";
import type { Level } from "./data/types";

type View = "home" | "level" | "mode" | "play" | "result" | "review";
type Mode = "exam" | "drill";

type Session = {
  view: View;
  level: Level;
  subjectId: string;
  mode: Mode;
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
    view: "home", level: "junior", subjectId: "", mode: "exam",
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
  if (session.view === "level") { stopTimer(); app.innerHTML = renderLevel(session.level); return; }
  if (session.view === "mode") {
    stopTimer();
    app.innerHTML = renderModePicker(getSubject(session.subjectId)?.name ?? "");
    return;
  }
  if (session.view === "play" || session.view === "review") {
    const q = session.questions[session.index];
    app.innerHTML = renderQuestion(
      q, session.index, session.questions.length,
      session.answers[q.id], session.reveal, timeText(),
    );
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
  const subject = getSubject(session.subjectId)!;
  const bank = getQuestions(session.subjectId);
  const count = mode === "exam" ? examRules.totalQuestions : Math.min(20, bank.length);
  session.mode = mode;
  session.questions = buildAttempt(bank, { count }).questions;
  session.answers = {};
  session.index = 0;
  session.reveal = false; // 兩種模式進入時皆未揭曉；drill 於作答後才揭曉
  session.view = "play";
  session.deadline = mode === "exam" ? Date.now() + subject.durationMinutes * 60_000 : null;
  if (mode === "exam") startTimer();
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

function selectChoice(choiceId: ChoiceId) {
  const q = session.questions[session.index];
  session.answers[q.id] = choiceId;
  if (session.mode === "drill") session.reveal = true;
  render();
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest("[data-level],[data-subject],[data-mode],[data-choice],[data-nav]");
  if (!(target instanceof HTMLElement)) return;

  const level = target.getAttribute("data-level");
  if (level) { session.level = level as Level; session.view = "level"; render(); return; }

  const subjectId = target.getAttribute("data-subject");
  if (subjectId) { session.subjectId = subjectId; session.view = "mode"; render(); return; }

  const mode = target.getAttribute("data-mode");
  if (mode) { startMode(mode as Mode); return; }

  const choice = target.getAttribute("data-choice");
  if (choice && (session.view === "play")) {
    if (session.mode === "drill" && session.reveal) return; // 已揭曉不可改
    selectChoice(choice as ChoiceId);
    return;
  }

  const nav = target.getAttribute("data-nav");
  if (!nav) return;
  if (nav === "home") { session = blankSession(); render(); return; }
  if (nav === "back") { session.view = "level"; render(); return; }
  if (nav === "quit") { stopTimer(); session.view = "level"; render(); return; }
  if (nav === "prev") { if (session.index > 0) session.index--; session.reveal = session.mode === "drill" && session.answers[session.questions[session.index].id] !== undefined; render(); return; }
  if (nav === "next") {
    if (session.index < session.questions.length - 1) session.index++;
    session.reveal = session.mode === "drill" && session.answers[session.questions[session.index].id] !== undefined;
    render();
    return;
  }
  if (nav === "submit") { finishExam(); return; }
  if (nav === "review") { session.view = "review"; session.reveal = true; session.index = 0; render(); return; }
});

render();
