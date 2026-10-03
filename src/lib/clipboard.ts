/**
 * Copies text, falling back to `execCommand` where the async Clipboard API is
 * unavailable (insecure origins, some embedded webviews and iframes).
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or document not focused — try the legacy path.
    }
  }
  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  const active = document.activeElement as HTMLElement | null;
  const selection = document.getSelection();
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  textarea.remove();
  if (range && selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
  active?.focus({ preventScroll: true });
  return copied;
}
