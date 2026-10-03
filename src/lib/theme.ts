import { createPersistentStore, createStore, useStore } from "./store";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

/** Must match the key read by the no-flash script in index.html. */
const STORAGE_KEY = "seecode:theme";

const THEME_COLORS: Record<Theme, string> = { light: "#f5f5f7", dark: "#0b0b0c" };

const isPreference = (value: unknown): value is ThemePreference =>
  value === "system" || value === "light" || value === "dark";

export const themePreferenceStore = createPersistentStore<ThemePreference>(
  STORAGE_KEY,
  "system",
  isPreference,
);

const darkQuery =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const systemThemeStore = createStore<Theme>(darkQuery?.matches ? "dark" : "light");
darkQuery?.addEventListener("change", (event) =>
  systemThemeStore.set(event.matches ? "dark" : "light"),
);

export function resolveTheme(preference: ThemePreference, system: Theme): Theme {
  return preference === "system" ? system : preference;
}

export function setThemePreference(preference: ThemePreference) {
  themePreferenceStore.set(preference);
}

export function useTheme(): { preference: ThemePreference; theme: Theme } {
  const preference = useStore(themePreferenceStore);
  const system = useStore(systemThemeStore);
  return { preference, theme: resolveTheme(preference, system) };
}

function applyTheme() {
  const theme = resolveTheme(themePreferenceStore.get(), systemThemeStore.get());
  const root = document.documentElement;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

/** Keeps `<html data-theme>` in sync with the preference and the OS setting. */
export function initTheme() {
  applyTheme();
  themePreferenceStore.subscribe(applyTheme);
  systemThemeStore.subscribe(applyTheme);
}
