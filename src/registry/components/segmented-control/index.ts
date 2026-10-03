import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./segmented-control.tsx?raw";

export default defineComponent({
  slug: "segmented-control",
  name: "Segmented Control",
  description:
    "A Linear-style view switcher with equal-width segments and a white thumb that slides.",
  category: "navigation",
  tags: ["animated", "keyboard", "minimal"],
  author: "orbit",
  createdAt: "2026-06-03",
  version: "1.0.0",
  files: [{ name: "segmented-control.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "options",
      type: "{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }[]",
      description: "Segments in display order. Each one gets the same width.",
    },
    { name: "value", type: "string", description: "Selected value, for controlled usage." },
    {
      name: "defaultValue",
      type: "string",
      description:
        "Value selected on first render when uncontrolled. Defaults to the first enabled option.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Called when a segment is picked by click or arrow keys.",
    },
    {
      name: "size",
      type: '"sm" | "md"',
      default: '"md"',
      description: "Segment height and text size.",
    },
    {
      name: "name",
      type: "string",
      description: "Renders a hidden input so the value is submitted with a form.",
    },
    { name: "aria-label", type: "string", description: "Accessible name for the radio group." },
    { name: "className", type: "string", description: "Extra classes merged onto the track." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Any other native attribute for the radio group element.",
    },
  ],
  preview: { component: Demo },
});
