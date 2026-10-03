import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./tag-input.tsx?raw";

export default defineComponent({
  slug: "tag-input",
  name: "Tag Input",
  description: "A chips field: Enter or comma adds a tag, Backspace removes the last, and duplicates are ignored.",
  category: "inputs",
  tags: ["form", "keyboard", "interactive"],
  author: "meadow",
  createdAt: "2026-09-22",
  version: "1.0.0",
  files: [{ name: "tag-input.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "value", type: "string[]", description: "Controlled tags. Pair with onChange." },
    { name: "defaultValue", type: "string[]", default: "[]", description: "Initial tags when uncontrolled." },
    {
      name: "onChange",
      type: "(tags: string[]) => void",
      description: "Called with the full list whenever a tag is added or removed.",
    },
    { name: "placeholder", type: "string", default: '"Add tag…"', description: "Text input placeholder." },
    {
      name: "maxTags",
      type: "number",
      default: "Infinity",
      description: "Stops accepting new tags once the list reaches this length.",
    },
    {
      name: "name",
      type: "string",
      description: "Submits the tags with a form as one comma-separated value.",
    },
    { name: "className", type: "string", description: "Classes for the field wrapper." },
    {
      name: "...props",
      type: "InputHTMLAttributes",
      description: "Passed to the text input, e.g. id, aria-describedby or disabled.",
    },
  ],
  preview: { component: Demo, cardScale: 0.9 },
});
