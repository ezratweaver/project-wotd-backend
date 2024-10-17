import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";

const url = "/add-wotd";
const method = "POST";
const schema = {
  operationId: "addWOTD",
  tags: ["Admin"],
  summary:
    "Add a word of the day to be put into the database, for users to learn and review.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {};

const addWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: {} }>({
    method,
    schema: {
      ...schema,
    },
    handler,
    url,
  });
};

export default addWOTD;
