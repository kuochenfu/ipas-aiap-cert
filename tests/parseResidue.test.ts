import { describe, expect, it } from "vitest";
import { getQuestions } from "../src/data/index";
import type { Question } from "../src/data/types";
import { subjects } from "../src/domain/catalog";

/**
 * 解析管線的資料健檢。
 *
 * 動機（2026-08-17）：匯入 115-1 中級三份考卷時觸發了三個解析器缺陷，
 * 三者都**不會讓解析失敗**——題數正確、選項有文字，只是文字裡多黏了一截屬於
 * 別的結構元素的內容：
 *   1. 欄位標題順序相反（「題目 答案」）被當成內文黏進題幹。
 *   2. 「二、程式題」區塊標題黏進前一題最後一個選項。
 *   3. 跨題共用引文被 pdftotext 斷成兩行後偵測失效，整段前言被併進前一題選項。
 *
 * `parse-past-papers.ts` 既有的兩條警告（題數不符、空白選項）一條都沒攔到。
 * 這裡改以「內容標記」偵測：某些字串只可能出現在頁首頁尾、區塊標題或共用引文中，
 * 一旦出現在題幹或選項裡，就代表解析邊界抓錯了。
 */

const allQuestions: Question[] = subjects.flatMap((s) => getQuestions(s.id));
const fieldsOf = (q: Question): string[] => [q.prompt, ...q.choices.map((c) => c.text)];

const residuePatterns: { name: string; re: RegExp }[] = [
  {
    // 跨題共用引文（圖／表／程式碼題的前言）。它屬於題組的引言，
    // 絕不該出現在單一選項或題幹內文裡。缺陷 3 正是這一類。
    name: "跨題共用引文",
    re: /請?(依據|根據)[^。]{0,20}回答|回答第\s*\d+\s*[~～至-]?\s*\d*\s*題/,
  },
  {
    // 考卷的區塊標題與表格欄位標題。缺陷 1、2 都是這一類。
    name: "區塊或欄位標題",
    re: /一、選擇題|二、程式題|答案\s*題\s*目|題\s*目\s*答\s*案|第\s*\d+\s*頁，?共/,
  },
  {
    // 學習指引解析區塊的標記。若外洩到題幹或選項，代表答案區塊的邊界沒切乾淨。
    name: "學習指引解析標記",
    re: /Ans（|Ans\(|解析：/,
  },
  {
    // 學習指引的章節頁尾，例「3-22」。限定為欄位結尾才算，
    // 否則會誤判「提供 3-5 個案例」這類正常的數字區間。
    name: "章節頁尾",
    re: /(^|[^0-9])\d+-\d{1,2}\s*$/,
  },
  {
    // 選項尾端接著下一題的題號，代表題目邊界抓錯。
    name: "選項尾端題號",
    re: /\d+\.\s*$/,
  },
];

describe("解析管線殘留健檢（題幹與選項）", () => {
  for (const { name, re } of residuePatterns) {
    it(`題幹與選項不得殘留「${name}」`, () => {
      const offenders = allQuestions
        .filter((q) => fieldsOf(q).some((text) => re.test(text)))
        .map((q) => q.id);
      expect(offenders).toEqual([]);
    });
  }
});

/**
 * 中級三科的 110 題學習指引參考題，詳解原本壞在四個地方：正解選項原文黏在開頭、
 * 沒切掉的「解析：」標記、整段章節前言被併進來（每科最後一題各多出數百字），
 * 以及 `senior-ml-guide-q032` 的答案區塊錯位（詳解講的是另一題的內容）。
 * 2026-08-17 已全數以手寫詳解覆蓋（backlog T2），此處不再允許任何殘留。
 */
describe("解析管線殘留健檢（詳解）", () => {
  it("詳解不得殘留解析管線標記", () => {
    const offenders = allQuestions
      .filter((q) => /解析：|Ans（/.test(q.explanation))
      .map((q) => q.id);
    expect(offenders).toEqual([]);
  });

  it("詳解不得混入學習指引的章節前言", () => {
    // 章節前言動輒數百字且以「本章」自稱；正常詳解不會出現這種敘述。
    const offenders = allQuestions
      .filter((q) => /本章(將|「)|_No extractable text/.test(q.explanation))
      .map((q) => q.id);
    expect(offenders).toEqual([]);
  });
});
