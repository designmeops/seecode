import { AppSidebar, type AppSidebarItem } from "./app-sidebar";

const items: AppSidebarItem[] = [
  {
    label: "Email",
    icon: "mail",
    children: [
      { label: "Campaigns", href: "/email/campaigns" },
      { label: "Templates", href: "/email/templates" },
      { label: "Automations", href: "/email/automations" },
    ],
  },
  {
    label: "Web",
    icon: "globe",
    children: [
      { label: "Pages", href: "/web/pages" },
      { label: "Forms", href: "/web/forms" },
      { label: "Pop-ups", href: "/web/pop-ups" },
    ],
  },
  { label: "Assets", icon: "photo", href: "/assets" },
  { label: "Journey", icon: "map", href: "/journey" },
  { label: "Blog", icon: "book", href: "/blog" },
  { label: "Brand", icon: "palette", href: "/brand" },
  {
    label: "Audience",
    icon: "chart",
    children: [
      { label: "Dashboard", href: "/audience" },
      { label: "People", href: "/audience/people" },
      { label: "Companies", href: "/audience/companies", active: true },
      { label: "Segments", href: "/audience/segments" },
      { label: "Session Replay", href: "/audience/replays" },
    ],
  },
  {
    label: "Commerce",
    icon: "cart",
    children: [
      { label: "Products", href: "/commerce/products" },
      { label: "Orders", href: "/commerce/orders" },
      { label: "Discounts", href: "/commerce/discounts" },
    ],
  },
  {
    label: "Settings",
    icon: "settings",
    children: [
      { label: "General", href: "/settings" },
      { label: "Members", href: "/settings/members" },
      { label: "Billing", href: "/settings/billing" },
    ],
  },
];

export default function AppSidebarDemo() {
  return (
    <AppSidebar
      workspace={{ name: "Acme Workspace" }}
      items={items}
      progress={{ label: "Getting started", completed: 2, total: 5, href: "/onboarding" }}
      user={{ name: "Alex Morgan", email: "alex@acme.studio" }}
      historyHref="/chats"
      className="h-[960px]"
    />
  );
}
