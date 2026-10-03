import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-line bg-card text-ink-3 shadow-card">
        <Icon size={19} strokeWidth={1.75} />
      </div>
      <h3 className="text-[14px] font-medium text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-mini text-ink-3">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
