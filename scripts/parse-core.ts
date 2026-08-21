import type { ChoiceId, Question } from "../src/data/types";

/** 學習指引某一小節的節點碼與題數，依練習評量出現順序排列，用於回填 topic。 */
export type GuideSection = { code: string; count: number };

export type ParseContext = {
  subjectId: string;
  examCode: string;
  examLabel: string;
  /**
   * 學習指引的選項標記樣式。AI 應用規劃師的指引用全形「（A）」，
   * AIoT 應用工程師的指引用半形「(A)」。省略時維持全形，既有五科行為不變。
   */
  choiceMarker?: "fullwidth" | "halfwidth";
  /**
   * 解答區塊為逐項選項解析（`(A) 錯誤。…`）而非整段散文時設為 true。
   * 同一份指引可兩種型態混用，逐題判斷；散文題仍走原路徑。
   */
  perChoiceExplanations?: boolean;
  source?: Question["source"];
  sections?: GuideSection[];
};

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];

// 雜訊行：markdown 結構、頁首頁尾、欄位標題
const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  line.startsWith("- Source") ||
  line.startsWith("- Pages") ||
  line.startsWith("- Conversion") ||
  /^\d+$/.test(line) ||
  line.includes("【公告試題】") ||
  line.startsWith("第一科") ||
  line.startsWith("第二科") ||
  line.startsWith("第三科") ||
  line.startsWith("考試日期") ||
  line.startsWith("一、選擇題") ||
  // 中級考卷後半為程式題，區塊標題同樣是雜訊；漏了會被併進前一題最後一個選項。
  line.startsWith("二、程式題") ||
  // 「答案 題目」標題，可能在「題目」中含空白（答案 題 目），
  // 或被 pdftotext 拆成「答」「案」「題目」三行。
  // 115-1 中級科目三後段頁面的欄位順序相反，輸出為「題目 答案」。
  /^答案\s*題\s*目$/.test(line) ||
  /^題\s*目\s*答\s*案$/.test(line) ||
  line === "答" ||
  line === "案" ||
  line === "題目" ||
  /^第\s*\d+\s*頁/.test(line) ||
  // 圖表分隔線（pdftotext 將 PDF 內表格框線輸出為連續 - 或 = ）。
  /^[-=]{3,}$/.test(line);

