import { addPropertyControls, ControlType } from "framer";
import { type CSSProperties, Fragment } from "react";

type ActivityIcon = "eye" | "mail" | "click" | "map" | "confetti";
type AvatarColor = "blue" | "red" | "green" | "gray";

interface Segment {
  type: "text" | "person" | "chip" | "link";
  /** The text, the person's name or the chip label. */
  text: string;
  /** Link URL (links only). */
  link?: string;
  /** Photo (people only). */
  avatar?: { src: string; srcSet?: string };
  /** Initials gradient when there's no photo (people only). */
  color?: AvatarColor;
}

interface ActivityEvent {
  icon: ActivityIcon;
  segments: Segment[];
  time: string;
}

interface Day {
  label: string;
  events: ActivityEvent[];
}

interface ActivityTimelineProps {
  title: string;
  dateRange: string;
  groups: Day[];
  onDateRangeClick?: () => void;
  style?: CSSProperties;
}

const ICONS = {
  trendingUp: ["M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"],
  calendar: [
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  ],
  chevronDown: ["M19 9l-7 7-7-7"],
};

/** 12px event icons: Heroicons v1 solid (20px grid), Heroicons v1 outline map, Tabler filled confetti. */
const EVENT_ICONS: Record<
  ActivityIcon,
  { viewBox: string; fillRule?: "evenodd" | "nonzero"; paths: string[] }
