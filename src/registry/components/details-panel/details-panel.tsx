"use client";

import { Fragment, type HTMLAttributes, type ReactNode, useId } from "react";

export type DetailIcon =
  | "library"
  | "globe"
  | "light-bulb"
  | "document-report"
  | "currency-dollar"
  | "globe-stand";

export interface DetailProperty {
  label: string;
  icon?: DetailIcon;
  /** Text, or a list of strings shown as chips. */
  value: string | string[];
  /** Turns a text value into a link that opens in a new tab. */
  href?: string;
}

export interface DetailLink {
  /** Button label, e.g. "View in Salesforce". */
  label: string;
  href: string;
  /** Logo shown before the label, e.g. an <img> or <svg> about 18px tall. */
  logo?: ReactNode;
}

export interface DetailsPanelProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  /** Panel heading. */
  title?: string;
  properties: DetailProperty[];
  /** Called when "Add a property" is pressed. */
  onAddProperty?: () => void;
  /** Buttons that open the record in other apps. */
  links?: DetailLink[];
}

const icons: Record<DetailIcon | "buildings" | "plus" | "external", string[]> = {
  buildings: [
    "M3 21l18 0",
    "M5 21v-14l8 -4v18",
    "M19 21v-10l-6 -4",
    "M9 9l0 .01",
    "M9 12l0 .01",
    "M9 15l0 .01",
    "M9 18l0 .01",
  ],
  library: ["M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"],
  globe: [
    "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
  ],
  "light-bulb": [
    "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  ],
  "document-report": [
    "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  ],
  "currency-dollar": [
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  ],
  "globe-stand": [
    "M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
    "M5.75 15a8.015 8.015 0 1 0 9.25 -13",
    "M11 17v4",
    "M7 21h8",
  ],
  plus: ["M12 4v16m8-8H4"],
  external: ["M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"],
};

/** Hairline shadow used on chips and buttons in the design. */
const shadow =
  "shadow-[0_0.5px_0.5px_0.25px_rgb(154_157_166/0.03),0_1.4px_1.4px_-0.7px_rgb(44_51_69/0.04)]";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2867ef]";

export function DetailsPanel({
  title = "Company details",
  properties,
  onAddProperty,
  links = [],
  className = "",
  ...props
}: DetailsPanelProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={`flex flex-col gap-4 rounded-br-md bg-white py-6 text-sm font-medium tracking-[-0.03em] ${className}`}
      {...props}
    >
      <h2
        id={titleId}
        className="flex items-center gap-2 px-6 text-base/[normal] tracking-[-0.02em] text-[#17171b]"
      >
        <Icon paths={icons.buildings} className="text-[#6b6b77]" />
        {title}
      </h2>

      {/* The add button shares the label column, so subgrid keeps both columns aligned. */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 px-6">
        <dl className="col-span-2 grid grid-cols-subgrid gap-y-2">
          {properties.map((property) => (
            <Fragment key={property.label}>
              <dt className="flex h-7 items-center gap-2 whitespace-nowrap text-[#6b6b77]">
                {property.icon && <Icon paths={icons[property.icon]} />}
                {property.label}
              </dt>
              <dd className="flex min-h-7 min-w-0 items-center text-[#17171b]">
                <Value {...property} />
              </dd>
            </Fragment>
          ))}
        </dl>
        <button
          type="button"
          onClick={onAddProperty}
          className={`col-start-1 flex h-7 items-center gap-2 justify-self-start rounded-md whitespace-nowrap text-[#17171b] transition-colors hover:text-[#2867ef] ${focusRing}`}
        >
          <Icon paths={icons.plus} strokeWidth={2} className="text-[#2867ef]" />
          Add a property
        </button>
      </div>

      {links.length > 0 && (
        <div className="mt-2 flex gap-3 px-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`group flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-[rgb(178_178_191/0.15)] bg-linear-to-b from-white/0 to-white px-3 text-[#17171b] hover:from-[#fafafa] hover:to-[#fafafa] ${shadow} ${focusRing}`}
            >
              {link.logo}
              <span className="truncate">{link.label}</span>
              <Icon
                paths={icons.external}
                className="text-[#c6c6d1] transition-colors group-hover:text-[#6b6b77]"
              />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function Value({ value, href }: DetailProperty) {
  if (Array.isArray(value)) {
    return (
      <ul className="flex flex-wrap gap-2">
        {value.map((chip) => (
          <li
            key={chip}
            className={`flex h-7 items-center rounded-md border-[0.5px] border-[#f4f4fb] bg-white px-2 text-[#6b6b77] ${shadow}`}
          >
            {chip}
          </li>
        ))}
      </ul>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`flex min-w-0 items-center gap-2 rounded-sm text-[#2867ef] underline-offset-2 hover:underline ${focusRing}`}
      >
        <span className="truncate">{value}</span>
        <Icon paths={icons.external} />
      </a>
    );
  }
  return <span className="truncate">{value}</span>;
}

function Icon({
  paths,
  className = "",
  strokeWidth = 1.5,
}: {
  paths: string[];
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
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
