import { type ComponentType, createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { authors } from "./authors";
import { CATEGORY_IDS } from "./categories";
import { defaultPropsFromControls, getPropertyControls } from "./framer-shim";
import { registry } from "./index";

const folders = Object.keys(import.meta.glob("./components/*/index.ts")).map(
  (path) => path.split("/")[2],
);

/** Framer versions, rendered through the `framer` stand-in (see vite.config.ts). */
const framerModules = import.meta.glob<{ default: ComponentType<Record<string, unknown>> }>(
  "./components/*/*.framer.tsx",
  { eager: true },
);

/** Dashboard-only theme tokens. Components must not depend on them. */
const DASHBOARD_TOKEN =
  /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|via|to)-(?:app|panel|card|raised|field|subtle|muted|hover|active|line|line-subtle|line-strong|ink|ink-2|ink-3|ink-4|brand|brand-hover|brand-ink|brand-soft|brand-line|good|good-soft|star|info|danger)\b/;

const NEEDS_CLIENT = /\buse[A-Z]\w*\(|\son[A-Z]\w*=\{/;

const importsOf = (code: string) =>
  [...code.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((match) => match[1]);

/** Selectors of every style rule (outside @keyframes) and the names of @keyframes blocks. */
function cssRules(css: string): { selectors: string[]; keyframes: string[] } {
  const selectors: string[] = [];
  const keyframes: string[] = [];
  const stack: string[] = [];
  let buffer = "";
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (char === "{") {
      const prelude = buffer.trim();
      buffer = "";
      if (prelude.startsWith("@keyframes")) keyframes.push(prelude.split(/\s+/)[1] ?? "");
      else if (!prelude.startsWith("@") && !stack.some((p) => p.startsWith("@keyframes"))) {
        selectors.push(...prelude.split(",").map((selector) => selector.trim()));
      }
      stack.push(prelude);
    } else if (char === "}") {
      stack.pop();
      buffer = "";
    } else if (char === ";") {
      buffer = "";
    } else {
      buffer += char;
    }
  }
  return { selectors, keyframes };
}

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

    it("ships a self-contained Next.js file", () => {
      const { nextjs } = item.formats;
      expect(nextjs.name).toBe(`${item.slug}.tsx`);
      expect(nextjs.code).toMatch(/export (?:function|const) [A-Z]/);
      expect(importsOf(nextjs.code).filter((source) => source !== "react")).toEqual([]);
      expect(nextjs.code).not.toMatch(DASHBOARD_TOKEN);
      if (NEEDS_CLIENT.test(nextjs.code))
        expect(nextjs.code.startsWith('"use client";')).toBe(true);
    });

    it("ships a Framer code component", () => {
      const { framer } = item.formats;
      if (!framer) return;
      expect(framer.name).toMatch(/^[A-Z][A-Za-z0-9]*\.tsx$/);
      expect(framer.code).toMatch(/export default function [A-Z]/);
      expect(framer.code).toContain("addPropertyControls(");
      expect(framer.code).toMatch(/@framerSupportedLayoutWidth/);
      expect(
        importsOf(framer.code).filter((source) => source !== "react" && source !== "framer"),
      ).toEqual([]);
      // Framer doesn't run Tailwind: styles must be inline or in a <style> tag.
      expect(framer.code).not.toMatch(/className=/);

      const module = framerModules[`./components/${item.slug}/${item.slug}.framer.tsx`];
      expect(module, `${item.slug}.framer.tsx should exist next to index.ts`).toBeDefined();
      expect(getPropertyControls(module.default)).toBeDefined();
      const html = renderToString(
        createElement(module.default, defaultPropsFromControls(module.default)),
      );
      expect(html.length).toBeGreaterThan(0);
    });

    it("ships a Webflow embed", () => {
      const { webflow } = item.formats;
      if (!webflow) return;
      expect(webflow.name).toMatch(/^[a-z0-9-]+\.html$/);
      // Webflow's Code Embed element accepts at most 50,000 characters.
      expect(webflow.code.length).toBeLessThanOrEqual(50_000);
      expect(webflow.code).toMatch(/<style>[\s\S]+<\/style>/);
      // Self-contained: inline scripts, no external images or styles except a Google Fonts
      // stylesheet. (Links to other pages are content, not resources.)
      expect(webflow.code).not.toMatch(/<script[^>]+src=/);
      expect(webflow.code).not.toMatch(/\bsrc="https?:/);
      expect(webflow.code).not.toMatch(/url\(\s*["']?https?:/);
      for (const [, href] of webflow.code.matchAll(/<link\b[^>]*\bhref="([^"]+)"/g)) {
        expect(href).toMatch(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//);
      }
      // Every class and id is prefixed so the embed can't restyle the rest of the site.
      for (const [, classes] of webflow.code.matchAll(/class="([^"]+)"/g)) {
        for (const name of classes.split(/\s+/)) expect(name).toMatch(/^sc-/);
      }
      const ids = [...webflow.code.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
      for (const id of ids) expect(id).toMatch(/^sc-/);

      // Icons come from the embed's own sprite.
      for (const [, target] of webflow.code.matchAll(/<use[^>]*\shref="#([^"]+)"/g)) {
        expect(ids, `<use href="#${target}"> needs a matching id`).toContain(target);
      }

      // One <style> block whose rules only reach the embed's own classes.
      const styles = [...webflow.code.matchAll(/<style>([\s\S]*?)<\/style>/g)];
      expect(styles).toHaveLength(1);
      const { selectors, keyframes } = cssRules(styles[0][1]);
      expect(selectors.length).toBeGreaterThan(0);
      for (const selector of selectors) expect(selector).toMatch(/^\.sc-/);
      for (const name of keyframes) expect(name).toMatch(/^sc-/);
    });

    it("documents usage with the component", () => {
      expect(item.usage).toContain(`from "./${item.slug}"`);
      expect(item.usage).not.toMatch(DASHBOARD_TOKEN);
    });

    it("renders its demos on the server", () => {
      expect(() => renderToString(createElement(item.preview.component))).not.toThrow();
      if (item.preview.thumbnail) {
        expect(() => renderToString(createElement(item.preview.thumbnail!))).not.toThrow();
      }
    });
  });
});
