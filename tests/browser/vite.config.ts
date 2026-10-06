import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Frontend only: never start Express, connect to a database, or load payment secrets.
export default defineConfig({
  root: path.resolve("client"),
  envDir: path.resolve("tests/browser"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("client/src"),
      "@shared": path.resolve("shared"),
      "@assets": path.resolve("attached_assets"),
    },
  },
  server: { host: "127.0.0.1", port: 5174, strictPort: true },
});
