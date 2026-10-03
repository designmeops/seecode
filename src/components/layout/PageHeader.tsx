import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { openDialog } from "../../lib/state";
import { IconButton } from "../ui/Button";

export function PageHeader({
  children,
  actions,
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b border-line-subtle pr-2 pl-2 sm:pr-3 lg:pl-4",
        className,
      )}
    >
      <IconButton
        label="Open navigation"
        className="lg:hidden"
        onClick={() => openDialog("navigation")}
      >
        <Menu size={16} strokeWidth={1.9} />
      </IconButton>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </header>
  );
}
