"use client";

import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastOptions = {
  /** Reuse an id to update a toast in place instead of stacking a new one. */
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. `Infinity` keeps the toast until it is closed. */
  duration?: number;
  /** Optional button; clicking it also dismisses the toast. */
  action?: { label: string; onClick: () => void };
};

export type Toast = ToastOptions & {
  id: string;
  variant: ToastVariant;
  duration: number;
  open: boolean;
  /** Bumped when a toast is updated in place, which restarts its timer. */
  version: number;
};

type ToastContextValue = {
  toasts: Toast[];
  /** Shows a toast and returns its id. A string is shorthand for `{ title }`. */
  toast: (options: ToastOptions | string) => string;
  /** Dismisses one toast, or all of them when called without an id. */
  dismiss: (id?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}

export type ToastProviderProps = {
  children?: ReactNode;
  position?: ToastPosition;
  /** Default auto-dismiss delay in ms. */
  duration?: number;
  /** Most toasts on screen at once; the oldest is dismissed first. */
  limit?: number;
  /** Accessible name of the notification region. */
  label?: string;
};

const EXIT_MS = 200;
let nextId = 0;

const positions: Record<ToastPosition, string> = {
  "top-left": "top-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
};

export function ToastProvider({
  children,
  position = "bottom-right",
  duration = 4000,
  limit = 3,
  label = "Notifications",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const defaults = useRef({ duration, limit });

  // Pause while the stack is hovered or holds keyboard focus. Native listeners
  // keep working when the hovered or focused toast is removed mid-interaction.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const focusIn = (event: FocusEvent) =>
      setFocused(event.target instanceof Element && event.target.matches(":focus-visible"));
    const focusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node && list.contains(event.relatedTarget))) {
        setFocused(false);
      }
    };
    list.addEventListener("pointerenter", enter);
    list.addEventListener("pointerleave", leave);
    list.addEventListener("focusin", focusIn);
    list.addEventListener("focusout", focusOut);
    return () => {
      list.removeEventListener("pointerenter", enter);
      list.removeEventListener("pointerleave", leave);
      list.removeEventListener("focusin", focusIn);
      list.removeEventListener("focusout", focusOut);
    };
  }, []);

  useEffect(() => {
    defaults.current = { duration, limit };
  }, [duration, limit]);

  const dismiss = useCallback((id?: string) => {
    setToasts((list) =>
      list.map((item) =>
        (id === undefined || item.id === id) && item.open ? { ...item, open: false } : item,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((list) => list.filter((item) => item.id !== id || item.open));
  }, []);

  const toast = useCallback((input: ToastOptions | string) => {
    const options = typeof input === "string" ? { title: input } : input;
    const id = options.id ?? `toast-${++nextId}`;
    setToasts((list) => {
      const existing = list.find((item) => item.id === id);
      const next: Toast = {
        ...options,
        id,
        variant: options.variant ?? "info",
        duration: options.duration ?? defaults.current.duration,
        open: true,
        version: (existing?.version ?? 0) + 1,
      };
      if (existing) return list.map((item) => (item.id === id ? next : item));

      const added = [...list, next];
      const open = added.filter((item) => item.open);
      const overflow = open.length - defaults.current.limit;
      if (overflow <= 0) return added;
      const closing = new Set(open.slice(0, overflow).map((item) => item.id));
      return added.map((item) => (closing.has(item.id) ? { ...item, open: false } : item));
    });
    return id;
  }, []);

  // The pointer can't "leave" a list that just emptied, so reset the pause state.
  const hasToasts = toasts.length > 0;
  useEffect(() => {
    if (!hasToasts) {
      setHovered(false);
      setFocused(false);
    }
  }, [hasToasts]);

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  const fromTop = position.startsWith("top");

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-label={label}
        className={`pointer-events-none fixed z-50 flex w-full max-w-sm p-3 ${positions[position]}`}
      >
        <ol
          ref={listRef}
          tabIndex={-1}
          aria-live="polite"
          className={`flex w-full outline-hidden ${fromTop ? "flex-col-reverse" : "flex-col"}`}
        >
          {toasts.map((item) => (
            <ToastItem
              key={item.id}
              toast={item}
              fromTop={fromTop}
              paused={hovered || focused}
              listRef={listRef}
              onDismiss={dismiss}
              onRemove={remove}
            />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

const variants: Record<ToastVariant, { color: string; icon: ReactNode }> = {
  success: { color: "text-emerald-500", icon: <path d="m8 12.5 2.75 2.75L16 10" /> },
  error: { color: "text-rose-500", icon: <path d="m9.25 9.25 5.5 5.5m0-5.5-5.5 5.5" /> },
  warning: { color: "text-amber-500", icon: <path d="M12 7.5v5.25m0 3.75h.01" /> },
  info: { color: "text-sky-500", icon: <path d="M12 11v5.5m0-9h.01" /> },
};

type ToastItemProps = {
  toast: Toast;
  fromTop: boolean;
  paused: boolean;
  listRef: RefObject<HTMLOListElement | null>;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
};

function ToastItem({ toast, fromTop, paused, listRef, onDismiss, onRemove }: ToastItemProps) {
  const { id, open, version, duration } = toast;
  const itemRef = useRef<HTMLLIElement>(null);
  const remaining = useRef(duration);
  const seenVersion = useRef(version);

  // Auto-dismiss. The timer stops while the stack is hovered or focused and
  // resumes with whatever time was left.
  useEffect(() => {
    if (seenVersion.current !== version) {
      seenVersion.current = version;
      remaining.current = duration;
    }
    if (!open || paused || !Number.isFinite(remaining.current)) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => onDismiss(id), Math.max(0, remaining.current));
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [id, open, version, duration, paused, onDismiss]);

  // Unmount once the exit transition has played. If focus was inside, hand it
  // to the next toast (or the list) so keyboard users keep their place.
  useEffect(() => {
    if (open) return;
    const item = itemRef.current;
    const list = listRef.current;
    if (item && list && item.contains(document.activeElement)) {
      const openItems = [...list.querySelectorAll<HTMLElement>("li[data-open]")];
      const after = openItems.find(
        (other) => item.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
      const neighbour = after ?? openItems[openItems.length - 1];
      (neighbour?.querySelector<HTMLElement>("button") ?? list).focus();
    }
    const timer = setTimeout(() => onRemove(id), EXIT_MS);
    return () => clearTimeout(timer);
  }, [id, open, listRef, onRemove]);

  const variant = variants[toast.variant];

  return (
    <li
      ref={itemRef}
      data-open={open ? "" : undefined}
      className={`pointer-events-auto grid w-full transition-[grid-template-rows,opacity,translate,scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
        open
          ? `grid-rows-[1fr] starting:grid-rows-[0fr] starting:opacity-0 ${fromTop ? "starting:-translate-y-2" : "starting:translate-y-2"}`
          : "grid-rows-[0fr] scale-95 opacity-0"
      }`}
      onKeyDown={(event) => {
        if (event.key === "Escape") onDismiss(id);
      }}
    >
      <div className="min-h-0">
        <div className="py-1">
          <div className="flex w-full items-start gap-3 rounded-xl bg-white py-3 pr-2.5 pl-3.5 text-sm shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_4px_8px_-2px_rgb(0_0_0/0.06),0_16px_32px_-8px_rgb(0_0_0/0.14)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`mt-px size-[18px] shrink-0 ${variant.color}`}
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <g
                fill="none"
                stroke="white"
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {variant.icon}
              </g>
            </svg>
            <div className="min-w-0 flex-1">
              <p className="leading-5 font-medium text-zinc-900">{toast.title}</p>
              {toast.description && (
                <p className="text-[13px] leading-5 text-zinc-500">{toast.description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1 self-center">
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(id);
                  }}
                  className="inline-flex h-7 items-center rounded-md bg-white px-2.5 text-xs font-medium text-zinc-900 shadow-xs ring-1 ring-zinc-950/10 transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(id)}
                className="grid size-7 place-items-center rounded-md text-zinc-400 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
