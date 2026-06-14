import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { papers, studyGuides } from "./paper-manifest";
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

for (const [subjectId, questions] of bySubject) {
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) console.warn(`⚠ 重複 id：${q.id}`);
    ids.add(q.id);
  }
  const file = join(outDir, `${subjectId}.json`);
  writeFileSync(file, JSON.stringify(questions, null, 2) + "\n", "utf8");
  console.log(`✓ ${subjectId}：${questions.length} 題 → ${file}`);
}
