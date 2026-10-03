import { useState, type ReactNode } from "react";
import { Tooltip } from "./tooltip";

type Tool = { id: string; label: string; shortcut: string; toggle?: boolean; icon: ReactNode };

const marks: Tool[] = [
  {
    id: "bold",
    label: "Bold",
    shortcut: "⌘B",
    toggle: true,
    icon: <path d="M7 5h5.5a3.5 3.5 0 0 1 0 7H7V5Zm0 7h6.5a3.5 3.5 0 0 1 0 7H7v-7Z" />,
  },
  {
    id: "italic",
    label: "Italic",
    shortcut: "⌘I",
    toggle: true,
    icon: <path d="M10 5h8M6 19h8M14.5 5l-5 14" />,
  },
  {
    id: "strike",
    label: "Strikethrough",
    shortcut: "⌘⇧X",
    toggle: true,
    icon: (
      <path d="M4 12h16M16.5 7.5C16 6 14.5 5 12.3 5 9.6 5 7.7 6.3 7.7 8.3c0 1 .5 1.9 1.5 2.5M8 16.5c.6 1.6 2.2 2.5 4.4 2.5 2.7 0 4.6-1.3 4.6-3.3 0-.7-.2-1.2-.6-1.7" />
    ),
  },
];

const inserts: Tool[] = [
  { id: "code", label: "Inline code", shortcut: "⌘E", icon: <path d="m8 8-4 4 4 4m8-8 4 4-4 4" /> },
  {
    id: "link",
    label: "Link",
    shortcut: "⌘K",
    icon: (
      <path d="M10 14a4.5 4.5 0 0 0 6.36 0l3-3a4.5 4.5 0 0 0-6.36-6.36l-1 1M14 10a4.5 4.5 0 0 0-6.36 0l-3 3a4.5 4.5 0 0 0 6.36 6.36l1-1" />
    ),
  },
];

export default function TooltipDemo() {
  const [pressed, setPressed] = useState<string[]>(["bold"]);

  const button = (tool: Tool) => (
    <Tooltip
      key={tool.id}
      content={tool.label}
      shortcut={tool.shortcut}
      defaultOpen={tool.id === "strike"}
    >
      <button
        type="button"
        aria-label={tool.label}
        aria-pressed={tool.toggle ? pressed.includes(tool.id) : undefined}
        onClick={() =>
          tool.toggle &&
          setPressed((ids) =>
            ids.includes(tool.id) ? ids.filter((id) => id !== tool.id) : [...ids, tool.id],
          )
        }
        className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 aria-pressed:bg-zinc-100 aria-pressed:text-zinc-900"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          {tool.icon}
        </svg>
      </button>
    </Tooltip>
  );

  return (
    // Top padding keeps the open tooltip inside the preview.
    <div className="pt-12">
      <div
        role="group"
        aria-label="Text formatting"
        className="flex items-center gap-0.5 rounded-xl border border-zinc-200 bg-white p-1 shadow-xs"
      >
        {marks.map(button)}
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-zinc-200" />
        {inserts.map(button)}
      </div>
    </div>
  );
}
