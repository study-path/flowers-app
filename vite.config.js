import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  server: {
    // In development the API runs separately (npm run dev:api).
    proxy: {
      "/api": `http://localhost:${process.env.API_PORT ?? 3001}`,
    },
  },
});
