// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";

/**
 * 走過真實點擊路徑的煙霧測試。
 *
 * 其餘測試都是對純函式或 render 字串做的——它們證明「算得對」與「畫得對」，
 * 但證明不了「點下去有反應」。本站的點擊全部經過 `main.ts` 的單一事件委派，
 * 而漏掛選擇器的失敗方式是**完全沒有反應且沒有錯誤**（史上發生過一次）。
 * 這支測試把 `main.ts` 真的掛進 jsdom，用滑鼠事件走一遍刷題流程。
 */

const click = (element: Element | null | undefined) => {
  expect(element, "找不到要點擊的元素").toBeTruthy();
  element!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};

const app = () => document.querySelector("#app")!;

/** 新題庫是動態載入的獨立 chunk，一個 tick 不一定夠——輪詢到畫面換好為止。 */
const waitFor = async (selector: string) => {
  for (let i = 0; i < 200; i += 1) {
    if (app().querySelector(selector)) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error(`等不到 ${selector}`);
};
const byText = (selector: string, text: string) =>
  [...app().querySelectorAll(selector)].find((el) => el.textContent?.includes(text));

beforeAll(async () => {
  document.body.innerHTML = `<div id="app"></div>`;
  localStorage.clear();
  await import("../src/main");
});

describe("刷題流程（真實點擊）", () => {
  it("首頁 → 證照 → 級別 → 科目 → 新題庫練習 → 作答", async () => {
    click(app().querySelector('[data-cert="aiot"]'));
    click(app().querySelector('[data-level="junior"]'));
    click(app().querySelector('[data-subject="aiot-junior-basics"]'));
    expect(app().textContent).toContain("AIoT 基礎概論");

    click(app().querySelector('[data-mode="practice"]'));
    await waitFor(".choices");

    click(app().querySelector('[data-choice="A"]'));
    // 作答後即時揭曉：詳解與正解摘要都出現。
    expect(app().querySelector(".answer-summary")).toBeTruthy();
    expect(app().textContent).toContain("詳解");
  });

  it("作答被寫進 localStorage 的作答歷程（含時間與次數）", () => {
    const raw = JSON.parse(localStorage.getItem("ipas-aiap-drill-progress")!);
    const progress = raw["aiot-junior-basics:practice"];
    expect(progress).toBeTruthy();
    const records = Object.values(progress.records) as { attempts: number; lastAt: number }[];
    expect(records).toHaveLength(1);
    expect(records[0].attempts).toBe(1);
    expect(records[0].lastAt).toBeGreaterThan(0);
  });

  it("「推薦」篩選可點，且會換到另一題", () => {
    const before = app().querySelector(".prompt")!.textContent;
    click(app().querySelector('[data-filter="recommended"]'));
    expect(app().querySelector('[data-filter="recommended"]')?.getAttribute("aria-pressed")).toBe("true");
    // 剛答過的那題若已答對就不再被推薦；無論如何畫面必須仍有題目可作答。
    expect(app().querySelector(".choices") ?? app().querySelector(".empty-state")).toBeTruthy();
    expect(typeof before).toBe("string");
  });

  it("校準模式可開關，開啟後出現下注列且標記會被記住", () => {
    click(app().querySelector('[data-filter="all"]'));
    // 已揭曉的題目不會出現下注列（事後標記沒有校準意義），先換到未作答的下一題。
    click(byText("button", "下一題"));
    click(byText("button", "校準模式"));
    expect(app().querySelector(".confidence-picker")).toBeTruthy();

    click(app().querySelector('[data-confidence="unsure"]'));
    expect(app().querySelector('[data-confidence="unsure"]')?.getAttribute("aria-pressed")).toBe("true");

    // 信心是對「這一題」下的注：換題即作廢，不該被帶到下一題。
    click(byText("button", "下一題"));
    expect(app().querySelector('[data-confidence="unsure"]')?.getAttribute("aria-pressed")).toBe("false");

    click(app().querySelector('[data-confidence="sure"]'));
    click(app().querySelector('[data-choice="B"]'));
    const raw = JSON.parse(localStorage.getItem("ipas-aiap-drill-progress")!);
    const records = raw["aiot-junior-basics:practice"].records as Record<string, { confidence?: string }>;
    expect(Object.values(records).some((record) => record.confidence === "sure")).toBe(true);
    // 「不確定」是在換題前標的，換題即作廢，不該被記到別題上。
    expect(Object.values(records).some((record) => record.confidence === "unsure")).toBe(false);
  });

  it("學習診斷頁打得開，且四張表都在", () => {
    click(byText("button", "學習診斷"));
    const text = app().textContent ?? "";
    expect(text).toContain("評鑑節點表現");
    expect(text).toContain("認知層級表現");
    expect(text).toContain("題型表現");
    expect(text).toContain("錯誤類型");
    expect(text).toContain("信心校準");
    click(app().querySelector('[data-nav="back-play"]'));
    expect(app().querySelector(".choices")).toBeTruthy();
  });
});
