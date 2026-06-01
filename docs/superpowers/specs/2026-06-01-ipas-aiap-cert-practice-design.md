# iPAS AI 應用規劃師 認證練習網站 — 設計文件

- 日期：2026-06-01
- 狀態：已核可，待擬定實作計畫
- 參考架構：`../aiatcl-cert-practice/`（原生 Vite + TypeScript 靜態 SPA）

## 目標

打造一個 iPAS「AI 應用規劃師」能力鑑定的練習網站，涵蓋**初級**與**中級**，
並將各**科目分開**。題庫來源為歷屆公告真題（含答案）加上 AI 撰寫的新題，
每題皆附中文詳解。提供「模擬考試」與「刷題練習」兩種模式。

## 考試規則（來自 115 年度簡章）

| 級別 | 科目 | 時間 | 題型 |
| --- | --- | --- | --- |
| 初級 | 科目1 人工智慧基礎概論 | 75 分鐘 | 單選 |
| 初級 | 科目2 生成式 AI 應用與規劃 | 75 分鐘 | 單選 |
| 中級 | 科目1 人工智慧技術應用與規劃 | 90 分鐘 | 單選 |
| 中級 | 科目2 大數據處理分析與應用 | 90 分鐘 | 單選 |
| 中級 | 科目3 機器學習技術與應用 | 90 分鐘 | 單選 |

- 中級報考方式：科目1 ＋（科目2 或 科目3 擇一）。本網站五科皆獨立提供練習。
- 每科 **50 題單選**、**每題 2 分**、滿分 100、**70 分及格**（最多錯 15 題）。

## 資料盤點（真題，皆含答案鍵）

| 科目 | 來源試卷 | 題數 |
| --- | --- | --- |
| 初級科目1 人工智慧基礎概論 | 115 第一次、114 第四梯次 | ~100 |
| 初級科目2 生成式 AI 應用與規劃 | 115 第一次、114 第四梯次 | ~100 |
| 中級科目1 人工智慧技術應用與規劃 | 114 第二梯次 | ~50 |
| 中級科目2 大數據處理分析與應用 | 114 第二梯次 | ~50 |
| 中級科目3 機器學習技術與應用 | 114 第二梯次 | ~50 |

來源 markdown 位於 `docs/markdown/`，已由 PDF 以 `pdftotext` 轉檔。
另有完整「學習指引」與「評鑑內容範圍參考」供撰寫新題與詳解之依據。

## 決策摘要

1. **題庫來源**：歷屆真題 ＋ AI 生成新題。
2. **練習模式**：模擬考試與刷題練習兩者皆做，介面切換。
3. **詳解**：真題與新題皆附中文詳解。
4. **新題題量**：分階段，先求能跑（先少量），之後分批擴充。
5. **技術棧**：方案 A —— 沿用參考專案的原生 Vite + TypeScript 靜態 SPA。

## 技術棧與專案結構

原生 Vite + TypeScript、純前端、`localStorage`、部署 GitHub Pages。
執行期拆成聚焦模組，避免重蹈參考專案單一過大的 `main.ts`。

```
src/
  main.ts                 進入點 / 事件委派 / 視圖切換
  domain/
    exam.ts               計分、答案正規化、及格規則
    catalog.ts            級別/科目目錄(名稱、時間、題數)
  data/
    junior-ai-basics.ts   初級科目1 人工智慧基礎概論
    junior-genai.ts       初級科目2 生成式 AI 應用與規劃
    senior-ai-tech.ts     中級科目1 人工智慧技術應用與規劃
    senior-bigdata.ts     中級科目2 大數據處理分析與應用
    senior-ml.ts          中級科目3 機器學習技術與應用
    index.ts              匯總所有科目題庫
  state/
    attempt.ts            一次作答狀態(題序、選項、計時)
    storage.ts            localStorage：錯題本/紀錄，含形狀驗證
  ui/
    render.ts             各畫面渲染(首頁、科目、模考、刷題、檢討、錯題本)
  styles.css
scripts/
  parse-past-papers.ts    解析 docs/markdown 公告試題 → 真題資料
```

## 資料模型

```ts
type Level = "junior" | "senior";

type Choice = { id: "A" | "B" | "C" | "D"; text: string };

type Question = {
  id: string;                       // 例：junior-ai-basics-115-1-q01
  subjectId: string;
  prompt: string;
  choices: Choice[];
  answer: "A" | "B" | "C" | "D";    // 單選
  explanation: string;              // 中文詳解(真題與新題皆有)
  topic: string;                    // 對應評鑑主題分類
  difficulty: "易" | "中" | "難";
  source: "past-exam" | "generated";
  sourceRef?: string;               // 例："115年第一次 第1題"
};

type Subject = {
  id: string;
  level: Level;
  code: string;                     // "科目1"
  name: string;                     // "人工智慧基礎概論"
  durationMinutes: 75 | 90;
};

const examRules = {
  totalQuestions: 50,
  pointsPerQuestion: 2,
  passScore: 70,
  maxWrongToPass: 15,
};
```

## 級別/科目分離與導覽

- **首頁**：選擇「初級 / 中級」，顯示該級的科目卡片，每張卡顯示真題數、新題數、主題分布。
- **科目頁**：進入某科目後，以按鈕在兩種模式間切換。

## 雙模式

- **模擬考試**：自題庫抽 50 題（題序與選項打散）、計時（初級 75／中級 90 分）、
  交卷後以 100 分制計分（70 及格）、檢討逐題對錯＋詳解，錯題自動進錯題本。
- **刷題練習**：自選題數與範圍（全部／某主題／錯題本）、即時顯示對錯＋詳解、不計時。

## 儲存（localStorage，跨科目）

- `ipas-aiap-misses`：錯題本。
- `ipas-aiap-history`：作答紀錄。
- 讀回時驗證資料形狀，壞資料即重置而非信任。

## 內容管線（分階段）

- `scripts/parse-past-papers.ts`：以 regex 從公告試題 md 擷取「答案＋題號＋題幹＋(A)(B)(C)(D)」，
  輸出真題（`source: "past-exam"`），`explanation` 欄位先留空待補。
- 詳解與新題由開發階段依「學習指引／評鑑內容範圍」撰寫，直接寫進 data 模組。
- **階段 1**：解析全部真題 ＋ 建好雙模式 app ＋ 為「初級科目1」補齊詳解與少量新題 → 整體跑起來。
- **階段 2+**：逐科補齊詳解與新題。

## 錯誤處理與測試

- 解析腳本驗證：每份 50 題、答案皆為 A–D、id 不重複、四個選項齊全。
- 渲染採安全方式（escape／DOM 建構），避免日後匯入內容的注入風險。
- **Vitest** 涵蓋：`exam.ts` 計分/正規化、`catalog.ts` 科目目錄、解析輸出形狀、錯題本生命週期。

## 不在本期範圍（YAGNI）

- 帳號系統、雲端同步、後端。
- 執行期 LLM 生成（新題與詳解皆於開發階段產出並提交為靜態資料）。
- 中級「科目抵免」「成績保留」等行政邏輯——僅作為練習，不模擬授證流程。
