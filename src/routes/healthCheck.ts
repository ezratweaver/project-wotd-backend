import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const url = "/";
const method = "GET";

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({
    state: "online",
  });
};

const healthCheck = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    handler,
    url,
  });
};

export default healthCheck;
