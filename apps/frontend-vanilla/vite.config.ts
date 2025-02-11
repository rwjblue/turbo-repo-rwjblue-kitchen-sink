import { defineConfig, type UserConfig } from "vite";

const config: UserConfig = defineConfig({
  server: {
    port: 7000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
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
