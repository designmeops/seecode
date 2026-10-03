import { describe, expect, it } from "vitest";
import type { RegistryItem } from "../registry/types";
import { applyQuickFilter, matchesQuery, sortItems } from "./search";

function makeItem(overrides: Partial<RegistryItem>): RegistryItem {
  return {
    id: "SC-1",
    slug: "item",
    name: "Item",
    description: "A component.",
    category: "buttons",
    tags: [],
    author: "seecode",
    createdAt: "2026-01-01",
    version: "1.0.0",
    files: [{ name: "item.tsx", language: "tsx", code: "export function Item() {}" }],
    usage: "",
    preview: { component: () => null },
    ...overrides,
  };
}

const shimmer = makeItem({
  slug: "shimmer-button",
  name: "Shimmer Button",
  description: "A dark pill button with a sweep of light.",
  tags: ["animated", "cta"],
  createdAt: "2026-03-02",
  featured: true,
});
const otp = makeItem({
  id: "SC-2",
  slug: "otp-input",
  name: "OTP Input",
  description: "Six boxes for a verification code.",
  category: "inputs",
  tags: ["form"],
  createdAt: "2026-09-20",
});
const tooltip = makeItem({
  id: "SC-3",
  slug: "tooltip",
  name: "Tooltip",
  description: "Hints on hover.",
  category: "overlays",
  createdAt: "2026-05-27",
  updatedAt: "2026-09-30",
});

describe("matchesQuery", () => {
  it("matches everything for an empty query", () => {
    expect(matchesQuery(shimmer, "   ")).toBe(true);
  });

  it("is case-insensitive and searches name, description, tags, category and id", () => {
    expect(matchesQuery(shimmer, "SHIMMER")).toBe(true);
    expect(matchesQuery(shimmer, "sweep")).toBe(true);
    expect(matchesQuery(shimmer, "cta")).toBe(true);
    expect(matchesQuery(otp, "inputs & forms")).toBe(true);
    expect(matchesQuery(otp, "sc-2")).toBe(true);
  });

  it("requires every term to match", () => {
    expect(matchesQuery(shimmer, "dark button")).toBe(true);
    expect(matchesQuery(shimmer, "dark input")).toBe(false);
  });
});

describe("sortItems", () => {
  const items = [tooltip, otp, shimmer];

  it("sorts by name", () => {
    expect(sortItems(items, "name").map((i) => i.slug)).toEqual([
      "otp-input",
      "shimmer-button",
      "tooltip",
    ]);
  });

  it("sorts newest first", () => {
    expect(sortItems(items, "newest").map((i) => i.slug)).toEqual([
      "otp-input",
      "tooltip",
      "shimmer-button",
    ]);
  });

  it("puts featured first, then the most recently changed", () => {
    expect(sortItems(items, "featured").map((i) => i.slug)).toEqual([
      "shimmer-button",
      "tooltip",
      "otp-input",
    ]);
  });

  it("does not mutate its input", () => {
    sortItems(items, "name");
    expect(items.map((i) => i.slug)).toEqual(["tooltip", "otp-input", "shimmer-button"]);
  });
});

describe("applyQuickFilter", () => {
  const now = Date.parse("2026-10-03T12:00:00Z");

  it("keeps featured items", () => {
    expect(applyQuickFilter([shimmer, otp], "featured", now)).toEqual([shimmer]);
  });

  it("keeps items created in the last 30 days", () => {
    expect(applyQuickFilter([shimmer, otp, tooltip], "new", now)).toEqual([otp]);
  });
});
