import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./newsletter-form.tsx?raw";

export default defineComponent({
  slug: "newsletter-form",
  name: "Newsletter Form",
  description:
    "An inline email sign-up card with validation, a loading spinner and a friendly success state.",
  category: "marketing",
  tags: ["form", "interactive", "accessible"],
  author: "halftone",
  createdAt: "2026-08-26",
  version: "1.0.0",
  files: [{ name: "newsletter-form.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "onSubscribe",
      type: "(email: string) => Promise<void>",
      description: "Called with the trimmed address. Resolve for success; reject to show an error.",
    },
    {
      name: "title",
      type: "ReactNode",
      default: '"Subscribe to the changelog"',
      description: "Card heading.",
    },
    { name: "description", type: "ReactNode", description: "One line under the heading." },
    {
      name: "placeholder",
      type: "string",
      default: '"you@company.com"',
      description: "Email input placeholder.",
    },
    {
      name: "buttonLabel",
      type: "ReactNode",
      default: '"Subscribe"',
      description: "Submit label.",
    },
    {
      name: "successMessage",
      type: "ReactNode",
      default: '"You’re on the list — check your inbox."',
      description: "Shown with a check icon once onSubscribe resolves; it receives focus.",
    },
    { name: "className", type: "string", description: "Extra classes for the card, e.g. a width." },
  ],
  preview: { component: Demo, cardScale: 0.82, height: 360 },
});
