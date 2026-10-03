import { addPropertyControls, ControlType } from "framer";
import { type CSSProperties, useEffect, useRef, useState } from "react";

type AvatarColor = "blue" | "red" | "green" | "gray";

interface Person {
  name: string;
  email: string;
  /** Photo. Without one, the initials show on a gradient. */
  avatar?: { src: string; srcSet?: string };
  color?: AvatarColor;
}

interface PeopleListProps {
  title: string;
  people: Person[];
  onCopy?: () => void;
  style?: CSSProperties;
}

const ICONS = {
  buildings: [
    "M4 21v-15c0 -1 1 -2 2 -2h5c1 0 2 1 2 2v15",
    "M16 8h2c1 0 2 1 2 2v11",
    "M3 21h18",
    "M10 12v.01",
    "M10 16v.01",
    "M10 8v.01",
    "M7 12v.01",
    "M7 16v.01",
    "M7 8v.01",
    "M17 12v.01",
    "M17 16v.01",
  ],
  userCheck: ["M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0", "M6 21v-2a4 4 0 0 1 4 -4h4", "M15 19l2 2l4 -4"],
  mailbox: [
    "M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5",
    "M12 11v-8h4l2 2l-2 2h-4",
    "M6 15h1",
  ],
  copy: [
    "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
    "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
  ],
  check: ["M5 12l5 5l10 -10"],
};

/** Two soft color blobs over a vertical gradient, matching the design's placeholder avatars. */
const AVATARS: Record<AvatarColor, string> = {
  blue: "radial-gradient(71% 71% at -15% 21%, rgb(214 156 237 / 0.43), rgb(214 156 237 / 0)), radial-gradient(82% 82% at 94% 20%, rgb(255 156 52 / 0.38), rgb(255 156 52 / 0)), linear-gradient(#f1a7df, #4642ec)",
  red: "radial-gradient(107% 107% at 90% -7%, rgb(247 159 255), rgb(247 159 255 / 0)), radial-gradient(113% 113% at 66% 99%, rgb(245 40 47 / 0.94), rgb(245 40 47 / 0)), linear-gradient(#fffcf7, #f7608a)",
  green:
    "radial-gradient(116% 116% at 121% -12%, rgb(138 147 255 / 0.69), rgb(138 147 255 / 0)), radial-gradient(69% 69% at 150% 100%, rgb(191 224 142 / 0.74), rgb(191 224 142 / 0)), linear-gradient(#aff6df, #38b372)",
  gray: "radial-gradient(71% 71% at -15% 21%, rgb(222 222 236 / 0.5), rgb(222 222 236 / 0)), radial-gradient(82% 82% at 94% 20%, rgb(240 240 247 / 0.45), rgb(240 240 247 / 0)), linear-gradient(#c6c6d1, #6b6b77)",
};

const DEFAULT_PEOPLE: Person[] = [
  { name: "Liam Anderson", email: "l.anderson@acme.studio", color: "blue" },
  { name: "Mason Carter", email: "m.carter@acme.studio", color: "gray" },
  { name: "Evelyn Carter", email: "e.carter@acme.studio", color: "red" },
  { name: "Oliver Thompson", email: "o.thompson@acme.studio", color: "blue" },
  { name: "Noah Bennett", email: "n.bennett@acme.studio", color: "green" },
  { name: "Aiden Brooks", email: "a.brooks@acme.studio", color: "gray" },
  { name: "Ethan Sullivan", email: "e.sullivan@acme.studio", color: "blue" },
];

/** Hover, focus and touch states; everything else is inline. */
const CSS = `
[data-sc-people="email"] { color: #17171b; transition: color 0.15s; }
[data-sc-people="copy"] { opacity: 0; transition: opacity 0.15s; }
[data-sc-people="cell"]:focus-within [data-sc-people="email"] { color: #2867ef; }
[data-sc-people="cell"]:focus-within [data-sc-people="copy"], [data-sc-people="copy"][data-copied="true"] { opacity: 1; }
@media (hover: hover) {
  [data-sc-people="cell"]:hover [data-sc-people="email"] { color: #2867ef; }
  [data-sc-people="cell"]:hover [data-sc-people="copy"] { opacity: 1; }
}
@media (hover: none) { [data-sc-people="copy"] { opacity: 1; } }
[data-sc-people="email"]:focus-visible, [data-sc-people="copy"]:focus-visible { outline: 2px solid #2867ef; outline-offset: 1px; }
`;

/**
 * People table with avatars, names and emails. Hover an email to copy it.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 470
 */
