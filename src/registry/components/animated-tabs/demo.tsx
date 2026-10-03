import { type AnimatedTab, AnimatedTabs } from "./animated-tabs";

const people = [
  { name: "Ana Silva", initials: "AS", color: "from-indigo-400 to-violet-500" },
  { name: "Leo Park", initials: "LP", color: "from-sky-400 to-indigo-500" },
  { name: "Sam Reed", initials: "SR", color: "from-emerald-400 to-teal-600" },
  { name: "Mia Chen", initials: "MC", color: "from-amber-300 to-orange-500" },
];

function Avatar({ person }: { person: (typeof people)[number] }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br text-[10px] font-semibold text-white ${person.color}`}
    >
      {person.initials}
    </span>
  );
}

function Overview() {
  const stats = [
    { label: "Issues", value: "128" },
    { label: "Completed", value: "94" },
    { label: "Cycle time", value: "3.2d" },
  ];
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-950/5"
          >
            <dt className="text-xs text-zinc-500">{stat.label}</dt>
            <dd className="mt-0.5 text-lg font-semibold tracking-tight text-zinc-900 tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-700">Q4 Platform</span>
          <span className="text-zinc-500 tabular-nums">73% complete</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full w-[73%] rounded-full bg-indigo-500" />
        </div>
      </div>
    </div>
  );
}

function Activity() {
  const events = [
    { person: people[0], text: "moved ENG-142 to In Review", time: "2h" },
    { person: people[1], text: "commented on ENG-139", time: "5h" },
    { person: people[2], text: "closed ENG-120", time: "1d" },
  ];
  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li key={event.text} className="flex items-center gap-2.5 text-sm">
          <Avatar person={event.person} />
          <p className="min-w-0 flex-1 truncate text-zinc-500">
            <span className="font-medium text-zinc-900">{event.person.name}</span> {event.text}
          </p>
          <span className="text-xs text-zinc-400 tabular-nums">{event.time}</span>
        </li>
      ))}
    </ul>
  );
}

function Settings() {
  const rows = [
    { label: "Project lead", value: "Ana Silva" },
    { label: "Visibility", value: "Acme team" },
    { label: "Cycle length", value: "2 weeks" },
  ];
  return (
    <dl className="divide-y divide-zinc-100 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-2 first:pt-0">
          <dt className="text-zinc-500">{row.label}</dt>
          <dd className="font-medium text-zinc-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Members() {
  const roles = ["Admin", "Member", "Member"];
  return (
    <ul className="space-y-2.5">
      {people.slice(0, 3).map((person, index) => (
        <li key={person.name} className="flex items-center gap-2.5 text-sm">
          <Avatar person={person} />
          <span className="flex-1 font-medium text-zinc-900">{person.name}</span>
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600">
            {roles[index]}
          </span>
        </li>
      ))}
    </ul>
  );
}

const tabs: AnimatedTab[] = [
  { id: "overview", label: "Overview", content: <Overview /> },
  { id: "activity", label: "Activity", content: <Activity /> },
  { id: "settings", label: "Settings", content: <Settings /> },
  { id: "members", label: "Members", content: <Members /> },
];

export default function AnimatedTabsDemo() {
  return (
    <div className="w-[400px] rounded-xl bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-8px_rgb(0_0_0/0.1)]">
      <AnimatedTabs
        tabs={tabs}
        label="Project"
        listClassName="border-b border-zinc-100 p-2"
        panelClassName="h-[140px] p-4"
      />
    </div>
  );
}
