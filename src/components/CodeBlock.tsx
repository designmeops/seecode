import { ChevronDown, FileCode2 } from "lucide-react";
import { type CSSProperties, type ReactNode, useId, useMemo, useState } from "react";
import type { ThemedToken } from "shiki/core";
import { cn } from "../lib/cn";
import { countLines } from "../lib/format";
import { useHighlightedLines } from "../lib/highlight";
import type { CodeLanguage } from "../registry/types";
import { CopyButton } from "./CopyButton";
import { Button, focusRing } from "./ui/Button";

export interface CodeTab {
  id: string;
  label: string;
  /** Defaults to a file icon. */
  icon?: ReactNode;
  /** File name shown next to the copy button, e.g. `deal-card.tsx`. */
  fileName?: string;
  language: CodeLanguage;
  code: string;
  copyKey: string;
  onCopy: () => Promise<boolean>;
  copyTooltip?: string;
  copyShortcut?: string;
}

const COLLAPSED_LINES = 26;

interface CodeBlockProps {
  tabs: CodeTab[];
  /** Controlled selection (optional). */
  value?: string;
  onValueChange?: (id: string) => void;
  /** Label for the tab list. */
  label?: string;
  className?: string;
}

export function CodeBlock({
  tabs,
  value,
  onValueChange,
  label = "Files",
  className,
}: CodeBlockProps) {
  const [ownValue, setOwnValue] = useState(tabs[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const baseId = useId();
  const activeId = value ?? ownValue;
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  const select = (id: string) => {
    setOwnValue(id);
    onValueChange?.(id);
  };

  const plainLines = useMemo(() => active.code.replace(/\n$/, "").split("\n"), [active.code]);
  const highlighted = useHighlightedLines(active.code, active.language);
  const lines: (string | ThemedToken[])[] = highlighted ?? plainLines;
  const collapsible = plainLines.length > COLLAPSED_LINES + 6;
  const collapsed = collapsible && !expanded;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-subtle", className)}>
      <div className="flex h-10 items-center gap-2 border-b border-line bg-card pr-2 pl-1.5">
        <div
          role="tablist"
          aria-label={label}
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]"
        >
          {tabs.map((tab, index) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                id={`${baseId}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                  const step = event.key === "ArrowRight" ? 1 : -1;
                  const next = tabs[(index + step + tabs.length) % tabs.length];
                  select(next.id);
                  document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
                }}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-[12.5px] font-medium transition-colors",
                  focusRing,
                  selected ? "bg-active text-ink" : "text-ink-3 hover:bg-hover hover:text-ink-2",
                )}
              >
                <span className={cn("flex", selected ? "text-ink-2" : "text-ink-4")}>
                  {tab.icon ?? <FileCode2 size={13} strokeWidth={1.9} />}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <span className="hidden items-center gap-1.5 text-[12px] text-ink-4 md:flex">
            {active.fileName && <span className="font-mono text-[11.5px]">{active.fileName}</span>}
            {active.fileName && <span aria-hidden="true">·</span>}
            <span className="tabular-nums">{countLines(active.code)} lines</span>
          </span>
          <CopyButton
            copyKey={active.copyKey}
            onCopy={active.onCopy}
            label="Copy"
            tooltip={active.copyTooltip ?? `Copy ${active.label}`}
            shortcut={active.copyShortcut}
          />
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className={cn("relative", collapsed && "max-h-[540px] overflow-hidden")}
      >
        <pre className="code-scroll overflow-x-auto py-3 font-mono text-[12.5px] leading-5 [font-variant-ligatures:none]">
          <code className="grid min-w-max">
            {lines.map((line, index) => (
              <span key={index} className="flex">
                <span className="sticky left-0 w-12 shrink-0 bg-subtle pr-4 text-right text-ink-4 tabular-nums select-none">
                  {index + 1}
                </span>
                <span className="pr-6 whitespace-pre text-code-fg">
                  {typeof line === "string" ? line : line.map(renderToken)}
                </span>
              </span>
            ))}
          </code>
        </pre>
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center bg-linear-to-t from-subtle via-subtle/90 to-transparent pb-5">
            <Button size="sm" onClick={() => setExpanded(true)}>
              <ChevronDown size={14} />
              Show all {plainLines.length} lines
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Tokens carry both themes' colors as CSS variables; `.code-token` picks one. */
function renderToken(token: ThemedToken, index: number) {
  return (
    <span key={index} className="code-token" style={token.htmlStyle as CSSProperties | undefined}>
      {token.content}
    </span>
  );
}
