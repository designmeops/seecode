import type { ButtonHTMLAttributes } from "react";

export type GradientBorderButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const keyframes = `
@keyframes gradient-border-button-spin {
  from { rotate: 0deg; }
  to { rotate: 360deg; }
}`;

/**
 * An oversized square painted with the conic gradient. It spins behind the button and is
 * clipped by its rounded parent, so only a thin ring (or the blurred glow) shows.
 */
const aurora =
  "absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_in_oklch,var(--color-indigo-500),var(--color-fuchsia-500),var(--color-amber-400),var(--color-indigo-500))] animate-[gradient-border-button-spin_4s_linear_infinite] motion-reduce:animate-none";

export function GradientBorderButton({
  className = "",
  children,
  type = "button",
  ...props
}: GradientBorderButtonProps) {
  return (
    <button
      type={type}
      className={`group relative isolate inline-flex cursor-pointer rounded-full transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {/* React 19 hoists and de-duplicates this, so the file stays self-contained. */}
      <style href="gradient-border-button" precedence="default">
        {keyframes}
      </style>
      {/* Soft glow: a blurred copy of the gradient that fades in on hover and focus. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-0.5 -z-10 overflow-hidden rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60 group-focus-visible:opacity-60"
      >
        <span className={aurora} />
      </span>
      {/* Border: 1.5px of padding reveals the spinning gradient around the white surface. */}
      <span className="relative flex overflow-hidden rounded-full p-[1.5px] shadow-[0_1px_2px_rgb(24_24_27/0.08),0_2px_8px_-2px_rgb(99_102_241/0.18)]">
        <span aria-hidden="true" className={aurora} />
        <span className="relative inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-4.5 text-sm font-medium text-zinc-900">
          {children}
        </span>
      </span>
    </button>
  );
}
