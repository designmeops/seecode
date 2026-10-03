import { type CategoryId, categories } from "./categories";
import type { RegistryEntry, RegistryItem } from "./types";

/**
 * Every folder in `./components` with an `index.ts` is picked up automatically.
 * To publish a new component, add a folder — no central list to edit.
 */
const modules = import.meta.glob<RegistryEntry>("./components/*/index.ts", {
  eager: true,
  import: "default",
});

/** Oldest first, so public ids stay stable as new components are added. */
export const registry: RegistryItem[] = Object.values(modules)
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.slug.localeCompare(b.slug))
  .map((entry, index) => ({ ...entry, id: `SC-${index + 1}` }));

const bySlug = new Map(registry.map((item) => [item.slug, item]));

export function getComponent(slug: string): RegistryItem | undefined {
  return bySlug.get(slug);
}

export function countByCategory(): Record<CategoryId, number> {
  const counts = Object.fromEntries(categories.map((c) => [c.id, 0])) as Record<CategoryId, number>;
  for (const item of registry) counts[item.category] += 1;
  return counts;
}

export const allTags: string[] = [...new Set(registry.flatMap((item) => item.tags))].sort();

export type { RegistryEntry, RegistryItem } from "./types";
