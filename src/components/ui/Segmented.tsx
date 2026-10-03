import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { focusRing } from "./Button";

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex rounded-md border border-line-subtle bg-muted p-0.5", className)}
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const index = options.findIndex((option) => option.value === value);
        const step = event.key === "ArrowRight" ? 1 : -1;
        const next = options[(index + step + options.length) % options.length];
        onChange(next.value);
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
        buttons[options.indexOf(next)]?.focus();
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-6 flex-1 items-center justify-center gap-1.5 rounded-[5px] px-2 text-[12px] font-medium whitespace-nowrap transition-colors",
              focusRing,
              selected
                ? "bg-panel text-ink shadow-[0_1px_2px_rgb(16_17_26/0.08),0_0_0_1px_rgb(16_17_26/0.04)]"
                : "text-ink-3 hover:text-ink-2",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
