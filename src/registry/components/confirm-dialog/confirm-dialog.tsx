"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

type TriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };

export type ConfirmDialogProps = {
  /** The element that opens the dialog, usually a `<button>`. Focus returns to it on close. */
  trigger: ReactElement<TriggerProps>;
  /** Text the user has to type to enable the confirm button — typically the resource name. */
  confirmText: string;
  title?: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  pendingLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Runs on confirm. Return a promise to show a pending state; the dialog closes once it resolves. */
  onConfirm?: () => void | Promise<void>;
  /** Controlled open state. */
  open?: boolean;
  /**
   * Render open on first paint — e.g. for previews. Focus isn't moved and the page isn't locked
   * until the user opens the dialog themselves.
   */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export function ConfirmDialog({
  trigger,
  confirmText,
  title = "Delete project",
  description,
  confirmLabel = "Delete project",
  pendingLabel = "Deleting…",
  cancelLabel = "Cancel",
  onConfirm,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  // A dialog that is open on mount is a static preview. Focus moves, the Tab trap and the
  // scroll lock only kick in for opens that happen after mount.
  const [interactive, setInteractive] = useState(!open);
  const active = open && interactive;

  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(open);
  const mounted = useRef(false);
  const pressedBackdrop = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);

  const id = useId();
  const titleId = `${id}title`;
  const descriptionId = `${id}description`;
  const inputId = `${id}input`;
  const dialogId = `${id}dialog`;
  const matches = value.trim() === confirmText;

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChangeRef.current?.(next);
  };

  const requestClose = () => {
    if (!pending) setOpen(false);
  };

  useEffect(() => {
    if (open && !wasOpen.current) {
      // Every user-initiated open starts from a clean slate.
      setValue("");
      setError(null);
    }
    if (!open && wasOpen.current) {
      setInteractive(true);
      // Return focus to the trigger unless the user already moved it somewhere else.
      const focused = document.activeElement;
      if (!focused || focused === document.body || panelRef.current?.contains(focused)) {
        triggerRef.current?.focus();
      }
    }
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!active) return;
    inputRef.current?.focus();
    // Lock page scroll, padding for the scrollbar so the layout doesn't shift.
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const { overflow, paddingRight } = root.style;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
    };
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      return requestClose();
    }
    if (event.key !== "Tab" || !active) return;
    // Keep Tab and Shift+Tab cycling inside the dialog.
    const nodes = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const current = document.activeElement;
    if (event.shiftKey && (current === first || current === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!matches || pending) return;
    setError(null);
    setPending(true);
    try {
      await onConfirm?.();
      if (mounted.current) setOpen(false);
    } catch {
      if (mounted.current) setError("Something went wrong. Please try again.");
    } finally {
      if (mounted.current) setPending(false);
    }
  };

  const userRef = trigger.props.ref;
  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof userRef === "function") userRef(node);
      else if (userRef) userRef.current = node;
    },
    [userRef],
  );

  return (
    <>
      {cloneElement(trigger, {
        ref: setTriggerRef,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": dialogId,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) setOpen(true);
        },
      })}

      <div
        inert={!open}
        onPointerDown={(event) => {
          pressedBackdrop.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          if (pressedBackdrop.current && event.target === event.currentTarget) requestClose();
        }}
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/40 p-4 backdrop-blur-[2px] motion-reduce:transition-none ${
          open
            ? "visible opacity-100 transition-opacity duration-200 ease-out"
            : "invisible opacity-0 transition-[opacity,visibility] duration-150 ease-in"
        }`}
      >
        <div
          ref={panelRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={`w-full max-w-[25rem] overflow-hidden rounded-2xl bg-white text-left shadow-[0_0_0_1px_rgb(24_24_27/0.06),0_8px_16px_-4px_rgb(24_24_27/0.08),0_32px_64px_-12px_rgb(24_24_27/0.28)] outline-hidden transition-[opacity,scale,translate] motion-reduce:transition-none ${
            open
              ? "translate-y-0 scale-100 opacity-100 duration-200 ease-out"
              : "translate-y-2 scale-[0.97] opacity-0 duration-150 ease-in"
          }`}
        >
          <form onSubmit={onSubmit}>
            <div className="p-5">
              <div className="flex size-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 inset-ring-1 inset-ring-rose-100">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[18px]"
                >
                  <path d="M10.27 4.5a2 2 0 0 1 3.46 0l7.5 13a2 2 0 0 1-1.73 3H4.5a2 2 0 0 1-1.73-3l7.5-13Z" />
                  <path d="M12 9.5v4M12 17h.01" />
                </svg>
              </div>
              <h2
                id={titleId}
                className="mt-3.5 text-base font-semibold tracking-tight text-zinc-900"
              >
                {title}
              </h2>
              {description && (
                <div id={descriptionId} className="mt-1 text-sm/6 text-pretty text-zinc-500">
                  {description}
                </div>
              )}

              <label htmlFor={inputId} className="mt-4 block text-sm text-zinc-700">
                Type{" "}
                <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] font-medium text-zinc-900">
                  {confirmText}
                </span>{" "}
                to confirm
              </label>
              <input
                ref={inputRef}
                id={inputId}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                readOnly={pending}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                className="mt-2 h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 font-mono text-[13px] text-zinc-900 shadow-xs outline-hidden transition-[border-color,box-shadow] duration-150 focus:border-rose-400 focus:ring-3 focus:ring-rose-500/15"
              />
              {error && (
                <p role="alert" className="mt-2 text-sm text-rose-600">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3">
              <button
                type="button"
                onClick={requestClose}
                disabled={pending}
                className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-xs transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="submit"
                disabled={!matches}
                aria-busy={pending || undefined}
                className="inline-flex h-8 items-center gap-2 rounded-lg bg-rose-600 px-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(225_29_72/0.3)] transition-[background-color,opacity] duration-150 hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:bg-rose-600"
              >
                {pending && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-3.5 animate-spin motion-reduce:animate-none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeOpacity={0.3}
                      strokeWidth={3}
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {pending ? pendingLabel : confirmLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
