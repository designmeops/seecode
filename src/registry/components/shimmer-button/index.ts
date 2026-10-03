import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./shimmer-button.tsx?raw";

export default defineComponent({
  slug: "shimmer-button",
  name: "Shimmer Button",
  description: "A dark pill button with a soft band of light that sweeps across it on a loop.",
  category: "buttons",
  tags: ["animated", "cta", "dark"],
  author: "seecode",
  createdAt: "2026-03-02",
  updatedAt: "2026-09-12",
  version: "1.2.0",
  featured: true,
  files: [{ name: "shimmer-button.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "children", type: "ReactNode", description: "Label and optional trailing icon." },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
      description: "Native button type.",
    },
    { name: "className", type: "string", description: "Extra classes merged onto the button." },
    {
      name: "...props",
      type: "ButtonHTMLAttributes",
      description: "Any other native button attribute.",
    },
  ],
  preview: { component: Demo },
});
