import { describe, it, expect } from "vitest";
import { escapeHtml } from "../src/ui/escape";
import {
  renderSubjectCard,
  renderChoice,
  renderStudyView,
  renderPaperPicker,
  renderQuestion,
  renderExamPaper,
  renderExamReview,
  renderStudyLoading,
} from "../src/ui/render";
import { studyNotes } from "../src/data/studyNotes";

describe("escapeHtml", () => {
  it("跳脫角括號與引號", () => {
    expect(escapeHtml(`<b>"&'`)).toBe("&lt;b&gt;&quot;&amp;&#39;");
  });
});

describe("renderSubjectCard", () => {
  it("含科目名稱與題數、跳脫內容", () => {
    const html = renderSubjectCard(
      { id: "s", level: "junior", code: "科目1", name: "人工智慧基礎概論", durationMinutes: 75 },
      { total: 100, pastExam: 100, generated: 0 },
    );
    expect(html).toContain("人工智慧基礎概論");
    expect(html).toContain("100");
    expect(html).toContain('data-subject="s"');
  });
});

describe("renderChoice", () => {
  it("作答中：未標示對錯", () => {
    const html = renderChoice({ id: "A", text: "<x>" }, { selected: false, reveal: false, correct: false });
    expect(html).toContain("&lt;x&gt;");
    expect(html).not.toContain("correct");
  });
  it("檢討中：正解標 correct、誤選標 wrong", () => {
    const right = renderChoice({ id: "A", text: "a" }, { selected: false, reveal: true, correct: true });
    expect(right).toContain("correct");
    const wrong = renderChoice({ id: "B", text: "b" }, { selected: true, reveal: true, correct: false });
    expect(wrong).toContain("wrong");
  });
});

describe("renderStudyView", () => {
  it("含科目名稱、主題標題、外部連結安全屬性、跳脫", () => {
    const html = renderStudyView(studyNotes);
    expect(html).toContain("學習主題");
    expect(html).toContain("人工智慧基礎概論"); // 科目名稱
    expect(html).toContain("學習指引整理");
    expect(html).toContain("則重點");
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });
  it("載入畫面提示正在載入學習指引整理", () => {
    const html = renderStudyLoading();
    expect(html).toContain("正在載入學習指引整理");
  });
});

describe("renderPaperPicker", () => {
  it("含科目名稱與三份按鈕", () => {
    const html = renderPaperPicker("人工智慧基礎概論", 3);
    expect(html).toContain("人工智慧基礎概論");
    expect((html.match(/data-paper="/g) ?? []).length).toBe(3);
  });
});

const examQs = [
  { id: "q1", subjectId: "s", prompt: "P1<x>", choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" }, { id: "C", text: "c" }, { id: "D", text: "d" }],
    answer: "A", explanation: "因為 A", topic: "T", difficulty: "中", source: "past-exam" },
] as any;

describe("renderQuestion", () => {
  it("刷題作答不顯示交卷", () => {
    const html = renderQuestion(
      examQs[0],
      0,
      1,
      undefined,
      false,
      "",
      false,
      { filter: "all", counts: { all: 1, wrong: 0, unanswered: 1 } },
    );
    expect(html).not.toContain('data-nav="submit"');
    expect(html).not.toContain("交卷");
    expect(html).toContain("上一題");
    expect(html).toContain("下一題");
    expect(html).toContain('data-filter="wrong"');
    expect(html).toContain('aria-pressed="true"');
  });

  it("刷題檢討保留回成績", () => {
    const html = renderQuestion(examQs[0], 0, 1, "B", true, "", true);
    expect(html).toContain('data-nav="result"');
    expect(html).toContain("回成績");
  });

  it("揭曉時顯示正解提示、詳解與選項解析", () => {
    const html = renderQuestion(examQs[0], 0, 1, "B", true, "", false);
    expect(html).toContain("答錯");
    expect(html).toContain("正解：A.");
    expect(html).toContain("選項解析");
    expect(html).toContain("此選項不是本題答案");
    expect(html).toContain("因為 A");
  });

  it("選項解析優先取用詳解中的選項段落", () => {
    const html = renderQuestion({
      ...examQs[0],
      answer: "B",
      explanation: "B 是情感分析核心。A 的語言風格／語氣分析屬風格分析；C 是機器翻譯任務；D 是文本摘要任務。",
    }, 0, 1, "D", true, "", false);
    expect(html).toContain("A 的語言風格／語氣分析屬風格分析");
    expect(html).toContain("C 是機器翻譯任務");
    expect(html).toContain("D 是文本摘要任務");
  });
});

describe("renderExamPaper", () => {
  it("含 data-qid、已作答計數、交卷、跳脫；依 answers 標 selected", () => {
    const html = renderExamPaper(examQs, { q1: "B" }, "10:00", 1);
    expect(html).toContain('data-qid="q1"');
    expect(html).toContain("已作答");
    expect(html).toContain('data-nav="submit"');
    expect(html).toContain("&lt;x&gt;");
    expect(html).toMatch(/class="[^"]*selected[^"]*"[^>]*data-qid="q1"[^>]*data-choice="B"/);
  });
});

describe("renderExamReview", () => {
  it("標示正解與你的作答、含詳解", () => {
    const html = renderExamReview(examQs, { q1: "B" }, 0, "回成績");
    expect(html).toContain("因為 A");
    expect(html).toMatch(/class="[^"]*correct[^"]*"><span class="choice-id">A/);
    expect(html).toMatch(/class="[^"]*wrong[^"]*"><span class="choice-id">B/);
  });
});
