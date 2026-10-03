"use client";

import { type ReactNode, useState } from "react";
import { Dock, type DockItem } from "./dock";

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const apps = [
  {
    id: "files",
    label: "Files",
    tileClassName: "bg-linear-to-b from-sky-400 to-blue-600",
    icon: <Glyph><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5Z" /></Glyph>,
  },
  {
    id: "mail",
    label: "Mail",
    tileClassName: "bg-linear-to-b from-indigo-400 to-indigo-600",
    icon: <Glyph><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 5.5 8-5.5" /></Glyph>,
  },
  {
    id: "messages",
    label: "Messages",
    tileClassName: "bg-linear-to-b from-emerald-400 to-emerald-600",
    icon: <Glyph><path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.6A7.5 7.5 0 1 1 20 11.5Z" /></Glyph>,
  },
  {
    id: "calendar",
    label: "Calendar",
    tileClassName: "bg-linear-to-b from-orange-400 to-rose-500",
    icon: <Glyph><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M16 3v4M8 3v4M3.5 10h17" /></Glyph>,
  },
  {
    id: "music",
    label: "Music",
    tileClassName: "bg-linear-to-b from-fuchsia-400 to-violet-600",
    icon: <Glyph><path d="M9 17.5V6l11-2v11.5" /><circle cx="6.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="15.5" r="2.5" /></Glyph>,
  },
] satisfies DockItem[];

const utilities = [
  {
    id: "downloads",
    label: "Downloads",
    tileClassName: "bg-linear-to-b from-cyan-400 to-sky-600",
    icon: <Glyph><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" /></Glyph>,
  },
  {
    id: "trash",
    label: "Trash",
    tileClassName: "bg-linear-to-b from-zinc-50 to-zinc-300 text-zinc-600",
    icon: <Glyph><path d="M4 7h16M10 11v5M14 11v5M6 7l1 11.5A2 2 0 0 0 9 20.5h6a2 2 0 0 0 2-2L18 7M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" /></Glyph>,
  },
] satisfies DockItem[];

export default function DockDemo() {
  const [open, setOpen] = useState(["files", "mail", "messages", "music"]);
  const launch = (id: string) => setOpen((ids) => (ids.includes(id) ? ids : [...ids, id]));
  const withState = (app: DockItem) => ({
    ...app,
    open: open.includes(app.id),
    onSelect: () => launch(app.id),
  });

  return (
    <div className="relative flex h-[200px] w-[460px] items-end justify-center overflow-hidden rounded-2xl bg-linear-to-br from-indigo-100 via-white to-sky-100 pb-3 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_8px_24px_-12px_rgb(0_0_0/0.15)]">
      <div aria-hidden="true" className="absolute -top-16 -left-10 size-56 rounded-full bg-indigo-300/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -top-20 right-0 size-56 rounded-full bg-rose-200/70 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-sky-200/80 blur-3xl" />
      <Dock items={[...apps.map(withState), "divider", ...utilities.map(withState)]} />
    </div>
  );
}
