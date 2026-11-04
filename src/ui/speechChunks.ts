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

/**
 * 朗讀進度：停在哪一節（key）的第幾段（index）、段內第幾個字（charIndex，來自 boundary 事件，
 * 以 UTF-16 code unit 計，與 String.prototype.slice 一致）。按停止只是中斷，進度保留；
 * 再按同一節的喇叭或念到一半改語速時，從中斷那個子句的開頭接著念。
 *
 * 只記段落不夠：一段最多 160 字、要念 30–40 秒，第一段還沒念完就停止時段落索引仍是 0，接續等於從頭。
 * 瀏覽器不送 boundary 事件時 charIndex 停在 0，退回段落開頭，最多重聽一段。
 * 不用 speechSynthesis.pause()／resume()：它們在 Chrome 與 Android 上常會「按了繼續卻無聲」。
 */
export type SpeechProgress<K> = { key: K; chunks: string[]; index: number; charIndex: number };

export type ResumePoint = { index: number; offset: number };

// 子句起點：句末或逗號類標點之後。接續時退回這裡，聽起來是從一句話的開頭念起，而不是從半個詞。
// 半形逗號與冒號不算：筆記裡它們多半在英文括號內（「（Artificial Intelligence, AI）」），從那裡接會從括號中間念起。
const CLAUSE_END = /[。！？；!?;\n，、：]/;

/** 段內第 charIndex 個字所在子句的起點。 */
export const clauseStart = (chunk: string, charIndex: number): number => {
  for (let i = Math.min(charIndex, chunk.length) - 1; i >= 0; i -= 1) {
    if (CLAUSE_END.test(chunk[i])) return i + 1;
  }
  return 0;
};

/** 該從哪裡開始念：同一節、內容沒變、且尚未念完才接續，否則從頭。 */
export const resumePoint = <K>(progress: SpeechProgress<K> | null, key: K, chunks: string[]): ResumePoint => {
  const start = { index: 0, offset: 0 };
  if (!progress || progress.key !== key) return start;
  if (progress.index < 0 || progress.index >= chunks.length) return start;
  const sameText = progress.chunks.length === chunks.length
    && progress.chunks.every((chunk, i) => chunk === chunks[i]);
  if (!sameText) return start;
  const offset = clauseStart(chunks[progress.index], progress.charIndex);
  // 子句之後只剩標點或空白時，直接從下一段念，免得送出一段念不出聲的 utterance。
  if (chunks[progress.index].slice(offset).replace(/[。！？；!?;，、：,:\s]/g, "") === "") {
    return progress.index + 1 < chunks.length ? { index: progress.index + 1, offset: 0 } : start;
  }
  return { index: progress.index, offset };
};

/** 是否有可接續的進度（用來決定按鈕要不要標成「從中斷處繼續朗讀」）。 */
export const hasResumableProgress = <K>(progress: SpeechProgress<K> | null): boolean => {
  if (!progress) return false;
  const point = resumePoint(progress, progress.key, progress.chunks);
  return point.index > 0 || point.offset > 0;
};
