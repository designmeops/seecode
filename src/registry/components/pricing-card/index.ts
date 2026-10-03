import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./pricing-card.tsx?raw";

export default defineComponent({
  slug: "pricing-card",
  name: "Pricing Card",
  description:
    "A plan card with a monthly/yearly toggle, an animated price, a feature list and a call to action.",
  category: "cards",
  tags: ["interactive", "cta", "minimal"],
  author: "nova",
  createdAt: "2026-04-02",
  version: "1.0.0",
  featured: true,
  files: [{ name: "pricing-card.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "name", type: "ReactNode", description: "Plan name, e.g. “Pro”." },
    { name: "description", type: "ReactNode", description: "One line under the name." },
    {
      name: "badge",
      type: "ReactNode",
      description: "Pill next to the name, e.g. “Most popular”.",
    },
    {
      name: "price",
      type: "{ monthly: number; yearly: number }",
      description: "Price per month for each cycle. The yearly saving badge is derived from these.",
    },
    {
      name: "currency",
      type: "string",
      default: '"$"',
      description: "Symbol placed before prices.",
    },
    { name: "features", type: "ReactNode[]", description: "Feature rows, each with a check icon." },
    { name: "ctaLabel", type: "ReactNode", default: '"Get started"', description: "Button label." },
    {
      name: "onSelectPlan",
      type: "(billing: BillingCycle) => void",
      description: "Called by the button with the selected billing cycle.",
    },
    { name: "footnote", type: "ReactNode", description: "Small print under the button." },
    {
      name: "defaultBilling",
      type: '"monthly" | "yearly"',
      default: '"monthly"',
      description: "Initial billing cycle when uncontrolled.",
    },
    {
      name: "billing / onBillingChange",
      type: "BillingCycle / (billing) => void",
      description:
        "Controlled billing cycle, e.g. to drive several cards from one page-level toggle.",
    },
    { name: "className", type: "string", description: "Extra classes for the card, e.g. a width." },
  ],
  preview: { component: Demo, cardScale: 0.4, height: 600 },
});
