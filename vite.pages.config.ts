// Static build of the client-only app, used for GitHub Pages (npm run build:pages).
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "static",
  base: "./",
  publicDir: "../public",
  plugins: [react()],
  css: { postcss: path.resolve(import.meta.dirname) },
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  build: { outDir: "../dist-pages", emptyOutDir: true },
});
