export const isSectionHeading = (line: string): boolean =>
  /^[3-6]\.\d+(\s|$)/.test(line) && !line.includes("...");

const isNoise = (line: string): boolean =>
  line === "" ||
  line.startsWith("#") ||
  /^## Page \d+/.test(line) ||
  /^\d+$/.test(line) ||
  /^\d+-\d+$/.test(line) ||
  line === "_No extractable text on this page._";

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 從 markdown 行陣列中，切出指定節（section number）的內容行，濾除明顯 noise。 */
export const sliceSection = (lines: string[], sectionNumber: string): string[] => {
  const re = new RegExp(`^${escapeRegExp(sectionNumber)}(\\s|$)`);
  const start = lines.findIndex((line) => re.test(line) && !line.includes("..."));
  if (start < 0) return [];
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (isSectionHeading(lines[i])) break;
    if (lines[i].startsWith("附件") || lines[i].includes("本學習指引參考書目")) break;
    if (isNoise(lines[i])) continue;
    out.push(lines[i]);
  }
  return out;
};
