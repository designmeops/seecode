import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./logo-marquee.tsx?raw";

export default defineComponent({
  slug: "logo-marquee",
  name: "Logo Marquee",
  description:
    "An endlessly scrolling row of customer wordmarks with soft edge fades that pauses on hover.",
  category: "marketing",
  tags: ["animated", "social-proof", "motion"],
  author: "meadow",
  createdAt: "2026-09-08",
  version: "1.0.0",
  files: [{ name: "logo-marquee.tsx", language: "tsx", code: source }],
  usage,
  props: [
    {
      name: "logos",
      type: "{ name: string; glyph?: ReactNode }[]",
      description: "Wordmarks to scroll. Provide enough to fill the container width at least once.",
    },
    {
      name: "speed",
      type: "number",
      default: "30",
      description: "Seconds per full loop — higher is slower.",
    },
    {
      name: "reverse",
      type: "boolean",
      default: "false",
      description: "Scroll left-to-right instead of right-to-left.",
    },
    {
      name: "pauseOnHover",
      type: "boolean",
      default: "true",
      description: "Pause the animation while the pointer is over the row.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "Passed to the clipping container (className, aria-label…).",
    },
  ],
  preview: { component: Demo, cardScale: 0.64, height: 360 },
});
