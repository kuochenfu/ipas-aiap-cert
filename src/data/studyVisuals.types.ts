/** 可搜尋的教學圖解資料；不接受任意 SVG／HTML。數值與文字分開，統一安全渲染。 */
type VisualBase = { summary: string };
export type VisualPoint = { x: number; y: number; label?: string };
export type VisualSeries = { name: string; points: VisualPoint[]; connect?: boolean };
export type StudyVisual = VisualBase & (
  | { kind: "bars"; valueLabel: string; suffix?: string; max?: number; items: { label: string; value: number }[] }
  | { kind: "plot"; mode: "line" | "scatter"; equalScale?: boolean; guides?: { from: VisualPoint; to: VisualPoint; label?: string }[]; xLabel: string; yLabel: string; xDomain?: [number,number]; yDomain?: [number,number]; series: VisualSeries[] }
  | { kind: "diagram"; nodes: { id: string; col: number; row: number; lines: string[]; tone?: 0|1|2|3 }[]; edges: { from: string; to: string; label?: string }[] }
  | { kind: "matrix"; rowLabels: string[]; columnLabels: string[]; values: number[][]; cellLabels?: string[][]; suffix?: string }
  | { kind: "waffle"; unit: string; columns?: number; groups: { label: string; count: number }[] }
);

/** 圖解旁必須有白話帶讀與一步步例題，不能只放一張裝飾圖。 */
export type StudyVisualLesson = {
  text: string;
  visual: StudyVisual;
  children: { text: string }[];
};