> = {
  eye: {
    viewBox: "0 0 20 20",
    fillRule: "evenodd",
    paths: [
      "M10 12a2 2 0 100-4 2 2 0 000 4z",
      "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
    ],
  },
  mail: {
    viewBox: "0 0 20 20",
    fillRule: "evenodd",
    paths: [
      "M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z",
    ],
  },
  click: {
    viewBox: "0 0 20 20",
    fillRule: "evenodd",
    paths: [
      "M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z",
    ],
  },
  map: {
    viewBox: "0 0 24 24",
    paths: [
      "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    ],
  },
  confetti: {
    viewBox: "0 0 24 24",
    fillRule: "nonzero",
    paths: [
      "M3 5a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 1 1 -2 0a1 1 0 0 1 -1 -1m7.53 -1.243a1 1 0 1 1 1.94 .486l-.5 2a1 1 0 1 1 -1.94 -.486zm6.47 1.243a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 0 1 -2 0a1 1 0 0 1 -1 -1m-8.81 4.293l6.517 6.518a1 1 0 0 1 -.29 1.617l-9.573 4.387a2 2 0 0 1 -2.661 -2.652l4.39 -9.58a1 1 0 0 1 1.616 -.29m7.517 -1a1 1 0 0 1 0 1.414l-1 1a1 1 0 0 1 -1.414 -1.414l1 -1a1 1 0 0 1 1.414 0m4.05 3.237a1 1 0 0 1 .486 1.94l-2 .5a1 1 0 0 1 -.486 -1.94zm-2.756 7.47a1 1 0 0 1 1 -1a1 1 0 0 1 1.993 -.117l.007 .117a1 1 0 0 1 .117 1.993l-.117 .007a1 1 0 0 1 -2 0a1 1 0 0 1 -1 -1",
    ],
  },
};

/** Two soft color blobs over a vertical gradient, matching the design's placeholder avatars. */
const AVATARS: Record<AvatarColor, string> = {
  blue: "radial-gradient(71% 71% at -15% 21%, rgb(214 156 237 / 0.43), rgb(214 156 237 / 0)), radial-gradient(82% 82% at 94% 20%, rgb(255 156 52 / 0.38), rgb(255 156 52 / 0)), linear-gradient(#f1a7df, #4642ec)",
  red: "radial-gradient(107% 107% at 90% -7%, rgb(247 159 255), rgb(247 159 255 / 0)), radial-gradient(113% 113% at 66% 99%, rgb(245 40 47 / 0.94), rgb(245 40 47 / 0)), linear-gradient(#fffcf7, #f7608a)",
  green:
    "radial-gradient(116% 116% at 121% -12%, rgb(138 147 255 / 0.69), rgb(138 147 255 / 0)), radial-gradient(69% 69% at 150% 100%, rgb(191 224 142 / 0.74), rgb(191 224 142 / 0)), linear-gradient(#aff6df, #38b372)",
  gray: "radial-gradient(71% 71% at -15% 21%, rgb(222 222 236 / 0.5), rgb(222 222 236 / 0)), radial-gradient(82% 82% at 94% 20%, rgb(240 240 247 / 0.45), rgb(240 240 247 / 0)), linear-gradient(#c6c6d1, #6b6b77)",
};

const SUBJECT: Segment = { type: "chip", text: "You’re missing something important! 🏆" };

const DEFAULT_GROUPS: Day[] = [
  {
    label: "Today, May 06, 2025",
    events: [
      {
        icon: "eye",
        segments: [
          SUBJECT,
          { type: "text", text: "email has been delivered to" },
          { type: "person", text: "Liam Anderson", color: "blue" },
        ],
        time: "7:32 AM",
      },
      {
        icon: "mail",
        segments: [
          { type: "person", text: "Mason Carter", color: "gray" },
          { type: "text", text: "viewed email" },
          SUBJECT,
        ],
        time: "9:12 AM",
      },
      {
        icon: "click",
        segments: [
          { type: "person", text: "Evelyn Carter", color: "red" },
          { type: "text", text: "clicked" },
          { type: "chip", text: "Find out more" },
          { type: "text", text: "in" },
          SUBJECT,
        ],
        time: "9:13 AM",
      },
      {
        icon: "map",
        segments: [
          { type: "person", text: "Ethan Sullivan", color: "blue" },
          { type: "text", text: "spent 3 minutes 32 seconds on" },
          { type: "link", text: "www.acme.com/products", link: "https://www.acme.com/products" },
        ],
        time: "9:16 AM",
      },
    ],
  },
  {
    label: "May 01, 2025",
    events: [
      {
        icon: "confetti",
        segments: [
          { type: "person", text: "Noah Bennett", color: "green" },
          { type: "text", text: "subscribed for a newsletter" },
        ],
        time: "11:54 PM",
      },
      {
        icon: "eye",
        segments: [
          { type: "person", text: "Aiden Brooks", color: "gray" },
          { type: "text", text: "visited page" },
          {
            type: "link",
            text: "www.acme.com/products-sales",
            link: "https://www.acme.com/products-sales",
          },
        ],
        time: "11:44 PM",
      },
    ],
  },
];

/** Hover and focus states; everything else is inline. */
const CSS = `
[data-sc-activity="range"], [data-sc-activity="link"] { background: #ffffff; transition: background-color 0.15s, color 0.15s; }
[data-sc-activity="range"]:hover, [data-sc-activity="link"]:hover { background: #fafafa; }
[data-sc-activity="link"] { color: #6b6b77; }
[data-sc-activity="link"]:hover { color: #17171b; }
[data-sc-activity="range"]:focus-visible, [data-sc-activity="link"]:focus-visible { outline: 2px solid #2867ef; outline-offset: 1px; }
`;

/**
 * Day-by-day activity feed with event icons on a timeline, people, chips and links.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 940
 */
export default function ActivityTimeline({
  title = "Activity",
  dateRange = "Jan 20, 2023 - May 08, 2025",
  groups = DEFAULT_GROUPS,
  onDateRangeClick,
  style,
}: ActivityTimelineProps) {
  return (
    <section style={{ ...styles.root, ...style }}>
      <style>{CSS}</style>
      <header style={styles.header}>
        <h2 style={styles.title}>
          <Icon paths={ICONS.trendingUp} color="#c6c6d1" />
          {title}
        </h2>
        {dateRange && (
          <button
            type="button"
            onClick={onDateRangeClick}
            data-sc-activity="range"
            aria-label={`Date range: ${dateRange}`}
            style={styles.range}
          >
            <Icon paths={ICONS.calendar} color="#c6c6d1" />
            {dateRange}
            <Icon paths={ICONS.chevronDown} color="#c6c6d1" size={16} opacity={0.5} />
          </button>
        )}
      </header>

      {groups.map((group, index) => (
        <section key={`${group.label}-${index}`} style={styles.day}>
          <h3 style={styles.date}>
            {group.label}
            <span aria-hidden="true" style={styles.divider} />
          </h3>
          <ol style={styles.events}>
            {(group.events ?? []).map((event, eventIndex) => (
              <EventRow
                key={eventIndex}
                event={event}
                last={eventIndex === (group.events ?? []).length - 1}
              />
            ))}
          </ol>
        </section>
      ))}
    </section>
  );
}

function EventRow({ event, last }: { event: ActivityEvent; last: boolean }) {
  return (
    <li style={{ ...styles.event, paddingBottom: last ? 0 : 36 }}>
      {!last && <span aria-hidden="true" style={styles.connector} />}
      <span style={styles.type}>
        <EventIcon icon={event.icon} />
      </span>
      <p style={styles.sentence}>
        {(event.segments ?? []).map((segment, index) => (
          <Fragment key={index}>
            <SegmentView segment={segment} />{" "}
          </Fragment>
        ))}
        <span style={styles.time}>
          <span aria-hidden="true" style={styles.dot} />
          {event.time}
        </span>
      </p>
    </li>
  );
}

function SegmentView({ segment }: { segment: Segment }) {
  switch (segment.type) {
    case "person":
      return (
        <span style={styles.person}>
          <Avatar name={segment.text} photo={segment.avatar} color={segment.color} />
          {segment.text}
        </span>
      );
    case "chip":
      return (
        <span style={{ ...styles.chip, ...styles.chipColors }}>
          <span style={styles.truncate}>{segment.text}</span>
        </span>
      );
    case "link":
      return (
        <a href={segment.link} data-sc-activity="link" style={styles.chip}>
          <span style={styles.truncate}>{segment.text}</span>
        </a>
      );
    default:
      return <span>{segment.text}</span>;
  }
}

function Avatar({
  name,
  photo,
  color = "gray",
}: {
  name: string;
  photo?: { src: string; srcSet?: string };
  color?: AvatarColor;
}) {
  if (photo?.src) return <img src={photo.src} srcSet={photo.srcSet} alt="" style={styles.photo} />;
  return (
    <span
      aria-hidden="true"
      style={{ ...styles.avatar, backgroundImage: AVATARS[color] ?? AVATARS.gray }}
    >
      <span style={styles.initials}>{initials(name)}</span>
    </span>
  );
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words[words.length - 1] : "";
  return `${words[0]?.charAt(0) ?? ""}${last.charAt(0)}`.toUpperCase();
}

function EventIcon({ icon }: { icon: ActivityIcon }) {
  const { viewBox, fillRule, paths } = EVENT_ICONS[icon] ?? EVENT_ICONS.eye;
  const paint = fillRule
    ? { fill: "#9292a6", fillRule }
    : {
        fill: "none",
        stroke: "#9292a6",
        strokeWidth: 1.5,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
      };
  return (
    <svg aria-hidden="true" viewBox={viewBox} width={12} height={12} {...paint}>
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function Icon({
  paths,
  color,
  size = 18,
  opacity = 1,
}: {
  paths: string[];
  color: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, opacity }}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const segmentControls = {
  type: {
    type: ControlType.Enum,
    title: "Type",
    options: ["text", "person", "chip", "link"],
    optionTitles: ["Text", "Person", "Chip", "Link"],
    defaultValue: "text",
  },
  text: { type: ControlType.String, title: "Text", defaultValue: "visited page" },
  link: { type: ControlType.Link, title: "Link" },
  avatar: { type: ControlType.ResponsiveImage, title: "Photo" },
  color: {
    type: ControlType.Enum,
    title: "Avatar",
    options: ["blue", "red", "green", "gray"],
    optionTitles: ["Blue", "Red", "Green", "Gray"],
    defaultValue: "gray",
  },
};

addPropertyControls(ActivityTimeline, {
  title: { type: ControlType.String, title: "Title", defaultValue: "Activity" },
  dateRange: {
    type: ControlType.String,
    title: "Date range",
    defaultValue: "Jan 20, 2023 - May 08, 2025",
  },
  groups: {
    type: ControlType.Array,
    title: "Days",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type: ControlType.String, title: "Date", defaultValue: "Today" },
        events: {
          type: ControlType.Array,
          title: "Events",
          control: {
            type: ControlType.Object,
            controls: {
              icon: {
                type: ControlType.Enum,
                title: "Icon",
                options: ["eye", "mail", "click", "map", "confetti"],
                optionTitles: ["Eye", "Envelope", "Click", "Map", "Confetti"],
                defaultValue: "eye",
              },
              segments: {
                type: ControlType.Array,
                title: "Sentence",
                control: { type: ControlType.Object, controls: segmentControls },
              },
              time: { type: ControlType.String, title: "Time", defaultValue: "9:12 AM" },
            },
          },
        },
      },
    },
    defaultValue: DEFAULT_GROUPS,
  },
  onDateRangeClick: { type: ControlType.EventHandler },
});

