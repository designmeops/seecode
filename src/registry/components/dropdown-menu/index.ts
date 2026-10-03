import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./dropdown-menu.tsx?raw";

export default defineComponent({
  slug: "dropdown-menu",
  name: "Dropdown Menu",
  description:
    "An accessible menu button with icons, shortcut hints, typeahead and full arrow-key navigation.",
  category: "overlays",
  tags: ["keyboard", "accessible", "overlay"],
  author: "seecode",
  createdAt: "2026-06-24",
  updatedAt: "2026-09-18",
  version: "1.1.0",
  files: [{ name: "dropdown-menu.tsx", language: "tsx", code: source }],
  usage,
  props: [
    { name: "label", type: "ReactNode", description: "Content of the trigger button." },
    {
      name: "children",
      type: "ReactNode",
      description: "DropdownMenuItem and DropdownMenuSeparator elements.",
    },
    {
      name: "align",
      type: '"start" | "end"',
      default: '"start"',
      description: "Edge of the trigger the menu lines up with.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      description:
        "Starts open without moving focus (for previews). Outside clicks dismiss it once the user interacts.",
    },
    { name: "open", type: "boolean", description: "Controlled open state." },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Called whenever the menu opens or closes.",
    },
    {
      name: "triggerClassName / menuClassName",
      type: "string",
      description: "Extra classes for the trigger button and the menu panel.",
    },
    {
      name: "DropdownMenuItem.icon",
      type: "ReactNode",
      description: "Leading 24×24 SVG icon, sized to 16px.",
    },
    {
      name: "DropdownMenuItem.shortcut",
      type: "string",
      description: "Right-aligned hint such as ⌘E; also exposed as aria-keyshortcuts.",
    },
    {
      name: "DropdownMenuItem.onSelect",
      type: "() => void",
      description: "Runs on click, Enter or Space, then the menu closes and focus returns.",
    },
    {
      name: "DropdownMenuItem.destructive",
      type: "boolean",
      default: "false",
      description: "Rose styling for irreversible actions such as Delete.",
    },
    {
      name: "DropdownMenuItem.disabled",
      type: "boolean",
      default: "false",
      description: "Dimmed, skipped by arrow keys and typeahead, and can't be chosen.",
    },
  ],
  preview: { component: Demo, cardScale: 0.82, height: 360 },
});
