import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./stat-card.tsx?raw";

export default defineComponent({
  slug: "stat-card",
  name: "Stat Card",
  description:
    "A KPI card with a big tabular value, a colored delta badge and a smooth SVG sparkline from your data.",
  category: "cards",
  tags: ["data", "chart", "status"],
  author: "halftone",
  createdAt: "2026-05-19",
  version: "1.0.0",
  files: [{ name: "stat-card.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "label",
      type: "ReactNode",
      description: "Metric name, e.g. “Monthly recurring revenue”.",
    },
    { name: "value", type: "ReactNode", description: "Pre-formatted value, e.g. “$48,290”." },
    {
      name: "delta",
      type: "number",
      description: "Percentage change. Positive renders emerald with an up arrow, negative rose.",
    },
    {
      name: "data",
      type: "number[]",
      description: "Sparkline values, oldest first. The line is scaled to fit and smoothed.",
    },
    {
      name: "caption",
      type: "ReactNode",
      default: '"vs last month"',
      description: "Text after the badge.",
    },
    { name: "className", type: "string", description: "Extra classes for the card, e.g. a width." },
  ],
  preview: { component: Demo, cardScale: 0.55 },
});
