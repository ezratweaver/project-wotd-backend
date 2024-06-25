import { FastifyInstance, FastifyPluginOptions } from "fastify";

const healthCheck = async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    return { status: "OK" };
  });
};

export default healthCheck;
