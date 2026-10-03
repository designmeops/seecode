import { addPropertyControls, ControlType } from "framer";
import { type CSSProperties, Fragment, useId } from "react";

type IconName =
  | "library"
  | "globe"
  | "light-bulb"
  | "document-report"
  | "currency-dollar"
  | "globe-stand"
  | "none";

type LogoName = "salesforce" | "attio" | "none";

interface Property {
  label: string;
  icon: IconName;
  value: string;
  /** Shows the value as comma-separated chips. */
  chips?: boolean;
  /** Turns the value into a link. */
  link?: string;
}

interface AppLink {
  label: string;
  link: string;
  logo: LogoName;
  /** Your own logo; replaces the built-in one. */
  image?: string;
}

interface DetailsPanelProps {
  title: string;
  properties: Property[];
  onAddProperty?: () => void;
  links: AppLink[];
  style?: CSSProperties;
}

const ICONS: Record<Exclude<IconName, "none"> | "buildings" | "plus" | "external", string[]> = {
  buildings: [
    "M3 21l18 0",
    "M5 21v-14l8 -4v18",
    "M19 21v-10l-6 -4",
    "M9 9l0 .01",
    "M9 12l0 .01",
    "M9 15l0 .01",
    "M9 18l0 .01",
  ],
  library: ["M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"],
  globe: [
    "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
  ],
  "light-bulb": [
    "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  ],
  "document-report": [
    "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  ],
  "currency-dollar": [
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  ],
  "globe-stand": [
    "M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
    "M5.75 15a8.015 8.015 0 1 0 9.25 -13",
    "M11 17v4",
    "M7 21h8",
  ],
  plus: ["M12 4v16m8-8H4"],
  external: ["M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"],
};

const ICON_OPTIONS: IconName[] = [
  "library",
  "globe",
  "light-bulb",
  "document-report",
  "currency-dollar",
  "globe-stand",
  "none",
];

/** Hover and focus states; inline styles can't express them. */
const css = `
  [data-sc-details-panel="add"]:hover { color: #2867ef !important; }
  [data-sc-details-panel="link"]:hover { text-decoration: underline !important; }
  [data-sc-details-panel="app"]:hover { background: #fafafa !important; }
  [data-sc-details-panel="app"]:hover svg[data-tone="muted"] { stroke: #6b6b77; }
  [data-sc-details-panel]:focus-visible { outline: 2px solid #2867ef; outline-offset: 2px; }
`;

/**
 * Record properties as icon-labelled rows of text, links and chips, with buttons to other apps.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 470
 */
export default function DetailsPanel({
  title = "Company details",
  properties = [],
  onAddProperty,
  links = [],
  style,
}: DetailsPanelProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} style={{ ...styles.panel, ...style }}>
      <style>{css}</style>
      <h2 id={titleId} style={styles.title}>
        <Icon paths={ICONS.buildings} color="#6b6b77" />
        {title}
      </h2>
      <div style={styles.body}>
        <dl style={styles.properties}>
          {properties.map((property, index) => (
            <Fragment key={`${property.label}-${index}`}>
              <dt style={styles.label}>
                {property.icon !== "none" && ICONS[property.icon] && (
                  <Icon paths={ICONS[property.icon]} color="#6b6b77" />
                )}
                {property.label}
              </dt>
              <dd style={styles.value}>
                <Value {...property} />
              </dd>
            </Fragment>
          ))}
        </dl>
        <button
          type="button"
          data-sc-details-panel="add"
          onClick={onAddProperty}
          style={styles.add}
        >
          <Icon paths={ICONS.plus} color="#2867ef" strokeWidth={2} />
          Add a property
        </button>
      </div>
      {links.length > 0 && (
        <div style={styles.apps}>
          {links.map((app, index) => (
            <a
              key={`${app.label}-${index}`}
              data-sc-details-panel="app"
              href={app.link}
              target="_blank"
              rel="noreferrer"
              style={styles.app}
            >
              {app.image ? (
                <img src={app.image} alt="" style={styles.image} />
              ) : (
                <Logo name={app.logo} />
              )}
              <span style={styles.ellipsis}>{app.label}</span>
              <Icon paths={ICONS.external} color="#c6c6d1" muted />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function Value({ value, chips, link }: Property) {
  if (chips) {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return (
      <ul style={styles.chips}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`} style={styles.chip}>
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (link) {
    return (
      <a
        data-sc-details-panel="link"
        href={link}
        target="_blank"
        rel="noreferrer"
        style={styles.link}
      >
        <span style={styles.ellipsis}>{value}</span>
        <Icon paths={ICONS.external} color="#2867ef" />
      </a>
    );
  }
  return <span style={styles.ellipsis}>{value}</span>;
}

/** Stand-in marks; set an Image on the link to use the real logo. */
function Logo({ name }: { name: LogoName }) {
  if (name === "salesforce") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 26 18"
        width={26}
        height={18}
        fill="#00a1e0"
        style={{ flexShrink: 0 }}
      >
        <circle cx="6.5" cy="9.5" r="5" />
        <circle cx="11.5" cy="6.5" r="5.2" />
        <circle cx="18" cy="6.4" r="4.6" />
        <circle cx="21" cy="10.2" r="4.2" />
        <circle cx="10" cy="12.2" r="4.6" />
        <circle cx="16.6" cy="12.4" r="4.6" />
      </svg>
    );
  }
  if (name === "attio") {
    return (
      <svg aria-hidden="true" viewBox="0 0 18 18" width={18} height={18} style={{ flexShrink: 0 }}>
        <path
          d="M4.6 14.2 9.4 4.8M10.6 14.2l1.8-3.6"
          stroke="#1c1d1f"
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <circle cx="14.6" cy="13" r="1.8" fill="#1c1d1f" />
      </svg>
    );
  }
  return null;
}

function Icon({
  paths,
  color,
  strokeWidth = 1.5,
  muted = false,
}: {
  paths: string[];
  color: string;
  strokeWidth?: number;
  muted?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-tone={muted ? "muted" : undefined}
      style={{ flexShrink: 0, transition: "stroke 0.15s" }}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

addPropertyControls(DetailsPanel, {
  title: { type: ControlType.String, title: "Title", defaultValue: "Company details" },
  properties: {
    type: ControlType.Array,
    title: "Properties",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type: ControlType.String, title: "Label", defaultValue: "Name" },
        icon: {
          type: ControlType.Enum,
          title: "Icon",
          options: ICON_OPTIONS,
          optionTitles: [
            "Building",
            "Globe",
            "Light bulb",
            "Report",
            "Dollar",
            "Globe stand",
            "None",
          ],
          defaultValue: "library",
        },
        value: { type: ControlType.String, title: "Value", defaultValue: "Acme Corporation." },
        chips: {
          type: ControlType.Boolean,
          title: "Chips",
          description: "Splits the value at commas.",
          defaultValue: false,
        },
        link: { type: ControlType.Link, title: "Link", defaultValue: "" },
      },
    },
    defaultValue: [
      { label: "Name", icon: "library", value: "Acme Corporation." },
      {
        label: "Website",
        icon: "globe",
        value: "www.acme.studio/us",
        link: "https://www.acme.studio/us",
      },
      { label: "Industry", icon: "light-bulb", value: "Tech, Sales, Marketing", chips: true },
      { label: "Size", icon: "document-report", value: "100-500" },
      { label: "Revenue", icon: "currency-dollar", value: "est. 100,000.00 USD" },
      { label: "Location", icon: "globe-stand", value: "San Francisco, US" },
    ],
  },
  onAddProperty: { type: ControlType.EventHandler },
  links: {
    type: ControlType.Array,
    title: "Links",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type: ControlType.String, title: "Label", defaultValue: "View in Salesforce" },
        link: {
          type: ControlType.Link,
          title: "Link",
          defaultValue: "https://login.salesforce.com",
        },
        logo: {
          type: ControlType.Enum,
          title: "Logo",
          options: ["salesforce", "attio", "none"],
          optionTitles: ["Salesforce", "Attio", "None"],
          defaultValue: "salesforce",
        },
        image: { type: ControlType.Image, title: "Image" },
      },
    },
    defaultValue: [
      { label: "View in Salesforce", link: "https://login.salesforce.com", logo: "salesforce" },
      { label: "View in Attio", link: "https://app.attio.com", logo: "attio" },
    ],
  },
});

const shadow =
  "0 0.5px 0.5px 0.25px rgba(154, 157, 166, 0.03), 0 1.4px 1.4px -0.7px rgba(44, 51, 69, 0.04)";

const styles: Record<string, CSSProperties> = {
  panel: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: 470,
    padding: "24px 0",
    borderRadius: "0 0 6px 0",
    background: "#ffffff",
    color: "#17171b",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "normal",
    letterSpacing: "-0.03em",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: 0,
    padding: "0 24px",
    font: "inherit",
    fontSize: 16,
    letterSpacing: "-0.02em",
  },
  body: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    columnGap: 24,
    rowGap: 8,
    padding: "0 24px",
  },
  properties: {
    display: "grid",
    gridColumn: "1 / -1",
    gridTemplateColumns: "subgrid",
    rowGap: 8,
    margin: 0,
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 28,
    color: "#6b6b77",
    whiteSpace: "nowrap",
  },
  value: { display: "flex", alignItems: "center", minWidth: 0, minHeight: 28, margin: 0 },
  ellipsis: { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
    borderRadius: 2,
    color: "#2867ef",
    textDecoration: "none",
    textUnderlineOffset: 2,
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, margin: 0, padding: 0, listStyle: "none" },
  chip: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    height: 28,
    padding: "0 8px",
    borderRadius: 6,
    border: "0.5px solid #f4f4fb",
    background: "#ffffff",
    boxShadow: shadow,
    color: "#6b6b77",
  },
  add: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    gridColumn: 1,
    justifySelf: "start",
    height: 28,
    padding: 0,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#17171b",
    font: "inherit",
    letterSpacing: "inherit",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "color 0.15s",
  },
  apps: { display: "flex", gap: 12, marginTop: 8, padding: "0 24px" },
  app: {
    boxSizing: "border-box",
    display: "flex",
    flex: "1 1 0",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 0,
    height: 36,
    padding: "0 12px",
    border: "1px solid rgba(178, 178, 191, 0.15)",
    borderRadius: 8,
    background: "linear-gradient(rgba(255, 255, 255, 0), #ffffff)",
    boxShadow: shadow,
    color: "#17171b",
    textDecoration: "none",
  },
  image: { height: 18, width: "auto", flexShrink: 0 },
};
