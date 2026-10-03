import { Fragment, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { MOD } from "../../lib/platform";

const LABELS: Record<string, string> = {
  mod: MOD,
  shift: "⇧",
  alt: "⌥",
  enter: "↵",
  escape: "Esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
};

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-line bg-subtle px-1 font-sans text-[11px] leading-none font-medium text-ink-3 shadow-[inset_0_-1px_0_var(--color-line)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** Renders a binding such as `mod+k` or the sequence `g e` as key caps. */
export function Shortcut({ keys, className }: { keys: string; className?: string }) {
  const steps = keys.split(" ");
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {steps.map((step, index) => (
        <Fragment key={step + index}>
          {index > 0 && <span className="text-[11px] text-ink-4">then</span>}
          {step.split("+").map((key) => (
            <Kbd key={key}>{LABELS[key.toLowerCase()] ?? key.toUpperCase()}</Kbd>
          ))}
        </Fragment>
      ))}
    </span>
  );
}
