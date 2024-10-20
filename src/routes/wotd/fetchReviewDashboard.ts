import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import prisma from "../../database";
import { $ref } from "../../app";
import { isDateXDaysFromNowOrFarther } from "../../helper/dateHelpers";

const url = "/fetch-review-dashboard";
const method = "GET";
const schema = {
  operationId: "fetchReviewDashboard",
  tags: ["WOTD"],
  summary:
    "Returns all learned words from userKey found in session ordered by desc date. Along with the amount of words due for review.",
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
      lastReviewed: "asc",
    },
  });

  const learnedWords = learnedWordsQuery
    .map((learnedWord) => learnedWord.word)
    .filter((word) => word !== null);

  let wordsDueCount = 0;

  for (const learnedWord of learnedWordsQuery) {
    if (!learnedWord.lastReviewed && learnedWord.word) {
      wordsDueCount += 1;
    }
  }

  for (const learnedWord of learnedWordsQuery) {
    if (
      learnedWord.lastReviewed &&
      learnedWord.word &&
      isDateXDaysFromNowOrFarther(learnedWord.lastReviewed, -3)
    ) {
      wordsDueCount += 1;
    }
  }

  return reply.status(202).send({
    words: learnedWords,
    wordsToReview: wordsDueCount,
  });
};

const fetchReviewDashboard = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      response: {
        202: $ref("FetchReviewDashboardResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default fetchReviewDashboard;
