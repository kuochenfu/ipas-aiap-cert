import { describe, it, expect } from "vitest";
import { parsePaper, parseStudyGuide } from "../scripts/parse-core";

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
  it("題號或選項行含換頁字元時，保留換頁前內容並丟棄頁首", () => {
    const pageBreakMd = [
      "答案 題目",
      "B 12. 某製造業導入 AI 進行生產排程，需整合 ERP 訂單資料、\f115 年第二次 AI 應用規劃師-初級能力鑑定【公告試題】",
      "第一科：人工智慧基礎概論",
      "答案 題目",
      "設備感測器紀錄，以及維修技師手寫異常描述。",
      "(A)ERP 訂單資料為半結構化；",
      "(B)ERP 訂單資料為結構化、感測器數值為結構化、維修文字描述為非結構化；",
      "(C)ERP 訂單資料為結構化；",
      "(D)三者皆屬結構化資料",
      "C 13. 下一題？",
      "(A)a\f115 年第二次 AI 應用規劃師-初級能力鑑定【公告試題】",
      "答案 題目",
      "續；",
      "(B)b；",
      "(C)c；",
      "(D)d",
    ].join("\n");
    const parsed = parsePaper(pageBreakMd, {
      subjectId: "junior-ai-basics", examCode: "115-2", examLabel: "115年第二次",
    });
    expect(parsed).toHaveLength(2);
    expect(parsed[0].id).toBe("junior-ai-basics-115-2-q12");
    expect(parsed[0].prompt).toContain("設備感測器紀錄");
    expect(parsed[1].choices[0].text).toBe("a續");
  });
});

describe("parseStudyGuide", () => {
  it("解析學習指引參考題、答案與解析，並使用連續 id", () => {
    const parsed = parseStudyGuide(
      [
        "## Page 1",
        "1. 下列何者正確？",
        "（A）選項甲",
        "（B）選項乙",
        "（C）選項丙",
        "（D）選項丁",
        "## Page 2",
        "1. Ans（B） 選項乙",
        "解析：乙符合題意。",
        "2. 第二題題幹",
        "跨頁延續",
        "（A）a",
        "（B）b",
        "（C）c",
        "（D）d",
        "2. Ans（C）",
        "解析：c 正確。",
        "附件 本學習指引參考書目",
        "這段不應併入最後一題解析。",
      ].join("\n"),
      { subjectId: "junior-genai", examCode: "guide", examLabel: "初級科目二學習指引參考題" },
    );

    expect(parsed).toHaveLength(2);
    expect(parsed[0].id).toBe("junior-genai-guide-q001");
    expect(parsed[0].answer).toBe("B");
    expect(parsed[0].explanation).toBe("選項乙解析：乙符合題意。");
    expect(parsed[1].prompt).toBe("第二題題幹跨頁延續");
    expect(parsed[1].explanation).toBe("解析：c 正確。");
    expect(parsed[1].source).toBe("past-exam");
    expect(parsed[1].sourceRef).toBe("初級科目二學習指引參考題 第2題");
  });

  // 學習指引的版面是「每 10 題 → 該批的答案解析區塊 → 下一批 10 題」。
  // 每批最後一題的最末選項，曾把整段解析與頁尾一路吞進去（見 docs/coverage）。
  it("題目區塊在答案區塊開始時結束，最末選項不吞入解析與頁尾", () => {
    const parsed = parseStudyGuide(
      [
        "## Page 27",
        "10. 在 AI 治理中，下列何者是國際合作的重要性？",
        "（A）統一 AI 發展標準",
        "（B）避免 AI 技術的濫用",
        "（C）促進 AI 技術的轉移",
        "（D）以上皆是",
        "",
        "## Page 28",
        " 第三章 人工智慧基礎概論",
        "3-22",
        "1. Ans（D）",
        "解析：強化學習讓代理透過與環境互動最大化累積獎勵。",
        "2. Ans（B）",
        "解析：AI 涵蓋多種技術。",
      ].join("\n"),
      { subjectId: "junior-ai-basics", examCode: "guide", examLabel: "初級科目一學習指引參考題" },
    );

    expect(parsed).toHaveLength(1);
    expect(parsed[0].choices[3].text).toBe("以上皆是");
    expect(parsed[0].answer).toBe("D");
    expect(parsed[0].explanation).toBe("解析：強化學習讓代理透過與環境互動最大化累積獎勵。");
  });

  it("章節頁尾（如 3-22）不併入選項文字", () => {
    const parsed = parseStudyGuide(
      [
        "1. 題目一",
        "（A）a",
        "（B）b",
        "（C）c",
        "（D）d",
        "3-22",
        "2. 題目二",
        "（A）a2",
        "（B）b2",
        "（C）c2",
        "（D）d2",
      ].join("\n"),
      { subjectId: "junior-genai", examCode: "guide", examLabel: "初級科目二學習指引參考題" },
    );

    expect(parsed[0].choices[3].text).toBe("d");
  });

  it("套用初級科目一學習指引勘誤表的題目修正", () => {
    const questionBlock = Array.from({ length: 17 }, (_, index) => {
      const n = index + 1;
      if (n === 13) {
        return [
          "13. 下列何者「並非」K 平均數（k-means）集群法的特點？",
          "（A）原理相對其他集群法較為複雜",
          "（B）可結合其他方法，使用上較為彈性",
          "（C）在特定情況下，能將集群的任務處理得足夠好",
          "（D）不適合非球形、數據密度變化大或有離群數據的集群問題",
        ].join("\n");
      }
      if (n === 17) {
        return [
          "17. 當我們進行一次假設檢定，得到的 p 值為 0.03，顯著性水準設定為 0.05，以下哪一個敘述是正確的？",
          "（A）我們有 97%的信心拒絕虛無假設",
          "（B）我們有 95%的信心拒絕虛無假設",
          "（C）我們無法拒絕虛無假設",
          "（D）我們有 5%的機率犯型一錯誤",
        ].join("\n");
      }
      return [`${n}. 題目 ${n}`, "（A）a", "（B）b", "（C）c", "（D）d"].join("\n");
    }).join("\n");
    const answerBlock = Array.from({ length: 17 }, (_, index) => `${index + 1}. Ans（B）\n解析：原解析`).join("\n");
    const parsed = parseStudyGuide(`${questionBlock}\n${answerBlock}`, {
      subjectId: "junior-ai-basics", examCode: "guide", examLabel: "初級科目一學習指引參考題",
    });

    expect(parsed[12].id).toBe("junior-ai-basics-guide-q013");
    expect(parsed[12].answer).toBe("A");
    expect(parsed[12].explanation).toContain("依初級學習指引勘誤表修正");
    expect(parsed[16].prompt).toContain("最合乎統計檢定的意義");
    expect(parsed[16].choices[1].text).toBe("我們在 95%的信心水準下拒絕虛無假設");
  });
});
