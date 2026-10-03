import { Switch } from "./toggle-switch";

export default function SwitchDemo() {
  return (
    <div className="w-80 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgb(9_9_11/0.04),0_4px_12px_-4px_rgb(9_9_11/0.06)]">
      <Switch
        className="px-4 py-3.5"
        label="Email notifications"
        description="Mentions, replies and assignments."
        defaultChecked
      />
      <Switch
        className="px-4 py-3.5"
        label="Weekly digest"
        description="A recap of activity every Monday."
      />
      <Switch
        className="px-4 py-3.5"
        label="Beta features"
        description="Managed by your workspace admin."
        disabled
      />
    </div>
  );
}
