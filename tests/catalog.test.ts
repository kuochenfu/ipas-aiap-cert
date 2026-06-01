import { describe, it, expect } from "vitest";
import { subjects, getSubjectsByLevel, getSubject } from "../src/domain/catalog";

describe("catalog", () => {
  it("初級2科、中級3科", () => {
    expect(getSubjectsByLevel("junior")).toHaveLength(2);
    expect(getSubjectsByLevel("senior")).toHaveLength(3);
    expect(subjects).toHaveLength(5);
  });
  it("初級75分鐘、中級90分鐘", () => {
    expect(getSubject("junior-ai-basics")!.durationMinutes).toBe(75);
    expect(getSubject("senior-ml")!.durationMinutes).toBe(90);
  });
  it("查無回傳 undefined", () => {
    expect(getSubject("nope")).toBeUndefined();
  });
});
