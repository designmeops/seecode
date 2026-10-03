import { addPropertyControls, ControlType } from "framer";
import type { CSSProperties, ReactNode } from "react";

type Status = "pitching" | "lost" | "won";

interface DealCardProps {
  status: Status;
  name: string;
  value: string;
  services: string[];
  created: string;
  onMenuClick?: () => void;
  style?: CSSProperties;
}

const STATUSES: Record<Status, { label: string; color: string; icon: string[] }> = {
  pitching: {
    label: "Pitching",
    color: "#6b6b77",
    icon: [
      "M3 4h18",
      "M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4",
      "M12 16v4",
      "M9 20h6",
      "m8 12 3-3 2 2 3-3",
    ],
  },
  lost: { label: "Lost", color: "#e00d29", icon: ["m3 7 6 6 4-4 8 8", "M21 10v7h-7"] },
  won: { label: "Won", color: "#04bb6f", icon: ["m3 17 6-6 4 4 8-8", "M14 7h7v7"] },
};

const ICONS = {
  name: ["M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"],
  value: [
    "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
  ],
  services: [
    "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  ],
  created: [
    "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  ],
  menu: [
    "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
  ],
};

/**
 * Deal card with a status, key properties and a ⋮ menu.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 288
 */
export default function DealCard({
  status = "pitching",
  name = "Marketing Strategy",
  value = "$100,000",
  services = ["Consulting"],
  created = "May 9, 2025",
  onMenuClick,
  style,
}: DealCardProps) {
  const { label, color, icon } = STATUSES[status] ?? STATUSES.pitching;

  return (
    <article style={{ ...styles.card, ...style }}>
      <header style={styles.header}>
        <h3 style={styles.status}>
          <Icon paths={icon} color={color} />
          {label}
        </h3>
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={`${label} deal actions`}
          style={styles.menu}
        >
          <Icon paths={ICONS.menu} color="#c6c6d1" />
        </button>
      </header>
      <dl style={styles.properties}>
        <Property icon={ICONS.name} label="Name">
          {name}
        </Property>
        <Property icon={ICONS.value} label="Value">
          {value}
        </Property>
        <Property icon={ICONS.services} label="Services">
          {services.map((service) => (
            <span key={service} style={styles.chip}>
              {service}
            </span>
          ))}
        </Property>
        <Property icon={ICONS.created} label="Created">
          {created}
        </Property>
      </dl>
    </article>
  );
}

function Property({
  icon,
  label,
  children,
}: {
  icon: string[];
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <dt style={styles.label}>
        <Icon paths={icon} color="#6b6b77" />
        {label}
      </dt>
      <dd style={styles.value}>{children}</dd>
    </>
  );
}

function Icon({ paths, color }: { paths: string[]; color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

addPropertyControls(DealCard, {
  status: {
    type: ControlType.Enum,
    title: "Status",
    options: ["pitching", "lost", "won"],
    optionTitles: ["Pitching", "Lost", "Won"],
    defaultValue: "pitching",
  },
  name: { type: ControlType.String, title: "Name", defaultValue: "Marketing Strategy" },
  value: { type: ControlType.String, title: "Value", defaultValue: "$100,000" },
  services: {
    type: ControlType.Array,
    title: "Services",
    control: { type: ControlType.String },
    defaultValue: ["Consulting"],
  },
  created: { type: ControlType.String, title: "Created", defaultValue: "May 9, 2025" },
  onMenuClick: { type: ControlType.EventHandler },
});

const shadow =
  "0 0.5px 0.5px 0.25px rgba(154, 157, 166, 0.03), 0 1.4px 1.4px -0.7px rgba(44, 51, 69, 0.04)";

const styles: Record<string, CSSProperties> = {
  card: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflow: "hidden",
    padding: "8px 0 12px",
    borderRadius: 8,
    border: "1px solid #f4f4fb",
    background: "#ffffff",
    boxShadow: shadow,
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: "-0.03em",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 28,
    padding: "0 19px 0 24px",
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: 0,
    font: "inherit",
    color: "#17171b",
  },
  menu: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    padding: 0,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
  },
  properties: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 24,
    rowGap: 8,
    margin: 0,
    padding: "0 24px",
  },
  label: { display: "flex", alignItems: "center", gap: 8, height: 28, color: "#6b6b77" },
  value: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    height: 28,
    minWidth: 0,
    margin: 0,
    color: "#17171b",
    whiteSpace: "nowrap",
  },
  chip: {
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
};
