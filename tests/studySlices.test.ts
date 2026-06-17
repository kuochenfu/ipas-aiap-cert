import { describe, it, expect } from "vitest";
import { sliceSection } from "../scripts/studySlice";

const lines = [
  "## Page 1",
  "3.1 概念甲",
  "這是第一節第一行。",
  "這是第一節第二行。",
  "3.2 概念乙",
  "這是第二節，不該被切進來。",
];

describe("sliceSection", () => {
  it("切出指定節到下一個 [3-6].x 標題之前的內容行", () => {
    const slice = sliceSection(lines, "3.1");
    expect(slice).toEqual(["這是第一節第一行。", "這是第一節第二行。"]);
  });
  it("找不到該節時回傳空陣列", () => {
    expect(sliceSection(lines, "9.9")).toEqual([]);
  });
});
