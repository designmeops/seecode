import {
  Component,
  type CSSProperties,
  type ErrorInfo,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import type { RegistryItem } from "../registry";

interface PreviewProps {
  item: RegistryItem;
  /** `card` applies the item's card scale; `canvas` renders at 1:1. */
  variant: "card" | "canvas";
  /** Changing this remounts the demo (used by the replay button). */
  replayKey?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a registry demo in an isolated surface:
 * - `.preview-root` resets inherited typography to page defaults,
 * - `contain: layout paint` keeps fixed-position overlays (dialogs, toasts) inside the frame,
 * - in-preview links and form submits never navigate the dashboard.
 */
export function Preview({ item, variant, replayKey = 0, className, style }: PreviewProps) {
  const Demo = item.preview.component;
  const scale = variant === "card" ? (item.preview.cardScale ?? 1) : 1;
  const dark = item.preview.tone === "dark";

  return (
    <div
      className={cn(
        "preview-root relative isolate flex items-center justify-center overflow-hidden [contain:layout_paint]",
        dark ? "bg-dots-dark" : "bg-dots",
        className,
      )}
      style={style}
      onClickCapture={preventLinkNavigation}
      onSubmitCapture={(event) => event.preventDefault()}
    >
      <div
        className="flex shrink-0 items-center justify-center"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
      >
        <PreviewErrorBoundary key={replayKey} name={item.name}>
          <Demo />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
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
