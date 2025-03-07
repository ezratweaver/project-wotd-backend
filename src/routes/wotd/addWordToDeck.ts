import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import AddWordToDeckRequestBodyType from "../../schemas/AddWordToDeckRequestBody";
import prisma from "../../database";

const url = "/add-word-to-deck";
const method = "POST";
const schema = {
  operationId: "addWordToDeck",
  tags: ["WOTD"],
  summary: "Adds given word to a choosen deck created by the user.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { deckKey, word } = request.body as AddWordToDeckRequestBodyType;

  const userKey = request.user.userKey;

  const wordExists = await prisma.wordOfTheDay.findUnique({
    where: {
      word,
    },
  });

  if (!wordExists) {
    return reply.status(400).send({
      error: "Word doesn't exist",
      message: "Word provided does not exist as a word of the day.",
    });
  }

  const deckExists = await prisma.deck.findUnique({
    where: {
      userKey,
      deckKey,
    },
  });

  if (!deckExists) {
    return reply.status(400).send({
      error: "Deck doesn't exist",
      message: "Deck provided does not exist.",
    });
  }

  await prisma.deckWord.create({
    data: {
      deckKey,
      wotdKey: wordExists.wotdKey,
    },
  });

  return reply.status(201).send();
};

const addWordToDeck = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: AddWordToDeckRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("AddWordToDeckRequestBody"),
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

export default addWordToDeck;
