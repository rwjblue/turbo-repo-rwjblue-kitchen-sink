import { type FastifyPluginAsync } from "fastify";

const testHelpers: FastifyPluginAsync = async (fastify, opts) => {
  if (process.env.NODE_ENV !== "test") {
    return;
  }

  fastify.post("/api/test/reset-db", async (request, reply) => {
    await fastify.db.reset();
    return { success: true };
  });
};

export default testHelpers;
