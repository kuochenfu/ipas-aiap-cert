import { describe, expect, it } from "vitest";
import { parseStudyGuide } from "../scripts/parse-core";

const AIOT_CTX = {
  subjectId: "aiot-junior-basics",
  examCode: "guide",
  examLabel: "AIoT 初級考科一學習指引練習評量",
  choiceMarker: "halfwidth" as const,
  perChoiceExplanations: true,
  source: "study-guide" as const,
  sections: [{ code: "A1.1 AI 基礎概念", count: 1 }],
};

const FIXTURE = `# guide

## Page 21

 第三章 AI 基礎知識與應用
3-14
1. 關於機器學習在 AIoT 資料分析中的應用範式，下列敘述何者正確？
(A) 監督式學習不需依賴標籤資料
(B) 非監督式學習常利用資料分群技術，將相似的設備運作資料自動
歸類
(C) 強化學習的主要目標是靜態影像瑕疵檢測
(D) 迴歸屬於非監督式學習

## Page 23

 第三章 AI 基礎知識與應用
3-16
1. Ans（B）
`;

describe("parseStudyGuide（AIoT dialect）", () => {
  it("解析半形選項標記，並接回跨行選項", () => {
    const [q] = parseStudyGuide(FIXTURE, AIOT_CTX);
    expect(q.id).toBe("aiot-junior-basics-guide-q001");
    expect(q.answer).toBe("B");
    expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
    expect(q.choices[1].text).toBe(
      "非監督式學習常利用資料分群技術，將相似的設備運作資料自動歸類",
    );
    expect(q.source).toBe("study-guide");
    expect(q.topic).toBe("A1.1 AI 基礎概念");
  });

  it("解答區塊為逐項解析時，拆成 explanation 與 choiceExplanations", () => {
    const fixture = `# guide

1. 關於 NPU 的敘述，下列何者正確？
(A) NPU 可完全取代 CPU
(B) NPU 專注於推論運算
(C) 邊緣 NPU 足以取代雲端 GPU 進行訓練
(D) NPU 僅支援 FP32 浮點運算

1. Ans（B）
(A) 錯誤。NPU 是協同處理器，通用運算仍由 CPU 負責。
(B) 正確。NPU 專注於推論，移除訓練所需的反向傳播邏輯，因此能效極
高。
(C) 錯誤。雲端訓練通常使用 GPU 或 TPU。
(D) 錯誤。NPU 的優勢正是執行 INT8 量化模型。
`;
    const [q] = parseStudyGuide(fixture, AIOT_CTX);
    expect(q.explanation).toBe(
      "NPU 專注於推論，移除訓練所需的反向傳播邏輯，因此能效極高。",
    );
    expect(q.choiceExplanations?.A).toBe("NPU 是協同處理器，通用運算仍由 CPU 負責。");
    expect(q.choiceExplanations?.D).toBe("NPU 的優勢正是執行 INT8 量化模型。");
    expect(q.choiceExplanations?.B).toBeUndefined();
  });

  it("解答區塊為散文時沿用原行為，不產生 choiceExplanations", () => {
    const fixture = `# guide

1. 下列何者非並列通訊缺點？
(A) 線路成本高
(B) 維修不易
(C) 傳輸速率慢
(D) 易受干擾

1. Ans（C）
並列通訊優點為傳輸速率快，缺點為線路成本高、維修不易、及易受干擾。
`;
    const [q] = parseStudyGuide(fixture, AIOT_CTX);
    expect(q.explanation).toBe(
      "並列通訊優點為傳輸速率快，缺點為線路成本高、維修不易、及易受干擾。",
    );
    expect(q.choiceExplanations).toBeUndefined();
  });
});
