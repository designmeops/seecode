import { describe, expect, it } from "vitest";
import type { RegistryItem } from "../registry/types";
import { defaultFormatFor, fileFor, formatsOf } from "./formats";

const file = (name: string) => ({ name, language: "tsx" as const, code: `// ${name}` });

function makeItem(formats: RegistryItem["formats"]): RegistryItem {
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
    formats,
    usage: "",
    preview: { component: () => null },
  };
}

const everywhere = makeItem({
  webflow: { name: "item.html", language: "html", code: "<div></div>" },
  nextjs: file("item.tsx"),
  framer: file("Item.tsx"),
});
const nextOnly = makeItem({ nextjs: file("item.tsx") });

describe("formatsOf", () => {
  it("lists the shipped formats in display order", () => {
    expect(formatsOf(everywhere).map((format) => format.id)).toEqual([
      "nextjs",
      "framer",
      "webflow",
    ]);
    expect(formatsOf(nextOnly).map((format) => format.id)).toEqual(["nextjs"]);
  });
});

describe("defaultFormatFor", () => {
  it("uses the preferred format when the component ships it", () => {
    expect(defaultFormatFor(everywhere, "webflow")).toBe("webflow");
  });

  it("falls back to Next.js", () => {
    expect(defaultFormatFor(nextOnly, "framer")).toBe("nextjs");
  });
});

describe("fileFor", () => {
  it("returns the format's file, or the Next.js file when it is missing", () => {
    expect(fileFor(everywhere, "framer").name).toBe("Item.tsx");
    expect(fileFor(nextOnly, "webflow").name).toBe("item.tsx");
  });
});
