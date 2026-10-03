import { createPersistentStore, createStore, useStore } from "./store";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

/* ---------------------------------------------------------------- favorites */

export const favoritesStore = createPersistentStore<string[]>(
  "seecode:favorites",
  [],
  isStringArray,
);

export function toggleFavorite(slug: string): boolean {
  const isFavorite = !favoritesStore.get().includes(slug);
  favoritesStore.set((list) => (isFavorite ? [slug, ...list] : list.filter((s) => s !== slug)));
  return isFavorite;
}

export const useFavorites = () => useStore(favoritesStore);

/* ------------------------------------------------------------- copy history */

export interface CopyRecord {
  slug: string;
  /** Last copy, epoch ms. */
  at: number;
  count: number;
}

const isHistory = (value: unknown): value is CopyRecord[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as CopyRecord).slug === "string" &&
      typeof (entry as CopyRecord).at === "number" &&
      typeof (entry as CopyRecord).count === "number",
  );

export const historyStore = createPersistentStore<CopyRecord[]>("seecode:history", [], isHistory);

const HISTORY_LIMIT = 50;

export function recordCopy(slug: string) {
  historyStore.set((history) => {
    const previous = history.find((entry) => entry.slug === slug);
    const next: CopyRecord = { slug, at: Date.now(), count: (previous?.count ?? 0) + 1 };
    return [next, ...history.filter((entry) => entry.slug !== slug)].slice(0, HISTORY_LIMIT);
  });
}

export function clearHistory() {
  historyStore.set([]);
}

export const useHistory = () => useStore(historyStore);

/* -------------------------------------------------------------- preferences */

export type ViewMode = "grid" | "list";
export type SortMode = "featured" | "newest" | "name";

export interface Preferences {
  view: ViewMode;
  sort: SortMode;
  categoriesOpen: boolean;
  tagsOpen: boolean;
}

const defaultPreferences: Preferences = {
  view: "grid",
  sort: "featured",
  categoriesOpen: true,
  tagsOpen: true,
};

const isPreferences = (value: unknown): value is Preferences => {
  if (typeof value !== "object" || value === null) return false;
  const prefs = value as Preferences;
  return (
    (prefs.view === "grid" || prefs.view === "list") &&
    (prefs.sort === "featured" || prefs.sort === "newest" || prefs.sort === "name") &&
    typeof prefs.categoriesOpen === "boolean" &&
    typeof prefs.tagsOpen === "boolean"
  );
};

export const preferencesStore = createPersistentStore<Preferences>(
  "seecode:preferences",
  defaultPreferences,
  isPreferences,
);

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  preferencesStore.set((prefs) => ({ ...prefs, [key]: value }));
}

export const usePreferences = () => useStore(preferencesStore);

/* ------------------------------------------------------------------ dialogs */

export type DialogName = "command" | "shortcuts" | "publish" | "navigation";

export const dialogStore = createStore<DialogName | null>(null);

export const openDialog = (name: DialogName) => dialogStore.set(name);
export const closeDialog = () => dialogStore.set(null);
export const useDialog = () => useStore(dialogStore);
