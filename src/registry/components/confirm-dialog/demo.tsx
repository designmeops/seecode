import { ConfirmDialog } from "./confirm-dialog";

export default function ConfirmDialogDemo() {
  return (
    // A settings section behind the dialog; the fixed overlay dims and blurs it.
    <div className="flex h-[376px] w-[720px] items-center justify-center">
      <section className="w-[30rem] rounded-xl border border-zinc-200 bg-white shadow-xs">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">Danger zone</h3>
          <p className="mt-0.5 text-sm text-zinc-500">Irreversible actions for this project.</p>
        </header>
        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-zinc-900">Delete project</p>
            <p className="mt-0.5 text-sm text-zinc-500">Removes acme-web and everything in it.</p>
          </div>
          <ConfirmDialog
            defaultOpen
            confirmText="acme-web"
            description={
              <>
                <strong className="font-medium text-zinc-700">acme-web</strong> and all 128
                deployments will be permanently deleted. This can’t be undone.
              </>
            }
            onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
            trigger={
              <button
                type="button"
                className="h-8 shrink-0 rounded-lg border border-rose-200 bg-white px-3 text-sm font-medium text-rose-600 shadow-xs transition-colors duration-150 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                Delete project
              </button>
            }
          />
        </div>
      </section>
    </div>
  );
}
