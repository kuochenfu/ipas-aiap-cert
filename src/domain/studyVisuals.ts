import type { StudyNoteItem, StudyNoteSection } from "../data/types";
import type { StudyVisual } from "../data/studyVisuals.types";

/** 搜尋只收使用者可讀的內容，不把資料格式的欄位名稱帶進索引。 */
export function studyVisualText(visual: StudyVisual): string {
  const parts = [visual.summary];
  switch (visual.kind) {
    case "bars": parts.push(visual.valueLabel, visual.suffix ?? "", ...visual.items.map(item => `${item.label} ${item.value}`)); break;
    case "plot": parts.push(visual.xLabel, visual.yLabel, ...visual.series.flatMap(series => [series.name, ...series.points.map(point => `${point.label ?? ""} ${point.x} ${point.y}`)]), ...(visual.guides ?? []).map(guide => guide.label ?? "")); break;
    case "diagram": parts.push(...visual.nodes.flatMap(node => node.lines), ...visual.edges.map(edge => edge.label ?? "")); break;
    case "matrix": parts.push(...visual.rowLabels, ...visual.columnLabels, ...visual.values.flat().map(String), ...(visual.cellLabels?.flat() ?? [])); break;
    case "waffle": parts.push(visual.unit, ...visual.groups.map(group => `${group.label} ${group.count}`)); break;
  }
  return parts.join("\n");
}

function countItems(items: StudyNoteItem[]): number {
  return items.reduce((total, item) => total + (item.visual ? 1 : 0) + countItems(item.children ?? []), 0);
}

export const countStudyVisuals = (sections: StudyNoteSection[] | undefined): number =>
  (sections ?? []).reduce((total, section) => total + countItems(section.items), 0);
