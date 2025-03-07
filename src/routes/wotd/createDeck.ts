import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import CreateDeckRequestBodyType from "../../schemas/CreateDeckRequestBody";
import prisma from "../../database";

const url = "/create-deck";
const method = "POST";
const schema = {
  operationId: "createDeck",
  tags: ["WOTD"],
  summary: "Creates a new deck for a user to organize words in.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { deckName } = request.body as CreateDeckRequestBodyType;

  const userKey = request.user.userKey;

  if (deckName.length > 255) {
    return reply.status(400).send({
      error: "Deck name too long",
      message: "Deck name must be <= 255 characters",
    });
  }

  const deckWithNameAlreadyExistsForUser = !!(await prisma.deck.findFirst({
    where: {
      name: deckName,
      userKey: userKey,
    },
  }));

  if (deckWithNameAlreadyExistsForUser) {
    return reply.status(400).send({
      error: "Deck already exists",
      message: "You already have a deck with that name.",
    });
  }

  await prisma.deck.create({
    data: {
      userKey,
      name: deckName,
    },
  });

  return reply.status(201).send();
};

const createDeck = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: CreateDeckRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("CreateDeckRequestBody"),
      response: {
        201: $ref("GenericResponse"),
        400: $ref("GenericResponse"),
      },
    },
    preHandler: [fastify.authenticate],
    handler,
    url,
  });
};

export default createDeck;
