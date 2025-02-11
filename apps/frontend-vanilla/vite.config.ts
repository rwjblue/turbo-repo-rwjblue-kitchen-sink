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
});
export default config;
