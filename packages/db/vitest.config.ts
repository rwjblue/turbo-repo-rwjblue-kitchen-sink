import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
  test: {
    globals: false,
    coverage: {
      provider: "v8",
    },
  },
});

export default config;
