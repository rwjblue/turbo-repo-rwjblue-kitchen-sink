declare module "fastify-cli/helper.js" {
  import type { FastifyInstance } from "fastify";

  namespace helper {
    function build(
      args: Array<string>,
      additionalOptions?: Object,
      serverOptions?: Object,
    ): FastifyInstance;
  }

  export default helper;
}
