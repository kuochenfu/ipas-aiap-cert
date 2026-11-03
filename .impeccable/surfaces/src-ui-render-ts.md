---
version: 1
slug: "src-ui-render-ts"
primary_target: "src/ui/render.ts"
related_targets: ["src/styles.css","src/main.ts"]
---

# 學習主題頁（study view）

Scope: 學習主題頁（索引＋單節點閱讀器）。Mode: Read。
Audience/job: 在職考生，手機零碎時間讀一個節點、考前查找縮寫/易混淆/公式、讀完立刻練該節點的題。
Constraints: 沿用全站 token 與系統字；就地 DOM 更新原則（閱讀器內）；出處標籤「學習指引整理／備考整理」不得統一；localStorage key 不更名。

## Direction contract

THESIS: 一個評鑑節點＝一章。學習頁從「兩張證照全部攤開的 12,000px 摺疊牆」改成「索引→單節點閱讀器」；拒絕三層巢狀 details 的手風琴牆。
OWN-WORLD: 暖紙底 #f5f2eb、深綠 #196f5a 單一強調色、系統無襯線字；節點碼以 tabular 數字當每頁的錨；區段之間用 inset hairline 分隔，不巢狀卡片、不加彩色側邊條。
STORY: 打開即看到「接著讀」哪一節與已讀進度 → 進入節點讀分節筆記 → 標記已讀並前往下一節，或一鍵練這節的題。
FIRST VIEWPORT: 索引（手機）：返回＋「學習」標題、證照切換、接著讀面板（節點碼＋標題＋開始讀主按鈕）、搜尋框。閱讀器（手機）：返回索引、科目與節點碼、節點標題 h1、出處標籤、本節涵蓋清單、可橫捲的分節籤列；底部固定列：上一節／已讀／練這節 N 題（主動作）／下一節。
FORM: 單節點閱讀器（我的排序第 1，dealt 1）；seed key 4e3c361a。Signature interaction：索引搜尋的關鍵字帶進閱讀器、命中處以 mark 標示並捲到第一處；分節籤列隨捲動標示目前所在節。
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
