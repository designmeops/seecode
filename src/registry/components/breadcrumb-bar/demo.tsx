import { BreadcrumbBar } from "./breadcrumb-bar";

export default function BreadcrumbBarDemo() {
  return (
    <div className="w-[min(720px,100%)] overflow-hidden rounded-xl border border-[#bcbccd] bg-[#f4f4fb]">
      <BreadcrumbBar
        items={[
          { label: "Companies", href: "/companies" },
          { label: "Acme Inc.", href: "/companies/acme" },
        ]}
      />
      <div className="h-24" />
    </div>
  );
}
