import { defineConfig, type UserConfig } from "vite";

const config: UserConfig = defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
export default config;
