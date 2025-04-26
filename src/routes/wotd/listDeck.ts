import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import ListDeckRequestParamsType from "../../schemas/ListDeckRequestParams";

const url = "/list-deck/:deckName";
const method = "GET";
const schema = {
  operationId: "listDeck",
  tags: ["WOTD"],
  summary: "Get a breakdown of a specified deck by deckKey",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { deckName } = request.params as ListDeckRequestParamsType;

  const userKey = request.user.userKey;

  const deck = await prisma.deck.findFirst({
    where: {
      name: deckName,
      userKey,
    },
    include: {
      words: {
        include: {
          word: true,
        },
      },
    },
  });

  if (!deck) {
    return reply.status(404).send({
      error: "Deck not found",
      message: "Deck not found with given deckKey.",
    });
  }

  const usersLearnedWords = (
    await prisma.userLearned.findMany({
      where: {
        userKey,
      },
      select: { wotdKey: true },
    })
  ).map((result) => result.wotdKey);

  return reply.status(200).send({
    name: deck.name,
    words: deck.words.map((word) => ({
      ...word.word,
      learned: word.wotdKey in usersLearnedWords,
    })),
  });
};

const listDeck = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      params: $ref("ListDeckRequestParams"),
      response: {
        200: $ref("ListDeckResponse"),
        404: $ref("GenericResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default listDeck;
