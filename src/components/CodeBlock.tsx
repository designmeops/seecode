import { ChevronDown, FileCode2 } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { ThemedToken } from "shiki/core";
import { cn } from "../lib/cn";
import { useHighlightedLines } from "../lib/highlight";
import type { CodeLanguage } from "../registry/types";
import { CopyButton } from "./CopyButton";
import { Button, focusRing } from "./ui/Button";

export interface CodeTab {
  id: string;
  label: string;
  language: CodeLanguage;
  code: string;
  copyKey: string;
  onCopy: () => Promise<boolean>;
  copyShortcut?: string;
}

const COLLAPSED_LINES = 26;

const FONT_STYLE_ITALIC = 1;
const FONT_STYLE_BOLD = 2;

export function CodeBlock({ tabs, className }: { tabs: CodeTab[]; className?: string }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const baseId = useId();
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  const plainLines = useMemo(() => active.code.replace(/\n$/, "").split("\n"), [active.code]);
  const highlighted = useHighlightedLines(active.code, active.language);
  const lines: (string | ThemedToken[])[] = highlighted ?? plainLines;
  const collapsible = plainLines.length > COLLAPSED_LINES + 6;
  const collapsed = collapsible && !expanded;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-subtle", className)}>
      <div className="flex h-10 items-center gap-2 border-b border-line bg-panel pr-2 pl-1.5">
        <div
          role="tablist"
          aria-label="Files"
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto"
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
                onClick={() => setActiveId(tab.id)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                  const step = event.key === "ArrowRight" ? 1 : -1;
                  const next = tabs[(index + step + tabs.length) % tabs.length];
                  setActiveId(next.id);
                  document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
                }}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-[12.5px] font-medium transition-colors",
                  focusRing,
                  selected ? "bg-active text-ink" : "text-ink-3 hover:bg-hover hover:text-ink-2",
                )}
              >
                <FileCode2
                  size={13}
                  strokeWidth={1.9}
                  className={selected ? "text-ink-2" : "text-ink-4"}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-[11px] font-medium tracking-wide text-ink-4 uppercase sm:inline">
            {active.language}
          </span>
          <CopyButton
            copyKey={active.copyKey}
            onCopy={active.onCopy}
            label="Copy"
            tooltip={`Copy ${active.label}`}
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
                <span className="pr-6 whitespace-pre text-[#2b2e36]">
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

function renderToken(token: ThemedToken, index: number) {
  const style = token.fontStyle ?? 0;
  return (
    <span
      key={index}
      style={{
        color: token.color,
        fontStyle: style & FONT_STYLE_ITALIC ? "italic" : undefined,
        fontWeight: style & FONT_STYLE_BOLD ? 600 : undefined,
      }}
    >
      {token.content}
    </span>
  );
}
