"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

type FocusTarget = "first" | "last" | "menu";

type MenuContextValue = {
  /** Closes the menu and returns focus to the trigger. */
  close: () => void;
  /** Moves focus to the menu itself, clearing the highlighted item. */
  clearHighlight: () => void;
  /** Hover only moves focus once focus is inside the menu, so it never steals it from the page. */
  ownsFocus: () => boolean;
};

const MenuContext = createContext<MenuContextValue | null>(null);

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

export type DropdownMenuProps = {
  /** Content of the trigger button. */
  label: ReactNode;
  /** `DropdownMenuItem` and `DropdownMenuSeparator` elements. */
  children: ReactNode;
  /** Which edge of the trigger the menu lines up with. */
  align?: "start" | "end";
  /** Controlled open state. */
  open?: boolean;
  /**
   * Renders the menu open on first paint without moving focus — handy for previews and docs.
   * Outside clicks start dismissing it once the user has interacted with the menu.
   */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
};

export function DropdownMenu({
  label,
  children,
  align = "start",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className = "",
  triggerClassName = "",
  menuClassName = "",
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  // A menu that was rendered open by default ignores outside clicks until the user engages with it,
  // so a preview grid can show it open without the first unrelated click closing it.
  const [engaged, setEngaged] = useState(!defaultOpen);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<FocusTarget | null>(null);
  const typeahead = useRef({ query: "", timer: 0 });
  const onOpenChangeRef = useRef(onOpenChange);
  const id = useId();
  const triggerId = `${id}trigger`;
  const menuId = `${id}menu`;

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChangeRef.current?.(next);
  };

  const openMenu = (target: FocusTarget) => {
    setEngaged(true);
    if (open) return focusInMenu(menuRef.current, target);
    pendingFocus.current = target;
    setOpen(true);
  };

  const closeMenu = (returnFocus: boolean) => {
    if (returnFocus) triggerRef.current?.focus();
    setOpen(false);
  };

  // Move focus into the menu only when the user opened it — never on mount.
  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    focusInMenu(menuRef.current, pendingFocus.current);
    pendingFocus.current = null;
  }, [open]);

  // Dismiss on outside pointer down or when focus moves elsewhere.
  useEffect(() => {
    if (!open || !engaged) return;
    const dismiss = (event: Event) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      if (openProp === undefined) setUncontrolledOpen(false);
      onOpenChangeRef.current?.(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
    };
  }, [open, engaged, openProp]);

  useEffect(() => {
    const state = typeahead.current;
    return () => window.clearTimeout(state.timer);
  }, []);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems(menuRef.current);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => items[(i + items.length) % items.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        return focusAt(index + 1);
      case "ArrowUp":
        event.preventDefault();
        return focusAt(index < 0 ? -1 : index - 1);
      case "Home":
      case "PageUp":
        event.preventDefault();
        return focusAt(0);
      case "End":
      case "PageDown":
        event.preventDefault();
        return focusAt(-1);
      case "Escape":
        event.preventDefault();
        return closeMenu(true);
      case "Tab":
        // Focus the trigger first so the browser's Tab moves on from there.
        return closeMenu(true);
    }

    // Typeahead: jump to the next item whose label starts with the typed characters.
    const isChar = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    const state = typeahead.current;
    if (!isChar || (event.key === " " && !state.query)) return;
    event.preventDefault();
    window.clearTimeout(state.timer);
    state.query += event.key.toLowerCase();
    state.timer = window.setTimeout(() => (state.query = ""), 500);

    const repeated = [...state.query].every((char) => char === state.query[0]);
    const search = repeated ? state.query[0] : state.query;
    const start = repeated ? index + 1 : Math.max(index, 0);
    const ordered = [...items.slice(start), ...items.slice(0, start)];
    ordered.find((item) => itemText(item).startsWith(search))?.focus();
  };

  const context: MenuContextValue = {
    close: () => closeMenu(true),
    clearHighlight: () => {
      if (menuRef.current?.contains(document.activeElement)) {
        menuRef.current.focus({ preventScroll: true });
      }
    },
    ownsFocus: () => !!rootRef.current?.contains(document.activeElement),
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-block text-left ${className}`}
      onPointerDown={() => setEngaged(true)}
      onFocus={() => setEngaged(true)}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={(event) =>
          open ? closeMenu(false) : openMenu(event.detail === 0 ? "first" : "menu")
        }
        onKeyDown={onTriggerKeyDown}
        className={`inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white pl-3 pr-2 text-sm font-medium text-zinc-800 shadow-xs transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 aria-expanded:bg-zinc-50 ${triggerClassName}`}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-3.5 text-zinc-400 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          aria-orientation="vertical"
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          className={`group/menu absolute top-full z-50 mt-1.5 min-w-56 rounded-xl border border-zinc-200 bg-white p-1 shadow-[0_4px_8px_-2px_rgb(24_24_27/0.06),0_16px_32px_-8px_rgb(24_24_27/0.14)] outline-hidden transition-[opacity,scale,translate] duration-150 ease-out starting:-translate-y-1 starting:scale-[0.98] starting:opacity-0 motion-reduce:transition-none ${align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"} ${menuClassName}`}
        >
          <MenuContext value={context}>{children}</MenuContext>
        </div>
      )}
    </div>
  );
}

