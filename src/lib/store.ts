import { useSyncExternalStore } from "react";

export interface Store<T> {
  get(): T;
  set(next: T | ((previous: T) => T)): void;
  subscribe(listener: () => void): () => void;
}

/** Minimal external store for state shared across components. */
export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(next) {
      const value = typeof next === "function" ? (next as (previous: T) => T)(state) : next;
      if (Object.is(value, state)) return;
      state = value;
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * A store mirrored to localStorage (and synced across tabs). Storage can be
 * unavailable (private mode, blocked cookies) — the app then works in memory.
 */
export function createPersistentStore<T>(
  key: string,
  initial: T,
  validate: (value: unknown) => value is T,
): Store<T> {
  const store = createStore<T>(readStorage(key, initial, validate));

  store.subscribe(() => {
    try {
      localStorage.setItem(key, JSON.stringify(store.get()));
    } catch {
      // Storage full or blocked: keep the in-memory state.
    }
  });

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === key) store.set(readStorage(key, initial, validate));
    });
  }

  return store;
}

function readStorage<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
