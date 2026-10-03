import type { ButtonHTMLAttributes } from "react";

export type ShimmerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const keyframes = `
@keyframes shimmer-button-sweep {
  0% { transform: translateX(-120%) skewX(-20deg); }
  60%, 100% { transform: translateX(320%) skewX(-20deg); }
}`;

export function ShimmerButton({
  className = "",
  children,
  type = "button",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      type={type}
      className={`group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full bg-zinc-950 px-5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(0_0_0/0.3),0_4px_12px_-2px_rgb(24_24_27/0.35)] transition duration-200 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {/* React 19 hoists and de-duplicates this, so the file stays self-contained. */}
      <style href="shimmer-button" precedence="default">
        {keyframes}
      </style>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent animate-[shimmer-button-sweep_2.8s_ease-in-out_infinite] motion-reduce:hidden"
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
