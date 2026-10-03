"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
  /** Tooltip text. Keep it short — it is also the trigger's accessible description. */
  content: ReactNode;
  /** A single focusable element, e.g. an icon `<button>`. */
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  side?: TooltipSide;
  /** Keys rendered as chips, e.g. `"⌘B"` or `["Ctrl", "B"]`. */
  shortcut?: string | string[];
  /** Hover delay in ms before the tooltip opens. Focus opens it immediately. */
  delay?: number;
  /** Show the tooltip on first paint (handy for previews). It hides like any other once interacted with. */
  defaultOpen?: boolean;
  className?: string;
};

/** Moving between triggers within this window skips the open delay, like native toolbars. */
const SKIP_DELAY_MS = 300;
/** Close callback of every open tooltip → whether the user opened it. Only one shows at a time. */
const openTooltips = new Map<() => void, boolean>();
let lastClosedAt = 0;

const SIDES: Record<TooltipSide, { position: string; hidden: string; arrow: string }> = {
  top: {
    position: "bottom-full left-1/2 mb-2 -translate-x-1/2 after:inset-x-0 after:top-full after:h-2",
    hidden: "translate-y-1",
    arrow: "-bottom-1 left-1/2 -translate-x-1/2",
  },
  bottom: {
    position: "top-full left-1/2 mt-2 -translate-x-1/2 after:inset-x-0 after:bottom-full after:h-2",
    hidden: "-translate-y-1",
    arrow: "-top-1 left-1/2 -translate-x-1/2",
  },
  left: {
    position: "right-full top-1/2 mr-2 -translate-y-1/2 after:inset-y-0 after:left-full after:w-2",
    hidden: "translate-x-1",
    arrow: "-right-1 top-1/2 -translate-y-1/2",
  },
  right: {
    position: "left-full top-1/2 ml-2 -translate-y-1/2 after:inset-y-0 after:right-full after:w-2",
    hidden: "-translate-x-1",
    arrow: "-left-1 top-1/2 -translate-y-1/2",
  },
};

export function Tooltip({
  content,
  children,
  side = "top",
  shortcut,
  delay = 300,
  defaultOpen = false,
  className = "",
}: TooltipProps) {
  // "passive" = shown by `defaultOpen`; "active" = opened by hover or focus.
  const [open, setOpen] = useState<false | "passive" | "active">(defaultOpen ? "passive" : false);
  const timer = useRef(0);
  const id = useId();
  const isOpen = open !== false;

  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  const show = (immediate: boolean) => {
    window.clearTimeout(timer.current);
    const reveal = () => {
      for (const close of openTooltips.keys()) if (close !== hide) close();
      setOpen("active");
    };
    // Another tooltip is (or just was) open: skip the delay so scanning a toolbar feels instant.
    const warm =
      [...openTooltips].some(([close, byUser]) => byUser && close !== hide) ||
      Date.now() - lastClosedAt < SKIP_DELAY_MS;
    if (immediate || isOpen || warm) reveal();
    else timer.current = window.setTimeout(reveal, delay);
  };

  useEffect(() => {
    if (!open) return;
    openTooltips.set(hide, open === "active");
    return () => {
      openTooltips.delete(hide);
      if (open === "active") lastClosedAt = Date.now();
    };
  }, [open, hide]);

  // Escape dismisses a tooltip the user opened, wherever focus is.
  useEffect(() => {
    if (open !== "active") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, hide]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const placement = SIDES[side];
  const keys = typeof shortcut === "string" ? splitKeys(shortcut) : (shortcut ?? []);
  const describedBy = [children.props["aria-describedby"], id].filter(Boolean).join(" ");

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") show(false);
      }}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(event) => {
        // Keyboard focus only — a mouse click shouldn't pop the tooltip back up.
        if (event.target.matches(":focus-visible")) show(true);
      }}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) hide();
      }}
    >
      {cloneElement(children, { "aria-describedby": describedBy })}
      <span
        id={id}
        role="tooltip"
        className={`absolute z-50 w-max max-w-64 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-zinc-50 shadow-[0_2px_10px_rgb(0_0_0/0.18)] ease-out after:absolute after:content-[''] motion-reduce:transition-none ${placement.position} ${
          isOpen
            ? "visible opacity-100 transition-[opacity,translate] duration-150"
            : `invisible opacity-0 transition-[opacity,translate,visibility] duration-100 ${placement.hidden}`
        } ${className}`}
      >
        <span
          aria-hidden="true"
          className={`absolute size-2 rotate-45 rounded-[1px] bg-zinc-900 ${placement.arrow}`}
        />
        <span className="relative flex items-center gap-2">
          {content}
          {keys.length > 0 && (
            <span className="flex items-center gap-0.5">
              {keys.map((key, index) => (
                <kbd
                  key={index}
                  className="inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] bg-white/12 px-1 font-sans text-[10px] font-medium text-zinc-300"
                >
                  {key}
                </kbd>
              ))}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

const MODIFIERS = new Set(["⌘", "⇧", "⌥", "⌃"]);

/** `"⌘⇧X"` → `["⌘", "⇧", "X"]`, `"Ctrl+B"` → `["Ctrl", "B"]`. */
function splitKeys(shortcut: string) {
  if (shortcut.includes("+"))
    return shortcut
      .split("+")
      .map((key) => key.trim())
      .filter(Boolean);
  const keys: string[] = [];
  let rest = "";
  for (const char of shortcut) {
    if (MODIFIERS.has(char)) keys.push(char);
    else if (char !== " ") rest += char;
  }
  return rest ? [...keys, rest] : keys;
}
