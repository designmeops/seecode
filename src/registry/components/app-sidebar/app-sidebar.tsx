"use client";

import { type HTMLAttributes, type ReactElement, useId, useState } from "react";

export type AppSidebarIcon =
  | "mail"
  | "globe"
  | "photo"
  | "map"
  | "book"
  | "palette"
  | "chart"
  | "cart"
  | "settings";

export interface AppSidebarLink {
  label: string;
  href?: string;
  /** Marks the current page: highlighted and announced with `aria-current`. */
  active?: boolean;
}

export interface AppSidebarItem extends AppSidebarLink {
  /** A built-in icon name, or your own 16 × 16 icon element. */
  icon?: AppSidebarIcon | ReactElement;
  /** Sub-pages. An item with children becomes a group that expands and collapses. */
  children?: AppSidebarLink[];
  /** Start the group expanded. Defaults to `true` when one of its children is active. */
  defaultOpen?: boolean;
}

export interface AppSidebarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  workspace: { name: string; logoUrl?: string };
  items: AppSidebarItem[];
  /** Onboarding checklist shown above the user, e.g. "Getting started 2/5". */
  progress?: { label: string; completed: number; total: number; href?: string };
  user: { name: string; email: string; avatarUrl?: string };
  newChatLabel?: string;
  historyLabel?: string;
  historyHref?: string;
  onNewChat?: () => void;
  /** Called by the panel button next to the workspace name. */
  onCollapse?: () => void;
}

const icons: Record<AppSidebarIcon | "chat" | "chevron", string[]> = {
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

const focusRing =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2867ef]";
const row = `flex h-9 w-full items-center gap-2 rounded-md px-4 text-left transition-colors ${focusRing}`;
const rowState = (active?: boolean) =>
  active ? "bg-[rgb(244_244_251/0.06)] text-white" : "hover:bg-[rgb(244_244_251/0.04)]";

