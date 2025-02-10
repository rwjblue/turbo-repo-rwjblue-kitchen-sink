declare module "fastify-cli/helper.js" {
  import type { FastifyInstance } from "fastify";

  namespace helper {
    function build(
      args: Array<string>,
      additionalOptions?: object,
      serverOptions?: object,
    ): FastifyInstance;
  }

  export default helper;
}
