import { escapeHtml } from "./escape";
import type { Choice } from "../data/types";
import type { Subject } from "../domain/catalog";
import { getSubjectsByLevel } from "../domain/catalog";
import { getBankStats } from "../data/index";
import type { Level } from "../data/types";
import type { Question } from "../data/types";

export type BankStats = { total: number; pastExam: number; generated: number };

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

export const renderHome = (): string => `
  <header class="topbar"><h1>iPAS AI 應用規劃師 練習</h1></header>
  <main class="home">
    <p class="lead">選擇級別開始練習</p>
    <div class="level-grid">
      <button class="level-card" data-level="junior"><h2>初級</h2><p>人工智慧基礎概論 ・ 生成式 AI 應用與規劃</p></button>
      <button class="level-card" data-level="senior"><h2>中級</h2><p>技術應用規劃 ・ 大數據 ・ 機器學習</p></button>
    </div>
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

export const renderModePicker = (subjectName: string): string => `
  <header class="topbar"><button class="back" data-nav="back">← 返回</button><h1>${escapeHtml(subjectName)}</h1></header>
  <main class="mode-picker">
    <button class="mode-card" data-mode="exam"><h2>模擬考試</h2><p>50 題・計時・100 分制・70 分及格</p></button>
    <button class="mode-card" data-mode="drill"><h2>刷題練習</h2><p>20 題・即時對錯與詳解・不計時</p></button>
  </main>
`;

export const renderQuestion = (
  q: Question, index: number, total: number,
  selected: string | undefined, reveal: boolean, timeText: string,
  review: boolean,
): string => {
  const choices = q.choices
    .map((c) => renderChoice(c, { selected: selected === c.id, reveal, correct: c.id === q.answer }))
    .join("");
  const explanation = reveal
    ? `<div class="explanation"><strong>詳解</strong><p>${escapeHtml(q.explanation || "（尚無詳解）")}</p></div>`
    : "";
  // 檢討模式回到成績頁；作答模式才有交卷。
  const lastButton = review
    ? `<button class="submit" data-nav="result">回成績</button>`
    : `<button class="submit" data-nav="submit">交卷</button>`;
  return `
    <header class="topbar">
      <button class="back" data-nav="quit">結束</button>
      <span class="progress">第 ${index + 1} / ${total} 題</span>
      <span class="timer">${timeText}</span>
    </header>
    <main class="question">
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
