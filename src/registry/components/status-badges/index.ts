import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./status-badges.tsx?raw";

export default defineComponent({
  slug: "status-badges",
  name: "Status Badge",
  description:
    "Linear-style issue status pills with crisp custom icons, from Backlog to Done and Canceled.",
  category: "data-display",
  tags: ["status", "minimal", "data"],
  author: "seecode",
  createdAt: "2026-07-01",
  version: "1.0.0",
  files: [{ name: "status-badges.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "status",
      type: '"backlog" | "todo" | "in-progress" | "in-review" | "done" | "canceled"',
      description: "Workflow state. Picks the icon, its color and the default label.",
    },
    {
      name: "iconOnly",
      type: "boolean",
      default: "false",
      description: "Renders just the icon and uses the label as its accessible name and tooltip.",
    },
    {
      name: "label",
      type: "string",
      description: "Overrides the default label, e.g. a custom state name.",
    },
    { name: "className", type: "string", description: "Extra classes merged onto the badge." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLSpanElement>",
      description: "Any other native attribute for the badge element.",
    },
    {
      name: "StatusIcon",
      type: "component",
      description: "Also exported: the bare glyph (status, className) for tables and menus.",
    },
  ],
  preview: { component: Demo, cardScale: 0.75 },
});
