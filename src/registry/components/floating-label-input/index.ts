import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./floating-label-input.tsx?raw";

export default defineComponent({
  slug: "floating-label-input",
  name: "Floating Label Input",
  description: "A text field whose label rests inside it and floats up on focus, with hint and error states.",
  category: "inputs",
  tags: ["form", "validation", "accessible"],
  author: "halftone",
  createdAt: "2026-03-18",
  version: "1.0.0",
  files: [{ name: "floating-label-input.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "label", type: "ReactNode", description: "Label that rests inside the field and floats up." },
    { name: "hint", type: "ReactNode", description: "Helper text shown below the field." },
    {
      name: "error",
      type: "ReactNode",
      description: "Error message. Replaces the hint, turns the field rose and sets aria-invalid.",
    },
    {
      name: "id",
      type: "string",
      default: "useId()",
      description: "Input id used to link the label and message. Generated when omitted.",
    },
    {
      name: "placeholder",
      type: "string",
      description: "Optional example value, shown only while the field is focused and empty.",
    },
    { name: "className", type: "string", description: "Classes for the wrapper, e.g. a width." },
    {
      name: "...props",
      type: "ComponentProps<\"input\">",
      description: "Any native input attribute, including ref, value, onChange and type.",
    },
  ],
  preview: { component: Demo, cardScale: 0.9 },
});
