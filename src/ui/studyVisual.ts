import type { StudyVisual, VisualPoint } from "../data/studyVisuals.types";
import { escapeHtml } from "./escape";

type RenderedVisual = { width: number; height: number; marks: string; how: string; legend?: string; data: string; notice?: string };
type Domain = [number, number];
type XY = { x: number; y: number };

const finite = (value: number): boolean => Number.isFinite(value);
const coordinate = (value: number): string => finite(value) ? String(Math.abs(value) < 1e12 ? Math.round(value * 100) / 100 : value) : "0";
const exact = (value: number): string => finite(value) ? String(value) : "無效數值";
/** 圖面優先可讀：長小數最多三位，極大／極小值用三位有效數字；表格與 SVG title 保留原值。 */
const plotted = (value: number): string => {
  if (!finite(value)) return "無效數值";
  const magnitude = Math.abs(value);
  const display = magnitude >= 1e6 || (magnitude > 0 && magnitude < 0.001)
    ? value.toExponential(2).replace(/\.?0+e/u, "e") : String(Number(value.toFixed(3)));
  return `${Number(display) === value ? "" : "≈"}${display}`;
};
const tick = (value: number): string => finite(value) ? String(Number(value.toPrecision(4))) : "0";
const tone = (index: number): string => `study-visual-series-${(((finite(index) ? Math.trunc(index) : 0) % 4) + 4) % 4}`;
const title = (text: string): string => `<title>${escapeHtml(text)}</title>`;
const text = (x: number, y: number, value: string, className = "", anchor = "start"): string =>
  `<text x="${coordinate(x)}" y="${coordinate(y)}" class="${className}" text-anchor="${anchor}">${escapeHtml(value)}</text>`;

/** 以全形約兩個半形計算換行；完整文字仍保留在 title 與下方資料表。 */
const wrap = (value: string, units = 22): string[] => {
  const lines: string[] = [];
  let line = "";
  let used = 0;
  for (const char of value) {
    const size = /[\u0000-\u00ff]/u.test(char) ? 1 : 2;
    if (char === "\n" || (used + size > units && line)) {
      lines.push(line);
      line = "";
      used = 0;
    }
    if (char !== "\n") { line += char; used += size; }
  }
  if (line || !lines.length) lines.push(line);
  return lines;
};
const labelLines = (values: string[], units: number, maxLines = 3): string[] => {
  const all = values.flatMap((value) => wrap(value, units));
  const visible = all.slice(0, maxLines);
  if (all.length > maxLines) visible[maxLines - 1] = `${visible[maxLines - 1].slice(0, -1)}…`;
  return visible;
};
const multiline = (x: number, y: number, lines: string[], className: string, anchor = "middle"): string =>
  `<text class="${className}" text-anchor="${anchor}">${lines.map((line, index) => `<tspan x="${coordinate(x)}" y="${coordinate(y + index * 22)}">${escapeHtml(line)}</tspan>`).join("")}</text>`;
