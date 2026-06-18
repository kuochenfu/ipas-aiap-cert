export const isSectionHeading = (line: string): boolean =>
  /^[3-6]\.\d+(\s|$)/.test(line) && !line.includes("...");

const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  /^## Page \d+/.test(line) ||
  /^\d+$/.test(line) ||
  /^\d+-\d+$/.test(line) ||
  line === "_No extractable text on this page._" ||
  /^[3-6]\.\d+$/.test(line) ||
  /^\s*第[一二三四五六七八九十]+章/.test(line);

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 從 markdown 行陣列中，切出指定節（section number）的內容行，濾除明顯 noise。
 *  當同一節號出現多次（如目錄 cluster + 實際內容）時，選取內容最長的候選。 */
export const sliceSection = (lines: string[], sectionNumber: string): string[] => {
  const re = new RegExp(`^${escapeRegExp(sectionNumber)}(\\s|$)`);
  const starts: number[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (re.test(lines[i]) && !lines[i].includes("...")) starts.push(i);
  }
  if (starts.length === 0) return [];
  let best: string[] = [];
  for (const start of starts) {
    const out: string[] = [];
    for (let i = start + 1; i < lines.length; i += 1) {
      if (isSectionHeading(lines[i])) break;
      if (lines[i].startsWith("附件") || lines[i].includes("本學習指引參考書目")) break;
      if (isNoise(lines[i])) continue;
      out.push(lines[i]);
    }
    if (out.join("").length > best.join("").length) best = out;
  }
  return best;
};
