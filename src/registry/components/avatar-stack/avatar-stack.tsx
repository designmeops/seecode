import type { HTMLAttributes } from "react";

export type AvatarStackPerson = {
  name: string;
  /** Optional photo URL. Without one, initials sit on a gradient picked from the name. */
  image?: string;
};

export type AvatarStackProps = HTMLAttributes<HTMLUListElement> & {
  people: AvatarStackPerson[];
  /** How many avatars to show before the "+N" chip. */
  max?: number;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { avatar: "size-6 text-[9px] ring-[1.5px]", overlap: "-ml-0.5" },
  md: { avatar: "size-8 text-[11px] ring-2", overlap: "-ml-1.5" },
  lg: { avatar: "size-10 text-[13px] ring-[2.5px]", overlap: "-ml-2" },
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

/** Stable color per name, so a person looks the same in every stack. */
function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return gradients[hash % gradients.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function summarize(names: string[]) {
  const firstNames = names.map((name) => name.trim().split(/\s+/)[0]);
  if (firstNames.length <= 3) {
    return firstNames.length > 1
      ? `${firstNames.slice(0, -1).join(", ")} and ${firstNames[firstNames.length - 1]}`
      : (firstNames[0] ?? "");
  }
  return `${firstNames.slice(0, 2).join(", ")} and ${firstNames.length - 2} others`;
}

const tooltipClass =
  "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-[0_4px_12px_-2px_rgb(0_0_0/0.25)] transition-[opacity,translate] duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100 motion-reduce:transition-none";

const triggerClass =
  "peer block rounded-full transition-transform duration-200 ease-out group-hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 motion-reduce:transition-none";

export function AvatarStack({
  people,
  max = 4,
  size = "md",
  className = "",
  ...props
}: AvatarStackProps) {
  const style = sizes[size];
  const visible = people.length > max ? people.slice(0, Math.max(0, max)) : people;
  const hidden = people.slice(visible.length);

  return (
    <ul className={`flex items-center ${className}`} {...props}>
      {visible.map((person, index) => (
        <li
          key={`${person.name}-${index}`}
          className={`group relative hover:z-10 focus-within:z-10 ${index > 0 ? style.overlap : ""}`}
        >
          <span role="img" aria-label={person.name} tabIndex={0} className={triggerClass}>
            <span
              className={`grid place-items-center overflow-hidden rounded-full bg-linear-to-br font-semibold text-white ring-white select-none [text-shadow:0_1px_1px_rgb(0_0_0/0.12)] ${style.avatar} ${gradientFor(person.name)}`}
            >
              {person.image ? (
                <img src={person.image} alt="" className="size-full object-cover" />
              ) : (
                initials(person.name)
              )}
            </span>
          </span>
          <span aria-hidden="true" className={tooltipClass}>
            {person.name}
          </span>
        </li>
      ))}
      {hidden.length > 0 && (
        <li
          className={`group relative hover:z-10 focus-within:z-10 ${visible.length > 0 ? style.overlap : ""}`}
        >
          <span
            role="img"
            aria-label={`${hidden.length} more: ${hidden.map((person) => person.name).join(", ")}`}
            tabIndex={0}
            className={triggerClass}
          >
            <span
              className={`grid place-items-center rounded-full bg-zinc-100 font-medium text-zinc-600 tabular-nums ring-white select-none ${style.avatar}`}
            >
              +{hidden.length}
            </span>
          </span>
          <span aria-hidden="true" className={tooltipClass}>
            {summarize(hidden.map((person) => person.name))}
          </span>
        </li>
      )}
    </ul>
  );
}
