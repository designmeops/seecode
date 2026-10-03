import { describe, expect, it } from "vitest";
import { parseHash, type Route, toHref } from "./router";

describe("parseHash", () => {
  it.each<[string, Route]>([
    ["", { name: "explore" }],
    ["#", { name: "explore" }],
    ["#/", { name: "explore" }],
    ["#/category/cards", { name: "category", category: "cards" }],
    ["#/tag/animated", { name: "tag", tag: "animated" }],
    ["#/tag/Animated", { name: "tag", tag: "animated" }],
    ["#/favorites", { name: "favorites" }],
    ["#/recent", { name: "recent" }],
    ["#/component/deal-card", { name: "component", slug: "deal-card" }],
    ["#/category/not-a-category", { name: "not-found" }],
    ["#/component", { name: "not-found" }],
    ["#/favorites/extra", { name: "not-found" }],
    ["#/component/a/b", { name: "not-found" }],
    ["#/nope", { name: "not-found" }],
  ])("%s", (hash, route) => {
    expect(parseHash(hash)).toEqual(route);
  });

  it("survives malformed escapes", () => {
    expect(parseHash("#/tag/%E0%A4%A")).toEqual({ name: "tag", tag: "%e0%a4%a" });
  });
});

describe("toHref", () => {
  it.each<Route>([
    { name: "explore" },
    { name: "category", category: "data-display" },
    { name: "tag", tag: "dark mode" },
    { name: "favorites" },
    { name: "recent" },
    { name: "component", slug: "people-list" },
  ])("round-trips %o", (route) => {
    expect(parseHash(toHref(route))).toEqual(route);
  });
});
