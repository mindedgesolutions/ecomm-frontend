import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        timeout: 60000,
      },
    },
  },
  assetsInclude: ["**/*.xlsx", "**/*.csv"],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  build: { chunkSizeWarningLimit: 1600 },
});
