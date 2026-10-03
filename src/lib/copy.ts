import type { RegistryItem } from "../registry/types";
import { copyText } from "./clipboard";
import { recordCopy } from "./state";
import { createStore } from "./store";
import { toast } from "./toast";

/**
 * The most recent successful copy, so every button tied to the same file can
 * flash "Copied" — including when the copy came from a keyboard shortcut.
 */
export const copiedStore = createStore<{ key: string; at: number } | null>(null);

export const copyKey = (item: RegistryItem, fileIndex = 0) => `${item.slug}:${fileIndex}`;

/** Copies a component file (the main source by default) and reports the result. */
export async function copyComponent(item: RegistryItem, fileIndex = 0): Promise<boolean> {
  const file = item.files[fileIndex] ?? item.files[0];
  return copyWithToast(file.code, {
    key: copyKey(item, fileIndex),
    title: `Copied ${file.name}`,
    description: `${item.name} · ${item.id}`,
    onCopied: () => recordCopy(item.slug),
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
