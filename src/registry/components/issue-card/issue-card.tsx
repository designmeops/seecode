import type { HTMLAttributes, SVGProps } from "react";

export type IssueStatus = "backlog" | "todo" | "in-progress" | "in-review" | "done" | "canceled";
export type IssuePriority = "none" | "urgent" | "high" | "medium" | "low";
export type IssueLabelColor = "zinc" | "rose" | "amber" | "emerald" | "sky" | "indigo" | "violet";

export interface IssueLabel {
  name: string;
  color?: IssueLabelColor;
}

export type IssueCardProps = Omit<HTMLAttributes<HTMLElement>, "id" | "title"> & {
  /** Issue identifier, e.g. `ENG-142`. */
  id: string;
  title: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  labels?: IssueLabel[];
  /** Assignee's full name — rendered as an initials avatar. */
  assignee?: string;
  /** A `Date` or an ISO date such as `2026-10-12`. */
  dueDate?: Date | string;
  comments?: number;
  /** Turns the whole card into a link to the issue. */
  href?: string;
};

const STATUS_LABEL: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
  canceled: "Canceled",
};

const STATUS_COLOR: Record<IssueStatus, string> = {
  backlog: "text-zinc-400",
  todo: "text-zinc-400",
  "in-progress": "text-amber-400",
  "in-review": "text-emerald-500",
  done: "text-indigo-500",
  canceled: "text-zinc-400",
};

const PRIORITY_LABEL: Record<IssuePriority, string> = {
  none: "No priority",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const LABEL_DOT: Record<IssueLabelColor, string> = {
  zinc: "bg-zinc-400",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
};

const AVATAR_GRADIENTS = [
  "from-indigo-400 to-violet-600",
  "from-sky-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-pink-600",
  "from-fuchsia-400 to-purple-600",
];

const dueFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function IssueCard({
  id,
  title,
  status = "todo",
  priority = "none",
  labels = [],
  assignee,
  dueDate,
  comments = 0,
  href,
  className = "",
  ...props
}: IssueCardProps) {
  const due = dueDate ? toDate(dueDate) : null;

  return (
    <article
      className={`relative w-75 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-[0_1px_2px_rgb(24_24_27/0.04)] transition-[translate,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_1px_2px_rgb(24_24_27/0.04),0_10px_24px_-10px_rgb(24_24_27/0.18)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
      {...props}
    >
      <div className="flex h-5 items-center justify-between gap-3">
        <IssueId id={id} />
        {assignee && <Avatar name={assignee} />}
      </div>

      <div className="mt-1.5 flex items-start gap-2">
        <IssueStatusIcon status={status} className="mt-[3px] size-3.5 shrink-0" />
        <h3 className="line-clamp-2 text-sm/5 font-medium tracking-tight text-zinc-900">
          {href ? (
            // The pseudo-element stretches the link over the whole card.
            <a href={href} className="outline-hidden after:absolute after:inset-0 after:rounded-xl">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          title={`Priority: ${PRIORITY_LABEL[priority]}`}
          className="inline-flex size-5 items-center justify-center rounded-md border border-zinc-200 text-zinc-500"
        >
          <PriorityIcon priority={priority} className="size-3.5" />
          <span className="sr-only">Priority: {PRIORITY_LABEL[priority]}</span>
        </span>

        {labels.map((label) => (
          <span
            key={label.name}
            className="inline-flex h-5 items-center gap-1.5 rounded-full border border-zinc-200 px-2 text-xs font-medium text-zinc-600"
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${LABEL_DOT[label.color ?? "zinc"]}`}
            />
            {label.name}
          </span>
        ))}

        {due && (
          <span className="inline-flex h-5 items-center gap-1 rounded-md border border-zinc-200 px-1.5 text-xs font-medium tabular-nums text-zinc-600">
            <CalendarIcon className="size-3 text-zinc-400" />
            <span className="sr-only">Due </span>
            <time dateTime={toIsoDate(due)}>{dueFormat.format(due)}</time>
          </span>
        )}

        {comments > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium tabular-nums text-zinc-500">
            <CommentIcon className="size-3.5" />
            {comments}
            <span className="sr-only">{comments === 1 ? " comment" : " comments"}</span>
          </span>
        )}
      </div>
    </article>
  );
}

