import type { FormatId, RegistryItem } from "../registry/types";
import { copyText } from "./clipboard";
import { defaultFormatFor, getFormat, preferredFormatStore } from "./formats";
import { recordCopy } from "./state";
import { createStore } from "./store";
import { toast } from "./toast";

/**
 * The most recent successful copy, so every button tied to the same code can
 * flash "Copied" — including when the copy came from a keyboard shortcut.
 */
export const copiedStore = createStore<{ key: string; at: number } | null>(null);

export const copyKey = (item: RegistryItem, format: FormatId) => `${item.slug}:${format}`;

/**
 * Copies one format of a component (the last-used one by default), reports the
 * result and remembers the format for next time.
 */
export async function copyComponent(
  item: RegistryItem,
  format: FormatId = defaultFormatFor(item),
): Promise<boolean> {
  const resolved = item.formats[format] ? format : "nextjs";
  const file = item.formats[resolved]!;
  return copyWithToast(file.code, {
    key: copyKey(item, resolved),
    title: `Copied ${getFormat(resolved).name} code`,
    description: `${item.name} · ${file.name}`,
    onCopied: () => {
      recordCopy(item.slug);
      preferredFormatStore.set(resolved);
    },
  });
}

export async function copyWithToast(
  text: string,
  options: { key: string; title: string; description?: string; onCopied?: () => void },
): Promise<boolean> {
  const copied = await copyText(text);
  if (copied) {
    options.onCopied?.();
    copiedStore.set({ key: options.key, at: Date.now() });
    toast({ tone: "success", title: options.title, description: options.description });
  } else {
    toast({
      tone: "error",
      title: "Couldn't access the clipboard",
      description: "Select the code and copy it manually.",
    });
  }
  return copied;
}
