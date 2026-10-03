import { Check, Copy } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { copiedStore } from "../lib/copy";
import { useStore } from "../lib/store";
import { Button, type ButtonProps } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";

const FLASH_MS = 1600;

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "onCopy"> {
  /** Identifies what gets copied, so shortcut-triggered copies flash this button too. */
  copyKey: string;
  onCopy: () => Promise<boolean>;
  label?: string;
  copiedLabel?: string;
  tooltip?: string;
  shortcut?: string;
  /** Hide the text label (icon-only). */
  iconOnly?: boolean;
  labelClassName?: string;
}

export function CopyButton({
  copyKey,
  onCopy,
  label = "Copy",
  copiedLabel = "Copied",
  tooltip,
  shortcut,
  iconOnly = false,
  labelClassName,
  variant = "secondary",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const last = useStore(copiedStore);
  const [now, setNow] = useState(() => Date.now());
  const copied = last?.key === copyKey && now - last.at < FLASH_MS;

  // Re-render once the flash window ends.
  useEffect(() => {
    if (!last || last.key !== copyKey) return;
    setNow(Date.now());
    const timeout = setTimeout(() => setNow(Date.now()), FLASH_MS);
    return () => clearTimeout(timeout);
  }, [last, copyKey]);

  async function handleClick(event: MouseEvent) {
    event.stopPropagation();
    await onCopy();
  }

  const icon = copied ? (
    <Check
      key="check"
      size={14}
      strokeWidth={2.25}
      className={cn("animate-check-in", variant === "primary" ? "text-white" : "text-good")}
    />
  ) : (
    <Copy key="copy" size={14} strokeWidth={1.9} />
  );

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      className={cn(
        iconOnly && "w-7! px-0!",
        copied && variant === "secondary" && "text-ink",
        className,
      )}
      {...props}
    >
      {icon}
      {!iconOnly && <span className={labelClassName}>{copied ? copiedLabel : label}</span>}
    </Button>
  );

  if (!tooltip) return button;
  return (
    <Tooltip label={tooltip} shortcut={shortcut}>
      {button}
    </Tooltip>
  );
}
