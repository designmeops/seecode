"use client";

import { type HTMLAttributes, useState } from "react";

export interface RecordHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Record name, e.g. "Acme Inc". */
  name: string;
  /** Logo image URL. Without one, a gradient mark is shown. */
  logo?: string;
  /** Website, shown without its protocol and opened in a new tab (https:// is added when missing). */
  website?: string;
  /** Favorite state. Leave it out to let the star keep its own state. */
  favorite?: boolean;
  /** Initial favorite state when `favorite` isn't set. */
  defaultFavorite?: boolean;
  /** Called with the new state when the star is pressed. */
  onFavoriteChange?: (favorite: boolean) => void;
  /** Called when the Edit button is pressed. */
  onEdit?: () => void;
  /** Called when the Delete button is pressed. */
  onDelete?: () => void;
}

const icons = {
  star: [
    "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245",
  ],
  edit: ["M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4", "M13.5 6.5l4 4"],
  delete: [
    "M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16",
  ],
};

/** Hairline shadow used on buttons in the design. */
const shadow =
  "shadow-[0_0.5px_0.5px_0.25px_rgb(154_157_166/0.03),0_1.4px_1.4px_-0.7px_rgb(44_51_69/0.04)]";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2867ef]";

const button = `flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[rgb(178_191_191/0.15)] bg-linear-to-b from-white/0 to-white px-3 text-[#17171b] hover:from-[#fafafa] hover:to-[#fafafa] max-sm:px-2 ${shadow} ${focusRing}`;

export function RecordHeader({
  name,
  logo,
  website,
  favorite,
  defaultFavorite = false,
  onFavoriteChange,
  onEdit,
  onDelete,
  className = "",
  ...props
}: RecordHeaderProps) {
  const [ownFavorite, setOwnFavorite] = useState(defaultFavorite);
  const isFavorite = favorite ?? ownFavorite;
  const site = website?.replace(/^https?:\/\//, "");
  const href = website && /^https?:\/\//.test(website) ? website : `https://${site}`;

  function toggleFavorite() {
    if (favorite === undefined) setOwnFavorite(!isFavorite);
    onFavoriteChange?.(!isFavorite);
  }

  return (
    <header
      className={`flex items-center justify-between gap-4 rounded-t-md bg-white px-4 py-2 text-sm font-medium tracking-[-0.03em] shadow-[0_6px_20px_rgb(27_19_94/0.03)] ${className}`}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="size-8 shrink-0 rounded-full object-cover shadow-[0_0_0_0.5px_rgb(40_18_18/0.16)]"
            />
          ) : (
            <LogoMark />
          )}
          <h1 className="truncate font-semibold text-[#17171b]">{name}</h1>
          <button
            type="button"
            aria-label="Favorite"
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
            className={`-m-1 flex size-6 shrink-0 items-center justify-center rounded-md transition-colors ${focusRing} ${
              isFavorite ? "text-[#f5a524]" : "text-[#c6c6d1] hover:text-[#6b6b77]"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.85}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d={icons.star[0]} />
            </svg>
          </button>
        </div>
        {site && (
          <>
            <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-[#c6c6d1]" />
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`truncate rounded-sm text-[#6b6b77] transition-colors hover:text-[#17171b] ${focusRing}`}
            >
              {site}
            </a>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={onEdit} className={`group ${button}`}>
          <Icon
            paths={icons.edit}
            className="text-[#c6c6d1] transition-colors group-hover:text-[#6b6b77]"
          />
          <span className="max-sm:sr-only">Edit</span>
        </button>
        <button type="button" onClick={onDelete} className={button}>
          <Icon paths={icons.delete} className="text-[#e00d29]" />
          <span className="max-sm:sr-only">Delete</span>
        </button>
      </div>
    </header>
  );
}

/** Fallback logo: a gradient disc with a white mark. */
function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(90%_80%_at_10%_0%,rgb(190_255_235/0.9),transparent_70%),radial-gradient(90%_80%_at_100%_10%,rgb(170_215_245/0.95),transparent_75%),linear-gradient(#8ad6c2,#62c896_55%,#46be7b)] shadow-[inset_0_1px_4px_rgb(255_255_255/0.3),0_0_0_0.2px_rgb(40_18_18/0.16)]"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinecap="round"
        className="size-4"
      >
        <path d="M1.7 7.2 7.3 2.3" />
        <path d="m5.2 10.3 5.6-4.9" opacity={0.9} />
        <path d="m8.2 13.3 5.6-4.9" opacity={0.8} />
      </svg>
    </span>
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
