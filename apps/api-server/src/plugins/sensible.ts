import fp from "fastify-plugin";
import { type FastifyPluginCallback } from "fastify";
import sensible, { type FastifySensibleOptions } from "@fastify/sensible";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const plugin: FastifyPluginCallback = fp<FastifySensibleOptions>(
  async (fastify) => {
    fastify.register(sensible);
  },
);

export default plugin;
