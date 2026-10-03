import { addPropertyControls, ControlType } from "framer";
import { type CSSProperties, useId, useState } from "react";

type IconName =
  | "mail"
  | "globe"
  | "photo"
  | "map"
  | "book"
  | "palette"
  | "chart"
  | "cart"
  | "settings";

interface Item {
  label: string;
  icon: IconName | "none";
  link: string;
  /** Nests the item under the closest item above it that isn't a sub-item. */
  sub: boolean;
  active: boolean;
  /** Start the group expanded (groups with an active sub-item always start expanded). */
  expanded: boolean;
}

interface AppSidebarProps {
  workspace: string;
  logo?: string;
  newChatLabel: string;
  historyLabel: string;
  historyLink: string;
  items: Item[];
  showProgress: boolean;
  progressLabel: string;
  progressLink: string;
  completed: number;
  total: number;
  userName: string;
  userEmail: string;
  avatar?: string;
  onNewChat?: () => void;
  onCollapse?: () => void;
  style?: CSSProperties;
}

const ICONS: Record<IconName | "chat" | "chevron", string[]> = {
  chat: [
    "M7 2h10",
    "M5 6h14",
    "M5 10h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z",
  ],
  mail: [
    "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
    "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  ],
  globe: [
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  ],
  photo: [
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  ],
  map: ["M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13", "M9 4v13", "M15 7v13"],
  book: [
    "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  ],
  palette: [
    "M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25",
    "M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  ],
  chart: [
    "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  ],
  cart: [
    "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  ],
  settings: [
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  ],
  chevron: ["M6 9l6 6l6 -6"],
};

const ICON_NAMES: IconName[] = [
  "mail",
  "globe",
  "photo",
  "map",
  "book",
  "palette",
  "chart",
  "cart",
  "settings",
];

/** Hover and focus states; inline styles can't express them. */
const css = `
  [data-sc-app-sidebar="row"], [data-sc-app-sidebar="sub"] { background: transparent; transition: background-color 0.15s, color 0.15s; }
  [data-sc-app-sidebar="row"] { color: #fafafa; }
  [data-sc-app-sidebar="sub"] { color: #8b8b8d; }
  [data-sc-app-sidebar="row"]:hover, [data-sc-app-sidebar="sub"]:hover { background: rgba(244, 244, 251, 0.04); }
  [data-sc-app-sidebar="sub"]:hover { color: #fafafa; }
  [data-sc-app-sidebar][aria-current="page"] { background: rgba(244, 244, 251, 0.06); color: #ffffff; }
  [data-sc-app-sidebar="new-chat"] { background: #ffffff; transition: background-color 0.15s; }
  [data-sc-app-sidebar="new-chat"]:hover { background: #f4f4f5; }
  [data-sc-app-sidebar="collapse"] { background: transparent; transition: background-color 0.15s; }
  [data-sc-app-sidebar="collapse"]:hover { background: rgba(244, 244, 251, 0.08); }
  [data-sc-app-sidebar="progress"] { transition: opacity 0.15s; }
  [data-sc-app-sidebar="progress"]:hover { opacity: 0.8; }
  [data-sc-app-sidebar]:focus-visible { outline: 2px solid #2867ef; outline-offset: -2px; }
  [data-sc-app-sidebar="new-chat"]:focus-visible, [data-sc-app-sidebar="progress"]:focus-visible { outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { [data-sc-app-sidebar-motion] { transition: none !important; } }
`;

/**
 * Dark app sidebar: workspace header, New chat, collapsible nav groups, onboarding progress and the user.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 218
 * @framerIntrinsicHeight 960
 */
export default function AppSidebar({
  workspace = "Acme Workspace",
  logo,
  newChatLabel = "New chat",
  historyLabel = "Chat History",
  historyLink = "",
  items = DEFAULT_ITEMS,
  showProgress = true,
  progressLabel = "Getting started",
  progressLink = "",
  completed = 2,
  total = 5,
  userName = "Alex Morgan",
  userEmail = "alex@acme.studio",
  avatar,
  onNewChat,
  onCollapse,
  style,
}: AppSidebarProps) {
  const [toggled, setToggled] = useState<Record<number, boolean>>({});
  const uid = useId();

  // Sub-items belong to the closest item above them.
  const groups: { index: number; item: Item; children: Item[] }[] = [];
  items.forEach((item, index) => {
    const parent = groups[groups.length - 1];
    if (item.sub && parent) parent.children.push(item);
    else groups.push({ index, item, children: [] });
  });

  return (
    <aside aria-label="Sidebar" style={{ ...styles.root, ...style }}>
      <style>{css}</style>
      <div style={styles.header}>
        <div style={styles.workspace}>
          {logo ? <img src={logo} alt="" style={styles.logo} /> : <WorkspaceMark />}
          <span style={styles.ellipsis}>{workspace}</span>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          data-sc-app-sidebar="collapse"
          style={styles.collapse}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4.5" y="6" width="15" height="12" rx="2" />
            <path d="M8.25 9v6" />
          </svg>
        </button>
      </div>

      <div style={styles.scroll}>
        <div style={styles.slot}>
          <button
            type="button"
            onClick={onNewChat}
            data-sc-app-sidebar="new-chat"
            style={styles.newChat}
          >
            <Icon paths={ICONS.chat} color="#09090b" />
            <span style={styles.ellipsis}>{newChatLabel}</span>
          </button>
        </div>
        <div style={styles.slot}>
          <a href={historyLink || "#"} data-sc-app-sidebar="row" style={styles.row}>
            <Icon paths={ICONS.chat} />
            <span style={styles.label}>{historyLabel}</span>
          </a>
        </div>
        <hr style={styles.divider} />
        <nav aria-label="Main" style={styles.nav}>
          <ul style={styles.list}>
            {groups.map(({ index, item, children }) => {
              if (children.length === 0) {
                return (
                  <li key={index}>
                    <a
                      href={item.link || "#"}
                      aria-current={item.active ? "page" : undefined}
                      data-sc-app-sidebar="row"
                      style={styles.row}
                    >
                      <ItemIcon name={item.icon} />
                      <span style={styles.label}>{item.label}</span>
                    </a>
                  </li>
                );
              }
              const open =
                toggled[index] ?? (item.expanded || children.some((child) => child.active));
              const id = `${uid}-group-${index}`;
              return (
                <li key={index}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={id}
                    onClick={() => setToggled({ ...toggled, [index]: !open })}
                    data-sc-app-sidebar="row"
                    style={styles.row}
                  >
                    <ItemIcon name={item.icon} />
                    <span style={styles.label}>{item.label}</span>
                    <span
                      data-sc-app-sidebar-motion=""
                      style={{
                        ...styles.chevron,
                        color: open ? "#ffffff" : "#8b8b8d",
                        transform: open ? "none" : "rotate(-90deg)",
                      }}
                    >
                      <Icon paths={ICONS.chevron} />
                    </span>
                  </button>
                  <div
                    id={id}
                    data-sc-app-sidebar-motion=""
                    style={{
                      ...styles.collapsible,
                      gridTemplateRows: open ? "1fr" : "0fr",
                      visibility: open ? "visible" : "hidden",
                    }}
                  >
                    <div style={styles.clip}>
                      <ul style={styles.subList}>
                        {children.map((child, childIndex) => (
                          <li key={childIndex}>
                            <a
                              href={child.link || "#"}
                              aria-current={child.active ? "page" : undefined}
                              data-sc-app-sidebar="sub"
                              style={styles.sub}
                            >
                              <span style={styles.ellipsis}>{child.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div style={styles.footer}>
        {showProgress && (
          <a href={progressLink || "#"} data-sc-app-sidebar="progress" style={styles.progress}>
            <span style={styles.ellipsis}>{progressLabel}</span>
            <span style={styles.count}>
              <span aria-hidden="true">
                {completed}/{total}
              </span>
              <span style={styles.srOnly}>
                {completed} of {total} completed
              </span>
              <ProgressRing value={total > 0 ? completed / total : 0} />
            </span>
          </a>
        )}
        <div style={styles.user}>
          <span style={styles.avatar}>
            {avatar ? (
              <img src={avatar} alt="" style={styles.avatarImage} />
            ) : (
              <span aria-hidden="true">{userName.trim().charAt(0).toUpperCase()}</span>
            )}
          </span>
          <span style={styles.userText}>
            <span style={styles.ellipsis}>{userName}</span>
            <span style={{ ...styles.ellipsis, fontSize: 12, color: "#8b8b8d" }}>{userEmail}</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

function ProgressRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 8.5;
  const progress = Math.min(1, Math.max(0, value));
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      width={20}
      height={20}
      style={{ flexShrink: 0, transform: "rotate(-90deg)" }}
    >
      <circle cx="10" cy="10" r="8.5" fill="none" stroke="#6a6a78" strokeWidth={3} />
      <circle
        cx="10"
        cy="10"
        r="8.5"
        fill="none"
        stroke="#04bb6f"
        strokeWidth={3}
        strokeDasharray={`${progress * circumference} ${circumference}`}
        data-sc-app-sidebar-motion=""
        style={{ transition: "stroke-dasharray 0.5s" }}
      />
    </svg>
  );
}

function ItemIcon({ name }: { name: Item["icon"] }) {
  return ICON_NAMES.includes(name as IconName) ? <Icon paths={ICONS[name as IconName]} /> : null;
}

/** Neutral stand-in logo; set the Logo control to use your own. */
function WorkspaceMark() {
  return (
    <span aria-hidden="true" style={styles.mark}>
      <svg viewBox="0 0 22 22" width={22} height={22}>
        <path
          d="M11 6.25 15.5 14.5h-9z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Icon({ paths, color = "currentColor" }: { paths: string[]; color?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke={color}
      strokeWidth={2}
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

const item = (label: string, icon: Item["icon"], extra: Partial<Item> = {}): Item => ({
  label,
  icon,
  link: "",
  sub: false,
  active: false,
  expanded: false,
  ...extra,
});
const sub = (label: string, active = false) => item(label, "none", { sub: true, active });

const DEFAULT_ITEMS: Item[] = [
  item("Email", "mail"),
  sub("Campaigns"),
  sub("Templates"),
  sub("Automations"),
  item("Web", "globe"),
  sub("Pages"),
  sub("Forms"),
  sub("Pop-ups"),
  item("Assets", "photo"),
  item("Journey", "map"),
  item("Blog", "book"),
  item("Brand", "palette"),
  item("Audience", "chart"),
  sub("Dashboard"),
  sub("People"),
  sub("Companies", true),
  sub("Segments"),
  sub("Session Replay"),
  item("Commerce", "cart"),
  sub("Products"),
  sub("Orders"),
  sub("Discounts"),
  item("Settings", "settings"),
  sub("General"),
  sub("Members"),
  sub("Billing"),
];

addPropertyControls(AppSidebar, {
  workspace: { type: ControlType.String, title: "Workspace", defaultValue: "Acme Workspace" },
  logo: { type: ControlType.Image, title: "Logo" },
  newChatLabel: { type: ControlType.String, title: "New Chat", defaultValue: "New chat" },
  historyLabel: { type: ControlType.String, title: "History", defaultValue: "Chat History" },
  historyLink: { type: ControlType.Link, title: "History Link", defaultValue: "" },
  items: {
    type: ControlType.Array,
    title: "Items",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type: ControlType.String, title: "Label", defaultValue: "Item" },
        icon: {
          type: ControlType.Enum,
          title: "Icon",
          options: [...ICON_NAMES, "none"],
          optionTitles: [
            "Mail",
            "Globe",
            "Photo",
            "Map",
            "Book",
            "Palette",
            "Chart",
            "Cart",
            "Settings",
            "None",
          ],
          defaultValue: "none",
        },
        link: { type: ControlType.Link, title: "Link", defaultValue: "" },
        sub: { type: ControlType.Boolean, title: "Sub-item", defaultValue: false },
        active: { type: ControlType.Boolean, title: "Active", defaultValue: false },
        expanded: { type: ControlType.Boolean, title: "Expanded", defaultValue: false },
      },
    },
    defaultValue: DEFAULT_ITEMS,
  },
  showProgress: { type: ControlType.Boolean, title: "Progress", defaultValue: true },
  progressLabel: {
    type: ControlType.String,
    title: "Progress Label",
    defaultValue: "Getting started",
  },
  progressLink: { type: ControlType.Link, title: "Progress Link", defaultValue: "" },
  completed: { type: ControlType.Number, title: "Completed", min: 0, step: 1, defaultValue: 2 },
  total: { type: ControlType.Number, title: "Total", min: 1, step: 1, defaultValue: 5 },
  userName: { type: ControlType.String, title: "User", defaultValue: "Alex Morgan" },
  userEmail: { type: ControlType.String, title: "Email", defaultValue: "alex@acme.studio" },
  avatar: { type: ControlType.Image, title: "Avatar" },
  onNewChat: { type: ControlType.EventHandler },
  onCollapse: { type: ControlType.EventHandler },
});

const ellipsis: CSSProperties = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const reset: CSSProperties = {
  boxSizing: "border-box",
  margin: 0,
  border: 0,
  font: "inherit",
  color: "inherit",
  textAlign: "left",
  textDecoration: "none",
  cursor: "pointer",
};

const styles: Record<string, CSSProperties> = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    width: 218,
    height: 960,
    overflow: "hidden",
    padding: "32px 10px",
    background: "#17171b",
    color: "#fafafa",
    fontFamily: '"Geist", "Inter", sans-serif',
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 400,
    letterSpacing: 0,
  },
  ellipsis,
  label: { ...ellipsis, flex: 1, minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    height: 24,
    flexShrink: 0,
    padding: "0 7px",
  },
  workspace: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  logo: { width: 22, height: 22, flexShrink: 0, borderRadius: 5, objectFit: "cover" },
  mark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: 5,
    background:
      "radial-gradient(circle at 85% 10%, rgba(240, 135, 255, 0.75), transparent 60%), linear-gradient(140deg, #6a4df4, #441fb4 55%, #29117a)",
    boxShadow:
      "inset 0 1px 0.85px -0.3px rgba(255, 255, 255, 0.45), inset 0 -0.7px 0.95px rgba(0, 0, 0, 0.12)",
  },
  collapse: {
    ...reset,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    flexShrink: 0,
    padding: 0,
    borderRadius: 6,
    color: "#ffffff",
  },
  scroll: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    marginTop: 16,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#3f3f44 transparent",
  },
  slot: { flexShrink: 0, padding: 8 },
  newChat: {
    ...reset,
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    height: 36,
    padding: "0 16px",
    border: "1px solid #e4e4e7",
    borderRadius: 6,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    color: "#1b1b34",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
  },
  row: {
    ...reset,
    color: undefined,
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    height: 36,
    padding: "0 16px",
    borderRadius: 6,
  },
  chevron: { display: "flex", flexShrink: 0, transition: "transform 0.2s, color 0.2s" },
  divider: { flexShrink: 0, margin: 0, border: 0, borderTop: "1px solid #3f3f44" },
  nav: { padding: "8px 8px 0" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  collapsible: { display: "grid", transition: "grid-template-rows 0.2s ease-out, visibility 0.2s" },
  clip: { minHeight: 0, overflow: "hidden" },
  subList: { margin: 0, padding: "4px 0 0", listStyle: "none" },
  sub: {
    ...reset,
    color: undefined,
    display: "flex",
    alignItems: "center",
    height: 36,
    marginLeft: 23,
    padding: "0 16px",
    borderRadius: 6,
    fontSize: 12,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    flexShrink: 0,
    marginTop: 24,
    padding: "0 6px",
  },
  progress: {
    ...reset,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 2,
  },
  count: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 },
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
  user: { display: "flex", alignItems: "center", gap: 8 },
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: 4,
    background: "#ef6c00",
  },
  avatarImage: { width: "100%", height: "100%", objectFit: "cover" },
  userText: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
};
