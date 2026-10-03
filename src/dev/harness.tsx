/**
 * Dev-only page (`/harness.html`) that renders registry demos the way the
 * dashboard does: `?slug=<slug>` shows one component as a grid card and on the
 * full canvas; no query renders every card.
 */
import "@fontsource-variable/inter";
import "@fontsource-variable/geist-mono";
import "../styles/index.css";
import { createRoot } from "react-dom/client";
import { Preview } from "../components/Preview";
import { registry } from "../registry";

const slug = new URLSearchParams(location.search).get("slug");
const items = slug ? registry.filter((item) => item.slug === slug) : registry;

function Harness() {
  if (items.length === 0) return <p className="p-6">No component named “{slug}”.</p>;
  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-[repeat(auto-fill,360px)] gap-4">
        {items.map((item) => (
          <figure
            key={item.slug}
            className="overflow-hidden rounded-xl border border-line bg-panel"
          >
            <Preview item={item} variant="card" className="h-[220px]" />
            <figcaption className="border-t border-line px-3 py-2 text-mini text-ink-3">
              {item.id} · {item.name}
            </figcaption>
          </figure>
        ))}
      </div>
      {slug &&
        items.map((item) => (
          <div key={item.slug} className="w-[880px] overflow-hidden rounded-xl border border-line">
            <Preview
              item={item}
              variant="canvas"
              className="p-8"
              style={{ minHeight: item.preview.height ?? 360 }}
            />
          </div>
        ))}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Harness />);
