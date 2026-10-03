import { createStore, useStore } from "./store";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

const MAX_VISIBLE = 3;
const DURATION = 3200;

export const toastStore = createStore<Toast[]>([]);
const timers = new Map<number, ReturnType<typeof setTimeout>>();
let nextId = 1;

export function toast(input: Omit<Toast, "id">): number {
  const id = nextId++;
  toastStore.set((toasts) => [...toasts, { ...input, id }].slice(-MAX_VISIBLE));
  scheduleDismiss(id);
  return id;
}

export function dismissToast(id: number) {
  clearTimeout(timers.get(id));
  timers.delete(id);
  toastStore.set((toasts) => toasts.filter((t) => t.id !== id));
}

function scheduleDismiss(id: number, delay = DURATION) {
  clearTimeout(timers.get(id));
  timers.set(
    id,
    setTimeout(() => dismissToast(id), delay),
  );
}

/** Hovering the stack keeps toasts on screen. */
export function pauseToasts() {
  for (const timer of timers.values()) clearTimeout(timer);
}

export function resumeToasts() {
  for (const { id } of toastStore.get()) scheduleDismiss(id, 1600);
}

export const useToasts = () => useStore(toastStore);
