# Adding a component

Every component is a folder in `src/registry/components/`. Folders are discovered automatically —
there is no central list to update. Each component ships the same UI for three platforms, and the
dashboard shows a copy button for each one.

```
src/registry/components/deal-card/
├── deal-card.tsx            # Next.js — React + Tailwind CSS (required, powers the live preview)
├── deal-card.framer.tsx     # Framer — a code component with property controls
├── deal-card.webflow.html   # Webflow — an HTML + CSS embed
├── demo.tsx                 # the preview on the component page (also the Next.js usage example)
├── thumbnail.tsx            # optional: a compact preview for grid cards
└── index.ts                 # metadata
```

Use [`deal-card`](src/registry/components/deal-card) as the reference for all three formats.

## Next.js — `<slug>.tsx`

Copied verbatim into a React project, so it has to work on its own.

- **One file, no dependencies** besides React. Tailwind CSS v4 utilities only (default theme;
  arbitrary values like `text-[#17171b]` for design colors). Inline SVG icons.
- **`"use client";` first** whenever the file uses hooks, refs, effects or event handlers.
- **Export a named PascalCase component and its props type.** Accept `className` and spread
  native attributes on the root. Content (names, links, lists) comes from props.
- **Never use the dashboard's own tokens** (`bg-panel`, `text-ink`, `border-line`, …) — a test fails
  if you do.
- **Accessible:** semantic elements (`header`, `nav`, `dl`, `ul`, `button`), labels for icon-only
  buttons, keyboard support, visible focus styles.
- **SSR-safe:** never touch `window` or `document` during render.

## Framer — `<slug>.framer.tsx`

Pasted into Framer (Assets → Code → New code file), so it follows Framer's conventions:

- `export default function ComponentName(props)` with defaults for every prop.
- Styles are inline style objects (Framer doesn't run Tailwind); use a `<style>` tag with
  prefixed class names only for hover and focus states.
- Spread Framer's `style` prop onto the root so the component respects canvas sizing.
- `addPropertyControls(Component, { … })` with a control and `defaultValue` for each prop, and the
  `@framerSupportedLayoutWidth` / `@framerSupportedLayoutHeight` annotations.
- Imports only from `react` and `framer`. The display name on the code tab is `PascalCase.tsx`.

## Webflow — `<slug>.webflow.html`

Pasted into a Webflow Code Embed, so it is plain HTML with its CSS (and JS if it's interactive):

- Every class starts with `sc-` plus the component name (`sc-deal-card__header`), so the embed
  can't restyle the rest of the site — a test checks this.
- One `<style>` block; reset margins on headings and lists inside the component, and set
  `box-sizing`. Interactive behavior goes in one inline `<script>`; no external scripts.
- Icons as inline SVG — define each once in a hidden `<svg>` sprite and `<use href="#…">` it.
- A Google Fonts `<link>` for the typeface is the only external resource allowed.
- It reproduces the demo (what the component page shows), so designers paste a complete section.

## The demo (`demo.tsx`) and thumbnail (`thumbnail.tsx`)

- `export default function FooDemo()` that imports the component from `./<slug>`.
- Realistic content, no lorem ipsum. The demo shows the component in context on the detail
  canvas; the optional thumbnail fits a grid card (~340 × 210 px, shrink with `preview.cardScale`).
- Build the demo at the width it was designed for and set `preview.width` to it. On narrower
  canvases the preview zooms out to fit, like a design tool, instead of squeezing the layout.
  Phones get the demo's own responsive layout.
- Give demos an opaque background matching the design — the canvas behind it can be light or dark.

## Metadata (`index.ts`)

```ts
import { defineComponent } from "../../define";
import nextjs from "./deal-card.tsx?raw";
import framer from "./deal-card.framer.tsx?raw";
import webflow from "./deal-card.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "deal-card", // matches the folder name
  name: "Deal Card",
  description: "One sentence, 120 characters max.",
  category: "cards", // see src/registry/categories.ts
  tags: ["crm", "deals"], // 1–4 lowercase keywords, used for search
  author: "designme", // see src/registry/authors.ts
  createdAt: "2026-10-03", // decides the public id (SC-1, SC-2, …)
  version: "1.0.0",
  formats: {
    nextjs: { name: "deal-card.tsx", language: "tsx", code: nextjs },
    framer: { name: "DealCard.tsx", language: "tsx", code: framer },
    webflow: { name: "deals.html", language: "html", code: webflow },
  },
  usage,
  props: [{ name: "status", type: '"pitching" | "lost" | "won"', description: "Deal stage." }],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.92, height: 420, width: 940 },
});
```

## Check it

```bash
npm run typecheck
npm test   # validates metadata, renders every demo and Framer version, checks Webflow class names
npm run dev  # then open http://localhost:5173/#/component/<slug>
npx prettier --write src/registry/components/<slug>
```
