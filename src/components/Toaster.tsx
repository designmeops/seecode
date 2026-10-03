import { Check, Info, TriangleAlert, X } from "lucide-react";
import type { ReactNode } from "react";
import { dismissToast, pauseToasts, resumeToasts, type ToastTone, useToasts } from "../lib/toast";

const icons: Record<ToastTone, ReactNode> = {
  success: (
    <span className="flex size-[18px] items-center justify-center rounded-full bg-good text-white">
      <Check size={11} strokeWidth={3} />
    </span>
  ),
  info: (
    <span className="flex size-[18px] items-center justify-center rounded-full bg-brand text-white">
      <Info size={11} strokeWidth={2.6} />
    </span>
  ),
  error: (
    <span className="flex size-[18px] items-center justify-center rounded-full bg-danger text-white">
      <TriangleAlert size={10} strokeWidth={2.6} />
    </span>
  ),
};

export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed right-3 bottom-3 left-3 z-[80] flex flex-col items-end gap-2 sm:left-auto sm:w-[360px]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : undefined}
          onPointerEnter={pauseToasts}
          onPointerLeave={resumeToasts}
          className="pointer-events-auto flex w-full items-center gap-3 rounded-lg border border-line bg-raised py-2.5 pr-2 pl-3 shadow-pop animate-toast-in"
        >
          {icons[toast.tone]}
          <div className="min-w-0 flex-1">
            <p className="truncate text-mini font-medium text-ink">{toast.title}</p>
            {toast.description && (
              <p className="truncate text-[12px] text-ink-3">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-ink-4 transition-colors hover:bg-hover hover:text-ink-2"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
