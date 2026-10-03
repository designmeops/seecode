import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./confirm-dialog.tsx?raw";

export default defineComponent({
  slug: "confirm-dialog",
  name: "Confirm Dialog",
  description:
    "A destructive confirmation modal that unlocks its delete button once the project name is typed.",
  category: "overlays",
  tags: ["overlay", "form", "accessible", "keyboard"],
  author: "orbit",
  createdAt: "2026-07-22",
  version: "1.0.0",
  files: [{ name: "confirm-dialog.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "trigger",
      type: "ReactElement",
      description:
        "Button that opens the dialog. Its onClick and ref are kept; focus returns to it.",
    },
    {
      name: "confirmText",
      type: "string",
      description: "What the user must type to enable the confirm button, e.g. the project name.",
    },
    {
      name: "title",
      type: "ReactNode",
      default: '"Delete project"',
      description: "Dialog heading.",
    },
    {
      name: "description",
      type: "ReactNode",
      description: "Explains what will be lost; wired up as aria-describedby.",
    },
    {
      name: "onConfirm",
      type: "() => void | Promise<void>",
      description:
        "Runs on confirm. A promise shows a pending state; the dialog closes on resolve.",
    },
    {
      name: "confirmLabel / pendingLabel / cancelLabel",
      type: "ReactNode",
      default: '"Delete project" / "Deleting…" / "Cancel"',
      description: "Button labels.",
    },
    { name: "open", type: "boolean", description: "Controlled open state." },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Start open without moving focus or locking scroll — for previews and docs.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Called when the dialog opens or closes.",
    },
  ],
  preview: { component: Demo, cardScale: 0.6, height: 440 },
});
