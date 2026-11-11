// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderStudyVisual } from "../src/ui/studyVisual";
import type { StudyVisual } from "../src/data/studyVisuals.types";

const parse = (visual: StudyVisual, label = "教學圖解") => {
  const container = document.createElement("div");
  container.innerHTML = renderStudyVisual(label, visual);
  return container;
};
const noInvalidGeometry = (container: Element) => {
  expect(container.innerHTML).not.toMatch(/NaN|Infinity|undefined/);
  for (const element of container.querySelectorAll("svg *")) {
    for (const name of ["x", "y", "cx", "cy", "width", "height", "r", "fill-opacity"]) {
      if (element.hasAttribute(name)) expect(Number.isFinite(Number(element.getAttribute(name)))).toBe(true);
    }
  }
};

describe("教學 SVG 圖解", () => {
  it("每種圖有圖名、可見帶讀、SVG 名稱與說明、原生精確資料，並跳脫所有文字", () => {
    const unsafe = '<img src=x onerror="alert(1)">&測試';
    const visuals: StudyVisual[] = [
      { kind: "bars", summary: unsafe, valueLabel: unsafe, suffix: unsafe, items: [{ label: unsafe, value: 2 }] },
      { kind: "plot", summary: unsafe, mode: "scatter", xLabel: unsafe, yLabel: unsafe, series: [{ name: unsafe, points: [{ x: 1, y: 2, label: unsafe }] }] },
      { kind: "diagram", summary: unsafe, nodes: [{ id: unsafe, col: 0, row: 0, lines: [unsafe] }, { id: "b", col: 1, row: 0, lines: ["終點"] }], edges: [{ from: unsafe, to: "b", label: unsafe }] },
      { kind: "matrix", summary: unsafe, rowLabels: [unsafe], columnLabels: [unsafe], values: [[2]], cellLabels: [[unsafe]], suffix: unsafe },
      { kind: "waffle", summary: unsafe, unit: unsafe, groups: [{ label: unsafe, count: 2 }] },
    ];
    for (const visual of visuals) {
      const html = parse(visual, unsafe);
      expect(html.querySelector("figure > figcaption")?.textContent).toBe(unsafe);
      expect(html.querySelector(".study-visual-summary")?.textContent).toContain(unsafe);
      expect(html.querySelector(".study-visual-how")?.textContent).toContain("讀圖方式");
      expect(html.querySelector('svg[role="img"]')?.getAttribute("aria-label")).toBe(unsafe);
      expect(html.querySelector("svg > title")?.textContent).toBe(unsafe);
      expect(html.querySelector("svg > desc")?.textContent).toContain(unsafe);
      expect(html.querySelector("details > summary")?.textContent).toContain("精確");
      expect(html.querySelector(".study-visual-scroll-hint")?.textContent).toContain("在圖內左右滑動");
      expect(html.querySelector("details table")).toBeTruthy();
      expect(html.querySelector("img,script,[onerror]")).toBeNull();
      expect(html.querySelector("svg [id]")).toBeNull();
    }
  });

  it("長條從零起算、依數值比例繪製並直接標值；全零與無效資料也可閱讀", () => {
    const html = parse({ kind: "bars", summary: "數量比較", valueLabel: "產品數", max: 100, suffix: " 件", items: [{ label: "A", value: 80 }, { label: "B", value: 20 }, { label: "零", value: 0 }] });
    const bars = [...html.querySelectorAll(".study-visual-bar")];
    expect(bars.map((bar) => bar.getAttribute("x"))).toEqual(["224", "224", "224"]);
    expect(Number(bars[0].getAttribute("width")) / Number(bars[1].getAttribute("width"))).toBe(4);
    expect(html.querySelectorAll(".study-visual-value")[0].textContent).toBe("80 件");
    expect(html.querySelectorAll(".study-visual-tick")[0].textContent).toBe("0");
    noInvalidGeometry(html);
    noInvalidGeometry(parse({ kind: "bars", summary: "零", valueLabel: "數量", items: [{ label: "A", value: 0 }] }));
    const invalid = parse({ kind: "bars", summary: "無效數值", valueLabel: "數量", items: [{ label: "A", value: NaN }, { label: "B", value: -1 }] });
    expect(invalid.querySelector(".study-visual-notice")?.textContent).toContain("沒有可繪製");
    expect(invalid.querySelector("details")?.textContent).toContain("無效數值");
    noInvalidGeometry(invalid);
  });

  it("圖上長小數有近似標示並控制字長，精確值保留在 title 與資料表", () => {
    const value = 34.86784401;
    const html = parse({ kind: "bars", summary: "二項機率", valueLabel: "機率", suffix: "%", items: [{ label: "0 件不良", value }] });
    expect(html.querySelector(".study-visual-value")?.textContent).toBe("≈34.868%");
    expect(html.querySelector(".study-visual-bar title")?.textContent).toContain("34.86784401%");
    expect(html.querySelector("details")?.textContent).toContain("34.86784401%");
    const tiny = parse({ kind: "bars", summary: "微小量", valueLabel: "量", items: [{ label: "A", value: 0.00000012345 }] });
    expect(tiny.querySelector(".study-visual-value")?.textContent).toBe("≈1.23e-7");
    noInvalidGeometry(html);
    noInvalidGeometry(tiny);
  });

  it("座標圖使用真正數值間距，保留負值、指定範圍與精確資料", () => {
    const html = parse({ kind: "plot", summary: "不等距", mode: "line", xLabel: "時間（秒）", yLabel: "位移", xDomain: [0, 10], yDomain: [-2, 2], series: [{ name: "測量", points: [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 10, y: 1 }] }] });
    const circles = [...html.querySelectorAll(".study-visual-point circle")];
    const xs = circles.map((circle) => Number(circle.getAttribute("cx")));
    expect((xs[2] - xs[1]) / (xs[1] - xs[0])).toBeCloseTo(9, 2);
    expect(html.querySelector('[data-x="0"][data-y="-1"]')).toBeTruthy();
    expect(html.querySelector(".study-visual-tick")?.textContent).toBe("0");
    expect(html.querySelector("details")?.textContent).toContain("-1");
    expect(html.querySelector("svg")?.textContent).toContain("時間（秒）");
    noInvalidGeometry(html);
  });

  it("equalScale 保留向量角度，兩軸一個單位具有相同像素長度", () => {
    const html = parse({ kind: "plot", summary: "向量", mode: "line", equalScale: true, xLabel: "x", yLabel: "y", xDomain: [0, 2], yDomain: [0, 2], series: [{ name: "45 度", points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }] });
    const [a, b] = [...html.querySelectorAll(".study-visual-point circle")];
    const dx = Number(b.getAttribute("cx")) - Number(a.getAttribute("cx"));
    const dy = Number(a.getAttribute("cy")) - Number(b.getAttribute("cy"));
    expect(dx).toBeCloseTo(dy, 3);
    expect(dx).toBeGreaterThan(0);
  });

  it("四條數列有顏色、形狀與線型區分，第五條仍完整保留而非截掉", () => {
    const html = parse({ kind: "plot", summary: "比較", mode: "line", xLabel: "x", yLabel: "y", series: Array.from({ length: 5 }, (_, i) => ({ name: `數列${i}`, points: [{ x: 0, y: i }, { x: 1, y: i + 1, label: `終點${i}` }] })) });
    expect(html.querySelectorAll(".study-visual-line")).toHaveLength(5);
    expect(html.querySelectorAll(".study-visual-legend li")).toHaveLength(5);
    for (let i = 0; i < 4; i += 1) expect(html.querySelector(`.study-visual-point.study-visual-series-${i}`)).toBeTruthy();
    expect(html.querySelector('.study-visual-point.study-visual-series-0 circle')).toBeTruthy();
    expect(html.querySelector('.study-visual-point.study-visual-series-1 path')).toBeTruthy();
    expect(html.querySelector('.study-visual-point.study-visual-series-3 rect')).toBeTruthy();
    expect(html.querySelector("details")?.textContent).toContain("數列4");
    noInvalidGeometry(html);
  });

  it("散佈圖可搭配明確連線與投影輔助線，輔助線先畫且保留精確端點", () => {
    const html = parse({ kind: "plot", mode: "scatter", equalScale: true, summary: "PCA 投影", xLabel: "x", yLabel: "y", xDomain: [-2, 2], yDomain: [-2, 2], series: [{ name: "資料", points: [{ x: 1, y: 0 }] }, { name: "PC1", connect: true, points: [{ x: -2, y: -2 }, { x: 2, y: 2 }] }], guides: [{ from: { x: 1, y: 0 }, to: { x: 0.5, y: 0.5 }, label: "垂直投影" }] });
    expect(html.querySelectorAll(".study-visual-line")).toHaveLength(1);
    expect(html.querySelector(".study-visual-guide > title")?.textContent).toBe("垂直投影");
    expect(html.querySelector("svg")!.innerHTML.indexOf('class="study-visual-guide"')).toBeLessThan(html.querySelector("svg")!.innerHTML.indexOf('class="study-visual-point'));
    expect(html.querySelectorAll("details table")).toHaveLength(2);
    expect(html.querySelector("details")?.textContent).toContain("輔助線的精確座標");
    noInvalidGeometry(html);
  });

  it("空數列、單點、全零與範圍外座標不產生壞幾何，也保留完整資料", () => {
    const base = { kind: "plot" as const, summary: "邊界", mode: "line" as const, xLabel: "x", yLabel: "y" };
    for (const points of [[], [{ x: 0, y: 0 }], [{ x: NaN, y: Infinity }], [{ x: 0, y: 0 }, { x: 0, y: 0 }]]) {
      noInvalidGeometry(parse({ ...base, series: [{ name: "A", points }] }));
    }
    const clipped = parse({ ...base, xDomain: [0, 1], yDomain: [0, 1], series: [{ name: "A", points: [{ x: -1, y: 0.5 }, { x: 2, y: 0.5 }] }] });
    expect(clipped.querySelectorAll(".study-visual-point")).toHaveLength(0);
    expect(clipped.querySelector(".study-visual-line")?.getAttribute("d")).toBe("M 92 194 L 676 194");
    expect(clipped.querySelector("details")?.textContent).toContain("-1");
    noInvalidGeometry(clipped);
  });

  it("方塊連線抵達邊界、箭頭在節點之前畫出，長標籤會換行且無共用 ID", () => {
    const html = parse({ kind: "diagram", summary: "從資料到判斷", nodes: [{ id: "a", col: 0, row: 0, lines: ["需要換行的超長中文標籤", "資料來源"] }, { id: "b", col: 1, row: 0, lines: ["驗證"] }, { id: "c", col: 1, row: 1, lines: ["部署"] }], edges: [{ from: "a", to: "b", label: "先清理再驗證" }, { from: "b", to: "c" }] });
    const rect = html.querySelector('[data-node="a"] rect')!;
    const b = html.querySelector('[data-node="b"] rect')!;
    const startX = Number(rect.getAttribute("x")) + Number(rect.getAttribute("width"));
    const centerY = Number(rect.getAttribute("y")) + Number(rect.getAttribute("height")) / 2;
    expect(html.querySelector('[data-from="a"] path')?.getAttribute("d")).toBe(`M ${startX} ${centerY} L ${b.getAttribute("x")} ${centerY}`);
    expect(html.querySelector('[data-from="a"] polygon')?.getAttribute("points")?.split(" ")[0]).toBe(`${b.getAttribute("x")},${centerY}`);
    expect(html.querySelectorAll('[data-node="a"] tspan').length).toBeGreaterThan(1);
    const svg = html.querySelector("svg")!;
    expect(svg.innerHTML.indexOf('class="study-visual-edge"')).toBeLessThan(svg.innerHTML.indexOf('class="study-visual-node'));
    expect(html.querySelector("[id]")).toBeNull();
    noInvalidGeometry(html);
  });

  it("跨列分支與回測會繞開中間節點，路徑首尾仍貼合各自方塊邊界", () => {
    const diagrams: StudyVisual[] = [
      { kind: "diagram", summary: "備份分支", nodes: [{ id: "store", col: 2, row: 0, lines: ["儲存"] }, { id: "use", col: 2, row: 1, lines: ["使用"] }, { id: "audit", col: 1, row: 1, lines: ["監控"] }, { id: "index", col: 1, row: 2, lines: ["索引"] }, { id: "copies", col: 2, row: 2, lines: ["備份"] }], edges: [{ from: "store", to: "copies" }, { from: "store", to: "index" }, { from: "store", to: "use" }] },
      { kind: "diagram", summary: "修正後再測", nodes: [{ id: "need", col: 0, row: 0, lines: ["需求"] }, { id: "poc", col: 1, row: 0, lines: ["PoC"] }, { id: "pilot", col: 2, row: 0, lines: ["試點"] }, { id: "gate", col: 2, row: 1, lines: ["驗收"] }, { id: "release", col: 1, row: 1, lines: ["上線"] }, { id: "operate", col: 0, row: 1, lines: ["營運"] }, { id: "revise", col: 1, row: 2, lines: ["修正"] }], edges: [{ from: "gate", to: "revise", label: "未通過" }, { from: "revise", to: "pilot", label: "再測" }] },
    ];
    for (const visual of diagrams) {
      const html = parse(visual);
      const boxes = [...html.querySelectorAll(".study-visual-node")].map((node) => {
        const rect = node.querySelector("rect")!;
        return { id: node.getAttribute("data-node")!, x: Number(rect.getAttribute("x")), y: Number(rect.getAttribute("y")), w: Number(rect.getAttribute("width")), h: Number(rect.getAttribute("height")) };
      });
      expect(html.querySelectorAll(".study-visual-edge")).toHaveLength(visual.kind === "diagram" ? visual.edges.length : 0);
      expect(html.querySelector(".study-visual-notice")).toBeNull();
      for (const edge of html.querySelectorAll(".study-visual-edge")) {
        const from = edge.getAttribute("data-from");
        const to = edge.getAttribute("data-to");
        const numbers = edge.querySelector("path")!.getAttribute("d")!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
        const points = Array.from({ length: numbers.length / 2 }, (_, index) => ({ x: numbers[index * 2], y: numbers[index * 2 + 1] }));
        const onBoundary = (at: { x: number; y: number }, id: string | null) => {
          const box = boxes.find((value) => value.id === id)!;
          return ((at.x === box.x || at.x === box.x + box.w) && at.y >= box.y && at.y <= box.y + box.h)
            || ((at.y === box.y || at.y === box.y + box.h) && at.x >= box.x && at.x <= box.x + box.w);
        };
        expect(onBoundary(points[0], from)).toBe(true);
        expect(onBoundary(points[points.length - 1], to)).toBe(true);
        for (let index = 1; index < points.length; index += 1) {
          const a = points[index - 1];
          const b = points[index];
          expect(a.x === b.x || a.y === b.y).toBe(true);
          for (const box of boxes.filter((value) => value.id !== from && value.id !== to)) {
            const crosses = a.y === b.y
              ? a.y > box.y && a.y < box.y + box.h && Math.max(a.x, b.x) > box.x && Math.min(a.x, b.x) < box.x + box.w
              : a.x > box.x && a.x < box.x + box.w && Math.max(a.y, b.y) > box.y && Math.min(a.y, b.y) < box.y + box.h;
            expect(crosses, `${from}→${to} 穿越 ${box.id}`).toBe(false);
          }
        }
      }
      noInvalidGeometry(html);
    }
    const clear = parse({ kind: "diagram", summary: "未受阻連線保留原轉折", nodes: [{ id: "a", col: 0, row: 0, lines: ["起點"] }, { id: "b", col: 1, row: 1, lines: ["終點"] }, { id: "other", col: 2, row: 0, lines: ["其他"] }], edges: [{ from: "a", to: "b" }] });
    expect(clear.querySelector(".study-visual-edge path")?.getAttribute("d")).toBe("M 112 118 L 112 155 L 348 155 L 348 192");
  });

  it("矩陣是真正交叉的色塊與數值，正負值及中性零皆可辨識", () => {
    const html = parse({ kind: "matrix", summary: "中心化", rowLabels: ["A", "B"], columnLabels: ["x", "y"], values: [[-2, 0], [2, 1]], cellLabels: [["低於平均", "等於平均"], ["高於平均", "偏高"]] });
    expect(html.querySelectorAll(".study-visual-cell")).toHaveLength(4);
    expect(html.querySelectorAll(".study-visual-cell.is-negative")).toHaveLength(1);
    expect(html.querySelectorAll(".study-visual-cell.is-zero")).toHaveLength(1);
    expect(html.querySelector(".study-visual-cell.is-negative text")?.textContent).toBe("-2");
    expect(html.querySelector(".study-visual-how")?.textContent).toContain("0 使用中性底色");
    expect(html.querySelector("details")?.textContent).toContain("低於平均");
    noInvalidGeometry(html);
    noInvalidGeometry(parse({ kind: "matrix", summary: "零", rowLabels: ["A"], columnLabels: ["x"], values: [[0]] }));
    noInvalidGeometry(parse({ kind: "matrix", summary: "空", rowLabels: [], columnLabels: [], values: [] }));
  });

  it("格子圖每一格有單位、分類與總量，超過200格時以資料表明確後備", () => {
    const html = parse({ kind: "waffle", summary: "自然頻率", columns: 10, unit: "100 件產品", groups: [{ label: "不良", count: 3 }, { label: "良品", count: 97 }] });
    expect(html.querySelectorAll(".study-visual-waffle-cell")).toHaveLength(100);
    expect(html.querySelectorAll(".study-visual-waffle-cell.study-visual-series-0")).toHaveLength(3);
    expect(html.querySelector(".study-visual-how")?.textContent).toContain("每格代表：100 件產品");
    expect(html.querySelector(".study-visual-legend")?.textContent).toContain("不良：3 格");
    expect(html.querySelector("svg")?.textContent).toContain("合計 100 格");
    const fallback = parse({ kind: "waffle", summary: "太多格", unit: "1 件", groups: [{ label: "A", count: 201 }] });
    expect(fallback.querySelectorAll(".study-visual-waffle-cell")).toHaveLength(0);
    expect(fallback.querySelector(".study-visual-notice")?.textContent).toContain("超過單圖 200 格");
    expect(fallback.querySelector("details")?.textContent).toContain("201");
    noInvalidGeometry(html);
    noInvalidGeometry(fallback);
  });

  it("圖表專用CSS限制本身的寬度並在內部橫向捲動，字級與色彩沿用主題", () => {
    const css = readFileSync(resolve(process.cwd(), "src/studyVisual.css"), "utf8");
    expect(css).toMatch(/\.study-visual\s*\{[^}]*max-width:\s*100%/s);
    expect(css).toMatch(/\.study-visual \.study-visual-scroll[^}]*overflow-x:\s*auto/s);
    expect(css).toContain("font-size: 16px");
    for (const token of ["--text", "--accent", "--panel", "--border", "--muted", "--wrong"]) expect(css).toContain(`var(${token})`);
    expect(css).not.toMatch(/(?:^|\})\s*(?:svg|text|table|figure|body|:root)\b/m);
  });
});
