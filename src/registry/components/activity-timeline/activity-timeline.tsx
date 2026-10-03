"use client";

import { Fragment, type HTMLAttributes } from "react";

export type ActivityIcon = "eye" | "mail" | "click" | "map" | "confetti";

/** Gradient behind a person's initials when they have no photo. */
export type AvatarColor = "blue" | "red" | "green" | "gray";

export interface ActivityPerson {
  name: string;
  /** Photo URL. Without one, the initials show on a gradient. */
  avatarUrl?: string;
  /** Gradient for the initials avatar. Defaults to "gray". */
  color?: AvatarColor;
}

/** One piece of an event's sentence: plain text, a person, a chip or a link chip. */
export type ActivitySegment =
  | string
  | ({ type: "person" } & ActivityPerson)
  | { type: "chip"; label: string }
  | { type: "link"; label: string; href: string };

export interface ActivityEvent {
  icon: ActivityIcon;
  /** The sentence in reading order. */
  segments: ActivitySegment[];
  /** Formatted time, e.g. "9:12 AM". */
  time: string;
  /** Machine-readable timestamp, e.g. "2025-05-06T09:12". */
  dateTime?: string;
}

export interface ActivityGroup {
  /** Day heading, e.g. "Today, May 06, 2025". */
  label: string;
  events: ActivityEvent[];
}

export interface ActivityTimelineProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title"
> {
  title?: string;
  /** Formatted range on the button, e.g. "Jan 20, 2023 - May 08, 2025". Omit to hide the button. */
  dateRange?: string;
  groups: ActivityGroup[];
  /** Called when the date-range button is pressed. */
  onDateRangeClick?: () => void;
}

const icons = {
  trendingUp: ["M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"],
  calendar: [
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  ],
  chevronDown: ["M19 9l-7 7-7-7"],
};

/** 12px event icons: Heroicons v1 solid (20px grid), Heroicons v1 outline map, Tabler filled confetti. */
const eventIcons: Record<
  ActivityIcon,
  { viewBox: string; fillRule?: "evenodd" | "nonzero"; paths: string[] }
> = {
  eye: {
    viewBox: "0 0 20 20",
    fillRule: "evenodd",
    paths: [
      "M10 12a2 2 0 100-4 2 2 0 000 4z",
      "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
    ],
  },
  mail: {
    viewBox: "0 0 20 20",
    fillRule: "evenodd",
    paths: [
      "M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z",
    ],
  },
  click: {
    viewBox: "0 0 20 20",
    fillRule: "evenodd",
    paths: [
      "M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z",
    ],
  },
  map: {
    viewBox: "0 0 24 24",
    paths: [
      "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    ],
  },
  confetti: {
    viewBox: "0 0 24 24",
    fillRule: "nonzero",
    paths: [
      "M3 5a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 1 1 -2 0a1 1 0 0 1 -1 -1m7.53 -1.243a1 1 0 1 1 1.94 .486l-.5 2a1 1 0 1 1 -1.94 -.486zm6.47 1.243a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 0 1 -2 0a1 1 0 0 1 -1 -1m-8.81 4.293l6.517 6.518a1 1 0 0 1 -.29 1.617l-9.573 4.387a2 2 0 0 1 -2.661 -2.652l4.39 -9.58a1 1 0 0 1 1.616 -.29m7.517 -1a1 1 0 0 1 0 1.414l-1 1a1 1 0 0 1 -1.414 -1.414l1 -1a1 1 0 0 1 1.414 0m4.05 3.237a1 1 0 0 1 .486 1.94l-2 .5a1 1 0 0 1 -.486 -1.94zm-2.756 7.47a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 0 1 -2 0a1 1 0 0 1 -1 -1",
    ],
  },
};

/** Two soft color blobs over a vertical gradient, matching the design's placeholder avatars. */
const avatarColors: Record<AvatarColor, string> = {
  blue: "bg-[radial-gradient(71%_71%_at_-15%_21%,rgb(214_156_237/0.43),rgb(214_156_237/0)),radial-gradient(82%_82%_at_94%_20%,rgb(255_156_52/0.38),rgb(255_156_52/0)),linear-gradient(#f1a7df,#4642ec)]",
  red: "bg-[radial-gradient(107%_107%_at_90%_-7%,rgb(247_159_255),rgb(247_159_255/0)),radial-gradient(113%_113%_at_66%_99%,rgb(245_40_47/0.94),rgb(245_40_47/0)),linear-gradient(#fffcf7,#f7608a)]",
  green:
    "bg-[radial-gradient(116%_116%_at_121%_-12%,rgb(138_147_255/0.69),rgb(138_147_255/0)),radial-gradient(69%_69%_at_150%_100%,rgb(191_224_142/0.74),rgb(191_224_142/0)),linear-gradient(#aff6df,#38b372)]",
  gray: "bg-[radial-gradient(71%_71%_at_-15%_21%,rgb(222_222_236/0.5),rgb(222_222_236/0)),radial-gradient(82%_82%_at_94%_20%,rgb(240_240_247/0.45),rgb(240_240_247/0)),linear-gradient(#c6c6d1,#6b6b77)]",
};

/** Hairline shadow used on chips and buttons in the design. */
const shadow =
  "shadow-[0_0.5px_0.5px_0.25px_rgb(154_157_166/0.03),0_1.4px_1.4px_-0.7px_rgb(44_51_69/0.04)]";

const chip = `flex h-8 max-w-full min-w-0 items-center rounded-md border-[0.5px] border-[#f4f4fb] bg-white px-2 text-[#6b6b77] ${shadow}`;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2867ef]";

