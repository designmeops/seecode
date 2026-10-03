import { describe, expect, it } from "vitest";
import type { RegistryItem } from "../registry/types";
import { applyQuickFilter, matchesQuery, sortItems } from "./search";

function makeItem(overrides: Partial<RegistryItem>): RegistryItem {
  return {
    id: "SC-1",
    slug: "item",
    name: "Item",
    description: "A component.",
    category: "cards",
    tags: [],
    author: "designme",
    createdAt: "2026-01-01",
    version: "1.0.0",
    formats: { nextjs: { name: "item.tsx", language: "tsx", code: "export function Item() {}" } },
    usage: "",
    preview: { component: () => null },
    ...overrides,
  };
}

const deal = makeItem({
  slug: "deal-card",
  name: "Deal Card",
  description: "A deal with its status, value and services.",
  tags: ["crm", "deals"],
  createdAt: "2026-03-02",
  featured: true,
});
const people = makeItem({
  id: "SC-2",
  slug: "people-list",
  name: "People List",
  description: "Contacts with their role and email.",
  category: "data-display",
  tags: ["contacts"],
  createdAt: "2026-09-20",
});
const breadcrumb = makeItem({
  id: "SC-3",
  slug: "breadcrumb-bar",
  name: "Breadcrumb Bar",
  description: "Where you are, with actions.",
  category: "navigation",
  createdAt: "2026-05-27",
  updatedAt: "2026-09-30",
});

describe("matchesQuery", () => {
  it("matches everything for an empty query", () => {
    expect(matchesQuery(deal, "   ")).toBe(true);
  });

  it("is case-insensitive and searches name, description, tags, category and id", () => {
    expect(matchesQuery(deal, "DEAL")).toBe(true);
    expect(matchesQuery(deal, "services")).toBe(true);
    expect(matchesQuery(deal, "crm")).toBe(true);
    expect(matchesQuery(people, "data display")).toBe(true);
    expect(matchesQuery(people, "sc-2")).toBe(true);
  });

  it("requires every term to match", () => {
    expect(matchesQuery(deal, "deal status")).toBe(true);
    expect(matchesQuery(deal, "deal email")).toBe(false);
  });
});

describe("sortItems", () => {
  const items = [breadcrumb, people, deal];

  it("sorts by name", () => {
    expect(sortItems(items, "name").map((i) => i.slug)).toEqual([
      "breadcrumb-bar",
      "deal-card",
      "people-list",
    ]);
  });

  it("sorts newest first", () => {
    expect(sortItems(items, "newest").map((i) => i.slug)).toEqual([
      "people-list",
      "breadcrumb-bar",
      "deal-card",
    ]);
  });

  it("puts featured first, then the most recently changed", () => {
    expect(sortItems(items, "featured").map((i) => i.slug)).toEqual([
      "deal-card",
      "breadcrumb-bar",
      "people-list",
    ]);
  });

  it("does not mutate its input", () => {
    sortItems(items, "name");
    expect(items.map((i) => i.slug)).toEqual(["breadcrumb-bar", "people-list", "deal-card"]);
  });
});

describe("applyQuickFilter", () => {
  const now = Date.parse("2026-10-03T12:00:00Z");

  it("keeps featured items", () => {
    expect(applyQuickFilter([deal, people], "featured", now)).toEqual([deal]);
  });

  it("keeps items created in the last 30 days", () => {
    expect(applyQuickFilter([deal, people, breadcrumb], "new", now)).toEqual([people]);
  });
});
