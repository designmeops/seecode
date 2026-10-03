import { defineComponent } from "../../define";
import nextjs from "./record-header.tsx?raw";
import framer from "./record-header.framer.tsx?raw";
import webflow from "./record-header.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "record-header",
  name: "Record Header",
  description: "A record's logo, name, favorite star and website, with Edit and Delete actions.",
  category: "headers",
  tags: ["crm", "header", "actions", "favorite"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  formats: {
    nextjs: { name: "record-header.tsx", language: "tsx", code: nextjs },
    framer: { name: "RecordHeader.tsx", language: "tsx", code: framer },
    webflow: { name: "record-header.html", language: "html", code: webflow },
  },
  usage,
  props: [
    { name: "name", type: "string", description: "Record name, shown as the page heading." },
    {
      name: "logo",
      type: "string",
      description: "Logo image URL. Without one, a gradient mark is shown.",
    },
    {
      name: "website",
      type: "string",
      description: 'Shown without its protocol and opened in a new tab, e.g. "www.acme.studio".',
    },
    {
      name: "favorite",
      type: "boolean",
      description: "Favorite state. Leave it out to let the star keep its own state.",
    },
    {
      name: "defaultFavorite",
      type: "boolean",
      default: "false",
      description: "Initial state when favorite isn't set.",
    },
    {
      name: "onFavoriteChange",
      type: "(favorite: boolean) => void",
      description: "Called with the new state when the star is pressed.",
    },
    { name: "onEdit", type: "() => void", description: "Called when Edit is pressed." },
    { name: "onDelete", type: "() => void", description: "Called when Delete is pressed." },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the header element.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.63, height: 220, width: 1412 },
});
