import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./loading-button.tsx?raw";

export default defineComponent({
  slug: "loading-button",
  name: "Async Button",
  description: "Runs an async action and morphs through loading, success and error states without shifting width.",
  category: "buttons",
  tags: ["animated", "status", "accessible"],
  author: "seecode",
  createdAt: "2026-04-14",
  updatedAt: "2026-08-30",
  version: "1.1.0",
  files: [{ name: "loading-button.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "children", type: "ReactNode", description: "Idle label." },
    {
      name: "onClick",
      type: "(event) => Promise<unknown> | void",
      description:
        "Click handler. Return a promise to show the loading state, then success when it resolves or error when it rejects.",
    },
    { name: "loadingText", type: "ReactNode", default: '"Saving…"', description: "Label while pending." },
    { name: "successText", type: "ReactNode", default: '"Saved"', description: "Label after the promise resolves." },
    {
      name: "errorText",
      type: "ReactNode",
      default: '"Try again"',
      description: "Label after the promise rejects. The error state stays until the next click.",
    },
    {
      name: "resetAfter",
      type: "number",
      default: "1600",
      description: "Milliseconds the success state is shown before returning to idle.",
    },
    { name: "className", type: "string", description: "Extra classes merged onto the button." },
    {
      name: "...props",
      type: "ButtonHTMLAttributes",
      description: "Any other native button attribute, such as type or disabled.",
    },
  ],
  preview: { component: Demo },
});
