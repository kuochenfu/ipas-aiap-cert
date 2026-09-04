import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 事件委派的選擇器清單守衛。
 *
 * `main.ts` 用單一個 `closest("[data-x],[data-y],…")` 攔截所有點擊。新增一個可點擊的
 * `data-*` 屬性卻忘了把它加進那串清單，結果是**點了完全沒反應、也沒有任何錯誤**——
 * 型別檢查與現有的 render 測試都攔不到（HTML 字串裡的屬性是對的，只是沒人在聽）。
 * 專案史上已經因為漏掉 `data-paper` 而發生過一次選卷無反應。
 *
 * 這條測試把「render 會輸出的 data-* 屬性」與「main.ts 攔得到的 data-* 屬性」對起來，
 * 讓那個缺口在測試階段就現形。
 */

const root = join(__dirname, "..");
const renderSource = readFileSync(join(root, "src", "ui", "render.ts"), "utf8");
const mainSource = readFileSync(join(root, "src", "main.ts"), "utf8");

/**
 * 刻意不參與點擊委派的屬性。
 *
 * 這些是**被讀取**而非**被點擊**的標記：`data-qid` 供單頁考卷就地更新時定位題目，
 * `data-node` / `data-cert-section` / `data-note-section` 供學習主題頁的搜尋、
 * 展開收合與考前速記以 CSS 或 querySelector 選取。
 * 要在這裡加東西，請確認它真的不需要被點。
 */
const NON_CLICKABLE = new Set([
  "data-qid",             // 單頁考卷就地更新時定位題目
  "data-node",            // 學習主題頁的節點，供搜尋與跳轉以 querySelector 選取
  "data-cert-section",    // 各證照的區塊邊界，供 certSectionOf() 往上找
  "data-note-section",    // 考前速記模式的 CSS 篩選鍵
  "data-abbr-row",        // 縮寫速查的列，供搜尋時逐列顯示／隱藏
  "data-study-search",    // 搜尋輸入框（走 input 事件，不是點擊）
  "data-study-count",     // 搜尋命中數的顯示位置
  "data-study-read-count", // 已讀進度的顯示位置
]);

const emitted = new Set(
  [...renderSource.matchAll(/data-[a-z-]+/g)]
    .map((match) => match[0])
    .filter((attribute) => !NON_CLICKABLE.has(attribute)),
);

const delegationList = mainSource.match(/closest\("([^"]+)"\)/)?.[1] ?? "";
const listened = new Set(
  [...delegationList.matchAll(/\[(data-[a-z-]+)\]/g)].map((match) => match[1]),
);

describe("事件委派", () => {
  it("main.ts 找得到那串 closest 選擇器", () => {
    expect(listened.size).toBeGreaterThan(5);
  });

  it("render.ts 輸出的每一個可點擊 data-* 都在委派清單裡", () => {
    const missing = [...emitted].filter((attribute) => !listened.has(attribute)).sort();
    expect(missing, `這些屬性點了不會有反應：${missing.join("、")}`).toEqual([]);
  });

  it("委派清單裡沒有已經不再輸出的屬性（避免累積死選擇器）", () => {
    // data-tts-section 以無值屬性形式輸出（`data-tts-section aria-label=…`），
    // 上面的 regex 抓得到，因此這裡不需要例外。
    const stale = [...listened].filter((attribute) => !emitted.has(attribute)).sort();
    expect(stale, `這些選擇器已無對應的輸出：${stale.join("、")}`).toEqual([]);
  });
});
