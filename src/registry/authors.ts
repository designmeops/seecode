export interface Author {
  name: string;
  handle: string;
  /** Two-stop gradient for the generated avatar. */
  colors: [string, string];
}

/** Sample creators. Replace with your own team or contributors. */
export const authors = {
  seecode: { name: "seecode", handle: "@seecode", colors: ["#7c86e8", "#4f5bc4"] },
  nova: { name: "Nova UI", handle: "@nova-ui", colors: ["#f59e9e", "#d9467a"] },
  halftone: { name: "Halftone", handle: "@halftone", colors: ["#7dd3c0", "#1f9d8b"] },
  orbit: { name: "Orbit Labs", handle: "@orbitlabs", colors: ["#fcd38d", "#e08a1e"] },
  meadow: { name: "Meadow", handle: "@meadow.dev", colors: ["#a5b4fc", "#8b5cf6"] },
} satisfies Record<string, Author>;

export type AuthorId = keyof typeof authors;

export function getAuthor(id: AuthorId): Author {
  return authors[id];
}
