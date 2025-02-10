import * as path from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import { type FastifyPluginAsync } from "fastify";
import { fileURLToPath } from "node:url";
import type { DBOptions } from "@repo/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDatabaseConfig(): DBOptions {
  switch (process.env.NODE_ENV) {
    case "test":
      return {
        memory: true,
      };
    case "production":
    case "development":
    default: {
      const env = process.env.NODE_ENV ?? "development";

      const filename =
        process.env.DB_PATH ??
        path.join(__dirname, `../../../.db/${env}.sqlite`);

      return {
        filename,
        memory: false,
      };
    }
  }
}
export type AppOptions = {
  db: DBOptions;
} & Partial<AutoloadPluginOptions>;

const options: AppOptions = {
  db: getDatabaseConfig(),
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
    forceESM: true,
  });
};

export default app;

export { app, options };
