import type { HTMLAttributes, ReactNode, SVGProps } from "react";

export type IssueStatus = "backlog" | "todo" | "in-progress" | "in-review" | "done" | "canceled";

export const statusLabels: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
  canceled: "Canceled",
};

const statusColors: Record<IssueStatus, string> = {
  backlog: "text-zinc-400",
  todo: "text-zinc-400",
  "in-progress": "text-amber-500",
  "in-review": "text-emerald-500",
  done: "text-indigo-500",
  canceled: "text-zinc-400",
};

// A pie of radius 6 drawn as a circle of radius 3 with a 6-wide stroke,
// filled clockwise from 12 o'clock by `fraction`.
const PIE_LENGTH = 2 * Math.PI * 3;
function pie(fraction: number) {
  return (
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeDasharray={`${PIE_LENGTH * fraction} ${PIE_LENGTH}`}
      transform="rotate(-90 12 12)"
    />
  );
}

const ring = <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.5" />;

const glyphs: Record<IssueStatus, ReactNode> = {
  backlog: (
    <circle
      cx="12"
      cy="12"
      r="9.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="3.4 2.57"
      transform="rotate(-80 12 12)"
    />
  ),
  todo: ring,
  "in-progress": (
    <>
      {ring}
      {pie(0.5)}
    </>
  ),
  "in-review": (
    <>
      {ring}
      {pie(0.75)}
    </>
  ),
  done: (
    <>
      <circle cx="12" cy="12" r="10.75" fill="currentColor" />
      <path
        d="m7.75 12.25 2.75 2.75 5.75-6"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  canceled: (
    <>
      <circle cx="12" cy="12" r="10.75" fill="currentColor" />
      <path
        d="m8.75 8.75 6.5 6.5m0-6.5-6.5 6.5"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  ),
};

export type StatusIconProps = SVGProps<SVGSVGElement> & { status: IssueStatus };

/** The status glyph on its own, e.g. for dense tables or menus. */
export function StatusIcon({ status, className = "", ...props }: StatusIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-3.5 shrink-0 ${statusColors[status]} ${className}`}
      {...props}
    >
      {glyphs[status]}
    </svg>
  );
}

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: IssueStatus;
  /** Hide the text and expose it as the accessible name instead. */
  iconOnly?: boolean;
  /** Overrides the default label, e.g. a custom workflow state name. */
  label?: string;
};

export function StatusBadge({
  status,
  iconOnly = false,
  label,
  className = "",
  ...props
}: StatusBadgeProps) {
  const text = label ?? statusLabels[status];

  if (iconOnly) {
    return (
      <span
        role="img"
        aria-label={text}
        title={text}
        className={`inline-grid size-6 place-items-center rounded-md ${className}`}
        {...props}
      >
        <StatusIcon status={status} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full bg-white pr-2.5 pl-2 text-xs font-medium whitespace-nowrap text-zinc-700 shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.04)] ${className}`}
      {...props}
    >
      <StatusIcon status={status} />
      {text}
    </span>
  );
}
