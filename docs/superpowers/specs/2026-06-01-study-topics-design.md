# 學習主題（延伸閱讀）功能 — 設計文件

- 日期：2026-06-01
- 狀態：已核可，待擬定實作計畫
- 關聯：建構於既有 iPAS AIAP 練習網站之上（見 `2026-06-01-ipas-aiap-cert-practice-design.md`）

## 目標

在首頁提供入口，進入一個依「應考科目」分組的「學習主題（延伸閱讀）」頁面，
讓練習者在刷題之外，依官方評鑑範圍掌握每一科要讀的主題，並提供精選外部閱讀連結。

## 決策摘要

1. **內容**：官方評鑑主題大綱（科目 → 評鑑主題 → 評鑑內容＋備註關鍵詞）＋ 每個評鑑主題 1–3 個精選外部閱讀連結。
2. **呈現**：首頁新增入口，點擊進入獨立的 `study` 視圖；頁面依 初級／中級 → 各科目 → 評鑑主題 分組。

## 內容來源

官方《AI 應用規劃師能力鑑定_評鑑內容範圍參考》（`docs/markdown/AI應用規劃師能力鑑定_評鑑內容範圍參考_11502_20260226174411.md`）。
該文件公開，旨在協助考生聚焦準備。主題結構（18 個評鑑主題）：

- 初級科目1 人工智慧基礎概論（`junior-ai-basics`）：L111 人工智慧概念、L112 資料處理與分析概念、L113 機器學習概念、L114 鑑別式 AI 與生成式 AI 概念。
- 初級科目2 生成式 AI 應用與規劃（`junior-genai`）：L121 No code/Low code 概念、L122 生成式 AI 應用領域與工具使用、L123 生成式 AI 導入評估規劃。
- 中級科目1 人工智慧技術應用與規劃（`senior-ai-tech`）：L211 AI 相關技術應用、L212 AI 導入評估規劃、L213 AI 技術應用與系統部署。
- 中級科目2 大數據處理分析與應用（`senior-bigdata`）：L221 機率統計基礎、L222 大數據處理技術、L223 大數據分析方法與工具、L224 大數據在人工智慧之應用。
- 中級科目3 機器學習技術與應用（`senior-ml`）：L231 機器學習基礎數學、L232 機器學習與深度學習、L233 機器學習建模與參數調校、L234 機器學習治理。

每個評鑑主題底下有 2–4 條評鑑內容（L11101 …），備註欄常列出關鍵詞與來源（如歐盟 AI 法、金管會《金融業運用 AI 指引》、經濟部《AI 導入指引》、OpenAI/ChatGPT/Midjourney、提示工程、RAG 等）。

## 資料模型

新增至 `src/data/types.ts`：

```ts
export type ReadingLink = { title: string; url: string };

export type StudyTopic = {
  code: string;        // 例 "L111"
  title: string;       // 例 "人工智慧概念"
  contents: string[];  // 評鑑內容（含備註關鍵詞）逐條，例 "AI 的定義與分類"
  links: ReadingLink[];// 1–3 個精選外部閱讀連結
};

export type SubjectStudyGuide = {
  subjectId: string;
  topics: StudyTopic[];
};
```

新資料模組 `src/data/studyGuide.ts`：手動轉錄官方大綱並策展連結（4 頁文件，手刻比脆弱的解析器可靠），
匯出 `studyGuides: SubjectStudyGuide[]` 與 `getStudyGuide(subjectId): SubjectStudyGuide | undefined`。

## 外部連結策展原則

- 優先穩定、權威的官方網域：經濟部產業發展署、國發會/數位發展部、金管會、歐盟、各工具官方文件、知名公開課程（如台大李宏毅課程、learnprompting）。
- 每個連結於實作時以 HTTP 抽查可用（200），失敗者替換或移除。
- 連結為靜態策展，不做執行期抓取。

## UI / 路由

- **首頁**：於級別卡片下方新增入口按鈕「📚 學習主題（延伸閱讀）」，`data-nav="study"`。
- **新視圖 `study`**：依 初級／中級 → 各科目 → 評鑑主題 分組。每個主題顯示其評鑑內容條列與外部閱讀連結。頁面有「← 返回」（`data-nav="home"`）。
- 連結以新分頁開啟：`target="_blank" rel="noopener noreferrer"`。
- 所有動態文字（標題、內容、連結文字、URL）皆經 `escapeHtml`。
- `src/main.ts` 狀態機新增 `study` 視圖；`render()` 與點擊委派處理 `study` 與其入口/返回。

## 測試

- 資料完整性（`tests/studyGuide.test.ts`）：五科皆有對應 guide；每科至少一個主題；每主題至少一條 `contents`；每個 `links` 項目有非空 `title` 且 `url` 以 `http://` 或 `https://` 開頭。
- 渲染（擴充 `tests/render.test.ts`）：`renderStudyView` 輸出包含科目名稱、主題標題、跳脫處理，且連結含 `rel="noopener"` 與 `target="_blank"`。

## 不在範圍（YAGNI）

- 不改動既有模擬考試／刷題／檢討流程。
- 不做「評鑑主題 ↔ 題目」對應的成績分析（屬既有 backlog 另一項）。
- 不寫每主題的重點摘要（本期採「大綱＋外部連結」）。
- 無執行期連結抓取或失連偵測。
