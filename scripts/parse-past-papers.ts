import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { aiotBasicsSections, papers, studyGuides } from "./paper-manifest";
import { parsePaper, parseStudyGuide } from "./parse-core";
import type { Question } from "../src/data/types";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const mdDir = join(root, "docs", "markdown");
const outDir = join(root, "src", "data", "past-exams");

mkdirSync(outDir, { recursive: true });

const bySubject = new Map<string, Question[]>();

for (const paper of papers) {
  const md = readFileSync(join(mdDir, paper.file), "utf8");
  const questions = parsePaper(md, paper);
  if (questions.length !== 50) {
    console.warn(`⚠ ${paper.file} 解析出 ${questions.length} 題（預期 50）`);
  }
  for (const q of questions) {
    if (!["A", "B", "C", "D"].includes(q.answer)) {
      console.warn(`⚠ ${q.id} 答案異常：${q.answer}`);
    }
    if (q.choices.some((c) => c.text === "")) {
      console.warn(`⚠ ${q.id} 有空白選項`);
    }
  }
  const list = bySubject.get(paper.subjectId) ?? [];
  list.push(...questions);
  bySubject.set(paper.subjectId, list);
}

for (const guide of studyGuides) {
  const md = readFileSync(join(mdDir, guide.file), "utf8");
  const questions = parseStudyGuide(md, guide);
  if (questions.length === 0) {
    console.warn(`⚠ ${guide.file} 未解析出學習指引參考題`);
  }
  for (const q of questions) {
    if (!["A", "B", "C", "D"].includes(q.answer)) {
      console.warn(`⚠ ${q.id} 答案異常：${q.answer}`);
    }
    if (q.choices.some((c) => c.text === "")) {
      console.warn(`⚠ ${q.id} 有空白選項`);
    }
    if (q.explanation.trim().length === 0) {
      console.warn(`⚠ ${q.id} 學習指引解析為空`);
    }
  }
  const list = bySubject.get(guide.subjectId) ?? [];
  list.push(...questions);
  bySubject.set(guide.subjectId, list);
}

/**
 * AIoT 考科一的節點題數即官方指引的結構，對不上就代表指引被改版或解析漏題。
 * 這裡刻意用致命錯誤而非警告——上一次匯入時，靜默略過的解析缺陷是靠人工才發現的。
 */
const assertAiotBasics = (questions: Question[]): void => {
  const expected = aiotBasicsSections.reduce((sum, s) => sum + s.count, 0);
  const problems: string[] = [];
  if (questions.length !== expected) {
    problems.push(`解析出 ${questions.length} 題（預期 ${expected}）`);
  }
  const counts = new Map<string, number>();
  for (const q of questions) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
  for (const section of aiotBasicsSections) {
    const actual = counts.get(section.code) ?? 0;
    if (actual !== section.count) {
      problems.push(`節點「${section.code}」有 ${actual} 題（預期 ${section.count}）`);
    }
  }
  for (const q of questions) {
    if (!q.explanation.trim()) problems.push(`${q.id} 詳解為空`);
    if (q.choices.some((c) => !c.text.trim())) problems.push(`${q.id} 有空白選項`);
    if (q.choices.some((c) => /^(正確|錯誤)[。．]/.test(c.text))) {
      problems.push(`${q.id} 的選項殘留解析用語（需在 applyStudyGuideErrata 補勘誤）`);
    }
  }
  if (problems.length > 0) {
    console.error(`✗ aiot-junior-basics 解析結果不符預期：`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
};

for (const [subjectId, questions] of bySubject) {
  if (subjectId === "aiot-junior-basics") assertAiotBasics(questions);
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) console.warn(`⚠ 重複 id：${q.id}`);
    ids.add(q.id);
  }
  const file = join(outDir, `${subjectId}.json`);
  writeFileSync(file, JSON.stringify(questions, null, 2) + "\n", "utf8");
  console.log(`✓ ${subjectId}：${questions.length} 題 → ${file}`);
}
