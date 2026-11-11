// @vitest-environment jsdom
import { expect, it, vi } from "vitest";

it("從圖內軸標搜尋進入閱讀器，不會將HTML標記插入SVG而破壞圖面", async () => {
  document.body.innerHTML = '<div id="app"></div>';
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  HTMLElement.prototype.scrollIntoView = vi.fn();
  await import("../src/main");
  const app = document.querySelector("#app")!;
  const click = (selector: string) => {
    const element = app.querySelector(selector);
    expect(element, selector).toBeTruthy();
    element!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  };
  click('[data-nav="study"]');
  await vi.waitFor(() => expect(app.querySelector('[data-study-search]')).toBeTruthy(), { timeout: 20_000 });
  const search = app.querySelector<HTMLInputElement>('[data-study-search]')!;
  search.value = "感測器 A";
  search.dispatchEvent(new Event("input", { bubbles: true }));
  expect(app.querySelector('[data-study-count]')?.textContent).toContain("1 個節點");
  click('[data-study-open="senior-ml|L231"]');
  await vi.waitFor(() => expect(app.querySelector('figure.study-visual svg')).toBeTruthy());
  expect(app.querySelector('svg mark')).toBeNull();
  expect(app.querySelector('svg .study-visual-axis-label')?.textContent).toBeTruthy();
  expect([...app.querySelectorAll('svg text')].some(text => text.textContent === "感測器 A（標準化值）")).toBe(true);
  const hit = app.querySelector('.study-visual-data mark');
  expect(hit?.textContent).toContain("感測器 A");
  expect(hit?.closest("details")?.open).toBe(true);
}, 30_000);
