# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

iPAS 認證練習網站，目前收錄**兩張證照**：「AI 應用規劃師」（初級 2 科、中級 3 科）與「AIoT 應用工程師」（初級物聯網類 2 科）。純前端 Vite + TypeScript 靜態 SPA，部署到 GitHub Pages（無後端、無資料庫，狀態存 localStorage）。

## Commands

```bash
npm run dev          # 本地開發伺服器 http://127.0.0.1:5173/ipas-aiap-cert/
npm run build        # tsc 型別檢查 + vite build（產生 dist/）— 交付前必跑
npm run test         # vitest run（一次性跑全部測試）
npm run test:watch   # vitest watch
npm run parse:papers # 從 docs/markdown/*.md 重新解析真題 → src/data/past-exams/*.json
```

跑單一測試檔：`npx vitest run tests/exam.test.ts`
依名稱過濾：`npx vitest run -t "scoreExam"`

改完程式請務必跑 `npm run build`（型別）與 `npm run test`。推送到 `main` 會經 `.github/workflows/deploy.yml` 自動部署到 GitHub Pages（`vite.config.ts` 的 `base` 為 `/ipas-aiap-cert/`，改 repo 名稱時要同步改）。

## 考試規則常數（`src/domain/exam.ts`）

**AI 應用規劃師**：每科 50 題單選、每題 2 分、滿分 100、70 及格（最多錯 15 題）。選項固定 A/B/C/D，答案為**單一字母**。中級報考科目1＋（科目2 或 3）；本站五科皆可獨立練習。

**AIoT 應用工程師（初級）**：115 年度簡章只寫「每科目單選題、每科 100 分、70 分及格」，**未載明題數與配分**，因此 `examRules` 不適用；AIoT 兩科的 `Subject.mockExam` 為 `false`，**只開刷題、不開模擬考試**。拿到官方題數前不要打開（緣由見 `docs/backlog.md` 的 A2）。授證需「考科一＋考科二」兩科皆過，考科一無抵免。

## 大局架構（跨檔案才看得懂的部分）

**兩層分類：證照 → 級別 → 科目。** `src/domain/catalog.ts` 的 `Subject` 帶 `cert`（`"aiap" | "aiot"`）與 `level`，`certs` 為證照目錄，`getSubjects(cert, level)` 與 `getLevels(cert)` 是唯二的查詢入口（**沒有** `getSubjectsByLevel`，已移除）。`main.ts` 的視圖依序是 `home → cert → level → mode`。AIoT 目前只有初級，但 `cert` 與 `level` 兩層都保留，日後出中級不需改結構。

**題庫＝三個來源、載入時合併（核心設計）。** 這適用於 AI 應用規劃師五科；AIoT 走單層（見下）。每科的題庫不是單一檔，而是由 `src/data/<subjectId>.ts` 把三者合併：

1. `src/data/past-exams/<subjectId>.json` — **真題**，由解析腳本產生，視為機器產物，勿手改。
2. `src/data/explanations/<subjectId>.ts` — **手寫詳解、錯誤選項解析與原卷圖片轉錄** map（`題目id → { explanation, choices, figures?, choiceFigures? }`，`choices` 只放三個錯誤選項，正解不寫）。
3. `src/data/generated/<subjectId>.ts` — **手寫新題** 陣列（詳解與選項解析寫在題目物件內）。

合併時把 explanations 套到對應 id 的真題上，再接上 generated。**因此重跑 `npm run parse:papers` 只覆寫 `past-exams/*.json`，不會動到手寫的詳解與新題**——這是刻意的，改動資料層時務必維持。`src/data/index.ts` 對外只暴露 `getQuestions(subjectId)` 與 `getBankStats`。每題帶 `source: "past-exam" | "generated" | "study-guide"`（第三種為官方學習指引的練習評量，目前只有 AIoT 考科一使用），可用於區分/篩選。

**AIoT 考科一（`aiot-junior-basics`）走單層。** 題源是官方學習指引的 80 題練習評量，題目自帶答案與詳解、節點也由出處決定，因此**沒有** explanations／generated 兩層手寫合併——`src/data/aiot-junior-basics.ts` 直接匯出解析產物。它與五科**共用同一支解析器** `parseStudyGuide`，差異全部收在 `paper-manifest.ts` 那一筆的選用欄位（`choiceMarker: "halfwidth"`、`perChoiceExplanations`、`source: "study-guide"`、`sections`）。這些欄位**省略時行為與既有五科完全相同**——改 `parse-core.ts` 時務必維持這個預設，並以「重跑 `npm run parse:papers` 後既有五科 JSON 無 diff」驗證。

