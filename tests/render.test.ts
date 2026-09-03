import { describe, it, expect } from "vitest";
import { escapeHtml } from "../src/ui/escape";
import {
  renderHome,
  renderCert,
  renderLevel,
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

  it("LLM 命題的新題顯示待複審提示", () => {
    const html = renderQuestion({ ...examQs[0], source: "generated" }, 0, 1, undefined, false, "", false);
    expect(html).toContain('class="q-source"');
    expect(html).toContain("AI 命題・待複審");
  });

  it("官方真題與官方學習指引練習評量不顯示該提示", () => {
    expect(renderQuestion(examQs[0], 0, 1, undefined, false, "", false)).not.toContain('class="q-source"');
    const guide = renderQuestion({ ...examQs[0], source: "study-guide" }, 0, 1, undefined, false, "", false);
    expect(guide).not.toContain('class="q-source"');
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
  it("LLM 命題的新題在考卷與逐題檢討都標出待複審", () => {
    const gen = [{ ...examQs[0], source: "generated" }] as any;
    expect(renderExamPaper(gen, {}, "10:00", 0)).toContain("AI 命題・待複審");
    expect(renderExamReview(gen, { q1: "B" }, 0, "回成績")).toContain("AI 命題・待複審");
    expect(renderExamPaper(examQs, {}, "10:00", 0)).not.toContain("AI 命題・待複審");
    expect(renderExamReview(examQs, { q1: "B" }, 0, "回成績")).not.toContain("AI 命題・待複審");
  });

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
    const html = renderModePicker({ subjectName: "科目<X>", drillCount: 222, drillProgressText: "上次進度：第 137 題・已作答 136 題" });
    expect(html).toContain("上次進度：第 137 題・已作答 136 題");
    expect(html).toContain("科目&lt;X&gt;");
    expect(html).not.toContain("科目<X>");
  });
  it("沒有進度時不顯示提示區塊", () => {
    const html = renderModePicker({ subjectName: "科目", drillCount: 222 });
    expect(html).not.toContain("drill-progress-hint");
  });
});

