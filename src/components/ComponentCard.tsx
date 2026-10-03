import { ArrowUpRight } from "lucide-react";
import { type MouseEvent, memo, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { copyComponent, copyKey } from "../lib/copy";
import { isRecent } from "../lib/format";
import { preloadHighlighter } from "../lib/highlight";
import { navigate, toHref } from "../lib/router";
import { useFavorites } from "../lib/state";
import { getCategory } from "../registry/categories";
import type { RegistryItem } from "../registry/types";
import { ComponentContextMenu } from "./ComponentMenu";
import { CopyButton } from "./CopyButton";
import { FavoriteButton } from "./FavoriteButton";
import { Preview } from "./Preview";
import { AuthorAvatar } from "./ui/Avatar";
import { focusRing } from "./ui/Button";
import { NewBadge, Pill, TagPill } from "./ui/Pill";
import { Tooltip } from "./ui/Tooltip";

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
  /** Replaces the id in the footer, e.g. "Copied 5m ago". */
  meta?: ReactNode;
}

export const ComponentCard = memo(function ComponentCard({
  item,
  focused = false,
  onHover,
  meta,
}: ComponentCardProps) {
  const favorites = useFavorites();
  const favorite = favorites.includes(item.slug);
  const category = getCategory(item.category);
  const href = toHref({ name: "component", slug: item.slug });
  const [mainFile] = item.files;

  return (
    <ComponentContextMenu item={item}>
      <article
        data-slug={item.slug}
        data-focused={focused || undefined}
        onPointerMove={() => onHover?.(item.slug)}
        onPointerEnter={preloadHighlighter}
        className="group/card relative flex scroll-m-4 flex-col rounded-xl border border-line bg-panel p-1 shadow-card transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-card-hover data-[focused]:border-brand/45 data-[focused]:shadow-[0_0_0_3px_rgb(94_106_210/0.12)]"
      >
        <div
          className="relative overflow-hidden rounded-[9px] border border-line-subtle"
          onClick={(event) => openUnlessInteractive(event, item.slug)}
        >
          <Preview item={item} variant="card" className="h-[196px] cursor-pointer" />
          {isRecent(item.createdAt) && <NewBadge className="absolute top-2 left-2 shadow-tiny" />}
          <div
            className={cn(
              "absolute top-2 right-2 flex items-center gap-1 transition-opacity duration-150",
              favorite
                ? "opacity-100"
                : "opacity-0 group-focus-within/card:opacity-100 group-hover/card:opacity-100",
            )}
          >
            <FavoriteButton
              item={item}
              variant="secondary"
              className="border-line bg-panel/90 backdrop-blur"
            />
            <Tooltip label="Open component" shortcut="enter">
              <a
                href={href}
                aria-label={`Open ${item.name}`}
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-[5px] border border-line bg-panel/90 text-ink-3 shadow-control backdrop-blur transition-colors hover:text-ink",
                  "opacity-0 group-focus-within/card:opacity-100 group-hover/card:opacity-100",
                  focusRing,
                )}
              >
                <ArrowUpRight size={14} strokeWidth={1.9} />
              </a>
            </Tooltip>
          </div>
        </div>

        <div className="relative flex items-start gap-3 px-2.5 pt-2.5">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13.5px] leading-5 font-medium text-ink">
              <a
                href={href}
                className="outline-hidden after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-brand"
              >
                {item.name}
              </a>
            </h3>
            <p className="mt-0.5 truncate text-[12.5px] leading-[18px] text-ink-3">
              {item.description}
            </p>
          </div>
          <CopyButton
            className="relative z-10"
            copyKey={copyKey(item)}
            onCopy={() => copyComponent(item)}
            tooltip={`Copy ${mainFile.name}`}
            shortcut="c"
          />
        </div>

        <div className="relative flex min-w-0 items-center gap-1.5 px-2.5 pt-2.5 pb-2">
          <Pill dot={category.color}>{category.name}</Pill>
          {item.tags.slice(0, 2).map((tag) => (
            <TagPill key={tag} tag={tag} className="relative z-10 max-[400px]:hidden" />
          ))}
          <span className="ml-auto flex shrink-0 items-center gap-1.5 pl-1 text-[11.5px] text-ink-4 tabular-nums">
            {meta ?? item.id}
            <AuthorAvatar author={item.author} />
          </span>
        </div>
      </article>
    </ComponentContextMenu>
  );
});
