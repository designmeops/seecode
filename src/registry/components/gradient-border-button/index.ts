import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./gradient-border-button.tsx?raw";

export default defineComponent({
  slug: "gradient-border-button",
  name: "Aurora Border Button",
  description:
    "A white pill button wrapped in a slowly turning indigo, fuchsia and amber gradient ring.",
  category: "buttons",
  tags: ["animated", "gradient", "cta"],
  author: "nova",
  createdAt: "2026-03-09",
  version: "1.0.0",
  files: [{ name: "gradient-border-button.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "children",
      type: "ReactNode",
      description: "Label and optional leading or trailing icon.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
      description: "Native button type.",
    },
    {
      name: "className",
      type: "string",
      description: "Extra classes merged onto the outer button, e.g. for width or margins.",
    },
    {
      name: "...props",
      type: "ButtonHTMLAttributes",
      description: "Any other native button attribute, such as onClick or disabled.",
    },
  ],
  preview: { component: Demo },
});
