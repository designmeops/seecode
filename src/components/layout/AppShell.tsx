import { Dialog } from "radix-ui";
import { type ReactNode, useEffect } from "react";
import { useRoute } from "../../lib/router";
import { closeDialog, dialogStore, openDialog, useDialog } from "../../lib/state";
import { Sidebar } from "./Sidebar";

/** Linear's layout: sidebar on the app background, content on an inset, rounded panel. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full overflow-hidden bg-app">
      <aside aria-label="Sidebar" className="hidden w-60 shrink-0 lg:block">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col md:p-2 lg:pl-0">
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-panel md:rounded-xl md:border md:border-line md:shadow-panel">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}

function MobileNavigation() {
  const dialog = useDialog();
  const route = useRoute();
  const open = dialog === "navigation";

  // Close the drawer after navigating.
  useEffect(() => {
    if (dialogStore.get() === "navigation") closeDialog();
  }, [route]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => (next ? openDialog("navigation") : closeDialog())}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 w-[272px] max-w-[85vw] border-r border-line bg-app shadow-modal outline-hidden data-[state=open]:animate-drawer-in lg:hidden"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Sidebar onNavigate={closeDialog} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
