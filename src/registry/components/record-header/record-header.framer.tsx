import { addPropertyControls, ControlType } from "framer";
import { type CSSProperties, useEffect, useState } from "react";

interface RecordHeaderProps {
  name: string;
  logo?: string;
  website: string;
  favorite: boolean;
  onFavoriteChange?: (favorite: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  style?: CSSProperties;
}

const ICONS = {
  star: [
    "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245",
  ],
  edit: ["M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4", "M13.5 6.5l4 4"],
  delete: [
    "M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16",
  ],
};

/** Hover and focus states; inline styles can't express them. */
const css = `
  [data-sc-record-header="favorite"][aria-pressed="false"]:hover { color: #6b6b77 !important; }
  [data-sc-record-header="website"]:hover { color: #17171b !important; }
  [data-sc-record-header="button"]:hover { background: #fafafa !important; }
  [data-sc-record-header="button"]:hover svg[data-tone="muted"] { stroke: #6b6b77; }
  [data-sc-record-header]:focus-visible { outline: 2px solid #2867ef; outline-offset: 1px; }
`;

/**
 * Record header with a logo, name, favorite star, website and Edit / Delete actions.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1412
 */
export default function RecordHeader({
  name = "Acme Inc",
  logo,
  website = "www.acme.studio",
  favorite = false,
  onFavoriteChange,
  onEdit,
  onDelete,
  style,
}: RecordHeaderProps) {
  const [isFavorite, setFavorite] = useState(favorite);
  useEffect(() => setFavorite(favorite), [favorite]);
  const site = website.replace(/^https?:\/\//, "");
  const href = /^https?:\/\//.test(website) ? website : `https://${site}`;

  function toggleFavorite() {
    setFavorite(!isFavorite);
    onFavoriteChange?.(!isFavorite);
  }

  return (
    <header style={{ ...styles.header, ...style }}>
      <style>{css}</style>
      <div style={styles.lead}>
        <div style={styles.identity}>
          {logo ? <img src={logo} alt="" style={styles.logo} /> : <LogoMark />}
          <h1 style={styles.name}>{name}</h1>
          <button
            type="button"
            data-sc-record-header="favorite"
            aria-label="Favorite"
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
            style={{ ...styles.favorite, color: isFavorite ? "#f5a524" : "#c6c6d1" }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.85}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={ICONS.star[0]} />
            </svg>
          </button>
        </div>
        {site && (
          <>
            <span aria-hidden="true" style={styles.dot} />
            <a
              data-sc-record-header="website"
              href={href}
              target="_blank"
              rel="noreferrer"
              style={styles.website}
            >
              {site}
            </a>
          </>
        )}
      </div>
      <div style={styles.actions}>
        <button type="button" data-sc-record-header="button" onClick={onEdit} style={styles.button}>
          <Icon paths={ICONS.edit} color="#c6c6d1" muted />
          Edit
        </button>
        <button
          type="button"
          data-sc-record-header="button"
          onClick={onDelete}
          style={styles.button}
        >
          <Icon paths={ICONS.delete} color="#e00d29" />
          Delete
        </button>
      </div>
    </header>
  );
}

/** Fallback logo: a gradient disc with a white mark. */
function LogoMark() {
  return (
    <span aria-hidden="true" style={styles.mark}>
      <svg
        viewBox="0 0 16 16"
        width={16}
        height={16}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.4}
        strokeLinecap="round"
      >
        <path d="M1.7 7.2 7.3 2.3" />
        <path d="m5.2 10.3 5.6-4.9" opacity={0.9} />
        <path d="m8.2 13.3 5.6-4.9" opacity={0.8} />
      </svg>
    </span>
  );
}

function Icon({
  paths,
  color,
  muted = false,
}: {
  paths: string[];
  color: string;
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
      strokeWidth={1.5}
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

addPropertyControls(RecordHeader, {
  name: { type: ControlType.String, title: "Name", defaultValue: "Acme Inc" },
  logo: { type: ControlType.Image, title: "Logo" },
  website: { type: ControlType.String, title: "Website", defaultValue: "www.acme.studio" },
  favorite: { type: ControlType.Boolean, title: "Favorite", defaultValue: false },
  onFavoriteChange: { type: ControlType.EventHandler },
  onEdit: { type: ControlType.EventHandler },
  onDelete: { type: ControlType.EventHandler },
});

const shadow =
  "0 0.5px 0.5px 0.25px rgba(154, 157, 166, 0.03), 0 1.4px 1.4px -0.7px rgba(44, 51, 69, 0.04)";

const ellipsis: CSSProperties = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const styles: Record<string, CSSProperties> = {
  header: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
    padding: "8px 16px",
    borderRadius: "6px 6px 0 0",
    background: "#ffffff",
    boxShadow: "0 6px 20px rgba(27, 19, 94, 0.03)",
    color: "#17171b",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "normal",
    letterSpacing: "-0.03em",
  },
  lead: { display: "flex", alignItems: "center", gap: 16, minWidth: 0 },
  identity: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  mark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: "50%",
    background:
      "radial-gradient(90% 80% at 10% 0%, rgba(190, 255, 235, 0.9), transparent 70%), radial-gradient(90% 80% at 100% 10%, rgba(170, 215, 245, 0.95), transparent 75%), linear-gradient(#8ad6c2, #62c896 55%, #46be7b)",
    boxShadow: "inset 0 1px 4px rgba(255, 255, 255, 0.3), 0 0 0 0.2px rgba(40, 18, 18, 0.16)",
  },
  logo: {
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 0 0 0.5px rgba(40, 18, 18, 0.16)",
  },
  name: { ...ellipsis, margin: 0, font: "inherit", fontWeight: 600, letterSpacing: "inherit" },
  favorite: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    flexShrink: 0,
    margin: -4,
    padding: 0,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
    transition: "color 0.15s",
  },
  dot: { width: 4, height: 4, flexShrink: 0, borderRadius: "50%", background: "#c6c6d1" },
  website: {
    ...ellipsis,
    borderRadius: 2,
    color: "#6b6b77",
    textDecoration: "none",
    transition: "color 0.15s",
  },
  actions: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  button: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 36,
    flexShrink: 0,
    padding: "0 12px",
    border: "1px solid rgba(178, 191, 191, 0.15)",
    borderRadius: 8,
    background: "linear-gradient(rgba(255, 255, 255, 0), #ffffff)",
    boxShadow: shadow,
    color: "#17171b",
    font: "inherit",
    letterSpacing: "inherit",
    cursor: "pointer",
  },
};
