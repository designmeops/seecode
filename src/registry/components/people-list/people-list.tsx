"use client";

import { type HTMLAttributes, useEffect, useRef, useState } from "react";

/** Gradient behind a person's initials when they have no photo. */
export type AvatarColor = "blue" | "red" | "green" | "gray";

export interface Person {
  name: string;
  email: string;
  /** Photo URL. Without one, the initials show on a gradient. */
  avatarUrl?: string;
  /** Gradient for the initials avatar. Defaults to "gray". */
  color?: AvatarColor;
}

export interface PeopleListProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title" | "onCopy"
> {
  title?: string;
  people: Person[];
  /** Called after an address is copied with the copy button. */
  onCopy?: (email: string) => void;
}

const icons = {
  buildings: [
    "M4 21v-15c0 -1 1 -2 2 -2h5c1 0 2 1 2 2v15",
    "M16 8h2c1 0 2 1 2 2v11",
    "M3 21h18",
    "M10 12v.01",
    "M10 16v.01",
    "M10 8v.01",
    "M7 12v.01",
    "M7 16v.01",
    "M7 8v.01",
    "M17 12v.01",
    "M17 16v.01",
  ],
  userCheck: ["M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", "M6 21v-2a4 4 0 0 1 4 -4h4", "M15 19l2 2l4 -4"],
  mailbox: [
    "M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5",
    "M12 11v-8h4l2 2l-2 2h-4",
    "M6 15h1",
  ],
  copy: [
    "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
    "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
  ],
  check: ["M5 12l5 5l10 -10"],
};

/** Two soft color blobs over a vertical gradient, matching the design's placeholder avatars. */
const avatarColors: Record<AvatarColor, string> = {
  blue: "bg-[radial-gradient(71%_71%_at_-15%_21%,rgb(214_156_237/0.43),rgb(214_156_237/0)),radial-gradient(82%_82%_at_94%_20%,rgb(255_156_52/0.38),rgb(255_156_52/0)),linear-gradient(#f1a7df,#4642ec)]",
  red: "bg-[radial-gradient(107%_107%_at_90%_-7%,rgb(247_159_255),rgb(247_159_255/0)),radial-gradient(113%_113%_at_66%_99%,rgb(245_40_47/0.94),rgb(245_40_47/0)),linear-gradient(#fffcf7,#f7608a)]",
  green:
    "bg-[radial-gradient(116%_116%_at_121%_-12%,rgb(138_147_255/0.69),rgb(138_147_255/0)),radial-gradient(69%_69%_at_150%_100%,rgb(191_224_142/0.74),rgb(191_224_142/0)),linear-gradient(#aff6df,#38b372)]",
  gray: "bg-[radial-gradient(71%_71%_at_-15%_21%,rgb(222_222_236/0.5),rgb(222_222_236/0)),radial-gradient(82%_82%_at_94%_20%,rgb(240_240_247/0.45),rgb(240_240_247/0)),linear-gradient(#c6c6d1,#6b6b77)]",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2867ef]";

export function PeopleList({
  title = "People",
  people,
  onCopy,
  className = "",
  ...props
}: PeopleListProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  async function copy(email: string) {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // Clipboard unavailable (e.g. not a secure context); the mailto link still works.
    }
    if (!mounted.current) return;
    setCopied(email);
    onCopy?.(email);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section
      className={`flex flex-col gap-4 bg-white p-6 text-sm leading-[normal] font-medium tracking-[-0.03em] text-[#17171b] ${className}`}
      {...props}
    >
      <h2 className="flex items-center gap-2 text-base leading-[19px] tracking-[-0.02em]">
        <Icon paths={icons.buildings} className="text-[#6b6b77]" />
        {title}
      </h2>

      {/* An ARIA table on a grid: the email column only shrinks (and truncates) when space runs out. */}
      <div
        role="table"
        aria-label={title}
        className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2"
      >
        <div role="row" className="col-span-2 mb-1 grid grid-cols-subgrid text-[#6b6b77]">
          <div role="columnheader" className="flex items-center gap-2">
            <Icon paths={icons.userCheck} />
            Name
          </div>
          <div role="columnheader" className="flex items-center gap-2">
            <Icon paths={icons.mailbox} />
            Email
          </div>
        </div>
        {people.map((person, index) => {
          const isCopied = copied === person.email;
          return (
            <div
              role="row"
              key={`${person.email}-${index}`}
              className="col-span-2 grid grid-cols-subgrid"
            >
              <div role="cell" className="flex items-center gap-3 whitespace-nowrap">
                <Avatar {...person} />
                {person.name}
              </div>
              {/* Hovering or focusing the email turns it into a blue link with a copy button. */}
              <div role="cell" className="group flex min-w-0 items-center gap-2">
                <a
                  href={`mailto:${person.email}`}
                  className={`min-w-0 truncate rounded-sm transition-colors group-focus-within:text-[#2867ef] group-hover:text-[#2867ef] ${focusRing}`}
                >
                  {person.email}
                </a>
                <button
                  type="button"
                  onClick={() => copy(person.email)}
                  aria-label={`Copy ${person.email}`}
                  className={`-m-1 flex shrink-0 items-center justify-center rounded-md p-1 text-[#2867ef] transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${isCopied ? "opacity-100" : "opacity-0"} ${focusRing}`}
                >
                  {isCopied ? (
                    <Icon paths={icons.check} />
                  ) : (
                    // Mirrored so the front sheet sits bottom-left, as in the design.
                    <Icon paths={icons.copy} className="-scale-x-100" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p role="status" className="sr-only">
        {copied ? `Copied ${copied}` : ""}
      </p>
    </section>
  );
}

function Avatar({ name, avatarUrl, color = "gray" }: Person) {
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

function Icon({ paths, className = "" }: { paths: string[]; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={18}
      height={18}
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
