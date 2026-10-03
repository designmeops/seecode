import { useMemo, useSyncExternalStore } from "react";
import { type CategoryId, isCategoryId } from "../registry/categories";

/**
 * Hash-based routes keep the app deployable to any static host
 * (GitHub Pages, S3, a CDN) without rewrite rules.
 */
export type Route =
  | { name: "explore" }
  | { name: "category"; category: CategoryId }
  | { name: "tag"; tag: string }
  | { name: "favorites" }
  | { name: "recent" }
  | { name: "component"; slug: string }
  | { name: "not-found" };

export type BrowseRoute = Exclude<Route, { name: "component" } | { name: "not-found" }>;

export function parseHash(hash: string): Route {
  const segments = hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  if (segments.length === 0) return { name: "explore" };
  const [head, value, ...rest] = segments;
  if (rest.length > 0) return { name: "not-found" };

  switch (head) {
    case "category":
      return value && isCategoryId(value)
        ? { name: "category", category: value }
        : { name: "not-found" };
    case "tag":
      return value ? { name: "tag", tag: value.toLowerCase() } : { name: "not-found" };
    case "favorites":
      return value ? { name: "not-found" } : { name: "favorites" };
    case "recent":
      return value ? { name: "not-found" } : { name: "recent" };
    case "component":
      return value ? { name: "component", slug: value } : { name: "not-found" };
    default:
      return { name: "not-found" };
  }
}

export function toHref(route: Route): string {
  switch (route.name) {
    case "explore":
    case "not-found":
      return "#/";
    case "category":
      return `#/category/${route.category}`;
    case "tag":
      return `#/tag/${encodeURIComponent(route.tag)}`;
    case "favorites":
      return "#/favorites";
    case "recent":
      return "#/recent";
    case "component":
      return `#/component/${encodeURIComponent(route.slug)}`;
  }
}

export function navigate(route: Route) {
  const href = toHref(route);
  if (location.hash !== href) location.hash = href;
}

export function routeKey(route: Route): string {
  return toHref(route);
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    () => location.hash,
    () => "",
  );
  return useMemo(() => parseHash(hash), [hash]);
}

/** Absolute URL for sharing a route. */
export function shareUrl(route: Route): string {
  const url = new URL(location.href);
  url.hash = toHref(route).slice(1);
  return url.toString();
}

let lastBrowse: BrowseRoute | null = null;

/** Remembers the list a user was browsing, so Esc on a detail page returns to it. */
export function rememberBrowseRoute(route: BrowseRoute) {
  lastBrowse = route;
}

export function lastBrowseRoute(): BrowseRoute | null {
  return lastBrowse;
}
