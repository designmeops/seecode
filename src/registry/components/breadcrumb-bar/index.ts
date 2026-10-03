import { defineComponent } from "../../define";
import nextjs from "./breadcrumb-bar.tsx?raw";
import framer from "./breadcrumb-bar.framer.tsx?raw";
import webflow from "./breadcrumb-bar.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "breadcrumb-bar",
  name: "Breadcrumb Bar",
  description:
    "A white top bar with a breadcrumb trail; the last item is marked as the current page.",
  category: "navigation",
  tags: ["breadcrumb", "navigation", "header"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  formats: {
    nextjs: { name: "breadcrumb-bar.tsx", language: "tsx", code: nextjs },
    framer: { name: "BreadcrumbBar.tsx", language: "tsx", code: framer },
    webflow: { name: "breadcrumb-bar.html", language: "html", code: webflow },
  },
  usage,
  props: [
    {
      name: "items",
      type: "{ label: string; href?: string }[]",
      description:
        'The trail from the top level down. The last item is the current page (aria-current="page").',
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the <header> bar.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 1, height: 260, width: 720 },
});
