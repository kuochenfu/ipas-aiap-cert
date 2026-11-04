import { describe, expect, it } from "vitest";
import { SPEECH_CHUNK_MAX, clauseStart, hasResumableProgress, resumePoint, splitForSpeech } from "../src/ui/speechChunks";

const len = (text: string) => [...text].length;
const strip = (text: string) => text.replace(/\s/g, "");

describe("splitForSpeech：把長筆記切成可朗讀的短段", () => {
  it("短文字原樣成為一段", () => {
    expect(splitForSpeech("生成式 AI 概述。")).toEqual(["生成式 AI 概述。"]);
  });

  it("每一段都不超過上限，且內容一字不漏、順序不變", () => {
    const sentence = "生成式人工智慧是一類可以根據輸入訊息產生全新內容的 AI 技術，";
    const text = Array.from({ length: 40 }, (_, i) => `${sentence}第 ${i} 句。`).join("");
    const chunks = splitForSpeech(text);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(len(chunk)).toBeLessThanOrEqual(SPEECH_CHUNK_MAX);
    expect(strip(chunks.join(""))).toBe(strip(text));
  });

  it("優先在句末切，而不是句子中間", () => {
    const a = "甲".repeat(100) + "。";
    const b = "乙".repeat(100) + "。";
    expect(splitForSpeech(a + b)).toEqual([a, b]);
  });

  it("單句過長時改在逗號切，連逗號都沒有才硬切", () => {
    const withComma = "甲".repeat(120) + "，" + "乙".repeat(120) + "。";
    expect(splitForSpeech(withComma)).toEqual(["甲".repeat(120) + "，", "乙".repeat(120) + "。"]);

    const noBreak = "丙".repeat(400);
    const chunks = splitForSpeech(noBreak);
    expect(chunks.every((c) => len(c) <= SPEECH_CHUNK_MAX)).toBe(true);
    expect(chunks.join("")).toBe(noBreak);
  });

  it("相鄰短句會合併，不會一句一停", () => {
    expect(splitForSpeech("第一。第二。第三。")).toEqual(["第一。第二。第三。"]);
  });

  it("只有標點或空白的片段不輸出（例如筆記條目串接時的連續句號）", () => {
    expect(splitForSpeech("標題。。。內容")).toEqual(["標題。。。內容"]);
    expect(splitForSpeech("。。 \n")).toEqual([]);
  });
});

describe("resumePoint：停止後再按，從中斷的子句接著念", () => {
  const chunks = ["第一段。", "第二段。", "第三段。"];
  const p = (key: string, index: number, charIndex = 0, c = chunks) => ({ key, chunks: c, index, charIndex });
  const head = { index: 0, offset: 0 };

  it("同一節、尚未念完 → 接續到該段", () => {
    expect(resumePoint(p("a", 2), "a", chunks)).toEqual({ index: 2, offset: 0 });
  });
  it("沒有進度、換了別節、或已念完 → 從頭", () => {
    expect(resumePoint(null, "a", chunks)).toEqual(head);
    expect(resumePoint(p("b", 2), "a", chunks)).toEqual(head);
    expect(resumePoint(p("a", 3), "a", chunks)).toEqual(head);
  });
  it("內容變了（例如筆記更新）→ 從頭，避免指到錯的位置", () => {
    expect(resumePoint(p("a", 1), "a", ["新的第一段。", "第二段。", "第三段。"])).toEqual(head);
  });
  it("第一段還沒念完就停止 → 退回段內中斷那個子句的開頭，而不是從頭（Chrome 實測的回歸）", () => {
    const long = ["人工智慧的定義，機器學習的範疇。深度學習的應用。", "下一段。"];
    // charIndex 落在「機器學習」裡 → 從「機器學習的範疇」念起
    const at = long[0].indexOf("學習");
    expect(resumePoint(p("a", 0, at, long), "a", long)).toEqual({ index: 0, offset: long[0].indexOf("機器") });
    // 子句之後只剩標點 → 跳到下一段
    expect(resumePoint(p("a", 0, long[0].length, long), "a", long)).toEqual({ index: 1, offset: 0 });
  });
  it("hasResumableProgress：只有在段落或段內位置往前走過才算可接續", () => {
    const long = ["甲甲，乙乙。", "丙。"];
    expect(hasResumableProgress(null)).toBe(false);
    expect(hasResumableProgress(p("a", 0, 1, long))).toBe(false);
    expect(hasResumableProgress(p("a", 0, 4, long))).toBe(true);
    expect(hasResumableProgress(p("a", 1, 0, long))).toBe(true);
  });
});

describe("clauseStart", () => {
  it("退回最近一個句末／逗號之後；沒有就回段首", () => {
    expect(clauseStart("甲甲，乙乙。丙丙", 4)).toBe(3);
    expect(clauseStart("甲甲，乙乙。丙丙", 7)).toBe(6);
    expect(clauseStart("甲甲甲", 2)).toBe(0);
  });
});
