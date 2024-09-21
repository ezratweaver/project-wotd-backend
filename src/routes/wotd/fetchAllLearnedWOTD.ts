import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import prisma from "../../database";
import { $ref } from "../../app";

const url = "/fetch-all-learned-wotd";
const method = "GET";
const schema = {
  operationId: "fetchAllLearnedWOTD",
  tags: ["WOTD"],
  summary:
    "Returns all learned words from userKey found in session ordered by desc date.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userKey = request.user.userKey;

  const learnedWordsQuery = await prisma.userLearned.findMany({
    where: {
      userKey,
    },
    include: {
      word: true,
    },
    orderBy: {
      word: {
        date: "desc",
      },
    },
  });

  const learnedWords = learnedWordsQuery
    .map((learnedWord) => learnedWord.word)
    .filter((word) => word !== null);

  return reply.status(201).send({
    words: learnedWords,
  });
};

const fetchAllLearnWOTD = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      response: {
        201: $ref("FetchAllLearnedWOTDResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default fetchAllLearnWOTD;
