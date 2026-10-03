import { useId } from "react";
import { TagInput } from "./tag-input";

export default function TagInputDemo() {
  const id = useId();

  return (
    <div className="grid w-80 gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        Topics
      </label>
      <TagInput
        id={id}
        defaultValue={["design", "react", "tailwind"]}
        placeholder="Add topic…"
        maxTags={8}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="text-xs text-zinc-500">
        Press Enter or comma to add. Up to 8 topics.
      </p>
    </div>
  );
}
