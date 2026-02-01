import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // This tells Rollup exactly where to find the entry point
      input: resolve(__dirname, "index.html"),
    },
  },
});