**資料管線**：`docs/raw/*.pdf`（私有 PDF）→ pdftotext →`docs/markdown/*.md`（中間產物）→ `npm run parse:papers`（`scripts/parse-core.ts` 為純函式解析、`paper-manifest.ts` 為檔案對應、`parse-past-papers.ts` 為 I/O 入口）→ `src/data/past-exams/*.json`（已提交）。`docs/raw/` 與 `docs/markdown/` 皆 **gitignore**；真正進版控的題目內容是那些 JSON。pdftotext 的轉檔慣例為 `pdftotext -raw -enc UTF-8`，markdown 以 `## Page N` 分節（見 `docs/markdown/README.md` 的既有檔頭格式）。

新增一份考卷的流程：轉檔 → 在 `paper-manifest.ts` 加一筆 → `npm run parse:papers` →**看警告**（「解析出 N 題」代表題號漏抓、「有空白選項」代表選項是圖片）→ 補 `explanations/*.ts` 的詳解與圖片轉錄 → `npm run build && npm run test`。

**`src/main.ts` 是單一畫面狀態機**，視圖：`home / cert / level / mode / paper / play / result / review / study / topics`。兩種練習流程的渲染與行為**依 `session.mode` 分流**：
- **模擬考試**：`mode → paper`（選 3 份，`src/state/mockPapers.ts` 以 `subjectId+份次` seed 產生**決定性**試卷）→ `play` 用 `renderExamPaper` 把 50 題畫在**單頁**；點選項時**就地更新 DOM、不整頁重繪**（保留捲動位置）→ 交卷 → `result` → `review` 用單頁 `renderExamReview`。有計時、時間到自動交卷。
- **刷題練習**：`mode → play`，用逐題卡 `renderQuestion`，放入**整個題庫、依考卷原序**（identity shuffle），作答後即時揭曉、不計時。

**渲染走 `innerHTML` 字串樣板**：所有動態文字一律先經 `src/ui/escape.ts` 的 `escapeHtml`，外部連結加 `target="_blank" rel="noopener noreferrer"`。

更深入的模組職責見 `docs/architecture.md`；不變式與操作守則見 `AGENTS.md`；各功能的設計與計畫見 `docs/superpowers/specs/` 與 `docs/superpowers/plans/`；**待辦清單見 `docs/backlog.md`**（2026-08-17 全面複盤，每項附量測數字與相依關係）；專案回顧見 `docs/retrospective-*.md`（最新一份為 `docs/retrospective-2026-08-17-senior-115-1-and-figures.md`，記錄了原卷圖片的處理決策與解析器的靜默缺陷；`docs/retrospective-2026-08-14-explanations-overhaul.md` 的「最重要的一課」一節則記錄了寫詳解時最容易出錯的句型與檢查法）；已知的題目瑕疵與待複審內容見 `docs/coverage/`（尤其 `bank-defects.md` 與 `explanations-overhaul.md`）。

## 容易踩到的點（gotchas）

