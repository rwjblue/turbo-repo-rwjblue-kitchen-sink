import fp from "fastify-plugin";
import { type FastifyPluginCallback } from "fastify";
import { setup, type Database, type DBOptions } from "@repo/db";

export interface DatabasePluginOptions {
  db?: DBOptions;
}

const plugin: FastifyPluginCallback = fp<DatabasePluginOptions>(
  async (fastify, opts) => {
    const dbOptions = opts.db ?? { memory: true };

    fastify.log.info(
      {
        memory: dbOptions.memory,
        filename: dbOptions.filename,
      },
      "Initializing database connection",
    );
    // Setup database with provided options or defaults
    const db = setup(dbOptions);

    // Decorate fastify with the database instance
    fastify.decorate("db", db);

    // Close database connection when fastify closes
    fastify.addHook("onClose", async (instance) => {
      await instance.db.db.close();
    });
  },
  {
    name: "db-plugin",
  },
);

export default plugin;

// Add types for the fastify instance decoration
declare module "fastify" {
  export interface FastifyInstance {
    db: Database;
  }
}
