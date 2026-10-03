import {
  Bell,
  ChartBar,
  Compass,
  Layers,
  type LucideIcon,
  Megaphone,
  PanelsTopLeft,
  SquareMousePointer,
  TextCursorInput,
} from "lucide-react";

export const CATEGORY_IDS = [
  "buttons",
  "inputs",
  "cards",
  "navigation",
  "feedback",
  "data-display",
  "overlays",
  "marketing",
] as const;

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
    id: "buttons",
    name: "Buttons",
    description: "Calls to action, loading states and expressive button styles.",
    icon: SquareMousePointer,
    color: "#5e6ad2",
  },
  {
    id: "inputs",
    name: "Inputs & Forms",
    description: "Text fields, switches, verification codes and tag pickers.",
    icon: TextCursorInput,
    color: "#0f9f8f",
  },
  {
    id: "cards",
    name: "Cards",
    description: "Pricing, metrics and content containers.",
    icon: PanelsTopLeft,
    color: "#d9467a",
  },
  {
    id: "navigation",
    name: "Navigation",
    description: "Tabs, segmented controls and docks.",
    icon: Compass,
    color: "#2f80ed",
  },
  {
    id: "feedback",
    name: "Feedback",
    description: "Toasts, progress and inline alerts.",
    icon: Bell,
    color: "#e08a1e",
  },
  {
    id: "data-display",
    name: "Data Display",
    description: "Avatars, statuses, timelines and issue cards.",
    icon: ChartBar,
    color: "#8b5cf6",
  },
  {
    id: "overlays",
    name: "Overlays",
    description: "Menus, tooltips and dialogs.",
    icon: Layers,
    color: "#4b5563",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Announcement pills, logo walls, testimonials and sign-up forms.",
    icon: Megaphone,
    color: "#e5484d",
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
