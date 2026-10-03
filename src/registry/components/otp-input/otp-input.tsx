"use client";

import {
  Fragment,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

export type OtpInputProps = {
  /** Number of digits. */
  length?: number;
  /** Called on every change with the digits entered so far. */
  onChange?: (code: string) => void;
  /** Called once every box is filled. */
  onComplete?: (code: string) => void;
  /** Colors the boxes emerald or rose, e.g. after verifying the code. */
  status?: "idle" | "success" | "error";
  /** Shows a dash between the two halves of the code. */
  separator?: boolean;
  disabled?: boolean;
  /** Submits the code with a form under this field name. */
  name?: string;
  /** Accessible name of the group of boxes. */
  "aria-label"?: string;
  className?: string;
};

const tones = {
  idle: "border-zinc-200 bg-white text-zinc-950 hover:border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500/15",
  success: "border-emerald-500 bg-emerald-50 text-emerald-700 focus:ring-emerald-500/20",
  error: "border-rose-400 bg-white text-rose-600 focus:border-rose-500 focus:ring-rose-500/15",
};

export function OtpInput({
  length = 6,
  onChange,
  onComplete,
  status = "idle",
  separator = true,
  disabled,
  name,
  "aria-label": ariaLabel = "One-time code",
  className = "",
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const values = Array.from({ length }, (_, i) => digits[i] ?? "");
  const middle = Math.ceil(length / 2);

  function focusBox(index: number) {
    const input = inputs.current[Math.max(0, Math.min(length - 1, index))];
    input?.focus();
    input?.select();
  }

  function commit(next: string[]) {
    if (next.every((digit, i) => digit === values[i])) return;
    setDigits(next);
    const code = next.join("");
    onChange?.(code);
    if (next.every(Boolean)) onComplete?.(code);
  }

  function setDigit(index: number, digit: string) {
    const next = [...values];
    next[index] = digit;
    commit(next);
  }

  /** Spreads several digits across the boxes, e.g. from a paste or SMS autofill. */
  function fill(start: number, chars: string) {
    const next = [...values];
    let index = start;
    for (const char of chars) {
      if (index >= length) break;
      next[index++] = char;
    }
    commit(next);
    focusBox(index);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const { key } = event;
    if (/^\d$/.test(key)) {
      event.preventDefault();
      setDigit(index, key);
      focusBox(index + 1);
    } else if (key === "Backspace") {
      event.preventDefault();
      if (values[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        setDigit(index - 1, "");
        focusBox(index - 1);
      }
    } else if (key === "Delete") {
      event.preventDefault();
      setDigit(index, "");
    } else if (key === "ArrowLeft" || key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + (key === "ArrowLeft" ? -1 : 1));
    } else if (key === "Home" || key === "End") {
      event.preventDefault();
      focusBox(key === "Home" ? 0 : length - 1);
    } else if (key.length === 1) {
      event.preventDefault(); // Digits only.
    }
  }

  // Keyboard input is handled above; this catches mobile keyboards and one-time-code autofill.
  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const typed = raw.replace(/\D/g, "");
    if (raw === "") return setDigit(index, "");
    if (!typed) return;
    if (typed.length === 1) {
      setDigit(index, typed);
      return focusBox(index + 1);
    }
    const current = values[index];
    if (typed.length === 2 && current && typed.includes(current)) {
      setDigit(index, typed[0] === current ? typed[1] : typed[0]);
      return focusBox(index + 1);
    }
    fill(typed.length >= length ? 0 : index, typed);
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted) fill(pasted.length >= length ? 0 : index, pasted);
  }

  return (
    <div role="group" aria-label={ariaLabel} className={`flex items-center gap-2 ${className}`}>
      {values.map((digit, index) => (
        <Fragment key={index}>
          {separator && length > 3 && index === middle && (
            <span aria-hidden="true" className="h-0.5 w-2.5 shrink-0 rounded-full bg-zinc-300" />
          )}
          <input
            ref={(element) => {
              inputs.current[index] = element;
            }}
            value={digit}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={status === "error" || undefined}
            disabled={disabled}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.currentTarget.select()}
            className={`size-11 shrink-0 rounded-lg border text-center text-lg font-medium tabular-nums caret-transparent shadow-xs outline-hidden transition duration-150 selection:bg-transparent focus:ring-3 disabled:cursor-not-allowed disabled:opacity-50 ${tones[status]}`}
          />
        </Fragment>
      ))}
      {name ? <input type="hidden" name={name} value={values.join("")} /> : null}
    </div>
  );
}
