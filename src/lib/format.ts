const DAY = 24 * 60 * 60 * 1000;

/** How long a component counts as "new". */
export const NEW_WINDOW_DAYS = 30;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** `2026-03-02` → `Mar 2, 2026` (dates are calendar days, so format in UTC). */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatShortDate(isoDate: string): string {
  return shortDateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatRelative(timestamp: number, now = Date.now()): string {
  const seconds = Math.round((now - timestamp) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return dateFormatter.format(new Date(timestamp));
}

export function daysSince(isoDate: string, now = Date.now()): number {
  return Math.floor((now - Date.parse(`${isoDate}T00:00:00Z`)) / DAY);
}

export function isRecent(isoDate: string | undefined, now = Date.now()): boolean {
  if (!isoDate) return false;
  const days = daysSince(isoDate, now);
  return days >= 0 && days <= NEW_WINDOW_DAYS;
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export function countLines(code: string): number {
  return code.replace(/\n$/, "").split("\n").length;
}
