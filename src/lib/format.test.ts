import { describe, expect, it } from "vitest";
import { countLines, formatDate, formatRelative, isRecent } from "./format";

describe("formatDate", () => {
  it("formats calendar dates without timezone drift", () => {
    expect(formatDate("2026-03-02")).toBe("Mar 2, 2026");
    expect(formatDate("2026-12-31")).toBe("Dec 31, 2026");
  });
});

describe("formatRelative", () => {
  const now = Date.parse("2026-10-03T12:00:00Z");

  it.each([
    [10 * 1000, "just now"],
    [5 * 60 * 1000, "5m ago"],
    [3 * 60 * 60 * 1000, "3h ago"],
    [2 * 24 * 60 * 60 * 1000, "2d ago"],
  ])("%i ms ago → %s", (delta, expected) => {
    expect(formatRelative(now - delta, now)).toBe(expected);
  });

  it("falls back to a date after a week", () => {
    expect(formatRelative(now - 10 * 24 * 60 * 60 * 1000, now)).toBe("Sep 23, 2026");
  });
});

describe("isRecent", () => {
  const now = Date.parse("2026-10-03T12:00:00Z");

  it("treats the last 30 days as recent", () => {
    expect(isRecent("2026-10-03", now)).toBe(true);
    expect(isRecent("2026-09-03", now)).toBe(true);
    expect(isRecent("2026-09-02", now)).toBe(false);
    expect(isRecent(undefined, now)).toBe(false);
  });

  it("ignores future dates", () => {
    expect(isRecent("2026-10-10", now)).toBe(false);
  });
});

describe("countLines", () => {
  it("ignores a trailing newline", () => {
    expect(countLines("a\nb\n")).toBe(2);
    expect(countLines("a")).toBe(1);
  });
});
