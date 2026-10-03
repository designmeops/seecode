import {
  Component,
  type CSSProperties,
  type ErrorInfo,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "../lib/cn";
import { type Theme, useTheme } from "../lib/theme";
import type { RegistryItem } from "../registry";

interface PreviewProps {
  item: RegistryItem;
  /** `card` shows the compact thumbnail at the card scale; `canvas` shows the full demo at 1:1. */
  variant: "card" | "canvas";
  /** Canvas background. Defaults to the app's theme. */
  theme?: Theme;
  /** Changing this remounts the demo (used by the replay button). */
  replayKey?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a registry demo on its own canvas:
 * - `.preview-root` resets inherited typography to page defaults,
 * - `contain: layout paint` keeps fixed-position overlays inside the frame,
 * - in-preview links and form submits never navigate the dashboard.
 */
export function Preview({ item, variant, theme, replayKey = 0, className, style }: PreviewProps) {
  const app = useTheme();
  const canvas = theme ?? app.theme;
  const Demo =
    variant === "card"
      ? (item.preview.thumbnail ?? item.preview.component)
      : item.preview.component;
  const scale = variant === "card" ? (item.preview.cardScale ?? 1) : 1;
  // Phones get the demo's own responsive layout; zooming a desktop layout would be unreadable.
  const wide = useWideViewport();
  const designWidth = variant === "canvas" && wide ? item.preview.width : undefined;
  const frameRef = useRef<HTMLDivElement>(null);
  const zoom = useFitZoom(frameRef, designWidth);

  return (
    <div
      ref={frameRef}
      className={cn(
        "preview-root relative isolate flex items-center justify-center-safe overflow-hidden [contain:layout_paint]",
        variant === "canvas" && "max-md:overflow-x-auto",
        canvas === "dark" && "dark",
        className,
      )}
      style={style}
      onClickCapture={preventLinkNavigation}
      onSubmitCapture={(event) => event.preventDefault()}
    >
      <div
        className="flex w-full shrink-0 items-center justify-center"
        style={
          designWidth
            ? { width: designWidth, zoom }
            : scale === 1
              ? undefined
              : { transform: `scale(${scale})` }
        }
      >
        <PreviewErrorBoundary key={replayKey} name={item.name}>
          <Demo />
        </PreviewErrorBoundary>
      </div>
      {zoom < 1 && (
        <span className="pointer-events-none absolute right-2.5 bottom-2 rounded-[5px] border border-line bg-raised px-1.5 py-0.5 font-sans text-[11px] leading-4 font-medium text-ink-3 tabular-nums shadow-tiny">
          {Math.round(zoom * 100)}%
        </span>
      )}
    </div>
  );
}

const wideQuery =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(min-width: 768px)")
    : null;

function subscribeWide(onChange: () => void) {
  wideQuery?.addEventListener("change", onChange);
  return () => wideQuery?.removeEventListener("change", onChange);
}

function useWideViewport(): boolean {
  return useSyncExternalStore(
    subscribeWide,
    () => wideQuery?.matches ?? true,
    () => true,
  );
}

/** Zoom that fits a demo designed at `designWidth` px into the frame's content box. */
function useFitZoom(frameRef: RefObject<HTMLElement | null>, designWidth?: number): number {
  const [zoom, setZoom] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !designWidth) return;
    const update = () => {
      const { paddingLeft, paddingRight } = getComputedStyle(frame);
      const available =
        frame.clientWidth - (parseFloat(paddingLeft) || 0) - (parseFloat(paddingRight) || 0);
      // A detached or hidden frame (e.g. mid hot-reload) has no width to fit into.
      if (!Number.isFinite(available) || available <= 0) return;
      setZoom(Math.min(1, Math.max(0.25, available / designWidth)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef, designWidth]);

  return designWidth ? zoom : 1;
}

function preventLinkNavigation(event: MouseEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement;
  if (target.closest("a[href]")) event.preventDefault();
}

interface BoundaryProps {
  name: string;
  children: ReactNode;
}

class PreviewErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[seecode] Preview for "${this.props.name}" crashed`, error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return <p className="text-mini text-ink-3">This preview failed to render.</p>;
    }
    return this.props.children;
  }
}
