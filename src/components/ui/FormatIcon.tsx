import { cn } from "../../lib/cn";
import type { FormatId } from "../../registry/types";

/** Platform marks from Simple Icons (CC0), drawn in the current text color. */
const marks: Record<FormatId, { path: string; scale: number }> = {
  nextjs: {
    path: "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z",
    scale: 1,
  },
  framer: { path: "M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z", scale: 0.9 },
  webflow: {
    path: "m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z",
    scale: 1.08,
  },
};

export function FormatIcon({
  format,
  size = 14,
  className,
}: {
  format: FormatId;
  size?: number;
  className?: string;
}) {
  const { path, scale } = marks[format];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path
        d={path}
        transform={scale === 1 ? undefined : `translate(12 12) scale(${scale}) translate(-12 -12)`}
      />
    </svg>
  );
}
