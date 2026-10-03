"use client";

import { useId, type HTMLAttributes, type ReactNode } from "react";

export type StatCardProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: ReactNode;
  /** Pre-formatted value, e.g. "$48,290". */
  value: ReactNode;
  /** Percentage change. Positive is emerald, negative is rose. */
  delta: number;
  /** Values for the sparkline, oldest first. */
  data: number[];
  /** Text after the delta badge. */
  caption?: ReactNode;
};

// The sparkline is drawn in a 100×40 box and stretched to the card width; the stroke uses
// `non-scaling-stroke` so it stays crisp at any size.
const WIDTH = 100;
const HEIGHT = 40;
const PAD = 4;

type Point = [x: number, y: number];

function toPoints(data: number[]): Point[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const step = data.length > 1 ? WIDTH / (data.length - 1) : 0;
  return data.map((value, i) => [
    i * step,
    max === min ? HEIGHT / 2 : PAD + (1 - (value - min) / (max - min)) * (HEIGHT - PAD * 2),
  ]);
}

/** Monotone cubic interpolation: smooth, but never overshoots the data like a plain spline. */
function smoothPath(points: Point[]): string {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M0,${points[0][1]}H${WIDTH}`;
  const slopes = points.slice(1).map(([x, y], i) => (y - points[i][1]) / (x - points[i][0]));
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === n - 1) return slopes[n - 2];
    const [a, b] = [slopes[i - 1], slopes[i]];
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  const round = (v: number) => Math.round(v * 100) / 100;
  let d = `M${round(points[0][0])},${round(points[0][1])}`;
  for (let i = 1; i < n; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const dx = (x1 - x0) / 3;
    d += `C${round(x0 + dx)},${round(y0 + dx * tangents[i - 1])} ${round(x1 - dx)},${round(y1 - dx * tangents[i])} ${round(x1)},${round(y1)}`;
  }
  return d;
}

export function StatCard({
  label,
  value,
  delta,
  data,
  caption = "vs last month",
  className = "",
  ...props
}: StatCardProps) {
  const gradientId = `stat-card-${useId().replace(/[^\w-]/g, "")}`;
  const trend = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const tone = {
    up: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", line: "text-emerald-500" },
    down: { badge: "bg-rose-50 text-rose-700 ring-rose-600/15", line: "text-rose-500" },
    flat: { badge: "bg-zinc-100 text-zinc-600 ring-zinc-500/15", line: "text-zinc-400" },
  }[trend];
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  const points = toPoints(data);
  const line = smoothPath(points);
  const last = points[points.length - 1];

  return (
    <div
      className={`w-72 overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgb(9_9_11/0.04),0_8px_24px_-12px_rgb(9_9_11/0.1)] ${className}`}
      {...props}
    >
      <p className="text-sm/5 font-medium text-zinc-500">{label}</p>
      <p className="mt-1.5 text-3xl/9 font-semibold tracking-tight text-zinc-950 tabular-nums">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs/5">
        <span
          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 font-medium tabular-nums ring-1 ring-inset ${tone.badge}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {trend === "up" && <path d="M7 17 17 7M9 7h8v8" />}
            {trend === "down" && <path d="M7 7l10 10M17 9v8H9" />}
            {trend === "flat" && <path d="M5 12h14" />}
          </svg>
          <span className="sr-only">
            {trend === "down" ? "Down" : trend === "up" ? "Up" : "No change"}
          </span>
          {sign}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-zinc-500">{caption}</span>
      </div>
      {line && last ? (
        <div className={`relative mt-4 h-14 ${tone.line}`} aria-hidden="true">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${line}L${WIDTH},${HEIGHT}L0,${HEIGHT}Z`} fill={`url(#${gradientId})`} />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* An HTML dot stays perfectly round while the SVG stretches. */}
          <span
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current ring-2 ring-white"
            style={{ left: `${(last[0] / WIDTH) * 100}%`, top: `${(last[1] / HEIGHT) * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
