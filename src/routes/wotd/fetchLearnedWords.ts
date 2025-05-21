import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import prisma from "../../database";
import { $ref } from "../../app";

const url = "/fetch-learned-words";
const method = "GET";
const schema = {
  operationId: "fetchLearnedWords",
  tags: ["WOTD"],
  summary: "Returns all words learned by the user.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userKey = request.user.userKey;

  const allLearnedWords = await prisma.userLearned.findMany({
    where: {
      userKey,
    },
    include: {
      word: true,
    },
  });

  return reply
    .status(200)
    .send({ words: allLearnedWords.map((obj) => obj.word) });
};

const fetchLearnedWords = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: {} }>({
    method,
    schema: {
      ...schema,
      response: {
        200: $ref("FetchLearnedWordsResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default fetchLearnedWords;
