import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Eye,
  Link2,
  RefreshCw,
  RotateCcw,
  SearchX,
  Sparkles,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { CodeBlock, type CodeTab } from "../components/CodeBlock";
import { copyComponentLink } from "../components/ComponentMenu";
import { CopyButton } from "../components/CopyButton";
import { EmptyState } from "../components/EmptyState";
import { FavoriteButton, toggleFavoriteWithToast } from "../components/FavoriteButton";
import { PageHeader } from "../components/layout/PageHeader";
import { ScrollArea } from "../components/layout/ScrollArea";
import { Preview } from "../components/Preview";
import { AuthorAvatar } from "../components/ui/Avatar";
import { Button, IconButton } from "../components/ui/Button";
import { CategoryIcon } from "../components/ui/CategoryIcon";
import { TagPill } from "../components/ui/Pill";
import { Tooltip } from "../components/ui/Tooltip";
import { useHotkeys } from "../hooks/useHotkeys";
import { cn } from "../lib/cn";
import { copyComponent, copyKey, copyWithToast } from "../lib/copy";
import { countLines, formatDate, formatRelative, isRecent } from "../lib/format";
import { lastBrowseRoute, navigate, toHref } from "../lib/router";
import { sortItems } from "../lib/search";
import { useHistory, usePreferences } from "../lib/state";
import { getComponent, type RegistryItem, registry } from "../registry";
import { getAuthor } from "../registry/authors";
import { getCategory } from "../registry/categories";

