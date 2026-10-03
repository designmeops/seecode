import type { CodeFile, FormatId, RegistryItem } from "../registry/types";
import { createPersistentStore, useStore } from "./store";

export interface FormatMeta {
  id: FormatId;
  name: string;
  /** What the copied code is. */
  summary: string;
}

/** Display order everywhere: cards, the code tabs, menus. */
export const FORMATS: FormatMeta[] = [
  { id: "nextjs", name: "Next.js", summary: "React + Tailwind CSS" },
  { id: "framer", name: "Framer", summary: "Code component" },
  { id: "webflow", name: "Webflow", summary: "HTML + CSS embed" },
];

const byId = new Map(FORMATS.map((format) => [format.id, format]));

export function getFormat(id: FormatId): FormatMeta {
  return byId.get(id)!;
}

export function isFormatId(value: unknown): value is FormatId {
  return byId.has(value as FormatId);
}

/** The formats a component ships, in display order. Next.js is always there. */
export function formatsOf(item: RegistryItem): FormatMeta[] {
  return FORMATS.filter((format) => item.formats[format.id]);
}

export function fileFor(item: RegistryItem, format: FormatId): CodeFile {
  return item.formats[format] ?? item.formats.nextjs;
}

/** The last format someone copied. The `c` shortcut copies it. */
export const preferredFormatStore = createPersistentStore<FormatId>(
  "seecode:format",
  "nextjs",
  isFormatId,
);

export const usePreferredFormat = () => useStore(preferredFormatStore);

/** The preferred format when the component ships it, otherwise Next.js. */
export function defaultFormatFor(
  item: RegistryItem,
  preferred: FormatId = preferredFormatStore.get(),
): FormatId {
  return item.formats[preferred] ? preferred : "nextjs";
}
