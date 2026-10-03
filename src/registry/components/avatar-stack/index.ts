import { defineComponent } from "../../define";
import source from "./avatar-stack.tsx?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";

export default defineComponent({
  slug: "avatar-stack",
  name: "Avatar Stack",
  description:
    "Overlapping initials avatars with name tooltips, a lift on hover, and a +N overflow chip.",
  category: "data-display",
  tags: ["social", "interactive", "minimal"],
  author: "orbit",
  createdAt: "2026-05-12",
  version: "1.0.0",
  files: [{ name: "avatar-stack.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "people",
      type: "{ name: string; image?: string }[]",
      description:
        "People in display order. Without an image, initials sit on a gradient picked from the name.",
    },
    { name: "max", type: "number", default: "4", description: "Avatars shown before the +N chip." },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Avatar diameter: 24, 32 or 40 px.",
    },
    {
      name: "aria-label",
      type: "string",
      description: 'Accessible name for the list, e.g. "Viewers".',
    },
    { name: "className", type: "string", description: "Extra classes merged onto the list." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLUListElement>",
      description: "Any other native attribute for the list element.",
    },
  ],
  preview: { component: Demo },
});
