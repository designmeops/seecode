# Adding a component

Every component in the marketplace is a folder in `src/registry/components/`. Folders are
discovered automatically — there is no central list to update.

```
src/registry/components/shimmer-button/
├── shimmer-button.tsx   # the component — exactly what the Copy button copies
├── demo.tsx             # the live preview, also shown as the usage example
└── index.ts             # metadata
```

Use [`shimmer-button`](src/registry/components/shimmer-button) as the reference.

## 1. The component (`<slug>.tsx`)

The file is copied verbatim into someone else's project, so it has to work on its own.

- **One file, no extra dependencies.** React 19 + TypeScript + Tailwind CSS v4 utilities only.
  Draw icons with inline SVG (24×24 viewBox, `stroke="currentColor"`).
- **`"use client";` first** whenever the file uses hooks, refs, effects or inline event
  handlers, so it drops straight into a Next.js App Router project.
- **Export a named PascalCase component and its props type** (`export type FooProps`). Accept
  `className` and spread native attributes where it makes sense.
- **Tailwind v4 class names:** `shadow-xs` (v3 `shadow-sm`), `shadow-sm` (v3 `shadow`),
  `rounded-xs` / `rounded-sm`, `outline-hidden`, `bg-linear-to-r` (v3 `bg-gradient-to-r`),
  `shrink-0`, `size-4`, `ring-3`. Opacity uses a slash (`bg-black/50`); arbitrary values use
  underscores for spaces.
- **Default Tailwind theme only** (zinc/neutral, indigo, violet, emerald, amber, rose, sky…).
  Never use the dashboard's own tokens (`bg-panel`, `text-ink`, `border-line`, `bg-brand`, …) —
  a test fails if you do.
- **Custom keyframes** go in a hoisted style tag so the file stays self-contained:

  ```tsx
  <style href="my-slug" precedence="default">{`@keyframes my-slug-spin { … }`}</style>
  ```

  Prefix keyframe names with the slug, animate with an arbitrary value
  (`animate-[my-slug-spin_2s_linear_infinite]`), and add a `motion-reduce:` fallback.
- **Accessible by default:** semantic elements, labels, ARIA where needed, full keyboard
  support, visible focus (`focus-visible:outline-2 focus-visible:outline-offset-2 …`).
- **SSR-safe:** never touch `window` or `document` during render — use effects.
- **Transform-safe pointer math.** Previews can be scaled, so convert pointer positions with the
  element's scale: `const scale = rect.width / el.offsetWidth; const x = (e.clientX - rect.left) / scale;`
- `position: fixed` is only for real overlays (dialogs, toast viewports). Previews contain
  them, so they stay inside the canvas.

## 2. The demo (`demo.tsx`)

- `export default function FooDemo()` that imports the component from `./<slug>`.
- Realistic content, no lorem ipsum. Size the demo itself (e.g. `w-80`); it is centered on the
  canvas.
- It must look good in a grid card (about 340×200 px — shrink it with `preview.cardScale`) and
  on the detail canvas (about 880×360 px — grow it with `preview.height`).

## 3. Metadata (`index.ts`)

```ts
import { defineComponent } from "../../define";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import source from "./shimmer-button.tsx?raw";

export default defineComponent({
  slug: "shimmer-button",            // matches the folder name
  name: "Shimmer Button",
  description: "One sentence, 120 characters max.",
  category: "buttons",               // see src/registry/categories.ts
  tags: ["animated", "cta"],         // 1–4 lowercase keywords
  author: "seecode",                 // see src/registry/authors.ts
  createdAt: "2026-03-02",           // decides the public id (SC-1, SC-2, …)
  updatedAt: "2026-09-12",           // optional
  version: "1.0.0",
  featured: false,                   // optional — featured items sort first
  files: [{ name: "shimmer-button.tsx", language: "tsx", code: source }],
  usage,
  props: [{ name: "children", type: "ReactNode", description: "Button label." }],
  preview: { component: Demo, cardScale: 1, height: 360, tone: "light" },
});
```

## 4. Check it

```bash
npm run typecheck
npm test          # validates metadata, imports, "use client", and server-renders every demo
npm run dev       # then open http://localhost:5173/#/component/<slug>
npx prettier --write src/registry/components/<slug>
```
