import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./upload-progress.tsx?raw";

export default defineComponent({
  slug: "upload-progress",
  name: "Upload Progress",
  description:
    "A file upload card with per-file progress bars, overall progress, and retry for failed files.",
  category: "feedback",
  tags: ["status", "feedback", "data"],
  author: "halftone",
  createdAt: "2026-06-17",
  version: "1.0.0",
  files: [{ name: "upload-progress.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "files",
      type: '{ id: string; name: string; size: number; progress: number; status: "uploading" | "complete" | "failed"; error?: string }[]',
      description: "Files to list. size is in bytes, progress runs from 0 to 100.",
    },
    {
      name: "title",
      type: "ReactNode",
      description:
        'Replaces the automatic heading ("Uploading 3 files", "1 upload failed", "3 files uploaded").',
    },
    {
      name: "onRetry",
      type: "(id: string) => void",
      description: "Shows a Retry button on failed rows.",
    },
    {
      name: "onCancel",
      type: "(id: string) => void",
      description: "Shows a cancel button on rows still uploading.",
    },
    {
      name: "className",
      type: "string",
      description: "Extra classes merged onto the card, e.g. a width.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Any other native attribute for the card element.",
    },
  ],
  preview: { component: Demo, cardScale: 0.7 },
});
