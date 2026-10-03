import { cn } from "../lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("size-5", className)}>
      <defs>
        <linearGradient
          id="seecode-logo"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7c86e8" />
          <stop offset="1" stopColor="#4f5bc4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#seecode-logo)" />
      <path
        d="M12.5 10.5 7 16l5.5 5.5M19.5 10.5 25 16l-5.5 5.5"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="2.1" fill="#fff" />
    </svg>
  );
}
