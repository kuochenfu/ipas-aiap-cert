import { describe, it, expect } from "vitest";
import { certs, subjects, getLevels, getSubjects, getSubject } from "../src/domain/catalog";

describe("catalog", () => {
  it("兩張證照", () => {
    expect(certs.map((c) => c.id)).toEqual(["aiap", "aiot"]);
  });

  it("AI 應用規劃師初級2科、中級3科；AIoT 初級2科", () => {
    expect(getSubjects("aiap", "junior").map((s) => s.id))
      .toEqual(["junior-ai-basics", "junior-genai"]);
    expect(getSubjects("aiap", "senior")).toHaveLength(3);
    expect(getSubjects("aiot", "junior").map((s) => s.id))
      .toEqual(["aiot-junior-basics", "aiot-junior-iot"]);
    expect(subjects).toHaveLength(7);
  });

  it("AIoT 目前只有初級，AI 應用規劃師有初中級", () => {
    expect(getLevels("aiap")).toEqual(["junior", "senior"]);
    expect(getLevels("aiot")).toEqual(["junior"]);
    expect(getSubjects("aiot", "senior")).toEqual([]);
  });

  it("初級75分鐘、中級90分鐘", () => {
    expect(getSubject("junior-ai-basics")!.durationMinutes).toBe(75);
    expect(getSubject("senior-ml")!.durationMinutes).toBe(90);
    expect(getSubject("aiot-junior-basics")!.durationMinutes).toBe(75);
  });

  // AIoT 的簡章未載明每科題數與配分，因此不能沿用 50 題×2 分的模擬考規則。
  it("AIoT 兩科不開模擬考試，AI 應用規劃師五科都開", () => {
    expect(getSubjects("aiot", "junior").some((s) => s.mockExam)).toBe(false);
    expect(getSubjects("aiap", "junior").every((s) => s.mockExam)).toBe(true);
    expect(getSubjects("aiap", "senior").every((s) => s.mockExam)).toBe(true);
  });

  it("查無回傳 undefined", () => {
    expect(getSubject("nope")).toBeUndefined();
  });
});
