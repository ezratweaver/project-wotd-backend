import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import RenameDeckRequestBodyType from "../../schemas/RenameDeckRequestBody";

const url = "/rename-deck";
const method = "PATCH";
const schema = {
  operationId: "renameDeck",
  tags: ["WOTD"],
  summary: "Rename display name of a deck, created by a user.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { oldDeckName, newDeckName } =
    request.body as RenameDeckRequestBodyType;

  const userKey = request.user.userKey;

  const deckExists = await prisma.deck.findFirst({
    where: {
      name: oldDeckName,
      userKey,
    },
  });

  if (!deckExists) {
    return reply.status(404).send({
      error: "Deck doesn't exist",
      message: "Deck provided does not exist.",
    });
  }

  await prisma.deck.updateMany({
    where: {
      name: oldDeckName,
    },
    data: {
      name: newDeckName,
    },
  });

  return reply.status(200).send();
};

const renameDeck = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      body: $ref("RenameDeckRequestBody"),
      response: {
        200: {},
        400: $ref("GenericResponse"),
        404: $ref("GenericResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default renameDeck;
