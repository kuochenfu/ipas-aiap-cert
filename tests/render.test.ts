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

  renderTopicStats,} from "../src/ui/render";
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

  // 中級詳解常把字母寫在名詞後的括號裡（「TF-IDF（A）產生⋯」）而非子句開頭。
  // 只認子句開頭的話，這類詳解會整則抽不出東西、四條全落到通用填充句。
  it("選項解析也認得括號寫法，並從該子句開頭取起", () => {
    const html = renderQuestion({
      ...examQs[0],
      answer: "B",
      explanation:
        "Word2Vec（B）產生稠密語意向量。TF-IDF（A）產生的是稀疏的加權計數；"
        + "Stop Words（C）是要被濾掉的停用詞；Bag-of-Words（D）只計次而忽略語序（L211 自然語言處理）。",
    }, 0, 1, "A", true, "", false);
    // 只看「選項解析」區塊本身——整則詳解也會被渲染在上方的詳解區，
    // 對整份 HTML 做否定斷言會誤判成失敗。
    const segments = Object.fromEntries(
      [...html.matchAll(/<span class="choice-id">([A-D])<\/span>\s*<p>([^<]*)<\/p>/g)]
        .map((m) => [m[1], m[2]]),
    );
    // 連同括號前的主詞一起取，而不是只從括號後開始的殘句
    expect(segments.A).toBe("TF-IDF（A）產生的是稀疏的加權計數");
    expect(segments.C).toBe("Stop Words（C）是要被濾掉的停用詞");
    // 詳解結尾的主題標註屬於整則詳解，不該黏在最後一個選項的解析上
    expect(segments.D).toBe("Bag-of-Words（D）只計次而忽略語序");
    expect(html).not.toContain("此選項不是本題答案");
  });

  // 一個子句常一次談兩個干擾項（「C 的X與 D 的Y 都⋯」）。這句話確實同時解釋了兩者，
  // 若只給前一個，後一個會被切成空白而落回通用填充句。
  it("同一子句同時談兩個選項時，兩者共用該段解析", () => {
    const html = renderQuestion({
      ...examQs[0],
      answer: "B",
      explanation:
        "取值只有 0 與 1（B）。A 的任何實數對應連續分佈；"
        + "C 的正整數與 D 的任意整數雖然都是離散取值，但範圍遠大於兩個值。",
    }, 0, 1, "A", true, "", false);
    const segments = Object.fromEntries(
      [...html.matchAll(/<span class="choice-id">([A-D])<\/span>\s*<p>([^<]*)<\/p>/g)]
        .map((m) => [m[1], m[2]]),
    );
    expect(segments.A).toBe("A 的任何實數對應連續分佈");
    const shared = "C 的正整數與 D 的任意整數雖然都是離散取值，但範圍遠大於兩個值";
    expect(segments.C).toBe(shared);
    expect(segments.D).toBe(shared);
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

  // 這三者是螢幕閱讀器在「有時間限制的考試」裡唯一的資訊來源，
  // 而計時器與已作答數都是就地更新、不重繪的，少了標記就完全無聲。
  describe("輔助技術標記", () => {
    const html = renderExamPaper(examQs, { q1: "B" }, "10:00", 1);
    it("計時器標為 timer 並具名，且刻意不逐秒播報", () => {
      expect(html).toMatch(/class="timer" role="timer" aria-label="[^"]+"/);
      // role="timer" 隱含 aria-live="off"；若有人補上 aria-live 會變成每秒打斷朗讀。
      expect(html).not.toMatch(/class="timer"[^>]*aria-live/);
    });
    it("已作答計數以 polite 播報（只在使用者作答時變動）", () => {
      expect(html).toMatch(/class="progress" aria-live="polite" aria-atomic="true"/);
    });
    it("具備供時間門檻播報用的隱藏區域", () => {
      expect(html).toMatch(/class="sr-live" role="status" aria-live="assertive"/);
    });
  });
});

describe("renderExamReview", () => {
  it("標示正解與你的作答、含詳解", () => {
    const html = renderExamReview(examQs, { q1: "B" }, 0, "回成績");
    expect(html).toContain("因為 A");
    expect(html).toMatch(/class="[^"]*correct[^"]*"><span class="choice-id">A/);
    expect(html).toMatch(/class="[^"]*wrong[^"]*"><span class="choice-id">B/);
  });

  it("顯示逐項選項解析", () => {
    const html = renderExamReview([{
      ...examQs[0],
      choiceExplanations: { B: "B 選項的解析", C: "C 選項的解析", D: "D 選項的解析" },
    }], { q1: "B" }, 0, "回成績");
    expect(html).toContain("選項解析");
    expect(html).toContain("B 選項的解析");
    expect(html).toContain("C 選項的解析");
    expect(html).toContain("D 選項的解析");
  });

  it("沒有手寫選項解析時不顯示該區塊，不以通用填充句充數", () => {
    // 中級三科目前皆無手寫選項解析；寧可不顯示，也不要讓「沒有解析」看起來像「有解析」。
    const html = renderExamReview(examQs, { q1: "B" }, 0, "回成績");
    expect(html).not.toContain("選項解析");
    expect(html).not.toContain("此選項不是本題答案");
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

describe("renderTopicStats", () => {
  const rows = [
    { topic: "L23101 機率／統計", total: 12, answered: 4, correct: 3 },
    { topic: "L23102 線性代數", total: 9, answered: 0, correct: 0 },
  ];
  const html = renderTopicStats("機器學習技術與應用", rows, "回刷題");

  it("列出節點、已作答數與答對率", () => {
    expect(html).toContain("L23101 機率／統計");
    expect(html).toContain("4 / 12");
    expect(html).toContain("3／4");
    expect(html).toContain("75%");
  });
  it("尚未作答的節點不顯示 0% 而顯示提示", () => {
    // 0% 會被讀成「全錯」，與「還沒做」是完全不同的意思
    expect(html).toContain("尚未作答");
    expect(html).not.toMatch(/0／0/);
  });
  it("含返回刷題的入口且文字經跳脫", () => {
    expect(html).toContain('data-nav="back-play"');
    expect(renderTopicStats("<x>", rows, "回刷題")).toContain("&lt;x&gt;");
  });
});
