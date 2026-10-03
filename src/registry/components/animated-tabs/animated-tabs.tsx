"use client";

import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type AnimatedTab = {
  /** Unique value used for selection. */
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AnimatedTabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  tabs: AnimatedTab[];
  /** Tab selected on first render when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Selected tab id, for controlled usage. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name for the tab list. */
  label?: string;
  listClassName?: string;
  panelClassName?: string;
};

type Indicator = { left: number; top: number; width: number; height: number };

export function AnimatedTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  label,
  className = "",
  listClassName = "",
  panelClassName = "",
  ...props
}: AnimatedTabsProps) {
  const baseId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  const requested = value ?? uncontrolledValue;
  const activeTab = enabledTabs.find((tab) => tab.id === requested) ?? enabledTabs[0];
  const activeId = activeTab?.id;
  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);

  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const tabKey = tabs.map((tab) => tab.id).join("\n");

  // Measure the active trigger. Offsets are layout values, so they stay correct
  // even when an ancestor is scaled with a CSS transform.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || activeId === undefined) return;

    const measure = () => {
      const trigger = tabRefs.current.get(activeId);
      if (!trigger) return;
      const next = {
        left: trigger.offsetLeft,
        top: trigger.offsetTop,
        width: trigger.offsetWidth,
        height: trigger.offsetHeight,
      };
      setIndicator((prev) =>
        prev &&
        prev.left === next.left &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    for (const trigger of tabRefs.current.values()) observer.observe(trigger);
    return () => observer.disconnect();
  }, [activeId, tabKey]);

  const select = (id: string) => {
    if (value === undefined) setUncontrolledValue(id);
    if (id !== activeId) onValueChange?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const index = enabledTabs.findIndex((tab) => tab.id === id);
    const last = enabledTabs.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    const target = enabledTabs[next];
    select(target.id);
    tabRefs.current.get(target.id)?.focus();
  };

  return (
    <div className={`flex flex-col ${className}`} {...props}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className={`relative flex items-center gap-1 ${listClassName}`}
      >
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 rounded-lg bg-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.16),0_4px_10px_-4px_rgb(24_24_27/0.4)] transition-[transform,width,height] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
            style={{
              width: indicator.width,
              height: indicator.height,
              transform: `translate(${indicator.left}px, ${indicator.top}px)`,
            }}
          />
        )}
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                if (node) tabRefs.current.set(tab.id, node);
                else tabRefs.current.delete(tab.id);
              }}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={selected ? `${baseId}-panel` : undefined}
              tabIndex={selected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, tab.id)}
              className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-40 ${
                selected
                  ? `text-white ${indicator ? "" : "bg-zinc-950"}`
                  : "text-zinc-500 hover:bg-zinc-950/[0.04] hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          key={activeTab.id}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeIndex}`}
          tabIndex={0}
          className={`rounded-lg transition-[opacity,translate] duration-200 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none ${panelClassName}`}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
