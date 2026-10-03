import { defineComponent } from "../../define";
import source from "./alert-callout.tsx?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";

export default defineComponent({
  slug: "alert-callout",
  name: "Alert Callout",
  description:
    "Inline callouts in four tones with an icon, title, link-style action and optional dismiss.",
  category: "feedback",
  tags: ["status", "feedback", "accessible"],
  author: "meadow",
  createdAt: "2026-04-08",
  version: "1.0.0",
  files: [{ name: "alert-callout.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "variant",
      type: '"info" | "success" | "warning" | "danger"',
      default: '"info"',
      description: 'Color and icon. Warning and danger use role="alert", the others role="status".',
    },
    { name: "title", type: "ReactNode", description: "Bold first line." },
    { name: "children", type: "ReactNode", description: "Description shown under the title." },
    {
      name: "action",
      type: "{ label: string; href?: string; onClick?: () => void }",
      description: "Link-style action after the description. Renders an anchor when href is set.",
    },
    {
      name: "dismissible",
      type: "boolean",
      default: "false",
      description: "Shows a dismiss button. The alert hides itself, then calls onDismiss.",
    },
    { name: "onDismiss", type: "() => void", description: "Called after the alert is dismissed." },
    {
      name: "icon",
      type: "ReactNode | null",
      description: "Replaces the variant icon. Pass null to hide it.",
    },
    { name: "className", type: "string", description: "Extra classes merged onto the alert." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Any other native attribute, including role to override the default.",
    },
  ],
  preview: { component: Demo, cardScale: 0.8 },
});
