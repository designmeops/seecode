"use client";

import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

export type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value" | "defaultChecked"
> & {
  /** Controlled state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label. Clicking it toggles the switch. */
  label?: ReactNode;
  /** Secondary text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  size?: "sm" | "md";
};

const sizes = {
  sm: { track: "h-4 w-7", thumb: "size-3 group-aria-checked:translate-x-3" },
  md: { track: "h-5 w-9", thumb: "size-4 group-aria-checked:translate-x-4" },
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  size = "md",
  disabled,
  id,
  className = "",
  onClick,
  ...props
}: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isOn = checked ?? uncontrolled;
  const fallbackId = useId();
  const switchId = id ?? fallbackId;
  const descriptionId = `${switchId}-description`;
  const hasText = label != null || description != null;

  // A native <button> already toggles on click, Space and Enter.
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (checked === undefined) setUncontrolled(!isOn);
    onCheckedChange?.(!isOn);
  }

  const control = (
    <button
      type="button"
      role="switch"
      id={switchId}
      aria-checked={isOn}
      aria-describedby={description != null ? descriptionId : undefined}
      disabled={disabled}
      onClick={handleClick}
      className={`group inline-flex shrink-0 cursor-pointer items-center rounded-full bg-zinc-200 p-0.5 shadow-[inset_0_1px_2px_rgb(9_9_11/0.08)] transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 enabled:hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 aria-checked:bg-indigo-600 aria-checked:enabled:hover:bg-indigo-500 ${sizes[size].track} ${hasText ? "" : className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none block rounded-full bg-white shadow-[0_1px_2px_rgb(9_9_11/0.2),0_0_0_0.5px_rgb(9_9_11/0.04)] transition-transform duration-200 ease-[cubic-bezier(0.3,0.7,0.4,1.2)] motion-reduce:transition-none ${sizes[size].thumb}`}
      />
    </button>
  );

  if (!hasText) return control;

  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className={`grid gap-0.5 ${disabled ? "opacity-60" : ""}`}>
        {label != null && (
          <label
            htmlFor={switchId}
            className={`text-sm/5 font-medium text-zinc-900 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {label}
          </label>
        )}
        {description != null && (
          <p id={descriptionId} className="text-[13px]/5 text-zinc-500">
            {description}
          </p>
        )}
      </div>
      <div className="flex h-5 items-center">{control}</div>
    </div>
  );
}
