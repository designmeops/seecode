import { Star } from "lucide-react";
import { memo, type ReactNode } from "react";
import { formatShortDate } from "../lib/format";
import { preloadHighlighter } from "../lib/highlight";
import { toHref } from "../lib/router";
import { useFavorites } from "../lib/state";
import type { RegistryItem } from "../registry/types";
import { openUnlessInteractive } from "./ComponentCard";
import { ComponentContextMenu } from "./ComponentMenu";
import { FormatCopyButtons } from "./FormatCopyButtons";
import { CategoryIcon } from "./ui/CategoryIcon";

interface ComponentRowProps {
  item: RegistryItem;
  focused?: boolean;
  onHover?: (slug: string) => void;
  /** Replaces the date column, e.g. "Copied 5m ago". */
  meta?: ReactNode;
}

/** Dense list row in the spirit of Linear's issue list. */
export const ComponentRow = memo(function ComponentRow({
  item,
  focused = false,
  onHover,
  meta,
}: ComponentRowProps) {
  const favorite = useFavorites().includes(item.slug);
  const href = toHref({ name: "component", slug: item.slug });

  return (
    <ComponentContextMenu item={item}>
      <div
        data-slug={item.slug}
        data-focused={focused || undefined}
        onPointerMove={() => onHover?.(item.slug)}
        onPointerEnter={preloadHighlighter}
        onClick={(event) => openUnlessInteractive(event, item.slug)}
        className="group/row flex h-11 cursor-pointer scroll-m-10 items-center gap-3 border-b border-line-subtle pr-3 pl-4 transition-colors hover:bg-row-hover data-[focused]:bg-row-focus sm:pl-5"
      >
        <span className="hidden w-11 shrink-0 text-[12px] text-ink-4 tabular-nums sm:block">
          {item.id}
        </span>
        <CategoryIcon category={item.category} />
        <a
          href={href}
          className="max-w-[45%] shrink-0 truncate text-mini font-medium text-ink outline-hidden hover:underline hover:decoration-line-strong hover:underline-offset-2 focus-visible:underline sm:max-w-[40%]"
        >
          {item.name}
        </a>
        {favorite && (
          <Star
            size={12}
            strokeWidth={2}
            fill="currentColor"
            aria-label="In favorites"
            className="-ml-1 shrink-0 text-star"
          />
        )}
        <span className="hidden min-w-0 flex-1 truncate text-mini text-ink-3 md:block">
          {item.description}
        </span>
        <span className="flex-1 md:hidden" />
        <span className="hidden w-[104px] shrink-0 text-right text-[12px] whitespace-nowrap text-ink-4 tabular-nums sm:block">
          {meta ?? formatShortDate(item.createdAt)}
        </span>
        <FormatCopyButtons item={item} />
      </div>
    </ComponentContextMenu>
  );
});
