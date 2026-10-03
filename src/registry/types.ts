import type { ComponentType } from "react";
import type { AuthorId } from "./authors";
import type { CategoryId } from "./categories";

export type CodeLanguage = "tsx" | "ts" | "css";

export interface RegistryFile {
  /** File name shown on the code tab, e.g. `shimmer-button.tsx`. */
  name: string;
  language: CodeLanguage;
  /** Raw source, imported with Vite's `?raw` suffix so it always matches the preview. */
  code: string;
}

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface PreviewOptions {
  /** The demo rendered in cards and on the detail canvas. */
  component: ComponentType;
  /** Scale applied inside grid cards so larger demos fit. Defaults to 1. */
  cardScale?: number;
  /** Minimum height of the detail canvas in px. Defaults to 360. */
  height?: number;
  /** Canvas tone. Use `dark` for components designed for dark surfaces. */
  tone?: "light" | "dark";
}

/** What a component folder's `index.ts` exports (see `defineComponent`). */
export interface RegistryEntry {
  /** URL-safe id that matches the folder name. */
  slug: string;
  name: string;
  /** One sentence, shown on cards and in search. */
  description: string;
  category: CategoryId;
  /** 2–4 lowercase keywords. */
  tags: string[];
  author: AuthorId;
  /** ISO date (YYYY-MM-DD). Also decides the public id (SC-1, SC-2, …). */
  createdAt: string;
  updatedAt?: string;
  version: string;
  featured?: boolean;
  /** npm packages required besides React. */
  dependencies?: string[];
  /** The first file is what the quick "Copy" button copies. */
  files: [RegistryFile, ...RegistryFile[]];
  /** Source of the demo, shown as the usage example. */
  usage: string;
  props?: PropDoc[];
  preview: PreviewOptions;
}

export interface RegistryItem extends RegistryEntry {
  /** Stable, human-friendly id such as `SC-7`. */
  id: string;
}
