import { describe, it, expect } from "vitest";
import {
  MIN_SAMPLE, REVIEW_INTERVAL_DAYS, buildMasteryProfile, isDueForReview, isRecommended,
  recommendationScore, recommendedOrder, reviewIntervalDays,
} from "../src/domain/adaptive";
import type { AnswerRecord, AnswerRecords } from "../src/domain/drill";
import type { ChoiceId, Question, QuestionMeta } from "../src/data/types";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;

const q = (id: string, topic = "L11101 甲", level?: QuestionMeta["cognitiveLevel"]): Question => ({
  id, subjectId: "s", prompt: "p",
  choices: [
    { id: "A", text: "a" }, { id: "B", text: "b" },
    { id: "C", text: "c" }, { id: "D", text: "d" },
  ],
  answer: "A", explanation: "", topic, difficulty: "中", source: "generated",
  meta: level
    ? { cognitiveLevel: level, archetype: "Comparison", concepts: [], distractorTypes: {} }
    : undefined,
});

const record = (over: Partial<AnswerRecord> = {}): AnswerRecord => ({
  choice: "A", firstAt: NOW - 10 * DAY, lastAt: NOW - 10 * DAY, attempts: 1, wrongCount: 0, ...over,
});

describe("reviewIntervalDays", () => {
  it("答對次數越多，間隔越長", () => {
    expect(reviewIntervalDays(1)).toBe(REVIEW_INTERVAL_DAYS[0]);
    expect(reviewIntervalDays(3)).toBe(REVIEW_INTERVAL_DAYS[2]);
  });
  it("超出表格長度時停在最長間隔，不會回頭變短", () => {
    expect(reviewIntervalDays(99)).toBe(REVIEW_INTERVAL_DAYS[REVIEW_INTERVAL_DAYS.length - 1]);
  });
  it("答對 0 次也給一個間隔，不會取到負索引", () => {
    expect(reviewIntervalDays(0)).toBe(REVIEW_INTERVAL_DAYS[0]);
  });
});

describe("isDueForReview", () => {
  const question = q("q1");

  it("沒有歷程時不算到期——不知道何時做的，就不能宣稱它到期", () => {
    expect(isDueForReview(question, undefined, NOW)).toBe(false);
  });
  it("最後一次答錯的題目不走間隔重測（本來就會被推薦收進去）", () => {
    expect(isDueForReview(question, record({ choice: "B", wrongCount: 1 }), NOW)).toBe(false);
  });
  it("答對且已超過間隔才到期", () => {
    expect(isDueForReview(question, record({ lastAt: NOW - 2 * DAY }), NOW)).toBe(true);
    expect(isDueForReview(question, record({ lastAt: NOW - 0.5 * DAY }), NOW)).toBe(false);
  });
  it("答對次數越多，同樣的天數就還不到期", () => {
    const veteran = record({ lastAt: NOW - 5 * DAY, attempts: 4, wrongCount: 0 }); // 間隔 21 天
    expect(isDueForReview(question, veteran, NOW)).toBe(false);
  });
});

describe("buildMasteryProfile", () => {
  const bank = [
    q("a1", "L11101 甲"), q("a2", "L11101 甲"), q("a3", "L11101 甲"),
    q("b1", "L11102 乙"), q("b2", "L11102 乙"),
  ];

  it("樣本未達門檻的節點不列入——小樣本的 0% 只是雜訊", () => {
    const profile = buildMasteryProfile(bank, { a1: "A", a2: "B", a3: "B", b1: "B", b2: "B" });
    expect(profile.byTopic.get("L11101 甲")).toBeCloseTo(1 / 3);
    expect(profile.byTopic.has("L11102 乙")).toBe(false);
    expect(MIN_SAMPLE).toBe(3);
  });
  it("未作答的題目不影響答對率", () => {
    const profile = buildMasteryProfile(bank, { a1: "A", a2: "A", a3: "A" });
    expect(profile.byTopic.get("L11101 甲")).toBe(1);
  });
  it("認知層級同樣有樣本門檻", () => {
    const levelled = [q("x1", "T", "L4"), q("x2", "T", "L4"), q("x3", "T", "L4")];
    const profile = buildMasteryProfile(levelled, { x1: "B", x2: "B", x3: "B" });
    expect(profile.byLevel.get("L4")).toBe(0);
  });
});

