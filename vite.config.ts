import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths so the build works from any sub-path (GitHub Pages, S3, etc.).
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // The Framer versions of components import "framer"; a small stand-in lets
      // tests and dev previews render them outside Framer.
      framer: fileURLToPath(new URL("./src/registry/framer-shim.ts", import.meta.url)),
    },
  },
  build: {
    // Every component's source ships in the main bundle so Copy is instant
    // (clipboard writes must happen inside the click), which puts it past Vite's 500 kB default.
    chunkSizeWarningLimit: 1024,
  },
});