export type DropdownMenuItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> & {
  /** Leading 24×24 icon. */
  icon?: ReactNode;
  /** Hint such as `⌘E` or `⌘⇧D`, shown on the right and exposed as `aria-keyshortcuts`. */
  shortcut?: string;
  /** Rose styling for irreversible actions. */
  destructive?: boolean;
  /** Called when the item is chosen by click, Enter or Space. The menu then closes. */
  onSelect?: () => void;
  /** Text used for typeahead when the children aren't a plain string. */
  textValue?: string;
};

export function DropdownMenuItem({
  icon,
  shortcut,
  destructive = false,
  disabled = false,
  onSelect,
  textValue,
  children,
  className = "",
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const menu = useContext(MenuContext);

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch" || !menu?.ownsFocus()) return;
    if (disabled) menu.clearHighlight();
    else if (document.activeElement !== event.currentTarget) {
      event.currentTarget.focus({ preventScroll: true });
    }
  };

  // Highlight follows focus; plain hover only paints it while focus is still outside the menu.
  const tone = disabled
    ? "cursor-not-allowed opacity-45"
    : destructive
      ? "focus:bg-rose-50 focus:text-rose-700 group-not-focus-within/menu:hover:bg-rose-50"
      : "focus:bg-zinc-100 focus:text-zinc-900 group-not-focus-within/menu:hover:bg-zinc-100";

  return (
    <button
      {...props}
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      aria-keyshortcuts={shortcut ? toAriaShortcut(shortcut) : undefined}
      data-text-value={textValue ?? (typeof children === "string" ? children : undefined)}
      onMouseDown={(event) => {
        // Keep focus where it is when a disabled item is clicked.
        if (disabled) event.preventDefault();
      }}
      onClick={(event) => {
        if (disabled) return;
        onClick?.(event);
        onSelect?.();
        menu?.close();
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") menu?.clearHighlight();
      }}
      className={`group/item flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm outline-hidden select-none transition-colors duration-75 ${
        destructive ? "text-rose-600" : "text-zinc-700"
      } ${tone} ${className}`}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={`flex size-4 shrink-0 items-center justify-center [&>svg]:size-4 ${
            destructive
              ? "text-rose-500"
              : disabled
                ? "text-zinc-400"
                : "text-zinc-400 group-hover/item:text-zinc-600 group-focus/item:text-zinc-600"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && (
        <span
          aria-hidden="true"
          className={`ml-auto flex items-center gap-0.5 pl-6 text-xs ${
            destructive ? "text-rose-400" : "text-zinc-400"
          }`}
        >
          {splitKeys(shortcut).map((key, index) => (
            <kbd key={index} className="min-w-3 text-center font-sans">
              {key}
            </kbd>
          ))}
        </span>
      )}
    </button>
  );
}

export function DropdownMenuSeparator({ className = "" }: { className?: string }) {
  return <div role="separator" className={`-mx-1 my-1 h-px bg-zinc-100 ${className}`} />;
}

const KEY_NAMES: Record<string, string> = {
  "⌘": "Meta",
  "⇧": "Shift",
  "⌥": "Alt",
  "⌃": "Control",
  "⌫": "Backspace",
  "⌦": "Delete",
  "↵": "Enter",
  "⏎": "Enter",
  "⎋": "Escape",
};

/** `⌘⇧D` → `["⌘", "⇧", "D"]` — symbols become their own key, the rest stays together. */
function splitKeys(shortcut: string) {
  const keys: string[] = [];
  let rest = "";
  for (const char of shortcut) {
    if (char in KEY_NAMES) keys.push(char);
    else if (char !== " " && char !== "+") rest += char;
  }
  return rest ? [...keys, rest] : keys;
}

/** `⌘⇧D` → `Meta+Shift+D`, the format `aria-keyshortcuts` expects. */
function toAriaShortcut(shortcut: string) {
  return splitKeys(shortcut)
    .map((key) => KEY_NAMES[key] ?? (key.length === 1 ? key.toUpperCase() : key))
    .join("+");
}

function getItems(menu: HTMLElement | null) {
  return Array.from(menu?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
}

function focusInMenu(menu: HTMLElement | null, target: FocusTarget) {
  if (target === "menu") return menu?.focus();
  const items = getItems(menu);
  items[target === "first" ? 0 : items.length - 1]?.focus();
}

function itemText(item: HTMLElement) {
  return (item.dataset.textValue ?? item.textContent ?? "").trim().toLowerCase();
}
