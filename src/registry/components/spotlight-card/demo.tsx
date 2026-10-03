import { SpotlightCard } from "./spotlight-card";

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "size-[18px]",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export default function SpotlightCardDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SpotlightCard className="w-64">
        <div className="grid size-9 place-items-center rounded-lg bg-linear-to-b from-white/10 to-white/[0.03] text-zinc-100 ring-1 ring-white/10 ring-inset">
          <svg {...iconProps}>
            <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-medium text-zinc-100">Instant sync</h3>
        <p className="mt-1.5 text-sm/6 text-zinc-400">
          Changes reach every teammate in milliseconds.
        </p>
      </SpotlightCard>
      <SpotlightCard className="w-64" spotlightColor="rgb(56 189 248 / 0.14)">
        <div className="grid size-9 place-items-center rounded-lg bg-linear-to-b from-white/10 to-white/[0.03] text-zinc-100 ring-1 ring-white/10 ring-inset">
          <svg {...iconProps}>
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-medium text-zinc-100">Keyboard first</h3>
        <p className="mt-1.5 text-sm/6 text-zinc-400">
          Every action is a shortcut away. Press{" "}
          <kbd className="rounded-sm border border-white/10 bg-white/5 px-1 font-sans text-xs text-zinc-300">
            ⌘K
          </kbd>{" "}
          to start.
        </p>
      </SpotlightCard>
    </div>
  );
}
