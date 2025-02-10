import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import Support from "../../src/plugins/support.ts";

describe("support plugin", () => {
  it("support works standalone", async () => {
    const fastify = Fastify();
    void fastify.register(Support);
    await fastify.ready();

    expect(fastify.someSupport()).toBe("hugs");
  });
});
