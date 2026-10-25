import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: "all",
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
