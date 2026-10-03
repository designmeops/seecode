import { DetailsPanel } from "./details-panel";

// Stand-in marks: pass your own logos (an <img> or <svg> about 18px tall).
const salesforceLogo = (
  <svg aria-hidden="true" viewBox="0 0 26 18" fill="#00a1e0" className="h-[18px] w-[26px] shrink-0">
    <circle cx="6.5" cy="9.5" r="5" />
    <circle cx="11.5" cy="6.5" r="5.2" />
    <circle cx="18" cy="6.4" r="4.6" />
    <circle cx="21" cy="10.2" r="4.2" />
    <circle cx="10" cy="12.2" r="4.6" />
    <circle cx="16.6" cy="12.4" r="4.6" />
  </svg>
);

const attioLogo = (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="size-[18px] shrink-0">
    <path
      d="M4.6 14.2 9.4 4.8M10.6 14.2l1.8-3.6"
      stroke="#1c1d1f"
      strokeWidth={3.2}
      strokeLinecap="round"
    />
    <circle cx="14.6" cy="13" r="1.8" fill="#1c1d1f" />
  </svg>
);

export default function DetailsPanelDemo() {
  return (
    <DetailsPanel
      title="Company details"
      className="w-[min(470px,100%)]"
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
        { label: "Revenue", icon: "currency-dollar", value: "est. 100,000.00 USD" },
        { label: "Location", icon: "globe-stand", value: "San Francisco, US" },
      ]}
      links={[
        { label: "View in Salesforce", href: "https://login.salesforce.com", logo: salesforceLogo },
        { label: "View in Attio", href: "https://app.attio.com", logo: attioLogo },
      ]}
    />
  );
}
