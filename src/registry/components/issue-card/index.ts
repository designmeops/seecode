import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./issue-card.tsx?raw";

export default defineComponent({
  slug: "issue-card",
  name: "Issue Card",
  description:
    "A Linear-style board card with status, priority bars, colored labels, due date and an initials avatar.",
  category: "data-display",
  tags: ["status", "data", "minimal"],
  author: "seecode",
  createdAt: "2026-08-05",
  version: "1.0.0",
  featured: true,
  files: [{ name: "issue-card.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "id",
      type: "string",
      description: "Issue identifier shown in the top row, e.g. ENG-142.",
    },
    { name: "title", type: "string", description: "Issue title, clamped to two lines." },
    {
      name: "status",
      type: '"backlog" | "todo" | "in-progress" | "in-review" | "done" | "canceled"',
      default: '"todo"',
      description: "Workflow state, drawn as a Linear-style progress glyph.",
    },
    {
      name: "priority",
      type: '"none" | "urgent" | "high" | "medium" | "low"',
      default: '"none"',
      description: "Signal bars for high/medium/low, an orange “!” square for urgent.",
    },
    {
      name: "labels",
      type: "{ name: string; color?: IssueLabelColor }[]",
      default: "[]",
      description:
        "Label pills with a colored dot (zinc, rose, amber, emerald, sky, indigo, violet).",
    },
    {
      name: "assignee",
      type: "string",
      description: "Full name — rendered as a gradient initials avatar.",
    },
    {
      name: "dueDate",
      type: "Date | string",
      description: "Due date chip. ISO strings (2026-10-12) are read as local dates.",
    },
    {
      name: "comments",
      type: "number",
      default: "0",
      description: "Comment count; hidden when 0.",
    },
    { name: "href", type: "string", description: "Makes the whole card a link to the issue." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the <article> root.",
    },
  ],
  preview: { component: Demo, cardScale: 0.66, height: 360 },
});
