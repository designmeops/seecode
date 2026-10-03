import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./dock.tsx?raw";

export default defineComponent({
  slug: "dock",
  name: "Magnifying Dock",
  description: "A frosted, macOS-style dock whose icons swell as the pointer or keyboard focus moves across them.",
  category: "navigation",
  tags: ["animated", "interactive", "glass", "motion"],
  author: "nova",
  createdAt: "2026-09-26",
  version: "1.0.0",
  featured: true,
  files: [{ name: "dock.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "items",
      type: '(DockItem | "divider")[]',
      description:
        'Apps in order: { id, label, icon, tileClassName?, open?, onSelect? }. Use "divider" between groups.',
    },
    { name: "iconSize", type: "number", default: "40", description: "Resting icon size in px." },
    {
      name: "magnification",
      type: "number",
      default: "1.6",
      description: "Scale of the icon directly under the pointer.",
    },
    {
      name: "distance",
      type: "number",
      default: "140",
      description: "Distance in px over which neighbouring icons are magnified.",
    },
    { name: "aria-label", type: "string", default: '"Dock"', description: "Accessible name for the toolbar." },
    { name: "className", type: "string", description: "Extra classes merged onto the toolbar." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Any other native attribute for the toolbar element.",
    },
  ],
  preview: { component: Demo, cardScale: 0.74 },
});
