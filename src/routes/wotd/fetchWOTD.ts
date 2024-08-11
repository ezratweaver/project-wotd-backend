import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import FetchWOTDRequestParamsType from "../../schemas/FetchWOTDRequestParams";
import { dateWithoutHours, dateWithOffset } from "../../helper/dateHelpers";

const url = "/fetch-wotd/:wordDate";
const method = "GET";
const schema = {
  operationId: "fetchWOTD",
  tags: ["WOTD"],
  summary: "Given a date, fetches the word of the day for that date",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { wordDate } = request.params as FetchWOTDRequestParamsType;

  const userKey = request.user.userKey;

  const wordDateWithoutHours = dateWithoutHours(wordDate);

  const nextWordDate = dateWithoutHours(dateWithOffset(1, wordDate));
  const prevWordDate = dateWithoutHours(dateWithOffset(-1, wordDate));

  const foundWord = await prisma.wordOfTheDay.findFirst({
    where: {
      date: wordDateWithoutHours,
    },
  });

  const nextWord = await prisma.wordOfTheDay.count({
    where: {
      date: nextWordDate,
    },
  });

  const prevWord = await prisma.wordOfTheDay.count({
    where: {
      date: prevWordDate,
    },
  });

  const userLearned = await prisma.userLearned.findFirst({
    where: {
      userKey,
      wotdKey: foundWord?.wotdKey,
    },
  });

  return reply.status(200).send({
    wordData: foundWord ? { ...foundWord, learned: !!userLearned } : undefined,
    wordNextDay: nextWord > 0,
    wordPrevDay: prevWord > 0,
  });
};

const fetchWOTD = async (fastify: FastifyInstance) => {
  fastify.route<{ Params: FetchWOTDRequestParamsType }>({
    method,
    schema: {
      ...schema,
      params: $ref("FetchWOTDRequestParams"),
      response: {
        200: $ref("FetchWOTDResponse"),
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default fetchWOTD;
