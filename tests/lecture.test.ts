// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderLectureItems, stripLectureMarker } from "../src/ui/lecture";
import { escapeHtml } from "../src/ui/escape";
import type { StudyNoteItem } from "../src/data/types";

const render = (items: StudyNoteItem[]) => {
  const root = document.createElement("div");
  root.innerHTML = renderLectureItems(items, item => `<div class="structured">${escapeHtml(item.text)}</div>`);
  return root;
};

describe("講義正文的段落與編號", () => {
  it("移除人工清單前綴，保留小數、百分比與公式", () => {
    for (const text of ["1. 概念", "（2）概念", "(3) 概念", "A. 概念", "一、概念"]) expect(stripLectureMarker(text)).toBe("概念");
    for (const text of ["1.5 倍", "0.05 是門檻", "10% 的樣本", "−3 是起點", "P(A|B) = 0.2", "[1, 2, 3]"]) expect(stripLectureMarker(text)).toBe(text);
  });
  it("小標只出現一次，定義排成正文，不再層層套圓點", () => {
    const root = render([{ text: "1. 資料清理：先確認來源。", children: [{ text: "（1）缺值", children: [{ text: "A. 檢查缺值原因，再決定如何處理。" }] }] }]);
    expect(root.querySelector("h4")?.textContent).toBe("資料清理");
    expect(root.querySelector("h5")?.textContent).toBe("缺值");
    expect(root.querySelectorAll("ul")).toHaveLength(0);
    expect(root.textContent).not.toContain("1.");
    expect(root.textContent).not.toContain("（1）");
    expect(root.querySelector(".lecture-paragraph")?.textContent).toBe("先確認來源。");
  });
  it("真正的連續步驟使用一次有序編號，不改動步驟內的數值", () => {
    const root = render([{ text: "1. 取 25 件樣本。" }, { text: "2. 計算 0.05 的門檻。" }]);
    expect(root.querySelectorAll("ol > li")).toHaveLength(2);
    expect(root.querySelector("li")?.textContent).toBe("取 25 件樣本。");
    expect(root.querySelectorAll("li")[1].textContent).toContain("0.05");
    expect(root.textContent).not.toContain("2.");
  });
  it("開頭先讀定義再看比較表，所有內容仍被保留", () => {
    const root = render([{ text: "比較表", table: { headers: ["項目"], rows: [["A"]] } }, { text: "先理解這個概念的用途。" }, { text: "後續說明。" }]);
    expect(root.firstElementChild?.firstElementChild?.textContent).toBe("先理解這個概念的用途。");
    expect(root.querySelector(".structured")?.textContent).toBe("比較表");
    expect(root.textContent).toContain("後續說明。");
  });
  it("自編案例明確標示來源並跳脫文字，正文與例子都可朗讀", () => {
    const attack = '<img src=x onerror="alert(1)">&';
    const root = render([{ text: attack, example: { id: "sample" }, children: [{ text: `數字：${attack}` }] }]);
    expect(root.querySelector("aside")?.getAttribute("aria-label")).toBe(`自編實務例子：${attack}`);
    expect(root.querySelector(".lecture-example-label")?.textContent).toBe("自編實務例子");
    expect(root.querySelectorAll(".note-text").length).toBeGreaterThanOrEqual(2);
    expect(root.querySelector("img,[onerror],script")).toBeNull();
    expect(root.textContent).toContain(attack);
  });
  it("長段落保留正文格式，深入層級不產生跳級標題", () => {
    const root = render([{ text: "這是一段完整敘述。它不應整段被當成小標。", children: [{ text: "第二層", children: [{ text: "第三層", children: [{ text: "內容。" }] }] }] }]);
    expect(root.querySelector("h4")).toBeNull();
    expect(root.querySelector("h5")?.textContent).toBe("第二層");
    expect(root.querySelectorAll("h6,h7")).toHaveLength(0);
  });
});
