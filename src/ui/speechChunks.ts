/**
 * 把一整節筆記切成適合 Web Speech API 朗讀的短段。
 *
 * 為什麼要切：學習筆記一節動輒數千字（最長超過兩萬字），整段塞進一個 SpeechSynthesisUtterance 時，
 * Chrome 會無聲卡住、也不觸發 end／error 事件；卡住後連之後較短的朗讀都會沒聲音，直到重新整理頁面。
 * 另外 Chrome 的線上語音在單段超過約 15 秒時會被截斷。逐段排隊朗讀可同時避開這兩個問題。
 *
 * 切法：先在句末（。！？；換行）切，單句仍過長時改在逗號類（，、：,）切，再不行才硬切；
 * 最後把相鄰的短片段貪婪合併回不超過上限的段落，避免一句一停、聽起來斷斷續續。
 */
export const SPEECH_CHUNK_MAX = 160;

const splitKeeping = (text: string, pattern: RegExp): string[] =>
  text.split(pattern).reduce<string[]>((parts, piece, index) => {
    // split 搭配捕獲群組時，奇數索引是分隔符本身：接回前一段，讓標點留在句尾。
    if (index % 2 === 1) parts[parts.length - 1] += piece;
    else parts.push(piece);
    return parts;
  }, []);

const hardSplit = (text: string, max: number): string[] => {
  const chars = [...text];
  const out: string[] = [];
  for (let i = 0; i < chars.length; i += max) out.push(chars.slice(i, i + max).join(""));
  return out;
};

const length = (text: string): number => [...text].length;

export const splitForSpeech = (text: string, max = SPEECH_CHUNK_MAX): string[] => {
  const pieces = splitKeeping(text, /([。！？；!?;\n]+)/)
    .flatMap((sentence) =>
      length(sentence) <= max ? [sentence] : splitKeeping(sentence, /([，、：,:]+)/),
    )
    .flatMap((clause) => (length(clause) <= max ? [clause] : hardSplit(clause, max)))
    .map((piece) => piece.trim())
    .filter((piece) => piece.replace(/[。！？；!?;，、：,:\s]/g, "").length > 0);

  const chunks: string[] = [];
  for (const piece of pieces) {
    const last = chunks[chunks.length - 1];
    if (last !== undefined && length(last) + length(piece) <= max) chunks[chunks.length - 1] = last + piece;
    else chunks.push(piece);
  }
  return chunks;
};
