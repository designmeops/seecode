import { Tooltip as RadixTooltip } from "radix-ui";
import type { ReactNode } from "react";
import { Shortcut } from "./Kbd";

interface TooltipProps {
  label: ReactNode;
  /** Binding to display, e.g. `mod+k` or `g e`. */
  shortcut?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  children: ReactNode;
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={450} skipDelayDuration={250}>
      {children}
    </RadixTooltip.Provider>
  );
}

export function Tooltip({
  label,
  shortcut,
  side = "bottom",
  align = "center",
  children,
}: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className="z-[70] flex items-center gap-2 rounded-md border border-line bg-raised px-2 py-1 text-[12px] font-medium text-ink-2 shadow-pop data-[state=delayed-open]:animate-pop-in data-[state=instant-open]:animate-pop-in"
        >
          {label}
          {shortcut && <Shortcut keys={shortcut} />}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
