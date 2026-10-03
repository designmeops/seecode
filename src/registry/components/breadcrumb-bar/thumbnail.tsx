import { BreadcrumbBar } from "./breadcrumb-bar";

export default function BreadcrumbBarThumbnail() {
  return (
    <div className="w-[300px] overflow-hidden rounded-xl border border-[#bcbccd] bg-[#f4f4fb]">
      <BreadcrumbBar
        items={[
          { label: "Companies", href: "/companies" },
          { label: "Acme Inc.", href: "/companies/acme" },
        ]}
      />
      <div className="h-16" />
    </div>
  );
}
