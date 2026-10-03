import {
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Hash,
  LayoutGrid,
  Layers,
  List,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Popover } from "radix-ui";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ComponentCard } from "../components/ComponentCard";
import { ComponentRow } from "../components/ComponentRow";
import { EmptyState } from "../components/EmptyState";
import { toggleFavoriteWithToast } from "../components/FavoriteButton";
import { PageHeader } from "../components/layout/PageHeader";
import { ScrollArea } from "../components/layout/ScrollArea";
import { Button, focusRing } from "../components/ui/Button";
import { CategoryIcon } from "../components/ui/CategoryIcon";
import { Kbd } from "../components/ui/Kbd";
import { Segmented } from "../components/ui/Segmented";
import { Tooltip } from "../components/ui/Tooltip";
import { useHotkeys } from "../hooks/useHotkeys";
import { cn } from "../lib/cn";
import { copyComponent } from "../lib/copy";
import { formatRelative, isRecent } from "../lib/format";
import { type BrowseRoute, navigate, rememberBrowseRoute, routeKey } from "../lib/router";
import { applyQuickFilter, matchesQuery, type QuickFilter, sortItems } from "../lib/search";
import {
  type CopyRecord,
  clearHistory,
  setPreference,
  type SortMode,
  useFavorites,
  useHistory,
  usePreferences,
  type ViewMode,
} from "../lib/state";
import { getComponent, type RegistryItem, registry } from "../registry";
import { type CategoryId, categories, getCategory } from "../registry/categories";

interface PageMeta {
  title: string;
  icon: ReactNode;
  scope: RegistryItem[];
}

function describe(route: BrowseRoute, favorites: string[], history: CopyRecord[]): PageMeta {
  const icon = (Icon: typeof Compass) => (
    <Icon size={15} strokeWidth={1.9} className="text-ink-3" />
  );
  const resolve = (slugs: string[]) =>
    slugs.map((slug) => getComponent(slug)).filter((item): item is RegistryItem => Boolean(item));

  switch (route.name) {
    case "explore":
      return { title: "Explore", icon: icon(Compass), scope: registry };
    case "category":
      return {
        title: getCategory(route.category).name,
        icon: <CategoryIcon category={route.category} />,
        scope: registry.filter((item) => item.category === route.category),
      };
    case "tag":
      return {
        title: route.tag,
        icon: icon(Hash),
        scope: registry.filter((item) => item.tags.includes(route.tag)),
      };
    case "favorites":
      return { title: "Favorites", icon: icon(Star), scope: resolve(favorites) };
    case "recent":
      return {
        title: "Recently copied",
        icon: icon(Clock),
        scope: resolve(history.map((entry) => entry.slug)),
      };
  }
}

function groupByCategory(items: RegistryItem[]) {
  return categories
    .map((category) => ({
      category: category.id,
      items: items.filter((item) => item.category === category.id),
    }))
    .filter((group) => group.items.length > 0);
}

const QUICK_FILTERS: { value: QuickFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "featured", label: "Featured" },
  { value: "new", label: "New" },
];