- **事件委派的選擇器清單**：`main.ts` 用單一 `closest("[data-cert],[data-level],[data-subject],[data-mode],[data-paper],[data-choice],[data-nav],[data-study-jump],[data-study-action],[data-topic-drill],[data-study-read],…")` 攔截點擊。**新增任何可點擊的 `data-*` 屬性時，必須把它加進這個清單**，否則點擊不會被處理（曾因漏 `data-paper` 導致選卷無反應）。反過來說，**不想被點的元素就不要掛這些屬性**——題數為 0 的科目卡（AIoT 考科二）刻意不掛 `data-subject`，因此不需要另外攔截。
- **單頁考試的就地更新**：exam 模式選項點擊是直接改 DOM class 與「已作答」計數、**不呼叫 `render()`**；drill 模式則每次互動重繪整題。改任一邊時注意兩者路徑不同。
- **`reveal` 揭曉邏輯**：drill 作答後揭曉、檢討一律揭曉、考試作答中不揭曉——集中在 `revealForCurrent()` 與 render 分流，改導覽時別讓檢討翻頁丟失揭曉。
- **錯題本 localStorage key 為 `ipas-aiap-misses`**，勿更名（會遺失現有使用者紀錄）。它只在**模擬考交卷**時寫入（`finishExam`），讀取端是**刷題的「錯題」篩選器**：`drillMatches` 的 `wrong` 會把「本次刷題答錯」與「在錯題本裡且本次刷題尚未作答」兩者聯集起來，刷題答對即從篩選中消失，「重置進度」則連同本科目的錯題本一併清除。改刷題篩選或考試結算時，兩個來源都要顧到。
- **刷題進度 localStorage key 為 `ipas-aiap-drill-progress`**，勿更名（會遺失現有使用者紀錄）。進度記錄的是 `questionId` 而非索引，這是刻意設計——題庫會隨時間成長，用索引會在新增題目後悄悄指向錯的題目。
- **原卷圖片一律轉錄為文字，不放圖檔**：考卷裡的「圖」幾乎都是程式碼／console 輸出／資料表的截圖，pdftotext 擷取不到。轉錄寫在 `explanations/*.ts` 的 `figures`（題幹附圖）與 `choiceFigures`（選項本身是圖），型別見 `QuestionFigure`。**不要改放圖片檔**——原卷每頁都疊了 iPAS 浮水印、截圖在手機上不可讀，且轉錄可搜尋可複製。**也不要寫進 `past-exams/*.json`**，那是機器產物，重跑 `parse:papers` 會全部消失（`tests/figures.test.ts` 會擋）。真正的圖表（訓練曲線、ROC）用 `kind: "chart"` 以文字描述代替。
- **筆記條目有三種呈現型別**：`StudyNoteItem` 除了 `text` 外可帶 `table`（比較表）、`formula`（公式）、`flow`（流程），`text` 在帶 table／flow 時**是標題而非內容**。既有五科全部只用純文字，型別皆為選用，因此不受影響。表格必須留在 `.note-table-wrap` 內（`overflow-x: auto`）——寬表在手機上要自己捲，頁面本身不得橫向捲動。
- **學習主題頁的互動一律就地操作 DOM，不呼叫 `render()`**：搜尋、全部展開／收合、考前速記、已讀標記、節點目錄跳轉全部直接改 class 或屬性。這頁很長，整頁重繪會把捲動位置與已展開的節點全部打回原形（與單頁模擬考的就地更新同一個理由）。
- **考前速記模式靠 `data-note-section` 的 CSS 篩選**：`renderStudyNotes` 為每一節輸出穩定鍵（concept／abbr／confuse／formula／case／exam／resource），CSS 只留 formula 與 confuse。**不要改成用標題文字選取**——CSS 選不到文字內容，且標題一改就失效。
- **AIoT 的縮寫只有一份來源**：`aiotAbbreviations`（帶 `nodes: string[]`，可跨節點）同時生成每個節點的「重要縮寫」表與工具列的「縮寫速查」全表。**不要在筆記裡另外手寫一份縮寫**，`tests/aiotNotes.test.ts` 會比對兩者一致。
- **節點限定刷題**：學習頁的「練這個節點的 N 題」會設 `session.topicScope` 並以篩過的題庫呼叫 `beginDrill`；`drillProgressKey()` 因此加上 `:topic:<節點碼>` 後綴（沿用既有的 `ipas-aiap-drill-progress` map，不新增 key）。⚠️ `startMode()` 與點選科目時**都必須把 `topicScope` 清掉**，否則之後的一般刷題會莫名只剩幾題。
- **「已讀」節點的 localStorage key 為 `ipas-aiap-study-read`**，勿更名。它只記評鑑節點碼、與刷題進度完全無關。
- **學習筆記有兩個來源、兩種可信度**：`src/data/studyNotes.ts` 是 AI 應用規劃師五科**官方學習指引原文**的忠實重構；`src/data/studyNotes.aiot.ts` 是 AIoT 的**備考 syllabus 整理**（考科二更是以簡章大綱為骨架外加工程知識），兩者都由 `main.ts` 的 `loadStudyNotes()` 合併載入（各自是獨立的 lazy chunk，別把 AIoT 筆記搬進主 bundle）。UI 標籤刻意不同——五科顯示「學習指引整理」、AIoT 顯示「備考整理」，**改 `renderStudyView` 時不要把兩者統一成同一個字**，那會把「官方原文」與「他人整理」混為一談。跨節點的內容（建議順序、比較表、公式表）放在證照層級的 `aiotExamOverview`，不屬於任何單一節點。
- **新題品質**：`generated/*` 由 LLM 依官方學習指引撰寫，僅有「格式」自動測試，**內容正確性需人工複審**；擴充新題前先確認複審流程。
- **初級的解析內容散在兩個地方**：`gen-*` 共 66 題（`junior-ai-basics` 32、`junior-genai` 34）的詳解與選項解析定義在 `generated/*.ts` 的**題目物件內**，**不經** `explanations/*.ts`；真題的則在 `explanations/*.ts`。改初級解析內容時兩處都要顧到。初級兩科每一題都必須有非空詳解與**三條**錯誤選項解析（`tests/explanationsCoverage.test.ts` 強制）；選項解析**一律手寫**，舊的詞彙表自動組合機制（`glossary.ts`／`choiceAnalysis.ts`）已刪除且不得重建，緣由見 `docs/coverage/explanations-overhaul.md`。中級三科的 `choices` 幾乎都留空、走 `render.ts` 的**後備抽取器**（例外：`senior-bigdata-115-1-q49` 的選項是程式碼區塊，後備句型會把整段程式碼塞進句子裡，故已手寫）。

