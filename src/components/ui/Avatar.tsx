import { cn } from "../../lib/cn";
import { type AuthorId, getAuthor } from "../../registry/authors";

const sizes = {
  xs: "size-4 text-[7px]",
  sm: "size-5 text-[8px]",
  md: "size-6 text-[9.5px]",
} as const;

function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

export function AuthorAvatar({
  author,
  size = "xs",
  className,
}: {
  author: AuthorId;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { name, colors } = getAuthor(author);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full leading-none font-semibold text-white ring-1 ring-black/5",
        sizes[size],
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    >
      {initials(name)}
    </span>
  );
}
