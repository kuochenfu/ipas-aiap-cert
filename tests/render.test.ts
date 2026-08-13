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
  renderModePicker,
  renderDrillEmpty,
} from "../src/ui/render";
import type { StudyNotesBySubject } from "../src/data/types";
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
    expect(html).toContain('data-tts-section');
    expect(html).toContain('data-tts-rate="1"');
    expect(html).toContain("朗讀 3.1 人工智慧概念");
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
      { filter: "all", counts: { all: 1, wrong: 0, unanswered: 1 }, total: 1 },
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

  it("有評鑑主題碼時顯示主題標籤", () => {
    const html = renderQuestion({ ...examQs[0], topic: "L11101 AI 的定義與分類" }, 0, 1, undefined, false, "", false);
    expect(html).toContain('class="q-topic"');
    expect(html).toContain("L11101 AI 的定義與分類");
  });

  it("主題為未分類時不顯示主題標籤", () => {
    const html = renderQuestion({ ...examQs[0], topic: "未分類" }, 0, 1, undefined, false, "", false);
    expect(html).not.toContain('class="q-topic"');
  });

  it("主題為原始題庫的自由文字主題時不顯示主題標籤", () => {
    // 例如 src/data/generated/junior-ai-basics.ts 裡的自由文字主題（原始題庫不應出現標籤）。
    const html = renderQuestion({ ...examQs[0], topic: "資料處理與分析概念" }, 0, 1, undefined, false, "", false);
    expect(html).not.toContain('class="q-topic"');
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

describe("renderStudyView with nested notes", () => {
  it("nested rendering: parent with children produces nested <ul> inside <li>", () => {
    const testNotes: StudyNotesBySubject = {
      "junior-ai-basics": {
        L111: [
          {
            heading: "AI 基礎概念",
            items: [
              {
                text: "AI 的定義",
                children: [
                  { text: "狹義 AI" },
                  { text: "廣義 AI" },
                ],
              },
            ],
          },
        ],
      },
    };
    const html = renderStudyView(testNotes);
    // 檢查外層 <ul> 含有 <li>
    expect(html).toContain("<li>");
    // 檢查父項文本已跳脫並在 <span class="note-text">
    expect(html).toContain('<span class="note-text">AI 的定義</span>');
    // 檢查巢狀 <ul> 存在於父項後
    expect(html).toMatch(/<li>\s*<span class="note-text">AI 的定義<\/span>\s*<ul>/);
    // 檢查子項文本在巢狀 <ul> 中
    expect(html).toContain('<span class="note-text">狹義 AI</span>');
    expect(html).toContain('<span class="note-text">廣義 AI</span>');
  });

  it("escaping: item text with <script> or & is HTML-escaped in output", () => {
    const testNotes: StudyNotesBySubject = {
      "junior-ai-basics": {
        L111: [
          {
            heading: "危險文本",
            items: [
              {
                text: "包含 <script>alert('xss')</script> 與 & 符號",
              },
            ],
          },
        ],
      },
    };
    const html = renderStudyView(testNotes);
    // 驗證 <script> 被跳脫為 &lt;script&gt;
    expect(html).toContain("&lt;script&gt;");
    // 驗證 & 被跳脫為 &amp;
    expect(html).toContain("&amp;");
    // 確保原始危險標籤不出現
    expect(html).not.toContain("<script>alert");
  });

  it("leaf count: section with 1 parent + 2 children + 1 standalone leaf = 3 则重點", () => {
    const testNotes: StudyNotesBySubject = {
      "junior-ai-basics": {
        L111: [
          {
            heading: "計數測試",
            items: [
              {
                text: "父項（非葉子）",
                children: [
                  { text: "子項1" },
                  { text: "子項2" },
                ],
              },
              {
                text: "獨立葉子項",
              },
            ],
          },
        ],
      },
    };
    const html = renderStudyView(testNotes);
    // 檢查摘要中顯示正確的葉子數（子項1 + 子項2 + 獨立葉子項 = 3 個葉子）
    expect(html).toContain("3 則重點");
  });
});

describe("刷題跳題列", () => {
  const controls = { filter: "all" as const, counts: { all: 222, wrong: 3, unanswered: 100 }, total: 222 };

  it("刷題卡片含跳題輸入框與重置鈕", () => {
    const html = renderQuestion(examQs[0], 0, 222, undefined, false, "", false, controls);
    expect(html).toContain('class="drill-jump-input"');
    expect(html).toContain('max="222"');
    expect(html).toContain('data-nav="jump"');
    expect(html).toContain('data-nav="drill-reset"');
  });

  it("篩選結果為空的畫面也有跳題列", () => {
    const html = renderDrillEmpty({ ...controls, filter: "wrong", counts: { all: 222, wrong: 0, unanswered: 100 } });
    expect(html).toContain('data-nav="jump"');
  });

  it("考試單頁不含跳題列", () => {
    const html = renderQuestion(examQs[0], 0, 50, undefined, false, "10:00", false);
    expect(html).not.toContain('data-nav="jump"');
  });
});

describe("模式選單進度提示", () => {
  it("有進度時顯示提示並跳脫 HTML", () => {
    const html = renderModePicker("科目<X>", 222, "上次進度：第 137 題・已作答 136 題");
    expect(html).toContain("上次進度：第 137 題・已作答 136 題");
    expect(html).toContain("科目&lt;X&gt;");
    expect(html).not.toContain("科目<X>");
  });
  it("沒有進度時不顯示提示區塊", () => {
    const html = renderModePicker("科目", 222);
    expect(html).not.toContain("drill-progress-hint");
  });
});

describe("模式選單的新題庫卡", () => {
  it("有新題庫時顯示第三張卡與題數", () => {
    const html = renderModePicker("科目", 222, undefined, { count: 100 });
    expect(html).toContain('data-mode="practice"');
    expect(html).toContain("新題庫練習");
    expect(html).toContain("依評鑑主題分類 100 題");
  });

  it("新題庫為空時不顯示第三張卡", () => {
    expect(renderModePicker("科目", 222, undefined, { count: 0 })).not.toContain('data-mode="practice"');
    expect(renderModePicker("科目", 222)).not.toContain('data-mode="practice"');
  });

  it("新題庫進度提示會被跳脫", () => {
    const html = renderModePicker("科目", 222, undefined, { count: 100, progressText: "上次進度：第 3 題<x>" });
    expect(html).toContain("第 3 題&lt;x&gt;");
    expect(html).not.toContain("第 3 題<x>");
  });
});
