export interface Author {
  name: string;
  handle: string;
  /** Two-stop gradient for the generated avatar. */
  colors: [string, string];
}

/** Who made each component. Add your team or contributors here. */
export const authors = {
  designme: { name: "DesignMe", handle: "@designme", colors: ["#7c86e8", "#4f5bc4"] },
} satisfies Record<string, Author>;

export type AuthorId = keyof typeof authors;

export function getAuthor(id: AuthorId): Author {
  return authors[id];
}