export function ActivityTimeline({
  title = "Activity",
  dateRange,
  groups,
  onDateRangeClick,
  className = "",
  ...props
}: ActivityTimelineProps) {
  return (
    <section
      className={`flex flex-col gap-6 bg-white p-6 text-sm leading-[normal] font-medium tracking-[-0.03em] text-[#17171b] ${className}`}
      {...props}
    >
      <header className="flex min-h-9 flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base leading-[19px] tracking-[-0.02em]">
          <Icon paths={icons.trendingUp} className="text-[#c6c6d1]" />
          {title}
        </h2>
        {dateRange && (
          <button
            type="button"
            onClick={onDateRangeClick}
            className={`flex h-9 items-center gap-2 rounded-lg border border-[#f4f4fb] bg-white px-[11px] whitespace-nowrap transition-colors hover:bg-[#fafafa] ${shadow} ${focusRing}`}
          >
            <Icon paths={icons.calendar} className="text-[#c6c6d1]" />
            <span className="sr-only">Date range: </span>
            {dateRange}
            <Icon paths={icons.chevronDown} size={16} className="text-[#c6c6d1] opacity-50" />
          </button>
        )}
      </header>

      {groups.map((group, index) => (
        <section key={`${group.label}-${index}`} className="flex flex-col gap-6">
          <h3 className="flex items-center gap-6 text-[#6b6b77]">
            {group.label}
            <span aria-hidden="true" className="h-px flex-1 bg-[#f4f4fb]" />
          </h3>
          <ol className="flex flex-col">
            {group.events.map((event, eventIndex) => (
              <EventRow key={eventIndex} event={event} />
            ))}
          </ol>
        </section>
      ))}
    </section>
  );
}

function EventRow({ event }: { event: ActivityEvent }) {
  const Time = event.dateTime ? "time" : "span";
  return (
    // Between events, a 1.5px line runs under the icon, 5px clear of each row.
    <li className="relative flex gap-3 not-last:pb-9 not-last:after:absolute not-last:after:top-[37px] not-last:after:bottom-[5px] not-last:after:left-[15.25px] not-last:after:w-[1.5px] not-last:after:bg-[#c6c6d1]">
      <span className="mt-0.5 flex h-7 w-8 shrink-0 items-center justify-center text-[#9292a6]">
        <EventIcon icon={event.icon} />
      </span>
      <p className="flex min-h-8 min-w-0 flex-wrap items-center gap-2">
        {event.segments.map((segment, index) => (
          <Fragment key={index}>
            <Segment segment={segment} />{" "}
          </Fragment>
        ))}
        <span className="flex items-center gap-2 text-[#6b6b77]">
          <span aria-hidden="true" className="size-0.5 rounded-full bg-current" />
          <Time dateTime={event.dateTime}>{event.time}</Time>
        </span>
      </p>
    </li>
  );
}

function Segment({ segment }: { segment: ActivitySegment }) {
  if (typeof segment === "string") return <span>{segment}</span>;
  switch (segment.type) {
    case "person":
      return (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar {...segment} />
          {segment.name}
        </span>
      );
    case "chip":
      return (
        <span className={chip}>
          <span className="truncate">{segment.label}</span>
        </span>
      );
    case "link":
      return (
        <a
          href={segment.href}
          className={`${chip} transition-colors hover:bg-[#fafafa] hover:text-[#17171b] ${focusRing}`}
        >
          <span className="truncate">{segment.label}</span>
        </a>
      );
  }
}

function Avatar({ name, avatarUrl, color = "gray" }: ActivityPerson) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt="" className="size-8 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span
      aria-hidden="true"
      className={`flex size-8 shrink-0 items-center justify-center rounded-full shadow-[inset_0_1px_4px_rgb(255_255_255/0.3)] ${avatarColors[color] ?? avatarColors.gray}`}
    >
      <span className="bg-[linear-gradient(#fafafa_25%,rgb(255_255_255/0.5)_72.5%)] bg-clip-text font-[Geist,Inter,sans-serif] text-xs/5 font-semibold tracking-[-0.03em] text-transparent">
        {initials(name)}
      </span>
    </span>
  );
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words[words.length - 1] : "";
  return `${words[0]?.charAt(0) ?? ""}${last.charAt(0)}`.toUpperCase();
}

function EventIcon({ icon }: { icon: ActivityIcon }) {
  const { viewBox, fillRule, paths } = eventIcons[icon] ?? eventIcons.eye;
  const paint = fillRule
    ? { fill: "currentColor", fillRule }
    : {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
      };
  return (
    <svg aria-hidden="true" viewBox={viewBox} width={12} height={12} {...paint}>
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function Icon({
  paths,
  size = 18,
  className = "",
}: {
  paths: string[];
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