export function AppSidebar({
  workspace,
  items,
  progress,
  user,
  newChatLabel = "New chat",
  historyLabel = "Chat History",
  historyHref = "#",
  onNewChat,
  onCollapse,
  className = "",
  ...props
}: AppSidebarProps) {
  return (
    <aside
      aria-label="Sidebar"
      className={`flex w-[218px] flex-col bg-[#17171b] px-2.5 py-8 font-[family-name:Geist,var(--font-sans)] text-sm/5 font-normal tracking-normal text-[#fafafa] ${className}`}
      {...props}
    >
      <div className="flex h-6 shrink-0 items-center justify-between gap-2 px-[7px]">
        <div className="flex min-w-0 items-center gap-2.5">
          {workspace.logoUrl ? (
            <img
              src={workspace.logoUrl}
              alt=""
              className="size-[22px] shrink-0 rounded-[5px] object-cover"
            />
          ) : (
            <WorkspaceMark />
          )}
          <span className="truncate">{workspace.name}</span>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          className={`flex size-6 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-[rgb(244_244_251/0.08)] ${focusRing}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <rect x="4.5" y="6" width="15" height="12" rx="2" />
            <path d="M8.25 9v6" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-color:#3f3f44_transparent] [scrollbar-width:thin]">
        <div className="shrink-0 px-2 py-2">
          <button
            type="button"
            onClick={onNewChat}
            className="flex h-9 w-full items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-4 font-[family-name:Inter,var(--font-sans)] font-medium text-[#1b1b34] shadow-sm transition-colors hover:bg-[#f4f4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2867ef]"
          >
            <Icon paths={icons.chat} className="text-[#09090b]" />
            <span className="truncate">{newChatLabel}</span>
          </button>
        </div>
        <div className="shrink-0 px-2 py-2">
          <a href={historyHref} className={`${row} ${rowState()}`}>
            <Icon paths={icons.chat} />
            <span className="min-w-0 flex-1 truncate">{historyLabel}</span>
          </a>
        </div>
        <hr className="shrink-0 border-[#3f3f44]" />
        <nav aria-label="Main" className="px-2 pt-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) =>
              item.children?.length ? (
                <NavGroup key={item.label} item={item} />
              ) : (
                <li key={item.label}>
                  <a
                    href={item.href ?? "#"}
                    aria-current={item.active ? "page" : undefined}
                    className={`${row} ${rowState(item.active)}`}
                  >
                    <ItemIcon icon={item.icon} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>

      <div className="mt-6 flex shrink-0 flex-col gap-6 px-1.5">
        {progress && <Progress {...progress} />}
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded bg-[#ef6c00]">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <span aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
            )}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate">{user.name}</span>
            <span className="truncate text-xs/5 text-[#8b8b8d]">{user.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavGroup({ item }: { item: AppSidebarItem }) {
  const children = item.children ?? [];
  const [open, setOpen] = useState(item.defaultOpen ?? children.some((child) => child.active));
  const id = useId();

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={`${row} ${rowState(item.active)}`}
      >
        <ItemIcon icon={item.icon} />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <Icon
          paths={icons.chevron}
          className={`transition duration-200 motion-reduce:transition-none ${open ? "text-white" : "-rotate-90 text-[#8b8b8d]"}`}
        />
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none ${open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="pt-1">
            {children.map((child) => (
              <li key={child.label}>
                <a
                  href={child.href ?? "#"}
                  aria-current={child.active ? "page" : undefined}
                  className={`ml-[23px] flex h-9 items-center rounded-md px-4 text-xs/5 transition-colors ${focusRing} ${
                    child.active
                      ? "bg-[rgb(244_244_251/0.06)] text-white"
                      : "text-[#8b8b8d] hover:bg-[rgb(244_244_251/0.04)] hover:text-[#fafafa]"
                  }`}
                >
                  <span className="min-w-0 truncate">{child.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function Progress({ label, completed, total, href }: NonNullable<AppSidebarProps["progress"]>) {
  const value = total > 0 ? Math.min(1, Math.max(0, completed / total)) : 0;
  const circumference = 2 * Math.PI * 8.5;
  const content = (
    <>
      <span className="truncate">{label}</span>
      <span className="flex shrink-0 items-center gap-1">
        <span aria-hidden="true">
          {completed}/{total}
        </span>
        <span className="sr-only">
          {completed} of {total} completed
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 -rotate-90">
          <circle cx="10" cy="10" r="8.5" fill="none" stroke="#6a6a78" strokeWidth={3} />
          <circle
            cx="10"
            cy="10"
            r="8.5"
            fill="none"
            stroke="#04bb6f"
            strokeWidth={3}
            strokeDasharray={`${value * circumference} ${circumference}`}
            className="transition-[stroke-dasharray] duration-500 motion-reduce:transition-none"
          />
        </svg>
      </span>
    </>
  );
  const layout = "flex items-center justify-between gap-3";

  return href ? (
    <a
      href={href}
      className={`${layout} rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2867ef]`}
    >
      {content}
    </a>
  ) : (
    <div className={layout}>{content}</div>
  );
}

function ItemIcon({ icon }: { icon?: AppSidebarItem["icon"] }) {
  if (!icon) return null;
  return typeof icon === "string" ? <Icon paths={icons[icon]} /> : icon;
}

/** Neutral stand-in logo: replace it by passing `workspace.logoUrl`. */
function WorkspaceMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] bg-[radial-gradient(circle_at_85%_10%,rgb(240_135_255/0.75),transparent_60%),linear-gradient(140deg,#6a4df4,#441fb4_55%,#29117a)] shadow-[inset_0_1px_0.85px_-0.3px_rgb(255_255_255/0.45),inset_0_-0.7px_0.95px_rgb(0_0_0/0.12)]"
    >
      <svg viewBox="0 0 22 22" className="size-[22px]">
        <path
          d="M11 6.25 15.5 14.5h-9z"
          fill="#fff"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Icon({ paths, className = "" }: { paths: string[]; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 shrink-0 ${className}`}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
