"use client";

import { type HTMLAttributes, type ReactNode, useState } from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export type AlertAction = {
  label: string;
  /** Renders the action as a link. */
  href?: string;
  onClick?: () => void;
};

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  variant?: AlertVariant;
  title?: ReactNode;
  /** Link-style action shown after the description. */
  action?: AlertAction;
  /** Shows a dismiss button. The alert hides itself, then calls `onDismiss`. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Replaces the variant icon. Pass `null` to hide it. */
  icon?: ReactNode;
};

const styles: Record<
  AlertVariant,
  { root: string; icon: string; title: string; body: string; action: string; dismiss: string }
> = {
  info: {
    root: "bg-sky-50 ring-sky-600/15",
    icon: "text-sky-600",
    title: "text-sky-950",
    body: "text-sky-900/75",
    action:
      "text-sky-950 decoration-sky-950/30 hover:decoration-sky-950 focus-visible:outline-sky-600",
    dismiss:
      "text-sky-900/45 hover:bg-sky-900/[0.07] hover:text-sky-950 focus-visible:outline-sky-600",
  },
  success: {
    root: "bg-emerald-50 ring-emerald-600/15",
    icon: "text-emerald-600",
    title: "text-emerald-950",
    body: "text-emerald-900/75",
    action:
      "text-emerald-950 decoration-emerald-950/30 hover:decoration-emerald-950 focus-visible:outline-emerald-600",
    dismiss:
      "text-emerald-900/45 hover:bg-emerald-900/[0.07] hover:text-emerald-950 focus-visible:outline-emerald-600",
  },
  warning: {
    root: "bg-amber-50 ring-amber-600/20",
    icon: "text-amber-600",
    title: "text-amber-950",
    body: "text-amber-900/80",
    action:
      "text-amber-950 decoration-amber-950/30 hover:decoration-amber-950 focus-visible:outline-amber-600",
    dismiss:
      "text-amber-900/45 hover:bg-amber-900/[0.07] hover:text-amber-950 focus-visible:outline-amber-600",
  },
  danger: {
    root: "bg-rose-50 ring-rose-600/15",
    icon: "text-rose-600",
    title: "text-rose-950",
    body: "text-rose-900/75",
    action:
      "text-rose-950 decoration-rose-950/30 hover:decoration-rose-950 focus-visible:outline-rose-600",
    dismiss:
      "text-rose-900/45 hover:bg-rose-900/[0.07] hover:text-rose-950 focus-visible:outline-rose-600",
  },
};

const icons: Record<AlertVariant, ReactNode> = {
  info: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01" />,
  success: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12.5l2.5 2.5 4.5-5.5" />,
  warning: (
    <path d="M10.3 4.2 2.6 17.5a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0ZM12 9.5v4M12 17h.01" />
  ),
  danger: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5v5M12 16h.01" />,
};

export function Alert({
  variant = "info",
  title,
  action,
  dismissible = false,
  onDismiss,
  icon,
  className = "",
  children,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const style = styles[variant];
  const actionClass = `inline-flex items-center gap-0.5 rounded-xs font-medium whitespace-nowrap underline decoration-1 underline-offset-[3px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${style.action}`;
  const actionContent = action && (
    <>
      {action.label}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );

  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={`flex gap-3 rounded-lg p-3.5 text-sm ring-1 ring-inset ${style.root} ${className}`}
      {...props}
    >
      {icon !== null && (
        <span aria-hidden="true" className={`mt-0.5 shrink-0 ${style.icon}`}>
          {icon ?? (
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icons[variant]}
            </svg>
          )}
        </span>
      )}

      <div className="min-w-0 flex-1 leading-5">
        {title && <p className={`font-medium ${style.title}`}>{title}</p>}
        {(children || action) && (
          <div className={`${title ? "mt-0.5" : ""} ${style.body}`}>
            {children}
            {children && action ? " " : null}
            {action &&
              (action.href ? (
                <a href={action.href} onClick={action.onClick} className={actionClass}>
                  {actionContent}
                </a>
              ) : (
                <button type="button" onClick={action.onClick} className={actionClass}>
                  {actionContent}
                </button>
              ))}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          className={`-my-1 -mr-1.5 grid size-7 shrink-0 place-items-center rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 ${style.dismiss}`}
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
      )}
    </div>
  );
}
