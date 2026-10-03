import { defineComponent } from "../../define";
import nextjs from "./app-sidebar.tsx?raw";
import framer from "./app-sidebar.framer.tsx?raw";
import webflow from "./app-sidebar.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "app-sidebar",
  name: "App Sidebar",
  description:
    "Dark app sidebar with a workspace header, New chat button, collapsible nav groups, onboarding progress and the user.",
  category: "navigation",
  tags: ["sidebar", "navigation", "menu", "dark"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  featured: true,
  formats: {
    nextjs: { name: "app-sidebar.tsx", language: "tsx", code: nextjs },
    framer: { name: "AppSidebar.tsx", language: "tsx", code: framer },
    webflow: { name: "app-sidebar.html", language: "html", code: webflow },
  },
  usage,
  props: [
    {
      name: "workspace",
      type: "{ name: string; logoUrl?: string }",
      description: "Workspace in the header. Without a logo a neutral mark is shown.",
    },
    {
      name: "items",
      type: "AppSidebarItem[]",
      description:
        "{ label, icon?, href?, active?, children?, defaultOpen? }. Items with children are groups that expand and collapse.",
    },
    {
      name: "progress",
      type: "{ label: string; completed: number; total: number; href?: string }",
      description: 'Checklist above the user, e.g. "Getting started 2/5" with a progress ring.',
    },
    {
      name: "user",
      type: "{ name: string; email: string; avatarUrl?: string }",
      description: "Signed-in user. Without a photo the avatar shows the first initial.",
    },
    {
      name: "newChatLabel",
      type: "string",
      default: '"New chat"',
      description: "Label of the primary button.",
    },
    {
      name: "historyLabel",
      type: "string",
      default: '"Chat History"',
      description: "Label of the history link.",
    },
    {
      name: "historyHref",
      type: "string",
      default: '"#"',
      description: "Where the history link goes.",
    },
    { name: "onNewChat", type: "() => void", description: "Called when New chat is pressed." },
    {
      name: "onCollapse",
      type: "() => void",
      description: "Called by the panel button in the header.",
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the <aside>; set its height here.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.75, height: 1056, width: 218 },
});
