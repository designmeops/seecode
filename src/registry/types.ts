import type { ComponentType } from "react";
import type { AuthorId } from "./authors";
import type { CategoryId } from "./categories";

export type CodeLanguage = "tsx" | "ts" | "css" | "html";

/** Platforms a component can be copied for. */
export type FormatId = "nextjs" | "framer" | "webflow";

export interface CodeFile {
  /** File name shown on the code tab, e.g. `deal-card.tsx`. */
  name: string;
  language: CodeLanguage;
  /** Raw source, imported with Vite's `?raw` suffix so it always matches what ships. */
  code: string;
}

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface PreviewOptions {
  /** The demo on the component page, built from the Next.js version (also the usage example). */
  component: ComponentType;
  /** A compact demo for grid cards. Defaults to `component`. */
  thumbnail?: ComponentType;
  /** Scale applied inside grid cards so larger demos fit. Defaults to 1. */
  cardScale?: number;
  /** Minimum height of the detail canvas in px. Defaults to 360. */
  height?: number;
  /**
   * Width in px the demo is designed for. On narrower canvases the preview zooms
   * out to fit, like a design tool, instead of squeezing the layout.
   */
  width?: number;
}

/** What a component folder's `index.ts` exports (see `defineComponent`). */
export interface RegistryEntry {
  /** URL-safe id that matches the folder name. */
  slug: string;
  name: string;
  /** One sentence, shown on the component page and in search. */
  description: string;
  category: CategoryId;
  /** 1–4 lowercase keywords, used for search. */
  tags: string[];
  author: AuthorId;
  /** ISO date (YYYY-MM-DD). Also decides the public id (SC-1, SC-2, …). */
  createdAt: string;
  updatedAt?: string;
  version: string;
  featured?: boolean;
  /**
   * The same component for each platform. Next.js (React + Tailwind CSS) is
   * required and powers the live preview; Framer and Webflow are optional.
   */
  formats: { nextjs: CodeFile } & Partial<Record<Exclude<FormatId, "nextjs">, CodeFile>>;
  /** Source of the demo, shown as the Next.js usage example. */
  usage: string;
  props?: PropDoc[];
  preview: PreviewOptions;
}

export interface RegistryItem extends RegistryEntry {
  /** Stable, human-friendly id such as `SC-7`. */
  id: string;
}
