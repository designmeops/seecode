import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./otp-input.tsx?raw";

export default defineComponent({
  slug: "otp-input",
  name: "OTP Input",
  description:
    "A one-time code field with separate digit boxes, paste and SMS autofill, and full keyboard support.",
  category: "inputs",
  tags: ["form", "keyboard", "validation"],
  author: "orbit",
  createdAt: "2026-05-06",
  version: "1.0.0",
  files: [{ name: "otp-input.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "length", type: "number", default: "6", description: "Number of digit boxes." },
    {
      name: "onChange",
      type: "(code: string) => void",
      description: "Called on every edit with the digits entered so far.",
    },
    {
      name: "onComplete",
      type: "(code: string) => void",
      description: "Called when every box is filled, e.g. to verify the code.",
    },
    {
      name: "status",
      type: '"idle" | "success" | "error"',
      default: '"idle"',
      description: "Colors the boxes emerald or rose. Error also sets aria-invalid.",
    },
    {
      name: "separator",
      type: "boolean",
      default: "true",
      description: "Shows a dash between the two halves of the code.",
    },
    { name: "disabled", type: "boolean", default: "false", description: "Disables every box." },
    {
      name: "name",
      type: "string",
      description: "Submits the joined code with a form under this name.",
    },
    {
      name: "aria-label",
      type: "string",
      default: '"One-time code"',
      description: "Accessible name of the group. Each box is labelled “Digit n of length”.",
    },
    { name: "className", type: "string", description: "Classes for the row of boxes." },
  ],
  preview: { component: Demo, cardScale: 0.7 },
});
