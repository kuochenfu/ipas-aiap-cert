import { describe, it, expect } from "vitest";
import { parsePaper } from "../scripts/parse-core";

const md = [
  "# 標題",
  "- Source: x",
  "## Page 1",
  "115 年第一次 AI 應用規劃師-初級能力鑑定【公告試題】",
  "第一科：人工智慧基礎概論",
  "考試日期：115 年 03 月 21 日",
  "第 1 頁，共 12 頁",
  "一、選擇題",
  "答案 題目",
  "D 1. 下列何者不屬於資料整合（Data Integration）的主要",
  "目的？",
  "(A)統一不同來源資料的格式；",
  "(B)識別並處理重複資料；",
  "(C)整併多來源資料；",
  "(D)依資料保存政策延長原始資料留存期限",
  "## Page 2",
  "第 2 頁，共 12 頁",
  "答案 題目",
  "B 2. 某銀行採用 SMOTE 改善訓練資料分佈，下列何者正確？",
  "(A)隨機刪除部分正常交易資料；",
  "(B)依少數類別樣本特徵空間，合成新的少數類別樣本；",
  "(C)調整損失函數權重；",
  "(D)以交叉驗證重新分割資料集，使各折類別比例一",
  "致",
].join("\n");

describe("parsePaper", () => {
  const questions = parsePaper(md, {
    subjectId: "junior-ai-basics", examCode: "115-1", examLabel: "115年第一次",
  });

  it("解析出兩題", () => {
    expect(questions).toHaveLength(2);
  });
  it("第一題：id、答案、題幹合併、四選項", () => {
    const q = questions[0];
    expect(q.id).toBe("junior-ai-basics-115-1-q01");
    expect(q.answer).toBe("D");
    expect(q.prompt).toBe("下列何者不屬於資料整合（Data Integration）的主要目的？");
    expect(q.choices.map((c) => c.id)).toEqual(["A", "B", "C", "D"]);
    expect(q.choices[3].text).toBe("依資料保存政策延長原始資料留存期限");
    expect(q.source).toBe("past-exam");
    expect(q.sourceRef).toBe("115年第一次 第1題");
    expect(q.explanation).toBe("");
    expect(q.topic).toBe("未分類");
    expect(q.difficulty).toBe("中");
  });
  it("第二題跨頁延續：選項D合併到「致」", () => {
    const q = questions[1];
    expect(q.choices[3].text).toBe("以交叉驗證重新分割資料集，使各折類別比例一致");
  });
});