const shadow =
  "0 0.5px 0.5px 0.25px rgba(154, 157, 166, 0.03), 0 1.4px 1.4px -0.7px rgba(44, 51, 69, 0.04)";

const styles: Record<string, CSSProperties> = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 24,
    background: "#ffffff",
    color: "#17171b",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "normal",
    letterSpacing: "-0.03em",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 36,
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
  range: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 36,
    padding: "0 11px",
    border: "1px solid #f4f4fb",
    borderRadius: 8,
    boxShadow: shadow,
    font: "inherit",
    color: "#17171b",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  day: { display: "flex", flexDirection: "column", gap: 24 },
  date: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    margin: 0,
    font: "inherit",
    color: "#6b6b77",
  },
  divider: { flex: 1, height: 1, background: "#f4f4fb" },
  events: { display: "flex", flexDirection: "column", margin: 0, padding: 0, listStyle: "none" },
  event: { position: "relative", display: "flex", gap: 12 },
  connector: {
    position: "absolute",
    top: 37,
    bottom: 5,
    left: 15.25,
    width: 1.5,
    background: "#c6c6d1",
  },
  type: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 32,
    height: 28,
    marginTop: 2,
  },
  sentence: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
    minHeight: 32,
    margin: 0,
  },
  person: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  chip: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
    minWidth: 0,
    height: 32,
    padding: "0 8px",
    border: "0.5px solid #f4f4fb",
    borderRadius: 6,
    boxShadow: shadow,
    textDecoration: "none",
  },
  chipColors: { background: "#ffffff", color: "#6b6b77" },
  truncate: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  time: { display: "flex", alignItems: "center", gap: 8, color: "#6b6b77" },
  dot: { width: 2, height: 2, borderRadius: "50%", background: "currentColor" },
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
};
