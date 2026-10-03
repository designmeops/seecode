"use client";

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

type Status = "idle" | "loading" | "success" | "error";

export type LoadingButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /** Return a promise to drive the loading, success and error states. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<unknown> | void;
  /** Label shown while the promise is pending. */
  loadingText?: ReactNode;
  /** Label shown after the promise resolves. */
  successText?: ReactNode;
  /** Label shown after the promise rejects. Clicking again retries. */
  errorText?: ReactNode;
  /** How long the success state stays before the button resets, in ms. */
  resetAfter?: number;
};

export function LoadingButton({
  children,
  loadingText = "Saving…",
  successText = "Saved",
  errorText = "Try again",
  resetAfter = 1600,
  onClick,
  className = "",
  type = "button",
  ...props
}: LoadingButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const mounted = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (status === "loading") return;
    clearTimeout(resetTimer.current);
    const result: unknown = onClick?.(event);
    if (!(result instanceof Promise)) {
      setStatus("idle");
      return;
    }
    setStatus("loading");
    try {
      await result;
      if (!mounted.current) return;
      setStatus("success");
      resetTimer.current = setTimeout(() => setStatus("idle"), resetAfter);
    } catch {
      if (mounted.current) setStatus("error");
    }
  }

  // Every label is stacked in one grid cell, so the button is always as wide as the longest
  // one and never jumps while the states cross-fade.
  const labels: Record<Status, ReactNode> = {
    idle: children,
    loading: (
      <>
        <Spinner />
        {loadingText}
      </>
    ),
    success: (
      <>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" {...iconStroke}>
          <path d="M5 12.5 9.5 17 19 7.5" />
        </svg>
        {successText}
      </>
    ),
    error: (
      <>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" {...iconStroke}>
          <path d="M12 7.5v5M12 16.25v.25" />
          <circle cx="12" cy="12" r="9" />
        </svg>
        {errorText}
      </>
    ),
  };

  return (
    <>
      <button
        type={type}
        data-status={status}
        aria-busy={status === "loading"}
        aria-disabled={status === "loading" || undefined}
        onClick={handleClick}
        className={`relative inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(9_9_11/0.2),0_2px_6px_-2px_rgb(9_9_11/0.2)] transition duration-200 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 data-[status=error]:bg-rose-600 data-[status=error]:focus-visible:outline-rose-600 data-[status=error]:hover:bg-rose-500 data-[status=loading]:cursor-progress data-[status=loading]:bg-zinc-800 data-[status=success]:bg-emerald-600 data-[status=success]:focus-visible:outline-emerald-600 ${className}`}
        {...props}
      >
        <span className="grid">
          {(Object.keys(labels) as Status[]).map((key) => (
            <span
              key={key}
              aria-hidden={key === status ? undefined : true}
              className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap transition duration-200 ease-out ${
                key === status
                  ? "opacity-100 blur-none"
                  : "pointer-events-none scale-90 opacity-0 blur-[2px] motion-reduce:scale-100"
              }`}
            >
              {labels[key]}
            </span>
          ))}
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "idle" ? "" : labels[status]}
      </span>
    </>
  );
}

const iconStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Spinner() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.25} strokeWidth={2.5} />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}
