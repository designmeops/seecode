import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./spotlight-card.tsx?raw";

export default defineComponent({
  slug: "spotlight-card",
  name: "Spotlight Card",
  description:
    "A dark card with a soft radial spotlight that follows the cursor and lights up its border.",
  category: "cards",
  tags: ["dark", "interactive", "motion"],
  author: "seecode",
  createdAt: "2026-09-15",
  version: "1.0.0",
  featured: true,
  files: [{ name: "spotlight-card.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "children", type: "ReactNode", description: "Card content, padded by the card." },
    {
      name: "spotlightColor",
      type: "string",
      default: '"rgb(129 140 248 / 0.2)"',
      description: "Center color of the background spotlight. Translucent colors work best.",
    },
    { name: "className", type: "string", description: "Extra classes for the card, e.g. a width." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Any other div attribute. onPointerMove is still called.",
    },
  ],
  preview: { component: Demo, cardScale: 0.62, tone: "dark" },
});
