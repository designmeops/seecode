import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "xs" | "sm" | "md";

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** For controls inside a clipped group, where an outer ring would be cut off. */
export const insetFocusRing =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(0_0_0/0.18)] hover:bg-brand-hover",
  secondary:
    "border border-line bg-card text-ink-2 shadow-control hover:border-line-strong hover:bg-control-hover hover:text-ink",
  ghost: "text-ink-3 hover:bg-hover hover:text-ink",
};

const sizes: Record<Size, string> = {
  xs: "h-6 gap-1 rounded-[5px] px-1.5 text-[12px]",
  sm: "h-7 gap-1.5 rounded-md px-2 text-[12px]",
  md: "h-8 gap-2 rounded-md px-3 text-mini",
};

const iconSizes: Record<Size, string> = {
  xs: "size-6 rounded-[5px]",
  sm: "size-7 rounded-md",
  md: "size-8 rounded-md",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 select-none disabled:pointer-events-none disabled:opacity-50",
        focusRing,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
  size?: Size;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = "ghost", size = "sm", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-[background-color,border-color,color] duration-150 disabled:pointer-events-none disabled:opacity-40",
        focusRing,
        variants[variant],
        iconSizes[size],
        className,
      )}
      {...props}
    />
  );
});
