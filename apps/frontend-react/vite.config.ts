import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

const config: UserConfig = defineConfig({
  plugins: [react()],
  server: {
    port: 6000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
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
    coverage: {
      provider: "v8",
    },
  },
});
export default config;
