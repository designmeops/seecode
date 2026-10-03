import { useEffect, useState } from "react";
import { OtpInput } from "./otp-input";

export default function OtpInputDemo() {
  const [verified, setVerified] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!resent) return;
    const timer = setTimeout(() => setResent(false), 2400);
    return () => clearTimeout(timer);
  }, [resent]);

  function resend() {
    setAttempt((n) => n + 1); // A new key clears the boxes.
    setVerified(false);
    setResent(true);
  }

  return (
    <div className="w-96 rounded-xl border border-zinc-200 bg-white px-8 pt-7 pb-6 text-center shadow-[0_1px_2px_rgb(9_9_11/0.04),0_8px_24px_-8px_rgb(9_9_11/0.1)]">
      <div className="mx-auto grid size-10 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-xs">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7.5 8 5.5 8-5.5" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-zinc-950">
        Check your email
      </h3>
      <p className="mt-1 text-sm text-zinc-500">
        We sent a code to <span className="font-medium text-zinc-900">ana@acme.com</span>
      </p>
      <OtpInput
        key={attempt}
        className="mt-6 justify-center"
        status={verified ? "success" : "idle"}
        onChange={(code) => {
          if (code.length < 6) setVerified(false);
        }}
        onComplete={() => setVerified(true)}
      />
      <p aria-live="polite" className="mt-5 flex h-5 items-center justify-center gap-1.5 text-sm">
        {verified ? (
          <span className="flex items-center gap-1.5 font-medium text-emerald-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12.5 2.5 2.5 4.5-5" />
            </svg>
            Verified
          </span>
        ) : resent ? (
          <span className="text-zinc-500">A new code is on its way.</span>
        ) : (
          <>
            <span className="text-zinc-500">Didn’t get it?</span>
            <button
              type="button"
              onClick={resend}
              className="cursor-pointer rounded-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Resend code
            </button>
          </>
        )}
      </p>
    </div>
  );
}
