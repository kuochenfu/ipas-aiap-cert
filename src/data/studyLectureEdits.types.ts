export type LectureRewrite = { at: number[]; starts: string; text: string };
export type LectureExample = { after: number[]; title: string; paragraphs: string[] };
export type LectureEdit = { topic: string; chapter: string; rewrites: LectureRewrite[]; examples: LectureExample[] };

export const r = (at: number | number[], starts: string, text: string): LectureRewrite => ({ at: typeof at === "number" ? [at] : at, starts, text });
export const e = (after: number | number[], title: string, ...paragraphs: string[]): LectureExample => ({ after: typeof after === "number" ? [after] : after, title, paragraphs });
export const l = (topic: string, chapter: string, rewrites: LectureRewrite[], examples: LectureExample[]): LectureEdit => ({ topic, chapter, rewrites, examples });
