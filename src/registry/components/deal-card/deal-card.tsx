"use client";

import type { HTMLAttributes, ReactNode } from "react";

export type DealStatus = "pitching" | "lost" | "won";

export interface DealCardProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  status: DealStatus;
  /** Deal name. */
  name: string;
  /** Formatted deal value, e.g. "$100,000". */
  value: string;
  services?: string[];
  /** Formatted creation date, e.g. "May 9, 2025". */
  created: string;
  /** Called when the ⋮ menu button is pressed. */
  onMenuClick?: () => void;
}

const statuses: Record<DealStatus, { label: string; tone: string; icon: string[] }> = {
  pitching: {
    label: "Pitching",
    tone: "text-[#6b6b77]",
    icon: [
      "M3 4h18",
      "M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4",
      "M12 16v4",
      "M9 20h6",
      "m8 12 3-3 2 2 3-3",
    ],
  },
  lost: { label: "Lost", tone: "text-[#e00d29]", icon: ["m3 7 6 6 4-4 8 8", "M21 10v7h-7"] },
  won: { label: "Won", tone: "text-[#04bb6f]", icon: ["m3 17 6-6 4 4 8-8", "M14 7h7v7"] },
};

const icons = {
  name: ["M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"],
  value: [
    "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
  ],
  services: [
    "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  ],
  created: [
    "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  ],
  menu: [
    "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
  ],
};

/** Hairline shadow used on cards and chips in the design. */
const shadow =
  "shadow-[0_0.5px_0.5px_0.25px_rgb(154_157_166/0.03),0_1.4px_1.4px_-0.7px_rgb(44_51_69/0.04)]";

export function DealCard({
  status,
  name,
  value,
  services = [],
  created,
  onMenuClick,
  className = "",
  ...props
}: DealCardProps) {
  const { label, tone, icon } = statuses[status];

  return (
    <article
      className={`flex flex-col gap-4 overflow-hidden rounded-lg border border-[#f4f4fb] bg-white pt-2 pb-3 font-medium tracking-[-0.03em] ${shadow} ${className}`}
      {...props}
    >
      <header className="flex h-7 items-center justify-between pr-[19px] pl-6">
        <h3 className="flex items-center gap-2 text-sm text-[#17171b]">
          <Icon paths={icon} className={tone} />
          {label}
        </h3>
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={`${label} deal actions`}
          className="flex size-7 items-center justify-center rounded-md text-[#c6c6d1] transition-colors hover:bg-[#fafafa] hover:text-[#6b6b77] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2867ef]"
        >
          <Icon paths={icons.menu} />
        </button>
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 px-6 text-sm">
        <Property icon={icons.name} label="Name">
          {name}
        </Property>
        <Property icon={icons.value} label="Value">
          {value}
        </Property>
        <Property icon={icons.services} label="Services">
          {services.map((service) => (
            <span
              key={service}
              className={`flex h-7 items-center rounded-md border-[0.5px] border-[#f4f4fb] bg-white px-2 text-[#6b6b77] ${shadow}`}
            >
              {service}
            </span>
          ))}
        </Property>
        <Property icon={icons.created} label="Created">
          {created}
        </Property>
      </dl>
    </article>
  );
}

function Property({
  icon,
  label,
  children,
}: {
  icon: string[];
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="flex h-7 items-center gap-2 text-[#6b6b77]">
        <Icon paths={icon} />
        {label}
      </dt>
      <dd className="flex h-7 min-w-0 items-center gap-1.5 truncate text-[#17171b]">{children}</dd>
    </>
  );
}

function Icon({ paths, className = "" }: { paths: string[]; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-[18px] shrink-0 ${className}`}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
