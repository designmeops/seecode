import type { HTMLAttributes, ReactNode } from "react";

export interface TestimonialAuthor {
  name: string;
  /** Job title, e.g. "Head of Product". */
  role: string;
  company: string;
  /** Tiny company glyph shown before the company name — an inline SVG works best. */
  logo?: ReactNode;
}

export type TestimonialCardProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  quote: string;
  /** A phrase inside `quote` to emphasise with a soft marker highlight. */
  highlight?: string;
  /** Star rating from 0 to 5. */
  rating?: number;
  author: TestimonialAuthor;
};

const AVATAR_GRADIENTS = [
  "from-indigo-400 to-violet-600",
  "from-sky-400 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-pink-600",
  "from-fuchsia-400 to-purple-600",
];

export function TestimonialCard({
  quote,
  highlight,
  rating = 5,
  author,
  className = "",
  ...props
}: TestimonialCardProps) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  const start = highlight ? quote.indexOf(highlight) : -1;

  return (
    <figure
      className={`w-72 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-[0_1px_2px_rgb(24_24_27/0.04),0_12px_32px_-12px_rgb(24_24_27/0.12)] ${className}`}
      {...props}
    >
      <div role="img" aria-label={`Rated ${stars} out of 5`} className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <svg
            key={index}
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`size-4 ${index < stars ? "text-amber-400" : "text-zinc-200"}`}
          >
            <path d="M11.1 3.3a1 1 0 0 1 1.8 0l2.3 4.64 5.12.75a1 1 0 0 1 .55 1.7l-3.7 3.61.87 5.1a1 1 0 0 1-1.45 1.05L12 17.77l-4.59 2.4a1 1 0 0 1-1.45-1.06l.87-5.1-3.7-3.6a1 1 0 0 1 .55-1.71l5.12-.75L11.1 3.3Z" />
          </svg>
        ))}
      </div>

      <blockquote className="mt-3.5 text-sm/6 text-pretty text-zinc-700">
        <p>
          “
          {start >= 0 && highlight ? (
            <>
              {quote.slice(0, start)}
              <mark className="box-decoration-clone bg-transparent bg-linear-to-t from-indigo-100 from-45% to-transparent to-45% -mx-0.5 px-0.5 font-medium text-zinc-900">
                {highlight}
              </mark>
              {quote.slice(start + highlight.length)}
            </>
          ) : (
            quote
          )}
          ”
        </p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4">
        <Avatar name={author.name} />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium tracking-tight text-zinc-900">
            {author.name}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="truncate">{author.role}</span>
            <span aria-hidden="true" className="text-zinc-300">
              ·
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 font-medium text-zinc-600">
              {author.logo && (
                <span
                  aria-hidden="true"
                  className="flex size-3.5 items-center justify-center text-zinc-400 [&>svg]:size-3.5"
                >
                  {author.logo}
                </span>
              )}
              {author.company}
            </span>
          </div>
        </div>
      </figcaption>
    </figure>
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
      aria-hidden="true"
      className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${gradient} text-xs font-semibold text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)]`}
    >
      {initials}
    </span>
  );
}
