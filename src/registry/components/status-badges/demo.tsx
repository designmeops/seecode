import { type IssueStatus, StatusBadge } from "./status-badges";

const issues: { id: string; title: string; status: IssueStatus }[] = [
  { id: "ENG-218", title: "Audit log export to CSV", status: "backlog" },
  { id: "ENG-214", title: "Rate limit webhook retries", status: "todo" },
  { id: "ENG-209", title: "Onboarding checklist v2", status: "in-progress" },
  { id: "ENG-205", title: "SAML login for Northwind", status: "in-review" },
  { id: "ENG-197", title: "Keyboard shortcuts in editor", status: "done" },
  { id: "ENG-190", title: "Legacy importer cleanup", status: "canceled" },
];

export default function StatusBadgesDemo() {
  return (
    <ul className="w-[380px] divide-y divide-zinc-100 rounded-xl bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-8px_rgb(0_0_0/0.1)]">
      {issues.map((issue) => (
        <li key={issue.id} className="flex items-center gap-3 px-3.5 py-2">
          <span className="w-14 shrink-0 font-mono text-xs text-zinc-400">{issue.id}</span>
          <span className="min-w-0 flex-1 truncate text-sm text-zinc-900">{issue.title}</span>
          <StatusBadge status={issue.status} />
        </li>
      ))}
    </ul>
  );
}
