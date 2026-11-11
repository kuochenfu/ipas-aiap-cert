// @vitest-environment jsdom
import { beforeAll, expect, it, vi } from "vitest";

const app = () => document.querySelector("#app")!;
const click = (selector: string) => {
  const target = app().querySelector(selector);
  expect(target, selector).toBeTruthy();
  target!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};
const waitFor = (selector: string) => vi.waitFor(() => expect(app().querySelector(selector)).toBeTruthy(), { timeout: 20_000 });

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  localStorage.clear();
  vi.stubGlobal("CSS", { escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, char => `\\${char}`) });
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  HTMLElement.prototype.scrollIntoView = vi.fn();
  await import("../src/main");
});

it("打開單元先讀講義，手機段落選單可直接跳到後面的白話圖解", async () => {
  click('[data-nav="study"]');
  await waitFor('[data-study-search]');
  click('[data-study-open="senior-ml|L231"]');
  await waitFor('.reader-layout');
  const first = app().querySelector('.study-note-section')!;
  expect(first.querySelector('h3')?.textContent).toMatch(/^3\.1 /);
  const picker = app().querySelector<HTMLSelectElement>('[data-reader-section]')!;
  expect(picker.value).toBe(first.id);
  const graph = app().querySelector<HTMLElement>('.is-learning .study-note-section')!;
  picker.value = graph.id;
  picker.dispatchEvent(new Event("change", { bubbles: true }));
  expect(document.activeElement).toBe(graph.querySelector('h3'));
  expect(graph.querySelector('svg[role="img"]')).toBeTruthy();
  expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
});

it("AIoT速記會同步限制段落選單，退出後恢復全部筆記", async () => {
  click('[data-nav="study"]');
  await waitFor('[data-study-cert="aiot"]');
  click('[data-study-cert="aiot"]');
  await waitFor('[data-study-open="aiot-junior-basics|A1.1"]');
  click('[data-study-open="aiot-junior-basics|A1.1"]');
  await waitFor('[data-reader-section]');
  const picker = app().querySelector<HTMLSelectElement>('[data-reader-section]')!;
  const total = picker.options.length;
  expect(total).toBeGreaterThanOrEqual(7);
  click('[data-study-action="cram"]');
  const enabled = [...picker.options].filter(option => !option.disabled);
  expect(enabled).toHaveLength(2);
  expect(enabled.every(option => ['formula','confuse'].includes(option.dataset.noteSection!))).toBe(true);
  picker.value = enabled.find(option => option.dataset.noteSection === 'formula')!.value;
  picker.dispatchEvent(new Event('change', { bubbles: true }));
  expect(document.activeElement?.closest('[data-note-section="formula"]')).toBeTruthy();
  click('[data-study-action="cram"]');
  expect([...picker.options].every(option => !option.disabled && !option.hidden)).toBe(true);
  expect(picker.options.length).toBe(total);
  expect(app().querySelectorAll('.study-note-section')).toHaveLength(7);
});
