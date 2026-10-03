import { DealCard } from "./deal-card";

export default function DealCardDemo() {
  return (
    <section className="w-[min(940px,100%)] bg-white p-6 font-medium tracking-[-0.02em]">
      <h2 className="mb-4 flex items-center gap-2 text-base text-[#17171b]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[18px] text-[#9292a6]"
        >
          <path d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1-1.564-.317z" />
        </svg>
        Deals
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <DealCard
          status="pitching"
          name="Marketing Strategy"
          value="$100,000"
          services={["Consulting"]}
          created="May 9, 2025"
        />
        <DealCard
          status="lost"
          name="Marketing Strategy"
          value="$100,000"
          services={["Consulting"]}
          created="May 9, 2025"
        />
        <DealCard
          status="won"
          name="Marketing Strategy"
          value="$100,000"
          services={["Consulting"]}
          created="May 9, 2025"
        />
      </div>
    </section>
  );
}