export function BrowsePage({ route }: { route: BrowseRoute }) {
  const prefs = usePreferences();
  const favorites = useFavorites();
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<QuickFilter>("all");
  const [collapsed, setCollapsed] = useState<ReadonlySet<CategoryId>>(new Set());
  const [focus, setFocus] = useState<{ slug: string; keyboard: boolean } | null>(null);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => rememberBrowseRoute(route), [route]);

  const meta = useMemo(() => describe(route, favorites, history), [route, favorites, history]);
  const copies = useMemo(() => new Map(history.map((entry) => [entry.slug, entry])), [history]);

  const items = useMemo(() => {
    const matching = meta.scope.filter((item) => matchesQuery(item, deferredQuery));
    const filtered = applyQuickFilter(matching, quick);
    return route.name === "recent" ? filtered : sortItems(filtered, prefs.sort);
  }, [meta.scope, deferredQuery, quick, prefs.sort, route.name]);

  const grouped =
    prefs.view === "list" &&
    (route.name === "explore" || route.name === "tag" || route.name === "favorites");
  const groups = useMemo(() => (grouped ? groupByCategory(items) : null), [grouped, items]);
  const ordered = useMemo(
    () =>
      groups
        ? groups.flatMap((group) => (collapsed.has(group.category) ? [] : group.items))
        : items,
    [groups, items, collapsed],
  );

  const focusedIndex = focus ? ordered.findIndex((item) => item.slug === focus.slug) : -1;
  const focusedItem = focusedIndex >= 0 ? ordered[focusedIndex] : null;

  function move(step: number) {
    if (ordered.length === 0) return;
    const index =
      focusedIndex === -1
        ? step > 0
          ? 0
          : ordered.length - 1
        : Math.min(Math.max(focusedIndex + step, 0), ordered.length - 1);
    const slug = ordered[index].slug;
    setFocus({ slug, keyboard: true });
    document
      .querySelector(`[data-slug="${CSS.escape(slug)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }

  // Hover moves the shortcut target too (like Linear), without showing the keyboard ring.
  const hover = useCallback(
    (slug: string) =>
      setFocus((current) =>
        current?.slug === slug && !current.keyboard ? current : { slug, keyboard: false },
      ),
    [],
  );
  const clearHover = () => setFocus((current) => (current?.keyboard ? current : null));

  const open = (item: RegistryItem | null) =>
    item && navigate({ name: "component", slug: item.slug });

  useHotkeys({
    "/": () => inputRef.current?.focus(),
    j: () => move(1),
    arrowdown: () => move(1),
    k: () => move(-1),
    arrowup: () => move(-1),
    enter: () => open(focusedItem),
    o: () => open(focusedItem),
    c: () => focusedItem && void copyComponent(focusedItem),
    f: () => focusedItem && toggleFavoriteWithToast(focusedItem),
    v: () => setPreference("view", prefs.view === "grid" ? "list" : "grid"),
    escape: () => setFocus(null),
  });

  function onFilterKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (query) setQuery("");
      else event.currentTarget.blur();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      event.currentTarget.blur();
      move(1);
    } else if (event.key === "Enter") {
      open(focusedItem ?? ordered[0] ?? null);
    }
  }

  const filtersActive = query !== "" || quick !== "all";
  const recordFor = (item: RegistryItem) => copies.get(item.slug);
  const metaFor =
    route.name === "recent"
      ? (item: RegistryItem) => {
          const record = recordFor(item);
          return record ? `Copied ${formatRelative(record.at)}` : undefined;
        }
      : () => undefined;

  return (
    <>
      <PageHeader
        actions={
          route.name === "recent" && history.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 size={14} strokeWidth={1.9} />
              Clear history
            </Button>
          ) : null
        }
      >
        <span className="flex size-[18px] items-center justify-center">{meta.icon}</span>
        <h1 className="truncate text-[13.5px] font-medium text-ink">
          {route.name === "tag" ? (
            <>
              <span className="text-ink-3">Tagged </span>
              {meta.title}
            </>
          ) : (
            meta.title
          )}
        </h1>
        <span className="text-[12px] text-ink-4 tabular-nums">{meta.scope.length}</span>
      </PageHeader>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line-subtle px-2 py-2 sm:px-3 lg:px-4">
        <div role="group" aria-label="Quick filters" className="flex items-center gap-1">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={quick === filter.value}
              onClick={() => setQuick(filter.value)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-medium transition-colors",
                focusRing,
                quick === filter.value
                  ? "border-line bg-panel text-ink shadow-control"
                  : "border-transparent text-ink-3 hover:bg-hover hover:text-ink-2",
              )}
            >
              {filter.value === "new" && (
                <Sparkles size={13} strokeWidth={1.9} className="text-brand" />
              )}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="order-last flex w-full items-center gap-2 sm:order-none sm:ml-auto sm:w-auto">
          <label className="relative flex h-7 flex-1 items-center sm:w-60 sm:flex-none">
            <span className="sr-only">Filter components</span>
            <Search
              size={14}
              strokeWidth={1.9}
              className="pointer-events-none absolute left-2 text-ink-4"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder="Filter components…"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onFilterKeyDown}
              className="h-7 w-full rounded-md border border-line bg-panel pr-8 pl-7 text-[12.5px] text-ink shadow-control transition-[border-color,box-shadow] outline-hidden placeholder:text-ink-4 focus:border-brand/50 focus:shadow-[0_0_0_3px_rgb(94_106_210/0.12)] [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear filter"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-1.5 inline-flex size-5 items-center justify-center rounded text-ink-4 hover:bg-hover hover:text-ink-2"
              >
                <X size={13} />
              </button>
            ) : (
              <Kbd className="pointer-events-none absolute right-1.5">/</Kbd>
            )}
          </label>
          <DisplayOptions view={prefs.view} sort={prefs.sort} />
        </div>
      </div>

      <ScrollArea routeKey={routeKey(route)}>
        {route.name === "explore" && !filtersActive && <ExploreIntro copies={history} />}

        {meta.scope.length === 0 ? (
          <ScopeEmptyState route={route} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching components"
            description={
              query ? (
                <>Nothing matches “{query}”. Try another word or clear the filters.</>
              ) : (
                "Nothing matches these filters."
              )
            }
            action={
              <Button
                size="sm"
                onClick={() => {
                  setQuery("");
                  setQuick("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : prefs.view === "grid" ? (
          <div
            onPointerLeave={clearHover}
            className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,292px),1fr))] gap-3 px-3 py-4 sm:p-5"
          >
            {items.map((item) => (
              <ComponentCard
                key={item.slug}
                item={item}
                focused={focus?.keyboard === true && focus.slug === item.slug}
                onHover={hover}
                meta={metaFor(item)}
              />
            ))}
          </div>
        ) : (
          <div onPointerLeave={clearHover} className="pb-8">
            {groups
              ? groups.map((group) => {
                  const isCollapsed = collapsed.has(group.category);
                  return (
                    <section key={group.category} aria-label={getCategory(group.category).name}>
                      <button
                        type="button"
                        aria-expanded={!isCollapsed}
                        onClick={() =>
                          setCollapsed((previous) => {
                            const next = new Set(previous);
                            if (next.has(group.category)) next.delete(group.category);
                            else next.add(group.category);
                            return next;
                          })
                        }
                        className="sticky top-0 z-20 flex h-9 w-full items-center gap-2 border-b border-line-subtle bg-[#f8f8fa]/95 pr-3 pl-3 text-left backdrop-blur-sm transition-colors hover:bg-[#f3f3f6] sm:pl-4"
                      >
                        <ChevronRight
                          size={12}
                          strokeWidth={2.4}
                          className={cn(
                            "text-ink-4 transition-transform",
                            !isCollapsed && "rotate-90",
                          )}
                        />
                        <CategoryIcon category={group.category} />
                        <span className="text-mini font-medium text-ink">
                          {getCategory(group.category).name}
                        </span>
                        <span className="text-[12px] text-ink-4 tabular-nums">
                          {group.items.length}
                        </span>
                      </button>
                      {!isCollapsed &&
                        group.items.map((item) => (
                          <ComponentRow
                            key={item.slug}
                            item={item}
                            focused={focus?.keyboard === true && focus.slug === item.slug}
                            onHover={hover}
                            meta={metaFor(item)}
                          />
                        ))}
                    </section>
                  );
                })
              : items.map((item) => (
                  <ComponentRow
                    key={item.slug}
                    item={item}
                    focused={focus?.keyboard === true && focus.slug === item.slug}
                    onHover={hover}
                    meta={metaFor(item)}
                  />
                ))}
          </div>
        )}
      </ScrollArea>
    </>
  );
}

function DisplayOptions({ view, sort }: { view: ViewMode; sort: SortMode }) {
  return (
    <Popover.Root>
      <Tooltip label="Display options">
        <Popover.Trigger asChild>
          <Button size="sm" className="data-[state=open]:bg-subtle data-[state=open]:text-ink">
            <SlidersHorizontal size={14} strokeWidth={1.9} />
            <span className="hidden sm:inline">Display</span>
          </Button>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          collisionPadding={8}
          className="z-[70] w-[284px] rounded-lg border border-line bg-panel p-3 shadow-pop outline-hidden data-[state=open]:animate-pop-in"
        >
          <div className="space-y-3">
            <OptionRow label="View">
              <Segmented
                label="View"
                value={view}
                onChange={(next) => setPreference("view", next)}
                options={[
                  {
                    value: "grid",
                    label: "Grid",
                    icon: <LayoutGrid size={13} strokeWidth={1.9} />,
                  },
                  { value: "list", label: "List", icon: <List size={13} strokeWidth={1.9} /> },
                ]}
              />
            </OptionRow>
            <OptionRow label="Ordering">
              <Segmented
                label="Ordering"
                value={sort}
                onChange={(next) => setPreference("sort", next)}
                options={[
                  { value: "featured", label: "Featured" },
                  { value: "newest", label: "Newest" },
                  { value: "name", label: "A–Z" },
                ]}
              />
            </OptionRow>
          </div>
          <p className="mt-3 flex items-center gap-1.5 border-t border-line-subtle pt-2.5 text-[11.5px] text-ink-4">
            Press <Kbd>V</Kbd> to switch between grid and list.
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function OptionRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12.5px] text-ink-3">{label}</span>
      {children}
    </div>
  );
}

function ExploreIntro({ copies }: { copies: CopyRecord[] }) {
  const newCount = registry.filter((item) => isRecent(item.createdAt)).length;
  const totalCopies = copies.reduce((sum, entry) => sum + entry.count, 0);
  const stats = [
    { icon: Layers, value: registry.length, label: "components" },
    { icon: Compass, value: categories.length, label: "categories" },
    { icon: Sparkles, value: newCount, label: "new this month" },
    { icon: Copy, value: totalCopies, label: totalCopies === 1 ? "copy by you" : "copies by you" },
  ];

  return (
    <section className="border-b border-line-subtle px-4 pt-7 pb-6 sm:px-6 sm:pt-9">
      <h2 className="max-w-2xl text-[22px] leading-7 font-semibold tracking-[-0.022em] text-ink sm:text-[28px] sm:leading-[34px]">
        Components, ready to paste.
      </h2>
      <p className="mt-2 max-w-xl text-[14px] leading-[22px] text-ink-3">
        A marketplace of React components built with Tailwind CSS. Preview each one live, then copy
        the code in a single click.
      </p>
      <dl className="mt-5 flex flex-wrap gap-2">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex h-8 items-center gap-2 rounded-lg border border-line bg-subtle px-3 text-[12.5px]"
          >
            <Icon size={14} strokeWidth={1.9} className="text-ink-3" />
            <dt className="sr-only">{label}</dt>
            <dd className="flex items-baseline gap-1">
              <span className="font-semibold text-ink tabular-nums">{value}</span>
              <span className="text-ink-3">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ScopeEmptyState({ route }: { route: BrowseRoute }) {
  const explore = (
    <Button size="sm" onClick={() => navigate({ name: "explore" })}>
      <Compass size={14} strokeWidth={1.9} />
      Explore components
    </Button>
  );

  if (route.name === "favorites") {
    return (
      <EmptyState
        icon={Star}
        title="No favorites yet"
        description={
          <>
            Star a component to keep it here — hover a card and click the star, or press{" "}
            <Kbd>F</Kbd>.
          </>
        }
        action={explore}
      />
    );
  }
  if (route.name === "recent") {
    return (
      <EmptyState
        icon={Clock}
        title="Nothing copied yet"
        description="Every component you copy is listed here, so it’s easy to find again."
        action={explore}
      />
    );
  }
  return (
    <EmptyState
      icon={Hash}
      title="Nothing here yet"
      description={
        route.name === "tag" ? `No components are tagged “${route.tag}”.` : `No components yet.`
      }
      action={explore}
    />
  );
}