const table = (caption: string, headers: string[], rows: string[][]): string => `
  <div class="study-visual-table-scroll"><table class="study-visual-table">
    <caption>${escapeHtml(caption)}</caption>
    <thead><tr>${headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
const legend = (items: { label: string; value?: string }[], line = false): string => `
  <ul class="study-visual-legend">${items.map((item, index) => `<li class="${tone(index)}"><span class="study-visual-key${line ? ` is-line is-pattern-${index % 4}` : ""}" aria-hidden="true"></span><span>${escapeHtml(item.label)}${item.value === undefined ? "" : `：${escapeHtml(item.value)}`}</span></li>`).join("")}</ul>`;
const noData = (data: string, how = "展開下方資料表，查看原始數值與標籤。", notice = "目前沒有可繪製的有效資料。"): RenderedVisual =>
  ({ width: 520, height: 100, marks: text(28, 54, "請查看下方資料表", "study-visual-empty"), how, data, notice });

function bars(visual: Extract<StudyVisual, { kind: "bars" }>): RenderedVisual {
  const suffix = visual.suffix ?? "";
  const rows = visual.items.map((item) => [item.label, `${exact(item.value)}${suffix}`]);
  const data = table("長條圖的精確資料", ["項目", visual.valueLabel], rows);
  const valid = visual.items.filter((item) => finite(item.value) && item.value >= 0);
  if (!valid.length) return noData(data);
  const maximum = Math.max(0, finite(visual.max ?? 0) ? visual.max ?? 0 : 0, ...valid.map((item) => item.value));
  const maxValue = maximum > 0 ? maximum : 1;
  const width = 720;
  const left = 224;
  const right = 100;
  const barWidth = width - left - right;
  const rowHeight = 72;
  const height = 56 + valid.length * rowHeight + 52;
  let marks = "";
  for (let index = 0; index <= 4; index += 1) {
    const x = left + barWidth * index / 4;
    marks += `<line class="study-visual-grid" x1="${x}" x2="${x}" y1="28" y2="${height - 64}" />`;
    marks += text(x, height - 37, tick(maxValue * index / 4), "study-visual-tick", "middle");
  }
  valid.forEach((item, index) => {
    const y = 46 + index * rowHeight;
    const valueWidth = item.value / maxValue * barWidth;
    const lines = labelLines([item.label], 23, 2);
    marks += multiline(left - 16, y + 7 - (lines.length - 1) * 11, lines, "study-visual-bar-label", "end");
    marks += `<rect class="study-visual-bar ${tone(index)}" x="${left}" y="${y - 17}" width="${coordinate(valueWidth)}" height="34" rx="5">${title(`${item.label}：${exact(item.value)}${suffix}`)}</rect>`;
    const valueLines = labelLines([`${plotted(item.value)}${suffix}`], 11, 2);
    marks += multiline(left + valueWidth + 10, y + 6 - (valueLines.length - 1) * 11, valueLines, "study-visual-value", "start");
  });
  marks += text(left + barWidth / 2, height - 8, `${visual.valueLabel}${suffix ? `（${suffix}）` : ""}`, "study-visual-axis-label", "middle");
  return { width, height, marks, how: "從共同的 0 起點比較長度；每條右側直接標示數值，≈ 表示圖上取近似值，精確數值見下表。窄螢幕可在圖內左右捲動。", data,
    notice: valid.length === visual.items.length ? undefined : "負值或非有限數值未畫成長條；原始項目仍列於資料表。" };
}

const domain = (values: number[], provided?: Domain): Domain => {
  let low = provided && provided.every(finite) ? Math.min(...provided) : Math.min(...values);
  let high = provided && provided.every(finite) ? Math.max(...provided) : Math.max(...values);
  if (!finite(low) || !finite(high)) return [0, 1];
  if (low === high) {
    const padding = Math.max(Math.abs(low) * 0.1, 1);
    low -= padding;
    high += padding;
  }
  return finite(low) && finite(high) ? [low, high] : [-1, 1];
};
const fraction = (value: number, range: Domain): number => (value / 2 - range[0] / 2) / (range[1] / 2 - range[0] / 2);
const interpolate = (range: Domain, part: number): number => (1 - part) * range[0] + part * range[1];
const inside = (point: VisualPoint, x: Domain, y: Domain): boolean =>
  point.x >= x[0] && point.x <= x[1] && point.y >= y[0] && point.y <= y[1];

/** 在像素座標裁剪線段，無需共用 SVG clipPath ID，重複圖表亦不互相影響。 */
const clippedSegment = (a: XY, b: XY, left: number, top: number, right: number, bottom: number): [XY, XY] | undefined => {
  let start = 0;
  let end = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const p = [-dx, dx, -dy, dy];
  const q = [a.x - left, right - a.x, a.y - top, bottom - a.y];
  for (let index = 0; index < 4; index += 1) {
    if (p[index] === 0) { if (q[index] < 0) return; }
    else {
      const ratio = q[index] / p[index];
      if (p[index] < 0) start = Math.max(start, ratio);
      else end = Math.min(end, ratio);
      if (start > end) return;
    }
  }
  return [{ x: a.x + start * dx, y: a.y + start * dy }, { x: a.x + end * dx, y: a.y + end * dy }];
};
const pointShape = (point: XY, index: number): string => {
  const x = point.x;
  const y = point.y;
  if (index % 4 === 1) return `<path d="M ${coordinate(x)} ${coordinate(y - 6)} L ${coordinate(x + 6)} ${coordinate(y)} L ${coordinate(x)} ${coordinate(y + 6)} L ${coordinate(x - 6)} ${coordinate(y)} Z" />`;
  if (index % 4 === 2) return `<path d="M ${coordinate(x)} ${coordinate(y - 7)} L ${coordinate(x + 6)} ${coordinate(y + 5)} L ${coordinate(x - 6)} ${coordinate(y + 5)} Z" />`;
  if (index % 4 === 3) return `<rect x="${coordinate(x - 5)}" y="${coordinate(y - 5)}" width="10" height="10" />`;
  return `<circle cx="${coordinate(x)}" cy="${coordinate(y)}" r="5" />`;
};

function plot(visual: Extract<StudyVisual, { kind: "plot" }>): RenderedVisual {
  const rows = visual.series.flatMap((series) => series.points.map((point) => [series.name, exact(point.x), exact(point.y), point.label ?? ""]));
  const data = table("座標的精確資料", ["數列", visual.xLabel, visual.yLabel, "標記"], rows)
    + (visual.guides?.length ? table("輔助線的精確座標", ["起點 x", "起點 y", "終點 x", "終點 y", "說明"], visual.guides.map((guide) => [exact(guide.from.x), exact(guide.from.y), exact(guide.to.x), exact(guide.to.y), guide.label ?? "輔助線"])) : "");
  const all = visual.series.flatMap((series) => series.points).filter((point) => finite(point.x) && finite(point.y));
  if (!all.length) return noData(data);
  const xDomain = domain(all.map((point) => point.x), visual.xDomain);
  const yDomain = domain(all.map((point) => point.y), visual.yDomain);
  const width = 720;
  const height = 440;
  let left = 92;
  let right = width - 44;
  let top = 36;
  let bottom = height - 88;
  if (visual.equalScale) {
    const xSpan = xDomain[1] - xDomain[0];
    const ySpan = yDomain[1] - yDomain[0];
    const unitScale = Math.min((right - left) / xSpan, (bottom - top) / ySpan);
    if (finite(unitScale) && unitScale > 0) {
      const plotWidth = xSpan * unitScale;
      const plotHeight = ySpan * unitScale;
      left += (right - left - plotWidth) / 2;
      top += (bottom - top - plotHeight) / 2;
      right = left + plotWidth;
      bottom = top + plotHeight;
    }
  }
  const position = (point: VisualPoint): XY => ({ x: left + fraction(point.x, xDomain) * (right - left), y: bottom - fraction(point.y, yDomain) * (bottom - top) });
  let marks = "";
  for (let index = 0; index <= 4; index += 1) {
    const part = index / 4;
    const x = left + part * (right - left);
    const y = bottom - part * (bottom - top);
    marks += `<line class="study-visual-grid" x1="${x}" x2="${x}" y1="${top}" y2="${bottom}" />`;
    marks += `<line class="study-visual-grid" x1="${left}" x2="${right}" y1="${y}" y2="${y}" />`;
    marks += text(x, bottom + 29, tick(interpolate(xDomain, part)), "study-visual-tick", "middle");
    marks += text(left - 14, y + 6, tick(interpolate(yDomain, part)), "study-visual-tick", "end");
  }
  const zeroX = xDomain[0] <= 0 && xDomain[1] >= 0 ? position({ x: 0, y: 0 }).x : left;
  const zeroY = yDomain[0] <= 0 && yDomain[1] >= 0 ? position({ x: 0, y: 0 }).y : bottom;
  marks += `<line class="study-visual-axis" x1="${coordinate(zeroX)}" x2="${coordinate(zeroX)}" y1="${top}" y2="${bottom}" />`;
  marks += `<line class="study-visual-axis" x1="${left}" x2="${right}" y1="${coordinate(zeroY)}" y2="${coordinate(zeroY)}" />`;
  marks += text((left + right) / 2, height - 15, visual.xLabel, "study-visual-axis-label", "middle");
  marks += `<text class="study-visual-axis-label" transform="translate(23 ${(top + bottom) / 2}) rotate(-90)" text-anchor="middle">${escapeHtml(visual.yLabel)}</text>`;
  visual.guides?.forEach((guide) => {
    if (![guide.from.x, guide.from.y, guide.to.x, guide.to.y].every(finite)) return;
    const segment = clippedSegment(position(guide.from), position(guide.to), left, top, right, bottom);
    if (!segment) return;
    const [a, b] = segment;
    marks += `<path class="study-visual-guide" d="M ${coordinate(a.x)} ${coordinate(a.y)} L ${coordinate(b.x)} ${coordinate(b.y)}">${title(guide.label ?? "輔助線")}</path>`;
    if (guide.label) marks += multiline((a.x + b.x) / 2, (a.y + b.y) / 2 - 12, labelLines([guide.label], 18, 1), "study-visual-point-label");
  });
  visual.series.forEach((series, seriesIndex) => {
    const points = series.points.filter((point) => finite(point.x) && finite(point.y));
    const connected = visual.mode === "line" || series.connect;
    const ordered = connected ? [...points].sort((a, b) => a.x - b.x) : points;
    if (connected) {
      const paths = ordered.slice(1).map((point, index) => {
        const segment = clippedSegment(position(ordered[index]), position(point), left, top, right, bottom);
        return segment ? `M ${coordinate(segment[0].x)} ${coordinate(segment[0].y)} L ${coordinate(segment[1].x)} ${coordinate(segment[1].y)}` : "";
      }).join(" ");
      if (paths.trim()) marks += `<path class="study-visual-line ${tone(seriesIndex)} is-pattern-${seriesIndex % 4}" d="${paths}">${title(series.name)}</path>`;
    }
    ordered.filter((point) => inside(point, xDomain, yDomain)).forEach((point) => {
      const at = position(point);
      const caption = `${series.name}：${visual.xLabel} ${exact(point.x)}，${visual.yLabel} ${exact(point.y)}${point.label ? `；${point.label}` : ""}`;
      marks += `<g class="study-visual-point ${tone(seriesIndex)}" data-x="${exact(point.x)}" data-y="${exact(point.y)}" data-series="${escapeHtml(series.name)}">${title(caption)}${pointShape(at, seriesIndex)}</g>`;
      if (point.label || (all.length <= 8 && visual.series.length === 1)) {
        const anchor = at.x > right - 80 ? "end" : "start";
        const dx = anchor === "end" ? -10 : 10;
        const y = at.y < top + 24 ? at.y + 24 : at.y - 13;
        marks += multiline(at.x + dx, y, labelLines([point.label ?? plotted(point.y)], 22, 2), "study-visual-point-label", anchor);
      }
    });
  });
  return { width, height, marks, legend: legend(visual.series.map((series) => ({ label: series.name })), true), data,
    how: `${visual.mode === "line" ? "線連接同一數列的點；" : "每個形狀代表一個觀測點；"}橫軸按實際數值間距排列，縱軸表示數值高低。顏色與形狀／線型區分數列${visual.guides?.length ? "，灰色虛線輔助觀察投影或對照位置" : ""}，精確座標見下表。`,
    notice: all.some((point) => !inside(point, xDomain, yDomain)) ? "部分座標位於指定座標範圍外；圖中僅顯示範圍內部分，完整資料保留於表格。" : undefined };
}

type NodeBox = { id: string; x: number; y: number; width: number; height: number };
type Port = { at: XY; stub: XY; direction: number };
const segmentHitsBox = (a: XY, b: XY, box: NodeBox, padding = 0): boolean => {
  const left = box.x - padding;
  const right = box.x + box.width + padding;
  const top = box.y - padding;
  const bottom = box.y + box.height + padding;
  const epsilon = 1e-7;
  if (a.y === b.y) return a.y > top + epsilon && a.y < bottom - epsilon
    && Math.max(a.x, b.x) > left + epsilon && Math.min(a.x, b.x) < right - epsilon;
  return a.x > left + epsilon && a.x < right - epsilon
    && Math.max(a.y, b.y) > top + epsilon && Math.min(a.y, b.y) < bottom - epsilon;
};
const nodePorts = (box: NodeBox): Port[] => [
  { at: { x: box.x + box.width, y: box.y + box.height / 2 }, stub: { x: box.x + box.width + 14, y: box.y + box.height / 2 }, direction: 0 },
  { at: { x: box.x + box.width / 2, y: box.y + box.height }, stub: { x: box.x + box.width / 2, y: box.y + box.height + 14 }, direction: 1 },
  { at: { x: box.x, y: box.y + box.height / 2 }, stub: { x: box.x - 14, y: box.y + box.height / 2 }, direction: 2 },
  { at: { x: box.x + box.width / 2, y: box.y }, stub: { x: box.x + box.width / 2, y: box.y - 14 }, direction: 3 },
];
const bendCost = (a: number, b: number): number => a === b ? 0 : (a + 2) % 4 === b ? 96 : 24;

/**
 * 在節點外側與畫布周邊建立正交可見格線，搜尋距離與轉彎數較小的路徑。
 * 路徑主體避開每個節點外加 12px 的區域；首尾只在自己的邊界連接埠進出。
 * 這也處理跨列的回測、備份分支，不會從中間的其他概念方塊穿過。
 */
const orthogonalRoute = (from: NodeBox, to: NodeBox, boxes: NodeBox[], width: number, height: number): XY[] | undefined => {
  // 原本清楚且沒有穿越其他節點的路徑維持原樣，只替受阻的跨列／回測邊尋找繞路。
  const horizontal = from.y === to.y;
  const direction = Math.sign(horizontal ? to.x - from.x : to.y - from.y);
  if (!direction) return;
  const directStart = horizontal ? { x: from.x + (direction > 0 ? from.width : 0), y: from.y + from.height / 2 }
    : { x: from.x + from.width / 2, y: from.y + (direction > 0 ? from.height : 0) };
  const directEnd = horizontal ? { x: to.x + (direction > 0 ? 0 : to.width), y: to.y + to.height / 2 }
    : { x: to.x + to.width / 2, y: to.y + (direction > 0 ? 0 : to.height) };
  const middleY = (directStart.y + directEnd.y) / 2;
  const original = horizontal ? [directStart, directEnd] : [directStart, { x: directStart.x, y: middleY }, { x: directEnd.x, y: middleY }, directEnd];
  const unique = original.filter((at, index) => index === 0 || at.x !== original[index - 1].x || at.y !== original[index - 1].y);
  const direct = unique.filter((at, index) => index === 0 || index === unique.length - 1
    || !((unique[index - 1].x === at.x && at.x === unique[index + 1].x) || (unique[index - 1].y === at.y && at.y === unique[index + 1].y)));
  if (direct.slice(1).every((at, index) => !boxes.some((box) => box.id !== from.id && box.id !== to.id && segmentHitsBox(direct[index], at, box)))) return direct;
  const startPorts = nodePorts(from).filter((port) => !boxes.some((box) => box.id !== from.id && segmentHitsBox(port.at, port.stub, box, 12)));
  const endPorts = nodePorts(to).filter((port) => !boxes.some((box) => box.id !== to.id && segmentHitsBox(port.at, port.stub, box, 12)));
  const xs = [...new Set([8, width - 8, ...boxes.flatMap((box) => [box.x - 14, box.x + box.width / 2, box.x + box.width + 14])])].sort((a, b) => a - b);
  const ys = [...new Set([8, height - 8, ...boxes.flatMap((box) => [box.y - 14, box.y + box.height / 2, box.y + box.height + 14])])].sort((a, b) => a - b);
  const xCount = xs.length;
  const point = (index: number): XY => ({ x: xs[index % xCount], y: ys[Math.floor(index / xCount)] });
  const pointIndex = (at: XY): number => ys.indexOf(at.y) * xCount + xs.indexOf(at.x);
  const available = ys.flatMap((y) => xs.map((x) => !boxes.some((box) => x > box.x - 12 && x < box.x + box.width + 12 && y > box.y - 12 && y < box.y + box.height + 12)));
  const distance = new Map<number, number>();
  const previous = new Map<number, number>();
  const roots = new Map<number, Port>();
  const queue: { key: number; cost: number }[] = [];
  startPorts.forEach((port) => {
    const index = pointIndex(port.stub);
    if (!available[index]) return;
    const key = index * 4 + port.direction;
    distance.set(key, 14);
    roots.set(key, port);
    queue.push({ key, cost: 14 });
  });
  let best: { key: number; cost: number; port: Port } | undefined;
  const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost || a.key - b.key);
    const current = queue.shift()!;
    if (current.cost !== distance.get(current.key)) continue;
    if (best && current.cost > best.cost) break;
    const index = Math.floor(current.key / 4);
    const direction = current.key % 4;
    const at = point(index);
    for (const port of endPorts) {
      if (pointIndex(port.stub) !== index) continue;
      const cost = current.cost + 14 + bendCost(direction, (port.direction + 2) % 4);
      if (!best || cost < best.cost) best = { key: current.key, cost, port };
    }
    directions.forEach(([dx, dy], nextDirection) => {
      const x = index % xCount + dx;
      const y = Math.floor(index / xCount) + dy;
      if (x < 0 || x >= xs.length || y < 0 || y >= ys.length) return;
      const nextIndex = y * xCount + x;
      if (!available[nextIndex]) return;
      const next = point(nextIndex);
      if (boxes.some((box) => segmentHitsBox(at, next, box, 12))) return;
      const cost = current.cost + Math.abs(next.x - at.x) + Math.abs(next.y - at.y) + bendCost(direction, nextDirection);
      const key = nextIndex * 4 + nextDirection;
      if (cost >= (distance.get(key) ?? Infinity)) return;
      distance.set(key, cost);
      previous.set(key, current.key);
      queue.push({ key, cost });
    });
  }
  if (!best) return;
  const reverse: number[] = [best.key];
  while (previous.has(reverse[reverse.length - 1])) reverse.push(previous.get(reverse[reverse.length - 1])!);
  const keys = reverse.reverse();
  const start = roots.get(keys[0]);
  if (!start) return;
  const route = [start.at, ...keys.map((key) => point(Math.floor(key / 4))), best.port.at];
  return route.filter((at, index) => index === 0 || index === route.length - 1
    || !((route[index - 1].x === at.x && at.x === route[index + 1].x) || (route[index - 1].y === at.y && at.y === route[index + 1].y)));
};

const edgeLabelPosition = (route: XY[], lines: string[], boxes: NodeBox[], width: number, height: number): XY | undefined => {
  const labelWidth = Math.max(...lines.map((line) => [...line].reduce((sum, char) => sum + (/[\u0000-\u00ff]/u.test(char) ? 8 : 16), 0))) + 8;
  const labelHeight = 20 + (lines.length - 1) * 22;
  const segments = route.slice(1).map((b, index) => ({ a: route[index], b }))
    .sort((a, b) => Math.abs(b.a.x - b.b.x) + Math.abs(b.a.y - b.b.y) - Math.abs(a.a.x - a.b.x) - Math.abs(a.a.y - a.b.y));
  for (const segment of segments) {
    for (const part of [0.5, 0.25, 0.75]) {
      const x = segment.a.x + (segment.b.x - segment.a.x) * part;
      const y = segment.a.y + (segment.b.y - segment.a.y) * part;
      const candidates = segment.a.y === segment.b.y
        ? [{ x, y: y - labelHeight - 8 }, { x, y: y + 10 }]
        : [{ x: x + labelWidth / 2 + 10, y: y - labelHeight / 2 }, { x: x - labelWidth / 2 - 10, y: y - labelHeight / 2 }];
      for (const candidate of candidates) {
        const left = candidate.x - labelWidth / 2;
        const top = candidate.y;
        if (left < 4 || left + labelWidth > width - 4 || top < 4 || top + labelHeight > height - 4) continue;
        if (boxes.some((box) => left < box.x + box.width + 3 && left + labelWidth > box.x - 3 && top < box.y + box.height + 3 && top + labelHeight > box.y - 3)) continue;
        return { x: candidate.x, y: candidate.y + 16 };
      }
    }
  }
};

function diagram(visual: Extract<StudyVisual, { kind: "diagram" }>): RenderedVisual {
  const nodeLabel = (id: string): string => visual.nodes.find((node) => node.id === id)?.lines.join("／") ?? "找不到節點";
  const data = table("圖中節點", ["節點", "內容"], visual.nodes.map((node) => [node.lines[0] ?? "", node.lines.join("／")]))
    + table("圖中連接關係", ["起點", "終點", "關係"], visual.edges.map((edge) => [nodeLabel(edge.from), nodeLabel(edge.to), edge.label ?? "依箭頭連接"]));
  if (!visual.nodes.length) return noData(data);
  const valid = visual.nodes.filter((node) => finite(node.col) && finite(node.row));
  if (!valid.length) return noData(data);
  const nodeWidth = 176;
  const nodeHeight = 94;
  const stepX = 236;
  const stepY = 168;
  const columns = Math.max(...valid.map((node) => Math.min(2, Math.max(0, Math.trunc(node.col))))) + 1;
  const rowCount = Math.max(...valid.map((node) => Math.min(3, Math.max(0, Math.trunc(node.row))))) + 1;
  const width = Math.max(520, 48 + nodeWidth + (columns - 1) * stepX);
  const height = 48 + nodeHeight + (rowCount - 1) * stepY;
  const offsetX = (width - (nodeWidth + (columns - 1) * stepX)) / 2;
  const placed = new Map(valid.map((node) => [node.id, {
    ...node, x: offsetX + Math.min(2, Math.max(0, Math.trunc(node.col))) * stepX,
    y: 24 + Math.min(3, Math.max(0, Math.trunc(node.row))) * stepY,
  }]));
  const boxes = [...placed.values()].map((node) => ({ id: node.id, x: node.x, y: node.y, width: nodeWidth, height: nodeHeight }));
  const unplacedLabels: string[] = [];
  let missingRoutes = 0;
  let marks = "";
  visual.edges.forEach((edge) => {
    const from = placed.get(edge.from);
    const to = placed.get(edge.to);
    if (!from || !to || from.id === to.id) return;
    const route = orthogonalRoute({ ...from, width: nodeWidth, height: nodeHeight }, { ...to, width: nodeWidth, height: nodeHeight }, boxes, width, height);
    if (!route || route.length < 2) { missingRoutes += 1; return; }
    const end = route[route.length - 1];
    const previous = route[route.length - 2];
    const path = route.map((at, index) => `${index === 0 ? "M" : "L"} ${coordinate(at.x)} ${coordinate(at.y)}`).join(" ");
    const angle = Math.atan2(end.y - previous.y, end.x - previous.x);
    const rear = { x: end.x - Math.cos(angle) * 11, y: end.y - Math.sin(angle) * 11 };
    const arrow = `${coordinate(end.x)},${coordinate(end.y)} ${coordinate(rear.x + Math.sin(angle) * 5)},${coordinate(rear.y - Math.cos(angle) * 5)} ${coordinate(rear.x - Math.sin(angle) * 5)},${coordinate(rear.y + Math.cos(angle) * 5)}`;
    marks += `<g class="study-visual-edge" data-from="${escapeHtml(edge.from)}" data-to="${escapeHtml(edge.to)}">${title(`${from.lines.join("／")} → ${to.lines.join("／")}${edge.label ? `：${edge.label}` : ""}`)}<path d="${path}" /><polygon points="${arrow}" /></g>`;
    if (edge.label) {
      const lines = labelLines([edge.label], 7, 2);
      const at = edgeLabelPosition(route, lines, boxes, width, height);
      if (at) marks += multiline(at.x, at.y, lines, "study-visual-edge-label");
      else unplacedLabels.push(`${from.lines[0]} → ${to.lines[0]}：${edge.label}`);
    }
  });
  let nodeIndex = 0;
  placed.forEach((node) => {
    const lines = labelLines(node.lines, 19, 3);
    const indexValue = typeof node.tone === "number" ? node.tone : nodeIndex;
    marks += `<g class="study-visual-node ${tone(indexValue)}" data-node="${escapeHtml(node.id)}">${title(node.lines.join("／"))}<rect x="${coordinate(node.x)}" y="${coordinate(node.y)}" width="${nodeWidth}" height="${nodeHeight}" rx="10" />${multiline(node.x + nodeWidth / 2, node.y + nodeHeight / 2 + 6 - (lines.length - 1) * 11, lines, "study-visual-node-label")}</g>`;
    nodeIndex += 1;
  });
  return { width, height, marks, data, how: "先讀節點中的概念，再沿箭頭看資訊、步驟或責任如何連接；連線會繞開其他節點，完整關係也列在下表。",
    legend: unplacedLabels.length ? `<ul class="study-visual-relations">${unplacedLabels.map((label) => `<li>${escapeHtml(label)}</li>`).join("")}</ul>` : undefined,
    notice: missingRoutes ? "部分節點重疊而無法安全畫出連線，請展開下方完整連接關係。" : undefined };
}

function matrix(visual: Extract<StudyVisual, { kind: "matrix" }>): RenderedVisual {
  const suffix = visual.suffix ?? "";
  const data = table("矩陣的精確資料", ["列／欄", ...visual.columnLabels], visual.rowLabels.map((row, i) => [row, ...visual.columnLabels.map((_column, j) => {
    const value = visual.values[i]?.[j];
    return `${value === undefined ? "無資料" : exact(value)}${suffix}${visual.cellLabels?.[i]?.[j] ? `（${visual.cellLabels[i][j]}）` : ""}`;
  })]));
  if (!visual.rowLabels.length || !visual.columnLabels.length) return noData(data);
  const values = visual.values.flat().filter(finite);
  if (!values.length) return noData(data);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const signed = min < 0;
  const magnitude = Math.max(Math.abs(min), Math.abs(max), 1e-12);
  const cellWidth = 148;
  const cellHeight = 94;
  const left = 174;
  const top = 90;
  const width = Math.max(520, left + cellWidth * visual.columnLabels.length + 26);
  const height = top + cellHeight * visual.rowLabels.length + 32;
  let marks = "";
  visual.columnLabels.forEach((label, j) => {
    const lines = labelLines([label], 16, 2);
    marks += multiline(left + (j + 0.5) * cellWidth, top - 24 - (lines.length - 1) * 22, lines, "study-visual-matrix-label");
  });
  visual.rowLabels.forEach((label, i) => {
    const lines = labelLines([label], 18, 3);
    marks += multiline(left - 14, top + (i + 0.5) * cellHeight + 6 - (lines.length - 1) * 11, lines, "study-visual-matrix-label", "end");
    visual.columnLabels.forEach((column, j) => {
      const value = visual.values[i]?.[j];
      const valid = value !== undefined && finite(value);
      const strength = valid ? value === 0 ? 0 : signed ? 0.1 + 0.3 * Math.abs(value) / magnitude : max === min ? 0.25 : 0.1 + 0.3 * fraction(value, [min, max]) : 0;
      const cellLabel = visual.cellLabels?.[i]?.[j];
      const x = left + j * cellWidth;
      const y = top + i * cellHeight;
      marks += `<g class="study-visual-cell${valid && value < 0 ? " is-negative" : valid && value === 0 ? " is-zero" : ""}">${title(`${label} × ${column}：${valid ? exact(value) + suffix : "無資料"}${cellLabel ? `；${cellLabel}` : ""}`)}<rect x="${x + 2}" y="${y + 2}" width="${cellWidth - 4}" height="${cellHeight - 4}" rx="6" fill-opacity="${coordinate(strength)}" />${text(x + cellWidth / 2, y + (cellLabel ? 36 : 53), valid ? plotted(value) + suffix : "—", "study-visual-cell-value", "middle")}${cellLabel ? multiline(x + cellWidth / 2, y + 64, labelLines([cellLabel], 16, 1), "study-visual-cell-label") : ""}</g>`;
    });
  });
  return { width, height, marks, data, how: `先看列標籤與欄標籤，交叉格就是兩者的值。${signed ? `正值用綠色、負值用紅色，色深表示絕對值大小（最大 ${exact(Math.max(Math.abs(min), Math.abs(max)))}${suffix}）；0 使用中性底色` : `色塊由淡到深表示數值由小到大（${exact(min)} 至 ${exact(max)}${suffix}），0 使用中性底色`}，每格同時保留數字。` };
}

function waffle(visual: Extract<StudyVisual, { kind: "waffle" }>): RenderedVisual {
  const data = table("格子圖的精確資料", ["類別", "格數", "每格代表"], visual.groups.map((group) => [group.label, exact(group.count), visual.unit]));
  const valid = visual.groups.filter((group) => finite(group.count) && Number.isInteger(group.count) && group.count >= 0);
  const total = valid.reduce((sum, group) => sum + group.count, 0);
  if (total > 200) return noData(data, "每格的單位與各類別數量保留於下表。", `共 ${exact(total)} 格，超過單圖 200 格的可讀範圍，請使用下方精確資料。`);
  if (!total) return noData(data);
  const columns = Math.min(20, Math.max(2, Math.trunc(finite(visual.columns ?? 10) ? visual.columns ?? 10 : 10)));
  const cell = 24;
  const gap = 6;
  const rows = Math.ceil(total / columns);
  const width = Math.max(520, columns * (cell + gap) + 48);
  const height = rows * (cell + gap) + 68;
  const left = (width - columns * (cell + gap) + gap) / 2;
  let index = 0;
  let marks = "";
  valid.forEach((group, groupIndex) => {
    for (let groupCell = 0; groupCell < group.count; groupCell += 1) {
      marks += `<rect class="study-visual-waffle-cell ${tone(groupIndex)}" x="${coordinate(left + index % columns * (cell + gap))}" y="${24 + Math.floor(index / columns) * (cell + gap)}" width="${cell}" height="${cell}" rx="3">${title(`${group.label}：第 ${groupCell + 1} 格；每格代表 ${visual.unit}`)}</rect>`;
      index += 1;
    }
  });
  marks += text(width / 2, height - 10, `合計 ${exact(total)} 格`, "study-visual-axis-label", "middle");
  return { width, height, marks, data, legend: legend(valid.map((group) => ({ label: group.label, value: `${exact(group.count)} 格` }))), how: `每格代表：${visual.unit}。由左至右、由上至下數格；圖例同時列出各類別格數，面積比例表示數量比例。`,
    notice: valid.length === visual.groups.length ? undefined : "負數、非整數或非有限格數未繪製；原始項目保留於下表。" };
}

/** 只接受結構化圖解資料；所有作者文字一律跳脫，SVG 幾何由此模組產生。 */
export function renderStudyVisual(label: string, visual: StudyVisual): string {
  const rendered = visual.kind === "bars" ? bars(visual) : visual.kind === "plot" ? plot(visual)
    : visual.kind === "diagram" ? diagram(visual) : visual.kind === "matrix" ? matrix(visual) : waffle(visual);
  return `<figure class="study-visual" data-visual-kind="${escapeHtml(visual.kind)}">
    <figcaption class="study-visual-title">${escapeHtml(label)}</figcaption>
    <p class="study-visual-summary"><strong>看圖重點：</strong>${escapeHtml(visual.summary)}</p>
    <p class="study-visual-scroll-hint">圖表較寬時，可在圖內左右滑動；也可展開下方數值。</p>
    <div class="study-visual-scroll" tabindex="0" role="group" aria-label="${escapeHtml(label)}，圖內可左右捲動">
      <svg class="study-visual-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(label)}" viewBox="0 0 ${rendered.width} ${rendered.height}" style="min-width: ${rendered.width}px">
        ${title(label)}<desc>${escapeHtml(`${visual.summary} ${rendered.how}`)}</desc>${rendered.marks}
      </svg>
    </div>
    ${rendered.legend ?? ""}
    <p class="study-visual-how"><strong>讀圖方式：</strong>${escapeHtml(rendered.how)}</p>
    ${rendered.notice ? `<p class="study-visual-notice">${escapeHtml(rendered.notice)}</p>` : ""}
    <details class="study-visual-data"><summary>查看精確數值與文字</summary>${rendered.data}</details>
  </figure>`;
}
