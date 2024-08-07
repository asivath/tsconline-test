import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: process.env.CLOSE_BROWSER !== "true",
    port: 5173,
    host: "0.0.0.0"
  },
  worker: {
    format: "es"
  }
});
