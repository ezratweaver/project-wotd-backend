import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import prisma from "../../database";
import { queryWordsReadyForReview } from "./fetchWordsToReview";

const url = "/mark-words-reviewed";
const method = "POST";
const schema = {
  operationId: "markWordsReviewed",
  tags: ["WOTD"],
  summary: "Marks words ready for review as last reviewed at current date.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const userKey = request.user.userKey;

  const wordsReviewed = await queryWordsReadyForReview(prisma, userKey);

  for (const word of wordsReviewed) {
    await prisma.userLearned.updateMany({
      where: {
        wotdKey: word.wotdKey,
        userKey,
      },
      data: {
        lastReviewed: new Date(),
      },
    });
  }

  return reply.status(200).send();
};

const markWordsReviewed = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      response: {
        200: {},
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default markWordsReviewed;
