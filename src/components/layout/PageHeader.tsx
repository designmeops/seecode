import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { openDialog } from "../../lib/state";
import { IconButton } from "../ui/Button";

/**
 * The single top bar of every page, like Linear's: title, views, filters and
 * actions all live here. It wraps onto a second row on narrow screens.
 */
export function PageHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header
      className={cn(
        "flex min-h-12 shrink-0 flex-wrap items-center gap-x-2 gap-y-2 border-b border-line-subtle px-2 py-2 sm:px-3 lg:pl-4",
        className,
      )}
    >
      {children}
    </header>
  );
}

/** Opens the sidebar drawer below the `lg` breakpoint. */
export function NavigationButton() {
  return (
    <IconButton
      label="Open navigation"
      className="lg:hidden"
      onClick={() => openDialog("navigation")}
    >
      <Menu size={16} strokeWidth={1.9} />
    </IconButton>
  );
}

export function HeaderDivider({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("mx-1 h-4 w-px shrink-0 bg-line", className)} />;
}
