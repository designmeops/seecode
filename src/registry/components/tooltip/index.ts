import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./tooltip.tsx?raw";

export default defineComponent({
  slug: "tooltip",
  name: "Tooltip",
  description:
    "A compact dark tooltip with an arrow and shortcut chips that opens on hover or keyboard focus.",
  category: "overlays",
  tags: ["overlay", "accessible", "keyboard", "minimal"],
  author: "halftone",
  createdAt: "2026-05-27",
  version: "1.0.0",
  files: [{ name: "tooltip.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "content",
      type: "ReactNode",
      description: "Tooltip text; also wired to the trigger as its aria-describedby description.",
    },
    {
      name: "children",
      type: "ReactElement",
      description: "A single focusable trigger, such as an icon button.",
    },
    {
      name: "side",
      type: '"top" | "bottom" | "left" | "right"',
      default: '"top"',
      description: "Where the bubble sits relative to the trigger.",
    },
    {
      name: "shortcut",
      type: "string | string[]",
      description: 'Keys rendered as chips, e.g. "⌘B", "⌘⇧X" or ["Ctrl", "B"].',
    },
    {
      name: "delay",
      type: "number",
      default: "300",
      description:
        "Hover delay in ms. Focus opens instantly, as does moving between tooltips in quick succession.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Show on first paint without any interaction — useful for previews and docs.",
    },
    { name: "className", type: "string", description: "Extra classes for the bubble." },
  ],
  preview: { component: Demo },
});
