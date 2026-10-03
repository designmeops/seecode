import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./toggle-switch.tsx?raw";

export default defineComponent({
  slug: "toggle-switch",
  name: "Toggle Switch",
  description: "An accessible on/off switch with a sliding knob, optional label and description, controlled or not.",
  category: "inputs",
  tags: ["form", "accessible", "keyboard"],
  author: "seecode",
  createdAt: "2026-03-24",
  version: "1.0.0",
  files: [{ name: "toggle-switch.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "checked", type: "boolean", description: "Controlled state. Pair with onCheckedChange." },
    { name: "defaultChecked", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      description: "Called with the next state on click, Space or Enter.",
    },
    { name: "label", type: "ReactNode", description: "Visible label. Clicking it toggles the switch." },
    { name: "description", type: "ReactNode", description: "Secondary text, linked with aria-describedby." },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Track size." },
    { name: "disabled", type: "boolean", default: "false", description: "Dims the row and blocks changes." },
    {
      name: "className",
      type: "string",
      description: "Classes for the row when a label or description is set, otherwise for the switch.",
    },
    {
      name: "...props",
      type: "ButtonHTMLAttributes",
      description: "Other button attributes, e.g. aria-label when there is no visible label.",
    },
  ],
  preview: { component: Demo, cardScale: 0.82 },
});
