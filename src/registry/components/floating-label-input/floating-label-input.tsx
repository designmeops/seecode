"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

export type FloatingLabelInputProps = Omit<ComponentProps<"input">, "size"> & {
  /** Sits inside the field and floats up on focus or once there is a value. */
  label: ReactNode;
  /** Helper text below the field. Replaced by `error` when both are set. */
  hint?: ReactNode;
  /** Error message. Turns the field rose and sets `aria-invalid`. */
  error?: ReactNode;
};

export function FloatingLabelInput({
  label,
  hint,
  error,
  id,
  type = "text",
  placeholder = " ",
  className = "",
  "aria-describedby": describedBy,
  ...props
}: FloatingLabelInputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const messageId = `${inputId}-message`;
  const invalid = error != null && error !== false && error !== "";
  const message = invalid ? error : hint;

  return (
    <div className={`grid gap-1.5 ${className}`}>
      <div className="relative">
        {/*
          The label is a later sibling of the input, so `peer-*` variants can move it.
          A placeholder is required for `:placeholder-shown`; it stays hidden until focus.
        */}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={[message ? messageId : "", describedBy ?? ""].join(" ").trim() || undefined}
          className="peer block h-14 w-full rounded-lg border border-zinc-300 bg-white px-3 pt-[1.375rem] pb-1.5 text-sm text-zinc-950 shadow-xs outline-hidden transition-[border-color,box-shadow] duration-150 placeholder:text-transparent hover:border-zinc-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 aria-invalid:border-rose-400 aria-invalid:hover:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/15"
          {...props}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute top-[1.125rem] left-3 max-w-[calc(100%-1.5rem)] origin-top-left truncate text-sm/5 text-zinc-500 transition duration-150 ease-out peer-focus:-translate-y-2.5 peer-focus:scale-[0.8125] peer-focus:text-indigo-600 peer-not-placeholder-shown:-translate-y-2.5 peer-not-placeholder-shown:scale-[0.8125] peer-disabled:text-zinc-400 peer-aria-invalid:text-rose-600"
        >
          {label}
        </label>
      </div>
      {message ? (
        <p
          id={messageId}
          className={`flex items-start gap-1.5 text-xs/4 ${invalid ? "text-rose-600" : "text-zinc-500"}`}
        >
          {invalid && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7.5v5M12 16.25v.25" />
            </svg>
          )}
          {message}
        </p>
      ) : null}
    </div>
  );
}
