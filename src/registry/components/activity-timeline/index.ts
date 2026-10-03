import { defineComponent } from "../../define";
import source from "./activity-timeline.tsx?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";

export default defineComponent({
  slug: "activity-timeline",
  name: "Activity Timeline",
  description:
    "A vertical activity feed with avatars and icons on a line, status chips and quoted comments.",
  category: "data-display",
  tags: ["data", "social", "status"],
  author: "meadow",
  createdAt: "2026-07-15",
  version: "1.0.0",
  files: [{ name: "activity-timeline.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "events",
      type: "ActivityEvent[]",
      description:
        '{ id, type: "comment" | "status" | "assign" | "label" | "create" | "commit", actor, action, target?, chip?: { label, tone? }, comment?, time }',
    },
    {
      name: "now",
      type: "Date | number",
      description: "Reference time for the relative timestamps. Defaults to the time of render.",
    },
    { name: "className", type: "string", description: "Extra classes merged onto the list." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLOListElement>",
      description: "Any other native attribute for the list element.",
    },
  ],
  preview: { component: Demo, cardScale: 0.7 },
});
