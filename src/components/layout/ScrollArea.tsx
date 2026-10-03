import { type ReactNode, useLayoutEffect, useRef } from "react";
import { cn } from "../../lib/cn";

const positions = new Map<string, number>();

/** Scroll container that remembers its position per route (back from a detail page lands where you were). */
export function ScrollArea({
  routeKey,
  children,
  className,
}: {
  routeKey: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.scrollTop = positions.get(routeKey) ?? 0;
    return () => {
      positions.set(routeKey, element.scrollTop);
    };
  }, [routeKey]);

  return (
    <div
      ref={ref}
      data-scroll-area
      className={cn("scrollbar-subtle min-h-0 flex-1 overflow-y-auto", className)}
    >
      {children}
    </div>
  );
}
