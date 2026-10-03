import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths so the build works from any sub-path (GitHub Pages, S3, etc.).
  base: "./",
  plugins: [react(), tailwindcss()],
});