- **後備抽取器怎麼運作，決定了中級詳解該怎麼寫**：`explanationSegmentForChoice` 從詳解中切出談論各選項的片段；切不出來才落到無資訊量的通用填充句。它認得三種寫法——子句開頭的字母（`；C 說⋯`）、括號寫法（`TF-IDF（A）產生⋯`）、連接詞串接（`C 的X與 D 的Y⋯`，此時兩者共用該段）。**寫中級詳解時逐項點名 A/B/C/D，填充率就會自己降下來**（實測全庫 59% → 5%）。改動這個抽取器時務必重跑 `tests/render.test.ts` 的三條相關測試。
- **`topic` 是否「已分類」只由 `assessmentTopics.ts` 的 `isTopicClassified()` 判斷**（主題徽章與刷題節點統計共用）。兩種節點碼並存：AI 應用規劃師用官方五碼（`L23303 …`），AIoT 用本站自訂的兩層碼（`A1.1 …` 考科一、`B1.1 …` 考科二，官方沒編五碼）。**不要在別處再寫一條 `/^L\d{5} /`**——那正是加入 AIoT 時要修的舊債。
- **題目的 `topic` 是五碼評鑑節點（如 `L23303 模型訓練、評估與驗證`）**，目錄在 `src/domain/assessmentTopics.ts`（`allNodes` 為五科合併的查表用目錄；`seniorNodes` 為中級、`practiceTopics` 為新題庫並帶配額）。**五科的真題與新題已全數回填、無「未分類」**：真題寫在 `explanations/*.ts` 的 `topic` 欄位（重跑解析不會洗掉），新題寫在 `generated/*.ts` 的題目物件內，兩者共用同一組節點——分開用會讓成績頁把相同概念拆成兩列。`render.ts` 的主題徽章與刷題的「節點表現」視圖都以 `/^L\d{5} /` 判斷是否已分類。官方文件在 L233 底下有個撞號（把節點編成 `L22303`／`L22304`），本專案改用 `L23303`／`L23304`，緣由見該檔註解與 `tests/topicBackfill.test.ts`。
- **`session.bank`（`"main" | "practice"`）決定刷題的題庫來源**：`"main"` 讀 `getQuestions`（原題庫），`"practice"` 讀 `getPracticeQuestions`（`src/data/practice/`，依評鑑內容節點分類，目前僅初級兩科各 100 題）。`drillProgressKey()` 依此在 key 後綴 `:practice`，讓兩者的進度分開存在同一個 `ipas-aiap-drill-progress` map 裡。改刷題相關邏輯（進度還原、篩選、就地更新等）時，兩種來源都要確認成立，不能只測 `bank: "main"` 的路徑。新題庫的節點題數與配額由 `src/domain/assessmentTopics.ts` 定義，改配額要同步改 `tests/practiceBank.test.ts`。
