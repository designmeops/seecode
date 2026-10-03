import { defineComponent } from "../../define";
import nextjs from "./people-list.tsx?raw";
import framer from "./people-list.framer.tsx?raw";
import webflow from "./people-list.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "people-list",
  name: "People List",
  description:
    "A people table with avatars, names and emails; hover an email to reveal a copy-to-clipboard button.",
  category: "data-display",
  tags: ["people", "contacts", "table", "crm"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  formats: {
    nextjs: { name: "people-list.tsx", language: "tsx", code: nextjs },
    framer: { name: "PeopleList.tsx", language: "tsx", code: framer },
    webflow: { name: "people.html", language: "html", code: webflow },
  },
  usage,
  props: [
    { name: "title", type: "string", default: '"People"', description: "Section heading." },
    {
      name: "people",
      type: '{ name: string; email: string; avatarUrl?: string; color?: "blue" | "red" | "green" | "gray" }[]',
      description:
        "Rows in order. Without avatarUrl, the initials show on the color's gradient (gray by default).",
    },
    {
      name: "onCopy",
      type: "(email: string) => void",
      description: "Called after the copy button puts an address on the clipboard.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the section element.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.72, height: 500, width: 470 },
});
