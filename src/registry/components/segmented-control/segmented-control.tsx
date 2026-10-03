"use client";

import { type HTMLAttributes, type KeyboardEvent, type ReactNode, useRef, useState } from "react";

export type SegmentedControlOption = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  options: SegmentedControlOption[];
  /** Selected value, for controlled usage. */
  value?: string;
  /** Value selected on first render when uncontrolled. Defaults to the first enabled option. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  /** Adds a hidden input so the value is submitted with a form. */
  name?: string;
};

const sizes = {
  sm: "h-6 gap-1 px-2.5 text-xs [&_svg]:size-3.5",
  md: "h-7 gap-1.5 px-3 text-[13px] [&_svg]:size-4",
};

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  name,
  className = "",
  ...props
}: SegmentedControlProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? options.find((option) => !option.disabled)?.value,
  );
  const selectedValue = value ?? uncontrolledValue;
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const focusableIndex =
    selectedIndex >= 0 ? selectedIndex : options.findIndex((option) => !option.disabled);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (value === undefined) setUncontrolledValue(option.value);
    if (option.value !== selectedValue) onValueChange?.(option.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    let next = -1;
    if (step !== 0) {
      // Walk in the pressed direction, wrapping around and skipping disabled options.
      for (let i = 1; i <= options.length; i++) {
        const candidate = (index + step * i + options.length) % options.length;
        if (!options[candidate].disabled) {
          next = candidate;
          break;
        }
      }
    } else if (event.key === "Home") {
      next = options.findIndex((option) => !option.disabled);
    } else if (event.key === "End") {
      for (let i = options.length - 1; i >= 0 && next < 0; i--) {
        if (!options[i].disabled) next = i;
      }
    } else {
      return;
    }
    event.preventDefault();
    if (next < 0) return;
    select(next);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      className={`relative inline-grid auto-cols-fr grid-flow-col rounded-lg bg-zinc-100 p-0.5 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)] ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0.5 left-0.5 rounded-md bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.08),0_2px_6px_-2px_rgb(0_0_0/0.08)] transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
          selectedIndex < 0 ? "opacity-0" : ""
        }`}
        style={{
          width: `calc((100% - 4px) / ${Math.max(options.length, 1)})`,
          transform: `translateX(${Math.max(selectedIndex, 0) * 100}%)`,
        }}
      />
      {options.map((option, index) => {
        const checked = index === selectedIndex;
        return (
          <button
            key={option.value}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={index === focusableIndex ? 0 : -1}
            disabled={option.disabled}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`relative inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 ${sizes[size]} ${
              checked ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
      {name !== undefined && <input type="hidden" name={name} value={selectedValue ?? ""} />}
    </div>
  );
}
