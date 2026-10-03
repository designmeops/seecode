import { Command } from "cmdk";
import {
  Check,
  Clock,
  Compass,
  Keyboard,
  LayoutGrid,
  Link2,
  List,
  PackagePlus,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { copyComponent, copyWithToast } from "../lib/copy";
import { formatsOf } from "../lib/formats";
import { MOD } from "../lib/platform";
import { navigate, type Route, useRoute } from "../lib/router";
import {
  closeDialog,
  openDialog,
  setPreference,
  useDialog,
  useHistory,
  usePreferences,
} from "../lib/state";
import { setThemePreference, useTheme } from "../lib/theme";
import { getComponent, type RegistryItem, registry } from "../registry";
import { categories, getCategory } from "../registry/categories";
import { THEME_OPTIONS } from "./ThemeMenu";
import { CategoryIcon } from "./ui/CategoryIcon";
import { FormatIcon } from "./ui/FormatIcon";
import { Kbd, Shortcut } from "./ui/Kbd";

const itemClass =
  "group flex h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-mini text-ink-2 outline-hidden select-none data-[selected=true]:bg-hover data-[selected=true]:text-ink [&_svg]:shrink-0";

const groupClass =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11.5px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ink-4";

/** Values are prefixed per group so the same component can appear twice. */
const componentValue = (group: string, item: RegistryItem) => `${group}:${item.slug}`;

/**
 * Substring matching like Linear's search — cmdk's default fuzzy scorer matches
 * scattered letters ("tabs" → "Async Button"), which reads as noise here.
 * The first keyword is the item's label and ranks highest.
 */
function filterItems(value: string, search: string, keywords: string[] = []): number {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 1;
  const label = (keywords[0] ?? value).toLowerCase();
  const haystack = [value, ...keywords].join(" ").toLowerCase();
  if (!terms.every((term) => haystack.includes(term))) return 0;
  const query = terms.join(" ");
  if (label.startsWith(query)) return 1;
  if (label.split(/\s+/).some((word) => word.startsWith(terms[0]))) return 0.9;
  if (label.includes(query)) return 0.8;
  return 0.5;
}

function componentFromValue(value: string): RegistryItem | undefined {
  const [, slug] = value.split(":");
  return slug ? getComponent(slug) : undefined;
}

export function CommandMenu() {
  const dialog = useDialog();
  const open = dialog === "command";
  // The highlighted item, used by the ⌘↵ "copy code" shortcut.
  const [value, setValue] = useState("");

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => (next ? openDialog("command") : closeDialog())}
      label="Command menu"
      loop
      filter={filterItems}
      value={value}
      onValueChange={setValue}
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          const item = componentFromValue(value);
          if (!item) return;
          event.preventDefault();
          closeDialog();
          void copyComponent(item);
        }
      }}
      overlayClassName="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in"
      contentClassName="fixed top-[12vh] left-1/2 z-50 w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-raised shadow-modal outline-hidden data-[state=open]:animate-pop-in"
    >
      {open && <CommandMenuBody />}
    </Command.Dialog>
  );
}

