import { describe, it, expect } from "vitest";
import {
  normalizeChoiceTerm,
  glossaryPurpose,
  composeGlossaryAnalysis,
} from "../src/data/choiceAnalysis";

describe("normalizeChoiceTerm", () => {
  it("去除括號英文與前後空白", () => {
    expect(normalizeChoiceTerm("專家系統（Expert System） ")).toBe("專家系統");
    expect(normalizeChoiceTerm("決策支援系統(Decision Support System)")).toBe("決策支援系統");
  });
});

describe("glossaryPurpose", () => {
  it("命中具名概念", () => {
    const entry = glossaryPurpose("感知器網路（Sensor Network）");
    expect(entry?.purpose).toContain("感測器");
    expect(entry?.examples).toHaveLength(2);
  });
  it("整句型選項未命中回傳 undefined", () => {
    expect(glossaryPurpose("為整張圖片指定一個標籤")).toBeUndefined();
  });
});

describe("composeGlossaryAnalysis", () => {
  it("錯誤選項：附用途、2 範例、對照正解與選項代號", () => {
    const text = composeGlossaryAnalysis({
      choiceText: "專家系統（Expert System） ",
      choiceId: "A",
      isCorrect: false,
      correctText: "感知器網路（Sensor Network）",
    });
    expect(text).toBe(
      "專家系統：以規則庫與推論引擎，模擬專家在特定領域做診斷與決策（例如：醫療診斷系統 MYCIN、設備故障排除規則引擎）。本題情境指向「感知器網路」，故不選 A。",
    );
  });
  it("正解：附用途、2 範例、標示本題正解", () => {
    const text = composeGlossaryAnalysis({
      choiceText: "感知器網路（Sensor Network）",
      choiceId: "D",
      isCorrect: true,
      correctText: "感知器網路（Sensor Network）",
    });
    expect(text).toBe(
      "感知器網路：由大量分散感測器即時採集環境與設備資料（例如：空品監測站、垃圾桶滿溢偵測）—— 這是本題正解。",
    );
  });
  it("未命中回傳 undefined", () => {
    expect(
      composeGlossaryAnalysis({
        choiceText: "為整張圖片指定一個標籤",
        choiceId: "B",
        isCorrect: false,
        correctText: "感知器網路",
      }),
    ).toBeUndefined();
  });
});
