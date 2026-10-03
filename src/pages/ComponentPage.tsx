import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Eye,
  Link2,
  Moon,
  RefreshCw,
  RotateCcw,
  SearchX,
  Sparkles,
  Sun,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { CodeBlock, type CodeTab } from "../components/CodeBlock";
import { copyComponentLink } from "../components/ComponentMenu";
import { EmptyState } from "../components/EmptyState";
import { FavoriteButton, toggleFavoriteWithToast } from "../components/FavoriteButton";
import { FormatCopyButtons } from "../components/FormatCopyButtons";
import { HeaderDivider, NavigationButton, PageHeader } from "../components/layout/PageHeader";
import { ScrollArea } from "../components/layout/ScrollArea";
import { Preview } from "../components/Preview";
import { AuthorAvatar } from "../components/ui/Avatar";
import { Button, IconButton } from "../components/ui/Button";
import { CategoryIcon } from "../components/ui/CategoryIcon";
import { FormatIcon } from "../components/ui/FormatIcon";
import { TagPill } from "../components/ui/Pill";
import { Segmented } from "../components/ui/Segmented";
import { Tooltip } from "../components/ui/Tooltip";
import { useHotkeys } from "../hooks/useHotkeys";
import { copyComponent, copyKey, copyWithToast } from "../lib/copy";
import { formatDate, formatRelative, isRecent } from "../lib/format";
import { defaultFormatFor, formatsOf, getFormat } from "../lib/formats";
import { lastBrowseRoute, navigate, toHref } from "../lib/router";
import { sortItems } from "../lib/search";
import { useHistory, usePreferences } from "../lib/state";
import { type Theme, useTheme } from "../lib/theme";
import { getComponent, type RegistryItem, registry } from "../registry";
import { getAuthor } from "../registry/authors";
import { getCategory } from "../registry/categories";
import type { FormatId } from "../registry/types";

export function ComponentPage({ slug }: { slug: string }) {
  const item = getComponent(slug);
  if (!item) {
    return (
      <>
        <PageHeader>
          <NavigationButton />
          <h1 className="text-[13.5px] font-medium text-ink">Not found</h1>
        </PageHeader>
        <EmptyState
          icon={SearchX}
          title="This component doesn’t exist"
          description={`There’s no component called “${slug}”. It may have been renamed or removed.`}
          action={
            <Button size="sm" onClick={() => navigate({ name: "explore" })}>
              Back to Explore
            </Button>
          }
        />
      </>
    );
  }
  return <ComponentDetail key={item.slug} item={item} />;
}

function relatedTo(item: RegistryItem): RegistryItem[] {
  const sameCategory = registry.filter(
    (other) => other.category === item.category && other.slug !== item.slug,
  );
  const sharedTags = registry.filter(
    (other) =>
      other.category !== item.category && other.tags.some((tag) => item.tags.includes(tag)),
  );
  return [...sameCategory, ...sharedTags].slice(0, 5);
}

function goBack(item: RegistryItem) {
  navigate(lastBrowseRoute() ?? { name: "category", category: item.category });
}

