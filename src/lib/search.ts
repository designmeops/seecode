import { getAuthor } from "../registry/authors";
import { getCategory } from "../registry/categories";
import type { RegistryItem } from "../registry/types";
import { isRecent } from "./format";
import type { SortMode } from "./state";

export type QuickFilter = "all" | "featured" | "new";

function haystack(item: RegistryItem): string {
  return [
    item.name,
    item.slug,
    item.id,
    item.description,
    getCategory(item.category).name,
    getAuthor(item.author).name,
    ...item.tags,
  ]
    .join(" ")
    .toLowerCase();
}

/** Every whitespace-separated term must appear somewhere in the item's text. */
export function matchesQuery(item: RegistryItem, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = haystack(item);
  return terms.every((term) => text.includes(term));
}

export function applyQuickFilter(
  items: RegistryItem[],
  filter: QuickFilter,
  now = Date.now(),
): RegistryItem[] {
  if (filter === "featured") return items.filter((item) => item.featured);
  if (filter === "new") return items.filter((item) => isRecent(item.createdAt, now));
  return items;
}

export function sortItems(items: RegistryItem[], sort: SortMode): RegistryItem[] {
  const sorted = [...items];
  switch (sort) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "featured":
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt),
      );
  }
}
