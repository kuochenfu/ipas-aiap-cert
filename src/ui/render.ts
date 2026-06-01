import { escapeHtml } from "./escape";
import type { Choice } from "../data/types";
import type { Subject } from "../domain/catalog";

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
