# 新題庫（依評鑑內容分類）覆蓋盤點

建立日期：2026-08-13　　資料來源：`src/data/practice/{junior-ai-basics,junior-genai}.ts`
節點目錄與配額定義：`src/domain/assessmentTopics.ts`

## 目的

原題庫（`src/data/index.ts` 的 `getQuestions`）以歷屆試題為主軸，題目分布跟著考卷走，不是按官方《評鑑內容範圍》平均覆蓋。這個新題庫改以官方評鑑內容節點為單位出題——每個節點固定配額、獨立成一批 100 題（junior-ai-basics、junior-genai 各一），讓使用者可以針對某個評鑑內容節點集中練習，而不是被歷屆考卷的題型比例牽著走。

新題庫與原題庫是**兩個完全獨立的資料來源與 UI 入口**：新題庫不經過 `getQuestions`，也不併入原本的刷題/模擬考題庫；在模式選單以「新題庫練習」第三張卡呈現，只有 junior-ai-basics、junior-genai 兩科有這張卡（中級三科尚未建置，見下方 Backlog）。

## 各節點題數對照表

與 `src/domain/assessmentTopics.ts` 的 `practiceTopics` 逐一對應（`tests/practiceBank.test.ts` 的「節點題數」區塊會驗證此表與程式碼一致）。

### junior-ai-basics（合計 100 題）

| 節點碼 | 節點名稱 | 題數 |
|---|---|---|
| L11101 | AI 的定義與分類 | 11 |
| L11102 | AI 治理概念 | 11 |
| L11201 | 資料基本概念與來源 | 11 |
| L11202 | 資料整理與分析流程 | 11 |
| L11203 | 資料隱私與安全 | 11 |
| L11301 | 機器學習基本原理 | 11 |
| L11302 | 常見的機器學習模型 | 12 |
| L11401 | 鑑別式 AI 與生成式 AI 的基本原理 | 11 |
| L11402 | 鑑別式 AI 與生成式 AI 的整合應用 | 11 |

### junior-genai（合計 100 題）

| 節點碼 | 節點名稱 | 題數 |
|---|---|---|
| L12101 | No Code / Low Code 的基本概念 | 14 |
| L12102 | No Code / Low Code 的優勢與限制 | 14 |
| L12201 | 生成式 AI 應用領域與常見工具 | 15 |
| L12202 | 如何善用生成式 AI 工具 | 15 |
| L12301 | 生成式 AI 導入評估 | 14 |
| L12302 | 生成式 AI 導入規劃 | 14 |
| L12303 | 生成式 AI 風險管理 | 14 |

中級三科（`senior-ai-tech`、`senior-bigdata`、`senior-ml`——確切 id 可在 `src/domain/catalog.ts` 查證）尚未納入新題庫，見 `docs/superpowers/specs/2026-08-13-practice-bank-design.md` 的 Backlog。

## 產業場景分佈統計

每題的 `sourceRef` 標記題目所依附的產業應用場景（金融／醫療／工廠／教育／農業，五選一）。以下為實際執行 brief 指定指令的輸出（2026-08-13）：

```bash
npx tsx -e "
import {getPracticeQuestions} from './src/data/practice/index.ts';
for (const s of ['junior-ai-basics','junior-genai']) {
  const c: Record<string, number> = {};
  for (const q of getPracticeQuestions(s)) c[q.sourceRef ?? '未標'] = (c[q.sourceRef ?? '未標'] ?? 0) + 1;
  console.log(s, c);
}
"
```

輸出：

```
junior-ai-basics { '農業': 16, '工廠': 24, '教育': 12, '金融': 27, '醫療': 21 }
junior-genai { '教育': 22, '工廠': 17, '農業': 12, '金融': 29, '醫療': 20 }
```

兩科都涵蓋五個產業，沒有科目遺漏任何一個場景；分佈不是刻意均分（未強制每產業 20 題），但單一產業佔比落在 12～29 題之間（12%～29%），未出現某產業被冷落到個位數或單一產業獨佔半數以上的情況。

## 正解字母分佈

`tests/practiceBank.test.ts`「新題庫整體品質」區塊會檢查每個字母（A/B/C/D）至少 15 題。實際執行結果：

```
junior-ai-basics { A: 24, B: 26, C: 25, D: 25 }
junior-genai { A: 27, B: 26, C: 23, D: 24 }
```

兩科四個字母都落在 23～27 題之間，遠高於 15 題門檻，分佈平均，未做任何調整。（另外還有更嚴格的「以評鑑內容節點為單位」的週期／區塊規律檢查，見同一測試檔的「答案字母序列」區塊，此處不重複列出。）

## 評鑑內容碼統計：資料有、UI 目前沒呈現

每題都帶有評鑑內容碼（`topic` 欄位，如 `L11101 AI 的定義與分類`），資料層的 `getPracticeStats(subjectId)` 也能回傳 `byTopic`（各節點題數統計）。

但**目前沒有任何畫面會把 practice 題庫的作答結果按這個碼分類呈現**。原因：

- 刷題模式（含新題庫練習）沒有交卷按鈕，導覽列只有「上一題／下一題」，作答後即時揭曉，不會進入成績頁。
- `topicSummary`（`src/domain/exam.ts`）只在模擬考試 `finishExam()` 之後的成績頁使用；而模擬考試（`mode → paper → play`）取用的是原題庫（`getQuestions`），不會用到 practice 題庫。

（本節記錄的是專案設計 spec 裡一句被實測推翻的推理——原 spec 的「非目標」段認為「`topic` 會餵進既有的 `topicSummary`，成績頁自然按主題統計」，但這個推論忽略了 practice 題庫走的是刷題流程、刷題流程根本不到成績頁。）

因此「依評鑑內容節點檢視作答表現」目前是**待辦**，不是已完成的功能；本文件其餘段落提到的節點題數/配額，指的是題庫本身的分類，不代表使用者在 UI 上能看到對應統計。

## 複審狀態與方法

**內容為 LLM 產出、尚未人工事實查核。** 與既有題庫的補充題（`src/data/generated/*.ts`）、詞彙表（glossary）、學習指引整理（studyNotes）目前的複審缺口性質相同——格式（id、選項數、答案合法性、節點配額、簡體字、題幹重複、正解分佈）已有自動測試把關，但**題目內容的正確性（考點是否成立、選項解析是否符合事實）尚未人工逐題核對**。

建議複審方法：

1. 逐題核對 `explanation`（正解解析）是否與 `answer` 邏輯一致——即解析文字所描述的理由，是否真的指向被標記為正確答案的那個選項。
2. 逐一核對 `choiceExplanations`（三個錯誤選項各自的解析）：
   - 每個錯誤選項的解析是否準確描述「為什麼這個選項不對」，而不是含糊帶過或與正解解析矛盾。
   - 錯誤選項本身的敘述是否為合理的干擾項（而非明顯荒謬、一望即知錯誤，削弱鑑別度）。
3. 抽查 `topic`／`sourceRef` 是否與題目內容相符（節點碼與產業場景標記）。
4. 若發現內容錯誤，直接修改對應的 `src/data/practice/<subjectId>.ts`，不要重新生成整批——這批題目的節點配額、字母分佈、序列規律都已通過測試把關，重新生成會失去這些人工調校過的性質。

複審完成後，應在此文件補上複審日期與結果，並視情況移除本節「尚未人工事實查核」的警語。
