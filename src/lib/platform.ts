export const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

/** Label for the primary modifier key. */
export const MOD = isMac ? "⌘" : "Ctrl";
