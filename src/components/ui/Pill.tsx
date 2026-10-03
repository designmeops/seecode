import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { toHref } from "../../lib/router";
import { focusRing } from "./Button";

const pillClass =
  "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full border border-line bg-panel px-2 text-[11.5px] leading-none font-medium text-ink-2";

/** A Linear-style label: optional colored dot plus text. */
export function Pill({
  dot,
  children,
  className,
}: {
  dot?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(pillClass, className)}>
      {dot && <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} />}
      {children}
    </span>
  );
}

export function TagPill({ tag, className }: { tag: string; className?: string }) {
  return (
    <a
      href={toHref({ name: "tag", tag })}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        pillClass,
        "transition-colors hover:border-line-strong hover:text-ink",
        focusRing,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-ink-4/60" />
      {tag}
    </a>
  );
}

export function NewBadge({ label = "New", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center rounded-[5px] bg-brand-soft px-1.5 text-[11px] leading-none font-medium text-brand",
        className,
      )}
    >
      {label}
    </span>
  );
}
