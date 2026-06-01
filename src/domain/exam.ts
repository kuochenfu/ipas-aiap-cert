import type { ChoiceId, Question } from "../data/types";

export type AnswerState = Record<string, ChoiceId | undefined>;

export type ExamRules = {
  totalQuestions: number;
  pointsPerQuestion: number;
  passScore: number;
  maxWrongToPass: number;
};

export const examRules: ExamRules = {
  totalQuestions: 50,
  pointsPerQuestion: 2,
  passScore: 70,
  maxWrongToPass: 15,
};

export type ScoreReport = {
  score: number;
  correct: number;
  wrong: number;
  passed: boolean;
  missedQuestionIds: string[];
};

export type TopicRow = { topic: string; total: number; correct: number };

export const isCorrect = (question: Question, answer: ChoiceId | undefined): boolean =>
  answer !== undefined && answer === question.answer;

export const scoreExam = (questions: Question[], answers: AnswerState): ScoreReport => {
  const missedQuestionIds = questions
    .filter((question) => !isCorrect(question, answers[question.id]))
    .map((question) => question.id);
  const correct = questions.length - missedQuestionIds.length;
  const score = correct * examRules.pointsPerQuestion;
  return {
    score,
    correct,
    wrong: missedQuestionIds.length,
    passed: score >= examRules.passScore,
    missedQuestionIds,
  };
};

export const topicSummary = (questions: Question[], answers: AnswerState): TopicRow[] => {
  const map = new Map<string, TopicRow>();
  for (const question of questions) {
    const row = map.get(question.topic) ?? { topic: question.topic, total: 0, correct: 0 };
    row.total += 1;
    if (isCorrect(question, answers[question.id])) row.correct += 1;
    map.set(question.topic, row);
  }
  return [...map.values()];
};
