"use client";

import {
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

export type DockItem = {
  id: string;
  /** Accessible name, also shown in the tooltip. */
  label: string;
  icon: ReactNode;
  /** Classes for the icon tile, usually a gradient such as `bg-linear-to-b from-sky-400 to-blue-600`. */
  tileClassName?: string;
  /** Shows the dot that marks a running app. */
  open?: boolean;
  onSelect?: () => void;
};

export type DockProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Apps in order. Use `"divider"` to separate groups. */
  items: (DockItem | "divider")[];
  /** Resting icon size in px. */
  iconSize?: number;
  /** Scale of the icon right under the pointer. */
  magnification?: number;
  /** Distance in px over which neighbours are magnified. */
  distance?: number;
};

type Focus = { x: number; centers: number[] };

const keyframes = `
@keyframes dock-bounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-28%); }
  50% { transform: translateY(0); }
  70% { transform: translateY(-10%); }
  85% { transform: translateY(0); }
}`;

export function Dock({
  items,
  iconSize = 40,
  magnification = 1.6,
  distance = 140,
  className = "",
  onPointerMove,
  onPointerLeave,
  ...props
}: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pointer, setPointer] = useState<Focus | null>(null);
  const [keyboard, setKeyboard] = useState<(Focus & { index: number }) | null>(null);
  const [tabStop, setTabStop] = useState(0);
  const [bounce, setBounce] = useState<{ index: number; count: number } | null>(null);

  const appIndexes = items.flatMap((item, index) => (item === "divider" ? [] : [index]));
  const focusableIndex = appIndexes.includes(tabStop) ? tabStop : appIndexes[0];

  // Slot centres in the dock's own (unscaled) coordinates. Slots never change
  // size, so magnifying an icon doesn't move the targets we measure against.
  const measureCenters = () =>
    slotRefs.current.map((slot) => (slot ? slot.offsetLeft + slot.offsetWidth / 2 : 0));

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const dock = dockRef.current;
    if (!dock || event.pointerType === "touch") return;
    const rect = dock.getBoundingClientRect();
    // Previews may be scaled with a transform: convert to layout pixels.
    const scale = rect.width / dock.offsetWidth || 1;
    setPointer({ x: (event.clientX - rect.left) / scale, centers: measureCenters() });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    setPointer(null);
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>, index: number) => {
    setTabStop(index);
    if (!event.currentTarget.matches(":focus-visible")) return;
    const centers = measureCenters();
    setKeyboard({ x: centers[index], centers, index });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const position = appIndexes.indexOf(index);
    const count = appIndexes.length;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = appIndexes[(position + 1) % count];
        break;
      case "ArrowLeft":
        next = appIndexes[(position - 1 + count) % count];
        break;
      case "Home":
        next = appIndexes[0];
        break;
      case "End":
        next = appIndexes[count - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    buttonRefs.current[next]?.focus();
  };

  const target = pointer ?? keyboard;
  const scales = items.map((item, index) => {
    if (item === "divider" || !target) return 1;
    const offset = Math.abs(target.centers[index] - target.x);
    if (offset >= distance) return 1;
    // Cosine falloff: full size under the pointer, easing to 1 at `distance`.
    return 1 + ((magnification - 1) * (Math.cos((Math.PI * offset) / distance) + 1)) / 2;
  });

  // Grown icons push their neighbours apart, and the dock widens evenly on both sides.
  const extras = scales.map((scale) => (scale - 1) * iconSize);
  const totalExtra = extras.reduce((sum, extra) => sum + extra, 0);
  let consumed = 0;
  const shifts = extras.map((extra) => {
    const shift = consumed + extra / 2 - totalExtra / 2;
    consumed += extra;
    return shift;
  });

  let labelIndex: number | null = keyboard && !pointer ? keyboard.index : null;
  if (pointer) {
    let nearest = Infinity;
    for (const index of appIndexes) {
      const offset = Math.abs(pointer.centers[index] - pointer.x);
      if (offset < nearest) {
        nearest = offset;
        labelIndex = index;
      }
    }
  }

  return (
    <div
      ref={dockRef}
      role="toolbar"
      aria-label="Dock"
      aria-orientation="horizontal"
      className={`relative inline-flex items-end gap-1.5 px-2 pt-2 pb-2.5 ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <style href="dock" precedence="default">
        {keyframes}
      </style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 rounded-2xl bg-white/70 shadow-[0_0_0_1px_rgb(0_0_0/0.06),inset_0_1px_0_rgb(255_255_255/0.7),0_2px_4px_-1px_rgb(0_0_0/0.06),0_12px_32px_-8px_rgb(0_0_0/0.2)] backdrop-blur-xl backdrop-saturate-150 transition-[left,right] duration-150 ease-out motion-reduce:transition-none"
        style={{ left: -totalExtra / 2, right: -totalExtra / 2 }}
      />
      {items.map((item, index) => {
        if (item === "divider") {
          return (
            <div
              key={`divider-${index}`}
              ref={(node) => {
                slotRefs.current[index] = node;
              }}
              aria-hidden="true"
              className="relative mx-1 w-px shrink-0 self-center bg-zinc-950/10 transition-transform duration-150 ease-out motion-reduce:transition-none"
              style={{ height: iconSize * 0.75, transform: `translateX(${shifts[index]}px)` }}
            />
          );
        }

        const scale = scales[index];
        const shift = shifts[index];
        const bouncing = bounce?.index === index;
        return (
          <div
            key={item.id}
            ref={(node) => {
              slotRefs.current[index] = node;
            }}
            className="relative shrink-0"
            style={{ width: iconSize, height: iconSize }}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-2.5 rounded-md bg-zinc-900/90 px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow-[0_4px_12px_-2px_rgb(0_0_0/0.25)] transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${
                labelIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transform: `translate(calc(-50% + ${shift}px), ${-(scale - 1) * iconSize}px)`,
              }}
            >
              {item.label}
            </span>
            <button
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              aria-label={item.label}
              tabIndex={index === focusableIndex ? 0 : -1}
              onClick={() => {
                setBounce((prev) => ({ index, count: (prev?.count ?? 0) + 1 }));
                item.onSelect?.();
              }}
              onFocus={(event) => handleFocus(event, index)}
              onBlur={() => setKeyboard(null)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="absolute inset-0 origin-bottom rounded-[24%] transition-transform duration-150 ease-out will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 motion-reduce:transition-none"
              style={{ transform: `translateX(${shift}px) scale(${scale})` }}
            >
              <span
                key={bouncing ? bounce.count : "rest"}
                className={`flex size-full items-center justify-center rounded-[24%] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_0_0_1px_rgb(255_255_255/0.08),0_1px_2px_rgb(0_0_0/0.14),0_4px_8px_-2px_rgb(0_0_0/0.14)] [&_svg]:size-[55%] ${
                  item.tileClassName ?? "bg-linear-to-b from-zinc-600 to-zinc-800"
                } ${bouncing ? "animate-[dock-bounce_0.7s_ease-out] motion-reduce:animate-none" : ""}`}
              >
                {item.icon}
              </span>
            </button>
            {item.open && (
              <span
                aria-hidden="true"
                className="absolute top-full left-1/2 mt-[3px] size-1 rounded-full bg-zinc-900/50 transition-transform duration-150 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
