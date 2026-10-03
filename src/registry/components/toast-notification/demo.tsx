"use client";

import { useEffect } from "react";
import { ToastProvider, useToast } from "./toast-notification";

export default function ToastNotificationDemo() {
  return (
    <ToastProvider>
      <Triggers />
    </ToastProvider>
  );
}

const buttonClass =
  "inline-flex h-8 items-center gap-2 rounded-lg bg-white px-2.5 text-[13px] font-medium text-zinc-900 shadow-xs ring-1 ring-zinc-950/10 transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

function Triggers() {
  const { toast } = useToast();

  // One toast that stays until it's closed, so the preview is never empty.
  useEffect(() => {
    toast({
      id: "deploy",
      variant: "success",
      title: "Deployment ready",
      description: "acme-web is live in production.",
      duration: Infinity,
    });
  }, [toast]);

  return (
    <div className="flex justify-center gap-1.5 pb-24">
      <button
        type="button"
        className={buttonClass}
        onClick={() =>
          toast({
            variant: "success",
            title: "Changes saved",
            description: "Your workspace settings were updated.",
            action: { label: "Undo", onClick: () => toast("Changes reverted") },
          })
        }
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
        Show success
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() =>
          toast({
            variant: "error",
            title: "Couldn't publish changes",
            description: "The build failed on step 3 of 5.",
            action: { label: "Retry", onClick: () => toast("Retrying build…") },
          })
        }
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-rose-500" />
        Show error
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() =>
          toast({
            title: "Invite sent",
            description: "Leo will get an email to join Acme.",
          })
        }
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-sky-500" />
        Show info
      </button>
    </div>
  );
}
