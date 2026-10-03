import type { HTMLAttributes } from "react";

export interface BreadcrumbBarItem {
  label: string;
  href?: string;
}

export interface BreadcrumbBarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The trail from the top level down. The last item is the current page. */
  items: BreadcrumbBarItem[];
}

const focusRing =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2867ef]";

export function BreadcrumbBar({ items, className = "", ...props }: BreadcrumbBarProps) {
  return (
    <header
      className={`flex h-14 items-center bg-white pr-[27px] pl-6 text-sm font-medium tracking-[-0.03em] shadow-[0_6px_20px_rgb(27_19_94/0.03)] ${className}`}
      {...props}
    >
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-2.5">
          {items.map((item, index) => {
            const current = index === items.length - 1;
            return (
              <li key={`${index}-${item.label}`} className="flex min-w-0 items-center gap-2.5">
                {current ? (
                  item.href ? (
                    <a
                      href={item.href}
                      aria-current="page"
                      className={`truncate font-semibold text-[#17171b] ${focusRing}`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span aria-current="page" className="truncate font-semibold text-[#17171b]">
                      {item.label}
                    </span>
                  )
                ) : (
                  <>
                    <a
                      href={item.href ?? "#"}
                      className={`truncate text-[#6b6b77] transition-colors hover:text-[#17171b] ${focusRing}`}
                    >
                      {item.label}
                    </a>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d0d0de"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="m-1 size-4 shrink-0"
                    >
                      <path d="M9 6l6 6l-6 6" />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
