import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./testimonial-card.tsx?raw";

export default defineComponent({
  slug: "testimonial-card",
  name: "Testimonial Card",
  description:
    "A customer quote card with a star rating, a highlighted key phrase and an initials avatar.",
  category: "marketing",
  tags: ["social-proof", "minimal"],
  author: "orbit",
  createdAt: "2026-09-30",
  version: "1.0.0",
  files: [{ name: "testimonial-card.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "quote", type: "string", description: "The testimonial text, without quote marks." },
    {
      name: "highlight",
      type: "string",
      description: "A phrase from the quote to emphasise with a soft marker highlight.",
    },
    {
      name: "rating",
      type: "number",
      default: "5",
      description: "Stars out of 5 (rounded), announced as “Rated 5 out of 5”.",
    },
    {
      name: "author",
      type: "{ name: string; role: string; company: string; logo?: ReactNode }",
      description:
        "Who said it. The name becomes a gradient initials avatar; logo is a tiny glyph.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the <figure> root, e.g. className.",
    },
  ],
  preview: { component: Demo, cardScale: 0.56, height: 360 },
});
