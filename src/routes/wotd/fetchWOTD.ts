import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import FetchWOTDRequestParamsType from "../../schemas/FetchWOTDRequestParams";

const url = "/fetchWOTD/:wordDate";
const method = "GET";
const schema = {
  operationId: "fetchWOTD",
  tags: ["WOTD"],
  summary: "Given a date, fetches the word of the day for that date",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { wordDate } = request.params as FetchWOTDRequestParamsType;

  const wordDateWithoutHours = new Date(wordDate);

  wordDateWithoutHours.setHours(0, 0, 0, 0);

  const foundWord = await prisma.wordOfTheDay.findFirst({
    where: {
      date: wordDateWithoutHours,
    },
  });

  if (!foundWord) {
    return reply.status(204).send();
  }

  return reply.status(200).send(foundWord);
};

const fetchWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Params: FetchWOTDRequestParamsType }>({
    method,
    schema: {
      ...schema,
      params: $ref("FetchWOTDRequestParams"),
      response: {
        204: {
          type: "null",
        },
        200: $ref("FetchWOTDResponse"),
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default fetchWOTD;
