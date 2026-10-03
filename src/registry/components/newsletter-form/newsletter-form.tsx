"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

export type NewsletterFormProps = {
  /** Subscribes the address. Reject to show an error; resolve to show the success state. */
  onSubscribe: (email: string) => Promise<void>;
  title?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  buttonLabel?: ReactNode;
  successMessage?: ReactNode;
  className?: string;
};

type Status = "idle" | "loading" | "success";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const keyframes = `
@keyframes newsletter-form-pop {
  from { transform: scale(0.4); opacity: 0; }
}`;

export function NewsletterForm({
  onSubscribe,
  title = "Subscribe to the changelog",
  description = "Every other Thursday. No spam, ever.",
  placeholder = "you@company.com",
  buttonLabel = "Subscribe",
  successMessage = "You’re on the list — check your inbox.",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const inputId = `${id}email`;
  const errorId = `${id}error`;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // The form disappears on success, so move focus to the confirmation instead of losing it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError(value ? "Enter a valid email address." : "Enter your email address.");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      await onSubscribe(value);
      if (mounted.current) setStatus("success");
    } catch {
      if (!mounted.current) return;
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className={`w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-[0_1px_2px_rgb(24_24_27/0.04),0_4px_16px_-6px_rgb(24_24_27/0.08)] ${className}`}
    >
      {/* React 19 hoists and de-duplicates this, so the file stays self-contained. */}
      <style href="newsletter-form" precedence="default">
        {keyframes}
      </style>
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 inset-ring-1 inset-ring-indigo-100">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="m4 7.5 6.6 4.6a2.5 2.5 0 0 0 2.8 0L20 7.5" />
          </svg>
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900">{title}</h3>
          <p className="mt-0.5 text-sm text-pretty text-zinc-500">{description}</p>
        </div>
      </div>

      {status === "success" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="mt-4 flex h-9 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-sm font-medium text-emerald-700 inset-ring-1 inset-ring-emerald-100 outline-hidden"
        >
          <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white animate-[newsletter-form-pop_300ms_cubic-bezier(0.2,0.8,0.2,1.2)] motion-reduce:animate-none">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3"
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          {successMessage}
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="mt-4">
          <div className="flex gap-2">
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={placeholder}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
              readOnly={status === "loading"}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={`h-9 min-w-0 flex-1 rounded-lg border bg-white px-3 text-sm text-zinc-900 shadow-xs outline-hidden transition-[border-color,box-shadow] duration-150 placeholder:text-zinc-400 ${
                error
                  ? "border-rose-300 focus:border-rose-400 focus:ring-3 focus:ring-rose-500/15"
                  : "border-zinc-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-500/15"
              }`}
            />
            <button
              type="submit"
              aria-disabled={status === "loading" || undefined}
              className="relative inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 px-3.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(24_24_27/0.2)] transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 aria-disabled:cursor-wait aria-disabled:bg-zinc-700"
            >
              {/* The label keeps its space while loading so the input doesn't shift. */}
              <span className={status === "loading" ? "invisible" : undefined}>{buttonLabel}</span>
              {status === "loading" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4 animate-spin motion-reduce:animate-none"
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
                  <span className="sr-only">Subscribing…</span>
                </span>
              )}
            </button>
          </div>
          {error && (
            <p
              id={errorId}
              role="alert"
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.25}
                strokeLinecap="round"
                className="size-3.5 shrink-0"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7.5v5M12 16.25h.01" />
              </svg>
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
