import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ⬇⬇ Increase bundle size limit here
  build: {
    chunkSizeWarningLimit: 5000, // 
  },
});