// 答案字母可能為半形 A-D，也可能被 pdftotext 輸出為全形 Ａ-Ｄ。
const questionStart = /^([A-DＡ-Ｄ])\s+(\d+)\.\s*(.*)$/;
const choiceStart = /^\(([A-D])\)\s*(.*)$/;
const guideQuestionStart = /^(\d+)\.\s+(?!Ans[（(])(.+)$/;
const GUIDE_CHOICE_START = {
  fullwidth: /^（([A-D])）\s*(.*)$/,
  halfwidth: /^\(([A-D])\)\s*(.*)$/,
} as const;
const guideAnswerStart = /^(\d+)\.\s*Ans（([A-D])）\s*(.*)$/;

// 將全形英文字母 Ａ-Ｚ 正規化為半形 A-Z（僅作用於答案字母）。
const toHalfWidthLetter = (ch: string): ChoiceId => {
  const code = ch.charCodeAt(0);
  if (code >= 0xff21 && code <= 0xff3a) {
    return String.fromCharCode(code - 0xff21 + 0x41) as ChoiceId;
  }
  return ch as ChoiceId;
};

// 一行內可能塞入多個選項，例：「(A)MAE；(B)MSE；(C)RMSE；(D)R²」。
// 依「下一個預期字母」切分，避免誤切到選項內文中出現的 (A) 等括號字母。
type SplitChoice = { id: ChoiceId; text: string };
const splitInlineChoices = (id: ChoiceId, rest: string): SplitChoice[] => {
  const order: ChoiceId[] = ["A", "B", "C", "D"];
  const out: SplitChoice[] = [{ id, text: "" }];
  let expectedIndex = order.indexOf(id) + 1;
  let buf = "";
  // 掃描 rest，遇到「下一個預期字母」的 (X) 才切新選項。
  for (let i = 0; i < rest.length; i++) {
    const nextExpected = order[expectedIndex];
    if (
      nextExpected &&
      rest[i] === "(" &&
      rest[i + 1] === nextExpected &&
      rest[i + 2] === ")"
    ) {
      out[out.length - 1].text = buf;
      out.push({ id: nextExpected, text: "" });
      expectedIndex += 1;
      buf = "";
      i += 2; // 跳過 X)
      continue;
    }
    buf += rest[i];
  }
  out[out.length - 1].text = buf;
  return out;
};

type Draft = {
  number: number;
  answer: ChoiceId;
  promptParts: string[];
  choices: { id: ChoiceId; parts: string[] }[];
};

const stripTrailing = (text: string): string => text.replace(/[；;]\s*$/, "");

// pdftotext 會把「請根據此資訊回答 42~45 題」這類跨題共用引文（shared stem）
// 接在前一題最後選項之後。這段文字屬於後續題目，不應併入選項，故予以移除。
// 觸發詞只出現在共用引文，不會出現在正常選項內文。
const SHARED_STEM_TRIGGER =
  /(請?根據[^。]*回答|回答(下列|後續)?[^。]*第?\s*\d+\s*[~～至-]\s*\d+\s*題|回答第\s*\d+\s*題)/;
// 在「行（part）」層級切除共用引文。第一個 part 是選項/題幹本體（marker 行），
// 其後的延續行若出現共用引文觸發詞，代表本欄位後方接的是「下一組題目的
// 共用引文」整段敘述（圖／表／程式碼題的前言），與本選項無關，故予切除。
//
// 觸發詞常被 pdftotext 斷成兩行（「…請回答」／「第 42~43 題。」），單獨比對任一行
// 都不會命中，故一律比對「從該行起串接到底」的字串；再取最早命中的位置切開，
// 使該行之前合法的跨行延續得以保留。
const dropSharedStemParts = (parts: string[]): string[] => {
  for (let i = 1; i < parts.length; i++) {
    if (SHARED_STEM_TRIGGER.test(parts.slice(i).join(""))) return parts.slice(0, i);
  }
  return parts;
};

export const parsePaper = (markdown: string, ctx: ParseContext): Question[] => {
  const lines = markdown.split("\n").map((l) => l.split("\f")[0].trim());
  const drafts: Draft[] = [];
  let current: Draft | null = null;
  // target：目前正在累加文字的欄位（題幹或某選項）
  let target: string[] | null = null;

  for (const line of lines) {
    if (isNoise(line)) continue;

    const qm = questionStart.exec(line);
    if (qm) {
      current = {
        number: Number(qm[2]),
        answer: toHalfWidthLetter(qm[1]),
        promptParts: [qm[3]],
        choices: [],
      };
      drafts.push(current);
      target = current.promptParts;
      continue;
    }

    const cm = choiceStart.exec(line);
    if (cm && current) {
      const segments = splitInlineChoices(cm[1] as ChoiceId, cm[2]);
      let lastChoice: { id: ChoiceId; parts: string[] } | null = null;
      for (const seg of segments) {
        lastChoice = { id: seg.id, parts: [seg.text] };
        current.choices.push(lastChoice);
      }
      // 跨行延續只會接續最後一個選項。
      target = lastChoice ? lastChoice.parts : null;
      continue;
    }

    // 其餘為前一欄位的跨行延續
    if (target) target.push(line);
  }

  return drafts.map((draft) => {
    const choices = CHOICE_IDS.map((id) => {
      const found = draft.choices.find((c) => c.id === id);
      const joined = dropSharedStemParts(found?.parts ?? []).join("");
      return { id, text: stripTrailing(joined) };
    });
    const number = String(draft.number).padStart(2, "0");
    return {
      id: `${ctx.subjectId}-${ctx.examCode}-q${number}`,
      subjectId: ctx.subjectId,
      prompt: dropSharedStemParts(draft.promptParts).join(""),
      choices,
      answer: draft.answer,
      explanation: "",
      topic: "未分類",
      difficulty: "中",
      source: "past-exam",
      sourceRef: `${ctx.examLabel} 第${draft.number}題`,
    } satisfies Question;
  });
};

type GuideQuestionDraft = {
  number: number;
  promptParts: string[];
  choices: { id: ChoiceId; parts: string[] }[];
};

type GuideAnswerDraft = {
  number: number;
  answer: ChoiceId;
  explanationParts: string[];
  /** 逐項選項解析（`(A) 錯誤。…`）。散文型態的題目此陣列為空。 */
  choiceParts: { id: ChoiceId; parts: string[] }[];
};

const isStudyGuideNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  line.startsWith("- Source") ||
  line.startsWith("- Pages") ||
  line.startsWith("- Conversion") ||
  /^## Page \d+/.test(line) ||
  /^\d+$/.test(line) ||
  /^[-=]{3,}$/.test(line) ||
  // 章節頁尾，例「3-22」（第三章第 22 頁）。
  /^\d+-\d+$/.test(line) ||
  /^/.test(line) ||
  /^第[一二三四五六七八九十]+章/.test(line);

const isStudyGuideBoundary = (line: string): boolean =>
  line.startsWith("附件") ||
  line.includes("本學習指引參考書目") ||
  /^A-\d+/.test(line) ||
  /^職能基準/.test(line) ||
  /^\d+\.\d+(\s|$)/.test(line);

const normalizeGuideText = (parts: string[]): string =>
  parts
    .join("")
    .replace(/\s+/g, " ")
    .replace(/解析：\s*/g, "解析：")
    .trim();

const parseStudyGuideQuestionDrafts = (
  lines: string[],
  guideChoiceStart: RegExp,
): GuideQuestionDraft[] => {
  const drafts: GuideQuestionDraft[] = [];
  let current: GuideQuestionDraft | null = null;
  let target: string[] | null = null;

  const finish = () => {
    if (!current) return;
    const ids = new Set(current.choices.map((c) => c.id));
    if (CHOICE_IDS.every((id) => ids.has(id))) drafts.push(current);
    current = null;
    target = null;
  };

  for (const line of lines) {
    if (isStudyGuideNoise(line)) continue;
    // 答案區塊的開頭（「N. Ans（X）」）代表這一批題目結束。少了這個邊界，
    // 整段解析會被當成最末選項的跨行延續一路吞進去。
    if (isStudyGuideBoundary(line) || guideAnswerStart.test(line)) {
      finish();
      continue;
    }

    const qm = guideQuestionStart.exec(line);
    if (qm) {
      finish();
      current = { number: Number(qm[1]), promptParts: [qm[2]], choices: [] };
      target = current.promptParts;
      continue;
    }

    const cm = guideChoiceStart.exec(line);
    if (cm && current) {
      const choice = { id: cm[1] as ChoiceId, parts: [cm[2]] };
      current.choices.push(choice);
      target = choice.parts;
      continue;
    }

    if (target) target.push(line);
  }

  finish();
  return drafts;
};

const parseStudyGuideAnswerDrafts = (
  lines: string[],
  guideChoiceStart: RegExp,
  perChoiceExplanations: boolean,
): GuideAnswerDraft[] => {
  const drafts: GuideAnswerDraft[] = [];
  let current: GuideAnswerDraft | null = null;
  // 逐項模式下，跨行延續要接到最後一個選項解析，而非整段詳解。
  let target: string[] | null = null;

  for (const line of lines) {
    if (isStudyGuideNoise(line)) continue;

    const am = guideAnswerStart.exec(line);
    if (am) {
      current = {
        number: Number(am[1]),
        answer: am[2] as ChoiceId,
        explanationParts: am[3] ? [am[3]] : [],
        choiceParts: [],
      };
      drafts.push(current);
      target = current.explanationParts;
      continue;
    }

    if (!current) continue;

    const cm = guideChoiceStart.exec(line);
    if (cm) {
      // 散文模式下，選項標記代表解析已結束、下一批題目開始（原行為）。
      if (!perChoiceExplanations) {
        current = null;
        target = null;
        continue;
      }
      const choice = { id: cm[1] as ChoiceId, parts: [cm[2]] };
      current.choiceParts.push(choice);
      target = choice.parts;
      continue;
    }

    if (isStudyGuideBoundary(line) || guideQuestionStart.test(line)) {
      current = null;
      target = null;
      continue;
    }
    if (target) target.push(line);
  }

  return drafts;
};

const applyStudyGuideErrata = (questions: Question[], ctx: ParseContext): Question[] => {
  if (ctx.examCode !== "guide") return questions;
  if (ctx.subjectId === "aiot-junior-basics") return applyAiotBasicsErrata(questions);
  if (ctx.subjectId !== "junior-ai-basics") return questions;

  return questions.map((q) => {
    if (q.id === "junior-ai-basics-guide-q013") {
      return {
        ...q,
        answer: "A",
        explanation:
          "K-means 的原理相對簡單，主要透過反覆分配點到最近中心、並更新中心點來最小化平方誤差和，並非複雜方法。K-means 常與 PCA（降維）、Elbow method（選 k 值）等方法結合，具一定彈性；對球形且大小密度接近的群體表現良好。故「原理相對其他集群法較為複雜」不正確，選 A。（依初級學習指引勘誤表修正）",
      } satisfies Question;
    }
    if (q.id === "junior-ai-basics-guide-q017") {
      return {
        ...q,
        prompt:
          "當我們進行一次假設檢定，得到的 p 值為 0.03，而我們事先設定的顯著性水準為 0.05。以下哪一個敘述最合乎統計檢定的意義？",
        choices: [
          { id: "A", text: "我們有 97%的信心拒絕虛無假設" },
          { id: "B", text: "我們在 95%的信心水準下拒絕虛無假設" },
          { id: "C", text: "我們無法拒絕虛無假設" },
          { id: "D", text: "我們犯型一錯誤的機率為 5%" },
        ],
        explanation:
          "顯著性水準設定為 0.05 表示，我們容許最多 5%的機率犯型一錯誤（Type-I Error），並非代表實際犯錯機率就是 5%。因 p 值 0.03 小於顯著性水準 0.05，所以可在 95%的信心水準下拒絕虛無假設，選 B。（依初級學習指引勘誤表修正）",
      } satisfies Question;
    }
    return q;
  });
};

/**
 * 官方學習指引 PDF 第 22 頁（3-15）的第 4 題，把四個選項誤植為解析文字
 * （「(A) 錯誤。…」「(B) 正確。…」），等同把答案印在題目上。已調閱 PDF 原頁確認
 * 為官方原檔錯誤，非轉檔失真；全份 320 個選項僅此一題受影響。
 * 以下選項依該題解析內容反推還原，屬推寫內容、需人工複審，
 * 詳見 docs/coverage/bank-defects.md。
 */
const applyAiotBasicsErrata = (questions: Question[]): Question[] =>
  questions.map((q) => {
    if (q.id !== "aiot-junior-basics-guide-q004") return q;
    return {
      ...q,
      choices: [
        { id: "A", text: "NPU 可完全取代 CPU，負責裝置上所有的通用運算（如作業系統與 I/O）" },
        {
          id: "B",
          text: "NPU 專注於推論（Forward Propagation）運算，因省去訓練所需的複雜反向傳播邏輯而具備極高能效",
        },
        { id: "C", text: "邊緣裝置的 NPU 運算力足以取代雲端 GPU/TPU 進行大型模型訓練" },
        { id: "D", text: "NPU 無法執行 INT8 量化模型，僅支援 FP32 浮點運算" },
      ],
    } satisfies Question;
  });

const CORRECT_PREFIX = /^正確[。．]\s*/;
const WRONG_PREFIX = /^錯誤[。．]\s*/;

/** 依 sections 的累計題數，決定第 index 題（0-based）落在哪個節點。 */
const topicForIndex = (sections: GuideSection[] | undefined, index: number): string => {
  if (!sections) return "未分類";
  let seen = 0;
  for (const section of sections) {
    if (index < seen + section.count) return section.code;
    seen += section.count;
  }
  return "未分類";
};

type ResolvedExplanation = {
  explanation: string;
  choiceExplanations?: Partial<Record<ChoiceId, string>>;
};

/**
 * 解答區塊有兩種型態：逐項選項解析與整段散文。逐項時把「正確。」那項當詳解、
 * 其餘三項當選項解析；散文時（或逐項模式下該題其實是散文）沿用原本的整段詳解。
 */
const resolveGuideExplanation = (
  answer: GuideAnswerDraft | undefined,
  perChoiceExplanations: boolean,
): ResolvedExplanation => {
  const prose = normalizeGuideText(answer?.explanationParts ?? []);
  if (!perChoiceExplanations || !answer || answer.choiceParts.length === 0) {
    return { explanation: prose };
  }

  const texts = new Map<ChoiceId, string>();
  for (const choice of answer.choiceParts) {
    texts.set(choice.id, normalizeGuideText(choice.parts));
  }

  const correct = texts.get(answer.answer);
  const choiceExplanations: Partial<Record<ChoiceId, string>> = {};
  for (const [id, text] of texts) {
    if (id === answer.answer) continue;
    choiceExplanations[id] = text.replace(WRONG_PREFIX, "");
  }

  return {
    // 正解那項缺漏時退回散文詳解，寧可少內容也不要留空詳解。
    explanation: correct ? correct.replace(CORRECT_PREFIX, "") : prose,
    choiceExplanations: Object.keys(choiceExplanations).length > 0 ? choiceExplanations : undefined,
  };
};

export const parseStudyGuide = (markdown: string, ctx: ParseContext): Question[] => {
  const lines = markdown.split("\n").map((l) => l.split("\f")[0].trim());
  const guideChoiceStart = GUIDE_CHOICE_START[ctx.choiceMarker ?? "fullwidth"];
  const perChoiceExplanations = ctx.perChoiceExplanations ?? false;
  const questionDrafts = parseStudyGuideQuestionDrafts(lines, guideChoiceStart);
  const answerDrafts = parseStudyGuideAnswerDrafts(lines, guideChoiceStart, perChoiceExplanations);

  const questions = questionDrafts.map((draft, index) => {
    const answer = answerDrafts[index];
    const choices = CHOICE_IDS.map((id) => {
      const found = draft.choices.find((c) => c.id === id);
      return { id, text: stripTrailing(normalizeGuideText(found?.parts ?? [])) };
    });
    const number = String(index + 1).padStart(3, "0");
    const { explanation, choiceExplanations } = resolveGuideExplanation(
      answer,
      perChoiceExplanations,
    );
    return {
      id: `${ctx.subjectId}-${ctx.examCode}-q${number}`,
      subjectId: ctx.subjectId,
      prompt: normalizeGuideText(draft.promptParts),
      choices,
      answer: answer?.answer ?? "A",
      explanation,
      ...(choiceExplanations ? { choiceExplanations } : {}),
      topic: topicForIndex(ctx.sections, index),
      difficulty: "中",
      source: ctx.source ?? "past-exam",
      sourceRef: `${ctx.examLabel} 第${index + 1}題`,
    } satisfies Question;
  });

  return applyStudyGuideErrata(questions, ctx);
};
