import type { ReactNode } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "./dropdown-menu";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export default function DropdownMenuDemo() {
  return (
    // Leaves room below the trigger so the open menu fits the preview.
    <div className="h-56 w-56">
      <DropdownMenu label="Actions" defaultOpen>
        <DropdownMenuItem
          shortcut="⌘E"
          icon={
            <Icon>
              <path d="M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16v4Z" />
              <path d="m13.5 6.5 4 4" />
            </Icon>
          }
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          shortcut="⌘D"
          icon={
            <Icon>
              <rect x="8" y="8" width="12" height="12" rx="2.5" />
              <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
            </Icon>
          }
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          shortcut="⌘⇧C"
          icon={
            <Icon>
              <path d="M10 14a4.5 4.5 0 0 0 6.36 0l3-3a4.5 4.5 0 0 0-6.36-6.36l-1 1" />
              <path d="M14 10a4.5 4.5 0 0 0-6.36 0l-3 3a4.5 4.5 0 0 0 6.36 6.36l1-1" />
            </Icon>
          }
        >
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          icon={
            <Icon>
              <rect x="3" y="4" width="18" height="5" rx="1.5" />
              <path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4" />
            </Icon>
          }
        >
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          destructive
          shortcut="⌘⌫"
          icon={
            <Icon>
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </Icon>
          }
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}
