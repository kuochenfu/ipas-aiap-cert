export type GlossaryEntry = {
  /** 一句話說明此概念的用途 */
  purpose: string;
  /** 剛好兩個具體範例 */
  examples: [string, string];
};

// 名詞 → 用途 + 範例。key 為中文名詞（不含括號英文）。
// 內容正確性需人工複審；此處為高頻種子，後續由 Task 4 擴充。
export const glossary: Record<string, GlossaryEntry> = {
  "專家系統": {
    purpose: "以規則庫與推論引擎，模擬專家在特定領域做診斷與決策",
    examples: ["醫療診斷系統 MYCIN", "設備故障排除規則引擎"],
  },
  "決策支援系統": {
    purpose: "彙整資料並提供分析模型，輔助管理者做半結構化決策",
    examples: ["銷售儀表板", "庫存補貨建議系統"],
  },
  "感知器網路": {
    purpose: "由大量分散感測器即時採集環境與設備資料",
    examples: ["空品監測站", "垃圾桶滿溢偵測"],
  },
};
