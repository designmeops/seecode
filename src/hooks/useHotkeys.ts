import { type RefObject, useEffect, useRef } from "react";

/**
 * Bindings use a compact syntax: `mod+k` (⌘ on macOS, Ctrl elsewhere), single
 * keys (`c`, `j`, `ArrowDown`, `Escape`, `/`, `?`) and Linear-style sequences
 * (`g e`). One window listener serves every mounted scope; the most recently
 * mounted scope wins when two bind the same key.
 */
export type HotkeyMap = Record<string, (event: KeyboardEvent) => void>;

const SEQUENCE_TIMEOUT = 1000;
const scopes: RefObject<HotkeyMap>[] = [];
let pending: { key: string; at: number } | null = null;

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

/** Keystrokes inside live previews belong to the component being previewed. */
function isInsidePreview(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(".preview-root") !== null;
}

const CONTROL =
  'a[href], button, summary, select, [role="button"], [role="tab"], [role="radio"], [role="menuitem"], [role="option"], [role="switch"], [role="checkbox"], [role="slider"]';

/** Enter, Space and arrows belong to a focused control (activating a button, moving in a radio group). */
function isControlKey(event: KeyboardEvent): boolean {
  if (
    !["Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(
      event.key,
    )
  ) {
    return false;
  }
  return event.target instanceof Element && event.target.closest(CONTROL) !== null;
}

/** An app dialog, popover or menu is open (demo overlays inside previews don't count). */
function hasOpenOverlay(): boolean {
  return [
    ...document.querySelectorAll('[role="dialog"], [role="menu"], [role="alertdialog"]'),
  ].some((element) => !element.closest(".preview-root"));
}

function matches(binding: string, event: KeyboardEvent): boolean {
  const parts = binding.split("+");
  const key = parts.pop()!;
  const mod = event.metaKey || event.ctrlKey;
  if (parts.includes("mod") !== mod) return false;
  if (parts.includes("alt") !== event.altKey) return false;
  if (parts.includes("shift") && !event.shiftKey) return false;
  return event.key.toLowerCase() === key.toLowerCase();
}

function bindings(): [string, (event: KeyboardEvent) => void][] {
  return scopes
    .slice()
    .reverse()
    .flatMap((scope) => Object.entries(scope.current ?? {}));
}

function onKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing) return;
  const quiet =
    isEditable(event.target) ||
    isInsidePreview(event.target) ||
    isControlKey(event) ||
    hasOpenOverlay();
  const all = bindings();

  const sequenceStart = pending && Date.now() - pending.at < SEQUENCE_TIMEOUT ? pending.key : null;
  pending = null;

  if (sequenceStart && !quiet) {
    for (const [binding, handler] of all) {
      const [first, second] = binding.split(" ");
      if (second && first === sequenceStart && matches(second, event)) {
        event.preventDefault();
        handler(event);
        return;
      }
    }
  }

  for (const [binding, handler] of all) {
    if (binding.includes(" ")) continue;
    // Shortcuts with a modifier work everywhere; plain keys stay out of the way.
    if (quiet && !binding.startsWith("mod+")) continue;
    if (matches(binding, event)) {
      event.preventDefault();
      handler(event);
      return;
    }
  }

  const key = event.key.toLowerCase();
  const startsSequence = all.some(
    ([binding]) => binding.includes(" ") && binding.split(" ")[0] === key,
  );
  if (startsSequence && !quiet && !event.metaKey && !event.ctrlKey && !event.altKey) {
    pending = { key, at: Date.now() };
  }
}

export function useHotkeys(map: HotkeyMap, enabled = true) {
  const ref = useRef(map);
  ref.current = map;

  useEffect(() => {
    if (!enabled) return;
    if (scopes.length === 0) window.addEventListener("keydown", onKeyDown);
    scopes.push(ref);
    return () => {
      scopes.splice(scopes.indexOf(ref), 1);
      if (scopes.length === 0) window.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled]);
}
