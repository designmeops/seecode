import { defineComponent } from "../../define";
import nextjs from "./details-panel.tsx?raw";
import framer from "./details-panel.framer.tsx?raw";
import webflow from "./details-panel.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "details-panel",
  name: "Details Panel",
  description:
    "A record's properties as icon-labelled rows of text, links and chips, with links out to other apps.",
  category: "data-display",
  tags: ["crm", "properties", "details"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  formats: {
    nextjs: { name: "details-panel.tsx", language: "tsx", code: nextjs },
    framer: { name: "DetailsPanel.tsx", language: "tsx", code: framer },
    webflow: { name: "company-details.html", language: "html", code: webflow },
  },
  usage,
  props: [
    { name: "title", type: "string", default: '"Company details"', description: "Panel heading." },
    {
      name: "properties",
      type: "DetailProperty[]",
      description:
        "Rows of { label, icon?, value, href? }. A string[] value shows chips; href turns text into a link.",
    },
    {
      name: "properties[].icon",
      type: '"library" | "globe" | "light-bulb" | "document-report" | "currency-dollar" | "globe-stand"',
      description: "Icon before the label.",
    },
    {
      name: "onAddProperty",
      type: "() => void",
      description: 'Called when "Add a property" is pressed.',
    },
    {
      name: "links",
      type: "DetailLink[]",
      default: "[]",
      description:
        "Buttons to other apps: { label, href, logo? }. The logo is any node, e.g. an <img>.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the section element.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.76, height: 460, width: 470 },
});
