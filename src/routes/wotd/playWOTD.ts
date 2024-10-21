import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import PlayWOTDRequestParamsType from "../../schemas/PlayWOTDRequestParams";
import { $ref } from "../../app";
import prisma from "../../database";

const url = "/play-wotd/:word";
const method = "GET";
const schema = {
  operationId: "playWOTD",
  tags: ["WOTD"],
  summary: "Returns binary audio of pronuciation of a given word.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(501).send();
  const { word } = request.params as PlayWOTDRequestParamsType;

  const wordFromDB = await prisma.wordOfTheDay.findUnique({
    where: {
      word,
    },
  });

  if (!wordFromDB) return reply.status(204).send();
};

const playWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Params: PlayWOTDRequestParamsType }>({
    method,
    schema: {
      ...schema,
      params: $ref("PlayWOTDRequestParams"),
      response: { 200: $ref("PlayWOTDResponse") },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default playWOTD;
