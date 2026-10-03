import {
  ChevronDown,
  Clock,
  Compass,
  Hash,
  Keyboard,
  type LucideIcon,
  PackagePlus,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { isValidElement, type ReactNode, useMemo } from "react";
import { cn } from "../../lib/cn";
import { MOD } from "../../lib/platform";
import { type Route, toHref, useRoute } from "../../lib/router";
import {
  openDialog,
  setPreference,
  useFavorites,
  useHistory,
  usePreferences,
} from "../../lib/state";
import { allTags, countByCategory, getComponent, registry } from "../../registry";
import { categories } from "../../registry/categories";
import { LogoMark } from "../Logo";
import { focusRing, IconButton } from "../ui/Button";
import { CategoryIcon } from "../ui/CategoryIcon";
import { Kbd, Shortcut } from "../ui/Kbd";
import { menuContentClass, menuItemClass, menuSeparatorClass } from "../ui/Menu";
import { Tooltip } from "../ui/Tooltip";

const TOP_TAGS = 6;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const route = useRoute();
  const favorites = useFavorites();
  const history = useHistory();
  const prefs = usePreferences();
  const counts = useMemo(countByCategory, []);
  const tags = useMemo(() => {
    const tally = allTags.map((tag) => ({
      tag,
      count: registry.filter((item) => item.tags.includes(tag)).length,
    }));
    return tally.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag)).slice(0, TOP_TAGS);
  }, []);

  // While viewing a component, keep its category highlighted for orientation.
  const activeCategory =
    route.name === "category"
      ? route.category
      : route.name === "component"
        ? getComponent(route.slug)?.category
        : undefined;

  const isActive = (target: Route) => toHref(target) === toHref(route);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center gap-1 px-3">
        <WorkspaceMenu />
        <Tooltip label="Publish a component">
          <IconButton
            label="Publish a component"
            className="ml-auto"
            onClick={() => openDialog("publish")}
          >
            <Plus size={16} strokeWidth={1.9} />
          </IconButton>
        </Tooltip>
      </div>

      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={() => openDialog("command")}
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-md border border-line bg-panel px-2 text-mini text-ink-4 shadow-control transition-colors hover:border-line-strong hover:text-ink-3",
            focusRing,
          )}
        >
          <Search size={14} strokeWidth={1.9} className="text-ink-3" />
          Search…
          <span className="ml-auto flex gap-0.5">
            <Kbd>{MOD}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
      </div>

      <nav aria-label="Main" className="scrollbar-subtle flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-px">
          <NavItem
            href={toHref({ name: "explore" })}
            icon={Compass}
            label="Explore"
            count={registry.length}
            active={isActive({ name: "explore" })}
            shortcut="g e"
            onNavigate={onNavigate}
          />
          <NavItem
            href={toHref({ name: "favorites" })}
            icon={Star}
            label="Favorites"
            count={favorites.length || undefined}
            active={isActive({ name: "favorites" })}
            shortcut="g f"
            onNavigate={onNavigate}
          />
          <NavItem
            href={toHref({ name: "recent" })}
            icon={Clock}
            label="Recently copied"
            count={history.length || undefined}
            active={isActive({ name: "recent" })}
            shortcut="g r"
            onNavigate={onNavigate}
          />
        </ul>

        <Section
          title="Categories"
          open={prefs.categoriesOpen}
          onToggle={() => setPreference("categoriesOpen", !prefs.categoriesOpen)}
        >
          {categories.map((category) => (
            <NavItem
              key={category.id}
              href={toHref({ name: "category", category: category.id })}
              icon={<CategoryIcon category={category.id} />}
              label={category.name}
              count={counts[category.id]}
              active={activeCategory === category.id}
              onNavigate={onNavigate}
            />
          ))}
        </Section>

        <Section
          title="Tags"
          open={prefs.tagsOpen}
          onToggle={() => setPreference("tagsOpen", !prefs.tagsOpen)}
        >
          {tags.map(({ tag, count }) => (
            <NavItem
              key={tag}
              href={toHref({ name: "tag", tag })}
              icon={Hash}
              label={tag}
              count={count}
              active={isActive({ name: "tag", tag })}
              onNavigate={onNavigate}
            />
          ))}
        </Section>
      </nav>

      <div className="shrink-0 px-3 pb-3">
        <div className="rounded-lg border border-line bg-panel p-3 shadow-card">
          <div className="flex items-center gap-2 text-mini font-medium text-ink">
            <PackagePlus size={15} strokeWidth={1.9} className="text-brand" />
            Publish a component
          </div>
          <p className="mt-1 text-[12px] leading-[17px] text-ink-3">
            Drop a folder into the registry and it shows up here, preview and all.
          </p>
          <button
            type="button"
            onClick={() => openDialog("publish")}
            className={cn(
              "mt-2 text-[12px] font-medium text-brand hover:text-brand-hover",
              focusRing,
            )}
          >
            See how →
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <Tooltip label="Keyboard shortcuts" shortcut="?" side="top">
            <IconButton label="Keyboard shortcuts" onClick={() => openDialog("shortcuts")}>
              <Keyboard size={15} strokeWidth={1.9} />
            </IconButton>
          </Tooltip>
          <span className="text-[11.5px] text-ink-4">{registry.length} components</span>
        </div>
      </div>
    </div>
  );
}

function WorkspaceMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-8 min-w-0 items-center gap-2 rounded-md px-1.5 text-[13.5px] font-semibold tracking-[-0.01em] text-ink transition-colors hover:bg-hover data-[state=open]:bg-active",
            focusRing,
          )}
        >
          <LogoMark />
          seecode
          <ChevronDown size={13} strokeWidth={2} className="text-ink-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" sideOffset={4} className={menuContentClass}>
          <div className="px-2 pt-1.5 pb-2">
            <p className="text-mini font-medium text-ink">seecode</p>
            <p className="text-[12px] text-ink-3">Copy-paste React components</p>
          </div>
          <DropdownMenu.Separator className={menuSeparatorClass} />
          <DropdownMenu.Item className={menuItemClass} onSelect={() => openDialog("command")}>
            <Search size={15} />
            Search
            <Shortcut keys="mod+k" className="ml-auto" />
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} onSelect={() => openDialog("shortcuts")}>
            <Keyboard size={15} />
            Keyboard shortcuts
            <Shortcut keys="?" className="ml-auto" />
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} onSelect={() => openDialog("publish")}>
            <PackagePlus size={15} />
            Publish a component
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={cn(
          "group/section flex h-7 w-full items-center gap-1 rounded-md px-2 text-[12px] font-medium text-ink-3 transition-colors hover:bg-hover hover:text-ink-2",
          focusRing,
        )}
      >
        {title}
        <ChevronDown
          size={12}
          strokeWidth={2.2}
          className={cn(
            "text-ink-4 opacity-0 transition-[transform,opacity] group-hover/section:opacity-100",
            !open && "-rotate-90 opacity-100",
          )}
        />
      </button>
      {open && <ul className="mt-px space-y-px">{children}</ul>}
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  count,
  active,
  shortcut,
  onNavigate,
}: {
  href: string;
  icon: LucideIcon | ReactNode;
  label: string;
  count?: number;
  active: boolean;
  shortcut?: string;
  onNavigate?: () => void;
}) {
  const Icon = isValidElement(icon) ? null : (icon as LucideIcon);
  const link = (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex h-7 items-center gap-2 rounded-md px-2 text-mini transition-colors",
        focusRing,
        active ? "bg-active font-medium text-ink" : "text-ink-2 hover:bg-hover hover:text-ink",
      )}
    >
      <span className="flex size-[18px] shrink-0 items-center justify-center">
        {Icon ? (
          <Icon size={15} strokeWidth={1.9} className={active ? "text-ink-2" : "text-ink-3"} />
        ) : (
          (icon as ReactNode)
        )}
      </span>
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[11.5px] text-ink-4 tabular-nums">{count}</span>
      )}
    </a>
  );

  return (
    <li>
      {shortcut ? (
        <Tooltip label={label} shortcut={shortcut} side="right">
          {link}
        </Tooltip>
      ) : (
        link
      )}
    </li>
  );
}
