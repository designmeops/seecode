import { memo, type ReactNode } from "react";
import { copyComponent, copyKey } from "../lib/copy";
import { formatShortDate, isRecent } from "../lib/format";
import { preloadHighlighter } from "../lib/highlight";
import { toHref } from "../lib/router";
import type { RegistryItem } from "../registry/types";
import { openUnlessInteractive } from "./ComponentCard";
import { ComponentContextMenu } from "./ComponentMenu";
import { CopyButton } from "./CopyButton";
import { FavoriteButton } from "./FavoriteButton";
import { AuthorAvatar } from "./ui/Avatar";
import { CategoryIcon } from "./ui/CategoryIcon";
import { NewBadge, TagPill } from "./ui/Pill";

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
  const href = toHref({ name: "component", slug: item.slug });

  return (
    <ComponentContextMenu item={item}>
      <div
        data-slug={item.slug}
        data-focused={focused || undefined}
        onPointerMove={() => onHover?.(item.slug)}
        onPointerEnter={preloadHighlighter}
        onClick={(event) => openUnlessInteractive(event, item.slug)}
        className="group/row flex h-11 cursor-pointer scroll-m-10 items-center gap-3 border-b border-line-subtle pr-3 pl-4 transition-colors hover:bg-[#f7f7f9] data-[focused]:bg-[#f4f4f7] sm:pl-5"
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
        {isRecent(item.createdAt) && <NewBadge />}
        <span className="hidden min-w-0 flex-1 truncate text-mini text-ink-3 md:block">
          {item.description}
        </span>
        <span className="flex-1 md:hidden" />
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1 xl:flex">
            {item.tags.slice(0, 2).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
          <span className="hidden w-[104px] text-right text-[12px] whitespace-nowrap text-ink-4 tabular-nums sm:block">
            {meta ?? formatShortDate(item.createdAt)}
          </span>
          <AuthorAvatar author={item.author} size="sm" className="max-sm:hidden" />
          <FavoriteButton item={item} />
          <CopyButton
            copyKey={copyKey(item)}
            onCopy={() => copyComponent(item)}
            tooltip={`Copy ${item.files[0].name}`}
            shortcut="c"
            aria-label={`Copy ${item.files[0].name}`}
            className="max-sm:w-7 max-sm:px-0"
            labelClassName="hidden sm:inline"
          />
        </div>
      </div>
    </ComponentContextMenu>
  );
});
