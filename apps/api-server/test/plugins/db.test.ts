import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import DatabasePlugin from "../../src/plugins/db.ts";

describe("database plugin", () => {
  it("decorates fastify with db instance", async () => {
    const fastify = Fastify();
    void fastify.register(DatabasePlugin);
    await fastify.ready();

    expect(fastify.db).toBeDefined();
    expect(typeof fastify.db.createPoll).toBe("function");
  });
});