function CommandMenuBody() {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const prefs = usePreferences();
  const route = useRoute();
  const { preference } = useTheme();
  const searching = search.trim().length > 0;
  const current = route.name === "component" ? getComponent(route.slug) : undefined;

  const run = (action: () => void) => {
    closeDialog();
    action();
  };
  const go = (target: Route) => run(() => navigate(target));

  const recent = history
    .map((entry) => getComponent(entry.slug))
    .filter((item): item is RegistryItem => Boolean(item))
    .slice(0, 4);
  const featured = registry.filter((item) => item.featured).slice(0, 5);

  const componentItem = (group: string, item: RegistryItem) => (
    <Command.Item
      key={componentValue(group, item)}
      value={componentValue(group, item)}
      keywords={[item.name, item.id, getCategory(item.category).name, ...item.tags]}
      onSelect={() => go({ name: "component", slug: item.slug })}
      className={itemClass}
    >
      <CategoryIcon category={item.category} />
      <span className="shrink-0 font-medium">{item.name}</span>
      <span className="hidden min-w-0 truncate text-ink-4 sm:block">{item.description}</span>
      <span className="ml-auto shrink-0 pl-2 text-[12px] text-ink-4 tabular-nums">{item.id}</span>
    </Command.Item>
  );

  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-line-subtle px-4">
        <Search size={16} strokeWidth={1.9} className="text-ink-4" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search components, categories and actions…"
          className="h-[52px] min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-hidden placeholder:text-ink-4"
        />
        <Kbd>Esc</Kbd>
      </div>

      <Command.List className="scrollbar-subtle max-h-[min(440px,58vh)] scroll-py-2 overflow-y-auto p-2">
        <Command.Empty className="px-3 py-10 text-center text-mini text-ink-3">
          No results for “{search}”.
        </Command.Empty>

        {current && (
          <Command.Group heading={current.name} className={groupClass}>
            {formatsOf(current).map((format) => (
              <Command.Item
                key={format.id}
                value={`copy:${format.id}`}
                keywords={[`Copy ${format.name} code`, "copy", "code", format.name]}
                onSelect={() => run(() => void copyComponent(current, format.id))}
                className={itemClass}
              >
                <FormatIcon format={format.id} size={15} className="text-ink-3" />
                Copy {format.name} code
                <span className="ml-auto text-[12px] text-ink-4">{format.summary}</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {!searching && recent.length > 0 && (
          <Command.Group heading="Recently copied" className={groupClass}>
            {recent.map((item) => componentItem("recent", item))}
          </Command.Group>
        )}

        <Command.Group heading={searching ? "Components" : "Featured"} className={groupClass}>
          {(searching ? registry : featured).map((item) => componentItem("component", item))}
        </Command.Group>

        <Command.Group heading="Navigation" className={groupClass}>
          <Command.Item
            value="nav:explore"
            keywords={["Go to Explore", "home", "all components"]}
            onSelect={() => go({ name: "explore" })}
            className={itemClass}
          >
            <Compass size={16} strokeWidth={1.9} className="text-ink-3" />
            Go to Explore
            <Shortcut keys="g e" className="ml-auto" />
          </Command.Item>
          <Command.Item
            value="nav:favorites"
            keywords={["Go to Favorites", "starred"]}
            onSelect={() => go({ name: "favorites" })}
            className={itemClass}
          >
            <Star size={16} strokeWidth={1.9} className="text-ink-3" />
            Go to Favorites
            <Shortcut keys="g f" className="ml-auto" />
          </Command.Item>
          <Command.Item
            value="nav:recent"
            keywords={["Go to Recently copied", "history"]}
            onSelect={() => go({ name: "recent" })}
            className={itemClass}
          >
            <Clock size={16} strokeWidth={1.9} className="text-ink-3" />
            Go to Recently copied
            <Shortcut keys="g r" className="ml-auto" />
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Categories" className={groupClass}>
          {categories.map((category) => (
            <Command.Item
              key={category.id}
              value={`category:${category.id}`}
              keywords={[category.name, category.description]}
              onSelect={() => go({ name: "category", category: category.id })}
              className={itemClass}
            >
              <CategoryIcon category={category.id} />
              {category.name}
              <span className="ml-auto text-[12px] text-ink-4">Category</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions" className={groupClass}>
          <Command.Item
            value="action:toggle-view"
            keywords={[
              `Switch to ${prefs.view === "grid" ? "list" : "grid"} view`,
              "grid",
              "list",
              "display",
              "layout",
            ]}
            onSelect={() =>
              run(() => setPreference("view", prefs.view === "grid" ? "list" : "grid"))
            }
            className={itemClass}
          >
            {prefs.view === "grid" ? (
              <List size={16} strokeWidth={1.9} className="text-ink-3" />
            ) : (
              <LayoutGrid size={16} strokeWidth={1.9} className="text-ink-3" />
            )}
            Switch to {prefs.view === "grid" ? "list" : "grid"} view
            <Shortcut keys="v" className="ml-auto" />
          </Command.Item>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <Command.Item
              key={value}
              value={`theme:${value}`}
              keywords={[
                value === "system" ? "Use system theme" : `Switch to ${label.toLowerCase()} theme`,
                "theme",
                "appearance",
                "mode",
                label,
              ]}
              onSelect={() => run(() => setThemePreference(value))}
              className={itemClass}
            >
              <Icon size={16} strokeWidth={1.9} className="text-ink-3" />
              {value === "system" ? "Use system theme" : `Switch to ${label.toLowerCase()} theme`}
              {preference === value && (
                <Check size={15} strokeWidth={2.2} className="ml-auto text-ink-3" />
              )}
            </Command.Item>
          ))}
          <Command.Item
            value="action:copy-link"
            keywords={["Copy link to this page", "share", "url"]}
            onSelect={() =>
              run(
                () =>
                  void copyWithToast(location.href, {
                    key: "link:page",
                    title: "Copied link to this page",
                  }),
              )
            }
            className={itemClass}
          >
            <Link2 size={16} strokeWidth={1.9} className="text-ink-3" />
            Copy link to this page
            <span className="ml-auto truncate pl-2 text-[12px] text-ink-4">
              {route.name === "component" ? getComponent(route.slug)?.name : ""}
            </span>
          </Command.Item>
          <Command.Item
            value="action:shortcuts"
            keywords={["Keyboard shortcuts", "help", "hotkeys"]}
            onSelect={() => openDialog("shortcuts")}
            className={itemClass}
          >
            <Keyboard size={16} strokeWidth={1.9} className="text-ink-3" />
            Keyboard shortcuts
            <Shortcut keys="?" className="ml-auto" />
          </Command.Item>
          <Command.Item
            value="action:publish"
            keywords={["Publish a component", "add", "submit", "contribute", "new"]}
            onSelect={() => openDialog("publish")}
            className={itemClass}
          >
            <PackagePlus size={16} strokeWidth={1.9} className="text-ink-3" />
            Publish a component
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="flex h-10 items-center gap-4 border-t border-line-subtle bg-subtle px-4 text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          Open
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <Kbd>{MOD}</Kbd>
          <Kbd>↵</Kbd>
          Copy code
        </span>
      </div>
    </>
  );
}