export default function PeopleList({
  title = "People",
  people = DEFAULT_PEOPLE,
  onCopy,
  style,
}: PeopleListProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  async function copy(email: string) {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // Clipboard unavailable; the mailto link still works.
    }
    if (!mounted.current) return;
    setCopied(email);
    onCopy?.();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section style={{ ...styles.root, ...style }}>
      <style>{CSS}</style>
      <h2 style={styles.title}>
        <Icon paths={ICONS.buildings} color="#6b6b77" />
        {title}
      </h2>

      {/* An ARIA table on a grid: the email column only shrinks (and truncates) when space runs out. */}
      <div role="table" aria-label={title} style={styles.table}>
        <div role="row" style={{ ...styles.row, ...styles.headerRow }}>
          <div role="columnheader" style={styles.label}>
            <Icon paths={ICONS.userCheck} color="#6b6b77" />
            Name
          </div>
          <div role="columnheader" style={styles.label}>
            <Icon paths={ICONS.mailbox} color="#6b6b77" />
            Email
          </div>
        </div>
        {people.map((person, index) => {
          const isCopied = copied === person.email;
          return (
            <div role="row" key={`${person.email}-${index}`} style={styles.row}>
              <div role="cell" style={styles.person}>
                <Avatar person={person} />
                {person.name}
              </div>
              <div role="cell" data-sc-people="cell" style={styles.email}>
                <a data-sc-people="email" href={`mailto:${person.email}`} style={styles.link}>
                  {person.email}
                </a>
                <button
                  type="button"
                  data-sc-people="copy"
                  data-copied={isCopied}
                  onClick={() => copy(person.email)}
                  aria-label={`Copy ${person.email}`}
                  style={styles.copy}
                >
                  {isCopied ? (
                    <Icon paths={ICONS.check} color="#2867ef" />
                  ) : (
                    // Mirrored so the front sheet sits bottom-left, as in the design.
                    <Icon paths={ICONS.copy} color="#2867ef" mirrored />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p role="status" style={styles.srOnly}>
        {copied ? `Copied ${copied}` : ""}
      </p>
    </section>
  );
}

function Avatar({ person }: { person: Person }) {
  if (person.avatar?.src) {
    return (
      <img src={person.avatar.src} srcSet={person.avatar.srcSet} alt="" style={styles.photo} />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...styles.avatar, backgroundImage: AVATARS[person.color ?? "gray"] ?? AVATARS.gray }}
    >
      <span style={styles.initials}>{initials(person.name)}</span>
    </span>
  );
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words[words.length - 1] : "";
  return `${words[0]?.charAt(0) ?? ""}${last.charAt(0)}`.toUpperCase();
}

function Icon({ paths, color, mirrored }: { paths: string[]; color: string; mirrored?: boolean }) {
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
      style={{ flexShrink: 0, transform: mirrored ? "scaleX(-1)" : undefined }}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

addPropertyControls(PeopleList, {
  title: { type: ControlType.String, title: "Title", defaultValue: "People" },
  people: {
    type: ControlType.Array,
    title: "People",
    control: {
      type: ControlType.Object,
      controls: {
        name: { type: ControlType.String, title: "Name", defaultValue: "Liam Anderson" },
        email: { type: ControlType.String, title: "Email", defaultValue: "l.anderson@acme.studio" },
        avatar: { type: ControlType.ResponsiveImage, title: "Photo" },
        color: {
          type: ControlType.Enum,
          title: "Avatar",
          options: ["blue", "red", "green", "gray"],
          optionTitles: ["Blue", "Red", "Green", "Gray"],
          defaultValue: "blue",
        },
      },
    },
    defaultValue: DEFAULT_PEOPLE,
  },
  onCopy: { type: ControlType.EventHandler },
});

const styles: Record<string, CSSProperties> = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 24,
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
    font: "inherit",
    fontSize: 16,
    lineHeight: "19px",
    letterSpacing: "-0.02em",
  },
  table: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    columnGap: 24,
    rowGap: 8,
  },
  row: { gridColumn: "span 2", display: "grid", gridTemplateColumns: "subgrid" },
  headerRow: { marginBottom: 4, color: "#6b6b77" },
  label: { display: "flex", alignItems: "center", gap: 8 },
  person: { display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" },
  email: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  link: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderRadius: 2,
    textDecoration: "none",
  },
  copy: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    margin: -4,
    padding: 4,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
  },
  photo: { width: 32, height: 32, flexShrink: 0, borderRadius: "50%", objectFit: "cover" },
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 32,
    height: 32,
    borderRadius: "50%",
    boxShadow: "inset 0 1px 4px rgba(255, 255, 255, 0.3)",
  },
  initials: {
    backgroundImage: "linear-gradient(#fafafa 25%, rgba(255, 255, 255, 0.5) 72.5%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    fontFamily: '"Geist", "Inter", sans-serif',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: "20px",
    letterSpacing: "-0.03em",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
};
