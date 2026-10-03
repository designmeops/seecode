import { ArrowUpRight, Copy, Link2, Star } from "lucide-react";
import { ContextMenu } from "radix-ui";
import type { ReactNode } from "react";
import { copyComponent, copyWithToast } from "../lib/copy";
import { navigate, shareUrl } from "../lib/router";
import { useFavorites } from "../lib/state";
import { getCategory } from "../registry/categories";
import type { RegistryItem } from "../registry/types";
import { toggleFavoriteWithToast } from "./FavoriteButton";
import { CategoryIcon } from "./ui/CategoryIcon";
import { Shortcut } from "./ui/Kbd";
import { menuContentClass, menuItemClass, menuLabelClass, menuSeparatorClass } from "./ui/Menu";

export function copyComponentLink(item: RegistryItem) {
  return copyWithToast(shareUrl({ name: "component", slug: item.slug }), {
    key: `link:${item.slug}`,
    title: "Copied link",
    description: item.name,
  });
}

/** Right-click menu for cards and rows, like Linear's issue context menu. */
export function ComponentContextMenu({
  item,
  children,
}: {
  item: RegistryItem;
  children: ReactNode;
}) {
  const favorites = useFavorites();
  const favorite = favorites.includes(item.slug);
  const category = getCategory(item.category);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={menuContentClass} collisionPadding={8}>
          <ContextMenu.Label className={menuLabelClass}>
            {item.id} · {item.name}
          </ContextMenu.Label>
          <ContextMenu.Item
            className={menuItemClass}
            onSelect={() => navigate({ name: "component", slug: item.slug })}
          >
            <ArrowUpRight size={15} />
            Open
            <Shortcut keys="enter" className="ml-auto" />
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={() => void copyComponent(item)}>
            <Copy size={15} />
            Copy code
            <Shortcut keys="c" className="ml-auto" />
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={() => void copyComponentLink(item)}>
            <Link2 size={15} />
            Copy link
          </ContextMenu.Item>
          <ContextMenu.Item
            className={menuItemClass}
            onSelect={() => toggleFavoriteWithToast(item)}
          >
            <Star size={15} />
            {favorite ? "Remove from favorites" : "Add to favorites"}
            <Shortcut keys="f" className="ml-auto" />
          </ContextMenu.Item>
          <ContextMenu.Separator className={menuSeparatorClass} />
          <ContextMenu.Item
            className={menuItemClass}
            onSelect={() => navigate({ name: "category", category: item.category })}
          >
            <CategoryIcon category={item.category} />
            More in {category.name}
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
