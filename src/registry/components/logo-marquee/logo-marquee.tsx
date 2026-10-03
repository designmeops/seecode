import type { HTMLAttributes, ReactNode } from "react";

export interface MarqueeLogo {
  /** Company name, shown as the wordmark text. */
  name: string;
  /** Small glyph before the name — an inline SVG works best. */
  glyph?: ReactNode;
}

export type LogoMarqueeProps = HTMLAttributes<HTMLDivElement> & {
  /** Provide enough logos to fill the container's width at least once. */
  logos: MarqueeLogo[];
  /** Seconds for one full loop — higher is slower. */
  speed?: number;
  /** Scroll left-to-right instead. */
  reverse?: boolean;
  pauseOnHover?: boolean;
};

const keyframes = `
@keyframes logo-marquee-scroll {
  to { transform: translateX(-50%); }
}`;

export function LogoMarquee({
  logos,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  className = "",
  ...props
}: LogoMarqueeProps) {
  // The list is rendered twice; moving the track by -50% lands exactly on the copy, so the loop is seamless.
  const list = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className={`flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-5 motion-reduce:pr-0 ${
        copy ? "motion-reduce:hidden" : ""
      }`}
    >
      {logos.map((logo) => (
        <li key={logo.name} className="flex shrink-0 items-center gap-2 text-zinc-400">
          {logo.glyph && (
            <span aria-hidden="true" className="flex size-5 items-center justify-center [&>svg]:size-5">
              {logo.glyph}
            </span>
          )}
          <span className="text-lg font-semibold tracking-tight whitespace-nowrap text-zinc-500">
            {logo.name}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`group/marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none] ${className}`}
      {...props}
    >
      {/* React 19 hoists and de-duplicates this, so the file stays self-contained. */}
      <style href="logo-marquee" precedence="default">
        {keyframes}
      </style>
      <div
        className={`flex w-max animate-[logo-marquee-scroll_30s_linear_infinite] motion-reduce:w-auto motion-reduce:animate-none ${
          pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""
        }`}
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : undefined }}
      >
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
