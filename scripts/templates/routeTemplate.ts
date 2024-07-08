import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";

const url = "/fetch-wotd";
const method = "GET";
const schema = {
  operationId: "fetchWOTD",
  tags: ["WOTD"],
  summary: "Given a date, fetches the word of the day for that date",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {};

const fetchWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: {} }>({
    method,
    schema: {
      ...schema,
    },
    handler,
    url,
  });
};

export default fetchWOTD;
