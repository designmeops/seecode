import { type ActivityEvent, ActivityTimeline } from "./activity-timeline";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const events: ActivityEvent[] = [
  {
    id: "1",
    type: "create",
    actor: "Ana Silva",
    action: "created",
    target: "ENG-214",
    time: minutesAgo(5 * 60),
  },
  {
    id: "2",
    type: "status",
    actor: "Leo Park",
    action: "changed status to",
    chip: { label: "In Progress", tone: "amber" },
    time: minutesAgo(3 * 60),
  },
  {
    id: "3",
    type: "comment",
    actor: "Sam Ortiz",
    action: "commented",
    comment: "Repro'd on Safari 17. Fix for the OAuth redirect is up in #418.",
    time: minutesAgo(48),
  },
  {
    id: "4",
    type: "assign",
    actor: "Mia Chen",
    action: "assigned",
    target: "Ana Silva",
    time: minutesAgo(12),
  },
];

export default function ActivityTimelineDemo() {
  return (
    <section className="w-[400px] rounded-xl bg-white p-4 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-8px_rgb(0_0_0/0.1)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Activity</h3>
        <span className="font-mono text-xs text-zinc-400">ENG-214</span>
      </div>
      <ActivityTimeline events={events} />
    </section>
  );
}
