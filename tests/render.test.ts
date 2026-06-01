import { describe, it, expect } from "vitest";
import { escapeHtml } from "../src/ui/escape";
import { renderSubjectCard, renderChoice } from "../src/ui/render";

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
