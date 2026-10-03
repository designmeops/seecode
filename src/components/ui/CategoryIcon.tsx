import { cn } from "../../lib/cn";
import { type CategoryId, getCategory } from "../../registry/categories";

const sizes = {
  sm: { box: "size-[18px] rounded-[5px]", icon: 11 },
  md: { box: "size-6 rounded-md", icon: 14 },
  lg: { box: "size-8 rounded-lg", icon: 17 },
} as const;

/** Tinted icon tile, like Linear's team icons. */
export function CategoryIcon({
  category,
  size = "sm",
  className,
}: {
  category: CategoryId;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { icon: Icon, color } = getCategory(category);
  const { box, icon } = sizes[size];
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center", box, className)}
      style={{
        color,
        // Translucent tints read on every surface, in both themes.
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      <Icon size={icon} strokeWidth={2} />
    </span>
  );
}
