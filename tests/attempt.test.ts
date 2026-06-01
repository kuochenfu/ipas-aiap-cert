import { describe, it, expect } from "vitest";
import { buildAttempt, shuffleWith } from "../src/state/attempt";
import type { Question } from "../src/data/types";

const makeBank = (n: number): Question[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `q${i + 1}`, subjectId: "s", prompt: `p${i + 1}`,
    choices: [
      { id: "A", text: "a" }, { id: "B", text: "b" },
      { id: "C", text: "c" }, { id: "D", text: "d" },
    ],
    answer: "A", explanation: "", topic: "T", difficulty: "中", source: "past-exam",
  }) as Question);

const identityShuffle = <T>(arr: T[]): T[] => [...arr];

describe("buildAttempt", () => {
  it("抽指定題數（不足則全取）", () => {
    const attempt = buildAttempt(makeBank(100), { count: 50, shuffle: identityShuffle });
    expect(attempt.questions).toHaveLength(50);
  });
  it("題數超過題庫時取全部", () => {
    const attempt = buildAttempt(makeBank(30), { count: 50, shuffle: identityShuffle });
    expect(attempt.questions).toHaveLength(30);
  });
  it("用注入的洗牌函式決定順序", () => {
    const reverse = <T>(arr: T[]): T[] => [...arr].reverse();
    const attempt = buildAttempt(makeBank(3), { count: 3, shuffle: reverse });
    expect(attempt.questions.map((q) => q.id)).toEqual(["q3", "q2", "q1"]);
  });
});

describe("shuffleWith", () => {
  it("以注入的 rng 產生決定性順序", () => {
    const seq = [0.9, 0.1, 0.5];
    let i = 0;
    const rng = () => seq[i++ % seq.length];
    const out = shuffleWith([1, 2, 3, 4], rng);
    expect(out).toHaveLength(4);
    expect([...out].sort()).toEqual([1, 2, 3, 4]);
  });
});
