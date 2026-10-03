import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { type ReactNode, useRef } from "react";
import { copyWithToast } from "../lib/copy";
import { closeDialog, type DialogName, openDialog, useDialog } from "../lib/state";
import { CodeBlock } from "./CodeBlock";
import { IconButton } from "./ui/Button";
import { Shortcut } from "./ui/Kbd";

function Modal({
  name,
  title,
  description,
  children,
  width = 560,
}: {
  name: DialogName;
  title: string;
  description?: string;
  children: ReactNode;
  width?: number;
}) {
  const dialog = useDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root
      open={dialog === name}
      onOpenChange={(open) => (open ? openDialog(name) : closeDialog())}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in" />
        <Dialog.Content
          ref={contentRef}
          {...(description ? {} : { "aria-describedby": undefined })}
          // Focus the dialog itself rather than ringing the close button.
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            contentRef.current?.focus();
          }}
          style={{ width: `min(${width}px, calc(100vw - 24px))` }}
          className="fixed top-[10vh] left-1/2 z-50 flex max-h-[80vh] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-line bg-raised shadow-modal outline-hidden data-[state=open]:animate-pop-in"
        >
          <div className="flex items-start gap-4 border-b border-line-subtle px-5 pt-4 pb-3.5">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-0.5 text-mini text-ink-3">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <IconButton label="Close" className="-mr-1.5">
                <X size={15} strokeWidth={1.9} />
              </IconButton>
            </Dialog.Close>
          </div>
          <div className="scrollbar-subtle overflow-y-auto px-5 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const SHORTCUTS: { group: string; items: [string, string][] }[] = [
  {
    group: "General",
    items: [
      ["Open command menu", "mod+k"],
      ["Show keyboard shortcuts", "?"],
      ["Filter components", "/"],
    ],
  },
  {
    group: "Navigation",
    items: [
      ["Go to Explore", "g e"],
      ["Go to Favorites", "g f"],
      ["Go to Recently copied", "g r"],
    ],
  },
  {
    group: "Lists",
    items: [
      ["Move down", "j"],
      ["Move up", "k"],
      ["Open component", "enter"],
      ["Copy code (last-used platform)", "c"],
      ["Add to favorites", "f"],
      ["Switch grid / list", "v"],
    ],
  },
  {
    group: "Component page",
    items: [
      ["Copy the code on screen", "c"],
      ["Add to favorites", "f"],
      ["Next / previous component", "j"],
      ["Replay preview", "r"],
      ["Back to list", "escape"],
    ],
  },
];

export function ShortcutsDialog() {
  return (
    <Modal
      name="shortcuts"
      title="Keyboard shortcuts"
      description="seecode is built to be driven from the keyboard."
      width={620}
    >
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {SHORTCUTS.map(({ group, items }) => (
          <section key={group}>
            <h3 className="mb-1.5 text-[12px] font-medium text-ink-3">{group}</h3>
            <ul>
              {items.map(([label, keys]) => (
                <li
                  key={label}
                  className="flex h-8 items-center justify-between gap-3 border-b border-line-subtle text-mini text-ink-2 last:border-0"
                >
                  {label}
                  {label === "Next / previous component" ? (
                    <span className="flex items-center gap-1">
                      <Shortcut keys="j" />
                      <span className="text-[11px] text-ink-4">/</span>
                      <Shortcut keys="k" />
                    </span>
                  ) : (
                    <Shortcut keys={keys} />
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

const TEMPLATE = `import { defineComponent } from "../../define";
import nextjs from "./glow-card.tsx?raw";
import framer from "./glow-card.framer.tsx?raw";
import webflow from "./glow-card.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";

export default defineComponent({
  slug: "glow-card",
  name: "Glow Card",
  description: "A card with a soft glow that follows the cursor.",
  category: "cards",
  tags: ["animated", "interactive"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  formats: {
    nextjs: { name: "glow-card.tsx", language: "tsx", code: nextjs },
    framer: { name: "GlowCard.tsx", language: "tsx", code: framer },
    webflow: { name: "glow-card.html", language: "html", code: webflow },
  },
  usage,
  preview: { component: Demo },
});
`;

export function PublishDialog() {
  return (
    <Modal
      name="publish"
      title="Publish a component"
      description="Components are folders in the repository. Add one and it appears here automatically."
      width={640}
    >
      <ol className="space-y-4 text-mini text-ink-2">
        <PublishStep index={1} title="Create a folder">
          <code className="font-mono text-[12px] text-ink">
            src/registry/components/&lt;slug&gt;/
          </code>
        </PublishStep>
        <PublishStep index={2} title="Add the code for each platform">
          <span>
            <Code>&lt;slug&gt;.tsx</Code> for Next.js (React + Tailwind),{" "}
            <Code>&lt;slug&gt;.framer.tsx</Code> for Framer and{" "}
            <Code>&lt;slug&gt;.webflow.html</Code> for Webflow — plus <Code>demo.tsx</Code>, the
            live preview, and <Code>index.ts</Code>, its metadata:
          </span>
        </PublishStep>
      </ol>
      <CodeBlock
        className="mt-3"
        tabs={[
          {
            id: "index",
            label: "index.ts",
            language: "ts",
            code: TEMPLATE,
            copyKey: "publish:template",
            onCopy: () =>
              copyWithToast(TEMPLATE, {
                key: "publish:template",
                title: "Copied index.ts template",
              }),
          },
        ]}
      />
      <ol start={3} className="mt-4 space-y-4 text-mini text-ink-2">
        <PublishStep index={3} title="Check it">
          <span>
            Run <Code>npm test</Code> — it validates the metadata, renders every demo and Framer
            version, and checks the Webflow class names. The full checklist lives in{" "}
            <Code>CONTRIBUTING.md</Code>.
          </span>
        </PublishStep>
      </ol>
    </Modal>
  );
}

function PublishStep({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand-ink tabular-nums">
        {index}
      </span>
      <div className="min-w-0">
        <p className="font-medium text-ink">{title}</p>
        <div className="mt-0.5 leading-[20px] text-ink-3">{children}</div>
      </div>
    </li>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[4px] border border-line-subtle bg-subtle px-1 font-mono text-[11.5px] text-ink">
      {children}
    </code>
  );
}
