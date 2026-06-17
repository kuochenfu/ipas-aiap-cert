import { describe, it, expect } from "vitest";
import { resolvePastExamExplanations } from "../src/data/resolveExplanations";
import type { Question } from "../src/data/types";

const sensorQ: Question = {
  id: "q1",
  subjectId: "junior-ai-basics",
  prompt: "持續蒐集環境數據與設備狀態，最直接支援的技術？",
  choices: [
    { id: "A", text: "專家系統（Expert System） " },
    { id: "B", text: "決策支援系統（Decision Support System） " },
    { id: "C", text: "啟發式決策引擎（Heuristic Decision Engine） " },
    { id: "D", text: "感知器網路（Sensor Network）" },
  ],
  answer: "D",
  explanation: "",
  topic: "未分類",
  difficulty: "中",
  source: "past-exam",
};

describe("resolvePastExamExplanations + glossary", () => {
  it("空詳解題的錯誤選項帶出詞彙表用途與 2 範例", () => {
    const [q] = resolvePastExamExplanations([sensorQ], {});
    expect(q.choiceExplanations?.A).toContain("以規則庫與推論引擎");
    expect(q.choiceExplanations?.A).toContain("例如：");
    expect(q.choiceExplanations?.A).toContain("故不選 A");
  });
  it("空詳解題的正解帶出詞彙表用途並標示正解", () => {
    const [q] = resolvePastExamExplanations([sensorQ], {});
    expect(q.choiceExplanations?.D).toContain("這是本題正解");
    expect(q.choiceExplanations?.D).toContain("即時採集環境與設備資料");
  });
});
