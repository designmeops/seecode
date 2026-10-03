import { defineComponent } from "../../define";
import source from "./animated-tabs.tsx?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";

export default defineComponent({
  slug: "animated-tabs",
  name: "Animated Tabs",
  description:
    "Accessible tabs with a pill indicator that glides to the active trigger and follows resizes.",
  category: "navigation",
  tags: ["animated", "keyboard", "accessible"],
  author: "seecode",
  createdAt: "2026-03-30",
  updatedAt: "2026-07-08",
  version: "1.1.0",
  featured: true,
  files: [{ name: "animated-tabs.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "tabs",
      type: "{ id: string; label: ReactNode; content: ReactNode; disabled?: boolean }[]",
      description: "Tabs in display order. Only the active tab's content is mounted.",
    },
    {
      name: "defaultValue",
      type: "string",
      description:
        "Id of the tab selected on first render when uncontrolled. Defaults to the first enabled tab.",
    },
    { name: "value", type: "string", description: "Id of the selected tab, for controlled usage." },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Called with the new tab id on click or arrow-key navigation.",
    },
    { name: "label", type: "string", description: "Accessible name for the tab list." },
    { name: "listClassName", type: "string", description: "Extra classes for the tab list row." },
    { name: "panelClassName", type: "string", description: "Extra classes for the active panel." },
    {
      name: "className",
      type: "string",
      description: "Extra classes merged onto the root element.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Any other native attribute for the root element.",
    },
  ],
  preview: { component: Demo, cardScale: 0.8 },
});