function ComponentDetail({ item }: { item: RegistryItem }) {
  const prefs = usePreferences();
  const history = useHistory();
  const app = useTheme();
  const [replayKey, setReplayKey] = useState(0);
  const [canvas, setCanvas] = useState<Theme | null>(null);
  const [format, setFormat] = useState<FormatId>(() => defaultFormatFor(item));
  const category = getCategory(item.category);
  const author = getAuthor(item.author);
  const record = history.find((entry) => entry.slug === item.slug);
  const canvasTheme = canvas ?? app.theme;

  const ordered = useMemo(() => sortItems(registry, prefs.sort), [prefs.sort]);
  const index = ordered.findIndex((other) => other.slug === item.slug);
  const previous = index > 0 ? ordered[index - 1] : null;
  const next = index < ordered.length - 1 ? ordered[index + 1] : null;
  const related = useMemo(() => relatedTo(item), [item]);

  useEffect(() => {
    document.title = `${item.name} · seecode`;
  }, [item.name]);

  const go = (target: RegistryItem | null) =>
    target && navigate({ name: "component", slug: target.slug });

  useHotkeys({
    // Copies what the code viewer shows.
    c: () => void copyComponent(item, format),
    f: () => toggleFavoriteWithToast(item),
    j: () => go(next),
    k: () => go(previous),
    r: () => setReplayKey((key) => key + 1),
    escape: () => goBack(item),
  });

  const tabs: CodeTab[] = formatsOf(item).map((meta) => {
    const file = item.formats[meta.id]!;
    return {
      id: meta.id,
      label: meta.name,
      icon: <FormatIcon format={meta.id} size={13} />,
      fileName: file.name,
      language: file.language,
      code: file.code,
      copyKey: copyKey(item, meta.id),
      onCopy: () => copyComponent(item, meta.id),
      copyTooltip: `Copy ${meta.name} code`,
      copyShortcut: "c",
    };
  });

  const status = isRecent(item.createdAt)
    ? { label: "New", icon: <Sparkles size={14} strokeWidth={1.9} className="text-brand-ink" /> }
    : isRecent(item.updatedAt)
      ? {
          label: "Recently updated",
          icon: <RefreshCw size={14} strokeWidth={1.9} className="text-info" />,
        }
      : {
          label: "Stable",
          icon: <CircleCheck size={14} strokeWidth={1.9} className="text-good" />,
        };

  return (
    <>
      <PageHeader>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <NavigationButton />
          <Tooltip label="Back" shortcut="escape">
            <IconButton label="Back" className="max-lg:hidden" onClick={() => goBack(item)}>
              <ArrowLeft size={15} strokeWidth={1.9} />
            </IconButton>
          </Tooltip>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-mini">
            <a
              href={toHref({ name: "explore" })}
              className="hidden shrink-0 text-ink-3 transition-colors hover:text-ink md:block"
            >
              Explore
            </a>
            <ChevronRight size={13} className="hidden shrink-0 text-ink-4 md:block" />
            <a
              href={toHref({ name: "category", category: item.category })}
              className="flex shrink-0 items-center gap-1.5 text-ink-3 transition-colors hover:text-ink"
            >
              <CategoryIcon category={item.category} />
              <span className="hidden md:inline">{category.name}</span>
            </a>
            <ChevronRight size={13} className="shrink-0 text-ink-4" />
            <span aria-current="page" className="truncate font-medium text-ink">
              {item.name}
            </span>
            <span className="ml-1 hidden shrink-0 text-[12px] text-ink-4 tabular-nums sm:inline">
              {item.id}
            </span>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <FormatCopyButtons item={item} labels="xl" />
          <HeaderDivider />
          <FavoriteButton item={item} size="sm" />
          <Tooltip label="Copy link">
            <IconButton label="Copy link" onClick={() => void copyComponentLink(item)}>
              <Link2 size={15} strokeWidth={1.9} />
            </IconButton>
          </Tooltip>
          <HeaderDivider className="max-sm:hidden" />
          <span className="hidden px-1 text-[12px] text-ink-4 tabular-nums xl:block">
            {index + 1} / {ordered.length}
          </span>
          <Tooltip label="Previous component" shortcut="k">
            <IconButton
              label="Previous component"
              disabled={!previous}
              onClick={() => go(previous)}
              className="max-sm:hidden"
            >
              <ChevronUp size={16} strokeWidth={1.9} />
            </IconButton>
          </Tooltip>
          <Tooltip label="Next component" shortcut="j">
            <IconButton
              label="Next component"
              disabled={!next}
              onClick={() => go(next)}
              className="max-sm:hidden"
            >
              <ChevronDown size={16} strokeWidth={1.9} />
            </IconButton>
          </Tooltip>
        </div>
      </PageHeader>

      <ScrollArea routeKey={`component:${item.slug}`}>
        <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[960px]">
              <h1 className="text-[24px] leading-8 font-semibold tracking-[-0.022em] text-ink">
                {item.name}
              </h1>
              <p className="mt-1.5 max-w-2xl text-[14px] leading-[22px] text-ink-3">
                {item.description}
              </p>

              <section
                aria-label="Preview"
                className="mt-6 overflow-hidden rounded-xl border border-line shadow-card"
              >
                <div className="flex h-10 items-center gap-2 border-b border-line bg-card pr-2 pl-3">
                  <Eye size={14} strokeWidth={1.9} className="text-ink-3" />
                  <span className="text-[12.5px] font-medium text-ink-2">Preview</span>
                  <span className="hidden text-[12px] text-ink-4 sm:inline">· Interactive</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Segmented
                      label="Canvas"
                      iconOnly
                      value={canvasTheme}
                      onChange={setCanvas}
                      options={[
                        {
                          value: "light",
                          label: "Light canvas",
                          icon: <Sun size={13} strokeWidth={1.9} />,
                        },
                        {
                          value: "dark",
                          label: "Dark canvas",
                          icon: <Moon size={13} strokeWidth={1.9} />,
                        },
                      ]}
                    />
                    <Tooltip label="Replay preview" shortcut="r">
                      <IconButton
                        label="Replay preview"
                        onClick={() => setReplayKey((key) => key + 1)}
                      >
                        <RotateCcw size={14} strokeWidth={1.9} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <Preview
                  item={item}
                  variant="canvas"
                  theme={canvasTheme}
                  replayKey={replayKey}
                  className="px-4 py-12 sm:px-8"
                  style={{ minHeight: item.preview.height ?? 360 }}
                />
              </section>

              <Section
                title="Code"
                description="The same component for each platform — pick yours and copy it."
              >
                <CodeBlock
                  key={item.slug}
                  label="Platforms"
                  tabs={tabs}
                  value={format}
                  onValueChange={(id) => setFormat(id as FormatId)}
                />
              </Section>

              <Section title={`Use it in ${getFormat(format).name}`}>
                <Installation item={item} format={format} />
              </Section>

              {item.props && item.props.length > 0 && (
                <Section
                  title="Props"
                  description={
                    format === "webflow"
                      ? "The Next.js and Framer versions take these props. In Webflow, edit the HTML instead."
                      : format === "framer"
                        ? "Each prop is a property control in Framer’s right panel."
                        : undefined
                  }
                >
                  <div className="overflow-x-auto rounded-xl border border-line">
                    <table className="w-full min-w-[560px] text-left text-mini">
                      <thead className="bg-subtle text-[12px] text-ink-3">
                        <tr>
                          <th className="px-4 py-2 font-medium">Prop</th>
                          <th className="px-4 py-2 font-medium">Type</th>
                          <th className="px-4 py-2 font-medium">Default</th>
                          <th className="px-4 py-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.props.map((prop) => (
                          <tr key={prop.name} className="border-t border-line-subtle align-top">
                            <td className="px-4 py-2.5 font-mono text-[12px] whitespace-nowrap text-ink">
                              {prop.name}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[12px] text-code-type">
                              {prop.type}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[12px] whitespace-nowrap text-ink-3">
                              {prop.default ?? "—"}
                            </td>
                            <td className="px-4 py-2.5 text-ink-2">{prop.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}
            </div>
          </div>

          <aside
            aria-label="Properties"
            className="border-t border-line-subtle bg-subtle px-5 py-6 xl:border-t-0 xl:border-l"
          >
            <PanelTitle>Properties</PanelTitle>
            <dl className="mt-2">
              <Property label="Status">
                {status.icon}
                {status.label}
              </Property>
              <Property label="Category">
                <a
                  href={toHref({ name: "category", category: item.category })}
                  className="-mx-1 flex items-center gap-1.5 rounded px-1 transition-colors hover:bg-hover"
                >
                  <CategoryIcon category={item.category} />
                  {category.name}
                </a>
              </Property>
              <Property label="Author">
                <AuthorAvatar author={item.author} size="sm" />
                <span className="truncate" title={author.handle}>
                  {author.name}
                </span>
              </Property>
              <Property label="Platforms" align="start">
                <ul className="flex flex-col gap-1.5 py-1.5">
                  {formatsOf(item).map((meta) => (
                    <li key={meta.id} className="flex items-center gap-2" title={meta.summary}>
                      <FormatIcon format={meta.id} size={13} className="text-ink-2" />
                      {meta.name}
                    </li>
                  ))}
                </ul>
              </Property>
              <Property label="Version">
                <span className="font-mono text-[12px]">v{item.version}</span>
              </Property>
              <Property label="Published">{formatDate(item.createdAt)}</Property>
              {item.updatedAt && <Property label="Updated">{formatDate(item.updatedAt)}</Property>}
              <Property label="License">MIT</Property>
            </dl>

            <Divider />
            <PanelTitle>Labels</PanelTitle>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>

            <Divider />
            <PanelTitle>Your activity</PanelTitle>
            <p className="mt-2 text-mini text-ink-2">
              {record ? (
                <>
                  Copied {record.count === 1 ? "once" : `${record.count} times`}
                  <span className="text-ink-4"> · last {formatRelative(record.at)}</span>
                </>
              ) : (
                <span className="text-ink-3">You haven’t copied this yet.</span>
              )}
            </p>

            {related.length > 0 && (
              <>
                <Divider />
                <PanelTitle>Related</PanelTitle>
                <ul className="-mx-2 mt-1.5">
                  {related.map((other) => (
                    <li key={other.slug}>
                      <a
                        href={toHref({ name: "component", slug: other.slug })}
                        className="flex h-8 items-center gap-2 rounded-md px-2 text-mini text-ink-2 transition-colors hover:bg-hover hover:text-ink"
                      >
                        <CategoryIcon category={other.category} />
                        <span className="truncate">{other.name}</span>
                        <span className="ml-auto text-[11.5px] text-ink-4 tabular-nums">
                          {other.id}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </ScrollArea>
    </>
  );
}

/** Platform-specific steps for the selected code tab. */
function Installation({ item, format }: { item: RegistryItem; format: FormatId }) {
  const file = item.formats[format] ?? item.formats.nextjs;

  if (format === "framer") {
    const name = file.name.replace(/\.tsx$/, "");
    return (
      <ol className="space-y-3">
        <Step index={1}>
          In Framer, open <strong className="font-medium text-ink">Assets</strong>, click{" "}
          <InlineCode>+</InlineCode> next to Code and create a new code file named{" "}
          <InlineCode>{name}</InlineCode>.
        </Step>
        <Step index={2}>Replace the file’s contents with the Framer code and save.</Step>
        <Step index={3}>
          Drag <InlineCode>{name}</InlineCode> from Assets onto the canvas, then edit its content in
          the property controls on the right.
        </Step>
      </ol>
    );
  }

  if (format === "webflow") {
    return (
      <ol className="space-y-3">
        <Step index={1}>
          In the Webflow Designer, drag a{" "}
          <strong className="font-medium text-ink">Code Embed</strong> element (Add panel →
          Elements) to where the section should go.
        </Step>
        <Step index={2}>
          Paste the Webflow code and save. Every class starts with <InlineCode>sc-</InlineCode>, so
          it never restyles the rest of your site.
        </Step>
        <Step index={3}>Edit the text in the HTML, then publish.</Step>
      </ol>
    );
  }

  const usageKey = `${item.slug}:usage`;
  return (
    <ol className="space-y-3">
      <Step index={1}>
        Copy <InlineCode>{file.name}</InlineCode> into your project — for example{" "}
        <InlineCode>components/{file.name}</InlineCode>.
      </Step>
      <Step index={2}>It needs React 19 and Tailwind CSS v4 — no other dependencies.</Step>
      <Step index={3}>
        <span>Import it and render it:</span>
        <CodeBlock
          className="mt-3"
          label="Example"
          tabs={[
            {
              id: "example",
              label: "Example",
              fileName: "page.tsx",
              language: "tsx",
              code: item.usage,
              copyKey: usageKey,
              copyTooltip: "Copy example",
              onCopy: () =>
                copyWithToast(item.usage, {
                  key: usageKey,
                  title: "Copied usage example",
                  description: item.name,
                }),
            },
          ]}
        />
      </Step>
    </ol>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      {description && <p className="mt-0.5 text-[12.5px] text-ink-3">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Step({ index, children }: { index: number; children: ReactNode }) {
  return (
    <li className="flex gap-3 text-mini leading-6 text-ink-2">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-line bg-card text-[11px] font-medium text-ink-3 tabular-nums">
        {index}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[5px] border border-line-subtle bg-subtle px-1.5 py-px font-mono text-[12px] text-ink">
      {children}
    </code>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[12px] font-medium text-ink-3">{children}</h2>;
}

function Property({
  label,
  align = "center",
  children,
}: {
  label: string;
  align?: "center" | "start";
  children: ReactNode;
}) {
  return (
    <div className={align === "center" ? "flex min-h-8 items-center gap-2" : "flex gap-2"}>
      <dt
        className={
          align === "center"
            ? "w-[92px] shrink-0 text-[12.5px] text-ink-3"
            : "flex h-8 w-[92px] shrink-0 items-center text-[12.5px] text-ink-3"
        }
      >
        {label}
      </dt>
      <dd className="flex min-w-0 flex-1 items-center gap-1.5 text-mini text-ink">{children}</dd>
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px bg-line-subtle" />;
}
