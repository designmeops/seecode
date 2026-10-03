"use client";

import type { HTMLAttributes, ReactNode } from "react";

export type UploadStatus = "uploading" | "complete" | "failed";

export type UploadFile = {
  id: string;
  name: string;
  /** File size in bytes. */
  size: number;
  /** Upload progress from 0 to 100. */
  progress: number;
  status: UploadStatus;
  /** Short reason shown when the upload failed. */
  error?: string;
};

export type UploadProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  files: UploadFile[];
  /** Replaces the automatic heading, e.g. "Uploading 3 files". */
  title?: ReactNode;
  /** Shows a Retry button on failed rows. */
  onRetry?: (id: string) => void;
  /** Shows a cancel button on rows that are still uploading. */
  onCancel?: (id: string) => void;
};

const fileTypes: [RegExp, string][] = [
  [/^pdf$/, "bg-rose-50 text-rose-600 ring-rose-600/15"],
  [/^(zip|rar|7z|tar|gz)$/, "bg-amber-50 text-amber-700 ring-amber-600/20"],
  [/^(fig|sketch|psd|ai|xd)$/, "bg-violet-50 text-violet-600 ring-violet-600/15"],
  [/^(png|jpe?g|gif|webp|svg|avif|heic)$/, "bg-emerald-50 text-emerald-600 ring-emerald-600/15"],
  [/^(mp4|mov|webm|mkv|mp3|wav)$/, "bg-sky-50 text-sky-600 ring-sky-600/15"],
  [/^(csv|xlsx?|numbers)$/, "bg-teal-50 text-teal-600 ring-teal-600/15"],
  [/^(docx?|txt|md|pages|rtf)$/, "bg-indigo-50 text-indigo-600 ring-indigo-600/15"],
];

const barColors: Record<UploadStatus, string> = {
  uploading: "bg-indigo-500",
  complete: "bg-emerald-500",
  failed: "bg-rose-500",
};

function formatBytes(bytes: number) {
  if (bytes < 1000) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1000;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
const clamp = (value: number) => Math.min(100, Math.max(0, value));

function FileTile({ name }: { name: string }) {
  const extension = name.includes(".") ? (name.split(".").pop() ?? "").toLowerCase() : "";
  const tone =
    fileTypes.find(([pattern]) => pattern.test(extension))?.[1] ??
    "bg-zinc-50 text-zinc-500 ring-zinc-950/10";
  return (
    <span
      aria-hidden="true"
      className={`grid size-9 shrink-0 place-items-center rounded-lg text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset ${tone}`}
    >
      {extension.slice(0, 4) || "file"}
    </span>
  );
}

export function UploadProgress({
  files,
  title,
  onRetry,
  onCancel,
  className = "",
  ...props
}: UploadProgressProps) {
  const total = files.reduce((sum, file) => sum + file.size, 0);
  const sent = files.reduce((sum, file) => sum + (file.size * clamp(file.progress)) / 100, 0);
  const percent = total > 0 ? Math.floor((sent / total) * 100) : 0;
  const uploading = files.filter((file) => file.status === "uploading").length;
  const failed = files.filter((file) => file.status === "failed").length;
  const complete = files.filter((file) => file.status === "complete").length;

  const heading =
    title ??
    (uploading > 0
      ? `Uploading ${plural(files.length, "file")}`
      : failed > 0
        ? `${plural(failed, "upload")} failed`
        : `${plural(files.length, "file")} uploaded`);
  const overallColor = uploading > 0 ? barColors.uploading : failed > 0 ? barColors.failed : barColors.complete;

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-8px_rgb(0_0_0/0.12)] ${className}`}
      {...props}
    >
      <div className="relative flex items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3">
        <div className="min-w-0">
          <p aria-live="polite" className="truncate text-sm font-medium tracking-tight text-zinc-900">
            {heading}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500 tabular-nums">
            {complete} of {files.length} done · {formatBytes(sent)} of {formatBytes(total)}
          </p>
        </div>
        <span className="text-sm font-medium text-zinc-900 tabular-nums">{percent}%</span>
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5">
          <div
            className={`h-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${overallColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="divide-y divide-zinc-100">
        {files.map((file) => {
          const progress = clamp(file.progress);
          return (
            <li key={file.id} className="flex items-center gap-3 px-4 py-2.5">
              <FileTile name={file.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{file.name}</p>
                <p
                  className={`text-xs tabular-nums ${file.status === "failed" ? "text-rose-600" : "text-zinc-500"}`}
                >
                  {file.status === "uploading" &&
                    `${formatBytes((file.size * progress) / 100)} of ${formatBytes(file.size)}`}
                  {file.status === "complete" && `${formatBytes(file.size)} · Uploaded`}
                  {file.status === "failed" && `Upload failed${file.error ? ` · ${file.error}` : ""}`}
                </p>
                <div
                  role="progressbar"
                  aria-label={file.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-valuetext={
                    file.status === "uploading" ? `${Math.round(progress)}%` : file.status
                  }
                  className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100"
                >
                  <div
                    className={`h-full rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${barColors[file.status]}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex w-16 shrink-0 items-center justify-end gap-1">
                {file.status === "uploading" && (
                  <>
                    <span className="text-xs font-medium text-zinc-500 tabular-nums">
                      {Math.round(progress)}%
                    </span>
                    {onCancel && (
                      <button
                        type="button"
                        aria-label={`Cancel upload of ${file.name}`}
                        onClick={() => onCancel(file.id)}
                        className="grid size-6 place-items-center rounded-md text-zinc-400 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
                {file.status === "complete" && (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 text-emerald-500">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <path d="m8 12.5 2.75 2.75L16 10" fill="none" stroke="white" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {file.status === "failed" &&
                  (onRetry ? (
                    <button
                      type="button"
                      onClick={() => onRetry(file.id)}
                      className="inline-flex h-7 items-center gap-1 rounded-md bg-white px-2 text-xs font-medium text-zinc-900 shadow-xs ring-1 ring-zinc-950/10 transition-colors duration-150 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8.3" />
                        <path d="M3 3v5.3h5.3" />
                      </svg>
                      Retry
                    </button>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 text-rose-500">
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path d="M12 7.5v5.25m0 3.75h.01" fill="none" stroke="white" strokeWidth={2.25} strokeLinecap="round" />
                    </svg>
                  ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
