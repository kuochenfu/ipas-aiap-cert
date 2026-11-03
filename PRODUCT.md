# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
一般在職考生，準備經濟部 iPAS 鑑定（AI 應用規劃師初級／中級、AIoT 應用工程師初級）。多半利用零碎時間在手機上練習；考前會集中複習、查找縮寫與易混淆概念。

## Product Purpose
免費、免登入的練習站：官方真題與官方學習指引練習評量、LLM 命製的新題庫（標「AI 命題・待複審」）、模擬考試、刷題、學習診斷，以及依官方評鑑範圍整理的學習筆記。成功＝考生知道自己弱在哪個評鑑節點，讀完該節點就能立刻練到它的題目，最後考過 70 分。

## Positioning
所有內容都掛在官方評鑑節點碼上（五科 `L11101` 五碼、AIoT `A1.1`／`B1.1`），讀、練、診斷三者用同一組節點串起來；並誠實標示每份內容的出處與可信度（官方原文 vs. 備考整理 vs. AI 命題待複審）。

## Operating Context
- 學習主題頁的三個主要情境：**手機零碎時間讀筆記**（要記得讀到哪）、**考前快速複習／查找**（搜尋、縮寫速查、考前速記）、**讀完立刻練該節點的題**。
- 狀態全存 localStorage（已讀節點、刷題進度、錯題本），沒有帳號。

## Capabilities and Constraints
- 純前端 Vite + TypeScript 靜態 SPA，部署 GitHub Pages；渲染用 `innerHTML` 字串樣板，動態文字一律 `escapeHtml`。
- 學習頁互動一律就地改 DOM、不整頁重繪（保留捲動與展開狀態）。
- 筆記標籤必須區分出處：五科為「學習指引整理」（官方原文重構），AIoT 為「備考整理」。
- localStorage key（`ipas-aiap-study-read` 等）不得更名。

## Evidence on Hand
官方真題 779、AIoT 官方練習評量 80、LLM 題 1,263（未經人工複審）；學習筆記 `src/data/studyNotes.ts`、`src/data/studyNotes.aiot.ts`。沒有使用者見證、通過率等數據——不得杜撰。

## Product Principles
1. 出處誠實：內容可信度永遠標得出來，不把整理說成官方原文。
2. 節點是共同語言：讀、練、診斷都以評鑑節點相連。
3. 手機優先：零碎時間打開就能接著讀、讀完就能練。
4. 不丟使用者進度：資料結構與 key 的相容性是不變式。

## Accessibility & Inclusion
WCAG AA 對比、鍵盤可操作、手機可讀為基本盤；無額外特殊需求。
