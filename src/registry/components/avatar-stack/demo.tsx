import { AvatarStack } from "./avatar-stack";

const viewers = [
  "Ana Silva",
  "Leo Park",
  "Sam Reed",
  "Mia Chen",
  "Noah Kim",
  "Zoe Hart",
  "Eli Moss",
  "Ivy Lane",
].map((name) => ({ name }));

const reviewers = [{ name: "Mia Chen" }, { name: "Noah Kim" }, { name: "Zoe Hart" }];

export default function AvatarStackDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-3 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04),0_6px_16px_-6px_rgb(0_0_0/0.1)]">
        <AvatarStack people={viewers} max={3} aria-label="People viewing this file" />
        <p className="text-sm text-zinc-500">
          <span className="font-medium text-zinc-900">8 people</span> are viewing this file
        </p>
      </div>
      <div className="flex items-center gap-2">
        <AvatarStack people={reviewers} size="sm" aria-label="Reviewers" />
        <p className="text-xs text-zinc-500">Reviewed by Mia, Noah and Zoe</p>
      </div>
    </div>
  );
}
