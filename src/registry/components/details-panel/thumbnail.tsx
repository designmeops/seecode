import { DetailsPanel } from "./details-panel";

export default function DetailsPanelThumbnail() {
  return (
    <DetailsPanel
      title="Company details"
      className="w-[430px] shrink-0"
      properties={[
        { label: "Name", icon: "library", value: "Acme Corporation." },
        {
          label: "Website",
          icon: "globe",
          value: "www.acme.studio/us",
          href: "https://www.acme.studio/us",
        },
        { label: "Industry", icon: "light-bulb", value: ["Tech", "Sales", "Marketing"] },
        { label: "Size", icon: "document-report", value: "100-500" },
      ]}
    />
  );
}
