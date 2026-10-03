import { ChartBar, Compass, type LucideIcon, PanelsTopLeft, PanelTop } from "lucide-react";

export const CATEGORY_IDS = ["navigation", "headers", "cards", "data-display"] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Accent used for the category's icon tile. */
  color: string;
}

export const categories: Category[] = [
  {
    id: "navigation",
    name: "Navigation",
    description: "App sidebars and breadcrumbs.",
    icon: Compass,
    color: "#2f80ed",
  },
  {
    id: "headers",
    name: "Page Headers",
    description: "Record headers with titles, links and actions.",
    icon: PanelTop,
    color: "#5e6ad2",
  },
  {
    id: "cards",
    name: "Cards",
    description: "Compact records such as deals.",
    icon: PanelsTopLeft,
    color: "#d9467a",
  },
  {
    id: "data-display",
    name: "Data Display",
    description: "Property panels, people lists and activity feeds.",
    icon: ChartBar,
    color: "#8b5cf6",
  },
];

const byId = new Map(categories.map((category) => [category.id, category]));

export function getCategory(id: CategoryId): Category {
  const category = byId.get(id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function isCategoryId(value: string): value is CategoryId {
  return byId.has(value as CategoryId);
}
