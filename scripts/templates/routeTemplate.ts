import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";

const url = "/";
const method = "GET";
const schema = {
  operationId: "",
  tags: [""],
  summary: "",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {};

const routeName = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: {} }>({
    method,
    schema: {
      ...schema,
    },
    handler,
    url,
  });
};

export default routeName;
