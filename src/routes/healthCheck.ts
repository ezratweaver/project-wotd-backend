import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";

const url = "/";
const method = "GET";
const schema = {
  operationId: "healthCheck",
  tags: ["System"],
  summary: "Returns the system health",
} as FastifySchema;

const handler = async (_: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({
    state: "online",
  });
};

const healthCheck = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    handler,
    url,
    schema,
  });
};

export default healthCheck;