describe("isRecommended", () => {
  const question = q("q1");

  it("未作答一律收進來", () => {
    expect(isRecommended(question, {}, {}, NOW)).toBe(true);
  });
  it("答錯一律收進來", () => {
    expect(isRecommended(question, { q1: "B" }, {}, NOW)).toBe(true);
  });
  it("答對且未到期就不收", () => {
    const records: AnswerRecords = { q1: record({ lastAt: NOW }) };
    expect(isRecommended(question, { q1: "A" }, records, NOW)).toBe(false);
  });
  it("答對但已到期會再收進來", () => {
    const records: AnswerRecords = { q1: record({ lastAt: NOW - 30 * DAY }) };
    expect(isRecommended(question, { q1: "A" }, records, NOW)).toBe(true);
  });
  it("沒有歷程時，答對的題目不會被重複推薦（舊資料安全退化）", () => {
    expect(isRecommended(question, { q1: "A" }, undefined, NOW)).toBe(false);
  });
});

describe("recommendationScore", () => {
  const profile = { byTopic: new Map<string, number>(), byLevel: new Map<string, number>() };

  it("狀態壓過弱點：答錯永遠排在未作答之前", () => {
    const wrong = recommendationScore(q("w"), { w: "B" }, {}, profile, NOW);
    const fresh = recommendationScore(q("f"), {}, {}, profile, NOW);
    // 就算未作答的題目屬於最弱的節點，也不該擠掉錯題。
    const weakProfile = { byTopic: new Map([["L11101 甲", 0]]), byLevel: new Map<string, number>() };
    const weakFresh = recommendationScore(q("f"), {}, {}, weakProfile, NOW);
    expect(wrong).toBeGreaterThan(fresh);
    expect(wrong).toBeGreaterThan(weakFresh);
  });

  it("同樣是錯題，錯越多次越優先", () => {
    const once: AnswerRecords = { w: record({ choice: "B", attempts: 1, wrongCount: 1 }) };
    const thrice: AnswerRecords = { w: record({ choice: "B", attempts: 3, wrongCount: 3 }) };
    expect(recommendationScore(q("w"), { w: "B" }, thrice, profile, NOW))
      .toBeGreaterThan(recommendationScore(q("w"), { w: "B" }, once, profile, NOW));
  });

  it("同樣狀態下，較弱的節點排前面", () => {
    const weak = { byTopic: new Map([["L11101 甲", 0.2]]), byLevel: new Map<string, number>() };
    const strong = { byTopic: new Map([["L11101 甲", 0.9]]), byLevel: new Map<string, number>() };
    expect(recommendationScore(q("f"), {}, {}, weak, NOW))
      .toBeGreaterThan(recommendationScore(q("f"), {}, {}, strong, NOW));
  });
});

describe("recommendedOrder", () => {
  const bank = [
    q("q1", "L11101 甲"), // 答對且未到期 → 不入選
    q("q2", "L11101 甲"), // 未作答
    q("q3", "L11101 甲"), // 答錯
    q("q4", "L11101 甲"), // 答對但已到期
  ];
  const answers: Record<string, ChoiceId> = { q1: "A", q3: "B", q4: "A" };
  const records: AnswerRecords = {
    q1: record({ lastAt: NOW }),
    q3: record({ choice: "B", wrongCount: 1, lastAt: NOW - DAY }),
    q4: record({ lastAt: NOW - 40 * DAY }),
  };

  it("排除已掌握的題目，並依 錯題 → 未作答 → 到期重測 排序", () => {
    expect(recommendedOrder(bank, answers, records, NOW)).toEqual([2, 1, 3]);
  });

  it("同分時維持題庫原序，結果穩定可重現", () => {
    const fresh = [q("a"), q("b"), q("c")];
    expect(recommendedOrder(fresh, {}, {}, NOW)).toEqual([0, 1, 2]);
    expect(recommendedOrder(fresh, {}, {}, NOW)).toEqual([0, 1, 2]);
  });

  it("全部答對且都未到期時回空陣列（呼叫端據此顯示空狀態）", () => {
    const done = [q("d1"), q("d2")];
    const all: AnswerRecords = { d1: record({ lastAt: NOW }), d2: record({ lastAt: NOW }) };
    expect(recommendedOrder(done, { d1: "A", d2: "A" }, all, NOW)).toEqual([]);
  });
});
