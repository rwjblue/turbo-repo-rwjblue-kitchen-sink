import fp from "fastify-plugin";
import { type FastifyPluginCallback } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
const plugin: FastifyPluginCallback = fp<SupportPluginOptions>(
  async (fastify, opts) => {
    fastify.decorate("someSupport", function () {
      return "hugs";
    });
  },
);
export default plugin;

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    someSupport(): string;
  }
}
