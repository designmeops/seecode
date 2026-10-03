import type { RegistryEntry } from "./types";

/** Identity helper that type-checks a component folder's metadata. */
export function defineComponent(entry: RegistryEntry): RegistryEntry {
  return entry;
}
