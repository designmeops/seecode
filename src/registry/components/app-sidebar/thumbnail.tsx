import { AppSidebar } from "./app-sidebar";

/** The top of the sidebar with an open group, cropped with a soft fade to fit a grid card. */
export default function AppSidebarThumbnail() {
  return (
    <div className="relative h-[262px] w-[218px] overflow-hidden rounded-xl">
      <AppSidebar
        workspace={{ name: "Acme Workspace" }}
        items={[
          {
            label: "Audience",
            icon: "chart",
            children: [{ label: "Companies", active: true }, { label: "Segments" }],
          },
        ]}
        user={{ name: "Alex Morgan", email: "alex@acme.studio" }}
        className="-mt-5 h-[960px]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-[#17171b]" />
    </div>
  );
}
