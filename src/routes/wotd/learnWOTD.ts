import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import LearnWOTDRequestBodyType from "../../schemas/LearnWOTDRequestBody";
import { $ref } from "../../app";

const url = "/learn-wotd";
const method = "POST";
const schema = {
  operationId: "fetchWOTD",
  tags: ["WOTD"],
  summary:
    "Updates a WOTD to be marked as learned, for the userKey in the jwt session provided.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {};

const learnWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: LearnWOTDRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("LearnWOTDRequestBody"),
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default learnWOTD;
