import { addPropertyControls, ControlType } from "framer";
import type { CSSProperties } from "react";

interface Crumb {
  label: string;
  link: string;
}

interface BreadcrumbBarProps {
  items: Crumb[];
  style?: CSSProperties;
}

/** Hover and focus states; inline styles can't express them. */
const css = `
  [data-sc-breadcrumb-bar="link"] { color: #6b6b77; transition: color 0.15s; }
  [data-sc-breadcrumb-bar="link"]:hover { color: #17171b; }
  [data-sc-breadcrumb-bar]:focus-visible { outline: 2px solid #2867ef; outline-offset: 2px; }
`;

const DEFAULT_ITEMS: Crumb[] = [
  { label: "Companies", link: "" },
  { label: "Acme Inc.", link: "" },
];

/**
 * Top bar with a breadcrumb trail; the last item is the current page.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 720
 */
export default function BreadcrumbBar({ items = DEFAULT_ITEMS, style }: BreadcrumbBarProps) {
  return (
    <header style={{ ...styles.bar, ...style }}>
      <style>{css}</style>
      <nav aria-label="Breadcrumb" style={{ minWidth: 0 }}>
        <ol style={styles.list}>
          {items.map((item, index) => {
            const current = index === items.length - 1;
            return (
              <li key={index} style={styles.item}>
                {current ? (
                  <a
                    href={item.link || undefined}
                    aria-current="page"
                    data-sc-breadcrumb-bar="current"
                    style={styles.current}
                  >
                    {item.label}
                  </a>
                ) : (
                  <>
                    <a href={item.link || "#"} data-sc-breadcrumb-bar="link" style={styles.link}>
                      {item.label}
                    </a>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width={16}
                      height={16}
                      fill="none"
                      stroke="#d0d0de"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={styles.chevron}
                    >
                      <path d="M9 6l6 6l-6 6" />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}

addPropertyControls(BreadcrumbBar, {
  items: {
    type: ControlType.Array,
    title: "Items",
    control: {
      type: ControlType.Object,
      controls: {
        label: { type: ControlType.String, title: "Label", defaultValue: "Page" },
        link: { type: ControlType.Link, title: "Link", defaultValue: "" },
      },
    },
    defaultValue: DEFAULT_ITEMS,
  },
});

const ellipsis: CSSProperties = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const styles: Record<string, CSSProperties> = {
  bar: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 56,
    padding: "0 27px 0 24px",
    background: "#ffffff",
    boxShadow: "0 6px 20px rgba(27, 19, 94, 0.03)",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "20px",
    letterSpacing: "-0.03em",
  },
  list: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  link: { ...ellipsis, borderRadius: 2, textDecoration: "none" },
  current: {
    ...ellipsis,
    borderRadius: 2,
    color: "#17171b",
    fontWeight: 600,
    textDecoration: "none",
  },
  chevron: { flexShrink: 0, margin: 4 },
};
