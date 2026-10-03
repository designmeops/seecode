import { IssueCard, IssueStatusIcon } from "./issue-card";

export default function IssueCardDemo() {
  return (
    <section
      aria-label="In Progress"
      className="w-78 rounded-2xl bg-zinc-100/80 p-1.5 ring-1 ring-zinc-950/5"
    >
      <header className="flex h-8 items-center gap-2 px-2">
        <IssueStatusIcon status="in-progress" className="size-3.5" />
        <h2 className="text-sm font-medium text-zinc-900">In Progress</h2>
        <span className="text-sm tabular-nums text-zinc-400">2</span>
      </header>

      <div className="flex flex-col gap-1.5">
        <IssueCard
          id="ENG-142"
          title="Checkout redirect loops when the cart session expires on Safari"
          status="in-progress"
          priority="urgent"
          labels={[
            { name: "Bug", color: "rose" },
            { name: "Frontend", color: "sky" },
          ]}
          assignee="Ana Lopez"
          dueDate="2026-10-12"
          comments={4}
          href="#ENG-142"
        />
        <IssueCard
          id="ENG-139"
          title="Move billing webhooks onto the new event queue"
          status="in-progress"
          priority="high"
          labels={[{ name: "Backend", color: "violet" }]}
          assignee="Leo Park"
          dueDate="2026-10-18"
          comments={2}
          href="#ENG-139"
        />
      </div>
    </section>
  );
}
