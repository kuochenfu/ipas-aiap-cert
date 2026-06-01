// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { loadMisses, addMiss, removeMiss, isMissed } from "../src/state/storage";

beforeEach(() => localStorage.clear());

describe("錯題本", () => {
  it("新增與查詢", () => {
    addMiss("junior-ai-basics-115-1-q01");
    expect(isMissed("junior-ai-basics-115-1-q01")).toBe(true);
    expect(loadMisses()).toContain("junior-ai-basics-115-1-q01");
  });
  it("不重複加入", () => {
    addMiss("q1");
    addMiss("q1");
    expect(loadMisses().filter((id) => id === "q1")).toHaveLength(1);
  });
  it("移除", () => {
    addMiss("q1");
    removeMiss("q1");
    expect(isMissed("q1")).toBe(false);
  });
  it("壞資料回傳空陣列", () => {
    localStorage.setItem("ipas-aiap-misses", "{not json");
    expect(loadMisses()).toEqual([]);
  });
});