/** Linear-style status glyph. Exported so column headers can reuse it. */
export function IssueStatusIcon({
  status,
  className = "",
  ...props
}: SVGProps<SVGSVGElement> & { status: IssueStatus }) {
  const progress = status === "in-progress" ? 0.5 : status === "in-review" ? 0.75 : 0;
  // A thick stroke on a small circle draws a pie slice: dash length = share of the circumference.
  const pie = 2 * Math.PI * 3.5;

  return (
    <svg
      role="img"
      aria-label={STATUS_LABEL[status]}
      viewBox="0 0 24 24"
      fill="none"
      className={`${STATUS_COLOR[status]} ${className}`}
      {...props}
    >
      {status === "done" || status === "canceled" ? (
        <>
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path
            d={
              status === "done" ? "M7.75 12.25 10.5 15l5.75-6" : "m8.75 8.75 6.5 6.5m0-6.5-6.5 6.5"
            }
            stroke="white"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeDasharray={status === "backlog" ? "3.5 3.96" : undefined}
          />
          {progress > 0 && (
            <circle
              cx="12"
              cy="12"
              r="3.5"
              stroke="currentColor"
              strokeWidth={7}
              strokeDasharray={`${pie * progress} ${pie}`}
              transform="rotate(-90 12 12)"
            />
          )}
        </>
      )}
    </svg>
  );
}

function PriorityIcon({ priority, className }: { priority: IssuePriority; className?: string }) {
  if (priority === "urgent") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={`text-orange-500 ${className}`}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" />
        <path d="M12 7v6" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx="12" cy="16.75" r="1.5" fill="white" />
      </svg>
    );
  }
  if (priority === "none") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={`text-zinc-400 ${className}`}>
        <path
          d="M4 12h3m3.5 0h3m3.5 0h3"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  const filled = priority === "high" ? 3 : priority === "medium" ? 2 : 1;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`text-zinc-700 ${className}`}>
      {[
        { x: 3, y: 13, h: 8 },
        { x: 10, y: 8, h: 13 },
        { x: 17, y: 3, h: 18 },
      ].map((bar, index) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width="4"
          height={bar.h}
          rx="1.25"
          fill="currentColor"
          fillOpacity={index < filled ? 1 : 0.22}
        />
      ))}
    </svg>
  );
}

/** Tabular digits keep ids aligned; the prefix keeps normal spacing (tabular hyphens look gappy). */
function IssueId({ id }: { id: string }) {
  const match = /^(.*?)(\d+)$/.exec(id);
  return (
    <span className="text-xs font-medium text-zinc-500">
      {match ? (
        <>
          {match[1]}
          <span className="tabular-nums">{match[2]}</span>
        </>
      ) : (
        id
      )}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = (
    parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
  // FNV-1a: the same name always gets the same gradient.
  let hash = 2166136261;
  for (let i = 0; i < name.length; i++) hash = Math.imul(hash ^ name.charCodeAt(i), 16777619);
  const gradient = AVATAR_GRADIENTS[(hash >>> 0) % AVATAR_GRADIENTS.length];

  return (
    <span
      role="img"
      aria-label={`Assigned to ${name}`}
      title={name}
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${gradient} text-[9px] font-semibold tracking-tight text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]`}
    >
      {initials}
    </span>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M8 3v4m8-4v4M3.5 10.5h17" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-11.06 6.6L4 19.5l1.4-4.45A7.5 7.5 0 1 1 20 11.5Z" />
    </svg>
  );
}

/** Parses `YYYY-MM-DD` as a local date so it never shifts a day across time zones. */
function toDate(value: Date | string): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
