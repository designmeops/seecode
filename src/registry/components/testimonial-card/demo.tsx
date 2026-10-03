import { TestimonialCard } from "./testimonial-card";

const glyph = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5 };

export default function TestimonialCardDemo() {
  return (
    <div className="flex items-start gap-5">
      <TestimonialCard
        quote="We moved the whole roadmap over in an afternoon. Sprint planning went from two hours to twenty minutes, and nobody misses the old spreadsheets."
        highlight="Sprint planning went from two hours to twenty minutes"
        author={{
          name: "Ana Ruiz",
          role: "Head of Product",
          company: "Northwind",
          logo: (
            <svg {...glyph} strokeLinecap="round">
              <path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" />
            </svg>
          ),
        }}
      />
      <TestimonialCard
        className="mt-10"
        quote="It’s the first tool our engineers actually enjoy opening. Everything is one keystroke away, so triage never piles up."
        highlight="Everything is one keystroke away"
        author={{
          name: "Sam Rivera",
          role: "Engineering Manager",
          company: "Acme",
          logo: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.27 4.5a2 2 0 0 1 3.46 0l7.5 13a2 2 0 0 1-1.73 3H4.5a2 2 0 0 1-1.73-3l7.5-13Z" />
            </svg>
          ),
        }}
      />
    </div>
  );
}
