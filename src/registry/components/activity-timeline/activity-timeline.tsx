import type { HTMLAttributes, ReactNode } from "react";

export type ActivityTone = "zinc" | "indigo" | "sky" | "emerald" | "amber" | "rose";

export type ActivityEvent = {
  id: string;
  /** Comments show the actor's avatar on the line; other types show an icon. */
  type: "comment" | "status" | "assign" | "label" | "create" | "commit";
  actor: string;
  /** Muted verb phrase, e.g. "changed the status to". */
  action: string;
  /** Bold object of the sentence, e.g. an issue id or a person. */
  target?: ReactNode;
  /** Small chip after the sentence, e.g. the new status or a label. */
  chip?: { label: string; tone?: ActivityTone };
  /** Quoted body, shown in a box under the sentence. */
  comment?: ReactNode;
  time: Date | string | number;
};

export type ActivityTimelineProps = HTMLAttributes<HTMLOListElement> & {
  events: ActivityEvent[];
  /** Reference time for relative timestamps. Defaults to the time of render. */
  now?: Date | number;
};

const dotTones: Record<ActivityTone, string> = {
  zinc: "bg-zinc-400",
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const iconTones: Record<ActivityTone, string> = {
  zinc: "text-zinc-400",
  indigo: "text-indigo-500",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const gradients = [
  "from-indigo-400 to-indigo-600",
  "from-sky-400 to-sky-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-violet-400 to-violet-600",
  "from-teal-400 to-teal-600",
  "from-zinc-400 to-zinc-600",
];

const icons: Record<Exclude<ActivityEvent["type"], "comment">, ReactNode> = {
  status: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7a5 5 0 0 1 0 10Z" fill="currentColor" stroke="none" />
    </>
  ),
  assign: (
    <>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 19.5a6.5 6.5 0 0 1 11.5-4.2M18.5 14v6M15.5 17h6" />
    </>
  ),
  label: (
    <>
      <path d="M3.5 12.1V4.5a1 1 0 0 1 1-1h7.6l8.4 8.4a1.5 1.5 0 0 1 0 2.1l-6.5 6.5a1.5 1.5 0 0 1-2.1 0Z" />
      <path d="M8 8h.01" />
    </>
  ),
  create: <path d="M12 5v14M5 12h14" />,
  commit: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M3 12h5.5M15.5 12H21" />
    </>
  ),
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "")
  ).toUpperCase();
}

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return gradients[hash % gradients.length];
}

function relativeTime(date: Date, now: number) {
  const seconds = Math.round((now - date.getTime()) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EventNode({ event }: { event: ActivityEvent }) {
  if (event.type === "comment") {
    return (
      <span
        aria-hidden="true"
        className={`relative grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br text-[9px] font-semibold text-white ring-4 ring-white ${gradientFor(event.actor)}`}
      >
        {initials(event.actor)}
      </span>
    );
  }
  const tone = event.type === "status" ? iconTones[event.chip?.tone ?? "zinc"] : "text-zinc-500";
  return (
    <span
      aria-hidden="true"
      className="relative grid size-6 shrink-0 place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_0_0_4px_white]"
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-3.5 ${tone}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[event.type]}
      </svg>
    </span>
  );
}

export function ActivityTimeline({ events, now, className = "", ...props }: ActivityTimelineProps) {
  const reference = now === undefined ? Date.now() : new Date(now).getTime();

  return (
    <ol className={`text-sm ${className}`} {...props}>
      {events.map((event, index) => {
        const date = new Date(event.time);
        const valid = !Number.isNaN(date.getTime());
        return (
          <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < events.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-3 -bottom-3 left-3 w-px -translate-x-1/2 bg-zinc-200"
              />
            )}
            <EventNode event={event} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <p className="min-w-0 flex-1 leading-6 text-zinc-500">
                  <span className="font-medium text-zinc-900">{event.actor}</span> {event.action}
                  {event.target !== undefined && (
                    <>
                      {" "}
                      <span className="font-medium text-zinc-900">{event.target}</span>
                    </>
                  )}
                  {event.chip && (
                    <>
                      {" "}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 align-[1px] text-xs leading-5 font-medium whitespace-nowrap text-zinc-700 shadow-[0_0_0_1px_rgb(0_0_0/0.08)]">
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${dotTones[event.chip.tone ?? "zinc"]}`}
                        />
                        {event.chip.label}
                      </span>
                    </>
                  )}
                </p>
                {valid && (
                  <time
                    dateTime={date.toISOString()}
                    title={date.toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    suppressHydrationWarning
                    className="shrink-0 text-xs leading-6 whitespace-nowrap text-zinc-400 tabular-nums"
                  >
                    {relativeTime(date, reference)}
                  </time>
                )}
              </div>
              {event.comment && (
                <div className="mt-2 rounded-lg bg-white px-3 py-2 leading-5 text-zinc-700 shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.04)]">
                  {event.comment}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
