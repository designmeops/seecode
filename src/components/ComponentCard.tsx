import { Star } from "lucide-react";
import { type MouseEvent, memo, type ReactNode } from "react";
import { preloadHighlighter } from "../lib/highlight";
import { navigate, toHref } from "../lib/router";
import { useFavorites } from "../lib/state";
import type { RegistryItem } from "../registry/types";
import { ComponentContextMenu } from "./ComponentMenu";
import { FormatCopyButtons } from "./FormatCopyButtons";
import { Preview } from "./Preview";
import { CategoryIcon } from "./ui/CategoryIcon";

const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="switch"], [role="tab"], [role="radio"], [role="checkbox"], [role="menuitem"], [role="option"], [role="slider"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

/** Clicking empty preview space opens the component; clicking its controls uses them. */
export function openUnlessInteractive(event: MouseEvent<HTMLElement>, slug: string) {
  const target = event.target as Element;
  const control = target.closest(INTERACTIVE);
  if (control && event.currentTarget.contains(control)) return;
  if (window.getSelection()?.toString()) return;
  navigate({ name: "component", slug });
}

interface ComponentCardProps {
  item: RegistryItem;
  /** Keyboard focus (j/k navigation). */
  focused?: boolean;
  onHover?: (slug: string) => void;
  /** Extra context after the name, e.g. "Copied 5m ago". */
  meta?: ReactNode;
}

/** A live preview with the platform copy buttons on top — nothing else competes for attention. */
export const ComponentCard = memo(function ComponentCard({
  item,
  focused = false,
  onHover,
  meta,
}: ComponentCardProps) {
  const favorite = useFavorites().includes(item.slug);
  const href = toHref({ name: "component", slug: item.slug });

  return (
    <ComponentContextMenu item={item}>
      <article
        data-slug={item.slug}
        data-focused={focused || undefined}
        onPointerMove={() => onHover?.(item.slug)}
        onPointerEnter={preloadHighlighter}
        className="group/card relative flex scroll-m-4 flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card transition-[border-color,box-shadow,outline-color] duration-150 hover:border-line-strong hover:shadow-card-hover data-[focused]:border-brand/60 data-[focused]:outline-[3px] data-[focused]:outline-brand/15"
      >
        <header className="relative flex h-11 shrink-0 items-center gap-2 border-b border-line-subtle pr-2 pl-3">
          <CategoryIcon category={item.category} />
          <h3 className="min-w-0 truncate text-[13px] font-medium text-ink">
            <a
              href={href}
              className="outline-hidden after:absolute after:inset-0 after:rounded-t-[11px] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand"
            >
              {item.name}
            </a>
          </h3>
          {favorite && (
            <Star
              size={12}
              strokeWidth={2}
              fill="currentColor"
              aria-label="In favorites"
              className="shrink-0 text-star"
            />
          )}
          {meta && (
            <span className="shrink-0 truncate text-[12px] text-ink-4 tabular-nums">{meta}</span>
          )}
          <FormatCopyButtons item={item} className="relative z-10 ml-auto" />
        </header>
        <div onClick={(event) => openUnlessInteractive(event, item.slug)}>
          <Preview item={item} variant="card" className="h-[212px] cursor-pointer" />
        </div>
      </article>
    </ComponentContextMenu>
  );
});
