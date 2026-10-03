import { LogoMarquee, type MarqueeLogo } from "./logo-marquee";

const glyph = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };

// Fictional companies with simple geometric marks — swap in your customers' SVG logos.
const logos: MarqueeLogo[] = [
  {
    name: "Acme",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.27 4.5a2 2 0 0 1 3.46 0l7.5 13a2 2 0 0 1-1.73 3H4.5a2 2 0 0 1-1.73-3l7.5-13Z" />
      </svg>
    ),
  },
  {
    name: "Northwind",
    glyph: (
      <svg {...glyph} strokeLinecap="round">
        <path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" />
      </svg>
    ),
  },
  {
    name: "Globex",
    glyph: (
      <svg {...glyph}>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    name: "Initech",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm2.5 6.5v5h5v-5h-5Z"
        />
      </svg>
    ),
  },
  {
    name: "Umbrella",
    glyph: (
      <svg {...glyph} strokeLinecap="round">
        <path d="M3 12a9 9 0 0 1 18 0H3Z" fill="currentColor" />
        <path d="M12 12v6a2 2 0 0 1-4 0" />
      </svg>
    ),
  },
  {
    name: "Vertex",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 4h5.25L12 12.5 16.25 4h5.25L12 21 2.5 4Z" />
      </svg>
    ),
  },
  {
    name: "Lumen",
    glyph: (
      <svg {...glyph} strokeLinecap="round">
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
    ),
  },
  {
    name: "Quanta",
    glyph: (
      <svg {...glyph} strokeLinejoin="round">
        <path d="M12 2.5 20.5 7.25v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5Z" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function LogoMarqueeDemo() {
  return (
    <section aria-label="Customers" className="w-[34rem] text-center">
      <p className="text-sm font-medium tracking-tight text-zinc-500">
        Trusted by fast-moving teams
      </p>
      <LogoMarquee logos={logos} className="mt-7" />
      <LogoMarquee
        logos={[...logos.slice(4), ...logos.slice(0, 4)]}
        reverse
        speed={38}
        className="mt-6"
      />
    </section>
  );
}
