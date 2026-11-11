import type { StudyNoteItem } from "../data/types";
import { escapeHtml } from "./escape";

type RenderBody = (item: StudyNoteItem) => string;

/** 僅處理清楚的清單前綴；小數、百分比、負數與公式中的數值保留。 */
export const stripLectureMarker = (text: string): string => text.replace(
  /^(?:[（(](?:\d+|[一二三四五六七八九十]+)[)）]\s*|(?:\d+|[A-Za-z])[.．、)]\s+|[一二三四五六七八九十]+、\s*)/u,
  "",
);

const structured = (item: StudyNoteItem): boolean => !!(item.table || item.formula || item.flow || item.visual);
const prose = (value: string): string => {
  const text = stripLectureMarker(value);
  const colon = text.indexOf("：");
  const body = colon > 0 && colon <= 42 && !/[。！？]/u.test(text.slice(0, colon))
    ? `<strong>${escapeHtml(text.slice(0, colon + 1))}</strong>${escapeHtml(text.slice(colon + 1))}`
    : escapeHtml(text);
  return `<p class="lecture-paragraph note-text">${body}</p>`;
};
const headingParts = (value: string): { title: string; description?: string } | undefined => {
  const text = stripLectureMarker(value).trim();
  const colon = text.indexOf("：");
  if (colon > 0 && colon <= 42 && !/[。！？]/u.test(text.slice(0, colon))) {
    return { title: text.slice(0, colon), description: text.slice(colon + 1).trim() || undefined };
  }
  if (text.length <= 64 && !/[。！？]/u.test(text)) return { title: text };
};

const renderExample = (item: StudyNoteItem): string => `
  <aside class="lecture-example" aria-label="自編實務例子：${escapeHtml(item.text)}">
    <span class="lecture-example-label note-text">自編實務例子</span>
    <p class="lecture-example-title note-text">${escapeHtml(item.text)}</p>
    ${(item.children ?? []).map(child => prose(child.text)).join("")}
  </aside>
`;

const sequentialSteps = (items: StudyNoteItem[]): boolean => items.length > 1 && items.every((item, index) => {
  if (item.children?.length || structured(item) || item.example) return false;
  const marker = /^(?:[（(](\d+)[)）]\s*|(\d+)[.．、)]\s+)/u.exec(item.text);
  return !!marker && Number(marker[1] ?? marker[2]) === index + 1;
});

/** 講義使用段落與概念小標；補充卡仍由原本的條列 renderer 處理。 */
export function renderLectureItems(items: StudyNoteItem[], renderBody: RenderBody, depth = 0): string {
  if (sequentialSteps(items)) {
    return `<ol class="lecture-steps">${items.map(item => `<li class="note-text">${prose(item.text).replace(/^<p[^>]*>|<\/p>$/gu, "")}</li>`).join("")}</ol>`;
  }
  // 既有比較表若置於開頭，先讀第一段定義，再看表格，避免缺少閱讀脈絡。
  const firstProse = depth === 0 ? items.findIndex(item => !structured(item) && !item.example) : 0;
  const ordered = firstProse > 0 && items.slice(0, firstProse).every(structured)
    ? [items[firstProse], ...items.slice(0, firstProse), ...items.slice(firstProse + 1)] : items;
  return `<div class="lecture-prose">${ordered.map(item => {
    if (item.example) return renderExample(item);
    if (structured(item)) return `<div class="lecture-block">${renderBody(item)}${item.children?.length ? renderLectureItems(item.children, renderBody, depth + 1) : ""}</div>`;
    const children = item.children?.length ? renderLectureItems(item.children, renderBody, depth + 1) : "";
    const heading = children ? headingParts(item.text) : undefined;
    if (!heading) return `${prose(item.text)}${children}`;
    const tag = depth === 0 ? "h4" : depth === 1 ? "h5" : "p";
    return `<div class="lecture-topic">
      <${tag} class="lecture-topic-title note-text">${escapeHtml(heading.title)}</${tag}>
      ${heading.description ? prose(heading.description) : ""}${children}
    </div>`;
  }).join("")}</div>`;
}
