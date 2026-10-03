import { defineComponent } from "../../define";
import nextjs from "./deal-card.tsx?raw";
import framer from "./deal-card.framer.tsx?raw";
import webflow from "./deal-card.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "deal-card",
  name: "Deal Card",
  description:
    "A deal with its stage, name, value, services and created date, plus a ⋮ actions menu.",
  category: "cards",
  tags: ["crm", "deals", "status"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  featured: true,
  formats: {
    nextjs: { name: "deal-card.tsx", language: "tsx", code: nextjs },
    framer: { name: "DealCard.tsx", language: "tsx", code: framer },
    webflow: { name: "deals.html", language: "html", code: webflow },
  },
  usage,
  props: [
    {
      name: "status",
      type: '"pitching" | "lost" | "won"',
      description: "Deal stage; sets the icon and its color.",
    },
    { name: "name", type: "string", description: "Deal name." },
    { name: "value", type: "string", description: 'Formatted value, e.g. "$100,000".' },
    { name: "services", type: "string[]", default: "[]", description: "Shown as chips." },
    {
      name: "created",
      type: "string",
      description: 'Formatted creation date, e.g. "May 9, 2025".',
    },
    {
      name: "onMenuClick",
      type: "() => void",
      description: "Called when the ⋮ button is pressed.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the card element.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.92, height: 420, width: 940 },
});
