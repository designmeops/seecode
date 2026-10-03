"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

export type TagInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "size"
> & {
  /** Controlled tags. Pair with `onChange`. */
  value?: string[];
  /** Initial tags when uncontrolled. */
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  /** Stop accepting new tags once this many are added. */
  maxTags?: number;
};

export function TagInput({
  value,
  defaultValue = [],
  onChange,
  maxTags = Infinity,
  placeholder = "Add tag…",
  name,
  disabled,
  className = "",
  onKeyDown,
  ...props
}: TagInputProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const tags = value ?? uncontrolled;
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const full = tags.length >= maxTags;

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  function update(next: string[], message: string) {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
    setAnnouncement(message);
  }

  /** Adds trimmed, case-insensitively unique tags. A duplicate flashes the existing chip. */
  function addTags(candidates: string[]) {
    const next = [...tags];
    for (const candidate of candidates) {
      const tag = candidate.trim();
      if (!tag) continue;
      const existing = next.find((t) => t.toLowerCase() === tag.toLowerCase());
      if (existing) {
        setHighlighted(existing);
        clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setHighlighted(null), 900);
        continue;
      }
      if (next.length >= maxTags) break;
      next.push(tag);
    }
    if (next.length > tags.length) update(next, `Added ${next.slice(tags.length).join(", ")}`);
  }

  function removeTag(index: number) {
    update(
      tags.filter((_, i) => i !== index),
      `Removed ${tags[index]}`,
    );
  }

  // Commas are handled here rather than on keydown so pasted lists and mobile keyboards work too.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const parts = event.target.value.split(",");
    if (parts.length > 1) addTags(parts.slice(0, -1));
    setDraft(parts[parts.length - 1].trimStart());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && draft.trim()) {
      event.preventDefault();
      addTags([draft]);
      setDraft("");
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault();
      removeTag(tags.length - 1);
    }
  }

  // Clicking anywhere in the field (but not on a chip's button) focuses the text input.
  function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button, input")) return;
    event.preventDefault();
    inputRef.current?.focus();
  }

  return (
    <div
      onMouseDown={handleFieldMouseDown}
      className={`flex min-h-10 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border border-zinc-300 bg-white px-1.5 py-[7px] shadow-xs transition-[border-color,box-shadow] duration-150 focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-500/15 hover:not-focus-within:border-zinc-400 ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`inline-flex h-6 max-w-full items-center gap-0.5 rounded-md pr-0.5 pl-2 text-xs font-medium ring-1 transition-colors duration-200 ring-inset ${
            highlighted === tag
              ? "bg-amber-50 text-amber-800 ring-amber-300"
              : "bg-zinc-100 text-zinc-700 ring-zinc-950/5"
          }`}
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            disabled={disabled}
            onClick={() => {
              removeTag(index);
              inputRef.current?.focus();
            }}
            className="grid size-5 shrink-0 cursor-pointer place-items-center rounded-[5px] text-zinc-400 transition-colors hover:bg-zinc-950/5 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        disabled={disabled}
        readOnly={full}
        placeholder={full ? "" : placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-6 min-w-20 flex-1 bg-transparent px-1 text-sm text-zinc-950 outline-hidden placeholder:text-zinc-400"
        {...props}
      />
      {name ? <input type="hidden" name={name} value={tags.join(",")} /> : null}
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
