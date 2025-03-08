import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import ListDeckRequestParamsType from "../../schemas/ListDeckRequestParams";

const url = "/list-deck/:deckKey";
const method = "GET";
const schema = {
  operationId: "listDeck",
  tags: ["WOTD"],
  summary: "Get a breakdown of a specified deck by deckKey",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { deckKey } = request.params as ListDeckRequestParamsType;

  const userKey = request.user.userKey;

  const deck = await prisma.deck.findUnique({
    where: {
      deckKey,
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

  return reply
    .status(200)
    .send({ name: deck.name, words: deck.words.map((word) => word.word) });
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
