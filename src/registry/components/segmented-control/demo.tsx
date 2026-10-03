"use client";

import { useState } from "react";
import { SegmentedControl } from "./segmented-control";

function Icon({ d }: { d: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const views = [
  { value: "list", label: "List", icon: <Icon d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /> },
  { value: "board", label: "Board", icon: <Icon d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8 7v7M12 7v4M16 7v9" /> },
  { value: "timeline", label: "Timeline", icon: <Icon d="M3 3v16a2 2 0 0 0 2 2h16M8 7h6M11 12h7M9 17h5" /> },
];

const captions: Record<string, string> = {
  list: "as a list",
  board: "on a board",
  timeline: "on a timeline",
};

export default function SegmentedControlDemo() {
  const [view, setView] = useState("board");

  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentedControl
        aria-label="Issue view"
        options={views}
        value={view}
        onValueChange={setView}
      />
      <p className="text-xs text-zinc-500">
        Showing <span className="font-medium text-zinc-900 tabular-nums">24 issues</span>{" "}
        {captions[view]}
      </p>
    </div>
  );
}
