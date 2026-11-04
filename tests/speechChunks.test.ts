import { describe, expect, it } from "vitest";
import { SPEECH_CHUNK_MAX, splitForSpeech } from "../src/ui/speechChunks";

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
