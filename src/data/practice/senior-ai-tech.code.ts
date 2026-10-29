import type { Question } from "../types";

// 程式閱讀題（2026-10-29）：依真題比例補上的一批，計畫見 docs/superpowers/plans/2026-10-29-senior-code-reading-questions.md。
// 每題的程式行為都以固定版本環境實際執行驗證過（驗證腳本見 scripts/code-questions/），觀念敘述與詳解仍為 LLM 產出、需人工複審。
export const practiceQuestions: Question[] = [
  {
    id: "senior-ai-tech-practice-q143",
    subjectId: "senior-ai-tech",
    prompt:
      "某工廠以 PyTorch 實作 4 類表面瑕疵的 CNN 分類模型，訓練時使用 nn.CrossEntropyLoss。在模型 forward() 中最後一層全連結層（nn.Linear）之後，應如何處理輸出？",
    choices: [
      { id: "A", text: "再接 nn.Softmax(dim=1)，把轉成機率的輸出交給 CrossEntropyLoss 計算損失" },
      { id: "B", text: "再接 nn.Sigmoid()，讓每一類的分數各自落在 0 到 1 之間後再計算損失" },
      { id: "C", text: "不接任何激活函數，直接回傳原始分數，由 CrossEntropyLoss 內部做 log-softmax" },
      { id: "D", text: "再接 nn.ReLU()，把負的分數截成 0，確保輸入 CrossEntropyLoss 的值非負" },
    ],
    answer: "C",
    explanation:
      "PyTorch 的 nn.CrossEntropyLoss 等於 log_softmax 再接 NLLLoss，預期的輸入是未正規化的原始分數（logits），因此 forward() 最後一層全連結層之後不要再接激活函數（C）。推論時若需要機率，再於模型外另外呼叫 torch.softmax 即可。這也是與 Keras 習慣（輸出層加 softmax、損失預設 from_logits=False）最容易混淆的地方。",
    choiceExplanations: {
      A: "輸出先做 softmax，CrossEntropyLoss 又會再做一次 log-softmax，等於雙重 softmax：程式能跑，但機率被壓在狹窄區間、梯度明顯變小，就算模型完全有把握，損失也降不到 0。",
      B: "Sigmoid 適用於多標籤（每類獨立判斷是否存在）的情境，搭配 BCELoss 或直接使用內含 sigmoid 的 BCEWithLogitsLoss；在互斥的四類分類中把分數壓進 0～1，會讓類別間的差距被壓扁、損失卡在高點。",
      D: "logits 的負值本身就帶有資訊，ReLU 把所有負分數截成 0，負分數類別之間的相對大小就被抹平；CrossEntropyLoss 本來就接受任意實數，不需要非負。",
    },
    topic: "L21301 數據準備與模型選擇",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["CrossEntropyLoss", "logits", "softmax"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若損失改用 nn.NLLLoss，最後一層之後就必須接 nn.LogSoftmax(dim=1)；只有在損失函數本身不含 log-softmax 時，才需要在模型內做正規化。",
    },
  },
];
