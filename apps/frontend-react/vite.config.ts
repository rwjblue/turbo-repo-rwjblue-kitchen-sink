import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

const config: UserConfig = defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "#": "/src",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: false,
  },
});
export default config;