describe("模式選單的新題庫卡", () => {
  it("有新題庫時顯示第三張卡與題數", () => {
    const html = renderModePicker({ subjectName: "科目", drillCount: 222, practice: { count: 100 } });
    expect(html).toContain('data-mode="practice"');
    expect(html).toContain("新題庫練習");
    expect(html).toContain("依評鑑主題分類 100 題");
    expect(html).toContain("整份題庫由 LLM 命製，內容尚待人工複審");
  });

  it("新題庫為空時不顯示第三張卡", () => {
    expect(renderModePicker({ subjectName: "科目", drillCount: 222, practice: { count: 0 } })).not.toContain('data-mode="practice"');
    expect(renderModePicker({ subjectName: "科目", drillCount: 222 })).not.toContain('data-mode="practice"');
  });

  it("新題庫進度提示會被跳脫", () => {
    const html = renderModePicker({ subjectName: "科目", drillCount: 222, practice: { count: 100, progressText: "上次進度：第 3 題<x>" } });
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

describe("證照導覽", () => {
  it("首頁列出兩張證照，不再直接列級別", () => {
    const html = renderHome();
    expect(html).toContain('data-cert="aiap"');
    expect(html).toContain('data-cert="aiot"');
    expect(html).not.toContain('data-level="junior"');
  });

  it("AI 應用規劃師有初中級兩張級別卡", () => {
    const html = renderCert("aiap");
    expect(html).toContain('data-level="junior"');
    expect(html).toContain('data-level="senior"');
  });

  it("AIoT 目前只有初級一張級別卡", () => {
    const html = renderCert("aiot");
    expect(html).toContain('data-level="junior"');
    expect(html).not.toContain('data-level="senior"');
  });

  it("AIoT 初級兩個考科都可點入，且題數來源分別標示", () => {
    const html = renderLevel("aiot", "junior");
    expect(html).toContain('data-subject="aiot-junior-basics"');
    expect(html).toContain('data-subject="aiot-junior-iot"');
    // 考科一是官方學習指引的練習評量，考科二是自編新題，兩者的來源標示必須不同。
    expect(html).toContain("官方練習 80");
    expect(html).toContain("新題 60");
    expect(html).not.toContain("尚無題目");
  });

  it("AI 應用規劃師的級別頁不受影響", () => {
    const html = renderLevel("aiap", "senior");
    expect(html).toContain('data-subject="senior-ml"');
    expect(html).not.toContain("尚無題目");
  });
});

describe("模式選單的模擬考試卡", () => {
  it("mockExam 為 false 時不顯示模擬考試，並說明原因", () => {
    const html = renderModePicker({ subjectName: "AIoT 基礎概論", drillCount: 80, mockExam: false });
    expect(html).not.toContain('data-mode="exam"');
    expect(html).toContain('data-mode="drill"');
    expect(html).toContain("官方尚未公告題數");
  });

  it("預設仍顯示模擬考試卡", () => {
    expect(renderModePicker({ subjectName: "科目", drillCount: 222 })).toContain('data-mode="exam"');
  });
});

describe("學習主題頁的證照分組", () => {
  it("先分證照，AIoT 兩科都列出官方評鑑內容", () => {
    const html = renderStudyView();
    expect(html).toContain("AIoT 應用工程師");
    expect(html).toContain("AI 應用規劃師");
    expect(html).toContain("A2.3　工業通訊標準與資訊模型");
    expect(html).toContain("B2.2　雲端環境數據收集與平台設計");
  });

  it("筆記標籤反映出處：五科為學習指引整理、AIoT 為備考整理", async () => {
    const { studyNotes } = await import("../src/data/studyNotes");
    const { aiotStudyNotes } = await import("../src/data/studyNotes.aiot");
    const html = renderStudyView({ ...studyNotes, ...aiotStudyNotes });
    expect(html).toContain("學習指引整理");
    expect(html).toContain("備考整理");
  });

  it("備考總整理掛在證照層級，且不影響沒有總整理的證照", () => {
    const html = renderStudyView(undefined, {
      aiot: [{ heading: "最重要的八條公式", items: [{ text: "V = I × R" }] }],
    });
    expect(html).toContain("備考總整理");
    expect(html).toContain("最重要的八條公式");
    expect(html).toContain("V = I × R");
    // 只出現一次——AI 應用規劃師沒有總整理，不應跟著長出空的 details。
    expect(html.match(/備考總整理/g)).toHaveLength(1);
  });
});

describe("AIoT 備考整理內容", () => {
  it("15 個節點都有七個項目的筆記", async () => {
    const { aiotStudyNotes } = await import("../src/data/studyNotes.aiot");
    const codes = [
      ...["A1.1", "A1.2", "A2.1", "A2.2", "A2.3", "A2.4", "A2.5", "A3.1", "A3.2"]
        .map((code) => ["aiot-junior-basics", code] as const),
      ...["B1.1", "B1.2", "B1.3", "B2.1", "B2.2", "B2.3"]
        .map((code) => ["aiot-junior-iot", code] as const),
    ];
    expect(codes).toHaveLength(15);
    for (const [subjectId, code] of codes) {
      const sections = aiotStudyNotes[subjectId]?.[code];
      expect(sections, `${subjectId} ${code} 缺筆記`).toBeDefined();
      expect(sections!.map((s) => s.heading)).toEqual([
        "必懂觀念", "重要縮寫", "容易混淆", "公式與計算", "實務案例", "可能考法", "推薦資源",
      ]);
      for (const section of sections!) {
        expect(section.items.length, `${code} 的「${section.heading}」為空`).toBeGreaterThan(0);
      }
    }
  });

  it("節點碼與 studyGuide 的節點一一對應，沒有孤兒筆記", async () => {
    const { aiotStudyNotes } = await import("../src/data/studyNotes.aiot");
    const { getStudyGuide } = await import("../src/data/studyGuide");
    for (const subjectId of ["aiot-junior-basics", "aiot-junior-iot"]) {
      const guideCodes = getStudyGuide(subjectId)!.topics.map((t) => t.code).sort();
      expect(Object.keys(aiotStudyNotes[subjectId]).sort()).toEqual(guideCodes);
    }
  });
});

describe("筆記的三種呈現型別", () => {
  it("table 渲染成真表格，且包在可橫向捲動的容器裡", () => {
    const notes = {
      "aiot-junior-basics": {
        "A3.2": [{
          heading: "容易混淆",
          items: [{
            text: "UART / I²C / SPI",
            table: {
              headers: ["", "UART", "I²C", "SPI"],
              rows: [["時脈線", "無", "SCL", "SCLK"], ["全雙工", "是", "否", "是"]],
            },
          }],
        }],
      },
    };
    const html = renderStudyView(notes);
    expect(html).toContain("note-table-wrap");
    expect(html).toContain("<th>UART</th>");
    expect(html).toContain("<td>SCLK</td>");
    expect(html).toContain("<caption>UART / I²C / SPI</caption>");
  });

  it("formula 用等寬強調塊，note 為選用說明", () => {
    const notes = {
      "aiot-junior-basics": {
        "A3.2": [{
          heading: "公式與計算",
          items: [
            { text: "ADC 解析度", formula: { expr: "Resolution = Vref / 2^N", note: "12-bit、3.3 V → ≈ 0.806 mV" } },
            { text: "Nyquist", formula: { expr: "f_s ≥ 2 × f_max" } },
          ],
        }],
      },
    };
    const html = renderStudyView(notes);
    expect(html).toContain("note-formula");
    expect(html).toContain("Resolution = Vref / 2^N");
    expect(html).toContain("≈ 0.806 mV");
    expect(html).toContain("f_s ≥ 2 × f_max");
  });

  it("flow 渲染成帶箭頭的步驟列", () => {
    const notes = {
      "aiot-junior-basics": {
        "A2.1": [{
          heading: "必懂觀念",
          items: [{ text: "資料路徑", flow: ["Sensor", "Gateway", "Cloud"] }],
        }],
      },
    };
    const html = renderStudyView(notes);
    expect(html).toContain("note-flow");
    expect(html).toContain("Sensor");
    expect(html).toContain("Cloud");
  });

  it("三種型別的內容都會被跳脫", () => {
    const notes = {
      "aiot-junior-basics": {
        "A2.1": [{
          heading: "必懂觀念",
          items: [
            { text: "<x>", table: { headers: ["<h>"], rows: [["<r>"]] } },
            { text: "f", formula: { expr: "<e>", note: "<n>" } },
            { text: "s", flow: ["<s>"] },
          ],
        }],
      },
    };
    const html = renderStudyView(notes);
    for (const raw of ["<x>", "<h>", "<r>", "<e>", "<n>", "<s>"]) {
      expect(html).not.toContain(raw);
    }
    expect(html).toContain("&lt;h&gt;");
  });

  it("表格算一則重點，不是每列一則", () => {
    const notes = {
      "aiot-junior-basics": {
        "A3.2": [{
          heading: "容易混淆",
          items: [{
            text: "三者比較",
            table: { headers: ["a"], rows: [["1"], ["2"], ["3"], ["4"]] },
          }],
        }],
      },
    };
    expect(renderStudyView(notes)).toContain("1 則重點");
  });
});

describe("學習主題頁的導覽工具", () => {
  it("兩張證照各有一份工具列，目錄涵蓋全部主題", () => {
    const html = renderStudyView();
    expect(html).toContain('data-cert-section="aiap"');
    expect(html).toContain('data-cert-section="aiot"');
    expect(html.match(/data-study-search/g) ?? []).toHaveLength(2);
    // 五科 18 個評鑑主題 + AIoT 15 個評鑑內容節點。
    expect(html.match(/data-study-jump="node-/g) ?? []).toHaveLength(33);
    expect(html).toContain('data-study-jump="node-L111"');
    expect(html).toContain('data-study-jump="node-A1-1"');
  });

  it("五科的目錄籤標出級別，避免兩個「科目1」分不清", () => {
    const html = renderStudyView();
    expect(html).toContain("初級科目1");
    expect(html).toContain("中級科目1");
  });

  // 考前速記靠 formula／confuse 兩節篩選，五科的筆記沒有這種分節，
  // 按了會整片空白，因此依資料決定要不要出這顆按鈕。
  it("只有具備公式／易混淆分節的證照才出現考前速記", async () => {
    const { studyNotes } = await import("../src/data/studyNotes");
    const { aiotStudyNotes } = await import("../src/data/studyNotes.aiot");
    const html = renderStudyView({ ...studyNotes, ...aiotStudyNotes });
    expect(html.match(/data-study-action="cram"/g) ?? []).toHaveLength(1);
    const aiotPart = html.slice(html.indexOf('data-cert-section="aiot"'));
    expect(aiotPart).toContain('data-study-action="cram"');
  });

  it("節點錨點把 . 換成 -，避開 querySelector 的跳脫問題", () => {
    const html = renderStudyView();
    expect(html).toContain('id="node-A2-2"');
    expect(html).toContain('id="node-B2-3"');
    expect(html).not.toContain('id="node-A2.2"');
    expect(html).toContain('data-node="A2.2"');
  });

  it("筆記各節帶 data-note-section，速記模式才有東西可篩", async () => {
    const { aiotStudyNotes } = await import("../src/data/studyNotes.aiot");
    const html = renderStudyView(aiotStudyNotes);
    expect(html).toContain('data-note-section="formula"');
    expect(html).toContain('data-note-section="confuse"');
    expect(html).toContain('data-note-section="abbr"');
  });
});

describe("節點動作列與縮寫速查", () => {
  it("15 個 AIoT 節點與 18 個五科主題全部都有練題按鈕", () => {
    const html = renderStudyView();
    expect(html.match(/data-topic-drill="/g) ?? []).toHaveLength(33);
    expect(html.match(/node-drill is-empty/g) ?? []).toHaveLength(0);
    expect(html).toContain('data-topic-drill="aiot-junior-basics|A2.2"');
    expect(html).toContain('data-topic-drill="aiot-junior-iot|B2.3"');
    expect(html).toContain('data-topic-drill="junior-ai-basics|L111"');
  });

  // 五科的學習主題是三碼評鑑主題，題目掛在五碼評鑑內容上，一個主題涵蓋數個節點。
  it("五科的主題題數是其下所有評鑑內容節點的總和", async () => {
    const { getTopicCounts } = await import("../src/data/index");
    const { topicMatchesGuideCode } = await import("../src/domain/assessmentTopics");
    const counts = getTopicCounts("junior-ai-basics");
    const expected = Object.entries(counts)
      .filter(([topic]) => topicMatchesGuideCode(topic, "L113"))
      .reduce((sum, [, n]) => sum + n, 0);
    expect(expected).toBeGreaterThan(1);
    expect(renderStudyView()).toContain(`練這個主題的 ${expected} 題`);
  });

  it("已讀節點反映在按鈕狀態與計數上", () => {
    const html = renderStudyView(undefined, undefined, { readNodes: new Set(["A1.1", "B2.3"]) });
    expect(html).toContain("已讀 2 / 15");   // AIoT
    expect(html).toContain("已讀 0 / 18");   // AI 應用規劃師
    expect(html).toContain('data-study-read="A1.1"\n              aria-pressed="true"');
  });

  it("有縮寫資料才渲染速查表，每列可被搜尋篩選", async () => {
    const { aiotAbbreviations } = await import("../src/data/studyNotes.aiot");
    expect(renderStudyView()).not.toContain("縮寫速查");
    const html = renderStudyView(undefined, undefined, { abbreviations: { aiot: aiotAbbreviations } });
    expect(html).toContain("縮寫速查");
    expect(html.match(/data-abbr-row/g) ?? []).toHaveLength(aiotAbbreviations.length);
    expect(html).toContain("Unified Namespace");
  });
});

describe("getTopicCounts", () => {
  it("AIoT 考科一的九個節點題數符合官方結構", async () => {
    const { getTopicCounts } = await import("../src/data/index");
    const counts = getTopicCounts("aiot-junior-basics");
    expect(counts["A1.1 AI 基礎概念"]).toBe(5);
    expect(counts["A2.2 常見通訊協定與網路層技術"]).toBe(10);
    expect(Object.keys(counts)).toHaveLength(9);
    const iot = getTopicCounts("aiot-junior-iot");
    expect(Object.keys(iot)).toHaveLength(6);
    expect(iot["B2.3 智慧製造流程優化與成本控制"]).toBe(10);
  });
});
