import { Star } from "lucide-react";
import { cn } from "../lib/cn";
import { toggleFavorite, useFavorites } from "../lib/state";
import { toast } from "../lib/toast";
import type { RegistryItem } from "../registry/types";
import { IconButton } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";

export function toggleFavoriteWithToast(item: RegistryItem) {
  const added = toggleFavorite(item.slug);
  toast({
    tone: "info",
    title: added ? "Added to favorites" : "Removed from favorites",
    description: item.name,
  });
}

export function FavoriteButton({
  item,
  className,
  variant = "ghost",
  size = "xs",
}: {
  item: RegistryItem;
  className?: string;
  variant?: "ghost" | "secondary";
  size?: "xs" | "sm";
}) {
  const favorites = useFavorites();
  const active = favorites.includes(item.slug);
  const label = active ? "Remove from favorites" : "Add to favorites";

  return (
    <Tooltip label={label} shortcut="f">
      <IconButton
        label={label}
        aria-pressed={active}
        variant={variant}
        size={size}
        onClick={(event) => {
          event.stopPropagation();
          toggleFavoriteWithToast(item);
        }}
        className={cn(active ? "text-star hover:text-star/80" : "text-ink-4", className)}
      >
        <Star size={14} strokeWidth={1.9} fill={active ? "currentColor" : "none"} />
      </IconButton>
    </Tooltip>
  );
}