export function ComponentPage({ slug }: { slug: string }) {
  const item = getComponent(slug);
  if (!item) {
    return (
      <>
        <PageHeader>
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
  const [replayKey, setReplayKey] = useState(0);
  const category = getCategory(item.category);
  const author = getAuthor(item.author);
  const [mainFile] = item.files;
  const record = history.find((entry) => entry.slug === item.slug);

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
    c: () => void copyComponent(item),
    f: () => toggleFavoriteWithToast(item),
    j: () => go(next),
    k: () => go(previous),
    r: () => setReplayKey((key) => key + 1),
    escape: () => goBack(item),
  });

  const tabs: CodeTab[] = [
    ...item.files.map((file, fileIndex) => ({
      id: file.name,
      label: file.name,
      language: file.language,
      code: file.code,
      copyKey: copyKey(item, fileIndex),
      onCopy: () => copyComponent(item, fileIndex),
      copyShortcut: fileIndex === 0 ? "c" : undefined,
    })),
    {
      id: "usage",
      label: "Usage",
      language: "tsx",
      code: item.usage,
      copyKey: `${item.slug}:usage`,
      onCopy: () =>
        copyWithToast(item.usage, {
          key: `${item.slug}:usage`,
          title: "Copied usage example",
          description: item.name,
        }),
    },
  ];

  const status = isRecent(item.createdAt)
    ? { label: "New", icon: <Sparkles size={14} strokeWidth={1.9} className="text-brand" /> }
    : isRecent(item.updatedAt)
      ? {
          label: "Recently updated",
          icon: <RefreshCw size={14} strokeWidth={1.9} className="text-[#2f80ed]" />,
        }
      : {
          label: "Stable",
          icon: <CircleCheck size={14} strokeWidth={1.9} className="text-good" />,
        };

  const dependencies = item.dependencies ?? [];

  return (
    <>
      <PageHeader
        actions={
          <>
            <FavoriteButton item={item} size="sm" />
            <Tooltip label="Copy link">
              <IconButton label="Copy link" onClick={() => void copyComponentLink(item)}>
                <Link2 size={15} strokeWidth={1.9} />
              </IconButton>
            </Tooltip>
            <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
            <span className="hidden px-1 text-[12px] text-ink-4 tabular-nums sm:block">
              {index + 1} / {ordered.length}
            </span>
            <Tooltip label="Previous component" shortcut="k">
              <IconButton
                label="Previous component"
                disabled={!previous}
                onClick={() => go(previous)}
              >
                <ChevronUp size={16} strokeWidth={1.9} />
              </IconButton>
            </Tooltip>
            <Tooltip label="Next component" shortcut="j">
              <IconButton label="Next component" disabled={!next} onClick={() => go(next)}>
                <ChevronDown size={16} strokeWidth={1.9} />
              </IconButton>
            </Tooltip>
          </>
        }
      >
        <Tooltip label="Back" shortcut="escape">
          <IconButton label="Back" className="max-lg:hidden" onClick={() => goBack(item)}>
            <ArrowLeft size={15} strokeWidth={1.9} />
          </IconButton>
        </Tooltip>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-mini">
          <a
            href={toHref({ name: "explore" })}
            className="hidden shrink-0 text-ink-3 transition-colors hover:text-ink sm:block"
          >
            Explore
          </a>
          <ChevronRight size={13} className="hidden shrink-0 text-ink-4 sm:block" />
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
      </PageHeader>

      <ScrollArea routeKey={`component:${item.slug}`}>
        <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-[920px]">
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
                <div className="min-w-0">
                  <div className="mb-2.5 flex items-center gap-2 text-[12.5px] text-ink-3">
                    <CategoryIcon category={item.category} />
                    {category.name}
                    <span className="text-ink-4">·</span>
                    <AuthorAvatar author={item.author} />
                    {author.name}
                  </div>
                  <h1 className="text-[24px] leading-8 font-semibold tracking-[-0.022em] text-ink">
                    {item.name}
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-[14px] leading-[22px] text-ink-3">
                    {item.description}
                  </p>
                </div>
                <CopyButton
                  variant="primary"
                  size="md"
                  copyKey={copyKey(item)}
                  onCopy={() => copyComponent(item)}
                  label="Copy code"
                  tooltip={`Copy ${mainFile.name}`}
                  shortcut="c"
                />
              </div>

              <section
                aria-label="Preview"
                className="mt-7 overflow-hidden rounded-xl border border-line shadow-card"
              >
                <div className="flex h-10 items-center gap-2 border-b border-line bg-panel pr-2 pl-3">
                  <Eye size={14} strokeWidth={1.9} className="text-ink-3" />
                  <span className="text-[12.5px] font-medium text-ink-2">Preview</span>
                  <span className="text-[12px] text-ink-4">· Interactive</span>
                  <Tooltip label="Replay preview" shortcut="r">
                    <IconButton
                      label="Replay preview"
                      className="ml-auto"
                      onClick={() => setReplayKey((key) => key + 1)}
                    >
                      <RotateCcw size={14} strokeWidth={1.9} />
                    </IconButton>
                  </Tooltip>
                </div>
                <Preview
                  item={item}
                  variant="canvas"
                  replayKey={replayKey}
                  className="px-4 py-12 sm:px-8"
                  style={{ minHeight: item.preview.height ?? 360 }}
                />
              </section>

              <Section title="Code">
                <CodeBlock key={item.slug} tabs={tabs} />
              </Section>

              <Section title="Installation">
                <ol className="space-y-3">
                  <Step index={1}>
                    Copy <InlineCode>{mainFile.name}</InlineCode> into your project — for example{" "}
                    <InlineCode>components/{mainFile.name}</InlineCode>.
                  </Step>
                  <Step index={2}>
                    It needs React 19 and Tailwind CSS v4
                    {dependencies.length > 0 ? (
                      <>
                        , plus <InlineCode>npm i {dependencies.join(" ")}</InlineCode>.
                      </>
                    ) : (
                      <> — no other dependencies.</>
                    )}
                  </Step>
                  <Step index={3}>
                    Import it and render it. The Usage tab has a complete example.
                  </Step>
                </ol>
              </Section>

              {item.props && item.props.length > 0 && (
                <Section title="Props">
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
                            <td className="px-4 py-2.5 font-mono text-[12px] text-[#0d7d8c]">
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
            className="border-t border-line-subtle bg-[#fbfbfc] px-5 py-6 xl:border-t-0 xl:border-l"
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
                <span className="truncate">{author.name}</span>
                <span className="truncate text-ink-4">{author.handle}</span>
              </Property>
              <Property label="Framework">React 19</Property>
              <Property label="Styling">Tailwind CSS v4</Property>
              <Property label="Dependencies">
                {dependencies.length ? dependencies.join(", ") : "None"}
              </Property>
              <Property label="Version">
                <span className="font-mono text-[12px]">v{item.version}</span>
              </Property>
              <Property label="Published">{formatDate(item.createdAt)}</Property>
              {item.updatedAt && <Property label="Updated">{formatDate(item.updatedAt)}</Property>}
              <Property label="Size">{countLines(mainFile.code)} lines</Property>
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
                <ul className="mt-1.5 -mx-2">
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-[14px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Step({ index, children }: { index: number; children: ReactNode }) {
  return (
    <li className="flex gap-3 text-mini leading-6 text-ink-2">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-line bg-subtle text-[11px] font-medium text-ink-3 tabular-nums">
        {index}
      </span>
      <span>{children}</span>
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

function Property({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-8 items-center gap-2">
      <dt className="w-[92px] shrink-0 text-[12.5px] text-ink-3">{label}</dt>
      <dd className={cn("flex min-w-0 flex-1 items-center gap-1.5 text-mini text-ink")}>
        {children}
      </dd>
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px bg-line-subtle" />;
}
