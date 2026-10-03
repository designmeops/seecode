import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./announcement-pill.tsx?raw";

export default defineComponent({
  slug: "announcement-pill",
  name: "Announcement Pill",
  description:
    "A dark announcement link with a gradient hairline, a “New” tag, a hover shine and an arrow that nudges.",
  category: "marketing",
  tags: ["dark", "gradient", "cta", "animated"],
  author: "nova",
  createdAt: "2026-08-19",
  version: "1.0.0",
  files: [{ name: "announcement-pill.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "children", type: "ReactNode", description: "Announcement text." },
    { name: "href", type: "string", description: "Where the announcement links to." },
    {
      name: "tag",
      type: "ReactNode",
      default: '"New"',
      description: "Badge before the text; pass null to hide it.",
    },
    { name: "className", type: "string", description: "Extra classes merged onto the link." },
    {
      name: "...props",
      type: "AnchorHTMLAttributes",
      description: "Any other anchor attribute, e.g. target or rel.",
    },
  ],
  preview: { component: Demo, cardScale: 0.74, height: 360, tone: "dark" },
});
