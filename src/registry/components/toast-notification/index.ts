import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./toast-notification.tsx?raw";

export default defineComponent({
  slug: "toast-notification",
  name: "Toast Notifications",
  description:
    "A tiny toast system: stacked, animated toasts that pause on hover, with variants and actions.",
  category: "feedback",
  tags: ["animated", "feedback", "accessible", "status"],
  author: "seecode",
  createdAt: "2026-04-21",
  updatedAt: "2026-09-02",
  version: "1.2.0",
  files: [{ name: "toast-notification.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "ToastProvider",
      type: "component",
      description: "Wrap your app once. Renders the fixed toast viewport next to its children.",
    },
    {
      name: "position",
      type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
      default: '"bottom-right"',
      description: "Provider prop: corner the stack grows from.",
    },
    {
      name: "duration",
      type: "number",
      default: "4000",
      description: "Provider prop: default auto-dismiss delay in ms.",
    },
    {
      name: "limit",
      type: "number",
      default: "3",
      description: "Provider prop: most toasts shown at once; the oldest closes first.",
    },
    {
      name: "label",
      type: "string",
      default: '"Notifications"',
      description: "Provider prop: accessible name of the region.",
    },
    {
      name: "useToast()",
      type: "{ toast, dismiss, toasts }",
      description:
        "Hook for any component inside the provider. toast() returns the new toast's id.",
    },
    {
      name: "toast(options)",
      type: "ToastOptions | string",
      description:
        '{ title, description?, variant?: "info" | "success" | "warning" | "error", duration?, action?: { label, onClick }, id? }. Reusing an id updates that toast.',
    },
    {
      name: "dismiss(id?)",
      type: "(id?: string) => void",
      description: "Closes one toast, or every toast when called without an id.",
    },
  ],
  preview: { component: Demo, height: 400 },
});
