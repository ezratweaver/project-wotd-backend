import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import DeleteDeckRequestParamsType from "../../schemas/DeleteDeckRequestParams";

const url = "/delete-deck/:deckName";
const method = "DELETE";
const schema = {
  operationId: "deleteDeck",
  tags: ["WOTD"],
  summary: "Delete a deck created by a user.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { deckName } = request.params as DeleteDeckRequestParamsType;

  const userKey = request.user.userKey;

  const deckExists = await prisma.deck.findFirst({
    where: {
      name: deckName,
      userKey,
    },
  });

  if (!deckExists) {
    return reply.status(404).send({
      error: "Deck doesn't exist",
      message: "Deck provided does not exist.",
    });
  }

  await prisma.deck.deleteMany({
    where: {
      name: deckName,
      userKey,
    },
  });

  return reply.status(204).send();
};

const deleteDeck = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      params: $ref("DeleteDeckRequestParams"),
      response: {
        204: {},
        404: $ref("GenericResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default deleteDeck;
