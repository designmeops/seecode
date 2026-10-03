import { DealCard } from "./deal-card";

export default function DealCardThumbnail() {
  return (
    <DealCard
      status="won"
      name="Marketing Strategy"
      value="$100,000"
      services={["Consulting"]}
      created="May 9, 2025"
      className="w-[288px]"
    />
  );
}
