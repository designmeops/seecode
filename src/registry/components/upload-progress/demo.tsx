"use client";

import { useEffect, useState } from "react";
import { type UploadFile, UploadProgress } from "./upload-progress";

type DemoFile = UploadFile & { speed: number; failAt?: number };

const initialFiles: DemoFile[] = [
  { id: "roadmap", name: "Q4-roadmap.pdf", size: 2_400_000, progress: 0, status: "uploading", speed: 6 },
  { id: "assets", name: "brand-assets.zip", size: 18_600_000, progress: 0, status: "uploading", speed: 2.6, failAt: 46 },
  { id: "flow", name: "onboarding-flow.fig", size: 6_100_000, progress: 0, status: "uploading", speed: 3.6 },
];

// Simulates uploads so the preview stays alive: every tick nudges each file
// forward, one file fails part-way, and the whole batch restarts once settled.
export default function UploadProgressDemo() {
  const [files, setFiles] = useState(initialFiles);

  useEffect(() => {
    const timer = setInterval(() => {
      setFiles((current) =>
        current.map((file) => {
          if (file.status !== "uploading") return file;
          const progress = file.progress + file.speed * (0.5 + Math.random());
          if (file.failAt !== undefined && progress >= file.failAt) {
            return { ...file, progress: file.failAt, status: "failed", error: "Connection lost" };
          }
          return progress >= 100
            ? { ...file, progress: 100, status: "complete" }
            : { ...file, progress };
        }),
      );
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const settled = files.every((file) => file.status !== "uploading");
  useEffect(() => {
    if (!settled) return;
    const timer = setTimeout(() => setFiles(initialFiles), 4000);
    return () => clearTimeout(timer);
  }, [settled]);

  const retry = (id: string) =>
    setFiles((current) =>
      current.map((file) =>
        file.id === id
          ? { ...file, progress: 0, status: "uploading", error: undefined, failAt: undefined }
          : file,
      ),
    );

  return <UploadProgress files={files} onRetry={retry} className="w-[380px]" />;
}
