import { useEffect, useState } from "react";
import { copiedStore } from "../lib/copy";
import { useStore } from "../lib/store";

const FLASH_MS = 1600;

/** True for a moment after the code identified by `key` was copied, wherever the copy came from. */
export function useCopied(key: string): boolean {
  const last = useStore(copiedStore);
  const [now, setNow] = useState(() => Date.now());

  // Re-render once the flash window ends.
  useEffect(() => {
    if (!last || last.key !== key) return;
    setNow(Date.now());
    const timeout = setTimeout(() => setNow(Date.now()), FLASH_MS);
    return () => clearTimeout(timeout);
  }, [last, key]);

  return last?.key === key && now - last.at < FLASH_MS;
}
