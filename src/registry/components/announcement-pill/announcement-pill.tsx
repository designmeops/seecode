import type { AnchorHTMLAttributes, ReactNode } from "react";

export type AnnouncementPillProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Small badge before the text. Pass `null` to hide it. */
  tag?: ReactNode;
};

const keyframes = `
@keyframes announcement-pill-shine {
  from { translate: -100% 0; }
  to { translate: 420% 0; }
}`;

export function AnnouncementPill({
  tag = "New",
  children,
  className = "",
  ...props
}: AnnouncementPillProps) {
  return (
    <a
      className={`group relative inline-flex rounded-full bg-linear-to-b from-white/25 via-white/10 to-white/5 p-px shadow-[0_0_0_1px_rgb(0_0_0/0.4),0_8px_24px_-8px_rgb(99_102_241/0.35)] transition-[box-shadow,--tw-gradient-from] duration-200 hover:from-white/40 hover:shadow-[0_0_0_1px_rgb(0_0_0/0.4),0_8px_28px_-6px_rgb(99_102_241/0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400 ${className}`}
      {...props}
    >
      {/* React 19 hoists and de-duplicates this, so the file stays self-contained. */}
      <style href="announcement-pill" precedence="default">
        {keyframes}
      </style>
      <span className="relative inline-flex h-8 items-center gap-2.5 overflow-hidden rounded-full bg-zinc-950 pr-3 pl-1 text-sm text-zinc-300 transition-colors duration-200 group-hover:text-white">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full -skew-x-20 bg-linear-to-r from-transparent via-white/15 to-transparent group-hover:animate-[announcement-pill-shine_900ms_ease-out] motion-reduce:hidden"
        />
        {tag != null && (
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-200 inset-ring-1 inset-ring-indigo-400/30">
            {tag}
          </span>
        )}
        <span className="tracking-tight">{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-ml-0.5 size-3.5 text-zinc-500 transition-colors duration-200 group-hover:text-zinc-200"
        >
          {/* The stem fades in while the chevron slides right — a small "go" gesture. */}
          <path
            d="M5 12h13.5"
            className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
          />
          <path
            d="m9 6 6 6-6 6"
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </svg>
      </span>
    </a>
  );
}
