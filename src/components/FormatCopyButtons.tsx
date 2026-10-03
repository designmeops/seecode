import { Check } from "lucide-react";
import { useCopied } from "../hooks/useCopied";
import { cn } from "../lib/cn";
import { copyComponent, copyKey } from "../lib/copy";
import { defaultFormatFor, type FormatMeta, formatsOf, usePreferredFormat } from "../lib/formats";
import type { RegistryItem } from "../registry/types";
import { insetFocusRing } from "./ui/Button";
import { FormatIcon } from "./ui/FormatIcon";
import { Tooltip } from "./ui/Tooltip";

interface FormatCopyButtonsProps {
  item: RegistryItem;
  /** Show platform names next to the icons: always, from the `xl` breakpoint, or never. */
  labels?: "always" | "xl" | "never";
  className?: string;
}

/**
 * One copy button per platform (Next.js, Framer, Webflow), joined like a
 * toolbar. The last-used platform also answers to the `c` shortcut.
 */
export function FormatCopyButtons({ item, labels = "never", className }: FormatCopyButtonsProps) {
  const preferred = usePreferredFormat();
  const shortcutFormat = defaultFormatFor(item, preferred);

  return (
    <div
      role="group"
      aria-label={`Copy ${item.name} code`}
      className={cn(
        "flex h-7 shrink-0 items-stretch overflow-hidden rounded-md border border-line bg-card shadow-control",
        className,
      )}
    >
      {formatsOf(item).map((format, index) => (
        <FormatCopyButton
          key={format.id}
          item={item}
          format={format}
          labels={labels}
          shortcut={format.id === shortcutFormat ? "c" : undefined}
          className={index > 0 ? "border-l border-line" : undefined}
        />
      ))}
    </div>
  );
}

function FormatCopyButton({
  item,
  format,
  labels,
  shortcut,
  className,
}: {
  item: RegistryItem;
  format: FormatMeta;
  labels: "always" | "xl" | "never";
  shortcut?: string;
  className?: string;
}) {
  const copied = useCopied(copyKey(item, format.id));
  const label = `Copy ${format.name} code`;

  return (
    <Tooltip label={copied ? "Copied" : label} shortcut={shortcut}>
      <button
        type="button"
        aria-label={labels === "always" ? undefined : label}
        onClick={(event) => {
          event.stopPropagation();
          void copyComponent(item, format.id);
        }}
        className={cn(
          "inline-flex min-w-7 items-center justify-center gap-1.5 px-2 text-[12px] font-medium text-ink-3 transition-colors duration-150 hover:bg-hover hover:text-ink",
          insetFocusRing,
          copied && "text-ink",
          className,
        )}
      >
        <span className="relative flex size-3.5 items-center justify-center">
          {copied ? (
            <Check size={14} strokeWidth={2.4} className="animate-check-in text-good" />
          ) : (
            <FormatIcon format={format.id} size={13} />
          )}
        </span>
        {labels !== "never" && (
          <span className={cn(labels === "xl" && "max-xl:hidden")}>
            {labels === "always" ? <span className="sr-only">Copy </span> : null}
            {format.name}
            {labels === "always" ? <span className="sr-only"> code</span> : null}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
