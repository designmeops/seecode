import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { authors } from "./authors";
import { CATEGORY_IDS } from "./categories";
import { registry } from "./index";

const folders = Object.keys(import.meta.glob("./components/*/index.ts")).map(
  (path) => path.split("/")[2],
);

/** Dashboard-only theme tokens. Components must not depend on them. */
const DASHBOARD_TOKEN =
  /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|via|to)-(?:app|panel|subtle|muted|hover|active|line|line-subtle|line-strong|ink|ink-2|ink-3|ink-4|brand|brand-hover|brand-soft|brand-line|good|good-soft)\b/;

const NEEDS_CLIENT = /\buse[A-Z]\w*\(|\son[A-Z]\w*=\{/;

describe("registry", () => {
  it("discovers every component folder", () => {
    expect(registry.length).toBeGreaterThan(0);
    expect(registry.map((item) => item.slug).sort()).toEqual([...folders].sort());
  });

  it("uses unique names and ids", () => {
    expect(new Set(registry.map((item) => item.name)).size).toBe(registry.length);
    expect(new Set(registry.map((item) => item.id)).size).toBe(registry.length);
  });

  describe.each(registry.map((item) => [item.slug, item] as const))("%s", (_slug, item) => {
    it("has valid metadata", () => {
      expect(item.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(item.name.trim()).not.toBe("");
      expect(item.description.length).toBeGreaterThan(10);
      expect(item.description.length).toBeLessThanOrEqual(120);
      expect(CATEGORY_IDS).toContain(item.category);
      expect(Object.keys(authors)).toContain(item.author);
      expect(item.tags.length).toBeGreaterThanOrEqual(1);
      expect(item.tags.length).toBeLessThanOrEqual(4);
      for (const tag of item.tags) expect(tag).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(item.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(item.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(item.createdAt))).toBe(false);
      if (item.updatedAt) expect(item.updatedAt >= item.createdAt).toBe(true);
      const scale = item.preview.cardScale ?? 1;
      expect(scale).toBeGreaterThan(0);
      expect(scale).toBeLessThanOrEqual(1);
    });

    it("ships a self-contained source file", () => {
      const [main] = item.files;
      expect(main.name).toBe(`${item.slug}.tsx`);
      expect(main.code).toMatch(/export (?:function|const) [A-Z]/);
      const imports = [...main.code.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((m) => m[1]);
      expect(imports.filter((source) => source !== "react")).toEqual([]);
      expect(main.code).not.toMatch(DASHBOARD_TOKEN);
      if (NEEDS_CLIENT.test(main.code)) expect(main.code.startsWith('"use client";')).toBe(true);
    });

    it("documents usage with the component", () => {
      expect(item.usage).toContain(`from "./${item.slug}"`);
      expect(item.usage).not.toMatch(DASHBOARD_TOKEN);
    });

    it("renders its demo on the server", () => {
      expect(() => renderToString(createElement(item.preview.component))).not.toThrow();
    });
  });
});
