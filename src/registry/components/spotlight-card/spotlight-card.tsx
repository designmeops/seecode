"use client";

import type { CSSProperties, HTMLAttributes, PointerEvent } from "react";

export type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Color at the center of the spotlight. Any CSS color; translucent works best. */
  spotlightColor?: string;
};

/** Writes the pointer position into CSS variables, so moving never re-renders React. */
function trackPointer(event: PointerEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  // Previews and zoomed layouts may scale the card; convert back to its own pixels.
  const scale = rect.width / card.offsetWidth || 1;
  card.style.setProperty("--spotlight-x", `${(event.clientX - rect.left) / scale}px`);
  card.style.setProperty("--spotlight-y", `${(event.clientY - rect.top) / scale}px`);
}

export function SpotlightCard({
  spotlightColor = "rgb(129 140 248 / 0.2)",
  className = "",
  style,
  children,
  onPointerMove,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      onPointerMove={(event) => {
        trackPointer(event);
        onPointerMove?.(event);
      }}
      style={{ "--spotlight-color": spotlightColor, ...style } as CSSProperties}
      className={`group relative isolate rounded-2xl bg-white/10 p-px [--spotlight-x:50%] [--spotlight-y:-20%] ${className}`}
      {...props}
    >
      {/* Border light: shows through the 1px gap between the card and its surface. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[radial-gradient(240px_circle_at_var(--spotlight-x)_var(--spotlight-y),rgb(255_255_255/0.55),transparent_70%)] opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
      />
      <div className="relative h-full overflow-hidden rounded-[15px] bg-zinc-950 bg-linear-to-b from-white/[0.04] to-transparent">
        {/* Background glow that follows the cursor. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_circle_at_var(--spotlight-x)_var(--spotlight-y),var(--spotlight-color),transparent_70%)] opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
        />
        <div className="relative p-6">{children}</div>
      </div>
    </div>
  );
}
