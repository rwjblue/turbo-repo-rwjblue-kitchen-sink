// This file contains code that we reuse between our tests.
import helper from "fastify-cli/helper.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { FastifyInstance } from "fastify";
import { type TestContext } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AppPath = path.join(__dirname, "..", "src", "app.ts");

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {
    skipOverride: true, // Register our application with fastify-plugin
  };
}

export interface ServerContext {
  server: FastifyInstance;
}

export type TestContextWithServer = TestContext & ServerContext;

async function setupServer(context: ServerContext): Promise<void> {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const server = await helper.build(argv, config());

  context.server = server;
}

async function teardownServer(context: ServerContext): Promise<void> {
  if (context.server) {
    await context.server.close();
  }
}

export { config, setupServer, teardownServer };
