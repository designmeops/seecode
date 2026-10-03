import { AnnouncementPill } from "./announcement-pill";

export default function AnnouncementPillDemo() {
  return (
    <div className="flex w-[26rem] flex-col items-center text-center">
      <AnnouncementPill href="/changelog/agents-2">Introducing Agents 2.0</AnnouncementPill>
      <h1 className="mt-7 bg-linear-to-br from-white from-35% to-white/45 bg-clip-text text-5xl/[1.05] font-semibold tracking-[-0.04em] text-balance text-transparent">
        Plan, build and ship faster
      </h1>
      <p className="mt-4 text-base tracking-tight text-zinc-400">
        The issue tracker built for teams that move quickly.
      </p>
    </div>
  );
}
